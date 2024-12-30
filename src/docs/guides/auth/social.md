# Autenticação social

Junto com a autenticação padrão, o AdonisJS também vem com um pacote para ajudar você a implementar autenticação social com provedores OAuth como **Google**, **Twitter**, **GitHub** e assim por diante.

::: code-group

```sh [Instale]
npm i @adonisjs/ally@4.1.5
```

```sh [Configure]
node ace configure @adonisjs/ally

# CREATE: contracts/ally.ts
# CREATE: config/ally.ts
# UPDATE: .env,.env.example
# UPDATE: tsconfig.json { types += "@adonisjs/ally" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/ally" }
```

```ts [Validar variáveis ​​de ambiente]
/**
 * Certifique-se de validar as variáveis ​​de ambiente necessárias
 * pelos drivers sociais configurados.
 *
 * A seguir está um exemplo de validação das variáveis ​​de ambiente para
 * o provedor do Google
 */

export default Env.rules({
  // Outras regras de validação
  GOOGLE_CLIENT_ID: Env.schema.string(),
  GOOGLE_CLIENT_SECRET: Env.schema.string(),
})
```

:::

- Suporte para vários provedores. **Google**, **Twitter**, **LinkedIn**, **Facebook**, **Discord**, **Spotify** e **GitHub**
- API extensível para adicionar provedores sociais personalizados

&nbsp;

