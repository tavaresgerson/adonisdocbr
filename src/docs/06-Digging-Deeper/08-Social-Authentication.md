# Autenticação Social

*Ally* é um provedor de autenticação social de primeira parte para AdonisJs.

Usar *Ally* torna trivial autenticar usuários por meio de sites de terceiros como *Google*, *Twitter* e *Facebook*.

O *Ally Provider* suporta os seguintes drivers:

- Facebook (`facebook`)
- Github (`github`)
- Google (`google`)
- Instagram (`instagram`)
- Linkedin (`linkedin`)
- Twitter (`twitter`)
- Foursquare (`foursquare`)

## Configuração
Como o *Ally Provider* não é instalado por padrão, precisamos obtê-lo do npm:

```bash
adonis install @adonisjs/ally
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/ally/providers/AllyProvider'
]
```

::: info NOTA
A configuração de autenticação social é salva dentro do arquivo `config/services.js`, que é criado pelo comando `adonis install` ao instalar o *Ally Provider*.
:::

## Config

Sua configuração deve ser armazenada dentro do objeto `ally` do arquivo `config/services.js`:

```js
// .config/services.js

module.exports = {
  ally: {
    facebook: {}
  }
}
```

::: tip DICA
Você sempre pode acessar o arquivo de origem da configuração mais recente no [Github](https://github.com/adonisjs/adonis-ally/blob/master/templates/config.js).
:::

## Exemplo básico
Vamos começar com um exemplo básico de login usando o *Facebook*.

Primeiro, precisamos registrar rotas para redirecionar o usuário para o Facebook e, em seguida, manipular a resposta quando o usuário for redirecionado de volta do Facebook:

```js
// .start/routes.js

Route.get('login/facebook', 'LoginController.redirect')
Route.get('facebook/callback', 'LoginController.callback')
```

::: warning OBSERVAÇÃO
Certifique-se de que o *Auth Provider* e o middleware relacionado à autenticação estejam [configurados corretamente](/docs/05-Security/02-Authentication.md#setup).
:::

Em seguida, precisamos criar o controlador para implementar nossos métodos de rota:

```bash
adonis make:controller Login
```

```js
// .app/Controllers/Http/LoginController.js

const User = use('App/Models/User')

class LoginController {
  async redirect ({ ally }) {
    await ally.driver('facebook').redirect()
  }

  async callback ({ ally, auth }) {
    try {
      const fbUser = await ally.driver('facebook').getUser()

      // user details to be saved
      const userDetails = {
        email: fbUser.getEmail(),
        token: fbUser.getAccessToken(),
        login_source: 'facebook'
      }

      // search for existing user
      const whereClause = {
        email: fbUser.getEmail()
      }

      const user = await User.findOrCreate(whereClause, userDetails)
      await auth.login(user)

      return 'Logged in'
    } catch (error) {
      return 'Unable to authenticate. Try again later'
    }
  }
}
```

Agora temos um sistema de login totalmente funcional em algumas linhas de código!

*A API do Ally* é consistente em todos os drivers, então é fácil trocar `facebook` por `google` ou qualquer outro driver necessário para seu aplicativo.

## API do Ally
Abaixo está a lista de funções disponíveis.

#### `redirect`
Redirecionar usuário para o site de terceiros:

```js
await ally.driver('facebook').redirect()
```

#### `getRedirectUrl`
Obter URL de redirecionamento de volta como uma string:

```js
const url = await ally.driver('facebook').getRedirectUrl()

return view.render('login', { url })
```

#### `scope(scopesArray)`
Definir escopos de tempo de execução antes de redirecionar o usuário:

```js
await ally
  .driver('facebook')
  .scope(['email', 'birthday'])
  .redirect()
```

::: warning OBSERVAÇÃO
Verifique a documentação oficial do OAuth do provedor relevante para obter uma lista de seus escopos disponíveis.
:::

#### `fields(fieldsArray)`
Campos a serem buscados ao obter o perfil de usuário autenticado:

```js
await ally
  .driver('facebook')
  .fields(['username', 'email', 'profile_pic'])
  .getUser()
```

#### `getUser`
Obtenha o perfil de usuário de um usuário autenticado (retorna uma instância [AllyUser](https://github.com/adonisjs/adonis-ally/blob/develop/src/AllyUser.js)):

```js
await ally
  .driver('facebook')
  .fields(['email'])
  .getUser()
```

#### `getUserByToken(accessToken, [accessSecret])`
Retorna os detalhes do usuário usando o `accessToken`:

```js
await ally.getUserByToken(accessToken)
```

Isso é útil ao usar o código do lado do cliente para executar a ação OAuth e você tem acesso ao `accessToken`.

::: warning OBSERVAÇÃO
O parâmetro `accessSecret` é necessário quando o protocolo *OAuth 1* é usado (por exemplo, o Twitter depende do OAuth 1).
:::

## API do usuário
Abaixo está a lista de métodos disponíveis em uma instância [AllyUser](https://github.com/adonisjs/adonis-ally/blob/develop/src/AllyUser.js).

#### `getId`
Retorna o ID do usuário:

```js
const user = await ally.driver('facebook').getUser()

user.getId()
```

#### `getName`
Retorna o nome do usuário:

```js
user.getName()
```

#### `getEmail`
Retorna o e-mail do usuário:

```js
user.getEmail()
```

::: warning OBSERVAÇÃO
Alguns provedores de terceiros não compartilham e-mail, nesse caso esse método retorna `null`.
:::

#### `getNickname`
Retorna o apelido/nome de exibição do usuário:

```js
user.getNickname()
```

#### `getAvatar`
Retorna a URL pública para a foto do perfil do usuário:

```js
user.getAvatar()
```

#### `getAccessToken`
Retorna o token de acesso que pode ser usado posteriormente para atualizar o perfil do usuário:

```js
user.getAccessToken()
```

#### `getRefreshToken`
Token de atualização a ser usado quando o token de acesso expirar:

```js
user.getRefreshToken()
```

::: warning OBSERVAÇÃO
Disponível somente quando o provedor terceirizado implementa *OAuth 2*.
:::

#### `getExpires`
Dados de expiração do token de acesso:

```js
user.getExpires()
```

::: warning OBSERVAÇÃO
Disponível somente quando o provedor terceirizado implementa *OAuth 2*.
:::

#### `getTokenSecret`
Retorna o segredo do token:

```js
user.getTokenSecret()
```

::: warning OBSERVAÇÃO
Disponível somente quando o provedor terceirizado implementa *OAuth 1*.
:::

#### `getOriginal`
Payload original retornado pelo provedor terceirizado:

```js
user.getOriginal()
```
