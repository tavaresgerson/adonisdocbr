# Contexto

O contexto HTTP é um objeto específico do pedido que contém as informações como o `request body`, `cookies`, 
`headers`, o usuário logado no momento com `logged in user`, e muito mais para uma determinada solicitação HTTP.

O contexto HTTP é passado por referência ao manipulador de rota, middleware, ganchos HTTP e o manipulador de exceção.

```ts
Route.get('/', ({ request, auth, response }) => {
  /**
   * Requisição URL
   */
  console.log(request.url())

  /**
   * Corpo da requisição + parâmetros
   */
  console.log(request.all())

  /**
   * Envia uma resposta
   */
  response.send('hello world')
  response.send({ hello: 'world' })

  /**
   * Disponível quando a autenticação está configurada
   */
  console.log(auth.user)
})
```

Certifique-se de definir o tipo de contexto HTTP explicitamente ao acessar dentro de um método do controlador.

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

class HomeController {
  public async index({ request, response }: HttpContextContract) {

  }
}
```

### Quais diferenças dos objetos `req` e `res` do express?
Você não verá nenhum objeto `req` ou `res` em AdonisJS. Tudo, incluindo a solicitação e a resposta, faz parte do contexto HTTP.

Além disso, você é incentivado a adicionar suas propriedades personalizadas ao objeto `ctx` e NÃO ao objeto `request`.

### Propriedades de contexto Http
A seguir está a lista de propriedades disponíveis no contexto HTTP. À medida que você instala novos pacotes, eles também 
podem adicionar mais propriedades a este objeto.

<p align="center">
  <img src="/assets/context-inspect.png" width="630" />
</p>

<p align="center">
  Saída de `ctx.inspect ({depth: 0})`
</p>

#### request
Referência à solicitação HTTP

```ts
Route.get('/', async ({ request }) => {})
```

#### response
Referência à resposta HTTP

```ts
Route.get('/', async ({ response }) => {})
```

#### logger
Referência à instância do criador de logs. Uma instância filho do criador de logs com um 
ID de solicitação exclusivo é criada para cada solicitação HTTP.

```ts
Route.get('/', async ({ logger }) => {})
```

#### route
Referência à rota correspondente para a solicitação HTTP atual. O objeto de rota 
possui as seguintes propriedades.

+ `pattern`: O padrão da rota
+ `handler`: O gerenciador de rota
+ `middleware`: Uma matriz de middleware de rota
+ `name`: Nome da rota (se houver)

```ts
Route.get('/', async ({ route }) => {})
```
#### params
Um objeto de parâmetros de rota.

```ts
Route.get('users/:id', async ({ params }) => {
  console.log(params.id)
})
```

#### subdomains
Um objeto de subdomínios de rota. Disponível apenas quando a rota está registrada com um domínio.

```ts
Route.group(() => {
  Route.get('/', async ({ subdomains }) => {
    console.log(subdomains.tenant)
  })
}).domain(':tenant.adonisjs.com')
```

#### session
Referência ao objeto da sessão. Disponível apenas quando o pacote `@adonisjs/session` está instalado.

```ts
Route.get('/', async ({ session }) => {
  session.get('cart_value')
})
```

#### auth
Referência ao objeto `auth`. Disponível apenas quando o pacote `@adonisjs/auth` está instalado.

```ts
Route.get('/', async ({ auth }) => {
  console.log(auth.user)
})
```

#### view
Referência ao objeto renderizador de visualização. Disponível apenas quando o pacote `@adonisjs/view` está instalado.

```ts
Route.get('/', async ({ view }) => {
  return view.render('welcome')
})
```

#### ally
Referência ao objeto `ally`. Disponível apenas quando o pacote `@adonisjs/ally` está instalado.

```ts
Route.get('/', async ({ ally }) => {
  return ally.use('github').redirect()
})
```

#### bouncer
Referência ao objeto `bouncer`. Disponível apenas quando o pacote `@adonisjs/bouncer` está instalado.

```ts
Route.get('/', async ({ bouncer }) => {
  await bouncer.authorize('viewPost', post)
})
```

### Extendendo o Contexto
O objeto de contexto HTTP deve ser estendido por outros pacotes ou pelo seu próprio código de aplicativo. Um caso de 
uso comum é anexar propriedades personalizadas dentro de um middleware. Por exemplo:

```ts
import geoip from 'geoip-lite'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserLocationMiddleware {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    ctx.location = geoip.lookup(ctx.request.ip())
    await next()
  }
}
```

Aqui, adicionamos uma propriedade `location` customizada ao `ctx`, que você pode acessar dentro do 
manipulador de rota ou no próximo middleware.

### Informar ao typescript sobre a propriedade personalizada
A propriedade `location` é adicionada no tempo de execução; portanto, o TypeScript não sabe sobre isso. Para informar ao 
TypeScript, usaremos a fusão de declarações e adicionaremos a interface `HttpContextContract`.

Crie um novo arquivo no caminho `contracts/context.ts` (o nome do arquivo não é importante) e cole o seguinte 
conteúdo dentro dele:

```ts
// contracts/context.ts

declare module '@ioc:Adonis/Core/HttpContext' {
  import { Lookup } from 'geoip-lite'

  interface HttpContextContract {
    location: Lookup | null
  }
}
```

Isso é tudo! Agora, o TypeScript não irá reclamar da propriedade ausente no objeto `ctx`.

#### Usando getters e macros
Você também pode usar `getters` e `macros` para adicionar propriedades personalizadas ao objeto `ctx`. No exemplo anterior, 
adicionamos uma propriedade de instância ao objeto `ctx`. No entanto, `getters` e `macros` adicionam a propriedade no protótipo da classe.

Além disso, não há necessidade de criar um middleware desta vez, pois você precisa definir as macros/getters apenas uma vez e 
elas estarão disponíveis para todas as instâncias da classe `HttpContext`.

Abra o arquivo `providers/AppProvider.ts` pré-existente e cole o código a seguir dentro do método `boot`.

```ts
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

Por padrão, os getters são avaliados em cada acesso. No entanto, você também pode marcá-los como um `singleton`, conforme mostrado no exemplo a seguir.

```ts
HttpContext.getter(
  'location',
  function location() {
    return geoip.lookup(this.request.ip())
  },
  true // 👈 registra como um singleton
)
```

#### Macros
Os getters estão sempre acessíveis como propriedades. No entanto, as macros podem ser propriedades e métodos.

```ts
HttpContext.macro('getLocation', function location() {
  return geoip.lookup(this.request.ip())
})

// Accesse como
ctx.getLocation()
```
Ou anexe um valor literal.

```ts
HttpContext.macro('pid', process.pid)

// Accesse como
ctx.pid
```
