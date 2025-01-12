---
summary: Criptografe e descriptografe valores em seu aplicativo usando o serviço de criptografia.
---

# Criptografia

Usando o serviço de criptografia, você pode criptografar e descriptografar valores em seu aplicativo. A criptografia é baseada no [algoritmo aes-256-cbc](https://www.n-able.com/blog/aes-256-encryption-algorithm), e anexamos um hash de integridade (HMAC) à saída final para evitar adulteração de valor.

O serviço de `criptografia` usa a `appKey` armazenada dentro do arquivo `config/app.ts` como o segredo para criptografar os valores.

[variáveis ​​de ambiente](../getting_started/environment_variables.md). Qualquer pessoa com acesso a essa chave pode descriptografar valores.

- A chave deve ter pelo menos 16 caracteres e ter um valor aleatório criptograficamente seguro. Você pode gerar a chave usando o comando `node ace generate:key`.

- Se você decidir alterar a chave mais tarde, não poderá descriptografar os valores existentes. Isso resultará na invalidação de cookies e sessões de usuário existentes.

## Criptografando valores

Você pode criptografar valores usando o método `encryption.encrypt`. O método aceita o valor a ser criptografado e uma duração de tempo opcional após a qual considerar o valor expirado.

```ts
import encryption from '@adonisjs/core/services/encryption'

const encrypted = encryption.encrypt('hello world')
```

Defina uma duração de tempo após a qual o valor será considerado expirado e não poderá ser descriptografado.

```ts
const encrypted = encryption.encrypt('hello world', '2 hours')
```

## Descriptografando valores

Valores criptografados podem ser descriptografados usando o método `encryption.decrypt`. O método aceita o valor criptografado como o primeiro argumento.

```ts
import encryption from '@adonisjs/core/services/encryption'

encryption.decrypt(encryptedValue)
```

## Tipos de dados suportados

O valor dado ao método `encrypt` é serializado para uma string usando `JSON.stringify`. Portanto, você pode usar os seguintes tipos de dados JavaScript.

- string
- number
- bigInt
- boolean
- null
- object
- array

```ts
import encryption from '@adonisjs/core/services/encryption'

// Object
encryption.encrypt({
  id: 1,
  fullName: 'virk',
})

// Array
encryption.encrypt([1, 2, 3, 4])

// Boolean
encryption.encrypt(true)

// Number
encryption.encrypt(10)

// BigInt
encryption.encrypt(BigInt(10))

// Data objects are converted to ISO string
encryption.encrypt(new Date())
```

## Usando chaves secretas personalizadas

Você pode criar uma [instância da classe Encryption](https://github.com/adonisjs/encryption/blob/main/src/encryption.ts) diretamente para usar chaves secretas personalizadas.

```ts
import { Encryption } from '@adonisjs/core/encryption'

const encryption = new Encryption({
  secret: 'alongrandomsecretkey',
})
```
