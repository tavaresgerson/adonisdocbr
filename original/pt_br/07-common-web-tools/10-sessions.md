# Sessões

O AdonisJs tem suporte pronto para uso para salvar sessões de longa duração em uma única sessão de solicitação chamada *Flash Messages*. Além disso, você pode escolher entre um dos drivers disponíveis para salvar os dados da sessão.

> OBSERVAÇÃO: Para manter seu cookie de sessão criptografado, certifique-se de definir `APP_KEY` dentro do arquivo *.env*. Como alternativa, você pode usar o comando `./ace key:generate` para gerar a chave para você.

## Drivers
Abaixo está a lista de drivers disponíveis.

1. Cookie (cookie).
2. Arquivo (file).
3. Redis (redis).

> OBSERVAÇÃO: Certifique-se de configurar o [provedor Redis](/markdown/07-common-web-tools/12-redis.md) antes de usar o driver redis.

## Configuração

Dê uma olhada no link do arquivo de configuração de exemplo: https://github.com/adonisjs/adonis-app/blob/develop/config/session.js[arquivo de configuração de exemplo].

```js
const Env = use('Env')

module.exports = {
  // available options are file, cookie, redis
  driver: Env.get('SESSION_DRIVER', 'cookie'),
  // configuration settings for whichever driver you choose
  redis: Env.get('REDIS_URL', 'redis://localhost:6379'),
  cookie: 'adonis-session',
  file: {
    directory: 'sessions'
  }
  // other settings
  age: 120,
  clearWithBrowser: false,
  httpOnly: true,
  sameSite: true,
  domain: null,
  path: '/',
  secure: false,

}
```

## Exemplo básico
Vamos percorrer um exemplo básico de salvar/ler itens do carrinho para um determinado usuário da sessão.

```js
Route.get('carts', function * (request, response) {
  const cartItems = []
  yield request.session.put('cart-items', cartItems)
  yield response.send('Items added to cart successfully')
})
```

## Métodos
Abaixo está a lista de métodos de sessão disponíveis.

#### put(key, value)
Adicione um valor ao armazenamento da sessão.

```js
Route.post('users', function * (request, response) {
  yield request.session.put('username', 'doe')
  // or
  yield request.session.put({ username: 'doe' })
})
```

#### get(key, [defaultValue])
Retorna o valor para uma determinada chave. Ele retornará o *defaultValue* quando o valor real for `null` ou `undefined`.

```js
Route.get('users/current', function * (request, response) {
  const username = yield request.session.get('username')
  // or
  const userId = yield request.session.get('userId', 123)
})
```

#### all
Retorna todos os valores da sessão como um objeto

```js
const sessionValues = yield request.session.all()
```

#### forget(key)
Remove o valor de uma determinada chave

```js
yield request.session.forget('name')
```

#### pull(key, [defaultValue])
Obtém e remove o valor de uma determinada chave. Pense nisso como chamar [get](#getkey-defaultvalue) e [forget](#forgetkey) juntos.

```js
const username = yield request.session.pull('username')
```

## Mensagens Flash
Mensagens Flash são usadas para definir uma sessão de curta duração para uma única solicitação. É útil quando você deseja redirecionar o usuário de volta com os erros do formulário e valores existentes do formulário para que ele não precise digitar tudo novamente e apenas corrigir os erros.

Apenas certifique-se de que o middleware `Flash` seja adicionado à lista de middleware global.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/Flash'
  // ...
]
```

### Uso básico de mensagens Flash
Vamos trabalhar no fluxo de erros de validação de flash com a entrada do formulário e ver como podemos capturá-los dentro da nossa visualização.

```js
// app/Http/routes.js

Route.on('users/create').render('users.create')
Route.post('users', 'UsersController.store')
```

```js
// app/Http/Controllers/UsersController.js

'use strict'

class UsersController {

  * store (request, response) {
    const validation = yield Validator.validate(request.all(), rules)
    if (validation.fails()) {
      yield request
        .withAll() <1>
        .andWith({errors: validation.messages()}) <2>
        .flash()
      response.redirect('back')
    }
  }

}
```

1. O método `withAll` adicionará todos os valores de solicitação ao armazenamento de sessão flash.
2. O método `andWith` é um auxiliar para flashear objetos de dados personalizados. Aqui, o usamos para flashear os erros de validação.

```twig
<!-- resources/views/users/create.njk -->

{% for error in old('errors') %} <1>
    <li> {{ error.message }} </li>
{% endfor %}

{{ form.open({action: 'UsersController.store'}) }}

  {{ form.text('email', old('email')) }}
  {{ form.password('password', old('password')) }}

  {{ form.submit('Create Account') }}

{{ form.close() }}
```

1. O método `old` dentro das visualizações é usado para buscar valores para uma determinada chave das mensagens flash.

### Métodos Flash
Abaixo está a lista de métodos para definir mensagens flash.

#### withAll
Irá piscar tudo de `request.all()`.

```js
yield request.withAll().flash()
```

#### withOnly(keys...)
Piscará valores somente para chaves definidas.

```js
yield request.withOnly('email').flash()
```

#### withOut(keys...)
Piscará tudo, exceto chaves definidas.

```js
yield request.withOut('password').flash()
```

#### with(values)
Piscará um objeto personalizado.

```js
yield request.with({ error: 'Please fill in all details' }).flash()
```

#### andWith(values)
Método encadeável para enviar objeto personalizado com dados de solicitação.

```js
yield request
  .withAll()
  .andWith({ error: 'Please fill in all details' })
  .flash()
```

### Acessando valores Flash
Você pode acessar os valores de mensagens flash dentro de suas visualizações usando os auxiliares definidos. Se não houver nada na mensagem flash na chave solicitada, ela exibirá o defaultValue.

#### old(chave, valorpadrão)
```twig
{{ old('username', user.username) }}
{# or #}
{{ old('profile.username') }}
```

#### flashMessages
```twig
{% for key, message in flashMessages %}
  {{ message }}
{% endfor %}
```
