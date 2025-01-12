# Paginação

O Lucid tem suporte interno para **paginação baseada em deslocamento**. Você pode paginar os resultados de uma consulta encadeando o método `.paginate`.

O método `paginate` aceita o número da página como o primeiro argumento e as linhas a serem buscadas como o segundo argumento. Internamente, executamos uma consulta adicional para contar o número total de linhas.

```ts
const page = request.input('page', 1)
const limit = 10

const posts = await db.from('posts').paginate(page, limit)
console.log(posts)
```

O método `paginate` retorna uma instância da [SimplePaginatorClass](https://github.com/adonisjs/lucid/blob/develop/src/database/paginator/simple_paginator.ts). Ele contém os metadados para a paginação, juntamente com as `rows` buscadas.

```ts
SimplePaginator {
  perPage: 10,
  currentPage: 1,
  firstPage: 1,
  isEmpty: false,
  total: 50,
  hasTotal: true,
  lastPage: 5,
  hasMorePages: true,
  hasPages: true
}
```

:::note
É recomendável usar o método `orderBy` ao usar paginação para evitar uma ordem diferente toda vez que você consultar os dados.
:::

## Exibindo links de paginação

A seguir está um exemplo completo de exibição de links de paginação dentro de um modelo Edge.

```ts
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

class PostsController {
  async index({ request, view }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 10

    const posts = await db.from('posts').paginate(page, limit)

    // Changes the baseURL for the pagination links
    posts.baseUrl('/posts')

    return view.render('posts/index', { posts })
  }
}
```

Abra o arquivo `posts/index.edge` e cole o seguinte trecho de código dentro dele.

```edge
<div>
  @each(post in posts)
    <h1>{{ post.title }}</h1>
    <p> {{ excerpt(post.body, 200) }} </p>
  @endeach
</div>

<hr>

// highlight-start
<div>
  @each(anchor in posts.getUrlsForRange(1, posts.lastPage))
    <a href="{{ anchor.url }}">
      {{ anchor.page }}
    </a>
  @endeach
</div>
// highlight-end
```

O método `getUrlsForRange` aceita um intervalo de páginas e retorna uma matriz de objetos com as seguintes propriedades.

```ts
[
  {
    url: '/?page=1',
    page: 1,
    isActive: true,
    isSeperator: false,
  },
  {
    url: '/?page=2',
    page: 2,
    isActive: true,
    isSeperator: false,
  },
  // ...
]
```

![](https://res.cloudinary.com/adonis-js/image/upload/v1596970976/adonisjs.com/lucid-pagination.png)

## Serializando para JSON

Você também pode serializar os resultados do paginador para JSON chamando o método `toJSON`. Ele retorna os nomes das chaves em `camelCase` por padrão. No entanto, você pode passar uma [estratégia de nomenclatura](../models/naming_strategy.md#paginationmetakeys) para substituir a convenção padrão.

```ts
const posts = await db.from('posts').paginate(page, limit)
return posts.toJSON()
```

```json
{
  "meta": {
    "total": 50,
    "perPage": 5,
    "currentPage": 1,
    "lastPage": 10,
    "firstPage": 1,
    "firstPageUrl": "/?page=1",
    "lastPageUrl": "/?page=10",
    "nextPageUrl": "/?page=2",
    "previousPageUrl": null
  },
  "data": []
}
```

No exemplo a seguir, substituímos a estratégia de nomenclatura para retornar chaves em `snake_case`.

```ts
const posts = await db.from('posts').paginate(page, limit)

posts.namingStrategy = {
  paginationMetaKeys() {
    return {
      total: 'total',
      perPage: 'per_page',
      currentPage: 'current_page',
      lastPage: 'last_page',
      firstPage: 'first_page',
      firstPageUrl: 'first_page_url',
      lastPageUrl: 'last_page_url',
      nextPageUrl: 'next_page_url',
      previousPageUrl: 'previous_page_url',
    }
  },
}

return posts.toJSON()
```

Você também pode atribuir uma estratégia de nomenclatura personalizada ao construtor de classe `SimplePaginator` para substituí-lo globalmente dentro de um [provedor de serviços](https://docs.adonisjs.com/guides/service-providers)

```ts
import db from '@adonisjs/lucid/services/db'
import type { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  async ready() {
    // highlight-start
    db.SimplePaginator.namingStrategy = {
      paginationMetaKeys() {
        return {
          // ... same as above
        }
      },
    }
    // highlight-end
  }
}
```
