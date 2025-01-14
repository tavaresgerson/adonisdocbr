---
summary: Aprenda a escrever verificações de autorização em seu aplicativo AdonisJS usando o pacote `@adonisjs/bouncer`.
---

# Autorização

Você pode escrever verificações de autorização em seu aplicativo AdonisJS usando o pacote `@adonisjs/bouncer`. O Bouncer fornece uma API JavaScript first para escrever verificações de autorização como **habilidades** e **políticas**.

O objetivo das habilidades e políticas é abstrair a lógica de autorizar uma ação para um único lugar e reutilizá-la no restante da base de código.

- [Habilidades](#defining-abilities) são definidas como funções e podem ser uma ótima opção se seu aplicativo tiver menos verificações de autorização e mais simples.

- [Políticas](#defining-policies) são definidas como classes, e você deve criar uma política para cada recurso em seu aplicativo. As políticas também podem se beneficiar de

::: info NOTA
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
        // ...outros comandos
        () => import('@adonisjs/bouncer/commands')
      ],
      providers: [
        // ...outros provedores
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

::: tip DICA
**Você aprende mais visualmente?** - Confira a série de screencasts gratuitos [AdonisJS Bouncer](https://adocasts.com/series/adonisjs-bouncer) dos nossos amigos da Adocasts.
:::

## O middleware Initialize bouncer
Durante a configuração, criamos e registramos o middleware `#middleware/initialize_bouncer_middleware` dentro do seu aplicativo. O middleware initialize é responsável por criar uma instância da classe [Bouncer](https://github.com/adonisjs/bouncer/blob/main/src/bouncer.ts) para o usuário atualmente autenticado e a compartilha por meio da propriedade `ctx.bouncer` com o restante da solicitação.

Além disso, compartilhamos a mesma instância do Bouncer com os modelos do Edge usando o método `ctx.view.share`. Sinta-se à vontade para remover as seguintes linhas de código do middleware se não estiver usando o Edge dentro do seu aplicativo.

::: info NOTA
Você é o proprietário do código-fonte do seu aplicativo, incluindo os arquivos criados durante a configuração inicial. Portanto, não hesite em alterá-los e fazê-los funcionar com o ambiente do seu aplicativo.
:::

```ts
async handle(ctx: HttpContext, next: NextFn) {
  ctx.bouncer = new Bouncer(
    () => ctx.auth.user || null,
    abilities,
    policies
  ).setContainerResolver(ctx.containerResolver)

  /**                                         // [!code --]
   * Remover se não estiver usando o Edge     // [!code --]
   */                                         // [!code --]
  if ('view' in ctx) {                        // [!code --]
    ctx.view.share(ctx.bouncer.edgeHelpers)   // [!code --]
  }                                           // [!code --]

  return next()
}
```

## Definindo habilidades

Habilidades são funções JavaScript geralmente escritas dentro do arquivo `./app/abilities/main.ts`. Você pode exportar várias habilidades deste arquivo.

No exemplo a seguir, definimos uma habilidade chamada `editPost` usando o método `Bouncer.ability`. O retorno de chamada de implementação deve retornar `true` para autorizar o usuário e retornar `false` para negar acesso.

::: info NOTA
Uma habilidade deve sempre aceitar o `Usuário` como o primeiro parâmetro, seguido por parâmetros adicionais necessários para a verificação de autorização.
:::

```ts
// app/abilities/main.ts

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

```ts {2,16-18}
import Post from '#models/post'
import { editPost } from '#abilities/main'
import router from '@adonisjs/core/services/router'

router.put('posts/:id', async ({ bouncer, params, response }) => {
  /**
   * Encontre uma postagem por ID para que possamos executar uma
   * verificação de autorização para ela.
   */
  const post = await Post.findOrFail(params.id)

  /**
   * Use a capacidade de ver se o usuário logado
   * tem permissão para executar a ação.
   */
  if (await bouncer.allows(editPost, post)) {
    return 'Você pode editar a postagem'
  }

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

```ts {2}
export const viewPost = Bouncer.ability(
  { allowGuest: true },
  (user: User | null, post: Post) => {
    /**
     * Permitir que todos acessem postagens publicadas
     */
    if (post.isPublished) {
      return true
    }

    /**
     * O convidado não pode visualizar postagens não publicadas
     */
    if (!user) {
      return false
    }

    /**
     * O criador da postagem também pode visualizar postagens não publicadas.
     */
    return user.id === post.userId
  }
)
```

### Autorizando usuários diferentes do usuário logado
Se você quiser autorizar um usuário diferente do usuário logado, você pode usar o construtor `Bouncer` para criar uma nova instância do bouncer para um determinado usuário.

```ts {5}
import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

const user = await User.findOrFail(1)
const bouncer = new Bouncer(user)

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
// app/policies/post_policy.ts

import User from '#models/user'
import Post from '#models/post'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PostPolicy extends BasePolicy {
  /**
   * Cada usuário logado pode criar uma postagem
   */
  create(user: User): AuthorizerResponse {
    return true
  }

  /**
   * Somente o criador da postagem pode editar a postagem
   */
  edit(user: User, post: Post): AuthorizerResponse {
    return user.id === post.userId
  }

  /**
   * Somente o criador da postagem pode excluir a postagem
   */
  delete(user: User, post: Post): AuthorizerResponse {
    return user.id === post.userId
  }
}
```

### Executando autorização
Depois de criar uma política, você pode usar o método `bouncer.with` para especificar a política que deseja usar para autorização e, em seguida, encadear os métodos `bouncer.allows` ou `bouncer.denies` para executar a verificação de autorização.

::: info NOTA
Os métodos `allows` e `denies` encadeados após os métodos `bouncer.with` são seguros para o tipo e mostrarão uma lista de conclusões com base nos métodos que você definiu na classe de política.
:::

```ts {7-9,17-19,27-29}
import Post from '#models/post'
import PostPolicy from '#policies/post_policy'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async create({ bouncer, response }: HttpContext) {
    if (await bouncer.with(PostPolicy).denies('create')) {
      return response.forbidden('Cannot create a post')
    }

    // Continue com a lógica do controlador
  }

  async edit({ bouncer, params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    if (await bouncer.with(PostPolicy).denies('edit', post)) {
      return response.forbidden('Cannot edit the post')
    }

    // Continue com a lógica do controlador
  }

  async delete({ bouncer, params, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    if (await bouncer.with(PostPolicy).denies('delete', post)) {
      return response.forbidden('Cannot delete the post')
    }

    // Continue com a lógica do controlador
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
     * Permitir que todos acessem postagens publicadas
     */
    if (post.isPublished) {
      return true
    }

    /**
     * O convidado não pode visualizar postagens não publicadas
     */
    if (!user) {
      return false
    }

    /**
     * O criador da postagem também pode visualizar postagens não publicadas.
     */
    return user.id === post.userId
  }
}
```

### Ganchos de política
Você pode definir os métodos de modelo `before` e `after` em uma classe de política para executar ações em torno de uma verificação de autorização. Um caso de uso comum é sempre permitir ou negar acesso a um determinado usuário.

::: info NOTA
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
     * Sempre permitir um usuário administrador sem realizar nenhuma verificação
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

```ts {4,7}
import { inject } from '@adonisjs/core'
import { PermissionsResolver } from '#services/permissions_resolver'

@inject()
export class PostPolicy extends BasePolicy {
  constructor(
    protected permissionsResolver: PermissionsResolver
  ) {
    super()
  }
}
```

Se uma classe de política for criada durante uma solicitação HTTP, você também pode injetar uma instância de [HttpContext](../concepts/http_context.md) dentro dela.

```ts {1,6}
import { HttpContext } from '@adonisjs/core/http'
import { PermissionsResolver } from '#services/permissions_resolver'

@inject()
export class PostPolicy extends BasePolicy {
  constructor(protected ctx: HttpContext) {
    super()
  }
}
```

## Lançando AuthorizationException
Juntamente com os métodos `allows` e `denies`, você pode usar o método `bouncer.authorize` para executar a verificação de autorização. Este método lançará a [AuthorizationException](https://github.com/adonisjs/bouncer/blob/main/src/errors.ts#L19) quando a verificação falhar.

```ts {3}
router.put('posts/:id', async ({ bouncer, params }) => {
  const post = await Post.findOrFail(post)
  await bouncer.authorize(editPost, post)

  /**
   * Se nenhuma exceção foi levantada, você pode considerar que o usuário
   * tem permissão para editar a postagem.
   */
})
```

O AdonisJS converterá a `AuthorizationException` em uma resposta HTTP `403 - Forbidden` usando as seguintes regras de negociação de conteúdo.

- As solicitações HTTP com o cabeçalho `Accept=application/json` receberão uma matriz de mensagens de erro. Cada elemento da matriz será um objeto com a propriedade `message`.

- [JSON API](https://jsonapi.org/format/#errors) spec.

- [Páginas de status](../basics/exception_handling.md#status-pages) para mostrar uma página de erro personalizada para erros de autorização.

Você também pode automanipular erros `AuthorizationException` dentro do [manipulador de exceção global](../basics/exception_handling.md).

```ts {9-14}
import { errors } from '@adonisjs/bouncer'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction
  protected renderStatusPages = app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof errors.E_AUTHORIZATION_FAILURE) {
      return ctx
        .response
        .status(error.status)
        .send(error.getResponseMessage(ctx))
    }

    return super.handle(error, ctx)
  }
}
```

## Personalizando a resposta de autorização
Em vez de retornar um valor booleano de habilidades e políticas, você pode construir uma resposta de erro usando a classe [AuthorizationResponse](https://github.com/adonisjs/bouncer/blob/main/src/response.ts).

A classe `AuthorizationResponse` fornece controle refinado para definir um código de status HTTP personalizado e a mensagem de erro.

```ts {10}
import User from '#models/user'
import Post from '#models/post'
import { Bouncer, AuthorizationResponse } from '@adonisjs/bouncer'

export const editPost = Bouncer.ability((user: User, post: Post) => {
  if (user.id === post.userId) {
    return true
  }

  return AuthorizationResponse.deny('Post not found', 404)
})
```

Se você estiver usando o pacote [@adonisjs/i18n](../digging_deeper/i18n.md), você pode retornar uma resposta localizada usando o método `.t`. A mensagem de tradução será usada sobre a mensagem padrão durante uma solicitação HTTP com base no idioma do usuário.

```ts {6-8}
export const editPost = Bouncer.ability((user: User, post: Post) => {
  if (user.id === post.userId) {
    return true
  }

  return AuthorizationResponse
    .deny('Post not found', 404) // mensagem padrão
    .t('errors.not_found') // identificador de tradução
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

::: danger **Sem pré-registro. Não, não é super limpo**
```edge
{{-- Primeiro importe a habilidade --}}
@let(editPost = (await import('#abilities/main')).editPost)

@can(editPost, post)
  {{-- Pode editar postagem --}}
@end
```
:::

::: tip **Com pré-registro**
```edge
{{-- Nome da habilidade de referência como uma string --}}
@can('editPost', post)
  {{-- Pode editar a postagem --}}
@end
```
:::

Se você abrir o arquivo `initialize_bouncer_middleware.ts`, você nos verá já importando e pré-registrando habilidades e políticas ao criar a instância do Bouncer.

```ts {1-2,8-9}
import * as abilities from '#abilities/main'
import { policies } from '#policies/main'

export default InitializeBouncerMiddleware {
  async handle(ctx, next) {
    ctx.bouncer = new Bouncer(
      () => ctx.auth.user,
      abilities,
      policies
    )
  }
}
```

### Pontos a serem observados

- Se você decidir definir habilidades em outras partes da sua base de código, certifique-se de importá-las e pré-registrá-las dentro do middleware.

- No caso de políticas, toda vez que você executar o comando `make:policy`, certifique-se de aceitar o prompt para registrar a política dentro da coleção de políticas. A coleção de políticas é definida dentro do arquivo `./app/policies/main.ts`.

```ts
  // app/policies/main.ts

  export const policies = {
    PostPolicy: () => import('#policies/post_policy'),
    CommentPolicy: () => import('#policies/comment_policy')
  }
  ```

### Referenciando habilidades e políticas pré-registradas
No exemplo a seguir, nos livramos das importações e referenciamos habilidades e políticas por seus nomes. Observe que **a API baseada em string também é segura para tipos**, mas o recurso "Ir para definição" do seu editor de código pode não funcionar.

```ts {3}
// Exemplo de uso de habilidade

import { editPost } from '#abilities/main'

router.put('posts/:id', async ({ bouncer, params, response }) => {
  const post = await Post.findOrFail(params.id)

  if (await bouncer.allows(editPost, post)) {     // [!code --]
  if (await bouncer.allows('editPost', post)) {   // [!code ++]
    return 'You can edit the post'
  }
})
```

```ts
// Exemplo de uso de política

import PostPolicy from '#policies/post_policy'                // [!code --]

export default class PostsController {
  async create({ bouncer, response }: HttpContext) {
    if (await bouncer.with(PostPolicy).denies('create')) {    // [!code --]
    if (await bouncer.with('PostPolicy').denies('create')) {  // [!code ++]
      return response.forbidden('Cannot create a post')
    }

    // Continue com a lógica do controlador
  }
}
```

## Verificações de autorização dentro de modelos Edge
Antes de poder executar verificações de autorização dentro de modelos Edge, certifique-se de [pré-registrar habilidades e políticas](#pre-registering-abilities-and-policies). Uma vez feito isso, você pode usar as tags `@can` e `@cannot` para executar as verificações de autorização.

Essas tags aceitam o nome `ability` ou o nome `policy.method` como o primeiro parâmetro, seguido pelo restante dos parâmetros aceitos pela habilidade ou uma política.

```edge
// Uso com habilidade

@can('editPost', post)
  {{-- Pode editar postagem --}}
@end

@cannot('editPost', post)
  {{-- Não pode editar postagem --}}
@end
```

```edge
// Uso com política

@can('PostPolicy.edit', post)
  {{-- Pode editar postagem --}}
@end

@cannot('PostPolicy.edit', post)
  {{-- Não pode editar postagem --}}
@end
```

## Eventos
Consulte o [guia de referência de eventos](../references/events.md#authorizationfinished) para visualizar a lista de eventos despachados pelo pacote `@adonisjs/bouncer`.
