---
summary: Aprenda sobre diretrizes gerais para implantar um aplicativo AdonisJS em produção.
---

# Implantação

Implantar um aplicativo AdonisJS não é diferente de implantar um aplicativo Node.js padrão. Você precisa de um servidor executando `Node.js >= 20.6` junto com `npm` para instalar dependências de produção.

Este guia cobrirá as diretrizes genéricas para implantar e executar um aplicativo AdonisJS em produção.

## Criando compilação de produção

Como primeiro passo, você deve criar a compilação de produção do seu aplicativo AdonisJS executando o comando `build`.

Veja também: [Processo de compilação TypeScript](../concepts/typescript_build_process.md)

```sh
node ace build
```

A saída compilada é escrita dentro do diretório `./build`. Se você usar o Vite, sua saída será escrita dentro do diretório `./build/public`.

Depois de criar a compilação de produção, você pode copiar a pasta `./build` para seu servidor de produção. **De agora em diante, a pasta de compilação será a raiz do seu aplicativo**.

### Criando uma imagem Docker

Se você estiver usando o Docker para implantar seu aplicativo, você pode criar uma imagem Docker usando o seguinte `Dockerfile`.

```dockerfile
FROM node:20.12.2-alpine3.18 AS base

# Todos os estágios de deps
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Produção somente estágio de deps
FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Estágio de construção
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build

# Estágio de produção
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]
```

Sinta-se à vontade para modificar o Dockerfile para atender às suas necessidades.

## Configurando um proxy reverso

