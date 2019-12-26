# Service Providers

Até agora, aprendemos [como vincular dependências](https://github.com/tavaresgerson/adonisdocbr/blob/master/doc/concept/ioc-container.md#depend%C3%AAncias-de-liga%C3%A7%C3%A3o) ao contêiner de IoC.

Neste guia, damos um passo adiante para aprender sobre os provedores de serviços e como 
distribuir pacotes que funcionam bem com o ecossistema da AdonisJS.

## Introdução
Sabemos que o método `ioc.bind` pode ser usado para registrar ligações. No entanto, ainda estamos para definir 
onde chamar esse método.

É aqui que os prestadores de serviços entram em cena. Os provedores de serviços são classes ES6 puras com métodos 
de ciclo de vida que são usados para registrar e inicializar ligações.

Por exemplo:

``` js
const { ServiceProvider } = require('@adonisjs/fold')

class MyProvider extends ServiceProvider {
  register () {
    // registrar ligações
  }

  boot () {
    // opcionalmente, faça alguma configuração inicial
  }
}

module.exports = MyProvider
```

+ O método `register` é usado para registrar ligações e você nunca deve tentar usar nenhuma outra ligação dentro desse método.
+ O método `boot` é chamado quando todos os provedores foram registrados e é o lugar certo para usar as ligações existentes para iniciar o estado do aplicativo.

Por exemplo, adicionando uma view global:

``` js
boot () {
  const View = this.app.use('Adonis/Src/View')
  View.global('time', () => new Date().getTime())
}
```

## Pacote npm como Provedor de Serviços
Vamos ver como podemos agrupar um pacote npm existente em um provedor de serviços.

> Não use pacotes como o `lodash` em um provedor de serviços, pois ele pode ser usado diretamente e 
não requer nenhum processo de configuração.

Todos os provedores específicos de aplicativos vivem dentro do diretório `providers` na raiz do seu aplicativo:


### Estrutura de diretórios

```
├── app
└── providers
  └── Queue
    └── index.js
    └── Provider.js
└── start
```

### Princípios
Nós estamos partindo para a [fila de abelha](https://github.com/bee-queue/bee-queue) como um provedor.

Aqui está um conjunto de princípios que queremos seguir:

+ O usuário final não precisa se preocupar em configurar o provedor de filas.
+ Toda a configuração deve estar dentro do arquivo `config/queue.js`.
+ Deve ser simples o suficiente para criar novas filas com uma configuração diferente.

### Implementação
Vamos implementar o wrapper dentro do arquivo `providers/Queue/index.js`:

``` js
'use strict'

const BeeQueue = require('bee-queue')

class Queue {
  constructor (Config) {
    this.Config = Config
    this._queuesPool = {}
  }

  get (name) {
    /**
     * Se já houver uma instância da fila, retorne-a
     */
    if (this._queuesPool[name]) {
      return this._queuesPool[name]
    }

    /**
     * Leia a configuração usando o Config
     * provider
     */
    const config = this.Config.get(`queue.${name}`)

    /**
     * Crie uma nova instância da fila e salve sua referência
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

A classe acima tem apenas um método chamado get, que retorna uma instância da fila para um determinado nome da fila .

As etapas executadas pelo método `get` são:

+ Procure uma instância de um determinado nome de fila.
+ Se uma instância não existir, leia a configuração usando o Provedor de Configuração.
+ Crie uma nova instância `bee-queue` e armazene dentro de um objeto para uso futuro.
+ Finalmente, retorne a instância.

A classe `Queue` é pura, pois não possui dependências rígidas na estrutura e depende da Injeção de Dependências 
para fornecer o Provedor de Configuração.

### Provedor de serviço
Agora vamos criar um provedor de serviços que faça a instanciação dessa classe e a vincule ao contêiner de IoC.

O código vive dentro de `providers/Queue/Provider.js`:

``` js
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

Observe que `this.app` é uma referência ao objeto `ioc`, o que significa que, em vez de chamar `ioc.singleton`, 
chamamos `this.app.singleton`.

Por fim, precisamos registrar esse provedor como qualquer outro provedor dentro do arquivo `start/app.js`:

``` js
const providers = [
  path.join(__dirname, '..', 'providers', 'Queue/Provider')
]
```

Agora, podemos chamar `use('Bee/Queue')` dentro de qualquer arquivo em seu aplicativo para usá-lo:

``` js
const Queue = use('Bee/Queue')

Queue
  .get('addition')
  .createJob({ x: 2, y: 3 })
  .save()
```

## Distribuindo como um pacote
O provedor da [fila de abelhas](https://adonisjs.com/docs/4.1/service-providers#_npm_package_as_a_service_provider) que criamos vive 
na mesma estrutura do projeto. No entanto, podemos extraí-lo em seu próprio pacote.

Vamos criar um novo diretório com a seguinte estrutura de diretório:

```
└── providers
    └── QueueProvider.js
├── src
  └── Queue
    └── index.js
└── package.json
```

Tudo o que fizemos foi mover a implementação `Queue` real para o diretório `src` e renomear o arquivo do 
provedor para `QueueProvider.js`.

Além disso, temos que fazer as seguintes alterações:

+ Como `Queue/index.js` está em um diretório diferente, precisamos ajustar a referência a esse arquivo dentro 
do nosso provedor de serviços.
+ Renomeie o namespace `Bee/Queue` para um nome mais adequado, com menos chances de colisão. Por exemplo, ao criar esse provedor para AdonisJs, o nomearemos como `Adonis/Addons/Queue`.

``` js
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

> Não inclua `@adonisjs/fold` como dependência para o seu provedor, pois ele deve ser instalado apenas pelo aplicativo 
> principal. Para teste, você pode instalá-lo como uma dependência de desenvolvedor.

### Escrevendo testes de provedor
O AdonisJs usa oficialmente o [japa](https://github.com/thetutlage/japa) para escrever testes de provedor, embora você possa usar qualquer mecanismo de teste que desejar.

A configuração do japa é simples:

```
> npm i --save-dev japa
```

Crie os testes dentro do diretório `test`:

```
> mkdir test
```

Os testes podem ser executados rodando o arquivo de teste usando o comando `node`:

```
> node test/example.spec.js
```

Para executar todos os seus testes juntos, você pode usar `japa-cli`:

```
> npm i --save-dev japa-cli
```

E execute todos os testes via:

```
> ./node_modules/.bin/japa
```

## Perguntas frequentes

#### Por que não instalar `@adonisjs/fold` como uma dependência?
Este requisito é para que a versão principal do aplicativo `@adonisjs/fold` esteja sempre instalada para uso pelo 
seu provedor. Caso contrário, cada provedor acabará enviando sua própria versão do contêiner AdonisJS IoC. Se 
você já trabalhou com o gulp, eles também recomendam (p: 14) não instalar o gulp como uma dependência ao criar 
plug-ins.
