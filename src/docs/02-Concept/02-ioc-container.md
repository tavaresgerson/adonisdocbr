---
permalink: ioc-container
title: IoC Container
---

# Contêiner IoC

## Introdução
Antes de entender o uso e os benefícios do contêiner **Inversão de Controle (IoC)**, precisamos dar um passo para trás e entender os problemas de gerenciamento de dependência enfrentados por grandes bases de código.

### Abstrações inúteis
Muitas vezes você se depara com uma situação em que precisa criar abstrações inúteis para uma biblioteca para gerenciar seu ciclo de vida.

Por exemplo, para garantir que o banco de dados seja conectado apenas uma vez, você pode mover todo o código de configuração do banco de dados para seu próprio arquivo (por exemplo, `lib/database.js`) e então `require` em todos os lugares dentro do seu aplicativo:

```js
// .lib/database.js

const knex = require('knex')

const connection = knex({
  client: 'mysql',
  connection: {}
})

module.exports = connection
```

Agora, em vez de exigir `knex` diretamente, você pode exigir `lib/database.js` onde for necessário.

Isso é bom para uma única dependência, mas conforme o aplicativo cresce, você encontrará vários desses arquivos crescendo dentro do seu código-base, o que não é o ideal.

### Gerenciamento de dependências
Um dos maiores problemas que grandes bases de código sofrem é o gerenciamento de dependências.

Como as dependências não sabem umas das outras, o desenvolvedor precisa conectá-las de alguma forma.

Vamos pegar o exemplo de *sessões* armazenadas em um banco de dados *redis*:

```js
class Session {
  constructor (redis) {
    // precisa de instância Redis
  }
}

class Redis {
  constructor (config) {
    // precisa de instância de configuração
  }
}

class Config {
  constructor (configDirectory) {
    // precisa do caminho do diretório de configuração
  }
}
```

Como você pode ver, a classe `Session` é dependente da classe `Redis`, a classe `Redis` é dependente da classe `Config` e assim por diante.

Ao usar a classe `Session`, temos que construir suas dependências corretamente:

```js
const config = new Config(configDirectory)
const redis = new Redis(config)
const session = new Session(redis)
```

Como a lista de dependências pode aumentar com base nos requisitos do projeto, você pode imaginar rapidamente como esse processo de instanciação sequencial pode começar a sair do controle!

É aqui que o contêiner IoC vem para o resgate, assumindo a responsabilidade de resolver suas dependências para você.

