# Query Builder

O AdonisJs *Query Builder* fornece uma sintaxe unificada para interagir com bancos de dados SQL usando métodos JavaScript.

Este guia é uma referência a todos os métodos disponíveis no *Query Builder*.

::: tip DICA
Veja o guia database [Getting Started](/docs/07-Database/01-Getting-Started.md) para a lista de bancos de dados suportados, opções de configuração e como depurar suas consultas SQL.
:::

## Introdução
Escrever consultas SQL pode ser tedioso, mesmo se você for proficiente em SQL.

### Abstração de Sintaxe

Imagine que todas as suas consultas são escritas para MySQL e, mais tarde, você é solicitado a migrar tudo para PostgreSQL. Você teria que reescrever/alterar suas consultas MySQL para garantir que elas ainda funcionem bem com PostgreSQL.

O *Query Builder* abstrai a sintaxe específica da conexão para que você fique livre para se concentrar na funcionalidade do seu aplicativo em vez de variações em dialetos SQL.

### Consultas condicionais
Outro problema pode ser a construção de consultas incrementais com blocos condicionais:

```js
// Without Query Builder

const sql = 'SELECT * FROM `users`'

if (username) {
  sql += ' WHERE `username` = ' + username
}
```

```js
// With Query Builder

const query = Database.table('users')

if (username) {
  query.where('username', username)
}
```

## Exemplo básico
Aqui está um exemplo básico usando o *Query Builder* para encadear métodos diferentes:

```js
const Database = use('Database')

class UserController {

  async index (request, response) {
    return await Database
      .table('users')
      .where('username', 'john')
      .first()
  }

}
```

## Selects
O método `select` define os campos a serem selecionados para uma determinada consulta:

```js
await Database.select('id', 'username').from('users')
// ou
await Database.select('*').from('users')
```

```sql
-- SQL Output

select `id`, `username` from `users`
select * from `users`
```

Você pode definir *aliases* de consulta assim:

```js
await Database.select('username as uname')
```

## Cláusulas Where
O *Query Builder* oferece vários métodos dinâmicos para adicionar cláusulas *where*.

Ele também oferece suporte a subconsultas passando um *closure* ou *outra consulta* em vez do valor real.

