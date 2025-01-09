# Installation and usage

Lucid comes pre-configured with the `web` and the `api` starter kits. However, you can install and manually configure it as follows inside an AdonisJS project.

Install the package from the npm packages registry using one of the following commands.

:::codegroup

```sh
// title: npm
npm i @adonisjs/lucid
```

```sh
// title: yarn
yarn add @adonisjs/lucid
```

```sh
// title: pnpm
pnpm add @adonisjs/lucid
```

:::

Once done, you must run the following command to configure Lucid. You can optionally specify the database dialect you want to use using the `--db` flag. Following is the list of valid options.

- `sqlite`
- `postgres`
- `mysql`
- `mssql`

```sh
node ace configure @adonisjs/lucid

# Configure with MYSQL
node ace configure @adonisjs/lucid --db=mysql
```

:::disclosure{title="See steps performed by the configure command"}

1. Registers the following service provider inside the `adonisrc.ts` file.

   ```ts
   {
     providers: [
       // ...other providers
       () => import('@adonisjs/lucid/database_provider'),
     ]
   }
   ```

2. Register the following command inside the `adonisrc.ts` file.

   ```ts
   {
     commands: [
       // ...other commands
       () => import('@adonisjs/lucid/commands'),
     ]
   }
   ```

3. Create the `config/database.ts` file.

4. Define the environment variables and their validations for the selected dialect.

5. Install required peer dependencies.

:::

## Configuration

The configuration for Lucid is stored inside the `config/database.ts` file.

See also: [Lucid config stubs](https://github.com/adonisjs/presets/tree/develop/src/lucid/stubs/config/database)

```ts
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
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
```

### `connection`

The default connection to use for making queries. The value must be a reference to one of the `connections` defined in the same config file.

### `connections`

The `connections` object is a collection of named database connections you want to use. Connections are initialized lazily when you execute a query for the first time.

### connections.`name`.connection

The value of the `connection` property is same as the [configuration object](https://knexjs.org/guide/#configuration-options) accepted by Knex.

## Configuring read-write replicas

Lucid supports read-write replicas as a first-class citizen. You may configure one write database server, along with multiple read servers. All read queries are sent to the read servers in round-robin fashion, and write queries are sent to the write server.

:::note
Lucid does not perform any data replication for you. Therefore, you still have to rely on your database server for that.
:::

In the following example, we define one write server and two read replicas. Since, Lucid will merge the properties from the `connection` object with every node of read-write connection objects, you do not have to repeat `username` and `password` properties.

```ts
const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        // delete-start
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        // delete-end
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      // insert-start
      replicas: {
        read: {
          connection: [
            {
              host: '192.168.1.1',
            },
            {
              host: '192.168.1.2',
            },
          ],
        },
        write: {
          connection: {
            host: '196.168.1.3',
          },
        },
      },
      // insert-end
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})
```

## Basic usage

Once you have configured Lucid, you can start using the Database query builder to create and execute SQL queries. In the following code examples, we perform CRUD operations on the `posts` table.

```ts
// title: Select query with pagination
// highlight-start
import db from '@adonisjs/lucid/services/db'
// highlight-end
import { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 20

    // highlight-start
    const posts = await db
      .query()
      .from('posts')
      .select('*')
      .orderBy('id', 'desc')
      .paginate(page, limit)
    // highlight-end

    return posts
  }
}
```

```ts
// title: Insert query
// highlight-start
import db from '@adonisjs/lucid/services/db'
// highlight-end
import { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async store({ request }: HttpContext) {
    const title = request.input('title')
    const description = request.input('description')

    // highlight-start
    const id = await db
      .insertQuery()
      .table('posts')
      .insert({
        title,
        description,
      })
      .returning('id')
    // highlight-end
  }
}
```

```ts
// title: Update row by id
// highlight-start
import db from '@adonisjs/lucid/services/db'
// highlight-end
import { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async update({ request, params }: HttpContext) {
    const id = params.id
    const title = request.input('title')
    const description = request.input('description')

    // highlight-start
    const updateRowsCount = await db
      .query()
      .from('posts')
      .where('id', id)
      .update({
        title,
        description,
      })
    // highlight-end
  }
}
```

```ts
// title: Delete row by id
// highlight-start
import db from '@adonisjs/lucid/services/db'
// highlight-end
import { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async delete({ request, params }: HttpContext) {
    const id = params.id

    // highlight-start
    const updateRowsCount = await db
      .query()
      .from('posts')
      .where('id', id)
      .delete()
    // highlight-end
  }
}
```

## Switching between connections
Since, you can define multiple connections within the `config/database.ts` file. You may switch between them at runtime using the `db.connection` method. It accepts the connection name (as defined inside the config file) as a parameter and return an instance of [QueryClient](https://github.com/adonisjs/lucid/blob/develop/src/query_client/index.ts) class for the mentioned connection.

```ts
import db from '@adonisjs/lucid/services/db'

/**
 * Get query client for "pg" connection
 */
const pg = db.connection('pg')

/**
 * Execute query
 */
await pg.query().select('*').from('posts')
```

## Closing connections
You may close open connections using the `db.manager.close` method. The method accepts the connection name (as defined inside the config file) as a parameter and calls the [disconnection method](https://github.com/adonisjs/lucid/blob/develop/src/connection/index.ts#L365) on the underlying connection class.

It is recommend to not close connections, unless you know that you will not use making more queries using the given connection.

```ts
import db from '@adonisjs/lucid/services/db'

await db.manager.close('pg')
```
