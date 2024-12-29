# Validador

O AdonisJs simplifica a validação da entrada do usuário com a ajuda de um provedor de validação dedicado.

Neste guia, você aprenderá como validar dados *manualmente* ou por meio de *validadores de rota*.

::: warning NOTA
A validação do AdonisJs usa [Indicative](https://indicative-v5.adonisjs.com) por baixo dos panos. Para obter detalhes completos sobre o uso, consulte a [documentação](https://indicative-v5.adonisjs.com) oficial do Indicative.
:::

## Configuração
Siga as instruções abaixo para configurar o provedor de validação.

Primeiro, execute o comando `adonis` para baixar o provedor validador:

```bash
adonis install @adonisjs/validator
```

Então, registre o provedor validador dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/validator/providers/ValidatorProvider'
]
```

## Validando a entrada do usuário
Vamos começar com o exemplo de validação da entrada do usuário recebida via formulário HTML:

```html
<form method="POST" action="{{ route('UserController.store') }}">
  <div>
    <input type="text" name="email" />
  </div>

  <div>
    <input type="text" name="password" />
  </div>

  <button type="submit"> Submit </button>
</form>
```

Registre a rota e o controlador para manipular o envio do formulário e usar o validador para validar os dados:

```js
// .start/routes.js

Route.post('users', 'UserController.store')
```

```js
const { validate } = use('Validator')

class UserController {

  async store ({ request, session, response }) {
    const rules = {
      email: 'required|email|unique:users,email',
      password: 'required'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    return 'Validation passed'
  }
}

module.exports = UserController
```

Vamos dividir o código do controlador acima em pequenas etapas:

1. Definimos nosso esquema `rules`.
2. Usamos o método `validate` para validar todos os dados da solicitação em relação às nossas regras.
3. Se a validação falhar, exibimos todos os erros e redirecionamos de volta para o nosso formulário.

### Exibindo erros de flash
Podemos modificar o formulário HTML para exibir nossas mensagens de flash, que são definidas quando a validação falha:

```edge
<form method="POST" action="{{ route('UserController.store') }}">
  <div>
    <input type="text" name="email" value="{{ old('email', '') }}" />
    {{ elIf('<span>$self</span>', getErrorFor('email'), hasErrorFor('email')) }}
  </div>

  <div>
    <input type="text" name="password" />
    {{ elIf('<span>$self</span>', getErrorFor('password'), hasErrorFor('password')) }}
  </div>

  <button type="submit"> Submit </button>
</form>
```

## Métodos de validação
Abaixo está a lista de métodos disponíveis.

#### `validate(data, rules, [messages], [formatter])`
Validar dados com regras definidas:

```js
const { validate } = use('Validator')

const validation = await validate(data, rules)

if (validation.fails()) {
  return validation.messages()
}
```

::: warning OBSERVAÇÃO
Você pode opcionalmente passar [mensagens de erro personalizadas](https://indicative-v5.adonisjs.com/docs/custom-messages) para retornar quando sua validação falhar como seu terceiro parâmetro de método.
:::

#### `validateAll(data, rules, [messages], [formatter])`
O mesmo que `validate`, mas continua a validar todos os campos, enquanto o método `validate` para no primeiro erro:

```js
const { validateAll } = use('Validator')
const validation = await validateAll(data, rules)
```

#### `sanitize(data, rules)`
Este método retorna um novo objeto com dados higienizados:

```js
const { sanitize } = use('Validator')
const data = sanitize(request.all(), rules)
```

#### `sanitizor`
Retorna uma referência ao [sanitizor](https://indicative-v5.adonisjs.com/docs/api/extend#_adding_sanitization_rules) do Indicative:

```js
const { sanitizor } = use('Validator')
const slug = sanitizor.slug('My first blog post')
```

#### `formatters`
Retorna uma referência ao [formatters](https://indicative-v5.adonisjs.com/docs/formatters):

```js
const { formatters } = use('Validator')
validate(data, rules, messages, formatters.JsonApi)
```

## Validador de rota
A validação de dados normalmente ocorre durante o ciclo de vida de solicitação/resposta HTTP, e você pode acabar escrevendo o mesmo código de validação dentro de cada controlador.

Os **Validadores de Rota** do AdonisJs podem tornar o processo repetitivo de validação mais simples:

```js
// For a single route
Route
  .post('users', 'UserController.store')
  .validator('StoreUser')

// For a resourceful route
Route
  .resource('users', 'UserController')
  .validator(new Map([
    [['users.store'], ['StoreUser']],
    [['users.update'], ['UpdateUser']]
  ]))
```

::: warning OBSERVAÇÃO
Os validadores ficam dentro do diretório `app/Validators`.
:::

Vamos criar um validador `StoreUser` usando o comando `adonis`:

```bash
adonis make:validator StoreUser
```

```bash
.make:validator output

create: app/Validators/StoreUser.js
```

Agora, tudo o que precisamos fazer é definir nossas regras no validador:

```js
// .app/Validators/StoreUser.js

'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required'
    }
  }
}

