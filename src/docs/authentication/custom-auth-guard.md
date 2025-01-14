---
summary: Aprenda a criar um guarda de autenticação personalizado para AdonisJS.
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

::: info NOTA
Todo o código que escreveremos neste guia pode inicialmente viver dentro de um único arquivo armazenado no diretório `app/auth/guards`.
:::

```ts
// app/auth/guards/jwt.ts

import { symbols } from '@adonisjs/auth'

/**
 * A ponte entre o provedor User e o Guard
 */
export type JwtGuardUser<RealUser> = {
  /**
   * Retorna o ID exclusivo do usuário
   */
  getId(): string | number | BigInt

  /**
   * Retorna o objeto do usuário original
   */
  getOriginal(): RealUser
}

/**
 * A interface para o UserProvider aceita pelo guard JWT.
 */
export interface JwtUserProviderContract<RealUser> {
  /**
   * Uma propriedade que a implementação do guard pode usar para inferir
   * o tipo de dados do usuário real (também conhecido como RealUser)
   */
  [symbols.PROVIDER_REAL_USER]: RealUser

  /**
   * Crie um objeto de usuário que atue como um adaptador entre
   * o guarda e o valor real do usuário.
   */
  createUserForGuard(user: RealUser): Promise<JwtGuardUser<RealUser>>

  /**
   * Encontre um usuário pelo ID.
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

::: info NOTA
Reserve um tempo e leia os comentários ao lado de cada propriedade/método no exemplo a seguir.
:::

```ts
import { symbols } from '@adonisjs/auth'
import { AuthClientResponse, GuardContract } from '@adonisjs/auth/types'

