# Requisição

A instância da classe de requisição permite que você acesse dados para a solicitação HTTP atual, incluindo o corpo da solicitação,
arquivos carregados, cookies e muito mais.

Você pode acessar o objeto `request` da instância de contexto HTTP passada para o manipulador de rota, middleware e manipulador de exceção.

```ts
Route.get('/', (ctx) => {
  console.log(ctx.request.url())
})
```

Com desestruturação

```
Route.get('/', async ({ request }) => {
  console.log(request.url())
})
```

### Solicitar dados
Você pode acessar os dados da solicitação usando um dos seguintes métodos.

```ts
Route.post('posts', async ({ request }) => {
  /**
   * Acesse todo o corpo da solicitação
   */
  console.log(request.body())

  /**
   * Acesse o objeto de string de consulta analisado
   */
  console.log(request.qs())

  /**
   * Uma cópia mesclada do corpo da solicitação e da string de consulta (URL)
   */
  console.log(request.all())

  /**
   * Escolha os campos de "request.all()"
   */
  console.log(request.only(['title', 'description']))

  /**
   * Omita campos de "request.all()"
   */
  console.log(request.except(['csrf_token', 'submit']))

  /**
   * Accesse valores de um único campo
   */
  console.log(request.input('title'))
  console.log(request.input('description'))
})
```

### String de consulta e parâmetros
A string de consulta analisada pode ser acessada usando o método `request.qs()`.

```ts
request.qs()
```

O método `request.params()` retorna os parâmetros da rota.

```ts
Route.get('/posts/:id/:slug', async ({ request }) => {
  /*
   * URL: /posts/1/hello-world
   * Params: { id: '1', slug: 'hello-world' }
   */
  console.log(request.params())
})
```

Você também pode acessar um único parâmetro usando o método `request.param`.

```ts
request.param('id')

// Valor padrão para parâmetros opcionais
request.param('id', 1)
```

### Corpo da Solicitação
O corpo da solicitação é analisado usando o middleware bodyparser pré-configurado. Abra o arquivo `start/kernel.ts` e certifique-se 
de que o middleware a seguir esteja registrado na lista do middleware global.

```ts
Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParserMiddleware')
])
```

Depois que o middleware bodyparser for registrado, você pode usar um dos seguintes métodos para acessar o corpo da solicitação.

```ts
request.body()

// Uma cópia mesclada da string de consulta com o corpo da solicitação
request.all()
```

O método `request.input` permite ler o valor de um único campo. Opcionalmente, você pode definir um valor padrão 
a ser retornado quando o valor real for `null` ou `undefined`.

```ts
request.input('title')

// Se o title for ausente
request.input('title', 'Hello world')
```

O método `request.only` e `request.except` permite selecionar ou ignorar campos específicos.

```ts
// Selecionar
const body = request.only(['title', 'description'])

// Omitir
const body = request.except(['submit', 'csrf_token'])
```

### Tipos de conteúdo com suporte
O bodyparser é capaz de analisar os seguintes tipos de conteúdo.

#### JSON
O analisador JSON processa a solicitação de envio da string JSON com um dos seguintes Content-Type.

* application/json
* application/json-patch+json
* application/vnd.api+json
* application/csp-report

Você pode adicionar mais tipos de conteúdo à matriz `json.types` dentro do arquivo `config/bodyparser.ts` e o analisador JSON também os processará.

#### URL encoded
A solicitação de envio de uma string codificada com o `content-type='application/x-www-form-urlencoded'` é analisada usando 
o analisador de codificação de URL.

#### Multipart
As solicitações multipartes com content-type='multipart/form-data'são analisadas usando o analisador multipartes. Certifique-se de ler o guia sobre uploads de arquivos para ver todas as opções de configuração disponíveis.

#### Raw
Todas as solicitações com `content-type='text/*'` são lidas usando o analisador bruto. Você pode processar ainda mais a string bruta dentro 
de um middleware ou do manipulador de rota.

Você pode usar o analisador bruto para processar tipos de conteúdo personalizados/sem suporte. Por exemplo

##### Registre o tipo de conteúdo personalizado

```ts
// config/bodyparser.ts

{
  raw: {
    // ...
    types: ['text/*', 'my-custom-content-type']
  }
}
```

##### Crie um middleware para analisar melhor o tipo de conteúdo

