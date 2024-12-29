# Estrutura de diretório

A estrutura de diretório do AdonisJs pode parecer esmagadora à primeira vista, pois há um punhado de diretórios pré-configurados.

Gradualmente, você entenderá o benefício de separar suas entidades em vários diretórios, mantendo seu código sustentável e fácil de pesquisar.

Uma instalação padrão do AdonisJs se parece com isso:

```bash
.
├── app/
  ├── ...
├── config/
  ├── app.js
  ├── auth.js
  └── ...
├── database/
  ├── migrations/
  ├── seeds/
  └── factory.js
├── public/
├── resources/
  ├── ...
  └── views/
├── storage/
├── start/
  ├── app.js
  ├── kernel.js
  └── routes.js
├── test/
├── ace
├── server.js
└── package.json
```

## Diretórios raiz

### app

O diretório `app` é o lar da lógica do seu aplicativo.

Ele é carregado automaticamente sob o namespace `App`.

### config

O diretório `config` é usado para definir a configuração do seu aplicativo.

O AdonisJs vem com vários arquivos de configuração, mas sinta-se à vontade para criar o seu próprio.

[Leia mais sobre configuração](/docs/03-getting-started/02-Configuration.md).

### database

O diretório `database` é usado para armazenar todos os arquivos relacionados ao banco de dados.

[Leia mais sobre bancos de dados](/docs/07-Database/01-Getting-Started.md).

### public

O diretório `public` é usado para servir ativos estáticos por HTTP.

Este diretório é mapeado para a raiz do seu site:

```html
<!-- o arquivo real é armazenado em /public/style.css -->
<link rel="stylesheet" href="/style.css" />
```

### resources

O diretório `resources` é usado para armazenar arquivos de apresentação para seu aplicativo, como modelos de visualização, arquivos LESS/SASS, JavaScript não compilado ou até mesmo imagens.

### start

O diretório `start` é usado para armazenar arquivos que são carregados na inicialização do seu aplicativo.
Por padrão, você encontrará `app.js`, `kernel.js` e `routes.js`.

### test

O diretório `test` é usado para armazenar todos os seus testes de aplicativo.
O pacote testing não é incluído por padrão – você pode instalá-lo seguindo as instruções definidas link:testing[aqui].

## Diretórios app

### app/Commands

O diretório `app/Commands` é usado para armazenar todos os seus comandos CLI.
Este diretório é criado automaticamente quando você executa `adonis make:command <name>`.

### app/Controllers

O diretório `app/Controllers` é usado para armazenar todos os seus controladores `Http` e `WebSocket`.
Este diretório é criado automaticamente quando você executa `adonis make:controller <name>`.

### app/Exceptions

O diretório `app/Exceptions` é usado para armazenar o manipulador de exceção global e todas as suas exceções personalizadas.
Este diretório é criado automaticamente quando você executa `adonis make:ehandler` ou `adonis make:exception <name>`.

### app/Listeners

O diretório `app/Listeners` é usado para armazenar todos os ouvintes de eventos.
Este diretório é criado automaticamente quando você executa `adonis make:listener <name>`.

### app/Middleware

O diretório `app/Middleware` é usado para armazenar todos os seus middlewares.
Este diretório é criado automaticamente quando você executa `adonis make:middleware <nome>`.

### app/Models

O diretório `app/Models` é usado para armazenar todos os seus modelos.
Este diretório é criado automaticamente quando você executa `adonis make:model <nome>`.

### app/Validators

O diretório `app/Validators` é usado para armazenar todos os seus validadores de rota.
Este diretório é criado automaticamente quando você executa `adonis make:validator <nome>` (você precisa ter instalado o [Validator Provider](/src/docs/04-Basics/08-Validation.md) para usar este comando).
