---
summary: Verifique as credenciais do usuário em um aplicativo AdonisJS usando o mixin AuthFinder.
---

# Verificando as credenciais do usuário

Em um aplicativo AdonisJS, a verificação das credenciais do usuário é dissociada da camada de autenticação. Isso garante que você possa continuar usando os auth guards sem limitar as opções para verificar as credenciais do usuário.

Por padrão, fornecemos APIs seguras para encontrar usuários e verificar suas senhas. No entanto, você também pode implementar maneiras adicionais de verificar um usuário, como enviar um OTP para seu número de telefone ou usar 2FA.

Neste guia, abordaremos o processo de encontrar um usuário por um UID e verificar sua senha antes de marcá-lo como conectado.

## Exemplo básico
Você pode usar o modelo User diretamente para encontrar um usuário e verificar sua senha. No exemplo a seguir, encontramos um usuário por e-mail e usamos o serviço [hash](../security/hashing.md) para verificar o hash da senha.

```ts {1-2,9-17,19-26}
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async store({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    /**
     * Encontre um usuário por e-mail. Retorne erro se um usuário não
     * existe
     */
    const user = await User.findBy('email', email)

    if (!user) {
      return response.abort('Invalid credentials')
    }

    /**
     * Verifique a senha usando o serviço de hash
     */
    const isPasswordValid = await hash.verify(user.password, password)

    if (!isPasswordValid) {
      return response.abort('Invalid credentials')
    }

    /**
     * Agora faça login com o usuário ou crie um token para ele
     */
    // ...
  }
}
```

::: danger ERROR!
**Problemas com a abordagem acima**
:::

O código que escrevemos no exemplo acima é propenso a [ataques de temporização](https://en.wikipedia.org/wiki/Timing_attack). No caso de autenticação, um invasor pode observar o tempo de resposta do aplicativo para descobrir se o e-mail ou a senha estão incorretos em suas credenciais fornecidas. Recomendamos que você use o [mixin AuthFinder](#using-the-auth-finder-mixin) para evitar ataques de temporização e ter uma melhor experiência do desenvolvedor.

De acordo com a implementação acima:

- A solicitação levará menos tempo se o e-mail do usuário estiver incorreto. Isso ocorre porque não verificamos o hash da senha quando não conseguimos encontrar um usuário.

- A solicitação levará mais tempo se o e-mail existir e a senha estiver incorreta. Isso ocorre porque os algoritmos de hash de senha são lentos por natureza.

A diferença no tempo de resposta é suficiente para um invasor encontrar um endereço de e-mail válido e tentar diferentes combinações de senha.

## Usando o mixin Auth finder
Para evitar ataques de tempo, recomendamos que você use o [mixin AuthFinder](https://github.com/adonisjs/auth/blob/main/src/mixins/lucid.ts) no modelo User.

O mixin Auth finder adiciona os métodos `findForAuth` e `verifyCredentials` ao modelo aplicado. O método `verifyCredentials` oferece uma API segura contra ataques de tempo para encontrar um usuário e verificar sua senha.

Você pode importar e aplicar o mixin em um modelo da seguinte maneira.

```ts {4-5,7-10,12}
import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

- O método `withAuthFinder` aceita um retorno de chamada que retorna um hasher como o primeiro argumento. Usamos o hasher `scrypt` no exemplo acima. No entanto, você pode substituí-lo por um hasher diferente.

- Em seguida, ele aceita um objeto de configuração com as seguintes propriedades.
  - `uids`: Uma matriz de propriedades de modelo que pode ser usada para identificar um usuário exclusivamente. Se você atribuir a um usuário um nome de usuário ou número de telefone, também poderá usá-los como um UID.
  - `passwordColumnName`: O nome da propriedade do modelo que contém a senha do usuário.

[mixin](../references/helpers.md#compose) no modelo User.

### Verificando credenciais
Depois de aplicar o mixin Auth finder, você pode substituir todo o código do método `SessionController.store` pelo seguinte trecho de código.

```ts
import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'  // [!code --]

export default class SessionController {
  async store({ request, response }: HttpContext) { // [!code --]
  async store({ request }: HttpContext) { // [!code ++]
    const { email, password } = request.only(['email', 'password'])

    /**                                                                 // [!code --]
     * Encontre um usuário por e-mail. Retorne erro se um usuário não   // [!code --]
     * existe                                                           // [!code --]
     */                                                                 // [!code --]
    const user = await User.findBy('email', email)                      // [!code --]
    if (!user) {                                                        // [!code --]
      response.abort('Invalid credentials')                             // [!code --]
    }                                                                   // [!code --]

    /**                                                                 // [!code --]
     * Verifique a senha usando o serviço de hash                       // [!code --]
     */                                                                 // [!code --]
    await hash.verify(user.password, password)                          // [!code --]

    const user = await User.verifyCredentials(email, password)          // [!code ++]

    /**
     * Agora faça login com o usuário ou crie um token para ele
     */
  }
}
```

### Lidando com exceções
Em caso de credenciais inválidas, o método `verifyCredentials` lançará a exceção [E_INVALID_CREDENTIALS](../references/exceptions.md#e_invalid_credentials).

A exceção é automanipulada e será convertida em uma resposta usando as seguintes regras de negociação de conteúdo.

- Solicitações HTTP com o cabeçalho `Accept=application/json` receberão uma matriz de mensagens de erro. Cada elemento da matriz será um objeto com a propriedade message.

- Solicitações HTTP com o cabeçalho `Accept=application/vnd.api+json` receberão uma matriz de mensagens de erro formatadas de acordo com a especificação JSON API.

- [Mensagens flash de sessão](../basics/session.md#flash-messages).

- Todas as outras solicitações receberão erros de volta como texto simples.

No entanto, se necessário, você pode manipular a exceção dentro do [manipulador de exceção global](../basics/exception_handling.md) da seguinte forma.

```ts {1,9-14}
import { errors } from '@adonisjs/auth'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction
  protected renderStatusPages = app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof errors.E_INVALID_CREDENTIALS) {
      return ctx
        .response
        .status(error.status)
        .send(error.getResponseMessage(error, ctx))
    }

    return super.handle(error, ctx)
  }
}
```

## Hashing de senha de usuário
O mixin `AuthFinder` registra um hook [beforeSave](https://github.com/adonisjs/auth/blob/main/src/mixins/lucid.ts#L40-L50) para fazer hash automaticamente das senhas de usuário durante chamadas `INSERT` e `UPDATE`. Portanto, você não precisa executar manualmente o hash de senha em seus modelos.
