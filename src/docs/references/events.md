---
resumo: Aprenda sobre os eventos despachados pelo núcleo do framework AdonisJS e pacotes oficiais.
---

# Referência de eventos

Neste guia, olhamos para a lista de eventos despachados pelo núcleo do framework e pelos pacotes oficiais. Confira a documentação do [emitter](../digging_deeper/emitter.md) para saber mais sobre seu uso.

## `http:request_completed`

O evento [`http:request_completed`](https://github.com/adonisjs/http-server/blob/main/src/types/server.ts#L65) é despachado após uma solicitação HTTP ser concluída. O evento contém uma instância do [HttpContext](../concepts/http_context.md) e a duração da solicitação. O valor `duration` é a saída do método `process.hrtime`.

```ts
import emitter from '@adonisjs/core/services/emitter'
import string from '@adonisjs/core/helpers/string'

emitter.on('http:request_completed', (event) => {
  const method = event.ctx.request.method()
  const url = event.ctx.request.url(true)
  const duration = event.duration

  console.log(`${method} ${url}: ${string.prettyHrTime(duration)}`)
})
```

## `http:server_ready`
O evento é despachado quando o servidor HTTP AdonisJS está pronto para aceitar solicitações de entrada.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('http:server_ready', (event) => {
  console.log(event.host)
  console.log(event.port)

  /**
   * Tempo que levou para inicializar o aplicativo e iniciar
   * o servidor HTTP.
   */
  console.log(event.duration)
})
```

## `container_binding:resolved`

O evento é despachado após o contêiner IoC resolver uma vinculação ou construir uma instância de classe. A propriedade `event.binding` será uma string (nome da vinculação) ou um construtor de classe, e a propriedade `event.value` é o valor resolvido.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('container_binding:resolved', (event) => {
  console.log(event.binding)
  console.log(event.value)
})
```

## `session:initiated`
O pacote `@adonisjs/session` emite o evento quando o armazenamento de sessão é iniciado durante uma solicitação HTTP. A propriedade `event.session` é uma instância da [classe Session](https://github.com/adonisjs/session/blob/main/src/session.ts).

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('session:initiated', (event) => {
  console.log(`Initiated store for ${event.session.sessionId}`)
})
```

## `session:committed`
O pacote `@adonisjs/session` emite o evento quando os dados da sessão são gravados no armazenamento de sessão durante uma solicitação HTTP.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('session:committed', (event) => {
  console.log(`Persisted data for ${event.session.sessionId}`)
})
```

## `session:migrated`
O pacote `@adonisjs/session` emite o evento quando um novo ID de sessão é gerado usando o método `session.regenerate()`.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('session:migrated', (event) => {
  console.log(`Migrating data to ${event.toSessionId}`)
  console.log(`Destroying session ${event.fromSessionId}`)
})
```

## `i18n:missing:translation`
O evento é despachado pelo pacote `@adonisjs/i18n` quando uma tradução para uma chave e localidade específica está faltando. Você pode ouvir este evento para encontrar as traduções faltantes para uma determinada localidade.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('i18n:missing:translation', function (event) {
  console.log(event.identifier)
  console.log(event.hasFallback)
  console.log(event.locale)
})
```

## `mail:sending`
O pacote `@adonisjs/mail` emite o evento antes de enviar um e-mail. No caso da chamada do método `mail.sendLater`, o evento será emitido quando a fila de e-mail processar o trabalho.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('mail:sending', (event) => {
  console.log(event.mailerName)
  console.log(event.message)
  console.log(event.views)
})
```

## `mail:sent`
Após enviar o e-mail, o evento é despachado pelo pacote `@adonisjs/mail`.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('mail:sent', (event) => {
  console.log(event.response)

  console.log(event.mailerName)
  console.log(event.message)
  console.log(event.views)
})
```

## `mail:queueing`
O pacote `@adonisjs/mail` emite o evento antes de enfileirar o trabalho para enviar o e-mail.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('mail:queueing', (event) => {
  console.log(event.mailerName)
  console.log(event.message)
  console.log(event.views)
})
```

## `mail:queued`
Após o e-mail ter sido enfileirado, o evento é despachado pelo pacote `@adonisjs/mail`.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('mail:queued', (event) => {
  console.log(event.mailerName)
  console.log(event.message)
  console.log(event.views)
})
```

## `queued:mail:error`
O evento é despachado quando a implementação [MemoryQueue](https://github.com/adonisjs/mail/blob/main/src/messengers/memory_queue.ts) do pacote `@adonisjs/mail` não consegue enviar o e-mail enfileirado usando o método `mail.sendLater`.

Se você estiver usando uma implementação de fila personalizada, você deve capturar os erros de trabalho e emitir este evento.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('queued:mail:error', (event) => {
  console.log(event.error)
  console.log(event.mailerName)
})
```

## `session_auth:login_attempted`

O evento é despachado pela implementação [SessionGuard](https://github.com/adonisjs/auth/blob/main/src/guards/session/guard.ts) do pacote `@adonisjs/auth` quando o método `auth.login` é chamado direta ou internamente pelo guarda de sessão.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('session_auth:login_attempted', (event) => {
  console.log(event.guardName)
  console.log(event.user)
})
```

## `session_auth:login_succeeded`

O evento é despachado pela implementação [SessionGuard](https://github.com/adonisjs/auth/blob/main/src/guards/session/guard.ts) do pacote `@adonisjs/auth` após um usuário ter efetuado login com sucesso.

Você pode usar este evento para rastrear sessões associadas a um determinado usuário.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('session_auth:login_succeeded', (event) => {
  console.log(event.guardName)
  console.log(event.sessionId)
  console.log(event.user)
  console.log(event.rememberMeToken) // (se criado um)
})
```

## `session_auth:authentication_attempted`
O evento é despachado pelo pacote `@adonisjs/auth` quando uma tentativa é feita para validar a sessão de solicitação e verificar se há um usuário conectado.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('session_auth:authentication_attempted', (event) => {
  console.log(event.guardName)
  console.log(event.sessionId)
})
```

## `session_auth:authentication_succeeded`
O evento é despachado pelo pacote `@adonisjs/auth` após a sessão de solicitação ter sido validada e o usuário estar conectado. Você pode acessar o usuário conectado usando a propriedade `event.user`.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('session_auth:authentication_succeeded', (event) => {
  console.log(event.guardName)
  console.log(event.sessionId)

  console.log(event.user)
  console.log(event.rememberMeToken) // se autenticado usando token
})
```

## `session_auth:authentication_failed`
O evento é despachado pelo pacote `@adonisjs/auth` quando a verificação de autenticação falha e o usuário não está conectado durante a solicitação HTTP atual.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('session_auth:authentication_failed', (event) => {
  console.log(event.guardName)
  console.log(event.sessionId)

  console.log(event.error)
})
```

## `session_auth:logged_out`
O evento é despachado pelo pacote `@adonisjs/auth` após o usuário ter sido desconectado.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('session_auth:logged_out', (event) => {
  console.log(event.guardName)
  console.log(event.sessionId)

  /**
   * O valor do usuário será nulo quando o logout for chamado
   * durante uma solicitação em que nenhum usuário estava logado em primeiro lugar.
   */
  console.log(event.user)
})
```

## `access_tokens_auth:authentication_attempted`
O evento é despachado pelo pacote `@adonisjs/auth` quando uma tentativa é feita para validar o token de acesso durante uma solicitação HTTP.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('access_tokens_auth:authentication_attempted', (event) => {
  console.log(event.guardName)
})
```

## `access_tokens_auth:authentication_succeeded`
O evento é despachado pelo pacote `@adonisjs/auth` após o token de acesso ter sido verificado. Você pode acessar o usuário autenticado usando a propriedade `event.user`.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('access_tokens_auth:authentication_succeeded', (event) => {
  console.log(event.guardName)
  console.log(event.user)
  console.log(event.token)
})
```

## `access_tokens_auth:authentication_failed`
O evento é despachado pelo pacote `@adonisjs/auth` quando a verificação de autenticação falha.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('access_tokens_auth:authentication_failed', (event) => {
  console.log(event.guardName)
  console.log(event.error)
})
```

## `authorization:finished`
O evento é despachado pelo pacote `@adonisjs/bouncer` após a verificação de autorização ter sido realizada. A carga útil do evento inclui a resposta final que você pode inspecionar para saber o status da verificação.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('authorization:finished', (event) => {
  console.log(event.user)
  console.log(event.response)
  console.log(event.parameters)
  console.log(event.action) 
})
```
