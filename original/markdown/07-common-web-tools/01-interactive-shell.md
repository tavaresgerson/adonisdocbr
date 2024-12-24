# Interactive Shell Aka Ace

Ace is a powerful command line tool crafted for AdonisJs. So far you have been using lots of ace commands to generate *controllers*, *models*, run *migrations*, etc. In this guide, we will learn about the internals of Ace and how to create commands.

## About Ace

1. `ace` is an executable file inside the root of your application.
2. Each command is specific to a single project, for reusable commands, you must bundle them as an npm package.
3. Commands have access to all the applications components like *Models*, *Routes*, etc. That makes it so easy to create useful commands.
4. Project specific commands are stored inside `app/Commands` directory.
5. You must register your commands inside `bootstrap/app.js` file before using them.

## Creating Your First Command
We are going to create a command to pull random quotes of *Paul Graham* using [Wisdom API](http://gophergala.github.io/wisdom) and display it on the terminal.

```bash
# Creating A New Command

./ace make:command Quote
```

```bash
# Installing Got (npm module to make HTTP requests)

npm i --save got
```

```js
// app/Commands/Quote.js

const Command = use('Command')
const got = use('got')

class Quote extends Command { <1>

  get signature () {
    return 'quote'
  } <2>

  get description () {
    return 'Display a random quote from Paul Graham.'
  } <3>

  * handle (args, options) {
    const response = yield got('https://wisdomapi.herokuapp.com/v1/author/paulg/random')
    const quote = JSON.parse(response.body)

    this.log('\n')
    this.log(`${this.colors.gray(quote.author.name)} - ${this.colors.cyan(quote.author.company)}`)
    this.log(`${quote.content}`)
  } <4>

}
```

1. Each command should be inherited from the base `Command` class.
2. The signature is used to define the command name and its expectations. Learn more about Signature xref:_command_signature[here].
3. Description is displayed on the help screen. It is a good place to tell the end user about the command.
4. The `handle` is the body of your command and called automatically by Ace when the command gets executed.

Next, we need to register this command to the list of commands.

```js
// bootstrap/app.js

const commands = [
  'App/Commands/Quote',
  ...
]
```

If all went through, you would be able to see your command listed on the help screen of Ace.

```bash
./ace --help
```

```bash
# Output

quote               Display a random quote from Paul Graham
....
```

Let's execute this command to fetch an inspirational quote and display it on the terminal.

```bash
./ace quote
```

![image](http://res.cloudinary.com/adonisjs/image/upload/v1473771404/Screen_Shot_2016-09-13_at_6.25.37_PM_hvd2hv.png)

## Command Signature
Command Signature defines the command name with required/optional arguments or options.

#### Command With Only The Name
```js
get signature () {
  return 'make:controller'
}
```

### Arguments
Commands can recieve named arguments.

#### Command With Required Argument(s)
Curly braces surround arguments. A single command can have as many arguments as it wants.

```js
get signature () {
  return 'make:controller {name}'
}
```

#### Optional Argument(s)
Append `?` to the argument, name to make it optional. Just like your route parameters.

```js
get signature () {
  return 'make:controller {name?}'
}
```

#### Argument Description
Also, you set a description for an argument separating it with a colon `(:)`.

```js
get signature () {
  return 'make:controller {name:Name of the controller}'
}
```

### Options
Options are defined by appending `--` to the start of the option name.

#### Command With Required Option(s)
```js
get signature () {
  return 'make:controller {name} {--resource}'
}
```

#### Optional Option(s)
Just like arguments, you can also make options optional by appending a `?`.

```js
get signature () {
  return 'make:controller {name} {--resource?}'
}
```

#### Options With Aliases
Often options need aliases like *-h* for `--help`. You can define multiple aliases for a given option separated by a comma.

```js
get signature () {
  return 'make:controller {name} {-r,--resource?}'
}
```

#### Options That Accepts Values
At times options want values to perform certain operations, and same can get achieved by making use of `@value` identifier.

```js
get signature () {
  return 'make:controller {name} {--template=@value}'
}
```

## Interactive Inputs
AdonisJs makes it so simple to create interactive commands by prompting the user to give information as they go.

#### ask(question, [defaultValue])
The `ask` method will accept textual input. Optionally you can define `defaultValue` which will be returned when no input has been passed.

```js
const projectName = yield this
  .ask('Enter project name', 'yardstick')
  .print()
```

![image](http://res.cloudinary.com/adonisjs/image/upload/v1473783322/ask_blwh1x.gif)

#### choice(question, choices, [defaultChoice])
Display a list of choices to be used for selection. Only one of the listed options can be selected.

```js
const dailyMeal = yield this
  .choice('Choose a free daily meal', ['BreakFast', 'Lunch', 'Dinner'], 'BreakFast')
  .print()
```

![image](http://res.cloudinary.com/adonisjs/image/upload/v1473783461/choice_ijyxqz.gif)

#### multiple(question, choices, [defaultChoices])
Display a list of multiple choices with an optional array of pre-selected values. Unlike `choice` you can select multiple values.

```js
yield this.multiple('You know?', ['Javascript', 'Elm', 'Haskell', 'Ruby']).print()

// OR
const langs = yield this
  .multiple('You know?', {
    js: 'Javascript',
    elm: 'Elm',
    hsk: 'Haskell',
    ruby: 'Ruby'
  }).print()
```

![image](http://res.cloudinary.com/adonisjs/image/upload/v1473783814/multiple_arn7og.gif)

#### anticipate(question, choices, [defaultChoice])
Shows a list of actions with the keyboard shortcuts. It is helpful when you want the user to anticipate on something.

```js
const action = yield this
  .anticipate('Conflict in file.js?', [
    {key: 'y', name: 'Delete it'},
    {key: 'a', name: 'Overwrite it'},
    {key: 'i', name: 'Ignore it'}
  ])
  .print()
```

![image](https://res.cloudinary.com/adonisjs/image/upload/v1473783820/anticipate_xmstmk.gif)

#### secure(question, [defaultValue])
Ask for a secure input like a *password* or some *secret token*. The input value will be show as `\*\*****`.

```js
const password = yield this
  .secure('What is your password?')
  .print()
```

![image](https://res.cloudinary.com/adonisjs/image/upload/v1473783809/secure_ddk3w3.gif)

#### confirm(question, [defaultValue])
Ask for a yes/no question.

```js
const deleteFiles = yield this
  .confirm('Are you sure you want to delete selected files?')
  .print()
```

![image](https://res.cloudinary.com/adonisjs/image/upload/v1473783814/confirm_dsoxix.gif)

## Validating Inputs
It is extremely useful to validate input when accepting the values from interactive questions. All prompt questions can be validated by chaining the `validate` method and returning `true` from the callback will be considered as successful validation.

```js
yield this
  .ask('Enter coupon code')
  .validate(function (input) {
    return input === 'adonisjs' ? true : 'Enter a valid coupon code'
  })
  .print()
```

## ANSI Output
[Ansi Escape Codes](https://en.wikipedia.org/wiki/ANSI_escape_code) are used to output colored text to the terminal using a sequence of multiple characters. For example: To output a green color `Hello World` to the terminal you need to log following.

```js
console.log('\033[32m Hello World')
```

It is so hard to remember these codes and unpleasant to write them. Also, you will have to deal with different *shell types* to get the right output. AdonisJs commands can make this easy with the help of the following methods.

#### error(message)
```js
this.error('Sorry, something went wrong')
```

#### success(message)
```js
this.success('All done!')
```

#### info(message)
```js
this.info('Just letting you know')
```

#### warn(message)
```js
this.warn('Wait! something seems fishy')
```

#### completed(action, message)
Will output a structured message for a completed action. Where action name will be in green color.

```js
this.completed('create', 'Created the controller file')
```

```bash
# Output

create: Created the controller file
```

#### failed(action, message)
```js
this.failed('create', 'Sorry controller file already exists')
```

```bash
# Output

create: Sorry controller file already exists
```

#### table(head, body)
```js
this.table(['username', 'age'], [{'virk': 26}, {nikk: 25}])

// or
this.table(
  ['key', 'value'],
  {username: 'foo', age: 22, email: 'foo@bar.com'}
)
```

## Icons & Colors
Additionally, you can output icons and add color to your console messages inside your command `handle` method.

```js
'use strict'

const Command = use('Command')

class Greet extends Command {
  * handle () {
    const successIcon = this.icon('success')
    console.log(`${successIcon} That went great`)
  }
}
```

```bash
# Output

✔ That went great
```

### Icons List

| Icon | Name     |
|------|---------|
| ℹ     | info    |
| ✔    | success |
| ⚠    | warn    |
| ✖    | error   |

### Colors
Under the hood, Ace makes use of [colors](https://www.npmjs.com/package/colors) an npm module. You can access all the available methods on *colors* using the property colors.

```js
this.colors.green('This is all green')
this.colors.red.underline('I like cake and pies')
```
