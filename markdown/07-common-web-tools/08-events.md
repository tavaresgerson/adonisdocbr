# Events

AdonisJs got a beautiful [Event Emitter](https://nodejs.org/docs/latest-v6.x/api/events.html) to emit and listen to events with support for *ES2015 generators*, *wildcards* and a *dedicated directory* to store/manage listeners.

## About Events

1. Events are defined inside `bootstrap/events.js` file.
2. Events listeners can be defined as *Closures* or you can bind an IoC container namespace.
    ```js
    Event.on('user.registered', function * (user) {
    })

    // OR
    Event.on('user.registered', 'User.registered')
    ```

3. The `app/Listeners` directory is dedicated for storing Event listeners.
4. When binding listeners to the events, you are not required to enter the entire namespace. For example A listener stored as `app/Listeners/User.js` will be referenced as `User.<method>`.
5. Make use of `make:listener` command to create a new event listener.
    ```bash
    ./ace make:listener User

    # create: app/Listeners/User.js
    ```

## Configuration
The configuration for Events provider is stored inside `config/events.js` file. Under the hood AdonisJs makes use of [EventEmitter 2](https://github.com/asyncly/EventEmitter2) and implements all the available configuration options.

## Basic Example
Let's walk through a basic example of sending a welcome email to a newly registered user using the *Events provider*. We will start by setting up a route and will use the *UsersController* to fire the event after creating a new user.

```js
// app/Http/routes.js

'use strict'

const Route = use('Route')
Route.post('users', 'UsersController.store')
```

```js
// bootstrap/events.js

'use strict'

const Event = use('Event')
Event.when('user.registered', 'User.sendWelcomeEmail') <1>
```

```js
// app/Http/Controllers/UsersController.js

'use strict'

const Event = use('Event')
const User = use('App/Model/User')

class UsersController {
  * store (request, response) {
    const user = yield User.create(userDetails)
    Event.fire('user.registered', user.toJSON()) <2>
  }
}
```

```js
// app/Listeners/User.js

'use strict'

const Mail = use('Mail')
const User = exports = module.exports = {}

User.sendWelcomeEmail = function * (user) {
  yield Mail.send('emails.welcome', user, message => {
    message.to(user.email, user.firstname)
    message.from('awesome@adonisjs.com')
    message.subject('Welcome to the Kitten\'s World')
  })
}
```

1. First we need to register a listener for the event.
2. The `UsersController.store` method will fire the *user.registered* event and pass the newly created user.

## Event Methods
Below is the list of available methods exposed by the Event Provider.

#### when(event, [name], listener)
Register a listener for a given event. You can also define an optional name for a listener, which can be used to remove it later.

```js
Event.when('user.registered', 'Mail.sendWelcomeEmail')
```

```js
Event.when('user.registered', function * () {
  // ...
})
```

```js
Event.when('user.registered', 'registration', 'User.sendWelcomeEmail')
```

Aliases

| Alias   | Example |
|---------|---------|
| listen  | `Event.listen('user.registered', function * () {})` |
| on      | `Event.on('user.registered', function * () {})` |

#### once(event, handler)
Works same as `when` but is executed only for one time.

```js
Event.once('app.boot', function * () {
  // ...
})
```

#### any(handler)
Attach a global event listener to listen for all the events.

```js
Event.any(function (event) {
  console.log(event)
})
```

#### times(number)
Set a limit for times an event listener will be executed and get removed after that.

```js
Event.times(4).when('user.registered', function () {
  // I will be executed 4 times only
})
```

#### fire(event, data)
Fires an event.

```js
Event.fire('user.registered', user)
```

Aliases

| Alias | Example                                 |
|-------|-----------------------------------------|
| emit  | `Event.emit('user.registered', user)`   |

#### removeListeners([event])
Remove all listeners from a given event or for all events.

```js
Event.removeListeners() // will remove all listeners
Event.removeListeners('user.registered') // will remove listeners for user.registered event only
```

#### removeListener(event, name)
Remove a named listener for a given event.

```js
// register multiple
Event.when('user.registered', 'Logger.log')
Event.when('user.registered', 'registration', 'Mail.sendWelcomeEmail')

// remove a specific one
Event.removeListener('user.registered', 'registration')
```

#### hasListeners(event)
Returns a boolean whether an event has listeners or not.

```js
Event.hasListeners('user.registered')
```

#### getListeners(event)
Returns an array of listeners for a specific event.

```js
Event.getListeners('user.registered')
```

## Emitter Instance
All of the event listeners has access to the emitter instance.

```js
Event.when('user.registered', function () {
  console.log(this.emitter)
})
```
