# CORS

Cross-Origin Resource Sharing (CORS) é uma maneira de permitir solicitações HTTP de diferentes domínios. É muito comum em aplicativos AJAX, onde o navegador bloqueará todas as solicitações entre domínios, a menos que o servidor as autorize. Leia mais sobre CORS [aqui](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

## Como funciona?
As requisições AJAX de diferentes domínios precisam ser autorizadas antes que realizem as ações desejadas. Os navegadores fazem primeiro uma solicitação *preflight* com o método HTTP *OPTIONS* ao servidor para conceder permissão. O servidor pode permitir a solicitação retornando um código 200 OK e especificando os domínios permitidos via cabeçalho *Access-Control-Allow-Origin*.

O AdonisJS envia com um middleware CORS para lidar com esse fluxo para você através de um arquivo de configuração.

## Configuração
Para que as regras do CORS funcionem corretamente, certifique-se de que o `Adonis/Middleware/Cors` esteja registrado como um middleware global dentro do arquivo `app/Http/kernel.js`.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/Cors'
  // ...
]
```

## Configuração
Você pode gerenciar as regras CORS editando o arquivo de configuração `config/cors.js`.

```js
// config/cors.js

module.exports = {
  origin: false,
  methods: 'GET, PUT, POST',
  headers: true,
  exposeHeaders: false,
  credentials: false,
  maxAge: 90
}
```

#### português: origem
Origin aceita múltiplos valores.

1. Para bloquear todos os pedidos CORS, defina-o como falso
2. Para permitir solicitações de mesmo origem, defina-o como verdadeiro.
Você pode definir origens separadas por vírgulas ( , ).
4. Definir o valor para um curinga *, permitirá todas as origens.
5. Finalmente, você pode anexar uma função de retorno e retornar um dos valores acima

```js
origin: function (requestOrigin) {
  return requestOrigin === 'foo'
}
```

#### métodos
Métodos HTTP/verbos para permitir. Certifique-se de que é um valor separado por vírgulas de um dos múltiplos métodos.

#### headers
Como origem, *headers* também aceitam múltiplos valores

1. Para desativar todos os cabeçalhos definidos como falso.
2. Para permitir todos os cabeçalhos definidos dentro de Access-Control-Request-Headers defina-o como verdadeiro.
3. Permita uma string de cabeçalhos personalizados separados por vírgula (,). Por exemplo, Content-Type, Aceita.
4. Finalmente, uma função de retorno de chamada.

```js
headers: function (requestedHeaders) {
  // ...
}
```

#### exposeHeaders(opcional)
Cabeçalhos separados por vírgulas para expor via cabeçalho *Access-Control-Expose-Headers*.

#### credenciais (opcional)
Permita ou não credenciais trocadas por definir o cabeçalho *Access-Control-Allow-Credentials* para um valor booleano.

#### maxAge(opcional)
Sets *Access-Control-Allow-Max-Age* header ao valor definido.
