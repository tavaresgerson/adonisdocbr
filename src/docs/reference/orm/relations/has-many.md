# Tem Muitos

A [classe de relacionamento HasMany](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasMany/index.ts) gerencia o relacionamento has many entre dois modelos.

Você não trabalhará diretamente com essa classe. No entanto, uma instância da classe pode ser acessada usando o método `Model.$getRelation`.

```ts
import { BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Post from 'App/Models/Post'

class User extends BaseModel {
  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}
```

```ts
User.$getRelation('posts').relationName
User.$getRelation('posts').type
User.$getRelation('posts').relatedModel()
```

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis no relacionamento `HasMany`.

### `type`
O tipo do relacionamento. O valor é sempre definido como `hasMany`.

```ts
class User extends BaseModel {
  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}

User.$getRelation('posts').type // 'hasMany'
```

### `relationName`
O nome do relacionamento. É um nome de propriedade definido no modelo pai.

```ts
class User extends BaseModel {
  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}

User.$getRelation('posts').relationName // 'posts'
```

### `serializeAs`
O nome a ser usado para serializar o relacionamento. Você pode defini-lo usando as opções do decorador.

```ts
class User extends BaseModel {
  @hasMany(() => Post, {
    serializeAs: 'articles'
  })
  public posts: HasMany<typeof Post>
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
  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}

User.$getRelation('posts').model // User
```

### `relatedModel`
Referência ao modelo de relacionamento. O valor da propriedade é uma função que retorna o modelo relacionado.

```ts
class User extends BaseModel {
  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}

User.$getRelation('posts').relatedModel() // Post
```

