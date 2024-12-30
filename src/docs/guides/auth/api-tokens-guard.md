# Tokens de API

A proteção de API usa o **token de acesso opaco** com suporte de banco de dados para autenticar as solicitações do usuário. Você pode querer usar a proteção de API ao criar uma API que deve ser acessada por um cliente de terceiros ou para qualquer outro sistema que não suporte cookies.

## Armazenamento de tokens
A proteção de tokens de API permite que você armazene tokens em um banco de dados SQL ou armazene-os dentro do Redis. Ambas as opções de armazenamento têm seus próprios casos de uso.

### Armazenamento de SQL
O método de armazenamento de SQL é adequado quando os tokens de API não são o modo principal de autenticação. Por exemplo: você pode querer permitir que os usuários do seu aplicativo criem tokens de acesso pessoais (assim como o GitHub faz) e autentiquem as solicitações de API usando isso.

Neste cenário, você não gerará muitos tokens em massa e também a maioria dos tokens viverá para sempre.

A configuração dos tokens é gerenciada dentro do arquivo `config/auth.ts` sob o objeto de configuração de proteção.

```ts
{
  api: {
    driver: 'oat',
    provider: {
      driver: 'lucid',
      identifierKey: 'id',
      uids: ['email'],
      model: () => import('App/Models/User'),
    },
    tokenProvider: {          // [!code highlight]
      type: 'api',            // [!code highlight]
      driver: 'database',     // [!code highlight]
      table: 'api_tokens',    // [!code highlight]
      foreignKey: 'user_id',  // [!code highlight]
    },                        // [!code highlight]
  }
}
```

#### `type`
A propriedade type contém o tipo do token que você está gerando. Certifique-se de dar a ele um nome exclusivo quando tiver vários guardas de token de API em uso.

O nome exclusivo garante que dois guardas gerando o token para o mesmo usuário não tenham sobreposição ou conflitos.

#### `driver`
O nome do driver. Ele sempre será `database` ao armazenar os tokens dentro de uma tabela SQL.

#### `table`
A tabela do banco de dados a ser usada para armazenar os tokens. Durante o processo de configuração inicial, o AdonisJS criará o arquivo de migração para a tabela de tokens. No entanto, você também pode criar uma migração manualmente e copiar o conteúdo do [arquivo stub](https://github.com/adonisjs/auth/blob/develop/templates/migrations/api_tokens.txt)

#### `foreignKey`
A chave estrangeira para construir o relacionamento entre o usuário e o token. Mais tarde, isso permitirá que você também liste todos os tokens para um determinado usuário.

### Armazenamento Redis
O armazenamento Redis é adequado quando os tokens de API são o modo principal de autenticação. Por exemplo: você autentica as solicitações do seu aplicativo móvel usando autenticação baseada em token.

Neste cenário, você também desejaria que os tokens expirassem após um determinado período de tempo e o Redis pode limpar automaticamente os tokens expirados de seu armazenamento.

A configuração para tokens é gerenciada dentro do arquivo `config/auth.ts` sob o objeto de configuração guard.

```ts
{
  api: {
    driver: 'oat',
    provider: {
      driver: 'lucid',
      identifierKey: 'id',
      uids: ['email'],
      model: () => import('App/Models/User'),
    },
    tokenProvider: {            // [!code highlight]
      type: 'api',              // [!code highlight]
      driver: 'redis',          // [!code highlight]
      redisConnection: 'local', // [!code highlight]
      foreignKey: 'user_id',    // [!code highlight]
    },                          // [!code highlight]
  }
}
```

#### `type`
A propriedade type contém o tipo do token que você está gerando. Certifique-se de dar a ele um nome exclusivo quando tiver vários guardas de token de API em uso.

O nome exclusivo garante que dois guardas gerando o token para o mesmo usuário não tenham sobreposição ou conflitos.

#### `driver`
O nome do driver. Ele sempre será `redis` ao armazenar os tokens em um banco de dados redis.

#### `redisConnection`
Referência a uma conexão definida dentro do arquivo `config/redis.ts`. Certifique-se de ler o [guia redis](/docs/digging-deeper/redis.md) para a configuração inicial.

#### `foreignKey`
A chave estrangeira para construir o relacionamento entre o usuário e o token.

## Gerando tokens
Você pode gerar um token de API para um usuário usando o método `auth.generate` ou `auth.attempt`. O método `auth.attempt` pesquisa o usuário no banco de dados e verifica sua senha.

- Se as credenciais do usuário estiverem corretas, ele chamará internamente o método `auth.generate` e retornará o token.
[InvalidCredentialsException](https://github.com/adonisjs/auth/blob/develop/src/Exceptions/InvalidCredentialsException.ts) é gerado.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.post('login', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')

  try {
    const token = await auth.use('api').attempt(email, password)  // [!code highlight]
    return token                                                  // [!code highlight]
  } catch {
    return response.unauthorized('Invalid credentials')
  }
})
```

Você pode manipular manualmente a exceção e retornar uma resposta ou deixar que a exceção se manipule e crie uma resposta usando [negociação de conteúdo](https://github.com/adonisjs/auth/blob/develop/src/Exceptions/InvalidCredentialsException.ts#L87-L105).

### `auth.generate`
Se a estratégia de pesquisa `auth.attempt` não se encaixar no seu caso de uso, você pode pesquisar manualmente o usuário, verificar sua senha e chamar o método `auth.generate` para gerar um token para ele.

::: info NOTA
O método `auth.login` é um alias para o método `auth.generate`.
:::

```ts
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import Hash from '@ioc:Adonis/Core/Hash'

