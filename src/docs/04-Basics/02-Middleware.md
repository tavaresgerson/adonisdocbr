# Middleware

O middleware se conecta ao ciclo de vida da solicitação do seu aplicativo.

Eles são um conjunto de funções executadas em sequência e permitem que você transforme a solicitação e/ou a resposta.

Como exemplo, o AdonisJs fornece um middleware `auth` que verifica se o usuário do seu aplicativo está autenticado. Se o usuário não estiver autenticado, uma exceção será lançada e a solicitação nunca chegará ao seu manipulador de rota.

## Criando Middleware

Para criar um novo middleware, use o comando `make:middleware`:

```bash
adonis make:middleware CountryDetector
```

Este comando criará um arquivo na pasta `app/Middleware` com algum código boilerplate.

Em nosso middleware de exemplo `CountryDetector`, queremos detectar o país do usuário a partir do endereço IP:

```js
// .app/Middleware/CountryDetector.js

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

Neste exemplo, estamos usando a biblioteca `geoip-lite` e adicionando o país do usuário dentro do objeto `request` do [HTTP Context](/docs/02-Concept/01-Request-Lifecycle.md).

### Middleware Upstream e Downstream

Ao criar seu middleware, você precisará decidir se ele será executado antes ou depois que a solicitação atingir seu manipulador de rota.

Isso é feito definindo o código antes ou depois da chamada `await next()` do método `handle` do middleware:

```js
// .app/Middleware/UpstreamExample.js

'use strict'

class UpstreamExample {
  async handle ({ request }, next) {
    // Code...
    await next()
  }
}

module.exports = UpstreamExample
```

Para acessar o objeto `response` para o middleware downstream, você precisará descompactá-lo do [HTTP Context](/docs/02-Concept/01-Request-Lifecycle.md) passado:

```js
// .app/Middleware/DownstreamExample.js

'use strict'

class DownstreamExample {
  async handle ({ response }, next) {
    await next()
    // Código...
  }
}

module.exports = DownstreamExample
```

Se quiser, seu código de middleware também pode ser executado antes **e** depois que a solicitação atingir seu manipulador de rota:

```js
// .app/Middleware/BeforeAndAfterExample.js

'use strict'

class BeforeAndAfterExample {
  async handle ({ response }, next) {
    // Código Upstream...
    await next()
    // Código Downstream...
  }
}

module.exports = BeforeAndAfterExample
```

## Registrando Middleware

Todo middleware é registrado dentro do arquivo `start/kernel.js`.

O middleware é separado em 3 categorias: **Servidor**, **Global** e **Nomeado**.

### Middleware do servidor

O middleware do servidor é executado antes que a solicitação chegue ao sistema de roteamento do AdonisJs. Isso significa que se a rota solicitada não estiver registrada, o AdonisJs ainda executará todos os middlewares definidos aqui:

```js
// .start/kernel.js

const serverMiddleware = [
  'Adonis/Middleware/Static',
  'Adonis/Middleware/Cors',
]
```

O middleware do servidor geralmente é usado para servir ativos estáticos ou manipular CORS.

### Middleware global

O middleware global é executado após a rota solicitada ter sido encontrada:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
]
```

O middleware global é executado na sequência em que foi definido, então você deve ter cuidado quando um middleware requer outro.

### Middleware nomeado

O middleware nomeado é atribuído a uma rota ou grupo de rotas específico:

```js
// .start/kernel.js

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
}
```

```js
// .start/routes.js

Route.get(url, closure).middleware(['auth'])
```

O middleware nomeado é executado na sequência em que foi definido em relação à rota atribuída.

## Propriedades do Middleware

AdonisJs usa a [expressão pipe](https://www.npmjs.com/package/haye#pipe-expression) para definir propriedades do middleware.

Por exemplo, o middleware `auth` opcionalmente aceita um esquema de autenticação como uma propriedade do middleware:

```js
// .start/routes.js

// Use o Esquema de Sessão para esta rota
Route.post(url, closure).middleware(['auth:session'])

// Use o esquema JWT para esta rota
Route.post(url, closure).middleware(['auth:jwt'])
```

Você também pode passar várias props encadeando-as com uma vírgula:

```js
// .start/routes.js

Route.post(url, closure).middleware(['auth:session,jwt'])
```

Essas propriedades estão disponíveis como o terceiro argumento no seu método `handle` do middleware:

```js
async handle (context, next, properties) {
  //
}
```
