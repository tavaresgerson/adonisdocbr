---
summary: Aprenda a validar a entrada do usuário no AdonisJS usando o VineJS.
---

# Validação

A validação de dados no AdonisJS geralmente é realizada no nível do controlador. Isso garante que você valide a entrada do usuário assim que seu aplicativo manipular a solicitação e enviar erros na resposta que podem ser exibidos ao lado dos campos do formulário.

Uma vez que a validação for concluída, você pode usar os dados confiáveis ​​para executar o restante das operações, como consultas ao banco de dados, agendamento de trabalhos de fila, envio de e-mails, etc.

## Escolhendo a biblioteca de validação
A equipe principal do AdonisJS criou uma biblioteca de validação de dados agnóstica de estrutura chamada [VineJS](https://vinejs.dev/docs/introduction). A seguir estão alguns dos motivos para usar o VineJS.

- É **uma das bibliotecas de validação mais rápidas** no ecossistema Node.js.

- Fornece **segurança de tipo estático** junto com as validações de tempo de execução.

- Ele vem pré-configurado com os kits iniciais `web` e `api`.

- Os pacotes oficiais do AdonisJS estendem o VineJS com regras personalizadas. Por exemplo, o Lucid contribui com as regras `unique` e `exists` para o VineJS.

No entanto, o AdonisJS não força você tecnicamente a usar o VineJS. Você pode usar qualquer biblioteca de validação que seja ótima para você ou sua equipe. Basta desinstalar o pacote `@vinejs/vine` e instalar o pacote que deseja usar.

## Configurando o VineJS
Instale e configure o VineJS usando o seguinte comando.

[Documentação do VineJS](https://vinejs.dev)

```sh
node ace add vinejs
```

::: details See steps performed by the add command

1. Instala o pacote `@vinejs/vine` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/core/providers/vinejs_provider')
      ]
    }
    ```

:::

## Usando validadores
O VineJS usa o conceito de validadores. Você cria um validador para cada ação que seu aplicativo pode executar. Por exemplo: defina um validador para **criar uma nova postagem**, outro para **atualizar a postagem** e talvez um validador para **excluir uma postagem**.

Usaremos um blog como exemplo e definiremos validadores para criar/atualizar uma postagem. Vamos começar registrando algumas rotas e o `PostsController`.

```ts
// title: Define routes
import router from '@adonisjs/core/services/router'

const PostsController = () => import('#controllers/posts_controller')

router.post('posts', [PostsController, 'store'])
router.put('posts/:id', [PostsController, 'update'])
```

```sh
// title: Create controller
node ace make:controller post store update
```

```ts
// title: Scaffold controller
import { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async store({}: HttpContext) {}

  async update({}: HttpContext) {}
}
```

### Criando validadores

Depois de criar o `PostsController` e definir as rotas, você pode usar o seguinte comando ace para criar um validador.

Veja também: [Comando Make validator](../references/commands.md#makevalidator)

```sh
node ace make:validator post
```

Os validadores são criados dentro do diretório `app/validators`. O arquivo do validador está vazio por padrão, e você pode usá-lo para exportar vários validadores dele. Cada validador é uma variável `const` que contém o resultado do método [`vine.compile`](https://vinejs.dev/docs/getting_started#pre-compiling-schema).

No exemplo a seguir, definimos `createPostValidator` e `updatePostValidator`. Ambos os validadores têm uma pequena variação em seus esquemas. Durante a criação, permitimos que o usuário forneça um slug personalizado para a postagem, enquanto não permitimos sua atualização.

:::note
Não se preocupe muito com a duplicação dentro dos esquemas do validador. Recomendamos que você opte por esquemas fáceis de entender em vez de evitar duplicação a todo custo. A [analogia da base de código molhada](https://www.deconstructconf.com/2019/dan-abramov-the-wet-codebase) pode ajudá-lo a adotar a duplicação.
:::

```ts
// title: app/validators/post_validator.ts
import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
    slug: vine.string().trim(),
    description: vine.string().trim().escape()
  })
)

