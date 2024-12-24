# Autenticação

Todo aplicativo da Web lida com Gerenciamento de Usuários e Autenticação em algum estágio. O provedor de autenticação AdonisJs é um sistema completo para autenticar solicitações HTTP usando vários autenticadores. Usando autenticadores, você pode construir sistemas de login tradicionais *baseados em sessão* para proteger *APIs REST*.

## Autenticadores
Cada autenticador é uma combinação de serializadores e um esquema de autenticação.

### Esquemas
* Sessões (sessão)
* Autenticação Básica (básico)
* JWT (jwt)
* Tokens de API Pessoais (api)

### Serializadores
* Lucid
* Banco de Dados

## Sobre Autenticação

1. A autenticação é dividida em duas categorias amplas de *Autenticação com Estado* e *Autenticação sem Estado*.
2. A autenticação baseada em sessão é considerada *Autenticação com Estado*, pois, uma vez conectado, o usuário pode navegar para diferentes áreas do aplicativo sem reenviar as credenciais.
3. *Autenticação sem estado* requer que o usuário final envie as credenciais em cada solicitação HTTP, o que é muito comum com APIs REST.
4. O AdonisJs fornece as ferramentas e ajudantes necessários para gerenciar ambos os tipos de autenticação com facilidade.
5. O provedor de autenticação fará uso do módulo [Hash](/docs/09-security/04-encryption-and-hashing.md) para verificar senhas. Certifique-se de [fazer hash de suas senhas](/docs/06-lucid/03-hooks.md#basic-example) antes de salvá-las no banco de dados.

## Config
A configuração para autenticação é salva dentro do arquivo `config/auth.js`. Por padrão, ele faz uso do autenticador `session` para autenticar solicitações.

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

| Chave       | Valores                                                     | Descrição       |
|-------------|-------------------------------------------------------------|-----------------|
| serializer  | Lucid, Database                                             | Serializador a ser usado para buscar o usuário no banco de dados.  |
| scheme      | session, basic, jwt, api                                    | Esquema a ser usado para buscar e autenticar credenciais de usuário. |
| uid         | Nome do campo do banco de dados                             | Campo do banco de dados a ser usado como identificador exclusivo para um determinado usuário.  |
| password    | Nome do campo do banco de dados                             | Campo a ser utilizado para verificação da senha do usuário  |
| model       | *Namespace* do modelo *(somente Lucid)*                     | Aplicável somente ao usar o serializador Lucid. O modelo fornecido será usado para consultar o banco de dados. |
| table       | Nome da tabela do banco de dados *(Somente banco de dados)* | Aplicável somente ao usar o serializador de banco de dados. |

## Migrações e Modelos
O provedor de autenticação pode gerar migrações necessárias para você usando um *comando ace*. Apenas certifique-se de que o comando a seguir seja adicionado à lista de comandos.

```js
// bootstrap/app.js

const commands = [
  // ...,
  'Adonis/Commands/Auth:Setup'
]
```

```bash
# Executando comando de configuração

./ace auth:setup
```

```bash
# Saída

create: app/Model/User.js
create: database/migrations/1463212428511_User.js
create: app/Model/Token.js
create: database/migrations/1463212428512_Token.js
```

## Exemplo básico
Vamos começar com um exemplo básico de criação de um aplicativo simples para *fazer login* e exibir o perfil de um usuário conectado.

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

1. Depois que o *provedor de autenticação* estiver configurado, você pode usar a propriedade `auth` na instância `request` para autenticar um usuário ou verificar o status da autenticação.

Vamos escrever outro método para mostrar o perfil de um usuário somente se ele estiver conectado.

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

## Autenticação baseada em sessão
Abaixo está a lista de métodos que você pode usar no autenticador `session`.

#### `attempt(uid, password)`
Tenta fazer login de um usuário usando o uid e a senha. Ele lançará um erro se não for possível encontrar o usuário ou se a senha for incompatível.

```js
try {
  yield request.auth.attempt(uid, password)
} catch (e) {
  yield request.with({error: e.message}).flash()
  response.redirect('back')
}
```

#### `login(user)`
Faça login de um usuário usando a instância do modelo de usuário.

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

#### `loginViaId(id)`
Faça login de um usuário usando o id. Uma pesquisa no banco de dados será realizada para garantir que o usuário exista, caso contrário, uma exceção será gerada.

```js
try {
  yield request.auth.loginViaId(1)
  response.redirect('/dashboard')
} catch (e) {
  yield request.with({error: e.message}).flash()
  response.redirect('back')
}
```

#### `logout`
Faça logout de um usuário conectado existente.

```js
yield request.auth.logout()
```

#### `check`
Verifique se um usuário está conectado ou não.

```js
const isLoggedIn = yield request.auth.check()
if (!isLoggedIn) {
  response.redirect('/login')
}
```

#### `validate(uid, password)`
Valide as credenciais do usuário para ver se são válidas. Este método nunca definirá nenhuma sessão/cookie.

```js
try {
  yield request.auth.validate(uid, password)
} catch (e) {
  yield request.with({error: e.message}).flash()
  response.redirect('back')
}
```

## Autenticação básica
Abaixo está a lista de métodos disponíveis para o autenticador *autenticação básica*.

::: warning OBSERVAÇÃO
As credenciais de autenticação básica são codificadas em base64 e enviadas como o cabeçalho *Authorization*. Exemplo: `Authorization=username:password`
:::

#### `check`
Verifique se as credenciais de autenticação básica estão presentes no cabeçalho `Authorization`.

```js
const isLoggedIn = yield request.auth.check()
if (!isLoggedIn) {
  response.redirect('/login')
}
```

#### `validate(uid, password)`
Valide as credenciais do usuário para ver se elas são válidas ou não.

```js
try {
  yield request.auth.validate(uid, password)
} catch (e) {
  response.unauthorized({error: e.message})
}
```

## JWT
Os autenticadores JWT exigem alguns atributos extras para o bloco de configuração.

::: warning OBSERVAÇÃO
O JWT é enviado como o cabeçalho *Authorization*. Exemplo: `Authorization=Bearer JWT_TOKEN`
:::

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
      // Opções a serem usadas durante a geração do token
    }
  }
}
```

Opções adicionais

| Chave     | Valores disponíveis | Valor padrão  | Descrição     |
|-----------|---------------------|---------------|---------------|
| algorithm | HS256, HS384        | HS256         | Algoritmo a ser usado para gerar token |
| expiresIn | tempo válido em segundos ou [ms string](https://github.com/rauchg/ms.js) | null | Quando expirar o token |
| notBefore | tempo válido em segundos ou [ms string](https://github.com/rauchg/ms.js) | null | Até quando pelo menos para manter o token válido |
| audience  | String              | null          | Um valor a ser verificado em relação ao `aud`   |
| issuer    | Array or String     | null          | Valor a ser usado para `iss`.                   |
| subject   | String              | null          | Um valor a ser verificado em relação ao `sub`.  |

#### `check`
Funciona da mesma forma que os outros

```js
const isLoggedIn = yield request.auth.check()
if (!isLoggedIn) {
  response.unauthorized({error: 'Your must be loggedin to access this resource.'})
}
```

#### `generate(user, [customPayload])`
Gera um JWT para um determinado usuário.

```js
const user = yield User.find(1)
const token = yield request.auth.generate(user)
```

O segundo parâmetro opcional permite que você passe detalhes e objetos personalizados para o JWT para um determinado usuário.

```js
const user = yield User.find(1)
const token = yield request.auth.generate(user, { 
  username: 'GreatScott',
  account_type: 'admin'
})
```

O que lhe daria o seguinte em seu JWT no cliente:

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

#### `validate(uid, password)`
Valida as credenciais do usuário para ver se são válidas ou não.

```js
try {
  yield request.auth.validate(uid, password)
} catch (e) {
  response.unauthorized({error: e.message})
}
```

#### `try(uid, password, [customPayload])`
Valida as credenciais do usuário e gera um JWT se as credenciais forem válidas. Ele também pode aceitar uma carga útil personalizada opcional, como no exemplo `generate()` acima.

```js
try {
  const token = yield request.auth.attempt(uid, password)
} catch (e) {
  response.unauthorized({error: e.message})
}
```

## Token de API
Os tokens de API pessoais são como a senha para uma determinada conta. A maioria dos aplicativos da Web oferece autenticação baseada em API para que seus clientes possam gerar esses tokens para desenvolvedores sem compartilhar seus detalhes de login reais.

::: warning OBSERVAÇÃO
O token de API é enviado como o cabeçalho *Authorization*. Exemplo: `Authorization=Bearer API_TOKEN`
:::

1. Os tokens de API são salvos no banco de dados correspondente a um determinado usuário.
2. Você pode definir a expiração para um token ou defini-lo como `null` para tokens que nunca expiram.
3. Você pode revogar um único/todos os tokens para um determinado usuário.

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

### Configurando o relacionamento Token/Usuário
O modelo `Token` precisa ter um relacionamento com o modelo `User` para salvar tokens com facilidade. Certifique-se de definir o relacionamento entre os dois modelos conforme definido abaixo.

::: tip DICA
Use o comando `auth:setup` para gerar os modelos/migrações e definir relacionamentos para você.
:::

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
Abaixo está a lista de métodos disponíveis para serem usados ​​com o autenticador `api`.

#### `check`
Funciona da mesma forma que os outros

```js
const isLoggedIn = yield request.auth.check()
```

#### `generate(user, [expiry])`
Gere um token de API para um determinado usuário e salve-o no banco de dados.

```js
const user = yield User.find(1)
const token = yield request.auth.generate(user)
```

#### `revoke(user, tokens=Array)`
Revogue/exclua os tokens fornecidos para um determinado usuário.

```js
const user = yield User.find(1)
yield request.auth.revoke(user, [token])
```

#### `revokeAll(user)`
Revogar/Excluir todos os tokens para um determinado usuário.

```js
const user = yield User.find(1)
yield request.auth.revokeAll(user)
```

#### `revokeExcept(user, tokens=Array)`
Revogar todos os tokens, exceto os fornecidos.

```js
const user = yield User.find(1)
yield request.auth.revokeExcept(user, [token])
```

## Protegendo rotas
Até agora, você tem autenticado usuários manualmente, o que pode levar a código duplicado em vários controladores. O AdonisJs Auth Middleware pode autenticar automaticamente as rotas e garante a negação das solicitações quando o usuário final não estiver conectado.

Certifique-se de que o *Auth Middleware* esteja registrado como um middleware nomeado dentro do arquivo `app/Http/kernel.js`.

```js
// app/Http/kernel.js

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth'
}
```

Agora você está pronto para aproveitar o middleware `auth` em suas rotas.

```js
// app/Http/routes.js

