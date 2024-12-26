---
title: Redis
category: database
---

# Redis

AdonisJs has first class support for [Redis](https://redis.io/) built on top of [ioredis](https://github.com/luin/ioredis) with a better pub/sub API.

> NOTE: Configuration, events API and all *ioredis* methods are 100% supported. See the [ioredis](https://github.com/luin/ioredis) repository for full documentation.

## Setup
As the *Redis Provider* is not installed by default, we need to pull it from `npm`:

```bash
adonis install @adonisjs/redis
```

Next, register the provider inside the `start/app.js` file:

```js
// .start/app.js

const providers = [
  '@adonisjs/redis/providers/RedisProvider'
]
```

> NOTE: Redis configuration is saved inside the `config/redis.js` file, which is created by the `adonis install` command when installing the *Redis Provider*.

## Basic Example
Let’s start with a basic example of caching users inside Redis:

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

> NOTE: The above example may not be the best way to cache data – it simply provides an idea on how to use Redis.

## Commands
All [Redis commands](http://redis.io/commands) are supported as JavaScript functions, for example:

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
Redis has built-in support for publish/subscribe (pub/sub) to share messages on the same server or across multiple servers.

AdonisJs offers a clean API on top of Redis pub/sub to subscribe to different events and act upon them.

Set your Redis subscribers in the `start/redis.js` file:

```js
// .start/redis.js

'use strict'

const Redis = use('Redis')

Redis.subscribe('music', async (track) => {
  console.log('received track', track)
})
```

> NOTE: Create the `start/redis.js` file if it does not exist and load it inside your `server.js`: `.preLoad('start/redis')`.

Once a subscriber has been registered, you can publish data to this channel from the same or different server:

```js
const Redis = use('Redis')

Redis.publish('music', track)
```

### Available Methods
Below is the list of methods to interact with the pub/sub layer of Redis.

> NOTE: You can only have one subscriber for a given channel.

#### `subscribe(channel, listener)`

```js
Redis.subscribe('music', (track) {
  console.log(track)
})
```

You can also pass a `file.method` reference from the `app/Listeners` directory:

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
Subscribe to a pattern:

```js
Redis.psubscribe('h?llo', function (pattern, message, channel) {
})

Redis.publish('hello')
Redis.publish('hallo')
```

#### `publish(channel, message)`
Publish message to a given channel:

```js
Redis.publish('music', JSON.stringify({
  id: 1,
  title: 'Love me like you do',
  artist: 'Ellie goulding'
}))
```

#### `unsubscribe(channel)`
Unsubscribe from a given channel:

```js
Redis.unsubscribe('music')
```

#### `punsubscribe(channel)`
Unsubscribe from a given pattern:

```js
Redis.punsubscribe('h?llo')
```

## Multiple connections
You can define the configuration for multiple connections inside the `config/redis.js` file, and you can use those connections by calling the `connection` method:

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
Use a different connection to make Redis queries:

```js
await Redis
  .connection('secondary')
  .get('users')

// hold reference to connection
const secondaryConnection = Redis.connection('secondary')
await secondaryConnection.get('users')
```

#### `quit(name)`
The Redis Provider creates a connection pool to reuse existing connections.

You can quit a connection by calling the `quit` method passing a single connection or array of connections:

```js
await Redis.quit('primary')
await Redis.quit(['primary', 'secondary'])
```
