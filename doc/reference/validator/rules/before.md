# before
Valida o valor anterior a uma determinada data/deslocamento. A regra só pode ser usada com o tipo de esquema de `date`.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  joining_date: schema.date({}, [
    rules.before(2, 'days')
  ])
}
```
O método `rules.before` aceita uma duração e o deslocamento para a duração. A seguir estão alguns exemplos para o mesmo. Você pode usar o intellisense do TypeScript para descobrir o resto dos offsets disponíveis.

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

Para casos de uso mais avançados, você pode passar uma instância do objeto [luxon DateTime](https://moment.github.io/luxon/api-docs/index.html#datetime). Certifique-se de passar o valor como uma referência .

```ts
import { DateTime } from 'luxon'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

class UserValidator {
  public refs = schema.refs({
    allowedDate: DateTime.local().minus({ days: 2 })
  })
}
```
