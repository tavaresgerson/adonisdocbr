# Modelos Nunjucks

Esta é uma referência para o mecanismo de modelo AdonisJs, cobrindo tópicos sobre as *tags*, os *filtros* e os *métodos* disponíveis para uso dentro de seus modelos. Leia a [guia de visualizações](/views/views) para entender como funcionam as visualizações no AdonisJs.

## Tags
Tags são blocos que definem operações lógicas dentro de suas visualizações. Abaixo está a lista das tags disponíveis e seus usos.

### se

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

Você também pode fazer comparação usando o operador `==`.

```twig
{% if age == 18 %}
  You are allowed to join
{% endif %}
```

#### else, elif

```twig
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

#### Se uma expressão

```twig
{{ 'Party' if weekend else 'Do some work' }}
```

#### for/asyncEach
O loop 'for' itera sobre arrays e objetos.

```twig
{# Array #}

{% for item in items %}
  {{ item.text }}
{% endfor %}
```

```twig
{# Object #}
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

### asyncAll
A tag `asyncAll` executará um loop assíncrono em paralelo. É útil quando você realiza uma operação assíncrona dentro de um loop.

NOTE: Abaixo está um exemplo de busca de perfil do usuário dentro de um loop, o que irá causar múltiplas consultas ao banco de dados. É recomendado usar eager loading de relacionamentos usando o Lucid.

```twig
<ul>
{% asyncAll user in users.toJSON() %}
  <li>{{ user.id | fetchProfile }}</li>
{% endall %}
</ul>
```

#### conjunto
`set` cria uma variável temporária dentro das suas views. Pense nele como `var` dentro do JavaScript.

```twig
{% set username = "John" %}
{{ username }}
```

Além disso, você pode definir várias chaves e seus valores de uma só vez.

```twig
{% set x, y, z = 5 %}
```

#### yield
Execute um *ES2015 Generator* ou uma *Promise* dentro de suas visualizações.

```twig
{% yield users = User.all() %}
{{ users | json }}
```

#### raw
Ao construir aplicativos web semânticos front-end, você provavelmente vai usar o *VueJs*, *AngularJS* ou qualquer outro framework semelhante. Para parar suas visualizações de analisar seus modelos front-end, você deve usar a tag "raw".

```twig
{% raw %}
  <p>{{ message }}</p>
  <input v-model="message">
{% endraw %}
```

#### filter
Em vez de usar filtros com um caractere de barra vertical (|), você também pode fazer uso de filtros como uma tag.

```twig
{% filter title %}
  may the force be with you
{% endfilter %}
```

Saída:

```html
May The Force Be With You
```

#### call/caller
Uma chamada torna mais fácil passar uma grande quantidade de marcação para suas macros. Uma macro pode acessar o conteúdo passado como "chamador".

```twig
{# .resources/views/macros/modal.nunjucks #}

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
{# .resources/views/home.nunjucks #}

{% from 'macros.modal' import modal %}

{% call modal() %}
  <div class="modal-header"></div>
  <div class="modal-body"></div>
  <div class="modal-footer"></div>
{% endcall %}
```

Saída:

```html
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
A motor de modelo irá renderizar todos os espaços entre suas tags. Utilize da seguinte forma se você quiser remover todos os espaços entre o início e o final da tag.

```twig
{% for i in [1,2,3,4,5] -%}
  {{ i }}
{%- endfor %}
```

- O símbolo `-` define a direção do controle de espaços em branco. Colocá-lo na *esquerda* vai aparar os espaços em branco da esquerda e colocando-o na *direita* terá o efeito desejado.

## Expressões
Todas as expressões fornecidas são suportadas.

#### Strings
```
"How are you?", 'How are you?'
```

#### Números
```
40, 30.123
```

#### Arrays
```
[1, 2, "array"]
```

#### Objetos
```
{username: 'John', age: 28}
```

#### Boolean
```
true, false
```

## Operadores Matemáticos
Abaixo está a lista de operadores matemáticos suportados.

Adição: `+`
* Subtração: `-`
* Divisão: `/`
* Divisão e truncamento de inteiro: `//`
* Divisão Resto: `%`
* Multiplicação: `*`
Power: `***`

Uso:

```twig
{{ 10 + 2 }} {# 12 #}
{{ 10 / 2 }} {# 5 #}
{{ 10 % 2 }} {# 0 #}
```

## Operadores de Comparação
Abaixo está a lista de operadores de comparação suportados.

- Igual a `==`
- Não é igual a `!=`
- Maior que `>`
- Maior que ou igual a `>=`
- Menos que «<»
- Menor ou igual a `<=`

Uso:

```twig
{% if numUsers < 5 %}...{% endif %}
{% if i == 0 %}...{% endif %}
```

## Operadores Lógicos em Resumo
Abaixo está a lista dos operadores lógicos abreviados suportados.

#### e
```twig
{% if isLimit and count > limit %}
  You have crossed the limit of {{ limit }} users.
{% endif %}
```

#### ou
```twig
{% if isAdmin or hasPermission %}
  Welcome!
{% endif %}
```

#### não
```twig
{% if not isAdmin %}
  You are not allowed to access this record.
{% endif %}
```

> DICA:
> Use parênteses para agrupar expressões. 'se (x < 5 ou y < 5) e foo'

## Auto Escape
Todos os valores são automaticamente escapados dentro de suas visualizações para mantê-los seguros de injeção HTML e ataques XSS. No entanto, seu aplicativo pode ter requisitos de injetar fragmentos HTML dentro de suas visualizações e, neste caso, você deve usar o filtro "safe".

Sem Filtro:

```twig
{% set title = '<h1> Title </h1>' %}
{{ title }}

{# output &lt;h1&gt; Title &lt;/h1&gt; #}
```

Com Filtro:

```twig
{% set title = '<h1> Title </h1>' %}
{{ title | safe }}

{# output <h1> Title </h1> #}
```

## Globais
Aqui falamos sobre os globais pré-definidos registrados pelo framework. Verifique o link:views:_#working_with_globals[Trabalhando com Globais] para saber mais sobre a definição de globais personalizados de visualização.

#### linkTo(rota, texto, dados, alvo)
Retorna o link para uma rota registrada específica

```js
// Route
Route
    .get('/users', 'UserController.index')
    .as('listUsers')
```

```twig
{# View #}

{{ linkTo('listUsers', 'View All Users') }}
{{ linkTo('listUsers', 'View All Users', {}, '_blank') }}
```

Saída:

```html
<a href="/users"> View Profile </a>
<a href="/users" target="_blank"> View Profile </a>
```

#### linkToAction(actionController, texto, dados, alvo)
Retorna o link para a rota registrada do controlador de ação.

```twig
{{ linkToAction('UserController.index', 'View All Users') }}
{{ linkToAction('UserController.index', 'View All Users', {}, '_blank') }}
```

Saída:

```html
<a href="/users"> View Profile </a>
<a href="/users" target="_blank"> View Profile </a>
```

#### range(início, parada, [passo = 1])
Loop sobre um intervalo de valores. Pense nisso como chamar um loop "for".

```twig
{% for i in range(0, 5) -%}
  {{ i }},
{%- endfor %}
```

Saída:

```
0,1,2,3,4
```

## Filtros
Abaixo está a lista de todos os filtros disponíveis. Ver link: views:_# _working_with_filters [Trabalhando com filtros] para saber mais sobre a definição de filtros.

#### idade

```twig
{{ age | abs }}
```

#### ação
Retorna a URL para a ação do controlador registrada.

```js
// Route
Route.put('/user/:id', 'UserController.update')
```

```twig
{# View #}

<form method="POST" action="{{ 'UserController.update' | action({id: 1}) }}">
</form>
```

Saída:

```html
<form method="POST" action="/user/1"></form>
```

#### batch
Cria múltiplos pedaços de um array. É útil quando imprimir uma grade HTML.

```twig
{% for rows in users | batch(3) %}
  <div class='row'>
    {% for user in rows %}
      <div class='col-md-4'></div>
    {% endfor %}
  </div>
{% endfor %}
```

#### capitalize

```twig
{{ name | capitalize }}
```

#### Padrão

```twig
{{ title | default('Adonis') }}
```

#### first
Retorna o primeiro item de um array.

```twig
{{ ['foo','bar'] | first }}
```

#### groupby

```twig
{% set users = [{username:'doe', age:22}, {username:'dim', age:22}, {username:'dock', age:21}] %}
{{ users | groupby('age') | json }}
```

#### indente (largura = 2, primeiraLinha = falso)
Indente cada linha de string com os espaços dados.

```twig
{{ text | indent(2, true) }}
```

#### juntar-se

```twig
{{ ['hello', 'world'] | join(' ') }}
```

#### json(indentaçãot=2)

```twig
{{ users | json }}
{{ users | json(4) }}
```

#### last
Retorna o último item de um array.

```twig
{{ ['foo','bar'] | last }}
```

#### comprimento
Retorna o comprimento do array.

```twig
{{ ['foo','bar'] | length }}
```

#### lista
Converte uma matriz em uma lista, pense nisso como uma substituição para o método 'join', mas também funciona com strings dentro da matriz.

```twig
{{ ['foo','bar'] | list }}
```

#### lower
Converte o valor para minúsculas

```twig
{{ "Hello World" | lower }}
{# hello world #}
```

#### random
Retorna um item aleatório de um array

```twig
{{ ['foo', 'bar', 'baz'] | random }}
```

#### rejeitar
Filtra um array e remove objetos contendo atributos definidos

```twig
{% set users = [{username: 'doe', admin: false}, {username: 'doe', admin: true}] %}
{{ users | rejectattr('admin') | json }}
```

#### Substitua
Implementação do método nativo 'replace' de JavaScript, o primeiro argumento pode ser uma expressão regular.

```twig
{{ 'Hello World' | replace('World', 'Everyone') }}
{# Hello Everyone #}
```

#### reverter
```twig
{{ 'Hello World' | reverse }}
```

#### redondo
Redondeie o número até uma precisão dada usando um método definido

```twig
{{ 42.55 | round }}
{# 43.0 #}

{{ 42.55 | round(1, 'floor') }}
{# 42.5 #}
```

#### rota
Resolve uma rota registrada.

```js
// Route
Route
    .put('/profile/:id', 'ProfileController.update')
    .as('updateProfile')
```

```twig
<form method="POST" action="{{ 'updateProfile' | route({id: 1}) }}">
</form>
```

#### striptags
Remover *HTML*, *XML* de uma string

```twig
{{ '<h2> Hello World </h2>' | striptags }}
{# Hello World #}
```

#### título
```twig
{{ "hello world" | title }}
{# Hello World #}
```

#### trim
Recorta espaços em branco.

```twig
{{ " Hello World " | trim }}
{# Hello World #}
```

#### truncar
Retorna uma cópia truncada da string.

```twig
{{ "Grumpy wizards make toxic brew for the evil Queen and Jack." | truncate(30) }}
{# Grumpy wizards make toxic brew... #}
```

#### upper
Faça a string em maiúsculas.

```twig
{{ 'hello world' | upper }}
```

#### urlencode
Faz o URL amigável (utiliza codificação UTF-8).

```twig
{{ 'http://foo.com?bar=baz' | urlencode }}
```

#### contagem de palavras
Contar palavras em uma string.

```twig
{{ 'Grumpy wizards make toxic brew' | wordcount }}
```

#### float
Converte o valor para um valor flutuante.

```twig
{{ '1.2' | float }}
```

#### int
Converte o valor para um inteiro.

```twig
{{ '1.2' | int }}
```
