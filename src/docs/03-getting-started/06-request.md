# Requisição

AdonisJs torna super fácil acessar informações de requisição HTTP. Todos os métodos do controlador e as fechaduras da rota recebem uma instância da classe `Request`, que é uma camada açucarada sobre a [classe de requisição HTTP](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_class_http_server) do Node.js.

::: tip DICA
Você pode acessar o objeto *raw request* do Node.js como `request.request`.
:::

## Exemplo básico
Vamos pegar o caso clássico de ler o corpo da requisição HTTP para uma determinada requisição.

```js
const Route = use('Route')

Route.get('posts', function * (request, response) {
  const body = request.all()

  // seleção de campos
  const body = request.only('title', 'description', 'categories')
})
```

## Métodos de Solicitação
Abaixo está a lista de todos os métodos disponíveis na instância Request.

#### all()
Retorna todos os valores extraídos de strings de consulta e corpo da requisição.

```js
const data = request.all()
```

#### input(chave, [valor padrão])
Retorna o valor de query strings e corpo da requisição para uma chave específica. Se o valor não existir, será retornado o valor padrão.

```js
const name = request.input('name')
const subscribe = request.input('subscribe', 'yes')
```

#### apenas(...chaves)
Semelhante a todos, mas retorna um objeto com valores selecionados de chaves definidas. 'null' será retornado para chaves inexistentes.

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

#### except(...) chaves
O oposto de xref: _only_keys [apenas]

```js
const data = request.except('_csrf', 'submit')
```

#### obter
Retorna um objeto serializado de strings de consulta.

```js
const data = request.get()
```

#### post
Retorna um objeto serializado do corpo da requisição.

```js
const data = request.post()
```

#### fresh
Indica se a solicitação é fresca ou não verificando os cabeçalhos ETag e expires.

```js
request.fresh()
```

#### stale
O oposto de [fresco](#fresco) é:

```js
request.stale()
```

#### ip
Retorna o endereço IP mais confiável para uma solicitação específica. Se seu aplicativo estiver atrás de um servidor proxy como Nginx, certifique-se de habilitar o 'http.trustProxy' dentro do arquivo 'config/app.js'.

```js
request.ip()
```

#### ips
Retorna um array de endereços IP classificados do mais confiável para o menos confiável.

```js
request.ips()
```

#### seguro
Indica se a requisição é servida sobre HTTPS ou não.

```js
request.secure()
```

#### subdomínios
Retorna um array de subdomínios para uma URL dada. Por exemplo, `api.example.org` terá o subdomínio como `['api']`.

```js
request.subdomains()
```

#### ajax
Retorna se a requisição atual foi feita usando *Ajax(XMLHttpRequest)* ou não.

```js
request.ajax()
```

#### pjax
O Pjax é um requisição híbrido de Ajax. Se você estiver no mundo do Ruby on Rails, é bastante semelhante ao Turbolinks.

#### hostname
Retorna o nome do host da solicitação.

```js
request.hostname()
```

#### url
Retorna a URL atual da requisição. Ele vai aparar a string de consulta.

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

#### param(chave, [valorPadrão])
Retorna o parâmetro de rota para uma chave específica. Saiba mais sobre parâmetros de rota link: roteamento[_route_parameters][aqui].

#### params
Retorna todos os parâmetros como um objeto.

```js
request.params()
```

#### format
Retorna o formato atual para uma solicitação específica. Para fazer isso funcionar, você precisa definir link:routing:#_content_negotiation_via_routes[route formats].

```js
request.format()
```

#### match(...keys)
Retorna um valor booleano indicando se a URL da requisição atual corresponde a algum dos padrões fornecidos.

```js
// url - /user/1

request.match('/users/:id') // true
request.match('/users/all') // false
request.match('/users/all', '/user/(.+)') // true
```

#### TemCorpo
Retorna se a requisição tem o corpo ou não.

```js
request.hasBody()
```

## Cabeçalhos
Você pode usar os métodos abaixo para ler cabeçalhos de requisição

#### header(chave, [valorPadrão])
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

## Coleção de Solicitações
Muitas aplicações têm requisitos de salvar múltiplas entradas no banco de dados usando formulários HTML. Vamos pegar um exemplo de salvar múltiplos usuários.

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

Acima, definimos o 'email[]' e 'senha []' como uma matriz para que possamos enviar vários usuários em um único pedido e a entrada no servidor parecerá muito semelhante ao formato abaixo.

Received:
```js
{
  email: ['bar@foo.com', 'baz@foo.com'],
  password: ['secret', 'secret1']
}
```

Até este ponto, o formulário está fazendo o que deveria fazer. Já os dados recebidos pelo servidor são bastante difíceis de processar para serem colocados no formato correto.

Esperado
```js
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

Claro, você pode iterar na entrada original e criar um novo array conforme o resultado esperado, mas isso parece ser muito para um caso de uso geral. O AdonisJS torna todo o processo sem costura com a introdução de um método auxiliar chamado "coletar".

#### collect(...) chaves
```js
const users = request.collect('email', 'password')
const savedUsers = yield User.createMany(users)
```

## Negociação de Conteúdo
Negociação de Conteúdo é uma forma de encontrar o melhor tipo de resposta para um determinado pedido. O usuário final utiliza cabeçalhos HTTP para definir o tipo de resposta que ele espera do servidor.

::: tip DICA
Você também pode usar rotas para definir tipos de retorno explícitos. Saiba mais sobre link:routing#_content_negotiation_via_routes[negociação de conteúdo via rotas].
:::

#### é (chave1 chave2 ...)
Retorna se uma requisição é de um dos tipos dados. Esse método irá analisar o cabeçalho Content-type da requisição.

```js
const isPlain = request.is('html', 'plain')
```

#### aceita(...chaves)
Verifica o cabeçalho 'Accept' para negociar a melhor resposta de tipo para uma determinada requisição HTTP.

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

## Extensão de Solicitação
Muitas vezes você tem o requisito de estender o protótipo de `Solicitação` anexando novos métodos. O mesmo pode ser feito definindo uma macro na classe Solicitação.

#### Aplicativo Específico
Se seus macros são específicos para sua aplicação, então utilize o arquivo `app/Listeners/Http.js` para escutar o evento *start* e adicionar um macro personalizado.

```js
// .app/Listeners/Http.js

Http.onStart = function () {
  const Request = use('Adonis/Src/Request')
  Request.macro('cartValue', function () {
    return this.cookie('cartValue', 0)
  })
}
```

#### Via Provedor
Se você estiver escrevendo um módulo/addon para o AdonisJS, você pode adicionar uma macro dentro do método `boot` de seu provedor de serviços.

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

Os macrodefinidos podem ser usados como qualquer outro método de `request`.

```js
const cartValue = request.cartValue()
```
