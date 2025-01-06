# alphaNum

Valida o valor para ter apenas letras, números ou ambos. 

::: warning ATENÇÃO
A regra de validação só funciona com o tipo de esquema `string`
:::

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  username: schema.string([
    rules.alphaNum(),
  ])
}
```

Você também pode permitir que a string tenha caracteres `espaços`, `traço` e `sublinhado`.

```ts
{
  username: schema.string([
    rules.alphaNum({
      allow: ['space', 'underscore', 'dash']
    })
  ])
}
```
