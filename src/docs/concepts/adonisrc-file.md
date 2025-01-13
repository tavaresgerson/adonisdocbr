---
summary: 'O arquivo `adonisrc.ts` é usado para configurar as configurações do espaço de trabalho do seu aplicativo.'
---

# Arquivo AdonisRC

O arquivo `adonisrc.ts` é usado para configurar as configurações do espaço de trabalho do seu aplicativo. Neste arquivo, você pode [registrar provedores](#providers), definir [aliases de comando](#commandsaliases), especificar os [arquivos a serem copiados](#metafiles) para a compilação de produção e muito mais.

::: warning ATENÇÃO
O arquivo `adonisrc.ts` é importado por ferramentas diferentes do seu aplicativo AdonisJS. Portanto, você não deve escrever nenhum código específico do aplicativo ou condicionais específicos do ambiente neste arquivo.
:::

O arquivo contém a configuração mínima necessária para executar seu aplicativo. No entanto, você pode visualizar o conteúdo completo do arquivo executando o comando `node ace inspect:rcfile`.

```sh
node ace inspect:rcfile
```

Você pode acessar o conteúdo RCFile analisado usando o serviço `app`.

```ts
import app from '@adonisjs/core/services/app'

console.log(app.rcFile)
```

## `typescript`

A propriedade `typescript` informa ao framework e aos comandos Ace que seu aplicativo usa TypeScript. Atualmente, esse valor é sempre definido como `true`. No entanto, mais tarde permitiremos que os aplicativos sejam escritos em JavaScript.

## `directories`

Um conjunto de diretórios e seus caminhos usados ​​pelos comandos de scaffolding. Se você decidir renomear diretórios específicos, atualize seu novo caminho dentro do objeto `directories` para notificar os comandos de scaffolding.

```ts
{
  directories: {
    config: 'config',
    commands: 'commands',
    contracts: 'contracts',
    public: 'public',
    providers: 'providers',
    languageFiles: 'resources/lang',
    migrations: 'database/migrations',
    seeders: 'database/seeders',
    factories: 'database/factories',
    views: 'resources/views',
    start: 'start',
    tmp: 'tmp',
    tests: 'tests',
    httpControllers: 'app/controllers',
    models: 'app/models',
    services: 'app/services',
    exceptions: 'app/exceptions',
    mails: 'app/mails',
    middleware: 'app/middleware',
    policies: 'app/policies',
    validators: 'app/validators',
    events: 'app/events',
    listeners: 'app/listeners',
    stubs: 'stubs',
  }
}
```

## `preloads`
Uma matriz de arquivos para importar no momento da inicialização do aplicativo. Os arquivos são importados imediatamente após a inicialização dos provedores de serviço.

Você pode definir o ambiente no qual importar o arquivo. As opções válidas são:

- O ambiente `web` se refere ao processo iniciado para o servidor HTTP.
- O ambiente `console` se refere aos comandos Ace, exceto o comando `repl`.
- O ambiente `repl` se refere ao processo iniciado usando o comando `node ace repl`.
- Finalmente, o ambiente `test` se refere ao processo iniciado para executar os testes.

::: info NOTA
Você pode criar e registrar um arquivo de pré-carregamento usando o comando `node ace make:preload`.
:::

```ts
{
  preloads: [
    () => import('./start/view.js')
  ]
}
```

```ts
{
  preloads: [
    {
      file: () => import('./start/view.js'),
      environment: [
        'web',
        'console',
        'test'
      ]
    },
  ]
}
```

## `metaFiles`

A matriz `metaFiles` é uma coleção de arquivos que você deseja copiar para a pasta `build` ao criar a compilação de produção.

Esses são arquivos não TypeScript/JavaScript que devem existir na compilação de produção para que seu aplicativo funcione. Por exemplo, os modelos Edge, arquivos de idioma i18n, etc.

* [padrão glob](https://github.com/sindresorhus/globby#globbing-patterns) para encontrar arquivos correspondentes.
- `reloadServer`: Recarrega o servidor de desenvolvimento quando os arquivos correspondentes mudam.

```ts
{
  metaFiles: [
    {
      pattern: 'public/**',
      reloadServer: false
    },
    {
      pattern: 'resources/views/**/*.edge',
      reloadServer: false
    }
  ]
}
```

## `commands`
Uma matriz de funções para importar comandos ace de pacotes instalados. Os comandos dos seus aplicativos serão importados automaticamente e, portanto, você não precisa registrá-los explicitamente.

Veja também: [Criando comandos ace](../ace/creating_commands.md)

```ts
{
  commands: [
    () => import('@adonisjs/core/commands'),
    () => import('@adonisjs/lucid/commands')
  ]
}
```

## `commandsAliases`
Um par de aliases de comando de chave-valor. Isso geralmente ajuda a criar aliases memoráveis ​​para os comandos que são mais difíceis de digitar ou lembrar.

Veja também: [Criando aliases de comando](../ace/introduction.md#creating-command-aliases)

```ts
{
  commandsAliases: {
    migrate: 'migration:run'
  }
}
```

Você também pode definir vários aliases para o mesmo comando.

```ts
{
  commandsAliases: {
    migrate: 'migration:run',
    up: 'migration:run'
  }
}
```

## `tests`

O objeto `tests` registra os conjuntos de testes e algumas das configurações globais para o executor de testes.

Veja também: [Introdução aos testes](../testing/introduction.md)

```ts
{
  tests: {
    timeout: 2000,
    forceExit: false,
    suites: [
      {
        name: 'functional',
        files: [
          'tests/functional/**/*.spec.ts'
        ],
        timeout: 30000
      }
    ]
  }
}
```

- `timeout`: define o tempo limite padrão para todos os testes.
- `forceExit`: sai à força do processo do aplicativo assim que os testes forem concluídos. Normalmente, é uma boa prática executar uma saída elegante.
- `suite.name`: um nome exclusivo para o conjunto de testes.
- `suite.files`: Uma matriz de padrões glob para importar os arquivos de teste.
- `suite.timeout`: O tempo limite padrão para todos os testes dentro da suíte.

## `providers`
Uma matriz de provedores de serviço para carregar durante a fase de inicialização do aplicativo.

Por padrão, os provedores são carregados em todos os ambientes. No entanto, você também pode definir uma matriz explícita de ambientes para importar o provedor.

- O ambiente `web` se refere ao processo iniciado para o servidor HTTP.
- O ambiente `console` se refere aos comandos Ace, exceto o comando `repl`.
- O ambiente `repl` se refere ao processo iniciado usando o comando `node ace repl`.
- Finalmente, o ambiente `test` se refere ao processo iniciado para executar os testes.

::: info NOTA
Os provedores são carregados na mesma ordem em que são registrados dentro da matriz `providers`.
:::

[Provedores de serviço](./service_providers.md)

```ts
{
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/http_provider'),
    () => import('@adonisjs/core/providers/hash_provider'),
    () => import('./providers/app_provider.js'),
  ]
}
```

```ts
{
  providers: [
    {
      file: () => import('./providers/app_provider.js'),
      environment: [
        'web',
        'console',
        'test'
      ]
    },
    {
      file: () => import('@adonisjs/core/providers/http_provider'),
      environment: [
        'web'
      ]
    },
    () => import('@adonisjs/core/providers/hash_provider'),
    () => import('@adonisjs/core/providers/app_provider')
  ]
}
```

## `assetsBundler`

Os comandos `serve` e `build` tentam detectar os ativos usados ​​pelo seu aplicativo para compilar os ativos do frontend.

A detecção é realizada para [vite](https://vitejs.dev) pesquisando o arquivo `vite.config.js` e [Webpack encore](https://github.com/symfony/webpack-encore) pesquisando o arquivo `webpack.config.js`.

No entanto, se você usar um empacotador de ativos diferente, poderá configurá-lo dentro do arquivo `adonisrc.ts` da seguinte forma.

```ts
{
  assetsBundler: {
    name: 'vite',
    devServer: {
      command: 'vite',
      args: []
    },
    build: {
      command: 'vite',
      args: ["build"]
    },
  }
}
```

- `name` - O nome do empacotador de ativos que você usa. É necessário para fins de exibição.
- `devServer.*` - O comando e seus argumentos para iniciar o servidor de desenvolvimento.
- `build.*` - O comando e seus argumentos para criar a compilação de produção.