export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  /**
   * Uma lista de eventos e seus tipos emitidos por
   * o guarda.
   */
  declare [symbols.GUARD_KNOWN_EVENTS]: {}

  /**
   * Um nome exclusivo para o driver de guarda
   */
  driverName: 'jwt' = 'jwt'

  /**
   * Um sinalizador para saber se a autenticação foi uma tentativa
   * durante a solicitação HTTP atual
   */
  authenticationAttempted: boolean = false

  /**
   * Um booleano para saber se a solicitação atual foi
   * autenticada
   */
  isAuthenticated: boolean = false

  /**
   * Referência ao usuário atualmente autenticado
   */
  user?: UserProvider[typeof symbols.PROVIDER_REAL_USER]

  /**
   * Gera um token JWT para um determinado usuário.
   */
  async generate(user: UserProvider[typeof symbols.PROVIDER_REAL_USER]) {
  }

  /**
   * Autentique a solicitação HTTP atual e retorne
   * a instância do usuário se houver um token JWT válido
   * ou lance uma exceção
   */
  async authenticate(): Promise<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {
  }

  /**
   * O mesmo que autenticar, mas não gera uma exceção
   */
  async check(): Promise<boolean> {
  }

  /**
   * Retorna o usuário autenticado ou gera um erro
   */
  getUserOrFail(): UserProvider[typeof symbols.PROVIDER_REAL_USER] {
  }

  /**
   * Este método é chamado pelo Japa durante o teste quando o método "loginAs"
   * é usado para efetuar login no usuário.
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
  #userProvider: UserProvider           // [!code ++]

  constructor(                          // [!code ++]
    userProvider: UserProvider          // [!code ++]
  ) {                                   // [!code ++]
    this.#userProvider = userProvider   // [!code ++]
  }                                     // [!code ++]
}
```

## Gerando um token
Vamos implementar o método `generate` e criar um token para um determinado usuário. Instalaremos e usaremos o pacote `jsonwebtoken` do npm para gerar um token.

```sh
npm i jsonwebtoken @types/jsonwebtoken
```

Além disso, teremos que usar uma **chave secreta** para assinar um token, então vamos atualizar o método `constructor` e aceitar a chave secreta como uma opção por meio do objeto options.

```ts
import jwt from 'jsonwebtoken'    // [!code ++]

export type JwtGuardOptions = {   // [!code ++]
  secret: string                  // [!code ++]
}                                 // [!code ++]

export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  #userProvider: UserProvider
  #options: JwtGuardOptions       // [!code ++]

  constructor(
    userProvider: UserProvider
    options: JwtGuardOptions      // [!code ++]
  ) {
    this.#userProvider = userProvider
    this.#options = options       // [!code ++]
  }

  /**
   * Gere um token JWT para um determinado usuário.
   */
  async generate(
    user: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  ) {
    const providerUser = await this.#userProvider.createUserForGuard(user)          // [!code ++]
    const token = jwt.sign({ userId: providerUser.getId() }, this.#options.secret)  // [!code ++]

    return {                    // [!code ++]
      type: 'bearer',           // [!code ++]
      token: token              // [!code ++]
    }                           // [!code ++]
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
import type { HttpContext } from '@adonisjs/core/http'  // [!code ++]

export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  #ctx: HttpContext             // [!code ++]
  #userProvider: UserProvider
  #options: JwtGuardOptions

  constructor(
    ctx: HttpContext,           // [!code ++]
    userProvider: UserProvider,
    options: JwtGuardOptions
  ) {
    this.#ctx = ctx             // [!code ++]
    this.#userProvider = userProvider
    this.#options = options
  }
}
```

Leremos o token do cabeçalho `authorization` para este exemplo. No entanto, você pode ajustar a implementação para suportar cookies também.

```ts
import {
  symbols,
  errors  // [!code ++]
} from '@adonisjs/auth'

export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  /**
   * Autentique a solicitação HTTP atual e retorne
   * a instância do usuário se houver um token JWT válido
   * ou lance uma exceção
   */
  async authenticate(): Promise<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {
    /**
     * Evite reautenticação quando ela já foi feita
     * para a solicitação fornecida
     */
    if (this.authenticationAttempted) {
      return this.getUserOrFail()
    }
    this.authenticationAttempted = true

    /**
     * Certifique-se de que o cabeçalho de autenticação existe
     */
    const authHeader = this.#ctx.request.header('authorization')
    if (!authHeader) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    /**
     * Divida o valor do cabeçalho e leia o token dele
     */
    const [, token] = authHeader.split('Bearer ')
    if (!token) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    /**
     * Verificar token
     */
    const payload = jwt.verify(token, this.#options.secret)
    if (typeof payload !== 'object' || !('userId' in payload)) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    /**
     * Buscar o usuário pelo ID do usuário e salvar uma referência a ele
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
   * O mesmo que autenticar, mas não gera uma exceção
   */
  async check(): Promise<boolean> {
    try {                       // [!code ++]
      await this.authenticate() // [!code ++]
      return true               // [!code ++]
    } catch {                   // [!code ++]
      return false              // [!code ++]
    }                           // [!code ++]
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
   * Retorna o usuário autenticado ou gera um erro
   */
  getUserOrFail(): UserProvider[typeof symbols.PROVIDER_REAL_USER] {
    if (!this.user) {                                                   // [!code ++]
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {   // [!code ++]
        guardDriverName: this.driverName,                               // [!code ++]
      })                                                                // [!code ++]
    }                                                                   // [!code ++]

    return this.user                                                    // [!code ++]
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
   * Este método é chamado pelo Japa durante o teste quando o método "loginAs"
   * é usado para efetuar login no usuário.
   */
  async authenticateAsClient(
    user: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  ): Promise<AuthClientResponse> {
    const token = await this.generate(user)     // [!code ++]
    return {                                    // [!code ++]
      headers: {                                // [!code ++]
        authorization: `Bearer ${token.token}`, // [!code ++]
      },                                        // [!code ++]
    }                                           // [!code ++]
  }
}
```

## Usando o guard
Vamos para `config/auth.ts` e registrar o guard na lista `guards`.

```ts
import { defineConfig } from '@adonisjs/auth'
import { sessionUserProvider } from '@adonisjs/auth/session'  // [!code ++]
import env from '#start/env'                                  // [!code ++]
import { JwtGuard } from '../app/auth/jwt/guard.js'           // [!code ++]

const jwtConfig = {                                           // [!code ++]
  secret: env.get('APP_KEY'),                                 // [!code ++]
}                                                             // [!code ++]
const userProvider = sessionUserProvider({                    // [!code ++]
  model: () => import('#models/user'),                        // [!code ++]
})                                                            // [!code ++]

const authConfig = defineConfig({
  default: 'jwt',
  guards: {
    jwt: (ctx) => {                                           // [!code ++]
      return new JwtGuard(ctx, userProvider, jwtConfig)       // [!code ++]
    },                                                        // [!code ++]
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
