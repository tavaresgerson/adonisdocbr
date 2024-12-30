# Migrações de esquema

Migrações de esquema são o controle de versão para seu banco de dados. Pense nelas como scripts independentes escritos em TypeScript para alterar seu esquema de banco de dados ao longo do tempo.

Veja como as migrações funcionam em poucas palavras.

Você cria um novo arquivo de migração para cada alteração de esquema de banco de dados (por exemplo, criar ou alterar tabela).
- Dentro do arquivo de migração, você escreverá as instruções para executar as ações necessárias.
- Execute migrações usando a ferramenta de linha de comando AdonisJS.
- O AdonisJS manterá o controle das migrações executadas. Isso garante que cada migração seja executada apenas uma vez.
- Durante o desenvolvimento, você também pode reverter migrações para editá-las.

## Criando sua primeira migração
Você pode criar uma nova migração executando o seguinte comando Ace. Os arquivos de migração são armazenados dentro do diretório `database/migrations`.

::: info NOTA
Você também pode criar um modelo Lucid e a migração juntos executando o sinalizador `node ace make:model -m`.
:::

```sh
node ace make:migration users

# CREATE: database/migrations/1630981615472_users.ts
```

Se você notar, o nome do arquivo de migração é prefixado com algum valor numérico. Adicionamos o registro de data e hora atual ao nome do arquivo para que os arquivos de migração sejam classificados na ordem de criação.

### Estrutura da classe de migração
Uma classe de migração sempre estende a classe `BaseSchema` fornecida pelo framework e deve implementar os métodos `up` e `down`.

- O método `up` é usado para evoluir ainda mais o esquema do banco de dados. Normalmente, você criará novas tabelas/índices ou alterará tabelas existentes dentro deste método.
- O método `down` é usado para reverter as ações executadas pelo método `up`. Por exemplo, se o método up cria uma tabela, o método down deve remover a mesma tabela.

Ambos os métodos têm acesso ao AdonisJS [construtor de esquema](../../reference/database/schema-builder.md) que você pode usar para construir consultas SQL DDL.

```ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

## Executar e reverter migrações
Depois de criar os arquivos de migração necessários, você pode executar o seguinte comando Ace para processar migrações. Por exemplo, o comando `migration:run` executa o método `up` em todos os arquivos de migração.

```sh
node ace migration:run
```

As instruções SQL para cada arquivo de migração são encapsuladas dentro de uma transação. Portanto, se uma instrução falhar, todas as outras instruções dentro do mesmo arquivo serão revertidas.

Além disso, em caso de falha, as migrações subsequentes serão abortadas. No entanto, as migrações antes da migração com falha permanecem no estado concluído.

### Rastreando migrações concluídas
O AdonisJS rastreia o caminho do arquivo de migrações executadas dentro da tabela de banco de dados `adonis_schema`. Isso é feito para evitar a reexecução dos mesmos arquivos de migração.

A seguir estão as colunas dentro da tabela `adonis_schema`.

```sql
+----+----------------------------------------------+-------+----------------------------------+
| id |                     name                     | batch |          migration_time          |
+----+----------------------------------------------+-------+----------------------------------+
|  1 | database/migrations/1587988332388_users      |     1 | 2021-08-26 10:41:31.176333+05:30 |
|  2 | database/migrations/1592489784670_api_tokens |     1 | 2021-08-26 10:41:31.2074+05:30   |
+----+----------------------------------------------+-------+----------------------------------+
```

- **name**: Caminho para o arquivo de migração. É sempre relativo à raiz do projeto.
- **batch**: O lote sob o qual a migração foi executada. O número do lote é incrementado toda vez que você executa o comando `migration:run`.
- **migration_time**: Carimbo de data/hora da execução da migração.

### Migrações de reversão
Você pode reverter migrações executando o comando `migration:rollback`. A ação de reversão é realizada nas migrações do lote mais recente. No entanto, você também pode especificar um número de lote personalizado até o qual deseja reverter.

```sh
# Reverter o lote mais recente
node ace migration:rollback

