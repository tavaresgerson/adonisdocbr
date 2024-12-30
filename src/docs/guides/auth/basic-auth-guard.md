# Autenticação básica

A proteção de autenticação básica usa a [autenticação básica HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme) para autenticar as solicitações.

Não há conceito de **login e logout explícitos** com autenticação básica. As credenciais para autenticação são enviadas em cada solicitação e você pode validá-las usando o método `auth.authenticate`.

- Se as credenciais do usuário estiverem incorretas, o pacote de autenticação negará a solicitação com o cabeçalho `WWW-Authenticate`.
- Se as credenciais estiverem corretas, você poderá acessar os detalhes do usuário conectado.

::: info NOTA
A proteção de autenticação básica depende do provedor de usuário subjacente para pesquisar e validar as credenciais do usuário
:::

```ts
import Route from '@ioc:Adonis/Core/Route'

Route
  .get('posts', async ({ auth }) => {
    await auth.use('basic').authenticate()

    return `You are logged in as ${auth.user!.email}`
  })
```

Você também pode usar o [auth middleware](/docs/guides/auth/middleware.md) para proteger rotas usando a proteção de autenticação básica.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route
  .get('posts', async ({ auth }) => {
    return `You are logged in as ${auth.user!.email}`
  })
  .middleware('auth', { guards: ['basic'] })
```