Route
  .get('users/profile', 'UsersController.profile')
  .middleware('auth')
```

Além disso, você pode definir um autenticador diferente passando argumentos para o middleware auth em tempo de execução.

```js
Route
  .get('users/profile', 'UsersController.profile')
  .middleware('auth:basic')
```

## Alternando entre autenticadores
Você também pode alternar entre diferentes autenticadores usando o método `authenticator`.

```js
const jwt = request.auth.authenticator('jwt')
const basicAuth = request.auth.authenticator('basic')
const api = request.auth.authenticator('api')

yield jwt.check()
yield basicAuth.check()
yield api.check()
```

## Helpers
Helpers facilitam a recuperação do usuário conectado no momento durante uma solicitação HTTP.

### Baseado em sessão
Você pode acessar a propriedade `currentUser` no objeto de solicitação e como um global dentro de suas visualizações quando o usuário final estiver conectado por meio do autenticador `session`.

```js
request.currentUser // usuário logado
```

```twig
{{ currentUser }}
```

### Todos os outros autenticadores
Todos os outros autenticadores como *JWT*, *Basic Auth* e *API Token* terão acesso ao usuário conectado no momento como propriedade `authUser` no objeto de solicitação.

```js
request.authUser // instância de usuário autenticado
```

## Estendendo o provedor de autenticação
É bastante simples estender o provedor adicionando novos *serializadores* ou *esquemas*. O passo importante é entender a necessidade de ambos.

```js
// bootstrap/extend.js

