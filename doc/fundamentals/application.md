# Aplicativo

O módulo de aplicativo do AdonisJS é responsável por inicializar o aplicativo em diferentes ambientes conhecidos.

Quando você inicia o servidor HTTP a partir do arquivo `server.ts` ou executando o comando `node ace serve`, o aplicativo é inicializado 
para o ambiente da web.

Enquanto a execução do comando `node ace repl` inicializa o aplicativo no ambiente `repl`. Todos os outros comandos inicializam o aplicativo 
no ambiente do console.

O ambiente do aplicativo desempenha um papel essencial na decisão de quais ações executar. Por exemplo, o ambiente da web não registra 
ou inicializa os provedores `ace`.

Você pode acessar o ambiente atual do aplicativo usando a propriedade `environment`. A seguir está a lista de ambientes de aplicativos conhecidos:


+ `web` refere-se ao processo iniciado para o servidor HTTP.
+ `console` refere-se aos comandos ace, exceto o comando repl.
+ `repl` refere-se ao processo iniciado usando o comando `node ace repl`.
+ `test` é reservado para o futuro, quando AdonisJS terá o executor de teste embutido.

```ts
import Application from '@ioc:Adonis/Core/Application'
console.log(Application.environment)
```

### Ciclo de vida da inicialização
A seguir está o ciclo de vida de inicialização do aplicativo.

> Você pode acessar as ligações do contêiner IoC assim que o estado do aplicativo for definido como `booted` ou `ready`. Tentar acessar 
> as ligações do contêiner antes do estado inicializado resulta em uma exceção.

<p align="center">
  <img src="/assets/application-boot-lifecycle.png" width="300px" />
</p>

### Versão
Você pode acessar o aplicativo e a versão da estrutura usando as propriedades `version` e `adonisVersion`.

A propriedade `version` se refere à versão dentro do arquivo `package.json` do seu aplicativo. Considerando que a propriedade 
`adonisVersion` se refere à versão instalada do pacote `@adonisjs/core`.

```ts
import Application from '@ioc:Adonis/Core/Application'

console.log(Application.version!.toString())
console.log(Application.adonisVersion!.toString())
```

Ambas as propriedades da versão são representadas como um objeto com as subpropriedades `major`, `minor` e `patch`.

```ts
console.log(Application.version!.major)
console.log(Application.version!.minor)
console.log(Application.version!.patch)
```

### Ambiente do Node
Você pode acessar o ambiente do node usando a propriedade `nodeEnvironment`. O valor é uma referência à variável de ambiente `NODE_ENV`. 
No entanto, o valor é posteriormente normalizado para ser consistente.

```ts
import Application from '@ioc:Adonis/Core/Application'

console.log(Application.nodeEnvironment)
```

| NODE_ENV    | Normalizado para        |
|-------------|-------------------------|
| dev         | Desenvolvimento         |
| develop     | Desenvolvimento         |
| stage       |	Staging                 |
| prod        |	Produção                |
| test	      | Teste                   |

Além disso, você pode usar as seguintes propriedades como um atalho para conhecer o ambiente atual:

#### inProduction

```ts
Application.inProduction

// Igual a
Application.nodeEnvironment === 'production'
```

#### inDev
```ts
Application.inDev

// Igual à
Application.nodeEnvironment === 'development'
```

### Crie caminhos para os diretórios do projeto
Você pode usar o módulo `Application` para criar um caminho absoluto para diretórios de projeto conhecidos.

#### configPath
Crie um caminho absoluto para um arquivo dentro do diretório `config`.

```ts
Application.configPath('shield.ts')
```

#### publicPath
Crie um caminho absoluto para um arquivo dentro do diretório `public`.

```ts
Application.publicPath('style.css')
```

#### databasePath
Crie um caminho absoluto para um arquivo dentro do diretório `database/`.

```ts
Application.databasePath('seeders/Database.ts')
```

#### migrationsPath
Crie um caminho absoluto para um arquivo dentro do diretório `migrations`.

```ts
Application.migrationsPath('users.ts')
```

#### seedsPath
Crie um caminho absoluto para um arquivo dentro do diretório `seeds`.

```ts
Application.seedsPath('Database.ts')
```

#### resourcesPath
Crie um caminho absoluto para um arquivo dentro do diretório `resources`.

```ts
Application.resourcesPath('scripts/app.js')
```

#### viewsPath
Crie um caminho absoluto para um arquivo dentro do diretório `views`.

```ts
Application.viewsPath('welcome.edge')
```

#### startPath
Crie um caminho absoluto para um arquivo dentro do diretório `start`.

```ts
Application.startPath('routes.ts')
```

#### tmpPath
Crie um caminho absoluto para um arquivo dentro do diretório `tmp` do aplicativo.

```ts
Application.tmpPath('uploads/avatar.png')
```

#### makePath
Faça um caminho absoluto a partir da raiz do aplicativo.

```ts
Application.makePath('app/Middleware/Auth.ts')
```

### Outras propriedades
A seguir está a lista de propriedades no módulo do aplicativo.

#### appName
Nome do aplicativo. Refere-se à propriedade `name` dentro do arquivo `package.json` de seu aplicativo.

```ts
Application.appName
```

#### appRoot
Caminho absoluto para o diretório raiz do aplicativo.

```ts
Application.appRoot
```

#### rcFile
Referência ao arquivo AdonisRc analisado.

```ts
Application.rcFile.providers
Application.rcFile.raw
```

#### container
Referência à instância do contêiner IoC.

```ts
Application.container
```

#### helpers
Referência ao módulo do auxiliar.

```ts
Application.helpers.string.snakeCase('helloWorld')
```

Você também pode acessar o módulo de auxiliaress diretamente.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.snakeCase('helloWorld')
```

#### logger
Referência ao logger do aplicativo.

```
Application.logger.info('hello world')
```

Você também pode acessar o módulo logger diretamente.

```ts
import Logger from '@ioc:Adonis/Core/Logger'

Logger.info('hello world')
```

#### config
Referência ao módulo de configuração.

```ts
Application.config.get('app.secret')
```

Você também pode acessar o módulo de configuração diretamente.

```ts
import Config from '@ioc:Adonis/Core/Config'

Config.get('app.secret')
```

#### env
Referência ao módulo env.

```
Application.env.get('APP_KEY')
```

Você também pode acessar o módulo env diretamente.

```ts 
import Env from '@ioc:Adonis/Core/Env'

Env.get('APP_KEY')
```

#### isReady
Descubra se o aplicativo está no estado pronto. É usado internamente para parar de aceitar novas solicitações HTTP quando `isReady` for falso.

```ts
Application.isReady
```

#### isShuttingDown
Descubra se o aplicativo está em processo de desligamento.

```ts
Application.isShuttingDown
```
