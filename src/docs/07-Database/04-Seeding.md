# Seeds & Factories

Depois de preparar seu esquema de banco de dados com [migrations](/docs/07-Database/03-Migrations.md), o próximo passo é adicionar alguns dados. É aqui que as *seeds* e *factories* do banco de dados entram em cena.

## Seeds
Seeds são classes JavaScript que contêm um método `run`. Dentro do método `run`, você é livre para escrever quaisquer operações relacionadas ao banco de dados que sua semente requeira.

Como migrações, um arquivo seed é criado usando o comando `adonis make`:

```bash
adonis make:seed User
```

```bash
# .Output

✔ create  database/seeds/UserSeeder.js
```

Agora abra este arquivo e digite o seguinte código dentro dele:

```js
// .database/seeds/UserSeeder.js

const Factory = use('Factory')
const Database = use('Database')

class UserSeeder {
  async run () {
    const users = await Database.table('users')
    console.log(users)
  }
}

module.exports = UserSeeder
```

Execute o arquivo seed chamando o comando `adonis seed`, que executará o método `run` em todos os arquivos seed existentes.

Como você pode escrever qualquer código relacionado ao banco de dados dentro dos seus arquivos de semente e executá-los a partir da linha de comando, eles são úteis para descarregar algumas tarefas do seu código de aplicativo real.

No entanto, o verdadeiro poder das sementes é desbloqueado quando combinado com *Factories*.

## Factories
As fábricas definem estruturas de dados (blueprints) usadas para gerar dados fictícios.

Os blueprints de fábrica são definidos dentro do arquivo `database/factory.js`:

```js
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', async (faker) => {
  return {
    username: faker.username(),
    email: faker.email(),
    password: await Hash.make(faker.password())
  }
})
```

Quando uma instância de modelo é gerada a partir de um blueprint de fábrica, os atributos do modelo são preenchidos previamente usando as chaves definidas dentro do blueprint:

```js
const user = await Factory
  .model('App/Models/User')
  .create()
```

Muitas instâncias de modelo podem ser geradas ao mesmo tempo:

```js
const usersArray = await Factory
  .model('App/Models/User')
  .createMany(5)
```

### Criando relacionamentos
Digamos que queremos criar um modelo `User` e relacionar um `Post` a ele.

::: warning OBSERVAÇÃO
Para o exemplo abaixo, um relacionamento `posts` deve primeiro ser definido no modelo User. Saiba mais sobre relacionamentos [aqui](/docs/08-Lucid-ORM/05-Relationships.md).
:::

Primeiro, crie blueprints para ambos os modelos no arquivo `database/factory.js`:

```js
// .database/factory.js

// User blueprint
Factory.blueprint('App/Models/User', (faker) => {
  return {
    username: faker.username(),
    password: faker.password()
  }
})

// Post blueprint
Factory.blueprint('App/Models/Post', (faker) => {
  return {
    title: faker.sentence(),
    body: faker.paragraph()
  }
})
```

Depois, crie um `User`, faça um `Post` e associe ambos os modelos um ao outro:

```js
const user = await Factory.model('App/Models/User').create()
const post = await Factory.model('App/Models/Post').make()

await user.posts().save(post)
```

Você deve ter notado que usamos o método `make` no blueprint `Post`.

Ao contrário do método `create`, o método `make` não persiste o modelo `Post` no banco de dados, em vez disso, retorna uma instância não salva do modelo `Post` pré-preenchida com dados fictícios (o modelo `Post` é salvo quando o método `.posts().save()` é chamado).

## Comandos de Seed
Abaixo está a lista de comandos de seed disponíveis.

| Comando             | Opções    | Descrição             |
|---------------------|-----------|-----------------------|
| `adonis make:seed`  | Nenhum    | Crie um novo arquivo seed.   |
| `adonis seed`       | `--files` | Execute os arquivos seed (opcionalmente, você pode passar uma lista separada por vírgulas de `--files` a serem executados, caso contrário, todos os arquivos serão executados). |

