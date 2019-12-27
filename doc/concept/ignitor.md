# Ignitor

O [Ignitor](https://github.com/adonisjs/adonis-ignitor) aciona a inicialização de um aplicativo AdonisJs.

Neste guia, aprendemos sobre alguns dos recursos e funcionalidades oferecidos pelo pacote Ignitor para gerenciar nosso código.

## Hooks
O Ignitor expõe vários ganchos para personalizar o comportamento do seu aplicativo.

Esses ganchos são registrados dentro do arquivo `start/hooks.js`. Sinta-se livre para criar este 
arquivo se ele ainda não existir.

Aqui está um exemplo de como usar `hooks.after` para registrar uma visão global após a inicialização de
todos os provedores:

``` js
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const View = use('View')
  View.global('time', () => new Date().getTime())
})
```

Semelhante `hooks.after`, você também pode usar `hooks.before` para registrar a lógica do aplicativo 
antes que um gancho ocorra.

Abaixo está a lista de ganchos disponíveis:

| Evento Hook                           | Descrição                                                         |
|---------------------------------------|-------------------------------------------------------------------|
| providerRegistered                    | Antes / depois de todos os provedores terem se registrado         |
| providerBooted                        | Antes / depois de todos os provedores terem inicializado          |
| preloading                            | Antes / depois do pré-carregamento dos arquivos registrados       |
| httpServer                            | Antes / depois do servidor HTTP ter iniciado                      |
| aceCommand                            | Antes / depois do comando ace ser executado                       |

## Pré-carregando arquivos

O Ignitor facilita o pré-carregamento de arquivos após o início do servidor HTTP.

Para fazer isso, modifique o arquivo `server.js` e adicione o método `preLoad`:

``` js
new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .preLoad('start/fire-zombies')
  .fireHttpServer()
  .catch(console.error)
```

> O método `preLoad` aceita um caminho raiz do aplicativo relativo ou um caminho absoluto para qualquer arquivo 
> JavaScript.

Para carregar vários arquivos, chame o método `preLoad` várias vezes:

``` js
new Ignitor(require('@adonisjs/fold'))
  .preLoad('')
  .preLoad('')
  // etc
```

## Métodos de ignitor
Abaixo está a lista de métodos disponíveis na instância `ignitor`.

### appRoot(local)
Defina o caminho absoluto para a raiz do aplicativo:

``` js
ignitor
  .appRoot(__dirname)
```

### modulesRoot (local)
Defina o caminho absoluto para o node_modulesdiretório pai do aplicativo.

Por padrão, o caminho definido appRoot()é usado:

``` js
ignitor
  .modulesRoot(path.join(__dirname, '..'))
```

### appFile (local)
Defina o caminho relativo para o arquivo do aplicativo.

Por padrão, o arquivo `start/app.js` é usado:

``` js
ignitor
  .appFile('start/app.js')
```

### loadCommands ()
Instrua o Ignitor a carregar providers e comandos de ace.

Isso é feito ao executar um comando ace, no entanto, você também pode carregar 
comandos ao iniciar o servidor HTTP:

``` js
ignitor
  .loadCommands()
```
