# Testes HTTP

O AdonisJS é fornecido com o plugin Japa [cliente de API](https://v2.japa.dev/docs/plugins/api-client). Você pode usá-lo para testar os endpoints HTTP do seu aplicativo.

O principal caso de uso do cliente de API é testar respostas JSON. No entanto, não há limitações técnicas em torno de outros tipos de resposta, como HTML ou mesmo texto simples.

Os testes que usam o cliente de API para executar testes de fora para dentro devem fazer parte do conjunto de testes `funcionais`.

```sh
node ace make:test functional users/list

# CREATE: tests/functional/users/list.spec.ts
```

```ts
// tests/functional/users/list.spec.ts

import { test } from '@japa/runner'

test.group('List users', () => {
  test('get a paginated list of users', async ({ client }) => {
    const response = await client.get('/users')

    console.log(response.body())
  })
})
```

::: info NOTA
Leia a [documentação do Japa](https://v2.japa.dev/plugins/api-client#making-api-calls) para visualizar todos os métodos e asserções disponíveis. Este guia documenta apenas os métodos adicionais adicionados pelo AdonisJS
:::

## Teste de API aberta
O cliente da API permite que você escreva asserções em relação à sua especificação OpenAPI.

Mantenha o arquivo YAML ou JSON da especificação dentro da raiz do projeto e registre-o no arquivo `tests/boostrap.ts`.

```ts {4-8}
// tests/bootstrap.ts

export const plugins: Config['plugins'] = [
  assert({
    openApi: {
      schemas: [Application.makePath('api-spec.yml')],
    },
  }),
  runFailedTests(),
  apiClient(),
]
```

Depois que o esquema for registrado, você pode usar o método `response.assertAgainstApiSpec` para fazer a asserção em relação à especificação da API.

```ts
test('get a paginated list of existing posts', async ({ client }) => {
  const response = await client.get('/posts')
  response.assertAgainstApiSpec()
})
```

- A asserção usará o **método de solicitação**, o **endpoint** e o **código de status de resposta** para encontrar o esquema de resposta esperado.
- O corpo da resposta real é validado em relação ao esquema correspondente.

Observe que apenas o formato da resposta é testado e não os valores reais. Portanto, pode ser necessário escrever asserções adicionais. Por exemplo:

```ts
// Afirme que a resposta é conforme o esquema
response.assertAgainstApiSpec()

// Afirme para valores esperados
response.assertBodyContains({
  data: [{ 'Adonis 101' }, { 'Lucid 101' }]

})
```

## Cookies
Você pode ler/escrever cookies durante a solicitação. Os cookies são assinados automaticamente durante a solicitação e convertidos em texto simples na resposta.

No exemplo a seguir, um cookie `user_preferences` é enviado ao servidor.

```ts
await client
  .get('/users')
  .cookie('user_preferences', { limit: 10 })
```

Você também pode ler os cookies definidos pelo servidor usando o método `response.cookies()`.

```ts
const response = await client.get('/users')

console.log(response.cookies())
console.log(response.cookie('user_preferences'))

response.assertCookie('user_preferences')
```

### Cookies criptografados
Por padrão, os cookies são assinados e não assinados durante uma solicitação. Você pode usar o método `encryptedCookie` para enviar cookies criptografados ao servidor.

```ts
await client
  .client('/users')
  .encryptedCookie('user_preferences', { limit: 10 })
```

### Cookies simples
Você também pode enviar cookies simples (codificados em base64) para o servidor usando o método `plainCookie`.

```ts
await client
  .client('/users')
  .plainCookie('user_preferences', { limit: 10 })
```

## Sessão
O pacote `@adonisjs/session` estende o cliente da API fornecendo métodos adicionais para ler/escrever dados da sessão durante a solicitação.

As sessões devem usar o driver `memory` durante os testes. Portanto, certifique-se de atualizar o `SESSION_DRIVER` dentro do arquivo `.env.test`.

```dotenv
// .env.test

SESSION_DRIVER=memory
```

### Escrevendo valores de sessão

Você pode definir os dados da sessão durante a solicitação usando o método `session`. Os valores da sessão serão acessíveis pelo servidor.

```ts
await client.get('/').session({ user_id: 1 })
```

Além disso, você pode definir as mensagens flash usando o método `flashMessages`.

```ts
await client.get('/').flashMessages({
  errors: {
    ['Post title is required']

  }
})
```

### Lendo valores de sessão
Você pode ler os dados da sessão definidos pelo servidor usando o método `session` no objeto de resposta.

```ts
const response = await client.get('/')
console.log(response.session())
```

As mensagens flash podem ser acessadas usando o método `flashMessages`.

```ts
const response = await client.get('/')
console.log(response.flashMessages())
```

Você pode despejar os dados da sessão no console usando o método `dumpSession`.

```ts
const response = await client.get('/')

// escreve no console
response.dumpSession()
```

## Token CSRF
Você pode passar um token CSRF para a solicitação HTTP chamando o método `withCsrfToken` no objeto de solicitação. O método definirá a sessão secreta CSRF e passará o token dentro do cabeçalho `x-csrf-token`.

::: info NOTA
Certifique-se de ter o pacote `@adonisjs/session` instalado, pois os segredos CSRF dependem do armazenamento da sessão. Além disso, o `SESSION_DRIVER` deve ser definido como `memory` durante o teste.
:::

```ts
await client.post('/comments').withCsrfToken()
```

## Autenticação
O pacote `@adonisjs/auth` estende o cliente da API e adiciona o método `loginAs` que você pode usar para fazer login como um determinado usuário ao fazer a solicitação.

O método aceita uma instância do objeto do usuário para fazer login.

```ts
const user = await User.find(1)
await client.get('/posts').loginAs(user)
```

Você também pode especificar o Auth guard para usar ao autenticar o usuário. O web guard criará a sessão, enquanto o API tokens guard gerará um token e o definirá como o cabeçalho.

```ts
const user = await User.find(1)

await client.get('/posts')
  .guard('api')
  .loginAs(user)
```

Para autenticação básica, você pode usar o método `basicAuth`. Ele aceita as credenciais de login do usuário como argumentos. Certifique-se de passar a senha simples (sem hash) para o método `basicAuth`.

```ts
await client.get('/posts').basicAuth('email', 'password')
```

## Uploads de arquivo
O AdonisJS oferece uma ótima experiência de teste ao lidar com uploads de arquivo. Você pode gerar arquivos fictícios na memória e falsificar a implementação do Drive para não persistir nenhum arquivo durante os testes.

Vamos supor que você queira testar se um usuário pode atualizar seu avatar com um arquivo de imagem válido em um determinado tamanho. Agora, em vez de manter imagens de tamanhos diferentes dentro do seu projeto, você pode usar os auxiliares `file` do AdonisJS para gerar uma imagem na memória.

Da mesma forma, em vez de armazenar os arquivos enviados pelo usuário no disco ou s3. Você pode chamar o método `Drive.fake()` para coletar arquivos enviados pelo usuário na memória e escrever asserções contra eles.

Vamos ver como tudo isso funciona na prática.

```ts {2-3,6-15,20,22-30}
import { test } from '@japa/runner'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'

test('a user can update avatar', async ({ client, assert }) => {
  /**
   * Depois disso, o código do servidor usando Drive
   * não gravará nenhum arquivo no disco
   */
  const fakeDrive = Drive.fake()

  /**
   * Criando um arquivo falso para carregar
   */
  const fakeAvatar = await file.generatePng('1mb')

  await client
    .put(`/me`)
    .loginAs(user)
    .file('avatar', fakeAvatar.contents, { filename: fakeAvatar.name })

  /**
   * Afirme que o arquivo foi carregado com sucesso
   */
  assert.isTrue(await fakeDrive.exists(fakeAvatar.name))

  /**
   * Restaure o Drive falso
   */
  Drive.restore()
})
```

## Asserções adicionais
Você pode validar a resposta do servidor usando as asserções disponíveis no objeto `response`.

O AdonisJS fornece os seguintes métodos adicionais além das [asserções Japa](https://v2.japa.dev/docs/plugins/api-client#assertions-api) existentes.

### `assertSession`
Declara que a sessão fornecida existe. Opcionalmente, você também pode declarar o valor da sessão.

```ts
response.assertSession('foo')

/**
 * Duas asserções são executadas sob o capô
 * quando o valor é fornecido
 */
response.assertSession('foo', 'bar')
```

### `assertSessionMissing`
Declara que a sessão não existe na resposta.

```ts
response.assertSessionMissing('foo')
```

### `assertFlashMessage`
Declara que a mensagem flash fornecida existe. Opcionalmente, você também pode declarar para um valor específico.

```ts
response.assertFlashMessage('errors')

/**
 * Duas asserções são executadas sob o capô
 * quando o valor é fornecido
 */
response.assertFlashMessage('errors', [
  {
    ['Post title is required']

  }
])
```

### `assertFlashMissing`
Declara que a mensagem flash não existe na resposta.

```ts
response.assertFlashMissing('success')
```
