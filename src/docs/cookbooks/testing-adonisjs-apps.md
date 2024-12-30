# Testando aplicativos AdonisJS

O executor de testes do AdonisJS v4 ainda não foi migrado para o v5 e, portanto, recebo muitas perguntas sobre testes no v5. Neste artigo, **mostrarei a você como configurar o [japa](https://github.com/thetutlage/japa) para testar seus aplicativos AdonisJS.**

O objetivo do artigo é realizar as seguintes tarefas:

- Configurar o executor de testes para inicializar o aplicativo primeiro e, em seguida, executar os testes.
- Capacidade de executar um único arquivo de teste.
- Capacidade de executar um único teste em todo o conjunto de testes.

[supertest](https://github.com/visionmedia/supertest) para fazer solicitações HTTP.
[JSDOM](https://github.com/jsdom/jsdom) para testes DOM.

## Espere, por que não usar o Jest?

::: info NOTA
A explicação do Jest ficará muito longa. Se quiser, você pode pular para a seção [Introducing Japa](#introducing-japa).
:::

Jest é um framework de testes muito popular na comunidade JavaScript. Na verdade, muitas pessoas expressaram interesse em usar Jest com AdonisJS.

Respeitando as opiniões da comunidade, eu mesmo comecei a usar Jest e percebi que a maioria dos recursos do Jest não são necessários para testar um aplicativo de backend. Claro, você ainda pode usar Jest e ignorar esses recursos, mas como Jest não é minha primeira escolha, decidi não usá-lo (pelo menos por enquanto).

### Conjuntos de testes paralelos

Jest executa cada conjunto de testes `(o bloco describe)` em seu próprio thread. Isso significa que cada conjunto de testes tem seu próprio estado global isolado. Isso é ótimo, até que seus testes não estejam lidando com recursos compartilhados.

AdonisJS é um framework de backend e a maioria dos seus testes estará interagindo com um servidor de banco de dados. O banco de dados é um recurso compartilhado e vários conjuntos de testes executados em paralelo sempre terão conflitos de dados.

Uma opção é usar um banco de dados exclusivo para cada conjunto de testes, mas isso também significa que cada conjunto de testes terá que primeiro **criar um banco de dados exclusivo** e então **executar migrações**. Isso por si só deixará seus testes significativamente mais lentos e todos os ganhos de velocidade dos testes paralelos não terão utilidade. Além disso, há mais sobrecarga mental de gerenciar recursos compartilhados de tal forma que os testes paralelos possam usá-los sem conflitos.

Outra opção é simular as chamadas do banco de dados (muitos artigos até sugerem fazer isso). Mas acredite em mim, nunca, jamais simule suas chamadas do banco de dados. Você criará mais problemas para si mesmo.

### Teste de instantâneo

Outro recurso interessante do Jest é o [teste de instantâneo](https://jestjs.io/docs/en/snapshot-testing). Os instantâneos são ótimos (ou talvez não), mas são usados ​​principalmente para afirmar estruturas HTML.

::: info NOTA
Eu sei que os instantâneos não são tecnicamente limitados apenas a estruturas HTML. Mas, os documentos oficiais + dezenas de artigos online os usam para testar a saída dos componentes React.

Então, resumindo, o espírito do teste de snapshot é evitar definir a estrutura HTML em seus testes manualmente e, em vez disso, usar um snapshot.
:::

Um bom número de aplicativos AdonisJS são APIs JSON e não produzem HTML. Mesmo os aplicativos que renderizam HTML não devem usar snapshots, pois há maneiras melhores de testar o comportamento de uma página da web.

Snapshots, afirmações contra a estrutura do HTML e não o comportamento do elemento. Você deve testar se clicar em um botão executa a ação esperada e não se seu botão está encapsulado dentro de 10 divs ou 3 divs.

Em outras palavras, o teste de snapshot é fortemente acoplado à estrutura DOM e alterar a estrutura DOM não significa que a funcionalidade do aplicativo mudou.

Aqui está um [artigo de Kent C. Dodds](https://kentcdodds.com/blog/effective-snapshot-testing), compartilhando alguns bons casos de uso para teste de snapshot e acredito que a maioria dos aplicativos AdonisJS não se enquadra nos casos de uso especificados.

### Partes não tão boas do Jest

Recursos como **testes paralelos** e **asserções de instantâneos** não são recursos ruins em si, é simplesmente, eles não são muito úteis para testar código de backend.

No nível pessoal, há algumas coisas que não gosto no Jest.

- O suporte ao TypeScript é fornecido usando Babel e não sou muito fã de adicionar muitos processos de construção e configuração dentro de um único projeto.
- Também não sou muito fã de poluir o namespace global com métodos como `describe`, `test`, `it` e assim por diante.

### Partes boas do Jest

Tanta reclamação 😐. Bem, o artigo não tem a intenção de criticar o Jest. Eu queria compartilhar meu conjunto de razões para não usar o Jest. Na verdade, o Jest tem muitas partes boas.

- A capacidade de executar um único arquivo de teste ou um teste individual.
- A saída diff de falhas de asserção é fácil de entender.
- Muitos ajudantes internos para testar o DOM.
- E uma enorme comunidade por trás disso.

## Apresentando o Japa

O Japa é um pequeno e incorporável executor de testes, escrito apenas para Node.js. Isso significa que ele não carrega nenhum peso extra para funcionar em ambientes de navegador.

A seguir estão alguns dos meus favoritos do Japa (eu o escrevi, então também sou um pouco tendencioso)

- Não há CLI para executar testes. Você pode executar seus arquivos JavaScript diretamente e ele executará os testes.
  * [módulo chai assert](https://www.chaijs.com/guide/styles/#assert) para asserções
  * [mais rápido](https://github.com/thetutlage/japa#faster-boot-time-) do que Mocha e Ava. Ainda não o comparei com o Jest.
- Tem uma API bastante robusta para gerenciar e criar testes. Por exemplo:
- Execute um único teste usando o método `.only`.
- Pule os testes usando o método `.skip`.
- Pule os testes apenas no CI usando o método `.skipInCI`.
- Testes de grupo
- Capacidade de escrever testes de regressão
- Permite planejamento de asserção
- Escrito em TypeScript, então o intellisense funciona imediatamente.

## Configuração para AdonisJS

Chega de teoria, vamos começar com alguma ação. Execute o comando a seguir para instalar as dependências necessárias do registro npm.

:::code-group
```sh [npm]
npm i -D japa execa@5.1.1 get-port@5.1.1
```

```sh [Yarn]
yarn add -D japa execa@5.1.1 get-port@5.1.1
```
:::

Em seguida, crie o arquivo `japaFile.ts` dentro da raiz do projeto e cole o seguinte conteúdo dentro dele.

```ts
// japaFile.ts

import 'reflect-metadata'
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })

async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

/**
 * Configurar o executor de teste
 */
configure({
  files: ['test/**/*.spec.ts'],
  before: [startHttpServer],
})
```

Finalmente, crie um arquivo de teste de exemplo para garantir que tudo esteja funcionando conforme o esperado. O arquivo deve ficar dentro do diretório `test/` na raiz do projeto.

```sh
# Criar diretório
mkdir test

# Criar arquivo vazio
touch test/example.spec.ts
```

```ts
// test/example.spec.ts

import test from 'japa'

test.group('Example', () => {
  test('assert sum', (assert) => {
    assert.equal(2 + 2, 4)
  })
})
```

Execute o comando a seguir para executar os testes.

```sh
node -r @adonisjs/assembler/build/register japaFile.ts
```

<video src="/docs/assets/japa-test-run_g8on69.mp4" controls />

### Entendendo `japaFile`

Voilá! Temos a configuração básica pronta. Antes de prosseguir, vamos entender o que aconteceu.

- Como mencionado anteriormente. O Japa não tem nenhuma CLI, você só precisa criar um arquivo e usar o método `configure` para configurar o executor de testes.
- O método `configure` aceita um glob `files` para encontrar os arquivos de teste. Mencionamos `test/**/*.spec.ts`.
- A propriedade `before` aceita uma série de ações para executar antes mesmo que o japa pesquise os arquivos de teste. Definimos uma ação para inicializar o servidor HTTP AdonisJS.
- Além disso, em vez de depender da `PORT` definida dentro do arquivo `.env`. Escolhemos uma porta aleatória para executar o servidor HTTP durante os testes.

## Testando chamadas HTTP

Vamos dar um passo à frente e escrever um teste que faça uma chamada HTTP para nosso servidor AdonisJS e use JSDOM para declarar o HTML de resposta.

Primeiro, precisamos instalar [supertest](https://npm.im/supertest) e [jsdom](https://npm.im/jsdom).

:::code-group

```sh [Npm]
npm i -D supertest @types/supertest jsdom @types/jsdom
```

```sh [Yarn]
yarn add -D supertest @types/supertest jsdom @types/jsdom
```
:::

Abra o arquivo `test/example.spec.ts` e substitua seu conteúdo pelo seguinte trecho de código.

```ts
// test/example.spec.ts

import test from 'japa'
import { JSDOM } from 'jsdom'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  test('ensure home page works', async (assert) => {
    /**
     * Fazer solicitação
     */
    const { text } = await supertest(BASE_URL).get('/').expect(200)

    /**
     * Construir instância JSDOM usando o HTML de resposta
     */
    const { document } = new JSDOM(text).window

    const title = document.querySelector('.title')
    assert.exists(title)
    assert.equal(title!.textContent!.trim(), 'It Works!')
  })
})
```

Agora, execute novamente os testes executando o comando `node -r @adonisjs/assembler/build/register japaFile.ts`.

## Interagindo com o banco de dados

O próximo passo é escrever um teste que interaja com o banco de dados. Mas primeiro, vamos atualizar o arquivo `japaFile.ts` para executar e reverter migrações toda vez que executarmos os testes. Dessa forma, garantiremos que sempre começaremos de um banco de dados limpo.

::: tip DICA
Você também pode configurar um banco de dados separado para testes criando o arquivo `.env.testing` na raiz do projeto e [sobrescrevendo as](/docs/guides/fundamentals/environment-variables.md#defining-variables-while-testing) variáveis ​​de ambiente necessárias.
:::

```ts
// japaFile.ts

import 'reflect-metadata'
import execa from 'execa' // [!code focus]
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })

async function runMigrations() { // [!code focus]
  await execa.node('ace', ['migration:run'], { // [!code focus]
    stdio: 'inherit', // [!code focus]
  }) // [!code focus]
} // [!code focus]
// [!code focus]
async function rollbackMigrations() { // [!code focus]
  await execa.node('ace', ['migration:rollback', '--batch=0'], { // [!code focus]
    stdio: 'inherit', // [!code focus]
  }) // [!code focus]
} // [!code focus]

async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

/**
 * Configurar o executor de teste
 */
configure({
  files: ['test/**/*.spec.ts'],
  before: [
    runMigrations, // [!code focus]
    startHttpServer,
  ],
  after: [rollbackMigrations], // [!code focus]
})
```

Em seguida, reabra o arquivo `test/example.spec.ts` e crie um novo teste que interaja com o banco de dados.

```ts
// test/example.spec.ts
import test from 'japa'
import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import User from 'App/Models/User' // [!code focus]

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  test('ensure home page works', async (assert) => {
    const { text } = await supertest(BASE_URL).get('/').expect(200)
    const { document } = new JSDOM(text).window
    const title = document.querySelector('.title')

    assert.exists(title)
    assert.equal(title!.textContent!.trim(), 'It Works!')
  })

  test('ensure user password gets hashed during save', async (assert) => { // [!code focus]
    const user = new User() // [!code focus]
    user.email = 'virk@adonisjs.com' // [!code focus]
    user.password = 'secret' // [!code focus]
    await user.save() // [!code focus]
// [!code focus]
    assert.notEqual(user.password, 'secret') // [!code focus]
  }) // [!code focus]
})
```

Vamos executar os testes novamente.

<video src="/docs/assets/japa-db-run_onhyjn.mp4" controls />

## Executando um único teste

Muitas vezes, você se verá trabalhando no código e nos testes juntos. Não seria legal se você pudesse acelerar o loop de feedback dos testes apenas executando um único teste?

Bem, você pode fazer isso com o Japa facilmente. **Use o método `test.only` para ignorar todos os outros testes em todos os arquivos**. Para demonstração, vamos reabrir o arquivo `test/example.spec.ts` e executar apenas um teste

```ts
// ...

test.group('Welcome', () => {
  // ...

  test.only('ensure user password gets hashed during save', async (assert) => { // [!code focus]
    const user = new User()
    user.email = 'virk@adonisjs.com'
    user.password = 'secret'
    await user.save()

    assert.notEqual(user.password, 'secret')
  })
})
```

## Executando um único arquivo de teste

Você também pode executar um único arquivo de teste modificando o glob `files`. Reabra o arquivo `japaFile.ts` e adicione o seguinte método dentro dele.

```ts
// japaFile.ts

// Adicione este método ao arquivo
function getTestFiles() {
  let userDefined = process.argv.slice(2)[0]
  if (!userDefined) {
    return 'test/**/*.spec.ts'
  }

  return `${userDefined.replace(/\.ts$|\.js$/, '')}.ts`
}
```

Em seguida, substitua o glob `files` pela saída do método `getTestFiles`.

```ts
// title: japaFile.ts
configure({
  files: getTestFiles(), // [!code focus]
  before: [runMigrations, startHttpServer],
  after: [rollbackMigrations],
})
```

Isso é tudo! Agora, você pode especificar o caminho do arquivo no momento da execução dos testes. Para demonstração, vamos criar outro arquivo de teste e executar apenas os testes dentro do novo arquivo.

```sh
touch test/hello.spec.ts
```

Abra o arquivo recém-criado e cole o seguinte conteúdo dentro dele.

```ts
// test/hello.spec.ts
import test from 'japa'

test.group('Japa', () => {
  test('assert hello world', (assert) => {
    assert.equal('hello world', 'hello world')
  })
})
```

Finalmente, execute o seguinte comando para executar apenas o arquivo `hello.spec.ts`.

```sh
node -r @adonisjs/assembler/build/register japaFile.ts test/hello.spec.ts
```

<video src="/docs/assets/japa-specific-files_kn3rkf.mp4" controls />

## Finalizando

Como você pode ver, com apenas algumas linhas de código dentro do `japaFile.ts`, conseguimos configurar um executor de testes bem robusto. Deixe-me dar mais algumas dicas sobre testes.

### Ganchos do ciclo de vida

O método `test.group` do Japa permite que você se conecte ao ciclo de vida dos testes definindo os seguintes métodos.

```ts
test.group('Example', (group) => {
  group.before(async () => {
    console.log('before all tests')
  })

  group.beforeEach(async () => {
    console.log('before every test')
  })

  group.after(async () => {
    console.log('after all tests')
  })

  group.afterEach(async () => {
    console.log('after every test')
  })
})
```

### Usando transações globais de banco de dados

Um bom conjunto de testes sempre garante que cada teste comece do zero. Para ter um banco de dados limpo antes de cada teste, você pode usar as **transações globais do Lucid**. Por exemplo:

```ts
import test from 'japa'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Example', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
```

Agora, todas as consultas do banco de dados serão encapsuladas dentro de uma **transação global** e nada será persistido no banco de dados nunca.

### Leia a documentação do Japa

Finalmente, sugiro que você leia o arquivo [README](https://github.com/thetutlage/japa#test-your-apps) do Japa uma vez para explorar todos os recursos que não são abordados neste artigo.
