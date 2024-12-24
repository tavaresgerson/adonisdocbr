# Getting Started

This is the first part of the tutorial. By the end of this series, you will find yourself comfortable with the concepts of AdonisJs to create your next ambitious WebApp.

Make sure you have followed the [installation](/markdown/03-getting-started/01-installation.md) process and able to run AdonisJs server to see the welcome page. In this tutorial, we will start by creating a new app and register some routes to render views.

## Creating New Application
We'll make use of the *adonis* executable to create a new application.

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

Above command will create a new project *blog*. Now `cd` into the directory and start the server.

```bash
cd blog
npm run dev
```

```bash
# Output

[nodemon] starting `node --harmony_proxies server.js`
info adonis:framework serving app on http://localhost:3333
```

## Creating Routes
AdonisJs comes with a pre-defined route that renders the *welcome.njk* view. Let's remove this route and start from scratch.

```js
// app/Http/routes.js

'use strict'

const Route = use('Route')

Route.on('/').render('home')
Route.on('/about').render('about')
Route.on('/contact').render('contact')
```

We have registered 3 different routes to render the *home*, *about* and the *contact* page.

## Creating Views
Let's create these three views by typing the below commands on the terminal.

```bash
./ace make:view home
./ace make:view about
./ace make:view contact
```

[Ace](/markdown/07-common-web-tools/01-interactive-shell.md) is a command line utility tool comes with AdonisJs. You can make use of ace commands to generate *views*, *controllers* and *models*, etc.

Views live inside `resources/views` directory and must have `.njk` extension. Let's open the `home.njk` view and write some HTML inside it.

```html
<!-- resources/views/home.njk -->

<h2> This is the home page </h2>
```

Now refresh the browser and you will see the heading we wrote inside the home view.

It is so simple to render nunjucks views in AdonisJs. Let's write some HTML inside all the views and link them together. We will be making use of [Bootstrap](http://v4-alpha.getbootstrap.com/) to design the web pages.

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

The `master.njk` is the base template that we will extend in every view. Now copy and paste the below code inside `home.njk` file.

```twig
<!-- resources/views/home.njk -->

{% extends 'master' %}

{% block content %}
  <h2> Blog posts will be listed here </h2>
{% endblock %}
```

We will also need some *CSS* to make the output look little nicer. So copy and paste the below snippet to `public/style.css` file.

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

Now refresh the browser to see the home page.

### Home Page Preview
![image](http://res.cloudinary.com/adonisjs/image/upload/v1472841283/home-page_uab9il.png)

Let's also complete the other views

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
