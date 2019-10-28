# Seeds e Fábricas

Depois de preparar o esquema do banco de dados com migrations, a próxima etapa é adicionar alguns dados. É aqui que as seeds e 
fábricas de banco de dados entram em cena.

### Seeds
Sementes são classes JavaScript que contêm um método `run`. Dentro do método `run`, você é livre para escrever qualquer operação
relacionada ao banco de dados que sua seed exija.

Como as migrations, um arquivo inicial é criado usando o comando `adonis make`:

```
> adonis make:seed User
```

Resultado
```
✔ create  database/seeds/UserSeeder.js
```

Agora abra esse arquivo e digite o seguinte código:
``` js
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

Execute o arquivo de sementes chamando o comando `adonis seed`, que executará o método `run` em todos os arquivos de sementes 
existentes.

Como você pode escrever qualquer código relacionado ao banco de dados em seus arquivos de seeds e executá-los na linha de comando, 
eles são úteis para descarregar algumas tarefas do seu código de aplicativo real.

No entanto, o verdadeiro poder das seeds é desbloqueado quando combinado com as **fábricas**.

## Fábricas
Fábricas definem estruturas de dados (blueprints) usadas para gerar dados fictícios.

Os blueprints de fábrica são definidos dentro do arquivo `database/factory.js`:

``` js
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

Quando uma instância do modelo é gerada a partir de um blueprint de fábrica, os atributos do modelo são pré-preenchidos usando 
as chaves definidas dentro do blueprint:

``` js
const user = await Factory
  .model('App/Models/User')
  .create()
```

Muitas instâncias de modelo podem ser geradas ao mesmo tempo:

``` js
const usersArray = await Factory
  .model('App/Models/User')
  .createMany(5)
```

### Criando Relacionamentos
Digamos que queremos criar um modelo `User` e relacionar o `Post` a ele.

> Para o exemplo abaixo, um relacionamento `posts` deve primeiro ser definido no modelo de usuário. Saiba mais sobre 
> relacionamentos [aqui](https://adonisjs.com/docs/4.1/relationships).

Primeiro, crie blueprints para os dois modelos no arquivo `database/factory.js`:

``` js
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

Em seguida, crie `User`, faça o `Post` e associe os dois modelos:

``` js
const user = await Factory.model('App/Models/User').create()
const post = await Factory.model('App/Models/Post').make()

await user.posts().save(post)
```

Você deve ter notado que usamos o método `make` no blueprint `Post`.

Diferentemente do método `create`, o método `make` não mantém o modelo `Post` no banco de dados, retornando uma instância não 
salva do modelo `Post` preenchida com dados fictícios (o modelo `Post` é salvo quando o método `.posts().save()` é chamado).

## Comandos de propagação
Abaixo está a lista de comandos de semente disponíveis.

| Comando                       | Opções                     | Descrição                                    |
|-------------------------------|----------------------------|----------------------------------------------|
| adonis make:seed              | Nenhum                     | Faça um novo arquivo de propagação.          |
| adonis seed                   | --files                    | Executar arquivos de propagação (opcionalmente, você pode passar uma lista em `--files` separada por vírgula para ser executada; caso contrário, todos os arquivos serão executados).  |

## API do Model Factory
Abaixo está a lista de métodos disponíveis ao usar as fábricas do modelo [Lucid](https://adonisjs.com/docs/4.1/lucid).

### create
Persistência e retorno da instância do modelo:

``` js
await Factory
  .model('App/Models/User')
  .create()
```

### createMany
Persistir e retornar muitas instâncias de modelo:

``` js
await Factory
  .model('App/Models/User')
  .createMany(3)
```

### make
Retorne a instância do modelo, mas não a persista no banco de dados:

``` js
await Factory
  .model('App/Models/User')
  .make()
```

### makeMany
Retorne a matriz de instâncias do modelo, mas não as persista no banco de dados:

``` js
await Factory
  .model('App/Models/User')
  .makeMany(3)
```

## Uso Sem Lucid
Se seu aplicativo não usa modelos Lucid, você ainda pode usar o Provedor de Banco de Dados para gerar registros de banco de 
dados de fábrica.

### blueprint
Para definir o modelo de fábrica sem o Lucid, passe um nome de tabela como o primeiro parâmetro em vez de um nome de modelo 
(por exemplo, `users` em vez de `App/Models/User`):

``` js
Factory.blueprint('users', (faker) => {
  return {
    username: faker.username(),
    password: faker.password()
  }
})
```

### create
Criou um registro de tabela:

``` js
run () {
  await Factory.get('users').create()
}
```

### table
Defina um nome de tabela diferente em tempo de execução:

``` js
await Factory
  .get('users')
  .table('my_users')
  .create()
```

### returning
Para o PostgreSQL, defina uma coluna de retorno:

``` js
await Factory
  .get('users')
  .returning('id')
  .create()
```

### connection
Escolha uma conexão diferente no tempo de execução:
``` js
await Factory
  .get('users')
  .connection('mysql')
  .returning('id')
  .create()
```

### createMany
Crie vários registros:
``` js
await Factory
  .get('users')
  .createMany(3)
```

## Dados Personalizados
Os métodos `make`, `makeMany`, `create` e `createMany` aceita um objeto de dados personalizado que é passado diretamente para 
seus projetos.

Por exemplo:
``` js
const user = await Factory
  .model('App/Models/User')
  .create({ status: 'admin' })
```

Dentro do seu blueprint, seu objeto de dados personalizado é consumido da seguinte forma:

``` js
Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    username: faker.username(),
    status: data.status
  }
})
```

## API do Faker
O objeto `faker` passado para um blueprint de fábrica é uma referência à biblioteca JavaScript do gerador aleatório do 
[Chance](http://chancejs.com/).

Certifique-se de ler a documentação do [Chance](http://chancejs.com/) para obter a lista completa dos métodos `faker` e propriedades 
disponíveis.

## Perguntas frequentes
Como fábricas e sementes se encaixam em muitos casos de uso diferentes, você pode ficar confuso sobre como / quando usá-los, 
então aqui está uma lista de perguntas freqüentes.

+ Fábricas e seeds precisam ser usadas juntas?
Não. Fábricas e seeds não dependem uma da outra e podem ser usadas independentemente. Por exemplo, você pode apenas usar 
arquivos de seeds para importar dados para um aplicativo AdonisJs de um aplicativo completamente diferente.

+ Posso usar fábricas ao escrever testes?
Sim. Importe o fornecedor da fábrica (`Factory`) para o seu teste e use-o conforme necessário.

+ Posso executar apenas arquivos de seeds selecionados?
Sim. Passar `--files` com uma lista de nomes de arquivos separados por vírgula para o comando `adonis seed` garante que apenas esses arquivos sejam executados, por exemplo:

```
> adonis seed --files='UsersSeeder.js, PostsSeeder.js'
```

