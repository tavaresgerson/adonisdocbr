---
title: HTTP Tests
category: testing
---

# Testes HTTP

Neste guia, aprendemos como escrever testes HTTP em um servidor de API.

Se você é novo em testes com AdonisJs, ou apenas testes em geral, considere ler o guia link:testing[Getting Started] antes de continuar.

## Exemplo básico
Vamos começar com um exemplo básico para testar um ponto de extremidade HTTP que retorna uma lista de postagens no formato JSON.

> OBSERVAÇÃO: O exemplo a seguir pressupõe que você criou um modelo `Post` com tabela de banco de dados relacionada e definiu uma rota `GET /posts` que retorna todos os modelos `Post`.

Primeiro, faça um novo *teste funcional* (já que testaremos a API como um usuário final):

```bash
adonis make:test Post
```

```bash
# .make:test Menu

> Select the type of test to create
  Unit test
❯ Functional test
```

```bash
# Output

create: test/functional/post.spec.js
```

Em seguida, abra o arquivo de teste e cole o seguinte código:

```js
// .test/functional/post.spec.js

const { test, trait } = use('Test/Suite')('Post')
const Post = use('App/Models/Post')

trait('Test/ApiClient')

test('get list of posts', async ({ client }) => {
  await Post.create({
    title: 'Adonis 101',
    body: 'Blog post content'
  })

  const response = await client.get('/posts').end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    title: 'Adonis 101',
    body: 'Blog post content'
  }])
})
```

Examinando nosso arquivo de teste...

1. Registramos o traço `Test/ApiClient`, fornecendo um `cliente` HTTP para fazer solicitações
2. Criamos uma instância fictícia `Post`
3. Solicitamos a URL `/posts` e capturamos a resposta
4. Executamos asserções na resposta para garantir que o status HTTP seja `200`
e pelo menos um post retornado tenha o mesmo `title` e `body` que nossa instância fictícia `Post`

Finalmente, execute todos os seus testes funcionais por meio do seguinte comando:

```bash
adonis test functional
```

```bash
# Output

  Post
    ✓ get list of posts (286ms)

   PASSED

  total       : 1
  passed      : 1
  time        : 289ms
```

Seu primeiro teste HTTP <span style="background: lightgreen; padding: 0 5px;">PASSOU</span>. Parabéns! 🎉

## Métodos do cliente
Os métodos a seguir podem ser chamados ao fazer solicitações HTTP.

#### `get(url)`
Faça uma solicitação HTTP `GET` para uma URL fornecida:

```js
client.get('posts')
```

> DICA: Os métodos `post`, `patch`, `put`, `delete` e `head` também podem ser usados ​​para fazer solicitações HTTP.

#### `header(key, value)`
Defina um par de cabeçalho `chave/valor` ao fazer a solicitação HTTP:

```js
client
  .get('posts')
  .header('accept', 'application/json')
```

#### `send(body)`
Envie o corpo da solicitação ao fazer a solicitação HTTP:

```js
client
  .post('posts')
  .send({
    title: 'Adonis 101',
    body: 'Post content'
  })
```

#### `query(queryObject)`
Defina os parâmetros da string de consulta:

```js
client
  .get('posts')
  .query({ order: 'desc', page: 1 }) // ?order=desc&page=1
```

#### `type(type)`
Defina o tipo de conteúdo da solicitação:

```js
client
  .get('posts')
  .type('json')
```

#### `accept(type)`
Defina o tipo de dados que você deseja aceitar do servidor:

```js
client
  .get('posts')
  .accept('json')
```

#### `cookie(key, value)`
Defina os cookies da solicitação:

```js
client
  .get('posts')
  .cookie('name', 'virk')
```

> OBSERVAÇÃO: Como todos os cookies são criptografados no AdonisJs, esse método garante a criptografia adequada dos valores para que o servidor AdonisJs possa analisá-los.

