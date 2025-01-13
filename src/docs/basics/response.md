---
summary: A classe Response é usada para enviar respostas HTTP. Ela suporta o envio de fragmentos HTML, objetos JSON, fluxos e muito mais.
---

# Response

Uma instância da [classe response](https://github.com/adonisjs/http-server/blob/main/src/response.ts) é usada para responder a solicitações HTTP. O AdonisJS suporta o envio de **fragmentos HTML**, **objetos JSON**, **fluxos** e muito mais. A instância response pode ser acessada usando a propriedade `ctx.response`.

## Enviando resposta

A maneira mais simples de enviar uma resposta é retornar um valor do manipulador de rota.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  /** String simples */
  return 'This is the homepage.'

  /** Fragmento HTML */
  return '<p> This is the homepage </p>'

  /** Resposta JSON */
  return { page: 'home' }

  /** Convertido para string ISO */
  return new Date()
})
```

Além de retornar um valor do manipulador de rota, você pode usar o método `response.send` para definir explicitamente o corpo da resposta. No entanto, chamar o método `response.send` várias vezes substituirá o corpo antigo e manterá apenas o mais recente.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ response }) => {
  /** String simples */
  response.send('This is the homepage')

  /** Fragmento HTML */
  response.send('<p> This is the homepage </p>')

  /** Resposta JSONe */
  response.send({ page: 'home' })

  /** Convertido para string ISO */
  response.send(new Date())
})
```

Um código de status personalizado para a resposta pode ser definido usando o método `response.status`.

```ts
response.status(200).send({ page: 'home' })

// Enviar resposta 201 vazia
response.status(201).send('')
```

## Conteúdo de streaming

O método `response.stream` permite canalizar um fluxo para a resposta. O método destrói internamente o fluxo após terminar.

O método `response.stream` não define os cabeçalhos `content-type` e `content-length`; você deve defini-los explicitamente antes de transmitir o conteúdo.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ response }) => {
  const image = fs.createReadStream('./some-file.jpg')
  response.stream(image)
})
```

Um código de status 500 é enviado ao cliente em caso de erro. No entanto, você pode personalizar o código de erro e a mensagem definindo um retorno de chamada como o segundo parâmetro.

```ts
const image = fs.createReadStream('./some-file.jpg')

response.stream(image, () => {
  const message = 'Unable to serve file. Try again'
  const status = 400

  return [message, status]
})
```

## Baixando arquivos

Recomendamos usar o método `response.download` em vez do método `response.stream` quando você quiser transmitir arquivos do disco. Isso ocorre porque o método `download` define automaticamente os cabeçalhos `content-type` e `content-length`.

```ts
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'

router.get('/uploads/:file', async ({ response, params }) => {
  const filePath = app.makePath(`uploads/${params.file}`)

  response.download(filePath)
})
```

Opcionalmente, você pode gerar uma [Etag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) para o conteúdo do arquivo. Usar Etags ajudará o navegador a reutilizar a resposta em cache da solicitação anterior (se houver).

```ts
const filePath = app.makePath(`uploads/${params.file}`)
const generateEtag = true

response.download(filePath, generateEtag)
```

Semelhante ao método `response.stream`, você pode enviar uma mensagem de erro personalizada e um código de status definindo um retorno de chamada como o último parâmetro.

```ts
const filePath = app.makePath(`uploads/${params.file}`)
const generateEtag = true

response.download(filePath, generateEtag, (error) => {
  if (error.code === 'ENOENT') {
    return ['File does not exists', 404]
  }

  return ['Cannot download file', 400]
})
```

### Forçar download de arquivos

O método `response.attachment` é semelhante ao método `response.download`, mas força os navegadores a salvar o arquivo no computador do usuário definindo o cabeçalho [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition).

```ts
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'

router.get('/uploads/:file', async ({ response, params }) => {
  const filePath = app.makePath(`uploads/${params.file}`)

  response.attachment(filePath, 'custom-filename.jpg')
})
```

## Definindo status de resposta e cabeçalhos

### Definindo status

Você pode definir o status de resposta usando o método `response.status`. Chamar esse método substituirá o status de resposta existente (se houver). No entanto, você pode usar o método `response.safeStatus` para definir o status somente quando ele for `undefined`.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ response }) => {
  /**
   * Define o status para 200
   */
  response.safeStatus(200)

  /**
   * Não define o status, pois ele
   * já está definido
   */
  response.safeStatus(201)
})
```

### Definindo cabeçalhos

Você pode definir os cabeçalhos de resposta usando o método `response.header`. Este método substitui o valor do cabeçalho existente (se ele já existir). No entanto, você pode usar o método `response.safeHeader` para definir o cabeçalho somente quando ele for `undefined`.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ response }) => {
  /**
   * Define o cabeçalho do tipo de conteúdo
   */
  response.safeHeader('Content-type', 'text/html')

  /**
   * Não define o cabeçalho content-type, pois ele
   * já está definido
   */
  response.safeHeader('Content-type', 'text/html')
})
```

Você pode usar o método `response.append` para anexar valores aos valores de cabeçalho existentes.

```ts
response.append('Set-cookie', 'cookie-value')
```

O método `response.removeHeader` remove o cabeçalho existente.

```ts
response.removeHeader('Set-cookie')
```

### Cabeçalho `X-Request-Id`

Se o cabeçalho existir na solicitação atual ou se [Gerando IDs de solicitação](./request#generating-request-ids) estiver habilitado, o cabeçalho estará presente na resposta.

## Redirecionamentos

O método `response.redirect` retorna uma instância da classe [Redirect](https://github.com/adonisjs/http-server/blob/main/src/redirect.ts). A classe redirect usa a API fluente para construir a URL de redirecionamento.

A maneira mais simples de executar um redirecionamento é chamar o método `redirect.toPath` com o caminho de redirecionamento.

```ts
import router from '@adonisjs/core/services/router'

