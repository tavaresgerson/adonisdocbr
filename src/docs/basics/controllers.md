---
summary: Aprenda sobre controladores HTTP no AdonisJS e como organizar manipuladores de rota dentro de arquivos dedicados.
---

# Controladores

Os controladores HTTP oferecem uma camada de abstração para organizar os manipuladores de rota dentro de arquivos dedicados. Em vez de expressar toda a lógica de manipulação de solicitação dentro do arquivo de rotas, você a move para classes de controlador.

Os controladores são armazenados dentro do diretório `./app/controllers`, representando cada controlador como uma classe JavaScript simples. Você pode criar um novo controlador executando o seguinte comando.

Veja também: [Comando Make controller](../references/commands.md#makecontroller)

```sh
node ace make:controller users
```

Um controlador recém-criado é estruturado com a declaração `class`, e você pode criar métodos manualmente dentro dele. Para este exemplo, vamos criar um método `index` e retornar uma matriz de usuários.

```ts
// app/controllers/users_controller.ts

export default class UsersController {
  index() {
    return [
      {
        id: 1,
        username: 'virk',
      },
      {
        id: 2,
        username: 'romain',
      },
    ]
  }
}
```

Finalmente, vamos vincular este controlador a uma rota. Importaremos o controlador usando o alias `#controllers`. Os aliases são definidos usando o [recurso de importação de subcaminho do Node.js](../getting_started/folder_structure.md#the-sub-path-imports).

```ts
// start/routes.ts

import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')

router.get('users', [UsersController, 'index'])
```

Como você deve ter notado, não criamos uma instância da classe do controlador e, em vez disso, a passamos diretamente para a rota. Isso permite que o AdonisJS:

- Crie uma nova instância do controlador para cada solicitação.
- [Contêiner IoC](../concepts/dependency_injection.md), que permite que você aproveite a injeção automática de dependência.

Você também pode notar que estamos carregando o controlador lentamente usando uma função.

::: warning ATENÇÃO
Controladores de carregamento lento são necessários quando você está usando [HMR](../concepts/hmr.md).
:::

À medida que sua base de código cresce, você notará que isso começa a impactar o tempo de inicialização do seu aplicativo. Um motivo comum para isso é importar todos os controladores dentro do arquivo de rotas.

Como os controladores lidam com solicitações HTTP, eles geralmente importam outros módulos, como modelos, validadores ou pacotes de terceiros. Como resultado, seu arquivo de rotas se torna esse ponto central de importação de toda a base de código.

O carregamento lento é tão simples quanto mover a instrução de importação para trás de uma função e usar importações dinâmicas.

::: tip DICA
Você pode usar nosso [plugin ESLint](https://github.com/adonisjs/tooling-config/tree/main/packages/eslint-plugin) para impor e converter automaticamente importações de controladores padrão em importações dinâmicas lentas.
:::

### Usando strings mágicas

Outra maneira de carregar os controladores de forma preguiçosa é referenciar o controlador e seu método como uma string. Chamamos isso de string mágica porque a string em si não tem significado, e é apenas o roteador que a usa para procurar o controlador e importá-lo nos bastidores.

No exemplo a seguir, não temos nenhuma instrução de importação dentro do arquivo de rotas, e vinculamos o caminho de importação do controlador + método como uma string à rota.

```ts
// start/routes.ts

import router from '@adonisjs/core/services/router'

router.get('users', '#controllers/users_controller.index')
```

A única desvantagem das strings mágicas é que elas não são seguras quanto ao tipo. Se você cometer um erro de digitação no caminho de importação, seu editor não lhe dará nenhum feedback.

Por outro lado, as strings mágicas podem limpar toda a desordem visual dentro do seu arquivo de rotas por causa das instruções de importação.

Usar strings mágicas é subjetivo, e você pode decidir se deseja usá-las pessoalmente ou como uma equipe.

## Controladores de ação única

O AdonisJS fornece uma maneira de definir um controlador de ação única. É uma maneira eficaz de encapsular a funcionalidade em classes claramente nomeadas. Para fazer isso, você precisa definir um método handle dentro do controlador.

```ts
// app/controllers/register_newsletter_subscription_controller.ts

export default class RegisterNewsletterSubscriptionController {
  handle() {
    // ...
  }
}
```

Então, você pode referenciar o controlador na rota com o seguinte.

```ts
// start/routes.ts

router.post('newsletter/subscriptions', [RegisterNewsletterSubscriptionController])
```

## Contexto HTTP

Os métodos do controlador recebem uma instância da classe [HttpContext](../concepts/http_context.md) como o primeiro argumento.

```ts
// app/controllers/users_controller.ts

import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  index(context: HttpContext) {
    // ...
  }
}
```

## Injeção de dependência

As classes do controlador são instanciadas usando o [contêiner IoC](../concepts/dependency_injection.md); portanto, você pode dar dicas de tipo para dependências dentro do construtor do controlador ou de um método do controlador.

Dado que você tem uma classe `UserService`, você pode injetar uma instância dela dentro do controlador da seguinte forma.

```ts
// app/services/user_service.ts

export class UserService {
  all() {
    // retornar usuários do banco de dados
  }
}
```

```ts
// app/controllers/users_controller.ts

import { inject } from '@adonisjs/core'
import UserService from '#services/user_service'

@inject()
export default class UsersController {
  constructor(
    private userService: UserService
  ) {}

  index() {
    return this.userService.all()
  }
}
```

### Injeção de método

Você pode injetar uma instância de `UserService` diretamente dentro do método do controlador usando [injeção de método](../concepts/dependency_injection.md#using-method-injection). Neste caso, você deve aplicar o decorador `@inject` no nome do método.

O primeiro parâmetro passado para o método do controlador é sempre o [`HttpContext`](../concepts/http_context.md). Portanto, você deve dar uma dica de tipo para `UserService` como o segundo parâmetro.

```ts
// app/controllers/users_controller.ts

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

### Árvore de dependências

A resolução automática de dependências não se limita apenas ao controlador. Qualquer classe injetada dentro do controlador também pode dar uma dica de tipo para dependências, e o contêiner IoC construirá a árvore de dependências para você.

Por exemplo, vamos modificar a classe `UserService` para aceitar uma instância do [HttpContext](../concepts/http_context.md) como uma dependência do construtor.

```ts
// app/services/user_service.ts

import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export class UserService {
  constructor(
    private ctx: HttpContext
  ) {}

  all() {
    console.log(this.ctx.auth.user)
    // retornar usuários do banco de dados
  }
}
```

Após essa alteração, o `UserService` receberá automaticamente uma instância da classe `HttpContext`. Além disso, nenhuma alteração é necessária no controlador.

## Controladores orientados a recursos

Para aplicativos convencionais [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer), um controlador deve ser projetado apenas para gerenciar um único recurso. Um recurso geralmente é uma entidade em seu aplicativo, como um **recurso de usuário** ou um **recurso de postagem**.

Vamos pegar o exemplo de um recurso de postagem e definir os pontos de extremidade para lidar com suas operações CRUD. Começaremos criando um controlador primeiro.

Você pode criar um controlador para um recurso usando o comando ace `make:controller`. O sinalizador `--resource` cria o scaffold do controlador com os seguintes métodos.

```sh
node ace make:controller posts --resource
```

```ts
// app/controllers/posts_controller.ts

import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  /**
  * Retorna uma lista de todas as postagens ou paginadas
  * ou não
  */
  async index({}: HttpContext) {}

  /**
  * Renderiza o formulário para criar uma nova postagem.
  *
  * Não é necessário se você estiver criando um servidor de API.
  */
  async create({}: HttpContext) {}

  /**
  * Manipula o envio do formulário para criar uma nova postagem
  */
  async store({ request }: HttpContext) {}

  /**
  * Exibe uma única postagem por id.
  */
  async show({ params }: HttpContext) {}

  /**
  * Renderiza o formulário para editar uma postagem existente por seu id.
  *
  * Não é necessário se você estiver criando um servidor de API.
  */
  async edit({ params }: HttpContext) {}

  /**
  * Lidar com o envio do formulário para atualizar uma postagem específica por id
  */
  async update({ params, request }: HttpContext) {}

  /**
  * Lidar com o envio do formulário para excluir uma postagem específica por id.
  */
  async destroy({ params }: HttpContext) {}
}
```

Em seguida, vamos vincular o `PostsController` a uma rota com recursos usando o método `router.resource`. O método aceita o nome do recurso como o primeiro argumento e a referência do controlador como o segundo argumento.

```ts
// start/routes.ts

import router from '@adonisjs/core/services/router'
const PostsController = () => import('#controllers/posts_controller')

router.resource('posts', PostsController)
```

A seguir está a lista de rotas registradas pelo método `resource`. Você pode visualizar essa lista executando o comando `node ace list:routes`.

![](./post_resource_routes_list.png)

### Recursos aninhados

Recursos aninhados podem ser criados especificando o nome do recurso pai e filho separados usando a notação de ponto `.`.

No exemplo a seguir, criamos rotas para o recurso `comments` aninhado sob o recurso `posts`.

```ts
router.resource('posts.comments', CommentsController)
```

![](./post_comments_resource_routes_list.png)

### Recursos superficiais

Ao usar recursos aninhados, as rotas para o recurso filho são sempre prefixadas com o nome do recurso pai e seu id. Por exemplo:

- A rota `/posts/:post_id/comments` exibe uma lista de todos os comentários para um determinado post.
- E a rota `/posts/:post_id/comments/:id` exibe um único comentário por seu id.

A existência de `/posts/:post_id` na segunda rota é irrelevante, pois você pode procurar o comentário por seu id.

Um recurso superficial registra suas rotas mantendo a estrutura de URL plana (sempre que possível). Desta vez, vamos registrar `posts.comments` como um recurso superficial.

```ts
router.shallowResource('posts.comments', CommentsController)
```

![](./shallow_routes_list.png)

### Nomeando rotas de recursos

As rotas criadas usando o método `router.resource` são nomeadas após o nome do recurso e a ação do controlador. Primeiro, convertemos o nome do recurso para snake case e concatenamos o nome da ação usando o separador de ponto `.`.

| Recurso          | Nome da ação | Nome da rota              |
|------------------|--------------|--------------------------|
| posts            | index        | `posts.index`            |
| userPhotos       | index        | `user_photos.index`      |
| group-attributes | show         | `group_attributes.index` |

Você pode renomear o prefixo para todas as rotas usando o método `resource.as`. No exemplo a seguir, renomeamos o nome da rota `group_attributes.index` para `attributes.index`.

```ts
// start/routes.ts

router.resource('group-attributes', GroupAttributesController).as('attributes')
```

O prefixo dado ao método `resource.as` é transformado para snake\_ case. Se desejar, você pode desativar a transformação, conforme mostrado abaixo.

```ts
// start/routes.ts

router.resource('group-attributes', GroupAttributesController).as('groupAttributes', false)
```

### Registrando rotas somente de API

Ao criar um servidor de API, os formulários para criar e atualizar um recurso são renderizados por um cliente front-end ou um aplicativo móvel. Portanto, criar rotas para esses endpoints é redundante.

Você pode usar o método `resource.apiOnly` para remover as rotas `create` e `edit`. Como resultado, apenas cinco rotas serão criadas.

```ts
// start/routes.ts

router.resource('posts', PostsController).apiOnly()
```

### Registrando apenas rotas específicas

Para registrar apenas rotas específicas, você pode usar os métodos `resource.only` ou `resource.except`.

O método `resource.only` aceita uma matriz de nomes de ação e remove todas as outras rotas, exceto as mencionadas. No exemplo a seguir, apenas as rotas para as ações `index`, `store` e `destroy` serão registradas.

```ts
// start/routes.ts

router
  .resource('posts', PostsController)
  .only(['index', 'store', 'destroy'])
```

O método `resource.except` é o oposto do método `only`, registrando todas as rotas, exceto as mencionadas.

```ts
// start/routes.ts

router
  .resource('posts', PostsController)
  .except(['destroy'])
```

### Renomeando parâmetros de recursos

As rotas geradas pelo método `router.resource` usam `id` para o nome do parâmetro. Por exemplo, `GET /posts/:id` para visualizar uma única postagem e `DELETE /post/:id` para excluir a postagem.

Você pode renomear o parâmetro de `id` para outra coisa usando o método `resource.params`.

```ts
// start/routes.ts

router
  .resource('posts', PostsController)
  .params({ posts: 'post' })
```

A alteração acima gerará as seguintes rotas _(mostrando lista parcial)_.

| Método HTTP | Rota                | Método do controlador |
|-------------|---------------------|-----------------------|
| GET         | `/posts/:post`      | show                  |
| GET         | `/posts/:post/edit` | edit                  |
| PUT         | `/posts/:post`      | update                |
| DELETE      | `/posts/:post`      | destroy               |

Você também pode renomear parâmetros ao usar recursos aninhados.

```ts
// start/routes.ts

router
  .resource('posts.comments', PostsController)
  .params({
    posts: 'post',
    comments: 'comment',
  })
```

### Atribuindo middleware a rotas de recursos
Você pode atribuir middleware a rotas registradas por um recurso usando o método `resource.use`. O método aceita uma matriz de nomes de ação e o middleware para atribuir a eles. Por exemplo:

```ts
// start/routes.ts

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .resource('posts')
  .use(
    ['create', 'store', 'update', 'destroy'],
    middleware.auth()
  )
```

Você pode usar a palavra-chave curinga (*) para atribuir um middleware a todas as rotas.

```ts
// start/routes.ts

router
  .resource('posts')
  .use('*', middleware.auth())
```

Finalmente, você pode chamar o método `.use` várias vezes para atribuir vários middlewares. Por exemplo:

```ts
// start/routes.ts

router
  .resource('posts')
  .use(
    ['create', 'store', 'update', 'destroy'],
    middleware.auth()
  )
  .use(
    ['update', 'destroy'],
    middleware.someMiddleware()
  )
```
