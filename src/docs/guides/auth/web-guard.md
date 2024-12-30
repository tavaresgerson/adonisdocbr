# Web guard

O web guard usa sessões/cookies para fazer login de um usuário. Você deve usar o web guard ao **criar um aplicativo renderizado pelo servidor** ou para **uma API com um cliente primário em execução no mesmo domínio/subdomínio**.

::: info NOTA
O web guard depende do pacote `@adonisjs/session`. Certifique-se de instalá-lo e [configurá-lo](../http/session.md) primeiro.
:::

## Login
Você pode fazer login do usuário usando o método `auth.attempt` ou `auth.login`. O método `auth.attempt` pesquisa o usuário no banco de dados e verifica sua senha.

- Se as credenciais do usuário estiverem corretas, ele chamará internamente o método `auth.login` e criará a sessão.
[InvalidCredentialsException](https://github.com/adonisjs/auth/blob/develop/src/Exceptions/InvalidCredentialsException.ts) é gerado.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.post('login', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')

  try {
    await auth.use('web').attempt(email, password)  // [!code highlight]
    response.redirect('/dashboard')                 // [!code highlight]
  } catch {
    return response.badRequest('Invalid credentials')
  }
})
```

Você pode manipular manualmente a exceção e retornar uma resposta, ou deixar que a exceção se automanipule e crie uma resposta usando [negociação de conteúdo](https://github.com/adonisjs/auth/blob/develop/src/Exceptions/InvalidCredentialsException.ts#L87-L105).

### `auth.login`
Se a estratégia de pesquisa `auth.attempt` não se encaixar no seu caso de uso, você pode pesquisar manualmente o usuário, verificar sua senha e chamar o método `auth.login` para criar uma sessão para ele.

```ts
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import Hash from '@ioc:Adonis/Core/Hash'

Route.post('login', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')

  // Lookup user manually
  const user = await User
    .query()
    .where('email', email)
    .where('tenant_id', getTenantIdFromSomewhere)
    .whereNull('is_deleted')
    .firstOrFail()

  // Verify password
  if (!(await Hash.verify(user.password, password))) {
    return response.badRequest('Invalid credentials')
  }

  // Create session
  await auth.use('web').login(user)
})
```

### `auth.loginViaId`
Semelhante ao método `auth.login`, o método `loginViaId` cria a sessão de login para o usuário usando seu id.

```ts
// Login user using the id
await auth.use('web').loginViaId(1)
```

### Usando a opção lembrar de mim
Todos os métodos de login `attempt`, `login` e `loginViaId` aceitam um valor booleano como o último argumento para criar um cookie lembrar de mim para o usuário conectado.

```ts
const rememberMe = true

await auth.use('web').attempt(email, password, rememberMe)
await auth.use('web').login(user, rememberMe)
await auth.use('web').loginViaId(1, rememberMe)
```

Se a sessão do usuário expirar, o cookie lembrar de mim será usado para criar outra sessão para o usuário. O token lembrar de mim é armazenado dentro da própria tabela `users` e atualmente apenas um token lembrar de mim é permitido.

## Autentique solicitações subsequentes
Depois que o usuário estiver logado com a sessão de login, você pode autenticar as solicitações subsequentes usando o método `auth.authenticate`. Ele verificará a sessão do usuário e pesquisará o usuário dentro do banco de dados.

A [AuthenticationException](https://github.com/adonisjs/auth/blob/develop/src/Exceptions/AuthenticationException.ts) é gerada se a sessão for inválida ou se o usuário não existir dentro do banco de dados.

Caso contrário, você pode acessar o usuário logado usando a propriedade `auth.user`.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('dashboard', async ({ auth }) => {
  await auth.use('web').authenticate()
  console.log(auth.use('web').user!)
})
```

Chamar esse método manualmente dentro de cada rota não é prático e, portanto, você pode usar o middleware auth armazenado dentro do arquivo `./app/Middleware/Auth.ts`.

* [Saiba mais sobre o middleware auth →](./middleware.md)

## Logout
Você pode sair do usuário chamando o método `auth.logout`. Ele destruirá a sessão de login do usuário e o cookie "lembre-se de mim". O token "lembre-se de mim" dentro de `users` também é definido como nulo.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.post('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  response.redirect('/login')
})
```

## Outros métodos/propriedades
A seguir está a lista de métodos/propriedades disponíveis para o `web` guard.

### `viaRemember`
Descubra se a solicitação atual é autenticada usando o token "lembre-se de mim" ou não. Isso será definido como `true` quando:

- Você fez login inicialmente no usuário com o token "lembre-se de mim".
- A sessão de login expirou durante a solicitação atual e o cookie "lembre-se de mim" estava presente e válido para fazer login no usuário.

```ts
auth.use('web').viaRemember
```

### `isLoggedOut`
Descubra se o usuário foi desconectado durante a solicitação atual. O valor será `true` logo após chamar o método `auth.logout`.

```ts
await auth.use('web').logout()

auth.use('web').isLoggedOut
```

### `isLoggedIn`
Descubra se o usuário está conectado ou não. O valor é `true` logo após chamar o método `auth.login` ou quando a verificação `auth.authenticate` passa.

```ts
await auth.use('web').authenticate()
auth.use('web').isLoggedIn // true
```

```ts
await auth.use('web').attempt(email, password)
auth.use('web').isLoggedIn // true
```

### `isGuest`
Descubra se o usuário é um convidado (ou seja, não conectado). O valor é sempre o oposto do sinalizador `isLoggedIn`.

### `isAuthenticated`
Descubra se a solicitação atual passou na verificação de autenticação. Este sinalizador é diferente do sinalizador `isLoggedIn` e não é definido como true durante a chamada `auth.login`.

```ts
await auth.use('web').authenticate()
auth.use('web').isAuthenticated // true
```

```ts
await auth.use('web').attempt(email, password)
auth.use('web').isAuthenticated // false
```

### `authenticationAttempted`
Descubra se uma tentativa de autenticação da solicitação atual foi feita. O valor é definido como `true` quando você chama o método `auth.authenticate`

```ts
auth.use('web').authenticationAttempted // false

await auth.use('web').authenticate()
auth.use('web').authenticationAttempted // true
```

### `provider`
Referência ao provedor de usuário subjacente usado pelo guard.

### `verifyCredentials`
Um método para verificar as credenciais do usuário. O método `auth.attempt` usa este método por baixo dos panos. A exceção [InvalidCredentialsException](https://github.com/adonisjs/auth/blob/develop/src/Exceptions/InvalidCredentialsException.ts) é gerada quando as credenciais são inválidas.

```ts
try {
  await auth.use('web').verifyCredentials(email, password)
} catch (error) {
  console.log(error)
}
```

### `check`
O método é o mesmo que o método `auth.authenticate`. No entanto, ele não gera nenhuma exceção quando a solicitação não é autenticada. Pense nisso como uma tentativa opcional de verificar se o usuário está logado ou não.

```ts
await auth.use('web').check()

if (auth.use('web').isLoggedIn) {
}
```
