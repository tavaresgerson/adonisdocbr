# Roteamento

As rotas HTTP abrem o gateway para o mundo externo interagir com seu aplicativo usando URLs. O roteador AdonisJs mapeia URLs para ações e as invocará quando o usuário final chamar uma determinada URL.

Todas as rotas são definidas dentro do arquivo `app/Http/routes.js` que no momento da inicialização do servidor HTTP é carregado automaticamente. Vamos começar com um exemplo básico

> NOTA: Todos os exemplos neste documento usam `Closures` como ações de rota, enquanto é recomendado criar *Controllers* e vinculá-los ao lado de suas rotas. Dessa forma, você manterá seu arquivo de rotas limpo e suas ações de rota testáveis.

<iframe width="560" height="315" src="https://www.youtube.com/embed/w7LD7E53w3w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Exemplo básico

```js
// app/Http/routes.js

const Route = use('Route')

Route.get('/', function * (request, response) {
  response.send('This is the home page')
})
```

Acima, definimos uma rota para o *URL raiz(/)* e anexamos um fechamento a ele. Aqui estão algumas coisas a serem observadas sobre o fechamento.

1. O fechamento é um gerador ES2015, o que significa que você pode usar a palavra-chave `yield` para executar operações assíncronas. Confira esta [postagem](https://strongloop.com/strongblog/write-your-own-co-using-es2015-generators/) da Strongloop sobre geradores.
2. O AdonisJs usa os termos `request` e `response` no lugar de `req` e `res`.

#### middleware(...middleware)
Defina o middleware para uma única rota

```js
// app/Http/routes.js

Route.get('/authenticated', function * (request, response) {
  response.send('This route is authenticated')
}).middleware('auth')
```

Ou adicione vários middlewares

```js
// app/Http/routes.js

Route.get('/secured', function * (request, response) {
  response.send('This route is authenticated')
}).middleware(['auth', 'custom'])
```

## Verbos HTTP
Os verbos HTTP, também conhecidos como métodos HTTP, definem o tipo de solicitação. Um exemplo muito clássico de verbos HTTP é usar um formulário em que definimos o `método` como POST, pois queremos enviar os formulários com segurança para o servidor web.

Os verbos HTTP não se limitam apenas a `GET` e `POST`, há um punhado de outros verbos comumente usados, todos suportados pelo AdonisJs.

| Verbo   | Método de rota  |
|---------|-----------------|
| GET     | Route.get       |
| POST    | Route.post      |
| PUT     | Route.put       |
| PATCH   | Route.patch     |
| DELETE  | Route.delete    |

Para diferentes verbos/métodos HTTP, você pode usar o método `route`, que dá a liberdade de definir qualquer verbo HTTP.

#### route(url, verbs, action)

```js
const Route = use('Route')

Route.route('/', 'COPY', function * (request, response) {
})

// MULTIPLE VERBS

Route.route('/', ['COPY', 'MOVE'], function * (request, response) {
})
```

## Rotas para SPAs
O roteamento em aplicativos de página única (SPAs) é controlado pelas estruturas front-end e, frequentemente, você só precisa servir uma única página da web para o navegador para todas as URLs. O AdonisJs tem um método prático para atingir essa funcionalidade.

#### any(url, action)

```js
Route.any('*', function * (request, response) {
  yield response.sendView('home')
})
```

O método `any` vinculará todos os verbos HTTP com a URL definida. Enquanto o curinga `*` garantirá que esta definição de rota manipule todas as URLs.

Finalmente, você pode servir uma `view` HTML com o código de inicialização para seu aplicativo front-end.

## Parâmetros de rota
Os parâmetros de rota são segmentos dinâmicos de uma URL, o que significa que você pode definir URLs e aceitar dados dinâmicos como parte da própria URL. Considere este exemplo:

```js
Route.get('users/:id', function * (request, response) {
  const id = request.param('id')
  response.send(`Profile for user with id ${id}`)
})
```

Na definição de rota acima, `:id` é o segmento dinâmico. URLs como `/user/1` ou `/user/20` serão válidas, e você pode pegar o id definido dentro da ação de rota usando o método `param`.

Você também pode manter os parâmetros de rota opcionais dependendo da natureza do seu aplicativo.

```js
Route.get('make/:drink?', function * (request, response) {
  const drink = request.param('drink', 'coffee')
  response.send(`Order for ${drink} has been placed`)
})
```

`?` torna um parâmetro opcional, o que significa que ambos os URLs `/make` ou `/make/shake` são válidos.

Você também pode querer ter um parâmetro que pode ter todos os caracteres que você quiser (incluindo `/`). Isso geralmente é usado para simular um armazenamento com URL como `/~/media/xyz.pdf`. Se for o caso, você pode usar o parâmetro `*` e obter qualquer string que desejar.

```js
Route.get('/~/*', function * (request, response) {
  const media = request.param(0)
  response.send(`You want to download the ${media} file`)
})
```

### NOTA
Você ainda pode usar o parâmetro de consulta com um parâmetro `*`.

```js
// url: `/~/media/xyz.pdf?download`
Route.get('/~/*', function * (request, response) {
  const media = request.param(0)

  if (request.input('download') !== null) {
    // ...
  }

  response.send(`You want to download the ${media} file`)
})
```

## Negociação de conteúdo por meio de rotas
[Negociação de conteúdo](https://en.wikipedia.org/wiki/Content_negotiation) é uma maneira de encontrar o melhor tipo de saída para uma determinada solicitação. Idealmente, o cabeçalho HTTP *Accept* é usado para negociar o conteúdo, mas alguns aplicativos modernos tornam a saída mais explícita definindo a extensão de saída dentro da URL. Por exemplo:

Uma URL `/users.json` retornará a saída JSON, enquanto `/users.html` renderizará uma visualização.

As rotas do AdonisJs oferecem a opção de definir os formatos ao lado de suas rotas.

#### formats(types, [strict=false])
```js
Route
  .get('users', function * (request, response) {
    const format = request.format() <1>
  })
  .formats(['json', 'html'])
```

1. A URL `/users.json` terá o formato `json` e `/users.html` terá o formato `html`. Também `/users` funcionará e desta vez o formato será *indefinido*, se você quiser restringir esse comportamento, certifique-se de definir a opção `strict` como true ao definir formatos.

## Route Renderer
Todo aplicativo tem um requisito de criar algumas *visualizações HTML idiotas*. A razão pela qual as chamamos de idiotas é porque essas visualizações não exigem nenhum dado dinâmico ou processamento lógico. Por exemplo:

1. Uma página sobre.
2. Página de contato para exibir informações de contato da empresa.

Vamos pegar o exemplo clássico de renderização de uma página sobre.

```js
// Not ideal

Route.get('about', function * (request, response) {
  yield response.sendView('about')
})
```

Acima, registramos uma rota para a URL `/about` e dentro do fechamento, renderizamos uma visualização usando o método `sendView`. Idealmente, não há nada de ruim nisso, mas uma vez que o número de rotas aumenta, você acabará escrevendo essas linhas com bastante frequência.

A camada de roteamento do AdonisJs elimina esse comportamento introduzindo o `render` que é chamado junto com o método `on`.

```js
// Ideal

Route.on('about').render('about')
```

Este é um pequeno recurso, mas ele vai poupar você de digitar mais alguns caracteres e é mais explícito sobre a renderização de uma visualização.

> DICA: *BÔNUS*: Visualizações renderizadas via método `render` têm acesso ao objeto link:/request[request].

## Grupos de Rotas
O agrupamento de rotas é necessário quando você quer que várias rotas compartilhem os mesmos atributos sem defini-los repetidamente. Por exemplo: prefixar todas as rotas com a versão atual da API `(api/v1)`.

#### group(uniqueName, callback)

```js
Route.group('version1', function () {
  Route.get('users', function * (request, response) {
    // ...
  })
}).prefix('api/v1')
```

Todas as rotas dentro do grupo acima recebem o prefixo `/api/v1`, o que significa que `/api/v1/users` invocará a ação de rota definida ao lado da definição de rota acima.

Os grupos de rotas não são limitados apenas à prefixação, mas você também pode definir outras propriedades.

#### middleware(...middleware)
Defina o middleware para todas as rotas dentro do grupo

```js
Route.group('authenticated', function () {
  // ...
}).middleware('auth')
```

#### domain(subdomain)
Defina um subdomínio para um grupo de rotas.

```js
Route.group('my-group', function () {
  Route.get('posts', function * (request, response) {
    // ...
  })
}).domain('blog.mydomain.dev')
```

As rotas definidas em um subdomínio serão invocadas quando a URL pertencer a um subdomínio. Por exemplo: `blog.mydomain.dev/posts` invocará a ação para a rota acima.

#### formats(formats, [strict=false])
Você também pode definir `formats` para um grupo de rotas. Veja [formats](#formatstypes-strictfalse)

## Rotas nomeadas
As rotas são definidas dentro do arquivo `app/Http/routes.js`, mas são usadas em todos os lugares. Por exemplo:

1. Dentro de uma visualização, para criar a barra de navegação.
2. Dentro dos controladores, para redirecionar para uma URL diferente, etc.

À medida que seu aplicativo cresce, novos requisitos levarão à alteração de rotas com bastante frequência. Agora, alterá-las dentro do arquivo de rotas é bem simples, mas encontrar suas referências dentro de todas as visualizações e controladores não é algo que você vai gostar.

É melhor dar nomes exclusivos às suas rotas comumente referenciadas e usar o nome delas como referência em vez da URL.

#### as(name)
```js
Route
  .get('users/:id', 'UserController.show')
  .as('profile')
```

Agora você pode referenciar o nome dentro de suas visualizações usando o auxiliar linkTo.

```twig
{{ linkTo('profile', 'View Profile', { id: 1 }) }}
{{ linkTo('profile', 'View Profile', { id: 1 } , '_blank') }}
```

```html
// output

<a href="/users/1"> View Profile </a>
<a href="/users/1" target="_blank"> View Profile </a>
```

`linkTo` limita você a uma tag de âncora, há um filtro de visualização de propósito geral chamado `route`, que pode ser usado para resolver uma rota nomeada dentro de suas visualizações.

```twig
<form action="{{ 'profile' | route({id: 1}) }}" method="POST"></form>
```

```html
<!-- output -->

<form action="/user/1" method="POST"></form>
```

## Rotas com recursos
A camada de roteamento facilita a definição de rotas convencionais para operações baseadas em CRUD. Vamos revisar rapidamente a sintaxe de definição de recursos e sua saída.

#### resource(name, controller)
```js
const Route = use('Route')
Route.resource('users', 'UserController')
```

```bash
# Output

| Url             | Verb      | Controller Method       | Purpose                                         |
|-----------------|-----------|-------------------------|-------------------------------------------------|
| /users          | GET       | UserController.index    | Show list of all users                          |
| /users/create   | GET       | UserController.create   | Display a form to create a new user.            |
| /users          | POST      | UserController.store    | Save user submitted via form to the database.   |
| /users/:id      | GET       | UserController.show     | Display user details using the id               |
| /users/:id/edit | GET       | UserController.edit     | Display the form to edit the user.              |
| /users/:id      | PUT/PATCH | UserController.update   | Update details for a given user with id.        |
| /users/:id      | DELETE    | UserController.destroy  | Delete a given user with id.                    |
```

Aqui estão algumas coisas para observar.

1. Você sempre precisa registrar um controlador com o recurso de rota.
2. O AdonisJs vinculará automaticamente os métodos para cada rota, e você não poderá personalizá-los. É bom manter os padrões, pois outros que contribuem para o seu código acharão mais fácil segui-los.

### Recursos aninhados
Os recursos também podem ser aninhados usando a ``notação de ponto`.

```js
Route.resource('posts.comments', 'CommentsController')
```

### Filtrando recursos
`resource` criará um total de sete rotas. Dependendo da natureza do seu aplicativo, você pode ou não precisar de todas as rotas registradas. O AdonisJs torna muito mais fácil filtrar as rotas.

#### except(...actions)
`except` removerá rotas para as ações fornecidas.

```js
Route
  .resource('users', 'UserController')
  .except('create', 'edit')
```

#### only(...actions)
`only` é o oposto de xref:_except_actions[except].

```js
Route
  .resource('users', 'UserController')
  .only('index', 'store', 'show', 'update', 'delete')
```

### Estendendo Recursos
Você também pode estender os recursos existentes adicionando rotas personalizadas e ações do controlador a eles. No mundo prático, há um punhado de casos de uso para estender recursos. Por exemplo:

1. `authors` pode ser estendido para ter uma rota para autores *Populares*.
2. `posts` pode ser estendido para ter várias rotas para enviar/buscar comentários. Você também pode extrair e tornar *comments* um recurso diferente, mas às vezes é mais lógico estender o recurso pai.

#### addCollection(route, [verbs=GET], [callback])
O método `addCollection` adicionará uma nova rota ao recurso existente. Por padrão, ele vincula a rota usando o verbo *GET* e o nome da ação do controlador é o mesmo que o nome da rota.

```js
Route
  .resource('authors', 'AuthorsController')
  .addCollection('popular')
```

Saída:

| Url               | Verbo   | Método do Controlador     | Objetivo                  |
|-------------------|---------|---------------------------|---------------------------|
| /authors/popular  | GET     | AuthorsController.popular | Listar autores populares  |

Claro, você pode definir um verbo HTTP diferente e atribuir um método de controlador diferente.

```js
Route
  .resource('authors', 'AuthorsController')
  .addCollection('popular', ['GET', 'HEAD'], (collection) => {
    collection.bindAction('popularAuthors')
  })
```

#### addMember(route, [verbs=GET], [callback])
O método `addMember` tem a mesma assinatura que [addCollection](#addcollectionroute-verbsget-callback), mas em vez disso, ele adiciona o membro para um item específico dentro do recurso.

```js
Route
  .resource('posts', 'PostsController')
  .addMember('comments')
```

Saída:

| Url                 | Verbo | Método do controlador     | Objetivo                        |
|---------------------|-------|---------------------------|---------------------------------|
| /posts/:id/comments | GET   | PostsController.comments  | Listar comentários para uma determinada postagem |

Como você pode notar, a rota `comments` foi adicionada a uma única postagem. Você também pode definir xref:_middleware_middleware[middleware] e xref:_as_name[name] nas rotas estendidas.

```js
Route
  .resource('posts', 'PostsController')
  .addMember('comments', ['GET'], (member) => {
    member.middleware('auth').as('postsMember')
  })
```

> DICA: Middleware também pode ser adicionado ao recurso inteiro. Por exemplo: `Route.resource().middleware()`
