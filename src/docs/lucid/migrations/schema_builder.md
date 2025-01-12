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

```ts
class UserSchema extends BaseSchema {
  async up() {
    // highlight-start
    this.schema.createTable('users', (table) => {
      table.increments()
      table.string('name')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
    // highlight-end
  }
}
```

## `createSchema`
Cria o esquema PostgreSQL. Ele aceita o nome do esquema.

```ts
class FoundationSchema extends BaseSchema {
  async up() {
    // highlight-start
    this.schema.createSchema('public')
    // highlight-end
  }
}
```

## `table` / `alterTable`
Selecione uma tabela SQL para alterar suas colunas. O método aceita o nome da tabela e um retorno de chamada que recebe a instância [table builder](./table_builder.md) para modificar as colunas da tabela.

```ts
class UserSchema extends BaseSchema {
  async up() {
    // highlight-start
    this.schema.alterTable('user', (table) => {
      /**
       * Drop the name column
       */
      table.dropColumn('name')

      /**
       * Add first_name and last_name columns
       */
      table.string('first_name')
      table.string('last_name')
    })
    // highlight-end
  }
}
```

## `renameTable`
Renomeia uma tabela. O método aceita o nome da tabela existente como o primeiro argumento e o novo nome como o segundo argumento.

```ts
class UserSchema extends BaseSchema {
  async up() {
    // highlight-start
    this.schema.renameTable('user', 'app_users')
    // highlight-end
  }
}
```

## `dropTable`
Remove uma tabela SQL existente. O método aceita o nome da tabela como o único argumento.

```ts
class UserSchema extends BaseSchema {
  async down() {
    // highlight-start
    this.schema.dropTable('users')
    // highlight-end
  }
}
```

## `dropTableIfExists`
Semelhante ao método `dropTable`, mas remove condicionalmente a tabela se ela existir.

```ts
class UserSchema extends BaseSchema {
  async down() {
    // highlight-start
    this.schema.dropTableIfExists('users')
    // highlight-end
  }
}
```

## `dropSchema`
Remove um esquema PostgreSQL existente. O método aceita o nome do esquema como o único argumento.

```ts
class FoundationSchema extends BaseSchema {
  async down() {
    // highlight-start
    this.schema.dropSchema('public')
    // highlight-end
  }
}
```

## `dropSchemaIfExists`
Semelhante ao método `dropSchema`, mas condicionalmente descarta o esquema se ele existir.

```ts
class FoundationSchema extends BaseSchema {
  async down() {
    // highlight-start
    this.schema.dropSchemaIfExists('public')
    // highlight-end
  }
}
```

## `raw`
Execute uma consulta SQL a partir da string bruta. Ao contrário do [construtor de consultas brutas](../query_builders/raw.md), o método `schema.raw` não aceita vinculações separadamente.

```ts
class UserSchema extends BaseSchema {
  async up() {
    // highlight-start
    this.schema
      .raw("SET sql_mode='TRADITIONAL'")
      // highlight-end
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

```ts
class UserSchema extends BaseSchema {
  async up() {
    // highlight-start
    this.schema
      .withSchema('public')
      // highlight-end
      .createTable('users', (table) => {
        table.increments()
        table.string('name')
        table.timestamp('created_at', { useTz: true })
        table.timestamp('updated_at', { useTz: true })
      })
  }
}
```
