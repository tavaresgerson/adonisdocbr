# range

Valida o valor para estar dentro de um intervalo fornecido. A regra só pode ser usada com o tipo de esquema `number`.

No exemplo a seguir, o valor de `age < 18` e `> 40` falhará na validação.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  age: schema.number([
    rules.range(18, 40)
  ])
}
```

## Opções de mensagens personalizadas
A regra de validação `range` passa as opções `start` e `stop` para mensagens personalizadas.

```ts
{
  'age.range': 'Candidate age must be between {{ options.start }} and {{ options.stop }} years',
}
```
