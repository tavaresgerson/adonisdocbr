---
title: Response
category: basics
---

# Response

This guide outlines how to use the [HTTP Response](https://github.com/adonisjs/adonis-framework/blob/develop/src/Response/index.js) object to make and return responses.

> TIP: The Node.js raw `res` object can be accessed as `response.response`.

AdonisJs passes the current HTTP response object as part of the [HTTP Context](/original/markdown/02-Concept/01-Request-Lifecycle.md) which is sent to all route handlers and middleware.

```js
// .start/routes.js

Route.get('/', ({ response }) => {
  response.send('hello world')
})
```

## Basic example
The following example returns an array of users in JSON format:

```js
// .start/routes.js

Route.get('/users', async ({ response }) => {
  const users = await User.all()
  response.send(users)
})
```

The `response.json` method can also be used as an alias to `response.send`:

```js
// .start/routes.js

Route.get('/users', async ({ response }) => {
  response.json(await User.all())
})
```

## Making response
As of 4.0, you can also `return` values from the route closure or controller method instead of using dedicated `response` methods.

The following is equivalent to `response.send` or `response.json` but may feel more natural with a simple return statement:

```js
// .start/routes.js

Route.get('/', async () => {
  return await User.all()
})
```

### Avoid callbacks
Since the request/response lifecycle allows you to return values or call dedicated response methods, AdonisJs discourages the usage of callbacks entirely.

The following response sent inside a callback will not work:

```js
// .start/routes.js

Route.get('/', async ({ response }) => {
  fs.readFile('somefile', (error, contents) => {
    response.send(contents)
  })
})
```

The reason the above code won't work is because as soon as the route handler executes, AdonisJs ends the response – as the callback would get executed later, an error will occur!

### Promisfying callbacks
What you can do instead is **promisify** your callback and use it with `await`:

```js
// .start/routes.js

const fs = use('fs')
const Helpers = use('Helpers')
const readFile = Helpers.promisify(fs.readFile)

Route.get('/', async ({ response }) => {
  return await readFile('somefile')
})
```

JavaScript has a rich ecosystem, and it is *100% possible* to write code without callbacks just by promisfying them, and as a community, we want to encourage this approach.

### But… I like my callbacks!
If you still prefer callbacks, AdonisJs provides a way to continue using them.

Simply instruct the `response` object not to end implicitly:

```js
// .start/routes.js

Route.get('/', async ({ response }) => {
  response.implicitEnd = false

  fs.readFile('somefile', (error, contents) => {
    response.send(contents)
  })
})
```

## Headers
Use the following methods to set/remove response headers.

#### `header`
Set a header value:

```js
response.header('Content-type', 'application/json')
```

#### `safeHeader`
Only set a header value if it does not already exist:

```js
response.safeHeader('Content-type', 'application/json')
```

#### `removeHeader`
Remove an existing header:

```js
response.removeHeader('Content-type')
```

#### `type`
Set the `Content-Type` header:

```js
response.type('application/json')
```

## Cookies
Use the following methods to set/remove response cookies.

#### `cookie`
Set a cookie value:

```js
response.cookie('cartTotal', 20)
```

#### `clearCookie`
Remove an existing cookie value (by setting its expiry in the past):

```js
response.clearCookie('cartTotal')
```

#### `plainCookie`
Since all cookies are encrypted and signed, it is not possible to read them from front-end JavaScript code.

In that case, may want to set a plain cookie instead:

```js
// not signed or encrypted
response.plainCookie('cartTotal', 20)
```

## Redirects
Use one of the following methods to redirect requests to a different URL.

#### `redirect(url, [sendParams = false], [status = 302])`
Redirect request to a different url (by default it will set the status as `302`):

```js
response.redirect('/url')

// or
response.redirect('/url', false, 301)
```

You can send the current request parameters to the redirect location by setting the second parameter to `true`:

```js
response.redirect('/url', true)
```

#### `route(route, [data], [domain], [sendParams = false], [status = 302])`
Redirect to a route (via route name or controller method):


```js
// .start/routes.js

Route
  .get('users/:id', 'UserController.show')
  .as('profile')
```

```js
// via route name
response.route('profile', { id: 1 })

// via controller method
response.route('UserController.show', { id: 1 })
```

Since AdonisJs allows registering routes for [multiple domains](/original/markdown/04-Basics/01-Routing.md), you can also instruct this method to build the URL for a specific domain:

```js
response.route('posts', { id: 1 }, 'blog.adonisjs.com')
```

## Attachments
The response object makes it simple to stream files from your server to the client.

#### `download(filePath)`
Stream the file to the client:

```js
response.download(Helpers.tmpPath('uploads/avatar.jpg'))
```

This method does not force the client to download the file as an attachment (for example, browsers may choose to display the file in a new window).

#### `attachment(filePath, [name], [disposition])`
Force download the file:

```js
response.attachment(
  Helpers.tmpPath('uploads/avatar.jpg')
)
```

Download with a custom name:

```js
response.attachment(
  Helpers.tmpPath('uploads/avatar.jpg'),
  'myAvatar.jpg' // custom name
)
```

## Descriptive Methods
AdonisJs ships with a bunch of descriptive messages, which are more readable than the `send` method. Let's take this example.

```js
response.unauthorized('Login First')
```

is more readable than

```js
response.status(401).send('Login First')
```

Below is the list of all descriptive methods and their corresponding HTTP statuses. Check [httpstatuses.com](https://httpstatuses.com) to learn more about HTTP status codes.

| Method                        | Http Response Status  |
|-------------------------------|-----------------------|
| continue                      | 100                   |
| switchingProtocols            | 101                   |
| ok                            | 200                   |
| created                       | 201                   |
| accepted                      | 202                   |
| nonAuthoritativeInformation   | 203                   |
| noContent                     | 204                   |
| resetContent                  | 205                   |
| partialContent                | 206                   |
| multipleChoices               | 300                   |
| movedPermanently              | 301                   |
| found                         | 302                   |
| seeOther                      | 303                   |
| notModified                   | 304                   |
| useProxy                      | 305                   |
| temporaryRedirect             | 307                   |
| badRequest                    | 400                   |
| unauthorized                  | 401                   |
| paymentRequired               | 402                   |
| forbidden                     | 403                   |
| notFound                      | 404                   |
| methodNotAllowed              | 405                   |
| notAcceptable                 | 406                   |
| proxyAuthenticationRequired   | 407                   |
| requestTimeout                | 408                   |
| conflict                      | 409                   |
| gone                          | 410                   |
| lengthRequired                | 411                   |
| preconditionFailed            | 412                   |
| requestEntityTooLarge         | 413                   |
| requestUriTooLong             | 414                   |
| unsupportedMediaType          | 415                   |
| requestedRangeNotSatisfiable  | 416                   |
| expectationFailed             | 417                   |
| unprocessableEntity           | 422                   |
| tooManyRequests               | 429                   |
| internalServerError           | 500                   |
| notImplemented                | 501                   |
| badGateway                    | 502                   |
| serviceUnavailable            | 503                   |
| gatewayTimeout                | 504                   |
| httpVersionNotSupported       | 505                   |

## Extending Response
It is also possible to extend the `Response` prototype by adding your own methods, known as macros.

> NOTE: Since the code to extend `Response` needs to execute only once, you could use [providers](/original/markdown/02-Concept/03-service-providers.md) or [Ignitor hooks](/original/markdown/02-Concept/05-ignitor.md) to do so. Read [Extending the Core](/original/markdown/06-Digging-Deeper/03-Extending-the-Core.adoc) for more information.

```js
const Response = use('Adonis/Src/Response')

Response.macro('sendStatus', function (status) {
  this.status(status).send(status)
})
```
