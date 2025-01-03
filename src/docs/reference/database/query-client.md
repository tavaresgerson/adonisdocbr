# Cliente de consulta

O [cliente de consulta](https://github.com/adonisjs/lucid/blob/efed38908680cca3b288d9b2a123586fab155b1d/src/QueryClient/index.ts#L38) funciona como uma ponte entre a [conexão](./connection.md) e o [construtor de consultas](./query-builder.md) para executar as consultas do banco de dados. Além disso, ele expõe as APIs necessárias usadas pelo construtor de consultas para direcionar consultas de leitura para a réplica de leitura e grava a réplica de gravação.

Você pode acessar o cliente de consulta da seguinte forma:

```ts
import Database from '@ioc:Adonis/Lucid/Database'

// retorna o cliente para a conexão padrão
const client = Database.connection()

// retorna o cliente para uma conexão nomeada
const pgClient = Database.connection('pg')
```

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis na classe do cliente de consulta.

### `query`
Retorna uma instância do [query builder](./query-builder.md) para uma conexão de banco de dados pré-selecionada.

```ts
client.query()
```

Você também pode usar o alias `from` para instanciar uma nova instância de consulta e selecionar a tabela.

```ts
client.from('users')
```

### `insertQuery`
Retorna uma instância do [insert query builder](./insert-query-builder.md) para uma conexão de banco de dados pré-selecionada.

```ts
client.insertQuery()
```

Você também pode usar o alias `table` para instanciar uma nova instância de consulta e selecionar a tabela.

```ts
client.table('users')
```

### `modelQuery`
Retorna uma instância do [model query builder](../orm/query-builder.md) para um determinado modelo Lucid.

```ts
import User from 'App/Models/User'

const query = client.modelQuery(User)

const user = await query.first()
console.log(user instanceof User) // true
```

### `rawQuery`
Retorna uma instância do [raw query builder](./raw-query-builder.md) para uma conexão de banco de dados pré-selecionada.

```ts
await client
  .rawQuery('select * from users where id = ?', [1])
```

### `knexQuery`
Retorna uma instância do [Knex.js query builder](https://knexjs.org/#Builder) para uma conexão de banco de dados pré-selecionada.

```ts
client.knexQuery().select('*')
```

### `knexRawQuery`
Retorna uma instância do [Knex.js raw query builder](https://knexjs.org/#Raw) para uma conexão de banco de dados pré-selecionada.

```ts
client
  .knexRawQuery('select * from users where id = ?', [1])
```

### `transaction`
Cria uma nova instância de [cliente de transação](./transaction-client.md). O cliente de transação **reserva uma conexão de banco de dados dedicada** imediatamente e, portanto, é muito importante confirmar ou reverter as transações corretamente.

```ts
const trx = await client.transaction()
await trx.insertQuery().table('users').insert()

await trx.commit()
```

### `getAllTables`
Retorna uma matriz de todas as tabelas do banco de dados.

```ts
const tables = await client.getAllTables()
console.log(tables)
```

### `getAllViews`
Retorna uma matriz de todas as visualizações do banco de dados.

```ts
const views = await client.getAllViews()
console.log(views)
```

### `getAllTypes`
Retorna uma matriz de todos os tipos personalizados do banco de dados. O método funciona apenas com **Postgres e Redshift**.

```ts
const types = await client.getAllTypes()
console.log(types)
```

### `columnsInfo`
Retorna um par de colunas chave-valor em uma determinada tabela do banco de dados.

```ts
const columns = await client.columnsInfo('users')
console.log(columns)
```

### `dropAllTables`
Remove todas as tabelas dentro do banco de dados.

```ts
await client.dropAllTables()

// especifica esquemas (para Postgres e Redshift)
await client.dropAllTables(['public'])
```

### `dropAllViews`
Remove todas as visualizações dentro do banco de dados.

```ts
await client.dropAllViews()

// especifica esquemas (para Postgres e Redshift)
await client.dropAllViews(['public'])
```

### `dropAllTypes`
Remove todos os tipos personalizados dentro do banco de dados. O método funciona apenas com **Postgres e Redshift**.

```ts
await client.dropAllTypes()
```

### `truncate`
Trunca uma tabela de banco de dados. Opcionalmente, você também pode cascatear referências de chave estrangeira.

```ts
await client.truncate('users')

// cascata
await client.truncate('users', true)
```

### `getReadClient`
Retorna a instância Knex.js para a réplica de leitura. O cliente de gravação é retornado quando não se usa réplicas de leitura/gravação.

```ts
const knex = client.getReadClient()
```

### `getWriteClient`
Retorna a instância Knex.js para a réplica de gravação. Uma exceção é gerada quando o cliente é instanciado no modo de leitura.

```ts
const knex = client.getWriteClient()
```

### `getAdvisoryLock`
Chamar `getAdvisoryLock` obtém um bloqueio consultivo em bancos de dados **PostgreSQL** e **MySQL**.

::: info NOTA
Bloqueios consultivos são usados ​​por migrações de banco de dados para evitar que vários processos migrem o banco de dados ao mesmo tempo.
:::

```ts
await client.getAdvisoryLock('key_name')

// tempo limite personalizado
await client.getAdvisoryLock('key_name', 2000)
```

### `releaseAdvisoryLock`
Libera o bloqueio consultivo adquirido anteriormente

```ts
await client.releaseAdvisoryLock('key_name')
```

### `raw`
Cria uma instância de consulta de referência bruta. As consultas geradas usando o método `raw` só podem ser usadas como referência em outras consultas e não podem ser executadas de forma independente.

```ts
await client.from(
  client.raw('select ip_address from user_logins')
)
```

### `mode`
Uma propriedade somente leitura para saber o modo em que a instância do cliente foi criada. É sempre um dos seguintes

- `dual`: Ambas as consultas de leitura/gravação são suportadas e serão direcionadas para a réplica correta.
- `write`: As consultas de leitura também serão enviadas para a réplica `write`.
- `read`: Nenhuma consulta de gravação pode ser executada.

```ts
console.log(client.mode)
```

### `dialect`
Referência ao [dialeto do banco de dados](https://github.com/adonisjs/lucid/tree/master/src/Dialects) subjacente. Cada driver de banco de dados suportado tem seu próprio dialeto.

```ts
console.log(client.dialect.name)
```

### `isTransaction`
Descubra se o cliente é um cliente de transação. O valor é sempre `false` para o cliente de consulta.

```ts
client.isTransaction
```

### `connectionName`
O nome da conexão para o qual o cliente de consulta foi instanciado

```ts
client.connectionName
```

### `debug`
Defina o valor como `true` para habilitar a depuração para consultas executadas pelo cliente de consulta.

```ts
client.debug = true

await client.from('users').select('*')
```

### `schema`
Retorna referência ao [construtor de esquema](./schema-builder.md). O `client.schema` é um getter que retorna uma nova instância toda vez que você acessa a propriedade

```ts
await client.schema.createTable('users', (table) => {
})
```
