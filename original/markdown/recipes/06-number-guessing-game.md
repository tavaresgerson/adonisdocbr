---
title: Number guessing game
category: recipes
---

# Number guessing game

In this guide, we create a simple number guessing game as a way to learn more about the framework. By the end of this guide, you will know how to make use of *views*, *create new routes* and *bind controllers* to them.

> TIP: You can see the final working version on [glitch](https://adonis-number-guessing-game.glitch.me/?number=5). Also, you can checkout the code using the following remix button.
> ![image](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)

## Game story
The number guessing takes input from the user and matches it against a random number. If the number matches, it is called a match, otherwise it is a pass.

To keep it simple, we accept the user guessed number as the query string in the URL.

## Setup
Let's create a new project using `adonis` command. We create a slim project since we do not need a database or models for this app.

```js
adonis new number-game --slim
```

Now, `cd` into the created directory and make sure you can run the application using `adonis serve` command.

## Routing
Let's start by removing everything from the `start/routes.js` file and paste the following code inside it.

```js
const Route = use('Route')

Route.get('/', ({ request }) => {
  /** get number from the url query string */
  const guessedNumber = Number(request.input('number'))

  /** if number is not specified, let the user know about it */
  if (!guessedNumber) {
    return 'Please specify a number by passing ?number=<num> to the url'
  }

  /** generate a random number */
  const randomNumber = Math.floor(Math.random() * 20) + 1

  /** let the user know about the match */
  return randomNumber === guessedNumber
  ? 'Matched'
  : `Match failed. The actual number is ${randomNumber}`
})
```

Now if we visit [127.0.0.1:3333?number=5](http://127.0.0.1:3333?number=5) and keep on changing the `number` between 1-20, we see *Matched* or the *Match failed* statement.

The logic of number guessing game remains the same, but we start extracting this code into a controller and also create a view for it.

## Http controller
Let's create a new controller by running the following command.

```bash
adonis make:controller Game
```

```bash
# Output

✔ create  app/Controllers/Http/GameController.js
```

Now open the `GameController.js` file and paste the following code into it.

```js
'use strict'

class GameController {

  render ({ request }) {
    /** get number from the url query string */
    const guessedNumber = Number(request.input('number'))

    /** if number is not specified, let the user know about it */
    if (!guessedNumber) {
      return 'Please specify a number by passing ?number=<num> to the url'
    }

    /** generate a random number */
    const randomNumber = Math.floor(Math.random() * 20) + 1

    /** let the user know about the match */
    return randomNumber === guessedNumber
    ? 'Matched'
    : `Match failed. The actual number is ${randomNumber}`
  }
}

module.exports = GameController
```

All we have done is moved the code from the route closure to the controller file. Now, we can remove all the code from `start/routes.js` file and instead bind controller to it.

```js
Route.get('/', 'GameController.render')
```

Now refresh the page, and the game works as expected.

## Views
AdonisJs makes use of [edge.js](http://edge.adonisjs.com/) as the templating engine to power views. Let's learn how to register the view provider and render it from the controller method.

### Setup
All of the providers are registered inside `start/app.js` file. So will the *ViewProvider*.

```js
const providers = [
  '@adonisjs/framework/providers/ViewProvider'
]
```

Once the provider has been registered, you can access the `view` instance inside your controller methods as follows.

```js
render ({ request, view }) {
}
```

Now, all we need to do is, create the `game.edge` template file and write the logic inside it.

### Creating template file

Just like the controller, we can use the `make:view` command to create a new view for us.

```bash
adonis make:view game
```

```bash
# Output

✔ create  resources/views/game.edge
```

### Extracting logic from controller
Let's remove all the logic from the controller method and instead render a view with required data.

```js
'use strict'

class GameController {

  render ({ request, view }) {
    const guessedNumber = Number(request.input('number'))
    const randomNumber = Math.floor(Math.random() * 20) + 1

    /** rendering view */
    return view.render('game', { guessedNumber, randomNumber })
  }
}

module.exports = GameController
```

```edge
<!-- .resources/views/game.edge -->

@if(!guessedNumber)
  <p> Please specify a number by passing <code>?number</code> to the url </p>
@elseif(guessedNumber === randomNumber)
  <h2> Matched </h2>
@else
  <h2>Match failed. The actual number is {{ randomNumber }}</h2>
@endif
```

As you can see, Edge makes it so simple to write logic in the template files. We are easily able to output the statement we want.

> TIP: If you have any questions or concerns, please join us on [discourse](https://forum.adonisjs.com/c/help/view) to be a part of our small and helpful community.

## Next Steps
This tutorial was the easiest attempt to make use of different pieces and build a simple application in AdonisJs. Moving forward consider learning more about the following topics.

1. [Routing](/original/markdown/04-Basics/01-Routing.md)
2. [Database](/original/markdown/07-Database/01-Getting-Started.md)
3. and [Authentication](/original/markdown/05-Security/02-Authentication.md)
