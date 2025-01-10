---
summary: An introduction to the Lucid ORM data models, built on the active record pattern.
---

# Models

Along with the Database query builder, Lucid also has data models built on top of the [active record pattern](https://en.wikipedia.org/wiki/Active_record_pattern).

The data models layer of Lucid makes it super easy to **perform CRUD operations**, **manage relationships between models**, and **define lifecycle hooks**.

We recommend using models extensively and reach for the standard query builder for particular use cases.

## What is the active record pattern?

Active Record is also the name of the ORM used by Ruby on Rails. However, the active record pattern is a broader concept that any programming language or framework can implement.

:::note
Whenever we say the term **active record**, we are talking about the pattern itself and not the implementation of Rails.
:::

The active record pattern advocates encapsulating the database interactions to language-specific objects or classes. Each database table gets its model, and each instance of that class represents a table row.

The data models clean up many database interactions since you can encode most of the behavior inside your models vs. writing it everywhere inside your codebase.

For example, Your `users` table has a date field, and you want to format that before sending it back to the client. **This is how your code may look like without using data models**.

```ts
import { DateTime } from 'luxon'
const users = await db.from('users').select('*')

return users.map((user) => {
  user.dob = DateTime.fromJSDate(user.dob).toFormat('dd LLL yyyy')
  return user
})
```

When using data models, you can encode the date formatting action within the model vs. writing it everywhere you fetch and return users.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

class User extends BaseModel {
  @column.date({
    serialize: (value) => value.toFormat('dd LLL yyyy'),
  })
  declare dob: DateTime
}
```

And use it as follows:

```ts
const users = await User.all()
return users.map((user) => user.toJSON()) // date is formatted during `toJSON` call
```

## Creating your first model

You can create a Lucid model using the `make:model` Ace command.

```sh
node ace make:model User

# CREATE: app/Models/User.ts
```

You can also generate the migration alongside the model by defining the `-m` flag.

```sh
node ace make:model User -m

# CREATE: database/migrations/1618903673925_users.ts
# CREATE: app/Models/User.ts
```

Finally, you can also create the factory for the model using the `-f` flag.

```sh
node ace make:model User -f

# CREATE: app/Models/User.ts
# CREATE: database/factories/User.ts
```

The `make:model` command creates a new model inside the `app/Models` directory. Every model must extend the `BaseModel` class to inherit additional functionality.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

## Columns

You will have to define your database columns as properties on the class and decorate them using the `@column` decorator.

- The `@column` decorator is used to distinguish between the standard class properties and the database columns.

- We keep the models lean and do not define database-specific **constraints**, **data types** and **triggers** inside models.

- Any option you define inside the models does not change/impact the database. You must use migrations for that.

To summarize the above points - **Lucid maintains a clear separation between migrations and the models**. Migrations are meant to create/alter the tables, and models are intended to query the database or insert new records.

### Defining columns

Now that you are aware of the existence of columns on the model class. Following is an example of defining the user table columns as properties on the `User` model.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare avatarUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

The `@column` decorator additionally accepts options to configure the property behavior.

- The `isPrimary` option marks the property as the primary key for the given database table.
- The `serializeAs: null` option removes the property when you serialize the model to JSON.

### Column names

Lucid assumes that your database columns names are defined as `snake_case` and automatically converts the model properties to snake case during database queries. For example:

```ts
await User.create({ avatarUrl: 'foo.jpg' })

// EXECUTED QUERY
// insert into "users" ("avatar_url") values (?)
```

If you are not using the `snake_case` convention in your database, then you can override the default behavior of Lucid by defining a custom [Naming Strategy](./naming_strategy.md)

You can also define the database column names explicitly within the `@column` decorator. This is usually helpful for bypassing the convention in specific use cases.

```ts
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ columnName: 'user_id', isPrimary: true })
  declare id: number
}
```

### Preparing and consuming columns

Lucid allows you to transform the column values before saving them to the database or after fetching them from the database using the `consume` and `prepare` option.

For example, you are storing a "secret" value in the database, and you want to encrypt it before saving it and decrypt it after fetching it.

```ts
// In this example, we are using the `encryption` module from the `@adonisjs/core` package
// @see https://docs.adonisjs.com/guides/security/encryption
import encryption from '@adonisjs/core/services/encryption'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({
    prepare: (value: string | null) => (value ? encryption.encrypt(value) : null),
    consume: (value: string | null) => (value ? encryption.decrypt(value) : null),
  })
  declare token: string | null
}
```

### Date columns

Lucid further enhances the date and the date-time properties and converts the database driver values to an instance of [luxon.DateTime](https://moment.github.io/luxon/).

All you need to do is make use of the `@column.date` or `@column.dateTime` decorators, and Lucid will handle the rest for you.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column.date()
  declare dob: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

Optionally, you can pass the `autoCreate` and `autoUpdate` options to always define the timestamps during the creation and the update operations. **Do note, setting these options doesn't modify the database table or its triggers.**

If you don't want Luxon and prefer regular `Date` objects, you still can use a regular `@column` in combination with `consume` and `prepare`

```ts
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({
    consume: (v: string) => new Date(v),
    prepare: (v: Date) => v.toISOString(), 
  )
  declare updatedAt: Date
}
```

## Models config

Following are the configuration options to overwrite the conventional defaults.

### `primaryKey`

Define a custom primary key (defaults to `id`). Setting the `primaryKey` on the model doesn't modify the database. Here, you are just telling Lucid to consider `email` as the unique value for each row.

```ts
class User extends Basemodel {
  static primaryKey = 'email'
}
```

Or use the `isPrimary` column option.

```ts
class User extends Basemodel {
  @column({ isPrimary: true })
  declare email: string
}
```

### `table`

Define a custom database table name. Defaults to the plural and snake case version of the model name.

```ts
export default class User extends BaseModel {
  static table = 'app_users'
}
```

### `selfAssignPrimaryKey`

Set this option to `true` if you don't rely on the database to generate the primary keys. For example, You want to self-assign `uuid` to the new rows.

```ts
import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }
}
```

### `connection`

Instruct model to use a custom database connection defined inside the `config/database` file.

:::note
DO NOT use this property to switch the connection at runtime. This property only defines a static connection name that remains the same throughout the application's lifecycle.
:::

```ts
export default class User extends BaseModel {
  static connection = 'pg'
}
```
