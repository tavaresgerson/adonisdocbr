# Relações

As bases de dados relacionais são muito poderosas na gestão da relação entre múltiplas tabelas de banco de dados. O Lucid estende esse poder oferecendo associações de banco de dados somente em JavaScript, o que significa que você pode definir uma relação entre duas tabelas sem tocar no esquema SQL.

## Exemplo básico
As bases de dados relacionais são projetadas para definir relações entre duas ou mais tabelas de banco de dados. Existem vários benefícios em definir relacionamentos, pois eles tornam as operações comuns do banco de dados muito mais fáceis.

Vamos pegar o cenário mais comum de um Usuário e um Modelo de Perfil. Onde todo usuário no seu banco de dados pode ter um perfil social. Chamamos isso de *relação um para um*.

Para descrever essa relação, você terá que adicionar a seguinte linha de código ao seu modelo de Usuário.

```js
// app/Model/User.js

'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  profile () {
    return this.hasOne('App/Model/Profile') <1>
  }

}
```

1. O método `hasOne` define uma relação um para um em um determinado modelo.

Agora você pode chamar o método `profile` para acessar o perfil de um usuário específico.

```js
const user = yield User.find(1)
const userProfile = yield user.profile().fetch()
```

## Tipos de Relacionamentos

### Tem um relacionamento
A relação `hasOne` define uma relação um para um entre dois modelos usando uma chave estrangeira. A chave estrangeira é criada usando o nome singular de um determinado modelo seguido por `_id*`. No entanto, você pode sobrescrevê-lo.


| Modelo | Chave Estrangeira |
|-------|-------------|
| Usuário | user_id |
| Vendedor | seller_id |

![Imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841270/has-one_zfrkve.jpg)

Para configurar a relação mostrada no gráfico acima, você precisa defini-la dentro do seu modelo de usuário.

#### hasOne(relatedModel, [primaryKey=id], [foreignKey=user_id])

```js
// app/Model/User.js

class User extends Lucid {

  profile () {
    return this.hasOne('App/Model/Profile')
  }

}
```

### Belongsto Relacionamento
A relação 'belongsTo' é o oposto de 'hasOne' e sempre contém a chave estrangeira. Então, a melhor maneira de se lembrar disso é com a chave estrangeira. Qualquer tabela de banco de dados que tenha a chave estrangeira, seu modelo terá sempre a relação 'belongsTo'.

Não existem regras rígidas sobre como projetar suas relações, mas é sempre bom projetá-las da maneira mais natural possível. Por exemplo

| Modelo | Relação | Related Model |
|-------|----------|----------------|
| Usuário | hasOne | Perfil |
| Perfil | Pertence a | Usuário |
| Aluno | hasOne | IdCard |
| IdCard | Pertence a | Usuário |

Espero que isso faça sentido. Continuando com nossa relação de *Perfil do Usuário*, o modelo Perfil conterá a relação 'pertence a' como ele possui uma chave estrangeira.

#### belongsTo(relatedModel, [primaryKey=id], [foreignKey=user_id])

```js
// app/Model/Profile.js

class Profile extends Lucid {

  user () {
    return this.belongsTo('App/Model/User')
  }

}
```

### Relacionamento HasMany
Você vai se acostumar a usar o `hasMany`, pois é a relação mais comum que você precisará em qualquer aplicação. Vamos analisar alguns exemplos.

| Modelo | Relação | Related Model |
|-------|----------|---------------|
| Livro | has many | Capítulo |
| Capítulo | Pertence a | Livro |
| Post | has many | Comentário |
| Comentário | Pertence a | Post |

A relação 'hasMany' permite que existam vários registros relacionados para uma determinada linha, cada um contendo a chave estrangeira.

![Imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841272/has-many_p91i9i.jpg)

Vamos definir os modelos acima e suas relações no Lucid.

#### hasMany(relatedModel, [primaryKey=id], [foreignKey=book_id])

```js
// app/Model/Book.js

class Book extends Lucid {

  chapters () {
    return this.hasMany('App/Model/Chapter')
  }

}
```

```js
// app/Model/Chapter.js

class Chapter extends Lucid {

  book () {
    return this.belongsTo('App/Model/Book')
  }

}
```

### Relação de muitos para um
Existem situações onde cada lado do relacionamento pode ter muitas linhas relacionadas dentro do banco de dados. Vamos ver alguns exemplos.

| Modelo | Relação | Related Model |
|-------|----------|------------------|
| Aluno | belongsToMany | Cursos |
| Curso | belongsToMany | Aluno |
| Post | belongsToMany | Categorias |
| Categoria | belongsToMany | Posts |

