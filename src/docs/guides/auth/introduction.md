# Introdução

O AdonisJS vem com um sistema de autenticação completo para autenticar os usuários do seu aplicativo usando **sessões**, **autenticação básica** ou **tokens de API**.

O suporte para autenticação é adicionado pelo pacote `@adonisjs/auth` e deve ser instalado separadamente.

::: info NOTA
O pacote auth depende do pacote `@adonisjs/lucid`. Certifique-se de [configurar o lucid](../database/introduction.md) primeiro.
:::

:::code-group

```sh [1. Install]
npm i @adonisjs/auth@8.2.3
```

```sh [2. Configure]
node ace configure @adonisjs/auth

# CREATE: app/Models/User.ts
# CREATE: database/migrations/1619578304190_users.ts
# CREATE: contracts/auth.ts
# CREATE: config/auth.ts
# CREATE: app/Middleware/Auth.ts file already exists
# CREATE: app/Middleware/SilentAuth.ts file already exists
# UPDATE: .adonisrc.json { providers += "@adonisjs/auth" }
# CREATE: ace-manifest.json file
```
:::

- Vários guardas para autenticação. **Sessões**, **tokens de API** e **autenticação básica**
- API extensível para adicionar proteções personalizadas e provedores de usuário

* [Ver no npm](https://npm.im/@adonisjs/auth)
* [Ver no GitHub](https://github.com/adonisjs/auth)


## Config
A configuração do pacote auth é armazenada dentro do arquivo `config/auth.ts`. Dentro deste arquivo, você pode definir uma ou mais proteções para autenticar usuários. Uma proteção é uma **combinação de um provedor de usuário e um dos drivers de autenticação disponíveis**.

```ts
import { AuthConfig } from '@ioc:Adonis/Addons/Auth'

const authConfig: AuthConfig = {
  guard: 'web',

  guards: {
    web: {
      driver: 'session',

      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email'],
        model: () => import('App/Models/User'),
      },
    },
  },
}

export default authConfig
```

#### guard
A propriedade de nível superior `guard` define a proteção padrão a ser usada para autenticação. Ela deve ser definida dentro da lista `guards`.

#### guards
O objeto `guards` é um par chave-valor dos guards que você deseja usar em seu aplicativo. Você pode criar vários guards usando o mesmo driver ou um diferente.

#### guards.driver
O driver a ser usado para login e autenticação de usuários. Você pode usar um dos drivers pré-existentes ou estender o módulo Auth para adicionar o seu próprio.

- O driver `session` faz uso de sessões/cookies para login e autenticação de solicitações.
- `oat` significa **token de acesso opaco** e usa tokens sem estado para autenticação de solicitações.
- `basic` usa autenticação básica para autenticação de solicitações.

#### guards.provider
A propriedade `provider` configura um provedor de usuário para pesquisar usuários. Você pode usar um dos provedores pré-existentes ou estender o módulo Auth para adicionar o seu próprio.

A seguir está a lista de drivers disponíveis para pesquisa de usuários. O restante dos valores de configuração depende do driver selecionado.

- `lucid` usa modelos de dados para pesquisar usuários.
- `database` consulta o banco de dados diretamente para pesquisar usuários.

### Configurando novos guards/providers
Você também pode configurar novos guards e os providers após a configuração inicial. O primeiro passo é registrá-los dentro do arquivo `contracts/auth.ts` para informar o compilador estático TypeScript.

Você pode adicionar um novo provider dentro da interface `ProvidersList`. A chave é o nome do provider, juntamente com os tipos para a configuração e a implementação.

A interface `GuardsList` é a lista de todos os guards que você deseja usar. A chave é o nome do guard, juntamente com os tipos para a configuração do guard e sua implementação.

```ts
// contracts/auth.ts
declare module '@ioc:Adonis/Addons/Auth' {
  interface ProvidersList {
    user: {
      implementation: LucidProviderContract<typeof User>,
      config: LucidProviderConfig<typeof User>,
    },
    apps: {                                               // [!code highlight]
      implementation: LucidProviderContract<typeof App>,  // [!code highlight]
      config: LucidProviderConfig<typeof App>,            // [!code highlight]
    }                                                     // [!code highlight]
  }

  interface GuardsList {
    web: {
      implementation: SessionGuardContract<'user', 'web'>,
      config: SessionGuardConfig<'user'>,
    },
    api: {                                                // [!code highlight]
      implementation: OATGuardContract<'apps', 'api'>,    // [!code highlight]
      config: OATGuardConfig<'apps'>,                     // [!code highlight]
    }                                                     // [!code highlight]
  }
}
```

Depois de adicionar o(s) novo(s) guard(s) ou provider(s) dentro do arquivo contracts, o compilador TypeScript validará automaticamente o arquivo de configuração, forçando você a definir a configuração para ele também.

## Migrações

O processo de configuração também cria os arquivos de migração para a tabela `users` e, opcionalmente, para a tabela `tokens` (se estiver usando o API tokens guard com armazenamento SQL).

O nome do arquivo das migrações usa o registro de data e hora atual e é colocado após todas as migrações existentes.

Há chances de que algumas de suas tabelas precisem criar uma restrição de chave estrangeira com a tabela `users`, portanto, a migração da tabela `users` deve ser executada antes dessas migrações.

Neste cenário, você pode renomear manualmente o arquivo de migração da tabela `users` e usar um registro de data e hora menor para movê-lo à frente dos outros arquivos de migração.

## Uso
Você pode acessar a instância `auth` dentro de seus manipuladores de rota usando a propriedade `ctx.auth`. O objeto auth permite que você faça login em usuários e autentique solicitações subsequentes.

```ts
// Login de usuário
Route.post('login', async ({ auth, request }) => {
  const email = request.input('email')
  const password = request.input('password')

  await auth.use('web').attempt(email, password)
})
```

```ts
// Autenticar solicitação subsequente
Route.get('dashboard', async ({ auth }) => {
  await auth.use('web').authenticate()

  // ✅ Solicitação autenticada
  console.log(auth.user!)
})
```

Além do uso básico, recomendamos que você leia os guias para os guardas individuais, pois sua API e fluxo podem variar.

* [Uso do guarda da Web](/docs/guides/auth/web-guard.md)
* [Uso do guarda de tokens de API](/docs/guides/auth/api-tokens-guard.md)
* [Uso básico do guarda de autenticação](/docs/guides/auth/basic-auth-guard.md)

## Referência dentro de modelos
A propriedade `ctx.auth` também é compartilhada com os modelos. Você pode usá-la para exibir a parte específica da sua marcação condicionalmente.

```edge
@if(auth.isLoggedIn)
  <p> Hello {{ auth.user.username }} </p>
@endif
```

## Referência de configuração de provedores
A seguir está a referência de configuração e contratos de provedores de usuário.

### Provedor Lucid
O provedor `lucid` usa os modelos de dados para pesquisar usuários nos bancos de dados. O provedor deve ser configurado dentro do arquivo de contratos primeiro.

```ts
import User from 'App/Models/User'

interface ProvidersList {
  providerName: {
    implementation: LucidProviderContract<typeof User>,
    config: LucidProviderConfig<typeof User>,
  }
}
```

A seguir está a lista de todas as opções de configuração disponíveis.

```ts
{
  provider: {
    driver: 'lucid',
    identifierKey: 'id',
    uids: ['email'],
    model: () => import('App/Models/user'),
    connection: 'pg',
    hashDriver: 'argon',
  }
}
```

#### `driver`
O nome do driver deve ser sempre definido como `lucid`.

#### `identifierKey`
A `identifierKey` geralmente é a chave primária no modelo configurado. O pacote de autenticação precisa dela para identificar exclusivamente um usuário.

#### `uids`
Uma matriz de colunas de modelo para usar na pesquisa de usuário. O método `auth.login` usa os `uids` para encontrar um usuário pelo valor fornecido.

Por exemplo: se seu aplicativo permite login com e-mail e nome de usuário, você deve defini-los como `uids`. Além disso, você precisa definir os nomes das colunas do modelo e não os nomes das colunas do banco de dados.

#### `model`
O modelo a ser usado para pesquisa de usuário. Ele deve ser importado lentamente usando um fechamento.

```ts
{
  model: () => import('App/Models/user'),
}
```

#### `connection`
A conexão do banco de dados a ser usada para fazer as consultas SQL. Se não for definida, a conexão do modelo será usada.

#### `hashDriver`
O driver a ser usado para verificar o hash da senha do usuário. Ele é usado pelo método `auth.login`. Se não for definido, usaremos o driver de hash padrão do arquivo `config/hash.ts`.

### Provedor de banco de dados
O provedor de banco de dados consulta o banco de dados diretamente usando o [Database query builder](/docs/guides/database/query-builder.md). Você deve registrar o provedor dentro do arquivo de contratos primeiro.

```ts
interface ProvidersList {
  providerName: {
    implementation: DatabaseProviderContract<DatabaseProviderRow>,
    config: DatabaseProviderConfig,
  }
}
```

A seguir está a lista de opções de configuração disponíveis.

```ts
{
  provider: {
    driver: 'database'
    identifierKey: 'id',
    uids: ['email'],
    usersTable: 'users',
    connection: 'pg'
    hashDriver: 'argon'
  }
}
```

#### `driver`
O nome do driver deve sempre ser definido como `database`.

#### `identifierKey`
A `identifierKey` geralmente é a chave primária da tabela de banco de dados configurada. O pacote de autenticação precisa dela para identificar exclusivamente um usuário.

#### `uids`
Uma matriz de colunas de modelo para usar na pesquisa do usuário. O método `auth.login` usa os `uids` para encontrar um usuário pelo valor fornecido.

Por exemplo: se seu aplicativo permite login com e-mail e nome de usuário, você deve defini-los como `uids`. Além disso, você precisa definir os nomes das colunas do modelo e não os nomes das colunas do banco de dados.

#### `usersTable`
O nome da tabela do banco de dados a ser usada para pesquisa de usuários.

```ts
{
  usersTable: 'users'
}
```

#### `connection`
A conexão do banco de dados a ser usada para fazer as consultas SQL. Se não for definida, a conexão padrão do arquivo `config/database.ts` será usada.

#### `hashDriver`

O driver a ser usado para verificar o hash da senha do usuário. Ele é usado pelo método `auth.login`. Se não for definido, usaremos o driver de hash padrão do arquivo `config/hash.ts`.
