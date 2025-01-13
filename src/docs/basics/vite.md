---
summary: Aprenda a usar o Vite para agrupar ativos de front-end em aplicativos AdonisJS.
---

# Vite

O AdonisJS usa [Vite](https://vitejs.dev/) para agrupar os ativos de front-end de seus aplicativos. Fornecemos uma integração oficial que realiza todo o trabalho pesado necessário para integrar o Vite com uma estrutura de back-end como o AdonisJS. Inclui:

- Incorporação do servidor de desenvolvimento Vite dentro do AdonisJS.
- Um plugin Vite dedicado para simplificar as opções de configuração.
- Ajudantes e tags de ponta para gerar URLs para ativos processados ​​pelo Vite.
[API de tempo de execução Vite](https://vitejs.dev/guide/api-vite-runtime.html#vite-runtime-api) para executar renderização do lado do servidor (SSR).

O Vite é incorporado dentro do servidor de desenvolvimento AdonisJS, e cada solicitação que deve ser tratada pelo Vite é enviada por proxy para ele por meio de um middleware AdonisJS. Ele nos permite acessar diretamente a API de tempo de execução do Vite para executar a renderização do lado do servidor (SSR) e gerenciar um único servidor de desenvolvimento. Isso também significa que os ativos são servidos pelo AdonisJS diretamente e não por um processo separado.

::: tip DICA
Ainda está usando @adonisjs/vite 2.x? [Consulte o guia de migração](https://github.com/adonisjs/vite/releases/tag/v3.0.0) para atualizar para a versão mais recente.
:::

## Instalação

Primeiro, certifique-se de ter pelo menos as seguintes versões do AdonisJS instaladas:

- `@adonisjs/core`: 6.9.1 ou posterior
- `@adonisjs/assembler`: 7.7.0 ou posterior

Em seguida, instale e configure o pacote `@adonisjs/vite`. O comando abaixo instala o pacote e o `vite` e configura o projeto criando os arquivos de configuração necessários.

```sh
# npm
node ace add @adonisjs/vite
```

::: details Veja os passos realizados pelo comando configure

1. Registra o seguinte provedor de serviço dentro do arquivo `adonisrc.ts`.

    ```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/vite/vite_provider')
      ]
    }
    ```

2. Crie os arquivos de configuração `vite.config.ts` e `config/vite.ts`.

3. Crie o arquivo de ponto de entrada do frontend, ou seja, `resources/js/app.js`.

:::

Uma vez feito isso, adicione o seguinte ao seu arquivo `adonisrc.ts`.

```ts {4-7}
import { defineConfig } from '@adonisjs/core/build/standalone'

export default defineConfig({
  assetsBundler: false,
  hooks: {
    onBuildStarting: [() => import('@adonisjs/vite/build_hook')],
  },
})
```

A propriedade `assetsBundler` é definida como `false` para desativar o gerenciamento do bundler de ativos feito pelo AdonisJS Assembler.

A propriedade `hooks` registra o `@adonisjs/vite/build_hook` para executar o processo de construção do Vite. Veja [Ganchos do Assembler](../concepts/assembler_hooks.md) para mais informações.

## Configuração
O processo de configuração cria dois arquivos de configuração. O arquivo `vite.config.ts` é usado para configurar o bundler Vite, e `config/vite.ts` é usado pelo AdonisJS no backend.

### Arquivo de configuração Vite
O arquivo `vite.config.ts` é um arquivo de configuração regular usado pelo Vite. De acordo com os requisitos do seu projeto, você pode instalar e registrar plugins Vite adicionais dentro deste arquivo.

Por padrão, o arquivo `vite.config.ts` usa o plugin AdonisJS, que aceita as seguintes opções.

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    adonisjs({
      entrypoints: ['resources/js/app.js'],
      reload: ['resources/views/**/*.edge'],
    }),
  ]
})
```

### `entrypoints`

O `entrypoints` se refere ao arquivo de ponto de entrada da sua base de código frontend. Normalmente, será um arquivo JavaScript ou TypeScript com importações adicionais. Cada ponto de entrada resultará em um pacote de saída separado.

Além disso, se necessário, você pode definir vários pontos de entrada. Por exemplo, um ponto de entrada para seu aplicativo voltado para o usuário e outro para o painel de administração.

### `buildDirectory`

A opção `buildDirectory` define um caminho relativo para o diretório de saída. O valor da opção é fornecido ao Vite como a opção [`build.outDir`](https://vitejs.dev/config/build-options.html#build-outdir).

Se você decidir alterar o valor padrão, certifique-se de atualizar também o caminho `buildDirectory` no arquivo `config/vite.ts`.

**Padrão: public/assets**

### `reload`

Ele contém uma matriz de padrões glob para observar e recarregar o navegador na alteração do arquivo. Por padrão, observamos os modelos do Edge. No entanto, você também pode configurar padrões adicionais.

### `assetsUrl`

Ele contém a URL para prefixar ao gerar links para ativos em produção. Se você carregar a saída do Vite para um CDN, o valor desta propriedade deverá ser a URL do servidor CDN.

Certifique-se de atualizar a configuração do backend para usar o mesmo valor `assetsUrl`.

---

### Arquivo de configuração do AdonisJS
O AdonisJS usa o arquivo `config/vite.ts` no backend para saber sobre os caminhos de saída do processo de construção do Vite.

```ts
// config/vite.ts

