# Mocking e Fakes

O AdonisJS vem com implementações falsas para a maioria de seus pacotes primários. Você pode usar fakes para ter uma melhor experiência de teste sem simular manualmente partes da sua base de código.

## Mail
Você pode falsificar os e-mails de saída chamando o método `Mail.fake`. Depois de chamar esse método, todas as outras partes do seu aplicativo que interagem com o objeto `Mail` não enviarão e-mails reais. Em vez disso, eles serão coletados na memória para asserções.

```ts
import { test } from '@japa/runner'
// highlight-start
import Mail from '@ioc:Adonis/Addons/Mail'
// highlight-end

test('register user', async ({ assert, client }) => {
  // highlight-start
  const mailer = Mail.fake()
  // highlight-end

  await client
    .post('register')
    .form({
      email: 'virk@adonisjs.com',
      password: 'secret'
    })

  // highlight-start
  // Time for assertions
  assert.isTrue(mailer.exists((mail) => {
    return mail.subject === 'Welcome to AdonisJS'
  }))

  Mail.restore()
  // highlight-end
})
```

### `Mail.fake`

Chamar `Mail.fake` cria um fake apenas para o mailer padrão. No entanto, você pode passar explicitamente o(s) nome(s) dos mailers para o fake.

```ts
// Fake the default mailer
Mail.fake()

// Fake smtp and s3 mailers
Mail.fake(['smtp', 's3'])
```

### `Mail.restore`
Depois de terminar o teste, você pode restaurar os fakes para mailers selecionados ou todos.

```ts
// Restore the default mailer
Mail.restore()

// Restore smtp and s3 mailers
Mail.restore(['smtp', 's3'])

// Restore all faked mailers
Mail.restoreAll()
```

### Encontrando mensagens
Você pode verificar as mensagens enviadas usando os métodos `exists`, `find` ou `filter`. Todos os métodos aceitam um subconjunto de propriedades de mensagem ou um retorno de chamada.

```ts
assert.isTrue(mailer.exists({ subject: 'Welcome to AdonisJS' }))

assert.isTrue(mailer.exists((mail) => {
  return mail.subject === 'Welcome to AdonisJS'
}))

const message = mailer.find((mail) => {
  return mail.to[0].address === 'virk@adonisjs.com'
})

console.log(message)
```

## Eventos
Você pode falsificar eventos chamando o método `Event.fake`. O método aceita uma matriz opcional de eventos para falsificar. Caso contrário, todos os próximos eventos serão falsificados.

```ts
import Event from '@ioc:Adonis/Core/Event'

// Fake all events
Event.fake()

// Fake specific events
Event.fake(['new:user', 'update:email'])
```

### `Event.restore`
Você pode restaurar eventos usando o método `Event.restore`.

```ts
Event.restore()
```

### Encontrando eventos

O método `Event.fake` retorna um emissor falso que você pode usar para buscar ou encontrar eventos posteriormente.

```ts
const emitter = Event.fake()

assert.isTrue(emitter.exists('new:user'))
assert.isTrue(emitter.exists((event) => {
  return event.name === 'new:user' && event.data.id === 1
}))
```

Você pode usar os métodos `find` e `filter` para encontrar eventos específicos.

```ts
const emitter = Event.fake()

emitter.find('new:user')
// returns { name: 'new:user', data: any }

emitter.filter((event) => event.name.startsWith('invite:'))
// returns { name: 'new:user', data: any }
```

## Drive
Você pode falsificar a implementação do Drive chamando o método `Drive.fake`. Por padrão, apenas o disco padrão é falsificado. No entanto, você também pode definir nomes de disco explicitamente.

```ts
import Drive from '@ioc:Adonis/Core/Drive'

// Fake default disk
Drive.fake()

// Fake local and s3
Drive.fake(['s3', 'local'])
```

### `Drive.restore`
Você pode restaurar falsificações chamando o método `Drive.restore`. Opcionalmente, você pode passar os nomes dos discos para restaurar, caso contrário, o disco padrão será restaurado. Ou use o método `Drive.restoreAll` para restaurar todo o disco.

```ts
// Restore default disk
Drive.restore()

// Restore specific disks
Drive.restore(['s3', 'local'])

// Restore all the disks
Drive.restoreAll()
```

### Encontrando arquivos

O método `Drive.fake` retorna o objeto de unidade falsa que você pode usar para buscar ou encontrar arquivos posteriormente.

```ts
const drive = Drive.fake()

// Find if file exists
assert.isTrue(await drive.exists('avatar.jpg'))

// Assert for the file size
assert.isBelow(await drive.bytes('avatar.jpg'), 1000 * 1000 * 20)

// Assert for file contents
assert.equal(await drive.get('package.json'), JSON.stringify({}))
```

## Hashing
Você pode falsificar o módulo Hash chamando o método `Hash.fake`. Nenhum hash de senha é executado durante a falsificação, e o método `hash.make` retorna o mesmo valor.

```ts
import Hash from '@ioc:Adonis/Core/Hash'

// Fake hash implementation
Hash.fake()

const hashed = await Hash.make('secret') // returns "secret"
await Hash.verify(hashed, 'secret') // returns "true"

// Restore fake
Hash.restore()
```

## Objetos de simulação
O AdonisJS não é fornecido com nenhuma biblioteca de simulação pronta para uso. Você pode usar qualquer biblioteca de simulação do ecossistema Node.

A seguir, um pequeno exemplo demonstrando o uso do [SinonJS](https://sinonjs.org/) para simular classes ES6.

```ts
export default class ExchangeService {
  constructor (private baseCurrency: string) {}

  public getRate(currency: string, amount: number) {
  }
}
```

Durante os testes, você pode importar o `ExchangeService` e simular o método `getRate` da seguinte forma.

```ts
import { test } from '@japa/runner'

// highlight-start
import sinon from 'sinon'
import ExchangeService from 'App/Services/ExchangeService'
// highlight-end

test('transfer payment', async ({ client }) => {
  // highlight-start
  const mock = sinon.mock(ExchangeService.prototype)
  mock
    .expects('getRate')
    .once()
    .withArgs('INR', 600)
    .returns(6)
  // highlight-end

  await client
    .post('/transfer')
    .form({ currency: 'INR', amount: 600 })

 // highlight-start
  mock.verify()
  mock.restore()
  // highlight-end
})
```

## Solicitações de rede simuladas
Você pode usar [nock](https://github.com/nock/nock) para simular as solicitações de rede de saída. Como o nock funciona substituindo o `http.request` do Node.js, ele funciona com quase todos os clientes HTTP, incluindo `axios` e `got`.

A seguir, um exemplo para simular a API `charges` do Stripe.

```ts
// title: test_helpers/mocks.ts
import nock from 'nock'

export function mockStripeCharge() {
  return nock('https://api.stripe.com/v1')
    .post('/charges')
    .reply(201, (_, requestBody) => {
      return {
        id: 'ch_3KjEE62eZvKYlo2C0n3A7N3E',
        object: 'charge',
        amount: requestBody.amount,
      }
    })
}
```

Agora, você pode usar o auxiliar `mockStripeCharge` da seguinte forma.

```ts
import { mockStripeCharge } from 'TestHelpers/mocks'

test('complete purchase with stripe charge', async () => {
  mockStripeCharge()
  // Make a call to stripe API here
})
```
