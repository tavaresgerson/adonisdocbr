# Hooks

Ganchos são ações executadas antes ou depois dos [eventos de ciclo de vida do banco de dados](https://adonisjs.com/docs/4.1/database-hooks#_lifecycle_events).

O uso de ganchos no modelo ajuda a manter a sua base de código [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), 
fornecendo injeção conveniente de código de ciclo de vida de onde seus ganchos estão definidos.

Um exemplo de gancho clássico é o [hash](https://adonisjs.com/docs/4.1/encryption-and-hashing#_hashing_values) da senha do 
usuário antes de salvar o usuário em um banco de dados.

## Definindo ganchos

Ganchos podem ser definidos em um arquivo de classe de modelo por meio de um 
fechamento ou fazendo referência a qualquer `file.method` manipulador no `app/Models/Hooksdiretório`

### Closure obrigatório

``` js
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

No exemplo acima, a closure `beforeCreate` é executado ao criar um modelo `User` para garantir que a 
senha do usuário seja criptografada antes de ser salva.

## Arquivo Hook
AdonisJs possui um diretório `app/Models/Hooks` dedicado para armazenar hooks de modelo.

Use o comando `make:hook` para criar um arquivo de hook:
```
> adonis make:hook User
```

Saída:
```
✔ create  app/Models/Hooks/UserHook.js
```

Abra o novo arquivo `UserHook.js` e cole no código abaixo:
``` js
'use strict'

const Hash = use('Hash')

const UserHook = exports = module.exports = {}

UserHook.hashPassword = async (user) => {
  user.password = await Hash.make(user.password)
}
```

Com um hook `file.method` definido, podemos remover o fechamento embutido do exemplo anterior e, 
em vez disso, referenciar o arquivo e o método do hook da seguinte maneira:
``` js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'UserHook.hashPassword')
  }
}

module.exports = User
```

## Interrompendo operações de banco de dados
Ganchos podem abortar operações do banco de dados lançando exceções:
``` js
UserHook.validate = async (user) => {
  if (!user.username) {
    throw new Error('Username is required')
  }
}
```
Com um gancho `file.method` definido, podemos remover o fechamento embutido do exemplo 
anterior e, em vez disso, referenciar o arquivo e o método do gancho da seguinte maneira:

``` js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'UserHook.hashPassword')
  }
}

module.exports = User
```

## Interrompendo operações de banco de dados

Ganchos podem abortar operações do banco de dados lançando exceções:

``` js
UserHook.validate = async (user) => {
  if (!user.username) {
    throw new Error('Username is required')
  }
}
```

## Eventos do ciclo de vida
Abaixo está a lista de eventos do ciclo de vida do banco de dados disponíveis para conectar:

| Evento                            | Descrição                                                 |
|-----------------------------------|-----------------------------------------------------------|
| beforeCreate                      | Antes de criar um novo registro.                          |
| afterCreate                       | Depois que um novo registro é criado.                     |
| beforeUpdate                      | Antes de atualizar um registro.                           |
| afterUpdate                       | Depois que um registro foi atualizado.                    |
| beforeSave                        | Antes de criar ou atualizar um novo registro.             |
| afterSave                         | Depois que um novo registro foi criado ou atualizado.     |
| beforeDelete                      | Antes de remover um registro.                             |
| afterDelete                       | Depois que um registro é removido.                        |
| afterFind                         | Depois que um único registro é buscado no banco de dados. |
| afterFetch                        | Depois que o fetchmétodo é executado. O método hook recebe uma matriz de instâncias do modelo. |
| afterPaginate                     | Depois que o paginatemétodo é executado. O método hook recebe dois argumentos: uma matriz de instâncias do modelo e os metadados da paginação. |
                                      
