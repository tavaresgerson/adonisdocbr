# Listing Blog Posts

In this tutorial, we will continue the topic of [Database Models](/tutorial/03-database-models) by using them inside *PostController*. Make sure your server is up and running on http://localhost:3333.

## Fetching Blog Posts
Quickly open the *PostController* file and paste the following snippet into it.

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

We have made few changes to the existing controller file.

1. Here we import the previously created *Post* model.
2. Next we call the `all` method on the model to fetch all the posts.
3. Finally, we pass the posts to our home view.

Replace everything inside your view with the below code snippet.

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

1. We make use of the templating engine `for` loop to iterate over the list of posts.
2. Here we display the post title and content.

If you refresh the page, you will see nothing on the screen since there are *no posts* inside our database. Before we add them, let's show a message on the web page if there are no posts.

Just before the {% endfor %} tag add the below snippet.

```twig
{# resources/views/home.njk #}

{% else %}
  <h2> No posts found </h2>
```

So it will be

```twig
{% for post in posts %}
    .....
{% else %}
  <h2> No posts found </h2>
{% endfor %}
```

## Seeds And Factories

Before we implement the logic of adding new posts, we need some dummy posts. You can create new posts by running SQL queries inside your database interface, but that will defeat the whole purpose of rapid development and re-usability.

There are plenty of use cases for [Database Factories](/database/seeds-and-factories) and [Seeds](/database/seeds-and-factories), but for now, we will use them to create some dummy blog posts.

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

Factories let you define blueprints for your models. Each blueprint takes the model name as the first parameter and a callback as the second parameter. Callback get's access to the [chancejs](http://chancejs.com/) instance, which is used to generate random data.

Next, we need to make use of the defined blueprint inside the `database/seeds/Database.js` file.

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

1. Here we make use of the blueprint and create five posts using the `create` method.

Finally, we need to seed this file by running an ace command.

```bash
./ace db:seed
```

Output:

```
✔ seeded database successfully
```

## Final Enhancements
Now refresh the browser and you will see all the newly created posts. At last, we are going to make some enhancements to the posts list.

```twig
{# resources/views/home.njk #}

{{ post.content | truncate(150) }} <1>
```

1. Here we use the `truncate` filter on the post content by limit the characters count to 150.

```css
/* public/style.css */

.post {
  margin-top: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
}
```

### Posts List Preview

![image](http://res.cloudinary.com/adonisjs/image/upload/v1472841292/posts-list_wkpogd.png)
