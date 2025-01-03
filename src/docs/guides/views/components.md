# Componentes

O sistema de componentes do Edge é altamente inspirado em frameworks de frontend como Vue ou Svelte. Ele pega emprestado o conceito de **reusabilidade**, **estado isolado**, **props** e **slots** deles.

Observe que o Edge é um mecanismo de modelo de backend, e não podemos replicar alguns dos princípios do ecossistema de frontend com o Edge. Ele inclui.

- **Reatividade**: Não há conceito de reatividade no backend. Você gera o HTML e o envia pela rede.
- **CSS com escopo**: O Edge não é compilado usando ferramentas de construção de frontend como Webpack e, portanto, não se preocupa em compilar e extrair CSS de componentes. Você deve usar ferramentas de frontend existentes para isso.

## Criando um componente

Os componentes são representados usando os arquivos de modelo regulares do Edge. Por exemplo, você pode criar um arquivo chamado `button.edge` com a seguinte marcação.

```edge
<button type="{{ type }}">
  {{ text }}
</button>
```

E então usá-lo como um componente dentro de outros modelos.

```edge
@!component('button', {
  text: 'Login',
  type: 'submit'
})
```

A tag `@component` aceita um total de dois argumentos. O primeiro é o caminho do componente (relativo ao diretório de visualizações) e o segundo é o estado do componente (props).

::: info NOTA
Os componentes não têm acesso ao estado do modelo pai. No entanto, eles podem acessar os modelos [globals]() e [locals]().
:::

## Props
Os props são passados ​​para um componente como o segundo argumento como um objeto de pares de chave-valor. Você pode acessar os props diretamente no arquivo do componente usando o nome da propriedade do objeto. Por exemplo:

```edge
@!component('button', {
  text: 'Login',
  type: 'submit'
})
```

Então o componente `button` pode acessar os props `text` e `type` da seguinte forma.

```edge
<button type="{{ type }}">{{ text }}</button>
```

