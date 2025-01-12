---
summary: gerencie sessões de usuário dentro do seu aplicativo AdonisJS usando o pacote @adonisjs/session.
---

# Session

Você pode gerenciar sessões de usuário dentro do seu aplicativo AdonisJS usando o pacote `@adonisjs/session`. O pacote session fornece uma API unificada para armazenar dados de sessão em diferentes provedores de armazenamento.

**A seguir está a lista dos armazenamentos agrupados.**

- `cookie`: os dados da sessão são armazenados dentro de um cookie criptografado. O armazenamento de cookies funciona muito bem com implantações de vários servidores, pois os dados são armazenados com o cliente.

- `file`: os dados da sessão são salvos dentro de um arquivo no servidor. O armazenamento de arquivos só pode ser dimensionado para implantações de vários servidores se você implementar sessões persistentes com o balanceador de carga.

- `redis`: os dados da sessão são armazenados dentro de um banco de dados Redis. O armazenamento redis é recomendado para aplicativos com grandes volumes de dados de sessão e pode ser dimensionado para implantações de vários servidores.

- `dynamodb`: Os dados da sessão são armazenados dentro de uma tabela do Amazon DynamoDB. O armazenamento do DynamoDB é adequado para aplicativos que exigem um armazenamento de sessão altamente escalável e distribuído, especialmente quando a infraestrutura é construída na AWS.

- `memory`: Os dados da sessão são armazenados dentro de um armazenamento de memória global. O armazenamento de memória é usado durante os testes.

Juntamente com os armazenamentos de backend integrados, você também pode criar e [registrar armazenamentos de sessão personalizados](#creating-a-custom-session-store).

## Instalação

Instale e configure o pacote usando o seguinte comando:

```sh
node ace add @adonisjs/session
```

::: details Veja as etapas executadas pelo comando add

1. Instala o pacote `@adonisjs/session` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/session/session_provider')
      ]
    }
    ```

3. Crie o arquivo `config/session.ts`.

4. Defina as seguintes variáveis ​​de ambiente e suas validações.
5. Registra o seguinte middleware dentro do arquivo `start/kernel.ts`.

```dotenv
    SESSION_DRIVER=cookie
    ```

3. Crie o arquivo `config/session.ts`.

4. Defina as seguintes variáveis ​​de ambiente e suas validações.
5. Registra o seguinte middleware dentro do arquivo `start/kernel.ts`.

```ts
    router.use([
      () => import('@adonisjs/session/session_middleware')
    ])
    ```

:::

## Configuração
A configuração do pacote de sessão é armazenada dentro do arquivo `config/session.ts`.

Veja também: [Stub de configuração de sessão](https://github.com/adonisjs/session/blob/main/stubs/config/session.stub)

```ts
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, stores } from '@adonisjs/session'

export default defineConfig({
  age: '2h',
  enabled: true,
  cookieName: 'adonis-session',
  clearWithBrowser: false,

  cookie: {
    path: '/',
    httpOnly: true,
    secure: app.inProduction,
    sameSite: 'lax',
  },

  store: env.get('SESSION_DRIVER'),
  stores: {
    cookie: stores.cookie(),
  }
})
```

### `enabled`

Habilite ou desabilite o middleware temporariamente sem removê-lo da pilha de middleware.

### `cookieName`

O nome do cookie é usado para armazenar o ID da sessão. Sinta-se à vontade para renomeá-lo.

### `clearWithBrowser`

Quando definido como verdadeiro, o cookie do ID da sessão será removido após o usuário fechar a janela do navegador. Este cookie é tecnicamente conhecido como [cookie de sessão](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_the_lifetime_of_a_cookie).

### `age`

A propriedade `age` controla a validade dos dados da sessão sem atividade do usuário. Após a duração fornecida, os dados da sessão são considerados expirados.

### `cookie`

Controle os atributos do cookie de ID da sessão. Veja também [configuração do cookie](./cookies.md#configuration).

### `store`

Defina o armazenamento que você deseja usar para armazenar os dados da sessão. Pode ser um valor fixo ou lido das variáveis ​​de ambiente.

### `stores`

O objeto `stores` é usado para configurar um ou vários armazenamentos de backend.

A maioria dos aplicativos usará um único armazenamento. No entanto, você pode configurar vários armazenamentos e alternar entre eles com base no ambiente em que seu aplicativo está sendo executado.

---

### Configuração de lojas
A seguir está a lista de lojas de backend agrupadas com o pacote `@adonisjs/session`.

```ts
import app from '@adonisjs/core/services/app'
import { defineConfig, stores } from '@adonisjs/session'

