# Estrutura de Pastas

A estrutura de diretórios do AdonisJs pode parecer avassaladora à primeira vista, pois existem vários 
diretórios pré-configurados.

Gradualmente, você entenderá o benefício de separar suas entidades em vários diretórios, mantendo 
seu código sustentável e fácil de pesquisar.

Uma instalação padrão do AdonisJs é mais ou menos assim:

```
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

## Diretório Raiz

### app
O diretório `app` é o lar da sua lógica de aplicativo.

É carregado automaticamente sob o namespace `App`.

### config
O diretório `config` é usado para definir a configuração do seu aplicativo.

O AdonisJs é enviado com vários arquivos de configuração, mas fique à vontade para criar os seus.

[Leia mais sobre configuração](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/started/configuration-and-env.md).

### database
O diretório `database` é usado para armazenar todos os arquivos relacionados ao banco de dados.

[Leia mais sobre bancos de dados](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/database/started.md).

### public
O diretório `public{` é usado para servir ativos estáticos sobre HTTP.

Este diretório é mapeado para a raiz do seu site:

<!-- atual arquivo armazenado eim /public/style.css -->
<link rel="stylesheet" href="/style.css" />

### resources
O diretório `resources` é usado para armazenar arquivos de apresentação para seu aplicativo, como 
modelos de exibição, arquivos LESS/SASS, JavaScript não compilado ou até imagens.

### start
O diretório `start` é usado para armazenar arquivos carregados na inicialização do seu aplicativo. 
Por padrão, você vai encontrar `app.js`, `kernel.js` e `routes.js`.

### test
O diretório `test` é usado para armazenar todos os seus testes de aplicativos. O pacote de teste 
não está incluído por padrão - você pode instalá-lo seguindo as instruções definidas [aqui](https://adonisjs.com/docs/4.1/testing).

## Diretórios de aplicativos

### app/Commands
O diretório `app/Commands` é usado para armazenar todos os seus comandos da CLI. Este diretório é criado 
automaticamente quando você executa `adonis make:command <name>`.

### app/Controllers
O diretório `app/Controllers` é usado para armazenar todos os seus controladores `Http` e `WebSocket`. 
Este diretório é criado automaticamente quando você executa `adonis make:controller <name>`.

### app/Exceptions
O diretório `app/Exceptions` é usado para armazenar o manipulador de exceção global e todas as suas 
exceções personalizadas. Este diretório é criado automaticamente quando você executa `adonis make:ehandler` ou 
`adonis make:exception <name>`.

### app/Listeners
O diretório `app/Listeners` é usado para armazenar todos os ouvintes de eventos. Este diretório é criado 
automaticamente quando você executa `adonis make:listener <name>`.

### app/Middleware
O diretório `app/Middleware` é usado para armazenar todo o seu middleware. Este diretório é criado automaticamente 
quando você executa `adonis make:middleware <name>`.

### app/Models
O diretório `app/Models` é usado para armazenar todos os seus modelos. Este diretório é criado automaticamente 
quando você executa `adonis make:model <name>`.

### app/Validators
O diretório `app/Validators` é usado para armazenar todos os seus validadores de rota. Este diretório é criado 
automaticamente quando você executa `adonis make:validator <name>` (é necessário ter instalado o [Validator Provider](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/basics/validator.md) 
para usar este comando).
