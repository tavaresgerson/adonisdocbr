# Middleware Shield

Além de [CORS](/docs/09-security/02-cors.md) e [CSRF](/docs/09-security/03-csrf-protection.md), o AdonisJs também previne seus aplicativos da web de outros ataques de malware como *XSS*, *Content Sniffing*, *Script Injection*, etc. Cada novo aplicativo é pré-configurado para fazer uso do middleware `shield` que mantém seus sites seguros.

::: info NOTA
Não existe uma solução mágica para proteger seus sites completamente. O AdonisJs como uma estrutura oferece várias maneiras de prevenir ataques comuns da web.
:::

## Configuração e configuração
Certifique-se de que o middleware *shield* seja adicionado à lista de middleware global dentro do arquivo `app/Http/kernel.js`.

```js
// app/Http/kernel.js
const globalMiddlewares = [
  // ...
  'Adonis/Middleware/Shield'
  // ...
]
```

O arquivo de configuração para shield está disponível dentro do arquivo `config/shield.js`. Você é livre para configurá-lo conforme suas necessidades.

## Política de Segurança de Conteúdo
A Política de Segurança de Conteúdo (CSP) ajuda você a definir as fontes confiáveis ​​para carregar e executar *scripts*, *estilos*, *fontes* e vários outros recursos.

É uma boa prática ser rigoroso ao permitir a execução de scripts de diferentes fontes. Você deve ler este artigo interessante de [HTML5 rocks](http://www.html5rocks.com/en/tutorials/security/content-security-policy).

### Configuração
O bloco `csp` dentro do arquivo de configuração do shield define a regra para a política de segurança de conteúdo.

```js
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

| Key             | Value   | Description |
|-----------------|---------|-------------|
| directives      | Object  | As diretivas ajudam você a definir políticas a serem aplicadas em diferentes tipos de recursos. Você pode obter a lista de todas as diretivas em [http://content-security-policy.com](http://content-security-policy.com).  |
| reportOnly      | Boolean | Ela não interromperá a execução da sua página, em vez disso, retornará um aviso de que algumas regras foram violadas.  |
| setAllHeaders   | Boolean | O Shield define diferentes cabeçalhos HTTP para diferentes navegadores. Para desabilitar esse comportamento, você pode definir esse valor como true e todos os cabeçalhos serão definidos.  |
| disableAndroid  | Boolean | O Android tem bugs com CSP, você pode desabilitá-lo para Android caso tenha algum problema.  |

### Suporte ao navegador
Quase todos os navegadores modernos oferecem suporte amplo ao CSP, mas aqui está a [lista](http://caniuse.com/#feat=contentsecuritypolicy) mais precisa de navegadores suportados.

### Política CSP via Meta Tags
O middleware `shield` define automaticamente os cabeçalhos HTTP necessários para o CSP funcionar, mas também fornece um auxiliar de visualização para definir a meta tag.

```twig
{{ cspMeta }}
```

```html
<!-- Output -->
<meta http-equiv="Content-Security-Policy" content="xxx">
```

### CSP Nonce
As tags de script com código javascript inline são automaticamente confiáveis ​​e executadas pelo navegador. Para interromper esse comportamento, você deve permitir apenas os blocos de script inline confiáveis ​​adicionando `@nonce` ao array `scriptSrc`.

```js
csp: {
  directives: {
    scriptSrc: ['self', '@nonce']
  },
  // ...
}
```

Agora você precisa informar ao navegador que seus blocos de script inline selecionados devem ser executados, e essa seleção é feita com a ajuda de uma visualização global.

```twig
<script nonce="{{ cspNonce }}">
  // ...
</script>
```

## Proteção contra malware
A proteção contra malware ajuda a proteger seu site de ataques *XSS*, *iframe embeds* indesejados, *content-type sniffing* e impede que o IE execute scripts não solicitados no contexto de sua página da web.

### XSS
Use a configuração definida abaixo para habilitar/desabilitar a proteção XSS. Isso é feito definindo `X-XSS-Protection=1; mode=block`

```js
xss: {
  enabled: true,
  enableOnOldIE: false
}
```

### Sem Sniff
A maioria dos navegadores modernos tentará detectar o *Content-Type* de uma solicitação farejando seu conteúdo. O que significa que um arquivo terminado em *.txt* pode ser executado como um arquivo javascript, se contiver código javascript. Para desabilitar esse comportamento, defina `nosniff=false`.

A configuração abaixo definirá o valor do cabeçalho `X-Content-Type-Options` para *nosniff*.

```js
{
  nosniff: true
}
```

### No Open
Esta configuração impedirá que o IE execute script desconhecido no contexto do seu site. A configuração abaixo definirá o valor de `X-Download-Options` para *noopen*.

```js
{
  noopen: true
}
```

### XFrame
A opção xframe dentro do arquivo `config/shield.js` facilita o controle do comportamento de incorporação do seu site dentro de um iframe. Você pode escolher entre `DENY`, `ALLOW` ou `ALLOW-FROM http://mywebsite.com`.

```js
{
  xframe: 'DENY'
}
```
