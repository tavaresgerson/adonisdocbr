---
title: Request
category: basics
---

# Request

This guide outlines how to use the [HTTP Request](https://github.com/adonisjs/adonis-framework/blob/develop/src/Request/index.js) object to read request data.

> TIP: The Node.js raw `req` object can be accessed via `request.request`.

AdonisJs passes the current HTTP request object as part of the link:request-lifecycle#_http_context[HTTP Context] which is sent to all route handlers and middleware:

```js
Route.get('/', ({ request }) => {
  //
})
```

In the example above, we use [ES6 destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to get the `request` object from the passed HTTP context object.

## Request body
The request object offers a number of helpful methods to read the request body.

First, make sure you've installed the **BodyParser** middleware.

If not, follow the steps below.

### Setting up BodyParser
NOTE: Fullstack and API only boilerplates come pre-configured with BodyParser middleware.


Run the BodyParser installation command:

```bash
adonis install @adonisjs/bodyparser
```

Then, register the provider inside the `start/app.js` file:

```js
// .start/app.js

const providers = [
  '@adonisjs/bodyparser/providers/BodyParserProvider'
]
```

Finally, register the global middleware inside the `start/kernel.js` file:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/BodyParser'
]
```

### Body methods
The following list of methods can be used to read the request body.

#### `all`
Returns an object containing all request data (merges query params and request body data):

```js
const all = request.all()
```

#### `get`
Returns an object containing query params data:

```js
const query = request.get()
```

#### `post`
Returns an object containing request body data:

```js
const body = request.post()
```

#### `raw`
Returns raw body data as a string:

```js
const raw = request.raw()
```

> NOTE: If raw data is JSON and `Content-type: application/json` is set, BodyParser will parse it smartly and return it as part of the `post` method.

#### `only`
Returns an object with only the specified keys:

```js
const data = request.only(['username', 'email', 'age'])
```

#### `except`
Returns an object with everything except the specified keys (opposite of only):

```js
const data = request.except(['csrf_token', 'submit'])
```

#### `input`
Get the value of a given key (if it doesn't exist, return the `default` value):

```js
const drink = request.input('drink')

// with default value
const drink = request.input('drink', 'coffee')
```

## Request collection
Quite often you may want to handle HTML forms that submit an array of data over key/value pairs.

For example, the following form creates multiple users at once:

```html
<form method="POST" action="/users">

  <input type="text" name="username[0]" />
  <input type="text" name="age[0]" />

  <input type="text" name="username[1]" />
  <input type="text" name="age[1]" />

</form>
```

Let's say we want to get the username and age inside the controller:

```js
const users = request.only(['username', 'age'])

// output
{ username: ['virk', 'nikk'], age: [26, 25] }
```

The example above can't save to the database as it's not in the right format.

Using `request.collect` we can format it so it's ready to save to the database:

```js
const users = request.collect(['username', 'age'])

// output
[{ username: 'virk', age: 26 }, { username: 'nikk', age: 25 }]

// save to db
await User.createMany(users)
```

## Headers
You can read headers from the request using one of the following methods.

#### `header`
The header value for a given key (optionally with default value):

```js
var auth = request.header('authorization')

// case-insensitive
var auth = request.header('Authorization')

// with default value
const other = request.header('some-other-header', 'default')
```

#### `headers`
Returns an object of all header data:

```js
const headers = request.headers()
```

## Cookies
You can read cookies from the request using one of the following methods.

#### `cookie`
The cookie value for a given key (optionally with default value):

```js
const cartTotal = request.cookie('cart_total')

// with default value
const cartTotal = request.cookie('cart_total', 0)
```

#### `cookies`
Returns an object of all cookie data:

```js
const cookies = request.cookies()
```

The following methods are used to read cookies set on client side.

#### `plainCookie`
The raw cookie value for a given key (optionally with default value):

```js
const jsCookie = request.plainCookie('cart_total')

// with default value
const jsCookie = request.plainCookie('cart_total', 0)
```

#### `plainCookies`
Returns an object of all raw cookie data:

```js
const plainCookies = request.plainCookies()
```

## Content negotiation
[Content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) is a way for the server and client to decide upon the best response type to be returned from the server.

Web servers don't only serve web pages – they also have to deal with API responses served as *JSON*, *XML*, etc.

Instead of creating separate URLs for each content type, the consumer can ask the server to return the response in a specific format.

To construct the response in a specific format, the server needs to know the requested format first. This can be done using the `accepts` method.

#### `accepts`
Reads the `Accept` header to help determine the response format:

```js
const bestFormat = request.accepts(['json', 'html'])

if (bestFormat === 'json') {
  return response.json(users)
}

return view.render('users.list', { users })
```

#### `language`
Language can also be negotiated based upon the `Accept-Language` header:

```js
const language = request.language(['en', 'fr'])
```

## Request methods

Below is a list of all request methods and their example usages.

#### `url`
Returns the current request url:

```js
const url = request.url()
```

#### `originalUrl`
Returns the full current request url with query strings:

```js
const url = request.originalUrl()
```

#### `method`
Returns the HTTP request method:

```js
const method = request.method()
```

#### `intended`
Since AdonisJs allows [method spoofing](#method-spoofing), you can fetch the actual method using the `intended` method:

```js
const method = request.intended()
```

#### `ip`
Returns the most trusted ip address for the user:

```js
const ip = request.ip()
```

#### `ips`
Returns an array of ips from most to the least trusted (removes the default ip address, which can be accessed via the `ip` method):

```js
const ips = request.ips()
```

#### `subdomains`
Returns a list of request subdomains (removes `www` from the list):

```js
const subdomains = request.subdomains()
```

#### `ajax`
Checks for `X-Requested-With` header to determine if the request is ajax or not:

```js
if (request.ajax()) {
  // do something
}
```

#### `pjax`
[Pjax](https://github.com/defunkt/jquery-pjax) is an evolved way to use Ajax to deliver better user experiences for traditional apps. In the Rails world, it is known as Turbolinks.

This methods looks for the `X-PJAX` header to identify if a request is pjax or not:

```js
if (request.pjax()) {
  // do something
}
```

#### `hostname`
Returns the request hostname:

```js
const hostname = request.hostname()
```

#### `protocol`
Return the request protocol:

```js
const protocol = request.protocol()
```

#### `match`
Returns whether the passed set of expressions match the current request URL:

```js
// current request url - posts/1

request.match(['posts/:id']) // returns true
```

#### `hasBody`
A boolean indicating if the request has a post body (mainly used by the BodyParser to determine whether or not to parse the body):

```js
if (request.hasBody()) {
  // do something
}
```

#### `is`
The `is` method returns the best matching content type for the current request.

The check is entirely based upon the `content-type` header:

```js
// assuming content-type is `application/json`

request.is(['json', 'html']) // returns - json

request.is(['application/*']) // returns - application/json
```

## Method spoofing
HTML forms are only capable of making `GET` and `POST` requests, which means you cannot utilize the REST conventions of other HTTP methods like `PUT`, `DELETE` and so on.

AdonisJs makes it simple to bypass the request method by adding a `_method` parameter to your query string, executing the correct route for you automatically:

```js
// .start/routes.js

Route.put('users', 'UserController.update')
```

```html
<form method="POST" action="/users?_method=PUT">
```

The above example works in the following cases:

1. The original request method is `POST`.
2. `allowMethodSpoofing` is enabled inside the `config/app.js` file.

## Extending Request
It is also possible to extend the `Request` prototype by adding your own methods, known as macros.

> NOTE: Since the code to extend `Request` need only execute once, you could use [providers](/original/markdown/02-Concept/03-service-providers.md) or [Ignitor hooks](/original/markdown/02-Concept/05-ignitor.md) to do so. Read [Extending the Core](/original/markdown/06-Digging-Deeper/03-Extending-the-Core.adoc) for more information.

```js
const Request = use('Adonis/Src/Request')

Request.macro('cartValue', function () {
  return this.cookie('cartValue', 0)
})
```
