# after

Valida o valor após uma determinada data/deslocamento. A regra só pode ser usada com o tipo de esquema de `data.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  checkin_date: schema.date({}, [
    rules.after(2, 'days')
  ])
}
```

O método `rules.after` aceita uma duração e o deslocamento para a duração. A seguir estão alguns exemplos para o mesmo. Você pode usar o intellisense do TypeScript para descobrir o resto dos offsets disponíveis.

```ts
rules.after(2, 'days')
rules.after(1, 'month')
rules.after(4, 'years')
rules.after(30, 'minutes')
```

Você também pode passar uma das seguintes palavras-chave abreviadas.

```ts
rules.after('today')
rules.after('tomorrow')
```

Para casos de uso mais avançados, você pode passar uma instância do objeto [luxon DateTime](https://moment.github.io/luxon/api-docs/index.html#datetime). Certifique-se de passar o valor como uma referência.

```ts
import { DateTime } from 'luxon'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

class HolidayValidator {
  public refs = schema.refs({
    allowedDate: DateTime.local().plus({ days: 2 })
  })

  public schema = schema.create({
    joining_date: schema.date({}, [
      rules.after(this.refs.allowedDate)
    ])
  })
}
```
