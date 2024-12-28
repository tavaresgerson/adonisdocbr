---
title: Service Providers
category: concept
---

# Provedores de serviço

Até agora, aprendemos [como vincular](/original/markdown/02-Concept/02-ioc-container.md#binding-dependencies) dependências ao contêiner IoC.

Neste guia, damos um passo adiante para aprender sobre *provedores de serviço* e como distribuir pacotes que funcionam bem com o ecossistema AdonisJs.

## Introdução
Sabemos que o método `ioc.bind` pode ser usado para registrar vinculações. No entanto, ainda não definimos onde chamar esse método.

É aqui que os *provedores de serviço* entram em cena. Os provedores de serviço são classes ES6 puras com métodos de ciclo de vida que são usados ​​para registrar e inicializar vinculações.

Por exemplo:

```js
const { ServiceProvider } = require('@adonisjs/fold')

class MyProvider extends ServiceProvider {
  register () {
    // vinculações de registro
  }

  boot () {
    // opcionalmente faça alguma configuração inicial
  }
}

module.exports = MyProvider
```

1. O método `register` é usado para registrar vinculações, e você nunca deve tentar usar nenhuma outra vinculação dentro desse método.
2. O método `boot` é chamado quando todos os provedores foram registrados e é o lugar certo para usar ligações existentes para inicializar o estado do aplicativo.

Por exemplo, adicionando uma visualização global:

```js
boot () {
  const View = this.app.use('Adonis/Src/View')
  View.global('time', () => new Date().getTime())
}
```

## pacote npm como um provedor de serviço
Vamos ver como podemos encapsular um pacote npm existente em um provedor de serviço.

::: warning NOTA
Não encapsular pacotes como `lodash` em um provedor de serviço, pois ele pode ser usado diretamente e não requer nenhum processo de configuração.
:::

Todos os provedores específicos do aplicativo vivem dentro do diretório `providers` na raiz do seu aplicativo:

### Estrutura de diretório

```bash
├── app
└── providers
  └── Queue
    └── index.js
    └── Provider.js
└── start
```

### Princípios
Vamos encapsular [bee-queue](https://github.com/bee-queue/bee-queue) como um provedor.

Aqui está um conjunto de princípios que queremos seguir:

1. O usuário final não deve se preocupar em configurar o provedor de filas.
2. Toda a configuração deve ficar dentro do arquivo `config/queue.js`.
3. Deve ser simples o suficiente para criar novas filas com uma configuração diferente.

### Implementação
Vamos implementar o wrapper dentro do arquivo `providers/Queue/index.js`:

```js
// .providers/Queue/index.js

'use strict'

const BeeQueue = require('bee-queue')

class Queue {
  constructor (Config) {
    this.Config = Config
    this._queuesPool = {}
  }

  get (name) {
    /**
     * Se já houver uma instância de queue, retorne-a
     */
    if (this._queuesPool[name]) {
      return this._queuesPool[name]
    }

    /**
     * Ler configuração usando Config
     * provedor
     */
    const config = this.Config.get(`queue.${name}`)

    /**
     * Crie uma nova instância de fila e salve-a
     * referência
     */
    this._queuesPool[name] = new BeeQueue(name, config)

    /**
     * Retornar a instância de volta
     */
    return this._queuesPool[name]
  }
}

module.exports = Queue
```

A classe acima tem apenas um método chamado `get`, que retorna uma instância da fila para um determinado *nome de fila*.

As etapas executadas pelo método `get` são:

1. Procure uma instância de um determinado nome de fila.
2. Se uma instância não existir, leia a configuração usando o *Provedor de configuração*.
3. Crie uma nova instância `bee-queue` e armazene dentro de um objeto para uso futuro.
4. Finalmente, retorne a instância.

A classe `Queue` é pura, pois não tem nenhuma dependência rígida no framework e, em vez disso, depende da *Injeção de Dependência* para fornecer o *Provedor de Configuração*.

### Provedor de serviço
Agora, vamos criar um provedor de serviço que faz a instanciação desta classe e a vincula ao contêiner IoC.

O código fica dentro de `providers/Queue/Provider.js`:

```js
// .providers/Queue/Provider.js

const { ServiceProvider } = require('@adonisjs/fold')

class QueueProvider extends ServiceProvider {
  register () {
    this.app.singleton('Bee/Queue', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('.'))(Config)
    })
  }
}

module.exports = QueueProvider
```

Observe que `this.app` é uma referência ao objeto `ioc`, o que significa que em vez de chamar `ioc.singleton`, chamamos `this.app.singleton`.

Finalmente, precisamos registrar este provedor como qualquer outro provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  path.join(__dirname, '..', 'providers', 'Queue/Provider')
]
```

Agora, podemos chamar `use('Bee/Queue')` dentro de qualquer arquivo em seu aplicativo para usá-lo:

```js
const Queue = use('Bee/Queue')

Queue
  .get('addition')
  .createJob({ x: 2, y: 3 })
  .save()
```

## Distribuindo como um pacote
O provedor [bee queue](#npm-package-as-a-service-provider) que criamos reside na mesma estrutura do projeto. No entanto, podemos extraí-lo em seu próprio pacote.

Vamos criar um novo diretório com a seguinte estrutura de diretório:

```bash
└── providers
    └── QueueProvider.js
├── src
  └── Queue
    └── index.js
└── package.json
```

Tudo o que fizemos foi mover a implementação real de `Queue` para o diretório `src` e renomear o arquivo do provedor para `QueueProvider.js`.

Além disso, temos que fazer as seguintes alterações:

1. Como `Queue/index.js` está em um diretório diferente, precisamos ajustar a referência a esse arquivo dentro do nosso provedor de serviços.
2. Renomeie o namespace `Bee/Queue` para um namespace mais adequado, que tenha menos chances de colisão. Por exemplo, ao criar este provedor para AdonisJs, o nomearemos como `Adonis/Addons/Queue`.

```js
// .providers/QueueProvider.js

const { ServiceProvider } = require('@adonisjs/fold')

class QueueProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/Addons/Queue', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('../src/Queue'))(Config)
    })
  }
}

module.exports = QueueProvider
```

::: danger OBSERVAÇÃO
Não inclua `@adonisjs/fold` como uma dependência para seu provedor, pois ele deve ser instalado apenas pelo aplicativo principal. Para testes, você pode instalá-lo como uma *dependência dev*.
:::

### Escrevendo testes de provedor
O AdonisJs usa oficialmente [japa](https://github.com/thetutlage/japa) para escrever testes de provedor, embora você possa usar qualquer mecanismo de teste que desejar.

Configurar o japa é simples:

```bash
npm i --save-dev japa
```

Crie os testes dentro do diretório `test`:

```bash
mkdir test
```

Os testes podem ser executados executando o arquivo de teste usando o comando `node`:

```bash
node test/example.spec.js
```

Para executar todos os seus testes juntos, você pode usar `japa-cli`:

```js
npm i --save-dev japa-cli
```

E executar todos os testes via:

```bash
./node_modules/.bin/japa
```

## FAQ's

#### Por que não instalar `@adonisjs/fold` como uma dependência?
Este requisito é para que a versão principal do aplicativo `@adonisjs/fold` esteja sempre instalada para seu provedor usar. Caso contrário, cada provedor acabará enviando sua própria versão do contêiner AdonisJS IoC. Se você já trabalhou com o gulp, eles também [recomendam](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md) (p:14) não instalar o gulp como uma dependência ao criar plugins.