# Reverter até o início da migração
node ace migration:rollback --batch=0

# Reverter até o lote 1
node ace migration:rollback --batch=1
```

O comando `migration:reset` é basicamente um alias para `migration:rollback --batch=0`. Isso reverterá todas as migrações do seu aplicativo:
```sh
node ace migration:reset
```

O comando `rollback` executa o método `down` da classe de migração. Assim como o método `up`, as instruções SQL do método `down` também são encapsuladas dentro de uma transação de banco de dados.

### Reverter e migrar usando um único comando
O comando `migration:refresh` reverterá todas as suas migrações e executará o comando `migration:run`. Este comando efetivamente recria todo o seu banco de dados:

```sh
node ace migration:refresh

# Atualize o banco de dados e execute todos os seeders
node ace migration:refresh --seed
```

### Eliminar tabelas e migrar
Ao contrário do comando `migration:refresh`, o comando `migration:fresh` não executará o método `down` dos arquivos de migração. Em vez disso, ele eliminará todas as tabelas usando o comando `db:wipe` e executará o comando `migration:run`.

```sh
node ace migration:fresh

# Remova todas as tabelas, migre e execute os seeders
node ace migration:fresh --seed
```

::: warning ATENÇÃO
Os comandos `migration:fresh` e `db:wipe` eliminarão todas as tabelas do banco de dados. Esses comandos devem ser usados ​​com cautela ao desenvolver em um banco de dados compartilhado com outros aplicativos.
:::

### Evite rollback na produção
Realizar um rollback durante o desenvolvimento é perfeitamente aceitável, pois não há medo de perda de dados. No entanto, executar um rollback na produção não é uma opção na maioria dos casos. Considere o seguinte exemplo:

- Você cria e executa uma migração para configurar a tabela `users`.
- Com o tempo, esta tabela recebeu dados desde que o aplicativo está em execução na produção.
- Seu produto evoluiu e agora você deseja adicionar uma nova coluna à tabela `users`.

Você não pode simplesmente reverter, editar a migração existente e executá-la novamente porque o rollback removerá a tabela `users`.

Em vez disso, você deve criar um novo arquivo de migração para alterar a tabela `users` existente adicionando a coluna necessária. Em outras palavras, as migrações devem sempre avançar.

## Crie uma tabela
Você pode usar o método `schema.createTable` para criar uma nova tabela de banco de dados. O método aceita o nome da tabela como o primeiro argumento e uma função de retorno de chamada para definir as colunas da tabela.

```ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {    // [!code highlight]
      table.increments('id')                                // [!code highlight]
      table.timestamp('created_at', { useTz: true })        // [!code highlight]
      table.timestamp('updated_at', { useTz: true })        // [!code highlight]
    })                                                      // [!code highlight]
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

* [Guia de referência do construtor de esquemas →](../../reference/database/schema-builder.md)

## Alterar tabela
Você pode alterar uma tabela de banco de dados existente usando o método `schema.alterTable`. O método aceita o nome da tabela como o primeiro argumento e uma função de retorno de chamada para alterar/adicionar as colunas da tabela.

```ts
export default class extends BaseSchema {
  public up() {
    this.schema.alterTable('user', (table) => {   // [!code highlight]
      table.dropColumn('name')                    // [!code highlight]
      table.string('first_name')                  // [!code highlight]
      table.string('last_name')                   // [!code highlight]
    })                                            // [!code highlight]
  }
}
```

## Renomear/remover tabela
Você pode renomear a tabela usando `schema.renameTable`. O método aceita o nome da tabela existente como o primeiro argumento e o novo nome como o segundo argumento.

```ts
export default class extends BaseSchema {
  public up() {                                   // [!code highlight]
    this.schema.renameTable('user', 'app_users')  // [!code highlight]
  }                                               // [!code highlight]
}
```

