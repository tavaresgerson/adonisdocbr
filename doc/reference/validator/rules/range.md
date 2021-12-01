# range

Valida o valor dentro de um determinado intervalo. A regra só pode ser usada com o tipo de esquema `number`.

No exemplo a seguir, o valor de `age < 18` e `> 40` falhará na validação.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  age: schema.number([
    rules.range(18, 40)
  ])
}
```
