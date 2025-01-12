---
resumo: Aprenda a ler e atualizar valores de configuração no AdonisJS.
---

# Configuração

Os arquivos de configuração do seu aplicativo AdonisJS são armazenados dentro do diretório `config`. Um aplicativo AdonisJS totalmente novo vem com um punhado de arquivos pré-existentes usados ​​pelo núcleo do framework e pacotes instalados.

Sinta-se à vontade para criar arquivos adicionais que seu aplicativo requer dentro do diretório `config`.

:::note
Recomendamos usar [variáveis ​​de ambiente](./environment_variables.md) para armazenar segredos e configuração específica do ambiente.
:::

## Importando arquivos de configuração

Você pode importar os arquivos de configuração dentro da base de código do seu aplicativo usando a instrução `import` padrão do JavaScript. Por exemplo:

```ts
import { appKey } from '#config/app'
```

```ts
import databaseConfig from '#config/database'
```

## Usando o serviço de configuração

O serviço de configuração oferece uma API alternativa para ler os valores de configuração. No exemplo a seguir, usamos o serviço de configuração para ler o valor `appKey` armazenado no arquivo `config/app.ts`.

```ts
import config from '@adonisjs/core/services/config'

config.get('app.appKey')
config.get('app.http.cookie') // read nested values
```

O método `config.get` aceita uma chave separada por pontos e a analisa da seguinte forma.

- A primeira parte é o nome do arquivo do qual você deseja ler os valores. Ou seja, arquivo `app.ts`.
- O restante do fragmento de string é a chave que você deseja acessar dos valores exportados. Ou seja, `appKey` neste caso.

## Serviço de configuração vs. importação direta de arquivos de configuração

Usar o serviço de configuração em vez de importar diretamente os arquivos de configuração não tem benefícios diretos. No entanto, o serviço de configuração é a única opção para ler a configuração em pacotes externos e modelos de ponta.

### Lendo a configuração dentro de pacotes externos

Se você estiver criando um pacote de terceiros, não deve importar diretamente os arquivos de configuração do aplicativo do usuário porque isso tornará seu pacote fortemente acoplado à estrutura de pastas do aplicativo host.

Em vez disso, você deve usar o serviço de configuração para acessar os valores de configuração dentro de um provedor de serviços. Por exemplo:

```ts
import { ApplicationService } from '@adonisjs/core/types'

export default class DriveServiceProvider {
  constructor(protected app: ApplicationService) {}
  
  register() {
    this.app.container.singleton('drive', () => {
      // highlight-start
      const driveConfig = this.app.config.get('drive')
      return new DriveManager(driveConfig)
      // highlight-end
    })
  }
}
```

### Lendo a configuração dentro de modelos Edge

Você pode acessar valores de configuração dentro de modelos Edge usando o método global `config`.

```edge
<a href="{{ config('app.appUrl') }}"> Home </a>
```

Você pode usar o método `config.has` para verificar se um valor de configuração existe para uma determinada chave. O método retorna `false` se o valor for `undefined`.

```edge
@if(config.has('app.appUrl'))
  <a href="{{ config('app.appUrl') }}"> Home </a>
@else
  <a href="/"> Home </a>
@end
```

## Alterando o local da configuração

Você pode atualizar o local do diretório de configuração modificando o arquivo `adonisrc.ts`. Após a alteração, os arquivos de configuração serão importados do novo local.

```ts
directories: {
  config: './configurations'
}
```

Certifique-se de atualizar o alias de importação no arquivo `package.json`.

```json
{
  "imports": {
    "#config/*": "./configurations/*.js"
  }
}
```

## Limitações dos arquivos de configuração

Os arquivos de configuração armazenados no diretório `config` são importados durante a fase de inicialização do aplicativo. Como resultado, os arquivos de configuração não podem depender do código do aplicativo.

Por exemplo, se você tentar importar e usar o serviço de roteador dentro do arquivo `config/app.ts`, o aplicativo falhará ao iniciar. Isso ocorre porque o serviço de roteador não é configurado até que o aplicativo esteja em um estado `inicializado`.

Fundamentalmente, essa limitação impacta positivamente sua base de código porque o código do aplicativo deve depender da configuração, e não vice-versa.

## Atualizando a configuração em tempo de execução

Você pode alterar os valores de configuração em tempo de execução usando o serviço de configuração. O `config.set` atualiza o valor dentro da memória, e nenhuma alteração é feita nos arquivos no disco.

:::note
O valor config é mutado para todo o aplicativo, não apenas para uma única solicitação HTTP. Isso ocorre porque o Node.js não é um tempo de execução encadeado, e a memória no Node.js é compartilhada entre várias solicitações HTTP.
:::

```ts
import env from '#start/env'
import config from '@adonisjs/core/services/config'

const HOST = env.get('HOST')
const PORT = env.get('PORT')

config.set('app.appUrl', `http://${HOST}:${PORT}`)
```
