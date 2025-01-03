# Introdução

O AdonisJS tem suporte pronto para uso para testes, e não há necessidade de instalar nenhum pacote de terceiros para o mesmo. Basta executar o `node ace test` e a mágica acontecerá.

::: info NOTA
Se você estiver executando uma versão mais antiga que não tem suporte para testes, certifique-se de seguir nosso [guia de ativação](https://docs.adonisjs.com/releases/april-2022-release#first-class-support-for-testing).
:::

Cada nova instalação do AdonisJS vem com um teste funcional de exemplo escrito dentro do arquivo `tests/functional/hello-world.spec.ts`. Vamos abrir este arquivo e aprender como os testes são escritos no AdonisJS.

::: tip DICA
O AdonisJS usa [Japa](https://v2.japa.dev) (uma estrutura de teste desenvolvida internamente) para escrever e executar testes. **Portanto, recomendamos fortemente que você leia a documentação do Japa uma vez**.
:::

```ts
import { test } from '@japa/runner'

test('display welcome page', async ({ client }) => {
  const response = await client.get('/')

  response.assertStatus(200)
  response.assertTextIncludes('<h1 class="title"> It Works! </h1>')
})
```

- Um teste é registrado usando a função `test` exportada pelo pacote `@japa/runner`.
- A função `test` aceita o título como o primeiro argumento e o retorno de chamada de implementação como o segundo argumento.
[Contexto de teste](https://v2.japa.dev/docs/test-context). O contexto de teste contém propriedades adicionais que você pode usar para ter uma melhor experiência de teste.

Vamos executar o teste executando o seguinte comando.

```sh
node ace test

# [ info ]  running tests...

# tests/functional/hello-world.spec.ts
#   ✔ display welcome page (24ms)

#  PASSED 

# total        : 1
# passed       : 1
# duration     : 28ms
```

Agora vamos executar novamente o comando de teste, mas desta vez com o sinalizador `--watch`. O observador observará as alterações no sistema de arquivos e executará os testes após cada alteração de arquivo.

```sh
node ace test --watch
```

<video src="/docs/assets/node-ace-test-watch-edited_wmfkeo.mp4" controls />

## Conjuntos de testes
O AdonisJS organiza os testes em vários conjuntos. Os testes para cada conjunto ficam dentro de seu subdiretório. Por exemplo:

- Os testes funcionais são armazenados dentro do diretório `tests/functional/`.
- Os testes unitários são armazenados dentro do diretório `tests/unit/`.

Os conjuntos são registrados dentro do arquivo `.adonisrc.json`, e você pode remover/adicionar conjuntos conforme os requisitos. Um conjunto combina um nome exclusivo e um padrão glob para os arquivos.

::: info NOTA
Você também pode usar o comando `make:suite` para criar um novo conjunto de testes e registrá-lo dentro do arquivo `.adonisrc.json`.
:::

```json
// .adonisrc.json

{
  "tests": {
    "suites": [
      {
        "name": "functional",
        "files": "tests/functional/**/*.spec(.ts|.js)"
      }
    ]
  }
}
```

Você também pode registrar ganchos de ciclo de vida para cada conjunto de testes. Os ganchos são registrados dentro do arquivo `tests/bootstrap.ts` usando o método `configureSuite`.

No exemplo a seguir, o AdonisJS registra um gancho de configuração para iniciar o servidor HTTP para o conjunto de testes `functional`.

```ts
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (suite.name === 'functional') {
    suite.setup(() => TestUtils.httpServer().start())
  }
}
```

## Configurando o executor de testes
O AdonisJS configura o executor de testes dentro do arquivo `test.ts` dentro da raiz do seu projeto. Este arquivo primeiro inicializa o aplicativo AdonisJS e então executa os testes usando o Japa.

Você nunca tocará no arquivo `test.ts` na maior parte do tempo. Em vez disso, recomendamos que você use o arquivo `tests/bootstrap.ts` para configurar ainda mais o executor de testes ou executar lógica personalizada antes/depois dos testes.

O arquivo bootstrap exporta as seguintes propriedades, que são então fornecidas ao Japa.

```ts
// tests/bootstrap.ts

export const plugins: Config['plugins'] = []
export const reporters: Config['reporters'] = []
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [],
  teardown: [],
}
export const configureSuite: Config['configureSuite'] = (suite) => {
}
```

#### `plugins`
A propriedade `plugins` aceita uma matriz de plugins Japa. Por padrão, registramos os seguintes plugins.

- [`assert`](https://v2.japa.dev/docs/plugins/assert) - Módulo Assert para fazer asserções.
- [`runFailedTests`](https://v2.japa.dev/docs/plugins/run-failed-tests) - Um plugin para executar apenas testes com falha (se houver).
- [`apiClient`](https://v2.japa.dev/docs/plugins/api-client) - Um cliente de API para testar endpoints HTTP.

#### `reporters`
A propriedade `reporters` aceita uma matriz de repórteres Japa. Registramos o [`spec-reporter`](https://v2.japa.dev/docs/plugins/spec-reporter) para exibir o progresso dos testes no terminal.

#### `runnerHooks`
Você pode usar a propriedade `runnerHooks` para executar ações antes ou depois dos testes (em todos os conjuntos).

- Os ganchos `setup` são executados antes de todos os testes.
- Os ganchos `teardown` são executados após todos os testes.

#### `configureSuite`
O método `configureSuite` é executado com uma instância da classe [Japa suite](https://v2.japa.dev/docs/core/suite). Você pode usar a instância do suite para configurá-lo.

## Variáveis ​​de ambiente
Durante os testes, o AdonisJS define automaticamente o valor de `NODE_ENV` para `test`.

Também carregamos o arquivo `.env.test` e mesclamos os valores definidos dentro deste arquivo com variáveis ​​de ambiente existentes. As seguintes substituições são definidas por padrão.

```dotenv
NODE_ENV=test
ASSETS_DRIVER=fake
SESSION_DRIVER=memory
```

[ativos agrupados](../http/assets-manager.md) para uma implementação falsa. Isso permite que você execute testes sem compilar os ativos do frontend usando o Webpack.
- `SESSION_DRIVER` é alternado para persistir os dados da sessão na memória e acessá-los durante os testes. Usar qualquer outro driver interromperá os testes.

## Criando testes
Você pode criar testes usando o comando `node ace make:test`. O comando aceita o nome do conjunto como o primeiro argumento, seguido pelo nome do arquivo de teste.

```sh
node ace make:test functional list_users

# CREATE: tests/functional/list_users.spec.ts
```

Você também pode criar uma estrutura de arquivo aninhada da seguinte forma.

```sh
node ace make:test functional users/list

# CREATE: tests/functional/users/list.spec.ts
```

## Executando testes
Você pode executar testes executando o comando `node ace test`. Além disso, você pode executar testes para um conjunto específico passando o nome do conjunto.

```sh
# Executa todos os testes
node ace test

# Apenas testes funcionais são executados
node ace test functional

# testes unitários e funcionais são executados sequencialmente
node ace test unit functional

# Apenas testes com uma tag "orders" ou "upload" nas suítes "unit" e "functional"
node ace test --tags="orders,upload" unit functional
```

O comando `test` aceita os seguintes sinalizadores.

- `--watch`: Executa testes no modo de observação. O observador executará apenas testes do arquivo modificado se um arquivo de teste for alterado. Caso contrário, todos os testes serão executados.
- `--tags`: Executa testes que tenham uma ou mais das tags mencionadas.
- `--ignore-tags`: O inverso do sinalizador `--tags`. Executa apenas testes que não tenham todas as tags mencionadas.
- `--files`: Seleciona e executa testes dos arquivos mencionados.
- `--timeout`: Define o tempo limite global para todos os testes.
- `--force-exit`: Força a saída do processo de teste se ele não terminar normalmente.
- `--tests`: Executa testes específicos por título.

## Gerenciamento de banco de dados
Esta seção abrange migrações de banco de dados, execução de seeders e uso de transações globais para ter um estado de banco de dados limpo entre os testes.

::: info NOTA
Certifique-se de ter `@adonisjs/lucid` instalado para que os exemplos a seguir funcionem.
:::

### Migrando banco de dados

#### Redefinir banco de dados após cada ciclo de execução

Você pode migrar o banco de dados antes de executar todos os testes e revertê-lo após os testes. Isso pode ser feito registrando o gancho `TestUtils.db().migrate()` dentro do arquivo `tests/bootstrap.ts`.

```ts {6}
// tests/bootstrap.ts

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    () => TestUtils.ace().loadCommands(),
    () => TestUtils.db().migrate()
  ],
  teardown: [],
}
```

#### Truncar banco de dados após cada ciclo de execução

Uma alternativa à abordagem acima é truncar todas as tabelas no banco de dados após cada ciclo de execução em vez de revertê-lo. Isso pode ser feito registrando o hook `TestUtils.db().truncate()` dentro do arquivo `tests/bootstrap.ts`.

```ts {6}
// tests/bootstrap.ts

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    () => TestUtils.ace().loadCommands(),
    () => TestUtils.db().truncate()
  ],
  teardown: [],
}
```

Antes de executar seus testes, o hook migrará o banco de dados, se necessário. Após a execução dos testes, todas as tabelas em seu banco de dados serão mantidas, mas truncadas.

Então, da próxima vez que você executar seus testes, seu banco de dados estará vazio, mas não precisará ser migrado novamente. Esta pode ser uma abordagem melhor e economizará algum tempo se você tiver muitas migrações.

::: tip DICA
Observe que o hook chama internamente o comando `node ace db:truncate` que você também pode executar manualmente. Além disso, observe que este comando truncará todas as tabelas, **exceto** as tabelas `adonis_schema` e `adonis_schema_versions`.
:::

### Banco de dados de semeadura
Você também pode executar semeadores de banco de dados chamando o método `TestUtils.db().seed()`.

```ts {4}
setup: [
  () => TestUtils.ace().loadCommands(),
  () => TestUtils.db().migrate(),
  () => TestUtils.db().seed()
],
```

### Transações globais

Recomendamos que você use as [Transações globais de banco de dados](../../reference/database/database.md#beginglobaltransaction) para ter um estado de banco de dados limpo entre os testes.

No exemplo a seguir, iniciamos uma transação global antes de todos os testes e a revertemos após os testes.

::: tip DICA
O método `group.each.setup` é executado antes de cada teste dentro do grupo.
:::

```ts
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Group name', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
})
```

Se você estiver usando várias conexões de banco de dados, poderá definir um gancho para cada conexão. Por exemplo:

```ts
group.each.setup(async () => {
  await Database.beginGlobalTransaction('pg')
  return () => Database.rollbackGlobalTransaction('pg')
})

group.each.setup(async () => {
  await Database.beginGlobalTransaction('mysql')
  return () => Database.rollbackGlobalTransaction('mysql')
})
```
