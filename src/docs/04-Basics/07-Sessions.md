---
title: Sessions
category: basics
---

# Sessões

O AdonisJs tem suporte de sessão de primeira classe com uma variedade de drivers integrados para gerenciar e armazenar sessões de forma eficiente.

Neste guia, aprendemos como configurar e usar esses diferentes drivers de sessão.

## Configuração
Se o provedor de sessão ainda não estiver configurado, siga as instruções abaixo.

Primeiro, execute o comando `adonis` para baixar o provedor de sessão:

```bash
adonis install @adonisjs/session
```

O comando acima também cria o arquivo `config/session.js` e exibe um pequeno conjunto de instruções para ajudar a concluir sua configuração.

Em seguida, registre o provedor de sessão dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/session/providers/SessionProvider'
]
```

Finalmente, registre o middleware de sessão dentro do arquivo `start/kernel.js`:

```js
// .start/kernel.js

const globalMiddleware = [
  'Adonis/Middleware/Session'
]
```

## Drivers suportados
Abaixo está a lista de drivers suportados pelo provedor de sessão. Você pode alterar o driver atual dentro do arquivo `config/session.js`.

::: warning NOTA
O driver Redis requer o pacote `@adonisjs/redis` (veja a seção [Redis](/docs/markdown/07-Database/05-Redis.md) para instruções de instalação).
:::

| Nome    | Chave de configuração | Descrição                                           |
|---------|-----------------------|----------------------------------------------------|
| Cookie  | cookie                | Salva valores de sessão em cookies criptografados. |
| File    | file                  | Salva valores de sessão em um arquivo em um servidor (não deve ser usado se você estiver executando o AdonisJs em vários servidores e atrás de um balanceador de carga). |
| Redis   | redis                 | Salvar em [Redis](https://redis.io) (ideal para dimensionamento horizontal). |

## Exemplo básico
O objeto `session` é passado como parte do [Contexto HTTP](/docs/02-Concept/01-Request-Lifecycle.md), assim como os objetos `request` e `response`.

Aqui está um exemplo rápido de como usar sessões durante o ciclo de vida HTTP:

```js
// .start/routes.js

Route.get('/', ({ session, response }) => {
  session.put('username', 'virk')
  response.redirect('/username')
})

Route.get('/username', ({ session }) => {
  return session.get('username') // 'virk'
})
```

## Métodos de sessão
Abaixo está uma lista de todos os métodos de sessão e seus usos de exemplo.

#### `put(key, value)`
Adicione um par chave/valor ao armazenamento de sessão:

```js
session.put('username', 'virk')
```

#### `get(key, [defaultValue])`
Retorne o valor para uma chave fornecida (aceita um valor padrão opcional):

```js
session.get('username')

// valor padrão
session.get('username', 'defaultName')
```

#### `all`
Obtenha tudo de volta como um objeto do armazenamento de sessão:

```js
session.all()
```

#### `increment(key, [steps])`
Incremente o valor para uma chave fornecida (garanta que o valor anterior seja um número):

```js
session.increment('counter')

// incremente por 5
session.increment('counter', 5)
```

#### `decrement(key, [steps])`
Decremente o valor para uma chave fornecida (garanta que o valor anterior seja um número):

```js
session.decrement('counter')

// decremente por 2
session.decrement('counter', 2)
```

#### `forget(key)`
Remove um par chave/valor do armazenamento de sessão:

```js
session.forget('username')
```

#### `pull(key, [defaultValue])`
Retorna (e então remove) um par chave/valor do armazenamento de sessão:

```js
const username = session.pull('username') // returns username

session.get('username') // null
```

#### `clear`
Esvazia o armazenamento de sessão:

```js
session.clear()
```

## Mensagens Flash
Mensagens Flash são valores de sessão de curta duração para uma única solicitação. Elas são usadas principalmente para *flash erros de formulário*, mas podem ser usadas para qualquer outra finalidade.

### Exemplo de formulário HTML

Digamos que queremos validar os dados enviados do usuário e redirecionar de volta para o nosso formulário se houver erros de validação.

Comece com o seguinte formulário HTML:

```edge
<form method="POST" action="/users">
  {{ csrfField() }}
  <input type="text" name="username" />
  <button type="submit">Submit</button>
