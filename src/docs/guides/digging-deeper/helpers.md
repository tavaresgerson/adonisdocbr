# Helpers

O AdonisJS agrupa os utilitários usados ​​pelo framework ou pelos pacotes do ecossistema em um módulo Helpers e os disponibiliza para o código do seu aplicativo.

Como esses utilitários já estão instalados e usados ​​pelo framework, o módulo helpers não adiciona nenhum inchaço adicional ao seu `node_modules`.

## String helpers
Os string helpers expõem os seguintes métodos de transformação.

### `camelCase`
Converte uma string para sua versão `camelCase`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.camelCase('hello-world') // helloWorld
```

### `snakeCase`
Converte uma string para sua versão `snake_case`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.snakeCase('helloWorld') // hello_world
```

### `dashCase`
Converte uma string para sua versão `dash-case`. Opcionalmente, você também pode colocar a primeira letra de cada segmento em maiúscula.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.dashCase('helloWorld') // hello-world
string.dashCase('helloWorld', { capitalize: true }) // Hello-World
```

### `pascalCase`
Converte uma string para sua versão `PascalCase`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.pascalCase('helloWorld') // HelloWorld
```

### `capitalCase`
Coloca uma string em maiúsculas

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.capitalCase('helloWorld') // Hello World
```

### `sentenceCase`
Converte uma string para uma frase

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.sentenceCase('hello-world') // Hello world
```

### `dotCase`
Converte uma string para sua versão `dot.case`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.dotCase('hello-world') // hello.world
```

### `noCase`
Remove todos os tipos de maiúsculas e minúsculas

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.noCase('hello-world') // hello world
string.noCase('hello_world') // hello world
string.noCase('helloWorld') // hello world
```

### `titleCase`
Converte uma frase para maiúsculas e minúsculas

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.titleCase('Here is a fox') // Here Is a Fox
```

### `pluralize`
Pluraliza uma palavra.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.pluralize('box') // boxes
string.pluralize('i') // we
```

Você também pode definir suas próprias regras irregulares usando o método `defineIrregularRule`. O método aceita a versão singular como o primeiro argumento e a versão plural como o segundo argumento.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.defineIrregularRule('auth', 'auth')
string.plural('auth') // auth
```

Você também pode definir suas próprias regras incontáveis ​​usando o método `defineUncountableRule`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.defineUncountableRule('login')
string.plural('login') // home
```

### `truncate`
Truncar uma string após um número determinado de caracteres

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.truncate(
  'This is a very long, maybe not that long title',
  12
) // This is a ve...
```

Por padrão, a string é truncada exatamente após os caracteres fornecidos. No entanto, você pode instruir o método a esperar que as palavras sejam concluídas.

```ts
string.truncate(
  'This is a very long, maybe not that long title',
  12,
  {
    completeWords: true
  }
) // This is a very...
```

Além disso, é possível personalizar o sufixo.

```ts
string.truncate(
  'This is a very long, maybe not that long title',
  12,
  {
    completeWords: true,
    suffix: ' <a href="/1"> Read more </a>',
  }
) // This is a very <a href="/1"> Read more </a>
```

### `excerpt`
O método `excerpt` é o mesmo que o método `truncate`. No entanto, ele retira o HTML da string.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.excerpt(
  '<p>This is a <strong>very long</strong>, maybe not that long title</p>',
  12
) // This is a very...
```

### `condenseWhitespace`
Condensa espaços em branco de uma string fornecida. O método remove o espaço em branco de `left`, `right` e vários espaços em branco entre as palavras.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.condenseWhitespace(' hello  world ')
// hello world
```

### `escapeHTML`
Escape HTML da string

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.escapeHTML('<p> foo © bar </p>')
// &lt;p&gt; foo © bar &lt;/p&gt;
```

Além disso, você também pode codificar símbolos não ASCII.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.escapeHTML(
  '<p> foo © bar </p>',
  {
    encodeSymbols: true
  }
)
// &lt;p&gt; foo &#xA9; bar &lt;/p&gt;
```

### `encodeSymbols`
Codifique símbolos. Confira [he](https://npm.im/he) para opções disponíveis

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.encodeSymbols('foo © bar')
// foo &#xA9; bar
```