### $props
Outra maneira de acessar os props é usar a propriedade `$props`. É uma instância da [classe Props](https://github.com/edge-js/edge/blob/develop/src/Component/Props.ts) e vem com alguns recursos extras para facilitar a criação de componentes.

No exemplo a seguir, o método `serializeExcept` converterá todos os props em atributos HTML, exceto o prop `text`.

```edge
<button {{ $props.serializeExcept(['text']) }}>{{ text }}</button>
```

```edge
@!component('button', {
  text: 'Login',
  type: 'submit',
  class: 'py-2 px-8 text-white bg-gray-800',
})
```

Semelhante ao método `serializeExcept`, você pode usar o método `serializeOnly` para serializar apenas os props selecionados ou usar o método `serialize` para converter todos os props em atributos HTML.

## Slots

Junto com os props, os componentes também podem aceitar `slots`. Slots são saídas nomeadas para as quais o componente pai pode definir marcação.

Por exemplo, vamos aceitar o texto para nosso componente `button` como um slot e não como um prop.

```edge
<button type="{{ type }}">
  {{{ await $slots.main() }}}
</button>
```

O chamador do componente pode definir a marcação para o slot principal da seguinte forma.

```edge
@component('button', {
  type: 'submit'
})
  <i class="fa-icon-lock" />
  <span> Login </span>
@end
```

### Slot principal

O conteúdo entre a tag de abertura e fechamento `@component` faz parte do slot principal, a menos que você o mova para dentro de um slot nomeado.

Todo o conteúdo fora de `@slot('trigger')` faz parte do slot principal no exemplo a seguir.

```edge
@component('modal')
  @slot('trigger')
    <a href=""> Show modal </a>
  @end

  <h1> Modal title </h1>
  <p> Modal content </p>
@end
```

### Slots nomeados

Os slots nomeados permitem que o componente aceite marcação para várias saídas. Por exemplo, um componente modal pode aceitar marcação para o cabeçalho modal, corpo e ações.

```edge
<!-- components/modal.edge -->

<div>
  <header>
    {{{ await $slots.header() }}}
  </header>

  <main>
    {{{ await $slots.main() }}}
  </main>

  <footer>
    {{{ await $slots.actions() }}}
  </footer>
</div>
```

Você pode verificar a existência de um slot e fornecer um valor de fallback usando uma instrução `if`.

```edge
<!-- components/modal.edge -->

<div>
  <!-- ... -->
  <footer>
    @if($slots.footer)
      {{{ await $slots.footer() }}}
    @else
      Default footer
    @end
  </footer>
</div>
```

O modelo pai pode defini-los da seguinte forma.

```edge
@component('components/modal')
  @slot('header')
    <h1> Delete post </h1>
  @end

  @slot('main')
    <div>
      <p>Are you sure, you want to delete the post</p>
    </div>
  @end

  @slot('actions')
    <div class="flex">
      <button>Yes, delete it</button>
      <button>Cancel</button>
    </div>
  @end
@end
```

#### Saída

![](/docs/assets/edge-modal-component.webp)

### Escopo de slots

Os slots têm acesso ao estado do modelo no qual são definidos (também conhecido como modelo pai).

A seguir está a marcação para o componente de botão

```edge
<!-- components/button.edge -->

@set('title', 'I am a button')

<button>
  {{{ await $slots.main() }}}
</button>
```

O modelo pai está tentando acessar a propriedade `title` definida dentro do `component`.

```edge
<!-- home.edge -->

@component('components/button')
  <span>{{ title }}</span>
@end
```

```html
<!-- Saída -->
 
<button>
  <span>undefined</span>
</button>
```

Você pode passar os dados do componente para o pai como argumentos para o método `slot`.

```edge
<!-- components/button.edge -->

@set('title', 'I am a button')

<button>
  // highlight-start
  {{{ await $slots.main({ title }) }}}
  // highlight-end
</button>
```

```edge
<!-- home.edge -->

@component('components/button')
  // highlight-start
  @slot('main', scope)
    <span>{{ scope.title }}</span>
  @end
  // highlight-end
@end
```

Para resumir:

- O modelo pai pode passar dados para o componente usando props ou slots.
- O componente pode passar dados apenas para os slots como argumentos.

## Injetando dados na árvore de componentes

A API de injeção de dados do Edge é inspirada na [API de contexto Svelte](https://svelte.dev/tutorial/context-api) e [API de fornecimento/injeção Vue](https://v3.vuejs.org/guide/component-provide-inject.html#provide-inject).

O objetivo é simplificar a comunicação entre os componentes dentro de uma árvore. No entanto, observe que esta é uma API avançada e deve ser usada somente quando você estiver criando um grupo de componentes e quiser uma comunicação transparente entre eles.

### Exemplo básico

Vamos começar com o exemplo mais básico para ver a API de injeção em ação. Você pode usar a tag `@inject` para compartilhar um objeto com a árvore de componentes.

```edge
<!-- Arquivo de componente -->

{{-- Declarar uma variável local --}}
@set('counter', { value: 0 })

{{-- Injetá-la na árvore de componentes --}}
@inject({ counter })

{{{ await $slots.main() }}}
```

Como a tag `@inject` compartilha o objeto por referência, qualquer parte da árvore de componentes pode alterar suas propriedades, conforme mostrado no snippet a seguir.

Os valores injetados estão disponíveis na variável `$context`.

```edge
@component('components/parent')
  <p> Value of counter is {{ $context.counter.value }} </p>

  {{-- Bump the value by one --}}
  @set($context, 'counter.value', $context.counter.value + 1)

  <p> Updated value is {{ $context.counter.value }} </p>
@end
```

## Componentes como tags
O Edge permite que você faça referência aos componentes armazenados dentro do diretório `./resources/views/components` como tags do Edge.

Crie o seguinte modelo dentro do arquivo `resources/views/components/button.edge`.

```edge
<!-- resources/views/components/button.edge -->

<button type="{{ type }}">
  {{ text }}
</button>
```

Agora, em vez de fazer referência ao componente do botão usando a tag `@component`. Você também pode fazer referência a ele como a tag `@button`.

```edge
@!button({
  type: 'primary',
  text: 'Login'
})
```

Você pode fazer referência aos componentes dentro dos diretórios aninhados com uma notação de ponto. Por exemplo, o arquivo armazenado dentro de `./components/form/input.edge` é referenciado da seguinte forma:

```edge
@!form.input({
  type: 'text',
  placeholder: 'Enter username'
})
```

A seguir está uma tabela de referência para entender as transformações aplicadas ao caminho do componente para calcular o nome da tag.

| Caminho do template       | Nome da tag           |
|---------------------------|-----------------------|
| `form/input.edge`         | `@form.input`         |
| `tool_tip.edge`           | `@toolTip`            |
| `checkout_form/input.edge`| `@checkoutForm.input` |
