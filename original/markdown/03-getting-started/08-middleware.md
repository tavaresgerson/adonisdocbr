# Middleware

HTTP Middleware is a layer of methods executed before your Routes actions. They have more than a single use case. For example:

The *body parser* middleware is responsible for parsing the request body. Whereas the *Auth* middleware is used to authenticate the requests and throw *401 Exception* if the user is not authenticated.

Middleware can:

1. Decorate request object and add values to it.
2. Respond to a given request, without reaching your route action.
3. Or to deny requests by throwing errors.

## Global Middleware
Global middleware is defined inside `app/Http/kernel.js` file as an array and get executed on every request in the sequence they are registered.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/Cors',
  'Adonis/Src/BodyParser',
  // ...
]
```

## Named Middleware
Named middleware on the other hand are registered with a unique name and you are required to assign them manually on routes. For example: The `auth` middleware is used to protect routes from *unauthenticated* users.

```js
// app/Http/kernel.js

const namedMiddleware = {
  // ...
  auth: 'Adonis/Middleware/Auth'
  // ...
}
```

```js
// Usage

Route
  .get('accounts/:id', 'AccountsController.show')
  .middleware('auth')

// or

Route.group('auth-routes', () => {
  Route.get('accounts/:id', 'AccountsController.show')
}).middleware('auth')
```

## Creating A Middleware
Application middleware lives inside the `app/Http/Middleware` directory. Each middleware is a single dedicated *ES2015 Class* with a mandatory `handle` method.

Let's make use of ace to create a middleware.

```bash
./ace make:middleware CountryDetector

# create: app/Http/Middleware/CountryDetector.js
```


```js
// app/Http/Middleware/CountryDetector.js

'use strict'

class CountryDetector {

  * handle (request, response, next) {
    yield next
  }

}
```

1. The `handle` method is an ES2015 generator.
2. Similar to your controller methods, it also receives link:request[request] and link:response[response] instances with an additional parameter `next`.
3. Make sure to call `yield next` when you want your middleware to pass the request to the next middleware or route action.
4. Also, you can end the request with the help of the `response` instance.

Now let's build upon our *CountryDetector* middleware to detect the visitor country based upon their IP address.

```js
// app/Http/Middleware/CountryDetector.js

'use strict'

const geoip = use('geoip-lite') // npm module

class CountryDetector {

  * handle (request, response, next) {
    const ip = request.ip()
    request.country = geoip.lookup(ip).country
    yield next
  }

}
```

Next, we need to register this as a *global or named* middleware based upon the nature of the application. Let's register it as a global middleware for now.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'App/Http/Middleware/CountryDetector'
  // ...
]
```

Congratulations! Now all Http requests will have the `country` property since we are decorating the `request` instance.
