# Interativo Shell aka Ace

Ace é uma ferramenta de linha de comando poderosa construída para AdonisJs. Até agora você tem usado muitos comandos do Ace para gerar *controladores*, *modelos*, executar *migrações*, etc. Neste guia, aprenderemos sobre os internos do Ace e como criar comandos.

## Sobre o Ace

1. "ace" é um arquivo executável dentro da raiz do seu aplicativo.
2. Cada comando é específico para um único projeto, para comandos reutilizáveis você deve agrupá-los como um pacote npm.
3. Os comandos têm acesso a todos os componentes dos aplicativos, como *Modelos*, *Rotas*, etc. Isso torna muito fácil criar comandos úteis.
4. Os comandos específicos do projeto são armazenados dentro da pasta app/Commands.
5. Você deve registrar seus comandos dentro do arquivo `bootstrap/app.js` antes de usá-los.

## Criando seu primeiro comando
Vamos criar um comando para buscar citações aleatórias de *Paul Graham* usando [API Wisdom](http://gophergala.github.io/wisdom) e exibir na tela do terminal.

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

1. Cada comando deve herdar da classe base 'Command'.
2. A assinatura é usada para definir o nome do comando e suas expectativas. Saiba mais sobre a Assinatura aqui.
3. A descrição é exibida na tela de ajuda. É um bom lugar para contar ao usuário final sobre o comando.
4. O `handle` é o corpo do seu comando e é chamado automaticamente pelo Ace quando o comando é executado.

Em seguida, precisamos registrar este comando na lista de comandos.

```js
// bootstrap/app.js

const commands = [
  'App/Commands/Quote',
  ...
]
```

Se tudo der certo, você será capaz de ver seu comando listado na tela de ajuda do Ace.

```bash
./ace --help
```

Saída:

```bash
quote               Display a random quote from Paul Graham
....
```

Vamos executar este comando para buscar uma citação inspiradora e exibi-la no terminal.

```bash
./ace quote
```

![Imagem](/docs/assets/Screen_Shot_2016-09-13_at_6.25.37_PM_hvd2hv.png)

## Assinatura de Comando
A assinatura do comando define o nome do comando com argumentos ou opções necessários/opcionais.

#### Comando Com Apenas O Nome
```js
get signature () {
  return 'make:controller'
}
```

### Argumentos
Os comandos podem receber argumentos nomeados.

#### Comando com Argumento(s) Requerido(s)
Os colchetes rodeiam os argumentos. Um único comando pode ter quantos argumentos quiser.

```js
get signature () {
  return 'make:controller {name}'
}
```

#### Argumentos Opcionais
Apêndice `?` ao argumento, nome para torná-lo opcional. Apenas como seus parâmetros de rota.

```js
get signature () {
  return 'make:controller {name?}'
}
```

#### Argumentação Descrição
Além disso, você define uma descrição para um argumento separando-o com dois pontos (:).

```js
get signature () {
  return 'make:controller {name:Name of the controller}'
}
```

### Opções
As opções são definidas por apêndice `--` ao início do nome da opção.

#### Comando com Opção(es) Requerida(s)
```js
get signature () {
  return 'make:controller {name} {--resource}'
}
```

#### Opção(es) opcional(is)
Assim como argumentos, você também pode tornar as opções opcionais ao adicionar um `?`

```js
get signature () {
  return 'make:controller {name} {--resource?}'
}
```

#### Opções com aliases
Opções geralmente precisam de aliases como  "-h" para "--help". Você pode definir vários aliases para uma opção dada separados por vírgula.

```js
get signature () {
  return 'make:controller {name} {-r,--resource?}'
}
```

#### Opções que aceitam valores
Às vezes opções querem valores para realizar certas operações e isso pode ser conseguido usando o identificador `@value`.

```js
get signature () {
  return 'make:controller {name} {--template=@value}'
}
```

## Entradas Interativas
AdonisJs torna tão simples a criação de comandos interativos ao solicitar que o usuário forneça informações conforme avança.

#### ask(pergunta, [valorPadrão])
O método 'ask' aceitará entrada de texto. Opcionalmente, você pode definir um 'valor padrão', que será retornado quando nenhuma entrada for passada.

```js
const projectName = yield this
  .ask('Enter project name', 'yardstick')
  .print()
```

Não foi possível traduzir o texto em português.

#### escolha(pergunta, opções, [opção padrão])
Exibir uma lista de opções para seleção. Apenas uma das opções listadas pode ser selecionada.

```js
const dailyMeal = yield this
  .choice('Choose a free daily meal', ['BreakFast', 'Lunch', 'Dinner'], 'BreakFast')
  .print()
```

Não foi possível traduzir a imagem devido a limitações técnicas.

#### multiple(pergunta, opções, [opçõesPadrão])
Exibir uma lista de múltiplas escolhas com um array opcional de valores pré-selecionados. Ao contrário do 'choice', você pode selecionar múltiplos valores.

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

Não foi possível traduzir a imagem devido a limitações técnicas.

#### antecipar (pergunta, escolhas, [escolha padrão])
Mostra uma lista de ações com atalhos de teclado. É útil quando você quer que o usuário antecipe algo.

```js
const action = yield this
  .anticipate('Conflict in file.js?', [
    {key: 'y', name: 'Delete it'},
    {key: 'a', name: 'Overwrite it'},
    {key: 'i', name: 'Ignore it'}
  ])
  .print()
```

Não foi possível traduzir a imagem em questão. Por favor, forneça uma descrição ou contexto adicional para que eu possa tentar novamente.

#### secure(question, [defaultValue])
Pergunte por uma entrada segura como um *senha* ou algum *token secreto*. O valor da entrada será mostrado como `\*\*****`.

```js
const password = yield this
  .secure('What is your password?')
  .print()
```

Não foi possível traduzir a imagem devido a limitações técnicas.

#### confirmar(pergunta, [valorPadrão])
Pergunte sobre uma pergunta sim ou não.

```js
const deleteFiles = yield this
  .confirm('Are you sure you want to delete selected files?')
  .print()
```

Não foi possível traduzir a imagem devido a limitações técnicas.

## Validação de entradas
É extremamente útil validar a entrada ao aceitar os valores das perguntas interativas. Todas as perguntas de prompt podem ser validadas encadeando o método 'validate' e um retorno 'true' da função de retorno será considerado uma validação bem-sucedida.

```js
yield this
  .ask('Enter coupon code')
  .validate(function (input) {
    return input ### 'adonisjs' ? true : 'Enter a valid coupon code'
  })
  .print()
```

## Saída ANSI
Os códigos de escape ANSI são usados para saída de texto colorido no terminal usando uma sequência de vários caracteres. Por exemplo: Para exibir "Olá Mundo" em verde no terminal, você precisa registrar o seguinte.

```js
console.log('\033[32m Hello World')
```

É muito difícil lembrar esses códigos e desagradável escrevê-los. Além disso, você terá que lidar com diferentes tipos de *shells* para obter a saída correta. Os comandos do AdonisJs podem facilitar isso com a ajuda dos seguintes métodos.

#### erro(mensagem)
```js
this.error('Sorry, something went wrong')
```

#### sucesso(mensagem)
```js
this.success('All done!')
```

#### info(mensagem)
```js
this.info('Just letting you know')
```

#### aviso(mensagem)
```js
this.warn('Wait! something seems fishy')
```

#### concluído (ação, mensagem)
Sairá uma mensagem estruturada para uma ação concluída. O nome da ação ficará em verde.

```js
this.completed('create', 'Created the controller file')
```

Saída:

```bash
create: Created the controller file
```

#### failed(action, message)
```js
this.failed('create', 'Sorry controller file already exists')
```

Saída:

```bash
create: Sorry controller file already exists
```

#### table(cabeçalho, corpo)
```js
this.table(['username', 'age'], [{'virk': 26}, {nikk: 25}])

// or
this.table(
  ['key', 'value'],
  {username: 'foo', age: 22, email: 'foo@bar.com'}
)
```

## Ícones & Cores
Além disso, você pode adicionar ícones e cores às suas mensagens de console dentro do seu método `handle`.

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

Saída:

```bash
✔ That went great
```

### Ícones Lista

| Ícone | Nome |
|------|------|
| Informação | info |
| ✔ | sucesso |
| ⚠ | aviso |
| ✖ | erro |

### Cores
Sob o capô, o Ace utiliza [cores](https://www.npmjs.com/package/colors) um módulo npm. Você pode acessar todos os métodos disponíveis no *cor* usando a propriedade de cores.

```js
this.colors.green('This is all green')
this.colors.red.underline('I like cake and pies')
```
