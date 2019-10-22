# Comando Ace

Ace é uma poderosa ferramenta de linha de comando criada para o AdonisJs.

Até agora, você usou vários comandos do Ace para gerar controladores, modelos ou executar migrações.

Neste guia, aprendemos sobre os componentes internos do Ace e como criar comandos.

## Introdução
Todo projeto do AdonisJs tem um arquivo `ace` na raiz do projeto, que é um arquivo JavaScript comum, mas sem a extensão `.js`.

O arquivo `ace` é usado para executar comandos específicos do projeto. Para comandos reutilizáveis, você deve agrupá-los como pacotes npm.

Execute o código a seguir para ver a lista de comandos Ace disponíveis:

```
> node ace
```

Saída:
```
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

> Por conveniência, o adoniscomando proxies todos os comandos para um determinado projeto. Por exemplo, executar 
> `adonis migration:run` tem o mesmo resultado que correr `node ace migration:run`.

## Criando comandos
Vamos criar rapidamente um comando Ace para extrair aspas aleatórias de Paul Graham por meio da [API](https://gophergala.github.io/wisdom) da sabedoria e enviá-las para o terminal.

### Configuração
```
> adonis make:command Quote
```

Saída:
```
✔ create  app/Commands/Quote.js
┌───────────────────────────────────────────────────────────┐
│        Register command as follows                        │
│                                                           │
│        1. Open start/app.js                               │
│        2. Add App/Commands/Quote to commands array        │
└───────────────────────────────────────────────────────────┘
```

Seguindo as instruções de saída, registre seu comando recém-criado dentro da matriz `commands` no arquivo `start/app.js`:

``` js
const commands = [
  'App/Commands/Quote',
]
```

Agora, se executarmos `adonis`, devemos ver o comando `quote` dentro da lista de comandos disponíveis.

### Mostrando citações
Substitua tudo dentro do arquivo de comando pelo seguinte código:

``` js
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

