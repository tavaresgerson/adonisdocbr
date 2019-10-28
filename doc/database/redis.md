# Redis

O AdonisJs possui suporte de primeira classe para [Redis](https://redis.io/), construído sobre o [ioredis](https://github.com/luin/ioredis) com uma melhor API de publicação/[assinatura](https://github.com/luin/ioredis).

Configuração, API de eventos e todos os métodos ioredis são 100% suportados. Consulte o repositório ioredis para obter a 
documentação completa.

> Configuração, API de eventos e todos os métodos **ioredis** são 100% suportados. Consulte o repositório 
> [ioredis](https://github.com/luin/ioredis) para obter a documentação completa.

## Configuração
Como o Provedor Redis não está instalado por padrão, precisamos obtê-lo com o npm:

```
> adonis install @adonisjs/redis
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

``` js
const providers = [
  '@adonisjs/redis/providers/RedisProvider'
]
```

A configuração do Redis é salva dentro do arquivo `config/redis.js`, criado pelo comando `adonis install` ao instalar o Provedor Redis.

## Exemplo básico
Vamos começar com um exemplo básico de cache de usuários dentro do Redis:

``` js
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

> O exemplo acima pode não ser a melhor maneira de armazenar dados em cache - ele simplesmente fornece uma idéia 
> de como usar o Redis.

## Comandos
Todos os [comandos Redis](http://redis.io/commands) são suportados como funções JavaScript, por exemplo:

``` js
const Redis = use('Redis')

const user = {
  username: 'foo',
  email: 'foo@bar.com'
}

// define user
await Redis.hmset('users', user.username, JSON.stringify(user))

// obtêm user
const user = await Redis.hmget('users', user.username)
```

## Pub / Sub
O Redis possui suporte interno para publicação/assinatura (pub/sub) para compartilhar mensagens no mesmo servidor ou em 
vários servidores.

O AdonisJs oferece uma API limpa em cima do pub/sub Redis para se inscrever em diferentes eventos e agir de acordo com eles.

Defina seus assinantes Redis no start/redis.jsarquivo:

``` js
'use strict'

const Redis = use('Redis')

Redis.subscribe('music', async (track) => {
  console.log('received track', track)
})
```

> Cria o arquivo `start/redis.js` se ele não existe e carrega dentro do seu `server.js`: `.preLoad('start/redis')`.

Depois que um assinante for registrado, você poderá publicar dados neste canal no mesmo servidor ou em um servidor diferente:

``` js
const Redis = use('Redis')

Redis.publish('music', track)
```

## Métodos Disponíveis
Abaixo está a lista de métodos para interagir com a camada pub/sub do Redis.

> Você pode ter apenas um assinante para um determinado canal.

### subscribe (canal, ouvinte)
``` js
Redis.subscribe('music', (track) {
  console.log(track)
})
```

Você também pode passar uma referência `file.method` do diretóri `app/Listeners`:

``` js
Redis.subscribe('music', 'Music.newTrack')
```

``` js
'use strict'

const Music = exports = module.exports = {}

Music.newTrack = (track) => {
  console.log(track)
}
```

### psubscribe (padrão, ouvinte)
Inscrever-se em um padrão:

``` js
Redis.psubscribe('h?llo', function (pattern, message, channel) {
})

Redis.publish('hello')
Redis.publish('hallo')
```

### publish (canal, mensagem)
Publique a mensagem em um determinado canal:

``` js
Redis.publish('music', JSON.stringify({
  id: 1,
  title: 'Love me like you do',
  artist: 'Ellie goulding'
}))
```

### unsubscribe (canal)
Cancelar a inscrição em um determinado canal:
``` js
Redis.unsubscribe('music')
```

### punsubscribe (canal)
Cancelar a inscrição de um determinado padrão:
``` js
Redis.punsubscribe('h?llo')
```

## Conexões múltiplas
Você pode definir a configuração para várias conexões dentro do arquivo `config/redis.js` e pode usar essas conexões chamando 
o método `connection`:

``` js
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

### connection (nome)
Use uma conexão diferente para fazer consultas Redis:

``` js
await Redis
  .connection('secondary')
  .get('users')

// mantenha referência à conexão
const secondaryConnection = Redis.connection('secondary')
await secondaryConnection.get('users')
```

### quit (nome)
O Provedor Redis cria um pool de conexões para reutilizar as conexões existentes.

Você pode sair de uma conexão chamando o método `quit` que passa por uma única conexão ou matriz de conexões:

``` js
await Redis.quit('primary')
await Redis.quit(['primary', 'secondary'])
```


