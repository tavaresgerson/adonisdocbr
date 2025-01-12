---
summary: Exceções são erros levantados durante o ciclo de vida da solicitação HTTP. O AdonisJS fornece um mecanismo robusto de tratamento de exceções para converter exceções em respostas HTTP e relatá-las ao logger.
---

# Tratamento de exceções

Exceções levantadas durante uma solicitação HTTP são tratadas pelo `HttpExceptionHandler` definido dentro do arquivo `./app/exceptions/handler.ts`. Dentro deste arquivo, você pode decidir como converter exceções em respostas e registrá-las usando o logger ou relatá-las a um provedor de registro externo.

O `HttpExceptionHandler` estende a classe [ExceptionHandler](https://github.com/adonisjs/http-server/blob/main/src/exception_handler.ts), que faz todo o trabalho pesado de tratamento de erros e fornece APIs de alto nível para ajustar o comportamento de relatórios e renderização.

```ts
import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction
  protected renderStatusPages = app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
```

## Atribuindo manipulador de erros ao servidor

O manipulador de erros é registrado com o servidor HTTP AdonisJS dentro do arquivo `start/kernel.ts`. Importamos preguiçosamente o manipulador HTTP usando o alias `#exceptions` definido no arquivo `package.json`.

```ts
server.errorHandler(() => import('#exceptions/handler'))
```

## Lidando com exceções

As exceções são tratadas pelo método `handle` na classe do manipulador de exceções. Por padrão, as seguintes etapas são executadas durante o tratamento de um erro.

[error.handle](#defining-the-handle-method) e retorna sua resposta.
- Verifique se uma página de status está definida para o código `error.status`. Se sim, renderize a página de status.
- Caso contrário, renderize a exceção usando renderizadores de negociação de conteúdo.

Se você quiser lidar com uma exceção específica de forma diferente, pode fazer isso dentro do método `handle`. Certifique-se de usar o método `ctx.response.send` para enviar uma resposta, pois o valor de retorno do método `handle` é descartado.

```ts
import { errors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      ctx.response.status(422).send(error.messages)
      return
    }

    return super.handle(error, ctx)
  }
}
```

### Páginas de status

Páginas de status são uma coleção de modelos que você deseja renderizar para um determinado ou um intervalo de códigos de status.

O intervalo de códigos de status pode ser definido como uma expressão de string. Dois pontos separam os códigos de status inicial e final (`..`).

Se você estiver criando um servidor JSON, pode não precisar de páginas de status.

```ts
import { StatusPageRange, StatusPageRenderer } from '@adonisjs/http-server/types'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (_, { view }) => view.render('errors/not-found'),
    '500..599': (_, { view }) => view.render('errors/server-error')
  }
}
```

### Modo de depuração

Os renderizadores de negociação de conteúdo manipulam exceções que não são automanipuladas e não convertidas em uma página de status.

Os renderizadores de negociação de conteúdo têm suporte para o modo de depuração. Eles podem analisar e imprimir erros no modo de depuração usando o pacote npm [Youch](https://www.npmjs.com/package/youch).

Você pode alternar o modo de depuração usando a propriedade `debug` na classe do manipulador de exceções. No entanto, é recomendável desativar o modo de depuração na produção, pois ele expõe informações confidenciais sobre seu aplicativo.

```ts
export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction
}
```

## Relatando exceções

O método `report` na classe do manipulador de exceções manipula o relatório de exceções.

O método recebe o erro como o primeiro argumento e o [contexto HTTP](../concepts/http_context.md) como o segundo argumento. Você não deve escrever uma resposta do método `report` e usar o contexto apenas para ler as informações da solicitação.

### Registrando exceções

Todas as exceções são relatadas usando o [logger](../digging_deeper/logger.md) por padrão.

- Exceções com códigos de status no intervalo `400..499` são registradas no nível `warning`.
- Exceções com o código de status `>=500` são registradas no nível `error`.
- Todas as outras exceções são registradas no nível `info`.

Você pode adicionar propriedades personalizadas às mensagens de log retornando um objeto do método `context`.

```ts
export default class HttpExceptionHandler extends ExceptionHandler {
  protected context(ctx: HttpContext) {
    return {
      requestId: ctx.requestId,
      userId: ctx.auth.user?.id,
      ip: ctx.request.ip(),
    }
  }
}
```

### Ignorando códigos de status

Você pode ignorar exceções de serem relatadas definindo uma matriz de códigos de status por meio da propriedade `ignoreStatuses`.

```ts
export default class HttpExceptionHandler extends ExceptionHandler {
  protected ignoreStatuses = [
    401,
    400,
    422,
    403,
  ]
}
```

### Ignorando erros

Você também pode ignorar exceções definindo uma matriz de códigos de erro ou classes de erro para ignorar.

```ts
import { errors } from '@adonisjs/core'
import { errors as sessionErrors } from '@adonisjs/session'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected ignoreCodes = [
    'E_ROUTE_NOT_FOUND',
    'E_INVALID_SESSION'
  ]
}
```

Uma matriz de classes de exceção pode ser ignorada usando a propriedade `ignoreExceptions`.

```ts
import { errors } from '@adonisjs/core'
import { errors as sessionErrors } from '@adonisjs/session'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected ignoreExceptions = [
    errors.E_ROUTE_NOT_FOUND,
    sessionErrors.E_INVALID_SESSION,
  ]
}
```

### Método shouldReport personalizado

A lógica para ignorar códigos de status ou exceções é escrita dentro do [método `shouldReport`](https://github.com/adonisjs/http-server/blob/main/src/exception_handler.ts#L155). Se necessário, você pode substituir esse método e definir sua lógica personalizada para ignorar exceções.

```ts
import { HttpError } from '@adonisjs/core/types/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected shouldReport(error: HttpError) {
    // return a boolean
  }
}
```

## Exceções personalizadas

Você pode criar uma classe de exceção usando o comando ace `make:exception`. Uma exceção estende a classe `Exception` do pacote `@adonisjs/core`.

Veja também: [Comando Make exception](../references/commands.md#makeexception)

```sh
node ace make:exception UnAuthorized
```

```ts
import { Exception } from '@adonisjs/core/exceptions'

export default class UnAuthorizedException extends Exception {}
```

Você pode levantar a exceção criando uma nova instância dela. Ao levantar a exceção, você pode atribuir um **código de erro** e um **código de status** personalizados à exceção.

```ts
import UnAuthorizedException from '#exceptions/unauthorized_exception'

throw new UnAuthorizedException('You are not authorized', {
  status: 403,
  code: 'E_UNAUTHORIZED'
})
```

Os códigos de erro e status também podem ser definidos como propriedades estáticas na classe de exceção. Os valores estáticos serão usados ​​se nenhum valor personalizado for definido ao lançar a exceção.

```ts
import { Exception } from '@adonisjs/core/exceptions'
export default class UnAuthorizedException extends Exception {
  static status = 403
  static code = 'E_UNAUTHORIZED'
}
```

### Definindo o método `handle`

Para automanipular a exceção, você pode definir o método `handle` na classe de exceção. Este método deve converter um erro em uma resposta HTTP usando o método `ctx.response.send`.

O método `error.handle` recebe uma instância do erro como o primeiro argumento e o contexto HTTP como o segundo argumento.

```ts
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class UnAuthorizedException extends Exception {
  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send(error.message)
  }
}
```

### Defina o método `report`

Você pode implementar o método `report` na classe de exceção para automanipular o relatório de exceção. O método report recebe uma instância do erro como o primeiro argumento e o contexto HTTP como o segundo argumento.

```ts
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class UnAuthorizedException extends Exception {
  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, error.message)
  }
}
```

## Restringindo o tipo de erro
O núcleo do framework e outros pacotes oficiais exportam as exceções geradas por eles. Você pode verificar se um erro é uma instância de uma exceção específica usando a verificação `instanceof`. Por exemplo:

```ts
import { errors } from '@adonisjs/core'

try {
  router.builder().make('articles.index')
} catch (error: unknown) {
  if (error instanceof errors.E_CANNOT_LOOKUP_ROUTE) {
    // handle error
  }
}
```

## Erros conhecidos

[guia de referência de exceções](../references/exceptions.md) para visualizar a lista de erros conhecidos.
