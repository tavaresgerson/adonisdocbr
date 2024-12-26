---
title: Traits
category: lucid-orm
---

# Traits

*Traits* make it possible to add functionality to models *from the outside in*.

Using model traits, you can:

1. Add new methods to your model class.
2. Listen for model [hooks](/original/markdown/08-Lucid-ORM/02-Hooks.md).
3. Add methods to the [Query Builder](/original/markdown/08-Lucid-ORM/01-Getting-Started.md#query-builder) instance for a given model.

## Creating a Trait
Traits are stored in the `app/Models/Traits` directory.

Use the `make:trait` command to generate a trait file:

```bash
adonis make:trait Slugify
```

```bash
# Output

✔ create  app/Models/Traits/Slugify.js
```

Traits require a `register` method receiving the `Model` class and an `customOptions` object as its parameters:

```js
// .app/Models/Traits/Slugify.js

'use strict'

class Slugify {
  register (Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)
  }
}

module.exports = Slugify
```

## Registering a Trait
Add a trait to a Lucid model like so:

```js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Slugify')
  }
}
```

## Registering a Trait with Options
If required, you can pass initialization options when adding a trait:

```js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Slugify', {useCamelCase: true})
  }
}
```

The options you pass will be forwarded to the trait's `register()` method.

When passing options, it's recommended you define *default trait options* like so:

```js
// .app/Models/Traits/Slugify.js

const _ = require('lodash')

class Slugify {

  register (Model, customOptions) {
    const defaultOptions = {useCamelCase: false}
    const options = _.extend({}, defaultOptions, customOptions)
  }
}

module.exports = Slugify
```

## Extending Model Methods
Use traits to add static and instance model methods:

```js
// .app/Models/Traits/Slugify.js

class Slugify {

  register (Model, options) {
    // Add a static method
    Model.newAdminUser = function () {
      let m = new Model()
      m.isAdmin = true
      return m
    }

    // Add an instance method
    Model.prototype.printUsername = function () {
      console.log(this.username)
    }
  }
}

module.exports = Slugify
```

## Adding Model Hooks
Use traits to [hook](/original/markdown/08-Lucid-ORM/02-Hooks.md) into database lifecycle events:

```js
class Slugify {

  register (Model, options) {
    Model.addHook('beforeCreate', function (modelInstance) {
      // create slug
    })
  }
}

module.exports = Slugify
```

## Extending Query Builder
Use traits to add macros to a model's [Query Builder](/original/markdown/08-Lucid-ORM/01-Getting-Started.md#query-builder):

```js
class Slugify {

  register (Model, options) {
    Model.queryMacro('whereSlug', function (value) {
      this.where('slug', value)
      return this
    })
  }
}

module.exports = Slugify
```


```
// Usage

await User.query().whereSlug('some value')
```
