# Usando Knex Postgis com Lucid

Os guias abrangem o processo de uso da extensão Knex Postgis com o Lucid ORM.

O [knex-postgis](https://github.com/jfgodoy/knex-postgis) é um pacote npm que se conecta a uma instância do Knex e fornece a API JavaScript para usar as funções [Postgis](https://postgis.net/).

Como o Lucid usa o Knex por baixo dos panos, você pode usar este pacote em seus aplicativos AdonisJS.

## Estendendo o módulo Database

::: info NOTA
Certifique-se de usar `@adonisjs/lucid >= 16.13.1` para seguir este livro de receitas.
:::

Se você olhar a documentação de uso do `knex-postgis`, verá que ele precisa de uma instância da conexão knex e retorna um objeto com os métodos disponíveis.

```ts
// Uso com Knex diretamente

const knex = require('knex')
const knexPostgis = require('knex-postgis')

// Conexão Knex
const db = knex({ client: 'postgres' })

// O valor de retorno "st" tem a extensão API para Postgis
const st = knexPostgis(db)
```

Como o gerenciamento de conexões é abstraído com o Lucid, precisamos de uma API elegante para capturar o objeto `st` para qualquer conexão sob demanda.

Podemos fazer isso estendendo a classe Database e adicionando um método `st` a ela. Para simplificar, escreverei o seguinte código dentro de um [arquivo preload.](/docs/guides/http/routing.md#register-as-a-preload-file)

```ts
// start/db.ts

import knexPostgis from 'knex-postgis'
import Database from '@ioc:Adonis/Lucid/Database'

Database.Database.macro('st', function (connectionName?: string) {
  connectionName = connectionName || this.primaryConnectionName
  this.manager.connect(connectionName)

  const connection = this.getRawConnection(connectionName)!.connection!

  /**
   * Certifique-se de que estamos lidando com uma conexão PostgreSQL
   */
  if (connection.dialectName !== 'postgres') {
    throw new Error('The "st" function can only be used with PostgreSQL')
  }

  /**
   * Configurar extensão se ainda não estiver configurada
   */
  if (!connection.client!['postgis']) {
    knexPostgis(connection.client!)
    if (connection.hasReadWriteReplicas) {
      knexPostgis(connection.readClient!)
    }
  }

  return connection.client!['postgis']
})
```

Vamos percorrer o trecho de código acima.

1. Começamos adicionando um novo método, `st`, ao módulo Database.
2. O método aceita o nome da conexão para a qual queremos configurar a extensão Postgis e retorna uma instância do pacote `knex-postgis` para essa conexão específica.
3. Se a conexão tiver réplicas de leitura e gravação, configuramos a conexão para as conexões de leitura e gravação.

### Notificando o TypeScript sobre o novo método
Vamos criar um novo arquivo dentro do diretório `contracts`. Aqui, usaremos [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) para adicionar o método `st`.

```ts
declare module '@ioc:Adonis/Lucid/Database' {
  import { KnexPostgis } from 'knex-postgis'

  interface DatabaseContract {
    st(): KnexPostgis
  }
}
```

### Acessar instância `st` para uma conexão
Você pode acessar a instância `st` para uma determinada conexão da seguinte maneira.

```ts
Database.st()           // conexão padrão
Database.st('primary')  // conexão nomeada
```

## Selecionar colunas como texto
Você pode converter colunas em sua representação de texto usando o método `asText`.

```ts
import Database from '@ioc:Adonis/Lucid/Database'

await Database
  .from('points')
  .select(
    'id',
    Database.st().asText('geom')
  )
```

## Inserir valores
Você pode inserir valores usando os [métodos espaciais disponíveis](https://github.com/jfgodoy/knex-postgis#currently-supported-functions).

```ts
import Database from '@ioc:Adonis/Lucid/Database'

await Database.table('points').insert({
  geom: Database.st().geomFromText('Point(0 0)', 4326)
})
```

### Inserir usando modelos
Ao usar modelos, você pode usar o método `prepare` para converter o valor da string em uma consulta bruta ou marcar a coluna como `any` para atribuir consultas brutas diretamente.

#### Usando o hook `prepare`

Ao usar modelos, certifique-se de marcar a coluna como `any` para atribuir valores brutos a ela.

```ts
class Point {
  @column({
    prepare: (value?: string) => {
      return value ? Database.st().geomFromText(value, 4326) : value
    }
  })
  public geom: string
}

const point = new Point()
point.geom = 'Point(0 0)'
await point.save()
```

#### Atribuindo consultas brutas diretamente
Certifique-se de marcar o tipo de coluna como `any` ao atribuir consultas brutas diretamente.

```ts
class Point {
  @column()
  public geom: any // 👈 Certifique-se de que o tipo é qualquer
}

const point = new Point()
point.geom = Database.st().geomFromText('Point(0 0)', 4326)
await point.save()
```
