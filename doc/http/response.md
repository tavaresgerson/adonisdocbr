# Resposta

A instância da classe de resposta permite que você responda às solicitações HTTP. O AdonisJS pronto para uso oferece suporte ao envio de 
fragmentos HTML, objetos JSON, streams e muito mais.

Você pode acessar o objeto `response` da instância de contexto HTTP passada para o manipulador de rota, middleware e manipulador de exceção.

```ts
Route.get('/', (ctx) => {
  ctx.response.send('hello world')
})
```

### Enviando uma resposta
A maneira mais simples de enviar uma resposta é retornar um valor do manipulador de rota.

```ts
Route.get('/', () => {
  /** Texto simples */
  return 'This is the homepage'

  /** Fragmento HTML */
  return '<p> This is the homepage </p>'

  /** Resposta em JSON */
  return { page: 'home' }

  /** Converte ISO para string */
  return new Date()
})
```

Além de retornar um valor, você também pode usar o método `response.send` para enviar a resposta. O primeiro argumento é 
o corpo da resposta (igual ao valor de retorno). Opcionalmente, você pode passar um segundo argumento para gerar e definir o `etag`.

> Você também pode habilitar a geração de `ETag` para todas as 
> respostas habilitando a propriedade `http.etag` dentro do arquivo `config/app.ts`.

```ts
response.send({ hello: 'world' })

// Com etag
response.send({ hello: 'world' }, true)
```

#### Serializando o corpo da resposta
A seguir está a lista de tipos de dados serializados pela classe de resposta.

