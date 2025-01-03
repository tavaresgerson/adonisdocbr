# Table builder

O table builder permite que você **crie**, **remova** ou **renomeie** colunas em uma tabela de banco de dados selecionada.

Você obtém acesso à instância do table builder chamando um dos seguintes métodos do schema builder.

```ts {3-9}
class UserSchema extends BaseSchema {
  public up() {
    this.schema.createTable('users', (table) => {
      console.log(table) // 👈 Table builder
    })

    this.schema.table('users', (table) => {
      console.log(table) // 👈 Table builder
    })
  }
}
```

## Métodos/Propriedades
A seguir está a lista de métodos/propriedades disponíveis na classe table builder.

### `dropColumn`
Remova uma coluna pelo seu nome.

```ts
this.schema.table('users', (table) => {
  table.dropColumn('name')
})
```

### `dropColumns`
Remova mais de uma coluna fornecendo vários argumentos.

```ts
this.schema.table('users', (table) => {
  table.dropColumns('first_name', 'last_name')
})
```

### `renameColumn`
Renomeie uma coluna. O método aceita o nome da coluna existente como o primeiro argumento e o novo nome como o segundo argumento.

```ts
this.schema.table('users', (table) => {
  table.renameColumn('name', 'full_name')
})
```

### `increments`

Adiciona uma coluna de incremento automático. A coluna também é marcada como a chave primária, a menos que seja desabilitada explicitamente.

- No PostgreSQL, a coluna tem o tipo de dados `serial`.
- No Amazon Redshift, é um `integer indentity (1,1)`.

```ts
this.schema.createTable('users', (table) => {
  table.increments('id')
})
```

Defina uma coluna de incremento, mas não a marque como a chave primária.

```ts
this.schema.createTable('users', (table) => {
  table.increments('other_id', { primaryKey: false })
})
```

### `integer`

Adicione uma coluna de inteiro.

```ts
this.schema.createTable('users', (table) => {
  table.integer('visits')
})
```

### `bigInteger`
Adiciona uma coluna `bigint` no MYSQL e PostgreSQL. Para todos os outros drivers de banco de dados, o padrão é um inteiro normal.

::: info NOTA
Os valores da coluna BigInt são retornados como uma string nos resultados da consulta.
:::

```ts
this.schema.createTable('users', (table) => {
  table.bigInteger('visits')
})
```

### `text`

Adiciona uma coluna de texto ao banco de dados. Você pode definir opcionalmente o tipo de dados de texto como `mediumtext` ou `longtext`. O tipo de dados é ignorado se o driver subjacente não for MySQL.

```ts
this.schema.createTable('posts', (table) => {
  table.text('content_markdown', 'longtext')
})
```

### `string`

Adiciona uma coluna de string com um comprimento opcional. O comprimento padrão é `255`, se não for especificado.

```ts
this.schema.createTable('posts', (table) => {
  table.string('title')

  // Comprimento explícito
  table.string('title', 100)
})
```

### `float`

Adiciona uma coluna float, com **precisão opcional (padrão 8)** e **escala (padrão 2)**.

```ts
this.schema.createTable('products', (table) => {
  table.float('price')

  /**
   * Precisão e escala explícitas
   */
  table.float('price', 8, 2)
})
```

### `decimal`

Adiciona uma coluna decimal, com **precisão opcional (padrão 8)** e **escala (padrão 2)**.

Especificar `null` como precisão cria uma coluna decimal que pode armazenar números de precisão e escala. (Suportado apenas para Oracle, SQLite, Postgres)

```ts
this.schema.createTable('products', (table) => {
  table.decimal('price')

  /**
   * Precisão e escala explícitas
   */
  table.decimal('price', 8, 2)
})
```

### `boolean`

Adiciona uma coluna booleana. Muitos bancos de dados representam `true` e `false` como `1` e `0` e retornam o mesmo valor durante consultas SQL.

```ts
this.schema.createTable('posts', (table) => {
  table.boolean('is_published')
})
```

