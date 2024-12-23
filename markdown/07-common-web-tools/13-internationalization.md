# Internationalization

Internationalization is a process of translating your web apps into multiple different languages. Since web apps reach all parts of the world, internationalization makes it easier for you to detect the user language and translate your web apps for localized experience.

## Drivers

* File (file)
* Database (database)

## About Internationalization

* It follows the conventions and libraries provided by [Format.js](http://formatjs.io/).
* All locale strings are defined using [ICU Message Syntax](http://userguide.icu-project.org/formatparse/messages).
* All locale strings are stored within *.json* files inside `resources/locales` directory or database table `locales` based upon the driver you are using.
* A middleware can be used to detect the user language in runtime.
* Generic messages (same for all languages) are saved inside `resources/locales/fallback` directory and `fallback` group when using database driver.

## Setup
The `adonis-antl` package is not installed/setup by default, and you are required to install it when needed.

```bash
# Installing Via Npm

npm i --save adonis-antl
```

```js
// Registering Provider (bootstrap/app.js)

const providers = [
  // ...
  'adonis-antl/providers/AntlProvider'
  // ...
]
```

```js
// Registering Alias (bootstrap/app.js)

const aliases = {
  // ...
  Antl: 'Adonis/Addons/Antl',
  Formats: 'Adonis/Addons/AntlFormats'
  // ...
}
```

Based upon the default driver you will have to store your locales inside the `resources/locales` directory or the `locales` database table. To make the setup process simple, you can run the following command.

```js
// Registering Command (bootstrap/app.js)

const commands = [
  // ...
  'Adonis/Commands/Antl:Setup'
  // ...
]
```

```bash
./ace antl:setup

# for database driver
./ace antl:setup --driver=database
```

Above command will create the `resources/locales/*` directory or the migrations to create the database table.

## Config
The configuration for *Antl Provider* is saved inside `config/app.js` file. Release version _3.1_ includes the config by default but always make sure to keep it updated.

```js
// config/app.js

{
  locales: {
    driver: 'file',
    locale: 'en',
    fallbackLocale: 'en'
  }
}
```

| Key             | Possible Values   | Description |
|-----------------|-------------------|-------------|
| driver          | file, database    | The driver to use for reading/writing and removing locale strings. |
| locale          | Any valid locale  | The default locale to be used when unable to detect user locale. |
| fallbackLocale  | Any valid locale  | The fallback locale when detected user locale is not supported. |

## Basic Example
Let's start with a basic example of formatting raw values and messages written using [ICU Syntax](#icu-messages). This time, we will play with the *Ace REPL* within the command line.

```bash
./ace repl
```

```bash
Output

repl+>
```

### Formatting Values
```js
const Antl = use('Antl')

Antl.formatAmount(1000, 'usd')

// or
Antl
  .for('fr') <1>
  .formatAmount(1000, 'usd')
```

1. The method `for` will let you switch the language for a single operation.

![image](http://res.cloudinary.com/adonisjs/image/upload/v1475061511/Adonis-Antl_hlpwxd.gif)

### Formatting Messages
Using the default `file` driver, we can define locales inside the `resources/locales` directory. Each language gets its own sub-directory.

```json
// resources/locales/en/messages.json

{
  "product.cost": "{product} will cost {price, number, usd}"
}
```

```js
// Formatting Product Cost Message

const Antl = use('Antl')
Antl.formatMessage('messages.product.cost', { product: 'Chair', price: 29 })
```

```bash
# Output

Chair will cost $29.00
```

## ICU Messages
Before you can start using the *Antl* provider, it is crucial to understand the [ICU message syntax](http://userguide.icu-project.org/formatparse/messages) since it is a standard adopted by the web globally.

### String Literals
A message can be just a string literal in multiple different languages.

```json
// resources/locales/en/messages.json

{
  "greeting": "Hello!"
}
```

```json
// resources/locales/fr/messages.json

{
  "greeting": "Bonjour!"
}
```

### Simple Arguments
You can also define placeholders for simple arguments and pass dynamic data at runtime to replace them with their actual values.

```json
// resources/locales/en/messages.json
{
  "greeting": "Hello {name}"
}
```

```json
// resources/locales/fr/messages.json

{
  "greeting": "Bonjour {name}"
}
```

```js
// Formatting

use('Antl').formatMessage('messages.greeting', { name: 'Virk' })

// Returns - Hello Virk or Bonjour Virk
```

### Formatted Arguments
Formatted arguments give you the functionality to define the argument key, type and format as `{ key, type, format }`.

| Name    | Description |
|---------|-------------|
| key     | Key is used to define the placeholder name which is used in the data object.  |
| type    | Defines the format type for the value. Internationalization has a set of defined types. |
| format  | Format is an object of values defining how to format the type. For example: `number` type can be formatted as *percentage*, *decimal* or *currency*. |


```json
// resource/locales/en/messages.json

{
  "cart.total": "Your cart total is {total, number, curr}"
}
```

Now when formatting the above message we need to pass `curr` format to the *number type*, so that the inbuilt formatter can format the total as a currency.

```js
const Antl = use('Antl')

Antl.formatMessage('messages.cart.total', { price: 59 }, (message) => {
  message
    .passFormat('curr')
    .to('number')
    .withValues({ currency: 'usd' })
})
```

Also, you can pass the format as an expression instead of attaching the callback.

```js
const Antl = use('Antl')

Antl.formatMessage('messages.cart.total', { price: 59 }, 'curr:number[currency=usd]')
```

You can also access antl directly in your views using the `antl` global.

```twig
{{ antl.formatMessage('messages.cart.total', { price: 59 }, 'curr:number[currency=usd]') }}
```

## Antl Methods
Below is the list of antl methods.

#### for(locale)
Temporarily switch locale for a single method call.

```js
Antl.for('fr').formatNumber(1000)
```

#### getLocale
Returns the currently active locale

```js
Antl.getLocale()
```

#### setLocale(locale)
Permanently switch locale for all future translations.

```js
Antl.setLocale('fr')
Antl.formatNumber(1000)
```

#### isLocale(locale)
Detect if a given locale is the active locale.

```js
Antl.isLocale('en')
```

#### locales
Return a list of registered locales as an array. It is based upon the messages saved inside a file/database.

```js
Antl.locales()
```

#### strings([group])
Return a list of registered strings for a given/default locale. An optional group can be passed to fetch strings for a given group only.

> TIP: This method can be helpful in populating a dropdown.

```js
Antl.strings()
// or
Antl.strings('messages')
// or
Antl.for('fr').strings()
```

#### pair([group])
This method is similar to xref:_strings_group[strings] but instead returns a flat object by joining nested objects with a (dot).

```js
Antl.pair()
// or
Antl.pair('messages')
// or
Antl.for('fr').pair()
```

#### get(key)
Get raw string for a given key

```js
Antl.get('messages.cart.total')
// or
Antl.for('fr').get('messages.cart.total')
```

#### set(group, key, value)
Update/Create value for a given key inside a group

> NOTE: This method will update the underlying store for the currently active driver which means it will update the database row or update the file system.

```js
yield Antl.set('messages', 'cart.total', 'You will be paying {total, number, curr}')
```

#### remove(group, key)
Remove a given key for the currently active locale.

```js
yield Antl.remove('messages', 'cart.total')
```

#### load()
This method is used to `load` the locales for the currently active driver. First time *Antl Provider* will load all the strings for the default driver defined inside `config/app.js` file whereas you are required to call this method manually whenever you switch the driver in runtime.

> TIP: The `load` method smartly caches the values returned by a driver. Which means calling the method multiple time will have no side effects.

```js
const db = Antl.driver('database')
yield db.load()

db.formatMessage('messages.cart.total', {total: 1000})
```

#### reload
Since the `load` method caches the values, you can make use of `reload` to forcefully reloads all the strings for a given driver.

```js
const db = Antl.driver('database')
yield db.reload()

db.formatMessage('messages.cart.total', {total: 1000})
```

## Formatter Methods
Below is the list of formatter methods and available options you can pass to get desired output.

#### formatNumber(value, options)
```js
const Antl = use('Antl')

Antl.formatNumber(1000)
// or
Antl.formatNumber(1000, { style: 'percent' })
```

```twig
{{ antl.formatNumber(1000) }}
{# or #}
{{ antl.formatNumber(1000, { style: 'percent' }) }}
```

| Key                       | Default Value             | Possible Values                 | Description |
|---------------------------|---------------------------|---------------------------------|-------------|
| style                     | decimal                   | decimal, currency, percentage   | The formatting style to be used for formatting the value. |
| currency                  | null                      | A valid ISO 4217 currency code  | If *style* is currency, this option must pass a valid currency code to be used for formatting the value. [Reference list of country code](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) |
| currencyDisplay           | symbol                    | symbol, code                    | How to display the currency. For example &dollar; is the *symbol* and USD is the *code* |
| useGrouping               | true                      | true, false                     | Whether to use grouping separators like thousand/lakh/crore separators. |
| minimumIntegerDigits      | 1                         | 1-21                            | The minimum number of integer digits to use. |
| minimumFractionDigits     | floating                  | 0-20                            | The minimum number of fraction digits to use. The default value is *0* for plain numbers and minor unit digits provided by the ISO 4217 for currency values. |
| maximumFractionDigits     | floating                  | 0-20                            | The maximum number of fraction digits to use. The default value is greater than the *minimumFractionDigits* value. |
| minimumSignificantDigits  | 1                         | 1-21                            | The minimum number of significant digits to use. |
| maximumSignificantDigits  | minimumSignificantDigits  | 1-21                            | The maximum number of significant digits to use. |

#### formatAmount(value, currency, options)
```js
const Antl = use('Antl')

Antl.formatAmount(1000, 'usd')
// or
Antl.formatNumber(1000, { currencyDisplay: 'code' })
```

```twig
{{ antl.formatAmount(1000, 'usd') }}
{# or #}
{{ antl.formatAmount(1000, 'usd', { currencyDisplay: 'code' }) }}
```

The formatting options are similar to [formatNumber](#formatnumbervalue-options)

#### formatDate(value, options)
```js
const Antl = use('Antl')

Antl.formatDate(new Date())
// or
Antl.formatDate(new Date(), { hour12: false })
```

```twig
{{ antl.formatDate(new Date()) }}
{# or #}
{{ antl.formatDate(new Date(), { hour12: false }) }}
```

| Key           | Default Value     | Possible Values                       | Description |
|---------------|-------------------|---------------------------------------|-------------|
| hour12        | locale dependent  | true, false                           | Whether to show time in *12 hours* format or not. |
| weekday       | none              | narrow, short, long                   | The representation of the weekday.                |
| era           | none              | narrow, short, long                   | The representation of the era.                    |
| year          | none              | numeric, 2-digit                      | The representation of the year.                   |
| month         | none              | numeric, 2-digit, narrow, short, long | The representation of the month.                  | 
| day           | none              | numeric, 2-digit                      | The representation of the day.                    |
| hour          | none              | numeric, 2-digit                      | The representation of the hour.                   |
| minute        | none              | numeric, 2-digit                      | The representation of the minute.                 |
| second        | none              | numeric, 2-digit                      | The representation of the second.                 |
| timeZoneName  | none              | short, long                           | The representation of the time zone name.         |

#### formatRelative(key, value, options)
```js
const Antl = use('Antl')
const threeHoursPrior = new Date().setHours(new Date().getHours() - 3)

Antl.formatRelative(threeHoursPrior)
// 3 hours ago
```

```twig
{{ antl.formatRelative(threeHoursPrior) }}
```

| Key   | Default Value | Possible Values                         | Description     |
|-------|---------------|-----------------------------------------|-----------------|
| units | best fit      | second, minute, hour, day, month, year  | The particular rendering unit. For example *30 days ago* instead of *1 month ago* |
| style | best fit      | numeric                                 | The rendering style for the value. For example: *numeric* will force the output to *1 day ago* instead of *yesterday*. |

#### formatMessage(key, values, [callback|options])
Formatting a message requires you first to save your strings inside the locales files or the database table called `locales` and it must follow the [ICU Message Syntax](#icu-messages).


```js
const Antl = use('Antl')

Antl.formatMessage('messages.total', { total: 1000 })
// or
Antl.formatMessage('messages.total', { total: 1000 }, (message) => {
  message.passFormat('curr').to.('number').withValues({ currency: 'usd' })
})
```

Since views do not allow adding callbacks to a function, you are supposed to pass a string expression to the `formatMessage` method.

```twig
{{ antl.formatMessage('messages.total', { total: 1000 }) }}
{# or #}
{{ antl.formatMessage('messages.total', { total: 1000 }, 'curr:number[currency=usd]') }}
```

## Locale & Groups
When working with *Antl provider* your messages are divided into segments of `locale` and `groups`. Locale refers to the language for which you have defined the message, and a group defines the category of the message. Take the following example:

```bash
----
├── locales
│   ├── en <1>
│   │   ├── messages.json <2>
```

1. The `en` is the language for the message.
2. The file `messages.json` is the group called *messages* for all the strings defined inside this file.

When translating/formatting a message, you can are required to pass a string starting with the group. `messages.cart.total`. Also for generic messages which are same for all the languages can be defined next to the `fallback` folder/group.

```json
// resources/locales/fallback/messages.json

{
  "greeting": "I am available to all the languages."
}
```

In the same way, you can define a group when using the `database` driver.

Database locales table

| id  | locale    | group     | item        | text  |
|-----|-----------|-----------|-------------|-------|
| 1   | en        | messages  | cart.total  | Your cart total is {total, number, curr}  |
| 2   | fallback  | messages  | greeting    | I am available to all the languages       |

## Detecting User Locale
So far we have seen the ways of formatting messages and values using Antl provider. All values will be formatted for the *default locale* defined in `config/app.js` file.

```js
// config/locale.js

{
  locales: {
    driver: 'file',
    locale: 'en',
    fallbackLocale: 'en'
  }
}
```

You can change the default locale value, and all values will be formatted accordingly. To make this process dynamic based upon the user language, you are required to make use of `Antl` middleware which will detect the user language and set it as the default language for all translations.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/DetectLocale'
  // ...
]
```

Now all HTTP requests header *Accept-Language* or query string param *lang* will be used to detect the user language.

## Switching Drivers
Antl Provider makes use of the default driver defined inside `config/app.js` file. Whereas you can switch the drivers in runtime to make use of a different driver.

```js
const db = Antl.driver('db')
yield db.load() <1>

db.formatNumber(1000, { format: 'curr' })
```

1. The [load](#load) method should be called after switching the driver since it will load and cache all the strings for a given driver.

## Adding Drivers
You can extend *Antl Provider* by adding your own custom drivers and register them inside `bootstrap/extend.js` file.

```js
// bootstrap/extend.js

const Ioc = require('adonis-fold').Ioc

Ioc.extend('Adonis/Addons/Antl', 'mongo', (app) => {
  return new Mongo()
})
```

```js
// The Mongo Driver

class Mongo {
  * load () { <1>
    // load all locales and return as a nested object
  }

  * set (locale, group, key, value) { <2>
    // save new/update value
  }

  * remove (locale, group, key) { <3>
    // remove value for a given group
  }
}
```

1. It should return all locale strings as a nested object of `language` and `group`. For example
    ```json
    {
      "en": {
        "messages": {
          "cart.total": "Your cart total is"
        }
      }
    }
    ```

2. The `set` method should save the value for a given key, group and locale. It the value already exists, it should update it.
3. The `remove` method should delete the value.
