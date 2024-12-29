# Hooks

*Hooks* são ações executadas antes ou depois dos [eventos do ciclo de vida](/docs/02-Concept/01-Request-Lifecycle.md) do banco de dados.

Usar hooks de modelo ajuda a manter sua base de código [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), fornecendo injeção de código de ciclo de vida conveniente de onde quer que seus hooks sejam definidos.

Um exemplo clássico de hook é [hashing](/docs/05-Security/06-Encryption.md#hashing-values) a senha do usuário antes de salvá-lo em um banco de dados.

## Definindo Hooks
Hooks podem ser definidos em um arquivo de classe de modelo por meio de um fechamento ou referenciando qualquer manipulador `file.method` no diretório `app/Models/Hooks`.

### Encerramento de Vinculação
```js
const Model = use('Model')
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (userInstance) => {
      userInstance.password = await Hash.make(userInstance.password)
    })
  }
}

module.exports = User
```

### Gancho Dentro de Transações
Para usar ganchos dentro de [transações](/docs/08-Lucid-ORM/01-Getting-Started.md#transactions) basta adicionar o segundo parâmetro `trx` no fechamento de gancho

```js
const Model = use('Model')
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (userInstance, trx) => {
      // here you can use transaction object `trx`
    })
  }
}

module.exports = User
```

No exemplo acima, o fechamento `beforeCreate` é executado ao criar um modelo `User` para garantir que a senha do usuário seja criptografada antes de ser salva.

### Arquivo de Gancho
O AdonisJs tem um diretório `app/Models/Hooks` dedicado para armazenar ganchos de modelo.

Use o comando `make:hook` para criar um arquivo de hook:

```bash
adonis make:hook User
```

```bash
# .Output

✔ create  app/Models/Hooks/UserHook.js
```

Abra o novo arquivo `UserHook.js` e cole o código abaixo:

```js
// .app/Models/Hooks/UserHook.js

'use strict'

const Hash = use('Hash')

const UserHook = exports = module.exports = {}

UserHook.hashPassword = async (user) => {
  user.password = await Hash.make(user.password)
}
```

Com um hook `file.method` definido, podemos remover o fechamento em linha do nosso [exemplo anterior](#binding-closure) e, em vez disso, referenciar o arquivo de hook e o método como:

```js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'UserHook.hashPassword')
  }
}

module.exports = User
```

## Abortando operações de banco de dados
Os hooks podem abortar operações de banco de dados lançando exceções:

```js
// .app/Models/Hooks/UserHook.js

UserHook.validate = async (user) => {
  if (!user.username) {
    throw new Error('Username is required')
  }
}
```

## Eventos do ciclo de vida
Abaixo está a lista de eventos do ciclo de vida do banco de dados disponíveis para conectar:

| Evento          | Descrição                                                                                     |
|-----------------|-----------------------------------------------------------------------------------------------|
| `beforeCreate`  | Antes de criar um novo registro.                                                              |
| `afterCreate`   | Após um novo registro ser criado.                                                             |
| `beforeUpdate`  | Antes de atualizar um registro.                                                               |
| `afterUpdate`   | Após um registro ter sido atualizado.                                                         |
| `beforeSave`    | Antes de *criar ou atualizar* um novo registro.                                               |
| `afterSave`     | Após um novo registro ter sido *criado ou atualizado*.                                        |
| `beforeDelete`  | Antes de remover um registro.                                                                 |
| `afterDelete`   | Após um registro ser removido.                                                                |
| `afterFind`     | Após um único registro ser buscado do banco de dados.                                         |
| `afterFetch`    | Após o método `fetch` ser executado. O método hook recebe uma matriz de instâncias de modelo. |
| `afterPaginate` | Após o método `paginate` ser executado. O método hook recebe dois argumentos: uma matriz de instâncias de modelo e os metadados de paginação.|