Tomando o exemplo de Estudante e Curso, onde ambos os modelos podem ter muitas linhas relacionadas no banco de dados. Em outras palavras, é uma relação *muitos para muitos*.

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841273/belongsto-many_ymawpb.jpg)

Olhando para o gráfico acima, você notará que há uma terceira tabela chamada "course_student". Como cada modelo em ambos os lados tem muitos relacionamentos, eles não podem conter a chave estrangeira.

A terceira tabela é conhecida como uma *tabela pivot*. Ela contém a Chave Estrangeira para ambos os Modelos e define um relacionamento único entre eles. Vamos definir essa relação no Lucid e revisar as opções configuráveis.

#### belongsToMany(relatedModel, [pivotTable], [localKey], [otherKey])
```js
// app/Model/Student.js

class Student extends Lucid {

  courses () {
    return this.belongsToMany('App/Model/Course')
  }

}
```

```js
// app/Model/Course.js

class Course extends Lucid {

  students () {
    return this.belongsToMany('App/Model/Student')
  }

}
```

O método `belongsToMany` aceita múltiplos argumentos para configurar a tabela/campos da relação.

| Parâmetro | Requisitos: | Valor Padrão |
|-----------|----------|----------------|
| pivotTable | Não | A tabela de pivô é o nome singular de cada modelo de nome, ordenado por nome. Por exemplo, os modelos Course e Student terão *course_student* como nome da tabela de pivô. |
| Chave local | Não | Referência à chave estrangeira dentro da tabela de junção. |
| otherKey | Não | Referência ao modelo relacionado chave estrangeira dentro da tabela de junção. |

#### withTimestamps
Além disso, você escolhe salvar carimbos de data e hora na tabela pivot.

```js
class Student extends Lucid {
  courses () {
    this.belongsToMany('App/Model/Course').withTimestamps()
  }
}
```

### Relacionamento HasManyThrough
Outra relação importante suportada pelo Lucid é o `hasManyThrough`. Onde um modelo específico depende de outro modelo através de um terceiro modelo

![Imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841274/has-many-through_vux5jm.jpg)

Tomando o exemplo de buscar *posts* para um determinado  *país* não é possível porque não há relação direta entre países e postagens. Mas com a ajuda do modelo de usuário, podemos configurar uma relação indireta entre países e postagens e isso é chamado de relação `hasManyThrough`.

```js
// app/Model/Country.js

class Country extends Lucid {

  posts () {
    return this.hasManyThrough('App/Model/Post', 'App/Model/User')
  }

}
```

Agora para buscar as postagens de um país específico, você precisa chamar o método `posts` no modelo *Country*.

```js
const country = yield Country.findBy('name', 'India')
const posts = yield country.posts().fetch()
response.json(posts)
```

O método `hasManyThrough` aceita as opções dadas.

| Parâmetro | Requisitos: | Valor Padrão |
|-----------|-----------|---------------|
| relatedModel | Sim | null |
| através do modelo | Sim | null |
| chave primária | Não | Modelar chave primária |
| chave estrangeira | Não | Modelar chave estrangeira |
| através de chave primária | Não | Related model chave primária |
| através deForeignKey | Não | Relacionado modelo chave estrangeira |

## Consultando Relações
Consultar o banco de dados para relacionamentos é tão direto e intuitivo com Lucid. Você só precisa chamar os métodos de relacionamento definidos sem se preocupar com as consultas *join*.

Também consultar relações é dividido em três categorias amplas de *Lazy Loading*, *Eager Loading* e *Lazy Eager Loading*.

### Carregamento lento
O carregamento lento é um processo de carregar relacionamentos após buscar o registro principal/pai do banco de dados

```js
class User extends Lucid {

  profile () {
    return this.hasOne('App/Model/Profile')
  }

}
```

```js
const user = yield User.find(1) <1>
const profile = yield user.profile().fetch() <2>
```

1. Primeiro, nós `encontramos` um usuário com a chave primária.
2. Em seguida chamamos o método previamente definido "profile" para buscar o perfil relacionado ao usuário dado.

#### Definindo restrições de consulta
Você também pode anexar métodos de construtor de consulta às suas definições de relacionamento e o Lucid cuidará de executá-los.

```js
class User extends Lucid {

  profile () {
    return this
      .hasOne('App/Model/Profile')
      .where('is_active', true) <1>
  }

}
```

1. Agora quando você buscar o perfil relacionado para um usuário específico, ele incluirá apenas o registro onde is_active=true.

#### Restrições de Consulta em Tempo de Execução
Você também pode definir restrições de consulta em tempo de execução, apenas encadeando os métodos do construtor de consulta.

```js
const user = yield User.find(1)
const profile = user
  .profile()
  .where('is_active', true)
  .fetch()
```

