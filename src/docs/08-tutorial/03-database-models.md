# Modelos de Banco de Dados

Até agora cobrimos os básicos de configuração de uma nova aplicação AdonisJS criando Rotas, Controladores e renderizando Views. Neste tutorial, vamos dar um passo à frente aprendendo sobre *Modelos de Banco de Dados*.

AdonisJS suporta a maioria dos bancos de dados SQL. Aqui está um guia completo sobre [Configuração do Banco de Dados](/banco-de-dados/configuração-do-banco-de-dados). Vamos começar criando migrações e modelos de dados, também conhecidos como modelos Lucid.

## O que é um Modelo de Banco de Dados?
Cada modelo de banco de dados representa uma única tabela SQL dentro do seu banco de dados. Por exemplo:

| Modelo | Tabela de banco de dados |
|-------|----------------|
| Usuário | usuários |
| Post | postagens |
| Categoria | categorias |

Espero que faça sentido. Agora para interagir com as postagens, precisamos de duas coisas.

1. Um Modelo de Publicação.
2. E uma tabela de banco de dados de postagens.

## Criando Modelo de Banco de Dados
Os modelos vivem dentro de um diretório dedicado chamado *app/Model*. Vamos usar o Ace para criar o modelo de postagem.

```bash
./ace make:model Post
```

Saída:

```
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

Cada modelo é uma classe *ES2015* dedicada, assim como nossos [Controladores](/getting-started/controladores), mas cada modelo irá estender o Lucid para torná-lo diferente de uma classe comum.

Você nunca precisa tocar em seus modelos na maioria dos casos. Então, vamos deixar este arquivo como está e mudar para outra tarefa.

## O que são Migrações?
Nosso próximo passo é escolher um banco de dados com o qual queremos trabalhar e criar as tabelas necessárias. Para simplificar, vamos nos apegar ao *SQLite*. No entanto, você está livre para usar o *MySQL* ou o *PostgreSQL*.

A migração é um processo de criação de tabelas de banco de dados usando o código Javascript. As migrações têm muitos benefícios em comparação com o fluxo de trabalho padrão de criação de tabelas de banco de dados usando SequelPro, Workbench, etc. Consulte a [Migração] ( / banco de dados / migrações ) para saber mais sobre eles.

## Criando Migrações
Como sempre o *ace (nosso amigo)* vai criar uma migração para nós.

```bash
./ace make:migration posts --create=posts
```

Saída:

```
create: database/migrations/1464075245386_posts.js
```

Abra rapidamente este arquivo e explore as opções para criar tabela de banco de dados sem tocar na interface SQL.

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

Uau! É tão simples definir uma tabela de banco de dados dentro dos seus arquivos padrão Js. Apenas mantenha um registro das seguintes observações ao trabalhar com migrações

1. O método 'up' é usado para criar uma tabela ou adicionar novos campos à tabela existente, etc.
2. O "down" é sempre o oposto do "up". É usado quando você deseja desfazer as alterações que acabou de fazer, também conhecido como *rollback*.

## Driver SQLite & Executando Migrações
Finalmente, precisamos executar esta migração para executar a consulta SQL e criar a tabela do banco de dados chamada *posts*. Antes disso, precisamos ter certeza que o SQLite está configurado corretamente.

```bash
# Installing SQLite3 driver

npm i --save sqlite3
```

```bash
# Running Migrations

./ace migration:run
```

Saída:

```
✔ Database migrated successfully.
```

Cobrimos muito neste tutorial, especialmente se você for novo nesses conceitos. É assim mesmo que funciona com frameworks; você precisa passar alguns dias para ter uma boa compreensão das ferramentas e opções disponíveis para tornar seu ciclo de desenvolvimento muito mais fácil no futuro.