### `localKey`
A `localKey` para o relacionamento. Você deve ler o documento [NamingStrategy](../naming-strategy.md#relationlocalkey) para saber mais sobre como o nome da chave é computado.

Você também pode definir a `localKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class User extends BaseModel {
  @column()
  public id: number

  @hasMany(() => Post, {
    localKey: 'id', // coluna id no modelo "Usuário"
  })
  public posts: HasMany<typeof Post>
}
```

### `foreignKey`
A `foreignKey` para o relacionamento. Você deve ler o documento [NamingStrategy](../naming-strategy.md#relationlocalkey) para saber mais sobre como o nome da chave é computado.

Você também pode definir a `foreignKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class User extends BaseModel {
  @column()
  public id: number

  @hasMany(() => Post, {
    foreignKey: 'userId', // coluna userId no modelo "Post"
  })
  public posts: HasMany<typeof Post>
}
```

### `onQuery`
O método `onQuery` é um gancho opcional para modificar as consultas de relacionamento. Você pode defini-lo no momento da declaração da relação.

```ts
class User extends BaseModel {
  @column()
  public id: number

  @hasMany(() => Post, {
    onQuery(query) {
      query.where('isPublished', true)
    }
  })
  public posts: HasMany<typeof Post>
}
```

Se você quiser pré-carregar um relacionamento aninhado usando o hook `onQuery`, certifique-se de colocá-lo dentro do condicional `!query.isRelatedSubQuery` porque subconsultas **NÃO são executadas diretamente**, elas são usadas dentro de outras consultas.

```ts {7-9}
class User extends BaseModel {
  @column()
  public id: number

  @hasMany(() => Post, {
    onQuery(query) {
      if (!query.isRelatedSubQuery) {
        query.preload('comments')
      }
    }
  })
  public posts: HasMany<typeof Post>
}
```

### `setRelated`
Defina um relacionamento na instância do modelo pai. Os métodos aceitam o modelo pai como o primeiro argumento e a instância do modelo relacionado como o segundo argumento.

Você deve garantir que ambas as instâncias do modelo estejam relacionadas entre si antes de chamar este método.

```ts
const user = new User()
const post = new Post()

User.$getRelation('posts').setRelated(user, [post])
```

### `pushRelated`
O método `pushRelated` envia o relacionamento para a matriz de valores de relacionamento existente.

```ts
const user = new User()

User.$getRelation('posts').pushRelated(user, new Post())
User.$getRelation('posts').pushRelated(user, new Post())
User.$getRelation('posts').pushRelated(user, new Post())

user.posts.length // 3
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

const posts = [
  Post {
    id: 1,
    user_id: 1,
  },
  Post {
    id: 2,
    user_id: 1,
  },
  Post {
    id: 3,
    user_id: 2,
  },
  Post {
    id: 4,
    user_id: 3,
  }
]

User.$getRelation('posts').setRelatedForMany(users, posts)
```

### `client`
Retorna a referência para [HasManyQueryClient](#query-client). O cliente de consulta expõe a API para persistir/buscar linhas relacionadas do banco de dados.

### `hydrateForPersistance`
Hidrata os valores para persistência definindo o valor foreignKey. O método aceita o modelo pai como o primeiro argumento e um objeto ou a instância do modelo relacionado como o segundo argumento.

```ts
const user = new User()
user.id = 1

const post = new Post()
User.$getRelation('posts').hydrateForPersistance(user, post)

console.log(post.userId === user.id) // true
```

### `eagerQuery`
Retorna uma instância do [HasManyQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasMany/QueryBuilder.ts). O construtor de consultas tem a mesma API que o [Construtor de consultas do modelo](../query-builder.md)

### `subQuery`
Retorna uma instância do [HasManySubQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasMany/SubQueryBuilder.ts). As subconsultas não devem ser executadas e são usadas principalmente pelos métodos [withCount](../query-builder.md#withcount) e [whereHas](../query-builder.md#wherehas).

## Cliente de consulta
O cliente de consulta expõe a API para persistir/buscar linhas relacionadas do banco de dados. Você pode acessar o cliente de consulta para um relacionamento usando o método `related`.

```ts
const user = await User.find(1)

user.related('posts') // HasManyClientContract
```

### `create`
Crie uma nova instância de modelo de relacionamento e persista no banco de dados imediatamente.

```ts
const post = await user
  .related('posts')
  .create({
    title: 'Adonis 101'
  })
```

O método `create` herda o cliente de transação ou o nome de conexão definido na instância do modelo pai. Por exemplo:

```ts
const trx = await Database.transaction()
const user = await User.query({ client: trx }).first()

/**
* Usa a propriedade `$trx` da instância `user` para
* persistir o relacionamento
*/
await user.related('posts').create()

await trx.commit()
```

### `createMany`
Crie várias instâncias de um modelo de relacionamento e persista-as no banco de dados. O método aceita uma matriz de objetos para persistir.

- Uma consulta de inserção é emitida para cada instância do modelo para garantir que executemos os ganchos do ciclo de vida para cada instância individual.
- Todas as consultas de inserção são encapsuladas internamente dentro de uma transação. Em caso de erro, reverteremos tudo.

```ts
await user.related('posts').createMany([
  {
    title: 'Adonis 101',
  },
  {
    title: 'Lucid 101'
  }
])
```

### `save`
O método save persiste uma instância existente do relacionamento.

Assim como o método `create`, o método `save` também usa o nome do cliente/conexão da transação do modelo pai.

```ts
const post = new Post()
post.title = 'Adonis 101'

const post = await user
  .related('post')
  .save(post)
```

### `saveMany`
O método `saveMany` persiste uma matriz de instâncias de modelo relacionadas ao banco de dados.

- Uma consulta de inserção é emitida para cada instância de modelo para garantir que executemos os ganchos do ciclo de vida para cada instância individual.
- Todas as consultas de inserção são encapsuladas internamente dentro de uma transação. Em caso de erro, reverteremos tudo.

```ts
const post = new Post()
post.title = 'Adonis 101'

const post1 = new Post()
post1.title = 'Lucid 101'

const post2 = new Post()
post2.title = 'Validator 101'

const post = await user
  .related('post')
  .saveMany([post, post1, post2])
```

### `firstOrCreate`
O método `firstOrCreate` funciona de forma semelhante ao método [static firstOrCreate](../base-model.md#static-firstorcreate) no modelo base. No entanto, nós **implicitamente adicionamos a foreignKey e seu valor** à carga útil da pesquisa.

```ts
await user
  .related('posts')
  .firstOrCreate({}, {
    title: 'Adonis 101',
  })
```

### `updateOrCreate`
O método `updateOrCreate` funciona de forma semelhante ao método [static updateOrCreate](../base-model.md#static-updateorcreate) no modelo base. No entanto, nós **implicitamente adicionamos a foreignKey e seu valor** à carga útil da pesquisa.

```ts
await user
  .related('posts')
  .updateOrCreate({}, {
    title: 'Adonis 101',
  })
```

### `fetchOrCreateMany`
O método `fetchOrCreateMany` funciona de forma semelhante ao método [static fetchOrCreateMany](../base-model.md#static-fetchorcreatemany) no modelo base. No entanto, nós **implicitamente adicionamos a foreignKey como a chave de pesquisa** para encontrar linhas exclusivas.

No exemplo a seguir, somente as postagens com um **slug exclusivo** para **um determinado usuário** serão criadas.

```ts
const posts = [
  {
    title: 'Adonis 101',
    slug: 'adonis-101',
  },
  {
    title: 'Lucid 101',
    slug: 'lucid-101',
  }
]

await user
  .related('posts')
  .fetchOrCreateMany(posts, 'slug')
```

### `updateOrCreateMany`
O método `updateOrCreateMany` funciona de forma semelhante ao método [static updateOrCreateMany](../base-model.md#static-updateorcreatemany) no modelo base. No entanto, **implicitamente adicionamos a foreignKey como a chave de pesquisa** para encontrar linhas exclusivas.

No exemplo a seguir, somente as postagens com um **slug exclusivo** para **um determinado usuário** serão criadas.

```ts
const posts = [
  {
    title: 'Adonis 101',
    slug: 'adonis-101',
  },
  {
    title: 'Lucid 101',
    slug: 'lucid-101',
  }
]

await user
  .related('posts')
  .updateOrCreateMany(posts, 'slug')
```

### `query`
Retorna uma instância do [HasManyQueryBuilder](#query-builder).

## Query Builder
O [HasManyQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasMany/QueryBuilder.ts) tem os seguintes métodos adicionais além de um construtor de consulta de modelo padrão.

Você pode acessar o construtor de consulta de relacionamento da seguinte forma:

```ts
const user = await User.find(1)

user.related('posts').query() // HasManyQueryBuilder
```

### `groupLimit`
O método `groupLimit` usa [funções de janela SQL](https://www.sqlservertutorial.net/sql-server-window-functions/sql-server-row_number-function/) para adicionar um limite a cada grupo durante o pré-carregamento de relacionamento. Leia o [guia de pré-carregamento](../../guides) para saber por que e quando você precisa do método `groupLimit`.

```ts
await User.query().preload('posts', (query) => {
  query.groupLimit(10)
})
```

### `groupOrderBy`
Adicione uma cláusula order by à consulta de limite de grupo. O método tem a mesma API que o método `orderBy` no construtor de consultas padrão.

::: info NOTA
Você só precisa aplicar `groupOrderBy` ao usar o método `groupLimit`.
:::

```ts
await User.query().preload('posts', (query) => {
  query
    .groupLimit(10)
    .groupOrderBy('posts.created_at', 'desc')
})
```
