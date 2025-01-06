# requiredIfRules

As regras `requiredIf` permitem que você marque um campo como obrigatório quando uma determinada condição for atendida. Ao usar as regras `requiredIf`, você deve marcar o campo como opcional primeiro.

## requiredIfExists

Valida o campo para estar presente quando o outro campo estiver presente. Por exemplo: O usuário deve preencher o endereço de entrega quando optar pela entrega.

::: info NOTA
O oposto desta regra é `requiredIfNotExists`
:::

::: info NOTA
Se o parâmetro do campo começar com `/`, ele será pesquisado a partir da raiz do objeto.
:::

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  address: schema.string.optional([
    rules.requiredIfExists('needs_delivery')
  ])
}
```

## requiredIfExistsAll
O mesmo que a regra `requiredIf`, mas aqui você pode definir mais de um campo para existir para que o campo seja obrigatório.

::: info NOTA
O oposto desta regra é `requiredIfNotExistsAll`
:::

::: info NOTA
Se o parâmetro de campo começar com `/`, ele será pesquisado a partir da raiz do objeto.
:::

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  tax_id: schema.string.optional([
    rules.requiredIfExistsAll(['owns_a_car', 'owns_a_house'])
  ])
}
```

## requiredIfExistsAny
Marque o campo atual como obrigatório, **quando qualquer um dos outros campos existir** e contiver algum valor.

::: info NOTA
O oposto desta regra é `requiredIfNotExistsAny`
:::

::: info NOTA
Se o parâmetro de campo começar com `/`, ele será pesquisado a partir da raiz do objeto.
:::

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  password: schema.string.optional([
    rules.requiredIfExistsAny(['username', 'email'])
  ])
}
```

## requiredWhen
Marque o campo atual como obrigatório **quando o valor do outro campo corresponder a um determinado critério**.

::: info NOTA
Se o parâmetro de campo começar com `/`, ele será pesquisado a partir da raiz do objeto.
:::

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  address: schema.string.optional([
    rules.requiredWhen('delivery_method', '=', 'shipping')
  ])
}
```

A regra `requiredWhen` suporta os seguintes operadores.

- `in` aceita uma matriz de valores
- `notIn` aceita uma matriz de valores
- `=` aceita um valor literal
- `!=` aceita um valor literal
- `>` aceita um valor numérico
- `<` aceita um valor numérico
- `>=` aceita um valor numérico
- `<=` aceita um valor numérico
