# boolean

Valida a propriedade para ser um booleano válido. A string e as representações numéricas de um booleano são convertidas em um valor booleano válido.

* `"1"`, `1`, `"true"` Está escalado para `true`
* `"0"`, `0`, `"false"` Está escalado para `false`

Além disso, também convertemos `"on"` para `true` e `"off"` para `false`, pois esses são os valores que o servidor recebe para a entrada da caixa de seleção HTML.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'

{
  accepted: schema.boolean()
}
```

## Marcar como opcional
Você pode marcar a propriedade como opcional encadeando o método `optional`. Apenas os valores `undefined` são considerados opcionais. Tratamos `null` como um valor válido e ele falhará na validação booleana.

```ts
{
  accepted: schema.boolean.optional()
}
```

## Defina regras adicionais
Atualmente não há regras para o tipo de esquema booleano. No entanto, se você criar um, poderá passá-lo como o primeiro argumento.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  title: schema.boolean([
    rules.myCustomRuleForBooleanType(),
  ])
}
```
