---
summary: "Aprenda a testar código que interage com seus bancos de dados no AdonisJS: etapas simples para configurar, redefinir e manter bancos de dados limpos durante os testes."
---

# Testes de banco de dados

Testes de banco de dados referem-se a testar como seu aplicativo interage com o banco de dados. Isso inclui testar o que é escrito no banco de dados, como executar migrações antes dos testes e como manter o banco de dados limpo entre os testes.

## Migrando o banco de dados

Antes de executar seus testes que interagem com o banco de dados, você deve executar suas migrações primeiro. Temos dois ganchos disponíveis no serviço `testUtils` para isso, que você pode configurar dentro do arquivo `tests/bootstrap.ts`.

### Redefinir banco de dados após cada ciclo de execução

A primeira opção que temos é `testUtils.db().migrate()`. Este gancho executará primeiro todas as suas migrações e, em seguida, reverterá tudo.

```ts
// title: tests/bootstrap.ts
import testUtils from '@adonisjs/core/services/test_utils'

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    () => testUtils.db().migrate(),
  ],
  teardown: [],
}
```

Ao configurar o gancho aqui, o que vai acontecer é:

- Antes de executar nossos testes, as migrações serão executadas.
- No final de nossos testes, o banco de dados será revertido.

Então, cada vez que executarmos nossos testes, teremos um banco de dados novo e vazio.

### Truncar tabelas após cada ciclo de execução

Redefinir o banco de dados após cada ciclo de execução é uma boa opção, mas pode ser lento se você tiver muitas migrações. Outra opção é truncar as tabelas após cada ciclo de execução. Esta opção será mais rápida, pois as migrações serão executadas apenas uma vez: a primeira vez que você executar seus testes em um banco de dados novo.

No final de cada ciclo de execução, as tabelas serão apenas truncadas, mas nosso esquema será mantido. Então, na próxima vez que executarmos nossos testes, teremos um banco de dados vazio, mas o esquema já estará em vigor, então não há necessidade de executar cada migração novamente.

```ts
// title: tests/bootstrap.ts
import testUtils from '@adonisjs/core/services/test_utils'

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    () => testUtils.db().truncate(),
  ],
}
```

## Semeando o banco de dados

Se você precisar semear seu banco de dados, você pode usar o gancho `testUtils.db().seed()`. Este gancho executará todas as suas sementes antes de executar seus testes.

```ts
// title: tests/bootstrap.ts
import testUtils from '@adonisjs/core/services/test_utils'

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    () => testUtils.db().seed(),
  ],
}
```

## Mantendo o banco de dados limpo entre os testes

### Transação global

Ao executar testes, você pode querer manter seu banco de dados limpo entre cada teste. Para isso, você pode usar o gancho `testUtils.db().withGlobalTransaction()`. Este gancho iniciará uma transação antes de cada teste e a reverterá no final do teste.

```ts
// title: tests/unit/user.spec.ts
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('User', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
})
```

Observe que se você estiver usando qualquer transação em seu código testado, isso não funcionará, pois as transações não podem ser aninhadas. Neste caso, você pode usar o gancho `testUtils.db().migrate()` ou `testUtils.db().truncate()`.

### Truncar tabelas

Como mencionado acima, a transação global não funcionará se você estiver usando transações no seu código testado. Neste caso, você pode usar o hook `testUtils.db().truncate()`. Este hook truncará todas as suas tabelas após cada teste.

```ts
// title: tests/unit/user.spec.ts
import { test } from '@japa/runner'

test.group('User', (group) => {
  group.each.setup(() => testUtils.db().truncate())
})
```