### `toSentence`
Junte uma matriz de palavras com um separador.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.toSentence([
  'route',
  'middleware',
  'controller'
]) // route, middleware, and controller

string.toSentence([
  'route',
  'middleware'
]) // route and middleware
```

Você pode definir as seguintes opções para personalizar a saída.

- `separator` é o valor entre duas palavras, exceto a última.
- `pairSeparator` é o valor entre a primeira e a última palavra. Usado somente quando há duas palavras
- `lastSeparator` é o valor entre a segunda última e a última palavra. Usado somente quando há mais de duas palavras.

```ts
string.toSentence([
  'route',
  'middleware',
  'controller'
], {
  separator: '/ ',
  lastSeparator: '/or '
}) // route/ middleware/or controller
```

### `prettyBytes`
Converte o valor de bytes para uma string legível por humanos. Para opções, consulte o pacote [bytes](https://www.npmjs.com/package/bytes).

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.prettyBytes(1024) // 1KB
string.prettyBytes(1024, { unitSeparator: ' ' }) // 1 KB
```

### `toBytes`
Converte string legível por humanos para bytes. Este método é o oposto do método `prettyBytes`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.toBytes('1KB') // 1024
```

### `prettyMs`
Converte o tempo em milissegundos para uma string legível por humanos

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.prettyMs(60000) // 1min
string.prettyMs(60000, { long: true }) // 1 minute
```

### `toMs`
Converte uma string legível por humanos para milissegundos. Este método é o oposto do método `prettyMs`.

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.toMs('1min') // 60000
```

### `ordinalize`
Ordinalize uma string ou um valor numérico

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.ordinalize(1) // 1st
string.ordinalize(99) // 99th
```

### `generateRandom`
Gera uma string aleatória criptograficamente forte

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.generateRandom(32)
```

### `isEmpty`
Descubra se um valor está vazio. Também verifica strings vazias com todos os espaços em branco

```ts
import { string } from '@ioc:Adonis/Core/Helpers'

string.isEmpty('') // true
string.isEmpty('      ') // true
```

## Detecção de tipo
A detecção de tipo em JavaScript é muito fraca e frequentemente leva a bugs inesperados. Por exemplo: `typeof null` é **objeto** e `typeof []` também é um **objeto**.

Você pode usar o auxiliar `types` para ter uma verificação de tipo mais precisa e consistente em seu aplicativo.

### `lookup`
O método `lookup` retorna o tipo para um valor fornecido.

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.lookup({}) // object
types.lookup([]) // array
types.lookup(Object.create(null)) // object
types.lookup(null) // null
types.lookup(function () {}) // function
types.lookup(class Foo {}) // class
types.lookup(new Map()) // map
```

### `isNull`
Descubra se o valor fornecido é nulo

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isNull(null) // true
```

### `isBoolean`
Descubra se o valor fornecido é um booleano

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isBoolean(true) // true
```

### `isBuffer`
Descubra se o valor fornecido é um buffer

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isBuffer(new Buffer()) // true
```

### `isNumber`
Descubra se o valor fornecido é um número

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isNumber(100) // true
```

### `isString`
Descubra se o valor fornecido é uma string

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isString('hello') // true
```

### `isArguments`
Descubra se o valor fornecido é um objeto de argumentos

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

function foo() {
  types.isArguments(arguments) // true
}
```

### `isObject`
Descubra se o valor fornecido é um objeto simples

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isObject({}) // true
```

### `isDate`
Descubra se o valor fornecido é um objeto de data

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isDate(new Date()) // true
```

### `isArray`
Descubra se o valor fornecido é uma matriz

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isArray([1, 2, 3]) // true
```

### `isRegexp`
Descubra se o valor fornecido é uma expressão regular

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isRegexp(/[a-z]+/) // true
```

### `isError`
Descubra se o valor fornecido é uma instância do objeto de erro.

```ts
import { types } from '@ioc:Adonis/Core/Helpers'
import { Exception } from '@poppinss/utils'

types.isError(new Error('foo')) // true
types.isError(new Exception('foo')) // true
```

