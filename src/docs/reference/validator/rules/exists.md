# exists

Consulta o banco de dados para garantir que o valor exista dentro de uma determinada tabela e coluna do banco de dados.

::: info NOTA
A regra de validação é adicionada pelo pacote `@adonisjs/lucid`. Portanto, certifique-se de que ele esteja [instalado e configurado](../../../guides/database/setup.md), antes de usar esta regra.
:::

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  slug: schema.string([
    rules.exists({ table: 'categories', column: 'slug' })
  ])
}
```

## Insensibilidade a maiúsculas e minúsculas

Muitos bancos de dados realizam consultas que diferenciam maiúsculas de minúsculas. Portanto, você pode transformar o valor para `lowerCase` em JavaScript ou usar a opção `caseInsensitive` para converter o valor para minúsculas durante a consulta.

```ts
{
  username: schema.string([
    rules.exists({
      table: 'users',
      column: 'username',
      caseInsensitive: true,
    })
  ])
}
```

A seguir está um exemplo da consulta executada nos bastidores.

```sql
SELECT username FROM users WHERE LOWER(username) = LOWER(?)
```

## Restrições adicionais

Além disso, você também pode definir as restrições `where` e `whereNot` como um objeto de par chave-valor. A `key` é o nome da coluna.

```ts {6-9}
{
  slug: schema.string([
    rules.exists({
      table: 'categories',
      column: 'slug',
      where: {
        tenant_id: 1,
        status: 'active',
      },
    })
  ])
}
```

```sql
SELECT slug FROM categories
  WHERE slug = ?
  AND tenant_id = ?
  AND status = ?
```

Realizamos uma consulta `whereIn` se o valor for um **array**. Por exemplo:

```ts {4-6}
rules.exists({
  table: 'categories',
  column: 'slug',
  where: {
    group_id: [1, 2, 4],
  },
})
```

```sql
SELECT slug FROM categories
  WHERE slug = ?
  AND group_id IN (?, ?, ?)
```

## Usando refs

Se você estiver armazenando em cache seu esquema de validação usando `cacheKey` e suas **restrições where** dependerem de um valor de tempo de execução, você deverá usar refs.

```ts {8-10,17}
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public refs = schema.refs({
    tenantId: this.ctx.auth.user!.tenantId
  })

  public schema = schema.create({
    username: schema.string([
      rules.exists({
        table: 'users',
        column: 'username',
        where: { tenant_id: this.refs.tenantId },
      })
    ])
  })

}
```
