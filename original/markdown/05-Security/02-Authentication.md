---
title: Authentication
category: security
---

# Authentication

The AdonisJs auth provider is a fully featured system to authenticate HTTP requests using multiple authenticators.

Using authenticators you can build traditional *session based* login systems and secure your *APIs*.

> NOTE: For opinionated user profile management, check out the official [Adonis Persona](https://github.com/adonisjs/adonis-persona) package – a simple, functional service to let you *create*, *verify* and *update* user profiles in AdonisJs.

## Authenticators
Each authenticator is a combination of authentication scheme and serializer.

### Schemes

* Session (`session`)
* Basic Auth (`basic`)
* JWT (`jwt`)
* Personal API Tokens (`api`)

### Serializers

* Lucid (`lucid`)
* Database (`database`)

## Authentication Categories

Authentication is divided into two broad categories: *Stateful* and *Stateless*.

Session-based authentication is considered *Stateful* since logged in users can navigate to different areas of the application without resending their credentials.

*Stateless* authentication requires the user to resend their credentials on each HTTP request, which is very common with APIs.

AdonisJs provides necessary tooling and helpers to manage both types of authentication with ease.

## Password Hashing
The AdonisJs auth provider uses the [Hash](/original/markdown/05-Security/06-Encryption.md) module to verify passwords.

Always [hash your passwords](/original/markdown/08-Lucid-ORM/02-Hooks.md) before saving them to the database.

## Setup
The AdonisJs auth provider comes pre-installed with `fullstack` and `api` boilerplates.

If the auth provider is not already set up, follow the instructions below.

First, run the `adonis` command to download the auth provider:

```bash
adonis install @adonisjs/auth
```

Next, register the auth provider inside the `start/app.js` file:

```js
// .start/app.js

const providers = [
  '@adonisjs/auth/providers/AuthProvider'
]
```

Finally, register the auth middleware inside the `start/kernel.js` file:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/AuthInit'
]

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  guest: 'Adonis/Middleware/AllowGuestOnly'
}
```

## Config
Your authentication configuration is saved inside the `config/auth.js` file.

By default, the `session` authenticator is used to authenticate app requests.

## Basic Example
Let’s start with the example of logging in a user, then only showing them their profile if they are logged in.

First, add the following routes to the `start/routes.js` file:

```js
// .start/routes.js

Route
  .post('login', 'UserController.login')
  .middleware('guest')

Route
  .get('users/:id', 'UserController.show')
  .middleware('auth')
```

Next, create the `UserController` via the `adonis` command:

```bash
adonis make:controller User
```

Add the `login` method to the `UserController`:

```js
// .app/Controllers/Http/UserController.js

class UserController {

  async login ({ auth, request }) {
    const { email, password } = request.all()
    await auth.attempt(email, password)

    return 'Logged in successfully'
  }
}
```

The `login` method above extracts the user's `email` and `password` from the request and logs them in if their credentials are valid.

Finally, add the `show` method to the `UserController`:

```js
// .app/Controllers/Http/UserController.js

class UserController {
  async login () {
    ...
  }

  show ({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }
    return auth.user
  }
}
```

The `show` method above checks if the `id` route parameter equals the currently logged in user `id`. If so, the authenticated user model is returned (which AdonisJS converts to JSON in the final response).

## Session

### Session Config

```js
// .config/auth.js

module.exports = {
  authenticator: 'session',
  session: {
    serializer: 'Lucid',
    scheme: 'session',
    model: 'App/Models/User',
    uid: 'email',
    password: 'password'
  }
}
```

| Key         | Values                                  | Description                                                                           |
|-------------|-----------------------------------------|---------------------------------------------------------------------------------------|
| serializer  | `lucid`, `database`                     | Serializer used to fetch the user from the database.                                  |
| scheme      | `session`, `basic`, `jwt`, `api`        | Scheme used to fetch and authenticate user credentials.                               |
| uid         | Database field name                     | Database field used as the unique identifier for a given user.                        |
| password    | Database field name                     | Field used to verify the user password.                                               |
| model       | Model namespace (`lucid` only)          | Model used to query the database, applicable only when using the `lucid` serializer.  |
| table       | Database table name (`database` only)   | Applicable only when using the `database` serializer.                                 |

### Session Methods

The *session* authenticator exposes the following methods to log in and authenticate users.

#### `attempt(uid, password)`
Login via `uid` and `password`, throwing an exception if no user is found or the password is invalid:

```js
await auth.attempt(uid, password)
```

#### `login(user)`
Login via `user` model instance, not verify anything but simply marking the user as logged in:

```js
const user = await User.find(1)

await auth.login(user)
```

#### `loginViaId(id)`
Login a via user id, querying the database to ensure the user exists:

```js
await auth.loginViaId(1)
```

#### `remember`
When calling methods like `attempt`, `login` or `loginViaId`, chain the `remember` method to ensure users stay logged in after closing their browser:

```js
await auth
  .remember(true)
  .attempt(email, password)
