---
summary: Aprenda a usar o access tokens guard para autenticar solicitações HTTP usando tokens de acesso.
---

# Guarda de tokens de acesso

Os tokens de acesso autenticam solicitações HTTP em contextos de API onde o servidor não pode persistir cookies no dispositivo do usuário final, por exemplo, acesso de terceiros a uma API ou autenticação para um aplicativo móvel.

Os tokens de acesso podem ser gerados em qualquer formato; por exemplo, os tokens que estão em conformidade com o padrão JWT são conhecidos como tokens de acesso JWT, e os tokens em um formato proprietário são conhecidos como tokens de acesso opacos.

O AdonisJS usa tokens de acesso opacos que são estruturados e armazenados da seguinte forma.

- Um token é representado por um valor aleatório criptograficamente seguro sufixado com uma soma de verificação CRC32.
- Um hash do valor do token é persistido no banco de dados. Este hash é usado para verificar o token no momento da autenticação.
- O valor final do token é codificado em base64 e prefixado com `oat_`. O prefixo pode ser personalizado.
- [Ferramentas de varredura secreta](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning) identificam um token e evitam que ele vaze dentro de uma base de código.

## Configurando o modelo de usuário
Antes de usar a proteção de tokens de acesso, você deve configurar um provedor de tokens com o modelo de usuário. **O provedor de tokens é usado para criar, listar e verificar tokens de acesso**.

O pacote auth vem com um provedor de tokens de banco de dados, que persiste tokens dentro de um banco de dados SQL. Você pode configurá-lo da seguinte forma.

```ts {2,7}
import { BaseModel } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class User extends BaseModel {
  // ...resto das propriedades do modelo

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
```

O `DbAccessTokensProvider.forModel` aceita o modelo de usuário como o primeiro argumento e um objeto de opções como o segundo argumento.

```ts
export default class User extends BaseModel {
  // ...resto das propriedades do modelo

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
```

### `expiresIn`

