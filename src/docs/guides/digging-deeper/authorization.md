# Autorização

::: tip DICA
**Aprendiz visual?** - Confira a série de screencasts gratuitos [AdonisJS Bouncer](https://adocasts.com/series/adonisjs-bouncer) dos nossos amigos da Adocasts.
:::

O AdonisJS vem com uma estrutura de autorização para ajudar você a autorizar ações do usuário em um determinado recurso. Por exemplo, verificar se um usuário logado tem permissão para editar uma determinada postagem ou não.

O suporte para autorização é adicionado pelo pacote `@adonisjs/bouncer`, e você deve instalá-lo separadamente.

::: info NOTA
O pacote `@adonisjs/bouncer` precisa do pacote `@adonisjs/auth` para procurar o usuário logado no momento. Certifique-se de configurar o pacote auth primeiro.
:::

:::code-group

```sh [Instale]
npm i @adonisjs/bouncer@2.3.0
```

```sh [Configure]
node ace configure @adonisjs/bouncer

# CREATE: start/bouncer.ts
# CREATE: contracts/bouncer.ts
# UPDATE: tsconfig.json { types += "@adonisjs/bouncer" }
# UPDATE: .adonisrc.json { commands += "@adonisjs/bouncer/build/commands" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/bouncer" }
# UPDATE: .adonisrc.json { preloads += "./start/bouncer" }
# CREATE: ace-manifest.json file
```

:::

## Exemplo básico
O objetivo principal do pacote Bouncer é ajudar você a extrair a lógica de autorização para ações ou políticas em vez de escrevê-la em todos os lugares da sua base de código.

Você pode definir uma ação Bouncer dentro do arquivo `start/bouncer.ts`. O método `Bouncer.define` aceita o nome da ação e o fechamento para escrever a lógica de autorização.

```ts
import Post from 'App/Models/Post'
import User from 'App/Models/User'

export const { actions } = Bouncer
  .define('viewPost', (user: User, post: Post) => {
    return post.userId === user.id
  })
```

Você pode definir várias ações encadeando o método `.define` várias vezes. Por exemplo:

```ts
export const { actions } = Bouncer
  .define('viewPost', (user: User, post: Post) => {
    return post.userId === user.id
  })
  .define('editPost', (user: User, post: Post) => {
    return post.userId === user.id
  })
  .define('deletePost', (user: User, post: Post) => {
    return post.userId === user.id && post.status !== 'published'
  })
```

Depois de definir a ação, você pode acessá-la dentro dos seus manipuladores de rota usando o objeto `ctx.bouncer`.

O método `bouncer.authorize` aceita o nome da ação e os argumentos que recebe. O `user` é **inferido do usuário atualmente conectado**. Portanto, não há necessidade de passar o usuário explicitamente.

```ts {7}
import Route from '@ioc:Adonis/Core/Route'
import Post from 'App/Models/Post'

Route.get('posts/:id', async ({ bouncer, request }) => {
  const post = await Post.findOrFail(request.param('id'))

  await bouncer.authorize('viewPost', post)
})
```

## Definindo ações
Você pode definir uma ação inline usando o método `Bouncer.define`. Como as permissões geralmente são verificadas em relação a um usuário, sua ação deve aceitar o usuário como o primeiro argumento, seguido por quaisquer outros dados necessários para expressar a lógica de autorização.

```ts
import Post from 'App/Models/Post'
import User from 'App/Models/User'

export const { actions } = Bouncer
  .define('viewPost', (
    user: User, // O usuário deve ser sempre o primeiro argumento
    post: Post
  ) => {
    return post.userId === user.id
  })
```

### Usando diferentes modelos de usuário
Você não está limitado apenas a usar o modelo `User`. Você também pode definir ações que precisam de um modelo de usuário diferente, e o Bouncer usará a inferência de tipos TypeScript para filtrar as ações aplicáveis ​​a um determinado tipo de usuário.

Confira o vídeo a seguir como um exemplo do mesmo.

### Usuário convidado
Às vezes, você pode querer escrever ações que também podem funcionar sem um usuário. Por exemplo, você quer permitir que um visitante convidado visualize todas as postagens publicadas. No entanto, uma postagem não publicada deve ser visível apenas para o autor da postagem.

Neste cenário, você deve definir a propriedade `options.allowGuest` como `true`.

::: info NOTA
Se `allowGuest !== true` e não houver nenhum usuário conectado, o Bouncer nem mesmo chamará a ação e negará a solicitação implicitamente.
:::

```ts
export const { actions } = Bouncer
  .define('viewPost', (user: User | null, post: Post) => {
    if (post.status === 'published') {
      return true
    }

    if (!user) {
      return false
    }

    return post.userId === user.id
  }, {
    allowGuest: true, // 👈
  })
```

### Negar acesso
Uma ação pode negar o acesso retornando um valor ** não verdadeiro** do fechamento da ação, e o Bouncer converterá isso em um código de status `403`.

No entanto, você também pode retornar uma mensagem personalizada e um código de status da própria ação usando o método `Bouncer.deny`.

```ts
export const { actions } = Bouncer
  .define('viewPost', (user: User, post: Post) => {
    if (post.userId === user.id || post.status === 'published') {
      return true
    }

    return Bouncer.deny('Post not found', 404)
  })
```

## Autorizando ações
Você pode autorizar um usuário contra um conjunto de ações predefinidas usando o método `bouncer.authorize`. Ele aceita o nome da ação para autorizar, junto com os argumentos que aceita (excluindo o primeiro argumento reservado para o usuário).

O método `authorize` gera uma [AuthorizationException](https://github.com/adonisjs/bouncer/blob/9c230c5f5e52779462c907fb46448f1f53f31fd3/src/Exceptions/AuthorizationException.ts), quando a ação nega o acesso.

```ts
Route.get('posts/:id', async ({ bouncer, request }) => {
  const post = await Post.findOrFail(request.param('id'))

  // Autorizar acesso do usuário para uma determinada postagem
  await bouncer.authorize('viewPost', post)
})
```

Por padrão, o objeto `ctx.bouncer` autoriza as ações contra o usuário atualmente conectado. No entanto, você pode definir um usuário explicitamente usando o método `forUser`.

```ts
const admin = await Admin.findOrFail(1)

// Obter uma instância filho para o modelo de administração
const adminAuthorizer = bouncer.forUser(admin)

await adminAuthorizer.authorize('viewPost', post)
```

### `bouncer.allows`
O método `bouncer.allows` aceita o mesmo conjunto de argumentos que o método `bouncer.authorize`. No entanto, em vez de lançar uma exceção, ele retorna um valor booleano indicando se uma ação é permitida ou não.

```ts
if (await bouncer.allows('viewPost', post)) {
  // faça alguma coisa
}
```

### `bouncer.denies`
O oposto de `bouncer.allows` é o método `bouncer.denies`.

```ts
if (await bouncer.denies('editPost', post)) {
  // faça alguma coisa
}
```

## Ganchos do Bouncer
Os ganchos do Bouncer permitem que você defina ganchos do ciclo de vida `before` e `after`. Você pode usar esses ganchos do ciclo de vida para conceder privilégios especiais a um administrador ou superusuário.

### Antes do gancho
No exemplo a seguir, um superusuário recebe todo o acesso dentro do gancho do ciclo de vida `before`.

```ts
// start/bouncer.ts

Bouncer.before((user: User | null) => {
  if (user && user.isSuperUser) {
    return true
  }
})
```

- O retorno de chamada de ação real nunca é executado quando um gancho before retorna um valor `true` ou `false`.
- Certifique-se de retornar `undefined` se quiser que o Bouncer execute o próximo gancho ou o retorno de chamada de ação.
- O gancho `before` é sempre executado, mesmo quando não há um usuário conectado. Certifique-se de lidar com o caso de uso de um usuário ausente dentro do retorno de chamada do gancho.
- O gancho `before` recebe o **nome da ação** como o segundo argumento.

### Gancho After
Os ganchos `after` são executados após a execução do retorno de chamada de ação. Se um gancho `after` retornar um valor `true` ou `false`, ele será considerado a resposta final e descartaremos a resposta da ação.

```ts
Bouncer.after((user: User | null, action, actionResult) => {
  if (actionResult.authorized) {
    console.log(`${action} was authorized`)
  } else {
    console.log(`${action} denied with "${actionResult.errorResponse}" message`)
  }
})
```

## Usando políticas
Expressar todas as permissões do aplicativo como ações dentro de um único arquivo não é prático e, portanto, o bouncer permite que você extraia as permissões para arquivos de política dedicados.

Normalmente, você criará uma política para um determinado recurso. Por exemplo, uma política para gerenciar as permissões do **recurso Post**, outra política para gerenciar as permissões do **recurso Comment** e assim por diante.

### Criando um arquivo de política
Você pode criar uma política executando o seguinte comando Ace. As políticas são armazenadas dentro do diretório `app/Policies`. No entanto, você pode personalizar o local atualizando a propriedade `namespaces.policies` dentro do [arquivo .adonisrc.json](../fundamentals/adonisrc-file.md#namespaces).

```sh
node ace make:policy Post

# CREATE: app/Policies/PostPolicy.ts
```

Cada classe de política estende a `BasePolicy`, e os **métodos públicos da classe são tratados como ações de política**.

As ações de política funcionam de forma semelhante às ações autônomas do bouncer. O primeiro parâmetro é reservado para o usuário, e a ação pode aceitar qualquer número de parâmetros adicionais.

```ts
import User from 'App/Models/User'
import Post from 'App/Models/Post'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'

export default class PostPolicy extends BasePolicy {
  public async view(user: User, post: Post) {
    return post.userId === user.id
  }
}
```

### Registrando a política com o Bouncer
Além disso, certifique-se de registrar a política recém-criada dentro do arquivo `start/bouncer.ts`. O método `registerPolicies` aceita um par chave-valor. A chave é o nome da política, e o valor é uma função para importar o arquivo de política lentamente.

```ts
export const { policies } = Bouncer.registerPolicies({
  PostPolicy: () => import('App/Policies/PostPolicy')
})
```

### Usando a política
Depois que a política for registrada, você pode acessá-la usando o método `bouncer.with`.

```ts {7-9}
import Route from '@ioc:Adonis/Core/Route'
import Post from 'App/Models/Post'

Route.get('posts/:id', async ({ bouncer }) => {
  const post = await Post.findOrFail(1)

  await bouncer
    .with('PostPolicy')
    .authorize('view', post)
})
```

### Ganchos de política
As políticas também podem definir ganchos implementando os métodos `before` e `after`. Novamente, os ganchos seguem o mesmo ciclo de vida dos [ganchos de bouncer autônomos](#bouncer-hooks).

```ts
import User from 'App/Models/User'
import Post from 'App/Models/Post'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'

export default class PostPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.isSuperUser) {
      return true
    }
  }

  public async view(user: User, post: Post) {
    return post.userId === user.id
  }
}
```

### Usuário convidado
Para autorizar solicitações para usuários convidados, você terá que marcar as ações de política com o decorador `@action` e definir `options.allowGuests = true`.

```ts
export default class PostPolicy extends BasePolicy {

  @action({ allowGuest: true })
  public async view(user: User | null, post: Post) {
    if (post.status === 'published') {
      return true
    }

    if (!user) {
      return false
    }

    return post.userId === user.id
  }
}
```

## Uso dentro dos modelos do Edge
Você pode usar as tags `@can` e `@cannot` para exibir a parte específica da sua marcação condicionalmente. Por exemplo: ocultar os links para excluir e editar a postagem quando o usuário não puder executar essas ações.

```edge
@can('editPost', post)
  <a href="{{ route('posts.edit', [post.id]) }}"> Edit </a>
@end

@can('deletePost', post)
  <a href="{{ route('posts.delete', [post.id]) }}"> Delete </a>
@end
```

Você também pode referenciar as ações de uma política usando a notação de ponto. O primeiro segmento é o nome da política e a segunda seção é a ação da política.

::: info NOTA
Os nomes das políticas estão dentro do arquivo `start/bouncer.ts`. A chave do objeto `registerPolicies` é o nome da política.
:::

```edge
@can('PostPolicy.edit', post)
  <a href="{{ route('posts.edit', [post.id]) }}"> Edit </a>
@end
```

Além disso, você pode escrever o condicional inverso usando a tag `@cannot`.

```edge
@cannot('PostPolicy.edit')
  <!-- Marcação -->
@end
```

As tags `@can` e `@cannot` autorizam as ações contra o usuário atualmente conectado. Se a ação de bouncer/política subjacente precisar de um usuário diferente, você terá que passar uma instância de autorizador explícita.

```edge
@can('PostPolicy.edit', bouncer.forUser(admin), post)
@end
```

No exemplo acima, o segundo argumento, `bouncer.forUser(admin)`, é uma instância filha de bouncer para um usuário específico, seguido pelos argumentos de ação.
