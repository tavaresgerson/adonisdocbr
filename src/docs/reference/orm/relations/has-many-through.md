# Has many through

A [classe de relacionamento HasManyThrough](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasManyThrough/index.ts) permite que você defina um relacionamento has many por meio de um modelo intermediário. Um ótimo exemplo disso é, **"um país tem muitas postagens por meio de usuários"**.

Você não trabalhará diretamente com essa classe. No entanto, uma instância da classe pode ser acessada usando o método `Model.$getRelation`.

```ts
import {
  BaseModel,
  hasManyThrough,
  HasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'

import Post from 'App/Models/Post'
import User from 'App/Models/User'

class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User])
  public posts: HasManyThrough<typeof Post>
}
```

```ts
Country.$getRelation('posts').relationName
Country.$getRelation('posts').type
Country.$getRelation('posts').relatedModel()
```

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis no relacionamento `HasManyThrough`.

### `type`
O tipo do relacionamento. O valor é sempre definido como `hasManyThrough`.

```ts
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User])
  public posts: HasManyThrough<typeof Post>
}

Country.$getRelation('posts').type // 'hasManyThrough'
```

### `relationName`
O nome do relacionamento. É um nome de propriedade definido no modelo pai.

```ts
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User])
  public posts: HasManyThrough<typeof Post>
}

Country.$getRelation('posts').relationName // 'posts'
```

### `serializeAs`
O nome a ser usado para serializar o relacionamento. Você pode defini-lo usando as opções do decorador.

```ts
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User], {
    serializeAs: 'articles'
  })
  public posts: HasManyThrough<typeof Post>
}
```

### `booted`
Descubra se o relacionamento foi inicializado. Caso contrário, chame o método `boot`.

### `boot`
Inicialize o relacionamento. As APIs públicas dos modelos Lucid chamam esse método internamente, e você nunca precisa inicializar o relacionamento manualmente.

### `model`
Referência ao modelo pai (aquele que define o relacionamento).

```ts
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User])
  public posts: HasManyThrough<typeof Post>
}

Country.$getRelation('posts').model // Country
```

### `relatedModel`
Referência ao modelo de relacionamento. O valor da propriedade é uma função que retorna o modelo relacionado.

```ts
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User])
  public posts: HasManyThrough<typeof Post>
}

Country.$getRelation('posts').relatedModel() // Post
```

### `throughModel`
Referência ao `throughModel`. O valor da propriedade é uma função que retorna o throughModel.

```ts
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User])
  public posts: HasManyThrough<typeof Post>
}

Country.$getRelation('posts').throughModel() // User
```

