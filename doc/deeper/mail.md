# Email

AdonisJs tem suporte de primeira classe para envio de e-mail.

O provedor de email oferece suporte a vários drivers, incluindo:

* Smtp (`smtp`)
* Spark Post (`sparkpost`)
* Mailgun (`mailgun`)
* Amazon SES (`ses`)

## Configuração
Como o provedor de e-mail não é instalado por padrão, precisamos retirá-lo de npm:

```js
adonis install @adonisjs/mail
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

```js
const providers = [
  '@adonisjs/mail/providers/MailProvider'
]
```


> A configuração do email é salva dentro do arquivo `config/mail.js`, que é criado pelo comando `adonis install` ao instalar o Provedor de Email.


Vamos começar com o exemplo básico de envio de e-mail no registro do usuário:

```js
// start/routes.js

Route.post('user', 'UserController.store')
```

```js
// app/Controllers/Http/UserController.js

const Mail = use('Mail')

class UserController {

  async store ({ request }) {
    const data = request.only(['email', 'username', 'password'])
    const user = await User.create(data)

    await Mail.send('emails.welcome', user.toJSON(), (message) => {
      message
        .to(user.email)
        .from('<from-email>')
        .subject('Welcome to yardstick')
    })

    return 'Registered successfully'
  }
}

module.exports = UserController
```

Por fim, crie o arquivo `emails/welcome.edge` de visualização contendo o corpo HTML:

```edge
// resources/views/emails/welcome.edge

<h2> Hello {{ username }} </h2>
<p>
  Welcome to the yardstick club, here's your getting started guide
</p>
```

## API Mail
Abaixo está a lista de métodos que você pode usar para enviar e-mails.

#### send(views, data, callback)
Envie e-mail usando uma ou várias [views](https://adonisjs.com/docs/4.1/views):
```js
await Mail.send('view', data, (message) => {
  message
    .from('')
    .to('')
})
```

O argumento `views` pode ser uma única visualização ou matriz de visualizações por tipo de conteúdo:
```js
await Mail.send(['welcome', 'welcome.text'])
```

No exemplo acima, a view `welcome` é usada para a versão HTML do e-mail, enquanto a view `welcome.text` é usada para a versão em texto simples.

> Se você estiver usando o Edge como seu mecanismo de template, você também pode usar em `‑text` ao invés vez de `.text`
> como o sufixo no corpo do template de texto simples.

Usando sufixos de templates, você também pode definir o corpo do e-mail para o Apple Watch por exemplo:
``` js
await Mail.send(['welcome', 'welcome.text', 'welcome.watch'])
```

#### raw(body, callback)
Use uma string bruta para enviar o e-mail (quando a string for HTML, o corpo do HTML no e-mail será definido, caso contrário, 
apenas um e-mail de texto simples será enviado):

```js
await Mail.raw('plain text email', (message) => {
  message.from('foo@bar.com')
  message.to('baz@bar.com')
})

await Mail.raw('<h1> HTML email </h1>', (message) => {
  message.from('foo@bar.com')
  message.to('baz@bar.com')
})
```

## API de mensagem
Abaixo está a lista de métodos que você pode usar para construir uma mensagem de correio usando a messageAPI fluente .

#### to(address, [name])

Definir endereço de destino:
```js
message.to(user.email)

// Ambos com nome e email
message.to(user.email, user.name)
```
#### from(address, [name])

Definir endereço de origem:
```js
message.from('team@yardstick.io')

// Ambos com nome e email
message.from('team@yardstick.io', 'Yardstick')
```

#### cc(address, [name])
Adicione o endereço Cc ao e-mail:
```js
message.cc(user.email)

// Ambos com nome e email
message.cc(user.email, user.name)
```

#### bcc(address, [name])
Adicione o endereço Cco ao e-mail:

```js
message.bcc(user.email)

