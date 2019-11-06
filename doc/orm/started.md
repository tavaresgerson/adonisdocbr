# Começando

Lucid é a implementação AdonisJS do padrão [Active Record](https://en.wikipedia.org/wiki/Active_record_pattern).

Se você estiver familiarizado com o Laravel ou o Ruby on Rails, encontrará muitas semelhanças entre o Lucid e o [Eloquent](https://laravel.com/docs/eloquent) do Laravel 
ou o [Active Record do Rails](https://guides.rubyonrails.org/active_record_basics.html).

## Introdução
Os modelos de registro ativo geralmente são preferidos às consultas simples ao banco de dados por sua facilidade de uso e APIs 
poderosas para direcionar o fluxo de dados do aplicativo.

Os modelos Lucid oferecem muitos benefícios, incluindo:

* Buscar e persistir dados do modelo de forma transparente.
* Uma API expressiva para gerenciar relacionamentos, por exemplo em `app/Models/User.js`:

``` js
class User extends Model {

  profile () {
    return this.hasOne('App/Models/Profile')
  }

  posts () {
    return this.hasMany('App/Models/Post')
  }

}
```

* [Hooks](https://adonisjs.com/docs/4.1/database-hooks) de ciclo de vida para manter seu código [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).
* [Getters/setters](https://adonisjs.com/docs/4.1/database-getters-setters) para alterar dados em tempo real.
* [Serialização de dados](https://adonisjs.com/docs/4.1/serializers) usando serializadores, propriedades computadas, etc.
* Gerenciamento de [formato de data](https://adonisjs.com/docs/4.1/lucid#_dates).
* ...e muito mais.

> Os modelos Lucid não estão vinculados ao esquema do banco de dados; eles gerenciam tudo por conta própria. Por exemplo, não há 
> necessidade de definir associações no SQL ao usar os relacionamentos Lucid.

Os modelos Lucid são armazenados no diretório `app/Models` em que cada modelo representa uma tabela de banco de dados.

Exemplos de mapeamentos de modelo/tabela incluem:

| Modelo              | Tabela de banco de dados      |
|---------------------|-------------------------------|
| Do utilizador       | `users`                       |
| Postar              | `posts`                       |
| Comente             | `comments`                    |

## Exemplo básico
Vamos ver como criar um modelo e usá-lo para ler e gravar no banco de dados.

### Fazendo um modelo
Primeiro, use o comando `make:model` para gerar uma classe `User` de modelo:

```
adonis make:model User
```

Resultado
```
✔ create  app/Models/User.js
```

``` js
'use strict'

const Model = use('Model')

class User extends Model {
}

module.exports = User
```

Passe o sinalizador `--migrations` para também gerar um arquivo de migração.
```
adonis make:model User --migration
```

Resultado
```
✔ create  app/Models/User.js
✔ create  database/migrations/1502691651527_users_schema.js
```

### Criando um usuário
Em seguida, instancie uma instância `User` e salve-a no banco de dados:

``` js
const User = use('App/Models/User')

const user = new User()

user.username = 'virk'
user.password = 'some-password'

await user.save()
```

### Buscando usuários
Por fim, dentro do arquivo `start/routes.js`, busque todas as instâncias `User`:

``` js
const Route = use('Route')
const User = use('App/Models/User')

Route.get('users', async () => {
  return await User.all()
})
```

## Convenção sobre configuração
Os modelos Lucid agem com base nas convenções do AdonisJs, mas você pode substituir os padrões por meio das configurações 
do aplicativo.

### table
Por padrão, o nome da tabela do banco de dados do modelo é a forma minúscula e plural do nome do 
modelo (por exemplo, `User` → `users`).

Para substituir esse comportamento, defina um getter `table` no seu modelo:

``` js
class User extends Model {
  static get table () {
    return 'my_users'
  }
}
```

### connection
Por padrão, os modelos usam a conexão padrão definida dentro do arquivo `config/database.js`.

Para substituir esse comportamento, defina um getter `connection` no seu modelo:

``` js
class User extends Model {
  static get connection () {
    return 'mysql'
  }
}
```

### chave primária
Por padrão, a chave primária de um modelo é configurada para a coluna `id`.

Para substituir esse comportamento, defina um getter `primaryKey` no seu modelo:

``` js
class User extends Model {
  static get primaryKey () {
    return 'uid'
  }
}
```

> O valor do campo `primaryKey` deve sempre ser exclusivo.

### createdAtColumn
O nome do campo usado para definir o carimbo de data/hora da criação (retorne `null` para desativar):

``` js
class User extends Model {
  static get createdAtColumn () {
    return 'created_at'
  }
}
```

### updatedAtColumn
O nome do campo usado para definir o carimbo de data/hora modificado (retorne `null` para desativar):

``` js
class User extends Model {
  static get updatedAtColumn () {
    return 'updated_at'
  }
}
```

### incrementing

O Lucid assume que cada tabela de banco de dados do modelo possui uma chave primária de incremento automático.

Para substituir esse comportamento, defina um getter `incrementing` retornando false:

``` js
class User extends Model {
  static get incrementing () {
    return false
  }
}
```

> Quando `incrementing` estiver definido como `false`, certifique-se de definir o valor `primaryKey` do modelo manualmente.

### primaryKeyValue
O valor da chave primária (atualize somente quando `incrementing` estiver definido como `false`):

``` js
const user = await User.find(1)
console.log(user.primaryKeyValue)

// quando o incremento é false
user.primaryKeyValue = uuid.v4()
```

## Ocultando campos
Muitas vezes, você precisará omitir campos dos resultados do banco de dados (por exemplo, 
ocultando senhas de usuários da saída JSON).

O AdonisJs simplifica isso, permitindo que você defina `hidden` ou `visible` atribuindo nas suas classes de modelo.

### hidden

``` js
class User extends Model {
  static get hidden () {
    return ['password']
  }
}
```

### visible
``` js
class Post extends Model {
  static get visible () {
    return ['title', 'body']
  }
}
```

### setVisible/setHidden

Você pode definir hiddenou visiblecampos para uma única consulta da seguinte maneira:

``` js
User.query().setHidden(['password']).fetch()

// ou set visível
User.query().setVisible(['title', 'body']).fetch()
```

## Datas
O gerenciamento de datas pode adicionar complexidade aos aplicativos orientados a dados.

Talvez seu aplicativo precise armazenar e mostrar datas em diferentes formatos, o que geralmente requer um certo grau de 
trabalho manual.

O Lucid lida com as datas normalmente, minimizando o trabalho necessário para usá-las.

### Definindo campos de data
Por padrão, os carimbos de data e hora `created_at` e `updated_at` são marcados como datas.

Defina seus próprios campos concatenando-os em um getter `dates` no seu modelo:

``` js
class User extends Model {
  static get dates () {
    return super.dates.concat(['dob'])
  }
}
```

No exemplo acima, nós puxamos os campos de data padrão da classe pai `Model` e inserimos um novo campo `dob` para 
a matriz `super.dates`, retornando todos os três campos de data: `created_at`, `updated_at` e `dob`.

### Formatação de campos de data
Por padrão, o Lucid formata datas para armazenamento como YYYY-MM-DD HH:mm:ss.

Para personalizar os formatos de data para armazenamento, substitua o método `formatDates`:

``` js
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

> O método `formatDates` é chamado antes que a instância do modelo seja salva no banco de dados, portanto, verifique se o 
> valor de retorno é sempre um formato válido para o mecanismo de banco de dados que você está usando.

### Casting de Datas
Agora que salvamos as datas no banco de dados, podemos formatá-las de maneira diferente ao exibi-las ao usuário.

Para formatar como as datas são exibidas, use o castDatesmétodo:

class User extends Model {
  static castDates (field, value) {
    if (field === 'dob') {
      return `${value.fromNow(true)} old`
    }
    return super.formatDates(field, value)
  }
}
O valueparâmetro é uma instância do Moment.js , permitindo que você chame qualquer método Moment para formatar suas datas.

Desserialização
O castDatesmétodo é chamado automaticamente quando uma instância do modelo é desserializada (acionada pela chamada toJSON):

const users = await User.all()

// converting to JSON array
const usersJSON = users.toJSON()
Criador de consultas
Os modelos Lucid usam o AdonisJs Query Builder para executar consultas ao banco de dados.

Para obter uma instância do Query Builder, chame o querymétodo model :

const User = use('App/Models/User')

const adults = await User
  .query()
  .where('age', '>', 18)
  .fetch()
Todos os métodos do Query Builder são totalmente suportados.

O fetchmétodo é necessário para executar a consulta, garantindo que os resultados retornem dentro de uma serializerinstância (consulte a documentação dos serializadores para obter mais informações).

Métodos estáticos
Os modelos Lucid têm vários métodos estáticos para executar operações comuns sem usar a interface do Query Builder.

Não há necessidade de chamar fetchao usar os seguintes métodos estáticos.

encontrar
Encontre um registro usando a chave primária (sempre retorna um registro):

const User = use('App/Models/User')
await User.find(1)
findOrFail
Semelhante a find, mas lança a ModelNotFoundExceptionquando não é possível encontrar um registro:

const User = use('App/Models/User')
await User.findOrFail(1)
findBy / findByOrFail
Encontre um registro usando um par de chave / valor (retorna o primeiro registro correspondente):

const User = use('App/Models/User')
await User.findBy('email', 'foo@bar.com')

// or
await User.findByOrFail('email', 'foo@bar.com')
first / firstOrFail
Encontre a primeira linha do banco de dados:

const User = use('App/Models/User')
await User.first()

// or
await User.firstOrFail()
findOrCreate (whereAttributes, values)
Encontre um registro, se não for encontrado, um novo registro será criado e retornado:

const User = use('App/Models/User')
const user = await User.findOrCreate(
  { username: 'virk' },
  { username: 'virk', email: 'virk@adonisjs.com' }
)
escolha (linhas = 1)
Escolha o xnúmero de linhas da tabela do banco de dados (o padrão é 1linha):

const User = use('App/Models/User')
await User.pick(3)
pickInverse (linhas = 1)
Escolha o xnúmero de linhas da tabela do banco de dados da última (o padrão é 1linha):

const User = use('App/Models/User')
await User.pickInverse(3)
ids
Retorne uma matriz de chaves primárias:

const User = use('App/Models/User')
const userIds = await User.ids()
Se a chave primária for uiduma matriz de uidvalores, será retornado.
par (lhs, rhs)
Retorna um objeto de pares chave / valor ( lhsé a chave, rhsé o valor):

const User = use('App/Models/User')
const users = await User.pair('id', 'country')

// returns { 1: 'ind', 2: 'uk' }
tudo
Selecione todas as linhas:

const User = use('App/Models/User')
const users = await User.all()
truncar
Exclua todas as linhas (tabela truncada):

const User = use('App/Models/User')
const users = await User.truncate()
Métodos de instância
As instâncias Lucid têm vários métodos para executar operações comuns sem usar a interface do Query Builder.

recarregar
Recarregue um modelo do banco de dados:

const User = use('App/Models/User')
const user = await User.create(props)
// user.serviceToken === undefined

await user.reload()
// user.serviceToken === 'E1Fbl3sjH'
Um modelo com propriedades definidas durante um gancho de criação exigirá recarregamento para recuperar os valores definidos durante esse gancho.
Ajudantes agregados
Os auxiliares agregados do Query Builder fornecem atalhos para consultas agregadas comuns.

Os seguintes métodos de modelo estático podem ser usados ​​para agregar uma tabela inteira.

Esses métodos encerram a cadeia do Query Builder e retornam um valor, portanto, não há necessidade de chamar fetch()ao usá-los.
getCount (columnName = '*')
Retorne uma contagem de registros em um determinado conjunto de resultados:

const User = use('App/Models/User')

// returns number
await User.getCount()
Você pode adicionar restrições de consulta antes de chamar getCount:

await User
  .query()
  .where('is_active', 1)
  .getCount()
Assim getCount, todos os outros métodos agregados estão disponíveis no Query Builder .

Escopos de consulta
Os escopos de consulta extraem restrições de consulta em métodos reutilizáveis ​​e poderosos.

Por exemplo, buscando todos os usuários que têm um perfil:

const Model = use('Model')

class User extends Model {
  static scopeHasProfile (query) {
    return query.has('profile')
  }

  profile () {
    return this.hasOne('App/Models/Profile')
  }
}
Ao definir scopeHasProfile, você pode restringir sua consulta da seguinte maneira:

const users = await User.query().hasProfile().fetch()
Os escopos são definidos com o scopeprefixo seguido pelo nome do método.

Ao chamar escopos, solte a scopepalavra - chave e chame o método no formato camelCase (por exemplo, scopeHasProfile→ hasProfile).

Você pode chamar todos os métodos padrão do construtor de consultas dentro de um escopo de consulta.

Paginação
O Lucid também suporta o paginatemétodo Query Builder :

const User = use('App/Models/User')
const page = 1

const users = await User.query().paginate(page)

return view.render('users', { users: users.toJSON() })
No exemplo acima, o valor de retorno de paginatenão é uma matriz de usuários, mas um objeto com metadados e uma datapropriedade que contém a lista de usuários:

{
  total: '',
  perPage: '',
  lastPage: '',
  page: '',
  data: [{...}]
}
Inserções e atualizações
Salve 
Com os modelos, em vez de inserir valores brutos no banco de dados, você persiste a instância do modelo que, por sua vez, faz a consulta de inserção para você. Por exemplo:

const User = use('App/Models/User')

const user = new User()
user.username = 'virk'
user.email = 'foo@bar.com'

await user.save()
O savemétodo persiste a instância no banco de dados, determinando de forma inteligente se deve ser criada uma nova linha ou se deve ser atualizada a linha existente. Por exemplo:

const User = use('App/Models/User')

const user = new User()
user.username = 'virk'
user.email = 'foo@bar.com'

// Insert
await user.save()

user.age = 22

// Update
await user.save()
Uma consulta de atualização ocorre apenas se algo tiver sido alterado.

Ligar savevárias vezes sem atualizar nenhum atributo do modelo não executará nenhuma consulta subsequente.

preencher / mesclar
Em vez de definir atributos manualmente, fillou mergepode ser usado.

O fillmétodo substitui os valores de chave / par de instância de modelo existentes:

const User = use('App/Models/User')

const user = new User()
user.username = 'virk'
user.age = 22

user.fill({ age: 23 }) // remove existing values, only set age.

await user.save()

// returns { age: 23, username: null }
O mergemétodo modifica apenas os atributos especificados:

const User = use('App/Models/User')

const user = new User()
user.fill({ username: 'virk', age: 22 })

user.merge({ age: 23 })

await user.save()

// returns { age: 23, username: 'virk' }
crio
Você pode passar dados diretamente para o modelo na criação, em vez de definir atributos manualmente após a instanciação:

const User = use('App/Models/User')
const userData = request.only(['username', 'email', 'age'])

// save and get instance back
const user = await User.create(userData)
createMany
Assim create, você pode transmitir dados diretamente para várias instâncias na criação:

const User = use('App/Models/User')
const usersData = request.collect(['username' 'email', 'age'])

const users = await User.createMany(usersData)
O createManymétodo faz n número de consultas em vez de fazer uma inserção em massa, onde n é o número de linhas.
Atualizações em massa
As atualizações em massa são executadas com a ajuda do Query Builder (o Lucid garante que as datas sejam formatadas adequadamente durante a atualização):

const User = use('App/Models/User')

await User
  .query()
  .where('username', 'virk')
  .update({ role: 'admin' })
As atualizações em massa não executam ganchos de modelo.
Exclui
Uma instância de modelo único pode ser excluída chamando o deletemétodo:

const User = use('App/Models/User')

const { id } = params
const user = await User.find(id)

await user.delete()
Após a chamada delete, a instância do modelo é proibida de executar atualizações, mas você ainda pode acessar seus dados:

await user.delete()

console.log(user.id) // works fine

user.id = 1 // throws exception
Exclusões em massa
As exclusões em massa são realizadas com a ajuda do Query Builder:

const User = use('App/Models/User')

await User
  .query()
  .where('role', 'guest')
  .delete()
Exclusões em massa não executam ganchos de modelo.
Transações
A maioria dos métodos Lucid suporta transações.

A primeira etapa é obter o trxobjeto usando o provedor de banco de dados :

const Database = use('Database')
const trx = await Database.beginTransaction()

const user = new User()

// pass the trx object and lucid will use it
await user.save(trx)

// once done commit the transaction
trx.commit()
Como na chamada save, você também pode passar o trxobjeto para o createmétodo:

const Database = use('Database')
const trx = await Database.beginTransaction()

await User.create({ username: 'virk' }, trx)

// once done commit the transaction
await trx.commit()
// or rollback the transaction
await trx.rollback()
Você também pode passar o trxobjeto para o createManymétodo:

await User.createMany([
  { username: 'virk' }
], trx)
Transações em Relacionamentos
Ao usar transações, você precisará passar um trxobjeto como o terceiro parâmetro do relacionamento attache dos detachmétodos:

const Database = use('Database')
const trx = await Database.beginTransaction()

const user = await User.create({email: 'user@example.com', password: 'secret'})

const userRole = await Role.find(1)

await user.roles().attach([userRole.id], null, trx)

await trx.commit()
// if something gone wrong
await trx.rollback
Ciclo de inicialização
Cada modelo possui um ciclo de inicialização em que seu bootmétodo é chamado uma vez .

Se você deseja executar algo que deve ocorrer apenas uma vez, considere gravá-lo dentro do bootmétodo model :

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


