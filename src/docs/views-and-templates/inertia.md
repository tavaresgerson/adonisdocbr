---
summary: Aprenda a usar o Inertia com o AdonisJS para criar aplicativos renderizados pelo servidor com seu framework de frontend favorito.
---

# Inertia

[Inertia](https://inertiajs.com/) é uma maneira independente de framework para criar aplicativos de página única sem muita da complexidade dos SPAs modernos.

É um ótimo meio-termo entre aplicativos tradicionais renderizados pelo servidor (com mecanismos de template) e SPAs modernos (com roteamento do lado do cliente e gerenciamento de estado).

Usar o Inertia permitirá que você crie um SPA com seu framework de frontend favorito (Vue.js, React, Svelte ou Solid.js) sem criar uma API separada.

:::codegroup

```ts
// title: app/controllers/users_controller.ts
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ inertia }: HttpContext) {
    const users = await User.all()

    return inertia.render('users/index', { users })
  }
}
```


```vue
// title: inertia/pages/users/index.vue
<script setup lang="ts">
import { Link, Head } from '@inertiajs/vue3'

defineProps<{
  users: SerializedUser[]
}>()
</script>

<template>
  <Head title="Users" />

  <div v-for="user in users" :key="user.id">
    <Link :href="`/users/${user.id}`">
      {{ user.name }}
    </Link>
    <div>{{ user.email }}</div>
  </div>
</template>
```

:::


## Instalação

:::note
Você está iniciando um novo projeto e quer usar o Inertia? Confira o [Inertia starter kit](https://docs.adonisjs.com/guides/getting-started/installation#inertia-starter-kit).
:::

Instale o pacote do registro npm executando:

:::codegroup

```sh
// title: npm
npm i @adonisjs/inertia
```

:::

Uma vez feito isso, execute o seguinte comando para configurar o pacote.

```sh
node ace configure @adonisjs/inertia
```

::: details Veja os passos realizados pelo comando configure

1. Registra o seguinte provedor de serviço e comando dentro do arquivo `adonisrc.ts`.

```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/inertia/inertia_provider')
      ]
    }
    ```
2. Registra o seguinte middleware dentro do arquivo `start/kernel.ts`

```ts
   router.use([() => import('@adonisjs/inertia/inertia_middleware')])
   ```

3. Crie o arquivo `config/inertia.ts`.

4. Copie alguns stubs em seu aplicativo para ajudar você a começar rapidamente. Cada arquivo copiado é adaptado ao framework frontend selecionado anteriormente.

  1. Crie um arquivo `./resources/views/inertia_layout.edge` que será usado para renderizar a página HTML usada para inicializar o Inertia.

  2. Crie um arquivo `./inertia/css/app.css` com o conteúdo necessário para estilizar a visualização `inertia_layout.edge`.

  3. Crie um arquivo `./inertia/tsconfig.json` para diferenciar entre a configuração TypeScript do lado do servidor e do cliente.

  4. Crie um `./inertia/app/app.ts` para inicializar o Inertia e sua estrutura de front-end.

  5. Crie um arquivo `./inertia/pages/home.{tsx|vue|svelte}` para renderizar a página inicial do seu aplicativo.

  6. Crie os arquivos `./inertia/pages/server_error.{tsx|vue|svelte}` e `./inertia/pages/not_found.{tsx|vue|svelte}` para renderizar as páginas de erro.

  7. Adicione o plugin vite correto para compilar seu framework frontend no arquivo `vite.config.ts`.

  8. Adicione uma rota burra em `/` no seu arquivo `start/routes.ts` para renderizar a home page com o Inertia como exemplo.
 
5. Instalar pacotes com base no framework de frontend selecionado.

:::

Uma vez feito, você deve estar pronto para usar o Inertia em seu aplicativo AdonisJS. Inicie seu servidor de desenvolvimento e visite `localhost:3333` para ver a página inicial renderizada usando o Inertia com seu framework de frontend selecionado.

:::note
**Leia a [documentação oficial do Inertia](https://inertiajs.com/)**.

O Inertia é uma biblioteca independente de backend. Acabamos de criar um adaptador para fazê-lo funcionar com o AdonisJS. Você deve estar familiarizado com os conceitos do Inertia antes de ler esta documentação.

**Abordaremos apenas as partes específicas do AdonisJS nesta documentação.**
:::

## Ponto de entrada do lado do cliente

Se você usou o comando `configure` ou `add`, o pacote terá criado um arquivo de ponto de entrada em `inertia/app/app.ts` para que você possa pular esta etapa.

Basicamente, este arquivo será o ponto de entrada principal para seu aplicativo de frontend e será usado para inicializar o Inertia e seu framework de frontend. Este arquivo deve ser o ponto de entrada carregado pelo seu modelo raiz do Edge com a tag `@vite`.

:::codegroup

```ts
// title: Vue
import { createApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  title: (title) => {{ `${title} - ${appName}` }},
  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue'),
    )
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el)
  },
})
```

```tsx
// title: React
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
});
```

```ts
// title: Svelte
import { createInertiaApp } from '@inertiajs/svelte'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.svelte`,
      import.meta.glob('./pages/**/*.svelte'),
    )
  },

  setup({ el, App, props }) {
    new App({ target: el, props })
  },
})
```

```ts
// title: Solid
import { render } from 'solid-js/web'
import { createInertiaApp } from 'inertia-adapter-solid'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }) {
    render(() => <App {...props} />, el)
  },
})
```
:::

A função deste arquivo é criar um aplicativo Inertia e resolver o componente de página. O componente de página que você escreve ao usar `inertia.render` será passado para a função `resolve` e a função desta função é retornar o componente que precisa ser renderizado.

## Renderizando páginas

Ao configurar seu pacote, um `inertia_middleware` foi registrado dentro do arquivo `start/kernel.ts`. Este middleware é responsável por configurar o objeto `inertia` no [`HttpContext`](../concepts/http_context.md).

Para renderizar uma visualização usando Inertia, use o método `inertia.render`. O método aceita o nome da visualização e os dados a serem passados ​​para o componente como props.

```ts
// title: app/controllers/home_controller.ts
export default class HomeController {
  async index({ inertia }: HttpContext) {
    // highlight-start
    return inertia.render('home', { user: { name: 'julien' } })
    // highlight-end
  }
}
```

Você vê o `home` passado para o método `inertia.render`? Deve ser o caminho para o arquivo do componente relativo ao diretório `inertia/pages`. Renderizamos o arquivo `inertia/pages/home.(vue,tsx)` aqui.

Seu componente frontend receberá o objeto `user` como prop:

:::codegroup

```vue
// title: Vue
<script setup lang="ts">
defineProps<{
  user: { name: string }
}>()
</script>

