# Roteamento

As rotas permitem que o mundo exterior interaja com seu aplicativo por meio de URLs.

As rotas são registradas dentro do arquivo `start/routes.js`.

## Roteamento básico
A ligação de rota mais básica requer uma URL e um fechamento:

``` js
Route.get('/', () => 'Hello Adonis')
```

O valor de retorno do fechamento será enviado de volta ao cliente como resposta.

Você também pode vincular uma rota a um controlador usando uma assinatura `controller.method`:

``` js
Route.get('posts', 'PostController.index')
```
A assinatura acima `PostController.index` refere-se ao método `App/Controllers/Http/PostController.js` do arquivo `index`.

## Métodos de roteador disponíveis
As rotas de recursos usam verbos HTTP diferentes para indicar o tipo de solicitação

``` js
Route.get(url, closure)
Route.post(url, closure)
Route.put(url, closure)
Route.patch(url, closure)
Route.delete(url, closure)
```

Para registrar uma rota que responde a vários verbos, use `Route.route`:

``` js
Route.route('/', () => {
  //
}, ['GET', 'POST', 'PUT'])
```
Para renderizar uma visualização diretamente (por exemplo, páginas estáticas), use `Route.on.render`:

``` js
Route.on('/').render('welcome')
```

No exemplo acima, quando a `/` rota raiz é carregada, o arquivo `resources/view/welcome.edge` é renderizado diretamente.

## Parâmetros da rota

### Parâmetros necessários

Para rotas dinâmicas, você pode definir parâmetros de rota da seguinte forma:

``` js
Route.get('posts/:id', ({ params }) => {
  return `Post ${params.id}`
})
```
No exemplo acima, `:id` é um parâmetro de rota.

Seu valor é recuperado através do objeto `params`.

Parâmetros opcionais
Para definir um parâmetro de rota opcional, acrescente o símbolo `?` à sua definição:

``` js
Route.get('make/:drink?', ({ params }) => {
  // use Coffee como substituto quando a bebida não estiver definida
  const drink = params.drink || 'Coffee'

  return `One ${drink}, coming right up!`
})
```

No exemplo acima, `:drink?` é um parâmetro de rota opcional.

## Rota curinga
Convém renderizar uma única exibição do servidor e manipular o roteamento usando sua estrutura front-end preferida:

``` js
Route.any('*', ({ view }) => view.render('...'))
```

Quaisquer rotas específicas precisam ser definidas antes da sua rota curinga:

``` js
Route.get('api/v1/users', closure)

Route.any('*', ({ view }) => view.render('...'))
```

## Rota nomeada
Embora as rotas sejam definidas dentro do arquivo `start/routes.js`, elas são referenciadas em qualquer outro lugar do aplicativo 
(por exemplo, usando o helper `views` de rota para criar uma URL para uma determinada rota).

Usando o método `as()`, você pode atribuir à sua rota um nome exclusivo:

``` js
Route.get('users', closure).as('users.index')
```
Isso permitirá que você use o helper `route` em seus templates e códigos, da seguinte forma:

``` html
<!-- before -->
<a href="/users">List of users</a>

<!-- after -->
<a href="{{ route('users.index') }}">List of users</a>
``` 

``` js
foo ({ response }) {
  return response.route('users.index')
}
```

Ambos os helpers `route` compartilham a mesma assinatura e aceitam um objeto de parâmetros opcional como seu segundo argumento:

``` js
Route.get('posts/:id', closure).as('posts.show')

route('posts.show', { id: 1 })
```

`route` também aceita mais um parâmetro opcional, o terceiro parâmetro pode ser um objeto, ele vai lidar com opções de `protocol`, 
`domain`e `query`:

``` js
route('posts.show', { id: 1 }, {
  query: { foo: 'bar' }
});

// Resultado /post/1?foo=bar

// Sem parâmetros
route('auth.login', null, {
  domain: 'auth.example.com',
  protocol: 'https',
  query: { redirect: '/dashboard' }
});

// Resultado https://auth.example.com/login?redirect=%2Fdashboard
```

As mesmas regras se aplicam à visualização.

``` edge
<a href="{{ route('posts.show', { id: 1 }, {query: { foo: 'bar' }}) }}">Show post</a>
// href="/post/1?foo=bar"
```

## Formatos de Rota
Os formatos de rota abrem uma nova maneira de negociação de conteúdo, na qual você pode aceitar o formato de resposta como 
parte do URL.

Um formato de rota é um contrato entre o cliente e o servidor para que esse tipo de resposta possa retornar:

``` js
Route.get('users', async ({ request, view }) => {
  const users = await User.all()

  if (request.format() === 'json') {
    return users
  }

  return view.render('users.index', { users })
}).formats(['json'])
```
Para o exemplo acima, o ponto de extremidade `/users` poderá responder em vários formatos com base no URL:

