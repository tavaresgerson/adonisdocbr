# equalTo

Valida o valor para ser igual a um valor fornecido.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  country: schema.string([
    rules.equalTo('IN')
  ])
}
```

Se o valor fornecido for computado em tempo de execução e você estiver usando cache de esquema, então você deve fazer uso de `refs`.

```ts {7-15}
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    teamsCountry: getTeamCountryFromSomeWhere(),
  })

  public schema = schema.create({
    country: schema.string([
      rules.equalTo(this.refs.teamsCountry)
    ]),
  })

  public cacheKey = this.ctx.routeKey
}
```
