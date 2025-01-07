# include/includeIf

A tag `@include` permite que você inclua um parcial em um determinado modelo.

- É uma tag inline.
- Ela aceita apenas um único argumento, que é o caminho parcial relativo do diretório de visualizações.
- O parcial tem acesso ao estado do modelo pai.

```edge
@include('partials/header')
```

Você também pode usar variáveis ​​para definir o caminho parcial.

```edge
@include(headerPartial)
```

Você também pode usar a tag `@includeIf` para incluir um parcial condicionalmente. O primeiro argumento é a condição a ser avaliada antes de incluir o parcial.

```edge
@includeIf(post.comments.length, 'partials/comments')
```