### `localKey`
A `localKey` para o relacionamento. Você deve ler o documento [NamingStrategy](../naming-strategy.md#relationlocalkey) para saber mais sobre como o nome da chave é computado.

Você também pode definir a `localKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class Country extends BaseModel {
  @column()
  public id: number

  @hasManyThrough([() => Post, () => User], {
    localKey: 'id', // coluna id no modelo "Country"
  })
  public posts: HasManyThrough<typeof Post>
}
```

### `foreignKey`
A `foreignKey` para o relacionamento. **A chave estrangeira é a referência no modelo through e não no modelo relacionado**.

Você também pode definir a `foreignKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User], {
    foreignKey: 'countryId', // coluna countryId no modelo "User"
  })
  public posts: HasManyThrough<typeof Post>
}
```

### `throughLocalKey`
A `throughLocalKey` para o relacionamento. Geralmente é a chave primária no modelo through.

Você também pode definir a `throughLocalKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User], {
    throughLocalKey: 'id', // coluna id no modelo "User"
  })
  public posts: HasManyThrough<typeof Post>
}
```

### `throughForeignKey`
A `throughForeignKey` para o relacionamento. É a chave estrangeira entre o through e o modelo relacionado.

Você também pode definir a `throughForeignKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User], {
    throughForeignKey: 'userId', // coluna userId no modelo "Post"
  })
  public posts: HasManyThrough<typeof Post>
}
```

### `onQuery`
O método `onQuery` é um gancho opcional para modificar as consultas de relacionamento. Você pode defini-lo no momento da declaração da relação.

```ts
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User], {
    onQuery(query) {
      query.where('isPublished', true)
    }
  })
  public posts: HasManyThrough<typeof Post>
}
```

Se você quiser pré-carregar um relacionamento aninhado usando o gancho `onQuery`, certifique-se de colocá-lo dentro do condicional `!query.isRelatedSubQuery` porque as subconsultas **NÃO são executadas diretamente**, elas são usadas dentro de outras consultas.

```ts {4-6}
class Country extends BaseModel {
  @hasManyThrough([() => Post, () => User], {
    onQuery(query) {
      if (!query.isRelatedSubQuery) {
        query.preload('comments')
      }
    }
  })
  public posts: HasManyThrough<typeof Post>
}
```

### `setRelated`
Defina um relacionamento na instância do modelo pai. Os métodos aceitam o modelo pai como o primeiro argumento e a instância do modelo relacionada como o segundo argumento.

Você deve garantir que ambas as instâncias do modelo estejam relacionadas entre si antes de chamar este método.

```ts
const country = new Country()
const post = new Post()

Country.$getRelation('posts').setRelated(country, [post])
```

### `pushRelated`
O método `pushRelated` envia o relacionamento para a matriz de valores de relacionamento existente.

```ts
const country = new Country()

Country.$getRelation('posts').pushRelated(country, new Post())
Country.$getRelation('posts').pushRelated(country, new Post())
Country.$getRelation('posts').pushRelated(country, new Post())

country.posts.length // 3
```

### `setRelatedForMany`
Defina os relacionamentos em mais de um modelo pai. O método aceita uma matriz dos modelos pais como o primeiro argumento e uma matriz de modelos relacionados como o segundo argumento.

O Lucid chama isso internamente com os resultados do pré-carregador.

```ts
const countries = [
  Country {
    id: 1,
  },
  Country {
    id: 2,
  },
  Country {
    id: 3,
  }
]

const posts = [
  Post {
    id: 1,
    $extras: {
      through_country_id: 1,
    }
  },
  Post {
    id: 2,
    $extras: {
      through_country_id: 1,
    }
  },
  Post {
    id: 3,
    $extras: {
      through_country_id: 2,
    }
  },
  Post {
    id: 4,
    $extras: {
      through_country_id: 3,
    }
  }
]

Country.$getRelation('posts').setRelatedForMany(countries, posts)
```

### `client`
Retorna a referência ao [HasManyThroughQueryClient](#query-client). O cliente de consulta expõe a API para buscar linhas relacionadas do banco de dados.

### `eagerQuery`
Retorna uma instância do [HasManyThroughQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasManyThrough/QueryBuilder.ts). O construtor de consultas tem a mesma API que o [Construtor de consultas do modelo](../query-builder.md)

### `subQuery`
Retorna uma instância do [HasManyThroughSubQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasManyThrough/SubQueryBuilder.ts). As subconsultas não devem ser executadas e são usadas principalmente pelos métodos [withCount](../query-builder.md#withcount) e [whereHas](../query-builder.md#wherehas).

## Cliente de consulta
O cliente de consulta expõe a API para buscar linhas relacionadas do banco de dados. Você pode acessar o cliente de consulta para um relacionamento usando o método `related`.

:::note
Você não pode persistir um relacionamento `hasManyThrough` diretamente e, em vez disso, usar o relacionamento mais próximo para persistência. Por exemplo: Use o relacionamento `posts` no modelo `User` para criar
posts relacionados.
:::

```ts
const country = await Country.find(1)
country.related('posts') // HasManyThroughClientContract
```

Usando o cliente de consulta, você pode acessar a instância do construtor de consulta para fazer consultas relacionadas.

## Construtor de consulta
O [HasManyThroughQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasManyThrough/QueryBuilder.ts) tem os seguintes métodos adicionais em cima de um construtor de consulta de modelo padrão.

Você pode acessar o construtor de consulta de relacionamento da seguinte forma:

```ts
const country = await Country.find(1)

country.related('posts').query() // HasManyThroughQueryBuilder
```

### `groupLimit`
O método `groupLimit` usa [funções de janela SQL](https://www.sqlservertutorial.net/sql-server-window-functions/sql-server-row_number-function/) para adicionar um limite a cada grupo durante o pré-carregamento do relacionamento. Leia o [guia de pré-carregamento](../../../guides/models/relationships.md#preload-relationship) para saber por que e quando você precisa do método `groupLimit`.

```ts
await Country.query().preload('posts', (query) => {
  query.groupLimit(10)
})
```

### `groupOrderBy`
Adicione uma cláusula order by à consulta de limite de grupo. O método tem a mesma API que o método `orderBy` no construtor de consultas padrão.

:::note
Você só precisa aplicar `groupOrderBy` ao usar o método `groupLimit`.
:::

```ts
await Country.query().preload('posts', (query) => {
  query
    .groupLimit(10)
    .groupOrderBy('posts.created_at', 'desc')
})
```
