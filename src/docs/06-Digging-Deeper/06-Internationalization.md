---
title: Internationalization
category: digging-deeper
---

# Internacionalização

O AdonisJs tem suporte de primeira classe para internacionalização construído sobre os padrões [formatjs.io](https://formatjs.io/).

Usando o *Antl Provider*, você pode facilmente traduzir *números*, *datas* e *mensagens* para vários idiomas.

## Configuração
Como o *Antl Provider* não é instalado por padrão, precisamos obtê-lo do `npm`:

```bash
adonis install @adonisjs/antl
```

Em seguida, precisamos registrar o provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/antl/providers/AntlProvider'
]
```

Seu objeto de configuração `locales` deve ser salvo dentro do arquivo `config/app.js` com as seguintes opções:


| Option    | Value                 | Description |
|-----------|-----------------------|-------------|
| `locale`  | ISO 639               | The default application locale (must be one of the available locales from [ISO 639 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)). |
| `loader`  | `database` or `file`  | The loader to use for loading your different language translations. |

```js
// .config/app.js

module.exports = {
  locales: {
    loader: 'file',
    locale: 'en'
  }
}
```

## Armazenamento de Localidades

### Arquivo
Ao usar o carregador `file`, todas as localidades são armazenadas dentro do diretório `resources/locales`.

Cada diretório de localidade deve conter uma lista de arquivos de tradução de *grupo*, como:

```bash
└── resources
  └── locales
      ├── en
      │ ├── alerts.json
      │ ├── cart.json
      │ └── store.json
      └── fr
        ├── alerts.json
        ├── cart.json
        └── store.json
```

> OBSERVAÇÃO: No exemplo acima, cada localidade contém 3 *grupos* de tradução hipotéticos: `alerts`, `cart` e `store`. Crie quantos arquivos de *grupo* por localidade conforme as necessidades do seu aplicativo.

Você também pode criar um diretório chamado `fallback` para armazenar mensagens que são usadas quando a mensagem para o idioma atual não pode ser encontrada:

```bash
└── resources
  └── locales
      ├── en
      │ └── messages.json
      ├── fallback
      │ └── messages.json
      └── fr
        └── messages.json
```

### Banco de Dados
Ao usar o carregador `database`, todas as localidades são obtidas da tabela de banco de dados `locales`.

> OBSERVAÇÃO: O comando `adonis install` cria a migração para a tabela `locales`.

> DICA: Você sempre pode referenciar o arquivo de origem de migração mais recente no [Github](https://github.com/adonisjs/adonis-antl/blob/master/templates/locales-schema.js).

Um exemplo de tabela de banco de dados `locales` pode se parecer com isto:


| id  | locale  | group     | item      | text                                      |
|-----|---------|-----------|-----------|-------------------------------------------|
| 1   | en      | messages  | greeting  | Hello `{name}`                            |
| 2   | fr      | messages  | greeting  | Bonjour `{name}`                          |
| 3   | en      | cart      | total     | Cart total is `{total, number, usd}`      |
| 4   | fr      | cart      | total     | Le panier est total `{total, number, usd}`|  

> NOTE: You *must* define a *group* value for each `locales` item.

## Acessando Localidades
Você pode acessar a localidade atual e padrão por meio do objeto `Antl`:

```js
const Antl = use('Antl')

Antl.currentLocale()
Antl.defaultLocale()
```

## Sintaxe de Mensagem ICU
O AdonisJs usa o padrão da indústria [sintaxe de Mensagem ICU](http://userguide.icu-project.org/formatparse/messages) para formatar mensagens.

Os tópicos a seguir definem o uso da sintaxe de mensagem ICU.

### Valores
Para recuperar um valor de tradução, basta referenciá-lo por sua chave `group.item`:

```json
// .resources/locales/en/messages.json
{
  "greeting": "Hello"
}
```

```js
Antl.formatMessage('messages.greeting')
```

### Argumentos
Você pode passar argumentos dinâmicos para injetar em espaços reservados que são definidos por chaves `{ }` dentro de suas mensagens:

```json
// .resources/locales/en/messages.json

{
  "greeting": "Hello {name}"
}
```

```js
Antl.formatMessage('messages.greeting', { name: 'virk' })
```

### Argumentos formatados
Os valores passados ​​para uma mensagem podem ser formatados opcionalmente por *tipo*.

> NOTA: Você deve registrar seus formatos antes de poder usá-los (consulte [Registrando formatos](#registering-formats)).

Por exemplo, ao passar um número, podemos formatá-lo como uma `moeda`:

```json
// .resources/locales/en/cart.json

