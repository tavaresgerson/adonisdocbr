# Controladores

Os controladores são a maneira de fato de lidar com solicitações HTTP no AdonisJS. Eles permitem que você limpe o arquivo de rotas movendo todos 
os manipuladores de rota embutidos para seus arquivos de controlador dedicados.

No AdonisJS, os controladores são armazenados dentro (mas não limitados a) do diretório `app/Controllers/Http` e cada arquivo representa um único 
controlador. Por exemplo:

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

### Localização dos controladores
Convencionalmente, os controladores são armazenados dentro do diretório `app/Controllers/Http`, mas não é uma regra rígida e você pode 
modificar sua localização dentro do arquivo `.adonisrc.json`.

```json
{
  "namespaces": {
    "httpControllers": "App/Controllers"
  }
}
```

Agora, o AdonisJS encontrará os controladores dentro do diretório `App/Controllers`. Além disso, o comando `make:controller` os criará dentro do local correto.

> Seu controlador não precisa estar em apenas um diretório. Você pode movê-los livremente dentro da estrutura do aplicativo. 
> Certifique-se de exigi-los em sua declaração de rota corretamente.

#### Namespace de rotas
Ao ter localizações diferentes para seu controlador, pode ser conveniente definir o namespace de seus 
controladores por grupos de rota.

```ts
Route.group(() => {
  Route.get('cart', 'CartController.index')
  Route.put('cart', 'CartController.update')
}).namespace('App/Modules/Checkout')
```

Neste exemplo, o `CartController` será importado de `App/Modules/Checkout`.

O namespace deve ser um caminho absoluto da raiz do seu aplicativo.

#### Usando comando para o controlador
Você pode usar o `node ace` para criar um novo controlador. Por exemplo:

```bash
node ace make:controller Post

# CREATE: app/Controllers/Http/PostsController.ts
```

Se você notar, no comando acima, mencionamos a palavra `Post` no singular, enquanto o nome do arquivo gerado está no plural e possui um sufixo `Controller`.

O AdonisJS aplica essas transformações para garantir que os nomes dos arquivos sejam consistentes em todo o projeto. 
No entanto, você pode instruir a CLI a não aplicar essas transformações usando o sinalizador `--exact`.

<p align="center">
  <img src="/assets/controller-help-exact-flag.png" width="600" />
</p>

### Referência de rotas do controlador
Como você pode notar, os controladores são referenciados nas rotas como uma expressão de string, ou seja 
'Controller.method',. Optamos por essa abordagem intencionalmente em favor de controladores de carregamento 
lento e sintaxe menos detalhada.

Vamos ver como o arquivo de rotas pode ficar se decidirmos NÃO usar a expressão de string.

```ts
import Route from '@ioc:Adonis/Core/Route'
import PostsController from 'App/Controllers/Http/PostsController'

Route.get('/posts', async (ctx) => {
  return new PostsController().index(ctx)
})
```

No exemplo acima, importamos o `PostsController` dentro do arquivo de rotas. Crie uma instância dele e execute o método `index`, passando o
objeto `ctx`.

Agora imagine um aplicativo com 40-50 controladores diferentes. Cada controlador tem seu conjunto de importações, todas sendo puxadas para 
baixo em um único arquivo de rotas, tornando o arquivo de rotas um ponto de estrangulamento.

#### Carregamento lento
O carregamento lento dos controladores é uma solução perfeita para o problema mencionado acima. Não há necessidade de importar tudo no 
nível superior; em vez disso, importe os controladores conforme necessário.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('/posts', async (ctx) => {
  const { default: PostsController } = await import(
    'App/Controllers/Http/PostsController'
  )
  return new PostsController().index(ctx)
})
```

Importar manualmente o controlador, instanciar a instância da classe ainda é muito código, considerando que um aplicativo de 
tamanho decente pode passar de 100 rotas.

#### Apostando no futuro do typescript
A referência baseada em string oferece o melhor dos dois mundos. Os controladores têm carregamento lento e a sintaxe é concisa.

No entanto, tem a desvantagem de não ser seguro para tipos. IDE não reclama se o controlador ou o método está faltando ou tem um erro de digitação.

Por outro lado, tornar a expressão de string segura quanto ao tipo não é impossível. O TypeScript já está progredindo nessa direção. 
Precisamos de duas coisas para obter segurança de tipo ao fazer referência a 'Controller.method'como uma expressão de string.

* A capacidade de tokenizar a expressão de string e criar um caminho completo para o controlador e seu método é alcançável com TypeScript 4.1 e 
  posteriores. [Aqui](https://www.typescriptlang.org/play?ts=4.1.3#code/MYewdgzgLgBASiArlApjAvDA3gKBjAcxSgB4AJAQzABMAbFAJxhQA9UaIZoGBLMAgHwAKAA4UoqBmABcXKL34AaGAAsqdRrMo16DAJSyY2jU1btqnAAYASLHwBmjGAEEAvgDpbDpwCFXlmAB+bDx8GFAweRBaXVlLZxERAHoAYXAomMYIJLIJZNs3S0VQ-ABbYhUQalkfUNcYWUQwAGswEAB3MBxXHF6kpKMQADcnYacoFTQAIgYkVCmYIYpeCgAjehh1LhQ0CfEYdrRlo-XdkBgxBggjuQUCGD4oc6fmlEgcCOgYWeQ0TARfu4iFAhAByJKg5SgsggcppSKzTIMdx8aisUF6IA) 
  está uma prova de conceito para o mesmo.

* Em seguida, está a capacidade de ter um tipo de importação com suporte para genéricos. Há um [problema](https://github.com/microsoft/TypeScript/issues/31090) 
  em aberto para ele e estamos otimistas de que ele chegará ao TypeScript no futuro, pois cumpre os objetivos de design do TypeScript.

### Operações CRUD
Os princípios do REST fornecem uma ótima maneira de mapear operações CRUD com métodos HTTP sem tornar a URL detalhada.

Por exemplo, a URL `/posts` pode ser usado para visualizar todas as postagens e também para criar uma nova postagem , apenas 
usando o método HTTP correto.

```ts
Route.get('/posts', () => {
  return 'List of posts'
})

