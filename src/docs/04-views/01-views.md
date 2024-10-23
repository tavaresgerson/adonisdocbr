# Views

O mecanismo de exibição do AdonisJs é construído sobre o Nunjucks, uma biblioteca de modelos poderosa e flexível. Tudo o que o Nunjucks oferece é totalmente suportado com algumas funcionalidades exclusivas do AdonisJs.

## Como as Vistas funcionam?

* As views são armazenadas dentro de `resources/views`.
* Todos eles devem ter uma extensão de ` .njk`.
Para criar uma visão, você pode usar um comando de geração

```bash
./ace make:view welcome

# create: resources/views/welcome.njk
```

Você é livre para criar múltiplos diretórios para gerenciar layouts e parciais.
Você pode armazenar em cache as visualizações na produção definindo *CACHE_VIEWS=true* no arquivo *.env*.

## Exemplo básico
Vamos pegar um exemplo básico de renderização de uma visão registrando uma rota e controlador.

```js
// .Route
const Route = use('Route')
Route.get('/greet/:user', 'UserController.greet')
```

```js
// .Controller
class UserController {

  * greet (request, response) {
    const user = request.param('user')
    yield response.sendView('greet',  { user })
  }

}
```

```twig
// .View
<h2> Hello {{ user }} </h2>
```

## Renderizando Visualizações
As views podem ser renderizadas usando o objeto 'response' ou com a ajuda do provedor 'View'.

> NOTE:
> É recomendado usar o método `response.sendView` sempre que você tiver acesso ao objeto de resposta.

#### make(templatePath, dados)

```js
const View = use('View')
const compiledHtml = yield View.make('welcome')
```

#### makeString(templateString, dados)

```js
const View = use('View')
const compiledHtml = View.makeString('<h2> Hello {{ username }} </h2>', {username: 'virk'})
```

Os modelos são referenciados sem a extensão *.njk* para as funções 'make' ou 'sendView'. Além disso, você pode aproveitar a notação de ponto para referenciar visualizações aninhadas.


| Caminho | Referencia como |
|------|---------------|
| resources/views/home.njk | response.sendView('home') |
| resources/views/user/list.njk | response.sendView('user.list') |

## Templação
A templating refere-se à ligação dinâmica de dados e ao processamento lógico dos dados dentro das suas vistas. Você é obrigado a seguir uma sintaxe especial para fazer tudo isso funcionar.

### Variáveis
Para imprimir o valor de uma variável, você utiliza chaves curvas.

```twig
{{ user }}
{{ user.firstname }}
{{ user['firstname'] }}
```

### Condicionais
Condicionais são referenciados com uma chave e um sinal de porcentagem.

```twig
{% if user.age %}
  You are {{ user.age }} years old.
{% endif %}
```

Você não está limitado a uma condição if. As views suportam if, else, elseif.

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
Filtros transformam dados embutidos e são muito úteis quando você deseja transformar dados apenas para representação.

```twig
{# username = 'john' #}
{{ username | capitalize }}

{# output = John #}
```

Aqui 'capitalize' é um filtro para capitalizar o valor de uma determinada string. Aqui está a lista de todos os links disponíveis: templating:_filters[filters].

## Herança
Herança significa estender um modelo básico e substituir suas partes individuais. Pense nisso como herdar uma Classe JavaScript.

Vamos pegar o exemplo de uma visão principal e uma visão secundária.

```twig
// .resources/views/master.njk

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
// .resources/views/home.njk

{% extends 'master' %}

{% block content %}
  Here comes the content of the home page.
{% endblock %}
```

Saída:
```html

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

1. You must create a block using the *{% block <name> %}* tag.
2. Cada bloco deve ter um nome único.
3. Após estender uma visão, você não pode colocar nada fora das tags de bloco.

## Inclui
Você também pode incluir diferentes modelos em vez de apenas estendê-los. Você começa criando parciais de marcação reutilizável.

Vamos pegar um exemplo de uma aplicação de bate-papo, onde o markup para uma mensagem de bate-papo pode ser salvo dentro de uma visão diferente.

```twig
// .resources/views/chat/message.njk

<div class="chat__message">
  <h2> {{ message.from }} </h2>
  <p> {{ message.body }} </p>
</div>
```

Agora no seu arquivo de índice, você pode incluir o modelo de mensagem dentro de um loop.

```twig
// .resources/views/chat/index.njk

