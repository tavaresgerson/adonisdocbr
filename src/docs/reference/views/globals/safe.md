# `safe`

A saída da interpolação (o código dentro das `chaves`) é HTML escapado para evitar ataques XSS. No entanto, às vezes você quer renderizar HTML sem escapar e para isso você pode usar três chaves em vez de duas.

```edge
{{ '<p> I will be escaped </p>' }}
{{{ '<p> I will render as it is </p>' }}}
```

Outra maneira de renderizar HTML sem escapar é usar o método `safe`.

```edge
{{ safe('<p> I will render as it is </p>') }}
```

Usar o método `safe` não tem nenhuma vantagem sobre três chaves. No entanto, ele se torna útil quando você está criando seus próprios métodos globais e quer renderizar HTML a partir deles sem instruir o usuário final a usar três chaves.

```ts
View.global('input', (type: string, value: string) => {
  return View.GLOBALS.safe(`<input type="${type}" value="${value || ''}" />`)
})
```

E agora você pode usar o `input` global dentro das chaves duplas padrão.

```edge
{{ input('text', 'foo') }}
```
