---
summary: Faça um tour pelos arquivos e pastas importantes criados pelo AdonisJS durante o processo de instalação.
---

# Estrutura de pastas

Neste guia, faremos um tour pelos arquivos e pastas importantes criados pelo AdonisJS durante o processo de instalação.

Nós enviamos com uma estrutura de pasta padrão bem pensada que ajuda você a manter seus projetos organizados e fáceis de refatorar. No entanto, você tem toda a liberdade para divergir e ter uma estrutura de pastas que funciona muito bem para sua equipe e projeto.

## O arquivo `adonisrc.ts`

O arquivo `adonisrc.ts` é usado para configurar o espaço de trabalho e algumas das configurações de tempo de execução do seu aplicativo.

Neste arquivo, você pode registrar provedores, definir aliases de comando ou especificar os arquivos a serem copiados para a compilação de produção.

Veja também: [Guia de referência do arquivo AdonisRC](../concepts/adonisrc_file.md)

## O arquivo `tsconfig.json`

O arquivo `tsconfig.json` armazena a configuração TypeScript para seu aplicativo. Sinta-se à vontade para fazer alterações neste arquivo de acordo com os requisitos do seu projeto ou equipe.

As seguintes opções de configuração são necessárias para que os internos do AdonisJS funcionem corretamente.

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "isolatedModules": true,
    "declaration": false,
    "outDir": "./build",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true
  }
}
```

## As importações de subcaminho

O AdonisJS usa o recurso [importações de subcaminho](https://nodejs.org/dist/latest-v19.x/docs/api/packages.html#subpath-imports) do Node.js para definir os aliases de importação.

Os seguintes aliases de importação são pré-configurados no arquivo `package.json`. Sinta-se à vontade para adicionar novos aliases ou editar os existentes.

```json
// package.json

{
  "imports": {
    "#controllers/*": "./app/controllers/*.js",
    "#exceptions/*": "./app/exceptions/*.js",
    "#models/*": "./app/models/*.js",
    "#mails/*": "./app/mails/*.js",
    "#services/*": "./app/services/*.js",
    "#listeners/*": "./app/listeners/*.js",
    "#events/*": "./app/events/*.js",
    "#middleware/*": "./app/middleware/*.js",
    "#validators/*": "./app/validators/*.js",
    "#providers/*": "./app/providers/*.js",
    "#policies/*": "./app/policies/*.js",
    "#abilities/*": "./app/abilities/*.js",
    "#database/*": "./database/*.js",
    "#tests/*": "./tests/*.js",
    "#start/*": "./start/*.js",
    "#config/*": "./config/*.js"
  }
}
```

## O diretório `bin`

O diretório `bin` tem os arquivos de ponto de entrada para carregar seu aplicativo em um ambiente específico. Por exemplo:

- O arquivo `bin/server.ts` inicializa o aplicativo no ambiente da web para ouvir solicitações HTTP.
- O arquivo `bin/console.ts` inicializa a linha de comando Ace e executa comandos.
- O arquivo `bin/test.ts` inicializa o aplicativo para executar testes.

## O arquivo `ace.js`

O arquivo `ace` inicializa a estrutura de linha de comando que é local para seu aplicativo. Então, toda vez que você executa um comando ace, ele passa por este arquivo.

Se você notar, o arquivo ace termina com uma extensão `.js`. Isso ocorre porque queremos executar este arquivo usando o binário `node` sem compilá-lo.

## O diretório `app`

O diretório `app` organiza o código para a lógica de domínio do seu aplicativo. Por exemplo, os controladores, modelos, serviços, etc., todos vivem dentro do diretório `app`.

Sinta-se à vontade para criar diretórios adicionais para organizar melhor o código do seu aplicativo.

```
├── app
│  └── controllers
│  └── exceptions
│  └── middleware
│  └── models
│  └── validators
```

## O diretório `resources`

O diretório `resources` contém os modelos do Edge, juntamente com os arquivos de origem do seu código frontend. Em outras palavras, o código para a camada de apresentação do seu aplicativo vive dentro do diretório `resources`.

```
├── resources
│  └── views
│  └── js
│  └── css
│  └── fonts
│  └── images
```

## O diretório `start`

O diretório `start` contém os arquivos que você deseja importar durante o ciclo de vida de inicialização do aplicativo. Por exemplo, os arquivos para registrar rotas e definir ouvintes de eventos devem viver dentro do diretório `start`.

```
├── start
│  ├── env.ts
│  ├── kernel.ts
│  ├── routes.ts
│  ├── validator.ts
│  ├── events.ts
```

O AdonisJS não importa automaticamente arquivos do diretório `start`. Ele é usado apenas como uma convenção para agrupar arquivos semelhantes.

Recomendamos ler sobre [arquivos de pré-carregamento](../concepts/adonisrc_file.md#preloads) e o [ciclo de vida de inicialização do aplicativo](../concepts/application_lifecycle.md) para entender melhor quais arquivos manter no diretório `start`.

## O diretório `public`

O diretório `public` hospeda ativos estáticos como arquivos CSS, imagens, fontes ou o JavaScript do frontend.

Não confunda o diretório `public` com o diretório `resources`. O diretório resources contém o código-fonte do seu aplicativo frontend, e o diretório public tem a saída compilada.

Ao usar o Vite, você deve armazenar os ativos do frontend dentro dos diretórios `resources/<SUB_DIR>` e deixar o compilador Vite criar a saída no diretório `public`.

Por outro lado, se você não estiver usando o Vite, você pode criar arquivos diretamente dentro do diretório `public` e acessá-los usando o nome do arquivo. Por exemplo, você pode acessar o arquivo `./public/style.css` da URL `http://localhost:3333/style.css`.

