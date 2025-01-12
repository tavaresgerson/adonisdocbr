---
resumo: Visão geral rápida do Lucid ORM, um construtor de consultas SQL e um ORM Active Record construído sobre o Knex.
---

# Lucid ORM

O Lucid é um construtor de consultas SQL e um ORM Active Record construído sobre o [Knex](https://knexjs.org) criado e mantido pela equipe principal do AdonisJS. O Lucid se esforça para alavancar o SQL em seu potencial máximo e oferece uma API limpa para muitas operações SQL avançadas.

:::note
A documentação do Lucid está disponível em [https://lucid.adonisjs.com](https://lucid.adonisjs.com)
:::

## Por que o Lucid

A seguir estão alguns dos recursos selecionados do Lucid.

- Um construtor de consultas fluente construído sobre o Knex.
- Suporte para réplicas de leitura e gravação e gerenciamento de múltiplas conexões.
- Modelos baseados em classes que aderem ao padrão do registro ativo (manipulando relações, serialização e ganchos).
- Sistema de migração para modificar o esquema do banco de dados usando conjuntos de alterações incrementais.
- Fábricas de modelos para gerar dados falsos para teste.
- Semeadores de banco de dados para inserir dados iniciais/fictícios no banco de dados.

Além disso, os seguintes são motivos adicionais para usar o Lucid dentro de um aplicativo AdonisJS.

- Nós enviamos integrações de primeira classe para o Lucid com o pacote Auth e validador. Portanto, você não precisa escrever essas integrações sozinho.

- O Lucid vem pré-configurado com os kits iniciais `api` e `web`, fornecendo uma vantagem inicial para seus aplicativos.

- Um dos principais objetivos do Lucid é alavancar o SQL em seu potencial máximo e oferecer suporte a muitas operações SQL avançadas, como **funções de janela**, **CTEs recursivos**, **operações JSON**, **bloqueios baseados em linha** e muito mais.

- Tanto o Lucid quanto o Knex existem há muitos anos. Portanto, eles são maduros e testados em batalha em comparação com muitos outros novos ORMs.

Dito isso, o AdonisJS não força você a usar o Lucid. Basta desinstalar o pacote e instalar o ORM de sua escolha.

## Instalação

Instale e configure o Lucid usando o seguinte comando.

```sh
node ace add @adonisjs/lucid
```

::: detalhes Veja as etapas executadas pelo comando configure

1. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

```ts
   {
     providers: [
       // ...other providers
       () => import('@adonisjs/lucid/database_provider'),
     ]
   }
   ```

2. Registre o seguinte comando dentro do arquivo `adonisrc.ts`.

```ts
   {
     commands: [
       // ...other commands
       () => import('@adonisjs/lucid/commands'),
     ]
   }
   ```

3. Crie o arquivo `config/database.ts`.

4. Defina as variáveis ​​de ambiente e suas validações para o dialeto selecionado.

5. Instale as dependências de peer necessárias.

:::

## Criando seu primeiro modelo

Depois que a configuração for concluída, você pode criar seu primeiro modelo usando o seguinte comando.

```sh
node ace make:model User
```

Este comando cria um novo arquivo dentro do diretório `app/models` com o seguinte conteúdo.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

Saiba mais sobre modelos visitando a [documentação oficial](https://lucid.adonisjs.com/docs/models).

## Migrações

As migrações são uma maneira de modificar o esquema e os dados do banco de dados usando conjuntos de alterações incrementais. Você pode criar uma nova migração usando o seguinte comando.

```sh
node ace make:migration users
```

Este comando cria um novo arquivo dentro do diretório `database/migrations` com o seguinte conteúdo.

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

Você pode executar todas as migrações pendentes usando o seguinte comando.

```sh
node ace migration:run
```

Saiba mais sobre migrações visitando a [documentação oficial](https://lucid.adonisjs.com/docs/migrations).

## Query Builder

O Lucid vem com um Query Builder fluente criado sobre o Knex. Você pode usar o Query Builder para executar operações CRUD no seu banco de dados.

```ts
import db from '@adonisjs/lucid/services/db'

/**
 * Creates query builder instance
 */
const query = db.query()

/**
 * Creates query builder instance and also selects
 * the table
 */
const queryWithTableSelection = db.from('users')
```

O Query Builder também pode ter como escopo uma instância de modelo.

```ts
import User from '#models/user'

const user = await User.query().where('username', 'rlanz').first()
```

Saiba mais sobre o Query Builder visitando a [documentação oficial](https://lucid.adonisjs.com/docs/select-query-builder).

## Operações CRUD

Os modelos Lucid têm métodos integrados para executar operações CRUD no banco de dados.

```ts
import User from '#models/user'

/**
 * Create a new user
 */
const user = await User.create({
  username: 'rlanz',
  email: 'romain@adonisjs.com',
})

/**
 * Find a user by primary key
 */
const user = await User.find(1)

/**
 * Update a user
 */

const user = await User.find(1)
user.username = 'romain'
await user.save()

/**
 * Delete a user
 */
const user = await User.find(1)
await user.delete()
```

Saiba mais sobre as operações CRUD visitando a [documentação oficial](https://lucid.adonisjs.com/docs/crud-operations).

## Saiba mais

[Documentação do Lucid](https://lucid.adonisjs.com)
[Instalação e uso](https://lucid.adonisjs.com/docs/installation)
[Operações CRUD](https://lucid.adonisjs.com/docs/crud-operations)
[Ganchos de modelo](https://lucid.adonisjs.com/docs/model-hooks)
[Relações](https://lucid.adonisjs.com/docs/relationships)
[Série Lucid do Adocasts](https://adocasts.com/topics/lucid)
