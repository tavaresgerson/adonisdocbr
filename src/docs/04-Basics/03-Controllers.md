# Controladores

Embora os fechamentos possam ser suficientes para lidar com a lógica de rota para aplicativos pequenos, quando seu aplicativo começa a crescer, torna-se útil organizar a lógica do aplicativo em outro lugar.

É aqui que os controladores entram em cena.

Os controladores se conectam a uma ou muitas rotas, agrupando a lógica de tratamento de solicitação relacionada em arquivos únicos e são o ponto comum de interação entre seus modelos, visualizações e quaisquer outros serviços que você possa precisar.

::: warning OBSERVAÇÃO
A única função de um controlador é responder a uma solicitação HTTP. Não os use internamente, exigindo-os dentro de arquivos diferentes.
:::

## Criando controladores

Para criar um novo controlador, use o comando `make:controller`:

```bash
# HTTP Controller
> adonis make:controller User --type http

# WS Controller
> adonis make:controller User --type ws

# Usará uma subpasta Admin
> adonis make:controller Admin/User
```

Este comando cria um arquivo boilerplate na pasta `App/Controllers/{TYPE}`:

```js
// .app/Controllers/Http/UserController.js

'use strict'

class UserController {
  //
}

module.exports = UserController
```

::: tip DICA
Use o sinalizador `--resource` para criar um controlador com recursos.
:::

## Usando um controlador

Um controlador só pode ser acessado de uma rota.

Isso é feito referenciando o controlador como uma **string** na sua definição de rota:

```js
// .app/routes.js

Route.get(url, 'UserController.index')
```

A parte antes do ponto é uma referência ao arquivo do controlador (por exemplo, `UserController`) e é, por padrão, namespaced para `App/Controllers/Http`.

A parte depois do ponto é o nome do método que você deseja chamar dentro deste controlador (por exemplo, `index`).

Por exemplo:

```js
// .app/routes.js

// app/Controllers/Http/UserController -> index()
Route.get(url, 'UserController.index')

// app/Controllers/Http/Admin/UserController -> store()
Route.post(url, 'Admin/UserController.store')

// app/MyOwnControllers/UserController -> index()
Route.post(url, 'App/MyOwnControllers/UserController.index')
```

Como seus métodos de controlador definidos são manipuladores de rota, eles receberão o [Contexto HTTP](/docs/02-Concept/01-Request-Lifecycle.md#http-context) como um argumento:

```js
// .app/Controllers/Http/UserController.js

'use strict'

class UserController {
  index ({ request, response }) {
    //
  }
}

module.exports = UserController
```
