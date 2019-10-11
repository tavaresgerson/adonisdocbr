# IOC Container

## Introdução
Antes de entender o uso e os benefícios do contêiner de Inversão de Controle (IoC), precisamos dar um passo atrás e entender 
os problemas de gerenciamento de dependência enfrentados pelas grandes bases de código.

## Abstrações inúteis
Muitas vezes você se depara com uma situação em que precisa criar abstrações inúteis para uma biblioteca gerenciar seu ciclo de vida.

Por exemplo, para garantir que o banco de dados seja conectado apenas uma vez, você pode mover todo o código de configuração do 
banco de dados para seu próprio arquivo (por exemplo, `lib/database.js`) e, em seguida, exigir em qualquer lugar dentro de seu
aplicativo:

``` js
const knex = require('knex')

const connection = knex({
  client: 'mysql',
  connection: {}
})

module.exports = connection
```  

Agora, em vez de requisitar `knex` diretamente, você pode exigir `lib/database.js` onde for necessário.

Isso é bom para uma única dependência, mas à medida que o aplicativo cresce, você encontra vários desses arquivos crescendo dentro 
da sua base de código, o que não é o ideal.

## Gestão de dependências
Um dos maiores problemas que grandes bases de códigos sofrem é o gerenciamento de dependências.

Como as dependências não se conhecem, o desenvolvedor precisa conectá-las de alguma forma.

Vamos pegar o exemplo de sessões armazenadas em um banco de dados do redis:

``` js
  class Session {
    constructor (redis) {
      // precisa da instância de Redis
    }
  }
  
  class Redis {
    constructor (config) {
      // precisa da instância de Config
    }
  }
  
  class Config {
    constructor (configDirectory) {
      // precisa do caminho para o diretório config
    }
  }
```

Como você pode ver, a classe `Session` é dependente da classe `Redis`, a classe `Redis` é dependente da classe Config, e assim 
por diante.

Ao usar a classe `Session`, temos que construir suas dependências corretamente:

``` js
const config = new Config(configDirectory)
const redis = new Redis(config)
const session = new Session(redis)
```

Como a lista de dependências pode aumentar com base nos requisitos do projeto, você pode imaginar rapidamente como esse processo 
de instanciação sequencial pode começar a ficar fora de controle!

É aqui que o contêiner IoC é resgatado, assumindo a responsabilidade de resolver suas dependências para você.

