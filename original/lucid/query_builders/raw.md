# Raw query builder

The raw query builder allows you execute queries from a SQL string. Even though you are directly executing raw SQL strings, you can still keep your queries safe from SQL injection by using placeholders for values.

:::note
When executing raw queries, the results from the underlying driver are return as it is.
:::

```ts
import db from '@adonisjs/lucid/services/db'
await db.rawQuery('select * from users')
```

## Using bindings
To prevent your queries from SQL injection. You should never hard code the user input into the queries directly and instead rely on placeholders and bindings. For example:

```ts
await db.rawQuery(
  'select * from users where id = ?',
  [1]
)

// SELECT * FROM "users" WHERE "id" = 1
```

You can also pass in a dynamic column name using bindings. The `??` is parsed as a column name and `?` is parsed as a value.

```ts
db.rawQuery(
  'select * from users where ?? = ?',
  ['users.id', 1]
)

// SELECT * FROM "users" WHERE "users"."id" = 1
```

## Named placeholders

You can also name placeholders and then use objects for defining bindings. For example:

```ts
db.rawQuery(
  'select * from users where id = :id',
  {
    id: 1,
  }
)
```

You need to use also append the colon `:` after the placeholder when using a dynamic column name.

```ts
db.rawQuery(
  'select * from users where :column: = :value',
  {
    column: 'id',
    value: 1,
  }
)
```

Another example comparing two columns with each other.

```ts
db.rawQuery(
  'select * from user_logins inner join users on :column1: = :column2:',
  {
    column1: 'users.id',
    column2: 'user_logins.user_id',
  }
)

/**
SELECT * FROM
  user_logins
INNER JOIN
  users
ON
  "users"."id" = "user_logins"."user_id"
*/
```

## Raw query vs raw
There are two ways to create raw queries using the `db` service, ie `db.rawQuery` and `db.raw`.

The queries created using the `db.rawQuery` method can be executed as standalone queries. Whereas, the queries created using the `db.raw` method are method to passed by reference to other queries. For example:

```ts
// title: Self executable raw query
const result = await db.rawQuery('select * from users')
```

```ts
// title: Passing raw query by reference
await db.select(
  'id',
  db.raw('select ip_address from user_logins'),
)
```

## Methods/Properties
Following is the list of methods and properties available on the raw query builder.

### wrap
Wrap the raw query with a prefix and a suffix. Usually helpful when passing the raw query as a reference.

```ts
await db.select(
  'id',
  db
    .raw('select ip_address from user_logins')
    .wrap('(', ')'),
)
```

### `debug`
The `debug` method allows enabling or disabling debugging at an individual query level. Here's a [complete guide](../guides/debugging.md) on debugging queries.

```ts
await db
  .rawQuery('select * from users')
  .debug(true)
```

### `timeout`
Define the `timeout` for the query. An exception is raised after the timeout has been exceeded.

The value of timeout is always in milliseconds.

```ts
await db
  .rawQuery('select * from users')
  .timeout(2000)
```

You can also cancel the query when using timeouts with MySQL and PostgreSQL.

```ts
await db
  .rawQuery('select * from users')
  .timeout(2000, { cancel: true })
```

### `client`
Reference to the instance of the underlying [database query client](https://github.com/adonisjs/lucid/blob/develop/src/query_client/index.ts).

```ts
const query = db.rawQuery(sql, bindings)
console.log(query.client)
```

### `knexQuery`
Reference to the instance of the underlying KnexJS query.

```ts
const query = db.rawQuery(sql, bindings)
console.log(query.knexQuery)
```

### `reporterData`
The query builder emits the `db:query` event and also reports the queries execution time with the framework profiler.

Using the `reporterData` method, you can pass additional details to the event and the profiler.

```ts
db
  .rawQuery(sql, bindings)
  .reporterData({ userId: auth.user.id })
```

Now within the `db:query` event, you can access the value of `userId` as follows.

```ts
import emitter from '@adonisjs/lucid/services/emitter'

emitter.on('db:query', (query) => {
  console.log(query.userId)
})
```
