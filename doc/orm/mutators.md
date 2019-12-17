# Mutadores (Mutators)

Os getters e setters oferecem [muitos benefícios](https://stackoverflow.com/questions/1568091/why-use-getters-and-setters-accessors/1568230#1568230), incluindo a capacidade de transformar seus dados 
antes de salvar e recuperar de um banco de dados.

Neste guia, aprendemos quando e onde usar getters, setters e propriedades calculadas 
(também conhecidas como acessadores e mutadores).

## Getters
Os getters são chamados ao recuperar um valor de uma instância de modelo.

Eles são frequentemente usados para transformar dados de modelo para exibição.

Por exemplo, convertendo um título do `Post` para maiúsculas e minúsculas:

``` js
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

``` js
const post = await Post.find(postId)

// getters são chamados automaticamente
return post.toJSON()
```

No exemplo acima, assumindo que o título do `Post` seja salvo como um campo `title` no banco de dados, 
o AdonisJs executa o método `getTitle` e usa o valor retornado quando `post.title` é referenciado.

+ Os getters sempre começam com a palavra-chave `get` seguida pela versão em camelo do nome do campo (por exemplo, `field_name` → `getFieldName`).
+ O valor de retorno de um getter é usado em vez do valor real do nome do campo do banco de dados quando esse campo é referenciado em uma instância de modelo.
+ Os getters são avaliados automaticamente quando você chama `toJSON` em uma instância de modelo ou de [serializador](https://adonisjs.com/docs/4.1/serializers).
+ Como os getters são síncronos, não é possível executar o código assíncrono dentro deles (para funcionalidade assíncrona, use ganchos ).

## Setters
Os setters são chamados ao atribuir um valor a uma instância do modelo.

Eles geralmente são usados para normalizar dados antes de salvar em um banco de dados:

```
'use strict'

const Model = use('Model')

class User extends Model {
  setAccess (access) {
    return access === 'admin' ? 1 : 0
  }
}

const user = new User()
user.access = 'admin'

console.log(user.access) // will return 1
await user.save()
```

+ Os setters sempre começam com a palavra-chave `set` seguida pela versão de camelCase do nome do campo.
+ Um setter é executado quando você define/atualiza o valor do campo especificado na instância do modelo.
+ Os setters recebem o valor atual de um determinado campo para analisar antes da atribuição.
+ Como os setters são síncronos, não é possível executar o código assíncrono dentro deles (para funcionalidade assíncrona, use ganchos ).

## Propriedades computadas
Propriedades calculadas são valores virtuais que existem apenas na representação JSON de uma instância de modelo.

Para criar uma propriedade `fullname` calculada a partir de um nome/sobrenome de `User`:

``` js
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

No exemplo acima, quando `toJSON` é chamada na instância `User`, uma propriedade `fullname` é adicionada ao valor de retorno:

``` js
const user = await User.find(1)

const json = user.toJSON()
console.log(json.fullname) // firstname + lastname
```

+ Todos os nomes de propriedades calculados (por exemplo `fullname`) devem ser retornados em uma matriz do getter `computed` estático da classe de modelo.

+ As definições de método de propriedade computadas são prefixadas get, da mesma forma que as definições de método getter (por exemplo getFullname).

+ As propriedades computadas recebem um objeto de atributos de modelo existentes para uso em suas definições de método.
