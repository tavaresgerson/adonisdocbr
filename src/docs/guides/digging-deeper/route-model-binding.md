# Route Model Binding

O AdonisJS fornece um recurso poderoso de route model binding, que permite que você vincule os parâmetros de rota com modelos Lucid e consulte automaticamente o banco de dados.

O pacote deve ser instalado e configurado separadamente. Você pode instalá-lo executando o seguinte comando.

:::code-group

```sh [Instale]
npm i @adonisjs/route-model-binding@1.0.1
```

```sh [Configure]
node ace configure @adonisjs/route-model-binding

# UPDATE: tsconfig.json { types += "@adonisjs/route-model-binding/build/adonis-typings" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/route-model-binding/build/providers/RmbProvider" }
```

```ts [Registre o middleware]
/**
 * Certifique-se de adicionar o seguinte middleware global dentro
 * do arquivo start/kernel.ts
 */
Server.middleware.register([
  // ...other middleware
  () => import('@ioc:Adonis/Addons/RmbMiddleware'),
])
```
 
:::

- Funciona com todos os drivers de banco de dados
- Lógica de pesquisa personalizável

&nbsp;

- [Ver no npm](https://www.npmjs.com/package/@adonisjs/route-model-binding)
- [Ver no GitHub](https://github.com/adonisjs/route-model-binding)

## Exemplo

A vinculação do modelo de rota é uma maneira bacana de remover consultas Lucid de uma linha da sua base de código e usar convenções para consultar o banco de dados durante solicitações HTTP.

No exemplo a seguir, conectamos os parâmetros de rota `:post` e `:comments` com os argumentos aceitos pelo método `show`.

- O valor do primeiro parâmetro da URL será usado para consultar o primeiro modelo tipado no método `show` (por exemplo, Post).
- Da mesma forma, o valor do segundo parâmetro será usado para consultar o segundo modelo tipado (por exemplo, Comment).

::: info NOTA
Os parâmetros e modelos são conectados usando a ordem em que aparecem e não o nome. Isso ocorre porque os decoradores TypeScript não podem saber os nomes dos argumentos aceitos por um método.
:::

```ts
// Arquivo de rotas

Route.get('posts/:post/comments/:comment', 'PostsController.show')
```

```ts
// Controlador

import { bind } from '@adonisjs/route-model-binding'
import Post from 'App/Models/Post'
import Comment from 'App/Models/Comment'

export default class PostsController {
  @bind()
  public async show({}, post: Post, comment: Comment) {
    return { post, comment }
  }
}
```

::: info NOTA
**Você é um aprendiz visual**? Confira [estes screencasts](https://learn.adonisjs.com/series/route-model-binding/introduction) para aprender sobre a vinculação do modelo de rota, sua configuração e uso.
:::

## Uso básico
Comece com o exemplo mais básico e ajuste o nível de complexidade para atender a diferentes casos de uso.

No exemplo a seguir, vincularemos o modelo `Post` ao primeiro parâmetro na rota `posts/:id`.

```ts
Route.get('/posts/:id', 'PostsController.show')
```

```ts
import { bind } from '@adonisjs/route-model-binding'
import Post from 'App/Models/Post'

export default class PostsController {
  @bind()
  public async show({}, post: Post) {
    return { post }
  }
}
```

::: aviso NOTA
Certifique-se de sempre importar seu modelo com um `import` e não um `import type`. Caso contrário, o decorador `bind` não conseguirá recuperar a classe do seu modelo e não funcionará.

**Usuário ESLint?** - Dê uma olhada [aqui](#compatibility-with-eslint)
:::

Os parâmetros e modelos são correspondidos na ordem em que são definidos. Portanto, o primeiro parâmetro na URL corresponde ao primeiro modelo com sugestão de tipo no método do controlador.

A correspondência não é realizada usando o nome do argumento do método do controlador porque os decoradores TypeScript não podem lê-los (então a limitação técnica nos deixa apenas com a correspondência baseada na ordem).

## Alterando a chave de pesquisa
Por padrão, a chave primária do modelo é usada para encontrar uma linha correspondente no banco de dados. Você pode alterá-la globalmente ou para apenas uma rota específica.

### Alterar chave de pesquisa globalmente via modelo
Após a alteração a seguir, a postagem será consultada usando a propriedade `slug`, não a chave primária. Em poucas palavras, a consulta `Post.findByOrFail('slug', value)` é executada.

```ts
class Post extends BaseModel {
  public static routeLookupKey = 'slug'
}
```

### Alterar a chave de pesquisa para uma única rota.
O exemplo a seguir define a chave de pesquisa diretamente na rota entre parênteses.

```ts
Route.get('/posts/:id(slug)', 'PostsController.show')
```

**Você notou que nossa rota agora parece um pouco estranha?**\
O parâmetro é escrito como `:id(slug)`, o que não traduz bem. Portanto, com a vinculação do modelo de rota, recomendamos usar o nome do modelo como o parâmetro de rota porque não estamos mais lidando com o `id`. Em vez disso, estamos buscando instâncias de modelo do banco de dados.

A seguir está a melhor maneira de escrever a mesma rota.

```ts
Route.get('/posts/:post(slug)', 'PostsController.show')
```

## Alterar lógica de pesquisa
Você pode alterar a lógica de pesquisa definindo um método estático `findForRequest` no próprio modelo. O método recebe os seguintes parâmetros.

- `ctx` - O contexto HTTP para a solicitação atual
- `param` - O parâmetro analisado. O parâmetro tem as seguintes propriedades.
- `param.name` - O nome normalizado do parâmetro.
- `param.param` - O nome original do parâmetro definido na rota.
- `param.scoped` - Se `true`, o parâmetro deve ter como escopo seu modelo pai.
- `param.lookupKey` - A chave de pesquisa definida na rota ou no modelo.
- `param.parent` - O nome do parâmetro pai.
- `value` - O valor do parâmetro durante a solicitação atual.

No exemplo a seguir, consultamos apenas postagens publicadas. Além disso, garanta que esse método retorne uma instância do modelo ou gere uma exceção.

```ts
class Post extends BaseModel {
  public static findForRequest(ctx, param, value) {
    const lookupKey = param.lookupKey === '$primaryKey' ? 'id' : param.lookupKey

    return this
      .query()
      .where(lookupKey, value)
      .whereNotNull('publishedAt')
      .firstOrFail()
  }
}
```

## Parâmetros com escopo
Ao trabalhar com recursos de rota aninhados, você pode querer definir o escopo do segundo parâmetro como um relacionamento com o primeiro parâmetro.

Um ótimo exemplo é encontrar um comentário de postagem por id e garantir que ele seja um filho da postagem mencionada dentro do mesmo URL.

O `posts/1/comments/2` deve retornar 404 se o id da postagem do comentário não for `1`.

Você pode definir parâmetros de escopo usando o `>` maior que um sinal ou conhecido como o [sinal de breadcrumb](https://www.smashingmagazine.com/2009/03/breadcrumbs-in-web-design-examples-and-best-practices/#:~:text=You%20also%20see%20them%20in,the%20page%20links%20beside%20it.)

```ts
Route.get('/posts/:post/comments/:>comment', 'PostsController.show')
```

```ts
import { bind } from '@adonisjs/route-model-binding'
import Post from 'App/Models/Post'
import Comment from 'App/Models/Comment'

export default class PostsController {
  @bind()
  public async show({}, post: Post, comment: Comment) {
    return { post, comment }
  }
}
```

Para que o exemplo acima funcione, você deve definir os `comentários` como um relacionamento no modelo `Post`. O tipo de relacionamento não importa.

```ts
class Post extends BaseModel {
  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>
}
```

O nome do relacionamento é pesquisado, convertendo o nome do parâmetro para `camelCase`. Usaremos as formas plural e singular para encontrar o relacionamento.

### Personalizando a pesquisa de relacionamento
Por padrão, o relacionamento é buscado usando a chave de pesquisa do modelo filho vinculado. Efetivamente, a consulta a seguir é executada.

```ts
await parent
  .related('relationship')
  .query()
  .where(lookupKey, value)
  .firstOrFail()
```

No entanto, você pode personalizar a pesquisa definindo o método `findRelatedForRequest` no modelo (observe que este não é um método estático).

```ts
class Post extends BaseModel {
  public findRelatedForRequest(ctx, param, value) {
    /**
     * Tenho que fazer essa dança estranha por causa disso:
     * https://github.com/microsoft/TypeScript/issues/37778
     */
    const self = this as unknown as Post
    const lookupKey = param.lookupKey === '$primaryKey' ? 'id' : param.lookupKey

    if (param.name === 'comment') {
      return self
      .related('comments')
      .query()
      .where(lookupKey, value)
      .firstOrFail()
    }
  }
}
```

## Parâmetros não vinculados
Você frequentemente terá parâmetros que são valores brutos e não podem ser vinculados a um modelo. No exemplo a seguir, `version` é um valor de string regular e não é respaldado usando o banco de dados.

```ts
Route.get(
  '/api/:version/posts/:post',
  'PostsController.show'
)
```

Você pode representar `version` como uma string no método do controlador, e não realizaremos nenhuma pesquisa no banco de dados. Por exemplo:

```ts
import { bind } from '@adonisjs/route-model-binding'
import Post from 'App/Models/Post'

class PostsController {
  @bind()
  public async show({}, version: string, post: Post) {}
}
```

Como os parâmetros de rota e os argumentos do método do controlador são correspondidos na mesma ordem em que são definidos, você sempre terá que dar type-hint em todos os parâmetros.

## Compatibilidade com ESLint
Se você usar a regra `@typescript-eslint/consistent-type-imports`, você notará que ela substituirá automaticamente seu `import` por `import type`. Infelizmente, isso acabará quebrando a vinculação do modelo de rota, pois os tipos serão removidos em tempo de execução, então o decorador `bind` não pode recuperar a classe do seu modelo.

Você precisará habilitar o linting com reconhecimento de tipo. Você pode seguir este documento:

https://typescript-eslint.io/docs/linting/typed-linting/
