# Criptografia & Hashing

AdonisJS vem com alguns provedores para criptografar dados e valores de hash. Os valores de hash são diferentes da criptografia, pois os valores de hash não podem ser descriptografados uma vez que eles foram criptografados, o que não acontece com a criptografia.

## Configuração
Para usar o uso de criptografia ou hash, você deve configurar seus provedores dentro do arquivo `bootstrap/app.js`.

```js
// bootstrap/app.js

const providers = [
  // ...
  'adonis-framework/providers/EncryptionProvider',
  'adonis-framework/providers/HashProvider'
  // ...
]
```

Além disso, é recomendado configurar aliases para ambos dentro do mesmo arquivo.

```js
const aliases = {
  // ...
  Encryption : 'Adonis/Src/Encryption',
  Hash: 'Adonis/Src/Hash'
  // ...
}
```

## Criptografando dados

O provedor de criptografia AdonisJs utiliza o módulo [Node.js crypto](https://nodejs.org/api/crypto.html) para criptografar e descriptografar valores. Por padrão, todos os valores são criptografados com um SALT usando o algoritmo *aes-256-cbc*.

> NOTE
> Certifique-se de que *appKey* dentro de `config/app.js` esteja definido antes de poder criptografar valores.

#### encrypt(valor)
```js
const Encryption = use('Encryption')
const encrypted = Encryption.encrypt('hello world')
```

#### Decifrado
```js
const Encryption = use('Encryption')
const decrypted = Encryption.decrypt('encrypted value')
```

## Hashing Valores
O provedor de senha AdonisJs utiliza o algoritmo [bcrypt](https://pt.wikipedia.org/wiki/Bcrypt) para criptografar valores, que é um algoritmo lento para criptografar/verificar um valor.

O bcrypt é comumente usado para criptografar senhas e como ele é um algoritmo lento, torna-se caro (ou impossível) para os atacantes tentar quebrar uma senha. A lentidão do algoritmo se baseia no número de *iterações* a serem executadas antes de retornar o valor criptografado.

> NOTE
> Por padrão, o provedor de hash fará uso de 10 rodadas que levarão aproximadamente 1500 milissegundos para hashear o valor.

#### make(valor, [redondos=10])
```js
const Hash = use('Hash')
const safePassword = yield Hash.make(request.input('password'))

// or
const safePassword = yield Hash.make(request.input('password'), 20)
```

#### verify(value, hashedValue)
Como você não pode descriptografar um hash, você pode verificar a entrada do usuário contra o valor previamente criptografado.

```js
const Hash = use('Hash')
const isSame = yield Hash.verify('plain-value', 'hashed-value')

if (isSame) {
  // ...
}
```
