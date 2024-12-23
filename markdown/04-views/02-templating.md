# Nunjucks Templates

This is a reference guide for AdonisJs template engine, covering topics on available *tags*, *filters*, and *methods* to be used inside your views. Read the link:views[views guide] to understanding how views work in AdonisJs.

## Tags
Tags are blocks which define logic operations inside your views. Below is the list of available tags and their usages.

### if
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

You can also perform comparison via `==`.

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

#### If As An Expression

```twig
{{ 'Party' if weekend else 'Do some work' }}
```

#### for/asyncEach
The `for` loop iterates over both arrays and objects.

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

### asyncAll
The `asyncAll` tag will run an asynchronous loop in parallel. It is helpful when you perform an async operation within a loop.

> NOTE: Below is an example of fetching user profile inside a loop, which will cause multiple database queries. It is recommended to *eagerLoad* relationships using Lucid.

```twig
<ul>
{% asyncAll user in users.toJSON() %}
  <li>{{ user.id | fetchProfile }}</li>
{% endall %}
</ul>
```

#### set
`set` creates a temporary variable inside your views. Think of it as `var` inside Javascript.

```twig
{% set username = "John" %}
{{ username }}
```

Also, you can define multiple keys and their value at once.

```twig
{% set x, y, z = 5 %}
```

#### yield
Execute an *ES2015 Generator* or a *Promise* inside your views.

```twig
{% yield users = User.all() %}
{{ users | json }}
```

#### raw
When building Front-End agnostic web apps, you are likely going to make use of *VueJs*, *AngularJs* or any similar framework. To stop your views from parsing your front-end templates, you should make use of `raw` tag.

```twig
{% raw %}
  <p>{{ message }}</p>
  <input v-model="message">
{% endraw %}
```

#### filter
Instead of using filters with a *pipe (|)* symbol, you can also make use of filters as a tag.

```twig
{% filter title %}
  may the force be with you
{% endfilter %}
```

```html
<!-- Output -->

May The Force Be With You
```

#### call/caller
A `call` makes it easier to pass a lot of markup to your macros. A macro can access the passed content as `caller`.

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

Now let's use the *modal* macro.

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
<!-- Output -->

<div class="modal fade">
  <div class="modal-dialog">
    <div class="modal-header"></div>
    <div class="modal-body"></div>
    <div class="modal-footer"></div>
  </div>
