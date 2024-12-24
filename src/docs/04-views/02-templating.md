# Modelos Nunjucks

Este é um guia de referência para o mecanismo de modelo AdonisJs, cobrindo tópicos sobre *tags*, *filtros* e *métodos* disponíveis para serem usados ​​dentro de suas visualizações. Leia o [guia de visualizações](/src/docs/04-views/01-views.md) para entender como as visualizações funcionam no AdonisJs.

## Tags
Tags são blocos que definem operações lógicas dentro de suas visualizações. Abaixo está a lista de tags disponíveis e seus usos.

### `if`
```twig
{% if username %}
  {{username}}
{% endif %}
```

```twig
{% if not currentUser %}
  <p> You're not logged in! </p>
{% endif %}
```

Você também pode realizar a comparação via `==`.

```twig
{% if age == 18 %}
  You are allowed to join
{% endif %}
```

#### `else`, `elif`

```twig
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

#### `If` como uma expressão

```twig
{{ 'Party' if weekend else 'Do some work' }}
```

#### `for/asyncEach`
O loop `for` itera sobre matrizes e objetos.

```twig
<!-- Array -->

{% for item in items %}
  {{ item.text }}
{% endfor %}
```

```twig
<!-- Object -->

{#
  var scores = {
    Maths: 88,
    English: 92,
    Science: 94
  }
#}

{% for subject, score in scores %}
    You scored {{ score }} in {{ subject }}
{% endfor %}
```

### `asyncAll`
A tag `asyncAll` executará um loop assíncrono em paralelo. É útil quando você executa uma operação assíncrona dentro de um loop.

::: warning OBSERVAÇÃO
Abaixo está um exemplo de busca de perfil de usuário dentro de um loop, o que causará várias consultas ao banco de dados. É recomendado *eagerLoad* relacionamentos usando Lucid.
:::

```twig
<ul>
{% asyncAll user in users.toJSON() %}
  <li>{{ user.id | fetchProfile }}</li>
{% endall %}
</ul>
```

#### `set`
`set` cria uma variável temporária dentro de suas visualizações. Pense nisso como `var` dentro do Javascript.

```twig
{% set username = "John" %}
{{ username }}
```

Além disso, você pode definir várias chaves e seus valores de uma vez.

```twig
{% set x, y, z = 5 %}
```

#### `yield`
Execute um *ES2015 Generator* ou uma *Promise* dentro de suas visualizações.

```twig
{% yield users = User.all() %}
{{ users | json }}
```

#### `raw`
Ao criar aplicativos web agnósticos de Front-End, você provavelmente usará *VueJs*, *AngularJs* ou qualquer estrutura semelhante. Para impedir que suas visualizações analisem seus modelos de front-end, você deve usar a tag `raw`.

```twig
{% raw %}
  <p>{{ message }}</p>
  <input v-model="message">
{% endraw %}
```

#### `filter`
Em vez de usar filtros com um símbolo *pipe (|)*, você também pode usar filtros como uma tag.

```twig
{% filter title %}
  may the force be with you
{% endfilter %}
```

```html
<!-- Saída -->

May The Force Be With You
```

#### `call/caller`
Uma `call` facilita a passagem de muitas marcações para suas macros. Uma macro pode acessar o conteúdo passado como `caller`.

```twig
<!-- resources/views/macros/modal.nunjucks -->

{% macro modal(effect='fade') %}
  <div class="modal {{ effect }}">
    <div class="modal-dialog">
    {{ caller() }}
    </div>
  </div>
{% endmacro %}
```

Agora vamos usar a macro *modal*.

```twig
<!-- resources/views/home.nunjucks -->

{% from 'macros.modal' import modal %}

{% call modal() %}
  <div class="modal-header"></div>
  <div class="modal-body"></div>
  <div class="modal-footer"></div>
{% endcall %}
```

```html
<!-- Saída -->

<div class="modal fade">
  <div class="modal-dialog">
    <div class="modal-header"></div>
    <div class="modal-body"></div>
    <div class="modal-footer"></div>
  </div>
</div>
```

## Comentários
```twig
{# This is a comment #}
```

## Controle de Espaço em Branco
O mecanismo de modelo renderizará todos os espaços em branco entre suas tags. Use a seguinte maneira se quiser remover todo o branco entre o início e o fim da tag.

```twig
{% for i in [1,2,3,4,5] -%}
  {{ i }}
{%- endfor %}
```

O símbolo `-` define a direção do controle de espaço em branco. Colocá-lo na *esquerda* cortará o espaço em branco da esquerda e defini-lo para a *direita* terá o efeito desejado.

## Expressões
Todas as expressões fornecidas são suportadas.

Strings:
```
"How are you?", 'How are you?'
```

Numbers:
```
40, 30.123
```

Arrays:
```
[1, 2, "array"]
```

Objects:
```
{username: 'John', age: 28}
```

Boolean:
```
true, false
```

## Operadores Matemáticos
Abaixo está a lista de operadores matemáticos suportados.

* Adição: `+`
* Subtração: `-`
* Divisão: `/`
* Divisão e truncamento de inteiro: `//`
* Resto da divisão: `%`
* Multiplicação: `*`
* Potência: `**`

```twig
<!-- Usage -->

{{ 10 + 2 }} {# 12 #}
{{ 10 / 2 }} {# 5 #}
{{ 10 % 2 }} {# 0 #}
```

## Operadores de Comparação
Abaixo está a lista de operadores de comparação suportados.

- Igual a `==`
- Diferente de `!=`
- Maior que `>`
- Maior que igual a `>=`
- Menor que `<`
- Menor que igual a `<=`

```twig
<!-- Uso -->

{% if numUsers < 5 %}...{% endif %}
{% if i == 0 %}...{% endif %}
```

## Operadores Lógicos
Abaixo está a lista de operadores lógicos suportados.

#### `and`
```twig
{% if isLimit and count > limit %}
  You have crossed the limit of {{ limit }} users.
{% endif %}
```

#### `or`
```twig
{% if isAdmin or hasPermission %}
  Welcome!
{% endif %}
```

#### `not`
```twig
{% if not isAdmin %}
  You are not allowed to access this record.
{% endif %}
```

::: tip DICA
Use *parênteses* para agrupar expressões. `if (x < 5 or y < 5) and foo`
:::

## Auto Escape
Todos os valores são auto escaped dentro de suas visualizações para mantê-los seguros contra injeção de HTML e ataques XSS. No entanto, seu aplicativo pode ter requisitos de injeção de snippets HTML dentro de suas visualizações e, nesse caso, você deve usar o filtro `safe`.

```twig
<!-- Sem filtro -->

{% set title = '<h1> Title </h1>' %}
{{ title }}

{# output &lt;h1&gt; Title &lt;/h1&gt; #}
```

```twig
<!-- Com filtro -->

{% set title = '<h1> Title </h1>' %}
{{ title | safe }}

{# output <h1> Title </h1> #}
```

## Globais
Aqui falamos sobre globais predefinidos registrados pelo framework. Confira link:views#_working_with_globals[Trabalhando com globais] para saber mais sobre como definir globais de visualizações personalizadas.

#### `linkTo(route, text, data, target)`
Retorna link para uma rota registrada

```js
// Rota

Route
    .get('/users', 'UserController.index')
    .as('listUsers')
```

```twig
<!-- View -->

{{ linkTo('listUsers', 'View All Users') }}
{{ linkTo('listUsers', 'View All Users', {}, '_blank') }}
```

```html
<!-- Saída -->

<a href="/users"> View Profile </a>
<a href="/users" target="_blank"> View Profile </a>
```

#### `linkToAction(controllerAction, text, data, target)`
Retorna link para ação do controlador de rota registrada.

```twig
{{ linkToAction('UserController.index', 'View All Users') }}
{{ linkToAction('UserController.index', 'View All Users', {}, '_blank') }}
```

```html
<!-- Saída -->

<a href="/users"> View Profile </a>
<a href="/users" target="_blank"> View Profile </a>
```

#### `range(start, stop, [step=1])`
Faz um loop em um intervalo de valores. Pense nisso como chamar um loop `for`.

```twig
{% for i in range(0, 5) -%}
  {{ i }},
{%- endfor %}
```

```js
// Saída

0,1,2,3,4
```

## Filtros
Abaixo está a lista de todos os filtros disponíveis. Confira link:views#_working_with_filters[Trabalhando com filtros] para saber mais sobre como definir filtros.

#### `age`
```twig
{{ age | abs }}
```

#### `action`
Retorna URL para ação do controlador registrado.

```js
// Rota

Route.put('/user/:id', 'UserController.update')
```

```twig
<!-- View -->

<form method="POST" action="{{ 'UserController.update' | action({id: 1}) }}">
</form>
```

```html
<!-- Saída -->

<form method="POST" action="/user/1"></form>
```

#### `batch`
Cria vários pedaços de uma matriz. É útil ao imprimir grade HTML.

```twig
{% for rows in users | batch(3) %}
  <div class='row'>
    {% for user in rows %}
      <div class='col-md-4'></div>
    {% endfor %}
  </div>
{% endfor %}
```

#### `capitalize`
```twig
{{ name | capitalize }}
```

#### `default`
```twig
{{ title | default('Adonis') }}
```

#### `first`
Retorna o primeiro item de uma matriz.

```twig
{{ ['foo','bar'] | first }}
```

#### `groupby`
```twig
{% set users = [{username:'doe', age:22}, {username:'dim', age:22}, {username:'dock', age:21}] %}
{{ users | groupby('age') | json }}
```

#### `indent(width=2, firstLine=false)`
Recua cada linha da string com os espaços fornecidos.

```twig
{{ text | indent(2, true) }}
```

#### `join`
```twig
{{ ['hello', 'world'] | join(' ') }}
```

#### `json(indentation=2)`
```twig
{{ users | json }}
{{ users | json(4) }}
```

#### `last`
Retorna o último item de uma matriz.

```twig
{{ ['foo','bar'] | last }}
```

#### `length`
Retorna o comprimento do array.

```twig
{{ ['foo','bar'] | length }}
```

#### `list`
Converte um array em uma lista, pense nisso como uma substituição para `join`, mas também funciona com strings dentro do array.

```twig
{{ ['foo','bar'] | list }}
```

#### `lower`
Converte valor para minúsculas

```twig
{{ "Hello World" | lower }}
{# hello world #}
```

#### `random`
Retorna item aleatório de um array

```twig
{{ ['foo', 'bar', 'baz'] | random }}
```

#### `rejectattr`
Filtra um array e remove objetos contendo atributos definidos

```twig
{% set users = [{username: 'doe', admin: false}, {username: 'doe', admin: true}] %}
{{ users | rejectattr('admin') | json }}
```

#### `replace`
Implementação do método nativo `replace` do javascript, o primeiro argumento pode ser um regex.

```twig
{{ 'Hello World' | replace('World', 'Everyone') }}
{# Hello Everyone #}
```

#### `reverse`
```twig
{{ 'Hello World' | reverse }}
```

#### `round`
Arredonda o número para uma precisão dada usando o método definido

```twig
{{ 42.55 | round }}
{# 43.0 #}

{{ 42.55 | round(1, 'floor') }}
{# 42.5 #}
```

#### `route`
Resolve uma rota registrada.

```js
// Rota

Route
    .put('/profile/:id', 'ProfileController.update')
    .as('updateProfile')
```

```twig
<form method="POST" action="{{ 'updateProfile' | route({id: 1}) }}">
</form>
```

#### `striptags`
Remove as tags *Html*, *XML* de uma string

```twig
{{ '<h2> Hello World </h2>' | striptags }}
{# Hello World #}
```

#### `title`
```twig
{{ "hello world" | title }}
{# Hello World #}
```

#### `trim`
Corta o espaço em branco.

```twig
{{ " Hello World " | trim }}
{# Hello World #}
```

#### `truncate`
Retorna uma cópia truncada da string.

```twig
{{ "Grumpy wizards make toxic brew for the evil Queen and Jack." | truncate(30) }}
{# Grumpy wizards make toxic brew... #}
```

#### `upper`
Torna a string em maiúsculas.

```twig
{{ 'hello world' | upper }}
```

#### `urlencode`
Torna o valor amigável para URL (usa codificação UTF-8).

```twig
{{ 'http://foo.com?bar=baz' | urlencode }}
```

#### `wordcount`
Conta palavras em uma string.

```twig
{{ 'Grumpy wizards make toxic brew' | wordcount }}
```

#### `float`
Converte o valor em um valor float.

```twig
{{ '1.2' | float }}
```

#### `int`
Converte o valor em um valor inteiro.

```twig
{{ '1.2' | int }}
```
