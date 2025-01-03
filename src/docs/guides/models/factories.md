# Fábricas de modelos

Você já escreveu testes, nos quais as primeiras **15-20 linhas** de cada teste são dedicadas apenas a configurar o estado do banco de dados usando vários modelos? Com ​​as fábricas de modelos, você pode extrair toda essa configuração para um arquivo dedicado e, em seguida, escrever o código mínimo para configurar o estado do banco de dados.

Ao final deste guia, você saberá:

- Como criar e usar fábricas
- Como definir estados de fábrica
- Trabalhando com relacionamentos de modelo
- Usando a API faker para gerar e usar dados aleatórios

## Criando fábricas

As fábricas de modelos são armazenadas dentro do diretório `databases/factories`. Você pode definir todas as fábricas em um único arquivo ou criar arquivos dedicados para cada modelo, a escolha é sua.

::: info NOTA
Você pode usar o comando `make:factory` para criar uma nova fábrica. O comando aceita o nome do modelo para o qual você deseja criar a fábrica.
:::

Ao contrário de seeders ou modelos, as fábricas são declarativas por natureza, como mostrado no exemplo a seguir:

```ts
// database/factories/index.ts

import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .build()
```

- O método `Factory.define` aceita um total de dois argumentos.
- O primeiro argumento é uma referência ao modelo Lucid.
- O segundo argumento é um retorno de chamada que retorna um objeto de propriedades a serem usadas ao persistir a instância do modelo. Certifique-se de retornar um objeto com todas as propriedades necessárias, caso contrário, o banco de dados levantará exceções `not null`.
- Por fim, certifique-se de chamar o método `build`.

## Usando fábricas
Usar fábricas é bem simples. Basta `importar` o arquivo e usar as fábricas exportadas.

```ts
import { UserFactory } from 'Database/factories'

const user = await UserFactory.create()
```

Para criar várias instâncias, você pode usar o método `createMany`.

```ts
const users = await UserFactory.createMany(10)
```

## Mesclando atributos
Você pode substituir o conjunto padrão de atributos usando o método `.merge`. Por exemplo:

```ts
await UserFactory
  .merge({ email: 'test@example.com' })
  .create()
```

Ao criar várias instâncias, você pode definir uma matriz de atributos e eles serão mesclados com base em seus índices. Por exemplo:

```ts
await UserFactory
  .merge([
    { email: 'foo@example.com' },
    { email: 'bar@example.com' },
  ])
  .createMany(3)
```

No exemplo acima

- O primeiro usuário terá o e-mail `foo@example.com`.
- O segundo usuário terá o e-mail `bar@example.com`.
- E o terceiro usuário usará o endereço de e-mail padrão, já que a matriz de mesclagem tem um comprimento de 2.

## Estados de fábrica
Os estados de fábrica permitem que você defina variações de suas fábricas como estados. Por exemplo: Em uma fábrica `Post`, você pode ter estados diferentes para **representar postagens publicadas e rascunhos**.

```ts
import Factory from '@ioc:Adonis/Lucid/Factory'
import Post from 'App/Models/Post'

export const PostFactory = Factory
  .define(Post, ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(4),
      status: 'DRAFT',
    }
  })
  .state('published', (post) => post.status = 'PUBLISHED') // 👈
  .build()
```

Por padrão, todas as postagens serão criadas com o status `DRAFT`. No entanto, você pode aplicar explicitamente o estado `published` para criar postagens com o status `PUBLISHED`.

```ts
await PostFactory.apply('published').createMany(3)
await PostFactory.createMany(3)
```

## Relacionamentos
As fábricas de modelos tornam super simples trabalhar com relacionamentos. Considere o seguinte exemplo:

```ts
export const PostFactory = Factory
  .define(Post, ({ faker }) => {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(4),
      status: 'DRAFT',
    }
  })
  .build()

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .relation('posts', () => PostFactory) // 👈
  .build()
```

Agora, você pode criar um `user` e seus `posts` todos juntos em uma chamada.

```ts
const user = await UserFactory.with('posts', 3).create()
user.posts.length // 3
```

### Pontos a serem observados
- A fábrica encontrará o tipo de relacionamento inspecionando o modelo Lucid. Por exemplo: se seu modelo define um relacionamento `hasMany` em `posts`, então a fábrica inferirá o mesmo.
- Um relacionamento primeiro precisa ser definido no modelo e então somente ele pode ser definido na Fábrica.
- O Lucid encapsulará internamente todas as operações do banco de dados dentro de uma transação. Então, se uma persistência de relacionamento falhar, a persistência do modelo pai também será revertida.

### Aplicando estados de relacionamento
Você também pode aplicar estados em um relacionamento passando um retorno de chamada para o método `with`.

```ts
const user = await UserFactory
  .with('posts', 3, (post) => post.apply('published'))
  .create()
```

Da mesma forma, se quiser, você pode criar algumas postagens com o estado `published` e algumas sem ele.

```ts
const user = await UserFactory
  .with('posts', 3, (post) => post.apply('published'))
  .with('posts', 2)
  .create()

user.posts.length // 5
```

Finalmente, você também pode criar relacionamentos aninhados. Por exemplo: Crie um usuário com **duas postagens** e **cinco comentários para cada postagem**.

```ts
const user = await UserFactory
  .with('posts', 2, (post) => post.with('comments', 5))
  .create()
```

