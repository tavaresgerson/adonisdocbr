---
summary: Aprenda a serializar instâncias de modelo para objetos JavaScript simples.
---

# Serializando modelos

Se você criar um servidor de API, talvez queira converter as instâncias de modelo para objetos JSON simples antes de enviá-las ao cliente em resposta.

O processo de transformar instâncias de classe para objetos JSON simples é conhecido como serialização. Durante o processo de serialização, você também pode querer:

- Converter os nomes de propriedade do modelo `camelCase` para `snake_case`.

- Ocultar/remover algumas das propriedades das respostas da API. Por exemplo: Remover a propriedade `password` do modelo User.

- Converter/mutar valores. Por exemplo: Converter os timestamps para uma string ISO.

- Adicionar propriedades computadas adicionais. Por exemplo: Calcular o `fullName` do primeiro e último nome do usuário.

Você pode executar todas essas transformações dentro de seus modelos sem criar quaisquer transformadores ou classes de recursos separados.

::: info NOTA
Não há necessidade de serializar seus modelos para JSON ao usá-los dentro dos modelos do Edge. A serialização é necessária apenas para servidores de API que retornam respostas JSON.
:::

## Exemplo básico

Você pode serializar um modelo chamando o método `serialize` ou `toJSON`. Por exemplo:

```ts
const post = await Post.find(1)
const postJSON = post.serialize()
```

Você pode serializar uma matriz de instâncias de modelo chamando o método `Array.map`.

```ts
const posts = await Post.all()
const postsJSON = posts.map((post) => post.serialize())
```

### Serializando resultados paginados

Ao trabalhar com resultados paginados, você pode serializar os modelos chamando o método `.serialize` na instância do paginador.

