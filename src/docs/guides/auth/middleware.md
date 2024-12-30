# Middleware de autenticação

Durante o processo de configuração, o pacote de autenticação cria os dois middlewares a seguir dentro do diretório `./app/Middleware`. Você pode usar esses middlewares para proteger as rotas contra solicitações não autenticadas.

## Middleware de autenticação
O middleware de autenticação é armazenado dentro do arquivo `app/Middleware/Auth.ts`. Você deve registrá-lo como um middleware nomeado dentro do arquivo `start/kernel.ts`.

```ts
// start/kernel.ts

Server.middleware.registerNamed({
  auth: () => import('App/Middleware/Auth')
})
```

Depois de registrado, você pode anexar o middleware `auth` às rotas do aplicativo. Por exemplo:

```ts
Route.group(() => {
  
}).middleware('auth')
```

O middleware de autenticação aceita opcionalmente os guards para usar na autenticação da solicitação atual. Ele fará um loop em todos os guards definidos e parará quando qualquer um dos guards for capaz de autenticar a solicitação.

- A solicitação continua quando a solicitação é autenticada
[AuthenticationException](https://github.com/adonisjs/auth/blob/develop/src/Exceptions/AuthenticationException.ts) é gerada. A exceção usa

```ts
Route.group(() => {
  
}).middleware('auth:web,api')
```

## Middleware de autenticação silenciosa
O middleware de autenticação silenciosa verifica silenciosamente se o usuário está logado ou não. A solicitação continua normalmente, mesmo quando o usuário não está logado.

Este middleware é útil quando você deseja renderizar uma página da web pública, mas também mostrar os detalhes do usuário atualmente logado em algum lugar da página (talvez o cabeçalho).

Para resumir, este middleware não força os usuários a estarem logados, mas buscará seus detalhes se estiverem logados e os fornecerá a você durante todo o ciclo de vida da solicitação.

Se você planeja usar este middleware, deverá registrá-lo na lista de middleware global.

```ts
// start/kernel.ts

Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
  () => import('App/Middleware/SilentAuth') // [!code highlight]
])
```
