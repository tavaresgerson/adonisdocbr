# Armazenamento local assíncrono

De acordo com a [documentação oficial do Node.js](https://nodejs.org/docs/latest-v14.x/api/async_hooks.html): "AsyncLocalStorage é usado para criar estado assíncrono dentro de callbacks e cadeias de promessas. **Ele permite armazenar dados durante todo o tempo de vida de uma solicitação da web ou qualquer outra duração assíncrona. É semelhante ao armazenamento local de thread em outras linguagens**."

Para simplificar ainda mais a explicação, AsyncLocalStorage permite que você armazene um estado ao executar uma função assíncrona e, em seguida, disponibilize-o para todos os caminhos de código dentro dessa função. Por exemplo:

::: info NOTA
O seguinte é um exemplo imaginário. No entanto, você ainda pode seguir em frente criando um projeto Node.js vazio.
:::

Vamos criar uma instância de `AsyncLocalStorage` e exportá-la de seu módulo. Isso permitirá que vários módulos acessem a mesma instância de armazenamento.

```ts
// storage.ts

import { AsyncLocalStorage } from 'async_hooks'
export const storage = new AsyncLocalStorage()
```

Crie o arquivo principal. Ele usará o método `storage.run` para executar uma função assíncrona com o estado inicial.

```ts {3,7-11}
// main.ts

import { storage } from './storage'
import ModuleA from './ModuleA'

async function run(id) {
  const state = { id }

  return storage.run(state, async () => {
    await (new ModuleA()).run()
  })
}

run(1)
run(2)
run(3)
```

Finalmente, `ModuleA` pode acessar o estado usando o método `storage.getStore()`.

```ts {3,8-9}
// ModuleA.ts

import { storage } from './storage'
import ModuleB from './ModuleB'

export default class ModuleA {
  public async run() {
    console.log(storage.getStore())
    await (new ModuleB()).run()
  }
}
```

Assim como `ModuleA`, `ModuleB` também pode acessar o mesmo estado usando o método `storage.getStore`.

Em outras palavras, toda a cadeia de operações tem acesso ao mesmo estado inicialmente definido dentro do arquivo `main.js` durante a chamada do método `storage.run`.

## Qual é a necessidade do Async Local Storage?
Ao contrário de outras linguagens como PHP, Node.js não é uma linguagem encadeada.

No PHP, cada solicitação HTTP cria uma nova thread, e cada thread tem sua memória. Isso permite que você armazene o estado na memória global e acesse-o em qualquer lugar dentro da sua base de código.

No Node.js, você não pode salvar dados em um objeto global e mantê-los isolados entre solicitações HTTP. Isso é impossível porque o Node.js é executado em um único thread e compartilha a memória entre todas as solicitações HTTP.

É aqui que o Node.js ganha muito desempenho, pois não precisa inicializar o aplicativo para cada solicitação HTTP.

No entanto, isso também significa que você precisa passar o estado como argumentos de função ou argumentos de classe, pois não pode gravá-lo no objeto global. Algo como o seguinte:

```ts
http.createServer((req, res) => {
  const state = { req, res }
  await (new ModuleA()).run(state)
})

// Module A
class ModuleA {
  public async run(state) {
    await (new ModuleB()).run(state)
  }
}
```

::: info NOTa
O armazenamento local assíncrono aborda esse caso de uso, pois permite estado isolado entre várias operações assíncronas.
:::

## Como o AdonisJS usa o ALS?
ALS significa **AsyncLocalStorage**. O AdonisJS usa o armazenamento local assíncrono durante as solicitações HTTP e define o [contexto HTTP](../http/context.md) como o estado. O fluxo do código é semelhante ao seguinte.

```ts
storage.run(ctx, () => {
  await runMiddleware()
  await runRouteHandler()
  ctx.finish()
})
```

O middleware e o manipulador de rotas geralmente executam outras operações também. Por exemplo, usar um modelo para buscar os usuários.

```ts
export default class UsersController {
  public index() {
    await User.all()
  }
}
```

As instâncias do modelo `User` agora têm acesso ao contexto, pois são criadas dentro do caminho do código do método `storage.run`.

```ts {1,5-6}
import HttpContext from '@ioc:Adonis/Core/HttpContext'

export default class User extends BaseModel {
  public get isFollowing() {
    const ctx = HttpContext.get()!
    return this.id === ctx.auth.user.id
  }
}
```

As propriedades estáticas do modelo (não métodos) não podem acessar o contexto HTTP, pois são avaliadas ao importar o modelo. Portanto, você deve entender o caminho de execução do código e [usar o ALS com cuidado](#coisas-a-se-ter-em-conta-ao-usar-als).

## Uso
Para usar o ALS em seus aplicativos, você deve habilitá-lo primeiro dentro do arquivo `config/app.ts`. Sinta-se à vontade para criar a propriedade manualmente se ela não existir.

```ts
// config/app.ts

export const http: ServerConfig = {
  useAsyncLocalStorage: true,
}
```

Uma vez habilitado, você pode acessar o contexto HTTP atual em qualquer lugar dentro da sua base de código usando o módulo `HttpContext`.

::: info NOTA
Certifique-se de que o caminho do código seja chamado durante a solicitação HTTP para que o `ctx` esteja disponível. Caso contrário, ele será `null`.
:::

```ts
import HttpContext from '@ioc:Adonis/Core/HttpContext'

class SomeService {
  public async someOperation() {
    const ctx = HttpContext.get()
  }
}
```

## Como deve ser usado?
Neste ponto, você pode considerar o Async Local Storage como um estado global específico da solicitação. [Estado global ou variáveis ​​são geralmente considerados ruins](https://wiki.c2.com/?GlobalVariablesAreBad) pois eles tornam os testes e a depuração muito mais difíceis.

O Node.js Async Local Storage pode ficar ainda mais complicado se você não for cuidadoso o suficiente para acessar o armazenamento local dentro da solicitação HTTP.

Recomendamos que você ainda escreva seu código como estava escrevendo antes (passando `ctx` por referência), mesmo se tiver acesso ao Async Local Storage. Passar dados por referência transmite um caminho de execução claro e facilita o teste do seu código isoladamente.

### Então por que você introduziu o Async Local Storage?
O Async Local Storage brilha com ferramentas APM, que coletam métricas de desempenho do seu aplicativo para ajudar a depurar e identificar problemas.

Antes do ALS, não havia uma maneira simples para as ferramentas APM relacionarem diferentes recursos com uma determinada solicitação HTTP. Por exemplo, ele podia mostrar quanto tempo era necessário para executar uma determinada consulta SQL, mas não podia dizer qual solicitação HTTP executou essa consulta.

Depois do ALS, agora tudo isso é possível sem que você precise tocar em uma única linha de código. **O AdonisJS usará o ALS para coletar métricas usando seu profiler de nível de aplicativo**.

## Coisas a serem observadas ao usar o ALS
Você está livre para usar o ALS se achar que ele torna seu código mais direto e preferir acesso global em vez de passar tudo por referência.

No entanto, esteja ciente das seguintes situações que podem facilmente levar a vazamentos de memória ou comportamento instável do programa.

### Acesso de nível superior
Nunca acesse o Async Local Storage no nível superior de nenhum módulo. Por exemplo:

#### ❌ Não funciona
No Node.js, os módulos são armazenados em cache. Portanto, o método `HttpContext.get()` será executado apenas uma vez durante a primeira solicitação HTTP e manterá seu `ctx` para sempre durante o ciclo de vida do seu processo.

```ts
import HttpContext from '@ioc:Adonis/Core/HttpContext'
const ctx = HttpContext.get()

export default class UsersController {
  public async index() {
    ctx.request
  }
}
```

#### ✅ Funciona

Em vez disso, você deve mover a chamada `.get` para dentro do método `index`.

```ts
export default class UsersController {
  public async index() {
    const ctx = HttpContext.get()
  }
}
```

### Dentro de propriedades estáticas
As propriedades estáticas (não métodos) de qualquer classe são avaliadas assim que o módulo é importado e, portanto, você não deve acessar o `ctx` dentro das propriedades estáticas.

#### ❌ Não funciona

No exemplo a seguir, quando você importa o modelo `User` dentro de um controlador, o código `HttpContext.get()` será executado e armazenado em cache para sempre. Então, ou você receberá `null` ou acabará armazenando em cache a conexão do locatário da primeira solicitação.

```ts
import HttpContext from '@ioc:Adonis/Core/HttpContext'

export default class User extends BaseModel {
  public static connection = HttpContext.get()!.tenant.connection
}
```

#### ✅ Funciona
Em vez disso, você deve mover a chamada `HttpContext.get` para dentro do método `query`.

```ts
import HttpContext from '@ioc:Adonis/Core/HttpContext'

export default class User extends BaseModel {
  public static query() {
    const ctx = HttpContext.get()!
    return super.query({ connection: tenant.connection })
  }
}
```

### Manipuladores de eventos
O manipulador de um evento emitido durante uma solicitação HTTP pode obter acesso ao contexto da solicitação usando o método `HttpContext.get()`. Por exemplo:

```ts
export default class UsersController {
  public async index() {
    const user = await User.create({})
    Event.emit('new:user', user)
  }
}
```

```ts
// Manipulador de eventos

import HttpContext from '@ioc:Adonis/Core/HttpContext'

Event.on('new:user', () => {
  const ctx = HttpContext.get()
})
```

No entanto, você deve estar ciente de algumas coisas ao acessar o contexto de um manipulador de eventos.

- O evento nunca deve tentar enviar uma resposta usando `ctx.response.send()` porque não é isso que os eventos devem fazer.
- Acessar `ctx` dentro de um manipulador de eventos faz com que ele dependa de solicitações HTTP. Em outras palavras, o evento não é mais genérico e deve sempre ser emitido durante uma solicitação HTTP para que funcione.
