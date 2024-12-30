# Depuração

O Lucid emite o evento `db:query` quando a depuração é habilitada globalmente ou para uma consulta individual.

Você pode habilitar a depuração globalmente definindo o sinalizador `debug` como `true` dentro do arquivo `config/database.ts`.

```ts
{
  client: 'pg',
  connection: {},
  debug: true, // 👈
}
```

Você pode habilitar a depuração para uma consulta individual usando o método `debug` no construtor de consultas.

::: code-group

```ts [Select]
Database
  .query()
  .select('*')
  .debug(true) // 👈
```

```ts [Insert]
Database
  .insertQuery()
  .debug(true) // 👈
  .insert({})
```

```ts [Raw]
Database
  .rawQuery('select * from users')
  .debug(true) // 👈
```

:::

## Ouvindo o evento
Depois de habilitar a depuração, você pode ouvir o evento `db:query` usando o módulo [Event](../digging-deeper/events.md).

```ts
// start/events.ts

import Event from '@ioc:Adonis/Core/Event'

Event.on('db:query', function ({ sql, bindings }) {
  console.log(sql, bindings)
})
```

### Consultas de impressão bonita
Você pode usar o método `Database.prettyPrint` como o ouvinte de eventos para imprimir as consultas no console.

```ts
import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'

Event.on('db:query', Database.prettyPrint)
```

![](/docs/assets/query-events.webp)

## Depuração em produção
Consultas de impressão bonita adicionam sobrecarga adicional ao processo e podem impactar o desempenho do seu aplicativo. Portanto, recomendamos usar o [Logger](../digging-deeper/logger.md) para registrar as consultas do banco de dados durante a produção.

A seguir está um exemplo completo de como alternar o ouvinte de eventos com base no ambiente do aplicativo.

```ts
import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'

import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'

Event.on('db:query', (query) => {
  if (Application.inProduction) {
    Logger.debug(query)    
  } else {
    Database.prettyPrint(query)
  }
})
```
