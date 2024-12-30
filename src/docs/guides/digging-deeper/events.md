# Eventos

O módulo emissor de eventos AdonisJS é construído em cima do [Emittery](https://github.com/sindresorhus/emittery). Ele difere do módulo Eventos nativo do Node.js das seguintes maneiras.

[leia a explicação do Emittery](https://github.com/sindresorhus/emittery#how-is-this-different-than-the-built-in-eventemitter-in-nodejs) sobre isso também.
- Capacidade de tornar os eventos seguros para o tipo.
- Capacidade de capturar eventos durante os testes em vez de disparar o evento real.

## Uso
Recomendamos definir todos os ouvintes de eventos dentro de um arquivo dedicado, assim como você define rotas em um único arquivo.

Para este guia, vamos definir os ouvintes de eventos dentro do arquivo `start/events.ts`. Você pode criar este arquivo manualmente ou executar o seguinte comando Ace.

```sh
node ace make:prldfile events

# SELECT ALL THE ENVIRONMENTS
```

Abra o arquivo recém-criado e escreva o seguinte código dentro dele. O método `Event.on` registra um ouvinte de evento. Ele aceita o nome do evento como o primeiro argumento, seguido por um método para manipular o evento.

```ts
import Event from '@ioc:Adonis/Core/Event'

Event.on('new:user', (user) => {
  console.log(user)
})
```

Para disparar o ouvinte de evento `new:user`, você terá que emitir este evento. Você pode fazer isso de qualquer lugar dentro do seu aplicativo depois que ele for inicializado.

```ts {7}
import Event from '@ioc:Adonis/Core/Event'

export default class UsersController {
  public async store() {
    // ... código para criar um novo usuário
    
    Event.emit('new:user', { id: 1 })
  }
}
```

## Tornando os eventos seguros para o tipo
Os ouvintes de evento e o código que emite o evento geralmente não estão no mesmo lugar/arquivo. Portanto, é muito fácil para parte do seu código emitir o evento e enviar os dados errados. Por exemplo:

```ts
Event.on('new:user', (user) => {
  console.log(user.email)
})

// Não há nenhuma propriedade de e-mail definida aqui
Event.emit('new:user', { id: 1 })
```

Você pode evitar esse comportamento definindo o tipo do argumento para um determinado evento dentro do arquivo `contracts/events.ts`.

```ts
declare module '@ioc:Adonis/Core/Event' {
  interface EventsList {
    'new:user': { id: number; email: string }
  }
}
```

O compilador estático TypeScript garantirá que todas as chamadas `Event.emit` para o evento `new:user` sejam seguras quanto ao tipo.

![](/docs/assets/type-safe-events.webp)

## Classes de ouvinte
Como controladores e middleware, você também pode extrair os ouvintes de eventos inline para suas classes dedicadas.

Convencionalmente, os ouvintes de eventos são armazenados dentro do diretório `app/Listeners`. No entanto, você pode personalizar o namespace dentro do arquivo `.adonisrc.json`.

<detalhes>
<resumo> Personalize o namespace dos ouvintes de eventos </resumo>

```json
{
  "namespaces": {
    "eventListeners": "App/CustomDir/Listeners"
  }
}
```

</detalhes>

Você pode criar uma classe de ouvinte executando o seguinte comando Ace.

```sh
node ace make:listener User

# CREATE: app/Listeners/User.ts
```

Abra o arquivo recém-criado e defina o seguinte método na classe.

```ts
import { EventsList } from '@ioc:Adonis/Core/Event'

export default class User {
  public async onNewUser(user: EventsList['new:user']) {
    // enviar e-mail para o novo usuário
  }
}
```

Finalmente, você pode vincular o método `onNewUser` como o ouvinte de eventos dentro do arquivo `start/events.ts`. O processo de vinculação é semelhante a uma vinculação do controlador de rota e não há necessidade de definir o namespace completo.

```ts
Event.on('new:user', 'User.onNewUser')
```

## Tratamento de erros
O Emittery emite eventos de forma assíncrona quando você chama o método `Event.emit`. Uma maneira de lidar com os erros é envolver suas chamadas emit dentro de um bloco `try/catch`.

```ts
try {
  await Event.emit('new:user', { id: 1 })
} catch (error) {
  // Lidar com o erro
}
```

No entanto, esta não é a maneira mais intuitiva de escrever código. Normalmente, você deseja emitir eventos e depois esquecê-los.

O AdonisJS permite que você registre um manipulador de erros invocado para todos os erros que ocorreram durante o ciclo de vida de emissão do evento para tornar o tratamento de erros um pouco mais fácil.

Você deve definir o manipulador de erros apenas uma vez (talvez junto com o restante dos manipuladores de eventos).

```ts
Event.onError((event, error, eventData) => {
  // Lidar com o erro
})
```

## Diferenças do emissor de eventos do Node.js
Conforme mencionado anteriormente, o módulo Event do AdonisJS é construído em cima do [Emittery](https://github.com/sindresorhus/emittery), e é diferente do emissor de eventos do Node.js das seguintes maneiras.

- Emittery é assíncrono e não bloqueia o loop de eventos.
- Ele não tem o evento de erro mágico
- Ele não coloca um limite no número de ouvintes que você pode definir para um evento específico.
- [argumento único](https://github.com/sindresorhus/emittery#can-you-support-multiple-arguments-for-emit) durante as chamadas `emit`.
