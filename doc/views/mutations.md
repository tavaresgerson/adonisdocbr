# Mutações
O Edge permite definir variáveis locais ou alterar o valor de uma propriedade existente usando a tag `@set`.

Idealmente, é melhor evitar muitas variáveis locais embutidas e pré-processar seus dados antes de passá-los para o modelo.

## Declare o valor
Na primeira vez que você usar a tag `@set`, declararemos uma variável `let`.

```edge
@set('username', 'virk')
```

**Saída compilada**
```js
let username = 'virk'
```

Redeclarar a mesma variável novamente apenas atualizará o valor existente.

```edge
@set('username', 'virk')
@set('username', 'romain')
```

**Saída compilada**
```js
let username = 'virk'
username = 'romain'
```

### Propriedades mutate
A tag `@set` também pode ser usada para alterar as propriedades de um objeto existente. Por exemplo.

```edge
@set(post, 'title', 'This is the new title')
```

No cenário acima, o valor de `post.title` será atualizado. Você também pode atualizar valores aninhados.

```edge
@set(
  post,
  'author.avatar',
  await getAvatar(post.author.email)
)

<img src="{{ post.author.avatar }}" />
```
