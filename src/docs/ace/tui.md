---
summary: Ace Terminal UI utiliza o pacote @poppinss/cliui, oferecendo ferramentas para exibir logs, tabelas e animações. Projetado para testes, ele inclui um modo 'raw' para simplificar a coleta de logs e asserções.
---

# Terminal UI

Ace terminal UI é alimentada pelo pacote [@poppinss/cliui](https://github.com/poppinss/cliui). O pacote exporta auxiliares para exibir logs, renderizar tabelas, renderizar tarefas animadas UI e muito mais.

Os primitivos do terminal UI são construídos com testes em mente. Ao escrever testes, você pode ativar o modo `raw` para desabilitar cores e formatação e coletar todos os logs na memória para escrever asserções contra eles.

[Testando comandos Ace](../testing/console_tests.md)

## Exibindo mensagens de log

Você pode exibir mensagens de log usando o registrador CLI. A seguir está a lista de métodos de log disponíveis.

```ts
import { BaseCommand } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  async run() {
    this.logger.debug('Something just happened')
    this.logger.info('This is an info message')
    this.logger.success('Account created')
    this.logger.warning('Running out of disk space')

    // Writes to stderr
    this.logger.error(new Error('Unable to write. Disk full'))
    this.logger.fatal(new Error('Unable to write. Disk full'))
  }
}
```

### Adicionando prefixo e sufixo

Usando o objeto de opções, você pode definir o `prefixo` e o `sufixo` para a mensagem de log. O prefixo e o sufixo são exibidos com menor opacidade.

```ts
this.logger.info('installing packages', {
  suffix: 'npm i --production'
})

this.logger.info('installing packages', {
  prefix: process.pid
})
```

### Animação de carregamento

Uma mensagem de log com animação de carregamento anexa três pontos animados (...) à mensagem. Você pode atualizar a mensagem de log usando o método `animation.update` e parar a animação usando o método `animation.stop`.

```ts
const animation = this.logger.await('installing packages', {
  suffix: 'npm i'
})

animation.start()

// Update the message
animation.update('unpacking packages', {
  suffix: undefined
})

// Stop animation
animation.stop()
```

### Ações do logger

Ações do logger podem exibir o estado da ação com estilo e cores consistentes.

Você pode criar uma ação usando o método `logger.action`. O método aceita o título da ação como o primeiro parâmetro.

```ts
const createFile = this.logger.action('creating config/auth.ts')

try {
  await performTasks()
  createFile.displayDuration().succeeded()  
} catch (error) {
  createFile.failed(error)
}
```

Você pode marcar uma ação como `succeeded`, `failed` ou `skipped`.

```ts
action.succeeded()
action.skipped('Skip reason')
action.failed(new Error())
```

## Formatando texto com cores ANSI

Ace usa [kleur](https://www.npmjs.com/package/kleur) para formatar texto com cores ANSI. Usando a propriedade `this.colors`, você pode acessar a API encadeada do kleur.

```ts
this.colors.red('[ERROR]')
this.colors.bgGreen().white(' CREATED ')
```

## Renderizando tabelas

Uma tabela pode ser criada usando o método `this.ui.table`. O método retorna uma instância da classe `Table` que você pode usar para definir o cabeçalho e as linhas da tabela.

```ts
import { BaseCommand } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  async run() {
    const table = this.ui.table()
    
    table
      .head([
        'Migration',
        'Duration',
        'Status',
      ])
      .row([
        '1590591892626_tenants.ts',
        '2ms',
        'DONE'
      ])
      .row([
        '1590595949171_entities.ts',
        '2ms',
        'DONE'
      ])
      .render()
  }
}
```

Você pode aplicar transformações de cor a qualquer valor ao renderizar a tabela. Por exemplo:

```ts
table.row([
  '1590595949171_entities.ts',
  '2',
  this.colors.green('DONE')
])
```

### Alinhar colunas à direita

Você pode alinhar as colunas à direita definindo-as como objetos e usando a propriedade hAlign. Certifique-se de também alinhar à direita a coluna de cabeçalho.

```ts
table
  .head([
    'Migration',
    'Batch'
    {
      content: 'Status',
      hAlign: 'right'
    },
  ])

table.row([
  '1590595949171_entities.ts',
  '2',
  {
    content: this.colors.green('DONE'),
    hAlign: 'right'
  }
])
```

### Renderização de largura total

Por padrão, as tabelas são renderizadas com largura ``auto``, ocupando apenas o espaço necessário para o conteúdo de cada coluna.

No entanto, você pode renderizar tabelas em largura total (ocupando todo o espaço do terminal) usando o método `fullWidth`. No modo de largura total:

- Renderizaremos todas as colunas de acordo com o tamanho do conteúdo.
- Exceto a primeira coluna, que ocupa todo o espaço disponível.

```ts
table.fullWidth().render()
```

Você pode alterar o índice da coluna para a coluna fluida (aquela que ocupa todo o espaço) chamando o método `table.fluidColumnIndex`.

```ts
table
  .fullWidth()
  .fluidColumnIndex(1)
```

## Imprimindo adesivos

Os adesivos permitem que você renderize conteúdo dentro de uma caixa com uma borda. Eles são úteis quando você quer chamar a atenção do usuário para uma informação essencial.

Você pode criar uma instância de um adesivo usando o método `this.ui.sticker`.

```ts
import { BaseCommand } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  async run() {
    const sticker = this.ui.sticker()

    sticker
      .add('Started HTTP server')
      .add('')
      .add(`Local address:   ${this.colors.cyan('http://localhost:3333')}`)
      .add(`Network address: ${this.colors.cyan('http://192.168.1.2:3333')}`)
      .render()
  }
}
```

Se você quiser exibir um conjunto de instruções dentro de uma caixa, você pode usar o método `this.ui.instructions`. Cada linha na saída das instruções será prefixada com um sinal de seta `>`.

## Renderizando tarefas

O widget de tarefas fornece uma excelente IU para compartilhar o progresso de várias tarefas demoradas. O widget tem os dois modos de renderização a seguir:

- No modo `mínimo`, a IU para a tarefa em execução no momento é expandida para mostrar uma linha de log por vez.
- No modo `verbose`, cada declaração de log é renderizada em sua linha. O renderizador verbose deve ser usado para tarefas de depuração.

Você pode criar uma instância do widget de tarefas usando o método `this.ui.tasks`.

```ts
import { BaseCommand } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  async run() {
    const tasks = this.ui.tasks()
    
    // ... rest of the code to follow
  }
}
```

Tarefas individuais são adicionadas usando o método `tasks.add`. O método aceita o título da tarefa como o primeiro parâmetro e o retorno de chamada de implementação como o segundo parâmetro.

Você deve retornar o status da tarefa do retorno de chamada. Todos os valores de retorno são considerados mensagens de sucesso até que você os envolva dentro do método `task.error` ou lance uma exceção dentro do retorno de chamada.

```ts
import { BaseCommand } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  async run() {
    const tasks = this.ui.tasks()

    // highlight-start
    await tasks
      .add('clone repo', async (task) => {
        return 'Completed'
      })
      .add('update package file', async (task) => {
        return task.error('Unable to update package file')
      })
      .add('install dependencies', async (task) => {
        return 'Installed'
      })
      .run()
    // highlight-end
  }
}
```

### Relatando o progresso da tarefa

Em vez de escrever as mensagens de progresso da tarefa no console, é recomendável chamar o método `task.update`.

O método `update` exibe a mensagem de log mais recente usando o renderizador `minimal` e registra todas as mensagens usando o renderizador `verbose`.

```ts
const sleep = () => new Promise<void>((resolve) => setTimeout(resolve, 50))
const tasks = this.ui.tasks()
await tasks
  .add('clone repo', async (task) => {
    for (let i = 0; i <= 100; i = i + 2) {
      await sleep()
      task.update(`Downloaded ${i}%`)
    }

    return 'Completed'
  })
  .run()
```

### Mudando para o renderizador verbose

Você pode mudar para um renderizador verbose ao criar o widget de tarefas. Você pode considerar permitir que o usuário do comando passe um sinalizador para ativar o modo `verbose`.

```ts
import { BaseCommand, flags } from '@adonisjs/core/ace'

export default class GreetCommand extends BaseCommand {
  @flags.boolean()
  declare verbose: boolean

  async run() {
    const tasks = this.ui.tasks({
      verbose: this.verbose
    })
  }
}
```
