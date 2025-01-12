---
summary: "AdonisJS é um framework web TypeScript-first para Node.js. Você pode usá-lo para criar um aplicativo web full-stack ou um servidor JSON API."
---

# Introdução

## O que é AdonisJS?

AdonisJS é um framework web TypeScript-first para Node.js. Você pode usá-lo para criar um aplicativo web full-stack ou um servidor JSON API.

No nível fundamental, AdonisJS [fornece estrutura para seus aplicativos](../getting_started/folder_structure.md), configura um [ambiente de desenvolvimento TypeScript perfeito](../concepts/typescript_build_process.md), configura [HMR](../concepts/hmr.md) para seu código de backend e oferece uma vasta coleção de pacotes bem mantidos e amplamente documentados.

Imaginamos que equipes usando o AdonisJS **gastem menos tempo** em decisões triviais como selecionar pacotes npm para cada recurso secundário, escrever código de colagem, debater sobre a estrutura de pasta perfeita e **gastem mais tempo** entregando recursos do mundo real essenciais para as necessidades do negócio.

### Agnóstico de frontend

O AdonisJS foca no backend e permite que você escolha a pilha de frontend de sua escolha.

Se você gosta de manter as coisas simples, combine o AdonisJS com um [mecanismo de modelo tradicional](../views-and-templates/introduction.md) para gerar HTML estático no servidor, crie uma API JSON para seu aplicativo frontend Vue/React ou use [Inertia](../views-and-templates/inertia.md) para fazer seu framework de frontend favorito trabalhar em perfeita harmonia.

O AdonisJS tem como objetivo fornecer baterias para criar um aplicativo de backend robusto do zero. Seja enviando e-mails, validando a entrada do usuário, executando operações CRUD ou autenticando usuários. Nós cuidamos de tudo.

### Moderno e seguro para tipos

O AdonisJS é construído sobre primitivos modernos do JavaScript. Usamos módulos ES, aliases de importação de subcaminhos do Node.js, SWC para executar a fonte TypeScript e Vite para agrupamento de ativos.

Além disso, o TypeScript desempenha um papel considerável ao projetar as APIs do framework. Por exemplo, o AdonisJS tem:

[Emissor de evento seguro para tipos](../digging_deeper/emitter.md#making-events-type-safe)
[Variáveis ​​de ambiente seguras para tipos](../getting_started/environment_variables.md)
[Biblioteca de validação segura para tipos](../basics/validation.md)

### Adotando o MVC

O AdonisJS adota o padrão de design MVC clássico. Você começa definindo as rotas usando a API JavaScript funcional, vincula controladores a elas e escreve lógica para manipular as solicitações HTTP dentro dos controladores.

```ts
// start/routes.ts

import router from '@adonisjs/core/services/router'
const PostsController = () => import('#controllers/posts_controller')

router.get('posts', [PostsController, 'index'])
```

Os controladores podem usar modelos para buscar dados do banco de dados e renderizar uma visualização (também conhecida como modelo) como resposta.

```ts
// app/controllers/posts_controller.ts

import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async index({ view }: HttpContext) {
    const posts = await Post.all()
    return view.render('pages/posts/list', { posts })
  }
}
```

Se você estiver construindo um servidor de API, poderá substituir a camada de visualização por uma resposta JSON. Mas o fluxo de manipulação e resposta às solicitações HTTP permanece o mesmo.

```ts
// app/controllers/posts_controller.ts

import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async index({ view }: HttpContext) {
    const posts = await Post.all()

    return view.render('pages/posts/list', { posts }) // [!code --]

    /** // [!code ++]
     * O array de posts será serializado para JSON // [!code ++]
     * automaticamente. // [!code ++]
     */ // [!code ++]
    return posts // [!code ++]
  }
}
```

## Suposições dos guias

A documentação do AdonisJS é escrita como um guia de referência, cobrindo o uso e a API de vários pacotes e módulos mantidos pela equipe principal.

**O guia não ensina como construir um aplicativo do zero**. Se você estiver procurando por um tutorial, recomendamos começar sua jornada com [Adocasts](https://adocasts.com/). Tom (o criador do Adocasts) criou alguns screencasts de alta qualidade, ajudando você a dar os primeiros passos com o AdonisJS.

Dito isso, a documentação abrange extensivamente o uso dos módulos disponíveis e o funcionamento interno do framework.

## Lançamentos recentes
A seguir está a lista de lançamentos recentes. [Clique aqui](./releases.md) para visualizar todos os lançamentos.
