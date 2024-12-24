# Relacionamentos

Bancos de dados relacionais são muito poderosos no gerenciamento do relacionamento entre várias tabelas de banco de dados. O Lucid estende esse poder oferecendo associações de banco de dados somente Javascript, o que significa que você pode definir um relacionamento entre duas tabelas sem tocar no esquema SQL.

## Exemplo básico
Bancos de dados relacionais têm como objetivo definir relações entre duas ou mais tabelas de banco de dados. Existem vários benefícios em definir relacionamentos, pois eles tornam as operações comuns de banco de dados muito mais fáceis.

Vamos pegar o cenário mais comum de um modelo de usuário e perfil. Onde cada usuário em seu banco de dados pode ter um perfil social. Chamamos isso de *relacionamento um para um*.

Para descrever esse relacionamento, você terá que adicionar a seguinte linha de código ao seu modelo de usuário.

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

1. O método `hasOne` define um relacionamento um para um em um determinado modelo.

Agora você pode chamar o método `profile` para acessar o perfil de um determinado usuário.

```js
const user = yield User.find(1)
const userProfile = yield user.profile().fetch()
```

## Tipos de relacionamentos

### Relacionamento Has One
O relacionamento `hasOne` define uma relação um para um entre 2 modelos usando uma chave estrangeira. A chave estrangeira é criada usando o nome singular de um determinado modelo seguido por *_id*. No entanto, você tem a liberdade de substituí-lo.

| Modelo    | Chave estrangeira |
|-----------|-------------------|
| User      | user_id           |
| Seller    | seller_id         |

![image](http://res.cloudinary.com/adonisjs/image/upload/v1472841270/has-one_zfrkve.jpg)

Para configurar o relacionamento mostrado na figura acima, você precisa defini-lo dentro do seu modelo User.

#### hasOne(relatedModel, [primaryKey=id], [foreignKey=user_id])

```js
// app/Model/User.js

class User extends Lucid {

  profile () {
    return this.hasOne('App/Model/Profile')
  }

}
```

### Relacionamento BelongsTo
O relacionamento `belongsTo` é o oposto de `hasOne` e sempre contém a *chave estrangeira*. Então a melhor maneira de lembrar é com a chave estrangeira. Qualquer tabela de banco de dados que tenha a chave estrangeira, seu Modelo sempre terá a relação `belongsTo`.

Não há regras rígidas sobre como projetar seus relacionamentos, mas é sempre bom projetá-los da maneira mais natural. Por exemplo

| Modelo  | Relação   | Modelo Relacionado  |
|---------|-----------|---------------------|
| User    | hasOne    | Profile             |
| Profile | belongsTo | User                |
| Student | hasOne    | IdCard              |
| IdCard  | belongsTo | User                |

Espero que isso faça sentido. Continuando com nosso relacionamento *User* *Profile*, o modelo Profile conterá o relacionamento `belongsTo`, pois ele contém a chave estrangeira.

#### belongTo(relatedModel, [primaryKey=id], [foreignKey=user_id])

```js
// app/Model/Profile.js

class Profile extends Lucid {

  user () {
    return this.belongsTo('App/Model/User')
  }

}
```

### Relacionamento HasMany
Você se verá usando `hasMany` com bastante frequência, pois esse é o relacionamento mais comum exigido por qualquer aplicativo. Vamos rever alguns exemplos.

| Modelo  | Relação   | Modelo Relacionado  |
|---------|-----------|---------------------|
| Book    | hasMany   | Chapter             |
| Chapter | belongsTo | Book                |
| Post    | hasMany   | Comment             |
| Comment | belongsTo | Post                |

O relacionamento `hasMany` torna possível ter vários registros relacionados para uma determinada linha, cada um contendo a foreignKey.

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841272/has-many_p91i9i.jpg)

Vamos definir os modelos acima e seus relacionamentos no Lucid.

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

### Relacionamento BelongsToMany
Há situações em que cada lado do relacionamento pode ter muitas linhas relacionadas dentro do banco de dados. Vamos ver alguns exemplos.

