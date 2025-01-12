---
summary: Aprenda sobre AsyncLocalStorage e como usá-lo no AdonisJS.
---

# Armazenamento local assíncrono

De acordo com a [documentação oficial do Node.js](https://nodejs.org/docs/latest-v21.x/api/async_context.html#class-asynclocalstorage): “AsyncLocalStorage é usado para criar estado assíncrono dentro de callbacks e cadeias de promessas. **Ele permite armazenar dados durante todo o tempo de vida de uma solicitação da web ou qualquer outra duração assíncrona. É semelhante ao armazenamento local de thread em outras linguagens**.”

Para simplificar ainda mais a explicação, AsyncLocalStorage permite que você armazene um estado ao executar uma função assíncrona e o disponibilize para todos os caminhos de código dentro dessa função.

## Exemplo básico

Vamos ver em ação. Primeiro, criaremos um novo projeto Node.js (sem nenhuma dependência) e usaremos `AsyncLocalStorage` para compartilhar o estado entre os módulos sem passá-lo por referência.

:::note
Você pode encontrar o código final para este exemplo no repositório GitHub [als-basic-example](https://github.com/thetutlage/als-basic-example).
:::

### Etapa 1. Criando um novo projeto

```sh
npm init --yes
```

Abra o arquivo `package.json` e defina o sistema de módulos como ESM.

```json
{
  "type": "module"
}
```

### Etapa 2. Criando uma instância de `AsyncLocalStorage`

Crie um arquivo chamado `storage.js`, que cria e exporta uma instância de `AsyncLocalStorage`.

```ts
// title: storage.js
import { AsyncLocalStorage } from 'async_hooks'
export const storage = new AsyncLocalStorage()
```

### Etapa 3. Execute o código dentro de `storage.run`

Crie um arquivo de ponto de entrada chamado `main.js`. Dentro deste arquivo, importe a instância de `AsyncLocalStorage` criada dentro do arquivo `./storage.js`.

O método `storage.run` aceita o estado que queremos compartilhar como o primeiro argumento e uma função de retorno de chamada como o segundo argumento. Todos os caminhos de código dentro deste retorno de chamada (incluindo os módulos importados) terão acesso ao mesmo estado.

```ts
// title: main.js
import { storage } from './storage.js'
import UserService from './user_service.js'
import { setTimeout } from 'node:timers/promises'

async function run(user) {
  const state = { user }

  return storage.run(state, async () => {
    await setTimeout(100)
    const userService = new UserService()
    await userService.get()
  })
}
```

Para demonstração, executaremos o método `run` três vezes sem aguardá-lo. Cole o seguinte código no final do arquivo `main.js`.

```ts
// title: main.js
run({ id: 1 })
run({ id: 2 })
run({ id: 3 })
```

### Etapa 4. Acesse o estado do módulo `user_service`.

Por fim, vamos importar a instância de armazenamento dentro do módulo `user_service` e acessar o estado atual.

```ts
// title: user_service.js
import { storage } from './storage.js'

export class UserService {
  async get() {
    const state = storage.getStore()
    console.log(`The user id is ${state.user.id}`)
  }
}
```

### Etapa 5. Execute o arquivo `main.js`.

Vamos executar o arquivo `main.js` para ver se o `UserService` pode acessar o estado.

```sh
node main.js
```

## Qual é a necessidade do armazenamento local assíncrono?

Ao contrário de outras linguagens como PHP, o Node.js não é uma linguagem encadeada. No PHP, cada solicitação HTTP cria uma nova thread, e cada thread tem sua memória. Isso permite que você armazene o estado na memória global e acesse-o em qualquer lugar dentro da sua base de código.

No Node.js, você não pode ter um estado global isolado entre solicitações HTTP porque o Node.js é executado em uma única thread e tem memória compartilhada. Como resultado, todos os aplicativos Node.js compartilham dados passando-os como parâmetros.

Passar dados por referência não tem desvantagens técnicas. Mas, isso torna o código detalhado, especialmente quando você configura ferramentas APM e precisa fornecer dados de solicitação a elas manualmente.

## Uso

O AdonisJS usa `AsyncLocalStorage` durante solicitações HTTP e compartilha o [contexto HTTP](./http_context.md) como o estado. Como resultado, você pode acessar o contexto HTTP em seu aplicativo globalmente.

Primeiro, você deve habilitar o sinalizador `useAsyncLocalStorage` dentro do arquivo `config/app.ts`.

```ts
// title: config/app.ts
export const http = defineConfig({
  useAsyncLocalStorage: true,
})
```

Depois de habilitado, você pode usar os métodos `HttpContext.get` ou `HttpContext.getOrFail` para obter uma instância do Contexto HTTP para a solicitação em andamento.

No exemplo a seguir, obtemos o contexto dentro de um modelo Lucid.

```ts
import { HttpContext } from '@adonisjs/core/http'
import { BaseModel } from '@adonisjs/lucid'

export default class Post extends BaseModel {
  get isLiked() {
    const ctx = HttpContext.getOrFail()
    const authUserId = ctx.auth.user.id
    
    return !!this.likes.find((like) => {
      return like.userId === authUserId
    })
  }
}
```

## Advertências
Você pode usar o ALS se ele tornar seu código simples e você preferir acesso global em vez de passar o contexto HTTP por referência.

No entanto, esteja ciente das seguintes situações que podem facilmente levar a vazamentos de memória ou comportamento instável do programa.

### Acesso de nível superior

Não acesse o ALS no nível superior de nenhum módulo porque os módulos no Node.js são armazenados em cache.

:::caption{for="error"}
**Uso incorreto**\
Atribuir o resultado do método `HttpContext.getOrFail()` a uma variável no nível superior manterá a referência à solicitação que importou o módulo pela primeira vez.
:::

```ts
import { HttpContext } from '@adonisjs/core/http'
const ctx = HttpContext.getOrFail()

export default class UsersController {
  async index() {
    ctx.request
  }
}
```

:::caption[]{for="success"}
**Uso correto**\
Em vez disso, você deve mover a chamada do método `getOrFail` para dentro do método `index`.
:::

```ts
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index() {
    const ctx = HttpContext.getOrFail()
  }
}
```

### Dentro de propriedades estáticas
Propriedades estáticas (não métodos) de qualquer classe são avaliadas assim que o módulo é importado; portanto, você não deve acessar o contexto HTTP dentro de propriedades estáticas.

:::caption{for="error"}
**Uso incorreto**
:::

```ts
import { HttpContext } from '@adonisjs/core/http'
import { BaseModel } from '@adonisjs/lucid'

export default class User extends BaseModel {
  static connection = HttpContext.getOrFail().tenant.name
}
```

:::caption[]{for="success"}
**Uso correto**\
Em vez disso, você deve mover a chamada `HttpContext.get` para dentro de um método ou converter a propriedade em um getter.
:::

```ts
import { HttpContext } from '@adonisjs/core/http'
import { BaseModel } from '@adonisjs/lucid'

export default class User extends BaseModel {
  static query() {
    const ctx = HttpContext.getOrFail()
    return super.query({ connection: tenant.connection })
  }
}
```

### Manipuladores de eventos
Os manipuladores de eventos são executados após a conclusão da solicitação HTTP. Portanto, você deve evitar tentar acessar o contexto HTTP dentro deles.

```ts
import emitter from '@adonisjs/core/services/emitter'

export default class UsersController {
  async index() {
    const user = await User.create({})
    emitter.emit('new:user', user)
  }
}
```

:::caption[]{for="error"}
**Evite o uso dentro de ouvintes de eventos**
:::

```ts
import { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'

emitter.on('new:user', () => {
  const ctx = HttpContext.getOrFail()
})
```
