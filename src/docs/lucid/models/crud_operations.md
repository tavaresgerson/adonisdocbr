# Operações CRUD

Os modelos Lucid facilitam muito a execução de operações CRUD e também definem ganchos de ciclo de vida em torno de cada operação.

## Criar

Você pode criar e persistir novos registros no banco de dados usando o método estático `create`.

```ts
import User from '#models/user'

const user = await User.create({
  username: 'virk',
  email: 'virk@adonisjs.com',
})

console.log(user.$isPersisted) // true
```

Além disso, você pode criar e persistir novos registros no banco de dados atribuindo valores à instância do modelo e, em seguida, chamando o método `save`.

O método `save` executa a consulta **INSERT** ao persistir a instância do modelo pela primeira vez e executa a consulta **UPDATE** quando o modelo persiste.

```ts
import User from '#models/user'
const user = new User()

// Atribuir nome de usuário e e-mail
user.username = 'virk'
user.email = 'virk@adonisjs.com'

// Inserir no banco de dados
await user.save()

console.log(user.$isPersisted) // true
```

Além disso, você pode usar o método `fill` para definir todos os atributos como uma vez e, em seguida, chamar o método `save`.

```ts
import User from '#models/user'
const user = new User()

// Atribuir nome de usuário e e-mail usando o método de preenchimento e depois salvar
await user
  .fill({ username: 'virk', email: 'virk@adonisjs.com' })
  .save()

console.log(user.$isPersisted) // true
```

### `createMany`

Criar várias instâncias de um modelo e persisti-las no banco de dados. O método `createMany` aceita as mesmas opções que o método `create`.

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

## Ler

Você pode consultar a tabela do banco de dados usando um dos seguintes métodos estáticos.

### `all`

Buscar todos os usuários do banco de dados. O método retorna uma matriz de instâncias do modelo.

```ts
const user = await User.all()
// SQL: SELECT * from "users" ORDER BY "id" DESC;
```

### `find`

Encontrar um registro usando a chave primária. O método retorna uma instância do modelo ou nulo (quando nenhum registro é encontrado).

```ts
const user = await User.find(1)
// SQL: SELECT * from "users" WHERE "id" = 1 LIMIT 1;
```

### `findBy`

Encontrar um registro por um nome de coluna e seu valor. Semelhante ao método `find`, este método também retorna uma instância do modelo ou `null`.

```ts
const user = await User.findBy('email', 'virk@adonisjs.com')
// SQL: SELECT * from "users" WHERE "email" = 'virk@adonisjs.com' LIMIT 1;
```

### `findManyBy`

Encontre vários registros por um ou vários nomes de coluna e seu valor. Este método retorna uma matriz de instância de modelo ou uma matriz vazia (`[]`).

```ts
const users = await User.findManyBy('status', 'active')
// SQL: SELECT * from "users" WHERE "status" = 'active';

const posts = await Post.findManyBy({ status: 'published', userId: 1 })
// SQL: SELECT * from "posts" WHERE "status" = 'published' AND "userId" = 1;
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

A variação `orFail` gerará uma exceção `E_ROW_NOT_FOUND` com statusCode `404`.

### Usando o construtor de consultas

Os métodos estáticos mencionados acima abrangem os casos de uso comuns para consultar o banco de dados. No entanto, você não está limitado apenas a esses métodos e também pode aproveitar a API do construtor de consultas para fazer consultas SQL avançadas.

::: info NOTA
O [ModelQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/orm/query_builder/index.ts) retorna uma matriz de instâncias de modelo e não os objetos JavaScript simples.
:::

Você pode obter uma instância de um construtor de consultas para seu modelo usando o método `.query`.

```ts
const users = await User
  .query()
  .where('countryCode', 'IN')
  .orWhereNull('countryCode')
```

Para buscar uma única linha, você pode usar o método `.first`. Há também um método `firstOrFail`.

```ts
const users = await User
  .query()
  .where('countryCode', 'IN')
  .orWhereNull('countryCode')
  .first()
```

## Atualizar

A maneira padrão de executar atualizações usando o modelo é consultar o registro e, em seguida, atualizá-lo/persisti-lo no banco de dados.

```ts
const user = await User.findOrFail(1)

user.lastLoginAt = DateTime.local() // Luxon dateTime é usado

