# Resposta

Para finalizar uma solicitação HTTP, você deve encerrar explicitamente a resposta. A instância da classe *Response* do AdonisJs facilita a renderização de visualizações nunjucks ou o envio de JSON formatado para a construção de APIs RESTful.

::: tip DICA
Você pode acessar o *objeto de resposta* bruto do Node.js como `response.response`.
:::

## Exemplo básico
A instância de resposta é passada junto com a instância `request` para todos os controladores e fechamentos de rota, e a mesma é usada para renderizar visualizações ou fazer uma resposta JSON

### Renderizando visualizações
```js
Route
  .get('/', function * (request, response) {
    yield response.sendView('welcome') // resources/views/welcome.njk
  })
```

### Resposta JSON
```js
Route
  .get('users', function * (request, response) {
    const users = yield User.all() // buscar usuários
    response.json(users)
  })
```

## Métodos de resposta
Abaixo está a lista de métodos para enviar resposta HTTP, cabeçalhos e cookies.

#### `send(body)`
O método Send encerrará a solicitação enviando os dados fornecidos. Você pode enviar diferentes tipos de dados, e o AdonisJs sabe como analisá-los e definir cabeçalhos corretos para eles.

```js
response.send('Hello world')
// ou
response.send({ name: 'doe' })
// ou
response.send(1)
```

### `status(code)`
Define o código de status HTTP para uma determinada solicitação. Que é 200 por padrão.

```js
response.status(201).send('Created')
```

#### `json(body)`
Criando uma resposta JSON com o cabeçalho Content-Type definido como *application/json*.

```js
response.json({ name: 'doe' })
```

#### `jsonp(body)`
Cria uma resposta JSONP com o cabeçalho Content-Type definido como *text/javascript*. Ele fará uso do retorno de chamada definido como a string de consulta ou retornará para `http.jsonpCallback` definido dentro do arquivo `config/app.js`.

```js
response.jsonp({ name: 'doe' })
```

#### `vary(field)`
Adiciona o cabeçalho vary à resposta. Entender a necessidade do Vary é bem amplo. Saiba mais sobre ele [aqui](https://www.fastly.com/blog/best-practices-for-using-the-vary-header)

```js
response.vary('Accept-Encoding')
```

#### `sendView(path)`
Renderize uma visualização nunjucks.

```js
yield response.sendView('welcome')
```

#### `download(filePath)`
Transmita um arquivo para download.

```js
response.download(Helpers.storagePath('report.xls'))
```

#### `attachment(filePath, [name], [disposition=attachment])`
Force o download do arquivo definindo o cabeçalho *Content-Disposition*.

```js
response.attachment(Helpers.storagePath('report.xls'), 'Daily-Report.xls')
```

## Cabeçalhos de resposta

#### `header(key, value)`
Acrescente o cabeçalho à resposta.

```js
response.header('Content-type', 'application/json')
```

#### `removeHeader(key)`
Remove o cabeçalho existente da resposta.

```js
response.removeHeader('Accept')
```

## Redireciona

#### `location(url)`
Define o cabeçalho *Location* para a resposta. Você também pode passar a palavra-chave `back`, que usará o cabeçalho *Referrer* da solicitação.

```js
response.location('/signup')
// ou
response.location('back')
```

#### `redirect(url, [status=302])`
Conclui a resposta redirecionando a solicitação para a URL fornecida.

```js
response.redirect('back')
// ou
response.redirect('/welcome', 301)
```

#### `route(route, data, status)`
Redireciona para uma rota definida.

::: info OBSERVAÇÃO
Se o AdonisJs não conseguir encontrar uma rota com o nome fornecido, ele a considerará como uma URL e redirecionará para ela.
:::

```js
Route
  .get('users/:id', '...')
  .as('profile')

response.route('profile', {id: 1})
// redireciona para /user/1
```

## Métodos descritivos
O AdonisJs vem com um monte de mensagens descritivas, que são mais legíveis do que o método `send`. Vamos pegar este exemplo.

```js
response.unauthorized('Login First')
```

é mais legível do que

```js
response.status(401).send('Login First')
```

Abaixo está a lista de todos os métodos descritivos e seus status HTTP correspondentes. Verifique [httpstatuses.com](https://httpstatuses.com) para saber mais sobre códigos de status HTTP.

| Método                        | Status Http           |
|-------------------------------|-----------------------|
| continue                      | 100                   |
| switchingProtocols            | 101                   |
| ok                            | 200                   |
| created                       | 201                   |
| accepted                      | 202                   |
| nonAuthoritativeInformation   | 203                   |
| noContent                     | 204                   |
| resetContent                  | 205                   |
| partialContent                | 206                   |
| multipleChoices               | 300                   |
| movedPermanently              | 301                   |
| found                         | 302                   |
| seeOther                      | 303                   |
| notModified                   | 304                   |
| useProxy                      | 305                   |
| temporaryRedirect             | 307                   |
| badRequest                    | 400                   |
| unauthorized                  | 401                   |
| paymentRequired               | 402                   |
| forbidden                     | 403                   |
| notFound                      | 404                   |
| methodNotAllowed              | 405                   |
| notAcceptable                 | 406                   |
| proxyAuthenticationRequired   | 407                   |
| requestTimeout                | 408                   |
| conflict                      | 409                   |
| gone                          | 410                   |
| lengthRequired                | 411                   |
| preconditionFailed            | 412                   |
| requestEntityTooLarge         | 413                   |
| requestUriTooLong             | 414                   |
| unsupportedMediaType          | 415                   |
| requestedRangeNotSatisfiable  | 416                   |
| expectationFailed             | 417                   |
| unprocessableEntity           | 422                   |
| tooManyRequests               | 429                   |
| internalServerError           | 500                   |
| notImplemented                | 501                   |
| badGateway                    | 502                   |
| serviceUnavailable            | 503                   |
| gatewayTimeout                | 504                   |
| httpVersionNotSupported       | 505                   |

## Estendendo a resposta
Muitas vezes você tem o requisito de estender o protótipo `Response` anexando novos métodos. O mesmo pode ser feito definindo uma macro na classe Response.

#### Específico do aplicativo
Se suas macros forem específicas apenas para seu aplicativo, use o arquivo `app/Listeners/Http.js` para ouvir o evento *start* e adicionar uma macro personalizada.

```js
// app/Listeners/Http.js

Http.onStart = function () {
  const Response = use('Adonis/Src/Response')
  Response.macro('sendStatus', function (status) {
    this.status(status).send(status)
  })
}
```

#### Via provedor
Se você estiver escrevendo um módulo/complemento para AdonisJs, pode adicionar uma macro dentro do método `boot` do seu provedor de serviços.

```js
const ServiceProvider = require('adonis-fold').ServiceProvider

class MyServiceProvider extends ServiceProvider {

  boot () {
    const Response = use('Adonis/Src/Response')
    Response.macro('sendStatus', function (status) {
      this.status(status).send(status)
    })
  }

  * register () {
    // registro de vinculações
  }

}
```

Macros definidas podem ser usadas como qualquer outro método `response`.

```js
response.sendStatus(404)
```
