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

Exemplo básico
O AdonisJs Query Builder possui uma API fluente , o que significa que você pode encadear / anexar métodos JavaScript para criar suas consultas SQL.

Por exemplo, para selecionar e retornar todos os usuários como JSON:

const Database = use('Database')

Route.get('/', async () => {
  return await Database.table('users').select('*')
})
