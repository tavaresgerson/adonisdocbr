# Resposta

Para finalizar uma requisição HTTP, você deve explicitamente encerrar a resposta. A classe *Response* do AdonisJs facilita para você renderizar views Nunjucks ou enviar JSON formatado para construir APIs RESTful.

> DICA:
> Você pode acessar o objeto de *resposta crua* do Node.js como `response.response`.

## Exemplo básico
A instância de resposta é passada para todos os controladores e fechamentos de rota ao longo da instância de solicitação, e o mesmo é usado para renderizar visualizações ou fazer uma resposta JSON

### Renderizando Visualizações
```js
Route
  .get('/', function * (request, response) {
    yield response.sendView('welcome') // resources/views/welcome.njk
  })
```

### Resposta em JSON
```js
Route
  .get('users', function * (request, response) {
    const users = yield User.all() // fetch users
    response.json(users)
  })
```

## Métodos de Resposta
Abaixo está a lista de métodos para enviar respostas HTTP, cabeçalhos e cookies.

#### enviar(corpo)
O método send irá encerrar a requisição enviando os dados fornecidos. Você pode enviar diferentes tipos de dados, e o AdonisJS sabe como analisá-los e definir as cabeçalhos corretos para eles.

```js
response.send('Hello world')
// or
response.send({ name: 'doe' })
// or
response.send(1)
```

### status(código)
Definir o código de estado HTTP para uma solicitação dada. Que é 200 por padrão.

```js
response.status(201).send('Created')
```

#### json(corpo)
Criando uma resposta JSON com o cabeçalho Content-Type definido como application/json.

```js
response.json({ name: 'doe' })
```

#### jsonp(corpo)
Cria uma resposta JSONP com cabeçalho Content-Type definido como "text/javascript". Ele fará uso de um retorno de chamada definido como parâmetro da string de consulta ou cairá no retorno de chamada http.jsonpCallback definido dentro do arquivo config/app.js.

```js
response.jsonp({ name: 'doe' })
```

#### variar(campo)
Adicionar cabeçalho à resposta. Entender a necessidade de variar é bastante amplo. Saiba mais sobre isso [aqui](https://www.fastly.com/blog/best-practices-for-using-the-vary-header)

```js
response.vary('Accept-Encoding')
```

#### sendView(caminho)
Renderizar uma visão de nunjucks.

```js
yield response.sendView('welcome')
```

#### downloadar(caminho_do_arquivo)
Transmitir um arquivo para download.

```js
response.download(Helpers.storagePath('report.xls'))
```

#### attachment(filePath, [name], [disposition=attachment])
Forçar o download do arquivo definindo o cabeçalho *Content-Disposition*.

```js
response.attachment(Helpers.storagePath('report.xls'), 'Daily-Report.xls')
```

## Cabeçalhos de Resposta

#### header(chave, valor)
Adicione o cabeçalho à resposta.

```js
response.header('Content-type', 'application/json')
```

#### removeHeader(chave)
Remover o cabeçalho existente da resposta.

```js
response.removeHeader('Accept')
```

## Redirecionamentos

#### localização(url)
Configurar o cabeçalho *Location* para a resposta. Você também pode passar a palavra-chave `back`, que usará o cabeçalho *Referer* da requisição.

```js
response.location('/signup')
// or
response.location('back')
```

#### redirect(url, [status=302])
Termine a resposta redirecionando o pedido para a URL fornecida.

```js
response.redirect('back')
// or
response.redirect('/welcome', 301)
```

#### route(route, dados, status)
Redirecionar para uma rota definida.

NOTE: Se o Adonis não encontrar uma rota com o nome dado ele irá considerar como um URL e redirecionar para ele.

```js
Route
  .get('users/:id', '...')
  .as('profile')

response.route('profile', {id: 1})
// redirects to /user/1
```

## Métodos descritivos
AdonisJS envia uma série de mensagens descritivas, que são mais legíveis do que o método 'send'. Vamos pegar este exemplo.

```js
response.unauthorized('Login First')
```

é mais legível que

```js
response.status(401).send('Login First')
```

Abaixo está a lista de todos os métodos descritivos e seus respectivos códigos de estado HTTP. Verifique [httpstatus.com](https://httpstatus.com) para saber mais sobre os códigos de estado HTTP.


| Método | Estado de Resposta HTTP |
|--------|----------------------|
| Continue | 100
| switching Protocols | 101
| ok | 200
| Criado | 201
| aceito | 202
| Informação não autoritativa | 203
| noContent | 204
| resetar conteúdo | 205
| Conteúdo parcial | 206
| múltiplasEscolhas | 300
| move permanentemente | 301
| encontrado | 302
| ver outros | 303
| Não modificado | 304
| useProxy | 305
| redirecionamento temporário | 307
| badRequest | 400
| não autorizado | 401
| paymentRequired | 402
| Proibido | 403
| Não encontrado | 404
| Não foi possível traduzir o texto para o idioma solicitado. | 405
| Não aceitável | 406
| proxyAuthenticationRequired | 407
| requestTimeout | 408
| conflito | 409
| Gone | 410
| lengthRequired | 411
| Falha na condição pré-requisito | 412
| requestEntityTooLarge | 413
| requestUriTooLong | 414
| Não foi possível traduzir a seguinte frase para o idioma solicitado: unsupportedMediaType | 415
| range not satisfatível | 416
| Falha na expectativa | 417
| Entidade não processável | 422
| tooManyRequests | 429
| internalServerError | 500
| notimplemented | 501
| badGateway | 502
| Não foi possível conectar ao servidor. Tente novamente mais tarde. | 503
| gatewayTimeout | 504
| httpVersionNotSupported | 505

## Extensão de Resposta
Muitas vezes você tem o requisito de estender o protótipo de Resposta anexando novos métodos. O mesmo pode ser feito definindo um macro na classe de Resposta.

#### Aplicativo Específico
Se seus macros são específicos para sua aplicação, então utilize o arquivo `app/Listeners/Http.js` para escutar o evento *start* e adicionar um macro personalizado.

```js
// .app/Listeners/Http.js

Http.onStart = function () {
  const Response = use('Adonis/Src/Response')
  Response.macro('sendStatus', function (status) {
    this.status(status).send(status)
  })
}
```

#### Via Provedor
Se você estiver escrevendo um módulo/addon para o AdonisJS, você pode adicionar uma macro dentro do método `boot` de seu provedor de serviços.

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
    // register bindings
  }

}
```

Os macrodefinidos podem ser usados como qualquer outro método de resposta.

```js
response.sendStatus(404)
```
