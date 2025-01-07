# component/slot/inject

A tag `@component` permite que você use um modelo Edge como um componente.

- É uma tag de nível de bloco
- Ela aceita o caminho do modelo relativo do diretório `views`, junto com o estado do componente como o segundo argumento.

```edge
@!component('components/button', {
  title: 'Hello world'
})
```

Você também pode derivar o nome do componente de um valor de tempo de execução.

```edge
@!component(currentTheme.button, {
  title: 'Hello world'
})
```

## `slot`
A tag `@slot` permite que você defina a marcação para os slots nomeados. Ela aceita o nome do slot como o primeiro argumento e também pode receber argumentos adicionais do modelo do componente.

```edge
@slot('main')
  This is the content for the main slot
@end
```

Se o componente passar quaisquer argumentos adicionais para o slot, você poderá acessá-los da seguinte forma:

```edge
@slot('main', scope)
  {{ scope.title }}
@end
```

Como os slots são funções regulares, o componente chama a função e passa os argumentos.

```edge
{{{ await $slots.main({ title: 'Hello world' }) }}}
```

## `inject`
A tag `@inject` permite que o modelo de componente [injete dados](../../../guides/views/components.md#injecting-data-to-the-component-tree) na árvore de componentes. A tag aceita um objeto como o único argumento.

```edge
@inject({ tabs: [] })
```
