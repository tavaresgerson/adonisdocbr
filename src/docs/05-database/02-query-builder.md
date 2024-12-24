# Query Builder

O AdonisJs Query Builder fornece uma sintaxe unificada para interagir com bancos de dados SQL usando métodos Javascript. Este guia é uma referência a todos os métodos disponíveis no query builder.

Confira o [Database Setup](/docs/05-database/01-database-setup.md) guia para verificar a lista de *bancos de dados suportados*, *opções de configuração* e *consultas de depuração*.

## Introdução
Escrever consultas SQL pode ser tedioso de muitas maneiras, mesmo se você for bom com SQL. Vamos imaginar que você escreve todas as suas consultas para MySQL e depois de algum tempo seu gerente pede para você migrar tudo para PostgreSQL. Agora você terá que reescrever/alterar suas consultas MySQL para garantir que elas funcionem bem com PostgreSQL.

Outro problema pode ser a construção de consultas incrementais com blocos condicionais.

```js
// Sem Construtor de Consultas

const sql = 'SELECT * FROM `users`'

if (username) {
  sql += ' WHERE `username` = ' + username
}
```

```js
// Com o Construtor de Consultas

const query = Database.table('users')

if (username) {
  query.where('username', username)
}
```

## Exemplo básico
Vamos revisar um exemplo básico de trabalho com o construtor de consultas encadeando métodos diferentes.

```js
const Database = use('Database')

class UserController {

  * index (request, response) {
    const john = yield Database
      .table('users')
      .where('username', 'john')
      .limit(1)

    response.json(john)
  }

}
```

## Seleciona
O método `select` definirá os campos a serem selecionados para uma determinada consulta *SELECT*.

```js
yield Database.select('id', 'username').from('users')
// ou
yield Database.select('*').from('users')
```

```sql
# SQL Saída

select `id`, `username` from `users`
select * from `users`
```

## Cláusulas Where
O construtor de consultas oferece vários métodos dinâmicos para adicionar cláusulas *where*. Além disso, ele oferece suporte a subconsultas passando um `closure` em vez do valor real.

::: warning OBSERVAÇÃO
Passar `undefined` para a cláusula `where` causará um erro durante a compilação do SQL. Certifique-se de que os valores dinâmicos não sejam `undefined` antes de passá-los.
:::

#### where(mixed)

```js
const users = yield Database.from('users').where('id', 1)
// Ou
const users = yield Database.from('users').where({ id: 1 })
```

Além disso, você pode definir o operador de comparação para a cláusula `where`.

```js
const adults = yield Database.from('users').where('age', '>', 18)
```

Você também pode adicionar um retorno de chamada para a cláusula *where*. O retorno de chamada gera uma consulta SQL um pouco diferente e agrupará todas as cláusulas where dentro de um retorno de chamada.

```js
// Closure

yield Database.from('users').where(function () {
  this.where('id', 1)
})
```

```sql
select * from `users` where (`id` = 1)
```

```js
// Subconsultas

const subquery = Database
  .from('accounts')
  .where('account_name', 'somename')
  .select('account_name')

const users = yield Database
  .from('users')
  .whereIn('id', subquery)
```

```sql
select * from `users` where `id` in (select `account_name` from `accounts` where `account_name` = 'somename')
```

#### `whereNot(mixed)`
```js
const kids = yield Database.from('users').whereNot('age', '>', 15)
// ou
const users = yield Database.from('users').whereNot({username: 'foo'})
```

#### `whereIn(mixed)`
```js
yield Database.from('users').whereIn('id', [1,2,3])
```

#### `whereNotIn(mixed)`
```js
yield Database.from('users').whereNotIn('id', [1,2,3])
```

#### `whereNull(mixed)`
```js
yield Database.from('users').whereNull('deleted_at')
```

#### `whereNotNull(mixed)`
```js
yield Database.from('users').whereNotNull('created_at')
```

#### `whereExists(mixed)`
```js
yield Database.from('users').whereExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```

#### `whereNotExists(mixed)`
```js
yield Database.from('users').whereNotExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```

#### `whereBetween(mixed)`
```js
yield Database.table('users').whereBetween('age',[18,32])
```

