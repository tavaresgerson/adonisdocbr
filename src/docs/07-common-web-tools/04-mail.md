# E-mail

Enviar e-mail é uma tarefa comum para aplicativos web. O provedor oficial de e-mail do AdonisJs torna isso tão fácil e intuitivo de usar um dos drivers disponíveis.

## Drivers
Abaixo está a lista de drivers disponíveis e você é livre para estendê-los e adicionar seus próprios drivers personalizados.

1. SMTP (smtp).
2. Amazon SES (ses).
3. Mandril (mandrill).
4. MailGun (mailgun).
5. Log (log)

> DICA:
> O driver 'log' é usado quando executar os testes, pois ele irá registrar e-mails em um arquivo em vez de enviá-los para as pessoas reais.

## Configuração
O provedor de e-mail não faz parte da instalação básica, e você precisa puxar o pacote do npm e registrar o provedor. Vamos fazer uma configuração rápida de 2min.

```bash
# Install From Npm

npm i --save adonis-mail-provider
```

Em seguida, precisamos registrar o provedor e configurar um apelido para ele.

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

## Configuração
Além disso, um arquivo de configuração precisa ser salvo como `config/mail.js`. Você pode baixar a configuração de amostra do [github](https://raw.githubusercontent.com/adonisjs/adonis-mail/master/examples/mail.js) ou executar o seguinte comando bash para salvar o arquivo automaticamente.

```bash
# Download using wget

wget https://raw.githubusercontent.com/adonisjs/adonis-mail/master/examples/mail.js -O config/mail.js
```

## Exemplo básico
Vamos pegar um exemplo básico de enviar um e-mail de boas-vindas ao usuário recém-registrado. Precisamos configurar uma rota e uma visão antes de enviar o e-mail.

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

1. Certifique-se de validar os detalhes do usuário antes de salvá-los no banco de dados.
2. O método `Mail.send` enviará o e-mail aceitando um caminho para a visualização como o primeiro parâmetro.

```bash
# Creating emails.welcome view

./ace make:view emails/welcome
```


```twig
{# resources/views/emails/welcome.njk #}

<h2> Heya {{ firstname}} </h2>

<p> Welcome to the kitten's world. We will be sharing lots of cute kittens with you soon</p>
```

## Métodos de Email
Abaixo está a lista de métodos para enviar e-mails.

#### send(view, dados, callback, [configKey])
O método 'send' irá compilar uma visualização com os dados fornecidos e enviá-la como HTML. O retorno de chamada anexado lhe dá acesso ao xref:_message_builder[construidor de mensagens] para definir as propriedades do e-mail.

```js
yield Mail.send('receipt', {name: 'Doe', amount: 22}, message => {
  // ...
})
```

#### raw(body, callback, [configKey])
Enviar e-mail usando texto cru, em vez de usar uma visão.

```js
yield Mail.raw('Your security code is 301030', message => {
  message.from('secret@yourcompany.com')
  message.to('doe@example.org', 'Doe')
})
```

## Mensageiro
Message Builder facilita muito a cadeia de métodos e a construção do corpo da mensagem. O argumento "message" passado para o método Mail.send é uma instância do Message Builder, e abaixo está a lista dos métodos que você pode chamar nele.

#### from(email, [nome])
```js
yield Mail.send('receipt', {}, message => {
  message.from('awesome@adonisjs.com', 'AdonisJs')
})
```

#### enviar(email, [nome])
```js
yield Mail.send('receipt', {}, message => {
  message.sender('awesome@adonisjs.com', 'AdonisJs')
})
```

#### replyTo(email, [nome])
```js
yield Mail.send('receipt', {}, message => {
  message.replyTo('noreply@adonisjs.com')
})
```

#### para (e-mail, [nome])
```js
yield Mail.send('receipt', {}, message => {
  message.to('johndoe@example.com', 'John Doe')
})
```

#### cc(email, [nome])
```js
yield Mail.send('receipt', {}, message => {
  message.cc('jamie@example.com', 'Jamie Doe')
})
```

#### Enviar email para [nome] com cco(email)
```js
yield Mail.send('receipt', {}, message => {
  message.bcc('finance@example.com')
})
```

#### assunto (mensagem)
```js
yield Mail.send('receipt', {}, message => {
  message.subject('Recent purchase receipt')
})
```

#### prioridade(nível)
Defina a prioridade do e-mail. Ele precisa ser um dos seguintes:

* alto
* baixo
* normal

```js
message.priority('high')
```

#### header(chave, valor)
```js
message.header('x-id', 1)
```

#### headers(arrayOfHeaders)
```js
message.header([{ key: 'x-id', value: 1 }])
```

#### attach(filePath, [options])
Anexe um arquivo ao e-mail

```js
message.attach(path.join(__dirname, '/assets/logo.png'))
message.attach(path.join(__dirname, '/assets/logo.png'), { filename: 'MyLogo.png' })
```

##### Opções de anexo

| Chave | Tipo | Descrição |
|-----|------|----------------|
| nome do arquivo | String | Nome do arquivo. Se não for definido, será extraído do caminho do arquivo. |
| contentType | String | Anexos *Tipo de conteúdo*. Se não for definido, será extraído da extensão do arquivo. |
| disposição do conteúdo | String | Content-disposition, padrão para download. |
| codificação | String | A codificação de anexos deve ser de *base64*, *hex* e *binário*. |

#### attachData(dados, nome_arquivo, [opções])
Anexar dados brutos como um anexo no e-mail.

> DICA:
> As opções de anexação são as mesmas do método `attach`.

```js
message.attachData('some raw content', 'raw.txt')
```

#### embed(filePath, cid, [opções])
Inserir um arquivo no corpo do e-mail. O 'cid' deve ser único e é necessário para que você possa referenciá-lo dentro de suas visualizações HTML.

```js
message.embed(path.join(__dirname, '/assets/logo.png'), 'logo')
```

```twig
{# Embedding inside views #}

<img src="cid:logo" />
```

#### html(corpo)
O HTML do e-mail é criado automaticamente a partir da visualização. Se por algum motivo você quiser sobrescrever, utilize este método.

```js
message.html('My custom html')
```

#### texto(corpo)
Defina *texto simples* para o e-mail. É definido para os clientes de e-mail que não suportam HTML.

> DICA:
> Todos os clientes de e-mail populares suportam HTML.

```js
message.text('A plaintext view')
```

#### watch('body')
Configure o HTML para ser exibido no *Apple Watch*.

```js
message.watchHtml('Email body for apple watch')
```

## Passando Múltiplas Vistas
Você pode definir múltiplas visualizações para *HTML*, *Texto Simples* e *Apple Watch* passando uma matriz para o método xref:_send_view_data_callback_configkey[send].

```js
yield Mail.send(['welcome', 'welcome-text', 'welcome-watch'], {}, message => {
  // ...
})
```

## Switching Drivers
O driver padrão definido dentro do arquivo de configuração é usado para enviar e-mails, mas você pode alternar entre os drivers em tempo de execução usando o método "driver".

```js
const mandrill = Mail.driver('mandrill')

yield mandrill.send('emails.welcome', {}, message => {
  // ...
})
```

## Adicionando Novos Drivers
Você também pode adicionar novos drivers para o *Mail Provider* estendendo-o e aqui estão alguns pontos a se considerar.

1. O AdonisJs internamente utiliza [nodemailer](https://github.com/nodemailer/nodemailer) para enviar e-mails. Você também pode envolver um transporte existente do nodemailer em um motorista.
Seu motorista deve ter um método 'enviar'.

Vamos usar o [nodemailer postmark transport](https://github.com/killmenot/nodemailer-postmark-transport) para criar um novo driver e registrá-lo via injeção de dependência.

### Escrever Driver

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

1. Criamos um transporte padrão chamando o método `_createTransport` e passando-lhe a chave do bloco de configuração.
Aqui usamos o método [config provider](/getting-started/configuration) `get` para buscar a configuração para a chave dada.
3. Em seguida, retornamos uma instância do transporte nodemailer.
4. Dentro do método send criamos o transporte se um usuário definir uma chave de configuração diferente em tempo de execução. Caso contrário, usamos o transporte padrão.
5. Finalmente, enviaremos o e-mail usando o método de transporte `sendMail`.

### Registrando o motorista
Estamos prontos para registrar o provedor de correio estendendo-o.

```js
// bootstrap/extend.js

const Ioc = use('adonis-fold').Ioc
const Postmark = require('../src/PostMark')

Ioc.extend('Adonis/Addons/Mail', 'postmark', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new PostMark(Config)
})
```

### Usando o driver Postman
```js
yield Mail.driver('postmark').send('emails.welcome', {}, message => {
  // ...
})
```

## Teste de Email
O AdonisJS envia um *Driver de Log*, que pode ser usado ao escrever testes. O Driver de Log salvará todos os e-mails no arquivo *storage/logs/mail.eml* como uma string. Você pode analisar este arquivo para fazer afirmações de teste.
