# Transações

O Lucid tem suporte de primeira classe para transações e pontos de salvamento. Você pode criar uma nova transação chamando o método `Database.transaction`.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

// Transação criada
const trx = await Database.transaction()
```

Assim como o módulo `Database`. Você também pode usar o objeto `trx` para criar uma instância do construtor de consultas.

:::code-group

```ts [Insert]
await trx
  .insertQuery()
  .table('users')
  .insert({ username: 'virk' })
```

```ts [Select]
await trx
  .query()
  .select('*')
  .from('users')
```

:::

Depois de executar a consulta, você deve `commit` ou `rollback` a transação. Caso contrário, as consultas travarão até o tempo limite.

A seguir, um exemplo completo de uso de transações com uma consulta de inserção.

```ts
const trx = await Database.transaction()

try {
  await trx
    .insertQuery()
    .table('users')
    .insert({ username: 'virk' })

  await trx.commit()
} catch (error) {
  await trx.rollback()
}
```

## Transações gerenciadas
O exemplo acima espera que você tenha que `commit` ou `rollback` manualmente as transações envolvendo seu código dentro de um bloco `try/catch`. Uma transação gerenciada faz isso automaticamente para você.

Você pode criar uma transação gerenciada passando um retorno de chamada para o método `transaction`.

- A transação é confirmada automaticamente após executar o retorno de chamada.
- Se um retorno de chamada gerar uma exceção, a transação será revertida automaticamente e lançará a exceção novamente.

```ts
await Database.transaction(async (trx) => {
  await trx
    .insertQuery()
    .table('users')
    .insert({ username: 'virk' })
})
```

Você também pode retornar um valor do retorno de chamada e acessá-lo no escopo de nível superior. Por exemplo:

```ts
const userId = await Database.transaction(async (trx) => {
  const response = await trx
    .insertQuery()
    .table('users')
    .insert({ username: 'virk' })

  return response[0] // 👈 retorna o valor
})
```

## Níveis de isolamento
Você pode definir o nível de isolamento de uma transação ao chamar o método `Database.transaction`.

```ts
await Database.transaction({
  isolationLevel: 'read uncommitted'
})
```

A seguir está um exemplo de definição do nível de isolamento com uma transação gerenciada.

```ts
await Database.transaction(async (trx) => {
  // use trx aqui
}, {
  isolationLevel: 'read committed'
})
```

A seguir está a lista de níveis de isolamento disponíveis.

- **"read uncommitted"**
- **"read committed"**
- **"snapshot"**
- **"repeatable read"**
- **"serializable"**

## Passando transação como referência
A API de transações não se limita apenas a criar uma instância do construtor de consultas a partir de um objeto de transação. Você também pode passá-la para instâncias ou modelos existentes do construtor de consultas.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
const trx = await Database.transaction()

Database
  .insertQuery({ client: trx }) 👈
  .table('users')
  .insert({ username: 'virk' })
```

Ou passá-la em um estágio posterior usando o método `useTransaction`.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
const trx = await Database.transaction()

Database
  .insertQuery()
  .table('users')
  .useTransaction(trx) 👈
  .insert({ username: 'virk' })
```

## Savepoints
Toda vez que você cria uma transação aninhada, o Lucid cria nos bastidores um novo [savepoint](https://en.wikipedia.org/wiki/Savepoint). Como as transações precisam de uma conexão dedicada, usar savepoints reduz o número de conexões necessárias.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

// A transação é criada
const trx = await Database.transaction()

// Desta vez, um ponto de salvamento é criado
const savepoint = await trx.transaction()

 // também reverte o ponto de salvamento
await trx.rollback()
```

## Usando transações com modelos Lucid
Você pode passar a transação para uma instância de modelo usando o método `useTransaction`.

Na classe de modelo, você pode acessar o objeto de transação usando a propriedade `this.$trx`. A propriedade só está disponível durante uma transação em andamento. Após ``commit` ou `rollback`, ela será redefinida para `undefined`.

```ts {4-10}
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

await Database.transaction(async (trx) => {
  const user = new User()
  user.username = 'virk'

  user.useTransaction(trx)
  await user.save()
})
```

### Construtor de consulta de modelo
Assim como o construtor de consulta padrão, você também pode passar a transação para o construtor de consulta de modelo.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

const trx = await Database.transaction()

const users = await User
  .query({ client: trx }) 👈
  .where('is_active', true)
```

### Persistindo relacionamentos dentro de uma transação
O caso de uso mais comum para transações é persistir relacionamentos. Considere o seguinte exemplo de **criação de um novo usuário** e **seu perfil** envolvendo-os dentro de uma única transação.

```ts {5-20}
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

await Database.transaction(async (trx) => {
  const user = new User()
  user.username = 'virk'

  user.useTransaction(trx)
  await user.save()

  /**
   * O relacionamento referenciará implicitamente a
   * transação da instância do usuário
   */
  await user.related('profile').create({
    fullName: 'Harminder Virk',
    avatar: 'some-url.jpg',
  })
})
```

No exemplo a seguir, buscamos um usuário existente e criamos um novo perfil para ele.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

await Database.transaction(async (trx) => {               // [!code highlight]
  const user = await User.findOrFail(1, { client: trx })  // [!code highlight]

  /**                                                     // [!code highlight]
   * O relacionamento referenciará implicitamente a       // [!code highlight]
   * transação da instância do usuário                    // [!code highlight]
   */                                                     // [!code highlight]
  await user.related('profile').create({                  // [!code highlight]
    fullName: 'Harminder Virk',                           // [!code highlight]
    avatar: 'some-url.jpg',                               // [!code highlight]
  })                                                      // [!code highlight]
})                                                        // [!code highlight]
```
