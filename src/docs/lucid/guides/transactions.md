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
// Insert

await trx.insertQuery().table('users').insert({ username: 'virk' })
```

```ts
// Select

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

  return response[0] // 👈 valor de retorno
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
    // use trx aqui
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

// A transação é criada
const trx = await db.transaction()

// Desta vez, um ponto de salvamento é criado
const savepoint = await trx.transaction()

// também reverte o ponto de salvamento
await trx.rollback()
```

## Usando transação com o construtor de consultas de banco de dados

A API de transações não se limita apenas a criar uma instância do construtor de consultas a partir de um objeto de transação. Você também pode passá-la para instâncias ou modelos existentes do construtor de consultas.

```ts {8}
// Durante inserções

import db from '@adonisjs/lucid/services/db'

const trx = await db.transaction()

await db
  .insertQuery({ client: trx })
  .table('users')
  .insert({ username: 'virk' })

await trx.commit()
```

```ts {8}
// Durante seleção, atualização ou exclusão

import db from '@adonisjs/lucid/services/db'

const trx = await db.transaction()

await db
  .query({ client: trx })
  .from('users')
  .where('id', 1)
  .update(payload)

await trx.commit()
```

## Usando transações com modelos Lucid

Você pode passar a transação para uma instância de modelo usando o método `useTransaction`.

Na classe de modelo, você pode acessar o objeto de transação usando a propriedade `this.$trx`. A propriedade só está disponível durante uma transação em andamento. Após ``commit` ou `rollback`, ela será redefinida para `undefined`.

```ts {4-10}
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

await db.transaction(async (trx) => {
  const user = new User()
  user.username = 'virk'

  user.useTransaction(trx)
  await user.save()
})
```

### Construtor de consulta de modelo

Assim como o construtor de consulta padrão, você também pode passar a transação para o construtor de consulta de modelo.

```ts {7}
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

const trx = await db.transaction()

const users = await User
  .query({ client: trx })
  .where('is_active', true)
```

### Persistindo relacionamentos dentro de uma transação

O caso de uso mais comum para transações é persistir relacionamentos. Considere o seguinte exemplo de **criação de um novo usuário** e **seu perfil** envolvendo-os dentro de uma única transação.

```ts {4-19}
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

await db.transaction(async (trx) => {
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

```ts {4-15}
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'

await db.transaction(async (trx) => {
  const user = await User.findOrFail(1, { client: trx })

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
