# Autenticação

O provedor de autenticação AdonisJs é um sistema completo para autenticar solicitações HTTP usando vários autenticadores.

Usando autenticadores, você pode construir sistemas de login tradicionais *baseados em sessão* e proteger suas *APIs*.

::: warning NOTA
Para gerenciamento de perfil de usuário opinativo, confira o pacote oficial [Adonis Persona](https://github.com/adonisjs/adonis-persona) – um serviço simples e funcional para permitir que você *crie*, *verifique* e *atualize* perfis de usuário no AdonisJs.
:::

## Autenticadores
Cada autenticador é uma combinação de esquema de autenticação e serializador.

### Esquemas

* Sessão (`session`)
* Autenticação básica (`basic`)
* JWT (`jwt`)
* Tokens de API pessoais (`api`)

### Serializadores

* Lucid (`lucid`)
* Banco de dados (`database`)

## Categorias de autenticação

A autenticação é dividida em duas categorias amplas: *Stateful* e *Stateless*.

A autenticação baseada em sessão é considerada *Stateful*, pois usuários logados podem navegar para diferentes áreas do aplicativo sem reenviar suas credenciais.

A autenticação *Stateless* exige que o usuário reenvie suas credenciais em cada solicitação HTTP, o que é muito comum com APIs.

O AdonisJs fornece as ferramentas e ajudantes necessários para gerenciar ambos os tipos de autenticação com facilidade.

## Hash de senha
O provedor de autenticação AdonisJs usa o módulo [Hash](/docs/05-Security/06-Encryption.md) para verificar senhas.

Sempre faça [hash de suas senhas](/docs/08-Lucid-ORM/02-Hooks.md) antes de salvá-las no banco de dados.

## Configuração
O provedor de autenticação AdonisJs vem pré-instalado com boilerplates `fullstack` e `api`.

Se o provedor de autenticação ainda não estiver configurado, siga as instruções abaixo.

Primeiro, execute o comando `adonis` para baixar o provedor de autenticação:

```bash
adonis install @adonisjs/auth
```

Em seguida, registre o provedor de autenticação dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/auth/providers/AuthProvider'
]
```

Finalmente, registre o middleware de autenticação dentro do arquivo `start/kernel.js`:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/AuthInit'
]

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  guest: 'Adonis/Middleware/AllowGuestOnly'
}
```

## Config
Sua configuração de autenticação é salva dentro do arquivo `config/auth.js`.

Por padrão, o autenticador `session` é usado para autenticar solicitações de aplicativo.

## Exemplo básico
Vamos começar com o exemplo de login de um usuário, mostrando apenas o perfil dele se ele estiver logado.

Primeiro, adicione as seguintes rotas ao arquivo `start/routes.js`:

```js
// .start/routes.js

Route
  .post('login', 'UserController.login')
  .middleware('guest')

Route
  .get('users/:id', 'UserController.show')
  .middleware('auth')
```

Em seguida, crie o `UserController` por meio do comando `adonis`:

```bash
adonis make:controller User
```

Adicione o método `login` ao `UserController`:

```js
// .app/Controllers/Http/UserController.js

class UserController {

  async login ({ auth, request }) {
    const { email, password } = request.all()
    await auth.attempt(email, password)

    return 'Logged in successfully'
  }
}
```

O método `login` acima extrai o `email` e a `password` do usuário da solicitação e os registra se suas credenciais forem válidas.

Por fim, adicione o método `show` ao `UserController`:

```js
// .app/Controllers/Http/UserController.js

class UserController {
  async login () {
    ...
  }

  show ({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }
    return auth.user
  }
}
```

O método `show` acima verifica se o parâmetro de rota `id` é igual ao `id` do usuário logado no momento. Se sim, o modelo de usuário autenticado é retornado (que o AdonisJS converte para JSON na resposta final).

## Sessão

### Configuração de Sessão

```js
// .config/auth.js

module.exports = {
  authenticator: 'session',
  session: {
    serializer: 'Lucid',
    scheme: 'session',
    model: 'App/Models/User',
    uid: 'email',
    password: 'password'
  }
}
```

## Proteção CSRF

[Cross-Site Request Forgery (CSRF)](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)) permite que um invasor execute ações em nome de outro usuário sem seu conhecimento ou permissão.

O AdonisJs protege seu aplicativo de ataques CSRF negando solicitações não identificadas. As solicitações HTTP com métodos *POST, PUT e DELETE* são verificadas para garantir que as pessoas certas do lugar certo invoquem essas solicitações.

### Configuração
Instale o provedor `shield` via npm executando o seguinte comando:

```js
await auth.attempt(uid, password)
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

```js
const user = await User.find(1)

