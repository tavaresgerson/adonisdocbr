# Middleware

HTTP Middleware é uma camada de métodos executados antes das suas ações de Rotas. Eles têm mais de um caso de uso. Por exemplo:

O middleware *body parser* é responsável por analisar o corpo da solicitação. Enquanto o middleware *Auth* é usado para autenticar as solicitações e lançar *401 Exception* se o usuário não for autenticado.

Middleware pode:

1. Decorar o objeto de solicitação e adicionar valores a ele.
2. Responder a uma determinada solicitação, sem atingir sua ação de rota.
3. Ou negar solicitações lançando erros.

## Middleware Global
O middleware global é definido dentro do arquivo `app/Http/kernel.js` como uma matriz e é executado em cada solicitação na sequência em que são registrados.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/Cors',
  'Adonis/Src/BodyParser',
  // ...
]
```

## Middleware Nomeado
O middleware nomeado, por outro lado, é registrado com um nome exclusivo e você precisa atribuí-lo manualmente nas rotas. Por exemplo: O middleware `auth` é usado para proteger rotas de usuários *não autenticados*.

```js
// app/Http/kernel.js

const namedMiddleware = {
  // ...
  auth: 'Adonis/Middleware/Auth'
  // ...
}
```

```js
// Usage

Route
  .get('accounts/:id', 'AccountsController.show')
  .middleware('auth')

// or

Route.group('auth-routes', () => {
  Route.get('accounts/:id', 'AccountsController.show')
}).middleware('auth')
```

## Criando um middleware
O middleware do aplicativo fica dentro do diretório `app/Http/Middleware`. Cada middleware é uma única *Classe ES2015* dedicada com um método `handle` obrigatório.

Vamos usar ace para criar um middleware.

```bash
./ace make:middleware CountryDetector

# create: app/Http/Middleware/CountryDetector.js
```

```js
// app/Http/Middleware/CountryDetector.js

'use strict'

class CountryDetector {

  * handle (request, response, next) {
    yield next
  }

}
```

1. O método `handle` é um gerador ES2015.
2. Semelhante aos seus métodos de controlador, ele também recebe instâncias link:request[request] e link:response[response] com um parâmetro adicional `next`.
3. Certifique-se de chamar `yield next` quando quiser que seu middleware passe a solicitação para o próximo middleware ou ação de rota.
4. Além disso, você pode encerrar a solicitação com a ajuda da instância `response`.

Agora vamos construir nosso middleware *CountryDetector* para detectar o país do visitante com base em seu endereço IP.

```js
// app/Http/Middleware/CountryDetector.js

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

Em seguida, precisamos registrar isso como um middleware *global ou nomeado* com base na natureza do aplicativo. Vamos registrá-lo como um middleware global por enquanto.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'App/Http/Middleware/CountryDetector'
  // ...
]
```

Parabéns! Agora todas as solicitações Http terão a propriedade `country`, pois estamos decorando a instância `request`.
