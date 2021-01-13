# Fakes

Freqüentemente, você desejará trocar a implementação original de certas partes de seu aplicativo por uma implementação falsa ao escrever testes.

Como o AdonisJs aproveita um contêiner IoC para gerenciar dependências, é incrivelmente fácil criar implementações falsas ao escrever testes.

## Falsificações de auto-implementação
Vamos começar com um exemplo básico de falsificação de um serviço que normalmente envia e-mails.

> A criação de muitos testes falsos pode levar a testes falsos, em que tudo o que você está testando 
> é a sintaxe e não a implementação. Como regra, tente manter as falsificações como a última opção ao escrever seus testes.

```js
// app/Services/UserRegistration.js

class UserRegistration {

  async sendVerificationEmail (user) {
    await Mail.send('emails.verify', user, (message) => {
      message.to(user.email)
      message.subject('Verify account')
    })
  }
}
```

Sem implementar um fake, cada vez que testamos a lógica de registro do usuário do nosso aplicativo, um e-mail de verificação
seria enviado para o endereço de e-mail informado!

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

  // código para testar o registro do usuário
  // ....

  ioc.restore('App/Services/UserRegistration')
})
```

O método `ioc.fake` permite vincular um valor falso ao contêiner IoC e, quando qualquer parte do aplicativo tenta resolver o 
namespace vinculado, o valor falso é retornado em vez do valor real.

Depois de terminar com uma falsificação, `ioc.restore` pode ser chamado para retirá-la.

Essa abordagem funciona muito bem para a maioria dos casos de uso, até que você possa criar um fake que seja semelhante à 
implementação real. Para maior controle, você pode usar bibliotecas externas como [Sinon.JS](http://sinonjs.org/).

## Mail Fake

O Provedor de Email do AdonisJs vem com um método `fake` integrado:
```js
const Mail = use('Mail')
const { test } = use('Test/Suite')('User registration')

test('register user', async ({ assert }) => {
  Mail.fake()

  // escreva seu teste

  const recentEmail = Mail.pullRecent()
  assert.equal(recentEmail.message.to[0].address, 'joe@example.com')
  assert.equal(recentEmail.message.to[0].name, 'Joe')

  Mail.restore()
})
```

A chamada `Mail.fake` liga um mailer falso ao contêiner IoC. Uma vez falsificados, todos os e-mails são armazenados na memória 
como uma série de objetos que podem ser posteriormente executados em asserções.

Os seguintes métodos estão disponíveis no mailer fake.

#### recent()
Retorna o objeto de e-mail mais recente:
```js
Mail.recent()
```

#### pullRecent()
Retorna o objeto de e-mail recente e o remove da matriz na memória:
```js
Mail.pullRecent()
```

#### all()
Retorna todos os e-mails:
```js
const mails = Mail.all()
assert.lengthof(mails, 1)
```

#### clear()
Limpa a matriz de e-mails na memória:
```js
Mail.clear()
```

#### restore()
Restaure a classe do emailer original:
```js
Mail.restore()
```

## Eventos Falsos
O [Provedor de Eventos](/doc/deeper/event.md) AdonisJs também vem com um método `fake` integrado:
```js
const Event = use('Event')
const { test } = use('Test/Suite')('User registration')

test('register user', async ({ assert }) => {
  Event.fake()

  // escreva seu teste
  ....

  const recentEvent = Event.pullRecent()
  assert.equal(recentEvent.event, 'register:user')

  Event.restore()
})
```

A chamada `Event.fake` liga um emissor de evento falso ao contêiner IoC. Uma vez falsificados, todos os 
eventos emitidos são armazenados na memória como uma série de objetos que podem ser posteriormente executados em asserções.

Você também pode criar um evento `trap` embutido e executar asserções dentro do retorno de chamada passado:

```js
test('register user', async ({ assert }) => {
  assert.plan(2)
  Event.fake()

  Event.trap('register:user', function (data) {
    assert.equal(data.username, 'joe')
    assert.equal(data.email, 'joe@example.com')
  })

  // escreva seu teste
  ....

  Event.restore()
})
```

Os métodos a seguir estão disponíveis no emissor de evento falso.

#### recent()
Retorna o objeto de evento mais recente:
```js
Event.recent()
```

#### pullRecent()
Retorna o objeto de evento recente e o remove da matriz na memória:
```js
Event.pullRecent()
```

#### all()
Retorna todos os eventos:
```js
const events = Event.all()
assert.lengthof(events, 1)
```

#### clear()
Limpa a matriz de eventos na memória:
```js
Event.clear()
```

#### restore()
Restaure a classe de evento original:
```js
Event.restore()
```

## Transações de banco de dados
Manter seu banco de dados limpo para cada teste pode ser difícil.

O AdonisJs vem com uma trait `DatabaseTransactions` que envolve suas consultas de banco de dados dentro de uma transação e as reverte após cada teste:
```js
const { test, trait } = use('Test/Suite')('User registration')

trait('DatabaseTransactions')
```

Como alternativa, você pode definir um Lifecycle Hook para truncar as tabelas do banco de dados após cada teste, mas usar a trait 
`DatabaseTransactions` é muito mais simples.
