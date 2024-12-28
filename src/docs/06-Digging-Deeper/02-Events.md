---
title: Events
category: digging-deeper
---

# Eventos

O AdonisJs vem com um *Event Provider* dedicado.

Internamente, ele usa o pacote [EventEmitter2](https://github.com/asyncly/EventEmitter2), com outras funcionalidades convenientes adicionadas a ele.

O *Event Provider* tem uma implementação [fake](/original/markdown/10-testing/05-Fakes.md), que pode ser usada para asserções ao escrever testes.

## Visão geral dos eventos

1. Os ouvintes de eventos são definidos dentro do arquivo `start/events.js`.
2. Os ouvintes de eventos podem ser definidos como *closures*, ou você pode vincular um *namespace* do contêiner IoC:
```js
  Event.on('new::user', async (user) => {
  })

  // OR
  Event.on('new::user', 'User.registered')
  ```

3. Os ouvintes de eventos com namespace são armazenados dentro do diretório `app/Listeners`.
4. Ao vincular ouvintes a eventos, você não precisa inserir o namespace inteiro. Por exemplo, um ouvinte armazenado como `app/Listeners/User.js` é referenciado como `User.<method>`.
5. O comando `make:listener` pode ser usado para criar novos ouvintes de eventos:
```bash
  adonis make:listener User
  ```

```bash
  # .Output

  ✔ create  app/Listeners/User.js
  ```

## Exemplo básico
Digamos que queremos emitir um evento toda vez que um usuário se registra em nosso site e, dentro de um *ouvinte de eventos*, enviar um e-mail para o usuário registrado.

Primeiro, precisamos criar a rota e o controlador relevantes:

```js
// .start/routes.js

Route.post('register', 'UserController.register')
```

```js
// .app/Controllers/Http/UserController.js

const Event = use('Event')

class UserController {
  register () {
    // register the user

    Event.fire('new::user', user)
  }
}
```

Em seguida, precisamos de um ouvinte para o evento `new::user` para que possamos enviar o e-mail.

Para fazer isso, crie um arquivo `events.js` dentro do diretório `start`:

```bash
# Mac / Linux
> touch start/events.js

# Windows
> type NUL > start/events.js
```

Finalmente, escreva nosso código de manipulação de eventos dentro do arquivo `start/events.js`:

```js
const Event = use('Event')
const Mail = use('Mail')

Event.on('new::user', async (user) => {
  await Mail.send('new.user', user, (message) => {
    message.to(user.email)
    message.from('from@email')
  })
})
```

Como você pode ver, o AdonisJs facilita o uso da palavra-chave `await` dentro do retorno de chamada do ouvinte de eventos.

## API
Abaixo está a lista de métodos que podem ser usados ​​para interagir com o *Provedor de Eventos*.

#### `on(event, listener)`
Vincule um ou vários ouvintes para um determinado evento. O `listener` pode ser uma função de fechamento ou referência a uma (ou muitas) ligações de contêiner IoC:

```js
Event.on('new::user', async () => { 

})

// IoC container binding
Event.on('new::user', 'User.registered')

// Array of listeners
Event.on('new::user', ['Mailer.sendEmail', 'SalesForce.trackLead'])
```

#### `when(event, listener)`
O método `when` é um alias do método [on](#onceevent-listener).

#### `once(event, listener)`
O mesmo que [on](#onevent-listener), mas chamado apenas uma vez:

```js
Event.once('new::user', () => {
  console.log('executed once')
})
```

#### `onAny(listener)`
Vincular listener para qualquer evento:

```js
Event.onAny(function () {

})

// Ioc container binding
Event.onAny('EventsLogger.track')
```

#### `times(number)`
O método `times` é encadeado com `on` ou `when` para limitar o número de vezes que o listener deve ser disparado:

```js
Event
  .times(3)
  .on('new::user', () => {
    console.log('fired 3 times')
  })
```

#### `emit(event, data)`
Emitir um evento com dados opcionais:

```js
Event.emit('new::user', user)
```

#### `fire(event, data)`
O método `fire` é um alias do método [emit](#emitevent-data).

#### `removeListener(event, listener)`
Remove listener(s) para um evento dado:

```js
Event.on('new::user', 'User.registered')

// later remove it
Event.removeListener('new::user', 'User.registered')
```

> NOTA: Você deve vincular uma referência de contêiner IoC para removê-lo mais tarde.

#### `off(event, listener)`
O método `off` alias o método [removeListener](#removelistenerevent-listener).

#### `removeAllListeners(event)`
Remove todos os ouvintes para um evento dado:

```js
Event.removeAllListeners()
```

#### `listenersCount(event)`
Retorna o número de ouvintes para um evento dado:

```js
Event.listenersCount('new::user')
```

#### `getListeners(event)`
Retorna uma matriz de ouvintes para um evento dado:

```js
Event.getListeners('new::user')
```

#### `hasListeners(event)`
Retorna um `booleano` indicando se há algum ouvinte para um evento dado:

```js
Event.hasListeners('new::user')
```
