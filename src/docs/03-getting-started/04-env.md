# Variáveis de Ambiente

Todos nós escrevemos aplicações em um ambiente de desenvolvimento e as implantamos no ambiente de produção em nossos servidores. Agora não são apenas os termos ou sistemas operacionais que mudam entre o ambiente de desenvolvimento e o ambiente de produção, mas também muitos outros
As coisas mudam. Por exemplo:

1. No ambiente de desenvolvimento, você usará seu e-mail pessoal para enviar e-mails, enquanto na produção você pode usar o e-mail da empresa. O mesmo vale para chaves de API de serviços de terceiros.
2. Durante o desenvolvimento, você pode não querer armazenar em cache as visualizações, enquanto que na produção a visualização do cache é necessária para desempenho.

Existem algumas maneiras de lidar com a complexidade da mudança do ambiente.

### Não recomendado

1. Adicione cláusulas 'se/senão' dentro do seu aplicativo e verifique o ambiente atual antes de tomar a ação.
2. Crie múltiplas cópias do arquivo de configuração para cada ambiente.

### Solução
Para superar esse problema, o AdonisJs utiliza variáveis de ambiente, que são muito comuns em scripts bash e agora também são usadas por frameworks modernos em diferentes comunidades.

## O (arquivo).env
Existem arquivos .env dentro da raiz de cada novo projeto do AdonisJS. O propósito desse arquivo é manter todas as variáveis ​​de configuração, que são supostas mudarem entre ambientes. A seguir está o arquivo .env padrão.

```
HOST=localhost
PORT=3333
APP_KEY=n96M1TPG821EdN4mMIjnGKxGytx9W2UJ
NODE_ENV=development
CACHE_VIEWS=false
SESSION_DRIVER=cookie
```

Este arquivo é carregado automaticamente na hora de inicializar o servidor HTTP ou executar comandos do Ace. Você pode ler os valores deste arquivo com a ajuda do provedor Env ou acessá-los usando o objeto global process.env do Node.js.

## Leitura/Gravação de Valores
Os valores deste arquivo são acessíveis através de `process.env` ou usando o provedor Env embutido. Recomenda-se usar o provedor *Env*, pois pode lidar com algumas inconsistências para você.

#### get(valor, [valorPadrão])
O método 'get' retornará o valor de uma variável de ambiente. Também aceita um parâmetro opcional 'defaultValue', que será retornado quando o valor real for indefinido ou nulo.

```js
const Env = use('Env')
Env.get('NODE_ENV', 'development')
```

#### set(chave, valor)
O método 'set' atualizará o valor existente com o novo valor. Também criará a chave/valor se não existir.

```js
const Env = use('Env')
Env.set('NODE_ENV', 'production')
```

::: info NOTA
Atualizar variáveis de ambiente após uma parte específica do aplicativo ter lido-as não tem efeito. É recomendado substituir as variáveis de ambiente via linha de comando ao iniciar o servidor HTTP. Por exemplo: 'PORT=8000 npm start'.
:::

## Localização do Arquivo
AdonisJs irá carregar automaticamente o arquivo `.env` da raiz do seu projeto. Você pode sobrescrever a localização do arquivo definindo um caminho diferente ao iniciar o servidor.

```bash
ENV_PATH=/etc/config/.env npm start
```

Às vezes você pode definir variáveis ​​de ambiente usando o painel do seu provedor de hospedagem. Neste caso, não faz sentido ter um arquivo .env e para ignorar o erro do provedor de ambiente, você deve iniciar o servidor com ENV_SILENT.

```bash
ENV_SILENT=true npm start
```
