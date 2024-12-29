# CORS

Cross-Origin Resource Sharing (CORS) é uma maneira de permitir solicitações HTTP de entrada de diferentes domínios.

É muito comum em aplicativos AJAX, onde o navegador bloqueia todas as solicitações entre domínios se o servidor não as autorizar.

Leia mais sobre CORS [aqui](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

## Configuração
Instale o provedor de middleware via npm executando o seguinte comando:

```bash
adonis install @adonisjs/cors
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/cors/providers/CorsProvider'
]
```

Finalmente, registre o middleware dentro do arquivo `start/kernel.js`:

```js
// .start/kernel.js

Server
  .use(['Adonis/Middleware/Cors'])
```

## Configuração
A configuração para CORS é definida dentro do arquivo `config/cors.js` e aceita as seguintes opções.

#### `origin`
A(s) origem(ões) a serem permitidas para fazer solicitações entre domínios.

Você pode retornar um dos seguintes valores:

- Um booleano `true` ou `false` para negar a origem da solicitação atual.
- Uma sequência de caracteres separada por vírgulas de domínios a serem permitidos.
- Uma matriz de domínios a serem permitidos.
- Uma função, que recebe a origem da solicitação atual. Aqui você pode calcular se a origem é permitida ou não retornando true ou false:
  ```js
  //.config/cors.js

  origin: function (currentOrigin) {
    return currentOrigin === 'mywebsite.com'
  }
  ```

Para todas as outras opções, inspecione os comentários dentro do [arquivo de configuração](https://github.com/adonisjs/adonis-cors/blob/develop/config/cors.js#L3).
