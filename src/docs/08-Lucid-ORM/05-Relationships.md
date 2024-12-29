# Relacionamentos

*Relacionamentos* são a espinha dorsal de aplicativos orientados a dados, vinculando um tipo de modelo a outro.

Por exemplo, um `Usuário` pode ter muitas relações `Post`, e cada `Post` pode ter muitas relações `Comentário`.

A API expressiva do Lucid torna o processo de associação e busca de relações de modelo simples e intuitivo, sem a necessidade de tocar em uma instrução SQL ou mesmo editar um esquema SQL.

## Exemplo básico
Vamos examinar um cenário contendo dois modelos: `Usuário` e `Perfil`.

Em nosso exemplo, cada instância de `Usuário` pode ter *um único* `Perfil`.

Chamamos isso de relacionamento *um para um*.

### Definindo Relacionamento
Para definir esse relacionamento, adicione o seguinte método ao seu modelo `User`:

```js
// .app/Models/User.js

const Model = use('Model')

class User extends Model {
  profile () {
    return this.hasOne('App/Models/Profile')
  }
}

module.exports = User
```

No exemplo acima, adicionamos um método `profile` ao modelo `User` retornando um relacionamento `hasOne` digitado para o modelo `Profile`.

Se o modelo `Profile` não existir, gere-o:

```bash
adonis make:model Profile
```

```js
// .app/Models/Profile.js

const Model = use('Model')

class Profile extends Model {
}

module.exports = Profile
```

::: warning OBSERVAÇÃO
Não há necessidade de definir um relacionamento em ambos os modelos. Definir um caminho único em um único modelo é tudo o que é necessário.
:::

### Buscando Perfil de Usuário
Agora que definimos o relacionamento entre `Usuário` e `Perfil`, podemos executar o seguinte código para buscar o perfil de um usuário:

```js
const User = use('App/Models/User')

const user = await User.find(1)
const userProfile = await user.profile().fetch()
```

## Tem Um
Uma relação `hasOne` define um relacionamento *um para um* usando uma *chave estrangeira* para o modelo relacionado.

### API
```js
hasOne(relatedModel, primaryKey, foreignKey)
```

#### `relatedModel`
Uma referência de contêiner IoC para o modelo que o modelo atual *tem um*.

#### `primaryKey`
O padrão é a chave primária do modelo atual (ou seja, `id`).

#### `foreignKey`
O padrão é `tableName_primaryKey` do modelo atual. A forma singular do nome da tabela é usada (por exemplo, a chave estrangeira `user_id` faz referência à coluna `id` na tabela `users`).

### Tabelas de banco de dados

![imagem](/docs/assets/HasOne_wechyq.png)

### Definindo relação
```js
// .app/Models/User.js

const Model = use('Model')

class User extends Model {
  profile () {
    return this.hasOne('App/Models/Profile')
  }
}

module.exports = User
```

## Tem muitos
Uma relação `hasMany` define um relacionamento *um para muitos* usando uma *chave estrangeira* para os outros modelos relacionados.

### API
```js
hasMany(relatedModel, primaryKey, foreignKey)
```

#### `relatedModel`
Uma referência de contêiner IoC para o modelo do qual o modelo atual *tem muitos*.

#### `primaryKey`
O padrão é a chave primária do modelo atual (por exemplo, `id`).

#### `foreignKey`
O padrão é `tableName_primaryKey` do modelo atual. A forma singular do nome da tabela é usada (por exemplo, a chave estrangeira `user_id` faz referência à coluna `id` na tabela `users`).

### Tabelas de banco de dados

![imagem](/docs/assets/HasMany_kkbac9.png)

### Definindo relação
```js
// .app/Models/User.js

const Model = use('Model')

class User extends Model {
  posts () {
    return this.hasMany('App/Models/Post')
  }
}

module.exports = User
```

