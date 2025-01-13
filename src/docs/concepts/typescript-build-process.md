---
summary: Aprenda sobre o processo de construção do TypeScript no AdonisJS
---

# Processo de construção do TypeScript

Aplicativos escritos em TypeScript devem ser compilados em JavaScript antes que você possa executá-los em produção.

A compilação de arquivos de origem do TypeScript pode ser realizada usando muitas ferramentas de construção diferentes. No entanto, com o AdonisJS, seguimos a abordagem mais direta e usamos as seguintes ferramentas testadas pelo tempo.

::: info NOTA
Todas as ferramentas mencionadas abaixo vêm pré-instaladas como dependências de desenvolvimento com kits iniciais oficiais.
:::

[TSC](https://www.typescriptlang.org/docs/handbook/compiler-options.html)** é o compilador oficial do TypeScript. Usamos o TSC para executar a verificação de tipos e criar a construção de produção.

[TS Node](https://typestrong.org/ts-node/)** é um compilador Just-in-Time para TypeScript. Ele permite que você execute arquivos TypeScript sem compilá-los para JavaScript e prova ser uma ótima ferramenta para desenvolvimento.

[SWC](https://swc.rs/)** é um compilador TypeScript escrito em Rust. Nós o usamos durante o desenvolvimento com o TS Node para tornar o processo JIT extremamente rápido.

| Ferramenta  | Usado para                | Verificação de tipo |
|-------------|---------------------------|---------------------|
| `TSC`       | Criando build de produção | Yes                 |
| `TS Node`   | Desenvolvimento           | No                  |
| `SWC`       | Desenvolvimento           | No                  |

## Executando arquivos TypeScript sem compilação

Você pode executar os arquivos TypeScript sem compilá-los usando o carregador `ts-node/esm`. Por exemplo, você pode iniciar o servidor HTTP executando o seguinte comando.

```sh
node --loader="ts-node/esm" bin/server.js
```

[API Node.js](https://nodejs.org/dist/latest-v21.x/docs/api/esm.html#loaders).

- `ts-node/esm`: O caminho para o script `ts-node/esm` que registra ganchos de ciclo de vida para executar a compilação Just-in-Time da fonte TypeScript para JavaScript.

[Uma nota sobre extensões de arquivo](#a-note-on-file-extensions)**

Você pode repetir esse processo para outros arquivos TypeScript também. Por exemplo:

```sh
# Executar testes

node --loader ts-node/esm bin/test.js
```

```sh
# Executar comandos ace

node --loader ts-node/esm bin/console.js
```

```sh
# Executar algum outro arquivo TypeScript

node --loader ts-node/esm path/to/file.js
```

### Uma observação sobre extensões de arquivo

Você pode ter notado que usamos a extensão de arquivo `.js` em todos os lugares, mesmo que o arquivo no disco seja salvo com a extensão de arquivo `.ts`.

Isso ocorre porque, com módulos ES, o TypeScript força você a usar a extensão `.js` em importações e ao executar scripts. Você pode aprender sobre a tese por trás dessa escolha na [documentação do TypeScript](https://www.typescriptlang.org/docs/handbook/modules/theory.html#typescript-imitates-the-hosts-module-resolution-but-with-types).

## Executando o servidor de desenvolvimento
Em vez de executar o arquivo `bin/server.js` diretamente, recomendamos usar o comando `serve` pelos seguintes motivos.

- O comando inclui um observador de arquivo e reinicia o servidor de desenvolvimento na alteração do arquivo.
- O comando `serve` detecta o empacotador de ativos de frontend que seu aplicativo está usando e inicia seu servidor de desenvolvimento. Por exemplo, se você tiver um arquivo `vite.config.js` na raiz do seu projeto, o comando `serve` iniciará o servidor de desenvolvimento `vite`.

```sh
node ace serve --watch
```

Você pode passar argumentos para o servidor de desenvolvimento Vite usando o sinalizador de linha de comando `--assets-args`.

```sh
node ace serve --watch --assets-args="--debug --base=/public"
```

Você pode usar o sinalizador `--no-assets` para desabilitar o servidor de desenvolvimento Vite.

```sh
node ace serve --watch --no-assets
```

### Passando opções para a linha de comando Node.js
O comando `serve` inicia o servidor de desenvolvimento `(arquivo bin/server.ts)` como um processo filho. Se você quiser passar [argumentos do nó](https://nodejs.org/api/cli.html#options) para o processo filho, você pode defini-los antes do nome do comando.

```sh
node ace --no-warnings --inspect serve --watch
```

## Criando build de produção

O build de produção do seu aplicativo AdonisJS é criado usando o comando `node ace build`. O comando `build` executa as seguintes operações para criar um [**aplicativo JavaScript autônomo**](#what-is-a-standalone-build) dentro do diretório `./build`.

- Remova a pasta `./build` existente (se houver).
- Reescreva o arquivo `ace.js` **do zero** para remover o carregador `ts-node/esm`.
- Compile os ativos do frontend usando o Vite (se configurado).
- [`tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html).
- [`metaFiles`](../concepts/adonisrc_file.md#metafiles) array para a pasta `./build`.
- Copie os arquivos `package.json` e `package-lock.json/yarn.lock` para a pasta `./build`.

::: warning ATENÇÃO
Quaisquer modificações no arquivo `ace.js` serão perdidas durante o processo de build, pois o arquivo é reescrito do zero. Se você quiser ter algum código adicional que seja executado antes do Ace iniciar, você deve fazê-lo dentro do arquivo `bin/console.ts`.
:::

E isso é tudo!

```sh
node ace build
```

Depois que o build for criado, você pode `cd` para a pasta `build`, instalar dependências de produção e executar seu aplicativo.

```sh
cd build

# Instalar dependências de produção
npm i --omit=dev

# Executar servidor
node bin/server.js
```

Você pode passar argumentos para o comando de compilação do Vite usando o sinalizador de linha de comando `--assets-args`.

```sh
node ace build --assets-args="--debug --base=/public"
```

Você pode usar o sinalizador `--no-assets` para evitar compilar os ativos do frontend.

```sh
node ace build --no-assets
```

### O que é uma compilação autônoma?

A compilação autônoma se refere à saída JavaScript do seu aplicativo que você pode executar sem a fonte TypeScript original.

A criação de uma compilação autônoma ajuda a reduzir o tamanho do código que você implanta no seu servidor de produção, pois você não precisa copiar os arquivos de origem e a saída JavaScript.

Após criar a compilação de produção, você pode copiar o `./build` para o seu servidor de produção, instalar dependências, definir variáveis ​​de ambiente e executar o aplicativo.
