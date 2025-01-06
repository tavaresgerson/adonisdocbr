# after

Valida o valor para ser depois de uma determinada data/deslocamento. **A regra pode ser usada somente com o tipo de esquema de data**.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  checkin_date: schema.date({}, [
    rules.after(2, 'days')
  ])
}
```

O método `rules.after` aceita uma **duração** e o **deslocamento** para a duração. A seguir estão alguns exemplos para o mesmo. Você pode usar o TypeScript intellisense para descobrir o restante dos deslocamentos disponíveis.

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

Além disso, você pode usar o `afterOrEqual` para impor que a data seja a mesma ou depois de uma determinada data.

```ts
{
  checkin_date: schema.date({}, [
    rules.afterOrEqual('today')
  ])
}
```

## Usando datas Luxon

Para casos de uso mais avançados, você pode passar uma instância do objeto [luxon DateTime](https://moment.github.io/luxon/api-docs/index.html#datetime). **Certifique-se de passar o valor como uma referência**.

```ts {1,5-7,11}
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
