# email

Força o valor a ser formatado corretamente como um e-mail. **A regra de validação só funciona com o tipo de esquema `string`**.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  email: schema.string([
    rules.email()
  ])
}
```

A regra `email` usa o método `validator.isEmail` do pacote [validatorjs](https://www.npmjs.com/package/validator). Você pode especificar todas as opções aceitas pelo método `validator.isEmail`. Apenas certifique-se de passá-las no **formato camelCase**.

```ts
{
  email: schema.string([
    rules.email({
      ignoreMaxLength: true,
      allowIpDomain: true,
      domainSpecificValidation: true,
    })
  ])
}
```

## Normalizar e-mail
Você pode usar o método `rules.normalizeEmail` para normalizar o endereço de e-mail.

A regra `normalizeEmail` usa o método `validator.normalizeEmail` do pacote [validatorjs](https://www.npmjs.com/package/validator). Você pode especificar todas as opções aceitas pelo método `validator.normalizeEmail`. Apenas certifique-se de passá-las no **formato camelCase**.

```ts
{
  email: schema.string([
    rules.email(),
    rules.normalizeEmail({
      allLowercase: true,
      gmailRemoveDots: true,
      gmailRemoveSubaddress: true,
    }),
  ])
}
```