module.exports = StoreUser
```

Se a validação falhar, o validador define automaticamente os erros como mensagens flash e redireciona o usuário de volta ao formulário.

::: warning OBSERVAÇÃO
Se a solicitação tiver um cabeçalho `Accept: application/json`, a resposta será enviada de volta como JSON.
:::

### Mensagens de erro personalizadas
Mensagens de erro padrão podem ser confusas para o usuário final, então você pode querer criar suas próprias mensagens de erro de validação personalizadas.

O AdonisJs fornece uma maneira fácil de fazer isso.

Basta declarar um método `messages` no seu validador de rota e retornar um objeto com suas mensagens por regra, assim:

```js
// .app/Validators/StoreUser.js

'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required'
    }
  }

  get messages () {
    return {
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password'
    }
  }
}

module.exports = StoreUser
```

### Validar tudo
Para validar todos os campos, defina `validateAll` como true no protótipo de classe:

```js
// .app/Validators/StoreUser.js

'use strict'

class StoreUser {
  get validateAll () {
    return true
  }
}

module.exports = StoreUser
```

### Sanitizando a entrada do usuário
Você pode sanitizar a entrada do usuário definindo `sanitizationRules`, que são executadas em dados de solicitação antes que a validação ocorra:

```js
// .app/Validators/StoreUser.js

class StoreUser {
  get sanitizationRules () {
    return {
      email: 'normalize_email',
      age: 'to_int'
    }
  }
}

module.exports = StoreUser
```

### Lidando com falha de validação
Como cada aplicativo é estruturado de forma diferente, há momentos em que o tratamento automático de falhas pode ser indesejável.

Você pode manipular manualmente as falhas adicionando um método `fails` ao seu validador:

```js
// .app/Validators/StoreUser.js

class StoreUser {
  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = StoreUser
```

### Objeto de dados personalizado
Você pode querer validar propriedades personalizadas que não fazem parte do corpo da solicitação (por exemplo, cabeçalhos).

Isso pode ser feito definindo uma propriedade `data` na sua classe validadora:

```js
// .app/Validators/StoreUser.js

class StoreUser {
  get rules () {
    return {
      sessionId: 'required'
    }
  }

  get data () {
    const requestBody = this.ctx.request.all()
    const sessionId = this.ctx.request.header('X-Session-Id')

    return Object.assign({}, requestBody, { sessionId })
  }
}

module.exports = StoreUser
```

### Formatador
Você também pode definir o [Formatador indicativo](https://indicative-v5.adonisjs.com/docs/formatters#_available_formatters) como uma propriedade na classe validadora:

```js
const { formatters } = use('Validator')

class StoreUser {
  get formatter () {
    return formatters.JsonApi
  }
}
```

### Autorização
Você pode querer executar verificações para garantir que o usuário esteja autorizado a executar a ação desejada.

Isso pode ser feito definindo um método `authorize` na sua classe validadora:

```js
class StoreUser {
  async authorize () {
    if (!isAdmin) {
      this.ctx.response.unauthorized('Not authorized')
      return false
    }

    return true
  }
}

module.exports = StoreUser
```

::: warning NOTA
Retorne um `booleano` do método `authorize` para informar ao validador se deve ou não encaminhar a solicitação ao controlador.
:::

### Contexto da solicitação
Todos os validadores de rota podem acessar o contexto da solicitação atual por meio de `this.ctx`.

## Regras personalizadas
O AdonisJs suporta todas as validações [Indicative](https://indicative-v5.adonisjs.com), mas também adiciona algumas regras personalizadas.

Abaixo está a lista de regras personalizadas do AdonisJs.

#### `unique(tableName, [fieldName], [ignoreField], [ignoreValue])`
Garante que um determinado valor seja exclusivo para uma determinada tabela de banco de dados:

```js
'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'unique:users,email'
    }
  }
}
```

Ao atualizar um perfil de usuário existente, não há sentido em verificar seu endereço de e-mail ao aplicar a regra `unique`. Isso pode ser feito definindo um `ignoreField (id)` e `ignoreValue (userId)`:

```js
class StoreUser {
  get rules () {
    const userId = this.ctx.params.id

    return {
      email: `unique:users,email,id,${userId}`
    }
  }
}
```

## Estendendo o Validador
Como um exemplo de como estender o `Validador` do AdonisJs, vamos adicionar uma nova regra para garantir que um *post* exista ao adicionar um novo *comentário* ao banco de dados.

Chamaremos essa regra de `exists`:

```js
const Validator = use('Validator')
const Database = use('Database')

const existsFn = async (data, field, message, args, get) => {
  const value = get(data, field)
  if (!value) {
    /**
     * skip validation if value is not defined. `required` rule
     * should take care of it.
    */
    return
  }

  const [table, column] = args
  const row = await Database.table(table).where(column, value).first()

  if (!row) {
    throw message
  }
}

Validator.extend('exists', existsFn)
```

Podemos usar nossa nova regra `exists` assim:

```js
get rules () {
  return {
    post_id: 'exists:posts,id'
  }
}
```

::: warning NOTA
Como o código para estender `Validator` precisa ser executado apenas uma vez, você pode usar [providers](/docs/02-Concept/03-service-providers.md) ou [Ignitor hooks](/docs/02-Concept/05-ignitor.md) para fazer isso. Leia [Extending the Core](/docs/06-Digging-Deeper/03-Extending-the-Core.md) para obter mais informações.
:::
