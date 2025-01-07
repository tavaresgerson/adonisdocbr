# `excerpt`

O view helper gera o excerpt de um fragmento HTML. O valor de retorno remove as tags HTML e retorna uma string simples.

```edge
{{
  excerpt(
    '<p> Hello, this is a dummy <strong> post </strong> </p>',
    20
  )
}}

<!-- Output: Hello, this is a dummy... -->
```

O método `excerpt` não corta as palavras no meio e as deixa ser completadas. No entanto, você pode desativar esse comportamento definindo a opção `completeWords` como `false`.

```edge {5,9}
{{
  excerpt(
    '<p> Hello, this is a dummy <strong> post </strong> </p>',
    20,
    { completeWords: false }
  )
}}

<!-- Output: Hello, this is a du... -->
```

Além disso, você pode definir um sufixo personalizado para a string truncada.

```edge
{{
  excerpt(
    '<p> Hello, this is a dummy <strong> post </strong> </p>',
    20,
    { suffix: ' [Read more]' }
  )
}}

<!-- Output: Hello, this is a dummy [Read more] -->
```
