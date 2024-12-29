# Introdução

*Lucid* é a implementação AdonisJS do [padrão de registro ativo](https://en.wikipedia.org/wiki/Active_record_pattern).

Se você conhece o *Laravel* ou o *Ruby on Rails*, encontrará muitas semelhanças entre o Lucid e o [Eloquent](https://laravel.com/docs/eloquent) do Laravel ou o [Active Record](https://guides.rubyonrails.org/active_record_basics.html) do Rails.

## Introdução
Os modelos de registro ativo geralmente são preferidos em vez de consultas simples de banco de dados por sua facilidade de uso e APIs poderosas para direcionar o fluxo de dados do aplicativo.

Os *modelos Lucid* fornecem muitos benefícios, incluindo:

1. Busca e persistência de dados do modelo de forma transparente.
2. Uma API expressiva para gerenciar relacionamentos:
    ```js
    // .app/Models/User.js

    class User extends Model {

      profile () {
        return this.hasOne('App/Models/Profile')
      }

      posts () {
        return this.hasMany('App/Models/Post')
      }

    }
    ```
3. Ciclo de vida [hooks](/docs/08-Lucid-ORM/02-Hooks.md) para manter seu código [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).
4. [Getters/setters](/docs/08-Lucid-ORM/04-Mutators.md) para mutar dados em tempo real.
5. [Serialização](/docs/08-Lucid-ORM/06-Serialization.md) de dados usando serializadores, propriedades computadas, etc.
6. Gerenciamento de [formato de data](#dates).
7. ...e muito mais.

::: info NOTA
Os modelos Lucid não estão vinculados ao esquema do seu banco de dados, em vez disso, eles gerenciam tudo por conta própria. Por exemplo, não há necessidade de definir associações em SQL ao usar relacionamentos Lucid.
:::

*Modelos Lucid* são armazenados no diretório `app/Models`, onde cada modelo representa uma tabela de banco de dados.

Exemplos de mapeamentos de modelo/tabela incluem:

| Modelo  | Tabela de banco de dados  |
|---------|---------------------------|
| User    | `users`                   |
| Post    | `posts`                   |
| Comment | `comments`                |

## Exemplo Básico
Vamos ver como criar um modelo e usá-lo para ler e escrever no banco de dados.

### Criando um Modelo
Primeiro, use o comando `make:model` para gerar uma classe de modelo `User`:

```bash
adonis make:model User
```

```bash
# .Output

✔ create  app/Models/User.js
```

```js
// .app/Models/User.js

'use strict'

const Model = use('Model')

class User extends Model {
}

module.exports = User
```

::: tip DICA
Passe o sinalizador `--migration` para também gerar um arquivo de migração.
:::

```bash
adonis make:model User --migration
```

```bash
# .Output

✔ create  app/Models/User.js
✔ create  database/migrations/1502691651527_users_schema.js
```

### Criando um usuário
Em seguida, instancie uma instância `User` e salve-a no banco de dados:

```js
const User = use('App/Models/User')

const user = new User()

user.username = 'virk'
user.password = 'some-password'

await user.save()
```

### Buscando usuários
Finalmente, dentro do arquivo `start/routes.js`, busque todas as instâncias `User`:

```js
// .start/routes.js

const Route = use('Route')
const User = use('App/Models/User')

Route.get('users', async () => {
  return await User.all()
})
```

## Convenção sobre configuração
*Modelos Lucid* agem com base nas convenções do AdonisJs, mas você tem a liberdade de substituir os padrões por meio das configurações do seu aplicativo.

#### `table`
Por padrão, o nome da tabela do banco de dados do modelo é a forma *minúscula* e *plural* do nome do modelo (por exemplo, `User` → `users`).

Para substituir esse comportamento, defina um getter `table` no seu modelo:

```js
class User extends Model {
  static get table () {
    return 'my_users'
  }
}
```

#### `connection`
Por padrão, os modelos usam a conexão padrão definida dentro do arquivo `config/database.js`.

Para substituir esse comportamento, defina um getter `connection` no seu modelo:

```js
class User extends Model {
  static get connection () {
    return 'mysql'
  }
}
```

#### `primaryKey`
Por padrão, a chave primária de um modelo é definida para a coluna `id`.

Para substituir esse comportamento, defina um getter `primaryKey` no seu modelo:

```js
class User extends Model {
  static get primaryKey () {
    return 'uid'
  }
}
```

::: warning OBSERVAÇÃO
O valor do campo `primaryKey` deve ser sempre exclusivo.
:::

#### `createdAtColumn`
O nome do campo usado para definir o carimbo de data/hora *creation* (retornar `null` para desabilitar):

```js
class User extends Model {
  static get createdAtColumn () {
    return 'created_at'
  }
}
```

#### `updatedAtColumn`
O nome do campo usado para definir o carimbo de data/hora *modified* (retornar `null` para desabilitar):

```js
class User extends Model {
  static get updatedAtColumn () {
    return 'updated_at'
  }
}
```

#### `incrementing`
O Lucid assume que cada tabela de banco de dados modelo tem uma chave primária de incremento automático.

Para substituir esse comportamento, defina um getter `incrementing` retornando `false`:

```js
class User extends Model {
  static get incrementing () {
    return false
  }
}
```

::: warning OBSERVAÇÃO
Quando `incrementing` estiver definido como `false`, certifique-se de definir o modelo `primaryKeyValue` manualmente.
:::

#### `primaryKeyValue`
O ​​valor da chave primária (atualizar somente quando `incrementing` estiver definido como `false`):

```js
const user = await User.find(1)
console.log(user.primaryKeyValue)

// when incrementing is false
user.primaryKeyValue = uuid.v4()
```

## Ocultando campos
Muitas vezes, você precisará omitir campos dos resultados do banco de dados (por exemplo, ocultando senhas de usuários da saída JSON).

O AdonisJs simplifica isso permitindo que você defina atributos `hidden` ou `visible` em suas classes de modelo.

#### `hidden`

```js
class User extends Model {
  static get hidden () {
    return ['password']
  }
}
```

#### `visible`
```js
class Post extends Model {
  static get visible () {
    return ['title', 'body']
  }
}
```

#### `setVisible/setHidden`
Você pode definir campos `hidden` ou `visible` para uma única consulta como:

```js
User.query().setHidden(['password']).fetch()

// or set visible
User.query().setVisible(['title', 'body']).fetch()
```

## Datas
O gerenciamento de datas pode adicionar complexidade a aplicativos orientados a dados.

Seu aplicativo pode precisar armazenar e exibir datas em formatos diferentes, o que geralmente requer um grau de trabalho manual.

*Lucid* lida com datas graciosamente, minimizando o trabalho necessário para usá-las.

### Definindo campos de data
Por padrão, os timestamps `created_at` e `updated_at` são marcados como datas.

Defina seus próprios campos concatenando-os em um getter `dates` em seu modelo:

```js
class User extends Model {
  static get dates () {
    return super.dates.concat(['dob'])
  }
}
```

No exemplo acima, extraímos os campos de data padrão da classe pai `Model` e enviamos um novo campo `dob` para o array `super.dates`, retornando todos os três campos de data: `created_at`, `updated_at` e `dob`.

### Formatando campos de data
Por padrão, o Lucid formata datas para armazenamento como `AAAA-MM-DD HH:mm:ss`.

Para personalizar formatos de data para armazenamento, substitua o método `formatDates`:

```js
class User extends Model {
  static formatDates (field, value) {
    if (field === 'dob') {
      return value.format('YYYY-MM-DD')
    }
    return super.formatDates(field, value)
  }
}
```

No exemplo acima, o parâmetro `value` é a data real fornecida ao definir o campo.

::: warning OBSERVAÇÃO
O método `formatDates` é chamado antes que a instância do modelo seja salva no banco de dados, portanto, certifique-se de que o valor de retorno seja sempre um formato válido para o mecanismo de banco de dados que você está usando.
:::

### Datas de conversão
Agora que salvamos as datas no banco de dados, podemos formatá-las de forma diferente ao exibi-las ao usuário.

Para formatar como as datas são exibidas, use o método `castDates`:

```js
class User extends Model {
  static castDates (field, value) {
    if (field === 'dob') {
      return `${value.fromNow(true)} old`
    }
    return super.formatDates(field, value)
  }
}
```

O parâmetro `value` é uma instância [Moment.js](https://momentjs.com/), permitindo que você chame qualquer método Moment para formatar suas datas.

### Desserialização

O método `castDates` é chamado automaticamente quando uma instância de modelo é [desserializada](/docs/08-Lucid-ORM/06-Serialization.md) (acionado pela chamada `toJSON`):

```js
const users = await User.all()

// converting to JSON array
const usersJSON = users.toJSON()
```

## Query Builder
Os modelos Lucid usam o AdonisJs [Query Builder](/docs/07-Database/02-Query-Builder.md) para executar consultas de banco de dados.

Para obter uma instância do Query Builder, chame o método `query` do modelo:

```js
const User = use('App/Models/User')

const adults = await User
  .query()
  .where('age', '>', 18)
  .fetch()
```

1. Todos os métodos do Query Builder são totalmente suportados.
2. O método `fetch` é necessário para executar a consulta, garantindo que os resultados retornem dentro de uma instância `serializer` (consulte a documentação [Serializers](/docs/08-Lucid-ORM/06-Serialization.md) para obter mais informações).

## Métodos estáticos
Os modelos Lucid têm vários métodos estáticos para executar operações comuns sem usar a interface do Query Builder.

Não há necessidade de chamar `fetch` ao usar os seguintes métodos estáticos.

#### `find`
Encontre um registro usando a chave primária (sempre retorna um registro):

```js
const User = use('App/Models/User')
await User.find(1)
```

#### `findOrFail`
Semelhante a `find`, mas em vez disso lança uma `ModelNotFoundException` quando não consegue encontrar um registro:

```js
const User = use('App/Models/User')
await User.findOrFail(1)
```

#### `findBy / findByOrFail`
Encontre um registro usando um par chave/valor (retorna o primeiro registro correspondente):

```js
const User = use('App/Models/User')
await User.findBy('email', 'foo@bar.com')

// or
await User.findByOrFail('email', 'foo@bar.com')
```

#### `first / firstOrFail`
Encontre a primeira linha do banco de dados:

```js
const User = use('App/Models/User')
await User.first()

// or
await User.firstOrFail()
```

#### `last`
Encontre a última linha do banco de dados:

```js
const User = use('App/Models/User')
await User.last()
```

#### `findOrCreate(whereAttributes, values)`
Encontre um registro, se não for encontrado, um novo registro será criado e retornado:

```js
const User = use('App/Models/User')
const user = await User.findOrCreate(
  { username: 'virk' },
  { username: 'virk', email: 'virk@adonisjs.com' }
)
```

#### `pick(rows = 1)`
Selecione `x` número de linhas da tabela do banco de dados (o padrão é `1` linha):

```js
const User = use('App/Models/User')
await User.pick(3)
```

#### `pickInverse(rows = 1)`
Selecione `x` número de linhas da tabela do banco de dados a partir do último (o padrão é `1` linha):

```js
const User = use('App/Models/User')
await User.pickInverse(3)
```

#### `ids`
Retorne uma matriz de chaves primárias:

```js
const User = use('App/Models/User')
const userIds = await User.ids()
```

::: info NOTA
Se a chave primária for `uid`, uma matriz de valores `uid` será retornada.
:::

#### `pair(lhs, rhs)`
Retorna um objeto de pares chave/valor (`lhs` é a chave, `rhs` é o valor):

```js
const User = use('App/Models/User')
const users = await User.pair('id', 'country')

// returns { 1: 'ind', 2: 'uk' }
```

#### `all`
Selecionar todas as linhas:

```js
const User = use('App/Models/User')
const users = await User.all()
```

#### `truncate`
Excluir todas as linhas (truncar tabela):

```js
const User = use('App/Models/User')
const users = await User.truncate()
```

## Métodos de instância
As instâncias do Lucid têm vários métodos para executar operações comuns sem usar a interface do Query Builder.

#### `reload`
Recarregar um modelo do banco de dados:

```js
const User = use('App/Models/User')
const user = await User.create(props)
// user.serviceToken === undefined

await user.reload()
// user.serviceToken === 'E1Fbl3sjH'
```

::: warning OBSERVAÇÃO
Um modelo com propriedades definidas durante um gancho de criação exigirá *recarregamento* para recuperar os valores definidos durante esse gancho.
:::

## Auxiliares de Agregação
Query Builder [auxiliares de agregação](/docs/07-Database/02-Query-Builder.md#aggregate-helpers) fornece atalhos para consultas de agregação comuns.

Os seguintes métodos de modelo estático podem ser usados ​​para agregar uma tabela inteira.

::: warning OBSERVAÇÃO
Esses métodos encerram a cadeia do Query Builder e retornam um valor, portanto, não há necessidade de chamar `[fetch()](/docs/07-Database/02-Query-Builder.md#aggregate-helpers)` ao usá-los.
:::

#### `getCount(columnName = '*')`
Retorna uma contagem de registros em um determinado conjunto de resultados:

```js
const User = use('App/Models/User')

// returns number
await User.getCount()
```

Você pode adicionar restrições de consulta antes de chamar `getCount`:

```js
await User
  .query()
  .where('is_active', 1)
  .getCount()
```

Assim como `getCount`, todos os outros métodos de agregação estão disponíveis no [Query Builder](/docs/07-Database/02-Query-Builder.md).

## Escopos de consulta
Os escopos de consulta extraem restrições de consulta em métodos poderosos e reutilizáveis.

Por exemplo, buscando todos os usuários que têm um perfil:

```js
const Model = use('Model')

class User extends Model {
  static scopeHasProfile (query) {
    return query.has('profile')
  }

  profile () {
    return this.hasOne('App/Models/Profile')
  }
}
```

Ao definir `scopeHasProfile`, você pode restringir sua consulta assim:

```js
const users = await User.query().hasProfile().fetch()
```

1. Os escopos são definidos com o prefixo `scope` seguido pelo nome do método.
2. Ao chamar escopos, descarte a palavra-chave `scope` e chame o método no formato *camelCase* (por exemplo, `scopeHasProfile` → `hasProfile`).
3. Você pode chamar todos os métodos padrão do construtor de consultas dentro de um escopo de consulta.

## Paginação
O Lucid também suporta o método `paginate` do Construtor de Consultas:

```js
const User = use('App/Models/User')
const page = 1

const users = await User.query().paginate(page)

return view.render('users', { users: users.toJSON() })
```

No exemplo acima, o valor de retorno de `paginate` não é uma matriz de usuários, mas sim um objeto com metadados e uma propriedade `data` contendo a lista de usuários:

```js
{
  total: '',
  perPage: '',
  lastPage: '',
  page: '',
  data: [{...}]
}
```

## Inserções e atualizações

#### `save`
Com modelos, em vez de inserir valores brutos no banco de dados, você persiste a instância do modelo que, por sua vez, faz a consulta de inserção para você. Por exemplo:

```js
const User = use('App/Models/User')

const user = new User()
user.username = 'virk'
user.email = 'foo@bar.com'

await user.save()
```

O método `save` persiste a instância no banco de dados, determinando de forma inteligente se deve criar uma nova linha ou atualizar a linha existente. Por exemplo:

```js
const User = use('App/Models/User')

const user = new User()
user.username = 'virk'
user.email = 'foo@bar.com'

// Insert
await user.save()

user.age = 22

// Update
await user.save()
```

Uma consulta *update* só ocorre se algo foi alterado.

Chamar `save` várias vezes sem atualizar nenhum atributo do modelo não executará nenhuma consulta subsequente.

#### `fill / merge`

Em vez de definir atributos manualmente, `fill` ou `merge` podem ser usados.

O método `fill` substitui os valores de chave/par de instância de modelo existentes:

```js
const User = use('App/Models/User')

const user = new User()
user.username = 'virk'
user.age = 22

user.fill({ age: 23 }) // remove existing values, only set age.

await user.save()

// returns { age: 23, username: null }
```

O método `merge` modifica apenas os atributos especificados:

```js
const User = use('App/Models/User')

const user = new User()
user.fill({ username: 'virk', age: 22 })

user.merge({ age: 23 })

await user.save()

// returns { age: 23, username: 'virk' }
```

#### `create`
Você pode passar dados diretamente para o modelo na criação, em vez de definir atributos manualmente após a instanciação:

```js
const User = use('App/Models/User')
const userData = request.only(['username', 'email', 'age'])

// save and get instance back
const user = await User.create(userData)
```

#### `createMany`
Assim como `create`, você pode passar dados diretamente para várias instâncias na criação:

```js
const User = use('App/Models/User')
const usersData = request.collect(['username' 'email', 'age'])

const users = await User.createMany(usersData)
```

::: warning OBSERVAÇÃO
O método `createMany` faz *n* número de consultas em vez de fazer uma inserção em massa, onde *n* é o número de linhas.
:::

### Atualizações em massa
Atualizações em massa são realizadas com a ajuda do Query Builder (o Lucid garante que as datas sejam formatadas adequadamente ao atualizar):

```js
const User = use('App/Models/User')

await User
  .query()
  .where('username', 'virk')
  .update({ role: 'admin' })
```

::: warning OBSERVAÇÃO
Atualizações em massa não executam ganchos de modelo.
:::

## Exclusões
Uma única instância de modelo pode ser excluída chamando o método `delete`:

```js
const User = use('App/Models/User')

const { id } = params
const user = await User.find(id)

await user.delete()
```

Após chamar `delete`, a instância de modelo é proibida de executar qualquer atualização, mas você ainda pode acessar seus dados:

```js
await user.delete()

console.log(user.id) // works fine

user.id = 1 // throws exception
```

### Exclusões em massa
Exclusões em massa são realizadas com a ajuda do Query Builder:

```js
const User = use('App/Models/User')

await User
  .query()
  .where('role', 'guest')
  .delete()
```

::: warning OBSERVAÇÃO
Exclusões em massa não executam ganchos de modelo.
:::

## Transações
A maioria dos métodos Lucid oferece suporte a transações.

O primeiro passo é obter o objeto `trx` usando o [Database Provider](/docs/07-Database/01-Getting-Started.md):

```js
const Database = use('Database')
const trx = await Database.beginTransaction()

const user = new User()

// pass the trx object and lucid will use it
await user.save(trx)

// once done commit the transaction
trx.commit()
```

Assim como chamar `save`, você pode passar o objeto `trx` para o método `create` também:

```js
const Database = use('Database')
const trx = await Database.beginTransaction()

await User.create({ username: 'virk' }, trx)

// once done commit the transaction
await trx.commit()
// or rollback the transaction
await trx.rollback()
```

Você também pode passar o objeto `trx` para o método `createMany`:

```js
const user = await User.find(1, trx)
```

```js
const user = await User.query(trx).where('username','virk').first()
```

```js
await User.createMany([
  { username: 'virk' }
], trx)
```

Você também pode passar o objeto `trx` para o método `delete`:

```js
const user = await User.find(1, trx)

await user.delete(trx)
```

### Transações em relacionamentos
Ao usar transações, você precisará passar um Objeto `trx` como o terceiro parâmetro dos métodos de relacionamento `attach` e `detach`:

```js
const Database = use('Database')
const trx = await Database.beginTransaction()

const user = await User.create({email: 'user@example.com', password: 'secret'})

const userRole = await Role.find(1)

await user.roles().attach([userRole.id], null, trx)
await userRole.load('user', null, trx)

await trx.commit()
// if something gone wrong
await trx.rollback()
```

## Ciclo de inicialização
Cada modelo tem um ciclo de inicialização onde seu método `boot` é chamado *uma vez*.

Se você quiser executar algo que deve ocorrer apenas uma vez, considere escrevê-lo dentro do método `boot` do modelo:

```js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
      I will be called only once
    */
  }
}

module.exports = User
```
