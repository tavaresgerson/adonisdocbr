---
summary: Um guia sobre depuração de consultas de banco de dados Lucid.
---

# Depuração

Você pode depurar consultas SQL primeiro habilitando o modo `debug` e então escutar o evento `db:query` para ser notificado conforme as consultas SQL são executadas.

O modo de depuração pode ser habilitado globalmente para uma conexão de banco de dados definindo o sinalizador `debug` como `true` dentro do arquivo `config/database.ts`. Por exemplo:

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

Ou você pode habilitá-lo para uma consulta individual usando o método `debug` no construtor de consultas.

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

## Impressão bonita de consultas de depuração
Depois que a depuração for habilitada, você pode definir o sinalizador `prettyPrintDebugQueries` como `true` no arquivo `config/database.ts`.

Este sinalizador registrará um ouvinte de eventos para o evento `db:query` e imprimirá as consultas SQL no console.

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

## Escutando manualmente o evento
Se você não quiser imprimir consultas SQL e gravá-las no console, poderá autoescutar o evento `db:query` e autogerenciar o tratamento dos logs de depuração.

No exemplo a seguir, usamos o registrador de aplicativos para registrar as consultas.

```ts
// title: start/events.ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('db:query', function (query) {
  logger.debug(query)
})
```
