---
resumo: Aprenda como simular ou falsificar dependências durante os testes no AdonisJS.
---

# Simulações e falsificações

Ao testar seus aplicativos, você pode querer simular ou falsificar dependências específicas para evitar que implementações reais sejam executadas. Por exemplo, você deseja evitar enviar e-mails para seus clientes ao executar testes e nem chamar serviços de terceiros, como um gateway de pagamento.

O AdonisJS oferece algumas APIs e recomendações diferentes com as quais você pode falsificar, simular ou criar um stub de uma dependência.

## Usando a API fakes

Fakes são objetos com implementações funcionais criadas explicitamente para testes. Por exemplo, o módulo mailer do AdonisJS tem uma implementação falsa que você pode usar durante os testes para coletar e-mails de saída na memória e escrever asserções para eles.

Nós fornecemos implementações falsas para os seguintes serviços de contêiner. A API fakes é documentada junto com a documentação do módulo.

[Falso emissor](../digging_deeper/emitter.md#faking-events-during-tests)
[Falso hash](../security/hashing.md#faking-hash-service-during-tests)
[Mailer falso](../digging_deeper/mail.md#fake-mailer)
[Falso drive](../digging_deeper/drive.md#faking-disks)

## Injeção de dependência e fakes

Se você usar injeção de dependência em seu aplicativo ou usar o [container para criar instâncias de classe](../concepts/dependency_injection.md), você pode fornecer uma implementação falsa para uma classe usando o método `container.swap`.

No exemplo a seguir, injetamos `UserService` no `UsersController`.

```ts
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'

export default class UsersController {
  @inject()
  index(service: UserService) {}
}
```

Durante o teste, podemos fornecer uma implementação alternativa/falsa da classe `UserService` da seguinte forma.

```ts
import UserService from '#services/user_service'
import app from '@adonisjs/core/services/app'

test('get all users', async () => {
  // highlight-start
  class FakeService extends UserService {
    all() {
      return [{ id: 1, username: 'virk' }]
    }
  }
  
  /**
   * Swap `UserService` with an instance of
   * `FakeService`
   */  
  app.container.swap(UserService, () => {
    return new FakeService()
  })
  
  /**
   * Test logic goes here
   */
  // highlight-end
})
```

Depois que o teste for concluído, você deve restaurar a falsificação usando o método `container.restore`.

```ts
app.container.restore(UserService)

// Restore UserService and PostService
app.container.restoreAll([UserService, PostService])

// Restore all
app.container.restoreAll()
```

## Mocks e stubs usando Sinon.js

[Sinon](https://sinonjs.org/#get-started) é uma biblioteca de mocking madura e testada pelo tempo no ecossistema Node.js. Se você usa mocks e stubs regularmente, recomendamos usar o Sinon, pois ele funciona muito bem com TypeScript.

## Solicitações de rede simuladas

Se seu aplicativo fizer solicitações HTTP de saída para serviços de terceiros, você pode usar [nock](https://github.com/nock/nock) durante o teste para simular as solicitações de rede.

Como o nock intercepta todas as solicitações de saída do [módulo HTTP do Node.js](https://nodejs.org/dist/latest-v20.x/docs/api/http.html#class-httpclientrequest), ele funciona com quase todas as bibliotecas de terceiros, como `got`, `axios` e assim por diante.

## Congelando o tempo
Você pode usar o pacote [timekeeper](https://www.npmjs.com/package/timekeeper) para congelar ou viajar o tempo ao escrever testes. Os pacotes timekeeper funcionam simulando a classe `Date`.

No exemplo a seguir, encapsulamos a API do `timekeeper` dentro de um [recurso de teste do Japa](https://japa.dev/docs/test-resources).

```ts
import { getActiveTest } from '@japa/runner'
import timekeeper from 'timekeeper'

export function timeTravel(secondsToTravel: number) {
  const test = getActiveTest()
  if (!test) {
    throw new Error('Cannot use "timeTravel" outside of a Japa test')
  }

  timekeeper.reset()

  const date = new Date()
  date.setSeconds(date.getSeconds() + secondsToTravel)
  timekeeper.travel(date)

  test.cleanup(() => {
    timekeeper.reset()
  })
}
```

Você pode usar o método `timeTravel` dentro dos seus testes da seguinte forma.

```ts
import { timeTravel } from '#test_helpers'

test('expire token after 2 hours', async ({ assert }) => {
  /**
   * Travel 3 hours into the future
   */
  timeTravel(60 * 60 * 3)
})
```
