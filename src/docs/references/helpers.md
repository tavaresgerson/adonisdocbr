---
resumo: O AdonisJS agrupa seus utilitários no módulo `helpers` e os disponibiliza para o código do seu aplicativo.
---

# Referência de Helpers

O AdonisJS agrupa seus utilitários no módulo `helpers` e os disponibiliza para o código do seu aplicativo. Como esses utilitários já estão instalados e são usados ​​pelo framework, o módulo `helpers` não adiciona nenhum bloat adicional ao seu `node_modules`.

Os métodos helper são exportados dos seguintes módulos.

```ts
import is from '@adonisjs/core/helpers/is'
import * as helpers from '@adonisjs/core/helpers'
import string from '@adonisjs/core/helpers/string'
```

## `escapeHTML`

Escape de entidades HTML em um valor de string. Por baixo dos panos, usamos o pacote [he](https://www.npmjs.com/package/he#heescapetext).

```ts
import string from '@adonisjs/core/helpers/string'

string.escapeHTML('<p> foo © bar </p>')
// &lt;p&gt; foo © bar &lt;/p&gt;
```

Opcionalmente, você pode codificar símbolos não ASCII usando a opção `encodeSymbols`.

```ts
import string from '@adonisjs/core/helpers/string'

string.escapeHTML('<p> foo © bar </p>', {
  encodeSymbols: true,
})
// &lt;p&gt; foo &#xA9; bar &lt;/p&gt;
```

## `encodeSymbols`

Você pode codificar símbolos não ASCII em um valor de string usando o auxiliar `encodeSymbols`. Por baixo dos panos, usamos o método [he.encode](https://www.npmjs.com/package/he#heencodetext-options).

```ts
import string from '@adonisjs/core/helpers/string'

string.encodeSymbols('foo © bar ≠ baz 𝌆 qux')
// 'foo &#xA9; bar &#x2260; baz &#x1D306; qux'
```

## `prettyHrTime`

Imprima de forma bonita o diff do método [process.hrtime](https://nodejs.org/api/process.html#processhrtimetime).

```ts
import { hrtime } from 'node:process'
import string from '@adonisjs/core/helpers/string'

const startTime = hrtime()
await someOperation()
const endTime = hrtime(startTime)

console.log(string.prettyHrTime(endTime))
```

## `isEmpty`

Verifique se um valor de string está vazio.

```ts
import string from '@adonisjs/core/helpers/string'

string.isEmpty('') // true
string.isEmpty('      ') // true
```

## `truncate`

Trunque uma string em um determinado número de caracteres.

```ts
import string from '@adonisjs/core/helpers/string'

string.truncate('This is a very long, maybe not that long title', 12)
// Output: This is a ve...
```

Por padrão, a string é truncada exatamente no índice fornecido. No entanto, você pode instruir o método a esperar que as palavras sejam concluídas.

```ts
string.truncate('This is a very long, maybe not that long title', 12, {
  completeWords: true,
})
// Output: This is a very...
```

Você pode personalizar o sufixo usando a opção `suffix`.

```ts
string.truncate('This is a very long, maybe not that long title', 12, {
  completeWords: true,
  suffix: '... <a href="/1"> Read more </a>',
})
// Output: This is a very... <a href="/1"> Read more </a>
```

## `excerpt`

O método `excerpt` é idêntico ao método `truncate`. No entanto, ele remove as tags HTML da string.

```ts
import string from '@adonisjs/core/helpers/string'

string.excerpt('<p>This is a <strong>very long</strong>, maybe not that long title</p>', 12, {
  completeWords: true,
})
// Output: This is a very...
```

## `slug`

Gere slug para um valor de string. O método é exportado do [pacote slugify](https://www.npmjs.com/package/slugify); portanto, consulte sua documentação para opções disponíveis.

```ts
import string from '@adonisjs/core/helpers/string'

console.log(string.slug('hello ♥ world'))
// hello-love-world
```

Você pode adicionar substituições personalizadas para valores Unicode da seguinte forma.

```ts
string.slug.extend({ '☢': 'radioactive' })

console.log(string.slug('unicode ♥ is ☢'))
// unicode-love-is-radioactive
```

## `interpolate`

Interpolar variáveis ​​dentro de uma string. As variáveis ​​devem estar entre chaves duplas.

```ts
import string from '@adonisjs/core/helpers/string'

string.interpolate('hello {{ user.username }}', {
  user: {
    username: 'virk'
  }
})
// hello virk
```

As chaves podem ser escapadas usando o prefixo `\\`.

```ts
string.interpolate('hello \\{{ users.0 }}', {})
// hello {{ users.0 }}
```

## `plural`

Converter uma palavra para sua forma plural. O método é exportado do [pacote pluralize](https://www.npmjs.com/package/pluralize).

```ts
import string from '@adonisjs/core/helpers/string'

string.plural('test')
// tests
```

## `isPlural`

Descubra se uma palavra já está na forma plural.

```ts
import string from '@adonisjs/core/helpers/string'

string.isPlural('tests') // true
```

## `pluralize`

Este método combina os métodos `singular` e `plural` e usa um ou outro com base na contagem. Por exemplo:

```ts
import string from '@adonisjs/core/helpers/string'

string.pluralize('box', 1) // box
string.pluralize('box', 2) // boxes
string.pluralize('box', 0) // boxes

string.pluralize('boxes', 1) // box
string.pluralize('boxes', 2) // boxes
string.pluralize('boxes', 0) // boxes
```

A propriedade `pluralize` exporta [métodos adicionais](https://www.npmjs.com/package/pluralize) para registrar regras personalizadas incontáveis, irregulares, plurais e singulares.

```ts
import string from '@adonisjs/core/helpers/string'

string.pluralize.addUncountableRule('paper')
string.pluralize.addSingularRule(/singles$/i, 'singular')
```

## `singular`

Converte uma palavra para sua forma singular. O método é exportado do [pacote pluralize](https://www.npmjs.com/package/pluralize).

```ts
import string from '@adonisjs/core/helpers/string'

string.singular('tests')
// test
```

## `isSingular`

Descubra se uma palavra já está em uma forma singular.

```ts
import string from '@adonisjs/core/helpers/string'

string.isSingular('test') // true
```

## `camelCase`

Converte um valor de string para camelcase.

```ts
import string from '@adonisjs/core/helpers/string'

string.camelCase('user_name') // userName
```

A seguir estão alguns exemplos de conversão.

| Input            | Output        |
|----------------|-------------|
| 'test'           | 'test'        |
| 'test string'    | 'testString'  |
| 'Test String'    | 'testString'  |
| 'TestV2'         | 'testV2'      |
| '_foo_bar_'      | 'fooBar'      |
| 'version 1.2.10' | 'version1210' |
| 'version 1.21.0' | 'version1210' |

## `capitalCase`

Converte um valor de string para maiúsculas.

```ts
import string from '@adonisjs/core/helpers/string'

string.capitalCase('helloWorld') // Hello World
```

A seguir estão alguns exemplos de conversão.

| Input            | Output           |
|----------------|----------------|
| 'test'           | 'Test'           |
| 'test string'    | 'Test String'    |
| 'Test String'    | 'Test String'    |
| 'TestV2'         | 'Test V 2'       |
| 'version 1.2.10' | 'Version 1.2.10' |
| 'version 1.21.0' | 'Version 1.21.0' |

## `dashCase`

Converta um valor de string para uma caixa de traço.

```ts
import string from '@adonisjs/core/helpers/string'

string.dashCase('helloWorld') // hello-world
```

Opcionalmente, você pode colocar a primeira letra de cada palavra em maiúscula.

```ts
string.dashCase('helloWorld', { capitalize: true }) // Hello-World
```

Following are some of the conversion examples.

| Input            | Output         |
|----------------|--------------|
| 'test'           | 'test'         |
| 'test string'    | 'test-string'  |
| 'Test String'    | 'test-string'  |
| 'Test V2'        | 'test-v2'      |
| 'TestV2'         | 'test-v-2'     |
| 'version 1.2.10' | 'version-1210' |
| 'version 1.21.0' | 'version-1210' |

## `dotCase`

Converta um valor de string para uma caixa de ponto.

```ts
import string from '@adonisjs/core/helpers/string'

string.dotCase('helloWorld') // hello.World
```

Opcionalmente, você pode converter a primeira letra de todas as palavras para minúsculas.

```ts
string.dotCase('helloWorld', { lowerCase: true }) // hello.world
```

Following are some of the conversion examples.

| Input            | Output         |
|----------------|--------------|
| 'test'           | 'test'         |
| 'test string'    | 'test.string'  |
| 'Test String'    | 'Test.String'  |
| 'dot.case'       | 'dot.case'     |
| 'path/case'      | 'path.case'    |
| 'TestV2'         | 'Test.V.2'     |
| 'version 1.2.10' | 'version.1210' |
| 'version 1.21.0' | 'version.1210' |

## `noCase`

Remova todos os tipos de caixa de um valor de string.

```ts
import string from '@adonisjs/core/helpers/string'

string.noCase('helloWorld') // hello world
```

A seguir estão alguns exemplos de conversão.

| Input                  | Output                 |
|----------------------|----------------------|
| 'test'                 | 'test'                 |
| 'TEST'                 | 'test'                 |
| 'testString'           | 'test string'          |
| 'testString123'        | 'test string123'       |
| 'testString_1_2_3'     | 'test string 1 2 3'    |
| 'ID123String'          | 'id123 string'         |
| 'foo bar123'           | 'foo bar123'           |
| 'a1bStar'              | 'a1b star'             |
| 'CONSTANT_CASE '       | 'constant case'        |
| 'CONST123_FOO'         | 'const123 foo'         |
| 'FOO_bar'              | 'foo bar'              |
| 'XMLHttpRequest'       | 'xml http request'     |
| 'IQueryAArgs'          | 'i query a args'       |
| 'dot\.case'            | 'dot case'             |
| 'path/case'            | 'path case'            |
| 'snake_case'           | 'snake case'           |
| 'snake_case123'        | 'snake case123'        |
| 'snake_case_123'       | 'snake case 123'       |
| '"quotes"'             | 'quotes'               |
| 'version 0.45.0'       | 'version 0 45 0'       |
| 'version 0..78..9'     | 'version 0 78 9'       |
| 'version 4_99/4'       | 'version 4 99 4'       |
| ' test '               | 'test'                 |
| 'something_2014_other' | 'something 2014 other' |
| 'amazon s3 data'       | 'amazon s3 data'       |
| 'foo_13_bar'           | 'foo 13 bar'           |

## `pascalCase`

Converta um valor de string para um caso Pascal. Ótimo para gerar nomes de classes JavaScript.

```ts
import string from '@adonisjs/core/helpers/string'

string.pascalCase('user team') // UserTeam
```

A seguir estão alguns exemplos de conversão.

| Input            | Output        |
|----------------|-------------|
| 'test'           | 'Test'        |
| 'test string'    | 'TestString'  |
| 'Test String'    | 'TestString'  |
| 'TestV2'         | 'TestV2'      |
| 'version 1.2.10' | 'Version1210' |
| 'version 1.21.0' | 'Version1210' |

## `sentenceCase`

Converta um valor para uma frase.

```ts
import string from '@adonisjs/core/helpers/string'

string.sentenceCase('getting_started-with-adonisjs')
// Getting started with adonisjs
```

A seguir estão alguns exemplos de conversão.

| Input            | Output           |
|----------------|----------------|
| 'test'           | 'Test'           |
| 'test string'    | 'Test string'    |
| 'Test String'    | 'Test string'    |
| 'TestV2'         | 'Test v2'        |
| 'version 1.2.10' | 'Version 1 2 10' |
| 'version 1.21.0' | 'Version 1 21 0' |

## `snakeCase`

Converta valor para snake case.

```ts
import string from '@adonisjs/core/helpers/string'

string.snakeCase('user team') // user_team
```

A seguir estão alguns exemplos de conversão.

| Input            | Output         |
|----------------|--------------|
| '\_id'           | 'id'           |
| 'test'           | 'test'         |
| 'test string'    | 'test_string'  |
| 'Test String'    | 'test_string'  |
| 'Test V2'        | 'test_v2'      |
| 'TestV2'         | 'test_v_2'     |
| 'version 1.2.10' | 'version_1210' |
| 'version 1.21.0' | 'version_1210' |

## `titleCase`

Converta um valor de string para o caso de título.

```ts
import string from '@adonisjs/core/helpers/string'

string.titleCase('small word ends on')
// Small Word Ends On
```

A seguir estão alguns exemplos de conversão.

| Input                              | Output                             |
|----------------------------------|----------------------------------|
| 'one. two.'                        | 'One. Two.'                        |
| 'a small word starts'              | 'A Small Word Starts'              |
| 'small word ends on'               | 'Small Word Ends On'               |
| 'we keep NASA capitalized'         | 'We Keep NASA Capitalized'         |
| 'pass camelCase through'           | 'Pass camelCase Through'           |
| 'follow step-by-step instructions' | 'Follow Step-by-Step Instructions' |
| 'this vs. that'                    | 'This vs. That'                    |
| 'this vs that'                     | 'This vs That'                     |
| 'newcastle upon tyne'              | 'Newcastle upon Tyne'              |
| 'newcastle \*upon\* tyne'          | 'Newcastle \*upon\* Tyne'          |

## `random`

Gere uma string aleatória criptograficamente segura de um determinado comprimento. O valor de saída é uma string codificada em base64 segura para URL.

```ts
import string from '@adonisjs/core/helpers/string'

string.random(32)
// 8mejfWWbXbry8Rh7u8MW3o-6dxd80Thk
```

## `sentence`

Converta uma matriz de palavras para uma frase separada por vírgulas.

```ts
import string from '@adonisjs/core/helpers/string'

string.sentence(['routes', 'controllers', 'middleware'])
// routes, controllers, and middleware
```

Você pode substituir o `and` por um `or` especificando a propriedade `options.lastSeparator`.

```ts
string.sentence(['routes', 'controllers', 'middleware'], {
  lastSeparator: ', or ',
})
```

No exemplo a seguir, as duas palavras são combinadas usando o separador `and`, não a vírgula (geralmente defendida em inglês). No entanto, você pode usar um separador personalizado para um par de palavras.

```ts
string.sentence(['routes', 'controllers'])
// routes and controllers

string.sentence(['routes', 'controllers'], {
  pairSeparator: ', and ',
})
// routes, and controllers
```

## `condenseWhitespace`

Remova vários espaços em branco de uma string para um único espaço em branco.

```ts
import string from '@adonisjs/core/helpers/string'

string.condenseWhitespace('hello  world')
// hello world

string.condenseWhitespace('  hello  world  ')
// hello world
```

## `seconds`

Analisa uma expressão de tempo baseada em string para segundos.

```ts
import string from '@adonisjs/core/helpers/string'

string.seconds.parse('10h') // 36000
string.seconds.parse('1 day') // 86400
```

A passagem de um valor numérico para o método `parse` é retornada como está, assumindo que o valor já esteja em segundos.

```ts
string.seconds.parse(180) // 180
```

Você pode formatar segundos para uma string bonita usando o método `format`.

```ts
string.seconds.format(36000) // 10h
string.seconds.format(36000, true) // 10 hours
```

## `milissegundos`

Analisar uma expressão de tempo baseada em string para milissegundos.

```ts
import string from '@adonisjs/core/helpers/string'

string.milliseconds.parse('1 h') // 3.6e6
string.milliseconds.parse('1 day') // 8.64e7
```

A passagem de um valor numérico para o método `parse` é retornada como está, assumindo que o valor já esteja em milissegundos.

```ts
string.milliseconds.parse(180) // 180
```

Usando o método `format`, você pode formatar milissegundos para uma string bonita.

```ts
string.milliseconds.format(3.6e6) // 1h
string.milliseconds.format(3.6e6, true) // 1 hour
```

## `bytes`

Analisar uma expressão de unidade baseada em string para bytes.

```ts
import string from '@adonisjs/core/helpers/string'

string.bytes.parse('1KB') // 1024
string.bytes.parse('1MB') // 1048576
```

A passagem de um valor numérico para o método `parse` é retornada como está, assumindo que o valor já esteja em bytes.

```ts
string.bytes.parse(1024) // 1024
```

Usando o método `format`, você pode formatar bytes para uma string bonita. O método é exportado diretamente do pacote [bytes](https://www.npmjs.com/package/bytes). Consulte o pacote README para opções disponíveis.

```ts
string.bytes.format(1048576) // 1MB
string.bytes.format(1024 * 1024 * 1000) // 1000MB
string.bytes.format(1024 * 1024 * 1000, { thousandsSeparator: ',' }) // 1,000MB
```

## `ordinal`

Obtenha a letra ordinal para um número fornecido.

```ts
import string from '@adonisjs/core/helpers/string'

string.ordinal(1) // 1st
string.ordinal(2) // '2nd'
string.ordinal(3) // '3rd'
string.ordinal(4) // '4th'

string.ordinal(23) // '23rd'
string.ordinal(24) // '24th'
```

## `safeEqual`

Verifique se dois valores de buffer ou string são iguais. Este método não vaza nenhuma informação de tempo e previne [ataque de tempo](https://javascript.plainenglish.io/what-are-timing-attacks-and-how-to-prevent-them-using-nodejs-158cc7e2d70c).

Nos bastidores, esse método usa o método Node.js [crypto.timeSafeEqual](https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b), com suporte para comparar valores de string. _(crypto.timeSafeEqual não oferece suporte para comparação de strings)_

```ts
import { safeEqual } from '@adonisjs/core/helpers'

/**
 * The trusted value, it might be saved inside the db
 */
const trustedValue = 'hello world'

/**
 * Untrusted user input
 */
const userInput = 'hello'

if (safeEqual(trustedValue, userInput)) {
  // both are the same
} else {
  // value mismatch
}
```

## `cuid`
Cria um ID seguro e resistente a colisões, otimizado para escala horizontal e desempenho. Esse método usa o pacote [@paralleldrive/cuid2](https://github.com/paralleldrive/cuid2) nos bastidores.

```ts
import { cuid } from '@adonisjs/core/helpers'

const id = cuid()
// tz4a98xxat96iws9zmbrgj3a
```

Você pode usar o método `isCuid` para verificar se um valor é um CUID válido.

```ts
import { cuid, isCuid } from '@adonisjs/core/helpers'

const id = cuid()
isCuid(id) // true
```

## `compose`

O auxiliar `compose` permite que você use mixins de classe TypeScript com uma API mais limpa. A seguir, um exemplo de uso de mixin sem o auxiliar `compose`.

```ts
class User extends UserWithAttributes(UserWithAge(UserWithPassword(UserWithEmail(BaseModel)))) {}
```

A seguir, um exemplo com o auxiliar `compose`.

- Não há aninhamento.
- A ordem dos mixins é de (da esquerda para a direita/de cima para baixo). Enquanto antes, era de dentro para fora.

```ts
import { compose } from '@adonisjs/core/helpers'

class User extends compose(
  BaseModel,
  UserWithEmail,
  UserWithPassword,
  UserWithAge,
  UserWithAttributes
) {}
```

## `base64`

Métodos utilitários para codificar e decodificar valores em base64.

```ts
import { base64 } from '@adonisjs/core/helpers'

base64.encode('hello world')
// aGVsbG8gd29ybGQ=
```

Assim como o método `encode`, você pode usar o `urlEncode` para gerar uma string base64 segura para passar em uma URL.

O método `urlEncode` realiza as seguintes substituições.

- Substitua `+` por `-`.
- Substitua `/` por `_`.
- E remova o sinal `=` do final da string.

```ts
base64.urlEncode('hello world')
// aGVsbG8gd29ybGQ
```

Você pode usar os métodos `decode` e `urlDecode` para decodificar uma string base64 codificada anteriormente.

```ts
base64.decode(base64.encode('hello world'))
// hello world

base64.urlDecode(base64.urlEncode('hello world'))
// hello world
```

Os métodos `decode` e `urlDecode` retornam `null` quando o valor de entrada é uma string base64 inválida. Você pode ativar o modo `strict` para gerar uma exceção.

```ts
base64.decode('hello world') // null
base64.decode('hello world', 'utf-8', true) // raises exception
```

## `fsReadAll`

Obtenha uma lista de todos os arquivos de um diretório. O método busca recursivamente arquivos da pasta principal e das subpastas. Os dotfiles são ignorados implicitamente.

```ts
import { fsReadAll } from '@adonisjs/core/helpers'

const files = await fsReadAll(new URL('./config', import.meta.url), { pathType: 'url' })
await Promise.all(files.map((file) => import(file)))
```

Você também pode passar as opções junto com o caminho do diretório como o segundo argumento.

```ts
type Options = {
  ignoreMissingRoot?: boolean
  filter?: (filePath: string, index: number) => boolean
  sort?: (current: string, next: string) => number
  pathType?: 'relative' | 'unixRelative' | 'absolute' | 'unixAbsolute' | 'url'
}

const options: Partial<Options> = {}
await fsReadAll(location, options)
```

| Argumento   | Descrição |
|------------|------------|
| `ignoreMissingRoot` | Por padrão, uma exceção é gerada quando o diretório raiz está ausente. Definir `ignoreMissingRoot` como true não resultará em erro, e uma matriz vazia será retornada. |
| `filter`            | Defina um filtro para ignorar certos caminhos. O método é chamado na lista final de arquivos. |
| `sort`              | Defina um método personalizado para classificar caminhos de arquivo. Por padrão, os arquivos são classificados usando classificação natural. |
| `pathType`          | Defina como retornar os caminhos coletados. Por padrão, os caminhos relativos específicos do SO são retornados. Se você quiser importar os arquivos coletados, você deve definir o `pathType = 'url'` |

## `fsImportAll`

O método `fsImportAll` importa todos os arquivos recursivamente de um diretório fornecido e define o valor exportado de cada módulo em um objeto.

```ts
import { fsImportAll } from '@adonisjs/core/helpers'

const collection = await fsImportAll(new URL('./config', import.meta.url))
console.log(collection)
```

- Collection é um objeto com uma árvore de pares de chave-valor.
- A chave é o objeto aninhado criado a partir do caminho do arquivo.
- Value são os valores exportados do módulo. Somente a exportação padrão é usada se um módulo tiver exportações `default` e `named`.

O segundo parâmetro é a opção para personalizar o comportamento de importação.

```ts
type Options = {
  ignoreMissingRoot?: boolean
  filter?: (filePath: string, index: number) => boolean
  sort?: (current: string, next: string) => number
  transformKeys? (keys: string[]) => string[]
}

const options: Partial<Options> = {}
await fsImportAll(location, options)
```

| Argumento | Descrição |
|------------|------------|
| `ignoreMissingRoot` | Por padrão, uma exceção é gerada quando o diretório raiz está ausente. Definir `ignoreMissingRoot` como true não resultará em erro e um objeto vazio será retornado. |
| `filter` | Defina um filtro para ignorar certos caminhos. Por padrão, apenas arquivos terminados com `.js`, `.ts`, `.json`, `.cjs` e `.mjs` são importados. |
| `sort` | Defina um método personalizado para classificar caminhos de arquivo. Por padrão, os arquivos são classificados usando classificação natural. |
| `transformKeys` | Defina um método de retorno de chamada para transformar as chaves para o objeto final. O método recebe uma matriz de chaves aninhadas e deve retornar uma matriz. |

## Construtor de strings

A classe `StringBuilder` oferece uma API fluente para executar transformações em um valor de string. Você pode obter uma instância do construtor de strings usando o método `string.create`.

```ts
import string from '@adonisjs/core/helpers/string'

const value = string
  .create('userController')
  .removeSuffix('controller') // user
  .plural() // users
  .snakeCase() // users
  .suffix('_controller') // users_controller
  .ext('ts') // users_controller.ts
  .toString()
```

## Construtor de mensagens

A classe `MessageBuilder` oferece uma API para serializar tipos de dados JavaScript com uma expiração e propósito. Você pode armazenar a saída serializada em um armazenamento seguro, como o banco de dados do seu aplicativo, ou criptografá-la (para evitar adulteração) e compartilhá-la publicamente.

No exemplo a seguir, serializamos um objeto com a propriedade `token` e definimos sua expiração como `1 hora`.

```ts
import { MessageBuilder } from '@adonisjs/core/helpers'

const builder = new MessageBuilder()
const encoded = builder.build(
  {
    token: string.random(32),
  },
  '1 hour',
  'email_verification'
)

/**
 * {
 *   "message": {
 *    "token":"GZhbeG5TvgA-7JCg5y4wOBB1qHIRtX6q"
 *   },
 *   "purpose":"email_verification",
 *   "expiryDate":"2022-10-03T04:07:13.860Z"
 * }
 */
```

Depois de ter a string JSON com a expiração e a finalidade, você pode criptografá-la (para evitar adulteração) e compartilhá-la com o cliente.

Durante a verificação do token, você pode descriptografar o valor criptografado anteriormente e usar o `MessageBuilder` para verificar a carga útil e convertê-la em um objeto JavaScript.

```ts
import { MessageBuilder } from '@adonisjs/core/helpers'

const builder = new MessageBuilder()
const decoded = builder.verify(value, 'email_verification')
if (!decoded) {
  return 'Invalid payload'
}

console.log(decoded.token)
```

## `Secret`
A classe `Secret` permite que você mantenha valores confidenciais em seu aplicativo sem vazá-los acidentalmente dentro de logs e instruções do console.

Por exemplo, o valor `appKey` definido dentro do arquivo `config/app.ts` é uma instância da classe `Secret`. Se você tentar registrar esse valor no console, verá `[redacted]` e não o valor original.

Para demonstração, vamos iniciar uma sessão REPL e tentar.

```sh
node ace repl
```

```sh
> (js) config = await import('./config/app.js')

# [Module: null prototype] {
  // highlight-start
#   appKey: [redacted],
  // highlight-end
#   http: {
#   }
# }
```

```sh
> (js) console.log(config.appKey)

# [redacted]
```

Você pode chamar o método `config.appKey.release` para ler o valor original. O objetivo da classe Secret não é impedir que seu código acesse o valor original. Em vez disso, ele fornece uma rede de segurança para não expor dados confidenciais dentro de logs.

### Usando a classe Secret
Você pode encapsular valores personalizados dentro da classe Secret da seguinte forma.

```ts
import { Secret } from '@adonisjs/core/helpers'
const value = new Secret('some-secret-value')

console.log(value) // [redacted]
console.log(value.release()) // some-secret-value
```

## Detecção de tipos

Exportamos o módulo [@sindresorhus/is](https://github.com/sindresorhus/is) do caminho de importação `helpers/is`, e você pode usá-lo para executar a detecção de tipos em seus aplicativos.

```ts
import is from '@adonisjs/core/helpers/is'

is.object({}) // true
is.object(null) // false
```
