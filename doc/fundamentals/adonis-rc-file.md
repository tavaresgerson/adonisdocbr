# Arquivo AdonisRc

O arquivo `.adonisrc.json` na raiz do seu projeto configura o espaço de trabalho e algumas das configurações de tempo de execução 
do aplicativo. Ele também permite que você substitua as convenções padrão em torno da estrutura do arquivo.

Por padrão, o arquivo contém apenas os valores necessários para executar seu aplicativo. No entanto, você pode visualizar o conteúdo do 
arquivo junto com os padrões, executando o seguinte comando ace.

```bash
node ace dump:rcfile
```

A seguir está a saída do arquivo, junto com os padrões e você pode substituir qualquer propriedade de acordo com seus requisitos.

```json
// collapse: 16
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
  "providers": [
    "./providers/AppProvider",
    "@adonisjs/core",
    "@adonisjs/session",
    "@adonisjs/view"
  ],
  "aceProviders": [
    "@adonisjs/repl"
  ]
}
```

#### typescript
A propriedade `typescript` informa ao framework e aos comandos ace, que seu aplicativo está usando TypeScript. 
Atualmente, esse valor é sempre definido como true. No entanto, mais tarde permitiremos que os aplicativos também 
sejam escritos em JavaScript.

#### directories
Um objeto de diretórios conhecidos e seus caminhos pré-configurados. Você pode alterar o caminho para atender aos seus requisitos.

Além disso, todos os comandos ace `make` fazem referência ao arquivo `.adonisrc.json` antes de criá-lo.

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

#### exceptionHandlerNamespace
O namespace para a classe que trata as exceções ocorridas durante uma solicitação HTTP.

```json
{
  "exceptionHandlerNamespace": "App/Exceptions/Handler"
}
```
 
#### preloads
Uma série de arquivos a serem carregados no momento da inicialização do aplicativo. Os arquivos são carregados logo 
após a inicialização dos provedores de serviço.

Você pode definir o ambiente no qual carregar o arquivo. As opções válidas são:

+ `web` refere-se ao processo iniciado para o servidor HTTP.
+ `console` refere-se aos comandos ace, exceto o comando `repl`.
+ `repl` refere-se ao processo iniciado usando o comando `node ace repl`.
+ `test` é reservado para o futuro, quando AdonisJS terá o executor de teste embutido.

Além disso, você pode marcar o arquivo como opcional e nós o ignoraremos se o arquivo estiver ausente no disco.

> Você pode criar e registrar um arquivo pré-carregado executando o comando `node ace make:prldfile`.

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

#### namespaces
Um objeto de namespaces para as entidades conhecidas. Recomendamos a leitura do guia do contêiner IoC para entender o conceito de namespaces.

Por exemplo, você pode alterar o namespace do controlador de `App/Controllers/Http` para `App/Controllers` e manter os controladores dentro 
do diretório `./app/Controllers`.

```json
{
  "namespaces": {
    "controllers": "App/Controllers"
  }
}
```

#### aliases
A propriedade `aliases` permite definir os apelidos de importação para determinados diretórios. Depois de definir o alias, 
você poderá importar arquivos da raiz do diretório de aliases.

No exemplo a seguir, o `App` é um apelido para o diretório `./app` e o resto é o caminho do arquivo do diretório fornecido.

```ts
import 'App/Models/User'
```

Os aliases do AdonisJS são apenas para o tempo de execução. Você também terá que registrar o mesmo alias dentro do arquivo `tsconfig.json`
para que o compilador `TypeScript` funcione.

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

#### metaFiles
O array `metaFiles` aceita os arquivos que você deseja que o AdonisJS copie para a pasta `build`, ao criar o `build` de produção.

+ Você pode definir os caminhos de arquivo como um padrão glob e copiaremos todos os arquivos correspondentes para esse padrão.
+ Além disso, você pode instruir o servidor de desenvolvimento a recarregar, se algum dos arquivos dentro do padrão correspondente for alterado.

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

#### commands
Uma variedade de caminhos para comandos de lookup / index ace. Você pode definir um caminho relativo como `./command` ou caminho para um pacote instalado.

```json
{
  "commands": [
    "./commands",
    "@adonisjs/core/build/commands"
  ]
}
```

#### comamndsAliases
Um par de valores-chave de aliases de comando. Isso geralmente serve para ajudá-lo a criar apelidos memoráveis para os comandos que são mais 
difíceis de digitar ou lembrar.

```json
{
  "migrate": "migration:run"
}
```

Você também pode definir vários aliases adicionando várias entradas.

```json
{
  "migrate": "migration:run",
  "up": "migration:run"
}
```

#### providers
Uma variedade de provedores de serviços a serem carregados durante o ciclo de inicialização do aplicativo. Os provedores mencionados dentro 
deste array são carregados em todos os ambientes.

```json
{
  "providers": [
    "./providers/AppProvider",
    "@adonisjs/core"
  ],
}
```
 
#### aceProviders
Uma variedade de provedores para carregar ao executar os comandos ace. Aqui você pode carregar os provedores, que não são necessários ao 
iniciar o servidor HTTP.

```json
{
  "aceProviders": [
    "@adonisjs/repl"
  ]
}
```
