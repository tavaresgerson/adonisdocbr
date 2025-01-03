# Contexto

O contexto HTTP é um objeto específico da solicitação que contém informações como o **corpo da solicitação**, **cookies**, **cabeçalhos**, o **usuário conectado** no momento e muito mais para uma determinada solicitação HTTP.

O contexto HTTP é passado por referência ao manipulador de rotas, middleware, ganchos HTTP e manipulador de exceções.

```ts
Route.get('/', ({ request, auth, response }) => {
  /**
   * URL de solicitação
   */
  console.log(request.url())

  /**
   * Corpo da solicitação + parâmetros de consulta
   */
  console.log(request.all())

  /**
   * Enviar resposta
   */
  response.send('hello world')
  response.send({ hello: 'world' })

  /**
   * Disponível quando a autenticação está configurada
   */
  console.log(auth.user)
})
```

Certifique-se de definir o tipo de contexto HTTP explicitamente ao acessar o contexto dentro de um método do controlador.

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

class HomeController {
  public async index({ request, response }: HttpContextContract) {

  }
}
```

## Existe alguma relação com os objetos `req` e `res` do Express?
Você não verá nenhum objeto `req` ou `res` no AdonisJS. Isso ocorre porque tudo, incluindo a solicitação e a resposta, faz parte do contexto HTTP.

Além disso, você é incentivado a adicionar suas propriedades personalizadas ao objeto `ctx` e NÃO ao objeto `request`. Veja [Extending context](#extending-context).

## Acesse o contexto HTTP de qualquer lugar
O AdonisJS usa o [Async Local Storage](https://nodejs.org/dist/latest-v16.x/docs/api/async_context.html#class-asynclocalstorage) do Node.js para tornar o contexto HTTP disponível em qualquer lugar dentro do seu aplicativo.

Você pode acessar o contexto para a solicitação atual da seguinte forma:

::: warning ATENÇÃO
Certifique-se de ler atentamente o guia [Armazenamento local assíncrono](../fundamentals/async-local-storage.md) antes de usar o método `HttpContext.get`.
:::

```ts
import HttpContext from '@ioc:Adonis/Core/HttpContext'

