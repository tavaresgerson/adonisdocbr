# equalTo

Valida o valor para ser igual a um valor fornecido.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  country: schema.string({}, [
    rules.equalTo('IN')
  ])
}
```

Se o valor fornecido for calculado no tempo de execução e você estiver usando o cache de esquema, deve fazer uso de refs.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    teamsCountry: getTeamCountryFromSomeWhere(),
  })

  public schema = schema.create({
    country: schema.string({}, [
      rules.equalTo(this.refs.teamsCountry)
    ]),
  })

  public cacheKey = this.ctx.routeKey
}
```
