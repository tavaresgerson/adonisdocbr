---
title: Encryption and Hashing
category: security
---

# Criptografia e Hashing

O AdonisJs vem com provedores para *valores de hash* e *dados de criptografia*.

*Valores de hash* são diferentes de *dados de criptografia*, já que valores de hash não podem ser descriptografados depois de criptografados.

## Criptografia de dados

O provedor de criptografia do AdonisJs usa o [módulo de criptografia Node.js](https://nodejs.org/api/crypto.html) para criptografar e descriptografar valores.

::: warning OBSERVAÇÃO:
Sua *appKey* deve ser definida dentro do arquivo `config/app.js` antes que você possa criptografar valores.
:::

#### `encrypt(value)`

```js
const Encryption = use('Encryption')
const encrypted = Encryption.encrypt('hello world')
```

#### `decrypt`

```js
const Encryption = use('Encryption')
const decrypted = Encryption.decrypt('encrypted value')
```

## Valores de hash
O provedor de hash do AdonisJs vem com vários drivers para fazer hash de dados do usuário.

Por padrão, ele usa [bcrypt](https://en.wikipedia.org/wiki/Bcrypt), no entanto, há suporte para Argon por meio do [pacote argon2 npm](https://npm.im/argon2).

::: warning NOTA
Vários drivers são suportados pela versão `@adonisjs/framework` `>=5.0.8`.
:::

### Config
A configuração é definida dentro do arquivo `config/hash.js`:

```js
// .config/hash.js

module.exports = {
  driver: 'bcrypt',
  bcrypt: {
    rounds: 10
  },
  argon: {
    type: 1
  }
}
```

::: warning NOTA
Se estiver usando o driver `argon`, você terá que instalar o pacote [argon2 npm package](https://npm.im/argon2) via npm.
:::

#### `make(value, [config])`
Criar hash de um valor de string simples:

```js
const Hash = use('Hash')
const safePassword = await Hash.make(request.input('password'))
```

Opcionalmente, a configuração inline pode ser passada para substituir os padrões do arquivo de configuração:

```js
const Hash = use('Hash')
const safeExample = await Hash.make('example', config)
```

#### `verify(value, hashedValue)`
Como você não pode descriptografar um hash, você pode verificar a entrada do usuário em relação ao valor com hash anterior.

```js
const Hash = use('Hash')
const isSame = await Hash.verify('plain-value', 'hashed-value')

if (isSame) {
  // ...
}
```
