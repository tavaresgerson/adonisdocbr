# array

Valida a propriedade como uma matriz. Além disso, você pode definir a forma dos elementos da matriz usando o método `array.members()`.

No exemplo a seguir, a propriedad `tags` aceita uma matriz de números.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'

{
  tags: schema.array().members(schema.number())
}

// Dados válidos: [1, 3, 8, 11, 22]
```

A seguir está um exemplo de aceitação de uma matriz de objetos com as propriedades `username` e `email`.

```ts
{
  users: schema.array().members(
    schema.object().members({
      username: schema.string(),
      email: schema.string(),
    })
  ),
}

// Dados válidos: [{ username: 'virk', email: 'virk@adonisjs.com' }]
```

## Marcar como opcional
Você pode marcar a matriz como opcional encadeando o método `optional`. Apenas os valores `undefined` são considerados opcionais. Tratamos 
`null` como um valor válido e ele falhará na validação do array.

No exemplo a seguir, esperamos que a matriz seja `undefined` ou tenha pelo menos um elemento.

```ts
{
  tags: schema.array
    .optional([
      rules.minLength(1)
    ]) // 👈
    .members(schema.number())
}
```

## Validando o comprimento da matriz
Você pode validar o comprimento da matriz usando as regras `minLength` e `maxLength`. No exemplo a seguir, aceitamos no mínimo 1 e no máximo 5 tags.

```ts
{
  tags: schema
    .array([
      rules.minLength(1),
      rules.maxLength(5)
    ])
    .members(schema.number()),  
}
```

## Aceite todos os elementos
Você também pode definir uma matriz que aceite qualquer elemento. Os elementos da matriz não são posteriormente validados para ter um tipo específico.

```ts
{
  themeOptions: schema.array().anyMembers()
}
```
