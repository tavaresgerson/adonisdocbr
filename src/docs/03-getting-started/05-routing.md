# Roteamento

Rotas HTTP abrem a porta de entrada para o mundo externo interagir com seu aplicativo usando URLs. O roteador do AdonisJS mapeia os URLs para ações e as invocará sempre que um usuário final chamar uma determinada URL.

Todas as rotas são definidas dentro do arquivo `app/Http/routes.js`, que é automaticamente carregado quando o servidor HTTP é iniciado. Vamos começar com um exemplo básico

NOTE: Todos os exemplos neste documento utilizam `Encerramentos` como ações de rota, embora seja recomendado criar *Controladores* e vinculá-los às suas rotas. Dessa forma você manterá seu arquivo de rotas limpo e suas ações de rota testáveis.

<iframe width="560" height="315" src="https://www.youtube.com/embed/w7LD7E53w3w?si=oZgxH6ME-hMJqPDA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

```js
// .app/Http/routes.js

const Route = use('Route')

Route.get('/', function * (request, response) {
  response.send('This is the home page')
})
```

Acima definimos uma rota para a URL raiz (/) e anexamos um fechamento a ele. Aqui estão algumas coisas para notar sobre o fechamento.

1. O closure é um gerador ES2015, o que significa que você pode usar a palavra-chave yield para realizar operações assíncronas. Veja este [post](https://strongloop.com/strongblog/write-your-own-co-using-es2015-generators/) da Strongloop sobre geradores.
2. O AdonisJs utiliza os termos "request" e "response" em vez de "req" e "res".

#### Middleware (tecnologia de software que atua como uma camada intermediária entre o sistema operacional e as aplicações, fornecendo serviços comuns a estas últimas, como segurança, gerenciamento de sessões, cache, etc.)
Definir middleware para uma única rota

```js
// .app/Http/routes.js

Route.get('/authenticated', function * (request, response) {
  response.send('This route is authenticated')
}).middleware('auth')
```

Ou adicionar múltiplos middleware

```js
// .app/Http/routes.js

Route.get('/secured', function * (request, response) {
  response.send('This route is authenticated')
}).middleware(['auth', 'custom'])
```

## Verbos HTTP
Os verbos HTTP também conhecidos como métodos HTTP definem o tipo de solicitação. Um exemplo clássico dos verbos HTTP é usar um formulário onde definimos o método como POST, pois queremos enviar os formulários com segurança para o servidor da web.

Os verbos HTTP não são limitados apenas aos métodos GET e POST, existem outros métodos comumente usados que também são suportados pelo AdonisJs.


| Verbo | Método de rotação |
|------|--------------|
| GET | Route.get |
| POST | Route.post |
| PUT | Route.put |
| PATCH | Rota.patch |
| Excluir | Route.delete |

Para diferentes verbos/métodos HTTP, você pode usar o método 'route', que dá a liberdade de definir qualquer verbo HTTP.

#### route(url, verbos, ação)

```js
const Route = use('Route')

Route.route('/', 'COPY', function * (request, response) {
})

// MULTIPLE VERBS

Route.route('/', ['COPY', 'MOVE'], function * (request, response) {
})
```

## Rotas para SPA's
A rota em aplicativos de página única (SPAs) é tratada pelos frameworks front-end e muitas vezes você só precisa servir uma única página da web ao navegador para todas as URLs. O AdonisJS tem um método prático para alcançar essa funcionalidade.

#### any(url, ação)

```js
Route.any('*', function * (request, response) {
  yield response.sendView('home')
})
```

qualquer método irá vincular todos os verbos HTTP com a URL definida. Enquanto o caractere curinga "*" garantirá que essa definição de rota manipule todas as URLs.

Finalmente você pode servir uma "visualização" HTML com o código de inicialização para sua aplicação frontend.

## Parâmetros de Rota
Parâmetros de rota são segmentos dinâmicos de uma URL que significam que você pode definir URLs e aceitar dados dinâmicos como parte da própria URL. Considere este exemplo:

```js
Route.get('users/:id', function * (request, response) {
  const id = request.param('id')
  response.send(`Profile for user with id ${id}`)
})
```

No definição de rota acima, ':id' é o segmento dinâmico. URLs como '/user/1', ou '/user/20' serão válidos, e você pode pegar o definido id dentro da ação da rota usando o método 'param'.

Você também pode manter parâmetros de rota opcionais dependendo da natureza do seu aplicativo.

```js
Route.get('make/:drink?', function * (request, response) {
  const drink = request.param('drink', 'coffee')
  response.send(`Order for ${drink} has been placed`)
})
```

`?` torna um parâmetro opcional o que significa que tanto as URLs `/fazer` ou `/fazer/balançar` são válidas.

Você também pode querer ter um parâmetro que possa ter qualquer caractere que você deseja (incluindo `/`). Isso geralmente é usado para simular um armazenamento com URLs como `/~/media/xyz.pdf`. Se for esse o caso, você pode usar o parâmetro `*` e obter qualquer string que desejar.

```js
Route.get('/~/*', function * (request, response) {
  const media = request.param(0)
  response.send(`You want to download the ${media} file`)
})
```

##### NOTE
Você ainda pode usar parâmetro de consulta com um parâmetro `*` .

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

## Negociação de Conteúdo via Rotas
[Negociação de conteúdo](https://pt.wikipedia.org/wiki/Negocia%C3%A7%C3%A3o_de_conte%C3%BAdos) é uma forma de encontrar o melhor tipo de saída para um determinado pedido. Idealmente, a cabeçalho HTTP *Accept* é usada para negociar o conteúdo, mas alguns aplicativos modernos tornam a saída mais explícita ao definir a extensão da saída dentro da URL. Por exemplo:

Uma URL `/users.json` retornará a saída JSON, enquanto `/users.html` renderizará uma visão.

As rotas do AdonisJs te dão a opção de definir os formatos ao lado das suas rotas.

#### formats(tipos, [estrito=falso])
```js
Route
  .get('users', function * (request, response) {
    const format = request.format() <1>
  })
  .formats(['json', 'html'])
```

1. A URL `/users.json` terá o formato de `json` e `/users.html` terá o formato de `html`. Também `/users` funcionará e neste caso o formato será *indefinido*, se quiser restringir esse comportamento certifique-se de definir a opção `strict` como `true` ao definir os formatos.

## Route Renderer
Todo aplicativo tem um requisito de criar alguns *HTMLs bobos*. A razão que chamamos eles bobos, porque essas visualizações não exigem nenhum dado dinâmico ou processamento lógico. Por exemplo:

1. Uma página sobre nós.
2. Página de contato para exibir informações de contato da empresa.

Vamos pegar o exemplo clássico de renderizar uma página "Sobre".

Não é ideal:
```js
Route.get('about', function * (request, response) {
  yield response.sendView('about')
})
```

Acima registramos uma rota para a URL `/about` e dentro do fechamento, renderizamos uma visão usando o método `sendView`. Idealmente, não há nada de errado com isso, mas uma vez que o número de rotas aumenta, você acabará escrevendo esses um-linha bastante frequentemente.

A camada de roteamento do AdonisJs elimina esse comportamento ao introduzir o método render, que é chamado junto com o método on.

Ideal:
```js
Route.on('about').render('about')
```

Esta é uma pequena funcionalidade, mas vai te poupar de digitar alguns caracteres a mais e é mais explícito sobre renderizar uma visão.

> DICA
> *BONUS*: As views renderizadas via o método `render` tem acesso ao objeto [link]/request[requisição].

## Grupos de Rotas
A agrupagem de rotas é necessária quando você deseja um monte de rotas compartilharem os mesmos atributos sem defini-los repetidamente. Por exemplo: prefixando todas as rotas da versão atual da API `(api/v1)`.

#### group(nomeúnico, retorno_de_chamado)

```js
Route.group('version1', function () {
  Route.get('users', function * (request, response) {
    // ...
  })
}).prefix('api/v1')
```

Todas as rotas dentro do grupo acima recebem o prefixo `/api/v1`, ou seja, `/api/v1/usuarios` irá invocar a ação da rota definida logo acima.

Rotas em grupo não são limitadas apenas a prefixos, mas também você pode definir outras propriedades também.

#### Middleware (tecnologia de software que atua como uma camada intermediária entre o sistema operacional e as aplicações, fornecendo serviços comuns a estas últimas, como segurança, gerenciamento de sessões, cache, etc.)
Definir middleware para todas as rotas dentro do grupo

```js
Route.group('authenticated', function () {
  // ...
}).middleware('auth')
```

#### domínio (subdomínio)
Defina um subdomínio para um grupo de rotas.

```js
Route.group('my-group', function () {
  Route.get('posts', function * (request, response) {
    // ...
  })
}).domain('blog.mydomain.dev')
```

Rotas definidas sob um subdomínio serão invocadas quando o URL pertencer a um subdomínio. Por exemplo: `blog.mydomain.dev/posts` irá invocar a ação para a rota acima.

#### formatos(formatos, [estrito=falso])
Você também pode definir `formats` para um grupo de rotas. Veja xref:_formats_types_strict_false[formats]

## Rotas nomeadas
Rotas são definidas dentro do arquivo `app/Http/routes.js`, mas elas são usadas em todos os lugares. Por exemplo:

1. Dentro de uma visão, para criar a barra de navegação.
2. Dentro de Controladores, para redirecionar para uma URL diferente, por exemplo.

À medida que seu aplicativo crescer, novos requisitos levarão a mudanças nas rotas com bastante frequência. Agora, alterá-las dentro do arquivo de rotas é bem simples, mas encontrar suas referências em todos os controladores e visualizações não será algo que você vai gostar.

É melhor dar nomes únicos às suas rotas de referência comum e usar seu nome como referência em vez da URL.

#### as(nome)

```js
Route
  .get('users/:id', 'UserController.show')
  .as('profile')
```


Agora você pode referenciar o nome dentro de suas visualizações usando o helper linkTo.

```twig
{{ linkTo('profile', 'View Profile', { id: 1 }) }}
{{ linkTo('profile', 'View Profile', { id: 1 } , '_blank') }}
```

Saída:
```html
<a href="/users/1"> View Profile </a>
<a href="/users/1" target="_blank"> View Profile </a>
```

linkTo limita-se a uma tag âncora, há um filtro de visualização geral chamado rota, que pode ser usado para resolver uma rota nomeada dentro de suas visualizações.

```twig
<form action="{{ 'profile' | route({id: 1}) }}" method="POST"></form>
```

Saída:
```html
<form action="/user/1" method="POST"></form>
```

## Rotas Produtivas
Camada de roteamento facilita a definição de rotas convencionais para operações baseadas em CRUD. Vamos revisar rapidamente a sintaxe da definição de recursos e sua saída.

#### resource(nome, controlador)

```js
const Route = use('Route')
Route.resource('users', 'UserController')
```

Saída:

| Url | Verbo | Método Controlador | Propósito |
|-----|------|-------------------|---------|
| /usuários | GET | UserController.index | Mostrar lista de todos os usuários |
| /usuarios/criar | GET | UserController.create | Exiba um formulário para criar um novo usuário. |
| /usuários | POST | UserController.store | Salve os dados enviados pelo usuário no formulário para o banco de dados. |
| /usuários/:id | GET | UserController.show | Exibir detalhes do usuário usando o ID |
| /usuarios/:id/editar | GET | UserController.edit | Exibir o formulário para editar o usuário. |
| /usuários/:id | PUT/PATCH | UserController.update | Atualizar detalhes de um usuário específico com base em seu ID. |
| /usuários/:id | Excluir | UserController.destroy | Deletar um usuário com um determinado ID. |

Aqui estão algumas coisas para notar.

1. Você sempre precisa registrar um controlador com o recurso de rota.
2. O AdonisJs irá vincular automaticamente os métodos para cada rota, e você não pode personalizá-los. É bom ficar com os padrões, pois outros que contribuirão para o seu código irão achar mais fácil seguir.

### Recursos aninhados
Recursos também podem ser aninhados usando a notação de ponto.

```js
Route.resource('posts.comments', 'CommentsController')
```

### Filtrando recursos
"recurso" criará um total de sete rotas. Dependendo da natureza do seu aplicativo, você pode ou não precisar de todas as rotas registradas. O AdonisJS torna tão fácil filtrar as rotas.

#### except(ações)
`except` removerá as rotas para as ações dadas.

```js
Route
  .resource('users', 'UserController')
  .except('create', 'edit')
```

#### apenas(ações)
`only` é o oposto de xref:_except_actions[except].

```js
Route
  .resource('users', 'UserController')
  .only('index', 'store', 'show', 'update', 'delete')
```

### Estendendo Recursos
Você também pode estender os recursos existentes adicionando rotas e ações de controlador personalizados a eles. No mundo prático, existem alguns casos de uso para estender recursos. Por exemplo:

1. 'autores' pode ser estendido para ter uma rota para *autores populares*.
2. "posts" podem ser estendidos para ter várias rotas para enviar/buscar comentários. Você também pode extrair e fazer *comentários* um recurso diferente, mas às vezes é mais lógico estender o recurso pai.

#### addCollection(route, [verbs=GET], [callback])
O método `addCollection` adicionará uma nova rota ao recurso existente. Por padrão, ele vincula a rota usando o verbo GET e o nome da ação do controlador é o mesmo que o nome da rota.

```js
Route
  .resource('authors', 'AuthorsController')
  .addCollection('popular')
```

Saída:

| Url | Verbo | Método Controlador | Propósito |
|-----|------|-------------------|---------|
| /autores/populares | GET | AuthorsController.popular | Lista de autores populares |

Claro, você pode definir um verbo HTTP diferente e atribuir um método de controlador diferente.

```js
Route
  .resource('authors', 'AuthorsController')
  .addCollection('popular', ['GET', 'HEAD'], (collection) => {
    collection.bindAction('popularAuthors')
  })
```

#### addMember(route, [verbs=GET], [callback])
O método `addMember` tem a mesma assinatura que [addCollection](#addmemberroute-verbsget-callback), mas, em vez disso, adiciona o membro para um item específico dentro do recurso.

```js
Route
  .resource('posts', 'PostsController')
  .addMember('comments')
```

Saída:

| Url | Verbo | Método Controlador | Propósito |
|-----|------|-------------------|---------|
| /posts/:id/comentários | GET | PostsController.comentários | Listar comentários para uma publicação específica |


Como você pode notar, o `comentários` foi adicionado à rota de um único post. Além disso, você pode definir [middleware](/src/docs/03-getting-started/08-middleware.md) e [nome](#asname) nas rotas estendidas.

```js
Route
  .resource('posts', 'PostsController')
  .addMember('comments', ['GET'], (member) => {
    member.middleware('auth').as('postsMember')
  })
```

> DICA:
> Middleware também pode ser adicionado ao recurso inteiro. Por exemplo: `Route.resource().middleware()`
