# Schema builder

O schema builder permite que você **crie**, **altere**, **descarte** e execute outras operações SQL DDL.

Você pode acessar a instância do schema builder usando a propriedade `this.schema` em seus arquivos de migração.

```ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

class UserSchema extends BaseSchema {
  public up() {
    console.log(this.schema)
  }
}
```

## Métodos/Propriedades
A seguir está a lista de métodos/propriedades disponíveis na classe schema builder.

### `createTable`
Cria uma nova tabela de banco de dados. O método aceita o nome da tabela e um retorno de chamada que recebe a instância [table builder](./table-builder.md) para criar colunas de tabela.

```ts {3-8}
class UserSchema extends BaseSchema {
  public up() {
    this.schema.createTable('users', (table) => {
      table.increments()
      table.string('name')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
}
```

### `createSchema`
Cria o esquema PostgreSQL. Ele aceita o nome do esquema.

```ts {3}
class FoundationSchema extends BaseSchema {
  public up() {
    this.schema.createSchema('public')
  }
}
```

### `table` / `alterTable`
Selecione uma tabela SQL para alterar suas colunas. O método aceita o nome da tabela e um retorno de chamada que recebe a instância [table builder](./table-builder.md) para modificar as colunas da tabela.

```ts {3-14}
class UserSchema extends BaseSchema {
  public up() {
    this.schema.alterTable('user', (table) => {
      /**
       * Solte a coluna name
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

### `renameTable`
Renomeie uma tabela. O método aceita o nome da tabela existente como o primeiro argumento e o novo nome como o segundo argumento.

```ts {3}
class UserSchema extends BaseSchema {
  public up() {
    this.schema.renameTable('user', 'app_users')
  }
}
```

### `dropTable`
Remova uma tabela SQL existente. O método aceita o nome da tabela como o único argumento.

```ts {3}
class UserSchema extends BaseSchema {
  public down() {
    this.schema.dropTable('users')
  }
}
```

### `dropTableIfExists`
Semelhante ao método `dropTable`, mas descarte condicionalmente a tabela se ela existir.

```ts {3}
class UserSchema extends BaseSchema {
  public down() {
    this.schema.dropTableIfExists('users')
  }
}
```

### `dropSchema`
Remove um esquema PostgreSQL existente. O método aceita o nome do esquema como o único argumento.

```ts {3}
class FoundationSchema extends BaseSchema {
  public down() {
    this.schema.dropSchema('public')
  }
}
```

### `dropSchemaIfExists`
Semelhante ao método `dropSchema`, mas remove condicionalmente o esquema se ele existir.

```ts {3}
class FoundationSchema extends BaseSchema {
  public down() {
    this.schema.dropSchemaIfExists('public')
  }
}
```

### `raw`
Executa uma consulta SQL a partir da string bruta. Ao contrário do [construtor de consultas brutas](./raw-query-builder.md), o método `schema.raw` não aceita vinculações separadamente.

```ts {3-4}
class UserSchema extends BaseSchema {
  public up() {
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

### `withSchema`
Especifique o esquema a ser selecionado ao executar as instruções SQL DDL. O método aceita o nome do esquema como o único argumento.

```ts {3-4}
class UserSchema extends BaseSchema {
  public up() {
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
