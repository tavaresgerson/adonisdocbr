# Usando analisadores de tipo personalizados do Postgres

Este guia aborda o processo de uso do adaptador pg para substituir como um tipo de dado específico é analisado e transformado em um tipo JavaScript.

Por padrão, o servidor de backend PostgreSQL retorna tudo como strings.

Por exemplo, isso pode ser problemático se você precisar que sua API retorne o tipo JavaScript Number para todas as colunas decimais que você tem no banco de dados.

Para corrigir isso, você pode fazer o driver subjacente [node-postgres](https://node-postgres.com/api/client) desconsiderar a segurança da conversão e converter suas colunas para os tipos desejados.

::: info NOTA
O JavaScript não tem suporte para inteiros de 64 bits e o node-postgres não pode analisar com segurança os resultados do tipo de dado int8 como números porque se você tiver um número enorme, ele irá estourar e o resultado que você obteria do node-postgres não seria o resultado no banco de dados.

**Então use isso somente se você sabe que nunca terá números maiores que int4 no seu banco de dados.**
:::

## Obtendo o valor OID do tipo PostgreSQL

Digamos que queremos analisar todas as colunas `decimal` para `float`. Primeiro precisamos encontrar o valor `OID` do tipo `NUMERIC` PostgreSQL.

::: info NOTA
Cada tipo de dado corresponde a um OID exclusivo dentro do servidor, e esses OIDs são enviados de volta com a resposta da consulta. Então, você precisa corresponder um OID específico a uma função que você gostaria de usar para pegar a entrada de texto bruto e produzir um objeto JavaScript válido como resultado.
:::

Para fazer isso, podemos executar esta consulta no banco de dados:

```sql
select typname, oid, typarray from pg_type order by oid
```

Mas há uma maneira mais simples e fácil de fazer isso. Temos todos os tipos enumerados se importarmos `import { types } from 'pg'`.

## Usando o método setTypeParser para analisar tipos

::: info NOTA
Certifique-se de ter o driver `PostgreSQL` instalado.
:::

Precisamos chamar o método pg.setTypeParser dentro do AppProvider.ts para configurar nossos analisadores de tipo personalizados.

```ts
// providers/AppProvider.ts

import { types } from 'pg' // estamos importando tipos de pg, então podemos usar enums existentes

export default class AppProvider {
  constructor(protected app: ApplicationContract) {
  }

  public register() {
  }

  public async boot() {
    // -- é aqui que a mágica acontece!
    types.setTypeParser(types.builtins.NUMERIC, function(val) {
      return parseFloat(val)
    })

    // ... resto do AppProvider.ts
  }
}
```

## Faça o driver usar BigInt automaticamente para BIGINT + BIGSERIAL
Mais um exemplo é como podemos utilizar isso para converter os tipos BIGINT e BIGSERIAL PostgreSQL para JavaScript BigInt:

```ts
// INT8 é OID 20 que corresponde a: BIGINT | BIGSERIAL
types.setTypeParser(types.builtins.INT8, BigInt)
```
