# Roteamento

Os usuários do seu site ou aplicativo da web podem visitar diferentes URLs como `/`, `/about` ou `/posts/1`. Para 
fazer esses URLs funcionarem, você terá que defini-los como rotas.

As rotas são geralmente definidas (mas não limitadas) dentro do arquivo `start/routes.ts` usando o módulo `Route`.

Uma rota típica aceita o padrão de rota como o primeiro argumento e o manipulador de rota como o segundo argumento. Por exemplo:

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', () => {
  return 'Hello world'
})
```

O manipulador de rota também pode se referir a um método de controlador.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('posts', 'PostsController.index')
```

### Arquivo de rotas padrão
Convencionalmente, as rotas são registradas dentro do arquivo `start/routes.ts`, que é então pré-carregado pelo 
AdonisJS ao inicializar o aplicativo. No entanto, essa não é uma restrição rígida e você também pode manter suas 
rotas em um arquivo separado.

Vamos explorar algumas maneiras diferentes de estruturar e carregar rotas de outros arquivos.

#### Importações dentro do arquivo `routes.ts`
Uma abordagem é definir suas rotas em arquivos diferentes de acordo com a estrutura do seu aplicativo e, 
em seguida, importar todos esses arquivos dentro do arquivo `start/routes.ts`.

```ts
/// start/routes.ts

import 'App/Modules/User/routes'
import 'App/Modules/Cart/routes'
import 'App/Modules/Product/routes'
```

#### Registre-se como um arquivo pré-carregado
Outra abordagem é se livrar completamente do arquivo de rotas e usar um caminho de arquivo personalizado para registrar 
as rotas. Nesse cenário, certifique-se de registrar o caminho dentro do arquivo `.adonisrc.json` na matriz `preloads`.

```json
{
  "preloads": [
    "./start/routes",
    "./start/kernel",
    "add-path-to-your-routes-file"
  ]
}
```

#### Listar rotas
Você pode visualizar as rotas registradas executando o seguinte comando ace.

```bash
node ace list:routes
```

Por padrão, as rotas são bem explícitas dentro de uma tabela estruturada. No entanto, você também pode 
acessá-los como string JSON definindo o sinalizador `--json`.

```bash
node ace list:routes --json > routes.json
```

### Métodos HTTP
AdonisJS fornece métodos abreviados para registrar rotas para verbos HTTP comumente usados. Por exemplo:

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

### Outros verbos HTTP
Para o restante dos verbos HTTP, você pode usar o método `Route.route`.

```ts
Route.route('/', ['OPTIONS', 'HEAD'], async () => {})
```

### Rota para todos os verbos HTTP comuns
O método `Route.any` registra a rota para lidar com a solicitação de todos os verbos HTTP a seguir.

+ HEAD
+ OPTIONS
+ GET
+ POST
+ PUT
+ PATCH
+ DELETE
 
```ts
Route.any('csp-report', async () => {})
```

### Parâmetros de rota
Os parâmetros de rota fornecem uma maneira de registrar URLs que podem aceitar valores dinâmicos como parte da URL.

Um parâmetro sempre começa com dois pontos `:` seguidos pelo nome do parâmetro. Por exemplo:

```ts
Route.get('/posts/:id', async ({ params }) => {
  return `Viewing post with id ${params.id}`
})
```

#### Parâmetros opcionais
Os parâmetros também podem ser marcados como opcionais acrescentando um ponto de interrogação `?` ao nome. No entanto, 
certifique-se de que os parâmetros opcionais vêm depois dos parâmetros obrigatórios.

```ts
Route.get('/posts/:id?', async ({ params }) => {
  if (params.id) {
    return `Viewing post with id ${params.id}`
  }
  return 'Viewing all posts'
})
```

#### Parâmetros curinga
Você também pode definir um parâmetro curinga usando a palavra-chave `*`. Um parâmetro curinga captura todos os 
segmentos de URI. Por exemplo:

```ts
Route.get('docs/*', ({ params }) => {
  console.log(params['*'])
})
```

| URL                       | Parâmetro curinga             |
|---------------------------|-------------------------------|
| `/docs/http/introduction` | `['http', 'introduction']`    |
| `/docs/api/sql/orm`       | `['api', 'sql', 'orm']`       |

Você também pode ter parâmetros nomeados junto com o parâmetro curinga. No entanto, certifique-se 
de que o parâmetro curinga está após o parâmetro nomeado.

```ts
Route.get('docs/:category/*', ({ params }) => {
  console.log(params.category)
  console.log(params['*'])
})
```

