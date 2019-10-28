# Query Builder

O AdonisJs Query Builder fornece uma sintaxe unificada para interagir com bancos de dados SQL usando métodos JavaScript.

Este guia é uma referência a todos os métodos disponíveis no Query Builder.

> Consulte o guia de [Introdução ao banco de dados](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/database/started.md) para obter a lista de bancos de dados suportados, opções de 
> configuração e como depurar suas consultas SQL.

## Introdução
Escrever consultas SQL pode ser entediante, mesmo se você for especialista em SQL.

### Abstração de sintaxe
Imagine que todas as suas consultas foram escritas para o MySQL e, posteriormente, você será solicitado a migrar 
tudo para o PostgreSQL. Você teria que reescrever/alterar suas consultas MySQL para garantir que elas ainda funcionem
com o PostgreSQL.

O Query Builder abstrai a sintaxe específica da conexão, assim você fica livre para se concentrar na funcionalidade do aplicativo 
em vez de variações nos dialetos SQL.

### Consultas Condicionais
Outro problema pode ser a criação de consultas incrementais com blocos condicionais:

Sem o Query Builder
``` js
const sql = 'SELECT * FROM `users`'

if (username) {
  sql += ' WHERE `username` = ' + username
}
```

Com o Query Builder

``` js
const query = Database.table('users')

if (username) {
  query.where('username', username)
}
```

## Exemplo básico
Aqui está um exemplo básico usando o Query Builder para encadear diferentes métodos:

``` js
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

``` js
await Database.select('id', 'username').from('users')
// ou
await Database.select('*').from('users')
```

Saída SQL
``` sql
select `id`, `username` from `users`
select * from `users`
```
Você pode definir alias de consulta da seguinte maneira:

``` js
await Database.select('username as uname')
```

## Cláusulas Where
O Query Builder oferece vários métodos dinâmicos para adicionar cláusulas `where`.

Ele também suporta subconsultas passando um fechamento ou outra consulta em vez do valor real.

Para informações detalhadas de `where`, consulte a documentação do [Knex](http://knexjs.org/#Builder-wheres).

> Passar `undefined` para a claúsula `where` causa um erro durante a compilação do SQL, portanto, verifique se os valores 
> dinâmicos não estão `undefined` antes de usá-los.

### where

``` js
const users = await Database.from('users').where('id', 1)
// Ou
const users = await Database.from('users').where({ id: 1 })
```

Você pode passar um operador de comparação para a cláusula `where` assim:

``` js
const adults = await Database
  .from('users')
  .where('age', '>', 18)
```

### where (com retorno de chamada)
Você pode passar um retorno de chamada para a claúsula `where` para agrupar todas as cláusulas contidas no retorno de chamada:

``` js
await Database.from('users').where(function () {
  this
    .where('id', 1)
    .orWhere('id', '>', 10)
})
```

Saída SQL
``` sql
select * from `users` where (`id` = 1 or `id` > 10)
```

### whereNot
``` js
await Database
  .from('users')
  .whereNot('age', '>', 15)

// ou
await Database
  .from('users')
  .whereNot({username: 'foo'})
```

### whereIn
``` js
await Database
  .from('users')
  .whereIn('id', [1,2,3])
```

### whereNotIn
``` js
await Database
  .from('users')
  .whereNotIn('id', [1,2,3])
```

### whereNull
``` js
await Database
  .from('users')
  .whereNull('deleted_at')
```

### whereNotNull
``` js
await Database
  .from('users')
  .whereNotNull('created_at')
```

### whereExists
``` js
await Database.from('users').whereExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```

### whereNotExists
``` js
await Database.from('users').whereNotExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```

### whereBetween
``` js
await Database
  .table('users')
  .whereBetween('age', [18, 32])
```

### whereNotBetween
``` js
await Database
  .table('users')
  .whereNotBetween('age', [45, 60])
```

### whereRaw
Auxiliar de conveniência para `.where(Database.raw(query))`:

``` js
await Database
  .from('users')
  .whereRaw('id = ?', [20])
```

## Joins


### innerJoin
``` js
await Database
  .table('users')
  .innerJoin('accounts', 'user.id', 'accounts.user_id')
```

Você também pode transmitir um retorno de chamada para construir o join:

``` js
await Database
  .table('users')
  .innerJoin('accounts', function () {
    this
      .on('users.id', 'accounts.user_id')
      .orOn('users.id', 'accounts.owner_id')
  })
```

### leftJoin
``` js
Database
  .select('*')
  .from('users')
  .leftJoin('accounts', 'users.id', 'accounts.user_id')
```

### leftOuterJoin
``` js
await Database
  .select('*')
  .from('users')
  .leftOuterJoin('accounts', 'users.id', 'accounts.user_id')
``` 

### rightJoin
``` js
await Database
  .select('*')
  .from('users')
  .rightJoin('accounts', 'users.id', 'accounts.user_id')
```

### rightOuterJoin
``` js
await Database
  .select('*')
  .from('users')
  .rightOuterJoin('accounts', 'users.id', 'accounts.user_id')