| Modelo    | Relação       | Modelo Relacionado  |
|-----------|---------------|-----------------|
| Student   | belongsToMany | Courses         |
| Course    | belongsToMany | Students        |
| Post      | belongsToMany | Categories      |
| Category  | belongsToMany | Posts           |

Tomando o exemplo de Aluno e Curso, onde ambos os modelos podem ter muitas linhas relacionadas no banco de dados. Em outras palavras, é um *relacionamento de muitos para muitos*.

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841273/belongsto-many_ymawpb.jpg)

Olhando para a figura acima, você notará que há uma terceira tabela chamada `course_student`. Como cada modelo em ambas as extremidades tem muitos relacionamentos, eles não podem conter a chave estrangeira.

A terceira tabela é conhecida como uma *tabela dinâmica*. Ela contém a Chave Estrangeira para ambos os Modelos e define um relacionamento exclusivo entre eles. Vamos definir esse relacionamento no Lucid e revisar as opções configuráveis.

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

O método `belongsToMany` aceita múltiplos argumentos para configurar a tabela/campos para o relacionamento.

| Parâmetro   | Obrigatório | Valor Padrão      |
|-------------|-------------|-------------------|
| pivotTable  | No          | A tabela dinâmica é a forma singular de cada nome de modelo, ordenada por nome. Por exemplo, os modelos Course e Student terão *course_student* como o nome da tabela dinâmica.  |
| localKey    | No          | Referência à chave estrangeira do modelo dentro da tabela dinâmica.  |
| otherKey    | No          | Referência à chave estrangeira do modelo relacionado dentro da tabela dinâmica.  |

#### withTimestamps
Você também escolhe salvar carimbos de data/hora na tabela dinâmica.

```js
class Student extends Lucid {
  courses () {
    this.belongsToMany('App/Model/Course').withTimestamps()
  }
}
```

### Relacionamento HasManyThrough
Outro tipo de relação importante suportado pelo Lucid é `hasManyThrough`. Onde um determinado modelo é dependente de outro modelo via 3º modelo

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841274/has-many-through_vux5jm.jpg)

Tomar o exemplo de buscar *postagens* para um determinado *país* não é possível, pois não há relação direta entre países e postagens. Mas com a ajuda do modelo User, podemos configurar uma relação indireta entre países e postagens e isso é chamado de relacionamento `hasManyThrough`.

```js
// app/Model/Country.js

class Country extends Lucid {

  posts () {
    return this.hasManyThrough('App/Model/Post', 'App/Model/User')
  }

}
```

Agora, para buscar postagens para um determinado país, você precisa chamar o método `posts` no *modelo Country*.

```js
const country = yield Country.findBy('name', 'India')
const posts = yield country.posts().fetch()
response.json(posts)
```

O método `hasManyThrough` aceita opções fornecidas.

| Parâmetro         | Obrigatório | Valor Padrão                            |
|-------------------|-------------|-----------------------------------------|
| relatedModel      | Yes         | null                                    |
| throughModel      | Yes         | null                                    |
| primaryKey        | No          | Chave primária do modelo                |
| foreignKey        | No          | Chave estrangeira modelo                |
| throughPrimaryKey | No          | Chave primária do modelo relacionado    |
| throughForeignKey | No          | Chave estrangeira do modelo relacionado |

## Consultando relacionamentos
Consultar relacionamentos no banco de dados é tão direto e intuitivo com o Lucid. Você só precisa chamar métodos de relacionamento definidos sem se preocupar com as consultas *join*.

A consulta de relações também é dividida em três categorias amplas de *Lazy Loading*, *Eager Loading* e *Lazy Eager Loading*.

### Lazy Loading
Lazy loading é um processo de carregar relacionamentos após buscar o registro primário/pai do banco de dados

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

1. Primeiro, `encontramos` um usuário com a chave primária.
2. Então, chamamos o método `profile` definido anteriormente para buscar o perfil relacionado para o usuário fornecido.

#### Definindo Restrições de Consulta
Você também pode anexar métodos do construtor de consultas às suas definições de relacionamento, e o Lucid garantirá que eles sejam executados.

