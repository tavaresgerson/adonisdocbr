# maxLength

Força o valor a ter comprimento máximo conforme definido pela regra. A regra só pode ser aplicada ao tipo de esquema `string` ou `array`.

No exemplo a seguir, o nome de usuário com mais de 40 caracteres falhará na validação.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  username: schema.string({}, [
    rules.maxLength(40)
  ])
}
```

A seguir está um exemplo de aplicação da regra `maxLength` em uma matriz.

```ts
{
  tags: schema
    .array([
      rules.maxLength(10)
    ])
    .members(schema.string())
}
```