### `date`
Adiciona uma coluna de data à tabela do banco de dados.

```ts
this.schema.createTable('users', (table) => {
  table.date('dob')
})
```

### `dateTime`
Adiciona uma coluna DateTime à tabela do banco de dados. O método aceita o nome da coluna como o primeiro argumento, juntamente com o objeto de opções para configurar a `precisão` e usar o tipo de dados `timestampz`.

- Você pode habilitar/desabilitar o tipo de dados `timestampz` para PostgreSQL. Ele é habilitado por padrão.
- Você pode definir a precisão da coluna para **MySQL 5.6+**.

```ts
this.schema.createTable('users', (table) => {
  table
    .dateTime('some_time', { useTz: true })
    .defaultTo(this.now())

  // Ou defina a precisão
  table
    .dateTime('some_time', { precision: 6 })
    .defaultTo(this.now(6))
})
```

### `time`
Adiciona uma coluna de tempo com precisão opcional para MySQL. Não é compatível com Amazon Redshift.

```ts
this.schema.createTable('users', (table) => {
  table.time('some_time', { precision: 6 })
})
```

### `timestamp`
Adiciona uma coluna de registro de data e hora à tabela do banco de dados. O método aceita o nome da coluna como o primeiro argumento, juntamente com o objeto de opções para configurar a `precisão` e usar o tipo de dados `timestampz`.

- Você pode habilitar/desabilitar o tipo de dados `timestampz` para PostgreSQL. Ele é habilitado por padrão.
- Definir `useTz = true` usará o tipo de dados `DATETIME2` para MSSQL. Ele é desabilitado por padrão.
- Você pode definir a precisão da coluna para **MySQL 5.6+**.

```ts
this.schema.createTable('users', (table) => {
  table.timestamp('created_at')

  // Habilite timestampz e DATETIME2 para MSSQL
  table.timestamp('created_at', { useTz: true })

  // Use precisão com MySQL
  table.timestamp('created_at', { precision: 6 })
})
```

### `timestamps`
Adiciona colunas `created_at` e `updated_at` à tabela do banco de dados.

::: warning ATENÇÃO
Como o AdonisJS usa o Knex.js por baixo dos panos, o recurso de preenchimento automático do seu editor listará o método `timestamps` na lista de métodos disponíveis.

No entanto, recomendamos não usar esse método e, em vez disso, usar o método `timestamp` pelos seguintes motivos.

- O método `timestamps` não é encadeável. O que significa que você não pode adicionar restrições adicionais como `index` ou `nullable` à coluna.
- Você pode criar colunas do tipo `timestampz` ou `Datetime2`.
:::

```ts
this.schema.createTable('users', (table) => {
  table.timestamps()
})
```

Por padrão, o método `timestamps` cria uma coluna **DATETIME**. No entanto, você pode alterá-la para uma coluna **TIMESTAMP** passando `true` como o primeiro argumento.

```ts
this.schema.createTable('users', (table) => {
  /**
   * Cria coluna de timestamp
   */
  table.timestamps(true)
})
```

```ts
this.schema.createTable('users', (table) => {
  /**
   * Cria coluna de timestamp
   * +
   * Defina o valor padrão para "CURRENT_TIMESTAMP"
   */
  table.timestamps(true, true)
})
```

### `binary`
Adiciona uma coluna binária. O método aceita o nome da coluna como o primeiro argumento, com um comprimento opcional como o segundo argumento (aplicável somente para MySQL).

```ts
this.schema.createTable('users', (table) => {
  table.binary('binary_column')
})
```

### `enum` / `enu`

Adiciona uma coluna enum ao banco de dados. O método aceita o nome da coluna como o primeiro argumento, uma matriz de opções enum como o segundo argumento e um objeto opcional de opções como o terceiro argumento.

- No PostgreSQL, você pode usar o tipo enum nativo definindo o valor `options.useNative` como true. Além disso, certifique-se de fornecer um nome enum exclusivo via `options.enumName`.
- No PostgreSQL, criaremos o enum antes da coluna. Se o tipo enum já existir, você deverá definir `options.existingType` como true.
- No Amazon Redshift, o tipo de dados varchar(255) não verificado é usado.