```js
class User extends Lucid {

  profile () {
    return this
      .hasOne('App/Model/Profile')
      .where('is_active', true) <1>
  }

}
```

1. Agora, quando você buscar o perfil relacionado para um determinado usuário, ele incluirá apenas o registro onde is_active=true.

#### Restrições de Consulta em Tempo de Execução
Você também pode definir restrições de consulta em tempo de execução, apenas encadeando os métodos do construtor de consultas.

```js
const user = yield User.find(1)
const profile = user
  .profile()
  .where('is_active', true)
  .fetch()
```

### Carregamento Ansioso
O carregamento lento pode criar *N+1* problemas em certos cenários. Por exemplo, carregar o perfil para dez usuários, um por um, totalizará *11* consultas. Para eliminar esse comportamento, você pode pré-carregar/carregar perfis com antecedência, o que resultará em um total de *2* consultas de banco de dados.

```js
const users = yield User
  .query()
  .with('profile') <1>
  .fetch()

console.log(users.toJSON())
```

```js
// Output

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

1. O método `with` pode ser usado para carregar relacionamentos com antecedência com o registro pai. Além disso, você pode carregar relacionamentos múltiplos/aninhados usando o método `with`.

#### Carregamento antecipado de múltiplas relações

```js
const users = yield User
  .query()
  .with('profile', 'friends')
  .fetch()
```

#### Carregamento antecipado de relações aninhadas

```js
const user = yield User
  .query()
  .with('friends.profile')
  .fetch()
```

#### Restrições de consulta em tempo de execução
Além disso, você pode desenvolver o construtor de consultas para filtrar os resultados dos modelos relacionados.

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

1. O método `scope` fornece acesso ao construtor de consultas do modelo relacionado, o que significa que você pode adicionar a cláusula `where` para filtrar os resultados.

### Carregamento ansioso lento
O carregamento ansioso lento é uma combinação de [Carregamento lento](#carregamento-preguiçoso) e [Carregamento-preguiçoso](#carregamento-eager) em vez de pré-carregar todos os relacionamentos, você busca a instância do modelo pai e então carrega ansiosamente todos os modelos relacionados.

```js
const user = yield User.find(1)
yield user.related('profile', 'friends').load()

console.log(user.toJSON())
```

```js
// Output

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

## Filtrando registros

> NOTA: Suportado pelo adonis-lucid 3.0.13 ou superior

Um caso de uso bastante comum é filtrar resultados de nível superior com base em algumas condições em um relacionamento. Por exemplo:

1. Exibir todos os usuários que contribuíram com pelo menos uma postagem.
2. Buscar todos os carros com 2 ou mais proprietários ao longo da vida.

O ideal é que isso exija algumas junções complexas, mas o Lucid torna isso muito mais fácil para você.

#### has(relation, [expression], [value])

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

#### whereHas(relation, callback, [expression], [value])

```js
const users = yield User.query().whereHas('posts', (builder) => {
  builder.where('is_published', true)
}).fetch()
```

Você também pode usar os métodos `doesntHave` e `whereDoesntHave`, que são o oposto dos métodos acima.

#### doesntHave(relation)

```js
const users = yield User.query().doesntHave('friends').fetch()
```

#### whereDoesntHave(relation, callback)

```js
const users = yield User.query().whereDoesntHave('friends', (builder) => {
  builder.where('is_verified', false)
}).fetch()
```

### Contagem de modelos relacionados
Obter contagens de relacionamentos é comumente usado por aplicativos da web. Por exemplo: *Obter contagem de comentários para cada postagem*.

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

## Inserir, Atualizar e Excluir
Relacionamentos também podem ser *criados*, *atualizados* e *excluídos* com a mesma facilidade de buscá-los. Considerando que cada tipo de relacionamento tem métodos ligeiramente diferentes para persistir dados relacionados.

#### save(modelInstance, [pivotValues])
O método `save` pode ser usado para criar/atualizar instâncias de modelo relacionadas. Ele funciona com as seguintes relações.

