# Select query builder

O select query builder é usado para construir consultas SQL **SELECT**, **UPDATE** e **DELETE**. Para inserir novas linhas, você deve usar o [insert query builder](./insert.md) e usar o [raw query builder](./raw.md) para executar consultas SQL raw.

Você pode obter uma instância do [select query builder](https://github.com/adonisjs/lucid/blob/develop/src/database/query_builder/database.ts) usando um dos seguintes métodos.

```ts
import db from '@adonisjs/lucid/services/db'

/**
 * Creates query builder instance
 */
const query = db.query()

/**
 * Creates query builder instance and also selects
 * the table
 */
const queryWithTableSelection = db.from('users')
```

## Métodos/propriedades
A seguir está a lista de métodos/propriedades disponíveis na instância do Query builder.

### `select`
O método `select` permite selecionar colunas da tabela do banco de dados. Você pode passar uma matriz de colunas ou passá-las como vários argumentos.

```ts
import db from '@adonisjs/lucid/services/db'

db
  .from('users')
  .select('id', 'username', 'email')
```

Você pode definir aliases para as colunas usando a expressão `as` ou passando um objeto de par chave-valor.

```ts
db
  .from('users')
  .select('id', 'email as userEmail')
```

```ts
db
  .from('users')
  .select({
    id: 'id',

    // Key is alias name
    userEmail: 'email'
  })
```

Além disso, você pode usar subconsultas e consultas brutas para gerar colunas em tempo de execução, por exemplo, selecionando o último endereço IP de login para um usuário na tabela `user_logins`.

```ts
db
  .from('users')
  .select(
    db
      .from('user_logins')
      .select('ip_address')
      .whereColumn('users.id', 'user_logins.user_id')
      .orderBy('id', 'desc')
      .limit(1)
      .as('last_login_ip')
  )
```

Semelhante a uma subconsulta, você também pode passar uma instância da consulta bruta.

```ts
db
  .from('users')
  .select(
    db.raw(`
      (select ip_address from user_logins where users.id = user_logins.user_id limit 1) as last_login_ip
    `)
  )
```

### `from`
O método `from` é usado para definir a tabela de banco de dados para a consulta.

```ts
import db from '@adonisjs/lucid/services/db'

db.from('users')
```

O construtor de consultas também permite usar tabelas derivadas passando uma subconsulta ou um fechamento (que atua como uma subconsulta).

```ts
import db from '@adonisjs/lucid/services/db'

db
  .from((subquery) => {
    subquery
      .from('user_exams')
      .sum('marks as total')
      .groupBy('user_id')
      .as('total_marks')
  })
  .avg('total_marks.total')
```

### `where`
O método `where` é usado para definir a cláusula where em suas consultas SQL. O construtor de consultas aceita uma ampla variedade de tipos de argumentos para permitir que você aproveite todo o poder do SQL.

O exemplo a seguir aceita o nome da coluna como o primeiro argumento e seu valor como o segundo argumento.

```ts
import db from '@adonisjs/lucid/services/db'

db
  .from('users')
  .where('username', 'virk')
```

Você também pode definir operadores SQL, conforme mostrado abaixo.

```ts
db
  .from('users')
  .where('created_at', '>', '2020-09-09')
```

```ts
// title: Using luxon to make the date
db
  .from('users')
  .where('created_at', '>', DateTime.local().toSQLDate())
```

```ts
// title: Using like operator
db
  .from('posts')
  .where('title', 'like', '%Adonis 101%')
```

Você pode criar grupos `where` passando um retorno de chamada para o método `where`. Por exemplo:

```ts
// title: where groups
db
  .from('users')
  .where((query) => {
    query
      .where('username', 'virk')
      .whereNull('deleted_at')
  })
  .orWhere((query) => {
    query
      .where('email', 'virk@adonisjs.com')
      .whereNull('deleted_at')
  })
```

SQL gerado

```sql
SELECT * FROM "users"
  WHERE (
    "username" = ? AND "deleted_at" IS NULL
  )
  or (
    "email" = ? AND "deleted_at" IS NULL
  )
```

O valor do método `where` também pode ser uma subconsulta.

```ts
// title: With subqueries
db
  .from('user_groups')
  .where(
    'user_id',
    db
      .from('users')
      .select('user_id')
      .where('users.user_id', 1)
  )
```

Da mesma forma, você também pode definir uma consulta bruta.

```ts
// title: With raw queries
db
  .from('user_groups')
  .where(
    'user_id',
    db
      .raw(`select "user_id" from "users" where "users"."user_id" = ?`, [1])
      .wrap('(', ')')
  )
```

### variantes do método where
A seguir está a lista das variações do método `where` e compartilha a mesma API.

| Método        | Descrição   |
|---------------|-------------|
| `andWhere`    | Alias ​​para o método `where` |
| `orWhere`     | Adiciona uma cláusula **or where** |
| `whereNot`    | Adiciona uma cláusula **where not** |
| `orWhereNot`  | Adiciona uma cláusula **or where not** |
| `andWhereNot` | Alias ​​para `whereNot` |

### `whereColumn`
O método `whereColumn` permite que você defina uma coluna como o valor para a cláusula where. O método geralmente é útil com consultas e junções. Por exemplo:

```ts
db
  .from('users')
  .whereColumn('updated_at', '>', 'created_at')
```

```ts
db
  .from('users')
  .select(
    db
      .from('user_logins')
      .select('ip_address')
      .whereColumn('users.id', 'user_logins.user_id') // 👈
      .orderBy('id', 'desc')
      .limit(1)
      .as('last_login_ip')
  )
```

### Variantes do método `whereColumn`
A seguir está a lista de variações do método `whereColumn` e compartilha a mesma API.

| Método              | Descrição                               |
|---------------------|-----------------------------------------|
| `andWhereColumn`    | Alias ​​para o método `whereColumn`       |
| `orWhereColumn`     | Adiciona uma cláusula **or where**      |
| `whereNotColumn`    | Adiciona uma cláusula **where not**     |
| `orWhereNotColumn`  | Adiciona uma cláusula **or where not**  |
| `andWhereNotColumn` | Alias ​​para `whereNotColumn`             |

### `whereLike`
Adiciona uma cláusula where com comparação de substring sensível a maiúsculas e minúsculas em uma coluna específica com um valor específico.

```ts
db
  .from('posts')
  .whereLike('title', '%Adonis 101%')
```

### `whereILike`
Adiciona uma cláusula where com comparação de substring insensível a maiúsculas e minúsculas em uma coluna específica com um valor específico. O método gera um ligeiramente diferente para cada dialeto para obter a comparação insensível a maiúsculas e minúsculas.

```ts
db
  .from('posts')
  .whereILike('title', '%Adonis 101%')
```

### `whereIn`
O método `whereIn` é usado para definir a cláusula SQL **wherein**. O método aceita o nome da coluna como o primeiro argumento e uma matriz de valores como o segundo argumento.

```ts
db
  .from('users')
  .whereIn('id', [1, 2, 3])
```

Os valores também podem ser definidos para mais de uma coluna. Por exemplo:

```ts
db
  .from('users')
  .whereIn(['id', 'email'], [
    [1, 'virk@adonisjs.com']
  ])

// SQL: select * from "users" where ("id", "email") in ((?, ?))
```

Você também pode calcular os valores `whereIn` usando uma subconsulta.

```ts
// title: With subqueries
db
  .from('users')
  .whereIn(
    'id',
    db
      .from('user_logins')
      .select('user_id')
      .where('created_at', '<', '2020-09-09')
  )
```

Para várias colunas

```ts
db
  .from('users')
  .whereIn(
    ['id', 'email'],
    db
      .from('accounts')
      .select('user_id', 'email')
  )
```

O método `whereIn` também aceita um retorno de chamada como o 2º argumento. O retorno de chamada recebe uma instância da subconsulta que você pode usar para calcular valores como tempo de execução.

```ts
db
  .from('users')
  .whereIn(
    'id',
    (query) => query.from('user_logins').select('user_id')
  )
```

### Variantes do método `whereIn`
A seguir está a lista das variações do método `whereIn` e compartilha a mesma API.

| Método | Descrição |
|-----------------|-------------------------------|
| `andWhereIn`    | Alias ​​para o método `whereIn`  |
| `orWhereIn`     | Adiciona uma cláusula **or where in**  |
| `whereNotIn`    | Adiciona uma cláusula **where not in**  |
| `orWhereNotIn`  | Adiciona uma cláusula **or where not in**  |
| `andWhereNotIn` | Alias ​​para `whereNotIn`  |

### `whereNull`
O método `whereNull` adiciona uma cláusula where null à consulta.

```ts
db
  .from('users')
  .whereNull('deleted_at')
```

### Variantes do método `whereNull`
A seguir está a lista de variações do método `whereNull` e compartilha a mesma API.

| Método | Descrição |
|--------|-------------|
| `andWhereNull`    | Alias ​​para o método `whereNull` |
| `orWhereNull`     | Adiciona uma cláusula **or where null** |
| `whereNotNull`    | Adiciona uma cláusula **where not null** |
| `orWhereNotNull`  | Adiciona uma cláusula **or where not null** |
| `andWhereNotNull` | Alias ​​para `whereNotNull` |

### `whereExists`
O método `whereExists` permite adicionar restrições where verificando a existência de resultados em uma subconsulta. Por exemplo: Selecione todos os usuários que fizeram login pelo menos uma vez.

```ts
db
  .from('users')
  .whereExists((query) => {
    query
      .from('user_logins')
      .whereColumn('users.id', 'user_logins.user_id')
      .limit(1)
  })
```

Você também pode passar uma subconsulta ou uma consulta bruta como o primeiro argumento.

```ts
db
  .from('users')
  .whereExists(
    db
      .from('user_logins')
      .whereColumn('users.id', 'user_logins.user_id')
      .limit(1)
  )
```

```ts
db
  .from('users')
  .whereExists(
    db.raw(
      'select * from user_logins where users.id = user_logins.user_id'
    )
  )
```

### Variantes do método `whereExists`

A seguir está a lista de variações do método `whereExists` e compartilha a mesma API.

| Método | Descrição |
|--------|-------------|
| `andWhereExists` | Alias ​​para o método `whereExists` |
| `orWhereExists` | Adiciona uma cláusula **or where exists** |
| `whereNotExists` | Adiciona uma cláusula **where not exists** |
| `orWhereNotExists` | Adiciona uma cláusula **or where not exists** |
| `andWhereNotExists` | Alias ​​para o método `whereNotExists` |

### `whereBetween`
O método `whereBetween` adiciona a cláusula **where between**. Ele aceita o nome da coluna como o primeiro argumento e uma matriz de valores como o segundo argumento.

```ts
db
  .from('users')
  .whereBetween('age', [18, 60])
```

Você também pode usar subconsultas para derivar os valores de uma tabela de banco de dados diferente.

```ts
// title: With sub queries
db
  .from('users')
  .whereBetween('age', [
    db.from('participation_rules').select('min_age'),
    db.from('participation_rules').select('max_age'),
  ])
```

Você também pode usar consultas brutas para derivar valores de outra tabela de banco de dados.

```ts
// title: With raw queries
db
  .from('users')
  .whereBetween('age', [
    db.raw('(select min_age from participation_rules)'),
    db.raw('(select max_age from participation_rules)'),
  ])
```

### Variantes do método `whereBetween`
A seguir está a lista das variações do método `whereBetween` e compartilha a mesma API.

| Método | Descrição |
|--------|-------------|
| `andWhereBetween` | Alias ​​para o método `whereBetween` |
| `orWhereBetween` | Adiciona uma cláusula **or where between** |
| `whereNotBetween` | Adiciona uma cláusula **where not between** |
| `orWhereNotBetween` | Adiciona uma cláusula **or where not between** |
| `andWhereNotBetween` | Alias ​​para o método `whereNotBetween` |

### `whereRaw`
Você pode usar o método `whereRaw` para expressar condições não cobertas pelos métodos existentes do construtor de consultas. Certifique-se sempre de usar parâmetros de vinculação para definir valores de consulta.

:::caption{for="error"}
**Codificação de valores dentro da consulta**
:::

```ts
db
  .from('users')
  .whereRaw(`username = ${username}`)
```

:::caption{for="success"}
**Usando parâmetros de vinculação**
:::

```ts
db
  .from('users')
  .whereRaw('username = ?', [username])
```

Você também pode definir os nomes das colunas dinamicamente usando `??`.

```ts
db
  .from('users')
  .whereRaw('?? = ?', ['users.username', username])
```

### Variantes do método `whereRaw`
A seguir está a lista das variações do método `whereRaw` e compartilha a mesma API.

| Método | Descrição |
|--------|-------------|
| `andWhereRaw` | Alias ​​para o método `whereRaw` |
| `orWhereRaw` | Adiciona uma cláusula **or where raw** |

### `whereJson`
Adicione uma cláusula where com um objeto para corresponder ao valor de uma coluna JSON dentro do banco de dados.

```ts
db
  .from('users')
  .whereJson('address', { city: 'XYZ', pincode: '110001' })
```

O valor da coluna também pode ser computado usando uma subconsulta.

```ts
db
  .from('users')
  .whereJson(
    'address',
    db
      .select('address')
      .from('user_address')
      .where('address.user_id', 1)
  )
```

### Variantes do método `whereJson`
A seguir está a lista das variações do método `whereJson` e compartilha a mesma API.

| Método | Descrição |
|--------|-------------|
| `orWhereJson` | Adicione uma cláusula **or where** correspondente ao valor de uma coluna JSON |
| `andWhereJson` | Alias ​​para `whereJson` |
| `whereNotJson` | Adicione uma cláusula **where not** em uma coluna JSON |
| `orWhereNotJson` | Adicionar uma cláusula **or where not** em uma coluna JSON |
| `andWhereNotJson` | Alias ​​para `whereNotJson` |

### `whereJsonSuperset`
Adicionar uma cláusula onde o valor da coluna JSON é o superconjunto do objeto definido. No exemplo a seguir, o endereço do usuário é armazenado como JSON e encontramos pelo usuário pelo seu código PIN.

```ts
db
  .from('users')
  .whereJsonSuperset('address', { pincode: '110001' })
```

### Variantes do método `whereJsonSuperset`
A seguir está a lista das variações do método `whereJsonSuperset` e compartilha a mesma API.

| Método | Descrição |
|--------|-------------|
| `orWhereJsonSuperset` | Adicionar uma cláusula **or where** correspondente ao valor de uma coluna JSON |
| `andWhereJsonSuperset` | Alias ​​para `whereJsonSuperset` |
| `whereNotJsonSuperset` | Adicionar uma cláusula **where not** em uma coluna JSON |
| `orWhereNotJsonSuperset` | Adicione uma cláusula **or where not** em uma coluna JSON |
| `andWhereNotJsonSuperset` | Alias ​​para `whereNotJsonSuperset` |

### `whereJsonSubset`
Adicione uma cláusula onde o valor da coluna JSON é o subconjunto do objeto definido. No exemplo a seguir, o endereço do usuário é armazenado como JSON e encontramos o usuário pelo código PIN ou pelo nome da cidade.

```ts
db
  .from('users')
  .whereJsonSubset('address', { pincode: '110001', city: 'XYZ' })
```

### Variantes do método `whereJsonSubset`
A seguir está a lista das variações do método `whereJsonSubset` e compartilha a mesma API.

| Método | Descrição |
|--------|-------------|
| `orWhereJsonSubset` | Adicione uma cláusula **or where** correspondente ao valor de uma coluna JSON |
| `andWhereJsonSubset` | Alias ​​para `whereJsonSubset` |
| `whereNotJsonSubset` | Adicionar uma cláusula **where not** em uma coluna JSON |
| `orWhereNotJsonSubset` | Adicionar uma cláusula **or where not** em uma coluna JSON |
| `andWhereNotJsonSubset` | Alias ​​para `whereNotJsonSubset` |

### `join`
O método `join` permite especificar junções SQL entre duas tabelas. Por exemplo: Selecione as colunas `ip_address` e `country` unindo a tabela `user_logins`.

```ts
db
  .from('users')
  .join('user_logins', 'users.id', '=', 'user_logins.user_id')
  .select('users.*')
  .select('user_logins.ip_address')
  .select('user_logins.country')
```

Você pode passar um retorno de chamada como o 2º argumento para definir mais restrições de junção.

```ts
db
  .from('users')
  // highlight-start
  .join('user_logins', (query) => {
    query
      .on('users.id', '=', 'user_logins.user_id')
      .andOnVal('user_logins.created_at', '>', '2020-10-09')
  })
  // highlight-end
  .select('users.*')
  .select('user_logins.ip_address')
  .select('user_logins.country')
```

Para agrupar restrições de junção, você pode passar um retorno de chamada para o método `on`.

```ts
db
  .from('users')
  .join('user_logins', (query) => {
    query
      // highlight-start
      .on((subquery) => {
        subquery
          .on('users.id', '=', 'user_logins.user_id')
          .andOnVal('user_logins.created_at', '>', '2020-10-09')
      })
      .orOn((subquery) => {
        subquery
          .on('users.id', '=', 'user_logins.account_id')
          .andOnVal('user_logins.created_at', '>', '2020-10-09')
      })
      // highlight-end
  })
  .select('users.*')
  .select('user_logins.ip_address')
  .select('user_logins.country')
```

SQL de saída

```sql
SELECT
  "users".*,
  "user_logins"."ip_address",
  "user_logins"."country"
FROM "users"
  INNER JOIN "user_logins" ON (
    "users"."id" = "user_logins"."user_id" AND "user_logins"."created_at" > ?
  )
  or (
    "users"."id" = "user_logins"."account_id" AND "user_logins"."created_at" > ?
  )
```

O método `join` usa a **junção interna** por padrão, e você pode usar uma junção diferente usando um dos seguintes métodos disponíveis.

- `leftJoin`
- `leftOuterJoin`
- `rightJoin`
- `rightOuterJoin`
- `fullOuterJoin`
- `crossJoin`

### `joinRaw`
Você pode usar o método `joinRaw` para expressar condições não cobertas pela API padrão do construtor de consultas.

```ts
db
  .from('users')
  .joinRaw('natural full join user_logins')
```

### `onIn`

```ts
db
  .from('users')
  .join('user_logins', (query) => {
    query.onIn('user_logins.country', ['India', 'US', 'UK'])
  })
```

### `onNotIn`

```ts
db
  .from('users')
  .join('user_logins', (query) => {
    query.onNotIn('user_logins.country', ['India', 'US', 'UK'])
  })
```

### `onNull`

```ts
db
  .from('users')
  .join('user_logins', (query) => {
    query.onNull('user_logins.ip_address')
  })
```

### `onNotNull`

```ts
db
  .from('users')
  .join('user_logins', (query) => {
    query.onNotNull('user_logins.ip_address')
  })
```

### `onExists`

```ts
db
  .from('users')
  .join('user_logins', (query) => {
    query.onExists((subquery) => {
      subquery
        .select('*')
        .from('accounts')
        .whereRaw('users.account_id = accounts.id')
    })
  })
```

### `onNotExists`

```ts
db
  .from('users')
  .join('user_logins', (query) => {
    query.onNotExists((subquery) => {
      subquery
        .select('*')
        .from('accounts')
        .whereRaw('users.account_id = accounts.id')
    })
  })
```

### `onBetween`

```ts
db
  .from('users')
  .join('user_logins', (query) => {
    query.onBetween('user_logins.login_date', ['2020-10-01', '2020-12-31'])
  })
```

### `onNotBetween`

```ts
db
  .from('users')
  .join('user_logins', (query) => {
    query.onNotBetween('user_logins.login_date', ['2020-10-01', '2020-12-31'])
  })
```

### `having`

O método `having` adiciona a cláusula **having**. Ele aceita o nome da coluna como o primeiro argumento, seguido pelo operador opcional e o valor.

```ts
db
  .from('exams')
  .select('user_id')
  .groupBy('user_id')
  .having('score', '>', 80)
```

### `havingRaw`
Na maioria das vezes, você se verá usando o método `havingRaw`, pois pode definir os agregados para a cláusula having.

```ts
db
  .from('exams')
  .select('user_id')
  .groupBy('user_id')
  .havingRaw('SUM(score) > ?', [200])
```

### Variantes do método `having`

A seguir está a lista de todos os métodos **having** disponíveis.

| Método | Descrição |
|--------|-------------|
| `havingIn` | Adiciona uma cláusula having in à consulta. Ele aceita uma matriz de valores. |
| `havingNotIn` | Adiciona uma cláusula having not in à consulta. Ele aceita uma matriz de valores. |
| `havingNull` | Adiciona uma cláusula having null à consulta. |
| `havingNotNull` | Adiciona uma cláusula having not null à consulta. |
| `havingExists` | Adiciona uma cláusula having exists à consulta. |
| `havingNotExists` | Adiciona uma cláusula having not exists à consulta. |
| `havingBetween` | Adiciona uma cláusula having between à consulta. Ela aceita uma matriz de valores. |
| `havingNotBetween` | Adiciona uma cláusula having not between à consulta. Ela aceita uma matriz de valores |

### `distinct`
O método `distinct` aplica a cláusula **distinct** à instrução select. Você pode definir um ou mais nomes de colunas como vários argumentos.

```ts
db
  .from('users')
  .distinct('country')

db
  .from('users')
  .distinct('country', 'locale')
```

Você pode chamar o método `distinct` sem nenhum parâmetro para eliminar linhas duplicadas.

```ts
db.from('users').distinct()
```

Há outro método somente para PostgreSQL, `distinctOn`. Aqui está um artigo explicando [SELECT DISTINCT ON](https://www.geekytidbits.com/postgres-distinct-on/).

```ts
db
  .from('logs')
  .distinctOn('url')
  .orderBy('created_at', 'DESC')
```

### `groupBy`
O método `groupBy` aplica a cláusula **group by** à consulta.

```ts
db
  .from('logs')
  .select('url')
  .groupBy('url')
```

### `groupByRaw`
O método `groupByRaw` permite escrever uma consulta SQL para definir a instrução group by.

```ts
db
  .from('sales')
  .select('year')
  .groupByRaw('year WITH ROLLUP')
```

### `orderBy`
O método `orderBy` aplica a cláusula **order by** à consulta.

```ts
db
  .from('users')
  .orderBy('created_at', 'desc')
```

Você pode classificar por várias colunas chamando o método `orderBy` várias vezes.

```ts
db
  .from('users')
  .orderBy('username', 'asc')
  .orderBy('created_at', 'desc')
```

Ou passe uma matriz de objetos.

```ts
db
  .from('users')
  .orderBy([
    {
      column: 'username',
      order: 'asc',
    },
    {
      column: 'created_at',
      order: 'desc',
    }
  ])
```

Você também pode passar uma instância de subconsulta para o método `orderBy` — por exemplo, Classificar postagens pelo número de comentários que receberam.

```ts
const commentsCountQuery = db
  .from('comments')
  .count('*')
  .whereColumn('posts.id', '=', 'comments.post_id')

db
  .from('posts')
  .orderBy(commentsCountQuery, 'desc')
```

### `orderByRaw`
Use o método `orderByRaw` para definir a ordem de classificação de uma string SQL.

```ts
const commentsCountQuery = db
  .raw(
    'select count(*) from comments where posts.id = comments.post_id'
  )
  .wrap('(', ')')

db
  .from('posts')
  .orderBy(commentsCountQuery, 'desc')
```

### `offset`
Aplicar offset à consulta SQL

```ts
db.from('posts').offset(11)
```

### `limit`
Aplicar um limite à consulta SQL

```ts
db.from('posts').limit(20)
```

### `forPage`
O `forPage` é um método conveniente para aplicar `offset` e `limit` usando o número da página. Ele aceita um total de dois argumentos.

- O primeiro argumento é o número da página **(não o offset)**.
- O segundo argumento é o número de linhas a serem buscadas. O padrão é 20

```ts
db
  .from('posts')
  .forPage(request.input('page', 1), 20)
```

### `count`
O método `count` permite que você use o **count agregado** em suas consultas SQL.

:::note
As chaves para os valores agregados são específicas do dialeto e, portanto, recomendamos que você sempre defina aliases para saída previsível.
:::

:::note
No PostgreSQL, o método count retorna uma representação de string de um tipo de dados bigint.
:::

```ts
const users = await db
  .from('users')
  .count('* as total')

console.log(users[0].total)
```

Você também pode definir o agregado da seguinte forma:

```ts
const users = await db
  .from('users')
  .count('*', 'total')

console.log(users[0].total)
```

Você pode contar várias colunas da seguinte forma:

```ts
const users = await db
  .from('users')
  .count({
    'active': 'is_active',
    'total': '*',
  })

console.log(users[0].total)
console.log(users[0].active)
```

### Outros métodos agregados
A API para todos os métodos agregados a seguir é idêntica ao método `count`.

| Método | Descrição |
|--------|-------------|
| `countDistinct` | Conta apenas as linhas distintas |
| `min` | Agrega valores usando a função **min** |
| `max` | Agrega valores usando a função **max** |
| `sum` | Agrega valores usando a função **sum** |
| `sumDistinct` | Agrega valores apenas para linhas distintas usando a função **sum** |
| `avg` | Agregar valores usando a **função avg** |
| `avgDistinct` | Agregar valores somente para linhas distintas usando a **função avg** |

### `union`
O método `union` permite que você crie uma consulta de união usando várias instâncias do construtor de consultas. Por exemplo:

```ts
db
  .from('users')
  .whereNull('last_name')
  .union((query) => {
    query.from('users').whereNull('first_name')
  })

/**
SELECT * FROM "users" WHERE "last_name" IS NULL
UNION
SELECT * FROM "users" WHERE "first_name" IS NULL
*/
```

Você também pode encapsular suas consultas de união passando um sinalizador booleano como o segundo argumento.

```ts
db
  .from('users')
  .whereNull('last_name')
  .union((query) => {
    query.from('users').whereNull('first_name')
  }, true) // 👈

/**
SELECT * FROM "users" WHERE "last_name" IS NULL
UNION
(SELECT * FROM "users" WHERE "first_name" IS NULL)
*/
```

Você pode passar uma matriz de retornos de chamada para definir várias consultas de união.

```ts
db
  .from('users')
  .whereNull('last_name')
  // highlight-start
  .union([
    (query) => {
      query.from('users').whereNull('first_name')
    },
    (query) => {
      query.from('users').whereNull('email')
    },
  ], true)
  // highlight-end

// highlight-start
/**
SELECT * FROM "users" WHERE "last_name" IS NULL
UNION
(SELECT * FROM "users" WHERE "first_name" IS NULL)
UNION
(SELECT * FROM "users" WHERE "email" IS NULL)
*/
// highlight-end
```

Você também pode definir consultas de união passando uma instância de um construtor de consultas.

```ts
db
  .from('users')
  .whereNull('last_name')
  // highlight-start
  .union([
    db.from('users').whereNull('first_name'),
    db.from('users').whereNull('email')
  ], true)
  // highlight-end
```

Os métodos a seguir têm a mesma API que o método `union`.

- `unionAll`
- `intersect`

### `with`
O método `with` permite que você use CTE (Common table expression) em **PostgreSQL**, **Oracle**, **SQLite3** e os bancos de dados **MSSQL**.

```ts
db
  .query()
  .with('aliased_table', (query) => {
    query.from('users').select('*')
  })
  .select('*')
  .from('aliased_table')

/**
WITH "aliased_table" AS (
  SELECT * FROM "users"
)
SELECT * FROM "aliased_table"
*/
```

O método também aceita um terceiro parâmetro opcional que é uma matriz de nomes de colunas. O número de nomes de colunas especificado deve corresponder ao número de colunas no conjunto de resultados da consulta CTE.

```ts
db
  .query()
  .with('aliased_table', (query) => {
    query.from('users').select('id', 'email')
  }, ['id', 'email'])
  .select('*')
  .from('aliased_table')

/**
WITH "aliased_table" (id, email) AS (
  SELECT * FROM "users"
)
SELECT * FROM "aliased_table"
*/
```

### `withMaterialized` / `withNotMaterialized`
Os métodos `withMaterialized` e `withNotMaterialized` permitem que você use CTE (Common table expression) como visualizações materializadas nos bancos de dados **PostgreSQL** e **SQLite3**.

```ts
db
  .query()
  .withMaterialized('aliased_table', (query) => {
    query.from('users').select('*')
  })
  .select('*')
  .from('aliased_table')

/**
WITH "aliased_table" AS MATERIALIZED (
  SELECT * FROM "users"
)
SELECT * FROM "aliased_table"
*/
```

### `withRecursive`
O método `withRecursive` cria uma CTE (Common table expression) recursiva nos bancos de dados **PostgreSQL**, **Oracle**, **SQLite3** e **MSSQL**.

No exemplo a seguir, calculamos a soma de todas as contas filhas de uma conta pai. Além disso, assumimos a seguinte estrutura de tabela.

| id | name              | parent_id | amount |
|----|-------------------|-----------|--------|
|  1 | Expenses          |      NULL |   NULL |
|  2 | Car Expenses      |         1 |    100 |
|  3 | Food Expenses     |         1 |     40 |
|  4 | Earnings          |      NULL |   NULL |
|  5 | Freelance work    |         4 |    100 |
|  6 | Blog post payment |         4 |     78 |
|  7 | Car service       |         2 |     60 |

```ts
db
  .query()
  .withRecursive('tree', (query) => {
    query
      .from('accounts')
      .select('amount', 'id')
      .where('id', 1)
      .union((subquery) => {
        subquery
          .from('accounts as a')
          .select('a.amount', 'a.id')
          .innerJoin('tree', 'tree.id', '=', 'a.parent_id')
      })
  })
  .sum('amount as total')
  .from('tree')
```

O exemplo acima não pretende simplificar a complexidade do SQL. Em vez disso, ele demonstra o poder do construtor de consultas para construir tais consultas SQL sem escrevê-las como uma string SQL.

O método também aceita um terceiro parâmetro opcional que é uma matriz de nomes de colunas. O número de nomes de colunas especificado deve corresponder ao número de colunas no conjunto de resultados da consulta CTE.

```ts
db
  .query()
  .withRecursive('tree', (query) => {
    query
      .from('accounts')
      .select('amount', 'id')
      .where('id', 1)
      .union((subquery) => {
        subquery
          .from('accounts as a')
          .select('a.amount', 'a.id')
          .innerJoin('tree', 'tree.id', '=', 'a.parent_id')
      })
  }, ['amount', 'id'])
  .sum('amount as total')
  .from('tree')
```

Aqui está um ótimo artigo explicando a [Consulta Recursiva PostgreSQL](https://www.postgresqltutorial.com/postgresql-recursive-query/)

### `update`
O método `update` permite atualizar uma ou mais linhas do banco de dados. Você pode usar o construtor de consultas para adicionar restrições adicionais ao executar a atualização.

```ts
const affectedRows = db
  .from('users')
  .where('id', 1)
  .update({ email: 'virk@adonisjs.com' })
```

O valor de retorno é o número de linhas afetadas. No entanto, ao usar `PostgreSQL`, `Oracle` ou `MSSQL`, você também pode especificar as colunas de retorno.

```ts
const rows = db
  .from('users')
  .where('id', 1)
  .update(
    { email: 'virk@adonisjs.com' },
    ['id', 'email'] // columns to return
  )

console.log(rows[0].id)
console.log(rows[0].email)
```

### `increment`
O método `increment` permite incrementar o valor de uma ou mais colunas.

```ts
db
  .from('accounts')
  .where('id', 1)
  .increment('balance', 10)

/**
UPDATE "accounts"
SET
  "balance" = "balance" + 10
WHERE
  "id" = 1
*/
```

Você também pode incrementar várias colunas passando um objeto.

```ts
db
  .from('accounts')
  .where('id', 1)
  .increment({
    balance: 10,
    credit_limit: 5
  })

/**
UPDATE "accounts"
SET
  "balance" = "balance" + 10,
  "credit_limit" = "credit_limit" + 5
WHERE
  "id" = 1
*/
```

### `decrement`
O método `decrement` é o oposto do método `increment`. No entanto, a API é a mesma.

```ts
db
  .from('accounts')
  .where('id', 1)
  .decrement('balance', 10)
```

### `delete`
O método `delete` emite uma consulta SQL **delete**. Você pode usar o construtor de consultas para adicionar restrições adicionais ao executar a exclusão.

```ts
db
  .from('users')
  .where('id', 1)
  .delete()
```

O método `delete` também tem um alias chamado `del`.

### `useTransaction`
O método `useTransaction` instrui o construtor de consultas a encapsular a consulta dentro de uma transação. O guia em [transações de banco de dados](../guides/transactions.md) abrange diferentes maneiras de criar e usar transações em seu aplicativo.

```ts
const trx = await db.transaction()

db
  .from('users')
  .useTransaction(trx) // 👈
  .where('id', 1)
  .update({ email: 'virk@adonisjs.com' })

await trx.commit()
```

### `forUpdate`
O método `forUpdate` adquire um bloqueio de atualização nas linhas selecionadas no PostgreSQL e MySQL.

:::note
Certifique-se de sempre fornecer o objeto de transação usando o método `useTransaction` antes de usar `forUpdate` ou bloqueios semelhantes.
:::

```ts
const user = db
  .from('users')
  .where('id', 1)
  .useTransaction(trx)
  .forUpdate() // 👈
  .first()
```

### `forShare`
O `forShare` adiciona um **FOR SHARE no PostgreSQL** e um **LOCK IN SHARE MODE para MySQL** durante uma instrução select.

```ts
const user = db
  .from('users')
  .where('id', 1)
  .useTransaction(trx)
  .forShare() // 👈
  .first()
```

### `skipLocked`
O método `skipLocked` ignora as linhas bloqueadas por outra transação. O método é suportado apenas pelo MySQL 8.0+ e PostgreSQL 9.5+.

```ts
db
  .from('users')
  .where('id', 1)
  .forUpdate()
  .skipLocked() // 👈
  .first()

/**
SELECT * FROM "users"
WHERE "id" = 1
FOR UPDATE SKIP LOCKED
*/
```

### `noWait`
O método `noWait` falha se qualquer uma das linhas selecionadas estiver bloqueada por outra transação. O método é suportado apenas pelo MySQL 8.0+ e PostgreSQL 9.5+.

```ts
db
  .from('users')
  .where('id', 1)
  .forUpdate()
  .noWait() // 👈
  .first()

/**
SELECT * FROM "users"
WHERE "id" = 1
FOR UPDATE NOWAIT
*/
```

### `clone`
O método `clone` retorna um novo objeto construtor de consultas com todas as restrições aplicadas da consulta original.

```ts
const query = db.from('users').select('id', 'email')
const clonedQuery = query.clone().clearSelect()

await query // select "id", "email" from "users"
await clonedQuery // select * from "users"
```

### `debug`
O método `debug` permite habilitar ou desabilitar a depuração em um nível de consulta individual. Aqui está um [guia completo](../guides/debugging.md) sobre consultas de depuração.

```ts
db
  .from('users')
  .debug(true)
```

### `timeout`
Defina o `timeout` para a consulta. Uma exceção é gerada após o tempo limite ter sido excedido.

O valor do tempo limite é sempre em milissegundos.

```ts
db
  .from('users')
  .timeout(2000)
```

Você também pode cancelar a consulta ao usar tempos limite com MySQL e PostgreSQL.

```ts
db
  .from('users')
  .timeout(2000, { cancel: true })
```

### `toSQL`
O método `toSQL` retorna o SQL de consulta e as ligações como um objeto.

```ts
const output = db
  .from('users')
  .where('id', 1)
  .toSQL()

console.log(output)
```

O objeto `toSQL` também tem o método `toNative` para formatar a consulta SQL de acordo com o dialeto do banco de dados em uso.

```ts
const output = db
  .from('users')
  .where('id', 1)
  .toSQL()
  .toNative()

console.log(output)
```

### `toQuery`
Retorna a consulta SQL após aplicar os parâmetros de ligação.

```ts
const output = db
  .from('users')
  .where('id', 1)
  .toQuery()

console.log(output)
// select * from "users" where "id" = 1
```

## Executando consultas
O construtor de consultas estende a classe nativa `Promise`. Você pode executar as consultas usando a palavra-chave `await` ou encadeando os métodos `then/catch`.

```ts
db
  .from('users')
  .then((users) => {
  })
  .catch((error) => {
  })
```

Usando async/await

```ts
const users = await db.from('users')
```

Além disso, você pode executar uma consulta chamando explicitamente o método `exec`.

```ts
const users = await db.from('users').exec()
```

### `first`
As consultas select sempre retornam uma matriz de objetos, mesmo quando a consulta tem a intenção de buscar uma única linha. No entanto, usar o método `first` fornecerá a primeira linha ou nulo (quando não houver linhas).

:::note
First NÃO significa a primeira linha na tabela. Significa a primeira linha da matriz results em qualquer ordem em que você a buscou do banco de dados.
:::

```ts
const user = await db
  .from('users')
  .where('id', 1)
  .first()

if (user) {
  console.log(user.id)
}
```

### `firstOrFail`
O método `firstOrFail` é semelhante ao método `first`, exceto que ele gera uma exceção quando nenhuma linha é encontrada.

```ts
const user = await db
  .from('users')
  .where('id', 1)
  .firstOrFail()
```

## Paginação
O construtor de consultas tem suporte de primeira classe para paginação baseada em deslocamento. Ele também conta automaticamente o número de linhas totais executando uma consulta separada nos bastidores.

```ts
const page = request.input('page', 1)
const limit = 20

const results = await db
  .from('users')
  .paginate(page, limit)
```

O método `paginate` retorna uma instância da classe [SimplePaginator](https://github.com/adonisjs/lucid/blob/efed38908680cca3b288d9b2a123586fab155b1d/src/Database/Paginator/SimplePaginator.ts#L20). A classe tem as seguintes propriedades e métodos.

### `firstPage`
Retorna o número da primeira página. É sempre `1`.

```ts
results.firstPage
```

### `perPage`
Retorna o valor para o limite passado para o método `paginate`.

```ts
results.perPage
```

### `currentPage`
Retorna o valor da página atual.

```ts
results.currentPage
```

### `lastPage`
Retorna o valor da última página considerando o total de linhas.

```ts
results.lastPage
```

### `total`
Mantém o valor do número total de linhas no banco de dados.

```ts
results.total
```

### `hasPages`
Um booleano para saber se há páginas para paginação. Você pode confiar neste valor para decidir quando ou não mostrar os links de paginação.

A seguir, um exemplo da visualização Edge.

```edge
@if(results.hasPages)

  {{-- Display pagination links --}}

@endif
```

### `hasMorePages`
Um booleano para saber se há mais páginas para ir depois da página atual.

```ts
results.hasMorePages
```

### `all()`
Retorna uma matriz de linhas retornadas pelas consultas SQL.

```ts
results.all()
```

### `getUrl`
Retorna a URL para um determinado número de página.

```ts
result.getUrl(1) // /?page=1
```

### `getNextPageUrl`
Retorna a URL para a próxima página

```ts
// Assuming the current page is 2

result.getNextPageUrl() // /?page=3
```

### `getPreviousPageUrl`
Retorna a URL para a página anterior

```ts
// Assuming the current page is 2

result.getPreviousPageUrl() // /?page=1
```

### `getUrlsForRange`
Retorna URLs para um determinado intervalo. Útil quando você deseja renderizar links para um determinado intervalo.

A seguir, um exemplo de uso de `getUrlsForRange` dentro de um modelo do Edge.

```edge
@each(
  link in results.getUrlsForRange(results.firstPage, results.lastPage)
)
  <a
    href="{{ link.url }}"
    class="{{ link.isActive ? 'active' : '' }}"
  >
    {{ link.page }}
  </a>
@endeach
```

### `toJSON`
O método `toJSON` retorna um objeto com propriedades `meta` e `data`. A saída do método é adequada para respostas da API JSON.

```ts
results.toJSON()

/**
{
  meta: {
    total: 200,
    perPage: 20,
    currentPage: 1,
    firstPage: 1,
    lastPage: 20,
    ...
  },
  data: [
    {
    }
  ]
}
*/
```

### `baseUrl`
Todos os URLs gerados pela classe paginadora usam o URL `/` (raiz). No entanto, você pode alterar isso definindo um URL base personalizado.

```ts
results.baseUrl('/posts')

results.getUrl(2) // /posts?page=2
```

### `queryString`
Defina a string de consulta a ser anexada aos URLs gerados pela classe paginadora.

```ts
results.queryString({ limit: 20, sort: 'top' })

results.getUrl(2) // /?page=2&limit=20&sort=top
```

## Propriedades e métodos úteis
A seguir está a lista de propriedades e métodos que você pode precisar ocasionalmente ao construir algo em cima do construtor de consultas.

### `client`
Referência à instância do [cliente de consulta de banco de dados](https://github.com/adonisjs/lucid/blob/develop/src/query_client/index.ts) subjacente.

```ts
const query = db.query()
console.log(query.client)
```

### `knexQuery`
Referência à instância da consulta KnexJS subjacente.

```ts
const query = db.query()
console.log(query.knexQuery)
```

### `hasAggregates`
Um booleano para saber se a consulta está usando algum dos métodos de agregação.

```ts
const query = db.from('posts').count('* as total')
console.log(query.hasAggregates) // true
```

### `hasGroupBy`
Um booleano para saber se a consulta está usando uma cláusula group by.

```ts
const query = db.from('posts').groupBy('tenant_id')
console.log(query.hasGroupBy) // true
```

### `hasUnion`
Um booleano para saber se a consulta está usando uma união.

```ts
const query = db
  .from('users')
  .whereNull('last_name')
  .union((query) => {
    query.from('users').whereNull('first_name')
  })

console.log(query.hasUnion) // true
```

### `clearSelect`
Chame este método para limpar colunas selecionadas.

```ts
const query = db.query().select('id', 'title')
query.clone().clearSelect()
```

### `clearWhere`
Chame este método para limpar cláusulas where.

```ts
const query = db.query().where('id', 1)
query.clone().clearWhere()
```

### `clearOrder`
Chame este método para limpar a ordem por restrição.

```ts
const query = db.query().orderBy('id', 'desc')
query.clone().clearOrder()
```

### `clearHaving`
Chame este método para limpar a cláusula having.

```ts
const query = db.query().having('total', '>', 100)
query.clone().clearHaving()
```

### `clearLimit`
Chame este método para limpar o limite aplicado.

```ts
const query = db.query().limit(20)
query.clone().clearLimit()
```

### `clearOffset`
Chame este método para limpar o deslocamento aplicado.

```ts
const query = db.query().offset(20)
query.clone().clearOffset()
```

### `reporterData`
O construtor de consultas emite o evento `db:query` e relata o tempo de execução da consulta com o profiler do framework.

Usando o método `reporterData`, você pode passar detalhes adicionais para o evento e o profiler.

```ts
const query = db.from('users')

await query
  .reporterData({ userId: auth.user.id })
  .select('*')
```

Dentro do evento `db:query`, você pode acessar o valor de `userId` da seguinte forma.

```ts
Event.on('db:query', (query) => {
  console.log(query.userId)
})
```

### `withSchema`
Especifique o esquema PostgreSQL a ser usado ao executar a consulta.

```ts
db
  .from('users')
  .withSchema('public')
  .select('*')
```

### `as`
Especifique o alias para uma determinada consulta. Geralmente útil ao passar a instância do construtor de consultas como uma subconsulta. Por exemplo:

```ts
db
  .from('users')
  .select(
    db
      .from('user_logins')
      .select('ip_address')
      .whereColumn('users.id', 'user_logins.user_id')
      .orderBy('id', 'desc')
      .limit(1)
      .as('last_login_ip') // 👈 Query alias
  )
```

### `if`

O auxiliar `if` permite que você adicione restrições condicionalmente ao construtor de consultas. Por exemplo:

```ts
db
  .from('users')
  .if(searchQuery, (query) => {
    query.where('first_name', 'like', `%${searchQuery}%`)
    query.where('last_name', 'like', `%${searchQuery}%`)
  })
```

Você pode definir o método `else` passando outro retorno de chamada como o segundo argumento.

```ts
db
  .from('users')
  .if(
    condition,
    (query) => {}, // if condition met
    (query) => {}, // otherwise execute this
  )
```

### `unless`
O método `unless` é o oposto do auxiliar `if`.

```ts
db
  .from('projects')
  .unless(filters.status, () => {
    /**
     * Fetch projects with "active" status when
     * not status is defined in filters
     */
    query.where('status', 'active')
  })
```

Você pode passar outro retorno de chamada que é executado quando a declaração `unless` não é verdadeira.

```ts
db
  .from('users')
  .unless(
    condition,
    (query) => {}, // if condition met
    (query) => {}, // otherwise execute this
  )
```

### `match`
O auxiliar `match` permite que você defina uma matriz de blocos condicionais para corresponder e executar o retorno de chamada correspondente.

No exemplo a seguir, o construtor de consultas percorrerá todos os blocos condicionais e executará o primeiro correspondente e descartará o outro. **Pense nisso como uma instrução `switch` em JavaScript**.

```ts
db
  .query()
  .match(
    [
      // Run this is user is a super user
      auth.isSuperUser, (query) => query.whereIn('status', ['published', 'draft'])
    ],
    [
      // Run this is user is loggedin
      auth.user, (query) => query.where('user_id', auth.user.id)
    ],
    // Otherwise run this
    (query) => query.where('status', 'published').where('is_public', true)
  )
```

### `ifDialect`
O auxiliar `ifDialect` permite que você adicione restrições condicionalmente ao construtor de consultas quando o dialeto corresponde a um dos dialetos mencionados.

```ts
db
  .from('users')
  .query()
  .ifDialect('postgres', (query) => {
      query.whereJson('address', { city: 'XYZ', pincode: '110001' })
    }, 
  )
```

Você pode definir o método else passando outro retorno de chamada como o segundo argumento.

```ts
db
  .from('users')
  .ifDialect('postgres',
    (query) => {}, // if dialect is postgres
    (query) => {}, // otherwise execute this
  )
```

### `unlessDialect`
O método `unlessDialect` é o oposto do auxiliar `ifDialect`.

```ts
db
  .from('users')
  .unlessDialect('postgres', (query) => {
      query.whereJson('address', { city: 'XYZ', pincode: '110001' })
    } 
  )
```

Você pode passar outro retorno de chamada que é executado quando a instrução `unlessDialect` não é verdadeira.
```ts
db
  .from('users')
  .query()
  .unlessDialect('postgres',
    (query) => {}, // if dialect is anything other than postgres
    (query) => {}  // otherwise execute this
  )
```
