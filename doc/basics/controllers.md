# Controllers

Embora os fechamentos possam ser suficientes para lidar com a lógica de rota para aplicativos pequenos, quando seu aplicativo começa 
a crescer, torna-se útil organizar a lógica do aplicativo em outro lugar.

É aqui que os controladores entram em jogo.

Os controladores se conectam a uma ou várias rotas, agrupando a lógica de manipulação de solicitações relacionadas em arquivos únicos e 
são o ponto comum de interação entre seus modelos, visualizações e quaisquer outros serviços que você possa precisar.

> O único trabalho de um controlador é responder a uma solicitação HTTP. Não os use internamente, exigindo-os em arquivos diferentes.

## Criando controladores
Para criar um novo controlador, use o comando `make:controller`:

```
# HTTP Controller
> adonis make:controller User --type http

# WS Controller
> adonis make:controller User --type ws

# Usará uma subpasta de Admin
> adonis make:controller Admin/User
```

Este comando cria um arquivo padrão na pasta `App/Controllers/{TYPE}`:

``` js
'use strict'

class UserController {
  //
}

module.exports = UserController
```

> Use o sinalizador `--resource` para criar um controlador com recursos.

## Usando um controller
Um controller só pode ser acessado a partir de uma rota.

Isso é feito referenciando o controlador como uma string na sua definição de rota:

``` js
Route.get(url, 'UserController.index')
```

A parte antes do ponto é uma referência ao arquivo do controlador (por exemplo `UserController`) e, por padrão, está no 
namespace `App/Controllers/Http`.

A parte após o ponto é o nome do método que você deseja chamar dentro deste controlador (por exemplo index).

Por exemplo

``` js
// app/Controllers/Http/UserController -> index()
Route.get(url, 'UserController.index')

// app/Controllers/Http/Admin/UserController -> store()
Route.post(url, 'Admin/UserController.store')

// app/MyOwnControllers/UserController -> index()
Route.post(url, 'App/MyOwnControllers/UserController.index')
```

Como seus métodos de controlador definidos são manipuladores de rota, eles receberão o [contexto HTTP](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/concept/request-lifecycle.md#contexto-http) como argumento:

``` js
'use strict'

class UserController {
  index ({ request, response }) {
    //
  }
}

module.exports = UserController
```