<template>
  <p>Hello {{ user.name }}</p>
</template>
```

```tsx
// title: React
export default function Home(props: { user: { name: string } }) {
  return <p>Hello {props.user.name}</p>
}
```

```svelte
// title: Svelte
<script lang="ts">
export let user: { name: string }
</script>

<Layout>
  <p>Hello {user.name}</p>
</Layout>
```

```jsx
// title: Solid
export default function Home(props: { user: { name: string } }) {
  return <p>Hello {props.user.name}</p>
}
```

:::

Simples assim.

:::warning
Ao passar dados para o frontend, tudo é serializado para JSON. Não espere passar instâncias de modelos, datas ou outros objetos complexos.
:::

### Modelo Root Edge

O modelo Root é um modelo Edge regular que será carregado na primeira visita à página do seu aplicativo. É o lugar onde você deve incluir seus arquivos CSS e Javascript e também onde você deve incluir a tag `@inertia`. Um modelo raiz típico se parece com isso:

:::codegroup

```edge
// title: Vue
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title inertia>AdonisJS x Inertia</title>

  @inertiaHead()
  @vite(['inertia/app/app.ts', `inertia/pages/${page.component}.vue`])
</head>

<body>
  @inertia()
</body>

</html>
```

```edge
// title: React
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title inertia>AdonisJS x Inertia</title>

  @inertiaHead()
  @viteReactRefresh()
  @vite(['inertia/app/app.tsx', `inertia/pages/${page.component}.tsx`])
</head>

<body>
  @inertia()
</body>

</html>
```

```edge
// title: Svelte
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title inertia>AdonisJS x Inertia</title>

  @inertiaHead()
  @vite(['inertia/app/app.ts', `inertia/pages/${page.component}.svelte`])