```

> NOTE: The `remember` method creates a token for the user inside the `tokens` table. If you ever want to revoke the long-lived session of a particular user, simply set `is_revoked` to true.

#### `check`
Check if a user is already logged in by reading their session:

```js
try {
  await auth.check()
} catch (error) {
  response.send('You are not logged in')
}
```

#### `getUser`
Returns the logged in user instance (via the `check` method):

```js
try {
  return await auth.getUser()
} catch (error) {
  response.send('You are not logged in')
}
```

#### `logout`
Log out the currently logged in user:

```js
await auth.logout()
```

## Basic Auth
As basic authentication is stateless with users passing credentials per request, there is no concept of `login` and `logout`.

> NOTE: The `Authorization = Basic <credentials>` header must be set to authenticate *basic* auth requests, where `<credentials>` is a `base64` encoded string of `uid:password`, where `uid` is the `uid` database field defined in the `config/auth.js` file.

### Basic Auth Methods

The *basic* authenticator exposes the following methods to authenticate users.

#### `check`
Check the user's basic auth credentials in the request header, verifying the user's existence and validating their password:

```js
try {
  await auth.check()
} catch (error) {
  response.send(error.message)
}
```

#### `getUser`
Returns the logged in user instance (via the `check` method):

```js
try {
  return await auth.getUser()
} catch (error) {
  response.send('Credentials missing')
}
```

## JWT
[JWT authentication](https://jwt.io/) is an industry standard to implement stateless authentication via string tokens.

AdonisJs supports JWT tokens out of the box via its *jwt* authenticator.

> NOTE: The `Authorization = Bearer <token>` header must be set to authenticate *jwt* auth requests, where `<token>` is a valid JWT token.

### JWT Config

```js
// .config/auth.js

module.exports = {
  authenticator: 'jwt',
  jwt: {
    serializer: 'Lucid',
    model: 'App/Models/User',
    scheme: 'jwt',
    uid: 'email',
    password: 'password',
    options: {
      secret: Config.get('app.appKey'),
      // For additional options, see the table below...
    }
  }
}
```

| Key       | Values                                                                | Default Value | Description                            |
|-----------|-----------------------------------------------------------------------|---------------|----------------------------------------|
| algorithm | `HS256`, `HS384`, `RS256`                                             | `HS256`       | Algorithm used to generate tokens.     |
| expiresIn | Valid time in seconds or [ms string](https://github.com/rauchg/ms.js) | null          | When to expire tokens.                 |
| notBefore | Valid time in seconds or [ms string](https://github.com/rauchg/ms.js) | null          | Minimum time to keep tokens valid.     |
| audience  | String                                                                | null          | `aud` claim.                           |
| issuer    | Array or String                                                       | null          | `iss` claim.                           |
| subject   | String                                                                | null          | `sub` claim.                           |
| public    | String                                                                | null          | `public` key to verify the token encrypted with RSA algorithm. |

```js
  To secure JWT using `RS256` asymmetric algorithm, you need to explictly provide `algorithm` option and set it to `RS256`.
  You must provide your `private key` via `secret` option which will be used by the framework to sign your JWT.
  And you must provide your `public key` via `public` option, which will be used by the framework
  to verify the JWT.

  const fs = use("fs");
  module.exports = {
    authenticator: 'jwt',
    jwt: {
      //...
      options: {
        algorithm: 'RS256',
        secret: fs.readFileSync('absolute-path-to-your-private-key-file'),
        public: fs.readFileSync('absolute-path-to-your-public-key-file'),
        // For additional options, see the table above...
      }
    }
  }
```

### JWT Methods

The *jwt* authenticator exposes the following methods to generate JWT tokens and authenticate users.

#### `attempt(uid, password, [jwtPayload], [jwtOptions])`
Validate the user credentials and generate a JWT token in exchange:

```js
await auth.attempt(uid, password)
```

```js
// .Output

{
  type: 'type',
  token: '.....',
  refreshToken: '....'
}
```

#### `generate(user, [jwtPayload], [jwtOptions])`
Generate JWT token for a given user:

```js
const user = await User.find(1)

await auth.generate(user)
```

You can optionally pass a custom object to be encoded within the token. Passing `jwtPayload=true` encodes the user object within the token.

#### `withRefreshToken`
Instruct the JWT authenticator to generate a refresh token as well:

```js
await auth
  .withRefreshToken()
  .attempt(uid, password)
```

The refresh token is generated so that the clients can refresh the actual `jwt` token without asking for user credentials again.

#### `generateForRefreshToken(refresh_token, [jwtPayload])`
Generate a new JWT token using the refresh token. Passing jwtPayload=true encodes the user object within the token.

```js
const refreshToken = request.input('refresh_token')

await auth.generateForRefreshToken(refreshToken, true)
```

#### `newRefreshToken`
When generating a new `jwt` token, the auth provider does not reissue a new refresh token and instead uses the old one. If you want, you can also regenerate a new refresh token:

```js
await auth
  .newRefreshToken()
  .generateForRefreshToken(refreshToken)