/**
 * Validates the post's update action
 */
export const updatePostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
    description: vine.string().trim().escape()
  })
)
```

### Usando validadores dentro de controladores
Vamos voltar ao `PostsController` e usar os validadores para validar o corpo da solicitação. Você pode acessar o corpo da solicitação usando o método `request.all()`.

```ts
import { HttpContext } from '@adonisjs/core/http'
// insert-start
import {
  createPostValidator,
  updatePostValidator
} from '#validators/post_validator'
// insert-end

export default class PostsController {
  async store({ request }: HttpContext) {
    // insert-start
    const data = request.all()
    const payload = await createPostValidator.validate(data)
    return payload
    // insert-end
  }

  async update({ request }: HttpContext) {
    // insert-start
    const data = request.all()
    const payload = await updatePostValidator.validate(data)
    return payload
    // insert-end
  }
}
```

Isso é tudo! Validar a entrada do usuário são duas linhas de código dentro dos seus controladores. A saída validada tem informações de tipo estático inferidas do esquema.

Além disso, você não precisa encapsular a chamada do método `validate` dentro de um `try/catch`. Porque no caso de um erro, o AdonisJS converterá automaticamente o erro em uma resposta HTTP.

## Tratamento de erros
O [HttpExceptionHandler](./exception_handling.md) converterá os erros de validação em uma resposta HTTP automaticamente. O manipulador de exceções usa negociação de conteúdo e retorna uma resposta com base no valor do cabeçalho [Accept](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept).

:::tip
Você pode dar uma olhada na [base de código do ExceptionHandler](https://github.com/adonisjs/http-server/blob/main/src/exception_handler.ts#L343-L345) e ver como as exceções de validação são convertidas em uma resposta HTTP.

Além disso, o middleware de sessão [substitui o método `renderValidationErrorAsHTML`](https://github.com/adonisjs/session/blob/main/src/session_middleware.ts#L30-L37) e usa mensagens flash para compartilhar os erros de validação com o formulário.
:::

[SimpleErrorReporter](https://github.com/vinejs/vine/blob/main/src/reporters/simple_error_reporter.ts).
[JSON API](https://jsonapi.org/format/#errors) spec.
[session package](./session.md) will receive the errors via 

- Todas as outras solicitações receberão erros de volta como texto simples.

## O método request.validateUsing
A maneira recomendada de executar validações dentro de controladores é usar o método `request.validateUsing`. Ao usar o método `request.validateUsing`, você não precisa definir os dados de validação explicitamente; o **corpo da solicitação**, os **valores da sequência de consulta** e os **arquivos** são mesclados e passados ​​como dados para o validador.

```ts
import { HttpContext } from '@adonisjs/core/http'
import {
  createPostValidator,
  updatePostValidator
} from '#validators/posts_validator'

export default class PostsController {
  async store({ request }: HttpContext) {
    // delete-start
    const data = request.all()
    const payload = await createPostValidator.validate(data)
    // delete-end
    // insert-start
    const payload = await request.validateUsing(createPostValidator)
    // insert-end
  }

  async update({ request }: HttpContext) {
    // delete-start
    const data = request.all()
    const payload = await updatePostValidator.validate(data)
    // delete-end
    // insert-start
    const payload = await request.validateUsing(updatePostValidator)
    // insert-end
  }
}
```

### Validando cookies, cabeçalhos e parâmetros de rota
Ao usar o método `request.validateUsing`, você pode validar cookies, cabeçalhos e parâmetros de rota da seguinte forma.

```ts
const validator = vine.compile(
  vine.object({
    // Fields in request body
    username: vine.string(),
    password: vine.string(),

    // Validate cookies
    cookies: vine.object({
    }),

    // Validate headers
    headers: vine.object({
    }),

    // Validate route params
    params: vine.object({
    }),
  })
)

