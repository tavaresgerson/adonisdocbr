# Usando o Ally com API guard

[Ally](https://github.com/adonisjs/ally) é um pacote AdonisJS para lidar com autenticação social com provedores OAuth como Google, Twitter, GitHub e assim por diante.

Usar o Ally no MAP (Multi-Page Application) é tranquilo. No entanto, quando se trata de SPA (Single-Page Application), as coisas começam a ficar complicadas.

Em vez de instalar pacotes no seu SPA que lidarão com autenticação social, usaremos nosso aplicativo AdonisJS como fonte única de verdade.

## Configurar o Ally
Você pode ler os [documentos oficiais](/docs/guides/auth/social) para configurar o Ally.

Depois de instalado e configurado, você precisará configurar seu(s) provedor(es). Para este guia, usaremos o Google.

## Configurar provedor do Google
Abra o arquivo `config/ally.ts` e adicione seu ID do cliente e segredo do cliente. Para obter seu ID e segredo, você precisa configurar um aplicativo Google OAuth 2.0 no [console do desenvolvedor do Google](https://console.developers.google.com/) e criar credenciais para o cliente OAuth usando uma conta do Google.

Depois que seu aplicativo for criado, você terá que criar credenciais. Na página `Credenciais`, clique no botão `CRIAR CREDENCIAIS` e selecione ID do cliente OAuth. Selecione Aplicativo da Web como Tipo de aplicativo. Escolha um nome para seu aplicativo. Em seguida, você precisa adicionar um URI para `Origens JavaScript autorizadas`. **DEVE** ser o domínio do seu SPA, no meu caso, será `http://localhost:9000`. Finalmente, você tem que adicionar outro URI para o redirecionamento. Em `URIs de redirecionamento autorizados`, adicione uma URL como: `http://localhost:9000/auth/google` (depende do seu domínio e porta do SPA, estou usando o localhost para testar se tudo está funcionando).

Dentro de `config/ally.ts`, adicione a mesma URL de redirecionamento:

```ts
  google: {
    driver: 'google',
    clientId: Env.get('GOOGLE_CLIENT_ID'),
    clientSecret: Env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:9000/auth/google',
  },
```

## Obter URL de redirecionamento do servidor
Usando a configuração do Google fornecida acima, nosso aplicativo AdonisJS agora pode gerar uma URL de redirecionamento que pode ser enviada ao nosso SPA.

```ts
Route.get('/:provider/redirect', async ({ ally, auth, response, params }) => {
  if (await auth.check()) {
    return response.notAcceptable()
  }

  return response.send(await ally.use(params.provider).stateless().redirectUrl())
})
```

Podemos usar essa rota para obter a URL de redirecionamento para qualquer provedor.
A condição retornará uma resposta com código de status = 406, pois não queremos que nossos usuários conectados acessem a URL de redirecionamento.

::: info NOTA
Se você estiver usando o Vue como framework de frontend, pode enviar uma solicitação para a rota acima usando axios ou buscar API dentro do retorno de chamada do hook **onMounted**, obter a URL e adicioná-la a um componente de botão.
:::

## Lidando com a solicitação de retorno de chamada
Agora que temos nossa URL de redirecionamento, podemos acessá-la do SPA. Clique nela, você será solicitado com um formulário de consentimento onde você pode escolher sua conta do Google. Após escolher sua conta, você será redirecionado para a URL de retorno de chamada fornecida (que é http://localhost:9000/auth/google).

O provedor do Google adicionará uma consulta à nossa URL de redirecionamento. Nós a usaremos para enviar uma solicitação ao servidor.

```ts
/**
 * Crie uma URL para a rota de retorno de chamada.
 */
const url = new URL('http://localhost:3333/google/callback')

/**
 * Adicione a consulta fornecida pelo Google.
 */
url.search = window.location.search

/**
 * Envie a solicitação final. Você pode usar o Axios se quiser.
 */
const response = await fetch(url.toString(), {
  method: 'GET',
  headers: {
    Accept: 'application/json'
  },
  credentials: 'include'
})
```

Abaixo está o código para o manipulador de rota de retorno de chamada.

```ts
import User from 'App/Models/User'

Route.get('/:provider/callback', async ({ ally, auth, response, params }) => {
  /**
   * Se o usuário já estiver logado, não execute o retorno de chamada.
   */
  if (await auth.check()) {
    return response.notAcceptable()
  }

  const provider = ally.use(params.provider).stateless()

  /**
   * O usuário negou explicitamente a solicitação de login.
   */
  if (provider.accessDenied()) {
    return 'Access was denied'
  }

  /**
   * Ocorreu um erro desconhecido durante o redirecionamento.
   */
  if (provider.hasError()) {
    return provider.getError()
  }

  const { token } = await provider.accessToken()
  const providerUser = await provider.userFromToken(token)

  /**
   * Insira o usuário no banco de dados se ele não existir,
   * caso contrário, nós o retornamos. Também estamos armazenando o token de acesso,
   * então podemos usá-lo mais tarde para outras operações.
   */
  const user = await User.firstOrCreate({
    email: providerUser.email!
  }, {
    accessToken: token,
    isVerified: providerUser.emailVerificationState === 'verified'
  })

  /**
   * Anexe um perfil ao usuário com dados do provedor.
   */
  await user.related('profile').firstOrCreate({
    lastName: providerUser.original.family_name,
    firstName: providerUser.original.given_name,
  })

  const oat = await auth.use('api').login(user, {
    expiresIn: '7days'
  })

  /**
   * Crie um cookie onde o Opaque Access Token
   * será armazenado com maxAge = 7 dias.
   */
  response.cookie(
    String(Env.get('API_TOKEN_COOKIE_NAME')),
    oat.token,
    { maxAge: 60 * 60 * 24 * 7, sameSite: 'none', 'secure': true, httpOnly: true }
  )

  /**
   * Está tudo bem!
   */
  return response.ok(user)
})
```

Então... você certamente está se perguntando como isso funciona? Na verdade, estamos usando o SPA como um intermediário para passar a URL de retorno de chamada para o servidor. Isso é tudo.

## Autorizar solicitações subsequentes
Para verificar se um usuário está autenticado para solicitações subsequentes, podemos criar um novo middleware para pegar o Opaque Access Token do cookie e anexá-lo aos cabeçalhos da solicitação.

Para fazer isso, execute este comando para gerar um novo arquivo de middleware

```sh
node ace make:middleware SetAuthorizationHeader
```

Em seguida, adicione o seguinte conteúdo

```ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Env from '@ioc:Adonis/Core/Env'

export default class SetAuthorizationHeader {
  public async handle ({ request }: HttpContextContract, next: () => Promise<void>) {
    const token = request.cookie(String(Env.get('API_TOKEN_COOKIE_NAME')))

    if (token) {
      request.headers().authorization = `Bearer ${token}`
    }

    await next()
  }
}
```

Por fim, você precisa registrar o middleware no array global de middleware, dentro de `start/kernel.ts`

```ts
Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
  () => import('@ioc:Adonis/Addons/Shield'),
  () => import('App/Middleware/SetAuthorizationHeader'),
  // Other middleware
])
```

Agora, você pode adicionar o [middleware Auth](/docs/guides/auth/middleware) a uma rota e ele verificará o token e concederá acesso ou negará se ele tiver expirado.