await auth.login(user)
```

Finalmente, registre o middleware global dentro do arquivo `start/kernel.js`:

```js
await auth.loginViaId(1)
```

::: warning NOTA
O middleware Shield depende de [sessões](/docs/04-Basics/07-Sessions.md), então certifique-se de que elas estejam configuradas corretamente.
:::

### Configuração
A configuração para CSRF é salva dentro do arquivo `config/shield.js`:

```js
await auth
  .remember(true)
  .attempt(email, password)
```

| Chave       | Valor                                   | Descrição                                                                                 |
|-------------|-----------------------------------------|-------------------------------------------------------------------------------------------|
| serializer  | `lucid`, `database`                     | Serializador usado para buscar o usuário do banco de dados.                               |
| scheme      | `session`, `basic`, `jwt`, `api`        | Esquema usado para buscar e autenticar credenciais do usuário.                            |
| uid         | Nome do campo do banco de dados         | Campo do banco de dados usado como identificador exclusivo para um determinado usuário.   |
| password    | Nome do campo do banco de dados         | Campo usado para verificar a senha do usuário.                                            |
| model       | Namespace do modelo (`lucid` apenas)    | Modelo usado para consultar o banco de dados, aplicável somente ao usar o serializador `lucid`.  |
| table       | Nome da tabela do banco de dados (`database` apenas)   | Aplicável somente ao usar o serializador `database`.                                      |

### Métodos de Sessão

O autenticador *session* expõe os seguintes métodos para efetuar login e autenticar usuários.

#### `attempt(uid, password)`
Login via `uid` e `password`, lançando uma exceção se nenhum usuário for encontrado ou a senha for inválida:

```js
try {
  await auth.check()
} catch (error) {
  response.send('You are not logged in')
}
```

#### `login(user)`
Login via instância do modelo `user`, não verifica nada, mas simplesmente marca o usuário como logado:

```js
try {
  return await auth.getUser()
} catch (error) {
  response.send('You are not logged in')
}
```

#### `loginViaId(id)`
Login via ID do usuário, consultando o banco de dados para garantir que o usuário exista:

```js
await auth.logout()
```

#### `remember`
Ao chamar métodos como `attempt`, `login` ou `loginViaId`, encadeie o método `remember` para garantir que os usuários permaneçam logados após fechar o navegador:

```js
try {
  await auth.check()
} catch (error) {
  response.send(error.message)
}
```

::: warning NOTA
O método `remember` cria um token para o usuário dentro da tabela `tokens`. Se você quiser revogar a sessão de longa duração de um usuário específico, basta definir `is_revoked` como true.
:::

#### `check`
Verifique se um usuário já está logado lendo sua sessão:

```js
try {
  return await auth.getUser()
} catch (error) {
  response.send('Credentials missing')
}
```

#### `getUser`
Retorna a instância do usuário logado (por meio do método `check`):

```js
// .config/auth.js

module.exports = {
  authenticator: 'jwt',
  jwt: {
    serializer: 'Lucid',
    model: 'App/Models/User',
    scheme: 'jwt',
    uid: 'email',
    password: 'password',
    options: {
      secret: Config.get('app.appKey'),
      // For additional options, see the table below...
    }
  }
}
```

#### `logout`
Desconecte o usuário logado no momento:

```js
  To secure JWT using `RS256` asymmetric algorithm, you need to explictly provide `algorithm` option and set it to `RS256`.
  You must provide your `private key` via `secret` option which will be used by the framework to sign your JWT.
  And you must provide your `public key` via `public` option, which will be used by the framework
  to verify the JWT.

  const fs = use("fs");
  module.exports = {
    authenticator: 'jwt',
    jwt: {
      //...
      options: {
        algorithm: 'RS256',
        secret: fs.readFileSync('absolute-path-to-your-private-key-file'),
        public: fs.readFileSync('absolute-path-to-your-public-key-file'),
        // For additional options, see the table above...
      }
    }
  }
```

## Autenticação básica
Como a autenticação básica é sem estado, com os usuários passando credenciais por solicitação, não há conceito de `login` e `logout`.

::: warning NOTA
O cabeçalho `Authorization = Basic <credentials>` deve ser definido para autenticar solicitações de autenticação *básicas*, onde `<credentials>` é uma string codificada em `base64` de `uid:password`, onde `uid` é o campo de banco de dados `uid` definido no arquivo `config/auth.js`.
:::

### Métodos de autenticação básicos

O autenticador *básico* expõe os seguintes métodos para autenticar usuários.

#### `check`
Verifique as credenciais básicas de autenticação do usuário no cabeçalho da solicitação, verificando a existência do usuário e validando sua senha:

```js
await auth.attempt(uid, password)
```

#### `getUser`
Retorna a instância do usuário conectado (por meio do método `check`):

```js
// Saída

