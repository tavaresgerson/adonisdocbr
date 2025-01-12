---
summary: Aprenda sobre as predefinições de configuração de ferramentas usadas pelo AdonisJS para TypeScript, Prettier e ESLint.
---

# Configuração de ferramentas

O AdonisJS depende muito do TypeScript, Prettier e ESLint para ter consistência no código, verificar erros no momento da compilação e, mais importante, ter uma experiência de desenvolvimento agradável.

Resumimos todas as nossas escolhas dentro de predefinições de configuração prontas para uso usadas por todos os pacotes oficiais e pelos kits iniciais oficiais.

Continue lendo este guia se quiser usar as mesmas predefinições de configuração em seus aplicativos Node.js escritos em TypeScript.

## TSConfig

O pacote [`@adonisjs/tsconfig`](https://github.com/adonisjs/tooling-config/tree/main/packages/typescript-config) contém a configuração base para projetos TypeScript. Definimos o sistema de módulo TypeScript como `NodeNext` e usamos `TS Node + SWC` para compilação Just-in-Time.

Sinta-se à vontade para explorar opções dentro do [arquivo de configuração base](https://github.com/adonisjs/tooling-config/blob/main/packages/typescript-config/tsconfig.base.json), [arquivo de configuração do aplicativo](https://github.com/adonisjs/tooling-config/blob/main/packages/typescript-config/tsconfig.app.json) e [arquivo de configuração de desenvolvimento de pacote](https://github.com/adonisjs/tooling-config/blob/main/packages/typescript-config/tsconfig.package.json).

Você pode instalar o pacote e usá-lo da seguinte maneira.

```sh
npm i -D @adonisjs/tsconfig

# Make sure also to install the following packages
npm i -D typescript ts-node @swc/core
```

Estenda do arquivo `tsconfig.app.json` ao criar um aplicativo AdonisJS. (Vem pré-configurado com kits iniciais).

```jsonc
{
  "extends": "@adonisjs/tsconfig/tsconfig.app.json",
  "compilerOptions": {
    "rootDir": "./",
    "outDir": "./build"
  }
}
```

Estenda do arquivo `tsconfig.package.json` ao criar um pacote para o ecossistema AdonisJS.

```jsonc
{
  "extends": "@adonisjs/tsconfig/tsconfig.package.json",
  "compilerOptions": {
    "rootDir": "./",
    "outDir": "./build"
  }
}
```

## Configuração mais bonita
O pacote [`@adonisjs/prettier-config`](https://github.com/adonisjs/tooling-config/tree/main/packages/prettier-config) contém a configuração base para formatar automaticamente o código-fonte para um estilo consistente. Sinta-se à vontade para explorar as opções de configuração dentro do [arquivo index.json](https://github.com/adonisjs/tooling-config/blob/main/packages/prettier-config/index.json).

Você pode instalar o pacote e usá-lo da seguinte maneira.

```sh
npm i -D @adonisjs/prettier-config

# Make sure also to install prettier
npm i -D prettier
```

Defina a seguinte propriedade dentro do arquivo `package.json`.

```jsonc
{
  "prettier": "@adonisjs/prettier-config"
}
```

Além disso, crie um arquivo `.prettierignore` para ignorar arquivos e diretórios específicos.

```
// title: .prettierignore
build
node_modules
```

## Configuração ESLint
O pacote [`@adonisjs/eslint-config`](https://github.com/adonisjs/tooling-config/tree/main/packages/eslint-config) contém a configuração base para aplicar as regras de linting. Sinta-se à vontade para explorar opções dentro do [arquivo de configuração base](https://github.com/adonisjs/tooling-config/blob/main/packages/eslint-config/presets/ts_base.js), [arquivo de configuração do aplicativo](https://github.com/adonisjs/tooling-config/blob/main/packages/eslint-config/presets/ts_app.js) e [arquivo de configuração de desenvolvimento de pacote](https://github.com/adonisjs/tooling-config/blob/main/packages/eslint-config/presets/ts_package.js).

Você pode instalar o pacote e usá-lo da seguinte maneira.

:::note
Nossa predefinição de configuração usa o [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) para garantir que o ESLint e o Prettier possam trabalhar juntos sem interferir um no outro.
:::

```sh
npm i -D @adonisjs/eslint-config

# Make sure also to install eslint
npm i -D eslint
```

Estenda do arquivo `eslint-config/app` ao criar um aplicativo AdonisJS. (Vem pré-configurado com kits iniciais).

```json
// title: package.json
{
  "eslintConfig": {
    "extends": "@adonisjs/eslint-config/app"
  }
}
```

Estenda do arquivo `eslint-config/package` ao criar um pacote para o ecossistema AdonisJS.

```json
// title: package.json
{
  "eslintConfig": {
    "extends": "@adonisjs/eslint-config/package"
  }
}
```
