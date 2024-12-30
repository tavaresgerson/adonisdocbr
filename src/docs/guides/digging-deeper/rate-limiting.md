# Limitação de taxa

O AdonisJS vem com um pacote oficial (`@adonisjs/limiter`) para ajudar você a implementar a limitação de taxa em seus aplicativos.

O pacote deve ser instalado e configurado separadamente.

:::code-group

```sh [Instale]
npm i @adonisjs/limiter@1.0.2
```

```sh [Configure]
node ace configure @adonisjs/limiter

# CREATE:  config/limiter.ts
# CREATE:  contracts/limiter.ts
# CREATE:  start/limiter.ts
# UPDATE: .adonisrc.json { providers += "@adonisjs/limiter" }
```

```ts [Registre o middleware de regulação]
/**
 * Certifique-se de adicionar o seguinte middleware nomeado dentro
 * do arquivo start/kernel.ts
 */
Server.middleware.registerNamed({
  throttle: () => import('@adonisjs/limiter/build/throttle'),
})
```

:::

- Suporte para múltiplos backends de armazenamento. **Redis**, **PostgreSQL/MySQL** e **Memory**.
- Incrementos atômicos
- API extensível para adicionar backends de armazenamento personalizados.
[rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible)

&nbsp;

* [Ver no npm](https://npm.im/@adonisjs/limiter)
* [Ver no GitHub](https://github.com/adonisjs/limiter)

## Configuração
A configuração do limitador de taxa é armazenada dentro do arquivo `config/limiter.ts`. Dentro deste arquivo, você pode definir um ou vários armazenamentos para persistir os dados do limitador.

```ts
import { limiterConfig } from '@adonisjs/limiter/build/config'

export default limiterConfig({
  default: 'redis',
  stores: {
    redis: {
      client: 'redis',
      connectionName: 'local'
    }
  },
})
```

#### `default`
A propriedade `default` é usada para escolher o armazenamento padrão para leitura e gravação de dados do limitador.

#### `stores`
Você pode definir vários armazenamentos nomeados dentro do objeto `stores`. Normalmente, você usará apenas um armazenamento. No entanto, há uma possibilidade de definir vários armazenamentos para atender às necessidades de dimensionamento do seu aplicativo.

#### Armazenamento Redis
O armazenamento Redis depende do pacote `@adonisjs/redis`. Portanto, certifique-se de instalá-lo e configurá-lo primeiro.

Os detalhes da conexão do redis são definidos dentro do arquivo `config/redis.ts`. Além disso, você deve mencionar o nome da conexão no arquivo de configuração do limitador.

#### Armazenamento do banco de dados
O armazenamento do banco de dados depende do pacote `@adonisjs/lucid`. Portanto, certifique-se de instalá-lo e configurá-lo primeiro.

Os detalhes da conexão do banco de dados são definidos dentro do arquivo `config/database.ts`. Além disso, você deve mencionar o nome da conexão dentro do arquivo de configuração do limitador.

```ts
export default limiterConfig({
  default: 'db',
  stores: {
    db: {
      client: 'db',
      dbName: 'database_name',
      tableName: 'rate_limits',
      connectionName: 'connection_name',
      clearExpiredByTimeout: true,
    }
  }
})
```

Se você decidir usar o armazenamento de banco de dados, você deve criar a tabela `rate_limits` usando a seguinte classe de esquema.

```sh
node ace make:migration rate_limits
```

```ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'rate_limits'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('key', 255).notNullable().primary()
      table.integer('points', 9).notNullable()
      table.bigint('expire').unsigned()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

## Limitação de taxa de solicitações HTTP
Você pode limitar a taxa de solicitações HTTP recebidas definindo as condições do limitador no tempo de execução com base no endereço IP do usuário, ID do usuário ou qualquer outro identificador exclusivo.

Você pode definir as condições de limite de taxa dentro do arquivo `start/limiter.ts` usando o método `Limiter.define`.

- O primeiro argumento é o nome exclusivo do limitador.
[Contexto HTTP](../http/context.md) como o único argumento.

```ts
// start/limiter.ts

import { Limiter } from '@adonisjs/limiter/build/services'

export const { limiters } = Limiter
  .define('global', (ctx) => {
    return Limiter.allowRequests(1000).every('1 min')
  })
```

Depois de definir um limitador, você pode aplicá-lo em uma rota usando o middleware `throttle`.

```ts
Route
  .get('/posts', 'PostsController.index')
  .middleware('throttle:global')
```

### Alterando a chave de aceleração
Por padrão, aplicamos o limite de taxa no endereço IP da solicitação. No entanto, você pode alterar qualquer outra chave de identificação. Por exemplo, você pode usar o ID do usuário como a chave de aceleração.

```ts
export const { limiters } = Limiter
  .define('global', function ({ auth }) {
    if (auth.user) {
      return Limiter
        .allowRequests(5000)
        .every('1 min')
        .usingKey(user.id) // 👈 usando o ID do usuário como chave
    }

    // Padrão para endereço IP
    return Limiter
      .allowRequests(1000)
      .every('1 min')
  })
```

### Alterando a resposta de aceleração
Você pode alterar a mensagem de exceção de aceleração capturando a exceção gerada e alterando suas propriedades. Por exemplo:

```ts {6-12}
export const { limiters } = Limiter
  .define('main', function (ctx) {
    return Limiter
      .allowRequests(1000)
      .every('1 min')
      .limitExceeded((error) => {
        error.message = 'Rate limit exceeded'
        error.status = 429

        // Um par de cabeçalhos chave-valor para definir na resposta
        console.log(error.headers)
      })
  })
```

### Permitindo solicitações ilimitadas
Você pode permitir solicitações ilimitadas para um determinado usuário ou endereço IP retornando o valor de retorno `Limiter.noLimit()` do retorno de chamada. Por exemplo, permitir chamadas ilimitadas para um cliente premium.

```ts
export const { limiters } = Limiter
  .define('main', ({ auth }) => {
    if (auth.user && await auth.user.membership() === 'premium') {
      return Limiter.noLimit()
    }

    return Limiter
      .allowRequests(1000)
      .every('1 min')
      .usingKey(user.id)
  })
```

### Alternando entre `store`
Você pode especificar a loja que deseja usar chamando o método `store`.

```ts {6}
export const { limiters } = Limiter
  .define('main', function (ctx) {
    return Limiter
      .allowRequests(1000)
      .every('1 min')
      .store('redis')
  })
```

## Proteção contra força bruta de endpoint de login
Os endpoints de login geralmente se tornam vítimas de ataques de força bruta. No entanto, com a ajuda do limitador de taxa, você pode minimizar o risco de força bruta bloqueando o endereço IP do usuário após várias falhas de login.

::: info NOTA
Sinta-se à vontade para ajustar a duração do bloqueio e o número de tentativas permitidas de acordo com os requisitos do seu aplicativo.
:::

No exemplo a seguir, usamos as APIs do Limitador para consumir uma solicitação em caso de falha de login manualmente.

```ts
Route.post('login', 'AuthController.store')
```

```ts {9-10,12-17,19-22,27-28,32-33}
import { Limiter } from '@adonisjs/limiter/build/services'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async store({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    // Etapa 1
    const throttleKey = `login_${email}_${request.ip()}`

    // Etapa 2
    const limiter = Limiter.use({
      requests: 10,
      duration: '15 mins',
      blockDuration: '30 mins',
    })

    // Etapa 3
    if (await limiter.isBlocked(throttleKey)) {
      return response.tooManyRequests('Login attempts exhausted. Please try after some time')
    }

    try {
      await auth.attempt(email, password)
    } catch (error) {
      // Etapa 4
      await limiter.increment(throttleKey)
      throw error
    }

    // Etapa 5
    await limiter.delete(throttleKey)
  }
}
```

1. O primeiro passo é criar uma chave exclusiva usando o e-mail e o endereço IP. Também prefixamos a chave com a ação que está sendo executada.
2. Em seguida, criamos uma instância do limitador permitindo **10 tentativas de login com falha** dentro da **janela de 15 minutos**. Se o usuário esgotar todas as tentativas, nós o bloquearemos pelos próximos **30 minutos**.
3. Antes de tentar efetuar login, verificamos se o `throttleKey` foi bloqueado. Se estiver bloqueado, retornamos mais cedo negando a solicitação.
4. Se o login do usuário falhar, incrementaremos o contador e lançaremos a exceção novamente.
5. Após o login bem-sucedido, excluiremos as tentativas do usuário do armazenamento.

## API do gerenciador de limitadores
A seguir está a lista de métodos e propriedades disponíveis na classe do gerenciador de limitadores.

Você pode importar o gerenciador de limitadores da seguinte forma.

```ts
import { Limiter } from '@adonisjs/limiters/services'
```

### `use`
Crie uma instância do limitador com o número permitido de solicitações e a duração. Opcionalmente, você também pode especificar o armazenamento de backend. O armazenamento padrão definido dentro do arquivo `start/limiter.ts` será usado se não for definido.

```ts
import { Limiter } from '@adonisjs/limiters/services'

const limiter = Limiter.use({
  request: 100,
  every: '1 min',
})

// Use um store específica
const limiter = Limiter.use('db', {
  request: 100,
  every: '1 min',
})
```

Você também pode definir a duração do bloqueio para impedir que o usuário faça mais solicitações após ele ter esgotado seu limite. Você deve considerar o bloqueio ao tentar impedir que endpoints específicos sofram ataques de força bruta.

```ts
const limiter = Limiter.use({
  request: 100,
  every: '1 min',
  /**
   * O uso será bloqueado por 30 minutos quando eles
   * fizerem 100 solicitações em um minuto
   */
  blockDuration: '30 mins'
})
```

### `define`
Defina um limitador nomeado para ser usado durante solicitações HTTP. O método aceita o nome do limitador como o primeiro argumento e uma função de retorno de chamada como o segundo argumento.

```ts
Limiter.define('global', (ctx) => {
  return Limiter.allowRequests(1000).every('1 min')
})
```

Como você tem acesso ao contexto HTTP da solicitação atual, pode aplicar dinamicamente diferentes limites de solicitação com base no usuário conectado ou em um endereço IP.

### `allowRequests`
O método `allowRequests` cria uma instância do [Construtor de configuração](#limiter-config-builder). Você pode usar o construtor de configuração para definir a duração das solicitações e a duração do bloco.

```ts
Limiter.allowRequests(1000) // retorna new HttpLimiterConfigBuilder()
```

### `noLimit`
O método `noLimit` é uma maneira descritiva de não aplicar nenhum limite na solicitação atual retornando `null` do retorno de chamada do limitador.

## API do limitador
A seguir está a lista de métodos disponíveis que você pode chamar no limitador para implementar manualmente a limitação de taxa em seu aplicativo.

Você pode acessar a instância do limitador usando o método `Limiter.use`.

```ts
import { Limiter } from '@adonisjs/limiters/services'

const limiter = Limiter.use({
  request: 10,
  every: '15 mins',
})

// Use uma store específica
const limiter = Limiter.use('db', {
  request: 10,
  every: '15 mins',
})
```

### `get`
Obtenha os metadados de uma determinada chave. O método retorna `null` se nenhuma solicitação tiver sido consumida na chave fornecida ainda.

```ts
const response = await limiter.get(`global_${user.id}`)
if (!response) {
  // nenhuma solicitação consumida ainda
}

response.remaining  // Número restante de solicitações
response.limit      // Número permitido de solicitações
response.consumed   // Solicitações consumidas até o momento
response.retryAfter // Milissegundos para esperar antes que o limite seja revisado
```

### `remaining`
Obtenha o número de solicitações restantes para uma determinada chave.

```ts
if (await limiter.remaining(`global_${user.id}`)) {
  // chave tem solicitações restantes
}
```

### `consume`
Consuma uma solicitação para a chave fornecida. O método gerou uma exceção quando todas as solicitações já foram consumidas.

```ts
try {
  const response = await limiter.consume(`global_${user.id}`)
  // a resposta é a mesma que a resposta "limiter.get"
} catch (error) {
  console.log(error instanceof ThrottleException)
  console.log(error.status)
  console.log(error.message)
  console.log(error.headers)
  console.log(error.limit)
  console.log(error.retryAfter)
}
```

### `delete`
Exclua a chave do armazenamento. Excluir uma chave essencialmente revisará as solicitações consumidas.

```ts
await limiter.delete(`global_${user.id}`)
```

### `block`
Bloqueie uma determinada chave pela duração mencionada. Por exemplo, definir a duração como `0` bloqueará a chave para sempre. O bloqueio geralmente é útil para desacelerar ataques de força bruta.

```ts
await limiter.block(`login_${email}_${ip}`, '30 mins')
```

### `increment`
Aumente a contagem de solicitações consumidas em um. O método é o mesmo que o método `consume`. No entanto, ele não gera uma exceção quando o limite é esgotado.

```ts
await limiter.increment(`global_${user.id}`)
```

### `isBlocked`
Verifique se a chave está bloqueada para fazer mais solicitações. O pacote [rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible) não tem nenhum sinalizador especial para saber se uma chave está bloqueada, portanto, verificamos se as solicitações consumidas são maiores do que as solicitações permitidas para descobrir se a chave está bloqueada ou não.

```ts
if (await limiter.isBlocked(`global_${user.id}`)) {
  // consumiu mais do que o limite permitido
}
```

## Construtor de configuração do limitador
O construtor de configuração permite que você use o encadeamento de métodos fluentes e crie a configuração que você pode usar para aplicar o limite de taxa durante solicitações HTTP.

Você pode acessar uma instância do construtor de configuração chamando o método `allowRequests` no gerenciador do limitador.

```ts
import { Limiter } from '@adonisjs/limiters/services'
Limiter.allowRequests(1000)
```

### `allowRequests`
Defina o número de solicitações a serem permitidas para a duração de tempo fornecida.

### `every`
Defina a duração de tempo. Você pode especificar o tempo em milissegundos ou definir uma expressão de string suportada pelo pacote [ms](https://npm.im/ms).

### `limitExceeded`
Defina o retorno de chamada para alterar o erro gerado quando a solicitação excede o número de solicitações permitidas.

```ts
Limiter
  .allowRequests(1000)
  .limitExceeded((error) => {
    console.log(error instanceof ThrottleException)
    console.log(error.status)
    console.log(error.message)
    console.log(error.headers)
    console.log(error.limit)
    console.log(error.retryAfter)
  })
```

### `store`
Especifique o armazenamento de backend a ser usado para persistir dados do limitador.

```ts
Limiter
  .allowRequests(1000)
  .store('db')
```

### `usingKey`
Defina uma chave personalizada para limitar as solicitações. Por padrão, o endereço IP é usado.

```ts
Limiter
  .allowRequest(1000)
  .usingKey(user.id)
```
