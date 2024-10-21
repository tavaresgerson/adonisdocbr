# Controladores

Os controladores são anexados às rotas e são o ponto comum de interação entre seus modelos e visualizações.

Em aplicações web típicas, você começará por vincular um método de controlador a uma rota, usar modelos para buscar dados e enviar esses dados à visão para renderizar HTML.

## Como os controladores funcionam?

* Os controladores são definidos dentro do diretório `app/Http/Controllers`. Para manter seu código legível, você é livre para criar subdiretórios dentro do diretório *Controladores*.

* Utilize o comando `make:controller` para criar um novo controlador.

```bash

./ace make:controller Home
# or
./ace make:controller User --resource

# create: app/Http/Controllers/HomeController.js
```
A bandeira `--resource` criará um controlador com métodos de rota pré-definidos: `_resourceful_routes[resourceful]`.

* Os controladores são definidos como classes ES2015, o que facilita a sua teste, já que você pode injetar dependências de tempo de execução no construtor e simulá-las (se necessário) durante os testes.

* Os métodos do controlador são referenciados como uma *String* para as rotas.
```js
Route.get('users', 'UsersController.index')
```

A primeira parte antes do *dot(.)* é uma referência ao arquivo controlador que é o *UserController* e a segunda parte é o método controlador.

## Exemplo básico
Vamos pegar um exemplo básico de renderização de todos os usuários usando a rota, controlador, modelo e visualização.

```js
.Route
Route.get('users', 'UsersController.index')
```

```js
.Controller
const User = use('App/Model/User')

class UsersController {

  * index (request, response) {
    const users = yield User.all()
    yield response.sendView('users', { users: users.toJSON() })
  }

}
```

```twig
// View
{% for user in users %}
  <h2>{{ user.username }}</h2>
{% endfor %}
```

## Injeção de Dependência
Como os controladores são classes ES2015, você pode facilmente injetar dependências no construtor, em vez de exigir manualmente. A vantagem de injetar dependências é que você pode simulá-las na hora de testar.

> DICA:
> Mockar dependências é muito subjetivo e nem sempre necessário. Ainda assim, o Adonis não limita você se quiser mockar as dependências.

### Definindo Controlador

```js
class UsersController {

  static get inject () {
    return ['App/Model/User'] <1>
  }

  constructor (User) { <2>
    this.User = User
  }

  * index () {
    const users = yield this.User.all()
  }

}
```

1. O método getter 'inject' retorna um array de namespaces a serem injetados no construtor. Eles são passados na ordem em que são definidos.
2. O método construtor receberá os injeções como parâmetros.

### Redação de Teste

> NOTE:
> Abaixo um exemplo de teste é escrito para dar-lhe uma ideia sobre como simular dependências e pode não ser a melhor maneira de escrever testes.

```js
const UsersController = use('App/Http/Controllers/User')

class FakeUser {
  static * all () {
    return {} // dummy users
  }
}

const user = new UsersController(FakeUser)
```
