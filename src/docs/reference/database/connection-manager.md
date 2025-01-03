# Gerenciador de conexões

A [classe do gerenciador de conexões](https://github.com/adonisjs/lucid/blob/efed38908680cca3b288d9b2a123586fab155b1d/src/Connection/Manager.ts#L32) é responsável por gerenciar uma ou mais instâncias de [conexão de banco de dados](./connection.md). Você pode acessar o `manager` a partir do módulo Database.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const manager = Database.manager
```

## Métodos/propriedades
A seguir está a lista de métodos/propriedades disponíveis na classe do gerenciador de conexões. Normalmente, você não precisa interagir com o gerenciador diretamente, pois os métodos a seguir são invocados internamente.

### `add`
Registre uma nova conexão com o gerenciador fornecendo o `nome` da conexão e sua configuração. O módulo de banco de dados registra automaticamente todas as conexões definidas dentro do arquivo `config/database.ts`.

```ts
const name = 'pg'

const config = {
  client: 'pg',
  connection: {
    // ...
  },
  healthCheck: true
}

Database.manager.add(name, config)
```

### `connect`
O método `connect` instancia uma conexão pré-registrada pelo seu nome. Por baixo dos panos, ele chama o método connect na [classe Connection](https://github.com/adonisjs/lucid/blob/efed38908680cca3b288d9b2a123586fab155b1d/src/Connection/Manager.ts#L126).

Chamar esse método várias vezes resulta em uma operação inativa.

```ts
Database.manager.connect('pg')
```

### `get`
Retorna o nó de conexão para uma conexão pré-registrada pelo seu nome.

```ts
const {
  name,
  state,
  connection,
  config
} = Database.manager.get('pg')
```

A seguir está a lista de propriedades disponíveis.

#### `name`
O nome da conexão, conforme definido no momento da adição.

#### `config`
Referência à configuração registrada

#### `connection`
Referência à instância subjacente [connection class](./connection.md).

#### `state`
O estado atual da conexão.

- `registered`: A conexão foi registrada usando o método `add`.
- `open`: A conexão está aberta para aceitar novas solicitações.
- `closing`: No processo de fechamento da conexão. Nenhuma nova consulta pode ser criada ou executada a partir desta conexão.
- `closed`: A conexão foi fechada e não pode aceitar mais nenhuma solicitação. Você deve chamar o método `connect` novamente.
- `migrating`: A configuração de conexão foi corrigida e está migrando para criar uma nova instância de conexão com a nova configuração.

### `has`
Retorna um booleano informando se a conexão foi registrada com o gerenciador ou não.

```ts
if (!Database.manager.has('pg')) {
  Database.manager.add('pg', {})
}
```

### `isConnected`
Descubra se uma conexão está no estado `aberto` ou não.

```ts
if (!Database.manager.isConnected('pg')) {
  Database.manager.connect('pg')
}
```

### `patch`
O método `patch` permite que você atualize a configuração para uma determinada conexão sem fechar a conexão existente ou abortar as consultas em andamento.

Após a conexão ter sido corrigida, todas as novas consultas usarão a configuração mais recente.

O método `patch` é realmente útil quando você tem um aplicativo multilocatário e deseja registrar conexões em tempo real para os locatários.

```ts
Database.manager.patch('pg', {
  client: 'pg',
  connection: {},
})

// Usa nova configuração
Database.manager.connect('pg')
```

### `close`
Fechar uma determinada conexão. O gerenciador de conexões ainda manterá o nó de conexão até que você libere a conexão explicitamente passando o segundo argumento.

```ts
// Fechar
await Database.manager.close('pg')
Database.manager.has('pg') // true
```

```ts
// Fechar + Liberar
await Database.manager.close('pg', true)
Database.manager.has('pg') // false
```

### `closeAll`
Fecha todas as conexões registradas. Um parâmetro booleano pode ser passado para também liberar a conexão.

```ts
await Database.manager.closeAll()
await Database.manager.closeAll(true)
```

### `release`
Libera uma conexão da lista gerenciada de conexões. A conexão será fechada automaticamente (se ainda não estiver fechada).

```ts
await Database.manager.release(true)
```

### `report`
Retorna o relatório de verificação de integridade para todas as conexões registradas.

```ts
const report = await Database.manager.report()

console.log(report.name)
console.log(report.health.healthy)
```

## Eventos
A seguir está a lista de eventos emitidos pela classe do gerenciador de conexões.

### `db` \ `:connection` \ `:connect`
Emitido quando o método `connect` é chamado

```ts
Database.manager.on('db:connection:connect', (connection) => {
  console.log(self === connection) // true
})
```

### `db` \ `:connection` \ `:error`
Emitido quando não é possível estabelecer a conexão

```ts
Database.manager.on('db:connection:error', (error, connection) => {
  console.log(connection)
})
```

### `db` \ `:connection` \ `:disconnect`
Emitido quando a conexão e as instâncias do Knex foram destruídas.

```ts
Database.manager.on('db:connection:disconnect', (connection) => {
  console.log(connection)
})
```
