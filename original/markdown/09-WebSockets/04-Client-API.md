---
title: Client API
category: websockets
---

# Client API

This guide covers the JavaScript *WebSocket client* used to connect to the [WebSocket server](/original/markdown/09-WebSockets/03-Server-API.md).

## Installation

### NPM
As the *WebSocket client* is not installed by default, we need to pull it from `npm`:

```bash
npm i @adonisjs/websocket-client
```

> TIP: Once installed, bundle the package using Webpack, Rollup, etc.

Then, import the WebSocket client like so:

```js
import Ws from '@adonisjs/websocket-client'
const ws = Ws('ws://localhost:3333')
```

### UNPKG

Alternatively, source the UMD bundle directly from [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/@adonisjs/websocket-client"></script>
<script>
  const ws = adonis.Ws('ws://localhost:3333')
</script>
```

## Polyfill
The module build requires the [regenerator-runtime](https://babeljs.io/docs/plugins/transform-regenerator) polyfill (add it via [Babel](https://babeljs.io)).

## Production Builds
As the development build contains a number of log statements, we recommend defining `NODE_ENV` via [Webpack DefinePlugin](https://webpack.js.org/plugins/define-plugin/) or [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace).

## Getting Started
Connect to a WebSocket server via the client like so:

```js
const ws = Ws(url, options)

// connect to the server
ws.connect()
```

> NOTE: The `url` parameter will fallback to the current hostname if a full `ws://` url value is omitted.

#### `options`

| Key                     | Default Value | Description |
|-------------------------|---------------|-------------|
| `path`                  | `adonis-ws`   | The path used to make the connection (only change if you changed it on the server). |
| `reconnection`          | `true`        | Whether to reconnect automatically after disconnect.  |
| `reconnectionAttempts`  | `10`          | Number of reconnection attempts before abandoning. |
| `reconnectionDelay`     | `1000`        | How long to wait before reconnecting. The value will be used as `n x delay`, where `n` is the current value of reconnection attempts. |
| `query`                 | `null`        | Query string to pass to the connection URL (also accepts an object). |
| `encoder`               | `JsonEncoder` | The encoder to use (the same encoder will be required on the server). |

To manage your application state, listen for the `open`/`close` events:

```js
let isConnected = false

ws.on('open', () => {
  isConnected = true
})

ws.on('close', () => {
  isConnected = false
})
```

Once connected, subscribe to different/multiple topics:

```js
const chat = ws.subscribe('chat')

chat.on('ready', () => {
  chat.emit('message', 'hello')
})

chat.on('error', (error) => {
  console.log(error)
})

chat.on('close', () => {
})
```

## Subscription API
The following methods are used to send/receive messages.

#### `emit(event, data)`
Send event to the server:

```js
chat.emit('message', {
  body: 'hello',
  user: 'virk'
})
```

#### `on(event, callback)`
Bind event listener:

```js
chat.on('message', () => {})
chat.on('new:user', () => {})
```

#### `off(event, callback)`
Remove event listener:

```js
const messageHandler = function () {}

chat.on('message', messageHandler)
chat.off('message', messageHandler)
```

#### `close()`
Initiate request to close the subscription:

```js
chat.on('close', () => {
  // server acknowledged close
})

chat.close()
```

> NOTE: Listen for the [close event](#close-2) to confirm the subscription closed.

#### `leaveError`
Emitted when the server refuses to close the subscription:

```js
chat.on('leaveError', (response) => {
  console.log(response)
})
```

#### `error`
Emitted when an error occurs on the TCP connection:

```js
chat.on('error', (event) => {
})
```

> NOTE: Preferably, listen for the `ws.on('error')` event instead.

#### `close`
Emitted when the subscription is closed:

```js
chat.on('close', () => {
})
```

## Ws API
The following methods are available on a single `ws` connection.

#### `connect`
Initiate the connection:

```js
ws.connect()
```

#### `close`
Forcefully close the connection:

```js
ws.close()
```

> NOTE: Removes all subscriptions and does not trigger a reconnection.

#### `getSubscription(topic)`
Returns the subscription instance for a given topic:

```js
ws.subscribe('chat')

ws.getSubscription('chat').on('message', () => {
})
```

> NOTE: If no subscriptions for the given topic, returns `null`.

#### `subscribe(topic)`
Subscribe to a topic:

```js
const chat = ws.subscribe('chat')
```

> NOTE: Subscribing to the same topic twice raises an exception.

## Authentication
The AdonisJs WebSocket client makes it simple to authenticate users.

Auth credentials are only passed once to the server during the initial connection, so the same information can be reused to allow/disallow channel subscriptions.

> NOTE: If your application uses sessions, users will be authenticated automatically providing they have a valid session.

#### `withBasicAuth(username, password)`
Authenticate via basic auth:

```js
const ws = Ws(url, options)

ws
  .withBasicAuth(username, password)
  .connect()
```

#### `withApiToken(token)`
Authenticate via api token:

```js
const ws = Ws(url, options)

ws
  .withApiToken(token)
  .connect()
```

#### `withJwtToken(token)`
Authenticate via JWT token:

```js
const ws = Ws(url, options)

ws
  .withJwtToken(token)
  .connect()
```

### User Information

On the server, access user information via the `auth` object:

```js
// .start/socket.js

Ws.channel('chat', ({ auth }) => {
  console.log(auth.user)
})
```

> NOTE: [Required middleware](/original/markdown/09-WebSockets/03-Server-API.md#registering-middleware) must be set up to access the `auth` object.

### Channel Middleware

To authenticate connections, ensure the `auth` named middleware is applied:

```js
// .start/socket.js

Ws.channel('chat', ({ auth }) => {
  console.log(auth.user)
}).middleware(['auth'])
```
