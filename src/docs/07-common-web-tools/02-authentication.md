# Autenticação

Todo aplicativo web lida com gerenciamento de usuários e autenticação em algum estágio. O provedor de autenticação AdonisJs é um sistema totalmente funcional para autenticar solicitações HTTP usando vários autenticadores. Usando autenticadores, você pode construir sistemas tradicionais baseados em sessão *login* para proteger *REST API's*.

## Autenticadores
Cada autenticador é uma combinação de serializadores e um esquema de autenticação.

### Esquemas

* Sessões (sessão)
Autenticação básica (básica)
* JWT (JWT)
* Tokens Pessoais da API (api)

### Serializadores

*Lucid
* Banco de dados

## Sobre Autenticação

1. A autenticação é dividida em duas categorias amplas de *autenticação Stateful* e *autenticação Stateless*.
2. A autenticação baseada em sessão é considerada uma *Autenticação Stateful*, pois, uma vez logado o usuário pode navegar para diferentes áreas do aplicativo sem enviar novamente as credenciais.
3. *Autenticação Stateless* exige que o usuário final envie as credenciais em cada solicitação HTTP, o que é muito comum com APIs REST.
4. O AdonisJS fornece as ferramentas e os auxiliares necessários para gerenciar com facilidade ambos os tipos de autenticação.
5. O provedor de autenticação usará o módulo [Hash](/security/encryption-and-hashing) para verificar as senhas. Certifique-se de que as senhas sejam armazenadas no banco de dados após a verificação.

## Configuração
A configuração de autenticação é salva dentro do arquivo `config/auth.js`. Por padrão, utiliza o `session` para autenticar as requisições.

```js
module.exports = {
  authenticator: 'session',
  session: {
    serializer: 'Lucid',
    scheme: 'session',
    model: 'App/Model/User',
    uid: 'email',
    password: 'password'
  }
}
```

| Chave | Valores | Descrição |
|-----|--------|--------------|
| serializar | Lucid, Banco de dados | Serializer a ser usado para buscar o usuário do banco de dados. |
| esquema | session, básico, jwt, api | Esquema a ser usado para buscar e autenticar credenciais de usuário. |
| uid | Nome do campo de banco de dados | Campo de banco de dados para ser usado como identificador exclusivo para um usuário específico. |
| senha | Nome do campo de banco de dados | Campo para verificar a senha do usuário |
| modelo | Modelo Espaço de Nomes * (Lucido Apenas) | Aplicável somente ao usar o serializador Lucid. O modelo dado será usado para consultar o banco de dados. |
| tabela | Nome da tabela de banco de dados * (Apenas Banco de Dados) | Aplicável somente ao usar o serializador de banco de dados. |

## Migrações & Modelos
O provedor de autenticação pode gerar as migrações necessárias para você usando um comando *ace*. Apenas certifique-se de que o seguinte comando seja adicionado à lista de comandos.

```js
// bootstrap/app.js

const commands = [
  // ...,
  'Adonis/Commands/Auth:Setup'
]
```

```bash
# Running Setup Command

./ace auth:setup
```

Saída:

```bash
create: app/Model/User.js
create: database/migrations/1463212428511_User.js
create: app/Model/Token.js
create: database/migrations/1463212428512_Token.js
```

## Exemplo básico
Vamos começar com um exemplo básico de criação de um aplicativo simples para *login* e exibição do perfil de um usuário conectado.

```js
// app/Http/routes.js

'use strict'

const Route = use('Route')

Route.get('profile', 'UsersController.profile')
Route.post('login', 'UsersController.login')
```

```js
// app/Http/Controllers/UsersController.js

'use strict'

class UsersController {

  * login (request, response) {
    const email = request.input('email')
    const password = request.input('password')
    const login = yield request.auth.attempt(email, password) <1>

    if (login) {
      response.send('Logged In Successfully')
      return
    }

    response.unauthorized('Invalid credentails')
  }

}
```

Uma vez que o provedor de autenticação esteja configurado, você pode usar a propriedade 'auth' na instância 'request' para autenticar um usuário ou verificar o estado da autenticação.

Vamos escrever outro método para mostrar o perfil de um usuário só se eles estiverem logados.

```js
// Showing User Profile

* profile (request, response) {
  const user = yield request.auth.getUser()
  if (user) {
    response.ok(user)
    return
  }
  response.unauthorized('You must login to view your profile')
}
```