{% for message in messages %}
  {% include 'message' %}
{% endfor %}
```

> NOTE
> Os modelos incluídos compartilham o escopo do bloco pai.

## Macros & Importações
Macros torna fácil criar componentes reutilizáveis. A diferença entre um *parcial* e um *macro* é que você pode passar argumentos para os *macros*, o que os torna reutilizáveis de caixa.

Vamos pegar um exemplo de criação de um componente botão, que irá aderir às classes CSS do Bootstrap.

```twig
// .resource/views/macros/button.njk

{% macro button(value, style='default') %}
  <button type="button" class="btn btn-{{style}}"> {{ value }} </button>
{% endmacro %}
```

Agora podemos usar a macro importando-a

```twig
.resources/views/home.njk

{% from 'macros.button' import button %}
{{ button('Create User', 'primary') }}
```

## Trabalhando com Globais
As views globais estão disponíveis para todos os modelos. O AdonisJS vem com alguns globais predefinidos e alguns são definidos por outros módulos/fornecedores.

### Registrando Globais Específicos do Aplicativo
O melhor lugar para registrar os globais específicos da aplicação é usando o ouvinte de eventos 'start'.

```js
// .app/Listeners/Http.js

Http.onStart = function () {
  const View = use('View')
  View.global('time', function () {
    return new Date().getTime()
  })
}
```

### Via Provedor
Se você estiver escrevendo um módulo/addon para o AdonisJS, você pode registrar uma visão global dentro do método de inicialização do seu provedor de serviços.

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

Agora você pode usar o acima definido global dentro de suas visualizações.

```twig
{{ time() }}
```

## Trabalhando com Filtros
Assim como os globais, você também pode definir filtros. A função dos filtros é pegar uma entrada e transformar seu valor de acordo com as necessidades. Aqui está a lista de todos os filtros embutidos: templating:_filters[filters].

> DICA:
> Os filtros podem ser registrados escutando o evento `Http.start` ou dentro do método `boot` do provedor, de forma semelhante à maneira como os xref:_working_with_globals[globais] são registrados.

```js
// .Registering A Filter

const View = use('Adonis/Src/View')
const accounting = use('accounting') // npm module

View.filter('currency', function (amount, symbol) {
  return accounting.formatMoney(amount, {symbol})
})
```

```twig
// Using Filter

{{ 1000 | currency('$') }}

{# returns $1,000.00 #}
```

## Injeção de Provedores
Você também pode usar provedores de serviço ou qualquer ligação do contêiner IoC dentro das suas visualizações. Vamos pegar um exemplo de busca de usuários diretamente das visualizações.

```twig
{% set User = use('App/Model/User') %}
{% yield users = User.all() %}

{% for user in users.toJSON()   %}
  {{ user.username }}
{% endfor %}
```

> NOTE:
> Injetar provedores pode abrir *buracos de segurança*, especialmente quando você expõe suas visualizações para serem editadas pelo mundo exterior. Pense em um cenário, onde o usuário que edita a visão/modelo injeta o modelo de usuário e cai todos os usuários. *Tenha certeza de desligar a injeção de serviços se você realmente deseja esse recurso*

```js
// .config/app.js

views: {
  injectServices: false
}
```

## Cache
A visualização de cache é controlada através do arquivo `config/app.js`. Certifique-se de desativar o cache durante o desenvolvimento e ativá-lo quando executar seu aplicativo em produção.

```js
// .config/app.js

view: {
  cache: Env.get('CACHE_VIEWS', true)
}
```

```bash
# .(.env)

CACHE_VIEWS=true
```

## Destaque de Sintaxe
Você precisa baixar pacotes para o seu editor favorito para ter destaque de sintaxe apropriado para suas visualizações *nunjucks*.
Você também pode usar o *twitch* highlighter se não conseguir encontrar suporte para Nunjucks no seu editor preferido.

[Atom](https://atom.io/packages/language-nunjucks)
[Sublime Text (via Twig)](https://packagecontrol.io/packages/PHP-Twig)
[WebStorm (via Twig)](https://plugins.jetbrains.com/plugin/7303?).
Aqui está uma lista de tecnologias que você pode usar para desenvolver aplicativos web modernos e responsivos, incluindo frameworks front-end e back-end, linguagens de programação, bibliotecas, ferramentas, tecnologias de banco de dados, servidores, dispositivos móveis, computação em nuvem e muito mais!
[Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ronnidc.nunjucks).
