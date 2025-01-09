# Pagination

Lucid has inbuilt support for **offset-based pagination**. You can paginate the results of a query by chaining the `.paginate` method.

The `paginate` method accepts the page number as the first argument and the rows to fetch as the second argument. Internally, we execute an additional query to count the total number of rows.

```ts
const page = request.input('page', 1)
const limit = 10

const posts = await db.from('posts').paginate(page, limit)
console.log(posts)
```

The `paginate` method returns an instance of the [SimplePaginatorClass](https://github.com/adonisjs/lucid/blob/develop/src/database/paginator/simple_paginator.ts). It holds the meta data for the pagination, alongside the fetched `rows`.

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
It is recommended to use the `orderBy` method when using pagination to avoid a different order every time you query the data.
:::

## Displaying pagination links

Following is a complete example of displaying the pagination links inside an Edge template.

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

Open the `posts/index.edge` file and paste the following code snippet inside it.

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

The `getUrlsForRange` method accepts a range of pages and returns an array of objects with the following properties.

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

## Serializing to JSON

You can also serialize the paginator results to JSON by calling the `toJSON` method. It returns the key names in `camelCase` by default. However, you can pass a [naming strategy](../models/naming_strategy.md#paginationmetakeys) to override the default convention.

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

In the following example, we override the naming strategy to return keys in `snake_case`.

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

You can also assign a custom naming strategy to the `SimplePaginator` class constructor to override it globally inside a [service provider](https://docs.adonisjs.com/guides/service-providers)

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
