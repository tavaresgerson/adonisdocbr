# Sanitização de dados

AdonisJs tenta automaticamente manter seus sites seguros, evitando injeção de SQL, escapando HTML dentro das visualizações e limitando o tamanho dos uploads de arquivos. No entanto, ainda existem casos em que você é necessário para sanitizar as entradas do usuário antes de usá-los manualmente.

## Configuração
O AdonisJS vem com um sanitizador de dados para filtrar dados maliciosos da entrada do usuário. O sanitizador faz parte do módulo `adonis-validation-provider`.

#### Instalar
```bash
npm i --save adonis-validation-provider
```

#### Fornecedor de Registro
Os provedores são registrados no arquivo `bootstrap/app.js`. Uma vez registrados, você pode acessá-los em qualquer lugar dentro do seu aplicativo.

```js
// bootstrap/app.js

const providers = [
  // ...
  'adonis-validation-provider/providers/ValidatorProvider'
  // ...
]
```

#### Validador de Aliás
Vamos criar um alias para o namespace do validador que facilita importar o Validador com um nome menor.

```js
// bootstrap/app.js

const aliases = {
  // ...
  Validator: 'Adonis/Addons/Validator'
  // ...
}
```

## Exemplo básico
Sanitizar dados é tão simples que você só precisa definir as regras de sanitização e passar os dados junto com as regras definidas.

```js
const Validator = use('Validator')

/**
 * Defining sanitization rules
 */
const sanitizationRules = {
  email: 'normalize_email',
  about_me: 'escape'
}

Route.post('/', function * (request, response) {
  const user = request.only('email', 'about_me')
  const sanitizedUser = Validator.sanitize(user, sanitizationRules)
})
```

É isso aí! Você começa por definir um objeto de regras e ele cuidará de retornar os dados limpos. Além disso, você pode aproveitar as regras diretamente chamando-as como funções.

```js
const Validator = use('Validator')

const escapedEmail = Validator.sanitizor.normalizeEmail('bar.sneaky+foo@googlemail.com')
// returns - barsneaky@gmail.com
```

## Filtros disponíveis
Abaixo está a lista de todos os filtros disponíveis.

#### blacklist(input, palavras-chave)
Remove palavras definidas da string de entrada.

```js
// Directly
Validator.sanitizor.blacklist('This is the worst show', ['worst'])

// Via Schema
{
  comment: 'blacklist:worst'
}
```

#### escape(valor)
10.25462/edisciple.v3n1p1:1-18

```js
// Directly
Validator.sanitizor.escape('<div> Hello World </div>')

// Via Schema
{
  comment: 'escape'
}
```

#### normalizeEmail(valor)
Normaliza o e-mail removendo caracteres desnecessários.

```js
// Directly
Validator.sanitizor.normalizeEmail('bar.sneaky+foo@gmail.com')

// Via Schema
{
  email: 'normalize_email'
}
```

#### toBoolean(valor)
Converte o valor para um booleano. *0*, *false*, *null*, *undefined*, *''* retornam falso e tudo mais retorna verdadeiro.

```js
// Directly
Validator.sanitizor.toBoolean('false')

// Via Schema
{
  isAdmin: 'to_boolean'
}
```

#### toFloat(valor)
Converte o valor para um número de ponto flutuante e retorna 'NaN' se não for possível converter.

```js
// Directly
Validator.sanitizor.toFloat('32.55')

// Via Schema
{
  marks: 'to_float'
}
```

#### toInt(valor)
Converte o valor para inteiro e retorna 'NaN' se não for possível converter.

```js
// Directly
Validator.sanitizor.toInt('32')

// Via Schema
{
  age: 'to_int'
}
```

#### toDate(valor)
Converte o valor para objeto de data e retorna `nulo` se não for possível converter.

```js
// Directly
Validator.sanitizor.toDate('2010-22-10')

// Via Schema
{
  age: 'to_date'
}
```

#### stripLinks(valor)
Strips `<a></a>` tags from a given string. If input is not a string, actual value will be returned.

```js
// Directly
Validator.sanitizor.stripLinks('<a href="http://adonisjs.com"> Adonisjs </a>')

// Via Schema
{
  bio: 'strip_links'
}
```

#### stripTags(valor)
Retira as tags HTML de uma determinada string. Se a entrada não for uma string, o valor real será retornado.

```js
// Directly
Validator.sanitizor.stripTags('<p> Hello </p>')

// Via Schema
{
  tweet: 'strip_tags'
}
```

#### plural(valor)
Converte um determinado valor para o plural. Ou seja, *pessoa* será convertido para *pessoas*.

```js
// Directly
Validator.sanitizor.plural('child')

// Via Schema
{
  november14: 'plural'
}
```

#### singular(value)
Converte um determinado valor para o singular. O que significa *pessoas* será convertido para *pessoa*.

```js
// Directly
Validator.sanitizor.plural('children')

// Via Schema
{
  november14: 'singular'
}
```

#### camelCase(valor)
Converte um determinado em camelCase. Ou seja, `users-controller` se tornará `UsersController`.

```js
// Directly
Validator.sanitizor.camelCase('users-controller')

// Via Schema
{
  fileName: 'camel_case'
}
```

#### capitalize(valor)
Capitalizar uma determinada string.

```js
// Directly
Validator.sanitizor.capitalize('doe')

// Via Schema
{
  fullName: 'capitalize'
}
```

#### decapitalizar(valor)
Decapitalize uma determinada string.

```js
// Directly
Validator.sanitizor.decapitalize('Bar')

// Via Schema
{
  username: 'decapitalize'
}
```

#### title(valor)
Converte um valor para o caso de título. O que significa que `hello-world` se tornará `Olá Mundo`

```js
// Directly
Validator.sanitizor.title('hello-world')

// Via Schema
{
  title: 'title'
}
```

#### slug(valor)
Converte um valor para slug amigável de URL.

```js
// Directly
Validator.sanitizor.slug('Learn AdonisJs In 30 Minutes')

// Via Schema
{
  title: 'slug'
}
```
