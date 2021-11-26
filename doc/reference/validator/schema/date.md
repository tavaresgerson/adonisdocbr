# date
Valida a propriedade para ser um objeto de data válido ou uma string que representa uma data. Os valores são convertidos em uma instância de `luxon.DateTime`

```ts
import { schema } from '@ioc:Adonis/Core/Validator'

{
  published_at: schema.date()
}
```

Você também pode impor um formato para os valores da string definindo um formato válido aceito pelo `luxon`.

```ts
{
  published_at: schema.date({
    format: 'yyyy-MM-dd HH:mm:ss',
  })
}
```

Ou use os seguintes códigos abreviados para formatos padronizados de data/hora.

```ts
{
  published_at: schema.date({
    format: 'rfc2822',
  })
}

// Ou
{
  published_at: schema.date({
    format: 'sql',
  })
}

// Ou
{
  published_at: schema.date({
    format: 'iso',
  })
}
```

## Marcar como opcional
Você pode marcar a propriedade como opcional encadeando o método `optional`. Apenas os valores `undefined` são considerados opcionais. Tratamos `null` como um valor válido e falhará na validação da data.

```ts
{
  published_at: schema.date.optional({
    format: 'yyyy-MM-dd HH:mm:ss',
  })
}
```

## Defina regras adicionais
Você pode definir uma série de regras adicionais como o segundo parâmetro.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  published_at: schema.date({}, [
    rules.after('today'),
    rules.before(10, 'days'),
  ])
}
```
