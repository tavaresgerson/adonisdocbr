# Cookies
Você trabalha com cookies usando as classes [`request`](/doc/http/request.md) e de [`response`](/doc/http/response.md). A classe de solicitação expõe a 
API para ler os cookies existentes e a classe de resposta permite a criação/atualização de cookies.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.post('add-to-cart', async ({ request, response }) => {
  /**
   * Lê um cookie pelo nome
   */
  const existingItems = request.cookie('cart-items', [])

  /**
   * Define/atualiza um cookie
   */
  const newItems = existingItems.concat([{ id: 10 }])
  response.cookie('cart-items', newItems)
})
```

### Configuração de cookies
Você pode ajustar a configuração dos cookies modificando o objeto `http.cookie` dentro do arquivo `config/app.ts`.

```ts
/// config/app.ts

http: {
  cookie: {
    domain: '',
    path: '/',
    maxAge: '2h',
    httpOnly: true,
    secure: false,
    sameSite: false,
  },
}
```

#### domain
Especifica o valor do atributo de domínio. Por padrão, nenhum domínio é definido e a maioria dos clientes considera o cookie 
aplicável apenas ao domínio atual.

#### path
Especifica o valor do atributo `path`. Por padrão, o path é considerado o "caminho padrão".

#### maxAge
Especifica o valor do atributo `max-age`. O valor fornecido será convertido em um número inteiro.

#### httpOnly
Especifica o valor `boolean` para o atributo `httponly`. Quando verdadeiro, o atributo `HttpOnly` é definido. Caso contrário, não é.

#### secure
Especifica o valor `boolean` do atributo `secure`. Quando verdadeiro, o atributo Seguro é definido. Caso contrário, não é. 
Por padrão, o atributo Secure não está definido.

#### sameSite
Especifica o booleano ou string para ser o valor do atributo `samesite`.

* `true` irá definir o atributo `SameSite` como `Strict`, ou seja, estritamente do mesmo domínio.
* `false` não definirá o atributo `SameSite`.
* `'lax'` irá definir o atributo `SameSite` para `Lax` para a aplicação negligente do mesmo site.
* `'none'` irá definir o atributo `SameSite` como `None` para um cookie cross-site explícito.
* `'strict'` irá definir o atributo `SameSite` como `Strict` para aplicação estrita do mesmo domínio.

O mesmo conjunto de opções também pode ser definido em tempo de execução ao configurar o cookie. Vamos mesclar os valores 
embutidos com a configuração padrão.

```ts
response.cookie('user_id', 1, {
  httpOnly: false,
})
```

### Tipos de dados suportados
Junto com os valores de string, os seguintes tipos de dados também são suportados como valores de cookies.

```ts
// Object
response.cookie('user', {
  id: 1,
  fullName: 'virk',
})

// Array
response.cookie('product_ids', [1, 2, 3, 4])

// Boolean
response.cookie('is_logged_in', true)

// Number
response.cookie('visits', 10)

// Objetos de Data são convertidos em string ISO
response.cookie('visits', new Date())
```

### Cookies assinados
Por padrão, todos os cookies definidos pelo método `response.cookie` são assinados. Os cookies assinados contêm uma assinatura ao 
lado do valor do cookie para evitar a violação do cookie.

* A assinatura é calculada a partir do valor do cookie e, em caso de violação, a assinatura será incompatível e o AdonisJS ignorará o cookie.
* A assinatura é gerada usando o `appKey` armazenado dentro do arquivo `config/app.ts`.
* Os cookies assinados ainda podem ser lidos pela decodificação em base64. Você pode usar cookies criptografados se quiser que o valor seja ilegível.

```ts
Route.get('/', async ({ request, response }) => {
  // Definir cookie assinado
  response.cookie('user_id', 1)

  // Lê um cookie assinado
  request.cookie('user_id')
})
```

#### Cookies criptografados
Ao contrário dos cookies assinados, o valor do cookie criptografado não pode ser decodificado em texto simples. Você pode usar cookies 
criptografados para valores que contêm informações confidenciais e não devem ser lidos por ninguém.

* O valor do cookie é criptografado usando o módulo [`Encryption`](https://docs.adonisjs.com/guides/security/encryption).
* Ele usa o `appKey` armazenado dentro do arquivo `config/app.ts` como o segredo de criptografia.

Os cookies criptografados são definidos usando o método `response.encryptedCookie`. Por exemplo:

```ts
Route.get('/', async ({ response }) => {
  response.encryptedCookie('user_id', 1)
})
```

Da mesma forma, para ler o valor do cookie, você terá que usar o método `request.encryptedCookie`.

```ts
Route.get('/', async ({ request }) => {
  console.log(request.encryptedCookie('user_id'))
})
```

### Cookies simples
Cookies simples mantêm valores codificados em base64 sem assinatura ou criptografia. Eles geralmente são úteis quando você deseja acessar 
o cookie no JavaScript de front-end e ler/gravar seu valor.

Você pode definir um cookie simples usando o método `plainCookie`. Por exemplo:

```ts
Route.get('/', async ({ response }) => {
  response.plainCookie('user_id', 1)
})
```

Se você deseja acessar este cookie dentro do JavaScript de front-end, certifique-se de desativar o sinalizador `httpOnly`.

```ts
response.plainCookie('user_id', 1, {
  httpOnly: false,
})
```

Você pode ler o valor do cookie dentro do JavaScript usando a propriedade `document.cookie`. Certifique-se de decodificar em 
base64 e JSON parar analisar o valor.

O exemplo a seguir é uma implementação ingênua para ler o valor do cookie, serve apenas para demonstração.

```ts
/**
 * Lê o valor do cookie
 */
const userIdValue = document.cookie.split('user_id=')[1].split(';')[0]

/**
 * Decodifica o valor de Base64
 */
const base64Decoded = atob(userIdValue)

/**
 * Converte o valor de JSON para um objeto
 */
const jsonParsed = JSON.parse(base64Decoded)
console.log(jsonParsed)
```
