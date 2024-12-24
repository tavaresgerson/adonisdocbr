# Hooks de banco de dados

Ganchos são as ações que você executa *antes* ou *depois* de uma operação de banco de dados especificada. Ganchos desempenham um papel importante em manter sua base de código SECA e fácil de raciocinar. Por exemplo: *Hashing* da senha do usuário antes de salvá-la no banco de dados.

## Sobre ganchos

1. Ganchos de modelo são definidos dentro do diretório `app/Model/Hooks`.
2. Cada gancho de modelo é um método gerador *ES2015*, tornando mais simples executar o código assíncrono.
3. Você tem que definir ganchos em seus modelos explicitamente.
4. Como outros comandos geradores, você pode usar ace para fazer um gancho para você.
    ```bash
    ./ace make:hook User

    # or with predefined method
    ./ace make:hook User --method=encryptPassword
    ```
5. Ganchos são executados apenas para comandos executados por meio da instância do modelo. Por exemplo: Chamar o método estático `update` não executará os ganchos.
    ```js
    const user = yield User.find(1)

    user.status = 'active'
    // Executará os ganchos de atualização
    yield user.save()

    // Não executará os ganchos de atualização
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

Em seguida, precisamos registrar este gancho no *modelo de usuário* manualmente.

```js
// app/Model/User.js

class User extends Lucid {

  static boot () { <1>
    super.boot()
    this.addHook('beforeCreate', 'User.encryptPassword') <2>
  }

}
```

1. Todos os ganchos devem ser registrados apenas uma vez e o método `boot` é o lugar perfeito, pois o Lucid garante que ele seja executado apenas uma vez.
2. O método `addHook` estará antes do gancho para um determinado evento que é `beforeCreate` neste caso.

## Definindo ganchos
Os ganchos são executados na sequência em que são registrados. Para executar o próximo gancho, você deve `yield next` do gancho existente. O processo é bastante semelhante à camada de middleware HTTP.

#### `addHook(event, [name], action)`
O método `addHook` definirá um hook para um evento fornecido. Opcionalmente, você pode dar a ele um nome exclusivo, que pode ser usado posteriormente para remover o hook.

```js
static boot () {
  super.boot()
  this.addHook('beforeCreate', 'User.encryptPassword')
}
```

E para hooks nomeados

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

1. Evento de hook
2. Nome exclusivo
3. Ação a ser executada. A ação pode ser uma referência a um método javascript simples ou um namespace a ser resolvido pelo contêiner IoC.

#### `defineHooks(event, arrayOfActions)`
O método `defineHooks` é bem parecido com o método `addHook`, em vez disso, você pode definir vários hooks de uma só vez.

```js
class User extends Lucid {

  static boot () {
    super.boot()
    this.defineHooks('beforeCreate', ['UserHooks.validate', 'UserHook.encryptPassword'])
  }

}
```

#### `removeHook(name)`
Conforme declarado anteriormente, você também pode remover *hooks nomeados* a qualquer momento em seu aplicativo.

```js
User.removeHook('encryptingPassword')
```

## Abortando Operações de Banco de Dados
Os ganchos têm a capacidade de abortar as operações de banco de dados lançando exceções.

```js
// app/Model/Hooks/User.js

UserHook.validate = function * (next) {
  if (!this.username) {
    throw new Error('Username is required')
  }
  yield next
}
```

## Eventos de ganchos
Abaixo está a lista de eventos de ganchos.

| Evento          | Descrição                                           |
|-----------------|-----------------------------------------------------|
| `beforeCreate`  | Antes de um novo registro ser criado.               |
| `beforeUpdate`  | Antes de um registro existente ser atualizado.      |
| `beforeDelete`  | Antes de você estar prestes a excluir um determinado registro. |
| `beforeRestore` | Este evento só é acionado quando você habilita [exclusões suaves](/docs/06-lucid/01-lucid.md#deletetimestamp) e restaura um registro excluído anteriormente. |
| `afterCreate`   | Após um novo registro ter sido criado com sucesso.  |
| `afterUpdate`   | Após um registro existente ter sido atualizado.     |
| `afterDelete`   | Após um registro ter sido excluído com sucesso.     |
| `afterRestore`  | Após um registro soft delete ter sido restaurado.   |
