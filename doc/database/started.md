# Começando

A criação de aplicativos orientados a dados do AdonisJ é bastante simplificada por meio do poderoso [Query Builder](https://adonisjs.com/docs/4.1/query-builder), 
[Lucid ORM](https://adonisjs.com/docs/4.1/lucid), [Migrations](https://adonisjs.com/docs/4.1/migrations), [Fábricas](https://adonisjs.com/docs/4.1/seeds-and-factories) e [Seeds](https://adonisjs.com/docs/4.1/seeds-and-factories).

Neste guia, aprenderemos a configurar e usar o provedor de banco de dados .

> O Data Provider usa o [Knex.js](https://knexjs.org/) internamente, portanto, procure a documentação do Knex sempre que informações 
> adicionais forem necessárias.

## Bancos de dados suportados
A lista de bancos de dados suportados e seus drivers equivalentes são os seguintes:

| Base de dados         | Driver NPM                            |
|-----------------------|---------------------------------------|
| MariaDB               | `npm i mysql` ou `npm i mysql2`       |
| MSSQL                 | `npm i mssql`                         |
| MySQL                 | `npm i mysql` ou `npm i mysql2`       |
| Oracle                | `npm i oracledb`                      |
| PostgreSQL            | `npm i pg`                            |
| SQLite3               | `npm i sqlite3`                       |

## Configuração

### Instalação
Se o provedor de banco de dados (Lucid) não estiver instalado, puxe-o pelo npm:

```
adonis install @adonisjs/lucid
```

Em seguida, registre os seguintes provedores dentro do arquivo `start/app.js`:

``` js
const providers = [
  '@adonisjs/lucid/providers/LucidProvider'
]

const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider'
]
```

> O Adonis tem muitos boilerplates instalados no Lucid por padrão.

### Configuração
O provedor de banco de dados usa a conexão `sqlite` por padrão.

A conexão padrão pode ser definida através do arquivo `config/database.js`:

``` js
module.exports = {
  connection: 'mysql',
}
```

Todas as [opções de configuração](http://knexjs.org/#Installation-client) do Knex são suportadas como estão.

## Exemplo básico
O [Query Builder](https://adonisjs.com/docs/4.1/query-builder) do AdonisJs possui uma API fluente, o que significa que 
você pode encadear/anexar métodos JavaScript para criar suas consultas SQL.

Por exemplo, para selecionar e retornar todos os usuários como JSON:

``` js
const Database = use('Database')

Route.get('/', async () => {
  return await Database.table('users').select('*')
})
```

### Cláusula Where
Para adicionar uma cláusula `where` a uma consulta, encadeie um método `where`:

``` js
Database
  .table('users')
  .where('age', '>', 18)
```

Para adicionar outra cláusula `where`, encadeie um método `orWhere`:

``` js
Database
  .table('users')
  .where('age', '>', 18)
  .orWhere('vip', true)
```

Consulte a documentação do [Query Builder](https://adonisjs.com/docs/4.1/query-builder) para obter a referência completa da API.


## Conexões Múltiplas
Por padrão, o AdonisJs usa o valor `connection` definido dentro do arquivo `config/database.js` ao fazer 
consultas ao banco de dados.

Você pode selecionar qualquer uma das conexões definidas dentro do arquivo `config/database.js` em tempo de execução 
para fazer suas consultas:

``` js
Database
  .connection('mysql')
  .table('users')
```

> Como o AdonisJs agrupa conexões para reutilização, todas as conexões usadas são mantidas, a menos que o processo encerre.

Para fechar uma conexão, chame o método `close` que pode ser passado qualquer nome de conexão:

``` js
const users = await Database
  .connection('mysql')
  .table('users')

// depois feche a conexão
Database.close(['mysql'])
```

## Prefixo de tabela
O provedor de banco de dados pode prefixar automaticamente os nomes das tabelas definindo um valor `prefix` dentro do
arquivo `config/database.js`:

``` js
module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    prefix: 'my_'
  }
}
```

Agora, todas as consultas na conexão `sqlite` terão `my_` como prefixo da tabela:

``` js
await Database
  .table('users')
  .select('*')
```

Saída SQL

``` js
select * from `my_users`
```

### withOutPrefix
Se um valor `prefix` for definido, você poderá ignorá-lo chamando `withOutPrefix`:

``` js
await Database
  .withOutPrefix()
  .table('users')
```

## Depuração
A depuração de consultas ao banco de dados pode ser útil no desenvolvimento e na produção.

Vamos analisar as estratégias disponíveis para depurar consultas.

### Globalmente
A configuração `debug: true` dentro do arquivo `database/config.js` permite a depuração de todas as consultas globalmente:

``` js
module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    connection: {},
    debug: true
  }
}
```

Você também pode depurar consultas por meio do evento `query` do Provedor de Banco de Dados.

Ouça o evento `query` definindo um gancho dentro do arquivo `start/hooks.js`:

``` js
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Database = use('Database')
  Database.on('query', console.log)
})
```

> Crie o arquivo `start/hooks.js` se ele não existir.

### Localmente
Você pode ouvir o evento `query` por consulta em tempo de execução:

``` js
await Database
  .table('users')
  .select('*')
  .on('query', console.log)
```
