# Resposta

Este guia descreve como usar o objeto [HTTP Response](https://github.com/adonisjs/adonis-framework/blob/develop/src/Response/index.js) para criar e retornar respostas.

::: tip DICA
O objeto `res` bruto do Node.js pode ser acessado como `response.response`.
:::

O AdonisJs passa o objeto de resposta HTTP atual como parte do [HTTP Context](/docs/02-Concept/01-Request-Lifecycle.md) que é enviado para todos os manipuladores de rota e middleware.

```js
// .start/routes.js

Route.get('/', ({ response }) => {
  response.send('hello world')
})
```

## Exemplo básico
O exemplo a seguir retorna uma matriz de usuários no formato JSON:

```js
// .start/routes.js

Route.get('/users', async ({ response }) => {
  const users = await User.all()
  response.send(users)
})
```

O método `response.json` também pode ser usado como um alias para `response.send`:

```js
// .start/routes.js

Route.get('/users', async ({ response }) => {
  response.json(await User.all())
})
```

## Criando resposta
A partir da versão 4.0, você também pode `retornar` valores do método de fechamento de rota ou controlador em vez de usar métodos `response` dedicados.

O seguinte é equivalente a `response.send` ou `response.json`, mas pode parecer mais natural com uma declaração return simples:

```js
// .start/routes.js

Route.get('/', async () => {
  return await User.all()
})
```

### Evite retornos de chamada
Como o ciclo de vida de solicitação/resposta permite que você retorne valores ou chame métodos de resposta dedicados, o AdonisJs desencoraja totalmente o uso de retornos de chamada.

A seguinte resposta enviada dentro de um retorno de chamada não funcionará:

```js
// .start/routes.js

Route.get('/', async ({ response }) => {
  fs.readFile('somefile', (error, contents) => {
    response.send(contents)
  })
})
```

O motivo pelo qual o código acima não funcionará é porque assim que o manipulador de rota é executado, o AdonisJs encerra a resposta – como o retorno de chamada seria executado mais tarde, ocorrerá um erro!

### Promisficando retornos de chamada
O que você pode fazer em vez disso é **prometer** seu retorno de chamada e usá-lo com `await`:

```js
// .start/routes.js

const fs = use('fs')
const Helpers = use('Helpers')
const readFile = Helpers.promisify(fs.readFile)

Route.get('/', async ({ response }) => {
  return await readFile('somefile')
})
```

O JavaScript tem um ecossistema rico, e é *100% possível* escrever código sem retornos de chamada apenas prometendo-os, e como uma comunidade, queremos encorajar essa abordagem.

### Mas… eu gosto dos meus retornos de chamada!
Se você ainda prefere retornos de chamada, o AdonisJs fornece uma maneira de continuar a usá-los.

Basta instruir o objeto `response` para não terminar implicitamente:

```js
// .start/routes.js

Route.get('/', async ({ response }) => {
  response.implicitEnd = false

  fs.readFile('somefile', (error, contents) => {
    response.send(contents)
  })
})
```

## Cabeçalhos
Use os seguintes métodos para definir/remover cabeçalhos de resposta.

#### `header`
Defina um valor de cabeçalho:

```js
response.header('Content-type', 'application/json')
```

#### `safeHeader`
Defina um valor de cabeçalho somente se ele ainda não existir:

```js
response.safeHeader('Content-type', 'application/json')
```

#### `removeHeader`
Remova um cabeçalho existente:

```js
response.removeHeader('Content-type')
```

#### `type`
Defina o cabeçalho `Content-Type`:

```js
response.type('application/json')
```

## Cookies
Use os seguintes métodos para definir/remover cookies de resposta.

#### `cookie`
Defina um valor de cookie:

```js
response.cookie('cartTotal', 20)
```

#### `clearCookie`
Remova um valor de cookie existente (definindo sua expiração no passado):

```js
response.clearCookie('cartTotal')
```

#### `plainCookie`
Como todos os cookies são criptografados e assinados, não é possível lê-los do código JavaScript do front-end.

Nesse caso, pode ser necessário definir um cookie simples:

```js
// não assinado ou criptografado
response.plainCookie('cartTotal', 20)
```

## Redirecionamentos
Use um dos seguintes métodos para redirecionar solicitações para uma URL diferente.

#### `redirect(url, [sendParams = false], [status = 302])`
Redirecionar solicitação para uma url diferente (por padrão, o status será definido como `302`):

```js
response.redirect('/url')

// ou
response.redirect('/url', false, 301)
```

Você pode enviar os parâmetros de solicitação atuais para o local de redirecionamento definindo o segundo parâmetro como `true`:

```js
response.redirect('/url', true)
```

#### `route(route, [data], [domain], [sendParams = false], [status = 302])`
Redirecionar para uma rota (por meio do nome da rota ou método do controlador):

```js
// .start/routes.js

Route
  .get('users/:id', 'UserController.show')
  .as('profile')
```

```js
// via route name
response.route('profile', { id: 1 })

// via controller method
response.route('UserController.show', { id: 1 })
```

Como o AdonisJs permite registrar rotas para [vários domínios](/docs/04-Basics/01-Routing.md), você também pode instruir este método para construir a URL para um domínio específico:

```js
response.route('posts', { id: 1 }, 'blog.adonisjs.com')
```

## Anexos
O objeto de resposta simplifica o streaming de arquivos do seu servidor para o cliente.

#### `download(filePath)`
Transmita o arquivo para o cliente:

```js
response.download(Helpers.tmpPath('uploads/avatar.jpg'))
```

Este método não força o cliente a baixar o arquivo como um anexo (por exemplo, os navegadores podem escolher exibir o arquivo em uma nova janela).

#### `attachment(filePath, [name], [disposition])`
Força o download do arquivo:

```js
response.attachment(
  Helpers.tmpPath('uploads/avatar.jpg')
)
```

Baixe com um nome personalizado:

```js
response.attachment(
  Helpers.tmpPath('uploads/avatar.jpg'),
  'myAvatar.jpg' // custom name
)
```

## Métodos descritivos
O AdonisJs vem com um monte de mensagens descritivas, que são mais legíveis do que o método `send`. Vamos pegar este exemplo.

```js
response.unauthorized('Login First')
```

é mais legível que

```js
response.status(401).send('Login First')
```

Abaixo está a lista de todos os métodos descritivos e seus status HTTP correspondentes. Verifique [httpstatuses.com](https://httpstatuses.com) para saber mais sobre códigos de status HTTP.

| Método                        | Status de resposta Http |
|-------------------------------|-------------------------|
| continue                      | 100                     |
| switchingProtocols            | 101                     |
| ok                            | 200                     |
| created                       | 201                     |
| accepted                      | 202                     |
| nonAuthoritativeInformation   | 203                     |
| noContent                     | 204                     |
| resetContent                  | 205                     |
| partialContent                | 206                     |
| multipleChoices               | 300                     |
| movedPermanently              | 301                     |
| found                         | 302                     |
| seeOther                      | 303                     |
| notModified                   | 304                     |
| useProxy                      | 305                     |
| temporaryRedirect             | 307                     |
| badRequest                    | 400                     |
| unauthorized                  | 401                     |
| paymentRequired               | 402                     |
| forbidden                     | 403                     |
| notFound                      | 404                     |
| methodNotAllowed              | 405                     |
| notAcceptable                 | 406                     |
| proxyAuthenticationRequired   | 407                     |
| requestTimeout                | 408                     |
| conflict                      | 409                     |
| gone                          | 410                     |
| lengthRequired                | 411                     |
| preconditionFailed            | 412                     |
| requestEntityTooLarge         | 413                     |
| requestUriTooLong             | 414                     |
| unsupportedMediaType          | 415                     |
| requestedRangeNotSatisfiable  | 416                     |
| expectationFailed             | 417                     |
| unprocessableEntity           | 422                     |
| tooManyRequests               | 429                     |
| internalServerError           | 500                     |
| notImplemented                | 501                     |
| badGateway                    | 502                     |
| serviceUnavailable            | 503                     |
| gatewayTimeout                | 504                     |
| httpVersionNotSupported       | 505                     |

## Estendendo a resposta
Também é possível estender o protótipo `Response` adicionando seus próprios métodos, conhecidos como macros.

::: warning NOTA
Como o código para estender `Response` precisa ser executado apenas uma vez, você pode usar [providers](/docs/02-Concept/03-service-providers.md) ou [Ignitor hooks](/docs/02-Concept/05-ignitor.md) para fazer isso. Leia [Estendendo o núcleo](/docs/06-Digging-Deeper/03-Extending-the-Core.md) para obter mais informações.
:::

```js
const Response = use('Adonis/Src/Response')

Response.macro('sendStatus', function (status) {
  this.status(status).send(status)
})
```
