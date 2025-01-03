# Renderização

Você pode renderizar visualizações chamando o método `View.render`. O método aceita o caminho do modelo relativo ao diretório `views` e o objeto de dados para passar para o modelo e sempre retorna um valor de string.

```ts
import View from '@ioc:Adonis/Core/View'

const html = await View.render('welcome', {
  greeting: 'Hello'
})
```

Durante as solicitações HTTP, é recomendado usar o objeto `ctx.view` em vez da importação de nível superior.

O `ctx.view` é uma instância isolada do módulo View criado para essa solicitação específica e compartilha os dados específicos da solicitação com os modelos.

```ts
Route.get('/', async ({ view }) => {
  const html = await view.render('welcome', {
    greeting: 'Hello'
  })
  
  return html
})
```

## Modos de renderização

O Edge expõe a API síncrona e assíncrona para renderizar visualizações. **Recomendamos usar a API assíncrona**. No modo assíncrono, as operações de E/S realizadas pelo Edge não bloqueiam o loop de eventos do Node.js.

No exemplo a seguir:

- O arquivo `user.edge` é lido de forma síncrona do disco.
- Quaisquer referências internas para carregar parciais ou componentes também serão síncronas.
- O modelo não pode usar a palavra-chave `await`. Por exemplo: <span v-pre>`{{ await getUser() }}`</span> NÃO funcionará.

```ts
view.renderSync('user', {
  getUser: async () => {},
})
```

Enquanto o método `view.render` é livre de todas as ressalvas da renderização síncrona.

```ts
await view.render('user', {
  getUser: async () => {},
})
```

## Discos

O Edge permite que você especifique **diretórios raiz múltiplos** para encontrar os modelos. Chamamos esse conceito de disco de montagem.

Montamos o diretório `./resources/views` como o disco padrão para você implicitamente. No entanto, se necessário, você também pode montar diretórios adicionais, cada um com um nome exclusivo.

Você pode escrever o seguinte código dentro de um [arquivo de pré-carregamento](link-to-preloading-files).

```ts
// start/views.ts

import View from '@ioc:Adonis/Core/View'
import Application from '@ioc:Adonis/Core/Application'

View.mount('material', Application.resourcesPath('themes/material'))
View.mount('elegant', Application.resourcesPath('themes/elegant'))
```

Você pode renderizar as visualizações dos discos nomeados prefixando o nome do disco.

```ts
// renders themes/material/user.edge
view.render('material::user')

// renders themes/elegant/user.edge
view.render('elegant::user')
```

Da mesma forma, você pode prefixar o nome do disco ao incluir parciais ou componentes.

```edge
@include('material::header')

@component('material::button')
@end
```

## Modelos na memória

O Edge permite que você registre modelos na memória sem criar nenhum arquivo no disco. Você pode achar isso útil quando quiser fornecer alguns modelos como parte de um pacote npm.

```ts
import View from '@ioc:Adonis/Core/View'

View.registerTemplate('uikit/button', {
  template: `
    <button {{ $props.serializeExcept(['title']) }}>
      {{ title }}
    </button>
  `,
})
```

Você pode renderizar o modelo diretamente ou usá-lo como um componente com o nome exato dado ao método `View.registerTemplate`.

```edge
@!component('uikit/button', {
  title: 'Signup',
  class: ['btn', 'btn-primary'],
  id: 'signup'
})
```

::: info NOTA
Os modelos na memória têm preferência sobre os modelos no disco em caso de conflito de caminho.
:::

## Renderizando string bruta

O Edge também expõe a API para renderizar valores de string bruta diretamente como um modelo. No entanto, observe que strings brutas não aproveitam os benefícios do cache de modelo, pois não estão associadas a um caminho exclusivo.

```ts
await View.renderRaw(
  `
  <p> Hello {{ username }} </p>
`,
  {
    username: 'virk',
  }
)
```

Use o método `renderRawSync` para renderizar a string bruta de forma síncrona.

```ts
View.renderRawSync(
  `
  <p> Hello {{ username }} </p>
`,
  {
    username: 'virk',
  }
)
```

## Instâncias do renderizador de visualização

As visualizações no Edge são renderizadas usando a classe [ViewRenderer](https://github.com/edge-js/edge/blob/develop/src/Renderer/index.ts). Portanto, toda vez que você executa o método `View.render`, criamos uma nova instância do `ViewRenderer` e, em seguida, chamamos o método `render` nela.

Você também pode obter a instância do renderizador chamando o método `View.getRenderer()` e usar o método `share` para compartilhar dados com a visualização.

```ts
import View from '@ioc:Adonis/Core/View'
const view = View.getRenderer()

view.share({ url: '/', user: auth.user })
await view.render('home')
```

O objeto `ctx.view` é uma instância da classe `ViewRenderer`.

## Cache

Compilar um modelo para uma função JavaScript é um processo demorado e, portanto, é recomendável armazenar em cache os modelos compilados na produção.

Você pode controlar o cache do modelo usando a variável de ambiente `CACHE_VIEWS`. Apenas certifique-se de definir o valor como `true` no ambiente de produção.

```sh
CACHE_VIEWS=true
```

Todos os modelos são armazenados em cache na memória. Atualmente, não temos planos para oferecer suporte ao cache em disco, pois o valor fornecido para os esforços é muito baixo.

O texto bruto não ocupa muito espaço e mesmo manter milhares de modelos pré-compilados na memória não deve ser um problema.