Route.post('login', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')

  // Pesquisar usuário manualmente
  const user = await User
    .query()
    .where('email', email)
    .where('tenant_id', getTenantIdFromSomewhere)
    .whereNull('is_deleted')
    .firstOrFail()

  // Verificar senha
  if (!(await Hash.verify(user.password, password))) {
    return response.unauthorized('Invalid credentials')
  }

  // Gerar token
  const token = await auth.use('api').generate(user)
})
```

### Gerenciando a expiração de tokens
Você também pode definir a expiração do token no momento da geração.

```ts
await auth.use('api').attempt(email, password, {
  expiresIn: '7 days'
})

await auth.use('api').generate(user, {
  expiresIn: '30 mins'
})
```

O driver redis excluirá automaticamente os tokens expirados. No entanto, para armazenamento SQL, você terá que escrever um script personalizado e excluir o token com o carimbo de data/hora `expires_at` menor que o de hoje.

## Propriedades do token
A seguir está a lista de propriedades no objeto de token gerado usando o método `auth.generate`.

### `type`
O token é sempre definido como `'bearer'`.

### `user`
O usuário para o qual o token foi gerado. O valor do usuário depende do provedor de usuário subjacente usado pelo guard.

### `expiresAt`
Uma instância do [luxon Datetime](https://moment.github.io/luxon/api-docs/index.html#datetime) representando um tempo estático no qual o token irá expirar. Só existe se tiver definido explicitamente a expiração para o token.

### `expiresIn`
Tempo em segundos após o qual o token irá expirar. É um valor estático e não muda com o passar do tempo.

### `meta`
Quaisquer metadados anexados ao token. Você pode definir os metadados no objeto options no momento da geração do token.

::: info NOTA
Os drivers de armazenamento subjacentes persistirão os metadados no banco de dados. No caso de SQL, certifique-se de também criar as colunas necessárias.
:::

```ts
await auth.use('api').attempt(email, password, {
  ip_address: '192.168.1.0'
})
```

### `name`
O nome a ser associado ao token. Isso geralmente é útil quando você permite que os usuários do seu aplicativo gerem tokens de acesso pessoais (assim como o GitHub faz) e dá a eles um nome memorável.

A propriedade name só existe quando você a define no momento da geração do token.

```ts
await auth.use('api').attempt(email, password, {
  name: 'For the CLI app'
})
```

### `token`
O valor do token gerado. Você deve compartilhar esse valor com o cliente e o cliente deve armazená-lo com segurança.

Você não pode obter acesso a esse valor mais tarde, pois o valor armazenado dentro do banco de dados é um hash do token que não pode ser convertido em um valor simples.

### `tokenHash`
O valor armazenado dentro do banco de dados. Certifique-se de nunca compartilhar o hash do token com o cliente.

Durante a solicitação `auth.authenticate`, compararemos o valor fornecido pelo cliente com o hash do token.

### `toJSON`
Converte o token em um objeto que você pode enviar de volta em resposta a uma solicitação. O método `toJSON` contém as seguintes propriedades.

```ts
{
  type: 'bearer',
  token: 'the-token-value',
  expires_at: '2021-04-28T17:43:37.235+05:30'
  expires_in: 604800
}
```

## Autenticar solicitações subsequentes
Depois que o cliente recebe o token da API, ele deve enviá-lo de volta em cada solicitação HTTP sob o cabeçalho `Authorization`. O cabeçalho deve ser formatado da seguinte forma:

```text
Authorization = Bearer TOKEN_VALUE
```

Você pode verificar se o token é válido ou não usando o método `auth.authenticate`. A [AuthenticationException](https://github.com/adonisjs/auth/blob/develop/src/Exceptions/AuthenticationException.ts) é gerada se o token for inválido ou se o usuário não existir dentro do banco de dados.

Caso contrário, você pode acessar o usuário logado usando a propriedade `auth.user`.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('dashboard', async ({ auth }) => {
  await auth.use('api').authenticate()
  console.log(auth.use('api').user!)
})
```

