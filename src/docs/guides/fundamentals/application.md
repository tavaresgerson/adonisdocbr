# Aplicação

O módulo de aplicação do AdonisJS é responsável por inicializar o aplicativo em diferentes ambientes conhecidos.

Quando você inicia o servidor HTTP a partir do arquivo `server.ts` ou executa o comando `node ace serve`, o aplicativo é inicializado para o ambiente **web**.

Enquanto a execução do comando `node ace repl` inicializa o aplicativo no ambiente **repl**. Todos os outros comandos inicializam o aplicativo no ambiente **console**.

O ambiente do aplicativo desempenha um papel essencial na decisão de quais ações executar. Por exemplo, o ambiente **web** não registra ou inicializa os provedores Ace.

Você pode acessar o ambiente atual do aplicativo usando a propriedade `environment`. A seguir está a lista de ambientes de aplicativos conhecidos.

- O ambiente `web` se refere ao processo iniciado para o servidor HTTP.
- O ambiente `console` se refere aos comandos Ace, exceto o comando REPL.
- O ambiente `repl` se refere ao processo iniciado usando o comando `node ace repl`.
- O ambiente `test` se refere ao processo iniciado usando o comando `node ace test`.

```ts
import Application from '@ioc:Adonis/Core/Application'
console.log(Application.environment)
```

## Ciclo de vida de inicialização

A seguir está o ciclo de vida de inicialização do aplicativo.

![imagem](/docs/assets/application-boot-lifecycle.webp)

Você pode acessar as ligações do contêiner IoC quando o estado do aplicativo for definido como `booted` ou `ready`. Uma tentativa de acessar as ligações do contêiner antes do estado inicializado resulta em uma exceção.

Por exemplo, se você tiver um provedor de serviços que deseja resolver as ligações do contêiner, você deve escrever as instruções de importação dentro dos métodos `boot` ou `ready`.

::: danger ERRO
A importação de nível superior não funcionará
:::

```ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Route from '@ioc:Adonis/Core/Route'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    Route.get('/', async () => {})
  }
}
```

::: tip SUCESSO
Mova a importação para dentro do método de inicialização
:::

```ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const { default: Route } = await import('@ioc:Adonis/Core/Route')
    Route.get('/', async () => {})
  }
}
```

## Versão

Você pode acessar o aplicativo e a versão do framework usando as propriedades `version` e `adonisVersion`.

A propriedade `version` se refere à versão dentro do arquivo `package.json` do seu aplicativo. A propriedade `adonisVersion` se refere à versão instalada do pacote `@adonisjs/core`.

```ts
import Application from '@ioc:Adonis/Core/Application'

console.log(Application.version!.toString())
console.log(Application.adonisVersion!.toString())
```

Ambas as propriedades de versão são representadas como um objeto com as subpropriedades `major`, `minor` e `patch`.

```ts
console.log(Application.version!.major)
console.log(Application.version!.minor)
console.log(Application.version!.patch)
```

## Ambiente do node
Você pode acessar o ambiente do nó usando a propriedade `nodeEnvironment`. O valor é uma referência à variável de ambiente `NODE_ENV`. No entanto, o valor é ainda mais normalizado para ser consistente.

```ts
import Application from '@ioc:Adonis/Core/Application'

console.log(Application.nodeEnvironment)
```

| NODE_ENV  | Normalizado para | 
|-----------|---------------|
| dev       | development   |
| develop   | development   |
| stage     | staging       |
| prod      | production    |
| testing   | test          |

Além disso, você pode usar as seguintes propriedades como uma forma abreviada de conhecer o ambiente atual.

### `inProduction`
```ts
Application.inProduction

// O mesmo que
Application.nodeEnvironment === 'production'
```

### `inDev`
```ts
Application.inDev

// O mesmo que
Application.nodeEnvironment === 'development'
```

### `inTest`
```ts
Application.inTest

// O mesmo que
Application.nodeEnvironment === 'test'
```

## Crie caminhos para diretórios de projetos

Você pode usar o módulo Application para criar um caminho absoluto para diretórios de projetos conhecidos.

### `configPath`
Crie um caminho absoluto para um arquivo dentro do diretório `config`.

```ts
Application.configPath('shield.ts')
```

### `publicPath`
Crie um caminho absoluto para um arquivo dentro do diretório `public`.

```ts
Application.publicPath('style.css')
```

### `databasePath`
Crie um caminho absoluto para um arquivo dentro do diretório `database`.

```ts
Application.databasePath('seeders/Database.ts')
```

### `migrationsPath`
Crie um caminho absoluto para um arquivo dentro do diretório `migrations`.

```ts
Application.migrationsPath('users.ts')
```

### `seedsPath`
Crie um caminho absoluto para um arquivo dentro do diretório `seeds`.

```ts
Application.seedsPath('Database.ts')
```

### `resourcesPath`
Crie um caminho absoluto para um arquivo dentro do diretório `resources`.

```ts
Application.resourcesPath('scripts/app.js')
```

### `viewsPath`
Crie um caminho absoluto para um arquivo dentro do diretório `views`.

```ts
Application.viewsPath('welcome.edge')
```

### `startPath`
Crie um caminho absoluto para um arquivo dentro do diretório `start`.

```ts
Application.startPath('routes.ts')
```

### `tmpPath`
Crie um caminho absoluto para um arquivo dentro do diretório `tmp` do aplicativo.

```ts
Application.tmpPath('uploads/avatar.png')
```

### `makePath`
Crie um caminho absoluto a partir da raiz do aplicativo.

```ts
Application.makePath('app/Middleware/Auth.ts')
```

## Outras propriedades
A seguir está a lista de propriedades no módulo do aplicativo.

### `appName`
Nome do aplicativo. Refere-se à propriedade `name` dentro do arquivo `package.json` do seu aplicativo.

```ts
Application.appName
```

### `appRoot`
Caminho absoluto para o diretório raiz do aplicativo.

```ts
Application.appRoot
```

### `rcFile`
Referência ao [arquivo AdonisRc](./adonisrc-file.md) analisado.

```ts
Application.rcFile.providers
Application.rcFile.raw
```

### `container`
Referência à instância do contêiner IoC.

```ts
Application.container
```

### `helpers`
Referência ao módulo do helper.

```ts
Application.helpers.string.snakeCase('helloWorld')
```

Você também pode acessar o módulo helpers diretamente.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.snakeCase('helloWorld')
```

### `logger`
Referência ao logger do aplicativo.

```ts
Application.logger.info('hello world')
```

Você também pode acessar o módulo logger diretamente.

```ts
import Logger from '@ioc:Adonis/Core/Logger'

Logger.info('hello world')
```

### `config`
Referência ao módulo config.

```ts
Application.config.get('app.secret')
```

Você também pode acessar o módulo config diretamente.

```ts
import Config from '@ioc:Adonis/Core/Config'

Config.get('app.secret')
```

### `env`
Referência ao módulo env. 

```ts
Application.env.get('APP_KEY')
```

Você também pode acessar o módulo env diretamente.

```ts
import Env from '@ioc:Adonis/Core/Env'

Env.get('APP_KEY')
```

### `isReady`
Descubra se o aplicativo está no estado pronto. Ele é usado internamente para parar de aceitar novas solicitações HTTP quando `isReady` é falso.

```ts
Application.isReady
```

### `isShuttingDown`
Descubra se o aplicativo está no processo de desligamento.

```ts
Application.isShuttingDown
```
