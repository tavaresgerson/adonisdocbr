# Lista de Postagens do Blog

Neste tutorial, continuaremos o tópico de [Modelos de Banco de Dados](/tutorial/03-modelo-de-banco-de-dados) usando-os dentro do *PostController*. Certifique-se de que seu servidor esteja em execução na URL http://localhost:3333.

## Buscando Artigos do Blog
Abra rapidamente o arquivo *PostController* e cole o seguinte trecho nele.

```js
// app/Http/Controllers/PostController.js

'use strict'

const Post = use('App/Model/Post') <1>

class PostController {

  * index (request, response) {
    const posts = yield Post.all() <2>
    yield response.sendView('home', { posts: posts.toJSON() }) <3>
  }

}

module.exports = PostController
```

Fizemos poucas alterações no arquivo de controlador existente.

1. Aqui nós importamos o modelo *Post* criado anteriormente.
2. Em seguida chamamos o método `all` no modelo para buscar todos os posts.
3. Finalmente, passamos as postagens para nossa página inicial.

Substitua tudo dentro da sua visão pelo seguinte trecho de código.

```twig
{# resources/views/home.njk #}

{% extends 'master' %}

{% block content %}
  <div class="posts-wrapper">
    {% for post in posts %} <1>
      <div class="post">
        <h2><a href=""> {{ post.title }} </a></h2> <2>
        <p> {{ post.content }} </p>
      </div>
    {% endfor %}
  </div>
{% endblock %}
```

1. Nós fazemos uso do mecanismo de modelo "for" para iterar sobre a lista de postagens.
2. Aqui exibimos o título e o conteúdo da publicação.

Se você atualizar a página, não verá nada na tela porque não há *nenhum post* dentro do nosso banco de dados. Antes de adicionarmos os posts, vamos mostrar uma mensagem na página da internet se não houver nenhum post.

Justo antes da tag {% endfor %} adicione o seguinte trecho.

```twig
{# resources/views/home.njk #}

{% else %}
  <h2> No posts found </h2>
```

Então será

```twig
{% for post in posts %}
    .....
{% else %}
  <h2> No posts found </h2>
{% endfor %}
```

## Sementes e Fábricas

Antes de implementar a lógica da adição de novos posts, precisamos alguns posts de teste. Você pode criar novos posts executando consultas SQL dentro da sua interface de banco de dados, mas isso irá desfazer todo o propósito do desenvolvimento rápido e reutilização.

Existem muitos casos de uso para [Fábricas de Banco de Dados](/banco-de-dados/fábricas-e-sementes) e [Sementes](/banco-de-dados/fábricas-e-sementes), mas, por enquanto, usaremos eles para criar alguns posts de blog falsos.

```js
// database/factory.js

'use strict'

const Factory = use('Factory')

Factory.blueprint('App/Model/Post', (fake) => {
  return {
    title: fake.sentence(),
    content: fake.paragraph()
  }
})
```

Fábricas permitem que você defina modelos para seus dados. Cada fábrica recebe o nome do modelo como o primeiro parâmetro e uma função de retorno de chamada como o segundo parâmetro. A função de retorno de chamada tem acesso à instância chancejs, que é usada para gerar dados aleatórios.

Em seguida, precisamos usar o modelo definido dentro do arquivo `database/seeds/Database.js`.

```js
// database/seeds/Database.js

'use strict'

const Factory = use('Factory')

class DatabaseSeeder {

  * run () {
    yield Factory.model('App/Model/Post').create(5) <1>
  }

}

module.exports = DatabaseSeeder
```

1. Aqui usamos o modelo e criamos cinco postagens usando o método `create`.

Finalmente, precisamos semear este arquivo executando um comando do Ace.

```bash
./ace db:seed
```

Saída:

```
✔ seeded database successfully
```

## Finalizações Finais
Agora atualize o navegador e você verá todos os novos artigos criados. Por fim, faremos algumas melhorias na lista de artigos.

```twig
{# resources/views/home.njk #}

{{ post.content | truncate(150) }} <1>
```

1. Aqui utilizamos o filtro "truncate" no conteúdo do post, limitando a contagem de caracteres a 150.

```css
/* public/style.css */

.post {
  margin-top: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
}
```

### Lista de postagens em destaque

![imagem](/docs/assets/posts-list_wkpogd.png)
