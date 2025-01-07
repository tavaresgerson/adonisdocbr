# `truncate`

O view helper trunca um valor de string fornecido pelo número de caracteres. Por exemplo:

```edge
{{
  truncate(
    'This is a very long sentence that i would like to be shortened',
    18
  )
}}

<!-- Output: This is a very long... -->
```

O método `truncate` não corta as palavras no meio e as deixa ser concluídas. No entanto, você pode desativar esse comportamento definindo a opção `completeWords` como `false`.

```edge
{{
  truncate(
    'This is a very long sentence that i would like to be shortened',
    18,
    // highlight-start
    { completeWords: false }
    // highlight-end
  )
}}

// highlight-start
<!-- Output: This is a very lon... -->
// highlight-end
```

Além disso, você pode definir um sufixo personalizado para a string truncada.

```edge
{{
  truncate(
    'This is a very long sentence that i would like to be shortened',
    18,
    { suffix: ' [Read more]' }
  )
}}

<!-- Output: This is a very long [Read more] -->
```
