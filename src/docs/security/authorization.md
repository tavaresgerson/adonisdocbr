---
resumo: Aprenda a escrever verificações de autorização em seu aplicativo AdonisJS usando o pacote `@adonisjs/bouncer`.
---

# Autorização

Você pode escrever verificações de autorização em seu aplicativo AdonisJS usando o pacote `@adonisjs/bouncer`. O Bouncer fornece uma API JavaScript first para escrever verificações de autorização como **habilidades** e **políticas**.

O objetivo das habilidades e políticas é abstrair a lógica de autorizar uma ação para um único lugar e reutilizá-la no restante da base de código.

[Habilidades](#defining-abilities) são definidas como funções e podem ser uma ótima opção se seu aplicativo tiver menos verificações de autorização e mais simples.

[Políticas](#defining-policies) são definidas como classes, e você deve criar uma política para cada recurso em seu aplicativo. As políticas também podem se beneficiar de

:::note
O Bouncer não é uma implementação de RBAC ou ACL. Em vez disso, ele fornece uma API de baixo nível com controle refinado para autorizar ações em seus aplicativos AdonisJS.
:::

## Instalação

Instale e configure o pacote usando o seguinte comando:

```sh
node ace add @adonisjs/bouncer
```

::: details Veja os passos realizados pelo comando add

1. Instala o pacote `@adonisjs/bouncer` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviço e comando dentro do arquivo `adonisrc.ts`.

```ts
    {
      commands: [
        // ...other commands
        () => import('@adonisjs/bouncer/commands')
      ],
      providers: [
        // ...other providers
        () => import('@adonisjs/bouncer/bouncer_provider')
      ]
    }
    ```

3. Cria o arquivo `app/abilities/main.ts` para definir e exportar habilidades.

4. Cria o arquivo `app/policies/main.ts` para exportar todas as políticas como uma coleção.

5. Cria `initialize_bouncer_middleware` dentro do diretório `middleware`.

6. Registre o seguinte middleware dentro do arquivo `start/kernel.ts`.

```ts
    router.use([
      () => import('#middleware/initialize_bouncer_middleware')
    ])
    ```

:::

:::tip
**Você aprende mais visualmente?** - Confira a série de screencasts gratuitos [AdonisJS Bouncer](https://adocasts.com/series/adonisjs-bouncer) dos nossos amigos da Adocasts.
:::

## O middleware Initialize bouncer
Durante a configuração, criamos e registramos o middleware `#middleware/initialize_bouncer_middleware` dentro do seu aplicativo. O middleware initialize é responsável por criar uma instância da classe [Bouncer](https://github.com/adonisjs/bouncer/blob/main/src/bouncer.ts) para o usuário atualmente autenticado e a compartilha por meio da propriedade `ctx.bouncer` com o restante da solicitação.

Além disso, compartilhamos a mesma instância do Bouncer com os modelos do Edge usando o método `ctx.view.share`. Sinta-se à vontade para remover as seguintes linhas de código do middleware se não estiver usando o Edge dentro do seu aplicativo.

:::note
Você é o proprietário do código-fonte do seu aplicativo, incluindo os arquivos criados durante a configuração inicial. Portanto, não hesite em alterá-los e fazê-los funcionar com o ambiente do seu aplicativo.
:::

```ts
async handle(ctx: HttpContext, next: NextFn) {
  ctx.bouncer = new Bouncer(
    () => ctx.auth.user || null,
    abilities,
    policies
  ).setContainerResolver(ctx.containerResolver)

  // delete-start
  /**
   * Remove if not using Edge
   */
  if ('view' in ctx) {
    ctx.view.share(ctx.bouncer.edgeHelpers)
  }
  // delete-end

  return next()
}
```

## Definindo habilidades

Habilidades são funções JavaScript geralmente escritas dentro do arquivo `./app/abilities/main.ts`. Você pode exportar várias habilidades deste arquivo.

No exemplo a seguir, definimos uma habilidade chamada `editPost` usando o método `Bouncer.ability`. O retorno de chamada de implementação deve retornar `true` para autorizar o usuário e retornar `false` para negar acesso.

:::note
Uma habilidade deve sempre aceitar o `Usuário` como o primeiro parâmetro, seguido por parâmetros adicionais necessários para a verificação de autorização.
:::

```ts
// title: app/abilities/main.ts
import User from '#models/user'
import Post from '#models/post'
import { Bouncer } from '@adonisjs/bouncer'

export const editPost = Bouncer.ability((user: User, post: Post) => {
  return user.id === post.userId
})
```

### Executando autorização
Depois de definir uma habilidade, você pode executar uma verificação de autorização usando o método `ctx.bouncer.allows`.

O Bouncer passará automaticamente o usuário atualmente logado para o callback de habilidade como o primeiro parâmetro, e você deve fornecer o restante dos parâmetros manualmente.

```ts
import Post from '#models/post'
// highlight-start
import { editPost } from '#abilities/main'
// highlight-end
import router from '@adonisjs/core/services/router'

router.put('posts/:id', async ({ bouncer, params, response }) => {
  /**
   * Find a post by ID so that we can perform an
   * authorization check for it.
   */
  const post = await Post.findOrFail(params.id)

  /**
   * Use the ability to see if the logged-in user
   * is allowed to perform the action.
   */
  // highlight-start
  if (await bouncer.allows(editPost, post)) {
    return 'You can edit the post'
  }
  // highlight-end

  return response.forbidden('You cannot edit the post')
})
```

O oposto do método `bouncer.allows` é o método `bouncer.denies`. Você pode preferir este método em vez de escrever uma declaração `if not`.

```ts
if (await bouncer.denies(editPost, post)) {
  response.abort('Your cannot edit the post', 403)
}
```

### Permitindo usuários convidados
Por padrão, o Bouncer nega verificações de autorização para usuários não logados sem invocar o callback de habilidade.

No entanto, você pode querer definir certas habilidades que podem funcionar com um usuário convidado. Por exemplo, permitir que convidados visualizem postagens publicadas, mas permitir que o criador da postagem visualize rascunhos também.

Você pode definir uma habilidade que permita usuários convidados usando a opção `allowGuest`. Neste caso, as opções serão definidas como o primeiro parâmetro, e o callback será o segundo parâmetro.

```ts
export const viewPost = Bouncer.ability(
  // highlight-start
  { allowGuest: true },
  // highlight-end
  (user: User | null, post: Post) => {
    /**
     * Allow everyone to access published posts
     */
    if (post.isPublished) {
      return true
    }

    /**
     * Guest cannot view non-published posts
     */
    if (!user) {
      return false
    }

    /**
     * The creator of the post can view non-published posts
     * as well.
     */
    return user.id === post.userId
  }
)
```

### Autorizando usuários diferentes do usuário logado
Se você quiser autorizar um usuário diferente do usuário logado, você pode usar o construtor `Bouncer` para criar uma nova instância do bouncer para um determinado usuário.

```ts
import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

const user = await User.findOrFail(1)
// highlight-start
const bouncer = new Bouncer(user)
// highlight-end

if (await bouncer.allows(editPost, post)) {
}
```

## Definindo políticas
As políticas oferecem uma camada de abstração para organizar as verificações de autorização como classes. É recomendado criar uma política por recurso. Por exemplo, se seu aplicativo tiver um modelo Post, você deve criar uma classe `PostPolicy` para autorizar ações como criar ou atualizar postagens.

As políticas são armazenadas dentro do diretório `./app/policies`, e cada arquivo representa uma única política. Você pode criar uma nova política executando o seguinte comando.

Veja também: [Comando Make policy](../references/commands.md#makepolicy)

```sh
node ace make:policy post
```

A classe policy estende a classe [BasePolicy](https://github.com/adonisjs/bouncer/blob/main/src/base_policy.ts) e você pode implementar métodos para as verificações de autorização que deseja executar. No exemplo a seguir, definimos verificações de autorização para `criar`, `editar` e `excluir` uma postagem.

```ts
// title: app/policies/post_policy.ts
import User from '#models/user'
import Post from '#models/post'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PostPolicy extends BasePolicy {
  /**
   * Every logged-in user can create a post
   */
  create(user: User): AuthorizerResponse {
    return true
  }

  /**
   * Only the post creator can edit the post
   */
  edit(user: User, post: Post): AuthorizerResponse {
    return user.id === post.userId
  }

  /**
   * Only the post creator can delete the post
   */
  delete(user: User, post: Post): AuthorizerResponse {
    return user.id === post.userId
  }
}
```

### Executando autorização
Depois de criar uma política, você pode usar o método `bouncer.with` para especificar a política que deseja usar para autorização e, em seguida, encadear os métodos `bouncer.allows` ou `bouncer.denies` para executar a verificação de autorização.

:::note

Os métodos `allows` e `denies` encadeados após os métodos `bouncer.with` são seguros para o tipo e mostrarão uma lista de conclusões com base nos métodos que você definiu na classe de política.

:::

```ts
import Post from '#models/post'
import PostPolicy from '#policies/post_policy'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async create({ bouncer, response }: HttpContext) {
    // highlight-start
    if (await bouncer.with(PostPolicy).denies('create')) {
      return response.forbidden('Cannot create a post')
    }
    // highlight-end

    //Continue with the controller logic
  }

  async edit({ bouncer, params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    // highlight-start
    if (await bouncer.with(PostPolicy).denies('edit', post)) {
      return response.forbidden('Cannot edit the post')
    }
    // highlight-end

    //Continue with the controller logic
  }

  async delete({ bouncer, params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    // highlight-start
    if (await bouncer.with(PostPolicy).denies('delete', post)) {
      return response.forbidden('Cannot delete the post')
    }
    // highlight-end

    //Continue with the controller logic
  }
}
```

### Permitindo usuários convidados
[Semelhante a capabilities](#allowing-guest-users), as políticas também podem definir verificações de autorização para usuários convidados usando o decorador `@allowGuest`. Por exemplo:

```ts
import User from '#models/user'
import Post from '#models/post'
import { BasePolicy, allowGuest } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PostPolicy extends BasePolicy {
  @allowGuest()
  view(user: User | null, post: Post): AuthorizerResponse {
    /**
     * Allow everyone to access published posts
     */
    if (post.isPublished) {
      return true
    }

    /**
     * Guest cannot view non-published posts
     */
    if (!user) {
      return false
    }

    /**
     * The creator of the post can view non-published posts
     * as well.
     */
    return user.id === post.userId
  }
}
```

### Ganchos de política
Você pode definir os métodos de modelo `before` e `after` em uma classe de política para executar ações em torno de uma verificação de autorização. Um caso de uso comum é sempre permitir ou negar acesso a um determinado usuário.

:::note
Os métodos `before` e `after` são sempre invocados, independentemente de um usuário conectado. Portanto, certifique-se de lidar com o caso em que o valor de `user` será `null`.
:::

A resposta de `before` é interpretada da seguinte forma.

- O valor `true` será considerado autorização bem-sucedida, e o método de ação não será chamado.
- O valor `false` será considerado acesso negado, e o método de ação não será chamado.
- Com um valor de retorno `undefined`, o bouncer executará o método de ação para realizar a verificação de autorização.

```ts
export default class PostPolicy extends BasePolicy {
  async before(user: User | null, action: string, ...params: any[]) {
    /**
     * Always allow an admin user without performing any check
     */
    if (user && user.isAdmin) {
      return true
    }
  }
}
```

O método `after` recebe a resposta bruta do método de ação e pode substituir a resposta anterior retornando um novo valor. A resposta de `after` é interpretada da seguinte forma.

- O valor `true` será considerado autorização bem-sucedida, e a resposta antiga será descartada.
- O valor `false` será considerado acesso negado, e a resposta antiga será descartada.
- Com um valor de retorno `undefined`, o bouncer continuará a usar a resposta antiga.

```ts
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PostPolicy extends BasePolicy {
  async after(
    user: User | null,
    action: string,
    response: AuthorizerResponse,
    ...params: any[]
  ) {
    if (user && user.isAdmin) {
      return true
    }
  }
}
```

### Injeção de dependência
As classes de política são criadas usando o [contêiner IoC](../concepts/dependency_injection.md); portanto, você pode dar uma dica de tipo e injetar dependências dentro do construtor de política usando o decorador `@inject`.

```ts
import { inject } from '@adonisjs/core'
import { PermissionsResolver } from '#services/permissions_resolver'

// highlight-start
@inject()
// highlight-end
export class PostPolicy extends BasePolicy {
  constructor(
    // highlight-start
    protected permissionsResolver: PermissionsResolver
    // highlight-end
  ) {
    super()
  }
}
```

Se uma classe de política for criada durante uma solicitação HTTP, você também pode injetar uma instância de [HttpContext](../concepts/http_context.md) dentro dela.

```ts
// highlight-start
import { HttpContext } from '@adonisjs/core/http'
// highlight-end
import { PermissionsResolver } from '#services/permissions_resolver'

@inject()
export class PostPolicy extends BasePolicy {
  // highlight-start
  constructor(protected ctx: HttpContext) {
  // highlight-end
    super()
  }
}
```

## Lançando AuthorizationException
Juntamente com os métodos `allows` e `denies`, você pode usar o método `bouncer.authorize` para executar a verificação de autorização. Este método lançará a [AuthorizationException](https://github.com/adonisjs/bouncer/blob/main/src/errors.ts#L19) quando a verificação falhar.

```ts
router.put('posts/:id', async ({ bouncer, params }) => {
  const post = await Post.findOrFail(post)
  // highlight-start
  await bouncer.authorize(editPost, post)
  // highlight-end

  /**
   * If no exception was raised, you can consider the user
   * is allowed to edit the post.
   */
})
```

O AdonisJS converterá a `AuthorizationException` em uma resposta HTTP `403 - Forbidden` usando as seguintes regras de negociação de conteúdo.

- As solicitações HTTP com o cabeçalho `Accept=application/json` receberão uma matriz de mensagens de erro. Cada elemento da matriz será um objeto com a propriedade `message`.

[JSON API](https://jsonapi.org/format/#errors) spec.

[páginas de status](../basics/exception_handling.md#status-pages) para mostrar uma página de erro personalizada para erros de autorização.

Você também pode automanipular erros `AuthorizationException` dentro do [manipulador de exceção global](../basics/exception_handling.md).

```ts
import { errors } from '@adonisjs/bouncer'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction
  protected renderStatusPages = app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    // highlight-start
    if (error instanceof errors.E_AUTHORIZATION_FAILURE) {
      return ctx
        .response
        .status(error.status)
        .send(error.getResponseMessage(ctx))
    }
    // highlight-end

    return super.handle(error, ctx)
  }
}
```

## Personalizando a resposta de autorização
Em vez de retornar um valor booleano de habilidades e políticas, você pode construir uma resposta de erro usando a classe [AuthorizationResponse](https://github.com/adonisjs/bouncer/blob/main/src/response.ts).

A classe `AuthorizationResponse` fornece controle refinado para definir um código de status HTTP personalizado e a mensagem de erro.

```ts
import User from '#models/user'
import Post from '#models/post'
import { Bouncer, AuthorizationResponse } from '@adonisjs/bouncer'

export const editPost = Bouncer.ability((user: User, post: Post) => {
  if (user.id === post.userId) {
    return true
  }

  // highlight-start
  return AuthorizationResponse.deny('Post not found', 404)
  // highlight-end
})
```

Se você estiver usando o pacote [@adonisjs/i18n](../digging_deeper/i18n.md), você pode retornar uma resposta localizada usando o método `.t`. A mensagem de tradução será usada sobre a mensagem padrão durante uma solicitação HTTP com base no idioma do usuário.

```ts
export const editPost = Bouncer.ability((user: User, post: Post) => {
  if (user.id === post.userId) {
    return true
  }

  // highlight-start
  return AuthorizationResponse
    .deny('Post not found', 404) // default message
    .t('errors.not_found') // translation identifier
  // highlight-end
})
```

### Usando um construtor de resposta personalizado

A flexibilidade para definir mensagens de erro personalizadas para verificações de autorização individuais é ótima. No entanto, se você sempre quiser retornar a mesma resposta, pode ser complicado repetir o mesmo código todas as vezes.

Portanto, você pode substituir o construtor de resposta padrão para o Bouncer da seguinte forma.

```ts
import { Bouncer, AuthorizationResponse } from '@adonisjs/bouncer'

Bouncer.responseBuilder = (response: boolean | AuthorizationResponse) => {
  if (response instanceof AuthorizationResponse) {
    return response
  }

  if (response === true) {
    return AuthorizationResponse.allow()
  }

  return AuthorizationResponse
    .deny('Resource not found', 404)
    .t('errors.not_found')
}
```

## Pré-registrando habilidades e políticas
Até agora, neste guia, importamos explicitamente uma habilidade ou uma política sempre que queremos usá-la. No entanto, depois de pré-registrá-los, você pode referenciar uma habilidade ou uma política pelo seu nome como uma string.

Pré-registrar habilidades e políticas pode ser menos útil dentro da sua base de código TypeScript do que apenas limpar as importações. No entanto, eles oferecem DX muito melhor dentro dos modelos Edge.

Veja os seguintes exemplos de código de modelos Edge com e sem pré-registro de uma política.

:::caption{for="error"}
**Sem pré-registro. Não, não é super limpo**
:::

```edge
{{-- First import the ability --}}
@let(editPost = (await import('#abilities/main')).editPost)

@can(editPost, post)
  {{-- Can edit post --}}
@end
```

:::caption{for="success"}
**Com pré-registro**
:::

```edge
{{-- Reference ability name as a string --}}
@can('editPost', post)
  {{-- Can edit post --}}
@end
```

Se você abrir o arquivo `initialize_bouncer_middleware.ts`, você nos verá já importando e pré-registrando habilidades e políticas ao criar a instância do Bouncer.

```ts
// highlight-start
import * as abilities from '#abilities/main'
import { policies } from '#policies/main'
// highlight-end

export default InitializeBouncerMiddleware {
  async handle(ctx, next) {
    ctx.bouncer = new Bouncer(
      () => ctx.auth.user,
      // highlight-start
      abilities,
      policies
      // highlight-end
    )
  }
}
```

### Pontos a serem observados

- Se você decidir definir habilidades em outras partes da sua base de código, certifique-se de importá-las e pré-registrá-las dentro do middleware.

- No caso de políticas, toda vez que você executar o comando `make:policy`, certifique-se de aceitar o prompt para registrar a política dentro da coleção de políticas. A coleção de políticas é definida dentro do arquivo `./app/policies/main.ts`.

```ts
  // title: app/policies/main.ts
  export const policies = {
    PostPolicy: () => import('#policies/post_policy'),
    CommentPolicy: () => import('#policies/comment_policy')
  }
  ```

### Referenciando habilidades e políticas pré-registradas
No exemplo a seguir, nos livramos das importações e referenciamos habilidades e políticas por seus nomes. Observe que **a API baseada em string também é segura para tipos**, mas o recurso "Ir para definição" do seu editor de código pode não funcionar.

```ts
// title: Ability usage example
// delete-start
import { editPost } from '#abilities/main'
// delete-end

router.put('posts/:id', async ({ bouncer, params, response }) => {
  const post = await Post.findOrFail(params.id)

  // delete-start
  if (await bouncer.allows(editPost, post)) {
  // delete-end
  // insert-start
  if (await bouncer.allows('editPost', post)) {
  // insert-end
    return 'You can edit the post'
  }
})
```

```ts
// title: Policy usage example
// delete-start
import PostPolicy from '#policies/post_policy'
// delete-end

export default class PostsController {
  async create({ bouncer, response }: HttpContext) {
    // delete-start
    if (await bouncer.with(PostPolicy).denies('create')) {
    // delete-end
    // insert-start
    if (await bouncer.with('PostPolicy').denies('create')) {
    // insert-end
      return response.forbidden('Cannot create a post')
    }

    //Continue with the controller logic
  }
}
```

## Verificações de autorização dentro de modelos Edge
Antes de poder executar verificações de autorização dentro de modelos Edge, certifique-se de [pré-registrar habilidades e políticas](#pre-registering-abilities-and-policies). Uma vez feito isso, você pode usar as tags `@can` e `@cannot` para executar as verificações de autorização.

Essas tags aceitam o nome `ability` ou o nome `policy.method` como o primeiro parâmetro, seguido pelo restante dos parâmetros aceitos pela habilidade ou uma política.

```edge
// title: Usage with ability
@can('editPost', post)
  {{-- Can edit post --}}
@end

@cannot('editPost', post)
  {{-- Cannot edit post --}}
@end
```

```edge
// title: Usage with policy
@can('PostPolicy.edit', post)
  {{-- Can edit post --}}
@end

@cannot('PostPolicy.edit', post)
  {{-- Cannot edit post --}}
@end
```

## Eventos
Consulte o [guia de referência de eventos](../references/events.md#authorizationfinished) para visualizar a lista de eventos despachados pelo pacote `@adonisjs/bouncer`.
