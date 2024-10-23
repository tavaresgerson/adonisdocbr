# Padrão MVC

O padrão MVC separa a aplicação em três componentes lógicos principais conhecidos como *Modelo*, *Visualização* e *Controlador*. O Adonis suporta todos eles e torna simples a sua união. Além disso, o roteador do Adonis também desempenha um papel importante no tratamento das requisições HTTP e na passagem para o controlador.

![Imagem](/assets/MVC-Flow-Chart_ccz2zb.jpg)

## Modelo
O modelo é a camada de dados responsável por buscar dados do banco de dados que no caso de AdonisJS é SQL. Para tornar o processo de busca de dados simples e seguro, o AdonisJS vem com um ORM lindo chamado link:lucid [Lucid].

```js
// Defing A Model
'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

}
```

```js
// Using Model

const User = use('App/Model/User')

// All Users
const users = yield User.all()

// Using where clause
const activeUsers = yield User.query().where('status', 'active').fetch()
```

## Controlador
Controller, como o nome sugere, controla o fluxo de uma requisição HTTP. Ele utiliza o *Modelo* para buscar os dados necessários e passar esses dados para a *Visualização* para criar uma página HTML.

Controladores também contêm lógica de negócios para sua aplicação, enquanto você muitas vezes encontra pessoas abstraindo a lógica de domínio em serviços reutilizáveis, mas ainda assim esses serviços são consumidos diretamente pelos controladores, e você nunca acessa eles dentro dos modelos ou visualizações.

```js
// Example Of Controller

const User = use('App/Model/User') <1>

class UsersController {

  * index (request, response) {
    const users = yield User.all()
    yield response.sendView('users.list', {users: users.toJSON()}) <2>
  }

}
```

1. Aqui nós importamos o *Modelo de Usuário*.
2. Em seguida, renderizamos o modelo "users/list.njk" e passamos o objeto do usuário para que ele possa ser usado pelo modelo para exibir uma lista de usuários.

## Ver
A visualização é a parte final do fluxo, ela utiliza os dados dinâmicos e renderiza HTML. Para manter suas visualizações declarativas, o AdonisJS oferece uma sintaxe de vinculação de dados agradável para consumir dados dinâmicos e utilizá-los. Você pode aprender mais sobre a sintaxe de vinculação de dados aqui: templating[link].

```twig
// Example Of View

<ul>
  {% for user in users %}
    <li>{{ user.username }}</li>
  {% endfor %}
</ul>
```
