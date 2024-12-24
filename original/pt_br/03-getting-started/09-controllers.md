# Controladores

Os controladores são anexados às rotas e são o ponto comum de interação entre seus modelos e visualizações.

Em aplicativos da web típicos, você começará vinculando um método de controlador a uma rota, fará uso de modelos para buscar dados e enviará esses dados para a visualização para renderizar HTML.

## Como funcionam os controladores?

* Os controladores são definidos dentro do diretório `app/Http/Controllers`. Para manter seu código sustentável, você pode criar diretórios aninhados dentro do diretório *Controllers*.

* Use o comando `make:controller` para criar um novo controlador.

```bash
  ./ace make:controller Home
  # or
  ./ace make:controller User --resource

  # create: app/Http/Controllers/HomeController.js
  ```
+ O sinalizador `--resource` criará um controlador com métodos link:routing#_resourceful_routes[resourceful] predefinidos.

* Os controladores são definidos como classes ES2015, o que torna mais fácil testá-los, pois você pode injetar dependências de tempo de execução no construtor e simulá-las (se necessário) durante os testes.

* Os métodos dos controladores são referenciados como uma *String* para as rotas.
```js
  Route.get('users', 'UsersController.index')
  ```
* A primeira parte antes do *ponto(.)* é uma referência ao arquivo do controlador que é *UserController* e a segunda parte é o método do controlador.

## Exemplo básico
Vamos dar um exemplo básico de renderização de todos os usuários usando a rota, o controlador, o modelo e a visualização.

```js
// Route

Route.get('users', 'UsersController.index')
```

```js
// Controller

const User = use('App/Model/User')

class UsersController {

  * index (request, response) {
    const users = yield User.all()
    yield response.sendView('users', { users: users.toJSON() })
  }

}
```

```twig
<!-- View -->

{% for user in users %}
  <h2>{{ user.username }}</h2>
{% endfor %}
```

## Injeção de dependência
Como os controladores são classes ES2015, você pode facilmente injetar dependências no construtor, em vez de exigi-las manualmente. O benefício de injetar dependências é que você pode simulá-las no momento do teste.

> DICA: Simular dependências é muito subjetivo e nem sempre é necessário. Ainda assim, o AdonisJs não limita você se você quiser simular dependências.

### Definindo o controlador
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

1. O getter `inject` retorna uma matriz de namespaces a serem injetados no construtor. Eles são passados ​​na ordem em que são definidos.
2. A classe `constructor` receberá as injeções como parâmetros.

### Escrevendo teste

> NOTA: O exemplo de teste abaixo foi escrito para lhe dar uma ideia de como simular dependências e pode não ser a melhor maneira de escrever testes.

```js
const UsersController = use('App/Http/Controllers/User')

class FakeUser {
  static * all () {
    return {} // dummy users
  }
}

const user = new UsersController(FakeUser)
```
