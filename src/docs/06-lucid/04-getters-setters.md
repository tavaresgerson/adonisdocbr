# Getters e Setters

Uma das etapas importantes para a construção de aplicativos orientados a dados é controlar o fluxo de dados. O Lucid oferece getters e setters para facilitar o controle do fluxo de dados.

Vamos dar um exemplo de *Modelo de postagem* no qual você sempre terá um *título de postagem* que deve ser capitalizado ao exibi-lo para o usuário final. Por exemplo, um título chamado *introdução ao adonis* deve ser exibido como *Introdução ao Adonis*.

Há algumas maneiras de atingir os resultados finais. Primeiro, fale sobre a maneira *ingênua* de fazer isso.

1. Use a propriedade CSS `text-transform` para capitalizá-la. E se você também tiver uma API JSON?
2. Sempre que encontrar um artigo, capitalize-o manualmente, modificando a propriedade.
* Você fará isso para 20 postagens dentro de um loop?
* E se você estiver buscando postagens como uma relação para um determinado usuário? Isso significa fazer um loop por todos os usuários e, em seguida, suas postagens e alterar manualmente o título do artigo.

Todos os truques mencionados anteriormente não são sustentáveis. A melhor maneira é modificar o título de sua origem para garantir que ele retorne o mesmo valor, não importa o que aconteça.

## Getters
No Lucid, definimos *getters* para tais situações. Os getters alteram um determinado atributo imediatamente, sem alterar o valor original no banco de dados.

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

1. Getters são sempre definidos com a palavra-chave `get` seguida pelo nome do atributo. Por exemplo, um getter para o atributo `title` será definido como `getTitle`.
2. Getters são síncronos, o que significa que você não pode executar código assíncrono dentro deles. Você deve usar link:database-hooks[hooks] para isso.
3. Getters receberão o valor atual de um determinado campo.
4. Getters são avaliados quando você chama o método `toJSON` em uma instância de modelo ou uma coleção.

## Setters
Setters são o oposto de getters e eles alteram o valor quando você os define em sua instância de modelo. Por exemplo

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

### Sobre Setters

1. Setters são sempre definidos com a palavra-chave `set` seguida pelo nome do atributo. Por exemplo, um setter para o atributo `access` será definido como `setAccess`.
2. Setters são síncronos, o que significa que você não pode executar código assíncrono dentro deles. Você deve usar [hooks](/src/docs/06-lucid/03-hooks.md) para isso.
3. Setters receberão o valor atual de um determinado campo.
4. Eles são executados somente quando você *define/atualiza* o valor de um determinado campo na instância do modelo.

## Propriedades computadas
Propriedades computadas são como getters, mas são valores virtuais que não existem nas tabelas do seu banco de dados.

Você pode querer propriedades computadas em muitos casos. Por exemplo, calculando o nome completo de um determinado usuário usando seu primeiro e último nome.

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

### Sobre propriedades computadas

1. Propriedades computadas devem ser retornadas como uma matriz do getter `computed`.
2. Métodos computados são definidos da mesma forma que os `getters`.
3. Eles não recebem nenhum valor e, portanto, acessam os valores da instância do modelo usando a palavra-chave `this`.
