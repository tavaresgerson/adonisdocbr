# Configuração do banco de dados

O AdonisJs vem pronto para uso para bancos de dados SQL e oferece uma API Javascript unificada para interagir com bancos de dados. Abaixo está a lista de bancos de dados suportados.

## Bancos de dados suportados

* PostgreSQL
* SQLite
* MySQL
* MariaDB
* Oracle
* MSSQL

## Configuração
Todo aplicativo AdonisJs vem com o suporte pré-configurado para [Query builder](/docs/05-database/02-query-builder.md) e [Lucid Orm](/docs/06-lucid/01-lucid.md), tudo o que você precisa fazer é ajustar a configuração conforme suas necessidades.

Por padrão, a configuração é definida para usar o SQLite como o banco de dados em desenvolvimento, que pode ser alterado usando o arquivo `config/database.js`.

```js
// config/database.js

module.exports = {
  connection: Env.get('DB_CONNECTION', 'sqlite'), <1>

  sqlite: {
    ....
  }, <2>

  mysql: {
    ....
  }
}
```

1. A propriedade `connection` define a conexão padrão a ser usada para fazer consultas SQL.
2. A configuração de conexão individual é definida ao lado do nome da conexão. Você está livre para criar vários blocos de configuração.

## Exemplo básico
Vamos começar a tocar o provedor de banco de dados selecionando todos os usuários da tabela `users`.

```js
// Rota

Route.get('/users', 'UsersController.index')
```

```js
// Controller

'use strict'

const Database = use('Database')

class UsersController {

  * index (request, response) {
    const users = yield Database.select('*').from('users')
    response.json(users)
  }

}
```

::: tip DICA
A sintaxe do construtor de consultas é fluente, o que significa que você pode encadear métodos para construir uma consulta SQL completa. Além disso, você não terá que alterar uma linha de código ao alternar entre vários bancos de dados.
:::

## Drivers de banco de dados e suas configurações
Como o AdonisJs suporta todos os bancos de dados SQL populares, você tem que instalar seus drivers equivalentes do npm e configurá-los conforme definido abaixo.

### MySQL

#### Drivers disponíveis:

* [mysql](https://www.npmjs.com/package/mysql)
* [mysql2](https://www.npmjs.com/package/mysql2)

#### Configuração:

```js
mysql: {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'adonis'
  }
}
```

Além disso, você pode definir um caminho de soquete para construir a conexão MySQL. Fornecer o caminho do soquete ignorará as opções de host e porta.

```js
mysql: {
  client: 'mysql',
  connection: {
    socketPath: '/path/to/socket.sock',
    user: 'root',
    password: '',
    database: 'adonis'
  }
}
```

### SQLite

#### Driver disponível:

* [sqlite3](https://www.npmjs.com/package/sqlite3)

#### Configuração:

```js
sqlite: {
  client: 'sqlite3',
  connection: {
    filename: Helpers.storagePath('development.sqlite')
  }
}
```

### PostgreSQL

#### Driver disponível:

* [pg](https://www.npmjs.com/package/pg)

#### Configuração:

```js
pg: {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: '',
    password: '',
    database: 'adonis',
    ssl: false
  }
}
```

Além disso, você pode passar uma string de conexão

```js
pg: {
  client: 'pg',
  connection: 'postgres://user:password@host:port/database?ssl=true'
}
```

### Oracle

#### Drivers disponíveis:

* [oracle](https://www.npmjs.com/package/oracle)
* [strong-oracle](https://www.npmjs.com/package/strong-oracle)

#### Configuração:

```js
oracle: {
  client: 'oracle',
  connection: {
    host: '127.0.0.1',
    port: 1521,
    user: '',
    password: '',
    database: 'adonis'
  }
}
```

### MariaDB

#### Driver disponível:

* [mariasql](https://www.npmjs.com/package/mariasql)

#### Configuração:

```js
maria: {
  client: 'mariasql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'adonis'
  }
}
```

### MSSQL

#### Driver disponível:

* [mssql](https://www.npmjs.com/package/mssql)

#### Configuração:

```js
mssql: {
  client: 'mssql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'adonis'
  }
}
```

## Depuração
A depuração de consultas de banco de dados é útil para verificar o tempo de resposta do banco de dados ou para garantir que o construtor de consultas execute o consulta correta. Vamos analisar algumas estratégias de depuração diferentes.

### Globalmente
A maneira mais fácil de depurar consultas globalmente é definir o sinalizador `debug` no bloco de configuração.

```js
// config/database.js

mysql: {
  client: 'mysql',
  connection: {},
  debug: true <1>
}
```

Além disso, você pode ativar a depuração no seu código ouvindo os eventos `query` ou `sql` no provedor de banco de dados. O melhor lugar para registrar um ouvinte é no arquivo `app/Listeners/Http.js`.

```js
// app/Listeners/Http.js

Http.onStart = function () {
  Database.on('query', console.log)
  Database.on('sql', console.log)
}
```

A única diferença entre `query` e o evento `sql` é a saída.

Saída do evento SQL:

```bash
+ 1.38 ms : select * from `users` where `username` = 'doe'
```

Saída do evento de consulta:

```js
{
  method: 'select',
  options: {},
  bindings: [ 'doe' ],
  sql: 'select * from `users` where `username` = ?'
}
```

### Consulta individual
Além disso, você pode depurar uma única consulta encadeando o ouvinte de eventos ao executar a consulta.

```js
yield Database
  .on('sql', console.log)
  .table('users')
  .where('username', 'doe')
```

Ou

```js
yield Database
  .debug()
  .table('users')
  .where('username', 'doe')
```
