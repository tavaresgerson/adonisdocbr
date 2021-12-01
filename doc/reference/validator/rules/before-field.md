# beforeField
Semelhante à regra anterior. No entanto, em vez de definir uma data/deslocamento para comparação, você define um campo para verificar. Por exemplo:

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  checkout_date: schema.date(),
  checkin_date: schema.date({}, [
    rules.beforeField('checkout_date')
  ]),
}
```

Além disso, você pode usar `beforeOrEqualToField` para fazer com que a data seja igual ou posterior a um determinado campo.

```ts
{
  published_on: schema.date(),
  drafted_on: schema.date({}, [
    rules.beforeOrEqualToField('published_on')
  ]),
}
```