```

### outerJoin
``` js
await Database
  .select('*')
  .from('users')
  .outerJoin('accounts', 'users.id', 'accounts.user_id')
```

### fullOuterJoin
``` js
await Database
  .select('*')
  .from('users')
  .fullOuterJoin('accounts', 'users.id', 'accounts.user_id')
```

### crossJoin
``` js
await Database
  .select('*')
  .from('users')
  .crossJoin('accounts', 'users.id', 'accounts.user_id')
```

### joinRaw
``` js
await Database
  .select('*')
  .from('accounts')
  .joinRaw('natural full join table1').where('id', 1)
```

## Ordem e limite

### distinct
``` js
await Database
  .table('users')
  .distinct('age')
```

### groupBy
``` js
await Database
  .table('users')
  .groupBy('age')
```

### groupByRaw
``` js
await Database
  .table('users')
  .groupByRaw('age, status')
```

### orderBy (coluna, [direction = asc])
``` js
await Database
  .table('users')
  .orderBy('id', 'desc')
```

### orderByRaw (coluna, [direction = asc])
``` js
await Database
  .table('users')
  .orderByRaw('col NULLS LAST DESC')
```

### having (coluna, operador, valor)

> `groupBy()` deve ser chamado antes `having()`.

``` js
await Database
  .table('users')
  .groupBy('age')
  .having('age', '>', 18)
```

### offset/limit (valor)
``` js
await Database
  .table('users')
  .offset(11)
  .limit(10)
```

## Inserções

### insert (valores)
A operação `insert` cria uma linha e retorna seu recém-criado id:

``` js
const userId = await Database
  .table('users')
  .insert({username: 'foo', ...})
```

No caso de inserções em massa, o primeiro `id` registrado é retornado (isso é uma limitação no próprio MySQL; consulte [LAST_INSERT_ID](https://dev.mysql.com/doc/refman/5.6/en/information-functions.html#function_last-insert-id)):

``` js
// inserção em massa
const firstUserId = await Database
  .from('users')
  .insert([{username: 'foo'}, {username: 'bar'}])
```

### into (tableName)
O `into` método é uma alternativa mais legível que o uso de `table/from` ao inserir linhas de banco de dados:

``` js
const userId = await Database
  .insert({username: 'foo', ...})
  .into('users')
```

### Coluna de retorno do PostgreSQL
Para o PostgreSQL, você precisa definir a coluna de retorno explicitamente (todos os outros clientes de banco de dados 
ignoram esta declaração):

``` js
const userId = await Database
  .insert({ username: 'virk' })
  .into('users')
  .returning('id')
```

## Atualizações
Todas as operações de atualização retornam o número de linhas afetadas:

``` js
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .update('lastname', 'Virk')
```

Para atualizar várias colunas, passe essas `colunas/valores` como um objeto:

``` js
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .update({ lastname: 'Virk', firstname: 'Aman' })
```

## Excluir

### delete
As operações de exclusão também retornam o número de linhas afetadas:

``` js
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .delete()
```

Como `delete` está reservada uma a palavra-chave em JavaScript, você também pode usar o método alternativo `del()`.

### truncate
`truncate` remove todas as linhas da tabela, redefinindo o ID de incremento automático da tabela para 0:

``` js
await Database.truncate('users')
```

## Paginação
O Query Builder fornece métodos convenientes para paginar os resultados do banco de dados.

### forPage (página, [limite = 20])
``` js
const users = await Database
  .from('users')
  .forPage(1, 10)
``` 


### paginate (página, [limite = 20])
``` js
const results = await Database
  .from('users')
  .paginate(2, 10)
```

> A saída do método `paginate` é diferente do método `forPage`.

Resultado
```
{
  total: '',
  perPage: '',
  lastPage: '',
  page: '',
  data: [{...}]
}
```

Se você estiver usando o PostgreSQL, chave `total` será uma cadeia de caracteres, pois o JavaScript não consegue 
lidar de forma nativa com `bigint` (consulte esta [issue](https://github.com/adonisjs/adonis-lucid/issues/339#issuecomment-387399508) para obter uma solução recomendada).

## Transações de banco de dados
As transações do banco de dados são operações seguras que não são refletidas no banco de dados até você confirmar 
explicitamente suas alterações.

### beginTransaction
O método `beginTransaction` retorna o objeto de transação, que pode ser usado para executar qualquer consulta:

``` js
const trx = await Database.beginTransaction()
await trx.insert({username: 'virk'}).into('users')

await trx.commit() // a query de inserção ocorrerá no commit
await trx.rollback() // irá inserir nada
```

### transaction
Você também pode agrupar suas transações em um retorno de chamada:

``` js
await Database.transaction(async (trx) => {
  await trx.insert({username: 'virk'}).into('users')
})
```

> Você não precisa ligar `commit` ou `rollback` manualmente dentro desse retorno de chamada.

Se alguma de suas consultas gerar um erro, a transação será revertida automaticamente, caso contrário, ela será confirmada.

## Agregados
O Query Builder expõe todo o poder dos [métodos agregadores](http://knexjs.org/#Builder-count) do Knex.

### count()
``` js
const count = await Database
  .from('users')
  .count()                                      // retorna array