</head>

<body>
  @inertia()
</body>

</html>
```

```edge
// title: Solid
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title inertia>AdonisJS x Inertia</title>

  @inertiaHead()
  @vite(['inertia/app/app.tsx', `inertia/pages/${page.component}.tsx`])
</head>

<body>
  @inertia()
</body>

</html>
```

:::

Você pode configurar o caminho do modelo raiz no arquivo `config/inertia.ts`. Por padrão, ele assume que seu modelo está em `resources/views/inertia_layout.edge`.

```ts
import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  // The path to the root template relative 
  // to the `resources/views` directory
  rootView: 'app_root', 
})
```

Se necessário, você pode passar uma função para a prop `rootView` para decidir dinamicamente qual modelo raiz deve ser usado.

```ts
import { defineConfig } from '@adonisjs/inertia'
import type { HttpContext } from '@adonisjs/core/http'

export default defineConfig({
  rootView: ({ request }: HttpContext) => {
    if (request.url().startsWith('/admin')) {
      return 'admin_root'
    }

    return 'app_root'
  }
})
```

### Dados do modelo raiz

Você pode querer compartilhar dados com seu modelo raiz do Edge. Por exemplo, para adicionar um metatítulo ou tags de gráfico aberto. Você pode fazer isso usando o terceiro argumento do método `inertia.render`:

```ts
// title: app/controllers/posts_controller.ts
export default class PostsController {
  async index({ inertia }: HttpContext) {
    return inertia.render('posts/details', post, {
      // highlight-start
      title: post.title,
      description: post.description
      // highlight-end
    })
  }
}
```

O `title` e a `description` agora estarão disponíveis para o modelo raiz do Edge:

```edge
// title: resources/views/root.edge
<html>
  <title>{{ title }}</title>
  <meta name="description" content="{{ description }}">

  <body>
    @inertia()
  </body>
</html
```

## Redirecionamentos

É como você deve fazer no AdonisJS:

```ts
export default class UsersController {
  async store({ response }: HttpContext) {
    await User.create(request.body())

    // 👇 You can use standard AdonisJS redirections
    return response.redirect().toRoute('users.index')
  }

  async externalRedirect({ inertia }: HttpContext) {
    // 👇 Or use the inertia.location for external redirects
    return inertia.location('https://adonisjs.com')
  }
}
```

Consulte a [documentação oficial](https://inertiajs.com/redirects) para obter mais informações.

## Compartilhando dados com todas as visualizações

Às vezes, você pode precisar compartilhar os mesmos dados em várias visualizações. Por exemplo, estamos compartilhando as informações atuais do usuário com todas as visualizações. Ter que fazer isso para cada controlador pode se tornar tedioso. Felizmente, temos duas soluções para esse problema.

### `sharedData`

No arquivo `config/inertia.ts`, você pode definir um objeto `sharedData`. Este objeto permite que você defina dados que devem ser compartilhados com todas as visualizações.

```ts
import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  sharedData: {
    // 👇 This will be available in all views
    appName: 'My App' ,
    // 👇 Scoped to the current request
    user: (ctx) => ctx.auth?.user, 
    // 👇 Scoped to the current request
    errors: (ctx) => ctx.session.flashMessages.get('errors'),
  },
})
```

### Compartilhar de um middleware

Às vezes, compartilhar dados de um middleware em vez do arquivo `config/inertia.ts` pode ser mais conveniente. Você pode fazer isso usando o método `inertia.share`:

```ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class MyMiddleware {
  async handle({ inertia, auth }: HttpContext, next: NextFn) {
    inertia.share({
      appName: 'My App',
      user: (ctx) => ctx.auth?.user
    })
  }
}
```

## Recargas parciais e avaliação de dados Lazy

Primeiro, leia a [documentação oficial](https://inertiajs.com/partial-reloads) para entender o que são recargas parciais e como elas funcionam.

Sobre avaliação de dados preguiçosa, aqui está como funciona no AdonisJS:

```ts
export default class UsersController {
  async index({ inertia }: HttpContext) {
    return inertia.render('users/index', {
      // ALWAYS included on first visit.
      // OPTIONALLY included on partial reloads.
      // ALWAYS evaluated
      users: await User.all(),

      // ALWAYS included on first visit.
      // OPTIONALLY included on partial reloads.
      // ONLY evaluated when needed
      users: () => User.all(),

      // NEVER included on first visit.
      // OPTIONALLY included on partial reloads.
      // ONLY evaluated when needed
      users: inertia.lazy(() => User.all())
    }),
  }
}
```

## Compartilhamento de tipos

Normalmente, você desejará compartilhar os tipos de dados que está passando para os componentes das páginas do seu frontend. Uma maneira simples de fazer isso é usar o tipo `InferPageProps`.

:::codegroup

```ts
// title: app/controllers/users_controller.ts
export class UsersController {
  index() {
    return inertia.render('users/index', {
      users: [
        { id: 1, name: 'julien' },
        { id: 2, name: 'virk' },
        { id: 3, name: 'romain' },
      ]
    })
  }
}
```

```tsx
// title: inertia/pages/users/index.tsx
import { InferPageProps } from '@adonisjs/inertia/types'
import type { UsersController } from '../../controllers/users_controller.ts'

