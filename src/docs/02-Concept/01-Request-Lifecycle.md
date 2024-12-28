---
title: Request Lifecycle
category: concept
---

# Ciclo de vida da solicitação

## Introdução

A plataforma Node.js é assíncrona. Para iniciantes, pode ser difícil entender como ela funciona e como lidar com sua abordagem não bloqueante para o fluxo do aplicativo.

Também pode ser confuso diferenciar o JavaScript que você escreve para seu front-end do JavaScript que você escreve para seu back-end. Eles são os mesmos em termos de sintaxe, mas não são executados no mesmo tempo de execução e contexto.

Ter uma excelente visão geral de alto nível do ciclo de vida da solicitação é essencial. O AdonisJs parecerá menos "mágico" e você estará mais confiante sobre a construção de seus aplicativos.

## Fluxo de solicitação

As solicitações HTTP enviadas de um cliente são manipuladas pelo módulo `Server` do AdonisJs, executando todo o **middleware de nível de servidor** (por exemplo, o `StaticFileMiddleware` que serve arquivos estáticos do diretório `public`).

Se a solicitação não for encerrada pelo middleware de nível de servidor, o `Router` do AdonisJs entra em ação. Ele tenta encontrar uma rota que corresponda à URL solicitada. Se `Router` não puder encontrar uma correspondência, uma exceção `RouteNotFound` será lançada.

Após encontrar uma rota correspondente, todos os **middlewares globais** são executados seguidos por qualquer **middleware nomeado** definido para a rota correspondente. Se nenhum middleware global ou nomeado encerrar a solicitação, o manipulador de rota correspondente será chamado.

Você deve encerrar a solicitação em seu manipulador de rota. Uma vez encerrado, o AdonisJs executa todos os **middlewares downstream** e envia a resposta de volta ao cliente.

## Contexto HTTP

O AdonisJs fornece um objeto **Contexto HTTP** para cada manipulador de rota.

Este objeto contém tudo o que você precisa para manipular a solicitação, como a classe `request` ou `response`, e pode ser facilmente estendido via link:service-providers[Providers] ou link:middleware[Middleware]:

```js
// .start/routes.js

Route.get('/', ({ request, response, view }) => {
  // request
  // response
  // view
})
```

Alternativamente, você pode usá-lo diretamente em vez de descompactá-lo:

```js
// .start/routes.js

Route.get('/', (ctx) => {
  // ctx.request
  // ctx.response
  // ctx.view
  // etc
})
```
