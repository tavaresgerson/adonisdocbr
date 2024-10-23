# Validação

A validação de dados do usuário é um requisito essencial para qualquer aplicação. O AdonisJs utiliza o [Indicative](http://indicative.adonisjs.com/) para sanitizar e validar as entradas do usuário. Ele suporta todas as regras de validação do Indicative, então certifique-se de verificar a documentação do Indicative.

## Configuração
O validador não faz parte da instalação básica e, portanto, você precisa instalá-lo e registrá-lo manualmente.

```bash
# Installing From Npm

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
Vamos pegar o exemplo mais básico de validar um formulário para criar um usuário. Por enquanto, vamos realizar todas as validações dentro do controlador, mas você está livre para organizá-las em serviços separados.

Vamos começar definindo as regras do modelo de usuário. Certifique-se também de conferir a documentação indicativa sobre [regras de esquema](http://indicative.adonisjs.com/#indicative-schema-rules).

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

    // Validation passed, create the user.
  }

}
```

1. Começamos definindo as regras dentro do *Modelo de Usuário*.
2. Em seguida validamos os dados do usuário da requisição contra as regras previamente definidas.
3. O método `validation.fails()` retorna verdadeiro se a validação falhar.
4. O método `validation.messages()` retornará todos os erros como uma matriz.

## Métodos de Validação
Abaixo está a lista de métodos expostos pelo Provedor de Validação.

#### validate(data, regras, [mensagens])
Valide os dados do usuário contra regras definidas e retorne assim que a primeira validação falhar.

```js
const validation = yield Validator.validate(data, rules, messages)
```

#### validateAll(dados, regras, [mensagens])
Igual ao `validate`, mas em vez de continuar até a última validação e retornar múltiplas mensagens de erro.

```js
const validation = yield Validator.validateAll(data, rules, messages)
```

#### falha()
Retorna um valor booleano indicando se a validação foi bem sucedida ou não.

```js
const validation = yield Validator.validate(data, rules, messages)
if (validation.fails ()) {
  // validation failed
}
```

#### Mensagens
Retorna uma matriz de mensagens de erro de validação

```js
const validation = yield Validator.validate(data, rules, messages)
if (validation.fails ()) {
  response.send({error: validation.messages()})
}
```

#### sanitize(dados, regras)
Sanitizar dados do usuário. Também verifique a documentação [sanitization] para mais informações.

```js
const data = request.all()
const rules = {
  email: 'normalize_email',
  bio: 'strip_links',
  fullname: 'capitalize'
}

const sanitizedData = Validator.sanitize(data, rules)
```

#### é
Você pode usar esse método para fazer validações inline em vez de passar por todo o ciclo de vida da validação.

```js
if (Validator.is.email('foo')) {
  // ...
}
```

#### sanitizador
Igual ao comando `is`, você pode fazer a sanitização de dados embutida.

```js
const sanitizedEmail = Validator
  .sanitizor
  .normalizeEmail('bar.sneaky+foo@googlemail.com')

// returns barsneaky@gmail.com
```

## Regras Personalizadas
AdonisJs suporta todas as regras de validação por Indicative, mas também adiciona algumas que são específicas apenas para AdonisJs. Abaixo está a lista das regras personalizadas.

#### unique(tableName, [fieldName])
Garanta que um determinado valor seja único em uma determinada tabela de banco de dados.

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

Agora, quando tentar atualizar um usuário, você nunca quer executar a validação única para o mesmo usuário. Isso pode ser alcançado definindo uma cláusula "whereNot".

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

1. Ao buscar as regras do *Modelo de Usuário*, passamos o ID do usuário, que é ignorado ao verificar a unicidade do e-mail.

## Extendendo o Validador
Muitas vezes você tem a necessidade de estender o *Validator Provider* adicionando novas regras de validação. Você pode usar o método `extend` fornecido pelo [Indicative](http://indicative.adonisjs.com/#indicative-extending).

#### Aplicativo Específico
Para regras específicas de aplicação você pode usar o arquivo `app/Listeners/Http.js` para escutar o evento *start* e sua regra personalizada.

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

#### Via Provedor
Se você estiver escrevendo um módulo/addon para o AdonisJS, você pode adicionar suas regras personalizadas dentro do método "boot" de seu provedor de serviços.

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

Você pode usar o acima definido 'adulto' como qualquer outra regra de validação.
