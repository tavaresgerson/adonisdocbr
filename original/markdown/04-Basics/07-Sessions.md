---
title: Sessions
category: basics
---

# Sessions

AdonisJs has first-class session support with a variety of inbuilt drivers to efficiently manage and store sessions.

In this guide, we learn how to configure and use these different session drivers.

## Setup
If the session provider is not already set up, follow the instructions below.

First, run the `adonis` command to download the session provider:

```bash
adonis install @adonisjs/session
```

The above command also creates the `config/session.js` file and displays a small set of instructions to help complete your set up.

Next, register the session provider inside the `start/app.js` file:

```js
// .start/app.js

const providers = [
  '@adonisjs/session/providers/SessionProvider'
]
```

Finally, register the session middleware inside the `start/kernel.js` file:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/Session'
]
```

## Supported drivers
Below is the list of drivers supported by the session provider. You can change the current driver inside the `config/session.js` file.

> NOTE: The Redis driver requires the `@adonisjs/redis` package (see the [Redis](/original/markdown/07-Database/05-Redis.md) section for installation instructions).

| Name    | Config key  | Description |
|---------|-------------|-------------|
| Cookie  | cookie      | Saves session values in encrypted cookies. |
| File    | file        | Saves session values in a file on a server (should not be used if you are running AdonisJs on multiple servers and behind a load balancer). |
| Redis   | redis       | Save in [Redis](https://redis.io) (ideal for scaling horizontally). |

## Basic example
The `session` object is passed as part of the [HTTP Context](/original/markdown/02-Concept/01-Request-Lifecycle.md), just like the `request` and `response` objects.

Here's a quick example of how to use sessions during the HTTP lifecycle:

```js
// .start/routes.js

Route.get('/', ({ session, response }) => {
  session.put('username', 'virk')
  response.redirect('/username')
})

Route.get('/username', ({ session }) => {
  return session.get('username') // 'virk'
})
```

## Session methods
Below is a list of all session methods and their example usages.

#### `put(key, value)`
Add a key/value pair to the session store:

```js
session.put('username', 'virk')
```

#### `get(key, [defaultValue])`
Return the value for a given key (accepts an optional default value):

```js
session.get('username')

// default value
session.get('username', 'defaultName')
```

#### `all`
Get everything back as an object from the session store:

```js
session.all()
```

#### `increment(key, [steps])`
Increment the value for a given key (ensure the previous value is a number):

```js
session.increment('counter')

// increment by 5
session.increment('counter', 5)
```

#### `decrement(key, [steps])`
Decrement the value for a given key (ensure the previous value is a number):

```js
session.decrement('counter')

// decrement by 2
session.decrement('counter', 2)
```

#### `forget(key)`
Remove a key/value pair from the session store:

```js
session.forget('username')
```

#### `pull(key, [defaultValue])`
Return (and then remove) a key/value pair from the session store:

```js
const username = session.pull('username') // returns username

session.get('username') // null
```

#### `clear`
Empty the session store:

```js
session.clear()
```

## Flash messages
Flash messages are short-lived session values for a single request only. They are mainly used to *flash form errors*, but can be used for any other purpose.

### HTML form example

Let's say we want to validate submitted user data and redirect back to our form if there are validation errors.

Start with the following HTML form:

```edge
<form method="POST" action="/users">
  {{ csrfField() }}
  <input type="text" name="username" />
  <button type="submit">Submit</button>
</form>
```

Then, register the `/users` route to validate form data:

```js
// .app/routes.js

const { validate } = use('Validator')

Route.post('users', ({ request, session, response }) => {
  const rules = { username: 'required' }
  const validation = await validate(request.all(), rules)

  if (validation.fails()) {
    session.withErrors(validation.messages()).flashAll()
    return response.redirect('back')
  }

  return 'Validation passed'
})
```

Finally, rewrite the HTML form to retrieve flash data using [view helpers](/original/markdown/06-Digging-Deeper/05-Helpers.md):

```edge
<form method="POST" action="/users">
  {{ csrfField() }}
  <input type="text" name="username" value="{{ old('username', '') }}" />
  {{ getErrorFor('username') }}
  <button type="submit">Submit</button>
</form>
```

### Flash methods
Below is a list of all session flash methods and their example usages.

#### `flashAll`
Flash the request form data:

```js
session.flashAll()
```

#### `flashOnly`
Flash only the selected fields:

```js
session.flashOnly(['username', 'email'])
```

#### `flashExcept`
Flash the request form data except the selected fields:

```js
session.flashExcept(['password', 'csrf_token'])
```

#### `withErrors`
Flash with an array of errors:

```js
session
  .withErrors([{ field: 'username', message: 'Error message' }])
  .flashAll()
```

#### `flash`
Flash a custom object:

```js
session.flash({ notification: 'You have been redirected back' })
```

### View helpers
When using flash messages, you can use the following view helpers to read values from the flash session store.

#### `old(key, defaultValue)`
Returns the value for a given key from the flash store:

```js
session.flashOnly(['username'])
```

```edge
<input type="text" name="username" value="{{ old('username', '') }}" />
```

#### `hasErrorFor(key)`
Returns `true` if there is an error for a given field inside the flash store:

```js
session
  .withErrors({ username: 'Username is required' })
  .flashAll()
```

```edge
@if(hasErrorFor('username'))
  // display error
@endif
```

#### `getErrorFor(key)`
Returns the error message for a given field:

```js
session
  .withErrors({ username: 'Username is required' })
  .flashAll()
```

#### `flashMessage(key, defaultValue)`
Returns the flash message for a given key:

```js
session.flash({ notification: 'Update successful!' })
```

```edge
@if(flashMessage('notification'))
  <span>{{ flashMessage('notification') }}</span>
@endif
```

## Session persistence
Session values are persisted in bulk when the request ends. This keeps the request/response performant since you can mutate the session store as many times as you want and a bulk update is only performed at the end.

It is achieved via AdonisJs middleware (see the implementation [here](https://github.com/adonisjs/adonis-session/blob/develop/src/Session/Middleware.js#L89)).

However, there is a caveat. If an exception is thrown, the middleware layer breaks and session values are never committed.

AdonisJs first-party packages handle this gracefully, but you should commit the session manually if you are handling exceptions of your own:

```js
const GE = require('@adonisjs/generic-exceptions')

class MyCustomException extends GE.LogicalException {
  handle (error, { session }) {
    await session.commit()
    // handle exception
  }
}
```
