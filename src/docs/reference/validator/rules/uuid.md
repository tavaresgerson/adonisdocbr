# uuid

Imponha que o valor do campo sob validação seja um `uuid` válido. Você também pode, opcionalmente, impor uma versão específica do uuid.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  id: schema.string([
    rules.uuid()
  ])
}
```

A seguir, um exemplo de validação do `id` para ser uma string `uuidv4`.

```ts
{
  id: schema.string([
    rules.uuid({ version: 4 })
  ])
}
```
