# Inserir construtor de consulta

O construtor de consulta de inserção permite que você insira novas linhas no banco de dados. Você deve usar o [construtor de consulta padrão](./query-builder.md) para **selecionar**, **excluir** ou **atualizar** linhas.

Você pode obter acesso ao construtor de consulta de inserção conforme mostrado no exemplo a seguir:
``
```ts
import Database from '@ioc:Adonis/Lucid/Database'

Database.insertQuery()

// selecionar tabela também retorna uma instância do construtor de consultas
Database.table('users')
```

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis na classe do construtor de consulta de inserção.

### `insert`
O método `insert` aceita um objeto de par chave-valor para inserir.

O valor de retorno da consulta de inserção é altamente dependente do driver subjacente.

- O MySQL retorna o id da última linha inserida.
- O SQLite retorna o id da última linha inserida.
- Para PostgreSQL, MSSQL e Oracle, você deve usar o método `returning` para buscar o valor do id.

```ts
Database
  .table('users')
  .returning('id')
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: await Hash.make('secret'),
  })
```

### `multiInsert`
O método `multiInsert` aceita uma matriz de objetos e insere várias linhas de uma vez.

```ts
Database
  .table('users')
  .multiInsert([
    {
      username: 'virk',
      email: 'virk@adonisjs.com',
      password: await Hash.make('secret'),
    },
    {
      username: 'romain',
      email: 'romain@adonisjs.com',
      password: await Hash.make('secret'),
    }
  ])

/**
INSERT INTO "users"
  ("email", "password", "username")
values
  ('virk@adonisjs.com', '$argon2id...', 'virk'),
  ('romain@adonisjs.com', '$argon2id...', 'romain')
*/
```

### `returning`
Você pode usar o método `returning` com bancos de dados PostgreSQL, MSSQL e Oracle para recuperar valores de uma ou mais colunas.

```ts
const rows = Database
  .table('users')
  .returning(['id', 'username'])
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: await Hash.make('secret'),
  })

console.log(rows[0].id, rows[0].username)
```

### `debug`
O método `debug` permite habilitar ou desabilitar a depuração em um nível de consulta individual. Aqui está um [guia completo](../../guides/database/debugging.md) sobre consultas de depuração.

```ts
const rows = Database
  .table('users')
  .debug(true) // 👈
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: await Hash.make('secret'),
  })
```

### `timeout`
Defina o `timeout` para a consulta. Uma exceção é gerada após o tempo limite ter sido excedido.

O valor do tempo limite é sempre em milissegundos.

```ts
Database
  .table('users')
  .timeout(2000) // 👈
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: await Hash.make('secret'),
  })
```

Você também pode cancelar a consulta ao usar tempos limite com MySQL e PostgreSQL.

```ts
Database
  .table('users')
  .timeout(2000, { cancel: true })
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: await Hash.make('secret'),
  })
```

### `toSQL`
O método `toSQL` retorna o SQL da consulta e as ligações como um objeto.

```ts
const output = Database
  .table('users')
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: await Hash.make('secret'),
  })
  .toSQL() // 👈

console.log(output)
```

O objeto `toSQL` também tem o método `toNative` para formatar a consulta SQL de acordo com o dialeto do banco de dados em uso.

```ts
const output = Database
  .table('users')
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: await Hash.make('secret'),
  })
  .toSQL()
  .toNative()

console.log(output)
```

### `toQuery`
Retorna a consulta SQL como uma string com ligações aplicadas aos espaços reservados.

```ts
const output = Database
  .table('users')
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: await Hash.make('secret'),
  })
  .toQuery()

console.log(output)
/**
INSERT INTO "users"
  ("email", "password", "username")
values
  ('virk@adonisjs.com', '$argon2id...', 'virk')
*/
```

### `useTransaction`
O método `useTransaction` instrui o construtor de consultas a encapsular a consulta dentro de uma transação. O guia sobre [transações de banco de dados](../../guides/database/transactions.md) abrange diferentes maneiras de criar e usar transações em seu aplicativo.

```ts
const trx = await Database.transaction()

await Database
  .table('users')
  .useTransaction(trx) // 👈
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: await Hash.make('secret'),
  })

await trx.commit()
```

## Propriedades e métodos úteis
A seguir está a lista de propriedades e métodos que você pode precisar ocasionalmente ao criar algo em cima do construtor de consultas.

### `client`
Referência à instância do [cliente de consulta de banco de dados](./query-client.md) subjacente.

```ts
const query = Database.insertQuery()
console.log(query.client)
```

### `knexQuery`
Referência à instância da consulta KnexJS subjacente.

```ts
const query = Database.insertQuery()
console.log(query.knexQuery)
```

### `reporterData`
O construtor de consultas emite o evento `db:query` e relata o tempo de execução da consulta com o profiler do framework.

Usando o método `reporterData`, você pode passar detalhes adicionais para o evento e o profiler.

```ts
const query = Database.table('users')

await query
  .reporterData({ userId: auth.user.id })
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: await Hash.make('secret'),
  })
```

Dentro do evento `db:query`, você pode acessar o valor de `userId` da seguinte forma.

```ts
Event.on('db:query', (query) => {
  console.log(query.userId)
})
```