## Teste doloroso
Quando não estiver usando um contêiner IoC, você terá que criar maneiras diferentes de simular dependências ou confiar em 
bibliotecas como [sinonjs](http://sinonjs.org/).

Ao usar o contêiner IoC, é simples criar falsificações, pois todas as dependências são resolvidas do contêiner IoC e não diretamente 
do sistema de arquivos.

## Dependências de ligação
Digamos que queremos vincular a biblioteca Redis ao contêiner IoC, certificando-se de que ela saiba como se compor.

> Não há molho secreto para o contêiner IoC. É uma ideia relativamente simples que controla a composição e a resolução de 
> módulos, abrindo um novo mundo de possibilidades.

O primeiro passo é criar a implementação real do `Redis` e definir todas as dependências como parâmetros do `constructor`:

``` js
class Redis {
  constructor (Config) {
    const redisConfig = Config.get('redis')
    // conectar ao servidor Redis 
  }
}
  
module.exports = Redis
```
  
Observe que o `Config` é uma dependência de construtor e não uma instrução `require` codificada.

Em seguida, vinculemos nossa classe Redis ao contêiner IoC como My/Redis

``` js
const { ioc } = require('@adonisjs/fold')
const Redis = require('./Redis')

ioc.bind('My/Redis', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new Redis(Config)
})
```

Podemos então usar nossa ligação `My/Redis` assim:

``` js
const redis = ioc.use('My/Redis')
```

* O método `ioc.bind` usa dois parâmetros:
  * O nome da ligação (por exemplo, `My/Redis`)
  * Uma função de factory executada toda vez que você acessa a ligação, retornando o valor final para a ligação
* Como estamos usando o contêiner IoC, extraímos as ligações existentes (por exemplo, `Config`) e as passamos para a classe `Redis`.
* Finalmente, retornamos uma nova instância do `Redis`, configurada e pronta para uso.

## Singletons
Há um problema com a chamada `My/Redis` que acabamos de criar.

Cada vez que o buscamos no contêiner IoC, ele retorna uma nova instância `Redis`, criando uma nova conexão com o servidor Redis.

Para superar esse problema, o contêiner IoC permite que você defina singletons:

``` js
ioc.singleton('My/Redis', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new Redis(Config)
})
```
Em vez de usar `ioc.bind`, usamos `ioc.singleton`, que armazena em cache seu primeiro valor de retorno e o reutiliza para 
retornos futuros.

## Resolvendo Dependências
Simplesmente chame o método `ioc.use` e dê a ele um namespace para resolver:

``` js
const redis = ioc.use('My/Redis')
``` 

O método de uso global também pode ser usado:

``` js
const redis = use('My/Redis')
```

As etapas executadas ao resolver uma dependência do contêiner IoC são:

* Procure por um registro fake.
* Em seguida, encontre a ligação real.
* Procure um alias e, se encontrado, repita o processo usando o nome real da ligação.
* Resolva como um caminho 'autoloaded'.
* Retorno ao método `require` nativo do Node.js.

## Aliases
Como as ligações de contêiner do IoC devem ser exclusivas, usamos o seguinte padrão para vincular nomes: `Project/Scope/Module`.

Quebrando isso, usaremos o `Adonis/Src/Config` como exemplo:

+ `Adonis` é o nome do projeto (pode ser o nome da sua empresa)
+ `Src` é o escopo, já que essa ligação é parte do núcleo (para pacotes de primeiro uso, usamos a palavra-chave `Addon`)
+ `Config` é o nome real do módulo

Como às vezes é difícil lembrar e digitar namespaces completos, o contêiner IoC permite que você defina aliases para eles.

Os aliases são definidos dentro do objeto de aliases do arquivo `start/app.js`.

> AdonisJs pré-registra aliases para módulos embutidos como `Route`, `View`, `Model` e assim por diante. No entanto, você sempre pode 
> substituí-los conforme mostrado abaixo.

## Autoloading
Em vez de apenas vincular dependências ao contêiner IoC, você também pode definir um diretório para ser carregado automaticamente 
pelo contêiner IoC.

Não se preocupe, ele não carrega todos os arquivos do diretório, mas considera os caminhos de diretório como parte do processo 
de resolução de dependência.

Por exemplo, o diretório de aplicativos do AdonisJs é carregado automaticamente no namespace do aplicativo, o que significa que 
você pode exigir todos os arquivos do diretório do aplicativo sem digitar os caminhos relativos.

Por exemplo:

``` js
class FooService {
}
  
module.exports = FooService
```

Pode ser requerido como:
``` js
const Foo = use('App/Services/Foo')
```  

Sem o autloading, ele teria que ser exigido conforme `require('../../Services/Foo')`.

Portanto, pense no carregamento automático como uma maneira mais legível e consistente de exigir arquivos.

Além disso, você pode definir facilmente fakes para eles também.

## FAQ’s

### 1. Eu tenho que ligar tudo dentro do contêiner IoC?
Não. As ligações de contêineres do IoC só devem ser usadas quando você quiser abstrair a configuração de uma biblioteca/módulo com 
suas próprias coisas. Além disso, considere o uso de provedores de serviços quando você quiser distribuir dependências e desejar 
que elas sejam compatíveis com o ecossistema do AdonisJs.

### 2. Como faço para simular ligações?
Não há necessidade de falsificar ligações, pois o AdonisJs permite que você implemente falsificações. Saiba mais sobre falsificações
[aqui](https://adonisjs.com/docs/4.1/testing-fakes).

### 3. Como eu envolvo um módulo npm como provedor de serviços?
[Aqui](https://adonisjs.com/docs/4.1/service-providers) está o guia completo para isso.
