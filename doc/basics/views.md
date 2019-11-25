# Views

O AdonisJs usa o [Edge](http://edge.adonisjs.com/) como seu mecanismo de modelagem, que é incrivelmente rápido e vem com uma API elegante para criar 
visualizações dinâmicas.

Sob o capô, o Edge suporta:

* Layouts e parciais
* Componentes
* Depuração de tempo de execução usando as ferramentas de desenvolvimento do Chrome
* Tags lógicas e tudo mais

## Exemplo básico
Vamos começar com o exemplo clássico do 'Hello World' renderizando um template edge.

> Verifique se o AdonisJs `ViewProvider` está registrado como um provedor dentro do seu arquivo `start/app`.

``` js
const providers = [
  '@adonisjs/framework/providers/ViewProvider'
]
```

Todas as visualizações são armazenadas no diretório `resources/views` e terminam com a extensão `.edge`.

Use o comando do `adonis` para criar a visualização:

``` 
adonis make:view hello-world
```

Espere o retorno como

```
✔ create  resources/views/hello-world.edge
```

Abra `hello-world.edge` e salve seu conteúdo como:

``` html
<h1>Hello World!</h1>
```

Agora, crie uma rota para renderizar `hello-world.edge`:

``` js
Route.get('hello-world', ({ view }) => {
  return view.render('hello-world')
})
```

O método `view.render` usa o caminho relativo de `resources/views` para o arquivo de exibição. Não há necessidade de digitar 
a extensão `.edge`.

Se você já fez, sirva seu site:

```
> adonis serve --dev
```

Por fim, navegue até `127.0.0.1:3333/hello-world` e você verá:

**"Hello World!"**

### Visualizações aninhadas
Você também pode renderizar views de dentro de subpastas por meio de notação de ponto:

``` js
// caminho: resources/views/my/nested/view.edge

view.render('my.nested.view')
```

## Pedir informação
Todas as visualizações têm acesso ao objeto `request` atual.

Você pode chamar métodos de solicitação dentro de seus modelos de exibição da seguinte maneira:

``` js
A URL de requisição é {{ request.url() }}
```

O valor `request.url` acima também pode ser recuperado via url global:

``` js
A URL de requisição é {{ url }}
```

## Globals
Além de todas as globais do Edge, as seguintes globais também são fornecidas pelos AdonisJs.

### estilo
Adiciona um link a um arquivo CSS.

Caminho relativo (para arquivos CSS no diretório `public`):

``` edge
{{ style('style') }}
```

``` html
<link rel="stylesheet" href="/style.css" />
```

Caminho absoluto:

``` edge
{{ style('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css') }}
```

``` html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" />
```

### script
Adiciona uma tag script direcionando a um arquivo JavaScript.

Caminho relativo (para arquivos JavaScript no publicdiretório):

``` edge
{{ script('app') }}
```

``` html
<script type="text/javascript" src="/app.js"></script>
```

Caminho absoluto:

``` edge
{{ script('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js') }}
```
``` html
<script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
```

### assetsUrl
Retorna o caminho de um arquivo relativo ao diretório `public`:

```
<img src="{{ assetsUrl('images/logo.png') }}" />
```

```
<img src="/images/logo.png" />
```

### route
Retorna o URL para uma rota.

Por exemplo, usando o seguinte exemplo de rota

``` js
Route.get('users/:id', 'UserController.show')
  .as('profile')
```

... Se você passar o nome da rota e qualquer parâmetro da rota...

``` html
<a href="{{ route('profile', { id: 1 }) }}">
  View profile
</a>
```

... A URL da rota será renderizada da seguinte maneira:

```
<a href="/users/1">
  View profile
</a>
```

Você também pode passar a controller.methodassinatura:

```
<a href="{{ route('UserController.show', { id: 1 }) }}">
  View profile
</a>
```

### url
Retorna o URL da solicitação atual:

```
A URL de requisição é {{ url }}
```

### auth
Se você estiver usando o provedor de autenticação do AdonisJs, poderá acessar o usuário conectado atual através do objeto
global `auth`:

``` edge
{{ auth.user }}
```

### CSRF
Se você estiver usando o AdonisJs [Shield Middleware](https://adonisjs.com/docs/4.1/csrf), poderá acessar o 
campo CSRF token e input usando uma das seguintes globais.


### csrfToken
```
{{ csrfToken }}
```

### csrfField
```
{{ csrfField() }}
```

``` html
<input type="hidden" name="_csrf" value="...">
```

### cspMeta
Usando o AdonisJs [Shield Middleware](https://adonisjs.com/docs/4.1/csrf), os cabeçalhos CSP são definidos automaticamente.

No entanto, você também pode configurá-los manualmente via o método global `cspMetag`:

```
<head>
  {{ cspMeta() }}
</head>
```

## Tag
[Tags](http://edge.adonisjs.com/docs/tags) são os blocos de construção dos templates do Edge.

Por exemplo, `@if`, `@each` e `@include` são todas as tags fornecido com edge por padrão.

O Edge também expõe uma API muito poderosa para adicionar novas tags.

Aqui está uma lista específica de `tags` do AdonisJs.

### loggedIn
A tag `loggedIn` permite que você escreva uma cláusula condicional `if/else` em torno do usuário conectado.

Por exemplo:

``` edge
@loggedIn
  You are logged in!
@else
  <a href="/login">Click here</a> to login.
@endloggedIn
```

Tudo entre a tag `@loggedIn` e `@else`é renderizado se o usuário estiver conectado, enquanto tudo entre a tag `@else` e 
`@endloggedIn` é renderizado se não estiver.

### inlineSvg
Renderiza um arquivo SVG embutido dentro do seu HTML.

A tag espera um caminho relativo para um arquivo SVG dentro do diretório `public`:

``` edge
<a href="/login">
  @inlineSvg('lock')
  Login
</a>
```

## Templating
AdonisJs compartilha sua sintaxe de modelo com o [Edge](https://edge.adonisjs.com/).

Leia o [Guia de sintaxe](http://edge.adonisjs.com/docs/syntax-guide) do Edge para obter mais informações.

## Estendendo visualizações
Também é possível estender as visualizações adicionando suas próprias etiquetas ou globais.

> Como o código `View` a ser estendido precisa ser executado apenas uma vez, você pode usar provedores ou ganchos 
> do Ignitor para fazer isso. [Leia Estendendo o núcleo](https://adonisjs.com/docs/4.1/extending-adonisjs) para obter mais informações.

### Globals

``` js
const View = use('View')

View.global('currentTime', function () {
  return new Date().getTime()
})
```

O global acima retorna o horário atual quando referenciado em suas visualizações:

``` edge
{{ currentTime() }}
```

### Escopo Globals
O valor de `this` dentro de um fechamento global é vinculado ao contexto de visualização, para que você possa acessar 
valores durante o tempo de execução a partir dele:

``` js
View.global('button', function (text) {
  return this.safe(`<button type="submit">${text}</button>`)
})
```

> O método `safe` garante que o HTML retornado seja escapado.

Para usar outras globais dentro das globais personalizadas, use o método `this.resolve`:

``` js
View.global('messages', {
  success: 'This is a success message',
  warning: 'This is a warning message'
})

View.global('getMessage', function (type) {
  const message = this.resolve('messages')
  return messages[type]
})
```

``` edge
{{ getMessage('success') }}
```

### Tag
Você pode aprender mais sobre tags na [documentação](http://edge.adonisjs.com/docs/tags) do Edge.

``` js
const View = use('View')

class MyTag extends View.engine.BaseTag {
  //
}

View.engine.tag(new MyTag())
```

### Valores de tempo de execução
Você pode compartilhar valores de solicitação específicos com suas visualizações.

Isso pode ser feito criando middleware e compartilhando locais:

``` js
class SomeMiddleware {

  async handle ({ view }, next) {
    view.share({
      apiVersion: request.input('version')
    })

    await next()
  }
}
```

Em suas visualizações, você pode acessá-lo como qualquer outro valor:

``` 
{{ apiVersion }}
```

## Realce de sintaxe (highlights)
Os seguintes plug-ins de editor fornecem suporte para destaque da sintaxe do Edge:

* [Texto sublime](https://github.com/poppinss/edge-sublime-syntax)
* [Átomo](https://github.com/poppinss/edge-atom-syntax)
* [Código do Visual Studio](https://github.com/duyluonglc/vscode-edge)