## Autenticação Baseada em Sessão
Abaixo está a lista de métodos que você pode usar no autenticador "sessão".

#### attempt(uid, senha)
Tentativa de login do usuário usando o uid e senha. Ele lançará um erro se não conseguir encontrar o usuário ou se a senha estiver incorreta.

```js
try {
  yield request.auth.attempt(uid, password)
} catch (e) {
  yield request.with({error: e.message}).flash()
  response.redirect('back')
}
```

#### login(usuário)
Login de um usuário usando a instância do modelo de usuário.

```js
const user = yield User.find(1)
try {
  yield request.auth.login(user)
  response.redirect('/dashboard')
} catch (e) {
  yield request.with({error: e.message}).flash()
  response.redirect('back')
}
```

#### loginViaId(id)
Login do usuário usando o ID. Uma pesquisa no banco de dados será realizada para garantir que o usuário realmente exista, caso contrário, uma exceção será lançada.

```js
try {
  yield request.auth.loginViaId(1)
  response.redirect('/dashboard')
} catch (e) {
  yield request.with({error: e.message}).flash()
  response.redirect('back')
}
```

#### logout
Logout um usuário já conectado.

```js
yield request.auth.logout()
```

#### verificar
Verifique se um usuário está logado ou não.

```js
const isLoggedIn = yield request.auth.check()
if (!isLoggedIn) {
  response.redirect('/login')
}
```

#### validate(uid, senha)
Valide as credenciais do usuário para ver se elas são válidas. Este método nunca irá definir qualquer sessão/cookie.

```js
try {
  yield request.auth.validate(uid, password)
} catch (e) {
  yield request.with({error: e.message}).flash()
  response.redirect('back')
}
```

## Autenticação básica
Abaixo está a lista de métodos disponíveis para o autenticador *basic auth*.

> NOTE:
> As credenciais de autenticação básica são codificadas em Base64 e enviadas como o cabeçalho *Autorização*. Exemplo: "Autorização=usuário:senha"

#### verificar
Verifique se as credenciais de autenticação básica estão presentes no cabeçalho "Authorization".

```js
const isLoggedIn = yield request.auth.check()
if (!isLoggedIn) {
  response.redirect('/login')
}
```

#### validate(uid, senha)
Valide as credenciais do usuário para ver se são válidas ou não.

```js
try {
  yield request.auth.validate(uid, password)
} catch (e) {
  response.unauthorized({error: e.message})
}
```

## JWT
Os autenticadores JWT exigem um par de atributos extras no bloco de configuração.

> NOTE:
> O JWT é enviado como o cabeçalho *Authorization*. Exemplo: `Authorization=Bearer JWT_TOKEN`

```js
// config/auth.js

{
  authenticator: 'jwt',
  jwt: {
    serializer: 'Lucid',
    scheme: 'jwt',
    model: 'App/Model/User',
    secret: Config.get('app.appKey'),
    options: {
      // Options to be used while generating token
    }
  }
}
```

##### Opções Adicionais

