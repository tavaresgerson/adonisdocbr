# string

Valida a propriedade para ser uma string válida. Opcionalmente, você pode definir essas opções para cortar os espaços em branco e escapar tags HTML.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'

{
  title: schema.string({
    escape: true,
    trim: true
  })
}
```

* A opção `escape` irá converter `<`, `>`, `&`, `'`, `"` e `/` para entidades HTML.
* A opção `trim` remove o espaço em branco em torno do conteúdo

## Marcar como opcional
Você pode marcar a propriedade como opcional encadeando o método `optional`. Apenas os valores `undefined` são considerados opcionais. Tratamos `null` como um valor válido e ele falhará na validação da string.

```ts
{
  title: schema.string.optional({
    escape: true,
    trim: true
  })
}
```

## Defina regras adicionais
Você pode definir uma série de regras adicionais como o segundo parâmetro.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  title: schema.string({}, [
    rules.alpha(),
    rules.minLength(10),
    rules.maxLength(200)
  ])
}
```
