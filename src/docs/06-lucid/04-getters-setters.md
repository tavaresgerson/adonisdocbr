# Getters & Setters

Um dos passos importantes para a construção de aplicações orientadas a dados é controlar o fluxo de dados. O Lucid oferece getters e setters para facilitar o controle do fluxo de dados.

Vamos pegar um exemplo do *Modelo de Postagem* no qual você sempre terá um *título da postagem*, que deve ser capitalizado ao exibi-lo para o usuário final. Por exemplo, um título chamado "Começando com Adonis" deve ser exibido como "Começando com Adonis".

Existem algumas maneiras de alcançar o resultado final. Primeiro, fale sobre a maneira "ingênua" de fazer isso.

1. Utilize a propriedade CSS "text-transform" para capitalizar. E se você também tiver uma API JSON?
2. Sempre que encontrar um artigo, capitalizar manualmente, modificando a propriedade.
* Você fará isso para 20 postagens dentro de um loop?
* E se você estiver buscando publicações como relação de um usuário específico? Isso significa percorrer todos os usuários e depois suas publicações e mutar manualmente o título do artigo.

Todas as dicas mencionadas anteriormente não são mantíveis. A melhor maneira é modificar o título de sua origem para garantir que ele retorne o mesmo valor não importa o quê.

## Getters
Em Lucid definimos *getters* para tais situações. Os getters mutam um atributo dado no momento sem alterar o valor original no banco de dados.

```js
'use strict'

const Lucid = use('Lucid')

class Post extends Lucid {

  getTitle (title) {
    return title.replace(/^(.)|\s(.)/g, function($1) {
      return $1.toUpperCase();
    })
  }

}
```

### Sobre Getters

1. Os getters são sempre definidos com o palavra-chave "get" seguido pelo nome do atributo. Por exemplo, um getter para o atributo "title" será definido como "getTitle".
2. Os getters são síncronos, o que significa que você não pode executar código assíncrono dentro deles. Você deve usar os ganchos de link:database-hooks[ganchos] para isso.
3. Os getters receberão o valor atual de um determinado campo.
4. Os getters são avaliados quando você chama o método `toJSON` em uma instância de modelo ou uma coleção.

## Setters
Os setters são o oposto dos getters e mutam o valor quando você os define em sua instância de modelo. Por exemplo

```js
'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  setAccess (access) {
    return access === 'admin' ? 1 : 0
  }

}

const user = new User()
user.access = 'admin'

console.log(user.access) // will return 1
yield user.save()
```

### Sobre os Setters

1. Os métodos de acesso são sempre definidos com o nome do atributo seguido da palavra-chave "set". Por exemplo, um método de acesso para o atributo "acesso" será definido como "setAccess".
2. Os setters são síncronos, o que significa que você não pode executar código assíncrono dentro deles. Você deve usar os ganchos de link:database-hooks[ganchos] para isso.
3. Os setters receberão o valor atual de um determinado campo.
4. Eles são executados somente quando você *definir/atualizar* o valor de um determinado campo na instância do modelo.

## Propriedades Computadas
Propriedades computadas são como getters, mas os valores virtuais não existem nas tabelas de banco de dados.

Você pode querer propriedades calculadas em muitos casos. Por exemplo, calcular o nome completo de um usuário dado seus primeiro e último nomes.

```js
'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  static get computed () {
    return ['fullname']
  }

  getFullname () {
    return `${this.firstname} ${this.lastname}`
  }

}
```

### Sobre Propriedades Computacionais

1. As propriedades computadas devem retornar um array do método getter "computed".
2. Métodos computados são definidos da mesma forma que os `getters`.
3. Eles não recebem nenhum valor e, portanto, acessam os valores da instância do modelo usando a palavra-chave "this".
