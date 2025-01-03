# Banco de dados

O módulo de banco de dados expõe as APIs para interagir com os bancos de dados SQL. Você pode importar o módulo da seguinte forma:

```ts
import Database from '@ioc:Adonis/Lucid/Database'
```

## Métodos/Propriedades
A seguir está a lista de métodos/propriedades disponíveis no módulo de banco de dados.

### `connection`
Retorna o cliente de consulta para uma determinada conexão. Usa a conexão padrão, quando nenhum nome de conexão explícito é definido.

```ts
Database.connection()

// conexão nomeada
Database.connection('pg')
```

Você também pode obter a instância do cliente de consulta para um modo específico.

```ts
Database.connection('pg', { mode: 'write' })

// Consultas de gravação não são permitidas no modo de leitura
Database.connection('pg', { mode: 'read' })
```

### `beginGlobalTransaction`
Inicie uma transação global. Todas as consultas após o início da transação global serão executadas dentro da transação.

::: warning ATENÇÃO
Recomendamos usar este método apenas durante os testes.
:::

```ts
await Database.beginGlobalTransaction()

// para uma conexão nomeada
await Database.beginGlobalTransaction('pg')
```

### `commitGlobalTransaction`
Confirma uma transação global criada anteriormente

```ts
await Database.commitGlobalTransaction()
await Database.commitGlobalTransaction('pg')
```

### `rollbackGlobalTransaction`
Reverte uma transação global criada anteriormente

```ts
await Database.rollbackGlobalTransaction()
await Database.rollbackGlobalTransaction('pg')
```

### `report`
Retorna o relatório de verificação de integridade para todas as conexões registradas.

```ts
const report = await Database.report()

console.log(report.name)
console.log(report.health.healthy)
```

### `query`
Alias ​​para o método [client.query](./query-client.md#query).

```ts
Database.query()
```

### `insertQuery`
Alias ​​para o método [client.insertQuery](./query-client.md#insert-query).

```ts
Database.insertQuery()
```

### `modelQuery`
Alias ​​para o método [client.modelQuery](./query-client.md#model-query).

```ts
import User from 'App/Models/User'
const query = Database.modelQuery(User)
```

### `rawQuery`
Alias ​​para o método [client.rawQuery](./query-client.md#raw-query).

```ts
await Database
  .rawQuery('select * from users where id = ?', [1])
```

### `knexQuery`
Alias ​​para o método [client.knexQuery](./query-client.md#knex-query).

```ts
Database.knexQuery()
```

### `knexRawQuery`
Alias ​​para o método [client.knexRawQuery](./query-client.md#knex-raw-query).

```ts
Database
  .knexRawQuery('select * from users where id = ?', [1])
```

### `ref`
O método `ref` permite que você faça referência a um nome de coluna do banco de dados como um valor. Por exemplo:

```ts
Database
  .from('users')
  .where('users.id', '=', Database.ref('user_logins.user_id'))
```

### `raw`
O método `raw` cria uma instância do [RawBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Database/StaticBuilder/Raw.ts). Esta consulta deve ser usada como uma referência dentro de outra consulta.

#### Qual é a diferença entre `rawQuery` e `raw`?
Você pode executar a consulta criada usando o método `rawQuery`. Enquanto isso, a consulta criada usando o método `raw` só pode ser passada como uma referência.

```ts
Database
  .from('users')
  .select('*')
  .select(
    Database
      .raw('select "ip_address" from "user_logins" where "users.id" = "user_logins.user_id" limit 1')
      .wrap('(', ')')
  )
```

### `from`
Um método de atalho para obter uma instância do [Query builder](./query-builder.md) para a conexão primária.

```ts
Database.from('users')
// É o mesmo que
Database.connection().from('users')
```

### `table`
Um método de atalho para obter uma instância do [Insert Query builder](./insert-query-builder.md) para a conexão primária.

```ts
Database.table('users')
// É o mesmo que
Database.connection().table('users')
```

### `transaction`
Alias ​​para o método [client.transaction](./query-client.md#transaction).

```ts
await Database.transaction()
```

### `prettyPrint`
Um método auxiliar para imprimir o log de consulta emitido como evento `db:query`.

```ts
import Event from '@ioc:Adonis/Core/Event'
Event.on('db:query', Database.prettyPrint)
```

### `hasHealthChecksEnabled`
Um booleano para saber se as verificações de integridade estão habilitadas para pelo menos uma conexão ou não.

```ts
console.log(Database.hasHealthChecksEnabled)
```

### `primaryConnectionName`
Retorna o nome da conexão padrão/primária definida dentro do arquivo `config/database`.

```ts
console.log(Database.primaryConnectionName)
```

### `manager`
Retorna a referência ao [gerenciador de conexões](./connection-manager.md)

```ts
console.log(Database.manager)
```
