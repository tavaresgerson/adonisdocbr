# Shield Middleware

Além de [Cors](/security/cors) e [CSRF](/security/csrf-protection), o Adonis também previne seus aplicativos web contra outros ataques maliciosos como XSS, Sniffing de Conteúdo, Injeção de Script, etc. Todo novo aplicativo é pré-configurado para usar o middleware 'shield', que mantém seu site seguro.

> NOTE
> Não existe uma bala de prata para proteger completamente seus sites. O AdonisJS como um framework oferece várias maneiras de prevenir ataques comuns na web.

## Configuração & Instalação
Certifique-se de que o *shield* middleware seja adicionado à lista de middleware global dentro do arquivo `app/Http/kernel.js`.

```js
// app/Http/kernel.js
const globalMiddlewares = [
  // ...
  'Adonis/Middleware/Shield'
  // ...
]
```

O arquivo de configuração do escudo está disponível dentro do arquivo config/shield.js. Você é livre para configurá-lo conforme suas necessidades.

## Política de Segurança de Conteúdo

A Política de Segurança de Conteúdo (CSP) ajuda a definir as fontes confiáveis para carregar e executar scripts, estilos, fontes e outros recursos.

É uma boa prática ser estrito ao permitir a execução de scripts de diferentes fontes. Você deve ler este interessante artigo por [HTML5 rocks](http://www.html5rocks.com/pt-br/tutorials/security/content-security-policy).

### Configuração
O bloco 'csp' dentro do arquivo de configuração do escudo define a regra para a política de segurança de conteúdo.

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

| Chave | Valor | Descrição |
| diretivas | Objeto | Diretivas ajuda você a definir políticas a serem aplicadas em diferentes tipos de recursos. Você pode obter a lista de todas as diretivas em [http://content-security-policy.com](http://content-security-policy.com/). |
| reportOnly | Boolean | Isso não irá parar a execução da sua página, em vez disso, retornará uma mensagem de aviso dizendo que algumas regras foram violadas. |
| setAllHeaders | Boolean | O escudo define diferentes cabeçalhos HTTP para diferentes navegadores. Para desativar esse comportamento, você pode este valor como verdadeiro, e todos os cabeçalhos serão definidos. |
| desativarAndroid | Boolean | Android é bugado com CSP você pode desativá-lo para Android no caso de você enfrentar qualquer problema. |

### Suporte de navegador
Quase todos os navegadores modernos suportam o CSP, mas aqui está a lista mais precisa de navegadores compatíveis [lista](http://caniuse.com/#feat=content-security-policy).

### Política de Segurança de Conteúdo via Meta Tags
O `shield` middleware automaticamente define os cabeçalhos HTTP necessários para o CSP funcionar, mas também fornece um auxiliar de visão para definir a tag meta.

```twig
{{ cspMeta }}
```

Saída:
```html
<meta http-equiv="Content-Security-Policy" content="xxx">
```

### CSP Nonce
Tags de script com código JavaScript inline são automaticamente confiáveis e executadas pelo navegador. Para interromper esse comportamento, você deve permitir apenas blocos de script inline confiáveis adicionando `@nonce` ao array `scriptSrc`.

```js
csp: {
  directives: {
    scriptSrc: ['self', '@nonce']
  },
  // ...
}
```

Agora você tem que dizer ao navegador que seus blocos de script embutidos selecionados devem ser executados, e essa seleção é feita com a ajuda de uma visão global.

```twig
<script nonce="{{ cspNonce }}">
  // ...
</script>
```

## Proteção contra malware
A proteção contra malware ajuda a proteger seu site de ataques XSS, inserções indesejadas de iframe, sniffing de tipo de conteúdo e para impedir que o IE execute scripts não solicitados no contexto da sua página da web.

### XSS
Faça uso da configuração abaixo definida para habilitar/desabilitar a proteção XSS. É feito por meio de um cabeçalho HTTP, que é definido como 'X-XSS-Protection: 1; mode=block'

```js
xss: {
  enabled: true,
  enableOnOldIE: false
}
```

### Sem cheiro
A maioria dos navegadores modernos tentará detectar o tipo de conteúdo de uma solicitação, analisando seu conteúdo. Isso significa que um arquivo com a extensão  *.txt* pode ser executado como um arquivo JavaScript se contiver código JavaScript. Para desativar esse comportamento, defina 'nosniff=false'.

Abaixo a configuração irá definir o valor do cabeçalho `X-Content-Type-Options` para *nosniff*.

```js
{
  nosniff: true
}
```

### Não aberto
Esta configuração impedirá que o Internet Explorer execute scripts desconhecidos no contexto do seu site. A configuração abaixo definirá o valor de X-Download-Options para *noopen*.

```js
{
  noopen: true
}
```

### XFrame
A opção xframe no arquivo config/shield.js facilita o controle do comportamento de incorporação do seu site dentro de um iFrame. Você pode escolher entre 'DENY', 'ALLOW' ou 'ALLOW-FROM http://mywebsite.com'.

```js
{
  xframe: 'DENY'
}
```
