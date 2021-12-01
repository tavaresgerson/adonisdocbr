# minLength

Força o valor a ter comprimento mínimo conforme definido pela regra. A regra só pode ser aplicada a tipo de esquema `string` ou `array`.

No exemplo a seguir, o nome de usuário com menos de 4 caracteres falhará na validação.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  username: schema.string({}, [
    rules.minLength(4)
  ])
}
```

A seguir está um exemplo de aplicação da minLengthregra em uma matriz.

```ts
{
  tags: schema
    .array([
      rules.minLength(1)
    ])
    .members(schema.string())
}
```
