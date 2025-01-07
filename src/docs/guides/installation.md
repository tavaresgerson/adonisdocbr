# Instalação

AdonisJS é um framework Node.js e, portanto, requer que o Node.js esteja instalado no seu computador. Para ser preciso, precisamos pelo menos da versão mais recente do `Node.js v14`.

Você pode verificar as versões do Node.js e do npm executando os seguintes comandos.

```sh
# verificar versão node.js
node -v
```

Se você não tiver o Node.js instalado, você pode [baixar o binário](https://nodejs.org/en/download) para seu sistema operacional no site oficial.

Se você se sentir confortável com a linha de comando, recomendamos usar [Volta](https://volta.sh) ou [Node Version Manager](https://github.com/nvm-sh/nvm) para instalar e executar várias versões do Node.js em seu computador.

## Criando um novo projeto
Você pode criar um novo projeto usando [npm init](https://docs.npmjs.com/cli/v7/commands/npm-init), [yarn create](https://classic.yarnpkg.com/en/docs/cli/create) ou [pnpm create](https://pnpm.io/tr/next/cli/create). Essas ferramentas baixarão o pacote inicial do AdonisJS e iniciarão o processo de instalação.

:::codegroup

```sh [npm]
npm init adonis-ts-app@latest hello-world
```

```sh [yarn]
yarn create adonis-ts-app hello-world
```

```sh [pnpm]
pnpm create adonis-ts-app hello-world
```
:::

O processo de instalação solicita as seguintes seleções.

#### Estrutura do projeto
Você pode escolher entre uma das seguintes estruturas de projeto.

- A estrutura do projeto `web` é ideal para criar aplicativos renderizados pelo servidor clássico. Configuramos o suporte para sessões e também instalamos o mecanismo de modelo AdonisJS.
- A estrutura do projeto `api` é ideal para criar um servidor de API.
- A estrutura do projeto `slim` cria o menor aplicativo AdonisJS possível e não instala nenhum pacote adicional, exceto o núcleo do framework.

#### Nome do projeto
O nome do projeto. Definimos o valor deste prompt dentro do arquivo `package.json`.

#### Configurar eslint/prettier
Opcionalmente, você pode configurar eslint e prettier. Ambos os pacotes são configurados com as configurações opinativas usadas pela equipe principal do AdonisJS.

#### Configurar Webpack Encore
Opcionalmente, você também pode configurar [Webpack Encore](./http/assets-manager.md) para agrupar e servir dependências de frontend.

Observe que o AdonisJS é um framework de backend e não se preocupa com ferramentas de construção de frontend. Portanto, a configuração do Webpack é opcional.

## Iniciando o servidor de desenvolvimento
Após criar o aplicativo, você pode iniciar o servidor de desenvolvimento executando o seguinte comando.

```sh
node ace serve --watch
```

- O comando `serve` inicia o servidor HTTP e executa uma compilação na memória do TypeScript para JavaScript.
- O sinalizador `--watch` serve para observar o sistema de arquivos em busca de alterações e reiniciar o servidor automaticamente.

Por padrão, o servidor inicia na porta 3333 (definida dentro do arquivo .env). Você pode visualizar a página de boas-vindas visitando: http://localhost:3333.

## Compilando para produção
Você deve sempre implantar o JavaScript compilado no seu servidor de produção. Você pode criar a compilação de produção executando o seguinte comando:

```sh
node ace build --production
```

A saída compilada é gravada na pasta `build`. Você pode `cd` para essa pasta e iniciar o servidor executando diretamente o arquivo `server.js`. Saiba mais sobre o [processo de build do TypeScript](./fundamentals/typescript-build-process.md)

```sh
cd build
node server.js
```
