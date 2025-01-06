# trim

`trim` é uma regra de higienização para cortar todos os espaços em branco da esquerda e da direita da string.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  username: schema.string([
    rules.trim()
  ])
}
```
