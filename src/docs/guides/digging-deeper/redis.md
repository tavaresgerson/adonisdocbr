# Redis

O AdonisJS tem seu próprio pacote first party para trabalhar com bancos de dados Redis. Ele usa internamente [ioredis](https://github.com/luin/ioredis), mas melhora a **camada pub/sub** e fornece suporte de primeira classe para **gerenciamento de conexões** e **verificações de integridade**.

O primeiro passo é instalar e configurar o pacote usando as seguintes instruções.

::: code-group

```sh [Instale]
npm i @adonisjs/redis@7.3.4
```

```sh [Configure]
node ace configure @adonisjs/redis

# CREATE: config/redis.ts
# CREATE: contracts/redis.ts
# UPDATE: .env
# UPDATE: tsconfig.json { types += "@adonisjs/redis" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/redis" }
```

```ts [Validar variáveis ​​de ambiente]
/**
 * Certifique-se de adicionar as seguintes regras de validação ao arquivo
 * `env.ts` para validar as variáveis ​​de ambiente.
 */
export default Env.rules({
  // ...regras existentes
  REDIS_CONNECTION: Env.schema.enum(['local'] as const),
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
})
```

:::

- Suporte melhorado para pub/sub
- Gerenciamento de múltiplas conexões sem padrão
- Verificações de integridade integradas

&nbsp;

* [Visualizar no npm](https://npm.im/@adonisjs/redis)
* [Visualizar no GitHub](https://github.com/adonisjs/redis)

## Configuração
A configuração do redis é armazenada dentro do arquivo `config/redis.ts`. Você pode definir uma ou mais conexões nomeadas dentro deste arquivo e seu ciclo de vida será gerenciado automaticamente para você.

```ts
import { redisConfig } from '@adonisjs/redis/build/config'

export default redisConfig({
  connection: Env.get('REDIS_CONNECTION'),

  connections: {
    local: {
      host: Env.get('REDIS_HOST'),
      port: Env.get('REDIS_PORT'),
      password: Env.get('REDIS_PASSWORD', ''),
      db: 0,
      keyPrefix: '',
    },
  },
})
```

#### `connection`
Conexão padrão a ser usada para fazer todas as consultas do redis. O valor da conexão é inferido da variável de ambiente `REDIS_CONNECTION`.

#### `connections`
Uma lista de conexões disponíveis que você planeja usar em seu aplicativo. Sinta-se à vontade para adicionar/remover conexões deste objeto.

## Uso
Depois que a configuração for concluída, você pode importar o módulo e executar comandos redis. Todos os métodos de [ioredis](https://github.com/luin/ioredis) são suportados como estão pelo módulo redis do AdonisJS.

```ts
import Redis from '@ioc:Adonis/Addons/Redis'

await Redis.set('foo', 'bar')
const value = await Redis.get('foo')
```

Você pode alternar entre conexões usando o método `Redis.connection`. Criamos/gerenciamos instâncias singleton para cada conexão e as usamos durante todo o ciclo de vida do aplicativo.

```ts
import Redis from '@ioc:Adonis/Addons/Redis'

await Redis
  .connection('session') // 👈 Troca de conexão
  .set('foo', 'bar')
```

## Pub/Sub
O Redis força você a manter duas conexões separadas ao usar `pub/sub`, onde o assinante usa uma conexão dedicada apenas ouvindo novas mensagens.

No AdonisJS, melhoramos a API do pub/sub e gerenciamos a conexão do assinante internamente para você, para que você não precise criá-la e gerenciá-la manualmente.

Para demonstração, vamos criar um canal pub/sub para rastrear inscrições de usuários. Comece criando um novo arquivo de pré-carregamento executando o seguinte comando Ace.

```sh
node ace make:prldfile redis

# ✔  create    start/redis.ts
```

Abra o arquivo recém-criado e cole o seguinte trecho de código dentro dele.

```ts
// start/redis.ts

import Redis from '@ioc:Adonis/Addons/Redis'

Redis.subscribe('user:signup', (user: string) => {
  console.log(JSON.parse(user))
})
```

Em seguida, crie uma rota fictícia para publicar no canal `user:signup` em cada nova solicitação HTTP.

```ts
// start/routes.ts

import Route from '@ioc:Adonis/Core/Route'
import Redis from '@ioc:Adonis/Addons/Redis'

Route.get('/signup', async () => {
  await Redis.publish('user:signup', JSON.stringify({ id: 1 }))

  return 'handled'
})
```

- O método `Redis.subscribe` escuta mensagens em um determinado canal.
- O método `Redis.publish` é usado para publicar eventos em um determinado canal.
- As mensagens são passadas como string, já que o Redis não suporta outros tipos de dados durante o Pub/sub.

### Padrão pub/sub
O Redis também suporta pub/sub usando padrões. Em vez de `subscribe`, você tem que usar o método `psubscribe`.

```ts
Redis.psubscribe('user:*', (event: string, user: string) => {
  console.log(event, JSON.stringify(user))
})
```

## Verificações de integridade
O módulo Redis usa o módulo AdonisJS [health check](./health-check.md) para relatar a integridade das conexões. Tudo o que você precisa fazer é habilitá-lo dentro do arquivo de configuração.

```ts
// config/redis.ts

{
  local: {
    host: Env.get('REDIS_HOST', '127.0.0.1') as string,
    port: Env.get('REDIS_PORT', '6379') as string,
    password: Env.get('REDIS_PASSWORD', '') as string,
    db: 0,
    keyPrefix: '',
    healthCheck: true, // 👈 verificação de saúde
  },
}
```

Agora, você pode usar o módulo health check para visualizar o status das suas conexões redis.

```ts
import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  
  return report.healthy
    ? response.ok(report)
    : response.badRequest(report)
})
```

!["Relatório de conexão não íntegra"](/docs/assets/redis-connection-health-check.webp)

## Fechando conexões
Você pode fechar as conexões redis usando um dos seguintes métodos.

### `quit`
O método `quit` fecha a conexão redis normalmente. Este método aguardará que todos os comandos enfileirados terminem.

```ts
await Redis.quit()
await Redis.connection('name').quit()
```

### `disconnect`
O método `disconnect` não aguarda que os comandos existentes terminem e interromperá a conexão imediatamente.

```ts
await Redis.disconnect()
await Redis.connection('name').disconnect()
```

### `quitAll`
Semelhante a `quit`, mas encerra todas as conexões

```ts
await Redis.quitAll()
```

### `disconnectAll`
Semelhante a `disconnect`, mas desconecta todas as conexões.

```ts
await Redis.disconnectAll()
```
