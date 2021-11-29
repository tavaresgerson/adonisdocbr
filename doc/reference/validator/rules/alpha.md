# alpha
Valida o valor para ter apenas letras. A regra de validação só funciona com o tipo de esquema `string`.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  username: schema.string({}, [
    rules.alpha(),
  ])
}
```

Você também pode permitir que a string tenha caracteres de `spaces`, `dash` e `underscore`.

```ts
{
  username: schema.string({}, [
    rules.alpha({
      allow: ['space', 'underscore', 'dash']
    })
  ])
}
```