export function UsersPage(
  // 👇 It will be correctly typed based
  // on what you passed to inertia.render
  // in your controller
  props: InferPageProps<UsersController, 'index'>
) {
  return (
    // ...
  )
}
```

:::

Se estiver usando o Vue, você terá que definir manualmente cada propriedade no seu `defineProps`. Esta é uma limitação irritante do Vue, veja [este problema](https://github.com/vitejs/vite-plugin-vue/issues/167) para mais informações.

```vue
<script setup lang="ts">
import { InferPageProps } from '@adonisjs/inertia'

defineProps<{
  // 👇 You will have to manually define each prop
  users: InferPageProps<UsersController, 'index'>['users'],
  posts: InferPageProps<PostsController, 'index'>['posts'],
}>()

</script>
```


### Diretivas de referência

Como seu aplicativo Inertia é um projeto TypeScript separado (com seu próprio `tsconfig.json`), você precisará ajudar o TypeScript a entender alguns tipos. Muitos dos nossos pacotes oficiais usam [aumento de módulo](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) para adicionar certos tipos ao seu projeto AdonisJS.

Por exemplo, a propriedade `auth` no `HttpContext` e sua tipagem só estarão disponíveis quando você importar `@adonisjs/auth/initialize_auth_middleware` para seu projeto. Agora, o problema é que não importamos esse módulo em nosso projeto Inertia, então se você tentar inferir as props de página de um controlador que usa `auth`, provavelmente receberá um erro TypeScript ou um tipo inválido.

Para resolver esse problema, você pode usar [diretivas de referência](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-path-) para ajudar o TypeScript a entender certos tipos. Para fazer isso, você precisa adicionar a seguinte linha no seu arquivo `inertia/app/app.ts`:

```ts
/// <reference path="../../adonisrc.ts" />
```

Dependendo dos tipos que você usa, pode ser necessário adicionar outras diretivas de referência, como referências a certos arquivos de configuração que também usam aumento de módulo.

```ts
/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/ally.ts" />
/// <reference path="../../config/auth.ts" />
```

### Serialização em nível de tipo

Uma coisa importante a saber sobre `InferPageProps` é que ele "serializará no nível de tipo" os dados que você passar. Por exemplo, se você passar um objeto `Date` para `inertia.render`, o tipo resultante de `InferPageProps` será `string`:

:::codegroup

```ts
// title: app/controllers/users_controller.ts
export default class UsersController {
  async index({ inertia }: HttpContext) {
    const users = [
      { id: 1, name: 'John Doe', createdAt: new Date() }
    ]

    return inertia.render('users/index', { users })
  }
}
```

```tsx
// title: inertia/pages/users/index.tsx
import type { InferPageProps } from '@adonisjs/inertia/types'

