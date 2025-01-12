---
summary: Aprenda a usar o auth guard básico para autenticar usuários usando a estrutura de autenticação HTTP.
---

# Basic authentication guard

O auth guard básico é uma implementação da [estrutura de autenticação HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication), na qual o cliente deve passar as credenciais do usuário como uma string codificada em base64 por meio do cabeçalho `Authorization`. O servidor permite a solicitação se as credenciais forem válidas. Caso contrário, um prompt nativo da Web é exibido para inserir novamente as credenciais.

## Configurando o guard
Os guards de autenticação são definidos dentro do arquivo `config/auth.ts`. Você pode configurar vários guards dentro deste arquivo sob o objeto `guards`.

```ts
import { defineConfig } from '@adonisjs/auth'
// highlight-start
import { basicAuthGuard, basicAuthUserProvider } from '@adonisjs/auth/basic_auth'
// highlight-end

const authConfig = defineConfig({
  default: 'basicAuth',
  guards: {
    // highlight-start
    basicAuth: basicAuthGuard({
      provider: basicAuthUserProvider({
        model: () => import('#models/user'),
      }),
    })
    // highlight-end
  },
})

export default authConfig
```

O método `basicAuthGuard` cria uma instância da classe [BasicAuthGuard](https://github.com/adonisjs/auth/blob/main/modules/basic_auth_guard/guard.ts). Ele aceita um provedor de usuário que pode ser usado para encontrar usuários durante a autenticação.

O método `basicAuthUserProvider` cria uma instância da classe [BasicAuthLucidUserProvider](https://github.com/adonisjs/auth/blob/main/modules/basic_auth_guard/user_providers/lucid.ts). Ele aceita uma referência ao modelo a ser usado para verificar as credenciais do usuário.

## Preparando o modelo User
O modelo (modelo `User` neste exemplo) configurado com o `basicAuthUserProvider` deve usar o mixin [AuthFinder](./verifying_user_credentials.md#using-the-auth-finder-mixin) para verificar as credenciais do usuário durante a autenticação.

```ts
import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
// highlight-start
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
// highlight-end

// highlight-start
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})
// highlight-end

// highlight-start
export default class User extends compose(BaseModel, AuthFinder) {
  // highlight-end
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

## Protegendo rotas
Depois de configurar o guard, você pode usar o middleware `auth` para proteger rotas de solicitações não autenticadas. O middleware é registrado dentro do arquivo `start/kernel.ts` sob a coleção de middleware nomeada.

```ts
import router from '@adonisjs/core/services/router'

export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware')
})
```

```ts
// highlight-start
import { middleware } from '#start/kernel'
// highlight-end
import router from '@adonisjs/core/services/router'

router
  .get('dashboard', ({ auth }) => {
    return auth.user
  })
  .use(middleware.auth({
    // highlight-start
    guards: ['basicAuth']
    // highlight-end
  }))
```

### Lidando com exceção de autenticação

O middleware auth lança o [E_UNAUTHORIZED_ACCESS](https://github.com/adonisjs/auth/blob/main/src/errors.ts#L21) se o usuário não for autenticado. A exceção é automaticamente convertida em uma resposta HTTP com o cabeçalho [WWW-Authenticate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate) na resposta. O `WWW-Authenticate` desafia a autenticação e aciona um prompt nativo da web para inserir novamente as credenciais.

## Obtendo acesso ao usuário autenticado
Você pode acessar a instância do usuário conectado usando a propriedade `auth.user`. Como você está usando o middleware `auth`, a propriedade `auth.user` estará sempre disponível.

```ts
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .get('dashboard', ({ auth }) => {
    return `You are authenticated as ${auth.user!.email}`
  })
  .use(middleware.auth({
    guards: ['basicAuth']
  }))
```

### Obter usuário autenticado ou falhar
Se você não gosta de usar o [operador de asserção não nulo](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-) na propriedade `auth.user`, você pode usar o método `auth.getUserOrFail`. Este método retornará o objeto do usuário ou lançará a exceção [E_UNAUTHORIZED_ACCESS](../references/exceptions.md#e_unauthorized_access).

```ts
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .get('dashboard', ({ auth }) => {
    // highlight-start
    const user = auth.getUserOrFail()
    return `You are authenticated as ${user.email}`
    // highlight-end
  })
  .use(middleware.auth({
    guards: ['basicAuth']
  }))
```
