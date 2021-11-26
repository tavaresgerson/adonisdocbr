# file
Valida a propriedade para ser um [arquivo multiparte](https://docs.adonisjs.com/guides/file-uploads#retrieving-uploaded-files) válido analisado pelo bodyparser. Você também pode definir opções adicionais para validar o tamanho do arquivo e o nome da extensão.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'

{
  cover_image: schema.file({
    size: '2mb',
    extnames: ['jpg', 'gif', 'png'],
  }),
}
```

## Defina regras adicionais
Atualmente, NÃO há regras disponíveis para o tipo de esquema de arquivo. No entanto, se você criar um, poderá passá-lo como o segundo argumento.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  cover_image: schema.file(
    {
      size: '2mb',
      extnames: ['jpg', 'gif', 'png'],
    },
    [
      // NOTA: Esta regra não existe.
      rules.dimensions({ minWidth: 100, minHeight: 200 })
    ]
  ),
}
```
