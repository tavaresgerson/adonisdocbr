# Muitos para muitos

A [classe de relacionamento Muitos para muitos](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/ManyToMany/index.ts) gerencia o relacionamento muitos para muitos entre dois modelos.

Você não se verá trabalhando diretamente com esta classe. No entanto, uma instância da classe pode ser acessada usando o método `Model.$getRelation`.

```ts
import { BaseModel, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Project from 'App/Models/Project'

class User extends BaseModel {
  @manyToMany(() => Project)
  public projects: ManyToMany<typeof Project>
}
```

```ts
User.$getRelation('projects').relationName
User.$getRelation('projects').type
User.$getRelation('projects').relatedModel()
```

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis no relacionamento `ManyToMany`.

### `type`
O tipo do relacionamento. O valor é sempre definido como `manyToMany`.

```ts
class User extends BaseModel {
  @manyToMany(() => Project)
  public projects: ManyToMany<typeof Project>
}

User.$getRelation('projects').type // 'manyToMany'
```

### `relationName`
O nome do relacionamento. É um nome de propriedade definido no modelo pai.

```ts
class User extends BaseModel {
  @manyToMany(() => Project)
  public projects: ManyToMany<typeof Project>
}

User.$getRelation('projects').relationName // 'projects'
```

### `serializeAs`
O nome a ser usado para serializar o relacionamento. Você pode defini-lo usando as opções do decorador.

```ts
class User extends BaseModel {
  @manyToMany(() => Project, {
    serializeAs: 'teamProjects'
  })
  public projects: ManyToMany<typeof Project>
}
```

### `booted`
Descubra se o relacionamento foi inicializado. Caso contrário, chame o método `boot`.

### `boot`
Inicialize o relacionamento. As APIs públicas dos modelos Lucid chamam esse método internamente, e você nunca precisa inicializar o relacionamento manualmente.

### `model`
Referência ao modelo pai (aquele que define o relacionamento).

```ts
class User extends BaseModel {
  @manyToMany(() => Project, {
    serializeAs: 'teamProjects'
  })
  public projects: ManyToMany<typeof Project>
}

User.$getRelation('projects').model // User
```

### `relatedModel`
Referência ao modelo de relacionamento. O valor da propriedade é uma função que retorna o modelo relacionado.

```ts
class User extends BaseModel {
  @manyToMany(() => Project, {
    serializeAs: 'teamProjects'
  })
  public projects: ManyToMany<typeof Project>
}

User.$getRelation('projects').relatedModel() // Project
```

