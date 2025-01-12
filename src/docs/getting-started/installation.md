---
resumo: Como criar e configurar um novo aplicativo AdonisJS.
---

# Instalação

Antes de criar um novo aplicativo, você deve garantir que tenha o Node.js e o npm instalados no seu computador. O AdonisJS precisa de `Node.js >= 20.6`.

Você pode instalar o Node.js usando os [instaladores oficiais](https://nodejs.org/en/download/) ou [Volta](https://docs.volta.sh/guide/getting-started). O Volta é um gerenciador de pacotes multiplataforma que instala e executa várias versões do Node.js no seu computador.

```sh
// title: Verify Node.js version
node -v
# v22.0.0
```

:::dica
**Você é mais um aprendiz visual?** - Confira a série de screencasts gratuitos [Vamos aprender AdonisJS 6](https://adocasts.com/series/lets-learn-adonisjs-6) dos nossos amigos da Adocasts.
:::

## Criando um novo aplicativo

Você pode criar um novo projeto usando [npm init](https://docs.npmjs.com/cli/v7/commands/npm-init). Esses comandos baixarão o pacote inicializador [create-adonisjs](http://npmjs.com/create-adonisjs) e iniciarão o processo de instalação.

Você pode personalizar a saída inicial do projeto usando um dos seguintes sinalizadores CLI.

[starter kit](#starter-kits) para o projeto. Você pode escolher entre **web**, **api**, **slim** ou **inertia**.

- `--db`: Especifique o dialeto de banco de dados de sua escolha. Você pode escolher entre **sqlite**, **postgres**, **mysql** ou **mssql**.

- `--git-init`: Inicia o repositório git. O padrão é `false`.

- `--auth-guard`: Especifique o guarda de autenticação de sua escolha. Você pode escolher entre **session**, **access_tokens** ou **basic_auth**.

:::codegroup

```sh
// title: npm
npm init adonisjs@latest hello-world
```

:::

Ao passar sinalizadores CLI usando o comando `npm init`, certifique-se de usar [traços duplos duas vezes](https://stackoverflow.com/questions/43046885/what-does-do-when-running-an-npm-command). Caso contrário, `npm init` não passará os sinalizadores para o pacote inicializador `create-adonisjs`. Por exemplo:

```sh
# Create a project and get prompted for all options
npm init adonisjs@latest hello-world

# Create a project with MySQL
npm init adonisjs@latest hello-world -- --db=mysql

# Create a project with PostgreSQL and API starter kit
npm init adonisjs@latest hello-world -- --db=postgres --kit=api

# Create a project with API starter kit and access tokens guard
npm init adonisjs@latest hello-world -- --kit=api --auth-guard=access_tokens
```

## Kits iniciais

Os kits iniciais servem como um ponto de partida para criar aplicativos usando AdonisJS. Eles vêm com uma [estrutura de pastas opinativa](./folder_structure.md), pacotes AdonisJS pré-configurados e as ferramentas necessárias durante o desenvolvimento.

:::note
Os kits iniciais oficiais usam módulos ES e TypeScript. Essa combinação permite que você use construções JavaScript modernas e aproveite a segurança do tipo estático.
:::

### Kit inicial da Web

O kit inicial da Web é personalizado para criar aplicativos da Web de renderização de servidor tradicionais. Não deixe que a palavra-chave **"tradicional"** o desencoraje. Recomendamos este kit inicial se você criar um aplicativo da Web com interatividade limitada no frontend.

A simplicidade de renderizar HTML no servidor usando [Edge.js](https://edgejs.dev) aumentará sua produtividade, pois você não precisará lidar com sistemas de construção complexos para renderizar algum HTML.

Mais tarde, você pode usar [Hotwire](https://hotwired.dev), [HTMX](http://htmx.org) ou [Unpoly](http://unpoly.com) para fazer seus aplicativos navegarem como um SPA e usar [Alpine.js](http://alpinejs.dev) para criar widgets interativos como um menu suspenso ou um modal.

```sh
npm init adonisjs@latest -- -K=web

# Switch database dialect
npm init adonisjs@latest -- -K=web --db=mysql
```

O kit inicial da Web vem com os seguintes pacotes.

<table>
<thead>
<tr>
<th width="180px">Pacote</th>
<th>Descrição</th>
</tr>
</thead>
<tbody><tr>
<td><code>@adonisjs/core</code></td>
<td>O núcleo do framework tem os recursos básicos que você pode usar ao criar aplicativos de backend.</td>
</tr>
<tr>
<td><code>edge.js</code></td>
<td>O mecanismo de modelo <a href="https://edgejs.dev">edge</a> para compor páginas HTML.</td>
</tr>
<tr>
<td><code>@vinejs/vine</code></td>
<td><a href="https://vinejs.dev">VineJS</a> é uma das bibliotecas de validação mais rápidas no Node.js ecossistema.</td>
</tr>
<tr>
<td><code>@adonisjs/lucid</code></td>
<td>Lucid é um ORM SQL mantido pela equipe principal do AdonisJS.</td>
</tr>
<tr>
<td><code>@adonisjs/auth</code></td>
<td>A camada de autenticação do framework. Ele é configurado para usar sessões.</td>
</tr>
<tr>
<td><code>@adonisjs/shield</code></td>
<td>Um conjunto de primitivas de segurança para manter seus aplicativos da web protegidos contra ataques como <strong>CSRF</strong> e <strong>‌ XSS</strong>.</td>
</tr>
<tr>
<td><code>@adonisjs/static</code></td>
<td>Middleware para servir ativos estáticos do diretório <code>/public</code> do seu aplicativo.</td>
</tr>
<tr>
<td><code>vite</code></td>
<td><a href="https://vitejs.dev/">Vite</a> é usado para compilar os ativos do frontend.</td>
</tr>
</tbody></table>

---

### Kit inicial da API

O kit inicial da API é personalizado para criar servidores JSON API. É uma versão reduzida do kit inicial `web`. Se você planeja construir seu aplicativo frontend usando React ou Vue, você pode criar seu backend AdonisJS usando o kit inicial da API.

```sh
npm init adonisjs@latest -- -K=api

# Switch database dialect
npm init adonisjs@latest -- -K=api --db=mysql
```

Neste kit inicial:

- Removemos o suporte para servir arquivos estáticos.
- Não configure a camada de visualizações e vite.
- Desative a proteção XSS e CSRF e ative a proteção CORS.
- Use o middleware ContentNegotiation para enviar respostas HTTP em JSON.

O kit inicial da API é configurado com autenticação baseada em sessão. No entanto, se você deseja usar autenticação baseada em tokens, você pode usar o sinalizador `--auth-guard`.

Veja também: [Qual proteção de autenticação devo usar?](../authentication/introduction.md#choosing-an-auth-guard)

```sh
npm init adonisjs@latest -- -K=api --auth-guard=access_tokens
```

---

### Kit inicial Slim
Para minimalistas, criamos um kit inicial `slim`. Ele vem apenas com o núcleo do framework e a estrutura de pastas padrão. Você pode usá-lo quando não quiser nenhum enfeite do AdonisJS.

```sh
npm init adonisjs@latest -- -K=slim

# Switch database dialect
npm init adonisjs@latest -- -K=slim --db=mysql
```

---

### Kit inicial Inertia

[Inertia](https://inertiajs.com/) é uma maneira de construir aplicativos de página única orientados a servidor. Você pode usar seu framework de frontend favorito ( React, Vue, Solid, Svelte ) para construir o frontend do seu aplicativo.

Você pode usar o sinalizador `--adapter` para escolher o framework de frontend que deseja usar. As opções disponíveis são `react`, `vue`, `solid` e `svelte`.

Você também pode usar os sinalizadores `--ssr` e `--no-ssr` para ativar ou desativar a renderização do lado do servidor.

```sh
# React with server-side rendering
npm init adonisjs@latest -- -K=inertia --adapter=react --ssr

# Vue without server-side rendering
npm init adonisjs@latest -- -K=inertia --adapter=vue --no-ssr
```

---

### Traga seu kit inicial
Os kits iniciais são projetos pré-criados hospedados em um provedor de repositório Git como GitHub, Bitbucket ou Gitlab. Você também pode criar seus kits iniciais e baixá-los da seguinte forma.

```sh
npm init adonisjs@latest -- -K="github_user/repo"

# Download from GitLab
npm init adonisjs@latest -- -K="gitlab:user/repo"

# Download from BitBucket
npm init adonisjs@latest -- -K="bitbucket:user/repo"
```

Você pode baixar repositórios privados usando autenticação Git+SSH usando o modo `git`.

```sh
npm init adonisjs@latest -- -K="user/repo" --mode=git
```

Finalmente, você pode especificar uma tag, branch ou commit.

```sh
# Branch
npm init adonisjs@latest -- -K="user/repo#develop"

# Tag
npm init adonisjs@latest -- -K="user/repo#v2.1.0"
```

## Iniciando o servidor de desenvolvimento
Depois de criar um aplicativo AdonisJS, você pode iniciar o servidor de desenvolvimento executando o comando `node ace serve`.

Ace é uma estrutura de linha de comando empacotada dentro do núcleo da estrutura. O sinalizador `--hmr` monitora o sistema de arquivos e executa [substituição de módulo a quente (HMR)](../concepts/hmr.md) para certas seções da sua base de código.

```sh
node ace serve --hmr
```

Depois que o servidor de desenvolvimento for executado, você pode visitar [http://localhost:3333](http://localhost:3333) para visualizar seu aplicativo em um navegador.

## Construindo para produção

Como os aplicativos AdonisJS são escritos em TypeScript, eles devem ser compilados em JavaScript antes de serem executados em produção.

Você pode criar a saída JavaScript usando o comando `node ace build`. A saída JavaScript é gravada no diretório `build`.

Quando o Vite é configurado, este comando também compila os ativos frontend usando o Vite e grava a saída na pasta `build/public`.

Veja também: [Processo de compilação do TypeScript](../concepts/typescript_build_process.md).

```sh
node ace build
```

## Configurando o ambiente de desenvolvimento

Embora o AdonisJS cuide da construção dos aplicativos do usuário final, você pode precisar de ferramentas adicionais para aproveitar o processo de desenvolvimento e ter consistência em seu estilo de codificação.

Recomendamos fortemente que você use **[ESLint](https://eslint.org/)** para lintar seu código e use **[Prettier](https://prettier.io)** para reformatar seu código para consistência.

Os kits iniciais oficiais vêm pré-configurados com ESLint e Prettier e usam as predefinições opinativas da equipe principal do AdonisJS. Você pode aprender mais sobre eles na seção [Configuração de ferramentas](../concepts/tooling_config.md) dos documentos.

Por fim, recomendamos que você instale os plugins ESLint e Prettier para seu editor de código para que você tenha um loop de feedback mais apertado durante o desenvolvimento do aplicativo. Além disso, você pode usar os seguintes comandos para `lint` e `format` seu código a partir da linha de comando.

```sh
# Runs ESLint
npm run lint

# Run ESLint and auto-fix issues
npm run lint -- --fix

# Runs prettier
npm run format
```

## Extensões VSCode
Você pode desenvolver um aplicativo AdonisJS em qualquer editor de código que suporte TypeScript. No entanto, desenvolvemos várias extensões para VSCode para aprimorar ainda mais a experiência de desenvolvimento.

[**AdonisJS**](https://marketplace.visualstudio.com/items?itemName=jripouteau.adonis-vscode-extension) - Visualize rotas de aplicativos, execute comandos ace, migre o banco de dados e leia a documentação diretamente do seu editor de código.
[**Edge**](https://marketplace.visualstudio.com/items?itemName=AdonisJS.vscode-edge) - Turbine seu fluxo de trabalho de desenvolvimento com suporte para realce de sintaxe, preenchimento automático e snippets de código.
[**Japa**](https://marketplace.visualstudio.com/items?itemName=jripouteau.japa-vscode) - Execute testes sem sair do seu editor de código usando atalhos de teclado ou execute-os diretamente da barra lateral de atividades.
