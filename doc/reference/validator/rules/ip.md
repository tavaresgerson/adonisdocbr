# ip

Valida o valor como um endereço IP válido. Opcionalmente, você também pode impor a versão do IP como `4` ou `6`.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  ip: schema.string({}, [
    rules.ip()
  ])
}

{
  ip: schema.string({}, [
    rules.ip({ version: 6 })
  ])
}
```
