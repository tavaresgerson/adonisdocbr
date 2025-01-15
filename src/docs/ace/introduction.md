---
summary: Ace é uma estrutura de linha de comando usada pelo AdonisJS para criar e executar comandos de console.
---

# Introdução

Ace é uma estrutura de linha de comando usada pelo AdonisJS para criar e executar comandos de console. O arquivo de ponto de entrada para Ace é armazenado na raiz do seu projeto, e você pode executá-lo da seguinte forma.

```sh
node ace
```

Como o binário `node` não pode executar o código-fonte TypeScript diretamente, temos que manter o arquivo ace em JavaScript puro e usar a extensão `.js`.

Por baixo dos panos, o arquivo `ace.js` registra o TS Node como um [gancho do carregador de módulo ESM](https://nodejs.org/api/module.html#customization-hooks) para executar o código TypeScript e importa o arquivo `bin/console.ts`.

## Ajuda e lista de comandos

Você pode visualizar a lista de comandos disponíveis executando o arquivo de ponto de entrada ace sem argumentos ou usando o comando `list`.

```sh
node ace

# O mesmo que acima
node ace list
```

![](./ace_help_screen.jpeg)

Você pode visualizar a ajuda para um único comando digitando o nome do comando com o sinalizador `--help`.

```sh
node ace make:controller --help
```

::: info NOTA
A saída da tela de ajuda é formatada de acordo com o padrão [docopt](http://docopt.org/).
:::

## Habilitando/desabilitando cores

O Ace detecta o ambiente CLI no qual está sendo executado e desabilita a saída colorida se o terminal não suportar cores. No entanto, você pode habilitar ou desabilitar manualmente as cores usando o sinalizador `--ansi`.

```sh
# Desabilitar cores
node ace list --no-ansi

# Forçar habilitar cores
node ace list --ansi
```

## Criando aliases de comando

Os aliases de comando fornecem uma camada de conveniência para definir aliases para comandos comumente usados. Por exemplo, se você costuma criar controladores singulares com recursos, pode criar um alias para ele dentro do arquivo `adonisrc.ts`.

```ts
{
  commandsAliases: {
    resource: 'make:controller --resource --singular'
  }
}
```

Depois que o alias for definido, você pode usá-lo para executar o comando.

```sh
node ace resource admin
```

### Como funciona a expansão de alias?

- Toda vez que você executar um comando, o Ace verificará se há aliases dentro do objeto `commandsAliases`.
- Se um alias existir, o primeiro segmento (antes do espaço) será usado para procurar o comando.
- Se um comando existir, o restante dos segmentos de valor do alias serão anexados ao nome do comando.

    Por exemplo, se você executar o seguinte comando

    ```sh
    node ace resource admin --help
    ```

    Ele será expandido para

    ```sh
    make:controller --resource --singular admin --help
    ```

## Executando comandos programaticamente

Você pode usar o serviço `ace` para executar comandos programaticamente. O serviço ace fica disponível após o aplicativo ter sido inicializado.

O método `ace.exec` aceita o nome do comando como o primeiro parâmetro e uma matriz de argumentos de linha de comando como o segundo parâmetro. Por exemplo:

```ts
import ace from '@adonisjs/core/services/ace'

const command = await ace.exec('make:controller', [
  'user',
  '--resource',
])
    
console.log(command.exitCode)
console.log(command.result)
console.log(command.error)
```

Você pode usar o método `ace.hasCommand` para verificar se um comando existe antes de executá-lo.

```ts
import ace from '@adonisjs/core/services/ace'

/**
 * O método de inicialização carregará os comandos (se ainda não estiverem carregados)
 */
await ace.boot()

if (ace.hasCommand('make:controller')) {
  await ace.exec('make:controller', [
    'user',
    '--resource',
  ])
}
```
