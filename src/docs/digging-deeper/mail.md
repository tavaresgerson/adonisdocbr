---
resumo: Aprenda a enviar e-mails do seu aplicativo AdonisJS usando o pacote @adonisjs/mail.
---

# Mail

Você pode enviar e-mails do seu aplicativo AdonisJS usando o pacote `@adonisjs/mail`. O pacote de e-mail é criado em cima do [Nodemailer](https://nodemailer.com/), trazendo as seguintes melhorias de qualidade de vida em relação ao Nodemailer.

- API Fluent para configurar mensagens de e-mail.
- Capacidade de definir e-mails como classes para melhor organização e testes mais fáceis.
- Um conjunto extenso de transportes mantidos oficialmente. Inclui `smtp`, `ses`, `mailgun`, `sparkpost`, `resend` e `brevo`.
- Experiência de teste aprimorada usando a API Fakes.
- Mensageiro de e-mail para enfileirar e-mails.
- APIs funcionais para gerar eventos de calendário.

## Instalação

Instale e configure o pacote usando o seguinte comando:

```sh
node ace add @adonisjs/mail

# Pre-define transports to use via CLI flag
node ace add @adonisjs/mail --transports=resend --transports=smtp
```

::: details Veja os passos realizados pelo comando add

1. Instala o pacote `@adonisjs/mail` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviço e comando dentro do arquivo `adonisrc.ts`.

```ts
    {
      commands: [
        // ...other commands
        () => import('@adonisjs/mail/commands')
      ],
      providers: [
        // ...other providers
        () => import('@adonisjs/mail/mail_provider')
      ]
    }
    ```
3. Crie o arquivo `config/mail.ts`.

4. Define as variáveis ​​de ambiente e suas validações para os serviços de e-mail selecionados

:::


## Configuração

A configuração do pacote de e-mail é armazenada dentro do arquivo `config/mail.ts`. Dentro deste arquivo, você pode configurar vários serviços de e-mail como `mailers` para usá-los em seu aplicativo.

Veja também: [Config stub](https://github.com/adonisjs/mail/blob/main/stubs/config/mail.stub)

```ts
import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',

  /**
   * A static address for the "from" property. It will be
   * used unless an explicit from address is set on the
   * Email
   */
  from: {
    address: '',
    name: '',
  },

  /**
   * A static address for the "reply-to" property. It will be
   * used unless an explicit replyTo address is set on the
   * Email
   */
  replyTo: {
    address: '',
    name: '',
  },

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or the same transport with a different
   * options.
   */
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),
    }),

    resend: transports.resend({
      key: env.get('RESEND_API_KEY'),
      baseUrl: 'https://api.resend.com',
    }),
  },
})
```

### `default`

O nome do mailer a ser usado por padrão para enviar e-mails.

### `from`

Um endereço global estático a ser usado para a propriedade `from`. O endereço global será usado a menos que um endereço `from` explícito seja definido no e-mail.

### `replyTo`

Um endereço global estático a ser usado para a propriedade `reply-to`. O endereço global será usado a menos que um endereço `replyTo` explícito seja definido no e-mail.

### `mailers`

O objeto `mailers` é usado para configurar um ou mais mailers que você deseja usar para enviar e-mails. Você pode alternar entre os mailers em tempo de execução usando o método `mail.use`.

## Configuração de transportes
A seguir está uma referência completa das opções de configuração aceitas pelos transportes oficialmente suportados.

Veja também: [Tipos TypeScript para objeto de configuração](https://github.com/adonisjs/mail/blob/main/src/types.ts#L261)

::: details Configuração do Mailgun

As seguintes opções de configuração são enviadas para o endpoint da API [`/messages.mime`](https://documentation.mailgun.com/en/latest/api-sending.html#sending) do Mailgun.

```ts
{
  mailers: {
    mailgun: transports.mailgun({
      baseUrl: 'https://api.mailgun.net/v3',
      key: env.get('MAILGUN_API_KEY'),
      domain: env.get('MAILGUN_DOMAIN'),

      /**
       * The following options can be overridden at
       * runtime when calling the `mail.send` method.
       */
      oDkim: true,
      oTags: ['transactional', 'adonisjs_app'],
      oDeliverytime: new Date(2024, 8, 18),
      oTestMode: false,
      oTracking: false,
      oTrackingClick: false,
      oTrackingOpens: false,
      headers: {
        // h:prefixed headers
      },
      variables: {
        appId: '',
        userId: '',
        // v:prefixed variables
      }
    })
  }
}
```

:::

::: details Configuração SMTP

As seguintes opções de configuração são encaminhadas para o Nodemailer como estão. Então, por favor, verifique a [documentação do Nodemailer](https://nodemailer.com/smtp/) também.

```ts
{
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),
      secure: false,

      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME'),
        pass: env.get('SMTP_PASSWORD')
      },

      tls: {},

      ignoreTLS: false,
      requireTLS: false,

      pool: false,
      maxConnections: 5,
      maxMessages: 100,
    })
  }
}
```

:::

::: details Configuração SES

As seguintes opções de configuração são encaminhadas para o Nodemailer como estão. Então, verifique a [documentação do Nodemailer](https://nodemailer.com/transports/ses/) também.

Certifique-se de instalar o pacote `@aws-sdk/client-ses` para usar o transporte SES.

```ts
{
  mailers: {
    ses: transports.ses({
      /**
       * Forwarded to aws sdk
       */
      apiVersion: '2010-12-01',
      region: 'us-east-1',
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },

      /**
       * Nodemailer specific
       */
      sendingRate: 10,
      maxConnections: 5,
    })
  }
}
```

:::

::: details Configuração do SparkPost

As seguintes opções de configuração são enviadas para o endpoint da API [`/transmissions`](https://developers.sparkpost.com/api/transmissions/#header-request-body) do SparkPost.

```ts
{
  mailers: {
    sparkpost: transports.sparkpost({
      baseUrl: 'https://api.sparkpost.com/api/v1',
      key: env.get('SPARKPOST_API_KEY'),

      /**
       * The following options can be overridden at
       * runtime when calling the `mail.send` method.
       */
      startTime: new Date(),
      openTracking: false,
      clickTracking: false,
      initialOpen: false,
      transactional: true,
      sandbox: false,
      skipSuppression: false,
      ipPool: '',
    })
  }
}
```

:::

::: details Configuração do Resend

As seguintes opções de configuração são enviadas para o endpoint da API [`/emails`](https://resend.com/docs/api-reference/emails/send-email) do Resend.

```ts
{
  mailers: {
    resend: transports.resend({
      baseUrl: 'https://api.resend.com',
      key: env.get('RESEND_API_KEY'),

      /**
       * The following options can be overridden at
       * runtime when calling the `mail.send` method.
       */
      tags: [
        {
          name: 'category',
          value: 'confirm_email'
        }
      ]
    })
  }
}
```
:::

## Exemplo básico

Depois que a configuração inicial for concluída, você pode enviar e-mails usando o método `mail.send`. O serviço de e-mail é uma instância singleton da classe [MailManager](https://github.com/adonisjs/mail/blob/main/src/mail_manager.ts) criada usando o arquivo de configuração.

O método `mail.send` passa uma instância da classe [Message](https://github.com/adonisjs/mail/blob/main/src/message.ts) para o retorno de chamada e entrega o e-mail usando o mailer `default` configurado dentro do arquivo de configuração.

No exemplo a seguir, disparamos um e-mail do controlador após criar uma nova conta de usuário.

```ts
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
// highlight-start
import mail from '@adonisjs/mail/services/main'
// highlight-end

export default class UsersController {
  async store({ request }: HttpContext) {
    /**
     * For demonstration only. You should validate the data
     * before storing it inside the database.
     */
    const user = await User.create(request.all())

    // highlight-start
    await mail.send((message) => {
      message
        .to(user.email)
        .from('info@example.org')
        .subject('Verify your email address')
        .htmlView('emails/verify_email', { user })
    })
    // highlight-end
  }
}
```

## Enfileirando e-mails
Como o envio de e-mails pode ser demorado, você pode querer colocá-los em uma fila e enviar e-mails em segundo plano. Você pode fazer o mesmo usando o método `mail.sendLater`.

O método `sendLater` aceita os mesmos parâmetros que o método `send`. No entanto, em vez de enviar o e-mail imediatamente, ele usará o **Mail messenger** para colocá-lo na fila.

```ts
// delete-start
await mail.send((message) => {
// delete-end
// insert-start
await mail.sendLater((message) => {
// insert-end
  message
    .to(user.email)
    .from('info@example.org')
    .subject('Verify your email address')
    .htmlView('emails/verify_email', { user })
})
```

Por padrão, o **mail messenger usa uma fila na memória**, o que significa que a fila descartará os trabalhos se o seu processo morrer com trabalhos pendentes. Isso pode não ser um grande problema se a interface do usuário do seu aplicativo permitir o reenvio de e-mails com ações manuais. No entanto, você sempre pode configurar um messenger personalizado e usar uma fila com suporte de banco de dados.

### Usando bullmq para enfileirar e-mails

```sh
npm i bullmq
```

No exemplo a seguir, usamos o método `mail.setMessenger` para configurar uma fila personalizada que usa `bullmq` nos bastidores para armazenar trabalhos.

Armazenamos o e-mail compilado, a configuração de tempo de execução e o nome do mailer dentro do trabalho. Mais tarde, usaremos esses dados para enviar e-mails dentro de um processo de trabalho.

```ts
import { Queue } from 'bullmq'
import mail from '@adonisjs/mail/services/main'

// highlight-start
const emailsQueue = new Queue('emails')
// highlight-end

// highlight-start
mail.setMessenger((mailer) => {
  return {
    async queue(mailMessage, config) {
      await emailsQueue.add('send_email', {
        mailMessage,
        config,
        mailerName: mailer.name,
      })
    }
  }
})
// highlight-end
```

Finalmente, vamos escrever o código para a fila Worker. Dependendo do fluxo de trabalho do seu aplicativo, você pode ter que iniciar outro processo para os workers processarem os trabalhos.

No exemplo a seguir:

- Processamos trabalhos chamados `send_email` da fila `emails`.
- Acessamos a mensagem de e-mail compilada, a configuração de tempo de execução e o nome do mailer dos dados do trabalho.
- E enviamos o e-mail usando o método `mailer.sendCompiled`.

```ts
import { Worker } from 'bullmq'
import mail from '@adonisjs/mail/services/main'

new Worker('emails', async (job) => {
  if (job.name === 'send_email') {
    const {
      mailMessage,
      config,
      mailerName
    } = job.data

    await mail
      .use(mailerName)
      .sendCompiled(mailMessage, config)
  }
})
```

Isso é tudo! Você pode continuar usando o método `mail.sendLater`. No entanto, os e-mails serão enfileirados dentro de um banco de dados redis desta vez.

## Alternando entre mailers
Você pode alternar entre os mailers configurados usando o método `mail.use`. O método `mail.use` aceita o nome do mailer (conforme definido dentro do arquivo de configuração) e retorna uma instância da classe [Mailer](https://github.com/adonisjs/mail/blob/main/src/mailer.ts).

```ts
import mail from '@adonisjs/mail/services/main'

mail.use() // Instance of default mailer
mail.use('mailgun') // Mailgun mailer instance
```

Você pode chamar os métodos `mailer.send` ou `mailer.sendLater` para enviar e-mail usando uma instância do mailer. Por exemplo:

```ts
await mail
  .use('mailgun')
  .send((message) => {
  })
```

```ts
await mail
  .use('mailgun')
  .sendLater((message) => {
  })
```

As instâncias do mailer são armazenadas em cache durante o ciclo de vida do processo. Você pode usar o método `mail.close` para destruir uma instância existente e recriar uma nova instância do zero.

```ts
import mail from '@adonisjs/mail/services/main'

/**
 * Close transport and remove instance from
 * cache
 */
await mail.close('mailgun')

/**
 * Create a fresh instance
 */
mail.use('mailgun')
```

## Configurando o mecanismo de modelo
Por padrão, o pacote de e-mail é configurado para usar o [mecanismo de modelo Edge](../views-and-templates/introduction.md#configuring-edge) para definir o conteúdo de **HTML** e **Texto simples** do e-mail.§

No entanto, conforme mostrado no exemplo a seguir, você também pode registrar um mecanismo de modelo personalizado substituindo a propriedade `Message.templateEngine`.

Veja também: [Definindo conteúdo de e-mail](#defining-email-contents)

```ts
import { Message } from '@adonisjs/mail'

Message.templateEngine = {
  async render(templatePath, data) {
    return someTemplateEngine.render(templatePath, data)
  }
}
```

## Eventos
Consulte o [guia de referência de eventos](../references/events.md#mailsending) para visualizar a lista de eventos despachados pelo pacote `@adonisjs/mail`.

## Configurando mensagem

As propriedades de um e-mail são definidas usando a classe [Message](https://github.com/adonisjs/mail/blob/main/src/message.ts). Uma instância desta classe é fornecida para a função de retorno de chamada criada usando os métodos `mail.send` ou `mail.sendLater`.

```ts
import { Message } from '@adonisjs/mail'
import mail from '@adonisjs/mail/services/main'

await mail.send((message) => {
  // highlight-start
  console.log(message instanceof Message) // true
  // highlight-end
})

await mail.sendLater((message) => {
  // highlight-start
  console.log(message instanceof Message) // true
  // highlight-end
})
```

### Definindo assunto e remetente
Você pode definir o assunto do e-mail usando o método `message.subject` e o remetente do e-mail usando o método `message.from`.

```ts
await mail.send((message) => {
  message
  // highlight-start
    .subject('Verify your email address')
    .from('info@example.org')
  // highlight-end
})
```

O método `from` aceita o endereço de e-mail como uma string ou um objeto com o nome do remetente e o endereço de e-mail.

```ts
message
  .from({
    address: 'info@example.com',
    name: 'AdonisJS'
  })
```

O remetente também pode ser definido globalmente dentro do arquivo de configuração. O remetente global será usado se nenhum remetente explícito for definido para uma mensagem individual.

```ts
const mailConfig = defineConfig({
  from: {
    address: 'info@example.com',
    name: 'AdonisJS'
  }
})
```

### Definindo destinatários
Você pode definir os destinatários de e-mail usando os métodos ``message.to`, `message.cc` e `message.bcc`. Esses métodos aceitam o endereço de e-mail como uma string ou um objeto com o nome do destinatário e o endereço de e-mail.

```ts
await mail.send((message) => {
  message
    .to(user.email)
    .cc(user.team.email)
    .bcc(user.team.admin.email)
})
```

```ts
await mail.send((message) => {
  message
    .to({
      address: user.email,
      name: user.fullName,
    })
    .cc({
      address: user.team.email,
      name: user.team.name,
    })
    .bcc({
      address: user.team.admin.email,
      name: user.team.admin.fullName,
    })
})
```

Você pode definir vários destinatários `cc` e `bcc` como uma matriz de endereços de e-mail ou um objeto com endereços de e-mail e o nome do destinatário.

```ts
await mail.send((message) => {
  message
    .cc(['first@example.com', 'second@example.com'])
    .bcc([
      {
        name: 'First recipient',
        address: 'first@example.com'
      },
      {
        name: 'Second recipient',
        address: 'second@example.com'
      }
    ])
})
```

Você também pode definir o endereço de e-mail `replyTo` usando o método `message.replyTo`.

```ts
await mail.send((message) => {
  message
    .from('info@example.org')
    // highlight-start
    .replyTo('noreply@example.org')
    // highlight-end
})
```

### Definindo conteúdo de e-mail
```ts
await mail.send((message) => {
  /**
   * HTML contents
   */
  message.html(`
    <h1> Verify email address </h1>
    <p> <a href="https://myapp.com">Click here</a> to verify your email address </a>
  `)

  /**
   * Plain text contents
   */
  message.text(`
    Verify email address
    Please visit https://myapp.com to verify your email address
  `)
})
```

#### Usando modelos do Edge

Como escrever conteúdo em linha pode ser trabalhoso, você pode usar modelos do Edge. Se você já [configurou o Edge](../views-and-templates/introduction.md#configuring-edge), você pode usar os métodos `message.htmlView` e `message.textView` para renderizar modelos.

```sh
// title: Create templates
node ace make:view emails/verify_email_html
node ace make:view emails/verify_email_text
```

```ts
// title: Use them for defining contents
await mail.send((message) => {
  message.htmlView('emails/verify_email_html', stateToShare)
  message.textView('emails/verify_email_text', stateToShare)
})
```

#### Usando MJML para marcação de e-mail
MJML é uma linguagem de marcação para criar e-mails sem escrever todo o HTML complexo para fazer seus e-mails ficarem bem em todos os clientes de e-mail.

O primeiro passo é instalar o pacote [mjml](https://npmjs.com/mjml) do npm.

```sh
npm i mjml
```

Uma vez feito isso, você pode escrever a marcação MJML dentro dos seus modelos Edge, envolvendo-a dentro da tag `@mjml`.

:::note
Como a saída do MJML contém as tags `html`, `head` e `body`, não é necessário defini-las dentro dos seus modelos Edge.
:::

```edge
@mjml()
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>
            Hello World!
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
@end
```

Você pode passar as [opções de configuração MJML](https://documentation.mjml.io/#inside-node-js) como props para a tag `@mjml`.

```edge
@mjml({
  keepComments: false,
  fonts: {
    Lato: 'https://fonts.googleapis.com/css?family=Lato:400,500,700'
  }
})
```

### Anexando arquivos
Você pode usar o método `message.attach` para enviar anexos em um e-mail. O método `attach` aceita um caminho absoluto ou uma URL do sistema de arquivos de um arquivo que você deseja enviar como anexo.

```ts
import app from '@adonisjs/core/services/app'

await mail.send((message) => {
  message.attach(app.makePath('uploads/invoice.pdf'))
})
```

Você pode definir o nome do arquivo para o anexo usando a propriedade `options.filename`.

```ts
message.attach(app.makePath('uploads/invoice.pdf'), {
  filename: 'invoice_october_2023.pdf'
})
```

A lista completa de opções aceitas pelo método `message.attach` segue.

<table>
<thead>
<tr>
<th>Opção</th>
<th>Descrição</th>
</tr>
</thead>
<tbody><tr>
<td><code>filename</code></td>
<td>O nome de exibição do anexo. O padrão é o nome base do caminho do anexo.</td>
</tr>
<tr>
<td><code>contentType</code></td>
<td>O tipo de conteúdo do anexo. Se não for definido, o <code>contentType</code> será inferido da extensão do arquivo.</td>
</tr>
<tr>
<td><code>contentDisposition</code></td>
<td>Tipo de disposição de conteúdo do anexo. O padrão é <code>attachment</code></td>
</tr>
<tr>
<td><code>headers</code></td>
<td>
<p>Cabeçalhos personalizados para o nó do anexo. A propriedade headers é um par chave-valor</p>
</td>
</tr>
</tbody></table>

#### Anexando arquivos de fluxos e buffers
Você pode criar anexos de e-mail de fluxos e buffers usando o método `message.attachData`. O método aceita um fluxo legível ou o buffer como o primeiro argumento e o objeto de opções como o segundo argumento.

:::note
O método `message.attachData` não deve ser usado ao enfileirar e-mails usando o método `mail.sendLater`. Como os trabalhos enfileirados são serializados e persistidos dentro de um banco de dados, anexar dados brutos aumentará o tamanho do armazenamento.

Além disso, enfileirar um e-mail falhará se você anexar um fluxo usando o método `message.attachData`.
:::

```ts
message.attachData(fs.createReadStream('./invoice.pdf'), {
  filename: 'invoice_october_2023.pdf'
})
```

```ts
message.attachData(Buffer.from('aGVsbG8gd29ybGQh'), {
  encoding: 'base64',
  filename: 'greeting.txt',
})
```

### Incorporando imagens
Você pode incorporar imagens dentro do conteúdo do seu e-mail usando o auxiliar de visualização `embedImage`. O método `embedImage` sob o capô usa [CID](https://sendgrid.com/en-us/blog/embedding-images-emails-facts#1-cid-embedded-images-inline-images) para marcar a imagem como um anexo e usa seu ID de conteúdo como a fonte da imagem.

```edge
<img src="{{
  embedImage(app.makePath('assets/hero.jpg'))
}}" />
```

A seguir está o HTML de saída

```html
<img src="cid:a-random-content-id" />
```

O anexo a seguir será definido automaticamente na carga útil do e-mail.

```ts
{
  attachments: [{
    path: '/root/app/assets/hero.jpg',
    filename: 'hero.jpg',
    cid: 'a-random-content-id'
  }]
}
```

#### Incorporando imagens de buffers

Assim como o método `embedImage`, você pode usar o método `embedImageData` para incorporar uma imagem de dados brutos.

```edge
<img src="{{
  embedImageData(rawBuffer, { filename: 'hero.jpg' })
}}" />
```

### Anexando eventos de calendário
Você pode anexar eventos de calendário a um e-mail usando o método `message.icalEvent`. O método `icalEvent` aceita o conteúdo do evento como o primeiro parâmetro e o objeto `options` como o segundo parâmetro.

```ts
const contents = 'BEGIN:VCALENDAR\r\nPRODID:-//ACME/DesktopCalendar//EN\r\nMETHOD:REQUEST\r\n...'

await mail.send((message) => {
  message.icalEvent(contents, {
    method: 'PUBLISH',
    filename: 'invite.ics',
  })
})
```

Como definir o conteúdo do arquivo de evento manualmente pode ser trabalhoso, você pode passar uma função de retorno de chamada para o método `icalEvent` e gerar o conteúdo do convite usando a API JavaScript.

O objeto `calendar` fornecido para a função de retorno de chamada é uma referência do pacote npm [ical-generator](https://www.npmjs.com/package/ical-generator), então certifique-se de ler o arquivo README do pacote também.

```ts
message.icalEvent((calendar) => {
  // highlight-start
  calendar
    .createEvent({
      summary: 'Adding support for ALS',
      start: DateTime.local().plus({ minutes: 30 }),
      end: DateTime.local().plus({ minutes: 60 }),
    })
  // highlight-end
}, {
  method: 'PUBLISH',
  filename: 'invite.ics',
})
```

#### Lendo o conteúdo do convite de um arquivo ou URL
Você pode definir o conteúdo do convite de um arquivo ou URL HTTP usando os métodos `icalEventFromFile` ou `icalEventFromUrl`.

```ts
message.icalEventFromFile(
  app.resourcesPath('calendar-invites/invite.ics'),
  {
    filename: 'invite.ics',
    method: 'PUBLISH'
  }
)
```

```ts
message.icalEventFromFile(
  'https://myapp.com/users/1/invite.ics',
  {
    filename: 'invite.ics',
    method: 'PUBLISH'
  }
)
```

### Definindo cabeçalhos de e-mail
Você pode definir cabeçalhos de e-mail adicionais usando o método `message.header`. O método aceita a chave do cabeçalho como o primeiro parâmetro e o valor como o segundo parâmetro.

```ts
message.header('x-my-key', 'header value')

/**
 * Define an array of values
 */
message.header('x-my-key', ['header value', 'another value'])
```

Por padrão, os cabeçalhos de e-mail são codificados e dobrados para atender ao requisito de ter mensagens ASCII simples com linhas de no máximo 78 bytes. No entanto, se quiser ignorar as regras de codificação, você pode definir um cabeçalho usando o método `message.preparedHeader`.

```ts
message.preparedHeader(
  'x-unprocessed',
  'a really long header or value with non-ascii characters 👮',
)
```

### Definindo cabeçalhos `List`
A classe message inclui métodos auxiliares para definir cabeçalhos complexos como [List-Unsubscribe](https://sendgrid.com/en-us/blog/list-unsubscribe) ou [List-Help](https://support.optimizely.com/hc/en-us/articles/4413200569997-Setting-up-the-List-Help-header#heading-2) com facilidade. Você pode aprender sobre as regras de codificação para cabeçalhos `List` no [site do nodemailer](https://nodemailer.com/message/list-headers/).

```ts
message.listHelp('admin@example.com?subject=help')
// List-Help: <mailto:admin@example.com?subject=help>
```

```ts
message.listUnsubscribe({
  url: 'http://example.com',
  comment: 'Comment'
})
// List-Unsubscribe: <http://example.com> (Comment)
```

```ts
/**
 * Repeating header multiple times
 */
message.listSubscribe('admin@example.com?subject=subscribe')
message.listSubscribe({
  url: 'http://example.com',
  comment: 'Subscribe'
})
// List-Subscribe: <mailto:admin@example.com?subject=subscribe>
// List-Subscribe: <http://example.com> (Subscribe)
```

Para todos os outros cabeçalhos `List` arbitrários, você pode usar o método `addListHeader`.

```ts
message.addListHeader('post', 'http://example.com/post')
// List-Post: <http://example.com/post>
```

## E-mails baseados em classe

Em vez de escrever e-mails dentro do fechamento do método `mail.send`, você pode movê-los para classes de e-mail dedicadas para melhor organização e [testes mais fáceis](#testing-mail-classes).

As classes de e-mail são armazenadas dentro do diretório `./app/mails`, e cada arquivo representa um único e-mail. Você pode criar uma classe de e-mail executando o comando ace `make:mail`.

Veja também: [Comando Make mail](../references/commands.md#makemail)

```sh
node ace make:mail verify_email
```

A classe mail estende a classe [BaseMail](https://github.com/adonisjs/mail/blob/main/src/base_mail.ts) e é estruturada com as seguintes propriedades e métodos. Você pode configurar a mensagem de e-mail dentro do método `prepare` usando a propriedade `this.message`.

```ts
import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'

export default class VerifyEmailNotification extends BaseMail {
  from = 'sender_email@example.org'
  subject = 'Verify email'

  prepare() {
    this.message.to('user_email@example.org')
  }
}
```

### `from`

Configure o endereço de e-mail do remetente. Se você omitir essa propriedade, deverá chamar o método `message.from` para definir o remetente.

### `subject`

Configure o assunto do e-mail. Se você omitir essa propriedade, deverá usar o método `message.subject` para definir o assunto do e-mail.

### `replyTo`

Configure o endereço de e-mail `replyTo`.

### `prepare`

O método `prepare` é chamado automaticamente pelo método `build` para preparar a mensagem de e-mail para envio.

Você deve definir o conteúdo do e-mail, anexos, destinatários, etc., dentro deste método.

### `build`

O método `build` é herdado da classe `BaseMail`. O método é chamado automaticamente no momento do envio do e-mail.

Certifique-se de referenciar a [implementação original](https://github.com/adonisjs/mail/blob/main/src/base_mail.ts#L81) se você decidir substituir este método.

### Enviando e-mail usando a classe mail
Você pode chamar o método `mail.send` e passar uma instância da classe mail para enviar o e-mail. Por exemplo:

```ts
// title: Send mail
import mail from '@adonisjs/mail/services/main'
import VerifyEmailNotification from '#mails/verify_email'

await mail.send(new VerifyEmailNotification())
```

```ts
// title: Queue mail
import mail from '@adonisjs/mail/services/main'
import VerifyEmailNotification from '#mails/verify_email'

await mail.sendLater(new VerifyEmailNotification())
```

Você pode compartilhar dados com a classe mail usando argumentos construtores. Por exemplo:

```ts
/**
 * Creating a user
 */
const user = await User.create(payload)

await mail.send(
  /**
   * Passing user to the mail class
   */
  new VerifyEmailNotification(user)
)
```

### Testando classes mail

Um dos principais benefícios de usar [classes Mail](#class-based-emails) é uma melhor experiência de teste. Você pode criar classes mail sem enviá-las e escrever asserções para as propriedades da mensagem.

```ts
import { test } from '@japa/runner'
import VerifyEmailNotification from '#mails/verify_email'

test.group('Verify email notification', () => {
  test('prepare email for sending', async () => {
    const email = new VerifyEmailNotification()

    /**
     * Build email message and render templates to
     * compute the email HTML and plain text
     * contents
     */
    await email.buildWithContents()

    /**
     * Write assertions to ensure the message is built
     * as expected
     */
    email.message.assertTo('user@example.org')
    email.message.assertFrom('info@example.org')
    email.message.assertSubject('Verify email address')
    email.message.assertReplyTo('no-reply@example.org')
  })
})
```

Você pode escrever asserções para o conteúdo da mensagem da seguinte forma.

```ts
const email = new VerifyEmailNotification()
await email.buildWithContents()

// highlight-start
email.message.assertHtmlIncludes(
  `<a href="/emails/1/verify"> Verify email address </a>`
)
email.message.assertTextIncludes('Verify email address')
// highlight-end
```

Além disso, você pode escrever asserções para os anexos. As asserções funcionam apenas com anexos baseados em arquivo e não para fluxos ou conteúdo bruto.

```ts
const email = new VerifyEmailNotification()
await email.buildWithContents()

// highlight-start
email.message.assertAttachment(
  app.makePath('uploads/invoice.pdf')
)
// highlight-end
```

Sinta-se à vontade para olhar o código-fonte da classe [Message](https://github.com/adonisjs/mail/blob/main/src/message.ts) para todos os métodos de asserção disponíveis.

## Fake mailer
Você pode querer usar o Fake mailer durante o teste para impedir que seu aplicativo envie e-mails. O Fake mailer coleta todos os e-mails de saída na memória e oferece uma API fácil de usar para escrever asserções contra eles.

No exemplo a seguir:

[FakeMailer](https://github.com/adonisjs/mail/blob/main/src/fake_mailer.ts) usando o método `mail.fake`.
- Em seguida, chamamos a API de endpoint `/register`.
- Por fim, usamos a propriedade `mails` do remetente falso para afirmar que `VerifyEmailNotification` foi enviado.

```ts
import { test } from '@japa/runner'
import mail from '@adonisjs/mail/services/main'
import VerifyEmailNotification from '#mails/verify_email'

test.group('Users | register', () => {
  test('create a new user account', async ({ client, route }) => {
    // highlight-start
    /**
     * Turn on the fake mode
     */
    const { mails } = mail.fake()
    // highlight-end

    /**
     * Make an API call
     */
    await client
      .post(route('users.store'))
      .send(userData)

    // highlight-start
    /**
     * Assert the controller indeed sent the
     * VerifyEmailNotification mail
     */
    mails.assertSent(VerifyEmailNotification, ({ message }) => {
      return message
        .hasTo(userData.email)
        .hasSubject('Verify email address')
    })
    // highlight-end
  })
})
```

Depois de terminar de escrever o teste, você deve restaurar o falso usando o método `mail.restore`.

```ts
test('create a new user account', async ({ client, route, cleanup }) => {
  const { mails } = mail.fake()

  /**
   * The cleanup hooks are executed after the test
   * finishes successfully or with an error.
   */
  cleanup(() => {
    mail.restore()
  })
})
```

### Escrevendo asserções

O método `mails.assertSent` aceita o construtor da classe mail como o primeiro argumento e lança uma exceção quando não consegue encontrar nenhum e-mail para a classe esperada.

```ts
const { mails } = mail.fake()

/**
 * Asser the email was sent
 */
mails.assertSent(VerifyEmailNotification)
```

Você pode passar uma função de retorno de chamada para o método `assertSent` para verificar se o e-mail foi enviado ao destinatário esperado ou tem o assunto correto.

A função de retorno de chamada recebe uma instância da classe mail e você pode usar a propriedade `.message` para obter acesso ao objeto [message](#configuring-message).

```ts
mails.assertSent(VerifyEmailNotification, (email) => {
  return email.message.hasTo(userData.email)
})
```

Você pode executar asserções no objeto `message` dentro do retorno de chamada. Por exemplo:

```ts
mails.assertSent(VerifyEmailNotification, (email) => {
  email.message.assertTo(userData.email)
  email.message.assertFrom('info@example.org')
  email.message.assertSubject('Verify your email address')

  /**
   * All assertions passed, so return true to consider the
   * email as sent.
   */
  return true
})
```

#### Assert email was not sent

Você pode usar o método `mails.assertNotSent` para afirmar que um e-mail não foi enviado durante o teste. Este método é o oposto do método `assertSent` e aceita os mesmos argumentos.

```ts
const { mails } = mail.fake()

mails.assertNotSent(PasswordResetNotification)
```

#### Assert emails count

Finalmente, você pode afirmar a contagem de e-mails enviados usando os métodos `assertSentCount` e `assertNoneSent`.

```ts
const { mails } = mail.fake()

// Assert 2 emails were sent in total
mails.assertSentCount(2)

// Assert only one VerifyEmailNotification was sent
mails.assertSentCount(VerifyEmailNotification, 1)
```

```ts
const { mails } = mail.fake()

// Assert zero emails were sent
mails.assertNoneSent()
```

### Escrevendo asserções para e-mails enfileirados

Se você tiver e-mails enfileirados usando o método `mail.sendLater`, você pode usar os seguintes métodos para escrever asserções para eles.

```ts
const { mails } = mail.fake()

/**
 * Assert "VerifyEmailNotification" email was queued
 * Optionally, you may pass the finder function to
 * narrow down the email
 */
mails.assertQueued(VerifyEmailNotification)

/**
 * Assert "VerifyEmailNotification" email was not queued
 * Optionally, you may pass the finder function to
 * narrow down the email
 */
mails.assertNotQueued(PasswordResetNotification)

/**
 * Assert two emails were queued in total.
 */
mails.assertQueuedCount(2)

/**
 * Assert "VerifyEmailNotification" email was queued
 * only once
 */
mails.assertQueuedCount(VerifyEmailNotification , 1)

/**
 * Assert nothing was queued
 */
mails.assertNoneQueued()
```

### Obtendo uma lista de e-mails enviados ou enfileirados

Você pode usar os métodos `mails.sent` ou `mails.queued` para obter uma matriz de e-mails enviados/enfileirados durante os testes.

```ts
const { mails } = mail.fake()

const sentEmails = mails.sent()
const queuedEmails = mails.queued()

const email = sentEmails.find((email) => {
  return email instanceof VerifyEmailNotification
})

if (email) {
  email.message.assertTo(userData.email)
  email.message.assertFrom(userData.email)
  email.message.assertHtmlIncludes('<a href="/verify/email"> Verify your email address</a>')
}
```

## Criando transportes personalizados

Os transportes do AdonisJS Mail são construídos em cima dos [transportes do Nodemailer](https://nodemailer.com/plugins/create/#transports); portanto, você deve criar/usar um transporte do nodemailer antes de registrá-lo com o pacote Mail.

Neste guia, vamos encapsular o [nodemailer-postmark-transport](https://www.npmjs.com/package/nodemailer-postmark-transport) em um transporte de e-mail do AdonisJS.

```sh
npm i nodemailer nodemailer-postmark-transport
```

Como você pode ver no exemplo a seguir, o trabalho pesado de enviar um e-mail é feito pelo `nodemailer`. O transporte do AdonisJS atua como um adaptador encaminhando a mensagem para o nodemailer e normalizando sua resposta para uma instância de [MailResponse](https://github.com/adonisjs/mail/blob/main/src/mail_response.ts).

```ts
import nodemailer from 'nodemailer'
import nodemailerTransport from 'nodemailer-postmark-transport'

import { MailResponse } from '@adonisjs/mail'
import type {
  NodeMailerMessage,
  MailTransportContract
} from '@adonisjs/mail/types'

/**
 * Configuration accepted by the transport
 */
export type PostMarkConfig = {
  auth: {
    apiKey: string
  }
}

/**
 * Transport implementation
 */
export class PostMarkTransport implements MailTransportContract {
  #config: PostMarkConfig
  constructor(config: PostMarkConfig) {
    this.#config = config
  }

  #createNodemailerTransport(config: PostMarkConfig) {
    return nodemailer.createTransport(nodemailerTransport(config))
  }

  async send(
    message: NodeMailerMessage,
    config?: PostMarkConfig
  ): Promise<MailResponse> {
    /**
     * Create nodemailer transport
     */
    const transporter = this.#createNodemailerTransport({
      ...this.#config,
      ...config,
    })

    /**
     * Send email
     */
    const response = await transporter.sendMail(message)

    /**
     * Normalize response to an instance of the "MailResponse" class
     */
    return new MailResponse(response.messageId, response.envelope, response)
  }
}
```

### Criando a função de fábrica de configuração
Para referenciar o transporte acima dentro do arquivo `config/mail.ts`, você deve criar uma função de fábrica que retorne uma instância do transporte.

Você pode escrever o código a seguir dentro do mesmo arquivo da implementação do seu transporte.

```ts
import type {
  NodeMailerMessage,
  MailTransportContract,
  // insert-start
  MailManagerTransportFactory
  // insert-end
} from '@adonisjs/mail/types'

export function postMarkTransport(
  config: PostMarkConfig
): MailManagerTransportFactory {
  return () => {
    return new PostMarkTransport(config)
  }
}
```

### Usando o transporte
Finalmente, você pode referenciar o transporte dentro do seu arquivo de configuração usando o auxiliar `postMarkTransport`.

```ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/mail'
import { postMarkTransport } from 'my-custom-package'

const mailConfig = defineConfig({
  mailers: {
    postmark: postMarkTransport({
      auth: {
        apiKey: env.get('POSTMARK_API_KEY'),
      },
    }),
  },
})
```