// Ambos com nome e email
message.bcc(user.email, user.name)
```

> Você pode chamar os métodos acima várias vezes para definir vários endereços.

#### replyTo(address, [name])
Defina o endereço `replyTo` de e-mail:
```js
message.replyTo('noreply@yardstick.io')
```

#### inReplyTo(messageId)
Definir o id da mensagem de e-mail:
```js
message.inReplyTo(someThread.id)
```

#### subject(value)
Defina o assunto do e-mail:
```js
message.subject('Welcome to yardstick')
```

#### text(value)
Defina manualmente o corpo do texto simples para o e-mail:
```js
message.text('Email plain text version')
```

#### attach(filePath, [options])
Anexe arquivo(s) ao e-mail:

```js
message
  .attach(Helpers.tmpPath('guides/getting-started.pdf'))
```

Definir o nome do arquivo personalizado:

```js
message
  .attach(Helpers.tmpPath('guides/getting-started.pdf'), {
    filename: 'Getting-Started.pdf'
  })
```

#### attachData(data, filename, [options])
Anexe dados brutos como um `String`, `Buffer` ou `Stream`:
```js
message.attachData('hello', 'hello.txt')

// buffer
message.attachData(new Buffer('hello'), 'hello.txt')

// stream
message.attachData(fs.createReadStream('hello.txt'), 'hello.txt')
```

#### embed(filePath, cid, [options])
Incorpore uma imagem ao corpo do HTML usando um ID de conteúdo:
```js
message.embed(Helpers.publicPath('logo.png'), 'logo')
```

Então, dentro do modelo, você pode dizer:
```html
<img src="cid:logo" />
```
> Certifique-se de que o `cid` é exclusivo para cada imagem em um determinado e-mail.

#### driverExtras(extras)
Passe um objeto de valores para o driver atual:
```js
message.driverExtras({ campaign_id: 20 })
```

O Provedor de Email passa o objeto para o driver, e cabe ao driver consumir esses valores.

## Troca de conexões
O Provedor de Email define várias conexões dentro do arquivo `config/mail.js`:

```js
// config/mail.js

{
  connection: 'smtp',

  smtp: {},

  sparkpost: {
    driver: 'sparkpost',
    apiKey: Env.get('SPARKPOST_API_KEY'),
    extras: {}
  }
}
```

Usando a configuração acima, você pode alternar para a conexão `sparkpost` por meio do método `connection` assim:

```js
await Mail
  .connection('sparkpost')
  .send('view', data, (message) => {
  })
```

## Drivers
Abaixo estão as instruções de configuração relacionadas a cada driver específico.

#### SES
O driver `ses` requer o pacote `aws-sdk`.

Certifique-se de instalar o `npm` antes de usar o driver `ses`:
```bash
npm i aws-sdk
```

#### SparkPost
O driver `sparkpost` aceita um objeto opcional `extras` de configuração:

```js
// config/mail.js

{
  extras: {
    campaign_id: '',
    options: {}
  }
}
```

Verifique a documentação do [SparkPost](https://developer.sparkpost.com/api/transmissions.html#header-options-attributes) para saber mais sobre as opções disponíveis.

Você também pode passar `extras` no tempo de execução usando o método `driverExtras`:
```js
await Mail.send('view', data, (message) => {
  message.driverExtras({
    campaign_id: '',
    options: {}
  })
})
```

#### Mailgun
O driver `mailgun` aceita um objeto `extras` de configuração opcional:
```js
// config/mail.js
{
  extras: {
    'o:tag': '',
    'o:campaign': ''
  }
}
```

Verifique a documentação do [Mailgun](https://mailgun-documentation.readthedocs.io/en/latest/api-sending.html#sending) 
para saber mais sobre as opções disponíveis.

Você também pode passar `extras` no tempo de execução usando o método `driverExtras`:
```js
await Mail.send('view', data, (message) => {
  message.driverExtras({
    'o:tag': '',
    'o:campaign': ''
  })
})
```
