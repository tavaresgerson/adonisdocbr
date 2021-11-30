# email
Força a formatação adequada do valor como um e-mail. A regra de validação só funciona com o tipo de esquema `string`.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  email: schema.string({}, [
    rules.email()
  ])
}
```

Você também pode definir as seguintes opções para controlar o comportamento de validação.

```ts
{
  email: schema.string({}, [
    rules.email({
      sanitize: true,
      ignoreMaxLength: true,
      domainSpecificValidation: true,
    })
  ])
}
```

## allowIpDomain
Por padrão, os endereços IP não podem ser definidos como o host do e-mail. Defina a opção para `true` permitir endereços IP também.

## ignoreMaxLength
O endereço de e-mail é validado para seu comprimento máximo. Opcionalmente, você pode desativar a verificação ativando a opção `ignoreMaxLength`.

## domainSpecificValidation
Habilite esta opção para realizar validações específicas do domínio. Por exemplo: não permitir certos endereços de e-mail sintaticamente válidos que são rejeitados pelo GMail.

## sanitize
Não é uma opção de validação, mas pode ser usada para transformar a parte local do e-mail (antes do símbolo `@`) em letras minúsculas.