#### Matchers de Parâmetros
Os matchers de parâmetros permitem que você valide os parâmetros em relação a uma determinada expressão regular. Se a 
verificação falhar, a rota será ignorada.

Considere o exemplo a seguir, no qual queremos pesquisar uma postagem ambos por seu `id` e por `slug`.

```ts
Route
  .get('/posts/:id', async ({ params }) => {
    return `Viewing post using id ${params.id}`
  })
  .where('id', ^/[0-9]+/$)

Route
  .get('/posts/:slug', async ({ params }) => {
    return `Viewing post using slug ${params.id}`
  })
  .where('slug', ^/[a-z0-9_-]+/$)
```

* As solicitações que passam um id numérico para a URL `/posts` serão encaminhadas para a primeira rota. Por exemplo: `/posts/1ou/posts/300`
* Considerando que a solicitação correspondente ao slug regex será encaminhada para a segunda rota. Por exemplo: `/posts/hello_world` ou `/posts/adonis-101`.
* Um 404 é retornado quando não é possível encontrar uma correspondência.

Você também pode definir correspondências de parâmetros globalmente usando o método `Route.where`. Os matchers globais são 
aplicados a todas as rotas, a menos que sejam substituídos especificamente no nível da rota.

```ts
Route.where('id', ^/[0-9]+/$)
```

#### Cast de Parâmetros
Parâmetros que fazem parte do URL são sempre representados como uma string. Por exemplo: no URL `/posts/1`, o 
valor `1` é uma string e não um número, pois não há uma maneira direta de inferir tipos de dados para os segmentos de URI.

No entanto, você pode converter manualmente os parâmetros para seu tipo de dados JavaScript real, definindo uma propriedade `cast`
com o parâmetro correspondente.

```ts
Route
  .get('posts/:id', 'PostsController.show')
  .where('id', {
    matches: ^/[0-9]+/$,
    cast: (id) => Number(id),
  })
```

### Geração de URL

> As APIs para geração de URL criam uma exceção quando não conseguem pesquisar uma rota.

Em vez de codificar as URLs em todos os lugares em seu aplicativo, você pode aproveitar a API de geração de URL para 
gerar URLs para rotas pré-registradas. Por exemplo:

```ts
Route.get('/users/:id', 'UsersController.show')

// Argumento posicional
const url = Route.makeUrl('/users/:id', [1])

// Chaves de objeto nomeadas
const url = Route.makeUrl('/users/:id', { id: 1 })
```

Você também pode usar o `Controller.method` para fazer referência à rota.

```ts
const url = Route.makeUrl('UsersController.show', { id: 1 })
```

Ou use o nome exclusivo da rota como referência.

```ts
Route
  .get('/users/:id', 'UsersController.show')
  .as('showUser') // 👈 Route name

// Geração de URL
const url = Route.makeUrl('showUser', { id: 1 })
```

#### Anexar string de consulta
Você pode anexar uma string de consulta aos URLs gerados passando um terceiro argumento para o método `makeUrl`.

```ts
const url = Route.makeUrl('showUser', [1], {
  qs: {
    verified: true,
  },
})
```

#### Pesquisa dentro de um domínio
Como o AdonisJS permite registrar rotas para diferentes domínios, você também pode limitar sua busca em `makeUrl` por um domínio específico.

```ts
Route
  .get('/users/:id', 'UsersController.show')
  .domain(':tenant.adonisjs.com')

// Cria uma URL
const url = Route.makeUrl('UsersController.show', [1], {
  domain: ':tenant.adonisjs.com',
})
```

#### Prefixar um domínio
Os URLs gerados são sempre caminhos relativos sem nenhum nome de domínio. No entanto, você pode definir um usando a propriedade `prefixUrl`.

```ts
const url = Route.makeUrl('UsersController.show', [1], {
  prefixUrl: 'https://foo.com',
})
```

#### Construtor de URL
O construtor de URL é uma alternativa ao método `makeUrl` e fornece uma API fluente para fazer os URLs.

```ts
const url = Route.builder()
  .params({ id: 1 })
  .qs({ verified: true })
  .prefixUrl('https://foo.com')
  .makeUrl('UsersController.show')
```

Crie um domínio

```ts
const url = Route.builderForDomain(':tenant.adonisjs.com')
  .params({ id: 1 })
  .qs({ verified: true })
  .prefixUrl('https://foo.com')
  .makeUrl('UsersController.show')
```

#### Geração de URL nas visualizações
Você pode usar o auxiliar `route` dentro de seus arquivos de modelo para gerar os URLs. 
O `route` possui a mesma API do método `makeUrl`.

