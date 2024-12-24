# Finalizando

Vamos finalizar este tutorial fazendo as alterações finais em todo o fluxo. Intencionalmente, foi um tutorial simples para que você se sinta confortável com a estrutura.

## Mostrando Post Individual
Temos uma visualização listando todos os posts do blog. Mas não há como visualizar um único post do blog. Então, abra rapidamente o arquivo de rotas e registre uma rota para o mesmo.

```js
// app/Http/routes.js
Route.get('posts/:id', 'PostsController.show')
```

O `id` é um segmento dinâmico para passar o *id do post* na URL e acessá-lo do controlador. Você pode ler mais sobre [Parâmetros de rota](/markdown/03-getting-started/05-routing.md#route-parameters) nos documentos.

Em seguida, precisamos criar a visualização para mostrar um post.

```bash
./ace make:view posts/show
```

```bash
# Output
create: resources/views/posts/show.njk
```

Cole o trecho de código abaixo na visualização showPost.

```twig
<!-- resources/views/posts/show.njk -->
{% extends 'master' %}

{% block content %}
  <div class="post">
    <div>
      <a href="/">  Go Back </a>
    </div>
    <hr>
    <h2>{{ post.title }}</h2>
    <p>{{ post.content }}</p>
  </div>
{% endblock %}
```

Finalmente, precisamos do método `PostsController.show` para buscar a postagem do banco de dados e enviar para sua visualização.

```js
// app/Http/Controllers/PostsController.js
'use strict'

class PostsController {

  * show (request, response) {
    const post = yield Post.find(request.param('id'))
    yield response.sendView('posts.show', { post: post.toJSON() })
  }

}
```

Desta vez, usamos o método `find` para buscar a postagem para um determinado id e, finalmente, enviamos a representação json da postagem para a visualização. Ainda não terminamos. Vamos abrir a visualização *home.njk* e adicionar o link para a postagem individual.

```twig
<!-- resources/views/home.njk -->
<h2><a href="posts/{{ post.id }}"> {{ post.title }} </a></h2>
```

Agora atualize o navegador e clique nas postagens individuais para visualizar uma postagem específica.

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841295/individual-post_anaymc.png)

## Link para adicionar uma nova postagem
Até agora, visitamos a rota `post/create` manualmente para criar uma nova postagem. Vamos adicionar um link na página inicial. Cole o trecho de código abaixo antes da div posts-wrapper.

```html
<!-- resources/views/home.njk -->
<div>
  <p>
    Below is the list of all the awesome posts created by all of us. You can also
    contribute by clicking the below button.
  </p>
  <a href="posts/create" class="btn btn-success btn-block"> Create New Post </a>
  <hr>
</div>
```

Agora, temos um grande botão brilhante vinculado à rota de criação de postagem.

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841278/add-new-post_d1pm4c.png)

## Ordenando postagens
Outra coisa que devemos consertar é listar as postagens em *ordem desc*, para que a postagem recente sempre apareça no topo.

```js
// app/Http/Controllers/PostsController.js
'use strict'

class PostsController {

  * index (request, response) {
    const posts = yield Post.query().orderBy('id', 'desc').fetch()
    yield response.sendView('home', { posts: posts.toJSON() })
  }

}
```

Agora atualize a página e você encontrará a postagem mais recente no topo em vez de na parte inferior.

## Resumo
Na série desses tutoriais, aprendemos muito sobre o framework e as ferramentas oferecidas por ele. Este é apenas o começo, confira a documentação e os livros de receitas para explorar novas e expressivas maneiras de escrever código sustentável.

Certifique-se de nos seguir no [Twitter](https://twitter.com/adonisframework) e estrelar o projeto no [Github](https://github.com/adonisjs/adonis-framework).
