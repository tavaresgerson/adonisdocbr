# Começando

O AdonisJs oferece um robusto provedor WebSocket para atender aplicativos em tempo real.

Esse servidor trabalha em conexões [WebSocket](https://developer.mozilla.org/en-US/docs/Glossary/WebSockets) puras (suportadas por todos os principais navegadores) e é dimensionado naturalmente 
dentro de um cluster de processos Node.js.

## Configuração
Como o provedor WebSocket não está instalado por padrão, baixe do npm:

```
adonis install @adonisjs/websocket
```

A instalação do provedor adiciona os seguintes arquivos ao seu projeto:

+ `config/socket.js` contém a configuração do servidor WebSocket.
+ `start/socket.js` inicializa o servidor WebSocket e registra os canais.
+ `start/wsKernel.js` registra o middleware para executar na assinatura do canal.

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

``` js
const providers = [
  '@adonisjs/websocket/providers/WsProvider'
]
```

Por fim, instrua o [Ignitor](https://adonisjs.com/docs/4.1/ignitor) a inicializar o servidor WebSocket no arquivo `server.js` raiz :

``` js
const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
   .appRoot(__dirname)
   .wsServer() // boot the WebSocket server
   .fireHttpServer()
   .catch(console.error)
```

### Suporte de cluster
Ao executar um [cluster Node.js](https://nodejs.org/api/cluster.html), o nó principal precisa conectar a comunicação pub/sub entre os nós do worker.

Para fazer isso, adicione o seguinte código na parte superior do arquivo `server.js` raiz :

``` js
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

### Exemplo básico
Vamos criar um servidor de bate-papo de sala única para mensagens do usuário.

Para simplificar, não armazenaremos mensagens do usuário, basta entregá-las.

Abra o arquivo `start/socket.js` e cole o seguinte código:

``` js
const Ws = use('Ws')

Ws.channel('chat', 'ChatController')
```

> Também podemos vincular um closure ao método `Ws.channel`, mas ter um controlador dedicado é a prática recomendada.

Em seguida, crie o `ChatController` usando o comando `make:controller`:

```
adonis make:controller Chat --type=ws
```

Resultado
```
✔ create  app/Controllers/Ws/ChatController.js
```

``` js
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
Vamos mudar de servidor para cliente e se inscrever no canal `chat`.

Primeiro, copie o modelo CSS e HTML [dessa lista](https://gist.github.com/thetutlage/7f0f2252b4d22dad13753ced890051e2) para os seguintes locais:

+ CSS → `public/style.css`

+ Modelo HTML → `resources/views/chat.edge`


> Certifique-se de definir [uma rota](https://adonisjs.com/docs/4.1/routing) para servir o modelo HTML.

Em seguida, crie um arquivo `public/chat.js` e cole o código abaixo para conectar o cliente ao servidor (para simplificar, estamos
usando o jQuery):

``` js
let ws = null

$(function () {
  // Conecte-se apenas quando o nome de usuário estiver disponível
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

Em seguida, adicione o método de assinatura de canal, ligando ouvintes para manipular mensagens:

``` js
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

Por fim, adicione o manipulador de eventos para enviar uma mensagem quando a tecla Enter for pressionada:

``` js
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
Agora finalizado com o cliente, vamos voltar ao servidor.

Adicione o método `onMessage` de evento ao arquivo `ChatController` (em `app/Controlllers/Ws/ChatController.js`):

``` js
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

No exemplo acima, o método `onMessage` envia a mesma mensagem para todos os clientes conectados por meio do método `broadcastToAll` 
do soquete.

## Controladores
Os controladores mantêm seu código organizado, definindo classes separadas por canal.

Os controladores de WebSocket são armazenados no diretório `app/Controllers/Ws`

Uma nova instância do controlador é criada por assinatura com um objeto `context` passado ao seu construtor, permitindo que a
instância `socket` seja descompactada da seguinte maneira:

``` js
class ChatController {
  constructor ({ socket }) {
    this.socket = socket
  }
}
```

### Métodos de evento
Associe-se a eventos WebSocket criando métodos de controlador com o mesmo nome:

``` js
class ChatController {
  onMessage () {
    // igual a: socket.on('message')
  }

  onClose () {
    // igual a: socket.on('close')
  }

  onError () {
    // igual a: socket.on('error')
  }
}
```

Os métodos de evento devem ser prefixados com a palavra-chave `on`.
