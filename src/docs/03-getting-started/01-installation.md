# Instalação

A instalação do AdonisJs é um processo relativamente simples e levará apenas alguns minutos. Sinta-se à vontade para [registrar um problema](https://github.com/adonisjs/adonis-framework/issues) se você tiver algum problema durante o processo de instalação.

## Instalando Node.js e Npm
Sendo um framework Node.js, o AdonisJs tem uma dependência central no Node.js. Certifique-se de que a versão instalada do [Node.js](https://nodejs.org/en/) seja *4.0* ou superior.

[Npm](https://www.npmjs.org/) é um gerenciador de pacotes para Node.js. Durante o processo de desenvolvimento, você se verá usando `npm install` muito. Portanto, todas as dependências são extraídas apenas do npm.

::: info NOTA
Em outubro de 2016, `v6.x.x` do Node.js estará sob LTS e também as versões mais recentes do AdonisJs serão direcionadas para o Node.js v6.0 ou superior. Portanto, é recomendável usar uma das versões mais recentes do Node.js.
A versão existente do framework será compatível com o Node.js 4.0 ou superior.
:::

### Baixando
Você pode baixar o instalador para seu sistema operacional na [página de downloads do Node.js](https://nodejs.org/en/download), ou deve usar o [Nvm](https://github.com/creationix/nvm#install-script). O Nvm é uma ferramenta de linha de comando para instalar e usar várias versões do Node.js em uma única máquina.

### Verificando a instalação
Depois de concluir o processo de download, certifique-se de verificar a versão instalada do Node.js e do npm.

```bash
node -v
# >= v4.0.0
```

e para npm

```bash
npm -v
# >= 3.0.0
```

## Instalando o Adonis-CLI
O Adonis-CLI é uma ferramenta de linha de comando para instalar versões estáveis ​​e dev do AdonisJs com todas as dependências necessárias. É um [pacote npm](https://www.npmjs.com/package/adonis-cli) e precisa ser instalado globalmente.

```bash
npm i -g adonis-cli
```

Execute o comando a seguir para verificar a instalação do `adonis-cli`. Às vezes, pode ser necessário abrir uma nova aba de terminal para fazê-lo funcionar.

```bash
adonis --help
```

```bash
# Output

Commands
------------
Usage: index [options] [command]

  Commands:

    new [options] <name>  Scaffold a new AdonisJs application with the name provided.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

### Criando um novo projeto
Depois que o `adonis-cli` for instalado, você pode usar o `adonis` global na sua linha de comando. Vamos usá-lo para criar um novo projeto.

```bash
adonis new yardstick
```

### Usando Yarn
Se você está entusiasmado com link:https://yarnpkg.com/[yarn, window="_blank"] e não quer instalar suas dependências usando npm. Execute o seguinte comando.

```bash
adonis new yardstick --yarn
```

```bash
# Output

✔ Your current Node.js & npm version match the AdonisJs requirements!

⠋ Cloning master branch of adonisjs/adonis-app blueprint
    clone: Repository cloned

⠧ Installing dependencies using npm
```

O comando `new` criará um projeto chamado *yardstick* com estrutura de diretório predefinida e também instalará todas as dependências necessárias do npm.

::: info NOTA
Se o comando `new` falhar no meio, certifique-se de `cd` no projeto recém-criado e executar manualmente `npm install`.
:::

### Opções de scaffold
Você pode fornecer várias opções para imitar o processo de scaffold.


| Flag            | Value   | Description |
|-----------------|---------|-------------|
| --skip-install  | Boolean | Para pular a instalação de dependências do npm ou do yarn |
| --branch        | String  | O Adonisjs faz uso do branch master ao criar um novo projeto. Para mudanças de ponta, você pode criar um projeto a partir do branch `develop`. |
| --blueprint     | String  | Blueprint é o caminho incremental para o repositório Github. Por padrão, o AdonisJs faz uso de `adonisjs/adonis-app`. |
| --yarn          | Boolean | Use o yarn para instalar módulos |
| --npm           | Boolean | Use o npm para instalar módulos |

## Erro de obtenção de proxies
Versões mais antigas do Node.js exigem o sinalizador `--harmony_proxies` para adicionar suporte para *ES2015 Proxies*. Se você estiver usando *Node.js < 6.0*, certifique-se de fazer as seguintes alterações.

Substitua os scripts dentro do arquivo `package.json` pelo seguinte

```json
// .package.json

"scripts": {
  "serve:dev": "nodemon --watch app --watch bootstrap --watch config --watch .env -x \"node --harmony_proxies\" server.js",
  "serve": "node --harmony_proxies server.js"
}
```

Substitua a primeira linha do arquivo `ace` pelo seguinte

```bash
// ace

#!/usr/bin/env node --harmony_proxies
```

## Servindo o aplicativo
Você está pronto para ver seu novo projeto. Execute os comandos abaixo para iniciar um servidor de desenvolvimento.

```bash
cd yardstick
npm run serve:dev
```

```bash
# Output

[nodemon] starting `node server.js`
info adonis:framework serving app on http://localhost:3333
```

Por padrão, o AdonisJs usará a porta `3333` para iniciar o servidor, que é configurável por meio do arquivo `.env`. Agora abra http://localhost:3333 para ver a página de boas-vindas.

![Página de boas-vindas](/docs/assets/xAYvmnBq.png)

## Instalação manual
Se por algum motivo você não estiver usando [Adonis CLI](#installing-adonis-cli) (o que você deveria), você tem que executar os seguintes passos para clonar o repositório do GitHub e instalar manualmente as dependências.

```bash
git clone --dissociate https://github.com/adonisjs/adonis-app yardstick
cd yardstick
```

```bash
# Instalando dependências

npm install
```
