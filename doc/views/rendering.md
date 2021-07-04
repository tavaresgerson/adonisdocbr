# Renderização

Você pode renderizar visualizações chamando o método `View.render`. O método aceita o caminho do modelo relativo ao diretório `views` e o 
objeto de dados para passar ao modelo, e sempre retorna um valor de string.

```ts
import View from '@ioc:Adonis/Core/View'

const html = await View.render('welcome', {
  greeting: 'Hello'
})
```

Durante as solicitações HTTP, é recomendável usar o objeto `ctx.view`, em vez da importação de nível superior.

O `ctx.view` é uma instância isolada do módulo `View` criado para aquela solicitação específica, ela compartilha os dados específicos da 
solicitação com os modelos.

```
Route.get('/', async ({ view }) => {
  const html = await view.render('welcome', {
    greeting: 'Hello'
  })
  
  return html
})
```

### Modos de Renderização
O Edge expõe a sincronização e a API assíncrona para renderizar visualizações. Nós recomendamos o uso da API assíncrona. No modo 
assíncrono, as operações de E/S realizadas pelo Edge não bloqueiam o loop de eventos do Node.js.

No exemplo a seguir:

* O arquivo `user.edge` é lido de forma síncrona do disco.
* Quaisquer referências internas para carregar parciais ou componentes também serão síncronas.
* O modelo não pode usar a palavra-chave `await`. Por exemplo: `{{ await getUser() }}` NÃO funcionará.

```ts
view.renderSync('user', {
  getUser: async () => {},
})
```

Considerando que, o método `view.render` está livre de todas as ressalvas da renderização síncrona.

```ts
await view.render('user', {
  getUser: async () => {},
})
```

### Discos
O Edge permite que você especifique vários diretórios raiz para localizar os modelos. Chamamos esse conceito de disco de montagem.

Montamos o diretório `./resources/views` como o disco padrão para você implicitamente. Se necessário, você também pode montar diretórios 
adicionais, cada um com um nome exclusivo.

Você pode escrever o seguinte código dentro de um arquivo pré-carregado.

```ts
// start/views.ts

import View from '@ioc:Adonis/Core/View'
import Application from '@ioc:Adonis/Core/Application'

View.mount('material', Application.resourcesPath('themes/material'))
View.mount('elegant', Application.resourcesPath('themes/elegant'))
```

Você pode renderizar as visualizações dos discos nomeados prefixando o nome do disco.

```ts
// renderiza themes/material/user.edge
view.render('material::user')

// renderiza themes/elegant/user.edge
view.render('elegant::user')
```

Da mesma forma, você pode prefixar o nome do disco ao incluir parciais ou componentes.

```edge
@include('material::header')

@component('material::button')
@end
```

### Templates na memória
O Edge permite que você registre modelos na memória sem criar nenhum arquivo no disco. Você pode achar isso útil 
quando quiser fornecer alguns modelos como parte de um pacote npm.

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

Agora, você pode renderizar o modelo diretamente ou usá-lo como um componente com o nome exato dado ao método `View.registerTemplate`.

```ts
@!component('uikit/button', {
  title: 'Signup',
  class: ['btn', 'btn-primary'],
  id: 'signup'
})
```

>
> Os modelos na memória têm preferência sobre os modelos no disco em caso de conflito de caminho.
>

### Renderizando string pura
O Edge também expõe a API para renderizar valores de string brutos diretamente como um modelo. No entanto, observe 
que as strings puras não desfrutam dos benefícios do armazenamento em cache do modelo, pois não estão associadas 
a um caminho exclusivo.

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

### Ver instâncias do renderizador
Views do Edge são renderizadas usando a classe `ViewRenderer`. Cada vez que você executa o método `View.render`, criamos uma 
nova instância de `ViewRenderer` e chamamos o método `render` nela.

Você também pode obter a instância do renderizador chamando o método `View.getRenderer()` e usar o método `share` para compartilhar
dados com a visualização.

```ts
import View from '@ioc:Adonis/Core/View'
const view = View.getRenderer()

view.share({ url: '/', user: auth.user })
await view.render('home')
```

O objeto `ctx.view` é uma instância da classe `ViewRenderer`.

### Cache
Compilar um modelo para uma função JavaScript é um processo demorado e, portanto, é recomendado armazenar em 
cache os templates compilados na produção.

Você pode controlar o cache de modelos usando a variável de ambiente `CACHE_VIEWS`. Apenas certifique-se 
de definir o valor como `true` no ambiente de produção.

```
CACHE_VIEWS=true
```

Todos os modelos são armazenados em cache na memória. Atualmente, não temos planos de oferecer suporte ao 
cache em disco. Desde então, o valor fornecido para os esforços é muito baixo.

O texto bruto não ocupa muito espaço e mesmo manter milhares de modelos pré-compilados na memória não deve ser um problema.