### Atributos de pivô
Ao criar um relacionamento [muitos para muitos](relationships.md#manytomany), você pode definir os atributos para a tabela dinâmica usando o método `pivotAttributes`.

No exemplo a seguir, o modelo `Usuário` tem um relacionamento muitos para muitos com o modelo `Equipe` e definimos a função do usuário dentro de uma determinada equipe.

```ts
await UserFactory
  .with('teams', 1, (team) => {
    team.pivotAttributes({ role: 'admin' })
  })
  .create()
```

Você pode passar uma matriz de objetos para o método `pivotAttributes` ao criar várias instâncias do relacionamento.

::: info NOTA
O tamanho da matriz deve corresponder à contagem de linhas de relacionamento que você está prestes a criar.
:::

```ts
await UserFactory
  .with('teams', 2, (team) => {
    team.pivotAttributes([
      { role: 'admin' },
      { role: 'moderator' }
    ])
  })
  .create()
```

## Chamadas de banco de dados de stub
Em alguns casos, você pode preferir stub out das chamadas de banco de dados e apenas querer criar instâncias de modelo na memória. Isso pode ser alcançado usando os métodos `makeStubbed` e `makeStubbedMany`.

```ts
const user = await UserFactory
  .with('posts', 2)
  .makeStubbed()

console.log(user.id) // <some-id>
console.log(user.$isPersisted) // false
```

As chamadas stubbed nunca atingirão o banco de dados e atribuirão um `id` numérico na memória às instâncias do modelo.

### Personalizando o stub id

::: info NOTA
Quando dizemos `id`. Queremos dizer a chave primária de um modelo e não um atributo fixo nomeado `id`.
:::

O stub id é apenas um contador na memória, que continua aumentando a cada chamada. Se necessário, você pode definir um método personalizado para gerar stub ids de uma maneira diferente.

Por exemplo: Gerando ids como um `BigInt` ao usar o tipo de dados `bigInteger` do PostgreSQL.

```ts
import Factory from '@ioc:Adonis/Lucid/Factory'

Factory.stubId((counter, model) => {
  return BigInt(counter)
})
```

Você pode usar o hook `makeStubbed` para personalizar o comportamento de geração de id para uma fábrica individual.

```ts
Factory
  .define(Post, () => {
    return {}
  })
  .before('makeStubbed', (_, model) => {
    model.id = uuid.v4()
  })
```

## Contexto de tempo de execução
Toda vez que você cria uma instância de modelo de uma fábrica, um contexto de tempo de execução também é criado ao mesmo tempo. O contexto é então passado para todos os hooks, o retorno de chamada do método `define` e também os relacionamentos.

Na maioria das vezes, você só quer acessar o objeto `faker` do contexto. No entanto, a seguir estão as propriedades disponíveis.

- **isStubbed**: Um booleano para saber se a fábrica foi instanciada no modo stub.
- **$trx**: Um objeto de transação, sob o qual todas as operações de banco de dados são encapsuladas. Se você estiver executando consultas de banco de dados dentro dos hooks de fábrica, certifique-se de encapsulá-las também dentro da transação.

A seguir está um exemplo mostrando os retornos de chamada que recebem o contexto de tempo de execução `(ctx)`.

```ts
Factory
  .define(User, (ctx) => {
  })
  .before('create', (factory, model, ctx) => {
  })
  .after('create', (factory, model, ctx) => {
  })
  .state('admin', (model, ctx) => {
  })
  .build()
```

## Ganchos
A fábrica expõe os seguintes ganchos para executar ações `antes` ou `depois` de certos eventos. Você também pode definir vários ganchos para um único evento.

```ts
Factory
  .define(Post, () => {})
  .before('create', () => {})
  .after('create', () => {})
```

| Ciclo de vida | Evento        | Descrição   |
|---------------|---------------|-------------|
| `before`      | `create`      | Invocado **antes da consulta insert**. |
| `after`       | `create`      | Invocado **depois da consulta insert**. |
| `before`      | `makeStubbed` | Invocado **antes da chamada stubbed**. |
| `after`       | `makeStubbed` | Invocado **depois da chamada stubbed**. |
| `after`       | `make`        | Invocado somente **depois** que a instância do modelo foi criada. Este gancho também é invocado antes dos ganchos **before create** e **before makeStubbed**. |

## Conexões personalizadas
Factories permite que você defina uma conexão personalizada ou um cliente de consulta no momento em que os usa. Por exemplo:

```ts
await Factory.connection('tenant-1').create()
```

Além disso, você pode passar uma instância de cliente de consulta personalizada.
```ts
const queryClient = Database.connection('tenant-1')
await Factory.client(queryClient).create()
```

Para fins de uniformidade da API entre as factories e os modelos Lucid, você também pode definir a `connection` ou o `client` usando o método `query`.

```ts
await Factory.query({ connection: 'tenant-1' }).create()
```

## Personalizações
Finalmente, você pode personalizar opcionalmente o comportamento de certas operações realizadas nos bastidores.

### `newUp`
Ao definir o manipulador `newUp`, você pode personalizar o processo de instanciação de uma instância de modelo para uma factory específica.

```ts
Factory
  .define(User, () => {

  })
  .newUp((attributes, ctx) => {
    const user = new User()
    user.fill(attributes)

    return user
  })
  .build()
```

### `merge`
Ao definir o manipulador `merge`, você pode personalizar o comportamento de mesclagem.

```ts
Factory
  .define(User, () => {

  })
  .merge((user, attributes, ctx) => {
    user.merge(attributes)
  })
  .build()
```
