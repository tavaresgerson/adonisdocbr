---
summary: Learn, how to use query scopes to define reusable query builder functions.
---

# Query scopes

Query scopes are the reusable function to apply to a query builder instance to modify the query.

The methods are defined as static properties on the model class and receive the current query as the first argument. For example:

```ts
// title: app/models/post.ts
import { DateTime } from 'luxon'

import {
  // highlight-start
  scope,
  // highlight-end
  column,
  BaseModel,
} from '@adonisjs/lucid/orm'

export default class Post extends BaseModel {
  static published = scope((query) => {
    query.where('publishedOn', '<=', DateTime.utc().toSQLDate())
  })
}
```

You can apply the `published` scope on a query using the `withScopes` method. It accepts a callback and gives you access to all the scopes as methods.

```ts
Post.query().withScopes((scopes) => scopes.published())
```

## Passing arguments to the scopes

The query scopes can also accept arguments. For example: Creating a scope that accepts a user object to scope the projects they can view.

```ts
import { DateTime } from 'luxon'
import User from '#models/user'
import { BaseModel, column, scope } from '@adonisjs/lucid/orm'

export default class Project extends BaseModel {
  static visibleTo = scope((query, user: User) => {
    if (user.isAdmin) {
      return
    }

    /**
     * Non-admin users can only view their own team's projects
     */
    query.where('teamId', user.teamId)
  })
}
```

Now, you can call the `scopes.visibleTo` method and pass it the required arguments.

```ts
Project.query().withScopes((scopes) => scopes.visibleTo(auth.user))
```

## Calling scopes within the scopes

Since the scope method receives an instance of the [Model query builder](./query_builder.md), you can reference other model scopes within the scope callback.

However, the scope method is static so it is not aware of the model in which it is used (a TypeScript limitation). Consequently, it cannot infer the Query builder type for the model.

Therefore, we need to create a `Builder` type as follows:

```ts
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

// highlight-start
type Builder = ModelQueryBuilderContract<typeof Post>
// highlight-end
```

Then, you can hint the `builder` property as follow:

```ts
export default class Post extends BaseModel {
  // highlight-start
  static firstScope = scope((query: Builder) => {
  // highlight-end
    query.withScopes((scopes) => scopes.secondScope())
  })

  static secondScope = scope((query) => {
    query.whereNull('deletedAt')
  })
}
```

If you also want to pass arguments, you need to cast the `query` within the method:

```ts
export default class Post extends BaseModel {
  static firstScope = scope((scopeQuery, user: User) => {
    // highlight-start
    const query = scopeQuery as Builder
    // highlight-end
    query
      .withScopes((scopes) => scopes.secondScope())
      .where('teamId', user.teamId)
  })

  static secondScope = scope((query) => {
    query.whereNull('deletedAt')
  })
}
```