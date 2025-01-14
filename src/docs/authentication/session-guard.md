---
summary: Aprenda como autenticar usuários usando o guarda de sessão no AdonisJS.
---

# Guarda de sessão
O guarda de sessão usa o pacote [@adonisjs/session](../basics/session.md) para fazer login e autenticar usuários durante uma solicitação HTTP.

Sessões e cookies estão na internet há muito tempo e funcionam muito bem para a maioria dos aplicativos. Portanto, recomendamos usar o guarda de sessão para aplicativos renderizados pelo servidor ou um cliente web SPA no mesmo domínio de nível superior.

## Configurando o guarda
Os guardas de autenticação são definidos dentro do arquivo `config/auth.ts`. Você pode configurar vários guardas dentro deste arquivo sob o objeto `guards`.

```ts {4,9-14}
// config/auth.ts

import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'

const authConfig = defineConfig({
  default: 'web',
  guards: {
    web: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
    })
  },
})

export default authConfig
```

O método `sessionGuard` cria uma instância da classe [SessionGuard](https://github.com/adonisjs/auth/blob/main/modules/session_guard/guard.ts). Ele aceita um provedor de usuário que pode ser usado para encontrar usuários durante a autenticação e um objeto de configuração opcional para configurar o comportamento de tokens de lembrança.

O método `sessionUserProvider` cria uma instância da classe [SessionLucidUserProvider](https://github.com/adonisjs/auth/blob/main/modules/session_guard/user_providers/lucid.ts). Ele aceita uma referência ao modelo a ser usado para autenticação.

## Executando login
Você pode fazer login de um usuário usando o método `login` do seu guard. O método aceita uma instância do modelo User e cria uma sessão de login para eles.

No exemplo a seguir:

- [AuthFinder mixin](./verifying_user_credentials.md#using-the-auth-finder-mixin) para encontrar um usuário por e-mail e senha.

- [SessionGuard](https://github.com/adonisjs/auth/blob/main/modules/session_guard/guard.ts) configurado dentro do arquivo `config/auth.ts` (`web` é o nome do guard definido na sua configuração).

- Em seguida, chamamos o método `auth.use('web').login(user)` para criar uma sessão de login para o usuário.

- Finalmente, redirecionamos o usuário para o endpoint `/dashboard`. Sinta-se à vontade para personalizar o endpoint de redirecionamento.

```ts {6-24}
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    /**
     * Etapa 1: Obtenha credenciais do corpo da solicitação
     */
    const { email, password } = request.only(['email', 'password'])

    /**
     * Etapa 2: Verifique as credenciais
     */
    const user = await User.verifyCredentials(email, password)

    /**
     * Etapa 3: Faça login no usuário
     */
    await auth.use('web').login(user)

    /**
     * Etapa 4: Envie-os para uma rota protegida
     */
    response.redirect('/dashboard')
  }
}
```

## Protegendo rotas

Você pode proteger rotas de usuários não autenticados usando o middleware `auth`. O middleware é registrado dentro do arquivo `start/kernel.ts` sob a coleção de middleware nomeada.

```ts
import router from '@adonisjs/core/services/router'

export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware')
})
```

Aplique o middleware `auth` às rotas que você deseja proteger de usuários não autenticados.

```ts {1,6}
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
 .get('dashboard', () => {})
 .use(middleware.auth())
```

Por padrão, o middleware auth autenticará o usuário contra o guard `default` (conforme definido no arquivo de configuração). No entanto, você pode especificar uma matriz de guards ao atribuir o middleware `auth`.

No exemplo a seguir, o middleware auth tentará autenticar a solicitação usando os guards `web` e `api`.

```ts {6-10}
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
 .get('dashboard', () => {})
 .use(
   middleware.auth({
     guards: ['web', 'api']
   })
 )
```

### Lidando com exceção de autenticação

O middleware auth lança o [E_UNAUTHORIZED_ACCESS](https://github.com/adonisjs/auth/blob/main/src/errors.ts#L21) se o usuário não for autenticado. A exceção é tratada automaticamente usando as seguintes regras de negociação de conteúdo.

- A solicitação com o cabeçalho `Accept=application/json` receberá uma matriz de erros com a propriedade `message`.
- Específicações [JSON API](https://jsonapi.org/format/#errors).
- O usuário será redirecionado para a página `/login` para aplicativos renderizados pelo servidor. Você pode configurar o endpoint de redirecionamento dentro da classe de middleware `auth`.

## Obtendo acesso ao usuário logado

Você pode acessar a instância do usuário logado usando a propriedade `auth.user`. O valor só está disponível ao usar o middleware `auth` ou `silent_auth` ou se você chamar os métodos `auth.authenticate` ou `auth.check` manualmente.

```ts {8}
// Usando middleware auth

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .get('dashboard', async ({ auth }) => {
    await auth.user!.getAllMetrics()
  })
  .use(middleware.auth())
```

```ts {8-16}
// Chamando manualmente o método authenticate

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .get('dashboard', async ({ auth }) => {
    /**
     * Primeiro, autentique o usuário
     */
    await auth.authenticate()

    /**
     * Depois acesse o objeto do usuário
     */ 
    await auth.user!.getAllMetrics()
  })
```

### Middleware de autenticação silenciosa

O middleware `silent_auth` é semelhante ao middleware `auth`, mas não gera uma exceção quando o usuário não é autenticado. Em vez disso, a solicitação continua normalmente.

Este middleware é útil quando você deseja sempre autenticar o usuário para executar algumas ações, mas não deseja bloquear a solicitação quando o usuário não é autenticado.

Se você planeja usar este middleware, deve registrá-lo na lista de [middleware do roteador](../basics/middleware.md#router-middleware-stack).

```ts
// start/kernel.ts

import router from '@adonisjs/core/services/router'

router.use([
  // ...
  () => import('#middleware/silent_auth_middleware')
])
```

### Verifique se a solicitação é autenticada
Você pode verificar se uma solicitação foi autenticada usando o sinalizador `auth.isAuthenticated`. O valor de `auth.user` sempre será definido para uma solicitação autenticada.

```ts {6-8}
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .get('dashboard', async ({ auth }) => {
    if (auth.isAuthenticated) {
      await auth.user!.getAllMetrics()
    }
  })
  .use(middleware.auth())
```

### Obter usuário autenticado ou falhar

Se você não gosta de usar o [operador de asserção não nulo](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-) na propriedade `auth.user`, você pode usar o método `auth.getUserOrFail`. Este método retornará o objeto do usuário ou lançará a exceção [E_UNAUTHORIZED_ACCESS](../references/exceptions.md#e_unauthorized_access).

```ts {6-7}
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .get('dashboard', async ({ auth }) => {
    const user = auth.getUserOrFail()
    await user.getAllMetrics()
  })
  .use(middleware.auth())
```

### Acessar usuário dentro de modelos Edge
O [InitializeAuthMiddleware](./introduction.md#the-initialize-auth-middleware) também compartilha a propriedade `ctx.auth` com modelos Edge. Portanto, você pode acessar o usuário conectado no momento por meio da propriedade `auth.user`.

```edge
@if(auth.isAuthenticated)
  <p> Hello {{ auth.user.email }} </p>
@end
```

Se você quiser buscar informações do usuário conectado em uma rota não protegida, você pode usar o método `auth.check` para verificar se o usuário está conectado e então acessar a propriedade `auth.user`. Um ótimo caso de uso para isso é exibir as informações do usuário conectado no cabeçalho do site de uma página pública.

```edge
{{--
  Esta é uma página pública; portanto, não é protegida pelo middleware auth.
  No entanto, ainda queremos exibir as informações do usuário
  logado no cabeçalho do site.

  Para isso, usamos o método `auth.check` para verificar silenciosamente se o
  usuário está logado e, em seguida, exibir seu e-mail no cabeçalho.

  Você entendeu a ideia!
--}}

@eval(await auth.check())

<header>
  @if(auth.isAuthenticated)
    <p> Hello {{ auth.user.email }} </p>
  @end
</header>
```

## Executando logout
Você pode fazer logout de um usuário usando o método `guard.logout`. Durante o logout, o estado do usuário será excluído do armazenamento de sessão. O token lembre-se de mim ativo no momento também será excluído (se estiver usando tokens lembre-se de mim).

```ts
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .post('logout', async ({ auth, response }) => {
    await auth.use('web').logout()
    return response.redirect('/login')
  })
  .use(middleware.auth())
```

## Usando o recurso Lembre-se de mim
O recurso Lembre-se de mim faz login automaticamente no usuário após a expiração da sessão. Isso é feito gerando um token criptograficamente seguro e salvando-o como um cookie dentro do navegador do usuário.

Após a expiração da sessão do usuário, o AdonisJS usará o cookie "lembre-se de mim", verificará a validade do token e recriará automaticamente a sessão de login para o usuário.

### Criando a tabela "Lembre-se de mim" Tokens

Os tokens "lembre-se de mim" são salvos dentro do banco de dados e, portanto, você deve criar uma nova migração para criar a tabela "remember_me_tokens".

```sh
node ace make:migration remember_me_tokens
```

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'remember_me_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table
        .integer('tokenable_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('hash').notNullable().unique()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('expires_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

### Configurando o provedor de tokens
Para ler e gravar tokens, você terá que atribuir o [DbRememberMeTokensProvider](https://github.com/adonisjs/auth/blob/main/modules/session_guard/token_providers/db.ts) ao modelo User.

```ts {2,7}
import { BaseModel } from '@adonisjs/lucid/orm'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'

export default class User extends BaseModel {
  // ...resto das propriedades do modelo

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
```

### Habilitando tokens de Lembre-se de mim dentro da configuração
Finalmente, vamos habilitar o sinalizador `useRememberTokens` na configuração do guarda de sessão dentro do arquivo `config/auth.ts`.

```ts  {8-9}
import { defineConfig } from '@adonisjs/auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'

const authConfig = defineConfig({
  default: 'web',
  guards: {
    web: sessionGuard({
      useRememberMeTokens: true,
      rememberMeTokensAge: '2 years',
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
    })
  },
})

export default authConfig
```

### Lembrando usuários durante o login
Depois que a configuração for concluída, você pode gerar o token de lembre-se de mim e o cookie usando o método `guard.login` da seguinte forma.

```ts {11-14}
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(
      user,
      /**
       * Gere token quando a entrada "remember_me" existir
       */
      !!request.input('remember_me')
    )
    
    response.redirect('/dashboard')
  }
}
```

## Usando o middleware convidado
O pacote auth vem com um middleware convidado que você pode usar para redirecionar os usuários conectados do acesso à página `/login`. Isso deve ser feito para evitar a criação de várias sessões para um único usuário em um único dispositivo.

```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .get('/login', () => {})
  .use(middleware.guest())
```

Por padrão, o middleware convidado verificará o status de login do usuário usando o guard `default` (conforme definido no arquivo de configuração). No entanto, você pode especificar uma matriz de guards ao atribuir o middleware `guest`.

```ts
router
  .get('/login', () => {})
  .use(middleware.guest({
    guards: ['web', 'admin_web']
  }))
```

Finalmente, você pode configurar a rota de redirecionamento para os usuários conectados dentro do arquivo `./app/middleware/guest_middleware.ts`.

## Eventos

Consulte o [guia de referência de eventos](../references/events.md#session_authcredentials_verified) para visualizar a lista de eventos disponíveis emitidos pelo pacote Auth.
