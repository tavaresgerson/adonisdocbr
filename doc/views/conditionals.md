# Condicionais
Você pode escrever condicionais usando as tags `@if`, `@elseif` e `@else`. Todas as três tags funcionam de forma semelhante 
às instruções `if/else` do JavaScript.

```edge
@if(user)
  <p> {{ user.username }} </p>
@end
```

```edge
@if(user.fullName)
  <p> Hello {{ user.fullName }}! </p>
@elseif(user.firstName)
  <p> Hello {{ user.firstName }}! </p>
@else
  <p> Hello Guest! </p>
@end
```

O inverso da tag `@if` é a `@unless`. Você pode achar expressivo escrever as declarações NOT IF.

```
@unless(account.isActive)
  <p> Please verify the email address to activate your account </p>
@end
```
