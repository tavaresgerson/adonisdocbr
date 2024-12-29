# Introdução

O AdonisJs oferece um *WebSocket Provider* robusto para servir aplicativos em tempo real.

O servidor funciona em conexões [WebSocket](https://developer.mozilla.org/en-US/docs/Glossary/WebSockets) puras (com suporte de todos os principais navegadores) e escala naturalmente dentro de um cluster de processos Node.js.

## Configuração
Como o *WebSocket Provider* não é instalado por padrão, extraia-o de `npm`:

```bash
adonis install @adonisjs/websocket
```

A instalação do provedor adiciona os seguintes arquivos ao seu projeto:

1. `config/socket.js` contém a *configuração* do servidor WebSocket.
2. `start/socket.js` inicializa o servidor WebSocket e registra *canais*.
3. `start/wsKernel.js` *registra o middleware* para executar na assinatura do canal.

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/websocket/providers/WsProvider'
]
```

Finalmente, instrua o [Ignitor](/docs/02-Concept/05-ignitor.md) a inicializar o servidor WebSocket no arquivo raiz `server.js`:

```js
// .server.js

const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
   .appRoot(__dirname)
   .wsServer() // boot the WebSocket server
   .fireHttpServer()
   .catch(console.error)
```

### Suporte a cluster
Ao executar um [cluster Node.js](https://nodejs.org/api/cluster.html), o nó mestre precisa conectar a comunicação pub/sub entre os nós de trabalho.

Para fazer isso, adicione o seguinte código ao topo do arquivo raiz `server.js`:

```js
// .server.js

const cluster = require('cluster')

if (cluster.isMaster) {
  for (let i=0; i < 4; i ++) {
    cluster.fork()
  }
  require('@adonisjs/websocket/clusterPubSub')()
  return
}

// ...
```

## Exemplo básico
Vamos construir um *servidor de bate-papo* de sala única para mensagens do usuário.

Para manter as coisas simples, não armazenaremos mensagens do usuário, apenas as entregaremos.

Abra o arquivo `start/socket.js` e cole o seguinte código:

```js
// .start/socket.js

const Ws = use('Ws')

Ws.channel('chat', 'ChatController')
```

::: info NOTA
Também podemos vincular um fechamento ao método `Ws.channel`, mas ter um controlador dedicado é a prática recomendada.
:::

Em seguida, crie o `ChatController` usando o comando `make:controller`:

```bash
adonis make:controller Chat --type=ws
```

```bash
# .Output

✔ create  app/Controllers/Ws/ChatController.js
```

```js
// .app/Controllers/Ws/ChatController.js

'use strict'

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }
}

module.exports = ChatController
```

### Código do cliente
Vamos alternar do servidor para o cliente e assinar o canal `chat`.

Primeiro, copie o modelo CSS e HTML [deste gist](https://gist.github.com/thetutlage/7f0f2252b4d22dad13753ced890051e2) para os seguintes locais:

1. *CSS* → `public/style.css`
2. *Modelo HTML* → `resources/views/chat.edge`

::: warning OBSERVAÇÃO
Certifique-se de [definir uma rota](/docs/04-Basics/01-Routing.md) para servir o modelo HTML.
:::

Em seguida, crie um arquivo `public/chat.js` e cole o código abaixo para conectar o cliente ao servidor (para manter as coisas simples, estamos usando [jQuery](https://jquery.com)):

```js
// .public/chat.js

let ws = null

$(function () {
  // Only connect when username is available
  if (window.username) {
    startChat()
  }
})

function startChat () {
  ws = adonis.Ws().connect()

  ws.on('open', () => {
    $('.connection-status').addClass('connected')
    subscribeToChannel()
  })

  ws.on('error', () => {
    $('.connection-status').removeClass('connected')
  })
}
```

Em seguida, adicione o método de assinatura do canal, vinculando ouvintes para manipular mensagens:

```js
// .public/chat.js

// ...

function subscribeToChannel () {
  const chat = ws.subscribe('chat')

  chat.on('error', () => {
    $('.connection-status').removeClass('connected')
  })

  chat.on('message', (message) => {
    $('.messages').append(`
      <div class="message"><h3> ${message.username} </h3> <p> ${message.body} </p> </div>
    `)
  })
}
```

Finalmente, adicione o manipulador de eventos para enviar uma mensagem quando a tecla [Enter] for liberada:

```js
// .public/chat.js

// ...

$('#message').keyup(function (e) {
  if (e.which === 13) {
    e.preventDefault()

    const message = $(this).val()
    $(this).val('')

    ws.getSubscription('chat').emit('message', {
      username: window.username,
      body: message
    })
    return
  }
})
```

### Código do servidor
Agora que terminamos com o cliente, vamos voltar para o servidor.

Adicione o método `onMessage` [event](#event-methods) ao arquivo `ChatController`:

```js
// .app/Controllers/Ws/ChatController.js

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onMessage (message) {
    this.socket.broadcastToAll('message', message)
  }
}
```

No exemplo acima, o método `onMessage` envia a mesma mensagem para todos os clientes conectados por meio do método `broadcastToAll` do soquete.

## Controladores
Os controladores mantêm seu código organizado definindo classes separadas por canal.

Os controladores WebSocket são armazenados no diretório `app/Controllers/Ws`.

Uma nova instância do controlador é criada por assinatura com um objeto `context` passado para seu construtor, permitindo que a instância `socket` seja descompactada assim:

```js
class ChatController {
  constructor ({ socket }) {
    this.socket = socket
  }
}
```

### Métodos de evento

Vincule a eventos WebSocket criando métodos de controlador com o mesmo nome:

```js
class ChatController {
  onMessage () {
    // same as: socket.on('message')
  }

  onClose () {
    // same as: socket.on('close')
  }

  onError () {
    // same as: socket.on('error')
  }
}
```

::: warning OBSERVAÇÃO
Os métodos de evento devem ser prefixados com a palavra-chave `on`.
:::
