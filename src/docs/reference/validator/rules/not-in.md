# notIn

Valida o valor para garantir que ele não esteja dentro de uma matriz de valores fornecidos.

::: info NOTA
Não há regra `rules.in`. Nós encorajamos você a usar o [tipo de esquema enum](../schema/enum.md) pois ele fornece melhor segurança de tipo estático.
:::

```ts
{
  username: schema.string([
    rules.notIn(['admin', 'super', 'root'])
  ])
}
```

## Fornecendo valores como uma referência

Se suas opções de lista dependem dos valores de tempo de execução e você está usando cache de esquema, então você deve movê-los para `refs`.

A seguir está um exemplo de definição de opções via refs.

```ts {7-15}
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    unallowedValues: getValuesFromSomewhere(),
  })

  public schema = schema.create({
    username: schema.string([
      rules.notIn(this.refs.unallowedValues)
    ]),
  })

  public cacheKey = this.ctx.routeKey
}
```

## Opções de mensagens personalizadas
A regra de validação `notIn` passa a matriz `values` como a única opção para mensagens personalizadas.

```ts
{
  'notIn': 'The {{ field }} value cannot be one of {{ options.values }}',
}
```
