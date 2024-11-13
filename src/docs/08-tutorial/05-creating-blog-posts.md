# Criando Artigos de Blog

No último [tutorial](/tutorial/04-list-blog-posts) nós exibimos a lista de postagens do blog, buscando-as diretamente do banco de dados. Agora vamos dar um passo à frente e adicionar a funcionalidade de criação de postagens.

Desta vez, exploraremos muitos recursos interessantes do AdonisJs incluindo o Form Builder e o Expressive [Validator].

## Criando Rotas e Visualizações
Registre rapidamente um par de novas rotas dentro do arquivo de rotas.

```js
// app/Http/routes.js

Route.get('posts/create', 'PostsController.create')
Route.post('posts', 'PostsController.store')
```

Registramos duas rotas. Uma é para mostrar o formulário de criação do post e a outra é para lidar com os dados *POST* do formulário enviado.

Vamos criar os métodos `create` e `store` no controlador existente de Postagens.

```js
// app/Http/Controllers/PostsController.js

'use strict'

class PostsController {

  * create (request, response) {
    yield response.sendView('posts.create')
  }

  * store (request, response) {
    // ...
  }

}

module.exports = PostsController
```

Finalmente, precisamos criar a visão usando o comando ace.

```bash
./ace make:view posts/create
```

Saída:

```
create: resources/views/posts/create.njk
```

## Formulário de construção
Nós utilizaremos o [Formulário de Criação de Conteúdo](' /views/form-builder') para configurar o formulário para criar um novo post.


```twig
{# resources/views/posts/create.njk #}

{% extends 'master' %}

{% block content %}
  {{ form.open({action: 'PostsController.store'}) }}

    {{ csrfField }}

    <fieldset class="form-group">
      {{ form.label('Post Title') }}
      {{ form.text('title', null, { class: 'form-control' }) }}
    </fieldset>

    <fieldset class="form-group">
      {{ form.label('Description') }}
      {{ form.textarea('content', null, { class: 'form-control' }) }}
    </fieldset>

    {{ form.submit('Publish', 'publish', { class: 'btn btn-primary btn-block' }) }}

  {{ form.close() }}
{% endblock %}
```

Quanta coisa para cobrir aqui. O construtor de formulários fornece alguns métodos convenientes para criar formulários HTML.

1. O `form.open` cria a tag de formulário. Aqui, usamos a propriedade *action* para definir o método do controlador para lidar com a solicitação POST. A ação e o método do formulário serão preenchidos automaticamente para você.
2. Todos os formulários são protegidos por [proteção CSRF](/segurança/proteção-csrf). Então precisamos definir o *csrfField* para garantir que possamos enviar formulários sem nenhuma restrição.
3. Tudo o mais faz parte da API padrão do Formulário para criar os campos de entrada e o botão Enviar.

Visite [http://localhost:3333/posts/create](http://localhost:3333/posts/create) e você verá um formulário bonito para criar os posts.

![Imagem](/docs/assets/create-posts_xgghpo.png)

## Validação de entradas de formulário
Validar entrada do usuário é tão importante quanto você nunca pode confiar nos dados fornecidos para você. O AdonisJS tem um validador bonito para tornar esta tarefa muito mais fácil para você.

[Validator](/common-web-tools/validator) não faz parte da instalação básica, o que significa que precisamos puxá-lo do npm.

```bash
npm i --save adonis-validation-provider
```

Em seguida, precisamos registrar o provedor e criar um apelido. Não se preocupe se você não entender completamente os provedores. Isso não é algo que você deve saber desde o primeiro dia.

```js
// bootstrap/app.js

const providers = [
  // ...
  'adonis-validation-provider/providers/ValidatorProvider'
  // ...
]
```

```js
// bootstrap/app.js

const aliases = {
  // ...
  Validator: 'Adonis/Addons/Validator'
  // ...
}
```

Isso é tudo o que é necessário na frente de configuração. Agora vamos validar a entrada do formulário dentro do *PostsController*.

```js
// app/Http/Controllers/PostsController.js

const Validator = use('Validator')

class PostsController {

  * store (request, response) {
    const postData = request.only('title', 'content') <1>

    const rules = {
      title: 'required',
      content: 'required'
    }

    const validation = yield Validator.validate(postData, rules) <2>

    if (validation.fails()) {
      yield request
        .withOnly('title', 'content')
        .andWith({ errors: validation.messages() })
        .flash() <3>

      response.redirect('back')
      return
    }

    yield Post.create(postData) <4>
    response.redirect('/')
  }


}

module.exports = PostsController
```

1. O método `request.only` buscará os valores das chaves definidas.
2. Aqui validamos a entrada do usuário com as regras definidas usando o método "validate".
Se a validação falhar, redirecionamos o usuário de volta e exibimos a mensagem de erro junto com os valores originais para "título" e "conteúdo".
4. Se a validação passar, criamos o post usando o método `Post.create`.

Em seguida, precisamos fazer algumas modificações dentro do nosso arquivo *create.njk* para mostrar os erros retornados como mensagens de flash.


Insira o seguinte trecho de código logo antes da tag `form.open`.

```twig
{# resources/views/posts/create.njk #}

{% if old('errors') %}
  <div class="alert alert-danger">
    {% for error in old('errors') %}
      <li> {{ error.message }} </li>
    {% endfor %}
  </div>
{% endif %}
```

O método `old` é usado para buscar o valor de uma determinada chave dos mensagens flash. Aqui precisamos buscar a chave "errors" para obter os erros enviados pelo Controlador.

Vamos atualizar a página e tentar criar um novo post com título vazio e conteúdo vazio.

Não foi possível carregar a imagem.

Uau, isso é divertido. Nós temos um formulário funcional com validação super fácil e tratamento de erros no lugar.
