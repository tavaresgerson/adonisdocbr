---
title: Request
category: basics
---

# Solicitação

Este guia descreve como usar o objeto [Solicitação HTTP](https://github.com/adonisjs/adonis-framework/blob/develop/src/Request/index.js) para ler dados de solicitação.

::: tip DICA
O objeto `req` bruto do Node.js pode ser acessado via `request.request`.
:::

O AdonisJs passa o objeto de solicitação HTTP atual como parte do [Contexto HTTP](/docs/02-Concept/01-Request-Lifecycle.md) que é enviado para todos os manipuladores de rota e middleware:

```js
Route.get('/', ({ request }) => {
  //
})
```

No exemplo acima, usamos [desestruturação ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) para obter o objeto `request` do objeto de contexto HTTP passado.

## Corpo da solicitação
O objeto da solicitação oferece vários métodos úteis para ler o corpo da solicitação.

Primeiro, certifique-se de ter instalado o middleware **BodyParser**.

Se não tiver, siga as etapas abaixo.

### Configurando o BodyParser

::: warning NOTA
Os boilerplates Fullstack e somente API vêm pré-configurados com o middleware BodyParser.
:::

Execute o comando de instalação do BodyParser:

```bash
adonis install @adonisjs/bodyparser
```

Então, registre o provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/bodyparser/providers/BodyParserProvider'
]
```

Finalmente, registre o middleware global dentro do arquivo `start/kernel.js`:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/BodyParser'
]
```

### Métodos do corpo
A seguinte lista de métodos pode ser usada para ler o corpo da solicitação.

#### `all`
Retorna um objeto contendo todos os dados da solicitação (mescla parâmetros de consulta e dados do corpo da solicitação):

```js
const all = request.all()
```

#### `get`
Retorna um objeto contendo dados de parâmetros de consulta:

```js
const query = request.get()
```

#### `post`
Retorna um objeto contendo dados do corpo da solicitação:

```js
const body = request.post()
```

#### `raw`
Retorna dados brutos do corpo como uma string:

```js
const raw = request.raw()
```

::: warning OBSERVAÇÃO
Se os dados brutos forem JSON e `Content-type: application/json` estiver definido, o BodyParser os analisará de forma inteligente e os retornará como parte do método `post`.
:::

#### `only`
Retorna um objeto com apenas as chaves especificadas:

```js
const data = request.only(['username', 'email', 'age'])
```

#### `except`
Retorna um objeto com tudo, exceto as chaves especificadas (oposto de only):

```js
const data = request.except(['csrf_token', 'submit'])
```

#### `input`
Obtém o valor de uma determinada chave (se não existir, retorna o valor `default`):

```js
const drink = request.input('drink')

// com valor padrão
const drink = request.input('drink', 'coffee')
```

## Solicitar coleção
Muitas vezes, você pode querer manipular formulários HTML que enviam uma matriz de dados sobre pares chave/valor.

Por exemplo, o formulário a seguir cria vários usuários de uma vez:

```html
<form method="POST" action="/users">

  <input type="text" name="username[0]" />
  <input type="text" name="age[0]" />

  <input type="text" name="username[1]" />
  <input type="text" name="age[1]" />

</form>
```

Digamos que queremos obter o nome de usuário e a idade dentro do controlador:

```js
const users = request.only(['username', 'age'])

// output
{ username: ['virk', 'nikk'], age: [26, 25] }
```

O exemplo acima não pode ser salvo no banco de dados porque não está no formato correto.

Usando `request.collect`, podemos formatá-lo para que esteja pronto para salvar no banco de dados:

```js
const users = request.collect(['username', 'age'])

// Saída
[{ username: 'virk', age: 26 }, { username: 'nikk', age: 25 }]

// salve para o banco de dados
await User.createMany(users)
```

## Cabeçalhos
Você pode ler os cabeçalhos da solicitação usando um dos seguintes métodos.

#### `header`
O valor do cabeçalho para uma determinada chave (opcionalmente com valor padrão):

```js
var auth = request.header('authorization')

// case-insensitive
var auth = request.header('Authorization')

// com valor padrão
const other = request.header('some-other-header', 'default')
```

#### `headers`
Retorna um objeto de todos os dados do cabeçalho:

```js
const headers = request.headers()
```

## Cookies
Você pode ler cookies da solicitação usando um dos seguintes métodos.

#### `cookie`
O valor do cookie para uma determinada chave (opcionalmente com valor padrão):

```js
const cartTotal = request.cookie('cart_total')

// com valor padrão
const cartTotal = request.cookie('cart_total', 0)
```

#### `cookies`
Retorna um objeto de todos os dados do cookie:

```js
const cookies = request.cookies()
```

Os seguintes métodos são usados ​​para ler cookies definidos no lado do cliente.

#### `plainCookie`
O valor bruto do cookie para uma determinada chave (opcionalmente com valor padrão):

```js
const jsCookie = request.plainCookie('cart_total')

// com valor padrão
const jsCookie = request.plainCookie('cart_total', 0)
```

#### `plainCookies`
Retorna um objeto de todos os dados brutos do cookie:

