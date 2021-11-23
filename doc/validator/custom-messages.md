# Mensagens personalizadas
O método `validate` aceita as mensagens personalizadas junto com o objeto de esquema de validação. Você pode definir mensagens apenas para as regras de validação ou também pode especificá-las para campos individuais.

```ts
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

* A mensagem personalizada para a regra `required` será usada por todos os campos que falharem na validação necessária.
* A combinação `username.unique` se aplica apenas ao campo `username` da regra `unique` de validação.

Mensagens para objetos e matrizes aninhados podem ser definidas usando o separador de pontos.

```ts
{
  messages: {
    'user.username.required': 'Missing value for username',
    'tags.*.number': 'Tags must be an array of numbers',
    'products.*.title.required': 'Each product must have a title'
  }  
}
```

## Espaços reservados dinâmicamente
Você pode usar os seguintes espaços reservados para fazer referência aos valores em tempo de execução dentro de suas mensagens personalizadas.

```ts
{
  messages: {
    required: '{{ field }} is required to sign up',
    enum: 'The value of {{ field }} must be in {{ options.choices }}'
  }
}
```

| Placeholder     | Descrição       |
|-----------------|-----------------|
| `{{ field }}`   | Nome do campo em validação. Caminhos de objetos aninhados são representados com um separador de pontos. Por exemplo: `user.profile.username` |
| `{{ rule }}`    | Nome da regra de validação
| `{{ options }}` | As opções passadas pelos métodos de validação. Por exemplo, A enumregra passará uma matriz de choices, e algumas regras podem não passar nenhuma opção |
 
## Retorno de chamada curinga
Você também pode definir uma função de retorno de chamada para construir a mensagem em tempo de execução. O retorno de chamada só pode ser definido como um fallback usando a `*` expressão curinga .

O retorno de chamada será invocado para todos os campos no exemplo a seguir, exceto para o usernamecampo apenas quando ele falhar na requiredvalidação.

```
{
  messages: {
    '*': (field, rule, arrayExpressionPointer, options) => {
      return `${rule} validation error on ${field}`
    },
    'username.required': 'Username is required to sign up',
  }
}
```

## Opções passadas para a string da mensagem
A seguir está a lista de opções passadas pelos diferentes métodos de validação para a string da mensagem.

### date
A regra `date` de validação passará no `options.format`.

```ts
{
  'date.format': '{{ date }} must be formatted as {{ format }}',
}
``` 
 
### distinct
A regra `distinct` de validação passará o `field` no qual a regra distinta é aplicada, junto com o `index` no qual o valor duplicado foi encontrado.

```ts
{
  'products.distinct': 'The product at {{ options.index + 1 }} position has already been added earlier'
}
```

### enum/enumSet
As regras de validação `enum` e `enumSet` passarão por um array de `options.choices`.

```ts
{
  'enum': 'The value must be one of {{ options.choices }}',
  'enumSet': 'The values must be one of {{ options.choices }}',
}
```

### file
A validação do arquivo permite definir mensagens personalizadas para as sub-regras. Por exemplo:

```ts
{
  'file.size': 'The file size must be under {{ options.size }}',
  'file.extname': 'The file must have one of {{ options.extnames }} extension names',
}
```
### minLength/maxLength
As regras de validação `minLength` e `maxLength` passarão o `options.length` para a mensagem.

```ts
{
  'minLength': 'The array must have {{ options.minLength }} items',
}
```

### requiredIfExists/requiredIfNotExists
As regras de validação `requiredIfExists` e `requiredIfNotExists` passarão o `options.otherField` como uma string.

```ts
{
  'requiredIfExists': '{{ options.otherField }} requires {{ field }}',
}
```

### Regras condicionais obrigatórias
As regras `requiredIf*` a seguir passarão o `options.otherFields` como uma matriz de strings.

* requiredIfExistsAll
* requiredIfExistsAny
* requiredIfNotExistsAll
* requiredIfNotExistsAny

```ts
{
  'requiredIfExistsAll': '{{ options.otherFields }} requires {{ field }}',
}
```

### requiredWhen
A regra `requiredWhen` de validação passará as seguintes opções.

* `options.otherField`
* `options.operator`
* `options.values`

```ts
{
  'requiredWhen': '{{ field }} is required when {{ otherField }}{{ operator }}{{ values }}'
}
```
