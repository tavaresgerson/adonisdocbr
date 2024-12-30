# Verificação de saúde

O módulo de verificação de saúde do AdonisJS permite que você e os pacotes instalados relatem a saúde do seu aplicativo.

As verificações de saúde geralmente são úteis ao executar implantações contínuas, pois você pode verificar a saúde do código recém-implantado antes de enviar qualquer tráfego para ele. Todas as principais plataformas, incluindo: [DigitalOcean Apps](https://docs.digitalocean.com/products/app-platform/concepts/health-check/), [Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) e [Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_HealthCheck.html) têm suporte para executar verificações de saúde.

## Como funcionam as verificações de saúde?
Os principais objetivos das verificações de saúde são executar operações e garantir que seu aplicativo funcionará bem na produção. Ele abrange operações como:

- Verificar a conectividade do banco de dados
- Certificar-se de que todas as variáveis ​​de ambiente estejam no lugar para executar o aplicativo
- O banco de dados não tem nenhuma migração pendente e assim por diante.

O sistema de verificações de integridade **NÃO PODE** verificar se seu aplicativo causará um erro durante algum fluxo específico, pois isso é mais uma exceção lógica ou de tempo de execução e não algo que podemos detectar de antemão.

## Expondo o ponto de extremidade das verificações de integridade
Uma prática comum é expor um ponto de extremidade HTTP que os sistemas de implantação podem executar ping para verificar a integridade do seu aplicativo. Você pode expor esse ponto de extremidade registrando uma rota.

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

O método `getReport` retorna um objeto JSON com o relatório de todos os verificadores de integridade registrados. O objeto é formatado da seguinte forma:

```ts
{
  healthy: true,
  report: {
    env: {
      displayName: 'Node env check',
      health: {
        healthy: true,
      }
    }
  }
}
```

#### `healthy`
A propriedade de nível superior `healthy` informa se todas as verificações foram aprovadas ou não.

#### `report`
A propriedade `report` inclui um par chave-valor de todas as verificações de integridade registradas e seus respectivos estados.

#### `displayName`
A subpropriedade `displayName` geralmente é útil quando você visualiza o relatório em um painel e quer um nome legível.

#### `health`
A subpropriedade `health` inclui o status de integridade e uma mensagem de erro (se o relatório não estiver íntegro).

```ts
{
  health: {
    healthy: true
  }
}
```

```ts
{
  health: {
    healthy: false,
    message: 'One or more connections are not healthy.'
  }
}
```

#### `meta`
Os verificadores de integridade também podem anexar metadados personalizados aos seus respectivos nós, e o formato dos metadados pode variar dependendo do verificador.

## Verificadores de integridade existentes
A seguir está a lista de verificadores de integridade existentes.

### Verificador de chave de aplicativo
O verificador é configurado implicitamente e não pode ser desabilitado. Ele verifica a existência da variável de ambiente `APP_KEY` e garante um comprimento mínimo de **32 caracteres**.

Você pode gerar a chave do aplicativo usando o comando `node ace generate:key` e então usar a saída como o valor para a variável de ambiente `APP_KEY`.

### Verificador de ambiente do nó
Verifica a existência da variável de ambiente `NODE_ENV` e falha se ela não tiver sido definida explicitamente. Você nunca deve executar seu aplicativo em *ambiente desconhecido*.

### Verificador Lucid
O pacote `@adonisjs/lucid` permite habilitar opcionalmente verificações de integridade para uma determinada ou todas as conexões registradas. Ele então tentará [estabelecer uma conexão](https://github.com/adonisjs/lucid/blob/develop/src/Connection/index.ts#L272) com o banco de dados e relatará seu status.

Certifique-se de habilitar verificações de integridade para uma determinada conexão modificando o arquivo `config/database.ts`.

```ts
{
  pg: {
    client: 'pg',
    connection: {
      // ... detalhes da conexão
    },
    healthCheck: true, // 👈 enabled
  }
}
```

O nó `lucid` de nível superior contém um status agregado de todas as conexões registradas, e a matriz `meta` inclui o status individual de todas as conexões.

```ts {8-14}
{
  lucid: {
    displayName: 'Database',
    health: {
      healthy: true,
      message: 'All connections are healthy'
    },
    meta: [
      {
        connection: 'pg',
        message: 'Connection is healthy',
        error: null
      }
    ]
  }
}
```

Em caso de erro, a propriedade `meta[index].error` conterá a pilha de erros.

### Verificador Redis
Você também pode habilitar opcionalmente verificações de integridade para o módulo `@adonisjs/redis` modificando o arquivo `config/redis.ts`.

```ts
{
  local: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    healthCheck: true // 👈 habilitado
  }
}
```

O nó `redis` de nível superior contém um status agregado de todas as conexões registradas, e a matriz `meta` inclui o status individual de todas as conexões.

```ts {7-14}
{
  displayName: 'Redis',
  health: {
    healthy: true,
    message: 'All connections are healthy',
  },
  meta: [
    {
      connection: 'local',
      status: 'ready',
      used_memory: '1.00M',
      error: null
    }
  ]
}
```

Em caso de erro, a propriedade `meta[index].error` conterá a pilha de erros, e a propriedade `used_memory` será definida como `null`.

## Adicionando um verificador de integridade personalizado
Você também pode registrar seus verificadores de integridade personalizados dentro da base de código do seu aplicativo ou fornecê-los como um pacote. Você pode registrá-los dentro do método `boot` de um provedor de serviços.

O método `addChecker` pega um nome exclusivo para o verificador e uma função de retorno de chamada que executa a verificação de integridade e retorna o relatório.

```ts {8-19}

import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const HealthCheck = this.app.container.use('Adonis/Core/HealthCheck')

    HealthCheck.addChecker('my-checker', async () => {
      return {
        displayName: 'Checker Name',
        health: {
          healthy: true,
          message: 'Everything works fine'
        },
        meta: {},
      }
    })
  }
}
```
