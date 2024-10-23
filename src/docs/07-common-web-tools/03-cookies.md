# Cookies

Leitura/escrita de cookies no AdonisJS é uma brisa. Você usa as instâncias [request](/getting-started/request) e [response](/getting-started/response) passadas para todos os métodos do controlador e fechamentos de rota para trabalhar com cookies.

NOTE: Para manter seus cookies criptografados certifique-se de definir o `APP_KEY` dentro do arquivo *.env*. Alternativamente, você pode usar o comando `./ace generate:key` para gerar a chave para você.


## Exemplo básico
Vamos pegar um exemplo básico de rastreamento de visualizações de página para um determinado usuário, armazenando o número dentro dos cookies.

```js
Route.get('/', function * (request, response) {
  const pageViews = request.cookie('pageViews', 0) // reading
  pageViews++
  response.cookie('pageViews', pageViews) // writing
})
```

## Leituras de Cookies
Os cookies são lidos usando a instância de *solicitação*.

#### cookie(chave, [valorPadrão])
Retorna o valor do cookie para uma determinada chave. O valor padrão é retornado quando o valor existente é `nulo` ou `indefinido`.

```js
Route.get('/', function * (request, response) {
  const cartTotal = request.cookie('cartTotal')
  // or
  const cartTotal = request.cookie('cartTotal', 0)
})
```

#### cookies
Recupere todos os cookies como um objeto.

```js
Route.get('/', function * (request, response) {
  const cookies = request.cookies()
})
```

## Redação/Exclusão de Cookies
Para criar/apagar cookies você tem que fazer uso da instância de resposta.

#### cookie(chave, valor, [opções])

```js
Route.get('/', function * (request, response) {
  response.cookie('cartValue', 210)

  // or
  response.cookie('cartValue', 210, {
    httpOnly: true
  })
})
```

##### Opções

| Propriedade | tipo | descrição |
|----------|------|-------------|
| caminho | String | Caminho do cookie. |
| expira | Data | Data de expiração absoluta do cookie. Deve ser um objeto *Date válido*. |
| maxAge | String | Idade máxima relativa do cookie a partir de quando o cliente o recebe *(em segundos)*. |
| domínio | String | Domain para o cookie. |
| seguro | Boolean | Marca o cookie para ser usado apenas com HTTPS. |
| httpOnly | Boolean | Indica o cookie para ser acessível apenas pelo servidor web. Não pode ser acessado usando `document.cookie`. |
| firstPartyOnly | Boolean | Define cookie para ser usado apenas pelo mesmo domínio. |

#### clearCookie(chave)
Remove o cookie existente.

```js
Route.get('checkout', function * (request, response) {
  response.clearCookie('cartValue')
  response.send('Order Confirmed')
})
```
