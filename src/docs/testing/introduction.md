---
resumo: Aprenda a escrever e executar testes no AdonisJS usando o Japa, nossa estrutura de testes integrada.
---

# Testes

O AdonisJS tem suporte integrado para escrever testes. Você não precisa instalar pacotes adicionais ou conectar seu aplicativo para estar pronto para testes - Todo o trabalho duro já foi feito.

Você pode executar os testes do aplicativo usando o seguinte comando ace.

```sh
node ace test
```

Os testes são armazenados dentro do diretório `tests` e nós organizamos os testes por tipo. Por exemplo, os testes funcionais são armazenados dentro do diretório `tests/functional`, e os testes unitários são armazenados dentro do diretório `tests/unit`.

Os testes funcionais se referem a testes de fora para dentro nos quais você fará solicitações HTTP reais para seu aplicativo para testar a funcionalidade de um determinado fluxo ou ponto de extremidade. Por exemplo, você pode ter uma coleção de testes funcionais para criar um usuário.

Algumas comunidades podem se referir aos testes funcionais como testes de recursos ou testes de ponta a ponta. O AdonisJS é flexível sobre como você os chama. Decidimos nos contentar com o termo **testes funcionais**.

## Configurando o executor de testes

O AdonisJS usa [Japa](https://japa.dev/docs) para escrever e executar testes. Portanto, recomendamos ler a documentação do Japa para entender melhor suas APIs e opções de configuração.

### Suites

As suites de teste são definidas dentro do arquivo `adonisrc.ts`. Por padrão, registramos as suites de teste `functional` e `unit`. Se necessário, você pode remover as suites existentes e começar do zero.

```ts
{
  tests: {
    suites: [
      {
        name: 'functional',
        files: ['tests/functional/**/*.spec.(js|ts)']
      },
      {
        name: 'unit',
        files: ['tests/unit/**/*.spec.(js|ts)']
      }
    ]
  }
}
```

- Uma suite combina o nome exclusivo da suite e o padrão glob do arquivo.
- Quando você executa testes para uma suite específica, apenas os arquivos relacionados a essa suite são importados.

Você pode configurar uma suite em tempo de execução usando o hook `configureSuite` definido dentro do arquivo `tests/bootstrap.ts`. Por exemplo, ao executar testes funcionais, você pode registrar ganchos de nível de suíte para iniciar o servidor HTTP.

```ts
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
```

### Ganchos do executor

Os ganchos do executor são ações globais que você pode executar antes e depois de todos os testes. Os ganchos são definidos usando a propriedade `runnerHooks` dentro do arquivo `tests/boostrap.ts`.

```ts
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    () => {
      console.log('running before all the tests')
    }
  ],
  teardown: [
    () => {
      console.log('running after all the tests')
    }
  ],
}
```

### Plugins

O Japa tem um sistema de plugins que você pode usar para estender sua funcionalidade. Os plugins são registrados dentro do arquivo `tests/bootstrap.ts`.

Veja também: [Criando plugins Japa](https://japa.dev/docs/creating-plugins)

```ts
export const plugins: Config['plugins'] = [
  assert(),
  pluginAdonisJS(app)
]
```

### Reporters

Os reporters são usados ​​para relatar/exibir o progresso dos testes conforme eles são executados. Os repórteres são registrados dentro do arquivo `tests/bootstrap.ts`.

Veja também: [Criando repórteres Japa](https://japa.dev/docs/creating-reporters)

```ts
export const reporters: Config['reporters'] = {
  activated: ['spec']
}
```

## Criando testes

Você pode criar um novo teste usando o comando `make:test`. O comando precisa do nome do conjunto para criar o arquivo de teste.

Veja também: [Comando Make test](../references/commands.md#maketest)

```sh
node ace make:test posts/create --suite=functional
```

O arquivo será criado dentro do diretório configurado usando a propriedade glob `files`.

## Escrevendo testes

Os testes são definidos usando o método `test` importado do pacote `@japa/runner`. Um teste aceita um título como o primeiro parâmetro e o retorno de chamada de implementação como o segundo parâmetro.

No exemplo a seguir, criamos uma nova conta de usuário e usamos o objeto [`assert`](https://japa.dev/docs/plugins/assert) para garantir que a senha seja hash corretamente.

```ts
import { test } from '@japa/runner'

import User from '#models/User'
import hash from '@adonisjs/core/services/hash'

test('hashes user password when creating a new user', async ({ assert }) => {
  const user = new User()
  user.password = 'secret'
  
  await user.save()
  
  assert.isTrue(hash.isValidHash(user.password))
  assert.isTrue(await hash.verify(user.password, 'secret'))
})
```

### Usando grupos de teste

Os grupos de teste são criados usando o método `test.group`. Os grupos adicionam estrutura aos seus testes e permitem que você execute [ganchos de ciclo de vida](https://japa.dev/docs/lifecycle-hooks) em torno dos seus testes.

Continuando o exemplo anterior, vamos mover o teste de hash de senha para dentro de um grupo.

```ts
import { test } from '@japa/runner'

import User from '#models/User'
import hash from '@adonisjs/core/services/hash'

// highlight-start
test.group('creating user', () => {
// highlight-end
  test('hashes user password', async ({ assert }) => {
    const user = new User()
    user.password = 'secret'
    
    await user.save()
    
    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secret'))
  })
// highlight-start
})
// highlight-end
```

Se você notou, removemos o fragmento **"ao criar um novo usuário"** do título do nosso teste. Isso ocorre porque o título do grupo esclarece que todos os testes sob esse grupo têm como escopo **criar um novo usuário**.

### Ganchos de ciclo de vida

Os ganchos de ciclo de vida são usados ​​para executar ações em torno dos testes. Você pode definir hooks usando o objeto `group`.

Veja também - [Japa docs para Lifecycle hooks](https://japa.dev/docs/lifecycle-hooks)

```ts
test.group('creating user', (group) => {
  // highlight-start
  group.each.setup(async () => {
    console.log('runs before every test')
  })

  group.each.teardown(async () => {
    console.log('runs after every test')
  })

  group.setup(async () => {
    console.log('runs once before all the tests')
  })

  group.teardown(async () => {
    console.log('runs once after all the tests')
  })
  // highlight-end

  test('hashes user password', async ({ assert }) => {
    const user = new User()
    user.password = 'secret'
    
    await user.save()
    
    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secret'))
  })
})
```

### Próximos passos

Agora que você conhece os conceitos básicos de criação e escrita de testes. Recomendamos que você explore os seguintes tópicos na documentação do Japa.

[Explore a API da função `test`](https://japa.dev/docs/underlying-test-class)
[Aprenda a testar código assíncrono de forma eficaz](https://japa.dev/docs/testing-async-code)
[Usando conjuntos de dados para evitar testes repetitivos](https://japa.dev/docs/datasets)

## Executando testes

Você pode executar testes usando o comando `test`. Por padrão, os testes para todos os conjuntos são executados. No entanto, você pode executar testes para um conjunto específico passando o nome.

```sh
node ace test
```

```sh
node ace test functional
node ace test unit
```

### Observando alterações de arquivo e executando novamente os testes

Você pode usar o comando `--watch` para observar o sistema de arquivos e executar novamente os testes. Se um arquivo de teste for alterado, os testes dentro do arquivo alterado serão executados. Caso contrário, todos os testes serão executados novamente.

```sh
node ace test --watch
```

### Filtrando testes

Você pode aplicar filtros usando os sinalizadores de linha de comando ao executar os testes. A seguir está a lista de opções disponíveis.

Veja também: [Guia de testes de filtragem Japa](https://japa.dev/docs/filtering-tests)

:::dica

**Usando VSCode?** Use a [extensão Japa](https://marketplace.visualstudio.com/items?itemName=jripouteau.japa-vscode) para executar testes selecionados dentro do seu editor de código usando atalhos de teclado ou a barra lateral de atividades.

:::

| Sinalizar     | Descrição                                                                                                                                                                                            |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--tests`    | Filtrar teste pelo título do teste. Este filtro corresponde ao título exato do teste. |
| `--files`    | Filtrar testes pelo subconjunto do nome do arquivo de teste. A correspondência é realizada no final do nome do arquivo sem `.spec.ts`. Você pode executar testes para uma pasta completa usando a expressão curinga. `folder/*` |
| `--groups`   | Filtrar teste pelo nome do grupo. Este filtro corresponde ao nome exato do grupo. |
| `--tags`     | Filtrar testes por tags. Você pode prefixar o nome da tag com o til `~` para ignorar testes com a tag fornecida |
| `--matchAll` | Por padrão, o Japa executará testes que correspondem a qualquer uma das tags mencionadas. Se você quiser que todas as tags correspondam, use o sinalizador `--matchAll` |

### Forçar saída de testes

O Japa espera que o processo seja encerrado normalmente após concluir todos os testes. O processo de encerramento normal significa sair de todas as conexões de longa duração e esvaziar o loop de eventos do Node.js.

Se necessário, você pode forçar o Japa a sair do processo e não esperar por um encerramento normal usando o sinalizador `--force-exit`.

```sh
node ace test --force-exit
```

### Tentando novamente os testes
Você pode tentar novamente os testes com falha várias vezes usando o sinalizador `--retries`. O sinalizador será aplicado a todos os testes sem uma contagem explícita de tentativas definida no nível do teste.

```sh
# Retry failing tests 2 times
node ace test --retries=2
```

### Executando testes com falha da última execução
Você pode executar novamente os testes com falha da última execução usando o sinalizador de linha de comando `--failed`.

```sh
node ace test --failed
```

### Alternando entre repórteres
O Japa permite que você registre vários repórteres de teste dentro do arquivo de configuração, mas não os ativa por padrão. Você pode ativar repórteres dentro do arquivo de configuração ou usando o sinalizador de linha de comando `--reporter`.

```sh
# Activate spec reporter
node ace test --reporter=spec

# Activate spec and json reporters
node ace test --reporter=spec,json
```

Você também pode ativar repórteres dentro do arquivo de configuração.

```ts
export const reporters: Config['reporters'] = {
  activated: ['spec', 'json']
}
```

### Passando opções para a linha de comando do Node.js
O comando `test` executa testes `(arquivo bin/test.ts)` como um processo filho. Se você quiser passar [argumentos do nó](https://nodejs.org/api/cli.html#options) para o processo filho, você pode defini-los antes do nome do comando.

```sh
node ace --no-warnings --trace-exit test
```

## Variáveis ​​de ambiente

Você pode usar o arquivo `.env.test` para definir as variáveis ​​de ambiente necessárias durante o teste. Os valores dentro do `.env.test` têm precedência sobre aqueles dentro do arquivo `.env`.

O `SESSION_DRIVER` durante o teste deve ser definido como `memory`.

```dotenv
// title: .env.test
SESSION_DRIVER=memory
```