Você pode remover a tabela usando `schema.dropTable`. O método aceita o nome da tabela como o único argumento.

```ts
export default class extends BaseSchema {
  public down() {                                 // [!code highlight]
    this.schema.dropTable('users')                // [!code highlight]
  }                                               // [!code highlight]
}
```

## Execução a seco (*Dry run*)
O modo de execução a seco das migrações permite que você visualize as consultas SQL no console em vez de executá-las. Basta passar o sinalizador `--dry-run` para os comandos de migração para ativar o modo de *dry run*.

```sh
# Executar
node ace migration:run --dry-run

# Reverter
node ace migration:rollback --dry-run
```

## Executando outras operações de banco de dados
Muitas vezes, você terá requisitos para executar consultas SQL além de apenas criar/alterar tabelas. Por exemplo: migrar dados para uma tabela recém-criada antes de excluir a tabela antiga.

Você deve definir essas operações usando o método `this.defer`, conforme mostrado abaixo.

::: info NOTA
Migramos os e-mails da tabela `users` para a tabela `user_emails` no exemplo a seguir.
:::

```ts
export default class extends BaseSchema {
  public up() {
    this.schema.createTable('user_emails', (table) => {
      // colunas da tabela
    })

    this.defer(async (db) => {                              // [!code highlight]
      const users = await db.from('users').select('*')      // [!code highlight]
      await Promise.all(users.map((user) => {               // [!code highlight]
        return db                                           // [!code highlight]
          .table('user_emails')                             // [!code highlight]
          .insert({ user_id: user.id, email: user.email })  // [!code highlight]
      }))                                                   // [!code highlight]
    })                                                      // [!code highlight]

    this.schema.alterTable('users', (table) => {
      table.dropColumn('email')
    })
  }
}
```

Envolver suas consultas de banco de dados dentro do método `this.defer` garante que elas não sejam executadas ao executar migrações no modo **dry run**.

## Alterando a conexão do banco de dados de migrações
Você pode gerenciar a conexão do banco de dados para migrações de algumas maneiras diferentes.

### Origem de migração separada

A primeira opção é manter as migrações separadas para cada conexão de banco de dados. Isso geralmente é útil quando cada conexão de banco de dados consulta tabelas diferentes. Por exemplo, você está usando um banco de dados diferente para dados de usuários e um banco de dados diferente para dados de produtos.

Defina o caminho das migrações ao lado da configuração da conexão do banco de dados.

```ts
{
  users: {
    client: 'mysql2',
    migrations: {
      paths: ['./database/users/migrations']  // [!code highlight]
    }
  },
  products: {
    client: 'mysql2',
    migrations: {
      paths: ['./database/products/migrations'] // [!code highlight]
    }
  }
}
```

Ao criar uma nova migração, defina o sinalizador `--connection`, e o comando criará o arquivo no diretório correto.

```sh
node ace make:migration --connection=products
```

Ao executar as migrações, o sinalizador `--connection` executará migrações apenas do diretório de conexão selecionado.

```sh
node ace migration:run --connection=products
```

### Migrações compartilhadas
Se você quiser executar as mesmas migrações em uma conexão de banco de dados diferente, você pode usar o sinalizador `--connection`. As migrações usarão a configuração da conexão selecionada para executar as migrações.

Esta opção é útil para aplicativos multilocatários, onde você deseja alternar as conexões toda vez que executar a migração.

```sh
node ace migration:run --connection=tenantA
```

## Uma observação sobre bloqueios consultivos
Obtemos um bloqueio consultivo com o servidor de banco de dados para garantir que apenas um processo esteja executando migrações por vez. Os bloqueios consultivos são suportados apenas pelos drivers `pg` e `mysql` e você pode desabilitar o sistema de bloqueio usando o sinalizador de linha de comando `--disable-locks`.

```sh
node ace migration:run --disable-locks
node ace migration:refresh --disable-locks
node ace migration:rollback --disable-locks
```

