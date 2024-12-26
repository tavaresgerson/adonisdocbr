---
title: Getting Started
category: websockets
---

# Getting Started

AdonisJs offers a robust *WebSocket Provider* to serve real-time apps.

The server works on pure [WebSocket](https://developer.mozilla.org/en-US/docs/Glossary/WebSockets) connections (supported by all major browsers) and scales naturally within a cluster of Node.js processes.

## Setup
As the *WebSocket Provider* is not installed by default, pull it from `npm`:

```bash
adonis install @adonisjs/websocket
```

Installing the provider adds the following files to your project:

1. `config/socket.js` contains WebSocket server *configuration*.
2. `start/socket.js` boots the WebSocket server and registers *channels*.
3. `start/wsKernel.js` *registers middleware* to execute on channel subscription.

Next, register the provider inside the `start/app.js` file:

```js
// .start/app.js

const providers = [
  '@adonisjs/websocket/providers/WsProvider'
]
```

Finally, instruct [Ignitor](/original/markdown/02-Concept/05-ignitor.md) to boot the WebSocket server in the root `server.js` file:

```js
// .server.js

const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
   .appRoot(__dirname)
   .wsServer() // boot the WebSocket server
   .fireHttpServer()
   .catch(console.error)
```

### Cluster Support
When running a [Node.js cluster](https://nodejs.org/api/cluster.html), the master node needs to connect the pub/sub communication between worker nodes.

To do so, add the following code to the top of the root `server.js` file:

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

## Basic Example
Let's build a single room *chat server* for user messaging.

To keep things simple we won't store user messages, just deliver them.

Open the `start/socket.js` file and paste the following code:

```js
// .start/socket.js

const Ws = use('Ws')

Ws.channel('chat', 'ChatController')
```

> NOTE: We can also bind a closure to the `Ws.channel` method, but having a dedicated controller is the recommended practice.

Next, create the `ChatController` using the `make:controller` command:

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

### Client Code
Let's switch from server to client and subscribe to the `chat` channel.

First, copy the CSS and HTML template from [this gist](https://gist.github.com/thetutlage/7f0f2252b4d22dad13753ced890051e2) to the following locations:

1. *CSS* → `public/style.css`
2. *HTML template* → `resources/views/chat.edge`

> NOTE: Make sure to [define a route](/original/markdown/04-Basics/01-Routing.md) to serve the HTML template.

Next, create a `public/chat.js` file and paste the code below to connect the client to the server (to keep things simple we're using [jQuery](https://jquery.com)):

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

Then, add the channel subscription method, binding listeners to handle messages:

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

Finally, add the event handler to send a message when the [Enter] key is released:

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

### Server Code
Now finished with the client, let's switch back to the server.

Add the `onMessage` [event method](#event-methods) to the `ChatController` file:

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

In the example above, the `onMessage` method sends the same message to all connected clients via the socket `broadcastToAll` method.

## Controllers
Controllers keep your code organised by defining separate classes per channel.

WebSocket controllers are stored in the `app/Controllers/Ws` directory.

A new controller instance is created per subscription with a `context` object passed to its constructor, enabling the `socket` instance to be unpacked like so:

```js
class ChatController {
  constructor ({ socket }) {
    this.socket = socket
  }
}
```

### Event Methods

Bind to WebSocket events by creating controller methods with the same name:

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

> NOTE: Event methods must be prefixed with the `on` keyword.
