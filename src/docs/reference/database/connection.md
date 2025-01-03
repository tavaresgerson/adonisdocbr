# Conexão

A [classe de conexão](https://github.com/adonisjs/lucid/blob/efed38908680cca3b288d9b2a123586fab155b1d/src/Connection/index.ts#L27) é responsável por gerenciar o ciclo de vida de uma determinada conexão de banco de dados. Você pode acessar a instância de conexão usando a propriedade `Database.manager`.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const { connection } = Database.manager.get('primary')
```

O nome da conexão é derivado do arquivo `config/database.ts`. No exemplo a seguir, `primary` é o nome da conexão.

```ts
{
  connections: {
    primary: {
      client: 'pg',
      connection: {
        // ...
      },
    }
  }
}
```

## Métodos/propriedades
A seguir está a lista dos métodos e propriedades disponíveis na classe de conexão. O código do usuário não interage com a instância de conexão diretamente, pois os métodos a seguir são invocados internamente.

### `connect`
Invocar o método `connect` instancia uma nova instância do Knex.js. Se você estiver usando réplicas de leitura/gravação, duas instâncias do Knex.js serão criadas, uma para gravação e outra para leitura.

::: info NOTA
O método `connect` é chamado automaticamente quando você executa uma nova consulta ao banco de dados.
:::

```ts
connection.connect()
```

### `disconnect`
O método `disconnect` desconecta a conexão do driver subjacente e destrói a(s) instância(s) do Knex.

```ts
await connection.disconnect()
```

### `getReport`
Retorna o relatório de verificação de integridade para a conexão fornecida.

```ts
const report = await connection.getReport()
```

### `pool`/`readPool`
Referência ao [objeto de pool tarnjs](https://github.com/vincit/tarn.js/) subjacente. A propriedade está disponível somente após o método `connect` ser chamado.

```ts
connection.pool.numFree()
connection.readPool.numFree()
```

### `client`/`readClient`
Referência à instância subjacente do Knex. A propriedade está disponível somente após o método `connect` ser chamado.

```ts
connection.client
connection.readClient
```

### `hasReadWriteReplicas`
Um booleano para saber se a conexão está usando réplicas de leitura e gravação ou não.

```ts
connection.hasReadWriteReplicas
```

### `ready`
Um booleano para saber se a conexão está pronta para fazer consultas. Se não, você deve chamar o método `connect`.

```ts
if (!connection.ready) {
  connection.connect()
}
```

### `config`
Referência ao objeto de configuração

```ts
connection.config
```

### `name`
A referência ao nome da conexão

```ts
connection.name
```

## Eventos
A seguir está a lista de eventos emitidos pela classe de conexão.

### `connect`
Emitido quando o método `connect` é chamado

```ts
connection.on('connect', (self) => {
  console.log(self === connection) // true
})
```

### `error`
Emitido quando não é possível estabelecer a conexão

```ts
connection.on('error', (error, self) => {
  console.log(error)
})
```

### `disconnect`
Emitido quando a conexão e as instâncias do Knex foram destruídas.

```ts
connection.on('disconnect', (self) => {
  console.log(self)
})
```

### `disconnect`\`:error`
Emitido quando não é possível desconectar ou destruir as instâncias do Knex.

```ts
connection.on('disconnect:error', (error, self) => {
  console.log(error)
})
```
