---
title: Views
category: basics
---

# Views

AdonisJs uses [Edge](http://edge.adonisjs.com/) as its templating engine, which is blazingly fast and comes with an elegant API to create dynamic views.

Under the hood, Edge supports:

1. Layouts & partials
2. Components
3. Runtime debugging using chrome dev tools
4. Logical tags and everything in between

## Basic example
Let's start with the classic **Hello World** example by rendering an edge template.

> NOTE: Make sure that the AdonisJs `ViewProvider` is registered as a provider inside your `start/app.js` file.

```js
// .start/app.js

const providers = [
  '@adonisjs/framework/providers/ViewProvider'
]
```

All views are stored in the `resources/views` directory and end with the `.edge` extension.

Use the `adonis` command to create the view:

```bash
adonis make:view hello-world
```

```bash
# .make:view output

✔ create  resources/views/hello-world.edge
```

Open `hello-world.edge` and save its contents as:

```text
<h1>Hello World!</h1>
```

Now, create a route to render the `hello-world.edge` view:


```js
// .start/routes.js

Route.get('hello-world', ({ view }) => {
  return view.render('hello-world')
})
```

The `view.render` method takes the relative `resources/views` path to the view file. There is no need to type the `.edge` extension.

If you haven't already done so, serve your site:

```bash
adonis serve --dev
```

Finally, browse to `127.0.0.1:3333/hello-world` and you should see:

**"Hello World!"**

### Nested views
You can also render views from within subfolders via dot notation:

```js
// file path: resources/views/my/nested/view.edge

view.render('my.nested.view')
```

## Request information
All views have access to the current `request` object.

You can call request methods inside your view templates like so:

```edge
The request URL is {{ request.url() }}
```

The `request.url` value above can also be retrieved via the `url` global:

```edge
The request URL is {{ url }}
```

## Globals
In addition to all Edge [globals](http://edge.adonisjs.com/docs/globals), the following globals are also provided by AdonisJs.

#### `style`
Adds a `link` tag to a CSS file.

Relative path (to CSS files in the `public` directory):

```edge
{{ style('style') }}
```

```html
<link rel="stylesheet" href="/style.css" />
```

Absolute path:

```edge
{{ style('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css') }}
```

```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" />
```

#### script
Adds a `script` tag to a JavaScript file.

Relative path (to JavaScript files in the `public` directory):

```edge
{{ script('app') }}
```

```html
<script type="text/javascript" src="/app.js"></script>
```

Absolute path:

```edge
{{ script('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js') }}
```

```html
<script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
```

#### `assetsUrl`
Returns path of a file relative to the `public` directory:

```edge
<img src="{{ assetsUrl('images/logo.png') }}" />
```

```html
<img src="/images/logo.png" />
```

#### `route`
Returns the URL for a route.

For example, using the following example route...

```js
// .start/routes.js

Route.get('users/:id', 'UserController.show')
  .as('profile')
```

...if you pass the route name and any route parameters...

```edge
<a href="{{ route('profile', { id: 1 }) }}">
  View profile
</a>
```

...the route URL will render like so:

```html
<a href="/users/1">
  View profile
</a>
```

You can also pass the `controller.method` signature:

```edge
<a href="{{ route('UserController.show', { id: 1 }) }}">
  View profile
</a>
```

#### `url`
Returns the current request url:

```edge
The request URL is {{ url }}
```

#### `auth`
If using the AdonisJs [Auth Provider](/original/markdown/05-Security/02-Authentication.md), you can access the current logged in user via the global `auth` object:

```edge
{{ auth.user }}
```

### CSRF
If using the AdonisJs [Shield Middleware](/original/markdown/05-Security/08-Shield-Middleware.md), you can access the CSRF token and input field using one of the following globals.

#### `csrfToken`

```edge
{{ csrfToken }}
```

##### `csrfField`

```edge
{{ csrfField() }}
```

```html
<input type="hidden" name="_csrf" value="...">
```

#### `cspMeta`
Using the AdonisJs [Shield Middleware](/original/markdown/05-Security/08-Shield-Middleware.md), CSP headers are set automatically.

However, you can also set them manually via the `cspMeta` global:

```edge
<head>
  {{ cspMeta() }}
</head>
```

## Tags
[Tags](http://edge.adonisjs.com/docs/tags) are the building blocks for Edge templates.

For example, `@if`, `@each`, and `@include` are all tags shipped with Edge by default.

Edge also exposes a very powerful API to add new tags to it.

Here is a list of the `tags` specific to AdonisJs only.

#### `loggedIn`
The `loggedIn` tag allows you to write an `if/else` conditional clause around the logged in user.

For example:

```edge
@loggedIn
  You are logged in!
@else
  <a href="/login">Click here</a> to login.
@endloggedIn
```

Everything between the `@loggedIn` and `@else` tag gets rendered if the user is logged in, while everything between the `@else` and `@endloggedIn` tag gets rendered if they are not.

#### `inlineSvg`
Renders an SVG file inline inside your HTML.

The tag expects a relative path to an SVG file inside the `public` directory:

```edge
<a href="/login">
  @inlineSvg('lock')
  Login
</a>
```

## Templating
AdonisJs shares its templating syntax with [Edge](https://edge.adonisjs.com).

Please read the Edge [Syntax Guide](http://edge.adonisjs.com/docs/syntax-guide) for more.

## Extending views
It is also possible to extend views by adding your own view globals or tags.

> NOTE: Since the code to extend `View` need only execute once, you could use [providers](/original/markdown/02-Concept/03-service-providers.md) or link:ignitor[Ignitor hooks] to do so. Read (/original/markdown/06-Digging-Deeper/03-Extending-the-Core.md) for more information.

### Globals

```js
const View = use('View')

View.global('currentTime', function () {
  return new Date().getTime()
})
```

The above global returns the current time when referenced inside your views:

```edge
{{ currentTime() }}
```

### Globals scope
The value of `this` inside a global's closure is bound to the view context so you can access runtime values from it:

```js
View.global('button', function (text) {
  return this.safe(`<button type="submit">${text}</button>`)
})
```

> TIP: The `safe` method ensures returned HTML is not escaped.

To use other globals inside your custom globals, use the `this.resolve` method:

```js
View.global('messages', {
  success: 'This is a success message',
  warning: 'This is a warning message'
})

View.global('getMessage', function (type) {
  const message = this.resolve('messages')
  return messages[type]
})
```

```edge
{{ getMessage('success') }}
```

### Tags
You can learn more about tags via the Edge [documentation](http://edge.adonisjs.com/docs/tags).

```js
const View = use('View')

class MyTag extends View.engine.BaseTag {
  //
}

View.engine.tag(new MyTag())
```

### Runtime values
You may want to share specific request values with your views.

This can be done by creating middleware and sharing locals:

```js
class SomeMiddleware {

  async handle ({ view }, next) {
    view.share({
      apiVersion: request.input('version')
    })

    await next()
  }
}
```

Then, inside your views, you can access it like any other value:

```edge
{{ apiVersion }}
```

## Syntax highlighting
The following editor plugins provide Edge syntax highlighting support:

1. [Sublime Text](https://github.com/poppinss/edge-sublime-syntax)
2. [Atom](https://github.com/poppinss/edge-atom-syntax)
3. [Visual Studio Code](https://github.com/duyluonglc/vscode-edge)
4. [VIM](https://github.com/watzon/vim-edge-template)
