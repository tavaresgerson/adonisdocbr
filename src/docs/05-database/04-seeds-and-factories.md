# Sementes e Fábricas

As [Migrações](/database/migrations) ajudam a automatizar o processo de configuração do esquema de banco de dados. Banco de Dados *Sementes & Fábricas* ajuda a semear o banco de dados com dados falsos. Os dados falsos podem ser usados ao executar testes ou configurando o estado inicial de um aplicativo.

## Sobre as Sementes

1. As sementes são armazenadas dentro do diretório `database/seeds`.
Cada arquivo de semente é uma classe ES2015 e deve ter um método run.
3. Um único arquivo de semente pode ser usado para adicionar o falso para várias tabelas de banco de dados.
4. Faça uso do comando `db:seed` para executar todos os arquivos de semente do diretório `database/seeds`.

## Sobre Fábricas

1. O Factories ajuda a definir modelos de blueprint usando dados falsos.
Cada blueprint *callback* recebe uma instância de [chancejs](http://chancejs.com) para gerar dados aleatórios/fakes.
3. As fábricas podem ser usadas no arquivo de semente usando o provedor `use('Factory')`.
4. Você também pode usar fábricas ao escrever testes automatizados.

## Exemplo básico
Vamos começar com um exemplo de usar tanto *Fábricas* quanto *Sementes* para adicionar dados falsos à tabela "usuários".

```js
// .database/factory.js

const Factory = use('Factory')

Factory.blueprint('App/Model/User', (fake) => {
  return {
    username: fake.username(),
    email: fake.email(),
    password: fake.password(),
    firstName: fake.first(),
    lastName: fake.last()
  }
})
```

```js
// database/seeds/Database.js

'use strict'

const Factory = use('Factory')

class DatabaseSeeder {
  * run () {
    yield Factory.model('App/Model/User').create(5)
  }
}

module.exports = DatabaseSeeder
```

```bash
# Running The Seed Command

./ace db:seed
```

Começamos definindo um modelo para o usuário dentro do arquivo "database/factory.js". Cada método de blueprint deve retornar um objeto que defina os campos a serem inseridos na tabela do banco de dados usando o método *create* do modelo.

Como os blueprints da fábrica são definidos uma vez e usados em todos os lugares, precisamos importar o provedor de fábrica dentro do arquivo Database.js no diretório seeds/database e executar o método create passando o número de linhas (5) para ele.

## Métodos de Fábrica

### Quando usando o Lucid
Com modelos lúcidos, você pode usar os métodos abaixo para definir e usar os blueprints em sua aplicação.

#### blueprint(modelNamespace, callback)
NOTE: Certifique-se de que o modelo correspondente exista.

```js
Factory.blueprint('App/Model/User', (fake) => {
  return {
    username: fake.username()
  }
})
```

#### create([linhas=1])
O número de linhas para criar para um modelo dado.

```js
const users = yield Factory.model('App/Model/User').create(5)
```

#### fazer([quantidade=1])
O método 'make' retornará a instância do modelo com dados falsos como atributos. Você pode alterar o 'count' para obter um array de múltiplas instâncias.

```js
const User = use('App/Model/User') <1>
const user = yield User.find(1) <2>

const post = Factory.model('App/Model/Post').make() <3>
yield user.posts().create(post) <4>
```

1. Importando modelo de usuário.
2. Encontrar um usuário único pelo ID.
3. Criando uma instância do modelo 'Post' com dados fictícios.
4. Salvando o post para um usuário específico usando a relação.

#### each(callback)
O método `each` ajuda você em executar um loop assíncrono sobre as instâncias criadas de um modelo. É útil quando você deseja salvar relacionamentos para cada instância criada.

```js
const users = yield Factory.model('App/Model/User').create(5)

users.each(function * (user) {
  const post = Factory.model('App/Model/Post').make()
  yield user.posts().save(post);
})
```

#### resetar
Apagar dados de uma tabela para um modelo específico

```js
yield Factory.model('App/Model/User').reset()
```

### Ao usar o provedor de banco de dados

#### blueprint(tableName, callback)

```js
Factory.blueprint('users', (fake) => {
  return {
    username: fake.username(),
    email: fake.email(),
    password: fake.password()
  }
})
```

#### create([linhas=1])
O método criar funciona da mesma forma que o xref:_create_rows_1[Método de criação do Lucid Blueprint]

```js
yield Factory.get('users').create(5)
```

#### table(nomeDaTabela)
O método `table` ajuda você a alternar o nome da tabela para um determinado blueprint em tempo de execução.

```js
yield Factory.get('users').table('my_users').create(5)
```

#### retornando(coluna)
Definindo retorno de coluna para *PostgreSQL*.

```js
yield Factory.get('users').returning('id').create(5)
```

#### resetar
Apagar tabela de banco de dados.

```js
yield Factory.get('users').reset()
```

## Gerando Dados Falsos
O objeto 'fake' passado para o método [Factory.blueprint] é uma instância de [chance.js](http://chancejs.com).

Todos os métodos do chancejs são suportados pelo adonisjs, enquanto o adonisjs também adiciona um monte de novos métodos em cima dele.

#### username([comprimento=5])
Retorna um nome de usuário aleatório com o comprimento definido.

```js
Factory.blueprint('App/Model/User', (fake) => {
  return {
    username: fake.username()
  }
})
```

#### senha([comprimento=20])
Retorna uma senha aleatória.

```js
Factory.blueprint('App/Model/User', (fake) => {
  return {
    password: fake.password()
  }
})
```

## Hashing de senha
O provedor de autenticação utiliza o provedor de hash ao verificar a senha do usuário. Certifique-se de que você está hashando as senhas antes de salvá-las no banco de dados.

O melhor lugar para hashear a senha é dentro de um gancho `beforeCreate`. Você pode aprender sobre ganchos [aqui](/lucid/hooks).

```bash
# Generating A Hook

./ace make:hook User
```

```js
// Model/Hooks/User.js

'use strict'
const Hash = use('Hash')

const User = exports = module.exports = {}

User.encryptPassword = function * (next) {
  this.password = yield Hash.make(this.password)
  yield next
}
```

```js
// Registering Hook To The Model

'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.encryptPassword')
  }
}
```
