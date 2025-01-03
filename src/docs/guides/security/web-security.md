# Segurança da Web

Você pode proteger seus aplicativos da Web de ataques comuns como **CSRF**, **XSS**, **content sniffing** e mais usando o pacote `@adonisjs/shield`.

É recomendado usar este pacote ao criar um aplicativo renderizado pelo servidor usando AdonisJS.

Se você estiver usando AdonisJS para criar um servidor de API, então você deve confiar na camada de segurança do seu framework frontend.

::: code-group

```sh [Instale]
npm i @adonisjs/shield@7.1.1
```

```sh [Configure]
node ace configure @adonisjs/shield
```

```ts {5} [Registre o middleware]
// Adicione o seguinte ao start/kernel.ts

Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
  () => import('@ioc:Adonis/Addons/Shield')
])
```

:::

## Proteção CSRF
[CSRF (Cross-Site Request Forgery)](https://owasp.org/www-community/attacks/csrf) é um ataque que engana o usuário de seus aplicativos da Web para executar envios de formulários sem seu consentimento explícito.

Para se proteger contra ataques CSRF, seu aplicativo deve ser capaz de distinguir entre os envios de formulários acionados pelo seu aplicativo e algum outro site malicioso.

O AdonisJS gera um token exclusivo (conhecido como token CSRF) para cada solicitação HTTP e o associa à sessão do usuário para verificação posterior. Como o token é gerado no backend, o site malicioso não tem como obter acesso a ele.

O token deve estar presente junto com os outros campos do formulário para que a verificação CSRF seja aprovada. Você pode acessá-lo usando o `csrfField` dentro dos seus modelos Edge.

```edge {2}
<form action="{{ route('PostsController.store') }}" method="post">
  {{ csrfField() }}

  <div>
    <label for="title">Post title</label>
    <input type="text" name="title">
  </div>
  <hr>

  <button type="submit">Create Post</button>
</form>
```

Isso é tudo o que você precisa fazer.

### Configuração
O middleware shield depende da configuração armazenada dentro do arquivo `config/shield.ts`. Sinta-se à vontade para ajustar as opções de configuração conforme suas necessidades.

```ts
export const csrf: ShieldConfig['csrf'] = {
  enabled: true,
  exceptRoutes: [],
  enableXsrfCookie: true,
  methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  cookieOptions:  {
    domain: '',
    path: '/',
    maxAge: '2h',
    httpOnly: true,
    secure: false,
    sameSite: false,
  }
}
```

#### `enabled`
Habilite/desabilite a proteção CSRF completamente. Você pode acabar desabilitando-o durante os testes ao atingir os endpoints do formulário diretamente.

#### `exceptRoutes`
Ignore certas rotas de serem validadas para o token CSRF. Você pode achar isso útil ao criar um aplicativo híbrido com endpoints de API e os formulários renderizados pelo servidor isentando endpoints de API da validação do token CSRF.

```ts
{
  exceptRoutes: [
    '/api/users',
    '/api/users/:id',
    '/api/posts'
  ]
}
```

Para casos de uso mais avançados, você pode registrar uma função e filtrar dinamicamente as rotas de serem validadas.

```ts
{
  exceptRoutes: (ctx) => {
    // ignorar todas as rotas que começam com /api/
    return ctx.request.url().includes('/api/')
  }
}
```

#### `methods`
Métodos HTTP para validar a disponibilidade do token CSRF. Você deve adicionar todos os verbos HTTP que estiver usando para lidar com envios de formulário.

```ts
{
  methods: ['POST', 'PUT', 'PATCH', 'DELETE']
}
```

#### `enableXsrfCookie`
Definir o valor como `true` instrui o middleware shield a ler o token CSRF do cabeçalho `X-XSRF-TOKEN`. Leia a seção [Ajax form submissions](#ajax-form-submissions) para saber mais.

#### `cookieOptions`
Um objeto de opções de cookie. Leia a seção [Cookie](../http/cookies.md) para saber mais.

### Token CSRF para SPA
Os aplicativos de página única renderizam formulários no frontend e, portanto, não têm acesso à visualização global `csrfField`. No entanto, você pode ler o valor do token do cookie `XSRF-TOKEN` e enviá-lo ao servidor por meio do cabeçalho `X-XSRF-TOKEN`.

A técnica de cookie já é amplamente suportada por frameworks como [Angular](https://angular.io/api/common/http/HttpClientXsrfModule) e bibliotecas de solicitação como axios.

No entanto, certifique-se de habilitar o recurso de cookie definindo o valor de `enableXsrfCookie = true` dentro do arquivo `config/shield.ts`.

### Token CSRF para APIs RESTful
Se você estiver criando um servidor de API RESTful, não precisará de proteção CSRF, a menos que esteja contando com cookies para autenticação do usuário. Se estiver contando com cookies para autenticação, basta seguir as instruções da seção [token CSRF para SPA](#csrf-token-for-spa).

## CSP
[CSP (Content security policy)](https://content-security-policy.com) ajuda você a definir as fontes confiáveis ​​para carregar e executar **scripts**, **estilos**, **fontes**, etc. e reduzir o risco de ataques XSS.

Você pode configurar o cabeçalho CSP ajustando as opções de configuração dentro do arquivo `config/shield.ts`.

```ts
// config/shield.ts

export const csp: ShieldConfig['csp'] = {
  enabled: false,
  directives: {},
  reportOnly: false,
}
```

#### `enabled`
Habilitar/desabilitar a proteção CSP completamente.

#### `directives`
Configure as diretivas do cabeçalho CSP. Recomendamos ler sobre elas em [https://content-security-policy.com](https://content-security-policy.com/#directive). Os nomes das diretivas `dash-case` são definidos como `camelCase` dentro do arquivo de configuração do shield.

<!-- Sobre as aspas em torno de 'self': https://github.com/adonisjs/core/discussions/3233 -->
```ts
directives: {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', '@nonce'],
  fontSrc: ["'self'", 'https://fonts.googleapis.com'],
}
```

#### `reportOnly`
Defina o valor como true, se quiser que as violações de CSP resultem em um aviso em vez de um erro. [Saiba mais](https://content-security-policy.com/report-only/).

### CSP nonce
Para definir scripts e tags de estilo inline [baseados em nonce](https://content-security-policy.com/nonce/), você precisa usar a palavra-chave `@nonce`.

```ts
directives: {
  scriptSrc: ["'self'", '@nonce'],
}
```

Em seguida, use o auxiliar de visualização `cspNonce` para definir o atributo nonce nas tags de estilo e script inline.

```edge
<script nonce="{{ cspNonce }}">
</script>
```

Você também pode acessar o atributo `nonce` usando a propriedade `response.nonce`.

```ts
Route.get('/', ({ response }) => {
  return {
    nonce: response.nonce
  }
})
```

## DNS prefetching
Usando a configuração `dnsPrefetch` do arquivo `config/shield.ts`, você pode controlar o comportamento do cabeçalho [X-DNS-Prefetch-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control).

```ts
export const dnsPrefetch: ShieldConfig['dnsPrefetch'] = {
  enabled: true,
  allow: true,
}
```

#### `enabled`
Habilitar/desabilitar o cabeçalho completamente.

#### `allow`
Definir o valor como true definirá o cabeçalho `X-DNS-Prefetch-Control` com o valor `'on'`, caso contrário, o valor `'off'` será definido.

## Frame guard
A propriedade de configuração `xFrame` gerencia o cabeçalho [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options).

```ts
export const xFrame: ShieldConfig['xFrame'] = {
  enabled: true,
  action: 'DENY',
}
```

#### `enabled`
Habilita/desabilita o cabeçalho completamente.

#### `action`
Define o valor do cabeçalho. Ele deve ser um de `DENY`, `SAMEORIGIN` ou `ALLOW-FROM`. A ação `ALLOW-FROM` também precisa do nome de domínio para permitir.

```ts
{
  enabled: true,
  action: 'ALLOW-FROM',
  domain: 'foo.com'
}
```

## HSTS
Controle se o site deve ou não ser acessível via HTTP usando o cabeçalho [Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security).

A configuração para HSTS é armazenada dentro do arquivo `config/shield.ts`.

```ts
export const hsts: ShieldConfig['hsts'] = {
  enabled: true,
  maxAge: '180 days',
  includeSubDomains: true,
  preload: false,
}
```

#### `enabled`
Habilite/desabilite o `Strict-Transport-Security` todos juntos.

#### `maxAge`
Defina por quanto tempo o navegador deve lembrar o valor do cabeçalho.

#### `includeSubDomains`
Quando definido como `true`, a regra será aplicada aos subdomínios do site também.

#### `preload`
Se deve ou não pré-carregar o valor do cabeçalho do serviço de pré-carregamento HSTS. [Saiba mais](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security#preloading_strict_transport_security)

## Sem sniffing
Usando a configuração `contentTypeSniffing`, você pode controlar o comportamento do cabeçalho [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options).

O cabeçalho é definido somente quando a propriedade `enabled` é definida como true.

```ts
export const contentTypeSniffing: ShieldConfig['contentTypeSniffing'] = {
  enabled: true,
}
```