### Testes dolorosos
Quando não estiver usando um contêiner IoC, você precisa inventar maneiras diferentes de simular dependências ou confiar em bibliotecas como [sinonjs](http://sinonjs.org/).

Ao usar o contêiner IoC, é simples link:testing-fakes#_self_implementing_fakes[criar fakes], já que todas as dependências são resolvidas do contêiner IoC e não do sistema de arquivos diretamente.

## Vinculando dependências
Digamos que queremos vincular a biblioteca `Redis` dentro do contêiner IoC, certificando-nos de que ela saiba como se compor.

::: warning NOTA
Não há nenhum ingrediente secreto para o contêiner IoC. É uma ideia relativamente simples que controla a composição e a resolução de módulos, abrindo um mundo totalmente novo de possibilidades.
:::

O primeiro passo é criar a implementação real do `Redis` e definir todas as dependências como parâmetros `constructor`:

```js
class Redis {
  constructor (Config) {
    const redisConfig = Config.get('redis')
    // conectar ao servidor redis
  }
}

module.exports = Redis
```

Observe que `Config` é uma dependência do construtor e não uma declaração `require` codificada.

Em seguida, vamos vincular nossa classe `Redis` ao contêiner IoC como `My/Redis`:

```js
const { ioc } = require('@adonisjs/fold')
const Redis = require('./Redis')

ioc.bind('My/Redis', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new Redis(Config)
})
```

Podemos então usar nossa vinculação `My/Redis` assim:

```js
const redis = ioc.use('My/Redis')
```

1. O método `ioc.bind` recebe dois parâmetros: +
   - O nome da vinculação (por exemplo, `My/Redis`)
   - Uma função *de fábrica* executada toda vez que você acessa a vinculação, retornando o valor final para a vinculação
2. Como estamos usando o contêiner IoC, puxamos todas as vinculações existentes (por exemplo, `Config`) e as passamos para a classe `Redis`.
3. Finalmente, retornamos uma nova instância de `Redis`, configurada e pronta para uso.

### Singletons
Há um problema com a vinculação `My/Redis` que acabamos de criar.

Cada vez que o buscamos do contêiner IoC, ele retorna uma nova instância `Redis`, criando uma nova conexão com o servidor Redis.

Para superar esse problema, o contêiner IoC permite que você defina **singletons**:

```js
ioc.singleton('My/Redis', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new Redis(Config)
})
```

Em vez de usar `ioc.bind`, usamos `ioc.singleton`, que armazena em cache seu primeiro valor de retorno e o reutiliza para retornos futuros.

## Resolvendo dependências
Basta chamar o método `ioc.use` e ​​dar a ele um namespace para resolver:

```js
const redis = ioc.use('My/Redis')
```

O método global `use` também pode ser usado:

```js
const redis = use('My/Redis')
```

As etapas executadas ao resolver uma dependência do contêiner IoC são:

1. Procure por um fake registrado.
2. Em seguida, encontre a ligação real.
3. Procure um alias e, se encontrado, repita o processo usando o nome de vinculação real.
4. Resolva como um caminho carregado automaticamente.
5. Retorne ao método nativo `require` do Node.js.

### Aliases
Como as vinculações do contêiner IoC devem ser exclusivas, usamos o seguinte padrão para nomes de vinculação: `Project/Scope/Module`.

Decompondo, usando `Adonis/Src/Config` como exemplo:

- `Adonis` é o nome do **Projeto** (pode ser o nome da sua empresa)
- `Src` é o **Escopo**, pois essa vinculação faz parte do núcleo (para pacotes de primeira parte, usamos a palavra-chave `Addon`)
- `Config` é o nome real do **Módulo**

Como às vezes é difícil lembrar e digitar namespaces completos, o contêiner IoC permite que você defina *aliases* para eles.

Aliases são definidos dentro do objeto `aliases` do arquivo `start/app.js`.

::: warning NOTA
O AdonisJs pré-registra aliases para módulos internos como `Route`, `View`, `Model` e assim por diante. No entanto, você sempre pode substituí-los, conforme mostrado abaixo.
:::

```js
// .start/app.js

aliases: {
  MyRoute: 'Adonis/Src/Route'
}
```

```js
const Route = use('MyRoute')
```

### Carregamento automático
Em vez de apenas vincular dependências ao contêiner IoC, você também pode definir um diretório para ser carregado automaticamente pelo contêiner IoC.

*Não se preocupe*, ele não carrega todos os arquivos do diretório, mas considera os caminhos do diretório como parte do processo de resolução de dependências.

Por exemplo, o diretório `app` do AdonisJs é carregado automaticamente sob o namespace `App`, o que significa que você pode exigir todos os arquivos do diretório `app` sem digitar caminhos relativos.

Por exemplo:

```js
// .app/Services/Foo.js

class FooService {
}

module.exports = FooService
```

Pode ser necessário como:

```js
// .app/Controllers/Http/UserController.js

const Foo = use('App/Services/Foo')
```

Sem o carregamento automático, ele teria que ser necessário como `require('../../Services/Foo')`.

Então pense no carregamento automático como uma maneira mais legível e consistente de exigir arquivos.

Além disso, você pode definir facilmente [fakes](/original/markdown/10-testing/05-Fakes.md) para eles também.

## FAQ's

#### **Eu tenho que vincular tudo dentro do contêiner IoC?**
Não. As vinculações do contêiner IoC devem ser usadas somente quando você quiser abstrair a configuração de uma biblioteca/módulo para sua própria coisa. Além disso, considere usar [provedores de serviço](/original/markdown/02-Concept/03-service-providers.md) quando quiser distribuir dependências e quiser que elas funcionem bem com o ecossistema AdonisJs.

#### **Como faço para simular vinculações?**
Não há necessidade de simular vinculações, pois o AdonisJs permite que você implemente *fakes*. Saiba mais sobre fakes [aqui](/original/markdown/10-testing/05-Fakes.md).

#### **Como encapsular um módulo npm como um provedor de serviços?**
[Aqui está](/original/markdown/02-Concept/03-service-providers.md) o guia completo para isso.
