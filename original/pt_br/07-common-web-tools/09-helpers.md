# Helpers

O Helpers Provider fornece um punhado de métodos convenientes para obter *caminhos absolutos* para determinados diretórios do seu aplicativo. É útil para *provedores de serviços* de terceiros, pois depender de caminhos relativos não é muito útil.

## Exemplo básico
Em qualquer lugar dentro do seu aplicativo, você pode usar o provedor do Helper para obter caminhos para diferentes diretórios.

```js
const Helpers = use('Helpers')
const storagePath = Helpers.storagePath()
```

## Métodos do Helper
Abaixo está a lista de métodos disponíveis no provedor do Helpers.

#### basePath
Retorna o caminho para a raiz do aplicativo.

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

#### configPath([toFile])
Retorna o caminho para o diretório de configuração ou caminho para um arquivo dentro do diretório.

> OBSERVAÇÃO: É recomendável usar o [Config Provider](/markdown/03-getting-started/03-configuration.md) para ler os valores dos arquivos de configuração.

```js
const configPath = Helpers.configPath()
// or
const appConfig = Helpers.configPath('app.js')
```

#### storagePath([toFile])
Retorna o caminho para o diretório de armazenamento ou caminho para um arquivo dentro do diretório.

```js
const storagePath = Helpers.storagePath()
// or
const logs = Helpers.storagePath('logs.json')
```

#### resourcesPath([toFile])
Retorna o caminho para o diretório de recursos ou caminho para um arquivo dentro do diretório.

```js
const resourcesPath = Helpers.resourcesPath()
// or
const appSass = Helpers.resourcesPath('assets/sass/app.scss')
```

#### migrationsPath([toFile])
Retorna o caminho para o diretório migrations ou caminho para um arquivo dentro do diretório.

```js
const migrationsPath = Helpers.migrationsPath()
// or
const UserSchema = Helpers.migrationsPath('UserSchema.js')
```

#### seedsPath([toFile])
Retorna o caminho para o diretório seeds ou caminho para um arquivo dentro do diretório.

```js
const seedsPath = Helpers.seedsPath()
// or
const DatabaseSeed = Helpers.seedsPath('Database.js')
```

#### databasePath([toFile])
Retorna o caminho para o diretório database ou caminho para um arquivo dentro do diretório.

```js
const databasePath = Helpers.databasePath()
// or
const factoryFile = Helpers.databasePath('factory.js')
```

#### viewsPath([toFile])
Retorna o caminho para o diretório views ou caminho para um arquivo dentro do diretório.

```js
const viewsPath = Helpers.viewsPath()
// or
const welcomeView = Helpers.viewsPath('welcome.njk')
```

#### appNameSpace
Retorna o namespace mapeado para o diretório `app` dentro do arquivo `package.json`.

```js
const namespace = Helpers.appNameSpace()
const UsersController = use(`${namespace}/Http/Controllers/UsersController`)
```

#### makeNameSpace(directory, toFile)
Retorna o namespace completo para um arquivo dentro de um diretório fornecido.

```js
const httpListener = Helpers.makeNameSpace('Listeners', 'Http')

// returns App/Listeners/Http.js
```

#### isAceCommand
Retorna se o processo foi iniciado como o comando ace ou não.

```js
Helpers.isAceCommand()
```
