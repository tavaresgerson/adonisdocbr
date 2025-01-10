# Hooks

Hooks are the **actions that you can perform against a model instance** during a pre-defined life cycle event. Using hooks, you can encapsulate specific actions within your models vs. writing them everywhere inside your codebase.

A great example of hooks is password hashing. You can define a hook that runs before the `save` call and converts the plain text password to a hash.

```ts
// title: app/models/user.ts
// highlight-start
import hash from '@adonisjs/core/services/hash'
// highlight-end
import { column, beforeSave, BaseModel } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare password: string

  // highlight-start
  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
  // highlight-end
}
```

- The `beforeSave` hook is invoked before the **INSERT** and the **UPDATE** queries.
- Hooks can be async. So you can use the `await` keyword inside them.
- Hooks are always defined as static functions and receive the model's instance as the first argument.

:::tip
**Understanding the `$dirty` property**

The `beforeSave` hook is called every time a new user is **created** or **updated** using the model instance.

During the update, you may have updated other properties but NOT the user password. Hence there is no need to re-hash the existing hash, which is why using the `$dirty` object.

The `$dirty` object only contains the changed values. So, you can check if the password was changed and then hash the new value.
:::

## Available hooks

Following is the list of all the available hooks.

| Hook             | Description                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `beforeSave`     | Invoked **before the insert or the update** query. Receives the model instance as the only argument.                        |
| `afterSave`      | Invoked **after the insert or the update** query. Receives the model instance as the only argument.                         |
| `beforeCreate`   | Invoked only **before the insert** query. Receives the model instance as the only argument.                                 |
| `afterCreate`    | Invoked only **after the insert** query. Receives the model instance as the only argument.                                  |
| `beforeUpdate`   | Invoked only **before the update** query. Receives the model instance as the only argument.                                 |
| `afterUpdate`    | Invoked only **after the update** query. Receives the model instance as the only argument.                                  |
| `beforeDelete`   | Invoked **before the delete** query. Receives the model instance as the only argument.                                      |
| `afterDelete`    | Invoked **after the delete** query. Receives the model instance as the only argument.                                       |
| `beforePaginate` | Invoked **before the paginate** query. Receives the query main builder instance alongside the count query builder instance. |
| `afterPaginate`  | Invoked **after the paginate** query. Receives an instance of the simple paginator class.                                   |
| `beforeFetch`    | Invoked **before the fetch** query. Receives the query builder instance as the only argument.                               |
| `afterFetch`     | Invoked **after the fetch** query. Receives an array of model instances                                                     |
| `beforeFind`     | Invoked **before the find** query. Receives the query builder instance as the only argument.                                |
| `afterFind`      | Invoked **after the find** query. Receives the model instance as the only argument.                                         |

### `beforeSave`
The `beforeSave` decorator registers a given function as a before hook invoked before the **insert** and the **update** query.

```ts
import { BaseModel, beforeSave } from '@adonisjs/lucid/orm'

class User extends BaseModel {
  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
```

### `beforeCreate`
The `beforeCreate` decorator registers the function to be invoked just before the insert operation.

```ts
import { BaseModel, beforeCreate } from '@adonisjs/lucid/orm'

class User extends BaseModel {
  @beforeCreate()
  static assignAvatar(user: User) {
    user.avatarUrl = getRandomAvatar()
  }
}
```

### `beforeUpdate`
The `beforeUpdate` decorator registers the function to be invoked just before the update operation.

```ts
import { BaseModel, beforeUpdate } from '@adonisjs/lucid/orm'

class User extends BaseModel {
  @beforeUpdate()
  static async assignAvatar(user: User) {
    user.avatarUrl = getRandomAvatar()
  }
}
```

### `beforeDelete`
The `beforeDelete` decorator registers the function to be invoked just before the delete operation.

```ts
import { BaseModel, beforeDelete } from '@adonisjs/lucid/orm'

class Post extends BaseModel {
  @beforeDelete()
  static async removeFromCache(post: Post) {
    await Cache.remove(`post-${post.id}`)
  }
}
```

### `beforeFind`

The `beforeFind` hook is invoked just before the query is executed to find a single row. This hook receives the query builder instance, and you can attach your constraints to it.

Find operations are one's that intentionally selects a single database row. For example:

- `Model.find()`
- `Model.findBy()`
- `Model.first()`

```ts
import { BaseModel, beforeFind } from '@adonisjs/lucid/orm'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class User extends BaseModel {
  @beforeFind()
  static ignoreDeleted(query: ModelQueryBuilderContract<typeof User>) {
    query.whereNull('is_deleted')
  }
}
```

### `afterFind`

The `afterFind` event receives the model instance.

```ts
import { BaseModel, afterFind } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @afterFind()
  static afterFindHook(user: User) {}
}
```

### `beforeFetch`

Similar to `beforeFind`, the `beforeFetch` hook also receives the query builder instance. However, this hook is invoked whenever a query is executed without using the `first` method.

```ts
import { BaseModel, beforeFetch } from '@adonisjs/lucid/orm'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class User extends BaseModel {
  @beforeFetch()
  static ignoreDeleted(query: ModelQueryBuilderContract<typeof User>) {
    query.whereNull('is_deleted')
  }
}
```

### `afterFetch`

The `afterFetch` hook receives an array of model instances.

```ts
import { BaseModel, afterFetch } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @afterFetch()
  static afterFetchHook(users: User[]) {}
}
```

### `beforePaginate`

The `beforePaginate` query is executed when you make use of the `paginate` method. The paginate method fires both the `beforeFetch` and `beforePaginate` hooks.

The hook function receives an array of query builders. The first instance is for the count's query, and the second is for the main query.

```ts
import { BaseModel, beforePaginate } from '@adonisjs/lucid/orm'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class User extends BaseModel {
  @beforePaginate()
  static ignoreDeleted (
    countQuery: ModelQueryBuilderContract<typeof User>,
    query: ModelQueryBuilderContract<typeof User>
  ) {
    query.whereNull('is_deleted')
    countQuery.whereNull('is_deleted')
  }
}
```

### `afterPaginate`

The `afterPaginate` hook receives an instance of the [SimplePaginator](https://github.com/adonisjs/lucid/blob/efed38908680cca3b288d9b2a123586fab155b1d/src/Database/Paginator/SimplePaginator.ts#L20) class. The `paginate` method fires both the `afterFetch` and the `afterPaginate` hooks.

```ts
import { BaseModel, beforePaginate } from '@adonisjs/lucid/orm'
import type { SimplePaginatorContract } from '@adonisjs/lucid/types/querybuilder'

export default class User extends BaseModel {
  @afterPaginate()
  static afterPaginateHook(users: SimplePaginatorContract<User>) {}
}
```
