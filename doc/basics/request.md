# Request (Solicitações)

Este guia descreve como usar o objeto Solicitação HTTP para ler os dados da solicitação.

> O objeto bruto `req` do Node.js pode ser acessado via `request.request`.

AdonisJs passa o objeto de solicitação HTTP atual como parte do contexto HTTP, que é enviado a todos os manipuladores de rota e 
middleware:

``` js
Route.get('/', ({ request }) => {
  //
})
```

No exemplo acima, usamos a [desestruturação do ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) para obter o objeto `request` de contexto HTTP passado.

## Corpo da requisição

O objeto de solicitação oferece vários métodos úteis para ler o corpo da solicitação.

Primeiro, verifique se você instalou o middleware `BodyParser`.

Caso contrário, siga as etapas abaixo.

## Configurando o BodyParser

> Os boilerplates do Fullstack e da API são pré-configurados com o middleware BodyParser.

Execute o comando de instalação do BodyParser:

```
adonis install @adonisjs/bodyparser
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

``` js
const providers = [
  '@adonisjs/bodyparser/providers/BodyParserProvider'
]
```

Por fim, registre o middleware global dentro do arquivo `start/kernel.js`:

``` js
const globalMiddleware = [
  'Adonis/Middleware/BodyParser'
]
```

## Métodos para o corpo da requisição
A lista de métodos a seguir pode ser usada para ler o corpo da solicitação.

### all
Retorna um objeto que contém todos os dados da solicitação (mescla parâmetros de consulta e dados do corpo da solicitação

``` js
const all = request.all()
```

### get
Retorna um objeto que contém dados de parâmetros de consulta:

``` js
const query = request.get()
```

### post
Retorna um objeto que contém dados do corpo da solicitação:

``` js
const body = request.post()
```

### raw
Retorna dados brutos do corpo como uma sequência:

``` js
const raw = request.raw()
```

> Se os dados brutos forem JSON e `Content-type: application/json` estiverem definidos, o `BodyParser` irá analisá-los de 
> maneira inteligente e retorná-los como parte do método post.

### only
Retorna um objeto apenas com as chaves especificadas:

``` js
const data = request.only(['username', 'email', 'age'])
```

### except
Retorna um objeto com tudo, exceto as chaves especificadas (somente o oposto de):

```
const data = request.except(['csrf_token', 'submit'])
```

### input
Obtenha o valor de uma determinada chave (se ela não existir, retorne o defaultvalor):

``` js
const drink = request.input('drink')

// com valor padrão
const drink = request.input('drink', 'coffee')
```

## Solicitar coleção
Com bastante freqüência, convém manipular formulários HTML que enviam uma matriz de dados por pares de chave/valor.

Por exemplo, o seguinte formulário cria vários usuários ao mesmo tempo:

``` html
<form method="POST" action="/users">

  <input type="text" name="username[0]" />
  <input type="text" name="age[0]" />

  <input type="text" name="username[1]" />
  <input type="text" name="age[1]" />

</form>
```

Digamos que queremos obter o nome de usuário e a idade dentro do controlador:

``` js
const users = request.only(['username', 'age'])

// saída
{ username: ['virk', 'nikk'], age: [26, 25] }
```
O exemplo acima não pode ser salvo no banco de dados, pois não está no formato correto.

Usando `request.collect` nós podemos formatá-lo para que esteja pronto para salvar no banco de dados:
``` js
const users = request.collect(['username', 'age'])

// saída
[{ username: 'virk', age: 26 }, { username: 'nikk', age: 25 }]

// salva no banco
await User.createMany(users)
```

## Cabeçalhos
Você pode ler os cabeçalhos da solicitação usando um dos seguintes métodos.

### header
O valor do cabeçalho para uma determinada chave (opcionalmente com valor padrão):

``` js
var auth = request.header('authorization')

// case-insensitive
var auth = request.header('Authorization')

// com valor padrão
const other = request.header('some-other-header', 'default')
```

### headers
Retorna um objeto de todos os dados do cabeçalho:

``` js
const headers = request.headers()
```

## Cookies
Você pode ler os cookies da solicitação usando um dos seguintes métodos.

# cookie
O valor do cookie para uma determinada chave (opcionalmente com valor padrão):

``` js
const cartTotal = request.cookie('cart_total')

// com valor padrão
const cartTotal = request.cookie('cart_total', 0)
```

### cookies
Retorna um objeto de todos os dados do cookie:

``` js
const cookies = request.cookies()
```

Os métodos a seguir são usados para ler os cookies definidos no lado do cliente.

### plainCookie
O valor bruto do cookie para uma determinada chave (opcionalmente com valor padrão):

``` js
const jsCookie = request.plainCookie('cart_total')

