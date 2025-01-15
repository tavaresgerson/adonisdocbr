# Raw query builder

O raw query builder permite que você execute consultas de uma string SQL. Mesmo que você esteja executando diretamente strings SQL brutas, você ainda pode manter suas consultas seguras de injeção de SQL usando marcadores de posição para valores.

::: info NOTA
Ao executar consultas brutas, os resultados do driver subjacente são retornados como estão.
:::

```ts
import db from '@adonisjs/lucid/services/db'
await db.rawQuery('select * from users')
```

## Usando ligações
Para evitar que suas consultas sejam injetadas em SQL. Você nunca deve codificar a entrada do usuário diretamente nas consultas e, em vez disso, confiar em marcadores de posição e ligações. Por exemplo:

```ts
await db.rawQuery(
  'select * from users where id = ?',
  [1]
)

// SELECT * FROM "users" WHERE "id" = 1
```

Você também pode passar um nome de coluna dinâmico usando ligações. O `??` é analisado como um nome de coluna e `?` é analisado como um valor.

```ts
db.rawQuery(
  'select * from users where ?? = ?',
  ['users.id', 1]
)

// SELECT * FROM "users" WHERE "users"."id" = 1
```

## Espaços reservados nomeados

Você também pode nomear espaços reservados e então usar objetos para definir ligações. Por exemplo:

```ts
db.rawQuery(
  'select * from users where id = :id',
  {
    id: 1,
  }
)
```

Você precisa usar também anexar os dois pontos `:` após o espaço reservado ao usar um nome de coluna dinâmico.

```ts
db.rawQuery(
  'select * from users where :column: = :value',
  {
    column: 'id',
    value: 1,
  }
)
```

Outro exemplo comparando duas colunas entre si.

```ts
db.rawQuery(
  'select * from user_logins inner join users on :column1: = :column2:',
  {
    column1: 'users.id',
    column2: 'user_logins.user_id',
  }
)

/**
SELECT * FROM
  user_logins
INNER JOIN
  users
ON
  "users"."id" = "user_logins"."user_id"
*/
```

## Consulta bruta vs bruta
Há duas maneiras de criar consultas brutas usando o serviço `db`, ou seja, `db.rawQuery` e `db.raw`.

As consultas criadas usando o método `db.rawQuery` podem ser executadas como consultas autônomas. Enquanto isso, as consultas criadas usando o método `db.raw` são métodos para passar por referência a outras consultas. Por exemplo:

```ts
// Consulta bruta autoexecutável

const result = await db.rawQuery('select * from users')
```

```ts
// Passando consulta bruta por referência

await db.select(
  'id',
  db.raw('select ip_address from user_logins'),
)
```

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis no construtor de consultas brutas.

### wrap
Envolva a consulta bruta com um prefixo e um sufixo. Geralmente útil ao passar a consulta bruta como referência.

```ts
await db.select(
  'id',
  db
    .raw('select ip_address from user_logins')
    .wrap('(', ')'),
)
```

### `debug`
O método `debug` permite habilitar ou desabilitar a depuração em um nível de consulta individual. Aqui está um [guia completo](../guides/debugging.md) sobre consultas de depuração.

```ts
await db
  .rawQuery('select * from users')
  .debug(true)
```

### `timeout`
Defina o `timeout` para a consulta. Uma exceção é gerada após o tempo limite ter sido excedido.

O valor do tempo limite é sempre em milissegundos.

```ts
await db
  .rawQuery('select * from users')
  .timeout(2000)
```

Você também pode cancelar a consulta ao usar timeouts com MySQL e PostgreSQL.

```ts
await db
  .rawQuery('select * from users')
  .timeout(2000, { cancel: true })
```

### `client`
Referência à instância do [cliente de consulta de banco de dados](https://github.com/adonisjs/lucid/blob/develop/src/query_client/index.ts) subjacente.

```ts
const query = db.rawQuery(sql, bindings)
console.log(query.client)
```

### `knexQuery`
Referência à instância da consulta KnexJS subjacente.

```ts
const query = db.rawQuery(sql, bindings)
console.log(query.knexQuery)
```

### `reporterData`
O construtor de consultas emite o evento `db:query` e também relata o tempo de execução das consultas com o profiler do framework.

Usando o método `reporterData`, você pode passar detalhes adicionais para o evento e o profiler.

```ts
db
  .rawQuery(sql, bindings)
  .reporterData({ userId: auth.user.id })
```

Agora, dentro do evento `db:query`, você pode acessar o valor de `userId` da seguinte forma.

```ts
import emitter from '@adonisjs/lucid/services/emitter'

emitter.on('db:query', (query) => {
  console.log(query.userId)
})
```