Aplicativos Node.js são geralmente [implantados atrás de um proxy reverso](https://medium.com/intrinsic-blog/why-should-i-use-a-reverse-proxy-if-node-js-is-production-ready-5a079408b2ca) servidor como o Nginx. Portanto, o tráfego de entrada nas portas `80` e `443` será manipulado pelo Nginx primeiro e depois encaminhado para seu aplicativo Node.js.

A seguir, um exemplo de arquivo de configuração do Nginx que você pode usar como ponto de partida.

::: warning ATENÇÃO
Certifique-se de substituir os valores dentro dos colchetes angulares `<>`.
:::

```nginx
server {
  listen 80;
  listen [::]:80;

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

## Definindo variáveis ​​de ambiente

Se você estiver implantando seu aplicativo em um servidor bare-bone, como um Droplet DigitalOcean ou uma instância EC2, você pode usar um arquivo `.env` para definir as variáveis ​​de ambiente. Certifique-se de que o arquivo esteja armazenado com segurança e que somente usuários autorizados possam acessá-lo.

::: info NOTA
Se você estiver usando uma plataforma de implantação como Heroku ou Cleavr, você pode usar o painel de controle deles para definir as variáveis ​​de ambiente.
:::

Supondo que você tenha criado o arquivo `.env` em um diretório `/etc/secrets`, você deve iniciar seu servidor de produção da seguinte forma.

```sh
ENV_PATH=/etc/secrets node build/bin/server.js
```

A variável de ambiente `ENV_PATH` instrui o AdonisJS a procurar o arquivo `.env` dentro do diretório mencionado.

## Iniciando o servidor de produção

Você pode iniciar o servidor de produção executando o arquivo `node server.js`. No entanto, é recomendável usar um gerenciador de processos como [pm2](https://pm2.keymetrics.io/docs/usage/quick-start).

- O PM2 executará seu aplicativo em segundo plano sem bloquear a sessão de terminal atual.
- Ele reiniciará o aplicativo, se seu aplicativo travar ao atender solicitações. [modo cluster](https://nodejs.org/api/cluster.html#cluster)

A seguir está um exemplo de [arquivo de ecossistema pm2](https://pm2.keymetrics.io/docs/usage/application-declaration) que você pode usar como ponto de partida.

```js
// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'web-app',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
```

```sh
# Iniciar servidor

pm2 start ecosystem.config.js
```

## Migrando banco de dados

Se estiver usando um banco de dados SQL, você deve executar as migrações do banco de dados no servidor de produção para criar as tabelas necessárias.

Se estiver usando o Lucid, você pode executar o seguinte comando.

```sh
node ace migration:run --force
```

O sinalizador `--force` é necessário ao executar migrações no ambiente de produção.

### Quando executar migrações

Além disso, seria melhor se você sempre executasse as migrações antes de reiniciar o servidor. Então, se a migração falhar, não reinicie o servidor.

Usando um serviço gerenciado como Cleavr ou Heroku, eles podem lidar automaticamente com esse caso de uso. Caso contrário, você terá que executar o script de migração dentro de um pipeline de CI/CD ou executá-lo manualmente por meio de SSH.

### Não faça rollback na produção

Reverter migrações na produção é uma operação arriscada. O método `down` em seus arquivos de migração geralmente contém ações destrutivas como **descartar a tabela** ou **remover uma coluna** e assim por diante.

É recomendável desativar os rollbacks na produção dentro do arquivo config/database.ts e, em vez disso, criar uma nova migração para corrigir o problema e executá-la no servidor de produção.

Desabilitar os rollbacks na produção garantirá que o comando `node ace migration:rollback` resulte em um erro.

```js
{
  pg: {
    client: 'pg',
    migrations: {
      disableRollbacksInProduction: true,
    }
  }
}
```

### Migrações simultâneas

Se você estiver executando migrações em um servidor com várias instâncias, você deve garantir que apenas uma instância execute as migrações.

Para MySQL e PostgreSQL, o Lucid obterá bloqueios consultivos para garantir que a migração simultânea não seja permitida. No entanto, é melhor evitar executar migrações de vários servidores em primeiro lugar.

## Armazenamento persistente para uploads de arquivos

Ambientes como Amazon EKS, Google Kubernetes, Heroku, DigitalOcean Apps e assim por diante, executam o código do seu aplicativo dentro de [um sistema de arquivos efêmero](https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem), o que significa que cada implantação, por padrão, destruirá o sistema de arquivos existente e criará um novo.

Se o seu aplicativo permitir que os usuários carreguem arquivos, você deve usar um serviço de armazenamento persistente como Amazon S3, Google Cloud Storage ou DigitalOcean Spaces em vez de depender do sistema de arquivos local.

## Escrevendo logs

O AdonisJS usa o [`pino` logger](../digging_deeper/logger.md) por padrão, que grava logs no console no formato JSON. Você pode configurar um serviço de log externo para ler os logs de stdout/stderr ou encaminhá-los para um arquivo local no mesmo servidor.

## Servindo ativos estáticos

Servir ativos estáticos de forma eficaz é essencial para o desempenho do seu aplicativo. Independentemente da rapidez dos seus aplicativos AdonisJS, a entrega de ativos estáticos desempenha um papel importante para uma melhor experiência do usuário.

### Usando um CDN

A melhor abordagem é usar um CDN (Content Delivery Network) para entregar os ativos estáticos do seu aplicativo AdonisJS.

Os ativos de frontend compilados usando [Vite](../basics/vite.md) são marcados por impressão digital por padrão, o que significa que os nomes dos arquivos são hash com base em seu conteúdo. Isso permite que você armazene os ativos em cache para sempre e os sirva de um CDN.

Dependendo do serviço CDN que você está usando e da sua técnica de implantação, pode ser necessário adicionar uma etapa ao seu processo de implantação para mover os arquivos estáticos para o servidor CDN. É assim que deve funcionar em poucas palavras.

1. Atualize a configuração `vite.config.js` e `config/vite.ts` para [usar a URL do CDN](../basics/vite.md#deploying-assets-to-a-cdn).

2. Execute o comando `build` para compilar o aplicativo e os ativos.

3. Copie a saída de `public/assets` para o seu servidor CDN. Por exemplo, [aqui está um comando](https://github.com/adonisjs-community/polls-app/blob/main/commands/PublishAssets.ts) que usamos para publicar os ativos em um bucket do Amazon S3.

### Usando o Nginx para entregar ativos estáticos

Outra opção é descarregar a tarefa de servir ativos para o Nginx. Se você usar o Vite para compilar os ativos front-end, você deve armazenar em cache agressivamente todos os arquivos estáticos, pois eles são marcados com fingerprint.

Adicione o seguinte bloco ao seu arquivo de configuração do Nginx. **Certifique-se de substituir os valores dentro dos colchetes angulares `<>`**.

```
location ~ \.(jpg|png|css|js|gif|ico|woff|woff2) {
  root <PATH_TO_ADONISJS_APP_PUBLIC_DIRECTORY>;
  sendfile on;
  sendfile_max_chunk 2m;
  add_header Cache-Control "public";
  expires 365d;
}
```

### Usando o servidor de arquivo estático AdonisJS

Você também pode contar com o [servidor de arquivo estático embutido do AdonisJS](../basics/static_file_server.md) para servir os ativos estáticos do diretório `public` para manter as coisas simples.

Nenhuma configuração adicional é necessária. Basta implantar seu aplicativo AdonisJS como de costume, e a solicitação de ativos estáticos será atendida automaticamente.

::: danger ATENÇÃO
O servidor de arquivo estático não é recomendado para uso em produção. É melhor usar um CDN ou Nginx para servir ativos estáticos.
:::
