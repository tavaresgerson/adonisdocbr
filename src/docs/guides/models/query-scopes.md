# Escopos de consulta

Os escopos de consulta são a função reutilizável para aplicar a uma instância do construtor de consulta para modificar a consulta.

Os métodos são definidos como propriedades estáticas na classe do modelo e recebem a consulta atual como o primeiro argumento. Por exemplo:

```ts
// app/Models/Post.ts

import { DateTime } from 'luxon'

import {
  BaseModel,
  column,
  scope // 👈 método de escopo de importação
} from '@ioc:Adonis/Lucid/Orm'

export default class Post extends BaseModel {
  public static published = scope((query) => {
    query.where('publishedOn', '<=', DateTime.utc().toSQLDate())
  })
}
```

Você pode aplicar o escopo `published` em uma consulta usando o método `withScopes`. Ele aceita um retorno de chamada e fornece acesso a todos os escopos como métodos.

```ts
Post
  .query()
  .withScopes((scopes) => scopes.published())
```

## Passando argumentos para os escopos
Os escopos de consulta também podem aceitar argumentos. Por exemplo: Criando um escopo que aceita um objeto de usuário para definir o escopo dos projetos que eles podem visualizar.

```ts
import { DateTime } from 'luxon'
import User from 'App/Models/User'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Project extends BaseModel {

  public static visibleTo = scope((query, user: User) => {
    if (user.isAdmin) {
      return
    }

    /**
     * Usuários não administradores podem visualizar apenas os projetos de sua própria equipe
     */
    query.where('teamId', user.teamId)
  })

}
```

Agora, você pode chamar o método `scopes.visibleTo` e passar os argumentos necessários.

```ts
Project
  .query()
  .withScopes((scopes) => scopes.visibleTo(auth.user))
```

## Chamando escopos dentro dos escopos
Como o método de escopo recebe uma instância do [Model query builder](../../reference/database/orm/query-builder.md), você também pode referenciar outros escopos de modelo dentro do retorno de chamada do escopo. Por exemplo:

```ts
import {
  scope,
  column,
  BaseModel,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

type Builder = ModelQueryBuilderContract<typeof Post>

export default class Post extends BaseModel {
  public static firstScope = scope((query: Builder) => {
    query.withScopes((scopes) => scopes.secondScope())
  })

  public static secondScope = scope((query) => {
    query.whereNull('deletedAt')
  })
}
```

#### Percebeu o tipo `Builder` que criamos acima?

O método `scope` não está ciente do Model em que é usado (uma limitação do TypeScript) e, portanto, não pode inferir o tipo Query builder para o modelo também. Portanto, precisamos dar uma dica de tipo para a propriedade `builder` da seguinte forma:

```ts {1,4}
type Builder = ModelQueryBuilderContract<typeof Post>

public static firstScope = scope(
  (query: Builder) => {
  }
)
```
