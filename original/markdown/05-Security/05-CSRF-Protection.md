---
title: CSRF Protection
category: security
---

# CSRF Protection

[Cross-Site Request Forgery (CSRF)](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)) allows an attacker to perform actions on behalf of another user without their knowledge or permission.

AdonisJs protects your application from CSRF attacks by denying unidentified requests. HTTP requests with *POST, PUT and DELETE* methods are checked to make sure that the right people from the right place invoke these requests.

## Setup
Install the `shield` provider via npm by executing the following command:

```bash
adonis install @adonisjs/shield
```

Next, register the provider inside the `start/app.js` file:

```js
// .start/app.js

const providers = [
  '@adonisjs/shield/providers/ShieldProvider'
]
```

Finally, register the global middleware inside the `start/kernel.js` file:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/Shield'
]
```

> NOTE: Shield middleware relies on [sessions](/original/markdown/04-Basics/07-Sessions.md), so make sure they are set up correctly.

## Config
The configuration for CSRF is saved inside the `config/shield.js` file:

```js
// .config/shield.js

csrf: {
  enable: true,
  methods: ['POST', 'PUT', 'DELETE'],
  filterUris: ['/user/:id'],
  cookieOptions: {}
}
```

| Key           | Value     | Description                                                                                                   |
|---------------|-----------|---------------------------------------------------------------------------------------------------------------|
| enable        | Boolean   | A boolean to turn on/off CSRF for the entire application.                                                     |
| methods       | Array     | HTTP verbs to be protected by CSRF. Consider adding all verbs which allow the end user to add or modify data. |
| filterUris    | Array     | A list of URLs/Routes to ignore. You can pass actual route definitions or a regular expression to match.      |
| cookieOptions | Object    | An object of [cookie options](https://www.npmjs.com/package/cookie#options-1).                                |

## How It Works

1. AdonisJs creates a *CSRF secret* for each user visiting your website.
2. A corresponding token for the secret is generated for each request and passed to all views as `csrfToken` and `csrfField()` globals.
3. Also, the same token is set to a cookie with key `XSRF-TOKEN`. Frontend Frameworks like *AngularJs* automatically read this cookie and send it along with each Ajax request.
4. Whenever a *POST*, *PUT* or *DELETE* requests comes, the middleware verifies the token with the secret to make sure it is valid.

> NOTE: If you are using the `XSRF-TOKEN` cookie value, ensure the header key is `X-XSRF-TOKEN`.

## View Helpers
You can access the CSRF token using one of the following view helpers to ensure it gets set inside your forms.

To send the token along with each request, you need access to it. There are a few ways to get access to the CSRF token.

#### `csrfField`

```edge
{{ csrfField() }}
```

```html
<!-- .Output -->

<input type="hidden" name="_csrf" value="xxxxxx">
```

#### `csrfToken`
The `csrfToken` helper returns the raw value of the token:

```edge
{{ csrfToken }}
```

## Exception handling
On validation failure, an exception is thrown with the code *EBADCSRFTOKEN*.

Ensure you listen for this exception and return an appropriate response, like so:

```js
// .app/Exceptions/Handler.js

class ExceptionHandler {
  async handle (error, { response }) {
    if (error.code === 'EBADCSRFTOKEN') {
      response.forbidden('Cannot process your request.')
      return
    }
  }
}
```
