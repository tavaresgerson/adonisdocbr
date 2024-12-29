# Migrações

Migrações são mutações documentadas de banco de dados, criadas ao longo do ciclo de vida de desenvolvimento do seu aplicativo, que você pode reverter ou executar novamente a qualquer momento.

As migrações facilitam o trabalho em equipe, permitindo que as alterações no esquema do banco de dados de um desenvolvedor sejam facilmente rastreadas e aplicadas por outros desenvolvedores em sua organização.

## Criando migrações

::: warning OBSERVAÇÃO
Para usar migrações, o [Provedor de migrações](/docs/07-Database/03-Migrations.md) deve primeiro ser registrado dentro do array `aceProviders` do arquivo `start/app.js`.
:::

Vamos criar uma tabela *users* com a ajuda de migrações.

Primeiro, chame o comando `adonis make:migration` para criar um arquivo de esquema:

```bash
adonis make:migration users
```

Quando solicitado, escolha a opção `Create table` e pressione kbd:[Enter]:

```bash
# .Output

✔ create  database/migrations/1502691651527_users_schema.js
```

Seu novo arquivo de esquema (prefixado com o timestamp atual) é criado no diretório `database/migrations`, pronto para modificar conforme necessário:

```js
// .database/migrations/...users_schema.js

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

## Arquivos de esquema

Um arquivo de esquema requer dois métodos: `up` e `down`.

### `up()`

O método `up` é usado para executar ações em uma tabela. Ele pode ser usado para criar uma nova tabela ou alterar uma tabela existente.

### `down()`

O método `down` é usado para reverter as alterações aplicadas no método `up`. Quando `up` é usado para criar uma tabela, `down` seria usado para remover essa tabela.

Atualize o arquivo de esquema [que você acabou de criar](#creating-migrations) com o seguinte código:

```js
// .database/migrations/...users_schema.js

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

