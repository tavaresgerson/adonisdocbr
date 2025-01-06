# ip

Valida o valor para ser um endereço IP válido. Opcionalmente, você também pode impor a versão IP como `4` ou `6`.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  ip: schema.string([
    rules.ip()
  ])
}
```

```ts
{
  ip: schema.string([
    rules.ip({ version: 6 })
  ])
}
```
