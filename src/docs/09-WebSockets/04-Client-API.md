# API do cliente

Este guia aborda o JavaScript *cliente WebSocket* usado para conectar ao [servidor WebSocket](/docs/09-WebSockets/03-Server-API.md).

## Instalação

### NPM
Como o *cliente WebSocket* não é instalado por padrão, precisamos obtê-lo do `npm`:

```bash
npm i @adonisjs/websocket-client
```

::: tip DICA
Depois de instalado, agrupe o pacote usando Webpack, Rollup, etc.
:::

Então, importe o cliente WebSocket assim:

```js
import Ws from '@adonisjs/websocket-client'
const ws = Ws('ws://localhost:3333')
```

### UNPKG

Alternativamente, obtenha o pacote UMD diretamente do [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/@adonisjs/websocket-client"></script>
<script>
  const ws = adonis.Ws('ws://localhost:3333')
</script>
```

## Polyfill
A compilação do módulo requer o polyfill [regenerator-runtime](https://babeljs.io/docs/plugins/transform-regenerator) (adicione-o via [Babel](https://babeljs.io)).

## Builds de produção
Como o build de desenvolvimento contém uma série de instruções de log, recomendamos definir `NODE_ENV` via [Webpack DefinePlugin](https://webpack.js.org/plugins/define-plugin/) ou [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace).

## Introdução
Conecte-se a um servidor WebSocket via cliente assim:

```js
const ws = Ws(url, options)

// connect to the server
ws.connect()
```

::: warning OBSERVAÇÃO
O parâmetro `url` retornará ao nome do host atual se um valor de url `ws://` completo for omitido.
:::

#### `options`

| Key                     | Default Value | Description |
|-------------------------|---------------|-------------|
| `path`                  | `adonis-ws`   | O caminho usado para fazer a conexão (altere somente se você alterou no servidor).   |
| `reconnection`          | `true`        | Se deve reconectar automaticamente após a desconexão.   |
| `reconnectionAttempts`  | `10`          | Número de tentativas de reconexão antes de abandonar.   |
| `reconnectionDelay`     | `1000`        | Quanto tempo esperar antes de reconectar. O valor será usado como `n x delay`, onde `n` é o valor atual de tentativas de reconexão.   |
| `query`                 | `null`        | String de consulta a ser passada para a URL de conexão (também aceita um objeto).   |
| `encoder`               | `JsonEncoder` | O codificador a ser usado (o mesmo codificador será necessário no servidor).   |

Para gerenciar o estado do seu aplicativo, ouça os eventos `open`/`close`:

```js
let isConnected = false

ws.on('open', () => {
  isConnected = true
})

ws.on('close', () => {
  isConnected = false
})
```

Depois de conectado, assine tópicos diferentes/múltiplos:

```js
const chat = ws.subscribe('chat')

chat.on('ready', () => {
  chat.emit('message', 'hello')
})

chat.on('error', (error) => {
  console.log(error)
})

chat.on('close', () => {
})
```

## API de assinatura
Os métodos a seguir são usados ​​para enviar/receber mensagens.

#### `emit(event, data)`
Enviar evento para o servidor:

```js
chat.emit('message', {
  body: 'hello',
  user: 'virk'
})
```

#### `on(event, callback)`
Vincular ouvinte de evento:

```js
chat.on('message', () => {})
chat.on('new:user', () => {})
```

#### `off(event, callback)`
Remover ouvinte de evento:

```js
const messageHandler = function () {}

chat.on('message', messageHandler)
chat.off('message', messageHandler)
```

#### `close()`
Iniciar solicitação para fechar a assinatura:

```js
chat.on('close', () => {
  // server acknowledged close
})

chat.close()
```

::: warning OBSERVAÇÃO
Ouça o [evento close](#close-2) para confirmar o fechamento da assinatura.
:::

#### `leaveError`
Emitido quando o servidor se recusa a fechar a assinatura:

```js
chat.on('leaveError', (response) => {
  console.log(response)
})
```

#### `error`
Emitido quando ocorre um erro na conexão TCP:

```js
chat.on('error', (event) => {
})
```

::: warning OBSERVAÇÃO
De preferência, ouça o evento `ws.on('error')`.
:::

#### `close`
Emitido quando a assinatura é fechada:

```js
chat.on('close', () => {
})
```

## API Ws
Os métodos a seguir estão disponíveis em uma única conexão `ws`.

#### `connect`
Iniciar a conexão:

```js
ws.connect()
```

#### `close`
Fechar a conexão à força:

```js
ws.close()
```

::: warning OBSERVAÇÃO
Remove todas as assinaturas e não aciona uma reconexão.
:::

#### `getSubscription(topic)`
Retorna a instância de assinatura para um tópico fornecido:

```js
ws.subscribe('chat')

ws.getSubscription('chat').on('message', () => {
})
```

::: warning OBSERVAÇÃO
Se não houver assinaturas para o tópico fornecido, retorna `null`.
:::

#### `subscribe(topic)`
Assinar um tópico:

```js
const chat = ws.subscribe('chat')
```

::: warning OBSERVAÇÃO
Assinar o mesmo tópico duas vezes gera uma exceção.
:::

## Autenticação
O cliente AdonisJs WebSocket simplifica a autenticação de usuários.

As credenciais de autenticação são passadas apenas uma vez para o servidor durante a conexão inicial, portanto, as mesmas informações podem ser reutilizadas para permitir/não permitir assinaturas de canal.

::: warning OBSERVAÇÃO
Se seu aplicativo usar sessões, os usuários serão autenticados automaticamente, desde que tenham uma sessão válida.
:::

#### `withBasicAuth(username, password)`
Autenticar via autenticação básica:

```js
const ws = Ws(url, options)

ws
  .withBasicAuth(username, password)
  .connect()
```

#### `withApiToken(token)`
Autenticar via token de API:

```js
const ws = Ws(url, options)

ws
  .withApiToken(token)
  .connect()
```

#### `withJwtToken(token)`
Autenticar via token JWT:

```js
const ws = Ws(url, options)

ws
  .withJwtToken(token)
  .connect()
```

### Informações do usuário

No servidor, acesse as informações do usuário por meio do objeto `auth`:

```js
// .start/socket.js

Ws.channel('chat', ({ auth }) => {
  console.log(auth.user)
})
```

::: warning OBSERVAÇÃO
O [middleware necessário](/docs/09-WebSockets/03-Server-API.md#registering-middleware) deve ser configurado para acessar o objeto `auth`.
:::

### Channel Middleware

Para autenticar conexões, garanta que o middleware nomeado `auth` seja aplicado:

```js
// .start/socket.js

Ws.channel('chat', ({ auth }) => {
  console.log(auth.user)
}).middleware(['auth'])
```
