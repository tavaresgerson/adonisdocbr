# Provedor de usuário personalizado

Os provedores de usuário são usados ​​para procurar um usuário para autenticação. O módulo auth é fornecido com um [provedor de banco de dados](https://github.com/adonisjs/auth/blob/develop/src/UserProviders/Database/index.ts) e um [provedor Lucid](https://github.com/adonisjs/auth/blob/develop/src/UserProviders/Lucid/index.ts) para procurar usuários de um banco de dados SQL usando o Lucid ORM.

Você também pode estender o módulo Auth e adicionar provedores de usuário personalizados se quiser procurar usuários de uma fonte de dados diferente. Neste guia, passaremos pelo processo de adicionar um provedor de usuário personalizado.

::: info NOTA
Aqui está um [projeto de exemplo](https://github.com/adonisjs-community/auth-mongoose-provider) usando o mongoose para procurar usuários de um banco de dados MongoDB. Você pode usá-lo como inspiração para criar seu próprio provedor.
:::

## Estendendo de fora para dentro
Sempre que você estiver estendendo o núcleo do framework. É melhor assumir que você não tem acesso ao código do aplicativo e suas dependências. Em outras palavras, escreva suas extensões como se estivesse escrevendo um pacote de terceiros e use injeção de dependência para depender de outras dependências.

Vamos começar criando um provedor de usuário que depende de um cliente MongoDB para procurar os usuários do banco de dados. **Os exemplos a seguir usam código fictício para as consultas do MongoDB, e você deve substituí-los por sua própria implementação**.

```sh
mkdir providers/MongoDbAuthProvider
touch providers/MongoDbAuthProvider/index.ts
```

A estrutura do diretório será semelhante à seguinte.

```
providers
└── MongoDbAuthProvider
    └── index.ts
```

Abra o arquivo `MongoDbAuthProvider/index.ts` recém-criado e cole o seguinte código dentro dele.

```ts
// providers/MongoDbAuthProvider/index.ts

import type { HashContract } from '@ioc:Adonis/Core/Hash'
import type {
    UserProviderContract,
    ProviderUserContract
} from '@ioc:Adonis/Addons/Auth'

/**
 * Forma do objeto do usuário retornado pela classe "MongoDbAuthProvider"
 * Sinta-se à vontade para alterar as propriedades como quiser
 */
export type User = {
  id: string
  email: string
  password: string
  rememberMeToken: string | null
}

/**
 * A forma de configuração aceita pelo MongoDbAuthProvider.
 * No mínimo, ele precisa de uma propriedade de driver
 */
export type MongoDbAuthProviderConfig = {
  driver: 'mongo'
}

/**
 * O usuário provedor funciona como uma ponte entre seu provedor de usuário e
 * o módulo de autenticação do AdonisJS.
 */
class ProviderUser implements ProviderUserContract<User> {
  constructor(public user: User | null, private hash: HashContract) {}

  public getId() {
    return this.user ? this.user.id : null
  }

  public getRememberMeToken() {
    return this.user ? this.user.rememberMeToken : null
  }

  public setRememberMeToken(token: string) {
    if (!this.user) {
      return
    }
    this.user.rememberMeToken = token
  }

  public async verifyPassword(plainPassword: string) {
    if (!this.user) {
      throw new Error('Cannot verify password for non-existing user')
    }

    return this.hash.verify(this.user.password, plainPassword)
  }
}

/**
 * A implementação do provedor de usuário para procurar um usuário para diferentes
 * operações
 */
export class MongoDbAuthProvider implements UserProviderContract<User> {
  constructor(
    public config: MongoDbAuthProviderConfig,
    private hash: HashContract
  ) {}

  public async getUserFor(user: User | null) {
    return new ProviderUser(user, this.hash)
  }

  public async updateRememberMeToken(user: ProviderUser) {
    await mongoDbClient.updateOne(
      { _id: user.getId() },
      { rememberMeToken: user.getRememberMeToken() }
    )
  }

  public async findById(id: string | number) {
    const user = await mongoDbClient.findById(id)
    return this.getUserFor(user || null)
  }

  public async findByUid(uidValue: string) {
    const user = await mongoDbClient.findOne().where('email').equals(uidValue)
    return this.getUserFor(user || null)
  }

  public async findByRememberMeToken(userId: string | number, token: string) {
    const user = await mongoDbClient
      .findOne()
      .where('_id').equals(userId)
      .where('rememberMeToken').equals(token)

    return this.getUserFor(user || null)
  }
}
```

É muito código, então vamos dividi-lo e entender o propósito de cada classe e seus métodos.

### Tipo de usuário
O bloco `export type User` define o formato do usuário que seu provedor retornará. Se estiver usando um ORM, você pode inferir o tipo User de algum modelo, mas o objetivo principal é ter uma representação predefinida de um usuário.

```ts
export type User = {
  id: string
  email: string
  password: string
  rememberMeToken: string | null
}
```

### Configuração do provedor MongoDb
O tipo `MongoDbAuthProviderConfig` define o formato da configuração aceita pelo seu provedor. Ele deve ter pelo menos a propriedade `driver` refletindo o nome do driver que você deseja registrar com o módulo auth.

```ts
export type MongoDbAuthProviderConfig = {
  driver: 'mongo'
}
```

### Classe ProviderUser
A classe `ProviderUser` é uma ponte entre seu **UserProvider** e o módulo de autenticação do AdonisJS. O módulo de autenticação não conhece as propriedades que existem no objeto de usuário que você buscou de uma fonte de dados e, portanto, precisa de alguma forma de **procurar o id** ou **verificar a senha do usuário**.

É aqui que a classe `ProviderUser` entra em cena. Ela deve implementar a interface [ProviderUserContract](https://github.com/adonisjs/auth/blob/develop/adonis-typings/auth.ts#L52).

Também aceitamos o módulo `hash` como um argumento construtor para verificar as senhas do usuário usando o [módulo de hash do AdonisJS](/docs/security/hashing.md).

```ts
class ProviderUser implements ProviderUserContract<User> {
  constructor(public user: User | null, private hash: HashContract) {}

  public getId() {
    return this.user ? this.user.id : null
  }

  public getRememberMeToken() {
    return this.user ? this.user.rememberMeToken : null
  }

  public setRememberMeToken(token: string) {
    if (!this.user) {
      return
    }
    this.user.rememberMeToken = token
  }

  public async verifyPassword(plainPassword: string) {
    if (!this.user) {
      throw new Error('Cannot verify password for non-existing user')
    }

    return this.hash.verify(this.user.password, plainPassword)
  }
}
```

#### `getId`
Retorna o valor de uma propriedade que identifica exclusivamente o usuário.

#### `getRememberMeToken`
Retorna o valor do token de lembrar-me. Deve ser uma string ou `null` quando nenhum token de lembrar-me foi gerado.

#### `setRememberMeToken`
Obtém a propriedade do token de lembrar-me no objeto do usuário. Observe; você não persiste o token de lembrar-me dentro deste método. Você apenas atualiza a propriedade.

O token é persistido pelo `updateRememberMeToken` na classe `UserProvider`.

#### `verifyPassword`
Verifica a senha do usuário. Este método recebe a senha em texto simples do módulo auth e deve retornar `true` se a senha corresponder ou `false` se a senha estiver incorreta.

### Classe UserProvider
A classe `UserProvider` é usada para procurar um usuário ou persistir o token de lembrar-me para um determinado usuário. Esta é a classe que você registrará mais tarde com o módulo de autenticação do AdonisJS.

O `UserProvider` deve implementar a interface [UserProviderContract](https://github.com/adonisjs/auth/blob/develop/adonis-typings/auth.ts#L63).

```ts
export class MongoDbAuthProvider implements UserProviderContract<User> {
  constructor(
    public config: MongoDbAuthProviderConfig,
    private hash: HashContract
  ) {}

  public async getUserFor(user: User | null) {
    return new ProviderUser(user, this.hash)
  }

  public async updateRememberMeToken(user: ProviderUser) {
    await mongoDbClient.updateOne(
      { _id: user.getId() },
      { rememberMeToken: user.getRememberMeToken() }
    )
  }

  public async findById(id: string | number) {
    const user = await mongoDbClient.findById(id)
    return this.getUserFor(user || null)
  }

  public async findByUid(uidValue: string) {
    const user = await mongoDbClient.findOne().where('email').equals(uidValue)
    return this.getUserFor(user || null)
  }

  public async findByRememberMeToken(userId: string | number, token: string) {
    const user = await mongoDbClient
      .findOne()
      .where('_id').equals(userId)
      .where('rememberMeToken').equals(token)

    return this.getUserFor(user || null)
  }
}
```

#### `getUserFor`
Retorna uma instância [ProviderUser](#provideruser-class) para o objeto de usuário que você procura em uma fonte de dados.

#### `updateRememberMeToken`
Atualiza a fonte de dados com o novo token de lembrar-me. Este método recebe uma instância da classe `ProviderUser` com a propriedade de atualização `rememberMeToken`.

#### `findById`
Encontre um usuário pelo seu id exclusivo. Este método deve retornar uma instância da classe [ProviderUser](#provideruser-class).

#### `findByUid`
Encontre um usuário para login usando seu endereço de e-mail ou nome de usuário ou qualquer outra propriedade aplicável à sua fonte de dados.

Por exemplo, o provedor Lucid [depende da configuração](https://github.com/adonisjs/auth/blob/develop/src/UserProviders/Lucid/index.ts#L160-L162) para procurar um usuário pelo uid.

Este método deve retornar uma instância da classe [ProviderUser](#provideruser-class).

#### `findByRememberMeToken`
Encontre um usuário pelo token "lembre-se de mim". O método recebe o id do usuário e o token "lembre-se de mim".

Este método deve retornar uma instância da classe [ProviderUser](#provideruser-class).

## Registrando o provedor User
O próximo passo é registrar o provedor User com o módulo auth. Você deve fazer isso dentro do método boot do provedor. Para este exemplo, usaremos o arquivo `providers/AppProvider.ts`.

```ts
// providers/AppProvider.ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Auth = this.app.container.resolveBinding('Adonis/Addons/Auth')
    const Hash = this.app.container.resolveBinding('Adonis/Core/Hash')

    const { MongoDbAuthProvider } = await import('./MongoDbAuthProvider')

    Auth.extend('provider', 'mongo', (_, __, config) => {
      return new MongoDbAuthProvider(config, Hash)
    })
  }
}
```

O método `Auth.extend` aceita um total de três argumentos.

- O tipo de extensão. Ele deve sempre ser definido como `provider` ao adicionar um provedor user.
- O nome do provedor
- E, finalmente, um retorno de chamada que retorna uma instância do provedor User. O método de retorno de chamada recebe o `config` como o terceiro argumento.

## Atualizar tipos e configuração
Antes de começar a usar o provedor `mongo`, você terá que defini-lo dentro do arquivo de contrato e definir sua configuração.

Abra o arquivo `contracts/auth.ts` e anexe o seguinte trecho de código dentro dele.

```ts
// contracts/auth.ts

import type {
  MongoDbAuthProvider,
  MongoDbAuthProviderConfig,
} from '../providers/MongoDbAuthProvider'

declare module '@ioc:Adonis/Addons/Auth' {
  interface ProvidersList {
    user: {                               // [!code highlight]
      implementation: MongoDbAuthProvider // [!code highlight]
      config: MongoDbAuthProviderConfig   // [!code highlight]
    }                                     // [!code highlight]
  }

  interface GuardsList {
    web: {
      implementation: SessionGuardContract<'user', 'web'>
      config: SessionGuardConfig<'user'>
    }
  }
}
```

Finalmente, vamos atualizar o arquivo `config/auth.ts` e definir a configuração para o provedor de usuário.

```ts
// config/auth.ts
const authConfig: AuthConfig = {
  guard: 'web',
  guards: {
    web: {
      driver: 'session',

      provider: {         // [!code highlight]
        driver: 'mongo'   // [!code highlight]
      }                   // [!code highlight]
    }
  }
}
```
