# Has one

A [classe de relacionamento HasOne](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasOne/index.ts) gerencia o relacionamento has one entre dois modelos.

Você não trabalhará diretamente com esta classe. No entanto, uma instância da classe pode ser acessada usando o método `Model.$getRelation`.

```ts
import { BaseModel, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Profile from 'App/Models/Profile'

class User extends BaseModel {
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>
}
```

```ts
User.$getRelation('profile').relationName
User.$getRelation('profile').type
User.$getRelation('profile').relatedModel()
```

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis no relacionamento `HasOne`.

### `type`
O tipo do relacionamento. O valor é sempre definido como `hasOne`.

```ts
class User extends BaseModel {
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>
}

User.$getRelation('profile').type // 'hasOne'
```

### `relationName`
O nome do relacionamento. É um nome de propriedade definido no modelo pai.

```ts
class User extends BaseModel {
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>
}

User.$getRelation('profile').relationName // 'profile'
```

### `serializeAs`
O nome a ser usado para serializar o relacionamento. Você pode defini-lo usando as opções do decorador.

```ts
class User extends BaseModel {
  @hasOne(() => Profile, {
    serializeAs: 'userProfile'
  })
  public profile: HasOne<typeof Profile>
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
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>
}

User.$getRelation('profile').model // User
```

### `relatedModel`
Referência ao modelo de relacionamento. O valor da propriedade é uma função que retorna o modelo relacionado.

```ts
class User extends BaseModel {
  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>
}

User.$getRelation('profile').relatedModel() // Profile
```

### `localKey`
A `localKey` para o relacionamento. Você deve ler o documento [NamingStrategy](../naming-strategy.md#relationlocalkey) para saber mais sobre como o nome da chave é computado.

Você também pode definir a `localKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class User extends BaseModel {
  @column()
  public id: number

  @hasOne(() => Profile, {
    localKey: 'id', // coluna id no modelo "Usuário"
  })
  public profile: HasOne<typeof Profile>
}
```

### `foreignKey`
A `foreignKey` para o relacionamento. Você deve ler o documento [NamingStrategy](../naming-strategy.md#relationlocalkey) para saber mais sobre como o nome da chave é computado.

Você também pode definir a `foreignKey` explicitamente. Certifique-se de mencionar o nome da propriedade do modelo e NÃO o nome da coluna do banco de dados.

```ts
class User extends BaseModel {
  @hasOne(() => Profile, {
    foreignKey: 'userId', // coluna userId no modelo "Perfil"
  })
  public profile: HasOne<typeof Profile>
}
```

### `onQuery`
O método `onQuery` é um gancho opcional para modificar as consultas de relacionamento. Você pode defini-lo no momento da declaração da relação.

```ts
class User extends BaseModel {
  @column()
  public id: number

  @hasOne(() => Profile, {
    onQuery(query) {
      query.where('visibility', 'public')
    }
  })
  public profile: HasOne<typeof Profile>
}
```

Se você quiser pré-carregar um relacionamento aninhado usando o hook `onQuery`, certifique-se de colocá-lo dentro do condicional `!query.isRelatedSubQuery` porque as subconsultas **NÃO são executadas diretamente**, elas são usadas dentro de outras consultas.

```ts {7-9}
class User extends BaseModel {
  @column()
  public id: number

  @hasOne(() => Profile, {
    onQuery(query) {
      if (!query.isRelatedSubQuery) {
        query.preload('socialAccounts')
      }
    }
  })
  public profile: HasOne<typeof Profile>
}
```

### `setRelated`
Defina um relacionamento na instância do modelo pai. Os métodos aceitam o modelo pai como o primeiro argumento e a instância do modelo relacionada como o segundo argumento.

Você deve garantir que ambas as instâncias do modelo estejam relacionadas entre si antes de chamar este método.

```ts
const user = new User()
const profile = new Profile()

User.$getRelation('profile').setRelated(user, profile)
```

### `pushRelated`
O método `pushRelated` envia o relacionamento para a matriz de valores de relacionamento existente. No entanto, para `hasOne`, o método funciona de forma semelhante a `setRelated`.

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

const profiles = [
  Profile {
    user_id: 1,
  },
  Profile {
    user_id: 2,
  },
  Profile {
    user_id: 3,
  }
]

User.$getRelation('profile').setRelatedForMany(users, profiles)
```

### `client`
Retorna a referência para [HasOneQueryClient](#query-client). O cliente de consulta expõe a API para persistir/buscar linhas relacionadas do banco de dados.

### `hydrateForPersistance`
Hidrata os valores para persistência definindo o valor foreignKey. O método aceita o modelo pai como o primeiro argumento e um objeto ou a instância do modelo relacionado como o segundo argumento.

```ts
const user = new User()
user.id = 1

const profile = new Profile()
User.$getRelation('profile').hydrateForPersistance(user, profile)

console.log(profile.userId === user.id) // true
```

### `eagerQuery`
Retorna uma instância do [HasOneQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasOne/QueryBuilder.ts). O construtor de consultas tem a mesma API que o [Construtor de consultas do modelo](../query-builder.md)

### `subQuery`
Retorna uma instância do [HasOneSubQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasOne/SubQueryBuilder.ts). As subconsultas não devem ser executadas e são usadas principalmente pelos métodos [withCount](../query-builder.md#withcount) e [whereHas](../query-builder.md#wherehas).

## Cliente de consulta
O cliente de consulta expõe a API para persistir/buscar linhas relacionadas do banco de dados. Você pode acessar o cliente de consulta para um relacionamento usando o método `related`.

```ts
const user = await User.find(1)

user.related('profile') // HasOneClientContract
```

### `create`
Crie uma nova instância de modelo de relacionamento e persista no banco de dados imediatamente.

```ts
const profile = await user
  .related('profile')
  .create({
    email: 'virk@adonisjs.com',
    avatarUrl: 'profile.jpg',
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
await user.related('profile').create()

await trx.commit()
```

### `save`
O método save persiste uma instância existente do relacionamento.

Assim como o método `create`, o método `save` também usa o nome do cliente de transação/conexão do modelo pai.

```ts
const profile = new Profile()
profile.email = 'virk@adonisjs.com'
profile.avatarUrl = 'foo.jpg'

const profile = await user
  .related('profile')
  .save(profile)
```

### `firstOrCreate`
O método `firstOrCreate` funciona de forma semelhante ao método [static firstOrCreate](../base-model.md#static-firstorcreate) no modelo. No entanto, nós **implicitamente adicionamos a foreignKey e seu valor** à carga útil da pesquisa.

::: tip DICA
Você também pode usar este método para garantir que o usuário sempre tenha um único perfil.
:::

```ts
await user
  .related('profile')
  .firstOrCreate({}, {
    email: 'virk@adonisjs.com',
    avatarUrl: 'profile.jpg',
  })
```

### `updateOrCreate`
O método `updateOrCreate` funciona de forma semelhante ao método [static updateOrCreate](../base-model.md#static-updateorcreate) no modelo. No entanto, nós **implicitamente adicionamos a foreignKey e seu valor** à carga útil da pesquisa.

```ts
await user
  .related('profile')
  .updateOrCreate({}, {
    email: 'virk@adonisjs.com',
    avatarUrl: 'profile.jpg',
  })
```

### `query`
Retorna uma instância do [HasOneQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/Orm/Relations/HasOne/QueryBuilder.ts). O construtor de consultas tem a mesma API que o [Construtor de consultas do modelo](../query-builder.md).
