---
title: Migrations
category: database
---

# Migrations

Migrations are documented database mutations, created throughout your application's development lifecycle that you can roll back or re-run at any point in time.

Migrations make it easier to work as a team, enabling database schema changes from one developer to be easily tracked and then applied by other developers in your organization.

## Creating Migrations

> NOTE: To use migrations, the [Migrations Provider](/original/markdown/07-Database/03-Migrations.md) must first be registered inside the `start/app.js` file's `aceProviders` array.

Let's create a *users* table with the help of migrations.

First, call the `adonis make:migration` command to create a schema file:

```bash
adonis make:migration users
```

When prompted, choose the `Create table` option and press kbd:[Enter]:

```bash
# .Output

✔ create  database/migrations/1502691651527_users_schema.js
```

Your new schema file (prefixed with the current timestamp) is created in the `database/migrations` directory, ready to modify as required:

```js
// .database/migrations/...users_schema.js

'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
```

## Schema Files

A schema file requires two methods: `up` and `down`.

### `up()`

The `up` method is used to take action on a table. It can be used to create a new table or altering an existing table.

### `down()`

The `down` method is used to revert the changes applied in the `up` method. When `up` is used to create a table, `down` would be used to drop that table.

Update the schema file [you just created](#creating-migrations) with the following code:

```js
// .database/migrations/...users_schema.js

'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
```

The example above demonstrates how to create/alter a database table using schema files, chaining together different column [type/modifier methods](#column-typesmodifiers) to define the characteristics of individual field attributes in the `up` method.

## Column Types/Modifiers

> NOTE: For the full list of schema column type and modifier methods, see the [Knex API](https://knexjs.org/#Schema-Building) documentation.

### Column Types

| Method                                              | Description                                                               |
|-----------------------------------------------------|---------------------------------------------------------------------------|
| `table.bigInteger(name)`                            | Adds a [bigint](https://knexjs.org/#Schema-bigInteger) column.            |
| `table.binary(name, [length])`                      | Adds a [binary](https://knexjs.org/#Schema-binary) column.                |
| `table.boolean(name)`                               | Adds a [boolean](https://knexjs.org/#Schema-boolean) column.              |
| `table.date(name)`                                  | Adds a [date](https://knexjs.org/#Schema-date) column.                    |
| `table.datetime(name, [precision])`                 | Adds a [datetime](https://knexjs.org/#Schema-datetime) column.            |
| `table.decimal(name, [precision], [scale])`         | Adds a [decimal](https://knexjs.org/#Schema-decimal) column.              |
| `table.enu(col, values, [options])`                 | Adds a [enum](https://knexjs.org/#Schema-enum) column.                    |
| `table.float(name, [precision], [scale])`           | Adds a [float](https://knexjs.org/#Schema-float) column.                  |
| `table.increments(name)`                            | Adds an [auto incrementing](https://knexjs.org/#Schema-increments) column.|
| `table.integer(name)`                               | Adds an [integer](https://knexjs.org/#Schema-integer) column.             |
| `table.json(name)`                                  | Adds a [json](https://knexjs.org/#Schema-json) column.                    |
| `table.string(name, [length=255])`                  | Adds a [string](https://knexjs.org/#Schema-string) column.                |
| `table.text(name, [textType])`                      | Adds a [text](https://knexjs.org/#Schema-text) column.                    |
| `table.time(name, [precision])`                     | Adds a [time](https://knexjs.org/#Schema-time) column.                    |
| `table.timestamp(name, [useTz], [precision])`       | Adds a [timestamp](https://knexjs.org/#Schema-timestamp) column.          |
| `table.timestamps([useTimestamps], [defaultToNow])` | Adds [created/updated](https://knexjs.org/#Schema-timestamps) columns.    |
| `table.uuid(name)`                                  | Adds a [uuid](https://knexjs.org/#Schema-uuid) column.                    |

### Column Modifiers

| Method                              | Description                                                                               |
|-------------------------------------|-------------------------------------------------------------------------------------------|
| `.after(field)`                     | Set column to be inserted [after](https://knexjs.org/#Schema-after) `field`.              |
| `.alter()`                          | Marks the column as an [alter/modify](https://knexjs.org/#Schema-alter).                  |
| `.collate(collation)`               | Set column [collation](https://knexjs.org/#Chainable) (e.g. `utf8_unicode_ci`).           |
| `.comment(value)`                   | Set column [comment](https://knexjs.org/#Schema-comment).                                 |
| `.defaultTo(value)`                 | Set column [default value](https://knexjs.org/#Schema-defaultTo).                         |
| `.first()`                          | Set column to be inserted at the [first position](https://knexjs.org/#Schema-first).      |
| `.index([indexName], [indexType])`  | Specifies column as an [index](https://knexjs.org/#Chainable).                            |
| `.inTable(table)`                   | Set [foreign key table](https://knexjs.org/#Schema-inTable) (chain after `.references`).  |
| `.notNullable()`                    | Set column to [not null](https://knexjs.org/#Schema-notNullable).                         |
| `.nullable()`                       | Set column to be [nullable](https://knexjs.org/#Schema-nullable).                         |
| `.primary([constraintName])`        | Set column as the [primary key](https://knexjs.org/#Schema-primary) for a table.          |
| `.references(column)`               | Set [foreign key column](https://knexjs.org/#Schema-references).                          |
| `.unique()`                         | Set column as [unique](https://knexjs.org/#Chainable).                                    |
| `.unsigned()`                       | Set column to [unsigned](https://knexjs.org/#Schema-unsigned) (if integer).               |

## Multiple Connections
Schema files can use a different connection by defining a `connection` getter (ensure your different connection exists inside the `config/database.js` file):

```js
// .database/migrations/...users_schema.js

const Schema = use('Schema')

class UsersSchema extends Schema {
  static get connection () {
    return 'mysql'
  }

  // ...
}

module.exports = UsersSchema
```

> NOTE: The database table `adonis_schema` is always created inside the default connection database to manage the lifecycle of migrations (there is no option to override it).

## Run Migrations
We need to call the `migration:run` command to run migrations (which executes the `up` method on all pending migration files):

```bash
adonis migration:run
```

```bash
# .Output

migrate: 1502691651527_users_schema.js
Database migrated successfully in 117 ms
```

## Migration Status
You can check the status of all migrations by running the following command:

```bash
adonis migration:status
```

![image](http://res.cloudinary.com/adonisjs/image/upload/q_100/v1502694030/migration-status_zajqib.jpg)

> TIP: The *batch* value exists as a reference you can use to limit rollbacks at a later time.

That is how migrations work under the hood:

1. Calling `adonis migration:run` runs all pending schema files and assigns them to a new batch.
2. Once a batch of migration files are run, they are not run again.
3. Calling `adonis migration:rollback` rollbacks the last batch of migrations in reverse order.

> TIP: Don't create multiple tables in a single schema file. Instead, create a new file for each database change. This way you keep your database atomic and can roll back to any version.

## Migration Commands
Below is the list of available migration commands.

### Command List

| Command               | Description                                                               |
|-----------------------|---------------------------------------------------------------------------|
| `make:migration`      | Create a new migration file.                                              |
| `migration:run`       | Run all pending migrations.                                               |
| `migration:rollback`  | Rollback last set of migrations.                                          |
| `migration:refresh`   | Rollback all migrations to the `0` batch then re-run them from the start. |
| `migration:reset`     | Rollback all migrations to the `0` batch.                                 |
| `migration:status`    | Get the status of all the migrations.                                     |

### Command Help
For detailed command options, append `--help` to a each migration command:

```bash
adonis migration:run --help
```

```bash
# Output

Usage:
  migration:run [options]

Options:
  -f, --force   Forcefully run migrations in production
  -s, --silent  Silent the migrations output
  --seed        Seed the database after migration finished
  --log         Log SQL queries instead of executing them

About:
  Run all pending migrations
```

## Schema Table API
Below is the list of schema methods available to interact with database tables.

#### `create`
Create a new database table:

```js
up () {
  this.create('users', (table) => {
  })
}
```

#### `createIfNotExists`
Create a new database table (only if it doesn't exist):

```js
up () {
  this.createIfNotExists('users', (table) => {
  })
}
```

#### `rename(from, to)`
Rename an existing database table:

```js
up () {
  this.rename('users', 'my_users')
}
```

#### `drop`
Drop a database table:

```js
down () {
  this.drop('users')
}
```

#### `dropIfExists`
Drop a database table (only if it exists):

```js
down () {
  this.dropIfExists('users')
}
```

#### `alter`
Select a database table for alteration:

```js
up () {
  this.alter('users', (table) => {
    // add new columns or remove existing
  })
}
```

#### `raw`
Run an arbitrary SQL query:

```js
up () {
  this
    .raw("SET sql_mode='TRADITIONAL'")
    .table('users', (table) => {
      table.dropColumn('name')
      table.string('first_name')
      table.string('last_name')
    })
}
```

#### `hasTable`
Returns whether a table exists or not (this is an `async` method):

```js
async up () {
  const exists = await this.hasTable('users')

  if (!exists)  {
    this.create('up', (table) => {
    })
  }
}
```

## Extensions
Below is the list of extension methods you can execute when running migrations.

> NOTE: Extensions only work with a PostgreSQL database.

#### `createExtension(extensionName)`
Create a database extension:

```js
class UserSchema {
  up () {
    this.createExtension('postgis')
  }
}
```

#### `createExtensionIfNotExists(extensionName)`
Create a database extension (only if doesn't exist):

```js
class UserSchema {
  up () {
    this.createExtensionIfNotExists('postgis')
  }
}
```

#### `dropExtension(extensioName)`
Drop a database extension:

```js
class UserSchema {
  down () {
    this.dropExtension('postgis')
  }
}
```

#### `dropExtensionIfExists(extensionName)`
Drop a database extension (only if it exists):

```js
class UserSchema {
  down () {
    this.dropExtensionIfExists('postgis')
  }
}
```

## Executing Arbitrary Code
Commands written inside the `up` and `down` methods are scheduled to be executed later inside a migration.

If you need to execute *arbitrary* database commands, wrap them inside the `schedule` function:

```js
class UserSchema {
  up () {
    // create new table
    this.create('new_users', (table) => {
    })

    // copy data
    this.schedule(async (trx) => {
      const users = await Database.table('users').transacting(trx)
      await Database.table('new_users').transacting(trx).insert(users)
    })

    // drop old table
    this.drop('users')
  }
}
```

> NOTE: The `schedule` method receives a *transaction object*. It is important to run all database commands inside the same transaction, otherwise your queries will hang forever.

## Schema Builder API
The schema builder API uses the [Knex API](http://knexjs.org/#Schema-Building), so make sure to read their documentation for more information.

#### `fn.now()`
Knex has a method called [knex.fn.now()](http://knexjs.org/#Schema-timestamp), which is used to set the current timestamp on the database field.

In AdonisJs, you reference this method as `this.fn.now()`:

```js
up () {
  this.table('users', (table) => {
    table.timestamp('created_at').defaultTo(this.fn.now())
  })
}
```