export default defineConfig({
  store: env.get('SESSION_DRIVER'),

  // highlight-start
  stores: {
    cookie: stores.cookie(),

    file: stores.file({
      location: app.tmpPath('sessions')
    }),

    redis: stores.redis({
      connection: 'main'
    })

    dynamodb: stores.dynamodb({
      clientConfig: {}
    }),
  }
  // highlight-end
})
```

### `stores.cookie`

A loja `cookie` criptografa e armazena os dados da sessão dentro de um cookie.

### `stores.file`

Defina a configuração para a loja `file`. O método aceita o caminho `location` para armazenar os arquivos da sessão.

### `stores.redis`

Defina a configuração para a loja `redis`. O método aceita o nome `connection` para armazenar os dados da sessão.

Certifique-se de instalar e configurar primeiro o pacote [@adonisjs/redis](../database/redis.md) antes de usar a loja `redis`.

### `stores.dynamodb`

Defina a configuração para a loja `dynamodb`. Você pode passar a [configuração do DynamoDB](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-dynamodb/Interface/DynamoDBClientConfig/) por meio da propriedade `clientConfig` ou passar uma instância do DynamoDB como a propriedade `client`.

```ts
// title: With client config
stores.dynamodb({
  clientConfig: {
    region: 'us-east-1',
    endpoint: '<database-endpoint>',
    credentials: {
      accessKeyId: '',
      secretAccessKey: '',
    }
  },
})
```

```ts
// title: With client instance
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
const client = new DynamoDBClient({})

stores.dynamodb({
  client,
})
```

Além disso, você pode definir um nome de tabela personalizado e um nome de atributo de chave.

```ts
stores.dynamodb({
  tableName: 'Session'
  keyAttributName: 'key'
})
```

---

### Atualizando a validação de variáveis ​​de ambiente
Se você decidir usar armazenamentos de sessão diferentes do padrão, certifique-se de atualizar também a validação de variáveis ​​de ambiente para a variável de ambiente `SESSION_DRIVER`.

Configuramos os armazenamentos `cookie`, `redis` e `dynamodb` no exemplo a seguir. Portanto, também devemos permitir que a variável de ambiente `SESSION_DRIVER` seja uma delas.

```ts
import { defineConfig, stores } from '@adonisjs/session'

export default defineConfig({
  // highlight-start
  store: env.get('SESSION_DRIVER'),

  stores: {
    cookie: stores.cookie(),
    redis: stores.redis({
      connection: 'main'
    })
  }
  // highlight-end
})
```

```ts
// title: start/env.ts
{
  SESSION_DRIVER: Env.schema.enum(['cookie', 'redis', 'memory'] as const)
}
```

## Exemplo básico
Depois que o pacote de sessão for registrado, você pode acessar a propriedade `session` do [HTTP Context](../concepts/http_context.md). A propriedade de sessão expõe a API para ler e gravar dados no armazenamento de sessão.

```ts
import router from '@adonisjs/core/services/router'

router.get('/theme/:color', async ({ params, session, response }) => {
  // highlight-start
  session.put('theme', params.color)
  // highlight-end
  response.redirect('/')
})

