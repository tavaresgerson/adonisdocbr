# Operações CRUD

Os modelos Lucid facilitam muito a execução de operações CRUD e também definem ganchos de ciclo de vida em torno de cada operação.

Este guia abrange 80% dos casos de uso. No entanto, certifique-se de verificar os documentos [Model API docs](../../reference/orm/base-model.md) para todos os métodos disponíveis.

## Criar
Você pode criar e persistir novos registros no banco de dados primeiro atribuindo valores à instância do modelo e, em seguida, chamando o método `save`.

O método `save` executa a consulta **INSERT** ao persistir a instância do modelo pela primeira vez e executa a consulta **UPDATE** quando o modelo persiste.

```ts
import User from 'App/Models/User'
const user = new User()

// Atribuir nome de usuário e e-mail
user.username = 'virk'
user.email = 'virk@adonisjs.com'

// Inserir no banco de dados
await user.save()

console.log(user.$isPersisted) // true
```

Além disso, você pode usar o método `fill` para definir todos os atributos de uma vez e, em seguida, chamar o método `save`.

```ts
await user
  .fill({ username: 'virk', email: 'virk@adonisjs.com' })
  .save()

console.log(user.$isPersisted) // true
```

### `create`
O método `static create` cria a instância do modelo e a persiste no banco de dados de uma só vez.

```ts
import User from 'App/Models/User'

const user = await User.create({
  username: 'virk',
  email: 'virk@adonisjs.com',
})

console.log(user.$isPersisted) // true
```

### `createMany`
Cria várias instâncias de um modelo e as persiste no banco de dados. O método `createMany` aceita as mesmas opções que o método `create`.

::: info NOTA
Uma consulta de inserção é emitida para cada instância do modelo para executar os ganchos do ciclo de vida para cada instância.
:::

```ts
const user = await User.createMany([
  {
    email: 'virk@adonisjs.com',
    password: 'secret',
  },
  {
    email: 'romain@adonisjs.com',
    password: 'secret',
  },
])
```

## Leitura
Você pode consultar a tabela do banco de dados usando um dos seguintes métodos estáticos.

### `all`
Busca todos os usuários do banco de dados. O método retorna uma matriz de instâncias do modelo.

```ts
const user = await User.all()
// SQL: SELECT * from "users" ORDER BY "id" DESC;
```

### `find`
Encontra um registro usando a chave primária. O método retorna uma instância de modelo ou nulo (quando nenhum registro é encontrado).

```ts
const user = await User.find(1)
// SQL: SELECT * from "users" WHERE "id" = 1 LIMIT 1;
```

### `findBy`
Encontre um registro por um nome de coluna e seu valor. Semelhante ao método `find`, este método também retorna uma instância de modelo ou `null`.

```ts
const user = await User.findBy('email', 'virk@adonisjs.com')
// SQL: SELECT * from "users" WHERE "email" = 'virk@adonisjs.com' LIMIT 1;
```

### `first`
Busca o primeiro registro do banco de dados. Retorna `null` quando não há registros.

```ts
const user = await User.first()
// SQL: SELECT * from "users" LIMIT 1;
```

### Variação `orFail`
Você também pode usar a variação `orFail` para os métodos find. Ela gera uma exceção quando nenhuma linha é encontrada.

```ts
const user = await User.findOrFail(1)
const user = await User.firstOrFail()
const user = await User.findByOrFail('email', 'virk@adonisjs.com')
```

