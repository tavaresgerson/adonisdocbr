# distinct

A regra `distinct` garante que todos os valores de uma propriedade dentro de uma matriz sejam únicos. **A regra de validação só funciona com o tipo de esquema `array`.**

Supondo que você tenha uma matriz de objetos, cada um definindo uma propriedade de id de produto e você queira garantir que nenhuma id de produto duplicada esteja sendo usada.

```ts
// Dados de amostra

{
  "products": [
    {
      "id": 1,
      "quantity": 4,
    },
    {
      "id": 3,
      "quantity": 10,
    },
    {
      "id": 8,
      "quantity": 1,
    }
  ]
}
```

A regra é aplicada na própria matriz e **NÃO em seus membros**.

```ts {7-9}
import { schema, rules } from '@ioc:Adonis/Core/Validator'

// Regra de validação

{
  products: schema
    .array([
      rules.distinct('id')
    ])
    .members(schema.object().members({
      id: schema.number(),
      quantity: schema.number(),
    }))
}
```

Você também pode usar a regra distinct com uma matriz de valores literais usando a palavra-chave curinga `*`. Por exemplo:

```ts
// Dados de amostra

{
  "tags": [1, 10, 15, 8]
}
```

```ts {5-7}
// Regra de validação

{
  tags: schema
    .array([
      rules.distinct('*')
    ])
    .members(schema.number())
}
```
