---
title: Getting Started
category: database
---

# Getting Started

Creating AdonisJs data-driven apps is greatly simplified via its powerful [Query Builder](/original/markdown/07-Database/02-Query-Builder.md), [Lucid ORM](/original/markdown/08-Lucid-ORM/01-Getting-Started.adoc), [Migrations](/original/markdown/07-Database/03-Migrations.md), [Factories](/original/markdown/07-Database/04-Seeding.md) and [Seeds](/original/markdown/07-Database/04-Seeding.md).

In this guide we'll learn to setup and use the *Database Provider*.

> NOTE: The Data Provider uses [Knex.js](https://knexjs.org) internally, so browse the Knex documentation whenever further information is required.

## Supported Databases
The list of supported databases and their equivalent drivers are as follows:

| Database    | NPM Driver                        |
|-------------|-----------------------------------|
| MariaDB     | `npm i mysql` or `npm i mysql2`   |
| MSSQL       | `npm i mssql`                     |
| MySQL       | `npm i mysql` or `npm i mysql2`   |
| Oracle      | `npm i oracledb`                  |
| PostgreSQL  | `npm i pg`                        |
| SQLite3     | `npm i sqlite3`                   |

## Setup

### Installation
If the *Database Provider* (*Lucid*) is not installed, pull it from `npm`:

```bash 
adonis install @adonisjs/lucid
```

Next, register the following providers inside the `start/app.js` file:

```js
// .start/app.js

const providers = [
  '@adonisjs/lucid/providers/LucidProvider'
]

const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider'
]
```

> NOTE: Many AdonisJs boilerplates have *Lucid* installed by default.

### Configuration
The *Database Provider* uses the `sqlite` connection by default.

The default connection can be set via the `config/database.js` file:

```js
// .config/database.js

module.exports = {
  connection: 'mysql',
}
```

All of the Knex [configuration options](http://knexjs.org/#Installation-client) are supported as is.

## Basic Example
The AdonisJs link:query-builder[Query Builder] has a *fluent* API, meaning you can chain/append JavaScript methods to create your SQL queries.

For example, to select and return all users as JSON:

```js
const Database = use('Database')

Route.get('/', async () => {
  return await Database.table('users').select('*')
})
```

### Where Clause
To add a where clause to a query, chain a `where` method:

```js
Database
  .table('users')
  .where('age', '>', 18)
```

To add another where clause, chain an `orWhere` method:

```js
Database
  .table('users')
  .where('age', '>', 18)
  .orWhere('vip', true)
```

See the [Query Builder](/original/markdown/07-Database/02-Query-Builder.md) documentation for the complete API reference.

## Multiple Connections
By default, AdonisJs uses the `connection` value defined inside the `config/database.js` file when making database queries.

You can select any of the connections defined inside the `config/database.js` file at runtime to make your queries:

```js
Database
  .connection('mysql')
  .table('users')
```

> NOTE: Since AdonisJs pools connections for reuse, all used connections are maintained unless the process dies.

To close a connection, call the `close` method passing any connection names:

```js
const users = await Database
  .connection('mysql')
  .table('users')

// later close the connection
Database.close(['mysql'])
```

## Table Prefixing
The *Database Provider* can automatically prefix table names by defining a `prefix` value inside the `config/database.js` file:

```js
// .config/database.js

module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    prefix: 'my_'
  }
}
```

Now, all queries on the `sqlite` connection will have `my_` as their table prefix:

```js
await Database
  .table('users')
  .select('*')
```


```sql
-- .SQL Output

select * from `my_users`
```

#### `withOutPrefix`
If a `prefix` value is defined you can ignore it by calling `withOutPrefix`:

```js
await Database
  .withOutPrefix()
  .table('users')
```

## Debugging
Debugging database queries can be handy in both development and production.

Let's go through the available strategies to debug queries.

### Globally
Setting `debug: true` inside the `database/config.js` file enables debugging for all queries globally:

```js
// .config/database.js

module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    connection: {},
    debug: true
  }
}
```

You can also debug queries via the *Database Provider* `query` event.

Listen for the `query` event by defining a hook inside the `start/hooks.js` file:

```js
// .start/hooks.js

const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Database = use('Database')
  Database.on('query', console.log)
})
```

> NOTE: Create the `start/hooks.js` file if it does not exist.

### Locally
You can listen for the `query` event per query at runtime:

```js
await Database
  .table('users')
  .select('*')
  .on('query', console.log)
```

### Slow query logs
Tracking slow SQL queries is helpful to keep your app running smoothly.

AdonisJs makes it easy to track slow SQL queries by listening for the `slow:query` event:

```js
Database.on('slow:query', (sql, time) => {
  console.log(`${time}: ${sql.query}`)
})
```

The configuration for slow queries is saved next to the connection settings in the `config/database.js` file:

```js
module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    slowQuery: {
      enabled: true,
      threshold: 5000
    }
  }
}
```
