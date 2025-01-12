---
summary: Referência a transações SQL e pontos de salvamento com Lucid ORM
---

# Transações

O Lucid tem suporte de primeira classe para transações e pontos de salvamento. Você pode criar uma nova transação chamando o método `db.transaction`.

```ts
import db from '@adonisjs/lucid/services/db'
const trx = await db.transaction()
```

Assim como o módulo `db`. Você também pode usar o objeto `trx` para criar uma instância do construtor de consultas.

```ts
// title: Insert
await trx.insertQuery().table('users').insert({ username: 'virk' })
```

```ts
// title: Select
await trx.query().select('*').from('users')
```

Depois de executar a consulta, você deve `commit` ou `rollback` a transação. Caso contrário, as consultas ficarão travadas até o tempo limite.

A seguir, um exemplo completo do uso de transações com uma consulta de inserção.

```ts
const trx = await db.transaction()

try {
  await trx.insertQuery().table('users').insert({ username: 'virk' })

  await trx.commit()
} catch (error) {
  await trx.rollback()
}
```

## Transações gerenciadas

O exemplo acima espera que você tenha que `commit` ou `rollback` manualmente transações ao envolver seu código dentro de um bloco `try/catch`. Uma transação gerenciada faz isso automaticamente para você.

Você pode criar uma transação gerenciada passando um retorno de chamada para o método `transaction`.

- A transação é confirmada automaticamente após executar o retorno de chamada.
- Se um retorno de chamada gerar uma exceção, a transação será revertida automaticamente e relançar a exceção.

```ts
await db.transaction(async (trx) => {
  await trx.insertQuery().table('users').insert({ username: 'virk' })
})
```

Você também pode retornar um valor do retorno de chamada e acessá-lo no escopo de nível superior. Por exemplo:

```ts
const userId = await db.transaction(async (trx) => {
  const response = await trx.insertQuery().table('users').insert({ username: 'virk' })

  return response[0] // 👈 return value
})
```

## Níveis de isolamento

Você pode definir o nível de isolamento de uma transação ao chamar o método `db.transaction`.

```ts
await db.transaction({
  isolationLevel: 'read uncommitted',
})
```

A seguir está um exemplo de definição do nível de isolamento com uma transação gerenciada.

```ts
await db.transaction(
  async (trx) => {
    // use trx here
  },
  {
    isolationLevel: 'read committed',
  }
)
```

A seguir está a lista de níveis de isolamento disponíveis.

- `read uncommitted`
- `read committed`
- `snapshot`
- `repeatable read`
- `serializable`

## Savepoints

Toda vez que você cria uma transação aninhada, o Lucid cria nos bastidores um novo [savepoint](https://en.wikipedia.org/wiki/Savepoint). Como as transações precisam de uma conexão dedicada, usar savepoints reduz o número de conexões necessárias.

```ts
import db from '@adonisjs/lucid/services/db'

// Transaction is created
const trx = await db.transaction()

// This time, a save point is created
const savepoint = await trx.transaction()

// also rollbacks the savepoint
await trx.rollback()
```

## Usando transação com o construtor de consultas de banco de dados

A API de transações não se limita apenas a criar uma instância do construtor de consultas a partir de um objeto de transação. Você também pode passá-la para instâncias ou modelos existentes do construtor de consultas.

```ts
// title: During inserts
import db from '@adonisjs/lucid/services/db'

const trx = await db.transaction()

await db
  // highlight-start
  .insertQuery({ client: trx })
  // highlight-end
  .table('users')
  .insert({ username: 'virk' })

await trx.commit()
```

```ts
// title: During select, update or delete
import db from '@adonisjs/lucid/services/db'

const trx = await db.transaction()

await db
  // highlight-start
  .query({ client: trx })
  // highlight-end
  .from('users')
  .where('id', 1)
  .update(payload)

await trx.commit()
```

## Usando transações com modelos Lucid

Você pode passar a transação para uma instância de modelo usando o método `useTransaction`.

Na classe de modelo, você pode acessar o objeto de transação usando a propriedade `this.$trx`. A propriedade só está disponível durante uma transação em andamento. Após ``commit` ou `rollback`, ela será redefinida para `undefined`.

```ts
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

// highlight-start
await db.transaction(async (trx) => {
  const user = new User()
  user.username = 'virk'

  user.useTransaction(trx)
  await user.save()
})
// highlight-end
```

### Construtor de consulta de modelo

Assim como o construtor de consulta padrão, você também pode passar a transação para o construtor de consulta de modelo.

```ts
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

const trx = await db.transaction()

const users = await User
  // highlight-start
  .query({ client: trx })
  // highlight-end
  .where('is_active', true)
```

### Persistindo relacionamentos dentro de uma transação

O caso de uso mais comum para transações é persistir relacionamentos. Considere o seguinte exemplo de **criação de um novo usuário** e **seu perfil** envolvendo-os dentro de uma única transação.

```ts
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

// highlight-start
await db.transaction(async (trx) => {
  const user = new User()
  user.username = 'virk'

  user.useTransaction(trx)
  await user.save()

  /**
   * The relationship will implicitly reference the
   * transaction from the user instance
   */
  await user.related('profile').create({
    fullName: 'Harminder Virk',
    avatar: 'some-url.jpg',
  })
})
// highlight-end
```

No exemplo a seguir, buscamos um usuário existente e criamos um novo perfil para ele.

```ts
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

// highlight-start
await db.transaction(async (trx) => {
  const user = await User.findOrFail(1, { client: trx })

  /**
   * The relationship will implicitly reference the
   * transaction from the user instance
   */
  await user.related('profile').create({
    fullName: 'Harminder Virk',
    avatar: 'some-url.jpg',
  })
})
// highlight-end
```
