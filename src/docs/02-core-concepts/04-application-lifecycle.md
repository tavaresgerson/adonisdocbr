# Ciclo de Vida da Aplicação

O guia é direcionado para dar a você uma compreensão profunda do fluxo de aplicativos AdonisJS. O fluxo é dividido em três categorias amplas de *Servidor HTTP*, *Comando Ace* e *Solicitação HTTP*.

## Servidor HTTP

O servidor HTTP envolve a conexão das peças do aplicativo e o arranque do servidor HTTP. Isso é um trabalho único, já que o servidor HTTP é um processo de longa execução.

A primeira etapa é carregar todos os provedores e configurar seus aliases. Vamos falar sobre todas as etapas envolvidas:

1. Provedores e seus aliases são definidos no arquivo `bootstrap/app.js`.
2. O arquivo `bootstrap/http.js` fará uso do array `providers` e registrará-os no contêiner IoC.
Em seguida, registramos o diretório de carregamento automático definido dentro do arquivo `package.json`. Você é livre para alterar o diretório ou o namespace de carregamento automático que está definido como `App`.

```json
{
  "autoload": {
    "App": "./app"
  }
}
```

1. O processo de inicialização então carregará os seguintes arquivos na sequência definida.
* bootstrap/events.js
app/Http/kernel.js
app/Http/routes.js
database/factory.js
2. Finalmente, ele iniciará o servidor HTTP escutando na porta e no host definidos dentro do arquivo .env e emite o evento 'Http.start', que você pode ouvir para implementar suas próprias personalizações.


## Ace Comando
O processo de ligação do comando ace é semelhante ao xref:[Http Server] mas com as seguintes diferenças.

1. Todos os Provedores definidos dentro do arquivo `bootstrap/app.js` serão carregados. O que significa que `aceProviders` e `providers` serão concatenados e enviados para o contêiner IoC.
2. Todos os comandos do array serão registrados com o link: shell interativo [Ace].
3. Neste caso o evento 'Ace.start' é emitido em vez de 'Http.start'.

## HTTP Request

A solicitação HTTP é um fluxo dinâmico de processamento de uma ou mais solicitações HTTP em um determinado momento.

1. A URL da solicitação de entrada é verificada contra um arquivo estático dentro do diretório "público" e se encontrado o arquivo estático será servido.
2. Em seguida, uma rota correspondente será pesquisada contra a URL da solicitação e as seguintes etapas serão executadas.
* Executar todos os middlewares globais
* Executar todo o middleware específico de rota
* Executar ação de rota que pode ser um *método do controlador* ou um *fechamento*.
3. Se os dois acima forem falsos, será lançada uma exceção de código 404 HttpException.
