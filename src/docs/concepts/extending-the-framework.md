---
summary: Aprenda a estender o framework AdonisJS usando macros e getters.
---

# Estendendo o framework

A arquitetura do AdonisJS torna muito fácil estender o framework. Nós dogfood as APIs principais do framework para construir um ecossistema de pacotes primários.

Neste guia, exploraremos diferentes APIs que você pode usar para estender o framework por meio de um pacote ou dentro da base de código do seu aplicativo.

## Macros e getters

Macros e getters oferecem uma API para adicionar propriedades ao protótipo de uma classe. Você pode pensar neles como açúcar sintático para `Object.defineProperty`. Por baixo dos panos, usamos o pacote [macroable](https://github.com/poppinss/macroable), e você pode consultar seu README para uma explicação técnica aprofundada.

Como macros e getters são adicionados em tempo de execução, você terá que informar o TypeScript sobre as informações de tipo para a propriedade adicionada usando [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).

Você pode escrever o código para adicionar macros dentro de um arquivo dedicado (como o `extensions.ts`) e importá-lo dentro do método `boot` do provedor de serviços.

```ts
// providers/app_provider.ts

export default class AppProvider {
  async boot() {
    await import('../src/extensions.js')
  }
}
```

No exemplo a seguir, adicionamos o método `wantsJSON` à classe [Request](../basics/request.md) e definimos seus tipos simultaneamente.

```ts
// src/extensions.ts

import { Request } from '@adonisjs/core/http'

Request.macro('wantsJSON', function (this: Request) {
  const firstType = this.types()[0]
  if (!firstType) {
    return false
  }
  
  return firstType.includes('/json') || firstType.includes('+json')
})
```

```ts
// src/extensions.ts

declare module '@adonisjs/core/http' {
  interface Request {
    wantsJSON(): boolean
  }
}
```

- O caminho do módulo durante a chamada `declare module` deve ser o mesmo que o caminho que você usa para importar a classe.
- O nome `interface` deve ser o mesmo que o nome da classe à qual você adiciona a macro ou o getter.

### Getters

Getters são propriedades avaliadas preguiçosamente adicionadas a uma classe. Você pode adicionar um getter usando o método `Class.getter`. O primeiro argumento é o nome do getter, e o segundo argumento é a função de retorno de chamada para calcular o valor da propriedade.

Os retornos de chamada do getter não podem ser assíncronos porque [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) em JavaScript não podem ser assíncronos.

```ts
import { Request } from '@adonisjs/core/http'

Request.getter('hasRequestId', function (this: Request) {
  return this.header('x-request-id')
})

// você pode usar a propriedade da seguinte maneira.
if (ctx.request.hasRequestId) {
}
```

Getters podem ser um singleton, o que significa que a função para calcular o valor do getter será chamada uma vez, e o valor de retorno será armazenado em cache para uma instância da classe.

```ts
const isSingleton = true

Request.getter('hasRequestId', function (this: Request) {
  return this.header('x-request-id')
}, isSingleton)
```

### Classes macroáveis

A seguir está a lista de classes que podem ser estendidas usando macros e getters.

| Class                                                                                          | Import path                 |
|------------------------------------------------------------------------------------------------|-----------------------------|
| [Application](https://github.com/adonisjs/application/blob/main/src/application.ts)            | `@adonisjs/core/app`        |
| [Request](https://github.com/adonisjs/http-server/blob/main/src/request.ts)                    | `@adonisjs/core/http`       |
| [Response](https://github.com/adonisjs/http-server/blob/main/src/response.ts)                  | `@adonisjs/core/http`       |
| [HttpContext](https://github.com/adonisjs/http-server/blob/main/src/http_context/main.ts)      | `@adonisjs/core/http`       |
| [Route](https://github.com/adonisjs/http-server/blob/main/src/router/route.ts)                 | `@adonisjs/core/http`       |
| [RouteGroup](https://github.com/adonisjs/http-server/blob/main/src/router/group.ts)            | `@adonisjs/core/http`       |
| [RouteResource](https://github.com/adonisjs/http-server/blob/main/src/router/resource.ts)      | `@adonisjs/core/http`       |
| [BriskRoute](https://github.com/adonisjs/http-server/blob/main/src/router/brisk.ts)            | `@adonisjs/core/http`       |
| [ExceptionHandler](https://github.com/adonisjs/http-server/blob/main/src/exception_handler.ts) | `@adonisjs/core/http`       |
| [MultipartFile](https://github.com/adonisjs/bodyparser/blob/main/src/multipart/file.ts)        | `@adonisjs/core/bodyparser` |

## Módulos de extensão
A maioria dos módulos AdonisJS fornece APIs extensíveis para registrar implementações personalizadas. A seguir, uma lista agregada dos mesmos.

* [Criando driver Hash](../security/hashing.md#creating-a-custom-hash-driver)
* [Criando driver Session](../basics/session.md#creating-a-custom-session-store)
* [Criando driver Social auth](../authentication/social_authentication.md#creating-a-custom-social-driver)
* [Estendendo REPL](../digging_deeper/repl.md#adding-custom-methods-to-repl)
* [Criando carregador de traduções i18n](../digging_deeper/i18n.md#creating-a-custom-translation-loader)
* [Criando formatador de traduções i18n](../digging_deeper/i18n.md#creating-a-custom-translation-formatter)
