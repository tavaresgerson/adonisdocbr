# Shell interativo também conhecido como Ace

Ace é uma ferramenta de linha de comando poderosa criada para AdonisJs. Até agora, você tem usado muitos comandos ace para gerar *controladores*, *modelos*, executar *migrações*, etc. Neste guia, aprenderemos sobre os internos do Ace e como criar comandos.

## Sobre o Ace

1. `ace` é um arquivo executável dentro da raiz do seu aplicativo.
2. Cada comando é específico para um único projeto, para comandos reutilizáveis, você deve agrupá-los como um pacote npm.
3. Os comandos têm acesso a todos os componentes do aplicativo, como *Modelos*, *Rotas*, etc. Isso torna muito fácil criar comandos úteis.
4. Os comandos específicos do projeto são armazenados dentro do diretório `app/Commands`.
5. Você deve registrar seus comandos dentro do arquivo `bootstrap/app.js` antes de usá-los.

## Criando seu primeiro comando
Vamos criar um comando para extrair citações aleatórias de *Paul Graham* usando [API Wisdom](http://gophergala.github.io/wisdom) e exibi-lo no terminal.

```bash
# Creating A New Command

./ace make:command Quote
```

```bash
# Installing Got (npm module to make HTTP requests)

npm i --save got
```

```js
// app/Commands/Quote.js

const Command = use('Command')
const got = use('got')

class Quote extends Command { <1>

  get signature () {
    return 'quote'
  } <2>

  get description () {
    return 'Display a random quote from Paul Graham.'
  } <3>

  * handle (args, options) {
    const response = yield got('https://wisdomapi.herokuapp.com/v1/author/paulg/random')
    const quote = JSON.parse(response.body)

    this.log('\n')
    this.log(`${this.colors.gray(quote.author.name)} - ${this.colors.cyan(quote.author.company)}`)
    this.log(`${quote.content}`)
  } <4>

}
```

1. Cada comando deve ser herdado da classe base `Command`.
2. A assinatura é usada para definir o nome do comando e suas expectativas. Saiba mais sobre Signature xref:_command_signature[aqui].
3. A descrição é exibida na tela de ajuda. É um bom lugar para informar o usuário final sobre o comando.
4. O `handle` é o corpo do seu comando e é chamado automaticamente pelo Ace quando o comando é executado.

Em seguida, precisamos registrar este comando na lista de comandos.

```js
// bootstrap/app.js

const commands = [
  'App/Commands/Quote',
  ...
]
```

Se tudo der certo, você poderá ver seu comando listado na tela de ajuda do Ace.

```bash
./ace --help
```

```bash
# Output

quote               Display a random quote from Paul Graham
....
```

Vamos executar este comando para buscar uma citação inspiradora e exibi-la no terminal.

```bash
./ace quote
```

![image](http://res.cloudinary.com/adonisjs/image/upload/v1473771404/Screen_Shot_2016-09-13_at_6.25.37_PM_hvd2hv.png)

## Assinatura de comando
A assinatura de comando define o nome do comando com argumentos ou opções obrigatórios/opcionais.

#### Comando apenas com o nome
```js
get signature () {
  return 'make:controller'
}
```

### Argumentos
Os comandos podem receber argumentos nomeados.

#### Comando com argumento(s) obrigatório(s)
Os argumentos são circundados por chaves. Um único comando pode ter quantos argumentos quiser.

```js
get signature () {
  return 'make:controller {name}'
}
```

#### Argumento(s) opcional(ais)
Acrescente `?` ao ​​argumento, nome para torná-lo opcional. Assim como seus parâmetros de rota.

```js
get signature () {
  return 'make:controller {name?}'
}
```

#### Descrição do argumento
Além disso, você define uma descrição para um argumento separando-o com dois pontos `(:)`.

```js
get signature () {
  return 'make:controller {name:Name of the controller}'
}
```

### Opções
As opções são definidas anexando `--` ao início do nome da opção.

#### Comando com opção(ões) necessária(s)
```js
get signature () {
  return 'make:controller {name} {--resource}'
}
```

#### Opção(ões) opcional(ais)
Assim como argumentos, você também pode tornar as opções opcionais anexando um `?`.

```js
get signature () {
  return 'make:controller {name} {--resource?}'
}
```

#### Opções com aliases
Frequentemente, as opções precisam de aliases como *-h* para `--help`. Você pode definir vários aliases para uma determinada opção separados por uma vírgula.

```js
get signature () {
  return 'make:controller {name} {-r,--resource?}'
}
```

#### Opções que aceitam valores
Às vezes, as opções querem valores para executar certas operações, e o mesmo pode ser alcançado usando o identificador `@value`.

```js
get signature () {
  return 'make:controller {name} {--template=@value}'
}
```

## Entradas interativas
O AdonisJs simplifica muito a criação de comandos interativos, solicitando que o usuário forneça informações conforme eles avançam.

#### ask(question, [defaultValue])
O método `ask` aceitará entrada textual. Opcionalmente, você pode definir `defaultValue` que será retornado quando nenhuma entrada for passada.

```js
const projectName = yield this
  .ask('Enter project name', 'yardstick')
  .print()
```

![image](http://res.cloudinary.com/adonisjs/image/upload/v1473783322/ask_blwh1x.gif)

#### choice(question, choices, [defaultChoice])
Exibe uma lista de opções a serem usadas para seleção. Apenas uma das opções listadas pode ser selecionada.

```js
const dailyMeal = yield this
  .choice('Choose a free daily meal', ['BreakFast', 'Lunch', 'Dinner'], 'BreakFast')
  .print()
```

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1473783461/choice_ijyxqz.gif)

#### multiple(question, choices, [defaultChoices])
Exibe uma lista de múltiplas escolhas com uma matriz opcional de valores pré-selecionados. Ao contrário de ``choice`, você pode selecionar múltiplos valores.

```js
yield this.multiple('You know?', ['Javascript', 'Elm', 'Haskell', 'Ruby']).print()

// OR
const langs = yield this
  .multiple('You know?', {
    js: 'Javascript',
    elm: 'Elm',
    hsk: 'Haskell',
    ruby: 'Ruby'
  }).print()
```

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1473783814/multiple_arn7og.gif)

#### advance(question, choices, [defaultChoice])
Mostra uma lista de ações com os atalhos de teclado. É útil quando você quer que o usuário antecipe algo.

```js
const action = yield this
  .anticipate('Conflict in file.js?', [
    {key: 'y', name: 'Delete it'},
    {key: 'a', name: 'Overwrite it'},
    {key: 'i', name: 'Ignore it'}
  ])
  .print()
```

![imagem](https://res.cloudinary.com/adonisjs/image/upload/v1473783820/anticipate_xmstmk.gif)

#### secure(question, [defaultValue])
Peça uma entrada segura como uma *senha* ou algum *token secreto*. O valor de entrada será mostrado como `\*\*****`.

```js
const password = yield this
  .secure('What is your password?')
  .print()
```

![imagem](https://res.cloudinary.com/adonisjs/image/upload/v1473783809/secure_ddk3w3.gif)

#### confirm(question, [defaultValue])
Peça uma pergunta sim/não.

```js
const deleteFiles = yield this
  .confirm('Are you sure you want to delete selected files?')
  .print()
```

![imagem](https://res.cloudinary.com/adonisjs/image/upload/v1473783814/confirm_dsoxix.gif)

## Validando entradas
É extremamente útil validar a entrada ao aceitar os valores de perguntas interativas. Todas as perguntas de prompt podem ser validadas encadeando o método `validate` e retornar `true` do retorno de chamada será considerado uma validação bem-sucedida.

```js
yield this
  .ask('Enter coupon code')
  .validate(function (input) {
    return input === 'adonisjs' ? true : 'Enter a valid coupon code'
  })
  .print()
```

## Saída ANSI
[Códigos de escape ANSI](https://en.wikipedia.org/wiki/ANSI_escape_code) são usados ​​para enviar texto colorido para o terminal usando uma sequência de vários caracteres. Por exemplo: para enviar uma cor verde `Hello World` para o terminal, você precisa registrar o seguinte.

```js
console.log('\033[32m Hello World')
```

É muito difícil lembrar desses códigos e desagradável escrevê-los. Além disso, você terá que lidar com diferentes *tipos de shell* para obter a saída correta. Os comandos do AdonisJs podem facilitar isso com a ajuda dos seguintes métodos.

#### error(message)
```js
this.error('Sorry, something went wrong')
```

#### success(message)
```js
this.success('All done!')
```

#### info(message)
```js
this.info('Just letting you know')
```

#### warn(message)
```js
this.warn('Wait! something seems fishy')
```

#### completed(action, message)
Irá gerar uma mensagem estruturada para uma ação concluída. Onde o nome da ação estará na cor verde.

```js
this.completed('create', 'Created the controller file')
```

```bash
# Output

create: Created the controller file
```

#### failed(action, message)
```js
this.failed('create', 'Sorry controller file already exists')
```

```bash
# Output

create: Sorry controller file already exists
```

#### table(head, body)
```js
this.table(['username', 'age'], [{'virk': 26}, {nikk: 25}])

// or
this.table(
  ['key', 'value'],
  {username: 'foo', age: 22, email: 'foo@bar.com'}
)
```

## Ícones e cores
Além disso, você pode gerar ícones e adicionar cores às suas mensagens de console dentro do seu método de comando `handle`.

```js
'use strict'

const Command = use('Command')

class Greet extends Command {
  * handle () {
    const successIcon = this.icon('success')
    console.log(`${successIcon} That went great`)
  }
}
```

```bash
# Output

✔ That went great
```

### Lista de ícones

| Ícone | Nome |
|------|---------|
| ℹ     | info    |
| ✔    | success |
| ⚠    | warn    |
| ✖    | error   |

### Cores
Por baixo dos panos, o Ace faz uso de [colors](https://www.npmjs.com/package/colors) um módulo npm. Você pode acessar todos os métodos disponíveis em *colors* usando a propriedade colors.

```js
this.colors.green('This is all green')
this.colors.red.underline('I like cake and pies')
```
