---
summary: Aprenda sobre o sistema de autenticação no AdonisJS e como autenticar usuários em seu aplicativo.
---

# Autenticação

O AdonisJS vem com um sistema de autenticação robusto e seguro que você pode usar para fazer login e autenticar usuários do seu aplicativo. Seja um aplicativo renderizado pelo servidor, um cliente SPA ou um aplicativo móvel, você pode configurar a autenticação para todos eles.

O pacote de autenticação é construído em torno de **guardas** e **provedores**.

- As guardas são implementações de ponta a ponta de um tipo de login específico. Por exemplo, a guarda `session` permite que você autentique usuários usando cookies e sessão. Enquanto isso, a guarda `access_tokens` permitirá que você autentique clientes usando tokens.

- Os provedores são usados ​​para procurar usuários e tokens em um banco de dados. Você pode usar os provedores integrados ou implementar os seus próprios.

:::note
Para garantir a segurança dos seus aplicativos, fazemos hash adequadamente nas senhas e tokens dos usuários. Além disso, os primitivos de segurança do AdonisJS são protegidos contra [ataques de temporização](https://en.wikipedia.org/wiki/Timing_attack) e [ataques de fixação de sessão](https://owasp.org/www-community/attacks/Session_fixation).
:::

## Recursos não suportados pelo pacote Auth

O pacote auth foca estritamente na autenticação de solicitações HTTP, e os seguintes recursos estão fora de seu escopo.

- Recursos de registro de usuário como **formulários de registro**, **verificação de e-mail** e **ativação de conta**.
- Recursos de gerenciamento de conta como **recuperação de senha** ou **atualização de e-mail**.
[use bouncer](../security/authorization.md) para implementar verificações de autorização em seu aplicativo.

## Escolhendo um auth guard

Os seguintes auth guards integrados fornecem a você o fluxo de trabalho mais direto para autenticar usuários sem comprometer a segurança de seus aplicativos. Além disso, você pode [criar seus guardas de autenticação](./custom_auth_guard.md) para requisitos personalizados.

### Sessão

O guarda de sessão usa o pacote [@adonisjs/session](../basics/session.md) para rastrear o estado do usuário conectado dentro do armazenamento de sessão.

Sessões e cookies estão na internet há muito tempo e funcionam muito bem para a maioria dos aplicativos. Recomendamos usar o guarda de sessão:

- Se você estiver criando um aplicativo da web renderizado pelo servidor.
- Ou uma API AdonisJS com seu cliente no mesmo domínio de nível superior. Por exemplo, `api.example.com` e `example.com`.

### Tokens de acesso

Os tokens de acesso são tokens aleatórios criptograficamente seguros (também conhecidos como tokens de acesso opacos) emitidos para usuários após login bem-sucedido. Você pode usar tokens de acesso para aplicativos onde seu servidor AdonisJS não pode gravar/ler cookies. Por exemplo:

- Um aplicativo móvel nativo.
- Um aplicativo da web hospedado em um domínio diferente do seu servidor de API AdonisJS.

Ao usar tokens de acesso, torna-se responsabilidade do seu aplicativo do lado do cliente armazená-los com segurança. Os tokens de acesso fornecem acesso irrestrito ao seu aplicativo (em nome de um usuário), e vazá-los pode levar a problemas de segurança.

### Autenticação básica

A proteção de autenticação básica é uma implementação da [estrutura de autenticação HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication), na qual o cliente deve passar as credenciais do usuário como uma string codificada em base64 por meio do cabeçalho `Authorization`.

Existem maneiras melhores de implementar um sistema de login seguro do que a autenticação básica. No entanto, você pode usá-lo temporariamente enquanto seu aplicativo estiver em desenvolvimento ativo.

## Escolhendo um provedor de usuário
Conforme abordado anteriormente neste guia, um provedor de usuário é responsável por encontrar usuários durante o processo de autenticação.

Os provedores de usuário são específicos de proteção; por exemplo, o provedor de usuário para o guarda de sessão é responsável por encontrar usuários por sua ID, e o provedor de usuário para o guarda de tokens de acesso também é responsável por verificar tokens de acesso.

Nós enviamos com um provedor de usuário Lucid para os guardas integrados, que usa modelos Lucid para encontrar usuários, gerar tokens e verificar tokens.

## Instalação

O sistema auth vem pré-configurado com os kits iniciais `web` e `api`. No entanto, você pode instalá-lo e configurá-lo manualmente dentro de um aplicativo da seguinte forma.

```sh
# Configure with session guard (default)
node ace add @adonisjs/auth --guard=session

# Configure with access tokens guard
node ace add @adonisjs/auth --guard=access_tokens

# Configure with basic auth guard
node ace add @adonisjs/auth --guard=basic_auth
```

### Veja as etapas executadas pelo comando add

1. Instale o pacote `@adonisjs/auth` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/auth/auth_provider')
      ]
    }
    ```

3. Cria e registra o seguinte middleware dentro do arquivo `start/kernel.ts`.

```ts
    router.use([
      () => import('@adonisjs/auth/initialize_auth_middleware')
    ])
    ```

```ts
    router.named({
      auth: () => import('#middleware/auth_middleware'),
      // only if using the session guard
      guest: () => import('#middleware/guest_middleware')
    })
    ```

4. Cria o modelo de usuário dentro do diretório `app/models`.
5. Cria migração de banco de dados para a tabela `users`.
6. Cria migrações de banco de dados para o guard selecionado.

## O middleware Initialize auth
Durante a configuração, registramos o `@adonisjs/auth/initialize_auth_middleware` dentro do seu aplicativo. O middleware é responsável por criar uma instância da classe [Authenticator](https://github.com/adonisjs/auth/blob/main/src/authenticator.ts) e a compartilha por meio da propriedade `ctx.auth` com o restante da solicitação.

Observe que o middleware initialize auth não autentica a solicitação nem protege as rotas. Ele é usado apenas para inicializar o autenticador e compartilhá-lo com o restante da solicitação. Você deve usar o middleware [auth](./session_guard.md#protecting-routes) para proteger rotas.

Além disso, a mesma instância do autenticador é compartilhada com modelos do Edge (se seu aplicativo estiver usando o Edge), e você pode acessá-la usando a propriedade `auth`. Por exemplo:

```edge
@if(auth.isAuthenticated)
  <p> Hello {{ auth.user.email }} </p>
@end
```

## Criando a tabela de usuários
O comando `configure` cria uma migração de banco de dados para a tabela `users` dentro do diretório `database/migrations`. Sinta-se à vontade para abrir este arquivo e fazer alterações de acordo com os requisitos do seu aplicativo.

Por padrão, as seguintes colunas são criadas.

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

Além disso, atualize o modelo `User` se você definir, renomear ou remover colunas da tabela `users`.

## Próximas etapas

[Verificar credenciais do usuário](./verifying_user_credentials.md) sem comprometer a segurança do seu aplicativo.
[Session guard](./session_guard.md) para autenticação com estado.
[Access tokens guard](./access_tokens_guard.md) para autenticação baseada em tokens.
