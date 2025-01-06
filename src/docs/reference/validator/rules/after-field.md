# afterField

Semelhante à regra [after](./after.md). No entanto, em vez de definir uma data/deslocamento para comparação, você define **um campo para verificar**. Por exemplo:

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  checkin_date: schema.date(),
  checkout_date: schema.date({}, [
    rules.afterField('checkin_date')
  ]),
}
```

Além disso, você pode usar `afterOrEqualToField` para impor que a data seja a mesma ou posterior a um determinado campo.

```ts
{
  drafted_at: schema.date(),
  published_at: schema.date({}, [
    rules.afterOrEqualToField('drafted_at')
  ]),
}
```
