---
summary: Testes HTTP no AdonisJS usando o plugin cliente API Japa.
---

# Testes HTTP

Testes HTTP referem-se a testar os endpoints do seu aplicativo fazendo uma solicitação HTTP real contra eles e afirmando o corpo da resposta, cabeçalhos, cookies, sessão, etc.

Testes HTTP são realizados usando o [plugin cliente API](https://japa.dev/docs/plugins/api-client) do Japa. O plugin cliente API é uma biblioteca de solicitação sem estado semelhante ao `Axios` ou `fetch`, mas mais adequada para testes.

Se você quiser testar seus aplicativos da web dentro de um navegador real e interagir com eles programaticamente, recomendamos usar o [cliente do navegador](./browser_tests.md) que usa o Playwright para testes.

## Configuração
O primeiro passo é instalar os seguintes pacotes do registro de pacotes npm.

:::codegroup

```sh
// title: npm
npm i -D @japa/api-client
```

:::

### Registrando o plugin

Antes de prosseguir, registre o plugin dentro do arquivo `tests/bootstrap.ts`.

```ts
// title: tests/bootstrap.ts
import { apiClient } from '@japa/api-client'

export const plugins: Config['plugins'] = [
  assert(),
  // highlight-start
  apiClient(),
  // highlight-end
  pluginAdonisJS(app),
]
```

O método `apiClient` aceita opcionalmente o `baseURL` para o servidor. Se não for fornecido, ele usará as variáveis ​​de ambiente `HOST` e `PORT`.

```ts
import env from '#start/env'

export const plugins: Config['plugins'] = [
  apiClient({
    baseURL: `http://${env.get('HOST')}:${env.get('PORT')}`
  })
]
```

## Exemplo básico

Depois que o plugin `apiClient` for registrado, você pode acessar o objeto `client` de [TestContext](https://japa.dev/docs/test-context) para fazer uma solicitação HTTP.

Os testes HTTP devem ser escritos dentro da pasta configurada para o conjunto de testes `functional`. Você pode usar o seguinte comando para criar um novo arquivo de teste.

```sh
node ace make:test users/list --suite=functional
```

```ts
import { test } from '@japa/runner'

test.group('Users list', () => {
  test('get a list of users', async ({ client }) => {
    const response = await client.get('/users')

    response.assertStatus(200)
    response.assertBody({
      data: [
        {
          id: 1,
          email: 'foo@bar.com',
        }
      ]
    })
  })
})
```

Para visualizar todos os métodos de solicitação e asserção disponíveis, certifique-se de [ler a documentação do Japa](https://japa.dev/docs/plugins/api-client).

## Teste de API aberta
Os plug-ins de asserção e cliente de API permitem que você use arquivos de especificação da API aberta para escrever asserções. Em vez de testar manualmente a resposta em relação a uma carga útil fixa, você pode usar um arquivo de especificação para testar o formato da resposta HTTP.

É uma ótima maneira de manter suas respostas de especificação e servidor da API aberta sincronizadas. Porque se você remover um determinado ponto de extremidade do arquivo de especificação ou alterar o formato dos dados de resposta, seus testes falharão.

### Registrando esquema
O AdonisJS não oferece ferramentas para gerar arquivos de esquema da API aberta a partir do código. Você pode escrevê-lo manualmente ou usar ferramentas gráficas para criá-lo.

Depois de ter um arquivo de especificação, salve-o dentro do diretório `resources` (crie o diretório se estiver faltando) e registre-o com o plugin `assert` dentro do arquivo `tests/bootstrap.ts`.

```ts
// title: tests/bootstrap.ts
import app from '@adonisjs/core/services/app'

export const plugins: Config['plugins'] = [
  // highlight-start
  assert({
    openApi: {
      schemas: [app.makePath('resources/open_api_schema.yaml')]
    }
  }),
  // highlight-end
  apiClient(),
  pluginAdonisJS(app)
]
```

### Escrevendo asserções
Depois que o esquema for registrado, você pode usar o método `response.assertAgainstApiSpec` para fazer a asserção contra a especificação da API.

```ts
test('paginate posts', async ({ client }) => {
  const response = await client.get('/posts')
  response.assertAgainstApiSpec()
})
```

- O método `response.assertAgainstApiSpec` usará o **método de solicitação**, o **endpoint** e o **código de status de resposta** para encontrar o esquema de resposta esperado.
- Uma exceção será gerada quando o esquema de resposta não puder ser encontrado. Caso contrário, o corpo da resposta será validado contra o esquema.

Somente a forma da resposta é testada, não os valores reais. Portanto, você pode ter que escrever asserções adicionais. Por exemplo:

```ts
// Assert that the response is as per the schema
response.assertAgainstApiSpec()