## O diretório `database`

O diretório `database` contém arquivos para migrações de banco de dados e seeders.

```
├── database
│  └── migrations
│  └── seeders
```

## O diretório `commands`

Os [comandos ace](../ace/introduction.md) são armazenados dentro do diretório `commands`. Você pode criar comandos dentro desta pasta executando `node ace make:command`.

## O diretório `config`

O diretório `config` contém os arquivos de configuração de tempo de execução para seu aplicativo.

O núcleo do framework e outros pacotes instalados leem arquivos de configuração deste diretório. Você também pode armazenar a configuração local para seu aplicativo dentro deste diretório.

Saiba mais sobre [gerenciamento de configuração](./configuration.md).

```
├── config
│  ├── app.ts
│  ├── bodyparser.ts
│  ├── cors.ts
│  ├── database.ts
│  ├── drive.ts
│  ├── hash.ts
│  ├── logger.ts
│  ├── session.ts
│  ├── static.ts
```

## O diretório `types`

O diretório `types` é o lar das interfaces ou tipos TypeScript usados ​​em seu aplicativo.

O diretório está vazio por padrão, no entanto, você pode criar arquivos e pastas dentro do diretório `types` para definir tipos e interfaces personalizados.

```
├── types
│  ├── events.ts
│  ├── container.ts
```

## O diretório `providers`

O diretório `providers` é usado para armazenar os [provedores de serviço](../concepts/service_providers.md) usados ​​por seu aplicativo. Você pode criar novos provedores usando o comando `node ace make:provider`.

Saiba mais sobre [provedores de serviço](../concepts/service_providers.md)

```
├── providers
│  └── app_provider.ts
│  └── http_server_provider.ts
```

## O diretório `tmp`

Os arquivos temporários gerados por seu aplicativo são armazenados dentro do diretório `tmp`. Por exemplo, estes podem ser arquivos enviados pelo usuário (gerados durante o desenvolvimento) ou logs gravados no disco.

O diretório `tmp` deve ser ignorado pelas regras `.gitignore`, e você também não deve copiá-lo para o servidor de produção.

## O diretório `tests`

O diretório `tests` organiza seus testes de aplicativo. Além disso, subdiretórios são criados para testes `unitários` e `funcionais`.

Veja também: [Testes](../testing/introduction.md)

```
├── tests
│  ├── bootstrap.ts
│  └── functional
│  └── regression
│  └── unit
```
