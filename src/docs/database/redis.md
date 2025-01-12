---
summary: Use o Redis dentro de seus aplicativos AdonisJS usando o pacote `@adonisjs/redis`.
---

# Redis

Você pode usar o Redis dentro de seus aplicativos AdonisJS usando o pacote `@adonisjs/redis`. O pacote é um wrapper fino sobre [ioredis](https://github.com/redis/ioredis) com melhor DX em torno do Pub/Sub e gerenciamento automático de múltiplas conexões redis.

## Instalação

Instale e configure o pacote usando o seguinte comando:

```sh
node ace add @adonisjs/redis
```

::: details Veja os passos realizados pelo comando add

1. Instala o pacote `@adonisjs/redis` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/redis/redis_provider')
      ]
    }
    ```

3. Crie o arquivo `config/redis.ts`. Este arquivo contém a configuração de conexão para seu servidor redis.

4. Defina as seguintes variáveis ​​de ambiente e suas regras de validação.

```dotenv
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    REDIS_PASSWORD=
    ```

:::


## Configuração

A configuração do pacote Redis é armazenada dentro do arquivo `config/redis.ts`.

Veja também: [Stub do arquivo de configuração](https://github.com/adonisjs/redis/blob/main/stubs/config/redis.stub)

```ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/redis'

const redisConfig = defineConfig({
  connection: 'main',
  connections: {
    main: {
      host: env.get('REDIS_HOST'),
      port: env.get('REDIS_PORT'),
      password: env.get('REDIS_PASSWORD', ''),
      db: 0,
      keyPrefix: '',
    },
  },
})

export default redisConfig
```

### `connection`

A propriedade `connection` define a conexão a ser usada por padrão. Quando você executa comandos redis sem escolher uma conexão explícita, eles serão executados na conexão padrão.

### `connections`

A propriedade `connections` é uma coleção de várias conexões nomeadas. Você pode definir uma ou mais conexões dentro deste objeto e alternar entre elas usando o método `redis.connection()`.

Cada configuração de conexão nomeada é idêntica à [configuração aceita pelo ioredis](https://redis.github.io/ioredis/index.html#RedisOptions).

### Conectar via Socket
Você pode configurar o Redis para usar um socket Unix para conexões. Use a propriedade `path` no seu objeto de configuração do Redis e forneça o caminho do sistema de arquivos para o socket.

```ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/redis'

const redisConfig = defineConfig({
  connection: 'main',
  connections: {
    main: {
      path: env.get('REDIS_SOCKET_PATH'),
      db: 0,
      keyPrefix: '',
    },
  },
})

export default redisConfig
```

---

### Configurando clusters

O pacote `@adonisjs/redis` criará uma [conexão de cluster](https://github.com/redis/ioredis#cluster) se você definir uma matriz de hosts dentro da configuração de conexão. Por exemplo:

```ts
const redisConfig = defineConfig({
  connections: {
    main: {
      // highlight-start
      clusters: [
        { host: '127.0.0.1', port: 6380 },
        { host: '127.0.0.1', port: 6381 },
      ],
      clusterOptions: {
        scaleReads: 'slave',
        slotsRefreshTimeout: 10 * 1000,
      },
      // highlight-end
    },
  },
})
```

### Configurando sentinelas
Você pode configurar uma conexão redis para usar sentinelas definindo uma matriz de nós sentinelas dentro da configuração de conexão. Por exemplo:

Veja também: [Documentos do IORedis sobre configuração do Sentinels](https://github.com/redis/ioredis?tab=readme-ov-file#sentinel)

```ts
const redisConfig = defineConfig({
  connections: {
    main: {
      // highlight-start
      sentinels: [
        { host: 'localhost', port: 26379 },
        { host: 'localhost', port: 26380 },
      ],
      name: 'mymaster',
      // highlight-end
    },
  },
})
```

## Uso

Você pode executar comandos do redis usando o serviço `redis` exportado pelo pacote. O serviço redis é um objeto singleton configurado usando a configuração que você definiu dentro do arquivo `config/redis.ts`.

:::note

Consulte a documentação do [ioredis](https://redis.github.io/ioredis/classes/Redis.html) para visualizar a lista de métodos disponíveis. Como somos um wrapper sobre o IORedis, a API de comandos é idêntica.

:::

```ts
import redis from '@adonisjs/redis/services/main'

await redis.set('username', 'virk')
const username = await redis.get('username')
```

### Alternando entre conexões
Comandos executados usando o serviço `redis` são invocados contra a **conexão padrão** definida dentro do arquivo de configuração. No entanto, você pode executar comandos em uma conexão específica obtendo primeiro uma instância dela.

O método `.connection()` cria e armazena em cache uma instância de conexão para o tempo de vida do processo.

```ts
import redis from '@adonisjs/redis/services/main'

// highlight-start
// Get connection instance
const redisMain = redis.connection('main')
// highlight-end

