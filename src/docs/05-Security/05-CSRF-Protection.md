---
title: CSRF Protection
category: security
---

# Proteção CSRF

[Cross-Site Request Forgery (CSRF)](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)) permite que um invasor execute ações em nome de outro usuário sem seu conhecimento ou permissão.

O AdonisJs protege seu aplicativo de ataques CSRF negando solicitações não identificadas. As solicitações HTTP com métodos *POST, PUT e DELETE* são verificadas para garantir que as pessoas certas do lugar certo invoquem essas solicitações.

## Configuração
Instale o provedor `shield` via npm executando o seguinte comando:

```bash
adonis install @adonisjs/shield
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/shield/providers/ShieldProvider'
]
```

Finalmente, registre o middleware global dentro do arquivo `start/kernel.js`:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/Shield'
]
```

::: warning NOTA
O middleware Shield depende de [sessões](/docs/04-Basics/07-Sessions.md), então certifique-se de que elas estejam configuradas corretamente.
:::

## Configuração
A configuração para CSRF é salva dentro do arquivo `config/shield.js`:

```js
// .config/shield.js

csrf: {
  enable: true,
  methods: ['POST', 'PUT', 'DELETE'],
  filterUris: ['/user/:id'],
  cookieOptions: {}
}
```

| Chave         | Valor     | Descrição                                                                                                     |
|---------------|-----------|---------------------------------------------------------------------------------------------------------------|
| enable        | Boolean   | Um booleano para ativar/desativar o CSRF para todo o aplicativo.                                                     |
| methods       | Array     | Verbos HTTP a serem protegidos por CSRF. Considere adicionar todos os verbos que permitem que o usuário final adicione ou modifique dados. |
| filterUris    | Array     | Uma lista de URLs/Rotas para ignorar. Você pode passar definições de rotas reais ou uma expressão regular para corresponder.      |
| cookieOptions | Object    | Um objeto de [opções de cookies](https://www.npmjs.com/package/cookie#options-1).                                |

## Como funciona

1. O AdonisJs cria um *CSRF secret* para cada usuário que visita seu site.
2. Um token correspondente para o segredo é gerado para cada solicitação e passado para todas as visualizações como globais `csrfToken` e `csrfField()`.
3. Além disso, o mesmo token é definido como um cookie com a chave `XSRF-TOKEN`. Frameworks de front-end como *AngularJs* leem automaticamente esse cookie e o enviam junto com cada solicitação Ajax.
4. Sempre que uma solicitação *POST*, *PUT* ou *DELETE* chega, o middleware verifica o token com o segredo para garantir que ele seja válido.

::: warning OBSERVAÇÃO
Se você estiver usando o valor de cookie `XSRF-TOKEN`, certifique-se de que a chave do cabeçalho seja `X-XSRF-TOKEN`.
:::

## Auxiliares de visualização
Você pode acessar o token CSRF usando um dos seguintes auxiliares de visualização para garantir que ele seja definido dentro de seus formulários.

Para enviar o token junto com cada solicitação, você precisa acessá-lo. Existem algumas maneiras de obter acesso ao token CSRF.

#### `csrfField`

```edge
{{ csrfField() }}
```

```html
<!-- .Output -->

<input type="hidden" name="_csrf" value="xxxxxx">
```

#### `csrfToken`
O auxiliar `csrfToken` retorna o valor bruto do token:

```edge
{{ csrfToken }}
```

## Tratamento de exceção
Em caso de falha de validação, uma exceção é lançada com o código *EBADCSRFTOKEN*.

Certifique-se de ouvir essa exceção e retornar uma resposta apropriada, como esta:

```js
// .app/Exceptions/Handler.js

class ExceptionHandler {
  async handle (error, { response }) {
    if (error.code === 'EBADCSRFTOKEN') {
      response.forbidden('Cannot process your request.')
      return
    }
  }
}
```