// Assert for expected values
response.assertBodyContains({
  data: [{ title: 'Adonis 101' }, { title: 'Lucid 101' }]
})
```

## Lendo/escrevendo cookies
Você pode enviar cookies durante a solicitação HTTP usando o método `withCookie`. O método aceita o nome do cookie como o primeiro argumento e o valor como o segundo.

```ts
await client
  .get('/users')
  .withCookie('user_preferences', { limit: 10 })
```

O método `withCookie` define um [cookie assinado](../basics/cookies.md#signed-cookies). Além disso, você pode usar os métodos `withEncryptedCookie` ou `withPlainCookie` para enviar outros tipos de cookies para o servidor.

```ts
await client
  .get('/users')
  .witEncryptedCookie('user_preferences', { limit: 10 })
```

```ts
await client
  .get('/users')
  .withPlainCookie('user_preferences', { limit: 10 })
```

### Lendo cookies da resposta
Você pode acessar os cookies definidos pelo seu servidor AdonisJS usando o método `response.cookies`. O método retorna um objeto de cookies como um par chave-valor.

```ts
const response = await client.get('/users')
console.log(response.cookies())
```

Você pode usar o método `response.cookie` para acessar um único valor de cookie pelo seu nome. Ou usar o método `assertCookie` para declarar o valor do cookie.

```ts
const response = await client.get('/users')

console.log(response.cookie('user_preferences'))

response.assertCookie('user_preferences')
```

## Preenchendo o armazenamento de sessão
Se você estiver usando o pacote [`@adonisjs/session`](../basics/session.md) para ler/escrever dados de sessão em seu aplicativo, você também pode querer usar o plugin `sessionApiClient` para preencher o armazenamento de sessão ao escrever testes.

### Configuração
O primeiro passo é registrar o plugin dentro do arquivo `tests/bootstrap.ts`.

```ts
// title: tests/bootstrap.ts
// insert-start
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
// insert-end

export const plugins: Config['plugins'] = [
  assert(),
  pluginAdonisJS(app),
  // insert-start
  sessionApiClient(app)
  // insert-end
]
```

E então, atualize o arquivo `.env.test` (crie um se estiver faltando) e defina o `SESSON_DRIVER` para `memory`.

```dotenv
// title: .env.test
SESSION_DRIVER=memory
```

### Fazendo solicitações com dados de sessão
Você pode usar o método `withSession` no cliente da API Japa para fazer uma solicitação HTTP com alguns dados de sessão predefinidos.

O método `withSession` criará um novo ID de sessão e preencherá o armazenamento de memória com os dados, e seu código de aplicativo AdonisJS pode ler os dados da sessão normalmente.

Após a conclusão da solicitação, o ID da sessão e seus dados serão destruídos.

```ts
test('checkout with cart items', async ({ client }) => {
  await client
    .post('/checkout')
    // highlight-start
    .withSession({
      cartItems: [
        {
          id: 1,
          name: 'South Indian Filter Press Coffee'
        },
        {
          id: 2,
          name: 'Cold Brew Bags',
        }
      ]
    })
    // highlight-end
})
```

Assim como o método `withSession`, você pode usar o método `withFlashMessages` para definir mensagens flash ao fazer uma solicitação HTTP.

```ts
const response = await client
  .get('posts/1')
  .withFlashMessages({
    success: 'Post created successfully'
  })

response.assertTextIncludes(`Post created successfully`)
```

### Lendo dados de sessão da resposta
Você pode acessar o conjunto de dados de sessão pelo seu servidor AdonisJS usando o método `response.session()`. O método retorna os dados da sessão como um objeto de um par chave-valor.

```ts
const response = await client
  .post('/posts')
  .json({
    title: 'some title',
    body: 'some description',
  })

console.log(response.session()) // all session data
console.log(response.session('post_id')) // value of post_id
```

Você pode ler mensagens flash da resposta usando o método `response.flashMessage` ou `response.flashMessages`.

```ts
const response = await client.post('/posts')

