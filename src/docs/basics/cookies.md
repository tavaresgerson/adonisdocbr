---
resumo: Aprenda a ler, escrever e limpar cookies no AdonisJS.
---

# Cookies

Os cookies de solicitação são analisados ​​automaticamente durante uma solicitação HTTP. Você pode ler cookies usando o objeto [request](./request.md) e definir/limpar cookies usando o objeto [response](./response.md).

```ts
// title: Read cookies
import router from '@adonisjs/core/services/router'

router.get('cart', async ({ request }) => {
  // highlight-start
  const cartItems = request.cookie('cart_items', [])
  // highlight-end
  console.log(cartItems)
})
```

```ts
// title: Set cookies
import router from '@adonisjs/core/services/router'

router.post('cart', async ({ request, response }) => {
  const id = request.input('product_id')
  // highlight-start
  response.cookie('cart_items', [{ id }])
  // highlight-end
})
```

```ts
// title: Clear cookies
import router from '@adonisjs/core/services/router'

router.delete('cart', async ({ request, response }) => {
  // highlight-start
  response.clearCookie('cart_items')
  // highlight-end
})
```

## Configuração

A configuração padrão para definir cookies é definida dentro do arquivo `config/app.ts`. Sinta-se à vontade para ajustar as opções de acordo com os requisitos do seu aplicativo.

```ts
http: {
  cookie: {
    domain: '',
    path: '/',
    maxAge: '2h',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    /**
     * Experimental properties
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#partitioned
     */
    partitioned: false,
    priority: 'medium',
  }
}
```

As opções são convertidas para [atributos set-cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes). A propriedade `maxAge` aceita uma expressão de tempo baseada em string, e seu valor será convertido para segundos.

O mesmo conjunto de opções pode ser substituído ao definir os cookies.

```ts
response.cookie('key', value, {
  domain: '',
  path: '/',
  maxAge: '2h',
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
})
```

## Tipos de dados suportados

Os valores de cookie são serializados para uma string usando `JSON.stringify`; portanto, você pode usar os seguintes tipos de dados JavaScript como valores de cookie.

- string
- number
- bigInt
- boolean
- null
- object
- array 

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

// BigInt
response.cookie('visits', BigInt(10))

// Data objects are converted to ISO string
response.cookie('visits', new Date())
```

## Cookies assinados

Os cookies definidos usando o método `response.cookie` são assinados. Um cookie assinado é à prova de adulteração, o que significa que alterar seu conteúdo invalidará sua assinatura e o cookie será ignorado.

Os cookies são assinados usando o `appKey` definido dentro do arquivo `config/app.ts`.

:::note
Os cookies assinados ainda são legíveis pela decodificação Base64. Você pode usar cookies criptografados se quiser que o valor do cookie seja ilegível.
:::

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ request, response }) => {
  // set signed cookie
  response.cookie('user_id', 1)

  // read signed cookie
  request.cookie('user_id')
})
```

## Cookies criptografados

Ao contrário dos cookies assinados, o valor do cookie criptografado não pode ser decodificado para texto simples. Portanto, você pode usar cookies criptografados para valores que contêm informações confidenciais que não devem ser legíveis por ninguém.

Os cookies criptografados são definidos usando o método `response.encryptedCookie` e lidos usando o método `request.encryptedCookie`. Por baixo dos panos, esses métodos usam o [módulo Encryption](../security/encryption.md).

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ request, response }) => {
  // set encrypted cookie
  response.encryptedCookie('user_id', 1)

  // read encrypted cookie
  request.encryptedCookie('user_id')
})
```

## Cookies simples

Os cookies simples devem ser usados ​​quando você deseja que o cookie seja acessado pelo seu código frontend usando o valor `document.cookie`.

Por padrão, chamamos `JSON.stringify` em valores brutos e os convertemos em uma string codificada em base64. Isso é feito para que você possa usar `objects` e `arrays` para o valor do cookie. No entanto, a codificação pode ser desativada.

Os cookies simples são definidos usando o método `response.plainCookie` e podem ser lidos usando o método `request.plainCookie`.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ request, response }) => {
  // set plain cookie
  response.plainCookie('user', { id: 1 }, {
    httpOnly: true
  })

  // read plain cookie
  request.plainCookie('user')
})
```

Para desativar a codificação, defina `encoding: false` no objeto options.

```ts
response.plainCookie('token', tokenValue, {
  httpOnly: true,
  encode: false,
})

// Read plain cookie with encoding off
request.plainCookie('token', {
  encoded: false
})
```

## Configurando cookies durante testes
Os guias a seguir abordam o uso de cookies ao escrever testes.

[Japa API client](../testing/http_tests.md#readingwriting-cookies).
[Japa browser client](../testing/browser_tests.md#readingwriting-cookies).
