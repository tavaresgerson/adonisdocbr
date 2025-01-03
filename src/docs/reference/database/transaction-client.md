# Cliente de transação

O [Cliente de transação](https://github.com/adonisjs/lucid/blob/master/src/TransactionClient/index.ts) estende o [Cliente de consulta](./query-client.md) e tem as seguintes propriedades extras sobre o cliente de consulta padrão.

Você pode acessar o cliente de consulta de transação da seguinte forma:

```ts
import Database from '@ioc:Adonis/Lucid/Database'
const trx = await Database.transaction()

// para uma determinada conexão
const trx = await Database
  .connection('pg')
  .transaction()
```

Você também pode definir o nível de isolamento da transação da seguinte forma.

```ts
await Database.transaction({
  isolationLevel: 'read uncommitted'
})
```

A seguir está a lista de níveis de isolamento disponíveis.

- **"read uncommitted"** (*leitura não confirmada*)
- **"read committed"** (*leitura confirmada*)
- **"snapshot"**
- **"repeatable read"** (*leitura repetível*)
- **"serializable"** (*serializável*)

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis na classe do cliente de transação.

### `commit`
Confirme a transação

```ts
await trx.commit()
```

### `rollback`
Reverta a transação

```ts
await trx.rollback()
```

### `isCompleted`
Descubra se a transação foi concluída ou não.

```ts
if (!trx.isCompleted) {
  await trx.commit()
}
```

## Eventos
O cliente da transação também registra os seguintes eventos quando a transação é confirmada ou revertida.

```ts
trx.once('commit', (self) => {
  console.log(self)
})
```

```ts
trx.once('rollback', (self) => {
  console.log(self)
})
```
