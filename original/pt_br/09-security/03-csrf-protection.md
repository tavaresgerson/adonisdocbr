# Proteção CSRF

A falsificação de solicitação entre sites (CSRF) permite que um invasor execute ações em nome de outro usuário sem seu conhecimento ou permissão.

O AdonisJs protege seu aplicativo de ataques CSRF negando solicitações não identificadas. As solicitações HTTP com métodos *POST*, *PUT* e *DELETE* são verificadas para garantir que essas solicitações sejam invocadas pelas pessoas certas no lugar certo. Você pode aprender mais sobre CSRF [aqui](https://www.owasp.org/index.php/Cross-Site_Request_Forgery)

## Como funciona?

1. O AdonisJs criará uma *sessão CSRF* para cada usuário que visitar seu site.
2. Em seguida, um *token CSRF* será gerado para a sessão criada anteriormente. Por motivos de segurança, o token será gerado novamente a cada atualização de página.
* O token gerado pode ser acessado dentro de visualizações como `csrfToken` ou `csrfField`, para que você possa passar esse token ao enviar formulários HTML.
3. Além disso, o mesmo token é definido como um cookie com a chave `XSRF-TOKEN`. Frameworks de front-end como *AngularJs* leem automaticamente esse cookie e o enviam junto com cada solicitação Ajax.
4. Finalmente, quando uma solicitação *POST*, *PUT* ou *DELETE* chega, o middleware verifica o token com o segredo para garantir que seja válido. Ele tentará acessar o token das seguintes fontes.
* Campo `_csrf` no corpo da solicitação.
* Também tentará acessar os cabeçalhos *csrf-token*, *x-csrf-token* ou *x-xsrf-token*.

## Config
A configuração para CSRF é salva dentro do arquivo `config/shield.js`.

```js
csrf: {
  enable: true,
  methods: ['POST', 'PUT', 'DELETE'],
  filterUris: ['/user/:id']
}
```

| Chave       | Valor   | Descrição   |
|-------------|---------|-------------|
| enable      | Boolean | Um booleano para ligar/desligar CSRF para todo o aplicativo. |
| methods     | Array   | Verbos HTTP a serem protegidos por CSRF. Considere adicionar todos os verbos que permitem que o usuário final adicione ou modifique dados. |
| filterUris  | Array   | Uma lista de URLs/Rotas a serem ignoradas. Você pode passar a definição de rotas reais ou uma expressão regular para corresponder. |

## Acessando o token CSRF
Para enviar o token junto com cada solicitação, você precisa acessá-lo. Existem algumas maneiras de obter acesso ao token CSRF.

#### csrfField
```twig
{{ csrfField }}
```

```html
<!-- Output -->
<input type="hidden" name="_csrf" value="xxxxxx">
```

#### csrfToken
```twig
{{ csrfToken }}
```

Você também pode acessar o token dentro de seus controladores e rotear ações da seguinte forma.

```js
request.csrfToken()
```

## Lidando com erros CSRF
Em caso de falha de validação, uma exceção nomeada como *EBADCSRFTOKEN* é lançada, e a mesma pode ser tratada dentro do arquivo `app/Listeners/Http.js`.

```js
// app/Listeners/Http.js
Http.handleError = function * (error, request, response) {
  if (error.code === 'EBADCSRFTOKEN') {
    response.forbidden('You cannot access this resource.')
    return
  }

  // ...
}
```
