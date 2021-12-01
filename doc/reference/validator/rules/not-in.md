# notIn

Valida o valor para garantir que ele não esteja dentro de uma matriz de valores fornecidos.

> Não existe a regra `rules.in`. Incentivamos você a usar o [tipo de esquema enum](/doc/reference/validator/schema/enum.md), pois ele fornece melhor segurança de tipo estático.

```ts
{
  username: schema.string({}, [
    rules.notIn(['admin', 'super', 'root'])
  ])
}
```
 
## Fornecendo valores como uma referência
Se suas opções de lista dependem dos valores de tempo de execução e você está usando o cache de esquema, você deve movê-los para o `refs`.

A seguir está um exemplo de definição de opções por meio de refs.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    unallowedValues: getValuesFromSomewhere(),
  })

  public schema = schema.create({
    username: schema.string({}, [
      rules.notIn(this.refs.unallowedValues)
    ]),
  })

  public cacheKey = this.ctx.routeKey
}
```
