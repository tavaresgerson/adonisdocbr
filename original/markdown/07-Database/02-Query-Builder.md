---
title: Query Builder
category: database
---

# Query Builder

The AdonisJs *Query Builder* provides a unified syntax to interact with SQL databases using JavaScript methods.

This guide is a reference to all the available methods on the *Query Builder*.

> TIP: See the database link:database[Getting Started] guide for the list of supported databases, config options and how to debug your SQL queries.

## Introduction
Writing SQL queries can be tedious, even if you are proficient with SQL.

### Syntax Abstraction

Imagine all your queries are written for MySQL, and at a later time you're asked to migrate everything to PostgreSQL. You'd have to rewrite/amend your MySQL queries to ensure they still work well with PostgreSQL.

*Query Builder* abstracts away connection specific syntax so you're free to concentrate on your app functionality instead of variations in SQL dialects.

### Conditional Queries
Another issue can be building incremental queries with conditional blocks:

```js
// Without Query Builder

const sql = 'SELECT * FROM `users`'

if (username) {
  sql += ' WHERE `username` = ' + username
}
```

```js
// With Query Builder

const query = Database.table('users')

if (username) {
  query.where('username', username)
}
```

## Basic Example
Here's a basic example using the *Query Builder* to chain different methods:

```js
const Database = use('Database')

class UserController {

  async index (request, response) {
    return await Database
      .table('users')
      .where('username', 'john')
      .first()
  }

}
```

## Selects
The `select` method defines the fields to be selected for a given query:

```js
await Database.select('id', 'username').from('users')
// ou
await Database.select('*').from('users')
```

```sql
-- SQL Output

select `id`, `username` from `users`
select * from `users`
```

You can define query *aliases* like so:

```js
await Database.select('username as uname')
```

## Where Clauses
*Query Builder* offers numerous dynamic methods to add *where* clauses.

It also supports subqueries by passing a *closure* or *another query* instead of the actual value.

For detailed `where` information, see Knex's [documentation](http://knexjs.org/#Builder-wheres).

> NOTE: Passing `undefined` to the `where` clause causes an error during SQL compilation, so ensure dynamic values are not `undefined` before passing them.

#### `where`

```js
const users = await Database.from('users').where('id', 1)
// Or
const users = await Database.from('users').where({ id: 1 })
```

You can pass a comparison operator to the `where` clause like so:

```js
const adults = await Database
  .from('users')
  .where('age', '>', 18)
```

#### `where(with callback)`
You can pass a callback to the `where` clause to group all clauses contained withing the callback:

```js
await Database.from('users').where(function () {
  this
    .where('id', 1)
    .orWhere('id', '>', 10)
})
```

```sql
--- SQL Output

select * from `users` where (`id` = 1 or `id` > 10)
```

#### `whereNot`

```js
await Database
  .from('users')
  .whereNot('age', '>', 15)

// or
await Database
  .from('users')
  .whereNot({username: 'foo'})
```

#### `whereIn`

```js
await Database
  .from('users')
  .whereIn('id', [1,2,3])
```

#### `whereNotIn`

```js
await Database
  .from('users')
  .whereNotIn('id', [1,2,3])
```

#### `whereNull`

```js
await Database
  .from('users')
  .whereNull('deleted_at')
```

#### `whereNotNull`

```js
await Database
  .from('users')
  .whereNotNull('created_at')
```

#### `whereExists`

```js
await Database.from('users').whereExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```

#### `whereNotExists`

```js
await Database.from('users').whereNotExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```

#### `whereBetween`

```js
await Database
  .table('users')
  .whereBetween('age', [18, 32])
```

#### `whereNotBetween`

```js
await Database
  .table('users')
  .whereNotBetween('age', [45, 60])
```

#### `whereRaw`
Convenience helper for `.where(Database.raw(query))`:

```js
await Database
  .from('users')
  .whereRaw('id = ?', [20])
```

## Joins

#### `innerJoin`

```js
await Database
  .table('users')
  .innerJoin('accounts', 'users.id', 'accounts.user_id')
```

You can also pass a callback to construct the join:

```js
await Database
  .table('users')
  .innerJoin('accounts', function () {
    this
      .on('users.id', 'accounts.user_id')
      .orOn('users.id', 'accounts.owner_id')
  })
```

#### `leftJoin`

```js
Database
  .select('*')
  .from('users')
  .leftJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `leftOuterJoin`

```js
await Database
  .select('*')
  .from('users')
  .leftOuterJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `rightJoin`

