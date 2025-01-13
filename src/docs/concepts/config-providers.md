---
summary: Aprenda sobre provedores de configuração e como eles ajudam você a calcular preguiçosamente a configuração após o aplicativo ser inicializado.
---

# Provedores de configuração

Alguns arquivos de configuração como (`config/hash.ts`) não exportam a configuração como um objeto simples. Em vez disso, eles exportam um [provedor de configuração](https://github.com/adonisjs/core/blob/main/src/config_provider.ts#L16). O provedor de configuração fornece uma API transparente para pacotes calcularem preguiçosamente a configuração após o aplicativo ser inicializado.

## Sem provedores de configuração

Para entender os provedores de configuração, vamos ver como o arquivo `config/hash.ts` ficaria se não estivéssemos usando provedores de configuração.

```ts
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt'

export default {
  default: 'scrypt',
  list: {
    scrypt: () => new Scrypt({
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      maxMemory: 33554432,
    })
  }
}
```

Até agora, tudo bem. Em vez de referenciar o driver `scrypt` da coleção `drivers`. Estamos importando-o diretamente e retornando uma instância usando uma função de fábrica.

Digamos que o driver `Scrypt` precisa de uma instância da classe Emitter para emitir um evento toda vez que ele faz hash de um valor.

```ts
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt'
import emitter from '@adonisjs/core/services/emitter' // [!code ++]

export default {
  default: 'scrypt',
  list: {
    scrypt: () => new Scrypt({
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      maxMemory: 33554432,
    }, emitter) // [!code ++]
  }
}
```

**🚨 O exemplo acima falhará** porque os serviços de contêiner do AdonisJS [./container_services.md](./container_services.md) não estão disponíveis até que o aplicativo seja inicializado e os arquivos de configuração sejam importados antes da fase de inicialização do aplicativo.

### Bem, esse é um problema com a arquitetura do AdonisJS 🤷🏻‍♂️
Na verdade, não. Não vamos usar o serviço de contêiner e criar uma instância da classe Emitter diretamente no arquivo de configuração.

```ts
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt'
import emitter from '@adonisjs/core/services/emitter' // [!code --]
import { Emitter } from '@adonisjs/core/events' // [!code ++]

const emitter = new Emitter() // [!code ++]

export default {
  default: 'scrypt',
  list: {
    scrypt: () => new Scrypt({
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      maxMemory: 33554432,
    }, emitter)
  }
}
```

Agora, temos um novo problema. A instância `emitter` que criamos para o driver `Scrypt` não está disponível globalmente para importarmos e ouvirmos eventos emitidos pelo driver.

Portanto, você pode querer mover a construção da classe `Emitter` para seu arquivo e exportar uma instância dela. Dessa forma, você pode passar a instância do emissor para o driver e usá-la para ouvir eventos.

```ts
// start/emitter.ts

import { Emitter } from '@adonisjs/core/events'
export const emitter = new Emitter()
```

```ts
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt'
import { Emitter } from '@adonisjs/core/events' // [!code --]
import { emitter } from '#start/emitter' // [!code ++]

const emitter = new Emitter() // [!code --]

export default {
  default: 'scrypt',
  list: {
    scrypt: () => new Scrypt({
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      maxMemory: 33554432,
    }, emitter)
  }
}
```

O código acima funcionará bem. No entanto, você está construindo manualmente as dependências que seu aplicativo precisa dessa vez. Como resultado, seu aplicativo terá muito código boilerplate para conectar tudo.

Com o AdonisJS, nos esforçamos para escrever o mínimo de código boilerplate e usar o contêiner IoC para dependências de pesquisa.

## Com o provedor de configuração
Agora, vamos reescrever o arquivo `config/hash.ts` e usar um provedor de configuração dessa vez. Provedor de configuração é um nome chique para uma função que aceita uma [instância da classe Application](./application.md) e resolve suas dependências usando o contêiner.

```ts {1,7-16}
import { configProvider } from '@adonisjs/core'
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt'

export default {
  default: 'scrypt',
  list: {
    scrypt: configProvider.create(async (app) => {
      const emitter = await app.container.make('emitter')

      return () => new Scrypt({
        cost: 16384,
        blockSize: 8,
        parallelization: 1,
        maxMemory: 33554432,
      }, emitter)
    })
  }
}
```

Depois de usar o serviço [hash](../security/hashing.md), o provedor de configuração para o driver `scrypt` será executado para resolver suas dependências. Como resultado, não tentamos procurar o `emitter` até usarmos o serviço de hash em outro lugar dentro do nosso código.

Como os provedores de configuração são assíncronos, você pode querer importar o driver `Scrypt` preguiçosamente por meio de importação dinâmica.

```ts
import { configProvider } from '@adonisjs/core'
import { Scrypt } from '@adonisjs/core/hash/drivers/scrypt' // [!code --]

export default {
  default: 'scrypt',
  list: {
    scrypt: configProvider.create(async (app) => {
      const { Scrypt } = await import('@adonisjs/core/hash/drivers/scrypt') // [!code ++]
      const emitter = await app.container.make('emitter')

      return () => new Scrypt({
        cost: 16384,
        blockSize: 8,
        parallelization: 1,
        maxMemory: 33554432,
      }, emitter)
    })
  }
}
```

## Como acesso a configuração resolvida?
Você pode acessar a configuração resolvida diretamente do serviço. Por exemplo, no caso do serviço de hash, você pode obter uma referência à configuração resolvida da seguinte forma.

```ts
import hash from '@adonisjs/core/services/hash'
console.log(hash.config)
```
