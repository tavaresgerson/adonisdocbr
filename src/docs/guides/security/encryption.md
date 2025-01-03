# Criptografia

Você pode usar o módulo de criptografia AdonisJS para criptografar e descriptografar valores em seu aplicativo.

```ts
import Encryption from '@ioc:Adonis/Core/Encryption'

const encrypted = Encryption.encrypt('hello-world')
```

A criptografia é baseada no algoritmo `aes-256-cbc` e usa o `appKey` salvo dentro do arquivo `config/app.ts` como o segredo para criptografia.

## Criptografando/descriptografando valores

O módulo de criptografia também gera um [iv](https://en.wikipedia.org/wiki/Initialization_vector) exclusivo para cada chamada de criptografia. Portanto, criptografar o mesmo valor duas vezes resultará em uma saída visual diferente.

#### `encrypt`

O método `Encryption.encrypt` criptografa um determinado valor.

```ts
Encryption.encrypt('hello-world')
```

Você também pode definir opcionalmente uma data de expiração. Após o período de tempo fornecido, a descriptografia falhará.

```ts
Encryption.encrypt('hello-world', '2 hours')
```

Finalmente, você também pode definir uma finalidade para a criptografia. Isso geralmente é útil quando você está criptografando o valor para uma tarefa ou recurso específico.

Por exemplo, você quer gerar um link criptografado para compartilhar uma postagem e então quer ter certeza de que o link só funciona se o ID da postagem for o mesmo que você gerou o link.

```ts
const key = Encryption.encrypt(`post-${post.id}`, '30mins', String(post.id))

return `/posts/${post.id}?key=${key}`
```

Durante a descriptografia, você pode verificar se o ID da postagem corresponde ou não da seguinte forma.

```ts
Encryption.decrypt(key, String(params.id))
```

#### `decrypt`

O método `Encryption.decrypt` descriptografa o valor criptografado. Retorna `null` quando não é possível descriptografar o valor.

```ts
Encryption.decrypt(value)
Encryption.decrypt(value, purpose)
```

## Tipos de dados suportados

Você pode criptografar os seguintes tipos de dados.

```ts
// Object
Encryption.encrypt({
  id: 1,
  fullName: 'virk',
})

// Array
Encryption.encrypt([1, 2, 3, 4])

// Boolean
Encryption.encrypt(true)

// Number
Encryption.encrypt(10)

// Date objects are converted to ISO string
Encryption.encrypt(new Date())
```

## Usando uma chave secreta personalizada

O módulo Encryption usa a `appKey` definida dentro do arquivo `config/app.ts` como o segredo para criptografar valores. No entanto, você também pode criar uma instância filha com uma chave secreta personalizada.

```ts
const userEncryptor = Encryption.child({
  secret: user.secret,
})

userEncryptor.encrypt('hello-world')
```
