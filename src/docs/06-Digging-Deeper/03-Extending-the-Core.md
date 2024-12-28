---
title: Extending the Core
category: digging-deeper
---

# Estendendo o Core

O AdonisJs é totalmente extensível ao core.

Neste guia, aprendemos como estender partes do framework.

## Onde escrever código
A maneira mais fácil de começar é usar [ganchos de aplicativos](/original/markdown/02-Concept/05-ignitor.md#hooks), e somente depois mover o código para dentro de um provedor se você quiser compartilhar seu código como um pacote.

Os ganchos ficam dentro do arquivo `start/hooks.js` e podem ser usados ​​para executar código em um momento específico no ciclo de vida do aplicativo:

```js
// .start/hooks.js

const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  // execute your code
})
```

> OBSERVAÇÃO: Os retornos de chamada de gancho são síncronos. Você deve criar um provedor e usar o método `boot` para escrever código assíncrono.

Os provedores vivem dentro do diretório `providers` na raiz do projeto:

```bash
├── providers
  ├── AppProvider.js
```

Seus provedores devem ser registrados dentro do arquivo `start/app.js`:

```js
// .start/app.js

const path = require('path')

const providers = [
  path.join(__dirname, '..', 'providers/AppProvider')
]
```

Os provedores são geralmente usados ​​para adicionar funcionalidade ao seu aplicativo vinculando namespaces ao contêiner IoC, no entanto, você também pode usar provedores para executar código personalizado quando inicializado:

```js
const { ServiceProvider } = require('@adonisjs/fold')

class AppProvider extends ServiceProvider {
  async boot () {
    // execute code
  }
}
```

## Adicionando macros/getters
As macros permitem que você adicione métodos a classes existentes.

Uma classe deve estender a classe [Macroable](https://www.npmjs.com/package/macroable) para ser estendida por meio de macros.

> DICA: Use [hooks](/original/markdown/02-Concept/05-ignitor.md#hooks) ou o método `boot` de um provedor para adicionar macros.

Por exemplo, se uma macro fosse definida assim:

```js
const Response = use('Adonis/Src/Response')
const Request = use('Adonis/Src/Request')

Response.macro('sendStatus', function (status) {
  this.status(status).send(status)
})
```

Ela poderia então ser usada da seguinte forma:

```js
Route.get('/', ({ response }) => {
  response.sendStatus(200)
})
```

Da mesma forma, você também pode adicionar `getters` às suas classes macroáveis:

```js
Request.getter('time', function () {
  return new Date().getTime()
})

// Or add a singleton getter
Request.getter('id', function () {
  return uuid.v4()
}, true)
```

Abaixo está a lista de classes às quais você pode adicionar getters/macros:

1. [Adonis/Src/HttpContext](https://github.com/adonisjs/adonis-framework/blob/develop/src/Context/index.js)
2. [Adonis/Src/Request](https://github.com/adonisjs/adonis-framework/blob/develop/src/Request/index.js)
3. [Adonis/Src/Response](https://github.com/adonisjs/adonis-framework/blob/develop/src/Response/index.js)
4. [Adonis/Src/Route](https://github.com/adonisjs/adonis-framework/blob/develop/src/Route/index.js)

## Provedores de extensão
Alguns provedores existentes permitem que você os estenda adicionando novas funcionalidades.

Por exemplo, o **Provedor de sessão** permite que novos drivers sejam adicionados, enquanto o **Provedor de autenticação** permite novos serializadores e esquemas.

> NOTA: consulte a documentação de provedores individuais para entender seus recursos de extensão.

Para manter a interface de extensão unificada e simples, use o método `Ioc.extend` para adicionar novos drivers ou serializadores:

```js
const { ioc } = require('@adonisjs/fold')
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  ioc.extend('Adonis/Src/Session', 'mongo', function () {
    return class MongoDriver {
    }
  })
})
```

Se você estiver desenvolvendo um provedor e quiser usar a mesma interface para expor recursos de extensão, certifique-se de vincular um objeto `Manager` da seguinte forma:

```js
const { ServiceProvider } = require('@adonisjs/fold')

class MyProvider extends ServiceProvider {
  register () {
    this.app.manager('MyApp/Provider', {
      extend: function () {
      }
    })
  }
}
```

1. O objeto do gerenciador deve ter um método `extend`. Os valores passados ​​para `ioc.extend` serão encaminhados para este método.
2. O `namespace` deve ser o mesmo que o namespace de vinculação.
3. Você deve gerenciar o registro/ciclo de vida de seus drivers.