```

#### `check`
Checks if a valid JWT token has been sent via the `Authorization` header:

```js
try {
  await auth.check()
} catch (error) {
  response.send('Missing or invalid jwt token')
}
```

#### `getUser`
Returns the logged in user instance (via the `check` method):

```js
try {
  return await auth.getUser()
} catch (error) {
  response.send('Missing or invalid jwt token')
}
```

#### `listTokens`
Lists all JWT refresh tokens for the user:

```js
await auth.listTokens()
```

## Personal API tokens
Personal API tokens were made popular by [Github](https://github.com/blog/1509-personal-api-tokens) for use in scripts as a revocable substitute for traditional *email* and *password* authentication.

AdonisJs allows you to build apps where your users can create personal API tokens and use them to authenticate.

> NOTE: The `Authorization = Bearer <token>` header must be set to authenticate *api* auth requests, where `<token>` is a valid API token.

### API Methods

The *api* authenticator exposes the following methods to generate API tokens and authenticate users.

#### `attempt(uid, password)`
Valid the user credentials and then generate a new token for them:

```js
const token = await auth.attempt(uid, password)
```

```js
// .Output

{
  type: 'bearer',
  token: '...'
}
```

#### `generate(user)`
Generate token for a given user:

```js
const user = await User.find(1)

const token = await auth.generate(user)
```

#### `check`
Checks if a valid API token has been passed via the `Authorization` header:

```js
try {
  await auth.check()
} catch (error) {
  response.send('Missing or invalid api token')
}
```

#### `getUser`
Returns the logged in user instance (via the `check` method):

```js
try {
  await auth.getUser()
} catch (error) {
  response.send('Missing or invalid api token')
}
```

#### `listTokens`
List all API tokens for the user:

```js
await auth.listTokens()
```

## Switching Authenticators
The auth provider makes it simple to switch between multiple *authenticators* at runtime by calling the `authenticator` method.

Assuming the user is logged in using the `session` authenticator, we can generate a JWT token for them as follows:

```js
// loggedin user via sessions
const user = auth.user

auth
  .authenticator('jwt')
  .generate(user)
```

## Auth Middleware
The `auth` middleware automates authentication for any applied routes.

It is registered as a named middleware inside the `start/kernel.js` file:

```js
// .start/kernel.js

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth'
}
```

Usage:

```js
// .start/routes.js

Route
  .get('users/profile', 'UserController.profile')
  .middleware(['auth'])
```

## Guest Middleware
The `guest` middleware verifies the user is not authenticated.

It is registered as a named middleware inside the `start/kernel.js` file:

```js
// .start/kernel.js

const namedMiddleware = {
  guest: 'Adonis/Middleware/AllowGuestOnly'
}
```

Usage:

```js
// .start/routes.js

// We don't want our logged-in user to access this view
Route
  .get('login', 'AuthController.login')
  .middleware(['guest'])
```

## Helpers
The auth provider adds a couple of helpers to the view instance so that you can write HTML around the state of a logged-in user.

#### `auth`
Reference to the `auth` object:

```edge
Hello {{ auth.user.username }}!
```

#### `loggedIn`
The `loggedIn` tag can be used to write `if/else` around the loggedin user:

```edge
@loggedIn
  <h2> Hello {{ auth.user.username }} </h2>
@else
  <p> Please login </p>
@endloggedIn
```

## Revoking Tokens
The `jwt` and `api` schemes expose methods to revoke tokens using the `auth` interface.

> NOTE: For `jwt`, refresh tokens are only revoked, since actual tokens are never saved in the database.

#### `revokeTokens(tokens, delete = false)`
The following method will revoke tokens by setting a flag in the `tokens` table:

```js
const refreshToken = '' // get it from user

await auth
  .authenticator('jwt')
  .revokeTokens([refreshToken])
```

If `true` is passed as the 2nd argument, instead of setting the `is_revoked` database flag, the relevant row will be deleted from the database:

```js
const refreshToken = '' // get it from user

await auth
  .authenticator('jwt')
  .revokeTokens([refreshToken], true)
```

To revoke all tokens, call `revokeTokens` without any arguments:

```js
await auth
  .authenticator('jwt')
  .revokeTokens()
```

When revoking the `api` token for the currently loggedin user, you can access the value from the request header:

```js
// for currently loggedin user
const apiToken = auth.getAuthHeader()

await auth
  .authenticator('api')
  .revokeTokens([apiToken])
```


#### revokeTokensForUser(user, tokens, delete = false)
This method works the same as the `revokeTokens` method, but instead you can specify the user yourself:

```js
const user = await User.find(1)

await auth
  .authenticator('jwt')
  .revokeTokensForUser(user)
```

## Token Encryption
Tokens are saved in plain format inside the database, but are sent in *encrypted* form to the end-user.

This is done to ensure if someone accesses your database, they are not able to use your tokens directly (they'd have to figure out how to encrypt them using the secret key).
