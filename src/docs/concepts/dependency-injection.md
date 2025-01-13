---
summary: Aprenda sobre injeção de dependência no AdonisJS e como usar o contêiner IoC para resolver dependências.
---

# Injeção de dependência

No coração de cada aplicativo AdonisJS está um contêiner IoC que pode construir classes e resolver dependências com quase nenhuma configuração.

O contêiner IoC atende aos dois casos de uso principais a seguir.

- [Bindings later](#container-bindings).
- Resolva e injete dependências automaticamente em um construtor de classe ou métodos de classe.

Vamos começar injetando dependências em uma classe.

## Exemplo básico

A injeção automática de dependência depende da [implementação de decoradores legados do TypeScript](https://www.typescriptlang.org/docs/handbook/decorators.html) e da API [Metadados de reflexão](https://www.npmjs.com/package/reflect-metadata).

No exemplo a seguir, criamos uma classe `EchoService` e injetamos uma instância dela na classe `HomeController`. Você pode acompanhar copiando e colando os exemplos de código.

### Etapa 1. Crie a classe Service
Comece criando a classe `EchoService` dentro da pasta `app/services`.

```ts
// app/services/echo_service.ts

export default class EchoService {
  respond() {
    return 'hello'
  }
}
```

### Etapa 2. Injete o serviço dentro do controlador

Crie um novo controlador HTTP dentro da pasta `app/controllers`. Como alternativa, você pode usar o comando `node ace make:controller home`.

Importe o `EchoService` no arquivo do controlador e aceite-o como uma dependência do construtor.

```ts
// app/controllers/home_controller.ts

import EchoService from '#services/echo_service'

export default class HomeController {
  constructor(protected echo: EchoService) {
  }
  
  handle() {
    return this.echo.respond()
  }
}
```

### Etapa 3. Usando o decorador inject

Para fazer a resolução automática de dependência funcionar, teremos que usar o decorador `@inject` na classe `HomeController`.

```ts
import EchoService from '#services/echo_service'
import { inject } from '@adonisjs/core' // [!code ++]

@inject() // [!code ++]
export default class HomeController {
  constructor(protected echo: EchoService) {
  }
  
  handle() {
    return this.echo.respond()
  }
}
```

Isso é tudo! Agora você pode vincular a classe `HomeController` a uma rota e ela receberá automaticamente uma instância da classe `EchoService`.

### Conclusão

Você pode pensar no decorador `@inject` como um espião observando o construtor da classe ou dependências do método e informando o contêiner sobre isso.

Quando o roteador AdonisJS pede ao contêiner para construir o `HomeController`, o contêiner já sabe sobre as dependências do controlador.

## Construindo uma árvore de dependências

No momento, a classe `EchoService` não tem dependências, e usar o contêiner para criar uma instância dela pode parecer exagero.

Vamos atualizar o construtor da classe e fazê-lo aceitar uma instância da classe `HttpContext`.

```ts
// app/services/echo_service.ts

import { inject } from '@adonisjs/core' // [!code ++]
import { HttpContext } from '@adonisjs/core/http' // [!code ++]

@inject() // [!code ++]
export default class EchoService {
  constructor(protected ctx: HttpContext) { // [!code ++]
  } // [!code ++]

  respond() {
    return `Hello from ${this.ctx.request.url()}`
  }
}
```

Novamente, precisamos colocar nosso espião (o decorador `@inject`) na classe `EchoService` para inspecionar suas dependências.

Voilá, é tudo o que precisamos fazer. Sem alterar uma única linha de código dentro do controlador, você pode executar novamente o código, e a classe `EchoService` receberá uma instância da classe `HttpContext`.

::: info NOTA
A melhor coisa sobre usar o contêiner é que você pode ter dependências profundamente aninhadas, e o contêiner pode resolver a árvore inteira para você. O único problema é usar o decorador `@inject`.
:::

## Usando injeção de método

A injeção de método é usada para injetar dependências dentro de um método de classe. Para que a injeção de método funcione, você deve colocar o decorador `@inject` antes da assinatura do método.

Vamos continuar com nosso exemplo anterior e mover a dependência `EchoService` do construtor `HomeController` para o método `handle`.

::: info NOTA
Ao usar injeção de método dentro de um controlador, lembre-se de que o primeiro parâmetro recebe um valor fixo (ou seja, o contexto HTTP) e o restante dos parâmetros são resolvidos usando o contêiner.
:::

```ts
// app/controllers/home_controller.ts

import EchoService from '#services/echo_service'
import { inject } from '@adonisjs/core'

@inject() // [!code --]
export default class HomeController {
  constructor(private echo: EchoService) {  // [!code --]
  } // [!code --]
  
  @inject() // [!code ++]
  handle(ctx, echo: EchoService) {  // [!code ++]
    return echo.respond() // [!code ++]
  } // [!code ++]
}
```

Isso é tudo! Desta vez, a instância da classe `EchoService` será injetada dentro do método `handle`.

## Quando usar injeção de dependência

É recomendável aproveitar a injeção de dependência em seus projetos porque o DI cria um acoplamento frouxo entre diferentes partes do seu aplicativo. Como resultado, a base de código se torna mais fácil de testar e refatorar.

No entanto, você precisa ter cuidado e não levar a ideia de injeção de dependência ao extremo a ponto de começar a perder seus benefícios. Por exemplo:

- Você não deve injetar bibliotecas auxiliares como `lodash` como uma dependência da sua classe. Importe e use diretamente.
- Sua base de código pode não precisar de acoplamento frouxo para componentes que provavelmente serão trocados ou substituídos. Por exemplo, você pode preferir importar o serviço `logger` em vez de injetar a classe `Logger` como uma dependência.

## Usando o contêiner diretamente

A maioria das classes dentro do seu aplicativo AdonisJS, como **Controllers**, **Middleware**, **Event listeners**, **Validators** e **Mailers**, são construídas usando o contêiner. Portanto, você pode aproveitar o decorador `@inject` para injeção automática de dependência.

Para situações em que você deseja autoconstruir uma instância de classe usando o contêiner, você pode usar o método `container.make`.

O método `container.make` aceita um construtor de classe e retorna uma instância dele após resolver todas as suas dependências.

```ts
import { inject } from '@adonisjs/core'
import app from '@adonisjs/core/services/app'

class EchoService {}

@inject()
class SomeService {
  constructor(public echo: EchoService) {}
}

/**
 * O mesmo que criar uma nova instância da classe, mas
 * terá o benefício de DI automático
 */
const service = await app.container.make(SomeService)

console.log(service instanceof SomeService)
console.log(service.echo instanceof EchoService)
```

Você pode usar o método `container.call` para injetar dependências dentro de um método. O método `container.call` aceita os seguintes argumentos.

1. Uma instância da classe.
2. O nome do método a ser executado na instância da classe. O contêiner resolverá as dependências e as passará para o método.
3. Uma matriz opcional de parâmetros fixos para passar para o método.

```ts
class EchoService {}

class SomeService {
  @inject()
  run(echo: EchoService) {
  }
}

const service = await app.container.make(SomeService)

/**
 * Uma instância da classe Echo será passada
 * o método run
 */
await app.container.call(service, 'run')
```

## Ligações de contêineres

As ligações de contêineres são uma das principais razões para o contêiner IoC existir no AdonisJS. As ligações agem como uma ponte entre os pacotes que você instala e seu aplicativo.

As ligações são essencialmente um par chave-valor, a chave é o identificador exclusivo para a ligação e o valor é uma função de fábrica que retorna o valor.

- O nome da ligação pode ser uma `string`, um `symbol` ou um construtor de classe.
- A função de fábrica pode ser assíncrona e deve retornar um valor.

Você pode usar o método `container.bind` para registrar uma ligação de contêiner. A seguir está um exemplo direto de registro e resolução de ligações do contêiner.

```ts
import app from '@adonisjs/core/services/app'

class MyFakeCache {
  get(key: string) {
    return `${key}!`
  }
}

app.container.bind('cache', function () {
  return new MyCache()
})

const cache = await app.container.make('cache')
console.log(cache.get('foo')) // retorna 'foo'!
```

### Quando usar ligações de contêiner?

As vinculações de contêiner são usadas para casos de uso específicos, como registrar serviços singleton exportados por um pacote ou instâncias de classe autoconstruídas quando a injeção automática de dependência é insuficiente.

Recomendamos que você não torne seus aplicativos desnecessariamente complexos registrando tudo no contêiner. Em vez disso, procure casos de uso específicos no código do aplicativo antes de recorrer às vinculações de contêiner.

A seguir estão alguns exemplos que usam vinculações de contêiner dentro dos pacotes do framework.

[Registrando BodyParserMiddleware dentro do contêiner](https://github.com/adonisjs/core/blob/main/providers/app_provider.ts#L134-L139): Como a classe de middleware requer configuração armazenada dentro do arquivo `config/bodyparser.ts`, não há como a injeção automática de dependência funcionar. Nesse caso, construímos manualmente a instância da classe de middleware registrando-a como uma vinculação.
[Registrando o serviço de criptografia como um singleton](https://github.com/adonisjs/core/blob/main/providers/app_provider.ts#L97-L100): A classe Encryption requer o `appKey` armazenado dentro do arquivo `config/app.ts`, portanto, usamos a vinculação de contêiner como uma ponte para ler o `appKey` do aplicativo do usuário e configurar uma instância singleton da classe Encryption.

::: danger ATENÇÃO
O conceito de vinculações de contêiner não é comumente usado no ecossistema JavaScript. Portanto, sinta-se à vontade para [entrar em nossa comunidade Discord](https://discord.gg/vDcEjq6) para esclarecer suas dúvidas.
:::

### Resolvendo vinculações dentro da função de fábrica

Você pode resolver outras vinculações do contêiner dentro da função de fábrica de vinculação. Por exemplo, se a classe `MyFakeCache` precisar de configuração do arquivo `config/cache.ts`, você pode acessá-la da seguinte maneira.

```ts
this.app.container.bind('cache', async (resolver) => {
  const configService = await resolver.make('config')
  const cacheConfig = configService.get<any>('cache')

  return new MyFakeCache(cacheConfig)
})
```

### Singletons

Singletons são ligações para as quais a função de fábrica é chamada uma vez, e o valor de retorno é armazenado em cache durante o tempo de vida do aplicativo.

Você pode registrar uma ligação singleton usando o método `container.singleton`.

```ts
this.app.container.singleton('cache', async (resolver) => {
  const configService = await resolver.make('config')
  const cacheConfig = configService.get<any>('cache')

  return new MyFakeCache(cacheConfig)
})
```

### Valores de ligação

Você pode ligar valores diretamente ao contêiner usando o método `container.bindValue`.

```ts
this.app.container.bindValue('cache', new MyFakeCache())
```

### Aliases

Você pode definir aliases para ligações usando o método `alias`. O método aceita o nome do alias como o primeiro parâmetro e uma referência a uma ligação existente ou um construtor de classe como o valor do alias.

```ts
this.app.container.singleton(MyFakeCache, async () => {
  return new MyFakeCache()
})

this.app.container.alias('cache', MyFakeCache)
```

### Definindo tipos estáticos para ligações

Você pode definir as informações de tipo estático para ligação usando [mesclagem de declaração TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).

Os tipos são definidos na interface `ContainerBindings` como um par chave-valor.

```ts
declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    cache: MyFakeCache
  }
}
```

Se você criar um pacote, poderá escrever o bloco de código acima dentro do arquivo do provedor de serviços.

Em seu aplicativo AdonisJS, você pode escrever o bloco de código acima dentro do arquivo `types/container.ts`.

## Criando uma camada de abstração

O contêiner permite que você crie uma camada de abstração para seu aplicativo. Você pode definir uma ligação para uma interface e resolvê-la para uma implementação concreta.

::: info NOTA
Este método é útil quando você deseja aplicar a Arquitetura Hexagonal, também conhecida como princípios de Porta e Adaptador, ao seu aplicativo.
:::

Como as interfaces TypeScript não existem em tempo de execução, você deve usar um construtor de classe abstrata para sua interface.

```ts
export abstract class PaymentService {
  abstract charge(amount: number): Promise<void>
  abstract refund(amount: number): Promise<void>
}
```

Em seguida, você pode criar uma implementação concreta da interface `PaymentService`.

```ts
import { PaymentService } from '#contracts/payment_service'

export class StripePaymentService implements PaymentService {
  async charge(amount: number) {
    // Cobrar o valor usando Stripe
  }

  async refund(amount: number) {
    // Reembolsar o valor usando Stripe
  }
}
```

Agora, você pode registrar a interface `PaymentService` e a implementação concreta `StripePaymentService` dentro do contêiner dentro do seu `AppProvider`.

```ts
// providers/app_provider.ts

import { PaymentService } from '#contracts/payment_service'

export default class AppProvider {
  async boot() {
    const { StripePaymentService } = await import('#services/stripe_payment_service')
    
    this.app.container.bind(PaymentService, () => {
      return this.app.container.make(StripePaymentService)
    })
  }
}
```

Finalmente, você pode resolver a interface `PaymentService` do contêiner e usá-la dentro do seu aplicativo.

```ts
import { PaymentService } from '#contracts/payment_service'

@inject()
export default class PaymentController {
  constructor(private paymentService: PaymentService) {
  }

  async charge() {
    await this.paymentService.charge(100)
    
    // ...
  }
}
```

## Trocando implementações durante o teste

Quando você confia no contêiner para resolver uma árvore de dependências, você tem menos/nenhum controle sobre as classes nessa árvore. Portanto, simular/falsificar essas classes pode se tornar mais difícil.

No exemplo a seguir, o método `UsersController.index` aceita uma instância da classe `UserService`, e usamos o decorador `@inject` para resolver a dependência e fornecê-la ao método `index`.

```ts
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'

export default class UsersController {
  @inject()
  index(service: UserService) {}
}
```

Digamos que durante o teste, você não queira usar o `UserService` real, pois ele faz solicitações HTTP externas. Em vez disso, você quer usar uma implementação falsa.

Mas primeiro, observe o código que você pode escrever para testar o `UsersController`.

```ts
import UserService from '#services/user_service'

test('get all users', async ({ client }) => {
  const response = await client.get('/users')

  response.assertBody({
    data: [{ id: 1, username: 'virk' }]
  })
})
```

No teste acima, interagimos com o `UsersController` por meio de uma solicitação HTTP e não temos controle direto sobre ele.

O contêiner fornece uma API direta para trocar classes com implementações falsas. Você pode definir uma troca usando o método `container.swap`.

O método `container.swap` aceita o construtor de classe que você deseja trocar, seguido por uma função de fábrica para retornar uma implementação alternativa.

```ts
import UserService from '#services/user_service'
import app from '@adonisjs/core/services/app' // [!code ++]

test('get all users', async ({ client }) => {
  class FakeService extends UserService {     // [!code ++]
    all() {                                   // [!code ++]
      return [{ id: 1, username: 'virk' }]    // [!code ++]
    }                                         // [!code ++]
  }                                           // [!code ++]

  app.container.swap(UserService, () => {     // [!code ++]
    return new FakeService()                  // [!code ++]
  })                                          // [!code ++]
  
  const response = await client.get('users')
  response.assertBody({
    data: [{ id: 1, username: 'virk' }]
  })
})
```

Depois que uma troca for definida, o contêiner a usará em vez da classe real. Você pode restaurar a implementação original usando o método `container.restore`.

```ts
app.container.restore(UserService)

// Restaurar UserService e PostService
app.container.restoreAll([UserService, PostService])

// Restaurar todos
app.container.restoreAll()
```

## Dependências contextuais

As dependências contextuais permitem que você defina como uma dependência deve ser resolvida para uma determinada classe. Por exemplo, você tem dois serviços dependendo da classe Drive Disk.

```ts
import { Disk } from '@adonisjs/drive'

export default class UserService {
  constructor(protected disk: Disk) {}
}
```

```ts
import { Disk } from '@adonisjs/drive'

export default class PostService {
  constructor(protected disk: Disk) {}
}
```

Você quer que o `UserService` receba uma instância de disco com o driver GCS e o `PostService` receba uma instância de disco com o driver S3. Você pode fazer isso usando dependências contextuais.

O código a seguir deve ser escrito dentro de um método `register` do provedor de serviços.

```ts
import { Disk } from '@adonisjs/drive'
import UserService from '#services/user_service'
import PostService from '#services/post_service'
import { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container
      .when(UserService)
      .asksFor(Disk)
      .provide(async (resolver) => {
        const driveManager = await resolver.make('drive')
        return drive.use('gcs')
      })

    this.app.container
      .when(PostService)
      .asksFor(Disk)
      .provide(async (resolver) => {
        const driveManager = await resolver.make('drive')
        return drive.use('s3')
      })
  }
}
```

## Ganchos de contêiner

Você pode usar o gancho `resolving` do contêiner para modificar/estender o valor de retorno do método `container.make`.

Normalmente, você usará ganchos dentro de um provedor de serviços ao tentar estender uma ligação específica. Por exemplo, o provedor de banco de dados usa o gancho `resolving` para registrar regras de validação adicionais orientadas ao banco de dados.

```ts
import { ApplicationService } from '@adonisjs/core/types'

export default class DatabaseProvider {
  constructor(protected app: ApplicationService) {
  }

  async boot() {
    this.app.container.resolving('validator', (validator) => {
      validator.rule('unique', implementation)
      validator.rule('exists', implementation)
    })
  }
}
```

## Eventos de contêiner

O contêiner emite o evento `container_binding:resolved` após resolver uma vinculação ou construir uma instância de classe. A propriedade `event.binding` será uma string (nome da vinculação) ou um construtor de classe, e a propriedade `event.value` é o valor resolvido.

```ts
import emitter from '@adonisjs/core/services/emitter'

emitter.on('container_binding:resolved', (event) => {
  console.log(event.binding)
  console.log(event.value)
})
```

## Veja também

* [O arquivo README do contêiner](https://github.com/adonisjs/fold/blob/develop/README.md) abrange a API do contêiner de maneira agnóstica ao framework.
* [Por que você precisa de um contêiner IoC?](https://github.com/thetutlage/meta/discussions/4) Neste artigo, o criador do framework compartilha seu raciocínio para usar o contêiner IoC.
