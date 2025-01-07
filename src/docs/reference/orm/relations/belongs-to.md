# Belongs to

A [classe de relacionamento BelongsTo](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/BelongsTo/index.ts) gerencia o pertence ao relacionamento entre dois modelos.

Você não se verá trabalhando diretamente com esta classe. No entanto, uma instância da classe pode ser acessada usando o método `Model.$getRelation`.

```ts
import { BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

class Post extends BaseModel {
  @belongsTo(() => User)
  public author: BelongsTo<typeof User>
}
```

```ts
Post.$getRelation('author').relationName
Post.$getRelation('author').type
Post.$getRelation('author').relatedModel()
```

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis no relacionamento `BelongsTo`.

### `type`
O tipo do relacionamento. O valor é sempre definido como `belongsTo`.

```ts
class Post extends BaseModel {
  @belongsTo(() => User)
  public author: BelongsTo<typeof User>
}

Post.$getRelation('author').type // 'belongsTo'
```

### `relationName`
O nome do relacionamento. É um nome de propriedade definido no modelo pai.

```ts
class Post extends BaseModel {
  @belongsTo(() => User)
  public author: BelongsTo<typeof User>
}

Post.$getRelation('author').relationName // 'author'
```

### `serializeAs`
O nome a ser usado para serializar o relacionamento. Você pode defini-lo usando as opções do decorador.

```ts
class Post extends BaseModel {
  @belongsTo(() => User, {
    serializeAs: 'user'
  })
  public author: BelongsTo<typeof User>
}
```

### `booted`
Descubra se o relacionamento foi inicializado. Caso contrário, chame o método `boot`.

### `boot`
Inicialize o relacionamento. As APIs públicas dos modelos Lucid chamam esse método internamente, e você nunca precisa inicializar o relacionamento manualmente.

### `model`
Referência ao modelo pai (aquele que define o relacionamento).

```ts
class Post extends BaseModel {
  @belongsTo(() => User)
  public author: BelongsTo<typeof User>
}

Post.$getRelation('author').model // Post
```

### `relatedModel`
Referência ao modelo de relacionamento. O valor da propriedade é uma função que retorna o modelo relacionado.

```ts
class Post extends BaseModel {
  @belongsTo(() => User)
  public author: BelongsTo<typeof User>
}

Post.$getRelation('author').relatedModel() // User
```

### `localKey`
A `localKey` para o relacionamento. Você deve ler o documento [NamingStrategy](../naming-strategy.md#relationlocalkey) para saber mais sobre como o nome da chave é computado.

Você também pode definir a `localKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class Post extends BaseModel {
  @belongsTo(() => User, {
    localKey: 'id', //coluna id no modelo "Usuário"
  })
  public author: BelongsTo<typeof User>
}
```

### `foreignKey`
A `foreignKey` para o relacionamento. Você deve ler o documento [NamingStrategy](../naming-strategy.md#relationlocalkey) para saber mais sobre como o nome da chave é computado.

Você também pode definir a `foreignKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class Post extends BaseModel {
  @column()
  public userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId', // coluna userId no modelo "Post"
  })
  public author: BelongsTo<typeof User>
}
```

### `onQuery`
O método `onQuery` é um gancho opcional para modificar as consultas de relacionamento. Você pode defini-lo no momento da declaração da relação.

```ts
class Post extends BaseModel {
  @column()
  public userId: number

  @belongsTo(() => User, {
    onQuery(query) {
      query.where('accountStatus', 'active')
    }
  })
  public author: BelongsTo<typeof User>
}
```

Se você quiser pré-carregar um relacionamento aninhado usando o gancho `onQuery`, certifique-se de colocá-lo dentro do condicional `!query.isRelatedSubQuery` porque as subconsultas **NÃO são executadas diretamente**, elas são usadas dentro de outras consultas.

```ts {7-9}
class Post extends BaseModel {
  @column()
  public userId: number

  @belongsTo(() => User, {
    onQuery(query) {
      if (!query.isRelatedSubQuery) {
        query.preload('profile')
      }
    }
  })
  public author: BelongsTo<typeof User>
}
```

### `setRelated`
Defina um relacionamento na instância do modelo pai. Os métodos aceitam o modelo pai como o primeiro argumento e a instância do modelo relacionada como o segundo argumento.

Você deve garantir que ambas as instâncias do modelo estejam relacionadas entre si antes de chamar este método.

```ts
const user = new User()
const post = new Post()

Post.$getRelation('author').setRelated(user, post)
```

### `pushRelated`
O método `pushRelated` envia o relacionamento para a matriz de valores de relacionamento existente. No entanto, para o relacionamento `belongsTo`, o método funciona de forma semelhante a `setRelated`.

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
    userId: 1,
  },
  Post {
    id: 2,
    userId: 1,
  },
  Post {
    id: 3,
    userId: 3,
  },
  Post {
    id: 4,
    userId: 2,
  },
]

Post.$getRelation('author').setRelatedForMany(posts, users)
```

### `client`
Retorna a referência para [BelongsToQueryClient](#query-client). O cliente de consulta expõe a API para persistir/buscar linhas relacionadas do banco de dados.

### `hydrateForPersistance`
Hidrata os valores para persistência definindo o valor `foreignKey`. O método aceita o modelo pai como o primeiro argumento e um objeto ou a instância do modelo relacionado como o segundo argumento.

```ts
const user = new User()
user.id = 1

const post = new Post()
post.title = 'Adonis 101'

Post.$getRelation('author').hydrateForPersistance(post, user)

console.log(post.userId === user.id) // true
```

### `eagerQuery`
Retorna uma instância do [BelongsToQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/BelongsTo/QueryBuilder.ts). O construtor de consultas tem a mesma API que o [Construtor de consultas do modelo](../query-builder.md)

### `subQuery`
Retorna uma instância do [BelongsToSubQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/BelongsTo/SubQueryBuilder.ts). As subconsultas não devem ser executadas e usadas principalmente pelos métodos [withCount](../query-builder.md#withcount) e [whereHas](../query-builder.md#wherehas).

## Cliente de consulta
O cliente de consulta expõe a API para persistir/buscar linhas relacionadas do banco de dados. Você pode acessar o cliente de consulta para um relacionamento usando o método `related`.

```ts
const post = await Post.find(1)

post.related('author') // BelongsToClientContract
```

### `associate`
Associe o modelo relacionado ao modelo pai. Por exemplo, associe o usuário à postagem.

```ts
const user = await User.find(1)
const post = await Post.find(1)

await post
  .related('author')
  .associate(user)
```

O método `associate` herda o cliente de transação ou o nome da conexão definido na instância do modelo pai. Por exemplo:

```ts
const trx = await Database.transaction()
const post = await Post.query({ client: trx }).first()
const user = await User.query({ client: trx }).first()

/**
* Usa a propriedade `$trx` da instância `post` para
* persistir o relacionamento
*/
await post.related('author').associate(user)

await trx.commit()
```

### `dissociate`
O método `dissociate` remove o relacionamento definindo o valor da chave estrangeira como `null`.

```ts
const post = await Post.find(1)
await post.dissociate()

post.userId // null
```

### `query`
Retorna uma instância do [BelongsToQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/BelongsTo/QueryBuilder.ts). O construtor de consultas tem a mesma API que o [Construtor de consultas do modelo](../query-builder.md).
