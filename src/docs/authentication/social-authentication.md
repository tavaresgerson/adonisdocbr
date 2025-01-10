---
resumo: Implemente autenticação social em seus aplicativos AdonisJS usando o pacote `@adonisjs/ally`.
---

# Autenticação social

Você pode implementar autenticação social em seus aplicativos AdonisJS usando o pacote `@adonisjs/ally`.
O Ally vem com os seguintes drivers integrados, juntamente com uma API extensível para [registrar drivers personalizados](#creating-a-custom-social-driver).

- Twitter
- Facebook
- Spotify
- Google
- GitHub
- Discord
- LinkedIn

O Ally não armazena nenhum usuário ou token de acesso em seu nome. Ele implementa os protocolos OAuth2 e OAuth1, autentica um usuário com serviço social e fornece detalhes do usuário. Você pode armazenar essas informações dentro de um banco de dados e usar o pacote [auth](./introduction.md) para fazer login do usuário em seu aplicativo.

## Instalação

Instale e configure o pacote usando o seguinte comando:

```sh
node ace add @adonisjs/ally

# Define providers as CLI flags
node ace add @adonisjs/ally --providers=github --providers=google
```

### Veja as etapas executadas pelo comando add

1. Instala o pacote `@adonisjs/ally` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/ally/ally_provider')
      ]
    }
    ```

3. Crie o arquivo `config/ally.ts`. Este arquivo contém as configurações para provedores OAuth selecionados.

4. Define as variáveis ​​de ambiente para armazenar `CLIENT_ID` e `CLIENT_SECRET` para provedores OAuth selecionados.

## Configuração
A configuração do pacote `@adonisjs/ally` é armazenada dentro do arquivo `config/ally.ts`. Você pode definir a configuração para vários serviços em um único arquivo de configuração.

Veja também: [Config stub](https://github.com/adonisjs/ally/blob/main/stubs/config/ally.stub)

```ts
import { defineConfig, services } from '@adonisjs/ally'

defineConfig({
  github: services.github({
    clientId: env.get('GITHUB_CLIENT_ID')!,
    clientSecret: env.get('GITHUB_CLIENT_SECRET')!,
    callbackUrl: '',
  }),
  twitter: services.twitter({
    clientId: env.get('TWITTER_CLIENT_ID')!,
    clientSecret: env.get('TWITTER_CLIENT_SECRET')!,
    callbackUrl: '',
  }),
})
```

### Configurando a URL de retorno de chamada
Os provedores OAuth exigem que você registre uma URL de retorno de chamada para manipular a resposta de redirecionamento após o usuário autorizar a solicitação de login.

A URL de retorno de chamada deve ser registrada com o provedor de serviços OAuth. Por exemplo: se você estiver usando o GitHub, você deve fazer login na sua conta do GitHub, [criar um novo aplicativo](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) e definir a URL de retorno de chamada usando a interface do GitHub.

Além disso, você deve registrar a mesma URL de retorno de chamada dentro do arquivo `config/ally.ts` usando a propriedade `callbackUrl`.

## Uso
Depois que o pacote for configurado, você pode interagir com as APIs do Ally usando a propriedade `ctx.ally`. Você pode alternar entre os provedores de autenticação configurados usando o método `ally.use()`. Por exemplo:

```ts
router.get('/github/redirect', ({ ally }) => {
  // GitHub driver instance
  const gh = ally.use('github')
})

router.get('/twitter/redirect', ({ ally }) => {
  // Twitter driver instance
  const twitter = ally.use('twitter')
})

// You could also dynamically retrieve the driver
router.get('/:provider/redirect', ({ ally, params }) => {
  const driverInstance = ally.use(params.provider)
}).where('provider', /github|twitter/)
```

### Redirecionando o usuário para autenticação
O primeiro passo na autenticação social é redirecionar o usuário para um serviço OAuth e esperar que ele aprove ou negue a solicitação de autenticação.

Você pode executar o redirecionamento usando o método `.redirect()`.

```ts
router.get('/github/redirect', ({ ally }) => {
  return ally.use('github').redirect()
})
```

Você pode passar uma função de retorno de chamada para definir escopos personalizados ou valores de string de consulta durante o redirecionamento.

```ts
router.get('/github/redirect', ({ ally }) => {
  return ally
    .use('github')
    .redirect((request) => {
      // highlight-start
      request.scopes(['user:email', 'repo:invite'])
      request.param('allow_signup', false)
      // highlight-end
    })
})
```

### Lidando com a resposta de retorno de chamada
O usuário será redirecionado de volta para o `callbackUrl` do seu aplicativo após aprovar ou negar a solicitação de autenticação.

Nesta rota, você pode chamar o método `.user()` para obter os detalhes do usuário conectado e o token de acesso. No entanto, você também deve verificar a resposta para possíveis estados de erro.

```ts
router.get('/github/callback', async ({ ally }) => {
  const gh = ally.use('github')

  /**
   * User has denied access by canceling
   * the login flow
   */
  if (gh.accessDenied()) {
    return 'You have cancelled the login process'
  }

  /**
   * OAuth state verification failed. This happens when the
   * CSRF cookie gets expired.
   */
  if (gh.stateMisMatch()) {
    return 'We are unable to verify the request. Please try again'
  }

  /**
   * GitHub responded with some error
   */
  if (gh.hasError()) {
    return gh.getError()
  }

  /**
   * Access user info
   */
  const user = await gh.user()
  return user
})
```

## Propriedades do usuário
A seguir está a lista de propriedades que você pode acessar a partir do valor de retorno da chamada do método `.user()`. As propriedades são consistentes entre todos os drivers subjacentes.

```ts
const user = await gh.user()

