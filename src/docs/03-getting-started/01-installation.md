# Instalação

Instalar o AdonisJS é um processo relativamente simples e que não deve levar mais do que alguns minutos. Sinta-se à vontade para [abrir uma questão](https://github.com/adonisjs/adonis-framework/issues) se você tiver algum problema durante o processo de instalação.

## Instalando Node.js & npm
Como framework Node.js, o AdonisJS tem uma dependência central no Node.js. Certifique-se de que a versão instalada do [Node.js](https://nodejs.org/en/) seja *4.0* ou superior.

O [Node Package Manager (npm)](https://www.npmjs.org/) é um gerenciador de pacotes para o Node.js. Durante o processo de desenvolvimento, você vai usar muito o comando `npm install`. Portanto, todas as dependências são buscadas apenas no npm.

NOTE: Em outubro de 2016, o `v6.x.x` do Node.js estará sob LTS e também as versões mais recentes do AdonisJs serão direcionadas para o Node.js v6.0 ou superior. Então é recomendado usar uma das últimas versões do Node.js.
A versão existente do framework será compatível com o Node.js 4.0 ou superior.

### Baixando
Você pode baixar o instalador para seu sistema operacional da [página de downloads do Node.js](https://nodejs.org/en/download), ou usar o [Nvm](https://github.com/creationix/nvm#install-script). O Nvm é uma ferramenta de linha de comando para instalar e usar múltiplas versões do Node.js em uma única máquina.

### Verificando instalação
Depois de concluir o processo de download, verifique a versão instalada do Node.js e npm.

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
Adonis-CLI é uma ferramenta de linha de comando para instalar as versões estáveis e de desenvolvimento do AdonisJs com todas as dependências necessárias. É um [pacote npm](https://www.npmjs.com/package/adonis-cli) e precisa ser instalado globalmente.

```bash
npm i -g adonis-cli
```

Execute o seguinte comando para verificar a instalação do `adonis-cli`. Às vezes, você pode ter que abrir uma nova aba de terminal para fazê-lo funcionar.

```bash
adonis --help
```

```bash
Commands
------------
Usage: index [options] [command]

  Commands:

    new [options] <name>  Scaffold a new AdonisJs application with the name provided.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

## Criando um novo projeto
Uma vez que o `adonis-cli` tenha sido instalado, você pode usar o `adonis` global do seu prompt de comando. Vamos usá-lo para criar um novo projeto.

```bash
adonis new yardstick
```

### Usando o Yarn
Se você está entusiasmado com [yarn](https://yarnpkg.com/) e não quer instalar suas dependências usando npm. Execute o seguinte comando.

```bash
adonis new yardstick --yarn
```

```bash
✔ Your current Node.js & npm version match the AdonisJs requirements!

⠋ Cloning master branch of adonisjs/adonis-app blueprint
    clone: Repository cloned

⠧ Installing dependencies using npm
```

O comando "new" criará um projeto chamado "yardstick" com uma estrutura de diretório pré-definida e também instalará todas as dependências necessárias do npm.

NOTE: Se o comando 'new' falhar no meio, certifique-se de que você está dentro do novo projeto criado e execute manualmente 'npm install'.

### Opções de Estrutura
Você pode fornecer várias opções para imitar o processo de scaffold.


| Flag              | Valor   | Descrição                                               |
|-------------------|---------|---------------------------------------------------------|
| `--skip-install`  | Boolean | Para pular a instalação das dependências do npm ou yarn |
| `--branch`        | String  | Adonisjs utiliza o branch master ao criar um novo projeto. Para alterações de ponta de linha, você pode criar um projeto do branch 'develop'. |
| `--blueprint`     | String  | O caminho incremental para o repositório do GitHub é o Blueprints. Por padrão, o AdonisJs utiliza o `adonisjs/adonis-app`. |
| `--yarn`          | Boolean | Faça uso do Yarn para instalar módulos |
| `--npm`           | Boolean | Faça uso do npm para instalar módulos |

## Erro Obtendo Proxy
Versões mais antigas do Node.js exigem a bandeira `--harmony_proxies` para adicionar suporte para *ES2015 Proxies*. Se você estiver usando o *Node.js < 6.0*, certifique-se de fazer as seguintes alterações.

Substitua os scripts dentro do arquivo package.json pelos seguintes

```json
// .package.json

"scripts": {
  "serve:dev": "nodemon --watch app --watch bootstrap --watch config --watch .env -x \"node --harmony_proxies\" server.js",
  "serve": "node --harmony_proxies server.js"
}
```

Substitua a primeira linha do arquivo `ace` pelo seguinte

```bash
#!/usr/bin/env node --harmony_proxies
```

## Servindo o aplicativo
Você está pronto para ver seu novo projeto. Execute os comandos abaixo para iniciar um servidor de desenvolvimento.

```bash
cd yardstick
npm run serve:dev
```

```bash
[nodemon] starting `node server.js`
info adonis:framework serving app on http://localhost:3333
```

Por padrão, o AdonisJs utilizará a porta 3333 para iniciar o servidor, que é configurável através do arquivo .env. Agora abra http://localhost:3333 para ver a página de boas-vindas.

Aqui está uma possível tradução:

![Página de Boas-vindas](/docs/assets/xAYvmnBq_o.png)

## Instalação manual
Se por algum motivo você não estiver usando o [CLI do Adonis](#instalando-o-cli-do-adonis), você precisa realizar os seguintes passos para clonar o repositório do GitHub e instalar manualmente as dependências.

```bash
git clone --dissociate https://github.com/adonisjs/adonis-app yardstick
cd yardstick
```

Instalando dependências

```bash
npm install
```
