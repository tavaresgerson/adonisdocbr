---
title: Fakes
category: testing
---

# Fakes

Muitas vezes, você vai querer trocar a implementação original de certas partes do seu aplicativo por uma implementação falsa ao escrever testes.

Como o AdonisJs utiliza um contêiner IoC para gerenciar dependências, é incrivelmente fácil criar implementações falsas ao escrever testes.

## Fakes de autoimplementação
Vamos começar com um exemplo básico de falsificação de um serviço que normalmente envia e-mails.

> OBSERVAÇÃO: Criar muitos testes falsos pode levar a testes falsos, onde tudo o que você está testando é a sintaxe e não a implementação. Como regra, tente manter os testes falsos como a última opção ao escrever seus testes.

```js
// .app/Services/UserRegistration.js

class UserRegistration {

  async sendVerificationEmail (user) {
    await Mail.send('emails.verify', user, (message) => {
      message.to(user.email)
      message.subject('Verify account')
    })
  }
}
```

Sem implementar um falso, cada vez que testamos a lógica de registro de usuário do nosso aplicativo, um e-mail de verificação seria enviado para o endereço de e-mail passado!

Para evitar esse comportamento, faz sentido falsificar o serviço `UserRegistration`:

```js
const { ioc } = use('@adonisjs/fold')
const { test } = use('Test/Suite')('User registration')

test('register user', async () => {
  ioc.fake('App/Services/UserRegistration', () => {
    return {
      sendVerificationEmail () {}
    }
  })

  // code to test user registration
  // ....

  ioc.restore('App/Services/UserRegistration')
})
```

O método `ioc.fake` permite que você vincule um valor falso ao contêiner IoC e, quando qualquer parte do aplicativo tenta resolver o namespace vinculado, o valor falso é retornado em vez do valor real.

Depois de terminar com um falso, `ioc.restore` pode ser chamado para removê-lo.

Essa abordagem funciona muito bem para a maioria dos casos de uso até que você possa criar um falso que seja semelhante à implementação real. Para maior controle, você pode usar bibliotecas externas como [Sinon.JS](http://sinonjs.org/).

## Mail Fake
O AdonisJs link:mail[Mail Provider] vem com um método `fake` integrado:

```js
const Mail = use('Mail')
const { test } = use('Test/Suite')('User registration')

test('register user', async ({ assert }) => {
  Mail.fake()

  // write your test

  const recentEmail = Mail.pullRecent()
  assert.equal(recentEmail.message.to[0].address, 'joe@example.com')
  assert.equal(recentEmail.message.to[0].name, 'Joe')

  Mail.restore()
})
```

Chamar `Mail.fake` vincula um mailer falso ao contêiner IoC. Uma vez falsificados, todos os e-mails são armazenados na memória como uma matriz de objetos que podem ser posteriormente executados em asserções.

Os seguintes métodos estão disponíveis no falso mailer.

#### `recent()`
Retorna o objeto de e-mail mais recente:

```js
Mail.recent()
```

#### `pullRecent()`
Retorna o objeto de e-mail recente e o remove do array na memória:

```js
Mail.pullRecent()
```

#### `all()`
Retorna todos os e-mails:

```js
const mails = Mail.all()
assert.lengthof(mails, 1)
```

#### `clear()`
Limpa o array de e-mails na memória:

```js
Mail.clear()
```

#### `restore()`
Restaura a classe do remetente de e-mail original:

```js
Mail.restore()
```

## Eventos falsos
O AdonisJs [Provedor de eventos](/original/markdown/06-Digging-Deeper/02-Events.md) também vem com um método `fake` integrado:

```js
const Event = use('Event')
const { test } = use('Test/Suite')('User registration')

test('register user', async ({ assert }) => {
  Event.fake()

  // write your test
  ....

  const recentEvent = Event.pullRecent()
  assert.equal(recentEvent.event, 'register:user')

  Event.restore()
})
```

Chamar `Event.fake` vincula um emissor de evento falso ao contêiner IoC. Uma vez falsificados, todos os eventos emitidos são armazenados na memória como uma matriz de objetos que podem ser posteriormente executados asserções.

Você também pode `capturar` um evento em linha e executar asserções dentro do retorno de chamada passado:

```js
test('register user', async ({ assert }) => {
  assert.plan(2)
  Event.fake()

  Event.trap('register:user', function (data) {
    assert.equal(data.username, 'joe')
    assert.equal(data.email, 'joe@example.com')
  })

  // write your test
  ....

  Event.restore()
})
```

Os seguintes métodos estão disponíveis no emissor de evento falso.

#### `recent()`
Retorna o objeto de evento mais recente:

```js
Event.recent()
```

#### `pullRecent()`
Retorna o objeto de evento recente e o remove do array na memória:

```js
Event.pullRecent()
```

#### `all()`
Retorna todos os eventos:

```js
const events = Event.all()
assert.lengthof(events, 1)
```

#### `clear()`
Limpa o array de eventos na memória:

```js
Event.clear()
```

#### `restore()`
Restaura a classe de evento original:

```js
Event.restore()
```

## Transações de banco de dados
Manter seu banco de dados limpo para cada teste pode ser difícil.

O AdonisJs vem com um trait `DatabaseTransactions` que envolve suas consultas de banco de dados dentro de uma transação e as reverte após cada teste:

```js
const { test, trait } = use('Test/Suite')('User registration')

trait('DatabaseTransactions')
```

Alternativamente, você pode definir um [Lifecycle Hook](/original/markdown/10-testing/01-Getting-Started.md) para truncar suas tabelas de banco de dados após cada teste, mas usar o trait `DatabaseTransactions` seria muito mais simples.
