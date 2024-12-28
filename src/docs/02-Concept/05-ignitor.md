---
title: Ignitor
category: concept
---

# Ignitor

O [Ignitor](https://github.com/adonisjs/adonis-ignitor) alimenta o bootstrapping de um aplicativo AdonisJs.

Neste guia, aprendemos sobre alguns dos recursos e funcionalidades oferecidos pelo pacote Ignitor para gerenciar nosso código.

## Ganchos
O Ignitor expõe vários ganchos para personalizar o comportamento do seu aplicativo.

Esses ganchos são registrados dentro do arquivo `start/hooks.js`. Sinta-se à vontade para criar este arquivo se ele ainda não existir.

Aqui está um exemplo de como usar `hooks.after` para registrar uma visualização global *depois* que todos os provedores forem inicializados:

```js
// .start/hooks.js

const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const View = use('View')
  View.global('time', () => new Date().getTime())
})
```

Semelhante a `hooks.after`, você também pode usar `hooks.before` para registrar a lógica do aplicativo *antes* que um gancho ocorra.

Abaixo está a lista de ganchos disponíveis:

| Evento de gancho    | Descrição                                               |
|---------------------|---------------------------------------------------------|
| providersRegistered | Antes/depois de todos os provedores terem se registrado |
| providersBooted     | Antes/depois de todos os provedores terem inicializado  |
| preloading          | Antes/depois de pré-carregar arquivos registrados       |
| httpServer          | Antes/depois de o servidor HTTP ter iniciado            |
| aceCommand          | Antes/depois de o comando ace ser executado             |

## Pré-carregamento de arquivos
O Ignitor facilita o pré-carregamento de arquivos depois que o servidor HTTP foi iniciado.

Para fazer isso, modifique o arquivo `server.js` e adicione o método `preLoad`:

```js
new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .preLoad('start/fire-zombies')
  .fireHttpServer()
  .catch(console.error)
```

::: warning OBSERVAÇÃO
O método `preLoad` aceita um caminho raiz de aplicativo relativo ou um caminho absoluto para qualquer arquivo JavaScript.
:::

Para carregar vários arquivos, chame o método `preLoad` várias vezes:

```js
new Ignitor(require('@adonisjs/fold'))
  .preLoad('')
  .preLoad('')
  // etc
```

## Métodos do Ignitor
Abaixo está a lista de métodos disponíveis na instância `ignitor`.

#### `appRoot(location)`
Defina o caminho absoluto para a raiz do aplicativo:

```js
ignitor
  .appRoot(__dirname)
```

#### `modulesRoot(location)`
Defina o caminho absoluto para o diretório pai `node_modules` do aplicativo.

Por padrão, o caminho definido em `appRoot()` é usado:

```js
ignitor
  .modulesRoot(path.join(__dirname, '..'))
```

#### `appFile(location)`
Defina o caminho relativo para o arquivo do aplicativo.

Por padrão, o arquivo `start/app.js` é usado:

```js
ignitor
  .appFile('start/app.js')
```

#### `loadCommands()`
Instrua o Ignitor a carregar provedores e comandos ace.

Isso é feito ao executar um comando ace, no entanto, você também pode carregar comandos ao iniciar o servidor HTTP:

```js
ignitor
  .loadCommands()
```
