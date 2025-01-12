---
summary: Proteja seu aplicativo da web ou servidor de API contra abuso implementando limites de taxa usando o pacote @adonisjs/limiter.
---

# Limitação de taxa

O AdonisJS fornece um pacote próprio para implementar limites de taxa em seu aplicativo da web ou servidor de API. O limitador de taxa fornece `redis`, `mysql`, `postgresql` e `memory` como opções de armazenamento, com a capacidade de [criar provedores de armazenamento personalizados](#creating-a-custom-storage-provider).

O pacote `@adonisjs/limiter` é criado sobre o pacote [node-rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible), que fornece uma das APIs de limitação de taxa mais rápidas e usa incrementos atômicos para evitar condições de corrida.

## Instalação

Instale e configure o pacote usando o seguinte comando:

```sh
node ace add @adonisjs/limiter
```

::: details Veja os passos realizados pelo comando add

1. Instala o pacote `@adonisjs/limiter` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.
```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/limiter/limiter_provider')
      ]
    }
    ```

3. Crie o arquivo `config/limiter.ts`.

4. Crie o arquivo `start/limiter.ts`. Este arquivo é usado para definir o middleware HTTP throttle.

5. Defina a seguinte variável de ambiente junto com sua validação dentro do arquivo `start/env.ts`.
```ts
   LIMITER_STORE=redis
   ```

6. Opcionalmente, crie a migração do banco de dados para a tabela `rate_limits` se estiver usando o armazenamento `database`.

:::

## Configuração
A configuração do limitador de taxa é armazenada no arquivo `config/limiter.ts`.

Veja também: [Stub de configuração do limitador de taxa](https://github.com/adonisjs/limiter/blob/main/stubs/config/limiter.stub)

```ts
import env from '#start/env'
import { defineConfig, stores } from '@adonisjs/limiter'

const limiterConfig = defineConfig({
  default: env.get('LIMITER_STORE'),

  stores: {
    redis: stores.redis({}),

    database: stores.database({
      tableName: 'rate_limits'
    }),

    memory: stores.memory({}),
  },
})

export default limiterConfig

declare module '@adonisjs/limiter/types' {
  export interface LimitersList extends InferLimiters<typeof limiterConfig> {}
}
```

### `default`

O armazenamento `default` a ser usado para aplicar limites de taxa. O armazenamento é definido no mesmo arquivo de configuração sob o objeto `stores`.

### `stores`

Uma coleção de armazenamentos que você planeja usar em seu aplicativo. Recomendamos sempre configurar o armazenamento `memory` que pode ser usado durante o teste.

---

### Variáveis ​​de ambiente
O limitador padrão é definido usando a variável de ambiente `LIMITER_STORE` e, portanto, você pode alternar entre diferentes armazenamentos em diferentes ambientes. Por exemplo, use o armazenamento `memory` durante o teste e o armazenamento `redis` para desenvolvimento e produção.

Além disso, a variável de ambiente deve ser validada para permitir um dos armazenamentos pré-configurados. A validação é definida dentro do arquivo `start/env.ts` usando a regra `Env.schema.enum`.

```ts
{
  LIMITER_STORE: Env.schema.enum(['redis', 'database', 'memory'] as const),
}
```

### Opções compartilhadas
A seguir está a lista de opções compartilhadas por todos os armazenamentos agrupados.

### `keyPrefix`

Defina o prefixo para as chaves armazenadas dentro do armazenamento do banco de dados. O armazenamento do banco de dados ignora o `keyPrefix`, pois diferentes tabelas de banco de dados podem ser usadas para isolar dados.

### `execEvenly`

A opção `execEvenly` adiciona um atraso ao limitar as solicitações para que todas as solicitações sejam esgotadas no final da duração fornecida.

Por exemplo, se você permitir que um usuário faça **10 solicitações/min**, todas as solicitações terão um atraso artificial, então a décima solicitação termina no final do 1 minuto. Leia o artigo [smooth out traffic peaks](https://github.com/animir/node-rate-limiter-flexible/wiki/Smooth-out-traffic-peaks) no repositório `rate-limiter-flexible` para saber mais sobre a opção `execEvenly`.

`inMemoryBlockOnConsumed`

Defina o número de solicitações após as quais a chave deve ser bloqueada na memória. Por exemplo, você permite que um usuário faça **10 solicitações/min**, e ele tenha consumido todas as solicitações nos primeiros 10 segundos.

No entanto, ele continua a fazer solicitações ao servidor e, portanto, o limitador de taxa precisa verificar com o banco de dados antes de negar a solicitação.

Para reduzir a carga no banco de dados, você pode definir o número de solicitações, após as quais devemos parar de consultar o banco de dados e bloquear a chave na memória.

```ts
{
  duration: '1 minute',
  requests: 10,

  /**
   * After 12 requests, block the key within the
   * memory and stop consulting the database.
   */
  inMemoryBlockOnConsumed: 12,
}
```

### `inMemoryBlockDuration`

A duração para a qual bloquear a chave na memória. Esta opção reduzirá a carga no banco de dados, pois os armazenamentos de backend verificarão primeiro na memória para ver se uma chave está bloqueada.

```ts
{
  inMemoryBlockDuration: '1 min'
}
```

---

### Armazenamento Redis
O armazenamento `redis` tem uma dependência de peer no pacote `@adonisjs/redis`; portanto, você deve configurar este pacote antes de usar o armazenamento redis.

A seguir está a lista de opções que o armazenamento redis aceita (junto com as opções compartilhadas).

```ts
{
  redis: stores.redis({
    connectionName: 'main',
    rejectIfRedisNotReady: false,
  }),
}
```

### `connectionName`

A propriedade `connectionName` se refere a uma conexão definida no arquivo `config/redis.ts`. Recomendamos usar um banco de dados redis separado para o limitador.

### `rejectIfRedisNotReady`

Rejeite as solicitações de limitação de taxa quando o status da conexão Redis não for `ready.`

---

### Armazenamento de banco de dados
O armazenamento `database` tem uma dependência de peer no pacote `@adonisjs/lucid` e, portanto, você deve configurar este pacote antes de usar o armazenamento de banco de dados.

A seguir está a lista de opções que o armazenamento de banco de dados aceita (junto com as opções compartilhadas).

:::note
Somente bancos de dados MySQL e PostgreSQL podem ser usados ​​com o armazenamento de banco de dados.
:::

```ts
{
  database: stores.database({
    connectionName: 'mysql',
    dbName: 'my_app',
    tableName: 'rate_limits',
    schemaName: 'public',
    clearExpiredByTimeout: false,
  }),
}
```

### `connectionName`

Referência à conexão do banco de dados definida no arquivo `config/database.ts`. Se não for definida, usaremos a conexão de banco de dados padrão.

### `dbName`

O banco de dados a ser usado para fazer consultas SQL. Tentamos inferir o valor de `dbName` da configuração de conexão definida no arquivo `config/database.ts`. No entanto, se estiver usando uma string de conexão, você deve fornecer o nome do banco de dados por meio desta propriedade.

### `tableName`

A tabela do banco de dados a ser usada para armazenar limites de taxa.

### `schemaName`

O esquema a ser usado para fazer consultas SQL (somente PostgreSQL).

### `clearExpiredByTimeout`

Quando habilitado, o armazenamento do banco de dados limpará as chaves expiradas a cada 5 minutos. Observe que apenas as chaves que expiraram por mais de 1 hora serão limpas.


## Throttling HTTP requests
Depois que o limitador for configurado, você pode criar um middleware de limitação HTTP usando o método `limiter.define`. O serviço `limiter` é uma instância singleton da classe [LimiterManager](https://github.com/adonisjs/limiter/blob/main/src/limiter_manager.ts) criada usando a configuração definida no arquivo `config/limiter.ts`.

Se você abrir o arquivo `start/limiter.ts`, encontrará um middleware de limitação global predefinido que pode ser aplicado em uma rota ou em um grupo de rotas. Da mesma forma, você pode criar quantos middlewares de limitação precisar em seu aplicativo.

No exemplo a seguir, o middleware de limitação global permite que os usuários façam **10 solicitações/min** com base em seu endereço IP.

```ts
// title: start/limiter.ts
import limiter from '@adonisjs/limiter/services/main'

export const throttle = limiter.define('global', () => {
  return limiter.allowRequests(10).every('1 minute')
})
```

Você pode aplicar o middleware `throttle` a uma rota da seguinte maneira.

```ts
// title: start/routes.ts
import router from '@adonisjs/core/services/router'
// highlight-start
import { throttle } from '#start/limiter'
// highlight-end

router
  .get('/', () => {})
  // highlight-start
  .use(throttle)
  // highlight-end
```

### Limitação de taxa dinâmica

Vamos criar outro middleware para proteger um endpoint de API. Desta vez, aplicaremos limites de taxa dinâmicos com base no status de autenticação de uma solicitação.

```ts
// title: start/limiter.ts
export const apiThrottle = limiter.define('api', (ctx) => {
  /**
   * Allow logged-in users to make 100 requests by
   * their user ID
   */
  if (ctx.auth.user) {
    return limiter
      .allowRequests(100)
      .every('1 minute')
      .usingKey(`user_${ctx.auth.user.id}`)
  }

  /**
   * Allow guest users to make 10 requests by ip address
   */
  return limiter
    .allowRequests(10)
    .every('1 minute')
    .usingKey(`ip_${ctx.request.ip()}`)
})
```

```ts
// title: start/routes.ts
import { apiThrottle } from '#start/limiter'

router
  .get('/api/repos/:id/stats', [RepoStatusController])
  .use(apiThrottle)
```

### Trocando o armazenamento de backend
Você pode usar um armazenamento de backend específico com middleware de aceleração usando o método `store`. Por exemplo:

```ts
limiter
  .allowRequests(10)
  .every('1 minute')
  // highlight-start
  .store('redis')
  // highlight-end
```

### Usando uma chave personalizada
Por padrão, as solicitações são limitadas por taxa pelo endereço IP do usuário. No entanto, você pode especificar uma chave personalizada usando o método `usingKey`.

```ts
limiter
  .allowRequests(10)
  .every('1 minute')
  // highlight-start
  .usingKey(`user_${ctx.auth.user.id}`)
  // highlight-end
```

### Bloqueando usuário
Você pode bloquear um usuário por uma duração especificada se ele continuar a fazer solicitações mesmo depois de esgotar sua cota usando o método `blockFor`. O método aceita a duração em segundos ou a expressão de tempo.

```ts
limiter
  .allowRequests(10)
  .every('1 minute')
  // highlight-start
  /**
   * Will be blocked for 30mins, if they send more than
   * 10 requests under one minute
   */
  .blockFor('30 mins')
  // highlight-end
```

## Lidando com ThrottleException
O middleware throttle lança a exceção [E_TOO_MANY_REQUESTS](../references/exceptions.md#e_too_many_requests) quando o usuário esgota todas as solicitações dentro do período especificado. A exceção será automaticamente convertida em uma resposta HTTP usando as seguintes regras de negociação de conteúdo.

- As solicitações HTTP com o cabeçalho `Accept=application/json` receberão uma matriz de mensagens de erro. Cada elemento da matriz será um objeto com a propriedade message.

- As solicitações HTTP com o cabeçalho `Accept=application/vnd.api+json` receberão uma matriz de mensagens de erro formatadas de acordo com a especificação JSON API.

[páginas de status](../basics/exception_handling.md#status-pages) para mostrar uma página de erro personalizada para erros de limitador.

Você também pode autogerenciar o erro dentro do [manipulador de exceção global](../basics/exception_handling.md#handling-exceptions).

```ts
import { errors } from '@adonisjs/limiter'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction
  protected renderStatusPages = app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    // highlight-start
    if (error instanceof errors.E_TOO_MANY_REQUESTS) {
      const message = error.getResponseMessage(ctx)
      const headers = error.getDefaultHeaders()

      Object.keys(headers).forEach((header) => {
        ctx.response.header(header, headers[header])
      })

      return ctx.response.status(error.status).send(message)
    }
    // highlight-end

    return super.handle(error, ctx)
  }
}
```

### Personalizando a mensagem de erro
Em vez de manipular a exceção globalmente, você pode personalizar a mensagem de erro, o status e os cabeçalhos de resposta usando o hook ``limitExceeded`.

```ts
import limiter from '@adonisjs/limiter/services/main'

export const throttle = limiter.define('global', () => {
  return limiter
    .allowRequests(10)
    .every('1 minute')
    // highlight-start
    .limitExceeded((error) => {
      error
        .setStatus(400)
        .setMessage('Cannot process request. Try again later')
    })
    // highlight-end
})
```

### Usando traduções para a mensagem de erro
Se você configurou o pacote [@adonisjs/i18n](../digging_deeper/i18n.md), você pode definir a tradução para a mensagem de erro usando a chave `errors.E_TOO_MANY_REQUESTS`. Por exemplo:

```json
// title: resources/lang/fr/errors.json
{
  "E_TOO_MANY_REQUESTS": "Trop de demandes"
}
```

Finalmente, você pode definir uma chave de tradução personalizada usando o método `error.t`.

```ts
limitExceeded((error) => {
  error.t('errors.rate_limited', {
    limit: error.response.limit,
    remaining: error.response.remaining,
  })
})
```

## Uso direto
Além de limitar solicitações HTTP, você também pode usar o limitador para aplicar limites de taxa em outras partes do seu aplicativo. Por exemplo, bloqueie um usuário durante o login se ele fornecer credenciais inválidas várias vezes. Ou limite o número de trabalhos simultâneos que um usuário pode executar.

### Criando limitador

Antes de aplicar a limitação de taxa em uma ação, você deve obter uma instância da classe [Limiter](https://github.com/adonisjs/limiter/blob/main/src/limiter.ts) usando o método `limiter.use`. O método `use` aceita o nome do armazenamento de backend e as seguintes opções de limitação de taxa.

- `requests`: O número de solicitações a serem permitidas para uma determinada duração.
[expressão de tempo](../references/helpers.md#seconds) string.
- `block (opcional)`: A duração para a qual bloquear a chave após todas as solicitações terem sido esgotadas.
[shared options](#shared-options)
[shared options](#shared-options)

```ts
import limiter from '@adonisjs/limiter/services/main'

const reportsLimiter = limiter.use('redis', {
  requests: 1,
  duration: '1 hour'
})
```

Omita o primeiro parâmetro se quiser usar o armazenamento padrão. Por exemplo:

```ts
const reportsLimiter = limiter.use({
  requests: 1,
  duration: '1 hour'
})
```

### Aplicando limite de taxa em uma ação

Depois de criar uma instância do limitador, você pode usar o método `attempt` para aplicar a limitação de taxa em uma ação.
O método aceita os seguintes parâmetros.

- Uma chave exclusiva para usar para limitação de taxa.
- A função de retorno de chamada a ser executada até que todas as tentativas tenham sido esgotadas.

O método `attempt` retorna o resultado da função de retorno de chamada (se for executada). Caso contrário, ele retorna `undefined`.

```ts
const key = 'user_1_reports'

/**
 * Attempt to run an action for the given key.
 * The result will be the callback function return
 * value or undefined if no callback was executed.
 */ 
const executed = reportsLimiter.attempt(key, async () => {
  await generateReport()
  return true
})

/**
 * Notify users that they have exceeded the limit
 */
if (!executed) {
  const availableIn = await reportsLimiter.availableIn(key)
  return `Too many requests. Try after ${availableIn} seconds`
}

return 'Report generated'
```

### Evitando muitas falhas de login
Outro exemplo de uso direto poderia ser proibir um endereço IP de fazer várias tentativas inválidas em um formulário de login.

No exemplo a seguir, usamos o método `limiter.penalize` para consumir uma solicitação sempre que o usuário fornecer credenciais inválidas e bloqueá-las por 20 minutos após todas as tentativas terem sido esgotadas.

O método `limiter.penalize` aceita os seguintes argumentos.

- Uma chave exclusiva para usar para limitação de taxa.
- A função de retorno de chamada a ser executada. Uma solicitação será consumida se a função lançar um erro.

O método `penalize` retorna o resultado da função de retorno de chamada ou uma instância de `ThrottleException`. Você pode usar a exceção para encontrar a duração restante até a próxima tentativa.

```ts
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import limiter from '@adonisjs/limiter/services/main'

export default class SessionController {
  async store({ request, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'passwords'])

    /**
     * Create a limiter
     */
    const loginLimiter = limiter.use({
      requests: 5,
      duration: '1 min',
      blockDuration: '20 mins'
    })

    /**
     * Use IP address + email combination. This ensures if an 
     * attacker is misusing emails; we do not block actual
     * users from logging in and only penalize the attacker
     * IP address.
     */
    const key = `login_${request.ip()}_${email}`

    /**
     * Wrap User.verifyCredentials inside the "penalize" method, so
     * that we consume one request for every invalid credentials
     * error
     */
    const [error, user] = await loginLimiter.penalize(key, () => {
      return User.verifyCredentials(email, password)
    })

    /**
     * On ThrottleException, redirect the user back with a
     * custom error message
     */
    if (error) {
      session.flashAll()
      session.flashErrors({
        E_TOO_MANY_REQUESTS: `Too many login requests. Try again after ${error.response.availableIn} seconds`
      })
      return response.redirect().back()
    }

    /**
     * Otherwise, login the user
     */
  }
}
```

## Consumindo solicitações manualmente
Juntamente com os métodos `attempt` e `penalize`, você pode interagir com o limitador diretamente para verificar as solicitações restantes e consumi-las manualmente.

No exemplo a seguir, usamos o método `remaining` para verificar se uma determinada chave consumiu todas as solicitações. Caso contrário, use o método `increment` para consumir uma solicitação.

```ts
import limiter from '@adonisjs/limiter/services/main'

const requestsLimiter = limiter.use({
  requests: 10,
  duration: '1 minute'
})

// highlight-start
if (await requestsLimiter.remaining('unique_key') > 0) {
  await requestsLimiter.increment('unique_key')
  await performAction()
} else {
  return 'Too many requests'
}
// highlight-end
```

Você pode encontrar uma condição de corrida no exemplo acima entre chamar os métodos `remaining` e `increment`. Portanto, você pode querer usar o método `consume`. O método `consume` incrementará a contagem de solicitações e lançará uma exceção se todas as solicitações tiverem sido consumidas.

```ts
import { errors } from '@adonisjs/limiter'

try {
  await requestsLimiter.consume('unique_key')
  await performAction()
} catch (error) {
  if (error instanceof errors.E_TOO_MANY_REQUESTS) {
    return 'Too many requests'
  }
}
```

## Bloqueando chaves
Além de consumir solicitações, você pode bloquear uma chave por mais tempo se um usuário continuar a fazer solicitações após esgotar todas as tentativas.

O bloqueio é realizado pelos métodos `consume`, `attempt` e `penalize` automaticamente quando você cria uma instância de limitador com a opção `blockDuration`. Por exemplo:

```ts
import limiter from '@adonisjs/limiter/services/main'

const requestsLimiter = limiter.use({
  requests: 10,
  duration: '1 minute',
  // highlight-start
  blockDuration: '30 mins'
  // highlight-end
})

/**
 * A user can make 10 requests in a minute. However, if
 * they send the 11th request, we will block the key
 * for 30 mins.
 */ 
await requestLimiter.consume('a_unique_key')

/**
 * Same behavior as consume
 */
await requestLimiter.attempt('a_unique_key', () => {
})

/**
 * Allow 10 failures and then block the key for 30 mins.
 */
await requestLimiter.penalize('a_unique_key', () => {
})
```

Finalmente, você pode usar o método `block` para bloquear uma chave por uma duração determinada.

```ts
const requestsLimiter = limiter.use({
  requests: 10,
  duration: '1 minute',
})

await requestsLimiter.block('a_unique_key', '30 mins')
```

## Redefinindo tentativas
Você pode usar um dos seguintes métodos para diminuir o número de solicitações ou excluir a chave inteira do armazenamento.

O método `decrement` reduz a contagem de solicitações em 1, e o método `delete` exclui a chave. Observe que o método `decrement` não é atômico e pode definir a contagem de solicitações como `-1` quando a simultaneidade for muito alta.

```ts
// title: Decrement requests count
import limiter from '@adonisjs/limiter/services/main'

const jobsLimiter = limiter.use({
  requests: 2,
  duration: '5 mins',
})

await jobsLimiter.attempt('unique_key', async () => {
  await processJob()

  /**
   * Decrement the consumed requests after we are done
   * processing the job. This will allow other workers
   * to use the slot.
   */
  // highlight-start
  await jobsLimiter.decrement('unique_key')
  // highlight-end
})
```

```ts
// title: Delete key
import limiter from '@adonisjs/limiter/services/main'

const requestsLimiter = limiter.use({
  requests: 2,
  duration: '5 mins',
})

await requestsLimiter.delete('unique_key')
```

## Testes
Se você usar um único armazenamento (ou seja, padrão) para limitação de taxa, talvez queira alternar para o armazenamento `memory` durante o teste definindo a variável de ambiente `LIMITER_STORE` dentro do arquivo `.env.test`.

```dotenv
// title: .env.test
LIMITER_STORE=memory
```

Você pode limpar o armazenamento de limitação de taxa entre os testes usando o método `limiter.clear`. O método `clear` aceita uma matriz de nomes de armazenamento e limpa o banco de dados.

Ao usar o Redis, é recomendável usar um banco de dados separado para o limitador de taxa. Caso contrário, o método `clear` limpará todo o banco de dados, e isso pode afetar outras partes dos aplicativos.

```ts
import limiter from '@adonisjs/limiter/services/main'

test.group('Reports', (group) => {
  // highlight-start
  group.each.setup(() => {
    return () => limiter.clear(['redis', 'memory'])
  })
  // highlight-end
})
```

Alternativamente, você pode chamar o método `clear` sem nenhum argumento, e todos os armazenamentos configurados serão limpos.

```ts
test.group('Reports', (group) => {
  group.each.setup(() => {
    // highlight-start
    return () => limiter.clear()
    // highlight-end
  })
})
```

## Criando um provedor de armazenamento personalizado
Um provedor de armazenamento personalizado deve implementar a interface [LimiterStoreContract](https://github.com/adonisjs/limiter/blob/main/src/types.ts#L163) e definir as seguintes propriedades/métodos.

Você pode escrever a implementação dentro de qualquer arquivo/pasta. Um provedor de serviços não é necessário para criar um armazenamento personalizado.

```ts
import string from '@adonisjs/core/helpers/string'
import { LimiterResponse } from '@adonisjs/limiter'
import {
  LimiterStoreContract,
  LimiterConsumptionOptions
} from '@adonisjs/limiter/types'

/**
 * A custom set of options you want to accept.
 */
export type MongoDbLimiterConfig = {
  client: MongoDBConnection
}

export class MongoDbLimiterStore implements LimiterStoreContract {
  readonly name = 'mongodb'
  declare readonly requests: number
  declare readonly duration: number
  declare readonly blockDuration: number

  constructor(public config: MongoDbLimiterConfig & LimiterConsumptionOptions) {
    this.request = this.config.requests
    this.duration = string.seconds.parse(this.config.duration)
    this.blockDuration = string.seconds.parse(this.config.blockDuration)
  }

  /**
   * Consume one request for the given key. This method
   * should throw an error when all requests have been
   * already consumed.
   */
  async consume(key: string | number): Promise<LimiterResponse> {
  }

  /**
   * Consume one request for the given key, but do not throw an
   * error when all requests have been consumed.
   */
  async increment(key: string | number): Promise<LimiterResponse> {}

  /**
   * Reward one request to the given key. If possible, do not set
   * the requests count to a negative value.
   */
  async decrement(key: string | number): Promise<LimiterResponse> {}

  /**
   * Block a key for the specified duration.
   */ 
  async block(
    key: string | number,
    duration: string | number
  ): Promise<LimiterResponse> {}
  
  /**
   * Set the number of consumed requests for a given key. The duration
   * should be inferred from the config if no explicit duration
   * is provided.
   */ 
  async set(
    key: string | number,
    requests: number,
    duration?: string | number
  ): Promise<LimiterResponse> {}

  /**
   * Delete the key from the storage
   */
  async delete(key: string | number): Promise<boolean> {}

  /**
   * Flush all keys from the database
   */
  async clear(): Promise<void> {}

  /**
   * Get a limiter response for a given key. Return `null` if the
   * key does not exist.
   */
  async get(key: string | number): Promise<LimiterResponse | null> {}
}
```

### Definindo o auxiliar de configuração

Depois de escrever a implementação, você deve criar um auxiliar de configuração para usar o provedor dentro do arquivo `config/limiter.ts`. O auxiliar de configuração deve retornar uma função `LimiterManagerStoreFactory`.

Você pode escrever a seguinte função dentro do mesmo arquivo que a implementação `MongoDbLimiterStore`.

```ts
import { LimiterManagerStoreFactory } from '@adonisjs/limiter/types'

/**
 * Config helper to use the mongoDb store
 * inside the config file
 */
export function mongoDbStore(config: MongoDbLimiterConfig) {
  const storeFactory: LimiterManagerStoreFactory = (runtimeOptions) => {
    return new MongoDbLimiterStore({
      ...config,
      ...runtimeOptions
    })
  }
}
```

### Usando o auxiliar de configuração

Uma vez feito, você pode usar o auxiliar `mongoDbStore` da seguinte forma.

```ts
// title: config/limiter.ts
import env from '#start/env'
// highlight-start
import { mongoDbStore } from 'my-custom-package'
// highlight-end
import { defineConfig } from '@adonisjs/limiter'

const limiterConfig = defineConfig({
  default: env.get('LIMITER_STORE'),

  stores: {
    // highlight-start
    mongodb: mongoDbStore({
      client: mongoDb // create mongoDb client
    })
    // highlight-end
  },
})
```

### Encapsulando drivers rate-limiter-flexible
Se você estiver planejando encapsular um driver existente do pacote [node-rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible?tab=readme-ov-file#docs-and-examples), então você pode usar o [RateLimiterBridge](https://github.com/adonisjs/limiter/blob/main/src/stores/bridge.ts) para a implementação.

Vamos reimplementar o mesmo `MongoDbLimiterStore` usando a ponte desta vez.

```ts
import { RateLimiterBridge } from '@adonisjs/limiter'
import { RateLimiterMongo } from 'rate-limiter-flexible'

export class MongoDbLimiterStore extends RateLimiterBridge {
  readonly name = 'mongodb'

  constructor(public config: MongoDbLimiterConfig & LimiterConsumptionOptions) {
    super(
      new RateLimiterMongo({
        storeClient: config.client,
        points: config.requests,
        duration: string.seconds.parse(config.duration),
        blockDuration: string.seconds.parse(this.config.blockDuration)
        // ... provide other options as well
      })
    )
  }

  /**
   * Self-implement the clear method. Ideally, use the
   * config.client to issue a delete query
   */
  async clear() {}
}
```
