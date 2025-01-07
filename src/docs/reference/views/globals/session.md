# `session`

O auxiliar `session` fornece acesso a uma instância somente leitura do armazenamento de sessão para a solicitação HTTP atual.

::: info NOTA
O auxiliar só está disponível ao renderizar visualizações usando os métodos `ctx.view.render` e `ctx.view.renderAsync`.
:::

Você pode usar o auxiliar `inspect` para visualizar todos os dados de sessão disponíveis.

```edge
{{ inspect(session.all()) }}
```

### `has`
Descubra se o valor para uma determinada chave existe dentro do armazenamento de sessão. Você pode usar a notação de ponto para pesquisar valores aninhados.

```edge
@if(session.has('user.id'))

@endif
```

### `get`
Retorna o valor para uma determinada chave. Você pode usar a notação de ponto para pesquisar valores aninhados.

```edge
{{ session.get('user.id') }}
```

Opcionalmente, você pode passar um valor padrão como o segundo parâmetro.

```edge
{{ session.get('cartTotal', 0) }}
```

### `all`
Retorna todos os valores disponíveis do armazenamento de sessão.

```edge
{{ session.all() }}
```
