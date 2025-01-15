---
summary: Aprenda a enviar atualizações em tempo real com SSE do seu servidor AdonisJS usando o pacote Transmit
---

# Transmit

Transmit é um módulo nativo Server-Sent-Event (SSE) opinativo criado para AdonisJS. É uma maneira simples e eficiente de enviar atualizações em tempo real para o cliente, como notificações, mensagens de chat ao vivo ou qualquer outro tipo de dados em tempo real.

::: info NOTA
A transmissão de dados ocorre apenas do servidor para o cliente, não o contrário. Você precisa usar um formulário ou uma solicitação de busca para obter a comunicação do cliente para o servidor.
:::

## Instalação

Instale e configure o pacote usando o seguinte comando :

```sh
node ace add @adonisjs/transmit
```

::: details Veja as etapas executadas pelo comando add

1. Instala o pacote `@adonisjs/transmit` usando o gerenciador de pacotes detectado.
 
2. Registra o provedor de serviços `@adonisjs/transmit/transmit_provider` dentro do arquivo `adonisrc.ts`.
 
3. Cria um novo arquivo `transmit.ts` dentro do diretório `config`.
 
:::

Você também terá que instalar o pacote do cliente Transmit para escutar eventos no lado do cliente.

```sh
npm install @adonisjs/transmit-client
```

## Configuração

A configuração do pacote de transmissão é armazenada no arquivo `config/transmit.ts`.

