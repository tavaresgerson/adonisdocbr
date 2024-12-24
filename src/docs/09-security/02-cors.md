# CORS

Cross-Origin Resource Sharing (CORS) é uma maneira de permitir solicitações HTTP de entrada de diferentes domínios. É muito comum em aplicativos AJAX, onde o navegador bloqueará todas as solicitações entre domínios se o servidor não as autorizar. Leia mais sobre CORS [aqui](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

## Como funciona?
Solicitações AJAX de diferentes domínios precisam ser autorizadas antes de executarem as ações desejadas. Os navegadores primeiro fazem uma solicitação *preflight* com *OPTIONS* como o método HTTP para o servidor, concedendo permissão. O servidor pode permitir a solicitação retornando *200 OK* e especificando os domínios a serem permitidos por meio do cabeçalho *Access-Control-Allow-Origin*.

O AdonisJs vem com um middleware *CORS* para lidar com esse fluxo para você por meio de um arquivo de configuração.

## Configuração
Para que as regras CORS funcionem corretamente, certifique-se de que `Adonis/Middleware/Cors` esteja registrado como um middleware global dentro do arquivo `app/Http/kernel.js`.

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

#### `origin`
A origem aceita vários valores.

1. Para proibir todas as solicitações CORS, defina-a como `false`
2. Para permitir as mesmas solicitações de origem, defina-a como `true`.
3. Você pode definir origens separadas por vírgula(,).
4. Definir o valor como um curinga * permitirá todas as origens.
5. Finalmente, você pode anexar um retorno de chamada e retornar um dos valores acima
    ```js
    origin: function (requestOrigin) {
      return requestOrigin === 'foo'
    }
    ```

#### `methods`
Métodos/verbos HTTP para permitir. Certifique-se de que seja um valor separado por vírgula de um dos vários métodos.

#### `headers`
Como origem, *cabeçalhos* também aceitam vários valores

1. Para desabilitar todos os cabeçalhos, defina como falso.
2. Para permitir todos os cabeçalhos definidos dentro de Access-Control-Request-Headers, defina como verdadeiro.
3. Permita uma sequência de cabeçalhos personalizados separados por vírgula(,). Por exemplo, Content-Type, Accepts.
4. Finalmente, uma função de retorno de chamada.
    ```js
    headers: function (requestedHeaders) {
      // ...
    }
    ```

#### `exhibitHeaders(opcional)`
Cabeçalhos separados por vírgula para expor via cabeçalho *Access-Control-Expose-Headers*.

#### `credentials(opcional)`
Permite ou não a troca de credenciais definindo o cabeçalho *Access-Control-Allow-Credentials* para um valor booleano.

#### `maxAge(opcional)`
Define o cabeçalho *Access-Control-Allow-Max-Age* para um valor definido.
