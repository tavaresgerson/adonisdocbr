---
summary: Aprenda sobre a classe Application e como acessar o ambiente, estado e criar URLs e caminhos para arquivos de projeto.
---

# Aplicativo

A classe [Application](https://github.com/adonisjs/application/blob/main/src/application.ts) faz todo o trabalho pesado de conectar um aplicativo AdonisJS. Você pode usar essa classe para saber sobre o ambiente em que seu aplicativo está sendo executado, obter o estado atual do aplicativo ou criar caminhos para diretórios específicos.

Veja também: [Ciclo de vida do aplicativo](./application_lifecycle.md)

## Environment

O ambiente se refere ao ambiente de tempo de execução do aplicativo. O aplicativo é sempre inicializado em um dos seguintes ambientes conhecidos.

- O ambiente `web` se refere ao processo iniciado para o servidor HTTP.

- O ambiente `console` se refere aos comandos Ace, exceto o comando REPL.

- O ambiente `repl` se refere ao processo iniciado usando o comando `node ace repl`.

- Finalmente, o ambiente `test` se refere ao processo iniciado usando o comando `node ace test`.

Você pode acessar o ambiente do aplicativo usando o método `getEnvironment`.

```ts
import app from '@adonisjs/core/services/app'

console.log(app.getEnvironment())
```

Você também pode alternar o ambiente do aplicativo antes que ele seja inicializado. Um ótimo exemplo disso é o comando REPL.

O comando `node ace repl` inicia o aplicativo no ambiente `console`, mas o comando alterna internamente o ambiente para `repl` antes de apresentar o prompt REPL.

```ts
if (!app.isBooted) {
	app.setEnvironment('repl')
}
```

## Ambiente do Node

Você pode acessar o ambiente Node.js usando a propriedade `nodeEnvironment`. O valor é uma referência à variável de ambiente `NODE_ENV`. No entanto, o valor é normalizado ainda mais para ser consistente.

```ts
import app from '@adonisjs/core/services/app'

console.log(app.nodeEnvironment)
```

| NODE_ENV | Normalizado para |
|----------|------------------|
| dev      | development      |
| develop  | development      |
| stage    | staging          |
| prod     | production       |
| testing  | test             |

Além disso, você pode usar as seguintes propriedades como um atalho para saber o ambiente atual.

- `inProduction`: Verifique se o aplicativo está sendo executado no ambiente de produção.
- `inDev`: Verifique se o aplicativo está sendo executado no ambiente de desenvolvimento.
- `inTest`: Verifique se o aplicativo está sendo executado no ambiente de teste.

```ts
import app from '@adonisjs/core/services/app'

// Está em produção
app.inProduction
app.nodeEnvironment === 'production'

// Está em desenvolvimento
app.inDev
app.nodeEnvironment === 'development'

// Está em teste
app.inTest
app.nodeEnvironment === 'test'
```

## Estado

O estado se refere ao estado atual do aplicativo. Os recursos do framework que você pode acessar dependem significativamente do estado atual do aplicativo. Por exemplo, você não pode acessar as [vinculações de contêiner](./dependency_injection.md#container-bindings) ou [serviços de contêiner](./container_services.md) até que o aplicativo esteja em um estado `booted`.

O aplicativo está sempre em um dos seguintes estados conhecidos.

- `created`: É o estado padrão do aplicativo.

- `initiated`: Neste estado, nós analisamos/validamos as variáveis ​​de ambiente e processamos o arquivo `adonisrc.ts`.

- `booted`: Os provedores de serviços de aplicativo são registrados e inicializados neste estado.

- `ready`: O estado pronto varia entre diferentes ambientes. Por exemplo, no ambiente `web`, o estado pronto significa que o aplicativo está pronto para aceitar novas solicitações HTTP.

- `terminated`: O aplicativo foi encerrado e o processo sairá em breve. O aplicativo não aceitará novas solicitações HTTP no ambiente `web`.

```ts
import app from '@adonisjs/core/services/app'

console.log(app.getState())
```

Você também pode usar as seguintes propriedades abreviadas para saber se o aplicativo está em um determinado estado.

```ts
import app from '@adonisjs/core/services/app'

// O aplicativo foi inicializado
app.isBooted
app.getState() !== 'created' && app.getState() !== 'initiated'

// O aplicativo está pronto
app.isReady
app.getState() === 'ready'

// tentando encerrar o aplicativo graciosamente
app.isTerminating

// O aplicativo foi encerrado
app.isTerminated
app.getState() === 'terminated'
```

## Ouvindo sinais de processo

Você pode ouvir [sinais POSIX](https://man7.org/linux/man-pages/man7/signal.7.html) usando os métodos `app.listen` ou `app.listenOnce`. Por baixo dos panos, registramos o ouvinte com o objeto `process` do Node.js.

```ts
import app from '@adonisjs/core/services/app'

// Ouça um sinal SIGTERM
app.listen('SIGTERM', () => {
})

// Ouça uma vez um sinal SIGTERM
app.listenOnce('SIGTERM', () => {
})
```

Às vezes, você pode querer registrar os ouvintes condicionalmente. Por exemplo, ouça o sinal `SIGINT` ao executar dentro do ambiente pm2.

Você pode usar os métodos `listenIf` ou `listenOnceIf` para registrar um ouvinte condicionalmente. O ouvinte só é registrado quando o valor do primeiro argumento é verdadeiro.

```ts
import app from '@adonisjs/core/services/app'

app.listenIf(app.managedByPm2, 'SIGTERM', () => {
})

app.listenOnceIf(app.managedByPm2, 'SIGTERM', () => {
})
```

## Notificando o processo pai

Se seu aplicativo iniciar como um processo filho, você pode enviar mensagens para o processo pai usando o método `app.notify`. Por baixo dos panos, usamos o método `process.send`.

```ts
import app from '@adonisjs/core/services/app'

app.notify('ready')

app.notify({
  isReady: true,
  port: 3333,
  host: 'localhost'
})
```

## Criando URLs e caminhos para arquivos de projeto

Em vez de autoconstruir URLs ou caminhos absolutos para arquivos de projeto, recomendamos fortemente usar os seguintes auxiliares.

### `makeURL`

O método make URL retorna uma URL de arquivo para um determinado arquivo ou diretório dentro da raiz do projeto. Por exemplo, você pode gerar uma URL ao importar um arquivo.

```ts
import app from '@adonisjs/core/services/app'

const files = [
  './tests/welcome.spec.ts',
  './tests/maths.spec.ts'
]

await Promise.all(files.map((file) => {
  return import(app.makeURL(file).href)
}))
```

### `makePath`

O método `makePath` retorna um caminho absoluto para um determinado arquivo ou diretório dentro da raiz do projeto.

```ts
import app from '@adonisjs/core/services/app'

app.makePath('app/middleware/auth.ts')
```

### `configPath`

Retorna o caminho para um arquivo dentro do diretório de configuração do projeto.

```ts
app.configPath('shield.ts')
// /project_root/config/shield.ts

app.configPath()
// /project_root/config
```

### `publicPath`

Retorna o caminho para um arquivo dentro do diretório público do projeto.

```ts
app.publicPath('style.css')
// /project_root/public/style.css

app.publicPath()
// /project_root/public
```

### `providersPath`

Retorna o caminho para um arquivo dentro do diretório do provedor.

```ts
app.providersPath('app_provider')
// /project_root/providers/app_provider.ts

app.providersPath()
// /project_root/providers
```

### `factoriesPath`

Retorna o caminho para um arquivo dentro do diretório de fábricas do banco de dados.

```ts
app.factoriesPath('user.ts')
// /project_root/database/factories/user.ts

app.factoriesPath()
// /project_root/database/factories
```

### `migrationsPath`
Retorna o caminho para um arquivo dentro do diretório de migrações do banco de dados.

```ts
app.migrationsPath('user.ts')
// /project_root/database/migrations/user.ts

app.migrationsPath()
// /project_root/database/migrations
```

### `seedersPath`
Retorna o caminho para um arquivo dentro do diretório seeders do banco de dados.

```ts
app.seedersPath('user.ts')
// /project_root/database/seeders/users.ts

app.seedersPath()
// /project_root/database/seeders
```

### `languageFilesPath`
Retorna o caminho para um arquivo dentro do diretório languages.

```ts
app.languageFilesPath('en/messages.json')
// /project_root/resources/lang/en/messages.json

app.languageFilesPath()
// /project_root/resources/lang
```

### `viewsPath`
Retorna o caminho para um arquivo dentro do diretório views.

```ts
app.viewsPath('welcome.edge')
// /project_root/resources/views/welcome.edge

app.viewsPath()
// /project_root/resources/views
```

### `startPath`
Retorna o caminho para um arquivo dentro do diretório start.

```ts
app.startPath('routes.ts')
// /project_root/start/routes.ts

app.startPath()
// /project_root/start
```

### `tmpPath`

Retorna o caminho para um arquivo dentro do diretório `tmp` dentro da raiz do projeto.

```ts
app.tmpPath('logs/mail.txt')
// /project_root/tmp/logs/mail.txt

app.tmpPath()
// /project_root/tmp
```

### `httpControllersPath`

Retorna o caminho para um arquivo dentro do diretório de controladores HTTP.

```ts
app.httpControllersPath('users_controller.ts')
// /project_root/app/controllers/users_controller.ts

app.httpControllersPath()
// /project_root/app/controllers
```

### `modelsPath`

Retorna o caminho para um arquivo dentro do diretório do modelo.

```ts
app.modelsPath('user.ts')
// /project_root/app/models/user.ts

app.modelsPath()
// /project_root/app/models
```

### `servicesPath`

Retorna o caminho para um arquivo dentro do diretório de serviços.

```ts
app.servicesPath('user.ts')
// /project_root/app/services/user.ts

app.servicesPath()
// /project_root/app/services
```

### `exceptionsPath`

Retorna o caminho para um arquivo dentro do diretório de exceções.

```ts
app.exceptionsPath('handler.ts')
// /project_root/app/exceptions/handler.ts

app.exceptionsPath()
// /project_root/app/exceptions
```

### `mailsPath`

Retorna o caminho para um arquivo dentro do diretório de e-mails.

```ts
app.mailsPath('verify_email.ts')
// /project_root/app/mails/verify_email.ts

app.mailsPath()
// /project_root/app/mails
```

### `middlewarePath`

Retorna o caminho para um arquivo dentro do diretório middleware.

```ts
app.middlewarePath('auth.ts')
// /project_root/app/middleware/auth.ts

app.middlewarePath()
// /project_root/app/middleware
```

### `policiesPath`

Retorna o caminho para um arquivo dentro do diretório policies.

```ts
app.policiesPath('posts.ts')
// /project_root/app/polices/posts.ts

app.policiesPath()
// /project_root/app/polices
```

### `validatorsPath`

Retorna o caminho para um arquivo dentro do diretório validators.

```ts
app.validatorsPath('create_user.ts')
// /project_root/app/validators/create_user.ts

app.validatorsPath()
// /project_root/app/validators/create_user.ts
```

### `commandsPath`

Retorna o caminho para um arquivo dentro do diretório commands.

```ts
app.commandsPath('greet.ts')
// /project_root/commands/greet.ts

app.commandsPath()
// /project_root/commands
```

### `eventsPath`

Retorna o caminho para um arquivo dentro do diretório events.

```ts
app.eventsPath('user_created.ts')
// /project_root/app/events/user_created.ts

app.eventsPath()
// /project_root/app/events
```

### `listenersPath`

Retorna o caminho para um arquivo dentro do diretório listeners.

```ts
app.listenersPath('send_invoice.ts')
// /project_root/app/listeners/send_invoice.ts

app.listenersPath()
// /project_root/app/listeners
```

## Geradores

Geradores são usados ​​para criar nomes de classe e nomes de arquivo para diferentes entidades. Por exemplo, você pode usar o método `generators.controllerFileName` para gerar o nome de arquivo para um controlador.

```ts
import app from '@adonisjs/core/services/app'

app.generators.controllerFileName('user')
// saída - users_controller.ts

app.generators.controllerName('user')
// saída - UsersController
```

Por favor, [consulte o código-fonte `generators.ts`](https://github.com/adonisjs/application/blob/main/src/generators.ts) para visualizar a lista de geradores disponíveis.
