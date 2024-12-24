# Sanitização de dados

O AdonisJs tenta automaticamente manter seus sites seguros, impedindo a injeção de SQL, escapando HTML dentro de visualizações e limitando o tamanho dos uploads de arquivos. Ainda assim, há casos em que você precisa sanitizar as entradas do usuário antes de consumi-las manualmente.

## Configuração
O AdonisJs vem com um prático sanitizador de dados para filtrar dados maliciosos da entrada do usuário. O sanitizador faz parte do módulo `adonis-validation-provider`.

#### Instalar
```bash
npm i --save adonis-validation-provider
```

#### Registrar provedor
Os provedores são registrados dentro do arquivo `bootstrap/app.js`. Depois que eles são registrados, você pode acessá-los em qualquer lugar dentro do seu aplicativo.

```js
// bootstrap/app.js
const providers = [
  // ...
  'adonis-validation-provider/providers/ValidatorProvider'
  // ...
]
```

#### Alias ​​do validador
Vamos criar um alias para o namespace do validador que facilita a importação do Validador com um nome menor.

```js
// bootstrap/app.js
const aliases = {
  // ...
  Validator: 'Adonis/Addons/Validator'
  // ...
}
```

## Exemplo básico
A higienização de dados é tão simples que você só precisa definir regras para higienização e passar os dados junto com as regras definidas.

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

É simples assim! Você começa definindo um objeto de regras, e ele garantirá que os dados limpos sejam retornados. Além disso, você pode aproveitar as regras diretamente chamando-as como funções.

```js
const Validator = use('Validator')

const escapedEmail = Validator.sanitizor.normalizeEmail('bar.sneaky+foo@googlemail.com')
// returns - barsneaky@gmail.com
```

## Filtros disponíveis
Abaixo está a lista de todos os filtros disponíveis.

#### blacklist(input, keywords)
Remove palavras definidas da string de entrada.

```js
// Directly
Validator.sanitizor.blacklist('This is the worst show', ['worst'])

// Via Schema
{
  comment: 'blacklist:worst'
}
```

#### escape(value)
Escapes de entidades HTML.

```js
// Directly
Validator.sanitizor.escape('<div> Hello World </div>')

// Via Schema
{
  comment: 'escape'
}
```

#### normalizeEmail(value)
Normaliza e-mail removendo caracteres desnecessários.

```js
// Directly
Validator.sanitizor.normalizeEmail('bar.sneaky+foo@gmail.com')

// Via Schema
{
  email: 'normalize_email'
}
```

#### toBoolean(value)
Converte valor em um booleano. *0* , *false*, *null*, *undefined*, *''* retornará false e todo o resto retornará true.

```js
// Directly
Validator.sanitizor.toBoolean('false')

// Via Schema
{
  isAdmin: 'to_boolean'
}
```

#### toFloat(value)
Converte valor em float e retorna `NaN` se não for possível converter.

```js
// Directly
Validator.sanitizor.toFloat('32.55')

// Via Schema
{
  marks: 'to_float'
}
```

#### toInt(value)
Converte valor em inteiro e retorna `NaN` se não for possível converter.

```js
// Directly
Validator.sanitizor.toInt('32')

// Via Schema
{
  age: 'to_int'
}
```

#### toDate(value)
Converte valor em objeto de data e retorna `null` se não for possível converter.

```js
// Directly
Validator.sanitizor.toDate('2010-22-10')

// Via Schema
{
  age: 'to_date'
}
```

#### stripLinks(value)
Remove as tags `<a></a>` de uma string fornecida. Se a entrada não for uma string, o valor real será retornado.

```js
// Directly
Validator.sanitizor.stripLinks('<a href="http://adonisjs.com"> Adonisjs </a>')

// Via Schema
{
  bio: 'strip_links'
}
```

#### stripTags(value)
Remove as tags HTML de uma string fornecida. Se a entrada não for uma string, o valor real será retornado.

```js
// Directly
Validator.sanitizor.stripTags('<p> Hello </p>')

// Via Schema
{
  tweet: 'strip_tags'
}
```

#### plural(value)
Converte um valor fornecido para plural. O que significa que *pessoa* será convertida para *pessoas*.

```js
// Directly
Validator.sanitizor.plural('child')

// Via Schema
{
  november14: 'plural'
}
```

#### singular(value)
Converte um valor fornecido para singular. O que significa que *pessoas* serão convertidas para *pessoa*.

```js
// Directly
Validator.sanitizor.plural('children')

// Via Schema
{
  november14: 'singular'
}
```

#### camelCase(value)
Converte um dado para camelcase. O que significa que `users-controller` se tornará `UsersController`.

```js
// Directly
Validator.sanitizor.camelCase('users-controller')

// Via Schema
{
  fileName: 'camel_case'
}
```

#### capitalize(value)
Coloca uma string dada em maiúscula.

```js
// Directly
Validator.sanitizor.capitalize('doe')

// Via Schema
{
  fullName: 'capitalize'
}
```

#### decapitalize(value)
Coloca uma string dada em minúscula.

```js
// Directly
Validator.sanitizor.decapitalize('Bar')

// Via Schema
{
  username: 'decapitalize'
}
```

#### title(value)
Converte um valor para title case. O que significa que `hello-world` se tornará `Hello World`

```js
// Directly
Validator.sanitizor.title('hello-world')

// Via Schema
{
  title: 'title'
}
```

#### slug(value)
Converte um valor para slug amigável para URL.

```js
// Directly
Validator.sanitizor.slug('Learn AdonisJs In 30 Minutes')

// Via Schema
{
  title: 'slug'
}
```