// com valor padrão
const jsCookie = request.plainCookie('cart_total', 0)
```

### plainCookies
Retorna um objeto de todos os dados brutos do cookie:

``` js
const plainCookies = request.plainCookies()
```

## Negociação de conteúdo
A [negociação de conteúdo](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) é uma maneira de o servidor e o 
cliente decidirem o melhor tipo de resposta a ser retornado do servidor.

Os servidores da Web não servem apenas páginas da Web - eles também precisam lidar com as respostas da API servidas como JSON, 
XML, etc.

Em vez de criar URLs separados para cada tipo de conteúdo, o consumidor pode solicitar ao servidor que retorne a resposta em um 
formato específico.

Para construir a resposta em um formato específico, o servidor precisa conhecer primeiro o formato solicitado. Isso pode ser 
feito usando o metodo `accepts`

### accepts
Lê o Acceptcabeçalho para ajudar a determinar o formato da resposta:

``` js
const bestFormat = request.accepts(['json', 'html'])

if (bestFormat === 'json') {
  return response.json(users)
}

return view.render('users.list', { users })
```

### language
O idioma também pode ser negociado com base no header `Accept-Language`:

``` js
const language = request.language(['en', 'fr'])
```

## Métodos de solicitação
Abaixo está uma lista de todos os métodos de solicitação e seus exemplos de uso.

### url
Retorna o URL da solicitação atual:

``` js
const url = request.url()
```

### originalUrl
Retorna o URL da solicitação atual completo com as strings de consulta:

``` js
const url = request.originalUrl()
```

### método
Retorna o método de solicitação HTTP:

``` js
const method = request.method()
```

### intended
Como o AdonisJs permite a falsificação de métodos, você pode buscar o método real usando o método `intended`:

``` js
const method = request.intended()
```

### ip
Retorna o endereço IP mais confiável para o usuário:
```
const ip = request.ip()
```

### ips
Retorna uma matriz de ips da maioria para a menos confiável (remove o endereço IP padrão, que pode ser acessado 
através do método `ip`):

``` js
const ips = request.ips()
```

### subdomains
Retorna uma lista de subdomínios de solicitação (remove _www_ da lista):

``` js
const subdomains = request.subdomains()
```

### ajax
Verifica o cabeçalho `X-Requested-With` para determinar se a solicitação é ajax ou não:

``` js
if (request.ajax()) {
  // faça alguma coisa
}
```

### pjax
O [Pjax](https://github.com/defunkt/jquery-pjax) é uma maneira evoluída de usar o Ajax para oferecer melhores experiências do usuário para aplicativos 
tradicionais. No mundo do Rails, é conhecido como Turbolinks.

Este método procura o cabeçalho `X-PJAX` para identificar se uma solicitação é pjax ou não:

``` js
if (request.pjax()) {
  // faça alguma coisa
}
```

### hostname
Retorna o nome do host da solicitação:

``` js
const hostname = request.hostname()
```

### protocol
Retorne o protocolo de solicitação:

``` js
const protocol = request.protocol()
```

### match
Retorna se o conjunto de expressões transmitido corresponde ao URL de solicitação atual:
``` js
// Requisição na url atual - posts/1

request.match(['posts/:id']) // retorna true
```

### hasBody
Um booleano indicando se a solicitação possui um corpo de postagem (usado principalmente pelo `BodyParser` para determinar se
deve ou não analisar o corpo):

``` js
if (request.hasBody()) {
  // faça alguma coisa
}
```

### is
O método `is` retorna o melhor tipo de conteúdo correspondente para a solicitação atual.

A verificação é inteiramente baseada no cabeçalho `content-type`:

``` js
// Assumindo que o content-type é `application/json`

request.is(['json', 'html']) // retorna - json

request.is(['application/*']) // retorna - application/json
```

## Método de falsificação
Formulários HTML só são capazes de fazer solicitações `GET` e `POST`, o que significa que você não pode utilizar as convenções 
Rest de outros métodos HTTP como `PUT`, `DELETE` e assim por diante.

O AdonisJs simplifica o desvio do método de solicitação adicionando um parâmetro `_method` à sua string de consulta, executando
automaticamente a rota correta para você, por exemplo, em `start/routes.js`:

``` js
Route.put('users', 'UserController.update')
```

``` html
<form method="POST" action="/users?_method=PUT">
```

O exemplo acima funciona nos seguintes casos:

+ O método de solicitação original é POST.
+ `allowMethodSpoofing` está ativado dentro do arquivo `config/app.js`

## Solicitação de extensão
Também é possível estender o prototype `Request` adicionando seus próprios métodos, conhecidos como macros.

> Como o código a ser estendido, `Request` precisa ser executado apenas uma vez, você pode usar provedores ou ganchos do Ignitor para 
> fazer isso. Leia [Estendendo o núcleo](https://adonisjs.com/docs/4.1/extending-adonisjs) para obter mais informações.

``` js
const Request = use('Adonis/Src/Request')

Request.macro('cartValue', function () {
  return this.cookie('cartValue', 0)
})
```
