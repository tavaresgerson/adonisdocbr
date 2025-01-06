# minLength

Força o valor a ter o comprimento mínimo conforme definido pela regra. A regra só pode ser aplicada a um tipo de esquema `string` ou `array`.

No exemplo a seguir, o nome de usuário com menos de 4 caracteres falhará na validação.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  username: schema.string([
    rules.minLength(4)
  ])
}
```

A seguir está um exemplo de aplicação da regra `minLength` em um array.

```ts
{
  tags: schema
    .array([
      rules.minLength(1)
    ])
    .members(schema.string())
}
```

## Opções de mensagens personalizadas
A regra de validação `minLength` passa a opção `minLength` para mensagens personalizadas.

```ts
{
  'minLength': 'The array must have minimum of {{ options.minLength }} items',
}
```
