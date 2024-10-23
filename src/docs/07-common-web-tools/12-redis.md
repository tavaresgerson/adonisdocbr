# Redis

AdonisJs torna tão simples trabalhar com [Redis](http://redis.io/). Internamente, utiliza-se o [ioredis](https://github.com/luin/ioredis), mas a API é ligeiramente diferente para manter seu código legível e fácil de manter.

## Recursos

1. Suporte para múltiplas conexões com o Redis.
2. Conectar ao cluster Redis.
3. Suporte para sentinela e transações.
4. Ampla suporte para Pub/Sub.
5. Geração de código amigável para ES2015.

## Configuração
O provedor Redis não é enviado com a instalação básica do AdonisJs, o que significa que você precisa instalá-lo e configurá-lo manualmente.

```bash
# Installing From Npm

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

## Configuração
Além disso, um arquivo de configuração precisa ser salvo como config/redis.js. Você pode baixar a configuração de amostra em [github](https://raw.githubusercontent.com/adonisjs/adonis-redis/develop/examples/redis.js) ou executar o seguinte comando bash para salvar o arquivo automaticamente.

```bash
# Download using wget

wget https://raw.githubusercontent.com/adonisjs/adonis-redis/develop/examples/redis.js -O config/redis.js
```

## Exemplo básico
Uma vez que tudo esteja configurado, você está pronto para usar o Redis dentro de seus aplicativos AdonisJs. Vamos começar com um exemplo básico de cache de usuários dentro do Redis.

> NOTE
> Abaixo exemplo pode não ser a melhor maneira de armazenar em cache usuários, mas dá uma ideia de como usar o provedor Redis.

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

## Comandos do Redis
Todos os comandos [redis](http://redis.io/commands) são suportados como funções JavaScript. Por exemplo:

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

## Publicação/Inscrição
O Redis oferece suporte integrado para Pub/Sub para compartilhar mensagens em um ou em vários servidores. O AdonisJS oferece uma API limpa para assinar e publicar mensagens sem nenhum esforço adicional.

É recomendado criar um novo arquivo dentro do diretório *bootstrap* para registrar assinantes.

```js
// bootstrap/redis.js

'use strict'

const Redis = use('Redis')

Redis.subscribe('music', function * (track) {
  console.log('received track', track)
})
```

Em seguida, você precisa exigir este arquivo dentro do arquivo `bootstrap/http.js` para garantir que ele seja carregado quando o servidor HTTP for iniciado logo após a instrução `require('./events')`.

```js
// bootstrap/http.js

require('./redis')
```

Agora em qualquer lugar dentro do seu aplicativo, você pode publicar no canal de música e o ouvinte registrado será chamado.

```js
// app/Http/routes.js

'use strict'

const Route = use('Route')
const Redis = use('Redis')

Route.post('musics', function * (request, response) {
  Redis.publish('music', request.all())
})
```

## Métodos Public/Private
Abaixo está a lista de métodos de publicação/assinatura expostos pelo provedor Redis.

#### subscribe(canal, ouvinte)
```js
Redis.subscribe('music', function * (track, channel) {
  console.log(track)
})
```

Além disso, o "Listener" pode ser uma referência a um módulo dentro do diretório "app/Listeners".

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

#### psubscribe(pattern, listener)
O método `subscribe` irá assinar um padrão, e as mensagens que combinarem serão enviadas ao ouvinte.

```js
Redis.psubscribe('h?llo', function * (message, channel, pattern) {
})

Redis.publish('hello')
Redis.publish('hallo')
```

#### publicar
Publicar mensagem em um canal específico.

```js
Redis.publish('music', {id: 1, title: 'Love me like you do', artist: 'Ellie goulding'})
```

#### unsubscribe(channel, [callback])
Cancelar assinatura de um canal específico.

```js
Redis.unsubscribe('music')
```

#### punsubscribe(pattern, [callback])
Desuscreva-se de um determinado padrão.

```js
Redis.punsubscribe('h?llo')
```

## Transações
As transações são úteis quando você deseja executar operações em massa em um determinado ponto no tempo. Vamos revisar um exemplo de adição de usuários a uma lista.

```js
'use strict'

const User = use('App/Model/User')
const Redis = use('Redis')

class UsersController {

  * index (request, response) {
    const users = yield User.all()

    // Creating a transaction
    const multi = Redis.multi()
    users.each((user) => {
      multi.lpush('users-list', JSON.stringify(user))
    })
    yield multi.exec()

    response.json(users)
  }

}
```

#### multi
Cria uma nova transação para chamar múltiplos comandos e executá-los juntos.

```js
const multi = Redis.multi()
multi
  .set('foo', 'bar')
  .set('bar', 'baz')

const response = yield multi.exec()
// [[null, 'OK'], [null, 'OK']]
```

## Pipelines
Os pipelines são muito semelhantes às transações, mas não garantem que todos os comandos serão executados em uma transação. Os pipelines são úteis para enviar um lote de comandos para salvar as viagens redondas da rede.

#### pipeline
```js
const pipeline = Redis.pipeline()
pipeline
  .set('foo', 'bar')
  .set('bar', 'baz')

const response = yield pipeline.exec()
// [[null, 'OK'], [null, 'OK']]
```

## Conexões Múltiplas
Você pode definir a configuração para múltiplas conexões dentro do arquivo `config/redis.js`, e você pode usar essas conexões chamando o método `connection`.

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

#### conexão(nome)
Altere para uma conexão diferente.

```js
yield Redis.connection('secondary').get('users')
```

#### quit([nome])
AdonisJS cria uma piscina de conexões para reutilizar as conexões estabelecidas. Utilize o método 'quit' para fechar uma única/todas as conexões do Redis.

```js
const response = yield Redis.quit('secondary')
// or
const response = yield Redis.quit() // close all connections
```

## Eventos do Ciclo de Vida
Você pode registrar um ouvinte para eventos de ciclo de vida da mesma forma que você faria para xref:_pub_sub_methods [Pub / Sub].

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

| Evento | Descrição |
|-------|-------------|
| conectar | emite quando uma conexão é estabelecida com o servidor Redis. |
| pronto | emite quando o `CLUSTER INFO` informa que o cluster está pronto para receber comandos (se *enableReadyCheck=true*) ou imediatamente após o evento `connect` (se *enableReadyCheck=false*). |
| erro | emite quando ocorre um erro ao se conectar com uma propriedade de `lastNodeError` representando o último erro recebido do nó. Este evento é emitido silenciosamente (apenas emitindo se houver pelo menos um ouvinte). |
| Fechar | emite quando uma conexão com um servidor Redis estabelecido é fechada. |
| reconectando | emite após o `close` quando uma reconexão será feita. O argumento do evento é o tempo (em ms) antes de se reconectar. |
| fim | emits after `close` quando não haverá mais reconexões a serem feitas. |
| +node | emite quando um novo nó é conectado. |
| -node | emite quando um nó é desconectado. |
| Erro do nó | emite quando ocorre um erro ao conectar-se a um nó |
