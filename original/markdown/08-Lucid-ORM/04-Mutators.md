---
title: Mutators
category: lucid-orm
---

# Mutators

*Getters and setters* provide [many benefits](https://stackoverflow.com/a/1568230/1210490), including the ability to transform your data before saving and retrieving from a database.

In this guide, we learn when and where to use getters, setters and computed properties (also known as *accessors and mutators*).

## Getters
*Getters* are called when retrieving a value from a model instance.

They are often used to transform model data for display.

For example, converting a `Post` title to title case:

```js
// .app/Models/Post.js

'use strict'

const Model = use('Model')

class Post extends Model {
  getTitle (title) {
    return title.replace(/^(.)|\s(.)/g, ($1) => {
      return $1.toUpperCase()
    })
  }
}
```

```js
const post = await Post.find(postId)

// getters are called automatically
return post.toJSON()
```

In the example above, assuming the `Post` title is saved as a `title` field in the database, AdonisJs executes the `getTitle` method and uses the returned value when `post.title` is referenced.

- Getters always start with the `get` keyword followed by the *camel case* version of the field name (e.g. `field_name` → `getFieldName`).
- A getter's return value is used instead of the actual database field name value when that field is referenced on a model instance.
- Getters are automatically evaluated when you call `toJSON` on a model instance or link:serializers[serializer] instance.
- As getters are synchronous, you cannot run asynchronous code inside them (for asynchronous functionality, use [hooks](/original/markdown/08-Lucid-ORM/02-Hooks.md)).

## Setters
*Setters* are called when assigning a value to a model instance.

They are often used to normalize data before saving to a database:

```js
// .app/Models/User.js

'use strict'

const Model = use('Model')

class User extends Model {
  setAccess (access) {
    return access === 'admin' ? 1 : 0
  }
}
```

```js
const user = new User()
user.access = 'admin'

console.log(user.access) // will return 1
await user.save()
```

- Setters always starts with the `set` keyword followed by the *camel case* version of the field name.
- A setter executes when you set/update the value of the given field on the model instance.
- Setters receive the current value of a given field to parse before assignment.
- As setters are synchronous, you cannot run asynchronous code inside them (for asynchronous functionality, use [hooks](/original/markdown/08-Lucid-ORM/02-Hooks.md)).

## Computed Properties
Computed properties are virtual values which only exist in a model instance's JSON representation.

To create a computed `fullname` property from a `User` first/last name:

```js
// .app/Models/User.js

'use strict'

const Model = use('Model')

class User extends Model {
  static get computed () {
    return ['fullname']
  }

  getFullname ({ firstname, lastname }) {
    return `${firstname} ${lastname}`
  }
}
```

In the example above, when `toJSON` is called on the `User` instance, a `fullname` property gets added to the return value:

```js
const user = await User.find(1)

const json = user.toJSON()
console.log(json.fullname) // firstname + lastname
```

- All computed property names (e.g. `fullname`) must be returned in an array from the model class static `computed` getter.
- Computed property method definitions are prefixed with `get`, the same as getter method definitions (e.g. `getFullname`).
- Computed properties receive an object of existing model attributes for use in their method definitions.
