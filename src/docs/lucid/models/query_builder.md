# Construtor de consultas de modelo

O [ModelQueryBuilder](https://github.com/adonisjs/lucid/blob/develop/src/orm/query_builder/index.ts) estende o [SelectQueryBuilder](../query_builders/select.md) padrão e, portanto, todos os métodos também estão disponíveis para o construtor de consultas de modelo.

::: info NOTA
Este documento abrange apenas os métodos/propriedades adicionais exclusivos do construtor de consultas de modelo.
:::

O construtor de consultas de modelo sempre retorna uma matriz de instâncias de modelos e não objetos simples.

Além disso, o construtor de consultas de modelo está ciente do modelo e de seus relacionamentos e, portanto, fornece uma API fácil de usar para trabalhar com relacionamentos.

```ts
class User extends BaseModel {}

// Retorna a instância do construtor de consulta do modelo
User.query()
```

## `preload`
Relacionamentos de pré-carregamento/carregamento rápido para o modelo.

```ts
const users = await User.query().preload('posts')
```

O método `preload` executará as consultas necessárias para carregar as postagens de todos os usuários e, em seguida, defini-las na instância do usuário.

Opcionalmente, você pode passar um retorno de chamada para modificar a consulta de relacionamento. O retorno de chamada recebe o construtor de consulta de modelo para o modelo relacionado.

```ts
User.query().preload('posts', (postsQuery) => {
  postsQuery.where('status', 'published')
})
```

Você também pode pré-carregar vários relacionamentos chamando o método `preload`.

```ts
User.query().preload('posts').preload('profile')
```

Os relacionamentos aninhados podem ser carregados chamando o método `preload` no construtor de consulta de modelo relacionado. O exemplo a seguir busca uma árvore de `usuários -> postagens -> comentários -> usuário`

```ts
const users = await User
  .query()
  .preload('posts', (postsQuery) => {
    postsQuery.preload('comments', (commentsQuery) => {
      commentsQuery.preload('user')
    })
  })
```

## `withCount`
O método `withCount` executa uma subconsulta para contar o número total de linhas para um relacionamento.

```ts
const users = await User.query().withCount('posts')

users.forEach((user) => {
  console.log(user.$extras.posts_count)
})
```

A contagem é adicionada ao objeto `$extras` do modelo, pois não é um atributo de modelo regular e é criado em tempo real para apenas uma consulta.

Além disso, `withCount` e `preload` não estão relacionados entre si. Se você quiser carregar linhas de relacionamento e também obter a contagem, precisará chamar ambos os métodos.

```ts
await User
  .query()
  .withCount('posts')
  .preload('posts')
```

Você também pode definir um nome de atributo personalizado para o valor da contagem.

```ts
const user = await User
  .query()
  .withCount('posts', (query) => {
    query.as('totalPosts')
  })
  .firstOrFail()

console.log(user.$extras.totalPosts)
```

## `withAggregate`
O método `withAggregate` permite que você defina uma função de agregação personalizada. Por exemplo: `sum` o saldo da conta.

```ts
const user = await User
  .query()
  .withAggregate('accounts', (query) => {
    query.sum('balance').as('accountsBalance')
  })
  .firstOrFail()

console.log(user.$extras.accountsBalance)
```

## `has`
O método `has` permite que você limite as linhas do modelo pai verificando a existência de um determinado relacionamento.

Por exemplo: Obtenha uma lista de usuários que têm uma ou mais postagens.

```ts
const users = await User.query().has('posts')
```

Você também pode definir uma contagem personalizada.

```ts
await User.query().has('posts', '>=', 2)
```

O método `has` tem as seguintes variantes.

| Método          | Descrição                                                         |
|-----------------|-------------------------------------------------------------------|
| `orHas`         | Adiciona uma cláusula or has para um determinado relacionamento.  |
| `andHas`        | Alias ​​para o método `has`.                                        |
| `doesntHave`    | Oposto do método `has`.                                           |
| `orDoesntHave`  | Oposto do método `orHas`.                                         |
| `andDoesntHave` | Alias ​​para o método `doesntHave`.                                 |

## `whereHas`
Semelhante ao método `has`. No entanto, o método `whereHas` permite definir restrições adicionais passando um retorno de chamada como o 2º argumento.

Por exemplo: Obtenha uma lista de usuários que têm uma ou mais postagens **publicadas**.

```ts
await User.query().whereHas('posts', (postsQuery) => {
  postsQuery.where('status', 'published')
})
```

O método `whereHas` tem as seguintes variantes

| Método                | Descrição                                                         |
|-----------------------|-------------------------------------------------------------------|
| `orWhereHas`          | Adiciona uma cláusula or has para um determinado relacionamento.  |
| `andWhereHas`         | Alias ​​para o método `whereHas`.                                   |
| `whereDoesntHave`     | Oposto do método `whereHas`.                                      |
| `orWhereDoesntHave`   | Oposto do método `orWhereHas`.                                    |
| `andWhereDoesntHave`  | Alias ​​para o método `whereDoesntHave`.                            |

## `sideload`
O método `sideload` funciona como um pipeline para passar um objeto arbitrário para a(s) instância(s) do modelo criada(s) após a execução da consulta.

Por exemplo: Passando o usuário atualmente conectado.

```ts
const users = await User.query().sideload(auth.user)

users.forEach((user) => {
  console.log(user.$sideloaded.user === auth.user) // true
})
```

O valor `sideloaded` também é passado para os relacionamentos pré-carregados.

## `withScopes`
O método `withScopes` permite que você aproveite os escopos de consulta definidos no modelo.

Comece definindo um escopo de consulta.

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'
import { scope } from '@adonisjs/lucid/orm'

export default class Team extends BaseModel {

  public static forUser = scope((query, user: User) => {
    const subQuery = Database
      .from('user_teams')
      .select('team_id')
      .where('user_teams.user_id', user.id)

    query.whereIn('id', subQuery)
  })

}
```

A propriedade `forUser` é um escopo de consulta que aceita o objeto `user` para buscar as equipes do usuário conectado no momento.

Agora você pode usar o escopo de consulta da seguinte forma

```ts
Team
  .query()
  .withScopes((scopes) => scopes.forUser(auth.user))
```

## `apply`

Alias ​​para o método [`withScopes`](#withscopes).

```ts
Team
  .query()
  .apply((scopes) => scopes.forUser(auth.user))
```

## `pojo`
O método `pojo` retorna os resultados do modelo como uma **matriz de objetos JavaScript simples** e não uma matriz de instâncias de modelo.

Além disso, nenhum gancho de ciclo de vida é executado ao usar o método `pojo`, pois os ganchos precisam de instâncias de modelo para funcionar.

```ts
const posts = await Post.query().pojo()

console.log(posts[0] instanceof Post) // false
```

## `paginate`
O método `paginate` no construtor de consultas ORM retorna um instanciador do [ModelPaginator](https://github.com/adonisjs/lucid/blob/develop/src/orm/paginator/index.ts). A classe do paginador Model tem um método `.serialize` adicional para serializar os modelos.

```ts
const posts = await Post.query().paginate(1)
const paginationJSON = posts.serialize({
  fields: ['title', 'id']
})
```

## `model`
Referência ao `model` do qual a instância de consulta foi criada.

```ts
console.log(User.query().model === User) // true
```
