---
summary: Use o pacote `@adonisjs/lock` para gerenciar bloqueios atômicos em seu aplicativo AdonisJS.
---

# Bloqueios tomic

Um bloqueio atômico, também conhecido como `mutex`, é usado para sincronizar o acesso a um recurso compartilhado. Em outras palavras, ele impede que vários processos, ou código simultâneo, executem uma seção de código ao mesmo tempo.

A equipe do AdonisJS criou um pacote independente de framework chamado [Verrou](https://github.com/Julien-R44/verrou). O pacote `@adonisjs/lock` é baseado neste pacote, **então certifique-se de ler também [a documentação do Verrou](https://verrou.dev/docs/introduction) que é mais detalhada.**

## Instalação

Instale e configure o pacote usando o seguinte comando:

```sh
node ace add @adonisjs/lock
```

::: details Veja os passos realizados pelo comando add

1. Instale o pacote `@adonisjs/lock` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.
```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/lock/lock_provider')
      ]
    }
    ```

3. Crie o arquivo `config/lock.ts`.

4. Defina a seguinte variável de ambiente junto com sua validação dentro do arquivo `start/env.ts`.
```ts
   LOCK_STORE=redis
   ```

5. Opcionalmente, crie a migração do banco de dados para a tabela `locks` se estiver usando o armazenamento `database`.

:::

## Configuração
A configuração dos bloqueios é armazenada dentro do arquivo `config/lock.ts`.

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

### `default`

O armazenamento `default` a ser usado para gerenciar bloqueios. O armazenamento é definido dentro do mesmo arquivo de configuração sob o objeto `stores`.

### `stores`

Uma coleção de armazenamentos que você planeja usar em seu aplicativo. Recomendamos sempre configurar o armazenamento `memory` que pode ser usado durante o teste.

---

### Variáveis ​​de ambiente
O armazenamento de bloqueio padrão é definido usando a variável de ambiente `LOCK_STORE` e, portanto, você pode alternar entre diferentes armazenamentos em diferentes ambientes. Por exemplo, use o armazenamento `memory` durante o teste e o armazenamento `redis` para desenvolvimento e produção.

Além disso, a variável de ambiente deve ser validada para permitir um dos armazenamentos pré-configurados. A validação é definida dentro do arquivo `start/env.ts` usando a regra `Env.schema.enum`.

```ts
{
  LOCK_STORE: Env.schema.enum(['redis', 'database', 'memory'] as const),
}
```

### Loja Redis
A loja `redis` tem uma dependência de peer no pacote `@adonisjs/redis`; portanto, você deve configurar este pacote antes de usar a loja Redis.

A seguir está a lista de opções que a loja Redis aceita:

```ts
{
  redis: stores.redis({
    connectionName: 'main',
  }),
}
```

#### `connectionName`

A propriedade `connectionName` se refere a uma conexão definida dentro do arquivo `config/redis.ts`.

### Loja de banco de dados

A loja `database` tem uma dependência de peer no pacote `@adonisjs/lucid` e, portanto, você deve configurar este pacote antes de usar a loja de banco de dados.

A seguir está a lista de opções que o armazenamento de banco de dados aceita:

```ts
{
  database: stores.database({
    connectionName: 'postgres',
    tableName: 'my_locks',
  }),
}
```

#### `connectionName`

Referência à conexão de banco de dados definida no arquivo `config/database.ts`. Se não estiver definida, usaremos a conexão de banco de dados padrão.

#### `tableName`

A tabela de banco de dados a ser usada para armazenar limites de taxa.

### Armazenamento de memória

O armazenamento `memory` é um armazenamento simples na memória que pode ser útil para fins de teste, mas não apenas. Às vezes, para alguns casos de uso, você pode querer ter um bloqueio que seja válido apenas para o processo atual e não compartilhado entre vários.

O armazenamento de memória é construído sobre o pacote [`async-mutex`](https://www.npmjs.com/package/async-mutex).

```ts
{
  memory: stores.memory(),
}
```

## Bloqueando um recurso

Depois de configurar seu armazenamento de bloqueio, você pode começar a usar bloqueios para proteger seus recursos em qualquer lugar dentro do seu aplicativo.

Aqui está um exemplo simples de como usar bloqueios para proteger um recurso.

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

Este é um exemplo rápido de como usar bloqueios dentro do seu aplicativo.

Existem muitos outros métodos disponíveis para gerenciar bloqueios, como `extend` para estender a duração do bloqueio, `getRemainingTime` para obter o tempo restante antes que o bloqueio expire, opções para configurar o bloqueio e muito mais.

**Para isso, certifique-se de ler a [documentação do Verrou](https://verrou.dev/docs/introduction) para mais detalhes**. Como lembrete, o pacote `@adonisjs/lock` é baseado no pacote `Verrou`, então tudo o que você lê na documentação do Verrou também é aplicável ao pacote `@adonisjs/lock`.

## Usando outro armazenamento

Se você definiu vários armazenamentos dentro do arquivo `config/lock.ts`, você pode usar um armazenamento diferente para um bloqueio específico usando o método `use`.

```ts
import locks from '@adonisjs/lock/services/main'

const lock = locks.use('redis').createLock('order.processing.1')
```

Caso contrário, se estiver usando apenas o armazenamento `default`, você pode omitir o método `use`.

```ts
import locks from '@adonisjs/lock/services/main'

const lock = locks.createLock('order.processing.1')
```

## Gerenciando bloqueios em vários processos

Às vezes, você pode querer ter um processo criando e adquirindo um bloqueio, e outro processo liberando-o. Por exemplo, você pode querer adquirir um bloqueio dentro de uma solicitação da web e liberá-lo dentro de um trabalho em segundo plano. Isso é possível usando o método `restoreLock`.

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

## Testes

Durante os testes, você pode usar o armazenamento `memory` para evitar fazer solicitações de rede reais para adquirir bloqueios. Você pode fazer isso definindo a variável de ambiente `LOCK_STORE` como `memory` dentro do arquivo `.env.testing`.

```env
// title: .env.test
LOCK_STORE=memory
```

## Crie um armazenamento de bloqueio personalizado

Primeiro, certifique-se de consultar a [documentação do Verrou](https://verrou.dev/docs/custom-lock-store) que se aprofunda na criação de um armazenamento de bloqueio personalizado. No AdonisJS, será praticamente o mesmo.

Vamos criar um armazenamento Noop simples que não faz nada. Primeiro, devemos criar uma classe que implementará a interface `LockStore`.

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

### Definindo a fábrica da loja

Depois de criar sua loja, você deve definir uma função de fábrica simples que será usada por `@adonisjs/lock` para criar uma instância da sua loja.

```ts
function noopStore(options: MyNoopStoreConfig) {
  return { driver: { factory: () => new NoopStore(options) } }
}
```

### Usando a loja personalizada

Depois de feito, você pode usar a função `noopStore` da seguinte forma:

```ts
import { defineConfig } from '@adonisjs/lock'

const lockConfig = defineConfig({
  default: 'noop',
  stores: {
    noop: noopStore({}),
  },
})
```
