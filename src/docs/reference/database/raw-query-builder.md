# Consultas cruas

As consultas cruas permite que você execute consultas de uma string SQL. Mesmo que você esteja executando diretamente strings SQL brutas, você ainda pode manter suas consultas seguras de injeção de SQL usando placeholders para valores.

## Executando consulta
A seguir está um exemplo de execução de consulta de uma string SQL.

::: info NOTA
Ao executar consultas brutas, os resultados do driver subjacente são retornados como estão.
:::

```ts
import Database from '@ioc:Adonis/Lucid/Database'
await Database.rawQuery('select * from users')
```

### Usando ligações
Para evitar que suas consultas sejam injetadas em SQL. Você nunca deve codificar a entrada do usuário diretamente nas consultas e, em vez disso, confiar em placeholders e ligações. Por exemplo:

### Placeholders posicionais

```ts
Database.rawQuery(
  'select * from users where id = ?',
  [1]
)

// SELECT * FROM "users" WHERE "id" = 1
```

Você também pode passar um nome de coluna dinâmico usando ligações. O `??` é analisado como um nome de coluna e `?` é analisado como um valor.

```ts
Database.rawQuery(
  'select * from users where ?? = ?',
  ['users.id', 1]
)

// SELECT * FROM "users" WHERE "users"."id" = 1
```

### Espaços reservados nomeados

Você também pode nomear espaços reservados e usar objetos para definir vinculações. Por exemplo:

```ts
Database.rawQuery(
  'select * from users where id = :id',
  {
    id: 1,
  }
)
```

Você precisa usar também anexar os dois pontos `:` após o espaço reservado ao usar um nome de coluna dinâmico.

```ts
Database.rawQuery(
  'select * from users where :column: = :value',
  {
    column: 'id',
    value: 1,
  }
)
```

Outro exemplo comparando duas colunas entre si.

```ts
Database.rawQuery(
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
Existem duas maneiras de criar consultas brutas usando o módulo `Database`.

```ts
Database.rawQuery('select * from users')
```

E

```ts
Database.raw('select * from users')
```

A `rawQuery` pode ser executada usando a palavra-chave `await` ou encadeando os métodos `then/catch`.

No entanto, a saída do método `raw` deve ser usada em outras consultas. Por exemplo

```ts
await Database.select(
  'id',
  Database.raw('select ip_address from user_logins'),
)
```

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis no construtor de consultas brutas.

### `wrap`
Envolva a consulta bruta com um prefixo e um sufixo. Geralmente útil ao passar a consulta bruta como referência.

```ts
await Database.select(
  'id',
  Database
    .raw('select ip_address from user_logins')
    .wrap('(', ')'),
)
```

### `debug`
O método `debug` permite habilitar ou desabilitar a depuração em um nível de consulta individual. Aqui está um [guia completo](../../guides/database/debugging.md) sobre consultas de depuração.

```ts
await Database
  .rawQuery('select * from users')
  .debug(true)
```

### `timeout`
Defina o `timeout` para a consulta. Uma exceção é gerada após o timeout ter sido excedido.

O valor do timeout é sempre em milissegundos.

```ts
await Database
  .rawQuery('select * from users')
  .timeout(2000)
```

Você também pode cancelar a consulta ao usar timeouts com MySQL e PostgreSQL.

```ts
await Database
  .rawQuery('select * from users')
  .timeout(2000, { cancel: true })
```

### `client`
Referência à instância do [cliente de consulta de banco de dados](./query-client.md) subjacente.

```ts
const query = Database.rawQuery(sql, bindings)
console.log(query.client)
```

### `knexQuery`
Referência à instância da consulta KnexJS subjacente.

```ts
const query = Database.rawQuery(sql, bindings)
console.log(query.knexQuery)
```

### `reporterData`
O construtor de consultas emite o evento `db:query` e também relata o tempo de execução das consultas com o profiler do framework.

Usando o método `reporterData`, você pode passar detalhes adicionais para o evento e o profiler.

```ts
Database
  .rawQuery(sql, bindings)
  .reporterData({ userId: auth.user.id })
```

Agora, dentro do evento `db:query`, você pode acessar o valor de `userId` da seguinte forma.

```ts
Event.on('db:query', (query) => {
  console.log(query.userId)
})
```
