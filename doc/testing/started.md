# Iniciando

Testar manualmente seu aplicativo visitando cada página da web ou terminal da API pode ser 
entediante e, às vezes, impossível.

O teste automatizado é a estratégia preferida para confirmar se seu aplicativo continua a se 
comportar conforme o esperado a medida que você faz alterações em sua base de código.

Neste guia, aprenderemos sobre os benefícios dos testes e as diferentes maneiras de testar 
o código do seu aplicativo.

## Casos de teste
Se você é novo em testes, pode achar difícil entender os benefícios.

Mas, depois que você adquirir o hábito de escrever testes, a qualidade do código e a confiança sobre o comportamento do código devem melhorar drasticamente.

### Categorias de teste
O teste é dividido em várias categorias, incentivando você a escrever diferentes tipos de casos de teste com limites claros.

Essas categorias de teste incluem:

+ Testes Unitários
+ Testes Funcionais

#### Testes Unitários
Os testes de unidade são escritos para testar pequenos pedaços de código isoladamente.

Por exemplo, você pode testar uma classe diretamente sem se preocupar como essa classe é usada no mundo real:

```js
const { test } = use('Test/Suite')('Example unit test')
const UserValidator = use('App/Services/UserValidator')

test('validate user details', async ({ assert }) => {
  const validation = await UserValidator.validate({
    email: 'wrong email'
  })

  assert.isTrue(validation.fails())
  assert.deepEqual(validation.messages(), [
    {
      field: 'email',
      message: 'Invalid user email address'
    }
  ])
})
```

#### Testes funcionais
Os testes funcionais são escritos para testar seu aplicativo como um usuário final.

Por exemplo, você pode abrir programaticamente um navegador e interagir com várias 
páginas da web para garantir que funcionem conforme o esperado:

```js
const { test, trait } = use('Test/Suite')('Example functional test')
trait('Test/Browser')

test('validate user details', async ({ browser }) => {
  const page = await browser.visit('/')

  await page
    .type('email', 'wrong email')
    .submitForm('form')
    .waitForNavigation()

  page.session.assertError('email', 'Invalid user email address')
})
```

Os dois exemplos de teste acima validam o endereço de e-mail de um determinado usuário, mas a
abordagem é diferente com base no tipo de teste que você está escrevendo.


## Configuração

Como o Provedor Vow não é instalado por padrão, precisamos baixar do npm:

```base
adonis install @adonisjs/vow
```

Em seguida, registre o provedor `aceProviders` no arquivo `start/app.js`:

```js
const aceProviders = [
  '@adonisjs/vow/providers/VowProvider'
]
```

> O provedor é registrado dentro da matriz `aceProviders`, pois não 
> queremos inicializar o mecanismo de teste ao executar seu aplicativo em produção.

A instalação do `@adonisjs/vow` cria os seguintes arquivos e diretório:

#### vowfile.js
`vowfiles.js` é carregado antes de seus testes serem executados e é usado para definir
tarefas que devem ocorrer antes/depois de executar todos os testes.

#### .env.testing
`env.testing` contém as variáveis de ambiente usadas ao executar os testes. Este arquivo é mesclado com 
`.env` e portanto, você só precisará definir os valores que deseja substituir do arquivo `.env`.

### test
Todos os testes de aplicativos são armazenados em subpastas do diretório `test`. Um exemplo de teste de unidade 
é adicionado a este diretório quando `@adonisjs/vow` é instalado, veja um exemplo arbitrário em `test/unit/example.spec.js`

```js
'use strict'

const { test } = use('Test/Suite')('Example')

test('make sure 2 + 2 is 4', async ({ assert }) => {
  assert.equal(2 + 2, 4)
})
```

## Executando testes
Instalar o **Vow Provider** cria um exemplo de teste de unidade para você, que pode ser executado com o seguinte comando:
```bash
adonis test
```

Resultado:
```bash
Example
  ✓ make sure 2 + 2 is 4 (2ms)

PASSED
total       : 1
passed      : 1
time        : 6ms
```
## Conjunto de testes e traits

