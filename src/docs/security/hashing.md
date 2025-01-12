---
resumo: Aprenda como fazer hash de valores usando o serviço de hash AdonisJS.
---

# Hashing

Você pode fazer hash de senhas de usuários em seu aplicativo usando o serviço `hash`. O AdonisJS tem suporte de primeira classe para algoritmos de hash `bcrypt`, `scrypt` e `argon2` e a capacidade de [adicionar drivers personalizados](#creating-a-custom-hash-driver).

Os valores com hash são armazenados no [formato de string PHC](https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md). O PHC é uma especificação de codificação determinística para formatar hashes.

## Uso

O método `hash.make` aceita um valor de string simples (a entrada de senha do usuário) e retorna uma saída de hash.

```ts
import hash from '@adonisjs/core/services/hash'

const hash = await hash.make('user_password')
// $scrypt$n=16384,r=8,p=1$iILKD1gVSx6bqualYqyLBQ$DNzIISdmTQS6sFdQ1tJ3UCZ7Uun4uGHNjj0x8FHOqB0pf2LYsu9Xaj5MFhHg21qBz8l5q/oxpeV+ZkgTAj+OzQ
```

Você [não pode converter um valor de hash em texto simples](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#hashing-vs-encryption), o hash é um processo unidirecional e não há como recuperar o valor original após um hash ter sido gerado.

No entanto, o hash fornece uma maneira de verificar se um determinado valor de texto simples corresponde a um hash existente, e você pode executar essa verificação usando o método `hash.verify`.

```ts
import hash from '@adonisjs/core/services/hash'

if (await hash.verify(existingHash, plainTextValue)) {
  // password is correct
}
```

## Configuração

A configuração para hash é armazenada dentro do arquivo `config/hash.ts`. O driver padrão é definido como `scrypt` porque o scrypt usa o módulo de criptografia nativo do Node.js e não requer nenhum pacote de terceiros.

```ts
// title: config/hash.ts
import { defineConfig, drivers } from '@adonisjs/core/hash'

export default defineConfig({
  default: 'scrypt',

  list: {
    scrypt: drivers.scrypt(),

    /**
     * Uncomment when using argon2
       argon: drivers.argon2(),
     */

    /**
     * Uncomment when using bcrypt
       bcrypt: drivers.bcrypt(),
     */
  }
})
```

### Argon

Argon é o algoritmo de hash recomendado para fazer hash de senhas de usuários. Para usar o Argon com o serviço de hash AdonisJS, você deve instalar o pacote npm [argon2](https://npmjs.com/argon2).

```sh
npm i argon2
```

Configuramos o driver Argon com padrões seguros, mas sinta-se à vontade para ajustar as opções de configuração de acordo com os requisitos do seu aplicativo. A seguir está a lista de opções disponíveis.

```ts
export default defineConfig({
  // highlight-start
  // Make sure to update the default driver to argon
  default: 'argon',
  // highlight-end

  list: {
    argon: drivers.argon2({
      version: 0x13, // hex code for 19
      variant: 'id',
      iterations: 3,
      memory: 65536,
      parallelism: 4,
      saltSize: 16,
      hashLength: 32,
    })
  }
})
```

### `variant`

A variante de hash Argon a ser usada.

- `d` é mais rápido e altamente resistente a ataques de GPU, o que é útil para criptomoeda
- `i` é mais lento e resistente a ataques de tradeoff, o que é preferível para hash de senha e derivação de chave.
- `id` *(default)* é uma combinação híbrida dos itens acima, resistente a ataques de GPU e tradeoff.

### `version`

A versão do Argon a ser usada. As opções disponíveis são `0x10 (1.0)` e `0x13 (1.3)`. A versão mais recente deve ser usada por padrão.

### `iterations`

A contagem de `iterations` aumenta a força do hash, mas leva mais tempo para calcular.

O valor padrão é `3`.

### `memory`

A quantidade de memória a ser usada para fazer o hash do valor. Cada thread paralela terá um pool de memória desse tamanho.

O valor padrão é `65536 (KiB)`.

### `parallelism`

O número de threads a serem usadas para calcular o hash.

O valor padrão é `4`.

### `saltSize`

O comprimento do salt (em bytes). O Argon gera um salt aleatório criptograficamente seguro desse tamanho ao calcular o hash.

O valor padrão e recomendado para hash de senha é `16`.

### `hashLength`

Comprimento máximo para o hash bruto (em bytes). O valor de saída será maior que o comprimento do hash mencionado porque a saída do hash bruto é codificada para o formato PHC.

O valor padrão é `32`

### Bcrypt

Para usar o Bcrypt com o serviço de hash AdonisJS, você deve instalar o pacote npm [bcrypt](http://npmjs.com/bcrypt).

```sh
npm i bcrypt
```

A seguir está a lista de opções de configuração disponíveis.

```ts
export default defineConfig({
  // highlight-start
  // Make sure to update the default driver to bcrypt
  default: 'bcrypt',
  // highlight-end

  list: {
    bcrypt: drivers.bcrypt({
      rounds: 10,
      saltSize: 16,
      version: '2b'
    })
  }
})
```

### `rounds`

O custo para calcular o hash. Recomendamos ler a seção [Uma nota sobre rounds](https://github.com/kelektiv/node.bcrypt.js#a-note-on-rounds) da documentação do Bcrypt para saber como o valor `rounds` tem impacto no tempo que leva para calcular o hash.

O valor padrão é `10`.

### `saltSize`

O comprimento do salt (em bytes). Ao calcular o hash, geramos um salt aleatório criptograficamente seguro deste tamanho.

O valor padrão é `16`.

### `version`

A versão do algoritmo de hash. Os valores suportados são `2a` e `2b`. Usar a versão mais recente, ou seja, `2b` é recomendado.

### Scrypt

O driver scrypt usa o módulo crypto do Node.js para calcular o hash da senha. As opções de configuração são as mesmas aceitas pelo [método `scrypt` do Node.js](https://nodejs.org/dist/latest-v19.x/docs/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback).

```ts
export default defineConfig({
  // highlight-start
  // Make sure to update the default driver to scrypt
  default: 'scrypt',
  // highlight-end

  list: {
    scrypt: drivers.scrypt({
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      saltSize: 16,
      maxMemory: 33554432,
      keyLength: 64
    })
  }
})
```

## Usando ganchos de modelo para fazer hash de senha

Como você usará o serviço `hash` para fazer hash de senhas de usuários, pode ser útil colocar a lógica dentro do gancho de modelo `beforeSave`.

:::note
Se você estiver usando o módulo `@adonisjs/auth`, o hash de senhas dentro do seu modelo é desnecessário. O `AuthFinder` manipula automaticamente o hash de senha, garantindo que suas credenciais de usuário sejam processadas com segurança. Saiba mais sobre esse processo [aqui](../authentication/verifying_user_credentials.md#hashing-user-password).
:::

```ts
import { BaseModel, beforeSave } from '@adonisjs/lucid'
import hash from '@adonisjs/core/services/hash'

export default class User extends BaseModel {
  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}
```

## Alternando entre drivers

Se seu aplicativo usa vários drivers de hash, você pode alternar entre eles usando o método `hash.use`.

O método `hash.use` aceita o nome de mapeamento do arquivo de configuração e retorna uma instância do driver correspondente.

```ts
import hash from '@adonisjs/core/services/hash'

// uses "list.scrypt" mapping from the config file
await hash.use('scrypt').make('secret')

// uses "list.bcrypt" mapping from the config file
await hash.use('bcrypt').make('secret')

// uses "list.argon" mapping from the config file
await hash.use('argon').make('secret')
```

## Verificando se uma senha precisa ser refeita

As opções de configuração mais recentes são recomendadas para manter as senhas seguras, especialmente quando uma vulnerabilidade é relatada com uma versão mais antiga do algoritmo de hash.

Depois de atualizar a configuração com as opções mais recentes, você pode usar o método `hash.needsReHash` para verificar se um hash de senha usa opções antigas e executar um re-hash.

A verificação deve ser realizada durante o login do usuário porque esse é o único momento em que você pode acessar a senha em texto simples.

```ts
import hash from '@adonisjs/core/services/hash'

if (await hash.needsReHash(user.password)) {
  user.password = await hash.make(plainTextPassword)
  await user.save()
}
```

Você pode atribuir um valor de texto simples para `user.password` se usar ganchos de modelo para calcular o hash.

```ts
if (await hash.needsReHash(user.password)) {
  // Let the model hook rehash the password
  user.password = plainTextPassword
  await user.save()
}
```

## Falsificando serviço de hash durante testes

Fazer hash de um valor geralmente é um processo lento e tornará seus testes lentos. Portanto, você pode considerar falsificar o serviço de hash usando o método `hash.fake` para desabilitar o hash de senha.

Criamos 20 usuários usando `UserFactory` no exemplo a seguir. Como você está usando um gancho de modelo para fazer hash de senhas, pode levar de 5 a 7 segundos (dependendo da configuração).

```ts
import hash from '@adonisjs/core/services/hash'

test('get users list', async ({ client }) => {
  await UserFactory().createMany(20)    
  const response = await client.get('users')
})
```

No entanto, depois que você falsificar o serviço de hash, o mesmo teste será executado em ordem de magnitude mais rápido.

```ts
import hash from '@adonisjs/core/services/hash'

test('get users list', async ({ client }) => {
  // highlight-start
  hash.fake()
  // highlight-end
  
  await UserFactory().createMany(20)    
  const response = await client.get('users')

  // highlight-start
  hash.restore()
  // highlight-end
})
```

## Criando um driver de hash personalizado
Um driver de hash deve implementar a interface [HashDriverContract](https://github.com/adonisjs/hash/blob/main/src/types.ts#L13). Além disso, os drivers Hash oficiais usam o [formato PHC](https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md) para serializar a saída do hash para armazenamento. Você pode verificar a implementação do driver existente para ver como eles usam o [formatador PHC](https://github.com/adonisjs/hash/blob/main/src/drivers/bcrypt.ts) para criar e verificar hashes.

```ts
import {
  HashDriverContract,
  ManagerDriverFactory
} from '@adonisjs/core/types/hash'

/**
 * Config accepted by the hash driver
 */
export type PbkdfConfig = {
}

/**
 * Driver implementation
 */
export class Pbkdf2Driver implements HashDriverContract {
  constructor(public config: PbkdfConfig) {
  }

  /**
   * Check if the hash value is formatted as per
   * the hashing algorithm.
   */
  isValidHash(value: string): boolean {
  }

  /**
   * Convert raw value to Hash
   */
  async make(value: string): Promise<string> {
  }

  /**
   * Verify if the plain value matches the provided
   * hash
   */
  async verify(
    hashedValue: string,
    plainValue: string
  ): Promise<boolean> {
  }

  /**
   * Check if the hash needs to be re-hashed because
   * the config parameters have changed
   */
  needsReHash(value: string): boolean {
  }
}

/**
 * Factory function to reference the driver
 * inside the config file.
 */
export function pbkdf2Driver (config: PbkdfConfig): ManagerDriverFactory {
  return () => {
    return new Pbkdf2Driver(config)
  }
}
```

No exemplo de código acima, exportamos os seguintes valores.

- `PbkdfConfig`: Tipo TypeScript para a configuração que você deseja aceitar.

- `Pbkdf2Driver`: Implementação do driver. Ele deve aderir à interface `HashDriverContract`.

- `pbkdf2Driver`: Finalmente, uma função de fábrica para criar preguiçosamente uma instância do driver.

### Usando o driver

Depois que a implementação for concluída, você pode referenciar o driver dentro do arquivo de configuração usando a função de fábrica `pbkdf2Driver`.

```ts
// title: config/hash.ts
import { defineConfig } from '@adonisjs/core/hash'
import { pbkdf2Driver } from 'my-custom-package'

export default defineConfig({
  list: {
    pbkdf2: pbkdf2Driver({
      // config goes here
    }),
  }
})
```
