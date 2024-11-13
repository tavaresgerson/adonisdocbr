# Finalizando

Vamos terminar este tutorial fazendo as alterações finais no fluxo inteiro. Intencionalmente, foi um tutorial simples para que você se sinta confortável com o framework.

## Mostrando Publicação Individual
Temos uma visão listando todos os posts do blog. Mas não há como visualizar um único post. Então abra rapidamente o arquivo de rotas e registre uma rota para isso.

```js
// app/Http/routes.js

Route.get('posts/:id', 'PostsController.show')
```

O `id` é um segmento dinâmico para passar o *ID do post* na URL e acessá-lo no controlador. Você pode ler mais sobre [Parâmetros de rota](/getting-started/routing) na documentação.

Em seguida, precisamos criar a visualização para mostrar uma publicação.

```bash
./ace make:view posts/show
```

Saída:

```
create: resources/views/posts/show.njk
```


Cole o trecho de código abaixo na visualização do postagem.

```twig
{# resources/views/posts/show.njk #}

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

Finalmente, precisamos do método `PostsController.show` para buscar o post do banco de dados e enviá-lo à visão.

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

Desta vez, utilizamos o método `find` para buscar a publicação para um determinado id e, finalmente, enviamos a representação json da publicação para a visualização. Ainda não terminamos. Vamos abrir a visualização *home.njk* e adicionar o link para a publicação individual.

```twig
{# resources/views/home.njk #}

<h2><a href="posts/{{ post.id }}"> {{ post.title }} </a></h2>
```

Agora atualize o navegador e clique em cada postagem para visualizar uma postagem específica.

![imagem](/docs/assets/individual-post_anaymc.png)

## Link para adicionar um novo post
Até agora, visitamos manualmente a rota 'post/create' para criar um novo post. Vamos adicionar um link na página inicial. Cole o trecho de código abaixo logo antes da divisão posts-wrapper.

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

Agora temos um grande botão brilhante que está vinculado à rota de criação do post.

![Imagem](/docs/assets/add-new-post_d1pm4c.png)

## Ordenando os posts
Outra coisa que devemos consertar é listar os posts em ordem *desc*, para que o post mais recente sempre apareça no topo.

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

Agora atualize a página e você encontrará o último post no topo em vez do fundo.

## Resumo
Na série desses tutoriais, aprendemos muito sobre o framework e as ferramentas oferecidas por ele. Isso é apenas o começo, confira a documentação e os livros de receitas para explorar novas e expressivas maneiras de escrever código mantível.

Certifique-se de nos seguir em [Twitter](https://twitter.com/adonisframework) e estrela o projeto no [Github](https://github.com/adonisjs/adonis-framework).