class SomeService {
  public async someOperation() {
    const ctx = HttpContext.get()
  }
}
```

## Propriedades
A seguir está a lista de propriedades disponíveis no contexto HTTP. Conforme você instalar novos pacotes, eles também podem adicionar mais propriedades a este objeto.

![](/docs/assets/context-inspect.webp)

### `request`
Referência à [solicitação HTTP](./request.md)

```ts
Route.get('/', async ({ request }) => {})
```

### `response`
Referência à [resposta HTTP](./response.md)

```ts
Route.get('/', async ({ response }) => {})
```

### `logger`
Referência à instância do logger. Uma instância [child logger](../digging-deeper/logger.md#child_logger) com um [request ID](./request.md#request-id) exclusivo é criada para cada solicitação HTTP.

```ts
Route.get('/', async ({ logger }) => {})
```

### `route`
Referência à rota correspondente para a solicitação HTTP atual. O objeto de rota tem as seguintes propriedades.

- `pattern`: O padrão de rota
- `handler`: O manipulador de rota
- `middleware`: Uma matriz de middleware de rota
- `name`: Nome da rota (se houver)

```ts
Route.get('/', async ({ route }) => {})
```

### `params`
Um objeto de parâmetros de rota.Um objeto de parâmetros de rota.

```ts
Route.get('users/:id', async ({ params }) => {
  console.log(params.id)
})
```

### `subdomains`
Um objeto de subdomínios de rota. Disponível somente quando a rota é registrada com um domínio.

```ts
Route.group(() => {
  Route.get('/', async ({ subdomains }) => {
    console.log(subdomains.tenant)
  })
}).domain(':tenant.adonisjs.com')
```

### `session`
Referência ao [objeto Session](./session.md). Disponível somente quando o pacote `@adonisjs/session` está instalado.

```ts
Route.get('/', async ({ session }) => {
  session.get('cart_value')
})
```

### `auth`
Referência ao [objeto Auth](../auth/introduction.md). Disponível somente quando o pacote `@adonisjs/auth` está instalado.

```ts
Route.get('/', async ({ auth }) => {
  console.log(auth.user)
})
```

### `view`
Referência ao [objeto View](../views/introduction.md). Disponível somente quando o pacote `@adonisjs/view` está instalado.

```ts
Route.get('/', async ({ view }) => {
  return view.render('welcome')
})
```

### `ally`
Referência ao [objeto Ally](../auth/social.md). Disponível somente quando o pacote `@adonisjs/ally` está instalado.

```ts
Route.get('/', async ({ ally }) => {
  return ally.use('github').redirect()
})
```

### `bouncer`
Referência ao [objeto Bouncer](../digging-deeper/authorization.md). Disponível somente quando o pacote `@adonisjs/bouncer` está instalado.

```ts
Route.get('/', async ({ bouncer }) => {
  await bouncer.authorize('viewPost', post)
})
```

### `i18n`
Referência ao [objeto I18n](../digging-deeper/i18n.md#usage-during-http-requests). Disponível somente quando o pacote `@adonisjs/i18n` estiver instalado.

```ts
Route.get('/', async ({ i18n }) => {
  await i18n.formatCurrency(100, { currency: 'EUR' })
})
```

## Estendendo o contexto

O objeto de contexto HTTP é projetado para ser estendido por outros pacotes ou pelo seu próprio código de aplicativo. Um caso de uso comum é anexar propriedades personalizadas dentro de um middleware. Por exemplo:

```ts {1,6}
import geoip from 'geoip-lite'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserLocationMiddleware {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    ctx.location = geoip.lookup(ctx.request.ip())
    await next()
  }
}
```

Aqui, adicionamos uma propriedade `location` personalizada ao `ctx`, que você pode acessar dentro do manipulador de rota ou no próximo middleware.

### Informando o TypeScript sobre a propriedade personalizada

A propriedade `location` é adicionada no tempo de execução; portanto, o TypeScript não sabe sobre ela. Para informar o TypeScript sobre sua existência, usaremos [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) e adicionaremos a propriedade à interface `HttpContextContract`.

Crie um novo arquivo no caminho `contracts/context.ts` (o nome do arquivo não é importante) e cole o seguinte conteúdo dentro dele:

```ts
// contracts/context.ts

declare module '@ioc:Adonis/Core/HttpContext' {
  import { Lookup } from 'geoip-lite'

  interface HttpContextContract {
    location: Lookup | null
  }
}
```

Isso é tudo! Agora, o TypeScript não reclamará sobre a propriedade ausente no objeto `ctx`.

### Usando getters e macros

Você também pode usar getters e macros para adicionar propriedades personalizadas ao objeto `ctx`. No exemplo anterior, adicionamos uma **propriedade de instância** ao objeto `ctx`. No entanto, getters e macros adicionam a propriedade no **protótipo da classe**.

Além disso, não há necessidade de criar um middleware desta vez, pois você precisa definir as macros/getters apenas uma vez, e elas estão disponíveis para todas as instâncias da classe HttpContext.

Abra o arquivo `providers/AppProvider.ts` pré-existente e cole o seguinte código dentro do método `boot`:

```ts {3,11-17}
// providers/AppProvider.ts

import geoip from 'geoip-lite'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const HttpContext = this.app.container.use('Adonis/Core/HttpContext')

    HttpContext.getter('location', function location() {
      return geoip.lookup(this.request.ip())
    })
  }
}
```

Por padrão, os getters são avaliados em cada acesso. No entanto, você também pode marcá-los como singleton, conforme mostrado no exemplo a seguir:

```ts
HttpContext.getter(
  'location',
  function location() {
    return geoip.lookup(this.request.ip())
  },
  true // 👈 registrar como singleton
)
```

### Macros

Getters são acessíveis apenas como propriedades. No entanto, macros podem ser propriedades e métodos.

```ts
HttpContext.macro('getLocation', function location() {
  return geoip.lookup(this.request.ip())
})

// Acesse como
ctx.getLocation()
```

Ou anexe um valor literal.

```ts
HttpContext.macro('pid', process.pid)

// Acesse como
ctx.pid
```
