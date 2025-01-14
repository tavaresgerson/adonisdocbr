---
summary: Aprenda a proteger seus aplicativos renderizados pelo servidor usando o pacote @adonisjs/shield.
---

# Protegendo aplicativos renderizados pelo servidor

Se você estiver criando um aplicativo renderizado pelo servidor usando o AdonisJS, então você deve usar o pacote `@adonisjs/shield` para proteger seus aplicativos de ataques comuns da web como **CSRF**, **XSS**, **Content sniffing**, e assim por diante.

O pacote vem pré-configurado com o **web starter kit**. No entanto, você pode instalar e configurar manualmente o pacote da seguinte forma.

::: info NOTA
O pacote `@adonisjs/shield` tem uma dependência de peer no pacote `@adonisjs/session`, então certifique-se de [configurar o pacote de sessão](../basics/session.md) primeiro.
:::

```sh
node ace add @adonisjs/shield
```

::: details Veja os passos realizados pelo comando add

1. Instala o pacote `@adonisjs/shield` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

   ```ts
   {
     providers: [
       // ...outros provedores
       () => import('@adonisjs/shield/shield_provider'),
     ]
   }
   ```

3. Cria o arquivo `config/shield.ts`.

4. Registra o seguinte middleware dentro do arquivo `start/kernel.ts`.

    ```ts
    router.use([() => import('@adonisjs/shield/shield_middleware')])
    ```

:::

## Proteção CSRF

