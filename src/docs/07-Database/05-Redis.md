# Redis

AdonisJs tem suporte de primeira classe para [Redis](https://redis.io/) construído em cima de [ioredis](https://github.com/luin/ioredis) com uma melhor API pub/sub.

::: info NOTA
Configuração, API de eventos e todos os métodos *ioredis* são 100% suportados. Veja o repositório [ioredis](https://github.com/luin/ioredis) para documentação completa.
:::

## Configuração
Como o *Provedor Redis* não é instalado por padrão, precisamos obtê-lo de `npm`:

```bash
adonis install @adonisjs/redis
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/redis/providers/RedisProvider'
]
```

::: warning NOTA
A configuração do Redis é salva dentro do arquivo `config/redis.js`, que é criado pelo comando `adonis install` ao instalar o *Provedor Redis*.
:::

## Exemplo básico
Vamos começar com um exemplo básico de cache de usuários dentro do Redis:

```js
// .app/Controllers/Http/UserController.js

'use strict'

const Redis = use('Redis')
const User = use('App/Models/User')

class UserController {

  async index () {
    const cachedUsers = await Redis.get('users')
    if (cachedUsers) {
      return JSON.parse(cachedUsers)
    }

    const users = await User.all()
    await Redis.set('users', JSON.stringify(users))
    return users
  }
}
```

::: info NOTA
O exemplo acima pode não ser a melhor maneira de armazenar dados em cache – ele simplesmente fornece uma ideia de como usar o Redis.
:::

## Comandos
Todos os [comandos do Redis](http://redis.io/commands) são suportados como funções JavaScript, por exemplo:

```js
const Redis = use('Redis')

const user = {
  username: 'foo',
  email: 'foo@bar.com'
}

// set user
await Redis.hmset('users', user.username, JSON.stringify(user))

// get user
const user = await Redis.hmget('users', user.username)
```

## Pub/Sub
O Redis tem suporte integrado para publicar/assinar (pub/sub) para compartilhar mensagens no mesmo servidor ou em vários servidores.

O AdonisJs oferece uma API limpa sobre o pub/sub do Redis para assinar diferentes eventos e agir sobre eles.

Defina seus assinantes do Redis no arquivo `start/redis.js`:

```js
// .start/redis.js

'use strict'

const Redis = use('Redis')

Redis.subscribe('music', async (track) => {
  console.log('received track', track)
})
```

::: warning OBSERVAÇÃO
Crie o arquivo `start/redis.js` se ele não existir e carregue-o dentro do seu `server.js`: `.preLoad('start/redis')`.
:::

Depois que um assinante for registrado, você pode publicar dados neste canal do mesmo servidor ou de um servidor diferente:

```js
const Redis = use('Redis')

Redis.publish('music', track)
```

### Métodos disponíveis
Abaixo está a lista de métodos para interagir com a camada pub/sub do Redis.

::: warning OBSERVAÇÃO
Você só pode ter um assinante para um determinado canal.
:::

#### `subscribe(channel, listener)`

```js
Redis.subscribe('music', (track) {
  console.log(track)
})
```

Você também pode passar uma referência `file.method` do diretório `app/Listeners`:

```js
Redis.subscribe('music', 'Music.newTrack')
```

```js
// .app/Listeners/Music.js

'use strict'

const Music = exports = module.exports = {}

Music.newTrack = (track) => {
  console.log(track)
}
```

#### `psubscribe(pattern, listener)`
Assinar um padrão:

```js
Redis.psubscribe('h?llo', function (pattern, message, channel) {
})

Redis.publish('hello')
Redis.publish('hallo')
```

#### `publish(channel, message)`
Publicar mensagem em um canal fornecido:

```js
Redis.publish('music', JSON.stringify({
  id: 1,
  title: 'Love me like you do',
  artist: 'Ellie goulding'
}))
```

#### `unsubscribe(channel)`
Cancelar inscrição de um canal fornecido:

```js
Redis.unsubscribe('music')
```

#### `punsubscribe(channel)`
Cancelar inscrição de um canal fornecido padrão:

```js
Redis.punsubscribe('h?llo')
```

## Conexões múltiplas
Você pode definir a configuração para várias conexões dentro do arquivo `config/redis.js` e pode usar essas conexões chamando o método `connection`:

```js
// .config/redis.js

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
Use uma conexão diferente para fazer consultas Redis:

```js
await Redis
  .connection('secondary')
  .get('users')

// hold reference to connection
const secondaryConnection = Redis.connection('secondary')
await secondaryConnection.get('users')
```

#### `quit(name)`
O Provedor Redis cria um pool de conexões para reutilizar conexões existentes.

Você pode encerrar uma conexão chamando o método `quit` passando uma única conexão ou matriz de conexões:

```js
await Redis.quit('primary')
await Redis.quit(['primary', 'secondary'])
```
