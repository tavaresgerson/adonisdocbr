# AdonisJS REPL

REPL significa **read–eval–print loop** - uma maneira de executar rapidamente instruções de linha única e imprimir a saída no terminal.

Assim como o Node.js, o AdonisJS também tem seu próprio **REPL com reconhecimento de aplicativo**, dando a você acesso ao código do seu aplicativo dentro da sessão REPL.

Vamos tentar executando o seguinte comando Ace.

```sh
node ace repl
```

<video src="/docs/assets/adonis-repl_ibios2.mp4" controls />

## Métodos auxiliares
Escrever as instruções `import` dentro do REPL requer um pouco mais de digitação e, portanto, adicionamos vários métodos de atalho para importar os módulos comumente necessários.

Vamos testar o módulo de criptografia novamente, mas desta vez usaremos o método de atalho para importar o módulo.

<video src="/docs/assets/adonis-repl-shortcuts_jcyxay.mp4" controls />

Você pode visualizar a lista de métodos auxiliares digitando o comando `.ls`.

![](/docs/assets/Screenshot_2020-11-09_at_9.50.06_PM_hekkxu.png)

Assim como tudo o mais, o REPL também tem uma API extensível e, à medida que você instalar novos pacotes, verá a lista de métodos auxiliares crescendo.

Por exemplo: O Lucid ORM vem com o auxiliar `loadModels` para carregar recursivamente modelos do diretório `app/Models`.

<video src="/docs/assets/repl-load-models_ye0rdy.mp4" controls />

## Adicionando auxiliares personalizados

Você pode adicionar seus auxiliares personalizados criando um arquivo de pré-carregamento dentro do diretório `start`. Comece criando um novo arquivo executando o seguinte comando.

::: info NOTA
Certifique-se de selecionar o ambiente como `repl` pressionando a tecla `<SPACE>` e pressione enter.
:::

```sh
node ace make:prldfile repl
```

Em seguida, abra o arquivo recém-criado e cole o seguinte conteúdo dentro dele.

```ts
// start/repl.ts

import Repl from '@ioc:Adonis/Addons/Repl'

Repl.addMethod(
  'sayHi',
  (repl) => {
    console.log(repl.colors.green('hi'))
  },
  { description: 'A test method that prints "hi"' }
)
```

Finalmente, inicie a sessão REPL e digite `sayHi()` para executar o método. Atualmente, estamos escrevendo para o console, no entanto, você pode executar qualquer ação dentro desta função.
