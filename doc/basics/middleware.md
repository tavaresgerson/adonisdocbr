# Middlewares

O middleware se conecta ao ciclo de vida da solicitação do seu aplicativo.

Eles são um conjunto de funções executadas em sequência e permitem transformar a solicitação e / ou a resposta.

Como exemplo, o AdonisJs fornece um middleware de autenticação que verifica se o usuário do seu aplicativo está autenticado. 
Se o usuário não estiver autenticado, uma exceção será lançada e a solicitação nunca chegará ao manipulador de rotas.

## Criando um middleware

Para criar um novo middleware, use o comando `make:middleware`:

```
adonis make:middleware CountryDetector
```
Este comando criará um arquivo na pasta `app/Middleware` com algum código padrão.

Em nosso exemplo de middleware `CountryDetector`, queremos detectar o país do usuário a partir do endereço IP:

``` js
'use strict'

const geoip = require('geoip-lite')

class CountryDetector {
  async handle ({ request }, next) {
    const ip = request.ip()
    request.country = geoip.lookup(ip).country
    await next()
  }
}

module.exports = CountryDetector
```

Neste exemplo, estamos usando a biblioteca `geoip-lite` e adicionando o país do usuário ao objeto de solicitação do [contexto HTTP](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/concept/request-lifecycle.md#contexto-http).


## Upstream & Downstream Middleware
Ao criar seu middleware, você precisará decidir se ele será executado antes ou depois da solicitação atingir o manipulador de rota.

Isso é feito definindo o código antes ou depois da chamada next () do método de manipulação do middleware:

``` js 
'use strict'

class UpstreamExample {
  async handle ({ request }, next) {
    // Código...
    await next()
  }
}

module.exports = UpstreamExample
```

Para acessar o objeto de `response` para o downstream do middleware, é necessário descompactá-lo do [contexto HTTP](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/concept/request-lifecycle.md#contexto-http) passado:

``` js 
'use strict'

class DownstreamExample {
  async handle ({ response }, next) {
    await next()
    // Code...
  }
}

module.exports = DownstreamExample
```
Se desejar, seu código de middleware também pode ser executado antes e depois da solicitação atingir o manipulador de rota:

``` js
'use strict'

class BeforeAndAfterExample {
  async handle ({ response }, next) {
    // Código upstream...
    await next()
    // Código downstream...
  }
}

module.exports = BeforeAndAfterExample
```
## Registrando Middleware
Todo o middleware é registrado dentro do arquivo `start/kernel.js`.

O middleware é separado em 3 categorias: Servidor, Global e Nomeado.

### Middleware do servidor
O middleware do servidor é executado antes que a solicitação chegue ao sistema de roteamento AdonisJs. Isso significa que, se a rota 
solicitada não estiver registrada, o AdonisJs ainda executará todo o middleware definido aqui:

``` js
const serverMiddleware = [
  'Adonis/Middleware/Static',
  'Adonis/Middleware/Cors',
]
```

O middleware do servidor geralmente é usado para servir ativos estáticos ou manipular o CORS.

### Middleware Global
O middleware global é executado depois que a rota solicitada foi encontrada:

``` js
const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
]
```
O middleware global é executado na sequência em que foram definidos, portanto, você deve ter cuidado quando um middleware exigir 
outro.

### Middleware nomeado
O middleware nomeado é atribuído a uma rota ou grupo de rotas específico:

``` js
const namedMiddleware = {
   auth: 'Adonis / Middleware / Auth',
}
```

``` js
Route.get(url, closure).middleware(['auth'])
```
O middleware nomeado é executado na sequência em que foram definidos em relação à rota atribuída.

## Propriedades de Middleware
AdonisJs usa a [expressão de pipe](https://www.npmjs.com/package/haye#pipe-expression) para definir propriedades do middleware.

Por exemplo, o middleware `auth` opcionalmente aceita um esquema de autenticação como uma propriedade do middleware:

``` js
// Use o esquema de Sessão para esta rota
Route.post(url, closure).middleware(['auth:session'])

// Use o esquema JWT para esta rota
Route.post(url, closure).middleware(['auth:jwt'])
```

Você também pode transmitir vários adereços encadeando-os com uma vírgula:

``` js
Route.post(url, closure).middleware(['auth:session,jwt'])
```

Essas propriedades estão disponíveis como o terceiro argumento no método de manipulação do middleware:

``` js
async handle (context, next, properties) {
  //
}
```
