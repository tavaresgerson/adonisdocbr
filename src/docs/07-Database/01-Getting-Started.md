---
title: Getting Started
category: database
---

# Introdução

A criação de aplicativos orientados a dados do AdonisJs é bastante simplificada por meio de seu poderoso [Query Builder](/original/markdown/07-Database/02-Query-Builder.md), [Lucid ORM](/original/markdown/08-Lucid-ORM/01-Getting-Started.adoc), [Migrations](/original/markdown/07-Database/03-Migrations.md), [Factories](/original/markdown/07-Database/04-Seeding.md) e [Seeds](/original/markdown/07-Database/04-Seeding.md).

Neste guia, aprenderemos a configurar e usar o *Database Provider*.

> OBSERVAÇÃO: O Data Provider usa [Knex.js](https://knexjs.org) internamente, portanto, navegue pela documentação do Knex sempre que precisar de mais informações.

## Bancos de dados suportados
A lista de bancos de dados suportados e seus drivers equivalentes são os seguintes:

| Banco de dados | Driver NPM |
|-------------|-----------------------------------|
| MariaDB | `npm i mysql` ou `npm i mysql2` |
| MSSQL | `npm i mssql` |
| MySQL | `npm i mysql` ou `npm i mysql2` |
| Oracle | `npm i oracledb` |
| PostgreSQL | `npm i pg` |
| SQLite3 | `npm i sqlite3` |

## Configuração

### Instalação
Se o *Provedor de Banco de Dados* (*Lucid*) não estiver instalado, puxe-o de `npm`:

```bash 
adonis install @adonisjs/lucid
```

Em seguida, registre os seguintes provedores dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/lucid/providers/LucidProvider'
]

const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider'
]
```

> NOTA: Muitos boilerplates do AdonisJs têm o *Lucid* instalado por padrão.

### Configuração
O *Provedor de Banco de Dados* usa a conexão `sqlite` por padrão.

A conexão padrão pode ser definida por meio do arquivo `config/database.js`:

```js
// .config/database.js

module.exports = {
  connection: 'mysql',
}
```

Todas as [opções de configuração](http://knexjs.org/#Installation-client) do Knex são suportadas como estão.

## Exemplo básico
O AdonisJs link:query-builder[Query Builder] tem uma API *fluente*, o que significa que você pode encadear/anexar métodos JavaScript para criar suas consultas SQL.

Por exemplo, para selecionar e retornar todos os usuários como JSON:

```js
const Database = use('Database')

Route.get('/', async () => {
  return await Database.table('users').select('*')
})
```

### Cláusula Where
Para adicionar uma cláusula where a uma consulta, encadeie um método `where`:

```js
Database
  .table('users')
  .where('age', '>', 18)
```

Para adicionar outra cláusula where, encadeie um método `orWhere`:

```js
Database
  .table('users')
  .where('age', '>', 18)
  .orWhere('vip', true)
```

Consulte a documentação do [Query Builder](/original/markdown/07-Database/02-Query-Builder.md) para obter a referência completa da API.

## Conexões múltiplas
Por padrão, o AdonisJs usa o valor `connection` definido dentro do arquivo `config/database.js` ao fazer consultas de banco de dados.

Você pode selecionar qualquer uma das conexões definidas dentro do arquivo `config/database.js` em tempo de execução para fazer suas consultas:

```js
Database
  .connection('mysql')
  .table('users')
```

> NOTA: Como o AdonisJs agrupa conexões para reutilização, todas as conexões usadas são mantidas, a menos que o processo morra.

Para fechar uma conexão, chame o método `close` passando quaisquer nomes de conexão:

```js
const users = await Database
  .connection('mysql')
  .table('users')

// later close the connection
Database.close(['mysql'])
```

## Prefixação de tabela
O *Provedor de banco de dados* pode prefixar automaticamente nomes de tabela definindo um valor `prefix` dentro do arquivo `config/database.js`:

```js
// .config/database.js

module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    prefix: 'my_'
  }
}
```

Agora, todas as consultas na conexão `sqlite` terão `my_` como prefixo de tabela:

```js
await Database
  .table('users')
  .select('*')
```

```sql
-- .SQL Output

select * from `my_users`
```

#### `withOutPrefix`
Se um valor `prefix` for definido, você pode ignorá-lo chamando `withOutPrefix`:

```js
await Database
  .withOutPrefix()
  .table('users')
```

## Depuração
A depuração de consultas de banco de dados pode ser útil tanto no desenvolvimento quanto na produção.

Vamos analisar as estratégias disponíveis para depurar consultas.

### Globalmente
Definir `debug: true` dentro do arquivo `database/config.js` habilita a depuração para todas as consultas globalmente:

```js
// .config/database.js

module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    connection: {},
    debug: true
  }
}
```

Você também pode depurar consultas por meio do evento `query` do *Provedor de Banco de Dados*.

Escute o evento `query` definindo um hook dentro do arquivo `start/hooks.js`:

```js
// .start/hooks.js

const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Database = use('Database')
  Database.on('query', console.log)
})
```

> OBSERVAÇÃO: Crie o arquivo `start/hooks.js` se ele não existir.

### Localmente
Você pode escutar o evento `query` por consulta em tempo de execução:

```js
await Database
  .table('users')
  .select('*')
  .on('query', console.log)
```

### Logs de consultas lentas
Acompanhar consultas SQL lentas é útil para manter seu aplicativo funcionando sem problemas.

O AdonisJs facilita o rastreamento de consultas SQL lentas ao ouvir o evento `slow:query`:

```js
Database.on('slow:query', (sql, time) => {
  console.log(`${time}: ${sql.query}`)
})
```

A configuração para consultas lentas é salva ao lado das configurações de conexão no arquivo `config/database.js`:

```js
module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    slowQuery: {
      enabled: true,
      threshold: 5000
    }
  }
}
```
