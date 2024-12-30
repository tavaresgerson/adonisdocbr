# Usando socket.io

[Socket.io](https://socket.io/) é uma biblioteca muito popular para comunicação bidirecional e em tempo real. Neste guia, aprenderemos como usar socket.io com AdonisJS.

O primeiro passo é instalar o pacote do registro de pacotes npm.

::: code-group
```sh [npm]
npm i socket.io
```

```sh [yarn]
yarn add socket.io
```
:::

Em seguida, vamos criar uma classe de serviço responsável por iniciar o servidor socketio e nos fornecer uma referência a ele.

O código para o serviço pode estar em qualquer lugar dentro da sua base de código. Eu prefiro mantê-lo dentro do diretório `./app/Services`.

```ts
// app/Services/Ws.ts

import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'

class Ws {
  public io: Server
  private booted = false

  public boot() {
    /**
     * Ignorar várias chamadas para o método de inicialização
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!)
  }
}

export default new Ws()
```

Em seguida, vamos criar um arquivo `start/socket.ts` e colar o seguinte conteúdo dentro dele. Assim como o arquivo `routes`, usaremos este arquivo para ouvir as conexões de soquete de entrada.

```ts
// start/socket.ts
import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Ouça as conexões de entrada
 */
Ws.io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' })

  socket.on('my other event', (data) => {
    console.log(data)
  })
})
```

Finalmente, importe o arquivo criado acima dentro do arquivo `providers/AppProvider.ts` sob o método `ready`.

O método `ready` é executado após o servidor HTTP AdonisJS estar pronto, e é quando devemos estabelecer a conexão socketio.

```ts
// providers/AppProvider.ts

import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async ready() {
    if (this.app.environment === 'web') {
      await import('../start/socket')
    }
  }
}
```

Isso é tudo o que você precisa fazer para configurar o socket.io. Vamos dar um passo adiante e também testar se podemos estabelecer uma conexão a partir do navegador.

## Configuração do cliente
Usaremos a compilação CDN do socketio-client para manter as coisas simples. Vamos abrir o `resources/views/welcome.edge` e adicionar os seguintes scripts à página.

```edge
<!-- resources/views/welcome.edge -->

<body>
  <!-- Resto da marcação -->

  <script src="https://cdn.socket.io/4.0.1/socket.io.min.js"></script> 
  <script>
    const socket = io()
    socket.on('news', (data) => {
      console.log(data)
      socket.emit('my other event', { my: 'data' })
    })
  </script>
</body>
</html>
```

Vamos iniciar o servidor de desenvolvimento executando `node ace serve --watch` e abrir [http://localhost:3333](http://localhost:3333) no navegador para testar a integração.

<video src="/docs/assets/socket-io_i4qe6n.mp4" controls />

## Transmitir de qualquer lugar
Como abstraímos a configuração do socketio para uma classe de serviço, você pode importá-la de qualquer lugar dentro da sua base de código para transmitir eventos. Por exemplo:

```ts
import Ws from 'App/Services/Ws'

class UsersController {
  public async store() {
    Ws.io.emit('new:user', { username: 'virk' })
  }
}
```

## Configurar CORS
A conexão socketio usa o servidor HTTP Node.js subjacente diretamente e, portanto, a configuração do AdonisJS CORS não funcionará com ela.

No entanto, você pode configurar [cors com socketio diretamente](https://socket.io/docs/v4/handling-cors/) da seguinte forma.

```ts
class Ws {
  public io: Server
  private booted = false

  public boot() {
    /**
     * Ignorar várias chamadas para o método de inicialização
     */
    if (this.booted) {
      return
    }

    this.booted = true

    this.io = new Server(AdonisServer.instance!, { // [!code focus]
      cors: { // [!code focus]
        origin: '*' // [!code focus]
      } // [!code focus]
    }) // [!code focus]
  }
}
```
