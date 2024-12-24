# IoC Container & Service Providers

Este documento aborda o conceito e o uso do contêiner Inversion of Control (IoC) dentro do AdonisJs. É um conceito de armazenar/vincular dependências dentro de um *contêiner* e então buscá-las de volta do contêiner em vez de solicitá-las manualmente. O benefício dessa abordagem é:

1. A configuração de um objeto é ocultada do usuário final, fornecendo uma API simples e clara.
2. Suporte sólido para *Dependency Injection (DI)*, já que todos os objetos são buscados de uma única fonte de verdade.
3. Fácil de escrever módulos/addons de terceiros, já que você pode buscar dependências do *contêiner IoC*, em vez de segurar o usuário final para passá-las manualmente.

## Exemplo básico
Vamos dar um exemplo simples de vincular dependências ao contêiner IoC e então consumi-las mais tarde. Ao longo desse processo, você será apresentado a muitos termos e métodos novos.

```js
// Dependências de ligação

const Ioc = require('adonis-fold').Ioc
const bugsnag = require('bugsnag')

Ioc.bind('Adonis/Src/Bugsnag', function (app) { <1>

  const Config = app.use('Adonis/Src/Config') <2>
  const bugSnagConfig = Config.get('services.bugsnag') <3>

  bugsnag.register(bugSnagConfig.apiKey, bugSnagConfig.options) <4>
  return bugsnag <5>

})
```

1. Começamos vinculando um objeto ao contêiner IoC. Cada vinculação precisa ter um namespace exclusivo que é `Adonis/Src/Bugsnag` neste caso.
2. Como temos acesso ao contêiner `Ioc` dentro do fechamento, buscamos a vinculação *Config*.
3. Em seguida, pegamos a configuração do `bugsnag` que deve ser salva dentro do arquivo `config/services.js`.
4. Usando as opções de configuração, registramos a `apiKey` com bugsnag.
5. Finalmente, retornamos o objeto `bugsnag`, que pode ser usado para relatar os erros.

Para usar a vinculação *Bugsnag*, podemos aproveitar o método global `use`.

```js
const Bugsnag = use('Adonis/Src/Bugsnag')
Bugsnag.notify(new Error('Something went wrong'))
```

Com a ajuda do contêiner IoC, podemos abstrair o processo de configuração do Bugsnag e oferecer uma excelente API ao usuário final.

## Métodos disponíveis
Abaixo está a lista de métodos disponíveis expostos pelo contêiner IoC.

#### use(namespace/alias)
Busca uma ligação usando seu *namespace* ou *alias*.

```js
const Redis = use('Redis')
```

#### make(namespace/alias/class)
Retorna uma instância da classe injetando automaticamente as dependências do construtor.

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

1. O getter estático `inject` retorna uma matriz de dependências a serem injetadas em sequência.
2. Todas as dependências especificadas são injetadas no construtor.
3. Finalmente, usamos o método `make` para criar uma instância da classe `Book`, que injeta automaticamente as dependências definidas.

#### alias(name, namespace)
Defina o alias para um determinado namespace.

```js
const Ioc = require('adonis-fold').Ioc
Ioc.alias('UserModel', 'App/Model/User')
```

## Provedores de serviço
Até agora, vinculamos manualmente as dependências ao contêiner IoC usando o método `bind`, mas não temos certeza de onde escrever esse código e como estruturar as vinculações. Os provedores de serviço fornecem uma interface amigável para *registrar* as vinculações ao contêiner IoC.

::: info OBSERVAÇÃO
Sempre certifique-se de dar nomes exclusivos às suas vinculações. Por exemplo: Adonis usa `Adonis/Src/<ModuleName>` para as vinculações principais e `Adonis/Addons/<ModuleName>` para complementos primários. Considere sufixar provedores com o nome da sua empresa.
:::

Um Service Provider é uma classe `ES2015` e suporta dois métodos para registrar as ligações e inicializar o estado inicial do provedor. Por exemplo:

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
    // Tudo está registrado para algum trabalho duro
  }

}
```

1. O método `register` é usado para registrar ligações no contêiner IoC. Além disso, você pode `usar` outras ligações do contêiner IoC usando seu *namespace*.
2. O método `boot` é chamado quando todos os provedores foram registrados. O que significa que você pode fazer um trabalho pesado dentro deste método para inicializar seu provedor. Além disso, este método não é necessário para todos os provedores e só o implementa quando seu provedor precisa ser inicializado.

## Eventos
Abaixo está a lista de eventos disparados pelo contêiner IoC.

```js
const Ioc = require('adonis-fold').Ioc

Ioc.on('bind:provider', (namespace, isSingleton) => {
  // Vinculo registrado
})

Ioc.on('provider:resolved', (namespace, returnValue) => {
  // Vinculo resolvido
})

Ioc.on('module:resolved', (namespace, fromPath, returnValue) => {
  // módulo autocarregado resolvido
})

Ioc.on('extend:provider', (key, namespace) => {
  // um provedor foi estendido
})

Ioc.on('bind:autoload', (namespace, directoryPath) => {
  // namespace e diretório de carregamento automático definidos
})

Ioc.on('bind:alias', (alias, namespace) => {
  // um alias foi registrado
})

Ioc.on('providers:registered', () => {
  // todos os provedores foram registrados
})

Ioc.on('providers:booted', () => {
  // todos os provedores foram inicializados
})
```
