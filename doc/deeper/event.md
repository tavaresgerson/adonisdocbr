# Eventos

O AdonisJs é construído com um provedor de eventos dedicado.

Internamente, ele usa o pacote [EventEmitter2](https://github.com/asyncly/EventEmitter2), com outras funcionalidades convenientes 
adicionadas a ele.

O Provedor de Eventos possui uma implementação [fake](https://adonisjs.com/docs/4.1/testing-fakes#_events_fake), que pode ser usada para asserções ao escrever testes.

## Visão Geral dos Eventos

+ Ouvintes de eventos são definidos dentro do arquivo `start/events.js`.
+ Os ouvintes de eventos podem ser definidos como **encerramentos** ou, em vez disso , você pode vincular um **namespace** de contêiner IoC:

``` js
Event.on('new::user', async (user) => {
})

// OU
Event.on('new::user', 'User.registered')
```

+ Ouvintes de eventos com espaço para nome são armazenados dentro do `app/Listenersdiretório`.
+ Ao vincular ouvintes a eventos, não é necessário inserir o espaço para nome inteiro. Por exemplo, um ouvinte armazenado como `app/Listeners/User.js` é mencionado como `User.<method>`.

+ O comando `make:listener` pode ser usado para criar novos ouvintes de eventos:

``` 
> adonis make:listener User
```
```
✔ create  app/Listeners/User.js
```

## Exemplo básico
Digamos que queremos emitir um evento toda vez que um usuário se registra em nosso site e, dentro de um ouvinte de 
evento, envia um email para o usuário registrado.

Primeiro, precisamos criar a rota e o controlador relevantes em `start/routes.js`:

``` js
Route.post('register', 'UserController.register')
```
``` js
const Event = use('Event')

class UserController {
  register () {
    // registra o usuário

    Event.fire('new::user', user)
  }
}
```

Em seguida, precisamos de um ouvinte para o evento `new::user` para que possamos enviar o email.

Para fazer isso, crie um arquivo `events.js` dentro do diretório `start`:

``` js
# Mac / Linux
> touch start/events.js

# Windows
> type NUL > start/events.js
```

Por fim, escreva nosso código de manipulação de eventos dentro do arquivo `start/events.js`:

``` js
const Event = use('Event')
const Mail = use('Mail')

Event.on('new::user', async (user) => {
  await Mail.send('new.user', user, (message) => {
    message.to(user.email)
    message.from('from@email')
  })
})
```

Como você pode ver, o AdonisJs facilita o uso da palavra-chave `await` dentro do retorno de chamada do ouvinte de evento.

## API
Abaixo está a lista de métodos que podem ser usados para interagir com o provedor de eventos .

### on (evento, ouvinte)
Ligue um ou vários ouvintes a um determinado evento. A `listener` pode ser uma função de fecho ou de 
referência para um (ou vários) ligações recipiente IoC:

``` js
Event.on('new::user', async () => {

})

// ligação IoC container
Event.on('new::user', 'User.registered')

// Array de ouvintes
Event.on('new::user', ['Mailer.sendEmail', 'SalesForce.trackLead'])
```

### when (evento, ouvinte)
O método `when` é um alias do método `on`.

### once (evento, ouvinte)
O mesmo que `on`, mas chamado apenas uma vez:

``` js
Event.once('new::user', () => {
  console.log('executed once')
})
```

### onAny (ouvinte)
Vincular um ouvinte a qualquer evento:

``` js
Event.onAny(function () {

})

// Ioc container
Event.onAny('EventsLogger.track')
```

### times (número)
O método `times` é encadeado com `on` ou `when` para limitar o número de vezes que o ouvinte deve ser acionado:

``` js
Event
  .times(3)
  .on('new::user', () => {
    console.log('fired 3 times')
  })
```

### emit (evento, dados)
Emita um evento com dados opcionais:

``` js
Event.emit('new::user', user)
```

### fire (evento, dados)
O método `fire` é um alias para o método de [emissão](https://adonisjs.com/docs/4.1/events#_emitevent_data).

### removeListener (evento, ouvinte)
Remove os ouvintes de um determinado evento:

``` js
Event.on('new::user', 'User.registered')

// depois remova
Event.removeListener('new::user', 'User.registered')
```

> Você deve vincular uma referência de contêiner de IoC para removê-la mais tarde.

### off (evento, ouvinte)
O método `off` é um alias do método `removeListener`.

### removeAllListeners (evento)
Remove todos os ouvintes para um determinado evento:

``` js
Event.removeAllListeners()
```

### listenersCount (evento)
Retorne o número de ouvintes para um determinado evento:

``` js
Event.listenersCount('new::user')
```

### getListeners (evento)
Retorne uma matriz de ouvintes para um determinado evento:

``` js
Event.getListeners('new::user')
```

### hasListeners (evento)
Retorna um `boolean` indicando se há ouvintes para um determinado evento:

``` js
Event.hasListeners('new::user')
```
