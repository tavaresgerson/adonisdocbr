# Introdução

Esta é a primeira parte do tutorial. Ao final desta série, você se sentirá confortável com os conceitos do AdonisJs para criar seu próximo WebApp ambicioso.

Certifique-se de ter seguido o processo de [instalação](/markdown/03-getting-started/01-installation.md) e de ter executado o servidor AdonisJs para ver a página de boas-vindas. Neste tutorial, começaremos criando um novo aplicativo e registrando algumas rotas para renderizar visualizações.

## Criando um novo aplicativo
Faremos uso do executável *adonis* para criar um novo aplicativo.

```bash
adonis new blog
```

```bash
# Output

Cloning into 'blog'...
cleaning project
setting up app key
Fixing ace file
installing dependencies may take a while
installing dependencies....
```

O comando acima criará um novo projeto *blog*. Agora, `cd` no diretório e inicie o servidor.

```bash
cd blog
npm run dev
```

```bash
# Output

[nodemon] starting `node --harmony_proxies server.js`
info adonis:framework serving app on http://localhost:3333
```

## Criando rotas
O AdonisJs vem com uma rota predefinida que renderiza a visualização *welcome.njk*. Vamos remover essa rota e começar do zero.

```js
// app/Http/routes.js

'use strict'

const Route = use('Route')

Route.on('/').render('home')
Route.on('/about').render('about')
Route.on('/contact').render('contact')
```

Registramos 3 rotas diferentes para renderizar as páginas *home*, *about* e *contact*.

## Criando visualizações
Vamos criar essas três visualizações digitando os comandos abaixo no terminal.

```bash
./ace make:view home
./ace make:view about
./ace make:view contact
```

[Ace](/markdown/07-common-web-tools/01-interactive-shell.md) é uma ferramenta de utilitário de linha de comando que vem com o AdonisJs. Você pode usar os comandos ace para gerar *views*, *controllers* e *models*, etc.

Views ficam dentro do diretório `resources/views` e devem ter a extensão `.njk`. Vamos abrir a view `home.njk` e escrever algum HTML dentro dela.

```html
<!-- resources/views/home.njk -->

<h2> This is the home page </h2>
```

Agora atualize o navegador e você verá o título que escrevemos dentro da view home.

É muito simples renderizar as views nunjucks no AdonisJs. Vamos escrever algum HTML dentro de todas as views e vinculá-las. Usaremos o [Bootstrap](http://v4-alpha.getbootstrap.com/) para projetar as páginas da web.

```twig
<!-- resources/views/master.njk -->

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

O `master.njk` é o modelo base que estenderemos em cada view. Agora copie e cole o código abaixo dentro do arquivo `home.njk`.

```twig
<!-- resources/views/home.njk -->

{% extends 'master' %}

{% block content %}
  <h2> Blog posts will be listed here </h2>
{% endblock %}
```

Também precisaremos de algum *CSS* para fazer a saída parecer um pouco melhor. Então copie e cole o snippet abaixo no arquivo `public/style.css`.

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

### Visualização da página inicial
![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1472841283/home-page_uab9il.png)

Vamos também completar as outras visualizações

```twig
<!-- resources/views/about.njk -->

{% extends 'master' %}

{% block content %}
  <h2> This is the about page </h2>
{% endblock %}
```

```twig
<!-- resources/views/contact.njk -->

{% extends 'master' %}

{% block content %}
  <h2> This is the contact page </h2>
{% endblock %}
```
