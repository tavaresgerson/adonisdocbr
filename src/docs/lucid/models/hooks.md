# Hooks

Hooks são as **ações que você pode executar em uma instância de modelo** durante um evento de ciclo de vida predefinido. Usando hooks, você pode encapsular ações específicas dentro de seus modelos em vez de escrevê-las em todos os lugares dentro de sua base de código.

Um ótimo exemplo de hooks é o hash de senha. Você pode definir um hook que seja executado antes da chamada `save` e converta a senha de texto simples em um hash.

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

- O hook `beforeSave` é invocado antes das consultas **INSERT** e **UPDATE**.
- Hooks podem ser assíncronos. Então você pode usar a palavra-chave `await` dentro deles.
- Hooks são sempre definidos como funções estáticas e recebem a instância do modelo como o primeiro argumento.

:::tip
**Entendendo a propriedade `$dirty`**

O hook `beforeSave` é chamado toda vez que um novo usuário é **criado** ou **atualizado** usando a instância do modelo.

Durante a atualização, você pode ter atualizado outras propriedades, mas NÃO a senha do usuário. Portanto, não há necessidade de refazer o hash do hash existente, e é por isso que usar o objeto `$dirty`.

O objeto `$dirty` contém apenas os valores alterados. Portanto, você pode verificar se a senha foi alterada e então fazer o hash do novo valor.
:::

## Hooks disponíveis

A seguir está a lista de todos os hooks disponíveis.

| Hook             | Descrição                                                                                                                 |
|------------------|---------------------------------------------------------------------------------------------------------------------------|
| `beforeSave`     | Chamado **antes da consulta insert ou update**. Recebe a instância do modelo como o único argumento. |
| `afterSave`      | Chamado **após a consulta insert ou update**. Recebe a instância do modelo como o único argumento. |
| `beforeCreate`   | Chamado **antes da consulta insert**. Recebe a instância do modelo como o único argumento. |
| `afterCreate`    | Chamado **após a consulta insert**. Recebe a instância do modelo como o único argumento. |
| `beforeUpdate`   | Chamado **antes da consulta update**. Recebe a instância do modelo como o único argumento. |
| `afterUpdate`    | Chamado **após a consulta update**. Recebe a instância do modelo como o único argumento. |
| `beforeDelete`   | Chamado **antes da consulta delete**. Recebe a instância do modelo como o único argumento. |
| `afterDelete`    | Chamado **após a consulta delete**. Recebe a instância do modelo como o único argumento. |
| `beforePaginate` | Chamado **antes da consulta paginate**. Recebe a instância do construtor principal da consulta junto com a instância do construtor de consulta count. |
| `afterPaginate`  | Chamado **após a consulta paginate**. Recebe uma instância da classe paginator simples. |
| `beforeFetch`    | Invocado **antes da consulta fetch**. Recebe a instância do construtor de consultas como o único argumento. |
| `afterFetch`     | Invocado **após a consulta fetch**. Recebe uma matriz de instâncias de modelo |
| `beforeFind`     | Invocado **antes da consulta find**. Recebe a instância do construtor de consultas como o único argumento. |
| `afterFind`      | Invocado **após a consulta find**. Recebe a instância do modelo como o único argumento. |

### `beforeSave`
O decorador `beforeSave` registra uma função fornecida como um gancho before invocado antes da consulta **insert** e **update**.

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
O decorador `beforeCreate` registra a função a ser invocada logo antes da operação de inserção.

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
O decorador `beforeUpdate` registra a função a ser invocada logo antes da operação de atualização.

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
O decorador `beforeDelete` registra a função a ser invocada logo antes da operação de exclusão.

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

O gancho `beforeFind` é invocado logo antes da execução da consulta para encontrar uma única linha. Este gancho recebe a instância do construtor de consultas, e você pode anexar suas restrições a ela.

As operações de localização são aquelas que selecionam intencionalmente uma única linha do banco de dados. Por exemplo:

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

O evento `afterFind` recebe a instância do modelo.

```ts
import { BaseModel, afterFind } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @afterFind()
  static afterFindHook(user: User) {}
}
```

### `beforeFetch`

Semelhante ao `beforeFind`, o gancho `beforeFetch` também recebe a instância do construtor de consultas. No entanto, este gancho é invocado sempre que uma consulta é executada sem usar o método `first`.

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

O gancho `afterFetch` recebe uma matriz de instâncias de modelo.

```ts
import { BaseModel, afterFetch } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @afterFetch()
  static afterFetchHook(users: User[]) {}
}
```

### `beforePaginate`

A consulta `beforePaginate` é executada quando você faz uso do método `paginate`. O método paginate dispara os ganchos `beforeFetch` e `beforePaginate`.

A função de gancho recebe uma matriz de construtores de consulta. A primeira instância é para a consulta da contagem e a segunda é para a consulta principal.

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

O hook `afterPaginate` recebe uma instância da classe [SimplePaginator](https://github.com/adonisjs/lucid/blob/efed38908680cca3b288d9b2a123586fab155b1d/src/Database/Paginator/SimplePaginator.ts#L20). O método `paginate` dispara os hooks `afterFetch` e `afterPaginate`.

```ts
import { BaseModel, beforePaginate } from '@adonisjs/lucid/orm'
import type { SimplePaginatorContract } from '@adonisjs/lucid/types/querybuilder'

export default class User extends BaseModel {
  @afterPaginate()
  static afterPaginateHook(users: SimplePaginatorContract<User>) {}
}
```
