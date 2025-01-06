# Estratégia de nomenclatura

A classe [NamingStrategy](https://github.com/adonisjs/lucid/blob/develop/src/Orm/NamingStrategies/SnakeCase.ts) permite que você substitua os nomes convencionais usados ​​pelo ORM. Por exemplo: em vez de usar `snake_case` para os nomes das colunas, você pode fornecer sua própria estratégia de nomenclatura `camelCase` personalizada.

Toda estratégia de nomenclatura deve implementar o contrato `NamingStrategyContract` e definir todos os métodos necessários.

```ts
import { SnakeCaseNamingStrategy } from '@ioc:Adonis/Lucid/Orm'

class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  //... define all the required methods
}
```

Atribua a um modelo

```ts
class User extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
}
```

Ou atribua diretamente ao modelo Base. Certifique-se de **fazer isso apenas uma vez** e importar o arquivo ao inicializar o framework.

```ts
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
BaseModel.namingStrategy = new CamelCaseNamingStrategy()
```

## Métodos/Propriedades

A seguir está a lista de métodos/propriedades que você deve definir na classe de estratégia de nomenclatura.

### `tableName`

Retorna o nome da tabela padrão para o modelo. A estratégia de nomenclatura padrão converte o nome do modelo para `snake_case` e ​​o `pluraliza`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public tableName(model: typeof BaseModel) {
    return string.pluralize(string.snakeCase(model.name))
  }
}
```

### `columnName`

Retorna o nome da coluna do banco de dados para uma determinada propriedade do modelo. A estratégia de nomenclatura padrão converte a propriedade do modelo para `snake_case`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public columnName(_model: typeof BaseModel, propertyName: string) {
    return string.snakeCase(propertyName)
  }
}
```

### `serializedName`

Retorna o nome a ser usado ao serializar as propriedades do modelo para JSON. A estratégia de nomenclatura padrão converte a propriedade do modelo para `snake_case`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.snakeCase(propertyName)
  }
}
```

### `relationLocalKey`

Retorna a chave local para um determinado relacionamento. O comportamento padrão é usar `primaryKey` como a chave local para todos os relacionamentos, exceto `belongsTo`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public relationLocalKey(
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
Retorna a chave estrangeira para um determinado relacionamento. A estratégia de nomenclatura padrão combina o nome da coluna `modelName` e `primaryKey` e os converte para camelCase.

:::note

A foreignKey aponta para a propriedade do modelo e não para o nome da coluna do banco de dados. Derivamos o nome da coluna do banco de dados do nome da propriedade do modelo.

:::

```ts
import { string } from '@ioc:Adonis/Core/Helpers'
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public relationForeignKey(
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
Retorna o nome da tabela dinâmica para o relacionamento `manyToMany`. A estratégia de nomenclatura padrão concatena os nomes dos modelos e os classifica em ordem alfabética.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public relationPivotTable(
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
Retorna o nome da chave estrangeira dentro da tabela dinâmica. O método é invocado para ambos os modelos envolvidos em um relacionamento `manyToMany`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public relationPivotForeignKey(
    _relation: 'manyToMany',
    model: typeof BaseModel
  ) {
    return string.snakeCase(`${model.name}_${model.primaryKey}`)
  }
}
```

### `paginationMetaKeys`
Retorna as chaves para gerar os metadados para o paginador. A estratégia de nomenclatura padrão usa nomes `snake_case`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public paginationMetaKeys() {
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

Se você estiver paginando resultados usando o módulo `Database` diretamente, deverá registrar a estratégia de nomenclatura com a classe `SimplePaginator`.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

Database.SimplePaginator.namingStrategy = new CamelCaseNamingStrategy()
```

O exemplo acima configurará a estratégia de nomenclatura para o paginador globalmente. No entanto, você também pode definir a estratégia de nomenclatura para uma chamada de método `.paginate` dada.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const paginator = await Database.from('users').paginate()
paginator.namingStrategy = new CamelCaseNamingStrategy()

return paginator.toJSON()
```
