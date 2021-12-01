# unique

Consulta o banco de dados para garantir que o valor NÃO exista dentro de uma determinada tabela e coluna do banco de dados.

A regra de validação é adicionada pelo pacote `@adonisjs/lucid`. Portanto, certifique-se de que ele esteja instalado e configurado antes de usar esta regra.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  email: schema.string({}, [
    rules.unique({ table: 'users', column: 'email' })
  ])
}
```

## Insensibilidade a maiúsculas e minúsculas

Muitos bancos de dados realizam consultas com distinção entre maiúsculas e minúsculas. Portanto, você pode transformar o valor em `lowerCase` com o JavaScript ou usar a opção `caseInsensitive` para converter o valor em minúsculas durante a consulta.

```ts
{
  email: schema.string({}, [
    rules.unique({
      table: 'users',
      column: 'email',
      caseInsensitive: true,
    })
  ])
}
```

A seguir está um exemplo da consulta executada nos bastidores.

```sql
SELECT email FROM users WHERE LOWER(email) = LOWER(?)
```

## Restrições adicionais
Além disso, você também pode definir restrições `where` e `whereNot` como um objeto de par de valores-chave. O `key` é o nome da coluna.

```ts
{
  email: schema.string({}, [
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

Realizamos uma consulta `whereIn` se o valor for um array. Por exemplo:

```ts
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
Se você estiver armazenando em cache seu esquema de validação usando o `cacheKey` e suas restrições `where` dependem de um valor em tempo de execução, então você deve fazer uso de refs.

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
    email: schema.string({}, [
      rules.unique({
        table: 'users',
        column: 'email',
        where: { tenant_id: this.refs.tenantId },
      })
    ])
  })
}
```