Ioc.extend('Adonis/Src/AuthManager', 'mongo', function (app) {
  return new MongoSerializer()
}, 'serializer')

// Ou

Ioc.extend('Adonis/Src/AuthManager', 'fingerprint', function (app) {
  // O adonis iniciará o esquema para cada solicitação.
  return FingerPrint
}, 'scheme')
```

### Serializador
O serializador é usado para serializar/buscar o usuário do armazenamento de dados usando seu identificador exclusivo. O serializador também deve verificar a senha do usuário.

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

1. *findById* - Este método deve encontrar um usuário usando o identificador exclusivo e retornar o objeto do usuário. Por exemplo: o serializador Lucid retornará a instância do modelo User.
2. *findByCredentials* - O método encontrará um usuário usando o nome do campo (uid) definido dentro do arquivo `config/auth.js` e deve retornar o objeto do usuário.
3. *findByToken* - Este método deve retornar o `objeto token` usando um token exclusivo.
4. *getUserForToken* - Aqui retornamos o `objeto usuário` usando o `objeto token` retornado pelo método *findByToken*.
5. *saveToken* - Salva o token para um determinado usuário. O token é gerado pelo próprio provedor de autenticação e você deve salvá-lo para uso posterior.
6. *revokeTokens* - Revoga um único/vários tokens. Se `reverse=true` você deve revogar todos os tokens, exceto o passado como o 2º parâmetro.
7. *validateToken* - Aqui você deve validar a carga útil do token retornada pelo método *findByToken*. A verificação mais comum é verificar a expiração.
8. *validateCredentials* - Este método é usado para verificar a senha do usuário em relação à senha simples.
9. *primaryKey* — Este método é usado para obter a definição da chave primária para garantir que a chave primária não seja nula para o usuário.

### Esquemas
Esquemas definem a maneira de autenticar usuários. Por exemplo: Sessão, JWT, Autenticação Básica etc. Você pode adicionar seus próprios esquemas, se necessário. Abaixo está a lista de métodos que seu esquema deve implementar.

::: info NOTA
Todos os métodos de seus esquemas são expostos ao usuário final. O que significa que eles podem chamar esses métodos diretamente usando a propriedade `auth` no objeto `request`.
:::

```js
'use strict'

class FingerPrint {

  constructor (request, serializer, options) {
    this.request = request
    this.serializer = serializer
    this.options = options // opções de configuração
  }

  * check () {
    // ...
  }

  * getUser () {
    // ...
  }

}
```

1. *check* - O método Check deve retornar um *booleano* indicando se um usuário está logado ou não. Você pode acessar os valores da solicitação atual usando o parâmetro `request` passado para o construtor.
2. *getUser* - Deve retornar a carga útil do usuário somente se o usuário estiver logado. Caso contrário, deve retornar `null`