O exemplo acima demonstra como criar/alterar uma tabela de banco de dados usando arquivos de esquema, encadeando diferentes [métodos de tipo/modificador](#column-typesmodifiers) de coluna para definir as características de atributos de campo individuais no método `up`.

## Tipos de coluna/modificadores

::: warning OBSERVAÇÃO
Para obter a lista completa de métodos de tipo e modificador de coluna de esquema, consulte a documentação da [API do Knex](https://knexjs.org/#Schema-Building).
:::

### Tipos de coluna

| Método                                              | Descrição                                                                       |
|-----------------------------------------------------|---------------------------------------------------------------------------------|
| `table.bigInteger(name)`                            | Adiciona uma coluna [bigint](https://knexjs.org/#Schema-bigInteger).            |
| `table.binary(name, [length])`                      | Adiciona uma coluna [binary](https://knexjs.org/#Schema-binary).                |
| `table.boolean(name)`                               | Adiciona uma coluna [boolean](https://knexjs.org/#Schema-boolean).              |
| `table.date(name)`                                  | Adiciona uma coluna [date](https://knexjs.org/#Schema-date).                    |
| `table.datetime(name, [precision])`                 | Adiciona uma coluna [datetime](https://knexjs.org/#Schema-datetime).            |
| `table.decimal(name, [precision], [scale])`         | Adiciona uma coluna [decimal](https://knexjs.org/#Schema-decimal).              |
| `table.enu(col, values, [options])`                 | Adiciona uma coluna [enum](https://knexjs.org/#Schema-enum).                    |
| `table.float(name, [precision], [scale])`           | Adiciona uma coluna [float](https://knexjs.org/#Schema-float).                  |
| `table.increments(name)`                            | Adiciona uma coluna [auto incrementing](https://knexjs.org/#Schema-increments). |
| `table.integer(name)`                               | Adiciona uma coluna [integer](https://knexjs.org/#Schema-integer).              |
| `table.json(name)`                                  | Adiciona uma coluna [json](https://knexjs.org/#Schema-json).                    |
| `table.string(name, [length=255])`                  | Adiciona uma coluna [string](https://knexjs.org/#Schema-string).                |
| `table.text(name, [textType])`                      | Adiciona uma coluna [text](https://knexjs.org/#Schema-text).                    |
| `table.time(name, [precision])`                     | Adiciona uma coluna [time](https://knexjs.org/#Schema-time).                    |
| `table.timestamp(name, [useTz], [precision])`       | Adiciona uma coluna [timestamp](https://knexjs.org/#Schema-timestamp).          |
| `table.timestamps([useTimestamps], [defaultToNow])` | Adiciona colunas [created/updated](https://knexjs.org/#Schema-timestamps).      |
| `table.uuid(name)`                                  | Adiciona uma coluna [uuid](https://knexjs.org/#Schema-uuid).                    |

### Modificadores de coluna

| Método                              | Descrição                                                                               |
|-------------------------------------|-------------------------------------------------------------------------------------------|
| `.after(field)`                     | Define a coluna a ser inserida [após](https://knexjs.org/#Schema-after) `field`.  |
| `.alter()`                          | Marca a coluna como uma [alter/modify](https://knexjs.org/#Schema-alter).  |
| `.collate(collation)`               | Define a coluna [collation](https://knexjs.org/#Chainable) (por exemplo, `utf8_unicode_ci`).  |
| `.comment(value)`                   | Define a coluna [comment](https://knexjs.org/#Schema-comment).  |
| `.defaultTo(value)`                 | Define a coluna [default value](https://knexjs.org/#Schema-defaultTo).  |
| `.first()`                          | Define a coluna a ser inserida na [primeira posição](https://knexjs.org/#Schema-first).  |
| `.index([indexName], [indexType])`  | Especifica a coluna como um [index](https://knexjs.org/#Chainable).  |
| `.inTable(table)`                   | Defina [tabela de chave estrangeira](https://knexjs.org/#Schema-inTable) (cadeia após `.references`).  |
| `.notNullable()`                    | Defina a coluna como [não nula](https://knexjs.org/#Schema-notNullable).  |
| `.nullable()`                       | Defina a coluna como [anulável](https://knexjs.org/#Schema-nullable).  |
| `.primary([constraintName])`        | Defina a coluna como a [chave primária](https://knexjs.org/#Schema-primary) para uma tabela.  |
| `.references(column)`               | Defina [coluna de chave estrangeira](https://knexjs.org/#Schema-references).  |
| `.unique()`                         | Defina a coluna como [única](https://knexjs.org/#Chainable).  |
| `.unsigned()`                       | Defina a coluna como [sem sinal](https://knexjs.org/#Schema-unsigned) (se for inteiro).  |

## Conexões Múltiplas
Arquivos de esquema podem usar uma conexão diferente definindo um getter `connection` (garanta que sua conexão diferente exista dentro do arquivo `config/database.js`):

```js
// .database/migrations/...users_schema.js

const Schema = use('Schema')

class UsersSchema extends Schema {
  static get connection () {
    return 'mysql'
  }

  // ...
}

module.exports = UsersSchema
```

::: info NOTA
A tabela de banco de dados `adonis_schema` é sempre criada dentro do banco de dados de conexão padrão para gerenciar o ciclo de vida das migrações (não há opção para substituí-la).
:::

## Executar migrações
Precisamos chamar o comando `migration:run` para executar migrações (que executa o método `up` em todos os arquivos de migração pendentes):

```bash
adonis migration:run
```

```bash
# .Output

migrate: 1502691651527_users_schema.js
Database migrated successfully in 117 ms
```

## Status da migração
Você pode verificar o status de todas as migrações executando o seguinte comando:

```bash
adonis migration:status
```

![imagem](/docs/assets/migration-status_zajqib.jpg)

::: tip DICA
O valor *batch* existe como uma referência que você pode usar para limitar reversões posteriormente.
:::

É assim que as migrações funcionam nos bastidores:

1. Chamar `adonis migration:run` executa todos os arquivos de esquema pendentes e os atribui a um novo lote.
2. Uma vez que um lote de arquivos de migração é executado, eles não são executados novamente.
3. Chamar `adonis migration:rollback` reverte o último lote de migrações na ordem inversa.

::: tip DICA
Não crie várias tabelas em um único arquivo de esquema. Em vez disso, crie um novo arquivo para cada alteração no banco de dados. Dessa forma, você mantém seu banco de dados atômico e pode reverter para qualquer versão.
:::

## Comandos de migração
Abaixo está a lista de comandos de migração disponíveis.

### Lista de comandos

| Comando               | Descrição                                                                     |
|-----------------------|-------------------------------------------------------------------------------|
| `make:migration`      | Crie um novo arquivo de migração.                                             |
| `migration:run`       | Execute todas as migrações pendentes.                                         |
| `migration:rollback`  | Reverta o último conjunto de migrações.                                       |
| `migration:refresh`   | Reverta todas as migrações para o lote `0` e execute-as novamente do início.  |
| `migration:reset`     | Reverta todas as migrações para o lote `0`.                                   |
| `migration:status`    | Obtenha o status de todas as migrações.                                       |

### Ajuda de comando
Para opções de comando detalhadas, anexe `--help` a cada comando de migração:

```bash
adonis migration:run --help
```

```bash
# Output

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

## API de tabela de esquema
Abaixo está a lista de métodos de esquema disponíveis para interagir com tabelas de banco de dados.

#### `create`
Cria uma nova tabela de banco de dados:

```js
up () {
  this.create('users', (table) => {
  })
}
```

#### `createIfNotExists`
Cria uma nova tabela de banco de dados (somente se ela não existir):

```js
up () {
  this.createIfNotExists('users', (table) => {
  })
}
```

#### `rename(from, to)`
Renomeia uma tabela de banco de dados existente:

```js
up () {
  this.rename('users', 'my_users')
}
```

#### `drop`
Remove uma tabela de banco de dados:

```js
down () {
  this.drop('users')
}
```

#### `dropIfExists`
Remove uma tabela de banco de dados (somente se ela existir):

```js
down () {
  this.dropIfExists('users')
}
```

#### `alter`
Seleciona uma tabela de banco de dados para alteração:

```js
up () {
  this.alter('users', (table) => {
    // add new columns or remove existing
  })
}
```

#### `raw`
Executa um SQL arbitrário consulta:

```js
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

#### `hasTable`
Retorna se uma tabela existe ou não (este é um método `async`):

```js
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

::: warning OBSERVAÇÃO
Extensões funcionam apenas com um banco de dados PostgreSQL.
:::

#### `createExtension(extensionName)`
Criar uma extensão de banco de dados:

```js
class UserSchema {
  up () {
    this.createExtension('postgis')
  }
}
```

#### `createExtensionIfNotExists(extensionName)`
Criar uma extensão de banco de dados (somente se não existir):

```js
class UserSchema {
  up () {
    this.createExtensionIfNotExists('postgis')
  }
}
```

#### `dropExtension(extensioName)`
Remover uma extensão de banco de dados:

```js
class UserSchema {
  down () {
    this.dropExtension('postgis')
  }
}
```

#### `dropExtensionIfExists(extensionName)`
Remover uma extensão de banco de dados (somente se existir):

```js
class UserSchema {
  down () {
    this.dropExtensionIfExists('postgis')
  }
}
```

## Executando código arbitrário
Os comandos escritos dentro dos métodos `up` e `down` são agendados para serem executados posteriormente dentro de uma migração.

Se você precisar executar comandos de banco de dados *arbitrários*, envolva-os dentro da função `schedule`:

```js
class UserSchema {
  up () {
    // create new table
    this.create('new_users', (table) => {
    })

    // copy data
    this.schedule(async (trx) => {
      const users = await Database.table('users').transacting(trx)
      await Database.table('new_users').transacting(trx).insert(users)
    })

    // drop old table
    this.drop('users')
  }
}
```

::: info NOTA
O método `schedule` recebe um *objeto de transação*. É importante executar todos os comandos de banco de dados dentro da mesma transação, caso contrário, suas consultas ficarão travadas para sempre.
:::

## Schema Builder API
A API do construtor de esquema usa a [API Knex](http://knexjs.org/#Schema-Building), então certifique-se de ler a documentação para mais informações.

#### `fn.now()`
O Knex tem um método chamado [knex.fn.now()](http://knexjs.org/#Schema-timestamp), que é usado para definir o carimbo de data/hora atual no campo do banco de dados.

No AdonisJs, você referencia esse método como `this.fn.now()`:

```js
up () {
  this.table('users', (table) => {
    table.timestamp('created_at').defaultTo(this.fn.now())
  })
}
```
