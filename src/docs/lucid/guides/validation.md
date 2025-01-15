---
summary: Regras de validação adicionadas ao VineJS por meio do contêiner AdonisJS
---

# Regras de validação

O Lucid adiciona regras de validação ao VineJS para usar em seus esquemas. Por baixo dos panos, ele registra um provedor em seu aplicativo AdonisJS que estende as regras do VineJS.
Você pode ler mais nos [documentos do AdonisJS](https://docs.adonisjs.com/guides/concepts/service-providers#service-providers) e [documentos do VineJS](https://vinejs.dev/docs/extend/custom_rules).

Você pode usar essas regras diretamente do seu esquema VineJS. Por exemplo, a regra `unique`:

```ts {6-9}
import vine from '@vinejs/vine'

const schema = vine.object({
  email: vine
    .string()
    .unique({
      table: 'users',
      column: 'email',
    }),
})
```

## Unique

Garanta que o valor seja exclusivo (não exista) dentro de uma determinada tabela e coluna do banco de dados.

::: info NOTA
A regra é uma macro para `VineString` e `VineNumber`, então você pode usá-la depois de `vine.string()` ou `vine.number()`.
:::

Você pode passar um retorno de chamada para consultar o banco de dados diretamente ou um objeto:

[callback](https://github.com/adonisjs/lucid/blob/21.x/src/types/vine.ts#L61-L65) deve retornar `true` se o valor for único (não existir) ou `false` se o valor já existir.
[objeto de opções](https://github.com/adonisjs/lucid/blob/21.x/src/types/vine.ts#L17-L55) para especificar a tabela e a coluna.

```ts {5-8,15}
// Uso com retorno de chamada
const schema = vine.object({
  email: vine
    .string()
    .unique((db, value) => {
      const row = await db.from('users').where('email', value).first()
      return row === null
    }),
})

// Uso com opções
const schema = vine.object({
  email: vine
    .string()
    .unique({ table: 'users', column: 'email' }),
})
```

Você também pode usar seu modelo Lucid diretamente dentro do retorno de chamada:

```ts {4-7}
const schema = vine.object({
  email: vine
    .string()
    .unique((_, value) => {
      const row = await User.findBy('email', value)
      return row ? false : true
    }),
})
```

## Exists

Garanta que o valor exista dentro de uma determinada tabela e coluna do banco de dados. Este é o inverso da regra exclusiva.

::: info NOTA
A regra também é uma macro para `VineString` e `VineNumber`, então você pode usá-la depois de `vine.string()` ou `vine.number()`.
:::

Você pode passar um retorno de chamada para consultar o banco de dados diretamente ou um objeto:

* [Retorno de chamada](https://github.com/adonisjs/lucid/blob/21.x/src/types/vine.ts#L61-L65) deve retornar `true` se o valor existir, `false` caso contrário.
* [Objeto de opções](https://github.com/adonisjs/lucid/blob/21.x/src/types/vine.ts#L17-L55) para especificar a tabela e a coluna.

```ts {5-8,15}
// Uso com retorno de chamada
const schema = vine.object({
  slug: vine
    .string()
    .exists((db, value) => {
      const row = await db.from('categories').where('slug', value).first()
      return row ? true : false
    }),
})

// Uso com opções
const schema = vine.object({
  slug: vine
    .string()
    .exists({ table: 'categories', column: 'slug' }),
})
```