{
  type: 'type',
  token: '.....',
  refreshToken: '....'
}
```

## JWT
[Autenticação JWT](https://jwt.io/) é um padrão da indústria para implementar autenticação sem estado por meio de tokens de string.

O AdonisJs oferece suporte a tokens JWT prontos para uso por meio de seu autenticador *jwt*.

::: warning OBSERVAÇÃO
O cabeçalho `Authorization = Bearer <token>` deve ser definido para autenticar solicitações de autenticação *jwt*, onde `<token>` é um token JWT válido.
:::

### Configuração JWT

```js
const user = await User.find(1)

await auth.generate(user)
```

| Chave | Valores | Valor padrão | Descrição |
|-----------|---------------------------------------------------------------------------|---------------|----------------------------------------|
| algorithm | `HS256`, `HS384`, `RS256`                                                 | `HS256`       | Algoritmo usado para gerar tokens.          |
| expiresIn | Tempo válido em segundos ou [string ms](https://github.com/rauchg/ms.js)  | null          | Quando expirar os tokens.                   |
| notBefore | Tempo válido em segundos ou [string ms](https://github.com/rauchg/ms.js)  | null          | Tempo mínimo para manter os tokens válidos. |
| audience  | String                                                                    | null          | `aud` alegar.                               |
| issuer    | Array or String                                                           | null          | `iss` alegar.                               |
| subject   | String                                                                    | null          | `sub` alegar.                               |
| public    | String                                                                    | null          | Chave `public` para verificar o token criptografado com o algoritmo RSA. |

```js
await auth
  .withRefreshToken()
  .attempt(uid, password)
```

### Métodos JWT

O autenticador *jwt* expõe os seguintes métodos para gerar tokens JWT e autenticar usuários.

#### `attempt(uid, password, [jwtPayload], [jwtOptions])`
Valida as credenciais do usuário e gera um token JWT em troca:

```js
const refreshToken = request.input('refresh_token')

await auth.generateForRefreshToken(refreshToken, true)
```

```js
await auth
  .newRefreshToken()
  .generateForRefreshToken(refreshToken)
```

#### `generate(user, [jwtPayload], [jwtOptions])`
Gera o token JWT para um determinado usuário:

```js
try {
  await auth.check()
} catch (error) {
  response.send('Missing or invalid jwt token')
}
```

Opcionalmente, você pode passar um objeto personalizado para ser codificado dentro do token. Passar `jwtPayload=true` codifica o objeto do usuário dentro do token.

#### `withRefreshToken`
Instrua o autenticador JWT a gerar um token de atualização também:

```js
try {
  return await auth.getUser()
} catch (error) {
  response.send('Missing or invalid jwt token')
}
```

O token de atualização é gerado para que os clientes possam atualizar o token `jwt` real sem solicitar credenciais do usuário novamente.

#### `generateForRefreshToken(refresh_token, [jwtPayload])`
Gere um novo token JWT usando o token de atualização. Passar jwtPayload=true codifica o objeto do usuário dentro do token.

```js
await auth.listTokens()
```

#### `newRefreshToken`
Ao gerar um novo token `jwt`, o provedor de autenticação não emite novamente um novo token de atualização e, em vez disso, usa o antigo. Se desejar, você também pode regenerar um novo token de atualização:

```js
const token = await auth.attempt(uid, password)
```

#### `check`
Verifica se um token JWT válido foi enviado por meio do cabeçalho `Authorization`:

```js
// Saída:

{
  type: 'bearer',
  token: '...'
}
```

#### `getUser`
Retorna a instância do usuário conectado (por meio do método `check`):

```js
const user = await User.find(1)

const token = await auth.generate(user)
```

#### `listTokens`
Lista todos os tokens de atualização JWT para o usuário:

```js
try {
  await auth.check()
} catch (error) {
  response.send('Missing or invalid api token')
}
```

## Tokens de API pessoais
Os tokens de API pessoais foram popularizados pelo [Github](https://github.com/blog/1509-personal-api-tokens) para uso em scripts como um substituto revogável para a autenticação tradicional de *email* e *senha*.

O AdonisJs permite que você crie aplicativos onde seus usuários podem criar tokens de API pessoais e usá-los para autenticação.

::: warning NOTA
O cabeçalho `Authorization = Bearer <token>` deve ser definido para autenticar solicitações de autenticação *api*, onde `<token>` é um token de API válido.
:::

### Métodos de API

O autenticador *api* expõe os seguintes métodos para gerar tokens de API e autenticar usuários.

#### `attempt(uid, password)`
Valida as credenciais do usuário e então gera um novo token para elas:

```js
try {
  await auth.getUser()
} catch (error) {
  response.send('Missing or invalid api token')
}
```

```js
await auth.listTokens()
```

#### `generate(user)`
Gera token para um determinado usuário:

```js
// loggedin user via sessions
const user = auth.user

