# Dockerizing Adonis

Neste guia, você aprenderá a usar o Docker com o Adonis. Você poderá usar essa lógica para desenvolver, depurar e implantar aplicativos Adonis usando o docker.
Além disso, abordaremos como criar o arquivo docker-compose.yml que também configurará os serviços Redis e PostgreSQL.

Você pode utilizar o mesmo arquivo docker-compose.yml para iniciar e desenvolver/implantar seu próximo projeto Adonis em questão de minutos!

::: info NOTA
Este guia pressupõe que você tenha conhecimento básico do Docker e saiba como construir ou iniciar imagens Docker.
:::

## Criando Dockerfile

Usaremos [Docker multistage build](https://docs.docker.com/develop/develop-images/multistage-build/) porque é uma prática recomendada manter sua imagem Docker pequena e capaz de armazenar em cache as etapas de construção melhor.

Então, vamos começar com o primeiro estágio...

### Primeiro estágio - Base

O primeiro estágio será nossa camada _base_ que mais tarde será usada para outras etapas.

```Dockerfile
ARG NODE_IMAGE=node:16.13.1-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp
```

Estamos definindo `ARG NODE_IMAGE` porque mais tarde, com esse jeito, você pode simplesmente mudar sua versão do Node.js ao construir novas imagens do Dockerfile.
Além disso, estamos instalando [dumb-init](https://github.com/Yelp/dumb-init) porque o Docker cria processos como PID 1, e eles devem inerentemente manipular sinais de processo para funcionar corretamente.
Dumb-init é um sistema init leve que irá gerar corretamente o processo de tempo de execução do Node.js com suporte a sinais.

Além disso, estamos mudando o usuário para `node` porque o Docker executa o processo no contêiner como usuário root, o que não é recomendado.

::: info NOTA
Se você quiser saber mais sobre as melhores práticas do Docker para Node.js, recomendo fortemente esta [folha de dicas do Synk](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
:::

### Segundo estágio - dependências

Nosso segundo estágio será usado para instalar todas as dependências, para que possamos construir nosso aplicativo em estágios posteriores.

```Dockerfile
FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .
```

Observe que estamos usando apenas `COPY` para copiar os arquivos package.json e package-lock.json neste estágio.

Dessa forma, o Docker poderá armazenar em cache completamente este estágio se package.json ou package-lock.json não tiverem alterações.

Esta é uma ótima prática, especialmente se você usar algum tipo de CI/CD em seu ambiente de desenvolvimento, porque reduzirá drasticamente os tempos de implantação de CI/CD. Muitas vezes mudamos o código, mas nossas dependências permanecem as mesmas.

### Terceiro estágio - build

Temos tudo para começar nossa fase de build! Este estágio muito simples e autoexplicativo.

```dockerfile
FROM dependencies AS build
RUN node ace build --production
```

### Quarta etapa - produção

Finalmente, podemos criar nossa última etapa.

```dockerfile
FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE $PORT
CMD [ "dumb-init", "node", "server.js" ]
```

Estamos criando este estágio a partir do estágio base para manter nossa imagem o menor possível.

Aqui, instalaremos apenas as dependências `--production` e, em seguida, copiaremos nossos ativos de construção `--from=build` estágio que executamos antes.

Este estágio é criado como ambiente de produção de propósito. Você verá o porquê mais tarde, quando explicamos como usar o mesmo Dockerfile para desenvolvimento.

Finalmente, iniciaremos o processo `node server.js`, mas por meio do sistema de inicialização `dumb-init` para gerar adequadamente o processo de tempo de execução do Node.js com suporte a sinais.

### Todos os estágios combinados

Agora podemos combinar todos os estágios explicados acima e salvar nosso arquivo na raiz do nosso projeto Adonis.

```dockerfile
// Dockerfile

ARG NODE_IMAGE=node:16.13.1-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --production

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE $PORT
CMD [ "dumb-init", "node", "server.js" ]
```

## Criando .dockerignore

Para manter nossa imagem Docker pequena, é sempre uma boa prática criar o arquivo .dockerignore.

```gitignore
// .dockerignore

# Adonis default .gitignore ignores
node_modules
build
coverage
.vscode
.DS_STORE
.env
tmp

# Additional .gitignore ignores (any custom file you wish)
.idea

# Additional good to have ignores for dockerignore
Dockerfile*
docker-compose*
.dockerignore
*.md
.git
.gitignore
```

Agora estamos prontos para construir e/ou implantar nossa imagem Docker!

## Criando docker-compose.yml

::: info NOTA
Esta etapa não é necessária se você só quer criar um aplicativo Adonis dockerizado.
:::

`docker-compose.yml` é um arquivo de configuração poderoso.
Neste guia, mostrarei como você pode utilizar a imagem que acabamos de criar para iniciar o ambiente de desenvolvimento enquanto trabalha localmente.

Você não precisará instalar nenhum serviço que seu aplicativo usa, como postgreSQL ou redis, tudo será executado dentro do ambiente Docker.

::: tip DICA
`docker-compose.yml` também pode ser usado como uma ótima maneira de iniciar seu aplicativo com todos os serviços necessários na produção também!
:::

```yaml
// title: docker-compose.yml
version: '3.8'

services:
  adonis_app:
    container_name: adonis_app
    restart: always
    build:
      context: .
      target: dependencies
    ports:
      - ${PORT}:${PORT}
      - 9229:9229
    env_file:
      - .env
    volumes:
      - ./:/home/node/app
      # Descomente a linha abaixo se você estiver desenvolvendo no MacOS
      #- /home/node/app/node_modules
    command: dumb-init node ace serve --watch --node-args="--inspect=0.0.0.0"
```

Se você só precisa do docker-compose.yml para brincar com seu aplicativo Adonis localmente, isso será o suficiente.
Observe que estamos expondo as portas `${PORT}` e `9229`. Isso ocorre porque usaremos esse .yml para poder depurar nosso processo Node.js (9229 é a porta de depuração padrão do Node.js).

::: info NOTA
Se você estiver usando o encore, precisará certificar-se de que o host e a porta do encore estejam definidos corretamente e que você esteja expondo a porta do encore. Uma maneira fácil de fazer isso é simplesmente alterando as portas e o comando.

ports:
- `${PORT}:${PORT}`
- 9229:9229
- 8080:8080

`command: dumb-init node ace serve --watch --encore-args="--host ${HOST} --port 8080"`
:::

Além disso, observe mais uma coisa importante: `target: dependencies`. É aqui que as compilações multiestágio do Docker brilham. Estamos usando o mesmo Dockerfile para nosso ambiente de desenvolvimento e podemos usar o mesmo arquivo para produção.
Dessa forma, o Docker compilará tudo até (e incluindo) o segundo estágio. Isso é ótimo porque não precisamos dos estágios de compilação e produção ao desenvolver nosso aplicativo!

Finalmente, você pode ver que estamos definindo o comando em docker-compose.yml na última linha.
Isso ocorre porque compilaremos nossa imagem até o estágio `dependencies`. Além disso, estamos executando o Adonis no modo `--watch` com o inspetor Node.js, então poderemos anexar a esse processo e depurá-lo por meio do Docker!

## Adicionando PostgreSQL e Redis ao nosso docker-compose.yml

O aplicativo sem banco de dados e/ou algum mecanismo de cache/armazenamento de sessão não é um aplicativo real :)
Vamos ver como nosso docker-compose.yml pode ser alterado para ativar os serviços necessários para criar um aplicativo do mundo real.

```yaml
// title: docker-compose.yml
version: '3.8'

services:
  postgres:
    container_name: postgres
    image: postgres:13
    volumes:
      - postgres_volume:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - 5432:5432

  redis:
    container_name: redis
    image: redis:6-alpine
    volumes:
      - redis_volume:/data
    ports:
      - 6379:6379

  adonis_app:
    container_name: adonis_app
    restart: always
    depends_on:
      - postgres
      - redis
    build:
      context: .
      target: dependencies
    ports:
      - ${PORT}:${PORT}
      - 9229:9229
    env_file:
      - .env
    environment:
      - PG_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - ./:/home/node/app
    command: dumb-init node ace serve --watch --node-args="--inspect=0.0.0.0"

volumes:
  postgres_volume:
  redis_volume:
```

Adicionamos `potgres` e `redis` e tornamos seus dados persistentes usando [volumes Docker](https://docs.docker.com/storage/volumes/).
Além disso, os tornamos dependências do nosso serviço `adonis_app`.

Um bom truque neste docker-compose.yml é a maneira como estendemos nosso arquivo `.env` usando `environment` para adicionar `PG_HOST` e `REDIS_HOST` dentro dele.
O aplicativo Adonis se conectará diretamente a esses serviços!

::: info NOTA
Presumimos que você instalou `@adonisjs/redis` e `@adonisjs/lucid` com pg.

Você pode adaptar livremente este docker-compose.yml ao seu gosto... Remova o redis se não estiver usando, etc.
:::

E é isso! Simplesmente executando `docker compose up`, temos todo o ambiente de desenvolvimento pronto!

## Dicas e truques

### Configurar automaticamente o banco de dados padrão para nosso aplicativo dentro do serviço postgres

Adicionamos o serviço `postgres`. Mas, precisaríamos criar um banco de dados dentro deste serviço Docker para iniciar nossas migrações de aplicativos Adonis.
Como somos desenvolvedores preguiçosos, podemos fazer esse processo chato acontecer automaticamente para nós :)

Vamos criar a pasta dockerConfig dentro do nosso diretório raiz para colocar os arquivos que docker-compose.yml usará e criará:

```sql
-- dockerConfig/postgres-dev-init.sql

CREATE USER adonis with encrypted password 'adonis';
CREATE DATABASE adonis_app;
GRANT ALL PRIVILEGES ON DATABASE adonis_app TO adonis;
```

Este script sql criará o usuário `adonis` com todos os privilégios no banco de dados `adonis_app` com a senha `adonis` para nós.
Agora, vamos fazer este script rodar automaticamente apenas na primeira inicialização do serviço postgres.

Vamos editar nosso docker-compose.yml e adicionar este arquivo a `/docker-entrypoint-initdb.d/init.sql`. Este caminho será executado pelo postgres no init.

```yaml
// title:
services:
  postgres:
    container_name: postgres
    image: postgres:13
    volumes:
      - postgres_volume:/var/lib/postgresql/data
      - ./dockerConfig/postgres-dev-init.sql:/docker-entrypoint-initdb.d/init.sql # irá configurar o banco de dados de desenvolvimento adonis_app para nós
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - 5432:5432
```

É isso! Ao usar isso, você nem precisa se conectar ao serviço postgres Dockerizado para configurar seu banco de dados inicial.

::: info NOTA
Não se esqueça de atualizar seu arquivo `.env` do aplicativo adonis para utilizar este banco de dados.

```
PG_USER=adonis
PG_PASSWORD=adonis
PG_DB_NAME=adonis_app
```
:::

### Simplifique o Docker se anexar ao serviço redis/postgres/adonis_app

Às vezes você quer fazer ações avançadas no redis/postgres por meio do shell (por exemplo, verificar todas as chaves dentro do seu redis-cli).
Para simplificar o processo de anexar aos nossos serviços docker-compose.yml, podemos adicionar scripts `package.json` como atalhos para isso.

Vamos modificar um pouco nossos scripts `package.json`:

```json
// title: package.json
"scripts": {
  "dockerAttach": "docker exec -it adonis_app /bin/sh",
  "dockerAttachRedis": "docker exec -it redis /bin/sh",
  "dockerAttachPostgres": "docker exec -it postgres /bin/sh",
}
```

Agora, simplesmente digitando `npm run dockerAttachRedis` seremos conectados ao serviço `redis` dentro do nosso ambiente Docker.
Podemos simplesmente digitar `redis-cli` agora e brincar com a instância redis que conteinerizamos.