// 👇
Route.post('/posts', () => {
  return 'Create a new post'
})
```

Aqui está a lista de todas as rotas para realizar as operações CRUD.

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

#### Rotas e controladores com recursos
Uma vez que as rotas mencionadas acima estão usando uma convenção predefinida. O AdonisJS fornece um atalho para registrar todas as 
rotas juntas usando o método `Route.resource`.

```ts
Route.resource('posts', 'PostsController')
```

A seguir está a lista de rotas cadastradas.

<p align="center">
  <img src="/assets/routes-list.png" width="600" />
</p>

#### Rotas nomeadas
Como você pode notar, cada rota registrada pelo recurso recebe um nome. O nome da rota é criado combinando o nome do recurso e a 
ação realizada pela rota. Por exemplo:

* `posts.create` significa uma rota para exibir o formulário para criar uma nova postagem
* `posts.store` representa uma rota para criar uma nova postagem e assim por diante.

Usando o método `.as`, você pode alterar o prefixo antes do nome da ação.

```ts
Route.resource('posts', 'PostsController').as('articles')
```

```
articles.index
articles.create
articles.store
articles.show
articles.edit
articles.update
articles.destroy
```
 
#### Filtragem de Rotas
Em muitas situações, você desejaria evitar que algumas das rotas engenhosas fossem registradas. Por exemplo, você decide impedir 
que os usuários de seu blog atualizem ou excluam seus comentários e, portanto, não são necessárias rotas para os mesmos.

```ts
Route.resource('comments', 'CommentsController').except(['update', 'destroy']) // 👈
```

O oposto do método `except` é o método `only`. Ele apenas registra as rotas com os nomes de ação fornecidos.

```ts
Route.resource('comments', 'CommentsController').only([
  'index',
  'show',
  'store',
]) // 👈
```

#### Apenas rotas de API
Ao criar um servidor API, as rotas para exibir os formulários são redundantes, pois você fará esses formulários dentro do seu 
frontend ou aplicativo móvel. Você pode remover essas rotas chamando o método `apiOnly`.

```ts
Route.resource('posts', 'PostsController').apiOnly() // 👈
```

### Aplicando middlewares
O método `.middleware` também aplica middleware em todos ou em conjuntos selecionados de rotas registradas por um determinado recurso.

```ts
Route.resource('users', 'UsersController').middleware({
  '*': ['auth'],
})
```

Ou aplique o middleware apenas a ações selecionadas. No exemplo a seguir, a chave do objeto deve ser o nome da ação.

```ts
Route.resource('users', 'UsersController').middleware({
  create: ['auth'],
  store: ['auth'],
  destroy: ['auth'],
})
```

#### Recursos aninhados
Você também pode registrar recursos aninhados, separando cada recurso com uma notação de ponto `.`. Por exemplo:

```ts
Route.resource('posts.comments', 'CommentsController')
```

<p align="center">
  <img src="/assets/nested-resource.png" width="600" />
</p>

Como você pode notar, o id do recurso pai é prefixado com o nome do recurso: `post_id`.

### Recursos rasos
No caso de recursos aninhados, cada recurso filho é prefixado com o nome do recurso pai e seu id. Por exemplo:

* `/posts/:post_id/comments`: Ver todos os comentários da postagem
* `/posts/:post_id/comments/:id`: Ver todos os comentários por id.

A existência de `:post_id` na segunda rota é irrelevante, pois você pode pesquisar o comentário diretamente por seu id.

Para manter a estrutura do URL simples (sempre que possível), você pode usar recursos superficiais.

```ts
Route.shallowResource('posts.comments', 'CommentsController')
```

<p align="center">
  <img src="/assets/shallow-resource.png" width="600" />
</p>

### Reutilizando controladores
Muitos desenvolvedores tendem a cometer o erro de tentar reutilizar controladores importando-os dentro de outros controladores.

Se quiser reutilizar alguma lógica em seu aplicativo, você deve extrair esse trecho de código para sua classe ou objeto, geralmente 
conhecido como objetos de serviço.

É altamente recomendável tratar seus controladores como saltos de tráfego, cujo trabalho é aceitar a solicitação HTTP , atribuir trabalho às outras 
partes do aplicativo e retornar uma resposta. Toda a lógica reutilizável deve residir fora do controlador.