router.get('/', async ({ session }) => {
  // highlight-start
  const colorTheme = session.get('theme')
  // highlight-end
  return `You are using ${colorTheme} color theme`
})
```

Os dados da sessão são lidos do armazenamento de sessão no início da solicitação e gravados de volta no armazenamento no final. Portanto, todas as alterações são mantidas na memória até que a solicitação termine.

## Tipos de dados suportados
Os dados da sessão são serializados em uma string usando `JSON.stringify`; portanto, você pode usar os seguintes tipos de dados JavaScript como valores de sessão.

- string
- number
- bigInt
- boolean
- null
- object
- array

```ts
// Object
session.put('user', {
  id: 1,
  fullName: 'virk',
})

// Array
session.put('product_ids', [1, 2, 3, 4])

// Boolean
session.put('is_logged_in', true)

// Number
session.put('visits', 10)

// BigInt
session.put('visits', BigInt(10))

// Data objects are converted to ISO string
session.put('visited_at', new Date())
```

## Lendo e escrevendo dados
A seguir está a lista de métodos que você pode usar para interagir com os dados do objeto `session`.

### `get`
Retorna o valor de uma chave do armazenamento. Você pode usar a notação de ponto para ler valores aninhados.

```ts
session.get('key')
session.get('user.email')
```

Você também pode definir um valor padrão como o segundo parâmetro. O valor padrão será retornado se a chave não existir no armazenamento.

```ts
session.get('visits', 0)
```

### `has`
Verifique se uma chave existe no armazenamento de sessão.

```ts
if (session.has('visits')) {
}
```

### `all`
Retorna todos os dados do armazenamento de sessão. O valor de retorno sempre será um objeto.

```ts
session.all()
```

### `put`
Adicione um par chave-valor ao armazenamento de sessão. Você pode criar objetos com valores aninhados usando a notação de ponto.

```ts
session.put('user', { email: 'foo@bar.com' })

// Same as above
session.put('user.email', 'foo@bar.com')
```

### `forget`
Remove um par de chave-valor do armazenamento de sessão.

```ts
session.forget('user')

// Remove the email from the user object
session.forget('user.email')
```

### `pull`
O método `pull` retorna o valor de uma chave e o remove do armazenamento simultaneamente.

```ts
const user = session.pull('user')
session.has('user') // false
```

### `increment`
O método `increment` incrementa o valor de uma chave. Um novo valor de chave é definido se ele ainda não existir.

```ts
session.increment('visits')

// Increment by 4
session.increment('visits', 4)
```

### `decrement`
O método `decrement` decrementa o valor de uma chave. Um novo valor de chave é definido se ele ainda não existir.

```ts
session.decrement('visits')

// Decrement by 4
session.decrement('visits', 4)
```

### `clear`
O método `clear` remove tudo do armazenamento de sessão.

```ts
session.clear()
```

## Ciclo de vida da sessão
O AdonisJS cria um armazenamento de sessão vazio e o atribui a um ID de sessão exclusivo na primeira solicitação HTTP, mesmo que o ciclo de vida da solicitação/resposta não interaja com as sessões.

Em cada solicitação subsequente, atualizamos a propriedade `maxAge` do cookie do ID da sessão para garantir que ele não expire. O armazenamento de sessão também é notificado sobre as alterações (se houver) para atualizá-las e persisti-las.

Você pode acessar o ID de sessão exclusivo usando a propriedade `sessionId`. O ID de sessão de um visitante permanece o mesmo até que expire.

```ts
console.log(session.sessionId)
```

### Regenerando o ID da sessão
Regenerar o ID da sessão ajuda a evitar um ataque de [fixação de sessão](https://owasp.org/www-community/attacks/Session_fixation) em seu aplicativo. Você deve gerar novamente o ID da sessão ao associar uma sessão anônima a um usuário conectado.

O pacote `@adonisjs/auth` gera novamente o ID da sessão automaticamente, então você não precisa fazer isso manualmente.

```ts
/**
 * New session ID will be assigned at
 * the end of the request
 */