### `isFunction`
Descubra se o valor fornecido é uma função

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isFunction(function foo() {}) // true
```

### `isClass`
Descubra se o valor fornecido é um construtor de classe. Usa regex para distinguir entre uma função e uma classe.

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

class User {}

types.isClass(User) // true
types.isFunction(User) // false
```

### `isInteger`
Descubra se o valor fornecido é um inteiro.

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isInteger(22.00) // true
types.isInteger(22) // true
types.isInteger(-1) // true
types.isInteger(-1.00) // true

types.isInteger(22.10) // false
types.isInteger(.3) // false
types.isInteger(-.3) // false
```

### `isFloat`
Descubra se o valor fornecido é um número float.

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isFloat(22.10) // true
types.isFloat(-22.10) // true
types.isFloat(.3) // true
types.isFloat(-.3) // true

types.isFloat(22.00) // false
types.isFloat(-22.00) // false
types.isFloat(-22) // false
```

### `isDecimal`
Descubra se o valor fornecido tem um decimal. O valor pode ser uma string ou um número. Os valores numéricos são convertidos para uma string chamando o método `toString()` no próprio valor.

A conversão de string é realizada para testar o valor em relação a uma regex, pois não há como encontrar um valor decimal em JavaScript nativamente.

```ts
import { types } from '@ioc:Adonis/Core/Helpers'

types.isDecimal('22.10') // true
types.isDecimal(22.1) // true

types.isDecimal('-22.10') // true
types.isDecimal(-22.1) // true

types.isDecimal('.3') // true
types.isDecimal(0.3) // true

types.isDecimal('-.3') // true
types.isDecimal(-0.3) // true

types.isDecimal('22.00') // true
types.isDecimal(22.0) // false (gets converted to 22)

types.isDecimal('-22.00') // true
types.isDecimal(-22.0) // false (gets converted to -22)

types.isDecimal('22') // false
types.isDecimal(22) // false

types.isDecimal('0.0000000000001') // true
types.isDecimal(0.0000000000001) // false (gets converted to 1e-13)
```

