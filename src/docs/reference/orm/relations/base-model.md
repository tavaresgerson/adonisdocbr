# Modelo Base

Os modelos de dados Lucid estendem o [Modelo Base](https://github.com/adonisjs/lucid/blob/develop/src/Orm/BaseModel/index.ts) para herdar as propriedades e métodos para interagir com uma tabela de banco de dados.

```ts
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
}
```

## Opções do adaptador de modelo
Muitos dos métodos de modelo aceitam o seguinte [objeto de opções](https://github.com/adonisjs/lucid/blob/0fc3e2391ba6743427fac62e0895e458d7bc8137/adonis-typings/model.ts#L293). Estamos escrevendo aqui uma vez e usaremos a referência em outro lugar.

```ts
const modelOptions = {
  client: await Database.transaction(),
  connection: 'pg',
  profiler: profiler
}
```

Todas as propriedades do objeto são opcionais

[cliente de consulta](../database/query-client.md). Na maioria das vezes, você se verá passando o
- `connection` é a referência a um nome de conexão registrado. Útil quando você tem um aplicativo multilocatário e deseja passar dinamicamente o nome da conexão usada pelo locatário.
- `profiler` é a referência à instância do profiler.

## Propriedades/métodos estáticos

### ``static boot``
Inicialize o modelo. Como a história de herança da classe JavaScript não é tão boa com propriedades estáticas. Precisamos de uma fase `boot` personalizada para garantir que tudo funcione conforme o esperado.

```ts
User.boot()
```

### ``static booted``
Um booleano para saber se um modelo foi inicializado ou não.

```ts
class User extends BaseModel {
  public static boot () {
    if (this.booted) {
      return
    }

    super.boot()
  }
}
```

### ``static before``
Defina um hook `before` para um evento específico.

```ts
public static boot () {
  if (this.booted) {
    return
  }

  // highlight-start
  super.boot()
  this.before('create', (user) => {
  })
  // highlight-end
}
```

### ``static after``
Defina um hook `after` para um evento específico.

```ts
public static boot () {
  if (this.booted) {
    return
  }

  // highlight-start
  super.boot()
  this.after('create', (user) => {
  })
  // highlight-end
}
```

Outra opção (preferida) é usar os [decoradores](https://github.com/adonisjs/lucid/blob/0fc3e2391ba6743427fac62e0895e458d7bc8137/src/Orm/Decorators/index.ts#L67-L244) para marcar métodos estáticos do modelo como hooks.

```ts
import {
  BaseModel,
  // highlight-start
  beforeSave,
  // highlight-end
} from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  // highlight-start
  @beforeSave()
  public static hashPassword(user: User) {
  }
  // highlight-end
}
```

### ``static create``
Cria uma nova instância de modelo e persiste no banco de dados imediatamente.

```ts
const user = await User.create({
  email: 'virk@adonisjs.com',
  password: 'secret',
})
```

O método aceita um total de três argumentos.

- `data`: Os dados a persistir no banco de dados
[opções do adaptador de modelo](#model-adapter-options).
- `allowExtraProperties`: Um booleano para permitir a passagem de propriedades extras no objeto de dados. Quando definido como `false`, o método gerará uma exceção quando as propriedades de dados não forem marcadas como colunas.

### ``static createMany``
Cria várias instâncias de um modelo e persiste no banco de dados. O método `createMany` aceita as mesmas opções que o método [create](#static-create).

- Uma consulta de inserção é emitida para cada instância de modelo para garantir que executemos os ganchos do ciclo de vida para cada instância individual.
- Todas as consultas de inserção são encapsuladas internamente dentro de uma transação. Em caso de erro, tudo será revertido.

```ts
const user = await User.createMany([
  {
    email: 'virk@adonisjs.com',
    password: 'secret',
  },
  {
    email: 'romain@adonisjs.com',
    password: 'secret',
  },
])
```

### ``static find``
Encontre uma linha do banco de dados usando a chave primária do modelo. Se uma linha existir, ela será hidratada para a instância do modelo, caso contrário, ``null` será retornado.

```ts
const user = await User.find(1)
if (!user) {
  return
}

console.log(user instanceof User)
```

O método aceita um total de dois argumentos.

- ``value`: O valor da chave primária.
[opções do adaptador do modelo](#model-adapter-options).

### ``static findOrFail``
O mesmo que o método `find`. Mas em vez de retornar `null`, ele gerará uma exceção quando a linha não existir.

O método `findOrFail` aceita as mesmas opções que o método [find](#static-find).

```ts
const user = await User.findOrFail(1)
```

### ``static findBy``
Encontre uma linha dentro do banco de dados usando um par chave-valor. Se uma linha existir, ela será hidratada para a instância do modelo, caso contrário, ``null` será retornado.

```ts
const user = await User.findBy('email', 'virk@adonisjs.com')
```

O método aceita um total de três argumentos.

- `columName`: O nome da coluna a ser usado na condição where.
- ``value`: O valor da coluna.
[opções do adaptador de modelo](#model-adapter-options).

### ``static findByOrFail``
O mesmo que o método `findBy`. Mas em vez de retornar `null`, ele gerará uma exceção quando a linha não existir.

O método `findByOrFail` aceita as mesmas opções que o método [findBy](#static-find-by).

```ts
const user = await User.findByOrFail('email', 'virk@adonisjs.com')
```

### ``static first``
Retorna a primeira linha do banco de dados. Se uma linha existir, ela será hidratada para a instância do modelo, caso contrário, `null` será retornado.

:::note
O método `first` depende da ordem padrão do mecanismo de banco de dados subjacente.
:::

```ts
const user = await User.first()
```

O método aceita um único argumento como as [opções do adaptador de modelo](#model-adapter-options).

### ``static firstOrFail``
O mesmo que o método `first`. Mas em vez de retornar `null`, ele gerará uma exceção quando a linha não existir.

```ts
const user = await User.firstOrFail()
```

O método aceita um único argumento como as [opções do adaptador de modelo](#model-adapter-options).

### ``static findMany``
Encontre várias instâncias de modelo de uma matriz de valores para a chave primária do modelo. Por exemplo:

```ts
const users = await User.findMany([1, 2, 3])
```

- Os resultados serão ordenados pela chave primária em ordem desc.
- Internamente, o método usa a cláusula SQL `where in` e sempre retorna uma matriz.
[opções do adaptador de modelo](#model-adapter-options) como o segundo argumento.

### ``static firstOrNew``
Retorna uma linha existente do banco de dados ou cria uma instância local do modelo, quando a linha para os critérios de pesquisa não é encontrada.

```ts
const searchCriteria = {
  email: 'virk@adonisjs.com',
}

const savePayload = {
  name: 'Virk',
  email: 'virk@adonisjs.com',
  password: 'secret'
}

const user = await User.firstOrNew(searchCriteria, savePayload)

if (user.$isPersisted) {
  // user exists in the database
} else {
  // un-persisted user instance
}
```

O método aceita um total de quatro argumentos.

- `searchCriteria`: Valores a serem usados ​​para a instrução select.
- `savePayload`: Valores a serem usados ​​para criar uma nova instância de modelo. Também mesclamos o `searchCriteria` com o objeto save payload.
[opções do adaptador de modelo](#model-adapter-options).
- `allowExtraProperties`: Um booleano para permitir a passagem de propriedades extras no objeto de dados. Quando definido como `false`, o método gerará uma exceção quando as propriedades de dados não forem marcadas como colunas.

### `static firstOrCreate`
O `firstOrCreate` é semelhante ao método `firstOrNew`. No entanto, em vez de apenas criar uma instância de modelo local. O método `firstOrCreate` também executa a consulta de inserção.

O método aceita as mesmas opções que o método [firstOrNew](#static-firstornew).

```ts
const user = await User.firstOrCreate(searchCriteria, savePayload)

if (user.$isLocal) {
  // no rows found in db. Hence a new one is created
} else {
  // existing db row
}
```

### `static updateOrCreate`
O método `updateOrCreate` atualiza a linha existente ou cria uma nova. O método aceita as mesmas opções que o método [firstOrNew](#static-firstornew).

Este método obtém um "UPDATE lock" na linha durante a seleção. Isso é feito para evitar que leituras simultâneas obtenham os valores antigos quando a linha estiver no meio da atualização.

```ts
const searchCriteria = {
  id: user.id
}

const savePayload = {
  total: getTotalFromSomeWhere()
}

const cart = await Cart.updateOrCreate(searchCriteria, savePayload)
```

### `static fetchOrNewUpMany`

O método `fetchOrNewUpMany` é semelhante ao método `firstOrNew`. No entanto, ele opera em várias linhas.

```ts
const keyForSearch = 'email'
const payload = [
  {
    email: 'virk@adonisjs.com',
    name: 'Virk',
  },
  {
    email: 'romain@adonisjs.com',
    name: 'Romain',
  }
]

const users = await User.fetchOrNewUpMany(keyForSearch, payload)

for (let user of users) {
  if (user.$isPersisted) {
    // existing row in the database
  } else {
    // local instance
  }
}
```

No exemplo acima, o Lucid pesquisará usuários existentes pelo e-mail `(keyForSearch)`. Para linhas ausentes, uma nova instância local do modelo será criada.

O método aceita as mesmas opções que o método [firstOrNew](#static-firstornew).

### `static fetchOrCreateMany`

O método `fetchOrCreateMany` é semelhante ao método `firstOrCreate`. No entanto, ele opera em várias linhas.

```ts
const keyForSearch = 'email'
const payload = [
  {
    email: 'virk@adonisjs.com',
    name: 'Virk',
  },
  {
    email: 'romain@adonisjs.com',
    name: 'Romain',
  }
]

const users = await User.fetchOrCreateMany(keyForSearch, payload)

for (let user of users) {
  if (user.$isLocal) {
    // local+persisted instance
  } else {
    // existing row in the database
  }
}
```

O método aceita as mesmas opções que o método [firstOrNew](#static-firstornew).

### `static updateOrCreateMany`

O método `updateOrCreateMany` é semelhante ao método `updateOrCreate`. No entanto, ele opera em várias linhas.

Este método obtém um "bloqueio UPDATE" na linha durante a seleção. Isso é feito para evitar que leituras simultâneas obtenham os valores antigos quando a linha estiver no meio da atualização.

```ts
const keyForSearch = 'email'
const payload = [
  {
    email: 'virk@adonisjs.com',
    name: 'Virk',
  },
  {
    email: 'romain@adonisjs.com',
    name: 'Romain',
  }
]

const users = await User.updateOrCreateMany(keyForSearch, payload)
```

O método aceita as mesmas opções que o método [firstOrNew](#static-firstornew).

### `static all`

Um método de atalho para buscar todas as linhas de uma determinada tabela de banco de dados. As linhas são classificadas em ordem decrescente pela chave primária.

```ts
const users = await User.all()
```

Opcionalmente, você também pode passar [opções do adaptador de modelo](#model-adapter-options) como um argumento para o método `all`.

### `static query`

Retorna uma instância do [construtor de consulta de modelo](./query-builder.md). Ao contrário do construtor de consulta padrão, o resultado do construtor de consulta de modelo é uma matriz de instâncias de modelo.

```ts
const users = await User
  .query()
  .where('age', '>', 18)
  .orderBy('id', 'desc')
  .limit(20)
```

Opcionalmente, você também pode passar [opções do modelo](#model-adapter-options) como um argumento para o método `query`.

### `static truncate`

Um atalho para truncar a tabela do banco de dados. . Opcionalmente, você também pode cascatear referências de chave estrangeira.

```ts
await User.truncate()

// cascade
await User.truncate(true)

// custom connection
await User.truncate(true, {
  connection: 'pg',
})
```

Opcionalmente, você também pode passar [opções do modelo](#model-adapter-options) como o 2º argumento.

### `static primaryKey`
Defina uma primária personalizada para o modelo. O padrão é a coluna `id`.

```ts
class User extends BaseModel {
  public static primaryKey = 'uuid'
}
```

### `static selfAssignPrimaryKey`
Um booleano para notificar o Lucid de que você autoatribuirá a chave primária localmente em seu aplicativo e não depende do banco de dados para gerar uma para você.

Um ótimo exemplo disso é usar o **UUID** como a chave primária e gerá-los localmente em seu código JavaScript.

```ts
class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public userId: string
}

const user = new User()
user.userId = uuid.v4()

await user.save()
```

### `static connection`
Defina uma conexão de banco de dados personalizada para o modelo.

:::note

NÃO use esta propriedade para alternar a conexão em tempo de execução. Esta propriedade serve apenas para definir um nome de conexão estático que permanece o mesmo durante todo o ciclo de vida do aplicativo.

:::

```ts
class User extends ``BaseModel {
  public static connection = 'pg'
}
```

### `static table`
Defina uma tabela de banco de dados personalizada. Por padrão, o nome da tabela é gerado usando o método [NamingStrategy.tableName](./naming-strategy.md#table-name).

```ts
class User extends BaseModel {
  public static table = 'my_users'
}
```

### `static namingStrategy`
Referência à [NamingStrategy](./naming-strategy.md). Por padrão, a [SnakeCaseNamingStrategy](https://github.com/adonisjs/lucid/blob/develop/src/Orm/NamingStrategies/SnakeCase.ts) é usada. No entanto, você pode substituí-la globalmente ou para um único modelo.

### `static $adapter`
Referência ao [Adapter](./adapter.md) subjacente. O Adapter funciona como uma ponte entre a classe do modelo e o banco de dados. Os modelos não dependem diretamente do Banco de Dados.

### `static $hooks`
Referência aos hooks registrados. Seu valor é uma referência ao pacote [@poppinss/hooks](https://github.com/poppinss/hooks). Você deve usar os métodos ou decoradores `before` e `after` para definir os ganchos do modelo.

### `static $columnsDefinitions`
A propriedade `$columnsDefinitions` é um Mapa ES6 do nome da coluna do modelo e seus metadados. Por exemplo:

```ts
Map {
  'id' => {
    columnName: 'id',
    serializeAs: 'id',
    isPrimary: true
  }
}
```

Os metadados da coluna podem ser modificados usando o decorador `@column`.

```ts
class User extends BaseModel {
  @column({ columnName: 'user_id' })
  public id: number
}
```

### `static $computedDefinitions`
A propriedade `$computedDefinitions` é um Mapa ES6 do nome da propriedade computada do modelo e seus metadados. Por exemplo:

```ts
Map {
  'postsCount' => {
    serializeAs: 'postsCount'
  }
}
```

Os metadados computados podem ser modificados usando o decorador `@computed`.

### `static $relationsDefinitions`
A propriedade `$relationsDefinitions` é um Mapa ES6 dos relacionamentos do modelo. A chave é o nome do relacionamento e o valor é a [instância do relacionamento](https://github.com/adonisjs/lucid/tree/develop/src/Orm/Relations). Por exemplo:

```ts
Map {
  'profile' => HasOne {
    relationName: 'profile',
    relatedModel: [Function (anonymous)],
    options: { relatedModel: [Function (anonymous)] },
    model: [class User extends BaseModel] {
      booted: true,
      primaryKey: 'id',
      table: 'users'
    },
    type: 'hasOne',
    booted: false,
    serializeAs: 'profile',
    onQueryHook: undefined
  }
}
```

### `static $createFromAdapterResult`
Cria uma instância do modelo consumindo os resultados do banco de dados. O método lida com o caso de uso em que o nome da coluna no banco de dados é diferente do nome da propriedade definido no modelo.

```ts
class User extends BaseModel {
  @column({ columnName: 'full_name' })
  public fullName: string
}

const user = User.$createFromAdapterResult({
  id: 1,
  full_name: 'Harminder Virk',
})
```

Opcionalmente, você também pode passar as propriedades [sideloaded](#sideloaded) e as opções do modelo.

```ts
const data = {
  id: 1,
  full_name: 'Harminder Virk',
}

const sideloaded = {
  currentUser: auth.user
}

const options = {
  // Instance will use this query client moving forward
  client: Database.connection('pg')
}

const user = User.$createFromAdapterResult(data, sideloaded, options)
```

### `static $createMultipleFromAdapterResult`
O mesmo que `$createFromAdapterResult`, mas permite criar várias instâncias do modelo.

```ts
User.$createFromAdapterResult([
  {
    id: 1,
    full_name: 'Harminder Virk',
  },
  {
    id: 2,
    full_name: 'Romain Lanz',
  }
])
```

### `static $addColumn`
Defina uma coluna de modelo. O decorador `@column` usa este método para marcar uma propriedade como uma coluna.

:::tip

Propriedades de modelo que não são marcadas como colunas nunca são inseridas no banco de dados e também são ignoradas quando retornadas por uma chamada select.

:::

```ts
User.$addColumn('id', {})
```

Opcionalmente, você também pode definir metadados de coluna.

```ts
User.$addColumn('id', {
  serializeAs: 'id',
  isPrimary: true,
  columnName: 'id',
})
```

### `static $hasColumn`
Descubra se uma coluna com o nome fornecido existe no modelo ou não.

```ts
User.$hasColumn('id')
```

### `static $getColumn`
Retorna os metadados para uma coluna fornecida.

```ts
if(User.$hasColumn('id')) {
  User.$getColumn('id')
}
```

### `static $addComputed`
Marque uma propriedade de classe como uma propriedade computada. O decorador `@computed` usa este método para marcar uma propriedade como computada.

```ts
User.$addComputed('postsCount', {
  serializeAs: 'posts_count',
})
```

### `static $hasComputed`
Descubra se uma propriedade computada com o nome fornecido existe no modelo ou não.

```ts
User.$hasComputed('postsCount')
```

### `static $getComputed`
Retorna os metadados para uma propriedade computada fornecida.

```ts
if(User.$hasComputed('id')) {
  User.$getComputed('id')
}
```

### `static $addRelation`
Adicione um novo relacionamento ao modelo. Os decoradores de relacionamento chamam este método nos bastidores para marcar uma propriedade como um relacionamento.

```ts
User.$addRelation(
  'posts',
  'hasMany',
  () => Post,
  {},
)
```

Opções adicionais podem ser passadas como o quarto argumento.

```ts
User.$addRelation(
  'posts',
  'hasMany',
  () => Post,
  {
    localKey: 'id',
    foreignKey: 'user_uuid',
  },
)
```

### `static $hasRelation`
Descubra se um relacionamento existe.

```ts
User.$hasRelation('posts')
```

### `static $getRelation`
Retorna a [instância de relacionamento](https://github.com/adonisjs/lucid/tree/develop/src/Orm/Relations) para um relacionamento pré-registrado.

```ts
if (User.$hasRelation('profile')) {
  User.$getRelation('profile')
}
```

## Propriedades/métodos da instância

### `fill`
O método `fill` permite que você defina os atributos do modelo como um objeto. Por exemplo:

```ts
const user = new User()
user.fill({
  email: 'virk@adonisjs.com',
  name: 'virk',
  password: 'secret'
})

console.log(user.email)
console.log(user.name)
console.log(user.password)
```

O método `fill` substitui os atributos existentes pelos atributos recém-definidos.

### `merge`
O método `merge` também aceita um objeto de atributos. No entanto, em vez de substituir os atributos existentes, ele executa uma mesclagem profunda.

```ts
const user = new User()
user.email = 'virk@adonisjs.com'

user.merge({
  name: 'virk',
  password: 'secret'
})

console.log(user.email) // virk@adonisjs.com
```

### `save`
Persiste a instância do modelo no banco de dados. O método `save` executa uma **atualização** quando a instância do modelo já foi persistida, caso contrário, uma consulta **inserção** é executada.

```ts
const user = new User()

user.merge({
  name: 'virk',
  email: 'virk@adonisjs.com',
  password: 'secret'
})

console.log(user.$isPersisted) // false
console.log(user.$isLocal) // true

await user.save()

console.log(user.$isPersisted) // true
console.log(user.$isLocal) // true
```

### `delete`
Exclui a linha dentro do banco de dados e congela a instância do modelo para modificações posteriores. No entanto, a instância ainda pode ser usada para ler valores.

```ts
const user = await User.find(1)
if (user) {
  await user.delete()

  console.log(user.$isDeleted) // true
}
```

### `refresh`
Atualiza a instância do modelo hidratando seus atributos com os valores dentro do banco de dados.

Você achará esse método útil quando suas colunas tiverem valores padrão definidos no nível do banco de dados e você quiser buscá-los logo após a consulta de inserção.

```ts
const user = await User.create({
  email: 'virk@adonisjs.com',
  password: 'secret'
})

await user.refresh() // "select * from users where id = user.id"
```

### `$attributes`
O objeto `$attributes` é o par chave-valor das propriedades do modelo usando o decorador `@column`.

O objeto é mantido internamente para distinguir entre as propriedades regulares do modelo e suas colunas. Considere o seguinte exemplo:

```ts
class User extends Model {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fullName: string

  @column()
  public password: string

  public get initials() {
    const [firstName, lastName] = this.fullName.split(' ')

    if (!lastName) {
      return firstName.charAt(0).toUpperCase()
    }

    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
  }
}
```

Vamos criar uma instância local do modelo.

```ts
const user = new User()
user.fullName = 'Harminder Virk'
user.password = 'secret'

console.log(user.$attributes) // { fullName, password }
```

O objeto `$attributes` não terá a propriedade `initials`, pois não está usando o decorador `@column`.

#### Como o objeto `$attributes` é preenchido?
Usamos ES6 Proxies nos bastidores para preencher o objeto `$attributes`. Aqui está a [implementação](https://github.com/adonisjs/lucid/blob/develop/src/Orm/BaseModel/proxyHandler.ts) do manipulador Proxy.

### `$original`
O objeto `$original` é um par de propriedades chave-valor obtidas do banco de dados. O objeto `$original` é usado para encontrar a diferença em relação aos `$attributes`.

```ts
const user = await User.find(1)

console.log(user.$original === user.$attributes) // true
console.log(user.$isDirty) // false

user.fullName = 'Harminder Virk'
console.log(user.$isDirty) // true
console.log(user.$dirty) // diff between $original and $attributes

await user.save() // persist and update $original

console.log(user.$isDirty) // false
```

### `$preloaded`
Um objeto de relacionamentos pré-carregados.

```ts
const user = await User.query().preload('profile').first()

console.log(user.$preloaded) // { profile: Profile }
```

### `$extras`
Os `$extras` são os valores que são computados em tempo real para uma determinada instância(s) de modelo. Por exemplo: você busca todas as postagens e uma contagem de comentários recebidos em cada postagem. O valor `postsCount` foi movido para o objeto `$extras`, pois não é uma coluna de banco de dados.

```ts
const posts = await Post.query().withCount('comments')

posts.forEach((post) => {
  console.log(posts.$extras)
})
```

### `$primaryKeyValue`
Valor para a coluna marcada como chave primária. Por exemplo:

```ts
class User extends BaseModel {
  @column({ isPrimary: true })
  public userId: number
}

const user = new User()
user.userId = 1

user.$primaryKeyValue // 1
```

O `user.$primaryKeyValue` retornará o valor da propriedade `userId`, pois está marcada como chave primária.

### `$getQueryFor`
O BaseModel faz uso do [model query builder](./query-builder.md) e do [insert query builder](../database/insert-query-builder.md) para executar consultas **insert**, **update**, **delete** e **refresh**.

Ele faz uso do método `$getQueryFor` para retornar o construtor de consulta apropriado para uma determinada ação. Você pode substituir esse método se quiser construir o construtor de consulta para as ações mencionadas acima.

```ts
import { QueryClientContract } from '@ioc:Adonis/Lucid/Database'
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  public $getQueryFor(
    action: 'insert' | 'update' | 'delete' | 'refresh',
    client: QueryClientContract,
  ) {
    if (action === 'insert') {
      return client.insertQuery().table(User.table)
    }

    return client.modelQuery(User).where('id', this.$primaryKeyValue)
  }
}
```

### `$sideloaded`
As propriedades `$sideloaded` são passadas pelo construtor de consultas para as instâncias do modelo. Um ótimo exemplo de propriedades `$sideloaded` é passar o usuário atualmente conectado para a instância do modelo.

```ts
class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public title: number

  public get ownedByCurrentUser() {
    if (!this.$sideloaded) {
      return false
    }
    return this.$sideloaded.userId === this.userId
  }
}
```

No exemplo acima, o `ownedByCurrentUser` depende da propriedade `$sideloaded.userId` para saber se a postagem é de propriedade do usuário atual ou não.

Agora, você pode passar o `userId` para as instâncias do modelo usando o método `sideload`.

```ts
const posts = await Post
  .query()
  .sideload({ userId: auth.user.id })

posts.forEach((post) => {
  console.log(post.ownedByCurrentUser)
})
```

### `$isPersisted`
Descubra se a instância do modelo foi persistida no banco de dados ou não.

```ts
const user = new User()
console.log(user.$isPersisted) // false

await user.save()
console.log(user.$isPersisted) // true
```

### `$isNew`
Oposto da propriedade `$isPersisted`.

### `$isLocal`
Descubra se a instância do modelo é criada localmente ou buscada do banco de dados.

```ts
const user = new User()
console.log(user.$isLocal) // true

await user.save()
console.log(user.$isLocal) // STILL true
```

No exemplo a seguir, a instância do modelo é criada buscando os valores de linha da tabela do banco de dados.

```ts
const user = await User.find(1)
console.log(user.$isLocal) // false
```

### `$dirty`
Um objeto que contém a diferença entre o objeto `$original` e o objeto `$attributes`.

```ts
const user = await User.find(1)
user.points = 10

console.log(user.$dirty) // { points: 10 }
```

### `$isDirty`
Um booleano para saber se o modelo está sujo.

```ts
const user = await User.find(1)
user.points = 10

console.log(user.$isDirty) // true
```

### `$isDeleted`
Descubra se a instância do modelo foi excluída ou não. É definido como verdadeiro após o método `delete` ser invocado.

```ts
const user = await User.find(1)
console.log(user.$isDeleted) // false

await user.delete()
console.log(user.$isDeleted) // true
```

### `$trx`
Referência ao [cliente de transação](../database/transaction-client.md) usado pela instância do modelo. Você também pode definir o `$trx` manualmente para executar operações do modelo dentro do bloco de transação.

```ts
const trx = await Database.transaction()

const user = new User()
user.$trx = trx

await user.save()
await trx.commit()

console.log(user.$trx) // undefined
```

Após a transação ser confirmada ou revertida, a instância do modelo liberará a referência `$trx`, para que a instância do cliente de transação seja coletada como lixo.

A propriedade `$trx` na instância do modelo é definida automaticamente quando as instâncias do modelo são criadas como resultado da execução de uma consulta e a consulta estava usando a transação.

```ts
const trx = await Database.transaction()

// select query is using trx
const users = await User.query().useTransaction(trx)

users.forEach((user) => {
  // all of the model instances uses the same trx instance
  console.log(user.$trx === trx) // true
})
```

### `$options`
O `$options` é um objeto com uma `connection` opcional e a propriedade `profiler`.

Você pode usar `$options` para definir uma conexão personalizada por instância de modelo. Um caso de uso prático é usar uma conexão de locatário dinâmica por solicitação HTTP.

```ts
const users = await User
  .query({ connection: tenant.connection })
  .select('*')

users.forEach((user) => {
  console.log(user.$options.connection === tenant.connection) // true
})
```

### `useTransaction`
O `useTransaction` é uma alternativa para definir manualmente a propriedade `$trx`.

```ts
const trx = await Database.transaction()
const user = new User()

await user
  .useTransaction(trx)
  .save()
```

### `useConnection`
O `useConnection` é uma alternativa para definir `$options` com a propriedade `connection`.

```ts
const user = new User()

await user
  .useConnection(tenant.connection)
  .save()
```

### `load`
Carregue um relacionamento de uma instância de modelo.

```ts
const user = await User.findOrFail(1)
await user.load('posts')

console.log(user.posts)
```

Você também pode passar um retorno de chamada como o segundo argumento para adicionar mais restrições à consulta de relacionamento.

```ts
await user.load('posts', (postsQuery) => {
  postsQuery.where('status', 'published')
})
```

Você também pode carregar vários relacionamentos da seguinte forma:

```ts
await user.load((loader) => {
  loader.load('profile').load('posts')
})
```

Os relacionamentos aninhados podem ser carregados da seguinte forma:

```ts
await user.load((loader) => {
  loader.load('profile', (profile) => {
    profile.preload('socialAccounts')
  }).load('posts')
})
```

### `related`
Retorna a instância do cliente de relacionamento para um determinado relacionamento. Você pode usar o método `related` para executar consultas em referência ao relacionamento definido.

```ts
const user = await User.find(1)

const posts = await user.related('posts').query()
// select * from "posts" where "user_id" = user.id
```

Da mesma forma, o método related também pode ser usado para persistir linhas relacionadas.

```ts
const user = await User.find(1)

await user.related('posts').create({
  title: 'Adonis 101',
})

/**
INSERT INTO "posts"
  ("user_id", "title")
VALUES
  (user.id, 'Adonis 101')
*/
```

### `toObject`
Retorna um objeto com o modelo `$attributes`, relacionamentos pré-carregados e suas propriedades computadas.

```ts
console.log(user.toObject())
```

### `serialize`
Serializa o modelo para sua representação JSON. A serialização de modelos é útil para construir servidores de API.

Certifique-se de ler o guia detalhado sobre [serialização de modelos](../../guides/models/serialization.md).

```ts
console.log(user.serialize())
```

O método `serialize` também aceita um objeto para selecionar campos.

```ts
user.serialize({
  fields: {
    omit: ['password'],
  },
  relations: {
    profile: {
      fields: {
        pick: ['fullName', 'id'],
      },
    }
  }
})
```

O argumento de seleção seletiva pode ser uma árvore profundamente aninhada visando também a serialização de relacionamentos.

### `toJSON`
Alias ​​para o método `serialize`, mas não aceita argumentos. O `toJSON` é chamado automaticamente sempre que você passa instância(s) de modelo para o método `JSON.stringify`.

### `serializeAttributes`
Serializa apenas os atributos do modelo.

```ts
user.serializeAttributes({
  omit: ['password']
})
```

### `serializeComputed`
Serializa apenas as propriedades computadas.

```ts
user.serializeComputed()
```

### `serializeRelations`
Serializa apenas os relacionamentos pré-carregados

```ts
user.serializeRelations()

// Cherry pick fields
user.serializeRelations({
  profile: {
    fields: {}
  },
  posts: {
    fields: {}
  }
})
```