```js
await Database
  .select('*')
  .from('users')
  .rightJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `rightOuterJoin`

```js
await Database
  .select('*')
  .from('users')
  .rightOuterJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `outerJoin`

```js
await Database
  .select('*')
  .from('users')
  .outerJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `fullOuterJoin`

```js
await Database
  .select('*')
  .from('users')
  .fullOuterJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `crossJoin`

```js
await Database
  .select('*')
  .from('users')
  .crossJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `joinRaw`

```js
await Database
  .select('*')
  .from('accounts')
  .joinRaw('natural full join table1').where('id', 1)
```

## Ordering and Limits

#### `distinct`

```js
await Database
  .table('users')
  .distinct('age')
```

#### `groupBy`

```js
await Database
  .table('users')
  .groupBy('age')
```

#### `groupByRaw`

```js
await Database
  .table('users')
  .groupByRaw('age, status')
```

#### `orderBy(column, [direction=asc])`

```js
await Database
  .table('users')
  .orderBy('id', 'desc')
```

#### `orderByRaw(column, [direction=asc])`

```js
await Database
  .table('users')
  .orderByRaw('col NULLS LAST DESC')
```

#### `having(column, operator, value)`

> NOTE: `groupBy()` must be called before `having()`.

```js
await Database
  .table('users')
  .groupBy('age')
  .having('age', '>', 18)
```

#### `offset/limit(value)`

```js
await Database
  .table('users')
  .offset(11)
  .limit(10)
```

## Inserts

#### `insert(values)`
The `insert` operation creates a row and returns its newly created `id`:

```js
const userId = await Database
  .table('users')
  .insert({username: 'foo', ...})
```

In the case of bulk inserts, the `id` of the first record is returned (this is a limitation with MySQL itself; see [LAST_INSERT_ID](http://dev.mysql.com/doc/refman/5.6/en/information-functions.html#function_last-insert-id)):

```js
// BULK INSERT
const firstUserId = await Database
  .from('users')
  .insert([{username: 'foo'}, {username: 'bar'}])
```

#### `into(tableName)`
The `into` method is a more readable alternative than using `table/from` when inserting database rows:

```js
const userId = await Database
  .insert({username: 'foo', ...})
  .into('users')
```

### PostgreSQL Return Column
For PostgreSQL, you have to define the returning column explicitly (all other database clients ignore this statement):

```js
const userId = await Database
  .insert({ username: 'virk' })
  .into('users')
  .returning('id')
```

## Updates
All update operations return the number of affected rows:

```js
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .update('lastname', 'Virk')
```

To update multiple columns, pass those columns/values as an object:

```js
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .update({ lastname: 'Virk', firstname: 'Aman' })
```

## Deletes

#### `delete`
Delete operations also return the number of affected rows:

```js
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .delete()
```

> NOTE: As `delete` is reserved a reserved keyword in JavaScript, you can also use the alternative `del()` method.

#### `truncate`
Truncate removes all table rows, resetting the table auto increment id to `0`:

```js
await Database.truncate('users')
```

## Pagination
*Query Builder* provides convenient methods to paginate database results.

#### `forPage(page, [limit=20])`

```js
const users = await Database
  .from('users')
  .forPage(1, 10)
```

#### `paginate(page, [limit=20])`

```js
const results = await Database
  .from('users')
  .paginate(2, 10)
```

> NOTE: The output of the `paginate` method is different from the `forPage` method.

```js
// .Output

{
  total: '',
  perPage: '',
  lastPage: '',
  page: '',
  data: [{...}]
}
```

> NOTE: If using *PostgreSQL*, the `total` key will be a string since JavaScript is unable to handle `bigint` natively (see [this issue](https://github.com/adonisjs/adonis-lucid/issues/339#issuecomment-387399508) for a recommended solution).

## Database Transactions
Database transactions are safe operations which are not reflected in the database until you explicitly commit your changes.

#### `beginTransaction`
The `beginTransaction` method returns the transaction object, which can be used to perform any queries:

```js
const trx = await Database.beginTransaction()
await trx.insert({username: 'virk'}).into('users')

await trx.commit() // insert query will take place on commit
await trx.rollback() // will not insert anything
```

#### `transaction`
You can also wrap your transactions inside a callback:

```js
await Database.transaction(async (trx) => {
  await trx.insert({username: 'virk'}).into('users')
})
```

> NOTE: You do not have to call `commit` or `rollback` manually inside this callback.

If any of your queries throws an error, the transaction rolls back automatically, otherwise, it is committed.

## Aggregates

*Query Builder* exposes the full power of Knex's [aggregate methods](http://knexjs.org/#Builder-count).

#### `count()`

```js
const count = await Database
  .from('users')
  .count()                                      // returns array