router.get('/posts', async ({ response }) => {
  response.redirect().toPath('/articles')
})
```

A classe redirect também permite construir uma URL a partir de uma rota pré-registrada. O método `redirect.toRoute` aceita o [identificador de rota](./routing.md#route-identifier) ​​como o primeiro parâmetro e os parâmetros de rota como o segundo parâmetro.

```ts
import router from '@adonisjs/core/services/router'

router.get('/articles/:id', async () => {}).as('articles.show')

router.get('/posts/:id', async ({ response, params }) => {
  response.redirect().toRoute('articles.show', { id: params.id })
})
```

### Redirecionar de volta para a página anterior

Você pode querer redirecionar o usuário para a página anterior durante os envios de formulários em caso de erros de validação. Você pode fazer isso usando o método `redirect.back`.

```ts
response.redirect().back()
```

### Código de status de redirecionamento

O status padrão para respostas de redirecionamento é `302`; você pode alterá-lo chamando o método `redirect.status`.

```ts
response.redirect().status(301).toRoute('articles.show', { id: params.id })
```

### Redirecionar com sequência de consulta

Você pode usar o método `withQs` para anexar uma sequência de consulta à URL de redirecionamento. O método aceita um objeto de um par de chave-valor e o converte em uma sequência.

```ts
response.redirect().withQs({ page: 1, limit: 20 }).toRoute('articles.index')
```

Para encaminhar a sequência de consulta da URL de solicitação atual, chame o método `withQs` sem nenhum parâmetro.

```ts
// Encaminhar sequência de consulta de URL atual
response.redirect().withQs().toRoute('articles.index')
```

Ao redirecionar de volta para a página anterior, o método `withQs` encaminhará a sequência de consulta da página anterior.

```ts
// Encaminhar sequência de consulta de URL atual
response.redirect().withQs().back()
```

## Abortando solicitação com erro

Você pode usar o método `response.abort` para encerrar a solicitação gerando uma exceção. O método lançará uma exceção `E_HTTP_REQUEST_ABORTED` e acionará o fluxo [exception handling](./exception_handling.md).

```ts
router.get('posts/:id/edit', async ({ response, auth, params }) => {
  const post = await Post.findByOrFail(params.id)

  if (!auth.user.can('editPost', post)) {
    response.abort({ message: 'Cannot edit post' })
  }

  // continuar com o restante da lógica
})
```

Por padrão, a exceção criará uma resposta HTTP com um código de status `400`. No entanto, você pode especificar um código de status personalizado como o segundo parâmetro.

```ts
response.abort({ message: 'Cannot edit post' }, 403)
```

## Executando ações após o término da resposta

Você pode ouvir o evento quando o Node.js terminar de gravar a resposta no soquete TCP usando o método `response.onFinish`. Nos bastidores, usamos o pacote [on-finished](https://github.com/jshttp/on-finished), então sinta-se à vontade para consultar o arquivo README do pacote para uma explicação técnica aprofundada.

```ts
router.get('posts', ({ response }) => {
  response.onFinish(() => {
    // lógica de limpeza
  })
})
```

## Acessando o objeto `res` do Node.js

Você pode acessar o [objeto res do Node.js](https://nodejs.org/dist/latest-v19.x/docs/api/http.html#class-httpserverresponse) usando a propriedade `response.response`.

```ts
router.get('posts', ({ response }) => {
  console.log(response.response)
})
```

## Serialização do corpo da resposta

O conjunto de corpos de resposta usando o método `response.send` é serializado para uma string antes de ser [escrito como resposta](https://nodejs.org/dist/latest-v18.x/docs/api/http.html#responsewritechunk-encoding-callback) para o fluxo de mensagens de saída.

A seguir está a lista de tipos de dados suportados e suas regras de serialização.

- [função stringify segura](https://github.com/poppinss/utils/blob/main/src/json/safe_stringify.ts). O método é semelhante a `JSON.stringify`, mas remove as referências circulares e serializa `BigInt(s)`.
- Os valores numéricos e booleanos são convertidos em uma string.
- A instância da classe Date é convertida em uma string chamando o método `toISOString`.
- Expressões regulares e objetos de erro são convertidos em uma string chamando o método `toString`.
- Qualquer outro tipo de dado resulta em uma exceção.

### Inferência de tipo de conteúdo

Após serializar a resposta, a classe de resposta infere e define automaticamente os cabeçalhos `content-type` e `content-length`.

A seguir está a lista de regras que seguimos para definir o cabeçalho `content-type`.

- O tipo de conteúdo é definido como `application/json` para matrizes e objetos.
- É definido como `text/html` para fragmentos HTML.
- As respostas JSONP são enviadas com o tipo de conteúdo `text/javascript`.
- O tipo de conteúdo é definido como `text/plain` para todo o resto.

## Estendendo a classe `Response`

Você pode adicionar propriedades personalizadas à classe Response usando macros ou getters. Certifique-se de ler o [guia de extensão do AdonisJS](../concepts/extending_the_framework.md) primeiro se você for novo no conceito de macros.

```ts
import { Response } from '@adonisjs/core/http'

Response.macro('property', function (this: Response) {
  return value
})
Response.getter('property', function (this: Response) {
  return value
})
```

Como as macros e getters são adicionados em tempo de execução, você deve informar o TypeScript sobre seus tipos.

```ts
declare module '@adonisjs/core/http' {
  export interface Response {
    property: valueType
  }
}
```
