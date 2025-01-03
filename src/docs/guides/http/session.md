# Sessão

O suporte para sessões é fornecido pelo pacote `@adonisjs/session`. O pacote vem pré-configurado com o modelo inicial `web`. No entanto, instalá-lo e configurá-lo também é relativamente simples.

::: code-group

```sh [Instale]
npm i @adonisjs/session@6.4.0
```

```sh [Configure]
node ace configure @adonisjs/session

# CREATE:  config/session.ts
# UPDATE: .env { "SESSION_DRIVER = cookie" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/session" }
```

```ts [Valide as variáveis ​​de ambiente]
/**
 * Certifique-se de adicionar as seguintes regras de validação ao arquivo
 * `env.ts` para validar as variáveis ​​de ambiente.
 */
export default Env.rules({
  // ...regras existentes
  SESSION_DRIVER: Env.schema.string(),
})
```

:::

- Suporte para vários drivers. **Cookies**, **File** e **Redis**
- Permite instanciar o armazenamento de sessão no modo somente leitura (útil durante solicitações de websocket).
- Suporte para mensagens flash de sessão

&nbsp;

- [Visualizar no npm](https://npm.im/@adonisjs/session)
- [Visualizar no GitHub](https://github.com/adonisjs/session)

## Configuração da sessão

Você pode configurar o comportamento da sessão ajustando o arquivo `config/session.ts`. A seguir está o arquivo de configuração padrão.

```ts
// config/session.ts

import { sessionConfig } from '@adonisjs/session/build/config'

export default sessionConfig({
  enabled: true,
  driver: Env.get('SESSION_DRIVER'),
  cookieName: 'adonis-session',
  clearWithBrowser: false,
  age: '2h',
  cookie: {}, // veja o driver do cookie
  file: {}, // veja o driver do arquivo
  redisConnection: 'local', // veja o driver do redis
})
```

- **enabled** funciona como um interruptor para ligar/desligar sessões para todo o aplicativo.
- A propriedade **driver** define o driver a ser usado para armazenar os dados da sessão.
- **cookieName** é o nome do cookie que contém o ID da sessão. Sinta-se à vontade para alterar o nome para o que quiser.
- A propriedade **clearWithBrowser** com o valor `true` cria um cookie temporário. Os cookies temporários são removidos quando você sai do navegador.
- A propriedade **age** controla a duração da sessão.

## Drivers de sessão

O pacote de sessão permite que você escolha entre um dos drivers disponíveis para salvar os dados da sessão.

Você pode configurar o driver dentro do arquivo `config/session.ts`. A propriedade `driver`, por sua vez, depende da variável de ambiente `SESSION_DRIVER`.

```ts
// config/session.ts

{
  driver: Env.get('SESSION_DRIVER'),
}
```

### Driver de cookie

O driver de cookie usa os cookies HTTP para armazenar os dados da sessão. Os dados da sessão são criptografados dentro do cookie, então você não precisa se preocupar em vazar informações confidenciais.

O driver de cookie também funciona muito bem mesmo quando seu aplicativo está atrás de um balanceador de carga, já que nenhuma informação é armazenada no servidor.

Você pode ajustar as configurações do driver `cookie` dentro do arquivo `config/session.ts`.

```ts
{
  /*
  |---------------------------------------------------------------
  | Cookies config
  |---------------------------------------------------------------
  |
  | The cookie settings are used to set up the session id cookie
  | and also the driver will use the same values.
  |
  */
  cookie: {
    path: '/',
    httpOnly: true,
    sameSite: false,
  },
}
```

### Driver de arquivo

O driver `file` armazena os dados da sessão no sistema de arquivos do servidor. Você pode configurar o local de armazenamento atualizando o valor da propriedade `file.location` dentro do arquivo `config/session.ts`.

::: info NOTA
Executar um aplicativo atrás de um balanceador de carga com o driver `file` requer que você habilite sessões persistentes no seu balanceador de carga.
:::

```ts
{
  file: {
    location: Application.tmp('sessions'),
  },
}
```

### Redis

O driver `redis` é uma escolha ideal para manter os dados da sessão somente no servidor e ainda executar seu aplicativo atrás de um balanceador de carga.

::: info NOTA
O driver redis depende do pacote `@adonisjs/redis`. Certifique-se de configurá-lo primeiro.
:::

A configuração do driver redis faz referência a uma das conexões redis predefinidas dentro do arquivo `config/redis.ts`.

```ts {5}
// config/session.ts

{
  driver: 'redis',
  redisConnection: 'local',
}
```

Em seguida, defina uma conexão chamada `local` dentro do arquivo `config/redis.ts`.

```ts {5-10}
// config/redis.ts

{
  connections: {
    local: {
      host: Env.get('REDIS_HOST'),
      port: Env.get('REDIS_PORT'),
      password: Env.get('REDIS_PASSWORD', ''),
      db: 0,
    }
  }
}
```

## Ler/Escrever valores de sessão

Você pode interagir com sessões usando a propriedade `ctx.session`.

```ts
Route.get('/', async ({ session }) => {
  // Ler valor
  const cartTotal = session.get('cart_total')

  // Escrever valor
  session.put('cart_total', cartTotal + 10)
})
```

Uma versão somente leitura da sessão também está disponível dentro dos modelos do Edge. Você pode acessá-la usando o auxiliar global `session`.

```edge
<p> Cart total: {{ session.get('cart_total', 0) }} </p>
```

A seguir está a lista de métodos disponíveis para trabalhar com sessões.

### `get`

Lê o valor de uma determinada chave do armazenamento de sessão. Opcionalmente, você pode definir um valor padrão para retornar quando o valor real for `undefined` ou `null`.

::: info NOTA
O método a seguir também está disponível dentro dos modelos.
:::

```ts
session.get('cart_total')
session.get('cart_total', 0)
```

### `put`

Grava um par de chave-valor no armazenamento de sessão. O valor deve ser um dos [tipos de dados suportados por cookies](./cookies.md#supported-data-types).

```ts
session.put('cart_total', 1900)
```

### `all`

Lê tudo do armazenamento de sessão. Sempre será um objeto de um par de chave-valor.

::: info NOTA
O método a seguir também está disponível dentro dos modelos.
:::

```ts
console.log(session.all())
```

### `forget`

Remove o valor de uma determinada chave do armazenamento de sessão.

```ts
// Remove
session.forget('cart_total')

session.get('cart_total') // undefined
```

### `increment`

Aumenta o valor de uma determinada chave. Certifique-se de que o valor original seja sempre um número. Chamar `increment` em um valor não numérico resultará em uma exceção.

```ts
session.increment('page_views')
```

### `decrement`

Decrementa o valor de uma determinada chave. Certifique-se de que o valor original seja sempre um número. Chamar `decrement` em um valor não numérico resultará em uma exceção.

```ts
session.decrement('score')
```

### `clear`

Limpa o armazenamento de sessão para um estado vazio.

```ts
session.clear()
```

## Ciclo de vida do ID de sessão

O AdonisJS cria um armazenamento de sessão vazio e o atribui a um ID de sessão exclusivo na primeira solicitação HTTP, mesmo que o ciclo de vida da solicitação/resposta não interaja com as sessões.

Cada solicitação subsequente atualizará a propriedade `maxAge` do cookie do ID de sessão para garantir que ele não expire. Além disso, o driver de sessão é notificado sobre as alterações (se houver) para atualizar e persistir as alterações.

### `sessionId`

Você pode acessar o valor do ID de sessão usando a propriedade `sessionId`.

```ts
console.log(session.sessionId)
```

### `initiated`

Descubra se o armazenamento de sessão foi iniciado ou não. Durante uma solicitação HTTP, isso sempre será `true`.

```ts
if (!session.initiated) {
  await session.initiate(false)
}
```

### `fresh`

Descubra se o ID da sessão foi gerado durante a solicitação HTTP atual. O valor é **true** quando o ID da sessão foi gerado pela primeira vez ou o método `session.regenerate` é chamado.

```ts
if (!session.fresh) {
  session.regenerate()
}
```

### `regenerate`

Gere novamente o ID da sessão e anexe dados de sessão existentes a ele. O pacote auth usa esse método para evitar [ataques de sequestro de sessão](https://www.netsparker.com/blog/web-security/session-hijacking/).

```ts
session.regenerate()
```

## Mensagens flash de sessão

As mensagens flash são armazenadas dentro do repositório de sessão e estão disponíveis apenas para a próxima solicitação HTTP. Você pode usá-las para passar mensagens entre solicitações HTTP. Por exemplo:

```ts {2,7}
Route.get('/', async ({ session, response }) => {
  session.flash('message', 'Hello world')
  response.redirect('/see-message')
})

Route.get('/see-message', async ({ session }) => {
  return session.flashMessages.get('message')
})
```

<video src="/docs/assets/flash-message.mp4" controls />

### `flash`

O método `session.flash` adiciona um par de chave-valor às mensagens flash.

```ts
session.flash('errors', {
  title: 'Post title is required',
  description: 'Post description is required',
})
```

Você também pode passar o objeto diretamente para o método `flash`.

```ts
session.flash({
  errors: {
    title: 'Post title is required',
    description: 'Post description is required',
  },
})
```

### `flashAll`

O método `flashAll` adiciona o corpo da solicitação às mensagens flash. Isso permite que você obtenha os dados do formulário dentro dos seus modelos e preencha previamente a entrada do usuário após o redirecionamento da falha de validação.

```ts
session.flashAll()
```

### `flashOnly`

O método `session.flashOnly` é semelhante ao método `flashAll`. Mas, em vez disso, ele permite selecionar os campos.

```ts
session.flashOnly(['title', 'description'])
```

### `flashExcept`

O método `session.flashExcept` é o oposto do método `flashOnly` e permite ignorar os campos.

```ts
session.flashExcept(['_csrf', 'submit'])
```

### `reflash`
O método `session.reflash` atualiza os dados da solicitação anterior.

```ts
session.reflash()
```

### `reflashOnly`
O método `session.reflashOnly` atualiza apenas as chaves selecionadas.

```ts
session.reflashOnly(['errors'])
```

### `reflashExcept`
O método `session.reflashExcept` atualiza todos os dados, exceto as chaves mencionadas.

```ts
session.reflashExcept(['success', 'username', 'password'])
```

### Acessando mensagens flash

Você pode acessar as mensagens flash definidas pela solicitação anterior usando a propriedade `session.flashMessages` ou o auxiliar `flashMessages` dentro dos modelos Edge.

```edge
<!-- Dentro do template -->

{{-- Obter valor para uma chave fornecida --}}
{{ flashMessages.get('errors.title') }}

{{-- Com valor padrão opcional --}}
{{ flashMessages.get('title', '') }}

{{-- Descobrir se uma chave existe --}}
{{ flashMessages.has('errors.title') }}

{{-- Obter tudo --}}
{{ flashMessages.all() }}

{{-- Descobrir se o armazenamento está vazio --}}
{{ flashMessages.isEmpty }}
```

```ts
Route.get('/', async ({ session }) => {
  // Obter valor para uma chave fornecida
  session.flashMessages.get('errors.title')

  // Com valor padrão opcional
  session.flashMessages.get('title', '')

  // Descobrir se uma chave existe
  session.flashMessages.has('errors.title')

  // Obter tudo
  session.flashMessages.all()

  // Descobrir se o armazenamento está vazio
  session.flashMessages.isEmpty
})
```

## Outros métodos/propriedades

A seguir está a lista de outros métodos e propriedades disponíveis na classe Session.

### `initiate`

O método `session.initiate` inicia o armazenamento de sessão para a solicitação HTTP atual. Opcionalmente, você pode iniciar o armazenamento no modo `readonly`.

::: info NOTA
Este método é [chamado](https://github.com/adonisjs/session/blob/6fcea7bb144de18028b1ea693bc7e837cd799fdf/providers/SessionProvider.ts#L52-L54) pelo AdonisJS automaticamente, e, portanto, você não precisará chamá-lo manualmente.
:::

```ts
await session.initiate(false)

// store somente para leitura
await session.initiate(true)
```

### `fresh`

Descubra se o ID da sessão foi gerado durante a solicitação HTTP atual. O valor é **true** quando o ID da sessão foi gerado pela primeira vez ou o método `session.regenerate` é chamado.

```ts
if (!session.fresh) {
  session.regenerate()
}
```

### `readonly`

Descubra se o armazenamento foi iniciado no modo `readonly` ou não.

::: warning NOTA
Durante solicitações HTTP, o armazenamento **NUNCA** está no modo somente leitura. Este sinalizador é reservado para o futuro para ter uma sessão somente leitura para conexões WebSocket.
:::

```ts
if (!session.readonly) {
  session.put('key', 'value')
}
```

### `commit`

O método `commit` persiste as alterações do driver de sessão e atualiza o `maxAge` do cookie de ID de sessão. O método `commit` é [chamado](https://github.com/adonisjs/session/blob/6fcea7bb144de18028b1ea693bc7e837cd799fdf/providers/SessionProvider.ts#L59-L61) automaticamente pelo AdonisJS, e você não precisa se preocupar em chamá-lo.

```ts
await session.commit()
```

## Criando um driver de sessão personalizado

O pacote de sessão expõe a API para adicionar seus drivers de sessão personalizados. Cada driver de sessão deve aderir ao [SessionDriverContract](https://github.com/adonisjs/session/blob/6fcea7bb144de18028b1ea693bc7e837cd799fdf/adonis-typings/session.ts#L58-L63).

```ts
interface SessionDriverContract {
  read(
    sessionId: string
  ): Promise<Record<string, any> | null> | Record<string, any> | null

  write(sessionId: string, values: Record<string, any>): Promise<void> | void

  destroy(sessionId: string): Promise<void> | void

  touch(sessionId: string): Promise<void> | void
}
```

#### `read`

O método `read` recebe o `sessionId` e deve retornar os dados da sessão ou `null`. O valor de retorno deve ser um objeto, semelhante ao que foi passado para o método `write`.

#### `write`

O método `write` recebe o `sessionId` e o objeto `values` para armazenar. Você é livre para transformar o objeto values ​​em qualquer outro tipo de dado que desejar. Por exemplo, o driver `redis` [converte](https://github.com/adonisjs/session/blob/6fcea7bb144de18028b1ea693bc7e837cd799fdf/src/Drivers/Redis.ts#L55) o objeto em uma string usando o [construtor de mensagens](https://github.com/poppinss/utils#message-builder).

#### `destroy`

O método `destroy` deve remover o ID da sessão e seus dados associados do armazenamento.

#### `touch`

O trabalho do método `touch` é redefinir a expiração. Este método é relevante apenas para drivers com expiração interna. Por exemplo, o driver redis atualiza a propriedade `ttl` da chave redis.

### Estendendo de fora para dentro

Sempre que você estiver estendendo o núcleo da estrutura. É melhor assumir que você não tem acesso ao código do aplicativo e suas dependências. Em outras palavras, escreva suas extensões como se estivesse escrevendo um pacote de terceiros e use injeção de dependência para confiar em outras dependências.

Para fins de demonstração, vamos criar um driver de sessão para armazenar a sessão na memória e começar criando alguns arquivos e pastas.

```sh
mkdir providers/SessionDriver
touch providers/SessionDriver/index.ts
```

A estrutura do diretório será a seguinte.

```
providers
└── SessionDriver
    └── index.ts
```

Abra o arquivo ``SessionDriver/index.ts` e cole o seguinte conteúdo dentro dele.

```ts
// providers/SessionDriver/index.ts

import { SessionDriverContract } from '@ioc:Adonis/Addons/Session'

const SESSIONS: Map<string, Record<string, any>> = new Map()

export class MemoryDriver implements SessionDriverContract {
  public async read(sessionId: string) {
    return SESSIONS.get(sessionId) || null
  }

  public async write(sessionId: string, values: Record<string, any>) {
    SESSIONS.set(sessionId, values)
  }

  public async destroy(sessionId: string) {
    SESSIONS.delete(sessionId)
  }

  public async touch() {}
}
```

Finalmente, abra o arquivo `providers/AppProvider.ts` e adicione o driver personalizado dentro do método `boot`.

```ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const { MemoryDriver } = await import('./SessionDriver')
    const Session = this.app.container.use('Adonis/Addons/Session')

    Session.extend('memory', () => {
      return new MemoryDriver()
    })
  }
}
```

Voilá! O driver `memory` está pronto agora. Basta atualizar a propriedade `SESSION_DRIVER` dentro do arquivo `.env` e pronto.

### Ciclo de vida do driver

Uma nova instância do driver é criada para cada solicitação HTTP. Você pode acessar o contexto HTTP a partir dos argumentos de retorno de chamada do método `Session.extend`. Por exemplo:

```ts
Session.get('memory', (sessionManager, config, ctx) => {
  // caso seu drive precise de contexto
  return new Driver(ctx)
})
```

### Injetando dependências

Conforme mencionado anteriormente, as extensões não devem depender diretamente das dependências do aplicativo e, em vez disso, aproveitar a injeção de dependência.

Por exemplo, se seu driver precisar de acesso ao módulo Encryption, ele deve aceitá-lo como um argumento do construtor em vez de importá-lo diretamente.

```ts
/**
 * O seguinte é importação somente de tipo e é removido
 * assim que o TypeScript é compilado para JavaScript.
 *
 * Então, idealmente, você não está contando com nenhuma importação
 * de nível superior, apenas usando a interface para dicas de tipo.
 */
import type { EncryptionContract } from '@ioc:Adonis/Core/Encryption'

export class MemoryDriver {
  constructor(private encryption: EncryptionContract) {}

  public async write(sessionId: string, values: { [key: string]: any }) {
    this.encryption.encrypt(JSON.stringify(values))
  }
}
```

Finalmente, você pode injetar o módulo de criptografia durante a chamada `Session.extend`.

```ts
Session.extend('memory', ({ app }) => {
  return new MemoryDriver(app.container.use('Adonis/Core/Encryption'))
})
```

### Configuração do driver

Você também deve injetar a configuração do driver por meio do construtor. O método `session.extend` fornece a configuração salva dentro do arquivo `config/session.ts`.

A configuração do driver é armazenada dentro de uma propriedade que corresponde ao nome do driver. Por exemplo:

```ts
// config/session.ts

{
  // O objeto a seguir é para o driver de memória
  memory: {}
}
```

```ts
Session.extend('memory', (app, config) => {
  /**
   * A configuração é o valor da propriedade "memory"
   */
  return new MemoryDriver(config)
})
```
