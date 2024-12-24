# Eventos

AdonisJs tem um lindo [Event Emitter](https://nodejs.org/docs/latest-v6.x/api/events.html) para emitir e ouvir eventos com suporte para *geradores ES2015*, *curingas* e um *diretório dedicado* para armazenar/gerenciar ouvintes.

## Sobre eventos

1. Os eventos são definidos dentro do arquivo `bootstrap/events.js`.
2. Os ouvintes de eventos podem ser definidos como *Closures* ou você pode vincular um namespace de contêiner IoC.
```js
    Event.on('user.registered', function * (user) {
    })

    // OR
    Event.on('user.registered', 'User.registered')
    ```

3. O diretório `app/Listeners` é dedicado para armazenar ouvintes de eventos.
4. Ao vincular ouvintes aos eventos, você não precisa inserir o namespace inteiro. Por exemplo, um ouvinte armazenado como `app/Listeners/User.js` será referenciado como `User.<method>`.
5. Use o comando `make:listener` para criar um novo ouvinte de eventos.
```bash
    ./ace make:listener User

    # create: app/Listeners/User.js
    ```

## Configuração
A configuração do provedor de eventos é armazenada dentro do arquivo `config/events.js`. Por baixo dos panos, o AdonisJs usa [EventEmitter 2](https://github.com/asyncly/EventEmitter2) e implementa todas as opções de configuração disponíveis.

## Exemplo básico
Vamos percorrer um exemplo básico de envio de um e-mail de boas-vindas a um usuário recém-registrado usando o *provedor de eventos*. Começaremos configurando uma rota e usaremos o *UsersController* para disparar o evento após criar um novo usuário.

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

1. Primeiro, precisamos registrar um ouvinte para o evento.
2. O método `UsersController.store` disparará o evento *user.registered* e passará o usuário recém-criado.

## Métodos de Evento
Abaixo está a lista de métodos disponíveis expostos pelo Provedor de Eventos.

#### when(event, [name], listener)
Registre um ouvinte para um determinado evento. Você também pode definir um nome opcional para um ouvinte, que pode ser usado para removê-lo mais tarde.

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

Aliases

| Alias   ​​| Exemplo |
|---------|---------|
| listen  | `Event.listen('user.registered', function * () {})` |
| on      | `Event.on('user.registered', function * () {})` |

#### once(event, handler)
Funciona da mesma forma que `when`, mas é executado apenas uma vez.

```js
Event.once('app.boot', function * () {
  // ...
})
```

#### any(handler)
Anexa um ouvinte de evento global para ouvir todos os eventos.

```js
Event.any(function (event) {
  console.log(event)
})
```

#### times(number)
Define um limite para as vezes que um ouvinte de evento será executado e será removido depois disso.

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

Aliases

| Alias ​​| Exemplo                                 |
|-------|-----------------------------------------|
| emit  | `Event.emit('user.registered', user)`   |

#### removeListeners([event])
Remove todos os ouvintes de um evento fornecido ou de todos os eventos.

```js
Event.removeListeners() // will remove all listeners
Event.removeListeners('user.registered') // will remove listeners for user.registered event only
```

#### removeListener(event, name)
Remove um ouvinte nomeado para um evento fornecido.

```js
// register multiple
Event.when('user.registered', 'Logger.log')
Event.when('user.registered', 'registration', 'Mail.sendWelcomeEmail')

// remove a specific one
Event.removeListener('user.registered', 'registration')
```

#### hasListeners(event)
Retorna um booleano se um evento tem ouvintes ou não.

```js
Event.hasListeners('user.registered')
```

#### getListeners(event)
Retorna uma matriz de ouvintes para um evento específico.

```js
Event.getListeners('user.registered')
```

## Instância do emissor
Todos os ouvintes de eventos têm acesso à instância do emissor.

```js
Event.when('user.registered', function () {
  console.log(this.emitter)
})
```
