# Construtor de Consultas

AdonisJs Query Builder fornece uma sintaxe unificada para interagir com bancos de dados SQL usando métodos JavaScript. Este guia é um guia de referência para todos os métodos disponíveis no construtor de consultas.

Confira o guia [Configuração do Banco de Dados](/banco-de-dados/configuracao-do-banco-de-dados) para conferir a lista de *bancos de dados suportados*, *opções de configuração* e *consultas de depuração*.

## Introdução
Escrever consultas SQL pode ser tedioso de várias maneiras, mesmo que você seja bom com SQL. Vamos imaginar que você escreve todas as suas consultas para MySQL e depois de algum tempo seu gerente pede para você migrar tudo para PostgreSQL. Agora você terá que reescrever/modificar suas consultas MySQL para garantir que elas funcionem bem com o PostgreSQL.

Outro problema pode ser de construir consultas incrementais com blocos condicionais.

Sem Query Builder:

```js
const sql = 'SELECT * FROM `users`'

if (username) {
  sql += ' WHERE `username` = ' + username
}
```

Com o Query Builder:

```js
const query = Database.table('users')

if (username) {
  query.where('username', username)
}
```

## Exemplo básico
Vamos analisar um exemplo básico de trabalho com o construtor de consulta por meio da cadeia de diferentes métodos.

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
O método `select` irá definir os campos a serem selecionados para uma determinada consulta *SELECT*.

```js
yield Database.select('id', 'username').from('users')
// or
yield Database.select('*').from('users')
```

```sql
# SQL Output

select `id`, `username` from `users`
select * from `users`
```

## Onde Cláusulas
O construtor de consultas oferece um monte de métodos dinâmicos para adicionar cláusulas *onde*. Também suporta subconsultas passando um "closure" em vez do valor real.

> NOTE:
> Passar `indefinido` na cláusula WHERE causará um erro durante a compilação do SQL. Certifique-se de que os valores dinâmicos não sejam `indefinidos` antes de passá-los.

#### onde (misturado)

```js
const users = yield Database.from('users').where('id', 1)
// Or
const users = yield Database.from('users').where({ id: 1 })
```

Além disso, você pode definir o operador de comparação para a cláusula WHERE.

```js
const adults = yield Database.from('users').where('age', '>', 18)
```

Você também pode adicionar um retorno de chamada à cláusula *onde*. O retorno de chamada produz uma consulta SQL um pouco diferente e agrupará todas as cláusulas onde dentro de um retorno de chamada.

```js
// Passing Closure

yield Database.from('users').where(function () {
  this.where('id', 1)
})
```

```sql
select * from `users` where (`id` = 1)
```

```js
// SubQueries

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

#### whereNot(misto)

```js
const kids = yield Database.from('users').whereNot('age', '>', 15)
// or
const users = yield Database.from('users').whereNot({username: 'foo'})
```

#### whereIn(misto)

```js
yield Database.from('users').whereIn('id', [1,2,3])
```

#### whereNotIn(mixed)

```js
yield Database.from('users').whereNotIn('id', [1,2,3])
```

#### whereNull(misto)

```js
yield Database.from('users').whereNull('deleted_at')
```

#### whereNotNull(mixed)

```js
yield Database.from('users').whereNotNull('created_at')
```

#### whereExists(misto)

```js
yield Database.from('users').whereExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```

#### whereNotExists(misto)

```js
yield Database.from('users').whereNotExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```

#### whereBetween(misto)

```js
yield Database.table('users').whereBetween('age',[18,32])
```

#### whereNotBetween(misto)
```js
yield Database.table('users').whereNotBetween('age',[45,60])
```

#### ondeRaw(misto)
Conveniência ajudante para .where(Database.raw(query))

```js
yield Database.from('users').whereRaw('id = ?', [20])
```

## Juntar-se

#### innerJoin(coluna, misto)

```js
yield Database
  .table('users')
  .innerJoin('accounts', 'user.id', 'accounts.user_id')
```

Além disso, você pode passar uma função de fechamento para construir o join.

```js
yield Database.table('users').innerJoin('accounts', function () {
  this
    .on('users.id', 'accounts.user_id')
    .orOn('users.id', 'accounts.owner_id')
})
```

##### Outros Métodos de Junções::

| Nome do método |
|-------------------|
| leftJoin |
| leftOuterJoin |
| rightJoin |
| rightOuterJoin |
| outerJoin |
| fullOuterJoin |
| crossJoin |
| joinRaw |

## 10 dicas para melhorar a produtividade no trabalho

#### distinct(...) colunas
```js
yield Database.table('users').distinct('age')
```

#### groupBy(...colunas)
```js
yield Database.table('users').groupBy('age')
```

#### groupByRaw(...) colunas
```js
yield Database.table('users').groupByRaw('age, status')
```

#### orderBy(coluna, [direção=asc])
```js
yield Database.table('users').orderBy('id', 'desc')
```

#### orderByRaw(coluna, [direção=asc])
```js
yield Database.table('users').orderByRaw('col NULLS LAST DESC')
```

#### having(coluna, operador, valor)

> NOTE:
> A cláusula `groupBy()` é sempre necessária antes de usar o método `having()`.

```js
yield Database.table('users').groupBy('age').having('age', '>', 18)
```

#### offset/limit(valor)
```js
yield Database.table('users').offset(11).limit(10)
```

## Insere
A operação de inserção retornará o `id` da linha inserida. No caso de inserções em lote, o `id` do primeiro registro será retornado, e é mais uma limitação com o MYSQL mesmo. link:http://dev.mysql.com/doc/refman/5.6/en/information-functions.html#function_last-insert-id[LAST_INSERT_ID].

#### inserir(valores)
```js
const userId = yield Database
  .table('users')
  .insert({username: 'foo', ...})

