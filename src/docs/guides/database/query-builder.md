# Construtor de consultas

O construtor de consultas Lucid permite que você escreva e execute consultas SQL. Ele é construído em cima do [Knex.js](https://knexjs.org/#) com poucas alterações opinativas.

Nós dividimos os construtores de consultas nas seguintes categorias

- O construtor de consultas padrão permite que você construa consultas SQL para operações **select**, **update** e **delete**.
- O construtor de consultas insert permite que você construa consultas SQL para as operações **insert**.
- O construtor de consultas raw permite que você escreva e execute consultas a partir de uma string SQL raw.

## Consultas select
Você pode executar operações select criando uma instância do construtor de consultas usando o método `.query`.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const users = await Database
  .query()  // 👈 fornece uma instância do construtor de consultas select
  .from('users')
  .select('*')
```

Você também pode criar a instância do construtor de consultas chamando diretamente o método `.from`.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const users = await Database
  .from('users') // 👈 fornece uma instância do construtor de consultas select
  .select('*')
```

[Guia de referência do construtor de consultas →](../../reference/database/query-builder.md)

## Consultas de inserção
O construtor de consultas de inserção expõe a API para inserir novas linhas no banco de dados. Você pode obter uma instância do construtor de consultas usando o método `.insertQuery`.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

await Database
  .insertQuery() // 👈 fornece uma instância do construtor de consulta de inserção
  .table('users')
  .insert({ username: 'virk', email: 'virk@adonisjs.com' })
```

Você também pode criar a instância do construtor de consultas chamando diretamente o método `.table`.

```ts
await Database
  .table('users') // 👈 fornece uma instância do construtor de consulta de inserção
  .insert({ username: 'virk', email: 'virk@adonisjs.com' })
```

### Inserção múltipla
Você pode usar o método `.multiInsert` para inserir várias linhas em uma única consulta de inserção.

::: info NOTA
MySQL e SQLite retornam apenas o id da última linha e não de todas as linhas.
:::

```ts
await Database.table('users').multiInsert([
  { username: 'virk' },
  { username: 'romain' },
])
```

* [Inserir guia de referência do construtor de consultas →](../../reference/database/insert-query-builder.md)

## Consultas brutas
Consultas brutas permitem executar uma instrução SQL a partir de uma entrada de string. Isso geralmente é útil quando você deseja executar consultas complexas que não são suportadas pelo construtor de consultas padrão.

Você pode criar uma instância do construtor de consultas brutas usando o método `.rawQuery`. Ele aceita a string SQL como o primeiro argumento e suas ligações posicionais/nomeadas como o segundo argumento.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

const user = await Database
  .rawQuery('select * from users where id = ?', [1])
```

* [Guia de referência do construtor de consultas brutas →](../../reference/database/raw-query-builder.md)

## Estendendo construtores de consultas
Você pode estender as classes do construtor de consultas usando **macros** e **getters**. O melhor lugar para estender os construtores de consultas é dentro de um provedor de serviços personalizado.

Abra o arquivo `providers/AppProvider.ts` pré-existente e escreva o seguinte código dentro do método `boot`.

```ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const {                                                     // [!code highlight]
      DatabaseQueryBuilder                                      // [!code highlight]
    } = this.app.container.use('Adonis/Lucid/Database')         // [!code highlight]

    DatabaseQueryBuilder.macro('getCount', async function () {  // [!code highlight]
      const result = await this.count('* as total')             // [!code highlight]
      return BigInt(result[0].total)                            // [!code highlight]
    })                                                          // [!code highlight]
  }
}
```

No exemplo acima, adicionamos um método `getCount` no [construtor de consultas de banco de dados](../../reference/database/query-builder.md). O método adiciona uma função `count` à consulta, executa-a imediatamente e retorna o resultado como um **BigInt**.

### Informando o TypeScript sobre o método
A propriedade `getCount` é adicionada no tempo de execução e, portanto, o TypeScript não sabe sobre ela. Para informar o TypeScript, usaremos [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) e adicionaremos a propriedade à interface `DatabaseQueryBuilderContract`.

Crie um novo arquivo no caminho `contracts/database.ts` (o nome do arquivo não é importante) e cole o seguinte conteúdo dentro dele.

```ts
// contracts/database.ts

declare module '@ioc:Adonis/Lucid/Database' {
  interface DatabaseQueryBuilderContract<Result> {
    getCount(): Promise<BigInt>
  }
}
```

### Execução de teste
Vamos tentar usar o método `getCount` da seguinte forma:

```ts
await Database.query().from('users').getCount()
```

## Estendendo ModelQueryBuilder
Semelhante ao `DatabaseQueryBuilder`, você também pode estender o [ModelQueryBuilder](../../reference/orm/query-builder.md) da seguinte forma.

#### Código de tempo de execução

```ts
const {
  ModelQueryBuilder
} = this.app.container.use('Adonis/Lucid/Database')

ModelQueryBuilder.macro('getCount', async function () {
  const result = await this.count('* as total')
  return BigInt(result[0].$extras.total)
})
```

#### Estendendo a definição de tipo

```ts
declare module '@ioc:Adonis/Lucid/Orm' {
  interface ModelQueryBuilderContract<
    Model extends LucidModel,
    Result = InstanceType<Model>
  > {
    getCount(): Promise<BigInt>
  }
}
```

#### Uso

```ts
import User from 'App/Models/User'
await User.query().getCount()
```

## Estendendo InsertQueryBuilder
Finalmente, você também pode estender o [InsertQueryBuilder](../../reference/database/insert-query-builder.md) da seguinte forma.

#### Código de tempo de execução

```ts
const {
  InsertQueryBuilder
} = this.app.container.use('Adonis/Lucid/Database')

InsertQueryBuilder.macro('customMethod', async function () {
  // implementação
})
```

#### Estendendo a definição de tipo

```ts
declare module '@ioc:Adonis/Lucid/Database' {
  interface InsertQueryBuilderContract<Result = any> {
    customMethod(): Promise<any>
  }
}
```

#### Uso

```ts
import Database from '@ioc:Adonis/Lucid/Database'
await Database.insertQuery().customMethod()
```
