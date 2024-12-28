---
title: Traits
category: lucid-orm
---

# Traits

*Traits* possibilitam adicionar funcionalidades aos modelos *de fora para dentro*.

Usando traits de modelo, você pode:

1. Adicionar novos métodos à sua classe de modelo.
2. Ouvir [hooks](/original/markdown/08-Lucid-ORM/02-Hooks.md) do modelo.
3. Adicionar métodos à instância [Query Builder](/original/markdown/08-Lucid-ORM/01-Getting-Started.md#query-builder) para um determinado modelo.

## Criando um Trait
Traits são armazenados no diretório `app/Models/Traits`.

Use o comando `make:trait` para gerar um arquivo de trait:

```bash
adonis make:trait Slugify
```

```bash
# Output

✔ create  app/Models/Traits/Slugify.js
```

Traits requerem um método `register` recebendo a classe `Model` e um objeto `customOptions` como seus parâmetros:

```js
// .app/Models/Traits/Slugify.js

'use strict'

class Slugify {
  register (Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)
  }
}

module.exports = Slugify
```

## Registrando um Trait
Adicione um trait a um modelo Lucid assim:

```js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Slugify')
  }
}
```

## Registrando um Trait com Opções
Se necessário, você pode passar opções de inicialização ao adicionar um trait:

```js
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Slugify', {useCamelCase: true})
  }
}
```

As opções que você passar serão encaminhadas para o método `register()` do trait.

Ao passar opções, é recomendado que você defina *opções de trait padrão* assim:

```js
// .app/Models/Traits/Slugify.js

const _ = require('lodash')

class Slugify {

  register (Model, customOptions) {
    const defaultOptions = {useCamelCase: false}
    const options = _.extend({}, defaultOptions, customOptions)
  }
}

module.exports = Slugify
```

## Estendendo métodos de modelo
Use traits para adicionar métodos de modelo estáticos e de instância:

```js
// .app/Models/Traits/Slugify.js

class Slugify {

  register (Model, options) {
    // Add a static method
    Model.newAdminUser = function () {
      let m = new Model()
      m.isAdmin = true
      return m
    }

    // Add an instance method
    Model.prototype.printUsername = function () {
      console.log(this.username)
    }
  }
}

module.exports = Slugify
```

## Adicionando ganchos de modelo
Use traits para [hook](/original/markdown/08-Lucid-ORM/02-Hooks.md) em eventos de ciclo de vida do banco de dados:

```js
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
Use traits para adicionar macros ao [Query Builder](/original/markdown/08-Lucid-ORM/01-Getting-Started.md#query-builder) de um modelo:

```js
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


```
// Usage

await User.query().whereSlug('some value')
```