user.id
user.email
user.emailVerificationState
user.name
user.nickName
user.avatarUrl
user.token
user.original
```

### `id`
Um ID exclusivo retornado pelo provedor OAuth.

### `email`
O endereço de e-mail retornado pelo provedor OAuth. O valor será `null` se a solicitação OAuth não solicitar o endereço de e-mail do usuário.

### `emailVerificationState`
Muitos provedores OAuth permitem que usuários com e-mails não verificados façam login e autentiquem solicitações OAuth. Você deve usar este sinalizador para garantir que apenas usuários com e-mails verificados possam fazer login.

A seguir está a lista de valores possíveis.

- `verified`: O endereço de e-mail do usuário é verificado com o provedor OAuth.
- `unverified`: O endereço de e-mail do usuário não é verificado.
- `unsupported`: O provedor OAuth não compartilha o estado de verificação de e-mail.

### `name`
O nome do usuário retornado pelo provedor OAuth.

### `nickName`
Um apelido publicamente visível do usuário. O valor de `nickName` e `name` será o mesmo se o provedor OAuth não tiver nenhum conceito de apelidos.

### `avatarUrl`
A URL HTTP(s) para a foto do perfil público do usuário.

### `token`
A propriedade token é a referência ao objeto de token de acesso subjacente. O objeto token tem as seguintes subpropriedades.

```ts
user.token.token
user.token.type
user.token.refreshToken
user.token.expiresAt
user.token.expiresIn
```

| Property        | Protocol        | Description |
|-----------------|-----------------|-------------|
| `token`         | OAuth2 / OAuth1 | O valor do token de acesso. O valor está disponível para os protocolos `OAuth2` e `OAuth1`. |
| `secret`        | OAuth1          | O segredo do token aplicável somente para o protocolo `OAuth1`. Atualmente, o Twitter é o único driver oficial usando OAuth1. |
| `type`          | OAuth2          | O tipo de token. Normalmente, será um [token portador](https://oauth.net/2/bearer-tokens/). |
| `refreshToken`  | OAuth2          | Você pode usar o token de atualização para criar um novo token de acesso. O valor será `undefined` se o provedor OAuth não suportar tokens de atualização |
| `expiresAt`     | OAuth2          | Uma instância da classe luxon DateTime representando o tempo absoluto em que o token de acesso irá expirar. |
| `expiresIn`     | OAuth2          | Valor em segundos, após o qual o token irá expirar. É um valor estático e não muda com o passar do tempo. |

### `original`
Referência à resposta original do provedor OAuth. Você pode querer referenciar a resposta original se o conjunto normalizado de propriedades do usuário não tiver todas as informações que você precisa.

```ts
const user = await github.user()
console.log(user.original)
```

## Definindo escopos
Escopos referem-se aos dados que você deseja acessar após o usuário aprovar a solicitação de autenticação. O nome dos escopos e os dados que você pode acessar variam entre os provedores OAuth; portanto, você deve ler a documentação deles.

Os escopos podem ser definidos dentro do arquivo `config/ally.ts`, ou você pode defini-los ao redirecionar o usuário.

Graças ao TypeScript, você obterá sugestões de preenchimento automático para todos os escopos disponíveis.

![](../digging_deeper/ally_autocomplete.png)

```ts
// title: config/ally.ts
github: {
  driver: 'github',
  clientId: env.get('GITHUB_CLIENT_ID')!,
  clientSecret: env.get('GITHUB_CLIENT_SECRET')!,
  callbackUrl: '',
  // highlight-start
  scopes: ['read:user', 'repo:invite'],
  // highlight-end
}
```

```ts
// title: During redirect
ally
  .use('github')
  .redirect((request) => {
    // highlight-start
    request.scopes(['read:user', 'repo:invite'])
    // highlight-end
  })
