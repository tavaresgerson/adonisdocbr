# Jogo de adivinhação de números

Neste guia, criamos um jogo simples de adivinhação de números como uma forma de aprender mais sobre a estrutura. Ao final deste guia, você saberá como usar *visualizações*, *criar novas rotas* e *vincular controladores* a elas.

::: tip DICA
Você pode ver a versão final de trabalho em [glitch](https://adonis-number-guessing-game.glitch.me/?number=5). Além disso, você pode verificar o código usando o seguinte botão de remix.

![imagem](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)
:::

## História do jogo
A adivinhação de números pega a entrada do usuário e a compara com um número aleatório. Se o número corresponder, é chamado de correspondência, caso contrário, é um passe.

Para simplificar, aceitamos o número adivinhado pelo usuário como a sequência de consulta na URL.

## Configuração
Vamos criar um novo projeto usando o comando `adonis`. Criamos um projeto enxuto, pois não precisamos de um banco de dados ou modelos para este aplicativo.

```js
adonis new number-game --slim
```

Agora, `cd` no diretório criado e certifique-se de que você pode executar o aplicativo usando o comando `adonis serve`.

## Roteamento
Vamos começar removendo tudo do arquivo `start/routes.js` e colar o seguinte código dentro dele.

```js
const Route = use('Route')

Route.get('/', ({ request }) => {
  /** get number from the url query string */
  const guessedNumber = Number(request.input('number'))

  /** if number is not specified, let the user know about it */
  if (!guessedNumber) {
    return 'Please specify a number by passing ?number=<num> to the url'
  }

  /** generate a random number */
  const randomNumber = Math.floor(Math.random() * 20) + 1

  /** let the user know about the match */
  return randomNumber === guessedNumber
  ? 'Matched'
  : `Match failed. The actual number is ${randomNumber}`
})
```

Agora, se visitarmos [127.0.0.1:3333?number=5](http://127.0.0.1:3333?number=5) e continuarmos alterando o `number` entre 1-20, veremos *Matched* ou a declaração *Match failed*.

A lógica do jogo de adivinhação de números continua a mesma, mas começamos a extrair esse código em um controlador e também criamos uma visualização para ele.

## Controlador Http
Vamos criar um novo controlador executando o seguinte comando.

```bash
adonis make:controller Game
```

```bash
# Output

✔ create  app/Controllers/Http/GameController.js
```

Agora abra o arquivo `GameController.js` e cole o seguinte código nele.

```js
'use strict'

class GameController {

  render ({ request }) {
    /** get number from the url query string */
    const guessedNumber = Number(request.input('number'))

    /** if number is not specified, let the user know about it */
    if (!guessedNumber) {
      return 'Please specify a number by passing ?number=<num> to the url'
    }

    /** generate a random number */
    const randomNumber = Math.floor(Math.random() * 20) + 1

    /** let the user know about the match */
    return randomNumber === guessedNumber
    ? 'Matched'
    : `Match failed. The actual number is ${randomNumber}`
  }
}

module.exports = GameController
```

Tudo o que fizemos foi mover o código do fechamento de rota para o arquivo do controlador. Agora, podemos remover todo o código do arquivo `start/routes.js` e, em vez disso, vincular o controlador a ele.

```js
Route.get('/', 'GameController.render')
```

Agora atualize a página e o jogo funcionará conforme o esperado.

## Visualizações
O AdonisJs usa [edge.js](http://edge.adonisjs.com/) como o mecanismo de modelagem para alimentar visualizações. Vamos aprender como registrar o provedor de visualização e renderizá-lo a partir do método do controlador.

### Configuração
Todos os provedores são registrados dentro do arquivo `start/app.js`. Assim como o *ViewProvider*.

```js
const providers = [
  '@adonisjs/framework/providers/ViewProvider'
]
```

Depois que o provedor for registrado, você pode acessar a instância `view` dentro dos seus métodos do controlador da seguinte forma.

```js
render ({ request, view }) {
}
```

Agora, tudo o que precisamos fazer é criar o arquivo de modelo `game.edge` e escrever a lógica dentro dele.

### Criando arquivo de modelo

Assim como o controlador, podemos usar o comando `make:view` para criar uma nova visualização para nós.

```bash
adonis make:view game
```

```bash
# Output

✔ create  resources/views/game.edge
```

### Extraindo lógica do controlador
Vamos remover toda a lógica do método do controlador e, em vez disso, renderizar uma visualização com os dados necessários.

```js
'use strict'

class GameController {

  render ({ request, view }) {
    const guessedNumber = Number(request.input('number'))
    const randomNumber = Math.floor(Math.random() * 20) + 1

    /** rendering view */
    return view.render('game', { guessedNumber, randomNumber })
  }
}

module.exports = GameController
```

```edge
<!-- .resources/views/game.edge -->

@if(!guessedNumber)
  <p> Please specify a number by passing <code>?number</code> to the url </p>
@elseif(guessedNumber === randomNumber)
  <h2> Matched </h2>
@else
  <h2>Match failed. The actual number is {{ randomNumber }}</h2>
@endif
```

Como você pode ver, o Edge torna muito simples escrever lógica nos arquivos de modelo. Podemos facilmente gerar a declaração que queremos.

::: tip DICA
Se você tiver alguma dúvida ou preocupação, junte-se a nós no [discourse](https://forum.adonisjs.com/c/help/view) para fazer parte da nossa pequena e útil comunidade.
:::

## Próximos passos
Este tutorial foi a tentativa mais fácil de usar diferentes partes e construir um aplicativo simples no AdonisJs. No futuro, considere aprender mais sobre os seguintes tópicos.

1. [Roteamento](/original/markdown/04-Basics/01-Routing.md)
2. [Banco de dados](/original/markdown/07-Database/01-Getting-Started.md)
3. e [Autenticação](/original/markdown/05-Security/02-Authentication.md)
