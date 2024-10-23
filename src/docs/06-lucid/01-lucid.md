# Lucid

Lucid é a implementação do [Padrão de registro ativo](https://pt.wikipedia.org/wiki/Padrão_de_registro_ativo), que é um padrão arquitetônico para armazenar e manipular dados SQL como objetos. O Lucid torna tão simples para você escrever aplicativos web não triviais com facilidade e menos código.

Lucid tem suporte para:

1. Fluente construtor de consulta para consultar dados por meio da cadeia de métodos JavaScript.

```js
yield User.all()
yield User.query().where('status', 'active').fetch()
```

2. Forte suporte para definir relações de banco de dados sem tocar no seu esquema SQL.

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

1. Executando consultas dentro de transações.
2. Getters/Setters para mutação de dados no fly.
3. Suporte integrado para propriedades computadas.
4. Hooks de banco de dados para adicionar lógica de domínio a eventos específicos.
5. Suporte para definir *visível/oculto* campos para removê-los da saída JSON. O melhor exemplo é ocultar o campo "senha" da saída JSON.

## Exemplo básico
Vamos começar com um exemplo básico de criação de um modelo de usuário e consulta de usuários da tabela correspondente do banco de dados.

```bash
# Creating New Model

./ace make:model User

# or with migration
./ace make:model User --migration
```

```js
// app/Model/User.js

'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
}
```

Sim, isso é tudo o que você precisa para definir um modelo de Lucid. O Lucid vai descobrir o nome da tabela do banco de dados usando algumas convenções pré-definidas. Por exemplo, o modelo *Usuário* vai procurar a tabela *usuários*.

```
users (table)

+---------+-----------+--------------------+------------+
| id (PK) |  username |  email             | password   |
+---------+-----------+--------------------+------------+
| 1       |  unicorn  |  unicorns@ages.com | secret     |
| 2       |  lois     |  lois@oscar.com    | secret     |
+---------+-----------+--------------------+------------+
```

> NOTE:
> Certifique-se de usar [Migrações](/database/migrations) para configurar a tabela 'usuários'. O Lucid não cria/altera tabelas de banco de dados para você.

Agora vamos dizer que queremos buscar todos os usuários da tabela "usuários". Para simplificar, vamos fazer a busca dos usuários dentro do arquivo "rotas".

```js
// app/Http/routes.js

const Route = use('Route')
const User = use('App/Model/User')

Route.get('/users', function * (request, response) {
  const users = yield User.all() <1>
  response.ok(users)
})
```

1. O método 'all' buscará todos os registros da tabela do banco de dados. Pense nisso como uma consulta "select * from users".

## Convenção sobre Configuração
Os modelos herdam um punhado de propriedades da classe base Lucid, o que impede que você reescreva o mesmo código novamente e novamente. Implemente apenas os métodos abaixo se quiser alterar o comportamento padrão de um modelo.

#### tabela
O nome da tabela é a representação em plural sublinhado do nome da sua classe de modelo.


| Modelo | Nome da Tabela |
|-------|-------------|
| Usuário | usuários |
| Pessoa | pessoas |
| PostComment | post_comments |

Para sobrescrever o nome da tabela convencional, você pode retornar um valor do getter `table`.

```js
class User extends Lucid {

  static get table () {
    return 'my_users'
  }

}
```

#### chave primária
Cada modelo precisa ter uma chave primária que é definida como 'id' por padrão. O valor da chave primária é populado automaticamente pelo Lucid sempre que você salva um novo modelo no banco de dados. Além disso, a chave primária é necessária para resolver as relações entre os modelos.

```js
class User extends Model {

  static get primaryKey () {
    return 'userId'
  }

}
```

#### conexão
Parâmetro de conexão ajuda você em usar diferentes conexões de banco de dados para um modelo dado.

As conexões do banco de dados são definidas dentro do arquivo `config/database.js`. O Lucid utiliza a conexão padrão definida no mesmo arquivo. No entanto, você pode trocar esse valor para usar qualquer conexão definida em seu arquivo de configuração do banco de dados.

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

#### incrementando
Às vezes aplicações dependem de `uuid` como chaves primárias. Como os UUIDs são gerados antes de persistir o registro do banco de dados, eles não são incrementados automaticamente. É importante informar ao Lucid sobre isso antecipadamente.

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

## Timestamps
Timestamps eliminam a necessidade de configurar carimbos de data e hora manualmente toda vez que você cria ou atualiza um registro. Os seguintes carimbos de data e hora são usados para diferentes operações de banco de dados.

#### createTimestamp
Create timestamp define o campo do banco de dados a ser usado para adicionar o tempo de criação da linha à tabela do banco de dados. Você pode substituir esta propriedade para especificar um nome de campo diferente ou retornar 'nulo' para desativá-lo.

```js
class User extends Lucid {

  static get createTimestamp () {
    return 'created_at'
  }

}
```

#### updateTimestamp
Sempre que você modificar uma linha em uma tabela de banco de dados o `updateTimestamp` será atualizado para a hora atual.

```js
class User extends Lucid {

  static get updateTimestamp () {
    return 'updated_at'
  }

}
```

#### deleteTimestamp
O `deleteTimestamp` se comporta um pouco diferente dos timestamps *create* e *update*. Você só deve retornar o valor desse método se quiser fazer uso de soft deletes.

```js
class User extends Lucid {

  static get deleteTimestamp () {
    return null
  }

}
```

Soft deletes é um termo para excluir registros atualizando um carimbo de data e hora de exclusão em vez de remover a linha da tabela do banco de dados. Em outras palavras, *soft deletes são exclusões seguras*, onde você nunca perde dados das suas tabelas SQL.

Os soft deletes estão desativados por padrão e para habilitá-los você deve retornar um nome de campo da tabela do método get `deleteTimestamp`.

> NOTE:
> Você pode usar o método xref:withtrashed[withTrashed] para buscar linhas excluídas com suavidade.

#### dateFormat
O formato de data especifica o formato da data em que os carimbos de data/hora devem ser salvos. Internamente, os modelos converterão as datas para uma instância [moment.js](http://momentjs.com/). Você pode definir qualquer formato de data válido suportado pelo momentjs.

```js
class User extends Lucid {

  static get dateFormat () {
    return 'YYYY-MM-DD HH:mm:ss'
  }

}
```

## Omitindo Campos do JSON de Saída
Muitas vezes você vai se encontrar omitindo/escolhendo campos dos resultados do banco de dados. Por exemplo: Esconder a *senha do usuário* do JSON de saída. Fazer isso manualmente pode ser tedioso de várias maneiras.

1. Você terá um loop manual sobre as linhas e excluir a chave/valor em pares.
2. Quando você busca relacionamentos, você terá que percorrer todos os registros pais e depois seus registros filhos para excluir a chave/valor par.

AdonisJs simplifica isso definindo o *visível* ou *oculto* (um de cada vez) no seu modelo.

```js
// Defining Hidden

class User extends Lucid {

  static get hidden () {
    return ['password']
  }

}
```

```js
// Defining Visible

class Post extends Lucid {

  static get visible () {
    return ['title', 'body']
  }

}
```

## Query Scopes
Query scopes são métodos fluentes definidos em seus modelos como métodos estáticos e podem ser usados dentro da cadeia de construtor de consulta. Pense neles como *convenientes métodos descritivos* para estender o construtor de consulta.

```js
class User extends Lucid {

  static scopeActive (builder) {
    builder.where('status', 'active')
  }

}
```

Agora para usar o escopo *ativo*, você só precisa chamar o método na cadeia do construtor de consulta.

```js
const activeUsers = yield User.query().active().fetch()
```

### Query Scopes Rules

1. Os escopos de consulta são sempre definidos como métodos estáticos.
2. Você deve apêndice seus métodos com `scope` seguido pelo nome do método em PascalCase. Por exemplo: `latest()` será usado como `latest`.
3. Você deve chamar o método `query` no seu modelo antes de chamar qualquer escopo de consulta.

## Traços
Infelizmente, JavaScript não tem uma maneira de definir traços/misturas nativamente. *Lucid* modelos torna mais fácil para você adicionar traços aos seus modelos e estendê-los por adicionar novos métodos/propriedades.

#### traços
```js
class Post extends Lucid {

  static get traits () {
    return ['Adonis/Traits/Slugify']
  }

}
```

#### utilizar(trajetória)
Além disso, você pode adicionar dinamicamente atributos usando o método `use`.

```js
class Post extends Lucid {

  static boot () {
    super.boot()
    this.use('Adonis/Traits/Slugify')
  }

}
```

> NOTE:
> Certifique-se de definir traços apenas uma vez. A redefinição de traços causará múltiplas inscrições de um traço, e seus modelos se comportarão mal. O melhor lugar para definir *dinâmicos* traços é dentro do método `boot` do modelo.

## Operações CRUD
CRUD é um termo usado para *Criar*, *Ler*, *Atualizar* e *Excluir* registros de uma tabela de banco de dados. Os modelos Lucid oferecem alguns métodos convenientes para facilitar esse processo. Vamos ver como gerenciar *postagens* usando o modelo Post.

```
posts (table)

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
# Create Post Model

./ace make:model Post
```

Agora vamos usar o modelo de postagem para realizar operações CRUD

#### criar
```js
const post = new Post()
post.title = 'Adonis 101'
post.body  = 'Adonis 101 is an introductory guide for beginners.'

yield post.save() // SQL Insert
```

O método 'salvar' irá persistir o modelo no banco de dados. Se a linha já existir no banco de dados, ele irá atualizá-la. Alternativamente, você também pode usar o método 'criar', que permite passar todos os valores como parâmetro

```js
const post = yield Post.create({
  title: 'Adonis 101',
  body: 'Adonis 101 is an introductory guide for beginners'
})
```

#### ler
A operação de leitura é dividida em duas partes. A primeira é buscar todos os *posts* e outra é buscar um único post usando o `id` ou qualquer outro identificador exclusivo.

```js
// Fetching All Posts

const posts = yield Post.all()
```

```js
// Fetching A Single Post

const postId = request.param('id')
const post = yield Post.find(postId)

if (post) {
  yield response.sendView('posts.show', { post: post.toJSON() })
  return
}

response.send('Sorry, cannot find the selected found')
```

#### update
A operação de atualização é realizada em uma instância de modelo existente. Em cenários gerais, você terá um ID de uma linha que deseja atualizar.

```js
const post = yield Post.findBy('id', 1)
post.body = 'Adding some new content'

yield post.save() // SQL Update
```

Alternativamente, você também pode usar o método `fill` para passar todas as novas pares chave/valor como um objeto.

```js
const post = yield Post.findBy('id', 1)
post.fill({body: 'Adding some new content'})

yield post.save() // SQL Update
```

#### apagar
A operação de exclusão também é executada em uma instância de modelo existente. Se você tiver ativado o xref:_deletetimestamp[softDeletes], as linhas não serão excluídas do SQL. No entanto, a instância do modelo será considerada excluída.

```js
const post = yield Post.findBy('id', 1)
yield post.delete()
```

Além disso, a partir deste ponto o modelo de instância será congelado para edições. No entanto, você ainda pode ler dados da instância existente do modelo, mas não poderá editá-lo mais.

```js
const post = yield Post.findById(1)
yield post.delete()

console.log(post.title) // Adonis 101

post.title = 'New title' // will throw RuntimeException
```

## Métodos lúcidos
Lucid internamente utiliza [Provedor de Banco de Dados](/database/query-builder), o que significa que todos os métodos do provedor de banco de dados estão disponíveis para seus modelos. Além disso, os seguintes métodos foram adicionados para conveniência.

#### query()
O método 'query' retornará a instância do construtor de consultas, o que significa que você construirá suas consultas com a mesma facilidade que faria com o provedor de banco de dados.

```js
yield Post.query().where('title', 'Adonis 101').fetch()
```

#### fetch
É importante entender o papel do método `fetch`. O método fetch executará a cadeia de consulta, mas também garante retornar uma coleção de instâncias do modelo.

Que significa cada item dentro da coleção array não será um objeto regular. Em vez disso, será uma instância completa do modelo. Por exemplo:

```js
// Without Fetch

const posts = yield Post.query().where('title', 'Adonis 101')
console.log(posts)
```

Saída:

```
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

Com Fetch:

```js
const posts = yield Post.query().where('title', 'Adonis 101').fetch()
console.log(posts.value())
```

Saída:

```
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

Mais tarde é uma matriz de instâncias de modelo, que tem seus benefícios. Nós falaremos sobre eles em um guia diferente.

#### first
O método `first` retornará apenas a primeira linha correspondente como uma instância do modelo. Se nenhuma linha tiver sido encontrada, ele retornará `nulo`.

```js
const post = yield Post.query().where('title', 'Adonis 101').first()
```

#### findBy(chave, valor)
Encontre uma única linha para um determinado par chave/valor.

```js
yield Post.findBy('title', '...')
yield Post.findBy('body', '...')
yield Post.findBy('id', '...')
```

#### encontrar(valor)
O método `find` é semelhante ao método `findBy` da xref:_find_by_key_value(findBy), mas em vez disso utiliza a chave primária como chave para buscar a linha.

```js
yield Post.find(1)
```

#### all()
Retorna todas as linhas da tabela correspondente do banco de dados.

```js
yield Post.all()
```

#### ids()
Retorna um array com todos os *ids* da tabela correspondente do banco de dados.

```js
const ids = yield Post.ids()
```

#### pair(lhs, rhs)
O método `pair` retornará um objeto plano com uma chave/valor par de *lhs* e *rhs*. É útil para preencher as opções da caixa de seleção.

```js
const countries = yield Country.pair('code', 'name')
```

Saída:

```js
{
  ind: 'India',
  us: 'United States',
  uk: 'United Kingdom'
}
```

#### paginate(page, [perPage=20])
O método `paginate` torna tão simples a paginação sobre registros de banco de dados.

```js
const posts = yield Post.paginate(request.input('page'))
```

#### Escolha uma das seguintes opções:
O método `pick` irá selecionar o número dado de registros do banco de dados.

```js
const posts = yield Post.pick(2)
```

#### pickInverse( [limit=1] )
O método `pickInverse` funciona de forma semelhante ao método `pick`, porém ele irá selecionar as linhas com a cláusula `desc`.

```js
const posts = yield Post.pickInverse(2)
```

#### criar(valores)
O método `create` é usado para criar uma nova linha no banco de dados

```js
const user = yield User.create({ username: 'virk', email: 'virk@adonisjs.com' })
```

#### salvar()
Criar/atualizar uma instância de modelo

```js
const user = new User()
user.username = 'virk'
user.email = 'virk@adonisjs.com'

yield user.save()
```

#### createMany
Crie múltiplas linhas de uma vez. Este método retornará um array de instâncias do modelo.

```js
const users = yield User.createMany([{...}, {...}])
```

#### first
Selecione a primeira linha do banco de dados.

```js
const user = yield User.first()
```

#### last
Selecione a última linha do banco de dados.

```js
const user = yield User.last()
```

## Falhar cedo
Lucid também possui alguns métodos úteis que lançam exceções quando não conseguem encontrar uma determinada linha usando os métodos 'find' ou 'findBy'. Alguns programadores acham mais simples lançar exceções e capturá-las posteriormente dentro de um manipulador global para evitar cláusulas 'if/else' em todos os lugares.

#### findOrFail(valor)

```js
const userId = request.param('id')
const user = yield User.findOrFail(userId)
```

#### findByOrFail(chave, valor)

```js
const user = yield User.findByOrFail('username', 'virk')
```

Se quiser, você pode envolver seus métodos 'orFail' dentro de um bloco 'try/catch', ou você pode tratá-los globalmente dentro do arquivo 'app/Listeners/Http.js'.

```js
// app/Listeners/Http.js

Http.handleError = function * (error, request, response) {
  if (error.name === 'ModelNotFoundException') {
    response.status(401).send('Resource not found')
    return
  }
}
```

#### findOrCreate (ondeAtributos, valores)
O método `findOrCreate` é um atalho para encontrar um registro e se não for encontrado, um novo registro será criado e retornado no local.

```js
const user = yield User.findOrCreate(
  { username: 'virk' },
  { username: 'virk', email: 'virk@adonisjs.com' }
)
```

#### withTrashed
O método `withTrashed` pode ser usado para buscar linhas excluídas suavemente.

```js
const users = yield User.query().withTrashed().fetch()
```

## Usando Transações
AdonisJS oferece suporte de primeira classe para executar transações SQL usando o [Provedor de Banco de Dados](/database/query-builder/_#database_transactions). Além disso, seus modelos Lucid podem usar transações ao criar, atualizar ou excluir registros.

#### useTransaction
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

1. Você sempre usa o provedor de banco de dados para iniciar uma nova transação. A razão pela qual desacoplamos as transações dos modelos Lucid é oferecer a flexibilidade de usar a mesma instância de transação de diferentes modelos.
2. O método `useTransaction` usará a instância de transação para executar as próximas operações SQL.
3. O método 'commit' permite que você confirme a transação ou faça um 'rollback' se algo inesperado acontecer.
