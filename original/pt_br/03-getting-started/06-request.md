# Solicitação

O AdonisJs torna super fácil acessar informações de solicitação HTTP. Todos os métodos do controlador e fechamentos de rota recebem uma instância da classe `Request`, que é uma camada açucarada sobre a [solicitação HTTP do Node.js](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_class_http_server).

> DICA: Você pode acessar o *objeto de solicitação* bruto do Node.js como `request.request`.

## Exemplo básico
Vamos pegar o caso clássico de ler o corpo da solicitação para uma determinada solicitação HTTP.

```js
const Route = use('Route')

Route.get('posts', function * (request, response) {
  const body = request.all()

  // cherry picking fields
  const body = request.only('title', 'description', 'categories')
})
```

## Métodos de solicitação
Abaixo está a lista de todos os métodos disponíveis na instância `Request`.

#### all()
Retorna todos os valores extraídos das strings de consulta e do corpo da solicitação.

```js
const data = request.all()
```

#### input(key, [defaultValue])
Retorna o valor das strings de consulta e do corpo da solicitação para uma determinada chave. Se o valor não existir, o valor padrão será retornado.

```js
const name = request.input('name')
const subscribe = request.input('subscribe', 'yes')
```

#### only(...keys)
Semelhante a all, mas retorna um objeto com valores selecionados de chaves definidas. `null` será retornado para chaves não existentes.

```js
const data = request.only('name', 'email', 'age')

/* returns
{
  name: '..',
  email: '..',
  age: '..'
}
*/
```

