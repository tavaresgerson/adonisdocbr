# requiredIf

As regras `requiredIf` permitem que você marque um campo como obrigatório quando uma determinada condição for atendida. Ao usar as regras `requiredIf`, você deve primeiro marcar o campo como opcional.

## requiredIfExists
Valida o campo para estar presente quando outro campo estiver presente. Por exemplo: O usuário deve preencher o endereço de entrega quando optou pela entrega.

> O oposto desta regra é `requiredIfNotExists`

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  address: schema.string.optional({}, [
    rules.requiredIfExists('needs_delivery')
  ])
}
```

## requiredIfExistsAll
O mesmo que a regra `requiredIf`, mas aqui você pode definir a existência de mais de um campo para que o campo seja obrigatório.

> O oposto desta regra é `requiredIfNotExistsAll`

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  tax_id: schema.string.optional({}, [
    rules.requiredIfExistsAll(['owns_a_car', 'owns_a_house'])
  ])
}
```
 
## requiredIfExistsAny
Marque o campo atual como obrigatório, quando qualquer um dos outros campos existir e contiver algum valor.

O oposto desta regra é `requiredIfNotExistsAny`

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  password: schema.string.optional({}, [
    rules.requiredIfExistsAny(['username', 'email'])
  ])
}
```

## requiredWhen
Marque o campo atual como obrigatório quando o valor do outro campo corresponder a um determinado critério.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  address: schema.string.optional({}, [
    rules.requiredWhen('delivery_method', '=', 'shipping')
  ])
}
```

A regra `requiredWhen` oferece suporte aos seguintes operadores.

* `in` aceita uma série de valores
* `notIn` aceita uma série de valores
* `=` aceita um valor literal
* `!=` aceita um valor literal
* `>` aceita um valor numérico
* `<` aceita um valor numérico
* `>=` aceita um valor numérico
* `<=` aceita um valor numérico