### `localKey`
A `localKey` para o relacionamento. Você deve ler o documento [NamingStrategy](../naming-strategy.md#relationlocalkey) para saber mais sobre como o nome da chave é computado.

Você também pode definir a `localKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class User extends BaseModel {
  @column()
  public id: number

  @manyToMany(() => Project, {
    localKey: 'id', // coluna id no modelo "User"
  })
  public projects: ManyToMany<typeof Project>
}
```

### `relatedKey`
A `relatedKey` para o relacionamento. Esta é geralmente a chave primária no modelo relacionado. Por exemplo, a coluna `id` no modelo do Projeto.

Você também pode definir a `relatedKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class User extends BaseModel {
  @manyToMany(() => Project, {
    relatedKey: 'id', // coluna id no modelo "Project"
  })
  public projects: ManyToMany<typeof Project>
}
```

### `pivotForeignKey`
O `pivotForeignKey` é o nome da coluna dentro da tabela dinâmica para o modelo pai. Por
exemplo: A coluna `user_id` dentro da tabela dinâmica é o `pivotForeignKey`.

Você também pode definir o `pivotForeignKey` explicitamente. Além disso, como não há um modelo dinâmico, você define o nome da coluna do banco de dados diretamente.

```ts
class User extends BaseModel {
  @manyToMany(() => Project, {
    pivotForeignKey: 'user_id',
  })
  public projects: ManyToMany<typeof Project>
}
```

### `pivotRelatedForeignKey`
O `pivotRelatedForeignKey` é o nome da coluna dentro da tabela dinâmica para o modelo relacionado. Por
exemplo: A coluna `project_id` dentro da tabela dinâmica é o `pivotRelatedForeignKey`.

Você também pode definir o `pivotRelatedForeignKey` explicitamente. Além disso, como não há um modelo de pivô, você define o nome da coluna do banco de dados diretamente.

```ts
class User extends BaseModel {
  @manyToMany(() => Project, {
    pivotRelatedForeignKey: 'project_id',
  })
  public projects: ManyToMany<typeof Project>
}
```

### `pivotTable`
A propriedade `pivotTable` define a tabela dinâmica para consultar para persistir/buscar linhas relacionadas. Certifique-se de ler o guia [estratégia de nomenclatura](../naming-strategy.md#relationpivottable) para saber mais sobre como o nome da tabela é computado.

Você também pode definir o nome `pivotTable` explicitamente.

```ts
class User extends BaseModel {
  @manyToMany(() => Project, {
    pivotTable: 'user_projects'
  })
  public projects: ManyToMany<typeof Project>
}
```

### `pivotColumns`
Defina as colunas que você deseja que o Lucid selecione ao buscar relacionamentos muitos para muitos. Por padrão, ele seleciona apenas as colunas `pivotRelatedForeignKey` e `pivotForeignKey`.

```ts
class User extends BaseModel {
  @manyToMany(() => Project, {
    pivotColumns: ['role', 'created_at', 'updated_at']
  })
  public projects: ManyToMany<typeof Project>
}
```

### `onQuery`
O método `onQuery` é um gancho opcional para modificar as consultas de relacionamento. Ele recebe uma instância do [ManyToManyQueryBuilder](#query-builder).

Você pode definir o gancho no momento da declaração da relação.

```ts
class User extends BaseModel {
  @manyToMany(() => Project, {
    onQuery(query) {
      query.where('isActive', true)
    }
  })
  public projects: ManyToMany<typeof Project>
}
```

Se você quiser pré-carregar um relacionamento aninhado usando o gancho `onQuery`, certifique-se de colocá-lo dentro do condicional `!query.isRelatedSubQuery` porque as subconsultas **NÃO são executadas diretamente**, elas são usadas dentro de outras consultas.

```ts {4-6}
class User extends BaseModel {
  @manyToMany(() => Project, {
    onQuery(query) {
      if (!query.isRelatedSubQuery) {
        query.preload('tasks')
      }
    }
  })
  public projects: ManyToMany<typeof Project>
}
```

### `setRelated`
Defina um relacionamento na instância do modelo pai. Os métodos aceitam o modelo pai como o primeiro argumento e a instância do modelo relacionada como o segundo argumento.

Você deve garantir que ambas as instâncias do modelo estejam relacionadas entre si antes de chamar este método.

```ts
const user = new User()
const project = new Project()

User.$getRelation('projects').setRelated(user, [project])
```

### `pushRelated`
O método `pushRelated` envia o relacionamento para a matriz de valores de relacionamento existente.

```ts
const user = new User()

User.$getRelation('projects').pushRelated(user, new Project())
User.$getRelation('projects').pushRelated(user, new Project())
User.$getRelation('projects').pushRelated(user, new Project())

user.projects.length // 3
```

### `setRelatedForMany`
Defina os relacionamentos em mais de um modelo pai. O método aceita uma matriz dos modelos pais como o primeiro argumento e uma matriz de modelos relacionados como o segundo argumento.

O Lucid chama isso internamente com os resultados do pré-carregador.

```ts
const users = [
  User {
    id: 1,
  },
  User {
    id: 2,
  },
  User {
    id: 3,
  }
]

const projects = [
  Project {
    id: 1,
    $extras: {
      pivot_user_id: 1,
    }
  },
  Project {
    id: 2,
    $extras: {
      pivot_user_id: 1,
    }
  },
  Project {
    id: 3,
    $extras: {
      pivot_user_id: 2,
    }
  },
  Project {
    id: 4,
    $extras: {
      pivot_user_id: 3,
    }
  }
]

User.$getRelation('projects').setRelatedForMany(users, projects)
```

### `client`
Retorna a referência para [ManyToManyQueryClient](#query-client). O cliente de consulta expõe a API para persistir/buscar linhas relacionadas do banco de dados.

### `getPivotPair`
Retorna uma tupla com `pivotForeignKey` e seu valor do modelo pai. O método aceita o modelo pai como o único argumento.

```ts
const user = await User.find(1)

User.$getRelation('projects').getPivotPair(user)

// Valor de retorno: ['user_id', 1]
```

### `getPivotRelatedPair`
Retorna uma tupla com `pivotRelatedForeignKey` e seu valor do modelo relacionado. O método aceita o modelo relacionado como o único argumento.

```ts
const project = await Project.find(1)

User.$getRelation('projects').getPivotRelatedPair(project)

// Valor de retorno: ['project_id', 1]
```

### `eagerQuery`
Retorna uma instância do [ManyToManyQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/ManyToMany/QueryBuilder.ts). O construtor de consultas tem a mesma API que o [Construtor de consultas do modelo](../query-builder.md)

### `subQuery`
Retorna uma instância do [ManytoManySubQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/ManytoMany/SubQueryBuilder.ts). As subconsultas não devem ser executadas e são usadas principalmente pelos métodos [withCount](../query-builder.md#withcount) e [whereHas](../query-builder.md#wherehas).

## Cliente de consulta
O cliente de consulta expõe a API para persistir/buscar linhas relacionadas do banco de dados. Você pode acessar o cliente de consulta para um relacionamento usando o método `related`.

```ts
const user = await User.find(1)

user.related('projects') // ManytoManyClientContract
```

### `create`
Crie uma nova instância de modelo de relacionamento e persista no banco de dados imediatamente. O método também insere uma nova linha na tabela dinâmica.

```ts
const project = await user
  .related('projects')
  .create({
    title: 'Shipping v5',
  })
```

Você pode definir os atributos dinâmicos como o segundo argumento.

```ts
await user
  .related('projects')
  .create({
    title: 'Shipping v5',
  }, {
    role: 'admin'
  })
```

O método `create` herda o cliente de transação ou o nome da conexão definido na instância do modelo pai. Por exemplo:

```ts
const trx = await Database.transaction()
const user = await User.query({ client: trx }).first()

/**
* Uses the `$trx` property from the `user` instance to
* persist relationship
*/
await user.related('projects').create()

await trx.commit()
```

### `createMany`
Cria várias instâncias de um modelo de relacionamento e persiste-as no banco de dados. O método aceita uma matriz de objetos para persistir.

- Uma consulta de inserção é emitida para cada instância do modelo para garantir que executemos os ganchos do ciclo de vida para cada instância individual.
- Todas as consultas de inserção são encapsuladas internamente dentro de uma transação. Em caso de erro, reverteremos tudo.

```ts
await user.related('projects').createMany([
  {
    title: 'Shipping v5',
  },
  {
    title: 'Recording screencasts'
  }
])
```

Os atributos de pivô podem ser definidos como o segundo argumento. Deve ser uma matriz com o mesmo comprimento da matriz de dados.

```ts
await user.related('projects').createMany([
  {
    title: 'Shipping v5',
  },
  {
    title: 'Recording screencasts'
  }
], [
  {
    role: 'admin'
  },
  undefined // não defina nenhum atributo de pivô
])
```

### `save`
O método save persiste uma instância existente do relacionamento. Assim como o método `create`, o método `save` também aceita um objeto de atributo de pivô opcional como o segundo argumento.

```ts
const project = new Project()
project.title = 'Shipping v5'

const user = await User.find(1)

await user
  .related('projects')
  .save(project)

project.$isPersisted // true
project.$extras.pivot_user_id // 1
project.$extras.pivot_project_id === project.id // true
```

Opcionalmente, você pode instruir o método `save` para verificar a tabela dinâmica antes de adicionar uma nova linha.

```ts
await user
  .related('projects')
  .save(
    project,
    {},
    true // 👈 não adicione nova linha quando a tabela de pivô já tiver esse relacionamento
  )
```

### `saveMany`
O método `saveMany` persiste uma matriz de instâncias de modelo relacionadas ao banco de dados.

- Uma consulta de inserção é emitida para cada instância de modelo para garantir que executemos os ganchos do ciclo de vida para cada instância individual.
- Todas as consultas de inserção são encapsuladas internamente dentro de uma transação. Em caso de erro, reverteremos tudo.

```ts
const project = new Project()
project.title = 'Shipping v5'

const project1 = new Project()
project1.title = 'Recording screencasts'

await user
  .related('post')
  .saveMany([project, project1])
```

### `attach`
O método attach permite que você configure relacionamentos dentro da tabela dinâmica usando apenas os IDs. Por exemplo:

```ts
const user = await User.find(1)
const project = await Project.find(1)

await user.related('projects').attach([project.id])
```

Você pode definir atributos de pivô passando um par chave-valor. `key` é o id do modelo relacionado, e `value` é um objeto de atributos de pivô.

```ts
await user.related('projects').attach({
  [project.id]: {
    role: 'admin'
  }
})
```

### `detach`
O método `detach` remove o relacionamento da tabela dinâmica. Você pode passar uma matriz de ids de modelos relacionados ou chamar o método `detach` sem nenhum argumento para remover todas as linhas relacionadas.

```ts
// Remova projetos com id 1, 2, 3
await user.related('projects').detach([1, 2, 3])
```

```ts
// Remova todos os projetos
await user.related('projects').detach()
```

### `sync`
O método `sync` permite que você sincronize uma matriz de ids de modelos relacionados na tabela dinâmica. A operação de sincronização é realizada considerando a entrada como a fonte real da verdade.

```ts
await user
  .related('projects')
  .sync([1, 2, 4, 5])
```

No exemplo acima, o método `sync` manterá apenas os projetos com os ids mencionados e removerá os outros.

Você pode alterar esse comportamento passando `false` como o segundo argumento para o método `sync`, e então ele anexará os IDs mencionados sem desanexar os outros.

No exemplo a seguir, o método `sync` anexará (somente se eles ainda não estiverem) os projetos com o ID de **"1"** e **"2"** sem desanexar nenhum ID existente.

```ts
await user
  .related('projects')
  .sync([1, 2], false)
```

Você também pode executar uma sincronização com atributos de pivô.

```ts
await user
  .related('projects')
  .sync({
    [1]: {
      role: 'admin'
    },
    [4]: {
      role: 'guest',
    },
    [3]: {
      role: null,
    }
  })
```

O método `sync` calculará o diff entre as linhas de pivô existentes e os dados de entrada e executará consultas `insert`, `update` e `delete` conforme o diff.

### `query`
Retorna uma instância do [ManyToManyQueryBuilder](#query-builder).

## Query Builder
O [ManyToMany Query Builder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/ManyToMany/QueryBuilder.ts) tem os seguintes métodos adicionais além de um construtor de consulta de modelo padrão.

Você pode acessar o construtor de consulta de relacionamento da seguinte forma:

```ts
const user = await User.find(1)

user.related('projects').query() // ManytoManyQueryBuilder
```

### `pivotColumns`
Selecione colunas da tabela dinâmica. Este método prefixará o nome da tabela dinâmica para a coluna nos bastidores e o aliasará para `pivot_[column_name]`.

```ts
user
  .related('projects')
  .query()
  .pivotColumns(['role']) // select project_user.role as pivot_role
```

### `wherePivot`
Escreva uma condicional `where` para a tabela dinâmica. O método tem a mesma API que o método [where](../../database/query-builder.md#where) em um construtor de consultas padrão. Ele prefixará o nome da tabela dinâmica ao nome da coluna.

```ts
user
  .related('projects')
  .query()
  .wherePivot('role', 'admin') // where project_user.role = ?
```

A seguir está a lista de variações do método `wherePivot` e compartilha a mesma API.

| Método              | Descrição                         |
|---------------------|-----------------------------------|
| `andWherePivot`     | Alias ​​para o método `wherePivot` |
| `orWherePivot`      | Adiciona uma cláusula **or where** |
| `whereNotPivot`     | Adiciona uma cláusula **where not** |
| `orWhereNotPivot`   | Adiciona uma cláusula **or where not** |
| `andWhereNotPivot`  | Alias ​​para `whereNotPivot` |

### `whereInPivot`
O mesmo que o método [whereIn](../../database/query-builder.md#wherein) em um construtor de consultas padrão. No entanto, ele prefixa o nome da tabela dinâmica na frente do nome da coluna.

```ts
user
  .related('projects')
  .query()
  .whereInPivot('role', ['admin', 'collaborator']) 
```

A seguir está a lista de variações do método `whereInPivot` e compartilha a mesma API.

| Método                | Descrição |
|-----------------------|-------------|
| `andWhereInPivot`     | Alias ​​para o método `whereInPivot`        |
| `orWhereInPivot`      | Adiciona uma cláusula **or where in**     |
| `whereNotInPivot`     | Adiciona uma cláusula **where not in**    |
| `orWhereNotInPivot`   | Adiciona uma cláusula **or where not in** |
| `andWhereNotInPivot`  | Alias ​​para `whereNotInPivot`              |

### `whereNullPivot`
O mesmo que o método [whereNull](../../database/query-builder.md#wherenull) em um construtor de consultas padrão. No entanto, ele prefixa o nome da tabela dinâmica na frente do nome da coluna.

```ts
user
  .related('projects')
  .query()
  .whereNullPivot('deleted_at')
```

A seguir está a lista de variações do método `whereNullPivot` e compartilha a mesma API.

| Método                  | Descrição                                   |
|-------------------------|---------------------------------------------|
| `andWhereNullPivot`     | Alias ​​para o método `whereNullPivot`        |
| `orWhereNullPivot`      | Adiciona uma cláusula **or where null**     |   
| `whereNotNullPivot`     | Adiciona uma cláusula **where not null**    |
| `orWhereNotNullPivot`   | Adiciona uma cláusula **or where not null** |
| `andWhereNotNullPivot`  | Alias ​​para `whereNotNullPivot`              |

### `groupLimit`
O método `groupLimit` usa [funções de janela SQL](https://www.sqlservertutorial.net/sql-server-window-functions/sql-server-row_number-function/) para adicionar um limite a cada grupo durante o pré-carregamento de relacionamento. Leia o [guia de pré-carregamento](../../../guides/models/relationships.md#preload-relationship) para saber por que e quando você precisa do método `groupLimit`.

```ts
await User.query().preload('projects', (query) => {
  query.groupLimit(10)
})
```

### `groupOrderBy`
Adicione uma cláusula order by à consulta de limite de grupo. O método tem a mesma API que o método `orderBy` no construtor de consulta padrão.

::: info NOTA
Você só precisa aplicar `groupOrderBy` ao usar o método `groupLimit`.
:::

```ts
await User.query().preload('projects', (query) => {
  query
    .groupLimit(10)
    .groupOrderBy('projects.updated_at', 'desc')
})
```
