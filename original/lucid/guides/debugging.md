---
summary: A guide on debugging Lucid database queries.
---

# Debugging

You can debug SQL queries by first enabling the `debug` mode and then listen for the `db:query` event to get notified as SQL queries are executed.

The debug mode can be enabled globally for a database connection by setting  the `debug` flag to `true` inside the `config/database.ts` file. For example:

```ts
// title: config/database.ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      // highlight-start
      debug: true
      // highlight-end
    },
  },
})
```

Or, you can enable it for an individual query using the `debug` method on the query builder.

:::codegroup

```ts
// title: Select
db
  .query()
  .select('*')
  // highlight-start
  .debug(true)
  // highlight-end
```

```ts
// title: Insert
db
  .insertQuery()
  // highlight-start
  .debug(true)
  // highlight-end
  .insert({})
```

```ts
// title: Raw
db
  .rawQuery('select * from users')
  // highlight-start
  .debug(true)
  // highlight-end
```

:::

## Pretty printing debug queries
Once the debugging has been enabled you can set the `prettyPrintDebugQueries` flag to `true` within the `config/database.ts` file.

This flag will register an event listener for the `db:query` event and will print the SQL queries to the console.

```ts
// title: config/database.ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  // highlight-start
  prettyPrintDebugQueries: true,
  // highlight-end
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        // ...
      },
      debug: true
    },
  },
})
```

## Manually listening for the event
If you do not want to pretty print SQL queries and write them to the console, then you can self listen for the `db:query` event and self handle the treatment of debug logs.

In the following example, we use the application logger to log the queries.

```ts
// title: start/events.ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('db:query', function (query) {
  logger.debug(query)
})
```