Chamar esse método manualmente dentro de cada rota não é prático e, portanto, você pode usar o middleware auth armazenado dentro do arquivo `./app/Middleware/Auth.ts`.

* [Saiba mais sobre o middleware auth →](/docs/auth/middleware.md)

## Revogar tokens
Durante a fase de logout, você pode revogar o token excluindo-o do banco de dados. O token novamente deve ser enviado sob o cabeçalho `Authorization`.

O método `auth.revoke` removerá o token enviado durante a solicitação atual do banco de dados.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.post('/logout', async ({ auth, response }) => {
  await auth.use('api').revoke()
  return {
    revoked: true
  }
})
```

## Outros métodos/propriedades
A seguir está a lista de métodos/propriedades disponíveis para o `api` guard.

### `isLoggedIn`
Descubra se o usuário está logado ou não. O valor é `true` logo após chamar o método `auth.generate` ou quando a verificação `auth.authenticate` passa.

```ts
await auth.use('api').authenticate()
auth.use('api').isLoggedIn // true
```

```ts
await auth.use('api').attempt(email, password)
auth.use('api').isLoggedIn // true
```

### `isGuest`
Descubra se o usuário é um convidado (ou seja, não está logado). O valor é sempre o oposto do sinalizador `isLoggedIn`.

### `isAuthenticated`
Descubra se a solicitação atual passou na verificação de autenticação. Este sinalizador é diferente do sinalizador `isLoggedIn` e NÃO é definido como true durante a chamada `auth.login`.

```ts
await auth.use('api').authenticate()
auth.use('api').isAuthenticated // true
```

```ts
await auth.use('api').attempt(email, password)
auth.use('api').isAuthenticated // false
```

### `isLoggedOut`
Descubra se o token foi revogado durante a solicitação atual. O valor será `true` logo após chamar o método `auth.revoke`.

```ts
await auth.use('api').revoke()
auth.use('api').isLoggedOut
```

### `authenticationAttempted`
Descubra se uma tentativa de autenticação da solicitação atual foi feita. O valor é definido como `true` quando você chama o método `auth.authenticate`

```ts
auth.use('api').authenticationAttempted // false

await auth.use('api').authenticate()
auth.use('api').authenticationAttempted // true
```

### `provider`
Referência ao provedor de usuário subjacente usado pelo guard.

### `tokenProvider`
Referência ao provedor de token subjacente usado pelo guard.

### `verifyCredentials`
Um método para verificar as credenciais do usuário. O método `auth.attempt` usa esse método por baixo dos panos. A exceção [InvalidCredentialsException](https://github.com/adonisjs/auth/blob/develop/src/Exceptions/InvalidCredentialsException.ts) é gerada quando as credenciais são inválidas.

```ts
try {
  await auth.use('api').verifyCredentials(email, password)
} catch (error) {
  console.log(error)
}
```

### `check`
O método é o mesmo que o método `auth.authenticate`. No entanto, ele não levanta nenhuma exceção quando a solicitação não é autenticada. Pense nisso como uma tentativa opcional de verificar se o token é válido para a solicitação atual ou não.

```ts
await auth.use('api').check()

if (auth.use('api').isLoggedIn) {
}
```
