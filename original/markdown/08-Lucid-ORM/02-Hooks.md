---
title: Hooks
category: lucid-orm
---

# Hooks

*Hooks* are actions performed before or after database [lifecycle events](/original/markdown/02-Concept/01-Request-Lifecycle.md).

Using model hooks helps keep your codebase [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), providing convenient lifecycle code injection from wherever your hooks are defined.

A classic hook example is [hashing](/original/markdown/05-Security/06-Encryption.md#hashing-values) the user password before saving the user to a database.

## Defining Hooks
Hooks can be defined in a model class file via a closure, or by referencing any `file.method` handler in the `app/Models/Hooks` directory.

### Binding Closure
```js
const Model = use('Model')
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (userInstance) => {
      userInstance.password = await Hash.make(userInstance.password)
    })
  }
}

module.exports = User
```

### Hook Within Transactions
To use hooks within [transactions](/original/markdown/08-Lucid-ORM/01-Getting-Started.md#transactions) just add second param `trx` into hook closure

```js
const Model = use('Model')
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (userInstance, trx) => {
      // here you can use transaction object `trx`
    })
  }
}

module.exports = User
```

In the example above, the `beforeCreate` closure is executed when creating a `User` model to ensure the user's password is hashed before it's saved.

### Hook File
AdonisJs has a dedicated `app/Models/Hooks` directory to store model hooks.

Use the `make:hook` command to create a hook file:

```bash
adonis make:hook User
```

```bash
# .Output

✔ create  app/Models/Hooks/UserHook.js
```

Open the new `UserHook.js` file and paste in the code below:

```js
// .app/Models/Hooks/UserHook.js

'use strict'

const Hash = use('Hash')

const UserHook = exports = module.exports = {}

UserHook.hashPassword = async (user) => {
  user.password = await Hash.make(user.password)
}
```

With a hook `file.method` defined, we can remove the inline closure from our [previous example](#binding-closure) and instead reference the hook file and method like so:

```js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'UserHook.hashPassword')
  }
}

module.exports = User
```

## Aborting Database Operations
Hooks can abort database operations by throwing exceptions:

```js
// .app/Models/Hooks/UserHook.js

UserHook.validate = async (user) => {
  if (!user.username) {
    throw new Error('Username is required')
  }
}
```

## Lifecycle Events
Below is the list of available database lifecycle events to hook into:

| Event           | Description                                         |
|-----------------|-----------------------------------------------------|
| `beforeCreate`  | Before creating a new record.                       |
| `afterCreate`   | After a new record is created.                      |
| `beforeUpdate`  | Before updating a record.                           |
| `afterUpdate`   | After a record has been updated.                    |
| `beforeSave`    | Before *creating or updating* a new record.         |
| `afterSave`     | After a new record has been *created or updated*.   |
| `beforeDelete`  | Before removing a record.                           |
| `afterDelete`   | After a record is removed.                          |
| `afterFind`     | After a single record is fetched from the database. |
| `afterFetch`    | After the `fetch` method is executed. The hook method receives an array of model instances. |
| `afterPaginate` | After the `paginate` method is executed. The hook method receives two arguments: an array of model instances and the pagination metadata. |
