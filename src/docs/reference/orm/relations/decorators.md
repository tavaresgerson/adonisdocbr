# Decoradores

Todos os decoradores ORM podem ser importados da seguinte forma:

```ts
import {
  column,
  hasOne,
  scope,
  beforeSave,
  beforeFind,
  // ... and so on
} from '@ioc:Adonis/Lucid/Orm'
```

### `column`
O decorador `column` marca uma propriedade de modelo como uma coluna de banco de dados.

```ts
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  @column()
  public email: string
}
```

Você também pode definir qualquer uma das seguintes propriedades opcionais.

| Opção         | Descrição   |
|---------------|-------------|
| `columnName`  | O nome da coluna dentro do banco de dados. Se não for definido, usaremos a [estratégia de nomenclatura](./naming-strategy.md#columnname) para criar o nome. |
| `serializeAs` | O nome da propriedade a ser usado ao serializar o modelo. Definir o valor como `null` removerá a propriedade do objeto serializado. |
| `isPrimary`   | Marcar coluna como primária. Um modelo pode ter apenas uma coluna primária. |
| `serialize`   | Uma função personalizada para manipular a serialização do valor da coluna. Por exemplo: serializar objetos de data luxon para uma string. |
| `prepare`     | Uma função personalizada para transformar o valor antes de ser salvo dentro do banco de dados. |
| `consume`     | Uma função personalizada para transformar o valor após buscá-lo do banco de dados e antes de defini-lo na instância do modelo. |
| `meta`        | O objeto `meta` contém metadados arbitrários para a propriedade. Bibliotecas de terceiros que estendem a funcionalidade do modelo podem usar esta propriedade. |

```ts
import Encryption from '@ioc:Adonis/Core/Encryption'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  @column({
    prepare: (value: string) => Encryption.encrypt(value),
    consume: (value: string) => Encryption.decrypt(value),
  })
  public email: string

  @column({
    serializeAs: null
  })
  public password: string
}
```

### `column.date` / `column.dateTime`
O decorador `column.date` marca a coluna como uma data. O decorador força o tipo de propriedade a ser uma instância de [luxon.DateTime](https://moment.github.io/luxon/api-docs/index.html#datetime).

O decorador [autodefine](https://github.com/adonisjs/lucid/blob/0fc3e2391ba6743427fac62e0895e458d7bc8137/src/Orm/Decorators/date.ts#L98) os métodos `prepare`, `consume` e `serialize` para garantir

- Você está constantemente trabalhando com uma instância de `luxon.DateTime` em sua base de código
- A data é serializada como uma data ISO
- A data é formatada corretamente de acordo com o driver de banco de dados subjacente.

```ts
import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  @column.date()
  public dob: DateTime
}
```

Além disso, você também pode definir as opções `autoCreate` e `autoUpdate` para sempre definir/atualizar o valor quando uma consulta de inserção ou atualização for executada.

Você usará principalmente esses atributos com os carimbos de data/hora `createdAt` e `updatedAt`.

```ts
class User extends BaseModel {
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoUpdate: true })
  public updatedAt: DateTime
}
```

### `computed`
Você pode usar o decorador `computed` para serializar uma propriedade de modelo ao converter a instância do modelo em um objeto JSON.

```ts
import { column, computed, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  @column()
  public firstName: string

  @column()
  public lastName: string

  @computed()
  public get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
```

Agora, a serialização do modelo incluirá o `fullName` também.

```ts
const user = new User()
user.firstName = 'Harminder'
user.lastName = 'Virk'

console.log(user.serialize())
/**
  {
    firstName: 'Harminder',
    lastName: 'Virk',
    fullName: 'Harminder Virk'
  }
*/
```

### `hasOne`
O decorador `hasOne` marca uma propriedade como um relacionamento Has one. Ele aceita um retorno de chamada como o primeiro argumento. O retorno de chamada deve retornar o modelo de relacionamento.

```ts
import { hasOne, HasOne, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends Model {
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>
}
```

Opcionalmente, você pode definir as seguintes opções como o segundo argumento.

| Opção           | Descrição   |
|-----------------|-------------|
| `foreignKey`    | A chave estrangeira para o relacionamento. Você deve definir o nome da propriedade do modelo aqui e o Lucid inferirá o nome da coluna da tabela automaticamente. |
| `localKey`      | A chave local é o nome da propriedade no modelo atual que forma um relacionamento com a chave estrangeira |
| `serializeAs`   | O nome da propriedade a ser usado ao serializar o relacionamento. Definir o valor como `null` removerá o relacionamento do objeto serializado. |
| `onQuery`       | Um retorno de chamada para modificar todas as consultas de relacionamento. O retorno de chamada será executado para todas as operações **select**, **update** e **delete** executadas usando o construtor de consultas de relacionamento. |

### `hasMany`
O decorador `hasMany` marca uma propriedade como um relacionamento hasMany. Ele aceita um retorno de chamada como o primeiro argumento. O retorno de chamada deve retornar o modelo de relacionamento.

```ts
import { hasMany, HasMany, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends Model {
  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}
```

Opcionalmente, você pode definir as seguintes opções como o 2º argumento.

| Opção         | Descrição |
|---------------|------------|
| `foreignKey`  | A chave estrangeira para o relacionamento. Você deve definir o nome da propriedade do modelo aqui e o Lucid inferirá o nome da coluna da tabela automaticamente. |
| `localKey`    | A chave local é o nome da propriedade no modelo atual que forma um relacionamento com a chave estrangeira |
| `serializeAs` | O nome da propriedade a ser usado ao serializar o relacionamento. Definir o valor como `null` removerá o relacionamento do objeto serializado. |
| `onQuery`     | Um retorno de chamada para modificar todas as consultas de relacionamento. O retorno de chamada será executado para todas as operações **select**, **update** e **delete** executadas usando o construtor de consultas de relacionamento. |

### `belongsTo`
O decorador `belongsTo` marca uma propriedade como um relacionamento belongTo. Ele aceita um retorno de chamada como o primeiro argumento. O retorno de chamada deve retornar o modelo de relacionamento.

```ts
import { belongsTo, BelongsTo, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends Model {
  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>
}
```

| Opção         | Descrição   |
|---------------|-------------|
| `foreignKey`  | A chave estrangeira para o relacionamento. No caso de pertence a, a foreignKey deve estar no modelo atual |
| `localKey`    | A chave local é o nome da propriedade no modelo relacionado que forma um relacionamento com a chave estrangeira |
| `serializeAs` | O nome da propriedade a ser usado ao serializar o relacionamento. Definir o valor como `null` removerá o relacionamento do objeto serializado. |
| `onQuery`     | Um retorno de chamada para modificar todas as consultas de relacionamento. O retorno de chamada será executado para todas as operações **select**, **update** e **delete** executadas usando o construtor de consulta de relacionamento. |

### `manyToMany`
O decorador `manyToMany` marca uma propriedade como um relacionamento muitos para muitos. Ele aceita um retorno de chamada como o primeiro argumento. O retorno de chamada deve retornar o modelo de relacionamento.

```ts
import { manyToMany, ManyToMany, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends Model {
  @manyToMany(() => Subject)
  public subjects: ManyToMany<typeof Subject>
}
```

| Opção                     | Descrição   |
|---------------------------|-------------|
| `pivotForeignKey`         | A chave estrangeira do modelo atual dentro da tabela dinâmica. |
| `pivotRelatedForeignKey`  | A chave estrangeira do modelo relacionado dentro da tabela dinâmica. |
| `localKey`                | A chave local é o nome da propriedade no modelo atual que forma um relacionamento com a chave estrangeira |
| `relatedKey`              | A chave relacionada é o nome da propriedade no modelo relacionado que forma um relacionamento com a chave estrangeira |
| `serializeAs`             | O nome da propriedade a ser usado ao serializar o relacionamento. Definir o valor como `null` removerá o relacionamento do objeto serializado. |
| `onQuery`                 | Um retorno de chamada para modificar todas as consultas de relacionamento. O retorno de chamada será executado para todas as operações **select**, **update** e **delete** executadas usando o construtor de consultas de relacionamento. |

### `hasManyThrough`
O decorador `hasManyThrough` marca uma propriedade como um relacionamento has many through. Ele aceita uma matriz de retornos de chamada como o primeiro argumento.

- O primeiro retorno de chamada retorna o modelo relacionado
- O segundo retorno de chamada retorna o modelo through

```ts
import { hasManyThrough, HasManyThrough, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class Country extends Model {
  @hasManyThrough([
    () => Post,
    () => User,
  ])
  public posts: HasManyThrough<typeof Post>
}
```

| Opção               | Descrição     |
|---------------------|---------------|
| `foreignKey`        | A chave estrangeira para o relacionamento. A chave estrangeira forma o relacionamento entre o modelo atual e o modelo through. ou seja, o `countryId` no modelo `User`. |
| `localKey`          | A chave local é o nome da propriedade no modelo atual que forma um relacionamento com a chave estrangeira |
| `throughForeignKey` | A chave estrangeira que forma o relacionamento entre o through e o modelo relacionado. ou seja, o `userId` no modelo `Post`. |
| `throughLocalKey`   | A chave local no modelo through que forma um relacionamento com o `throughForeignKey`. |
| `serializeAs`       | O nome da propriedade a ser usado ao serializar o relacionamento. Definir o valor como `null` removerá o relacionamento do objeto serializado. |
| `onQuery`           | Um retorno de chamada para modificar todas as consultas de relacionamento. O retorno de chamada será executado para todas as operações **select**, **update** e **delete** executadas usando o construtor de consultas de relacionamento. |

### `beforeSave`
O decorador `beforeSave` registra uma função dada como um gancho before invocado antes da consulta **insert** e **update**.

```ts
import { beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
```

A variante after save também é suportada usando o decorador `afterSave`.

### `beforeCreate`
O decorador `beforeCreate` registra a função a ser invocada logo antes da operação de inserção.

```ts
import { beforeCreate, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  @beforeCreate()
  public static assignAvatar(user: User) {
    user.avatarUrl = getRandomAvatar()
  }
}
```

Você pode usar o decorador `afterCreate` para definir um gancho que é executado após a criação de uma nova linha.

### `beforeUpdate`
O decorador `beforeUpdate` registra a função a ser invocada logo antes da operação de atualização.

```ts
import { beforeUpdate, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  @beforeUpdate()
  public static async assignAvatar(user: User) {
    user.avatarUrl = getRandomAvatar()
  }
}
```

Você pode usar o decorador `afterUpdate` para definir um gancho que é executado após a atualização de uma linha.

### `beforeDelete`
O decorador `beforeDelete` registra a função a ser invocada logo antes da operação de exclusão.

```ts
import { beforeDelete, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class Post extends BaseModel {
  @beforeDelete()
  public static async removeFromCache(post: Post) {
    await Cache.remove(`post-${post.id}`)
  }
}
```

Você pode usar o decorador `afterDelete` para definir um gancho que é executado após a exclusão de uma linha.

### `beforeFind`

O decorador `beforeFind` registra a função a ser invocada logo antes da operação find.

As operações find são aquelas que selecionam intencionalmente uma única linha do banco de dados. Por exemplo:

- `Model.find()`
- `Model.findBy()`
- `Model.first()`

```ts
import {
  beforeFind,
  BaseModel,
  ModelQueryBuilderContract
} from '@ioc:Adonis/Lucid/Orm'

type PostQuery = ModelQueryBuilderContract<typeof Post>

class Post extends BaseModel {
  @beforeFind()
  public static withoutSoftDeletes(query: PostQuery) {
    query.whereNull('deleted_at')
  }
}
```

### `afterFind`
Você pode usar o decorador `afterFind` para definir um gancho que é executado após encontrar a linha do banco de dados.

O gancho recebe a instância do modelo como o único argumento.

```ts
import { afterFind, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class Post extends BaseModel {
  @afterFind()
  public static async processMarkdown(post) {
    post.html = await markdownIt(post.body)
  }
}
```

### `beforeFetch`
O decorador `beforeFetch` registra a função a ser invocada logo antes da operação fetch.

Todas as consultas select, exceto as **operações find**, são consideradas operações fetch.

```ts
import {
  beforeFetch,
  BaseModel,
  ModelQueryBuilderContract
} from '@ioc:Adonis/Lucid/Orm'

type PostQuery = ModelQueryBuilderContract<typeof Post>

class Post extends BaseModel {
  @beforeFetch()
  public static withoutSoftDeletes(query: PostQuery) {
    query.whereNull('deleted_at')
  }
}
```

### `afterFetch`
O decorador `afterFetch` registra a função a ser invocada após a operação de busca.

O gancho after fetch recebe uma matriz de instâncias de modelo como o único argumento.

```ts
import { afterFetch, BaseModel } from '@ioc:Adonis/Lucid/Orm'

class Post extends BaseModel {
  @afterFetch()
  public static async processMarkdown(posts: Post[]) {
    await Promise.all(posts.map((post) => {
      return markdownIt(post.body)
    }))
  }
}
```

### `beforePaginate`
O decorador `beforePaginate` registra a função a ser invocada logo antes da operação de paginação.

```ts
import {
  beforePaginate,
  BaseModel,
  ModelQueryBuilderContract
} from '@ioc:Adonis/Lucid/Orm'

type PostQuery = ModelQueryBuilderContract<typeof Post>

class Post extends BaseModel {
  @beforePaginate()
  public static withoutSoftDeletes(
    [countQuery, query]: [PostQuery, PostQuery]
  ) {
    countQuery.whereNull('deleted_at')
    query.whereNull('deleted_at')
  }
}
```

### `afterPaginate`
O decorador `afterPaginate` registra a função a ser invocada após a operação de paginação.

O gancho after paginate recebe uma instância do [paginador](../database/query-builder.md#pagination).

```ts
import {
  afterPaginate,
  BaseModel,
  ModelPaginatorContract
} from '@ioc:Adonis/Lucid/Orm'

type PostPaginator = ModelPaginatorContract<Post>

class Post extends BaseModel {
  @afterPaginate()
  public static async processMarkdown(paginator: PostPaginator) {
    await Promise.all(paginator.all().map((post) => {
      return markdownIt(post.body)
    }))
  }
}
```
