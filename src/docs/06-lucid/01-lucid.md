# Lucid

Lucid é a implementação do [Active record](https://en.wikipedia.org/wiki/Active_record_pattern) que é um padrão arquitetônico de armazenamento e manipulação de dados SQL como objetos. Lucid torna muito simples para você escrever aplicativos da web não triviais com facilidade e menos código.

Lucid tem suporte para:

1. Construtor de consultas fluente para consultar dados encadeando métodos javascript.
    ```js
    yield User.all()
    yield User.query().where('status', 'active').fetch()
    ```

2. Suporte sólido para definir relações de banco de dados sem tocar no seu esquema SQL.
    ```js
    class User extends Lucid {

      profile () {
        return this.hasOne('App/Model/Profile')
      }

      posts () {
        return this.hasMany('App/Model/Post')
      }

    }
    ```
3. Executar consultas dentro de transações.
4. Getters/Setters para mutar dados em tempo real.
5. Suporte integrado para propriedades computadas.
6. Ganchos de banco de dados para adicionar lógica de domínio a eventos específicos.
7. Suporte para definir campos *visíveis/ocultos* para removê-los da saída JSON. O melhor exemplo é esconder o campo `password` da saída JSON.

## Exemplo Básico
Vamos começar com um exemplo básico de criação de um modelo de usuário e consulta de usuários da tabela de banco de dados correspondente.

```bash
# Criando Novo Modelo

./ace make:model User

# ou com migração
./ace make:model User --migration
```

```js
// app/Model/User.js

'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
}
```

Sim, isso é tudo o que você precisa para definir um modelo Lucid. O Lucid descobrirá o nome da tabela do banco de dados usando algumas convenções predefinidas. Por exemplo, o modelo *User* procurará pela tabela *users*.

```bash
# users (table)

+---------+-----------+--------------------+------------+
| id (PK) |  username |  email             | password   |
+---------+-----------+--------------------+------------+
| 1       |  unicorn  |  unicorns@ages.com | secret     |
| 2       |  lois     |  lois@oscar.com    | secret     |
+---------+-----------+--------------------+------------+
```

::: warning NOTA
Certifique-se de usar [Migrations](/docs/05-database/03-migrations.md) para configurar a tabela `users`. O Lucid não cria/altera tabelas de banco de dados para você.
:::

Agora, digamos que queremos buscar todos os usuários da tabela `users`. Para simplificar, faremos a busca dos usuários dentro do arquivo `routes`.

```js
// app/Http/routes.js

const Route = use('Route')
const User = use('App/Model/User')

Route.get('/users', function * (request, response) {
  const users = yield User.all() <1>
  response.ok(users)
})
```

1. O método `all` buscará todos os registros da tabela do banco de dados. Pense nisso como uma consulta `select * from "users"`.

## Convenção sobre configuração
Os modelos herdam um punhado de propriedades da classe base Lucid, o que impede que você reescreva o mesmo código repetidamente. Implemente os métodos abaixo somente se quiser alterar o comportamento padrão de um modelo.

#### `table`
O nome da tabela é a representação plural sublinhada do nome da sua classe de modelo.

| Modelo      | Tabela          |
|-------------|-----------------|
| User        | users           |
| Person      | people          |
| PostComment | post_comments   |

Para substituir o nome da tabela convencional, você pode retornar um valor do getter `table`.

```js
class User extends Lucid {

  static get table () {
    return 'my_users'
  }

}
```

#### `primaryKey`
Cada modelo precisa ter uma chave primária que é definida como `id` por padrão. O valor para a chave primária é preenchido automaticamente pelo Lucid sempre que você salva um novo modelo no banco de dados. Além disso, a chave primária é necessária para resolver as relações do modelo.

```js
class User extends Model {

  static get primaryKey () {
    return 'userId'
  }

}
```

#### `connection`
O parâmetro Connection ajuda você a usar diferentes conexões de bancos de dados para um determinado modelo.

As conexões de banco de dados são definidas dentro do arquivo `config/database.js`. O Lucid faz uso da conexão *padrão* definida no mesmo arquivo. No entanto, você pode trocar esse valor para usar qualquer conexão definida no arquivo de configuração do seu banco de dados.

```js
// config/database.js

module.exports = {
  connection: 'mysql',

  mysql: {
    ....
  },

  reportsMysql: {
    ...
  }
}
```

```js
// app/Model/Report

class Report extends Mysql {

  static get connection () {
    return 'reportsMysql'
  }

}
```

#### `incrementing`
Às vezes, os aplicativos dependem de `uuid` como suas chaves primárias. Como os uuids são gerados antes de persistir o registro do banco de dados, eles não são incrementados automaticamente. Portanto, é importante informar o Lucid sobre o mesmo com antecedência.

```js
class User extends Lucid {
  static get primaryKey () {
    return 'uuid'
  }

  static get incrementing () {
    return false
  }
}
```

## Carimbos de tempo
Os carimbos de tempo eliminam a necessidade de configurar carimbos de tempo manualmente sempre que você cria ou atualiza um registro. Os carimbos de tempo a seguir são usados ​​para diferentes operações de banco de dados.

#### `createTimestamp`
Criar carimbo de tempo define o campo do banco de dados a ser usado para adicionar o tempo de criação da linha à tabela do banco de dados. Você pode substituir esta propriedade para especificar um nome de campo diferente ou retornar `null` para desativá-lo.

```js
class User extends Lucid {

  static get createTimestamp () {
    return 'created_at'
  }

}
```

#### `updateTimestamp`
Toda vez que você modificar uma linha em uma tabela de banco de dados, `updateTimestamp` será atualizado para a hora atual.

```js
class User extends Lucid {

  static get updateTimestamp () {
    return 'updated_at'
  }

}
```

#### `deleteTimestamp`
O `deleteTimestamp` se comporta um pouco diferente dos timestamps *create* e *update*. Você só deve retornar valor deste método se quiser fazer uso de soft deletes.

```js
class User extends Lucid {

  static get deleteTimestamp () {
    return null
  }

}
```

Soft deletes é um termo para excluir registros atualizando um timestamp de exclusão em vez de remover a linha do banco de dados. Em outras palavras, *soft deletes são exclusões seguras*, onde você nunca perde dados de suas tabelas SQL.

Soft deletes são desabilitadas por padrão e para habilitá-las você deve retornar um nome de campo de tabela do getter `deleteTimestamp`.

::: tip DICA
Você pode usar o método [withTrashed](#withtrashed) para buscar linhas excluídas temporariamente.
:::

#### `dateFormat`
O formato de data especifica o formato de data em que os carimbos de data/hora devem ser salvos. Internamente, os modelos converterão as datas para a instância [moment.js](http://momentjs.com/). Você pode definir qualquer formato de data válido suportado pelo momentjs.

```js
class User extends Lucid {

  static get dateFormat () {
    return 'YYYY-MM-DD HH:mm:ss'
  }

}
```

## Omitindo campos da saída JSON
Muitas vezes, você se verá omitindo/escolhendo campos dos resultados do banco de dados. Por exemplo: ocultando a *senha do usuário* da saída JSON. Fazer isso manualmente pode ser tedioso de várias maneiras.

1. Você terá que fazer um loop manualmente nas linhas e excluir o par chave/valor.
2. Ao buscar relacionamentos, você terá que fazer um loop em todos os registros pais e, em seguida, nos registros filhos para excluir o par chave/valor.

O AdonisJs simplifica isso definindo o *visível* ou *oculto* (um de cada vez) no seu modelo.

```js
// Definindo atributos como ccultos

class User extends Lucid {

  static get hidden () {
    return ['password']
  }

}
```

```js
// Definindo atributos como visíveis

class Post extends Lucid {

  static get visible () {
    return ['title', 'body']
  }

}
```

## Escopos de consulta
Os escopos de consulta são métodos fluentes definidos em seus modelos como métodos estáticos e podem ser usados ​​dentro da cadeia do construtor de consultas. Pense neles como métodos convenientes *descritivos* para estender o construtor de consultas.

```js
class User extends Lucid {

  static scopeActive (builder) {
    builder.where('status', 'active')
  }

}
```

Agora, para usar o escopo *ativo*, você só precisa chamar o método na cadeia do construtor de consultas.

```js
const activeUsers = yield User.query().active().fetch()
```

### Regras dos escopos de consulta

1. Os escopos de consulta são sempre definidos como métodos estáticos.
2. Você deve anexar seus métodos com `scope` seguido pelo nome do método *PascalCase*. Por exemplo: `scopeLatest()` será usado como `latest`.
3. Você deve chamar o método `query` em seu modelo antes de chamar qualquer escopo de consulta.

## Traits
Infelizmente, o Javascript não tem como definir traits/mixins nativamente. Os modelos *Lucid* facilitam a adição de características aos seus modelos e a sua extensão adicionando novos métodos/propriedades.

#### `traits`
```js
class Post extends Lucid {

  static get traits () {
    return ['Adonis/Traits/Slugify']
  }

}
```

#### `use(trait)`
Além disso, você pode adicionar características dinamicamente usando o método `use`.

```js
class Post extends Lucid {

  static boot () {
    super.boot()
    this.use('Adonis/Traits/Slugify')
  }

}
```

::: warning NOTA
Certifique-se de definir características apenas uma vez. Redefinir características causará vários registros de uma tríade, e seus modelos se comportarão mal. O melhor lugar para definir características *dinâmicas* é dentro do método `boot` do modelo.
:::

## Operações CRUD
CRUD é um termo usado para *Criar*, *Ler*, *Atualizar* e *Excluir* registros de uma tabela de banco de dados. Os modelos Lucid oferecem vários métodos convenientes para tornar esse processo mais fácil. Vamos dar um exemplo de gerenciamento de *postagens* usando o modelo Post.

```bash
// posts table

+------------+-----------------+
| name       |  type           |
+------------+-----------------+
| id (PK)    |  INTEGER        |
| title      |  VARCHAR(255)   |
| body       |  TEXT           |
| created_at |  DATETIME       |
| updated_at |  DATETIME       |
+------------+-----------------+
```

```bash
# Criar modelo de post

./ace make:model Post
```

Agora vamos usar o Post Model para executar operações CRUD

#### `create`
```js
const post = new Post()
post.title = 'Adonis 101'
post.body  = 'Adonis 101 is an introductory guide for beginners.'

yield post.save() // SQL Insert
```

O método `save` persistirá o modelo no banco de dados. Se a linha já existir no banco de dados, ele a atualizará. Como alternativa, você também pode usar o método `create`, que permite que você passe todos os valores como um parâmetro

```js
const post = yield Post.create({
  title: 'Adonis 101',
  body: 'Adonis 101 is an introductory guide for beginners'
})
```

#### `read`
A operação de leitura é dividida em dois segmentos. O primeiro é buscar todos os *posts* e o outro é buscar um único post usando `id` ou qualquer outro identificador exclusivo.

```js
// Obtendo todas as postagens

const posts = yield Post.all()
```

```js
// Buscando uma única postagem

const postId = request.param('id')
const post = yield Post.find(postId)

if (post) {
  yield response.sendView('posts.show', { post: post.toJSON() })
  return
}

response.send('Sorry, cannot find the selected found')
```

#### `update`
A operação de atualização é realizada em uma instância de modelo existente. Em cenários gerais, você terá um id de uma linha que deseja atualizar.

```js
const post = yield Post.findBy('id', 1)
post.body = 'Adding some new content'

yield post.save() // SQL Update
```

Alternativamente, você também pode usar o método `fill` para passar todos os novos pares de chave/valor como um objeto.

```js
const post = yield Post.findBy('id', 1)
post.fill({body: 'Adding some new content'})

yield post.save() // SQL Update
```

#### `delete`
A operação de exclusão também é realizada em uma instância de modelo existente. Se você ativou xref:_deletetimestamp[softDeletes], as linhas não serão excluídas do SQL. No entanto, a instância do modelo será considerada excluída.

```js
const post = yield Post.findBy('id', 1)
yield post.delete()
```

Além disso, a partir deste ponto, a instância do modelo *congelará para edições*. No entanto, você ainda pode ler dados da instância do modelo existente, mas não poderá mais editá-los.

```js
const post = yield Post.findById(1)
yield post.delete()

console.log(post.title) // Adonis 101

post.title = 'New title' //lançará RuntimeException
```

## Métodos Lucid
O Lucid internamente faz uso do [Database Provider](/markdown/05-database/02-query-builder.md), o que significa que todos os métodos do Database Provider estão disponíveis para seus modelos. Os métodos abaixo também foram adicionados para sua conveniência.

#### `query()`
O método `query` retornará a instância do query builder, o que significa que você cria suas consultas com a mesma facilidade que faria com o Database Provider.

```js
yield Post.query().where('title', 'Adonis 101').fetch()
```

#### `fetch`
É importante entender a função do método `fetch`. O método Fetch executará a cadeia de consultas, mas também garante o retorno de uma coleção de instâncias de modelo.

O que significa que cada item dentro da matriz de coleção não será um Objeto regular. Em vez disso, será uma instância de modelo completa. Por exemplo:

```js
// Sem buscar

const posts = yield Post.query().where('title', 'Adonis 101')
console.log(posts)
```

```js
// Saída

[
  {
    id: 1,
    title: 'Adonis 101',
    body: 'Adonis 101 is an introductory guide for beginners.',
    created_at: '2016-02-20 17:59:25',
    updated_at: '2016-02-20 17:59:29'
  }
]
```

```js
// Com Busca

const posts = yield Post.query().where('title', 'Adonis 101').fetch()
console.log(posts.value())
```

```js
// Saída

[
  Post {
    attributes: {
      id: 1,
      title: 'Adonis 101',
      body: 'Adonis 101 is an introductory guide for beginners.',
      created_at: '2016-02-20 17:59:25',
      updated_at: '2016-02-20 17:59:29'
    },
    original: { ... }
  }
]
```

Mais tarde, há uma matriz de instâncias de modelo, que tem seus benefícios. Falaremos sobre elas em um guia diferente.

#### `first`
O método `first` retornará apenas a primeira linha correspondente como a instância do modelo. Se nenhuma linha for encontrada, ele retornará `null`.

```js
const post = yield Post.query().where('title', 'Adonis 101').first()
```

#### `findBy(key, value)`
Encontre uma única linha para um determinado par chave/valor.

```js
yield Post.findBy('title', '...')
yield Post.findBy('body', '...')
yield Post.findBy('id', '...')
```

#### `find(value)`
O método `find` é semelhante ao método [findBy](#findbykey-value) em vez disso, ele faz uso da [primaryKey](#primarykey) como a chave para buscar a linha.

```js
yield Post.find(1)
```

#### `all()`
Retorna todas as linhas da tabela de banco de dados correspondente.

```js
yield Post.all()
```

#### `ids()`
Retorna uma matriz de todos os *ids* da tabela de banco de dados correspondente.

```js
const ids = yield Post.ids()
```

#### `pair(lhs, rhs)`
O método `pair` retornará um objeto plano com um par chave/valor de *lhs* e *rhs*. É útil para preencher as opções da caixa de seleção.

```js
const countries = yield Country.pair('code', 'name')
```

```js
// Saída

{
  ind: 'India',
  us: 'United States',
  uk: 'United Kingdom'
}
```

#### `paginate(page, [perPage=20])`
O método `paginate` simplifica muito a paginação de registros do banco de dados.

```js
const posts = yield Post.paginate(request.input('page'))
```

#### `pick([limit=1])`
O método `pick` selecionará o número fornecido de registros do banco de dados.

```js
const posts = yield Post.pick(2)
```

#### `pickInverse([limit=1])`
O `pickInverse` funciona de forma semelhante ao método `pick`, mas selecionará linhas com a cláusula `desc`.

```js
const posts = yield Post.pickInverse(2)
```

#### `create(values)`
O método `create` é usado para criar uma nova linha no banco de dados

```js
const user = yield User.create({ username: 'virk', email: 'virk@adonisjs.com' })
```

#### `save()`
Criar/Atualizar uma instância de modelo

```js
const user = new User()
user.username = 'virk'
user.email = 'virk@adonisjs.com'

yield user.save()
```

#### `createMany`
Criar várias linhas de uma vez. Este método retornará uma matriz de instâncias de modelo.

```js
const users = yield User.createMany([{...}, {...}])
```

#### `first`
Selecione a primeira linha do banco de dados.

```js
const user = yield User.first()
```

#### `last`
Selecione a última linha do banco de dados.

```js
const user = yield User.last()
```

## Falha inicial
O Lucid também tem alguns métodos úteis que lançarão exceções quando não for possível encontrar uma determinada linha usando o método `find` ou `findBy`. Alguns programadores acham mais simples lançar exceções e capturá-las mais tarde dentro de um manipulador global para evitar a cláusula `if/else` em todos os lugares.

#### `findOrFail(value)`

```js
const userId = request.param('id')
const user = yield User.findOrFail(userId)
```

#### `findByOrFail(key, value)`

```js
const user = yield User.findByOrFail('username', 'virk')
```

Se desejar, você pode encapsular seus métodos `orFail` dentro de um bloco `try/catch` ou pode manipulá-los globalmente dentro do arquivo `app/Listeners/Http.js`.

```js
// app/Listeners/Http.js

Http.handleError = function * (error, request, response) {
  if (error.name === 'ModelNotFoundException') {
    response.status(401).send('Resource not found')
    return
  }
}
```

#### `findOrCreate(whereAttributes, values)`
O método `findOrCreate` é um atalho para encontrar um registro e, se não for encontrado, um novo registro será criado e retornado imediatamente.

```js
const user = yield User.findOrCreate(
  { username: 'virk' },
  { username: 'virk', email: 'virk@adonisjs.com' }
)
```

#### `withTrashed`
O método `withTrashed` pode ser usado para buscar linhas excluídas temporariamente.

```js
const users = yield User.query().withTrashed().fetch()
```

## Usando transações
O AdonisJs tem suporte de primeira classe para executar transações SQL usando o [Provedor de banco de dados](/docs/05-database/02-query-builder.md#database-transactions). Além disso, seus modelos Lucid podem usar transações ao criar, atualizar ou excluir registros.

#### `useTransaction`
```js
const Database = use('Database')
const trx = yield Database.beginTransaction() <1>

const user = new User()
user.username = 'liza'
user.password = 'secret'
user.useTransaction(trx) <2>
yield user.save()
trx.commit() <3>
```

1. Você sempre usa o provedor de banco de dados para iniciar uma nova transação. O motivo pelo qual desacoplamos as transações dos modelos Lucid é oferecer a flexibilidade de usar a mesma instância de transação de modelos diferentes.
2. O método `useTransaction` usará a instância da transação para executar as próximas operações SQL.
3. O método `commit` lhe dá a habilidade de confirmar a transação ou `rollback` dela se algo inesperado acontecer.