## API Model Factory
Abaixo está a lista de métodos disponíveis ao usar fábricas [modelo Lucid](/docs/08-Lucid-ORM/01-Getting-Started.md).

#### `create`
Persistir e retornar instância do modelo:

```js
await Factory
  .model('App/Models/User')
  .create()
```

#### `createMany`
Persistir e retornar muitas instâncias do modelo:

```js
await Factory
  .model('App/Models/User')
  .createMany(3)
```

#### `make`
Retornar instância do modelo, mas não persisti-la no banco de dados:

```js
await Factory
  .model('App/Models/User')
  .make()
```

#### `makeMany`
Retornar matriz de instâncias do modelo, mas não persisti-las no banco de dados:

```js
await Factory
  .model('App/Models/User')
  .makeMany(3)
```

## Uso sem Lucid
Se seu aplicativo não usar link:lucid[modelos Lucid], você ainda poderá usar o [Provedor de banco de dados](/docs/07-Database/02-Query-Builder.md) para gerar registros de banco de dados de fábrica.

#### `blueprint`

Para definir seu blueprint de fábrica sem Lucid, passe um nome de tabela como o primeiro parâmetro em vez de um nome de modelo (por exemplo, `users` em vez de `App/Models/User`):

```js
Factory.blueprint('users', (faker) => {
  return {
    username: faker.username(),
    password: faker.password()
  }
})
```

#### `create`
Criou um registro de tabela:

```js
run () {
  await Factory.get('users').create()
}
```

#### `table`
Defina um nome de tabela diferente em tempo de execução:

```js
await Factory
  .get('users')
  .table('my_users')
  .create()
```

#### `returning`
Para PostgreSQL, defina uma coluna de retorno:

```js
await Factory
  .get('users')
  .returning('id')
  .create()
```

#### `connection`
Escolha uma conexão diferente em tempo de execução:

```js
await Factory
  .get('users')
  .connection('mysql')
  .returning('id')
  .create()
```

#### `createMany`
Crie vários registros:

```js
await Factory
  .get('users')
  .createMany(3)
```

## Dados personalizados
Os métodos `make`, `makeMany`, `create` e `createMany` aceitam um objeto de dados personalizado que é passado diretamente para seus blueprints.

Por exemplo:

```js
const user = await Factory
  .model('App/Models/User')
  .create({ status: 'admin' })
```

Dentro do seu blueprint, seu objeto de dados personalizado é consumido assim:

```js
Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    username: faker.username(),
    status: data.status
  }
})
```

## API Faker
O objeto `faker` passado para um blueprint de fábrica é uma referência à biblioteca JavaScript geradora aleatória [Chance](http://chancejs.com).

Certifique-se de ler a [documentação](http://chancejs.com) do Chance para obter a lista completa de métodos e propriedades `faker` disponíveis.

## Perguntas frequentes
Como fábricas e sementes se encaixam em muitos casos de uso diferentes, você pode ficar confuso sobre como/quando usá-las, então aqui está uma lista de perguntas frequentes.

1. *As fábricas e as sementes precisam ser usadas juntas?*
Não. As fábricas e as sementes não dependem umas das outras e podem ser usadas de forma independente. Por exemplo, você pode usar apenas arquivos de sementes para importar dados para um aplicativo AdonisJs de um aplicativo completamente diferente.

2. *Posso usar fábricas ao escrever testes?*
Sim. Importe o provedor de fábrica (`Factory`) para o seu teste e use conforme necessário.

3. *Posso executar apenas arquivos de sementes selecionados?*
Sim. Passar `--files` com uma lista de nomes de arquivos separados por vírgula para o comando `adonis seed` garante que apenas esses arquivos sejam executados, por exemplo:
    ```bash
    adonis seed --files='UsersSeeder.js, PostsSeeder.js'
    ```
