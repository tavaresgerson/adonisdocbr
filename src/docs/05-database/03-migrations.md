# Migrações

As Migrações de Banco de Dados é um processo de criação, alteração e exclusão de tabelas de banco de dados a partir do código, em vez de escrever consultas SQL. O AdonisJs oferece suporte integrado para migrações de banco de dados, permitindo que você configure as tabelas de banco de dados dentro da base de código da aplicação.

## Introdução

### Naive Way
A abordagem *naiva* de gerenciamento de banco de dados é criar as tabelas do SQL manualmente. Que funciona, mas não é ótimo, pois requer muito trabalho manual.

Vamos pegar um exemplo de um procedimento padrão para criar tabelas de banco de dados.

1. Faça login no SequelPro (ou semelhante) e crie tabelas de banco de dados.
2. Agora quando alguém quer trabalhar no mesmo aplicativo, você precisa compartilhar o esquema ou dump do banco de dados com eles.
3. Quando eles fazem alguma alteração no banco de dados, eles têm que compartilhar o novo dump do banco de dados com você novamente.
4. Você não pode executar testes automatizados no Travis CI (ou semelhante), pois você precisa acessar o servidor para criar as tabelas do banco de dados.
5. Finalmente, ao implantar o aplicativo em produção, você precisa fazer uma conexão remota com seu banco de dados do servidor para criar essas tabelas manualmente.

### Migrações
Com migrações o *esquema SQL* é parte do seu código base, ou seja, quando seus colegas de trabalho tiram o código de um repositório Git, eles também recebem o esquema de banco de dados junto com ele, e quaisquer alterações progressivas feitas por eles estarão disponíveis para você.

## Sobre Migrações

1. As migrações são armazenadas dentro da pasta "database/migrations".
2. Cada arquivo de esquema é uma classe ES2015 com dois métodos obrigatórios chamados "up" e "down".
3. O método `up` é executado quando as migrações estão sendo executadas.
4. O método `down` é chamado durante a reversão de migração.
5. As Migrações são executadas em lote e te dão a flexibilidade de reverter para um determinado lote.

## Exemplo básico
Agora que você sabe sobre os benefícios de migração, vamos dar uma olhada mais próxima em como criar tabelas de banco de dados SQL usando JavaScript.

```bash
./ace make:migration users --create=users
```

Saída:

```bash
create: database/migrations/1464437815620_users.js
```

```js
// .database/migrations/1464437815620_users.js

'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
```

## Executando Migrações
O comando "migration:run" é usado para executar todas as migrações armazenadas dentro do diretório "database/migrations". O AdonisJS irá de forma inteligente pular as migrações que já foram executadas e executará as novas.

```bash
./ace migration:run
```

É recomendado trabalhar com migrações incrementais, em vez de modificar o mesmo arquivo de esquema a cada vez. Por exemplo

1. Crie um novo arquivo de esquema quando quiser criar uma nova tabela.
2. A seguir, você percebeu que precisa de dois campos extras na mesma tabela. Crie um novo arquivo de esquema para alterar a tabela existente e adicionar esses dois novos campos.
3. Depois de alguns dias você tem uma necessidade de renomear um campo existente. Crie um novo arquivo de esquema para isso também.

As migrações incrementais ajudam você a rastrear as alterações como o controle de versão. Ao escrever código, é uma boa prática fazer pequenos commits de código, para que você tenha um histórico de código mais limpo. Você deve tratar suas migrações da mesma forma.

## Lista de Comandos
Abaixo está a lista de comandos ace específicos apenas para migrações.


| Comando | Opções | Propósito |
|---------|---------|---------|
| migration:run | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | Execute o método up de todos os arquivos de esquema para executar todas as migrações pendentes. |
| migration:rollback | [batch=last] | Rollback de migrações para um lote específico ou padrão para o último lote. |
| migração: atualização | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | Refrescar migrações ao cair e executar novamente todas as migrações |
| Migração: redefinir | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | Retornar ao estado inicial. |
| migration:status | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | Verifique o status atual das migrações. |

## Interagindo com tabelas

#### create(tableName, callback)
Crie uma nova tabela de banco de dados.

```js
class UserSchema {
  up () {
    this.create('users', (table) => {
      ...
    })
  }
}
```

#### createIfNotExists(nomeDaTabela, callback)
Cria a tabela somente se ela não existir, ignorando silenciosamente o comando *criar*.

```js
class UserSchema {
  up () {
    this.createIfNotExists('users', (table) => {
      ...
    })
  }
}
```

#### renomeie (de, para)
Renomear uma tabela existente do banco de dados.

```js
class UserSchema {
  up () {
    this.rename('users', 'my_users')
  }
}
```

#### drop(tableName)
Apague uma tabela existente do banco de dados.

```js
class UserSchema {
  down () {
    this.drop('users')
  }
}
```

#### dropIfExists(tableName)
Remover tabela de banco de dados apenas se ela existir, caso contrário, ignorar silenciosamente o comando *drop*.

```js
class UserSchema {
  down () {
    this.dropIfExists('users')
  }
}
```

#### tem(nomeDaTabela)
Resolvido com um *booleano* que indica se uma tabela de banco de dados existe ou não.

```js
class UserSchema {
  up () {
    this.has('users').then((exists) => {
      if (!exists) {
        // do something
      }
    })
  }
}
```

#### table(tableName, callback)
Selecione uma tabela para *alterar*.

```js
class UserSchema {
  up () {
    this.table('users', (table) => {
      table.dropColumn('deleted_at')
    })
  }
}
```

#### raw(statement)
Execute uma consulta SQL arbitrária na cadeia do construtor de esquemas.

```js
class UserSchema {
  up () {
    this.raw('SET sql_mode="TRADITIONAL"')
    .create('users', (table) => {
      table.increments()
    })
  }
}
```

#### db(fechamento)
O método `db` te dará acesso ao [construidor de consultas de banco de dados](/database/query-builder) dentro das suas migrações. É útil se você quiser migrar dados enquanto altera as tabelas do banco de dados.

```js
class UserSchema {
  up () {
    this.db(function * (database) {
      const names = yield database.from('users').pluck('name')
    })
  }
}
```

## Schema Builder
Por favor, consulte a documentação de [Construção de Esquema do Knex](http://knexjs.org/#Schema-Building), tudo do Knex é totalmente suportado. Abaixo está o exemplo usando o construtor de esquema para criar a tabela *usuários*.

```js
'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username').unique()
      table.string('email').unique()
      table.string('password', 60)
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
```
