# Validation

Validating user data is an essential requirement for any application. AdonisJs makes use of [Indicative](http://indicative.adonisjs.com/) to sanitize and validate user inputs. It supports all validation rules from indicative, so make sure to check indicative's documentation.

## Setup
Validator is not the part of the base installation and hence you are required to install and register it manually.

```bash
# Installing From Npm

npm i --save adonis-validation-provider
```

```js
// bootstrap/app.js

const providers = [
  // ...
  'adonis-validation-provider/providers/ValidatorProvider'
  // ...
]
```

```js
// bootstrap/app.js

const aliases = {
  // ...
  Validator: 'Adonis/Addons/Validator'
  // ...
}
```

## Basic Example
Let's take the most basic example of validating a form to create a user. For now, we will perform all the validations within the controller, but you are free to organize them into separate services.

Let's start by defining the rules on the User model. Make sure also to check out indicative docs on [schema rules](http://indicative.adonisjs.com/#indicative-schema-rules).

```js
// app/Model/User

'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  static get rules () { <1>
    return {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required|confirmed',
    }
  }
}
```

```js
// app/Http/Controllers/UsersController.js

'use strict'

const Validator = use('Validator')
const User = use('App/Model/User')

class UsersController {

  * store(request, response) {
    const userData = request.all()
    const validation = yield Validator.validate(userData, User.rules)  <2>

    if (validation.fails()) { <3>
      response.json(validation.messages()) <4>
      return
    }

    // Validation passed, create the user.
  }

}
```

1. We start by defining the rules inside the *User Model*.
2. Next we validate the user data from request against the previously defined rules.
3. The `validation.fails()` returns true, if validation has failed.
4. The `validation.messages()` will return all the error messages as an array.

## Validator Methods
Below is the list of methods exposed by the Validation Provider.

#### validate(data, rules, [messages])
Validate user data against defined rules and returns as soon as first validation get's failed.

```js
const validation = yield Validator.validate(data, rules, messages)
```

#### validateAll(data, rules, [messages])
Same as `validate` but instead continue till the last validation and returns multiple error messages.

```js
const validation = yield Validator.validateAll(data, rules, messages)
```

#### fails()
Returns a boolean indicating whether the validation has been failed or not.

```js
const validation = yield Validator.validate(data, rules, messages)
if (validation.fails ()) {
  // validation failed
}
```

#### messages
Returns an array of validation error message

```js
const validation = yield Validator.validate(data, rules, messages)
if (validation.fails ()) {
  response.send({error: validation.messages()})
}
```

#### sanitize(data, rules)
Sanitize user data. Also make sure to check the [sanitization](/markdown/09-security/06-data-sanitization.md) docs for more info.

```js
const data = request.all()
const rules = {
  email: 'normalize_email',
  bio: 'strip_links',
  fullname: 'capitalize'
}

const sanitizedData = Validator.sanitize(data, rules)
```

#### is
You can make use of is method to do inline validations instead of going through a complete validation lifecycle.

```js
if (Validator.is.email('foo')) {
  // ...
}
```

#### sanitizor
Same as `is`, you can do inline data sanitisation.

```js
const sanitizedEmail = Validator
  .sanitizor
  .normalizeEmail('bar.sneaky+foo@googlemail.com')

// returns barsneaky@gmail.com
```

## Custom Rules
AdonisJs supports all the validation rules by Indicative, but also adds a few who are specific to AdonisJs only. Below is the list of custom rules.

#### unique(tableName, [fieldName])
Makes sure a given value is unique in a given database table.

```js
// app/Model/User

'use strict'

class User extends Lucid {

  static get rules () {
    return {
      email: 'unique:users,email'
    }
  }

}
```

Now when trying to update a user, you would never want to run the unique validation for the same user. Same can be achieved by defining a `whereNot` clause.

```js
// app/Model/User

'use strict'

class User extends Lucid {

  static rules (userId) {
    return {
      email: `unique:users,email,id,${userId}`
    }
  }

}
```

Inside you controller, you can do

```js
// app/Http/Controllers/UsersController

'use strict'

const User = use('App/Model/User')

class UsersController {

  * update (request, response) {
    const userId = request.param('id')

    const rules = User.rules(userId) <1>
    const validation = yield Validator.validate(request.all(), rules)
  }

}
```

1. When fetching the rules from the *User Model*, we pass along the user id which gets ignored when checking the email uniqueness.

## Extending Validator
Quite often you have the requirement of extending the *Validator Provider* by adding new validation rules. You can make use of the `extend` method provided by [Indicative](http://indicative.adonisjs.com/#indicative-extending).

#### Application Specific
For application specific rules you can make use of `app/Listeners/Http.js` file to listen for the *start* event and your custom rule.

```js
// app/Listeners/Http.js

Http.onStart = function () {

  const Validator = use('Adonis/Addons/Validator')
  Validator.extend('adult', (data, field, message, args, get) => {

    return new Promise((resolve, reject) => {
      const fieldValue = get(data, field)
      if (fieldValue > 18) {
        resolve('Allowed')
        return
      }
      reject(message)
    })

  }, 'You must be an adult')

}
```

#### Via Provider
If you are writing a module/addon for AdonisJs, you can add your custom rules inside the `boot` method of your service provider.

```js
const ServiceProvider = require('adonis-fold').ServiceProvider

class MyServiceProvider extends ServiceProvider {

  _adultValidation (data, field, message, args, get) {

    return new Promise((resolve, reject) => {
      const fieldValue = get(data, field)
      if (fieldValue > 18) {
        resolve('Allowed')
        return
      }
      reject(message)
    })

  }

  boot () {
    const Validator = use('Adonis/Addons/Validator')
    Validator.extend('adult', this._adultValidation, 'You must be an adult')
  }

  * register () {
    // register bindings
  }

}
```

You can make use of the above defined `adult` like any other validation rule.