```ts
this.schema.createTable('users', (table) => {
  table.enu('account_status', ['PENDING', 'ACTIVE', 'SUSPENDED'], {
    useNative: true,
    enumName: 'user_account_status',
    existingType: false,
  })
})
```

Você também pode especificar o esquema PostgreSQL para o tipo enum.

```ts
table.enu('account_status', ['PENDING', 'ACTIVE', 'SUSPENDED'], {
    useNative: true,
    enumName: 'user_account_status',
    existingType: false,
    schemaName: 'public' // 👈
  })
```

Certifique-se de remover o enum ao remover a tabela.

```ts
this.schema.raw('DROP TYPE IF EXISTS "user_account_status"')
this.schema.dropTable('users')
```

### `json`
Adiciona uma coluna JSON, usando o tipo JSON integrado no **PostgreSQL**, **MySQL** e **SQLite**, assumindo como padrão uma coluna de texto em versões mais antigas ou em bancos de dados não suportados.

```ts
this.schema.createTable('projects', (table) => {
  table.json('settings')
})
```

### `jsonb`
O mesmo que o método `json`, mas usa o tipo de dados `jsonb` nativo (se possível).

```ts
this.schema.createTable('projects', (table) => {
  table.jsonb('settings')
})
```

### `uuid`
Adiciona uma coluna UUID. O método aceita o nome da coluna como o único argumento.

- Usa o tipo UUID integrado no PostgreSQL
- Usa `char(36)` para todos os outros bancos de dados

```ts
this.schema.createTable('users', (table) => {
  table.uuid('user_id')
})
```

Certifique-se também de criar a extensão UUID para o PostgreSQL. Você também pode fazer isso dentro de um arquivo de migração dedicado da seguinte forma:

```ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SetupExtensions extends BaseSchema {
  public up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  }

  public down() {
    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
  }
}
```

### `comment`
Define o comentário para a tabela. Aceita o valor do comentário como o único argumento.

```ts
this.schema.createTable('users', (table) => {
  table.comment('Manages the app users')
})
```

### `engine`

Define o mecanismo para a tabela do banco de dados. O método aceita o nome do mecanismo como o único argumento.

- O método só está disponível em uma chamada `createTable`.
- O mecanismo é aplicável apenas ao **MySQL** e ignorado para outros bancos de dados.

```ts
this.schema.createTable('users', (table) => {
  table.engine('MyISAM')
})
```

### `charset`

Define o conjunto de caracteres para a tabela do banco de dados. O método aceita o valor charset como o único argumento.

- O método só está disponível em uma chamada `createTable`.
- O charset só é aplicável ao **MySQL** e ignorado para outros bancos de dados.

```ts
this.schema.createTable('users', (table) => {
  table.charset('utf8')
})
```

### `collate`

Define a ordenação para a tabela do banco de dados. O método aceita o valor da ordenação como o único argumento.

- O método só está disponível em uma chamada `createTable`.
- A ordenação é aplicável apenas ao **MySQL** e ignorada para outros bancos de dados.

```ts
this.schema.createTable('users', (table) => {
  table.collate('utf8_unicode_ci')
})
```

### `inherits`
Define a tabela pai para herança. O método aceita o nome da tabela pai como o único argumento.

- O método só está disponível em uma chamada `createTable`.
- `inherits` é aplicável apenas ao **PostgreSQL** e ignorado para outros bancos de dados.

```ts
this.schema.createTable('capitals', (table) => {
  table.inherits('cities')
})
```

### `specificType`
Cria uma coluna definindo seu tipo como uma string bruta. O método permite que você crie uma coluna de banco de dados, que não é coberta pela API padrão do construtor de tabelas.

O primeiro argumento é o nome da coluna, e o segundo argumento é o tipo de coluna.

```ts
this.schema.createTable('users', (table) => {
  table.specificType('mac_address', 'macaddr')
})
```