### Carregamento Agressivo
O carregamento lento pode criar o problema *N+1* em determinados cenários. Por exemplo, carregar perfis para dez usuários, um de cada vez, fará um total de 11 consultas ao banco de dados. Para eliminar esse comportamento você pode pré-carregar/carregar com urgência os perfis, o que resultará em um total de 2 consultas ao banco de dados.

```js
const users = yield User
  .query()
  .with('profile') <1>
  .fetch()

console.log(users.toJSON())
```

Saída:

```js
[
  {
    id: 1,
    username: 'joe',
    email: '...',
    profile: {
      id: 4,
      avatar: '...'
    }
  }
]
```

1. O método 'with' pode ser usado para carregar com antecedência as relações com o registro pai. Além disso, você pode carregar múltiplas/aninhadas relações usando o método 'with'.

#### Carregamento Agressivo de Múltiplas Relações

```js
const users = yield User
  .query()
  .with('profile', 'friends')
  .fetch()
```

#### Carregamento Agressivo de Relações Aninhadas

```js
const user = yield User
  .query()
  .with('friends.profile')
  .fetch()
```

#### Restrições de Consulta em Tempo de Execução
Além disso, você pode construir sobre o construtor de consultas para filtrar os resultados dos modelos relacionados.

```js
const user = yield User
  .with('profile', 'friends')
  .scope('profile', (builder) => {
    builder.where('is_active', true)
  }) <1>
  .scope('friends', (builder) => {
    builder.orderBy('rank', 'desc')
  })
  .fetch()
```

1. O método `scope` lhe dá acesso ao construtor de consultas do modelo relacionado, o que significa que você pode adicionar a cláusula `where` para filtrar os resultados.

### Carregamento Preguiçoso Eager
O carregamento lento e ávido é uma combinação de carregamento lento e carregamento ávido em vez de pré-carregar todos os relacionamentos, você busca a instância do modelo pai e depois carrega com urgência todos os modelos relacionados.

```js
const user = yield User.find(1)
yield user.related('profile', 'friends').load()

console.log(user.toJSON())
```

Saída:

```js
[
  {
    id: 1,
    username: 'joe',
    email: '...',
    profile: {
      id: 4,
      avatar: '...'
    }
  }
]
```

## Filtrando Registros

> NOTE:
> Suportado por adonis-lucid 3.0.13 ou superior

Um caso de uso bastante comum é filtrar os resultados de nível superior com base em alguma condição sobre uma relação. Por exemplo:

1. Exibir todos os usuários que contribuíram com pelo menos uma publicação.
2. Buscar todos os carros com 2 ou mais proprietários em sua vida útil.

Idealmente, requer algumas junções complexas, mas o Lucid facilita muito para você.

#### has(relação, [expressão], [valor])

```js
class User extends Lucid {

  posts () {
    return this.hasMany('App/Model/Post')
  }

}

// filtering
const users = yield User.query().has('posts').fetch()

// two or more
const users = yield User.query().has('posts', '>=', 2).fetch()
```

#### whereHas(relação, retorno de chamada, [expressão], [valor])

```js
const users = yield User.query().whereHas('posts', (builder) => {
  builder.where('is_published', true)
}).fetch()
```

Além disso, você pode usar os métodos `doesntHave` e `whereDoesntHave`, que são opostos dos acima.

#### não tem (relação)

```js
const users = yield User.query().doesntHave('friends').fetch()
```

#### whereDoesntHave(relação, retorno de chamada)

```js
const users = yield User.query().whereDoesntHave('friends', (builder) => {
  builder.where('is_verified', false)
}).fetch()
```

### Contando Modelos Relacionados
Contar relacionamentos é comumente usado por aplicações web. Por exemplo: *Buscar contagem de comentários para cada postagem*.

#### withCount(relation)

```js
class Post extends Lucid {

  comments () {
    this.hasMany('App/Model/Comment')
  }

}

// fetching counts
const posts = yield Posts.query().withCount('comments').fetch()

console.log(posts.first().comments_count)
```

## Inserir, Atualizar & Deletar
As relações também podem ser criadas, atualizadas e excluídas com a mesma facilidade que a busca delas. Enquanto cada tipo de relação tem métodos ligeiramente diferentes para persistir dados relacionados.

#### salvar (modelInstance, [pivotValues])
O método 'salvar' pode ser usado para criar/atualizar uma instância do modelo relacionado. Ele funciona com as seguintes relações.

> NOTE
> Os valores pivot são suportados apenas pela relação *belongsToMany*. Consulte a documentação do método xref:_attach_rows_pivotvalues[attach] sobre como os valores pivot são definidos.

