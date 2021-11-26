# enum/enumSet
Valida a propriedade como uma das opções disponíveis. O tipo de dados do valor de retorno para o tipo `enum` é uma união TypeScript.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'

{
  account_type: schema.enum(
    ['twitter', 'github', 'instagram'] as const
  )
}
```

<img src="/assets/literal-union-enum.jpg" />

Você também pode usar enums do TypeScript.

```ts
enum SocialAccounts {
  TWITTER = 'twitter',
  GITHUB = 'github',
  INSTAGRAM = 'instagram',
}

{
  account_type: schema.enum(Object.values(SocialAccounts))
}
```

## Marcar como opcional
Você pode marcar a propriedade como opcional encadeando o método `optional`. Apenas os valores `undefined` são considerados opcionais. Tratamos `null` como um valor válido e ele falhará na validação de enum.

```ts
{
  account_type: schema.enum.optional(Object.values(SocialAccounts))
}
```

## Defina regras adicionais
Você pode definir uma série de regras adicionais como o segundo parâmetro.


import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  account_type: schema.enum(Object.values(SocialAccounts), [
    rules.unique({
      table: 'user_social_accounts',
      column: 'service',
    }),
  ])
}

### opções enum como refs
Se suas opções de enum dependem dos valores em tempo de execução e você está usando o cache de esquema, você deve movê-los para os refs.

A seguir está um exemplo de definição de opções por meio de refs.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Implementação fictícia retornando 
 * lista codificada de cidades
 */
function getCities(_state: string) {
  return  ['Mumbai', 'Pune', 'Nagpur']
}

export default class CreateUserValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public refs = schema.refs({
    cities: getCities(this.ctx.request.input('state'))
  })

  public schema = schema.create({
    city: schema.enum(this.refs.cities)
  })

  public cacheKey = this.ctx.routeKey
}
```

## enumSet
O tipo `schema.enumSet` é semelhante ao tipo `enum`, em vez disso, ele aceita uma matriz de um ou mais valores.

No exemplo a seguir, o usuário pode selecionar uma ou mais habilidades.

```ts
{
  skills: schema.enumSet([
    'Programming',
    'Design',
    'Marketing',
    'Copy writing',
  ] as const)
}
```
