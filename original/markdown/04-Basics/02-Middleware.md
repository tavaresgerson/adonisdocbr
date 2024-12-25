---
title: Middleware
category: basics
---

# Middleware

Middleware hook into the request lifecycle of your application.

They are a set of functions executed in sequence and let you transform the request and/or the response.

As an example, AdonisJs provides an `auth` middleware that verifies if the user of your application is authenticated. If the user is not authenticated an exception will be thrown and the request will never reach your route handler.

## Creating Middleware

To create a new middleware, use the `make:middleware` command:

```bash
adonis make:middleware CountryDetector
```

This command will create a file in the `app/Middleware` folder with some boilerplate code.

In our example `CountryDetector` middleware, we want to detect the country of the user from their ip address:

```js
// .app/Middleware/CountryDetector.js

'use strict'

const geoip = require('geoip-lite')

class CountryDetector {
  async handle ({ request }, next) {
    const ip = request.ip()
    request.country = geoip.lookup(ip).country
    await next()
  }
}

module.exports = CountryDetector
```

In this example, we are using the library `geoip-lite` and adding the country of the user inside the `request` object of the [HTTP Context](/original/markdown/02-Concept/01-Request-Lifecycle.md).

### Upstream & Downstream Middleware

When creating your middleware, you'll need to decide if it runs before or after the request hits your route handler.

This is done by defining the code before or after the middleware `handle` method's `await next()` call:

```js
// .app/Middleware/UpstreamExample.js

'use strict'

class UpstreamExample {
  async handle ({ request }, next) {
    // Code...
    await next()
  }
}

module.exports = UpstreamExample
```

To access the `response` object for downstream middleware, you'll need to unpack it from the passed [HTTP Context](/original/markdown/02-Concept/01-Request-Lifecycle.md):

```js
// .app/Middleware/DownstreamExample.js

'use strict'

class DownstreamExample {
  async handle ({ response }, next) {
    await next()
    // Code...
  }
}

module.exports = DownstreamExample
```

If you want, your middleware code can also run before **and** after the request hits your route handler:

```js
// .app/Middleware/BeforeAndAfterExample.js

'use strict'

class BeforeAndAfterExample {
  async handle ({ response }, next) {
    // Upstream code...
    await next()
    // Downstream code...
  }
}

module.exports = BeforeAndAfterExample
```

## Registering Middleware

All middleware is registered inside the `start/kernel.js` file.

Middleware is separated into 3 categories: **Server**, **Global** and **Named**.

### Server Middleware

Server middleware executes before the request reaches the AdonisJs routing system. This means if the requested route isn't registered, AdonisJs will still execute all middleware defined here:

```js
// .start/kernel.js

const serverMiddleware = [
  'Adonis/Middleware/Static',
  'Adonis/Middleware/Cors',
]
```

Server middleware is generally used to serve static assets or handle CORS.

### Global Middleware

Global middleware executes after the requested route has been found:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
]
```

Global middleware executes in the sequence they were defined, so you must be careful when one middleware requires another.

### Named Middleware

Named middleware are assigned to a specific route or route group:

```js
// .start/kernel.js

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
}
```

```js
// .start/routes.js

Route.get(url, closure).middleware(['auth'])
```

Named middleware executes in the sequence they were defined against their assigned route.

## Middleware Properties

AdonisJs uses the [pipe expression](https://www.npmjs.com/package/haye#pipe-expression) to define middleware properties.

For example, the `auth` middleware optionally accepts an authentication scheme as a middleware property:

```js
// .start/routes.js

// Use the Session Scheme for this route
Route.post(url, closure).middleware(['auth:session'])

// Use the JWT Scheme for this route
Route.post(url, closure).middleware(['auth:jwt'])
```

You can also pass multiple props by chaining them with a comma:

```js
// .start/routes.js

Route.post(url, closure).middleware(['auth:session,jwt'])
```

Those properties are available as the third argument in your middleware `handle` method:

```js
async handle (context, next, properties) {
  //
}
```
