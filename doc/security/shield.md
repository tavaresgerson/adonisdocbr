# Shield Middleware

Além do [CORS](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/security/cors.md) e do [CSRF](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/security/csrf.md), o AdonisJs também impede 
seus aplicativos da Web de outros ataques de malware como XSS, Sniffing de conteúdo, injeção de script e assim por diante.

Não existe uma bala de prata para proteger completamente seus sites. O AdonisJs como estrutura oferece 
várias maneiras de impedir ataques comuns na Web.

## Configuração
Instale o provedor `shield` e registre o middleware apropriado:

```
> adonis install @adonisjs/shield
```

Em seguida, registre o provedor dentro do arquivo `start/app.js`:

``` js
const providers = [
  '@adonisjs/shield/providers/ShieldProvider'
]
```

Por fim, registre o middleware global dentro do arquivo `start/kernel.js`:

``` js
const globalMiddleware = [
  'Adonis/Middleware/Shield'
]
```

> O middleware Shield depende de [sessões](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/basics/sessions.md), portanto, verifique se elas estão configuradas corretamente.

## Política de Segurança de Conteúdo
A Política de segurança de conteúdo (CSP) ajuda a definir as fontes confiáveis para carregar e executar 
scripts, estilos, fontes e vários outros recursos.

É uma boa prática ser rigoroso ao permitir a execução de scripts de diferentes fontes.

Para mais informações, leia este artigo interessante do [HTML5 rocks](https://www.html5rocks.com/en/tutorials/security/content-security-policy).

### Configuração
A configuração do CSP é salva dentro do arquivo `config/shield.js`:

```
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

| Chave           | Valor                       | Descrição |
|-----------------|-----------------------------|-----------|
| diretrizes      | Objeto                      | As diretivas ajudam a definir políticas a serem aplicadas a diferentes tipos de recursos. Você pode obter a lista de todas as diretivas em http://content-security-policy.com.  |
| reportOnly      | boleano                     | Defina o valor como `true` para registrar avisos de que algumas regras foram violadas em vez de interromper a execução da página. |
| setAllHeaders   | boleano                     | O Shield define cabeçalhos HTTP diferentes para diferentes navegadores. Defina o valor como `true` para definir todos os cabeçalhos de fallback, independentemente do navegador.  |
| disableAndroid  | boleano                     | Como o Android é conhecido por apresentar problemas com o CSP, defina o valor `true` para desativar o CSP para Android. |

### Suporte do navegador
Quase todos os navegadores modernos oferecem suporte ao CSP.

Aqui está a lista mais precisa de [navegadores suportados](https://caniuse.com/#feat=contentsecuritypolicy).

### Política de CSP por meta tags
O middleware `shield` define automaticamente os cabeçalhos HTTP necessários para o CSP funcionar, mas 
também fornece um auxiliar de exibição para definir a meta tag, se necessário:

```
{{ cspMeta() }}
```
Resultado
``` html
<meta http-equiv="Content-Security-Policy" content="xxx">
```

### CSP Nonce
As tags de script com código JavaScript embutido são automaticamente confiáveis e executadas pelo navegador.

Esse comportamento pode ser interrompido adicionando `@nonce` ao seu array `scriptSrc` de configuração :

``` js
// Em config/shield.js
csp: {
  directives: {
    scriptSrc: ['self', '@nonce']
  },
  // ...
}
```

Para informar ao navegador quais blocos de script embutidos ainda devem ser executados, acrescente um atributo `nonce` 
usando a visualização `cspNonce` global em seus modelos, da seguinte maneira:

```
<script nonce="{{ cspNonce }}">
  // ...
</script>
```

## Proteção contra malware
A proteção contra malware ajuda a proteger seu site contra ataques XSS, incorporações indesejadas de iframe, detecção 
de tipo de conteúdo e impedindo o IE de executar scripts não solicitados no contexto da sua página da web.

### XSS
Edite o objeto `xss` de configuração para ativar/desativar a proteção XSS (define o cabeçalho `X-XSS-Protection=1; mode=block`):

``` js
Em config/shield.js
xss: {
  enabled: true,
  enableOnOldIE: false
}
```

### No Sniff
A maioria dos navegadores modernos tenta detectar o Content-Type de uma solicitação detectando seu conteúdo, o que 
significa que um arquivo que termina em .txt pode ser executado como JavaScript se contiver código JavaScript.

Para desabilitar esse comportamento, defina `nosniff` como `false`:

``` js
// Em config/shield.js
{
  nosniff: true
}
```

### No Open
Os usuários do IE podem executar páginas da Web no contexto do seu site, o que representa um sério risco à segurança.

Para impedir o IE de executar scripts desconhecidos no contexto do seu site, verifique se `noopen` está definido 
como `true` (define o cabeçalho `X-Download-Options: noopen`):

``` js
// Em config/shield.js
{
  noopen: true
}
```

### XFrame
A opção `xframe` no arquivo `config/shield.js` facilita o controle do comportamento de incorporação do seu site em um iframe.

As opções disponíveis são `DENY`, `SAMEORIGIN` ou `ALLOW-FROM http://example.com`:

``` js
{
  xframe: 'DENY'
}
```
