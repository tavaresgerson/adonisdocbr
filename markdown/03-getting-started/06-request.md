# Request

AdonisJs makes it super easy to access HTTP request information. All controller methods and route closures receive an instance of the `Request` class, which is a sugared layer on top of [Node.js HTTP request](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_class_http_server).

> TIP: You can access Node.js raw *request object* as `request.request`.

## Basic Example
Let's take the classic case of reading request body for a given HTTP request.

```js
const Route = use('Route')

Route.get('posts', function * (request, response) {
  const body = request.all()

  // cherry picking fields
  const body = request.only('title', 'description', 'categories')
})
```

## Request Methods
Below is the list of all the available methods on the `Request` instance.

#### all()
Returns all values extracted from query strings and the request body.

```js
const data = request.all()
```

#### input(key, [defaultValue])
Returns the value of query strings and request body for a given key. If the value does not exist, the default value will be returned.

```js
const name = request.input('name')
const subscribe = request.input('subscribe', 'yes')
```

#### only(...keys)
Similar to all, but returns an object with cherry picked values of defined keys. `null` will be returned for non-existing keys.

```js
const data = request.only('name', 'email', 'age')

/* returns
{
  name: '..',
  email: '..',
  age: '..'
}
*/
```

#### except(...keys)
Opposite of [only](#onlykeys)

```js
const data = request.except('_csrf', 'submit')
```

#### get
Returns a serialized object of query strings.

```js
const data = request.get()
```

#### post
Returns a serialized object of the request body.

```js
const data = request.post()
```

#### fresh
Tells whether the request is fresh or not by checking ETag and expires header.

```js
request.fresh()
```

#### stale
Opposite of [fresh](#fresh)

```js
request.stale()
```

#### ip
Returns most trusted IP address for a given request. If your application is behind a proxy server like Nginx, make sure to enable `http.trustProxy` inside the `config/app.js` file.

```js
request.ip()
```

#### ips
Returns an array of IP addresses sorted from most to least trusted.

```js
request.ips()
```

#### secure
Tells whether the request is served over HTTPS or not.

```js
request.secure()
```

#### subdomains
Returns an array of subdomains for a given URL. For example, `api.example.org` will have the subdomain as `['api']`.

```js
request.subdomains()
```

#### ajax
Returns whether the current request is made using *Ajax(XMLHttpRequest)* or not.

```js
request.ajax()
```

#### pjax
[Pjax](https://www.google.co.in/search?q=Pjax#q=What+is+Pjax) is a hybrid ajax request. If you are from Ruby on Rails world, it is quite similar to Turbolinks.

#### hostname
Returns request hostname.

```js
request.hostname()
```

#### url
Returns request current URL. It will trim query string.

```js
// url - http://foo.com/users?orderBy=desc&limit=10

request.url()

// returns - http://foo.com/users
```

#### originalUrl
```js
request.originalUrl()
```

#### method
```js
request.method()
```

#### param(key, [defaultValue])
Returns route parameter for a given key. Learn more about route parameters [here](/markdown/03-getting-started//05-routing.md#route-parameters).

#### params
Returns all params as an object.

```js
request.params()
```

#### format
Returns current format for a given request. In order to make it work, you need to define [route formats](/markdown/03-getting-started/05-routing.md#content-negotiation-via-routes).

```js
request.format()
```

#### match(...keys)
Returns a boolean indicating whether the current request URL matches any of the given patterns.

```js
// url - /user/1

request.match('/users/:id') // true
request.match('/users/all') // false
request.match('/users/all', '/user/(.+)') // true
```

#### hasBody
Returns whether the request has the body or not.

```js
request.hasBody()
```

## Headers
You can make use of the below methods to read request headers

#### header(key, [defaultValue])
Returns value for a given header key or returns the default value.

```js
const csrfToken = request.header('CSRF-TOKEN')
// or
const time = request.header('x-time', new Date().getTime())
```

#### headers
Returns all headers as an object.

```js
request.headers()
```

## Request Collection
Quite often applications have requirements of saving multiple entries to the database using HTML forms. Let's take an example of saving multiple users.

```html
<form method="POST" action="/users">
  <div class="row">
    <h2> User 1 </h2>
    <input type="email" name="email[]" />
    <input type="password" name="password[]" />
  </div>

  <div class="row">
    <h2> User 2 </h2>
    <input type="email" name="email[]" />
    <input type="password" name="password[]" />
  </div>

  <button type="submit"> Create Users </button>
</form>
```

Above we defined the `email[]` and `password[]` as an array so that we can submit multiple users within a single request and the input on the server will look quite similar the below format.

```js
// Received

{
  email: ['bar@foo.com', 'baz@foo.com'],
  password: ['secret', 'secret1']
}
```

Until this point, the form is doing what it is supposed to do. Whereas the data received by the server is quite hard to process to get it into the right format.

```js
// Expected

[
  {
    email: 'bar@foo.com',
    password: 'secret'
  },
  {
    email: 'baz@foo.com',
    password: 'secret1'
  }
]
```

Of course, you can loop through the original input and create a new array as per the expected output, but that seems to be too much for a general use case. AdonisJs makes the entire process seamless by introducing a helper method called `collect`.

#### collect(...keys)
```js
const users = request.collect('email', 'password')
const savedUsers = yield User.createMany(users)
```

## Content Negotiation
Content Negotiation is a way to find the best response type for a given request. The end-user makes use of HTTP headers to define the response type they are expecting from the server.

> TIP: You can also make use of Routes to define explicit return types. Learn more about link:routing#_content_negotiation_via_routes[content negotiation via routes].

#### is(...keys)
Returns whether a request is one of the given types. This method will parse the request Content-type header.

```js
const isPlain = request.is('html', 'plain')
```

#### accepts(...keys)
Checks the `Accept` header to negotiate the best response type for a given HTTP request.

```js
const type = request.accepts('json', 'html')

switch (type) {
  case 'json':
    response.json({hello:"world"})
    break
  case 'html':
    response.send('<h1>Hello world</h1>')
    break
}
```

## Extending Request
Quite often you have the requirement of extending the `Request` prototype by attaching new methods. Same can be done by defining a macro on the Request class.

#### Application Specific
If your macros are specific to your application only, then make use of the `app/Listeners/Http.js` file to listen for the *start* event and add a custom macro.

```js
// app/Listeners/Http.js

Http.onStart = function () {
  const Request = use('Adonis/Src/Request')
  Request.macro('cartValue', function () {
    return this.cookie('cartValue', 0)
  })
}
```

#### Via Provider
If you are writing a module/addon for AdonisJs, you can add a macro inside the `boot` method of your service provider.

```js
const ServiceProvider = require('adonis-fold').ServiceProvider

class MyServiceProvider extends ServiceProvider {

  boot () {
    const Request = use('Adonis/Src/Request')
    Request.macro('cartValue', function () {
      return this.cookie('cartValue', 0)
    })
  }

  * register () {
    // register bindings
  }

}
```

Defined macros can be used like any other `request` method.

```js
const cartValue = request.cartValue()
```
