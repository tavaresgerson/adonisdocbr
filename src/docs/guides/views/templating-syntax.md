# Sintaxe de template

Com o Edge, garantimos que não introduziremos muitos conceitos novos e, em vez disso, confiamos nos recursos da linguagem JavaScript.

A sintaxe do Edge gira em torno dos dois primitivos principais.

- **Colchetes** são usados ​​para avaliar uma expressão e exibir seu valor de saída.
- **Etiquetas do Edge** são usadas para adicionar novos recursos ao mecanismo de template. A API de tags é usada pelo núcleo do Edge e também é exposta para adicionar tags personalizadas.

## Colchetes

O Edge usa a abordagem popular de colchetes duplos (também conhecidos como bigode) para avaliar as expressões JavaScript. Você pode usar qualquer [expressão JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#expressions) válida dentro das colchetes, e o Edge irá avaliá-la para você.

```edge
{{ user.username }}
{{ user.username.toUpperCase() }}
{{ (2 + 2) * 3 }}
{{ (await getUser()).username }}
```

As chaves duplas escapam da saída da expressão para manter seu modelo seguro contra ataques XSS.

#### Dada a seguinte expressão

```edge
{{ '<script> alert(`foo`) </script>' }}
```

#### A saída será:

```html
&lt;script&gt; alert(&#x60;foo&#x60;) &lt;/script&gt;
```

No entanto, em situações em que você confia na expressão, você pode **instruir o Edge a não escapar do valor usando três chaves.**

```edge
{{{ '<script> alert(`foo`) </script>' }}}
```

#### Saída

```html
<script> alert(`foo`) </script>
```

## Ignorando chaves

Você pode instruir o Edge a ignorar chaves prefixando o símbolo `@`. Isso geralmente é útil quando você está usando o Edge para gerar a marcação para outro mecanismo de modelo.

```edge
Hello @{{ username }}
```

#### Saída

```html
Hello {{ username }}
```

## Tags de borda

Tags são as expressões que começam com o símbolo `@`. As tags fornecem uma API unificada para adicionar recursos à camada de modelagem.

O núcleo do Edge usa tags para implementar recursos como condicionais, loops, parciais e componentes.

```edge
{{-- if tag --}}
@if(user)
@end

{{-- include tag --}}
@include('partials/header')
```

Uma tag deve sempre aparecer em sua linha e não pode ser misturada com outros conteúdos. Aqui está o [guia de sintaxe extensivo](https://github.com/edge-js/syntax).

```edge
{{-- ✅ Válido --}}
@if(user)
@end


{{-- ❌ Inválido --}}
Hello @if(user)
@end
```

Nós dividimos ainda mais as tags em subgrupos para atender a diferentes necessidades de modelagem.

### Tags de nível de bloco

Tags de nível de bloco são aquelas que aceitam opcionalmente o conteúdo dentro delas. Uma tag de nível de bloco deve sempre ser fechada usando a instrução `@end`. Por exemplo:

#### `if` é uma tag de nível de bloco

```edge
@if(user)
@end
```

#### `section` é uma tag de nível de bloco

```edge
@section('body')
@end
```

### Tags em linha

As tags em linha não aceitam nenhum conteúdo dentro delas e são fechadas automaticamente dentro da mesma instrução. Por exemplo:

#### `include` é uma tag em linha

```edge
@include('partials/header')
```

#### `layout` é uma tag em linha

```edge
@layout('layouts/master')
```

### Tags em nível de bloco fechadas automaticamente

Ocasionalmente, você se verá fechando automaticamente uma tag de nível de bloco. Um ótimo exemplo disso é uma tag `component`.

Por exemplo, um componente de botão aceita opcionalmente a marcação para o botão. No entanto, em certas situações, você não quer definir a marcação e, portanto, pode fechar a tag usando a expressão `@!`.

#### Componente de botão com corpo

```edge
@component('button')
  <span> Login </span>
@end
```

#### Componente de botão fechado automaticamente

```edge
@!component('button', { text: 'Login' })
```

### Tags pesquisáveis

Tags pesquisáveis ​​são aquelas que aceitam um ou mais argumentos. Por exemplo:

#### `include` é uma tag pesquisável, pois requer o caminho parcial

```edge
@include('partials/header')
```

#### `super` NÃO é uma tag pesquisável

```edge
@super
```

O conceito de tags pesquisáveis ​​é introduzido para otimizar o compilador Edge. Para tags não pesquisáveis, o compilador Edge não espera que os parênteses de abertura e fechamento apareçam e passa para a próxima linha.

## Comentários

Os comentários são escritos envolvendo o texto dentro da expressão <span v-pre>`{{-- --}}`</span>.

```edge
{{-- This is a comment --}}

{{--
  This is a multiline comment.
--}}

Hello {{ username }} {{-- inline comment --}}

{{-- surrounded by --}} Hello {{-- comments --}}
```

## Engolir novas linhas

Como as tags são sempre escritas em sua linha, elas adicionam uma linha vazia à saída final. Essa linha vazia não é problemática com a marcação HTML, pois o HTML não é sensível a espaços em branco. No entanto, se você estiver trabalhando com uma linguagem sensível a espaços em branco, poderá remover a nova linha usando o caractere til `~`.

```edge
<p>Hello
@if(username)~
 {{ username }}
@endif~
</p>
```

#### Saída

```html
<p>Hello virk</p>
```
