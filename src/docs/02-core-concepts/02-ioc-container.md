# IoC Container & Provedores de Serviço

Este documento cobre o conceito e uso do contêiner Inversão de Controle (IoC) dentro do AdonisJs. É um conceito de armazenar/vincular dependências dentro de um *contêiner* e, em seguida, buscá-las de volta do contêiner em vez de exigi-los manualmente. A vantagem deste método é:

1. A configuração de um objeto é escondida do usuário final fornecendo uma API simples e clara.
2. Forte suporte para *Injeção de Dependência (DI)*, já que todos os objetos são buscados de uma única fonte da verdade.
3. Fácil de escrever módulos ou extensões de terceiros, já que você pode buscar as dependências do *contêiner IoC*, em vez de manter o usuário final para passar manualmente.

## Exemplo básico
Vamos pegar um exemplo simples de vinculação de dependências ao contêiner IoC e depois consumi-los mais tarde. Durante todo esse processo, você será apresentado a muitos novos termos e métodos.

```js
// Binding Dependencies

const Ioc = require('adonis-fold').Ioc
const bugsnag = require('bugsnag')

Ioc.bind('Adonis/Src/Bugsnag', function (app) { <1>

  const Config = app.use('Adonis/Src/Config') <2>
  const bugSnagConfig = Config.get('services.bugsnag') <3>

  bugsnag.register(bugSnagConfig.apiKey, bugSnagConfig.options) <4>
  return bugsnag <5>

})
```

1. Começamos por vincular um objeto ao contêiner IoC. Cada vinculação precisa ter um namespace exclusivo, que neste caso é "Adonis/Src/Bugsnag".
2. Como temos acesso ao contêiner `Ioc` dentro do closure, buscamos o *Config* binding.
3. Em seguida, pegamos a configuração do `bugsnag`, que deve ser salva dentro do arquivo `config/services.js`.
4. Usando as opções de configuração, registramos a `apiKey` com o Bugsnag.
5. Finalmente retornamos o objeto `bugsnag`, que pode ser usado para relatar os erros.

Para usar o *Bugsnag* binding, podemos aproveitar do método global `use`.

```js
const Bugsnag = use('Adonis/Src/Bugsnag')
Bugsnag.notify(new Error('Something went wrong'))
```

Com a ajuda do contêiner IoC, podemos abstrair o processo de configuração do Bugsnag e oferecer uma excelente API para o usuário final.

## Métodos Disponíveis
Abaixo está a lista dos métodos disponíveis expostos pelo contêiner IoC.

#### use (namespace/aliás)
Busque um binding usando seu *namespace* ou *alias*.

```js
const Redis = use('Redis')
```

#### faça (espaço de nome/aliás/classe)
Retorna uma instância de classe por injeção automática de dependências do construtor.

```js
class Book {

  static get inject () { <1>
    return ['App/Model/Book', 'Adonis/Addons/Mail']
  }

  constructor (BookModel, Mail) { <2>
    this.BookModel = BookModel
    this.Mail = Mail
  }

}

const bookInstance = make(Book) <3>
```

1. O método getter estático 'inject' retorna uma matriz de dependências a serem injetadas em sequência.
2. Todos os dependências especificadas são injetados no construtor.
3. Finalmente, utilizamos o método 'make' para criar uma instância da classe 'Book', que injeta automaticamente as dependências definidas.

#### alias(nome, namespace)
Defina um alias para um determinado namespace.

```js
const Ioc = require('adonis-fold').Ioc
Ioc.alias('UserModel', 'App/Model/User')
```

## Provedores de serviço
Até agora, nós temos sido manualmente vinculando dependências ao contêiner IoC usando o método `bind`, mas não sabemos onde escrever este código e como estruturar as associações. Os provedores de serviço fornecem uma interface amigável para *registrar* as associações no contêiner IoC.

NOTE: Always make sure to give unique names to your bindings. For example: Adonis uses `Adonis/Src/<ModuleName>` for the core bindings and `Adonis/Addons/<ModuleName>` for 1st party add-ons. Consider suffixing providers with your company name.

Um provedor de serviço é uma classe `ES2015` e suporta dois métodos para registrar as associações e inicializar o estado inicial do provedor. Por exemplo:

```js
const ServiceProvider = require('adonis-fold').ServiceProvider

class BugSnagProvider extends ServiceProvider {

  * register () { <1>
    this.app.bind('Adonis/Addons/BugSnag', (app) => {
      const BugSnag = require('./BugSnag')
      const Config = app.use('Adonis/Src/Config')
      return new BugSnag(Config)
    })
  }

  * boot () { <2>
    // Everything is registered do some hard work
  }

}
```

1. O método 'register' é usado para registrar as associações com o contêiner IoC. Além disso, você pode usar outras associações do contêiner IoC usando seu *namespace*.
2. O método 'boot' é chamado quando todos os provedores foram registrados Isso significa que você pode fazer algum trabalho pesado dentro deste método para inicializar seu provedor. Além disso, este método não é necessário por cada provedor e apenas o implementa quando seu provedor precisa ser inicializado.

## Eventos
Abaixo está a lista de eventos disparados pelo contêiner IoC.

```js
const Ioc = require('adonis-fold').Ioc

Ioc.on('bind:provider', (namespace, isSingleton) => {
  // binding registered
})

Ioc.on('provider:resolved', (namespace, returnValue) => {
  // binding resolved
})

Ioc.on('module:resolved', (namespace, fromPath, returnValue) => {
  // resolved autoloaded module
})

Ioc.on('extend:provider', (key, namespace) => {
  // a provider has been extended
})

Ioc.on('bind:autoload', (namespace, directoryPath) => {
  // defined autoload namespace and directory
})

Ioc.on('bind:alias', (alias, namespace) => {
  // an alias has been registered
})

Ioc.on('providers:registered', () => {
  // all providers have been registered
})

Ioc.on('providers:booted', () => {
  // all providers have been booted
})
```
