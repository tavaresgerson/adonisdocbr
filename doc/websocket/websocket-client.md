# API Cliente

Este guia cobre o cliente JavaScript que usa WebSocket para se conectar ao servidor [WebSocket](https://adonisjs.com/docs/4.1/websocket-server).

## Instalação

#### NPM
Como o cliente WebSocket não é instalado por padrão, precisamos baixá-lo do npm:

```bash
npm i @adonisjs/websocket-client
```

Depois de instalado, empacote usando o Webpack, Rollup, etc.

Em seguida, importe o cliente WebSocket em seu projeto da seguinte forma:
```js
import Ws from '@adonisjs/websocket-client'
const ws = Ws('ws://localhost:3333')
```

#### UNPKG
Como alternativa, obtenha o pacote UMD diretamente de unpkg :

```html
<script src="https://unpkg.com/@adonisjs/websocket-client"></script>
<script>
  const ws = adonis.Ws('ws://localhost:3333')
</script>
```

#### Polyfill
A construção do módulo requer o polyfill [regenerador-runtime](https://babeljs.io/docs/plugins/transform-regenerator) 
(adicione-o via [Babel](https://babeljs.io/)).

#### Construções de produção
Como o build de desenvolvimento contém várias instruções de log, recomendamos definir NODE_ENV por meio do 
Webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) ou [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace).

## Começando
Conecte-se a um servidor WebSocket por meio do cliente da seguinte maneira:
```js
const ws = Ws(url, options)

// conecta ao servidor
ws.connect()
```

> O parâmetro `url` retornará o nome do host atual se um valor `ws://` de url completo for omitido.

Opções

| Chave                   | Valor padrão   | Descrição                         |
|-------------------------|----------------|-----------------------------------|
| `path`                  | adonis-ws      | O caminho usado para fazer a conexão (só mude se você mudou no servidor). |
| `reconnection`          | true           | Se deve reconectar automaticamente após desconectar.  |
| `reconnectionAttempts`  | 10             | Número de tentativas de reconexão antes de abandonar. |
| `reconnectionDelay`     | 1000           | Quanto tempo esperar antes de reconectar. O valor será usado como n x delay, onde né o valor atual das tentativas de reconexão. |
| `query`                 | null           | String de consulta para passar para o URL de conexão (também aceita um objeto). |
| `encoder`               | JsonEncoder    | O codificador a ser usado (o mesmo codificador será necessário no servidor). | 

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

Depois de conectado, inscreva-se em tópicos diferentes/múltiplos:
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

## API de inscrição
Os métodos a seguir são usados ​​para enviar / receber mensagens.

#### emit(event, data)
Envie o evento para o servidor:
```js
chat.emit('message', {
  body: 'hello',
  user: 'virk'
})
```

#### on(event, callback)
Listener de evento de vinculação:
```js
chat.on('message', () => {})
chat.on('new:user', () => {})
```

#### off(event, callback)
Remover ouvinte de evento:

```js
const messageHandler = function () {}

chat.on('message', messageHandler)
chat.off('message', messageHandler)
```

#### close()
Inicie a solicitação para fechar a assinatura:
```js
chat.on('close', () => {
  // servidor reconheceu fechar
})

chat.close()
```

> Ouça o evento de fechamento para confirmar se a inscrição foi fechada.

#### leaveError
Emitido quando o servidor se recusa a fechar a assinatura:
```js
chat.on('leaveError', (response) => {
  console.log(response)
})
```

#### error
Emitido quando ocorre um erro na conexão TCP:
```js
chat.on('error', (event) => {
})
```

> De preferência, ouça o evento `ws.on('error')`.

#### close
Emitido quando a assinatura é fechada:
```js
chat.on('close', () => {
})
```

## API Ws
Os métodos a seguir estão disponíveis em uma única wsconexão.

#### connect
Inicie a conexão:
```js
ws.connect()
```

#### close
Feche a conexão à força:
```js
ws.close()
```

> Remove todas as assinaturas e não aciona uma reconexão.

#### getSubscription(topic)
Retorna a instância de inscrição para um determinado tópico:
```js
ws.subscribe('chat')

ws.getSubscription('chat').on('message', () => {
})
```

Se não houver assinaturas para o tópico fornecido, retorna null.

#### subscribe(topic)
Inscreva-se em um tópico:

```js
const chat = ws.subscribe('chat')
```
Inscrever-se no mesmo tópico duas vezes gera uma exceção.

## Autenticação
O cliente AdonisJs WebSocket simplifica a autenticação de usuários.

As credenciais de autenticação são passadas apenas uma vez para o servidor durante a conexão inicial, portanto, as mesmas informações podem ser reutilizadas para permitir / proibir inscrições de canal.

> Se o seu aplicativo usa sessões, os usuários serão autenticados automaticamente, desde que tenham uma sessão válida.

#### withBasicAuth(username, password)

Autenticar via autenticação básica:
```js
const ws = Ws(url, options)

ws
  .withBasicAuth(username, password)
  .connect()
```

#### withApiToken(token)
Autenticar via token de API:

```js
const ws = Ws(url, options)

ws
  .withApiToken(token)
  .connect()
```

#### withJwtToken(token)

Autenticar via token JWT:
```js
const ws = Ws(url, options)

ws
  .withJwtToken(token)
  .connect()
```

### Informação do usuário

No servidor, acesse as informações do usuário por meio do objeto `auth`:
```js
// start/socket.js
Ws.channel('chat', ({ auth }) => {
  console.log(auth.user)
})
```

> O middleware necessário deve ser configurado para acessar o objeto `auth`.

## Middleware de canal
Para autenticar conexões, certifique-se de que o authmiddleware nomeado seja aplicado:
```js
// start/socket.js

Ws.channel('chat', ({ auth }) => {
  console.log(auth.user)
}).middleware(['auth'])
```
