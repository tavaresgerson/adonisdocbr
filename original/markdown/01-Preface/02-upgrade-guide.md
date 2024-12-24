---
title: Upgrading from 4.0
category: Preface
---

# Upgrading from 4.0

The 4.1 release contains a number of *bug fixes* and *API improvements* to keep the code base simple and less magical. Breaking changes were kept to a minimum, however, they could not be eliminated entirely.

## Getting started

The first step is to update all dependencies.

We use [npm-check](https://www.npmjs.com/package/npm-check) to pull the latest versions of packages:

```bash
npm install -g npm-check
```

Run the following command to update dependencies interactively:

```bash
npm-check -u
```

## Exception handling
One of the most significant changes has been to the [global exception handler](https://github.com/adonisjs/adonis-framework/issues/718).

NOTE: If you never created the global exception handler, feel free to ignore this section.

Make the following changes to the `app/Exceptions/Handler.js` file.

1. Ensure your exception handler extends the `BaseExceptionHandler`:
    ```js
    const BaseExceptionHandler = use('BaseExceptionHandler')

    class ExceptionHandler extends BaseExceptionHandler {
    }
    ```

2. Call `super.handle` for exceptions you don't want to handle:
    ```js
    class ExceptionHandler extends BaseExceptionHandler {
      async handle (error, { response }) {
        if (error.name === 'UserNotFoundException') {
          // handle it yourself
          return
        }

        super.handle(...arguments)
      }
    }
    ```

13 Lastly, you can remove `Exception.bind` calls from your codebase, since all exceptions will be routed to the global exception handler.

## Routing

#### `Route.url`

`Route.url` generates a fully qualified URL to a pre-registered route.

Previously, `domain` was passed as a string literal.

`domain` is now accepted as an object.

Previously:
```js
Route.url('posts/:id', { id: 1 }, 'blog.adonisjs.com')
```

Now:
```js
Route.url('posts/:id', { id: 1 }, { domain: 'blog.adonisjs.com' })
```

## Validator
The validator provider now uses the latest version of [Indicative](https://indicative.adonisjs.com), causing the following breaking changes.

#### formatters
There concept of named formatters no longer exists.

If you want to use a pre-existing formatter, instead of passing by name, you must now pass by reference.

Previously:
```js
const { validate } = use('Validator')

validate(data, rules, messages, 'jsonapi')
```

Now:
```js
const { validate, formatters } = use('Validator')

validate(data, rules, messages, formatters.JsonApi)
```

The same applies to route validators too.

Previously:
```js
class StoreUser {
  get formatter () {
    return 'jsonapi'
  }
}
```

Now:
```js
const { formatters } = use('Validator')

class StoreUser {
  get formatter () {
    return formatters.JsonApi
  }
}
```

#### `configure`
The new version of Indicative exposes the [configure](http://indicative.adonisjs.com/docs/api/configure) method to define library-wide defaults:

```js
const { formatters, configure } = use('Validator')

configure({
  FORMATTER: formatters.JsonApi
})
```

## Views

#### `css`

The `css` global has been changed to `style`. The `css` global is no longer supported

Earlier
```edge
{{ css('style') }}
```

Now
```edge
{{ style('style') }}
```

## Lucid
Previously, date formatting was inconsistent with newly created records and existing records.

This has been fixed in the newer release with a *small breaking change* (make sure to read the [related issue](https://github.com/adonisjs/adonis-lucid/issues/245)).

#### dates
The date fields no longer cast to `moment` instances on the model instance.

Previously:
```js
const user = await User.find(1)
user.created_at instanceof moment // true
```

Now:
```js
const user = await User.find(1)
user.created_at instanceof moment // false
```

This change prevents you from mutating the date on the model instance directly and instead use the `castDates` hook to mutate the date when you serialize model properties.

The `castDates` hook works as it did previously:

```js
class User extends Model {
  static castDates (field, value) {
    if (field === 'dob') {
      return `${value.fromNow(true)} old`
    }
    return super.formatDates(field, value)
  }
}
```

## Goodies
A number of bug fixes have been applied to keep the codebase reliable.

Also, a handful of performance improvements have been implemented.

#### Validator
Since Indicative is rewritten from the ground up, the new version is *2x faster* than it was previously.

#### Middleware
Middleware is now resolved by the middleware parsing layer at the time of **booting** the app, instantiating a new instance of them for each request (previously, the **resolve** process was used for each request).

#### Better errors
Errors will now appear nicely formatted in your terminal as shown below:

![image](https://pbs.twimg.com/media/DTHfXErU8AADIyQ.png)
