# Autenticação

O provedor de autenticação do AdonisJs é um sistema completo para autenticar solicitações HTTP usando 
vários tipos de autenticadores.

Usando autenticadores, você pode criar sistemas de login tradicionais baseados em sessão e proteger suas APIs.

> Para um gerenciamento de perfil de usuário opinativo, consulte o pacote oficial do 
> [Adonis Persona](https://github.com/adonisjs/adonis-persona) - um serviço simples e funcional 
> para criar, verificar e atualizar perfis de usuário no AdonisJs.

## Autenticadores
Cada autenticador é uma combinação de esquema de autenticação e serializador.

### Esquemas
+ Sessão (session)
+ Autenticação básica (basic)
+ JWT (jwt)
+ Tokens de API pessoais (api)

### Serializadores
+ Lúcido ( lucid)
+ Banco de Dados ( database)

## Categorias de autenticação
A autenticação é dividido em duas grandes categorias: Stateful e Stateless.

A autenticação baseada em sessão é considerada estável, pois os usuários conectados podem navegar para 
diferentes áreas do aplicativo sem reenviar suas credenciais.

A autenticação sem estado exige que o usuário reenvie suas credenciais em cada solicitação HTTP, o que 
é muito comum nas APIs.

O AdonisJs fornece ferramentas e auxiliares necessários para gerenciar os dois tipos de autenticação com facilidade.

## Hashing de senha
O provedor de autenticação AdonisJs usa o módulo Hash para verificar senhas.

Sempre use [hash nas senhas](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/orm/hooks.md#definindo-ganchos) antes de salvá-las no banco de dados.

## Configuração
O provedor de autenticação AdonisJs vem pré-instalado com `fullstack` e `api` boilerplates.

Se o provedor de autenticação ainda não estiver configurado, siga as instruções abaixo.

Primeiro, execute o comando `adonis` para baixar o provedor de autenticação:

```
> adonis install @adonisjs/auth
```

Em seguida, registre o provedor de autenticação dentro do arquivo `start/app.js`:

``` js
const providers = [
  '@adonisjs/auth/providers/AuthProvider'
]
```

Por fim, registre o middleware de autenticação dentro do arquivo `start/kernel.js`:

``` js
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

Por padrão, o autenticador `session` é usado para autenticar solicitações de aplicativos.

## Exemplo básico
Vamos começar com o exemplo de logon em um usuário e, em seguida, mostrar seu perfil apenas se ele estiver logado.

Primeiro, adicione as seguintes rotas ao arquivo `start/routes.js`:

``` js
Route
  .post('login', 'UserController.login')
  .middleware('guest')

Route
  .get('users/:id', 'UserController.show')
  .middleware('auth')
```

Em seguida, crie o arquivo `UserController` via comando `adonis`:

```
> adonis make:controller User
```

Adicione o método `login` ao `UserController`:

``` js
class UserController {

  async login ({ auth, request }) {
    const { email, password } = request.all()
    await auth.attempt(email, password)

    return 'Logged in successfully'
  }
}
```

O método `login` acima extrai do usuário `email` e `password` da solicitação e
efetua login se suas credenciais forem válidas.

Por fim, adicione o método `show` ao `UserController`:

``` js
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

O método `show` acima verifica se o parâmetro `id` da rota é igual ao `id` do usuário conectado no momento. 
Nesse caso, o modelo de usuário autenticado é retornado (que o AdonisJS converte em JSON na resposta final).

## Sessão

### Configuração da sessão

``` js
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

| Chave           | Valores                                                 | Descrição                                                                                         |
|-----------------|---------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| serializador    | lucid, database                                         | Serializador usado para buscar o usuário no banco de dados.                                       |
| scheme          | session, basic, jwt,api                                 | Esquema usado para buscar e autenticar credenciais do usuário.                                    |
| uid             | Nome do campo do banco de dados                         | Campo do banco de dados usado como identificador exclusivo para um determinado usuário.           |
| password        | Nome do campo do banco de dados                         | Campo usado para verificar a senha do usuário.                                                    |
| model           | Namespace do modelo ( lucidapenas)                      | Modelo usado para consultar o banco de dados, aplicável apenas ao usar o lucidserializador.       |
| table           | Nome da tabela do banco de dados ( apenas `database`)   | Aplicável apenas ao usar o databaseserializador.                                                  |

### Métodos de sessão
O autenticador da sessão expõe os seguintes métodos para efetuar login e autenticar usuários.

####  attempt (uid, senha)
Faça login via `uid` e `password`, lançando uma exceção se nenhum usuário for encontrado ou a senha for inválida:

``` js
await auth.attempt(uid, password)
```

#### login(usuário)
Efetue login via instância `user` do modelo, não verifique nada, apenas marque o usuário como logado:

``` js
const user = await User.find(1)

await auth.login(user)
```

#### loginViaId(id)
Efetue login na via ID do usuário, consultando o banco de dados para garantir que o usuário exista:

``` js
await auth.loginViaId(1)
```

#### remember
Ao chamar métodos como `attempt`, `login` ou `loginViaId`, encadeie o método `remember` para garantir que os usuários 
continuem conectados após fechar o navegador:

```js
await auth
  .remember(true)
  .attempt(email, password)
```

> O método `remember` cria um token para o usuário dentro da tabela `tokens`. Se você quiser revogar a 
> sessão de longa duração de um usuário específico, simplesmente configure `is_revoked` como `true`.

#### check
Verifique se um usuário já está logado lendo sua sessão:

``` js
try {
  await auth.check()
} catch (error) {
  response.send('You are not logged in')
}
```

#### getUser
Retorna a instância do usuário conectado (através do checkmétodo):

``` js
try {
  return await auth.getUser()
} catch (error) {
  response.send('You are not logged in')
}
```

### logout
Desconecte o usuário conectado no momento:
``` js
await auth.logout()
```

## Autenticação básica
Como a autenticação básica é sem estado com usuários passando credenciais por solicitação, 
não há conceito de `login` e `logout`.

> O cabeçalho  `Authorization = Basic <credentials>` deve ser configurado para autenticar solicitações de 
> autenticação básica, onde `<credentials>` é uma sequência `base64` codificada de `uid:password`, 
onde `uid` é o campo `uid` do banco de dados definido no arquivo `config/auth.js`.

### Métodos de autenticação básica
O autenticador básico expõe os seguintes métodos para autenticar usuários.

#### check
Verifique as credenciais de autenticação básica do usuário no cabeçalho da solicitação, verificando a 
existência do usuário e validando sua senha:

``` js
try {
  await auth.check()
} catch (error) {
  response.send(error.message)
}
```

#### getUser
Retorna a instância do usuário conectado (através do checkmétodo):

``` js
try {
  return await auth.getUser()
} catch (error) {
  response.send('Credentials missing')
}
```

## JWT
A [autenticação JWT](https://jwt.io/) é um padrão do setor para implementar autenticação sem estado por meio de tokens de string.

O AdonisJs suporta tokens JWT prontos para uso através de seu autenticador jwt.

> O cabeçalho `Authorization = Bearer <token>` deve ser configurado para autenticar solicitações 
> de autenticação jwt, em que` <token>` é um token JWT válido.

### Configuração JWT

*config/auth.js*
``` js
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
      // Para opções adicionais, consulte a tabela abaixo...
    }
  }
}
```

| Chave             | Valores                                       | Valor padrão  | Descrição                                                         |
|-------------------|-----------------------------------------------|---------------|-------------------------------------------------------------------|
| algorithm         | `HS256`, `HS384`, `RS256`                     | `HS256`       | Algoritmo usado para gerar tokens.                                |
| expiresIn         | Tempo válido em segundos ou sequência de ms   | null          | Quando expirar os tokens.                                         |
| notBefore         | Tempo válido em segundos ou sequência de ms   | null          | Tempo mínimo para manter os tokens válidos.                       |
| audience          | String                                        | null          | `aud` requer.                                                     |
| issuer            | Matriz ou String                              | null          | `iss` requer.                                                     |
| subject           | String                                        | null          | `sub` requer.                                                     |
| public            | String                                        | null          | `public` para verificar o token criptografado com o algoritmo RSA.|


> Para proteger o JWT usando o algoritmo assimétrico `RS256`, você precisa fornecer explicitamente a opção `algorithm` e defini-la como `RS256`.
> Você deve fornecer sua `chave privada` através da opção `secret`, que será usada pela estrutura para assinar seu JWT.
> E você deve fornecer sua `chave pública` via opção `public`, que será usada pela estrutura
> para verificar o JWT.

``` js
const fs = use ("fs");
module.exports = {
  autenticador: 'jwt',
  jwt: {
    // ...
    options: {
      algoritmo: 'RS256',
      secret: fs.readFileSync ('caminho-absoluto-para-seu-arquivo-chave-privado'),
      public: fs.readFileSync ('caminho absoluto para o seu arquivo de chave público'),
      // Para opções adicionais, consulte a tabela acima ...
    }
  }
}
```

### Métodos JWT
O autenticador jwt expõe os seguintes métodos para gerar tokens JWT e autenticar usuários.

#### attempt(uid, senha, [jwtPayload], [jwtOptions])
Valide as credenciais do usuário e gere um token JWT em troca:

``` js
await auth.attempt(uid, password)
```

Resultado
```
{
  type: 'type',
  token: '.....',
  refreshToken: '....'
}
```

#### generate(usuário, [jwtPayload], [jwtOptions])
Gere o token JWT para um determinado usuário:

``` js
const user = await User.find(1)