* [Visualizar no npm](https://npm.im/@adonisjs/ally)
* [Visualizar no GitHub](https://github.com/adonisjs/ally)

## Config
A configuração dos provedores sociais é armazenada dentro do arquivo `config/ally.ts`. Você pode definir um ou mais provedores usando o mesmo driver subjacente ou um diferente.

```ts
const allyConfig: AllyConfig = {
  github: {
    driver: 'github',
    clientId: Env.get('GITHUB_CLIENT_ID'),
    clientSecret: Env.get('GITHUB_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:3333/github',
  },
  twitter: {
    driver: 'twitter',
    clientId: Env.get('TWITTER_CLIENT_ID'),
    clientSecret: Env.get('TWITTER_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:3333/twitter',
  },
}

export default allyConfig
```

#### `driver`
Nome do driver a ser usado. Deve ser sempre um dos seguintes drivers disponíveis.

- `google`
- `twitter`
- `github`
- `discord`
- `facebook`
- `linkedin`
- `spotify`

#### `clientId`
O ID do cliente do provedor OAuth. Você deve mantê-lo com segurança dentro das variáveis ​​de ambiente.

#### `clientSecret`
O segredo do cliente do provedor OAuth. Você deve mantê-lo com segurança dentro das variáveis ​​de ambiente.

#### `callbackUrl`
A URL de retorno de chamada para manipular a resposta de redirecionamento de postagem do provedor OAuth. Você deve registrar a mesma URL com o provedor OAuth também.

### Configurando novos provedores
Você também pode configurar novos provedores após a configuração inicial. O primeiro passo é registrá-los dentro do arquivo `contracts/ally.ts` na interface `SocialProviders`.

```ts
// contracts/ally.ts

declare module '@ioc:Adonis/Addons/Ally' {
  interface SocialProviders {
    github: {
      config: GithubDriverConfig
      implementation: GithubDriverContract
    }
    twitter: {
      config: TwitterDriverConfig
      implementation: TwitterDriverContract
    }
  }
}
```

Depois de adicionar o novo provedor dentro do arquivo contracts, o compilador TypeScript validará automaticamente o arquivo de configuração, forçando você a definir a configuração para ele também.

## Autenticar solicitações
Após o processo de configuração, você pode acessar o objeto `ally` dentro dos seus manipuladores de rota usando a propriedade `ctx.ally` e redirecionar o usuário para o site do provedor OAuth.

```ts
Route.get('/github/redirect', async ({ ally }) => {
  return ally.use('github').redirect()
})
```

### Lidando com a solicitação de retorno de chamada

Assim que o usuário decidir aprovar/desaprovar a solicitação de login, o provedor OAuth redirecionará o usuário de volta para `callbackUrl`.

Dentro dessa rota, você deve lidar com todos os casos de uso para o estado de falha antes de acessar o usuário.

```ts
Route.get('/github/callback', async ({ ally }) => {
  const github = ally.use('github')

  /**
   * O usuário negou explicitamente a solicitação de login
   */
  if (github.accessDenied()) {
    return 'Access was denied'
  }

  /**
   * Não é possível verificar o estado do CSRF
   */
  if (github.stateMisMatch()) {
    return 'Request expired. Retry again'
  }

  /**
   * Ocorreu um erro desconhecido durante o redirecionamento
   */
  if (github.hasError()) {
    return github.getError()
  }

  /**
   * Por fim, acesse o usuário
   */
  const user = await github.user()
})
```

### Marcando o usuário como conectado
O Ally se desvincula do fluxo de autenticação usado pelo seu aplicativo. Sua única função é gerenciar o ciclo de vida de uma solicitação OAuth e fornecer os detalhes do usuário compartilhados pelo provedor OAuth.

Assim que tiver os detalhes do usuário, você pode decidir como armazená-los e autenticar o usuário no seu aplicativo. Por exemplo: após o login no GitHub, você pode criar uma nova conta de usuário e, em seguida, criar uma sessão usando o [web authentication guard](./web-guard.md). Por exemplo:

```ts
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/github/callback', async ({ ally, auth }) => {
  const github = ally.use('github')

  /**
   * Gerenciando estados de erro aqui
   */

  const githubUser = await github.user()

  /**
   * Encontre o usuário por e-mail ou crie
   * um novo
   */
  const user = await User.firstOrCreate({
    email: githubUser.email,
  }, {
    name: githubUser.name,
    accessToken: githubUser.token.token,
    isVerified: githubUser.emailVerificationState === 'verified'
  })

  /**
   * Login do usuário usando o web guard
   */
  await auth.use('web').login(user)
})
```

## Definir escopos

Você pode definir os escopos do OAuth passando um retorno de chamada para o método `redirect`. O retorno de chamada recebe a solicitação de redirecionamento como o primeiro parâmetro, e você pode definir escopos usando o método `redirectRequest.scopes`.

::: info NOTA
Você também pode configurar o mesmo conjunto de escopos dentro do arquivo `config/ally.ts`, e nós os usaremos em todas as solicitações de redirecionamento.

```ts
{
  github: {
    driver: 'github',
    // ... resto da configuração
    scopes: ['user:email']
  }
}
```
:::

```ts
Route.get('/github/redirect', async ({ ally }) => {
  return ally
    .use('github')
    .redirect((redirectRequest) => {            // [!code highlight]
      redirectRequest.scopes(['gist', 'user'])  // [!code highlight]
    })                                          // [!code highlight]
})
```

Os escopos variam com base no provedor OAuth subjacente. No entanto, você pode contar com o TypeScript IntelliSense para listar todas as opções disponíveis para você.

Além disso, para alguns dos drivers (por exemplo, Google), a lista de escopos é muito longa e, portanto, não fornecemos IntelliSense para todos eles, e você deve consultar a documentação do provedor OAuth.

![](/docs/assets/ally-intellisense.webp)

::: danger ATENÇÃO
Se você quiser personalizar o driver Discord, ele precisa ter o escopo `identify` presente para funcionar corretamente.
Você pode encontrar mais informações sobre ele [aqui](https://discord.com/developers/docs/resources/user#get-current-user).
:::

## Definir outros parâmetros de string de consulta
Você também pode definir parâmetros de string de consulta personalizados na solicitação de redirecionamento usando o método `redirectRequest.param`. Por exemplo: Defina o `prompt` e o `access_type` para o provedor do Google.

```ts
Route.get('/google/redirect', async ({ ally }) => {
  return ally
    .use('google')
    .redirect((redirectRequest) => {        // [!code highlight]
      redirectRequest                       // [!code highlight]
        .param('access_type', 'offline')    // [!code highlight]
        .param('prompt', 'select_account')  // [!code highlight]
    })                                      // [!code highlight]
})
```

## Propriedades do usuário
A seguir está a lista de propriedades do usuário retornadas pelo método `ally.user`. As propriedades são consistentes entre todos os drivers subjacentes, e você pode acessar a resposta original usando a propriedade `user.original`.

```ts
const user = await ally.use('github').user()

console.log(user.id)
console.log(user.email)
// e assim por diante
```

#### `id`
Um id exclusivo retornado pelo provedor OAuth.

#### `nickName`
A propriedade `nickName` se refere ao nome publicamente visível para o provedor OAuth. O valor da propriedade `name` é usado quando não há um apelido diferente.

#### `name`
O nome do usuário retornado na resposta do provedor OAuth.

#### `email`
O endereço de e-mail associado do usuário.

#### `emailVerificationState`
Descubra se o endereço de e-mail do usuário foi verificado com o provedor OAuth ou não. O estado é sempre um dos seguintes.

- `verified` representa que o e-mail foi verificado.
- `unverified` representa que o e-mail não foi verificado com o provedor OAuth.
- `unsupported` significa que o provedor OAuth não compartilha se o e-mail foi verificado ou não. Por exemplo, o Twitter não compartilha o status de verificação de um e-mail.

#### `avatarUrl`
A URL HTTP(s) para a foto do perfil público do usuário.

#### `token`
A propriedade `token` é a referência ao objeto de token de acesso subjacente. O objeto token tem as seguintes subpropriedades.

| Propriedade     | Protocolo             | Descrição   |
|-----------------|-----------------------|-------------|
| `token`         | **Oauth2 and Oauth1** | O valor do token de acesso                                                        |
| `secret`        | **Oauth1**            | O segredo do token. Atualmente, o Twitter é o único provedor que usa o Oauth1.0   |
| `type`          | **Oauth2**            | O tipo de token.                                                                  |
| `refreshToken`  | **Oauth2**            | Só existe se o provedor subjacente suportar tokens de atualização.                |
| `expiresAt`     | **Oauth2**            | Uma instância da classe luxon DateTime que representa o tempo absoluto em que o token de acesso irá expirar.  |
| `expiresIn`     | **Oauth2**            | Valor em segundos após o qual o token irá expirar. É um valor estático e não muda com o passar do tempo       |

#### `original`
Referência à resposta original do provedor OAuth.

```ts
const githubUser = await github.user()
console.log(githubUser.original)
```

## Obter usuário do token
Você pode recuperar os detalhes do usuário de um token de acesso pré-existente usando o método `ally.userFromToken`.

```ts
Route.get('/github/user', async ({ ally }) => {
  const user = await ally
    .use('github')
    .userFromToken(accessToken)
})
```

Para um driver OAuth1 (por exemplo, Twitter), você pode obter os detalhes do usuário usando os valores `token` e `secret`.

```ts
Route.get('/twitter/user', async ({ ally }) => {
  const user = await ally
    .use('twitter')
    .userFromTokenAndSecret(token, secret)
})
```

## Autenticação sem estado
O ciclo de vida de uma solicitação OAuth (redirecionamento + retorno de chamada) é com estado, pois armazena um token CSRF dentro de cookies. No entanto, você pode desabilitar a verificação CSRF chamando o método `stateless`.

```ts
Route.get('/github/redirect', async ({ ally }) => {
  return ally.use('github').stateless().redirect()
})
```

Além disso, certifique-se de desabilitar a verificação CSRF no momento da recuperação do usuário.

```ts
Route.get('/github/callback', async ({ ally }) => {
  const github = ally.use('github').stateless()

  const user = await github.user()
})
```

## Outros métodos/propriedades
A seguir está a lista de outros métodos e propriedades disponíveis.

### `redirectUrl`
O método `redirectUrl` retorna a URL de redirecionamento como uma string. Não definiremos nenhum `state` se você decidir executar um redirecionamento manualmente buscando a URL de redirecionamento primeiro.

```ts
const url = await ally.use('github').redirectUrl()
```

### `accessToken`
Retorna o token de acesso trocando o código de redirecionamento de postagem com o provedor OAuth. O método `user` contém o token de acesso, portanto, não há necessidade de buscá-lo separadamente.

```ts
const token = await ally.use('github').accessToken()
```

### `hasCode`
Descubra se a solicitação de redirecionamento tem o código de autorização.

```ts
if(ally.use('github').hasCode()) {
}
```

### `getCode`
Retorna o código de autorização.

```ts
if(ally.use('github').hasCode()) {
  console.log(ally.use('github').getCode())
}
```

## Referência de configuração
A seguir está a lista de opções de configuração disponíveis para todos os drivers oficialmente disponíveis.

<details>
  <summary>GitHub</summary>

```ts
github: {
  driver: 'github',
  clientId: '',
  clientSecret: '',
  callbackUrl: '',

  // Específico do GitHub
  login: 'adonisjs',
  scopes: ['user', 'gist'],
  allowSignup: true,
}
```

</details>

<details>
  <summary>Google</summary>

```ts
google: {
  driver: 'google',
  clientId: '',
  clientSecret: '',
  callbackUrl: '',

  // Específico do Google
  prompt: 'select_account',
  accessType: 'offline',
  hostedDomain: 'adonisjs.com',
  display: 'page',
  scopes: ['userinfo.email', 'calendar.events'],
}
```

</details>

<details>
  <summary>Twitter</summary>

```ts
twitter: {
  driver: 'twitter',
  clientId: '',
  clientSecret: '',
  callbackUrl: '',
}
```

</details>

<details>
  <summary>Discord</summary>

```ts
discord: {
  driver: 'discord',
  clientId: '',
  clientSecret: '',
  callbackUrl: '',

  // Específico do Discord
  prompt: 'consent' | 'none',
  guildId: '',
  disableGuildSelect: false,
  permissions: 10,
  // identificar o escopo é sempre necessário
  scopes: ['identify', 'email'],
}
```

</details>

<details>
  <summary>LinkedIn</summary>

```ts
linkedin: {
  driver: 'linkedin',
  clientId: '',
  clientSecret: '',
  callbackUrl: '',

  // Específico do  LinkedIn
  scopes: ['r_emailaddress', 'r_liteprofile'],
}
```

</details>

<details>
  <summary>Facebook</summary>

```ts
facebook: {
  driver: 'facebook',
  clientId: '',
  clientSecret: '',
  callbackUrl: '',

  // Específico do Facebook
  scopes: ['email', 'user_photos'],
  userFields: ['first_name', 'picture', 'email'],
  display: '',
  authType: '',
}
```

</details>

<details>
  <summary>Spotify</summary>

```ts
spotify: {
  driver: 'spotify',
  clientId: '',
  clientSecret: '',
  callbackUrl: '',

  // Específico do Spotify
  scopes: ['user-read-email', 'streaming'],
  showDialog: false
}
```

</details>

## Adicionando drivers personalizados
O Ally é extensível e permite que você adicione seus próprios drivers personalizados também. Nós criamos um [repositório boilerplate](https://github.com/adonisjs-community/ally-driver-boilerplate) para ajudar você a criar um driver personalizado do zero e publicá-lo como um pacote no npm.