#### `whereNotBetween(mixed)`
```js
yield Database.table('users').whereNotBetween('age',[45,60])
```

#### `whereRaw(mixed)`
Auxiliar de conveniência para `.where(Database.raw(query))`

```js
yield Database.from('users').whereRaw('id = ?', [20])
```

## Joins

#### `innerJoin(column, mixed)`

```js
yield Database
  .table('users')
  .innerJoin('accounts', 'user.id', 'accounts.user_id')
```

Além disso, você pode passar um *closure* para construir a junção.

```js
yield Database.table('users').innerJoin('accounts', function () {
  this
    .on('users.id', 'accounts.user_id')
    .orOn('users.id', 'accounts.owner_id')
})
```


Outros métodos de junção:

| Método            |
|-------------------|
| `leftJoin`        |
| `leftOuterJoin`   |
| `rightJoin`       |
| `rightOuterJoin`  |
| `outerJoin`       |
| `fullOuterJoin`   |
| `crossJoin`       |
| `joinRaw`         |

## Ordenação e Limites

#### `distinct(...columns)`
```js
yield Database.table('users').distinct('age')
```

#### `groupBy(...columns)`
```js
yield Database.table('users').groupBy('age')
```

#### `groupByRaw(...columns)`
```js
yield Database.table('users').groupByRaw('age, status')
```

#### `orderBy(column, [direction=asc])`
```js
yield Database.table('users').orderBy('id', 'desc')
```

#### `orderByRaw(column, [direction=asc])`
```js
yield Database.table('users').orderByRaw('col NULLS LAST DESC')
```

#### `having(column, operator, value)`

::: info OBSERVAÇÃO
A cláusula `groupBy()` é sempre necessária antes de usar o método `having()`.
:::

```js
yield Database.table('users').groupBy('age').having('age', '>', 18)
```

#### `offset/limit(value)`
```js
yield Database.table('users').offset(11).limit(10)
```