#### except(...keys)
Oposto de [only](#onlykeys)

```js
const data = request.except('_csrf', 'submit')
```

#### get
Retorna um objeto serializado de strings de consulta.

```js
const data = request.get()
```

#### post
Retorna um objeto serializado do corpo da solicitação.

```js
const data = request.post()
```

#### fresh
Informa se a solicitação é nova ou não, verificando ETag e o cabeçalho expires.

```js
request.fresh()
```

#### stale
Oposto de [fresh](#fresh)

```js
request.stale()
```

#### ip
Retorna o endereço IP mais confiável para uma determinada solicitação. Se seu aplicativo estiver atrás de um servidor proxy como o Nginx, certifique-se de habilitar `http.trustProxy` dentro do arquivo `config/app.js`.

```js
request.ip()
```

#### ips
Retorna uma matriz de endereços IP classificados do mais para o menos confiável.

```js
request.ips()
```

#### secure
Informa se a solicitação é atendida por HTTPS ou não.

```js
request.secure()
```

#### subdomains
Retorna uma matriz de subdomínios para uma URL fornecida. Por exemplo, `api.example.org` terá o subdomínio como `['api']`.

```js
request.subdomains()
```

#### ajax
Retorna se a solicitação atual é feita usando *Ajax(XMLHttpRequest)* ou não.

```js
request.ajax()
```

#### pjax
[Pjax](https://www.google.co.in/search?q=Pjax#q=What+is+Pjax) é uma solicitação ajax híbrida. Se você é do mundo Ruby on Rails, é bem parecido com Turbolinks.

#### hostname
Retorna o nome do host da solicitação.

```js
request.hostname()
```

#### url
Retorna a URL atual da solicitação. Ela cortará a string de consulta.

```js
// url - http://foo.com/users?orderBy=desc&limit=10

request.url()

// returns - http://foo.com/users
```

#### originalUrl
```js
request.originalUrl()
```

#### method
```js
request.method()
```

#### param(key, [defaultValue])
Retorna o parâmetro de rota para uma determinada chave. Saiba mais sobre os parâmetros de rota [aqui](/markdown/03-getting-started//05-routing.md#route-parameters).

#### params
Retorna todos os params como um objeto.

```js
request.params()
```

#### format
Retorna o formato atual para uma determinada solicitação. Para que funcione, você precisa definir [formatos de rota](/markdown/03-getting-started/05-routing.md#content-negotiation-via-routes).

```js
request.format()
```

#### match(...keys)
Retorna um booleano indicando se a URL da solicitação atual corresponde a algum dos padrões fornecidos.

```js
// url - /user/1

request.match('/users/:id') // true
request.match('/users/all') // false
request.match('/users/all', '/user/(.+)') // true
```

#### hasBody
Retorna se a solicitação tem o corpo ou não.

```js
request.hasBody()
```

## Cabeçalhos
Você pode usar os métodos abaixo para ler cabeçalhos de solicitação

#### header(key, [defaultValue])
Retorna o valor para uma determinada chave de cabeçalho ou retorna o valor padrão.

```js
const csrfToken = request.header('CSRF-TOKEN')
// or
const time = request.header('x-time', new Date().getTime())
```

#### headers
Retorna todos os cabeçalhos como um objeto.

```js
request.headers()
```

## Coleção de solicitações
Muitas vezes, os aplicativos têm requisitos para salvar várias entradas no banco de dados usando formulários HTML. Vamos dar um exemplo de salvar vários usuários.

```html
<form method="POST" action="/users">
  <div class="row">
    <h2> User 1 </h2>
    <input type="email" name="email[]" />
    <input type="password" name="password[]" />
  </div>

  <div class="row">
    <h2> User 2 </h2>
    <input type="email" name="email[]" />
    <input type="password" name="password[]" />
  </div>

  <button type="submit"> Create Users </button>
</form>
```

Acima, definimos `email[]` e `password[]` como uma matriz para que possamos enviar vários usuários em uma única solicitação e a entrada no servidor será bem semelhante ao formato abaixo.

```js
// Received

{
  email: ['bar@foo.com', 'baz@foo.com'],
  password: ['secret', 'secret1']
}
```

Até este ponto, o formulário está fazendo o que deveria fazer. Enquanto os dados recebidos pelo servidor são bem difíceis de processar para colocá-los no formato correto.

```js
// Expected

[
  {
    email: 'bar@foo.com',
    password: 'secret'
  },
  {
    email: 'baz@foo.com',
    password: 'secret1'
  }
]
```

Claro, você pode fazer um loop pela entrada original e criar uma nova matriz conforme a saída esperada, mas isso parece ser demais para um caso de uso geral. O AdonisJs torna todo o processo perfeito ao introduzir um método auxiliar chamado `collect`.

#### collect(...keys)
```js
const users = request.collect('email', 'password')
const savedUsers = yield User.createMany(users)
```

## Negociação de conteúdo
A negociação de conteúdo é uma maneira de encontrar o melhor tipo de resposta para uma determinada solicitação. O usuário final faz uso de cabeçalhos HTTP para definir o tipo de resposta que espera do servidor.

> DICA: Você também pode fazer uso de Rotas para definir tipos de retorno explícitos. Saiba mais sobre link:routing#_content_negotiation_via_routes[negociação de conteúdo via rotas].

#### is(...keys)
Retorna se uma solicitação é um dos tipos fornecidos. Este método analisará o cabeçalho Content-type da solicitação.

```js
const isPlain = request.is('html', 'plain')
```

#### accepts(...keys)
Verifica o cabeçalho `Accept` para negociar o melhor tipo de resposta para uma determinada solicitação HTTP.

```js
const type = request.accepts('json', 'html')

switch (type) {
  case 'json':
    response.json({hello:"world"})
    break
  case 'html':
    response.send('<h1>Hello world</h1>')
    break
}
```

## Estendendo a solicitação
Muitas vezes, você tem o requisito de estender o protótipo `Request` anexando novos métodos. O mesmo pode ser feito definindo uma macro na classe Request.

#### Específico do aplicativo
Se suas macros forem específicas apenas para seu aplicativo, use o arquivo `app/Listeners/Http.js` para ouvir o evento *start* e adicionar uma macro personalizada.

```js
// app/Listeners/Http.js

Http.onStart = function () {
  const Request = use('Adonis/Src/Request')
  Request.macro('cartValue', function () {
    return this.cookie('cartValue', 0)
  })
}
```

#### Via Provider
Se você estiver escrevendo um módulo/addon para AdonisJs, você pode adicionar uma macro dentro do método `boot` do seu service provider.

```js
const ServiceProvider = require('adonis-fold').ServiceProvider

class MyServiceProvider extends ServiceProvider {

  boot () {
    const Request = use('Adonis/Src/Request')
    Request.macro('cartValue', function () {
      return this.cookie('cartValue', 0)
    })
  }

  * register () {
    // register bindings
  }

}
```

Macros definidas podem ser usadas como qualquer outro método `request`.

```js
const cartValue = request.cartValue()
```
