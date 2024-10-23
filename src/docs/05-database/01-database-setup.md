# Configuração do Banco de Dados

AdonisJS tem fora-da-caixa para bancos de dados SQL e oferece uma API unificada JavaScript para interagir com bancos de dados. Abaixo está a lista de bancos de dados suportados.

## Suporte a Bancos de Dados

PostgreSQL
* SQLite
MySQL
MariaDB
* Oracle
* MSSQL

## Configuração
Todo aplicativo AdonisJS vem com suporte pré-configurado para link: query-builder [Builder de consulta] e link: lucid [Lucid ORM], tudo o que você precisa fazer é ajustar a configuração conforme suas necessidades.

Por padrão a configuração é para usar o SQLite como banco de dados em desenvolvimento, que pode ser alterado usando o arquivo `config/database.js`.

```js
// .config/database.js

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

1. A propriedade 'conexão' define a conexão padrão a ser usada para fazer consultas SQL.
2. A configuração de conexão individual é definida ao lado do nome da conexão. Você pode criar vários blocos de configuração.

## Exemplo básico
Vamos começar a jogar o provedor de banco de dados selecionando todos os usuários da tabela "usuários".

```js
// Route

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

> DICA:
> A sintaxe do construtor de consultas é fluente o que significa que você pode encadear métodos para construir uma consulta SQL completa. Além disso, você não terá que alterar uma única linha de código quando mudar entre vários bancos de dados.

## Drivers de Banco de Dados & Suas Configurações
Como o Adonis suporta todos os bancos de dados SQL populares, você precisa instalar seus drivers equivalentes do npm e configurá-los conforme definido abaixo.

### MySQL

#### Disponível Drivers

[mysql](https://www.npmjs.com/package/mysql)
[mysql2](https://www.npmjs.com/package/mysql2)

#### Configuração

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

Além disso, você pode definir um caminho de soquete para construir a conexão MySQL. Dar o caminho do soquete ignorará as opções de host e porta.

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

#### Disponível Drivers

[sqlite3](https://www.npmjs.com/package/sqlite3)

#### Configuração

```js
sqlite: {
  client: 'sqlite3',
  connection: {
    filename: Helpers.storagePath('development.sqlite')
  }
}
```

### PostgreSQL

#### Disponível Drivers

[pg](https://www.npmjs.com/package/pg)

#### Configuração

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

#### Disponível Drivers

Oracle
strong-oracle

#### Configuração

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

#### Disponível Drivers

MariaDB

#### Configuração

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

#### Disponível Drivers

[mssql](https://www.npmjs.com/package/mssql)

#### Configuração

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
Depurar consultas de banco de dados são úteis para verificar o tempo de resposta do banco de dados ou para garantir que o construtor de consulta realiza a consulta correta. Vamos passar por algumas estratégias diferentes de depuração.

### Globalmente
A maneira mais fácil de depurar consultas globalmente é definir a bandeira "debug" no bloco de configuração.

```js
// .config/database.js

mysql: {
  client: 'mysql',
  connection: {},
  debug: true <1>
}
```

Além disso, você pode ativar o depuração dentro do seu código escutando os eventos 'query' ou 'sql' no provedor de banco de dados. O melhor lugar para registrar um ouvinte é no arquivo 'app/Listeners/Http.js'.

```js
// .app/Listeners/Http.js

Http.onStart = function () {
  Database.on('query', console.log)
  Database.on('sql', console.log)
}
```

A única diferença entre `query` e o evento `sql` é a saída.

#### Saída de evento SQL

```mysql
+ 1.38 ms : select * from `users` where `username` = 'doe'
```

#### Consulta saída do evento

```js
{
  method: 'select',
  options: {},
  bindings: [ 'doe' ],
  sql: 'select * from `users` where `username` = ?'
}
```

### Consulta Individual
Além disso, você pode depurar uma única consulta por meio da cadeia do ouvinte de eventos quando executar a consulta.

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