// BULK INSERT
const firstUserId = yield Database
  .from('users')
  .insert([{username: 'foo'}, {username: 'bar'}])
```

#### into(tableName)
Método `into` é mais legível que `table/from` ao inserir linhas no banco de dados.

```js
const userId = yield Database
  .insert({username: 'foo', ...})
  .into('users')
```

### PostgreSQL Apenas
Para o PostgreSQL, você terá que definir a coluna de retorno explicitamente. Todos os outros clientes de banco de dados ignorarão esta declaração.

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

Passar um objeto para múltiplas colunas.

```js
const affectedRows = yield Database
  .table('users')
  .where('username', 'tutlage')
  .update({ lastname: 'Virk', firstname: 'Aman' })
```

## Deletar
As operações de exclusão também retornarão o número de linhas afetadas.

#### apagar
Além disso, você pode usar o `del()`, já que "delete" é uma palavra reservada em JavaScript.

```js
const affectedRows = yield Database
  .table('users')
  .where('username', 'tutlage')
  .delete()
```

#### truncar
O truncamento irá remover todas as linhas de um banco de dados e irá definir o ID auto incremento de volta para *0*.

```js
yield Database.truncate('users')
```

## Paginação
O construtor de consultas fornece um punhado de maneiras convenientes para paginar os resultados do banco de dados.

#### forPage(page, [limit=20])
```js
const users = yield Database
  .from('users')
  .forPage(1, 10)
```

#### paginate(page, [limit=20])
```js
const results = yield Database
  .from('users')
  .paginate(2, 10)
```

> NOTE:
> A saída do método `paginate` é diferente da `forPage`.

Saída
```js
{
  total: 0,
  currentPage: 2,
  perPage: 10,
  lastPage: 0,
  data: [{...}]
}
```

## Transações de Banco de Dados
As transações de banco de dados são operações seguras, que não refletem no banco de dados até que você explicitamente confirme suas alterações.

#### beginTransaction
O método `beginTransaction` retornará o objeto de transação, que pode ser usado para executar qualquer consulta.

```js
const trx = yield Database.beginTransaction()
yield trx.insert({username: 'virk'}).into('users')

trx.commit() // insert query will take place on commit
trx.rollback() // will not insert anything
```

#### transação
Além disso, você pode envolver suas transações dentro de um *callback*. A principal diferença é que você não terá que chamar manualmente o `commit ou `rollback` se algum dos seus consultas lançar um erro, a transação irá reverter automaticamente. Caso contrário, ele irá confirmar.

```js
yield Database.transaction(function * (trx) {
  yield trx.insert({username: 'virk'}).into('users')
})
```

## Chuncks
O método `chunk` irá buscar registros em pequenos pedaços e executará a função até que haja resultados. Este método é útil quando você planeja selecionar milhares de registros.

```js
yield Database.from('logs').chunk(200, function (logs) {
  console.log(logs)
})
```

## Agregados

#### count([coluna])
```js
const total = yield Database.from('users').count()

// COUNT A COLUMN
const total = yield Database.from('users').count('id')

// COUNT COLUMN AS NAME
const total = yield Database.from('users').count('id as id')
```

#### countDistinct
O `countDistinct` é o mesmo que contar, mas acrescenta a expressão "distinct".

```js
const total = yield Database.from('users').countDistinct('id')
```

#### min(coluna)

```js
yield Database.from('users').min('age')
yield Database.from('users').min('age as a')
```

#### max(coluna)

```js
yield Database.from('users').max('age')
yield Database.from('users').max('age as a')
```

#### sum(coluna)
```js
yield Database.from('cart').sum('total')
yield Database.from('cart').sum('total as t')
```

#### sumDistinct(coluna)
```js
yield Database.from('cart').sumDistinct('total')
yield Database.from('cart').sumDistinct('total as t')
```

#### avg(coluna)
```js
yield Database.from('users').avg('age')
yield Database.from('users').avg('age as age')
```

#### avgDistinct(coluna)
```js
yield Database.from('users').avgDistinct('age')
yield Database.from('users').avgDistinct('age as age')
```

#### incrementar(coluna, valor)
Incrementar o valor existente da coluna em *1*.

```js
yield Database
  .table('credits')
  .where('id', 1)
  .increment('balance', 10)
```

#### decrementar(coluna, valor)
O oposto de `increment`.

```js
yield Database
  .table('credits')
  .where('id', 1)
  .decrement('balance', 10)
```

## Auxiliares

#### pluck(coluna)
O método `pluck` retornará um array de valores para a coluna selecionada.

```js
const usersIds = yield Database.from('users').pluck('id')
```

#### pluckAll(...colunas)
O método `pluckAll` retorna um array de objetos.

> NOTE:
> `pluckAll` foi adicionado a partir de `adonis-lucid@3.0.12`

```js
const usersIds = yield Database.from('users').pluckAll('id')
// or
const users = yield Database.from('users').pluckAll('id', 'username')
```

#### first
O método `first` adicionará uma cláusula *limit 1* à consulta.

```js
yield Database.from('users').first()
```

#### clonar
Clonar a cadeia de consulta atual para reutilização.

```js
const query = Database
  .from('users')
  .where('username', 'virk')
  .clone()

// later
yield query
```

#### columnInfo([nomeDaColuna])
Retorna informações para uma coluna especificada.

```js
const username = yield Database.table('users').columnInfo('username')
```
