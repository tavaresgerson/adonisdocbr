# Visualizações

O AdonisJs usa [Edge](http://edge.adonisjs.com/) como seu mecanismo de criação de modelos, que é incrivelmente rápido e vem com uma API elegante para criar visualizações dinâmicas.

Por baixo dos panos, o Edge suporta:

1. Layouts e parciais
2. Componentes
3. Depuração em tempo de execução usando ferramentas de desenvolvimento do Chrome
4. Tags lógicas e tudo mais

## Exemplo básico
Vamos começar com o exemplo clássico **Hello World** renderizando um modelo do Edge.

::: warning OBSERVAÇÃO
Certifique-se de que o `ViewProvider` do AdonisJs esteja registrado como um provedor dentro do seu arquivo `start/app.js`.
:::

```js
// .start/app.js

const providers = [
  '@adonisjs/framework/providers/ViewProvider'
]
```

Todas as visualizações são armazenadas no diretório `resources/views` e terminam com a extensão `.edge`.

Use o comando `adonis` para criar a visualização:

```bash
adonis make:view hello-world
```

```bash
# .make:view output

✔ create  resources/views/hello-world.edge
```

Abra `hello-world.edge` e salve seu conteúdo como:

```text
<h1>Hello World!</h1>
```

Agora, crie uma rota para renderizar a visualização `hello-world.edge`:

```js
// .start/routes.js

Route.get('hello-world', ({ view }) => {
  return view.render('hello-world')
})
```

O método `view.render` pega o caminho relativo `resources/views` para o arquivo de visualização. Não há necessidade de digitar a extensão `.edge`.

Se você ainda não fez isso, sirva seu site:

```bash
adonis serve --dev
```

Finalmente, navegue até `127.0.0.1:3333/hello-world` e você deverá ver:

**"Hello World!"**

### Visualizações aninhadas
Você também pode renderizar visualizações de dentro de subpastas por meio da notação de ponto:

```js
// file path: resources/views/my/nested/view.edge

view.render('my.nested.view')
```

## Solicitar informações
Todas as visualizações têm acesso ao objeto `request` atual.

Você pode chamar métodos de solicitação dentro de seus modelos de visualização como:

```edge
The request URL is {{ request.url() }}
```

O valor `request.url` acima também pode ser recuperado por meio do global `url`:

```edge
The request URL is {{ url }}
```

## Globals
Além de todos os Edge [globals](http://edge.adonisjs.com/docs/globals), os seguintes globais também são fornecidos pelo AdonisJs.

#### `style`
Adiciona uma tag `link` a um arquivo CSS.

Caminho relativo (para arquivos CSS no diretório `public`):

```edge
{{ style('style') }}
```

```html
<link rel="stylesheet" href="/style.css" />
```

Caminho absoluto:

```edge
{{ style('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css') }}
```

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" />
```

#### script
Adiciona uma tag `script` a um arquivo JavaScript.

Caminho relativo (para arquivos JavaScript no diretório `public`):

```edge
{{ script('app') }}
```

```html
<script type="text/javascript" src="/app.js"></script>
```

Caminho absoluto:

```edge
{{ script('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js') }}
```

```html
<script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
```

#### `assetsUrl`
Retorna o caminho de um arquivo relativo ao diretório `public`:

```edge
<img src="{{ assetsUrl('images/logo.png') }}" />
```

```html
<img src="/images/logo.png" />
```

#### `route`
Retorna a URL para uma rota.

Por exemplo, usando a seguinte rota de exemplo...

```js
// .start/routes.js

Route.get('users/:id', 'UserController.show')
  .as('profile')
```

...se você passar o nome da rota e quaisquer parâmetros de rota...

```edge
<a href="{{ route('profile', { id: 1 }) }}">
  View profile
</a>
```

...a URL da rota será renderizada assim:

```html
<a href="/users/1">
  View profile
</a>
```

Você também pode passar a assinatura `controller.method`:

```edge
<a href="{{ route('UserController.show', { id: 1 }) }}">
  View profile
</a>
```

#### `url`
Retorna a URL da solicitação atual:

```edge
The request URL is {{ url }}
```

#### `auth`
Se estiver usando o AdonisJs [Auth Provider](/docs/05-Security/02-Authentication.md), você pode acessar o usuário conectado atual por meio do objeto global `auth`:

```edge
{{ auth.user }}
```

### CSRF
Se estiver usando o AdonisJs [Shield Middleware](/docs/05-Security/08-Shield-Middleware.md), você pode acessar o token CSRF e o campo de entrada usando um dos seguintes globais.

#### `csrfToken`

```edge
{{ csrfToken }}
```

##### `csrfField`

```edge
{{ csrfField() }}
```

```html
<input type="hidden" name="_csrf" value="...">
```

#### `cspMeta`
Usando o AdonisJs [Shield Middleware](/docs/05-Security/08-Shield-Middleware.md), os cabeçalhos CSP são definidos automaticamente.

No entanto, você também pode defini-los manualmente por meio do `cspMeta` global:

```edge
<head>
  {{ cspMeta() }}
</head>
```

## Tags
[Tags](http://edge.adonisjs.com/docs/tags) são os blocos de construção para modelos do Edge.

Por exemplo, `@if`, `@each` e `@include` são todas tags enviadas com o Edge por padrão.

O Edge também expõe uma API muito poderosa para adicionar novas tags a ele.

Aqui está uma lista das `tags` específicas apenas para o AdonisJs.

#### `loggedIn`
A tag `loggedIn` permite que você escreva uma cláusula condicional `if/else` em torno do usuário conectado.

Por exemplo:

```edge
@loggedIn
  You are logged in!
@else
  <a href="/login">Click here</a> to login.
@endloggedIn
```

Tudo entre as tags `@loggedIn` e `@else` é renderizado se o usuário estiver logado, enquanto tudo entre as tags `@else` e ​​`@endloggedIn` é renderizado se não estiver.

#### `inlineSvg`
Renderiza um arquivo SVG inline dentro do seu HTML.

A tag espera um caminho relativo para um arquivo SVG dentro do diretório `public`:

```edge
<a href="/login">
  @inlineSvg('lock')
  Login
</a>
```

## Modelos
O AdonisJs compartilha sua sintaxe de modelos com o [Edge](https://edge.adonisjs.com).

Leia o Edge [Guia de sintaxe](http://edge.adonisjs.com/docs/syntax-guide) para mais informações.

## Estendendo visualizações
Também é possível estender visualizações adicionando seus próprios globais de visualização ou tags.

::: warning NOTA
Como o código para estender `View` precisa ser executado apenas uma vez, você pode usar [providers](/docs/02-Concept/03-service-providers.md) ou [Ignitor hooks](/docs/02-Concept/05-ignitor.md) para fazer isso. Leia (/docs/06-Digging-Deeper/03-Extending-the-Core.md) para mais informações.
:::

### Globais

```js
const View = use('View')

View.global('currentTime', function () {
  return new Date().getTime()
})
```

O global acima retorna o tempo atual quando referenciado dentro de suas visualizações:

```edge
{{ currentTime() }}
```

### Escopo de globais
O valor de `this` dentro do fechamento de um global é vinculado ao contexto da visualização para que você possa acessar valores de tempo de execução a partir dele:

```js
View.global('button', function (text) {
  return this.safe(`<button type="submit">${text}</button>`)
})
```

::: tip DICA
O método `safe` garante que o HTML retornado não seja escapado.
:::

Para usar outros globais dentro de seus globais personalizados, use o método `this.resolve`:

```js
View.global('messages', {
  success: 'This is a success message',
  warning: 'This is a warning message'
})

View.global('getMessage', function (type) {
  const message = this.resolve('messages')
  return messages[type]
})
```

```edge
{{ getMessage('success') }}
```

### Tags
Você pode aprender mais sobre tags por meio da [documentação](http://edge.adonisjs.com/docs/tags) do Edge.

```js
const View = use('View')

class MyTag extends View.engine.BaseTag {
  //
}

View.engine.tag(new MyTag())
```

### Valores de tempo de execução
Você pode querer compartilhar valores de solicitação específicos com suas visualizações.

Isso pode ser feito criando middleware e compartilhando locais:

```js
class SomeMiddleware {

  async handle ({ view }, next) {
    view.share({
      apiVersion: request.input('version')
    })

    await next()
  }
}
```

Então, dentro de suas visualizações, você pode acessá-lo como qualquer outro valor:

```edge
{{ apiVersion }}
```

## Destaque de sintaxe
Os seguintes plug-ins de editor fornecem suporte ao destaque de sintaxe do Edge:

1. [Sublime Text](https://github.com/poppinss/edge-sublime-syntax)
2. [Atom](https://github.com/poppinss/edge-atom-syntax)
3. [Visual Studio Code](https://github.com/duyluonglc/vscode-edge)
4. [VIM](https://github.com/watzon/vim-edge-template)