{
  "total": "Cart total is {total, number, usd}"
}
```

Para o espaço reservado `{total, number, usd}` na mensagem acima:

1. `total` é o valor passado.
2. `number` é o *tipo* do valor.
3. `usd` é o *formato* para esse tipo de valor.

Como a *sintaxe da mensagem ICU* não entende formatos diretamente, precisamos passá-los manualmente ao formatar uma mensagem:

```js
const Antl = use('Antl')
const Formats = use('Antl/Formats')

Antl.formatMessage(
  'cart.total',
  { total: 20 },
  [Formats.pass('usd', 'number')]
)
```

No exemplo acima, estamos simplesmente chamando `formatMessage` com 3 argumentos:

1. `cart.total` é a referência à mensagem a ser formatada.
2. `{ total: 20 }` são os *dados* passados ​​para essa mensagem.
3. `[Formats.pass('usd', 'number')]` é um *array* de formatos possíveis.

### Selecione o formato
O formato `select` define a saída condicional com base no valor passado:

```plain
{gender, select,
    male {He}
    female {She}
    other {They}
} will respond shortly
```

> DICA: Tente editar a mensagem acima no seu [navegador](https://format-message.github.io/icu-message-format-for-translators/editor.html?m={gender%2C%20select%2C%0D%0A%20%20%20%20male%20{He}%0D%0A%20%20%20%20female%20{She}%0D%0A%20%20%20%20other%20{They}%0D%0A}%20will%20respond%20shortly&l=en-us&gender=male).

### Formato plural
O formato `plural` define opções de plurilização com base no valor passado:

```plain
{count, plural,
   =0 {No candy left}
   one {Got # candy left}
   other {Got # candies left}
}
```

> DICA: Tente editar a mensagem acima em seu [navegador](https://format-message.github.io/icu-message-format-for-translators/editor.html?m=%7B%20count%20%2C%20plural%20%2C%0A%C2%A0%C2%A0%C2%A0%3D0%20%7BNo%20doce%20esquerdo%7D%0A%C2%A0%C2%A0one%20%7BGot%20%23%20doce%20esquerdo%7D%0Aother%20%7BGot%20%23%20doce%20esquerdo%7D%20%7D).

## Formatando valores
Abaixo está a lista de métodos que você pode usar para formatar *mensagens* ou *valores brutos*.

#### `formatMessage(key, [data], [formats])`
O método `formatMessage` espera que a `key` seja formatada (*group.item*):

```js
const Antl = use('Antl')

Antl.formatMessage('messages.greeting')
```

Ele também pode aceitar um objeto de `data` dinâmico para passar para a mensagem:

```js
const Antl = use('Antl')

Antl.formatMessage('response.eta', { gender: 'male' })
```

Finalmente, ele também pode aceitar uma matriz de `formats` para analisar os dados passados ​​com:

```js
const Antl = use('Antl')
const Formats = use('Antl/Formats')

Antl.formatMessage(
  'cart.total',
  { total: 20 },
  [
    Formats.pass('usd', 'number')
  ]
)
```

#### `formatNumber(value, [options])`
Formate value como um número (aceita NumberFormat `options` conforme definido [aqui](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)):

```js
Antl.formatNumber(10)

// as currency
Antl.formatNumber(10, {
  style: 'currency',
  currency: 'usd'
})

// as percentage
Antl.formatNumber(10, {
  style: 'percent'
})
```

#### `formatAmount(value, currency, [options])`
Formatar valor com `style` definido como moeda:

```js
Antl.formatAmount(100, 'usd')
```

#### `formatDate(value, [options])`
Formatar valor como data (aceita `options` DateTimeFormat conforme definido [aqui](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)):

```js
Antl.formatDate(new Date())

// pull weekday for the date
Antl.formatDate(new Date(), {
  weekday: 'long'
})

// pull day only
Antl.formatDate(new Date(), {
  day: '2-digit'
})
```

#### `formatRelative(value, [options])`
Formatar uma data relativa à data atual data/hora (aceita `opções` RelativeFormat conforme definido [aqui](https://github.com/yahoo/intl-relativeformat#custom-options)):

```js
Antl.formatRelative(new Date())

// always in numeric style
Antl.formatRelative(new Date(), {
  style: 'numeric'
})
```

## Registrando formatos
O método [formatMessage](#formatmessagekey-data-formats) aceita apenas uma matriz de formatos pré-registrados.

Para registrar seus formatos para um determinado tipo:

```js
const Formats = use('Antl/Formats')

Formats.add('usd', {
  style: 'currency',
  currency: 'usd'
})
```

Use-o da seguinte forma:

```js
Antl.formatMessage(
  'cart.total'
  { total: 20 },
  [
    Formats.pass('usd', 'number')
  ]
)
```

O método `Formats.pass` recebe dois argumentos:

1. O primeiro argumento é o *formato* a ser usado.
2. O segundo argumento é o *tipo* ao qual o formato deve ser aplicado.

### Vários formatos de tipo

Você pode passar vários formatos para um determinado tipo. Por exemplo:

```json
// .resources/locales/en/cart.json

{
  "total": "USD total { usdTotal, number, usd } or in GBP { gbpTotal, number, gbp }"
}
```

Em seguida, registre os formatos `usd` e `gbp`.

```js
Formats.add('usd', {
  style: 'currency',
  currency: 'usd'
})

Formats.add('gbp', {
  style: 'currency',
  currency: 'gbp'
})
```

Finalmente, você pode formatar a mensagem da seguinte forma:

```js
Antl.formatMessage(
  'cart.total',
  { usdTotal: 20, gbpTotal: 13 },
  [
    Formats.pass('usd', 'number'),
    Formats.pass('gbp', 'number')
  ]
)
```

```bash
# .Output

USD total $20.00 or in GBP £13.00
```

## Trocar localidade
O *Antl Provider* simplifica a formatação da localidade em tempo de execução.

Para fazer isso, basta chamar `forLocale` antes de `formatMessage`:

```js
Antl
  .forLocale('fr')
  .formatMessage('response.eta')
```

## Trocar carregador
Você pode alternar entre carregadores em tempo de execução chamando o método `loader`:

```js
const Antl = use('Antl')

// asynchronous
await Antl.bootLoader()

// get antl instance for a booted loader
const AntlDb = Antl.loader('database')

// all methods are available
AntlDb.formatMessage()
```

> NOTA: Sempre chame `bootLoader` antes de `Antl.loader` (você só precisa chamar `bootLoader` uma vez).

## Localidade de solicitação Http
O *Provedor Antl* vincula a propriedade `locale` ao objeto [Contexto Http](/original/markdown/02-Concept/01-Request-Lifecycle.md):

```json
Route.get('/', ({ locale }) => {
  return `User language is ${locale}`
})
```

A propriedade locale é resolvida da seguinte forma:

1. O cabeçalho HTTP `Accept-Language` ou o parâmetro de consulta `lang` é examinado para detectar o idioma do usuário.
2. O idioma do usuário é comparado à lista de localidades disponíveis configuradas pelo seu aplicativo. As localidades configuradas são determinadas por mensagens salvas dentro do *banco de dados* ou *sistema de arquivos* para determinados idiomas.
3. Se o idioma do usuário não for suportado pelo seu aplicativo, ele retornará para a localidade padrão definida dentro do arquivo `config/app.js`.

## Formatação Http
Como podemos acessar a `localidade` do usuário com base em convenções padrão, você pode formatar mensagens de uma das seguintes maneiras.

### Importar globalmente
Você pode importar o *Antl Provider* globalmente e chamar manualmente o método `forLocale` ao formatar valores:

```js
const Antl = use('Antl')

Route.get('/', ({ locale }) => {
  return Antl
    .forLocale(locale)
    .formatNumber(20, { style: 'currency', currency: 'usd' })
})
```

### Instância de contexto
Você também pode usar o objeto `antl` que é passado para todos os manipuladores de rota como *request* e *response*:

```js
Route.get('/', ({ antl }) => {
  return antl
    .formatNumber(20, { style: 'currency', currency: 'usd' })
})
```

Por exemplo, você pode alternar a localidade para uma visualização assim:

```js
Route.get('/', ({ antl, view }) => {
  antl.switchLocale('fr')
  return view.render('some-view')
}
```

## Visualização global
Como a instância de contexto `antl` [#context-instance](#context-instance) é compartilhada com todas as visualizações, você pode acessar seus métodos dentro de seus modelos de visualização assim:

```edge
{{ antl.formatNumber(20, currency = 'usd', style = 'currency')  }}
```

Alternativamente, você pode usar a tag `@mustache` para escrever várias linhas:

```edge
@mustache(antl.formatNumber(
  20,
  { currency: 'usd', style: 'currency }
))
```

> OBSERVAÇÃO: Não há como alternar o carregador dentro dos modelos.
