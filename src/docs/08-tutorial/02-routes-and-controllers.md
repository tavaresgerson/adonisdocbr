# Routes And Controllers

In the [last tutorial](/tutorial/getting-started) we created a new app and registered routes to render views without making use of Controllers.

Rendering simple views is fine without Controllers. To create real apps, you need to deal with Domain logic and create views with dynamic data. In this tutorial, we will learn how to create controllers and bind them to routes.

## Creating Controllers
Controllers are *ES2015* classes stored inside `app/Http/Controllers` directory. Each file defines a single controller, and you are free to create as many methods as you want on a single controller.

Let's dive in quickly and create a new controller. Since we will turn this app into a blog, let's name the controller *PostsController*. As always we are going to make use of ace to create the controller for us.

```bash
./ace make:controller Posts
```

Output:

```
create: app/Http/Controllers/PostsController.js
```

We have created our first controller. Let's bind this controller to the route and render a view from the controller instead. We need to replace `Route.on('/').render('home')` with the below line of code.

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

There is a complete guide on [Routes](/getting-started/routing) you can reference. For now, we will write some code inside the PostsController to render a view.

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

1. We created a controller method called `index` which is an ES2015 generator method making it simple to write async code.
2. Next we make use of `sendView` method to render the *home* view.
