# Ciclo de vida da requisição

## Introdução
A plataforma Node.js é assíncrona. Para iniciantes, pode ser difícil entender como funciona e como lidar com a abordagem 
sem bloqueio do fluxo de aplicativos.

Também pode ser confuso diferenciar o JavaScript que você escreve para o front-end do JavaScript que você escreve para o seu 
back-end. Eles são os mesmos em termos de sintaxe, mas não são executados no mesmo tempo de execução e contexto.

Ter uma excelente visão geral de alto nível do ciclo de vida da solicitação é imprescindível. Você sentirá o AdonisJs menos 
“mágico” e você ficará mais confiante em construir seus aplicativos.

## Fluxo de requisição
As solicitações HTTP enviadas de um cliente são tratadas pelo módulo Server do AdonisJs, executando todo o middleware no nível 
do servidor (por exemplo, o `StaticFileMiddleware` que serve arquivos estáticos do diretório público).

Se a solicitação não for finalizada pelo middleware no nível do servidor, o `AdonisJs Route` entra em cena. Ele tenta encontrar 
uma rota que corresponda ao URL solicitado. Se o roteador não puder encontrar uma correspondência, uma exceção `RouteNotFound` 
será lançada.

Depois de encontrar uma rota correspondente, todos os middlewares globais são executados, seguidos por qualquer middleware 
nomeado definido para a rota especificada. Se nenhum middleware global ou nomeado encerrar a solicitação, o manipulador de 
rota definido será chamado.

Você deve encerrar a solicitação no seu manipulador de rota. Uma vez terminado, o AdonisJs executa todo o middleware downstream 
e envia a resposta de volta ao cliente.

## Contexto HTTP
O AdonisJs fornece um objeto de contexto HTTP para cada manipulador de rota.

Esse objeto contém tudo o que você precisa para manipular a solicitação, como a classe de solicitação ou resposta, e pode ser 
facilmente estendido via Provedores ou Middleware:

``` js
Route.get('/', ({ request, response, view }) => {
  // request
  // response
  // view
})
```

Como alternativa, você pode usá-lo diretamente em vez de descompactá-lo:

``` js
Route.get('/', (ctx) => {
  // ctx.request
  // ctx.response
  // ctx.view
  // etc
})
```