Antes de começarmos a escrever os testes, vamos entender alguns fundamentos que são importantes para entender 
o fluxo dos testes.

### Suíte
Cada arquivo é um conjunto de testes, definindo um grupo de testes com comportamento semelhante.

Por exemplo, podemos ter um conjunto de testes para registro de usuário:

```js
const Suite = use('Test/Suite')('User registeration')

// ou destruturando
const { test } = use('Test/Suite')('User registeration')
A testfunção obtida da Suiteinstância é usada para definir os testes:

test('return error when credentials are wrong', async (ctx) => {
  // implementação
})
```

### Traits
Para evitar o inchaço do executor de teste com funcionalidades desnecessárias, o AdonisJs fornece 
diferentes partes de código como características (os blocos de construção para seu conjunto de testes).

Por exemplo, chamamos a trait `Test/Browser` para que possamos testar por meio do navegador:

```js
const { test, trait } = use('Test/Suite')('User registeration')

trait('Test/Browser')

test('return error when credentials are wrong', async ({ browser }) => {
  const page = await browser.visit('/user')
})
```

> No exemplo acima, se removêssemos a trait `Test/Browser`,
> o objeto `browser` estaria como `undefined` dentro de nossos testes.

Você pode definir traits personalizadas com um fechamento ou vinculação de contêiner IoC:

```js
const { test, trait } = use('Test/Suite')('User registeration')

trait(function (suite) {
  suite.Context.getter('foo', () => {
    return 'bar'
  })
})

test('foo must be bar', async ({ foo, assert }) => {
  assert.equal(foo, 'bar')
})
```

> As características são úteis quando você deseja empacotar um pacote para ser usado por outros,
> embora para a maioria das situações, você possa simplesmente usar Ganchos de ciclo de vida.

### Contexto
Cada teste possui um contexto isolado.

Por padrão, o contexto tem apenas uma propriedade chamada `assert` que é uma instância de `chaijs/assert` para executar assertions.

Você pode passar valores personalizados para cada contexto de teste, definindo getters ou macros a serem acessados 
dentro de um callback closure `test` (consulte o exemplo de fechamento Traits).

## Ganchos de ciclo de vida (Lifecycle Hooks)
Cada suíte tem ganchos de ciclo de vida que podem ser usados para realizar tarefas repetitivas 
(por exemplo, limpar o banco de dados após cada teste):

```js
const Suite = use('Test/Suite')('User registeration')

const { before, beforeEach, after, afterEach } = Suite

before(async () => {
  // executado antes de todos os testes para um determinado pacote
})

beforeEach(async () => {
  // executado antes de cada teste dentro de um determinado pacote
})

after(async () => {
  // executado após todos os testes para um determinado pacote
})

afterEach(async () => {
  // executado após cada teste dentro de um determinado pacote
})
```

## Assertions
O objeto `assert` é uma instância de `chaijs/assert`, passada para cada teste como uma propriedade do contexto de `text` 
em retorno de chamada.

Para tornar seus testes mais confiáveis, você também pode planejar asserções a serem executadas para um determinado teste. 
Vamos considerar este exemplo:

```js
test('must throw exception', async ({ assert }) => {
  try {
    await badOperation()
  } catch ({ message }) {
    assert.equal(message, 'Some error message')
  }
})
```

O teste acima passa mesmo se uma exceção nunca foi lançada e nenhuma asserção foi executada. Este é um teste ruim,
passando apenas porque o estruturamos mal.

Para superar esse cenário, vamos passar para `plan` o número esperado de afirmações:

```js
test('must throw exception', async ({ assert }) => {
  assert.plan(1)

  try {
    await badOperation()
  } catch ({ message }) {
    assert.equal(message, 'Some error message')
  }
})
```

No exemplo acima, se `badOperation` não lançar uma exceção, o teste ainda falhará, pois planejamos a asserção de `1` e `0` foi feito.
