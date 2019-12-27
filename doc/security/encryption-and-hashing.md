# Encriptação e Hashing

O AdonisJs é fornecido com providers para valores de hash e criptografia de dados .

Os valores de hash são diferentes dos dados criptografados, pois os valores de hash não podem ser 
descriptografados depois de criptografados.

## Criptografando dados
O provedor de criptografia AdonisJs usa o [módulo de criptografia do Node.js](https://nodejs.org/api/crypto.html). para criptografar e descriptografar valores.

> Seu appKey deve ser definido dentro do arquivo `config/app.js` antes que você possa criptografar valores.

### encrypt(valor)
``` js
const Encryption = use('Encryption')
const encrypted = Encryption.encrypt('hello world')
```

### decrypt(valor)
``` js
const Encryption = use('Encryption')
const decrypted = Encryption.decrypt('encrypted value')
```

### Valores hash
O provedor de hash AdonisJs vem com vários drivers para hash de dados do usuário.

Por padrão, ele usa [bcrypt](https://en.wikipedia.org/wiki/Bcrypt), no entanto, há suporte ao Argon por meio do pacote [argon2](https://npm.im/argon2) disponível
no npm.

> Vários drivers são suportados pelo `@adonisjs/framework` versão `>=5.0.8`.

### Config
A configuração é definida dentro do arquivo `config/hash.js`:

``` js
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

> Se estiver usando o driver `argon`, você deverá instalar o pacote [argon2 npm](https://npm.im/argon2) via npm.

#### make(valor, [config])
Hash um valor de cadeia simples:

``` js
const Hash = use('Hash')
const safePassword = await Hash.make(request.input('password'))
```

Opcionalmente, a configuração em linha pode ser passada para substituir os padrões do arquivo de configuração:

``` js
const Hash = use('Hash')
const safeExample = await Hash.make('example', config)
```

#### verify(valor, hashedValue)
Como você não pode descriptografar um hash, pode verificar a entrada do usuário com relação ao valor do hash anteriormente.

``` js
const Hash = use('Hash')
const isSame = await Hash.verify('plain-value', 'hashed-value')

if (isSame) {
  // ...
}
```
