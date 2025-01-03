# Implantação

A implantação de um aplicativo AdonisJS não é diferente da implantação de qualquer outro aplicativo Node.js. Primeiro, você precisará de um servidor/plataforma que possa instalar e executar a versão mais recente do `Node.js v14`.

::: info NOTA
Para uma experiência de implantação sem atrito, você pode experimentar o Cleavr. É um serviço de provisionamento de servidor e tem suporte de primeira classe para [implantar aplicativos AdonisJS](https://cleavr.io/adonis).

**Aviso: Cleavr também é um patrocinador do AdonisJS.**
:::

## Compilando TypeScript para JavaScript

Os aplicativos AdonisJS são escritos em TypeScript e devem ser compilados para JavaScript durante a implantação. Você pode compilar seu aplicativo diretamente no servidor de produção ou executar a etapa de construção em um pipeline de CI/CD.

Você pode construir seu [código para produção](./typescript-build-process.md#standalone-production-builds) executando o seguinte comando Ace. A saída JavaScript compilada é escrita dentro do diretório `build`.

```sh
node ace build --production
```

Se você executou a etapa de build dentro de um pipeline de CI/CD, então você pode mover apenas a pasta `build` para seu servidor de produção e instalar as dependências de produção diretamente no servidor.

## Iniciando o servidor de produção

Você pode iniciar o servidor de produção executando o arquivo `server.js`.

Se você executou a etapa de build em seu servidor de produção, certifique-se de primeiro `cd` no diretório `build` e então inicie o servidor.

```sh
cd build
npm ci --production

# Iniciar o servidor
node server.js
```

Se a etapa de build foi executada em um pipeline de CI/CD e **você copiou apenas a pasta `build` para seu servidor de produção**, o diretório `build` se torna a raiz do seu aplicativo.

```sh
npm ci --production

# Iniciar o servidor
node server.js
```

### Usando um gerenciador de processos

É recomendado usar um gerenciador de processos ao gerenciar um aplicativo Node.js em um servidor básico.

Um gerenciador de processos garante reiniciar o aplicativo se ele travar durante o tempo de execução. Além disso, alguns gerenciadores de processos como [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) também podem executar reinicializações graciosas ao reimplantar o aplicativo.

A seguir está um exemplo de [arquivo de ecossistema](https://pm2.keymetrics.io/docs/usage/application-declaration/) para PM2.

```ts
module.exports = {
  apps: [
    {
      name: 'web-app',
      script: './build/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
```

## Proxy reverso NGINX
Ao executar o aplicativo AdonisJS em um servidor básico, você deve colocá-lo atrás do NGINX (ou um servidor web similar) por [vários motivos diferentes](https://medium.com/intrinsic/why-should-i-use-a-reverse-proxy-if-node-js-is-production-ready-5a079408b2ca), com a terminação SSL sendo um dos mais importantes.

::: info NOTA
Certifique-se de ler o [guia de proxies confiáveis](../http/request.md#trusted-proxy) para garantir que você possa acessar o endereço IP correto do visitante ao executar o aplicativo AdonisJS atrás de um servidor proxy.
:::

A seguir está um exemplo de configuração NGINX para solicitações de proxy para seu aplicativo AdonisJS. **Certifique-se de substituir os valores dentro dos colchetes angulares `<>`**.

```nginx
server {
  listen 80;

  server_name <APP_DOMAIN.COM>;

  location / {
    proxy_pass http://localhost:<ADONIS_PORT>;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }
}
```

## Migrando banco de dados
Usando o comando `node ace migration:run --force`, você pode migrar seu banco de dados de produção. O sinalizador `--force` é necessário ao executar migrações no ambiente de produção.

### Quando migrar

Além disso, seria melhor se você sempre executasse as migrações antes de reiniciar o servidor. Então, se a migração falhar, não reinicie o servidor.

Usando um serviço gerenciado como Cleavr ou Heroku, eles podem lidar automaticamente com esse caso de uso. Caso contrário, você terá que executar o script de migração dentro de um pipeline de CI/CD ou executá-lo manualmente por meio de SSH.

### Não faça rollback na produção
O método `down` em seus arquivos de migração geralmente contém ações destrutivas como **descartar a tabela** ou **remover uma coluna** e assim por diante. É recomendável desativar rollbacks na produção dentro do arquivo `config/database.ts`.

Desabilitar rollbacks na produção garantirá que o comando `node ace migration:rollback` resulte em um erro.

```ts {5}
{
  pg: {
    client: 'pg',
    migrations: {
      disableRollbacksInProduction: true,
    }
  }
}
```

### Evite tarefas de migração simultâneas
Ao implantar seu aplicativo AdonisJS em vários servidores, certifique-se de executar as migrações de apenas um servidor e não de todos eles.

Para MySQL e PostgreSQL, o Lucid obterá [bloqueios consultivos](https://www.postgresql.org/docs/9.4/explicit-locking.html#ADVISORY-LOCKS) para garantir que a migração simultânea não seja permitida. No entanto, é melhor evitar executar migrações de vários servidores em primeiro lugar.

## Armazenamento persistente para uploads de arquivos
Plataformas de implantação modernas como Amazon ECS, Heroku ou aplicativos DigitalOcean executam o código do seu aplicativo dentro de um [sistema de arquivos efêmero](https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem), o que significa que cada implantação destruirá o sistema de arquivos existente e criará um novo.

Você perderá os arquivos enviados pelo usuário se armazenados no mesmo armazenamento que o código do seu aplicativo. Portanto, você deve considerar usar o [Drive](../digging-deeper/drive.md) para manter os arquivos enviados pelo usuário em um serviço de armazenamento em nuvem como Amazon S3 ou Google Cloud Storage.

## Logging
O [AdonisJS Logger](../digging-deeper/logger.md) grava logs em `stdout` e `stderr` no formato JSON. Você pode configurar um serviço de log externo para ler os logs de stdout/stderr ou encaminhá-los para um arquivo local no mesmo servidor.

Os pacotes do núcleo e do ecossistema do framework gravam logs no nível `trace`. Portanto, você deve definir o nível de log como `trace` ao depurar os internos do framework.

## Depurando consultas de banco de dados
O Lucid ORM emite o evento `db:query` quando a depuração de banco de dados é ativada. Você pode ouvir esse evento e depurar as consultas SQL usando o Logger.

A seguir, um exemplo de impressão bonita das consultas de banco de dados em desenvolvimento e usando o Logger em produção.

```ts
// start/event.ts

import Event from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'

Event.on('db:query', (query) => {
  if (Application.inProduction) {
    Logger.debug(query.sql)
  } else {
    Database.prettyPrint(query)
  }
})
```

## Variáveis ​​de ambiente
Você deve manter suas variáveis ​​de ambiente de produção seguras e não mantê-las junto com o código do seu aplicativo. Se você estiver usando uma plataforma de implantação como Cleavr, Heroku e assim por diante, você deve gerenciar variáveis ​​de ambiente a partir do painel da web deles.

Ao implantar seu código em um servidor básico, você pode manter suas variáveis ​​de ambiente dentro do arquivo `.env`. O arquivo também pode ficar fora da base de código do aplicativo. Certifique-se de informar o AdonisJS sobre sua localização usando a variável de ambiente `ENV_PATH`.

```sh
cd build

ENV_PATH=/etc/myapp/.env node server.js
```

## Cache de visualizações
Você deve armazenar em cache os modelos do Edge em produção usando a variável de ambiente `CACHE_VIEWS`. Os modelos são armazenados em cache na memória em tempo de execução e nenhuma pré-compilação é necessária.

```dotenv
CACHE_VIEWS=true
```

## Servindo ativos estáticos
Servir ativos estáticos de forma eficaz é essencial para o desempenho do seu aplicativo. Independentemente da rapidez dos seus aplicativos AdonisJS, a entrega de ativos estáticos desempenha um papel importante para uma melhor experiência do usuário.

### Usando um serviço CDN
A melhor abordagem é usar um CDN para entregar os ativos estáticos do seu aplicativo AdonisJS.

Os ativos front-end compilados usando [Webpack Encore](../http/assets-manager.md) são marcados com impressão digital, e isso permite que seu servidor CDN os armazene em cache agressivamente.

Dependendo do serviço CDN que você está usando e da sua técnica de implantação, pode ser necessário adicionar uma etapa ao seu processo de implantação para mover os arquivos estáticos para o servidor CDN. É assim que deve funcionar em poucas palavras.

- Atualize `webpack.config.js` para usar a URL do CDN ao criar a compilação de produção.
```js
  if (Encore.isProduction()) {
    Encore.setPublicPath('https://your-cdn-server-url/assets')
    Encore.setManifestKeyPrefix('assets/')
  } else {
    Encore.setPublicPath('/assets')
  }
  ```
- Crie seu aplicativo AdonisJS normalmente.
[aqui está um comando](https://github.com/adonisjs-community/polls-app/blob/main/commands/PublishAssets.ts) que usamos para publicar os ativos em um bucket do Amazon S3.

### Usando o NGINX para entregar arquivos estáticos
Outra opção é descarregar a tarefa de servir ativos para o NGINX. Se você usar o Webpack Encore para compilar os ativos do front-end, você deve armazenar em cache agressivamente todos os arquivos estáticos, pois eles são marcados com impressão digital.

Adicione o seguinte bloco ao seu arquivo de configuração do NGINX. **Certifique-se de substituir os valores dentro dos colchetes angulares `<>`**.

```nginx
location ~ \.(jpg|png|css|js|gif|ico|woff|woff2) {
  root <PATH_TO_ADONISJS_APP_PUBLIC_DIRECTORY>;
  sendfile on;
  sendfile_max_chunk 2m;
  add_header Cache-Control "public";
  expires 365d;
}
```

### Usando o servidor de arquivo estático AdonisJS
Você também pode contar com o servidor de arquivo estático integrado do AdonisJS para servir os ativos estáticos do diretório `public` para manter as coisas simples.

Nenhuma configuração adicional é necessária. Basta implantar seu aplicativo AdonisJS como de costume, e a solicitação de ativos estáticos será atendida automaticamente. No entanto, se você usar o Webpack Encore para compilar seus ativos front-end, você deve atualizar o arquivo `config/static.ts` com as seguintes opções.

```ts
// config/static.ts

{
  // ... resto da configuração
  maxAge: '365d',
  immutable: true,
}
```
