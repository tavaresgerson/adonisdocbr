# Inserir construtor de consulta

O construtor de consulta de inserção permite que você insira novas linhas no banco de dados. Você deve usar o [select query builder](./select.md) para **selecionar**, **excluir** ou **atualizar** linhas.

Você pode obter acesso ao construtor de consulta de inserção conforme mostrado no exemplo a seguir:

```ts
import db from '@adonisjs/lucid/services/db'

db.insertQuery()

// selecionar tabela também retorna uma instância do construtor de consultas
db.table('users')
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
db
  .table('users')
  .returning('id')
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: 'secret',
  })
```

### `multiInsert`
O método `multiInsert` aceita uma matriz de objetos e insere várias linhas de uma vez.

```ts
db
  .table('users')
  .multiInsert([
    {
      username: 'virk',
      email: 'virk@adonisjs.com',
      password: 'secret',
    },
    {
      username: 'romain',
      email: 'romain@adonisjs.com',
      password: 'secret',
    }
  ])

/**
INSERT INTO "users"
  ("email", "password", "username")
values
  ('virk@adonisjs.com', 'secret', 'virk'),
  ('romain@adonisjs.com', 'secret', 'romain')
*/
```

### `returning`
Você pode usar o método `returning` com bancos de dados PostgreSQL, MSSQL e Oracle para recuperar valores de uma ou mais colunas.

```ts
const rows = db
  .table('users')
  .returning(['id', 'username'])
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: 'secret',
  })

console.log(rows[0].id, rows[0].username)
```

### `debug`
O método `debug` permite habilitar ou desabilitar a depuração em um nível de consulta individual. Aqui está um [guia completo](../guides/debugging.md) sobre consultas de depuração.

```ts {3}
const rows = db
  .table('users')
  .debug(true)
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: 'secret',
  })
```

### `timeout`
Defina o `timeout` para a consulta. Uma exceção é gerada após o tempo limite ter sido excedido.

O valor do tempo limite é sempre em milissegundos.

```ts {3}
db
  .table('users')
  .timeout(2000)
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: 'secret',
  })
```

Você também pode cancelar a consulta ao usar tempos limite com MySQL e PostgreSQL.

```ts
db
  .table('users')
  .timeout(2000, { cancel: true })
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: 'secret',
  })
```

### `toSQL`
O método `toSQL` retorna o SQL da consulta e as ligações como um objeto.

```ts {8}
const output = db
  .table('users')
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: 'secret',
  })
  .toSQL()

console.log(output)
```

O objeto `toSQL` também tem o método `toNative` para formatar a consulta SQL de acordo com o dialeto do banco de dados em uso.

```ts
const output = db
  .table('users')
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: 'secret',
  })
  .toSQL()
  .toNative()

console.log(output)
```

### `toQuery`
Retorna a consulta SQL como uma string com ligações aplicadas aos espaços reservados.

```ts
const output = db
  .table('users')
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: 'secret',
  })
  .toQuery()

console.log(output)
/**
INSERT INTO "users"
  ("email", "password", "username")
values
  ('virk@adonisjs.com', 'secret', 'virk')
*/
```

## Propriedades e métodos úteis
A seguir está a lista de propriedades e métodos que você pode precisar ocasionalmente ao construir algo em cima do construtor de consultas.

### `client`
Referência à instância do [cliente de consulta de banco de dados](https://github.com/adonisjs/lucid/blob/develop/src/query_client/index.ts) subjacente.

```ts
const query = db.insertQuery()
console.log(query.client)
```

### `knexQuery`
Referência à instância da consulta KnexJS subjacente.

```ts
const query = db.insertQuery()
console.log(query.knexQuery)
```

### `reporterData`
O construtor de consultas emite o evento `db:query` e relata o tempo de execução da consulta com o profiler do framework.

Usando o método `reporterData`, você pode passar detalhes adicionais para o evento e o profiler.

```ts
const query = db.table('users')

await query
  .reporterData({ userId: auth.user.id })
  .insert({
    username: 'virk',
    email: 'virk@adonisjs.com',
    password: 'secret',
  })
```

Dentro do evento `db:query`, você pode acessar o valor de `userId` da seguinte forma.

```ts
import emitter from '@adonisjs/lucid/services/emitter'

emitter.on('db:query', (query) => {
  console.log(query.userId)
})
```
