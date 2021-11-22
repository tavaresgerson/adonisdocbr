# Componentes

O sistema de componentes do Edge é altamente inspirado nas estruturas de front-end do Vue e Svelte. Ele pega emprestado o conceito de reutilização, estado isolado, adereços e slots.

Observe que o Edge é um mecanismo de modelo de back-end e não podemos replicar alguns dos princípios do ecossistema de front-end com o Edge, isso inclui.

* **Reatividade**: não há conceito de reatividade no backend. Você gera o HTML e o envia pela rede.
* **CSS com escopo** : Edge não é compilado usando ferramentas de construção de front-end como Webpack e, portanto, não se preocupa em compilar e extrair CSS de componentes. Você deve usar ferramentas de front-end existentes para isso.

## Criação de um componente
Os componentes são representados usando os arquivos de template edge regulares. Por exemplo, você pode criar um arquivo nomeado como `button.edge` com a seguinte marcação:

```edge
<button type="{{ type }}">
  {{ text }}
</button>
```

E então use-o como um componente dentro de outros templates.

```edge
@!component('button', {
  text: 'Login',
  type: 'submit'
})
```

A tag `@component` aceita um total de dois argumentos. O primeiro é o caminho do componente (relativo ao diretório de visualizações) e o segundo é o estado do componente (props).

> Os componentes não têm acesso ao estado do modelo pai. No entanto, eles podem acessar modelos globais e locais.

## Props (Adereços)
Os props são passados para um componente como segundo argumento semelhante à um objeto de pares chave-valor. Você pode acessar os props diretamente no arquivo do componente usando o nome da propriedade do objeto. Por exemplo:

```edge
@!component('button', {
  text: 'Login',
  type: 'submit'
})
```

Então, o componente `button` pode acessar os props `text` e o `type` da seguinte maneira.
```edge
<button type="{{ type }}">{{ text }}</button>
```

### $props
Outra forma de acessar os adereços é usando a propriedade `$props`. É uma instância da classe Props e vem com alguns recursos extras para facilitar a criação de componentes.

No exemplo a seguir, o método `serializeExcept` converterá todos os adereços em atributos HTML, exceto o prop `text`.

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

Semelhante ao método `serializeExcept`, você pode usar o método `serializeOnly` para serializar apenas adereços selecionados ou usar o método `serialize` para converter todos os props em atributos HTML.

## Slots
Junto aos pros, os componentes também podem aceitar slots. Slots são saídas nomeadas para os quais o componente pai pode definir uma marcação.

Por exemplo, vamos aceitar o texto do nosso componente `button` como um slot e não como um props:

```html
<button type="{{ type }}">
  {{{ await $slots.main() }}}
</button>
```

O responsável pela chamada do componente pode definir a marcação para o slot principal da seguinte maneira.

```html
@component('button', {
  type: 'submit'
})
  <i class="fa-icon-lock" />
  <span> Login </span>
@end
```

### Slot principal
O conteúdo entre a abertura `@component` e a tag de fechamento fazem parte do slot principal, a menos que você o mova para dentro de um slot nomeado.

Todo o conteúdo fora do `@slot('trigger')` faz parte do slot principal no exemplo a seguir.

```html
@component('modal')
  @slot('trigger')
    <a href=""> Show modal </a>
  @end

  <h1> Modal title </h1>
  <p> Modal content </p>
@end
```

### Slots nomeados
Os slots nomeados permitem que o componente aceite marcação para vários pontos de venda. Por exemplo, um componente modal pode aceitar marcação para o cabeçalho, corpo e ações modais.

```html
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

O modelo pai pode defini-los da seguinte maneira.

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

**Saída**

<img src="/assets/edge-modal-component.png" />

### Escopo de slots
Os slots têm acesso ao estado do modelo no qual são definidos (também conhecido como modelo pai).

A seguir está a marcação para o componente do botão

```edge
<!-- components/button.edge -->

@set('title', 'I am a button')

<button>
  {{{ await $slots.main() }}}
</button>
```

O template pai está tentando acessar a propriedad `title` definida dentro do component.

```edge
<!-- home.edge -->

@component('components/button')
  <span>{{ title }}</span>
@end
```

**Saída**

```html
<button>
  <span>undefined</span>
</button>
```

Você pode passar os dados do componente para o pai como argumentos para o método `slot`.

```html
<!-- components/button.edge -->

@set('title', 'I am a button')

<button>
  {{{ await $slots.main({ title }) }}}
</button>
```

```html
<!-- home.edge -->

@component('components/button')
  @slot('main', scope)
    <span>{{ scope.title }}</span>
  @end
@end
```

Para resumir:

* O modelo pai pode passar dados para o componente usando props ou slots.
* O componente pode passar dados apenas para os slots como argumentos.

## Injetando dados na árvore de componentes
A API de injeção de dados do Edge é inspirada na [API de contexto do Svelte](https://svelte.dev/tutorial/context-api) e na API de [fornecer/injetar do Vue](https://v3.vuejs.org/guide/component-provide-inject.html#provide-inject).

O objetivo é simplificar a comunicação entre os componentes dentro de uma árvore. No entanto, observe que esta é uma API avançada e deve ser usada apenas quando você estiver criando um grupo de componentes e quiser uma comunicação transparente entre eles.

### Exemplo básico
Vamos começar com o exemplo mais básico para ver a API de injeção em ação. Você pode usar a tag `@inject` para compartilhar um objeto com a árvore de componentes.

```edge
<!-- Arquivo de componente -->

{{-- Declare a local variable --}}
@set('counter', { value: 0 })

{{-- Inject it to the components tree --}}
@inject({ counter })

{{{ await $slots.main() }}}
```

Como a tag `@inject` compartilha o objeto por referência, qualquer parte da árvore de componentes pode sofrer mutação em suas propriedades, conforme mostrado no trecho de código a seguir.

Os valores injetados estão disponíveis na variável `$context`.

```html
@component('components/parent')
  <p> Value of counter is {{ $context.counter.value }} </p>

  {{-- Bump the value by one --}}
  @set($context, 'counter.value', $context.counter.value + 1)

  <p> Updated value is {{ $context.counter.value }} </p>
@end
```

## Componentes como tags
O Edge permite que você faça referência aos componentes armazenados dentro do diretório `./resources/views/components` como tags do edge.

Crie o seguinte modelo dentro do arquivo `resources/views/components/button.edge`.

```edge
<!-- resources/views/components/button.edge -->

<button type="{{ type }}">
  {{ text }}
</button>
```

Agora, em vez de fazer referência ao componente do botão usando a tag `@component`. Você pode referência-lo com a tag `@button`.

```edge
@!button({
  type: 'primary',
  text: 'Login'
})
```

Você pode fazer referência aos componentes dentro dos diretórios aninhados com uma notação de ponto. Por exemplo, o arquivo armazenado dentro de `./components/form/input.edge` é referenciado da seguinte maneira:

```edge
@!form.input({
  type: 'text',
  placeholder: 'Enter username'
})
```

A seguir está uma tabela de referência para compreender as transformações aplicadas ao caminho do componente para calcular o nome da marca.

| Caminho do modelo           | Nome da tag           |
|-----------------------------|-----------------------|
| `form/input.edge`           |	`@form.input`         |
| `tool_tip.edge`             | `@toolTip`            |
| `checkout_form/input.edge`  | `@checkoutForm.input` |