auth
  .authenticator('jwt')
  .generate(user)
```

#### `check`
Verifica se um token de API válido foi passado pelo cabeçalho `Authorization`:

```js
// .start/kernel.js

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth'
}
```

#### `getUser`
Retorna a instância do usuário logado (pelo método `check`):

```js
// .start/routes.js

Route
  .get('users/profile', 'UserController.profile')
  .middleware(['auth'])
```

#### `listTokens`
Lista todos os tokens de API para o usuário:

```js
// .start/kernel.js

const namedMiddleware = {
  guest: 'Adonis/Middleware/AllowGuestOnly'
}
```

## Alternando autenticadores
O auth provider simplifica a troca entre vários *autenticadores* em tempo de execução chamando o método `authenticator`.

Assumindo que o usuário esteja logado usando o autenticador `session`, podemos gerar um token JWT para ele da seguinte forma:

```js
// .start/routes.js

// Não queremos que nosso usuário logado acesse esta visualização
Route
  .get('login', 'AuthController.login')
  .middleware(['guest'])
```

## Middleware Auth
O middleware `auth` automatiza a autenticação para quaisquer rotas aplicadas.

Ele é registrado como um middleware nomeado dentro do arquivo `start/kernel.js`:

```edge
Hello {{ auth.user.username }}!
```

Uso:

```edge
@loggedIn
  <h2> Hello {{ auth.user.username }} </h2>
@else
  <p> Please login </p>
@endloggedIn
```

## Middleware Guest
O middleware `guest` verifica se o usuário não está autenticado.

Ele é registrado como um middleware nomeado dentro do arquivo `start/kernel.js`:

```js
const refreshToken = '' // get it from user

await auth
  .authenticator('jwt')
  .revokeTokens([refreshToken])
```

Uso:

```js
const refreshToken = '' // get it from user

await auth
  .authenticator('jwt')
  .revokeTokens([refreshToken], true)
```

## Helpers
O provedor de autenticação adiciona alguns helpers à instância de visualização para que você possa escrever HTML em torno do estado de um usuário conectado.

#### `auth`
Referência ao objeto `auth`:

```js
await auth
  .authenticator('jwt')
  .revokeTokens()
```

#### `loggedIn`
A tag `loggedIn` pode ser usada para escrever `if/else` em torno do usuário conectado:

```js
// for currently loggedin user
const apiToken = auth.getAuthHeader()

await auth
  .authenticator('api')
  .revokeTokens([apiToken])
```

## Revogando tokens
Os esquemas `jwt` e `api` expõem métodos para revogar tokens usando a interface `auth`.

::: warning NOTA
Para `jwt`, os tokens de atualização são apenas revogados, já que os tokens reais nunca são salvos no banco de dados.
:::

#### `revokeTokens(tokens, delete = false)`
O método a seguir revogará tokens definindo um sinalizador na tabela `tokens`:

```js
const user = await User.find(1)

await auth
  .authenticator('jwt')
  .revokeTokensForUser(user)
```

Se `true` for passado como o 2º argumento, em vez de definir o sinalizador de banco de dados `is_revoked`, a linha relevante será excluída do banco de dados:

```js
const refreshToken = '' // get it from user

await auth
  .authenticator('jwt')
  .revokeTokens([refreshToken], true)
```

Para revogar todos os tokens, chame `revokeTokens` sem nenhum argumento:

```js
await auth
  .authenticator('jwt')
  .revokeTokens()
```

Ao revogar o token `api` para o usuário atualmente conectado, você pode acessar o valor do cabeçalho da solicitação:

```js
// for currently loggedin user
const apiToken = auth.getAuthHeader()

await auth
  .authenticator('api')
  .revokeTokens([apiToken])
```

#### revokeTokensForUser(user, tokens, delete = false)
Este método funciona da mesma forma que o método `revokeTokens`, mas em vez disso, você pode especificar o usuário você mesmo:

```js
const user = await User.find(1)

await auth
  .authenticator('jwt')
  .revokeTokensForUser(user)
```

## Criptografia de Token
Os tokens são salvos em formato simples dentro do banco de dados, mas são enviados em formato *criptografado* para o usuário final.

Isso é feito para garantir que, se alguém acessar seu banco de dados, não consiga usar seus tokens diretamente (eles teriam que descobrir como criptografá-los usando a chave secreta).