import { defineConfig } from '@adonisjs/vite'

const viteBackendConfig = defineConfig({
  buildDirectory: 'public/assets',
  assetsUrl: '/assets',
})

export default viteBackendConfig
```
### `buildDirectory`

Ele contém o caminho para o diretório de saída de construção do Vite. Você também deve atualizar esta configuração de backend se alterar o valor padrão dentro do arquivo `vite.config.ts`.

### `assetsUrl`

A URL para prefixar ao gerar links para ativos em produção. Se você carregar a saída do Vite para um CDN, o valor desta propriedade deve ser a URL do servidor CDN.

### `scriptAttributes`

Você pode usar a propriedade `scriptAttributes` para definir atributos nas tags de script geradas usando a tag `@vite`. Os atributos são uma coleção de pares de chave-valor.

```ts
// config/vite.ts

defineConfig({
  scriptAttributes: {
    defer: true,
    async: true,
  }
})
```

### `styleAttributes`

Você pode usar a propriedade `styleAttributes` para definir atributos nas tags de link geradas usando a tag `@vite`. Os atributos são uma coleção de pares de chave-valor.

```ts
// config/vite.ts

defineConfig({
  styleAttributes: {
    'data-turbo-track': 'reload'
  }
})
```

Você também pode aplicar os atributos condicionalmente atribuindo uma função à opção `styleAttributes`.

```ts
defineConfig({
  styleAttributes: ({ src, url }) => {
    if (src === 'resources/css/admin.css') {
      return {
        'data-turbo-track': 'reload'
      }
    }
  }
})
```

## Estrutura de pastas para ativos de frontend
Tecnicamente, o AdonisJS não impõe nenhuma estrutura de pastas para armazenar seus ativos de frontend. Você pode organizá-los como quiser.

No entanto, recomendamos armazenar ativos de frontend dentro da pasta `resources`, com cada classe de ativo dentro de seu subdiretório.

```
resources
└── css
└── js
└── fonts
└── images
```

A saída do vite estará na pasta `public/assets`. Escolhemos o subdiretório `/assets` para que você possa continuar usando a pasta `public` para outros arquivos estáticos que não deseja processar usando o Vite.

## Iniciando o servidor de desenvolvimento

Você pode iniciar seu aplicativo normalmente, e o AdonisJS fará proxy automaticamente das solicitações necessárias para o Vite.

```sh
node ace serve --hmr
```

## Incluindo pontos de entrada em modelos do Edge
Você pode renderizar o script e as tags de estilo para os pontos de entrada definidos dentro do arquivo `vite.config.ts` usando a tag Edge `@vite`. A tag aceita uma matriz de pontos de entrada e retorna as tags `script` e `link`.

```edge {6}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @vite(['resources/js/app.js'])
</head>
<body>
    
</body>
</html>
```

Recomendamos importar arquivos CSS dentro de seus arquivos JavaScript e não registrá-los separadamente como um ponto de entrada. Por exemplo:

```
resources
└── css
    └── app.css
└── js
    └── app.js
```

```js
// resources/js/app.js

import '../css/app.css'
```

## Referenciando ativos dentro de modelos Edge
O Vite cria um gráfico de dependência de arquivos importados pelos pontos de entrada e atualiza automaticamente seus caminhos de acordo com a saída agrupada. No entanto, o Vite não tem conhecimento dos modelos Edge e não consegue detectar seus ativos referenciados.

Portanto, fornecemos um auxiliar do Edge que você pode usar para criar URLs para arquivos processados ​​pelo Vite. No exemplo a seguir:

- O auxiliar `asset` retornará uma URL apontando para o servidor de desenvolvimento do Vite durante o desenvolvimento.
- Retornará uma URL apontando para o nome do arquivo de saída durante a produção.

```edge
<link rel="stylesheet" href="{{ asset('resources/css/app.css') }}">
```

```html
<!-- Saída em "development" -->

