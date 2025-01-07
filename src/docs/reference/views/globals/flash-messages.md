# `flashMessages`

O auxiliar `flashMessages` fornece acesso às mensagens flash de sessão disponíveis para as solicitações HTTP fornecidas.

::: info NOTA
O auxiliar só está disponível ao renderizar visualizações usando os métodos `ctx.view.render` e `ctx.view.renderAsync`.
:::

Você pode usar o auxiliar `inspect` para visualizar todas as mensagens flash disponíveis.

```edge
{{ inspect(flashMessages.all()) }}
```

### `has`
Descubra se a mensagem flash existe para uma determinada chave ou não. Você pode usar a notação de ponto para pesquisar valores aninhados.

```edge
@if(flashMessages.has('errors.username'))

@endif
```

### `get`
Retorna o valor para uma determinada chave. Você pode usar a notação de ponto para pesquisar valores aninhados.

```edge
{{ flashMessages.get('errors.username') }}
```

Opcionalmente, você pode passar um valor padrão como o segundo parâmetro.

```edge
{{ flashMessages.get('username', 'Enter username') }}
```

### `all`
Retorna todas as mensagens flash disponíveis como um objeto.

```edge
{{ flashMessages.all().username }}
```
