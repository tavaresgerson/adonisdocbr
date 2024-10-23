# Rotas e Controladores

No [último tutorial](/tutorial/getting-started) criamos um novo aplicativo e registramos rotas para renderizar visualizações sem usar controladores.

Renderizar as visualizações simples está bem sem controladores. Para criar aplicativos reais, você precisa lidar com a lógica de domínio e criar visualizações com dados dinâmicos. Neste tutorial, aprenderemos como criar controladores e vinculá-los a rotas.

## Criando Controladores
Os controladores são classes *ES2015* armazenadas na pasta `app/Http/Controllers`. Cada arquivo define um único controlador e você é livre para criar quantos métodos quiser em um único controlador.

Vamos mergulhar rapidamente e criar um novo controlador. Como vamos transformar este aplicativo em um blog, vamos nomear o controlador como *PostController*. Como sempre faremos uso do Ace para criar o controlador para nós.

```bash
./ace make:controller Posts
```

Saída:

```
create: app/Http/Controllers/PostsController.js
```

Criamos o nosso primeiro controlador. Vamos vincular este controlador à rota e renderizar uma visão do controlador em vez disso. Precisamos substituir 'Route.on('/').render('home')' pela seguinte linha de código.

```js
// app/Http/routes.js

Route.get('/', 'PostsController.index')
```

```js
// Final Routes File

const Route = use('Route')

Route.get('/', 'PostsController.index')
Route.on('about').render('about')
Route.on('contact').render('contact')
```

Há um guia completo sobre [Rotas] ( / getting-started / routing ) que você pode consultar. Por enquanto, escreveremos algum código dentro do PostsController para renderizar uma visão.

```js
// app/Http/Controllers/PostsController.js

'use strict'

class PostsController {

  * index (request, response) { <1>
    yield response.sendView('home') <2>
  }

}

module.exports = PostsController
```

1. Criamos um método de controlador chamado "index" que é um método gerador ES2015, tornando simples escrever código assíncrono.
2. Em seguida, utilizamos o método `sendView` para renderizar a *home*.
