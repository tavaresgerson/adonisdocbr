---
summary: Reference guide to naming strategies in Lucid ORM
---

# Naming Strategy

The [NamingStrategy](https://github.com/adonisjs/lucid/blob/develop/src/orm/naming_strategies/camel_case.ts) class allows you to override the conventional names used by the ORM. For example: Instead of using `snake_case` for your column names, you can provide your own custom `camelCase` naming strategy.

Every naming strategy must implement the `NamingStrategyContract` contract and define all the required methods.

```ts
import { CamelCaseNamingStrategy } from '@adonisjs/lucid/orm'

class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  //... define all the required methods
}
```

Assign it to a model

```ts
class User extends BaseModel {
  public static namingStrategy = new MyCustomNamingStrategy()
}
```

Or assign it to the Base model directly. Make sure to **do it only once** and import the file when booting the framework.

```ts
import { BaseModel } from '@adonisjs/lucid/orm'
BaseModel.namingStrategy = new CamelCaseNamingStrategy()
```

## Methods/Properties

Following is the list of methods/properties you must define in the naming strategy class.

### `tableName`

Return the default table name for the model. The default naming strategy converts the model name to `snake_case` and `pluralizes` it.

```ts
import string from '@adonisjs/core/helpers/string'
import { CamelCaseNamingStrategy, BaseModel } from '@adonisjs/lucid/orm'

class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  tableName(model: typeof BaseModel) {
    return string.singular(string.snakeCase(model.name))
  }
}
```

### `columnName`

Return the database column name for a given model property. The default naming strategy converts the model property to `snake_case`.

```ts
import string from '@adonisjs/core/helpers/string'
import { CamelCaseNamingStrategy, BaseModel } from '@adonisjs/lucid/orm'

class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  columnName(_model: typeof BaseModel, propertyName: string) {
    return string.snakeCase(propertyName)
  }
}
```

### `serializedName`

Return name to be used when serializing the model properties to JSON. The default naming strategy converts the model property to `snake_case`.

```ts
import string from '@adonisjs/core/helpers/string'
import { CamelCaseNamingStrategy, BaseModel } from '@adonisjs/lucid/orm'

class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.snakeCase(propertyName)
  }
}
```

### `relationLocalKey`

Return the local key for a given relationship. The default behavior is to use the `primaryKey` as the local key for all the relationships except `belongsTo`.

```ts
import string from '@adonisjs/core/helpers/string'
import { CamelCaseNamingStrategy, BaseModel } from '@adonisjs/lucid/orm'

class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  relationLocalKey(
    relation: string,
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    if (relation === 'belongsTo') {
      return relatedModel.primaryKey
    }

    return model.primaryKey
  }
}
```

### `relationForeignKey`
Return the foreign key for a given relationship. The default naming strategy combines the `modelName` and the `primaryKey` column name and converts them to camelCase.

:::note
The foreignKey points to the model property and not the database column name. We derive the database column name from the model property name.
:::

```ts
import string from '@adonisjs/core/helpers/string'
import { CamelCaseNamingStrategy, BaseModel } from '@adonisjs/lucid/orm'

class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  relationForeignKey(
    relation: string,
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    if (relation === 'belongsTo') {
      return string.camelCase(`${relatedModel.name}_${relatedModel.primaryKey}`)
    }

    return string.camelCase(`${model.name}_${model.primaryKey}`)
  }
}
```

### `relationPivotTable`
Return the pivot table name for the `manyToMany` relationship. The default naming strategy concatenates the model names together and sorts them alphabetically.

```ts
import string from '@adonisjs/core/helpers/string'
import { CamelCaseNamingStrategy, BaseModel } from '@adonisjs/lucid/orm'

class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  relationPivotTable(
    _relation: 'manyToMany',
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    return string.snakeCase(
      [relatedModel.name, model.name]
        .sort()
        .join('_')
    )
  }
}
```

### `relationPivotForeignKey`
Return the foreign key name inside the pivot table. The method is invoked for both the models involved in a `manyToMany` relationship.

```ts
import string from '@adonisjs/core/helpers/string'
import { CamelCaseNamingStrategy, BaseModel } from '@adonisjs/lucid/orm'

class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  relationPivotForeignKey(
    _relation: 'manyToMany',
    model: typeof BaseModel
  ) {
    return string.snakeCase(`${model.name}_${model.primaryKey}`)
  }
}
```

### `paginationMetaKeys`
Return the keys to generate the metadata for the paginator. The default naming strategy uses `snake_case` names.

```ts
import string from '@adonisjs/core/helpers/string'
import { CamelCaseNamingStrategy, BaseModel } from '@adonisjs/lucid/orm'

class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  paginationMetaKeys() {
    return {
      total: 'total',
      perPage: 'per_page',
      currentPage: 'current_page',
      lastPage: 'last_page',
      firstPage: 'first_page',
      firstPageUrl: 'first_page_url',
      lastPageUrl: 'last_page_url',
      nextPageUrl: 'next_page_url',
      previousPageUrl: 'previous_page_url',
    }
  }
}
```

If you are paginating results using the `db` service directly, you must register the naming strategy with the `SimplePaginator` class.

```ts
import db from '@adonisjs/lucid/services/db'

db.SimplePaginator.namingStrategy = new MyCustomNamingStrategy()
```

The above example will configure the naming strategy for the paginator globally. However, you can also define the naming strategy for a given `.paginate` method call.

```ts
import db from '@adonisjs/lucid/services/db'

const paginator = await db.from('users').paginate()
paginator.namingStrategy = new CamelCaseNamingStrategy()

return paginator.toJSON()
```