await request.validateUsing(validator)
```

## Passando metadados para validadores
Como os validadores são definidos fora do ciclo de vida da solicitação, eles não têm acesso direto aos dados da solicitação. Isso geralmente é bom porque torna os validadores reutilizáveis ​​fora do ciclo de vida de uma solicitação HTTP.

No entanto, se um validador precisar acessar alguns dados de tempo de execução, você deve passá-los como metadados durante a chamada do método `validate`.

Vamos dar um exemplo da regra de validação `unique`. Queremos garantir que o e-mail do usuário seja único no banco de dados, mas pular a linha para o usuário conectado no momento.

```ts
export const updateUserValidator = vine
  .compile(
    vine.object({
      email: vine.string().unique(async (db, value, field) => {
        const user = await db
          .from('users')
          // highlight-start
          .whereNot('id', field.meta.userId)
          // highlight-end
          .where('email', value)
          .first()
        return !user
      })
    })
  )
```

No exemplo acima, acessamos o usuário conectado no momento por meio da propriedade `meta.userId`. Vamos ver como podemos passar o `userId` durante uma solicitação HTTP.

```ts
async update({ request, auth }: HttpContext) {
  await request.validateUsing(
    updateUserValidator,
    {
      meta: {
        userId: auth.user!.id
      }
    }
  )
}
```

### Tornando os metadados seguros para o tipo
No exemplo anterior, devemos lembrar de passar o `meta.userId` durante a validação. Seria ótimo se pudéssemos fazer o TypeScript nos lembrar do mesmo.

No exemplo a seguir, usamos a função `vine.withMetaData` para definir o tipo estático dos metadados que esperamos usar em nosso esquema.

```ts
export const updateUserValidator = vine
  // insert-start
  .withMetaData<{ userId: number }>()
  // insert-end
  .compile(
    vine.object({
      email: vine.string().unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .whereNot('id', field.meta.userId)
          .where('email', value)
          .first()
        return !user
      })
    })
  )
```

Observe que o VineJS não valida os metadados em tempo de execução. No entanto, se quiser fazer isso, você pode passar um retorno de chamada para o método `withMetaData` e executar a validação manualmente.

```ts
vine.withMetaData<{ userId: number }>((meta) => {
  // validate metadata
})
```

## Configurando o VineJS
Você pode criar um [arquivo de pré-carregamento](../concepts/adonisrc_file.md#preloads) dentro do diretório `start` para configurar o VineJS com mensagens de erro personalizadas ou usar um relator de erro personalizado.

```sh
node ace make:preload validator
```

No exemplo a seguir, nós [definimos mensagens de erro personalizadas](https://vinejs.dev/docs/custom_error_messages).

```ts
// title: start/validator.ts
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  'required': 'The {{ field }} field is required',
  'string': 'The value of {{ field }} field must be a string',
  'email': 'The value is not a valid email address',

  // Error message for the username field
  'username.required': 'Please choose a username for your account',
})
```

No exemplo a seguir, nós [registramos um relator de erro personalizado](https://vinejs.dev/docs/error_reporter).

```ts
// title: start/validator.ts
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { JSONAPIErrorReporter } from '../app/validation_reporters.js'

vine.errorReporter = () => new JSONAPIErrorReporter()
```

## Regras contribuídas pelo AdonisJS
A seguir está a lista de regras do VineJS contribuídas pelo AdonisJS.

O tipo de esquema [`vine.file`](https://github.com/adonisjs/core/blob/main/providers/vinejs_provider.ts) é adicionado pelo pacote principal do AdonisJS.

## O que vem a seguir?

[mensagens personalizadas](https://vinejs.dev/docs/custom_error_messages) no VineJS.
[relatores de erro](https://vinejs.dev/docs/error_reporter) no VineJS.
[schema API](https://vinejs.dev/docs/schema_101).
[traduções i18n](../digging_deeper/i18n.md#translating-validation-messages) para definir mensagens de erro de validação.