await auth.generate(user)
```

Opcionalmente, você pode transmitir um objeto personalizado a ser codificado no token. Passando `jwtPayload=true` 
codificará o objeto de usuário dentro do token.

#### withRefreshToken
Instrua o autenticador JWT a gerar também um token de atualização:

``` js
await auth
  .withRefreshToken()
  .attempt(uid, password)
```

O token de atualização é gerado para que os clientes possam atualizar o token `jwt` real sem solicitar credenciais 
do usuário novamente.

#### generateForRefreshToken(refresh_token, [jwtPayload])
Gere um novo token JWT usando o token de atualização. Passar `jwtPayload = true` codifica o 
objeto de usuário dentro do token.

``` js
const refreshToken = request.input('refresh_token')

await auth.generateForRefreshToken(refreshToken, true)
```

#### newRefreshToken
Ao gerar um novo token `jwt`, o provedor de autenticação não re-emite um novo token de atualização e, 
em vez disso, usa o antigo. Se desejar, também é possível gerar novamente um novo token de atualização:

``` js
await auth
  .newRefreshToken()
  .generateForRefreshToken(refreshToken)
```

#### check
Verifica se um token JWT válido foi enviado via cabeçalho `Authorization`:

``` js
try {
  await auth.check()
} catch (error) {
  response.send('Missing or invalid jwt token')
}
```

#### getUser
Retorna a instância do usuário conectado (através do método `check`):

```  js
try {
  return await auth.getUser()
} catch (error) {
  response.send('Missing or invalid jwt token')
}
```

#### listTokens
Lista todos os tokens de atualização JWT para o usuário:

``` js
await auth.listTokens()
```

## Tokens de API pessoais
Os tokens de API pessoais foram popularizados pelo Github para uso em scripts como um substituto revogável 
para a autenticação tradicional de email e senha.

O AdonisJs permite criar aplicativos onde seus usuários podem criar tokens de API pessoais e usá-los para autenticar.

> O cabeçalho `Authorization = Bearer <token>` deve ser configurado para autenticar solicitações de autenticação de API, 
> onde `<token>` é um token de API válido.

### Métodos de API
O autenticador da API expõe os seguintes métodos para gerar tokens de API e autenticar usuários.

#### attempt(uid, senha)
Valide as credenciais do usuário e gere um novo token para eles:

``` js
const token = await auth.attempt(uid, password)
```

Resultado
```
{
  type: 'bearer',
  token: '...'
}
```

#### generate(usuário)
Gere token para um determinado usuário:

``` js
const user = await User.find(1)

