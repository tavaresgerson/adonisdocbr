# Cookies

Ler/Escrever cookies no AdonisJs é moleza. Você usa instâncias [request](/docs/03-getting-started/06-request.md) e [response](/docs/03-getting-started/07-response.md) passadas para todos os métodos do controlador e fechamentos de rota para trabalhar com cookies.

::: warning NOTA
Para manter seus cookies criptografados, certifique-se de definir `APP_KEY` dentro do arquivo *.env*. Como alternativa, você pode usar o comando `./ace generate:key` para gerar a chave para você.
:::

## Exemplo básico
Vamos dar um exemplo básico de rastreamento de visualizações de página para um determinado usuário armazenando a contagem dentro de cookies.

```js
Route.get('/', function * (request, response) {
  const pageViews = request.cookie('pageViews', 0) // leitura
  pageViews++
  response.cookie('pageViews', pageViews) // escrita
})
```

## Lendo cookies
Os cookies são lidos usando a *instância de solicitação*.

#### `cookie(key, [defaultValue])`
Retorna o valor do cookie para uma determinada chave. O valor padrão é retornado quando o valor existente é `null` ou `undefined`.

```js
Route.get('/', function * (request, response) {
  const cartTotal = request.cookie('cartTotal')
  // or
  const cartTotal = request.cookie('cartTotal', 0)
})
```

#### `cookies`
Obtém todos os cookies de volta como um objeto.

```js
Route.get('/', function * (request, response) {
  const cookies = request.cookies()
})
```

## Escrevendo/Excluindo Cookies
Para criar/excluir cookies, você precisa usar a *instância de resposta*.

#### `cookie(key, value, [options])`

```js
Route.get('/', function * (request, response) {
  response.cookie('cartValue', 210)

  // ou
  response.cookie('cartValue', 210, {
    httpOnly: true
  })
})
```

| Propriedade     | tipo    | descrição     |
|-----------------|---------|---------------|
| path            | String  | Caminho do cookie.  |
| expires         | Date    | Data de expiração absoluta para o cookie. Deve ser um *objeto Date* válido. |
| maxAge          | String  | Idade máxima relativa do cookie a partir do momento em que o cliente o recebe *(em segundos)*. |
| domain          | String  | Domínio para o cookie.  |
| secure          | Boolean | Marca o cookie para ser usado somente com HTTPS.  |
| httpOnly        | Boolean | Sinaliza o cookie para ser acessível somente pelo servidor web. Não pode ser acessado usando `document.cookie`. |
| firstPartyOnly  | Boolean | Define o cookie a ser usado somente pelo mesmo domínio.  |

#### clearCookie(key)
Remove o cookie existente.

```js
Route.get('checkout', function * (request, response) {
  response.clearCookie('cartValue')
  response.send('Order Confirmed')
})
```
