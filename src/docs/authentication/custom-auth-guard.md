---
resumo: Aprenda a criar um guarda de autenticação personalizado para AdonisJS.
---

# Criando um guarda de autenticação personalizado

O pacote auth permite que você crie guardas de autenticação personalizados para casos de uso não atendidos pelos guardas integrados. Neste guia, criaremos um guarda para usar tokens JWT para autenticação.

O guarda de autenticação gira em torno dos seguintes conceitos.

- **Provedor de usuário**: os guardas devem ser independentes do usuário. Eles não devem codificar as funções para consultar e encontrar usuários no banco de dados. Em vez disso, um guarda deve confiar em um Provedor de usuário e aceitar sua implementação como uma dependência do construtor.

- **Implementação do guarda**: a implementação do guarda deve aderir à interface `GuardContract`. Esta interface descreve as APIs necessárias para integrar o guarda com o restante da camada Auth.

## Criando a interface `UserProvider`

Um guarda é responsável por definir a interface `UserProvider` e os métodos/propriedades que ela deve conter. Por exemplo, o UserProvider aceito pelo [Session guard](https://github.com/adonisjs/auth/blob/develop/modules/session_guard/types.ts#L153-L166) é muito mais simples do que o UserProvider aceito pelo [Access tokens guard](https://github.com/adonisjs/auth/blob/develop/modules/access_tokens_guard/types.ts#L192-L222).

Portanto, não há necessidade de criar User Providers que satisfaçam todas as implementações de guarda. Cada guarda pode ditar os requisitos para o User provider que aceita.

Para este exemplo, precisamos de um provider para procurar usuários dentro do banco de dados usando o `user ID`. Não nos importamos com qual banco de dados é usado ou como a consulta é realizada. Essa é a responsabilidade do desenvolvedor que implementa o User provider.

:::note
Todo o código que escreveremos neste guia pode inicialmente viver dentro de um único arquivo armazenado no diretório `app/auth/guards`.
:::

```ts
// title: app/auth/guards/jwt.ts
import { symbols } from '@adonisjs/auth'

/**
 * The bridge between the User provider and the
 * Guard
 */
export type JwtGuardUser<RealUser> = {
  /**
   * Returns the unique ID of the user
   */
  getId(): string | number | BigInt

  /**
   * Returns the original user object
   */
  getOriginal(): RealUser
}

/**
 * The interface for the UserProvider accepted by the
 * JWT guard.
 */
export interface JwtUserProviderContract<RealUser> {
  /**
   * A property the guard implementation can use to infer
   * the data type of the actual user (aka RealUser)
   */
  [symbols.PROVIDER_REAL_USER]: RealUser

  /**
   * Create a user object that acts as an adapter between
   * the guard and real user value.
   */
  createUserForGuard(user: RealUser): Promise<JwtGuardUser<RealUser>>

  /**
   * Find a user by their id.
   */
  findById(identifier: string | number | BigInt): Promise<JwtGuardUser<RealUser> | null>
}
```

No exemplo acima, a interface `JwtUserProviderContract` aceita uma propriedade de usuário genérica chamada `RealUser`. Como essa interface não sabe como é o usuário real (aquele que buscamos no banco de dados), ela o aceita como genérico. Por exemplo:

- Uma implementação usando modelos Lucid retornará uma instância do Modelo. Portanto, o valor de `RealUser` será essa instância.

- Uma implementação usando Prisma retornará um objeto de usuário com propriedades específicas; portanto, o valor de `RealUser` será esse objeto.

Para resumir, o `JwtUserProviderContract` deixa para a implementação do Provedor de Usuário decidir o tipo de dados do Usuário.

### Entendendo o tipo `JwtGuardUser`
O tipo `JwtGuardUser` atua como uma ponte entre o provedor User e o guard. O guard usa o método `getId` para obter o ID exclusivo do usuário e o método `getOriginal` para obter o objeto do usuário após autenticar a solicitação.

## Implementando o guard
Vamos criar a classe `JwtGuard` e definir os métodos/propriedades necessários para a interface [`GuardContract`](https://github.com/adonisjs/auth/blob/main/src/types.ts#L30). Inicialmente, teremos muitos erros neste arquivo, mas tudo bem; à medida que progredimos, todos os erros desaparecerão.

:::note
Reserve um tempo e leia os comentários ao lado de cada propriedade/método
no exemplo a seguir.
:::

```ts
import { symbols } from '@adonisjs/auth'
import { AuthClientResponse, GuardContract } from '@adonisjs/auth/types'

export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  /**
   * A list of events and their types emitted by
   * the guard.
   */
  declare [symbols.GUARD_KNOWN_EVENTS]: {}

  /**
   * A unique name for the guard driver
   */
  driverName: 'jwt' = 'jwt'

  /**
   * A flag to know if the authentication was an attempt
   * during the current HTTP request
   */
  authenticationAttempted: boolean = false

  /**
   * A boolean to know if the current request has
   * been authenticated
   */
  isAuthenticated: boolean = false

  /**
   * Reference to the currently authenticated user
   */
  user?: UserProvider[typeof symbols.PROVIDER_REAL_USER]

  /**
   * Generate a JWT token for a given user.
   */
  async generate(user: UserProvider[typeof symbols.PROVIDER_REAL_USER]) {
  }

  /**
   * Authenticate the current HTTP request and return
   * the user instance if there is a valid JWT token
   * or throw an exception
   */
  async authenticate(): Promise<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {
  }

  /**
   * Same as authenticate, but does not throw an exception
   */
  async check(): Promise<boolean> {
  }

  /**
   * Returns the authenticated user or throws an error
   */
  getUserOrFail(): UserProvider[typeof symbols.PROVIDER_REAL_USER] {
  }

  /**
   * This method is called by Japa during testing when "loginAs"
   * method is used to login the user.
   */
  async authenticateAsClient(
    user: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  ): Promise<AuthClientResponse> {
  }
}
```

## Aceitando um provedor de usuário
Um guarda deve aceitar um provedor de usuário para procurar usuários durante a autenticação. Você pode aceitá-lo como um parâmetro construtor e armazenar uma referência privada.

```ts
export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  // insert-start
  #userProvider: UserProvider

  constructor(
    userProvider: UserProvider
  ) {
    this.#userProvider = userProvider
  }
  // insert-end
}
```

## Gerando um token
Vamos implementar o método `generate` e criar um token para um determinado usuário. Instalaremos e usaremos o pacote `jsonwebtoken` do npm para gerar um token.

```sh
npm i jsonwebtoken @types/jsonwebtoken
```

Além disso, teremos que usar uma **chave secreta** para assinar um token, então vamos atualizar o método `constructor` e aceitar a chave secreta como uma opção por meio do objeto options.

```ts
// insert-start
import jwt from 'jsonwebtoken'

export type JwtGuardOptions = {
  secret: string
}
// insert-end

export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  #userProvider: UserProvider
  // insert-start
  #options: JwtGuardOptions
  // insert-end

  constructor(
    userProvider: UserProvider
    // insert-start
    options: JwtGuardOptions
    // insert-end
  ) {
    this.#userProvider = userProvider
    // insert-start
    this.#options = options
    // insert-end
  }

  /**
   * Generate a JWT token for a given user.
   */
  async generate(
    user: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  ) {
    // insert-start
    const providerUser = await this.#userProvider.createUserForGuard(user)
    const token = jwt.sign({ userId: providerUser.getId() }, this.#options.secret)

    return {
      type: 'bearer',
      token: token
    }
    // insert-end
  }
}
```

- Primeiro, usamos o método `userProvider.createUserForGuard` para criar uma instância do usuário provedor (também conhecido como a ponte entre o usuário real e o guarda).

- Em seguida, usamos o método `jwt.sign` para criar um token assinado com o `userId` no payload e retorná-lo.

## Autenticando uma solicitação

Autenticar uma solicitação inclui:

- Ler o token JWT do cabeçalho da solicitação ou cookie.
- Verificar sua autenticidade.
- Buscar o usuário para quem o token foi gerado.

Nosso guard precisará acessar o [HttpContext](../concepts/http_context.md) para ler cabeçalhos de solicitação e cookies, então vamos atualizar a classe `constructor` e aceitá-la como um argumento.

```ts
// insert-start
import type { HttpContext } from '@adonisjs/core/http'
// insert-end

export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  // insert-start
  #ctx: HttpContext
  // insert-end
  #userProvider: UserProvider
  #options: JwtGuardOptions

  constructor(
    // insert-start
    ctx: HttpContext,
    // insert-end
    userProvider: UserProvider,
    options: JwtGuardOptions
  ) {
    // insert-start
    this.#ctx = ctx
    // insert-end
    this.#userProvider = userProvider
    this.#options = options
  }
}
```

Leremos o token do cabeçalho `authorization` para este exemplo. No entanto, você pode ajustar a implementação para suportar cookies também.

```ts
import {
  symbols,
  // insert-start
  errors
  // insert-end
} from '@adonisjs/auth'

export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  /**
   * Authenticate the current HTTP request and return
   * the user instance if there is a valid JWT token
   * or throw an exception
   */
  async authenticate(): Promise<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {
    /**
     * Avoid re-authentication when it has been done already
     * for the given request
     */
    if (this.authenticationAttempted) {
      return this.getUserOrFail()
    }
    this.authenticationAttempted = true

    /**
     * Ensure the auth header exists
     */
    const authHeader = this.#ctx.request.header('authorization')
    if (!authHeader) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    /**
     * Split the header value and read the token from it
     */
    const [, token] = authHeader.split('Bearer ')
    if (!token) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    /**
     * Verify token
     */
    const payload = jwt.verify(token, this.#options.secret)
    if (typeof payload !== 'object' || !('userId' in payload)) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    /**
     * Fetch the user by user ID and save a reference to it
     */
    const providerUser = await this.#userProvider.findById(payload.userId)
    if (!providerUser) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    this.user = providerUser.getOriginal()
    return this.getUserOrFail()
  }
}
```

## Implementando o método `check`
O método `check` é uma versão silenciosa do método `authenticate`, e você pode implementá-lo da seguinte forma.

```ts
export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  /**
   * Same as authenticate, but does not throw an exception
   */
  async check(): Promise<boolean> {
    // insert-start
    try {
      await this.authenticate()
      return true
    } catch {
      return false
    }
    // insert-end
  }
}
```

## Implementando o método `getUserOrFail`
Finalmente, vamos implementar o método `getUserOrFail`. Ele deve retornar a instância do usuário ou lançar um erro (se o usuário não existir).

```ts
export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  /**
   * Returns the authenticated user or throws an error
   */
  getUserOrFail(): UserProvider[typeof symbols.PROVIDER_REAL_USER] {
    // insert-start
    if (!this.user) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    return this.user
    // insert-end
  }
}
```

## Implementando o método `authenticateAsClient`
O método `authenticateAsClient` é usado durante os testes quando você deseja fazer login em um usuário durante os testes por meio do [método `loginAs`](../testing/http_tests.md#authenticating-users). Para a implementação do JWT, esse método deve retornar o cabeçalho `authorization` contendo o token JWT.

```ts
export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  /**
   * This method is called by Japa during testing when "loginAs"
   * method is used to login the user.
   */
  async authenticateAsClient(
    user: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  ): Promise<AuthClientResponse> {
    // insert-start
    const token = await this.generate(user)
    return {
      headers: {
        authorization: `Bearer ${token.token}`,
      },
    }
    // insert-end
  }
}
```

## Usando o guard
Vamos para `config/auth.ts` e registrar o guard na lista `guards`.

```ts
import { defineConfig } from '@adonisjs/auth'
// insert-start
import { sessionUserProvider } from '@adonisjs/auth/session'
import env from '#start/env'
import { JwtGuard } from '../app/auth/jwt/guard.js'
// insert-end

// insert-start
const jwtConfig = {
  secret: env.get('APP_KEY'),
}
const userProvider = sessionUserProvider({
  model: () => import('#models/user'),
})
// insert-end

const authConfig = defineConfig({
  default: 'jwt',
  guards: {
    // insert-start
    jwt: (ctx) => {
      return new JwtGuard(ctx, userProvider, jwtConfig)
    },
    // insert-end
  },
})

export default authConfig
```

Como você pode notar, estamos usando o `sessionUserProvider` com nossa implementação `JwtGuard`. Isso ocorre porque a interface `JwtUserProviderContract` é compatível com o User Provider criado pelo Session guard.

Então, em vez de criar nossa própria implementação de um User Provider, reutilizamos um do Session guard.

## Exemplo final
Depois que a implementação for concluída, você pode usar o guard `jwt` como outros guards integrados. A seguir, um exemplo de como gerar e verificar tokens JWT.

```ts
import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.post('login', async ({ request, auth }) => {
  const { email, password } = request.all()
  const user = await User.verifyCredentials(email, password)

  return await auth.use('jwt').generate(user)
})

router
  .get('/', async ({ auth }) => {
    return auth.getUserOrFail()
  })
  .use(middleware.auth())
```
