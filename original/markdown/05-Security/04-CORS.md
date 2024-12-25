---
title: CORS
category: security
---

# CORS

Cross-Origin Resource Sharing (CORS) is a way to allow incoming HTTP requests from different domains.

It is very common in AJAX applications where the browser blocks all cross-domain requests if the server does not authorize them.

Read more about CORS [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

## Setup
Install the middleware provider via npm by executing the following command:

```bash
adonis install @adonisjs/cors
```

Next, register the provider inside the `start/app.js` file:

```js
// .start/app.js

const providers = [
  '@adonisjs/cors/providers/CorsProvider'
]
```

Finally, register the middleware inside the `start/kernel.js` file:

```js
// .start/kernel.js

Server
  .use(['Adonis/Middleware/Cors'])
```

## Config
The configuration for CORS is defined inside the `config/cors.js` file and accepts the following options.

#### `origin`
The origin(s) to be allowed for making cross-domain requests.

You can return one of the following values:

- A boolean `true` or `false` to deny the current request origin.
- A comma-separated strings of domains to be allowed.
- An array of domains to be allowed.
- A function, which receives the current request origin. Here you can compute whether or not the origin is allowed by returning true or false:
  ```js
  //.config/cors.js

  origin: function (currentOrigin) {
    return currentOrigin === 'mywebsite.com'
  }
  ```

For all other options, please inspect the comments inside the [config file](https://github.com/adonisjs/adonis-cors/blob/develop/config/cors.js#L3).
