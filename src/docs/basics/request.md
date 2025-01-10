---
Resumo: A classe Request contém dados para a solicitação HTTP em andamento, incluindo o corpo da solicitação, referência a arquivos enviados, cookies, cabeçalhos de solicitação e muito mais.
---

# Request

Uma instância da [classe request](https://github.com/adonisjs/http-server/blob/main/src/request.ts) contém dados para a solicitação HTTP em andamento, incluindo o **corpo da solicitação**, **referência a arquivos enviados**, **cookies**, **cabeçalhos de solicitação** e muito mais. A instância da solicitação pode ser acessada usando a propriedade `ctx.request`.

## String de consulta e parâmetros de rota

O método `request.qs` retorna a string de consulta analisada como um objeto.

```ts
import router from '@adonisjs/core/services/router'

router.get('posts', async ({ request }) => {
  /*
   * URL: /?sort_by=id&direction=desc
   * qs: { sort_by: 'id', direction: 'desc' }
   */
  request.qs()
})
```

O método `request.params` retorna um objeto de [Route params](./routing.md#route-params).

```ts
import router from '@adonisjs/core/services/router'

router.get('posts/:slug/comments/:id', async ({ request }) => {
  /*
   * URL: /posts/hello-world/comments/2
   * params: { slug: 'hello-world', id: '2' }
   */
  request.params()
})
```

Você pode acessar um único parâmetro usando o método `request.param`.

```ts
import router from '@adonisjs/core/services/router'

router.get('posts/:slug/comments/:id', async ({ request }) => {
  const slug = request.param('slug')
  const commentId = request.param('id')
})
```

## Corpo da solicitação

O AdonisJS analisa o corpo da solicitação usando o [middleware body-parser](../basics/body_parser.md) registrado dentro do arquivo `start/kernel.ts`.

Você pode acessar o corpo da solicitação usando o método `request.body()`. Ele retorna o corpo da solicitação analisado como um objeto.

```ts
import router from '@adonisjs/core/services/router'

router.post('/', async ({ request }) => {
  console.log(request.body())
})
```

O método `request.all` retorna uma cópia mesclada do corpo da solicitação e da string de consulta.

```ts
import router from '@adonisjs/core/services/router'

router.post('/', async ({ request }) => {
  console.log(request.all())
})
```

### Seleção seletiva de valores

Os métodos `request.input`, `request.only` e `request.except` podem selecionar seletivamente propriedades específicas dos dados da solicitação. Todos os métodos de seleção seletiva procuram valores dentro do corpo da solicitação e da sequência de consulta.

O método `request.only` retorna um objeto com apenas as propriedades mencionadas.

```ts
import router from '@adonisjs/core/services/router'

router.post('login', async ({ request }) => {
  const credentials = request.only(['email', 'password'])

  console.log(credentials)
})
```

O método `request.except` retorna um objeto excluindo as propriedades mencionadas.

```ts
import router from '@adonisjs/core/services/router'

router.post('register', async ({ request }) => {
  const userDetails = request.except(['password_confirmation'])

  console.log(userDetails)
})
```

O método `request.input` retorna o valor de uma propriedade específica. Opcionalmente, você pode passar um valor padrão como o segundo argumento. O valor padrão é retornado quando o valor real está ausente.

```ts
import router from '@adonisjs/core/services/router'

router.post('comments', async ({ request }) => {
  const email = request.input('email')
  const commentBody = request.input('body')
})
```

### Corpo de solicitação de tipo seguro

Por padrão, o AdonisJS não impõe tipos de dados para os métodos `request.all`, `request.body` ou cherry-picking, pois ele não pode saber o conteúdo esperado do corpo da solicitação com antecedência.

Para garantir a segurança do tipo, você pode usar o [validator](./validation.md) para validar e analisar o corpo da solicitação, garantindo que todos os valores estejam corretos e correspondam aos tipos esperados.

## URL da solicitação

O método `request.url` retorna a URL da solicitação relativa ao nome do host. Por padrão, o valor de retorno não inclui a string de consulta. No entanto, você pode obter a URL com a string de consulta chamando `request.url(true)`.

```ts
import router from '@adonisjs/core/services/router'

router.get('/users', async ({ request }) => {
  /*
   * URL: /users?page=1&limit=20
   * url: /users
   */
  request.url()

  /*
   * URL: /users?page=1&limit=20
   * url: /users?page=1&limit=20
   */
  request.url(true) // returns query string
})
```

O método `request.completeUrl` retorna a URL completa, incluindo o nome do host. Novamente, a menos que explicitamente informado, o valor de retorno não inclui a string de consulta.

```ts
import router from '@adonisjs/core/services/router'

router.get('/users', async ({ request }) => {
  request.completeUrl()
  request.completeUrl(true) // returns query string
})
```

## Cabeçalhos de solicitação

O método `request.headers` retorna os cabeçalhos de solicitação como um objeto.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ request }) => {
  console.log(request.headers())
})
```

Você pode acessar o valor de um cabeçalho individual usando o método `request.header`.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ request }) => {
  request.header('x-request-id')

  // Header name is not case sensitive
  request.header('X-REQUEST-ID')
})
```

