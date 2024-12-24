# Criando Posts de Blog

No último [tutorial](/markdown/08-tutorial/04-list-blog-posts.md) exibimos a lista de posts de blog buscando-os no banco de dados. Agora vamos dar um passo à frente e adicionar a funcionalidade de criação de posts.

Desta vez, vamos explorar muitos recursos interessantes do AdonisJs, incluindo o Form Builder e o expressivo [Validator](/markdown/07-common-web-tools/11-validator.md).

## Criando Rotas e Visualizações
Registre rapidamente algumas novas rotas dentro do arquivo de rotas.

```js
// app/Http/routes.js
Route.get('posts/create', 'PostsController.create')
Route.post('posts', 'PostsController.store')
```

Registramos duas rotas. Uma é para mostrar o formulário para criar o post, e a outra é para manipular os dados *POST* do formulário enviado.

Vamos criar os métodos `create` e `store` no PostsController existente.

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

Finalmente, precisamos criar a visualização usando o comando ace.

```bash
./ace make:view posts/create
```

```bash
# Output
create: resources/views/posts/create.njk
```

## Form Builder
Usaremos o [Form Builder](/markdown/04-views/03-form-builder.md) para configurar o formulário para criar uma nova postagem.

```twig
<!-- resources/views/posts/create.njk -->
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

Há bastante coisa para abordar aqui. O Form Builder fornece alguns métodos convenientes para criar formulários HTML.

1. O `form.open` cria a tag do formulário. Aqui usamos a propriedade *action* para definir o método do controlador para manipular a solicitação POST. A ação do formulário e o método serão preenchidos automaticamente para você.

2. Todos os formulários são protegidos por [proteção CSRF](/markdown/09-security/03-csrf-protection.md). Então precisamos definir o *csrfField* para garantir que podemos enviar formulários sem nenhuma restrição.

3. Todo o resto é parte da API padrão do Form Builder para criar os campos de entrada e o botão de envio.

Visite [http://localhost:3333/posts/create](http://localhost:3333/posts/create) e você verá um formulário bonito para criar as postagens.

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841279/create-posts_xgghpo.png)

## Validando entradas de formulário
Validar a entrada do usuário é muito importante, pois você nunca pode confiar nos dados fornecidos a você. O AdonisJs tem um validador bonito para tornar essa tarefa muito mais fácil para você.

link:validator[Validator] não faz parte da instalação base, o que significa que precisamos retirá-lo do npm.

```bash
npm i --save adonis-validation-provider
```

Em seguida, precisamos registrar o provedor e criar um alias. Não se preocupe se você não entender os provedores completamente. Não é algo que você deve saber desde o primeiro dia.

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

Isso é tudo necessário na frente da configuração. Agora vamos validar a entrada do formulário dentro de *PostsController*.

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
2. Aqui validamos a entrada do usuário com as regras definidas usando o método `validate`.
3. Se a validação falhar, redirecionamos o usuário de volta e exibimos a *mensagem de erro* junto com os valores originais para `title` e `content`.
4. Se a validação for aprovada, criamos a postagem usando o método `Post.create`.

Em seguida, precisamos fazer algumas modificações dentro da nossa visualização *create.njk* para mostrar os erros retornados como mensagens flash.

Insira o trecho de código abaixo antes da tag `form.open`.

```twig
<!-- resources/views/posts/create.njk -->

{% if old('errors') %}
  <div class="alert alert-danger">
    {% for error in old('errors') %}
      <li> {{ error.message }} </li>
    {% endfor %}
  </div>
{% endif %}
```

O método `old` é usado para buscar valor para uma determinada chave de mensagens flash. Aqui, precisamos extrair a chave de erros para obter os erros enviados do Controlador.

Vamos atualizar a página e tentar criar uma nova postagem com título e conteúdo vazios.

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841283/validation-failed_dz2d79.png)

Uau, isso é divertido. Temos um formulário funcional com validação super fácil e tratamento de erros no local.