A duração após a qual o token irá expirar. Você pode passar um valor numérico em segundos ou uma [expressão de tempo](https://github.com/poppinss/utils?tab=readme-ov-file#secondsparseformat) como uma string.

Por padrão, os tokens têm vida longa e não expiram. Além disso, você pode especificar a expiração de um token no momento em que ele é gerado.

### `prefix`

O prefixo para o valor do token compartilhado publicamente. Definir um prefixo ajuda [as ferramentas de varredura secreta](https://github.blog/2021-04-05-behind-githubs-new-authentication-token-formats/#identifiable-prefixes) a identificar um token e evitar que ele vaze dentro das bases de código.

Alterar o prefixo após emitir tokens os tornará inválidos. Portanto, escolha o prefixo com cuidado e não os altere com frequência.

O padrão é `oat_`.

### `table`

O nome da tabela do banco de dados para armazenar os tokens de acesso. O padrão é `auth_access_tokens`.

### `type`

Um tipo exclusivo para identificar um bucket de tokens. Se você emitir vários tipos de tokens em um único aplicativo, deverá definir um tipo exclusivo para todos eles.

O padrão é `auth_token`.

### `tokenSecretLength`

O comprimento (em caracteres) do valor aleatório do token. O padrão é `40`.

---

Depois de configurar um provedor de token, você pode começar a [emitir tokens](#emitindo-um-token) em nome de um usuário. Você não precisa configurar um guarda de autenticação para emitir tokens. O guarda é necessário para verificar tokens.

## Criando a tabela de banco de dados de tokens de acesso
Criamos o arquivo de migração para a tabela `auth_access_tokens` durante a configuração inicial. O arquivo de migração é armazenado dentro do diretório `database/migrations`.

Você pode criar a tabela do banco de dados executando o comando `migration:run`.

```sh
node ace migration:run
```

No entanto, se você estiver configurando o pacote auth manualmente por algum motivo, você pode criar um arquivo de migração manualmente e copiar e colar o seguinte trecho de código dentro dele.

```sh
node ace make:migration auth_access_tokens
```

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('tokenable_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('type').notNullable()
      table.string('name').nullable()
      table.string('hash').notNullable()
      table.text('abilities').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('last_used_at').nullable()
      table.timestamp('expires_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

## Emissão de tokens
Dependendo do seu aplicativo, você pode emitir um token durante o login ou após o login no painel do aplicativo. Em ambos os casos, a emissão de um token requer um objeto de usuário (para quem o token será gerado), e você pode gerá-los diretamente usando o modelo `User`.

No exemplo a seguir, nós **encontramos um usuário por id** e **emitimos a ele um token de acesso** usando o método `User.accessTokens.create`. Claro, em um aplicativo do mundo real, você terá esse endpoint protegido por autenticação, mas vamos manter isso simples por enquanto.

O método `.create` aceita uma instância do modelo User e retorna uma instância da classe [AccessToken](https://github.com/adonisjs/auth/blob/main/modules/access_tokens_guard/access_token.ts).

A propriedade `token.value` contém o valor (encapsulado como um [Secret](../references/helpers.md#secret)) que deve ser compartilhado com o usuário. O valor só está disponível ao gerar o token, e o usuário não poderá vê-lo novamente.

```ts
import router from '@adonisjs/core/services/router'
import User from '#models/user'

router.post('users/:id/tokens', ({ params }) => {
  const user = await User.findOrFail(params.id)
  const token = await User.accessTokens.create(user)

  return {
    type: 'bearer',
    value: token.value!.release(),
  }
})
```

Você também pode retornar o `token` diretamente na resposta, que será serializado para o seguinte objeto JSON.

```ts
router.post('users/:id/tokens', ({ params }) => {
  const user = await User.findOrFail(params.id)
  const token = await User.accessTokens.create(user)

  return {                          // [!code --]
    type: 'bearer',                 // [!code --]
    value: token.value!.release(),  // [!code --]
  }                                 // [!code --]

  return token                      // [!code ++]
})

/**
 * response: {
 *   type: 'bearer',
 *   value: 'oat_MTA.aWFQUmo2WkQzd3M5cW0zeG5JeHdiaV9rOFQzUWM1aTZSR2xJaDZXYzM5MDE4MzA3NTU',
 *   expiresAt: null,
 * }
 */
```

### Definindo habilidades
Dependendo do aplicativo que você está construindo, você pode querer limitar os tokens de acesso para executar apenas tarefas específicas. Por exemplo, emita um token que permita ler e listar projetos sem criá-los ou excluí-los.

No exemplo a seguir, definimos uma matriz de habilidades como o segundo parâmetro. As habilidades são serializadas para uma string JSON e persistidas dentro do banco de dados.

Para o pacote auth, as habilidades não têm significado real. Cabe ao seu aplicativo verificar as habilidades do token antes de executar uma determinada ação.

```ts
await User.accessTokens.create(user, ['server:create', 'server:read'])
```

### Habilidades do token vs. Habilidades do Bouncer

Você não deve confundir habilidades do token com [verificações de autorização do bouncer](../security/authorization.md#defining-abilities). Vamos tentar entender a diferença com um exemplo prático.

- Digamos que você defina uma **habilidade do bouncer que permite que usuários administradores criem novos projetos**.

- O mesmo usuário administrador cria um token para si mesmo, mas para evitar abuso de token, ele limita as habilidades do token para **ler projetos**.

- Agora, dentro do seu aplicativo, você terá que implementar o controle de acesso, que permite que os usuários administradores criem novos projetos enquanto impede o token de criar novos projetos.

Você pode escrever uma habilidade de bouncer para este caso de uso da seguinte forma.

::: info NOTA
O `user.currentAccessToken` se refere ao token de acesso usado para autenticação durante a solicitação HTTP atual. Você pode aprender mais sobre isso na seção [autenticando solicitações](#the-current-access-token).
:::

```ts
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { Bouncer } from '@adonisjs/bouncer'

export const createProject = Bouncer.ability(
  (user: User & { currentAccessToken?: AccessToken }) => {
    /**
     * Se não houver nenhuma propriedade de token "currentAccessToken", significa
     * o usuário foi autenticado sem um token de acesso
     */
    if (!user.currentAccessToken) {
      return user.isAdmin
    }

    /**
     * Caso contrário, verifique se o usuário éAdmin e o token que ele
     * usou para autenticação permite "project:create"
     * capacidade.
     */
    return user.isAdmin && user.currentAccessToken.allows('project:create')
  }
)
```

### Tokens expirados
Por padrão, os tokens têm vida longa e nunca expiram. No entanto, você define a expiração no momento da [configuração do provedor de tokens](#configuring-the-user-model) ou ao gerar um token.

A expiração pode ser definida como um valor numérico representando segundos ou uma expressão de tempo baseada em string.

```ts
await User.accessTokens.create(
  user, // para usuário
  ['*'], // com todas as habilidades
  {
    expiresIn: '30 days' // expira em 30 dias
  }
)
```

### Nomeando tokens
Por padrão, os tokens não são nomeados. No entanto, você pode atribuir um nome a eles ao gerar o token. Por exemplo, se você permitir que os usuários do seu aplicativo gerem tokens por conta própria, você pode pedir que eles também especifiquem um nome reconhecível.

```ts
await User.accessTokens.create(
  user,
  ['*'],
  {
    name: request.input('token_name'),
    expiresIn: '30 days'
  }
)
```

## Configurando o guard
Agora que podemos emitir tokens, vamos configurar um guard de autenticação para verificar solicitações e autenticar usuários. O guard deve ser configurado dentro do arquivo `config/auth.ts` sob o objeto `guards`.

```ts {3,9-14}
// config/auth.ts

import { defineConfig } from '@adonisjs/auth'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'

const authConfig = defineConfig({
  default: 'api',
  guards: {
    api: tokensGuard({
      provider: tokensUserProvider({
        tokens: 'accessTokens',
        model: () => import('#models/user'),
      })
    }),
  },
})

export default authConfig
```

O método `tokensGuard` cria uma instância da classe [AccessTokensGuard](https://github.com/adonisjs/auth/blob/main/modules/access_tokens_guard/guard.ts). Ele aceita um provedor de usuário que pode ser usado para verificar tokens e encontrar usuários.

O método `tokensUserProvider` aceita as seguintes opções e retorna uma instância da classe [AccessTokensLucidUserProvider](https://github.com/adonisjs/auth/blob/main/modules/access_tokens_guard/user_providers/lucid.ts).

- `model`: O modelo Lucid a ser usado para encontrar usuários.
- `tokens`: O nome da propriedade estática do modelo para referenciar o provedor de tokens.

## Autenticando solicitações
Depois que o guard tiver sido configurado, você pode começar a autenticar solicitações usando o middleware `auth` ou chamando manualmente o método `auth.authenticate`.

O método `auth.authenticate` retorna uma instância do modelo User para o usuário autenticado ou lança uma exceção [E_UNAUTHORIZED_ACCESS](../references/exceptions.md#e_unauthorized_access) quando não é possível autenticar a solicitação.

```ts
import router from '@adonisjs/core/services/router'

router.post('projects', async ({ auth }) => {
  // Autentique usando o guarda padrão
  const user = await auth.authenticate()

  // Autentique usando um guarda nomeado
  const user = await auth.authenticateUsing(['api'])
})
```

### Usando o middleware auth

Em vez de chamar manualmente o método `authenticate`. Você pode usar o middleware `auth` para autenticar a solicitação ou lançar uma exceção.

O middleware auth aceita uma matriz de guards para usar na autenticação da solicitação. O processo de autenticação para depois que um dos guards mencionados autentica a solicitação.

```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .post('projects', async ({ auth }) => {
    console.log(auth.user) // User
    console.log(auth.authenticatedViaGuard) // 'api'
    console.log(auth.user!.currentAccessToken) // AccessToken
  })
  .use(middleware.auth({
    guards: ['api']
  }))
```

### Verifique se a solicitação é autenticada
Você pode verificar se uma solicitação foi autenticada usando o sinalizador `auth.isAuthenticated`. O valor de `auth.user` sempre será definido para uma solicitação autenticada.

```ts
import { HttpContext } from '@adonisjs/core/http'

class PostsController {
  async store({ auth }: HttpContext) {
    if (auth.isAuthenticated) {
      await auth.user!.related('posts').create(postData)
    }
  }
}
```

### Obtenha o usuário autenticado ou falhe

Se você não gosta de usar o [operador de asserção não nulo](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-) na propriedade `auth.user`, você pode usar o método `auth.getUserOrFail`. Este método retornará o objeto do usuário ou lançará a exceção [E_UNAUTHORIZED_ACCESS](../references/exceptions.md#e_unauthorized_access).

```ts
import { HttpContext } from '@adonisjs/core/http'

class PostsController {
  async store({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.related('posts').create(postData)
  }
}
```

## O token de acesso atual
O guarda do token de acesso define a propriedade `currentAccessToken` no objeto do usuário após autenticar a solicitação com sucesso. A propriedade `currentAccessToken` é uma instância da classe [AccessToken](https://github.com/adonisjs/auth/blob/main/modules/access_tokens_guard/access_token.ts).

Você pode usar o objeto `currentAccessToken` para obter as habilidades do token ou verificar a expiração do token. Além disso, durante a autenticação, o guarda atualizará a coluna `last_used_at` para refletir o carimbo de data/hora atual.

Se você referenciar o modelo User com `currentAccessToken` como um tipo no restante da base de código, talvez queira declarar essa propriedade no próprio modelo.

::: danger **Em vez de mesclar `currentAccessToken`**

```ts
import { AccessToken } from '@adonisjs/auth/access_tokens'

Bouncer.ability((
  user: User & { currentAccessToken?: AccessToken }
) => {
})
```
:::


::: tip **Declare como uma propriedade no modelo**
```ts
import { AccessToken } from '@adonisjs/auth/access_tokens'

export default class User extends BaseModel {
  currentAccessToken?: AccessToken
}
```

<br>

```ts
Bouncer.ability((user: User) => {
})
```
:::


## Listando todos os tokens
Você pode usar o provedor de tokens para obter uma lista de todos os tokens usando o método `accessTokens.all`. O valor de retorno será uma matriz de instâncias da classe `AccessToken`.

```ts
router
  .get('/tokens', async ({ auth }) => {
    return User.accessTokens.all(auth.user!)
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
```

O método `all` também retorna tokens expirados. Você pode querer filtrá-los antes de renderizar a lista ou exibir uma mensagem **"Token expirado"** ao lado do token. Por exemplo

```edge
@each(token in tokens)
  <h2> {{ token.name }} </h2>
  @if(token.isExpired())
    <p> Expired </p>
  @end

  <p> Abilities: {{ token.abilities.join(',') }} </p>
@end
```

## Excluindo tokens
Você pode excluir um token usando o método `accessTokens.delete`. O método aceita o usuário como o primeiro parâmetro e o ID do token como o segundo parâmetro.

```ts
await User.accessTokens.delete(user, token.identifier)
```

## Eventos
Consulte o [guia de referência de eventos](../references/events.md#access_tokens_authauthentication_attempted) para visualizar a lista de eventos disponíveis emitidos pelo guarda de tokens de acesso.
