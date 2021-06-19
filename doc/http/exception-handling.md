# Manipulação de exceção

AdonisJS usa exceções para controle de fluxo. Ou seja, em vez de escrever muitas condicionais, preferimos levantar exceções e, 
em seguida, tratá-las para retornar uma resposta apropriada. Por exemplo:

#### Em vez de escrever o seguinte código

```ts
Route.get('dashboard', async ({ auth, response }) => {
  if (!auth.isLoggedIn) {
    return response.status(401).send('Unauthenticated')
  }

  // lógica de negócio
})
```

#### Nós preferimos escrever

No exemplo a seguir, o método `auth.authenticate` gerará uma exceção se o usuário não estiver conectado. A exceção tem a
capacidade de se autogerir e retornar uma resposta apropriada.

```ts
Route.get('dashboard', async ({ auth, response }) => {
  await auth.authenticate()

  // lógica de negócio
})
```

> Converter cada condição em uma exceção também não é a abordagem certa. Em vez disso, você pode começar convertendo 
> condicionais que sempre resultam no cancelamento da solicitação.

### Lidando com exceções globalmente
As exceções levantadas durante uma solicitação HTTP são encaminhadas para o manipulador de exceção global armazenado 
dentro do arquivo `app/Exceptions/Handler.ts`.

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

O método `handle` nesta classe é responsável por manipular as exceções e convertê-las em uma resposta. Você pode deixar a 
classe pai ([`HttpExceptionHandler`](https://github.com/adonisjs/core/blob/develop/src/HttpExceptionHandler/index.ts)) lidar com os erros 
para você ou pode definir o método `handle` para autocuidá-los.

```ts
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
     * Auto-tratamento da exceção de validação
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send(error.messages)
    }

    /**
     * Encaminhe o restante das exceções para a classe pai
     */
    return super.handle(error, ctx)
  }
}
```

#### Relatório de erros
Juntamente com o método de manipulação, você também pode implementar o método `report` para relatar a exceção ao registro ou 
a um serviço de monitoramento de erro.

A resposta HTTP não espera a conclusão do método de relatório. Em outras palavras, o método de relatório é executado em segundo plano.

```ts
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

    someReportingService.report(error.message)
  }
}
```

### Manipulação de Exceções Http

Todos os recursos a seguir estão disponíveis apenas quando o manipulador de exceção global estende a classe `HttpExceptionHandler`.
Se você decidir não estender esta classe, os seguintes recursos não funcionarão.

#### Páginas de status
A propriedade `statusPages` da página no manipulador de exceções permite associar modelos de borda a uma variedade de códigos de status de erro.

No exemplo a seguir, todos os erros 404 renderizarão o template `errors/not-found.edge`, e os erros entre o intervalo de 500 - 599 
renderizarão `errors/server-error.edge`.

```ts
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

#### Ignorar exceções por código e status
Você pode ignorar certas exceções de serem relatadas, colocando-as na lista de permissões dentro das propriedades `ignoreCodes` e `ignoreStatuses`.

```ts
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
 
### Exceções personalizadas
Você pode criar exceções personalizadas executando o seguinte comando ace.

```bash
node ace make:exception UnAuthorized

# CREATE: app/Exceptions/UnAuthorizedException.ts
```

Em seguida, importe e gere a exceção da seguinte maneira.

```ts
import UnAuthorized from 'App/Exceptions/UnAuthorizedException'

const message = 'You are not authorized'
const status = 403
const errorCode = 'E_UNAUTHORIZED'

throw new UnAuthorized(message, status, errorCode)
```

Você pode auto-cuidar essa exceção implementando o método `handle` na classe de exceção.

```ts
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

```ts
// app/Exceptions/UnAuthorizedException.ts

import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UnAuthorizedException extends Exception {
  public report(error: this, ctx: HttpContextContract) {
    reportingService.report(error.message)
  }
}
```
