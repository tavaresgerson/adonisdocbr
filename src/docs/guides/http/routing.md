# Roteamento

Os usuários do seu site ou aplicativo da web podem visitar diferentes URLs como `/`, `/about` ou `/posts/1`. Para fazer esses URLs funcionarem, você terá que defini-los como rotas.

As rotas são geralmente definidas (mas não limitadas a) dentro do arquivo `start/routes.ts` usando o módulo Route.

Uma rota típica aceita o padrão de rota como o primeiro argumento e o manipulador de rota como o segundo argumento. Por exemplo:

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', () => {
  return 'Hello world'
})
```

O manipulador de rota também pode referenciar um método [controller](./controllers.md).

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('posts', 'PostsController.index')
```

## Arquivo de rotas padrão

Convencionalmente, as rotas são registradas dentro do arquivo `start/routes.ts`, que é então [pré-carregado](../fundamentals/adonisrc-file.md#preloads) pelo AdonisJS ao inicializar o aplicativo. No entanto, esta não é uma restrição rígida, e você pode manter suas rotas em um arquivo separado também.

Vamos explorar algumas maneiras diferentes de estruturar e carregar rotas de outros arquivos.

### Importações dentro do arquivo `routes.ts`

Uma abordagem é definir suas rotas em arquivos diferentes conforme a estrutura do seu aplicativo e então importar todos esses arquivos dentro do arquivo `start/routes.ts`.

```ts
// start/routes.ts

import 'App/Modules/User/routes'
import 'App/Modules/Cart/routes'
import 'App/Modules/Product/routes'
```

### Registrar como um arquivo de pré-carregamento

Outra abordagem é se livrar completamente do arquivo de rotas e usar um caminho de arquivo personalizado para registrar as rotas. Neste cenário, certifique-se de registrar o caminho dentro do arquivo `.adonisrc.json` sob o array `preloads`.

```json
// .adonisrc.json

{
  "preloads": [
    "./start/routes", // [!code --]
    "./start/kernel",
    "add-path-to-your-routes-file" // [!code ++]
  ]
}
```

## Listar rotas

Você pode visualizar as rotas registradas executando o seguinte comando Ace.

```sh
node ace list:routes
```

Por padrão, as rotas são impressas dentro de uma tabela estruturada. No entanto, você também pode acessá-los como uma string JSON definindo o sinalizador `--json`.

```sh
node ace list:routes --json > routes.json
```

## Métodos HTTP

O AdonisJS fornece métodos de atalho para registrar rotas para verbos HTTP comumente usados. Por exemplo:

#### Verbo GET

```ts
Route.get('posts', async () => {})
```

#### Verbo POST

```ts
Route.post('posts', async () => {})
```

#### Verbo PUT

```ts
Route.put('posts/:id', async () => {})
```

#### Verbo PATCH

```ts
Route.patch('posts/:id', async () => {})
```

#### Verbo DELETE

```ts
Route.delete('posts/:id', async () => {})
```

#### Restante dos verbos HTTP

Para o restante dos verbos HTTP, você pode usar o método `Route.route`.

```ts
Route.route('/', ['OPTIONS', 'HEAD'], async () => {})
```

#### Rota para todos os verbos HTTP comuns

O método `Route.any` registra a rota para manipular a solicitação para todos os verbos HTTP a seguir.

- HEAD
- OPTIONS
- GET
- POST
- PUT
- PATCH
- DELETE

```ts
Route.any('csp-report', async () => {})
```

## Parâmetros de rota

Os parâmetros de rota fornecem uma maneira de registrar URLs que podem aceitar valores dinâmicos como parte da URL.

Um parâmetro sempre começa com dois pontos `:` seguido pelo nome do parâmetro. Por exemplo:

```ts
Route.get('/posts/:id', async ({ params }) => {
  return `Viewing post with id ${params.id}`
})
```

### Parâmetros opcionais

Os parâmetros também podem ser marcados como opcionais anexando um ponto de interrogação `?` ao ​​nome. No entanto, certifique-se de que os parâmetros opcionais venham depois dos parâmetros obrigatórios.

```ts
Route.get('/posts/:id?', async ({ params }) => {
  if (params.id) {
    return `Viewing post with id ${params.id}`
  }
  return 'Viewing all posts'
})
```

### Parâmetros curinga

Você também pode definir um parâmetro curinga usando a palavra-chave `*`. Um parâmetro curinga captura todos os segmentos de URI. Por exemplo:

```ts
Route.get('docs/*', ({ params }) => {
  console.log(params['*'])
})
```

| URL                       | Parâmetro curinga          |
|---------------------------|----------------------------|
| `/docs/http/introduction` | `['http', 'introduction']` |
| `/docs/api/sql/orm`       | `['api', 'sql', 'orm']`    |

Você também pode ter parâmetros nomeados junto com o parâmetro curinga. No entanto, certifique-se de que o parâmetro curinga esteja depois do parâmetro nomeado.

```ts
Route.get('docs/:category/*', ({ params }) => {
  console.log(params.category)
  console.log(params['*'])
})
```

## Correspondentes de parâmetros

Correspondentes de parâmetros permitem que você valide os parâmetros em relação a uma determinada expressão regular. Se a verificação falhar, a rota será ignorada.

Considere o exemplo a seguir em que queremos procurar uma postagem por seu `id` e `slug`.

```ts
Route
  .get('/posts/:id', async ({ params }) => {
    return `Viewing post using id ${params.id}`
  })
  .where('id', /^[0-9]+$/)

Route
  .get('/posts/:slug', async ({ params }) => {
    return `Viewing post using slug ${params.slug}`
  })
  .where('slug', /^[a-z0-9_-]+$/)
```

- As solicitações que passam um id numérico para a URL `/posts` serão encaminhadas para a primeira rota. Por exemplo: `/posts/1` ou `/posts/300`
- Enquanto a solicitação que corresponde ao regex slug será encaminhada para a segunda rota. Por exemplo: `/posts/hello_world` ou `/posts/adonis-101`.
- Um 404 é retornado quando não é possível encontrar uma correspondência.

Você também pode definir correspondentes de parâmetros globalmente usando o método `Route.where`. Os correspondentes globais são aplicados a todas as rotas, a menos que sejam substituídos especificamente no nível da rota.

```ts
Route.where('id', /^[0-9]+$/)
```

## Conversão de parâmetros

A parte dos parâmetros da URL é sempre representada como uma string. Por exemplo: na URL `/posts/1`, o valor `1` é uma string e não um número, pois não há uma maneira direta de inferir tipos de dados para os segmentos de URI.

No entanto, você pode converter manualmente os parâmetros para o tipo de dados JavaScript real definindo uma propriedade `cast` com o correspondente de parâmetros.

::: info NOTA
É uma boa prática validar o parâmetro usando a propriedade `match` ao usar a função `cast`.
:::

```ts
Route
  .get('posts/:id', 'PostsController.show')
  .where('id', {
    match: /^[0-9]+$/,
    cast: (id) => Number(id),
  })
```

## Correspondentes embutidos
O módulo de rota é fornecido com os seguintes correspondentes embutidos para tipos de dados comumente usados.

```ts
// Validar id para ser numérico + converter para tipo de dados numérico
Route.where('id', Route.matchers.number())

// Validar id para ser um uuid válido
Route.where('id', Route.matchers.uuid())

// Validar slug para corresponder a um regex slug fornecido: regexr.com/64su0
Route.where('slug', Route.matchers.slug())
```

## Geração de URL

::: info NOTA
As APIs para geração de URL geram uma exceção quando não é possível procurar uma rota.
:::

Em vez de codificar as URLs em todos os lugares do seu aplicativo, você pode aproveitar a API de geração de URL para gerar URLs para rotas pré-registradas. Por exemplo:

```ts
Route.get('/users/:id', 'UsersController.show')

// Argumentos posicionais
const url = Route.makeUrl('/users/:id', [1])

// Chaves de objeto nomeadas
const url = Route.makeUrl('/users/:id', { id: 1 })
```

Você também pode usar o nome `Controller.method` para referenciar a rota.

```ts
const url = Route.makeUrl('UsersController.show', { id: 1 })
```

Ou use o nome exclusivo da rota como referência.

```ts
Route
  .get('/users/:id', 'UsersController.show')
  .as('showUser') // 👈 Route name

// Gerar URL
const url = Route.makeUrl('showUser', { id: 1 })
```

### Acrescentar sequência de consulta

Você pode acrescentar uma sequência de consulta às URLs geradas passando um terceiro argumento para o método `makeUrl`.

```ts
const url = Route.makeUrl('showUser', [1], {
  qs: {
    verified: true,
  },
})
```

### Consulta dentro de um domínio
Como o AdonisJS permite que você registre rotas para diferentes domínios, você pode limitar sua pesquisa `makeUrl` para um domínio específico também.

```ts
Route
  .get('/users/:id', 'UsersController.show')
  .domain(':tenant.adonisjs.com')

// Criar URL
const url = Route.makeUrl('UsersController.show', [1], {
  domain: ':tenant.adonisjs.com',
})
```

### Prefixar um domínio
As URLs geradas são sempre caminhos relativos sem nenhum nome de domínio. No entanto, você pode definir um usando a propriedade `prefixUrl`.

```ts
const url = Route.makeUrl('UsersController.show', [1], {
  prefixUrl: 'https://foo.com',
})
```

### Construtor de URL
O construtor de URL é uma alternativa ao método `makeUrl` e fornece uma API fluente para criar as URLs.

```ts
const url = Route.builder()
  .params({ id: 1 })
  .qs({ verified: true })
  .prefixUrl('https://foo.com')
  .make('UsersController.show')
```

Criar para um domínio

```ts
const url = Route.builderForDomain(':tenant.adonisjs.com')
  .params({ id: 1 })
  .qs({ verified: true })
  .prefixUrl('https://foo.com')
  .makeUrl('UsersController.show')
```

### Geração de URL dentro de visualizações

Você pode usar o auxiliar `route` dentro dos seus arquivos de modelo para gerar as URLs. A `route` tem a mesma API que o método `makeUrl`.

```ts
Route.post('posts', 'PostsController.store').as('posts.create')
```

```edge
<form method="POST" action="{{ route('posts.create') }}">
</form>
```

### Geração de URL durante redirecionamentos

Você também pode gerar uma URL para uma rota pré-registrada ao redirecionar a solicitação. O `redirect().toRoute()` tem a mesma API que o método `makeUrl`.

```ts
Route
  .get('/users/:id', 'UsersController.show')
  .as('users.show')
```

```ts {3}
Route.post('users', async ({ response }) => {
  // Criar usuário
  response.redirect().toRoute('users.show', { id: user.id })
})
```

## Roteamento para SPA

O fluxo pode parecer o seguinte ao servir um SPA da mesma camada de roteamento que seu aplicativo AdonisJS.

- A primeira solicitação atinge o aplicativo AdonisJS.
- Você carrega um layout HTML com seus scripts e estilos de front-end.
- A partir daí, o roteamento e a renderização são manipulados por uma estrutura de front-end.

Com esse fluxo em vigor, você desejaria que o AdonisJS sempre carregasse o mesmo arquivo HTML, independentemente da URL, pois a lógica de roteamento é colocada dentro de um aplicativo front-end.

Você pode obter esse resultado definindo uma rota curinga.

```ts
// start/routes.ts

Route.get('*', async ({ view }) => {
  return view.render('app')
})

// Versão mais curta
Route.on('*').render('app')
```

Todas as outras rotas específicas do AdonisJS (talvez sua API) devem ser definidas acima da rota curinga.

```ts
Route.get('/api/users', 'UsersController.index')
Route.get('/api/posts', 'PostsController.index')

// Rota SPA
Route.on('*').render('app')
```

Ou melhor agrupar as rotas da API com o prefixo `/api`.

```ts
Route.group(() => {
  Route.get('/users', 'UsersController.index')
  Route.get('/posts', 'PostsController.index')
}).prefix('/api')

// Rota SPA
Route.on('*').render('app')
```

## Grupos de rotas
O AdonisJS fornece uma ótima maneira de agrupar várias rotas de natureza semelhante e configurá-las em massa em vez de redefinir as mesmas propriedades em cada rota.

Um grupo é criado passando um fechamento para o método `Route.group`. As rotas declaradas dentro do fechamento são parte do grupo circundante.

```ts
Route.group(() => {
  // Todas as rotas aqui fazem parte do grupo
})
```

Você também pode criar grupos aninhados, e o AdonisJS mesclará ou substituirá as propriedades com base no comportamento da configuração aplicada.

### Prefixar rotas

Todas as seguintes rotas dentro do fechamento do grupo serão prefixadas com a string `/api`.

```ts
Route
  .group(() => {
    Route.get('/users', 'UsersController.index')
    Route.get('/posts', 'PostsController.index')
  })
  .prefix('/api')
```

No caso de grupos aninhados, o prefixo será aplicado do grupo externo para o interno.

```ts
Route.group(() => {
  Route.group(() => {
    Route.get('/users', 'UsersController.index') // /api/v1/users
    Route.get('/posts', 'PostsController.index') // /api/v1/posts
  }).prefix('/v1')
}).prefix('/api')
```

### Aplicar middleware

Você pode aplicar middleware a um grupo de rotas usando o método `.middleware`. O middleware do grupo é executado antes do middleware da rota.

```ts
Route.group(() => {
  Route.get('users', async () => {
    return 'handled'
  }).middleware('can:view_users')
}).middleware('auth')
```

### Nomeando rotas

Nomear um grupo prefixará todas as suas rotas com o nome fornecido. Por exemplo:

```ts
// Nomeado como users.index, users.store e assim por diante
Route.resource('users', 'UserController')

Route
  .group(() => {
    // Nomeado como api.users.index, api.users.store
    Route.resource('users', 'UserController')
  })
  .prefix('v1')
  .as('api')
```

## Domínios de rota
Usando o módulo de rota, você também pode definir rotas para um domínio específico ou um subdomínio. No exemplo a seguir, as rotas só corresponderão se o [nome do host da solicitação](./request.md#hostname) atual for `blog.adonisjs.com`.

::: info NOTA
Você ainda precisa configurar seu servidor proxy para lidar com solicitações para os subdomínios registrados e encaminhá-los para seu servidor AdonisJS.
:::

```ts
Route
  .group(() => {
    Route.get('/', 'PostsController.index')
    Route.get('/:id', 'PostsController.show')
  })
  .domain('blog.adonisjs.com')
```

Os domínios também podem aceitar parâmetros dinâmicos. Por exemplo, um domínio que aceita o subdomínio do locatário.

```ts {4,7}
Route
  .group(() => {
    Route.get('/', ({ subdomains }) => {
      console.log(subdomains.tenant)
    })
  })
  .domain(':tenant.adonisjs.com')
```

## Rotas rápidas

As rotas rápidas são definidas sem nenhum manipulador de rota explícito. Você pode pensar nelas como um atalho para certos comportamentos.

### `render`

No exemplo a seguir, renderizamos a visualização `welcome` encadeando o método `.render`.

```ts
Route.on('/').render('welcome')
```

O `.render` aceita os dados do modelo como o segundo argumento.

```ts
Route.on('/').render('welcome', { greeting: 'Hello world' })
```

### `redirect`

O método `.redirect` redireciona a solicitação para a rota predefinida. Ele usará os **parâmetros de rota** da solicitação real para criar a URL da rota de redirecionamento.

```ts
Route.on('/posts/:id').redirect('/articles/:id')

// Parâmetros em linha
Route.on('/posts/:id').redirect('/articles/:id', { id: 1 })

// Status personalizado
Route.on('/posts/:id').redirect('/articles/:id', undefined, 301)
```

### `redirectToPath`

Para redirecionar para uma URL absoluta, você pode usar o método `redirectToPath`.

```ts
Route.on('/posts/:id').redirectToPath('https://medium.com/my-blog')

// Status personalizado
Route.on('/posts/:id').redirectToPath('https://medium.com/my-blog', 301)
```

## Acessar rotas registradas

Você pode acessar as rotas registradas chamando o método `Route.toJSON`. No entanto, chamar esse método dentro do **arquivo de rotas** retorna uma matriz vazia porque as rotas são compiladas logo antes de iniciar o servidor HTTP.

Você pode executar o método `Route.toJSON()` dentro de um **middleware**, **controlador** ou o método `start` do **provedor de serviços**. A regra geral é evitar acessar rotas antes que o servidor HTTP esteja pronto.

```ts
// providers/AppProvider.ts

import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public async ready() {
    const Route = this.app.container.use('Adonis/Core/Route')
    console.log(Route.toJSON())
  }
}
```

![](/docs/assets/routes-to-json.png)

## Estendendo o roteador

O roteador é uma combinação de [várias classes](https://github.com/adonisjs/http-server/tree/develop/src/Router) pode adicionar propriedades/métodos personalizados a todas as classes usando as **macros** ou **getters**.

O melhor lugar para estender o roteador é dentro do método `boot` de um provedor de serviços personalizado. Abra o arquivo `providers/AppProvider.ts` e escreva o seguinte código dentro dele.

```ts {8-23}
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Route = this.app.container.use('Adonis/Core/Route')

    Route.Route.macro('mustBeSigned', function () {
      this.middleware(async (ctx, next) => {
        if (!ctx.request.hasValidSignature()) {
          ctx.response.badRequest('Invalid signature')
          return
        }

        await next()
      })

      return this
    })
  }
}
```

No exemplo acima, adicionamos o método `mustBeSigned` à classe Route, que registra internamente um middleware para verificar a [assinatura da solicitação](./../security/signed-urls.md).

Agora, abra o arquivo `start/routes.ts` para usar este método.

```ts
// start/routes.ts

Route
  .get('email/verify', 'OnboardingController.verifyEmail')
  .mustBeSigned()
```

### Informando o TypeScript sobre o método

A propriedade `mustBeSigned` é adicionada no tempo de execução e, portanto, o TypeScript não sabe sobre ela. Para informar o TypeScript, usaremos [mesclagem de declaração](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) e adicionaremos a propriedade à interface `RouteContract`.

Crie um novo arquivo no caminho `contracts/route.ts` (o nome do arquivo não é importante) e cole o seguinte conteúdo dentro dele.

```ts
// contracts/route.ts

declare module '@ioc:Adonis/Core/Route' {
  interface RouteContract {
    mustBeSigned(): this
  }
}
```

### Estendendo o recurso de rota

Você pode estender a classe `RouteResource` da seguinte forma:

```ts
// Adicionar macro

Route.RouteResource.macro('yourMacroName', fn)
```

```ts
// Estender interface

declare module '@ioc:Adonis/Core/Route' {
  interface RouteResourceContract {
    yourMacroName(): this
  }
}
```

```ts
// Usar macro

Route.resource().yourMacroName()
```

### Estendendo o grupo de rotas

Você pode estender a classe `RouteGroup` da seguinte forma:

```ts
// Adicionar macro

Route.RouteGroup.macro('yourMacroName', fn)
```

```ts
// Estender interface

declare module '@ioc:Adonis/Core/Route' {
  interface RouteGroupContract {
    yourMacroName(): this
  }
}
```

```ts
// Usar macro

Route.group().yourMacroName()
```

### Estendendo a rota rápida

Você pode estender a classe `BriskRoute` da seguinte forma:

```ts
// Adicionar macro

Route.BriskRoute.macro('yourMacroName', fn)
```

```ts
// Estender interface

declare module '@ioc:Adonis/Core/Route' {
  interface BriskRouteContract {
    yourMacroName(): this
  }
}
```

```ts
// Usar macro

Route.on('/').yourMacroName()
```

## Adicional leitura

A seguir estão alguns guias adicionais para aprender mais sobre os tópicos não abordados neste documento.

[Rotas engenhosas](./controllers.md#resourceful-routes-and-controllers)
[Middleware de rota](./middleware.md)
[Rotas assinadas](./../security/signed-urls.md)
[Vinculação de modelo de rota](./../digging-deeper/route-model-binding.md)
