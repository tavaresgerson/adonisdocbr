# Mutadores

*Getters e setters* fornecem [muitos benefícios](https://stackoverflow.com/a/1568230/1210490), incluindo a capacidade de transformar seus dados antes de salvar e recuperar de um banco de dados.

Neste guia, aprendemos quando e onde usar getters, setters e propriedades computadas (também conhecidas como *acessadores e mutadores*).

## Getters
*Getters* são chamados ao recuperar um valor de uma instância de modelo.

Eles são frequentemente usados ​​para transformar dados de modelo para exibição.

Por exemplo, convertendo um título `Post` para caixa de título:

```js
// .app/Models/Post.js

'use strict'

const Model = use('Model')

class Post extends Model {
  getTitle (title) {
    return title.replace(/^(.)|\s(.)/g, ($1) => {
      return $1.toUpperCase()
    })
  }
}
```

```js
const post = await Post.find(postId)

// getters are called automatically
return post.toJSON()
```

No exemplo acima, assumindo que o título `Post` é salvo como um campo `title` no banco de dados, o AdonisJs executa o método `getTitle` e usa o valor retornado quando `post.title` é referenciado.

- Os getters sempre começam com a palavra-chave `get` seguida pela versão *camel case* do nome do campo (por exemplo, `field_name` → `getFieldName`).
- O valor de retorno de um getter é usado em vez do valor real do nome do campo do banco de dados quando esse campo é referenciado em uma instância de modelo.
- Os getters são avaliados automaticamente quando você chama `toJSON` em uma instância de modelo ou instância link:serializers[serializer].
[hooks](/docs/08-Lucid-ORM/02-Hooks.md)).

## Setters
*Setters* são chamados ao atribuir um valor a uma instância de modelo.

Eles são frequentemente usados ​​para normalizar dados antes de salvar em um banco de dados:

```js
// .app/Models/User.js

'use strict'

const Model = use('Model')

class User extends Model {
  setAccess (access) {
    return access === 'admin' ? 1 : 0
  }
}
```

```js
const user = new User()
user.access = 'admin'

console.log(user.access) // will return 1
await user.save()
```

- Setters sempre começam com a palavra-chave `set` seguida pela versão *camel case* do nome do campo.
- Um setter é executado quando você define/atualiza o valor do campo fornecido na instância do modelo.
- Setters recebem o valor atual de um campo fornecido para analisar antes da atribuição. [hooks](/docs/08-Lucid-ORM/02-Hooks.md).

## Propriedades computadas
Propriedades computadas são valores virtuais que existem apenas na representação JSON de uma instância de modelo.

Para criar uma propriedade `fullname` computada a partir de um nome/sobrenome `User`:

```js
// .app/Models/User.js

'use strict'

const Model = use('Model')

class User extends Model {
  static get computed () {
    return ['fullname']
  }

  getFullname ({ firstname, lastname }) {
    return `${firstname} ${lastname}`
  }
}
```

No exemplo acima, quando `toJSON` é chamado na instância `User`, uma propriedade `fullname` é adicionada ao valor de retorno:

```js
const user = await User.find(1)

const json = user.toJSON()
console.log(json.fullname) // firstname + lastname
```

- Todos os nomes de propriedades computadas (por exemplo, `fullname`) devem ser retornados em uma matriz do getter estático `computed` da classe de modelo.
- As definições de método de propriedade computada são prefixadas com `get`, o mesmo que as definições de método getter (por exemplo, `getFullname`).
- As propriedades computadas recebem um objeto de atributos de modelo existentes para uso em suas definições de método.
