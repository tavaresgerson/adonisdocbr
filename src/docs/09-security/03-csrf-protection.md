# Proteção CSRF

O Cross-Site Request Forgery (CSRF) permite que um invasor execute ações em nome de outro usuário sem o conhecimento ou permissão deste último.

O AdonisJs protege seu aplicativo de ataques CSRF negando solicitações não identificadas. Solicitações HTTP com métodos *POST*, *PUT* e *DELETE* são verificadas para garantir que essas solicitações sejam invocadas pelas pessoas certas do lugar certo. Você pode aprender mais sobre o CSRF [aqui](https://www.owasp.org/index.php/Cross-Site_Request_Forgery)

## Como funciona?

1. O AdonisJs criará uma *sessão CSRF* para cada usuário que visitar seu site.
Em seguida, um *token CSRF* é gerado para a sessão previamente criada. Por motivos de segurança, o token será regerado sempre que a página for atualizada.
+
O token gerado pode ser acessado dentro das views como 'csrfToken' ou 'csrfField', para que você possa passar esse token ao enviar formulários HTML.
1. Além disso, o mesmo token é definido em um cookie com a chave 'XSRF-TOKEN'. Os frameworks front-end como *AngularJS* leem automaticamente este cookie e o enviam junto com cada solicitação Ajax.
2. Finalmente, quando uma solicitação *POST*, *PUT* ou *DELETE* chega, o middleware verificará o token com o segredo para garantir que ele seja válido. Ele tentará acessar o token das seguintes fontes.
* `csrf` no corpo da requisição.
* Também tentará acessar os cabeçalhos *csrf-token*, *x-csrf-token* ou *x-xsrf-token*.


## Configuração
A configuração para CSRF é salva dentro do arquivo `config/shield.js`.

```js
csrf: {
  enable: true,
  methods: ['POST', 'PUT', 'DELETE'],
  filterUris: ['/user/:id']
}
```

| Chave | Valor | Descrição |
| ativar | Boolean | Um booleano para ativar/desativar o CSRF para todo o aplicativo. |
| métodos | Array | Verbos HTTP a serem protegidos por CSRF. Considere adicionar todos os verbos que permitem ao usuário final adicionar ou modificar dados. |
| filterUris | Array | Uma lista de URLs/Rotas para ignorar. Você pode passar a definição real das rotas ou uma expressão regular para combinar. |

## Acessando o token CSRF
Para enviar o token junto com cada requisição, você precisa acessá-lo. Existem algumas maneiras de obter acesso ao token CSRF.

#### csrfField

```twig
{{ csrfField }}
```

Saída:

```html
<input type="hidden" name="_csrf" value="xxxxxx">
```

#### csrfToken
```twig
{{ csrfToken }}
```

Você também pode acessar o token dentro de seus controladores e ações da rota como a seguir.

```js
request.csrfToken()
```

## Tratando erros CSRF
Em caso de falha na validação, é lançada uma exceção chamada *EBADCSRFTOKEN*, que pode ser tratada no arquivo `app/Listeners/Http.js`.

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