| Chave | Valores Disponíveis | Valor Padrão | Descrição |
|-----|------------------|---------------|--------------|
| algoritmo | HS256, HS384 | HS256 | Algoritmo a ser utilizado para gerar o token |
| expiresIn | valido em segundos ou [ms string](https://github.com/rauchg/ms.js) | null | Quando o token expira |
| notBefore | valido em segundos ou [ms string](https://github.com/rauchg/ms.js) | null | Até quando pelo menos para manter o token válido |
| público-alvo | String | null | Um valor a ser verificado contra o `aud` |
| issuer | Array ou String | null | Valor a ser usado para `iss`. |
| assunto | String | null | Um valor a ser verificado contra o `sub`. |

#### verificar
Funciona da mesma forma que os outros

```js
const isLoggedIn = yield request.auth.check()
if (!isLoggedIn) {
  response.unauthorized({error: 'Your must be loggedin to access this resource.'})
}
```

#### gerar(usuário, [payload personalizado])
Gera um JWT para um usuário dado.

```js
const user = yield User.find(1)
const token = yield request.auth.generate(user)
```

O segundo parâmetro opcional permite passar detalhes e objetos personalizados no JWT para um usuário específico.

```js
const user = yield User.find(1)
const token = yield request.auth.generate(user, { 
  username: 'GreatScott',
  account_type: 'admin'
})
```

Isso lhe daria o seguinte em seu JWT no cliente:

```js
import jwtDecode from 'jwt-decode'
const decoded = jwtDecode(data.data.jwt)
console.log(decoded)
/* 
{
  iat: 1491568810
  payload: {
    uid: 1,
    data: {
      account_type: "admin",
      username: "GreatScott"
    }
  }
}
*/
```

#### validate(uid, senha)
Valide as credenciais do usuário para ver se são válidas ou não.

```js
try {
  yield request.auth.validate(uid, password)
} catch (e) {
  response.unauthorized({error: e.message})
}
```

#### attempt(uid, senha, [payload personalizado])
Valida as credenciais do usuário e gera um JWT se as credenciais forem válidas. Ele também pode aceitar uma carga útil opcional personalizada, como no exemplo "gerar ()" acima.

```js
try {
  const token = yield request.auth.attempt(uid, password)
} catch (e) {
  response.unauthorized({error: e.message})
}
```

## Token de API
Tokens de API pessoal são como senha para uma conta específica. A maioria dos aplicativos web oferece autenticação baseada em API, para que seus clientes possam gerar esses tokens para desenvolvedores sem compartilhar suas informações reais de login.

> NOTE:
> Token da API é enviado como o cabeçalho *Autorização*. Exemplo: `Autorização=Bearer API_TOKEN`

1. Os tokens da API são salvos no banco de dados correspondente a um usuário específico.
2. Você pode definir um tempo de expiração para um token ou defini-lo como nulo para tokens que não expiram.
3. Você pode revogar um único/todos os tokens para um usuário específico.

```js
// config/auth.js

authenticator: 'api',
api: {
  serializer: 'Lucid',
  scheme: 'api',
  model: 'App/Model/Token',
  expiry: '30d'
}
```

### Configuração de Relação Token/Usuário
O modelo Token precisa ter uma relação com o modelo Usuário para salvar os tokens de forma fácil. Certifique-se de definir a relação entre ambos os modelos conforme abaixo.

> DICA:
> Faça uso do comando `auth:setup` para gerar os modelos/migrações e definir as relações para você.

```js
// app/Model/Token.js

'use strict'

const Lucid = use('Lucid')

class Token extends Lucid {
  user () {
    return this.belongsTo('App/Model/User')
  }
}
```

```js
// app/Model/User.js

'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  apiTokens () {
    return this.hasMany('App/Model/Token')
  }
}
```

### Métodos
Abaixo está a lista de métodos disponíveis para serem usados com o autenticador "api".

#### verificar
Funciona da mesma forma que os outros

```js
const isLoggedIn = yield request.auth.check()
```

#### gerar(usuário, [expiração])
Gerar um token de API para um usuário específico e salvá-lo no banco de dados.

```js
const user = yield User.find(1)
const token = yield request.auth.generate(user)
```

#### revoke(user, tokens=Array)
Revogar/Excluir os tokens dados para um usuário dado.

```js
const user = yield User.find(1)
yield request.auth.revoke(user, [token])
```

#### revokeAll(usuário)
Revogar/Excluir todos os tokens para um usuário específico.

```js
const user = yield User.find(1)
yield request.auth.revokeAll(user)
```

#### revokeExcept(user, tokens=Array)
Revogar todos os tokens, exceto os dados.

```js
const user = yield User.find(1)
yield request.auth.revokeExcept(user, [token])
```

## Segurança de Rotas
Até agora você tem autenticado manualmente os usuários, o que pode levar a código duplicado em vários controladores. O middleware de autenticação do AdonisJS pode autenticar automaticamente as rotas e garantir que as solicitações sejam negadas quando o usuário final não estiver conectado.

Certifique-se de que o *Middleware de Autenticação* esteja registrado como um middleware nomeado dentro do arquivo `app/Http/kernel.js`.

```js
// app/Http/kernel.js

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth'
}
```

Agora você está pronto para aproveitar o `auth` middleware em suas rotas.

```js
// app/Http/routes.js

Route
  .get('users/profile', 'UsersController.profile')
  .middleware('auth')
```

Além disso, você pode definir um autenticador diferente passando argumentos para o middleware de autenticação em tempo de execução.

```js
Route
  .get('users/profile', 'UsersController.profile')
  .middleware('auth:basic')
```

## Switching Between Authenticators
Você também pode alternar entre diferentes autenticadores usando o método 'authenticator'.

```js
const jwt = request.auth.authenticator('jwt')
const basicAuth = request.auth.authenticator('basic')
const api = request.auth.authenticator('api')

yield jwt.check()
yield basicAuth.check()
yield api.check()
```

## Auxiliares
Helpers facilita a recuperação do usuário atualmente conectado durante uma requisição HTTP.

### Baseada em Sessão
Você pode acessar a propriedade `currentUser` no objeto de requisição e como um global dentro das suas views quando o usuário final estiver logado via autenticador `session`.

```js
request.currentUser // logged in user
```

```twig
{{ currentUser }}
```

### Todos Outros Autenticadores
Todos os outros autenticadores como *JWT*, *Basic Auth* e *API Token* terão acesso ao usuário atualmente conectado como a propriedade `authUser` no objeto de requisição.

```js
request.authUser // authenticated user instance
```

## Extendendo o provedor de autenticação
É bastante simples estender o provedor adicionando novos *serializadores* ou *esquemas*. A etapa importante é entender a necessidade de ambos.

```js
// bootstrap/extend.js

Ioc.extend('Adonis/Src/AuthManager', 'mongo', function (app) {
  return new MongoSerializer()
}, 'serializer')

// Or

Ioc.extend('Adonis/Src/AuthManager', 'fingerprint', function (app) {
  // adonis will initiate the scheme itself for each request.
  return FingerPrint
}, 'scheme')
```

### Serializer
Serializer é usado para serializar/buscar o usuário da loja de dados usando seu identificador exclusivo. Também o serializer deve verificar a senha do usuário.

```js
'use strict'

class MongoSerializer {

  * findById (id, options) {
    // ...
  }

  * findByCredentials (email, options) {
    // ...
  }

  * findByToken (token, options) {
    // ...
  }

  * getUserForToken (tokenPayload, options) {
    // ...
  }

  * saveToken (userPayload, token, options, expiry) {
    // ...
  }

  * revokeTokens (userPayload, tokens, reverse) {
    // ...
  }

  * validateToken (tokenPayload, options) {
    // ...
  }

  * validateCredentials (userPayload, password, options) {
    // ...
  }

  primaryKey(authenticatorOptions) {
    // ...
  }

}
```

1. *findById* - Este método deve encontrar um usuário usando o identificador exclusivo e retornar o objeto do usuário. Por exemplo: o serializador Lucid retornará a instância do modelo de Usuário.
2. *findByCredentials* - O método deve encontrar um usuário usando o campo de nome (uid) definido dentro do arquivo 'config/auth.js' e retornar o objeto do usuário.
3. *findByToken* - Este método deve retornar o objeto "token" usando um token único.
4. *getUserForToken* - Aqui retornamos o objeto 'usuário' usando o objeto 'token' retornado pelo método *findByToken*.
5. *saveToken* - Salvar o token para um usuário específico. O token é gerado pelo próprio provedor de autenticação e você deve salvá-lo para uso posterior.
6. *revokeTokens* - Revogar um único/múltiplos tokens. Se "reverse=true" você deve revogar todos os tokens, exceto o passado como o segundo parâmetro.
7. *validateToken* - Aqui você deve validar a carga útil do token retornada pelo método *findByToken*. A verificação mais comum é verificar o vencimento.
8. *validateCredentials* - Este método é usado para verificar a senha do usuário contra a senha em texto simples.
9. *primaryKey* — Este método é usado para obter a definição da chave primária para garantir que a chave primária não seja nula para o usuário.

### Esquemas
Esquemas definem a forma de autenticar usuários. Por exemplo: Sessão, JWT, Autenticação básica, etc. Você pode adicionar seus próprios esquemas se necessário. Abaixo está a lista de métodos que seu esquema deve implementar.

> NOTE:
> Todos os métodos de seus esquemas são expostos ao usuário final. Isso significa que eles podem chamá-los diretamente usando a propriedade `auth` no objeto `request`.

```js
'use strict'

class FingerPrint {

  constructor (request, serializer, options) {
    this.request = request
    this.serializer = serializer
    this.options = options // config options
  }

  * check () {
    // ...
  }

  * getUser () {
    // ...
  }

}
```

1. *verificar* - O método "check" deve retornar um valor booleano indicando se um usuário está logado ou não. Você pode acessar os valores da requisição atual usando o parâmetro "request" passado para o construtor.
2. *getUser* - Deve retornar apenas a carga útil do usuário se o usuário estiver conectado. Caso contrário, deve retornar "nulo"
