---
summary: Os ganchos do Assembler são uma maneira de executar código em pontos específicos do ciclo de vida do assembler.
---

# Ganchos do Assembler

Os ganchos do Assembler são uma maneira de executar código em pontos específicos do ciclo de vida do assembler. Como um lembrete, o Assembler é uma parte do AdonisJS que permite que você inicie seu servidor de desenvolvimento, crie seu aplicativo e execute seus testes.

Esses ganchos podem ser úteis para tarefas como geração de arquivos, compilação de código ou injeção de etapas de construção personalizadas.

Por exemplo, o pacote `@adonisjs/vite` usa o gancho `onBuildStarting` para injetar uma etapa em que os ativos de front-end são construídos. Então, quando você executa `node ace build`, o pacote `@adonisjs/vite` construirá seus ativos de front-end antes do resto do processo de construção. Este é um bom exemplo de como os ganchos podem ser usados ​​para personalizar o processo de construção.

## Adicionando um hook

Os hooks do assembler são definidos no arquivo `adonisrc.ts`, na chave `hooks`:

```ts
import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  hooks: {
    onBuildCompleted: [
      () => import('my-package/hooks/on_build_completed')
    ],
    onBuildStarting: [
      () => import('my-package/hooks/on_build_starting')
    ],
    onDevServerStarted: [
      () => import('my-package/hooks/on_dev_server_started')
    ],
    onSourceFileChanged: [
      () => import('my-package/hooks/on_source_file_changed')
    ],
  },
})
```

Vários hooks podem ser definidos para cada estágio do ciclo de vida do assembly. Cada hook é uma matriz de funções a serem executadas.

Recomendamos usar importações dinâmicas para carregar hooks. Isso garante que os hooks não sejam carregados desnecessariamente, mas apenas quando necessário. Se você escrever seu código de hook diretamente no arquivo `adonisrc.ts`, isso pode tornar a inicialização do seu aplicativo mais lenta.

## Crie um hook

Um hook é apenas uma função simples. Vamos dar um exemplo de um hook que deve executar uma tarefa de build personalizada.

```ts
// title: hooks/on_build_starting.ts
import type { AssemblerHookHandler } from '@adonisjs/core/types/app'

const buildHook: AssemblerHookHandler = async ({ logger }) => {
  logger.info('Generating some files...')

  await myCustomLogic()
}

export default buildHook
```

Observe que o hook deve ser exportado por padrão.

Uma vez que este gancho tenha sido definido, tudo o que você precisa fazer é adicioná-lo ao arquivo `adonisrc.ts` assim:

```ts
// title: adonisrc.ts
import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  hooks: {
    onBuildStarting: [
      () => import('./hooks/on_build_starting')
    ],
  },
})
```

E agora, toda vez que você executar `node ace build`, o gancho `onBuildStarting` será executado com a lógica personalizada que você definiu.

## Lista de ganchos

Aqui está a lista de ganchos disponíveis:

### `onBuildStarting`

Este gancho é executado antes do início da compilação. É útil para tarefas como geração de arquivo ou para injetar etapas de compilação personalizadas.

### `onBuildCompleted`

Este gancho é executado assim que a compilação é concluída. Ele também pode ser usado para personalizar o processo de compilação.

### `onDevServerStarted`

Este gancho é executado assim que o servidor de desenvolvimento Adonis é iniciado.

### `onSourceFileChanged`

Este hook é executado sempre que um arquivo de origem (incluído pelo seu `tsconfig.json` ) é modificado. Seu hook receberá o caminho do arquivo modificado como um argumento.
