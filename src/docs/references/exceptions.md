---
resumo: Aprenda sobre as exceções geradas pelo núcleo do framework AdonisJS e pacotes oficiais.
---

# Referência de exceções

Neste guia, examinaremos a lista de exceções conhecidas geradas pelo núcleo do framework e pelos pacotes oficiais. Algumas das exceções são marcadas como **automanipuladas**. [Exceções automanipuladas](../basics/exception_handling.md#defining-the-handle-method) podem se converter em uma resposta HTTP.

## E_ROUTE_NOT_FOUND
A exceção é gerada quando o servidor HTTP recebe uma solicitação para uma rota inexistente. Por padrão, o cliente receberá uma resposta 404 e, opcionalmente, você pode renderizar uma página HTML usando [páginas de status](../basics/exception_handling.md#status-pages).

- **Código de status**: 404
- **Autogerenciado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_ROUTE_NOT_FOUND) {
  // handle error
}
```

## E_ROW_NOT_FOUND
A exceção é gerada quando a consulta ao banco de dados para encontrar um item falha [por exemplo, ao usar `Model.findOrFail()`]. Por padrão, o cliente receberá uma resposta 404 e, opcionalmente, você pode renderizar uma página HTML usando [páginas de status](../basics/exception_handling.md#status-pages).

- **Código de status**: 404
- **Autogerenciado**: Não

```ts
import { errors as lucidErrors } from '@adonisjs/lucid'
if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
  // handle error
  console.log(`${error.model?.name || 'Row'} not found`)
}
```

## E_AUTHORIZATION_FAILURE
A exceção é gerada quando uma verificação de autorização do bouncer falha. A exceção é autogerenciada e [usa negociação de conteúdo](../security/authorization.md#throwing-authorizationexception) para retornar uma resposta de erro apropriada ao cliente.

- **Código de status**: 403
- **Autogerenciado**: Sim
- **Identificador de tradução**: `errors.E_AUTHORIZATION_FAILURE`

```ts
import { errors as bouncerErrors } from '@adonisjs/bouncer'
if (error instanceof bouncerErrors.E_AUTHORIZATION_FAILURE) {
}
```

## E_TOO_MANY_REQUESTS
A exceção é gerada pelo pacote [@adonisjs/rate-limiter](../security/rate_limiting.md) quando uma solicitação esgota todas as solicitações permitidas durante uma duração determinada. A exceção é autogerenciada e [usa negociação de conteúdo](../security/rate_limiting.md#handling-throttleexception) para retornar uma resposta de erro apropriada ao cliente.

- **Código de status**: 429
- **Automanipulado**: Sim
- **Identificador de tradução**: `errors.E_TOO_MANY_REQUESTS`

```ts
import { errors as limiterErrors } from '@adonisjs/limiter'
if (error instanceof limiterErrors.E_TOO_MANY_REQUESTS) {
}
```

## E_BAD_CSRF_TOKEN
A exceção é gerada quando um formulário usando [proteção CSRF](../security/securing_ssr_applications.md#csrf-protection) é enviado sem o token CSRF, ou o token CSRF é inválido.

- **Código de status**: 403
- **Automanipulado**: Sim
- **Identificador de tradução**: `errors.E_BAD_CSRF_TOKEN`

```ts
import { errors as shieldErrors } from '@adonisjs/shield'
if (error instanceof shieldErrors.E_BAD_CSRF_TOKEN) {
}
```

A exceção `E_BAD_CSRF_TOKEN` é [automanipulada](https://github.com/adonisjs/shield/blob/main/src/errors.ts#L20), e o usuário será redirecionado de volta ao formulário, e você pode acessar o erro usando as mensagens flash.

```edge
@error('E_BAD_CSRF_TOKEN')
  <p>{{ message }}</p>
@end
```

## E_OAUTH_MISSING_CODE
O pacote `@adonisjs/ally` gera a exceção quando o serviço OAuth não fornece o código OAuth durante o redirecionamento.

Você pode evitar essa exceção se [lidar com os erros](../authentication/social_authentication.md#handling-callback-response) antes de chamar os métodos `.accessToken` ou `.user`.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors as allyErrors } from '@adonisjs/bouncer'
if (error instanceof allyErrors.E_OAUTH_MISSING_CODE) {
}
```

