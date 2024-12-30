# Paginação

O Lucid tem suporte interno para **paginação baseada em deslocamento**. Você pode paginar os resultados de uma consulta encadeando o método `.paginate`.

O método `paginate` aceita o número da página como o primeiro argumento e as linhas a serem buscadas como o segundo argumento. Internamente, executamos uma consulta adicional para contar o número total de linhas.

```ts
const page = request.input('page', 1)
const limit = 10

const posts = await Database.from('posts').paginate(page, limit)
console.log(posts)
```

O método `paginate` retorna uma instância do [SimplePaginatorClass](../../reference/database/query-builder.md#pagination). Ele contém os metadados para a paginação, juntamente com as `rows` buscadas.

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
::: info NOTA
É recomendável usar o método `orderBy` ao usar a paginação para evitar uma ordem diferente toda vez que você consultar os dados.
:::

## Exibindo links de paginação
A seguir está um exemplo completo de exibição de links de paginação dentro de um modelo Edge.

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

class PostsController {
  public async index ({ request, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    const posts = await Database.from('posts').paginate(page, limit)

    // Altera a baseURL para os links de paginação
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

<div> // [!code highlight]
  @each(anchor in posts.getUrlsForRange(1, posts.lastPage)) // [!code highlight]
    <a href="{{ anchor.url }}"> // [!code highlight]
      {{ anchor.page }} // [!code highlight]
    </a>  // [!code highlight]
  @endeach  // [!code highlight]
</div> // [!code highlight]
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

![](/docs/assets/lucid-pagination.png)

## Serializando para JSON
Você também pode serializar os resultados do paginador para JSON chamando o método `toJSON`. Ele retorna os nomes das chaves em `snake_case` por padrão. No entanto, você pode passar uma [estratégia de nomenclatura](../../reference/orm/naming-strategy.md#paginationmetakeys) para substituir a convenção padrão.

```ts
const posts = await Database.from('posts').paginate(page, limit)
return posts.toJSON()
```

```json
{
  "meta": {
    "total": 50,
    "per_page": 5,
    "current_page": 1,
    "last_page": 10,
    "first_page": 1,
    "first_page_url": "/?page=1",
    "last_page_url": "/?page=10",
    "next_page_url": "/?page=2",
    "previous_page_url": null
  },
  "data": []
}
```

No exemplo a seguir, substituímos a estratégia de nomenclatura para retornar chaves em `camelCase`.

```ts
const posts = await Database.from('posts').paginate(page, limit)

posts.namingStrategy = {
  paginationMetaKeys() {
    return {
      total: 'total',
      perPage: 'perPage',
      currentPage: 'currentPage',
      lastPage: 'lastPage',
      firstPage: 'firstPage',
      firstPageUrl: 'firstPageUrl',
      lastPageUrl: 'lastPageUrl',
      nextPageUrl: 'nextPageUrl',
      previousPageUrl: 'previousPageUrl',
    }
  }
}

return posts.toJSON()
```

Você também pode atribuir uma estratégia de nomenclatura personalizada ao construtor de classe `SimplePaginator` para substituí-la globalmente. O código a seguir deve ir dentro de um provedor ou um [arquivo de pré-carregamento](../fundamentals/adonisrc-file.md#preloads).

```ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async ready() {
    const Db = this.app.container.use('Adonis/Lucid/Database')  // [!code highlight]
                                                                // [!code highlight]
    Db.SimplePaginator.namingStrategy = {                       // [!code highlight]
      paginationMetaKeys() {                                    // [!code highlight]
        return {                                                // [!code highlight]
          // ... o mesmo que acima                              // [!code highlight]
        }                                                       // [!code highlight]
      }                                                         // [!code highlight]
    }                                                           // [!code highlight]
  }
}

```

## Leitura adicional
[Guia de referência da classe Paginator](../../reference/database/query-builder.md#pagination)
