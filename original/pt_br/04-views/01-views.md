# Visualizações

O AdonisJs tem um mecanismo de visualização sólido construído em cima do [nunjucks](http://mozilla.github.io/nunjucks/templating.html). Tudo do nunjucks é totalmente suportado com alguns recursos extras exclusivos do AdonisJs.

## Como as visualizações funcionam?

* As visualizações são armazenadas dentro de `resources/views`.
* Todas elas devem ter uma extensão de `.njk`.
* Para criar uma visualização, você pode usar um comando gerador

```bash
  ./ace make:view welcome

  # create: resources/views/welcome.njk
  ```
* Você é livre para criar vários diretórios para gerenciar *layouts* e *partials*.
* Você pode armazenar visualizações em cache na produção definindo *CACHE_VIEWS=true* dentro do arquivo `.env`.

## Exemplo básico
Vamos dar um exemplo básico de renderização de uma visualização registrando uma rota e um controlador.

```js
// Route

const Route = use('Route')
Route.get('/greet/:user', 'UserController.greet')
```

```js
// Controller

class UserController {

  * greet (request, response) {
    const user = request.param('user')
    yield response.sendView('greet',  { user })
  }

}
```

```twig
<!-- View -->

<h2> Hello {{ user }} </h2>
```

## Renderizando Views
Views podem ser renderizadas usando o objeto `response` ou com a ajuda do provedor `View` diretamente.

> NOTA: É recomendado usar `response.sendView` sempre que você tiver acesso ao objeto response.

#### make(templatePath, data)
```js
const View = use('View')
const compiledHtml = yield View.make('welcome')
```

#### makeString(templateString, data)
```js
const View = use('View')
const compiledHtml = View.makeString('<h2> Hello {{ username }} </h2>', {username: 'virk'})
```

Templates são referenciados sem a extensão *.njk* para a função `make` ou `sendView`. Além disso, você pode aproveitar a notação de ponto para referenciar views aninhadas.

| Path                          | Referenced As                   |
|-------------------------------|---------------------------------|
| resources/views/home.njk      | response.sendView('home')       |
| resources/views/user/list.njk | response.sendView('user.list')  |

## Modelagem
Modelagem (*templating*) se refere à vinculação dinâmica de dados e ao processamento lógico de dados dentro de suas visualizações. Você precisa seguir uma sintaxe especial para fazer tudo isso funcionar.

### Variáveis
Para gerar o valor de uma variável, você usa chaves.

```twig
{{ user }}
{{ user.firstname }}
{{ user['firstname'] }}
```

### Condicionais
Condicionais são referenciadas com uma chave e um sinal `%`.

```twig
{% if user.age %}
  You are {{ user.age }} years old.
{% endif %}
```

Você não está limitado apenas a uma condição if. As visualizações suportam `if`, `else`, `elseif`.

```twig
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

### Filtros
Filtros transformam dados em linha e são muito úteis quando você deseja transformar dados apenas para representação.

```twig
{# username = 'john' #}
{{ username | capitalize }}

{# output = John #}
```

Aqui `capitalize` é um filtro para capitalizar o valor de uma determinada string. Aqui está a lista de todos os links disponíveis:templating#_filters[filtros].

## Herança
Herança significa estender um modelo base e substituir suas partes individuais. Pense nisso como herdar uma classe Javascript.

Vamos pegar o exemplo de uma visualização mestre e uma filha.

```twig
<!-- resources/views/master.njk -->

<html>
  <body>

    <header class="header">
      {% block header %}
        Common Header
      {% endblock %}
    </header>

    <section class="sidebar">
      {% block sidebar %}
        Common Sidebar
      {% endblock %}
    </section>

    <section class="content">
      {% block content %}{% endblock %}
    </section>

  </body>
</html>
```

```twig
<!-- resources/views/home.njk -->

{% extends 'master' %}

{% block content %}
  Here comes the content of the home page.
{% endblock %}
```

```twig
<!-- Output -->

<html>
  <body>

    <header class="header">
      Common Header
    </header>

    <section class="sidebar">
      Common Sidebar
    </section>

    <section class="content">
      Here comes the content of the home page.
    </section>

  </body>
</html>
```

Aqui está a lista de regras para estender modelos

1. Você deve criar um bloco usando a tag *{% block <name> %}*.
2. Cada bloco deve ter um nome exclusivo.
3. Após estender uma visualização, você não pode colocar nada fora das tags do bloco.

## Inclui
Você também pode incluir modelos diferentes em vez de apenas estendê-los. Você começa criando parciais de marcação reutilizável.

Vamos dar um exemplo de um aplicativo de bate-papo, onde a marcação para uma mensagem de bate-papo pode ser salva dentro de uma visualização diferente.

```twig
<!-- resources/views/chat/message.njk -->

<div class="chat__message">
  <h2> {{ message.from }} </h2>
  <p> {{ message.body }} </p>
</div>
```

Agora, no seu arquivo de índice, você pode incluir o modelo de mensagem dentro de um loop.

```twig
<!-- resources/views/chat/index.njk -->

{% for message in messages %}
  {% include 'message' %}
{% endfor %}
```

> NOTA: Os modelos incluídos compartilham o escopo do bloco pai.

## Macros e importações
As macros facilitam muito a criação de componentes reutilizáveis. A diferença entre um *parcial* e uma *macro* é que você pode passar argumentos para as *macros*, o que as torna reutilizáveis ​​imediatamente.

Vamos dar um exemplo de criação de um componente de botão, que aderirá às classes CSS do bootstrap.

```twig
<!-- resource/views/macros/button.njk -->

{% macro button(value, style='default') %}
  <button type="button" class="btn btn-{{style}}"> {{ value }} </button>
{% endmacro %}
```

Agora podemos usar a macro importando-a

```twig
<!-- resources/views/home.njk -->

{% from 'macros.button' import button %}
{{ button('Create User', 'primary') }}
```

## Trabalhando com globais
As visualizações globais estão disponíveis para todos os modelos. O AdonisJs vem com alguns globais predefinidos e alguns são definidos por outros módulos/provedores.

### Registrando globais específicos do aplicativo
O melhor lugar para registrar globais específicos do aplicativo é usar o ouvinte de eventos `start`.

```js
// .app/Listeners/Http.js

Http.onStart = function () {
  const View = use('View')
  View.global('time', function () {
    return new Date().getTime()
  })
}
```

### Via provedor
Se você estiver escrevendo um módulo/complemento para o AdonisJs, você pode registrar uma visualização global dentro do método `boot` do seu provedor de serviços.

```js
const ServiceProvider = require('adonis-fold').ServiceProvider

class MyServiceProvider extends ServiceProvider {

  boot () {
    const View = use('Adonis/Src/View')
    View.global('time', function () {
      return new Date().getTime()
    })
  }

  * register () {
    // register bindings
  }

}
```

Agora você pode usar o global definido acima dentro de suas visualizações.

```twig
{{ time() }}
```

## Trabalhando com filtros
Assim como os globais, você também pode definir filtros. O trabalho dos filtros é pegar uma entrada e transformar seu valor com base nos requisitos. Aqui está a lista de todos os links:templating#_filters[filters] incorporados.

> DICA: Os filtros podem ser registrados ouvindo o evento `Http.start` ou dentro do provedor `boot`, semelhante à maneira como xref:_working_with_globals[globals] são registrados.

```js
// Registering A Filter

const View = use('Adonis/Src/View')
const accounting = use('accounting') // npm module

View.filter('currency', function (amount, symbol) {
  return accounting.formatMoney(amount, {symbol})
})
```

```twig
<!-- Using Filter -->

{{ 1000 | currency('$') }}

{# returns $1,000.00 #}
```

## Injetando provedores
Você também pode usar provedores de serviço ou qualquer ligação do contêiner IoC dentro de suas visualizações. Vamos dar um exemplo de busca de usuários diretamente das visualizações.

```twig
{% set User = use('App/Model/User') %}
{% yield users = User.all() %}

{% for user in users.toJSON()   %}
  {{ user.username }}
{% endfor %}
```

> OBSERVAÇÃO: Injetar provedores pode abrir *brechas de segurança*, especialmente quando você expõe suas visualizações para serem editadas pelo mundo externo. Pense em um cenário em que o usuário que edita a visualização/modelo injeta o modelo de usuário e remove todos os usuários. *Certifique-se de desativar o sinalizador injectServices se você quiser esse recurso*

```js
// config/app.js

views: {
  injectServices: false
}
```

## Cache
O cache de visualizações é controlado pelo arquivo `config/app.js`. Certifique-se de desabilitar o cache durante o desenvolvimento e habilitá-lo ao executar seu aplicativo em produção.

```js
// config/app.js

view: {
  cache: Env.get('CACHE_VIEWS', true)
}
```

```bash
# .env

CACHE_VIEWS=true
```

## Destaque de sintaxe
Você precisa baixar pacotes para seu editor favorito para ter o destaque de sintaxe adequado para suas visualizações *nunjucks*.
Você também pode usar o marcador *twig* se não encontrar suporte para nunjucks para seu editor favorito.

[Atom](https://atom.io/packages/language-nunjucks)
[Sublime Text (Via Twig)](https://packagecontrol.io/packages/PHP-Twig)
[Webstorm (Via Twig)](https://plugins.jetbrains.com/plugin/7303?)
[Brackets](https://github.com/axelboc/nunjucks-brackets/)
[Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ronnidc.nunjucks)
