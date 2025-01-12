---
resumo: Opções disponíveis para bibliotecas SQL e ORMs em aplicativos AdonisJS.
---

# SQL e ORMs

Bancos de dados SQL são populares para armazenar os dados do aplicativo em armazenamento persistente. Você pode usar quaisquer bibliotecas e ORMs para fazer consultas SQL dentro de um aplicativo AdonisJS.

:::note
A equipe principal do AdonisJS construiu o [Lucid ORM](./lucid.md), mas não o força a usá-lo. Você pode usar quaisquer outras bibliotecas SQL e ORMs que desejar dentro de um aplicativo AdonisJS.
:::

## Opções populares

A seguir está a lista de outras bibliotecas SQL e ORMs populares que você pode usar dentro de um aplicativo AdonisJS (assim como qualquer outro aplicativo Node.js).

[**Lucid**](./lucid.md) é um construtor de consultas SQL e um **ORM Active Record** construído sobre
[**Prisma**](https://prisma.io/orm) O Prisma ORM é outro ORM popular no ecossistema Node.js. Ele tem uma grande comunidade de seguidores. Ele oferece modelos de dados intuitivos, migrações automatizadas, segurança de tipo e preenchimento automático.
[**Kysely**](https://kysely.dev/docs/getting-started) é um construtor de consultas de tipo seguro de ponta a ponta para Node.js. O Kysely é uma ótima opção se você precisa de um construtor de consultas enxuto sem nenhum modelo. Escrevemos um artigo explicando
[**Drizzle ORM**](https://orm.drizzle.team/) é usado por muitos desenvolvedores AdonisJS em nossa comunidade. Não temos experiência com este ORM, mas você pode querer dar uma olhada e ver se ele é uma excelente opção para seu caso de uso.
[**Mikro ORM**](https://mikro-orm.io/docs/guide/first-entity) é um ORM subestimado no ecossistema Node.js. O MikroORM é um pouco prolixo em comparação ao Lucid. No entanto, ele é mantido ativamente e também construído sobre o Knex.
[**TypeORM**](https://typeorm.io) é um ORM popular no ecossistema TypeScript.

## Usando outras bibliotecas SQL e ORMs

Ao usar outra biblioteca SQL ou ORM, você terá que alterar a configuração de alguns pacotes manualmente.

### Autenticação

O [módulo de autenticação AdonisJS](../authentication/introduction.md) vem com suporte integrado para o Lucid buscar o usuário autenticado. Ao usar outra biblioteca SQL ou ORM, você terá que implementar a interface `SessionUserProviderContract` ou `AccessTokensProviderContract` para buscar o usuário.

Aqui está um exemplo de como você pode implementar a interface `SessionUserProviderContract` ao usar `Kysely`.

```ts
import { symbols } from '@adonisjs/auth'
import type { SessionGuardUser, SessionUserProviderContract } from '@adonisjs/auth/types/session'
import type { Users } from '../../types/db.js' // Specific to Kysely

export class SessionKyselyUserProvider implements SessionUserProviderContract<Users> {
  /**
   * Used by the event emitter to add type information to the events emitted by the session guard.
   */   
  declare [symbols.PROVIDER_REAL_USER]: Users

  /**
   * Bridge between the session guard and your provider.
   */
  async createUserForGuard(user: Users): Promise<SessionGuardUser<Users>> {
    return {
      getId() {
        return user.id
      },
      getOriginal() {
        return user
      },
    }
  }

  /**
   * Find a user using the user id using your custom SQL library or ORM.
   */
  async findById(identifier: number): Promise<SessionGuardUser<Users> | null> {
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', identifier)
      .executeTakeFirst()

    if (!user) {
      return null
    }

    return this.createUserForGuard(user)
  }
}
```

Depois de implementar a interface `UserProvider`, você pode usá-la dentro da sua configuração.

```ts
const authConfig = defineConfig({
  default: 'web',

  guards: {
    web: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
      
      provider: configProvider.create(async () => {
        const { SessionKyselyUserProvider } = await import(
          '../app/auth/session_user_provider.js' // Path to the file
        )

        return new SessionKyselyUserProvider()
      }),
    }),
  },
})
```
