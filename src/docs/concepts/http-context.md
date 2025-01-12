---
summary: Aprenda sobre o contexto HTTP no AdonisJS e como acessá-lo a partir de manipuladores de rota, middleware e manipuladores de exceção.
---

# Contexto HTTP

Uma nova instância da [classe Contexto HTTP](https://github.com/adonisjs/http-server/blob/main/src/http_context/main.ts) é gerada para cada solicitação HTTP e passada para o manipulador de rota, middleware e manipulador de exceção.

O Contexto HTTP contém todas as informações que você pode precisar relacionadas a uma solicitação HTTP. Por exemplo:

Propriedade [ctx.request](../basics/request.md).
Propriedade [ctx.response](../basics/response.md).
Propriedade [ctx.auth](../authentication/introduction.md).
Propriedade [ctx.bouncer](../security/authorization.md).
- E assim por diante.

Em poucas palavras, o contexto é um armazenamento específico de solicitação que contém todas as informações para a solicitação em andamento.

## Obtendo acesso ao contexto HTTP

O contexto HTTP é passado por referência ao manipulador de rota, middleware e manipulador de exceção, e você pode acessá-lo da seguinte maneira.

### Manipulador de rota

O [manipulador de roteador](../basics/routing.md) recebe o contexto HTTP como o primeiro parâmetro.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', (ctx) => {
  console.log(ctx.inspect())
})
```

```ts
// title: Destructure properties
import router from '@adonisjs/core/services/router'

router.get('/', ({ request, response }) => {
  console.log(request.url())
  console.log(request.headers())
  console.log(request.qs())
  console.log(request.body())
  
  response.send('hello world')
  response.send({ hello: 'world' })
})
```

### Método do controlador

O [método do controlador](../basics/controllers.md) (semelhante ao manipulador do roteador) recebe o contexto HTTP como o primeiro parâmetro.

```ts
import { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ request, response }: HttpContext) {
  }
}
```

### Classe do middleware

O método `handle` da [classe do middleware](../basics/middleware.md) recebe o contexto HTTP como o primeiro parâmetro.

```ts
import { HttpContext } from '@adonisjs/core/http'

export default class AuthMiddleware {
  async handle({ request, response }: HttpContext) {
  }
}
```

### Classe manipuladora de exceções

Os métodos `handle` e `report` da classe [manipulador de exceções global](../basics/exception_handling.md) recebem o contexto HTTP como o segundo parâmetro. O primeiro parâmetro é a propriedade `error`.

```ts
import {
  HttpContext,
  HttpExceptionHandler
} from '@adonisjs/core/http'