response.flashMessages()
response.flashMessage('errors')
response.flashMessage('success')
```

Finalmente, você pode escrever asserções para os dados da sessão usando um dos seguintes métodos.

```ts
const response = await client.post('/posts')

/**
 * Assert a specific key (with optional value) exists
 * in the session store
 */
response.assertSession('cart_items')
response.assertSession('cart_items', [{
  id: 1,
}, {
  id: 2,
}])

/**
 * Assert a specific key is not in the session store
 */
response.assertSessionMissing('cart_items')

/**
 * Assert a flash message exists (with optional value)
 * in the flash messages store
 */
response.assertFlashMessage('success')
response.assertFlashMessage('success', 'Post created successfully')

/**
 * Assert a specific key is not in the flash messages store
 */
response.assertFlashMissing('errors')

/**
 * Assert for validation errors in the flash messages
 * store
 */
response.assertHasValidationError('title')
response.assertValidationError('title', 'Enter post title')
response.assertValidationErrors('title', [
  'Enter post title',
  'Post title must be 10 characters long.'
])
response.assertDoesNotHaveValidationError('title')
```

## Autenticando usuários
Se você usar o pacote `@adonisjs/auth` para autenticar usuários em seu aplicativo, você pode usar o plugin `authApiClient` Japa para autenticar usuários ao fazer solicitações HTTP para seu aplicativo.

O primeiro passo é registrar o plugin dentro do arquivo `tests/bootstrap.ts`.

```ts
// title: tests/bootstrap.ts
// insert-start
import { authApiClient } from '@adonisjs/auth/plugins/api_client'
// insert-end

export const plugins: Config['plugins'] = [
  assert(),
  pluginAdonisJS(app),
  // insert-start
  authApiClient(app)
  // insert-end
]
```

Se você estiver usando autenticação baseada em sessão, certifique-se de também configurar o plugin de sessão. Veja [Preenchendo o armazenamento de sessão - Configuração](#setup-1).

Isso é tudo. Agora, você pode fazer login de usuários usando o método `loginAs`. O método aceita o objeto do usuário como o único argumento e marca o usuário como logado para a solicitação HTTP atual.

```ts
import User from '#models/user'

test('get payments list', async ({ client }) => {
  const user = await User.create(payload)

  await client
    .get('/me/payments')
    // highlight-start
    .loginAs(user)
    // highlight-end
})
```

O método `loginAs` usa o guard padrão configurado dentro do arquivo `config/auth.ts` para autenticação. No entanto, você pode especificar uma proteção personalizada usando o método `withGuard`. Por exemplo:

```ts
await client
    .get('/me/payments')
    // highlight-start
    .withGuard('api_tokens')
    .loginAs(user)
    // highlight-end
```

## Fazendo uma solicitação com um token CSRF
Se os formulários em seu aplicativo usarem [proteção CSRF](../security/securing_ssr_applications.md), você pode usar o método `withCsrfToken` para gerar um token CSRF e passá-lo como um cabeçalho durante a solicitação.

Antes de usar o método `withCsrfToken`, registre os seguintes plug-ins Japa dentro do arquivo `tests/bootstrap.ts` e também certifique-se de [trocar a variável de ambiente `SESSION_DRIVER`](#setup-1) para `memory`.

```ts
// title: tests/bootstrap.ts
// insert-start
import { shieldApiClient } from '@adonisjs/shield/plugins/api_client'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
// insert-end

export const plugins: Config['plugins'] = [
  assert(),
  pluginAdonisJS(app),
  // insert-start
  sessionApiClient(app),
  shieldApiClient()
  // insert-end
]
```

```ts
test('create a post', async ({ client }) => {
  await client
    .post('/posts')
    .form(dataGoesHere)
    .withCsrfToken()
})
```

## O auxiliar de rota
Você pode usar o auxiliar `route` do TestContext para criar uma URL para uma rota. Usar o auxiliar de rota garante que sempre que você atualizar suas rotas, não precise voltar e corrigir todas as URLs dentro de seus testes.

O auxiliar `route` aceita o mesmo conjunto de argumentos aceitos pelo método de modelo global [route](../basics/routing.md#url-builder).

```ts
test('get a list of users', async ({ client, route }) => {
  const response = await client.get(
    // highlight-start
    route('users.list')
    // highlight-end
  )

  response.assertStatus(200)
  response.assertBody({
    data: [
      {
        id: 1,
        email: 'foo@bar.com',
      }
    ]
  })
})
```
