# Hooks de Banco de Dados

Hooks são as ações que você realiza *antes* ou *depois* de uma operação especificada no banco de dados. Hooks desempenha um papel importante para manter seu código-fonte seco e fácil de raciocinar Por exemplo: *Hashing* a senha do usuário antes de salvá-la no banco de dados.

## Sobre ganchos

1. Os ganchos do modelo são definidos dentro do diretório "app/Model/Hooks".
2. Cada gancho de modelo é um método gerador ES2015, tornando mais simples executar o código assíncrono.
3. Você tem que definir ganchos em seus modelos explicitamente.
4. Como outros comandos geradores, você pode usar o "ace" para fazer um gancho para você.

```bash
    ./ace make:hook User

    # or with predefined method
    ./ace make:hook User --method=encryptPassword
    ```

5. Os ganchos são executados apenas para comandos executados via a instância do modelo. Por exemplo: chamar o método estático 'update' não executará os ganchos.

```js
    const user = yield User.find(1)
    user.status = 'active'
    // Will execute the update hooks
    yield user.save()

    // Will not execute the update hooks
    yield User.query().where('id', 1).update('status', 'active')
    ```

## Exemplo básico
Vamos pegar o exemplo mais básico de criptografar a senha do usuário usando um gancho de modelo.

```js
// app/Model/Hooks/User.js

const Hash = use('Hash')
const User = exports = module.exports = {}

User.encryptPassword = function * (next) {
  this.password = yield Hash.make(this.password)
  yield next
}
```

Em seguida, precisamos registrar este gancho no modelo *Usuário* manualmente.

```js
// app/Model/User.js

class User extends Lucid {

  static boot () { <1>
    super.boot()
    this.addHook('beforeCreate', 'User.encryptPassword') <2>
  }

}
```

1. Todos os ganchos devem ser registrados apenas uma vez e o método 'boot' é um ótimo lugar para isso, já que o Lucid garante que ele só seja executado uma vez.
2. O método `addHook` será o gancho para um determinado evento, que neste caso é `beforeCreate`.

## Definindo ganchos
Os ganchos são executados na sequência em que são registrados. Para executar o próximo gancho, você deve `yield next` do gancho existente. O processo é muito semelhante à camada de middleware HTTP.

#### addHook(evento, [nome], ação)
O método `addHook` irá definir um gancho para um determinado evento. Opcionalmente você pode dar-lhe um nome único, que pode ser usado posteriormente para remover o gancho.

```js
static boot () {
  super.boot()
  this.addHook('beforeCreate', 'User.encryptPassword')
}
```

E para ganchos nomeados

```js
static boot () {
  super.boot()
  this.addHook(
    'beforeCreate', <1>
    'encryptingPassword', <2>
    'User.encryptPassword' <3>
  )
}
```

1. Gancho de evento
2. Nome único
3. Ação a ser executada. A ação pode ser uma referência a um método JavaScript plano ou um namespace a ser resolvido pelo contêiner IoC.

#### defineHooks(evento, arrayDeAções)
O método `defineHooks` é muito semelhante ao método `addHook`, a diferença é que você pode definir vários ganchos de uma só vez.

```js
class User extends Lucid {

  static boot () {
    super.boot()
    this.defineHooks('beforeCreate', ['UserHooks.validate', 'UserHook.encryptPassword'])
  }

}
```

#### removeHook(nome)
Como mencionado anteriormente, você também pode remover *ganchos nomeados* a qualquer momento durante o seu aplicativo.

```js
User.removeHook('encryptingPassword')
```

## Abortindo Operações de Banco de Dados
Os ganchos têm a capacidade de abortar as operações do banco de dados ao lançar exceções.

```js
// app/Model/Hooks/User.js

UserHook.validate = function * (next) {
  if (!this.username) {
    throw new Error('Username is required')
  }
  yield next
}
```

## Hooks Eventos
Abaixo está a lista de eventos gancho.

| Evento | Descrição |
|-------|-------------|
| antesCriar | Antes de um novo registro ser criado. |
| beforeUpdate | Antes que um registro existente seja atualizado. |
| beforeDelete | Antes de apagar um registro dado. |
| antesRestaurar | Este evento é acionado somente quando você habilitou [excluições suaves](/lucid/lucid#delete) e está restaurando um registro previamente excluído. |
| afterCreate | Depois que um novo registro for criado com sucesso. |
| afterUpdate | Depois que um registro existente tiver sido atualizado. |
| afterDelete | Depois que um registro for excluído com sucesso. |
| afterRestore | Após um registro excluído suavemente ter sido restaurado. |
