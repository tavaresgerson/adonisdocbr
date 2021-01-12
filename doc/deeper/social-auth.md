# Autenticação por Rede Social

Ally é um provedor de autenticação social de primeira parte para AdonisJs.

Usar o Ally torna trivial a autenticação de usuários por meio de sites de terceiros, como Google, Twitter e Facebook .

O Provedor Ally oferece suporte aos seguintes drivers:

* Facebook (`facebook`)
* Github (`github`)
* Google (`google`)
* Instagram (`instagram`)
* Linkedin (`linkedin`)
* Twitter (`twitter`)
* Foursquare (`foursquare`)

## Configuração
Como o provedor Ally não é instalado por padrão, precisamos baixá-lo do npm:
```bash
adonis install @adonisjs/ally
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

```js
// start/app.js
const providers = [
  '@adonisjs/ally/providers/AllyProvider'
]
```

A configuração da autenticação social é salva dentro do arquivo `config/services.js`, que é criado pelo comando `adonis install` 
ao instalar o Provedor Ally.

## Config
Sua configuração deve ser armazenada no arquivo `config/services.js` no objeto `ally`:
```js
// config/services.js

module.exports = {
  ally: {
    facebook: {}
  }
}
```

> Você sempre pode acessar o arquivo-fonte de configuração mais recente no [Github](https://github.com/adonisjs/adonis-ally/blob/master/templates/config.js).

## Exemplo Básico
Vamos começar com um exemplo básico de login usando o Facebook.

Primeiro, precisamos registrar as rotas para redirecionar o usuário ao Facebook e, em seguida, processar a 
resposta quando o usuário for redirecionado de volta do Facebook:

```js
// start/routes.js

Route.get('login/facebook', 'LoginController.redirect')
Route.get('facebook/callback', 'LoginController.callback')
```

> Certifique-se de que o provedor de autenticação e o middleware relacionado à 
> autenticação [estejam configurados corretamente](https://adonisjs.com/docs/4.1/authentication#_setup).

Em seguida, precisamos criar o controlador para implementar nossos métodos de rota:
```bash
adonis make:controller Login
```

```js
// app/Controllers/Http/LoginController.js

const User = use('App/Models/User')

class LoginController {
  async redirect ({ ally }) {
    await ally.driver('facebook').redirect()
  }

  async callback ({ ally, auth }) {
    try {
      const fbUser = await ally.driver('facebook').getUser()

      // detalhes do usuário a serem salvos
      const userDetails = {
        email: fbUser.getEmail(),
        token: fbUser.getAccessToken(),
        login_source: 'facebook'
      }

      // pesquisar por usuário existente
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

A API da Ally é consistente em todos os drivers, portanto, é fácil de trocar `facebook` para `google` ou qualquer outro driver exigido pelo seu aplicativo.

## API Ally
Abaixo está a lista de funções disponíveis.

#### redirect
Redirecione o usuário para o site de terceiros:
```js
await ally.driver('facebook').redirect()
```

#### getRedirectUrl
Obtenha o URL de redirecionamento de volta como uma string:
```js
const url = await ally.driver('facebook').getRedirectUrl()

return view.render('login', { url })
```

#### scope(scopesArray)
Defina os escopos de tempo de execução antes de redirecionar o usuário:
```js
await ally
  .driver('facebook')
  .scope(['email', 'birthday'])
  .redirect()
```

Verifique a documentação OAuth oficial do provedor relevante para obter uma lista de seus escopos disponíveis.

#### fields(fieldsArray)
Campos a serem buscados ao obter o perfil de usuário autenticado:
```js
await ally
  .driver('facebook')
  .fields(['username', 'email', 'profile_pic'])
  .getUser()
```

#### getUser
Obtenha o perfil de usuário de um usuário autenticado (retorna uma instância AllyUser ):
```js
await ally
  .driver('facebook')
  .fields(['email'])
  .getUser()
```

#### getUserByToken(accessToken, [accessSecret])
Retorna os detalhes do usuário usando accessToken:
```js
await ally.getUserByToken(accessToken)
```

Isso é útil ao usar o código do lado do cliente para executar a ação OAuth e você tem acesso ao `accessToken`.

> O parâmetro `accessSecret` é necessário quando o protocolo OAuth 1 é usado (por exemplo, o Twitter depende do OAuth 1).

## API do usuário
Abaixo está a lista de métodos disponíveis em uma instância [AllyUser](https://github.com/adonisjs/adonis-ally/blob/develop/src/AllyUser.js).

#### getId
Retorna o ID do usuário:
```js
const user = await ally.driver('facebook').getUser()

user.getId()
```

#### getName
Retorna o nome do usuário:
```js
user.getName()
```

#### getEmail
Retorna o e-mail do usuário:
```js
user.getEmail()
```

> Alguns provedores de terceiros não compartilham e-mail e, nesse caso, esse método retorna null.

#### getNickname
Retorna o apelido/nome de exibição do usuário:
```js
user.getNickname()
```

#### getAvatar
Retorna o URL público para a foto do perfil do usuário:
```js
user.getAvatar()
```

#### getAccessToken
Retorna o token de acesso que pode ser usado posteriormente para atualizar o perfil do usuário:
```js
user.getAccessToken()
```

#### getRefreshToken
Token de atualização a ser usado quando o token de acesso expirar:
```js
user.getRefreshToken()
```

> Disponível apenas quando o provedor terceirizado implementa OAuth 2 .

#### getExpires
Dados de validade do token de acesso:
```js
user.getExpires()
```

> Disponível apenas quando o provedor terceirizado implementa OAuth 2 .

#### getTokenSecret
Retorna segredo do token:
```js
user.getTokenSecret()
```

> Disponível apenas quando o provedor terceirizado implementa OAuth 1 .

#### getOriginal
Carga útil original retornada pelo provedor terceirizado:
```js
user.getOriginal()
```