Para informações detalhadas sobre `where`, veja a [documentação](http://knexjs.org/#Builder-wheres) do Knex.

::: warning NOTA
Passar `undefined` para a cláusula `where` causa um erro durante a compilação do SQL, então garanta que valores dinâmicos não sejam `undefined` antes de passá-los.
:::

#### `where`

```js
const users = await Database.from('users').where('id', 1)
// Or
const users = await Database.from('users').where({ id: 1 })
```

Você pode passar um operador de comparação para a cláusula `where` assim:

```js
const adults = await Database
  .from('users')
  .where('age', '>', 18)
```

#### `where(with callback)`
Você pode passar um callback para a cláusula `where` para agrupar todas as cláusulas contidas no callback:

```js
await Database.from('users').where(function () {
  this
    .where('id', 1)
    .orWhere('id', '>', 10)
})
```

```sql
--- SQL Output

select * from `users` where (`id` = 1 or `id` > 10)
```

#### `whereNot`

```js
await Database
  .from('users')
  .whereNot('age', '>', 15)

// or
await Database
  .from('users')
  .whereNot({username: 'foo'})
```

#### `whereIn`

```js
await Database
  .from('users')
  .whereIn('id', [1,2,3])
```

#### `whereNotIn`

```js
await Database
  .from('users')
  .whereNotIn('id', [1,2,3])
```

#### `whereNull`

```js
await Database
  .from('users')
  .whereNull('deleted_at')
```

#### `whereNotNull`

```js
await Database
  .from('users')
  .whereNotNull('created_at')
```

#### `whereExists`

```js
await Database.from('users').whereExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```

#### `whereNotExists`

```js
await Database.from('users').whereNotExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```

#### `whereBetween`

```js
await Database
  .table('users')
  .whereBetween('age', [18, 32])
```

#### `whereNotBetween`

```js
await Database
  .table('users')
  .whereNotBetween('age', [45, 60])
```

#### `whereRaw`
Auxiliar de conveniência para `.where(Database.raw(query))`:

```js
await Database
  .from('users')
  .whereRaw('id = ?', [20])
```

## Joins

#### `innerJoin`

```js
await Database
  .table('users')
  .innerJoin('accounts', 'users.id', 'accounts.user_id')
```

Você também pode passar um retorno de chamada para construir a junção:

```js
await Database
  .table('users')
  .innerJoin('accounts', function () {
    this
      .on('users.id', 'accounts.user_id')
      .orOn('users.id', 'accounts.owner_id')
  })
```

#### `leftJoin`

```js
Database
  .select('*')
  .from('users')
  .leftJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `leftOuterJoin`

```js
await Database
  .select('*')
  .from('users')
  .leftOuterJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `rightJoin`

```js
await Database
  .select('*')
  .from('users')
  .rightJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `rightOuterJoin`

```js
await Database
  .select('*')
  .from('users')
  .rightOuterJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `outerJoin`

```js
await Database
  .select('*')
  .from('users')
  .outerJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `fullOuterJoin`

```js
await Database
  .select('*')
  .from('users')
  .fullOuterJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `crossJoin`

```js
await Database
  .select('*')
  .from('users')
  .crossJoin('accounts', 'users.id', 'accounts.user_id')
```

#### `joinRaw`

```js
await Database
  .select('*')
  .from('accounts')
  .joinRaw('natural full join table1').where('id', 1)
```

## Ordenação e Limites

#### `distinct`

```js
await Database
  .table('users')
  .distinct('age')
```

#### `groupBy`

```js
await Database
  .table('users')
  .groupBy('age')
```

#### `groupByRaw`

```js
await Database
  .table('users')
  .groupByRaw('age, status')
```

#### `orderBy(column, [direction=asc])`

```js
await Database
  .table('users')
  .orderBy('id', 'desc')
```

#### `orderByRaw(column, [direction=asc])`

```js
await Database
  .table('users')
  .orderByRaw('col NULLS LAST DESC')
```

#### `having(column, operator, value)`

::: warning OBSERVAÇÃO
`groupBy()` deve ser chamado antes de `having()`.
:::

```js
await Database
  .table('users')
  .groupBy('age')
  .having('age', '>', 18)
```

#### `offset/limit(value)`

```js
await Database
  .table('users')
  .offset(11)
  .limit(10)
```

## Inserções

#### `insert(values)`
A operação `insert` cria uma linha e retorna seu `id` recém-criado:

```js
const userId = await Database
  .table('users')
  .insert({username: 'foo', ...})
```

No caso de inserções em massa, o `id` do primeiro registro é retornado (esta é uma limitação do próprio MySQL; veja [LAST_INSERT_ID](http://dev.mysql.com/doc/refman/5.6/en/information-functions.html#function_last-insert-id)):

```js
// BULK INSERT
const firstUserId = await Database
  .from('users')
  .insert([{username: 'foo'}, {username: 'bar'}])
```

#### `into(tableName)`
O método `into` é uma alternativa mais legível do que usar `table/from` ao inserir linhas de banco de dados:

```js
const userId = await Database
  .insert({username: 'foo', ...})
  .into('users')
```

### Coluna de Retorno PostgreSQL
Para PostgreSQL, você tem que definir a coluna de retorno explicitamente (todos os outros clientes de banco de dados ignoram esta declaração):

```js
const userId = await Database
  .insert({ username: 'virk' })
  .into('users')
  .returning('id')
```

## Atualizações
Todas as operações de atualização retornam o número de linhas afetadas:

```js
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .update('lastname', 'Virk')
```

Para atualizar várias colunas, passe essas colunas/valores como um objeto:

```js
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .update({ lastname: 'Virk', firstname: 'Aman' })
```

## Exclusões

#### `delete`
As operações de exclusão também retornam o número de linhas afetadas:

```js
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .delete()
```

::: info NOTA
Como `delete` é uma palavra-chave reservada em JavaScript, você também pode usar o método alternativo `del()`.
:::

#### `truncate`
Truncate remove todas as linhas da tabela, redefinindo o ID de incremento automático da tabela para `0`:

```js
await Database.truncate('users')
```

## Paginação
*Query Builder* fornece métodos convenientes para paginar resultados do banco de dados.

#### `forPage(page, [limit=20])`

```js
const users = await Database
  .from('users')
  .forPage(1, 10)
```

#### `paginate(page, [limit=20])`

```js
const results = await Database
  .from('users')
  .paginate(2, 10)
```

::: info NOTA
A saída do método `paginate` é diferente do método `forPage`.
:::

```js
// .Output

{
  total: '',
  perPage: '',
  lastPage: '',
  page: '',
  data: [{...}]
}
```

::: warning NOTA
Se estiver usando *PostgreSQL*, a chave `total` será uma string, pois o JavaScript não consegue manipular `bigint` nativamente (veja [este problema](https://github.com/adonisjs/adonis-lucid/issues/339#issuecomment-387399508) para uma solução recomendada).
:::

## Transações de banco de dados
As transações de banco de dados são operações seguras que não são refletidas no banco de dados até que você confirme explicitamente suas alterações.

#### `beginTransaction`
O método `beginTransaction` retorna o objeto de transação, que pode ser usado para executar quaisquer consultas:

```js
const trx = await Database.beginTransaction()
await trx.insert({username: 'virk'}).into('users')

await trx.commit() // insert query will take place on commit
await trx.rollback() // will not insert anything
```

#### `transaction`
Você também pode encapsular suas transações dentro de um retorno de chamada:

```js
await Database.transaction(async (trx) => {
  await trx.insert({username: 'virk'}).into('users')
})
```

::: info NOTA
Você não precisa chamar `commit` ou `rollback` manualmente dentro deste retorno de chamada.
:::

Se qualquer uma de suas consultas gerar um erro, a transação será revertida automaticamente, caso contrário, ela será confirmada.

## Agregados

*Query Builder* expõe todo o poder dos [métodos agregados](http://knexjs.org/#Builder-count) do Knex.

#### `count()`

```js
const count = await Database
  .from('users')
  .count()                                      // returns array

const total = count[0]['count(*)']              // returns number

// COUNT A COLUMN
const count = await Database
  .from('users')
  .count('id')                                  // returns array

const total = count[0]['count("id")']           // returns number

// COUNT COLUMN AS NAME
const count = await Database
  .from('users')
  .count('* as total')                          // returns array

const total = count[0].total                    // returns number
```

#### `countDistinct`
`countDistinct` é o mesmo que `count`, mas adiciona uma expressão `distinct`:

```js
const count = await Database
  .from('users')
  .countDistinct('id')                          // returns array

const total = count[0]['count(distinct "id")']  // returns number
```

#### `min`

```js
await Database.from('users').min('age')         // returns array
await Database.from('users').min('age as a')    // returns array
```

#### `max`

```js
await Database.from('users').max('age')         // returns array
await Database.from('users').max('age as a')    // returns array
```

#### `sum`
```js
await Database.from('cart').sum('total')        // returns array
await Database.from('cart').sum('total as t')   // returns array
```

#### `sumDistinct`
```js
await Database.from('cart').sumDistinct('total')      // returns array
await Database.from('cart').sumDistinct('total as t') // returns array
```

#### `avg`
```js
await Database.from('users').avg('age')         // returns array
await Database.from('users').avg('age as age')  // returns array
```

#### `avgDistinct`
```js
await Database.from('users').avgDistinct('age')         // returns array
await Database.from('users').avgDistinct('age as age')  // returns array
```

#### `increment`
Aumente o valor da coluna em `1`:

```js
await Database
  .table('credits')
  .where('id', 1)
  .increment('balance', 10)
```

#### `decrement`
Diminua o valor da coluna em `1`:

```js
await Database
  .table('credits')
  .where('id', 1)
  .decrement('balance', 10)
```

### Auxiliares de Agregação

O *Query Builder* do AdonisJs também estende os agregados de consulta do Knex com métodos de atalho úteis para consultas de agregação comuns. Esses métodos auxiliares encerram a cadeia do construtor de consultas e retornam um valor.

Todos os auxiliares aceitam um nome de coluna para ser usado para agregação. Quando possível, o *Query Builder* escolherá um padrão para o nome da coluna.

Alguns métodos, como `sum()`, exigem um nome de coluna.

O construtor de consultas Knex subjacente define os métodos: `count()`, `countDistinct()`, `avg()`, `avgDistinct()`, `sum()`, `sumDistinct()`, `min()` e `max()`. Para evitar confusão e conflitos de nomenclatura, o *Query Builder* prefixa seus métodos auxiliares de agregação com `get` (por exemplo, `getCount`).

#### `getCount(columnName = '*')`
```js
const total = await Database
  .from('users')
  .getCount()                                   // returns number
```

#### `getCountDistinct(columnName)`
```js
const total = await Database
  .from('users')
  .getCountDistinct('id')                          // returns number
```

#### `getMin(columnName)`
```js
await Database.from('users').getMin('age')      // returns a number
```

#### `getMax(columnName)`
```js
await Database.from('users').getMax('age')      // returns number
```

#### `getSum(columnName)`
```js
await Database.from('cart').getSum('total')     // returns number
```

#### `getSumDistinct(columnName)`
```js
await Database.from('cart').getSumDistinct('total')   // returns number
```

#### `getAvg(columnName)`
```js
await Database.from('users').getAvg('age')      // returns number
```

#### `getAvgDistinct(columnName)`
```js
await Database.from('users').getAvgDistinct('age')      // returns number
```

## Ajudantes

#### `pluck(column)`
O método `pluck` retornará uma matriz de valores para a coluna selecionada:

```js
const usersIds = await Database.from('users').pluck('id')
```

#### `first`
O método `first` adiciona uma cláusula `limit 1` à consulta:

```js
await Database.from('users').first()
```

#### `clone`
Clona a cadeia de consulta atual para uso posterior:

```js
const query = Database
  .from('users')
  .where('username', 'virk')
  .clone()

// later
await query
```

#### `columnInfo`
Retorna informações para uma determinada coluna:

```js
const username = await Database
  .table('users')
  .columnInfo('username')
```

## Subconsultas

```js
const subquery = Database
  .from('accounts')
  .where('account_name', 'somename')
  .select('account_name')

const users = await Database
  .from('users')
  .whereIn('id', subquery)
```

```sql
select * from `users` where `id` in (select `account_name` from `accounts` where `account_name` = 'somename')
```

## Consultas Raw
O método `Database.raw` deve ser usado para executar consultas SQL raw:

```js
await Database
  .raw('select * from users where username = ?', [username])
```

## Fechando Conexões
Conexões de banco de dados podem ser fechadas chamando o método `close`. Por padrão, este método fecha todas as conexões de banco de dados abertas.

Para fechar conexões selecionadas, passe uma matriz de nomes de conexão:

```js
Database.close() // all

Database.close(['sqlite', 'mysql'])
```