session.regenerate()
```

## Mensagens Flash
Mensagens Flash são usadas para passar dados entre duas solicitações HTTP. Elas são comumente usadas para fornecer feedback ao usuário após uma ação específica. Por exemplo, mostrar a mensagem de sucesso após o envio do formulário ou exibir as mensagens de erro de validação.

No exemplo a seguir, definimos as rotas para exibir o formulário de contato e enviar os detalhes do formulário para o banco de dados. Após o envio do formulário, redirecionamos o usuário de volta ao formulário juntamente com uma notificação de sucesso usando mensagens flash.

```ts
import router from '@adonisjs/core/services/router'

router.post('/contact', ({ session, request, response }) => {
  const data = request.all()
  // Save contact data
  
  // highlight-start
  session.flash('notification', {
    type: 'success',
    message: 'Thanks for contacting. We will get back to you'
  })
  // highlight-end

  response.redirect().back()
})

router.get('/contact', ({ view }) => {
  return view.render('contact')
})
```

Você pode acessar as mensagens flash dentro dos modelos edge usando a tag `flashMessage` ou a propriedade `flashMessages`.

```edge
@flashMessage('notification')
  <div class="notification {{ $message.type }}">
    {{ $message.message }}
  </div>
@end

<form method="POST" action="/contact">
  <!-- Rest of the form -->
</form>
```

Você pode acessar as mensagens flash dentro dos controladores usando a propriedade `session.flashMessages`.

```ts
router.get('/contact', ({ view, session }) => {
  // highlight-start
  console.log(session.flashMessages.all())
  // highlight-end
  return view.render('contact')
})
```

### Erros de validação e mensagens flash
O middleware Session captura automaticamente as [exceções de validação](./validation.md#error-handling) e redireciona o usuário de volta ao formulário. Os erros de validação e os dados de entrada do formulário são mantidos em mensagens flash, e você pode acessá-los dentro dos modelos Edge.

No exemplo a seguir:

[método`old`](../references/edge.md#old).
[tag `@inputError`](../references/edge.md#inputerror).

```edge
<form method="POST" action="/posts">
  <div>
    <label for="title"> Title </label>
    <input 
      type="text"
      id="title"
      name="title"
      value="{{ old('title') || '' }}"
    />

    @inputError('title')
      @each(message in $messages)
        <p> {{ message }} </p>
      @end
    @end
  </div>
</form>
```

### Escrevendo mensagens flash
A seguir estão os métodos para gravar dados no armazenamento de mensagens flash. O método `session.flash` aceita um par de chave-valor e o grava na propriedade de mensagens flash dentro do armazenamento de sessão.

```ts
session.flash('key', value)
session.flash({
  key: value
})
```

Em vez de ler manualmente os dados da solicitação e armazená-los nas mensagens flash, você pode usar um dos seguintes métodos para fazer o flash dos dados do formulário.

```ts
// title: flashAll
/**
 * Short hand for flashing request
 * data
 */
session.flashAll()

/**
 * Same as "flashAll"
 */
session.flash(request.all())
```

```ts
// title: flashOnly
/**
 * Short hand for flashing selected 
 * properties from request data
 */
session.flashOnly(['username', 'email'])

/**
 * Same as "flashOnly"
 */
session.flash(request.only(['username', 'email']))
```

```ts
// title: flashExcept
/**
 * Short hand for flashing selected 
 * properties from request data
 */
session.flashExcept(['password'])

/**
 * Same as "flashExcept"
 */
