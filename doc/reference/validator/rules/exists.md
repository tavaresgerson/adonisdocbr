# exists
Consulta o banco de dados para garantir que o valor existe dentro de uma determinada tabela e coluna do banco de dados.

A regra de validação é adicionada pelo pacote `@adonisjs/lucid`. Portanto, certifique-se de que ele esteja instalado e configurado antes de usar esta regra.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  slug: schema.string({}, [
    rules.exists({ table: 'categories', column: 'slug' })
  ])
}
```

## Insensibilidade a maiúsculas e minúsculas
Muitos bancos de dados realizam consultas com distinção entre maiúsculas e minúsculas. Portanto, você pode transformar o valor em `lowerCase` no JavaScript ou usar a opção `caseInsensitive` para converter o valor em minúsculas durante a consulta.

```ts
{
  username: schema.string({}, [
    rules.exists({
      table: 'users',
      column: 'username',
      caseInsensitive: true,
    })
  ])
}
```

A seguir está um exemplo da consulta executada nos bastidores.

```ts
SELECT username FROM users WHERE LOWER(username) = LOWER(?)
```

## Restrições adicionais
Além disso, você também pode definir restrições `where` e `whereNot` como um objeto de par de valores-chave. O `key` é o nome da coluna.

```ts
{
  slug: schema.string({}, [
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

Realizamos uma consulta `whereIn` se o valor for um array. Por exemplo:

```ts
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
Se você estiver armazenando em cache seu esquema de validação usando o `cacheKey` e suas restrições `where` dependem de um valor de tempo de execução, então você deve fazer uso de refs.

```ts
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public refs = schema.refs({
    tenantId: this.ctx.auth.user!.tenantId
  })

  public schema = schema.create({
    username: schema.string({}, [
      rules.exists({
        table: 'users',
        column: 'username',
        where: { tenant_id: this.refs.tenantId },
      })
    ])
  })

}
```