O método `paginator.serialize` retorna um objeto com as propriedades `meta` e `data`. `meta` é o [metadado de paginação](../guides/pagination.md#serializing-to-json) e `data` é uma matriz de modelos serializados.

```ts
const posts = await Post.query().paginate(1)
const paginationJSON = posts.serialize()

/**
 {
    meta: {},
    data: []
 }
 */
```

### Propriedades computadas

Durante o processo de serialização, o modelo retorna um objeto com propriedades usando o decorador `@column`. Se você quiser serializar quaisquer propriedades adicionais, use o decorador `@computed`.

```ts {12-15}
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare body: string

  @computed()
  get excerpt() {
    return string.truncate(this.body, 50)
  }
}
```

### Renomeando propriedades

Você pode renomear os nomes de propriedades serializadas usando a opção `serializeAs`. Você ainda acessará a propriedade pelo seu nome real no modelo, mas a saída serializada usará o nome `serializeAs`. Por exemplo:

::: info NOTA
Use [Estratégia de nomenclatura de modelo](./naming_strategy.md) se quiser substituir a convenção de nomenclatura para todas as propriedades serializadas.
:::

```ts {8-9}
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ serializeAs: 'content' })
  declare body: string
}
```

```ts
const post = await Post.find(1)
post.serialize()

/**
 {
    id: 1,
    content: 'Adonis 101'
 }
 */
```

### Ocultando propriedades

Você pode remover as propriedades do modelo da saída serializada definindo o valor `serializeAs` como `null`. Por exemplo:

```ts {11-12}
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string
}
```

```ts
const user = await User.find(1)
user.serialize()

/**
 {
    id: 1,
    email: 'virk@adonisjs.com'
 }
 */
```

### Mutando/transformando valores

Você também pode transformar um valor de propriedade durante a serialização definindo o método `serialize`. Ele recebe o valor atual da propriedade e o valor de retorno é passado para a saída serializada.

::: info NOTA
Certifique-se de proteger a implementação do método contra os valores `null`.
:::

```ts {8-14}
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc').toISO() : value
    },
  })
  declare createdAt: DateTime
}
```

## Serializando relacionamentos

Os relacionamentos `preloaded` são serializados automaticamente toda vez que você serializa uma instância de modelo. Por exemplo:

```ts
const posts = await Post.query().preload('comments')

const postsJSON = posts.map((post) => post.serialize())
```

No exemplo acima, os `comentários` para todas as postagens serão serializados para o objeto de postagem. Por exemplo:

```ts
{
  id: 1,
  title: 'Adonis 101',
  comments: [{
    id: 1,
    content: 'Nice article'
  }]
}
```

Você pode alterar o nome da propriedade do relacionamento definindo a opção `serializeAs` na definição do relacionamento.

```ts {10-13}
import { DateTime } from 'luxon'
import Comment from '#models/comment'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Comment, {
    serializeAs: 'postComments',
  })
  comments: HasMany<typeof Comment>
}
```

```ts
const posts = await Post.query().preload('comments')

const postsJSON = posts.map((post) => post.serialize())

/**
{
  id: 1,
  title: 'Adonis 101',
  postComments: [{
    id: 1,
    content: 'Nice article'
  }]
}
*/
```

Se você não quiser serializar um relacionamento, você pode definir `serializeAs = null`.

## Serializando objeto `$extras`

Os valores de resultado da consulta que não são definidos como colunas no modelo são movidos para o objeto `$extras`.

Por exemplo, na consulta a seguir, buscamos o `category_name` usando uma subconsulta. No entanto, seu modelo não tem conhecimento sobre isso na coluna `category_name` em tempo real e, portanto, moveremos seu valor para o objeto `$extras`.

```ts
const post = await Post.query()
  .select('*')
  .select(
    db
      .from('categories')
      .select('name')
      .whereColumn('posts.category_id', 'categories.id')
      .limit('1')
      .as('category_name')
  )
  .first()
```

Você pode acessar o objeto extras da instância do modelo da seguinte forma:

```ts
post.$extras.category_name
```

Você também pode serializar o objeto `$extras` definindo a seguinte propriedade no modelo.

```ts
class Post extends BaseModel {
  /**
   * Serializar o objeto `$extras` como ele está
   */
  serializeExtras = true
}
```

Além disso, você pode personalizar as propriedades que deseja escolher do objeto extras declarando a propriedade `serializeExtras` como uma função.

```ts
class Post extends BaseModel {
  serializeExtras() {
    return {
      category: {
        name: this.$extras.category_name,
      },
    }
  }
}
```

## Seleção seletiva de campos/relacionamentos

A API de seleção seletiva foi projetada tendo o consumidor da API em mente. Algumas das opções podem parecer prolixas ou menos intuitivas, mas quando você olha para elas da perspectiva do consumidor da API, as coisas começam a fazer mais sentido.

---

### Seleção/omissão de campos

Você pode passar uma árvore de campos/relacionamentos para selecionar ou omitir dos resultados finais durante o processo de serialização. Por exemplo:

```ts
const post = await Post.find(1)

posts.serialize({
  fields: {
    pick: ['id', 'title', 'createdAt'],
  },
})
```

Em vez de selecionar campos, você também pode definir os campos para `omitir`. Quando ambos são especificados, `omit` vencerá o array `pick`.

```ts
const post = await Post.find(1)

posts.serialize({
  fields: {
    omit: ['createdAt', 'updatedAt'],
  },
})
```

---

### Seleção de relacionamentos e seus campos

Você também pode selecionar seletivamente os nós de relação completos ou selecionar/omitir campos dos relacionamentos.

```ts
const post = await Post.query().preload('comments').preload('category').preload('author').first()

post.serialize({
  fields: {
    pick: ['id', 'title', 'body'],
  },
  relations: {
    comments: {
      fields: ['id', 'body'],
    },
    author: {
      fields: ['id', 'email', 'avatar_url'],
    },
  },
})
```

A árvore de serialização pode parecer prolixa a princípio. No entanto, a maioria dos servidores de API não define os campos ou seleciona/omite manualmente e geralmente os calcula a partir da sequência de consulta de URL.

---

### Pontos a serem observados

- A API de seleção seletiva **usa os nomes de propriedade de serialização** e **não os nomes de propriedade do modelo**.
- Novamente, do ponto de vista do consumidor da API, eles não sabem o nome da propriedade que você definiu no modelo. Eles só podem ver a resposta JSON e selecionar seletivamente usando os mesmos nomes de propriedade.
- A API de seleção seletiva não pode substituir a opção `serializeAs = null`. Caso contrário, alguém pode definir o campo `password` na sequência de consulta de URL para visualizar todas as senhas com hash.
