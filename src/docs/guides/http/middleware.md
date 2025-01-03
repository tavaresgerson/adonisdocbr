# Middleware

Middleware é uma série de funções que são executadas durante uma solicitação HTTP antes que ela chegue ao manipulador de rota. Cada função na cadeia tem a capacidade de encerrar a solicitação ou encaminhá-la para a função `next`.

## Exemplo básico

A maneira mais simples de testar um middleware é anexá-lo à rota usando o método `Route.middleware`. Por exemplo:

```ts {5-9}
Route
  .get('/users/:id', async () => {
    return 'Show user'
  })
  .middleware(async (ctx, next) => {
    console.log(`Inside middleware ${ctx.request.url()}`)
    await next()
  })
```

<video src="/docs/assets/route-middleware.webm" controls />

## Classes de middleware

Escrever middleware como funções inline é bom para alguns testes rápidos. No entanto, recomendamos extrair a lógica do middleware para seu próprio arquivo.

Você pode criar um novo middleware executando o seguinte comando Ace.

```sh
node ace make:middleware LogRequest

# CREATE: app/Middleware/LogRequest.ts
```

### Sobre a classe middleware

As classes middleware são armazenadas (mas não limitadas a) dentro do diretório `app/Middleware` e cada arquivo representa um único middleware.

Toda classe middleware deve implementar o método `handle` para manipular a solicitação HTTP e chamar o método `next` para encaminhar a solicitação para o próximo middleware ou o manipulador de rota.

```ts
// app/Middleware/LogRequest.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LogRequest {
  public async handle(
    { request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    console.log(`-> ${request.method()}: ${request.url()}`)
    await next()
  }
}
```

Além disso, você pode encerrar solicitações do middleware gerando uma exceção ou enviando a resposta usando o método `response.send`.

::: info NOTA
Certifique-se de NÃO chamar o método `next` quando decidir encerrar a solicitação.
:::

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    if (notAuthenticated) {
      response.unauthorized({ error: 'Must be logged in' })
      return
    }

    await next()
  }
}
```

## Registrando middleware

Para que o middleware entre em vigor, ele deve ser registrado como um **middleware global** ou um **middleware nomeado** dentro do arquivo `start/kernel.ts`.

### Middleware global

Middleware global é executado para todas as solicitações HTTP na mesma sequência em que são registradas.

Você os registra como uma matriz dentro do arquivo `start/kernel.ts`, conforme mostrado abaixo:

```ts {5}
// start/kernel.ts

Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
  () => import('App/Middleware/LogRequest')
])
```

### Middleware nomeado

O middleware nomeado permite que você aplique middleware seletivamente em suas rotas/grupo de rotas. Você começa registrando-os com um nome exclusivo e depois faz referência a ele na rota por esse nome.

```ts
// start/kernel.ts

Server.middleware.registerNamed({
  auth: () => import('App/Middleware/Auth')
})
```

Agora, você pode anexar o middleware `auth` a uma rota, conforme mostrado no exemplo a seguir.

```ts
Route
  .get('dashboard', 'DashboardController.index')
  .middleware('auth') // 👈
```

O middleware pode ser aplicado a uma ou várias ações para rotas de recursos. Saiba mais sobre [aplicação de middleware a rotas com recursos](./controllers.md#applying-middleware).

Você também pode definir vários middlewares em uma rota passando-os como uma matriz ou chamando o método do middleware várias vezes.

```ts
Route
  .get('dashboard', 'DashboardController.index')
  .middleware(['auth', 'acl', 'throttle'])
```

```ts
Route
  .get('dashboard', 'DashboardController.index')
  .middleware('auth')
  .middleware('acl')
  .middleware('throttle')
```

## Passando configuração para middleware nomeado

O middleware nomeado também pode aceitar configuração de tempo de execução por meio do método `handle` como o terceiro argumento. Por exemplo:

```ts {5}
export default class Auth {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>,
    guards?: string[]
  ) {
    await next()
  }
}
```

No exemplo acima, o middleware Auth aceita uma matriz opcional `guards`. O usuário do middleware pode passar os guards da seguinte forma:

```ts
Route
  .get('dashboard', 'DashboardController.index')
  .middleware('auth:web,api')
```

## FAQs

<details>
<summary> Como desabilitar middleware em uma determinada solicitação HTTP? </summary>
  
Você não pode desabilitar middleware para uma determinada solicitação HTTP. No entanto, o middleware pode aceitar a configuração de tempo de execução para ignorar certas solicitações. 

Um ótimo exemplo disso é o middleware bodyparser. Ele [ignora todas as solicitações que não correspondem aos métodos da lista de permissões](https://github.com/adonisjs/bodyparser/blob/develop/src/BodyParser/index.ts#L108-L111) dentro do arquivo `config/bodyparser.ts`.

</details>

<details>
<summary> O middleware é executado em solicitações sem rotas? </summary>
  
O AdonisJS não executa a cadeia de middleware se não houver uma rota registrada para a solicitação HTTP atual.

</details>
