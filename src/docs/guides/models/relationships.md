# Relacionamentos

Os modelos de dados Lucid têm suporte pronto para uso para trabalhar com relacionamentos. Você precisa definir os relacionamentos em seus modelos, e o Lucid fará todo o trabalho pesado de construir as consultas SQL subjacentes.

## HasOne
HasOne cria um relacionamento `um-para-um` entre dois modelos. Por exemplo, **Um usuário tem um perfil**. O relacionamento `has one` precisa de uma chave estrangeira na tabela relacionada.

A seguir está um exemplo de estrutura de tabela para o relacionamento `has one`. `profiles.user_id` é a chave estrangeira e forma o relacionamento com a coluna `users.id`.

![](/docs/assets/has-one.webp)

A seguir estão os exemplos de migrações para as tabelas `users` e `profiles`.

::: code-group

```ts {8} [users]
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

```ts {9-13} [profiles]
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Profiles extends BaseSchema {
  protected tableName = 'profiles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // excluir perfil quando o usuário for excluído
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

:::

### Definindo relacionamento no modelo
Depois de criar as tabelas com as colunas necessárias, você também terá que definir o relacionamento no modelo Lucid.

O relacionamento has one é definido usando o decorador [@hasOne](../../reference/orm/decorators.md#hasone) em uma propriedade do modelo.

```ts {6-7,11-12}
import Profile from 'App/Models/Profile'

import {
  column,
  BaseModel,
  hasOne,
  HasOne
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>
}
```

### Chaves de relacionamento personalizadas

Por padrão, `foreignKey` é a representação **camelCase do nome do modelo pai e sua chave primária**. No entanto, você também pode definir uma chave estrangeira personalizada.

```ts
@hasOne(() => Profile, {
  foreignKey: 'profileUserId', // padrão para userId
})
public profile: HasOne<typeof Profile>
```

::: info NOTA
Lembre-se, se você pretende usar camelCase para sua definição de chave estrangeira, tenha em mente que a [estratégia de nomenclatura](../../reference/orm/naming-strategy.md) padrão a converterá automaticamente para snake_case.
:::

A chave local é sempre a **chave primária do modelo pai**, mas também pode ser definida explicitamente.

```ts
@hasOne(() => Profile, {
  localKey: 'uuid', // padrão para id
})
public profile: HasOne<typeof Profile>
```

## HasMany
HasMany cria um relacionamento `um-para-muitos` entre dois modelos. Por exemplo, **Um usuário tem muitas postagens**. O relacionamento hasMany precisa de uma chave estrangeira na tabela relacionada.

A seguir está um exemplo de estrutura de tabela para o relacionamento hasMany. `posts.user_id` é a chave estrangeira e forma o relacionamento com a coluna `users.id`.

![](/docs/assets/has-many.webp)

A seguir estão os exemplos de migrações para as tabelas `users` e `posts`.

::: code-group

```ts {8} [users]
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

```ts {9-13} [posts]
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // excluir postagem quando o usuário for excluído
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

:::

### Definindo relacionamento no modelo
Depois de criar as tabelas com as colunas necessárias, você também terá que definir o relacionamento no modelo Lucid.

O relacionamento has many é definido usando o decorador [@hasMany](../../reference/orm/decorators.md#hasmany) em uma propriedade do modelo.

```ts {6-7,11-12}
import Post from 'App/Models/Post'

import {
  column,
  BaseModel,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @hasMany(() => Post)
  public posts: HasMany<typeof Post>
}
```

### Chaves de relacionamento personalizadas

Por padrão, `foreignKey` é a representação **camelCase do nome do modelo pai e sua chave primária**. No entanto, você também pode definir uma chave estrangeira personalizada.

```ts
@hasMany(() => Post, {
  foreignKey: 'authorId', // padrão para userId
})
public posts: HasMany<typeof Post>
```

::: info NOTA
Lembre-se, se você pretende usar camelCase para sua definição de chave estrangeira, tenha em mente que a [estratégia de nomenclatura](../../reference/orm/naming-strategy.md) padrão a converterá automaticamente para snake_case.
:::

A chave local é sempre a **chave primária do modelo pai**, mas também pode ser definida explicitamente.

```ts
@hasMany(() => Post, {
  localKey: 'uuid', // padrão para id
})
public posts: HasMany<typeof Post>
```

## BelongsTo
BelongsTo é o inverso do relacionamento `hasOne` e `hasMany`. Então, por exemplo, **perfil pertence a um usuário** e **uma postagem pertence a um usuário**.

Você pode aproveitar a mesma estrutura de tabela e as mesmas convenções de chave estrangeira para definir um relacionamento belongTo.

O relacionamento belong to é definido usando o decorador [@belongsTo](../../reference/orm/decorators.md#belongsto) em uma propriedade de modelo.

```ts {5-6,14-15}
import User from 'App/Models/User'
import {
  column,
  BaseModel,
  belongsTo,
  BelongsTo
} from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  // A chave estrangeira ainda está no mesmo modelo
  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
```

## ManyToMany
Um relacionamento muitos-para-muitos é um pouco complexo, pois permite que ambos os lados tenham mais de um relacionamento entre si. Por exemplo: **Um usuário pode ter muitas habilidades**, e **uma habilidade também pode pertencer a muitos usuários**.

Você precisa de uma terceira tabela (geralmente conhecida como tabela dinâmica) para que esse relacionamento funcione. A tabela dinâmica contém as chaves estrangeiras para ambas as outras tabelas.

No exemplo a seguir, a tabela `skill_user` tem as chaves estrangeiras para as tabelas `users` e `skills`, permitindo que cada usuário tenha muitas habilidades e vice-versa.

![](/docs/assets/many-to-many.webp)

A seguir estão os exemplos de migrações para as tabelas `users`, `skills` e `skill_user`.

::: code-group

```ts {8} [users]
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

```ts {9} [skills]

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Skills extends BaseSchema {
  protected tableName = 'skills'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

```ts {10,11,12} [skill_user]

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SkillUsers extends BaseSchema {
  protected tableName = 'skill_user'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('users.id')
      table.integer('skill_id').unsigned().references('skills.id')
      table.unique(['user_id', 'skill_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

:::

### Definindo relacionamento no modelo
Depois de criar as tabelas com as colunas necessárias, você também terá que definir o relacionamento no modelo Lucid.

O relacionamento muitos para muitos é definido usando o decorador [@manyToMany](../../reference/orm/decorators.md#manytomany) em uma propriedade do modelo.

::: info NOTA
Não há necessidade de criar um modelo para a tabela dinâmica.
:::

```ts {5-6,13-14}
import Skill from 'App/Models/Skill'
import {
  column,
  BaseModel,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @manyToMany(() => Skill)
  public skills: ManyToMany<typeof Skill>
}
```

### Chaves de relacionamento personalizadas
Um relacionamento muitos para muitos depende de muitas chaves diferentes para configurar o relacionamento corretamente. Todas essas chaves são computadas usando convenções padrão. No entanto, você tem a liberdade de substituí-las.

- `localKey` é a chave primária do modelo pai (ou seja, Usuário)
- `relatedKey` é a chave primária do modelo relacionado (ou seja, Habilidade)
- `pivotForeignKey` é a chave estrangeira para estabelecer o relacionamento com o modelo pai. O valor padrão é a versão `snake_case` do nome do modelo pai e sua chave primária.
- `pivotRelatedForeignKey` é a chave estrangeira para estabelecer o relacionamento com o modelo relacionado. O valor padrão é a versão `snake_case` do nome do modelo relacionado e sua chave primária.

```ts
@manyToMany(() => Skill, {
  localKey: 'id',
  pivotForeignKey: 'user_id',
  relatedKey: 'id',
  pivotRelatedForeignKey: 'skill_id',
})
public skills: ManyToMany<typeof Skill>
```

::: info NOTA
Lembre-se, se você pretende usar camelCase para sua definição de chave estrangeira, tenha em mente que a [estratégia de nomenclatura](../../reference/orm/naming-strategy.md) padrão irá convertê-la automaticamente para snake_case.
:::

### Tabela dinâmica personalizada
O valor padrão para o nome da tabela dinâmica é calculado pela [combinação](https://github.com/adonisjs/lucid/blob/develop/src/Orm/NamingStrategies/SnakeCase.ts#L73) do **nome do modelo pai** e do **nome do modelo relacionado**. No entanto, você também pode definir uma tabela dinâmica personalizada.

```ts
@manyToMany(() => Skill, {
  pivotTable: 'user_skills',
})
public skills: ManyToMany<typeof Skill>
```

### Colunas dinâmicas adicionais
Às vezes, sua tabela dinâmica terá colunas adicionais. Por exemplo, você está armazenando a `proficiência` junto com a habilidade do usuário.

Você terá que informar um relacionamento manyToMany sobre essa coluna extra. Caso contrário, o Lucid não a selecionará durante as consultas de busca.

```ts
@manyToMany(() => Skill, {
  pivotColumns: ['proficiency'],
})
public skills: ManyToMany<typeof Skill>
```

### Carimbos de data/hora da tabela dinâmica
Você pode habilitar o suporte para carimbos de data/hora **criado em** e **atualizado em** para suas tabelas dinâmicas usando a propriedade `pivotTimestamps`.

- Uma vez definido, o Lucid definirá/atualizará automaticamente esses carimbos de data/hora em consultas de inserção e atualização.
[Luxon Datetime](https://moment.github.io/luxon/api-docs/index.html#datetime) classe durante a busca.

```ts
@manyToMany(() => Skill, {
  pivotTimestamps: true
})
public skills: ManyToMany<typeof Skill>
```

Configurações `pivotTimestamps = true` assume que os nomes das colunas são definidos como `created_at` e `updated_at`. No entanto, você também pode definir nomes de colunas personalizados.

```ts
@manyToMany(() => Skill, {
  pivotTimestamps: {
    createdAt: 'creation_date',
    updatedAt: 'updation_date'
  }
})
public skills: ManyToMany<typeof Skill>
```

Para desabilitar um carimbo de data/hora específico, você pode definir seu valor como `false`.

```ts
@manyToMany(() => Skill, {
  pivotTimestamps: {
    createdAt: 'creation_date',
    updatedAt: false // desativar atualização no campo de registro de data e hora
  }
})
public skills: ManyToMany<typeof Skill>
```

## HasManyThrough
O relacionamento HasManyThrough é semelhante ao relacionamento `HasMany`, mas cria o relacionamento por meio de um modelo intermediário. Por exemplo, **Um país tem muitas postagens por meio de usuários**.

- Este relacionamento precisa que o modelo through (ou seja, Usuário) tenha uma referência de chave estrangeira com o modelo atual (ou seja, País).
O modelo relacionado (ou seja, Postagem) tem uma referência de chave estrangeira com o modelo through (ou seja, Usuário).

![](/docs/assets/has-many-through.png)

A seguir estão os exemplos de migrações para as tabelas `countries`, `users` e `posts`.

::: code-group

```ts {8} [countries]
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Countries extends BaseSchema {
  protected tableName = 'countries'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

```ts {9-12} [users]
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('country_id')
        .unsigned()
        .references('countries.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

```ts {8-12} [posts]
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

:::

### Definindo relacionamento no modelo
Depois de criar as tabelas com as colunas necessárias, você também terá que definir o relacionamento no modelo Lucid.

O relacionamento has many through é definido usando o decorador [@hasManyThrough](../../reference/orm/decorators.md#hasmanythrough) em uma propriedade do modelo.

```ts {6-7,14-18}
import Post from 'App/Models/Post'
import User from 'App/Models/User'
import {
  BaseModel,
  column,
  hasManyThrough,
  HasManyThrough
} from '@ioc:Adonis/Lucid/Orm'

export default class Country extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasManyThrough([
    () => Post,
    () => User,
  ])
  public posts: HasManyThrough<typeof Post>
}
```

## Pré-carregar relacionamento
O pré-carregamento permite que você busque os dados do relacionamento junto com a consulta principal. Por exemplo: selecione todos os usuários e `pré-carregue` seus perfis ao mesmo tempo.

- O método `preload` aceita o nome do relacionamento definido no modelo.
- O valor da propriedade do relacionamento para o relacionamento `hasOne` e `belongsTo` é definido como a instância do modelo relacionada ou `null` quando nenhum registro é encontrado.
O valor da propriedade do relacionamento é uma matriz da instância do modelo relacionada para todos os outros tipos de relacionamento.

```ts
const users = await User
  .query()
  .preload('profile')

users.forEach((user) => {
  console.log(user.profile)
})
```

Você pode modificar a consulta de relacionamento passando um retorno de chamada opcional para o método `preload`.

```ts
const users = await User
  .query()
  .preload('profile', (profileQuery) => {
    profileQuery.where('isActive', true)
  })
```

### Pré-carregar vários relacionamentos
Você pode ``pré-carregar` vários relacionamentos juntos chamando o método `preload` várias vezes. Por exemplo:

```ts
const users = await User
  .query()
  .preload('profile')
  .preload('posts')
```

### Pré-carregar relacionamentos aninhados
Você pode pré-carregar relacionamentos aninhados usando o construtor de consulta de relacionamento acessível por meio do retorno de chamada opcional.

No exemplo a seguir, buscamos todos os usuários, pré-carregamos suas postagens e, em seguida, buscamos todos os comentários para cada postagem, junto com o usuário do comentário.

```ts
const users = await User
  .query()
  .preload('posts', (postsQuery) => {
    postsQuery.preload('comments', (commentsQuery) => {
      commentsQuery.preload('user')
    })
  })
```

### Colunas dinâmicas de muitos para muitos
Ao pré-carregar um relacionamento manyToMany, as colunas da tabela dinâmica são movidas para o objeto `$extras` na instância do relacionamento.

Por padrão, selecionamos apenas as chaves estrangeiras da tabela dinâmica. No entanto, você pode definir colunas de pivô adicionais para selecionar em [definindo o relacionamento](#additional-pivot-columns) ou em tempo de execução.

```ts
const users = await User
  .query()
  .preload('skills', (query) => {
    query.pivotColumns(['proficiency'])
  })

users.forEach((user) => {
  user.skills.forEach((skill) => {
    console.log(skill.$extras.pivot_proficiency)
    console.log(skill.$extras.pivot_user_id)
    console.log(skill.$extras.pivot_skill_id)
    console.log(skill.$extras.pivot_created_at)
  })
})
```

### Relacionamentos de carregamento lento
Junto com o pré-carregamento, você também pode carregar relacionamentos diretamente de uma instância de modelo.

```ts
const user = await User.find(1)

// Carregamento lento do perfil
await user.load('profile')
console.log(user.profile) // Profile | null

// Carregamento lento das postagens
await user.load('posts')
console.log(user.posts) // Post[]
```

Assim como o método `preload`, o método `load` também aceita um retorno de chamada opcional para modificar a consulta de relacionamento.

```ts
await user.load('profile', (profileQuery) => {
  profileQuery.where('isActive', true)
})
```

Você pode carregar vários relacionamentos chamando o método `load` várias vezes ou pegando uma instância do carregador de relacionamento subjacente.

```ts
// Chamando o método "load" várias vezes
await user.load('profile')
await user.load('posts')
```

```ts
// Usando o carregador de relacionamentos
await user.load((loader) => {
  loader.load('profile').load('posts')
})
```

### Limitar relacionamentos pré-carregados
Digamos que você queira carregar todas as postagens e buscar os três comentários recentes para cada postagem.

Usar o método `limit` do construtor de consultas não fornecerá a saída desejada, pois o limite é aplicado a todo o conjunto de dados e não aos comentários de uma postagem individual.

Portanto, você deve usar o método `groupLimit` que usa [funções de janela SQL](https://drill.apache.org/docs/sql-window-functions-introduction/) para aplicar um limite em cada registro pai separadamente.

```ts
const posts = await Post
  .query()
  .preload('comments', (query) => {
    query.groupLimit(3)
  })
```

## Construtor de consultas de relacionamento

::: info NOTA
Certifique-se de ler os [documentos da API de relacionamento](../../reference/orm/relations/has-one.md) para visualizar todos os métodos/propriedades disponíveis no construtor de consultas.
:::

Você também pode acessar o construtor de consultas para um relacionamento usando o método `related`. As consultas de relacionamento sempre têm como escopo uma determinada instância do modelo pai.

O Lucid adicionará automaticamente a cláusula `where` para limitar as postagens ao usuário fornecido no exemplo a seguir.

```ts
const user = await User.find(1)
const posts = await user.related('posts').query()
```

O método `query` retorna uma instância padrão do construtor de consultas, e você pode encadear quaisquer métodos a ele para adicionar restrições adicionais.

```ts
const posts = await user
  .related('posts')
  .query()
  .where('isPublished', true)
  .paginate(1)
```

Você também pode usar o construtor de consultas de relacionamento para `atualizar` e `excluir` linhas relacionadas. No entanto, fazer isso [não executará](./crud.md#why-not-use-the-update-query-directly) nenhum dos ganchos do modelo.

## Filtrar por relacionamentos
Você também pode filtrar os registros da consulta principal verificando a existência ou ausência de um relacionamento. Por exemplo, **selecione todas as postagens que receberam um ou mais comentários**.

Você pode filtrar por relacionamento usando os métodos `has` ou `whereHas`. Eles aceitam o nome do relacionamento como o primeiro argumento. Opcionalmente, você também pode passar um operador e o número de linhas esperadas.

```ts
// Obtenha postagens com um ou mais comentários
const posts = await Post
  .query()
  .has('comments')

// Obtenha postagens com mais de 2 comentários
const posts = await Post
  .query()
  .has('comments', '>', 2)
```

Você pode usar o método `whereHas` para adicionar restrições adicionais para a consulta de relacionamento. No exemplo a seguir, buscamos apenas postagens que tenham um ou mais comentários aprovados.

```ts
const posts = await Post
  .query()
  .whereHas('comments', (query) => {
    query.where('isApproved', true)
  })
```

Semelhante ao método `has`, o `whereHas` também aceita um operador opcional e a contagem de linhas esperadas.

```ts
const posts = await Post
  .query()
  .whereHas('comments', (query) => {
    query.where('isApproved', true)
  }, '>', 2)
```

A seguir está a lista de variações `has` e `whereHas`.

- `orHas | orWhereHas` adiciona uma cláusula **OR** para a existência do relacionamento.
- `doesntHave | whereDoesntHave` verifica a ausência do relacionamento.
- `orDoesntHave | orWhereDoesntHave` adiciona uma cláusula **OR** para a ausência do relacionamento.

## Agregados de relacionamento
A API de relacionamentos do Lucid também permite que você carregue os agregados para relacionamentos. Por exemplo, você pode buscar uma lista de **postagens com uma contagem de comentários para cada postagem**.

#### `withAggregate`

O método `withAggregate` aceita o relacionamento como o primeiro argumento e um retorno de chamada obrigatório para definir a função de agregação do valor e o nome da propriedade.

::: info NOTA
No exemplo a seguir, a propriedade `comments_count` é movida para o objeto `$extras` porque não está definida como uma propriedade no modelo.
:::

```ts
const posts = await Post
  .query()
  .withAggregate('comments', (query) => {
    query.count('*').as('comments_count')
  })

posts.forEach((post) => {
  console.log(post.$extras.comments_count)
})
```

#### `withCount`
Como a contagem de linhas de relacionamento é um requisito muito comum, você pode usar o método `withCount`.

```ts
const posts = await Post.query().withCount('comments')

posts.forEach((post) => {
  console.log(post.$extras.comments_count)
})
```

Você também pode fornecer um nome personalizado para a propriedade count usando o método `as`.

```ts {3-5,8}
const posts = await Post
  .query()
  .withCount('comments', (query) => {
    query.as('commentsCount')
  })

posts.forEach((post) => {
  console.log(post.$extras.commentsCount)
})
```

Você pode definir restrições para a consulta de contagem passando um retorno de chamada opcional para o método `withCount`.

```ts
const posts = await Post
  .query()
  .withCount('comments', (query) => {
    query.where('isApproved', true)
  })
```

### Agregados de relacionamento de carregamento lento
Semelhante aos métodos `withCount` e `withAggregate`, você também pode carregar lentamente os agregados de uma instância de modelo usando os métodos `loadCount` e `loadAggregate`.

```ts
const post = await Post.findOrFail()
await post.loadCount('comments')

console.log(post.$extras.comments_count)
```

```ts
const post = await Post.findOrFail()
await post.loadAggregate('comments', (query) => {
  query.count('*').as('commentsCount')
})

console.log(post.$extras.commentsCount)
```

Certifique-se de usar o método `loadCount` somente ao trabalhar com uma única instância de modelo. Se houver várias instâncias de modelo, é melhor usar o método `withCount` do construtor de consultas.

## Gancho de consulta de relacionamento
Você pode definir um gancho de relacionamento `onQuery` no momento de definir um relacionamento. Em seguida, os ganchos de consulta são executados para todas as consultas **select**, **update** e **delete** executadas pelo construtor de consultas de relacionamento.

O método `onQuery` geralmente é útil quando você sempre aplica certas restrições à consulta de relacionamento.

```ts {14-16}
import UserEmail from 'App/Models/UserEmail'
import {
  column,
  BaseModel,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @hasMany(() => UserEmail)
  public emails: HasMany<typeof UserEmail>

  @hasMany(() => UserEmail, {
    onQuery: (query) => {
      query.where('isActive', true)
    }
  })
  public activeEmails: HasMany<typeof UserEmail>
}
```

## Criar relacionamentos
Você pode criar relacionamentos entre dois modelos usando a API de persistência de relacionamentos. Certifique-se de verificar também os [documentos da API](../../reference/orm/relations/has-one.md#query-client) para visualizar todos os métodos disponíveis.

### `create`

No exemplo a seguir, criamos um novo comentário e o vinculamos à postagem ao mesmo tempo. O método `create` aceita um objeto JavaScript simples para persistir. O valor da chave estrangeira é definido automaticamente.

```ts
const post = await Post.findOrFail(1)
const comment = await post.related('comments').create({
  body: 'This is a great post'
})

console.log(comment.postId === post.id) // true
```

### `save`

A seguir está um exemplo usando o método `save`. O método `save` precisa de uma instância do modelo relacionado. O valor da chave estrangeira é definido automaticamente.

```ts
const post = await Post.findOrFail(1)

const comment = new Comment()
comment.body = 'This is a great post'

await post.related('comments').save(comment)

console.log(comment.postId === post.id) // true
```

### `createMany`
Você também pode criar vários relacionamentos usando o método `createMany`. O método está disponível apenas para relacionamentos `hasMany` e `manyToMany`.

O método `createMany` retorna uma matriz de instâncias de modelo persistentes.

```ts
const comments = await Post
  .related('comments')
  .createMany([
    {
      body: 'This is a great post.'
    },
    {
      body: 'Well written.'
    }
  ])
```

### `saveMany`
Semelhante ao método `save`. O método `saveMany` permite persistir vários relacionamentos juntos.

```ts
const comment1 = new Comment()
comment1.body = 'This is a great post'

const comment2 = new Comment()
comment2.body = 'Well written'

await Post
  .related('comments')
  .saveMany([comment1, comment2])
```

### `associate`
O método `associate` é exclusivo para o relacionamento `belongsTo`. Ele permite que você associe dois modelos um ao outro.

```ts
const user = await User.findOrFail(1)

const profile = new Profile()
profile.avatarUrl = 'foo.jpg'
await profile.related('user').associate(user)
```

### `dissociate`
O `dissociate` remove o relacionamento definindo a chave estrangeira como `null`. Portanto, o método é exclusivo do relacionamento `belongsTo`.

```ts
await profile = await Profile.findOrFail(1)
await profile.related('user').dissociate()
```

### `attach`
O método `attach` é exclusivo de um relacionamento `manyToMany`. Ele permite que você crie um relacionamento entre dois modelos persistentes dentro da tabela dinâmica.

O método `attach` precisa apenas do `id` do modelo relacionado para formar o relacionamento dentro da tabela dinâmica.

```ts
const user = await User.find(1)
const skill = await Skill.find(1)

// Executa consulta de inserção dentro da tabela dinâmica
await user.related('skills').attach([skill.id])
```

Você pode definir colunas dinâmicas adicionais passando um objeto de par chave-valor. A chave é o id do modelo relacionado e o valor é um objeto de colunas adicionais.

```ts
await user.related('skills').attach({
  [skill.id]: {
    proficiency: 'Beginner'
  }
})
```

### `detach`
O método `detach` é o oposto do método `attach` e permite que você remova o relacionamento **da tabela dinâmica**.

Ele aceita opcionalmente uma matriz de `ids` para remover. Chamar o método sem nenhum argumento removerá todos os relacionamentos da tabela dinâmica.

```ts
const user = await User.find(1)
const skill = await Skill.find(1)

await user.related('skills').detach([skill.id])

// Remove todas as habilidades do usuário
await user.related('skills').detach()
```

### `sync`
O método `sync` permite que você sincronize as linhas dinâmicas. A carga útil fornecida ao método `sync` é considerada a fonte da verdade, e calculamos um diff internamente para executar as seguintes consultas SQL.

- Insira as linhas ausentes na tabela dinâmica, mas presentes na carga útil de sincronização.
- Atualize as linhas presentes na tabela dinâmica e na carga útil de sincronização, mas tenha um ou mais argumentos alterados.
- Remova as linhas presentes na tabela dinâmica, mas ausentes na carga útil de sincronização.
- Ignore as linhas presentes na tabela dinâmica e na carga útil de sincronização.

```ts
const user = await User.find(1)

// Somente habilidades com id 1, 2, 3 permanecerão na tabela dinâmica
await user.related('skills').sync([1, 2, 3])
```

Você também pode definir colunas dinâmicas adicionais como um objeto de par chave-valor.

```ts
const user = await User.find(1)

await user.related('skills').sync({
  [1]: {
    proficiency: 'Beginner',
  },
  [2]: {
    proficiency: 'Master'
  },
  [3]: {
    proficiency: 'Master'
  }
})
```

Você pode desabilitar a opção `detach` para sincronizar linhas sem remover nenhuma linha da tabela dinâmica.

```ts
await user
  .related('skills')
  // Adiciona habilidades com id 1,2,3, mas não remove nenhuma
  // linha da tabela dinâmica
  .sync([1, 2, 3], false)
```

## Excluir relacionamento
Na maioria das vezes, você pode excluir linhas relacionadas diretamente de seu modelo. Por exemplo: **Você pode excluir um comentário por seu id, diretamente usando o modelo Comment**, não há necessidade de acionar a exclusão do comentário via post.

- Para um relacionamento `manyToMany`, você pode usar o método `detach` para remover a linha da tabela dinâmica.
- Use o método `dissociate` para remover um relacionamento belongTo sem excluir a linha da tabela do banco de dados.

### Usando a ação `onDelete`
Você também pode usar a ação `onDelete` do banco de dados para remover os dados relacionados do banco de dados. Por exemplo: Exclua as postagens de um usuário quando o próprio usuário for excluído.

A seguir, um exemplo de migração para definir a ação `onDelete`.

```ts {7}
this.schema.createTable(this.tableName, (table) => {
  table.increments('id')
  table
    .integer('user_id')
    .unsigned()
    .references('users.id')
    .onDelete('CASCADE')
})
```
