# Relacionamentos

Os relacionamentos são a espinha dorsal dos aplicativos orientados a dados, vinculando um tipo de modelo a outro.

Por exemplo, `User` poderia ter muitas relações com `Post`, e cada `Post` poderia ter muitas relações com `Comment`.

A API expressiva da Lucid torna o processo de associação e busca de relações de modelo simples e intuitivo, sem 
a necessidade de tocar em uma instrução SQL ou mesmo editar um esquema SQL.

## Exemplo básico
Vamos examinar um cenário contendo dois modelos: `User` e `Profile`.

No nosso exemplo, toda instância `User` pode ter uma única `Profile`.

Chamamos isso de um relacionamento de um para um .

### Definindo relacionamento
Para definir esse relacionamento, adicione o seguinte método ao seu modeo `User`:

``` js
const Model = use('Model')

class User extends Model {
  profile () {
    return this.hasOne('App/Models/Profile')
  }
}

module.exports = User
```

No exemplo acima, adicionamos um método `profile` ao modelo `User` retornando um relacionamento `hasOne`
digitado no modelo `Profile`.

Se o modelo `Profile` não existir, gere-o:

```
> adonis make:model Profile
```

``` js
const Model = use('Model')

class Profile extends Model {
}

module.exports = Profile
```

> Não há necessidade de definir um relacionamento nos dois modelos. É necessário defini-lo 
> unidirecionalmente em um único modelo.

### Buscando perfil de usuário
Agora que definimos o relacionamento entre `User` e `Profile`, podemos executar o seguinte código 
para buscar o perfil de um usuário:

``` js
const User = use('App/Models/User')

const user = await User.find(1)
const userProfile = await user.profile().fetch()
```

### hasOne
Uma relação `hasOne` define uma relação de 1 para 1 usando uma chave estrangeira para o modelo relacionado.

#### API
``` js
hasOne(relatedModel, primaryKey, foreignKey)
```

**relatedModel**
Uma referência de contêiner de IoC ao modelo do qual o modelo atual possui .

**primaryKey**
O padrão é a chave primária do modelo atual (ou seja id).

**ForeignKey**
O padrão é de nome no modelo atual é `nomeTabela_chavePrimaria`. A forma singular do nome da tabela é 
usada (por exemplo, a chave estrangeira `user_id` faz referência à coluna `id` na tabela `users`).


### Tabelas de banco de dados

<img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1502900169/HasOne_wechyq.png" />

### Definindo Relação

``` js
const Model = use('Model')

class User extends Model {
  profile () {
    return this.hasOne('App/Models/Profile')
  }
}

module.exports = User
```

## hasMany
Uma relação `hasMany` define uma relação de um para muitos usando uma chave estrangeira para outros modelos relacionados.

### API

``` js
hasMany(relatedModel, primaryKey, foreignKey)
```

**relatedModel**
Uma referência de contêiner de IoC ao modelo do qual o modelo atual possui muitos .

**primaryKey**
O padrão é a chave primária do modelo atual (ou seja `id`).

**ForeignKey**
O padrão é para o modelo atual é `nomeTabela_chavePrimária`. A forma singular do nome da tabela é 
usada (por exemplo, a chave estrangeira `user_id` faz referência à coluna `id` na tabela `users`).

### Tabelas de banco de dados

<img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1502900449/HasMany_kkbac9.png">

Definindo Relação

``` js
const Model = use('Model')

class User extends Model {
  posts () {
    return this.hasMany('App/Models/Post')
  }
}

module.exports = User
```

### belongsTo
O relacionamento belongsTo é o inverso do relacionamento hasOne e é aplicado no outro extremo da relação.

Continuando com o nosso exemplo `User` e `Profile`, o modelo `Profile` pertence ao modelo `User`, e, portanto, 
tem a relação `belongsTo` definida nele.

### API
``` js
belongsTo(relatedModel, primaryKey, foreignKey)
```

**relatedModel**
Uma referência de contêiner de IoC ao modelo no qual o mesmo pertence.

**primaryKey**
O padrão é a chave estrangeira do modelo relacionado (no nosso exemplo: `Profile` pertence ao modelo `User`, isso seria `user_id`).

**ForeignKey**
O padrão é a chave primária do modelo relacionado.

### Tabelas de banco de dados

<img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1502900684/BelongsTo_fwqdc3.png">

### Definindo Relação

``` js
const Model = use('Model')

class Profile extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Profile
```

## Pertence a Muitos

O relacionamento `belongsToMany` permite definir um relacionamento de muitos para muitos nos dois modelos.

