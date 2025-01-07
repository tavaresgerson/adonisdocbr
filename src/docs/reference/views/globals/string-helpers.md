# String helpers

A seguir está a lista de auxiliares de string disponíveis que você pode usar em seus modelos do Edge. O núcleo do framework e os pacotes oficiais do AdonisJS já estão usando esses auxiliares, só que também os injetamos como auxiliares de visualização.

### `camelCase`
Converte uma string para sua versão `camelCase`.

```edge
{{ camelCase('hello-world') }}

<!-- Output: helloWorld -->
```

### `snakeCase`
Converte uma string para sua versão `snake_case`.

```edge
{{ snakeCase('helloWorld') }}

<!-- Output: hello_world -->
```

### `dashCase`
Converte uma string para sua versão `dash-case`. Opcionalmente, você também pode colocar a primeira letra de cada segmento em maiúscula.

```edge
{{ string.dashCase('helloWorld') }} <!-- hello-world -->

{{
  string.dashCase('helloWorld', { capitalize: true })
}} <!-- Hello-World -->
```

### `pascalCase`
Converte uma string para sua versão `PascalCase`.

```edge
{{ pascalCase('helloWorld') }}

<!-- Output: HelloWorld -->
```

### `capitalCase`
Coloca um valor de string em maiúsculas.

```edge
{{ capitalCase('helloWorld') }}

<!-- Output: Hello World -->
```

### `sentenceCase`
Converte string para maiúsculas e minúsculas.

```edge
{{ sentenceCase('hello-world') }}

<!-- Output: Hello world -->
```

### `dotCase`
Converte string para sua versão `dot.case`.

```edge
{{ dotCase('hello-world') }}

<!-- Output: hello.world -->
```

### `noCase`
Remove todos os tipos de maiúsculas e minúsculas de uma string.

```edge
{{ noCase('hello-world') }} <!-- hello world -->
{{ noCase('hello_world') }} <!-- hello world -->
{{ noCase('helloWorld') }} <!-- hello world -->
```

### `titleCase`
Converte uma frase para maiúsculas e minúsculas.

```edge
{{ titleCase('Here is a fox') }}

<!-- Output: Here Is a fox -->
```

### `pluralize`
Pluraliza uma palavra.

```edge
{{ pluralize('box') }} <!-- boxes -->
{{ pluralize('i') }} <!-- we -->
```

### `toSentence`
Junte uma matriz de palavras com um separador para formar uma frase.

```edge
{{ 
  toSentence([
    'route',
    'middleware',
    'controller'
  ])
}}

<!-- route, middleware, and controller -->
```

Você também pode definir as seguintes opções para personalizar os separadores.

- `separator`: O valor entre duas palavras, exceto a última.
- `pairSeparator`: O valor entre a primeira e a última palavra. Usado somente quando há duas palavras.
- `lastSeparator`: O valor entre a segunda última e a última palavra. Usado somente quando há mais de duas palavras.

```edge
{{
  toSentence([
    'route',
    'middleware',
    'controller'
  ], {
    separator: '/ ',
    lastSeparator: '/or '
  })
}}

<!-- route/ middleware/or controller -->
```

### `prettyBytes`
Converte o valor de bytes em uma string legível por humanos. Aceita e encaminha todas as opções para o pacote [bytes](https://www.npmjs.com/package/bytes).

```edge
{{ prettyBytes(1024) }} <!-- 1KB -->

{{
  prettyBytes(1024, { unitSeparator: ' ' })
}} <!-- 1 KB -->
```

### `toBytes`
Converte uma string legível para humanos em bytes. Este método é o oposto do método `prettyBytes`.

```edge
{{ toBytes('1KB') }} <!-- 1024 -->
```

### `prettyMs`
Converte o tempo representado em milissegundos para uma string legível para humanos.

```edge
{{ prettyMs(60000) }} <!-- 1min -->

{{ prettyMs(60000, { long: true }) }} <!-- 1 minute -->
```

### `toMs`
Converte uma string legível para humanos em milissegundos. Este método é o oposto do método `prettyMs`.

```edge
{{ toMs('1min') }} <!-- 60000 -->
```

### `ordinalize`
Ordinalize uma string ou um valor numérico.

```edge
{{ ordinalize(1) }} <!-- 1st -->
{{ ordinalize(99) }} <!-- 99th -->
```

### `nl2br`
Converte os caracteres de nova linha com uma tag `<br>`.

```ts
{{{ nl2br(post.content) }}}
```

Ao usar o auxiliar `nl2br`, você terá que usar três chaves para renderizar a tag `<br>` como HTML em vez de escapá-la.

No entanto, isso também renderizará as tags HTML da variável `post.content`. Para superar essa situação, recomendamos que você escape separadamente a entrada do usuário antes de passá-la para o método `nl2br`.

:::note
A seguir está a maneira correta de usar o método `nl2br`. Isso garante que a entrada do usuário seja sempre escapada.
:::

```ts
{{{ nl2br(e(post.content)) }}}
```

### `e`
Escape HTML dentro de um valor de string. As chaves duplas já escapam o valor, então use este método somente quando não estiver usando as chaves duplas.

```ts
{{{ e(post.content) }}}
```
