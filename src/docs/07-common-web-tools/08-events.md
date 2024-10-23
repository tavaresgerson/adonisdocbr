# Eventos

AdonisJs tem um [Event Emitter](https://nodejs.org/docs/latest-v6.x/api/events.html) lindo para emitir e escutar eventos com suporte para *geradores ES2015*, *wildcards* e um *diretório dedicado* para armazenar/gerenciar os ouvintes.

## Sobre Eventos

1. Os eventos são definidos dentro do arquivo `bootstrap/events.js`.
2. Os ouvintes de eventos podem ser definidos como *Encapsulamentos* ou você pode vincular um contêiner de injeção de dependência namespace.

```js
Event.on('user.registered', function * (user) {
})

// OR
Event.on('user.registered', 'User.registered')
```

1. O diretório 'app/Listeners' é dedicado para armazenar ouvintes de eventos.
2. When binding listeners to the events, you are not required to enter the entire namespace. For example A listener stored as `app/Listeners/User.js` will be referenced as `User.<method>`.
3. Faça uso do comando `make:listener` para criar um novo ouvinte de eventos.

```bash
./ace make:listener User

# create: app/Listeners/User.js
```

## Configuração
A configuração para o provedor de eventos é armazenada no arquivo `config/events.js`. Sob o capô, o AdonisJs utiliza [EventEmitter 2](https://github.com/asyncly/EventEmitter2) e implementa todas as opções de configuração disponíveis.

## Exemplo básico
Vamos passar por um exemplo básico de envio de um e-mail de boas-vindas para um usuário recém-registrado usando o provedor *Events*. Vamos começar configurando uma rota e usaremos o controlador *UsersController* para disparar o evento após a criação de um novo usuário.

```js
// app/Http/routes.js

'use strict'

const Route = use('Route')
Route.post('users', 'UsersController.store')
```

```js
// bootstrap/events.js

'use strict'

const Event = use('Event')
Event.when('user.registered', 'User.sendWelcomeEmail') <1>
```

```js
// app/Http/Controllers/UsersController.js

'use strict'

const Event = use('Event')
const User = use('App/Model/User')

class UsersController {
  * store (request, response) {
    const user = yield User.create(userDetails)
    Event.fire('user.registered', user.toJSON()) <2>
  }
}
```

```js
// app/Listeners/User.js

'use strict'

const Mail = use('Mail')
const User = exports = module.exports = {}

User.sendWelcomeEmail = function * (user) {
  yield Mail.send('emails.welcome', user, message => {
    message.to(user.email, user.firstname)
    message.from('awesome@adonisjs.com')
    message.subject('Welcome to the Kitten\'s World')
  })
}
```

1. Primeiro precisamos registrar um ouvinte para o evento.
2. O método `UsersController.store` irá disparar o evento *user.registered* e passar o usuário recém-criado.

## Métodos de Evento
Abaixo está a lista dos métodos disponíveis expostos pelo provedor de eventos.

#### when(evento, [nome], ouvinte)
Registre um ouvinte para um evento específico. Você também pode definir um nome opcional para um ouvinte, que pode ser usado para removê-lo mais tarde.

```js
Event.when('user.registered', 'Mail.sendWelcomeEmail')
```

```js
Event.when('user.registered', function * () {
  // ...
})
```

```js
Event.when('user.registered', 'registration', 'User.sendWelcomeEmail')
```

## Aliases

| Alias | Exemplo |
|-------|---------|
| ouça | Evento. escutar ('usuário registrado', função * () {}) |
| em | Evento.on('usuário.registrado', função * () {}) |

#### Uma vez (evento, manipulador)
Funciona da mesma forma que `quando`, mas é executado apenas uma vez.

```js
Event.once('app.boot', function * () {
  // ...
})
```

#### qualquer(manipulador)
Anexar um ouvinte de eventos global para escutar todos os eventos.

```js
Event.any(function (event) {
  console.log(event)
})
```

#### times(número)
Defina um limite para o número de vezes que um ouvinte de eventos será executado e removido depois disso.

```js
Event.times(4).when('user.registered', function () {
  // I will be executed 4 times only
})
```

#### fire(event, data)
Dispara um evento.

```js
Event.fire('user.registered', user)
```

##### Aliados

| Alias | Exemplo |
|-------|---------|
| emitir | Evento.emit('usuário.registrado', usuário)` |


#### removeListeners([event])
Remova todos os ouvintes de um evento ou para todos os eventos.

```js
Event.removeListeners() // will remove all listeners
Event.removeListeners('user.registered') // will remove listeners for user.registered event only
```

#### removeListener(event, name)
Remover um ouvinte nomeado para um determinado evento.

```js
// register multiple
Event.when('user.registered', 'Logger.log')
Event.when('user.registered', 'registration', 'Mail.sendWelcomeEmail')

// remove a specific one
Event.removeListener('user.registered', 'registration')
```

#### hasListeners(evento)
Retorna um valor booleano se um evento tem ou não ouvintes.

```js
Event.hasListeners('user.registered')
```

#### getListeners(event)
Retorna um array de ouvintes para um evento específico.

```js
Event.getListeners('user.registered')
```

## Emissor Instância
Todos os ouvintes de eventos têm acesso à instância do emissor.

```js
Event.when('user.registered', function () {
  console.log(this.emitter)
})
```