## `safeEqual`
Compara dois valores entre si evitando o [ataque de temporização](https://en.wikipedia.org/wiki/Timing_attack). Este método usa internamente o método [crypto.timingSafeEqual](https://nodejs.org/api/crypto.html#crypto_crypto_timingsafeequal_a_b), mas também pode comparar duas strings.

```ts
import { safeEqual } from '@ioc:Adonis/Core/Helpers'

if (safeEqual('hello world', 'hello world')) {
}
```

## `requireAll`
Auxiliar para exigir todos os arquivos `.js`, `.ts` e `.json` de um diretório. Este método funciona apenas com módulos commonjs e não com módulos ES.

```ts
import { join } from 'path'
import { requireAll } from '@ioc:Adonis/Core/Helpers'

const configTree = requireAll(join(__dirname, 'config'))
```

Os arquivos são importados recursivamente por padrão. No entanto, você pode desativar a varredura recursiva definindo o segundo argumento como `false`

```ts
requireAll(join(__dirname, 'config'), false)
```

Uma exceção é gerada quando o diretório raiz está ausente. No entanto, você pode instruir o método a ignorar o diretório ausente definindo o terceiro argumento como `true`.

```ts
requireAll(join(__dirname, 'config'), true, true)
```

## `fsReadAll`
Verifique recursivamente todos e colete caminhos para todos os arquivos `.js`, `.ts` e `.json` de um determinado diretório.

```ts
import { join } from 'path'
import { fsReadAll } from '@ioc:Adonis/Core/Helpers'

fsReadAll(join(__dirname, 'config'))
// ['app.ts', 'bodyparser.ts', 'cors.ts']
```

Opcionalmente, você pode definir uma função de filtro personalizada para ignorar determinados caminhos. Definir um filtro personalizado remove o filtro existente de selecionar apenas arquivos `.js`, `.ts` e `.json`.

```ts
fsReadAll(join(__dirname, 'config'), (filePath) => {
  return filePath.endsWith('.md')
})
```

## `base64`
Codifique/decodifique valores Base64. Use os métodos `urlEncode` e `urlDecode` se quiser passar o valor codificado para uma URL.

```ts
import { base64 } from '@ioc:Adonis/Core/Helpers'

base64.encode('hello world')
base64.decode(base64.encode('hello world'))

// URL safe encoding
base64.urlEncode('hello world')
base64.urlDecode(base64.urlEncode('hello world'))
```

Você também pode definir uma codificação personalizada para o valor de entrada.

```ts
const encoded = base64.encode(bufferValue, 'binary')
base64.decode(encoded, 'binary')
```

## `interpolate`
Um método auxiliar leve para interpolar chaves dentro de uma string. Este método não substitui nenhum mecanismo de modelo.

```ts
import { interpolate } from '@ioc:Adonis/Core/Helpers'

interpolate('hello {{ username }}', { username: 'virk' })

// Nested values
interpolate('hello {{ user.username }}', {
  user: { username: 'virk' }
})

// Array of objects
interpolate('hello {{ users.0.username }}', {
  users: [{ username: 'virk' }]
})

// Array of literal values
interpolate('hello {{ scores.0 }}', {
  scores: [67, 80]
})
```

## `compose`
O JavaScript não tem um conceito de herança de várias classes juntas, e nem o TypeScript. No entanto, a [documentação oficial](https://www.typescriptlang.org/docs/handbook/mixins.html) do TypeScript fala sobre o conceito de mixins.

De acordo com a documentação do TypeScript, você pode criar e aplicar mixins da seguinte forma.

```ts
type Constructor = new (...args: any[]) => any

const UserWithEmail = <T extends Constructor>(superclass: T) => {
  return class extends superclass {
    public email: string
  }
}

const UserWithPassword = <T extends Constructor>(superclass: T) => {
  return class extends superclass {
    public password: string
  }
}

class BaseModel {}
class User extends UserWithPassword(UserWithEmail(BaseModel)) {}
```

Os mixins são quase uma maneira perfeita de herdar várias classes. Recomendo ler [este artigo](https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) para o mesmo.

No entanto, a sintaxe de aplicação de vários mixins é feia, pois você tem que aplicar **mixins sobre mixins**, criando uma hierarquia aninhada, conforme mostrado abaixo.

```ts
class User extends UserWithAttributes(
  UserWithAge(
    UserWithPassword(
      UserWithEmail(BaseModel)
    )
  )
) {}
```

O método `compose` é um pequeno utilitário para melhorar um pouco a sintaxe.

```ts
import { compose } from '@ioc:Adonis/Core/Helpers'

class User extends compose(
  BaseModel,
  UserWithPassword,
  UserWithEmail,
  UserWithAge,
  UserWithAttributes
) {}
```

#### Mixins gotchas
TypeScript tem um [problema aberto](https://github.com/microsoft/TypeScript/issues/37142) relacionado aos argumentos do construtor da classe mixin ou da classe base.

TypeScript espera que todas as classes usadas na cadeia mixin tenham um construtor com apenas um argumento de `...args: any[]`. Por exemplo: **O código a seguir funcionará bem em tempo de execução, mas o compilador TypeScript reclama sobre isso**.

```ts
class BaseModel {
  constructor(name: string) {}
}

const UserWithEmail = <T extends typeof BaseModel>(superclass: T) => {
  return class extends superclass {
    // ERROR: A mixin class must have a constructor with a single rest parameter of type 'any[]'.ts(2545)
    public email: string
  }
}

class User extends compose(BaseModel, UserWithEmail) {}
```

Você pode contornar isso substituindo o construtor da classe base usando o tipo `NormalizeConstructor`.

```ts
import {
  compose,
  NormalizeConstructor
} from '@ioc:Adonis/Core/Helpers'

const UserWithEmail = <T extends NormalizeConstructor<typeof BaseModel>>(
  superclass: T
) => {
  return class extends superclass {
    public email: string
  }
}
```

## `cuid`
Gere um [ID resistente a colisões](https://github.com/ericelliott/cuid).

```ts
import { cuid } from '@ioc:Adonis/Core/Helpers'

cuid()
// cjld2cjxh0000qzrmn831i7rn
```
