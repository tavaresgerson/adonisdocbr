# uuid
Aplicar o valor do campo em validação se é válido o `uuid`. Você também pode, opcionalmente, impor uma versão específica do uuid.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  id: schema.string({}, [
    rules.uuid()
  ])
}
```

A seguir está um exemplo de validação `id` de como uma string `uuidv4`.

```ts
{
  id: schema.string({}, [
    rules.uuid({ version: 4 })
  ])
}
```
