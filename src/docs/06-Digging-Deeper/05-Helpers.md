# Helpers

O *Helpers Provider* do AdonisJs permite uma série de métodos convenientes para turbinar seu aplicativo.

Muitos desses métodos podem ser usados ​​para recuperar *caminhos absolutos* para diretórios específicos dentro do seu aplicativo.

## Exemplo básico
De qualquer lugar dentro do seu aplicativo, basta puxar o *Helpers Provider* e usá-lo para recuperar caminhos para seus diferentes diretórios:

```js
const Helpers = use('Helpers')
const welcomeView = Helpers.viewsPath('welcome.edge')
```

## Path Helpers
Abaixo está a lista de helpers relacionados a caminhos disponíveis através do *Helpers Provider*.

#### `appRoot`
Retorna o caminho para a raiz do aplicativo:

```js
Helpers.appRoot()
```

#### `publicPath([toFile])`
Retorna o caminho para o diretório ou arquivo público dentro do diretório:

```js
const publicPath = Helpers.publicPath()
// or
const cssFile = Helpers.publicPath('style.css')
```

#### `configPath([toFile])`
Retorna o caminho para o diretório ou arquivo de configuração dentro do diretório:

```js
const configPath = Helpers.configPath()
// or
const appConfig = Helpers.configPath('app.js')
```

::: tip DICA
Use o [Config Provider](/docs/03-getting-started/02-Configuration.md) para ler os valores do arquivo de configuração.
:::

#### `resourcesPath([toFile])`
Retorna o caminho para o diretório de recursos ou arquivo dentro do diretório:

```js
const resourcesPath = Helpers.resourcesPath()
// or
const appSass = Helpers.resourcesPath('assets/sass/app.scss')
```

#### `migrationsPath([toFile])`
Retorna o caminho para o diretório de migrações ou arquivo dentro do diretório:

```js
const migrationsPath = Helpers.migrationsPath()
// or
const UserSchema = Helpers.migrationsPath('UserSchema.js')
```

#### `seedsPath([toFile])`
Retorna o caminho para o diretório de sementes ou arquivo dentro do diretório:

```js
const seedsPath = Helpers.seedsPath()
// or
const DatabaseSeed = Helpers.seedsPath('Database.js')
```

#### `databasePath([toFile])`
Retorna o caminho para o diretório de banco de dados ou arquivo dentro do diretório:

```js
const databasePath = Helpers.databasePath()
// or
const factoryFile = Helpers.databasePath('factory.js')
```

#### `viewsPath([toFile])`
Retorna o caminho para o diretório de visualizações ou arquivo dentro do diretório diretório:

```js
const viewsPath = Helpers.viewsPath()
// or
const welcomeView = Helpers.viewsPath('welcome.edge')
```

#### `tmpPath([toFile])`
Retorna o caminho para o diretório tmp ou arquivo dentro do diretório:

```js
const tmpPath = Helpers.tmpPath()
// or
const resized = Helpers.tmpPath('resized.jpg')
```

## Outros Helpers
Abaixo está a lista de outros helpers disponíveis através do *Helpers Provider*.

#### `promisify`
Retorna funções de retorno de chamada [promisified](https://www.npmjs.com/package/pify):

```js
const exists = Helpers.promisify(require('fs').exists)
const isExist = await exists(Helpers.tmpPath('image.jpg'))
// or
const fs = Helpers.promisify(require('fs'))
await fs.unlink(Helpers.tmpPath('image.jpg'))
```

#### `isAceCommand`
Retorna se o processo foi iniciado como o comando ace ou não:

```js
Helpers.isAceCommand()
```
