# Publicação

A implantação de um aplicativo AdonisJS não é diferente de implantar um aplicativo Node.js padrão. Você precisa de um servidor/plataforma que
possa instalar e executar o Node.js >= 14.15.4.

> Para uma experiência de implantação sem atrito, você pode tentar o Cleavr. É um serviço de provisionamento de servidor e tem suporte de primeira classe 
> para a implantação de [aplicativos AdonisJS](https://cleavr.io/adonis).
>
> Aviso Legal - Cleavr também é patrocinador do AdonisJS

### Compilando TypeScript para JavaScript
Os aplicativos AdonisJS são escritos em TypeScript e devem ser compilados em JavaScript durante a implantação. Você pode compilar seu aplicativo 
diretamente no servidor de produção ou executar a etapa de compilação em um pipeline de CI/CD.

Você pode construir seu [código para produção](https://docs.adonisjs.com/guides/typescript-build-process#standalone-production-builds) executando o seguinte 
comando ace abaixo. A saída JavaScript compilada é gravada no diretório `build`.

```bash
node ace build --production
```

Se você executou a etapa de compilação dentro de um pipeline de CI/CD, pode mover apenas a pasta `build` para o servidor de produção e instalar 
as dependências de produção diretamente no servidor.

#### Iniciando o servidor de produção
Você pode iniciar o servidor de produção executando o arquivo `server.js`.

Se você executou a etapa de construção em seu servidor de produção, certifique-se de primeiro está no diretório de construção usando `cd` e, em seguida, 
inicie o servidor.

```bash
cd build
npm ci --production

# Inicia o servidor
node server.js
```

Se a etapa de compilação foi realizada em um pipeline de CI/CD e você copiou apenas a pasta `build` para o servidor de produção, o
`build` torna-se a raiz do seu aplicativo.

```bash
npm ci --production

# Iniciar servidor
node server.js
```

#### Usando um gerenciador de processo
Recomenda-se usar um gerenciador de processo ao gerenciar um aplicativo Node.js em um servidor.

Um gerenciador de processo garante a reinicialização do aplicativo se ele travar durante o tempo de execução. Alguns gerenciadores de processo, 
como o [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/), também podem realizar reinicializações perfeitas ao reimplantar o aplicativo.

A seguir está um exemplo de arquivo de [ecossistema para pm2](https://pm2.keymetrics.io/docs/usage/application-declaration/).

```js
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

#### Proxy reverso Nginx
Ao executar o aplicativo AdonisJS em um servidor básico, você deve colocá-lo atrás do Nginx (ou um servidor da web semelhante) [por muitos motivos diferentes](https://medium.com/intrinsic/why-should-i-use-a-reverse-proxy-if-node-js-is-production-ready-5a079408b2ca),
mas a terminação SSL é um importante.

> Certifique-se de ler o guia de [proxies confiáveis](https://docs.adonisjs.com/guides/request#trusted-proxy) para garantir que você pode acessar o endereço IP correto do visitante, 
> ao executar o aplicativo AdonisJS atrás de um servidor proxy.

A seguir está um exemplo de configuração Nginx para solicitações de proxy para seu aplicativo AdonisJS. Certifique-se de substituir os valores dentro dos colchetes angulares<> .

```
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
 
### Migrando banco de dados
Você pode migrar seu banco de dados de produção usando o comando `node ace migration:run --force`. O sinalizador `--force` é necessário ao 
executar migrações no ambiente de produção.

#### Quando migrar
Além disso, você deve sempre executar as migrações antes de reiniciar o servidor. Se a migração falhar, não reinicie o servidor.

Se você estiver usando um serviço gerenciado como Cleavr ou Heroku, eles podem lidar automaticamente com esse caso de uso. Caso contrário, 
você terá que executar o script de migração dentro de um pipeline de CI/CD ou executá-lo manualmente por SSHing para o servidor.

#### Não retroceda na produção
O método `down` em seus arquivos de migração geralmente contém ações destrutivas, como descartar a tabela ou remover uma coluna e assim por 
diante. Recomenda-se desligar as reversões na produção dentro do arquivo `config/database.ts`.

Desativar reversões na produção garantirá que a execução do comando `node ace migration:rollback` resulte em erro.

```ts
{
  pg: {
    client: 'pg',
    migrations: {
      disableRollbacksInProduction: true,
    }
  }
}
```

#### Evite tarefas de migração simultâneas
Ao implementar seu aplicativo AdonisJS em vários servidores, certifique-se de executar as migrações de apenas um servidor e não de todos eles.

Para MySQL e PostgreSQL, Lucid obterá [bloqueios de consulta](https://www.postgresql.org/docs/9.4/explicit-locking.html#ADVISORY-LOCKS) para garantir que a migração simultânea não seja permitida. No entanto, é melhor evitar 
a execução de migrações de vários servidores em primeiro lugar.

#### Armazenamento persistente para uploads de arquivos
As plataformas de implantação modernas, como AWS ECS, Heroku ou aplicativos no Digital Ocean, executam o código do seu aplicativo dentro do sistema de arquivos 
efêmero, o que significa que cada implantação destruirá o sistema de arquivos existente e criará um novo.

Você perderá os arquivos carregados pelo usuário se eles estiverem armazenados no mesmo local que o código do seu aplicativo. Portanto, é melhor usar armazenamento 
em nuvem de terceiros para guardar arquivos carregados pelo usuário.

No momento, estamos trabalhando em um módulo que permite que você use o sistema de arquivos local durante o desenvolvimento e, em seguida, mude para um 
sistema de arquivos externo como o S3 para produção. Faça tudo isso sem alterar uma única linha de código.

#### Logging
O AdonisJS logger grava logs `stdout` e `stderr` em formato JSON. Você pode configurar um serviço de registro externo para ler os registros de stdout/stderr 
ou encaminhá-los para um arquivo local no mesmo servidor.

O núcleo da estrutura e os pacotes do ecossistema gravam logs no nível `trace`. Você deve definir o nível de registro para `trace` quando quiser depurar os 
componentes internos da estrutura.

#### Depurar consultas de banco de dados
O Lucid ORM emite o evento `db:query` quando a depuração do banco de dados é ativada. Você pode ouvir o evento e depurar as consultas SQL usando o Logger.

A seguir está um exemplo de impressão bonita das consultas de banco de dados no desenvolvimento e usando o Logger na produção.

```ts
// start/event.ts

import Event from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'

Event.on('db:query', (query) => {
  if (Application.inProduction) {
    Logger.debug(query)
  } else {
    Database.prettyPrint(query)
  }
})
```

#### Variáveis de Ambiente
Você deve manter suas variáveis de ambiente de produção seguras e não as manter ao lado de seu código de aplicativo. Se você estiver usando uma 
plataforma de implantação como Cleavr, Heroku e assim por diante, deve gerenciar as variáveis de ambiente de seu painel da web.

Ao implantar seu código em um servidor básico, você pode manter suas variáveis de ambiente dentro do arquivo `.env`. O arquivo também pode residir fora 
da base de código do aplicativo. Certifique-se de informar o AdonisJS sobre sua localização usando a variável de ambiente `ENV_PATH`.

```bash
cd build

ENV_PATH=/etc/myapp/.env node server.js
```

#### Cache de visualizações
Você deve armazenar em cache os modelos de borda em produção usando a variável de ambiente `CACHE_VIEWS`. Os modelos são armazenados em cache na memória em 
tempo de execução e nenhuma pré-compilação é necessária.

```
CACHE_VIEWS=true
```
