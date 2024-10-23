# Sessões

O AdonisJs possui suporte de caixa único para salvar sessões de longa duração em apenas uma solicitação, chamadas de *Mensagens Flash*. Além disso, você pode escolher entre um dos drivers disponíveis para salvar os dados da sessão.

NOTE: Para manter o seu cookie de sessão criptografado, certifique-se de definir o `APP_KEY` dentro do arquivo *.env*. Alternativamente, você pode usar o comando `./ace key:generate` para gerar a chave para você.

## Drivers
Abaixo está a lista de drivers disponíveis.

1. Cookie (cookie).
2. Arquivo (arquivo).
3. Redis (redis).

> NOTE:
> Certifique-se de configurar o provedor Redis antes de usar o driver Redis.

## Configuração

Veja o exemplo de arquivo de configuração [arquivo de configuração de exemplo](https://github.com/adonisjs/adonis-app/blob/develop/config/session.js).

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
Vamos passar por um exemplo básico de salvar/ler itens do carrinho para um usuário específico da sessão.

```js
Route.get('carts', function * (request, response) {
  const cartItems = []
  yield request.session.put('cart-items', cartItems)
  yield response.send('Items added to cart successfully')
})
```

## Métodos
Abaixo está a lista dos métodos de sessão disponíveis.

#### put(chave, valor)
Adicione um valor ao armazenamento de sessão.

```js
Route.post('users', function * (request, response) {
  yield request.session.put('username', 'doe')
  // or
  yield request.session.put({ username: 'doe' })
})
```

#### get(chave, [valorPadrão])
Retorna o valor para uma chave dada. Ele retornará o *valor padrão* quando o valor real for `nulo` ou `indefinido`.

```js
Route.get('users/current', function * (request, response) {
  const username = yield request.session.get('username')
  // or
  const userId = yield request.session.get('userId', 123)
})
```

#### Tudo
Retorna todos os valores de sessão como um objeto

```js
const sessionValues = yield request.session.all()
```

#### Esqueça (chave)
Remove o valor de uma chave específica

```js
yield request.session.forget('name')
```

#### pull(chave, [valor padrão])
Obtenha e remova o valor de uma chave específica. Pense nisso como chamar xref:_get_key_defaultvalue[get] e xref:_forget_key[forget] juntos.

```js
const username = yield request.session.pull('username')
```

## Mensagens de Flash
As mensagens de flash são usadas para definir uma sessão de curta duração para um único pedido. É útil quando você deseja redirecionar o usuário de volta com os erros do formulário e os valores existentes do formulário, para que eles não tenham que re-digitar tudo e apenas corrigir os erros.

Apenas tenha a certeza de que o `Flash` middleware é adicionado à lista de middleware global.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/Flash'
  // ...
]
```

### Uso Básico de Mensagens Flash
Vamos trabalhar no fluxo de erros de validação de flash com a entrada do formulário e ver como podemos pegá-los dentro da nossa visão.

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

1. O método `withAll` adicionará todos os valores de solicitação à loja de sessão flash.
2. O método 'andWith' é um ajudante para exibir objetos de dados personalizados. Aqui, usamos isso para exibir os erros de validação.

```twig
{# resources/views/users/create.njk #}

{% for error in old('errors') %} <1>
    <li> {{ error.message }} </li>
{% endfor %}

{{ form.open({action: 'UsersController.store'}) }}

  {{ form.text('email', old('email')) }}
  {{ form.password('password', old('password')) }}

  {{ form.submit('Create Account') }}

{{ form.close() }}
```

1. O método 'old' dentro das views é usado para buscar valores de uma determinada chave dos flash messages.

### Métodos Flash
Abaixo está a lista de métodos para definir mensagens flash.

#### comTudo
Flashá tudo de `request.all()`.

```js
yield request.withAll().flash()
```

#### withOnly(keys...)
Valores de flash somente para chaves definidas.

```js
yield request.withOnly('email').flash()
```

#### withOut(keys...)
Flash todas as teclas, exceto as definidas.

```js
yield request.withOut('password').flash()
```

#### with(valores)
Flash um objeto personalizado.

```js
yield request.with({ error: 'Please fill in all details' }).flash()
```

#### andWith(valores)
Método encadeável para enviar objeto personalizado com dados da requisição.

```js
yield request
  .withAll()
  .andWith({ error: 'Please fill in all details' })
  .flash()
```

### Acessando os valores do flash
Você pode acessar os valores de mensagens flash dentro de seus modelos usando os auxiliares definidos. Se não houver nada na mensagem flash na chave solicitada, ele exibirá o defaultValue.

#### old(chave, valorPadrão)

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
