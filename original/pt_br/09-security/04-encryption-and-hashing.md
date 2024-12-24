# Criptografia e Hashing

O AdonisJs vem com alguns provedores para valores de hash e criptografia de dados. Valores de hash são diferentes de criptografia, pois valores de hash não podem ser descriptografados depois de criptografados, o que não é o caso da criptografia.

## Configuração
Para usar Criptografia ou Hashing, você deve configurar seus provedores dentro do arquivo `bootstrap/app.js`.

```js
// bootstrap/app.js
const providers = [
  // ...
  'adonis-framework/providers/EncryptionProvider',
  'adonis-framework/providers/HashProvider'
  // ...
]
```

Além disso, é recomendável configurar aliases para ambos dentro do mesmo arquivo.

```js
const aliases = {
  // ...
  Encryption : 'Adonis/Src/Encryption',
  Hash: 'Adonis/Src/Hash'
  // ...
}
```

## Criptografando Dados

O provedor de criptografia AdonisJs usa o [módulo de criptografia Node.js](https://nodejs.org/api/crypto.html) para criptografar e descriptografar valores. Por padrão, todos os valores são criptografados com um SALT usando o algoritmo *aes-256-cbc*.

> OBSERVAÇÃO: Certifique-se de que *appKey* dentro de `config/app.js` esteja definido antes de criptografar valores.

#### encrypt(value)
```js
const Encryption = use('Encryption')
const encrypted = Encryption.encrypt('hello world')
```

#### decrypted
```js
const Encryption = use('Encryption')
const decrypted = Encryption.decrypt('encrypted value')
```

## Valores de hash
O provedor de hash AdonisJs usa [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) para fazer hash de valores, que é um algoritmo lento para fazer hash/verificar um valor.

O Bcrypt é comumente usado para fazer hash de senhas e, como é um algoritmo lento, torna caro (se não impossível) para invasores quebrar uma senha. A lentidão do algoritmo é baseada no número de *rodadas* a serem executadas antes de retornar o valor com hash.

> OBSERVAÇÃO: Por padrão, o provedor de hash usará 10 rodadas, o que levará aproximadamente 1500 ms para fazer hash do valor.

#### make(value, [rounds=10])
```js
const Hash = use('Hash')
const safePassword = yield Hash.make(request.input('password'))

// or
const safePassword = yield Hash.make(request.input('password'), 20)
```

#### verify(value, hashValue)
Como você não pode descriptografar um hash, você pode verificar a entrada do usuário em relação ao valor previamente hash.

```js
const Hash = use('Hash')
const isSame = yield Hash.verify('plain-value', 'hashed-value')

if (isSame) {
  // ...
}
```