```ts
Route.post('posts', 'PostsController.store').as('posts.create')
```

```edge
<form method="POST" action="{{ route('posts.create') }}">
</form>
```

#### Geração de URL durante redirecionamentos
Você também pode gerar um URL para uma rota pré-registrada ao redirecionar a solicitação. O `redirect().toRoute()` 
possui a mesma API do makeUrlmétodo.

```ts
Route
  .get('/users/:id', 'UsersController.show')
  .as('users.show')
```

```ts
Route.post('users', async ({ response }) => {
  // Cria usuário
  response.redirect().toRoute('users.show', { id: user.id })
})
```

### Roteamento para SPA
O fluxo pode ser o seguinte ao servir um SPA da mesma camada de roteamento que o aplicativo AdonisJS.

* A primeira solicitação atinge o aplicativo AdonisJS.
* Você carrega um layout HTML com seus scripts e estilos de front-end.
* A partir daí, o roteamento e a renderização são tratados por uma estrutura de front-end.
 
Com esse fluxo em vigor, você gostaria que o AdonisJS sempre carregasse o mesmo arquivo HTML, 
independentemente da URL, já que a lógica de roteamento é colocada dentro de um aplicativo front-end.

Você pode obter esse resultado definindo uma rota curinga.

```ts
/// start/routes.ts

Route.get('*', async ({ view }) => {
  return view.render('app')
})

// Versão curta
Route.on('*').render('app')
```

Todas as outras rotas específicas do AdonisJS (talvez sua API) devem ser definidas acima da rota curinga.

```ts
Route.get('/api/users', 'UsersController.index')
Route.get('/api/posts', 'PostsController.index')

// Rota SPA
Route.on('*').render('app')
```

Ou melhor, podemos agrupar as rotas de API com o prefixo `/api`.

```ts
Route.group(() => {
  Route.get('/users', 'UsersController.index')
  Route.get('/posts', 'PostsController.index')
}).prefix('/api')

// Rota SPA
Route.on('*').render('app')
```

### Grupos de rota
O AdonisJS oferece uma ótima maneira de agrupar várias rotas de natureza semelhante e configurá-las em massa, 
em vez de redefinir as mesmas propriedades em todas as rotas.

Um grupo é criado passando uma closure para o método `Route.group`. As rotas declaradas dentro do fechamento fazem 
parte do grupo circundante.

```ts
Route.group(() => {
  // Todas as rotas aqui fazem partem do grupo
})
```

Você também pode criar grupos aninhados, e o AdonisJS mesclará ou substituirá as propriedades com base no 
comportamento da configuração aplicada.

#### Rotas com prefixo
Todas as rotas a seguir dentro da closure do grupo serão prefixadas com a string `/api`.

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
Você pode aplicar middleware a um grupo de rotas usando o método `.middleware`. O middleware do grupo é executado 
antes do middleware da rota.

```ts
Route.group(() => {
  Route.get('users', async () => {
    return 'handled'
  }).middleware('can:view_users')
}).middleware('auth')
```

### Rotas nomeadas
Nomear um grupo irá prefixar todas as suas rotas com o nome fornecido. Por exemplo:

```ts
// Nomeia como users.index, users.store e assim por diante
Route.resource('users', 'UserController')

Route
  .group(() => {
    // Nomeia como api.users.index, api.users.store
    Route.resource('users', 'UserController')
  })
  .prefix('v1')
  .as('api')
```

### Domínios de rota
Usando o módulo de rota, você também pode definir rotas para um domínio ou subdomínio específico. No exemplo a seguir, 
as rotas corresponderão apenas se o nome do host da solicitação atual for `blog.adonisjs.com`.

Você ainda precisa configurar seu servidor proxy para lidar com solicitações para os subdomínios registrados e 
encaminhá-los para seu servidor AdonisJS.

```ts
Route
  .group(() => {
    Route.get('/', 'PostsController.index')
    Route.get('/:id', 'PostsController.show')
  })
  .domain('blog.adonisjs.com')
```

Os domínios também podem aceitar parâmetros dinâmicos. Por exemplo, um domínio que aceita o subdomínio do locatário.

```ts
Route
  .group(() => {
    Route.get('/', ({ subdomains }) => {
      console.log(subdomains.tenant)
    })
  })
  .domain(':tenant.adonisjs.com')
```

### Rotas rápidas
Rotas rápidas são definidas sem qualquer manipulador de rota explícito. Você pode pensar neles como 
um atalho para determinados comportamentos.

