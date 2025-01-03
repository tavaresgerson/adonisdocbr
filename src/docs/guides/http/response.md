# Resposta

A instância da [classe de resposta](https://github.com/adonisjs/http-server/blob/develop/src/Response/index.ts) permite que você responda às solicitações HTTP. O AdonisJS pronto para uso suporta o envio de **fragmentos HTML**, **objetos JSON**, **fluxos** e muito mais.

Você pode acessar o objeto `response` da instância de contexto HTTP passada para o manipulador de rota, middleware e manipulador de exceção.

```ts
Route.get('/', (ctx) => {
  ctx.response.send('hello world')
})
```

## Enviando a resposta

A maneira mais simples de enviar uma resposta é retornar um valor do manipulador de rota.

```ts
Route.get('/', () => {
  /** String simples */
  return 'This is the homepage'

  /** Fragmento HTMLt */
  return '<p> This is the homepage </p>'

  /** Resposta JSON */
  return { page: 'home' }

  /** Converter para string ISO */
  return new Date()
})
```

Além de retornar um valor, você também pode usar o método `response.send` para enviar a resposta. O primeiro argumento é o corpo da resposta (o mesmo que o valor de retorno). Opcionalmente, você pode passar um segundo argumento para gerar e definir o [etag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag).

::: info NOTA
Você também pode habilitar a geração de ETag para todas as respostas habilitando a propriedade `http.etag` dentro do arquivo `config/app.ts`.
:::

```ts
response.send({ hello: 'world' })

// Com etag
response.send({ hello: 'world' }, true)
```

### Serializando o corpo da resposta

A seguir está a lista de tipos de dados serializados pela classe de resposta.

[função stringify segura](https://github.com/poppinss/utils/blob/develop/src/safeStringify.ts). O método é semelhante ao `JSON.stringify`, mas remove as referências circulares.
- Os valores **number** e **boolean** são convertidos em uma string.
- A instância de **Date** é convertida em uma string chamando o método `toISOString`.
- **Expressões regulares** e objetos **error** são convertidos em uma string chamando o método `toString` neles.
- Qualquer outro tipo de dado resulta em uma exceção.

### Inferência de tipo de conteúdo

A classe de resposta define automaticamente os cabeçalhos `content-type` e `content-length` inspecionando o corpo da resposta.

::: info NOTA
O cabeçalho automático **content type** é definido somente quando você não o define explicitamente durante o ciclo de vida da solicitação.
:::

- O tipo de conteúdo é definido como `application/json` para matrizes e objetos.
- Ele é definido como `text/html` para fragmentos HTML.
- As respostas JSONP são enviadas com o tipo de conteúdo `text/javascript`.
- Para todo o resto, definimos o tipo de conteúdo como `text/plain`.

## Resposta preguiçosa

Muitas estruturas Node.js escrevem a resposta para o fluxo de saída assim que você chama o método `response.send`. No entanto, o AdonisJS **não** faz o mesmo. Em vez disso, esperamos que o manipulador de rota e as chamadas de middleware terminem antes de escrever a resposta final.

Essa abordagem garante que a última chamada para `response.send` sempre vença. Na maioria dos casos, esse comportamento não afeta você ou seus aplicativos. No entanto, ele permite que você pós-processe a resposta dentro de um middleware.

A seguir está um exemplo de conversão das chaves de objeto `camelCase` para `snake_case`.

::: warning ATENÇÃO
O exemplo a seguir não é a melhor maneira de transformar a resposta. É apenas uma demonstração de como o pós-processamento de uma resposta se parece
:::

```ts {1,10-19}
import snakeCaseKeys from 'snakecase-keys'

Route
  .get('/', async ({ response }) => {
    response.send({ fullName: 'Harminder Virk' })
  })
  .middleware(async ({ response }, next) => {
    await next()

    /**
     * O código a seguir é executado após o manipulador de rotas.
     * Leia o guia de middleware para aprender como ele funciona
     */
    const existingBody = response.lazyBody[0]
    if (!existingBody || existingBody.constructor !== Object) {
      return
    }

    response.send(snakeCaseKeys(existingBody))
  })
```

O manipulador de rota escreve o corpo da resposta usando o método `response.send` no exemplo acima. No entanto, o middleware downstream altera o corpo e o reescreve usando `response.send` novamente.

Como o corpo da resposta é avaliado preguiçosamente, o AdonisJS sempre definirá os cabeçalhos **content-length** e **content-type** inspecionando o corpo da resposta mais recente.

## Status de resposta e cabeçalhos
A seguir estão os métodos para trabalhar com os cabeçalhos de resposta e o status de resposta.

### `header`
O método `response.header` define o cabeçalho de resposta HTTP. Usar este método substitui o cabeçalho existente (se houver).

```ts
response.header('Content-type', 'text/html')
```

### `append`
O método `response.append` é semelhante ao método `header`. No entanto, ele anexa ao valor do cabeçalho existente (se houver).

```ts
response.append('Set-cookie', 'cookie-value')
```

### `removeHeader`
O `response.removeHeader` permite remover um cabeçalho de resposta existente.

```ts
response.removeHeader('Content-type')
```

### `getHeader`
O método `response.getHeader` retorna o valor de um cabeçalho existente.

```ts
const cookie = response.getHeader('Set-cookie')
```

### `safeHeader`
O método `response.safeHeader` é semelhante ao método `header`. No entanto, ele só define o cabeçalho se ele ainda não estiver definido.

```ts
response.safeHeader('Content-type', 'application/json')
```

### `status`
O método `response.status` define o status da resposta HTTP. Você também pode usar os [métodos descritivos](#descriptive-response-methods) para definir o status e o corpo da resposta juntos.

```ts
response.status(401)
```

### `safeStatus`
Assim como o método `status`, o `response.status` só define o status se ele ainda não estiver definido.

```ts
response.safeStatus(401)
```

## Streams e downloads de arquivos

O AdonisJS tem suporte de primeira classe para canalizar fluxos e downloads de arquivos. Além disso, garantimos a limpeza adequada dos fluxos em caso de erros.

### `stream`
O método `response.stream` permite canalizar o fluxo para a resposta. Este método não define os cabeçalhos **content-type** e **content-length**, e você terá que defini-los manualmente.

```ts
const image = fs.createReadStream('./some-file.jpg')
response.stream(image)
```

No caso de erros, uma resposta A 500 é enviada ao cliente. No entanto, você pode enviar um código de status personalizado e uma mensagem definindo um `callback`. O callback deve retornar uma matriz com a mensagem de resposta e o código de status da resposta.

```ts
response.stream(image, (error) => {
  return ['Unable to send file', 400]
})
```

### `download`
O método `download` transmite o arquivo para o cliente lendo-o do disco. No entanto, diferentemente do método stream, o método `download` define os cabeçalhos **content-type** e **content-length**.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')
response.download(filePath)
```

Opcionalmente, você também pode definir o ETag para o arquivo.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')
response.download(filePath, true)
```

Você pode definir um código de status personalizado e uma mensagem passando um `callback` como o terceiro parâmetro.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')

response.download(filePath, true, (error) => {
  if (error.code === 'ENOENT') {
    return ['File does not exists', 404]
  }

  return ['Cannot download file', 400]
})
```

### `attachment`
O `response.attachment` é semelhante ao método `download`. No entanto, ele permite personalizar o nome do arquivo baixado e define o cabeçalho [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition).

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')
response.attachment(filePath)

// definir nome personalizado
response.attachment(filePath, 'foo.jpg')

// definir disposição personalizada
response.attachment(filePath, 'foo.jpg', 'inline')
```

## Redirecionamentos
A classe de resposta expõe uma API avançada para trabalhar com redirecionamentos, incluindo redirecionar usuários para uma rota, redirecionar de volta para a página anterior e encaminhar a sequência de consulta existente.

Você pode obter uma instância da [classe Redirect](https://github.com/adonisjs/http-server/blob/develop/src/Redirect/index.ts) usando o método `response.redirect()`.

```ts
// Redirecionar de volta
response.redirect().back()

// Redirecionar para uma url
response.redirect().toPath('/some/url')
```

### Código de status personalizado
Por padrão, um código de status `302` é usado. No entanto, você pode substituí-lo usando o método `.status`.

```ts
response.redirect().status(301).toPath('/some/url')
```

### Redirecionar para uma rota
Você também pode redirecionar a solicitação para uma rota nomeada usando o método `.toRoute`.

```ts
response.redirect().toRoute('PostsController.show', { id: 1 })
```

### Definir/encaminhar string de consulta
O `.withQs` permite que você encaminhe a string de consulta existente ou defina uma string de consulta personalizada durante o redirecionamento.

```ts
response
  .redirect()
  .withQs() // 👈 encaminha o qs existente
  .back()

response
  .redirect()
  .withQs({ sort: 'id' }) // 👈 custom
  .back()
```

### `withQs` com parâmetros
Chamar o método `.withQs` com objeto personalizado várias vezes mescla os objetos. No entanto, você pode combiná-lo com o método `.clearQs` para limpar os objetos existentes. Por exemplo:

```ts
response
  .redirect()
  .withQs({ sort: 'id' })
  .clearQs()
  .withQs({ filters: { name: 'virk' } })
  .toPath('/users')

// URL: /users?filters[name]=virk
```

### `withQs` sem parâmetros
Chamar o método `withQs` sem nenhum parâmetro encaminhará a string de consulta existente para a URL redirecionada. Se você redirecionar o usuário de volta para a página antiga, usaremos a string de consulta da URL do cabeçalho `referrer`.

```ts
response.redirect().withQs().back() // 👈 cabeçalho de referência qs é usado
```

```ts
response.redirect().withQs().toPath('/users') // 👈 URL atual qs é usado
```

## Abortar e responder
A classe response permite que você aborte a solicitação HTTP atual usando os métodos `response.abort` ou `response.abortIf`.

### `abort`
O método `response.abort` aborta a solicitação atual gerando uma [AbortException](https://github.com/adonisjs/http-server/blob/develop/src/Response/index.ts#L44)

O método aceita um total de dois argumentos: ou seja, o corpo da resposta e um status opcional.

```ts
if (!auth.user) {
  response.abort('Not authenticated')

  // com status personalizado
  response.abort('Not authenticated', 401)
}
```

### `abortIf`
O método `response.abortIf` aceita uma condição e aborta a solicitação quando a condição é verdadeira.

```ts
response.abortIf(!auth.user, 'Not authenticated', 401)
```

### `abortUnless`
O método `response.abortUnless` é o oposto do método abortIf.

```ts
response.abortUnless(auth.user, 'Not authenticated', 401)
```

## Outros métodos e propriedades
A seguir está a lista de outros métodos e propriedades disponíveis na classe de resposta.

### `finished`
Descubra se a resposta foi gravada no fluxo de saída.

```ts
if (!response.finished) {
  response.send()
}
```

### `headersSent`
Um alias para a propriedade [res.headersSent](https://nodejs.org/dist/latest-v15.x/docs/api/http.html#http_response_headerssent) do Node.js.

### `isPending`
A propriedade é o oposto da propriedade `response.finished`.

```ts
if (response.isPending) {
  response.send()
}
```

### `vary`
Um atalho para definir o [cabeçalho HTTP vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary). Chamar o método `vary` várias vezes anexará à lista de cabeçalhos existentes.

```ts
response.vary('Origin')

// Definir vários cabeçalhos
response.vary('Accept, User-Agent')
```

### `location`
Um atalho para definir o [cabeçalho HTTP location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location).

```ts
response.location('/dashboard')
```

### `type`
Um atalho para definir o [cabeçalho HTTP content-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type).

```ts
response.type('application/json')
```

Você também pode usar as palavras-chave para definir o tipo de conteúdo. Por exemplo:

```ts
response.type('json') // define content-type=application/json
response.type('html') // define content-type=text/html
```

## Métodos de resposta descritivos
A classe de resposta tem vários métodos descritivos (um de cada status HTTP) para enviar o corpo da resposta e definir o status ao mesmo tempo. Por exemplo:

```ts
response.badRequest({ error: 'Invalid login credentials' })
response.forbidden({ error: 'Unauthorized' })
response.created({ data: user })
```

[Aqui está](https://github.com/adonisjs/http-server/blob/ea55c2a65fd388373d0b4e35ae45bee9cb096d02/src/Response/index.ts#L937-L1145) a lista de todos os métodos disponíveis.

## Estendendo a classe Response
Você pode estender a classe Response usando macros ou getters. O melhor lugar para estender a resposta é dentro de um provedor de serviços personalizado.

Abra o arquivo `providers/AppProvider.ts` pré-existente e escreva o seguinte código dentro do método `boot`.

```ts {7-14}
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Response = this.app.container.use('Adonis/Core/Response')

    Response.macro('flash', function (messages) {
      this.ctx!.session.flash(messages)
      return this
    })
  }
}
```

No exemplo acima, adicionamos o método `flash` à classe de resposta. Ele define as mensagens flash chamando internamente o método `session.flash`.

Você pode usar o método recém-adicionado da seguinte forma.

```ts
Route.post('users', ({ response }) => {
  response.flash({ success: 'User created' })
})
```

### Informando o TypeScript sobre o método
A propriedade `flash` é adicionada no tempo de execução e, portanto, o TypeScript não sabe sobre ela. Para informar o TypeScript, usaremos [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) e adicionaremos a propriedade à interface `ResponseContract`.

Crie um novo arquivo no caminho `contracts/response.ts` (o nome do arquivo não é importante) e cole o seguinte conteúdo dentro dele.

```ts
// contracts/response.ts

declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    flash(messages: any): this
  }
}
```

## Leitura adicional
A seguir estão alguns dos guias adicionais para aprender mais sobre os tópicos não abordados neste documento.

- [Cookies](./cookies.md)
- [Sessão](./session.md)
- [Visualizações](../views/introduction.md)
