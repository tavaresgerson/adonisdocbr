# Estendendo o core

AdonisJs é totalmente extensível ao núcleo.

Neste guia, aprendemos como estender partes da estrutura.

## Onde escrever código
A maneira mais fácil de começar é usar ganchos de aplicativos e, posteriormente, mover o código para dentro de um provedor, 
se você quiser compartilhar seu código como um pacote.

Os ganchos vivem dentro do arquivo `start/hooks.js` e podem ser usados para executar o código em um horário específico no ciclo 
de vida do aplicativo:

``` js
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  // executa seu código
})
```

> Os retornos de chamada do gancho são síncronos. Você deve criar um provedor e usar o 
> método `boot` para escrever código assíncrono.

Os provedores vivem dentro do diretório `providers` na raiz do projeto:

```
├── providers
  ├── AppProvider.js
```

Seus provedores devem estar registrados dentro do arquivo `start/app.js`:

``` js
const path = require('path')

const providers = [
  path.join(__dirname, '..', 'providers/AppProvider')
]
```

Os provedores geralmente são usados para adicionar funcionalidades ao seu aplicativo, vinculando espaços de nome ao 
contêiner de IoC; no entanto, você também pode usar os provedores para executar código personalizado quando inicializado:

``` js
const { ServiceProvider } = require('@adonisjs/fold')

class AppProvider extends ServiceProvider {
  async boot () {
    // executa o código
  }
}
```

## Adicionando macros/getters

As macros permitem adicionar métodos às classes existentes.

Uma classe deve estender a classe [`Macroable`](https://www.npmjs.com/package/macroable) a ser estendida através de macros.

> Use ganchos ou o método `boot` de um provedor para adicionar macros.

Por exemplo, se uma macro foi definida assim:

``` js
const Response = use('Adonis/Src/Response')
const Request = use('Adonis/Src/Request')

Response.macro('sendStatus', function (status) {
  this.status(status).send(status)
})
```

Poderia então ser usado da seguinte maneira:

``` js
Route.get('/', ({ response }) => {
  response.sendStatus(200)
})
```

Da mesma forma, você também pode adicionar getters às suas classes de `macroable`:

``` js
Request.getter('time', function () {
  return new Date().getTime()
})

// Ou adicionar um getter singleton
Request.getter('id', function () {
  return uuid.v4()
}, true)
```

Abaixo está a lista de classes às quais você pode adicionar getters/macros:

# [Adonis/Src/HttpContext](https://github.com/adonisjs/adonis-framework/blob/develop/src/Context/index.js)
# [Adonis/Src/Pedido](https://github.com/adonisjs/adonis-framework/blob/develop/src/Request/index.js)
# [Adonis/Src/Resposta](https://github.com/adonisjs/adonis-framework/blob/develop/src/Response/index.js)
# [Adonis/Src/Rota](https://github.com/adonisjs/adonis-framework/blob/develop/src/Route/index.js)

## Provedores de extensão

Alguns provedores existentes permitem que você os estenda adicionando novas funcionalidades.

Por exemplo, o provedor de sessão permite que novos drivers sejam adicionados, enquanto o provedor de autenticação 
permite novos serializadores e esquemas.

> Consulte a documentação de fornecedores individuais para entender seus recursos de extensão.

Para manter a interface estendida unificada e simples, use o método `Ioc.extend` para adicionar novos 
drivers ou serializadores:

``` js
const { ioc } = require('@adonisjs/fold')
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  ioc.extend('Adonis/Src/Session', 'mongo', function () {
    return class MongoDriver {
    }
  })
})
```

Se você estiver desenvolvendo um provedor e quiser usar a mesma interface para expor os recursos de extensão, 
certifique-se de vincular um objeto `Manager` da seguinte maneira:

``` js
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