```js
const plainCookies = request.plainCookies()
```

## Negociação de conteúdo
[Negociação de conteúdo](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) é uma maneira do servidor e do cliente decidirem sobre o melhor tipo de resposta a ser retornado do servidor.

Os servidores da Web não servem apenas páginas da Web, eles também precisam lidar com respostas de API servidas como *JSON*, *XML*, etc.

Em vez de criar URLs separadas para cada tipo de conteúdo, o consumidor pode pedir ao servidor para retornar a resposta em um formato específico.

Para construir a resposta em um formato específico, o servidor precisa saber o formato solicitado primeiro. Isso pode ser feito usando o método `accepts`.

#### `accepts`
Lê o cabeçalho `Accept` para ajudar a determinar o formato da resposta:

```js
const bestFormat = request.accepts(['json', 'html'])

if (bestFormat === 'json') {
  return response.json(users)
}

return view.render('users.list', { users })
```

#### `language`
O idioma também pode ser negociado com base no cabeçalho `Accept-Language`:

```js
const language = request.language(['en', 'fr'])
```

## Métodos de solicitação

Abaixo está uma lista de todos os métodos de solicitação e seus usos de exemplo.

#### `url`
Retorna a URL da solicitação atual:

```js
const url = request.url()
```

#### `originalUrl`
Retorna a URL da solicitação atual completa com strings de consulta:

```js
const url = request.originalUrl()
```

#### `method`
Retorna o método de solicitação HTTP:

```js
const method = request.method()
```

#### `intended`
Como o AdonisJs permite [falsificação de método](#method-spoofing), você pode buscar o método real usando o método `intended`:

```js
const method = request.intended()
```

#### `ip`
Retorna o endereço IP mais confiável para o usuário:

```js
const ip = request.ip()
```

#### `ips`
Retorna uma matriz de ips do mais para o menos confiável (remove o endereço ip padrão, que pode ser acessado pelo método `ip`):

```js
const ips = request.ips()
```

#### `subdomains`
Retorna uma lista de subdomínios de solicitação (remove `www` da lista):

```js
const subdomains = request.subdomains()
```

#### `ajax`
Verifica o cabeçalho `X-Requested-With` para determinar se a solicitação é ajax ou não:

```js
if (request.ajax()) {
  // faça alguma coisa
}
```

#### `pjax`
[Pjax](https://github.com/defunkt/jquery-pjax) é uma maneira evoluída de usar Ajax para fornecer melhores experiências de usuário para aplicativos tradicionais. No mundo Rails, é conhecido como Turbolinks.

Este método procura o cabeçalho `X-PJAX` para identificar se uma solicitação é pjax ou não:

```js
if (request.pjax()) {
  // faça alguma coisa
}
```

#### `hostname`
Retorna o nome do host da solicitação:

```js
const hostname = request.hostname()
```

#### `protocol`
Retorna o protocolo da solicitação:

```js
const protocol = request.protocol()
```

#### `match`
Retorna se o conjunto de expressões passadas corresponde à URL da solicitação atual:

```js
// URL de solicitação atual - posts/1

request.match(['posts/:id']) // retorna true
```

#### `hasBody`
Um booleano que indica se a solicitação tem um corpo de postagem (usado principalmente pelo BodyParser para determinar se deve ou não analisar o corpo):

```js
if (request.hasBody()) {
  // faça alguma coisa
}
```

#### `is`
O método `is` retorna o melhor tipo de conteúdo correspondente para a solicitação atual.

A verificação é inteiramente baseada no cabeçalho `content-type`:

```js
// assumindo que o tipo de conteúdo é `application/json`

request.is(['json', 'html']) // retorna - json

request.is(['application/*']) // retorna - application/json
```

## Método spoofing
Formulários HTML são capazes apenas de fazer solicitações `GET` e `POST`, o que significa que você não pode utilizar as convenções REST de outros métodos HTTP como `PUT`, `DELETE` e assim por diante.

AdonisJs simplifica ignorar o método de solicitação adicionando um parâmetro `_method` à sua sequência de consulta, executando a rota correta para você automaticamente:

```js
// .start/routes.js

Route.put('users', 'UserController.update')
```

```html
<form method="POST" action="/users?_method=PUT">
```

O exemplo acima funciona nos seguintes casos:

1. O método de solicitação original é `POST`.
2. `allowMethodSpoofing` é habilitado dentro do arquivo `config/app.js`.

## Estendendo solicitação
Também é possível estender o protótipo `Request` adicionando seus próprios métodos, conhecidos como macros.

::: warning NOTA
Como o código para estender `Request` precisa ser executado apenas uma vez, você pode usar [providers](/docs/02-Concept/03-service-providers.md) ou [Ignitor hooks](/docs/02-Concept/05-ignitor.md) para fazer isso. Leia [Extending the Core](/docs/06-Digging-Deeper/03-Extending-the-Core.md) para obter mais informações.
:::

```js
const Request = use('Adonis/Src/Request')

Request.macro('cartValue', function () {
  return this.cookie('cartValue', 0)
})
```