const total = count[0]['count(*)']              // retorna número

// Conta uma coluna
const count = await Database
  .from('users')
  .count('id')                                  // retorna array

const total = count[0]['count("id")']           // retorna número

// Conta uma coluna com alias de 'total'
const count = await Database
  .from('users')
  .count('* as total')                          // retorna array

const total = count[0].total                    // retorna número
```

### countDistinct
`countDistinct` é o mesmo que `count`, mas adiciona uma expressão `distinct`:

``` js
const count = await Database
  .from('users')
  .countDistinct('id')                          // retorna array

const total = count[0]['count(distinct "id")']  // retorna número
```

### min
``` js
await Database.from('users').min('age')         // retorna array
await Database.from('users').min('age as a')    // retorna array
```

### max
``` js
await Database.from('users').max('age')         // retorna array
await Database.from('users').max('age as a')    // retorna array
```

### soma
``` js
await Database.from('cart').sum('total')        // retorna array
await Database.from('cart').sum('total as t')   // retorna array
```

### sumDistinct
``` js
await Database.from('cart').sumDistinct('total')      // retorna array
await Database.from('cart').sumDistinct('total as t') // retorna array
```

### avg
``` js
await Database.from('users').avg('age')         // retorna array
await Database.from('users').avg('age as age')  // retorna array
```

### avgDistinct
``` js
await Database.from('users').avgDistinct('age')         // retorna array
await Database.from('users').avgDistinct('age as age')  // retorna array
```

### increment
Aumente o valor da coluna 1:
``` js
await Database
  .table('credits')
  .where('id', 1)
  .increment('balance', 10)
```

### decrement
Diminua o valor da coluna 1:
``` js
await Database
  .table('credits')
  .where('id', 1)
  .decrement('balance', 10)
```

## Helpers agregados
O Query Builder do Adonisjs também estende os agregados de consulta do Knex com métodos úteis de atalho para consultas agregadas 
comuns. Esses métodos auxiliares encerram a cadeia do construtor de consultas e retornam um valor.

Todos os auxiliares aceitam um nome de coluna para ser usado para agregação. Quando possível, o Query Builder escolherá um 
padrão para o nome da coluna.

Alguns métodos, como `sum()`, exigem um nome de coluna.

O construtor de consulta KNEX subjacente define os métodos: `count()`, `countDistinct()`, `avg()`, `avgDistinct()`, 
`sum()`, `sumDistinct()`, `min()`, e `max()`. Para evitar conflitos e confusão de nomeação, o Query Builder prefixa seus 
métodos auxiliares agregados com `get` (por exemplo `getCount`).

### getCount (columnName = '*')
``` js
const total = await Database
  .from('users')
  .getCount()                                   // retorna number
```

### getCountDistinct (columnName)
``` js
const total = await Database
  .from('users')
  .countDistinct('id')                          // returns number
``


### getMin (columnName)
``` js
await Database.from('users').getMin('age')      // retorna number
```

### getMax (columnName)
``` js
await Database.from('users').getMax('age')      // retorna number
```

### getSum (columnName)
``` js
await Database.from('cart').getSum('total')     // retorna number
```

### getSumDistinct (columnName)
``` js
await Database.from('cart').getSumDistinct('total')   // retorna number
```

### getAvg (columnName)
``` js
await Database.from('users').getAvg('age')      // retorna number
```

### getAvgDistinct (columnName)
``` js
await Database.from('users').getAvgDistinct('age')      // retorna number
```

## Ajudantes

### pluck (coluna)
O método `pluck` retornará uma matriz de valores para a coluna selecionada:

``` js
const usersIds = await Database.from('users').pluck('id')
```

### first
O método `first` adiciona uma cláusula `limit 1` à consulta:

``` js
await Database.from('users').first()
```

### clone
Clona a cadeia de consulta atual para uso posterior:

``` js
const query = Database
  .from('users')
  .where('username', 'virk')
  .clone()

// mais tarde
await query
```

### columnInfo
Retorna informações de uma determinada coluna:

``` js
const username = await Database
  .table('users')
  .columnInfo('username')
```

## Subconsultas
``` js
const subquery = Database
  .from('accounts')
  .where('account_name', 'somename')
  .select('account_name')

const users = await Database
  .from('users')
  .whereIn('id', subquery)
```

``` sql
select * from `users` where `id` in (select `account_name` from `accounts` where `account_name` = 'somename')
```

## Consultas brutas
O método `Database.raw` deve ser usado para executar consultas SQL brutas:

``` js
await Database
  .raw('select * from users where username = ?', [username])
```

## Conexões de fechamento
As conexões com o banco de dados podem ser fechadas chamando o método `close`. Por padrão, esse método fecha todas as conexões 
de banco de dados abertas.

Para fechar as conexões selecionadas, passe uma matriz de nomes de conexões:

``` js
Database.close() // tudo

Database.close(['sqlite', 'mysql'])
```
