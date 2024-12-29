# Roteamento

As rotas permitem que o mundo externo interaja com seu aplicativo por meio de URLs.

As rotas são registradas dentro do arquivo `start/routes.js`.

## Roteamento básico

A vinculação de rota mais básica requer uma URL e um fechamento:

```js
// .start/routes.js

Route.get('/', () => 'Hello Adonis')
```

O valor de retorno do fechamento será enviado de volta ao cliente como uma resposta.

Você também pode vincular uma rota a um controlador usando uma assinatura `controller.method`:

```js
// .start/routes.js
Route.get('posts', 'PostController.index')
```

A assinatura `PostController.index` acima se refere ao método `index` do arquivo `App/Controllers/Http/PostController.js`.

### Métodos de roteador disponíveis

Rotas com recursos usam diferentes verbos HTTP para indicar o tipo de solicitação:

```js
Route.get(url, closure)
Route.post(url, closure)
Route.put(url, closure)
Route.patch(url, closure)
Route.delete(url, closure)
```

Para registrar uma rota que responde a vários verbos, use `Route.route`:

```js
Route.route('/', () => {
  //
}, ['GET', 'POST', 'PUT'])
```

Para renderizar uma visualização diretamente (por exemplo, páginas estáticas), use `Route.on.render`:

```js
Route.on('/').render('welcome')
```

No exemplo acima, quando a rota raiz `/` é carregada, o arquivo `resources/view/welcome.edge` é renderizado diretamente.

## Parâmetros de rota

### Parâmetros obrigatórios

Para rotas dinâmicas, você pode definir parâmetros de rota como:

```js
// .start/routes.js

Route.get('posts/:id', ({ params }) => {
  return `Post ${params.id}`
})
```

No exemplo acima, `:id` é um parâmetro de rota.

Seu valor é então recuperado por meio do objeto `params`.

### Parâmetros opcionais

Para definir um parâmetro de rota opcional, anexe um símbolo `?` à sua definição:

```js
// .start/routes.js

Route.get('make/:drink?', ({ params }) => {
  // use Coffee como alternativa quando a bebida não estiver definida
  const drink = params.drink || 'Coffee'

  return `One ${drink}, coming right up!`
})
```

No exemplo acima, `:drink?` é um parâmetro de rota opcional.

## Rota curinga

Você pode querer renderizar uma única visualização do servidor e manipular o roteamento usando sua estrutura de front-end preferida:

```js
// .start/routes.js

Route.any('*', ({ view }) => view.render('...'))
```

Todas as rotas específicas precisam ser definidas antes da sua rota curinga:

```js
// .start/routes.js

Route.get('api/v1/users', closure)

Route.any('*', ({ view }) => view.render('...'))
```

## Rota nomeada

Embora as rotas sejam definidas dentro do arquivo `start/routes.js`, elas são referenciadas em todos os outros lugares do aplicativo (por exemplo, usando o auxiliar de rota `views` para criar uma URL para uma determinada rota).

Usando o método `as()`, você pode atribuir um nome exclusivo à sua rota:

```js
// .start/routes.js

Route.get('users', closure).as('users.index')
```

Isso permitirá que você use auxiliares `route` em seus modelos e código, como este:

```html
<!-- before -->
<a href="/users">List of users</a>

<!-- after -->
<a href="{{ route('users.index') }}">List of users</a>
```

```js
foo ({ response }) {
  return response.route('users.index')
}
```

Ambos os auxiliares `route` compartilham a mesma assinatura e aceitam um objeto de parâmetros opcional como seu segundo argumento:

```js
Route.get('posts/:id', closure).as('posts.show')

route('posts.show', { id: 1 })
```

Os auxiliares `route` também aceitam um objeto de parâmetros opcional como um terceiro argumento para manipular as opções `protocol`, `domain` e `query`:

```js
route('posts.show', { id: 1 }, {
  query: { foo: 'bar' }
});

// resultando em /post/1?foo=bar

// Sem parâmetros:
route('auth.login', null, {
  domain: 'auth.example.com',
  protocol: 'https',
  query: { redirect: '/dashboard' }
});

// resultando em https://auth.example.com/login?redirect=%2Fdashboard
```

As mesmas regras se aplicam à visualização.

```html
<a href="{{ route('posts.show', { id: 1 }, {query: { foo: 'bar' }}) }}">Show post</a>
// href="/post/1?foo=bar"
```

## Formatos de rota

Os formatos de rota abrem uma nova maneira para [negociação de conteúdo](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation), onde você pode aceitar o formato de resposta como parte da URL.

Um formato de rota é um contrato entre o cliente e o servidor para qual tipo de resposta retornar:

```js
// .start/routes.js

Route.get('users', async ({ request, view }) => {
  const users = await User.all()

  if (request.format() === 'json') {
    return users
  }

  return view.render('users.index', { users })
}).formats(['json'])
```

Para o exemplo acima, o endpoint `/users` poderá responder em vários formatos com base na URL:

```bash
GET /users.json     # Retorna uma matriz de usuários em JSON
GET /users          # Retorna a visualização em HTML
```

Você também pode desabilitar a URL padrão e forçar o cliente a definir o formato:

```js
// .start/routes.js

Route.get('users', closure).formats(['json', 'html'], true)
```

Passar `true` como o segundo argumento garante que o cliente especifique um dos formatos esperados. Caso contrário, um erro 404 será lançado.

## Recursos de rota

Você frequentemente criará rotas engenhosas para fazer operações CRUD em um recurso.

`Route.resource` atribui rotas CRUD a um controlador usando uma única linha de código:

```js
// .start/routes.js

// Isso...
Route.resource('users', 'UserController')

// ...equivale a isso:
Route.get('users', 'UserController.index').as('users.index')
Route.post('users', 'UserController.store').as('users.store')
Route.get('users/create', 'UserController.create').as('users.create')
Route.get('users/:id', 'UserController.show').as('users.show')
Route.put('users/:id', 'UserController.update').as('users.update')
Route.patch('users/:id', 'UserController.update')
Route.get('users/:id/edit', 'UserController.edit').as('users.edit')
Route.delete('users/:id', 'UserController.destroy').as('users.destroy')
```

::: warning OBSERVAÇÃO
Este recurso só está disponível ao vincular rotas a um [Controlador](/docs/04-Basics/03-Controllers.md).
:::

Você também pode definir recursos aninhados:

```js
// .start/routes.js

Route.resource('posts.comments', 'PostCommentController')
```

### Filtrando recursos

Você pode limitar as rotas atribuídas pelo método `Route.resource` encadeando um dos métodos de filtro abaixo.

#### `apiOnly`

Remove as rotas `GET resource/create` e `GET resource/:id/edit`:

```js
// .start/routes.js

Route.resource('users', 'UserController')
  .apiOnly()
```

#### `only`

Mantém apenas as rotas passadas:

```js
// .start/routes.js

Route.resource('users', 'UserController')
  .only(['index', 'show'])
```

#### `except`

Mantém todas as rotas, exceto as rotas passadas:

```js
// .start/routes.js

Route.resource('users', 'UserController')
  .except(['index', 'show'])
```

### Middleware de recurso

Você pode anexar middleware a qualquer recurso como faria com uma única rota:

```js
// .start/routes.js

Route.resource('users', 'UserController')
  .middleware(['auth'])
```

Se não quiser anexar middleware a todas as rotas geradas via `Route.resource`, você pode personalizar esse comportamento passando um `Map` para o método `middleware`:

```js
// .start/routes.js

Route.resource('users', 'UserController')
  .middleware(new Map([
    [['store', 'update', 'destroy'], ['auth']]
  ]))
```

No exemplo acima, o middleware auth é apenas aplicado às rotas store, update e destroy.

### Formatos de recursos

Você pode definir formatos de resposta para rotas com recursos por meio do método `formats`:

```js
// .start/routes.js

Route.resource('users', 'UserController')
  .formats(['json'])
```

## Domínios de roteamento

Seu aplicativo pode usar vários domínios.

O AdonisJs torna super fácil lidar com esse caso de uso.

Os domínios podem ser um ponto de extremidade estático como `blog.adonisjs.com` ou um ponto de extremidade dinâmico como `:user.adonisjs.com`.

::: tip OBSERVAÇÃO
Você também pode definir o domínio em uma única rota.
:::

```js
// .start/routes.js

Route.group(() => {
  Route.get('/', ({ subdomains }) => {
    return `The username is ${subdomains.user}`
  })
}).domain(':user.myapp.com')
```

No exemplo acima, se você visitou `virk.myapp.com`, verá `The username is virk`.

## Grupos de Rota

Se as rotas do seu aplicativo compartilham lógica/configuração comum, em vez de redefinir a configuração para cada rota, você pode agrupá-las assim:

```js
// .start/routes.js

// Desagrupado
Route.get('api/v1/users', closure)
Route.post('api/v1/users', closure)

// Agrupado
Route.group(() => {
  Route.get('users', closure)
  Route.post('users', closure)
}).prefix('api/v1')
```

### Prefixo

Prefixe todas as URLs de rota definidas no grupo:

```js
// .start/routes.js

Route.group(() => {
  Route.get('users', closure)   // GET /api/v1/users
  Route.post('users', closure)  // POST /api/v1/users
}).prefix('api/v1')
```

### Middleware

Atribua um ou muitos middlewares ao grupo de rotas:

```js
// .start/routes.js

Route.group(() => {
  //
}).middleware(['auth'])
```

::: warning OBSERVAÇÃO
O middleware do grupo é executado antes do middleware da rota.
:::

### Namespace

Prefixe o namespace do controlador vinculado:

```js
// .start/routes.js

Route.group(() => {
  // Vincula '/users' a 'App/Controllers/Http/Admin/UserController'
  Route.resource('/users', 'UserController')
}).namespace('Admin')
```

### Formatos

Define formatos para todas as rotas no grupo:

```js
// .start/routes.js

Route.group(() => {
  //
}).formats(['json', 'html'], true)
```

### Domínio

Especifique a qual grupo de domínio as rotas pertencem:

```js
// .start/routes.js

Route.group(() => {
  //
}).domain('blog.adonisjs.com')
```