[CSRF (Cross-Site Request Forgery)](https://owasp.org/www-community/attacks/csrf) é um ataque no qual um site malicioso engana os usuários do seu aplicativo da web para executar envios de formulários sem seu consentimento explícito.

Para se proteger contra ataques CSRF, você deve definir um campo de entrada oculto contendo o valor do token CSRF que somente seu site pode gerar e verificar. Portanto, os envios de formulários acionados pelo site malicioso falharão.

### Protegendo formulários

Depois de configurar o pacote `@adonisjs/shield`, todos os envios de formulários sem um token CSRF falharão automaticamente. Portanto, você deve usar o auxiliar de borda `csrfField` para definir um campo de entrada oculto com o token CSRF.

::: info **Edge helper**
```edge {2}
<form method="POST" action="/">
  {{ csrfField() }}
  <input type="name" name="name" placeholder="Enter your name">
  <button type="submit"> Submit </button>
</form>
```
:::


::: info **Saída HTML**
```html {2}
<form method="POST" action="/">
    <input type="hidden" name="_csrf" value="Q9ghWSf0-3FD9eCiu5YxvKaxLEZ6F_K4DL8o"/>
    <input type="name" name="name" placeholder="Enter your name"/>
    <button type="submit">Submit</button>
</form>
```
:::

Durante o envio do formulário, o `shield_middleware` verificará automaticamente o token `_csrf`, permitindo apenas os envios do formulário com um token CSRF válido.

### Lidando com exceções

O Shield gera uma exceção `E_BAD_CSRF_TOKEN` quando o token CSRF está ausente ou é inválido. Por padrão, o AdonisJS capturará a exceção e redirecionará o usuário de volta ao formulário com uma mensagem de erro flash.

Você pode acessar a mensagem flash da seguinte forma dentro de um modelo edge.

```edge {1-3}
@error('E_BAD_CSRF_TOKEN')
  <p> {{ $message }} </p>
@end

<form method="POST" action="/">
  {{ csrfField() }}
  <input type="name" name="name" placeholder="Enter your name">
  <button type="submit"> Submit </button>
</form>
```

Você também pode automanipular a exceção `E_BAD_CSRF_TOKEN` dentro do [manipulador de exceção global](../basics/exception_handling.md#handling-exceptions) da seguinte forma.

```ts {7-11}
import app from '@adonisjs/core/services/app'
import { errors } from '@adonisjs/shield'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof errors.E_BAD_CSRF_TOKEN) {
      return ctx.response
        .status(error.status)
        .send('Page has expired')
    }

    return super.handle(error, ctx)
  }
}
```

### Referência de configuração

A configuração para a proteção CSRF é armazenada dentro do arquivo `config/shield.ts`.

```ts
import { defineConfig } from '@adonisjs/shield'

const shieldConfig = defineConfig({
  csrf: {
    enabled: true,
    exceptRoutes: [],
    enableXsrfCookie: true,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },
})

export default shieldConfig
```

### `enabled`

Ative ou desative a proteção CSRF.

### `exceptRoutes`

Uma matriz de padrões de rota para isentar da proteção CSRF. Se seu aplicativo tiver rotas que aceitam envios de formulário por meio de uma API, você pode isentá-las.

Para casos de uso mais avançados, você pode registrar uma função para isentar rotas específicas dinamicamente.

```ts
{
  exceptRoutes: (ctx) => {
    // isentar todas as rotas que começam com /api/
    return ctx.request.url().includes('/api/')
  }
}
```

### `enableXsrfCookie`

Quando habilitado, o Shield armazenará o token CSRF dentro de um cookie criptografado chamado `XSRF-TOKEN`, que pode ser lido pelo código JavaScript do frontend.

Isso permite que bibliotecas de solicitação de frontend como o Axios leiam o `XSRF-TOKEN` automaticamente e o definam como um cabeçalho `X-XSRF-TOKEN` ao fazer solicitações Ajax sem formulários renderizados pelo servidor.

Você deve manter o `enableXsrfCookie` desabilitado se não estiver acionando solicitações Ajax programaticamente.

### `methods`

Uma matriz de métodos HTTP para proteger. Todas as solicitações recebidas para os métodos mencionados devem apresentar um token CSRF válido.

### `cookieOptions`

Configuração para o cookie `XSRF-TOKEN`. [Consulte a configuração de cookies](../basics/cookies.md#configuration) para opções disponíveis.

## Definindo a política CSP
[CSP (Content security policy)](https://web.dev/csp/) protege seus aplicativos de ataques XSS definindo fontes confiáveis ​​para carregar JavaScript, CSS, fontes, imagens e assim por diante.

A proteção CSP é desabilitada por padrão. No entanto, recomendamos que você a habilite e configure as diretivas de política dentro do arquivo `config/shield.ts`.

```ts
import { defineConfig } from '@adonisjs/shield'

const shieldConfig = defineConfig({
  csp: {
    enabled: true,
    directives: {
      // as diretivas de política vão aqui
    },
    reportOnly: false,
  },
})

export default shieldConfig
```

### `enabled`

Ative ou desative a proteção CSP.

### `directives`

Configure as diretivas CSP. Você pode visualizar a lista de diretivas disponíveis em [https://content-security-policy.com/](https://content-security-policy.com/#directive)

```ts {4-8}
const shieldConfig = defineConfig({
  csp: {
    enabled: true,
    directives: {
      defaultSrc: [`'self'`],
      scriptSrc: [`'self'`, 'https://cdnjs.cloudflare.com'],
      fontSrc: [`'self'`, 'https://fonts.googleapis.com']
    },
    reportOnly: false,
  },
})

export default shieldConfig
```

### `reportOnly`

A política CSP não bloqueará os recursos quando o sinalizador `reportOnly` estiver habilitado. Em vez disso, ele relatará as violações em um endpoint configurado usando a diretiva `reportUri`.

```ts {6,8}
const shieldConfig = defineConfig({
  csp: {
    enabled: true,
    directives: {
      defaultSrc: [`'self'`],
      reportUri: ['/csp-report']
    },
    reportOnly: true,
  },
})
```

Além disso, registre o endpoint `csp-report` para coletar os relatórios de violação.

```ts
router.post('/csp-report', async ({ request }) => {
  const report = request.input('csp-report')
})
```

### Usando Nonce
Você pode permitir tags `script` e `style` inline definindo o [atributo nonce](https://content-security-policy.com/nonce/) nelas. O valor do atributo nonce pode ser acessado dentro dos modelos Edge usando a propriedade `cspNonce`.

```edge
<script nonce="{{ cspNonce }}">
  // JavaScript inline 
</script>
<style nonce="{{ cspNonce }}">
  /* CSS inline  */
</style>
```

Além disso, use a palavra-chave `@nonce` dentro da configuração de diretivas para permitir scripts e estilos inline baseados em nonce.

```ts
const shieldConfig = defineConfig({
  csp: {
    directives: {
      defaultSrc: [`'self'`, '@nonce'],
    },
  },
})
```

### Carregando ativos do servidor Vite Dev
Se você estiver usando a [integração Vite](../basics/vite.md), você pode usar as seguintes palavras-chave CSP para permitir ativos servidos pelo servidor Vite Dev.

- O `@viteDevUrl` adiciona a URL do servidor Vite dev à lista permitida.
- O `@viteHmrUrl` adiciona a URL do servidor websocket Vite HMR à lista permitida.

```ts
const shieldConfig = defineConfig({
  csp: {
    directives: {
      defaultSrc: [`'self'`, '@viteDevUrl'],
      connectSrc: ['@viteHmrUrl']
    },
  },
})
```

Se você estiver implantando a saída empacotada Vite em um servidor CDN, você deve substituir `@viteDevUrl` pela palavra-chave `@viteUrl` para permitir ativos do servidor de desenvolvimento e do servidor CDN.

```ts
directives: {
  defaultSrc: [`'self'`, '@viteDevUrl'], // [!code --]
  defaultSrc: [`'self'`, '@viteUrl'], // [!code ++]
  connectSrc: ['@viteHmrUrl']
},
```

### Adicionando Nonce aos estilos injetados pelo Vite
Atualmente, o Vite não permite definir um atributo `nonce` para as tags `style` injetadas por ele dentro do DOM. Há um [PR aberto](https://github.com/vitejs/vite/pull/11864) para o mesmo, e esperamos que seja resolvido em breve.

## Configurando HSTS
O cabeçalho de resposta [**Strict-Transport-Security (HSTS)**](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) informa aos navegadores para sempre carregar o site usando HTTPS.

Você pode configurar as diretivas de cabeçalho usando o arquivo `config/shield.ts`.

```ts
import { defineConfig } from '@adonisjs/shield'

const shieldConfig = defineConfig({
  hsts: {
    enabled: true,
    maxAge: '180 days',
    includeSubDomains: true,
  },
})
```

### `enabled`

Ative ou desative a proteção hsts.

### `maxAge`

Define o atributo `max-age`. O valor deve ser um número em segundos ou uma expressão de tempo baseada em string.

```ts
{
  // Lembre-se por 10 segundos
  maxAge: 10,
}
```

```ts
{
  // Lembre-se por 2 dias
  maxAge: '2 days',
}
```

### `includeSubDomains`

Define a diretiva `includeSubDomains` para aplicar a configuração em subdomínios.

## Configurando a proteção X-Frame
O cabeçalho [**X-Frame-Options**](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) é usado para indicar se um navegador tem permissão para renderizar um site incorporado dentro de uma tag `iframe`, `frame`, `embed` ou `object`.

::: info NOTA
Se você configurou o CSP, você pode usar a diretiva [frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors) e desabilitar a proteção `xFrame`.
:::

Você pode configurar as diretivas de cabeçalho usando o arquivo `config/shield.ts`.

```ts
import { defineConfig } from '@adonisjs/shield'

const shieldConfig = defineConfig({
  xFrame: {
    enabled: true,
    action: 'DENY'
  },
})
```

### `enabled`

Ative ou desative a proteção xFrame.

### `action`

A propriedade `action` define o valor do cabeçalho. Pode ser `DENY`, `SAMEORIGIN` ou `ALLOW-FROM`.

```ts
{
  action: 'DENY'
}
```

No caso de `ALLOW-FROM`, você também deve definir a propriedade `domain`.

```ts
{
  action: 'ALLOW-FROM',
  domain: 'https://foo.com',
}
```

## Desabilitando o MIME sniffing
O cabeçalho [**X-Content-Type-Options**](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) instrui os navegadores a seguir o cabeçalho `content-type` e não executar o MIME sniffing inspecionando o conteúdo de uma resposta HTTP.

Depois que você habilitar essa proteção, o Shield definirá o cabeçalho `X-Content-Type-Options: nosniff` para todas as respostas HTTP.

```ts
import { defineConfig } from '@adonisjs/shield'

const shieldConfig = defineConfig({
  contentTypeSniffing: {
    enabled: true,
  },
})
```