await redisMain.set('username', 'virk')
const username = await redisMain.get('username')
```

### Encerrando conexões

As conexões são de longa duração, e você obterá a mesma instância toda vez que chamar o método `.connection()`. Você pode encerrar a conexão usando o método `quit`. Use o método `disconnect` para encerrar a conexão à força.

```ts
import redis from '@adonisjs/redis/services/main'

await redis.quit('main') // Quit the main connection
await redis.disconnect('main') // Force quit the main connection
```

```ts
import redis from '@adonisjs/redis/services/main'

const redisMain = redis.connection('main')
redisMain.quit() // Quit using connection instance
redisMain.disconnect() // Force quit using connection instance
```

## Tratamento de erros

As conexões Redis podem falhar a qualquer momento durante o ciclo de vida do seu aplicativo. Portanto, é essencial capturar os erros e ter uma estratégia de repetição.

Por padrão, o AdonisJS registrará os erros de conexão do Redis usando o [registrador de aplicativos](../digging_deeper/logger.md) e tentará uma conexão dez vezes antes de fechá-la permanentemente. A estratégia de repetição é definida para cada conexão dentro do arquivo `config/redis.ts`.

Veja também: [Documentos do IORedis sobre reconexão automática](https://github.com/redis/ioredis#auto-reconnect)

```ts
// title: config/redis.ts
{
  main: {
    host: env.get('REDIS_HOST'),
    port: env.get('REDIS_PORT'),
    password: env.get('REDIS_PASSWORD', ''),
    // highlight-start
    retryStrategy(times) {
      return times > 10 ? null : times * 50
    },
    // highlight-end
  },
}
```

Você pode desabilitar o relator de erros padrão usando o método `.doNotLogErrors`. Isso removerá o ouvinte de eventos `error` da conexão do Redis.

```ts
import redis from '@adonisjs/redis/services/main'

/**
 * Disable default error reporter
 */
redis.doNotLogErrors()

redis.on('connection', (connection) => {
  /**
   * Make sure always to have an error listener defined.
   * Otherwise, the app will crash
   */
  connection.on('error', (error) => {
    console.log(error)
  })
})
```

## Pub/Sub

O Redis precisa de várias conexões para publicar e assinar canais. A conexão do assinante não pode executar operações além de assinar novos canais/padrões e cancelar a assinatura.

Ao usar o pacote `@adonisjs/redis`, você não precisa criar uma conexão de assinante manualmente; nós cuidaremos disso para você. Quando você chamar o método `subscribe` pela primeira vez, criaremos automaticamente uma nova conexão de assinante.

```ts
import redis from '@adonisjs/redis/services/main'

redis.subscribe('user:add', function (message) {
  console.log(message)
})
```

### Diferenças de API entre IORedis e AdonisJS

Ao usar `ioredis`, você deve usar duas APIs diferentes para assinar um canal e ouvir novas mensagens. No entanto, com o wrapper AdonisJS, o método `subscribe` cuida de ambos.

:::caption{for="info"}
**Com IORedis**
:::

```ts
redis.on('message', (channel, messages) => {
  console.log(message)
})

redis.subscribe('user:add', (error, count) => {
  if (error) {
    console.log(error)
  }
})
```

:::caption{for="info"}
**Com AdonisJS**
:::

```ts
redis.subscribe('user:add', (message) => {
  console.log(message)
},
{
  onError(error) {
    console.log(error)
  },
  onSubscription(count) {
    console.log(count)
  },
})
```

### Publicando mensagens

Você pode publicar mensagens usando o método `publish`. O método aceita o nome do canal como o primeiro parâmetro e os dados para publicar como o segundo parâmetro.

```ts
redis.publish(
  'user:add',
  JSON.stringify({
    id: 1,
    username: 'virk',
  })
)
```

### Assinando padrões

Você pode assinar padrões usando o método `psubscribe`. Semelhante ao método `subscribe`, ele criará uma conexão de assinante (se não existir uma).

```ts
redis.psubscribe('user:*', (channel, message) => {
  console.log(channel)
  console.log(message)
})

redis.publish(
  'user:add',
  JSON.stringify({
    id: 1,
    username: 'virk',
  })
)
```

### Cancelando assinatura

Você pode cancelar a assinatura de canais ou padrões usando os métodos `unsubscribe` e `punsubscribe`.

```ts
await redis.unsubscribe('user:add')
await redis.punsubscribe('user:*add*')
```

## Usando scripts Lua

Você pode registrar scripts Lua como comandos com o serviço redis, e eles serão aplicados a todas as conexões.

Veja também: [Documentos do IORedis sobre Lua Scripting](https://github.com/redis/ioredis#lua-scripting)

```ts
import redis from '@adonisjs/redis/services/main'