Por exemplo:

+ `User` pode ter muitos modelos `Car`.
+ `Car` pode ter muitos modelos `User` (ou seja, proprietários) durante sua vida útil.

Como ambos, `User` e `Car` podem ter muitas relações com o outro modelo, dizemos que cada modelo pertence a 
muitos do outro modelo.

Ao definir um relacionamento `belongsToMany`, não armazenamos uma chave estrangeira em nenhuma das nossas tabelas 
de modelo, como fizemos para os relacionamentos `hasOne` e `hasMany`.

Em vez disso, devemos confiar em uma terceira tabela intermediária chamada tabela dinâmica.

> Você pode criar tabelas dinâmicas usando [arquivos de migração](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/database/migrations.md).

## API
``` js
belongsToMany(
  relatedModel,
  foreignKey,
  relatedForeignKey,
  primaryKey,
  relatedPrimaryKey
)
```

**relatedModel**
Uma referência de contêiner de IoC ao modelo do qual o modelo atual possui muitos .

**ForeignKey**
O padrão é a chave estrangeira do modelo atual (em nosso exemplo: `User` pertence a muitos `Car`, isso seria `user_id`).

**relatedForeignKey**
O padrão é a chave estrangeira do modelo relacionado (em nosso exemplo: `User` pertence a muitos `Car`, isso seria `car_id`).

**primaryKey**
O padrão é a chave primária do modelo atual (ou seja `id`).

**relatedPrimaryKey**
O padrão é a chave primária do modelo relacionado (ou seja `id`).

### Tabelas de banco de dados
<img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1502900684/BelongsTo_fwqdc3.png">

### Definindo Relação

``` js
const Model = use('Model')

class User extends Model {
  cars () {
    return this.belongsToMany('App/Models/Car')
  }
}

module.exports = User
```

No exemplo acima, a tabela denominada `car_user` é a tabela dinâmica que armazena o relacionamento 
exclusivo entre as chaves primárias dos modelos `Car` e `User`.

#### tabela dinâmica
Por padrão, os nomes de tabelas dinâmicas são derivados classificando os nomes de modelos relacionados 
em minúsculas em ordem alfabética e juntando-os a um `_` caractere (por exemplo, User + Car = car_user).

Para definir um nome de tabela dinâmica personalizado, chame `pivotTable` na definição de relacionamento:

``` js
cars () {
  return this
    .belongsToMany('App/Models/Car')
    .pivotTable('user_cars')
}
```

#### withTimestamps
Por padrão, não se supõe que as tabelas dinâmicas tenham registros de data e hora.

Para ativar os registros de data e hora, chame withTimestampsa definição de relacionamento:

``` js
cars () {
  return this
    .belongsToMany('App/Models/Car')
    .withTimestamps()
}
```

#### withPivot
Por padrão, apenas chaves estrangeiras são retornadas de uma tabela dinâmica.

Para retornar outros campos da tabela dinâmica, chame `withPivot` na definição de relacionamento:

``` js
cars () {
  return this
    .belongsToMany('App/Models/Car')
    .withPivot(['is_current_owner'])
}
```

#### pivotModel
Para obter mais controle sobre as consultas feitas em uma tabela dinâmica, você pode vincular um modelo dinâmico:

``` js
cars () {
  return this
    .belongsToMany('App/Models/Car')
    .pivotModel('App/Models/UserCar')
}
```

``` js
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

Com um modelo de pivô atribuído, você pode usar [ganchos de ciclo de vida](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/orm/hooks.md) , [getters/setters](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/orm/mutators.md), etc.

> Após chamar `pivotModel`, você não pode chamar os métodos `pivotTable` e `withTimestamps`. Em vez disso, 
> você deve definir esses valores no próprio modelo de pivô.

## manyThrough
O relacionamento `manyThrough` é uma maneira conveniente de definir uma relação indireta.

Por exemplo:

+ `User` pertence a `Country`.
+ `User` tem muitos modelos `Post`.

Usando `manyThrough`, você pode buscar todos os modelos `Post` para um determinado `Country`.

### API
``` js
manyThrough(
  relatedModel,
  relatedMethod,
  primaryKey,
  foreignKey
)
```

**relatedModel**
Uma referência de contêiner de IoC ao modelo que o modelo atual precisa acessar para alcançar 
o modelo indiretamente relacionado.

**relatedMethod**
O método de relacionamento chamado `relatedModel` para buscar os resultados do modelo relacionados indiretamente.

**primaryKey**
O padrão é a chave primária do modelo atual (ou seja `id`).

**ForeignKey**
O padrão é a chave estrangeira para o modelo atual (no nosso exemplo: `Posts` e `Country` por exemplo, teria `country_id`).

### Tabelas de banco de dados
<img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1502905066/HasManyThrough_dcr86k.png">

### Definindo relações
Os relacionamentos precisam ser definidos nos modelos primário e intermediário.

Continuando com o nosso exemplo `Posts` através de `Country` , vamos definir o relacionamento necessário `hasMany` 
sobre o modeo intermediário `User`:

``` js
const Model = use('Model')

