---
title: Validator
category: basics
---

# Validator

AdonisJs makes it simple to validate user input with the help of a dedicated validation provider.

In this guide you learn how to validate data *manually* or via *route validators*.

> NOTE: AdonisJs validation uses [Indicative](https://indicative-v5.adonisjs.com) under the hood. For full usage details, see the official Indicative [documentation](https://indicative-v5.adonisjs.com).

## Setup
Follow the below instructions to set up the validation provider.

First, run the `adonis` command to download the validator provider:

```bash
adonis install @adonisjs/validator
```

Then, register the validator provider inside the `start/app.js` file:

```js
// .start/app.js

const providers = [
  '@adonisjs/validator/providers/ValidatorProvider'
]
```

## Validating user input
Let's start with the example of validating user input received via HTML form:

```html
<form method="POST" action="{{ route('UserController.store') }}">
  <div>
    <input type="text" name="email" />
  </div>

  <div>
    <input type="text" name="password" />
  </div>

  <button type="submit"> Submit </button>
</form>
```

Register the route and controller to handle the form submission and use the validator to validate the data:

```js
// .start/routes.js

Route.post('users', 'UserController.store')
```

```js
const { validate } = use('Validator')

class UserController {

  async store ({ request, session, response }) {
    const rules = {
      email: 'required|email|unique:users,email',
      password: 'required'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    return 'Validation passed'
  }
}

module.exports = UserController
```

Let's break down the above controller code into small steps:

1. We defined our `rules` schema.
2. We used the `validate` method to validate all request data against our rules.
3. If validation fails, we flash all errors and redirect back to our form.

### Showing flash errors
We can modify the HTML form to display our flash messages, which are set when validation fails:

```edge
<form method="POST" action="{{ route('UserController.store') }}">
  <div>
    <input type="text" name="email" value="{{ old('email', '') }}" />
    {{ elIf('<span>$self</span>', getErrorFor('email'), hasErrorFor('email')) }}
  </div>

  <div>
    <input type="text" name="password" />
    {{ elIf('<span>$self</span>', getErrorFor('password'), hasErrorFor('password')) }}
  </div>

  <button type="submit"> Submit </button>
</form>
```

## Validator methods
Below is the list of available methods.

#### `validate(data, rules, [messages], [formatter])`
Validate data with defined rules:

```js
const { validate } = use('Validator')

const validation = await validate(data, rules)

if (validation.fails()) {
  return validation.messages()
}
```

> NOTE: You can optionally pass [custom error messages](https://indicative-v5.adonisjs.com/docs/custom-messages) to return when your validation fails as your third method parameter.

#### `validateAll(data, rules, [messages], [formatter])`
Same as `validate` but continues to validate all fields, whereas the `validate` method stops on first error:

```js
const { validateAll } = use('Validator')
const validation = await validateAll(data, rules)
```

#### `sanitize(data, rules)`
This method returns a new object with sanitized data:

```js
const { sanitize } = use('Validator')
const data = sanitize(request.all(), rules)
```

#### `sanitizor`
Returns a reference to Indicative's [sanitizor](https://indicative-v5.adonisjs.com/docs/api/extend#_adding_sanitization_rules):

```js
const { sanitizor } = use('Validator')
const slug = sanitizor.slug('My first blog post')
```

#### `formatters`
Returns a reference to Indicative's [formatters](https://indicative-v5.adonisjs.com/docs/formatters):

```js
const { formatters } = use('Validator')
validate(data, rules, messages, formatters.JsonApi)
```

## Route validator
Data validation normally occurs during the HTTP request/response lifecycle, and you can end up writing the same validation code inside each controller.

AdonisJs **Route Validators** can make the repetetive process of validation simpler:

```js
// For a single route
Route
  .post('users', 'UserController.store')
  .validator('StoreUser')

// For a resourceful route
Route
  .resource('users', 'UserController')
  .validator(new Map([
    [['users.store'], ['StoreUser']],
    [['users.update'], ['UpdateUser']]
  ]))
```

> NOTE: Validators live inside the `app/Validators` directory.

Let's create a `StoreUser` validator by using the `adonis` command:

```bash
adonis make:validator StoreUser
```

```bash
.make:validator output

create: app/Validators/StoreUser.js
```

Now, all we need to do is define our rules on the validator:

```js
// .app/Validators/StoreUser.js

'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required'
    }
  }
}

module.exports = StoreUser
```

If validation fails, the validator automatically sets the errors as flash messages and redirects the user back to the form.

> NOTE: If the request has an `Accept: application/json` header, the response gets sent back as JSON.

### Custom error messages
Default error messages can be confusing for the end user so you might want to create your own custom validation error messages.

AdonisJs provides an effortless way to do this.

Simply declare a `messages` method on your route validator and return an object with your messages per rule, like so:

```js
// .app/Validators/StoreUser.js

'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required'
    }
  }

  get messages () {
    return {
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password'
    }
  }
}

module.exports = StoreUser
```

### Validate all
To validate all fields, set `validateAll` to true on the class prototype:

```js
// .app/Validators/StoreUser.js

'use strict'

class StoreUser {
  get validateAll () {
    return true
  }
}

module.exports = StoreUser
```

### Sanitizing user input
You can sanitize user input by defining `sanitizationRules`, which are performed on request data before validation occurs:

```js
// .app/Validators/StoreUser.js

class StoreUser {
  get sanitizationRules () {
    return {
      email: 'normalize_email',
      age: 'to_int'
    }
  }
}

module.exports = StoreUser
```

### Handling validation failure
Since every application is structured differently, there are times when automatic failure handling may be undesirable.

You can manually handle failures by adding a `fails` method to your validator:

```js
// .app/Validators/StoreUser.js

class StoreUser {
  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = StoreUser
```

### Custom data object
You may want to validate custom properties which are not part of the request body (for example, headers).

This can be done by defining a `data` property on your validator class:

```js
// .app/Validators/StoreUser.js

class StoreUser {
  get rules () {
    return {
      sessionId: 'required'
    }
  }

  get data () {
    const requestBody = this.ctx.request.all()
    const sessionId = this.ctx.request.header('X-Session-Id')

    return Object.assign({}, requestBody, { sessionId })
  }
}

module.exports = StoreUser
```

### Formatter
You can also define the [Indicative formatter](https://indicative-v5.adonisjs.com/docs/formatters#_available_formatters) as a property on the validator class:

```js
const { formatters } = use('Validator')

class StoreUser {
  get formatter () {
    return formatters.JsonApi
  }
}
```

### Authorization
You may want to perform checks to ensure the user is authorized to take the desired action.

This can be done by defining an `authorize` method on your validator class:

```js
class StoreUser {
  async authorize () {
    if (!isAdmin) {
      this.ctx.response.unauthorized('Not authorized')
      return false
    }

    return true
  }
}

module.exports = StoreUser
```

> NOTE: Return a `boolean` from the `authorize` method to tell the validator whether or not to forward the request to the controller.

### Request context
All route validators can access the current request context via `this.ctx`.

## Custom Rules
AdonisJs supports all [Indicative](https://indicative-v5.adonisjs.com) validations, but also adds a few custom rules.

Below is the list of custom AdonisJs rules.

#### `unique(tableName, [fieldName], [ignoreField], [ignoreValue])`
Ensures a given value is unique to a given database table:

```js
'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'unique:users,email'
    }
  }
}
```

When updating an existing user profile, there is no point checking their email address when enforcing the `unique` rule. This can be done by defining an `ignoreField (id)` and `ignoreValue (userId)`:

```js
class StoreUser {
  get rules () {
    const userId = this.ctx.params.id

    return {
      email: `unique:users,email,id,${userId}`
    }
  }
}
```

## Extending Validator
As an example of how to extend the AdonisJs `Validator`, let's add a new rule to ensure a *post* exists when adding a new *comment* to the database.

We'll call this rule `exists`:

```js
const Validator = use('Validator')
const Database = use('Database')

const existsFn = async (data, field, message, args, get) => {
  const value = get(data, field)
  if (!value) {
    /**
     * skip validation if value is not defined. `required` rule
     * should take care of it.
    */
    return
  }

  const [table, column] = args
  const row = await Database.table(table).where(column, value).first()

  if (!row) {
    throw message
  }
}

Validator.extend('exists', existsFn)
```

We can use our new `exists` rule like so:

```js
get rules () {
  return {
    post_id: 'exists:posts,id'
  }
}
```

> NOTE: Since the code to extend `Validator` need only execute once, you could use [providers](/original/markdown/02-Concept/03-service-providers.md) or [Ignitor hooks](/original/markdown/02-Concept/05-ignitor.md) to do so. Read [Extending the Core](/original/markdown/06-Digging-Deeper/03-Extending-the-Core.adoc) for more information.
