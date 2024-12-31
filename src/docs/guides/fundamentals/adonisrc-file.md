# Arquivo AdonisRC

O arquivo `.adonisrc.json` é armazenado dentro da raiz do seu projeto. Ele configura o espaço de trabalho e algumas das configurações de tempo de execução do seu aplicativo AdonisJS.

O arquivo contém apenas a configuração mínima necessária para executar seu aplicativo. No entanto, você pode visualizar o conteúdo completo do arquivo executando o seguinte comando Ace.

```sh
node ace dump:rcfile
```

```json
// Saída:

{
  "typescript": true,
  "directories": {
    "config": "config",
    "public": "public",
    "contracts": "contracts",
    "providers": "providers",
    "database": "database",
    "migrations": "database/migrations",
    "seeds": "database/seeders",
    "resources": "resources",
    "views": "resources/views",
    "start": "start",
    "tmp": "tmp",
    "tests": "tests"
  },
  "exceptionHandlerNamespace": "App/Exceptions/Handler",
  "preloads": [
    {
      "file": "./start/routes",
      "optional": false,
      "environment": [
        "web",
        "console",
        "test"
      ]
    },
    {
      "file": "./start/kernel",
      "optional": false,
      "environment": [
        "web",
        "console",
        "test"
      ]
    },
    {
      "file": "./start/views",
      "optional": false,
      "environment": [
        "web",
        "console",
        "test"
      ]
    },
    {
      "file": "./start/events",
      "optional": false,
      "environment": [
        "web"
      ]
    }
  ],
  "namespaces": {
    "models": "App/Models",
    "middleware": "App/Middleware",
    "exceptions": "App/Exceptions",
    "validators": "App/Validators",
    "httpControllers": "App/Controllers/Http",
    "eventListeners": "App/Listeners",
    "redisListeners": "App/Listeners"
  },
  "aliases": {
    "App": "app",
    "Config": "config",
    "Database": "database",
    "Contracts": "contracts"
  },
  "metaFiles": [
    {
      "pattern": "public/**",
      "reloadServer": false
    },
    {
      "pattern": "resources/views/**/*.edge",
      "reloadServer": false
    }
  ],
  "commands": [
    "./commands",
    "@adonisjs/core/build/commands",
    "@adonisjs/repl/build/commands"
  ],
  "commandsAliases": {
  },
  "tests": {
    "suites": [
      {
        "name": "functional",
        "files": [
          "tests/functional/**/*.spec.ts"
        ],
        "timeout": 30000
      }
    ]
  },
  "providers": [
    "./providers/AppProvider",
    "@adonisjs/core",
    "@adonisjs/session",
    "@adonisjs/view"
  ],
  "aceProviders": [
    "@adonisjs/repl"
  ],
  "testProviders": [
    "@japa/preset-adonis/TestsProvider"
  ]
}
```

### `typescript`
A propriedade `typescript` informa ao framework e aos comandos Ace que seu aplicativo está usando TypeScript. Atualmente, esse valor é sempre definido como `true`. No entanto, mais tarde permitiremos que os aplicativos também sejam escritos em JavaScript.

### `directories`
Um objeto de diretórios conhecidos e seus caminhos pré-configurados. Você pode alterar o caminho para corresponder aos seus requisitos.

Além disso, todos os comandos Ace `make` fazem referência ao arquivo `.adonisrc.json` antes de criar o arquivo.

```json
{
  "directories": {
    "config": "config",
    "public": "public",
    "contracts": "contracts",
    "providers": "providers",
    "database": "database",
    "migrations": "database/migrations",
    "seeds": "database/seeders",
    "resources": "resources",
    "views": "resources/views",
    "start": "start",
    "tmp": "tmp",
    "tests": "tests"
  }
}
```

### `exceptionHandlerNamespace`
O namespace para a classe que manipula exceções ocorridas durante uma solicitação HTTP.

```json
{
  "exceptionHandlerNamespace": "App/Exceptions/Handler"
}
```

### `preloads`
Uma matriz de arquivos para carregar no momento da inicialização do aplicativo. Os arquivos são carregados logo após a inicialização dos provedores de serviço.

Você pode definir o ambiente no qual carregar o arquivo. As opções válidas são:

