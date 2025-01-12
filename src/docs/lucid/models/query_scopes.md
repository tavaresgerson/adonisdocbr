---
resumo: Aprenda como usar escopos de consulta para definir funções de construtor de consulta reutilizáveis.
---

# Escopos de consulta

Os escopos de consulta são a função reutilizável para aplicar a uma instância do construtor de consulta para modificar a consulta.

Os métodos são definidos como propriedades estáticas na classe de modelo e recebem a consulta atual como o primeiro argumento. Por exemplo:

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

Você pode aplicar o escopo `published` em uma consulta usando o método `withScopes`. Ele aceita um retorno de chamada e dá acesso a todos os escopos como métodos.

```ts
Post.query().withScopes((scopes) => scopes.published())
```

## Passando argumentos para os escopos

Os escopos de consulta também podem aceitar argumentos. Por exemplo: Criando um escopo que aceita um objeto de usuário para definir o escopo dos projetos que eles podem visualizar.

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

Agora, você pode chamar o método `scopes.visibleTo` e passar os argumentos necessários.

```ts
Project.query().withScopes((scopes) => scopes.visibleTo(auth.user))
```

## Chamando escopos dentro dos escopos

Como o método de escopo recebe uma instância do [Model query builder](./query_builder.md), você pode referenciar outros escopos de modelo dentro do retorno de chamada do escopo.

No entanto, o método de escopo é estático, então ele não está ciente do modelo no qual é usado (uma limitação do TypeScript). Consequentemente, ele não pode inferir o tipo de construtor de consulta para o modelo.

Portanto, precisamos criar um tipo `Builder` da seguinte forma:

```ts
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

// highlight-start
type Builder = ModelQueryBuilderContract<typeof Post>
// highlight-end
```

Então, você pode sugerir a propriedade `builder` da seguinte forma:

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

Se você também quiser passar argumentos, você precisa converter a `query` dentro do método:

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