> NOTA: `pivotValues` são suportados apenas pelo relacionamento *belongsToMany*. Confira a documentação do método [attach](#attachrows-pivotvalues) sobre como os pivotValues ​​são definidos.

1. hasOne
2. hasMany
3. belongsToMany

```js
const user = yield User.find(1)

const profile = new Profile()
profile.name = '@cybernox'
profile.avatar =  '...'

yield user.profile().save(profile)
```

#### create(values, [pivotValues])
O método `create` é quase semelhante ao método `save`, onde você passa um objeto arbitrário em vez de passar uma instância de modelo.

```js
const user = yield User.find(1)

yield user
  .profile()
  .create({name: '@cybernox', avatar: '...'})
```

#### saveMany(arrayOfInstances)
Salve vários registros relacionados para uma determinada instância de modelo. `saveMany` funciona com os seguintes tipos de relação.

1. hasMany
2. belongsToMany

```js
const user = yield User.find(1)

const profile = new Profile({name: '@cybernox'})
const anotherProfile = new Profile({name: '@jgwhite'})

yield user.profile.saveMany([profile, anotherProfile])
```

#### createMany(arrayOfValues)
O método `createMany` também criará vários registros enquanto você passa uma matriz de objetos em vez de instâncias de modelo.

```js
const user = yield User.find(1)
const profiles = yield user
  .profile()
  .createMany([{name: '@cybernox'}, {name: 'jgwhite'}])
```

#### attach(rows, [pivotValues])
O método `attach` só funciona com o relacionamento *belongsToMany*. Você anexa registros existentes para formar um relacionamento.

```js
const student = yield Student.find(1)
const coursesIds = yield Courses.ids()

yield Student.courses().attach(coursesIds)
```

Opcionalmente, você pode passar um objeto para preencher campos dentro da *tabela dinâmica*.

```js
yield Student.courses().attach(coursesIds, {enrollment_confirmed: false})
```

Ou você também pode definir diferentes pivotValues ​​para cada linha relacionada.

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
O método `detach` é o oposto do [attach](#attachrows-pivotvalues) e removerá os relacionamentos da tabela dinâmica.

> OBSERVAÇÃO: O método `detach` não remove as linhas do modelo relacionado. Ele apenas remove o relacionamento da tabela dinâmica.
```js
const student = yield Student.find(1)
const coursesIds = yield Courses.ids()

yield Student.courses().detach(coursesIds)
```

#### sync(rows, [pivotValues])
O `sync` removerá todas as relações existentes e adicionará apenas as relações fornecidas. Pense nisso como chamar [detach](#detachrows) e [attach](#attachrows-pivotvalues) juntos.

> DICA: Você também pode passar *pivotValues* para o método sync similar ao método attach.

```js
const student = yield Student.find(1)
const coursesIds = yield Courses.ids()

yield Student.courses().sync(coursesIds)
```

#### updatePivot(values, [relatedModelId])
Para atualizar os valores dentro da tabela dinâmica, você pode usar o método `updatePivot`.

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
Ao buscar registros para *belongsToMany*, o lucid não selecionará nenhuma linha da tabela dinâmica. Para buscar campos adicionais, você pode usar o método `withPivot`.

> OBSERVAÇÃO: os campos da tabela dinâmica serão prefixados com `\_pivot_`. No exemplo abaixo, as marcas serão retornadas como `_pivot_marks`

```js
'use strict'

class Student extends Lucid {

  courses () {
    return this.belongsToMany('App/Model/Course').withPivot('marks')
  }

}
```

Você também pode definir campos ao executar a consulta de seleção.

```js
const student = yield Student.find(1)
const courses = yield student.courses().withPivot('marks').fetch()
```

#### associate(modelInstance)
O método `associate` é usado com o relacionamento *belongsTo* para associar uma linha de banco de dados existente.

```js
const user = yield User.find(1)
const profile = new Profile()
profile.name = '@cybernox'

profile.user().associate(user)
yield profile.save()
```

#### dissociate
O método `dissociate` é o oposto de [associate](#associatemodelinstance) e removerá o relacionamento existente

```js
const profile = yield Profile.find(1)

profile.user().dissociate()
yield profile.save()
```