await user.save()
```

Além disso, você pode usar o método `merge` para definir todos os atributos de uma vez e então chamar o método `save`.

```ts
await user.merge({ lastLoginAt: DateTime.local() }).save()
```

### Por que não usar a consulta de atualização diretamente?

Outra maneira de atualizar os registros é executar uma atualização usando o construtor de consultas manualmente. Por exemplo

```ts
await User.query().where('id', 1).update({ lastLoginAt: new Date() })
```

No entanto, atualizar registros diretamente não aciona nenhum gancho de modelo e nem atualiza automaticamente os carimbos de data/hora.

Recomendamos não enfatizar muito a consulta extra `select`, a menos que esteja lidando com milhões de atualizações por segundo e esteja feliz em deixar os recursos do modelo.

## Excluir

Como a operação `update`, você primeiro busca no banco de dados e exclui a linha. Por exemplo

```ts
const user = await User.findOrFail(1)
await user.delete()
```

Novamente, para que os ganchos funcionem, o Lucid precisa da instância do modelo primeiro. Se você decidir usar o construtor de consultas diretamente, o modelo não disparará nenhum hook.

No entanto, a abordagem do construtor de consultas diretas pode ajudar a executar exclusões em massa.

```ts
await User.query().where('isVerified', false).delete()
```

## Métodos idempotentes

Os modelos vêm com muitos métodos úteis para simplificar a criação de registros, encontrando-os primeiro dentro do banco de dados e executando as consultas de criação/atualização somente quando o registro não existir.

### `firstOrCreate`

Pesquise um registro dentro do banco de dados ou crie um novo (somente quando a pesquisa falhar).

No exemplo a seguir, tentamos pesquisar um usuário com um e-mail, mas persistimos tanto o `email` quanto a `password`, quando a pesquisa inicial falha. Em outras palavras, o `searchPayload` e o `savePayload` são mesclados durante a chamada de criação.

```ts
import User from '#models/user'

// User.firstOrCreate(searchPayload, savePayload)
await User.firstOrCreate(
  { email: 'virk@adonisjs.com' },
  { password: 'secret' }
)
```

### `fetchOrCreateMany`

O `fetchOrCreateMany` é semelhante ao método `firstOrCreate`, mas, em vez disso, você pode criar mais de uma linha. O método precisa de uma chave exclusiva para encontrar as linhas duplicadas e uma matriz de objetos para persistir (se ausentes dentro do banco de dados).

```ts
import User from '#models/user'

// User.fetchOrCreateMany(key, arrayOfObjects)
await User.fetchOrCreateMany('email', [
  {
    email: 'foo@example.com',
    username: 'foo',
  },
  {
    email: 'bar@example.com',
    username: 'bar',
  },
  {
    email: 'baz@example.com',
    username: 'baz',
  },
])
```

### `updateOrCreate`

O `updateOrCreate` cria um novo registro ou atualiza o registro existente. Como o método `firstOrCreate`, você precisa definir uma carga útil de pesquisa e os atributos para inserir/atualizar.

```ts
import User from '#models/user'

// User.updateOrCreate(searchPayload, persistancePayload)
await User.updateOrCreate(
  { email: 'virk@adonisjs.com' },
  { password: 'secret' }
)
```

### `updateOrCreateMany`

O método `updateOrCreateMany` permite sincronizar linhas evitando entradas duplicadas. O método precisa de uma chave exclusiva para encontrar as linhas duplicadas e uma matriz de objetos para persistir/atualizar.

```ts
import User from '#models/user'

// User.updateOrCreateMany(key, arrayOfObjects)
await User.updateOrCreateMany('email', [
  {
    email: 'foo@example.com',
    username: 'foo',
  },
  {
    email: 'bar@example.com',
    username: 'bar',
  },
  {
    email: 'baz@example.com',
    username: 'baz',
  },
])
```

Neste exemplo, usamos o e-mail e o nome de usuário como chaves para encontrar duplicatas. Se uma linha já existir com a mesma combinação de e-mail e nome de usuário, ela será atualizada com os novos valores fornecidos.
Caso contrário, uma nova linha será criada com os valores fornecidos.

```ts
import User from '#models/user'

// User.updateOrCreateMany(keys, arrayOfObjects)
await User.updateOrCreateMany(['email', 'username'], [
  {
    email: 'foo@example.com',
    username: 'foo',
  },
  {
    email: 'bar@example.com',
    username: 'bar',
  },
  {
    email: 'baz@example.com',
    username: 'baz',
  },
])
```
