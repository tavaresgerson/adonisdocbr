---
permalink: ioc-container
title: IoC Container
---

# IoC Container

## Introduction
Before understanding the **Inversion of Control (IoC)** container usage and benefits, we need to step back and understand the dependency management issues faced by large codebases.

### Useless abstractions
Quite often you run into a situation where you have to create useless abstractions for a library to manage its lifecycle.

For example, to make sure the database is only connected once, you might move all database setup code into its own file (e.g. `lib/database.js`) and then `require` it everywhere inside your application:

```js
// .lib/database.js

const knex = require('knex')

const connection = knex({
  client: 'mysql',
  connection: {}
})

module.exports = connection
```

Now, instead of requiring `knex` directly, you can require `lib/database.js` wherever it is needed.

This is fine for a single dependency, but as the application grows, you'll find a number of these files growing inside your codebase, which is not ideal.

### Dependency management
One of the biggest problems large codebases suffer is the management of dependencies.

Since dependencies don't know about each other, the developer has to wire them together somehow.

Let's take the example of *sessions* stored in a *redis* database:

```js
class Session {
  constructor (redis) {
    // needs Redis instance
  }
}

class Redis {
  constructor (config) {
    // needs Config instance
  }
}

class Config {
  constructor (configDirectory) {
    // needs config directory path
  }
}
```

As you can see, the `Session` class is dependant on the `Redis` class, the `Redis` class is dependant on the `Config` class, and so on.

When using the `Session` class, we have to build its dependencies correctly:

```js
const config = new Config(configDirectory)
const redis = new Redis(config)
const session = new Session(redis)
```

As the dependency list may increase based on the requirements of the project, you can quickly imagine how this sequential instantiation process could begin to spin out of control!

This is where the IoC container comes to the rescue, taking the responsibility of resolving your dependencies for you.

### Painful testing
When not using an IoC container, you have to come up with different ways to mock dependencies, or rely on libraries like [sinonjs](http://sinonjs.org/).

When using the IoC container, it is simple to link:testing-fakes#_self_implementing_fakes[create fakes], since all dependencies are resolved from the IoC container and not the file-system directly.

## Binding dependencies
Let's say we want to bind the `Redis` library inside the IoC container, making sure it knows how to compose itself.

NOTE: There is no secret sauce to the IoC container. It is a relatively simple idea that controls the composition and resolution of modules, opening up a whole new world of possibilities.

The first step is to create the actual `Redis` implementation and define all dependencies as `constructor` parameters:

```js
class Redis {
  constructor (Config) {
    const redisConfig = Config.get('redis')
    // connect to redis server
  }
}

module.exports = Redis
```

Note that `Config` is a constructor dependency and not a hardcoded `require` statement.

Next, let's bind our `Redis` class to the IoC container as `My/Redis`:

```js
const { ioc } = require('@adonisjs/fold')
const Redis = require('./Redis')

ioc.bind('My/Redis', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new Redis(Config)
})
```

We can then use our `My/Redis` binding like so:

```js
const redis = ioc.use('My/Redis')
```

1. The `ioc.bind` method takes two parameters: +
   - The name of the binding (e.g. `My/Redis`)
   - A *factory* function executed every time you access the binding, returning the final value for the binding
2. Since we're using the IoC container, we pull any existing bindings (e.g. `Config`) and pass it to the `Redis` class.
3. Finally, we return a new instance of `Redis`, configured and ready for use.

### Singletons
There's a problem with the `My/Redis` binding we just created.

Each time we fetch it from the IoC container it returns a new `Redis` instance, in turn creating a new connection to the Redis server.

To overcome this problem, the IoC container lets you define **singletons**:

```js
ioc.singleton('My/Redis', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new Redis(Config)
})
```

Instead of using `ioc.bind`, we use `ioc.singleton` instead which caches its first return value and re-uses it for future returns.

## Resolving dependencies
Simply call the `ioc.use` method and give it a namespace to resolve:

```js
const redis = ioc.use('My/Redis')
```

The global `use` method can also be used:

```js
const redis = use('My/Redis')
```

The steps performed when resolving a dependency from the IoC container are:

1. Look for a registered fake.
2. Next, find the actual binding.
3. Look for an alias, and if found, repeat the process using the actual binding name.
4. Resolve as an autoloaded path.
5. Fallback to the Node.js native `require` method.

### Aliases
Since IoC container bindings must be unique, we use the following pattern for binding names: `Project/Scope/Module`.

Breaking it down, using `Adonis/Src/Config` as an example:

- `Adonis` is the **Project** name (could be your company name instead)
- `Src` is the **Scope**, since this binding is part of the core (for 1st party packages, we use the `Addon` keyword)
- `Config` is the actual **Module** name

As it's sometimes difficult to remember and type full namespaces, the IoC container allows you to define *aliases* for them.

Aliases are defined inside the `start/app.js` file's `aliases` object.

> NOTE: AdonisJs pre-registers aliases for inbuilt modules like `Route`, `View`, `Model` and so on. However, you can always override them as shown below.

```js
// .start/app.js

aliases: {
  MyRoute: 'Adonis/Src/Route'
}
```

```js
const Route = use('MyRoute')
```

### Autoloading
Instead of only binding dependencies to the IoC container, you can also define a directory to be autoloaded by the IoC container.

*Don't worry*, it does not load all the files from the directory, but instead considers the directory paths as part of the dependency resolution process.

For example, the `app` directory of AdonisJs is autoloaded under the `App` namespace, which means you can require all files from the `app` directory without typing relative paths.

For example:

```js
// .app/Services/Foo.js

class FooService {
}

module.exports = FooService
```

Can be required as:

```js
// .app/Controllers/Http/UserController.js

const Foo = use('App/Services/Foo')
```

Without autloading, it would have to be required as `require('../../Services/Foo')`.

So think of autoloading as a more readable and consistent way to require files.

Also, you can easily define [fakes](/original/markdown/10-testing/05-Fakes.md) for them too.

## FAQ's

1. *Do I have to bind everything inside the IoC container?*
  No. IoC container bindings should only be used when you want to abstract the setup of a library/module to its own thing. Also, consider using [service providers](/original/markdown/02-Concept/03-service-providers.md) when you want to distribute dependencies and want them to play nice with the AdonisJs ecosystem.

1. *How do I mock bindings?*
  There's no need to mock bindings since AdonisJs allows you to implement *fakes*. Learn more about fakes [here](/original/markdown/10-testing/05-Fakes.md).

1. *How do I wrap an npm module as a service provider?*
  [Here's](/original/markdown/02-Concept/03-service-providers.md) the complete guide for that.
