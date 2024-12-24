# Rotas e controladores

No [último tutorial](/docs/08-tutorial/01-getting-started.md) criamos um novo aplicativo e registramos rotas para renderizar visualizações sem usar controladores.

Renderizar visualizações simples é bom sem controladores. Para criar aplicativos reais, você precisa lidar com a lógica do domínio e criar visualizações com dados dinâmicos. Neste tutorial, aprenderemos como criar controladores e vinculá-los a rotas.

## Criando controladores
Controladores são classes *ES2015* armazenadas dentro do diretório `app/Http/Controllers`. Cada arquivo define um único controlador, e você é livre para criar quantos métodos quiser em um único controlador.

Vamos mergulhar rapidamente e criar um novo controlador. Como transformaremos este aplicativo em um blog, vamos nomear o controlador *PostsController*. Como sempre, usaremos o ace para criar o controlador para nós.

```bash
./ace make:controller Posts
```

```bash
# Saída

create: app/Http/Controllers/PostsController.js
```

Criamos nosso primeiro controlador. Vamos vincular esse controlador à rota e renderizar uma visualização do controlador. Precisamos substituir `Route.on('/').render('home')` pela linha de código abaixo.

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

Há um guia completo sobre [Routes](/docs/03-getting-started/05-routing.md) que você pode consultar. Por enquanto, escreveremos algum código dentro do PostsController para renderizar uma visualização.

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

1. Criamos um método de controlador chamado `index` que é um método gerador ES2015, simplificando a escrita de código assíncrono.
2. Em seguida, usamos o método `sendView` para renderizar a visualização *home*.