<link rel="stylesheet" href="http://localhost:5173/resources/css/app.css">
```

```html
<!-- Saída em "production" -->

<link rel="stylesheet" href="/assets/app-3bc29777.css">
```

## Processando ativos adicionais com o Vite
O Vite ignora ativos estáticos não importados pelo código do frontend. Podem ser imagens estáticas, fontes ou ícones SVG referenciados somente dentro dos modelos Edge.

Portanto, você terá que notificar o Vite sobre a existência desses ativos usando sua API [importações Glob](https://vitejs.dev/guide/features.html#glob-import).

No exemplo a seguir, pedimos ao Vite para processar todos os arquivos dentro do diretório `resources/images`. Este código deve ser escrito dentro de um arquivo de ponto de entrada.

```js
// resources/js/app.js

import.meta.glob(['../images/**'])
```

Agora, você pode referenciar as imagens dentro dos seus modelos Edge da seguinte forma.

```edge
<img src="{{ asset('resources/images/hero.jpg') }}" />
```

## Configurando TypeScript
Se você planeja usar TypeScript na sua base de código frontend, crie um arquivo `tsconfig.json` adicional dentro do diretório `resources`. O Vite e seu editor de código usarão automaticamente este arquivo de configuração para o código-fonte TypeScript dentro do diretório `resources`.

```json
// resources/tsconfig.json

{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "lib": ["DOM"],
    "jsx": "preserve", // If you are using React
    "paths": {
      "@/*": ["./js/*"]
    }
  }
}
```

## Habilitando HMR com React
Para habilitar [react-refresh](https://www.npmjs.com/package/react-refresh) durante o desenvolvimento, você deve usar a tag Edge `@viteReactRefresh`. Ela deve ser escrita antes de você incluir os pontos de entrada usando a tag `@vite`.

```edge {6-7}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @viteReactRefresh()
    @vite(['resources/js/app.js'])
</head>
<body>
    
</body>
</html>
```

Uma vez feito isso, você pode configurar o plugin React como de costume em um projeto Vite regular.

```ts {10}
import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    adonisjs({
      entrypoints: ["resources/js/app.js"],
    }),
    react(),
  ],
})
```

## Implantando ativos em um CDN
Depois de criar a compilação de produção usando o Vite, você pode carregar a saída agrupada em um servidor CDN para servir os arquivos.

No entanto, antes de fazer isso, você deve registrar a URL do seu servidor CDN com o Vite e o AdonisJS para que as URLs de saída dentro do arquivo `manifest.json` ou pedaços carregados lentamente apontem para o seu servidor CDN.

Você deve definir o `assetsUrl` dentro dos arquivos `vite.config.ts` e `config/vite.ts`.

```ts {11}
// vite.config.ts

import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    adonisjs({
      entrypoints: ['resources/js/app.js'],
      reloads: ['resources/views/**/*.edge'],
      assetsUrl: 'https://cdn.example.com/',
    }),
  ]
})
```

```ts {7}
// config/vite.ts

import { defineConfig } from '@adonisjs/vite'

const viteBackendConfig = defineConfig({
  buildDirectory: 'public/assets',
  assetsUrl: 'https://cdn.example.com/',
})

export default viteBackendConfig
```

## Conceitos avançados

### Modo Middleware

Com versões mais antigas do AdonisJS, o Vite era gerado como um processo separado e tinha seu próprio servidor de desenvolvimento.

Com a versão 3.x, o Vite é incorporado dentro do servidor de desenvolvimento do AdonisJS, e cada solicitação que deve ser tratada pelo Vite é enviada por proxy para ele por meio de um middleware do AdonisJS.

As vantagens do modo middleware são que podemos acessar diretamente a API de tempo de execução do Vite para executar a renderização do lado do servidor (SSR) e ter um único servidor de desenvolvimento para gerenciar.

Você pode ler mais sobre o modo middleware na [documentação do Vite](https://vitejs.dev/guide/ssr#setting-up-the-dev-server).

### Arquivo manifesto
O Vite gera o [arquivo manifesto](https://vitejs.dev/guide/backend-integration.html) junto com a compilação de produção dos seus ativos.

O arquivo manifesto contém as URLs para os ativos processados ​​pelo Vite, e o AdonisJS usa esse arquivo para criar URLs para ativos referenciados dentro dos modelos do Edge usando o auxiliar `asset` ou a tag `@vite`.
