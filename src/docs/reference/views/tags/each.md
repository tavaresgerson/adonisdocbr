# each

A tag `@each` permite que você faça um loop sobre um array ou um objeto de valores.

- É uma tag de nível de bloco
- Ela aceita uma expressão binária com o operador `(in)` como único argumento.

```edge
@each(username in ['virk', 'nikk', 'romain'])
  {{ username }}
@end
```

Você pode acessar o índice do array da seguinte forma:

```edge
@each((username, key) in ['virk', 'nikk', 'romain'])
  {{ key }} - {{ username }}
@end
```

Da mesma forma, você também pode fazer um loop sobre objetos.

```edge
@each((amount, ingredient) in {
  ketchup: '5 tbsp',
  mustard: '1 tbsp',
  pickle: '0 tbsp'
})
  Use {{ amount }} of {{ ingredient }}
@end
```
