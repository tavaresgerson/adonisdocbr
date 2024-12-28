---
title: Server API
category: websockets
---

# API do servidor

Neste guia, nos aprofundamos em *canais*, *autenticação* e troca de *mensagens em tempo real*.

## Registrando canais
Os canais WebSocket são registrados no arquivo `start/socket.js`:

```js
// .start/socket.js

const Ws = use('Ws')

Ws.channel('news', ({ socket }) => {
  console.log('a new subscription for news topic')
})
```

Os manipuladores de canal recebem um objeto `context`, semelhante aos manipuladores de rota HTTP [/original/markdown/02-Concept/01-Request-Lifecycle.md).

Por padrão, os objetos `context` do canal contêm propriedades `socket` e `request` (com mais adicionadas por middleware opcional como `Auth`, `Session`, etc.).

Depois que uma assinatura for feita, use a instância `socket` para trocar mensagens:

```js
socket.on('message', (data) => {
})

// emit events
socket.emit('message', 'Hello world')
socket.emit('typing', true)
```

### Tópicos dinâmicos
Canais podem ser registrados para aceitar assinaturas de tópicos dinâmicos:

```js
Ws.channel('chat:*', ({ socket }) => {
  console.log(socket.topic)
})
```

No exemplo acima, `*` define o canal para aceitar quaisquer assinaturas de tópicos que comecem com `chat:` (por exemplo, `chat:watercooler`, `chat:intro`, etc.).

As assinaturas de tópicos dinâmicos são feitas por meio da [API do cliente](/original/markdown/09-WebSockets/04-Client-API.md):

```js
const watercooler = ws.subscribe('chat:watercooler')
const intro = ws.subscribe('chat:intro')
const news = ws.subscribe('chat:news')
```

No exemplo acima, nossas diferentes assinaturas de tópicos apontam para o mesmo canal, mas quando eventos específicos do tópico são emitidos, eles serão entregues apenas aos assinantes do tópico específico.

## Registrando Middleware
O middleware é registrado dentro do arquivo `start/wsKernel.js`:

```js
// .start/wsKernel.js

const globalMiddleware = [
  'Adonis/Middleware/Session',
  'Adonis/Middleware/AuthInit'
]

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth'
}
```

O middleware nomeado é aplicado por canal no arquivo `start/socket.js`:

```js
// .start/socket.js

Ws
  .channel('chat', 'ChatController')
  .middleware(['auth'])
```

## Criando Middleware
O middleware WebSocket requer um método `wsHandle`.

Você pode compartilhar middleware HTTP e WebSocket garantindo que os métodos `handle` (para solicitações HTTP) e `wsHandle` estejam definidos na sua classe de middleware:

```js
// .app/Middleware/CustomMiddleware.js

'use strict'

class CustomMiddleware {
  // for HTTP
  async handle (ctx, next) {
  }

  // for WebSocket
  async wsHandle (ctx, next) {
  }
}

module.exports = CustomMiddleware
```

## Transmitir para qualquer lugar
Como os canais WebSocket pré-registrados podem ser acessados ​​de qualquer lugar dentro do seu aplicativo, a comunicação WebSocket não se limita ao ciclo de vida do socket.

Emita eventos WebSocket durante o ciclo de vida HTTP como:

```js
.app/Controllers/Http/UserController.js

const Ws = use('Ws')

class UserController {
  async register () {
    // ...

    const topic = Ws.getChannel('subscriptions').topic('subscriptions')
    // if no one is listening, so the `topic('subscriptions')` method will return `null`
    if(topic){
      topic.broadcast('new:user')
    }
  }
}
```

No exemplo acima, nós:

1. Selecionamos o canal por meio do método `getChannel(name)`
2. Selecionamos o tópico do canal por meio do método `topic(name)`
3. Transmitimos para assinantes do tópico por meio da mensagem `broadcast(event)`

`topic()` retorna um objeto contendo os seguintes métodos:

```js
const chat = Ws.getChannel('chat:*')
const { broadcast, emitTo } = chat.topic('chat:watercooler')

// broadcast: send to everyone (except the caller)
// emitTo: send to selected socket ids
```

> OBSERVAÇÃO: para obter mais informações, consulte a lista de [métodos de soquete](#métodos) abaixo.

## API de soquete

### Eventos

Os seguintes eventos são reservados e *não devem ser emitidos*.

#### `error`
Invocado quando um erro é recebido:

```js
socket.on('error', () => {
})
```

#### `close`
Invocado quando uma assinatura é fechada:

```js
socket.on('close', () => {
})
```

### Métodos
Os métodos a seguir podem ser chamados na instância do socket.

#### `emit(event, data, [ackCallback])`
Emitir evento para o cliente conectado:

```js
socket.emit('id', socket.id)
```

> OBSERVAÇÃO: Este método envia apenas uma mensagem para sua própria conexão.

#### `emitTo(event, data, socketIds[])`
Emitir evento para uma matriz de IDs de soquete:

```js
socket.emitTo('greeting', 'hello', [someIds])
```

#### `broadcast(event, data)`
Emitir evento para todos *exceto* você:

```js
socket.broadcast('message', 'hello everyone!')
```

#### `broadcastToAll(event, data)`
Emitir evento para todos *incluindo* você:

```js
socket.broadcastToAll('message', 'hello everyone!')
```

#### `close()`
Forçar o fechamento de uma assinatura do servidor:

```js
socket.close()
```

### Propriedades
As seguintes propriedades *somente leitura* podem ser acessadas na instância do soquete.

#### `id`
ID exclusivo do socket:

```js
socket.id
```

#### `topic`
Tópico sob o qual o socket de assinatura foi criado:

```js
socket.topic
```

#### `connection`
Referência à conexão TCP (compartilhada entre múltiplos sockets para um único cliente para multiplexação):

```js
socket.connection
```