## Método de solicitação

O método `request.method` retorna o método HTTP para a solicitação atual. Este método retorna o método falsificado quando [form method spoofing](#form-method-spoofing) está habilitado, e você pode usar o método `request.intended` para obter o método de solicitação original.

```ts
import router from '@adonisjs/core/services/router'

router.patch('posts', async ({ request }) => {
  /**
   * The method that was used for route matching
   */
  console.log(request.method())

  /**
   * The actual request method
   */
  console.log(request.intended())
})
```

## Endereço IP do usuário

O método `request.ip` retorna o endereço IP do usuário para a solicitação HTTP atual. Este método depende do cabeçalho [`X-Forwarded-For`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) definido por servidores proxy como Nginx ou Caddy.

:::note
Leia a seção [trusted proxies](#configuring-trusted-proxies) para configurar os proxies em que seu aplicativo deve confiar.
:::

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ request }) => {
  console.log(request.ip())
})
```

O método `request.ips` retorna uma matriz de todos os endereços IP definidos por proxies intermediários. A matriz é classificada do endereço IP mais confiável para o menos confiável.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ request }) => {
  console.log(request.ips())
})
```

### Definindo um método `getIp` personalizado

Se as configurações de proxy confiável forem insuficientes para determinar o endereço IP correto, você pode implementar seu método `getIp` personalizado.

O método é definido dentro do arquivo `config/app.ts` sob o objeto de configurações `http`.

```ts
export const http = defineConfig({
  getIp(request) {
    const ip = request.header('X-Real-Ip')
    if (ip) {
      return ip
    }

    return request.ips()[0]
  }
})
```

## Negociação de conteúdo

O AdonisJS fornece vários métodos para [negociação de conteúdo](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation#server-driven_content_negotiation) analisando todos os cabeçalhos `Accept` comumente suportados. Por exemplo, você pode usar o método `request.types` para obter uma lista de todos os tipos de conteúdo aceitos por uma determinada solicitação.

O valor de retorno do método `request.types` é ordenado pela preferência do cliente (mais preferido primeiro).

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ request }) => {
  console.log(request.types())
})
```

A seguir está a lista completa de métodos de negociação de conteúdo.

| Método    | Cabeçalho HTTP em uso                                                                        |
|-----------|----------------------------------------------------------------------------------------------|
| types     | [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)                   |
| languages | [Accept-language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) |
| encodings | [Accept-encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) |
| charsets  | [Accept-charset](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Charset)   |

Às vezes, você quer encontrar o tipo de conteúdo preferido com base no que o servidor pode suportar.

Para o mesmo, você pode usar o método `request.accepts`. O método pega uma matriz de tipos de conteúdo suportados e retorna o mais preferido após inspecionar o cabeçalho `Accept`. Um valor `null` é retornado quando não é possível encontrar uma correspondência.

```ts
import router from '@adonisjs/core/services/router'

router.get('posts', async ({ request, view }) => {
  const posts = [
    {
      title: 'Adonis 101',
    },
  ]

  const bestMatch = request.accepts(['html', 'json'])

  switch (bestMatch) {
    case 'html':
      return view.render('posts/index', { posts })
    case 'json':
      return posts
    default:
      return view.render('posts/index', { posts })
  }
})
```

Semelhante ao `request.accept`, os métodos a seguir podem ser usados ​​para encontrar o valor preferido para outros cabeçalhos `Accept`.

```ts
// Preferred language
const language = request.language(['fr', 'de'])

// Preferred encoding
const encoding = request.encoding(['gzip', 'br'])

