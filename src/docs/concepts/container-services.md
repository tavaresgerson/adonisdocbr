---
summary: Aprenda sobre serviços de contêiner e como eles ajudam a manter sua base de código limpa e testável.
---

# Serviços de contêiner

Como discutimos no [guia de contêiner IoC](./dependency_injection.md#container-bindings), as vinculações de contêiner são uma das principais razões para o contêiner IoC existir no AdonisJS.

As vinculações de contêiner mantêm sua base de código limpa do código boilerplate necessário para construir objetos antes que eles possam ser usados.

No exemplo a seguir, antes de usar a classe `Database`, você terá que criar uma instância dela. Dependendo da classe que você está construindo, você pode ter escrito muito código boilerplate para obter todas as suas dependências.

```ts
import { Database } from '@adonisjs/lucid'
export const db = new Database(
  // injetar configuração e outras dependências
)
```

No entanto, ao usar um contêiner IoC, você pode descarregar a tarefa de construir uma classe para o contêiner e buscar uma instância pré-construída.

```ts
import app from '@adonisjs/core/services/app'
const db = await app.container.make('lucid.db')
```

## A necessidade de serviços de contêiner

Usar o contêiner para resolver objetos pré-configurados é ótimo. No entanto, usar o método `container.make` tem suas desvantagens.

- Os editores são bons com importações automáticas. Se você tentar usar uma variável e o editor puder adivinhar o caminho de importação da variável, ele escreverá a instrução de importação para você. **No entanto, isso não funciona com chamadas `container.make`.**

- Usar uma mistura de instruções de importação e chamadas `container.make` parece pouco intuitivo em comparação a ter uma sintaxe unificada para importar/usar módulos.

Para superar essas desvantagens, envolvemos chamadas `container.make` dentro de um módulo JavaScript regular, para que você possa buscá-las usando a instrução `import`.

Por exemplo, o pacote `@adonisjs/lucid` tem um arquivo chamado `services/db.ts` e esse arquivo tem aproximadamente o seguinte conteúdo.

```ts
const db = await app.container.make('lucid.db')
export { db as default }
```

Dentro do seu aplicativo, você pode substituir a chamada `container.make` por uma importação apontando para o arquivo `services/db.ts`.

```ts
import app from '@adonisjs/core/services/app' // [!code --]
const db = await app.container.make('lucid.db') // [!code --]
import db from '@adonisjs/lucid/services/db' // [!code ++]
```

Como você pode ver, ainda estamos contando com o contêiner para resolver uma instância da classe Database para nós. No entanto, com uma camada de indireção, podemos substituir a chamada `container.make` por uma instrução `import` regular.

**O módulo JavaScript que envolve as chamadas `container.make` é conhecido como um serviço de contêiner.** Quase todo pacote que interage com o contêiner é enviado com um ou mais serviços de contêiner.

## Serviços de contêiner vs. Injeção de dependência

Os serviços de contêiner são uma alternativa à injeção de dependência. Por exemplo, em vez de aceitar a classe `Disk` como uma dependência, você pede ao serviço `drive` para fornecer uma instância de disco. Vamos dar uma olhada em alguns exemplos de código.

No exemplo a seguir, usamos o decorador `@inject` para injetar uma instância da classe `Disk`.

```ts {4-7,12}
import { Disk } from '@adonisjs/drive'
import { inject } from '@adonisjs/core'

@inject()
export class PostService {
  constructor(protected disk: Disk) {
  }

  async save(post: Post, coverImage: File) {
    const coverImageName = 'random_name.jpg'

    await this.disk.put(coverImageName, coverImage)
    
    post.coverImage = coverImageName
    await post.save()
  }
}
```

Ao usar o serviço `drive`, chamamos o método `drive.use` para obter uma instância de `Disk` com o driver `s3`.

```ts {7-8}
import drive from '@adonisjs/drive/services/main'

export class PostService {
  async save(post: Post, coverImage: File) {
    const coverImageName = 'random_name.jpg'

    const disk = drive.use('s3')
    await disk.put(coverImageName, coverImage)
    
    post.coverImage = coverImageName
    await post.save()
  }
}
```

Os serviços de contêiner são ótimos para manter seu código conciso. Enquanto isso, a injeção de dependência cria um acoplamento frouxo entre diferentes partes do aplicativo.

A escolha de um em vez do outro se resume à sua escolha pessoal e à abordagem que você deseja adotar para estruturar seu código.

## Testando com serviços de contêiner

O benefício absoluto da injeção de dependência é a capacidade de trocar dependências no momento da escrita de testes.

Para fornecer uma experiência de teste semelhante com serviços de contêiner, o AdonisJS fornece APIs de primeira classe para falsificar implementações ao escrever testes.

No exemplo a seguir, chamamos o método `drive.fake` para trocar discos de unidade com um driver na memória. Depois que uma falsificação é criada, qualquer chamada para o método `drive.use` receberá a implementação falsa.

```ts
import drive from '@adonisjs/drive/services/main'
import { PostService } from '#services/post_service'

test('save post', async ({ assert }) => {
  /**
   * Disco s3 falso
   */
  drive.fake('s3')
 
  const postService = new PostService()
  await postService.save(post, coverImage)
  
  /**
   * Escrever afirmações
   */
  assert.isTrue(await drive.use('s3').exists(coverImage.name))
  
  /**
   * Restaurar falso
   */
  drive.restore('s3')
})
```

## Ligações e serviços de contêiner

A tabela a seguir descreve uma lista de ligações de contêiner e seus serviços relacionados exportados pelo núcleo do framework e pacotes primários.

| Binding     | Classe                                                                              | Serviço                               |
|-------------|-------------------------------------------------------------------------------------|---------------------------------------|
| `app`       | [Application](https://github.com/adonisjs/application/blob/main/src/application.ts) | `@adonisjs/core/services/app`         |
| `ace`       | [Kernel](https://github.com/adonisjs/core/blob/main/modules/ace/kernel.ts)          | `@adonisjs/core/services/kernel`      |
| `config`    | [Config](https://github.com/adonisjs/config/blob/main/src/config.ts)                | `@adonisjs/core/services/config`      |
| `encryption`| [Encryption](https://github.com/adonisjs/encryption/blob/main/src/encryption.ts)    | `@adonisjs/core/services/encryption`  |
| `emitter`   | [Emitter](https://github.com/adonisjs/events/blob/main/src/emitter.ts)              | `@adonisjs/core/services/emitter`     |
| `hash`      | [HashManager](https://github.com/adonisjs/hash/blob/main/src/hash_manager.ts)       | `@adonisjs/core/services/hash`        |
| `logger`    | [LoggerManager](https://github.com/adonisjs/logger/blob/main/src/logger_manager.ts) | `@adonisjs/core/services/logger`      |
| `repl`      | [Repl](https://github.com/adonisjs/repl/blob/main/src/repl.ts)                      | `@adonisjs/core/services/repl`        |
| `router`    | [Router](https://github.com/adonisjs/http-server/blob/main/src/router/main.ts)      | `@adonisjs/core/services/router`      |
| `server`    | [Server](https://github.com/adonisjs/http-server/blob/main/src/server/main.ts)      | `@adonisjs/core/services/server`      |
| `testUtils` | [TestUtils](https://github.com/adonisjs/core/blob/main/src/test_utils/main.ts)      | `@adonisjs/core/services/test_utils`  |
