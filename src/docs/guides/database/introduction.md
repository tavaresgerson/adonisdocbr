# Introdução

AdonisJS é um dos poucos frameworks Node.js (se não o único) com suporte de primeira classe para bancos de dados SQL. O Lucid alimenta a camada de dados do framework, e você deve instalar o pacote separadamente.

::: code-group

```sh [Instale]
npm i @adonisjs/lucid@18.4.0
```

```sh [Configure]
node ace configure @adonisjs/lucid

# CREATE: config/database.ts
# UPDATE: .env,.env.example
# UPDATE: tsconfig.json { types += "@adonisjs/lucid" }
# UPDATE: .adonisrc.json { commands += "@adonisjs/lucid/build/commands" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/lucid" }
```

```ts [Validar variáveis ​​de ambiente]
/**
 * Dependendo do driver de banco de dados que você estiver usando, você deve validar
 * as variáveis ​​de ambiente definidas.
 *
 * O seguinte é um exemplo para PostgreSQL.
 */
export default Env.rules({
  PG_HOST: Env.schema.string({ format: 'host' }),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string(),
})
```

:::

- Suporte para vários bancos de dados SQL. **PostgreSQL**, **MySQL**, **MSSQL**, **MariaDB** e **SQLite**
- [Knex.js](https://knexjs.org)
- Modelos de dados baseados em Active Record
- Sistema de migrações
- Fábricas de modelos e seeders de banco de dados

&nbsp;

* [Visualizar no npm](https://npm.im/@adonisjs/lucid)
* [Visualizar no GitHub](https://github.com/adonisjs/lucid)

## Configuration
A configuração de todos os drivers de banco de dados é armazenada dentro do arquivo `config/database.ts`.

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

#### `connection`
A propriedade `connection` define a conexão padrão a ser usada para fazer consultas de banco de dados. O valor depende do ambiente `DB_CONNECTION`.

#### `connections`
O objeto `connections` define uma ou mais conexões de banco de dados que você deseja usar em seu aplicativo. Você pode definir várias conexões usando o mesmo driver de banco de dados ou um diferente.

#### `migrations`
A propriedade `migrations` configura as configurações para as migrações de banco de dados. Ela aceita as seguintes opções.

<table>
<thead>
<tr>
<th>Opção</th>
<th>Descrição</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>naturalSort</strong></td>
<td>Use a classificação natural para classificar os arquivos de migração. A maioria dos editores usa classificação natural e, portanto, as migrações serão executadas na mesma ordem em que você as vê listadas no seu editor.</td>
</tr>
<tr>
<td><strong>paths</strong></td>
<td>
  <p>
    Uma matriz de caminhos para procurar migrações. Você também pode definir um caminho para um pacote instalado. Por exemplo:
  </p>

```ts
paths: [
  './database/migrations',
  '@somepackage/migrations-dir',
]
```

</td>
</tr>
<tr>
<td><strong>tableName</strong></td>
<td>O nome da tabela para armazenar o estado das migrações. O padrão é <code>adonis_schema</code>.</td>
</tr>
<tr>
<td><strong>disableRollbacksInProduction</strong></td>
<td>Desabilite o rollback de migração em produção. É recomendado que você nunca faça rollback de migrações em produção.</td>
</tr>
<tr>
<td><strong>disableTransactions</strong></td>
<td>Defina o valor como <code>true</code> para não encapsular instruções de migração dentro de uma transação. Por padrão, o Lucid executará cada arquivo de migração em sua própria transação.</td>
</tr>
</tbody>
</table>

#### `healthCheck`

Um booleano para habilitar/desabilitar verificações de integridade.

#### `debug`

Um booleano para habilitar globalmente a depuração de consultas. Você deve ler o [guia de depuração](./debugging.md) para obter mais informações.

#### `seeders`
O objeto `seeders` permite que você defina os caminhos para carregar os arquivos do seeder do banco de dados. Você também pode especificar um caminho para um pacote instalado. Por exemplo:

```ts
{
  seeders: {
    paths: ['./database/seeders', '@somepackage/seeders-dir']
  }
}
```

## Uso
A maneira mais fácil de fazer consultas SQL é usar o construtor de consultas do banco de dados. Ele permite que você construa consultas SQL simples e complexas usando métodos JavaScript.

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
    .orderBy('id', 'desc') // 👈 get latest first
    .paginate(page, limit) // 👈 paginate using page numbers
})
```

Você não está limitado apenas às consultas selecionadas. Você também pode usar o construtor de consultas para executar **atualizações**, **inserções** e **exclusões**.

#### Inserir uma nova linha

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
```

#### Excluir linha existente por id

```ts
const deletedRowsCount = await Database
  .from('posts')
  .where('id', 1)
  .delete()
```

## Réplicas de leitura/gravação
O AdonisJS suporta **réplicas de leitura/gravação** como um cidadão de primeira classe. Você pode configurar um servidor de banco de dados de gravação, juntamente com vários servidores de leitura. Todas as consultas de leitura são enviadas para os servidores de leitura em **modo round-robin**, e as consultas de gravação são enviadas para o servidor de gravação.

::: info NOTA
O Lucid não executa nenhuma replicação de dados para você. Então você ainda tem que confiar no seu servidor de banco de dados para isso.
:::

A seguir está o exemplo de configuração para definir conexões de leitura/gravação. Nós mesclamos as propriedades definidas dentro do objeto `connection` com cada nó das conexões de leitura/gravação. Então, você pode manter o `username` e `password` compartilhados no objeto de conexão.

```ts
{
  connections: {
    mysql: {
      connection: {
        user: Env.get('MYSQL_USER'),
        password: Env.get('MYSQL_PASSWORD'),
        database: Env.get('MYSQL_DB_NAME'),
      },
      replicas: { // [!code highlight]
        read: {   // [!code highlight]
          connection: [ // [!code highlight]
            {         // [!code highlight]
              host: '192.168.1.1',  // [!code highlight]
            },                      // [!code highlight]
            {                       // [!code highlight]
              host: '192.168.1.2',  // [!code highlight]
            },                      // [!code highlight]
          ]                         // [!code highlight]
        },                          // [!code highlight]
        write: {                    // [!code highlight]
          connection: {             // [!code highlight]
            host: '196.168.1.3',    // [!code highlight]
          },                        // [!code highlight]
        },                          // [!code highlight]
      },                            // [!code highlight]
    }
  }
}
```

## Pool de conexões
[Pool de conexões](https://en.wikipedia.org/wiki/Connection_pool) é uma prática padrão de manter conexões mínimas e máximas com o servidor de banco de dados.

As **conexões mínimas** são mantidas para melhorar o desempenho do aplicativo. Como estabelecer uma nova conexão é uma operação cara, é sempre recomendado ter algumas conexões prontas para executar as consultas de banco de dados.

As **conexões máximas** são definidas para garantir que seu aplicativo não sobrecarregue o servidor de banco de dados com muitas conexões simultâneas.

O Lucid enfileirará novas consultas quando o pool estiver cheio e aguardará que o pool tenha recursos livres até o tempo limite configurado. O tempo limite padrão é definido como **60 segundos** e pode ser configurado usando a propriedade `pool.acquireTimeoutMillis`.

```ts
{
  mysql: {
    client: 'mysql2',
    connection: {},
    pool: {                             // [!code highlight]
      acquireTimeoutMillis: 60 * 1000,  // [!code highlight]
    }                                   // [!code highlight]
  }
}
```

::: tip DICA
Quanto maior o tamanho do pool, melhor o desempenho é um equívoco. Recomendamos que você leia este [documento](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing) para entender como o tamanho menor do pool pode aumentar o desempenho do aplicativo.
:::

Você pode configurar as configurações do pool para uma determinada conexão dentro do arquivo `config/database.ts`.

```ts
{
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
      },
      pool: {           // [!code highlight]
        min: 2,         // [!code highlight]
        max: 20,        // [!code highlight]
      },                // [!code highlight]
      healthCheck: false,
    },
  }
}
```

## Alternando entre várias conexões
Usando o método ' .connection ', você pode alternar entre as conexões definidas dentro do arquivo `config/database.ts` usando o método `.connection`. Ele aceita o nome da conexão e retorna uma instância do [cliente de consulta](../../reference/database/query-client.md)

```ts
import Database from '@ioc:Adonis/Lucid/Database'

Database
  .connection('mysql')
  .from('posts')
  .select('*')
```

## Fechando conexões
Você pode fechar as conexões de banco de dados abertas usando o método `.close`. Normalmente, você deve deixar as conexões permanecerem para melhor desempenho, a menos que tenha um motivo específico para fechá-las.

```ts
// Fechar uma conexão específica
await Database.manager.close('mysql')

// Feche todas as conexões
await Database.manager.closeAll()
```

## Verificações de integridade
Você pode habilitar [verificações de integridade](../digging-deeper/health-check.md#lucid-checker) para conexões de banco de dados registradas habilitando o sinalizador booleano `healthCheck` dentro do arquivo `config/database.ts`.

```ts
{
  pg: {
    client: 'pg',
    connection: {
      // ... detalhes de conexão
    },
    healthCheck: true, // 👈 habilitado
  }
}
```

## Configuração de drivers
A seguir está a configuração de exemplo para todos os drivers disponíveis. Você pode usá-la como referência e ajustar as partes necessárias conforme necessário.

<details>
  <summary>SQLite</summary>

```sh
npm i sqlite3
```

```ts
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

</details>

<details>
  <summary>MySQL</summary>

```sh
npm i mysql2
```

```ts
mysql: {
  client: 'mysql2',
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

You can also connect to a MySQL database using the Unix domain socket.

```ts
mysql: {
  connection: {
    socketPath : '/path/to/socket.sock',
    user: Env.get('MYSQL_USER'),
    password: Env.get('MYSQL_PASSWORD', ''),
    database: Env.get('MYSQL_DB_NAME'),
  }
}
```

</details>


<details>
  <summary>PostgreSQL</summary>

```sh
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

</details>


<details>
  <summary>Oracle DB</summary>

```sh
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

</details>

<details>
  <summary>MSSQL</summary>

```sh
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
</details>
