# CORS

O compartilhamento de recursos de origem cruzada (CORS) é uma maneira de permitir 
solicitações HTTP recebidas de diferentes domínios.

É muito comum em aplicativos AJAX, nos quais o navegador bloqueia todas as solicitações entre 
domínios, se o servidor não as autorizar.

Leia mais sobre o CORS [aqui](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

## Configuração
Instale o provedor de middleware via npm executando o seguinte comando:

```
> adonis install @adonisjs/cors
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

``` js
const providers = [
  '@adonisjs/cors/providers/CorsProvider'
]
```

Por fim, registre o middleware dentro do arquivo `start/kernel.js`:

``` js
Server
  .use(['Adonis/Middleware/Cors'])
Config
```

A configuração do CORS é definida dentro do arquivo `config/cors.js` e aceita as seguintes opções.

### origin
As origens a serem permitidas para fazer solicitações entre domínios.

Você pode retornar um dos seguintes valores:

+ Um booleano `true` ou `false` para negar a origem da solicitação atual.
+ Uma sequência de domínios separada por vírgula a ser permitida.
+ Uma matriz de domínios a ser permitida.
+ Uma função que recebe a origem da solicitação atual. Aqui você pode calcular se a origem é ou não permitida retornando verdadeiro ou falso:


``` js
// em config/cors.js
origin: function (currentOrigin) {
  return currentOrigin === 'mywebsite.com'
}
```

Para todas as outras opções, verifique os comentários dentro do [arquivo de configuração](https://github.com/adonisjs/adonis-cors/blob/develop/config/cors.js#L3).
