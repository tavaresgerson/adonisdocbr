# Introdução

Esta é a primeira parte do tutorial. No final desta série, você se sentirá confortável com os conceitos de AdonisJs para criar seu próximo aplicativo ambicioso da web.

Certifique-se de ter seguido o processo de instalação e conseguido executar o servidor Adonis para ver a página inicial. Neste tutorial, começaremos criando um novo aplicativo e registrando algumas rotas para renderizar as visualizações.

## Criando um novo aplicativo
Nós utilizaremos o executável *adonis* para criar uma nova aplicação.

```bash
adonis new blog
```

Saída:

```
Cloning into 'blog'...
cleaning project
setting up app key
Fixing ace file
installing dependencies may take a while
installing dependencies....
```

Acima comando irá criar um novo projeto *blog*. Agora `cd` na pasta e inicie o servidor.

```bash
cd blog
npm run dev
```

Saída:

```
[nodemon] starting `node --harmony_proxies server.js`
info adonis:framework serving app on http://localhost:3333
```

## Criando Rotas
AdonisJS vem com uma rota pré-definida que renderiza o arquivo *welcome.njk*. Vamos remover essa rota e começar do zero.

```js
// app/Http/routes.js

'use strict'

const Route = use('Route')

Route.on('/').render('home')
Route.on('/about').render('about')
Route.on('/contact').render('contact')
```

Registramos 3 rotas diferentes para renderizar as páginas *home*, *sobre* e *contato*.

## Criando Visualizações
Vamos criar estas três visualizações digitando os seguintes comandos no terminal.

```bash
./ace make:view home
./ace make:view about
./ace make:view contact
```

link:interactive-shell[Ace] é uma ferramenta de utilitário de linha de comando que vem com o AdonisJs. Você pode usar os comandos do Ace para gerar *visualizações*, *controladores* e *modelos*, etc.

As views vivem dentro do diretório `recursos/visualizações` e devem ter a extensão `.njk`. Vamos abrir a visualização `home.njk` e escrever algum HTML dentro dela.

```html
<!-- resources/views/home.njk -->

<h2> This is the home page </h2>
```

Agora atualize o navegador e você verá o cabeçalho que escrevemos dentro da visualização inicial.

É tão simples renderizar as visualizações do nunjucks no AdonisJs. Vamos escrever algum HTML em todas as visualizações e vinculá-las juntas. Nós vamos usar link:http://v4-alpha.getbootstrap.com/[Bootstrap, window="_blank"] para projetar as páginas da web.

```twig
{# resources/views/master.njk #}

<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.rawgit.com/twbs/bootstrap/v4-dev/dist/css/bootstrap.css">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="container">

    <div class="header clearfix">
      <nav>
        <ul class="nav nav-pills pull-xs-right">
          <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
          <li class="nav-item"><a href="/about" class="nav-link">About</a></li>
          <li class="nav-item"><a href="/contact" class="nav-link">Contact</a></li>
        </ul>
        <h3 class="text-muted"> Adonis Blog </h3>
      </nav>
    </div>

    <section>
      {% block content %}{% endblock %}
    </section>

  </div>
</body>
</html>
```

O `master.njk` é o modelo base que vamos estender em cada visualização. Agora copie e cole o código abaixo no arquivo `home.njk`.

```twig
{# resources/views/home.njk #}

{% extends 'master' %}

{% block content %}
  <h2> Blog posts will be listed here </h2>
{% endblock %}
```

Também precisaremos de algum *CSS* para deixar a saída um pouco mais bonita. Então copie e cole o trecho abaixo no arquivo "public/style.css".

```css
/* public/style.css */

body {
  background: #ffffff;
}

.header {
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-bottom: .05rem solid #e5e5e5;
}

@media (min-width: 48em) {
  .container {
    max-width: 46rem;
  }
}

.header h3 {
  margin-top: 0;
  margin-bottom: 0;
  line-height: 3rem;
}
```

Agora atualize o navegador para ver a página inicial.

### Página inicial em pré-visualização

![Imagem](/docs/assets/home-page_uab9il.png)

Vamos também completar as outras visualizações

```twig
{# resources/views/about.njk #}

{% extends 'master' %}

{% block content %}
  <h2> This is the about page </h2>
{% endblock %}
```

```twig
{# resources/views/contact.njk #}

{% extends 'master' %}

{% block content %}
  <h2> This is the contact page </h2>
{% endblock %}
```
