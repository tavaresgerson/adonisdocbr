# Tratamento de exceções

O AdonisJS usa exceções para controle de fluxo. Ou seja, em vez de escrever muitas condicionais, preferimos levantar exceções e então tratá-las para retornar uma resposta apropriada. Por exemplo:

#### Em vez de escrever o seguinte código

```ts
Route.get('dashboard', async ({ auth, response }) => {
  if (!auth.isLoggedIn) {
    return response.status(401).send('Unauthenticated')
  }

  // lógica de negócios
})
```

#### Preferimos escrever

No exemplo a seguir, o método `auth.authenticate` levantará uma exceção se o usuário não estiver logado. A exceção pode se automanipular e retornar uma resposta apropriada.

```ts
Route.get('dashboard', async ({ auth, response }) => {
  await auth.authenticate()

  // lógica de negócios
})
```

::: tip DICA
Converter cada condicional em uma exceção também não é a abordagem correta. Em vez disso, você pode começar convertendo condicionais que sempre resultam no aborto da solicitação.
:::

## Manipulando exceções globalmente

As exceções levantadas durante uma solicitação HTTP são encaminhadas para o manipulador de exceções global armazenado dentro do arquivo `app/Exceptions/Handler.ts`.

```ts
// app/Exceptions/Handler.ts

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected statusPages = {
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }

  constructor() {
    super(Logger)
  }
}
```

O método `handle` é responsável por manipular as exceções e convertê-las em uma resposta. Então, você pode deixar a classe pai ([HttpExceptionHandler](https://github.com/adonisjs/core/blob/develop/src/HttpExceptionHandler/index.ts)) manipular os erros para você, ou você pode definir o método `handle` para automanipulá-los.

```ts {15-27}
import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected statusPages = {
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }

  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Auto manipula a exceção de validação
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send(error.messages)
    }

    /**
     * Encaminha o restante das exceções para a classe pai
     */
    return super.handle(error, ctx)
  }
}
```

## Relatório de erros

Juntamente com o método handle, você também pode implementar o método `report` para relatar a exceção ao registro ou a um serviço de monitoramento de erros.

A implementação padrão do método `report` usa o [logger](../digging-deeper/logger.md) para relatar exceções.

- Exceções com código de erro `>= 500` são registradas usando o método `logger.error`.
- Exceções com código de erro `>= 400` são registradas usando o método `logger.warn`.
- Todas as outras exceções são registradas usando o método `logger.info`.

::: info NOTA
A resposta HTTP não espera o método report terminar. Em outras palavras, o método report é executado em segundo plano.
:::

Se necessário, você pode sobrescrever o método `report`, conforme mostrado no exemplo a seguir.

```ts {15-26}
import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected statusPages = {
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }

  constructor() {
    super(Logger)
  }

  public async report(error: any, ctx: HttpContextContract) {
    if (!this.shouldReport(error)) {
      return
    }

   if (typeof error.report === 'function') {
      error.report(error, ctx)
      return
    }

    someReportingService.report(error.message)
  }
}
```

### Contexto de relatórios
Você pode implementar o método `context` para fornecer dados adicionais ao relatar erros. Por padrão, o contexto inclui o request-id atual.

```ts
import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected context(ctx: HttpContextContract) {
    return {
      userId: ctx.auth.user?.id
    }
  }
}
```

## Manipulador de exceção HTTP

Os seguintes recursos estão disponíveis somente quando o manipulador de exceção global estende a classe [HttpExceptionHandler](https://github.com/adonisjs/core/blob/develop/src/HttpExceptionHandler/index.ts). Se você decidir não estender a partir desta classe, os seguintes recursos não funcionarão.

### Páginas de status

A propriedade de página `statusPages` no manipulador de exceção permite que você associe modelos Edge a um intervalo de códigos de status de erro.

No exemplo a seguir, todos os erros 404 renderizarão o modelo `errors/not-found.edge` e os erros entre o intervalo de _500 - 599_ renderizarão o modelo `errors/server-error.edge`.

```ts {5-8}
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected statusPages = {
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }

  constructor() {
    super(Logger)
  }
}
```

- As páginas de status são renderizadas somente quando o cabeçalho `Accept` da solicitação HTTP não está definido como `application/json`.

- As páginas de status são desabilitadas durante o desenvolvimento. No entanto, você pode habilitá-las usando o sinalizador `disableStatusPagesInDevelopment`.
```ts
  export default class ExceptionHandler extends HttpExceptionHandler {
    protected disableStatusPagesInDevelopment = false
  }
  ```

### Desabilitar relatórios para certas exceções
Você pode ignorar certas exceções de serem reportadas adicionando-as dentro das propriedades `ignoreCodes` ou `ignoreStatuses`.

```ts {5-6}
import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected ignoreCodes = ['E_ROUTE_NOT_FOUND']
  protected ignoreStatuses = [404, 422, 403, 401]

  constructor() {
    super(Logger)
  }
}
```

## Exceções personalizadas

Você pode criar exceções personalizadas executando o seguinte comando Ace.

```sh
node ace make:exception UnAuthorized
# CREATE: app/Exceptions/UnAuthorizedException.ts
```

Em seguida, importe e levante a exceção da seguinte forma.

```ts
import UnAuthorized from 'App/Exceptions/UnAuthorizedException'

const message = 'You are not authorized'
const status = 403
const errorCode = 'E_UNAUTHORIZED'

throw new UnAuthorized(message, status, errorCode)
```

Você pode automanipular essa exceção implementando o método `handle` na classe de exceção.

```ts {7-9}
// app/Exceptions/UnAuthorizedException.ts

import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UnAuthorizedException extends Exception {
  public async handle(error: this, ctx: HttpContextContract) {
    ctx.response.status(error.status).send(error.message)
  }
}
```

Opcionalmente, implemente o método `report` para relatar a exceção a um serviço de registro ou relatório de erros.

```ts {7-9}
// app/Exceptions/UnAuthorizedException.ts

import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UnAuthorizedException extends Exception {
  public report(error: this, ctx: HttpContextContract) {
    reportingService.report(error.message)
  }
}
```