- O ambiente `web` se refere ao processo iniciado para o servidor HTTP.
- O ambiente `console` se refere aos comandos Ace, exceto o comando `repl`.
- O ambiente `repl` se refere ao processo iniciado usando o comando `node ace repl`.
- Finalmente, o ambiente `test` é reservado para o futuro, quando o AdonisJS terá o executor de teste integrado.

Além disso, você pode marcar o arquivo como opcional, e o ignoraremos se o arquivo estiver faltando no disco.

::: info NOTA
Você pode criar e registrar um arquivo pré-carregado executando o comando `node ace make:prldfile`.
:::

```json
{
  "preloads": [
    {
      "file": "./start/routes",
      "optional": false,
      "environment": [
        "web",
        "console",
        "test"
      ]
    },
  ]
}
```

### `namespaces`
Um objeto de namespaces para as entidades conhecidas.

Por exemplo, você pode alterar o namespace do controlador de `App/Controllers/Http` para `App/Controllers` e manter os controladores dentro do diretório `./app/Controllers`.

```json
{
  "namespaces": {
    "httpControllers": "App/Controllers"
  }
}
```

### `aliases`
A propriedade `aliases` permite que você defina os aliases de importação para diretórios específicos. Após definir o alias, você poderá importar arquivos da raiz do diretório aliases.

No exemplo a seguir, o `App` é um alias para o diretório `./app`, e o restante é o caminho do arquivo do diretório fornecido.

```ts
import 'App/Models/User'
```

Os aliases do AdonisJS são apenas para tempo de execução. Você também terá que registrar o mesmo alias dentro do arquivo `tsconfig.json` para que o compilador TypeScript funcione.

```json
{
  "compilerOptions": {
    "paths": {
      "App/*": [
        "./app/*"
      ],
    }
  }
}
```

### `metaFiles`
O array `metaFiles` aceita os arquivos que você deseja que o AdonisJS copie para a pasta `build` ao criar a compilação de produção.

- Você pode definir os caminhos dos arquivos como um padrão glob, e copiaremos todos os arquivos correspondentes para esse padrão.
- Você também pode instruir o servidor de desenvolvimento a recarregar quaisquer arquivos dentro das alterações do padrão correspondente.

```json
{
  "metaFiles": [
    {
      "pattern": "public/**",
      "reloadServer": false
    },
    {
      "pattern": "resources/views/**/*.edge",
      "reloadServer": false
    }
  ]
}
```

### `commands`
Um array de caminhos para procurar/indexar comandos Ace. Você pode definir um caminho relativo como `./command` ou caminho para um pacote instalado.

```json
{
  "commands": [
    "./commands",
    "@adonisjs/core/build/commands"
  ]
}
```

### `commandsAliases`
Um par de chave-valor de aliases de comando. Isso geralmente ajuda a criar aliases memoráveis ​​para os comandos que são mais difíceis de digitar ou lembrar.

```json
{
  "commandsAliases": {
    "migrate": "migration:run"
  }
}
```

Você também pode definir vários aliases adicionando várias entradas.

```json
{
  "commandsAliases": {
    "migrate": "migration:run",
    "up": "migration:run"
  }
}
```

### `tests`
O objeto `test` contém a coleção de suítes de teste usadas pelo seu aplicativo. Você pode adicionar/remover suítes de acordo com os requisitos do seu aplicativo.

```json
{
 "tests": {
    "suites": [
      {
        "name": "functional",
        "files": [
          "tests/functional/**/*.spec.ts"
        ],
        "timeout": 30000
      }
    ]
  }
}
```

### `providers`
Uma matriz de provedores de serviço para carregar durante o ciclo de inicialização do aplicativo. Os provedores mencionados dentro desta matriz são carregados em todos os ambientes.

```json
{
  "providers": [
    "./providers/AppProvider",
    "@adonisjs/core"
  ],
}
```

### `aceProviders`
Uma matriz de provedores que requer os comandos ace.

```json
{
  "aceProviders": [
    "@adonisjs/repl"
  ]
}
```

### `testProviders`
Uma matriz de provedores carregada somente durante o teste.

```json
{
  "testProviders": [
    "@japa/preset-adonis/TestsProvider"
  ]
}
```
