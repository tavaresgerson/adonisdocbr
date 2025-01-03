# Solicitação

A instância da [classe de solicitação](https://github.com/adonisjs/http-server/blob/develop/src/Request/index.ts) contém dados para a solicitação HTTP atual, incluindo o **corpo da solicitação**, **arquivos enviados**, **cookies** e muito mais.

Você pode acessar o objeto `request` do contexto HTTP passado para o manipulador de rota, middleware e manipulador de exceção.

```ts
Route.get('/', (ctx) => {
  console.log(ctx.request.url())
})
```

Com desestruturação

```ts
Route.get('/', async ({ request }) => {
  console.log(request.url())
})
```

## String de consulta e parâmetros de rota
A string de consulta analisada pode ser acessada usando o método `request.qs()`.

```ts
Route.get('/', async ({ request }) => {
  /*
   * URL: /?username=virk
   * qs: { username: 'virk' }
   */
  request.qs()
})
```

O método `request.params()` retorna os parâmetros de rota.

```ts
Route.get('/posts/:id/:slug', async ({ request }) => {
  /*
   * URL: /posts/1/hello-world
   * Params: { id: '1', slug: 'hello-world' }
   */
  request.params()
})
```

Você também pode acessar um único parâmetro usando o método `request.param`.

```ts
request.param('id')

// Valor padrão para parâmetros opcionais
request.param('id', 1)
```

## Corpo da solicitação
Você pode acessar o corpo da solicitação usando o método `request.body`.

```ts
Route.post('/', async ({ request }) => {
  request.body()
})
```

#### `request.all`

Além disso, você pode usar o método `request.all`. Ele retorna uma cópia mesclada do corpo da solicitação e da string de consulta da solicitação.

```ts
request.all()
```

#### `request.input`

Você pode usar o método `request.input` para ler o valor de um único campo de entrada. O método também suporta a leitura de valores aninhados usando uma notação de ponto.

```ts
request.input('title')

// Ler valor aninhado.
request.input('user.profile.username')
```

Você também pode definir um valor padrão a ser retornado quando o valor real for `null` ou `undefined`.

```ts
// Retorna "Hello world" se o título estiver faltando
request.input('title', 'Hello world')
```

#### request.only/request.except
Você pode usar os métodos `request.only` e `request.except` para selecionar/filtrar chaves específicas do corpo da solicitação.

```ts
// Cherry pick
const body = request.only(['title', 'description'])

// Omitir
const body = request.except(['submit', 'csrf_token'])
```

## Bodyparser e tipos de conteúdo suportados
O corpo da solicitação é analisado usando o middleware bodyparser pré-configurado. Ele é registrado como um middleware global dentro do arquivo `start/kernel.ts`.

```ts
// start/kernel.ts

Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser')
])
```

A configuração do bodyparser é armazenada dentro do arquivo `config/bodyparser.ts`. O arquivo de configuração é autodocumentado, então sinta-se à vontade para se familiarizar com todas as opções disponíveis para você.

### Converter strings vazias em nulas
Formulários HTML enviam uma string vazia para campos de entrada sem valor. Você pode normalizar todos os **valores de string vazia para nulos** habilitando o sinalizador `convertEmptyStringsToNull`.

::: info NOTA
A opção está disponível apenas para envios de formulários `multipart` e `urlencoded`.
:::

```ts
// config/bodyparser.ts

{
  form: {
    // ... resto da configuração
    convertEmptyStringsToNull: true
  },

  multipart: {
    // ... resto da configuração
    convertEmptyStringsToNull: true
  }
}
```

### Tipos de conteúdo suportados

O bodyparser é capaz de analisar os seguintes tipos de conteúdo.

#### JSON

O analisador JSON processa a solicitação que envia a string JSON com um dos seguintes tipos de conteúdo.

- application/json
- application/json-patch+json
- application/vnd.api+json
- application/csp-report

Você pode adicionar mais tipos de conteúdo ao array `json.types` dentro do arquivo `config/bodyparser.ts`, e o analisador JSON também os processará.

#### Codificado em URL

A solicitação que envia uma string codificada em URL com `content-type='application/x-www-form-urlencoded'` é analisada usando o analisador de codificação de URL.

#### Multipart

As solicitações multipart com `content-type='multipart/form-data'` são analisadas usando o analisador multipart. Certifique-se de ler o guia em [uploads de arquivo](./file-uploads.md) para visualizar todas as opções de configuração disponíveis.

#### Raw

Todas as solicitações com `content-type='text/*'` são lidas usando o analisador raw. Você pode processar ainda mais a string raw dentro de um middleware ou do manipulador de rota.

Você pode usar o analisador raw para processar tipos de conteúdo personalizados/sem suporte. Por exemplo

#### Registre o tipo de conteúdo personalizado

```ts
// config/bodyparser.ts
{
  raw: {
    // ...
    types: ['text/*', 'my-custom-content-type']
  }
}
```

#### Crie um middleware para analisar o tipo de conteúdo mais detalhadamente

```ts {5-15}
Route
  .get('/', ({ request }) => {
    console.log(request.all())
  })
  .middleware(async ({ request }, next) => {
    const contentType = request.header('content-type')

    if (contentType === 'my-custom-content-type') {
      const body = request.raw()
      const parsed = someCustomParser(body)
      request.updateBody(parsed)
    }

    await next()
  })
```

## Rota de solicitação

A classe `request` contém a rota correspondente atual para a solicitação HTTP, e você pode acessá-la da seguinte forma:

```ts
Route.get('/', ({ request }) => {
  /**
   * O padrão de rota
   */
  console.log(request.route.pattern)

  /**
   * O manipulador que manipula a solicitação de rota
   */
  console.log(request.route.handler)

  /**
   * Middleware anexado à rota
   */
  console.log(request.route.middleware)

  /**
   * Nome da rota (existe se a rota for nomeada)
   */
  console.log(request.route.name)
})
```

Você também pode verificar se a URL da solicitação atual corresponde a uma determinada rota ou não.

```ts
if (request.matchesRoute('/posts/:id')) {
}
```

Ou passe uma matriz para verificar mais de uma rota. O método retorna verdadeiro se qualquer uma das rotas corresponder à URL da solicitação atual.

```ts
if (request.matchesRoute(['/posts/:id', '/posts/:id/comments'])) {
}
```

## URL da solicitação

Você pode acessar a URL da solicitação usando o método `request.url()`. Ele retorna o nome do caminho sem o nome do domínio ou a porta.

```ts
request.url()

// Incluir sequência de consulta
request.url(true)
```

O método `request.completeUrl()` retorna a URL completa, incluindo o domínio e a porta (se houver).

```ts
request.completeUrl()

// Incluir sequência de consulta
request.completeUrl(true)
```

## Método de solicitação

### `method`

Retorna o método HTTP para a solicitação fornecida. O método falsificado é retornado quando [form method spoofing](#form-method-spoofing) está habilitado.

```ts
request.method()
```

### `intended`

O método `intended` retorna o método HTTP real e não o falsificado.

```ts
request.intended()
```

## ID da solicitação

IDs de solicitação [ajudam você a depurar e rastrear logs](https://blog.heroku.com/http_request_id_s_improve_visibility_across_the_application_stack) para uma solicitação HTTP fornecida, associando um ID exclusivo a cada entrada de log.

O AdonisJS segue o padrão da indústria e tem suporte de primeira classe para trabalhar com o cabeçalho `X-Request-Id`.

### Gerando IDs de solicitação

Abra o `config/app.ts` e defina o valor de `http.generateRequestId` como true.

Além disso, o request-id é gerado somente quando o cabeçalho `X-Request-Id` não está definido. Isso permite que você gere os IDs de solicitação no nível do seu servidor proxy e, em seguida, referencie-os dentro do seu aplicativo AdonisJS.

```ts
// config/app.ts

{
  http: {
    generateRequestId: true
  }
}
```

### Acessar ID de solicitação

O método `request.id()` retorna o request-id lendo o cabeçalho `X-Request-Id`. O fluxo se parece com o seguinte:

- Leia o valor do cabeçalho `X-Request-Id`. Retorne o valor se estiver presente.
- Gere e defina o cabeçalho manualmente se o sinalizador `generateRequestId` estiver habilitado na configuração.
- Retorne `null` quando o cabeçalho estiver ausente e `generateRequestId` estiver desabilitado.

```ts
request.id()
```

### ID da solicitação dentro dos logs

A instância do logger anexada ao contexto HTTP define automaticamente a propriedade `request_id` em cada instrução de log.

```ts
Route.get('/', ({ logger }) => {
  // { msg: 'hello world', request_id: 'ckk9oliws0000qt3x9vr5dkx7' }
  logger.info('hello world')
})
```

## Cabeçalhos da solicitação

Os métodos `request.headers()` e `request.header()` permitem acesso aos cabeçalhos da solicitação.

```ts
// todos os cabeçalhos
console.log(request.headers())
```

O método `header` retorna o valor para um único campo de cabeçalho. O nome do cabeçalho **não diferencia maiúsculas de minúsculas**.

```ts
request.header('X-CUSTOM-KEY') === request.header('x-custom-key')

// Com valor padrão
request.header('x-header-name', 'default value')
```

## Endereço IP da solicitação

O método `request.ip()` retorna o endereço IP mais confiável para a solicitação HTTP. Certifique-se de ler a seção [trusted proxy](#trusted-proxy) para entender como você pode obter o endereço IP correto quando seu aplicativo estiver atrás de um servidor proxy.

```ts
request.ip()
```

O método `request.ips()` retorna uma matriz de endereços IP começando do mais confiável para o menos confiável.

```ts
request.ips()
```

### Método de recuperação de IP personalizado

Se as configurações de proxy confiáveis ​​forem insuficientes para determinar o endereço IP correto, você pode implementar seu próprio método `getIp` personalizado.

Abra o arquivo `config/app.ts` e defina o método `getIp` da seguinte forma:

```ts
http: {
  getIp(request) {
    const nginxRealIp = request.header('X-Real-Ip')
    if (nginxRealIp) {
      return nginxRealIp
    }

    return request.ips()[0]
  }
}
```

## Falsificação de método de formulário

Formulários HTML padrão não podem usar todos os verbos HTTP além de `GET` e `POST`. Então, por exemplo, significa que você não pode criar um formulário com o método `PUT`.

No entanto, o AdonisJS permite que você falsifique o método HTTP usando a string de consulta `_method`. No exemplo a seguir, a solicitação será roteada para a rota que escuta a solicitação `PUT`.

```html
<form method="POST" action="/posts/1?_method=PUT"></form>
```

A falsificação do método de formulário só funciona:

- Quando o valor de `http.allowMethodSpoofing` é definido como true dentro do arquivo `config/app.ts`.
- E o método de solicitação original é `POST`.

## Negociação de conteúdo

[Negociação de conteúdo](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) é um mecanismo usado para servir diferentes representações de um recurso da mesma URL.

O cliente que faz a solicitação pode negociar a **representação do recurso**, **charset**, **idioma** e **codificação** usando diferentes cabeçalhos `Accept`, e você pode lidar com eles da seguinte forma.

### `accepts`

O método `request.accepts` pega uma matriz de tipos de conteúdo (incluindo abreviações) e retorna o tipo de conteúdo mais apropriado inspecionando o cabeçalho `Accept`. Você pode encontrar a lista de tipos de conteúdo suportados [aqui](https://github.com/jshttp/mime-db/blob/master/db.json).

```ts
Route.get('posts', async ({ request, view }) => {
  const posts = [
    {
      title: 'Adonis 101',
    },
  ]

  switch (request.accepts(['html', 'json'])) {
    case 'html':
      return view.render('posts/index', { posts })
    case 'json':
      return posts
    default:
      return view.render('posts/index', { posts })
  }
})
```

### `types`
O método `request.types` retorna uma matriz de tipos de conteúdo inspecionando o cabeçalho `Accept`. A matriz é ordenada pela preferência do cliente (mais preferido primeiro).

```ts
const types = request.types()
```

### `language`
Negocie o idioma solicitado com base no cabeçalho `Accept-language`.

```ts
const language = request.language(['fr', 'de'])

if (language) {
  return view.render(`posts/${language}/index`)
}

return view.render('posts/en/index')
```

### `languages`
O método `languages` retorna uma matriz de idiomas aceitos inspecionando o cabeçalho `Accept-language`. A matriz é ordenada pela preferência do cliente (mais preferido primeiro).

```ts
const languages = request.languages()
```

### `encoding`
Encontre a melhor codificação usando o cabeçalho `Accept-encoding`.

```ts
switch (request.encoding(['gzip', 'br'])) {
  case 'gzip':
    return compressAsGzip(someValue)
  case 'br':
    return compressAsBr(someValue)
  default:
    return value
}
```

### `encodings`
O método `encodings` retorna uma matriz de codificações aceitas inspecionando o cabeçalho `Accept-encoding`. A matriz é ordenada pela preferência do cliente (mais preferido primeiro).

```ts
const encodings = request.encodings()
```

### `charset`
Encontre o melhor charset usando o cabeçalho `Accept-charset`.

```ts
const charset = request.charset(['utf-8', 'hex', 'ascii'])
return Buffer.from('hello-world').toString(charset || 'utf-8')
```

### `charsets`
O método `charsets` retorna uma matriz de charsets aceitos inspecionando o cabeçalho `Accept-charset`. A matriz é ordenada pela preferência do cliente (mais preferido primeiro).

```ts
const charsets = request.charsets()
```

## Proxy confiável
A maioria dos aplicativos Node.js são implantados atrás de um servidor proxy como Nginx ou Caddy. Portanto, o valor de [remoteAddress](https://nodejs.org/api/net.html#net_socket_remoteaddress) é o endereço IP do servidor proxy e não do cliente.

No entanto, todos os servidores proxy definem os cabeçalhos [`X-Forwaded`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#proxies) para refletir os valores originais da solicitação, e você deve informar o AdonisJS para confiar nos cabeçalhos do servidor proxy.

Você pode controlar em quais proxies confiar modificando o valor `http.trustProxy` dentro do `config/app.ts`.

```ts
// config/app.ts

{
  http: {
    trustProxy: proxyAddr.compile(valueComesHere)
  }
}
```

### Endereços IP

Você também pode definir um único ou uma matriz de endereços IP do servidor proxy para confiar.

```ts
{
  trustProxy: proxyAddr.compile('127.0.0.0/8')
}

// ou
{
  trustProxy: proxyAddr.compile(['127.0.0.0/8', 'fc00:ac:1ab5:fff::1/64'])
}
```

Você também pode usar as seguintes palavras-chave abreviadas no lugar de endereços IP.

- `loopback`: endereços de loopback IPv4 e IPv6 (como `::1` e `127.0.0.1`).
- `linklocal`: endereços de link local IPv4 e IPv6 (como `fe80::1:1:1:1` e `169.254.0.1`).
- `uniquelocal`: endereços privados IPv4 e endereços locais exclusivos IPv6 (como `fc00:ac:1ab5:fff::1` e `192.168.0.1`).

### Função personalizada

Você também pode definir uma função personalizada que retorna um booleano por solicitação.

```ts
{
  trustProxy: proxyAddr.compile((address, index) => {
    return address === '127.0.0.1' || address === '123.123.123.123'
  })
}
```

### Cabeçalhos de proxy em uso

Os métodos a seguir da classe de solicitação dependem de um proxy confiável para retornar o valor correto.

- **hostname**: O valor de `request.hostname()` é derivado do cabeçalho `X-Forwarded-Host`.
- **protocol**: O valor de `request.protocol()` é derivado do cabeçalho `X-Forwarded-Proto`.
[Saiba mais](#custom-ip-reterval-method)

## CORS
O AdonisJS tem suporte integrado para responder às solicitações [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) `OPTIONS`. Basta habilitá-lo dentro do arquivo `config/cors.ts`.

```ts
// config/cors.ts

{
  enabled: true,
  // ...resto da configuração
}
```

O arquivo de configuração é amplamente documentado. Certifique-se de passar por todas as opções e ler os comentários associados para entender seu uso.

## Outros métodos e propriedades

A seguir está a lista de outros métodos e propriedades disponíveis na classe Request.

### `hostname`
Retorna o nome do host da solicitação. Se [cabeçalhos de proxy](#trusted-proxy) forem confiáveis, então `X-Forwarded-Host` terá prioridade sobre o cabeçalho `Host`.

```ts
request.hostname()
```

### `ajax`
Descubra se o cabeçalho da solicitação `X-Requested-With` está definido como `'xmlhttprequest'`.

```ts
if (request.ajax()) {
  // retornar resposta para solicitação ajax
}
```

### `matchesRoute`
Descubra se a solicitação atual é para uma determinada rota. O método aceita o identificador de rota como o único argumento. O identificador pode ser o **padrão de rota**, **nome do método do controlador** ou o **nome da rota**.

```ts
if (request.matchesRoute('posts.show')) {
}
```

Você também pode corresponder a várias rotas. O método retorna `true` se a URL de retorno corresponder a qualquer um dos identificadores definidos.

```ts
if (request.matchesRoute(['posts.show', 'posts.edit'])) {
}
```

### `is`
Retorna o melhor tipo de conteúdo correspondente da solicitação, comparando com os tipos fornecidos.

O tipo de conteúdo é escolhido do cabeçalho `Content-Type`, e a solicitação deve ter um corpo.

```ts
const contentType = request.is(['json', 'xml'])

if (contentType === 'json') {
  // corpo do processo como JSON
}

if (contentType === 'xml') {
  // corpo do processo como XML
}
```

### `updateBody`
Permite que você atualize o corpo da solicitação com uma carga útil personalizada. Seria melhor fazer isso, a menos que esteja criando um pacote que propositalmente altere o corpo da solicitação.

```ts
request.updateBody(myCustomPayload)
```

### `updateRawBody`
O `updateRawBody` permite atualizar o corpo bruto da solicitação. O corpo bruto é sempre uma string.

```ts
request.updateRawBody(JSON.stringify(myCustomPayload))
```

### `updateQs`
O `updateQs` permite atualizar o valor da string de consulta analisada.

```ts
request.updateQs(someCustomParser(request.parsedUrl.query))
```

### `original`
Retorna o corpo original da solicitação analisado pelo bodyparser. Chamar o método `updateBody` não altera o payload original.

```ts
request.original()
```

### `hasBody`
Descubra se a solicitação tem um corpo. O bodyparser usa esse método para saber se a solicitação tem um corpo antes de analisá-lo.

```ts
if (request.hasBody()) {
  // analisar corpo da solicitação
}
```

## Estendendo a classe Request
Você pode estender a classe Request usando **macros** ou **getters**. O melhor lugar para estender a solicitação é dentro de um provedor de serviços personalizado.

Abra o arquivo `providers/AppProvider.ts` preexistente e escreva o seguinte código dentro do método `boot`.

```ts {7-16}
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Request = this.app.container.use('Adonis/Core/Request')

    Request.macro('wantsJSON', function () {
      const types = this.types()
      return (
        types[0] && (types[0].includes('/json') || types[0].includes('+json'))
      )
    })
  }
}
```

No exemplo acima, adicionamos o método `wantsJSON` à classe request. Ele lê o valor do cabeçalho `Accept` e retorna true se o primeiro valor negociar para JSON.

Você pode usar o método recém-adicionado da seguinte forma.

```ts
Route.get('/', ({ request }) => {
  if (request.wantsJSON()) {
    return {}
  }
})
```

### Informando o TypeScript sobre o método
A propriedade `wantsJSON` é adicionada no tempo de execução e, portanto, o TypeScript não sabe sobre ela. Para informar o TypeScript, usaremos [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) e adicionaremos a propriedade à interface `RequestContract`.

Crie um novo arquivo no caminho `contracts/request.ts` (o nome do arquivo não é essencial) e cole o seguinte conteúdo dentro dele.

```ts
// contracts/request.ts

declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    wantsJSON(): boolean
  }
}
```

## Leitura adicional

A seguir estão alguns dos guias adicionais para aprender mais sobre os tópicos não abordados neste documento.

- [Cookies](./cookies.md)
- [URLs assinadas](../security/signed-urls.md)
- [Uploads de arquivo](./file-uploads.md)
- [Validações](../validator/introduction.md)
