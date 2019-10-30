# API Servidor

Neste guia, vamos nos aprofundar nos canais, autenticação e troca de mensagens em tempo real.

## Registrando Canais
Os canais WebSocket são registrados no arquivo `start/socket.js`:

``` js
const Ws = use('Ws')

Ws.channel('news', ({ socket }) => {
  console.log('Uma nova inscrição para o tópico notícias')
})
```

Os manipuladores de canal recebem um objeto `context`, semelhante aos manipuladores de rota HTTP.

Por padrão, os objetos `context` de canal contêm as propriedades `socket` e `request` (com mais opções adicionadas pelo 
middleware opcional como `Auth`, `Session`, etc).

Depois que uma assinatura é feita, use a instância `socket` para trocar mensagens:

``` js
socket.on('message', (data) => {
})

// emite eventos
socket.emit('message', 'Hello world')
socket.emit('typing', true)
```

### Tópicos dinâmicos
Os canais podem ser registrados para aceitar assinaturas dinâmicas de tópicos:

``` js
Ws.channel('chat:*', ({ socket }) => {
  console.log(socket.topic)
})
```
No exemplo acima, `*` define o canal para aceitar quaisquer assinaturas para tópicos começando com `chat:` (por exemplo
`chat:watercooler`, `chat:intro`, etc.).

As assinaturas de tópicos dinâmicos são feitas por meio da API do cliente:

``` js
const watercooler = ws.subscribe('chat:watercooler')
const intro = ws.subscribe('chat:intro')
const news = ws.subscribe('chat:news')
```

No exemplo acima, nossas diferentes inscrições de tópicos apontam para o mesmo canal, mas quando eventos específicos de tópicos 
são emitidos, eles são entregues apenas aos assinantes de tópicos específicos.

## Registrando Middleware
O middleware é registrado dentro do arquivo `start/wsKernel.js`:

``` js
const globalMiddleware = [
  'Adonis/Middleware/Session',
  'Adonis/Middleware/AuthInit'
]

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth'
}
```

O middleware nomeado é aplicado por canal no arquivo `start/socket.js`:

``` js
Ws
  .channel('chat', 'ChatController')
  .middleware(['auth'])
```

## Criando Middleware
O middleware WebSocket exigia um método `wsHandle`.

Você pode compartilhar o middleware HTTP e WebSocket, garantindo que os métodos `handle` (para solicitações HTTP) e `wsHandle`
estejam definidos na sua classe de middleware:

###### `app/Middleware/CustomMiddleware.js`
``` js
'use strict'

class CustomMiddleware {
  // para HTTP
  async handle (ctx, next) {
  }

  // para WebSocket
  async wsHandle (ctx, next) {
  }
}

module.exports = CustomMiddleware
```

## Transmitir em qualquer lugar
Como os canais WebSocket pré-registrados podem ser acessados de qualquer lugar dentro de seu aplicativo, a comunicação WebSocket 
não se limita ao ciclo de vida do soquete.

Emita eventos do WebSocket durante o ciclo de vida do HTTP da seguinte maneira:

###### `app/Controladores/Http/UserController.js`
``` js
const Ws = use('Ws')

class UserController {
  async register () {
    // ...

    Ws
      .getChannel('subscriptions')
      .topic('subscriptions')
      .broadcast('new:user')
  }
}
```

No exemplo acima:

* Selecione o canal através do método `getChannel(nome)`
* Selecione o tópico do canal através do método `topic(nome)`
* Transmitir para assinantes de tópicos por meio de `broadcast(event)`

`topic()` retorna um objeto que contém os seguintes métodos:
``` js
const chat = Ws.getChannel('chat:*')
const { broadcast, emitTo } = chat.topic('chat:watercooler')

// broadcast: enviar para todos (exceto o chamador)
// emitTo: envia para os IDs de soquete selecionados
```
> Para mais informações, consulte a lista de métodos de soquete abaixo.

## API de soquete

### Eventos
Os seguintes eventos são reservados e não devem ser emitidos.

#### erro
Chamado quando um erro é recebido:

``` js
socket.on('error', () => {
})
```

#### close
Chamado quando uma assinatura é fechada:

``` js
socket.on('close', () => {
})
```

### Métodos
Os seguintes métodos podem ser chamados na instância do soquete.

#### emit (evento, dados, [ackCallback])
Emita um evento para o cliente conectado:

``` js
socket.emit('id', socket.id)
```

Este método envia apenas uma mensagem para sua própria conexão.

#### emitTo (evento, dados, socketIds [])
Emita um evento para uma matriz de IDs de soquete:

``` js
socket.emitTo('greeting', 'hello', [someIds])
```

#### broadcast (evento, dados)
Emita evento para todos, exceto você:
``` js
socket.broadcast('message', 'hello everyone!')
```

#### broadcastToAll (evento, dados)
Emita evento para todos, incluindo você:

``` js
socket.broadcastToAll('message', 'hello everyone!')
```

#### close()
Feche vigorosamente uma assinatura do servidor:

``` js
socket.close()
```

### Propriedades
As seguintes propriedades somente leitura podem ser acessadas na instância do soquete.

#### id
ID exclusivo do soquete:
``` js
socket.id
```

#### topic
Tópico sob o qual o soquete de assinatura foi criado:
``` js
socket.topic
```

#### connection
Referência à conexão TCP (compartilhada em vários soquetes para um único cliente para multiplexação):
``` js
socket.connection
```