class User extends Model {
  posts () {
    return this.hasMany('App/Models/Post')
  }
}
```

Por fim, defina o relacionamento `manyThrough` no modelo `Country` principal:

``` js
const Model = use('Model')

class Country extends Model {
  posts () {
    return this.manyThrough('App/Models/User', 'posts')
  }
}
```

No exemplo acima, o segundo parâmetro é uma referência ao método `posts` no modeo `User`.

> O parâmetro `relatedMethod` sempre deve ser passado para o método `manyThrough` para que muitos relacionamentos funcionem.

## Consultando dados

A consulta de dados relacionados é bastante simplificada pela API intuitiva do Lucid, fornecendo 
uma interface consistente para todos os tipos de relacionamentos de modelo.

Se um `User` tiver muitos modeos `Post`, podemos buscar todas as postagens para o usuário da seguinte forma `id = 1`:

``` js
const User = use('App/Models/User')

const user = await User.find(1)
const posts = await user.posts().fetch()
```

Adicione restrições de tempo de execução chamando os métodos do [Query Builder](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/database/query-builder.md) como uma consulta típica:

``` js
const user = await User.find(1)

// posts publicados
const posts = await user
  .posts()
  .where('is_published', true)
  .fetch()
```

O exemplo acima busca todas as postagens publicadas para o usuário com `id = 1`.

### Consultando tabela dinâmica
Você pode adicionar cláusulas `where` para tabelas `belongsToMany` dinâmicas da seguinte forma:

```
const user = await User.find(1)

const cars = await user
  .cars()
  .wherePivot('is_current_owner', true)
  .fetch()
```

O exemplo acima busca todos os carros em que o proprietário atual é usuário `id = 1`.

Os métodos `whereInPivote` e `orWherePivot` também estão disponíveis.

## Carregamento eager (ansioso)
Quando você deseja buscar relações para mais de uma relação base (por exemplo, postagens para 
mais de um usuário), o carregamento eager é a maneira preferida de fazê-lo.

**Carregamento ansioso** é o conceito de buscar relacionamentos com as consultas mínimas possíveis 
ao banco de dados, na tentativa de evitar o problema [`n + 1`](https://secure.phabricator.com/book/phabcontrib/article/n_plus_one/#overview).

**Sem carregamento rápido**, usando as técnicas discutidas anteriormente nesta seção:

*Não recomendado*
``` js
const User = use('App/Models/User')

const users = await User.all()
const posts = []

for (let user of users) {
  const userPosts = await user.posts().fetch()
  posts.push(userPosts)
}
```

O exemplo acima faz consultas `n+1` ao banco de dados, onde nestá o número de usuários. Fazer um loop em 
um grande número de usuários resultaria em uma grande sequência de consultas feitas no banco de dados, o 
que dificilmente é o ideal!

Com o carregamento rápido, são necessárias apenas 2 consultas para buscar todos os usuários e suas postagens:

*Recomendado*
``` js
const User = use('App/Models/User')

const users = await User
  .query()
  .with('posts')
  .fetch()
```

O método `with` ansiosamente carrega a relação passada como parte da carga original, portanto, a execução 
`users.toJSON()` agora retornará uma saída da seguinte forma:


*Saída JSON*
```
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

Na saída JSON acima, cada objeto `User` agora tem uma propriedade `posts` de relacionamento, facilitando a 
identificação em um relance que `Post` pertence a `User`.

### Adicionando restrições de tempo de execução
Adicione restrições de tempo de execução a relacionamentos carregados ansiosamente, como:

``` js
const users = await User
  .query()
  .with('posts', (builder) => {
    builder.where('is_published', true)
  })
  .fetch()
```

### Carregando várias relações
Múltiplas relações podem ser carregadas encadeando o método `with`:

``` js
const users = await User
  .query()
  .with('posts')
  .with('profile')
  .fetch()
```

### Carregando relações aninhadas
Relações aninhadas são carregadas via notação de ponto.

A consulta a seguir carrega todas as postagens de `User` e seus comentários relacionados:

``` js
const users = await User
  .query()
  .with('posts.comments')
  .fetch()
```

Os retornos de chamada de restrição de relação aninhada aplicam-se apenas à última relação:

``` js
const users = await User
  .query()
  .with('posts.comments', (builder) => {
    builder.where('approved', true)
  })
  .fetch()
```

No exemplo acima, a claúsula `builder.where` é aplicada apenas ao relacionamento `comments` (não ao relacionamento `posts`).

Para adicionar uma restrição à primeira relação , use a seguinte abordagem:

``` js
const users = await User
  .query()
  .with('posts', (builder) => {
    builder.where('is_published', true)
      .with('comments')
  })
  .fetch()
```

No exemplo acima, uma restrição `where` é adicionada à relação `posts` enquanto o carregamento de `posts.comments`
é feito ao mesmo tempo.

### Recuperando Dados de Modelos Carregados
Para recuperar os dados carregados, você deve chamar o método `getRelated`:

``` js
const user = await User
  .query()
  .with('posts')
  .fetch()

const posts = user.getRelated('posts')
```

## Lazy Eager Loading
Para carregar relacionamentos depois de buscar dados, use o método `load`

Por exemplo, para carregar relacionado de `posts` depois de já buscar um `User`:

``` js
const user = await User.find(1)
await user.load('posts')
```

Você pode carregar preguiçosamente vários relacionamentos usando o método `loadMany`:

``` js
const user = await User.find(1)
await user.loadMany(['posts', 'profiles'])
```

Para definir restrições de consulta via `loadMany` você deve passar um objeto:

``` js
const user = await User.find(1)
await user.loadMany({
  posts: (builder) => builder.where('is_published', true),
  profiles: null
})
```

### Recuperando Dados de Modelos Carregados
Para recuperar os dados carregados, você deve chamar o método `getRelated`:

``` js
const user = await User.find(1)
await user.loadMany(['posts', 'profiles'])

const posts = user.getRelated('posts')
const profiles = user.getRelated('profiles')
```

## Filtrando dados
A API do Lucid simplifica a filtragem de dados, dependendo da existência de um relacionamento.

Vamos usar o exemplo clássico de encontrar todas as postagens com comentários.

Aqui está o nosso modeo `Post` e sua definição de relacionamento com `comments`:

``` js
const Model = use('Model')

class Post extends Model {
  comments () {
    return this.hasMany('App/Models/Comments')
  }
}
```

### has
Para recuperar apenas postagens com pelo menos uma Comment, encadeie o hasmétodo:

``` js
const posts = await Post
  .query()
  .has('comments')
  .fetch()
```

**É simples assim!**  😲

Adicione uma restrição de expressão/valor ao método `has` da seguinte maneira:

``` js
const posts = await Post
  .query()
  .has('comments', '>', 2)
  .fetch()
```

O exemplo acima recuperará apenas postagens com mais de 2 comentários.

### whereHas
O método `whereHas` é semelhante a, `has` mas permite restrições mais específicas.

Por exemplo, para buscar todas as postagens com pelo menos 2 comentários publicados:

``` js
const posts = await Post
  .query()
  .whereHas('comments', (builder) => {
    builder.where('is_published', true)
  }, '>', 2)
  .fetch()
``` 

### doesntHave
O oposto da cláusula `has`:

``` js
const posts = await Post
  .query()
  .doesntHave('comments')
  .fetch()
```

Este método não aceita uma restrição de expressão/valor.

### whereDoesntHave
O oposto da cláusula `whereHas`:

``` js
const posts = await Post
  .query()
  .whereDoesntHave('comments', (builder) => {
    builder.where('is_published', false)
  })
  .fetch()
```

> Este método não aceita uma restrição de expressão/valor.

Você pode adicionar uma cláusula `or` chamando os métodos `orHas`, `orWhereHas`, `orDoesntHave` e `orWhereDoesntHave`.

## Counts
Recupere contagens de relacionamento chamando o método `withCount`:

``` js
const posts = await Post
  .query()
  .withCount('comments')
  .fetch()

posts.toJSON()
```

Saída JSON
```
{
  title: 'Adonis 101',
  __meta__: {
    comments_count: 2
  }
}
```

Defina um alias para uma contagem da seguinte maneira:

``` js
const posts = await Post
  .query()
  .withCount('comments as total_comments')
  .fetch()
```

Saída JSON
```
__meta__: {
  total_comments: 2
}
```

### Restrições de contagem
Por exemplo, para recuperar apenas a contagem de comentários que foram aprovados:

``` js
const posts = await Post
  .query()
  .withCount('comments', (builder) => {
    builder.where('is_approved', true)
  })
  .fetch()
```

## Inserções, atualizações e exclusões
Adicionar, atualizar e excluir registros relacionados é tão simples quanto consultar dados.

### save
O método `save` espera uma instância do modelo relacionado.

`save` pode ser aplicado aos seguintes tipos de relacionamento:

+ hasOne
+ hasMany
+ belongsToMany

``` js
const User = use('App/Models/User')
const Post = use('App/Models/Post')

const user = await User.find(1)

const post = new Post()
post.title = 'Adonis 101'

await user.posts().save(post)
```

### create
O método `create` é semelhante a `save` mas, espera um objeto JavaScript simples, retornando a 
instância do modelo relacionado.

`create` pode ser aplicado aos seguintes tipos de relacionamento:

+ hasOne
+ hasMany
+ belongsToMany

``` js
const User = use('App/Models/User')

const user = await User.find(1)

const post = await user
  .posts()
  .create({ title: 'Adonis 101' })
```

### createMany
Salve muitas linhas relacionadas no banco de dados.

`createMany` pode ser aplicado aos seguintes tipos de relacionamento:

+ hasMany
+ belongsToMany

``` js
const User = use('App/Models/User')

const user = await User.find(1)

const post = await user
  .posts()
  .createMany([
    { title: 'Adonis 101' },
    { title: 'Lucid 101' }
  ])
```

### saveMany
Semelhante a `save`, mas salva várias instâncias do modelo relacionado:

`saveMany` pode ser aplicado aos seguintes tipos de relacionamento:

+ hasMany
+ belongsToMany

``` js
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

### associate
O método `associate` é exclusivo do relacionamento `belongsTo`, associando duas instâncias do 
modelo uma à outra.

Assumindo que `Profile` pertence a `User`, associe `User` a `Profile`:

``` js
const Profile = use('App/Models/Profile')
const User = use('App/Models/User')

const user = await User.find(1)
const profile = await Profile.find(1)

await profile.user().associate(user)
```

### dissociate
O método `dissociate` é o oposto de associate.

Para descartar um relacionamento associado:

``` js
const Profile = use('App/Models/Profile')
const profile = await Profile.find(1)

await profile.user().dissociate()
```

### attach
O método `attach` é chamado em um relacionamento `belongsToMany` para anexar um modelo relacionado via tabela dinâmica:

``` js
const User = use('App/Models/User')
const Car = use('App/Models/Car')

const mercedes = await Car.findBy('reg_no', '39020103')
const user = await User.find(1)

await user.cars().attach([mercedes.id])
```

O método `attach` aceita um retorno de chamada opcional que recebe a instância `pivotModel`, permitindo definir 
propriedades extras em uma tabela dinâmica, se necessário:

``` js
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

> Os métodos `create` e `save` para relacionamentos `belongsToMany` também aceitam um retorno de chamada, 
> permitindo definir propriedades extras em uma tabela dinâmica, se necessário.

### detach
O método `detach` é o oposto do método `attach`, removendo todos os relacionamentos de tabela dinâmica existentes:

``` js
const user = await User.find(1)
await user.cars().detach()
```

Para desanexar apenas relações selecionadas, passe uma matriz de IDs:

``` js
const user = await User.find(1)
const mercedes = await Car.findBy('reg_no', '39020103')

await user.cars().detach([mercedes.id])
```

### sync
O método `sync` fornece um atalho conveniente para `detach`, e em seguida `attach`:

``` js
const mercedes = await Car.findBy('reg_no', '39020103')
const user = await User.find(1)

// Comporte-se da mesma maneira que:
// await user.cars().detach()
// await user.cars().attach([mercedes.id])

await user.cars().sync([mercedes.id])
```

### update
O método `update` em massa atualiza as linhas consultadas.

Você pode usar os métodos do Query Builder para atualizar apenas campos específicos:

``` js
const user = await User.find(1)

await user
  .posts()
  .where('title', 'Adonis 101')
  .update({ is_published: true })
```

Para atualizar uma tabela dinâmica, ligue `pivotQuery` antes de `update`:

``` js
const user = await User.find(1)

await user
  .cars()
  .pivotQuery()
  .where('name', 'mercedes')
  .update({ is_current_owner: true })
```
### delete
O método `delete` remove linhas relacionadas do banco de dados:

``` js
const user = await User.find(1)

await user
  .cars()
  .where('name', 'mercedes')
  .delete()
```

> No caso de `belongsToMany`, esse método também elimina o relacionamento da tabela dinâmica.
