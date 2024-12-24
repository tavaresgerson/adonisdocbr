# Response

To finish an HTTP request, you must explicitly end the response. AdonisJs *Response* class instance makes it easier for you render nunjucks views or send formatted JSON for building RESTful API's.

> TIP: You can access Node.js raw *response object* as `response.response`.

## Basic Example
Response instance is passed along `request` instance to all the controllers and route closures, and same is used to render views or make JSON response

### Rendering Views
```js
Route
  .get('/', function * (request, response) {
    yield response.sendView('welcome') // resources/views/welcome.njk
  })
```

### JSON Response
```js
Route
  .get('users', function * (request, response) {
    const users = yield User.all() // fetch users
    response.json(users)
  })
```

## Response Methods
Below is the list of methods to send HTTP response, headers, and cookies.

#### send(body)
Send method will end the request by sending the given data. You can send different data types, and AdonisJs knows how to parse them and set correct headers for them.

```js
response.send('Hello world')
// or
response.send({ name: 'doe' })
// or
response.send(1)
```

### status(code)
Set HTTP status code a given request. Which is 200 by default.

```js
response.status(201).send('Created')
```

#### json(body)
Creating a JSON response with Content-Type header set to *application/json*.

```js
response.json({ name: 'doe' })
```

#### jsonp(body)
Creates a JSONP response with Content-Type header set to *text/javascript*. It will make use of callback defined as the query string or will fallback to `http.jsonpCallback` defined inside `config/app.js` file.

```js
response.jsonp({ name: 'doe' })
```

#### vary(field)
Adds vary header to the response. Understanding the need of Vary is quite broad. Learn more about it [here](https://www.fastly.com/blog/best-practices-for-using-the-vary-header)

```js
response.vary('Accept-Encoding')
```

#### sendView(path)
Render a nunjucks view.

```js
yield response.sendView('welcome')
```

#### download(filePath)
Stream a file for download.

```js
response.download(Helpers.storagePath('report.xls'))
```

#### attachment(filePath, [name], [disposition=attachment])
Force download file by setting *Content-Disposition* header.

```js
response.attachment(Helpers.storagePath('report.xls'), 'Daily-Report.xls')
```

## Response Headers

#### header(key, value)
Append header to the response.

```js
response.header('Content-type', 'application/json')
```

#### removeHeader(key)
Remove existing header from the response.

```js
response.removeHeader('Accept')
```

## Redirects

#### location(url)
Set *Location* header for the response. You can also pass the `back` keyword, which will use the request *Referrer* header.

```js
response.location('/signup')
// or
response.location('back')
```

#### redirect(url, [status=302])
Finish the response by redirecting the request to the given URL.

```js
response.redirect('back')
// or
response.redirect('/welcome', 301)
```

#### route(route, data, status)
Redirect to a defined route.

> NOTE: If AdonisJs cannot find a route with the name given it will consider it as an url and redirect to it.

```js
Route
  .get('users/:id', '...')
  .as('profile')

response.route('profile', {id: 1})
// redirects to /user/1
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
Quite often you have the requirement of extending the `Response` prototype by attaching new methods. Same can be done by defining a macro on the Response class.

#### Application Specific
If your macros are specific to your application only, then make use of the `app/Listeners/Http.js` file to listen for the *start* event and add a custom macro.

```js
// app/Listeners/Http.js

Http.onStart = function () {
  const Response = use('Adonis/Src/Response')
  Response.macro('sendStatus', function (status) {
    this.status(status).send(status)
  })
}
```

#### Via Provider
If you are writing a module/addon for AdonisJs, you can add a macro inside the `boot` method of your service provider.

```js
const ServiceProvider = require('adonis-fold').ServiceProvider

class MyServiceProvider extends ServiceProvider {

  boot () {
    const Response = use('Adonis/Src/Response')
    Response.macro('sendStatus', function (status) {
      this.status(status).send(status)
    })
  }

  * register () {
    // register bindings
  }

}
```

Defined macros can be used like any other `response` method.

```js
response.sendStatus(404)
```
