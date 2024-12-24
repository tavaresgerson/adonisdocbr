# Ciclo de vida do aplicativo

O guia é voltado para dar a você uma compreensão profunda do fluxo do aplicativo AdonisJs. O fluxo é dividido em três categorias amplas de *Servidor HTTP*, *Comando Ace* e *Solicitação HTTP*.

## Servidor HTTP
O servidor HTTP envolve conectar as partes do aplicativo e inicializar o servidor HTTP. Este é um trabalho único, pois o servidor HTTP é um processo de longa execução.

O primeiro passo é carregar todos os provedores e configurar seus aliases. Vamos falar sobre todas as etapas envolvidas:

1. Os provedores e seus aliases são definidos dentro do arquivo `bootstrap/app.js`.
2. O arquivo `bootstrap/http.js` fará uso do array `providers` e os registrará com o contêiner IoC.
3. Em seguida, registramos o diretório de carregamento automático definido dentro do arquivo `package.json`. Você pode alterar o diretório ou o namespace de carregamento automático que está definido como `App`.
```json
    {
      "autoload": {
        "App": "./app"
      }
    }
    ```
4. O processo de inicialização carregará os seguintes arquivos na sequência definida.
   * bootstrap/events.js
   * app/Http/kernel.js
   * app/Http/routes.js
   * database/factory.js
5. Finalmente, ele iniciará o servidor HTTP escutando no host e na porta definidos dentro do arquivo `.env` e emitirá o evento `Http.start`, que você pode escutar para conectar suas implementações personalizadas.

## Comando Ace
O processo de conexão do comando ace é semelhante ao [Http Server](#servidor-http), mas seguindo as diferenças.

1. Todos os provedores definidos dentro do arquivo `bootstrap/app.js` serão carregados. O que significa que `aceProviders` e `providers` serão concatenados e enviados ao contêiner IoC.
2. Todos os arrays `commands` serão registrados com [Ace](/markdown/07-common-web-tools/01-interactive-shell.md).
3. Desta vez, o evento `Ace.start` é emitido em vez de `Http.start`.

## Solicitação HTTP
A solicitação HTTP é um fluxo dinâmico de processamento de uma ou mais solicitações HTTP em um determinado momento.

1. A URL da solicitação de entrada é verificada em relação a um arquivo estático dentro do diretório `public` e, se encontrado, o arquivo estático será servido.
2. Em seguida, uma rota correspondente será pesquisada em relação à URL da solicitação e as seguintes etapas serão executadas.
   * Executar todos os middlewares globais
   * Executar todos os middlewares específicos da rota
   * Executar a ação da rota que pode ser um *Método do controlador* ou um *Closure*.
3. Se acima de 2 forem falsos, uma `HttpException` 404 será lançada.