export function UsersPage(
  props: InferPageProps<UsersController, 'index'>
) {
  props.users
  //     ^? { id: number, name: string, createdAt: string }[]
}
```

:::

Isso faz todo o sentido, pois as datas são serializadas para string quando são passadas pela rede em JSON.

### Serialização do modelo

Mantendo o último ponto em mente, outra coisa importante a saber é que se você passar um modelo AdonisJS para `inertia.render`, então o tipo resultante de `InferPageProps` será um `ModelObject`: um tipo que contém quase nenhuma informação. Isso pode ser problemático. Para resolver esse problema, você tem várias opções:

- Converta seu modelo em um objeto simples antes de passá-lo para `inertia.render`:
- Use um sistema DTO (Data Transfer Object) para transformar seus modelos em objetos simples antes de passá-los para `inertia.render`.

:::codegroup

```ts
// title: Casting
class UsersController {
  async edit({ inertia, params }: HttpContext) {
    const user = users.serialize() as {
        id: number
        name: string 
    }

    return inertia.render('user/edit', { user })
  }
}
```

```ts
// title: DTOs
class UserDto {
  constructor(private user: User) {}

  toJson() {
    return {
      id: this.user.id,
      name: this.user.name
    }
  }
}

class UsersController {
  async edit({ inertia, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return inertia.render('user/edit', { user: new UserDto(user).toJson() })
  }
}
```

:::

Agora você terá tipos precisos em seu componente frontend.

### Props compartilhados

Para ter os tipos de seus [dados compartilhados](#sharing-data-with-all-views) em seus componentes, certifique-se de ter executado o aumento do módulo em seu arquivo `config/inertia.ts` da seguinte forma:

```ts
// file: config/inertia.ts
const inertiaConfig = defineConfig({
  sharedData: {
    appName: 'My App',
  },
});

export default inertiaConfig;

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {
    // If necessary, you can also manually add some shared props,
    // such as those shared from a middleware for example
    propsSharedFromAMiddleware: number;
  }
}
```

Além disso, certifique-se de adicionar esta [diretiva de referência](#reference-directives) em seu arquivo `inertia/app/app.ts`:

```ts
/// <reference path="../../config/inertia.ts" />
```

Depois de fazer isso, você terá acesso aos seus props compartilhados em seus componentes via `InferPageProps`. `InferPageProps` conterá os tipos de seus props compartilhados e os props passados ​​por `inertia.render`:

```tsx
// file: inertia/pages/users/index.tsx

import type { InferPageProps } from '@adonisjs/inertia/types'

export function UsersPage(
  props: InferPageProps<UsersController, 'index'>
) {
  props.appName
  //     ^? string
  props.propsSharedFromAMiddleware
  //     ^? number
}
```

Se necessário, você pode acessar apenas os tipos de seus props compartilhados por meio do tipo `SharedProps`:

```tsx
import type { SharedProps } from '@adonisjs/inertia/types'

const page = usePage<SharedProps>()
```

## CSRF

Se você habilitou [proteção CSRF](../security/securing_ssr_applications.md#csrf-protection) para seu aplicativo, habilite a opção `enableXsrfCookie` no arquivo `config/shield.ts`.

Habilitar esta opção garantirá que o cookie `XSRF-TOKEN` seja definido no lado do cliente e enviado de volta ao servidor com cada solicitação.

Nenhuma configuração adicional é necessária para fazer o Inertia funcionar com proteção CSRF.

## Controle de versão de ativos

Ao reimplantar seu aplicativo, seus usuários devem sempre obter a versão mais recente de seus ativos do lado do cliente. É algo suportado de imediato pelo protocolo Inertia e AdonisJS.

Por padrão, o pacote `@adonisjs/inertia` calculará um hash para o arquivo `public/assets/manifest.json` e o usará como a versão de seus ativos.

Se quiser ajustar esse comportamento, você pode editar o arquivo `config/inertia.ts`. A prop `version` define a versão de seus ativos e pode ser uma string ou uma função.

```ts
import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  version: 'v1'
})
```

Leia a [documentação oficial](https://inertiajs.com/asset-versioning) para mais informações.

## SSR

### Habilitando SSR

[Inertia Starter Kit](../getting_started/installation.md#starter-kits) vem com suporte de renderização do lado do servidor (SSR) pronto para uso. Portanto, certifique-se de usá-lo se quiser habilitar SSR para seu aplicativo.

Se você iniciou seu aplicativo sem habilitar SSR, você sempre pode habilitá-lo mais tarde seguindo as seguintes etapas:

#### Adicionando um ponto de entrada do servidor

Precisamos adicionar um ponto de entrada do servidor que seja super semelhante ao ponto de entrada do cliente. Este ponto de entrada renderizará a visita da primeira página no servidor e não no navegador.

Você deve criar um `inertia/app/ssr.ts` que exporte por padrão uma função como esta:

:::codegroup

```ts
// title: Vue 
import { createInertiaApp } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h, type DefineComponent } from 'vue'

