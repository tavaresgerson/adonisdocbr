---
title: Browser Tests
category: testing
---

# Testes de navegador

O AdonisJs simplifica a escrita de *testes funcionais* usando o navegador Chrome. Por baixo dos panos, ele usa o [Puppeteer](https://github.com/GoogleChrome/puppeteer) para iniciar um navegador da web e executar asserções.

Neste guia, aprendemos sobre como abrir um navegador programaticamente e executar testes como se um usuário real estivesse usando seu aplicativo.

> OBSERVAÇÃO: Como o AdonisJs usa o mecanismo do Chrome, você não pode executar seus testes em vários navegadores, como *IE* ou *Firefox*. Os testes entre navegadores geralmente são implementados para JavaScript de front-end, o que está fora do escopo da documentação do AdonisJs.

## Configuração

> OBSERVAÇÃO: O [Puppeteer](https://github.com/GoogleChrome/puppeteer) vem junto com o Chromium e demora um pouco para baixar e instalar. Para pular a instalação do Chromium, passe a variável de ambiente `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`. Se ignorado, certifique-se de definir seu [caminho personalizado do Chromium](#custom-chromium-path) também.

Como o *Provedor do Navegador* não é instalado por padrão, precisamos obtê-lo do `npm`:

```bash
adonis install @adonisjs/vow-browser

# Skip Chromium download
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true adonis install @adonisjs/vow-browser
```

Em seguida, registre o provedor no arquivo `start/app.js` array `aceProviders`:

```js
// .start/app.js

const aceProviders = [
  '@adonisjs/vow-browser/providers/VowBrowserProvider'
]
```

## Exemplo Básico
Agora que configuramos o provedor, podemos usar o traço `Test/Browser` para testar em um navegador da web.

Crie um novo *teste funcional* executando o seguinte comando:

```bash
adonis make:test hello-world
```

```bash
# .make:test Menu

> Select the type of test to create
  Unit test
❯ Functional test
```

```bash
# Output

create: test/functional/hello-world.spec.js
```

Em seguida, abra o arquivo de teste e cole o seguinte código:

```js
// .test/functional/hello-world.spec.js

'use strict'

const { test, trait } = use('Test/Suite')('Hello World')

trait('Test/Browser')

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')
  await page.assertHas('Adonis')
})
```

Examinando nosso arquivo de teste...

1. Registramos o traço `Test/Browser`, fornecendo um objeto `browser` para fazer solicitações HTTP com
2. Visitamos a URL raiz `/` e salvamos a referência ao objeto da página
3. Executamos uma asserção para confirmar que o HTML da página contém o texto `Adonis`

Finalmente, execute todos os seus testes funcionais por meio do seguinte comando:

```bash
adonis test functional
```

```bash
# Output

  Hello World
    ✓ Visit home page (978ms)

   PASSED

  total       : 1
  passed      : 1
  time        : 998ms
```

Seu primeiro teste de navegador <span style="background: lightgreen; padding: 0 5px;">PASSOU</span>. Parabéns! 🎉

> OBSERVAÇÃO: se o teste falhou, certifique-se de não ter alterado a saída padrão da rota raiz `/`.

## Caminho personalizado do Chromium
Se você usou a variável de ambiente `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` para instalar o *Provedor do navegador*, o Chromium não é instalado por padrão e você deve passar um caminho executável para o Chromium.

1. Primeiro, baixe [Chromium](https://chromium.woolyss.com/download/) e coloque-o em um diretório acessível do Node.js
2. Ao usar o trait `Test/Browser`, defina seu caminho executável para o Chromium:
```js
  trait('Test/Browser', {
    executablePath: '/absolute/path/to/chromium'
  })
  ```

Como alternativa, defina o caminho executável como uma var env no arquivo `.env.testing`:
```bash
  # .env.testing

  CHROMIUM_PATH=/absolute/path/to/chromium
  ```

## Configuração
As seguintes opções do navegador podem ser configuradas por meio do trait `Test/Browser`:

#### `options`

| Chave | Descrição | Descrição |
|-------------------|-----------------|-------------|
| `headless`        | Boolean <true>  | Se deve executar testes no modo headless ou iniciar um navegador real. |
| `executablePath`  | String          | Caminho para o executável do Chromium (necessário somente quando você não usa o Chromium empacotado). |
| `slowMo`          | Number          | Número de milissegundos usados ​​para desacelerar cada interação do navegador (pode ser usado para ver testes em câmera lenta). |
| `dumpio`          | Boolean <false> | Registre todas as mensagens do console do navegador no terminal. |

```js
// Example Usage

trait('Test/Browser', {
  headless: false
})
```

Para todas as outras opções, veja a documentação oficial [puppeteer.launch](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions).

## API do navegador
O AdonisJs adiciona um wrapper em cima do Puppeteer para torná-lo mais adequado para testes.

A API a seguir é para o navegador principal e objetos de página.

#### `browser.visit`
Chama o método [page.goto](https://pptr.dev/#?product=Puppeteer&version=v1.8.0&show=api-pagegotourl-options) do Puppeteer e tem a mesma assinatura:

```js
test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/', {
    waitUntil: 'load'
  })

  await page.assertHas('Adonis')
})
```

Você pode acessar o objeto de página real do Puppeteer por meio da propriedade `page.page`:

```js
test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')

  // puppeteer page object
  page.page.addScriptTag()
})
```

## Interações de página
Os métodos a seguir podem ser usados ​​para interagir com uma página da web.

> DICA: Os métodos de interação de página oferecem suporte a todos os [seletores CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

#### `type(selector, value)`
Digite dentro de um elemento com o seletor fornecido:

```js
const { test, trait } = use('Test/Suite')('Hello World')

trait('Test/Browser')

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')

  await page
    .type('[name="username"]', 'virk')
})
```

Para digitar vários valores, encadeie chamadas de método:

```js
await page
  .type('[name="username"]', 'virk')
  .type('[name="age"]', 22)
```

#### `select(selector, value)`
Selecione o valor dentro de uma caixa de seleção:

```js
await page
  .select('[name="gender"]', 'Male')
```

Para selecionar vários valores, passe uma matriz:

```js
await page
  .select('[name="lunch"]', ['Chicken box', 'Salad'])
```

#### `radio(selector, value)`
Selecione um botão de opção com base em seu valor:

```js
await page
  .radio('[name="gender"]', 'Male')
```

#### `check(selector)`
Marque uma caixa de seleção:

```js
await page
  .check('[name="terms"]')
```

#### `uncheck(selector)`
Desmarque uma checkbox:

```js
await page
  .uncheck('[name="newsletter"]')
```

#### `submitForm(selector)`
Enviar um formulário selecionado:

```js
await page
  .submitForm('form')

// or use a name
await page
  .submitForm('form[name="register"]')
```

#### `click(selector)`
Clique em um elemento:

```js
await page
  .click('a[href="/there"]')
```

#### `doubleClick(selector)`
Clique duas vezes em um elemento:

```js
await page
  .doubleClick('button')
```

#### `rightClick(selector)`
Clique com o botão direito em um elemento:

```js
await page
  .rightClick('button')
```

#### `clear(selector)`
Limpa o valor de um elemento fornecido:

```js
await page
  .clear('[name="username"]')
```

#### `attach(selector, [files])`
Anexa um ou vários arquivos:

```js
await page
  .attach('[name="profile_pic"]', [
    Helpers.tmpPath('profile_pic.jpg')
  ])
```

#### `screenshot(saveToPath)`
Salve uma captura de tela do estado atual de uma página da web:

```js
await page
  .type('[name="username"]', 'Virk')
  .type('[name="age"]', 27)
  .screenshot()
```

## Aguardando ações
Há momentos em que você pode ter que esperar uma ação entrar em vigor.

Por exemplo, você pode ter que esperar um elemento aparecer na página antes de clicar nele, ou pode ter que esperar uma página da web redirecionar, e assim por diante.

Os métodos a seguir podem ser usados ​​para lidar com esses cenários.

#### `waitForElement(selector, timeout = 15000)`
Aguarde até que um elemento apareça dentro do DOM:

```js
await page
  .waitForElement('div.alert')
  .assertHasIn('div.alert', 'Success!')
```

> OBSERVAÇÃO: O tempo limite de espera padrão é de `15` segundos.

#### `waitUntilMissing(selector)`
Aguarde até que um elemento desapareça do DOM:

```js
await page
  .waitUntilMissing('div.alert')
  .assertNotExists('div.alert')
```

#### `waitForNavigation()`
Aguarde até que uma página tenha navegado corretamente para uma nova URL:

```js
await page
  .click('a[href="/there"]')
  .waitForNavigation()
  .assertPath('/there')
```

#### `waitFor(closure)`
Aguarde até que a função de fechamento passada retorne true:

```js
await page
  .waitFor(function () {
    return !!document.querySelector('body.loaded')
  })
```

> OBSERVAÇÃO: O fechamento é executado no contexto do navegador e tem acesso a variáveis ​​como `window`, `document` e assim por diante.

#### `pause(timeout = 15000)`
Pause a página da web por um determinado período de tempo:

```js
await page.pause()
```

> OBSERVAÇÃO: O tempo limite de pausa padrão é de `15` segundos.

## Lendo Valores
Os métodos a seguir podem ser usados ​​para ler valores de uma página da web.

#### `getText([selector])`
Obtenha texto para um dado elemento ou para a página inteira:

```js
await page
  .getText()

// or
await page
  .getText('span.username')
```

#### `getHtml([selector])`
Obtenha HTML para um dado elemento ou para a página inteira:

```js
await page
  .getHtml()

// or
await page
  .getHtml('div.header')
```

#### `isVisible(selector)`
Descubra se um dado elemento é visível:

```js
const isVisible = await page
  .isVisible('div.alert')

assert.isFalse(isVisible)
```

#### `hasElement(selector)`
Descubra se um elemento existe no DOM:

```js
const hasElement = await page
  .hasElement('div.alert')

assert.isFalse(hasElement)
```

#### `isChecked(selector)`
Descubra se uma caixa de seleção está marcada:

```js
const termsChecked = await page
  .isChecked('[name="terms"]')

assert.isTrue(termsChecked)
```

#### `getAttribute(selector, name)`
Obtenha o valor de um atributo fornecido:

```js
const dataTip = await page
  .getAttribute('div.tooltip', 'data-tip')
```

#### `getAttributes(selector)`
Obtenha todos os atributos para um seletor de elemento fornecido:

```js
const attributes = await page
  .getAttributes('div.tooltip')
```

#### `getValue(selector)`
Obtenha o valor de um elemento de formulário fornecido:

```js
const value = await page
  .getValue('[name="username"]')

assert.equal(value, 'virk')
```

#### `getPath()`
Obtenha o caminho da página da web atual:

```js
await page
  .getPath()
```

#### `getQueryParams()`
Obtenha os parâmetros de consulta atuais:

```js
await page
  .getQueryParams()
```

#### `getQueryParam(key)`
Obtenha o valor de um único parâmetro de consulta:

```js
await page
  .getQueryParam('orderBy')
```

#### `getTitle()`
Obtenha a página da web título:

```js
await page
  .getTitle()
```

## Asserções
Uma maneira de executar asserções é ler o valor dos elementos de destino e, em seguida, fazer a asserção contra esses valores manualmente.

O cliente do navegador AdonisJS fornece vários métodos auxiliares convenientes para executar asserções de página em linha para simplificar o processo para você.

#### `assertHas(expected)`
Afirma que a página da web inclui o valor de texto esperado:

```js
await page
  .assertHas('Adonis')
```

#### `assertHasIn(selector, expected)`
Afirma que um determinado seletor contém o valor esperado:

```js
await page
  .assertHasIn('div.alert', 'Success!')
```

#### `assertAttribute(selector, attribute, expected)`
Afirma que o valor de um atributo é o mesmo que o valor esperado:

```js
await page
  .assertAttribute('div.tooltip', 'data-tip', 'Some helpful tooltip')
```

#### `assertValue(selector, expected)`
Afirma o valor para um determinado elemento de formulário:

```js
await page
  .assertValue('[name="username"]', 'virk')
```

#### `assertIsChecked(selector)`
Afirmar que uma caixa de seleção está marcada:

```js
await page
  .assertIsChecked('[name="terms"]')
```

#### `assertIsNotChecked(selector)`
Afirmar que uma caixa de seleção não está marcada:

```js
await page
  .assertIsNotChecked('[name="terms"]')
```

#### `assertIsVisible(selector)`
Afirmar que um elemento está visível:

```js
await page
  .assertIsVisible('div.notification')
```

#### `assertIsNotVisible(selector)`
Afirmar que um elemento não está visível:

```js
await page
  .assertIsNotVisible('div.notification')
```

#### `assertPath(value)`
Afirmar o valor do caminho atual:

```js
await page
  .assertPath('/there')
```

#### `assertQueryParam(key, value)`
Afirmar o valor de uma consulta parâmetro:

```js
await page
  .assertQueryParam('orderBy', 'id')
```

#### `assertExists(selector)`
Afirma que um elemento existe dentro do DOM:

```js
await page
  .assertExists('div.notification')
```

#### `assertNotExists(selector)`
Afirma que um elemento não existe dentro do DOM:

```js
await page
  .assertNotExists('div.notification')
```

#### `assertCount(selector, expectedCount)`
Afirma o número de elementos para um determinado seletor:

```js
await page
  .assertCount('table tr', 2)
```

#### `assertTitle(expected)`
Afirma o título da página da web:

```js
await page
  .assertTitle('Welcome to Adonis')
```

#### `assertEval(selector, fn, [args], expected)`
Afirma o valor de uma função executada em um determinado seletor (`fn` é executado no contexto do navegador):

```js
await page
  .assertEval('table tr', function (el) {
    return el.length
  }, 2)
```

No exemplo acima, contamos o número de `tr` dentro de uma tabela e afirmamos que a contagem é `2`.

Você também pode passar *argumentos* (`[args]`) para o seletor `fn`:

```js
await page
  .assertEval(
    'div.notification',
    function (el, attribute) {
      return el[attribute]
    },
    ['id'],
    'notification-1'
  )
```

No exemplo acima, afirmamos sobre um determinado atributo do elemento `div.notification`. O atributo fornecido é dinâmico e passado como um argumento (`['id']`).

#### `assertFn(fn, [args], expected)`
Afirma a saída de uma determinada função (`fn` é executado no contexto do navegador):

```js
await page
  .assertFn(function () {
    return document.title
  }, 'Welcome to Adonis')
```

> NOTA: A diferença entre `assertFn` e `assertEval` é que `assertEval` seleciona um elemento antes de executar a função.
