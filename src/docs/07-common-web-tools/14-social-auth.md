# Autenticação Social via Ally

Ally é um provedor de autenticação social para AdonisJs. Ele torna muito fácil a autenticação de usuários através de sites de terceiros como *Facebook*, *Twitter*, *Google*, etc. com esforços mínimos.

<iframe width="560" height="315" src="https://www.youtube.com/embed/SDKz5qLMeBI?si=4UWfqXDwEa1bTltM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Drivers
Abaixo está a lista de controladores oficialmente suportados enquanto você é livre para contribuir e adicionar mais.

Facebook (facebook)
* Google (google)
* Twitter (tweet)
* GitHub (github)
* LinkedIn (linkedin)
Instagram (instagram)
* Quatro Esquinas (quatro esquinas)

## Sobre a Ally

Ally é um provedor de 1ª parte instalado e configurado para adicionar suporte para autenticação social.
2. Você deve definir a configuração dentro do arquivo `config/services.js`. A configuração inclui um *Client ID*, *Secret* e o *Redirect URI*.
3. A Ally irá anexar um objeto chamado `ally` à instância de link:request[request] para que você possa acessar os métodos dentro dos seus controladores.

## Configuração
Vamos começar com o processo de configuração que é incrivelmente simples como sempre.

```bash
# Installing From Npm

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

Uma vez que o processo de configuração tenha sido feito com sucesso, você está pronto para autenticar seus usuários usando suas redes sociais.

## Configuração
A configuração para o Ally é definida dentro do arquivo config/services.js. Você pode copiar a configuração de amostra do link: https://raw.githubusercontent.com/adonisjs/adonis-ally/develop/examples/config.js [github].

```js
// config/services.js

module.exports = {
  ally: {

    // Configuration for facebook
    facebook: {
      clientId: '',
      clientSecret: '',
      redirectUri: ''
    },

    // Configuration for github
    github: {
      clientId: '',
      clientSecret: '',
      redirectUri: ''
    }

  }
}
```

## Exemplo básico
Vamos começar com o exemplo básico de *Login com Facebook*, onde autenticaremos os usuários usando o Facebook e criaremos suas contas de usuário sem senha.

> NOTE
> Certifique-se de ter definido a configuração necessária para o Facebook dentro do arquivo `config/services.js`.

```js
// Registering Routes

const Route = use('Route')

Route.get('facebook/login', 'LoginController.redirect')
Route.get('facebook/authenticated', 'LoginController.handleCallback')
```

Primeiro, precisamos redirecionar o usuário para o Facebook para permitir que nossa aplicação acesse seu perfil.

```js
// Redirecting User To The Provider

class LoginController {

  * redirect (request, response) {
    yield request.ally.driver('facebook').redirect()
  }

}
```

```js
// Handling Provider Callback

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

1. O método `getUser` buscará o perfil do usuário para o provedor dado. Este método só funciona quando o usuário é redirecionado de volta para o `redirectUri`.
2. O método 'findOrCreate' é um método claro para encontrar um usuário com detalhes do usuário ou criar um novo usuário se não conseguir encontrá-lo.
3. Finalmente, logamos o usuário usando seu 'id'.

## Ally Métodos
Abaixo está a lista de métodos disponíveis expostos pelo provedor Ally.

#### driver
Selecione o driver

```js
request.ally.driver('facebook')
```

#### redirecionar
Redirecione o usuário para o site do provedor

```js
yield request.ally.driver('facebook').redirect()
```

#### getRedirectUrl
Retorna a URL de redirecionamento para um provedor específico

```js
yield request.ally.driver('facebook').getRedirectUrl()
```

#### Amplo
Atualize os escopos a serem usados para pedir permissão.

```js
yield request.ally.driver('facebook')
  .scope(['public_profile', 'email', 'user_friends'])
  .redirect()
```

#### getUser
Retorna o perfil do usuário para um provedor dado

```js
yield request.ally.driver('facebook').getUser()
```

#### campos
Defina campos personalizados ao tentar acessar o perfil do usuário.

```js
yield request.ally.driver('facebook')
  .fields(['email', 'verified']) <1>
  .getUser()
```

> NOTE
> Certifique-se de acessar campos adicionais usando o método xref:_getoriginal[getOriginal] na instância do usuário.

## Métodos do Usuário
Abaixo está a lista de métodos para serem usados para buscar detalhes do perfil do usuário. Todos esses métodos são chamados em *Instância de Usuário* retornada por xref:_getuser [getUser].

#### getNome
```js
const user = yield request.ally.driver('facebook').getUser()
user.getName()
```

#### getEmail
```js
const user = yield request.ally.driver('facebook').getUser()
user.getEmail()
```

#### getNickname
```js
const user = yield request.ally.driver('facebook').getUser()
user.getNickname()
```

#### getAvatar
```js
const user = yield request.ally.driver('facebook').getUser()
user.getAvatar()
```

#### getAccessToken
```js
const user = yield request.ally.driver('facebook').getUser()
user.getAccessToken()
```

#### getRefreshToken
Retorna o token de atualização a ser utilizado quando o token de acesso tiver expirado. Ele só é retornado quando se utiliza *OAuth2*, e o provedor suporta o término do token de acesso.

```js
const user = yield request.ally.driver('facebook').getUser()
user.getRefreshToken()
```

#### getExpires
Tempo de expiração do token de acesso em milissegundos. É retornado somente quando usando *OAuth2*, e o provedor suporta tokens de acesso expirados.

```js
const user = yield request.ally.driver('facebook').getUser()
user.getExpires()
```

#### getTokenSecret
Retorna o token de acesso secreto. Ele só é retornado quando se utiliza o *OAuth1*.

> DICA
> O Twitter é o único driver que utiliza o OAuth 1.0.

```js
const user = request.ally.driver('twitter').getUser()
user.getTokenSecret()
```

#### get original
Retorna a resposta original do provedor.

```js
const user = request.ally.driver('twitter').getUser()
user.getOriginal()
```