session.flash(request.except(['password']))
```

Finalmente, você pode fazer o flash das mensagens flash atuais usando o método `session.reflash`.

```ts
session.reflash()
session.reflashOnly(['notification', 'errors'])
session.reflashExcept(['errors'])
```

### Lendo mensagens flash
As mensagens flash só estão disponíveis na solicitação subsequente após o redirecionamento. Você pode acessá-las usando a propriedade `session.flashMessages`.

```ts
console.log(session.flashMessages.all())
console.log(session.flashMessages.get('key'))
console.log(session.flashMessages.has('key'))
```

A mesma propriedade `flashMessages` também é compartilhada com modelos do Edge, e você pode acessá-la da seguinte forma.

Veja também: [Referência de auxiliares do Edge](../references/edge.md#flashmessages)

```edge
{{ flashMessages.all() }}
{{ flashMessages.get('key') }}
{{ flashMessages.has('key') }}
```

Finalmente, você pode acessar uma mensagem flash específica ou um erro de validação usando as seguintes tags do Edge.

```edge
{{-- Read any flash message by key --}}
@flashMessage('key')
  {{ inspect($message) }}
@end

{{-- Read generic errors --}}
@error('key')
  {{ inspect($message) }}
@end

{{-- Read validation errors --}}
@inputError('key')
  {{ inspect($messages) }}
@end
```

## Eventos
Consulte o [guia de referência de eventos](../references/events.md#sessioninitiated) para visualizar a lista de eventos despachados pelo pacote `@adonisjs/session`.

## Criando um armazenamento de sessão personalizado
Os armazenamentos de sessão devem implementar a interface [SessionStoreContract](https://github.com/adonisjs/session/blob/main/src/types.ts#L23C18-L23C38) e definir os seguintes métodos.

```ts
import {
  SessionData,
  SessionStoreFactory,
  SessionStoreContract,
} from '@adonisjs/session/types'

/**
 * The config you want to accept
 */
export type MongoDBConfig = {}

/**
 * Driver implementation
 */
export class MongoDBStore implements SessionStoreContract {
  constructor(public config: MongoDBConfig) {
  }

  /**
   * Returns the session data for a session ID. The method
   * must return null or an object of a key-value pair
   */
  async read(sessionId: string): Promise<SessionData | null> {
  }

  /**
   * Save the session data against the provided session ID
   */
  async write(sessionId: string, data: SessionData): Promise<void> {
  }

  /**
   * Delete session data for the given session ID
   */
  async destroy(sessionId: string): Promise<void> {
  }

  /**
   * Reset the session expiry
   */
  async touch(sessionId: string): Promise<void> {
  }
}

/**
 * Factory function to reference the store
 * inside the config file.
 */
export function mongoDbStore (config: MongoDbConfig): SessionStoreFactory {
  return (ctx, sessionConfig) => {
    return new MongoDBStore(config)
  }
}
```

No exemplo de código acima, exportamos os seguintes valores.

- `MongoDBConfig`: tipo TypeScript para a configuração que você deseja aceitar.

- `MongoDBStore`: a implementação do armazenamento como uma classe. Ele deve aderir à interface `SessionStoreContract`.

- `mongoDbStore`: finalmente, uma função de fábrica para criar uma instância do armazenamento para cada solicitação HTTP.

### Usando o armazenamento

Depois que o armazenamento for criado, você pode referenciá-lo dentro do arquivo de configuração usando a função de fábrica `mongoDbStore`.

```ts
// title: config/session.ts
import { defineConfig } from '@adonisjs/session'
import { mongDbStore } from 'my-custom-package'

export default defineConfig({
  stores: {
    mongodb: mongoDbStore({
      // config goes here
    })
  }
})
```

### Uma nota sobre serialização de dados

O método `write` recebe os dados da sessão como um objeto, e você pode ter que convertê-los em uma string antes de salvá-los. Você pode usar qualquer pacote de serialização para o mesmo ou o auxiliar [MessageBuilder](../references/helpers.md#message-builder) fornecido pelo módulo auxiliares do AdonisJS. Para inspiração, consulte os [session stores](https://github.com/adonisjs/session/blob/main/src/stores/redis.ts#L59) oficiais.
