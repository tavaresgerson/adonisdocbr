# confirmed

Aplicar o campo sob validação também é confirmado usando a convenção `_confirmation`. Você usará essa regra principalmente para confirmação de senha.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  password: schema.string([
    rules.confirmed()
  ])
}

/**
 Valid data: {
    password: 'secret',
    password_confirmation: 'secret'
 }
 */
```

Opcionalmente, você também pode alterar o nome do campo que deve ser verificado para a confirmação. Geralmente é útil quando você não está usando a convenção `snake_case` para os nomes de campo.

```ts
{
  password: schema.string([
    rules.confirmed('passwordConfirmation')
  ])
}

/**
 Valid data: {
    password: 'secret',
    passwordConfirmation: 'secret'
 }
 */
```

## Mensagem personalizada
Você pode definir uma mensagem personalizada para a regra `confirmed` no campo de confirmação.

```ts
{
  'password_confirmation.confirmed': 'Password do not match'
}
```
