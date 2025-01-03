# Cookies

Você trabalha com cookies usando as classes [request](./request.md) e [response](./response.md). A classe request expõe a API para ler os cookies existentes, e a classe response permite criar, atualizar e excluir cookies.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.post('add-to-cart', async ({ request, response }) => {
  /**
   * Ler cookie por nome
   */
  const existingItems = request.cookie('cart-items', [])

  /**
   * Definir/atualizar cookie
   */
  const newItems = existingItems.concat([{ id: 10 }])
  response.cookie('cart-items', newItems)
})

Route.delete('clear-cart', async ({ response }) => {
  /**
   * Limpar cookie
   */
  response.clearCookie('cart-items')
})
```

## Configuração de cookies

Você pode ajustar a configuração para cookies modificando o objeto `http.cookie` dentro do arquivo `config/app.ts`.

```ts
// config/app.ts

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

#### `domain`

Especifica o valor para o atributo de domínio. Por padrão, nenhum domínio é definido, e a maioria dos clientes considerará o cookie para aplicar somente ao domínio atual.

#### `path`

Especifica o valor para o atributo de caminho. Por padrão, o caminho é considerado o "caminho padrão".

#### `maxAge`

Especifica o valor para o atributo max-age. O valor fornecido será convertido em um inteiro.

#### `httpOnly`

Especifica o valor `booleano` para o atributo httponly. Quando verdadeiro, o atributo HttpOnly é definido. Caso contrário, não é.

#### `secure`

Especifica o valor `booleano` para o atributo seguro. Quando verdadeiro, o atributo Seguro é definido. Caso contrário, não é. Por padrão, o atributo Seguro não é definido.

#### `sameSite`

Especifica o booleano ou string para ser o valor do atributo samesite.

- `true` definirá o atributo SameSite como Strict para aplicação estrita do mesmo site.
- `false` não definirá o atributo SameSite.
- `'lax'` definirá o atributo SameSite como Lax para aplicação lax do mesmo site.
- `'none'` definirá o atributo SameSite como None para um cookie cross-site explícito.
- `'strict'` definirá o atributo SameSite como Strict para aplicação estrita do mesmo site.

O mesmo conjunto de opções também pode ser definido em tempo de execução ao definir o cookie. Mesclaremos os valores inline com a configuração padrão.

```ts
response.cookie('user_id', 1, {
  httpOnly: false,
})
```

## Tipos de dados suportados

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

// Objetos de date são convertidos em string ISO
response.cookie('visits', new Date())
```

## Cookies assinados

Por padrão, todos os cookies definidos pelo método `response.cookie` são assinados. Os cookies assinados contêm uma assinatura junto com o valor do cookie para evitar adulteração do cookie.

- A assinatura é computada a partir do valor do cookie e, em caso de adulteração, a assinatura não corresponderá e o AdonisJS ignorará o cookie.
- A assinatura é gerada usando a `appKey` armazenada dentro do arquivo `config/app.ts`.
- Os cookies assinados ainda são legíveis pela decodificação Base64. Você pode usar cookies criptografados se quiser que o valor seja ilegível.

```ts
Route.get('/', async ({ request, response }) => {
  // definir cookie assinado
  response.cookie('user_id', 1)

  // ler cookie assinado
  request.cookie('user_id')
})
```

## Cookies criptografados

Ao contrário dos cookies assinados, o valor do cookie criptografado não pode ser decodificado para texto simples. Você pode usar cookies criptografados para valores que contêm informações confidenciais e não devem ser legíveis por ninguém.

Módulo [Criptografia](./../security/encryption.md).
- Ele usa o `appKey` armazenado dentro do arquivo `config/app.ts` como o segredo de criptografia.

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

## Cookies simples

Os cookies simples mantêm valores codificados em Base64 sem assinatura ou criptografia em vigor. Eles geralmente são úteis quando você deseja acessar o cookie no JavaScript frontend e ler/escrever seu valor.

Você pode definir um cookie simples usando o método `plainCookie`. Por exemplo:

```ts
Route.get('/', async ({ response }) => {
  response.plainCookie('user_id', 1)
})
```

Se você quiser acessar este cookie dentro do JavaScript frontend, certifique-se de desabilitar o sinalizador ``httpOnly`.

```ts
response.plainCookie('user_id', 1, {
  httpOnly: false,
})
```

Você pode ler o valor do cookie dentro do JavaScript usando a propriedade ``document.cookie`. Certifique-se de decodificar em Base64 e analisar o valor em JSON.

::: info NOTA
O exemplo a seguir é uma implementação ingênua para ler o valor do cookie apenas para demonstração.
:::

```js
/**
 * Lendo o valor do cookie
 */
const userIdValue = document.cookie.split('user_id=')[1].split(';')[0]

/**
 * Decodificação do valor em base 64
 */
const base64Decoded = atob(userIdValue)

/**
 * Convertendo a string JSON em um objeto
 */
const jsonParsed = JSON.parse(base64Decoded)
console.log(jsonParsed)
```
