# Mail

O envio de e-mail é uma tarefa comum para aplicativos da web. O *Mail Provider* oficial do AdonisJs torna muito fácil e intuitivo enviar e-mails usando um dos drivers disponíveis.

## Drivers
Abaixo está a lista de drivers disponíveis e você pode estender e adicionar seus drivers personalizados.

1. SMTP (smtp).
2. Amazon SES (ses).
3. Mandrill (mandrill).
4. MailGun (mailgun).
5. Log (log)

> DICA: O driver `log` é usado ao executar testes, pois ele registrará e-mails em um arquivo em vez de enviá-los para pessoas reais.

## Configuração
O provedor de e-mail não faz parte da instalação base, e você precisa obter o pacote do *npm* e registrar o provedor. Vamos fazer uma configuração rápida de 2 minutos.

```bash
# Install From Npm

npm i --save adonis-mail-provider
```

Em seguida, precisamos registrar o provedor e configurar um alias para o mesmo.

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
Além disso, um arquivo de configuração precisa ser salvo como `config/mail.js`. Você pode baixar a configuração de exemplo do [github](https://raw.githubusercontent.com/adonisjs/adonis-mail/master/examples/mail.js) ou executar o comando bash abaixo para salvar o arquivo automaticamente.

```bash
# Download using wget

wget https://raw.githubusercontent.com/adonisjs/adonis-mail/master/examples/mail.js -O config/mail.js
```

## Exemplo básico
Vamos dar um exemplo básico de envio de um e-mail de boas-vindas ao usuário recém-registrado. Precisamos configurar uma rota e uma visualização antes de enviar o e-mail.

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

1. Certifique-se de validar os detalhes do usuário antes de salvá-los no BD.
2. O método `Mail.send` enviará o e-mail aceitando um caminho para a visualização como o primeiro parâmetro.

```bash
# Creating emails.welcome view

./ace make:view emails/welcome
```

```twig
<!-- resources/views/emails/welcome.njk -->

<h2> Heya {{ firstname}} </h2>

<p> Welcome to the kitten's world. We will be sharing lots of cute kittens with you soon</p>
```

## Métodos de e-mail
Abaixo está a lista de métodos a serem usados ​​para enviar e-mails.

#### send(view, data, callback, [configKey])
O método `send` compilará uma visualização com os dados fornecidos e a enviará como HTML. O retorno de chamada anexado fornece acesso ao [construtor de mensagens](#message-builder) para definir as propriedades do e-mail.

```js
yield Mail.send('receipt', {name: 'Doe', amount: 22}, message => {
  // ...
})
```

#### raw(body, callback, [configKey])
Envie e-mails usando texto bruto, em vez de usar uma visualização.

```js
yield Mail.raw('Your security code is 301030', message => {
  message.from('secret@yourcompany.com')
  message.to('doe@example.org', 'Doe')
})
```

## Message Builder
O Message Builder torna super fácil encadear métodos e construir o corpo da mensagem. O argumento `message` passado para o método *Mail.send* é uma instância do construtor de mensagens e abaixo está a lista de métodos que você pode chamar nele.

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
Defina a prioridade do e-mail. Precisa ser uma das seguintes:

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
Anexar um arquivo ao e-mail

```js
message.attach(path.join(__dirname, '/assets/logo.png'))
message.attach(path.join(__dirname, '/assets/logo.png'), { filename: 'MyLogo.png' })
```

Opções de anexo

| Chave               | Tipo    | Descrição     |
|---------------------|---------|---------------|
| filename            | String  | Nome do arquivo. Se não for definido, será escolhido do caminho do arquivo.  |
| contentType         | String  | Anexo *Tipo de conteúdo*. Se não for definido, será escolhido da extensão do arquivo.  |
| contentDisposition  | String  | Disposição de conteúdo, padrão para anexo.  |
| encoding            | String  | A codificação do anexo deve ser *base64*, *hex* e *binário*. |

#### attachData(data, filename, [options])
Anexe dados brutos como um anexo ao e-mail.

> DICA: As opções de anexo são as mesmas do método `attach`.

```js
message.attachData('some raw content', 'raw.txt')
```

#### embed(filePath, cid, [options])
Incorpore um arquivo no corpo do e-mail. O `cid` deve ser exclusivo e é necessário para que você possa referenciá-lo dentro de suas visualizações HTML.

```js
message.embed(path.join(__dirname, '/assets/logo.png'), 'logo')
```

```twig
<!-- Embedding inside views -->

<img src="cid:logo" />
```

#### html(body)
O HTML do e-mail é criado automaticamente a partir da visualização. Se por algum motivo você quiser substituir, use este método.

```js
message.html('My custom html')
```

#### text(body)
Defina *plaintext* para o e-mail. Ele é definido para os clientes de e-mail que não suportam HTML.

> DICA: Todos os clientes de e-mail populares suportam HTML.

```js
message.text('A plaintext view')
```

#### watchHtml(body)
Defina o HTML a ser exibido para o *Apple Watch*.

```js
message.watchHtml('Email body for apple watch')
```

## Passando múltiplas visualizações
Você pode definir múltiplas visualizações para *HTML*, *Texto simples* e *Apple Watch* passando uma matriz para o método [send](#sendview-data-callback-configkey).

```js
yield Mail.send(['welcome', 'welcome-text', 'welcome-watch'], {}, message => {
  // ...
})
```

## Trocando drivers
O driver padrão definido dentro do arquivo de configuração é usado para enviar e-mails, mas você pode alternar entre drivers em tempo de execução usando o método `driver`.

```js
const mandrill = Mail.driver('mandrill')

yield mandrill.send('emails.welcome', {}, message => {
  // ...
})
```

## Adicionando novos drivers
Você também pode adicionar novos drivers ao *Provedor de e-mail* estendendo-o e aqui estão alguns pontos a serem lembrados.

1. O AdonisJs usa internamente [nodemailer](https://github.com/nodemailer/nodemailer) para enviar e-mails. Você também pode encapsular um transporte nodemailer existente em um driver.
2. Seu driver deve ter um método `send`.

Vamos usar [nodemailer postmark transport](https://github.com/killmenot/nodemailer-postmark-transport) para criar um novo driver e registrá-lo via contêiner IoC.

### Escrevendo Driver

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

1. Criamos um transporte padrão chamando o método `_createTransport` e passando a chave para o bloco de configuração.
2. Aqui usamos o método `get` [config provider](/markdown/03-getting-started/03-configuration.md) para extrair a configuração para a chave fornecida.
3. Em seguida, retornamos uma instância do transporte nodemailer.
4. Dentro do método `send`, criamos o transporte se um usuário definir uma chave de configuração diferente no tempo de execução. Caso contrário, usamos o transporte padrão.
5. Finalmente, enviaremos o e-mail usando o método de transporte `sendMail`.

### Registrando o driver
Estamos prontos para registrar o driver estendendo o provedor de e-mail.

```js
// bootstrap/extend.js

const Ioc = use('adonis-fold').Ioc
const Postmark = require('../src/PostMark')

Ioc.extend('Adonis/Addons/Mail', 'postmark', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new PostMark(Config)
})
```

### Usando o driver PostMark
```js
yield Mail.driver('postmark').send('emails.welcome', {}, message => {
  // ...
})
```

## Testando e-mails
O AdonisJs envia um *Log Driver*, que pode ser usado ao escrever testes. O Log Driver salvará todos os e-mails no arquivo *storage/logs/mail.eml* como uma string. Você pode analisar esse arquivo para fazer asserções de teste.