#### `plainCookie(key, value)`
Defina um cookie que não seja criptografado:

```js
client
  .get('posts')
  .plainCookie('name', 'virk')
```

#### `end`
Finalize a cadeia de solicitações HTTP, execute a solicitação e retorne a resposta:

```js
const response = await client.get('posts').end()
```

> OBSERVAÇÃO: Você deve chamar `end` para executar solicitações HTTP `client`.

## Solicitações multipartes
Para fazer solicitações multipartes e enviar arquivos com o corpo da solicitação:

```js
await client
  .post('posts')
  .field('title', 'Adonis 101')
  .attach('cover_image', Helpers.tmpPath('cover-image.jpg'))
  .end()
```

Você também pode definir nomes de campo de estilo de formulário HTML para enviar uma matriz de dados:

```js
await client
  .post('user')
  .field('user[name]', 'Virk')
  .field('user[email]', 'virk@adonisjs.com')
  .end()
```

## Sessões
Ao escrever testes, você pode querer definir sessões de antemão.

Isso pode ser feito usando o trait `Session/Client`:

```js
const { test, trait } = use('Test/Suite')('Post')

trait('Test/ApiClient')
trait('Session/Client')

test('get list of posts', async ({ client }) => {
  const response = await client
    .get('posts')
    .session('adonis-auth', 1)
    .end()
})
```

> NOTA: O AdonisJs [Session Provider](/original/markdown/04-Basics/07-Sessions.md#setup) deve ser instalado antes que você possa aproveitar o trait `Session/Client`.

## Autenticação
Você pode autenticar usuários antecipadamente usando o trait `Auth/Client`:

```js
const { test, trait } = use('Test/Suite')('Post')

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

test('get list of posts', async ({ client }) => {
  const user = await User.find(1)

  const response = await client
    .get('posts')
    .loginVia(user)
    .end()
})
```

Para autenticar com um esquema personalizado:

```js
client
  .get('posts')
  .loginVia(user, 'jwt')
```

Para autenticação básica, passe o `username` e a `password` do usuário:

```js
client
  .get('posts')
  .loginVia(username, password, 'basic')
```

## Assertions
As seguintes asserções podem ser chamadas em respostas HTTP `client`.

#### `assertStatus`
Afirme o status da resposta:

```js
response.assertStatus(200)
```

#### `assertJSON`
Afirme que o corpo da resposta deve `deepEqual` o valor esperado:

```js
response.assertJSON({
})
```

#### `assertJSONSubset`
Afirme um subconjunto de JSON:

```js
response.assertJSONSubset({
  title: 'Adonis 101',
  body: 'Some content'
})
```

> DICA: Esta afirmação testa um subconjunto de objetos, o que é útil quando os valores dentro de um objeto não são determináveis ​​(por exemplo, carimbos de data/hora).

#### `assertText`
Declara o texto simples retornado pelo servidor:

```js
response.assertText('Hello world')
```

#### `assertError`
Declara o erro de resposta:

```js
response.assertError([
  {
    message: 'username is required',
    field: 'username',
    validation: 'required'
  }
])
```

#### `assertCookie`
Declara que o servidor definiu um cookie com o valor:

```js
response.assertCookie('key', 'value')
```

#### `assertPlainCookie`
Declara um valor de cookie simples:

```js
response.assertPlainCookie('key', 'value')
```

#### `assertCookieExists`
Declara que o servidor definiu um cookie com o nome fornecido:

```js
response.assertCookieExists('key')
```

#### `assertPlainCookieExists`
Declara que existe um cookie simples:

```js
response.assertPlainCookieExists('key')
```

#### `assertHeader`
Afirma que o servidor enviou um cabeçalho:

```js
response.assertHeader('content-type', 'application/json')
```

#### `assertRedirect`
Afirma que a solicitação foi redirecionada para uma URL fornecida:

```js
response.assertRedirect('/there')
```
