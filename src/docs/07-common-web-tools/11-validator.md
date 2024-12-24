# Validação

Validar dados do usuário é um requisito essencial para qualquer aplicativo. O AdonisJs usa [Indicative](http://indicative.adonisjs.com/) para higienizar e validar entradas do usuário. Ele suporta todas as regras de validação do indicative, então certifique-se de verificar a documentação do indicative.

## Configuração
O validador não faz parte da instalação base e, portanto, você precisa instalá-lo e registrá-lo manualmente.

```bash
# Instalando a partir do Npm

npm i --save adonis-validation-provider
```

```js
// bootstrap/app.js

const providers = [
  // ...
  'adonis-validation-provider/providers/ValidatorProvider'
  // ...
]
```

```js
// bootstrap/app.js

const aliases = {
  // ...
  Validator: 'Adonis/Addons/Validator'
  // ...
}
```

## Exemplo básico
Vamos pegar o exemplo mais básico de validação de um formulário para criar um usuário. Por enquanto, executaremos todas as validações dentro do controlador, mas você está livre para organizá-las em serviços separados.

Vamos começar definindo as regras no modelo Usuário. Certifique-se também de verificar os documentos indicativos sobre [regras de esquema](http://indicative.adonisjs.com/#indicative-schema-rules).

```js
// app/Model/User

'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  static get rules () { <1>
    return {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required|confirmed',
    }
  }
}
```

```js
// app/Http/Controllers/UsersController.js

'use strict'

const Validator = use('Validator')
const User = use('App/Model/User')

class UsersController {

  * store(request, response) {
    const userData = request.all()
    const validation = yield Validator.validate(userData, User.rules)  <2>

    if (validation.fails()) { <3>
      response.json(validation.messages()) <4>
      return
    }

    // Validação aprovada, crie o usuário.
  }

}
```

1. Começamos definindo as regras dentro do *Modelo de Usuário*.
2. Em seguida, validamos os dados do usuário da solicitação em relação às regras definidas anteriormente.
3. `validation.fails()` retorna true, se a validação falhou.
4. `validation.messages()` retornará todas as mensagens de erro como uma matriz.

## Métodos do Validador
Abaixo está a lista de métodos expostos pelo Provedor de Validação.

#### `validate(data, rules, [messages])`
Valida os dados do usuário em relação às regras definidas e retorna assim que a primeira validação falhar.

```js
const validation = yield Validator.validate(data, rules, messages)
```

#### `validateAll(data, rules, [messages])`
O mesmo que `validate`, mas continua até a última validação e retorna várias mensagens de erro.

```js
const validation = yield Validator.validateAll(data, rules, messages)
```

#### `fail()`
Retorna um booleano indicando se a validação falhou ou não.

```js
const validation = yield Validator.validate(data, rules, messages)
if (validation.fails ()) {
  // validação falhou
}
```

#### `messages`
Retorna uma matriz de mensagens de erro de validação

```js
const validation = yield Validator.validate(data, rules, messages)
if (validation.fails ()) {
  response.send({error: validation.messages()})
}
```

#### `sanitize(data, rules)`
Saneie os dados do usuário. Certifique-se também de verificar a documentação [sanitization](/docs/09-security/06-data-sanitization.md) para obter mais informações.

```js
const data = request.all()
const rules = {
  email: 'normalize_email',
  bio: 'strip_links',
  fullname: 'capitalize'
}

const sanitizedData = Validator.sanitize(data, rules)
```

#### `is`
Você pode usar o método is para fazer validações em linha em vez de passar por um ciclo de vida de validação completo.

```js
if (Validator.is.email('foo')) {
  // ...
}
```

#### sanitizor
Assim como `is`, você pode fazer a sanitização de dados em linha.

```js
const sanitizedEmail = Validator
  .sanitizor
  .normalizeEmail('bar.sneaky+foo@googlemail.com')

// retorna barsneaky@gmail.com
```

## Regras personalizadas
O AdonisJs suporta todas as regras de validação por Indicative, mas também adiciona algumas que são específicas apenas para o AdonisJs. Abaixo está a lista de regras personalizadas.

#### `unique(tableName, [fieldName])`
Garante que um determinado valor seja exclusivo em uma determinada tabela de banco de dados.

```js
// app/Model/User

'use strict'

class User extends Lucid {

  static get rules () {
    return {
      email: 'unique:users,email'
    }
  }

}
```

Agora, ao tentar atualizar um usuário, você nunca desejará executar a validação exclusiva para o mesmo usuário. O mesmo pode ser alcançado definindo uma cláusula `whereNot`.

```js
// app/Model/User

'use strict'

class User extends Lucid {

  static rules (userId) {
    return {
      email: `unique:users,email,id,${userId}`
    }
  }

}
```

Dentro do seu controlador, você pode fazer

```js
// app/Http/Controllers/UsersController

'use strict'

const User = use('App/Model/User')

class UsersController {

  * update (request, response) {
    const userId = request.param('id')

    const rules = User.rules(userId) <1>
    const validation = yield Validator.validate(request.all(), rules)
  }

}
```

1. Ao buscar as regras do *Modelo de Usuário*, passamos o ID do usuário que é ignorado ao verificar a exclusividade do e-mail.

## Estendendo o Validador
Muitas vezes você tem o requisito de estender o *Provedor do Validador* adicionando novas regras de validação. Você pode usar o método `extend` fornecido por [Indicative](http://indicative.adonisjs.com/#indicative-extending).

#### Específico do Aplicativo
Para regras específicas do aplicativo, você pode usar o arquivo `app/Listeners/Http.js` para ouvir o evento *start* e sua regra personalizada.

```js
// app/Listeners/Http.js

Http.onStart = function () {

  const Validator = use('Adonis/Addons/Validator')
  Validator.extend('adult', (data, field, message, args, get) => {

    return new Promise((resolve, reject) => {
      const fieldValue = get(data, field)
      if (fieldValue > 18) {
        resolve('Allowed')
        return
      }
      reject(message)
    })

  }, 'You must be an adult')

}
```

#### Via Provider
Se você estiver escrevendo um módulo/addon para AdonisJs, você pode adicionar suas regras personalizadas dentro do método `boot` do seu provedor de serviços.

```js
const ServiceProvider = require('adonis-fold').ServiceProvider

class MyServiceProvider extends ServiceProvider {

  _adultValidation (data, field, message, args, get) {

    return new Promise((resolve, reject) => {
      const fieldValue = get(data, field)
      if (fieldValue > 18) {
        resolve('Allowed')
        return
      }
      reject(message)
    })

  }

  boot () {
    const Validator = use('Adonis/Addons/Validator')
    Validator.extend('adult', this._adultValidation, 'You must be an adult')
  }

  * register () {
    // register bindings
  }

}
```

Você pode fazer uso do `adult` definido acima como qualquer outra regra de validação.