```ts
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

### Solicitar rota
A classe `request` contém a rota correspondente para a solicitação HTTP e você pode acessá-la da seguinte maneira:

```ts
Route.get('/', ({ request }) => {
  /**
   * O padrão de rota
   */
  console.log(request.route.pattern)

  /**
   * O manipulador que lida com a solicitação de rota
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

Você também pode verificar se o URL da solicitação atual corresponde a uma determinada rota ou não.

```ts
if (request.matchesRoute('/posts/:id')) {
}
```

Ou passe uma matriz para verificar mais de uma rota. O método retorna verdadeiro se alguma das rotas corresponder ao URL da solicitação atual.

```ts
if (request.matchesRoute(['/posts/:id', '/posts/:id/comments'])) {
}
```

### Solicitar URL
Você pode acessar o URL da solicitação usando o método `request.url()`. Ele retorna o nome do caminho sem o nome de domínio ou a porta.

```ts
request.url()

// Incluir a query string
request.url(true)
```

O método `request.completeUrl()` retorna a URL completa, incluindo o domínio e a porta (se houver).

```ts
request.completeUrl()

// Incluir query string
request.completeUrl(true)
```

### Métodos de Requisição

#### method
Retorna o método HTTP para a solicitação fornecida. O método falsificado é retornado quando a falsificação do método do 
formulário está habilitada.

```ts
request.method()
```

#### intended
O método `intended` retorna o método HTTP real e não o falsificado.

```ts
request.intended()
```

### Identificação do Pedido
Os ids de solicitação ajudam a depurar e rastrear logs para uma determinada solicitação HTTP, associando um 
id único a cada entrada de log.

O AdonisJS segue o padrão da indústria e tem suporte de primeira classe para trabalhar com o cabeçalho `X-Request-Id`.

#### Gerando IDs de solicitação
Abra o arquivo `config/app.ts` e defina o valor de `http.generateRequestId` como verdadeiro.

Além disso, o id de solicitação é gerado apenas quando o cabeçalho `X-Request-Id` não está definido. 
Isso permite gerar os ids de solicitação no nível do servidor proxy e, em seguida, referenciá-los 
dentro do aplicativo AdonisJS.

```ts
// config/app.ts

{
  http: {
    generateRequestId: true
  }
}
```

#### ID de pedido de acesso
O método `request.id()` retorna o id de solicitação lendo o cabeçalho `X-Request-Id`. O fluxo é o seguinte:

* Leia o valor do cabeçalho `X-Request-Id`. Retorna o valor se estiver presente.
* Gere e defina o cabeçalho manualmente se o sinalizador `generateRequestId` estiver habilitado na configuração.
* Retorne `null` quando o cabeçalho estiver faltando e `generateRequestId` estiver desabilitado.

```ts
request.id()
```

#### Solicitar id dentro dos logs
A instância do logger anexada ao contexto HTTP define automaticamente a propriedade `request_id` em cada instrução de log.

```ts
Route.get('/', ({ logger }) => {
  // { msg: 'hello world', request_id: 'ckk9oliws0000qt3x9vr5dkx7' }
  logger.info('hello world')
})
```

### Solicitar cabeçalhos
Os métodos `request.headers()` e `request.header()` lhe dá acesso aos cabeçalhos de solicitação.

```ts
// Todos os cabeçalhos
console.log(request.headers())
```

O método `header` retorna o valor para um único campo de cabeçalho. O nome do cabeçalho não diferencia maiúsculas de minúsculas .

```ts
request.header('X-CUSTOM-KEY') === request.header('x-custom-key')

// Com valores padrão
request.header('x-header-name', 'default value')
```

### Solicitar endereço IP
O método `request.ip()` retorna o endereço IP mais confiável para a solicitação HTTP. Certifique-se de ler a seção de 
proxy confiável para entender como você pode obter o endereço IP correto quando seu aplicativo está atrás de um servidor proxy.

```ts
request.ip()
```
O método `request.ips()` retorna uma matriz de endereços IP, começando do endereço IP mais confiável para o menos confiável.

```ts
request.ips()
```

#### Método de recuperação de IP personalizado
Se as configurações de proxy confiável não forem suficientes para determinar o endereço IP correto, você pode implementar seu 
próprio método `getIp` personalizado.

Abra o arquivo `config/app.ts` e defina o método `getIp` da seguinte maneira:

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

### Falsificação de método no formulário
Os formulários HTML padrão não podem usar todos os verbos HTTP além de `GET` e `POST`. Isso significa que você não pode
criar um formulário com o método `PUT`.

No entanto, o AdonisJS permite falsificar o método HTTP usando query string pelo método `_method`. No exemplo a seguir, a 
solicitação será roteada para a rota que está escutando a solicitação `PUT`.

```html
<form method="POST" action="/posts/1?_method=PUT"></form>
```

A falsificação de método de formulário só funciona:

* Quando o valor de `http.allowMethodSpoofing` é definido como verdadeiro dentro do arquivo `config/app.ts`.
* E o método de solicitação original é POST.


### Negociação de conteúdo
A negociação de conteúdo é um mecanismo usado para servir diferentes representações de um recurso do mesmo URL.

O cliente que faz a solicitação pode negociar a representação do recurso, conjunto de caracteres, linguagem e codificação
usando diferentes cabeçalhos `Accept` e você pode tratá-los da seguinte maneira.

#### accepts
O método `request.accepts` pega uma matriz de tipos de conteúdo (incluindo atalhos) e retorna o tipo de conteúdo mais apropriado
inspecionando o cabeçalho `Accept`. Você pode encontrar a lista de tipos de conteúdo com suporte [aqui](https://github.com/jshttp/mime-db/blob/master/db.json).

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

#### types
O método `request.types` retorna uma matriz de tipos de conteúdo inspecionando o cabeçalho `Accept`. A matriz é ordenada de 
acordo com a preferência do cliente (o mais preferido primeiro).

```ts
const types = request.types()
```

#### language
Negocie o idioma solicitado com base no cabeçalho `Accept-language`.

```ts
const language = request.language(['fr', 'de'])

if (language) {
  return view.render(`posts/${language}/index`)
}

return view.render('posts/en/index')
```

#### languages
O método `languages` retorna uma matriz de linguagens aceitas inspecionando o cabeçalho `Accept-language`. A matriz é ordenada de 
acordo com a preferência do cliente (o mais preferido primeiro).

```ts
const languages = request.languages()
```

#### encoding
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

#### encodings
O método `encodings` retorna uma matriz de codificação aceita inspecionando o cabeçalho `Accept-encoding`. A matriz é ordenada de 
acordo com a preferência do cliente (o mais preferido primeiro).

```ts
const encodings = request.encodings()
```

#### charset
Encontre o melhor conjunto de caracteres usando o cabeçalho `Accept-charset`.

```ts
const charset = request.charset(['utf-8', 'hex', 'ascii'])
return Buffer.from('hello-world').toString(charset || 'utf-8')
```

#### charset
O método `charset` retorna uma matriz de conjuntos de caracteres aceitos inspecionando o cabeçalho `Accept-charset`. A matriz 
é ordenada de acordo com a preferência do cliente (o mais preferido primeiro).

```ts
const charsets = request.charsets()
```

### Proxy confiável
A maioria dos aplicativos Node.js são implantados por trás de um servidor proxy como Nginx ou Caddy. Portanto, o valor de 
`remoteAddress` é o endereço IP do servidor proxy e não do cliente.

No entanto, todos os servidores proxy configuram os cabeçalhos `X-Forwaded` para refletir os valores originais da solicitação e 
você deve informar ao AdonisJS para confiar nos cabeçalhos do servidor proxy.

Você pode controlar em quais proxies confiar, modificando o valor `http.trustProxy` dentro de `config/app.ts`.

```ts
// config/app.ts

{
  http: {
    trustProxy: proxyAddr.compile(valueComesHere)
  }
}
```

#### Valores booleanos
Definir o valor como `true` confiará na entrada mais à esquerda no cabeçalho `X-Forwarded-*`. Enquanto o `false` assume que o aplicativo 
está diretamente voltado para a Internet e o valor para `request.connection.remoteAddress` é usado.

```ts
{
  trustProxy: proxyAddr.compile(true)
}
```

#### Endereços IP
Você também pode definir um único ou uma matriz de endereços IP de servidor proxy para confiar.

```ts
{
  trustProxy: proxyAddr.compile('127.0.0.0/8')
}

// ou
{
  trustProxy: proxyAddr.compile(['127.0.0.0/8', 'fc00:ac:1ab5:fff::1/64'])
}
```

As seguintes palavras-chave abreviadas também podem ser usadas no lugar de endereços IP.

* `loopback`: Endereços de loopback Pv4 e IPv6 (como `::1` e `127.0.0.1`).
* `linklocal`: Endereços locais de link IPv4 e IPv6 (como `fe80::1:1:1:1` e `169.254.0.1`).
* `uniquelocal`: Endereços privados IPv4 e endereços locais exclusivos IPv6 (como `fc00:ac:1ab5:fff::1` e `192.168.0.1`).

#### Função personalizada
Você também pode definir uma função personalizada que retorna um booleano por solicitação.

```ts
{
  trustProxy: proxyAddr.compile((address, index) => {
    return address === '127.0.0.1' || address === '123.123.123.123'
  })
}
```

#### Cabeçalhos de proxy em uso
Os métodos a seguir da classe de solicitação contam com um proxy confiável para retornar o valor correto.

* `hostname`: o valor de `request.hostname()` é derivado do cabeçalho `X-Forwarded-Host`.
* `protocol`: o valor de `request.protocol()` é derivado do cabeçalho `X-Forwarded-Proto`.
* `ip/ips`: o valor de `request.ips()` e `request.ip()` é derivado do cabeçalho `X-Forwaded-For`. No entanto, 
  o método `http.getIp` de configuração tem precedência quando definido. [Saiba mais](https://docs.adonisjs.com/guides/request#custom-ip-reterval-method)

### CORS
O AdonisJS possui suporte integrado para responder às solicitações CORS `OPTIONS`. Basta habilitá-lo dentro do arquivo `config/cors.ts`.

```ts
// config/cors.ts
{
  enabled: true,
  // ...rest of the config
}
```

O arquivo de configuração é amplamente documentado. Certifique-se de passar por todas as opções e ler os comentários associados para entender seu uso.

### Outros métodos e propriedades
A seguir está a lista de outros métodos e propriedades disponíveis na classe Request.

#### hostname
Retorna o nome do host da solicitação. Se os [cabeçalhos de proxy](https://docs.adonisjs.com/guides/request#trusted-proxy) 
forem confiáveis, `X-Forwarded-Host` terá prioridade sobre o cabeçalho 
`Host`.

```ts
request.hostname()
```

#### Ajax
Descubra se o cabeçalho da solicitação `X-Requested-With` está definido como `'xmlhttprequest'`.

```ts
if (request.ajax()) {
  // returna uma resposta para requisição AJAX
}
```

#### matchesRoute
Descubra se a solicitação atual é para uma determinada rota. O método aceita o identificador de rota como o único argumento. 
O identificador pode ser o padrão da rota, o nome do 'controlador.método' ou o nome da rota.

```ts
if (request.matchesRoute('posts.show')) {
}
```

Você também pode comparar com as várias rotas. O método retorna `true` se o URL de retorno corresponder a qualquer um 
dos identificadores definidos.

```ts
if (request.matchesRoute(['posts.show', 'posts.edit'])) {
}
```

#### is
Retorna o melhor tipo de conteúdo correspondente da solicitação, correspondendo aos tipos fornecidos.

O tipo de conteúdo é escolhido no cabeçalho `Content-Type` e a solicitação deve ter corpo.

```ts
const contentType = request.is(['json', 'xml'])

if (contentType === 'json') {
  // Processa o corpo para JSON
}

if (contentType === 'xml') {
  // Processa o corpo para XML
}
```

#### updateBody
Permite que você atualize o corpo da solicitação com uma carga útil personalizada. Seria melhor se você não estivesse fazendo 
isso, a menos que criasse um pacote que alterasse propositalmente o corpo da solicitação.

```ts
request.updateBody(myCustomPayload)
```

#### updateRawBody
O `updateRawBody` permite atualizar o corpo da solicitação bruta. O corpo bruto é sempre uma string.

```ts
request.updateRawBody(JSON.stringify(myCustomPayload))
```

#### updateQs
O `updateQs` permite atualizar o valor da string de consulta analisada.

```ts
request.updateQs(someCustomParser(request.parsedUrl.query))
```

#### original
Retorna o corpo original da solicitação analisado pelo bodyparser. Chamar o método `updateBody` não altera a carga original.

```ts
request.original()
```

#### hasBody
Descubra se a solicitação possui um corpo. O bodyparser usa esse método para saber se a solicitação tem um corpo antes de analisá-lo.

```ts
if (request.hasBody()) {
  // Parser para o corpo da requisição
}
```

#### Estendendo classe de solicitação
Você pode estender a classe Request usando macros ou getters. O melhor lugar para estender a solicitação é 
dentro de um provedor de serviços personalizado.

Abra o arquivo `providers/AppProvider.ts` pré-existente e escreva o código a seguir dentro do método `boot`.

```ts
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

No exemplo acima, adicionamos o método `wantsJSON` à classe de solicitação. Ele lê o valor `Accept` do cabeçalho e retorna verdadeiro 
se o primeiro valor negociar para JSON.

Você pode usar o método recém-adicionado da seguinte maneira.

```ts
Route.get('/', ({ request }) => {
  if (request.wantsJSON()) {
    return {}
  }
})
```

#### Informar ao typescript sobre o método
A propriedade `wantsJSON` é adicionada no tempo de execução e, portanto, o TypeScript não a conhece. Para informar ao TypeScript, 
usaremos a fusão de declarações e adicionaremos à interface `RequestContract`.

Crie um novo arquivo no caminho `contracts/request.ts` (o nome do arquivo não é importante) e cole o seguinte conteúdo dentro dele.

```ts
// contracts/request.ts
Copiar para área de transferência
declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    wantsJSON(): boolean
  }
}
```
