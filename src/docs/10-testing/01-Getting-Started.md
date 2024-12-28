---
title: Getting Started
category: testing
---

# Introdução

Testar manualmente seu aplicativo visitando cada página da web ou ponto de extremidade da API pode ser tedioso e, às vezes, até impossível.

O teste automatizado é a estratégia preferida para confirmar que seu aplicativo continua a se comportar conforme o esperado conforme você faz alterações em sua base de código.

Neste guia, aprendemos sobre os benefícios dos testes e diferentes maneiras de testar o código do seu aplicativo.

## Casos de teste
Se você é novo em testes, pode achar difícil entender os benefícios.

Depois que você adquirir o hábito de escrever testes, a qualidade do seu código e a confiança sobre o comportamento do seu código devem melhorar drasticamente.

### Categorias de teste
O teste é dividido em várias categorias, incentivando você a escrever diferentes tipos de casos de teste com limites claros.

Essas categorias de teste incluem:

[Testes unitários](#unit-tests)
[Testes funcionais](#functional-tests)

#### Testes unitários
Os testes unitários são escritos para testar pequenos pedaços de código isoladamente.

Por exemplo, você pode testar uma classe diretamente sem se preocupar com como essa classe é usada no mundo real:

```js
// Example

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
Testes funcionais são escritos para testar seu aplicativo como um usuário final.

Por exemplo, você pode programaticamente abrir um navegador e interagir com várias páginas da web para garantir que elas funcionem conforme o esperado:

```js
// Example

const { test, trait } = use('Test/Suite')('Example functional test')
trait('Test/Browser')
trait('Test/Session')

test('validate user details', async ({ browser }) => {
  const page = await browser.visit('/')

  await page
    .type('email', 'wrong email')
    .submitForm('form')
    .waitForNavigation()

  page.session.assertError('email', 'Invalid user email address')
})
```

Ambos os exemplos de teste acima validam o endereço de e-mail de um determinado usuário, mas a abordagem é diferente com base no tipo de teste que você está escrevendo.

## Configuração
Como o *Vow Provider* não é instalado por padrão, precisamos obtê-lo do `npm`:

```bash
adonis install @adonisjs/vow
```

Em seguida, registre o provedor no arquivo `start/app.js` array `aceProviders`:

```js
// start/app.js

const aceProviders = [
  '@adonisjs/vow/providers/VowProvider'
]
```

> OBSERVAÇÃO: O provedor é registrado dentro do array `aceProviders`, pois não queremos inicializar o mecanismo de teste ao executar seu aplicativo em produção.

A instalação de `@adonisjs/vow` cria os seguintes arquivos e diretório:

#### `vowfile.js`
`vowfiles.js` é carregado antes que seus testes sejam executados e é usado para definir tarefas que devem ocorrer antes/depois de executar todos os testes.

#### `.env.testing`
`env.testing` contém as variáveis ​​de ambiente usadas ao executar testes. Este arquivo é mesclado com `.env`, então você só precisa definir valores que deseja substituir do arquivo `.env`.

#### `test`
Todos os testes de aplicativo são armazenados dentro de subpastas do diretório `test`. Um exemplo de *teste de unidade* é adicionado a este diretório quando `@adonisjs/vow` é instalado:

```js
// test/unit/example.spec.js

'use strict'

const { test } = use('Test/Suite')('Example')

test('make sure 2 + 2 is 4', async ({ assert }) => {
  assert.equal(2 + 2, 4)
})
```

## Executando testes
A instalação do *Vow Provider* cria um exemplo de *teste de unidade* para você, que pode ser executado executando o seguinte comando:

```bash
adonis test
```

```bash
# Output

Example
  ✓ make sure 2 + 2 is 4 (2ms)

PASSED
total       : 1
passed      : 1
time        : 6ms
```

## Conjunto de testes e características
Antes de começarmos a escrever testes, vamos entender alguns fundamentos que são importantes para entender o fluxo de testes.

### Conjunto
Cada arquivo é um conjunto de testes, definindo um grupo de testes com comportamento semelhante.

Por exemplo, podemos ter um conjunto de testes para *registro de usuário*:

```js
const Suite = use('Test/Suite')('User registration')

// or destructuring
const { test } = use('Test/Suite')('User registration')
```

A função `test` obtida da instância `Suite` é usada para definir testes:

```js
test('return error when credentials are wrong', async (ctx) => {
  // implementation
})
```

### Traits
Para evitar inchar o executor de testes com funcionalidades desnecessárias, o AdonisJs envia diferentes partes de código como *traits* (os blocos de construção para seu conjunto de testes).

Por exemplo, chamamos o trait `Test/Browser` para que possamos testar via navegador da web:

```js
const { test, trait } = use('Test/Suite')('User registration')

trait('Test/Browser')

test('return error when credentials are wrong', async ({ browser }) => {
  const page = await browser.visit('/user')
})
```

> NOTA: No exemplo acima, se removêssemos o trait `Test/Browser`, o objeto `browser` seria `undefined` dentro de nossos testes.

Você pode definir características personalizadas com um fechamento ou vinculação de contêiner IoC:

```js
const { test, trait } = use('Test/Suite')('User registration')

trait(function (suite) {
  suite.Context.getter('foo', () => {
    return 'bar'
  })
})

test('foo must be bar', async ({ foo, assert }) => {
  assert.equal(foo, 'bar')
})
```

> NOTA: As características são úteis quando você deseja agrupar um pacote para ser usado por outros, embora para a maioria das situações, você possa simplesmente usar [Lifecycle Hooks](#lifecycle-hooks) em vez disso.

### Contexto
Cada teste tem um contexto isolado.

Por padrão, o contexto tem apenas uma propriedade chamada `assert` que é uma instância de [chaijs/assert](http://chaijs.com/api/assert/) para executar asserções.

Você pode passar valores personalizados para cada contexto de teste definindo *getters* ou *macros* para serem acessados ​​dentro do fechamento de retorno de chamada `test` (veja o exemplo de fechamento [Traits](#traits)).

## Ganchos do ciclo de vida
Cada suíte tem ganchos do ciclo de vida que podem ser usados ​​para executar tarefas repetitivas (por exemplo, limpar o banco de dados após cada teste):

```js
const Suite = use('Test/Suite')('User registration')

const { before, beforeEach, after, afterEach } = Suite

before(async () => {
  // executed before all the tests for a given suite
})

beforeEach(async () => {
  // executed before each test inside a given suite
})

after(async () => {
  // executed after all the tests for a given suite
})

afterEach(async () => {
  // executed after each test inside a given suite
})
```

## Asserções
O objeto `assert` é uma instância de [chaijs/assert](http://chaijs.com/api/assert/), passada para cada teste como uma propriedade do contexto de retorno de chamada `test`.

Para tornar seus testes mais confiáveis, você também pode planejar asserções a serem executadas para um determinado teste. Vamos considerar este exemplo:

```js
test('must throw exception', async ({ assert }) => {
  try {
    await badOperation()
  } catch ({ message }) {
    assert.equal(message, 'Some error message')
  }
})
```

O teste acima passa mesmo se uma exceção nunca foi lançada e nenhuma asserção foi executada. Este é um teste ruim, passando apenas porque o estruturamos mal.

Para superar esse cenário, `planeje` seu número esperado de asserções:

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

No exemplo acima, se `badOperation` não lançar uma exceção, o teste ainda falhará, pois planejamos para `1` asserção e `0` foram feitas.
