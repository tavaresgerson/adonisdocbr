# Resposta

Este guia descreve como usar o objeto Resposta HTTP para gerar e retornar respostas.

> O objeto bruto `res` do Node.js pode ser acessado como `response.response`.

O AdonisJs passa o objeto de resposta HTTP atual como parte do contexto HTTP, que é enviado a todos os manipuladores de rotas 
e middleware.

``` js
Route.get('/', ({ response }) => {
  response.send('hello world')
})
```

## Exemplo básico
O exemplo a seguir retorna uma matriz de usuários no formato JSON:

``` js
Route.get('/users', async ({ response }) => {
  const users = await User.all()
  response.send(users)
})
```

O método `response.json` também pode ser usado como um alias para `response.send`:

``` js
Route.get('/users', async ({ response }) => {
  response.json(await User.all())
})
```

## Fazendo a resposta
A partir da versão 4.0, você também pode retornar valores do método de fechamento de rota ou controlador em vez 
de usar os métodos `response` dedicados.

Abaixo é equivalente a `response.send` ou `response.json` e pode parecer mais natural com uma simples declaração de retorno:

``` js
Route.get('/', async () => {
  return await User.all()
})
```

### Evitar retornos de chamada
Como o ciclo de vida da solicitação/resposta permite retornar valores ou chamar métodos de resposta dedicados, 
o AdonisJs desencoraja o uso de retornos de chamada por completo.

A seguinte resposta enviada dentro de um retorno de chamada não funcionará:

``` js
Route.get('/', async ({ response }) => {
  fs.readFile('somefile', (error, contents) => {
    response.send(contents)
  })
})
```

O motivo pelo qual o código acima não funciona é porque, assim que o manipulador de rota é executado, o AdonisJs encerra a 
resposta - como o retorno de chamada é executado mais tarde, ocorrerá um erro!

### Promisfying callbacks
O que você pode fazer é promisificar seu retorno de chamada e usá-lo com `await`:

``` js
const fs = use('fs')
const Helpers = use('Helpers')
const readFile = Helpers.promisify(fs.readFile)

Route.get('/', async ({ response }) => {
  return await readFile('somefile')
})
```

O JavaScript tem um ecossistema rico e é 100% possível escrever código sem retornos de chamada apenas promisfizando-os e, 
como comunidade, queremos incentivar essa abordagem.

### Mas... eu gosto das minhas chamadas de retorno!
Se você ainda prefere retornos de chamada, o AdonisJs fornece uma maneira de continuar usando-os.

Simplesmente instrua o objeto `response` a não terminar implicitamente:

``` js
Route.get('/', async ({ response }) => {
  response.implicitEnd = false

  fs.readFile('somefile', (error, contents) => {
    response.send(contents)
  })
})
```

## Cabeçalhos
Use os seguintes métodos para definir/remover cabeçalhos de resposta.

### header
Defina um valor de cabeçalho:

``` js
response.header('Content-type', 'application/json')
```

### safeHeader
Defina apenas um valor de cabeçalho se ele ainda não existir:

``` js
response.safeHeader('Content-type', 'application/json')
```

### removeHeader
Remova um cabeçalho existente:

``` js
response.removeHeader('Content-type')
```

### type
Defina o cabeçalho `Content-Type`:

``` js
response.type('application/json')
```

## Cookie
Use os seguintes métodos para definir/remover cookies de uma resposta.

### cookie
Defina um valor de cookie:

``` js
response.cookie('cartTotal', 20)
```

### clearCookie
Remova um valor de cookie existente (definindo sua expiração no passado):

``` js
response.clearCookie('cartTotal')
```

### plainCookie
Como todos os cookies são criptografados e assinados, não é possível lê-los no código JavaScript do front-end.

Nesse caso, convém definir um cookie simples:

``` js
// Não sinalizado ou criptografado
response.plainCookie('cartTotal', 20)
```

## Redirecionamentos
Use um dos seguintes métodos para redirecionar solicitações para um URL diferente.

### redirect(url, [sendParams = false], [status = 302])
Redirecione a solicitação para um URL diferente (por padrão, ele definirá o status como 302):

``` js
response.redirect('/url')

// ou
response.redirect('/url', false, 301)
```

