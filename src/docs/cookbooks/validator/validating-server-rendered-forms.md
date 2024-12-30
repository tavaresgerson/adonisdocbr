# Validando formulários do lado do servidor

Este guia aborda o uso do validador para validar os formulários renderizados no servidor usando modelos Edge. Usaremos [mensagens flash de sessão](/docs/guides/http/session.md#session-flash-messages) para acessar os erros do validador.

## Criando o formulário

::: info NOTA
O exemplo final está hospedado no codesandbox. [Clique aqui](https://6zhxz.sse.codesandbox.io/posts/create) para visualizar o resultado ou [editar o projeto](https://codesandbox.io/s/adonisv5-basic-form-validation-6zhxz) diretamente no codesandbox.
:::

O AdonisJS não interfere no seu HTML e você define os formulários usando a sintaxe HTML padrão. Em outras palavras, o AdonisJS não tem nenhum construtor de formulários fazendo mágica nos bastidores e, portanto, você tem total liberdade para estruturar o HTML da maneira que quiser.

A seguir está o formulário HTML para criar uma nova postagem de blog aceitando o **título** e o **corpo** da postagem.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Create a new blog post</title>
  </head>
  <body>
    <form action="/posts" method="POST">
      <div>
        <p>
          <label for="title"> Post title </label>
        </p>

        <input type="text" name="title" />
      </div>

      <div>
        <p>
          <label for="body"> Post body </label>
        </p>

        <textarea name="body" cols="30" rows="10"></textarea>
      </div>

      <div>
        <button type="submit">Create Post</button>
      </div>
    </form>
  </body>
</html>
```

Como você pode notar, todo o documento é HTML puro, sem nenhuma sintaxe especial dentro dele. Como uma pequena melhoria, você pode substituir a ação de formulário codificada `/posts` pelo método [route helper](/docs/guides/http/routing.md#url-generation).

Assumindo as seguintes declarações de rota.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('posts/create', 'PostsController.create')
Route.post('posts', 'PostsController.store')
```

Você pode obter a URL da rota para armazenar uma nova postagem usando seu nome `controller.action`.

```edge
<form action="/posts" method="POST"> // [!code --]
<form action="{{ route('PostsController.store') }}" method="POST"> // [!code ++]
  <!-- Resto do formulário -->
</form>
```

## Validando o formulário

Vamos continuar com o mesmo formulário que criamos acima e implementar o método `PostsController.store` para validar a solicitação recebida.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class PostsController {
  public async store({ request }: HttpContextContract) {
    const postSchema = schema.create({
      title: schema.string({ trim: true }, [
        rules.minLength(10)
      ]),
      body: schema.string(),
    })

    const payload = await request.validate({ schema: postSchema })
    console.log(payload)

    return 'Post created'
  }
}
```

#### schema.create

O método `schema.create` cria uma nova definição de esquema. O esquema define o formato dos dados que você espera.

---

#### schema.string

O método `schema.string` impõe que o valor seja uma string válida. Existem outros métodos semelhantes para impor diferentes tipos de dados, como um booleano, um número e assim por diante.

Opcionalmente, você pode definir validações adicionais em uma propriedade usando o objeto `rules`.

---

#### request.validate

O método `request.validate` aceita o esquema predefinido e valida o corpo da solicitação em relação a ele.

Se a validação falhar, o validador **redirecionará o cliente de volta** para o formulário junto com as mensagens de erro e os valores do formulário.

Se a validação for bem-sucedida, você poderá acessar as propriedades validadas como o valor de retorno do método.

## Exibindo erros de validação

Os erros de validação são compartilhados com o formulário usando [mensagens flash de sessão](/docs/guides/http/session.md#flash-messages). Dentro dos seus modelos de borda, você pode acessá-los usando a propriedade global `flashMessages`.

#### Estrutura de erros dentro de mensagens flash

```ts
{
  errors: {
    title: ['required validation failed'],
    body: ['required validation failed'],
  }
}
```

#### Acessar mensagens de erro

```edge
{{ flashMessages.get('errors.title') }}
{{ flashMessages.get('errors.body') }}
```

## Retendo valores de entrada
Após o redirecionamento, o navegador renderiza novamente a página e os valores do formulário são redefinidos para seu estado inicial. No entanto, você pode acessar os valores enviados usando mensagens flash.

Você pode acessar os valores de entrada do formulário usando o nome do campo. Por exemplo:

```edge
<div>
  <p>
    <label for="title"> Post title </label>
  </p>

  // highlight-start
  <input
    type="text"
    name="title"
    value="{{ flashMessages.get('title', '') }}"
  />
  // highlight-end
</div>
```

Você também pode aninhar valores usando o nome do campo

```edge
<input
  type="text"
  name="user[email]"
  value="{{ flashMessages.get('user[email]', '') }}"
/>
```

## Exibindo mensagem de sucesso

O uso de mensagens flash não se limita apenas aos erros de validação. Você também pode usá-las para exibir a mensagem de sucesso após o envio do formulário. Por exemplo:

```ts
// Controller

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {
  // Crie o método

  public async store({ request }: HttpContextContract) { // [!code --]

  public async store({ request, session, response }: HttpContextContract) { // [!code ++]

    // ...Código existente recolhido
    console.log(payload)

    return 'Post created' // [!code --]

    session.flash('success', 'Post created successfully') // [!code ++]
    response.redirect().back() // [!code ++]
  }
}
```

#### Acesse a mensagem de sucesso dentro do modelo edge

```edge
@if(flashMessages.has('success'))
  <p>{{ flashMessages.get('success') }}</p>
@endif
```

## Falsificação de método de formulário

Formulários HTML padrão não podem usar todos os verbos HTTP além de `GET` e `POST`. Isso significa que você não pode criar um formulário com o método `PUT`.

No entanto, o AdonisJS permite que você falsifique o método HTTP usando a string de consulta `_method`. No exemplo a seguir, a solicitação será roteada para a rota que escuta a solicitação `PUT`.

```html
<form method="POST" action="/posts/1?_method=PUT"></form>
```

A falsificação de método de formulário só funciona:

- Quando o valor de `http.allowMethodSpoofing` é definido como true dentro do arquivo `config/app.ts`.
- E o método de solicitação original é `POST`.
