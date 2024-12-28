---
title: Installation
category: getting-started
---

# Instalação

A instalação do AdonisJs é um processo simples e levará apenas alguns minutos.

## Requisitos do sistema

As únicas dependências do framework são `Node.js` e `npm`.

Certifique-se de que suas versões dessas ferramentas correspondem aos seguintes critérios:

- Node.js >= 8.0.0
- npm >= 3.0.0
- git

::: tip DICA
Você pode usar ferramentas como [nvm](https://github.com/creationix/nvm) para ajudar a gerenciar várias versões do Node.js e npm ao mesmo tempo.
:::

## Instalando o AdonisJs

### Via AdonisJs CLI

AdonisJs CLI é uma ferramenta de linha de comando para ajudar você a instalar o AdonisJs.

Instale-o globalmente via `npm` assim:

```bash
npm i -g @adonisjs/cli
```

::: tip DICA
Você também pode usar `npx` para evitar instalar a CLI globalmente.
:::

Certifique-se de adicionar o diretório `node_modules/.bin` de todo o sistema `npm` ao seu `$PATH` para poder acessar o binário instalado.

Depois de instalado, você pode usar o comando `adonis new` para criar novas instalações do AdonisJs.

Por exemplo, para criar um novo aplicativo chamado `yardstick`, simplesmente:

```bash
adonis new yardstick
```

::: warning NOTA
Por padrão, o [fullstack blueprint](https://github.com/adonisjs/adonis-fullstack-app) é clonado do Github. Você pode personalizar isso usando as opções `--api-only` ou `--slim`.

Você também pode especificar seu próprio blueprint usando a opção `--blueprint=<github-org/repo>`.
:::

### Via Git

Alternativamente, você pode usar `git` diretamente para buscar nossos boilerplates:

```bash
# Fullstack
> git clone --dissociate https://github.com/adonisjs/adonis-fullstack-app

# API
> git clone --dissociate https://github.com/adonisjs/adonis-api-app

# Slim
> git clone --dissociate https://github.com/adonisjs/adonis-slim-app
```

Após clonar um boilerplate, instale todas as dependências executando `npm install`.

## Servindo o aplicativo

Depois que o processo de instalação for concluído, você pode `cd` no seu novo diretório de aplicativo e executar o seguinte comando para iniciar o servidor HTTP:

```bash
adonis serve --dev
```

Este comando inicia o servidor na porta definida dentro do arquivo raiz `.env`.
