# URLs assinadas

URLs assinadas fornecem uma maneira bacana de gerar URLs com uma assinatura hash anexada a elas. O hash garante que a URL gerada não seja modificada ou adulterada.

::: info NOTA
A função `makeSignedUrl` aceita o mesmo conjunto de argumentos aceitos pelo método [Route.makeUrl](../http/routing.md#url-generation). Portanto, certifique-se de ler a documentação para `Route.makeUrl` também.
:::

Por exemplo:

```ts
Route.makeSignedUrl('verifyEmail', {
  email: 'foo@bar.com',
})

// /verify/foo@bar.com?signature=eyJtZXNzYWdlIjoiL3ZlcmlmeS9mb29AYmFyLmNvbSJ9.Xu-a0xu_E4O0sJxeAhyhUU5TVMPtxHGNz4bY9skxqRo
```

A assinatura anexada à URL é gerada a partir da sequência de caracteres URI completa. Alterar qualquer parte da URL resultará em uma assinatura inválida.

## Verificando assinatura

A rota para a qual você gerou a URL assinada pode verificar a assinatura usando o método `request.hasValidSignature()`.

```ts
Route.get('/verify/:email', async ({ request }) => {
  if (request.hasValidSignature()) {
    return 'Marking email as verified'
  }

  return 'Signature is missing or URL was tampered.'
}).as('verifyEmail')
```

## URLs assinadas expirando

Por padrão, as URLs assinadas vivem para sempre. No entanto, você pode adicionar expiração a elas no momento da geração de uma.

```ts
Route.makeSignedUrl(
  'verifyEmail',
  {
    email: 'foo@bar.com',
  },
  {
    expiresIn: '30m',
  }
)
```

## Usando o construtor de URL

Você também pode usar o construtor de URL para gerar URLs assinadas.

```ts
Route.builder()
  .params({ email: 'foo@bar.com' })
  .makeSigned('verifyEmail', { expiresIn: '30m' })
```
