---
resumo: Uma introdução aos modelos de dados Lucid ORM, construídos no padrão de registro ativo.
---

# Modelos

Junto com o construtor de consultas do banco de dados, o Lucid também tem modelos de dados construídos sobre o [padrão de registro ativo](https://en.wikipedia.org/wiki/Active_record_pattern).

A camada de modelos de dados do Lucid torna super fácil **executar operações CRUD**, **gerenciar relacionamentos entre modelos** e **definir ganchos de ciclo de vida**.

Recomendamos usar modelos extensivamente e recorrer ao construtor de consultas padrão para casos de uso específicos.

## O que é o padrão de registro ativo?

O registro ativo também é o nome do ORM usado pelo Ruby on Rails. No entanto, o padrão de registro ativo é um conceito mais amplo que qualquer linguagem de programação ou estrutura pode implementar.

:::note
Sempre que dizemos o termo **registro ativo**, estamos falando sobre o padrão em si e não sobre a implementação do Rails.
:::

O padrão de registro ativo defende o encapsulamento das interações do banco de dados em objetos ou classes específicas da linguagem. Cada tabela do banco de dados obtém seu modelo, e cada instância dessa classe representa uma linha da tabela.

Os modelos de dados limpam muitas interações do banco de dados, pois você pode codificar a maior parte do comportamento dentro de seus modelos em vez de escrevê-lo em todos os lugares dentro de sua base de código.

Por exemplo, sua tabela `users` tem um campo de data, e você quer formatá-lo antes de enviá-lo de volta ao cliente. **É assim que seu código pode ficar sem usar modelos de dados**.

```ts
import { DateTime } from 'luxon'
const users = await db.from('users').select('*')

return users.map((user) => {
  user.dob = DateTime.fromJSDate(user.dob).toFormat('dd LLL yyyy')
  return user
})
```

Ao usar modelos de dados, você pode codificar a ação de formatação de data dentro do modelo em vez de escrevê-la em todos os lugares que você busca e retorna usuários.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

class User extends BaseModel {
  @column.date({
    serialize: (value) => value.toFormat('dd LLL yyyy'),
  })
  declare dob: DateTime
}
```

E use-o da seguinte forma:

```ts
const users = await User.all()
return users.map((user) => user.toJSON()) // date is formatted during `toJSON` call
```

## Criando seu primeiro modelo

Você pode criar um modelo Lucid usando o comando Ace `make:model`.

```sh
node ace make:model User

# CREATE: app/Models/User.ts
```

Você também pode gerar a migração junto com o modelo definindo o sinalizador `-m`.

```sh
node ace make:model User -m

# CREATE: database/migrations/1618903673925_users.ts
# CREATE: app/Models/User.ts
```

Finalmente, você também pode criar a fábrica para o modelo usando o sinalizador `-f`.

```sh
node ace make:model User -f

# CREATE: app/Models/User.ts
# CREATE: database/factories/User.ts
```

O comando `make:model` cria um novo modelo dentro do diretório `app/Models`. Cada modelo deve estender a classe `BaseModel` para herdar funcionalidade adicional.

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

## Colunas

Você terá que definir suas colunas de banco de dados como propriedades na classe e decorá-las usando o decorador `@column`.

- O decorador `@column` é usado para distinguir entre as propriedades de classe padrão e as colunas de banco de dados.

- Mantemos os modelos enxutos e não definimos **restrições** específicas do banco de dados, **tipos de dados** e **gatilhos** dentro dos modelos.

- Qualquer opção que você definir dentro dos modelos não altera/impacta o banco de dados. Você deve usar migrações para isso.

Para resumir os pontos acima - **O Lucid mantém uma separação clara entre migrações e os modelos**. As migrações são destinadas a criar/alterar as tabelas, e os modelos são destinados a consultar o banco de dados ou inserir novos registros.

### Definindo colunas

Agora que você está ciente da existência de colunas na classe de modelo. A seguir está um exemplo de definição das colunas da tabela do usuário como propriedades no modelo `User`.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare avatarUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

O decorador `@column` também aceita opções para configurar o comportamento da propriedade.

- A opção `isPrimary` marca a propriedade como a chave primária para a tabela de banco de dados fornecida.
- A opção `serializeAs: null` remove a propriedade quando você serializa o modelo para JSON.

### Nomes de colunas

O Lucid assume que os nomes das colunas do seu banco de dados são definidos como `snake_case` e ​​converte automaticamente as propriedades do modelo para snake case durante as consultas ao banco de dados. Por exemplo:

```ts
await User.create({ avatarUrl: 'foo.jpg' })

// EXECUTED QUERY
// insert into "users" ("avatar_url") values (?)
```

Se você não estiver usando a convenção `snake_case` no seu banco de dados, poderá substituir o comportamento padrão do Lucid definindo uma [Estratégia de Nomenclatura](./naming_strategy.md) personalizada

Você também pode definir os nomes das colunas do banco de dados explicitamente no decorador `@column`. Isso geralmente é útil para ignorar a convenção em casos de uso específicos.

```ts
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ columnName: 'user_id', isPrimary: true })
  declare id: number
}
```

### Preparando e consumindo colunas

O Lucid permite que você transforme os valores das colunas antes de salvá-los no banco de dados ou depois de buscá-los do banco de dados usando as opções `consume` e `prepare`.

Por exemplo, você está armazenando um valor "secreto" no banco de dados e deseja criptografá-lo antes de salvá-lo e descriptografá-lo depois de buscá-lo.

```ts
// In this example, we are using the `encryption` module from the `@adonisjs/core` package
// @see https://docs.adonisjs.com/guides/security/encryption
import encryption from '@adonisjs/core/services/encryption'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({
    prepare: (value: string | null) => (value ? encryption.encrypt(value) : null),
    consume: (value: string | null) => (value ? encryption.decrypt(value) : null),
  })
  declare token: string | null
}
```

### Colunas de data

O Lucid aprimora ainda mais as propriedades de data e data-hora e converte os valores do driver do banco de dados em uma instância de [luxon.DateTime](https://moment.github.io/luxon/).

Tudo o que você precisa fazer é usar os decoradores `@column.date` ou `@column.dateTime`, e o Lucid cuidará do resto para você.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column.date()
  declare dob: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

Opcionalmente, você pode passar as opções `autoCreate` e `autoUpdate` para sempre definir os timestamps durante as operações de criação e atualização. **Observe que definir essas opções não modifica a tabela do banco de dados ou seus gatilhos.**

Se você não quiser Luxon e preferir objetos `Date` regulares, ainda poderá usar um `@column` regular em combinação com `consume` e `prepare`

```ts
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({
    consume: (v: string) => new Date(v),
    prepare: (v: Date) => v.toISOString(), 
  )
  declare updatedAt: Date
}
```

## Configuração de modelos

A seguir estão as opções de configuração para substituir os padrões convencionais.

### `primaryKey`

Defina uma chave primária personalizada (padrão para `id`). Definir `primaryKey` no modelo não modifica o banco de dados. Aqui, você está apenas dizendo ao Lucid para considerar `email` como o valor exclusivo para cada linha.

```ts
class User extends Basemodel {
  static primaryKey = 'email'
}
```

Ou use a opção de coluna `isPrimary`.

```ts
class User extends Basemodel {
  @column({ isPrimary: true })
  declare email: string
}
```

### `table`

Defina um nome de tabela de banco de dados personalizado. O padrão é a versão plural e snake case do nome do modelo.

```ts
export default class User extends BaseModel {
  static table = 'app_users'
}
```

### `selfAssignPrimaryKey`

Defina esta opção como `true` se você não depender do banco de dados para gerar as chaves primárias. Por exemplo, você deseja autoatribuir `uuid` às novas linhas.

```ts
import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }
}
```

### `connection`

Instrua o modelo a usar uma conexão de banco de dados personalizada definida dentro do arquivo `config/database`.

:::note
NÃO use esta propriedade para alternar a conexão em tempo de execução. Esta propriedade define apenas um nome de conexão estática que permanece o mesmo durante todo o ciclo de vida do aplicativo.
:::

```ts
export default class User extends BaseModel {
  static connection = 'pg'
}
```
