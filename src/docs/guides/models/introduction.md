# Introdução

Junto com o construtor de consultas do banco de dados, o Lucid também tem modelos de dados criados sobre o [padrão de registro ativo](https://en.wikipedia.org/wiki/Active_record_pattern).

A camada de modelos de dados do Lucid torna super fácil **executar operações CRUD**, **gerenciar relacionamentos entre modelos** e **definir ganchos de ciclo de vida**.

Recomendamos usar modelos extensivamente e recorrer ao construtor de consultas padrão para casos de uso específicos.

## O que é o padrão de registro ativo?

O registro ativo também é o nome do ORM usado pelo Ruby on Rails. No entanto, o padrão de registro ativo é um conceito mais amplo que qualquer linguagem de programação ou estrutura pode implementar.

::: info NOTA
Sempre que dizemos o termo **registro ativo**, estamos falando sobre o padrão em si e não sobre a implementação do Rails.
:::

O padrão de registro ativo defende o encapsulamento das interações do banco de dados em objetos ou classes específicas da linguagem. Cada tabela do banco de dados obtém seu modelo, e cada instância dessa classe representa uma linha da tabela.

Os modelos de dados limpam muitas interações do banco de dados, pois você pode codificar a maior parte do comportamento dentro de seus modelos em vez de escrevê-lo em todos os lugares dentro de sua base de código.

Por exemplo, sua tabela `users` tem um campo de data e você deseja formatá-lo antes de enviá-lo de volta ao cliente. **É assim que seu código pode ficar sem usar modelos de dados**.

```ts
import { DateTime } from 'luxon'
const users = await Database.from('users').select('*')

return users.map((user) => {
  user.dob = DateTime.fromJSDate(user.dob).toFormat('dd LLL yyyy')
  return user
})
```

Ao usar modelos de dados, você pode codificar a ação de formatação de data dentro do modelo em vez de escrevê-la em todos os lugares que você busca e retorna usuários.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

class User extends BaseModel {
  @column.date({
    serialize: (value) => value.toFormat('dd LLL yyyy')
  })
  public dob: DateTime
}
```

E use-o da seguinte forma:

```ts
const users = await User.all()
return users.map((user) => user.toJSON()) // date is formatted during `toJSON` call
```

## Criando seu primeiro modelo
Supondo que você já tenha o Lucid [configurado](../database/introduction.md), execute o seguinte comando para criar seu primeiro modelo de dados.

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
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
```

## Colunas
Você terá que definir suas colunas de banco de dados como propriedades na classe e decorá-las usando o decorador `@column`.

Como o AdonisJS usa TypeScript, não há como contornar SEM definir as colunas explicitamente na classe. Caso contrário, o compilador TypeScript reclamará sobre o seguinte erro.

![](/docs/assets/models-property-error.webp)

#### Pontos a serem observados
- O decorador `@column` é usado para distinguir entre as propriedades de classe padrão e as colunas do banco de dados.
- Mantemos os modelos enxutos e não definimos **restrições**, **tipos de dados** e **gatilhos** específicos do banco de dados dentro dos modelos.
- Qualquer opção que você definir dentro dos modelos não altera/impacta o banco de dados. Você deve usar migrações para isso.

Para resumir os pontos acima - **O Lucid mantém uma separação clara entre migrações e os modelos**. As migrações são destinadas a criar/alterar as tabelas, e os modelos são destinados a consultar o banco de dados ou inserir novos registros.

### Definindo colunas
Agora que você está ciente da existência de colunas na classe do modelo. A seguir está um exemplo de definição das colunas da tabela do usuário como propriedades no modelo `User`.

```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public avatarUrl: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
```

O decorador `@column` também aceita opções para configurar o comportamento da propriedade.

- A opção `isPrimary` marca a propriedade como a chave primária para a tabela de banco de dados fornecida.
- A opção `serializeAs: null` remove a propriedade quando você serializa o modelo para JSON.
[Exibir todas as opções disponíveis](../../reference/orm/decorators.md#column) aceitas pelo decorador `@column`.

### Colunas de data
O Lucid aprimora ainda mais as propriedades de data e data-hora e converte os valores do driver do banco de dados em uma instância de [luxon.DateTime](https://moment.github.io/luxon/).

Tudo o que você precisa fazer é usar os decoradores `@column.date` ou `@column.dateTime`, e o Lucid cuidará do resto para você.

```ts
@column.date()
public dob: DateTime

@column.dateTime({ autoCreate: true })
public createdAt: DateTime

@column.dateTime({ autoCreate: true, autoUpdate: true })
public updatedAt: DateTime
```

Opcionalmente, você pode passar as opções `autoCreate` e `autoUpdate` para sempre definir os timestamps durante as operações de criação e atualização. **Observe que definir essas opções não modifica a tabela do banco de dados ou seus gatilhos.**

### Nomes de colunas
O Lucid assume que os nomes das colunas do seu banco de dados são definidos como `snake_case` e ​​converte automaticamente as propriedades do modelo para snake case durante as consultas ao banco de dados. Por exemplo:

```ts
await User.create({ avatarUrl: 'foo.jpg' })

// EXECUTED QUERY
// insert into "users" ("avatar_url") values (?)
```

#### Sobrescrever nomes de colunas globalmente
Se você não estiver usando a convenção `snake_case` no seu banco de dados, poderá substituir o comportamento padrão do Lucid definindo uma [Estratégia de Nomenclatura](../../reference/orm/naming-strategy.md) personalizada

#### Sobrescrever nomes de colunas inline
Você também pode definir os nomes das colunas do banco de dados explicitamente dentro do decorador `@column`. Isso geralmente é útil para contornar a convenção em casos de uso específicos.

```ts
@column({ columnName: 'user_id', isPrimary: true })
public id: number
```

## Modelos config
A seguir estão as opções de configuração para substituir os padrões convencionais.

### `primaryKey`
Defina uma chave primária personalizada (padrões para id). Definir `primaryKey` no modelo não modifica o banco de dados. Aqui, você está apenas dizendo ao Lucid para considerar id como o valor exclusivo para cada linha.

```ts
class User extends Basemodel {
  public static primaryKey = 'email'
}
```

Ou use a opção de coluna `primaryKey`.

```ts
class User extends Basemodel {
  @column({ isPrimary: true })
  public email: string
}
```

### `table`
Defina um nome de tabela de banco de dados personalizado. [Padrões](../../reference/orm/naming-strategy.md#tablename) para a versão plural e snake case do nome do modelo.

```ts
export default class User extends BaseModel {
  public static table = 'app_users'
}
```

### `selfAssignPrimaryKey`
Defina esta opção como `true` se você não depender do banco de dados para gerar as chaves primárias. Por exemplo, você quer autoatribuir `uuid` às novas linhas.

```ts
import uuid from 'uuid/v4'
import { BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid()
  }
}
```

### `connection`
Instrua o modelo a usar uma conexão de banco de dados personalizada definida dentro do arquivo `config/database`.

::: danger ATENÇÃO
NÃO use esta propriedade para alternar a conexão em tempo de execução. Esta propriedade define apenas um nome de conexão estático que permanece o mesmo durante todo o ciclo de vida do aplicativo.
:::

```ts
export default class User extends BaseModel {
  public static connection = 'pg'
}
```

## FAQs

<details>
<summary>Os modelos criam as tabelas de banco de dados automaticamente?</summary>

Não. Não sincronizamos seus modelos com o banco de dados. A criação/alteração de tabelas deve ser feita usando [migrations](../database/migrations.md). Aqui estão alguns dos motivos para não usar modelos para criar o esquema de banco de dados.

1. Gerar tabelas de banco de dados a partir de modelos significa definir todas as restrições e configurações de nível de banco de dados dentro dos modelos. Isso adiciona inchaço desnecessário aos modelos.
2. Nem toda alteração no banco de dados é tão simples quanto renomear uma coluna. Há cenários em que você deseja migrar dados de uma tabela para outra durante a reestruturação, e isso não pode/não deve ser expresso dentro dos modelos.

</details>

<details>
<summary>Estou vindo do TypeORM, como devo definir os tipos de coluna?</summary>

Não expressamos tipos de banco de dados dentro dos modelos. Em vez disso, seguimos a abordagem de **modelos enxutos** e mantemos a configuração do nível do banco de dados dentro das migrações.

</details>

<details>
<summary>Posso mover meus modelos para outro lugar?</summary>

Sim. Você é livre para colocar seu modelo onde quiser! Se seus modelos estiverem dentro da pasta `app/Something`, você usará `App/Something/ModelName` para carregar seu modelo.

</details>

## Leitura adicional

[Guia de referência de modelos](../../reference/orm/base-model.md).
[Operações CRUD](./crud.md) usando modelos.
[serializar modelos](./serialization.md) para JSON.