### `index`
Adiciona um índice a uma tabela sobre as colunas fornecidas. Você deve criar a tabela antes de definir o índice.

- O método aceita uma matriz de colunas como o primeiro argumento.
- Um nome de índice opcional como o segundo argumento
- E um tipo de índice opcional como o terceiro argumento. O tipo de índice é aplicável apenas para bancos de dados PostgreSQL e MySQL.

```ts
this.schema.alterTable('users', (table) => {
  table.index(['first_name', 'last_name'], 'user_name_index')
})
```

### `dropIndex`

Remove um índice existente das colunas da tabela. O método aceita colunas como o primeiro argumento e um nome de índice opcional como o segundo argumento.

```ts
this.schema.alterTable('users', (table) => {
  table.dropIndex(['first_name', 'last_name'], 'user_name_index')
})
```

### `unique`

Adiciona um índice exclusivo a uma tabela sobre as colunas fornecidas. Um nome de índice padrão usando as colunas é usado, a menos que `indexName` seja especificado.

```ts
this.schema.alterTable('posts', (table) => {
  table.unique(['slug', 'tenant_id'])
})
```

### `foreign`

Adiciona uma restrição de chave estrangeira a uma tabela para colunas existentes. Certifique-se de que a tabela já exista ao usar o método `foreign`.

- Os métodos um ou mais nomes de coluna como o primeiro argumento.
- Você pode definir um `foreignKeyName` personalizado como o segundo argumento. Se não for especificado, os nomes das colunas serão usados ​​para gerá-lo.

```ts
this.schema.alterTable('posts', (table) => {
  table.foreign('user_id').references('users.id')
})
```

Você também pode encadear os métodos `onDelete` e `onUpdate` para definir os gatilhos.

```ts
table
  .foreign('user_id')
  .references('users.id')
  .onDelete('CASCADE')
```

### `dropForeign`
Remove uma restrição de chave estrangeira preexistente. O método aceita uma ou mais colunas como o primeiro argumento e um nome de chave estrangeira opcional como o segundo argumento.

```ts
this.schema.alterTable('posts', (table) => {
  table.dropForeign('user_id')
})
```

### `dropUnique`
Remove um índice exclusivo preexistente. O método aceita uma matriz de string(s) representando nomes de colunas como o primeiro argumento e um nome de índice opcional como o segundo argumento.

```ts
this.schema.alterTable('posts', (table) => {
  table.dropUnique(['email'])
})
```

### `dropPrimary`
Remove uma restrição de chave primária preexistente. O método aceita um nome de restrição opcional (o padrão é `tablename_pkey`).

```ts
this.schema.alterTable('posts', (table) => {
  table.dropPrimary()
})
```

### `setNullable`
Define a coluna para ser anulável.

```ts
this.schema.alterTable('posts', (table) => {
  table.setNullable('full_name')
})
```

### `dropNullable`
Remove a restrição anulável da coluna.

::: warning ATENÇÃO
A operação falhará quando a coluna já tiver valores nulos.
:::

```ts
this.schema.alterTable('posts', (table) => {
  table.dropNullable('full_name')
})
```

## Métodos encadeáveis

A seguir está a lista de métodos que você pode encadear nos métodos de construção de esquema como modificadores da coluna.

### `alter`

Marca a coluna como um alters/modify em vez do add padrão. O método não é suportado pelos drivers SQLite ou Amazon Redshift.

::: info NOTA
A instrução alter não é incremental. Você deve redefinir as restrições que deseja aplicar à coluna.
:::

```ts
this.schema.alterTable('posts', (table) => {
  // elimina a restrição NOT NULL e o valor padrão (se aplicado anteriormente)
  table.integer('age').alter()
})
```

### `index`

Defina um índice para a coluna atual. O método aceita os dois argumentos opcionais a seguir.

- Um nome de índice opcional como o primeiro argumento.
- E um tipo de índice opcional como o segundo argumento. O tipo de índice é aplicável somente para bancos de dados PostgreSQL e MySQL.

