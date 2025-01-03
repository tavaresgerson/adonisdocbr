# Schema

As classes de migração de esquema devem estender a classe [Base Schema class](https://github.com/adonisjs/lucid/blob/master/src/Schema/index.ts) para executar operações SQL DDL como código.

Você pode criar uma nova migração de esquema executando o comando `node ace make:migration`.

```ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

class UserSchema extends BaseSchema {
}
```

## Métodos de ciclo de vida
Cada classe de esquema tem os seguintes métodos de ciclo de vida que são executados quando você executa ou reverte as migrações.

### `up`
O método `up` é usado para definir as operações a serem executadas ao executar o comando `node ace migration:run`. Neste método, você sempre executa operações construtivas como **criar uma tabela** ou **alterar uma tabela**.

```ts
class UserSchema extends BaseSchema {
  public async up() {
  }
}
```

### `down`
O método `down` deve desfazer as ações executadas pelo método `up`. Você precisa usar a API equivalente para executar as ações de desfazer manualmente.

Por exemplo, se o método `up` cria uma nova tabela usando o método `createTable`, então o método `down` pode usar o método `dropTable`.

```ts
class UserSchema extends BaseSchema {
  public async up() {
    this.schema.createTable('users', () => {
    })
  }

  public async down() {
    this.schema.dropTable('users')
  }
}
```

## Métodos/Propriedades
A seguir está a lista de métodos e propriedades disponíveis na classe de esquema.

### `now`
O método `now` é um auxiliar para definir o valor padrão para `CURRENT_TIMESTAMP`.

```ts
table.timestamp('created_at').defaultTo(this.now())
```

### `raw`
Cria uma consulta bruta a ser usada para executar instruções DDL.

```ts {3-5}
class UserSchema extends BaseSchema {
  public up() {
    this.defer(async () => {
      await this.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    })
  }
}
```

### `defer`
O método `defer` permite que você envolva operações de banco de dados personalizadas dentro de um bloco defer. Ações de adiamento são necessárias pelos seguintes motivos.

- Garanta que suas ações personalizadas sejam executadas na sequência correta
- Garanta que suas ações não sejam executadas quando as migrações estiverem sendo executadas no modo de execução a seco.

```ts
public async up() {
  this.defer(async () => {
    // Executado somente quando não estiver em modo de execução a seco
    await this.db.from('users')
  })
}
```

### `debug`
Uma propriedade para habilitar/desabilitar a depuração de consultas para a classe de esquema fornecida. Por padrão, a depuração é herdada do [cliente de consulta](./query-client.md) usado pela classe de esquema.

```ts
class UserSchema extends BaseSchema {
  public debug = false
}
```

### `disableTransactions`
Uma propriedade para habilitar/desabilitar o encapsulamento de consultas de banco de dados dentro de uma transação. As transações são habilitadas por padrão. Todas as instruções dentro de um determinado arquivo de migração são encapsuladas dentro de uma única transação.

```ts
class UserSchema extends BaseSchema {
  public disableTransactions = true
}
```

### `schema`
Retorna uma referência ao [construtor de esquema](./schema-builder.md). A propriedade é getter e retorna uma nova instância do construtor de esquema em cada acesso.

```ts
class UserSchema extends BaseSchema {
  public up() {
    // cada chamada de acesso retorna uma nova instância
    console.log(this.schema !== this.schema)
  }
}
```

### `execUp`
O método é invocado internamente durante o processo de migração para executar o método `up` definido pelo usuário. **Você nunca deve chamar este método manualmente**.

### `execDown`
O método é invocado internamente durante o processo de migração para executar o método `down` definido pelo usuário. **Você nunca deve chamar este método manualmente**.
