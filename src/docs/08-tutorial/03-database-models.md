# Modelos de Banco de Dados

Até agora, cobrimos os conceitos básicos de configuração de um novo aplicativo AdonisJs criando Rotas, Controladores e renderizando Visualizações. Neste tutorial, daremos um passo adiante aprendendo sobre *Modelos de Banco de Dados*.

O AdonisJs suporta a maioria dos bancos de dados SQL. Aqui está um guia completo sobre [Configuração de Banco de Dados](/docs/05-database/01-database-setup.md). Começaremos criando migrações e modelos de dados, também conhecidos como modelos Lucid.

## O que é um Modelo de Banco de Dados?
Cada modelo de Banco de Dados representa uma única tabela SQL dentro do seu banco de dados. Por exemplo:

| Modelo    | Tabela de Banco de Dados  |
|-----------|---------------------------|
| User      | users                     |
| Post      | posts                     |
| Category  | categories                |

Espero que faça sentido. Agora, para interagir com as postagens, precisamos de duas coisas.

1. Um modelo de postagem.
2. E uma tabela de banco de dados de postagens.

## Criando o modelo de banco de dados
Os modelos ficam dentro de um diretório dedicado chamado *app/Model*. Vamos usar o ace para criar o modelo de postagem.

```bash
./ace make:model Post
```

```bash
# docs
create: app/Model/Post.js
```

```js
// app/Model/Post.js

'use strict'

const Lucid = use('Lucid')

class Post extends Lucid {
}

module.exports = Post
```

Cada modelo é uma *Classe ES2015* dedicada, assim como nossos [Controllers](/docs/03-getting-started/09-controllers.md), mas cada modelo estenderá o Lucid para torná-lo diferente de uma classe comum.

Você nunca precisa tocar em seus modelos na maioria dos casos. Então, deixaremos esse arquivo como está e mudaremos para outra tarefa.

## O que são migrações?
Nosso próximo passo é escolher um banco de dados com o qual queremos trabalhar e criar as tabelas de banco de dados necessárias. Para simplificar, vamos usar *SQLite*. No entanto, você pode usar *MYSQL* ou *PostgreSQL*.

Migração é um processo de criação de tabelas de banco de dados usando o código Javascript. As migrações têm muitos benefícios em comparação ao fluxo de trabalho padrão de criação de tabelas de banco de dados usando SequelPro, Workbench, etc. Confira o guia link:migrations[Migrations] para saber mais sobre elas.

## Criando migrações
Como sempre, *ace (nosso amigo)* criará uma migração para nós.

```bash
./ace make:migration posts --create=posts
```

```bash
# docs

create: database/migrations/1464075245386_posts.js
```

Abra rapidamente este arquivo e explore as opções para criar uma tabela de banco de dados sem tocar na interface SQL.

```js
// database/migrations/1464075245386_posts.js

'use strict'

const Schema = use('Schema')

class PostSchema extends Schema {

  up () {
    this.create('posts', (table) => {
      table.increments()
      table.string('title')
      table.text('content')
      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }

}

module.exports = PostSchema
```

Uau! É tão simples definir uma tabela de banco de dados dentro de seus arquivos Js padrão. Apenas anote os seguintes pontos ao trabalhar com migrações

1. O método `up` é usado para criar uma tabela ou adicionar novos campos à tabela existente, etc.
2. O `down` é sempre o oposto de up. Ele é usado quando você quer desfazer as alterações que acabou de fazer, também conhecido como *rollback*.

## Driver SQLite e execução de migrações
Finalmente, precisamos executar esta migração para executar a consulta SQL e criar a tabela de banco de dados chamada *posts*. Antes disso, precisamos ter certeza de que o SQLite está configurado corretamente.

```bash
# Installing SQLite3 driver

npm i --save sqlite3
```

```bash
# Running Migrations

./ace migration:run
```

```bash
# docs

✔ Database migrated successfully.
```

Abordamos muito neste tutorial, especialmente se você é novo nesses conceitos. Essa é a questão sobre frameworks: você precisa gastar alguns dias para obter uma compreensão sólida das ferramentas e opções disponíveis para tornar seu ciclo de desenvolvimento muito mais fácil no futuro.
