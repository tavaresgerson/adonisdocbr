# Loops
Você pode fazer um loop de `objects` e `arrays` usando a tag `@each`. Funciona de forma semelhante ao `for of` do JavaScript.

```ts
view.render('users', {
  users: [
    {
      username: 'virk',
    },
    {
      username: 'romain',
    },
    {
      username: 'nikk',
    },
  ]
})
```

```edge
@each(user in users)
  <li> {{ user.username }} </li>
@end
```

Da mesma forma, você também pode fazer um loop em um objeto e acessar sua chave e valor.

```ts
view.render('recipes', {
  food: {
    ketchup: '5 tbsp',
    mustard: '1 tbsp',
    pickle: '0 tbsp'
  }
})
```

```edge
@each((amount, ingredient) in food)
  <li> Use {{ amount }} of {{ ingredient }} </li>
@end
```

A tag `@each` funciona muito bem com código assíncrono dentro dela. Aqui está um exemplo do mesmo.

```ts
view.render('users', {
  users: [
    {
      username: 'virk',
      posts: async () => [{ title: 'Adonis 101' }],
    },
    {
      username: 'romain',
      posts: async () => [{ title: 'Flydrive 101' }],
    }
  ]
})
```

```edge
@each(user in users)
  <h2> {{ user.username }} posts </h2>

  @each(post in await user.posts())
    <p> {{ post.title }} </p>
  @end
@end
```
