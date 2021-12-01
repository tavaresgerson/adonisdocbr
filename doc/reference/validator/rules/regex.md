# regex
Valida o valor em relação ao regex definido. A regra só pode ser usada com o tipo de esquema `string`.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  username: schema.string({}, [
    rules.regex(/^[a-zA-Z0-9]+$/)
  ])
}
```

Você pode passar a instância `RegExp` diretamente.

```ts
{
  username: schema.string({}, [
    rules.regex(new RegExp('^[a-zA-Z0-9]+$'))
  ])
}
```
