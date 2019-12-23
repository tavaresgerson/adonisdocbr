# Serialização

Os serializadores fornecem abstrações limpas para transformar os resultados do banco de dados.

O AdonisJs é fornecido com o [serializador](https://github.com/adonisjs/adonis-lucid/blob/develop/src/Lucid/Serializers/Vanilla.js) padrão do [Vanilla](https://github.com/adonisjs/adonis-lucid/blob/develop/src/Lucid/Serializers/Vanilla.js) , mas você é livre para criar e usar 
qualquer serializador que seu aplicativo exigir.

Um uso comum do serializador é formatar dados conforme a especificação [JSON: API](http://jsonapi.org/).

## Introdução
As consultas ao banco de dados feitas por meio de modelos Lucid retornam instâncias serializáveis:

``` js
const User = use('App/Models/User')

const users = await User.all()

// users -> Vanilla Serializer instance
```

Para converter uma instância serializável em uma matriz/objeto simples, chame o método `toJSON`:

``` js
const json = users.toJSON()
```

Chamar `toJSON` em qualquer instância serializável retorna dados prontos para saída JSON.

### Por que usar serializadores?
Ao escrever um servidor de API, é improvável que você deseje retornar dados de instância de 
modelo não serializados para seus usuários.

Os serializadores resolvem esse problema formatando os dados do modelo quando necessário.

Supondo que um `User` pode ter muitas relações com `Post`:

``` js
const User = use('App/Models/User')

const users = await User
  .query()
  .with('posts')
  .fetch()
```

No exemplo acima, o Lucid carrega todos os modelos `User` e seus relacionamentos `Post`, mas não 
formata os dados carregados para JSON neste momento.

Quando `toJSON` é chamado em `users`, a responsabilidade de formatar os dados é delegada ao serializador de vanilla:

``` js
// serializa os dados
users.toJSON()
``` 

Resultado
```
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

O serializer executa tudos os `getters`, `setters` e `computed properties` antes de retornar dados de 
modelos formatados.

## Usando o serializador
Serializadores podem ser definidos por modelo, substituindo o `Serializer` getter:

```
class User extends Model {
  static get Serializer () {
    return // your own implementation
  }
}
```

## Serializador Vanilla
O [serializador de vanilla](https://github.com/adonisjs/adonis-lucid/blob/develop/src/Lucid/Serializers/Vanilla.js) executa as seguintes operações:

+ Anexe todas as relações próximas a cada registro de modelo como uma propriedade.
+ Anexe todos os `sideloaded` dados à chave raiz `__meta__`, por exemplo, as contagens de mensagens de um determinado
usuário são representadas da seguinte maneira:

```
{
  id: 1,
  username: 'virk',
  __meta__: {
    posts_count: 2
  }
}
```

Formate os resultados da paginação:

```
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

> Evite serializadores personalizados para pequenas alterações na saída JSON. Em vez disso, use 
> `getters` e `computed properties`.


### Visão geral da API
Abaixo está um exemplo de modelo para um serializador personalizado:

``` js
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

Depois que seu serializador personalizado for criado, vincule-o ao contêiner de IoC:

``` js
const { ioc } = require('@adonisjs/fold')

ioc.bind('MyApp/CustomSerializer', () => {
  return require('./app/Serializers/CustomSerializer')
})
```

Depois de vinculado ao contêiner, defina seu serializador personalizado por modelo:

``` js
class User extends Model {
  static get Serializer () {
    return 'MyApp/CustomSerializer'
  }
}
```