* Matrizes e objetos são sequenciados usando a função [stringify segura](https://github.com/poppinss/utils/blob/develop/src/safeStringify.ts). 
  O método é semelhante à `JSON.stringify`, mas remove as referências circulares.
* O número e os valores booleanos são convertidos em uma string.
* A instância de Date é convertida em uma string chamando o método `toISOString`.
* Expressões regulares e objetos de erro são convertidos em uma string chamando o método `toString` neles.
* Qualquer outro tipo de dados resulta em uma exceção.

#### Inferência de tipo de conteúdo
A classe de resposta define automaticamente os cabeçalhos `content-type` e `content-length` inspecionando o corpo da resposta.

> O cabeçalho automático do tipo de conteúdo é definido apenas quando você não o define explicitamente durante o ciclo de vida da solicitação.

* O tipo de conteúdo é definido como `application/json` para matrizes e objetos.
* É definido como `text/html` para fragmentos HTML.
* As respostas JSONP são enviadas com o tipo de conteúdo `text/javascript`.
* Para todo o resto, definimos o tipo de conteúdo como `text/plain`.

### Resposta preguiçosa
Muitos frameworks Node.js escrevem a resposta para o fluxo de saída assim que você chama o método `response.send`. AdonisJS não faz o mesmo. 
Em vez disso, esperamos que o manipulador de rota e todas as chamadas de middleware terminem antes de escrever a resposta final.

Essa abordagem garante que a última chamada para `response.send` sempre vença. Na maioria dos casos, esse comportamento não afeta você 
ou seus aplicativos. No entanto, ele permite pós-processar a resposta dentro de um middleware.

A seguir está um exemplo de conversão das chaves `camelCase` do objeto em `snake_case`.

O exemplo a seguir não é a melhor maneira de transformar a resposta. É apenas uma demonstração 
de como é o pós-processamento de uma resposta

```ts
import snakeCaseKeys from 'snakecase-keys'

Route
  .get('/', async ({ response }) => {
    response.send({ fullName: 'Harminder Virk' })
  })
  .middleware(async ({ response }, next) => {
    await next()

    /**
     * O código a seguir é executado após o manipulador de rota.
     * Leia a documentação sobre middlewares para saber como funciona
     */
    const existingBody = response.lazyBody[0]
    if (!existingBody || existingBody.constructor !== Object) {
      return
    }

    response.send(snakeCaseKeys(existingBody))
  })
```

No exemplo acima, o manipulador de rota escreve o corpo da resposta usando o método `response.send`. No entanto, o middleware 
downstream transforma o corpo e o reescreve usando novamente `response.send`.

Como o corpo da resposta é avaliado vagarosamente, sempre definiremos o comprimento do conteúdo e os cabeçalhos de tipo de 
conteúdo inspecionando o corpo de resposta mais recente.

### Status de resposta e cabeçalhos
A seguir estão os métodos para trabalhar com os cabeçalhos de resposta e o status da resposta.

#### header
O método `response.header` define o cabeçalho da resposta HTTP. Usar este método substitui o cabeçalho existente (se houver).

```ts
response.header('Content-type', 'text/html')
```

#### append
O método `response.append` é semelhante ao método `header`. No entanto, ele é anexado ao valor do cabeçalho existente (se houver).

```ts
response.append('Set-cookie', 'cookie-value')
```

#### removeHeader
O cabeçalho `response.removeHeader` permite remover um cabeçalho de resposta existente.

```ts
response.removeHeader('Content-type')
```

#### getHeader
O método `response.getHeader` retorna o valor de um cabeçalho existente.

```ts
const cookie = response.getHeader('Set-cookie')
```
 
#### safeHeader
O método `response.safeHeader` é semelhante ao método `header`. No entanto, ele apenas define o cabeçalho se ainda não estiver definido.

```ts
response.safeHeader('Content-type', 'application/json')
```

#### status
O método `response.status` define o status da resposta HTTP. Você também pode usar os métodos descritivos para 
definir o status e o corpo da resposta juntos.

```ts
response.status(401)
```

#### safeStatus
Assim como o método `status`, o `response.safeStatus` define o status se ainda não estiver definido.

```ts
response.safeStatus(401)
```

### Streams e downloads de arquivos
AdonisJS tem suporte de primeira classe para fluxos de streams e downloads de arquivos. Além disso, garantimos a 
limpeza adequada dos fluxos em caso de erros.

#### Stream
O método `response.stream` permite canalizar o fluxo para a resposta. Este método não define o tipo de conteúdo e os cabeçalhos de 
comprimento do conteúdo, você terá que defini-los manualmente.

```ts
const image = fs.createReadStream('./some-file.jpg')
response.stream(image)
```

Em caso de erros, uma resposta 500 é enviada ao cliente. No entanto, você pode enviar uma mensagem e um código de status personalizado, 
definindo um `callback` como o segundo parâmetro.

```ts
response.stream(image, (error) => {
  return ['Unable to send file', 400]
})
```

#### download
O método `download` transmite o arquivo para o cliente lendo-o do disco. Ao contrário do método de fluxo, o método `download` define o 
tipo de conteúdo e os cabeçalhos de comprimento do conteúdo.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')
response.download(filePath)
```

Opcionalmente, você também pode definir a `ETag` para o arquivo.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')
response.download(filePath, true)
```

Um código de status personalizado e uma mensagem podem ser definidos passando a como `callback` no terceiro parâmetro.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')

response.download(filePath, true, (error) => {
  if (error.code === 'ENOENT') {
    return ['File does not exists', 404]
  }

  return ['Cannot download file', 400]
})
```

##### attachment
O `response.attachment` é semelhante ao método `download`. No entanto, permite personalizar o nome do arquivo baixado e também define o 
cabeçalho `Content-Disposition`.

```ts
const filePath = Application.tmpPath('uploads/some-file.jpg')
response.attachment(filePath)

// Define um nome customizado
response.attachment(filePath, 'foo.jpg')

// Customiza a disposição do arquivo
response.attachment(filePath, 'foo.jpg', 'inline')
```

### Redirecionamento
A classe de resposta expõe uma API rica para trabalhar com redirecionamentos, incluindo redirecionar usuários para uma rota, 
redirecionar de volta para a página anterior e encaminhar a string de consulta existente.

Você pode obter uma instância da classe [Redirect](https://github.com/adonisjs/http-server/blob/develop/src/Redirect/index.ts) 
usando o método `response.redirect()`.

```ts
// Redireciona de volta
response.redirect().back()

// Redireciona para uma URL
response.redirect().toPath('/some/url')
```

#### Código de status personalizado
Por padrão, um código `302` de status é usado. Você pode substituí-lo usando o método `.status`.

```ts
response.redirect().status(301).toPath('/some/url')
```

#### Redirecionar para uma rota
Você também pode redirecionar a solicitação para uma rota nomeada usando o método `.toRoute`.

```ts
response.redirect().toRoute('PostsController.show', { id: 1 })
```

#### Definir/encaminhar strings de consulta
O método `.withQs` permite que você encaminhe a string de consulta existente ou defina uma string de 
consulta personalizada durante o redirecionamento.

```ts
response
  .redirect()
  .withQs() // 👈 encaminha com o qs existente
  .back()

response
  .redirect()
  .withQs({ sort: 'id' }) // 👈 customizado
  .back()
```

### `withQs` com parâmetros
Chamar o método `.withQs` com o objeto personalizado várias vezes mescla os objetos. No entanto, você pode combiná-lo com o método 
`.clearQs` para limpar os objetos existentes. Por exemplo:

```ts
response
  .redirect()
  .withQs({ sort: 'id' })
  .clearQs()
  .withQs({ filters: { name: 'virk' } })
  .toPath('/users')

// URL: /users?filters[name]=virk
```

#### `withQs` sem parâmetros
Chamar o método `withQs` sem nenhum parâmetro encaminhará a string de consulta existente para a URL redirecionada. Se você redirecionar 
o usuário de volta à página antiga, a string de consulta da URL referenciada do cabeçalho será usada.

```ts
response.redirect().withQs().back() // 👈 cabeçalho de referência que a qs é usada
```

```ts
response.redirect().withQs().toPath('/users') // 👈 Usando QS da URL atual
```

### Abortar e responder
A classe de resposta permite que você aborte a solicitação HTTP atual usando os métodos `response.abort` ou `response.abortIf`.

#### abortar
O método `response.abort` aborta a solicitação atual levantando uma [`AbortException`](https://github.com/adonisjs/http-server/blob/develop/src/Response/index.ts#L44)

O método aceita um total de dois argumentos: ou seja, o corpo da resposta e um status opcional.

```ts
if (!auth.user) {
  response.abort('Not authenticated')

  // Com status customizado
  response.abort('Not authenticated', 401)
}

#### abortIf
O método `response.abortIf` aceita uma condição e aborta a solicitação quando a condição é verdadeira.

```ts
response.abortIf(!auth.user, 'Not authenticated', 401)
```

#### abortUnless
O método `response.abortUnless` é o oposto do método abortIf.

```ts
response.abortUnless(auth.user, 'Not authenticated', 401)
```

### Outros métodos e propriedades
A seguir está a lista de outros métodos e propriedades disponíveis na classe de resposta.

#### finished
Descubra se a resposta foi gravada no fluxo de saída.

```ts
if (!response.finished) {
  response.send()
}
```
#### headersSent
Um alias para a propriedade `res.headersSent` do Node.js.

#### isPending
Esta propriedade é o oposto da propriedade `response.finished`.

```ts
if (response.isPending) {
  response.send()
}
```

#### vary
Um atalho para definir o [cabeçalho de variação HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary). 
Chamar o método `vary` várias vezes acrescentará à lista de cabeçalhos existentes.

```ts
response.vary('Origin')

// Define múltiplos cabeçalhos
response.vary('Accept, User-Agent')
```

#### location
Um atalho para definir o [cabeçalho do local HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location).

```ts
response.location('/dashboard')
```

#### type
Um atalho para definir o cabeçalho do [tipo de conteúdo HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type).

```ts
response.type('application/json')
```

Você também pode usar as palavras-chave para definir o tipo de conteúdo. Por exemplo:

```ts
response.type('json') // define como content-type=application/json
response.type('html') // define como content-type=text/html
```

#### Métodos de resposta descritiva
A classe de resposta tem vários métodos descritivos (um de cada status HTTP) para enviar o corpo da resposta e 
definir o status ao mesmo tempo. Por exemplo:

```ts
response.badRequest({ error: 'Invalid login credentials' })
response.forbidden({ error: 'Unauthorized' })
response.created({ data: user })
```

[Aqui](https://github.com/adonisjs/http-server/blob/ea55c2a65fd388373d0b4e35ae45bee9cb096d02/src/Response/index.ts#L937-L1145) está a lista de todos os métodos disponíveis.

### Estendendo classe de resposta
Você pode estender a classe Response usando macros ou getters. O melhor lugar para estender a resposta é dentro de um 
provedor de serviços personalizado.

Abra o arquivo `providers/AppProvider.ts` pré-existente e escreva o código a seguir dentro do método `boot`.

```ts
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

No exemplo acima, adicionamos o método `flash` à classe de resposta. Ele define as mensagens flash chamando o método `session.flash` internamente.

Você pode usar o método recém-adicionado da seguinte maneira.

```ts
Route.post('users', ({ response }) => {
  response.flash({ success: 'User created' })
})
```

#### Informar ao typescript sobre o método
A propriedade `flash` é adicionada no tempo de execução e, portanto, o TypeScript não a conhece. Para informar ao TypeScript, 
usaremos a fusão de declarações e adicionaremos uma propriedade de interface à `ResponseContract`.

Crie um novo arquivo no caminho `contracts/response.ts` (o nome do arquivo não é importante) e cole o seguinte conteúdo dentro dele.

```ts
declare module '@ioc:Adonis/Core/Response' {
  interface ResponseContract {
    flash(messages: any): this
  }
}
```
