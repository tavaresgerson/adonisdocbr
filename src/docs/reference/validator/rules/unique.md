# unique

Consulta o banco de dados para garantir que o valor **NÃO exista** dentro de uma determinada tabela e coluna do banco de dados.

::: info NOTA
A regra de validação é adicionada pelo pacote `@adonisjs/lucid`. Portanto, certifique-se de que ele esteja [instalado e configurado](../../../guides/database/setup.md), antes de usar esta regra.
:::

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  email: schema.string([
    rules.unique({ table: 'users', column: 'email' })
  ])
}
```

## Insensibilidade a maiúsculas e minúsculas

Muitos bancos de dados realizam consultas que diferenciam maiúsculas de minúsculas. Portanto, você pode transformar o valor para `lowerCase` em JavaScript ou usar a opção `caseInsensitive` para converter o valor para minúsculas durante a consulta.

```ts
{
  email: schema.string([
    rules.unique({
      table: 'users',
      column: 'email',
      caseInsensitive: true,
    })
  ])
}
```

A seguir, um exemplo da consulta executada nos bastidores.

```sql
SELECT email FROM users WHERE LOWER(email) = LOWER(?)
```

## Restrições adicionais

Além disso, você também pode definir as restrições `where` e `whereNot` como um objeto de par chave-valor. A `key` é o nome da coluna.

```ts {6-8}
{
  email: schema.string([
    rules.unique({
      table: 'users',
      column: 'email',
      where: {
        tenant_id: 1,
      },
    })
  ])
}
```

```sql
SELECT email FROM users WHERE email = ? AND tenant_id = ?
```

Realizamos uma consulta `whereIn` se o valor for um **array**. Por exemplo:

```ts {4-6}
rules.unique({
  table: 'users',
  column: 'email',
  where: {
    account_type: ['member', 'vip'],
  },
})
```

```sql
SELECT string FROM users
  WHERE email = ?
  AND account_type IN (?, ?)
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
    email: schema.string([
      rules.unique({
        table: 'users',
        column: 'email',
        where: { tenant_id: this.refs.tenantId },
      })
    ])
  })
}
```
