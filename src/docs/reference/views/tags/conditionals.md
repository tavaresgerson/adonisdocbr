# if/elseif/else

As tags `@if`, `@elseif` e `@else` permitem que você escreva condicionais dentro dos modelos Edge.

- As tags `@if` e `@elseif` aceitam a expressão a ser avaliada como o único argumento.
- Somente a tag `@if` precisa ser fechada explicitamente com a declaração `@end`. Outras tags devem aparecer dentro do bloco if de abertura e fechamento.

```edge
<!-- Início do if -->
@if(user.fullName)
  <p> Hello {{ user.fullName }}! </p>
@elseif(user.firstName)
  <p> Hello {{ user.firstName }}! </p>
@else
  <p> Hello Guest! </p>
<!-- Fim do if -->
@end
```

Você pode usar a tag `@unless` no lugar da tag `@if` para escrever uma declaração if inversa.

```edge
@unless(account.isActive)
  <p> Please verify the email address to activate your account </p>
@end
```
