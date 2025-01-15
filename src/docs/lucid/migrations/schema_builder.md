# Schema builder

O schema builder permite que você **crie**, **altere**, **descarte** e execute outras operações SQL DDL.

Você pode acessar a instância do schema builder usando a propriedade `this.schema` em seus arquivos de migração.

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

class UserSchema extends BaseSchema {
  async up() {
    console.log(this.schema)
  }
}
```

## `createTable`
Cria uma nova tabela de banco de dados. O método aceita o nome da tabela e um retorno de chamada que recebe a instância [table builder](./table_builder.md) para criar colunas de tabela.

```ts {3-8}
class UserSchema extends BaseSchema {
  async up() {
    this.schema.createTable('users', (table) => {
      table.increments()
      table.string('name')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

## `createSchema`
Cria o esquema PostgreSQL. Ele aceita o nome do esquema.

```ts {3}
class FoundationSchema extends BaseSchema {
  async up() {
    this.schema.createSchema('public')
  }
}
```

## `table` / `alterTable`
Selecione uma tabela SQL para alterar suas colunas. O método aceita o nome da tabela e um retorno de chamada que recebe a instância [table builder](./table_builder.md) para modificar as colunas da tabela.

```ts {3-14}
class UserSchema extends BaseSchema {
  async up() {
    this.schema.alterTable('user', (table) => {
      /**
       * Remova a coluna 'name'
       */
      table.dropColumn('name')

      /**
       * Adicione as colunas first_name e last_name
       */
      table.string('first_name')
      table.string('last_name')
    })
  }
}
```

## `renameTable`
Renomeia uma tabela. O método aceita o nome da tabela existente como o primeiro argumento e o novo nome como o segundo argumento.

```ts {3}
class UserSchema extends BaseSchema {
  async up() {
    this.schema.renameTable('user', 'app_users')
  }
}
```

## `dropTable`
Remove uma tabela SQL existente. O método aceita o nome da tabela como o único argumento.

```ts {3}
class UserSchema extends BaseSchema {
  async down() {
    this.schema.dropTable('users')
  }
}
```

## `dropTableIfExists`
Semelhante ao método `dropTable`, mas remove condicionalmente a tabela se ela existir.

```ts {3}
class UserSchema extends BaseSchema {
  async down() {
    this.schema.dropTableIfExists('users')
  }
}
```

## `dropSchema`
Remove um esquema PostgreSQL existente. O método aceita o nome do esquema como o único argumento.

```ts {3}
class FoundationSchema extends BaseSchema {
  async down() {
    this.schema.dropSchema('public')
  }
}
```

## `dropSchemaIfExists`
Semelhante ao método `dropSchema`, mas condicionalmente descarta o esquema se ele existir.

```ts {3}
class FoundationSchema extends BaseSchema {
  async down() {
    this.schema.dropSchemaIfExists('public')
  }
}
```

## `raw`
Execute uma consulta SQL a partir da string bruta. Ao contrário do [construtor de consultas brutas](../query_builders/raw.md), o método `schema.raw` não aceita vinculações separadamente.

```ts {3-4}
class UserSchema extends BaseSchema {
  async up() {
    this.schema
      .raw("SET sql_mode='TRADITIONAL'")
      .table('users', (table) => {
        table.dropColumn('name')
        table.string('first_name')
        table.string('last_name')
      })
  }
}
```

## `withSchema`
Especifique o esquema a ser selecionado ao executar as instruções SQL DDL. O método aceita o nome do esquema como o único argumento.

```ts {3-4}
class UserSchema extends BaseSchema {
  async up() {
    this.schema
      .withSchema('public')
      .createTable('users', (table) => {
        table.increments()
        table.string('name')
        table.timestamp('created_at', { useTz: true })
        table.timestamp('updated_at', { useTz: true })
      })
  }
}
```
