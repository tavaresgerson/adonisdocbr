# Validator

O AdonisJs simplifica a validação da entrada do usuário com a ajuda de um provedor de validação dedicado.

Neste guia, você aprende como validar dados manualmente ou por meio de validadores de rota.

> A validação de AdonisJ usa [Indicative](http://indicative.adonisjs.com/) sob o capô. Para detalhes completos sobre o uso, consulte a documentação indicativa oficial.


## Configuração
Siga as instruções abaixo para configurar o provedor de validação.

Primeiro, execute o comando `adonis` para baixar o provedor do validador:

```
> adonis install @adonisjs/validator
```

Em seguida, registre o provedor validador dentro do arquivo `start/app.js`:

``` js
const providers = [
  '@adonisjs/validator/providers/ValidatorProvider'
]
```

## Validando entrada do usuário
Vamos começar com o exemplo de validação de entrada do usuário recebida via formulário HTML:

``` html
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

Registre a rota e o controlador para manipular o envio do formulário e use o validador para validar os dados:

``` js
Route.post('users', 'UserController.store')
```

``` js
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

* Definimos nosso esquema `rules`.
* Usamos o método `validate` para validar todos os dados da solicitação de acordo com nossas regras.
* Se a validação falhar, exibimos todos os erros e redirecionamos de volta para o nosso formulário.

### Mostrando erros de flash
Podemos modificar o formulário HTML para exibir nossas mensagens em flash, definidas quando a validação falha:

``` html
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

## Métodos validadores
Abaixo está a lista de métodos disponíveis.

### validate (dados, regras, [mensagens], [formatador])
Valide dados com regras definidas:

```
const { validate } = use('Validator')

const validation = await validate(data, rules)

if (validation.fails()) {
  return validation.messages()
}
```
> Opcionalmente, você pode transmitir [mensagens de erro personalizadas](http://indicative.adonisjs.com/docs/custom-messages) para retornar quando sua 
> validação falhar como seu terceiro parâmetro de método.

### validateAll (dados, regras, [mensagens], [formatador])
O mesmo que `validate` mas, continua a validar todos os campos, enquanto o método `validate` para no primeiro erro:

``` js
const { validateAll } = use('Validator')
const validation = await validateAll(data, rules)
```

### sanitize (dados, regras)
Este método retorna um novo objeto com dados higienizados:

``` js
const { sanitize } = use('Validator')
const data = sanitize(request.all(), rules)
``` 

### sanitizor
Retorna uma referência ao [sanitizador](http://indicative.adonisjs.com/docs/api/extend#_adding_sanitization_rules) indicative:

``` js
const { sanitizor } = use('Validator')
const slug = sanitizor.slug('My first blog post')
```

### formatters
Retorna uma referência aos [formatadores](http://indicative.adonisjs.com/docs/formatters) do indicative:

``` js
const { formatters } = use('Validator')
validate(data, rules, messages, formatters.JsonApi)
```

## Validador de rota
A validação de dados normalmente ocorre durante o ciclo de vida da solicitação/resposta HTTP e você pode escrever o 
mesmo código de validação dentro de cada controlador.

Os Validadores de Rota da AdonisJs podem simplificar o processo repetitivo de validação:

``` js
// Para uma única rota
Route
  .post('users', 'UserController.store')
  .validator('StoreUser')

// Para um recurso de rota
Route
  .resource('users', 'UserController')
  .validator(new Map([
    [['users.store'], ['StoreUser']],
    [['users.update'], ['UpdateUser']]
  ]))
```

> Os validadores vivem dentro do diretório `app/Validators`.

Vamos criar um validador `StoreUser` usando o comando `adonis`:

```
> adonis make:validator StoreUser
```
Saída
```
create: app/Validators/StoreUser.js
```
Agora, tudo o que precisamos fazer é definir nossas regras no validador:
``` js
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

Se a validação falhar, o validador define automaticamente os erros como mensagens flash e redireciona o usuário 
de volta ao formulário.

Se a solicitação tiver um cabeçalho `Accept: application/json`, a resposta será enviada de volta como JSON.

### Mensagens de erro personalizadas
As mensagens de erro padrão podem ser confusas para o usuário final, portanto, você pode criar suas próprias mensagens de 
erro de validação personalizadas.

O AdonisJs fornece uma maneira fácil de fazer isso.

Simplesmente declare um método `messages` no seu validador de rota e retorne um objeto com suas mensagens por regra, assim:

``` js
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

``` js
'use strict'

class StoreUser {
  get validateAll () {
    return true
  }
}

module.exports = StoreUser
```

### Limpando a entrada do usuário

Você pode limpar a entrada do usuário, definindo `sanitizationRules` que são executados nos dados da solicitação antes 
que a validação ocorra:

``` js
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

### Manipulando Falha na Validação
Como todo aplicativo é estruturado de maneira diferente, há momentos em que o tratamento automático de falhas pode 
ser indesejável.

Você pode manipular falhas manualmente adicionando um método `fails` ao seu validador:

``` js
class StoreUser {
  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = StoreUser
```

### Objeto de dados customizado
Convém validar propriedades customizadas que não fazem parte do corpo da solicitação (por exemplo, cabeçalhos).

Isso pode ser feito definindo uma propriedade `data` na sua classe de validador:

``` js
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
Você também pode definir o [formatador](http://indicative.adonisjs.com/docs/formatters#_available_formatters) indicative como uma propriedade na classe validadora:

``` js
const { formatters } = use('Validator')

class StoreUser {
  get formatter () {
    return formatters.JsonApi
  }
}
```

### Autorização
Você pode querer executar verificações para garantir que o usuário esteja autorizado a executar a ação desejada.

Isso pode ser feito definindo um método `authorize` na sua classe de validador:

``` js
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

> Retorne a booleano do método `authorize` para informar ao validador se deve ou não encaminhar a solicitação ao controlador.

### Contexto da solicitação
Todos os validadores de rota podem acessar o contexto de solicitação atual via `this.ctx`.

#### Regras personalizadas
O AdonisJs suporta todas as validações do [indicative](https://indicative.adonisjs.com/), mas também adiciona algumas regras personalizadas.

Abaixo está a lista de regras personalizadas do AdonisJs.

##### unique (tableName, [fieldName], [ignoreField], [ignoreValue])
Garante que um determinado valor seja exclusivo para uma determinada tabela de banco de dados:

``` js
'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'unique:users,email'
    }
  }
}
```

Ao atualizar um perfil de usuário existente, não faz sentido verificar o endereço de email ao impor a regra `unique`. 
Isso pode ser feito definindo um `ignoreField (id)` e `ignoreValue (userId)`:

``` js
class StoreUser {
  get rules () {
    const userId = this.ctx.params.id

    return {
      email: `unique:users,email,id,${userId}`
    }
  }
}
```

### Estendendo o Validador
Como um exemplo de como estender os AdonisJs `Validator`, vamos adicionar uma nova regra para garantir a existência de uma 
postagem ao adicionar um novo comentário ao banco de dados.

Vamos chamar esta regra `exists`:

``` js
const Validator = use('Validator')
const Database = use('Database')

const existsFn = async (data, field, message, args, get) => {
  const value = get(data, field)
  if (!value) {
    /**
     * pule a validação se o valor não estiver definido. 
     * A regra `required` deve cuidar disso.
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

``` js
get rules () {
  return {
    post_id: 'exists:posts,id'
  }
}
```

> Como o código a ser estendido `Validator` precisa ser executado apenas uma vez, você pode usar [provedores](https://adonisjs.com/docs/4.1/service-providers) ou 
> ganchos do [Ignitor](https://adonisjs.com/docs/4.1/ignitor) para fazer isso. Leia [Estendendo o núcleo](https://adonisjs.com/docs/4.1/extending-adonisjs) para obter mais informações.
