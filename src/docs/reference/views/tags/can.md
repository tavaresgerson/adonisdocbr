# can/cannot

As tags `@can` e `@cannot` são contribuídas pelo pacote [@adonisjs/bouncer](../../../guides/digging-deeper/authorization.md). Ele permite que você escreva condicionais em torno das permissões do bouncer.

- Ambas são tags de nível de bloco.
- Elas aceitam o nome da ação como o primeiro argumento, seguido pelos dados aceitos pela ação.

```edge
@can('editPost', post)
  <a href="{{ route('posts.edit', [post.id]) }}"> Edit </a>
@end

@can('deletePost', post)
  <a href="{{ route('posts.delete', [post.id]) }}"> Delete </a>
@end
```

Você pode referenciar as ações em uma política passando uma string contendo o nome da política e o nome da ação separados pela notação de ponto.

```edge
@can('PostPolicy.edit', post)
  <a href="{{ route('posts.edit', [post.id]) }}"> Edit </a>
@end
```

### Passando autorizador para um usuário diferente

As tags `@can` e `@cannot` autorizam as ações contra o usuário atualmente conectado. Se a ação do bouncer/política subjacente precisar de um usuário diferente, você terá que passar uma instância de autorizador explícita.

```edge
@can('PostPolicy.edit', bouncer.forUser(admin), post)
@end
```

No exemplo acima, o segundo argumento, `bouncer.forUser(admin)` é uma instância filha de bouncer para um usuário específico, seguido pelos argumentos de ação.
