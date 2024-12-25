---
title: Extending the Core
category: digging-deeper
---

# Extending the Core

AdonisJs is fully extendible to the core.

In this guide, we learn how to extend parts of the framework.

## Where to Write Code
The easiest way to get started is to use [applications hooks](/original/markdown/02-Concept/05-ignitor.md#hooks), and only later move code inside a provider if you want to share your code as a package.

Hooks live inside the `start/hooks.js` file and can be used to execute code at a specific time in the application lifecycle:

```js
// .start/hooks.js

const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  // execute your code
})
```

> NOTE: Hook callbacks are synchronous. You must create a provider and use the `boot` method to write asynchronous code.

Providers live inside the `providers` directory in the project root:

```bash
├── providers
  ├── AppProvider.js
```

Your providers must be registered inside the `start/app.js` file:

```js
// .start/app.js

const path = require('path')

const providers = [
  path.join(__dirname, '..', 'providers/AppProvider')
]
```

Providers are generally used to add functionality to your application by binding namespaces to the IoC container, however you can also use providers to run custom code when booted:

```js
const { ServiceProvider } = require('@adonisjs/fold')

class AppProvider extends ServiceProvider {
  async boot () {
    // execute code
  }
}
```

## Adding Macros/Getters
Macros let you add methods to existing classes.

A class must extend the [Macroable](https://www.npmjs.com/package/macroable) class to be extended via macros.

> TIP: Use [hooks](/original/markdown/02-Concept/05-ignitor.md#hooks) or a provider's `boot` method to add macros.

For example, if a macro was defined like so:

```js
const Response = use('Adonis/Src/Response')
const Request = use('Adonis/Src/Request')

Response.macro('sendStatus', function (status) {
  this.status(status).send(status)
})
```

It could then be used as follows:

```js
Route.get('/', ({ response }) => {
  response.sendStatus(200)
})
```

In the same way, you can also add `getters` to your macroable classes:

```js
Request.getter('time', function () {
  return new Date().getTime()
})

// Or add a singleton getter
Request.getter('id', function () {
  return uuid.v4()
}, true)
```

Below is the list of classes you can add getters/macros to:

1. [Adonis/Src/HttpContext](https://github.com/adonisjs/adonis-framework/blob/develop/src/Context/index.js)
2. [Adonis/Src/Request](https://github.com/adonisjs/adonis-framework/blob/develop/src/Request/index.js)
3. [Adonis/Src/Response](https://github.com/adonisjs/adonis-framework/blob/develop/src/Response/index.js)
4. [Adonis/Src/Route](https://github.com/adonisjs/adonis-framework/blob/develop/src/Route/index.js)

## Extending Providers
Some existing providers let you extend them by adding new functionality.

For example, the **Session Provider** allows new drivers to be added, while the **Auth Provider** allows new serializers and schemes.

> NOTE: Refer to the documentation of individual providers to understand their extending capabilities.

To keep the extend interface unified and simple, use the `Ioc.extend` method to add new drivers or serializers:

```js
const { ioc } = require('@adonisjs/fold')
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  ioc.extend('Adonis/Src/Session', 'mongo', function () {
    return class MongoDriver {
    }
  })
})
```

If you are developing a provider and want to use the same interface for exposing extending capabilities, make sure to bind a `Manager` object as follows:

```js
const { ServiceProvider } = require('@adonisjs/fold')

class MyProvider extends ServiceProvider {
  register () {
    this.app.manager('MyApp/Provider', {
      extend: function () {
      }
    })
  }
}
```

1. The manager object must have an `extend` method. The values passed to `ioc.extend` will be forwarded to this method.
2. The `namespace` must be same as the binding namespace.
3. You must manage the registration/lifecycle of your drivers.
