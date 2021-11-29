# object

Valida a propriedade para um objeto válido. Além disso, você pode definir a forma das propriedades do objeto usando o método `object.members()`.

No exemplo a seguir, esperamos que `profile` seja um objeto com as propriedades `username` e `avatar_url`.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'

{
  profile: schema.object().members({
    username: schema.string(),
    avatar_url: schema.string()
  })
}

// Dado válido: { profile: { username: 'virk', avatar_url: 'somefile.jpg' } }
```

## Marcar como opcional
Você pode marcar o objeto como opcional encadeando o método `optional`. Apenas os valores `undefined` são considerados opcionais.
Tratamos `null` como um valor válido e ele falhará na validação do objeto.

```ts
{
  profile: schema.object
    .optional() // 👈
    .members({
      username: schema.string(),
      avatar_url: schema.string()
    })
}
```

## Aceite todos os elementos
Você também pode definir um objeto que aceita qualquer propriedade. As propriedades do objeto não são posteriormente validadas para ter um tipo específico.

```ts
{
  colors: schema.object().anyMembers()
}
```
