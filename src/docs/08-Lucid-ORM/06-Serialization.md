---
title: Serialization
category: lucid-orm
---

# Serialização

*Serializadores* fornecem abstrações limpas para transformar resultados de banco de dados.

O AdonisJs vem com o [Vanilla Serializer](https://github.com/adonisjs/adonis-lucid/blob/develop/src/Lucid/Serializers/Vanilla.js) padrão, mas você é livre para criar e usar qualquer serializador que seu aplicativo exigir.

Um uso comum do serializador é formatar dados de acordo com a especificação [JSON:API](http://jsonapi.org/).

## Introdução
Consultas de banco de dados feitas por meio de [modelos Lucid](/original/markdown/08-Lucid-ORM/01-Getting-Started.md) retornam instâncias serializáveis:

```js
const User = use('App/Models/User')

const users = await User.all()

// users -> Vanilla Serializer instance
```

Para converter uma instância serializável em uma matriz/objeto simples, chame seu método `toJSON`:

```js
const json = users.toJSON()
```

Chamar `toJSON` em qualquer instância serializável retorna dados prontos para saída JSON.

### Por que usar serializadores?
Ao escrever um servidor de API, é improvável que você queira retornar dados de instância de modelo não serializados para seus usuários.

*Serializadores* resolvem esse problema formatando dados de modelo quando necessário.

Supondo que um `Usuário` possa ter muitas relações `Post`:

```js
const User = use('App/Models/User')

const users = await User
  .query()
  .with('posts')
  .fetch()
```

No exemplo acima, o Lucid carrega todos os modelos `Usuário` e suas relações `Post`, mas não formata os dados carregados para JSON neste momento.

Quando `toJSON` é finalmente chamado em `usuários`, a responsabilidade de formatar os dados é delegada ao Serializador Vanilla:

```js
// serialize the data
users.toJSON()
```

```js
// Output

[
  {
    id: 1,
    username: 'virk',
    posts: [
      {
        id: 1,
        user_id: 1,
        title: 'Adonis 101'
      }
    ]
  }
]
```

Um serializador executa todos os `getters`, `setters` e `propriedades computadas` antes de retornar dados de modelo formatados.

## Usando o Serializer
Serializers podem ser definidos por modelo substituindo o getter `Serializer`:

```js
// .app/Models/User.js

class User extends Model {
  static get Serializer () {
    return // your own implementation
  }
}
```

## Serializer Vanilla
O [Vanilla Serializer](https://github.com/adonisjs/adonis-lucid/blob/develop/src/Lucid/Serializers/Vanilla.js) executa as seguintes operações:

1. Anexar todas as relações ao lado de cada registro de modelo como uma propriedade.
2. Anexe todos os dados `sideloaded` à chave raiz `\___meta___`, por exemplo, *contagens de postagens* para um determinado usuário são representadas assim:
```js
  {
    id: 1,
    username: 'virk',
    __meta__: {
      posts_count: 2
    }
  }
  ```
3. Formate os resultados da paginação:
```js
  {
    total: 10,
    perPage: 20,
    lastPage: 1,
    currentPage: 1,
    data: []
  }
  ```

## Criando serializador
Crie seu próprio serializador para retornar dados em um formato não fornecido pelo AdonisJs.

A API do serializador é intencionalmente pequena para facilitar a adição de novos serializadores.

> OBSERVAÇÃO: Evite serializadores personalizados para pequenas alterações na saída JSON. Em vez disso, use `getters` e `propriedades computadas`.

### Visão geral da API
Abaixo está um modelo de exemplo para um serializador personalizado:

```js
// .app/Serializers/CustomSerializer.js

class CustomSerializer {
  constructor (rows, pages = null, isOne = false) {
    this.rows = rows
    this.pages = pages
    this.isOne = isOne
  }

  first () {
    return this.rows[0]
  }

  last () {
    return this.rows[this.rows.length - 1]
  }

  size () {
    return this.isOne ? 1 : this.rows.length
  }

  toJSON () {
    // return formatted data
  }
}

module.exports = CustomSerializer
```

Depois que seu serializador personalizado for criado, vincule-o ao [contêiner IoC](/original/markdown/02-Concept/02-ioc-container.md):

```js
// .start/hooks.js

const { ioc } = require('@adonisjs/fold')

ioc.bind('MyApp/CustomSerializer', () => {
  return require('./app/Serializers/CustomSerializer')
})
```

Depois de vinculado ao contêiner, defina seu serializador personalizado por modelo:

```js
// .app/Models/User.js

class User extends Model {
  static get Serializer () {
    return 'MyApp/CustomSerializer'
  }
}
```
