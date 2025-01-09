---
summary: Validation rules added to VineJS through AdonisJS container
---

# Validation rules

Lucid adds validation rules to VineJS to use in your schemas. Under the hood, it registers a provider in your AdonisJS application that extends VineJS rules.
You can read more in the [AdonisJS docs](https://docs.adonisjs.com/guides/concepts/service-providers#service-providers) and [VineJS docs](https://vinejs.dev/docs/extend/custom_rules).

You can use these rules directly from your VineJS schema. For example, the `unique` rule:

```ts
import vine from '@vinejs/vine'

const schema = vine.object({
  email: vine
    .string()
    // highlight-start
    .unique({
      table: 'users',
      column: 'email',
    }),
  // highlight-end
})
```

## Unique

Ensure the value is unique (does not exists) inside a given database table and column.

:::note
The rule is a macro for `VineString` and `VineNumber`, so you can use it after `vine.string()` or `vine.number()`.
:::

You may either pass a callback to query the database directly, or an object:

- The [callback](https://github.com/adonisjs/lucid/blob/21.x/src/types/vine.ts#L61-L65) must return `true` if the value is unique (does not exist), or `false` if the value already exists.
- You may also pass an [options object](https://github.com/adonisjs/lucid/blob/21.x/src/types/vine.ts#L17-L55) to specify the table and column.

```ts
// Usage with callback
const schema = vine.object({
  email: vine
    .string()
    // highlight-start
    .unique((db, value) => {
      const row = await db.from('users').where('email', value).first()
      return row === null
    }),
  // highlight-end
})

// Usage with options
const schema = vine.object({
  email: vine
    .string()
    // highlight-start
    .unique({ table: 'users', column: 'email' }),
    // highlight-end
})
```

You may also use your Lucid model directly inside the callback:

```ts
const schema = vine.object({
  email: vine
    .string()
    // highlight-start
    .unique((_, value) => {
      const row = await User.findBy('email', value)
      return row ? false : true
    }),
  // highlight-end
})
```

## Exists

Ensure the value exists inside a given database table and column. This is the inverse of the unique rule.

:::note
The rule is also a macro for `VineString` and `VineNumber`, so you can use it after `vine.string()` or `vine.number()`.
:::

You may either pass a callback to query the database directly, or an object:

- The [callback](https://github.com/adonisjs/lucid/blob/21.x/src/types/vine.ts#L61-L65) must return `true` if the value exists, `false` otherwise.
- You may also pass an [options object](https://github.com/adonisjs/lucid/blob/21.x/src/types/vine.ts#L17-L55) to specify the table and column.

```ts
// Usage with callback
const schema = vine.object({
  slug: vine
    .string()
    // highlight-start
    .exists((db, value) => {
      const row = await db.from('categories').where('slug', value).first()
      return row ? true : false
    }),
  // highlight-end
})

// Usage with options
const schema = vine.object({
  slug: vine
    .string()
    // highlight-start
    .exists({ table: 'categories', column: 'slug' }),
  // highlight-end
})
```
