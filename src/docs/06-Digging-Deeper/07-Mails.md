---
title: Mail
category: digging-deeper
---

# Mail

O AdonisJs tem suporte de primeira classe para envio de e-mail.

O *Mail Provider* suporta vários drivers, incluindo:

- Smtp (`smtp`)
- Spark Post (`sparkpost`)
- Mailgun (`mailgun`)
- Amazon SES (`ses`)

## Configuração
Como o *Mail Provider* não é instalado por padrão, precisamos obtê-lo do `npm`:

```bash
adonis install @adonisjs/mail
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/mail/providers/MailProvider'
]
```

> NOTA: A configuração do e-mail é salva dentro do arquivo `config/mail.js`, que é criado pelo comando `adonis install` ao instalar o *Mail Provider*.

## Exemplo básico
Vamos começar com o exemplo básico de envio de e-mail no registro do usuário:

```js
// .start/routes.js

Route.post('user', 'UserController.store')
```

```js
// .app/Controllers/Http/UserController.js

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

Finalmente, crie o arquivo de visualização `emails/welcome.edge` contendo o corpo HTML:

```edge
.resources/views/emails/welcome.edge

<h2> Hello {{ username }} </h2>
<p>
  Welcome to the yardstick club, here's your getting started guide
</p>
```

## API de e-mail
Abaixo está a lista de métodos que você pode usar para enviar e-mails.

#### `send(views, data, callback)`
Envie e-mail usando uma ou muitas [visualizações do Edge](/original/markdown/04-Basics/06-Views.md):

```js
await Mail.send('view', data, (message) => {
  message
    .from('')
    .to('')
})
```

O argumento `views` pode ser uma única visualização ou uma matriz de visualizações por tipo de conteúdo:

```js
await Mail.send(['welcome', 'welcome.text'])
```

No exemplo acima, a visualização `welcome` é usada para a versão HTML do e-mail, enquanto a visualização `welcome.text` é usada para a versão em texto simples.

> DICA: Se você estiver usando [Edge](http://edge.adonisjs.com/) como seu mecanismo de modelo, também poderá usar `‑text` em vez de `.text` como o sufixo do modelo de corpo de texto simples.

Usando sufixos de modelo, você também pode definir o corpo do e-mail para *Apple watch*:

```js
await Mail.send(['welcome', 'welcome.text', 'welcome.watch'])
```

#### raw(body, callback)
Use uma string bruta para enviar o e-mail (quando a string for HTML, o *corpo HTML* do e-mail será definido, caso contrário, apenas um e-mail de texto simples será enviado):

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
Abaixo está a lista de métodos que você pode usar para criar uma mensagem de e-mail usando a API fluente `message`.

#### `to(address, [name])`
Definir endereço `to`:

```js
message.to(user.email)

// with email and name both
message.to(user.email, user.name)
```

#### `from(address, [name])`
Definir endereço `from`:

```js
message.from('team@yardstick.io')

// with email and name both
message.from('team@yardstick.io', 'Yardstick')
```

#### `cc(address, [name])`
Adicionar endereço cc ao e-mail:

```js
message.cc(user.email)

// with email and name both
message.cc(user.email, user.name)
```

#### `bcc(address, [name])`
Adicionar endereço bcc ao e-mail:

```js
message.bcc(user.email)

// with email and name both
message.bcc(user.email, user.name)
```

> NOTA: Você pode chamar os métodos acima várias vezes para definir vários endereços.

#### `replyTo(address, [name])`
Definir endereço de e-mail `replyTo`:

```js
message.replyTo('noreply@yardstick.io')
```

#### `inReplyTo(messageId)`
Definir ID da mensagem de e-mail:

```js
message.inReplyTo(someThread.id)
```

#### `subject(value)`
Definir assunto do e-mail:

```js
message.subject('Welcome to yardstick')
```

#### `text(value)`
Definir manualmente o corpo de texto simples para o e-mail:

```js
message.text('Email plain text version')
```

#### `attach(filePath, [options])`
Anexar arquivo(s) ao e-mail:

```js
message
  .attach(Helpers.tmpPath('guides/getting-started.pdf'))
```

Definir nome de arquivo personalizado:

```js
message
  .attach(Helpers.tmpPath('guides/getting-started.pdf'), {
    filename: 'Getting-Started.pdf'
  })
```

#### `attachData(data, filename, [options])`
Anexar dados brutos como uma `String`, `Buffer` ou `Stream`:

```js
message.attachData('hello', 'hello.txt')

// buffer
message.attachData(new Buffer('hello'), 'hello.txt')

// stream
message.attachData(fs.createReadStream('hello.txt'), 'hello.txt')
```

#### `embed(filePath, cid, [options])`
Incorporar uma imagem no corpo HTML usando um *content id*:

```js
message.embed(Helpers.publicPath('logo.png'), 'logo')
```

Então, dentro do modelo, você pode dizer:

```edge
<img src="cid:logo" />
```

> OBSERVAÇÃO: Garanta que o `cid` seja exclusivo para cada imagem em um determinado e-mail.

#### `driverExtras(extras)`
Passar um objeto de valores para o driver atual:

```js
message.driverExtras({ campaign_id: 20 })
```

O *Provedor de E-mail* passa o objeto para o driver, e cabe ao driver consumir esses valores.

## Trocando Conexões
O *Provedor de E-mail* define múltiplas conexões dentro do arquivo `config/mail.js`:

```js
// .config/mail.js

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

Usando a configuração acima, você pode alternar para a conexão `sparkpost` através do método `connection` assim:

```js
await Mail
  .connection('sparkpost')
  .send('view', data, (message) => {
  })
```

## Drivers
Abaixo estão as instruções de configuração relacionadas a cada driver específico.

### SES
O driver `ses` requer o pacote [aws-sdk](https://npmjs.org/package/aws-sdk).

Certifique-se de instalá-lo via `npm` antes de usar o driver `ses`:

```bash
npm i aws-sdk
```

### SparkPost
O driver `sparkpost` aceita um objeto de configuração `extras` opcional:

```js
// .config/mail.js

{
  extras: {
    campaign_id: '',
    options: {}
  }
}
```

Confira a [documentação](https://developer.sparkpost.com/api/transmissions.html#header-options-attributes) do SparkPost para saber mais sobre suas opções disponíveis.

Você também pode passar `extras` em tempo de execução usando o método `driverExtras`:

```js
await Mail.send('view', data, (message) => {
  message.driverExtras({
    campaign_id: '',
    options: {}
  })
})
```

### Mailgun
O driver `mailgun` aceita um objeto de configuração `extras` opcional:

```js
// .config/mail.js

{
  extras: {
    'o:tag': '',
    'o:campaign': ''
  }
}
```

Confira a [documentação](https://mailgun-documentation.readthedocs.io/en/latest/api-sending.html#sending) do Mailgun para saber mais sobre suas opções disponíveis.

Você também pode passar `extras` em tempo de execução usando o método `driverExtras`:

```js
await Mail.send('view', data, (message) => {
  message.driverExtras({
    'o:tag': '',
    'o:campaign': ''
  })
})
```
