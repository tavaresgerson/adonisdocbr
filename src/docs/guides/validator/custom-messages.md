# Mensagens personalizadas

O método `validate` aceita as mensagens personalizadas junto com o objeto de esquema de validação. Você pode definir mensagens apenas para as regras de validação ou especificá-las para campos individuais também.

```ts {5-8}
await request.validate({
  schema: schema.create({
    // ...
  }),
  messages: {
    required: 'The {{ field }} is required to create a new account',
    'username.unique': 'Username not available'
  }
})
```

- A mensagem personalizada para a regra `required` será usada por todos os campos que falharem na validação necessária.
- A combinação `username.unique` se aplica apenas ao campo `username` para a regra de validação `unique`.

Mensagens para objetos aninhados e matrizes podem ser definidas usando o separador de ponto.

```ts
{
  messages: {
    'user.username.required': 'Missing value for username',
    'tags.*.number': 'Tags must be an array of numbers',
    'products.*.title.required': 'Each product must have a title'
  }  
}
```

## Espaços reservados dinâmicos
Você pode usar os seguintes espaços reservados para referenciar valores de tempo de execução dentro de suas mensagens personalizadas.

```ts
{
  messages: {
    required: '{{ field }} is required to sign up',
    enum: 'The value of {{ field }} must be in {{ options.choices }}'
  }
}
```

| Placeholder     | Descrição   |
|-----------------|-------------|
| <span v-pre>`{{ field }}`</span>   | Nome do campo sob validação. Caminhos de objetos aninhados são representados com um separador de ponto. Por exemplo: `user.profile.username` |
| <span v-pre>`{{ rule }}`</span>    | Nome da regra de validação |
| <span v-pre>`{{ options }}`</span> | As opções passadas pelos métodos de validação. Por exemplo, a regra `enum` passará uma matriz de `choices`, e algumas regras podem não passar nenhuma opção |

## Retorno de chamada curinga
Você também pode definir uma função de retorno de chamada para construir a mensagem em tempo de execução. O retorno de chamada só pode ser definido como um fallback usando a expressão curinga `*`.

O retorno de chamada será invocado para todos os campos no exemplo a seguir, exceto para o campo `username` somente quando ele falhar na validação `required`.

```ts
{
  messages: {
    '*': (field, rule, arrayExpressionPointer, options) => {
      return `${rule} validation error on ${field}`
    },
    'username.required': 'Username is required to sign up',
  }
}
```

## Opções passadas para a string de mensagem
A seguir está a lista de opções passadas pelos diferentes métodos de validação para a string de mensagem.

### `date`
A regra de validação `date` passará o `options.format`.

```ts
{
  'date.format': '{{ field }} must be formatted as {{ options.format }}',
}
```

### `distinct`
A regra de validação `distinct` passará o `field` no qual a regra distinct é aplicada, junto com o `index` no qual o valor duplicado foi encontrado.

```ts
{
  'products.distinct': 'The product at {{ options.index + 1 }} position has already been added earlier'
}
```

### `enum` / `enumSet`
As regras de validação `enum` e `enumSet` passarão uma matriz de `options.choices`.

```ts
{
  'enum': 'The value must be one of {{ options.choices }}',
  'enumSet': 'The values must be one of {{ options.choices }}',
}
```

### `file`
A validação de arquivo permite definir mensagens personalizadas para as sub-regras. Por exemplo:

```ts
{
  'file.size': 'The file size must be under {{ options.size }}',
  'file.extname': 'The file must have one of {{ options.extnames }} extension names',
}
```

### `minLength` / `maxLength`
As regras de validação `minLength` e `maxLength` passarão as seguintes opções para mensagens personalizadas.

```ts
{
  'minLength': 'The array must have minimum of {{ options.minLength }} items',
  'maxLength': 'The array can contain maximum of {{ options.maxLength }} items',
}
```

### `range`
A regra de validação `range` passa as opções `start` e `stop` para mensagens personalizadas.

```ts
{
  'range': 'Candidate age must be between {{ options.start }} and {{ options.stop }} years',
}
```

### `requiredIfExists` / `requiredIfNotExists`
As regras de validação `requiredIfExists` e `requiredIfNotExists` passarão `options.otherField` como uma string.

```ts
{
  'requiredIfExists': '{{ options.otherField }} requires {{ field }}',
}
```

### Regras condicionais obrigatórias
As seguintes regras `requiredIf*` passarão `options.otherFields` como uma matriz de strings.

- `requiredIfExistsAll`
- `requiredIfExistsAny`
- `requiredIfNotExistsAll`
- `requiredIfNotExistsAny`

```ts
{
  'requiredIfExistsAll': '{{ options.otherFields }} requires {{ field }}',
}
```

### `requiredWhen`
A regra de validação `requiredWhen` passará as seguintes opções.

- `options.otherField`
- `options.operator`
- `options.values`

```ts
{
  'requiredWhen': '{{ field }} is required when {{ otherField }}{{ operator }}{{ values }}'
}
```
