---
resumo: Aprenda sobre middleware no AdonisJS, como criá-los e como atribuí-los a rotas e grupos de rotas.
---

# Middleware

Middleware é uma série de funções executadas durante uma solicitação HTTP antes que a solicitação chegue ao manipulador de rotas. Cada função na cadeia pode encerrar a solicitação ou encaminhá-la para o próximo middleware.

Um aplicativo AdonisJS típico usa middleware para **analisar o corpo da solicitação**, **gerenciar sessões de usuários**, **autenticar solicitações**, **servir ativos estáticos**, etc.

Você também pode criar middleware personalizado para executar tarefas adicionais durante uma solicitação HTTP.

## Pilhas de middleware

Para dar a você melhor controle sobre a execução do pipeline de middleware, o AdonisJS dividiu a pilha de middleware nos três grupos a seguir.

### Pilha de middleware do servidor

O middleware do servidor é executado em todas as solicitações HTTP, mesmo que você não tenha definido nenhuma rota para a URL da solicitação atual.

Eles são ótimos para adicionar funcionalidades adicionais ao seu aplicativo que não dependem do sistema de roteamento do framework. Por exemplo, o middleware Static Assets é registrado como middleware de servidor.

Você pode registrar o middleware de servidor usando o método `server.use` dentro do arquivo `start/kernel.ts`.

```ts
import server from '@adonisjs/core/services/server'

server.use([
  () => import('@adonisjs/static/static_middleware')
])
```

---

### Pilha de middleware de roteador

O middleware de roteador também é conhecido como middleware global. Ele é executado em cada solicitação HTTP que tem uma rota correspondente.

O Bodyparser, auth e o middleware de sessão são registrados na pilha de middleware de roteador.

Você pode registrar o middleware de roteador usando o método `router.use` dentro do arquivo `start/kernel.ts`.

```ts
import router from '@adonisjs/core/services/router'

router.use([
  () => import('@adonisjs/core/bodyparser_middleware')
])
```

---

### Coleção de middleware nomeado

O middleware nomeado é uma coleção de middleware que não são executados a menos que explicitamente atribuídos a uma rota ou grupo.

Em vez de definir o middleware como um retorno de chamada em linha dentro do arquivo de rotas, recomendamos que você crie classes de middleware dedicadas, armazene-as dentro da coleção de middleware nomeada e, em seguida, atribua-as às rotas.

