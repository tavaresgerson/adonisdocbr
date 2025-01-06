# before

Valida o valor para ser anterior a uma determinada data/deslocamento. **A regra pode ser usada somente com o tipo de esquema de data**.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  joining_date: schema.date({}, [
    rules.before(2, 'days')
  ])
}
```

O método `rules.before` aceita uma **duração** e o **deslocamento** para a duração. A seguir estão alguns exemplos para o mesmo. Você pode usar o TypeScript intellisense para descobrir o restante dos deslocamentos disponíveis.

```ts
rules.before(2, 'days')
rules.before(1, 'month')
rules.before(4, 'years')
rules.before(30, 'minutes')
```

Você também pode passar uma das seguintes palavras-chave abreviadas.

```ts
rules.before('today')
rules.before('yesterday')
```

Além disso, você pode usar o `beforeOrEqual` para impor que a data seja a mesma ou posterior a uma determinada data.

```ts
{
  joining_date: schema.date({}, [
    rules.beforeOrEqual('today')
  ])
}
```

## Usando datas Luxon

Para casos de uso mais avançados, você pode passar uma instância do objeto [luxon DateTime](https://moment.github.io/luxon/api-docs/index.html#datetime). **Certifique-se de passar o valor como uma referência**.

```ts {1,5-7,11}
import { DateTime } from 'luxon'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

class UserValidator {
  public refs = schema.refs({
    allowedDate: DateTime.local().minus({ days: 2 })
  })

  public schema = schema.create({
    checkin_date: schema.date({}, [
      rules.before(this.refs.allowedDate)
    ])
  })
}
```