// Preferred charset
const charset = request.charset(['utf-8', 'hex', 'ascii'])
```

## Gerando IDs de solicitação

IDs de solicitação ajudam você a [depurar e rastrear problemas de aplicativo](https://blog.heroku.com/http_request_id_s_improve_visibility_across_the_application_stack) de logs atribuindo um ID exclusivo a cada solicitação HTTP. Por padrão, a criação de ID de solicitação é desabilitada. No entanto, você pode habilitá-lo dentro do arquivo `config/app.ts`.

:::note
Os IDs de solicitação são gerados usando o pacote [cuid2](https://github.com/paralleldrive/cuid2). Antes de gerar um ID, verificamos o cabeçalho de solicitação `X-Request-Id` e usamos seu valor (se existir).
:::

```ts
// title: config/app.ts
export const http = defineConfig({
  generateRequestId: true
})
```

Depois de habilitado, você pode acessar o ID usando o método `request.id`.

```ts
router.get('/', ({ request }) => {
  // ckk9oliws0000qt3x9vr5dkx7
  console.log(request.id())
})
```

O mesmo ID de solicitação também é adicionado a todos os logs gerados usando a instância `ctx.logger`.

```ts
router.get('/', ({ logger }) => {
  // { msg: 'hello world', request_id: 'ckk9oliws0000qt3x9vr5dkx7' }
  logger.info('hello world')
})
```

## Configurando proxies confiáveis

A maioria dos aplicativos Node.js são implantados atrás de um servidor proxy como Nginx ou Caddy. Portanto, temos que confiar em cabeçalhos HTTP como `X-Forwarded-Host`, `X-Forwarded-For` e `X-Forwarded-Proto` para saber sobre o cliente final real que faz uma solicitação HTTP.

Esses cabeçalhos são usados ​​somente quando seu aplicativo AdonisJS pode confiar no endereço IP de origem.

Você pode configurar em quais endereços IP confiar dentro do arquivo `config/app.ts` usando a opção de configuração `http.trustProxy`.

```ts
import proxyAddr from 'proxy-addr'

export const http = defineConfig({
  trustProxy: proxyAddr.compile(['127.0.0.1/8', '::1/128'])
})
```

O valor para `trustProxy` também pode ser uma função. O método deve retornar `true` se o endereço IP for confiável; caso contrário, retornar `false`.

```ts
export const http = defineConfig({
  trustProxy: (address) => {
    return address === '127.0.0.1' || address === '123.123.123.123'
  }
})
```

Se você estiver executando o Nginx no mesmo servidor que o código do seu aplicativo, precisará confiar nos endereços IP de loopback, ou seja, (127.0.0.1).

```ts
import proxyAddr from 'proxy-addr'

export const http = defineConfig({
  trustProxy: proxyAddr.compile('loopback')
})
```

Suponha que seu aplicativo só seja acessível por meio de um balanceador de carga e você não tenha uma lista de endereços IP para esse balanceador de carga. Então, você pode confiar no servidor proxy definindo um retorno de chamada que sempre retorna `true`.

```ts
export const http = defineConfig({
  trustProxy: () => true
})
```

## Configurando o analisador de string de consulta

As strings de consulta da URL da solicitação são analisadas usando o módulo [qs](http://npmjs.com/qs). Você pode configurar as configurações do analisador dentro do arquivo `config/app.ts`.

[Veja a lista](https://github.com/adonisjs/http-server/blob/main/src/types/qs.ts#L11) de todas as opções disponíveis.

```ts
export const http = defineConfig({
  qs: {
    parse: {
    },
  }
})
```

## Falsificação de método de formulário

O método de formulário em um formulário HTML só pode ser definido como `GET` ou `POST`, tornando impossível aproveitar [métodos HTTP restful](https://restfulapi.net/http-methods/).

No entanto, o AdonisJS permite que você contorne essa limitação usando **falsificação de método de formulário**. Falsificação de método de formulário é um termo sofisticado para especificar o método de formulário por meio da string de consulta `_method`.

Para que a falsificação de método funcione, você deve definir a ação do formulário como `POST` e habilitar o recurso dentro do arquivo `config/app.ts`.

```ts
// title: config/app.ts
export const http = defineConfig({
  allowMethodSpoofing: true,
})
```

Depois de habilitado, você pode falsificar o método de formulário da seguinte maneira.

```html
<form method="POST" action="/articles/1?_method=PUT">
  <!-- Update form -->
</form>
```

```html
<form method="POST" action="/articles/1?_method=DELETE">
  <!-- Delete form -->
</form>
```

## Estendendo a classe Request

Você pode adicionar propriedades personalizadas à classe Request usando macros ou getters. Certifique-se de ler o [guia de extensão do AdonisJS](../concepts/extending_the_framework.md) primeiro se você for novo no conceito de macros.

```ts
import { Request } from '@adonisjs/core/http'

Request.macro('property', function (this: Request) {
  return value
})
Request.getter('property', function (this: Request) {
  return value
})
```

Como as macros e getters são adicionados em tempo de execução, você deve informar o TypeScript sobre seus tipos.

```ts
declare module '@adonisjs/core/http' {
  export interface Request {
    property: valueType
  }
}
```
