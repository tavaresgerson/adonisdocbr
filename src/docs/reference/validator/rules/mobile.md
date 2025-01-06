# mobile

Força o valor a ser formatado corretamente como um número de telefone. Você também pode definir localidades para validação específica do país.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  mobile: schema.string([
    rules.mobile()
  ])
}
```

Você também pode especificar uma ou mais localidades para forçar a validação do formato para um país específico.

```ts
{
  mobile: schema.string([
    rules.mobile({
      locale: ['pt-BR', 'en-IN', 'en-US']
    })
  ])
}
```

## Modo estrito
Habilitar o modo estrito força o usuário a sempre definir o código do país e prefixar o número de telefone com o símbolo `+`.

```ts
{
  mobile: schema.string([
    rules.mobile({ strict: true })
  ])
}
```
