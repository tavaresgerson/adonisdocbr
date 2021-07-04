# Sintaxe do Template
Com o Edge, garantimos não introduzir muitos conceitos novos e, em vez disso, 
contamos com os recursos da linguagem JavaScript.

A sintaxe do Edge gira em torno de dois princípios primitivos.

* **Os colchetes** são usados para avaliar uma expressão e exibir seu valor de saída.
* **Tags do Edge** são usadas para adicionar novos recursos ao mecanismo de modelo. A API de tags é 
  usada pelo núcleo do Edge e também exposta para você adicionar suas próprias tags personalizadas.
  
### Chaves
O Edge usa a abordagem popular de chaves duplas (também conhecidas como mustache) para avaliar as 
[expressões JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#expressions).
Você pode usar qualquer expressão JavaScript válida entre as chaves e o Edge irá avaliá-la para você.

```edge
{{ user.username }}
{{ user.username.toUpperCase() }}
{{ (2 + 2) * 3 }}
{{ (await getUser()).username }}
```

As chaves duplas escapam da saída de expressões para manter seu template seguro contra ataques XSS.

#### Dada a seguinte expressão
```edge
{{ '<script> alert(`foo`) </script>' }}
```
O resultado será:
```
&lt;script&gt; alert(&#x60;foo&#x60;) &lt;/script&gt;
```

No entanto, em situações em que você confia na expressão, você pode instruir edge a não escapar do valor usando três chaves.

```edge
{{{ '<script> alert(`foo`) </script>' }}}
```
Resultado

```html
<script>
  alert(`foo`)
</script>
```

### Ignorando colchetes
Você pode instruir o Edge a ignorar as chaves, prefixando com o símbolo `@`. Isso geralmente é útil quando você está usando 
o Edge para gerar a marcação para outro mecanismo de modelo.

```edge
Hello @{{ username }}
```
 Resultado
```
Hello {{ username }}
```

### Tags do Edge
Tags são as expressões que começam com o símbolo `@`. As tags fornecem uma API unificada para adicionar recursos à camada de templates.

Por exemplo, o núcleo do Edge não tem suporte para condicionais, loops ou parciais. Todos eles são adicionados usando a API de tags.

```edge
{{-- if tag --}}
@if(user)
@end

{{-- include tag --}}
@include('partials/header')
```

Uma tag deve sempre aparecer em sua própria linha e não pode ser misturada com outros conteúdos. Aqui está o 
extenso [guia de sintaxe](https://github.com/edge-js/syntax).

```edge
{{-- ✅ Valid --}}
@if(user)
@end
```

```edge
{{-- ❌ Invalid --}}
Hello @if(user)
@end
```

Dividimos ainda mais as tags em subgrupos para atender às diferentes necessidades de modelos.

#### Tags à nível de bloco
As tags de nível de bloco são aquelas que aceitam opcionalmente o conteúdo dentro delas. Uma tag de nível de bloco sempre 
deve ser fechada usando a instrução `@end`. Por exemplo:

#### `if` é uma tag à nível de bloco
```
@if(user)
@end
```


#### `section` é uma tag à nível de bloco
```
@section('body')
@end
```

#### Tags inline
As tags embutidas não aceitam nenhum conteúdo dentro delas e são fechadas automaticamente na mesma instrução. Por exemplo:

##### `include` é uma tag inline
```
@include('partials/header')
```

##### `layout` é uma tag inline
```
@layout('layouts/master')
```

### Tags de nível de bloco auto-fechadas
Ocasionalmente, você se verá fechando uma etiqueta de nível de bloco. Um ótimo exemplo disso é uma tag `component`.

Por exemplo: Um componente de botão aceita opcionalmente a marcação para o botão. No entanto, em certas situações, você 
não deseja definir a marcação e, portanto, pode fechar a tag usando a expressão `@!`.

#### Componente de botão com corpo
```
@component('button')
  <span> Login </span>
@end
```
#### Componente de botão auto-fechado
```
@!component('button', { text: 'Login' })
```

### Tags pesquisáveis
As tags pesquisáveis são aquelas que aceitam um ou mais argumentos. Por exemplo:

#### include é uma tag procurável, pois requer o caminho parcial
```
@include('partials/header')
```

#### super NÃO é uma tag procurável
```
@super
```

O conceito de tags procuráveis é introduzido para otimizar o compilador do Edge. Para tags não procuráveis, 
o compilador de borda não espera que os parênteses de abertura e fechamento apareçam e apenas avança para a próxima linha.

### Comentários
Os comentários são escritos envolvendo o texto dentro da expressão `{{-- --}}`.

```
{{-- This is a comment --}}

{{--
  This is a multiline comment
--}}

Hello {{ username }} {{-- inline comment --}}

{{-- surrounded by --}} Hello {{-- comments --}}
```

### Engolindo novas linhas
Como as tags são sempre escritas em suas próprias linhas, elas adicionam uma linha vazia à saída final. Esta linha vazia não 
é problemática com a marcação HTML, uma vez que o HTML não é sensível a espaços em branco. No entanto, se você estiver trabalhando 
com uma linguagem sensível a espaços em branco, poderá remover a nova linha usando o caractere til `~`.

```
<p>Hello
@if(username)~
 {{ username }}
@endif~
</p>
```

Resultado

```html
<p>Hello virk</p>
```