const total = count[0]['count(*)']              // returns number

// COUNT A COLUMN
const count = await Database
  .from('users')
  .count('id')                                  // returns array

const total = count[0]['count("id")']           // returns number

// COUNT COLUMN AS NAME
const count = await Database
  .from('users')
  .count('* as total')                          // returns array

const total = count[0].total                    // returns number
```

#### `countDistinct`
`countDistinct` is the same as `count`, but adds a `distinct` expression:

```js
const count = await Database
  .from('users')
  .countDistinct('id')                          // returns array

const total = count[0]['count(distinct "id")']  // returns number
```

#### `min`

```js
await Database.from('users').min('age')         // returns array
await Database.from('users').min('age as a')    // returns array
```

#### `max`

```js
await Database.from('users').max('age')         // returns array
await Database.from('users').max('age as a')    // returns array
```

#### `sum`
```js
await Database.from('cart').sum('total')        // returns array
await Database.from('cart').sum('total as t')   // returns array
```

#### `sumDistinct`
```js
await Database.from('cart').sumDistinct('total')      // returns array
await Database.from('cart').sumDistinct('total as t') // returns array
```

#### `avg`
```js
await Database.from('users').avg('age')         // returns array
await Database.from('users').avg('age as age')  // returns array
```

#### `avgDistinct`
```js
await Database.from('users').avgDistinct('age')         // returns array
await Database.from('users').avgDistinct('age as age')  // returns array
```

#### `increment`
Increase the column value by `1`:

```js
await Database
  .table('credits')
  .where('id', 1)
  .increment('balance', 10)
```

#### `decrement`
Decrease the column value by `1`:

```js
await Database
  .table('credits')
  .where('id', 1)
  .decrement('balance', 10)
```

### Aggregate Helpers

The AdonisJs *Query Builder* also extends Knex's query aggregates with helpful shortcut methods for common aggregate queries. These helper methods end the query builder chain and return a value.

All helpers accept a column name to be used for aggregation. When possible, *Query Builder* will choose a default for the column name.

Some methods, such as `sum()`, require a column name.

The underlying Knex query builder defines the methods: `count()`, `countDistinct()`, `avg()`, `avgDistinct()`, `sum()`, `sumDistinct()`, `min()`, and `max()`. To avoid confusion and naming collisions, *Query Builder* prefixes its aggregate helper methods with `get` (e.g. `getCount`).

#### `getCount(columnName = '*')`
```js
const total = await Database
  .from('users')
  .getCount()                                   // returns number
```

#### `getCountDistinct(columnName)`
```js
const total = await Database
  .from('users')
  .getCountDistinct('id')                          // returns number
```

#### `getMin(columnName)`
```js
await Database.from('users').getMin('age')      // returns a number
```

#### `getMax(columnName)`
```js
await Database.from('users').getMax('age')      // returns number
```

#### `getSum(columnName)`
```js
await Database.from('cart').getSum('total')     // returns number
```

#### `getSumDistinct(columnName)`
```js
await Database.from('cart').getSumDistinct('total')   // returns number
```

#### `getAvg(columnName)`
```js
await Database.from('users').getAvg('age')      // returns number
```

#### `getAvgDistinct(columnName)`
```js
await Database.from('users').getAvgDistinct('age')      // returns number
```

## Helpers

#### `pluck(column)`
The `pluck` method will return an array of values for the selected column:

```js
const usersIds = await Database.from('users').pluck('id')
```

#### `first`
The `first` method adds a `limit 1` clause to the query:

```js
await Database.from('users').first()
```

#### `clone`
Clones the current query chain for later usage:

```js
const query = Database
  .from('users')
  .where('username', 'virk')
  .clone()

// later
await query
```

#### `columnInfo`
Returns information for a given column:

```js
const username = await Database
  .table('users')
  .columnInfo('username')
```

## Subqueries

```js
const subquery = Database
  .from('accounts')
  .where('account_name', 'somename')
  .select('account_name')

const users = await Database
  .from('users')
  .whereIn('id', subquery)
```

```sql
select * from `users` where `id` in (select `account_name` from `accounts` where `account_name` = 'somename')
```

## Raw Queries
The `Database.raw` method should be used for running raw SQL queries:

```js
await Database
  .raw('select * from users where username = ?', [username])
```

## Closing Connections
Database connections can be closed by calling the `close` method. By default, this method closes all open database connections.

To close selected connections, pass an array of connection names:

```js
Database.close() // all

Database.close(['sqlite', 'mysql'])
```
