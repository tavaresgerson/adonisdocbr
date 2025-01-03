# Hashing

O módulo Hash do AdonisJS permite que você faça hash dos valores usando `bcrypt`, `argon2` ou `scrypt` junto com a opção de adicionar um driver de hash personalizado.

Você pode configurar o driver de sua escolha dentro do arquivo `config/hash.ts`.

```ts
import { hashConfig } from '@adonisjs/core/build/config'

export default hashConfig({
  default: Env.get('HASH_DRIVER', 'scrypt'),

  list: {
    scrypt: {
      driver: 'scrypt',
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      saltSize: 16,
      keyLength: 64,
      maxMemory: 32 * 1024 * 1024,
    },
    
    /**
     * Make sure to install the driver from npm
     * ------------------------------------
     * npm i phc-argon2
     * ------------------------------------
     */
    argon: {
      driver: 'argon2',
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    },

    /**
     * Make sure to install the driver from npm
     * ------------------------------------
     * npm i phc-bcrypt
     * ------------------------------------
     */
    bcrypt: {
      driver: 'bcrypt',
      rounds: 10,
    },
  },
})
```

#### Hasher padrão

A propriedade `default` configura o hasher para usar por padrão para valores de hash. Deve ser um dos hashers disponíveis do objeto de lista.

#### Hashers disponíveis
O objeto `list` contém um ou mais hashers disponíveis para serem usados ​​para valores de hash. Um hasher deve usar um dos drivers disponíveis.

[Método Node.js `cryto.scrypt`](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback) para gerar e verificar hashes.
- O hasher `argon` usa o driver `argon2`. Você terá que instalar o seguinte pacote para usar o argon. **Se você não tiver nenhuma preferência forte, recomendamos que use o argon na produção**
  ```bash
   npm i phc-argon2
   ```
- O hasher `bcrypt` usa o driver `bcrypt`. Você terá que instalar o seguinte pacote para usar o bcrypt.
  ```bash
   npm i phc-bcrypt
   ```

## Valores de hash

### `make`

O método `Hash.make` aceita um valor de string para um hash.

```ts
import Hash from '@ioc:Adonis/Core/Hash'
const hashedPassword = await Hash.make(user.password)
```

Na maioria das vezes, você estará fazendo o hash da senha do usuário, então é melhor usar um gancho de modelo para executar o hash.

```ts {11-16}
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public password: string

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
```

### `verify`

Você não pode converter valores com hash de volta para uma string simples, e você só pode verificar se uma determinada string de texto simples corresponde a um determinado hash.

```ts
if (await Hash.verify(hashedValue, plainTextValue)) {
  // verified
}
```

### `needsReHash`

Descubra se um valor com hash anterior precisa de um rehash. Este método retorna true se o fator de trabalho usado pelo hasher mudou desde que a senha foi hash.

O melhor momento para verificar `needsReHash` é geralmente durante o login do usuário.

```ts
if (Hash.needsReHash(user.password)) {
  // Você terá que ajustar o gancho do modelo para não
  // refazer o hash da senha já hash
  user.password = await Hash.make(plainPassword)
}
```

## Formato de string PHC

Nossos drivers retornam a saída de hash pelo [formato de string PHC](https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md). Ele nos permite verificar os hashes em relação à configuração atual de um hasher e decidir se o hash precisa ser refeito ou não.

## Adicionando um driver personalizado

O módulo Hash é extensível e permite que você registre seus próprios drivers personalizados. Cada driver deve implementar a seguinte interface `HashDriverContract`:

```ts
interface HashDriverContract {
  ids?: string[]
  params?: any

  /**
   * Hash de valor de texto simples usando o mapeamento padrão
   */
  make(value: string): Promise<string>

  /**
   * Verifique o hash em relação à configuração atual para descobrir
   * se ele precisa ser refeito ou não
   */
  needsReHash?(hashedValue: string): boolean

  /**
   * Verifique o valor simples em relação ao valor com hash para descobrir se é
   * válido ou não
   */
  verify(hashedValue: string, plainValue: string): Promise<boolean>
}
```

#### `make`

O método `make` é responsável por fazer o hash do valor da string simples.

#### `verify`

O método `verify` é responsável por verificar a string simples em relação a um hash pré-existente.

#### `needsReHash`

O `needsReHash` é opcional. No entanto, ele deve ser implementado se seu algoritmo de hash tiver suporte para ele.

#### `params`/`ids`

As propriedades `params` e `ids` são algo que você precisa ao usar o formato de string PHC. Basta verificar a implementação do driver existente e ler sobre o formato de string PHC para aprender mais sobre ele.

### Estendendo de fora para dentro

Sempre que você estiver estendendo o núcleo do framework. É melhor assumir que você não tem acesso ao código do aplicativo e suas dependências. Em outras palavras, escreva suas extensões como se estivesse escrevendo um pacote de terceiros e use injeção de dependência para depender de outras dependências.

Para fins de demonstração, vamos criar um driver hash fictício:

```sh
mkdir providers/HashDriver
touch providers/HashDriver/index.ts
```

A estrutura do diretório será semelhante à seguinte.

```
providers
└── HashDriver
 └── index.ts
```

Abra o arquivo `HashDriver/index.ts` e cole o seguinte conteúdo dentro dele.

```ts
// providers/HashDriver/index.ts

import { HashDriverContract } from '@ioc:Adonis/Core/Hash'

export class PlainTextDriver implements HashDriverContract {
  public async make(value: string) {
    return value
  }

  public async verify(hashedValue: string, plainValue: string) {
    return hashedValue === plainValue
  }
}
```

Finalmente, abra o arquivo `providers/AppProvider.ts` e adicione o driver personalizado dentro do método `boot`.

```ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const { PlainTextDriver } = await import('./HashDriver')
    const Hash = this.app.container.use('Adonis/Core/Hash')

    Hash.extend('plainText', () => {
      return new PlainTextDriver()
    })
  }
}
```

Voilá! Seu driver `PlainTextDriver` está pronto para ser usado.

### Informando o TypeScript sobre o novo driver
Antes que alguém possa referenciar este driver dentro do arquivo `config/hash.ts`. Você terá que informar o compilador estático do TypeScript sobre sua existência.

Se você estiver criando um pacote, então você pode escrever o seguinte código dentro do arquivo principal do seu pacote, caso contrário você pode escrevê-lo dentro do arquivo `contracts/hash.ts`.

```ts
import { PlainTextDriver } from '../providers/HashDriver'

declare module '@ioc:Adonis/Core/Hash' {
  interface HashDrivers {
    plainText: {
      config: {
        driver: 'plainText',
        // ...resto da configuração
      }
      implementation: PlainTextDriver
    }
  }
}
```

### Atualizando a configuração
Para usar o driver, você terá que definir um mapeamento dentro do arquivo de configuração definindo `driver=plainText`.

```ts
// config/hash.ts

list: {
  myHashDriver: {
    driver: 'plainText',
  },
  // outros hashers
}
```

Agora, você pode usar o mapeamento recém-definido da seguinte forma.

```ts
await Hash.use('myHashDriver').make('foo')
```
