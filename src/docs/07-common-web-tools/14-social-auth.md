# Autenticação social via Ally

O Ally é um provedor de autenticação social para AdonisJs. Ele torna super fácil autenticar usuários por meio de sites de terceiros como *Facebook*, *Twitter*, *Google*, etc. com o mínimo de esforço.

<iframe width="560" height="315" src="https://www.youtube.com/embed/SDKz5qLMeBI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Drivers
Abaixo está a lista de drivers oficialmente suportados, enquanto você é livre para contribuir e adicionar mais.

* Facebook (facebook)
* Google (google)
* Twitter (twitter)
* Github (github)
* LinkedIn (linkedin)
* Instagram (instagram)
* Four Square (foursquare)

## Sobre o Ally

1. O Ally é um provedor primário instalado e configurado para adicionar suporte para autenticação social.
2. Você precisa definir a configuração dentro do arquivo `config/services.js`. A configuração inclui um *ID do cliente*, *Segredo* e o *URI de redirecionamento*.
3. O Ally anexará um objeto chamado `ally` à instância [request](/docs/03-getting-started/06-request.md) para que você possa acessar os métodos dentro dos seus controladores.

## Configuração
Vamos começar com o processo de configuração, que é incrivelmente simples como sempre.

```bash
npm i --save adonis-ally
```

```js
// bootstrap/app.js

const providers = [
  // ...
  'adonis-ally/providers/AllyProvider'
  // ...
]
```

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/Ally'
  // ...
]
```

Depois que o processo de configuração for concluído com sucesso, você poderá autenticar seus usuários usando seus perfis sociais.

## Config
A configuração para ally é definida dentro do arquivo `config/services.js`. Você pode copiar a configuração de exemplo do [github](https://raw.githubusercontent.com/adonisjs/adonis-ally/develop/examples/config.js).

```js
// config/services.js

module.exports = {
  ally: {

    // Configuração para facebook
    facebook: {
      clientId: '',
      clientSecret: '',
      redirectUri: ''
    },

    // Configuração para github
    github: {
      clientId: '',
      clientSecret: '',
      redirectUri: ''
    }

  }
}
```

## Exemplo básico
Vamos começar com o exemplo básico de *Login com o Facebook*, onde autenticaremos os usuários usando o Facebook e criaremos suas contas de usuário sem uma senha.

::: warning OBSERVAÇÃO
Certifique-se de ter definido a configuração necessária para o Facebook dentro do arquivo `config/services.js`.
:::

```js
// Registrando Rotas

const Route = use('Route')

Route.get('facebook/login', 'LoginController.redirect')
Route.get('facebook/authenticated', 'LoginController.handleCallback')
```

```js
// Redirecionando o usuário para o provedor
// Primeiro, precisamos redirecionar o usuário para o Facebook para permitir que nosso aplicativo acesse seu perfil.

class LoginController {

  * redirect (request, response) {
    yield request.ally.driver('facebook').redirect()
  }

}
```

```js
// Lidando com o retorno de chamada do provedor

const User = use('App/Model/User')

class LoginController {

  * handleCallback (request, response) {
    const fbUser = yield request.ally.driver('facebook').getUser() <1>

    const searchAttr = {
      email: fbUser.getEmail()
    }

    const newUser = {
      email: fbUser.getEmail(),
      avatar: fbUser.getAvatar(),
      username: fbUser.getName()
    }

    const user = yield User.findOrCreate(searchAttr, newUser) <2>

    request.auth.loginViaId(user.id) <3>
  }

}
```

1. O método `getUser` buscará o perfil do usuário para o provedor fornecido. Este método só funciona quando o usuário foi redirecionado de volta para o `redirectUri`.
2. O `findOrCreate` é um método lúcido para encontrar um usuário com detalhes do usuário ou criar um novo usuário se não for possível encontrá-lo.
3. Finalmente, efetuamos login no usuário usando seu `id`.

## Métodos Ally
Abaixo está a lista de métodos disponíveis expostos pelo provedor Ally.

#### `driver`
Selecione o driver

```js
request.ally.driver('facebook')
```

#### `redirect`
Redireciona o usuário para o site do provedor

```js
yield request.ally.driver('facebook').redirect()
```

#### `getRedirectUrl`
Retorna a URL de redirecionamento para um determinado provedor

```js
yield request.ally.driver('facebook').getRedirectUrl()
```

#### `scope`
Atualiza os escopos a serem usados ​​para pedir permissão.

```js
yield request.ally.driver('facebook')
  .scope(['public_profile', 'email', 'user_friends'])
  .redirect()
```

#### `getUser`
Retorna o perfil do usuário para um determinado provedor

```js
yield request.ally.driver('facebook').getUser()
```

#### `fields`
Defina campos personalizados ao tentar acessar o perfil do usuário.

```js
yield request.ally.driver('facebook')
  .fields(['email', 'verified']) <1>
  .getUser()
```

::: warning OBSERVAÇÃO
Certifique-se de acessar campos adicionais usando o método [getOriginal](#getoriginal) na instância do usuário.
:::

## Métodos do usuário
Abaixo está a lista de métodos a serem usados ​​para buscar detalhes do perfil do usuário. Todos esses métodos são chamados em *Instância do usuário* retornada por [getUser](#getuser).

#### `getName`
```js
const user = yield request.ally.driver('facebook').getUser()
user.getName()
```

#### `getEmail`
```js
const user = yield request.ally.driver('facebook').getUser()
user.getEmail()
```

#### `getNickname`
```js
const user = yield request.ally.driver('facebook').getUser()
user.getNickname()
```

#### `getAvatar`
```js
const user = yield request.ally.driver('facebook').getUser()
user.getAvatar()
```

#### `getAccessToken`
```js
const user = yield request.ally.driver('facebook').getUser()
user.getAccessToken()
```

#### `getRefreshToken`
Retorna o token de atualização a ser usado quando o token de acesso tiver expirado. Ele só é retornado ao usar *OAuth2*, e o provedor suporta expiração de token de acesso.

```js
const user = yield request.ally.driver('facebook').getUser()
user.getRefreshToken()
```

#### `getExpires`
Tempo de expiração do token de acesso em milissegundos. Ele só é retornado ao usar *OAuth2*, e o provedor suporta expiração do token de acesso.

```js
const user = yield request.ally.driver('facebook').getUser()
user.getExpires()
```

#### `getTokenSecret`
Retorna o segredo do token de acesso. Ele só é retornado ao usar *OAuth1*.

::: tip DICA
O Twitter é o único driver que faz uso do OAuth1.
:::

```js
const user = request.ally.driver('twitter').getUser()
user.getTokenSecret()
```

#### `getOriginal`
Retorna a resposta original do provedor.

```js
const user = request.ally.driver('twitter').getUser()
user.getOriginal()
```
