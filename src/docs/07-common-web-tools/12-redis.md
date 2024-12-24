# Redis

O AdonisJs torna muito simples trabalhar com [redis](http://redis.io/). Internamente, ele faz uso do [ioredis](https://github.com/luin/ioredis), mas a API é um pouco diferente para manter seu código sustentável e legível.

## Recursos

1. Suporte para múltiplas conexões redis.
2. Conecte-se ao cluster redis.
3. Suporte para sentinela e transações.
4. Suporte extensivo para Pub/Sub.
5. Amigável com geradores ES2015.

## Configuração
O provedor Redis não é enviado com a instalação base do AdonisJs, o que significa que você precisa instalá-lo e configurá-lo manualmente.

```bash
# Instalando a partir do Npm

npm i --save adonis-redis
```

```js
// bootstrap/app.js

const providers = [
  // ...
  'adonis-redis/providers/RedisFactoryProvider',
  'adonis-redis/providers/RedisProvider'
  // ...
]
```

```js
// bootstrap/app.js

const aliases = {
  // ...
  Redis: 'Adonis/Addons/Redis'
  // ...
}
```

## Config
Além disso, um arquivo de configuração precisa ser salvo como config/redis.js. Você pode baixar a configuração de exemplo do [github](https://raw.githubusercontent.com/adonisjs/adonis-redis/develop/examples/redis.js) ou executar o comando bash abaixo para salvar o arquivo automaticamente.

```bash
# Baixar usando wget

wget https://raw.githubusercontent.com/adonisjs/adonis-redis/develop/examples/redis.js -O config/redis.js
```

## Exemplo básico
Depois que tudo estiver configurado, você estará pronto para usar o Redis dentro de seus aplicativos AdonisJs. Vamos começar com um exemplo básico de cache de usuários dentro do redis.

::: info OBSERVAÇÃO
O exemplo abaixo pode não ser a melhor maneira de armazenar usuários em cache, mas dá uma ideia de como usar o provedor redis.
:::

```js
// app/Http/Controllers/UsersController.js

'use strict'

const Redis = use('Redis')
const User = use('App/Model/User')

class UsersController {

  * index (request, response) {
    const cachedUsers = yield Redis.get('users')
    if (cachedUsers) {
      response.json(JSON.parse(cachedUsers))
      return
    }

    const users = yield User.all()
    yield Redis.set('users', JSON.stringify(users))
    response.json(users)
  }

}
```

## Comandos Redis
Todos os comandos [redis](http://redis.io/commands) são suportados como funções javascript. Por exemplo:

```js
'use strict'

const Redis = use('Redis')
const user = {
  username: 'foo',
  email: 'foo@bar.com'
}

yield Redis.hmset('users', user.username, JSON.stringify(user))
const user = yield Redis.hmget('users', user.username) // returns stringified JSON
```

## Pub/Sub
O Redis tem suporte integrado para Pub/Sub para compartilhar mensagens no mesmo servidor ou em vários servidores. O AdonisJs oferece uma API limpa para assinar e publicar mensagens sem nenhum esforço extra.

É recomendado criar um novo arquivo dentro do diretório *bootstrap* para registrar assinantes.

```js
// bootstrap/redis.js

'use strict'

const Redis = use('Redis')

Redis.subscribe('music', function * (track) {
  console.log('received track', track)
})
```

Em seguida, você precisa exigir este arquivo dentro do arquivo `bootstrap/http.js` para garantir que ele seja carregado ao inicializar o servidor HTTP logo após a declaração `require('./events')`.

```js
// bootstrap/http.js

require('./redis')
```

Agora, em qualquer lugar dentro do seu aplicativo, você pode publicar no canal de música e o ouvinte registrado será chamado.

```js
// app/Http/routes.js

'use strict'

const Route = use('Route')
const Redis = use('Redis')

Route.post('musics', function * (request, response) {
  Redis.publish('music', request.all())
})
```

## Métodos Pub/Sub
Abaixo está a lista de métodos pub/sub expostos pelo Redis Provider.

#### `subscribe(channel, listener)`
```js
----
Redis.subscribe('music', function * (track, channel) {
  console.log(track)
})
```

Além disso, o `listener` pode ser uma referência a um módulo dentro do diretório `app/Listeners`.

```js
Redis.subscribe('music', 'Music.newTrack')
```

```js
// app/Listeners/Music.js

'use strict'

const Music = exports = module.exports = {}

Music.newTrack = function * (track, channel) {
  console.log(track)
}
```

#### `psubscribe(pattern, listener)`
O método `psubscribe` assinará um padrão, e mensagens correspondentes serão enviadas ao ouvinte.

```js
Redis.psubscribe('h?llo', function * (message, channel, pattern) {
})

Redis.publish('hello')
Redis.publish('hallo')
```

#### `publish`
Publique mensagem em um determinado canal.

```js
Redis.publish('music', {id: 1, title: 'Love me like you do', artist: 'Ellie goulding'})
```

#### `unsubscribe(channel, [callback])`
Cancelar inscrição de um determinado canal.

```js
Redis.unsubscribe('music')
```

#### `punsubscribe(pattern, [callback])`
Cancelar inscrição de um determinado padrão.

```js
Redis.punsubscribe('h?llo')
```

## Transações
As transações são úteis quando você deseja executar operações em massa em um determinado ponto do tempo. Vamos revisar um exemplo de adição de usuários a uma lista.

```js
'use strict'

const User = use('App/Model/User')
const Redis = use('Redis')

class UsersController {

  * index (request, response) {
    const users = yield User.all()

    // Criando uma transação
    const multi = Redis.multi()
    users.each((user) => {
      multi.lpush('users-list', JSON.stringify(user))
    })
    yield multi.exec()

    response.json(users)
  }

}
```

#### `multi`
Cria uma nova transação para chamar vários comandos e executá-los juntos.

```js
const multi = Redis.multi()
multi
  .set('foo', 'bar')
  .set('bar', 'baz')

const response = yield multi.exec()
// [[null, 'OK'], [null, 'OK']]
```

## Pipelines
Pipelines são bem parecidos com transações, mas não garantem que todos os comandos serão executados em uma transação. Pipelines são úteis para enviar um lote de comandos para economizar viagens de ida e volta na rede.

#### `pipeline`
```js
const pipeline = Redis.pipeline()
pipeline
  .set('foo', 'bar')
  .set('bar', 'baz')

const response = yield pipeline.exec()
// [[null, 'OK'], [null, 'OK']]
```

## Conexões múltiplas
Você pode definir a configuração para várias conexões dentro do arquivo `config/redis.js` e pode usar essas conexões chamando o método `connection`.

```js
// config/redis.js

module.exports = {
  connection: 'local',

  local: {
    ...
  },

  secondary: {
    host: 'myhost.com',
    port: 6379
  }

}
```

#### `connection(name)`
Alternar para uma conexão diferente.

```js
yield Redis.connection('secondary').get('users')
```

#### `quit([name])`
O AdonisJs cria um pool de conexões para reutilizar a conexão estabelecida. Use o método `quit` para fechar uma única/todas as conexões do redis.

```js
const response = yield Redis.quit('secondary')
// ou
const response = yield Redis.quit() // close all connections
```

## Eventos do ciclo de vida
Você pode registrar um ouvinte para eventos do ciclo de vida da mesma forma que faria para [Pub/Sub](#pubsub-methods).

```js
// bootstrap/redis.js

'use strict'

const Redis = use('Redis')
Redis.on('connect', function () {
  // ...
})

Redis.on('error', function (error) {
  // ...
})
```

Abaixo está a lista de eventos emitidos pelo provedor Redis.

| Evento        | Descrição   |
|---------------|-------------|
| connect       | emite quando uma conexão é estabelecida com o servidor Redis. |
| ready         | emite quando `CLUSTER INFO` relata que o cluster é capaz de receber comandos (se *enableReadyCheck=true*) ou imediatamente após o evento `connect` (se *enableReadyCheck=false*). |
| error         | emite quando ocorre um erro ao conectar com uma propriedade de `lastNodeError` representando o último erro de nó recebido. Este evento é emitido silenciosamente (emitindo somente se houver pelo menos um ouvinte). |
| close         | emite quando uma conexão estabelecida do servidor Redis é fechada. |
| reconnecting  | emite após `close` quando uma reconexão será feita. O argumento do evento é o tempo (em ms) antes da reconexão. |
| end           | emite após `close` quando nenhuma outra reconexão será feita. |
| +node         | emite quando um novo nó é conectado. |
| -node         | emite quando um nó é desconectado. |
| node error    | emite quando ocorre um erro ao conectar a um nó |
