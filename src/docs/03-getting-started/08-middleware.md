# Middleware

Middleware HTTP é uma camada de métodos executada antes das ações da sua Rota. Eles têm mais do que um caso de uso. Por exemplo:

O middleware *parser de corpo da requisição* é responsável por analisar o corpo da requisição. Já o middleware *Autenticação* é usado para autenticar as requisições e lançar uma exceção *401* caso o usuário não esteja autenticado.

Middleware pode:

1. Decore o objeto de requisição e adicione valores a ele.
2. Responda a um pedido dado, sem chegar à ação de rota.
3. Ou negar requisições ao lançar erros.

## Middleware Global
O middleware global é definido dentro do arquivo `app/Http/kernel.js` como uma matriz e é executado em cada solicitação na sequência em que são registrados.

```js
// .app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/Cors',
  'Adonis/Src/BodyParser',
  // ...
]
```

## Middleware nomeado
Por outro lado, os middlewares são registrados com um nome único e você precisa atribuí-los manualmente nas rotas. Por exemplo: O `auth` middleware é usado para proteger as rotas de *usuários não autenticados*.

```js
// .app/Http/kernel.js

const namedMiddleware = {
  // ...
  auth: 'Adonis/Middleware/Auth'
  // ...
}
```

.Uso

```js
Route
  .get('accounts/:id', 'AccountsController.show')
  .middleware('auth')

// or

Route.group('auth-routes', () => {
  Route.get('accounts/:id', 'AccountsController.show')
}).middleware('auth')
```

## Criando um Middleware
O middleware da aplicação vive dentro do diretório `app/Http/Middleware`. Cada middleware é uma única classe dedicada com um método obrigatório `handle`.

Vamos usar o Ace para criar um middleware.

```bash

./ace make:middleware CountryDetector

# create: app/Http/Middleware/CountryDetector.js
```

```js
// .app/Http/Middleware/CountryDetector.js

'use strict'

class CountryDetector {

  * handle (request, response, next) {
    yield next
  }

}
```

1. O método `handle` é um gerador ES2015.
2. Semelhante aos seus métodos de controlador, também recebe instâncias de link: solicitação [solicitação] e link: resposta [resposta] com um parâmetro adicional chamado próximo.
3. Certifique-se de chamar `yield next` quando quiser que seu middleware passe a requisição para o próximo middleware ou ação da rota.
4. Também você pode acabar o pedido com a ajuda da instância de resposta.

Agora vamos construir sobre nosso *CountryDetector* middleware para detectar o país do visitante com base em seu endereço IP.

```js
.app/Http/Middleware/CountryDetector.js

'use strict'

const geoip = use('geoip-lite') // npm module

class CountryDetector {

  * handle (request, response, next) {
    const ip = request.ip()
    request.country = geoip.lookup(ip).country
    yield next
  }

}
```

Em seguida, precisamos registrar isso como um *middleware global ou nomeado* com base na natureza da aplicação. Vamos registrá-lo como um middleware global por enquanto.

```js
.app/Http/kernel.js

const globalMiddleware = [
  // ...
  'App/Http/Middleware/CountryDetector'
  // ...
]
```

Parabéns! Agora todas as requisições HTTP terão a propriedade `country` desde que estamos decorando a instância `request`.