const token = await auth.generate(user)
```

#### check
Verifica se um token de API válido foi passado pelo cabeçalho `Authorization`:

``` js
try {
  await auth.check()
} catch (error) {
  response.send('Missing or invalid api token')
}
```

#### getUser
Retorna a instância do usuário conectado (através do checkmétodo):

``` js
try {
  await auth.getUser()
} catch (error) {
  response.send('Missing or invalid api token')
}
```

#### listTokens
Liste todos os tokens de API para o usuário:

``` js
await auth.listTokens()
``` 

## Alternando Autenticadores
O provedor de autenticação simplifica a alternância entre vários autenticadores em 
tempo de execução, chamando o método `authenticator`

Supondo que o usuário esteja conectado usando o autenticador `session`, podemos gerar um token JWT 
para eles da seguinte maneira:

``` js
// Usuário logado via session
const user = auth.user

const auth
  .authenticator('jwt')
  .generate(user)
```

## Auth Middleware
O middleware `auth` automatiza a autenticação para todas as rotas aplicadas.

Ele é registrado como um middleware nomeado dentro do arquivo `start/kernel.js`:

``` js
const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth'
}
```

Uso:

```
Route
  .get('users/profile', 'UserController.profile')
  .middleware(['auth'])
```

## Middleware convidado
O middleware `guest` verifica se o usuário não está autenticado.

Ele é registrado como um middleware nomeado dentro do arquivo `start/kernel.js`:

``` js
const namedMiddleware = {
  guest: 'Adonis/Middleware/AllowGuestOnly'
}
```

Uso:

``` js
// Não queremos que nosso usuário conectado acesse esta visualização
Route
  .get('login', 'AuthController.login')
  .middleware(['guest'])
