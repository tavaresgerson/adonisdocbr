---
title: Shield Middleware
category: security
---

# Shield Middleware

Além de [CORS](/docs/05-Security/04-CORS.md) e [CSRF](/docs/05-Security/05-CSRF-Protection.md), o AdonisJs também previne seus aplicativos web de outros ataques de malware como *XSS*, *Content Sniffing*, *Script Injection* e assim por diante.

::: warning NOTA
Não existe uma solução mágica para proteger seus sites completamente. O AdonisJs como uma estrutura oferece várias maneiras de prevenir ataques comuns na web.
:::

## Configuração
Instale o provedor `shield` e registre o middleware apropriado:

```bash
adonis install @adonisjs/shield
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/shield/providers/ShieldProvider'
]
```

Finalmente, registre o middleware global dentro do arquivo `start/kernel.js`:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/Shield'
]
```

::: warning OBSERVAÇÃO
O middleware Shield depende de [sessões](/docs/04-Basics/07-Sessions.md), portanto, certifique-se de que estejam configuradas corretamente.
:::

## Política de Segurança de Conteúdo

A Política de Segurança de Conteúdo (CSP) ajuda a definir as fontes confiáveis ​​para carregar e executar *scripts*, *estilos*, *fontes* e vários outros recursos.

É uma boa prática ser rigoroso ao permitir a execução de scripts de diferentes fontes.

Para mais informações, leia este artigo interessante de [HTML5 rocks](http://www.html5rocks.com/en/tutorials/security/content-security-policy).

### Configuração
A configuração para CSP é salva dentro do arquivo `config/shield.js`:

```js
// .config/shield.js

csp: {
  directives: {
    defaultSrc: ['self', 'http://getcdn.com'],
    scriptSrc: ['self', '@nonce'],
    styleSrc: ['http://getbootstrap.com'],
    imgSrc: ['http://dropbox.com']
  },
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: true
}
```

| Chave           | Valor   | Descrição           |
|-----------------|---------|---------------------|
| directives      | Object  | As diretivas ajudam a definir políticas a serem aplicadas a diferentes tipos de recursos. Você pode obter a lista de todas as diretivas em http://content-security-policy.com.  |
| reportOnly      | Boolean | Defina o valor como `true` para registrar avisos de que algumas regras foram violadas em vez de interromper a execução da página.  |
| setAllHeaders   | Boolean | O Shield define diferentes cabeçalhos HTTP para diferentes navegadores. Defina o valor como `true` para definir todos os cabeçalhos de fallback, independentemente do navegador.  |
| disableAndroid  | Boolean | Como o Android é conhecido por ser problemático com CSP, defina o valor como `true` para desabilitar o CSP para Android.  |

### Suporte ao navegador
Quase todos os navegadores modernos suportam CSP.

Aqui está a lista mais precisa de [navegadores suportados](http://caniuse.com/#feat=contentsecuritypolicy).

### Política CSP via meta tags
O middleware `shield` define automaticamente os cabeçalhos HTTP necessários para o CSP funcionar, mas também fornece um auxiliar de visualização para definir a meta tag, se necessário:

```edge
{{ cspMeta() }}
```

```html
<!-- Saída -->

<meta http-equiv="Content-Security-Policy" content="xxx">
```

### CSP Nonce
As tags de script com código JavaScript inline são automaticamente confiáveis ​​e executadas pelo navegador.

Esse comportamento pode ser interrompido adicionando `@nonce` ao seu array de configuração `scriptSrc`:

```js
// .config/shield.js

csp: {
  directives: {
    scriptSrc: ['self', '@nonce']
  },
  // ...
}
```

Para informar ao navegador quais blocos de script inline ainda devem ser executados, anexe um atributo `nonce` usando a visualização global `cspNonce` em seus modelos, como:

```edge
<script nonce="{{ cspNonce }}">
  // ...
</script>
```

## Proteção contra malware
A proteção contra malware ajuda a proteger seu site de ataques *XSS*, *iframe embeds* indesejados, *content-type sniffing* e impede que o IE execute scripts não solicitados no contexto de sua página da web.

### XSS
Edite o objeto de configuração `xss` para habilitar/desabilitar a proteção XSS (define o cabeçalho `X-XSS-Protection=1; mode=block`):

```js
// .config/shield.js

xss: {
  enabled: true,
  enableOnOldIE: false
}
```

### Sem Sniff
A maioria dos navegadores modernos tenta detectar o *Content-Type* de uma solicitação farejando seu conteúdo, o que significa que um arquivo terminando em *.txt* pode ser executado como JavaScript se contiver código JavaScript.

Para desabilitar esse comportamento, defina `nosniff` como `false`:

```js
// .config/shield.js

{
  nosniff: true
}
```

### Sem Open
Usuários do IE podem executar páginas da web no contexto do seu site, o que é um sério risco de segurança.

Para impedir que o IE execute scripts desconhecidos no contexto do seu site, certifique-se de que `noopen` esteja definido como `true` (define o cabeçalho `X-Download-Options: noopen`):

```js
// .config/shield.js

{
  noopen: true
}
```

### XFrame
A opção `xframe` dentro do arquivo `config/shield.js` facilita o controle do comportamento de incorporação do seu site dentro de um iframe.

As opções disponíveis são `DENY`, `SAMEORIGIN` ou `ALLOW-FROM http://example.com`:

```js
// .config/shield.js

{
  xframe: 'DENY'
}
```
