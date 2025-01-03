# Ganchos

Ganchos são as **ações que você pode executar em uma instância de modelo** durante um evento de ciclo de vida predefinido. Usando ganchos, você pode encapsular ações específicas dentro de seus modelos em vez de escrevê-las em todos os lugares dentro de sua base de código.

Um ótimo exemplo de ganchos é o hash de senha. Você pode definir um gancho que seja executado antes da chamada `save` e converta a senha de texto simples em um hash.1
```ts {3,16-21}
// app/Models/User.ts

import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public password: string

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
```

- O gancho `beforeSave` é invocado antes das consultas **INSERT** e **UPDATE**.
- Os ganchos podem ser assíncronos. Então você pode usar a palavra-chave `await` dentro deles.
- Os ganchos são sempre definidos como funções estáticas e recebem a instância do modelo como o primeiro argumento.

#### Entendendo a propriedade `$dirty`

O gancho `beforeSave` é chamado toda vez que um novo usuário é **criado** ou **atualizado** usando a instância do modelo.

Durante a atualização, você pode ter atualizado outras propriedades, mas NÃO a senha do usuário. Portanto, não há necessidade de refazer o hash do hash existente, e é por isso que usar o objeto `$dirty`.

O objeto `$dirty` contém apenas os valores alterados. Portanto, você pode verificar se a senha foi alterada e então fazer o hash do novo valor.

## Hooks disponíveis
A seguir está a lista de todos os hooks disponíveis. Certifique-se de ler também os [documentos da API do decorador](../../reference/orm/decorators.md).

| Hook              | Descrição |
|-------------------|------------|
| `beforeSave`      | Chamado **antes da consulta insert ou update**. Recebe a instância do modelo como o único argumento. |
| `afterSave`       | Chamado **após a consulta insert ou update**. Recebe a instância do modelo como o único argumento.|
| `beforeCreate`    | Chamado **antes da consulta insert**. Recebe a instância do modelo como o único argumento.|
| `afterCreate`     | Chamado **após a consulta insert**. Recebe a instância do modelo como o único argumento.|
| `beforeUpdate`    | Chamado **antes da consulta update**. Recebe a instância do modelo como o único argumento.|
| `afterUpdate`     | Chamado **após a consulta update**. Recebe a instância do modelo como o único argumento.|
| `beforeDelete`    | Chamado **antes da consulta delete**. Recebe a instância do modelo como o único argumento.|
| `afterDelete`     | Chamado **após a consulta delete**. Recebe a instância do modelo como o único argumento. |
| `beforePaginate`  | Chamado **antes da consulta paginate**. Recebe a instância do construtor principal da consulta junto com a instância do construtor de consulta count. |
| `afterPaginate`   | Chamado **após a consulta paginate**. Recebe uma instância da classe paginator simples. |
| `beforeFetch`     | Chamado **antes da consulta fetch**. Recebe a instância do construtor de consultas como o único argumento. |
| `afterFetch`      | Invocado **após a consulta fetch**. Recebe uma matriz de instâncias de modelo |
| `beforeFind`      | Invocado **antes da consulta find**. Recebe a instância do construtor de consultas como o único argumento. |
| `afterFind`       | Invocado **após a consulta find**. Recebe a instância de modelo como o único argumento. |

**Todos os ganchos recebem a instância do modelo como o primeiro argumento, exceto os documentados abaixo.**

### `beforeFind`
O gancho `beforeFind` é invocado logo antes da execução da consulta para encontrar uma única linha. Este gancho recebe a instância do construtor de consultas, e você pode anexar suas restrições a ela.

```ts
import {
  BaseModel,
  beforeFind,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @beforeFind()
  public static ignoreDeleted (query: ModelQueryBuilderContract<typeof User>) {
    query.whereNull('is_deleted')
  }
}
```

### `afterFind`
O evento `afterFind` recebe a instância do modelo.

```ts
import {
  BaseModel,
  afterFind,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @afterFind()
  public static afterFindHook (user: User) {
  }
}
```

### `beforeFetch`
Semelhante ao `beforeFind`, o gancho `beforeFetch` também recebe a instância do construtor de consultas. No entanto, este gancho é invocado sempre que uma consulta é executada sem usar o método `first`.

```ts
import {
  BaseModel,
  beforeFetch,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @beforeFetch()
  public static ignoreDeleted (query: ModelQueryBuilderContract<typeof User>) {
    query.whereNull('is_deleted')
  }
}
```

### `afterFetch`
O gancho `afterFetch` recebe uma matriz de instâncias do modelo.

```ts
import {
  BaseModel,
  afterFetch,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @afterFetch()
  public static afterFetchHook (users: User[]) {
  }
}
```

### `beforePaginate`
A consulta `beforePaginate` é executada quando você faz uso do método `paginate`. O método paginate dispara os ganchos `beforeFetch` e `beforePaginate`.

A função de gancho recebe uma matriz de construtores de consulta. A primeira instância é para a consulta da contagem e a segunda é para a consulta principal.

```ts
import {
  BaseModel,
  beforePaginate,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @beforePaginate()
  public static ignoreDeleted (
    countQuery: ModelQueryBuilderContract<typeof User>,
    query: ModelQueryBuilderContract<typeof User>
  ) {
    query.whereNull('is_deleted')
    countQuery.whereNull('is_deleted')
  }
}
```

### `afterPaginate`
O gancho `afterPaginate` recebe uma instância da classe [SimplePaginator](../../reference/database/query-builder.md#pagination). O método `paginate` dispara os ganchos `afterFetch` e `afterPaginate`.

```ts
import {
  BaseModel,
  afterPaginate,
} from '@ioc:Adonis/Lucid/Orm'

import {
  SimplePaginatorContract
} from '@ioc:Adonis/Lucid/Database'

export default class User extends BaseModel {
  @afterPaginate()
  public static afterPaginateHook (users: SimplePaginatorContract<User>) {
  }
}
```