A variação `orFail` gerará uma exceção `E_ROW_NOT_FOUND` com statusCode `404`. Você pode [manipular manualmente](../http/exception-handling.md#http-exception-handler) essa exceção para convertê-la em uma resposta desejada.

### Usando o construtor de consultas
Os métodos estáticos mencionados acima abrangem os casos de uso comuns para consultar o banco de dados. No entanto, você não está limitado apenas a esses métodos e também pode aproveitar a API do construtor de consultas para fazer consultas SQL avançadas.

::: info NOTA
O [construtor de consultas de modelo](../../reference/orm/query-builder.md) retorna uma matriz de instâncias de modelo e não os objetos JavaScript simples.
:::

Você pode obter uma instância de um construtor de consultas para seu modelo usando o método `.query`.

```ts
const users = await User
  .query() // 👈 agora tem acesso a todos os métodos do construtor de consultas
  .where('countryCode', 'IN')
  .orWhereNull('countryCode')
```

Para buscar uma única linha, você pode usar o método `.first`. Há também um método `firstOrFail`.

```ts
const users = await User
  .query()
  .where('countryCode', 'IN')
  .orWhereNull('countryCode')
  .first() // 👈 Adds `LIMIT 1` clause
```

## Atualizar
A maneira padrão de executar atualizações usando o modelo é procurar o registro e então atualizá-lo/persisti-lo no banco de dados.

```ts
const user = await User.findOrFail(1)
user.lastLoginAt = DateTime.local() // Luxon dateTime é usado

await user.save()
```

Além disso, você pode usar o método `merge` para definir todos os atributos de uma vez e então chamar o método `save`.

```ts
await user
  .merge({ lastLoginAt: DateTime.local() })
  .save()
```

#### Por que não usar a consulta de atualização diretamente?
Outra maneira de atualizar os registros é executar uma atualização usando o construtor de consultas manualmente. Por exemplo

```ts
await User
  .query()
  .where('id', 1)
  .update({ lastLoginAt: new Date() })
```

No entanto, atualizar registros diretamente não aciona nenhum gancho de modelo e nem atualiza automaticamente os carimbos de data/hora.

Recomendamos não enfatizar muito a consulta extra `select`, a menos que esteja lidando com milhões de atualizações por segundo e esteja feliz em deixar os recursos do modelo.

## Excluir
Como a operação `update`, você primeiro busca no banco de dados e exclui a linha. Por exemplo

```ts
const user = await User.findOrFail(1)
await user.delete()
```

Novamente, para que os hooks funcionem, o Lucid precisa da instância do modelo primeiro. Se você decidir usar o construtor de consultas diretamente, o modelo não disparará nenhum hook.

No entanto, a abordagem do construtor de consultas direto pode ajudar a executar exclusões em massa.

```ts
await User.query().where('isVerified', false).delete()
```

## Métodos idempotentes
Os modelos vêm com muitos métodos úteis para simplificar a criação de registros, encontrando-os primeiro dentro do banco de dados e executando as consultas de criação/atualização somente quando o registro não existir.

### `firstOrCreate`
Pesquise um registro dentro do banco de dados ou crie um novo (somente quando a pesquisa falhar).

No exemplo a seguir, tentamos pesquisar um usuário com um e-mail, mas persistimos tanto o `email` quanto a `password`, quando a pesquisa inicial falha. Em outras palavras, o `searchPayload` e o `savePayload` são mesclados durante a chamada de criação.

```ts
import User from 'App/Models/User'

const searchPayload = { email: 'virk@adonisjs.com' }
const savePayload = { password: 'secret' }

await User.firstOrCreate(searchPayload, savePayload)
```

### `fetchOrCreateMany`

O `fetchOrCreateMany` é semelhante ao método `firstOrCreate`, mas, em vez disso, você pode criar mais de uma linha. O método precisa de uma chave exclusiva para encontrar as linhas duplicadas e uma matriz de objetos para persistir (se ausentes dentro do banco de dados).

```ts
import User from 'App/Models/User'

const usersToCreate = [
  {
    email: 'foo@example.com',
  },
  {
    email: 'bar@example.com',
  },
  {
    email: 'baz@example.com',
  }
]

await User.fetchOrCreateMany('email', usersToCreate)
```

### `updateOrCreate`
O `updateOrCreate` cria um novo registro ou atualiza o registro existente. Assim como o método `firstOrCreate`, você precisa definir uma carga útil de pesquisa e os atributos para inserir/atualizar.

```ts
import User from 'App/Models/User'

const searchPayload = { email: 'virk@adonisjs.com' }
const persistancePayload = { password: 'secret' }

await User.updateOrCreate(searchPayload, persistancePayload)
```

### `updateOrCreateMany`
O método `updateOrCreateMany` permite sincronizar linhas evitando entradas duplicadas. O método precisa de uma chave exclusiva para encontrar as linhas duplicadas e uma matriz de objetos para persistir/atualizar.

```ts
import User from 'App/Models/User'

const usersToCreate = [
  {
    email: 'foo@example.com',
  },
  {
    email: 'bar@example.com',
  },
  {
    email: 'baz@example.com',
  }
]

await User.updateOrCreateMany('email', usersToCreate)
```

## Leitura adicional

- [Guia de referência do modelo base](../../reference/orm/base-model.md) para visualizar todos os métodos e propriedades disponíveis.
- [construtor de consulta de modelo](../../reference/orm/query-builder.md).
