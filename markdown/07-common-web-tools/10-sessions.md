# Sessions

AdonisJs has out of the box support for saving long-lived sessions to a single request only sessions called *Flash Messages*. Also, you can choose between one of the available drivers to save the session data.

> NOTE: To keep your session cookie encrypted, make sure to define `APP_KEY` inside the *.env* file. Alternatively, you can make use of `./ace key:generate` command to generate the key for you.

## Drivers
Below is the list of available drivers.

1. Cookie (cookie).
2. File (file).
3. Redis (redis).

> NOTE: Make sure to setup [Redis provider](/markdown/07-common-web-tools/12-redis.md) before making use of the redis driver.

## Configuration

Take a look at the example config file link:https://github.com/adonisjs/adonis-app/blob/develop/config/session.js[example config file].

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

## Basic Example
Let's walk through a basic example of saving/reading cart items for a given user from the session.

```js
Route.get('carts', function * (request, response) {
  const cartItems = []
  yield request.session.put('cart-items', cartItems)
  yield response.send('Items added to cart successfully')
})
```

## Methods
Below is the list of available session methods.

#### put(key, value)
Add a value to the session store.

```js
Route.post('users', function * (request, response) {
  yield request.session.put('username', 'doe')
  // or
  yield request.session.put({ username: 'doe' })
})
```

#### get(key, [defaultValue])
Returns the value for a given key. It will return the *defaultValue* when actual value is `null` or `undefined`.

```js
Route.get('users/current', function * (request, response) {
  const username = yield request.session.get('username')
  // or
  const userId = yield request.session.get('userId', 123)
})
```

#### all
Returns all session values as an object

```js
const sessionValues = yield request.session.all()
```

#### forget(key)
Remove value for a given key

```js
yield request.session.forget('name')
```

#### pull(key, [defaultValue])
Get and remove the value for a given key. Think of it as calling [get](#getkey-defaultvalue) and [forget](#forgetkey) together.

```js
const username = yield request.session.pull('username')
```

## Flash Messages
Flash messages are used to set a short-lived session for a single request. It is helpful when you want to redirect the user back with the form errors and existing form values so that they won't have to re-type everything and only correct the errors.

Just make sure that `Flash` middleware is added to the list of global middleware.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/Flash'
  // ...
]
```

### Basic Usage Of Flash Messages
Let's work on the flow of flashing validation errors with the form input and see how we can catch them inside our view.

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

1. The `withAll` method will add all the request values to the flash session store.
2. The `andWith` method is a helper to flash custom data objects. Here we use it for flashing the validation errors.

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

1. `old` method inside the views is used to fetch values for a given key from the flash messages.

### Flash Methods
Below is the list of methods to set flash messages.

#### withAll
Will flash everything from `request.all()`.

```js
yield request.withAll().flash()
```

#### withOnly(keys...)
Flash values only for defined keys.

```js
yield request.withOnly('email').flash()
```

#### withOut(keys...)
Flash all except defined keys.

```js
yield request.withOut('password').flash()
```

#### with(values)
Flash a custom object.

```js
yield request.with({ error: 'Please fill in all details' }).flash()
```

#### andWith(values)
Chainable method to send custom object with request data.

```js
yield request
  .withAll()
  .andWith({ error: 'Please fill in all details' })
  .flash()
```

### Accessing Flash Values
You can access the values of flash messages inside your views using the defined helpers. If there's nothing in the flash message at the requested key it will display the defaultValue.

#### old(key, defaultValue)
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