export default function render(page) {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue')
      return pages[`../pages/${name}.vue`]()
    },

    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) }).use(plugin)
    },
  })
}
```

```tsx
// title: React
import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'

export default function render(page) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
      return pages[`./pages/${name}.tsx`]
    },
    setup: ({ App, props }) => <App {...props} />,
  })
}
```

```ts
// title: Svelte
import { createInertiaApp } from '@inertiajs/svelte'
import createServer from '@inertiajs/svelte/server'

export default function render(page) {
  return createInertiaApp({
    page,
    resolve: name => {
      const pages = import.meta.glob('./pages/**/*.svelte', { eager: true })
      return pages[`./pages/${name}.svelte`]
    },
  })
}
```

```tsx
// title: Solid
import { hydrate } from 'solid-js/web'
import { createInertiaApp } from 'inertia-adapter-solid'

export default function render(page: any) {
  return createInertiaApp({
    page,
    resolve: (name) => {
      const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
      return pages[`./pages/${name}.tsx`]
    },
    setup({ el, App, props }) {
      hydrate(() => <App {...props} />, el)
    },
  })
}
```
:::

#### Atualize o arquivo de configuração

Vá até o arquivo `config/inertia.ts` e atualize a prop `ssr` para habilitá-lo. Além disso, aponte para o ponto de entrada do seu servidor se você usar um caminho diferente.

```ts
import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  // ...
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.ts'
  }
})
```

#### Atualize a configuração do Vite

Primeiro, certifique-se de ter registrado o plugin `inertia` vite. Uma vez feito isso, você deve atualizar o caminho para o ponto de entrada do servidor no arquivo `vite.config.ts` se você usar um caminho diferente.

```ts
import { defineConfig } from 'vite'
import inertia from '@adonisjs/inertia/client'

export default defineConfig({
  plugins: [
    inertia({
      ssr: {
        enabled: true,
        entrypoint: 'inertia/app/ssr.ts'
      }
    })
  ]
})
```

Agora você deve conseguir renderizar a visita da primeira página no servidor e então continuar com a renderização do lado do cliente.

### Lista de permissões SSR

Ao usar SSR, você pode querer não renderizar todos os seus componentes do lado do servidor. Por exemplo, você está construindo um painel de administração controlado por autenticação, então essas rotas não têm razão para serem renderizadas no servidor. Mas no mesmo aplicativo, você pode ter uma landing page que pode se beneficiar do SSR para melhorar o SEO.

Então, você pode adicionar as páginas que devem ser renderizadas no servidor no arquivo `config/inertia.ts`.

```ts
import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  ssr: {
    enabled: true,
    pages: ['home']
  }
})
```

Você também pode passar uma função para a prop `pages` para decidir dinamicamente quais páginas devem ser renderizadas no servidor.

```ts
import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  ssr: {
    enabled: true,
    pages: (ctx, page) => !page.startsWith('admin')
  }
})
```

## Testes

Existem várias maneiras de testar seu código frontend:

[Cliente do navegador](https://docs.adonisjs.com/guides/browser-tests), uma integração perfeita entre Japa e Playwright.
[Vitest](https://vitest.dev).

E, finalmente, você também pode testar seus endpoints do Inertia para garantir que eles retornem os dados corretos. Para isso, temos alguns auxiliares de teste disponíveis no Japa.

Primeiro, certifique-se de configurar os plugins `inertiaApiClient` e `apiClient` no seu arquivo `test/bootsrap.ts` se você ainda não fez isso:

```ts
// title: tests/bootstrap.ts
import { assert } from '@japa/assert'
import app from '@adonisjs/core/services/app'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
// highlight-start
import { apiClient } from '@japa/api-client'
import { inertiaApiClient } from '@adonisjs/inertia/plugins/api_client'
// highlight-end