```

## Definindo parâmetros de consulta de redirecionamento
Você pode personalizar os parâmetros de consulta para a solicitação de redirecionamento junto com os escopos. No exemplo a seguir, definimos os parâmetros `prompt` e `access_type` aplicáveis ​​com o [provedor do Google](https://developers.google.com/identity/protocols/oauth2/web-server#httprest).

```ts
router.get('/google/redirect', async ({ ally }) => {
  return ally
    .use('google')
    .redirect((request) => {
      // highlight-start
      request
        .param('access_type', 'offline')
        .param('prompt', 'select_account')
      // highlight-end
    })
})
```

Você pode limpar quaisquer parâmetros existentes usando o método `.clearParam()` na solicitação. Isso pode ser útil se os padrões de parâmetros forem definidos na configuração e você precisar redefini-los para um fluxo de autenticação personalizado separado.

```ts
router.get('/google/redirect', async ({ ally }) => {
  return ally
    .use('google')
    .redirect((request) => {
      // highlight-start
      request
        .clearParam('redirect_uri')
        .param('redirect_uri', '')
      // highlight-end
    })
})
```

## Obtendo detalhes do usuário de um token de acesso
Às vezes, você pode querer buscar detalhes do usuário de um token de acesso armazenado no banco de dados ou fornecido por outro fluxo OAuth. Por exemplo, você usou o fluxo Native OAuth por meio de um aplicativo móvel e recebeu um token de acesso de volta.

Você pode buscar os detalhes do usuário usando o método `.userFromToken()`.

```ts
const user = await ally
  .use('github')
  .userFromToken(accessToken)
```

Você pode buscar os detalhes do usuário para um driver OAuth1 usando o método `.userFromTokenAndSecret`.

```ts
const user = await ally
  .use('github')
  .userFromTokenAndSecret(token, secret)
```

## Autenticação sem estado
Muitos provedores OAuth [recomendam usar um token de estado CSRF](https://developers.google.com/identity/openid-connect/openid-connect?hl=en#createxsrftoken) para evitar que seu aplicativo sofra ataques de falsificação de solicitação.

O Ally cria um token CSRF e o salva dentro de um cookie criptografado, que é verificado depois que o usuário aprova a solicitação de autenticação.

No entanto, se você não puder usar cookies por algum motivo, você pode habilitar o modo sem estado no qual nenhuma verificação de estado ocorrerá e, portanto, nenhum cookie CSRF será gerado.

```ts
// title: Redirecting
ally.use('github').stateless().redirect()
```

```ts
// title: Handling callback response
const gh = ally.use('github').stateless()
await gh.user()
```

## Referência de configuração completa
A seguir está a referência de configuração completa para todos os drivers. Você pode copiar e colar os seguintes objetos diretamente no arquivo `config/ally.ts`.

::: details Configuração do GitHub
```ts
{
  github: services.github({
    clientId: '',
    clientSecret: '',
    callbackUrl: '',

    // GitHub specific
    login: 'adonisjs',
    scopes: ['user', 'gist'],
    allowSignup: true,
  })
}
```
:::

::: details Configuração do Google
```ts
{
  google: services.google({
    clientId: '',
    clientSecret: '',
    callbackUrl: '',

    // Google specific
    prompt: 'select_account',
    accessType: 'offline',
    hostedDomain: 'adonisjs.com',
    display: 'page',
    scopes: ['userinfo.email', 'calendar.events'],
  })
}
```
:::

::: details Configuração do Twitter
```ts
{
  twitter: services.twitter({
    clientId: '',
    clientSecret: '',
    callbackUrl: '',
  })
}
```
:::

::: details Configuração do Discord
```ts
{
  discord: services.discord({
    clientId: '',
    clientSecret: '',
    callbackUrl: '',

    // Discord specific
    prompt: 'consent' | 'none',
    guildId: '',
    disableGuildSelect: false,
    permissions: 10,
    scopes: ['identify', 'email'],
  })
}
```
:::

::: details Configuração do LinkedIn

```ts
{
  linkedin: services.linkedin({
    clientId: '',
    clientSecret: '',
    callbackUrl: '',

    // LinkedIn specific
    scopes: ['r_emailaddress', 'r_liteprofile'],
  })
}
```
:::

::: details Configuração do Facebook
```ts
{
  facebook: services.facebook({
    clientId: '',
    clientSecret: '',
    callbackUrl: '',

    // Facebook specific
    scopes: ['email', 'user_photos'],
    userFields: ['first_name', 'picture', 'email'],
    display: '',
    authType: '',
  })
}
```
:::

::: details Configuração do Spotify

```ts
{
  spotify: services.spotify({
    clientId: '',
    clientSecret: '',
    callbackUrl: '',

    // Spotify specific
    scopes: ['user-read-email', 'streaming'],
    showDialog: false
  })
}
```
:::

## Criando um driver social personalizado
Criamos um [kit inicial](https://github.com/adonisjs-community/ally-driver-boilerplate) para implementar e publicar um driver social personalizado no npm. Leia o README do kit inicial para obter mais instruções.