```
GET /users.json     # Returns an array of users in JSON
GET /users          # Returns the view in HTML
```

Você também pode desativar o URL padrão e forçar o cliente a definir o formato:

``` js
Route.get('users', closure).formats(['json', 'html'], true)
```
Passar `true` como o segundo argumento garante que o cliente especifique um dos formatos esperados. Caso contrário, um erro 
404 será lançado.

## Recursos da rota
Você frequentemente criará rotas com recursos para executar operações de CRUD.

`Route.resource` atribui rotas CRUD a um controlador usando uma única linha de código:

``` js
// Isso...
Route.resource('users', 'UserController')

// ... Equivalente a isso:
Route.get('users', 'UserController.index').as('users.index')
Route.post('users', 'UserController.store').as('users.store')
Route.get('users/create', 'UserController.create').as('users.create')
Route.get('users/:id', 'UserController.show').as('users.show')
Route.put('users/:id', 'UserController.update').as('users.update')
Route.patch('users/:id', 'UserController.update')
Route.get('users/:id/edit', 'UserController.edit').as('users.edit')
Route.delete('users/:id', 'UserController.destroy').as('users.destroy')
```

> Esse recurso está disponível apenas ao vincular rotas a um Controlador.

Você também pode definir recursos aninhados:

``` js
Route.resource('posts.comments', 'PostCommentController')
```

## Recursos de filtragem
Você pode limitar as rotas atribuídas pelo método `Route.resource` encadeando um dos métodos de filtro abaixo.

### apiOnly
Remove as rotas `GET resource/create` e `GET resource/:id/edit`:
``` js
Route.resource('users', 'UserController')
  .apiOnly()
```

### only
Mantém apenas as rotas passadas:
``` js
Route.resource('users', 'UserController')
  .only(['index', 'show'])
```

### except
Mantém todas as rotas, exceto as rotas passadas:
``` js
Route.resource('users', 'UserController')
  .except(['index', 'show'])
```

## Middleware de Recursos
Você pode anexar o middleware a qualquer recurso, como faria com uma única rota:

``` js
Route.resource('users', 'UserController')
  .middleware(['auth'])
```

Se você não deseja anexar o middleware a todas as rotas geradas por `Route.resource`, pode personalizar esse comportamento passando 
o `Map` para o método `middleware`:
``` js
Route.resource('users', 'UserController')
  .middleware(new Map([
    [['store', 'update', 'destroy'], ['auth']]
  ]))
```

No exemplo acima, o middleware de autenticação é aplicado apenas à loja, atualiza e destrói rotas.

### Formatos de recursos
Você pode definir formatos de resposta para rotas com recursos por meio do formatsmétodo:

``` js
Route.resource('users', 'UserController')
  .formats(['json'])
```

## Domínios de roteamento
Seu aplicativo pode usar vários domínios.

Os AdonisJs tornam super fácil lidar com esse caso de uso.

Os domínios podem ser um ponto final estático `blog.adonisjs.com` ou um ponto final dinâmico `:user.adonisjs.com`.

> Você também pode definir o domínio em uma única rota.

``` js
Route.group(() => {
  Route.get('/', ({ subdomains }) => {
    return `The username is ${subdomains.user}`
  })
}).domain(':user.myapp.com')
```

No exemplo acima, se você visitasse `virk.myapp.com`, veria `The username is virk`.


## Grupos de rotas
Se as rotas do seu aplicativo compartilharem lógica/configuração comum, em vez de redefinir a configuração de cada rota, 
você poderá agrupá-las da seguinte maneira:

``` js
// Desgrupado
Route.get('api/v1/users', closure)
Route.post('api/v1/users', closure)

// Agrupado
Route.group(() => {
  Route.get('users', closure)
  Route.post('users', closure)
}).prefix('api/v1')
```

## Prefixo
Prefixe todos os URLs de rota definidos no grupo:
``` js
Route.group(() => {
  Route.get('users', closure)   // GET /api/v1/users
  Route.post('users', closure)  // POST /api/v1/users
}).prefix('api/v1')
```

## Middleware
Atribua um ou muitos middlewares ao grupo de rotas:

``` js
Route.group(() => {
  //
}).middleware(['auth'])
```

> O middleware do grupo é executado antes do roteamento do middleware.

## Namespace
Prefixe o namespace do controlador associado:

``` js
Route.group(() => {
  // Binds '/users' to 'App/Controllers/Http/Admin/UserController'
  Route.resource('/users', 'UserController')
}).namespace('Admin')
```

## Formatos
Define os formatos para todas as rotas no grupo:

``` js
Route.group(() => {
  //
}).formats(['json', 'html'], true)
```

## Domínio
Especifique a quais rotas do grupo de domínio pertencem:

``` js
Route.group(() => {
  //
}).domain('blog.adonisjs.com')
```