```ts
this.schema.table('posts', (table) => {
  table.string('slug').index('posts_slug')
})
```

### `primary`

Marque a coluna atual como a chave primária. Opcionalmente, você pode definir o nome da restrição como o primeiro argumento.

No Amazon Redshift, todas as colunas incluídas em uma chave primária não devem ser anuláveis.

```ts
this.schema.table('posts', (table) => {
  table.integer('id').primary()
})
```

Se você quiser definir uma chave primária composta, deverá usar o método `table.primary`.

```ts
this.schema.table('posts', (table) => {
  table.primary(['slug', 'tenant_id'])
})
```

### `unique`
Marque a coluna atual como exclusiva. No Amazon Redshift, essa restrição não é imposta, mas o planejador de consultas a usa.

```ts
this.schema.table('users', (table) => {
  table.string('email').unique()
})
```

### `references`
Defina a coluna que a coluna atual referencia como uma chave estrangeira.

```ts
this.schema.table('posts', (table) => {
  table.integer('user_id').references('id').inTable('users')
})
```

Você também pode definir `tableName.columnName` junto e remover o método `inTable` completamente.

```ts
this.schema.table('posts', (table) => {
  table.integer('user_id').references('users.id')
})
```

### `inTable`
Defina a tabela para a coluna referenciada pela chave estrangeira.

```ts
this.schema.table('posts', (table) => {
  table.integer('user_id').references('id').inTable('users')
})
```

### `onDelete`
Defina o comando `onDelete` para a chave estrangeira. O comando é expresso como um valor de string.

```ts
this.schema.table('posts', (table) => {
  table
    .integer('user_id')
    .references('id')
    .inTable('users')
    .onDelete('CASCADE')
})
```

### `onUpdate`
Defina o comando `onUpdate` para a chave estrangeira. O comando é expresso como um valor de string.

```ts
this.schema.table('posts', (table) => {
  table
    .integer('user_id')
    .references('id')
    .inTable('users')
    .onUpdate('RESTRICT')
})
```

### `defaultTo`
Defina o valor padrão para a coluna a ser usada durante a inserção.

No MSSQL, uma opção constraintName pode ser passada para garantir um nome de restrição específico:

```ts
this.schema.table('posts', (table) => {
  table.boolean('is_published').defaultTo(false)
  
  // Para MSSQL
  table
    .boolean('is_published')
    .defaultTo(false, { constraintName: 'df_table_value' })
})
```

### `unsigned`
Marque a coluna atual como não assinada.

```ts
this.schema.table('posts', (table) => {
  table
    .integer('user_id')
    .unsigned() // 👈
    .references('id')
    .inTable('users')
})
```

### `notNullable`
Marque a coluna atual como NÃO anulável.

::: info NOTA
Considere usar o método [dropNullable](#dropnullable) ao alterar a coluna.
:::

```ts
this.schema.table('users', (table) => {
  table.integer('email').notNullable()
})
```

### `nullable`
Marque a coluna atual como anulável.

::: info NOTA
Considere usar o método [setNullable](#setnullable) ao alterar a coluna.
:::

```ts
this.schema.table('users', (table) => {
  table.text('bio').nullable()
})
```

### `first`
Define a coluna a ser inserida na primeira posição, usada somente em tabelas de alteração do MySQL.

```ts
this.schema.alterTable('users', (table) => {
  table.string('email').first()
})
```

### `after`
Define a coluna a ser inserida após a outra, usada somente em tabelas de alteração do MySQL.

```ts
this.schema.alterTable('users', (table) => {
  table.string('avatar_url').after('password')
})
```

### `comment`
Define o comentário para uma coluna

```ts
this.schema.alterTable('users', (table) => {
  table.string('avatar_url').comment('Only relative names are stored')
})
```

### `collate`
Define a ordenação para uma coluna (funciona somente no MySQL).

```ts
this.schema.alterTable('users', (table) => {
  table
    .string('email')
    .unique()
    .collate('utf8_unicode_ci')
})
```
