# Migrações

Migrações de banco de dados é um processo de criar, alterar e remover tabelas de banco de dados do código, em vez de escrever consultas SQL. O AdonisJs tem suporte pronto para migrações de banco de dados para que você possa configurar suas tabelas de banco de dados dentro da base de código do aplicativo.

## Introdução

### Maneira ingênua
A abordagem *ingênua* do gerenciamento de banco de dados é criar as tabelas de banco de dados SQL manualmente. O que funciona, mas não é ótimo, pois requer muito retrabalho manual.

Vamos dar um exemplo de um procedimento padrão de criação de tabelas de banco de dados.

1. Faça login no SequelPro (ou similar) e crie tabelas de banco de dados.
2. Agora, quando alguém quiser trabalhar no mesmo aplicativo, você precisa compartilhar o esquema ou dump do banco de dados com ele.
3. Quando ele faz algumas alterações no banco de dados, ele precisa compartilhar novamente o novo dump do banco de dados com você.
4. Você não pode executar testes automatizados no TravisCI (ou similar), pois precisa de acesso ao servidor para criar as tabelas de banco de dados.
5. Finalmente, ao implantar o aplicativo em produção, você precisa fazer uma conexão remota com o banco de dados do seu servidor para criar essas tabelas manualmente.

### Migrações
Com migrações, o *esquema SQL* faz parte da sua base de código, o que significa que, uma vez que seus colegas de trabalho verificarem o código de um cliente git, eles obterão o esquema do banco de dados com ele, e quaisquer alterações progressivas feitas por eles estarão disponíveis para você.

## Sobre migrações

1. As migrações são armazenadas dentro da pasta `database/migrations`.
2. Cada arquivo de esquema é uma classe ES2015 com dois métodos necessários chamados `up` e `down`.
3. O método `up` é executado ao executar as migrações.
4. O método `down` é chamado durante a reversão das migrações.
5. As migrações são executadas em um lote e oferecem a flexibilidade de reverter para um determinado lote.

## Exemplo básico
Agora que você sabe sobre os benefícios das migrações, vamos dar uma olhada mais de perto em como criar tabelas de banco de dados SQL usando Javascript.

```bash
./ace make:migration users --create=users
```

```bash
# Output

create: database/migrations/1464437815620_users.js
```

```js
// database/migrations/1464437815620_users.js

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

## Executando migrações
O comando `migration:run` é usado para executar todas as migrações armazenadas dentro do diretório `database/migrations`. O AdonisJs ignorará de forma inteligente as migrações que já foram executadas e não executará as novas.

```bash
./ace migration:run
```

É recomendável trabalhar com migrações incrementais, em vez de modificar o mesmo arquivo de esquema todas as vezes. Por exemplo

1. Crie um novo arquivo de esquema quando quiser criar uma nova tabela.
2. Mais adiante, você percebeu que precisa de dois campos extras na mesma tabela. Crie um novo arquivo de esquema para alterar a tabela existente e adicionar esses dois novos campos.
3. Novamente, após alguns dias, você tem a necessidade de renomear um campo existente. Crie um novo arquivo de esquema para isso também.

Migrações incrementais ajudam você a rastrear mudanças como Controle de versão. Ao escrever código, é uma boa prática fazer pequenos commits de código, para que você tenha um histórico de código mais limpo. Você deve tratar suas migrações da mesma forma.

## Lista de comandos
Abaixo está a lista de comandos ace específicos apenas para migrações.

| Comando             | Opções        | Objetivo                                                                                      |
|---------------------|---------------|-----------------------------------------------------------------------------------------------|
| migration:run       | none          | Execute todas as migrações pendentes executando o método up de todos os arquivos de esquema.  |
| migration:rollback  | [batch=last]  | Reverta migrações para um determinado lote ou use o último lote como padrão.                  |
| migration:refresh   | none          | Atualize as migrações descartando e executando novamente todas as migrações                   |
| migration:reset     | none          | Reverter para o estado inicial.                                                               |
| migration:status    | none          | Verifique o status atual das migrações.                                                       |

## Interagindo com tabelas

#### create(tableName, callback)
Cria uma nova tabela de banco de dados.

```js
class UserSchema {
  up () {
    this.create('users', (table) => {
      ...
    })
  }
}
```

#### createIfNotExists(tableName, callback)
Cria a tabela somente se ela não existir, caso contrário ignora silenciosamente o comando *create*.

```js
class UserSchema {
  up () {
    this.createIfNotExists('users', (table) => {
      ...
    })
  }
}
```

#### rename(from, to)
Renomeia uma tabela de banco de dados existente.

```js
class UserSchema {
  up () {
    this.rename('users', 'my_users')
  }
}
```

#### drop(tableName)
Remove uma tabela de banco de dados existente.

```js
class UserSchema {
  down () {
    this.drop('users')
  }
}
```

#### dropIfExists(tableName)
Remove a tabela de banco de dados somente se ela existir, caso contrário ignora silenciosamente o comando *drop*.

```js
class UserSchema {
  down () {
    this.dropIfExists('users')
  }
}
```

#### has(tableName)
Resolve com um *booleano* indicando se uma tabela de banco de dados existe ou não.

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
Execute uma consulta SQL arbitrária na cadeia do construtor de esquema.

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

#### db(closure)
O método `db` dará a você acesso ao [Construtor de consulta de banco de dados](/markdown/05-database/02-query-builder.md#query-builder) dentro de suas migrações. É útil se você deseja migrar dados enquanto altera as tabelas de banco de dados.

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
Consulte a documentação do [Knex Schema Building](http://knexjs.org/#Schema-Building), tudo do knex é totalmente suportado. Abaixo está o exemplo usando o schema builder para criar a tabela *users*.

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
