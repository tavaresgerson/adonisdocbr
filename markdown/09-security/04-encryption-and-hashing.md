# Encryption & Hashing

AdonisJs ships with a couple of providers for hashing values and encrypting data. Hashing values are different from encryption since hashed values cannot be decrypted once encrypted that is not the case with encryption.

## Setup
To make use of Encryption or Hashing, you must set up their providers inside the `bootstrap/app.js` file.

```js
// bootstrap/app.js
const providers = [
  // ...
  'adonis-framework/providers/EncryptionProvider',
  'adonis-framework/providers/HashProvider'
  // ...
]
```

Also, it is recommended to setup aliases for both inside the same file.

```js
const aliases = {
  // ...
  Encryption : 'Adonis/Src/Encryption',
  Hash: 'Adonis/Src/Hash'
  // ...
}
```

## Encrypting Data

AdonisJs encryption provider makes use of [Node.js crypto module](https://nodejs.org/api/crypto.html) to encrypt and decrypt values. By default all values are encrypted with a SALT using *aes-256-cbc* algorithm.

> NOTE: Make sure that *appKey* inside `config/app.js` is defined before you can encrypt values.

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

## Hashing Values
AdonisJs hash provider makes use of [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) to hash values which is a slow algorithm to hash/verify a value.

Bcrypt is commonly used to hash passwords, and since it is a slow algorithm, it makes it expensive(if not impossible) for attackers to crack a password. The slowness of the algorithm is based upon the number of *rounds* to be executed before returning the hashed value.

> NOTE: By default, the hash provider will make use of 10 rounds which will take approximately 1500ms to hash the value.

#### make(value, [rounds=10])
```js
const Hash = use('Hash')
const safePassword = yield Hash.make(request.input('password'))

// or
const safePassword = yield Hash.make(request.input('password'), 20)
```

#### verify(value, hashedValue)
Since you cannot decrypt a hash, you can verify the user input against the previously hashed value.

```js
const Hash = use('Hash')
const isSame = yield Hash.verify('plain-value', 'hashed-value')

if (isSame) {
  // ...
}
```
