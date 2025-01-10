# Introduction

Lucid is a SQL query builder, and an Active Record ORM built on top of [Knex](https://knexjs.org/). Lucid strives to leverage SQL to its full potential and offers clean API for many advanced SQL operations.

Following are some of the hand-picked Lucid features.

- A fluent query builder built on top of Knex.
- Support for read-write replicas and multiple connection management.
- Class-based models that adhere to the active record pattern.
- Migration system to modify database schema using incremental changesets.
- Model factories to generate fake data for testing.
- Database seeders to insert initial/dummy data into the database.

## A fluent query builder

The base layer of Lucid is a fluent query builder you can use to construct SQL queries using a JavaScript API. The query builder uses [Knex](https://knexjs.org/) under the hood, and therefore, it supports many advanced SQL operations like **window functions**, **recursive CTEs**, **JSON operations**, **row-based locks**, and much more.

Knex might not be the trendiest query builder in the Node.js ecosystem. However, it is mature and battle-tested.

See also: [Using query builder](./installation.md#basic-usage)

## Migration system

Inspired by frameworks like Laravel, Rails, and Elixir Ecto, AdonisJS does not infer schema changes from models. Instead, it makes you write the incremental changesets to modify the database schema. Manual migrations might feel like too much typing. However, the flexibility and the control they provide are unmatched.

We have experienced that in real-world applications, a schema change is not only adding new columns. The changes sometimes involve renaming columns, preserving data, creating a new table, and copying data from an old table. All this must be done without locking the tables for a long duration.

Manual migrations ensure that you can express schema changes per your application requirements.

See also: [Creating migrations](../migrations/introduction.md)

## Active record ORM

The ORM layer of AdonisJS uses JavaScript Classes to define data models. Classes can define lifecycle hooks, create custom properties and methods to encapsulate domain logic, and control the model's serialization behavior.

You create one model for every database table inside your application and use the APIs the models offer to interact with it.

* See also: [Using models](../models/introduction.md)

## Model factories and database seeders

Model factories are used to generate/persist model instances with fake data. They are helpful during tests since you can encapsulate the logic of generating dummy data in one place and reuse factories across the tests.

On the other hand, the database seeders are used to seed the database with some initial values. These values can be dummy data you want to use during development. Or, you can use seeders to set up the initial state of your production application with a list of countries, admin users, and so on.

* See also: [Model factories](../models/model_factories.md)
* See also: [Database seeders](./seeders.md)

## Lucid is not type-safe

Lucid is not type-safe. Let's discuss why.

Type safety with SQL ORMs is a complex topic since it must be applied on multiple layers, such as query construction and output.

Many query builders and ORMs are only type-safe with the query output (sometimes they also limit the SQL features), and only a few are type-safe with query construction as well. Kysely is one of them.

I have [written a few hundred words](https://github.com/thetutlage/meta/discussions/8) comparing Kysely and Drizzle ORM that might help you properly understand the type safety layers.

If we take Kysely as the gold standard of type-safety, we lose a lot of flexibility with it. Especially, in ways, we extend and use Lucid across the AdonisJS codebase.

In fact, I used it to create an extension for our Auth module and the helpers Lucid models can use. And I failed both times. The [creators of Kysely also confirmed](https://www.answeroverflow.com/m/1179612569774870548) that creating generic abstractions of Kysely is impossible.

This is not to say that Kysely is limiting in the first place. It is limiting how we want to use, i.e., build generic abstractions and integrate them seamlessly with the rest of the framework. Kysely is an excellent tool for direct usage.

With that said, looking at the resources at our disposal and our goals, Lucid will not be as type-safe as Kysely in the near future. However, we might invest some time in making certain parts of the ORM type safe.