> Certifique-se de instalar o pacote [got](https://npmjs.org/package/got) via npm, que é usado para consumir a API HTTP no código de comando acima.

Em execução, `adonis quote` imprime a cotação recuperada no terminal.

## Assinatura do comando
A assinatura do comando define o nome do comando, as opções obrigatórias/opcionais e os sinalizadores.

A assinatura é definida como uma string de expressão, assim:

``` js
static get signature () {
  return 'greet { name: Name of the user to greet }'
}
```

Na assinatura de exemplo acima:

* `greet` é o nome do comando
* `{ name }` é um argumento necessário a ser passado ao executar o comando
* Tudo depois de `:` é a descrição do nome do argumento que o precede

A assinatura do comando pode abranger várias linhas usando literais do modelo ES6:

``` js
static get signature () {
  return `
    greet
    { name : Name of the user to greet }
    { age? : User age }
  `
}
```

### Argumentos opcionais
Os argumentos podem ser opcionais, anexando `?` ao nome do argumento:

``` js
'greet { name? : Name of the user to greet }'
```

### Valor padrão
Você também pode definir um valor padrão para um argumento como este:

``` js
'greet { name?=virk : Name of the user to greet }'
```

### Flag
Os sinalizadores são prefixados com `--` e têm a mesma assinatura que os argumentos:

``` js
static get signature () {
  return `
    send:email
    { --log : Log email response to the console }
  `
}
```

Usando a assinatura de exemplo acima, você passaria a flag `--log` quando o comando for executado da seguinte maneira:

```
> adonis send:email --log
```

### Sinalizadores com valores
Às vezes, você pode querer aceitar valores com sinalizadores.

Isso pode ser feito ajustando a expressão de assinatura da seguinte maneira:

``` js
static get signature () {
  return `
    send:email
    { --driver=@value : Define a custom driver to be used  }
  `
}
```

No exemplo acima, `=@value` instrui o Ace a garantir que um valor sempre seja passado com a flag `--driver`.

### Ação de comando
O método `handle` na classe de comando é chamado toda vez que um comando é executado e recebe um objeto de `arguments` e `flags`:

``` js
async handle (args, flags) {
  console.log(args)
  console.log(flags)
}
```

> Todos os **arguments** e **flags** são passados no formato de *camelCase*. Por exemplo, uma flag `--file-path` 
> seria definido como a chave `filePath` dentro do objeto `flags` passado.

## Questões
Dentro do seu comando, você pode solicitar respostas aos usuários e aceitar valores fazendo perguntas interativas.

### ask (pergunta, [resposta padrão])
Solicite ao usuário a inserção de texto:

``` js
async handle () {
  const name = await this
    .ask('Enter project name')

  // com resposta padrão
  const name = await this
    .ask('Enter project name', 'yardstick')
}
```

### secure (pergunta, [defaultAnswer])
O método `secure` é semelhante a `ask`, mas a entrada do usuário está oculta (útil ao solicitar informações confidenciais, 
como uma senha):

``` js
const password = await this
  .secure('What is your password?')
```

### confirm (pergunta)
Solicite ao usuário uma resposta `yes/no`:

``` js
const deleteFiles = await this
  .confirm('Are you sure you want to delete selected files?')
```


### multiple (título, escolhas, [selecionado])
Solicite ao usuário respostas para uma pergunta de múltipla escolha:

``` js
const lunch = await this
  .multiple('Friday lunch ( 2 per person )', [
    'Roasted vegetable lasagna',
    'Vegetable & feta cheese filo pie',
    'Roasted Cauliflower + Aubergine'
  ])
```

Os valores de matriz em `choices` podem ser objetos:

``` js
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

Você também pode transmitir uma matriz de valores pré-selecionados:

``` js
const lunch = await this
  .multiple('Friday lunch ( 2 per person )', [
    'Roasted vegetable lasagna',
    'Vegetable & feta cheese filo pie',
    'Roasted Cauliflower + Aubergine'
  ], [
    'Roasted vegetable lasagna',
  ])
```

### choice (pergunta, escolhas, [selecionado])
Solicite ao usuário uma resposta única para uma pergunta de múltipla escolha:

```
const client = await this
  .choice('Client to use for installing dependencies', [
    'yarn', 'npm'
  ])
```

Seus valores matriz de `choices` podem ser objetos:

``` js
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

```
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
O Ace usa o [kleur](https://npmjs.org/package/kleur) para enviar mensagens de log coloridas para o terminal.

> Você pode acessar a instância do comando kleur via `this.chalk`.

Métodos auxiliares
Os seguintes métodos auxiliares registram mensagens com estilo consistente no terminal.

### info (mensagem)
Registra uma mensagem informativa no console com cor ciano :

``` js
this.info('Something worth sharing')
```

### success (mensagem)
Registra uma mensagem de sucesso no console com a cor verde :

``` js
this.success('All went fine')
```

### warn (mensagem)
Registra uma mensagem de aviso no console com a cor amarela :

``` js
this.warn('Fire in the hole')
```

> `warn` usa `console.warn` em vez de `console.log`.

### error (mensagem de erro)
Registra uma mensagem de erro no console com a cor vermelha :

``` js
this.error('Something went bad')
```

> `error` usa `console.error` em vez de `console.log`.

### completed (ação, mensagem)
Imprime uma ação com mensagem no console:

```
this.completed('create', 'config/app.js')
``` 

Resultado
```
create: config/app.js
```

### failed (ação, mensagem)
Imprime uma ação com falha com mensagem no console:

``` js
this.failed('create', 'config/app.js')
```

> `failed` usa `console.error` em vez de `console.log`.

### table (cabeça, corpo)
Imprime dados tabulares no console:

``` js
const head = ['Name', 'Age']
const body = [['virk', 22], ['joe', 23]]

this.table(head, body)
```

Resultado
```
┌──────┬─────┐
│ Name │ Age │
├──────┼─────┤
│ virk │ 22  │
├──────┼─────┤
│ joe  │ 23  │
└──────┴─────┘
```

A cor da linha da cabeça também pode ser definida:

``` js
const head = ['Name', 'Age']
const body = [['virk', 22], ['joe', 23]]
const options = { head: ['red'] }

this.table(head, body, options)
```

### icon (tipo)
Retorna um ícone colorido para um determinado tipo:

``` js
console.log(`${this.icon('success')} Completed`)
```

Resultado
```
✔ Completed
```

| Tipo            | Cor               | Ícone             |
|-----------------|-------------------|-------------------|
| info            | ciano             | ℹ                  |
| success         | verde             | ✔                 |
| warn            | amarelo           | ⚠                 |
| error           | vermelho          | ✖                 |

## Gerenciamento de arquivos
O Ace simplifica a interação com o sistema de arquivos, oferecendo uma primeira API Promise.

### writeFile (localização, conteúdo)
Grave o arquivo em um determinado local (cria automaticamente os diretórios ausentes):

``` js
await this.writeFile(Helpers.appRoot('Models/User.js'), '…')
```

### sureFile (local)
Verifique se o arquivo existe, caso contrário, crie um arquivo vazio:

``` js
await this.ensureFile(Helpers.appRoot('Models/User.js'))
```

### ensureDir (local)
Verifique se o diretório existe, caso contrário, crie um diretório vazio:

``` js
await this.ensureDir(Helpers.appRoot('Models'))
```

### pathExists (local)
Retorna um booleano indicando se o caminho existe ou não:

``` js
const exists = await this.pathExists('some-location')

if (exists) {
  // faça alguma coisa
}
```

### removeFile (local)
Remova o arquivo de um determinado local:

``` js
await this.removeFile('some-location')
```

### removeDir (local)
Remova o diretório de um determinado local:

``` js
await this.removeDir('some-location')
```

### readFile (local)
Leia o conteúdo de um determinado arquivo:

``` js
const contents = await this.readFile('some-location', 'utf-8')
```

### copy (src, dest)
Copie o arquivo/diretório de um local para outro:

``` js
await this.copy(src, dest)
```

### move (src, dest)
Mova o arquivo / diretório de um local para outro:

``` js
await this.move(src, dest)
```

## Gerenciamento de conexão com o banco de dados
Ao usar o acesso ao banco de dados em um comando Ace (via Lucid ou diretamente), lembre-se de fechar manualmente a conexão com o banco de dados:

``` js
Database.close()
```

Um exemplo mais completo:

``` js
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
