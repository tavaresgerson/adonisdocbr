# Ace

Ace é uma estrutura de linha de comando incorporada ao núcleo do AdonisJS. Comandos como `node ace serve` ou `node ace make:controller` são alimentados pelo Ace CLI.

O Ace também permite que você crie comandos personalizados armazenando-os localmente na base de código do seu projeto.

## Por que usamos Ace em vez de scripts npm?

A maioria dos projetos Node.js faz uso extensivo dos [scripts npm](https://docs.npmjs.com/cli/v7/using-npm/scripts). Os scripts Npm são ótimos, pois permitem que você defina scripts por projeto em vez de defini-los globalmente em algum lugar do seu computador.

No entanto, os scripts npm não fornecem nenhuma ferramenta para criar os comandos CLI. Você ainda precisa analisar manualmente os argumentos/sinalizadores CLI e também gerenciar o ciclo de vida do comando.

Por outro lado, o Ace é uma estrutura adequada para criar interfaces CLI.

## Uso

O Ace vem pré-configurado com cada novo aplicativo AdonisJS, e você pode executá-lo usando o arquivo `ace` armazenado na raiz do seu projeto.

```sh
node ace
```

![Tela de ajuda](/docs/assets/ace-help.png)

O arquivo `ace` é um arquivo JavaScript sem extensão que você pode executar como qualquer outro programa Node.js. Executar este arquivo inicializará a estrutura da linha de comando e executará o comando mencionado.

Você pode listar todos os comandos executando `node ace --help` e visualizar a ajuda para um comando específico usando `node ace <command-name> --help`.

## Onde os comandos são definidos?

O Ace permite que você e os pacotes que você instala contribuam com comandos. Eles são definidos dentro do arquivo `.adonisrc.json` sob o array `commands`.

```json
{
  "commands": [
    "./commands",
    "@adonisjs/core/build/commands",
    "@adonisjs/repl/build/commands"
  ]
}
```

Cada entrada dentro do array deve apontar para um arquivo que [exporta um comando Ace](https://github.com/adonisjs/core/blob/develop/commands/GenerateKey.ts). Ou pode exportar um [matriz adicional de comandos](https://github.com/adonisjs/core/blob/develop/commands/index.ts).

A primeira entrada, `./commands` é uma referência ao diretório de comandos do seu projeto. Os arquivos dentro deste diretório são escaneados e registrados como comandos.

## Criando um novo comando

Você pode criar um novo comando executando o seguinte comando Ace.

```sh
node ace make:command Greet

# CREATE: commands/Greet.ts
```

Antes de executar o comando recém-criado, você terá que indexá-lo executando o seguinte comando. [Saiba por que a indexação é necessária](#generating-the-ace-manifest-file)

```sh
node ace generate:manifest
```

Finalmente, você pode executar o comando da seguinte forma:

```sh
node ace greet

# [ info ]  Hello world!
```

## Estrutura de comandos

Os comandos Ace são representados como classes e estendem a classe `BaseCommand`. Você define o nome e a descrição do comando como propriedades estáticas na própria classe.

```ts
import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class Greet extends BaseCommand {
  public static commandName = 'greet'

  public static description = ''

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run () {
    this.logger.info('Hello world!')
  }
}
```

#### `commandName`
O nome do comando que deve ser digitado para executar o comando. Deve ser sempre uma string.

#### `description`
A descrição do comando é mostrada na saída de ajuda. Use esta propriedade para explicar brevemente o que o comando faz.

#### `settings`
A propriedade settings controla o comportamento do tempo de execução do comando.

| Opção         | Descrição     |
|---------------|---------------|
| **loadApp**   | Instrui o Ace a inicializar o aplicativo antes de executar o método. Por padrão, os comandos NÃO carregam o aplicativo e são executados como scripts independentes. |
| **stayAlive** | Instrui o Ace a NÃO matar o processo após executar o comando. No entanto, certifique-se de matar manualmente o processo usando `await this.exit()` |

#### aliases
Você também pode definir uma matriz de aliases para o nome do comando. Isso permite que outros executem o comando usando os aliases também.

```ts {3}
export default class Greet extends BaseCommand {
  public static commandName = 'greet'
  public static aliases = ['welcome', 'hi']
}
```

#### run
Cada comando deve implementar o método `run` e escrever a lógica para manipular o comando dentro dele.

### Inicializando o aplicativo dentro do comando
Os comandos Ace não inicializam seu aplicativo antes de executar o comando. Se seu comando depende do código do aplicativo, você deve instruir o comando a carregar o aplicativo primeiro e então executar o método `run`.

```ts {4-6}
export default class Greet extends BaseCommand {
  public static commandName = 'greet'

  public static settings = {
    loadApp: true
  }
}
```

### Importações de nível superior não são permitidas
Importações de nível superior que dependem do contêiner IoC ou da base de código do aplicativo não são permitidas, e você deve movê-las para dentro do método `run`. Por exemplo:

#### ❌ Não funciona
```ts
import User from 'App/Models/User'

export default class CreateUser extends BaseCommand {
  public static commandName = 'create:user'
  public static settings = {
    loadApp: true
  }

  public async run() {
    await User.create({})
  }
}
```

#### ✅ Funciona, depois que a importação é movida para dentro do método `run`
```ts
export default class CreateUser extends BaseCommand {
  public static commandName = 'create:user'
  public static settings = {
    loadApp: true
  }

  public async run() {
    const { default: User } = await import('App/Models/User')
    await User.create()
  }
}
```

#### 🤷‍♂️ Raciocínio
Vamos tentar visualizar o ciclo de vida do comando para entender por que importações de nível superior não são permitidas.

- A importação do modelo `User` importa internamente o Lucid ORM do contêiner IoC.
- Como o aplicativo ainda não foi inicializado, o Lucid ORM não está disponível.
- Para carregar o aplicativo, o Ace primeiro terá que acessar a propriedade `settings.loadApp` definida no construtor do comando.
- No entanto, não pode porque a importação de nível superior resulta em um erro.

Existem outras maneiras de projetar esse fluxo de trabalho, mas achamos que mover as importações dentro do método `run` vale o incômodo de manter todas as configurações de comando e metadados dentro de um único arquivo.

## Argumentos CLI
Você registra os argumentos e sinalizadores que seu comando aceita como propriedades na classe. Por exemplo:

```ts {10-14}
import {
  BaseCommand,
  args,
  flags
} from '@adonisjs/core/build/standalone'

export default class Greet extends BaseCommand {
  public static commandName = 'greet'

  @args.string({ description: 'Name of the person to greet' })
  public name: string

  @flags.boolean({ alias: 'i', description: 'Enable interactive mode' })
  public interactive: boolean

  public async run() {}
}
```

Certifique-se de gerar o arquivo de manifesto Ace executando o seguinte comando.

```sh
node ace generate:manifest
```

E então visualize a ajuda para o comando `greet`.

```sh
node ace greet --help
```

![](/docs/assets/command-args-flags.webp)

### Argumentos
Os argumentos de comando são posicionais e são aceitos na mesma ordem em que você os define em sua classe. Por exemplo:

```ts
export default class Greet extends BaseCommand {
  @args.string()
  public name: string

  @args.string()
  public age: string

  @args.string()
  public height: string
}
```

```sh
node ace greet <name> <age> <height>
```

#### `args.string`
Marca a propriedade como um argumento de linha de comando. Nota: Os argumentos de comando são sempre representados como uma string. Você terá que executar o typecasting se esperar um valor que não seja string.

```ts
@args.string({
  description: 'The argument description',
  name: 'username'
})
public name: string
```

#### `args.spread`
O método `@args.spread` permite que você defina um argumento catch-all. É como os [parâmetros rest ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) em JavaScript e deve ser sempre o último argumento.

```ts {6-7}
import { BaseCommand, args } from '@adonisjs/core/build/standalone'

export default class FileReader extends BaseCommand {
  public static commandName = 'read'

  @args.spread()
  public files: string[]

  public async run () {
    console.log(this.files)
  }
}
```

```sh
node ace read foo.txt bar.txt baz.txt
```

A saída será:

```ts
[ 'foo.txt', 'bar.txt', 'baz.txt' ]
```

#### Opções

Todos os métodos `@args` aceitam as seguintes opções.

| Opção           | Descrição   |
|-----------------|-------------|
| **description** | A descrição da ajuda para o argumento |
| **name**        | Defina um nome público para o argumento (aquele que aparece na saída da ajuda). |

## Flags
Você define os flags usando o decorador `@flags`. Um flag pode aceitar valores `boolean`, `string/string[]` ou `number/number[]`.

#### `flags.boolean`
Aceita um flag boolean.

```ts
@flags.boolean()
public interactive: boolean
```

O valor do flag boolean é definido como `false`, a menos que o flag tenha sido especificado. No entanto, você também pode definir o valor padrão.

```ts
@flags.boolean()
public interactive: boolean = true
```

Para desabilitar o flag em tempo de execução, você deve negá-lo com a palavra-chave `--no`.

```sh
node ace greet virk --no-interactive
```

#### `flags.string`
Defina um flag que aceite um valor de string.

```ts
@flags.string()
public email: string

@flags.string()
public password: string
```

#### `flags.array`
Defina um sinalizador que pode ser repetido várias vezes. O valor é uma matriz de strings.

```ts
@flags.array()
public files: string[]
```

```sh
node ace read --files=foo.txt --files=bar.txt

## Ou separe-os com vírgula
node ace read --files=foo.txt,bar.txt
```

```ts
console.log(this.files)

// ['foo.txt', 'bar.txt']
```

#### `flags.number`

Defina um sinalizador que aceita um valor numérico.

```ts
@flags.number({ alias: 'i' })
public iterations: number
```

#### `flags.numArray`

O mesmo que [@flags.array](#flagsarray), mas aceita uma matriz de números.

```ts
@flags.numArray()
public counters: number[]
```

#### Opções

Todos os decoradores `@flags` aceitam as seguintes opções.

| Opção             | Descrição   |
|-------------------|-------------|
| **alias**         | O nome abreviado para o sinalizador. Os nomes abreviados são sempre definidos usando um único traço `-` |
| **description**   | A descrição de ajuda para o sinalizador |
| **name**          | Nome público para o sinalizador (aquele que aparece na saída de ajuda). |

## Prompts

O Ace tem suporte integrado para criar prompts interativos no terminal. Você pode acessar o módulo `prompts` usando a propriedade `this.prompt`.

A seguir, um exemplo de uso de vários prompts juntos.

```ts
import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class CreateUser extends BaseCommand {
  public static commandName = 'create:user'
  public static description = 'Create a new user'

  public async run () {
    const email = await this.prompt.ask('Enter email')
    const password = await this.prompt.secure('Choose account password')
    const userType = await this.prompt.choice('Select account type', [
      {
        name: 'admin',
        message: 'Admin (Complete access)',
      },
      {
        name: 'collaborator',
        message: 'Collaborator (Can access specific resources)',
      },
      {
        name: 'user',
        message: 'User (Readonly access)',
      }
    ])

    const verifyEmail = await this.prompt.confirm('Send account verification email?')
    const accountTags = await this.prompt.enum('Type tags to associate with the account')

    console.log({
      email, password, userType, verifyEmail, accountTags
    })
  }
}
```

<video src="/docs/assets/command-prompts.mp4" controls />

#### `prompt.ask`
Exibe o prompt para inserir um valor. Opcionalmente, aceita [options](#all-prompts-options) como o segundo argumento.

```ts
await this.prompt.ask('Choose account username', {
  validate(answer) {
    if (!answer || answer.length < 4) {
      return 'Username is required and must be over 4 characters'
    }

    return true
  },
})
```

#### `prompt.secure`
Usa o tipo de prompt `password`. Opcionalmente, aceita [options](#all-prompts-options) como o segundo argumento.

```ts
await this.prompt.secure('Enter account password', {
  validate(answer) {
    if (!answer) {
      return 'Password is required to login'
    }

    return true
  },
})
```

#### `prompt.confirm`
Exibe o prompt para selecionar entre `Sim` e `Não`. Opcionalmente, você pode passar a configuração [opções](#all-prompts-options) como o segundo argumento.

```ts
await this.prompt.confirm('Want to delete files?')
```

#### `prompt.toggle`
Semelhante ao prompt `confirm`. No entanto, ele permite valores de exibição personalizados `Sim` e `Não`. Opcionalmente, você pode passar a configuração [opções](#all-prompts-options) como o segundo argumento.

```ts
await this.prompt.toggle('Want to delete files?', ['Yep', 'Nope'])
```

#### `prompt.choice`

Exibe uma lista de opções com a possibilidade de escolher apenas uma. Opcionalmente, você pode passar a configuração [opções](#all-prompts-options) como o terceiro argumento.

```ts
await this.prompt.choice('Select installation client', ['npm', 'yarn'])
```

Ou passe as escolhas como uma matriz de objetos.

```ts
await this.prompt.choice('Select toppings', [
  {
    name: 'Jalapenos',
    hint: 'Marinated in vinegar, will taste sour',
  },
  {
    name: 'Lettuce',
    hint: 'Fresh and leafy',
  },
])
```

#### `prompt.multiple`
Exibe uma lista de escolhas e permite selecionar várias opções. Opcionalmente, você pode passar a configuração [options](#all-prompts-options) como o terceiro argumento.

```ts
await this.prompt.multiple('Select base dependencies', [
  '@adonisjs/core', '@adonisjs/bodyparser'
])
```

Ou passe a escolha como um objeto.

```ts
await this.prompt.multiple('Select base dependencies', [
  {
    name: '@adonisjs/core',
    message: 'Framework core',
  },
  {
    name: '@adonisjs/bodyparser',
    message: 'Bodyparser',
  },
])
```

#### `prompt.autocomplete`
Exibe uma lista de opções para fazer uma ou mais seleções, com a capacidade de filtrar os itens da lista. Opcionalmente, você pode passar a configuração [options](#all-prompts-options) como o terceiro argumento.

```ts
await this.prompt.autocomplete(
  'Select country',
  ['India', 'USA', 'UK', 'Ireland', 'Australia']
)
```

Para seleção múltipla, você pode definir `options.multiple = true`.

```ts
await this.prompt.autocomplete(
  'Select country',
  ['India', 'USA', 'UK', 'Ireland', 'Australia'],
  { multiple: true }
)
```

#### `prompt.enum`
Semelhante ao prompt `ask`, mas permite valores separados por vírgula (,). Aceita opcionalmente [options](#all-prompts-options) como o segundo argumento.

```ts
await this.prompt.enum('Define tags', {
  hint: 'Accepts comma separated values',
})
```

### Todas as opções de prompts

#### `default`
O valor padrão a ser usado quando nenhuma entrada foi fornecida

```ts
{
  default: 'Virk'
}
```

#### `hint`
Exibe dica para ajudar a preencher a entrada

```ts
{
  hint: 'Email will be used for login.'
}
```

#### `result`
Modifica o resultado. O método é invocado logo antes de resolver a promessa do prompt **Observação**: O valor será diferente com base no tipo de entrada. Por exemplo: O valor para `prompt.multiple` será uma matriz ou seleções.

```ts
{
  result: (value) => {
    return value.toUppercase()
  }
}
```

#### `format`
Formate a entrada do usuário em tempo real (conforme ele digita). **Observação**: O valor será diferente com base no tipo de entrada. Por exemplo: O valor para `prompt.multiple` será uma matriz ou seleções.

```ts
{
  format: (value) => {
      return value.toUppercase()
  }
}
```

#### `validate`
Valida a entrada do usuário. Retorna `true` para passar a validação ou `false/mensagem de erro`. **Observação**: O valor será diferente com base no tipo de entrada. Por exemplo: O valor para `prompt.multiple` será uma matriz ou seleções.

```ts
{
  validate: (value) => {
    if (!value) {
      return 'Enter value'
    }

    return true
  }
}
```

## Logger
Você pode usar o logger integrado para registrar mensagens no console. Nós removemos automaticamente as cores e os ícones se o terminal não suportar cores.

```ts
export default class Greet extends BaseCommand {
  public static commandName = 'greet'
  public static description = 'Greet a person by their name'

  public async run () {
    this.logger.info('This is an info message')
    this.logger.warning('Running out of disk space')
    this.logger.error(new Error('Unable to write. Disk full'))
    this.logger.fatal(new Error('Unable to write. Disk full'))
    this.logger.debug('Something just happened')
    this.logger.success('Account created')
    this.logger.info('Message with time prefix', '%time%')

    const spinner = this.logger.await(
      'installing dependencies'
      undefined,
      'npm install --production'
    )

    // executar alguma tarefa
    spinner.stop()
  }
}
```

![](/docs/assets/ace-logger-output.webp)

Todos os métodos do logger também recebem um valor opcional para a mensagem de log `prefix` e `suffix`.

```ts
this.logger.info('hello world', 'prefix', 'suffix')
```

### Ações
Junto com as mensagens de log padrão, você também pode exibir mensagens de log para uma ação específica. Por exemplo, uma ação para criar o arquivo pode usar o seguinte código para mostrar seu status.

::: info NOTA
As ações do logger são usadas apenas para exibir a IU. Você ainda precisa executar a ação
você mesmo.
:::

```ts
const filePath = 'app/Models/User.ts'

this.logger.action('create').succeeded(filePath)
this.logger.action('create').skipped(filePath, 'File already exists')
this.logger.action('create').failed(filePath, 'Something went wrong')
```

![](/docs/assets/logger-actions.webp)

### Atualizar linha de log existente
O logger também permite que você registre mensagens atualizando a linha de log existente. Usando este método, você pode desenhar barras de progresso textuais e ASCII.

Toda vez que você executar o método `logUpdate`, ele atualizará a linha de log existente com a nova mensagem. Você pode persistir e mover para a nova linha usando o método `logUpdatePersist`.

A seguir está um exemplo completo de funcionamento da exibição de uma barra de progresso.

```ts
import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class Greet extends BaseCommand {
  public static commandName = 'greet'

  private getProgressBar(currentPercentage: number) {
    /**
     * Desenhe uma célula para quase cada 3%. Isso é para garantir que a
     * barra de progresso renderize bem em terminais de largura menor
     */
    const completed = Math.ceil(currentPercentage / 3)
    const incomplete = Math.ceil((100 - currentPercentage) / 3)
    return `[${new Array(completed).join('=')}${new Array(incomplete).join(' ')}]`
  }

  public async run () {
    for (let i = 0; i <= 100; i = i + 2) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      this.logger.logUpdate(`downloading ${this.getProgressBar(i)} ${i}%`)
    }

    this.logger.logUpdatePersist()
  }
}
```

<video src="/docs/assets/progress-bar-ace.mov" controls />

## CLI UI
A CLI UI expõe a API para **desenhar tabelas**, **renderizar instruções dentro de uma caixa** e **animar o progresso das tarefas**.

### Tabelas
Você pode desenhar tabelas usando a propriedade `this.ui.table`. A seguir está um exemplo do mesmo.

```ts
const table = this.ui.table()
table.head(['Name', 'Email', 'Score'])

// Defina opcionalmente as larguras das colunas
table.columnWidths([15, 30, 10])

// Adicione novas linhas
table.row(['Virk', 'virk@adonisjs.com', '67'])
table.row(['Romain', 'romain@adonisjs.com', '82'])
table.row(['Nikk', 'nikk@adonisjs.com', '41'])

// Renderize a tabela
table.render()
```

- Você cria uma nova instância de tabela usando o método `this.ui.table()`.
- Crie o cabeçalho da tabela usando o método `.head()` e passe um array de colunas para criar.
- Adicione novas linhas usando o método `.row()`.
- E finalmente, renderize a tabela usando o método `.render()`.

![](/docs/assets/ui-table.webp)

### Exibir instruções
Você pode exibir instruções para uma determinada ação desenhando-as dentro de uma caixa delimitada. Por exemplo:

```ts
this.ui
  .instructions()
  .add(`cd ${this.colors.cyan('hello-world')}`)
  .add(`Run ${this.colors.cyan('node ace serve --watch')} to start the server`)
  .render()
```

- Chamar o método `this.ui.instructions()` inicia um novo bloco de instruções.
- Em seguida, você pode adicionar novas linhas usando o método `.add()`.
- Finalmente, chame o método `.render()` para renderizá-lo no console.

![](/docs/assets/logger-instructions.webp)

### Adesivo
Um adesivo é semelhante ao bloco `instructions`. No entanto, ele não prefixa as linhas com um ponteiro `>`. O resto é tudo igual.

```ts
this.ui
  .sticker()
  .add('Started HTTP server')
  .add('')
  .add(`Local address:    ${this.colors.cyan('http://localhost:3333')}`)
  .add(`Network address:  ${this.colors.cyan('http://192.168.1.4:3333')}`)
  .render()
```

![](/docs/assets/logger-sticker.webp)

### Renderizador de tarefas
Você pode usar o renderizador de tarefas para exibir a saída de várias ações. O próprio AdonisJS o usa para mostrar a IU ao criar um novo aplicativo.

O renderizador de tarefas tem dois modos de saída, ou seja, `minimal` e `verbose`. Mudamos automaticamente para o modo `verbose` quando o shell não é [interativo](https://github.com/poppinss/cliui/blob/develop/api.ts#L28-L30).

```ts
const tasksManager = this.ui.tasks()

// Alternar manualmente para renderizador detalhado
const tasksManager = this.ui.tasks.verbose()
```

Após criar o renderizador de tarefas, você adiciona uma nova tarefa chamando o método `.add` e executa o trabalho real da tarefa dentro dele. Após concluir a execução da tarefa, você deve chamar `task.complete` ou `task.fail` para passar para a próxima tarefa na fila.

```ts
tasksManager
  .add('clone repo', async (logger, task) => {
    // use o logger para registrar o progresso
    await task.complete()
  })
  .add('install package', async (logger, task) => {
    await task.fail(new Error('Cannot install packages'))
  })
```

Chame o método `run` após definir todas as tarefas.

```ts
await tasksManager.run()
```

## Gerador de modelos
O Ace tem um gerador de modelos leve embutido. Você pode usá-lo para gerar arquivos a partir de stubs pré-existentes. Por exemplo:

```ts {8-18}
import { join } from 'path'
import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class Greet extends BaseCommand {
  public static commandName = 'greet'

  public async run() {
    const name = 'UsersController'

    this.generator
      .addFile(name)
      .appRoot(this.application.appRoot)
      .destinationDir('app/Controllers/Http')
      .useMustache()
      .stub(join(__dirname, './templates/controller.txt'))
      .apply({ name })

    await this.generator.run()
  }
}
```

- O método `generator.addFile` inicia o processo para criar um novo arquivo.
- Usando sua API fluente, você pode definir o destino do arquivo, seu stub e dados para passar para o stub
- Finalmente execute `this.generator.run` para criar todos os arquivos adicionados usando o método `.addFile`.

#### `addFile`
O método cria uma nova instância da classe [GeneratorFile](https://github.com/adonisjs/ace/blob/develop/src/Generator/File.ts). Ele aceita dois argumentos; primeiro, o nome do arquivo (com ou sem a extensão) e o segundo é um objeto de opções.

```ts
this.generator.addFile(
  'UserController',
  {
    // forçar nome de arquivo a ser plural
    form: 'plural',

    // definir extensão ".ts" quando ainda não estiver definida
    extname: '.ts',

    // reformatar o nome para "camelCase"
    pattern: 'camelcase',

    // adicionar sufixo "Controller", quando ainda não estiver definido
    suffix: 'Controller',

    // Não pluralizar quando o nome do controlador corresponder a um dos seguintes
    formIgnoreList: ['Home', 'Auth', 'Login']
  }
)
```

#### `destinationDir`
Defina o diretório de destino no qual você deseja criar o arquivo. Você também pode extrair o nome do diretório do arquivo `.adonisrc.json` da seguinte forma:

```ts
// Obter caminho para o diretório de configuração
file.destinationDir(
  this.application.directoriesMap.get('config')!
)

// Obter caminho para o namespace dos controladores
file.destinationDir(
  this.application.resolveNamespaceDirectory('httpControllers')!
)
```

#### `appRoot`
Defina a raiz do aplicativo. Isso é prefixado ao `destinationDir` para criar um caminho absoluto.

```ts
file.appRoot(this.application.appRoot)
```

#### `stub`
Defina um caminho absoluto para o modelo stub. Você pode escrever modelos usando literais de modelo ES6 ou usar [mustache](https://mustache.github.io/) chamando primeiro o método `useMustache`.

```ts
file
  .useMustache() // use o mustache como mecanismo de modelo
  .stub(join(__dirname, 'templates/controller.txt'))
```

#### `apply`
Compartilhe dados com o modelo mustache. O nome do arquivo atual (após aplicar todas as transformações) é compartilhado com o modelo como a propriedade `filename`.

```ts
file.apply({
  resourceful: true
})
```

#### `run`
O método `generator.run` começa a criar os arquivos definidos usando o método `.addFile`. O gerador ignora o arquivo se o caminho de destino já existir.

```ts
await this.generator.run()
```

## Ganchos do ciclo de vida
Os comandos podem definir os seguintes ganchos do ciclo de vida.

O método `prepare` é executado antes de executar o método run.
E o método `completed` é executado após o método run.

```ts
export default class Greet extends BaseCommand {
  public async prepare() {
    console.log('before run')
  }

  public async run() {
    console.log('run')
  }

  public async completed() {
    console.log('after run')
  }
}
```

Você pode acessar o erro usando a propriedade `this.error` dentro do método `completed` em caso de erros.

## Executando comandos programaticamente
Executar outros comandos no mesmo processo não é uma boa prática. Os comandos NÃO devem ser consumidos pelas diferentes partes do código, pois **eles exportam uma interface de usuário** e **não uma interface de codificação**. Por exemplo:

- Você encontra o status de um comando a partir do código de saída do processo e NÃO de algum valor de retorno.
- Os comandos despejam seu estado diretamente no terminal e não o armazenam dentro de alguma propriedade para ser acessada programaticamente.

Com tudo isso dito, há algumas maneiras de executar comandos programaticamente.

### Executar comando como um processo filho
A abordagem recomendada é executar o comando em um processo filho separado. Você pode usar o módulo `child_process` do Node.js ou usar o módulo npm [execa](https://npm.im/execa).

```ts {1,8-10}
import execa from 'execa'
import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class Greet extends BaseCommand {
  public static commandName = 'greet'

  public async run() {
    const { exitCode } = await execa.node('ace', ['make:controller', 'User'], {
      stdio: 'inherit',
    })
  }
}
```

### Executar comando dentro do mesmo processo
Outra opção é usar o kernel Ace para executar o comando dentro do mesmo processo. No exemplo a seguir, não há como saber o código de saída do comando.

```ts {7}
import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class Greet extends BaseCommand {
  public static commandName = 'greet'

  public async run() {
    await this.kernel.exec('make:controller', ['User'])
  }
}
```

## Gerando o arquivo de manifesto Ace
O manifesto Ace é um índice JSON de todos os comandos registrados. Ele permite que o Ace procure o comando, o argumento/sinalizadores que ele aceita sem carregar todos os arquivos de comando.

Gerar um índice é essencial para o desempenho. Caso contrário, importar todos os comandos, compilá-los usando o compilador TypeScript na memória levará muito tempo, até mesmo para imprimir a tela de ajuda.

O AdonisJS atualiza automaticamente o arquivo `ace-manifest.json` durante os seguintes eventos.

- Toda vez que você instala e configura um pacote usando o comando `node ace configure`.
- Quando o observador de arquivos é executado e você altera um arquivo de comando armazenado dentro do diretório `commands`.

Esses dois eventos sozinhos cobrem a maioria dos casos de uso. No entanto, você também pode atualizar manualmente o arquivo de manifesto executando o seguinte comando.

```sh
node ace generate:manifest
```
