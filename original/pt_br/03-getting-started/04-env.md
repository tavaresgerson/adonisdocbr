# Variáveis ​​de ambiente

Todos nós escrevemos aplicativos em um ambiente de desenvolvimento e os implantamos no ambiente de produção em nossos servidores. Agora, não são apenas os termos ou sistemas operacionais que são alterados no ambiente de desenvolvimento ou produção, em vez disso, algumas outras
coisas são alteradas. Por exemplo:

1. No ambiente de desenvolvimento, você usará seu e-mail pessoal para enviar e-mails, enquanto na produção você pode usar o e-mail da empresa. O mesmo vale para chaves de API de serviços de terceiros.
2. Durante o desenvolvimento, você pode não querer armazenar em cache as visualizações, enquanto nas visualizações de produção o armazenamento em cache é necessário para o desempenho.

Existem algumas maneiras de lidar com a complexidade da troca de ambiente.

### Não recomendado

1. Adicione cláusulas `if/else` dentro do seu aplicativo e verifique o env atual antes de executar a ação.
2. Crie várias cópias dos arquivos `configuration` para cada ambiente.

### Solução
Para superar esse problema, o AdonisJs faz uso de [Variáveis ​​de ambiente](https://en.wikipedia.org/wiki/Env), que são muito comuns em scripts bash e agora também usadas por frameworks modernos em diferentes comunidades.

## O arquivo (.env)
Há um arquivo `.env` dentro da raiz de cada novo projeto AdonisJs. O objetivo deste arquivo é manter todas as variáveis ​​de configuração, que devem mudar entre os ambientes. A seguir está o arquivo .env padrão.

```
// (.env)

HOST=localhost
PORT=3333
APP_KEY=n96M1TPG821EdN4mMIjnGKxGytx9W2UJ
NODE_ENV=development
CACHE_VIEWS=false
SESSION_DRIVER=cookie
```

Este arquivo é carregado automaticamente no momento da inicialização do servidor HTTP ou da execução de comandos Ace. Você pode ler valores deste arquivo com a ajuda do provedor `Env` ou acessá-los usando o Node.js `process.env` global.

## Leitura/Escrita de Valores
Os valores deste arquivo são acessíveis via `process.env` ou usando o provedor Env integrado. Idealmente, é recomendado usar o *Env provider*, pois ele pode lidar com alguma inconsistência para você.

#### get(value, [defaultValue])
O método `get` retornará o valor de uma variável de ambiente. Ele também aceita um `defaultValue` opcional, que é retornado quando o valor real é `undefined` ou `null`.

```js
const Env = use('Env')
Env.get('NODE_ENV', 'development')
```

#### set(key, value)
O método `set` atualizará o valor existente com o novo valor. Além disso, ele criará o par chave/valor se ele não existir.

```js
const Env = use('Env')
Env.set('NODE_ENV', 'production')
```

> OBSERVAÇÃO: Atualizar variáveis ​​de ambiente após uma determinada parte do aplicativo tê-las lido não tem efeito. É recomendado substituir variáveis ​​env via linha de comando ao iniciar o servidor HTTP. Por exemplo: `PORT=8000 npm start`.

## Localização do arquivo
O AdonisJs carregará automaticamente o arquivo `.env` da raiz do seu projeto. Você pode substituir a localização do arquivo definindo um caminho diferente no momento de iniciar o servidor.

```bash
ENV_PATH=/etc/config/.env npm start
```

Às vezes, você pode definir variáveis ​​env usando o painel do seu provedor de hospedagem. Nesse caso, ter o arquivo `.env` não faz sentido e, para ignorar o erro do provedor Env, você deve iniciar o servidor com `ENV_SILENT`.

```bash
ENV_SILENT=true npm start
```
