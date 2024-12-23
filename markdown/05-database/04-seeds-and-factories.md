# Seeds And Factories

As link:migrations[Migrations] helps you in automating the process of setting up database schema. Database *Seeds & Factories* helps in seeding the database with dummy data. Dummy data can be used while running tests or setting up the initial state of an application.

## About Seeds

1. Seeds are stored inside `database/seeds` directory.
2. Each seed file is an *ES2015* class and must have a `run` method.
3. A single seed file can be used to add the dummy for multiple database tables.
4. Make use of `db:seed` command to execute all the seed files from the `database/seeds` directory.

## About Factories
[pretty-list]
1. Factories helps you in defining model blueprints using fake data.
2. Each blueprint *callback* receives an instance of [chancejs](http://chancejs.com) to generate random/fake data.
3. Factories can be used inside the seed file using the `use('Factory')` provider.
4. You can also use factories when writing automated tests.

## Basic Example
Let's start with an example of using both *Factories* and *Seeds* to add dummy data to the `users` table.


```js
// database/factory.js

const Factory = use('Factory')

Factory.blueprint('App/Model/User', (fake) => {
  return {
    username: fake.username(),
    email: fake.email(),
    password: fake.password(),
    firstName: fake.first(),
    lastName: fake.last()
  }
})
```

```js
// database/seeds/Database.js

'use strict'

const Factory = use('Factory')

class DatabaseSeeder {
  * run () {
    yield Factory.model('App/Model/User').create(5)
  }
}

module.exports = DatabaseSeeder
```

```bash
# Running The Seed Command

./ace db:seed
```

We started by defining a blueprint for the `User` model inside `database/factory.js` file. Each blueprint method should return an object defining the fields to be inserted into the database table using the *Model create* method.

Since factories blueprints are defined once and used everywhere, we need to import the `Factory` provider inside the `database/seeds/Database.js` file and execute the `create` method passing the number of rows(5) to it.

## Factory Methods

### When Using Lucid
With lucid models, you can make use of the below methods to define and use blueprints in your application.

#### blueprint(modelNamespace, callback)

> NOTE: Make sure the corresponding model does exists.

```js
Factory.blueprint('App/Model/User', (fake) => {
  return {
    username: fake.username()
  }
})
```

#### create([rows=1])
The number of rows to create for a given model.

```js
const users = yield Factory.model('App/Model/User').create(5)
```

#### make([count=1])
The `make` method will return the instance of the model with fake data as the attributes. You can change the `count` to get an array of multiple instances.

```js
const User = use('App/Model/User') <1>
const user = yield User.find(1) <2>

const post = Factory.model('App/Model/Post').make() <3>
yield user.posts().create(post) <4>
```

1. Importing user model.
2. Find a single user using the id.
3. Creating an instance of `Post` model with dummy data.
4. Saving the post for a given user by using the relationship.

#### each(callback)
The `each` method helps you in running an asynchronous loop over created instances of a model. It is helpful when you want to save relationship for each created instance.

```js
const users = yield Factory.model('App/Model/User').create(5)

users.each(function * (user) {
  const post = Factory.model('App/Model/Post').make()
  yield user.posts().save(post);
})
```

#### reset
Truncate the table for a given model

```js
yield Factory.model('App/Model/User').reset()
```

### When Using Database Provider

#### blueprint(tableName, callback)

```js
Factory.blueprint('users', (fake) => {
  return {
    username: fake.username(),
    email: fake.email(),
    password: fake.password()
  }
})
```

#### create([rows=1])
The create methods works same as the xref:_create_rows_1[Lucid blueprint create method]

```js
yield Factory.get('users').create(5)
```

#### table(tableName)
The `table` method helps you in switching the table name for a given blueprint at runtime.

```js
yield Factory.get('users').table('my_users').create(5)
```

#### returning(column)
Defining returning column for *PostgreSQL*.

```js
yield Factory.get('users').returning('id').create(5)
```

#### reset
Truncate database table.

```js
yield Factory.get('users').reset()
```

## Generating Fake Data
The `fake` object passed to [Factory.blueprint](#factoryblueprintappmodeluser-fake--return-password-fakepassword) method is an instance of [chance.js](http://chancejs.com).

All methods from chancejs are supported by AdonisJs, whereas AdonisJs also adds a bunch of new methods on top of it.

#### username([length=5])
Returns a random username with the defined length.

```js
Factory.blueprint('App/Model/User', (fake) => {
  return {
    username: fake.username()
  }
})
```

#### password([length=20])
Returns a random password.

```js
Factory.blueprint('App/Model/User', (fake) => {
  return {
    password: fake.password()
  }
})
```

## Password Hashing
link:authentication[Authentication] provider makes use of link:encryption-and-hashing[Hash] provider when verifying the user password. Make sure you are hashing your passwords before saving them to the database.

The best place to hash the password is inside a Model `beforeCreate` hook. You can learn about hooks link:lucid-hooks[here].

```bash
# Generating A Hook

./ace make:hook User
```

```js
// Model/Hooks/User.js

'use strict'
const Hash = use('Hash')

const User = exports = module.exports = {}

User.encryptPassword = function * (next) {
  this.password = yield Hash.make(this.password)
  yield next
}
```

```js
// Registering Hook To The Model

'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.encryptPassword')
  }
}
```
