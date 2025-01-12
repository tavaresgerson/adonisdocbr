---
resumo: Aprenda a monitorar seu aplicativo em produção e garantir que ele esteja funcionando perfeitamente
---

# Verificações de integridade

As verificações de integridade são realizadas para garantir que seu aplicativo esteja em um estado íntegro durante a execução em produção. Isso pode incluir o monitoramento do **espaço em disco disponível** no servidor, a **memória consumida pelo seu aplicativo** ou **testar a conexão do banco de dados**.

O AdonisJS fornece um punhado de [verificações de integridade](#available-health-checks) integradas e a capacidade de criar e registrar [verificações de integridade personalizadas](#creating-a-custom-health-check).

## Configurando verificações de integridade

Você pode configurar verificações de integridade em seu aplicativo executando o seguinte comando. O comando criará um arquivo `start/health.ts` e configurará verificações de integridade para **uso de memória** e **espaço em disco usado**. Sinta-se à vontade para modificar este arquivo e remover/adicionar verificações de integridade adicionais.

:::note
Certifique-se de ter instalado `@adonisjs/core@6.12.1` antes de usar o comando a seguir.
:::

```sh
node ace configure health_checks
```

```ts
// title: start/health.ts
import { HealthChecks, DiskSpaceCheck, MemoryHeapCheck } from '@adonisjs/core/health'

export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck(),
  new MemoryHeapCheck(),
])
```

## Expondo um endpoint

Uma abordagem comum para executar verificações de integridade é expor um endpoint HTTP que um serviço de monitoramento externo pode executar ping para coletar os resultados da verificação de integridade.

Então, vamos definir uma rota dentro do arquivo `start/routes.ts` e vincular o `HealthChecksController` a ele. O arquivo `health_checks_controller.ts` é criado durante a configuração inicial e fica dentro do diretório `app/controllers`.

```ts
// title: start/routes.ts
import router from '@adonisjs/core/services/router'
const HealthChecksController = () => import('#controllers/health_checks_controller')

router.get('/health', [HealthChecksController])
```

### Relatório de exemplo

O método `healthChecks.run` executará todas as verificações e retornará um [relatório detalhado como um objeto JSON](https://github.com/adonisjs/health/blob/develop/src/types.ts#L36). O relatório tem as seguintes propriedades:

```json
{
  "isHealthy": true,
  "status": "warning",
  "finishedAt": "2024-06-20T07:09:35.275Z",
  "debugInfo": {
    "pid": 16250,
    "ppid": 16051,
    "platform": "darwin",
    "uptime": 16.271809083,
    "version": "v21.7.3"
  },
  "checks": [
    {
      "name": "Disk space check",
      "isCached": false,
      "message": "Disk usage is 76%, which is above the threshold of 75%",
      "status": "warning",
      "finishedAt": "2024-06-20T07:09:35.275Z",
      "meta": {
        "sizeInPercentage": {
          "used": 76,
          "failureThreshold": 80,
          "warningThreshold": 75
        }
      }
    },
    {
      "name": "Memory heap check",
      "isCached": false,
      "message": "Heap usage is under defined thresholds",
      "status": "ok",
      "finishedAt": "2024-06-20T07:09:35.265Z",
      "meta": {
        "memoryInBytes": {
          "used": 41821592,
          "failureThreshold": 314572800,
          "warningThreshold": 262144000
        }
      }
    }
  ]
}
```

### `isHealthy`

Um booleano para saber se todas as verificações foram aprovadas. O valor será definido como `false` se uma ou mais verificações falharem.

### `status`

Relata o status após executar todas as verificações. Será um dos seguintes.

- `ok`: todas as verificações foram aprovadas com sucesso.
- `warning`: uma ou mais verificações relataram um aviso.
- `error`: uma ou mais verificações falharam.

### `finishedAt`

A data e hora em que os testes foram concluídos.

### `checks`

Uma matriz de objetos contendo o relatório detalhado de todas as verificações realizadas.

### `debugInfo`

As informações de depuração podem ser usadas para identificar o processo e a duração em que ele está em execução. Elas incluem as seguintes propriedades.

- `pid`: O ID do processo.
- `ppid`: O ID do processo do processo pai que gerencia seu processo de aplicativo AdonisJS.
- `platform`: A plataforma na qual o aplicativo está em execução.
- `uptime`: A duração (em segundos) em que o aplicativo está em execução.
- `version`: Versão do Node.js.

### Protegendo o endpoint
Você pode proteger o endpoint `/health` do acesso público usando o middleware auth ou criando um middleware personalizado que verifica um segredo de API específico dentro do cabeçalho da solicitação. Por exemplo:

```ts
import router from '@adonisjs/core/services/router'
const HealthChecksController = () => import('#controllers/health_checks_controller')

router
  .get('/health', [HealthChecksController])
  // insert-start
  .use(({ request, response }, next) => {
    if (request.header('x-monitoring-secret') === 'some_secret_value') {
      return next()
    }
    response.unauthorized({ message: 'Unauthorized access' })
  })
  // insert-end
```

## Verificações de integridade disponíveis

A seguir está a lista de verificações de integridade disponíveis que você pode configurar no arquivo `start/health.ts`.

### `DiskSpaceCheck`

O `DiskSpaceCheck` calcula o espaço em disco usado no seu servidor e relata um aviso/erro quando um certo limite é excedido.

```ts
import { HealthChecks, DiskSpaceCheck } from '@adonisjs/core/health'

export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck()
])
```

Por padrão, o limite de aviso é definido como 75% e o limite de falha é definido como 80%. No entanto, você também pode definir limites personalizados.

```ts
export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck()
    // highlight-start
    .warnWhenExceeds(80) // warn when used over 80%
    .failWhenExceeds(90), // fail when used over 90%
  // highlight-end
])
```

### `MemoryHeapCheck`

O `MemoryHeapCheck` monitora o tamanho do heap relatado pelo método [process.memoryUsage()](https://nodejs.org/api/process.html#processmemoryusage) e relata um aviso/erro quando um certo limite é excedido.

```ts
import { HealthChecks, MemoryHeapCheck } from '@adonisjs/core/health'

export const healthChecks = new HealthChecks().register([
  new MemoryHeapCheck()
])
```

Por padrão, o limite de aviso é definido como **250 MB** e o limite de falha é definido como **300 MB**. No entanto, você também pode definir limites personalizados.

```ts
export const healthChecks = new HealthChecks().register([
  new MemoryHeapCheck()
    // highlight-start
    .warnWhenExceeds('300 mb')
    .failWhenExceeds('700 mb'),
  // highlight-end
])
```

### `MemoryRSSCheck`

O `MemoryRSSCheck` monitora o tamanho do conjunto residente relatado pelo método [process.memoryUsage()](https://nodejs.org/api/process.html#processmemoryusage) e relata um aviso/erro quando um certo limite é excedido.

```ts
import { HealthChecks, MemoryRSSCheck } from '@adonisjs/core/health'

export const healthChecks = new HealthChecks().register([
  new MemoryRSSCheck()
])
```

Por padrão, o limite de aviso é definido como **320 MB** e o limite de falha é definido como **350 MB**. No entanto, você também pode definir limites personalizados.

```ts
export const healthChecks = new HealthChecks().register([
  new MemoryRSSCheck()
    // highlight-start
    .warnWhenExceeds('600 mb')
    .failWhenExceeds('800 mb'),
  // highlight-end
])
```

### `DbCheck`
O `DbCheck` é fornecido pelo pacote `@adonisjs/lucid` para monitorar a conexão com um banco de dados SQL. Você pode importá-lo e usá-lo da seguinte maneira.

```ts
// insert-start
import db from '@adonisjs/lucid/services/db'
import { DbCheck } from '@adonisjs/lucid/database'
// insert-end
import { HealthChecks, DiskSpaceCheck, MemoryHeapCheck } from '@adonisjs/core/health'

export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck(),
  new MemoryHeapCheck(),
  // insert-start
  new DbCheck(db.connection()),
  // insert-end
])
```

A seguir está um relatório de exemplo da verificação de integridade do banco de dados.

```json
// title: Report sample
{
  "name": "Database health check (postgres)",
  "isCached": false,
  "message": "Successfully connected to the database server",
  "status": "ok",
  "finishedAt": "2024-06-20T07:18:23.830Z",
  "meta": {
    "connection": {
      "name": "postgres",
      "dialect": "postgres"
    }
  }
}
```

A classe `DbCheck` aceita uma conexão de banco de dados para monitoramento. Registre esta verificação várias vezes para cada conexão se quiser monitorar várias conexões. Por exemplo:

```ts
// title: Monitoring multiple connections
export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck(),
  new MemoryHeapCheck(),
  // insert-start
  new DbCheck(db.connection()),
  new DbCheck(db.connection('mysql')),
  new DbCheck(db.connection('pg')),
  // insert-end
])
```

### `DbConnectionCountCheck`
O `DbConnectionCountCheck` monitora as conexões ativas no servidor de banco de dados e relata um aviso/erro quando um determinado limite é excedido. Esta verificação é suportada apenas para bancos de dados **PostgreSQL** e **MySQL**.

```ts
import db from '@adonisjs/lucid/services/db'
// insert-start
import { DbCheck, DbConnectionCountCheck } from '@adonisjs/lucid/database'
// insert-end
import { HealthChecks, DiskSpaceCheck, MemoryHeapCheck } from '@adonisjs/core/health'

export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck(),
  new MemoryHeapCheck(),
  new DbCheck(db.connection()),
  // insert-start
  new DbConnectionCountCheck(db.connection())
  // insert-end
])
```

A seguir está um relatório de exemplo da verificação de integridade da contagem de conexões do banco de dados.

```json
// title: Report sample
{
  "name": "Connection count health check (postgres)",
  "isCached": false,
  "message": "There are 6 active connections, which is under the defined thresholds",
  "status": "ok",
  "finishedAt": "2024-06-20T07:30:15.840Z",
  "meta": {
    "connection": {
      "name": "postgres",
      "dialect": "postgres"
    },
    "connectionsCount": {
      "active": 6,
      "warningThreshold": 10,
      "failureThreshold": 15
    }
  }
}
```

Por padrão, o limite de aviso é definido como **10 conexões** e o limite de falha é definido como **15 conexões**. No entanto, você também pode definir limites personalizados.

```ts
new DbConnectionCountCheck(db.connection())
  .warnWhenExceeds(4)
  .failWhenExceeds(10)
```

### `RedisCheck`
O `RedisCheck` é fornecido pelo pacote `@adonisjs/redis` para monitorar a conexão com um banco de dados Redis (incluindo Cluster). Você pode importar e usar da seguinte forma.

```ts
// insert-start
import redis from '@adonisjs/redis/services/main'
import { RedisCheck } from '@adonisjs/redis'
// insert-end
import { HealthChecks, DiskSpaceCheck, MemoryHeapCheck } from '@adonisjs/core/health'

export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck(),
  new MemoryHeapCheck(),
  // insert-start
  new RedisCheck(redis.connection()),
  // insert-end
])
```

A seguir está um exemplo de relatório da verificação de integridade do banco de dados.

```json
// title: Report sample
{
  "name": "Redis health check (main)",
  "isCached": false,
  "message": "Successfully connected to the redis server",
  "status": "ok",
  "finishedAt": "2024-06-22T05:37:11.718Z",
  "meta": {
    "connection": {
      "name": "main",
      "status": "ready"
    }
  }
}
```

A classe `RedisCheck` aceita uma conexão redis para monitorar. Registre esta verificação várias vezes para cada conexão se quiser monitorar várias conexões. Por exemplo:

```ts
// title: Monitoring multiple connections
export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck(),
  new MemoryHeapCheck(),
  // insert-start
  new RedisCheck(redis.connection()),
  new RedisCheck(redis.connection('cache')),
  new RedisCheck(redis.connection('locks')),
  // insert-end
])
```

### `RedisMemoryUsageCheck`
O `RedisMemoryUsageCheck` monitora o consumo de memória do servidor redis e relata um aviso/erro quando um determinado limite é excedido.

```ts
import redis from '@adonisjs/redis/services/main'
// insert-start
import { RedisCheck, RedisMemoryUsageCheck } from '@adonisjs/redis'
// insert-end
import { HealthChecks, DiskSpaceCheck, MemoryHeapCheck } from '@adonisjs/core/health'

export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck(),
  new MemoryHeapCheck(),
  new RedisCheck(redis.connection()),
  // insert-start
  new RedisMemoryUsageCheck(redis.connection())
  // insert-end
])
```

A seguir está um exemplo de relatório da verificação de integridade do uso de memória redis.

```json
// title: Report sample
{
  "name": "Redis memory consumption health check (main)",
  "isCached": false,
  "message": "Redis memory usage is 1.06MB, which is under the defined thresholds",
  "status": "ok",
  "finishedAt": "2024-06-22T05:36:32.524Z",
  "meta": {
    "connection": {
      "name": "main",
      "status": "ready"
    },
    "memoryInBytes": {
      "used": 1109616,
      "warningThreshold": 104857600,
      "failureThreshold": 125829120
    }
  }
}
```

Por padrão, o limite de aviso é definido como **100 MB** e o limite de falha é definido como **120 MB**. No entanto, você também pode definir limites personalizados.

```ts
new RedisMemoryUsageCheck(db.connection())
  .warnWhenExceeds('200MB')
  .failWhenExceeds('240MB')
```

## Resultados de cache

As verificações de integridade são executadas sempre que você chama o método `healthChecks.run` (também conhecido como visita o endpoint `/health`). Você pode querer executar ping no endpoint `/health` com frequência, mas evite executar determinadas verificações em cada visita.

Por exemplo, monitorar o espaço em disco a cada minuto não é muito útil, mas rastrear a memória a cada minuto pode ser útil.

Portanto, permitimos que você armazene em cache os resultados de verificações de integridade individuais ao registrá-las. Por exemplo:

```ts
import {
  HealthChecks,
  MemoryRSSCheck,
  DiskSpaceCheck,
  MemoryHeapCheck,
} from '@adonisjs/core/health'

export const healthChecks = new HealthChecks().register([
  // highlight-start
  new DiskSpaceCheck().cacheFor('1 hour'),
  // highlight-end
  new MemoryHeapCheck(), // do not cache
  new MemoryRSSCheck(), // do not cache
])
```

## Criando uma verificação de integridade personalizada

Você pode criar uma verificação de integridade personalizada como uma classe JavaScript que adere à interface [HealthCheckContract](https://github.com/adonisjs/health/blob/develop/src/types.ts#L98). Você pode definir uma verificação de integridade em qualquer lugar dentro do seu projeto ou pacote e importá-la dentro do arquivo `start/health.ts` para registrá-la.

```ts
import { Result, BaseCheck } from '@adonisjs/core/health'
import type { HealthCheckResult } from '@adonisjs/core/types/health'

export class ExampleCheck extends BaseCheck {
  async run(): Promise<HealthCheckResult> {
    /**
     * The following checks are for reference purposes only
     */
    if (checkPassed) {
      return Result.ok('Success message to display')
    }
    if (checkFailed) {
      return Result.failed('Error message', errorIfAny)
    }
    if (hasWarning) {
      return Result.warning('Warning message')
    }
  }
}
```

Conforme mostrado no exemplo acima, você pode usar a classe [Result](https://github.com/adonisjs/health/blob/develop/src/result.ts) para criar resultados de verificação de integridade. Opcionalmente, você pode mesclar metadados para o resultado da seguinte forma.

```ts
Result.ok('Database connection is healthy').mergeMetaData({
  connection: {
    dialect: 'pg',
    activeCount: connections,
  },
})
```

### Registrando verificação de integridade personalizada
Você pode importar sua classe de verificação de integridade personalizada dentro do arquivo `start/health.ts` e registrá-la criando uma nova instância de classe.

```ts
// highlight-start
import { ExampleCheck } from '../app/health_checks/example.js'
// highlight-end

export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck().cacheFor('1 hour'),
  new MemoryHeapCheck(),
  new MemoryRSSCheck(),
  // highlight-start
  new ExampleCheck()
  // highlight-end
])
```
