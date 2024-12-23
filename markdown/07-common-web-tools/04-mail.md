# Mail

Sending email is a common task for web applications. AdonisJs official *Mail Provider* makes it so easy and intuitive to send emails using one of the available drivers.

## Drivers
Below is the list of available drivers and you are free to extend and add your custom drivers.

1. SMTP (smtp).
2. Amazon SES (ses).
3. Mandrill (mandrill).
4. MailGun (mailgun).
5. Log (log)

> TIP: The `log` driver is used when running tests since it will log emails to a file instead of sending it to the real people.

## Setup
Mail provider is not part of the base installation, and you have to pull the package from *npm* and register the provider. Let's do a quick 2min setup.

```bash
# Install From Npm

npm i --save adonis-mail-provider
```

Next, we need to register the provider and setup an alias for same.

```js
// bootstrap/app.js

const providers = [
  ...,
  'adonis-mail-provider/providers/MailProvider'
]
```

```js
// bootstrap/app.js

const aliases = {
  Mail: 'Adonis/Addons/Mail'
}
```

## Config
Also, a configuration file needs to be saved as `config/mail.js`. You can download the sample configuration from [github](https://raw.githubusercontent.com/adonisjs/adonis-mail/master/examples/mail.js) or run the below bash command to save the file automatically.

```bash
# Download using wget

wget https://raw.githubusercontent.com/adonisjs/adonis-mail/master/examples/mail.js -O config/mail.js
```

## Basic Example
Let's take a basic example of sending a welcome email to the newly registered user. We need to set up a route and a view before sending the email.

```js
// app/Http/routes.js

'use strict'

const Route = use('Route')
Route.post('users', 'UsersController.store')
```

```js
// app/Http/Controllers/UsersController.js

'use strict'

const Mail = use('Mail')
const User = use('App/Model/User')

class UsersController {

  * store (request, response) {
    const user = yield User.create(userDetails) <1>

    yield Mail.send('emails.welcome', user, (message) => {
      message.to(user.email, user.firstname)
      message.from('awesome@adonisjs.com')
      message.subject('Welcome to the Kitten\'s World')
    }) <2>
  }
}
```

1. Make sure to validate the user details before saving them to the DB.
2. The `Mail.send` method will send the email by accepting a path to the view as the 1st parameter.

```bash
# Creating emails.welcome view

./ace make:view emails/welcome
```

```twig
<!-- resources/views/emails/welcome.njk -->

<h2> Heya {{ firstname}} </h2>

<p> Welcome to the kitten's world. We will be sharing lots of cute kittens with you soon</p>
```

## Mail Methods
Below is the list of methods to be used for sending emails.

#### send(view, data, callback, [configKey])
The `send` method will compile a view with given data and send it as HTML. Attached callback gives you the access to the [message builder](#message-builder) to define email properties.

```js
yield Mail.send('receipt', {name: 'Doe', amount: 22}, message => {
  // ...
})
```

#### raw(body, callback, [configKey])
Send email using raw text, instead of using a view.

```js
yield Mail.raw('Your security code is 301030', message => {
  message.from('secret@yourcompany.com')
  message.to('doe@example.org', 'Doe')
})
```

## Message Builder
Message Builder makes it super easy to chain methods and build the message body. The `message` argument passed to the *Mail.send* the method is an instance of message builder and below is the list of methods you can call on it.

#### from(email, [name])
```js
yield Mail.send('receipt', {}, message => {
  message.from('awesome@adonisjs.com', 'AdonisJs')
})
```

#### sender(email, [name])
```js
yield Mail.send('receipt', {}, message => {
  message.sender('awesome@adonisjs.com', 'AdonisJs')
})
```

#### replyTo(email, [name])
```js
yield Mail.send('receipt', {}, message => {
  message.replyTo('noreply@adonisjs.com')
})
```

#### to(email, [name])
```js
yield Mail.send('receipt', {}, message => {
  message.to('johndoe@example.com', 'John Doe')
})
```

#### cc(email, [name])
```js
yield Mail.send('receipt', {}, message => {
  message.cc('jamie@example.com', 'Jamie Doe')
})
```

#### bcc(email, [name])
```js
yield Mail.send('receipt', {}, message => {
  message.bcc('finance@example.com')
})
```

#### subject(message)
```js
yield Mail.send('receipt', {}, message => {
  message.subject('Recent purchase receipt')
})
```

#### priority(level)
Set priority for the email. It needs to be one of the following:

* high
* low
* normal

```js
message.priority('high')
```

#### header(key, value)
```js
message.header('x-id', 1)
```

#### headers(arrayOfHeaders)
```js
message.header([{ key: 'x-id', value: 1 }])
```

#### attach(filePath, [options])
Attach a file to the email

```js
message.attach(path.join(__dirname, '/assets/logo.png'))
message.attach(path.join(__dirname, '/assets/logo.png'), { filename: 'MyLogo.png' })
```

Attachment Options

| Key                 | Type    | Description  |
|---------------------|---------|--------------|
| filename            | String  | Name of the file. If not defined, will be picked from the file path.  |
| contentType         | String  | Attachment *Content type*. If not defined, will be picked from the file extension.  |
| contentDisposition  | String  | Content-disposition, defaults to attachment.  |
| encoding            | String  | Attachment encoding must from *base64*, *hex* and *binary*. |

#### attachData(data, filename, [options])
Attach raw data as an attachment to the email.

> TIP: Attachment options are same as the `attach` method.

```js
message.attachData('some raw content', 'raw.txt')
```

#### embed(filePath, cid, [options])
Embed a file within the email body. The `cid` must be unique and is required so that you can reference it inside your HTML views.

```js
message.embed(path.join(__dirname, '/assets/logo.png'), 'logo')
```

```twig
<!-- Embedding inside views -->

<img src="cid:logo" />
```

#### html(body)
HTML of the email gets automatically created from the view. If for any reasons you want to override, make use of this method.

```js
message.html('My custom html')
```

#### text(body)
Set *plaintext* for the email. It is defined for the email clients which do not support HTML.

> TIP: All popular email clients does support HTML.

```js
message.text('A plaintext view')
```

#### watchHtml(body)
Set HTML to be displayed for the *Apple Watch*.

```js
message.watchHtml('Email body for apple watch')
```

## Passing Multiple Views
You can define multiple views for *HTML*, *Plain text* and *Apple watch* by passing an array to the [send](#sendview-data-callback-configkey) method.

```js
yield Mail.send(['welcome', 'welcome-text', 'welcome-watch'], {}, message => {
  // ...
})
```

## Switching Drivers
The default driver defined inside the config file is used to send emails, but you can switch between drivers on runtime using the `driver` method.

```js
const mandrill = Mail.driver('mandrill')

yield mandrill.send('emails.welcome', {}, message => {
  // ...
})
```

## Adding New Drivers
You can also add new drivers to the *Mail provider* by extending it and here are some points to keep in mind.

1. AdonisJs internally uses [nodemailer](https://github.com/nodemailer/nodemailer) to send emails. You can also wrap an existing nodemailer transport to a driver.
2. Your driver must have a `send` method.

Let's make use of [nodemailer postmark transport](https://github.com/killmenot/nodemailer-postmark-transport) to create a new driver and register it via IoC container.

### Writing Driver

```js
// src/PostMark.js

'use strict'

class PostMark {

  constructor (Config) {
    this.config = Config
    this.transport = this._createTransport('mail.postmark') <1>
  }

  _createTransport (configKey) {
    const options = this.config.get(configKey) <2>
    const nodemailer = require('nodemailer')
    const postmarkTransport = require('nodemailer-postmark-transport')
    return nodemailer.createTransport(postmarkTransport(options)) <3>
  }

  send (message, configKey) {
    const transport = configKey ? this._createTransport(configKey) : this.transport <4>
    return transport.sendMail(message) <5>
  }

}
```

1. We create a default transport by calling `_createTransport` method and passing it the key to the config block.
2. Here we use the [config provider](/markdown/03-getting-started/03-configuration.md) `get` method to pull the configuration for the given key.
3. Next, we return an instance of nodemailer transport.
4. Inside `send` method we create transport if a user defines a different config key at runtime. Otherwise, we use the default transport.
5. Finally, we will send the email using the transport `sendMail` method.

### Registering Driver
We are all set to register the driver by extending the Mail provider.

```js
// bootstrap/extend.js

const Ioc = use('adonis-fold').Ioc
const Postmark = require('../src/PostMark')

Ioc.extend('Adonis/Addons/Mail', 'postmark', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new PostMark(Config)
})
```

### Using PostMark Driver
```js
yield Mail.driver('postmark').send('emails.welcome', {}, message => {
  // ...
})
```

## Testing Emails
AdonisJs ships a *Log Driver*, which can be used when writing tests. Log driver will save all the emails to *storage/logs/mail.eml* file as a string. You can parse this file to make test assertions.
