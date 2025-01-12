---
summary: Testes de linha de comando no AdonisJS usando o framework de comando Ace.
---

# Testes de console

Testes de linha de comando referem-se a testar comandos Ace personalizados que fazem parte do seu aplicativo ou da base de código do pacote.

Neste guia, aprenderemos como escrever testes para um comando, simular a saída do logger e capturar prompts CLI.

## Exemplo básico

Vamos começar criando um novo comando chamado `greet`.

```sh
node ace make:command greet
```

```ts
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class Greet extends BaseCommand {
  static commandName = 'greet'
  static description = 'Greet a username by name'

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "Greet"')
  }
}
```

Vamos criar um teste de **unidade** dentro do diretório `tests/unit`. Sinta-se à vontade para [definir o conjunto de testes de unidade](./introduction.md#suites) se ele ainda não estiver definido.

```sh
node ace make:test commands/greet --suite=unit

# DONE:    create tests/unit/commands/greet.spec.ts
```

Vamos abrir o arquivo recém-criado e escrever o teste a seguir. Usaremos o serviço `ace` para criar uma instância do comando `Greet` e afirmar que ele sai com sucesso.

```ts
import { test } from '@japa/runner'
import Greet from '#commands/greet'
import ace from '@adonisjs/core/services/ace'

test.group('Commands greet', () => {
  test('should greet the user and finish with exit code 1', async () => {
    /**
     * Create an instance of the Greet command class
     */
    const command = await ace.create(Greet, [])

    /**
     * Execute command
     */
    await command.exec()

    /**
     * Assert command exited with status code 0
     */
    command.assertSucceeded()
  })
})
```

Vamos executar o teste usando o seguinte comando ace.

```sh
node ace test --files=commands/greet
```

## Testando a saída do logger

O comando `Greet` atualmente grava a mensagem de log no terminal. Para capturar esta mensagem e escrever uma asserção para ela, teremos que alternar a biblioteca de UI do ace para o modo `raw`.

No modo `raw`, o ace não gravará nenhum log no terminal. Em vez disso, os manterá na memória para escrever asserções.

Usaremos o gancho Japa `each.setup` para alternar para dentro e para fora do modo `raw`.

```ts
test.group('Commands greet', (group) => {
  // highlight-start
  group.each.setup(() => {
    ace.ui.switchMode('raw')
    return () => ace.ui.switchMode('normal')
  })
  // highlight-end
  
  // test goes here
})
```

Depois que o gancho for definido, você pode atualizar seu teste da seguinte forma.

```ts
test('should greet the user and finish with exit code 1', async () => {
  /**
   * Create an instance of the Greet command class
   */
  const command = await ace.create(Greet, [])

  /**
   * Execute command
   */
  await command.exec()

  /**
   * Assert command exited with status code 0
   */
  command.assertSucceeded()

  // highlight-start
  /**
   * Assert the command printed the following log message
   */
  command.assertLog('[ blue(info) ] Hello world from "Greet"')
  // highlight-end
})
```

## Testando a saída das tabelas

Semelhante ao teste das mensagens de log, você pode escrever asserções para a saída da tabela alternando a biblioteca da IU para o modo `raw`.

```ts
async run() {
  const table = this.ui.table()
  table.head(['Name', 'Email'])

  table.row(['Harminder Virk', 'virk@adonisjs.com'])
  table.row(['Romain Lanz', 'romain@adonisjs.com'])
  table.row(['Julien-R44', 'julien@adonisjs.com'])
  table.row(['Michaël Zasso', 'targos@adonisjs.com'])

  table.render()
}
```

Dada a tabela acima, você pode escrever uma asserção para ela da seguinte forma.

```ts
const command = await ace.create(Greet, [])
await command.exec()

command.assertTableRows([
  ['Harminder Virk', 'virk@adonisjs.com'],
  ['Romain Lanz', 'romain@adonisjs.com'],
  ['Julien-R44', 'julien@adonisjs.com'],
  ['Michaël Zasso', 'targos@adonisjs.com'],
])
```

## Trapping prompts

Como [prompts](../ace/prompts.md) bloqueia o terminal aguardando entrada manual, você deve capturar e responder a eles programaticamente ao escrever testes.

Os prompts são capturados usando o método `prompt.trap`. O método aceita o título do prompt (sensível a maiúsculas e minúsculas) e oferece uma API encadeável para configurar comportamento adicional.

Os traps são removidos automaticamente após o prompt ser acionado. Um erro será gerado se o teste terminar sem acionar o prompt com um trap.

No exemplo a seguir, colocamos uma armadilha em um prompt intitulado `"Qual é seu nome?"` e respondemos usando o método `replyWith`.

```ts
const command = await ace.create(Greet, [])

// highlight-start
command.prompt
  .trap('What is your name?')
  .replyWith('Virk')
// highlight-end

await command.exec()

command.assertSucceeded()
```

### Escolhendo opções

Você pode escolher opções com um prompt select ou multi-select usando os métodos `chooseOption` e `chooseOptions`.

```ts
command.prompt
  .trap('Select package manager')
  .chooseOption(0)
```

```ts
command.prompt
  .trap('Select database manager')
  .chooseOptions([1, 2])
```

### Aceitando ou rejeitando prompts de confirmação

Você pode aceitar ou rejeitar prompts exibidos usando os métodos `toggle` e `confirm`.

```ts
command.prompt
  .trap('Want to delete all files?')
  .accept()
```

```ts
command.prompt
  .trap('Want to delete all files?')
  .reject()
```

### Afirmando contra validações

Para testar o comportamento de validação de um prompt, você pode usar os métodos `assertPasses` e `assertFails`. Esses métodos aceitam o valor do prompt e o testam em relação ao método [prompt's validate](../ace/prompts.md#prompt-options).

```ts
command.prompt
  .trap('What is your name?')
  // assert the prompt fails when an empty value is provided
  .assertFails('', 'Please enter your name')
  
command.prompt
  .trap('What is your name?')
  .assertPasses('Virk')
```

A seguir, um exemplo de uso de asserções e resposta a um prompt juntos.

```ts
command.prompt
  .trap('What is your name?')
  .assertFails('', 'Please enter your name')
  .assertPasses('Virk')
  .replyWith('Romain')
```

## Asserções disponíveis

A seguir, a lista de métodos de asserção disponíveis em uma instância de comando.

### `assertSucceeded`

Declara que o comando saiu com `exitCode=0`.

```ts
await command.exec()
command.assertSucceeded()
```

### `assertFailed`

Declara que o comando saiu com `exitCode` diferente de zero.

```ts
await command.exec()
command.assertSucceeded()
```

### `assertExitCode`

Declara que o comando saiu com um `exitCode` específico.

```ts
await command.exec()
command.assertExitCode(2)
```

### `assertNotExitCode`

Declara que o comando saiu com qualquer `exitCode`, mas não o código de saída fornecido.

```ts
await command.exec()
command.assertNotExitCode(0)
```

### `assertLog`

Declara que o comando grava uma mensagem de log usando a propriedade `this.logger`. Opcionalmente, você pode declarar o fluxo de saída como `stdout` ou `stderr`.

```ts
await command.exec()

command.assertLog('Hello world from "Greet"')
command.assertLog('Hello world from "Greet"', 'stdout')
```

### `assertLogMatches`

Declara que o comando grava uma mensagem de log que corresponde à expressão regular fornecida.

```ts
await command.exec()

command.assertLogMatches(/Hello world/)
```

### `assertTableRows`

O comando Assert imprime uma tabela no `stdout`. Você pode fornecer as linhas da tabela como uma matriz de colunas. As colunas são representadas como uma matriz de células.

```ts
await command.exec()

command.assertTableRows([
  ['Harminder Virk', 'virk@adonisjs.com'],
  ['Romain Lanz', 'romain@adonisjs.com'],
  ['Julien-R44', 'julien@adonisjs.com'],
])
```
