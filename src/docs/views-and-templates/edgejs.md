---
summary: Aprenda a usar o Edge.js para criação de modelos no AdonisJS
---

# EdgeJS

O Edge é um mecanismo de modelo **simples**, **moderno** e com **baterias incluídas** criado e mantido pela equipe principal do AdonisJS para Node.js. O Edge é semelhante a escrever JavaScript. Se você conhece JavaScript, conhece o Edge.

::: info NOTA
A documentação do Edge está disponível em [https://edgejs.dev](https://edgejs.dev)
:::

## Instalação

Instale e configure o Edge usando o seguinte comando.

```sh
node ace add edge
```

::: details Veja as etapas executadas pelo comando add

1. Instala o pacote `edge.js` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

    ```ts
    {
      providers: [
        // ...outros provedores
        () => import('@adonisjs/core/providers/edge_provider')
      ]
    }
    ```

:::

## Renderizando seu primeiro modelo

Depois que a configuração for concluída, você pode usar o Edge para renderizar modelos. Vamos criar um arquivo `welcome.edge` dentro do diretório `resources/views`.

```sh
node ace make:view welcome
```

Abra o arquivo recém-criado e escreva a seguinte marcação dentro dele.

```edge
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <h1>
    Hello world from {{ request.url() }} endpoint
  </h1>
</body>
</html>
```

Finalmente, vamos registrar uma rota para renderizar o modelo.

```ts
import router from '@adonisjs/core/services/router'

router.get('/', async ({ view }) => {
  return view.render('welcome')
})
```

Você também pode usar o método `router.on().render` para renderizar um modelo sem atribuir um retorno de chamada à rota.

```ts
router.on('/').render('welcome')
```

### Passando dados para o modelo

Você pode passar dados para o modelo passando um objeto como o segundo argumento para o método `view.render`.

```ts
router.get('/', async ({ view }) => {
  return view.render('welcome', { username: 'romainlanz' })
})
```

## Configurando o Edge
Você pode usar plugins do Edge ou adicionar ajudantes globais ao Edge criando um [arquivo de pré-carregamento](../concepts/adonisrc_file.md#preloads) dentro do diretório `start`.

```sh
node ace make:preload view
```

```ts
// start/view.ts

import edge from 'edge.js'
import env from '#start/env'
import { edgeIconify } from 'edge-iconify'

/**
 * Registre um plugin
 */
edge.use(edgeIconify)

/**
 * Defina uma propriedade global
 */
edge.global('appUrl', env.get('APP_URL'))
```

## Ajudantes globais

Consulte o [guia de referência de ajudantes do Edge](../references/edge.md) para ver a lista de ajudantes contribuídos pelo AdonisJS.

## Saiba mais

* [Documentação do Edge.js](https://edgejs.dev)
* [Componentes](https://edgejs.dev/docs/components/introduction)
* [Ícones SVG](https://edgejs.dev/docs/edge-iconify)
* [Série Edge do Adocasts](https://adocasts.com/topics/edge)
