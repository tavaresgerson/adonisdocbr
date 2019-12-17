# Traits

As traits tornam possível adicionar funcionalidade aos modelos de fora para dentro.

Usando características do modelo, você pode:

+ Adicione novos métodos à sua classe de modelo.
+ Ouça os modelos de [ganchos](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/orm/hooks.md).
+ Adicione métodos à instância do [Query Builder](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/database/query-builder.md) para um determinado modelo.

## Criando uma trait
As traits são armazenados no diretório `app/Models/Traits`

Use o comando `make:trait` para gerar um arquivo de trait:

```
> adonis make:trait Slugify
```

Saída
```
✔ create  app/Models/Traits/Slugify.js
```

As traits requerem um método `register` que receba a classe `Model` e um objeto `customOptions` com seus parâmetros:

``` js
'use strict'

class Slugify {
  register (Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)
  }
}

module.exports = Slugify
```

## Registrando uma trait
Adicione uma trait a um modelo Lucid da seguinte forma:

``` js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Slugify')
  }
}
```

### Registrando uma trait com opções
Se necessário, você pode passar as opções de inicialização ao adicionar uma trait:

``` js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Slugify', {useCamelCase: true})
  }
}
```

As opções que você passa serão encaminhadas para o método `register()` da trait.

Ao passar as opções, é recomendável definir opções de trait padrão da seguinte forma:

``` js
const _ = require('lodash')

class Slugify {

  register (Model, customOptions) {
    const defaultOptions = {useCamelCase: false}
    const options = _.extend({}, defaultOptions, customOptions)
  }
}

module.exports = Slugify
```

## Estendendo os métodos do modelo
Use traits para adicionar métodos estáticos e de modelo de instância:

``` js
class Slugify {

  register (Model, options) {
    // Adiciona um método estático
    Model.newAdminUser = function () {
      let m = new Model()
      m.isAdmin = true
      return m
    }

    // Adiciona um método a instância
    Model.prototype.printUsername = function () {
      console.log(this.username)
    }
  }
}

module.exports = Slugify
```

## Adicionando ganchos de modelo
Use características para conectar-se aos eventos do ciclo de vida do banco de dados:

``` js
class Slugify {

  register (Model, options) {
    Model.addHook('beforeCreate', function (modelInstance) {
      // create slug
    })
  }
}

module.exports = Slugify
```

## Estendendo o Query Builder
Use traços para adicionar macros ao [Query Builder](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/database/query-builder.md) de um modelo :

``` js
class Slugify {

  register (Model, options) {
    Model.queryMacro('whereSlug', function (value) {
      this.where('slug', value)
      return this
    })
  }
}

module.exports = Slugify
```


Use

``` js
await User.query().whereSlug('some value')
```