redis.defineCommand('release', {
  numberOfKeys: 2,
  lua: `
    redis.call('zrem', KEYS[2], ARGV[1])
    redis.call('zadd', KEYS[1], ARGV[2], ARGV[1])
    return true
  `,
})
```

Depois de definir um comando, você pode executá-lo usando o método `runCommand`. Primeiro, todas as chaves são definidas e, em seguida, os argumentos.

```ts
redis.runCommand(
  'release', // command name
  'jobs:completed', // key 1
  'jobs:running', // key 2
  '11023', // argv 1
  100 // argv 2
)
```

O mesmo comando pode ser executado em uma conexão explícita.

```ts
redis.connection('jobs').runCommand(
  'release', // command name
  'jobs:completed', // key 1
  'jobs:running', // key 2
  '11023', // argv 1
  100 // argv 2
)
```

Finalmente, você também pode definir comandos com uma instância de conexão específica. Por exemplo:

```ts
redis.on('connection', (connection) => {
  if (connection.connectionName === 'jobs') {
    connection.defineCommand('release', {
      numberOfKeys: 2,
      lua: `
        redis.call('zrem', KEYS[2], ARGV[1])
        redis.call('zadd', KEYS[1], ARGV[2], ARGV[1])
        return true
      `,
    })
  }
})
```

## Transformando argumentos e respostas

Você pode definir o transformador de argumentos e o transformador de resposta usando a propriedade `redis.Command`. A API é idêntica à [API IORedis](https://github.com/redis/ioredis#transforming-arguments--replies).

```ts
// title: Argument transformer
import redis from '@adonisjs/redis/services/main'

redis.Command.setArgumentTransformer('hmset', (args) => {
  if (args.length === 2) {
    if (args[1] instanceof Map) {
      // utils is an internal module of ioredis
      return [args[0], ...utils.convertMapToArray(args[1])]
    }
    if (typeof args[1] === 'object' && args[1] !== null) {
      return [args[0], ...utils.convertObjectToArray(args[1])]
    }
  }
  return args
})
```

```ts
// title: Reply transformer
import redis from '@adonisjs/redis/services/main'

redis.Command.setReplyTransformer('hgetall', (result) => {
  if (Array.isArray(result)) {
    const obj = {}
    for (let i = 0; i < result.length; i += 2) {
      obj[result[i]] = result[i + 1]
    }
    return obj
  }
  return result
})
```

## Eventos

A seguir está a lista de eventos emitidos por uma instância de conexão Redis.

### connect / subscriber\:connect
O evento é emitido quando uma conexão é feita. O evento `subscriber:connect` é emitido quando uma conexão de assinante é feita.

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('connect', () => {})
  connection.on('subscriber:connect', () => {})
})
```

### `wait`
Emitido quando a conexão está no modo `wait` porque a opção `lazyConnect` está definida dentro da configuração. Após executar o primeiro comando, a conexão será movida do estado `wait`.

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('wait', () => {})
})
```

### `ready` / `subscriber:ready`
O evento será emitido imediatamente após o evento `connect`, a menos que você tenha habilitado o sinalizador `enableReadyCheck` dentro da configuração. Nesse caso, esperaremos o servidor Redis informar que está pronto para aceitar comandos.

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('ready', () => {})
  connection.on('subscriber:ready', () => {})
})
```

### `error` / `subscriber:error`
O evento é emitido quando não é possível conectar-se ao servidor Redis. Veja [error handling](#error-handling) para saber como o AdonisJS lida com erros de conexão.

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('error', () => {})
  connection.on('subscriber:error', () => {})
})
```

### `close` / `subscriber:close`
O evento é emitido quando uma conexão é fechada. O IORedis pode tentar estabelecer uma conexão novamente após emitir o evento `close`, dependendo da estratégia de nova tentativa.

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('close', () => {})
  connection.on('subscriber:close', () => {})
})
```

### `reconnecting` / `subscriber:reconnecting`
O evento é emitido ao tentar reconectar ao servidor redis após o evento `close`.

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('reconnecting', ({ waitTime }) => {
    console.log(waitTime)
  })
  connection.on('subscriber:reconnecting', ({ waitTime }) => {
    console.log(waitTime)
  })
})
```

### `end` / `subscriber:end`
O evento é emitido quando a conexão é fechada e nenhuma outra reconexões será feita. Deve ser o fim do ciclo de vida da conexão.

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('end', () => {})
  connection.on('subscriber:end', () => {})
})
```

### `node:added`
O evento é emitido quando conectado a um novo nó de cluster (aplicável somente a instâncias de cluster).

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('node:added', () => {})
})
```

### `node:removed`
O evento é emitido quando um nó de cluster é removido (aplicável somente a instâncias de cluster).

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('node:removed', () => {})
})
```

### `node:error`
O evento é emitido quando não é possível conectar a um nó de cluster (aplicável somente a instâncias de cluster).

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('node:error', ({ error, address }) => {
    console.log(error, address)
  })
})
```

### `subscription:ready` / `psubscription:ready`
O evento é emitido quando uma assinatura em um determinado canal ou padrão foi estabelecida.

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('subscription:ready', ({ count }) => {
    console.log(count)
  })
  connection.on('psubscription:ready', ({ count }) => {
    console.log(count)
  })
})
```

### `subscription:error` / `psubscription:error`
O evento é emitido quando não é possível assinar um canal ou padrão.

```ts
import redis from '@adonisjs/redis/services/main'

redis.on('connection', (connection) => {
  connection.on('subscription:error', () => {})
  connection.on('psubscription:error', () => {})
})
```
