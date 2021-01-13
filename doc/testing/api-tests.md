# Testes HTTP

Neste guia, aprendemos como escrever testes HTTP em um servidor API.

Se você é novo em testes com AdonisJs ou testes em geral, considere a leitura do guia de primeiros 
[passos](/doc/testing/started.md) antes de continuar.

## Exemplo Básico
Vamos começar com um exemplo básico para testar um endpoint HTTP que retorna uma lista de postagens no formato JSON.

> O exemplo a seguir assume que você criou um model `Post` com a tabela de banco de dados relacionada e definiu uma rota GET `/posts` 
> que retorna todos os registros de `Post`.

Primeiro, faça um novo teste funcional (já que testaremos a API como um usuário final):
```bash
adonis make:test Post
```
```bash
make: menu de teste
> Select the type of test to create
  Unit test
❯ Functional test
```

Resultado
```bash
create: test/functional/post.spec.js
```

Em seguida, abra o arquivo de teste e cole o seguinte código:
```js
// test/function/post.spec.js

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

1. Registramos a trait `Test/ApiClient`, fornecendo-nos um cliente HTTP para fazer solicitações
2. Criamos uma instância `Post` fictícia
3. Solicitamos a URL `/posts` e capturamos a resposta
4. Executamos asserções contra a resposta para garantir que o status do HTTP seja 200 e pelo menos uma 
   postagem retornada tenha o mesmo `title` e `body` que a nossa instância `Post` fictícia

Por fim, execute todos os seus testes funcionais por meio do seguinte comando:
```bash
> adonis test functional
Resultado
  Post
    ✓ get list of posts (286ms)

   PASSED

  total       : 1
  passed      : 1
  time        : 289ms
```

Seu primeiro teste de HTTP PASSOU . Parabéns! 🎉

## Métodos de Cliente
Os métodos a seguir podem ser chamados ao fazer solicitações HTTP.

#### get(url)
Faça uma solicitação `GET` para uma determinada URL:
```js
client.get('posts')
```

> Métodos `post`, `patch`, `put`, `delete` e `head` também podem ser usados para fazer solicitações HTTP.

#### header(key, value)
Defina um pares de `key/value` em cabeçalhos ao fazer a solicitação HTTP:
```js
client
  .get('posts')
  .header('accept', 'application/json')
```

#### send(body)
Envie o corpo da solicitação ao fazer a solicitação HTTP:
```js
client
  .post('posts')
  .send({
    title: 'Adonis 101',
    body: 'Post content'
  })
```

#### query(queryObject)
Defina os parâmetros da string de consulta:
```js
client
  .get('posts')
  .query({ order: 'desc', page: 1 }) // ?order=desc&page=1
```

#### type(type)
Defina o tipo de conteúdo da solicitação:
```js
client
  .get('posts')
  .type('json')
```

#### accept(type)
Defina o tipo de dados que deseja aceitar do servidor:
```js
client
  .get('posts')
  .accept('json')
``` 

#### cookie(key, value)
Definir cookies de solicitação:
```js
client
  .get('posts')
  .cookie('name', 'virk')
```

> Como todos os cookies são criptografados no AdonisJs, esse método garante a criptografia adequada dos valores 
> para que o servidor possa analisá-los.

#### plainCookie(key, value)
Defina um cookie que não seja criptografado:
```js
client
  .get('posts')
  .plainCookie('name', 'virk')
```

#### end
Termina a cadeia de solicitações HTTP, executa a solicitação e retorna a resposta:
```js
const response = await client.get('posts').end()
```

> Você deve chamar `end` para executar solicitações HTTP.

## Solicitações de várias partes

Para fazer solicitações multipart e enviar arquivos no corpo da solicitação:
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

Isso pode ser feito usando a trait `Session/Client`:

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

> O [Provedor de Sessão](/doc/basics/sessions.md) AdonisJs deve ser instalado antes que você possa aproveitar as vantagens da trait `Session/Client`.

## Autenticação
Você pode autenticar usuários de antemão usando o atributo da trait `Auth/Client`:
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

Para autenticação básica, passe as credenciais `username` e `password`:
```js
client
  .get('posts')
  .loginVia(username, password, 'basic')
```

## Asserções
As seguintes asserções podem ser chamadas em respostas do cliente HTTP.

#### assertStatus
Afirme o status da resposta:
```js
response.assertStatus(200)
```

#### assertJSON
Afirme o corpo da resposta caso deepEqualo valor esperado:
```js
response.assertJSON({
})
```

#### assertJSONSubset
Afirme um subconjunto de JSON:
```js
response.assertJSONSubset({
  title: 'Adonis 101',
  body: 'Some content'
})
```

> Essa asserção testa um subconjunto de objetos, o que é útil quando os valores dentro de um objeto não são 
> determináveis (por exemplo, carimbos de data/hora).

#### assertText
Declarar texto simples retornado pelo servidor:
```js
response.assertText('Hello world')
```

#### assertError
Afirme o erro de resposta:
```js
response.assertError([
  {
    message: 'username is required',
    field: 'username',
    validation: 'required'
  }
])
```

#### assertCookie
Assegure que o servidor definiu um cookie com o valor:
```js
response.assertCookie('key', 'value')
```

#### assertPlainCookie
Afirme um valor de cookie simples:
```js
response.assertPlainCookie('key', 'value')
```

#### assertCookieExists
Assegure que o servidor defina um cookie com o nome fornecido:
```js
response.assertCookieExists('key')
```

#### assertPlainCookieExists
Afirme que existe um cookie simples:
```js
response.assertPlainCookieExists('key')
```

#### assertHeader
Assegure que o servidor enviou um cabeçalho:
```js
response.assertHeader('content-type', 'application/json')
```

#### assertRedirect
Assegure que a solicitação foi redirecionada para um determinado URL:
```js
response.assertRedirect('/there')
```
