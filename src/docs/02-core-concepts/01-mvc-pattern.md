# Padrão MVC

O padrão MVC separa o aplicativo em três componentes lógicos principais conhecidos como *Modelo*, *Visualização* e *Controlador*. O AdonisJs suporta todos os três e torna muito simples uni-los. Junto com isso, o Adonis Router também desempenha um papel importante no tratamento de solicitações HTTP e na passagem delas para o controlador.

![imagem](/docs/assets/MVC-Flow-Chart_ccz2zb.jpg)

## Modelo
O modelo é a camada de dados responsável por buscar dados do banco de dados, que é SQL no caso do AdonisJs. Para tornar o processo de busca de dados simples e seguro, o AdonisJs vem com um belo ORM chamado [Lucid](/docs/06-lucid/01-lucid.md).

```js
// Definindo um modelo

'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

}
```

```js
// Usando o modelo

const User = use('App/Model/User')

// Todos os usuários
const users = yield User.all()

// Usando a cláusula where
const activeUsers = yield User.query().where('status', 'active').fetch()
```

## Controlador
Controlador, como o nome sugere, controla o fluxo de uma solicitação HTTP. Ele faz uso do *Modelo* para buscar os dados necessários e passar esses dados para a *Visualização* para criar uma página HTML.

Os controladores também contêm lógica de negócios/domínio para seu aplicativo, enquanto você frequentemente encontrará pessoas abstraindo a lógica de domínio em serviços reutilizáveis, mas ainda assim esses serviços são consumidos diretamente pelos controladores, e você nunca os acessa dentro dos modelos ou visualizações.

```js
// Exemplo de controlador

const User = use('App/Model/User') <1>

class UsersController {

  * index (request, response) {
    const users = yield User.all()
    yield response.sendView('users.list', {users: users.toJSON()}) <2>
  }

}
```

1. Aqui importamos o *Modelo de Usuário*.
2. Em seguida, renderizamos a visualização `users/list.njk` e passamos a ela o objeto do usuário que pode ser usado pela visualização para exibir uma lista de usuários.

## Visualização
A visualização é a parte final do fluxo, ela faz uso dos dados dinâmicos e renderiza HTML. Para manter suas visualizações declarativas, o AdonisJs oferece uma sintaxe de vinculação de dados agradável para consumir dados dinâmicos e fazer uso deles. Você pode aprender mais sobre o link de templating [aqui](/src/docs/04-views/02-templating.md).

```twig
// Exemplo de visualização

<ul>
  {% for user in users %}
    <li>{{ user.username }}</li>
  {% endfor %}
</ul>
```
