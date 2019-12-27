# CSRF

A [falsificação de solicitação entre sites (CSRF)](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)) permite que um invasor execute ações em nome de 
outro usuário sem seu conhecimento ou permissão.

O AdonisJs protege seu aplicativo contra ataques CSRF, negando solicitações não identificadas. As 
solicitações HTTP com os métodos POST, PUT e DELETE são verificadas para garantir que as pessoas 
certas do local certo invoquem essas solicitações.

Configuração
Instale o provedor `sheild` via npm executando o seguinte comando:

```
> adonis install @adonisjs/shield
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

``` js
const providers = [
  '@adonisjs/shield/providers/ShieldProvider'
]
```

Por fim, registre o middleware global dentro do arquivo `start/kernel.js`:

``` js
const globalMiddleware = [
  'Adonis/Middleware/Shield'
]
```

> O middleware Shield depende de [sessões](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/basics/sessions.md), portanto, verifique se elas estão configuradas corretamente.

## Config
A configuração do CSRF é salva dentro do arquivo `config/shield.js`:

```
csrf: {
  enable: true,
  methods: ['POST', 'PUT', 'DELETE'],
  filterUris: ['/user/:id'],
  cookieOptions: {}
}
```

| Chave         | Valor     | Descrição                                                                                                                                   |
|---------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| enable        | boleano   | Um booleano para ativar/desativar o CSRF para todo o aplicativo.                                                                          |
| methods       | Matriz    | Verbos HTTP a serem protegidos pelo CSRF. Considere adicionar todos os verbos que permitam ao usuário final adicionar ou modificar dados.   |
| filterUris    | Matriz    | Uma lista de URLs/rotas a serem ignoradas. Você pode passar definições de rota reais ou uma expressão regular para corresponder.          |
| cookieOptions | Objeto    | Um objeto de [opções de cookies](https://www.npmjs.com/package/cookie#options-1).                                                           |

## Como funciona

+ AdonisJs cria um segredo CSRF para cada usuário que visita seu site.
+ Um token correspondente para o segredo é gerado para cada solicitação e passado para todas as visualizações como `csrfToken`e `csrfField()` globais.
+ Além disso, o mesmo token é definido como um cookie com chave XSRF-TOKEN. Frameworks de front-end como o AngularJs leem automaticamente esse cookie e o enviam junto com cada solicitação do Ajax.
+ Sempre que uma solicitação POST, PUT ou DELETE é recebida, o middleware verifica o token com o segredo para garantir que ele seja válido.

> Se você estiver usando o valor `XSRF-TOKEN` do cookie, verifique se a chave do cabeçalho está em X-XSRF-TOKEN.

## View Helpers
Você pode acessar o token CSRF usando um dos seguintes assistentes de exibição para garantir que ele seja definido em seus formulários.

Para enviar o token junto com cada solicitação, você precisa de acesso a ele. Existem algumas maneiras de obter acesso ao token CSRF.

### csrfField
```
{{ csrfField() }}
```

Resultado
``` html
<input type="hidden" name="_csrf" value="xxxxxx">
```

### csrfToken
O helper `csrfToken` retorna o valor bruto do token:
```
{{ csrfToken }}
```

## Manipulação de exceção
Na falha de validação, uma exceção é lançada com o código EBADCSRFTOKEN.

Certifique-se de ouvir esta exceção e retornar uma resposta apropriada, da seguinte maneira:
``` js
// Em app/Exceptions/Handler.js
class ExceptionHandler {
  async handle (error, { response }) {
    if (error.code === 'EBADCSRFTOKEN') {
      response.forbidden('Cannot process your request.')
      return
    }
  }
}
```
