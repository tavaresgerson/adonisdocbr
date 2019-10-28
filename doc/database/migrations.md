# Migrations

As migrations são mutações documentadas do banco de dados, criadas ao longo do ciclo de vida de desenvolvimento do aplicativo, 
que você pode reverter ou executar novamente a qualquer momento.

As migrações facilitam o trabalho em equipe, permitindo que as alterações no esquema do banco de dados de um desenvolvedor sejam
rastreadas com facilidade e depois aplicadas por outros desenvolvedores em sua organização.

## Criando migrations

> Para usar migrações, o Provedor de Migrations deve primeiro ser registrado dentro da matriz `aceProviders` no arquivo 
> `start/app.js`.

Vamos criar uma tabela de usuários com a ajuda de migrations.

Primeiro, chame o comando adonis `make:migration` para criar um arquivo de esquema:

``` js
> adonis make:migration users
```

Quando solicitado, escolha a opção `create table` e pressione Enter:

Saída:
```
✔ create  database/migrations/1502691651527_users_schema.js
```

Seu novo arquivo de esquema (prefixado com o carimbo de data/hora atual) é criado no diretório `database/migrations`, pronto 
para modificar conforme necessário:

``` js
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

### Arquivos de esquema
Um arquivo de esquema requer dois métodos: upe down.

#### up()
O método `up` é usado para executar uma ação em uma tabela. Pode ser usado para criar uma nova tabela ou alterar uma tabela 
existente.

#### down()
O método `down` é usado para reverter as alterações aplicadas no método `up`. Quando `up` é usado para criar uma tabela, 
`down` seria usado para descartar essa tabela.

Atualize o arquivo de esquema que você acabou de criar com o seguinte código:

``` js
'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
```

O exemplo acima demonstra como criar/alterar uma tabela de banco de dados usando arquivos de esquema, encadeando diferentes métodos 
de tipo/modificador de coluna para definir as características dos atributos de campo individuais no método `up`.

## Tipos/modificadores de coluna

> Para obter a lista completa dos métodos de tipo e modificador de coluna de esquema, consulte a documentação da [API Knex](https://knexjs.org/#Schema-Building).

### Tipos de coluna

| Método                                                            | Descrição                                                                               |
|-------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| `table.bigInteger(name)`                                          | Adiciona uma coluna [bigint](https://knexjs.org/#Schema-bigInteger).                    |
| `table.binary(name, [length])`                                    | Adiciona uma coluna [binária](https://knexjs.org/#Schema-binary).                       |
| `table.boolean(name)`                                             | Adiciona uma coluna [booleana](https://knexjs.org/#Schema-boolean)                      |
| `table.date(name)`                                                | Adiciona uma coluna de [data](https://knexjs.org/#Schema-date)                          |
| `table.datetime(name, [precision])`                               | Adiciona uma coluna de [data e hora](https://knexjs.org/#Schema-datetime)               |
| `table.decimal(name, [precision], [scale])`                       | Adiciona uma coluna [decimal](https://knexjs.org/#Schema-decimal)                       |
| `table.enu(col, values, [options])`                               | Adiciona uma coluna de [enumeração](https://knexjs.org/#Schema-enum)                    |
| `table.float(name, [precision], [scale])`                         | Adiciona uma coluna [flutuante](https://knexjs.org/#Schema-float)                       |
| `table.increments(name)`                                          | Adiciona uma coluna de [incremento automático](https://knexjs.org/#Schema-increments)   |
| `table.integer(name)`                                             | Adiciona uma coluna [inteira](https://knexjs.org/#Schema-integer)                       |
| `table.json(name)`                                                | Adiciona uma coluna [json](https://knexjs.org/#Schema-json)                             |
| `table.string(name, [length=255])`                                | Adiciona uma coluna de [string](https://knexjs.org/#Schema-string)                      |
| `table.text(name, [textType])`                                    | Adiciona uma coluna de [texto](https://knexjs.org/#Schema-text)                         |
| `table.time(name, [precision])`                                   | Adiciona uma coluna de [tempo](https://knexjs.org/#Schema-time)                         |
| `table.timestamp(name, [useTz], [precision])`                     | Adiciona uma coluna de [carimbo de data/hora](https://knexjs.org/#Schema-timestamp)     |
| `table.timestamps([useTimestamps], [defaultToNow])`               | Adiciona colunas [criação/atualização](https://knexjs.org/#Schema-timestamps)           |
| `table.uuid(name)`                                                | Adiciona uma coluna [uuid](https://knexjs.org/#Schema-uuid)                             |

### Modificadores de coluna
| Método                                  | Descrição                                                         |
|-----------------------------------------|-------------------------------------------------------------------|
| `.after(field)`                         | Defina a coluna a ser inserida depois field .                     |
| `.alter()`                              | Marca a coluna como uma alteração / modificação .                 |
| `.collate(collation)`                   | Definir agrupamento de colunas (por exemplo utf8_unicode_ci).     |
| `.comment(value)`                       | Definir comentário da coluna                                      |
| `.defaultTo(value)`                     | Defina o valor padrão da coluna                                   |
| `.first()`                              | Defina a coluna a ser inserida na primeira posição                |
| `.index([indexName], [indexType])`      | Especifica a coluna como um índice                                |
| `.inTable(table)`                       | Definir tabela de chave estrangeira (cadeia depois .references)   |
| `.notNullable()`                        | Defina a coluna como não nula                                     |
| `.nullable()`                           | Defina a coluna como anulável                                     |
| `.primary([constraintName])`            | Defina a coluna como a chave primária de uma tabela.              |
| `.references(column)`                   | Definir coluna de chave estrangeira                               |
| `.unique()`                             | Definir coluna como única                                         |
| `.unsigned()`                           | Defina a coluna como não assinada (se inteiro).                   |

### Conexões Múltiplas
Os arquivos de esquema podem usar uma conexão diferente definindo um `connection` (verifique se existe uma conexão diferente 
dentro do arquivo `config/database.js`):

``` js
const Schema = use('Schema')