export default class ExceptionHandler extends HttpExceptionHandler {
  async handle(error: unknown, ctx: HttpContext) {
    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
```

## Injetando contexto HTTP usando injeção de dependência

Se você usar injeção de dependência em todo o seu aplicativo, poderá injetar o contexto HTTP em uma classe ou método por meio de dicas de tipo da classe `HttpContext`.

:::warning
Certifique-se de que o middleware `#middleware/container_bindings_middleware` esteja registrado dentro do arquivo `kernel/start.ts`. Este middleware é necessário para resolver valores específicos da solicitação (por exemplo, a classe HttpContext) do contêiner.
:::

[Guia do contêiner IoC](../concepts/dependency_injection.md)

```ts
// title: app/services/user_service.ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserService {
  constructor(protected ctx: HttpContext) {}
  
  all() {
    // method implementation
  }
}
```

Para que a resolução automática de dependências funcione, você deve injetar o `UserService` dentro do seu controlador. Lembre-se, o primeiro argumento para um método do controlador sempre será o contexto, e o restante será injetado usando o contêiner IoC.

```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'

export default class UsersController {
  @inject()
  index(ctx: HttpContext, userService: UserService) {
    return userService.all()
  }
}
```

Isso é tudo! O `UserService` agora receberá automaticamente uma instância da solicitação HTTP em andamento. Você pode repetir o mesmo processo para dependências aninhadas também.

## Acessando o contexto HTTP de qualquer lugar dentro do seu aplicativo

A injeção de dependência é uma maneira de aceitar o contexto HTTP como um construtor de classe ou uma dependência de método e, então, confiar no contêiner para resolvê-lo para você.

No entanto, não é um requisito difícil reestruturar seu aplicativo e usar a injeção de dependência em todos os lugares. Você também pode acessar o contexto HTTP de qualquer lugar dentro do seu aplicativo usando o [Armazenamento local assíncrono](https://nodejs.org/dist/latest-v21.x/docs/api/async_context.html#class-asynclocalstorage) fornecido pelo Node.js.

Temos um [guia dedicado](./async_local_storage.md) sobre como o armazenamento local assíncrono funciona e como o AdonisJS o usa para fornecer acesso global ao contexto HTTP.

No exemplo a seguir, a classe `UserService` usa o método `HttpContext.getOrFail` para obter a instância do contexto HTTP para a solicitação em andamento.

```ts
// title: app/services/user_service.ts
import { HttpContext } from '@adonisjs/core/http'

export default class UserService {
  all() {
    const ctx = HttpContext.getOrFail()
    console.log(ctx.request.url())
  }
}
```

O bloco de código a seguir mostra o uso da classe `UserService` dentro do `UsersController`.

```ts
import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'

export default class UsersController {
  index(ctx: HttpContext) {
    const userService = new UserService()
    return userService.all()
  }
}
```

## Propriedades do contexto HTTP

A seguir está a lista de propriedades que você pode acessar por meio do contexto HTTP. À medida que você instala novos pacotes, eles podem adicionar propriedades adicionais ao contexto.

### `ctx.request`

Referência a uma instância da [classe HTTP Request](../basics/request.md).

### `ctx.response`

Referência a uma instância da [classe HTTP Response](../basics/response.md).

### `ctx.logger`

Referência a uma instância de [logger](../digging_deeper/logger.md) criada para uma determinada solicitação HTTP.

### `ctx.route`

A rota correspondente para a solicitação HTTP atual. A propriedade `route` é um objeto do tipo [StoreRouteNode](https://github.com/adonisjs/http-server/blob/main/src/types/route.ts#L69)

### `ctx.params`

Um objeto de parâmetros de rota

### `ctx.subdomains`

Um objeto de subdomínios de rota. Existe apenas quando a rota faz parte de um subdomínio dinâmico

### `ctx.session`

Referência a uma instância de [Session](../basics/session.md) criada para a solicitação HTTP atual.

### `ctx.auth`

Referência a uma instância da [classe Authenticator](https://github.com/adonisjs/auth/blob/main/src/authenticator.ts). Saiba mais sobre [autenticação](../authentication/introduction.md).

### `ctx.view`

Referência a uma instância do renderizador Edge. Saiba mais sobre o Edge em [Guia de visualização e modelos](../views-and-templates/introduction.md#using-edge)

### `ctx.ally`

Referência a uma instância da [classe Ally Manager](https://github.com/adonisjs/ally/blob/main/src/ally_manager.ts) para implementar login social em seus aplicativos. Saiba mais sobre [Ally](../authentication/social_authentication.md)

### `ctx.bouncer`

Referência a uma instância da [classe Bouncer](https://github.com/adonisjs/bouncer/blob/main/src/bouncer.ts). Saiba mais sobre [Autorização](../security/authorization.md).

### `ctx.i18n`

Referência a uma instância da [classe I18n](https://github.com/adonisjs/i18n/blob/main/src/i18n.ts). Saiba mais sobre `i18n` no guia [Internacionalização](../digging_deeper/i18n.md).

## Estendendo o contexto HTTP

Você pode adicionar propriedades personalizadas à classe de contexto HTTP usando macros ou getters. Certifique-se de ler o [guia de extensão do AdonisJS](./extending_the_framework.md) primeiro se você for novo no conceito de macros.

```ts
import { HttpContext } from '@adonisjs/core/http'

HttpContext.macro('aMethod', function (this: HttpContext) {
  return value
})

HttpContext.getter('aProperty', function (this: HttpContext) {
  return value
})
```

Como as macros e getters são adicionados em tempo de execução, você deve informar o TypeScript sobre seus tipos usando o aumento do módulo.

```ts
import { HttpContext } from '@adonisjs/core/http'

// insert-start
declare module '@adonisjs/core/http' {
  export interface HttpContext {
    aMethod: () => ValueType
    aProperty: ValueType
  }
}
// insert-end

HttpContext.macro('aMethod', function (this: HttpContext) {
  return value
})

HttpContext.getter('aProperty', function (this: HttpContext) {
  return value
})
```

## Criando contexto fictício durante os testes

Você pode usar o serviço `testUtils` para criar um contexto HTTP fictício durante os testes.

A instância de contexto não é anexada a nenhuma rota; portanto, os valores `ctx.route` e `ctx.params` serão indefinidos. No entanto, você pode atribuir manualmente essas propriedades se necessário pelo código em teste.

```ts
import testUtils from '@adonisjs/core/services/test_utils'

const ctx = testUtils.createHttpContext()
```

Por padrão, o método `createHttpContext` usa valores falsos para os objetos `req` e `res`. No entanto, você pode definir valores personalizados para essas propriedades, conforme mostrado no exemplo a seguir.

```ts
import { createServer } from 'node:http'
import testUtils from '@adonisjs/core/services/test_utils'

createServer((req, res) => {
  const ctx = testUtils.createHttpContext({
    // highlight-start
    req,
    res
    // highlight-end
  })
})
```

### Usando a fábrica HttpContext
O serviço `testUtils` está disponível apenas dentro de um aplicativo AdonisJS; Portanto, se você estiver criando um pacote e precisar acessar um contexto HTTP falso, poderá usar a classe [HttpContextFactory](https://github.com/adonisjs/http-server/blob/main/factories/http_context.ts#L30).

```ts
import { HttpContextFactory } from '@adonisjs/core/factories/http'
const ctx = new HttpContextFactory().create()
```