``` 

## Ajudantes
O provedor de autenticação adiciona alguns auxiliares à instância de exibição para que você possa escrever 
HTML em torno do estado de um usuário conectado.

### auth
Referência ao objeto `auth`:

``` 
Hello {{ auth.user.username }}!
```

### loggedIn
A tag `loggedIn` pode ser usada para escrever em `if/else` em torno do usuário conectado:

``` 
@loggedIn
  <h2> Hello {{ auth.user.username }} </h2>
@else
  <p> Please login </p>
@endloggedIn
```

## Revogando Tokens
Os esquemas `jwt` e `api` expõem métodos para revogar tokens usando a interface `auth`.

> Para `jwt`, os tokens de atualização são revogados apenas, pois os tokens reais nunca são salvos no banco de dados.

### revokeTokens(tokens, delete = false)
O método a seguir revogará os tokens definindo um sinalizador na tabela `tokens`:

``` js
const refreshToken = '' // obtê-lo do usuário

await auth
  .authenticator('jwt')
  .revokeTokens([refreshToken])
```

Se `true` for passado como o segundo argumento, em vez de definir o sinalizador `is_revoked` do banco de 
dados, a linha relevante será excluída do banco de dados:

``` js
const refreshToken = '' // obtê-lo do usuário

await auth
  .authenticator('jwt')
  .revokeTokens([refreshToken], true)
```

Para revogar todos os tokens, chame `revokeTokens` sem argumentos:

``` js
await auth
  .authenticator('jwt')
  .revokeTokens()
```

Ao revogar o token `api` para o usuário conectado no momento, você pode acessar o valor no cabeçalho da solicitação:

``` js
// para usuário conectado no momento
const apiToken = auth.getAuthHeader()

await auth
  .authenticator('api')
  .revokeTokens([apiToken])
```

### revokeTokensForUser (usuário, tokens, delete = false)
Este método funciona da mesma forma que o método `revokeTokens`, mas você pode especificar o usuário:

``` js
const user = await User.find(1)

await auth
  .authenticator('jwt')
  .revokeTokensForUser(user)
```

## Criptografia de token
Os tokens são salvos em formato simples dentro do banco de dados, mas são enviados de 
forma criptografada para o usuário final.

Isso é feito para garantir que, se alguém acessa seu banco de dados, eles não podem usar seus 
tokens diretamente (eles teriam que descobrir como criptografá-los usando a chave secreta).
