# Internacionalização

AdonisJs tem suporte de primeira classe para internacionalização construída sobre os padrões do [formatjs.io](https://formatjs.io/).

Usando o Provedor Antl, você pode traduzir facilmente números, datas e mensagens em vários idiomas.

## Configuração
Como o Provedor Antl não é instalado por padrão, precisamos retirá-lo de npm:

``` bash
adonis install @adonisjs/antl
```

Em seguida, precisamos registrar o provedor dentro do arquivo `start/app.js`:

```js
const providers = [
  '@adonisjs/antl/providers/AntlProvider'
]
```

Seu objeto `locales` de configuração deve ser salvo dentro do arquivo `config/app.js` com as seguintes opções:

| Opção       | Valor                | Descrição                                                                                             |
|-------------|----------------------|-------------------------------------------------------------------------------------------------------|
|`locale`     | ISO 639              | A localidade do aplicativo padrão (deve ser uma das localidades disponíveis nos códigos [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)).
| `loader`    | `database` ou `file` | O carregador a ser usado para carregar suas traduções em diferentes idiomas. |

```js
module.exports = {
  locales: {
    loader: 'file',
    locale: 'en'
  }
}
```

## Armazenamento de localidades

### Arquivo
Ao usar o filecarregador, todos os locais são armazenados dentro do resources/localesdiretório.

Cada diretório local deve conter uma lista de arquivos de tradução de grupo , assim:

```
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

> No exemplo acima, cada local contém 3 traduções hipotéticas de grupos: `alerts`, `cart` e `store`. Crie quantos arquivos de grupo 
> por localidade conforme suas necessidades de aplicativo.

Você também pode criar um diretório nomeado `fallback` para armazenar mensagens que são usadas quando a mensagem para o idioma atual não pôde ser encontrada:

```
└── resources
  └── locales
      ├── en
      │ └── messages.json
      ├── fallback
      │ └── messages.json
      └── fr
        └── messages.json
```

#### Base de dados
Ao usar o carregador `database`, todas as localidades são buscadas na tabela `locales` do banco de dados.

O comando `adonis install` cria a migração para a tabela `locales`.

> Você sempre pode consultar o arquivo de origem de migração mais recente no [Github](https://github.com/adonisjs/adonis-antl/blob/master/templates/locales-schema.js).

Um exemplo de tabela `locales` de banco de dados pode ser assim:

| id | locale     | group       |	item          | text                                      |
|----|------------|-------------|---------------|-------------------------------------------|
| 1  | en         | messages    | greeting      | Hello {name}                              |
| 2  | fr         | messages    | greeting      | Bonjour {name}                            |
| 3  | en         | cart        | total         | Cart total is {total, number, usd}        |
| 4  | fr         | cart        | total         | Le panier est total {total, number, usd}  |


> Você deve definir um valor de grupo para cada localesitem.

#### Acessando localidades
Você pode acessar a localidade atual e padrão por meio do `Antl` objeto:

```js
const Antl = use('Antl')

Antl.currentLocale()
Antl.defaultLocale()
```

#### Sintaxe da mensagem ICU
AdonisJs usa a [sintaxe de mensagem ICU](http://userguide.icu-project.org/formatparse/messages) padrão da indústria para formatar mensagens.

Os tópicos a seguir definem o uso da sintaxe da mensagem ICU.

#### Valores
Para recuperar um valor de tradução, basta referenciá-lo por sua chave `group.item`:

```json
// resources/locales/en/messages.json
{
  "greeting": "Hello"
}

```js
Antl.formatMessage('messages.greeting')
```

#### Argumentos
Você pode passar argumentos dinâmicos para injetar em marcadores de posição que são definidos por chaves `{ }` dentro de suas mensagens:

```json
// resources/locales/en/messages.json
{
  "greeting": "Hello {name}"
}
```

```js
Antl.formatMessage('messages.greeting', { name: 'virk' })
```

#### Argumentos formatados
Os valores passados para uma mensagem podem ser formatados opcionalmente por tipo.

> Você deve registrar seus formatos antes de usá-los (consulte [Registrando formatos](https://adonisjs.com/docs/4.1/internationalization#_registering_formats)).

Por exemplo, ao passar um número, podemos formatá-lo como `currency`:

```json
// resources/locales/en/cart.json
{
  "total": "Cart total is {total, number, usd}"
}
```

Para o espaço reservado `{total, number, usd}` na mensagem acima:

+ `total` é o valor passado.
+ `number` é o tipo do valor.
+ `usd` é o formato desse tipo de valor.

Como a **sintaxe da mensagem ICU** não entende os formatos diretamente, precisamos transmiti-los manualmente ao formatar uma mensagem:

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
2 `{ total: 20 }` são os dados passados ​​para essa mensagem.
3 `[Formats.pass('usd', 'number')]` é uma série de formatos possíveis.

#### Selecione o formato
O formato `select` define a saída condicional com base no valor passado:

```
{gender, select,
    male {He}
    female {She}
    other {They}
} will respond shortly
```

> Experimente e edite a mensagem acima em seu [navegador](https://format-message.github.io/icu-message-format-for-translators/editor.html?m={gender%2C%20select%2C%0D%0A%20%20%20%20male%20{He}%0D%0A%20%20%20%20female%20{She}%0D%0A%20%20%20%20other%20{They}%0D%0A}%20will%20respond%20shortly&l=en-us&gender=male).

#### Formato plural
O formato `plural` define opções de plurilização com base no valor passado:

{count, plural,
   =0 {No candy left}
   one {Got # candy left}
   other {Got # candies left}
}
Experimente e edite a mensagem acima em seu navegador .
Valores de formatação
Abaixo está a lista de métodos que você pode usar para formatar mensagens ou valores brutos .

##### formatMessage (chave, [dados], [formatos])
O formatMessagemétodo espera que o keyseja formatado ( group.item ):

const Antl = use('Antl')

Antl.formatMessage('messages.greeting')
Ele também pode aceitar um objeto de dinâmico datapara passar para a mensagem:

const Antl = use('Antl')

Antl.formatMessage('response.eta', { gender: 'male' })
Finalmente, ele também pode aceitar uma matriz de formatspara analisar os dados passados ​​com:

const Antl = use('Antl')
const Formats = use('Antl/Formats')

Antl.formatMessage(
  'cart.total',
  { total: 20 },
  [
    Formats.pass('usd', 'number')
  ]
)
formatNumber (valor, [opções])
Formate o valor como um número (aceita NumberFormat optionsconforme definido aqui ):

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
formatAmount (valor, moeda, [opções])
Formatar o valor com styledefinir como moeda:

Antl.formatAmount(100, 'usd')
formatDate (valor, [opções])
Formate o valor como data (aceita DateTimeFormat optionsconforme definido aqui ):

Antl.formatDate(new Date())

// pull weekday for the date
Antl.formatDate(new Date(), {
  weekday: 'long'
})

// pull day only
Antl.formatDate(new Date(), {
  day: '2-digit'
})
formatRelative (valor, [opções])
Formate uma data em relação à data / hora atual (aceita RelativeFormat optionsconforme definido aqui ):

Antl.formatRelative(new Date())

// always in numeric style
Antl.formatRelative(new Date(), {
  style: 'numeric'
})
Registrando Formatos
O método formatMessage aceita apenas uma matriz de formatos pré-registrados.

Para registrar seus formatos para um determinado tipo:

const Formats = use('Antl/Formats')

Formats.add('usd', {
  style: 'currency',
  currency: 'usd'
})
Use-o da seguinte maneira:

Antl.formatMessage(
  'cart.total'
  { total: 20 },
  [
    Formats.pass('usd', 'number')
  ]
)
O Formats.passmétodo leva dois argumentos:

O primeiro argumento é o formato a ser usado.

O segundo argumento é o tipo ao qual o formato deve ser aplicado.

Vários formatos de tipo
Você pode passar vários formatos para um determinado tipo. Por exemplo:

resources / locales / en / cart.json
{
  "total": "USD total { usdTotal, number, usd } or in GBP { gbpTotal, number, gbp }"
}
Em seguida, registre os formatos usde gbp.

Formats.add('usd', {
  style: 'currency',
  currency: 'usd'
})

Formats.add('gbp', {
  style: 'currency',
  currency: 'gbp'
})
Finalmente, você pode formatar a mensagem da seguinte maneira:

Antl.formatMessage(
  'cart.total',
  { usdTotal: 20, gbpTotal: 13 },
  [
    Formats.pass('usd', 'number'),
    Formats.pass('gbp', 'number')
  ]
)
Resultado
USD total $20.00 or in GBP £13.00
Mudar de local
O Provedor Antl simplifica a formatação da localidade em tempo de execução.

Para isso, basta ligar forLocaleantes de formatMessage:

Antl
  .forLocale('fr')
  .formatMessage('response.eta')
Switch Loader
Você pode alternar entre os carregadores em tempo de execução chamando o loadermétodo:

const Antl = use('Antl')

// asynchronous
await Antl.bootLoader()

// get antl instance for a booted loader
const AntlDb = Antl.loader('database')

// all methods are available
AntlDb.formatMessage()
Sempre ligue bootLoaderantes Antl.loader(você só precisa ligar bootLoaderuma vez).
Http Request Locale
O Provedor Antl vincula a localepropriedade ao objeto Http Context :

Route.get('/', ({ locale }) => {
  return `User language is ${locale}`
})
A propriedade locale é resolvida da seguinte forma:

O Accept-Languagecabeçalho HTTP ou langparâmetro de consulta é examinado para detectar o idioma do usuário.

O idioma do usuário é comparado com a lista de localidades disponíveis configuradas por seu aplicativo. As localidades configuradas são determinadas por mensagens salvas no banco de dados ou sistema de arquivos para determinados idiomas.

Se o idioma do usuário não for compatível com seu aplicativo, ele retornará para a localidade padrão definida no config/app.jsarquivo.

Formatação Http
Como podemos acessar o usuário com localebase em convenções padrão, você pode formatar mensagens de uma das seguintes maneiras.

Importar globalmente
Você pode importar o Provedor Antl globalmente e chamar manualmente o forLocalemétodo ao formatar valores:

const Antl = use('Antl')

Route.get('/', ({ locale }) => {
  return Antl
    .forLocale(locale)
    .formatNumber(20, { style: 'currency', currency: 'usd' })
})
Instância de contexto
Você também pode usar o antlobjeto que é passado para todos os gerenciadores de rota, como solicitação e resposta :

Route.get('/', ({ antl }) => {
  return antl
    .formatNumber(20, { style: 'currency', currency: 'usd' })
})
Por exemplo, você pode mudar a localidade para uma visualização como:

Route.get('/', ({ antl, view }) => {
  antl.switchLocale('fr')
  return view.render('some-view')
}
Ver Global
Como a antl instância de contexto é compartilhada com todas as visualizações, você pode acessar seus métodos dentro de seus modelos de visualização da seguinte forma:

{{ antl.formatNumber(20, currency = 'usd', style = 'currency')  }}
Como alternativa, você pode usar a @mustachetag para escrever várias linhas:

@mustache(antl.formatNumber(
  20,
  { currency: 'usd', style: 'currency }
))
Não há como alternar o carregador dentro dos modelos.