Você pode enviar os parâmetros de solicitação atuais para o local de redirecionamento, definindo o segundo parâmetro para true:

``` js
response.redirect('/url', true)
```

### route(rota, [dados], [domínio], [sendParams = false], [status = 302])
Redirecionar para uma rota (via nome da rota ou método do controlador):

``` js
Route
  .get('users/:id', 'UserController.show')
  .as('profile')
```

``` js
// via nome de rota
response.route('profile', { id: 1 })

// via método do controller
response.route('UserController.show', { id: 1 })
```

Como o AdonisJs permite registrar rotas para vários domínios , você também pode instruir este método para criar a URL para um 
domínio específico:

``` js
response.route('posts', { id: 1 }, 'blog.adonisjs.com')
```

## Anexos
O objeto de resposta simplifica o fluxo de arquivos do seu servidor para o cliente.

### download (filePath)
Transmitir o arquivo para o cliente:

``` js
response.download(Helpers.tmpPath('uploads/avatar.jpg'))
```

Este método não força o cliente a baixar o arquivo como um anexo (por exemplo, os navegadores podem optar por exibir o arquivo 
em uma nova janela).

### attachment (caminho do arquivo, [nome], [disposição])
Forçar o download do arquivo:
``` js
response.attachment(
  Helpers.tmpPath('uploads/avatar.jpg')
)
```

Faça o download com um nome personalizado:

``` js
response.attachment(
  Helpers.tmpPath('uploads/avatar.jpg'),
  'myAvatar.jpg' // Nome customizável
)
```

## Métodos Descritivos
O AdonisJs é enviado com várias mensagens descritivas, que são mais legíveis que o método `send`. Vamos pegar este exemplo.

``` js
response.unauthorized('Login First')
```

é mais legível do que

``` js
response.status(401).send('Login First')
```

Abaixo está a lista de todos os métodos descritivos e seus status HTTP correspondentes. Verifique [httpstatuses.com](https://httpstatuses.com/) para saber 
mais sobre os códigos de status HTTP.

| Método                      | Status da resposta HTTP |
|-----------------------------|-------------------------|
| ok                          | 200                     |
| created                     | 201                     |
| accepted                    | 202                     |
| nonAuthoritativeInformation | 203                     |
| noContent                   | 204                     |
| resetContent                | 205                     |
| partialContent              | 206                     |
| multipleChoices             | 300                     |
| movedPermanently            | 301                     |
| found                       | 302                     |
| seeOther                    | 303                     |
| notModified                 | 304                     |
| useProxy                    | 305                     |
| temporaryRedirect           | 307                     |
| badRequest                  | 400                     |
| unauthorized                | 401                     |
| paymentRequired             | 402                     |
| forbidden                   | 403                     |
| notFound                    | 404                     |
| methodNotAllowed            | 405                     |
| notAcceptable               | 406                     |
| proxyAuthenticationRequired | 407                     |
| requestTimeout              | 408                     |
| conflict                    | 409                     |
| gone                        | 410                     |
| lengthRequired              | 411                     |
| preconditionFailed          | 412                     |
| requestEntityTooLarge       | 413                     |
| requestUriTooLong           | 414                     |
| unsupportedMediaType        | 415                     |
| requestedRangeNotSatisfiable| 416                     |
| expectationFailed           | 417                     |
| unprocessableEntity         | 422                     |
| tooManyRequests             | 429                     |
| internalServerError         | 500                     |
| notImplemented              | 501                     |
| badGateway                  | 502                     |
| serviceUnavailable          | 503                     |
| gatewayTimeout              | 504                     |
| httpVersionNotSupported     | 505                     |

## Estendendo resposta
Também é possível estender o prototype `Response` adicionando seus próprios métodos, conhecidos como macros.

> Como o código para estender o `Response` precisa ser executado apenas uma vez, você pode usar provedores ou ganchos do Ignitor para 
> fazer isso. Leia [Estendendo o núcleo](https://adonisjs.com/docs/4.1/extending-adonisjs) para obter mais informações.

``` js
const Response = use('Adonis/Src/Response')

Response.macro('sendStatus', function (status) {
  this.status(status).send(status)
})
```
