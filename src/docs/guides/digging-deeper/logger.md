# Logger

O núcleo do framework vem com um logger embutido construído em cima do [Pino](https://getpino.io/#/)(uma das bibliotecas de logging mais rápidas para Node.js). Você pode importar e usar o Logger da seguinte forma:

```ts
import Logger from '@ioc:Adonis/Core/Logger'

Logger.info('A info message')
Logger.warn('A warning')
```

Durante uma requisição HTTP, você deve usar o objeto `ctx.logger`. É uma instância filha isolada do logger que adiciona o request-id exclusivo a todas as mensagens de log.

::: info NOTA
Certifique-se de habilitar a geração de id de requisição definindo `generateRequestId = true` dentro do arquivo `config/app.ts`.
:::

```ts
Route.get('/', async ({ logger }) => {
  logger.info('An info message')
  return 'handled'
})
```

![](/docs/assets/http-logger.webp)

## Config
A configuração do logger é armazenada dentro do arquivo `config/app.ts` na exportação `logger`. As opções são as mesmas [conforme documentado por Pino](https://getpino.io/#/docs/api?id=options).

Seguindo as opções mínimas necessárias para configurar o logger:

```ts
{
  name: Env.get('APP_NAME'),
  enabled: true,
  level: Env.get('LOG_LEVEL', 'info'),
  redact: {
    paths: ['password', '*.password'],
  },
  prettyPrint: Env.get('NODE_ENV') === 'development',
}
```

#### `name`
O nome do logger. A variável de ambiente `APP_NAME` usa a propriedade `name` dentro do arquivo package.json.

#### `enabled`
Alterne para habilitar/desabilitar o logger

#### `level`
O nível de registro atual. Ele é derivado da variável de ambiente `LOG_LEVEL`.

#### `redact`
Remova/redija caminhos sensíveis da saída de registro. Leia a [seção Redact](#redact-values).

#### `prettyPrint`
Se deve ou não imprimir os logs de forma bonita. Recomendamos desativar a impressão bonita na produção, pois isso tem alguma sobrecarga de desempenho.

## Como o AdonisJS Logger funciona?
Como o Node.js é um loop de eventos de thread única, é muito importante manter o thread principal livre de qualquer trabalho extra necessário para processar ou reformatar logs.

Por esse motivo, optamos pelo [Pino](https://getpino.io/), que não executa nenhuma formatação de log em processo e, em vez disso, incentiva você a usar um processo separado para isso. Em poucas palavras, é assim que o registro funciona.

1. Você pode registrar em diferentes níveis usando a API do Logger, por exemplo: `Logger.info('some message')`.
2. Os registros são sempre enviados para `stdout`.
3. Você pode redirecionar o fluxo `stdout` para um arquivo ou usar um processo separado para lê-los e formatá-los.

## Registro em desenvolvimento
Como os registros são sempre gravados em `stdout`, não há nada especial necessário no ambiente de desenvolvimento. Além disso, o AdonisJS irá automaticamente [pretty print](https://github.com/pinojs/pino-pretty) os registros quando `NODE_ENV=development`.

## Registro em produção
Na produção, você desejaria transmitir seus registros para um serviço externo como Datadog ou Papertrail. A seguir estão algumas das maneiras de enviar registros para um serviço externo.

::: info NOTA
Há uma sobrecarga operacional adicional de canalizar o fluxo stdout para um serviço. Mas, a troca vale o aumento de desempenho que você recebe. Certifique-se de verificar [benchmarks Pino](https://getpino.io/#/docs/benchmarks) também.
:::

### Usando transportes Pino
A maneira mais simples de processar o fluxo `stdout` é usar [transportes Pino](https://getpino.io/#/docs/transports?id=known-transports). Tudo o que você precisa fazer é canalizar a saída para o transporte de sua escolha.

Para demonstração, vamos instalar o pacote `pino-datadog para enviar logs para o Datadog.

```sh
npm i pino-datadog
```

Em seguida, inicie o servidor de produção e canalize a saída `stdout` para `pino-datadog`.

```sh
node build/server.js | ./node_modules/.bin/pino-datadog --key DD_API_KEY
```

### Transmitindo para um arquivo
Outra abordagem é encaminhar a saída de `stdout` para um arquivo físico no disco e então configurar seu serviço de registro para ler e rotacionar os arquivos de registro.

```sh
node build/server.js >> app.log
```

Agora, configure seu serviço de registro para ler registros do arquivo `app.log`.

## Redigir valores
Você pode redigir/remover valores sensíveis da saída de registro definindo um caminho para as chaves a serem removidas. Por exemplo: Removendo a senha do usuário da saída de registro.

```ts
// config/app.ts

{
  redact: {
    paths: ['password'],
  }
}
```

A configuração acima removerá a senha do objeto de mesclagem.

```ts
Logger.info({ username: 'virk', password: 'secret' }, 'user signup')
// saída: {"username":"virk","password":"[Redacted]","msg":"user signup"}
```

Você pode definir um espaço reservado personalizado para os valores redigidos ou removê-los completamente da saída.

```ts
{
  redact: {
    paths: ['password'],
    censor: '[PRIVATE]'    
  }
}

// ou remover a propriedade
{
  redact: {
    paths: ['password'],
    remove: true
  }
}
```

Confira o pacote [fast-redact](https://github.com/davidmarkclements/fast-redact) para visualizar as expressões disponíveis para a matriz de caminhos.

## API do Logger
A seguir está a lista de métodos/propriedades disponíveis no módulo Logger. Todos os métodos de registro aceitam os seguintes argumentos.

- O primeiro argumento pode ser uma mensagem de string ou um objeto de propriedades para mesclar com a mensagem de log final.
- Se o primeiro argumento foi um objeto de mesclagem, o segundo argumento é a mensagem de string.
- O restante dos parâmetros são os valores de interpolação para os marcadores de posição de mensagem.

```ts
import Logger from '@ioc:Adonis/Core/Logger'

Logger.info('hello %s', 'world')
// saída: {"msg": "hello world"}

Logger.info('user details: %o', { username: 'virk' })
// saída: {"msg":"user details: {\"username\":\"virk\"}"
```

Defina um objeto de mesclagem da seguinte forma:

```ts
import Logger from '@ioc:Adonis/Core/Logger'

Logger.info({ username: 'virk' }, 'user signup')
// saída: {"username":"virk","msg":"user signup"}
```

Você pode passar objetos de erro sob a chave `err`.

```ts
import Logger from '@ioc:Adonis/Core/Logger'

Logger.error({ err: new Error('signup failed') }, 'user signup')
// saída: {"err":{"type":"Error","message":"foo","stack":"..."},"msg":"user signup"}
```

A seguir está a lista de métodos de registro.

- `Logger.trace`
- `Logger.debug`
- `Logger.info`
- `Logger.warn`
- `Logger.error`
- `Logger.fatal`

### `isLevelEnabled`
Descubra se um determinado nível de registro está habilitado dentro do arquivo de configuração.

```ts
Logger.isLevelEnabled('info')
Logger.isLevelEnabled('trace')
```

### `bindings`
Retorna um objeto contendo todos os vínculos atuais, clonados dos passados ​​via `Logger.child()`.

```ts
Logger.bindings()
```

### `child`
Cria uma instância de registrador filho. Você também pode criar o registrador filho com um nível de registro diferente.

```ts
const childLogger = Logger.child({ level: 'trace' })
childLogger.info('an info message')
```

Você também pode definir vínculos personalizados para um registrador filho. Os vínculos são adicionados à saída de registro.

```ts
const childLogger = Logger.child({ userId: user.id })
childLogger.info('an info message')
```

### `level`
O valor do nível de registro atual, como uma string.

```ts
console.log(Logger.level)
// info
```

### `levelNumber`
O valor atual do nível de registro, como um número.

```ts
console.log(Logger.levelNumber)
// 30
```

### `levels`
Um objeto de `labels` e `values` de registro.

```ts
console.log(Logger.levels)

/**
  {
    labels: {
      '10': 'trace',
      '20': 'debug',
      '30': 'info',
      '40': 'warn',
      '50': 'error',
      '60': 'fatal'
    },
    values: {
      trace: 10,
      debug: 20,
      info: 30,
      warn: 40,
      error: 50,
      fatal: 60
    }
  }
 */
```

### `pinoVersion`
A versão do Pino.

```ts
console.log(Logger.pinoVersion)

// '6.11.2'
```
