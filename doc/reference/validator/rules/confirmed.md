# confirmed
Aplica no campo de validação uma verificação para confirmar se os valores são iguais usando a convenção `_confirmation`. Você usará essa regra principalmente para confirmação de senha.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  password: schema.string({}, [
    rules.confirmed()
  ])
}

/**
 Dado válido: {
    password: 'secret',
    password_confirmation: 'secret'
 }
 */
 ```
 
Opcionalmente, você também pode alterar o nome do campo que deve ser verificado para a confirmação. Geralmente é útil quando você não está usando a convenção `snake_case` para os nomes dos campos.

```ts
{
  password: schema.string({}, [
    rules.confirmed('passwordConfirmation')
  ])
}

/**
 Dado válido: {
    password: 'secret',
    passwordConfirmation: 'secret'
 }
 */
 ```
 