1. temUm
2. tem-muitos
3. belongsToMany

```js
const user = yield User.find(1)

const profile = new Profile()
profile.name = '@cybernox'
profile.avatar =  '...'

yield user.profile().save(profile)
```

#### create(values, [pivotValues])
O método 'create' é quase semelhante ao método 'save', com a diferença de que você passa um objeto arbitrário em vez de passar uma instância do modelo.

```js
const user = yield User.find(1)

yield user
  .profile()
  .create({name: '@cybernox', avatar: '...'})
```

#### saveMany(arrayOfInstances)
Salve vários registros relacionados para uma determinada instância de modelo. O 'saveMany' funciona com os seguintes tipos de relação.

1. tem-muitos
2. belongs_to_many

```js
const user = yield User.find(1)

const profile = new Profile({name: '@cybernox'})
const anotherProfile = new Profile({name: '@jgwhite'})

yield user.profile.saveMany([profile, anotherProfile])
```

#### createMany(arrayOfValues)
O método `createMany` também criará vários registros, caso você passe um array de objetos em vez de instâncias do modelo.

```js
const user = yield User.find(1)
const profiles = yield user
  .profile()
  .createMany([{name: '@cybernox'}, {name: 'jgwhite'}])
```

#### attach(rows, [pivotValues])
O método `attach` só funciona com relação *belongsToMany*. Você anexa registros existentes para formar uma relação.

```js
const student = yield Student.find(1)
const coursesIds = yield Courses.ids()

yield Student.courses().attach(coursesIds)
```

Opcionalmente, você pode passar um objeto para preencher campos dentro da *pivotTable*.

```js
yield Student.courses().attach(coursesIds, {enrollment_confirmed: false})
```

Ou você também pode definir diferentes pivotValues para cada linha relacionada.

```js
const mathsId = yield Courses
  .query()
  .where('name', 'Maths')
  .pluckId()

const englishId = yield Courses
  .query()
  .where('name', 'English')
  .pluckId()

const enrollment = {}
enrollment[mathsId] = {enrollment_confirmed: true}
enrollment[englishId] = {enrollment_confirmed: false}

yield Student.courses().attach(enrollment)
```

#### detach(rows)
O método 'detach' é o oposto do xref: _attach_rows_pivot_values [attach] e removerá as relações da tabela pivotTable.

> NOTE:
> O método 'detach' não remove as linhas do modelo relacionado. Ele apenas remove a relação da tabela de junção.

```js
const student = yield Student.find(1)
const coursesIds = yield Courses.ids()

yield Student.courses().detach(coursesIds)
```

#### sync(rows, [pivotValues])
A sincronização irá remover todas as relações existentes e adicionar apenas as relações fornecidas. Pense nisso como chamar xref:_detach_rows[desconectar] e xref:_attach_rows_pivot_values[conectar] juntos.

> DICA:
> Você também pode passar *pivotValues* para o método de sincronização, semelhante ao método de anexação.

```js
const student = yield Student.find(1)
const coursesIds = yield Courses.ids()

yield Student.courses().sync(coursesIds)
```

#### updatePivot(valores, [relatedModelId])
Para atualizar os valores dentro da tabela pivot você pode usar o método `updatePivot`.

```js
const student = yield Student.find(1)
Student.courses().updatePivot({marks: 90})
```

Ou

```js
const student = yield Student.find(1)
const maths = yield Course.where('name', 'Maths').first()
Student.courses().updatePivot({marks: 90}, maths.id)
```

#### withPivot(keys)
Ao buscar registros para *belongsToMany*, o Lucid não selecionará nenhuma linha da tabela de junção. Para buscar campos adicionais, você pode usar o método `withPivot`.

NOTE: Os campos da tabela dinâmica serão precedidos por ` _pivot_`. No exemplo abaixo, as notas serão retornadas como `_pivot_notes`

```js
'use strict'

class Student extends Lucid {

  courses () {
    return this.belongsToMany('App/Model/Course').withPivot('marks')
  }

}
```

Você também pode definir campos ao executar a consulta SELECT.

```js
const student = yield Student.find(1)
const courses = yield student.courses().withPivot('marks').fetch()
```

#### associar(modelInstance)
O método `associate` é usado com a relação *belongsTo* para associar uma linha de banco de dados existente.

```js
const user = yield User.find(1)
const profile = new Profile()
profile.name = '@cybernox'

profile.user().associate(user)
yield profile.save()
```

#### dissociar
O método 'dissociar' é o oposto de xref:_associar_modelo_instância[associar] e removerá a relação existente

```js
const profile = yield Profile.find(1)

profile.user().dissociate()
yield profile.save()
```
