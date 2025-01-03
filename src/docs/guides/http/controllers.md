# Controladores

Controladores são a maneira de fato de lidar com solicitações HTTP no AdonisJS. Eles permitem que você limpe o arquivo de rotas movendo todos os manipuladores de rota em linha para seus arquivos de controlador dedicados.

No AdonisJS, os controladores são armazenados dentro (mas não limitados a) o diretório `app/Controllers/Http` e cada arquivo representa um único controlador.

Você quer extrair um método de controlador complexo para seu próprio arquivo?

Use um [Controlador de Ação Única](https://docs.adonisjs.com/guides/controllers#single-action-controllers)!

```ts
// app/Controllers/Http/PostsController.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  public async index(ctx: HttpContextContract) {
    return [
      {
        id: 1,
        title: 'Hello world',
      },
      {
        id: 2,
        title: 'Hello universe',
      },
    ]
  }
}
```

Você terá que referenciá-lo como um manipulador de rota dentro do arquivo `start/routes.ts` para usar este controlador.

```ts
Route.get('posts', 'PostsController.index')
```

## Localização dos controladores

Convencionalmente, os controladores são armazenados dentro do diretório `app/Controllers/Http`, mas não é uma regra rígida, e você pode modificar a localização deles dentro do arquivo `.adonisrc.json`.

```json
{
  "namespaces": {
    "httpControllers": "App/Controllers"
  }
}
```

Agora, o AdonisJS encontrará os controladores dentro do diretório `App/Controllers`. Além disso, o comando `make:controller` os criará dentro do local correto.

::: info NOTA
Seu controlador não precisa estar dentro de apenas um diretório. Você pode movê-los livremente dentro da estrutura do seu aplicativo.
Certifique-se de exigi-los corretamente na sua declaração de rota.
:::

### Namespace de rota

Ao ter diferentes locais para seu controlador, pode ser conveniente definir o namespace de seus controladores usando grupos de rota.

```ts
Route.group(() => {
  Route.get('cart', 'CartController.index')
  Route.put('cart', 'CartController.update')
}).namespace('App/Modules/Checkout')
```

O `CartController` será importado de `App/Modules/Checkout` neste exemplo.

::: info NOTA
O namespace deve ser um caminho absoluto da raiz do seu aplicativo.
:::

## Comando Make controller

Você pode usar o seguinte comando `node ace` para criar um novo controlador.

```sh
node ace make:controller Post

# CREATE: app/Controllers/Http/PostsController.ts
```

Se você notar, no comando acima, mencionamos a palavra `Post` como singular, enquanto o nome do arquivo gerado está no plural e tem um sufixo `Controller`.

O AdonisJS aplica essas transformações para garantir que os nomes dos arquivos sejam consistentes em todo o seu projeto. No entanto, você pode instruir a CLI a não aplicar essas transformações usando o sinalizador `--exact`.

![](/docs/assets/controller-help-exact-flag.webp)

## Referência de rotas do controlador

Como você pode notar, os controladores são referenciados em rotas como uma expressão de string, ou seja, `'Controller.method'`. Optamos por essa abordagem intencionalmente em favor de controladores de carregamento lento e sintaxe menos detalhada.

Vamos ver como o arquivo de rotas pode ficar se decidirmos **NÃO usar** a expressão de string.

```ts
import Route from '@ioc:Adonis/Core/Route'
import PostsController from 'App/Controllers/Http/PostsController'

Route.get('/posts', async (ctx) => {
  return new PostsController().index(ctx)
})
```

No exemplo acima, importamos o `PostsController` dentro do arquivo de rotas. Em seguida, criamos uma instância e executamos o método `index`, passando o objeto `ctx`.

Agora imagine um aplicativo com 40-50 controladores diferentes. Cada controlador tem seu conjunto de importações, todos sendo puxados para baixo dentro de um único arquivo de rotas, tornando o arquivo de rotas um ponto de estrangulamento.

### Carregamento lento

O carregamento lento dos controladores é uma solução perfeita para o problema mencionado acima. Não há necessidade de importar tudo no nível superior; em vez disso, importe os controladores conforme necessário.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('/posts', async (ctx) => {
  const { default: PostsController } = await import(
    'App/Controllers/Http/PostsController'
  )
  return new PostsController().index(ctx)
})
```

Importar manualmente o controlador, instanciar a instância da classe ainda é muito código, considerando que um aplicativo de tamanho decente pode passar de 100 rotas.

### Apostando no futuro do TypeScript

A referência baseada em string fornece o melhor dos dois mundos. Os controladores são carregados lentamente e a sintaxe é concisa.

No entanto, isso tem a desvantagem de não ser seguro para o tipo. O IDE não reclama se o controlador ou o método estiver faltando ou tiver um erro de digitação.

O lado bom é que tornar a expressão de string segura para o tipo não é impossível. O TypeScript já está progredindo nessa direção. Precisamos de duas coisas para atingir a segurança do tipo ao referenciar a expressão de string `'Controller.method'`.

- [Prova de conceito](https://www.typescriptlang.org/play?ts=4.1.3#code/MYewdgzgLgBASiArlApjAvDA3gKBjAcxSgB4AJAQzABMAbFAJxhQA9UaIZoGBLMAgHwAKAA4UoqBmABcXKL34AaGAAsqdRrMo16DAJSyY2jU1btqnAAYASLHwBmjGAEEAvgDpbDpwCFXlmAB+bDx8GFAweRBaXVlLZxERAHoAYXAomMYIJLIJZNs3S0VQ-ABbYhUQalkfUNcYWUQwAGswEAB3MBxXHF6kpKMQADcnYacoFTQAIgYkVCmYIYpeCgAjehh1LhQ0CfEYdrRlo-XdkBgxBggjuQUCGD4oc6fmlEgcCOgYWeQ0TARfu4iFAhAByJKg5SgsggcppSKzTIMdx8aisUF6IA) para o mesmo.

- [Uma questão em aberto](https://github.com/microsoft/TypeScript/issues/31090) e estamos otimistas de que ela chegará ao TypeScript no futuro, pois adere aos objetivos de design do TypeScript.

## Controladores de ação única

O AdonisJS fornece uma maneira de definir um controlador de ação única. É uma maneira eficaz de encapsular a funcionalidade em classes claramente nomeadas. Para fazer isso, você precisa definir um método `handle` dentro do controlador.

```ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterNewsletterSubscriptionController {
  public async handle({}: HttpContextContract) {
    // ...
  }
}
```

Então, você pode referenciar o controlador na rota como uma expressão de string.

```ts
Route.post('/newsletter', 'RegisterNewsletterSubscriptionController')
```

## Operações CRUD

Os princípios de [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) fornecem uma ótima maneira de mapear operações CRUD com métodos HTTP sem tornar as URLs detalhadas.

Por exemplo, a URL `/posts` pode ser usada para **visualizar todas as postagens** e **criar uma nova postagem**, apenas usando o método HTTP correto.

```ts
Route.get('/posts', () => {
  return 'List of posts'
})

// 👇
Route.post('/posts', () => {
  return 'Create a new post'
})
```

Aqui está a lista de todas as rotas para executar operações CRUD.

```ts
Route.get('/posts', () => {
  return 'List all posts'
})

Route.get('/posts/create', () => {
  return 'Display a form to create a post'
})

Route.post('/posts', async () => {
  return 'Handle post creation form request'
})

Route.get('/posts/:id', () => {
  return 'Return a single post'
})

Route.get('/posts/:id/edit', () => {
  return 'Display a form to edit a post'
})

Route.put('/posts/:id', () => {
  return 'Handle post update form submission'
})

Route.delete('/posts/:id', () => {
  return 'Delete post'
})
```

## Rotas e controladores engenhosos

Como as rotas [acima mencionadas](#crud-operations) estão usando uma convenção predefinida. O AdonisJS fornece um atalho para registrar todas as rotas juntas usando o método `Route.resource`.

```ts
Route.resource('posts', 'PostsController')
```

A seguir está a lista de rotas registradas.

![](/docs/assets/routes-list.png)

### Nomeando rotas

Como você pode notar, cada rota registrada pelo recurso recebe um nome. O nome da rota é criado combinando o **nome do recurso** e a **ação** realizada pela rota. Por exemplo:

- `posts.create` significa uma rota para exibir o formulário para criar uma nova postagem
- `posts.store` representa uma rota para criar uma nova postagem e assim por diante.

Usando o método `.as`, você pode alterar o prefixo antes do nome da ação.

```ts
Route.resource('posts', 'PostsController').as('articles')
```

```txt
articles.index
articles.create
articles.store
articles.show
articles.edit
articles.update
articles.destroy
```

### Filtrando rotas

Em muitas situações, você deseja evitar que algumas das rotas úteis sejam registradas. Por exemplo, você decide restringir os usuários do seu blog de **atualizar** ou **excluir** seus comentários e, portanto, as rotas para o mesmo não são necessárias.

```ts
Route
  .resource('comments', 'CommentsController')
  .except(['update', 'destroy']) // 👈
```

O oposto do método `except` é o método `only`. Ele registra apenas as rotas com os nomes de ação fornecidos.

```ts
Route
  .resource('comments', 'CommentsController')
  .only(['index', 'show', 'store']) // 👈
```

### Rotas somente para API

Ao criar um servidor de API, as rotas para exibir os formulários são redundantes, pois você criará esses formulários em seu frontend ou no aplicativo móvel. Você pode remover essas rotas chamando o método `apiOnly`.

```ts
Route.resource('posts', 'PostsController').apiOnly() // 👈
```

### Aplicando middleware

O método `.middleware` também aplica middleware em todos ou em conjuntos selecionados de rotas registradas por um determinado recurso.

```ts
Route.resource('users', 'UsersController').middleware({
  '*': ['auth'],
})
```

Ou aplique middleware somente a ações selecionadas. No exemplo a seguir, a chave do objeto deve ser o nome da ação.

```ts
Route.resource('users', 'UsersController').middleware({
  create: ['auth'],
  store: ['auth'],
  destroy: ['auth'],
})
```

### Renomeando nome do parâmetro de recurso
O parâmetro para visualizar uma única instância de um recurso é nomeado como `id`. No entanto, você pode renomeá-lo para outra coisa usando o método `paramFor`.

```ts {3}
Route
  .resource('users', 'UsersController')
  .paramFor('users', 'user')
```

O exemplo acima gerará as seguintes rotas.

```sh
# Exibindo rotas somente com parâmetros

GET /users/:user
GET /users/:user/edit
PUT,PATCH /users/:user
DELETE /users/:user
```

Você também pode renomear recursos aninhados e superficiais. Por exemplo:

```ts
Route
  .resource('posts.comments', 'CommentsController')
  .paramFor('posts', 'post')
  .paramFor('comments', 'comment')
```

## Recursos aninhados

Você também pode registrar recursos aninhados separando cada recurso com uma `notação de ponto (.)`. Por exemplo:

```ts
Route.resource('posts.comments', 'CommentsController')
```

![](/docs/assets/nested-resource.webp)

Como você pode notar, o id do recurso pai é prefixado com o nome do recurso. ou seja, `post_id`.

## Recursos superficiais

Em recursos aninhados, cada recurso filho é prefixado com o nome do recurso pai e seu id. Por exemplo:

- `/posts/:post_id/comments`: Exibir todos os comentários para o post
- `/posts/:post_id/comments/:id`: Exibir todos os comentários por id.

A existência de `:post_id` na segunda rota é irrelevante, pois você pode procurar o comentário diretamente por seu id.

Para manter a estrutura de URL plana (sempre que possível), você pode usar recursos superficiais.

```ts
Route.shallowResource('posts.comments', 'CommentsController')
```

![](/docs/assets/shallow-resource.webp)

## Reutilizando controladores

Muitos desenvolvedores tendem a cometer o erro de tentar reutilizar controladores importando-os dentro de outros controladores.

Se você quiser reutilizar alguma lógica dentro do seu aplicativo, você deve extrair esse pedaço de código para sua classe ou objeto, geralmente conhecidos como objetos de serviço.

Recomendamos fortemente tratar seus controladores como **saltos de tráfego**, cujo trabalho é **aceitar a solicitação HTTP**, **atribuir trabalho** para as outras partes do aplicativo e **retornar uma resposta**. Toda a lógica reutilizável deve viver fora do controlador.
