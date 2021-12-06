# Introdução
AdonisJS é uma das poucas estruturas Node.js (se não a única) com suporte de primeira classe para bancos de dados SQL. O Lucid capacita a camada de dados da estrutura e você deve instalar o pacote separadamente.

#### Instalar
```bash
npm i @adonisjs/lucid
```

#### Configurar
```bash
node ace configure @adonisjs/lucid

# CREATE: config/database.ts
# UPDATE: .env,.env.example
# UPDATE: tsconfig.json { types += "@adonisjs/lucid" }
# UPDATE: .adonisrc.json { commands += "@adonisjs/lucid/build/commands" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/lucid" }
```

#### Validar variáveis de ambiente
```bash
/**
 * Depending upon the database driver you are using, you must validate
 * the environment variables defined.
 *
 * The following is an example for PostgreSQL.
 */
export default Env.rules({
  PG_HOST: Env.schema.string({ format: 'host' }),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string(),
})
```

* Suporte para vários bancos de dados SQL. PostgreSQL , MySQL , MSSQL , MariaDB e SQLite .
* Construtor de consultas baseado em Knex.js
* Modelos de dados baseados em Active Record
* Sistema de migrações
* Fábricas de modelos e semeadores de banco de dados

[Ver no npm](https://npm.im/@adonisjs/lucid)
[Ver no Github](https://github.com/adonisjs/lucid)

## Configuração
A configuração de todos os drivers do banco de dados é armazenada dentro do config/database.tsarquivo.

```ts
import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
  // Conexão padrão
  connection: Env.get('DB_CONNECTION'),

  // Lista de conexões disponíveis
  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: Env.get('PG_HOST'),
        port: Env.get('PG_PORT'),
        user: Env.get('PG_USER'),
        password: Env.get('PG_PASSWORD', ''),
        database: Env.get('PG_DB_NAME'),
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },
  }
}

export default databaseConfig
```

### connection
A propriedade `connection` define a conexão padrão a ser usada para fazer consultas ao banco de dados. O valor depende da variável de ambiente `DB_CONNECTION`.

### connections
O objeto `connections` define uma ou mais conexões de banco de dados que você deseja usar em seu aplicativo. Você pode definir várias conexões usando o mesmo driver de banco de dados ou outro.

### migrations
A propriedade `migrations` define as configurações para as migrações do banco de dados. Ele aceita as seguintes opções.

| Opção |	Descrição |
|-------|-----------|
| **naturalSort**	| Use a classificação natural para classificar os arquivos de migração. A maioria dos editores usa a classificação natural e, portanto, as migrações serão executadas na mesma ordem em que você as vê listadas em seu editor. |

| **paths** |	Uma variedade de caminhos para procurar migrações. Você também pode definir um caminho para um pacote instalado. Por exemplo:

```
paths: [
  './database/migrations',
  '@somepackage/migrations-dir',
]
```
|
| **tableName** |	O nome da tabela para armazenar o estado das migrações. O padrão é adonis_schema. |
| **disableRollbacksInProduction** | Desative a reversão da migração na produção. É recomendável que você nunca reverta as migrações na produção.
| **disableTransactions** | Defina o valor como `true` para não envolver as instruções de migração dentro de uma transação. Por padrão, o Lucid executará cada arquivo de migração em sua própria transação. |
| **healthCheck** | Um booleano para habilitar / desabilitar verificações de saúde. |

### debug
Um booleano para habilitar globalmente a depuração de consultas. Você deve ler o [guia de depuração](https://docs.adonisjs.com/guides/database/debugging) para obter mais informações.

### seeders
O objeto `seeders` permite definir os caminhos para carregar os arquivos semeadores do banco de dados. Você também pode especificar um caminho para um pacote instalado. Por exemplo:

```ts
{
  seeders: {
    paths: ['./database/seeders', '@somepackage/seeders-dir']
  }
}
```

## Uso
A maneira mais fácil de fazer consultas SQL é usar o Construtor de consultas de banco de dados. Ele permite que você construa consultas SQL simples e complexas usando métodos JavaScript.

No exemplo a seguir, selecionamos todas as postagens da tabela `posts`.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'

Route.get('posts', async () => {
  return Database.from('posts').select('*')
})
```

Vamos classificar as postagens por id e também paginá-las.

```ts
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'

Route.get('posts', async ({ request }) => {
  const limit = 20
  const page = request.input('page', 1)

  return Database
    .from('posts')
    .select('*')
    .orderBy('id', 'desc') // 👈 obtêm o último primeiro
    .paginate(page, limit) // 👈 paginação usando número de páginas
})
```

Você não está limitado apenas às consultas selecionadas. Você também pode usar o construtor de consultas para realizar atualizações, inserções e exclusões.

#### Insira uma nova linha
```ts
const postId = await Database
  .table('posts')
  .insert({
    title: 'Adonis 101',
    description: 'Let\'s learn AdonisJS'
  })
  .returning('id') // Para PostgreSQL
```

#### Atualizar linha existente por id

```ts
const updatedRowsCount = await Database
  .from('posts')
  .where('id', 1)
  .update({ title: 'AdonisJS 101' })
 Excluir linha existente por id

const deletedRowsCount = await Database
  .from('posts')
  .where('id', 1)
  .delete()
```

#### Ler/escrever réplicas
AdonisJS oferece suporte a réplicas de leitura/gravação como cidadão de primeira classe. Você pode configurar um servidor de banco de dados de gravação, junto com vários servidores de leitura. Todas as consultas de leitura são enviadas aos servidores de leitura em rodízio e as consultas de gravação são enviadas ao servidor de gravação.

O Lucid não executa nenhuma replicação de dados para você. Portanto, você ainda precisa contar com seu servidor de banco de dados para isso.

A seguir está o exemplo de configuração para definir conexões de leitura/gravação. Nós mesclamos as propriedades definidas dentro do objeto `connection` com cada nó das conexões de leitura/gravação. Assim, você pode manter compartilhado `username` e `password` no objeto de conexão.

```ts
{
  connections: {
    mysql: {
      connection: {
        user: Env.get('MYSQL_USER'),
        password: Env.get('MYSQL_PASSWORD'),
        database: Env.get('MYSQL_DB_NAME'),
      },
      replicas: {
        read: {
          connection: [
            {
              host: '192.168.1.1',
            },
            {
              host: '192.168.1.2',
            },
          ]
        },
        write: {
          connection: {
            host: '196.168.1.3',
          },
        },
      },
    }
  }
}
```

### Pooling de conexão
O [pool de conexão](https://en.wikipedia.org/wiki/Connection_pool) é uma prática padrão de manutenção de conexões mínimas e máximas com o servidor de banco de dados.

As conexões mínimas são mantidas para melhorar o desempenho do aplicativo. Como estabelecer uma nova conexão é uma operação cara, é sempre recomendável ter algumas conexões prontas para executar as consultas ao banco de dados.

As conexões máximas são definidas para garantir que seu aplicativo não sobrecarregue o servidor de banco de dados com muitas conexões simultâneas.

> O Lucid irá enfileirar novas consultas quando o pool estiver cheio e espera que o pool tenha recursos livres até o tempo limite configurado. O tempo limite padrão é definido como 60 segundos e pode ser configurado usando a propriedade `pool.acquireTimeoutMillis`.

```ts
{
  mysql: {
    client: 'mysql',
    connection: {},
    pool: {
      acquireTimeoutMillis: 60 * 1000,
    }
  }
}
```

> Quanto maior o tamanho do pool, melhor será o desempenho. É um equívoco. Recomendamos que você leia este [documento](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing) para entender como o tamanho do pool menor pode aumentar o desempenho do aplicativo.

Você pode definir as configurações do pool para uma determinada conexão dentro do arquivo `config/database.ts`.

```ts
{
  connections: {
    mysql: {
      client: 'mysql',
      connection: {
      },
      pool: {
        min: 2,
        max: 20,
      },
      healthCheck: false,
    },
  }
}
```

### Alternando entre várias conexões
Usando o método '.connection', você pode alternar entre as conexões definidas dentro do arquivo `config/database.ts` usando o método `.connection`. Ele aceita o nome da conexão e retorna uma instância do [cliente Query](https://docs.adonisjs.com/reference/database/query-client).

```ts
import Database from '@ioc:Adonis/Lucid/Database'

Database
  .connection('mysql')
  .from('posts')
  .select('*')
```

### Fechando conexões
Você pode fechar as conexões de banco de dados abertas usando o .closemétodo. Normalmente, você deve deixar as conexões permanecerem para melhor desempenho, a menos que haja um motivo específico para fechá-las.

```ts
// Fecha uma conexão específica
await Database.manager.close('mysql')

// Fecha todas conexões
await Database.manager.closeAll()
```

## Verificações de saúde
Você pode habilitar [verificações de saúde](https://docs.adonisjs.com/guides/health-check#lucid-checker) para conexões de banco de dados registradas habilitando o sinalizador `healthCheck` booleano dentro do arquivo `config/database.ts`.

```ts
{
  pg: {
    client: 'pg',
    connection: {
      // ... detalhes da conexão
    },
    healthCheck: true, // 👈 habilitar
  }
}
```

## Configuração de drivers
A seguir está o exemplo de configuração para todos os drivers disponíveis. Você pode usá-lo como referência e ajustar as peças necessárias conforme necessário.

#### SQLite
```bash
npm i sqlite3
```

```bash
sqlite: {
  client: 'sqlite',
  connection: {
    filename: Application.tmpPath('db.sqlite3'),
  },
  migrations: {
    naturalSort: true,
  },
  useNullAsDefault: true,
  healthCheck: false,
  debug: false,
}
```

#### MySQL
```bash
npm i mysql
```

```ts
mysql: {
  client: 'mysql',
  connection: {
    host: Env.get('MYSQL_HOST'),
    port: Env.get('MYSQL_PORT'),
    user: Env.get('MYSQL_USER'),
    password: Env.get('MYSQL_PASSWORD', ''),
    database: Env.get('MYSQL_DB_NAME'),
  },
  migrations: {
    naturalSort: true,
  },
  healthCheck: false,
  debug: false,
}
```

### PostgreSQL
```bash
npm i pg
```
```ts
pg: {
  client: 'pg',
  connection: {
    host: Env.get('PG_HOST'),
    port: Env.get('PG_PORT'),
    user: Env.get('PG_USER'),
    password: Env.get('PG_PASSWORD', ''),
    database: Env.get('PG_DB_NAME'),
  },
  migrations: {
    naturalSort: true,
  },
  healthCheck: false,
  debug: false,
}
```

#### Oracle DB
```bash
npm i oracledb
```

```ts
oracle: {
  client: 'oracledb',
  connection: {
    host: Env.get('ORACLE_HOST'),
    port: Env.get('ORACLE_PORT'),
    user: Env.get('ORACLE_USER'),
    password: Env.get('ORACLE_PASSWORD', ''),
    database: Env.get('ORACLE_DB_NAME'),
  },
  migrations: {
    naturalSort: true,
  },
  healthCheck: false,
  debug: false,
}
```

#### MSSQL
```bash
npm i tedious
```

```ts
mssql: {
  client: 'mssql',
  connection: {
    user: Env.get('MSSQL_USER'),
    port: Env.get('MSSQL_PORT'),
    server: Env.get('MSSQL_SERVER'),
    password: Env.get('MSSQL_PASSWORD', ''),
    database: Env.get('MSSQL_DB_NAME'),
  },
  migrations: {
    naturalSort: true,
  },
  healthCheck: false,
  debug: false,
}
```
