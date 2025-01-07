---
summary: Use the `@adonisjs/lock` package to manage atomic locks in your AdonisJS application. 
---

# Atomic Locks

An atomic lock, otherwise known as a `mutex`, is used for synchronizing access to a shared resource. In other words, it prevents several processes, or concurrent code, from executing a section of code at the same time.

The AdonisJS team has created a framework-agnostic package called [Verrou](https://github.com/Julien-R44/verrou). The `@adonisjs/lock` package is based on this package, **so make sure to also read [the Verrou documentation](https://verrou.dev/docs/introduction) which is more detailed.**

## Installation

Install and configure the package using the following command:

```sh
node ace add @adonisjs/lock
```

:::disclosure{title="See steps performed by the add command"}

1. Install the `@adonisjs/lock` package using the detected package manager.

2. Registers the following service provider inside the `adonisrc.ts` file.
    ```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/lock/lock_provider')
      ]
    }
    ```

3. Create the `config/lock.ts` file.

4. Define the following environment variable alongside its validation inside the `start/env.ts` file.
   ```ts
   LOCK_STORE=redis
   ```

5. Optionally, create the database migration for the `locks` table if using the `database` store.

:::

## Configuration
The configuration for the locks is stored inside the `config/lock.ts` file.

```ts
import env from '#start/env'
import { defineConfig, stores } from '@adonisjs/lock'

const lockConfig = defineConfig({
  default: env.get('LOCK_STORE'),
  stores: {
    redis: stores.redis({}),

    database: stores.database({
      tableName: 'locks',
    }),

    memory: stores.memory()
  },
})

export default lockConfig

declare module '@adonisjs/lock/types' {
  export interface LockStoresList extends InferLockStores<typeof lockConfig> {}
}
```


<dl>

<dt>

default

</dt>

<dd>

The `default` store to use for managing locks. The store is defined within the same config file under the `stores` object.

</dd>

<dt>

stores

</dt>

<dd>

A collection of stores you plan to use within your application. We recommend always configuring the `memory` store that could be used during testing.

</dd>

</dl>

---


### Environment variables
The default lock store is defined using the `LOCK_STORE` environment variable, and therefore, you can switch between different stores in different environments. For example, use the `memory` store during testing and the `redis` store for development and production.

Also, the environment variable must be validated to allow one of the pre-configured stores. The validation is defined inside the `start/env.ts` file using the `Env.schema.enum` rule.

```ts
{
  LOCK_STORE: Env.schema.enum(['redis', 'database', 'memory'] as const),
}
```

### Redis store
The `redis` store has a peer dependency on the `@adonisjs/redis` package; therefore, you must configure this package before using the Redis store.

Following is the list of options the Redis store accepts:

```ts
{
  redis: stores.redis({
    connectionName: 'main',
  }),
}
```

<dl>
<dt>
connectionName
</dt>
<dd>

The `connectionName` property refers to a connection defined within the `config/redis.ts` file.

</dd>
</dl>

### Database store

The `database` store has a peer dependency on the `@adonisjs/lucid` package, and therefore, you must configure this package before using the database store.

Following is the list of options the database store accepts:

```ts
{
  database: stores.database({
    connectionName: 'postgres',
    tableName: 'my_locks',
  }),
}
```

<dl>

<dt>

connectionName

</dt>

<dd>

Reference to the database connection defined within the `config/database.ts` file. If not defined, we will use the default database connection.

</dd>

<dt>

tableName

</dt>

<dd>

The database table to use to store rate limits. 

</dd>

</dl>

### Memory store

The `memory` store is a simple in-memory store that can be useful for testing purposes but not only. Sometimes, for some use cases, you might want to have a lock that is only valid for the current process and not shared across multiple ones.

The memory store is built on top of the [`async-mutex`](https://www.npmjs.com/package/async-mutex) package.

```ts
{
  memory: stores.memory(),
}
```

## Locking a resource

Once you have configured your lock store, you can start using locks to protect your resources anywhere within your application.

Here is a simple example of how to use locks to protect a resource.


:::codegroup

```ts
// title: Manual locking
import { errors } from '@adonisjs/lock'
import locks from '@adonisjs/lock/services/main'
import { HttpContext } from '@adonisjs/core/http'

export default class OrderController {
  async process({ response, request }: HttpContext) {
    const orderId = request.input('order_id')

    /**
     * Try to acquire the lock immediately ( without retrying )
     */
    const lock = locks.createLock(`order.processing.${orderId}`)
    const acquired = await lock.acquireImmediately()
    if (!acquired) {
      return 'Order is already being processed'
    }

    /**
     * Lock has been acquired. We can process the order
     */
    try {
      await processOrder()
      return 'Order processed successfully'
    } finally {
      /**
       * Always release the lock using the `finally` block, so that
       * we are sure that the lock is released even when an exception
       * is thrown during the processing.
       */
      await lock.release()
    }
  }
}
```

```ts
// title: Automatic locking
import { errors } from '@adonisjs/lock'
import locks from '@adonisjs/lock/services/main'
import { HttpContext } from '@adonisjs/core/http'

export default class OrderController {
  async process({ response, request }: HttpContext) {
    const orderId = request.input('order_id')

    /**
     * Will run the function only if lock is available
     * Lock will also be automatically released once the function
     * has been executed
     */
    const [executed, result] = await locks
      .createLock(`order.processing.${orderId}`)
      .runImmediately(async (lock) => {
        /**
         * Lock has been acquired. We can process the order
         */
        await processOrder()
        return 'Order processed successfully'
      })

    /**
     * Lock could not be acquired and function was not executed
     */
    if (!executed) return 'Order is already being processed'

    return result
  }
}
```

:::

This is a quick example of how to use locks within your application. 

They are many other methods available to manage locks, such as `extend` for extending the lock duration, `getRemainingTime` to get the remaining time before the lock expires, options to configure the lock, and more.

**For that, make sure to read the [Verrou documentation](https://verrou.dev/docs/introduction) for more details**. As a reminder, the `@adonisjs/lock` package is based on the `Verrou` package, so everything you read in the Verrou documentation is also applicable to the `@adonisjs/lock` package.

## Using another store

If you defined multiple stores inside the `config/lock.ts` file, you can use a different store for a specific lock by using the `use` method.

```ts
import locks from '@adonisjs/lock/services/main'

const lock = locks.use('redis').createLock('order.processing.1')
```

Otherwise, if using only the `default` store, you can omit the `use` method.

```ts
import locks from '@adonisjs/lock/services/main'

const lock = locks.createLock('order.processing.1')
```

## Managing locks across multiple processes

Sometimes, you might want to have one process creating and acquiring a lock, and another process releasing it. For example, you might want to acquire a lock inside a web request and release it inside a background job. This is possible using the `restoreLock` method.

```ts
// title: Your main server
import locks from '@adonisjs/lock/services/main'

export class OrderController {
  async process({ response, request }: HttpContext) {
    const orderId = request.input('order_id')

    const lock = locks.createLock(`order.processing.${orderId}`)
    await lock.acquire()

    /**
     * Dispatch a background job to process the order.
     * 
     * We also pass the serialized lock to the job, so that the job
     * can release the lock once the order has been processed.
     */
    queue.dispatch('app/jobs/process_order', {
      lock: lock.serialize()
    })
  }
}
```

```ts
// title: Your background job
import locks from '@adonisjs/lock/services/main'

export class ProcessOrder {
  async handle({ lock }) {
    /**
     * We are restoring the lock from the serialized version
     */
    const handle = locks.restoreLock(lock)

    /**
     * Process the order
     */
    await processOrder()

    /**
     * Release the lock
     */
    await handle.release()
  }
}
```

## Testing 

During testing, you can use the `memory` store to avoid making real network requests to acquire locks. You can do this by setting the `LOCK_STORE` environment variable to `memory` inside the `.env.testing` file.

```env
// title: .env.test
LOCK_STORE=memory
```

## Create a custom lock store

First, make sure to consult the [Verrou documentation](https://verrou.dev/docs/custom-lock-store) that goes deeper into the creation of a custom lock store. In AdonisJS, it will be pretty much the same. 

Let's create a simple Noop store that does not do anything. First, we must create a class that will implement the `LockStore` interface.

```ts
import type { LockStore } from '@adonisjs/lock/types'

class NoopStore implements LockStore {
  /**
   * Save the lock in the store.
   * This method should return false if the given key is already locked
   *
   * @param key The key to lock
   * @param owner The owner of the lock
   * @param ttl The time to live of the lock in milliseconds. Null means no expiration
   *
   * @returns True if the lock was acquired, false otherwise
   */
  async save(key: string, owner: string, ttl: number | null): Promise<boolean> {
    return false
  }

  /**
   * Delete the lock from the store if it is owned by the given owner
   * Otherwise should throws a E_LOCK_NOT_OWNED error
   *
   * @param key The key to delete
   * @param owner The owner
   */
  async delete(key: string, owner: string): Promise<void> {
    return false
  }

  /**
   * Force delete the lock from the store without checking the owner
   */
  async forceDelete(key: string): Promise<Void> {
    return false
  }

  /**
   * Check if the lock exists. Returns true if so, false otherwise
   */
  async exists(key: string): Promise<boolean> {
    return false
  }

  /**
   * Extend the lock expiration. Throws an error if the lock is not owned by 
   * the given owner
   * Duration is in milliseconds
   */
  async extend(key: string, owner: string, duration: number): Promise<void> {
    return false
  }
}
```

### Defining the store factory

Once you have created your store, you must define a simple factory function that will be used by `@adonisjs/lock` to create an instance of you store.

```ts
function noopStore(options: MyNoopStoreConfig) {
  return { driver: { factory: () => new NoopStore(options) } }
}
```

### Using the custom store

Once done, you may use the `noopStore` function as follows:

```ts
import { defineConfig } from '@adonisjs/lock'

const lockConfig = defineConfig({
  default: 'noop',
  stores: {
    noop: noopStore({}),
  },
})
```