#### render
No exemplo a seguir, renderizamos a visualização `welcome` encadeando o método `.render`.

```ts
Route.on('/').render('welcome')
```

O `.render` aceita os dados do modelo como o segundo argumento.

```ts
Route.on('/').render('welcome', { greeting: 'Hello world' })
```

#### redirect
O método `.redirect` redireciona a solicitação para a rota predefinida. Ele usará os parâmetros de rota da solicitação real 
para fazer a URL da rota de redirecionamento.

```ts
Route.on('/posts/:id').redirect('/articles/:id')

// Parâmetros inline
Route.on('/posts/:id').redirect('/articles/:id', { id: 1 })

// Status customizado
Route.on('/posts/:id').redirect('/articles/:id', undefined, 301)
```

#### redirectToUrl
Para redirecionar para um URL absoluto, você pode usar o método `redirectToUrl`.

```ts
Route.on('/posts/:id').redirectToUrl('https://medium.com/my-blog')

// Customização de status
Route.on('/posts/:id').redirectToUrl('https://medium.com/my-blog', 301)
```

### Acessar rotas cadastradas
Você pode acessar as rotas registradas chamando o método `Route.toJSON`. No entanto, chamar esse método dentro do 
arquivo de rotas irá retorna uma matriz vazia porque as rotas são compiladas antes de iniciar o servidor HTTP.

Você pode executar o método `Route.toJSON()` dentro de um middleware , controlador ou método de provedores de serviço `start`. 
A regra é evitar o acesso a rotas antes que o servidor HTTP esteja pronto.

```
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

<p align="center">
  <img src="/assets/routes-to-json.png" width="630" />
</p>

### Estendendo o roteador
O roteador é uma combinação de várias classes que podem adicionar propriedades/métodos personalizados a todas 
as classes usando macros ou getters.

O melhor lugar para estender o Route é dentro do método `boot` de um provedor de serviços personalizado. Abra o arquivo
`providers/AppProvider.ts` e escreva o seguinte código dentro dele.

```ts
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

No exemplo acima, adicionamos o método `mustBeSigned` à classe Route, que registra internamente um middleware para verificar 
a assinatura da solicitação.

Agora, abra o arquivo `start/routes.ts` para usar este método.

```ts
Route
  .get('email/verify', 'OnboardingController.verifyEmail')
  .mustBeSigned()
```

#### Informar ao typescript sobre o método
A propriedade `mustBeSigned` é adicionada no tempo de execução e, portanto, o TypeScript não a conhece. 
Para informar ao TypeScript, usaremos a fusão de declarações e adicionaremos a interface `RouteContract`.

Crie um novo arquivo no caminho `contracts/route.ts` (o nome do arquivo não é importante) e cole o seguinte conteúdo dentro dele.

```
declare module '@ioc:Adonis/Core/Route' {
  interface RouteContract {
    mustBeSigned(): this
  }
}
```

#### Estendendo o recurso de rota
Você pode estender a classe `RouteResource` da seguinte maneira:

```ts
// Adicionando macro
Route.RouteResource.macro('yourMacroName', fn)
```

```ts
// Interface estendida

declare module '@ioc:Adonis/Core/Route' {
  interface RouteResourceContract {
    yourMacroName(): this
  }
}
```
```ts
// Use o macro
Route.resource().yourMacroName()
```

#### Extensão do grupo de rota
Você pode estender a classe `RouteGroup` da seguinte maneira:

```ts
// Adicionar macro
Route.RouteGroup.macro('yourMacroName', fn)
```

```ts
// Interface estendida
declare module '@ioc:Adonis/Core/Route' {
  interface RouteGroupContract {
    yourMacroName(): this
  }
}
```

```ts
// Use o macro
Route.group().yourMacroName()
```
 
### Extendendo a rota brisk
Você pode estender a classe `BriskRoute` da seguinte maneira:

```ts
// Adicionar macro
Route.BriskRoute.macro('yourMacroName', fn)
```

```ts
// Interface estendida
declare module '@ioc:Adonis/Core/Route' {
  interface BriskRouteContract {
    yourMacroName(): this
  }
}
```

```ts
// Use o macro
Route.on('/').yourMacroName()
```

### Leitura adicional
A seguir estão alguns dos guias adicionais para aprender mais sobre os tópicos não cobertos neste documento.

* [Rotas engenhosas](https://docs.adonisjs.com/guides/controllers#resourceful-routes-and-controllers)
* [Middleware de rota](https://docs.adonisjs.com/guides/middleware)
* [Rotas sinalizadas](https://docs.adonisjs.com/guides/security/signed-urls)