## Inserções
A operação de inserção retornará o `id` da linha inserida. No caso de inserções em massa, o `id` do primeiro registro será retornado, e é mais uma limitação do próprio MYSQL. [LAST_INSERT_ID](http://dev.mysql.com/doc/refman/5.6/en/information-functions.html#function_last-insert-id).

#### `insert(values)`
```js
const userId = yield Database
  .table('users')
  .insert({username: 'foo', ...})

// INSERÇÃO EM MASSA
const firstUserId = yield Database
  .from('users')
  .insert([{username: 'foo'}, {username: 'bar'}])
```

#### `into(tableName)`
O método `into` é mais legível do que `table/from` ao inserir linhas no banco de dados.

```js
const userId = yield Database
  .insert({username: 'foo', ...})
  .into('users')
```

### Somente PostgreSQL
Para PostgreSQL, você terá que definir a coluna de retorno explicitamente. Todos os outros clientes de banco de dados ignorarão esta instrução.

```js
const userId = yield Database
  .insert({ username: 'virk' })
  .into('users')
  .returning('id')
```

## Atualizações
Todas as operações de atualização retornarão o número de linhas afetadas.

```js
const affectedRows = yield Database
  .table('users')
  .where('username', 'tutlage')
  .update('lastname', 'Virk')
```

Passe um objeto para várias colunas.

```js
const affectedRows = yield Database
  .table('users')
  .where('username', 'tutlage')
  .update({ lastname: 'Virk', firstname: 'Aman' })
```

## Exclusões
As operações de exclusão também retornarão o número de linhas afetadas.

#### `delete`
Além disso, você pode usar `del()`, pois `delete` é uma palavra-chave reservada em Javascript.

```js
const affectedRows = yield Database
  .table('users')
  .where('username', 'tutlage')
  .delete()
```

#### `truncate`
Truncar removerá todas as linhas de um banco de dados e definirá o ID de incremento automático de volta para *0*.

```js
yield Database.truncate('users')
```

## Paginação
O construtor de consultas fornece várias maneiras convenientes de paginar resultados do banco de dados.

#### `forPage(page, [limit=20])`
```js
const users = yield Database
  .from('users')
  .forPage(1, 10)
```

#### `paginate(page, [limit=20])`
```js
const results = yield Database
  .from('users')
  .paginate(2, 10)
```

::: info NOTA
A saída do método `paginate` é diferente do método `forPage`.
:::

```js
// Saída

{
  total: 0,
  currentPage: 2,
  perPage: 10,
  lastPage: 0,
  data: [{...}]
}
```

## Transações de banco de dados
As transações de banco de dados são operações seguras, que não são refletidas no banco de dados até e a menos que você confirme explicitamente suas alterações.

#### `beginTransaction`
O método `beginTransaction` retornará o objeto de transação, que pode ser usado para executar quaisquer consultas.

```js
const trx = yield Database.beginTransaction()
yield trx.insert({username: 'virk'}).into('users')

trx.commit() // a consulta de inserção ocorrerá na confirmação
trx.rollback() // não irá inserir nada
```

#### `transaction`
Além disso, você pode encapsular suas transações dentro de um *callback*. A principal diferença é que você não precisará chamar `commit ou `rollback` manualmente se alguma de suas consultas gerar um erro, a transação será revertida automaticamente. Caso contrário, ela será confirmada.

```js
yield Database.transaction(function * (trx) {
  yield trx.insert({username: 'virk'}).into('users')
})
```

## Chunks
O método `chunk` extrairá registros em pequenos pedaços e executará o *closure* até que haja resultados. Este método é útil quando você planeja selecionar milhares de registros.

```js
yield Database.from('logs').chunk(200, function (logs) {
  console.log(logs)
})
```

## Agregados

#### `count([column])`
```js
const total = yield Database.from('users').count()

// CONTAR UMA COLUNA
const total = yield Database.from('users').count('id')

// CONTAR COLUNA COMO NOME
const total = yield Database.from('users').count('id as id')
```

#### `countDistinct`
O `countDistinct` é o mesmo que `count`, mas adiciona uma expressão distinta.

```js
const total = yield Database.from('users').countDistinct('id')
```

#### `min(column)`

```js
yield Database.from('users').min('age')
yield Database.from('users').min('age as a')
```

#### `max(column)`

```js
yield Database.from('users').max('age')
yield Database.from('users').max('age as a')
```

#### `sum(column)`
```js
yield Database.from('cart').sum('total')
yield Database.from('cart').sum('total as t')
```

#### `sumDistinct(column)`
```js
yield Database.from('cart').sumDistinct('total')
yield Database.from('cart').sumDistinct('total as t')
```

#### `avg(column)`
```js
yield Database.from('users').avg('age')
yield Database.from('users').avg('age as age')
```

#### `avgDistinct(column)`
```js
yield Database.from('users').avgDistinct('age')
yield Database.from('users').avgDistinct('age as age')
```

#### `increment(column, amount)`
Incrementa o valor existente da coluna em *1*.

```js
yield Database
  .table('credits')
  .where('id', 1)
  .increment('balance', 10)
```

#### `decrement(column, amount)`
Oposto de `increment`.

```js
yield Database
  .table('credits')
  .where('id', 1)
  .decrement('balance', 10)
```

## Auxiliares

#### `pluck(column)`
O método `pluck` retornará uma matriz de valores para a coluna selecionada.

```js
const usersIds = yield Database.from('users').pluck('id')
```

#### `pluckAll(...columns)`
O método `pluckAll` retorna uma matriz de objetos.

::: info NOTA
`pluckAll` foi adicionado a partir de `adonis-lucid@3.0.12`
:::

```js
const usersIds = yield Database.from('users').pluckAll('id')
// ou
const users = yield Database.from('users').pluckAll('id', 'username')
```

#### `first`
O método `first` adicionará uma cláusula *limit 1* à consulta.

```js
yield Database.from('users').first()
```

#### `clone`
Clone a cadeia de consulta atual para reutilização.

```js
const query = Database
  .from('users')
  .where('username', 'virk')
  .clone()

// depois
yield query
```

#### `columnInfo([columnName])`
Retorna informações para uma determinada coluna.

```js
const username = yield Database.table('users').columnInfo('username')
```