Veja também: [Config stub](https://github.com/adonisjs/transmit/blob/main/stubs/config/transmit.stub)

```ts
import { defineConfig } from '@adonisjs/transmit'

export default defineConfig({
  pingInterval: false,
  transport: null,
})
```

### `pingInterval`

O intervalo usado para enviar mensagens de ping para o cliente. O valor está em milissegundos ou usando um formato de string `Duration` (por exemplo: `10s`). Defina como `false` para desabilitar mensagens de ping.

### `transport`

O Transmit suporta sincronização de eventos em vários servidores ou instâncias. Você pode habilitar o recurso referenciando a camada de transporte desejada (somente `redis` é suportado por enquanto). Defina como `null` para desabilitar a sincronização.

```ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/transmit'
import { redis } from '@adonisjs/transmit/transports'

export default defineConfig({
  transport: {
    driver: redis({
      host: env.get('REDIS_HOST'),
      port: env.get('REDIS_PORT'),
      password: env.get('REDIS_PASSWORD'),
      keyPrefix: 'transmit',
    })
  }
})
```

::: info NOTA
Certifique-se de ter `ioredis` instalado ao usar o transporte `redis`.
:::

## Registrar rotas

Você precisa registrar as rotas de transmissão para permitir que o cliente se conecte ao servidor. As rotas são registradas manualmente.

```ts
// start/routes.ts

import transmit from '@adonisjs/transmit/services/main'

transmit.registerRoutes()
```

Você também pode registrar cada rota manualmente vinculando o controlador manualmente.

```ts
// start/routes.ts

const EventStreamController = () => import('@adonisjs/transmit/controllers/event_stream_controller')
const SubscribeController = () => import('@adonisjs/transmit/controllers/subscribe_controller')
const UnsubscribeController = () => import('@adonisjs/transmit/controllers/unsubscribe_controller')

router.get('/__transmit/events', [EventStreamController])
router.post('/__transmit/subscribe', [SubscribeController])
router.post('/__transmit/unsubscribe', [UnsubscribeController])
```

Se você quiser modificar a definição da rota, por exemplo, para usar o [`Rate Limiter`](../security/rate_limiting.md) e o middleware auth para evitar abuso de algumas rotas de transmissão, você pode alterar a definição da rota ou passar um retorno de chamada para o método `transmit.registerRoutes`.

```ts
// start/routes.ts

import transmit from '@adonisjs/transmit/services/main'

transmit.registerRoutes((route) => {
  // Certifique-se de que você está autenticado para registrar seu cliente
  if (route.getPattern() === '__transmit/events') {
    route.middleware(middleware.auth())
    return
  }

  // Adicione um middleware de aceleração a outras rotas de transmissão
  route.use(throttle)
})
```

## Canais

Os canais são usados ​​para agrupar eventos. Por exemplo, você pode ter um canal para notificações, outro para mensagens de bate-papo e assim por diante.
Eles são criados na hora quando o cliente os assina.

### Nomes de canais

Os nomes de canais são usados ​​para identificar o canal. Eles diferenciam maiúsculas de minúsculas e devem ser uma string. Você não pode usar caracteres especiais ou espaços no nome do canal, exceto `/`. A seguir estão alguns exemplos de nomes de canais válidos:

```ts
import transmit from '@adonisjs/transmit/services/main'

transmit.broadcast('global', { message: 'Hello' })
transmit.broadcast('chats/1/messages', { message: 'Hello' })
transmit.broadcast('users/1', { message: 'Hello' })
```

::: tip DICA
Os nomes de canais usam a mesma sintaxe que route no AdonisJS, mas não estão relacionados a eles. Você pode definir livremente uma rota http e um canal com a mesma chave.
:::

### Autorização de canal

Você pode autorizar ou rejeitar uma conexão a um canal usando o método `authorize`. O método recebe o nome do canal e o `HttpContext`. Ele deve retornar um valor booleano.

```ts
// start/transmit.ts

import transmit from '@adonisjs/transmit/services/main'
import Chat from '#models/chat'
import type { HttpContext } from '@adonisjs/core/http'

transmit.authorize<{ id: string }>('users/:id', (ctx: HttpContext, { id }) => {
  return ctx.auth.user?.id === +id
})

transmit.authorize<{ id: string }>('chats/:id/messages', async (ctx: HttpContext, { id }) => {
  const chat = await Chat.findOrFail(+id)
  
  return ctx.bouncer.allows('accessChat', chat)
})
```

## Transmitindo eventos

Você pode transmitir eventos para um canal usando o método `broadcast`. O método recebe o nome do canal e os dados para enviar.

```ts
import transmit from '@adonisjs/transmit/services/main'

transmit.broadcast('global', { message: 'Hello' })
```

Você também pode transmitir eventos para qualquer canal, exceto um, usando o método `broadcastExcept`. O método recebe o nome do canal, os dados para enviar e o UID que você deseja ignorar.

```ts
transmit.broadcastExcept('global', { message: 'Hello' }, 'uid-of-sender')
```

### Sincronizando entre vários servidores ou instâncias

Por padrão, a transmissão de eventos funciona apenas no contexto de uma solicitação HTTP. No entanto, você pode transmitir eventos em segundo plano usando o serviço `transmit` se registrar um `transport` na sua configuração.

A camada de transporte é responsável por sincronizar eventos entre vários servidores ou instâncias. Ele funciona transmitindo quaisquer eventos (como eventos transmitidos, assinaturas e cancelamentos de assinaturas) para todos os servidores ou instâncias conectados usando um `Message Bus`.

O servidor ou instância responsável pela conexão do seu cliente receberá o evento e o transmitirá ao cliente.

## Transmit Client

Você pode ouvir eventos no lado do cliente usando o pacote `@adonisjs/transmit-client`. O pacote fornece uma classe `Transmit`. O cliente usa a API [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) por padrão para se conectar ao servidor.

```ts
import { Transmit } from '@adonisjs/transmit-client'

export const transmit = new Transmit({
  baseUrl: window.location.origin
})
```

::: tip DICA
Você deve criar apenas uma instância da classe `Transmit` e reutilizá-la em todo o seu aplicativo.
:::

### Configurando a Instância Transmit

A classe `Transmit` aceita um objeto com as seguintes propriedades:

### `baseUrl`

A URL base do servidor. A URL deve incluir o protocolo (http ou https) e o nome do domínio.

### `uidGenerator`

Uma função que gera um identificador exclusivo para o cliente. A função deve retornar uma string. O padrão é `crypto.randomUUID`.

### `eventSourceFactory`

Uma função que cria uma nova instância `EventSource`. O padrão é a WebAPI [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource). Você precisa fornecer uma implementação personalizada se quiser usar o cliente em `Node.js`, `React Native` ou qualquer outro ambiente que não suporte a API `EventSource`.

### `eventTargetFactory`

Uma função que cria uma nova instância `EventTarget`. O padrão é o WebAPI [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget). Você precisa fornecer uma implementação personalizada se quiser usar o cliente em `Node.js`, `React Native` ou qualquer outro ambiente que não suporte a API `EventTarget`. Retorne `null` para desabilitar a API `EventTarget`.

### `httpClientFactory`

Uma função que cria uma nova instância `HttpClient`. É usada principalmente para fins de teste.

### `beforeSubscribe`

Uma função que é chamada antes de assinar um canal. Ela recebe o nome do canal e o objeto `Request` enviado ao servidor. Use esta função para adicionar cabeçalhos personalizados ou modificar o objeto de solicitação.

### `beforeUnsubscribe`

Uma função que é chamada antes de cancelar a assinatura de um canal. Ela recebe o nome do canal e o objeto `Request` enviado ao servidor. Use esta função para adicionar cabeçalhos personalizados ou modificar o objeto de solicitação.

### `maxReconnectAttempts`

O número máximo de tentativas de reconexão. O padrão é `5`.

### `onReconnectAttempt`

Uma função que é chamada antes de cada tentativa de reconexão e recebe o número de tentativas feitas até o momento. Use esta função para adicionar lógica personalizada.

### `onReconnectFailed`

Uma função que é chamada quando as tentativas de reconexão falham. Use esta função para adicionar lógica personalizada.

### `onSubscribeFailed`

Uma função que é chamada quando a assinatura falha. Ela recebe o objeto `Response`. Use esta função para adicionar lógica personalizada.

### `onSubscription`

Uma função que é chamada quando a assinatura é bem-sucedida. Ela recebe o nome do canal. Use esta função para adicionar lógica personalizada.

### `onUnsubscription`

Uma função que é chamada quando o cancelamento da assinatura é bem-sucedido. Ela recebe o nome do canal. Use esta função para adicionar lógica personalizada.

### Criando uma assinatura

Você pode criar uma assinatura para um canal usando o método `subscription`. O método recebe o nome do canal.

```ts
const subscription = transmit.subscription('chats/1/messages')
await subscription.create()
```

O método `create` registra a assinatura no servidor. Ele retorna uma promessa de que você pode `await` ou `void`.

::: info NOTA
Se você não chamar o método `create`, a assinatura não será registrada no servidor e você não receberá nenhum evento.
:::

### Ouvindo eventos

Você pode ouvir eventos na assinatura usando o método `onMessage` que recebe uma função de retorno de chamada. Você pode chamar o método `onMessage` várias vezes para adicionar diferentes retornos de chamada.

```ts
subscription.onMessage((data) => {
  console.log(data)
})
```

Você também pode ouvir um canal apenas uma vez usando o método `onMessageOnce` que recebe uma função de retorno de chamada.

```ts
subscription.onMessageOnce(() => {
  console.log('I will be called only once')
})
```

### Parar de ouvir eventos

Os métodos `onMessage` e `onMessageOnce` retornam uma função que você pode chamar para parar de ouvir um retorno de chamada específico.

```ts
const stopListening = subscription.onMessage((data) => {
  console.log(data)
})

// Pare de ouvir
stopListening()
```

### Excluindo uma assinatura

Você pode excluir uma assinatura usando o método `delete`. O método retorna uma promessa que você pode `await` ou `void`. Este método cancelará o registro da assinatura no servidor.

```ts
await subscription.delete()
```

## Evitando a interferência do GZip

Ao implantar aplicativos que usam `@adonisjs/transmit`, é importante garantir que a compactação do GZip não interfira no tipo de conteúdo `text/event-stream` usado por Eventos Enviados pelo Servidor (SSE). A compactação aplicada ao `text/event-stream` pode causar problemas de conexão, levando a desconexões frequentes ou falhas do SSE.

Se sua implantação usar um proxy reverso (como Traefik ou Nginx) ou outro middleware que aplique GZip, certifique-se de que a compactação esteja desabilitada para o tipo de conteúdo `text/event-stream`.

### Exemplo de configuração para o Traefik

```txt
traefik.http.middlewares.gzip.compress=true
traefik.http.middlewares.gzip.compress.excludedcontenttypes=text/event-stream
traefik.http.routers.my-router.middlewares=gzip
```