## E_OAUTH_STATE_MISMATCH
O pacote `@adonisjs/ally` gera a exceção quando o estado CSRF definido durante o redirecionamento está ausente.

Você pode evitar essa exceção se [lidar com os erros](../authentication/social_authentication.md#handling-callback-response) antes de chamar os métodos `.accessToken` ou `.user`.

- **Código de status**: 400
- **Automanipulado**: Não

```ts
import { errors as allyErrors } from '@adonisjs/bouncer'
if (error instanceof allyErrors.E_OAUTH_STATE_MISMATCH) {
}
```

## E_UNAUTHORIZED_ACCESS
A exceção é gerada quando um dos guardas de autenticação não consegue autenticar a solicitação. A exceção é automanipulada e usa [content-negotiation](../authentication/session_guard.md#handling-authentication-exception) para retornar uma resposta de erro apropriada ao cliente.

- **Código de status**: 401
- **Automanipulado**: Sim
- **Identificador de tradução**: `errors.E_UNAUTHORIZED_ACCESS`

```ts
import { errors as authErrors } from '@adonisjs/auth'
if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
}
```

## E_INVALID_CREDENTIALS
A exceção é gerada quando o localizador de autenticação não consegue verificar as credenciais do usuário. A exceção é manipulada e use [content-negotiation](../authentication/verifying_user_credentials.md#handling-exceptions) para retornar uma resposta de erro apropriada ao cliente.

- **Código de status**: 400
- **Automanipulado**: Sim
- **Identificador de tradução**: `errors.E_INVALID_CREDENTIALS`

```ts
import { errors as authErrors } from '@adonisjs/auth'
if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
}
```

## E_CANNOT_LOOKUP_ROUTE
A exceção é gerada quando você tenta criar uma URL para uma rota usando o [URL builder](../basics/routing.md#url-builder).

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_CANNOT_LOOKUP_ROUTE) {
  // handle error
}
```

## E_HTTP_EXCEPTION
A `E_HTTP_EXCEPTION` é uma exceção genérica para gerar erros durante uma solicitação HTTP. Você pode usar essa exceção diretamente ou criar uma exceção personalizada estendendo-a.

- **Código de status**: Definido no momento da geração da exceção
- **Autogerenciado**: Sim

```ts
// title: Throw exception
import { errors } from '@adonisjs/core'

throw errors.E_HTTP_EXCEPTION.invoke(
  {
    errors: ['Cannot process request']
  },
  422
)
```

```ts
// title: Handle exception
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_HTTP_EXCEPTION) {
  // handle error
}
```

## E_HTTP_REQUEST_ABORTED
A `E_HTTP_REQUEST_ABORTED` é uma subclasse da exceção `E_HTTP_EXCEPTION`. Essa exceção é gerada pelo método [response.abort](../basics/response.md#aborting-request-with-an-error).

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_HTTP_REQUEST_ABORTED) {
  // handle error
}
```

## E_INSECURE_APP_KEY
A exceção é gerada quando o comprimento de `appKey` é menor que 16 caracteres. Você pode usar o comando ace [generate:key](./commands.md#generatekey) para gerar uma chave de aplicativo segura.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_INSECURE_APP_KEY) {
  // handle error
}
```

## E_MISSING_APP_KEY
A exceção é gerada quando a propriedade `appKey` não é definida dentro do arquivo `config/app.ts`. Por padrão, o valor de `appKey` é definido usando a variável de ambiente `APP_KEY`.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_MISSING_APP_KEY) {
  // handle error
}
```

## E_INVALID_ENV_VARIABLES
A exceção é gerada quando uma ou mais variáveis ​​de ambiente falham na validação. Os erros de validação detalhados podem ser acessados ​​usando a propriedade `error.help`.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_INVALID_ENV_VARIABLES) {
  console.log(error.help)
}
```

## E_MISSING_COMMAND_NAME
A exceção é gerada quando um comando não define a propriedade `commandName` ou seu valor é uma string vazia.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_MISSING_COMMAND_NAME) {
  console.log(error.commandName)
}
```

## E_COMMAND_NOT_FOUND
A exceção é gerada pelo Ace quando não é possível encontrar um comando.

- **Código de status**: 404
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_COMMAND_NOT_FOUND) {
  console.log(error.commandName)
}
```

## E_MISSING_FLAG
A exceção é gerada ao executar um comando sem passar um sinalizador CLI necessário.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_MISSING_FLAG) {
  console.log(error.commandName)
}
```