export const plugins: Config['plugins'] = [
  assert(), 
  pluginAdonisJS(app),
  // highlight-start
  apiClient(),
  inertiaApiClient(app)
  // highlight-end
]
```

Em seguida, podemos solicitar nosso endpoint Inertia usando `withInertia()` para garantir que os dados sejam retornados corretamente no formato JSON.

```ts
test('returns correct data', async ({ client }) => {
  const response = await client.get('/home').withInertia()

  response.assertStatus(200)
  response.assertInertiaComponent('home/main')
  response.assertInertiaProps({ user: { name: 'julien' } })
})
```

Vamos dar uma olhada nas várias asserções disponíveis para testar seus endpoints:

### `withInertia()`

Adiciona o cabeçalho `X-Inertia` à solicitação. Ele garante que os dados sejam retornados corretamente no formato JSON.

### `assertInertiaComponent()`

Verifica se o componente retornado pelo servidor é o esperado.

```ts
test('returns correct data', async ({ client }) => {
  const response = await client.get('/home').withInertia()

  response.assertInertiaComponent('home/main')
})
```

### `assertInertiaProps()`

Verifica se os props retornados pelo servidor são exatamente aqueles passados ​​como parâmetros.

```ts
test('returns correct data', async ({ client }) => {
  const response = await client.get('/home').withInertia()

  response.assertInertiaProps({ user: { name: 'julien' } })
})
```

### `assertInertiaPropsContains()`

Verifica se os props retornados pelo servidor contêm alguns dos props passados ​​como parâmetros. Ele usa [`containsSubset`](https://japa.dev/docs/plugins/assert#containssubset) por baixo dos panos.

```ts
test('returns correct data', async ({ client }) => {
  const response = await client.get('/home').withInertia()

  response.assertInertiaPropsContains({ user: { name: 'julien' } })
})
```

### Propriedades adicionais

Além disso, você pode acessar as seguintes propriedades em `ApiResponse`:

```ts
test('returns correct data', async ({ client }) => {
  const response = await client.get('/home').withInertia()

  // 👇 The component returned by the server
  console.log(response.inertiaComponent) 

  // 👇 The props returned by the server
  console.log(response.inertiaProps)
})
```

## FAQ

### Por que meu servidor está constantemente recarregando ao atualizar meu código frontend?

Digamos que você esteja usando React. Toda vez que você atualiza seu código de frontend, o servidor será recarregado e o navegador será atualizado. Você não está se beneficiando do recurso de substituição de módulo a quente (HMR).

Você precisa excluir `inertia/**/*` do seu arquivo raiz `tsconfig.json` para fazê-lo funcionar.

```jsonc
{
  "compilerOptions": {
    // ...
  },
  "exclude": ["inertia/**/*"]
}
```

Porque o processo AdonisJS responsável por reiniciar o servidor está monitorando os arquivos incluídos no arquivo `tsconfig.json`.

### Por que minha compilação de produção não está funcionando?

Se você estiver enfrentando um erro como este:

```
X [ERROR] Failed to load url inertia/app/ssr.ts (resolved id: inertia/app/ssr.ts). Does the file exist?
```

Um problema comum é que você simplesmente esqueceu de definir `NODE_ENV=production` ao executar sua compilação de produção.

```shell
NODE_ENV=production node build/server.js
```

### `Top-level await is not available...`

Se você estiver enfrentando um erro como este:

```
X [ERROR] Top-level await is not available in the configured target environment ("chrome87", "edge88", "es2020", "firefox78", "safari14" + 2 overrides)

    node_modules/@adonisjs/core/build/services/hash.js:15:0:
      15 │ await app.booted(async () => {
         ╵ ~~~~~
```

Então é altamente provável que você esteja importando código de backend para seu frontend. Olhando mais de perto o erro, que é gerado pelo Vite, vemos que ele está tentando compilar código de `node_modules/@adonisjs/core`. Então, isso significa que nosso código de backend acabará no pacote frontend. Provavelmente não é isso que você quer.

Geralmente, esse erro ocorre quando você tenta compartilhar um tipo com seu frontend. Se é isso que você está tentando fazer, certifique-se de sempre importar esse tipo somente via `import type` em vez de `import`:

```ts
// ✅ Correct
import type { User } from '#models/user'

// ❌ Incorrect
import { User } from '#models/user'
``
