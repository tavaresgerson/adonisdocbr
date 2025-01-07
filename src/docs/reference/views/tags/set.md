# set

A tag `@set` permite que você defina variáveis ​​locais dentro do escopo do modelo ou altere o valor de uma variável existente.

- É uma tag inline.
- Ela aceita o nome da variável como o primeiro argumento e seu valor como o segundo argumento.

```edge
@set('title', 'AdonisJS - A fully featured framework')
```

A seguir está a saída compilada

```js
let title = 'AdonisJS - A fully featured framework';
```

Redefinir a mesma variável atualizará o valor existente.

```edge
@set('title', 'AdonisJS - A fully featured framework')
@set('title', 'AdonisJS - About page')
```

```js
let title = 'AdonisJS - A fully featured framework';
title = 'AdonisJS - About page';
```

A tag `@set` também pode atualizar as propriedades em uma variável existente. O comportamento é semelhante ao método `lodash.set`.

```edge
@set(post, 'title', 'New title')
@set(post, 'author.name', 'Virk')
```