</form>
```

Então, registre a rota `/users` para validar os dados do formulário:

```js
// .app/routes.js

const { validate } = use('Validator')

Route.post('users', ({ request, session, response }) => {
  const rules = { username: 'required' }
  const validation = await validate(request.all(), rules)

  if (validation.fails()) {
    session.withErrors(validation.messages()).flashAll()
    return response.redirect('back')
  }

  return 'Validation passed'
})
```

Finalmente, reescreva o formulário HTML para recuperar dados flash usando [view helpers](/docs/06-Digging-Deeper/05-Helpers.md):

```edge
<form method="POST" action="/users">
  {{ csrfField() }}
  <input type="text" name="username" value="{{ old('username', '') }}" />
  {{ getErrorFor('username') }}
  <button type="submit">Submit</button>
</form>
```

### Métodos Flash
Abaixo está uma lista de todos os métodos flash de sessão e seus usos de exemplo.

#### `flashAll`
Flash os dados do formulário de solicitação:

```js
session.flashAll()
```

#### `flashOnly`
Flash somente os campos selecionados:

```js
session.flashOnly(['username', 'email'])
```

#### `flashExcept`
Flash os dados do formulário de solicitação, exceto os campos selecionados:

```js
session.flashExcept(['password', 'csrf_token'])
```

#### `withErrors`
Flash com uma matriz de erros:

```js
session
  .withErrors([{ field: 'username', message: 'Error message' }])
  .flashAll()
```

#### `flash`
Flash um objeto personalizado:

```js
session.flash({ notification: 'You have been redirected back' })
```

### Auxiliares de exibição
Ao usar mensagens flash, você pode usar os seguintes auxiliares de exibição para ler valores do armazenamento de sessão flash.

#### `old(key, defaultValue)`
Retorna o valor para uma determinada chave do armazenamento flash:

```js
session.flashOnly(['username'])
```

```edge
<input type="text" name="username" value="{{ old('username', '') }}" />
```

#### `hasErrorFor(key)`
Retorna `true` se houver um erro para um determinado campo dentro do armazenamento flash:

```js
session
  .withErrors({ username: 'Username is required' })
  .flashAll()
```

```edge
@if(hasErrorFor('username'))
  // display error
@endif
```

#### `getErrorFor(key)`
Retorna a mensagem de erro para um determinado campo:

```js
session
  .withErrors({ username: 'Username is required' })
  .flashAll()
```

#### `flashMessage(key, defaultValue)`
Retorna a mensagem flash para uma determinada chave:

```js
session.flash({ notification: 'Update successful!' })
```

```edge
@if(flashMessage('notification'))
  <span>{{ flashMessage('notification') }}</span>
@endif
```

## Persistência de sessão
Os valores de sessão são persistidos em massa quando a solicitação termina. Isso mantém a solicitação/resposta performática, pois você pode alterar o armazenamento de sessão quantas vezes quiser e uma atualização em massa é realizada apenas no final.

Isso é obtido por meio do middleware AdonisJs (veja a implementação [aqui](https://github.com/adonisjs/adonis-session/blob/develop/src/Session/Middleware.js#L89)).

No entanto, há uma ressalva. Se uma exceção for lançada, a camada de middleware será interrompida e os valores de sessão nunca serão confirmados.

Os pacotes primários do AdonisJs lidam com isso graciosamente, mas você deve confirmar a sessão manualmente se estiver lidando com suas próprias exceções:

```js
const GE = require('@adonisjs/generic-exceptions')

class MyCustomException extends GE.LogicalException {
  handle (error, { session }) {
    await session.commit()
    // handle exception
  }
}
```