class UsersSchema extends Schema {
  static get connection () {
    return 'mysql'
  }

  // ...
}

module.exports = UsersSchema
```

> A tabela do banco de dados `adonis_schema` é sempre criada dentro do banco de dados de conexão padrão para gerenciar o 
> ciclo de vida das migrações (não há opção para substituí-lo).

## Executar migrações
Precisamos chamar o comando `migration:run` para executar as migrations (que executa o métdo `up` em todos os arquivos de migração 
pendentes):

```
> adonis migration:run
```

Resultado
```
migrate: 1502691651527_users_schema.js
Database migrated successfully in 117 ms
```

<img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1502694030/migration-status_zajqib.jpg" />

> O valor do **batch** existe como uma referência que você pode usar para limitar as reversões posteriormente.

É assim que as migrações funcionam sob o capô:

* A chamada `adonis migration:run` executa todos os arquivos de esquema pendentes e os atribui a um novo lote.
* Depois que um *batch* de arquivos de migração é executado, eles não são executados novamente.
* A chamada `adonis migration:rollback` reverte o último lote de migrações na ordem inversa.

> Não crie várias tabelas em um único arquivo de esquema. Em vez disso, crie um novo arquivo para cada alteração no banco de dados. 
> Dessa forma, você mantém seu banco de dados atômico e pode reverter para qualquer versão.

## Comandos de migração
Abaixo está a lista de comandos de migração disponíveis.

### Lista de comandos

| Comando                                             | Descrição                                                                             |
|-----------------------------------------------------|---------------------------------------------------------------------------------------|
| make:migration                                      | Crie um novo arquivo de migração.                                                     |
| migration:run                                       | Execute todas as migrações pendentes.                                                 |
| migration:rollback                                  | Reversão último conjunto de migrações.                                                |
| migration:refresh                                   | Retroceda todas as migrações para o batch `0` e execute-as novamente desde o início.  |
| migration:reset                                     | Retroceda todas as migrações para o batch `0`.                                        |
| migration:status                                    | Obtenha o status de todas as migrações.                                               |


### Comando Help
Para opções de comando detalhadas, anexe `--help` a cada comando de migração:

```
> adonis migration:run --help
```

Resultado
```
Usage:
  migration:run [options]