## Executando migrações programaticamente
Usando o módulo `Migrator`, você pode executar migrações programaticamente. Isso geralmente é útil ao executar migrações de uma interface da Web e não da linha de comando.

A seguir, um exemplo de execução de migrações de uma rota e retorno de uma lista de arquivos migrados na resposta.

```ts
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import Migrator from '@ioc:Adonis/Lucid/Migrator'

Route.get('/', async () => {
  const migrator = new Migrator(Database, Application, {
    direction: 'up',
    dryRun: false,
    // connectionName: 'pg',
  })

  await migrator.run()
  return migrator.migratedFiles
})
```

- `direction = up` significa executar o método `up` dentro dos arquivos de migração. Você pode definir `direction = down` para reverter as migrações.
- Habilitar `dryRun` não executará as consultas, mas as coletará dentro do array `queries`.
- Você também pode definir opcionalmente a propriedade `connectionName` para executar as migrações em uma conexão de banco de dados específica.

### `migratedFiles`
O `migrator.migratedFiles` é um objeto. A chave é o nome exclusivo (derivado do caminho do arquivo) e o valor é outro objeto das propriedades do arquivo de migração.

```json
{
  "database/migrations/1623289360244_users": {
    "status": "completed",
    "queries": [],
    "file": {
      "filename": "1623289360244_users.ts",
      "absPath": "/path/to/project/database/migrations/1623289360244_users.ts",
      "name": "database/migrations/1623289360244_users"
    },
    "batch": 1
  }
}
```

- O `status` será um de **"pending"**, **"completed"** ou **"error"**.
- O array `queries` contém um array de consultas executadas. Somente quando `dryRun` estiver habilitado.
- A propriedade `file` contém as informações do arquivo de migração.
- A propriedade `batch` informa o lote no qual a migração foi executada.

### `getList`
O método `migrator.getList` retorna uma lista de todas as migrações, incluindo as concluídas e as pendentes. Esta é a mesma lista que você vê ao executar o comando `node ace migration:status`.

```ts
await migrator.getList()
```

```json
[
  {
    "name": "database/migrations/1623289360244_users",
    "status": "pending"
  }
]
```

### `status`
Retorna o `status` atual do migrador. Ele sempre será um dos seguintes.

- O status `pending` significa que o método `migrator.run` ainda não foi chamado.
- O status `completed` significa que as migrações foram executadas com sucesso.
- O status `error` significa que houve um erro no processo de migração. Você pode ler o erro real na propriedade `migrator.error` em caso de status de erro.
- O status `skiped` significa que não houve migrações para executar ou reverter.

## Configuração de migrações
A configuração para migrações é armazenada dentro do arquivo `config/database.ts` sob o objeto de configuração de conexão.

```ts
{
  mysql: {
    client: 'mysql2',
    migrations: {
      naturalSort: true,
      disableTransactions: false,
      paths: ['./database/migrations'],
      tableName: 'adonis_schema',
      disableRollbacksInProduction: true,
    }
  }
}
```

#### `naturalSort`
Use **natural sort** para classificar os arquivos de migração. A maioria dos editores usa natural sort e, portanto, as migrações serão executadas na mesma ordem em que você as vê listadas no seu editor.

#### `paths`
Uma matriz de caminhos para procurar migrações. Você também pode definir um caminho para um pacote instalado. Por exemplo:

```ts
paths: [
  './database/migrations',
  '@somepackage/migrations-dir',
]
```

#### `tableName`
O nome da tabela para armazenar o estado das migrações. O padrão é `adonis_schema`.

#### `disableRollbacksInProduction`
Desabilite a reversão de migração na produção. É recomendável que você nunca reverta migrações na produção.

#### `disableTransactions`
Defina o valor como `true` para não encapsular instruções de migração dentro de uma transação. Por padrão, o Lucid executará cada arquivo de migração em sua transação.
