---
resumo: Aprenda sobre os comandos enviados com o núcleo do framework AdonisJS e pacotes oficiais.
---

# Referência de comandos

Neste guia, abordamos o uso de todos os comandos enviados com o núcleo do framework e os pacotes oficiais. Você também pode visualizar a ajuda dos comandos usando o comando `node ace list` ou o comando `node ace <command-name> --help`.

```sh
node ace list
```

![](../ace/ace_help_screen.jpeg)

::: info NOTA
A saída da tela de ajuda é formatada de acordo com o padrão [docopt](http://docopt.org/).
:::

## `serve`
O `serve` usa o pacote [@adonisjs/assembler](https://github.com/adonisjs/assembler?tab=readme-ov-file#dev-server) para iniciar o aplicativo AdonisJS no ambiente de desenvolvimento. Opcionalmente, você pode observar as alterações de arquivo e reiniciar o servidor HTTP em cada alteração de arquivo.

```sh
node ace serve --hmr
```

O comando `serve` inicia o servidor de desenvolvimento (por meio do arquivo `bin/server.ts`) como um processo filho. Se você quiser passar [argumentos do nó](https://nodejs.org/api/cli.html#options) para o processo filho, você pode defini-los antes do nome do comando.

```sh
node ace --no-warnings --inspect serve --hmr
```

A seguir está a lista de opções disponíveis que você pode passar para o comando `serve`. Como alternativa, use o sinalizador `--help` para visualizar a ajuda do comando.

### `--hmr`

Observe o sistema de arquivos e recarregue o servidor no modo HMR.

### `--watch`

Observe o sistema de arquivos e sempre reinicie o processo na alteração do arquivo.

### `--poll`

Use a pesquisa para detectar alterações no sistema de arquivos. Você pode querer usar polling ao usar um contêiner Docker para desenvolvimento.

### `--clear` | `--no-clear`

Limpe o terminal após cada alteração de arquivo e antes de exibir os novos logs. Use o sinalizador `--no-clear` para reter logs antigos.

### `--assets` | `--no-assets`

Inicie o servidor de desenvolvimento do pacote de ativos junto com o servidor HTTP AdonisJS. Use o sinalizador `--no-assets` para desligar o servidor de desenvolvimento do pacote de ativos.

### `--assets-args`

Passe argumentos de linha de comando para o processo filho do gerenciador de ativos. Por exemplo, se você usar o vite, poderá definir suas opções da seguinte forma.

```sh
node ace serve --hmr --assets-args="--cors --open"
```

## `build`
O comando `build` usa o pacote [@adonisjs/assembler](https://github.com/adonisjs/assembler?tab=readme-ov-file#bundler) para criar a compilação de produção do seu aplicativo AdonisJS. As etapas a seguir são executadas para gerar a compilação.

Veja também: [Processo de compilação TypeScript](../concepts/typescript_build_process.md).

```sh
node ace build
```

A seguir está a lista de opções disponíveis que você pode passar para o comando `build`. Como alternativa, use o sinalizador `--help` para visualizar a ajuda do comando.

### `--ignore-ts-errors`

O comando build encerra o processo de compilação quando seu projeto tem erros TypeScript. No entanto, você pode ignorar esses erros e finalizar a compilação usando o sinalizador `--ignore-ts-errors`.

### `--package-manager`

O comando build copia o arquivo `package.json` junto com o arquivo de bloqueio do gerenciador de pacotes que seu aplicativo está usando.

Detectamos o gerenciador de pacotes usando o pacote [@antfu/install-pkg](https://github.com/antfu/install-pkg). No entanto, você pode desativar a detecção fornecendo explicitamente o nome do gerenciador de pacotes.

### `--assets` | `--no-assets`

Agrupe os ativos de front-end junto com seu aplicativo de back-end. Use o sinalizador `--no-assets` para desativar o servidor de desenvolvimento do bundler de ativos.

### `--assets-args`

Passe argumentos de linha de comando para o processo filho do gerenciador de ativos. Por exemplo, se você usar o vite, poderá definir suas opções da seguinte forma.

```sh
node ace build --assets-args="--sourcemap --debug"
```

## `add`

O comando `add` combina os comandos `npm install <package-name>` e `node ace configure`. Então, em vez de executar dois comandos separados, você pode instalar e configurar o pacote de uma só vez usando o comando `add`.

O comando `add` detectará automaticamente o gerenciador de pacotes usado pelo seu aplicativo e o usará para instalar o pacote. No entanto, você sempre pode optar por um gerenciador de pacotes específico usando o sinalizador CLI `--package-manager`.

```sh
# Instalar e configurar o pacote @adonisjs/lucid
node ace add @adonisjs/lucid

# Instalar o pacote como uma dependência de desenvolvimento e configurá-lo
node ace add my-dev-package --dev
```

Se o pacote puder ser configurado usando sinalizadores, você pode passá-los diretamente para o comando `add`. Cada sinalizador desconhecido será passado para o comando `configure`.

```sh
node ace add @adonisjs/lucid --db=sqlite
```

### `--verbose`

Habilite o modo detalhado para exibir os logs de instalação e configuração do pacote.

### `--force`

Passado para o comando `configure`. Força a substituição de arquivos ao configurar o pacote. Veja o comando `configure` para mais informações.

### `--package-manager`

Defina o gerenciador de pacotes a ser usado para instalar o pacote. O valor deve ser `npm`, `pnpm`, `bun` ou `yarn`.

### `--dev`

Instale o pacote como uma dependência de desenvolvimento.

## `configure`
Configure um pacote após ele ter sido instalado. O comando aceita o nome do pacote como o primeiro argumento.

```sh
node ace configure @adonisjs/lucid
```

### `--verbose`

Habilite o modo detalhado para exibir os logs de instalação do pacote.

### `--force`

O sistema stubs do AdonisJS não sobrescreve arquivos existentes. Por exemplo, se você configurar o pacote `@adonisjs/lucid` e seu aplicativo já tiver um arquivo `config/database.ts`, o processo de configuração não sobrescreverá o arquivo de configuração existente.

No entanto, você pode forçar a sobreposição de arquivos usando o sinalizador `--force`.

## `eject`

Ejeta stubs de um determinado pacote para o diretório `stubs` do seu aplicativo. No exemplo a seguir, copiamos os stubs `make/controller` para nosso aplicativo para modificação.

Veja também: [Personalizando stubs](../concepts/scaffolding.md#ejecting-stubs)

```sh
# Copiar stub do pacote @adonisjs/core
node ace eject make/controller

# Copiar stub do pacote @adonisjs/bouncer
node ace eject make/policy --pkg=@adonisjs/bouncer
```

## `generate:key`
Gere uma chave aleatória criptograficamente segura e grave no arquivo `.env` como a variável de ambiente `APP_KEY`.

Veja também: [Chave do aplicativo](../security/encryption.md)

```sh
node ace generate:key
```

### `--show`

Exiba a chave no terminal em vez de gravá-la no arquivo `.env`. Por padrão, a chave é gravada no arquivo env.

### `--force`

O comando `generate:key` não grava a chave no arquivo `.env` ao executar seu aplicativo em produção. No entanto, você pode usar o sinalizador `--force` para substituir esse comportamento.

## `make:controller`

Cria uma nova classe de controlador HTTP. Os controladores são criados dentro do diretório `app/controllers` e usam as seguintes convenções de nomenclatura.

- Forma: `plural`
- Sufixo: `controller`
- Exemplo de nome de classe: `UsersController`
- Exemplo de nome de arquivo: `users_controller.ts`

```sh
node ace make:controller users
```

Você também gera um controlador com nomes de ação personalizados, conforme mostrado no exemplo a seguir.

```sh
# Gera controlador com métodos "index", "show" e "store"
node ace make:controller users index show store
```

### `--singular`

Força o nome do controlador a estar no formato singular.

### `--resource`

Gera um controlador com métodos para executar operações CRUD em um recurso.

### `--api`

O sinalizador `--api` é semelhante ao sinalizador `--resource`. No entanto, ele não define os métodos `create` e `edit`, pois eles são usados ​​para exibir formulários.

## `make:middleware`
Cria um novo middleware para solicitações HTTP. Middleware é armazenado dentro do diretório `app/middleware` e usa as seguintes convenções de nomenclatura.

- Formulário: `singular`
- Sufixo: `middleware`
- Exemplo de nome de classe: `BodyParserMiddleware`
- Exemplo de nome de arquivo: `body_parser_middleware.ts`

```sh
node ace make:middleware bodyparser
```

### `--stack`

Pule o prompt de seleção [middleware stack](../basics/middleware.md#middleware-stacks) definindo a pilha explicitamente. O valor deve ser `server`, `named` ou `router`.

```sh
node ace make:middleware bodyparser --stack=router
```

## `make:event`
Crie uma nova classe de evento. Os eventos são armazenados dentro do diretório `app/events` e usam as seguintes convenções de nomenclatura.

- Forma: `NA`
- Sufixo: `NA`
- Exemplo de nome de classe: `OrderShipped`
- Exemplo de nome de arquivo: `order_shipped.ts`
- Recomendação: Você deve nomear seus eventos em torno do ciclo de vida de uma ação. Por exemplo: `MailSending`, `MailSent`, `RequestCompleted` e assim por diante.

```sh
node ace make:event orderShipped
```

## `make:validator`
Crie um novo arquivo validador VineJS. Os validadores são armazenados dentro do diretório `app/validators` e cada arquivo pode exportar vários validadores.

- Formulário: `singular`
- Sufixo: `NA`
- Exemplo de nome de arquivo: `user.ts`
- Recomendação: você deve criar arquivos validadores em torno dos recursos do seu aplicativo.

```sh
# Um validador para gerenciar um usuário
node ace make:validator user

# Um validador para gerenciar uma postagem
node ace make:validator post
```

### `--resource`

Crie um arquivo validador com validadores predefinidos para ações `create` e `update`.

```sh
node ace make:validator post --resource
```

## `make:listener`

Crie uma nova classe de ouvinte de evento. As classes de ouvinte são armazenadas dentro do diretório `app/listeners` e usam as seguintes convenções de nomenclatura.

- Formulário: `NA`
- Sufixo: `NA`
- Exemplo de nome de classe: `SendShipmentNotification`
- Exemplo de nome de arquivo: `send_shipment_notification.ts`
- Recomendação: os ouvintes de evento devem ser nomeados após a ação que realizam. Por exemplo, um ouvinte que envia o e-mail de notificação de remessa deve ser chamado de `SendShipmentNotification`.

```sh
node ace make:listener sendShipmentNotification
```

### `--event`

Gere uma classe de evento junto com o ouvinte de evento.

```sh
node ace make:listener sendShipmentNotification --event=shipment_received
```

## `make:service`

Crie uma nova classe de serviço. As classes de serviço são armazenadas dentro do diretório `app/services` e usam as seguintes convenções de nomenclatura.

::: info NOTA
Um serviço não tem significado predefinido, e você pode usá-lo para extrair a lógica de negócios dentro do seu aplicativo. Por exemplo, se seu aplicativo gera muitos PDFs, você pode criar um serviço chamado `PdfGeneratorService` e reutilizá-lo em vários lugares.
:::

- Formulário: `singular`
- Sufixo: `service`
- Exemplo de nome de classe: `InvoiceService`
- Exemplo de nome de arquivo: `invoice_service.ts`

```sh
node ace make:service invoice
```

## `make:exception`

Cria uma nova [classe de exceção personalizada](../basics/exception_handling.md#custom-exceptions). As exceções são armazenadas dentro do diretório `app/exceptions`.

- Forma: `NA`
- Sufixo: `exception`
- Exemplo de nome de classe: `CommandValidationException`
- Exemplo de nome de arquivo: `command_validation_exception.ts`

```sh
node ace make:exception commandValidation
```

## `make:command`

Cria um novo comando Ace. Por padrão, os comandos são armazenados dentro do diretório `commands` na raiz do seu aplicativo.

Os comandos deste diretório são importados automaticamente pelo AdonisJS quando você tenta executar qualquer comando Ace. Você pode prefixar o nome do arquivo com um `_` para armazenar arquivos adicionais que não sejam comandos Ace neste diretório.

- Formulário: `NA`
- Sufixo: `NA`
- Exemplo de nome de classe: `ListRoutes`
- Exemplo de nome de arquivo: `list_routes.ts`
- Recomendação: os comandos devem ser nomeados após a ação que eles executam. Por exemplo, `ListRoutes`, `MakeController` e `Build`.

```sh
node ace make:command listRoutes
```

## `make:view`
Crie um novo arquivo de modelo Edge.js. Os modelos são criados dentro do diretório `resources/views`.

- Formulário: `NA`
- Sufixo: `NA`
- Exemplo de nome de arquivo: `posts/view.edge`
- Recomendação: você deve agrupar modelos para um recurso dentro de um subdiretório. Por exemplo: `posts/list.edge`, `posts/create.edge` e assim por diante.

```sh
node ace make:view posts/create
node ace make:view posts/list
```

## `make:provider`

Crie um [arquivo de provedor de serviço](../concepts/service_providers.md). Os provedores são armazenados dentro do diretório `providers` na raiz do seu aplicativo e usam as seguintes convenções de nomenclatura.

- Forma: `singular`
- Sufixo: `provider`
- Exemplo de nome de classe: `AppProvider`
- Exemplo de nome de arquivo: `app_provider.ts`

```sh
node ace make:provider app
```

### `--environments`

Defina ambientes nos quais o provedor deve ser importado. [Saiba mais sobre ambientes de aplicativos](../concepts/application.md#environment)

```sh
node ace make:provider app -e=web -e=console
```

## `make:preload`

Crie um novo [arquivo de pré-carregamento](../concepts/adonisrc_file.md#preloads). Os arquivos de pré-carregamento são armazenados dentro do diretório `start`.

```sh
node ace make:preload view
```

### `--environments`

Defina ambientes nos quais o arquivo de pré-carregamento deve ser importado. [Saiba mais sobre ambientes de aplicativos](../concepts/application.md#environment)

```sh
node ace make:preload view app -e=web -e=console
```

## `make:test`
Crie um novo arquivo de teste dentro do diretório `tests/<suite>`.

- Formulário: NA
- Sufixo: `.spec`
- Exemplo de nome de arquivo: `posts/list.spec.ts`, `posts/update.spec.ts`

```sh
node ace make:test --suite=unit
```

### `--suite`

Defina o conjunto para o qual você deseja criar o arquivo de teste. Caso contrário, o comando exibirá um prompt para seleção do conjunto.

## `make:mail`

Crie uma nova classe de e-mail dentro do diretório `app/mails`. As classes de e-mail são sufixadas com a palavra-chave `Notification`. No entanto, você pode definir um sufixo personalizado usando o sinalizador CLI `--intent`.

- Formulário: NA
- Sufixo: `Intent`
- Exemplo de nome de classe: ShipmentNotification
- Exemplo de nome de arquivo: shipping_notification.ts

```sh
node ace make:mail shipment
# ./app/mails/shipment_notification.ts
```

### `--intent`

Defina uma intenção personalizada para o e-mail.

```sh
node ace make:mail shipment --intent=confirmation
# ./app/mails/shipment_confirmation.ts

node ace make:mail storage --intent=warning
# ./app/mails/storage_warning.ts
```

## `make:policy`

Cria uma nova classe de política Bouncer. As políticas são armazenadas dentro da pasta `app/policies` e usam as seguintes convenções de nomenclatura.

- Forma: `singular`
- Sufixo: `policy`
- Exemplo de nome de classe: `PostPolicy`
- Exemplo de nome de arquivo: `post_policy.ts`

```sh
node ace make:policy post
```

## `inspect:rcfile`
Visualize o conteúdo do arquivo `adonisrc.ts` após mesclar os padrões. Você pode usar este comando para inspecionar as opções de configuração disponíveis e substituí-las de acordo com os requisitos do seu aplicativo.

Veja também: [arquivo AdonisRC](../concepts/adonisrc_file.md)

```sh
node ace inspect:rcfile
```

## `list:routes`
Visualize a lista de rotas registradas pelo seu aplicativo. Este comando inicializará seu aplicativo AdonisJS no ambiente `console`.

```sh
node ace list:routes
```

Além disso, você pode ver a lista de rotas na barra de atividades do VSCode se estiver usando nossa [extensão oficial do VSCode](https://marketplace.visualstudio.com/items?itemName=jripouteau.adonis-vscode-extension).

![](../basics/vscode_routes_list.png)

### `--json`

Visualize as rotas como uma string JSON. A saída será uma matriz de objetos.

### `--table`

Visualize as rotas dentro de uma tabela CLI. Por padrão, exibimos as rotas dentro de uma lista compacta e bonita.

### `--middleware`

Filtre a lista de rotas e inclua aquelas que usam o middleware mencionado. Você pode usar a palavra-chave `*` para incluir rotas que usam um ou mais middlewares.

### `--ignore-middleware`

Filtre a lista de rotas e inclua aquelas que NÃO usam o middleware mencionado. Você pode usar a palavra-chave `*` para incluir rotas que não usam nenhum middleware.

## `env:add`

O comando `env:add` permite que você adicione novas variáveis ​​de ambiente aos arquivos `.env`, `.env.example` e também definirá as regras de validação no arquivo `start/env.ts`.

Você pode simplesmente executar o comando e ele solicitará o nome da variável, o valor e as regras de validação. Ou você pode passá-los como argumentos.

```sh
# Solicitará o nome da variável, valor e regras de validação
node ace env:add

# Defina o nome da variável, valor e regra de validação
node ace env:add MY_VARIABLE value --type=string
```

### `--type`

Defina o tipo da variável de ambiente. O valor deve ser um dos seguintes: `string`, `boolean`, `number`, `enum`.

### `--enum-values`

Defina os valores permitidos para a variável de ambiente quando o tipo for `enum`.

```sh
node ace env:add MY_VARIABLE foo --type=enum --enum-values=foo --enum-values=bar
```
