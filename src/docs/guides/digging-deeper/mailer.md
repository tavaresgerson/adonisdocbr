# Mailer

Você pode enviar e-mails do seu aplicativo usando o módulo Mailer do AdonisJS. Ele é construído em cima do [nodemailer](https://nodemailer.com/about/) com algumas adições como **visualização de e-mails** e a capacidade de **capturar e-mails durante os testes**.

Antes de começar a enviar e-mails, certifique-se de instalar e configurar o pacote usando as seguintes instruções.

::: code-group

```sh [Instale]
npm i @adonisjs/mail@8.2.1
```

```sh [Configure]
node ace configure @adonisjs/mail

# CREATE: config/mail.ts
# CREATE: contracts/mail.ts
# UPDATE: .env,.env.example
# UPDATE: tsconfig.json { types += "@adonisjs/mail" }
# UPDATE: .adonisrc.json { commands += "@adonisjs/mail/build/commands" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/mail" }
```

```ts [Validar variáveis ​​de ambiente]
/**
 * Dependendo do driver de e-mail que você está usando, você deve validar
 * as variáveis ​​de ambiente necessárias para ele.
 *
 * A seguir está um exemplo com Mailgun
 */
export default Env.rules({
  MAILGUN_API_KEY: Env.schema.string(),
  MAILGUN_DOMAIN: Env.schema.string(),
})
```

:::

- Suporte para vários drivers. **SparkPost**, **SES**, **Mailgun** e **Smtp**
- Capacidade de capturar e-mails durante os testes
- Use modelos do Edge para definir a marcação de e-mail
- Visualize e-mails em um servidor SMTP fictício

&nbsp;

* [Visualizar no npm](https://npm.im/@adonisjs/mail)
* [Visualizar no GitHub](https://github.com/adonisjs/mail)

## Config
A configuração do pacote de e-mail é armazenada dentro do arquivo `config/mail.ts`. Dentro deste arquivo, você pode definir vários mailers usando os mesmos drivers ou drivers diferentes.

```ts
import { mailConfig } from '@adonisjs/mail/build/config'

export default mailConfig({
  mailer: 'mailgun',
  mailers: {
    mailgun: {
      driver: 'mailgun',
      baseUrl: 'https://api.mailgun.net/v3',
      key: Env.get('MAILGUN_API_KEY'),
      domain: Env.get('MAILGUN_DOMAIN'),
    },

    smtp: {
      driver: 'smtp',
      host: Env.get('SMTP_HOST') as string,
      port: Env.get('SMTP_PORT') as string,
    },
  },
})
```

#### `mailer`
A propriedade mailer define o mailer padrão a ser usado para enviar e-mails.

#### `mailers`

O objeto `mailers` define uma lista de mailers que você deseja usar. Cada mailer deve especificar o driver que deseja usar.

#### Opções do Mailgun
O driver do mailgun aceita opcionalmente as seguintes opções.

| Opção de configuração | Variante do Mailgun |
|-----------------------|---------------------|
| `oTags`               | o\:tag              |
| `oDeliverytime`       | o\:deliverytime     |
| `oTestMode`           | o\:testmode         |
| `oTracking`           | o\:tracking         |
| `oTrackingClick`      | o\:tracking-clicks  |
| `oTrackingOpens`      | o\:tracking-opens   |
| `oDkim`               | o\:dkim             |
| `headers`             | h\:\<header-name>   |

Você também pode passar todas as opções, exceto `oDkim`, durante a chamada `Mail.send`.

```ts
await Mail.use('mailgun').send((message) => {
  message.subject('Welcome Onboard!')
}, {
  oTags: ['signup'],
})
```

#### Opções do Sparkpost
O driver sparkpost aceita opcionalmente as seguintes opções.

| Opção de configuração | Variante Sparkpost |
|-------------------|-------------------|
| `startTime`       | start_time        |
| `openTracking`    | open_tracking     |
| `clickTracking`   | click_tracking    |
| `transactional`   | transactional     |
| `sandbox`         | sandbox           |
| `skipSuppression` | skip_suppression  |
| `ipPool`          | ip_pool           |

Você também pode definir todas as opções de configuração em tempo de execução durante a chamada `Mail.send`.

```ts
await Mail.use('sparkpost').send((message) => {
  message.subject('Welcome Onboard!')
}, {
  transaction: true,
  openTracking: false,
})
```

#### Opções de autenticação SMTP
Você pode definir as opções de autenticação para as conexões SMTP da seguinte forma:

```ts
{
  smtp: {
    driver: 'smtp',
    auth: {
      type: 'login'
      user: 'username'
      pass: 'password'
    }
  }
}

// Usando Oauth2
{
  smtp: {
    driver: 'smtp',
    auth: {
      type: 'OAuth2',
      user: 'username',
      clientId: 'clientId',
      clientSecret: 'clientSecret',
      refreshToken?: 'refreshToken',
      accessToken?: 'accessToken',
      expires?: 3600,
      accessUrl?: 'accessUrl'
    }
  }
}
```

### Configurando novos mailers
Você também pode configurar novos mailers após a configuração inicial. Use o [config stub](https://github.com/adonisjs/mail/blob/develop/templates/config.txt) como referência para copiar as opções padrão para todos os drivers.

Além disso, você deve definir os mailers dentro do arquivo `contracts/mail.ts` antes de poder definir sua configuração ou usá-lo para enviar e-mails. O arquivo contracts é uma maneira de informar o compilador estático TypeScript sobre a existência do mailer.

```ts
declare module '@ioc:Adonis/Addons/Mail' {
  import { MailDrivers } from '@ioc:Adonis/Addons/Mail'

  interface MailersList {
    smtp: MailDrivers['smtp'],
    ses: MailDrivers['ses'],
    mailgun: MailDrivers['mailgun'],
    sparkpost: MailDrivers['sparkpost'],
  }
}
```

A interface `MailersList` é um par de chave-valor do nome do mailer e do driver que ele usa. A chave pode ser qualquer coisa. Por exemplo:

```ts
interface MailersList {
  transactional: MailDrivers['mailgun'],
  newsletter: MailDrivers['sparkpost'],
}
```

## Uso
Depois de concluir a configuração, você pode importar o módulo `Mail` e enviar e-mails usando o método `Mail.send`. Ele aceita uma função de retorno de chamada para permitir que você configure a mensagem de saída.

No exemplo a seguir, o método `htmlView` aceita o caminho para um modelo do Edge e os dados que você deseja passar para ele.

```ts {1,5-11}
import Mail from '@ioc:Adonis/Addons/Mail'

class UsersController {
  public async store() {
    await Mail.send((message) => {
      message
        .from('info@example.com')
        .to('virk@adonisjs.com')
        .subject('Welcome Onboard!')
        .htmlView('emails/welcome', { name: 'Virk' })
    })
  }
}
```

### Adiar envio de e-mail
Você pode usar o método `Mail.sendLater` para enviar o e-mail para uma fila na memória. Isso garante que o e-mail seja enviado em segundo plano e não bloqueie a solicitação HTTP em andamento. Por exemplo:

```ts {3-4}
class UsersController {
  public async store() {
    // Enviado para a fila na memória
    await Mail.sendLater((message) => {
      message
        .from('info@example.com')
        .to('virk@adonisjs.com')
        .subject('Welcome Onboard!')
        .htmlView('emails/welcome', { name: 'Virk' })
    })
  }
}
```

## Modelos de e-mail
Você pode usar modelos padrão do Edge para definir o conteúdo do e-mail. Os modelos ficam dentro do mesmo diretório `resources/views`. Para melhor organização, você pode movê-los para dentro de um subdiretório chamado `emails`. Por exemplo:

```sh
node ace make:view emails/welcome

# ✔  create    resources/views/emails/welcome.edge
```

Abra o arquivo de modelo recém-criado e cole o seguinte conteúdo dentro dele.

```edge
<h1> Welcome {{ user.fullName }} </h1>
<p>
  <a href="{{ url }}">Click here</a> to verify your email address.
</p>
```

Finalmente, você pode referenciar o modelo da seguinte forma.

```ts
await Mail.sendLater((message) => {
  message.htmlView('emails/welcome', {
    user: { fullName: 'Some Name' },
    url: 'https://your-app.com/verification-url',
  })
})
```

Você também pode atribuir modelos para o texto simples e o conteúdo do Apple Watch.

```ts
// Plain text

message.textView('emails/welcome.plain', {})
```

```ts
// Apple watch

message.watchView('emails/welcome.watch', {})
```

### Usando MJML para criar seu modelo
Aqui está um screencast mostrando como usar [MJML](https://mjml.io/) como sua linguagem de marcação para e-mails.

<iframe width="560" height="315" src="https://www.youtube.com/embed/zehb-qUzRCM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Anexos
Você pode enviar anexos usando o método `message.attach`. Ele pega um caminho absoluto para o arquivo a ser anexado.

```ts
import Mail from '@ioc:Adonis/Addons/Mail'
import Application from '@ioc:Adonis/Core/Application'

await Mail.sendLater((message) => {
  message.attach(Application.tmpPath('receipt.png'))
})
```

O tipo de conteúdo do arquivo, codificação e cabeçalhos são derivados do nome do arquivo. No entanto, você pode substituir os padrões definindo-os explicitamente.

```ts
message.attach(
  Application.tmpPath('receipt.png'),
  {
    filename: `${transaction.id}.png`,
    contentDisposition: 'attachment',
    contentType: 'image/png',
  }
)
```

### Streams e buffers como anexos
Você também pode enviar um Buffer ou um stream diretamente como um anexo usando o método `message.attachData`.

::: info NOTA
- Certifique-se de definir o nome do arquivo explicitamente ao passar um buffer ou um stream.
- Você não pode usar o método `attachData` com `Mail.sendLater`, pois streams e buffers não podem ser serializados em trabalhos de fila.
:::

```ts
message.attachData(
  fs.createReadStream('file.txt'),
  {
    filename: 'file.txt'
  }
)
```

```ts
message.attachData(
  Buffer.from('hello world'),
  {
    filename: 'file.txt'
  }
)
```

## Incorporando imagens
Existem [várias maneiras](https://blog.mailtrap.io/embedding-images-in-html-email-have-the-rules-changed) de renderizar imagens dentro do corpo do e-mail. Um exemplo é enviar a imagem como um anexo e então adicioná-la ao HTML usando seu Content-Id (CID).

Você pode usar o método `message.embed` e passar o caminho absoluto do arquivo, junto com um id exclusivo como o segundo argumento.

```ts
await Mail.sendLater((message) => {
  message.embed(
    Application.publicPath('receipt.png'),
    'a-unique-id-for-the-attachment',
  )
})
```

Dentro do modelo Edge, você pode usar o id exclusivo definido anteriormente como o src `img`.

```edge
<!-- Email template -->

<img src="cid:a-unique-id-for-the-attachment" />
```

Semelhante ao [message.attachData](#streams-and-buffers-as-attachments), você também pode incorporar um Buffer ou um fluxo diretamente usando o método `embedData`.

::: info NOTA
Você não pode usar o método `embedData` com `Mail.sendLater`, pois fluxos e buffers não podem ser serializados em trabalhos de fila.
:::

```ts
message.embedData(
  fs.createReadStream('file.txt'),
  'a-unique-id-for-the-attachment',
)
```

## Eventos de calendário
Você pode anexar eventos de calendário (arquivos .ics) usando o método `message.icalEvent`. O método aceita o conteúdo do convite como uma string ou um retorno de chamada para gerar o conteúdo programaticamente.

```ts
message.icalEvent(eventContent, {
  method: 'PUBLISH',
  filename: 'invite.ics',
})
```

Ou gere o conteúdo usando a API fluente do calendário. O objeto `calendar` passado para o retorno de chamada é uma instância da classe [ICalCalendar](https://sebbo2002.github.io/ical-generator/develop/reference/classes/icalcalendar.html) do pacote [ical-generator](https://www.npmjs.com/package/ical-generator).

```ts
import { DateTime } from 'luxon'

message.icalEvent((calendar) => {
  calendar
    .createEvent({
      summary: 'Adding support for ALS',
      start: DateTime.local().plus({ minutes: 30 }),
      end: DateTime.local().plus({ minutes: 60 }),
    })
})
```

### icalEventFromFile
Você pode anexar um arquivo `.ics` pré-existente usando o método `message.icalEventFromFile`. O primeiro argumento é o caminho absoluto para o arquivo.

```ts
message.icalEventFromFile(
  Application.resourcesPath('calendar-invites/invite.ics'),
  {
    filename: 'invite.ics',
    method: 'PUBLISH'
  }
)
```

### icalEventFromUrl
Você pode anexar o evento de uma URL que retorna o conteúdo do convite.

```ts
message.icalEventFromUrl(
  'https://myapp.com/users/1/invite'
  {
    filename: 'invite.ics',
    method: 'PUBLISH'
  }
)
```

## API de mensagens
A seguir está a lista de métodos disponíveis no objeto `message`.

#### `from`
Defina o remetente do e-mail.

```ts
message.from('admin@example.com')

// Defina o nome junto com o e-mail
message.from('admin@example.com', 'Admin')
```

#### `to`
Defina o destinatário do e-mail. Chamar esse método várias vezes enviará um novo destinatário para a lista. Da mesma forma, você pode chamar os métodos `cc` e `bcc` para adicionar destinatários de respeito.

```ts
message.to('foo@bar.com')

// Defina o nome junto com o e-mail
message.to('foo@bar.com', 'Mr foo')
```

#### `subject`
Defina o assunto do e-mail.

```ts
message.subject('Verify email address')
```

#### `replyTo`
Um endereço de e-mail que aparecerá no campo `Reply-To:`. Chamar esse método várias vezes enviará um novo destinatário replyTo para a lista.

```ts
message.replyTo('support@example.com')

// Defina o nome junto com o e-mail
message.replyTo('support@example.com', 'Support team')
```

#### `messageId`
Valor opcional `Message-Id`. Geraremos um valor aleatório se não for definido.

```ts
message.messageId('Custom-message-id')
```

#### `inReplyTo`
O Message-ID ao qual esta mensagem está respondendo

```ts
message.replyTo('some-existing-message-id')
```

#### `reference`
Uma matriz de Message-IDs.

```ts
message.references(['id-1', 'id-2'])
```

#### `envelope`
Opcionalmente, defina o envelope SMTP, se o envelope gerado automaticamente não for adequado (consulte [envelope SMTP](https://nodemailer.com/smtp/envelope/) para obter detalhes)

```ts
message.envelope({
  from: '',
  to: '',
  cc: '',
  bcc: '',
})
```

#### `priority`
Define os cabeçalhos de importância da mensagem. O valor deve ser **high**, **normal** (padrão) ou **low**.

```ts
message.priority('high')
```

#### `encoding`
Identifica a codificação para strings de texto/html (o padrão é `utf-8`, outros valores são `hex` e `base64`).

```ts
message.encoding('utf-8')
```

#### `htmlView`
Defina o corpo HTML do e-mail renderizando um modelo Edge. Opcionalmente, ele aceita os dados para passar para o modelo.

```ts
message.htmlView('emails/verify-email', { user: user })
```

Você pode usar o método `textView` para definir o corpo de texto simples do e-mail e o método `watchView` para especificar o corpo do Apple Watch.

#### `html`
Defina o HTML do e-mail como uma string diretamente. Você deve usar o método `html` ou `htmlView`.

```ts
message.html(`<p> Welcome </p>`)
```

Use os métodos `text` e `watch` para definir o corpo do e-mail a partir de uma string bruta.

#### `header`
Defina um cabeçalho de e-mail.

```ts
message.header('X-Key-Name', 'X-Value')
```

#### `preparedHeader`
O Nodemailer codifica e dobra internamente os cabeçalhos para atender ao requisito de ter mensagens ASCII simples com linhas de no máximo 78 bytes.

Às vezes, é preferível não modificar os valores do cabeçalho e passá-los conforme fornecidos. Isso pode ser obtido usando o método `preparedHeader`.

```ts
message.preparedHeader('X-Key-Name', 'X-Value')
```

## Trocando mailers em tempo de execução
Você pode usar o método `Mail.use()` para alternar entre os mailers. O método `use` aceita o nome do mailer definido dentro do arquivo `config/mail.ts` sob o objeto `mailers`.

```ts
await Mail.use('mailgun').sendLater(() => {
})

await Mail.use('smtp').sendLater(() => {
})
```

## Classes do Mailer
As classes do Mailer permitem que você extraia a configuração de e-mail inline para sua classe dedicada. Os mailers são armazenados dentro do diretório `app/Mailers`, e você pode criar um novo mailer executando o seguinte comando Ace.

```sh
node ace make:mailer VerifyEmail

# CREATE: app/Emails/VerifyEmail.ts
```

Toda classe do mailer deve estender o [BaseMailer](https://github.com/adonisjs/mail/blob/develop/src/BaseMailer/index.ts) para herdar os recursos de envio de um e-mail. Na maior parte, você estará trabalhando dentro do método `prepare` para configurar a mensagem de e-mail.

```ts
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class VerifyEmail extends BaseMailer {
  public prepare(message: MessageContract) {
    message
      .subject('The email subject')
      .from('admin@example.com')
      .to('user@example.com')
  }
}
```

Agora, você pode substituir a chamada do método `Mail.send` inline pela classe Mailer.

```ts
import VerifyEmail from 'App/Mailers/VerifyEmail'

// Instanciar a classe e enviar e-mail
await new VerifyEmail().sendLater()
```

### Passando dados para o mailer
O Mailer pode aceitar dados usando os argumentos do construtor. Por exemplo:

```ts {2-4,10}
export default class VerifyEmail extends BaseMailer {
  constructor (private user: User) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .subject('The email subject')
      .from('admin@example.com')
      .to(this.user.email)
  }
}
```

Veja como você pode passar o `user` no momento da instanciação da classe.

```ts
const user = await User.find(1)
await new VerifyEmail(user).sendLater()
```

### Usando um mailer diferente
As classes do mailer usam o mailer padrão configurado dentro do arquivo `config/mail.ts`. No entanto, você pode usar um diferente definindo a seguinte propriedade na instância da classe.

```ts {1,4}
import Mail, { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

export default class VerifyEmail extends BaseMailer {
  public mailer = Mail.use('mailgun')

  public prepare(message: MessageContract) {
    message
      .subject('The email subject')
      .from('admin@example.com')
      .to('user@example.com')
  }
}
```

### Personalizando o diretório de mailers
Você pode alterar o namespace para armazenar os mailers definindo a propriedade `namespaces.mailers` dentro do arquivo `.adonisrc.json`. Após a alteração a seguir, o comando Ace `make:mailer` criará novos arquivos dentro do diretório configurado.

```json
"namespaces": {
  "mailers": "App/Emails"
}
```

### Métodos de classes de mailer
A classe BaseMailer expõe os seguintes métodos para enviar ou visualizar o e-mail.

```ts
// Enviar e-mail
await new VerifyEmail().send()

// Enviar e-mail empurrando-o para a fila na memória
await new VerifyEmail().sendLater()

// Visualizar e-mail usando servidor SMTP falso
await new VerifyEmail().preview()
```

## Visualizar e-mails
Você pode visualizar seus e-mails enviando-os para um [servidor SMTP falso](https://ethereal.email/). Isso permite que você verifique se seu e-mail tem links ou anexos quebrados antes de enviá-los para os usuários reais.

Tudo o que você precisa fazer é substituir o método `sendLater` pelo método `preview`.

```ts
await Mail.preview((message) => {
  message
    .from('info@example.com')
    .to('virk@adonisjs.com')
    .subject('Welcome Onboard!')
    .htmlView('emails/welcome', { name: 'Virk' })
})
```

Ao usar classes de mailer, você pode chamar o método `preview` diretamente na instância da classe. A seguir, uma demonstração de visualização de e-mails por meio do Ace REPL.

<video src="/docs/assets/mailer-preview-repl.mp4" controls />

## Fila de mailer de monitoramento
Os e-mails enviados usando o método `Mail.sendLater` são movidos para uma fila na memória. Você pode monitorar essa fila usando o método `Mail.monitorQueue`.

Se você não monitorar explicitamente a fila, o módulo Mail registrará os erros usando o [logger](./logger.md).

Você pode escrever o seguinte código dentro de um [arquivo de pré-carregamento](../fundamentals/adonisrc-file.md#preloads).

```ts
// start/mail.ts

import Mail from '@ioc:Adonis/Addons/Mail'

Mail.monitorQueue((error, result) => {
  if (error) {
    console.log('Unable to send email')
    console.log(error.mail)
    return
  }

  console.log('Email sent')
  console.log(result.mail)
  console.log(result.response)
})
```

## Eventos
O módulo de e-mail emite o evento `mail:sent` para ouvir e observar os e-mails enviados. Você pode colocar o código para o ouvinte de eventos dentro de um arquivo [preload]().

```ts
// start/events.ts

import Event from '@ioc:Adonis/Core/Event'

Event.on('mail:sent', ({ message, views, mailer, response }) => {
  console.log(message)
  console.log(views)
  console.log(mailer)
  console.log(response)
})
```

Você pode usar o método `Mail.prettyPrint` para imprimir o e-mail enviado no terminal.

```ts
// start/events.ts

import Event from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'

Event.on('mail:sent', Mail.prettyPrint)
```

![](/docs/assets/adonis-mail-event-pretty-print.webp)

## Criando um driver de e-mail personalizado
O pacote de e-mail expõe a API para adicionar seus drivers personalizados. Cada driver deve aderir ao [MailDriverContract](https://github.com/adonisjs/mail/blob/develop/adonis-typings/mail.ts#L192).

```ts
interface MailDriverContract {
  send(message: MessageNode, config?: any): Promise<any>
  close(): void | Promise<void>
}
```

#### `send`
O método `send` é responsável por enviar o e-mail. Ele recebe o objeto de mensagem e a configuração de tempo de execução opcional (se seu driver aceitar).

#### `close`
O método close deve limpar todos os recursos que adquiriu. Por exemplo, o [driver SES](https://github.com/adonisjs/mail/blob/develop/src/Drivers/Ses.ts#L54-L57) oficial fecha o transporte nodemailer subjacente

### Estendendo de fora para dentro
Sempre que você estiver estendendo o núcleo da estrutura. É melhor assumir que você não tem acesso ao código do aplicativo e suas dependências. Em outras palavras, escreva suas extensões como se estivesse escrevendo um pacote de terceiros e use injeção de dependência para confiar em outras dependências.

Para fins de demonstração, vamos criar um driver de e-mail que envolva o transporte de carimbo postal nodemailer existente.

```sh
mkdir providers/PostMarkDriver
touch providers/PostMarkDriver/index.ts
```

A estrutura do diretório será a seguinte.

```sh
providers
└── PostMarkDriver
    └── index.ts
```

Abra o arquivo `PostMarkDriver/index.ts` e cole o seguinte conteúdo dentro dele.

::: info NOTA
Certifique-se de instalar as dependências `nodemailer` e `nodemailer-postmark-transport` também.
:::

```ts
// providers/PostMarkDriver/index.ts

import nodemailer from 'nodemailer'
import postMarkTransport from 'nodemailer-postmark-transport'
import { MailDriverContract, MessageNode } from '@ioc:Adonis/Addons/Mail'

/**
 * Configuração aceita pelo driver
 */
export type PostMarkConfig = {
  driver: 'postmark',
  auth: {
    apiKey: string
  }
}

export class PostMarkDriver implements MailDriverContract {
  private transporter: any

  constructor(private config: PostMarkConfig) {
    /**
     * Instanciar o transporte nodemailer
     */
    this.transporter = nodemailer.createTransport(
      postMarkTransport(this.config)
    )
  }

  /**
   * Enviar e-mail usando o transporte subjacente
   */
  public async send(message: MessageNode) {
    return this.transporter.sendMail(message)
  }

  /**
   * Recursos de limpeza
   */
  public close() {
    this.transporter.close()
    this.transporter = null
  }
}
```

Em seguida, você deve registrar o driver com o módulo `Mail` do AdonisJS. Você deve fazer isso dentro do método `boot` de um provedor de serviços. Abra o arquivo `providers/AppProvider.ts` pré-existente e cole o seguinte código dentro dele.

```ts {7-12}
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const { PostMarkDriver } = await import('./PostMarkDriver')
    const Mail = this.app.container.use('Adonis/Addons/Mail')

    Mail.extend('postmark', (_mail, _mapping, config) => {
      return new PostMarkDriver(config)
    })
  }
}
```

### Ciclo de vida do driver
O módulo de e-mail cria internamente uma única instância do driver e a usa durante todo o ciclo de vida do aplicativo, a menos que alguém decida fechá-lo manualmente.

### Informando o TypeScript sobre o novo driver
Antes que alguém possa referenciar este driver dentro do arquivo `config/mail.ts`. Você terá que informar o compilador estático do TypeScript sobre sua existência.

Se estiver criando um pacote, você pode escrever o seguinte código dentro do arquivo principal do pacote, caso contrário, você pode escrevê-lo dentro do arquivo `contracts/mail.ts`.

```ts
import { PostMarkConfig } from '../providers/PostMarkDriver' // [!code ++]

declare module '@ioc:Adonis/Addons/Mail' {
  interface MailDrivers {
    postmark: {                           // [!code ++]
      config: PostMarkConfig,             // [!code ++]
      implementation: MailDriverContract  // [!code ++]
    }                                     // [!code ++]
  }
}
```

### Usando o driver
Tudo bem, agora estamos prontos para usar o driver de carimbo postal. Vamos começar definindo a configuração para um novo mailer dentro do arquivo `config/mail.ts`.

```ts
{
  mailers: {
    transactionalMailer: {
      driver: 'postmark',
      auth: {
        apiKey: 'your-api-key',
      }
    }
  }
}
```

E use-o da seguinte forma:

```ts
import Mail from '@ioc:Adonis/Core/Mail'

Mail.use('transactionalMailer').send((message) => {
})
```
