# escape

`escape` é uma regra de higienização para substituir `<`, `>`, `&`, `'`, `"` e `/` por entidades HTML.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  username: schema.string([
    rules.escape()
  ])
}
```