## E_MISSING_FLAG_VALUE
A exceção é gerada ao tentar executar um comando sem fornecer nenhum valor para um sinalizador CLI não booleano.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_MISSING_FLAG_VALUE) {
  console.log(error.commandName)
}
```

## E_MISSING_ARG
A exceção é gerada ao executar um comando sem definir os argumentos necessários.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_MISSING_ARG) {
  console.log(error.commandName)
}
```

## E_MISSING_ARG_VALUE
A exceção é gerada ao executar um comando sem definir o valor para um argumento obrigatório.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_MISSING_ARG_VALUE) {
  console.log(error.commandName)
}
```

## E_UNKNOWN_FLAG
A exceção é gerada ao executar um comando com um sinalizador CLI desconhecido.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_UNKNOWN_FLAG) {
  console.log(error.commandName)
}
```

## E_INVALID_FLAG
A exceção é gerada quando o valor fornecido para um sinalizador CLI é inválido — por exemplo, passar um valor de string para um sinalizador que aceita valores numéricos.

- **Código de status**: 500
- **Autogerenciado**: Não

```ts
import { errors } from '@adonisjs/core'
if (error instanceof errors.E_INVALID_FLAG) {
  console.log(error.commandName)
}
```

## E_MULTIPLE_REDIS_SUBSCRIPTIONS
O pacote `@adonisjs/redis` gera a exceção quando você tenta [inscrever-se em um determinado canal pub/sub](../database/redis.md#pubsub) várias vezes.

- **Código de status**: 500
- **Autogerenciado**: Não

```ts
import { errors as redisErrors } from '@adonisjs/redis'
if (error instanceof redisErrors.E_MULTIPLE_REDIS_SUBSCRIPTIONS) {
}
```

## E_MULTIPLE_REDIS_PSUBSCRIPTIONS
O pacote `@adonisjs/redis` gera a exceção quando você tenta [inscrever-se em um determinado padrão pub/sub](../database/redis.md#pubsub) várias vezes.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors as redisErrors } from '@adonisjs/redis'
if (error instanceof redisErrors.E_MULTIPLE_REDIS_PSUBSCRIPTIONS) {
}
```

## E_MAIL_TRANSPORT_ERROR
A exceção é gerada pelo pacote `@adonisjs/mail` quando não é possível enviar o e-mail usando um determinado transporte. Normalmente, isso acontece quando a API HTTP do serviço de e-mail retorna uma resposta HTTP diferente de 200.

Você pode acessar o erro de solicitação de rede usando a propriedade `error.cause`. A propriedade `cause` é o [objeto de erro](https://github.com/sindresorhus/got/blob/main/documentation/8-errors.md) retornado por `got` (pacote npm).

- **Código de status**: 400
- **Automanipulado**: Não

```ts
import { errors as mailErrors } from '@adonisjs/mail'
if (error instanceof mailErrors.E_MAIL_TRANSPORT_ERROR) {
  console.log(error.cause)
}
```

## E_SESSION_NOT_MUTABLE
A exceção é gerada pelo pacote `@adonisjs/session` quando o armazenamento de sessão é iniciado no modo somente leitura.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors as sessionErrors } from '@adonisjs/session'
if (error instanceof sessionErrors.E_SESSION_NOT_MUTABLE) {
  console.log(error.message)
}
```

## E_SESSION_NOT_READY
A exceção é gerada pelo pacote `@adonisjs/session` quando o armazenamento de sessão ainda não foi iniciado. Este será o caso quando você não estiver usando o middleware de sessão.

- **Código de status**: 500
- **Automanipulado**: Não

```ts
import { errors as sessionErrors } from '@adonisjs/session'
if (error instanceof sessionErrors.E_SESSION_NOT_READY) {
  console.log(error.message)
}
```
