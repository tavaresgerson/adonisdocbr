---
summary: Aprenda a criar comandos Ace personalizados no AdonisJS
---

# Criando comandos

Além de usar comandos Ace, você também pode criar comandos personalizados como parte da base de código do seu aplicativo. Os comandos são armazenados dentro do diretório `commands` (no nível raiz). Você pode criar um comando executando o seguinte comando.

Veja também: [Make command](../references/commands.md#makecommand)

```sh
node ace make:command greet
```

O comando acima criará um arquivo `greet.ts` dentro do diretório `commands`. Os comandos Ace são representados por uma classe e devem implementar o método `run` para executar as instruções de comando.

## Metadados do comando

Os metadados do comando consistem no **nome do comando**, **descrição**, **texto de ajuda** e as **opções** para configurar o comportamento do comando.

```ts
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class GreetCommand extends BaseCommand {
  static commandName = 'greet'
  static description = 'Greet a user by name'

  static options: CommandOptions = {
    startApp: false,
    allowUnknownFlags: false,
    staysAlive: false,
  }
}
```

### `commandName`

A propriedade `commandName` é usada para definir o nome do comando. Um nome de comando não deve conter espaços. Além disso, é recomendável evitar o uso de caracteres especiais desconhecidos como `*`, `&` ou barras no nome do comando.

Os nomes dos comandos podem estar sob um namespace. Por exemplo, para definir um comando sob o namespace `make`, você pode prefixá-lo com `make:`.

### `description`

A descrição do comando é mostrada dentro da lista de comandos e na tela de ajuda do comando. Você deve manter a descrição curta e usar o **texto de ajuda** para descrições mais longas.

### `help`

O texto de ajuda é usado para escrever uma descrição mais longa ou mostrar exemplos de uso.

```ts
export default class GreetCommand extends BaseCommand {
  static help = [
    'The greet command is used to greet a user by name',
    '',
    'You can also send flowers to a user, if they have an updated address',
    '{{ binaryName }} greet --send-flowers',
  ]
}
```

> A substituição da variável `{{ binaryName }}` é uma referência ao binário usado para executar comandos ace.

### `aliases`

Você pode definir um ou mais aliases para o nome do comando usando a propriedade `aliases`.

```ts
export default class GreetCommand extends BaseCommand {
  static commandName = 'greet'
  static aliases = ['welcome', 'sayhi']
}
```

### `options.startApp`

Por padrão, o AdonisJS não inicializa o aplicativo ao executar um comando Ace. Isso garante que os comandos sejam rápidos para executar e não passem pela fase de inicialização do aplicativo para executar tarefas simples.

No entanto, se o seu comando depende do estado do aplicativo, você pode dizer ao Ace para iniciar o aplicativo antes de executar o comando.

```ts {5-7}
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class GreetCommand extends BaseCommand {
  static options: CommandOptions = {
    startApp: true
  }
}
```

### `options.allowUnknownFlags`

Por padrão, o Ace imprime um erro se você passar um sinalizador desconhecido para o comando. No entanto, você pode desabilitar a análise de sinalizadores estritos no nível do comando usando a propriedade `options.allowUnknownFlags`.

```ts {5-7}
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class GreetCommand extends BaseCommand {
  static options: CommandOptions = {
    allowUnknownFlags: true
  }
}
```

### `options.staysAlive`

O AdonisJS encerra implicitamente o aplicativo após executar o comando `run` do comando. No entanto, se você quiser iniciar um processo de execução longa em um comando, você deve dizer ao Ace para não encerrar o processo.

Veja também: seções [Terminando o aplicativo](#terminating-application) e [limpando antes que o aplicativo termine](#cleaning-up-before-the-app-terminates).

```ts {5-7}
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class GreetCommand extends BaseCommand {
  static options: CommandOptions = {
    staysAlive: true
  }
}
```

## Métodos do ciclo de vida do comando

Você pode definir os seguintes métodos do ciclo de vida em uma classe de comando, e o Ace os executará em uma ordem predefinida.

```ts
import { BaseCommand, args, flags } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  async prepare() {
    console.log('preparing')
  }

  async interact() {
    console.log('interacting')
  }
  
  async run() {
    console.log('running')
  }

  async completed() {
    console.log('completed')
  }
}
```

| Método      | Descrição   |
|-------------|-------------|
| `prepare`   | Este é o primeiro método que o Ace executa em um comando. Este método pode configurar o estado ou os dados necessários para executar o comando. |
| `interact`  | O método `interact` é executado após o método `prepare`. Ele pode ser usado para exibir prompts para o usuário. |
| `run`       | A lógica principal do comando fica dentro do método `run`. Este método é chamado após o método `interact`. |
| `completed` | O método `completed` é chamado após a execução de todos os outros métodos do ciclo de vida. Este método pode ser usado para executar a limpeza ou manipular/exibir o lançamento gerado por outros métodos. |

## Injeção de dependência

Os comandos Ace são construídos e executados usando o [contêiner IoC](../concepts/dependency_injection.md). Portanto, você pode dar dicas de tipo para dependências em métodos de ciclo de vida de comando e usar o decorador `@inject` para resolvê-las.

Para demonstração, vamos injetar a classe `UserService` em todos os métodos de ciclo de vida.

```ts
import { inject } from '@adonisjs/core'
import { BaseCommand } from '@adonisjs/core/ace'
import UserService from '#services/user_service'

export default class GreetCommand extends BaseCommand {
  @inject()
  async prepare(userService: UserService) {
  }

  @inject()
  async interact(userService: UserService) {
  }
  
  @inject()
  async run(userService: UserService) {
  }

  @inject()
  async completed(userService: UserService) {
  }
}
```

## Manipulando erros e código de saída

Exceções geradas por comandos são exibidas usando o registrador CLI, e o comando `exitCode` é definido como `1` (um código de erro diferente de zero significa que o comando falhou).

No entanto, você também pode capturar erros envolvendo seu código dentro de um bloco `try/catch` ou usando o método de ciclo de vida `completed` para manipular erros. Em qualquer situação, lembre-se de atualizar as propriedades `exitCode` e `error` do comando.

### Lidando com erros com try/catch

```ts
import { BaseCommand } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  async run() {
    try {
      await runSomeOperation()
    } catch (error) {
      this.logger.error(error.message)
      this.error = error
      this.exitCode = 1
    }
  }
}
```

### Lidando com erros dentro do método concluído

```ts
import { BaseCommand } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  async run() {
    await runSomeOperation()
  }
  
  async completed() {
    if (this.error) {
      this.logger.error(this.error.message)
      
      /**
       * Notifique o Ace que o erro foi corrigido
       */
      return true
    }
  }
}
```

## Encerrando o aplicativo

Por padrão, o Ace encerrará o aplicativo após executar o comando. No entanto, se você habilitou a opção `staysAlive`, terá que encerrar explicitamente o aplicativo usando o método `this.terminate`.

Vamos supor que fazemos uma conexão redis para monitorar a memória do servidor. Ouvimos o evento `error` na conexão redis e encerramos o aplicativo quando a conexão falha.

```ts {12-15}
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class GreetCommand extends BaseCommand {
  static options: CommandOptions = {
    staysAlive: true
  }
  
  async run() {
    const redis = createRedisConnection()
    
    redis.on('error', (error) => {
      this.logger.error(error)
      this.terminate()
    })
  }
}
```

## Limpando antes do aplicativo encerrar

Vários eventos podem acionar o encerramento de um aplicativo, incluindo o [sinal `SIGTERM`](https://www.howtogeek.com/devops/linux-signals-hacks-definition-and-more/). Portanto, você deve escutar o hook `terminating` em seus comandos para executar a limpeza.

Você pode escutar o hook terminating dentro do método de ciclo de vida `prepare`.

```ts
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class GreetCommand extends BaseCommand {
  static options: CommandOptions = {
    staysAlive: true
  }
  
  prepare() {
    this.app.terminating(() => {
      // realizar a limpeza
    })
  }
  
  async run() {
  }
}
```
