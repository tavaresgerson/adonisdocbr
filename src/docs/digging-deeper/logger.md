---
Resumo: Aprenda a usar o logger AdonisJS para gravar logs no console, arquivos e serviços externos. Construído sobre o Pino, o logger é rápido e suporta múltiplos alvos.
---

# Logger

O AdonisJS tem um logger embutido que suporta a gravação de logs em um **arquivo**, **saída padrão** e **serviços de registro externo**. Por baixo dos panos, usamos [pino](https://getpino.io/#/). O Pino é uma das bibliotecas de registro mais rápidas no ecossistema Node.js que gera logs no [formato NDJSON](https://github.com/ndjson/ndjson-spec).

## Uso

Para começar, você pode importar o serviço Logger para gravar logs de qualquer lugar dentro do seu aplicativo. Os logs são gravados em `stdout` e aparecerão no terminal.

```ts
import logger from '@adonisjs/core/services/logger'

logger.info('this is an info message')
logger.error({ err: error }, 'Something went wrong')
```

É recomendável usar a propriedade `ctx.logger` durante solicitações HTTP. O contexto HTTP contém uma instância de um registrador com reconhecimento de solicitação que adiciona o ID da solicitação atual a cada instrução de log.

```ts
import router from '@adonisjs/core/services/router'
import User from '#models/user'

router.get('/users/:id', async ({ logger, params }) => {
  logger.info('Fetching user by id %s', params.id)
  const user = await User.find(params.id)
})
```

## Configuração

A configuração do registrador é armazenada no arquivo `config/logger.ts`. Por padrão, apenas um registrador é configurado. No entanto, você pode definir a configuração para vários registradores se quiser usar mais de um em seu aplicativo.

```ts
// title: config/logger.ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/core/logger'

export default defineConfig({
  default: 'app',
  
  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL', 'info')
    },
  }
})
```

### `default`

A propriedade `default` é uma referência a um dos registradores configurados no mesmo arquivo sob o objeto `loggers`.

O registrador padrão é usado para gravar logs, a menos que você selecione um registrador específico ao usar a API do registrador.

### `loggers`

O objeto `loggers` é um par de chave-valor para configurar vários loggers. A chave é o nome do logger e o valor é o objeto de configuração aceito pelo [pino](https://getpino.io/#/docs/api?id=options)

## Alvos de transporte
Os transportes no pino desempenham um papel essencial, pois gravam logs em um destino. Você pode configurar [vários alvos](https://getpino.io/#/docs/api?id=transport-object) dentro do seu arquivo de configuração, e o pino entregará logs para todos eles. Cada alvo também pode especificar um nível do qual deseja receber os logs.

:::note
Se você não definiu o `level` dentro da configuração do alvo, os alvos configurados o herdarão do logger pai.

Esse comportamento é diferente do pino. No Pino, os alvos não herdam níveis do logger pai.
:::

```ts
{
  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL', 'info'),
      
      // highlight-start
      transport: {
        targets: [
          {
            target: 'pino/file',
            level: 'info',
            options: {
              destination: 1
            }
          },
          {
            target: 'pino-pretty',
            level: 'info',
            options: {}
          },
        ]
      }
      // highlight-end
    }
  }
}
```

### Destino do arquivo

O destino `pino/file` grava logs em um descritor de arquivo. O `destination = 1` significa gravar logs em `stdout` (esta é uma [convenção unix padrão para descritores de arquivo](https://en.wikipedia.org/wiki/File_descriptor)).

### Destino bonito

O destino `pino-pretty` usa o [módulo npm pino-pretty](http://npmjs.com/package/pino-pretty) para imprimir logs em um descritor de arquivo.

## Definindo destinos condicionalmente

É comum registrar destinos com base no ambiente em que o código está sendo executado. Por exemplo, usando o destino `pino-pretty` em desenvolvimento e o destino `pino/file` em produção.

Conforme mostrado abaixo, construir o array `targets` com condicionais faz o arquivo de configuração parecer desorganizado.

```ts
import app from '@adonisjs/core/services/app'

loggers: {
  app: {
    transport: {
      targets: [
        ...(!app.inProduction
          ? [{ target: 'pino-pretty', level: 'info' }]
          : []
        ),
        ...(app.inProduction
          ? [{ target: 'pino/file', level: 'info' }]
          : []
        ),
      ]
    }
  } 
}
```

Portanto, você pode usar o auxiliar `targets` para definir itens de array condicional usando uma API fluente. Expressamos os mesmos condicionais no exemplo a seguir usando o método `targets.pushIf`.

```ts
import { targets, defineConfig } from '@adonisjs/core/logger'

loggers: {
  app: {
    transport: {
      targets: targets()
       .pushIf(
         !app.inProduction,
         { target: 'pino-pretty', level: 'info' }
       )
       .pushIf(
         app.inProduction,
         { target: 'pino/file', level: 'info' }
       )
       .toArray()
    }
  } 
}
```

```ts
import { targets, defineConfig } from '@adonisjs/core/logger'

loggers: {
  app: {
    transport: {
      targets: targets()
       .pushIf(app.inDev, targets.pretty())
       .pushIf(app.inProduction, targets.file())
       .toArray()
    }
  }
}
```

## Usando vários registradores

O AdonisJS tem suporte de primeira classe para configurar vários registradores. O nome exclusivo e a configuração do registrador são definidos no arquivo `config/logger.ts`.

```ts
export default defineConfig({
  default: 'app',
  
  loggers: {
    // highlight-start
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL', 'info')
    },
    payments: {
      enabled: true,
      name: 'payments',
      level: env.get('LOG_LEVEL', 'info')
    },
    // highlight-start
  }
})
```

Uma vez configurado, você pode acessar um logger nomeado usando o método `logger.use`.

```ts
import logger from '@adonisjs/core/services/logger'

logger.use('payments')
logger.use('app')

// Get an instance of the default logger
logger.use()
```

## Injeção de dependência

Ao usar injeção de dependência, você pode dar uma dica de tipo na classe `Logger` como uma dependência, e o contêiner IoC resolverá uma instância do logger padrão definido dentro do arquivo de configuração.

Se a classe for construída durante uma solicitação HTTP, o contêiner injetará a instância do Logger com reconhecimento de solicitação.

```ts
import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'

// highlight-start
@inject()
// highlight-end
class UserService {
  // highlight-start
  constructor(protected logger: Logger) {}
  // highlight-end

  async find(userId: string | number) {
    this.logger.info('Fetching user by id %s', userId)
    const user = await User.find(userId)
  }
}
```

## Métodos de registro

A API do Logger é quase idêntica à do Pino, exceto que o logger AdonisJS não é uma instância de um emissor de eventos (enquanto o Pino é). Além disso, os métodos de registro têm a mesma API que o pino.

```ts
import logger from '@adonisjs/core/services/logger'

logger.trace(config, 'using config')
logger.debug('user details: %o', { username: 'virk' })
logger.info('hello %s', 'world')
logger.warn('Unable to connect to database')
logger.error({ err: Error }, 'Something went wrong')
logger.fatal({ err: Error }, 'Something went wrong')
```

Um objeto de mesclagem adicional pode ser passado como o primeiro argumento. Em seguida, as propriedades do objeto são adicionadas ao JSON de saída.

```ts
logger.info({ user: user }, 'Fetched user by id %s', user.id)
```

Para exibir erros, você pode [usar a chave `err`](https://getpino.io/#/docs/api?id=serializers-object) para especificar o valor do erro.

```ts
logger.error({ err: error }, 'Unable to lookup user')
```

## Registro condicional

O logger produz registros para e acima do nível configurado no arquivo de configuração. Por exemplo, se o nível for definido como `warn`, os logs para os níveis `info`, `debug` e `trace` serão ignorados.

Se a computação de dados para uma mensagem de log for cara, você deve verificar se um determinado nível de log está habilitado antes de computar os dados.

```ts
import logger from '@adonisjs/core/services/logger'

if (logger.isLevelEnabled('debug')) {
  const data = await getLogData()
  logger.debug(data, 'Debug message')
}
```

Você pode expressar a mesma condicional usando o método `ifLevelEnabled`. O método aceita um retorno de chamada como o segundo argumento, que é executado quando o nível de log especificado é habilitado.

```ts
logger.ifLevelEnabled('debug', async () => {
  const data = await getLogData()
  logger.debug(data, 'Debug message')
})
```

## Registrador filho

Um registrador filho é uma instância isolada que herda a configuração e as ligações do registrador pai.

Uma instância do registrador filho pode ser criada usando o método `logger.child`. O método aceita ligações como o primeiro argumento e um objeto de configuração opcional como o segundo argumento.

```ts
import logger from '@adonisjs/core/services/logger'

const requestLogger = logger.child({ requestId: ctx.request.id() })
```

O registrador filho também pode registrar em um nível de registro diferente.

```ts
logger.child({}, { level: 'warn' })
```

## Estáticas do Pino

Os métodos e propriedades [estáticos do Pino](https://getpino.io/#/docs/api?id=statics) são exportados pelo módulo `@adonisjs/core/logger`.

```ts
import { 
  multistream,
  destination,
  transport,
  stdSerializers,
  stdTimeFunctions,
  symbols,
  pinoVersion
} from '@adonisjs/core/logger'
```

## Escrevendo registros em um arquivo

O Pino é fornecido com um destino `pino/file`, que você pode usar para gravar registros em um arquivo. Dentro das opções de destino, você pode especificar o caminho de destino do arquivo de registro.

```ts
app: {
  enabled: true,
  name: env.get('APP_NAME'),
  level: env.get('LOG_LEVEL', 'info')

  transport: {
    targets: targets()
      .push({
         transport: 'pino/file',
         level: 'info',
         options: {
           destination: '/var/log/apps/adonisjs.log'
         }
      })
      .toArray()
  }
}
```

### Rotação de arquivos
O Pino não tem suporte interno para rotação de arquivos e, portanto, você precisa usar uma ferramenta de nível de sistema como [logrotate](https://getpino.io/#/docs/help?id=rotate) ou usar um pacote de terceiros como [pino-roll](https://github.com/feugy/pino-roll).

```sh
npm i pino-roll
```

```ts
app: {
  enabled: true,
  name: env.get('APP_NAME'),
  level: env.get('LOG_LEVEL', 'info')

  transport: {
    targets: targets()
      // highlight-start
      .push({
        target: 'pino-roll',
        level: 'info',
        options: {
          file: '/var/log/apps/adonisjs.log',
          frequency: 'daily',
          mkdir: true
        }
      })
      // highlight-end
     .toArray()
  }
}
```

## Ocultando valores sensíveis

Os logs podem se tornar a fonte de vazamento de dados sensíveis. Portanto, é recomendável observar seus logs e remover/ocultar valores sensíveis da saída.

No Pino, você pode usar a opção `redact` para ocultar/remover pares de chave-valor sensíveis dos logs. Por baixo do capô, o pacote [fast-redact](https://github.com/davidmarkclements/fast-redact) é usado, e você pode consultar sua documentação para visualizar as expressões disponíveis.

```ts
// title: config/logger.ts
app: {
  enabled: true,
  name: env.get('APP_NAME'),
  level: env.get('LOG_LEVEL', 'info')

  // highlight-start
  redact: {
    paths: ['password', '*.password']
  }
  // highlight-end
}
```

```ts
import logger from '@adonisjs/core/services/logger'

const username = request.input('username')
const password = request.input('password')

logger.info({ username, password }, 'user signup')
// output: {"username":"virk","password":"[Redacted]","msg":"user signup"}
```

Por padrão, o valor é substituído pelo espaço reservado `[Redacted]`. Você pode definir um espaço reservado personalizado ou remover o par chave-valor.

```ts
redact: {
  paths: ['password', '*.password'],
  censor: '[PRIVATE]'
}

// Remove property
redact: {
  paths: ['password', '*.password'],
  remove: true
}
```

### Usando o tipo de dados Secret
Uma alternativa à redação é encapsular valores sensíveis dentro da classe Secret. Por exemplo:

[Documentos de uso da classe Secret](../references/helpers.md#secret)

```ts
import { Secret } from '@adonisjs/core/helpers'

const username = request.input('username')
// delete-start
const password = request.input('password')
// delete-end
// insert-start
const password = new Secret(request.input('password'))
// insert-end

logger.info({ username, password }, 'user signup')
// output: {"username":"virk","password":"[redacted]","msg":"user signup"}
```
