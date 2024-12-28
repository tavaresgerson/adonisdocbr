---
title: Ace Commands
category: digging-deeper
---

# Comandos Ace

*Ace* é uma ferramenta de linha de comando poderosa criada para AdonisJs.

Até agora, você usou vários comandos Ace para gerar *controladores*, *modelos* ou para *executar migrações*.

Neste guia, aprendemos sobre os internos do Ace e como criar *comandos*.

## Introdução
Todo projeto AdonisJs tem um arquivo `ace` na raiz do projeto, que é um arquivo JavaScript regular, mas sem a extensão `.js`.

O arquivo `ace` é usado para executar comandos específicos do projeto. Para comandos reutilizáveis, você deve agrupá-los como pacotes npm.

Execute o código a seguir para ver a lista de comandos Ace disponíveis:

```bash
node ace
```

```bash
# .Output

Usage:
  command [arguments] [options]

Global Options:
  --env                Set NODE_ENV before running the commands
  --no-ansi            Disable colored output

Available Commands:
  seed                 Seed database using seed files
 migration
  migration:refresh    Refresh migrations by performing rollback and then running from start
  migration:reset      Rollback migration to the first batch
  migration:rollback   Rollback migration to latest batch or a specific batch number
  migration:run        Run all pending migrations
  migration:status     Check migrations current status
```

> OBSERVAÇÃO: Por conveniência, o comando `adonis` faz proxy de todos os comandos para um determinado projeto. Por exemplo, executar `adonis migration:run` tem o mesmo resultado que executar `node ace migration:run`.

