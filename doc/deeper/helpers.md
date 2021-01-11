# Auxilares

O provider AdonisJs Helpers permite uma série de métodos convenientes para turbinar seu aplicativo.

Muitos desses métodos podem ser usados para recuperar caminhos absolutos para diretórios específicos em seu aplicativo.

### Exemplo Básico
De qualquer lugar dentro de seu aplicativo, basta acessar o provider e usá-lo para recuperar caminhos para seus diferentes diretórios:

```js
const Helpers = use('Helpers')
const welcomeView = Helpers.viewsPath('welcome.edge')
```

### Auxiliar de caminho
Abaixo está a lista de helpers relacionados ao caminho disponíveis por meio do Helpers Provider .

#### appRoot
Retorna o caminho para a raiz do aplicativo:
```js
Helpers.appRoot()
```

#### publicPath ([toFile])
Retorna o caminho para o diretório público ou arquivo dentro do diretório:

```js
const publicPath = Helpers.publicPath()
// ou
const cssFile = Helpers.publicPath('style.css')
```

#### configPath ([toFile])
Retorna o caminho para o diretório de configuração ou arquivo dentro do diretório:

```js
const configPath = Helpers.configPath()
// ou
const appConfig = Helpers.configPath('app.js')
```

> Use o [provedor de configuração](/doc/started/configuration-and-env.md) para ler os valores do arquivo de configuração.

#### resourcesPath ([toFile])
Retorna o caminho para o diretório de recursos ou arquivo dentro do diretório:
```js
const resourcesPath = Helpers.resourcesPath()
// ou
const appSass = Helpers.resourcesPath('assets/sass/app.scss')
```

#### migrationsPath ([toFile])
Retorna o caminho para o diretório de migrações ou arquivo dentro do diretório:
```js
const migrationsPath = Helpers.migrationsPath()
// ou
const UserSchema = Helpers.migrationsPath('UserSchema.js')
```

#### seedPath ([toFile])
Retorna o caminho para o diretório de sementes ou arquivo dentro do diretório:
```js
const seedsPath = Helpers.seedsPath()
// ou
const DatabaseSeed = Helpers.seedsPath('Database.js')
```

#### databasePath ([toFile])
Retorna o caminho para o diretório do banco de dados ou arquivo dentro do diretório:
```js
const databasePath = Helpers.databasePath()
// ou
const factoryFile = Helpers.databasePath('factory.js')
```

#### viewsPath ([toFile])
Retorna o caminho para o diretório de visualizações ou arquivo dentro do diretório:
```js
const viewsPath = Helpers.viewsPath()
// ou
const welcomeView = Helpers.viewsPath('welcome.edge')
```

#### tmpPath ([toFile])
Retorna o caminho para o diretório tmp ou arquivo dentro do diretório:
```js
const tmpPath = Helpers.tmpPath()
// ou
const resized = Helpers.tmpPath('resized.jpg')
```

#### Outros ajudantes
Abaixo está a lista de outros helpers disponíveis por meio do Helpers Provider .

##### promisify
Retorna callback de funções com [promisses](https://www.npmjs.com/package/pify):
```js
const exists = Helpers.promisify(require('fs').exists)
const isExist = await exists(Helpers.tmpPath('image.jpg'))
// ou
const fs = Helpers.promisify(require('fs'))
await fs.unlink(Helpers.tmpPath('image.jpg'))
```

##### isAceCommand
Retorna se o processo foi iniciado como o comando ace ou não:
```js
Helpers.isAceCommand()
```