</div>
```

## Comments
```twig
{# This is a comment #}
```

## Whitespace Control
Template engine will render all the white spaces between your tags. Use the following way if you want to remove all the white between the start and end of the tag.

```twig
{% for i in [1,2,3,4,5] -%}
  {{ i }}
{%- endfor %}
```

`-` symbol defines the whitespace control direction. Placing it on *left* will trim the whitespace from the left and setting it to the *right* will have the desired effect.

## Expressions
All given expressions are supported.

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

## Mathematical Operators
Below is the list of supported mathematical operators.

* Addition: `+`
* Subtraction: `-`
* Division: `/`
* Division and integer truncation: `//`
* Division remainder: `%`
* Multiplication: `*`
* Power: `**`

```twig
<!-- Usage -->

{{ 10 + 2 }} {# 12 #}
{{ 10 / 2 }} {# 5 #}
{{ 10 % 2 }} {# 0 #}
```

## Comparison Operators
Below is the list of supported comparison operators.

- Equals to `==`
- Not equals to `!=`
- Greater than `>`
- Greater than equals to `>=`
- Less than `<`
- Less than equals to `<=`

```twig
<!-- Usage -->

{% if numUsers < 5 %}...{% endif %}
{% if i == 0 %}...{% endif %}
```

## Logical Operators Shorthand
Below is the list of supported shorthand logical operators.

#### and
```twig
{% if isLimit and count > limit %}
  You have crossed the limit of {{ limit }} users.
{% endif %}
```

#### or
```twig
{% if isAdmin or hasPermission %}
  Welcome!
{% endif %}
```

#### not
```twig
{% if not isAdmin %}
  You are not allowed to access this record.
{% endif %}
```

> TIP: Make use of *parentheses* in order to group expressions. `if (x < 5 or y < 5) and foo`

## Auto Escaping
All values are auto escaped inside your views to keep them safe from HTML injection and XSS attacks. However, your application may have requirements of injecting HTML snippets inside your views and in that case you should make use of `safe` filter.

```twig
<!-- Without Filter -->

{% set title = '<h1> Title </h1>' %}
{{ title }}

{# output &lt;h1&gt; Title &lt;/h1&gt; #}
```

```twig
<!-- With Filter -->

{% set title = '<h1> Title </h1>' %}
{{ title | safe }}

{# output <h1> Title </h1> #}
```

## Globals
Here we talk about predefined globals registered by the framework. Check out link:views#_working_with_globals[Working with globals] to know more about defining custom views globals.

#### linkTo(route, text, data, target)
Returns link to a given registered route

```js
// Route

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
<!-- Output -->

<a href="/users"> View Profile </a>
<a href="/users" target="_blank"> View Profile </a>
```

#### linkToAction(controllerAction, text, data, target)
Returns link to registered route controller action.

```twig
{{ linkToAction('UserController.index', 'View All Users') }}
{{ linkToAction('UserController.index', 'View All Users', {}, '_blank') }}
```

```html
<!-- Output -->

<a href="/users"> View Profile </a>
<a href="/users" target="_blank"> View Profile </a>
```

#### range(start, stop, [step=1])
Loop over a range of values. Think of it as calling a `for` loop.

```twig
{% for i in range(0, 5) -%}
  {{ i }},
{%- endfor %}
```

```js
// Output

0,1,2,3,4
```

## Filters
Below is the list of all the available filters. Check out link:views#_working_with_filters[Working with filters] to learn more about defining filters.

#### age
```twig
{{ age | abs }}
```

#### action
Returns URL for registered controller action.

```js
// Route

Route.put('/user/:id', 'UserController.update')
```

```twig
<!-- View -->

<form method="POST" action="{{ 'UserController.update' | action({id: 1}) }}">
</form>
```

```html
<!-- Output -->

<form method="POST" action="/user/1"></form>
```

#### batch
Creates multiple chunks of an array. It is helpful when printing HTML grid.

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

#### default
```twig
{{ title | default('Adonis') }}
```

#### first
Returns first item from an array.

```twig
{{ ['foo','bar'] | first }}
```

#### groupby
```twig
{% set users = [{username:'doe', age:22}, {username:'dim', age:22}, {username:'dock', age:21}] %}
{{ users | groupby('age') | json }}
```

#### indent(width=2, firstLine=false)
Indent each line of string with given spaces.

```twig
{{ text | indent(2, true) }}
```

#### join
```twig
{{ ['hello', 'world'] | join(' ') }}
```

#### json(indentation=2)
```twig
{{ users | json }}
{{ users | json(4) }}
```

#### last
Returns last item from an array.

```twig
{{ ['foo','bar'] | last }}
```

#### length
Returns length of the array.

```twig
{{ ['foo','bar'] | length }}
```

#### list
Converts an array into a list, think of it as a replacement to `join`, but it also works with strings inside the array.

```twig
{{ ['foo','bar'] | list }}
```

#### lower
Converts value to lowercase

```twig
{{ "Hello World" | lower }}
{# hello world #}
```

#### random
Returns random item from an array

```twig
{{ ['foo', 'bar', 'baz'] | random }}
```

#### rejectattr
Filters an array and remove objects containing defined attributes

```twig
{% set users = [{username: 'doe', admin: false}, {username: 'doe', admin: true}] %}
{{ users | rejectattr('admin') | json }}
```

#### replace
Implementation of javascript native `replace` method, the first argument can be a regex.

```twig
{{ 'Hello World' | replace('World', 'Everyone') }}
{# Hello Everyone #}
```

#### reverse
```twig
{{ 'Hello World' | reverse }}
```

#### round
Round the number to a given precision using defined method

```twig
{{ 42.55 | round }}
{# 43.0 #}

{{ 42.55 | round(1, 'floor') }}
{# 42.5 #}
```

#### route
Resolves a registered route.

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
Strip *Html*, *XML* tags from a string

```twig
{{ '<h2> Hello World </h2>' | striptags }}
{# Hello World #}
```

#### title
```twig
{{ "hello world" | title }}
{# Hello World #}
```

#### trim
Trims white space.

```twig
{{ " Hello World " | trim }}
{# Hello World #}
```

#### truncate
Returns a truncated copy of the string.

```twig
{{ "Grumpy wizards make toxic brew for the evil Queen and Jack." | truncate(30) }}
{# Grumpy wizards make toxic brew... #}
```

#### upper
Makes string uppercase.

```twig
{{ 'hello world' | upper }}
```

#### urlencode
Makes value URL friendly (uses UTF-8 encoding).

```twig
{{ 'http://foo.com?bar=baz' | urlencode }}
```

#### wordcount
Count words in a string.

```twig
{{ 'Grumpy wizards make toxic brew' | wordcount }}
```

#### float
Converts value to a float value.

```twig
{{ '1.2' | float }}
```

#### int
Converts value to an integer value.

```twig
{{ '1.2' | int }}
```