## Criando comandos
Vamos construir rapidamente um comando Ace para extrair citações aleatórias de *Paul Graham* por meio da [API do Wisdom](http://gophergala.github.io/wisdom) e enviá-las para o terminal.

### Configuração

```bash
adonis make:command Quote
```

```bash
# .Output

✔ create  app/Commands/Quote.js
┌───────────────────────────────────────────────────────────┐
│        Register command as follows                        │
│                                                           │
│        1. Open start/app.js                               │
│        2. Add App/Commands/Quote to commands array        │
└───────────────────────────────────────────────────────────┘
```

Seguindo as instruções de saída, registre seu comando recém-criado dentro do array `commands` no arquivo `start/app.js`:

```js
// .start/app.js

const commands = [
  'App/Commands/Quote',
]
```

Agora, se executarmos `adonis`, devemos ver o comando `quote` dentro da lista de comandos disponíveis.

### Mostrando aspas
Substitua tudo dentro do arquivo de comando pelo seguinte código:

```js
// .app/Commands/Quote.js

'use strict'

const { Command } = use('@adonisjs/ace')
const got = use('got')

class Quote extends Command {
  static get signature () {
    return 'quote'
  }

  static get description () {
    return 'Shows inspirational quote from Paul Graham'
  }

  async handle (args, options) {
    const response = await got('https://wisdomapi.herokuapp.com/v1/author/paulg/random')
    const quote = JSON.parse(response.body)
    console.log(`${this.chalk.gray(quote.author.name)} - ${this.chalk.cyan(quote.author.company)}`)
    console.log(`${quote.content}`)
  }
}

module.exports = Quote
```

> NOTA: Certifique-se de instalar o pacote [got](https://npmjs.org/package/got) via npm, que é usado para consumir a API HTTP no código de comando acima.

Executar `adonis quote` imprime a citação recuperada no terminal.

## Assinatura do comando
A assinatura do comando define o nome do comando, opções obrigatórias/opcionais e sinalizadores.

A assinatura é definida como uma string de expressão, assim:

```js
static get signature () {
  return 'greet { name: Name of the user to greet }'
}
```

Na assinatura de exemplo acima:

1. `greet` é o nome do comando
2. `{ name }` é um argumento obrigatório a ser passado ao executar o comando
3. Tudo após o `:` é a descrição do nome do argumento que o precede

A assinatura do comando pode abranger várias linhas usando literais de modelo ES6:

```js
static get signature () {
  return `
    greet
    { name : Name of the user to greet }
    { age? : User age }
  `
}
```

#### Argumentos opcionais
Os argumentos podem ser opcionais anexando `?` ao ​​nome do argumento:

```js
'greet { name? : Name of the user to greet }'
```

#### Valor padrão
Você também pode definir um valor padrão para um argumento assim:

```js
'greet { name?=virk : Name of the user to greet }'
```

#### Flags
Os flags são prefixados com `--` e têm a mesma assinatura que argumentos:

```js
static get signature () {
  return `
    send:email
    { --log : Log email response to the console }
  `
}
```

Usando a assinatura de exemplo acima, você passaria o sinalizador `--log` quando o comando fosse executado assim:

```bash
adonis send:email --log
```

#### Sinalizadores com valores
Às vezes, você pode querer aceitar valores com sinalizadores.

Isso pode ser feito ajustando a expressão de assinatura da seguinte forma:

```js
static get signature () {
  return `
    send:email
    { --driver=@value : Define a custom driver to be used  }
  `
}
```

No exemplo acima, `=@value` instrui o Ace a garantir que um valor seja sempre passado com o sinalizador `--driver`.

## Ação de comando
O método `handle` na classe de comando é invocado toda vez que um comando é executado e recebe um objeto de `argumentos` e `flags`:

```js
async handle (args, flags) {
  console.log(args)
  console.log(flags)
}
```

> NOTA: Todos os *argumentos* e *flags* são passados ​​no formato camel case. Por exemplo, um sinalizador `--file-path` seria definido como a chave `filePath` dentro do objeto `flags` passado.

## Perguntas
Dentro do seu comando, você pode solicitar respostas aos usuários e aceitar valores fazendo perguntas interativas.

#### `ask(question, [defaultAnswer])`
Solicita ao usuário uma entrada textual:

```js
async handle () {
  const name = await this
    .ask('Enter project name')

  // with default answer
  const name = await this
    .ask('Enter project name', 'yardstick')
}
```

#### `secure(question, [defaultAnswer])`
O método `secure` é semelhante ao `ask`, mas a entrada do usuário é oculta (útil ao solicitar informações confidenciais, por exemplo, uma senha):

```js
const password = await this
  .secure('What is your password?')
```

#### `confirm(question)`
Solicita ao usuário uma resposta `sim/não`:

```js
const deleteFiles = await this
  .confirm('Are you sure you want to delete selected files?')
```

#### `multiple(title, choices, [selected])`
Solicita ao usuário respostas para uma pergunta de múltipla escolha:

```js
const lunch = await this
  .multiple('Friday lunch ( 2 per person )', [
    'Roasted vegetable lasagna',
    'Vegetable & feta cheese filo pie',
    'Roasted Cauliflower + Aubergine'
  ])
```

Os valores da matriz `choices` podem ser objetos:

```js
const lunch = await this
  .multiple('Friday lunch ( 2 per person )', [
    {
      name: 'Roasted Cauliflower + Aubergine',
      value: 'no 1'
    },
    {
      name: 'Carrot + Tabbouleh',
      value: 'no 2'
    }
  ])
```

Você também pode passar uma matriz de valores pré-selecionados:

```js
const lunch = await this
  .multiple('Friday lunch ( 2 per person )', [
    'Roasted vegetable lasagna',
    'Vegetable & feta cheese filo pie',
    'Roasted Cauliflower + Aubergine'
  ], [
    'Roasted vegetable lasagna',
  ])
```

#### `choice(question, choices, [selected])`
Solicita ao usuário uma única resposta para uma pergunta de múltipla escolha:

```js
const client = await this
  .choice('Client to use for installing dependencies', [
    'yarn', 'npm'
  ])
```

Os valores da matriz `choices` podem ser objetos:

```js
const client = await this
  .choice('Client to use for installing dependencies', [
    {
      name: 'Use yarn',
      value: 'yarn'
    },
    {
      name: 'Use npm',
      value: 'npm'
    }
  ])
```

Você também pode passar um valor pré-selecionado:

```js
const client = await this
  .choice('Client to use for installing dependencies', [
    {
      name: 'Use yarn',
      value: 'yarn'
    },
    {
      name: 'Use npm',
      value: 'npm'
    }
  ], 'npm')
```

## Saída colorida
Ace usa [kleur](https://npmjs.org/package/kleur) para enviar mensagens de log coloridas para o terminal.

> NOTA: Você pode acessar a instância do comando kleur via `this.chalk`.

### Métodos auxiliares

Os seguintes métodos auxiliares registram mensagens consistentemente estilizadas no terminal.

#### `info(message)`
Registra uma mensagem de informação no console com a cor *ciano*:

```js
this.info('Something worth sharing')
```

#### `success(message)`
Registra uma mensagem de sucesso no console com a cor *verde*:

```js
this.success('All went fine')
```

#### `warn(message)`
Registra uma mensagem de aviso no console com a cor *amarela*:

```js
this.warn('Fire in the hole')
```

> NOTA: `warn` usa `console.warn` em vez de `console.log`.

#### `error(message)`
Registra uma mensagem de erro no console com a cor *vermelha*:

```js
this.error('Something went bad')
```

> NOTA: `error` usa `console.error` em vez de `console.log`.

#### `completed(action, message)`
Imprime uma ação com mensagem para o console:

```js
this.completed('create', 'config/app.js')
```

```bash
# .Output

create: config/app.js
```

#### `failed(action, message)`
Imprime uma ação com falha com mensagem para o console:

```js
this.failed('create', 'config/app.js')
```

> NOTA: `failed` usa `console.error` em vez de `console.log`.

#### `table(head, body)`
Imprime dados tabulares no console:

```js
const head = ['Name', 'Age']
const body = [['virk', 22], ['joe', 23]]

this.table(head, body)
```

```bash
# .Output

┌──────┬─────┐
│ Name │ Age │
├──────┼─────┤
│ virk │ 22  │
├──────┼─────┤
│ joe  │ 23  │
└──────┴─────┘
```

A cor da linha de cabeçalho também pode ser definida:

```js
const head = ['Name', 'Age']
const body = [['virk', 22], ['joe', 23]]
const options = { head: ['red'] }

this.table(head, body, options)
```

#### `icon(type)`
Retorna um ícone colorido para um tipo fornecido:

```js
console.log(`${this.icon('success')} Completed`)
```

```bash
# .Output

✔ Completed
```

| Tipo      | Cor     | Ícone |
|-----------|---------|-------|
| `info`    | cyan    | ℹ     |
| `success` | green   | ✔    |
| `warn`    | yellow  | ⚠    |
| `error`   | red     | ✖    |

## Gerenciamento de arquivos
Ace simplifica a interação com o sistema de arquivos ao oferecer uma API Promise first.

#### `writeFile(location, contents)`
Grava o arquivo em um local fornecido (cria automaticamente os diretórios ausentes):

```js
await this.writeFile(Helpers.appRoot('Models/User.js'), '…')
```

#### `ensureFile(location)`
Garantir que o arquivo exista, caso contrário, crie um arquivo vazio:

```js
await this.ensureFile(Helpers.appRoot('Models/User.js'))
```

#### `ensureDir(location)`
Garantir que o diretório exista, caso contrário, crie um diretório vazio:

```js
await this.ensureDir(Helpers.appRoot('Models'))
```

#### `pathExists(location)`
Retorna um booleano indicando se o caminho existe ou não:

```js
const exists = await this.pathExists('some-location')

if (exists) {
  // do something
}
```

#### `removeFile(location)`
Remover o arquivo de um local fornecido:

```js
await this.removeFile('some-location')
```

#### `removeDir(location)`
Remover o diretório de um local fornecido:

```js
await this.removeDir('some-location')
```

#### `readFile(location)`
Ler o conteúdo de um arquivo fornecido:

```js
const contents = await this.readFile('some-location', 'utf-8')
```

#### `copy(src, dest)`
Copiar arquivo/diretório de um local para outro:

```js
await this.copy(src, dest)
```

#### `move(src, dest)`
Mover arquivo/diretório de um local para outro:

```js
await this.move(src, dest)
```

## Gerenciamento de conexão de banco de dados
Ao usar o acesso ao banco de dados em um comando Ace (via [Lucid](/original/markdown/08-Lucid-ORM/01-Getting-Started.md) ou diretamente), você deve se lembrar de fechar manualmente a conexão do banco de dados:

```js
Database.close()
```

Um exemplo mais completo:

```js
const Database = use('Database')

class Quote extends Command {
  static get signature () {
    return 'quote'
  }

  static get description () {
    return 'Shows inspirational quote from Paul Graham'
  }

  async handle (args, options) {
    let quote = await Quote.query().orderByRaw('rand()').first()
    console.log(quote.content)

    // Without the following line, the command will not exit!
    Database.close()
  }
}
```
