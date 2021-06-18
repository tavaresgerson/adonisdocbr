# Sessão
O suporte para sessões é fornecido pelo @adonisjs/sessionpacote. O pacote vem pré-configurado com o webmodelo inicial. No entanto, instalar e configurar também é relativamente simples.

#### Instalar
```bash
npm i @adonisjs/session
```

#### Configurar
```bash
node ace configure @adonisjs/session

# CREATE:  config/session.ts
# UPDATE: .env { "SESSION_DRIVER = cookie" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/session" }
```


##### Validar variáveis de ambiente
```ts
/**
 * Certifique-se de adicionar as seguintes regras de validação ao 
 * arquivo `env.ts` para validar as variáveis de ambiente.
 */
export default Env.rules({
  // ...regras existentes
  SESSION_DRIVER: Env.schema.string(),
})
```

* Suporte para vários drivers. **Cookies** , **arquivo** e **Redis**
* Permite instanciar o armazenamento de sessão em modo somente leitura (útil durante solicitações de websocket).
* Suporte para mensagens flash de sessão

* [ver no NPM](https://npm.im/@adonisjs/session)
* [Ver no Github](https://github.com/adonisjs/session)

### Configuração de sessão
Você pode configurar o comportamento da sessão ajustando o arquivo `config/session.ts`. A seguir está o arquivo de configuração padrão.

```ts
// config/session.ts

{
  enabled: true,
  driver: Env.get('SESSION_DRIVER'),
  cookieName: 'adonis-session',
  clearWithBrowser: false,
  age: '2h',
  cookie: {}, // veja o driver de cookie
  file: {}, // veja o driver do arquivo
  redisConnection: 'local', // veja o driver redis
}
```

* `enabled` funciona como um interruptor para ligar/desligar as sessões de todo o aplicativo.
* A propriedade `driver` define o driver a ser usado para armazenar os dados da sessão.
* `cookieName` é o nome do cookie que contém o id da sessão. Sinta-se à vontade para mudar o nome para o que quiser.
* A propriedade `clearWithBrowser` com o valor `true` cria um cookie temporário. Os cookies temporários são removidos quando você sai do navegador.
* A propriedade `age` controla a duração da sessão.
 
### Drivers de sessão
O pacote de sessão permite que você escolha entre um dos drivers disponíveis para salvar os dados da sessão.

Você pode configurar o driver dentro do arquivo `config/session.ts`. A propriedade `driver`, por sua vez, depende da variável de ambiente
`SESSION_DRIVER`.

```ts
// config/session.ts

{
  driver: Env.get('SESSION_DRIVER'),
}
```

#### Cookie driver
O driver do cookie usa os cookies HTTP para armazenar os dados da sessão. Os dados da sessão são criptografados dentro do cookie, 
então você não precisa se preocupar com o vazamento de informações confidenciais.

O driver de cookie também funciona muito bem mesmo quando seu aplicativo está atrás de um balanceador de carga, pois nenhuma informação 
é armazenada no servidor.

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

#### Driver de arquivo
O driver `file` armazena os dados da sessão no sistema de arquivos do servidor. Você pode configurar o local de armazenamento atualizando 
o valor da propriedade `file.location` dentro do arquivo `config/session.ts`.

> A execução de um aplicativo por trás de um balanceador de carga com o driver `file` requer que você habilite sessões persistentes 
> em seu balanceador de carga.

```ts
{
  file: {
    location: Application.tmp('sessions'),
  },
}
```

#### Redis
O driver `redis` é a escolha ideal para manter os dados da sessão apenas no servidor e ainda executar seu aplicativo atrás de um balanceador de carga.

> O driver redis depende do pacote `@adonisjs/redis`. Certifique-se de configurá-lo primeiro.

A configuração do driver redis faz referência a uma das conexões redis predefinidas dentro do arquivo `config/redis.ts`.

```ts
// config/session.ts

{
  driver: 'redis',
  redisConnection: 'local',
}
```

Em seguida, defina uma conexão nomeada como `local` dentro do arquivo `config/redis.ts`.

```ts
/// config/redis.ts

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

#### Ler/escrever valores de sessão
Você pode interagir com as sessões usando a propriedade `ctx.session`.

```ts
Route.get('/', async ({ session }) => {
  // Lê valor
  const cartTotal = session.get('cart_total')

  // Escrever valor
  session.put('cart_total', cartTotal + 10)
})
```

Uma versão somente leitura da sessão também está disponível nos modelos do Edge. Você pode acessá-lo usando o auxiliar global `session`.

```html
<p> Cart total: {{ session.get('cart_total', 0) }} </p>
```

A seguir está a lista de métodos disponíveis para sessões de trabalho.

##### get
Leia o valor de uma determinada chave do armazenamento de sessão. Opcionalmente, você pode definir um valor padrão para 
retornar quando o valor real for `undefined` ou `null`.

> O método a seguir também está disponível nos templates.

```ts
session.get('cart_total')
session.get('cart_total', 0)
```

##### put
Grave um par de valores-chave no armazenamento de sessão. O valor deve ser um dos tipos de dados suportados por cookies.

```ts
session.put('cart_total', 1900)
```

##### all
Leia tudo no armazenamento de sessão. Sempre será um objeto de um par de valores-chave.

> O método a seguir também está disponível nos modelos.

```ts
console.log(session.all())
```

##### forget
Remova o valor de uma determinada chave do armazenamento de sessão.

```ts
// Remove
session.forget('cart_total')

session.get('cart_total') // undefined
```

##### increment
Aumente o valor de uma determinada chave. Certifique-se de que o valor original seja sempre um número. Chamar `increment` em um valor não 
numérico resultará em uma exceção.

```ts
session.increment('page_views')
```

##### decrement
Diminua o valor de uma determinada chave. Certifique-se de que o valor original seja sempre um número. Chamar `decrement` em um valor não numérico 
resultará em uma exceção.

```ts
session.decrement('score')
```

##### clear
Limpe o armazenamento de sessão, e deixe-o em um estado vazio.

```ts
session.clear()
```

### Ciclo de vida de id de sessão
AdonisJS cria um armazenamento de sessão vazio e o atribui a um id de sessão exclusivo na primeira solicitação HTTP, mesmo se o ciclo 
de vida de solicitação/resposta não interagir com as sessões.

Cada solicitação subsequente atualizará a propriedade `maxAge` do cookie de id de sessão para garantir que ele não expire. Além disso, 
o driver da sessão é notificado sobre as alterações (se houver) para atualizar e persistir as alterações.

##### sessionId
Você pode acessar o valor do id da sessão usando a propriedade `sessionId`.

```ts
console.log(session.sessionId)
```

##### initiated
Descubra se o armazenamento de sessão foi iniciado ou não. Durante uma solicitação HTTP, isso sempre será `true`.

```ts
if (!session.initiated) {
  await session.initiate(false)
}
```

##### fresh
Descubra se o id da sessão foi gerado durante a solicitação HTTP atual. O valor é verdadeiro quando o id da sessão foi gerado pela 
primeira vez ou o método `session.regenerate` é chamado.

```ts
if (!session.fresh) {
  session.regenerate()
}
```
 
##### regenerate
Recrie a id de sessão e anexe os dados de sessão existentes a ela. O pacote `auth` usa este método para evitar ataques de sequestro de sessão.

```ts
session.regenerate()
```

### Mensagens flash de sessão
As mensagens Flash ficam no armazenamento de sessão e disponíveis apenas para a próxima solicitação HTTP. Você pode usá-los para passar 
mensagens entre solicitações HTTP. Por exemplo:

```ts
Route.get('/', async ({ session, response }) => {
  session.flash('message', 'Hello world')
  response.redirect('/see-message')
})

Route.get('/see-message', async ({ session }) => {
  return session.flashMessages.get('message')
})
```

##### flash
O método `session.flash` adiciona um par de valores-chave às mensagens flash.

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

##### flashAll
O método `flashAll` adiciona ao corpo da solicitação às mensagens flash. Isso permite que você obtenha os dados do 
formulário dentro de seus modelos e preencha previamente a entrada do usuário após o redirecionamento da falha de validação.

```ts
session.flashAll()
```

##### flashOnly
O método `session.flashOnly` é semelhante ao método `flashAll`. Mas, em vez disso, permite escolher os campos a dedo.

```ts
session.flashOnly(['title', 'description'])
```

##### flashExcept
O método `session.flashExcept` é o oposto do método `flashOnly` e permite ignorar os campos.

```ts
session.flashExcept(['_csrf', 'submit'])
```

##### reflash
O método `session.reflash` mostra os dados da solicitação anterior.

```ts
session.reflash()
```

##### reflashOnly
O método `session.reflashOnly` reexibe somente as chaves selecionadas.

```ts
session.reflashOnly(['errors'])
```

##### reflashExcept
O método `session.reflashExcept` atualiza todos os dados, exceto as chaves mencionadas.

```ts
session.reflashExcept(['success', 'username', 'password'])
```

#### Acessando mensagens flash
Você pode acessar as mensagens flash definidas pela solicitação anterior usando a propriedade `session.flashMessages` ou o auxiliar
`flashMessages` dentro dos modelos edge.

```ts
{{-- Obtenha valor para uma determinada chave --}}
{{ flashMessages.get('errors.title') }}

{{-- Com valor padrão opcional --}}
{{ flashMessages.get('title', '') }}

{{-- Descubra se existe uma chave --}}
{{ flashMessages.has('errors.title') }}

{{-- Pegue tudo --}}
{{ flashMessages.all() }}

{{-- Descubra se o armazenamento está vazio --}}
{{ flashMessages.isEmpty }}
```

```ts
Route.get('/', async ({ session }) => {
  // Obtenha valor para uma determinada chave
  response.flashMessages.get('errors.title')

  // Com valor padrão opcional
  response.flashMessages.get('title', '')

  // Descubra se existe uma chave
  response.flashMessages.has('errors.title')

  // Pegue tudo
  response.flashMessages.all()

  // Descubra se o armazenamento está vazio
  response.flashMessages.isEmpty
})
```

### Outros métodos / propriedades
A seguir está a lista de outros métodos e propriedades disponíveis na classe `Session`.

##### initiate
O método `session.initiate` inicia o armazenamento de sessão para a solicitação HTTP atual. Opcionalmente, 
você pode iniciar a loja no modo `readonly`.

Este método é chamado pelo AdonisJS automaticamente e, portanto, você não terá que chamá-lo manualmente.

```ts
await session.initiate(false)

// Armazenamento somente leitura
await session.initiate(true)
```

##### fresh
Descubra se o id da sessão foi gerado durante a solicitação HTTP atual. O valor é verdadeiro quando o id da sessão foi gerado pela 
primeira vez ou o método `session.regenerate` é chamado.

```ts
if (!session.fresh) {
  session.regenerate()
}
```

##### readonly
Descubra se a loja foi iniciada no modo `readonly` ou não.

Durante as solicitações HTTP, o armazenamento NUNCA está no modo somente leitura. Este sinalizador está reservado para o 
futuro ter uma sessão somente leitura para conexões WebSocket.

```ts
if (!session.readonly) {
  session.put('key', 'value')
}
```

##### commit
O método `commit` persiste as alterações do driver de sessão e atualiza o `maxAge` do cookie no id da sessão. O método `commit` é chamado 
automaticamente pelo AdonisJS e você não precisa se preocupar em chamá-lo.

```ts
await session.commit()
```

### Criação de um driver de sessão personalizado
O pacote de sessão expõe a API para adicionar seus drivers de sessão personalizados. Cada driver de sessão deve aderir ao 
[`SessionDriverContract`](https://github.com/adonisjs/session/blob/6fcea7bb144de18028b1ea693bc7e837cd799fdf/adonis-typings/session.ts#L58-L63).

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

##### read
O método `read` recebe `sessionId` e deve retornar os dados da sessão ou `null`. O valor de retorno deve ser um objeto, semelhante ao que foi 
passado para o método `write`.

##### write
O método `write` recebe o `sessionId` e o objeto `values` a ser armazenado. Você é livre para transformar o objeto de valores em 
qualquer outro tipo de dados que desejar. Por exemplo, o driver `redis` converte o objeto em uma string usando o 
[construtor de mensagem](https://github.com/poppinss/utils#message-builder).

##### destroy
O método `destroy` deve remover o `id` da sessão e seus dados associados do armazenamento.

##### touch
O trabalho do método `touch` é redefinir a expiração. Este método é relevante apenas para drivers com expiração embutida. 
Por exemplo, o driver `redis` atualiza a propriedade `ttl` da chave.

#### Estendendo-se de fora para dentro
Sempre que você estiver estendendo o núcleo da estrutura. É melhor presumir que você não tem acesso ao código do aplicativo e 
suas dependências. Em outras palavras, escreva suas extensões como se estivesse escrevendo um pacote de terceiros e use 
injeção de dependência para contar com outras dependências.

Para fins de demonstração, vamos criar um driver de sessão para armazenar a sessão na memória e começar criando alguns arquivos e pastas.

```bash
mkdir providers/SessionDriver
touch providers/SessionDriver/index.ts
```

A estrutura do diretório terá a seguinte aparência.

```
providers
└── SessionDriver
    └── index.ts
```

Abra o arquivo `SessionDriver/index.ts` e cole o seguinte conteúdo dentro dele.

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

Voila! O driver `memory` está pronto agora. Basta atualizar a propriedade `SESSION_DRIVER` dentro do arquivo `.env` e pronto.

#### Ciclo de vida do driver
Uma nova instância do driver é criada para cada solicitação HTTP. Você pode acessar o contexto HTTP a partir dos argumentos em `Session.extend`
no retorno de chamada do método. Por exemplo:

```ts
Session.get('memory', (sessionManager, config, ctx) => {
  // caso seu driver precise do contexto
  return new Driver(ctx)
})
```

#### Injetando dependências
Conforme mencionado anteriormente, as extensões não devem depender diretamente das dependências do aplicativo e, 
em vez disso, aproveitar a injeção de dependência.

Por exemplo, se seu driver precisa de acesso ao módulo `Encryption`, ele deve aceitá-lo como um argumento do 
construtor em vez de importá-lo diretamente.

```ts
/**
 * A importação de tipo é removido assim que o
 * TypeScript for compilado para JavaScript.
 *
 * Então, idealmente, você não depende de nenhuma importação,
 * apenas use a interface para sugestão de tipo.
 */
import type { EncryptionContract } from '@ioc:Adonis/Core/Encryption'

export class MemoryDriver {
  constructor(private encryption: EncryptionContract) {}

  public async write(sessionId: string, values: { [key: string]: any }) {
    this.encryption.encrypt(JSON.stringify(values))
  }
}
```

Finalmente, você pode injetar o módulo de criptografia durante a chamada de `Session.extend`.

```ts
Session.extend('memory', ({ app }) => {
  return new MemoryDriver(app.container.use('Adonis/Core/Encryption'))
})
```

#### Configuração do driver
Você também deve injetar a configuração do driver por meio do construtor. O método `session.extend` fornece a configuração salva dentro 
do arquivo `config/session.ts`.

A configuração do driver é armazenada dentro de uma propriedade que corresponde ao nome do driver. Por exemplo:

```ts
// config/session.ts

{
  // O seguinte objeto é para o driver de memória
  memory: {}
}
```

```ts
Session.extend('memory', (app, config) => {
  /**
   * O config é o valor da propriedade "memory"
   */
  return new MemoryDriver(config)
})
```
