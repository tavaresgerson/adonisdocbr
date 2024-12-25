---
title: Events
category: digging-deeper
---

# Events

AdonisJs ships with a dedicated *Event Provider*.

Internally, it uses the [EventEmitter2](https://github.com/asyncly/EventEmitter2) package, with other convenient functionality added on top of it.

The *Event Provider* has a [fake](/original/markdown/10-testing/05-Fakes.md) implementation, which can be used for assertions when writing tests.

## Events Overview

1. Event listeners are defined inside the `start/events.js` file.
2. Events listeners can be defined as *closures*, or you can bind an IoC container *namespace* instead:
  ```js
  Event.on('new::user', async (user) => {
  })

  // OR
  Event.on('new::user', 'User.registered')
  ```

3. Namespaced event listeners are stored inside the `app/Listeners` directory.
4. When binding listeners to events, you are not required to enter the entire namespace. For example, A listener stored as `app/Listeners/User.js` is referenced as `User.<method>`.
5. The `make:listener` command can be used to create new event listeners:
  ```bash
  adonis make:listener User
  ```

  ```bash
  # .Output

  ✔ create  app/Listeners/User.js
  ```

## Basic Example
Let's say we want to emit an event every time a user registers on our website, and inside an *event listener*, send an email to the registered user.

First, we need to create the relevant route and controller:

```js
// .start/routes.js

Route.post('register', 'UserController.register')
```

```js
// .app/Controllers/Http/UserController.js

const Event = use('Event')

class UserController {
  register () {
    // register the user

    Event.fire('new::user', user)
  }
}
```

Next, we need to a listener for the `new::user` event so we can send the email.

To do so, create an `events.js` file inside the `start` directory:

```bash
# Mac / Linux
> touch start/events.js

# Windows
> type NUL > start/events.js
```

Finally, write our event handling code inside the `start/events.js` file:

```js
const Event = use('Event')
const Mail = use('Mail')

Event.on('new::user', async (user) => {
  await Mail.send('new.user', user, (message) => {
    message.to(user.email)
    message.from('from@email')
  })
})
```

As you can see, AdonisJs makes it easy to use the `await` keyword inside the event listener callback.

## API
Below is the list of methods that can be used to interact with the *Event Provider*.

#### `on(event, listener)`
Bind single or multiple listeners for a given event. The `listener` can be a closure function or reference to one (or many) IoC container bindings:

```js
Event.on('new::user', async () => { 

})

// IoC container binding
Event.on('new::user', 'User.registered')

// Array of listeners
Event.on('new::user', ['Mailer.sendEmail', 'SalesForce.trackLead'])
```

#### `when(event, listener)`
The `when` method aliases the [on](#onceevent-listener) method.

#### `once(event, listener)`
Same as [on](#onevent-listener), but only called one time:

```js
Event.once('new::user', () => {
  console.log('executed once')
})
```

#### `onAny(listener)`
Bind listener for any event:

```js
Event.onAny(function () {

})

// Ioc container binding
Event.onAny('EventsLogger.track')
```

#### `times(number)`
The `times` method is chained with `on` or `when` to limit the number of times the listener should be fired:

```js
Event
  .times(3)
  .on('new::user', () => {
    console.log('fired 3 times')
  })
```

#### `emit(event, data)`
Emit an event with optional data:

```js
Event.emit('new::user', user)
```

#### `fire(event, data)`
The `fire` method aliases the [emit](#emitevent-data) method.

#### `removeListener(event, listener)`
Remove listener(s) for a given event:

```js
Event.on('new::user', 'User.registered')

// later remove it
Event.removeListener('new::user', 'User.registered')
```

> NOTE: You must bind an IoC container reference to remove it later.

#### `off(event, listener)`
The `off` method aliases the [removeListener](#removelistenerevent-listener) method.

#### `removeAllListeners(event)`
Remove all listeners for a given event:

```js
Event.removeAllListeners()
```

#### `listenersCount(event)`
Return the number of listeners for a given event:

```js
Event.listenersCount('new::user')
```

#### `getListeners(event)`
Return an array of listeners for a given event:

```js
Event.getListeners('new::user')
```

#### `hasListeners(event)`
Return a `boolean` indicating whether there are any listeners for a given event:

```js
Event.hasListeners('new::user')
```