Options:
  -f, --force   Forcefully run migrations in production
  -s, --silent  Silent the migrations output
  --seed        Seed the database after migration finished
  --log         Log SQL queries instead of executing them

About:
  Run all pending migrations
```

## API da tabela de esquema
Abaixo está a lista de métodos de esquema disponíveis para interagir com as tabelas do banco de dados.

### create
Crie uma nova tabela de banco de dados:

```
up () {
  this.create('users', (table) => {
  })
}
```

### createIfNotExists
Cria uma nova tabela de banco de dados (somente se ela não existir):
``` js
up () {
  this.createIfNotExists('users', (table) => {
  })
}
```

### rename (de, para)
Renomeie uma tabela de banco de dados existente:

``` js
up () {
  this.rename('users', 'my_users')
}
```

### drop
Apaga uma tabela do banco de dados:

``` js
down() {
  this.drop('users')
}
```

### dropIfExists
Solte uma tabela de banco de dados (somente se existir):

``` js
down () {
  this.dropIfExists('users')
}
```

### alter
Selecione uma tabela de banco de dados para alteração:

``` js
up () {
  this.alter('users', (table) => {
    // adiciona novas colunas ou remove existentes
  })
}
```

### raw
Execute uma consulta SQL arbitrária:

``` js
up () {
  this
    .raw("SET sql_mode='TRADITIONAL'")
    .table('users', (table) => {
      table.dropColumn('name')
      table.string('first_name')
      table.string('last_name')
    })
}
```

### hasTable
Retorna se uma tabela existe ou não (este é um asyncmétodo):

``` js
async up () {
  const exists = await this.hasTable('users')

  if (!exists)  {
    this.create('up', (table) => {
    })
  }
}
```

## Extensões
Abaixo está a lista de métodos de extensão que você pode executar ao executar migrações.

> As extensões funcionam apenas com um banco de dados PostgreSQL.

### createExtension (extensionName)
Crie uma extensão de banco de dados:

``` js
class UserSchema {
  up () {
    this.createExtension('postgis')
  }
}
```

### createExtensionIfNotExists (extensionName)
Crie uma extensão de banco de dados (somente se não existir):

``` js
class UserSchema {
  up () {
    this.createExtensionIfNotExists('postgis')
  }
}
```

### dropExtension (extensioName)
Solte uma extensão de banco de dados:

``` js
class UserSchema {
  down () {
    this.dropExtension('postgis')
  }
}
```

### dropExtensionIfExists (extensionName)
Solte uma extensão de banco de dados (somente se existir):

``` js
class UserSchema {
  down () {
    this.dropExtensionIfExists('postgis')
  }
}
```

## Executando código arbitrário
Os comandos escritos dentro dos métodos `up` e `down` estão programados para serem executados posteriormente dentro de uma migração.

Se você precisar executar comandos arbitrários do banco de dados, envolva-os dentro da schedulefunção:

``` js
class UserSchema {
  up () {
    // cria uma nova tabela
    this.create('new_users', (table) => {
    })

    // copia os dados
    this.schedule(async (trx) => {
      const users = await Database.table('users').transacting(trx)
      await Database.table('new_users').transacting(trx).insert(users)
    })

    // apaga tabela antiga
    this.drop('users')
  }
}
```

O método `schedule` recebe um objeto de transação. É importante executar todos os comandos do banco de dados dentro da mesma 
transação, caso contrário, suas consultas serão interrompidas para sempre.

## API do construtor de esquema
A API do construtor de esquema usa a [API Knex](http://knexjs.org/#Schema-Building), portanto, leia sua documentação para obter 
mais informações.

### fn.now ()
O Knex possui um método chamado [knex.fn.now()](http://knexjs.org/#Schema-timestamp), usado para definir o carimbo de data/hora 
atual no campo do banco de dados.

No AdonisJs, você faz referência a este método como `this.fn.now()`:

``` js
up () {
  this.table('users', (table) => {
    table.timestamp('created_at').defaultTo(this.fn.now())
  })
}
```
