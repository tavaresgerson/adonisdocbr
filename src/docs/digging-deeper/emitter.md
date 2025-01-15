---
summary: Emissor de eventos embutido criado em cima do emittery. Despacha eventos de forma assíncrona e corrige muitos problemas comuns com o emissor de eventos padrão do Node.js.
---

# Emissor de eventos

O AdonisJS tem um emissor de eventos embutido criado em cima do [emittery](https://github.com/sindresorhus/emittery). O Emittery despacha eventos de forma assíncrona e [corrige muitos problemas comuns](https://github.com/sindresorhus/emittery#how-is-this-different-than-the-built-in-eventemitter-in-nodejs) com o emissor de eventos padrão do Node.js.

O AdonisJS aprimora ainda mais o emittery com recursos adicionais.

- Fornece segurança de tipo estático definindo uma lista de eventos e seus tipos de dados associados.
- Suporte para eventos e ouvintes baseados em classe. Mover ouvintes para arquivos dedicados mantém sua base de código organizada e fácil de testar.
- Capacidade de falsificar eventos durante os testes.

## Uso básico

Os ouvintes de eventos são definidos dentro do arquivo `start/events.ts`. Você pode criar esse arquivo usando o comando ace `make:preload`.

```sh
node ace make:preload events
```

Você deve usar `emitter.on` para ouvir um evento. O método aceita o nome do evento como o primeiro argumento e o ouvinte como o segundo argumento.

```ts
// start/events.ts

import emitter from '@adonisjs/core/services/emitter'

emitter.on('user:registered', function (user) {
  console.log(user)
})
```

Depois de definir o ouvinte de eventos, você pode emitir o evento `user:registered` usando o método `emitter.emit`. Ele pega o nome do evento como o primeiro argumento e os dados do evento como o segundo argumento.

```ts
import emitter from '@adonisjs/core/services/emitter'

export default class UsersController {
  async store() {
    const user = await User.create(data)
    emitter.emit('user:registered', user)
  }
}
```

Você pode usar `emitter.once` para ouvir um evento uma vez.

```ts
emitter.once('user:registered', function (user) {
  console.log(user)
})
```

## Tornando os eventos seguros para o tipo

O AdonisJS torna obrigatório definir tipos estáticos para cada evento que você deseja emitir em seu aplicativo. Os tipos são registrados no arquivo `types/events.ts`.

No exemplo a seguir, registramos o modelo `User` como o tipo de dados para o evento `user:registered`.

::: info NOTA
Se você achar que definir tipos para cada evento é trabalhoso, pode alternar para [eventos baseados em classe](#class-based-events).
:::

```ts
import User from '#models/User'

declare module '@adonisjs/core/types' {
  interface EventsList {
    'user:registered': User
  }
}
```

## Ouvintes baseados em classe

Assim como os controladores HTTP, as classes ouvintes oferecem uma camada de abstração para mover ouvintes de eventos em linha dentro de arquivos dedicados. As classes ouvintes são armazenadas dentro do diretório `app/listeners` e você pode criar um novo ouvinte usando o comando `make:listener`.

Veja também: [Comando Make listener](../references/commands.md#makelistener)

```sh
node ace make:listener sendVerificationEmail
```

O arquivo listener é estruturado com a declaração `class` e o método `handle`. Nesta classe, você pode definir métodos adicionais para escutar vários eventos (se necessário).

```ts
import User from '#models/user'

export default class SendVerificationEmail {
  handle(user: User) {
    // Enviar e-mail
  }
}
```

Como etapa final, você deve vincular a classe listener a um evento dentro do arquivo `start/events.ts`. Você pode importar o listener usando o alias `#listeners`. Os aliases são definidos usando o [recurso de importações de subcaminho do Node.js](../getting_started/folder_structure.md#the-sub-path-imports).

```ts 
// start/events.ts

import emitter from '@adonisjs/core/services/emitter'
import SendVerificationEmail from '#listeners/send_verification_email'

emitter.on('user:registered', [SendVerificationEmail, 'handle'])
```

### Ouvintes de carregamento lento

É recomendado carregar lentamente os ouvintes para acelerar a fase de inicialização do aplicativo. O carregamento lento é tão simples quanto mover a instrução de importação para trás de uma função e usar importações dinâmicas.

```ts
import emitter from '@adonisjs/core/services/emitter'
import SendVerificationEmail from '#listeners/send_verification_email' // [!code --]
const SendVerificationEmail = () => import('#listeners/send_verification_email') // [!code ++]

emitter.on('user:registered', [SendVerificationEmail, 'handle'])
```

### Injeção de dependência

::: warning ATENÇÃO
Você não pode injetar o `HttpContext` dentro de uma classe ouvinte. Como os eventos são processados ​​de forma assíncrona, o ouvinte pode ser executado após a conclusão da solicitação HTTP.
:::

As classes ouvintes são instanciadas usando o [contêiner IoC](../concepts/dependency_injection.md); portanto, você pode dar dicas de tipo nas dependências dentro do construtor da classe ou do método que manipula o evento.

No exemplo a seguir, damos dicas de tipo no `TokensService` como um argumento do construtor. Ao invocar este ouvinte, o contêiner IoC injetará uma instância da classe `TokensService`.

```ts
// Injeção de construtor

import { inject } from '@adonisjs/core'
import TokensService from '#services/tokens_service'

@inject()
export default class SendVerificationEmail {
  constructor(protected tokensService: TokensService) {}

  handle(user: User) {
    const token = this.tokensService.generate(user.email)
  }
}
```

No exemplo a seguir, injetamos o `TokensService` dentro do método handle. No entanto, lembre-se, o primeiro argumento sempre será a carga útil do evento.

```ts
// Método de injeção

import { inject } from '@adonisjs/core'
import TokensService from '#services/tokens_service'
import UserRegistered from '#events/user_registered'

export default class SendVerificationEmail {
  @inject()
  handle(event: UserRegistered, tokensService: TokensService) {
    const token = tokensService.generate(event.user.email)
  }
}
```

## Eventos baseados em classe

Um evento é uma combinação do identificador do evento (geralmente um nome de evento baseado em string) e os dados associados. Por exemplo:

- `user:registered` é o identificador do evento (também conhecido como nome do evento).
- Uma instância do modelo User são os dados do evento.

Eventos baseados em classe encapsulam o identificador do evento e os dados do evento dentro da mesma classe. O construtor da classe serve como o identificador, e uma instância da classe contém os dados do evento.

Você pode criar uma classe de evento usando o comando `make:event`.

Veja também: [Comando Make event](../references/commands.md#makeevent)

```sh
node ace make:event UserRegistered
```

A classe event não tem comportamento. Em vez disso, é um contêiner de dados para o evento. Você pode aceitar dados de evento por meio do construtor de classe e disponibilizá-los como uma propriedade de instância.
 
```ts
// app/events/user_registered.ts

import { BaseEvent } from '@adonisjs/core/events'
import User from '#models/user'

export default class UserRegistered extends BaseEvent {
  constructor(public user: User) {
    super()
  } 
}
```

### Ouvindo eventos baseados em classe

Você pode anexar ouvintes para eventos baseados em classe usando o método `emitter.on`. O primeiro argumento é a referência de classe do evento, seguido pelo ouvinte.

```ts
import emitter from '@adonisjs/core/services/emitter'
import UserRegistered from '#events/user_registered'

emitter.on(UserRegistered, function (event) {
  console.log(event.user)
})
```

No exemplo a seguir, usamos eventos baseados em classe e ouvintes.

```ts
import emitter from '@adonisjs/core/services/emitter'

import UserRegistered from '#events/user_registered'
const SendVerificationEmail = () => import('#listeners/send_verification_email')

emitter.on(UserRegistered, [SendVerificationEmail])
```

### Emitindo eventos baseados em classe

Você pode emitir um evento baseado em classe usando o método `static dispatch`. O método `dispatch` aceita argumentos aceitos pelo construtor de classe de evento.

```ts
import User from '#models/user'
import UserRegistered from '#events/user_registered'

export default class UsersController {
  async store() {
    const user = await User.create(data)
    
    /**
     * Despachar/emitir o evento
     */
    UserRegistered.dispatch(user)
  }
}
```

## Simplificando a experiência de ouvir eventos

Se você decidir usar eventos e ouvintes baseados em classe, poderá usar o método `emitter.listen` para simplificar o processo de vinculação de ouvintes.

O método `emitter.listen` aceita a classe de evento como o primeiro argumento e uma matriz de ouvintes baseados em classe como o segundo argumento. Além disso, o ouvinte registrado deve ter um método `handle` para manipular o evento.

```ts
import emitter from '@adonisjs/core/services/emitter'
import UserRegistered from '#events/user_registered'

emitter.listen(UserRegistered, [
  () => import('#listeners/send_verification_email'),
  () => import('#listeners/register_with_payment_provider'),
  () => import('#listeners/provision_account')
])
```

## Manipulando erros
Por padrão, as exceções geradas pelos ouvintes resultarão em [unhandledRejection](https://nodejs.org/api/process.html#event-unhandledrejection). Portanto, é recomendável autocapturar e manipular o erro usando o método `emitter.onError`.

O método `emitter.onError` aceita um retorno de chamada que recebe o nome do evento, o erro e os dados do evento.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.onError((event, error, eventData) => {
})
```

## Ouvindo todos os eventos

Você pode ouvir todos os eventos usando o método `emitter.onAny`. O método aceita o retorno de chamada do ouvinte como o único parâmetro.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.onAny((name, event) => {
  console.log(name)
  console.log(event)
})
```

## Cancelando inscrição de eventos

O método `emitter.on` retorna uma função de cancelamento de inscrição que você pode chamar para remover a inscrição do ouvinte de evento.

```ts
import emitter from '@adonisjs/core/services/emitter'

const unsubscribe = emitter.on('user:registered', () => {})

// Remover o ouvinte
unsubscribe()
```

Você também pode usar o método `emitter.off` para remover a inscrição do ouvinte de evento. O método aceita o nome/classe do evento como o primeiro argumento e uma referência ao ouvinte como o segundo argumento.

```ts
import emitter from '@adonisjs/core/services/emitter'

function sendEmail () {}

// Ouvir o evento
emitter.on('user:registered', sendEmail)

// Remover o ouvinte
emitter.off('user:registered', sendEmail)
```

### `emitter.offAny`

O `emitter.offAny` remove um ouvinte curinga, ouvindo todos os eventos.

```ts
emitter.offAny(callback)
```

### `emitter.clearListeners`

O método `emitter.clearListeners` remove todos os ouvintes de um determinado evento.

```ts
// Evento baseado em string
emitter.clearListeners('user:registered')

// Evento baseado em classe
emitter.clearListeners(UserRegistered)
```

### `emitter.clearAllListeners`

O método `emitter.clearAllListeners` remove todos os ouvintes de todos os eventos.

```ts
emitter.clearAllListeners()
```

## Lista de eventos disponíveis
Consulte o [guia de referência de eventos](../references/events.md) para visualizar a lista de eventos disponíveis.

## Falsificando eventos durante os testes

Os ouvintes de eventos são frequentemente usados ​​para executar efeitos colaterais após uma determinada ação. Por exemplo: envie um e-mail para um usuário recém-registrado ou envie uma notificação após uma atualização de status do pedido.

Ao escrever testes, você pode querer evitar enviar e-mails para o usuário criado durante o teste.

Você pode desabilitar os ouvintes de eventos falsificando o emissor do evento. No exemplo a seguir, chamamos `emitter.fake` antes de fazer uma solicitação HTTP para inscrever um usuário. Após a solicitação, usamos o método `events.assertEmitted` para garantir que o `SignupController` emita um evento específico.

```ts {6-9,19-20}
import emitter from '@adonisjs/core/services/emitter'
import UserRegistered from '#events/user_registered'

test.group('User signup', () => {
  test('create a user account', async ({ client, cleanup }) => {
    const events = emitter.fake()
    cleanup(() => {
      emitter.restore()
    })
  
    await client
      .post('signup')
      .form({
        email: 'foo@bar.com',
        password: 'secret',
      })
  })
  
  // Afirmar que o evento foi emitido
  events.assertEmitted(UserRegistered)
})
```

[EventBuffer](https://github.com/adonisjs/events/blob/main/src/events_buffer.ts) classe, e você pode usá-lo para asserções e encontrar eventos emitidos.
- O método `emitter.restore` restaura o fake. Após restaurar o fake, os eventos serão emitidos normalmente.

### Falsificando eventos específicos

O método `emitter.fake` falsifica todos os eventos se você invocar o método sem nenhum argumento. Se você quiser falsificar um evento específico, passe o nome do evento ou a classe como o primeiro argumento.

```ts
// Falsifica apenas o evento user:registered
emitter.fake('user:registered')

// Falsifica vários eventos
emitter.fake([UserRegistered, OrderUpdated])
```

Chamar o método `emitter.fake` várias vezes removerá os fakes antigos.

### Eventos asserções
Você pode usar os métodos `assertEmitted`, `assertNotEmitted`, `assertNoneEmitted` e `assertEmittedCount` para escrever asserções para eventos falsificados.

Os métodos `assertEmitted` e `assertNotEmitted` aceitam o nome do evento ou o construtor da classe como o primeiro argumento e uma função finder opcional que deve retornar um booleano para marcar o evento como emitido.

```ts
const events = emitter.fake()

events.assertEmitted('user:registered')
events.assertNotEmitted(OrderUpdated)
```

```ts
// Com um retorno de chamada

events.assertEmitted(OrderUpdated, ({ data }) => {
  /**
   * Considere o evento como emitido somente se
   * o orderId corresponder
   */
  return data.order.id === orderId
})
```

```ts
// Afirmar a contagem de eventos

// Afirmar a contagem de um evento específico
events.assertEmittedCount(OrderUpdated, 1)

// Afirmar que nenhum evento foi emitido
events.assertNoneEmitted()
```
