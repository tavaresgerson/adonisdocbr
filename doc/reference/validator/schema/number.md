# number
Valida a propriedade para ser um número válido. A representação de string de um número será convertida em um tipo de dados de número. Por exemplo: `"22"` torna-se `22`.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'

{
  marks: schema.number()
}
```

## Marcar como opcional
Você pode marcar a propriedade como opcional encadeando o método `optional`. Apenas os valores `undefined` são considerados opcionais. Tratamos `null` como um valor válido e ele falhará na validação do número.

```ts
{
  marks: schema.number.optional()
}
```

## Defina regras adicionais
Você pode definir uma série de regras adicionais como o primeiro parâmetro.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  marks: schema.number([
    rules.unsigned(),
    rules.range(10, 100),
  ])
}
```
