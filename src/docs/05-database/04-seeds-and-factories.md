# Seeds e Factories

Como [Migrations](/docs/05-database/03-migrations.md) ajuda você a automatizar o processo de configuração do esquema do banco de dados. O Database *Seeds & Factories* ajuda a semear o banco de dados com dados fictícios. Dados fictícios podem ser usados ​​durante a execução de testes ou configuração do estado inicial de um aplicativo.

## Sobre Seeds

1. As sementes são armazenadas dentro do diretório `database/seeds`.
2. Cada arquivo seed é uma classe *ES2015* e deve ter um método `run`.
3. Um único arquivo seed pode ser usado para adicionar o dummy para várias tabelas de banco de dados.
4. Use o comando `db:seed` para executar todos os arquivos seed do diretório `database/seeds`.

## Sobre Factories

1. Factories ajuda você a definir blueprints de modelo usando dados falsos.
2. Cada *callback* do blueprint recebe uma instância de [chancejs](http://chancejs.com) para gerar dados aleatórios/falsos.
3. As fábricas podem ser usadas dentro do arquivo seed usando o provedor `use('Factory')`.
4. Você também pode usar fábricas ao escrever testes automatizados.

## Exemplo básico
Vamos começar com um exemplo de uso de *Factories* e *Seeds* para adicionar dados fictícios à tabela `users`.

```js
// database/factory.js

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
# Executando o comando Seed

./ace db:seed
```

Começamos definindo um blueprint para o modelo `User` dentro do arquivo `database/factory.js`. Cada método blueprint deve retornar um objeto definindo os campos a serem inseridos na tabela do banco de dados usando o método *Model create*.

Como os blueprints de factories são definidos uma vez e usados ​​em todos os lugares, precisamos importar o provedor `Factory` dentro do arquivo `database/seeds/Database.js` e executar o método `create` passando o número de rows(5) para ele.

## Métodos Factory

### Ao usar o Lucid
Com os modelos lucid, você pode usar os métodos abaixo para definir e usar blueprints em seu aplicativo.

#### `blueprint(modelNamespace, callback)`

::: warning OBSERVAÇÃO
Certifique-se de que o modelo correspondente exista.
:::

```js
Factory.blueprint('App/Model/User', (fake) => {
  return {
    username: fake.username()
  }
})
```

#### `create([rows=1])`
O número de linhas a serem criadas para um determinado modelo.

```js
const users = yield Factory.model('App/Model/User').create(5)
```

#### `make([count=1])`
O método `make` retornará a instância do modelo com dados falsos como atributos. Você pode alterar o `count` para obter uma matriz de várias instâncias.

```js
const User = use('App/Model/User') <1>
const user = yield User.find(1) <2>

const post = Factory.model('App/Model/Post').make() <3>
yield user.posts().create(post) <4>
```

1. Importando o modelo do usuário.
2. Encontre um único usuário usando o id.
3. Criando uma instância do modelo `Post` com dados fictícios.
4. Salvando o post para um determinado usuário usando o relacionamento.

#### `each(callback)`
O método `each` ajuda você a executar um loop assíncrono sobre instâncias criadas de um modelo. É útil quando você deseja salvar o relacionamento para cada instância criada.

```js
const users = yield Factory.model('App/Model/User').create(5)

users.each(function * (user) {
  const post = Factory.model('App/Model/Post').make()
  yield user.posts().save(post);
})
```

#### `reset`
Truncar a tabela para um determinado modelo

```js
yield Factory.model('App/Model/User').reset()
```

### Ao usar o provedor de banco de dados

#### `blueprint(tableName, callback)`

```js
Factory.blueprint('users', (fake) => {
  return {
    username: fake.username(),
    email: fake.email(),
    password: fake.password()
  }
})
```

#### `create([rows=1])`
Os métodos create funcionam da mesma forma que o xref:_create_rows_1[método Lucid blueprint create]

```js
yield Factory.get('users').create(5)
```

#### `table(tableName)`
O método `table` ajuda você a alternar o nome da tabela para um determinado blueprint em tempo de execução.

```js
yield Factory.get('users').table('my_users').create(5)
```

#### `returns(column)`
Definindo coluna de retorno para *PostgreSQL*.

```js
yield Factory.get('users').returning('id').create(5)
```

#### `reset`
Truncar tabela de banco de dados.

```js
yield Factory.get('users').reset()
```

## Gerando dados falsos
O objeto `fake` passado para o método [Factory.blueprint](#factoryblueprintappmodeluser-fake--return-password-fakepassword) é uma instância de [chance.js](http://chancejs.com).

Todos os métodos do chancejs são suportados pelo AdonisJs, enquanto o AdonisJs também adiciona vários métodos novos sobre ele.

#### `username([length=5])`
Retorna um nome de usuário aleatório com o comprimento definido.

```js
Factory.blueprint('App/Model/User', (fake) => {
  return {
    username: fake.username()
  }
})
```

#### `password([length=20])`
Retorna uma senha aleatória.

```js
Factory.blueprint('App/Model/User', (fake) => {
  return {
    password: fake.password()
  }
})
```

## Hash de senha
O provedor [Authentication](/docs/07-common-web-tools/02-authentication.md) faz uso de outro provedor [Hash](/docs/09-security/04-encryption-and-hashing.md) ao verificar a senha do usuário. Certifique-se de que você está fazendo hash de suas senhas antes de salvá-las no banco de dados.

O melhor lugar para fazer hash da senha é dentro de um hook `beforeCreate` do modelo. Você pode aprender sobre hooks [aqui](/docs/06-lucid/03-hooks.md).

```bash
# Gerando um gancho

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
// Registrando Hook para o modelo

'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.encryptPassword')
  }
}
```
