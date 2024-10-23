# Auxiliares

O Helper Provider fornece alguns métodos convenientes para obter *caminhos absolutos* de certos diretórios do seu aplicativo. É útil para os terceiros *Provedores de serviço* desde que confiar em caminhos relativos não é muito útil.

## Exemplo básico
Em qualquer lugar dentro do seu aplicativo, você pode usar o provedor de auxiliares para obter os caminhos para diferentes diretórios.

```js
const Helpers = use('Helpers')
const storagePath = Helpers.storagePath()
```

## Métodos Auxiliares
Abaixo está a lista de métodos disponíveis no provedor Auxiliares.

#### basepath
Retorna o caminho para a raiz da aplicação.

```js
Helpers.basePath()
```

#### appPath
Retorna o caminho para o diretório do aplicativo.

```js
Helpers.appPath()
```

#### publicPath([toFile])
Retorna o caminho para o diretório público ou o caminho para um arquivo dentro do diretório.

```js
const publicPath = Helpers.publicPath()
// or
const cssFile = Helpers.publicPath('style.css')
```

#### configPath([para o arquivo])
Retorna o caminho para o diretório de configuração ou o caminho para um arquivo dentro do diretório.

NOTE: É recomendado utilizar o [Config Provider](/getting/started/configuration) para ler os valores dos arquivos de configuração.

```js
const configPath = Helpers.configPath()
// or
const appConfig = Helpers.configPath('app.js')
```

#### storagePath([toFile])
Retorna o caminho para o diretório de armazenamento ou o caminho para um arquivo dentro do diretório.

```js
const storagePath = Helpers.storagePath()
// or
const logs = Helpers.storagePath('logs.json')
```

#### resourcesPath([toFile])
Retorna o caminho para o diretório de recursos ou o caminho para um arquivo dentro do diretório.

```js
const resourcesPath = Helpers.resourcesPath()
// or
const appSass = Helpers.resourcesPath('assets/sass/app.scss')
```

#### migrationsPath([paraArquivo])
Retorna o caminho para o diretório de migrações ou o caminho para um arquivo dentro do diretório.

```js
const migrationsPath = Helpers.migrationsPath()
// or
const UserSchema = Helpers.migrationsPath('UserSchema.js')
```

#### seedsPath([paraArquivo])
Retorna o caminho para o diretório de sementes ou o caminho para um arquivo dentro do diretório.

```js
const seedsPath = Helpers.seedsPath()
// or
const DatabaseSeed = Helpers.seedsPath('Database.js')
```

#### databasePath([toFile])
Retorna o caminho para o diretório do banco de dados ou o caminho para um arquivo dentro do diretório.

```js
const databasePath = Helpers.databasePath()
// or
const factoryFile = Helpers.databasePath('factory.js')
```

#### viewsPath([paraArquivo])
Retorna o caminho para o diretório de views ou o caminho para um arquivo dentro do diretório.

```js
const viewsPath = Helpers.viewsPath()
// or
const welcomeView = Helpers.viewsPath('welcome.njk')
```

#### appNameSpace
Retorna o namespace mapeado para o diretório 'app' dentro do arquivo 'package.json'.

```js
const namespace = Helpers.appNameSpace()
const UsersController = use(`${namespace}/Http/Controllers/UsersController`)
```

#### makeNamespace(diretório, paraArquivo)
Retorna o namespace completo para um arquivo dentro de um diretório dado.

```js
const httpListener = Helpers.makeNameSpace('Listeners', 'Http')

// returns App/Listeners/Http.js
```

#### isAceCommand
Retorna se o processo foi iniciado como o comando ace ou não.

```js
Helpers.isAceCommand()
```