## Pertence a
O relacionamento `belongsTo` é o inverso do relacionamento [hasOne](#has-one) e é aplicado na outra extremidade do relacionamento.

Continuando com nosso exemplo `User` e `Profile`, o modelo `Profile` pertence ao modelo `User` e, portanto, tem o relacionamento `belongsTo` definido nele.

### API
```js
belongsTo(relatedModel, primaryKey, foreignKey)
```

#### `relatedModel`
Uma referência de contêiner IoC para o modelo ao qual o modelo atual *pertence*.

#### `primaryKey`
O padrão é a chave estrangeira do modelo relacionado (em nosso exemplo `Profile` pertence a `User`, seria `user_id`).

#### `foreignKey`
O padrão é a chave primária do modelo relacionado.

### Tabelas de banco de dados

![imagem](/docs/assets/BelongsTo_fwqdc3.png)

### Definindo relação

```js
.app/Models/Profile.js

const Model = use('Model')

class Profile extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Profile
```

## Pertence a muitos
O relacionamento `belongsToMany` permite que você defina relacionamentos *muitos para muitos* em ambos os modelos.

Por exemplo:

1. Um `Usuário` pode ter muitos modelos `Carro`.
2. Um `Carro` pode ter muitos modelos `Usuário` (ou seja, proprietários) durante sua vida útil.

Como `Usuário` e `Carro` podem ter muitas relações do outro modelo, dizemos que cada modelo *pertence a muitos* do outro modelo.

Ao definir um relacionamento `belongsToMany`, não armazenamos uma chave estrangeira em nenhuma de nossas tabelas de modelo como fizemos para os relacionamentos `hasOne` e `hasMany`.

Em vez disso, devemos confiar em uma terceira tabela intermediária chamada de *tabela dinâmica*.

::: warning OBSERVAÇÃO
Você pode criar tabelas dinâmicas usando [arquivos de migração](/docs/07-Database/03-Migrations.md).
:::

### API
```js
belongsToMany(
  relatedModel,
  foreignKey,
  relatedForeignKey,
  primaryKey,
  relatedPrimaryKey
)
```

#### `relatedModel`
Uma referência de contêiner IoC para o modelo do qual o modelo atual *tem muitos*.

#### `foreignKey`
Padrão para a chave estrangeira do modelo atual (em nosso exemplo `User` pertence a muitos `Car`, isso seria `user_id`).

#### `relatedForeignKey`
O padrão é a chave estrangeira do modelo relacionado (em nosso exemplo `User` pertence a muitos `Car`, isso seria `car_id`).

#### `primaryKey`
O padrão é a chave primária do modelo atual (por exemplo, `id`).

#### `relatedPrimaryKey`
O padrão é a chave primária do modelo relacionado (por exemplo, `id`).

### Tabelas de banco de dados

![image](/docs/assets/BelongsToMany_ngg7oj.png)

### Definindo relação
```js
// .app/Models/Car.js

const Model = use('Model')

class User extends Model {
  cars () {
    return this.belongsToMany('App/Models/Car')
  }
}

module.exports = User
```

No exemplo acima, a tabela chamada `car_user` é a *tabela dinâmica* que armazena o relacionamento exclusivo entre as chaves primárias do modelo `Car` e `User`.

#### `pivotTable`
Por padrão, os nomes das tabelas dinâmicas são derivados pela classificação de nomes de modelos relacionados *em minúsculas* em *ordem alfabética* e unindo-os com um caractere `_` (por exemplo, `User` + `Car` = `car_user`).

Para definir um nome de tabela dinâmica personalizado, chame `pivotTable` na definição de relacionamento:

```js
cars () {
  return this
    .belongsToMany('App/Models/Car')
    .pivotTable('user_cars')
}
```

#### `withTimestamps`
Por padrão, tabelas dinâmicas não são consideradas como tendo timestamps.

Para habilitar timestamps, chame `withTimestamps` na definição de relacionamento:

```js
cars () {
  return this
    .belongsToMany('App/Models/Car')
    .withTimestamps()
}
```

#### `withPivot`
Por padrão, somente chaves estrangeiras são retornadas de uma tabela dinâmica.

Para retornar outros campos da tabela dinâmica, chame `withPivot` na definição do relacionamento:

```js
cars () {
  return this
    .belongsToMany('App/Models/Car')
    .withPivot(['is_current_owner'])
}
```

#### `pivotModel`
Para mais controle sobre consultas feitas a uma tabela dinâmica, você pode vincular um *modelo dinâmico*:

```js
cars () {
  return this
    .belongsToMany('App/Models/Car')
    .pivotModel('App/Models/UserCar')
}
```

```js
// .app/Models/UserCar.js

const Model = use('Model')

class UserCar extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', (userCar) => {
      userCar.is_current_owner = true
    })
  }
}

module.exports = UserCar
```

No exemplo acima, `UserCar` é um modelo Lucid regular.

Com um modelo dinâmico atribuído, você pode usar [hooks](/docs/08-Lucid-ORM/02-Hooks.md), [getters/setters](/docs/08-Lucid-ORM/04-Mutators.md) do ciclo de vida, etc.

::: warning OBSERVAÇÃO
Depois de chamar `pivotModel`, você não pode chamar os métodos `pivotTable` e `withTimestamps`. Em vez disso, você precisa definir esses valores no próprio modelo de pivô.
:::

## Muitos por meio
O relacionamento `manyThrough` é uma maneira conveniente de definir um relacionamento *indireto*.

Por exemplo:

1. Um `Usuário` pertence a um `País`.
2. Um `Usuário` tem muitos modelos `Post`.

Usando `manyThrough`, você pode buscar todos os modelos `Post` para um determinado `País`.

### API

```js
manyThrough(
  relatedModel,
  relatedMethod,
  primaryKey,
  foreignKey
)
```

#### `relatedModel`
Uma referência de contêiner IoC para o modelo que o modelo atual *precisa acessar por meio* para alcançar o modelo indiretamente relacionado.

#### `relatedMethod`
O método de relacionamento chamado em `relatedModel` para buscar os resultados do modelo indiretamente relacionado.

#### `primaryKey`
Padrão para a chave primária do modelo atual (por exemplo, `id`).

#### `foreignKey`
Padrão para a chave estrangeira para o modelo atual (em nosso exemplo de `Posts` por `Country`, seria `country_id`).

### Tabelas de banco de dados

![imagem](/docs/assets/HasManyThrough_dcr86k.png)

### Definindo relações
Os relacionamentos precisam ser definidos nos modelos primário e intermediário.

Continuando com nosso exemplo `Posts` por `Country`, vamos definir o relacionamento `hasMany` necessário no modelo intermediário `User`:

```js
// .app/Models/User.js

const Model = use('Model')

class User extends Model {
  posts () {
    return this.hasMany('App/Models/Post')
  }
}
```

Finalmente, defina o relacionamento `manyThrough` no modelo primário `Country`:

```js
// .app/Models/Country.js

const Model = use('Model')

class Country extends Model {
  posts () {
    return this.manyThrough('App/Models/User', 'posts')
  }
}
```

No exemplo acima, o segundo parâmetro é uma referência ao método `posts` no modelo `User`.

::: warning OBSERVAÇÃO
O parâmetro `relatedMethod` deve sempre ser passado para o método `manyThrough` para que um relacionamento *many through* funcione.
:::

## Consultando dados
A consulta de dados relacionados é bastante simplificada pela API intuitiva do Lucid, fornecendo uma interface consistente para todos os tipos de relacionamentos de modelo.

Se um `Usuário` tiver muitos modelos `Post`, podemos buscar todas as postagens para o usuário `id=1` assim:

```js
const User = use('App/Models/User')

const user = await User.find(1)
const posts = await user.posts().fetch()
```

Adicione restrições de tempo de execução chamando os métodos [Query Builder](/docs/08-Lucid-ORM/01-Getting-Started.md#query-builder) como uma consulta típica:

```js
const user = await User.find(1)

// published posts
const posts = await user
  .posts()
  .where('is_published', true)
  .fetch()
```

O exemplo acima busca todas as postagens publicadas para o usuário `id=1`.

### Consultando Tabela Dinâmica
Você pode adicionar cláusulas `where` para tabelas dinâmicas `belongsToMany` assim:

```js
const user = await User.find(1)

const cars = await user
  .cars()
  .wherePivot('is_current_owner', true)
  .fetch()
```

O exemplo acima busca todos os carros cujo proprietário atual é o usuário `id=1`.

Os métodos `whereInPivot` e `orWherePivot` também estão disponíveis.

## Carregamento rápido
Quando você deseja buscar relações para mais de uma relação base (por exemplo, postagens para mais de um usuário), o *carregamento rápido* é a maneira preferida de fazer isso.

*Carregamento rápido* é o conceito de buscar relações com o mínimo de consultas de banco de dados possível em uma tentativa de evitar o [problema `n+1`](https://secure.phabricator.com/book/phabcontrib/article/n_plus_one/#overview).

*Sem carregamento rápido*, usando as técnicas discutidas anteriormente nesta seção:

```js
// Not Recommended

const User = use('App/Models/User')

const users = await User.all()
const posts = []

for (let user of users) {
  const userPosts = await user.posts().fetch()
  posts.push(userPosts)
}
```

O exemplo acima faz `n+1` consultas ao banco de dados, onde `n` é o número de usuários. Fazer um loop por um grande número de usuários resultaria em uma grande sequência de consultas feitas ao banco de dados, o que dificilmente é o ideal!

*Com carregamento rápido*, apenas 2 consultas são necessárias para buscar todos os usuários e suas postagens:

```js
// Recommended

const User = use('App/Models/User')

const users = await User
  .query()
  .with('posts')
  .fetch()
```

O método `with` carrega a relação passada como parte da carga original, então executar `users.toJSON()` agora retornará uma saída como esta:

```js
// JSON Output

[
  {
    id: 1,
    username: 'virk',
    posts: [{
      id: 1,
      user_id: 1,
      title: '...'
    }]
  }
]
```

Na saída JSON acima, cada objeto `User` agora tem uma propriedade de relacionamento `posts`, facilitando a identificação rápida de qual `Post` pertence a qual `User`.

### Adicionando Restrições de Tempo de Execução
Adicione restrições de tempo de execução a relacionamentos carregados como esta:

```js
const users = await User
  .query()
  .with('posts', (builder) => {
    builder.where('is_published', true)
  })
  .fetch()
```

### Carregando Múltiplas Relações
Múltiplas relações podem ser carregadas encadeando o método `with`:

```js
const users = await User
  .query()
  .with('posts')
  .with('profile')
  .fetch()
```

### Carregando Relações Aninhadas
Relações aninhadas são carregadas via *notação de ponto*.

A consulta a seguir carrega todas as postagens de `Usuário` e seus comentários relacionados:

```js
const users = await User
  .query()
  .with('posts.comments')
  .fetch()
```

Os retornos de chamada de restrição de relação aninhada se aplicam somente à *última relação*:

```js
const users = await User
  .query()
  .with('posts.comments', (builder) => {
    builder.where('approved', true)
  })
  .fetch()
```

No exemplo acima, a cláusula `builder.where` é aplicada somente ao relacionamento `comments` (não ao relacionamento `posts`).

Para adicionar uma restrição à *primeira relação*, use a seguinte abordagem:

```js
const users = await User
  .query()
  .with('posts', (builder) => {
    builder.where('is_published', true)
      .with('comments')
  })
  .fetch()
```

No exemplo acima, uma restrição `where` é adicionada à relação `posts` enquanto `posts.comments` é carregado ao mesmo tempo.

### Recuperando dados de modelos carregados
Para recuperar os dados carregados, você deve chamar o método `getRelated`:

```js
const user = await User
  .query()
  .with('posts')
  .fetch()

const posts = user.getRelated('posts')
```

## Lazy Eager Loading
Para carregar relacionamentos *depois* de já ter buscado dados, use o método `load`.

Por exemplo, para carregar `posts` relacionados depois de já buscar um `User`:

```js
const user = await User.find(1)
await user.load('posts')
```

Você pode carregar vários relacionamentos preguiçosamente usando o método `loadMany`:

```js
const user = await User.find(1)
await user.loadMany(['posts', 'profiles'])
```

Para definir restrições de consulta via `loadMany`, você deve passar um objeto:

```js
const user = await User.find(1)
await user.loadMany({
  posts: (builder) => builder.where('is_published', true),
  profiles: null
})
```

### Recuperando dados de modelos carregados
Para recuperar os dados carregados, você deve chamar o método `getRelated`:

```js
const user = await User.find(1)
await user.loadMany(['posts', 'profiles'])

const posts = user.getRelated('posts')
const profiles = user.getRelated('profiles')
```

## Filtrando dados
A API do Lucid simplifica a filtragem de dados dependendo da existência de um relacionamento.

Vamos usar o exemplo clássico de encontrar todos os *posts com comentários*.

Aqui está nosso modelo `Post` e sua definição de relacionamento `comments`:

```js
// .app/Models/Post.js

const Model = use('Model')

class Post extends Model {
  comments () {
    return this.hasMany('App/Models/Comments')
  }
}
```

#### `has`
Para recuperar apenas posts com pelo menos um `Comment`, encadeie o método `has`:

```js
const posts = await Post
  .query()
  .has('comments')
  .fetch()
```

*É simples assim!*&nbsp;😲

Adicione uma restrição de expressão/valor ao método `has` assim:

```js
const posts = await Post
  .query()
  .has('comments', '>', 2)
  .fetch()
```

O exemplo acima recuperará apenas posts com mais de 2 comentários.

#### `whereHas`
O método `whereHas` é semelhante ao `has`, mas permite restrições mais específicas.

Por exemplo, para buscar todas as postagens com pelo menos 2 comentários publicados:

```js
const posts = await Post
  .query()
  .whereHas('comments', (builder) => {
    builder.where('is_published', true)
  }, '>', 2)
  .fetch()
```

#### `doesntHave`
O oposto da cláusula `has`:

```js
const posts = await Post
  .query()
  .doesntHave('comments')
  .fetch()
```

::: info NOTA
Este método não aceita uma restrição de expressão/valor.
:::

#### `whereDoesntHave`
O oposto da cláusula `whereHas`:

```js
const posts = await Post
  .query()
  .whereDoesntHave('comments', (builder) => {
    builder.where('is_published', false)
  })
  .fetch()
```

::: info NOTA
Este método não aceita uma restrição de expressão/valor.
:::

Você pode adicionar uma cláusula `or` chamando os métodos `orHas`, `orWhereHas`, `orDoesntHave` e `orWhereDoesntHave`.

## Contagens
Recupere *contagens* de relacionamento chamando o método `withCount`:

```js
const posts = await Post
  .query()
  .withCount('comments')
  .fetch()

posts.toJSON()
```

```js
// JSON Output

{
  title: 'Adonis 101',
  __meta__: {
    comments_count: 2
  }
}
```

Defina um *alias* para uma contagem como:

```js
const posts = await Post
  .query()
  .withCount('comments as total_comments')
  .fetch()
```

```js
// JSON Output

__meta__: {
  total_comments: 2
}
```

### Restrições de contagem
Por exemplo, para recuperar apenas a contagem de comentários que foram aprovados:

```js
const posts = await Post
  .query()
  .withCount('comments', (builder) => {
    builder.where('is_approved', true)
  })
  .fetch()
```

## Inserções, atualizações e exclusões
Adicionar, atualizar e excluir registros relacionados é tão simples quanto consultar dados.

#### `save`
O método `save` espera uma instância do modelo relacionado.

`save` pode ser aplicado aos seguintes tipos de relacionamento:

- `hasOne`
- `hasMany`
- `belongsToMany`

```js
const User = use('App/Models/User')
const Post = use('App/Models/Post')

const user = await User.find(1)

const post = new Post()
post.title = 'Adonis 101'

await user.posts().save(post)
```

#### `create`
O método `create` é semelhante a `save`, mas espera um objeto JavaScript simples, retornando a instância do modelo relacionado.

`create` pode ser aplicado aos seguintes tipos de relacionamento:

- `hasOne`
- `hasMany`
- `belongsToMany`

```js
const User = use('App/Models/User')

const user = await User.find(1)

const post = await user
  .posts()
  .create({ title: 'Adonis 101' })
```

#### `createMany`
Salve muitas linhas relacionadas no banco de dados.

`createMany` pode ser aplicado aos seguintes tipos de relacionamento:

- `hasMany`
- `belongsToMany`

```js
const User = use('App/Models/User')

const user = await User.find(1)

const post = await user
  .posts()
  .createMany([
    { title: 'Adonis 101' },
    { title: 'Lucid 101' }
  ])
```

#### `saveMany`
Semelhante a `save`, mas salva várias instâncias do modelo relacionado:

`saveMany` pode ser aplicado aos seguintes tipos de relacionamento:

- `hasMany`
- `belongsToMany`

```js
const User = use('App/Models/User')
const Post = use('App/Models/Post')

const user = await User.find(1)

const adonisPost = new Post()
adonisPost.title = 'Adonis 101'

const lucidPost = new Post()
lucidPost.title = 'Lucid 101'

await user
  .posts()
  .saveMany([adonisPost, lucidPost])
```

#### `associate`
O método `associate` é exclusivo do relacionamento `belongsTo`, associando duas instâncias de modelo entre si.

Supondo que um `Perfil` pertença a um `Usuário`, para associar um `Usuário` a um `Perfil`:

```js
const Profile = use('App/Models/Profile')
const User = use('App/Models/User')

const user = await User.find(1)
const profile = await Profile.find(1)

await profile.user().associate(user)
```

#### `dissociate`
O método `dissociate` é o oposto de `associate`.

Para remover um relacionamento associado:

```js
const Profile = use('App/Models/Profile')
const profile = await Profile.find(1)

await profile.user().dissociate()
```

#### `attach`
O método `attach` é chamado em um relacionamento `belongsToMany` para anexar um modelo relacionado via tabela dinâmica:

```js
const User = use('App/Models/User')
const Car = use('App/Models/Car')

const mercedes = await Car.findBy('reg_no', '39020103')
const user = await User.find(1)

await user.cars().attach([mercedes.id])
```

O método `attach` aceita um retorno de chamada opcional que recebe a instância `pivotModel`, permitindo que você defina propriedades extras em uma tabela dinâmica, se necessário:

```js
const mercedes = await Car.findBy('reg_no', '39020103')
const audi = await Car.findBy('reg_no', '99001020')

const user = await User.find(1)
const cars = [mercedes.id, audi.id]

await user.cars().attach(cars, (row) => {
  if (row.car_id === mercedes.id) {
    row.is_current_owner = true
  }
})
```

::: warning OBSERVAÇÃO
Os métodos `create` e `save` para relacionamentos `belongsToMany` também aceitam um retorno de chamada que permite que você defina propriedades extras em uma tabela dinâmica, se necessário.
:::

#### `detach`
O método `detach` é o oposto do método `attach`, removendo todos os relacionamentos de tabela dinâmica existentes:

```js
const user = await User.find(1)
await user.cars().detach()
```

Para desanexar apenas as relações selecionadas, passe uma matriz de ids:

```js
const user = await User.find(1)
const mercedes = await Car.findBy('reg_no', '39020103')

await user.cars().detach([mercedes.id])
```

#### `sync`
O método `sync` fornece um atalho conveniente para `detach` e então `attach`:

```js
const mercedes = await Car.findBy('reg_no', '39020103')
const user = await User.find(1)

// Behave the same way as:
// await user.cars().detach()
// await user.cars().attach([mercedes.id])

await user.cars().sync([mercedes.id])
```

#### `update`
O método `update` atualiza em massa as linhas consultadas.

Você pode usar os métodos [Query Builder](/docs/08-Lucid-ORM/01-Getting-Started.md#query-builder) para atualizar apenas campos específicos:

```js
const user = await User.find(1)

await user
  .posts()
  .where('title', 'Adonis 101')
  .update({ is_published: true })
```

Para atualizar uma tabela dinâmica, chame `pivotQuery` antes de `update`:

```js
const user = await User.find(1)

await user
  .cars()
  .pivotQuery()
  .where('name', 'mercedes')
  .update({ is_current_owner: true })
```

#### `delete`
O método `delete` remove linhas relacionadas do banco de dados:

```js
const user = await User.find(1)

await user
  .cars()
  .where('name', 'mercedes')
  .delete()
```

::: warning OBSERVAÇÃO
No caso de `belongsToMany`, esse método também remove o relacionamento da tabela dinâmica.
:::