Você pode definir o middleware nomeado usando o método `router.named` dentro do arquivo `start/kernel.ts`. Certifique-se de exportar a coleção nomeada para poder usá-la [dentro do arquivo de rotas](#assigning-middleware-to-routes-and-route-groups).

```ts
import router from '@adonisjs/core/services/router'

router.named({
  auth: () => import('#middleware/auth_middleware')
})
```

## Criando middleware

O middleware é armazenado dentro do diretório `./app/middleware`, e você pode criar um novo arquivo de middleware executando o comando ace `make:middleware`.

[Comando Make middleware](../references/commands.md#makemiddleware)

```sh
node ace make:middleware user_location
```

O comando acima criará o arquivo `user_location_middleware.ts` no diretório middleware.

Um middleware é representado como uma classe com o método `handle`. Durante a execução, o AdonisJS chamará automaticamente esse método e dará a ele o [HttpContext](../concepts/http_context.md) como o primeiro argumento.

```ts
// title: app/middleware/user_location_middleware.ts
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class UserLocationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
  }
}
```

Dentro do método `handle`, um middleware tem que decidir se continua com a solicitação, finaliza a solicitação enviando uma resposta ou gera uma exceção para abortar a solicitação.


### Abortar solicitação

Se um middleware gerar uma exceção, todos os middlewares futuros e o manipulador de rotas não serão executados, e a exceção será dada ao manipulador de exceções global.

```ts
import { Exception } from '@adonisjs/core/exceptions'
import { NextFn } from '@adonisjs/core/types/http'

export default class UserLocationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    throw new Exception('Aborting request')
  }
}
```

### Continuar com a solicitação

Você deve chamar o método `next` para continuar com a solicitação. Caso contrário, o restante das ações dentro da pilha de middleware não serão executadas.

```ts
export default class UserLocationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Call the `next` function to continue
    await next()      
  }
}
```

### Enviar uma resposta e não chamar o método `next`

Finalmente, você pode encerrar a solicitação enviando a resposta. Nesse caso, não chame o método `next`.

```ts
export default class UserLocationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // send response + do not call next
    ctx.response.send('Ending request')
  }
}
```

## Atribuindo middleware a rotas e grupos de rotas

A coleção de middleware nomeada não é usada por padrão, e você deve atribuí-la explicitamente a rotas ou grupos de rotas.

No exemplo a seguir, primeiro importamos a coleção `middleware` e atribuímos o middleware `userLocation` a uma rota.

```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .get('posts', () => {})
  .use(middleware.userLocation())
```

Vários middlewares podem ser aplicados como uma matriz ou chamando o método `use` várias vezes.

```ts
router
  .get('posts', () => {})
  .use([
    middleware.userLocation(),
    middleware.auth()
  ])
```

Da mesma forma, você também pode atribuir middleware a um grupo de rotas. O middleware do grupo será aplicado a todas as rotas do grupo automaticamente.

```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.group(() => {

  router.get('posts', () => {})
  router.get('users', () => {})
  router.get('payments', () => {})

}).use(middleware.userLocation())
```

## Parâmetros do middleware

O middleware registrado na coleção de middleware nomeada pode aceitar um parâmetro adicional como parte dos argumentos do método `handle`. Por exemplo, o middleware `auth` aceita o guard de autenticação como uma opção de configuração.

```ts
type AuthGuards = 'web' | 'api'

export default class AuthMiddleware {
  async handle(ctx, next, options: { guard: AuthGuards }) {
  }
}
```

Ao atribuir o middleware à rota, você pode especificar o guard a ser usado.

```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.get('payments', () => {}).use(
  middleware.auth({ guard: 'web' })
)
```

## Injeção de dependência

As classes de middleware são instanciadas usando o [contêiner IoC](../concepts/dependency_injection.md); portanto, você pode dar dicas de tipo para dependências dentro do construtor de middleware, e o contêiner as injetará para você.

Dado que você tem uma classe `GeoIpService` para procurar a localização do usuário a partir do IP da solicitação, você pode injetá-la no middleware usando o decorador `@inject`.

```ts
// title: app/services/geoip_service.ts
export class GeoIpService {
  async lookup(ipAddress: string) {
    // lookup location and return
  }
}
```

```ts
import { inject } from '@adonisjs/core'
import { GeoIpService } from '#services/geoip_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

@inject()
export default class UserLocationMiddleware {
  constructor(protected geoIpService: GeoIpService) {
  }

  async handle(ctx: HttpContext, next: NextFn) {
    const ip = ctx.request.ip()
    ctx.location = await this.geoIpService.lookup(ip)
  }
}
```

## Fluxo de execução do middleware

A camada de middleware do AdonisJS é construída sobre o padrão de design [Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility). Um middleware tem duas fases de execução: a **fase downstream** e a **fase upstream**.

- A fase downstream é o bloco de código que você escreve antes de chamar o método `next`. Nesta fase, você manipula a solicitação.
- A fase upstream é o bloco de código que você pode escrever após chamar o método `next`. Nesta fase, você pode inspecionar a resposta ou alterá-la completamente.

![](./middleware_flow.jpeg)

## Middleware e tratamento de exceções

O AdonisJS captura automaticamente a exceção gerada pelo pipeline do middleware ou pelo manipulador de rotas e a converte em uma resposta HTTP usando o [manipulador de exceções global](./exception_handling.md).

Como resultado, você não precisa encapsular as chamadas de função `next` dentro de uma instrução `try/catch`. Além disso, o tratamento automático de exceções garante que a lógica upstream do middleware seja sempre executada após a chamada de função `next`.

## Mutando a resposta de um middleware

A fase upstream do middleware pode mutar o corpo da resposta, os cabeçalhos e o código de status. Isso descartará a resposta antiga definida pelo manipulador de rota ou qualquer outro middleware.

Antes de mutar a resposta, você deve garantir que está lidando com o tipo de resposta correto. A seguir está a lista de tipos de resposta na classe `Response`.

- **Resposta padrão** refere-se ao envio de valores de dados usando o método `response.send`. Seu valor pode ser um `Array`, `Object`, `String`, `Boolean` ou `Buffer`.
- **Resposta de streaming** refere-se ao envio de um fluxo para o soquete de resposta usando o método `response.stream`.
- **Resposta de download de arquivo** refere-se ao download de um arquivo usando o método `response.download`.

Você terá/não terá acesso a propriedades de resposta específicas com base no tipo de resposta.

### Lidando com uma resposta padrão

Ao mutar uma resposta padrão, você pode acessá-la usando a propriedade `response.content`. Certifique-se primeiro de verificar se o `content` existe ou não.

```ts
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class {
  async handle({ response }: HttpContext, next: NextFn) {
    await next()
    
    if (response.hasContent) {
      console.log(response.content)
      console.log(typeof response.content)
      
      response.send(newResponse)
    }
  }
}
```

### Lidando com uma resposta de streaming

Os fluxos de resposta definidos usando o método `response.stream` não são imediatamente canalizados para a [resposta HTTP](https://nodejs.org/api/http.html#class-httpserverresponse) de saída. Em vez disso, o AdonisJS aguarda o manipulador de rota e o pipeline do middleware terminarem.

Como resultado, dentro de um middleware, você pode substituir o fluxo existente por um novo fluxo ou definir manipuladores de eventos para monitorar o fluxo.

```ts
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class {
  async handle({ response }: HttpContext, next: NextFn) {
    await next()
    
    if (response.hasStream) {
      response.outgoingStream.on('data', (chunk) => {
        console.log(chunk)
      })
    }
  }
}
```

### Lidando com downloads de arquivos

Os downloads de arquivos realizados usando os métodos `response.download` e `response.attachment` adiam o processo de download até que o manipulador de rotas e o pipeline do middleware terminem.

Como resultado, dentro de um middleware, você pode substituir o caminho para o arquivo ser baixado.

```ts
import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class {
  async handle({ response }: HttpContext, next: NextFn) {
    await next()
    
    if (response.hasFileToStream) {
      console.log(response.fileToStream.generateEtag)
      console.log(response.fileToStream.path)
    }
  }
}
```

## Testando classes de middleware

A criação de middleware como classes permite que você teste facilmente um middleware isoladamente (também conhecido como teste de unidade de um middleware). Existem algumas maneiras diferentes de testar middleware. Vamos explorar todas as opções disponíveis.

A opção mais simples é criar uma nova instância da classe de middleware e invocar o método `handle` com o contexto HTTP e a função de retorno de chamada `next`.

```ts
import testUtils from '@adonisjs/core/services/test_utils'
import GeoIpService from '#services/geoip_service'
import UserLocationMiddleware from '#middleware/user_location_middleware'

const middleware = new UserLocationMiddleware(
  new GeoIpService()
)

const ctx = testUtils.createHttpContext()
await middleware.handle(ctx, () => {
  console.log('Next function invoked')
})
```

O serviço `testUtils` está disponível somente após o aplicativo AdonisJS ser inicializado. No entanto, se você estiver testando um middleware dentro de um pacote, você pode usar a classe `HttpContextFactory` para criar uma instância de contexto HTTP fictícia sem inicializar um aplicativo.

[Teste de middleware CORS](https://github.com/adonisjs/cors/blob/main/tests/cors_middleware.spec.ts#L24-L41) para um exemplo do mundo real.

```ts
import {
  RequestFactory,
  ResponseFactory,
  HttpContextFactory
} from '@adonisjs/core/factories/http'

const request = new RequestFactory().create()
const response = new ResponseFactory().create()
const ctx = new HttpContextFactory()
  .merge({ request, response })
  .create()

await middleware.handle(ctx, () => {
  console.log('Next function invoked')
})
```

### Usando o pipeline do servidor

Se seu middleware depende de outro middleware para ser executado primeiro, você pode compor um pipeline de middleware usando o método `server.pipeline`.

- O método `server.pipeline` aceita uma matriz de classes de middleware.
- A instância de classe é criada usando o contêiner IoC.
- O fluxo de execução é o mesmo que o fluxo de execução original do middleware durante uma solicitação HTTP.

```ts
import testUtils from '@adonisjs/core/services/test_utils'
import server from '@adonisjs/core/services/server'
import UserLocationMiddleware from '#middleware/user_location_middleware'

const pipeline = server.pipeline([
  UserLocationMiddleware
])

const ctx = testUtils.createHttpContext()
await pipeline.run(ctx)
```

Você pode definir as funções `finalHandler` e `errorHandler` antes de chamar o método `pipeline.run`.

- O manipulador final é executado após todo o middleware ter sido executado. O manipulador final não é executado quando qualquer middleware encerra a cadeia sem chamar o método `next`.
- O manipulador de erros é executado se um middleware gera uma exceção. O fluxo upstream será iniciado após o manipulador de erros ser invocado.

```ts
const ctx = testUtils.createHttpContext()

await pipeline
 .finalHandler(() => {
   console.log('all middleware called next')
   console.log('the upstream logic starts from here')
 })
 .errorHandler((error) => {
   console.log('an exception was raised')
   console.log('the upstream logic starts from here')
 })
 .run(ctx)
 
console.log('pipeline executed')
```

O serviço `server` fica disponível após o aplicativo ser inicializado. No entanto, se você estiver criando um pacote, poderá usar o `ServerFactory` para criar uma instância da classe Server sem inicializar o aplicativo.

```ts
import { ServerFactory } from '@adonisjs/core/factories/http'

const server = new ServerFactory().create()
const pipeline = server.pipeline([
  UserLocationMiddleware
])
```
