# Instalação e uso

O Lucid vem pré-configurado com os kits iniciais `web` e `api`. No entanto, você pode instalá-lo e configurá-lo manualmente da seguinte forma dentro de um projeto AdonisJS.

Instale o pacote do registro de pacotes npm usando um dos seguintes comandos.

:::code-group

```sh [npm]
npm i @adonisjs/lucid
```

```sh [yarn]
yarn add @adonisjs/lucid
```

```sh [pnpm]
pnpm add @adonisjs/lucid
```

:::

Uma vez feito isso, você deve executar o seguinte comando para configurar o Lucid. Opcionalmente, você pode especificar o dialeto do banco de dados que deseja usar usando o sinalizador `--db`. A seguir está a lista de opções válidas.

- `sqlite`
- `postgres`
- `mysql`
- `mssql`

```sh
node ace configure @adonisjs/lucid

# Configurar com MYSQL
node ace configure @adonisjs/lucid --db=mysql
```

::: details Veja as etapas executadas pelo comando configure

1. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

   ```ts
   {
     providers: [
       // ...outros provedores
       () => import('@adonisjs/lucid/database_provider'),
     ]
   }
   ```

2. Registra o seguinte comando dentro do arquivo `adonisrc.ts`.

   ```ts
   {
     commands: [
       // ...outros comandos
       () => import('@adonisjs/lucid/commands'),
     ]
   }
   ```

3. Crie o arquivo `config/database.ts`.

4. Defina as variáveis ​​de ambiente e suas validações para o dialeto selecionado.

5. Instale as dependências de peer necessárias.

:::

## Configuração

A configuração do Lucid é armazenada dentro do arquivo `config/database.ts`.

Veja também: [Stubs de configuração do Lucid](https://github.com/adonisjs/presets/tree/develop/src/lucid/stubs/config/database)

```ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
```

### `connection`

A conexão padrão a ser usada para fazer consultas. O valor deve ser uma referência a uma das `connections` definidas no mesmo arquivo de configuração.

### `connections`

O objeto `connections` é uma coleção de conexões de banco de dados nomeadas que você deseja usar. As conexões são inicializadas lentamente quando você executa uma consulta pela primeira vez.

### connections.`name`.connection

O valor da propriedade `connection` é o mesmo que o [objeto de configuração](https://knexjs.org/guide/#configuration-options) aceito pelo Knex.

## Configurando réplicas de leitura e gravação

O Lucid oferece suporte a réplicas de leitura e gravação como um cidadão de primeira classe. Você pode configurar um servidor de banco de dados de gravação, juntamente com vários servidores de leitura. Todas as consultas de leitura são enviadas para os servidores de leitura em rodízio, e as consultas de gravação são enviadas para o servidor de gravação.

::: info NOTA
O Lucid não executa nenhuma replicação de dados para você. Portanto, você ainda precisa confiar no seu servidor de banco de dados para isso.
:::

No exemplo a seguir, definimos um servidor de gravação e duas réplicas de leitura. Como o Lucid mesclará as propriedades do objeto `connection` com cada nó de objetos de conexão de leitura-gravação, você não precisa repetir as propriedades `username` e `password`.

```ts
const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),       // [!code --]
        port: env.get('DB_PORT'),       // [!code --]
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      replicas: {                     // [!code ++]
        read: {                       // [!code ++]
          connection: [               // [!code ++]
            {                         // [!code ++]
              host: '192.168.1.1',    // [!code ++]
            },                        // [!code ++]
            {                         // [!code ++]
              host: '192.168.1.2',    // [!code ++]
            },                        // [!code ++]
          ],                          // [!code ++]
        },                            // [!code ++]
        write: {                      // [!code ++]
          connection: {               // [!code ++]
            host: '196.168.1.3',      // [!code ++]
          },                          // [!code ++]
        },                            // [!code ++]
      },                              // [!code ++]
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})
```

## Uso básico

Depois de configurar o Lucid, você pode começar a usar o construtor de consultas do banco de dados para criar e executar consultas SQL. Nos exemplos de código a seguir, realizamos operações CRUD na tabela `posts`.

```ts {3,11-16}
// Selecionar consulta com paginação

import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 20

    const posts = await db
      .query()
      .from('posts')
      .select('*')
      .orderBy('id', 'desc')
      .paginate(page, limit)

    return posts
  }
}
```

```ts {3,11-18}
// Inserir consulta

import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async store({ request }: HttpContext) {
    const title = request.input('title')
    const description = request.input('description')

    const id = await db
      .insertQuery()
      .table('posts')
      .insert({
        title,
        description,
      })
      .returning('id')
  }
}
```

```ts {3,12-19}
// Atualizar linha por id

import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async update({ request, params }: HttpContext) {
    const id = params.id
    const title = request.input('title')
    const description = request.input('description')

    const updateRowsCount = await db
      .query()
      .from('posts')
      .where('id', id)
      .update({
        title,
        description,
      })
  }
}
```

```ts {3,10-14}
// Excluir linha por id

import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async delete({ request, params }: HttpContext) {
    const id = params.id

    const updateRowsCount = await db
      .query()
      .from('posts')
      .where('id', id)
      .delete()
  }
}
```

## Alternando entre conexões
Desde que você pode definir várias conexões dentro do arquivo `config/database.ts`. Você pode alternar entre elas em tempo de execução usando o método `db.connection`. Ele aceita o nome da conexão (conforme definido dentro do arquivo de configuração) como um parâmetro e retorna uma instância da classe [QueryClient](https://github.com/adonisjs/lucid/blob/develop/src/query_client/index.ts) para a conexão mencionada.

```ts
import db from '@adonisjs/lucid/services/db'

/**
 * Obter cliente de consulta para conexão "pg"
 */
const pg = db.connection('pg')

/**
 * Executar consulta
 */
await pg.query().select('*').from('posts')
```

## Fechando conexões
Você pode fechar conexões abertas usando o método `db.manager.close`. O método aceita o nome da conexão (conforme definido dentro do arquivo de configuração) como um parâmetro e chama o [método de desconexão](https://github.com/adonisjs/lucid/blob/develop/src/connection/index.ts#L365) na classe de conexão subjacente.

É recomendável não fechar conexões, a menos que você saiba que não fará mais consultas usando a conexão fornecida.

```ts
import db from '@adonisjs/lucid/services/db'

await db.manager.close('pg')
```
