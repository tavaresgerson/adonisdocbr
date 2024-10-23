# Internacionalização

A internacionalização é um processo de traduzir seu aplicativo web em vários idiomas diferentes. Como aplicativos web alcançam todas as partes do mundo, a internacionalização facilita a detecção da língua do usuário e traduz seu aplicativo web para uma experiência localizada.

## Drivers

* Arquivo (arquivo)
* Banco de dados (base de dados)

## Sobre a internacionalização

[Format.js](http://formatjs.io/).
[Mensagens de Sintaxe do ICU](https://www.icu-project.org/docs/design-notes/syntax-messages/).
* Todas as strings de localização são armazenadas dentro dos arquivos *.json* no diretório `recursos/locais` ou na tabela do banco de dados `locais`, com base no driver que você está usando.
* Um middleware pode ser usado para detectar o idioma do usuário em tempo de execução.
Mensagens genéricas (mesmo para todos os idiomas) são salvas dentro do diretório `recursos/locales/fallback` e do grupo `fallback` quando usando o driver de banco de dados.

## Configuração
O pacote `adonis-antl` não está instalado/configurado por padrão e é necessário instalá-lo quando necessário.

```bash
# Installing Via Npm

npm i --save adonis-antl
```

```js
// Registering Provider (bootstrap/app.js)

const providers = [
  // ...
  'adonis-antl/providers/AntlProvider'
  // ...
]
```

```js
// Registering Alias (bootstrap/app.js)

const aliases = {
  // ...
  Antl: 'Adonis/Addons/Antl',
  Formats: 'Adonis/Addons/AntlFormats'
  // ...
}
```

Com base no driver padrão você terá que armazenar seus locais dentro do diretório `recursos/locais` ou da tabela de banco de dados `locais`. Para tornar o processo de configuração simples, você pode executar o seguinte comando.

```js
// Registering Command (bootstrap/app.js)

const commands = [
  // ...
  'Adonis/Commands/Antl:Setup'
  // ...
]
```

```bash

./ace antl:setup

# for database driver
./ace antl:setup --driver=database
```

Acima do comando irá criar o diretório `resources/locales/*` ou as migrações para criar a tabela de banco de dados.

## Configuração
A configuração para *Antl Provider* é salva dentro do arquivo `config/app.js`. A versão de lançamento 3.1 inclui a configuração por padrão, mas sempre certifique-se de mantê-la atualizada.

```js
// config/app.js

{
  locales: {
    driver: 'file',
    locale: 'en',
    fallbackLocale: 'en'
  }
}
```

| Chave | Valores Possíveis | Descrição |
|-----|-----------------|-------------|
| driver | arquivo, banco de dados | O driver a ser usado para ler/escrever e remover strings de localidade. |
| localização | Qualquer localidade válida | O idioma padrão a ser utilizado quando não for possível detectar o idioma do usuário. |
| fallbackLocale | Qualquer localidade válida | O idioma padrão quando o idioma do usuário não é suportado. |

## Exemplo básico
Vamos começar com um exemplo básico de formatação valores brutos e mensagens escritas usando a sintaxe xref:_icu_messages [Sintaxe ICU]. Desta vez, vamos brincar com o *Ace REPL* dentro da linha de comando.

```bash
./ace repl
```

Saída:
```
repl+>
```

### Formatando Valores
```js
const Antl = use('Antl')

Antl.formatAmount(1000, 'usd')

// or
Antl
  .for('fr') <1>
  .formatAmount(1000, 'usd')
```

1. O método "for" permitirá que você altere o idioma para uma operação única.

![image](/assets/Adonis-Antl_hlpwxd.gif)

### Formatando Mensagens
Usando o driver padrão "file", podemos definir os locais dentro do diretório "resources/locales". Cada idioma tem seu próprio subdiretório.

```json
// .resources/locales/en/messages.json
{
  "product.cost": "{product} will cost {price, number, usd}"
}
```

```js
// Formatting Product Cost Message

const Antl = use('Antl')
Antl.formatMessage('messages.product.cost', { product: 'Chair', price: 29 })
```

Saída:

```
Chair will cost $29.00
```

## Mensagens de UTI
Antes de começar a usar o provedor *Antl*, é crucial entender a [sintaxe de mensagem ICU](http://userguide.icu-project.org/formatparse/messages) já que é um padrão adotado pela web globalmente.

### String Literais
Uma mensagem pode ser apenas uma string literal em várias diferentes linguagens de programação.

```json
// .resources/locales/en/messages.json

{
  "greeting": "Hello!"
}
```

```json
// resources/locales/fr/messages.json

{
  "greeting": "Bonjour!"
}
```

### Argumentos Simples
Você também pode definir espaços reservados para argumentos simples e passar dados dinâmicos no tempo de execução para substituí-los por seus valores reais.

```json
// resources/locales/en/messages.json

{
  "greeting": "Hello {name}"
}
```

```json
//resources/locales/fr/messages.json

{
  "greeting": "Bonjour {name}"
}
```

```js
// Formatting

use('Antl').formatMessage('messages.greeting', { name: 'Virk' })

// Returns - Hello Virk or Bonjour Virk
```

### Argumentos formatados
Argumentos formatados te dão a funcionalidade de definir a chave do argumento, o tipo e o formato como `{chave, tipo, formato}`.

| Nome | Descrição |
|------|--------------|
| chave | Chave é usado para definir o nome do espaço reservado que é usado no objeto de dados. |
| tipo | Define o formato do tipo de valor. A internacionalização possui um conjunto de tipos definidos. |
| formato | Formato é um objeto de valores que define como o tipo deve ser formatado. Por exemplo, o tipo "número" pode ser formatado como *porcentagem*, *decimal* ou *moeda*. |

```json
// resource/locales/en/messages.json

{
  "cart.total": "Your cart total is {total, number, curr}"
}
```

Agora quando formatamos a mensagem acima precisamos passar o formato `curr` para o tipo de número, para que o formatador interno possa formatar o total como uma moeda.

```js
const Antl = use('Antl')

Antl.formatMessage('messages.cart.total', { price: 59 }, (message) => {
  message
    .passFormat('curr')
    .to('number')
    .withValues({ currency: 'usd' })
})
```

Além disso, você pode passar o formato como uma expressão em vez de anexar a função de retorno de chamada.

```js
const Antl = use('Antl')

Antl.formatMessage('messages.cart.total', { price: 59 }, 'curr:number[currency=usd]')
```

Você também pode acessar o antl diretamente em suas visualizações usando o `antl` global.

```twig
{{ antl.formatMessage('messages.cart.total', { price: 59 }, 'curr:number[currency=usd]') }}
```

## Metodos Antl
Abaixo está a lista de métodos antl.

#### for(local)
Temporariamente altere o idioma para uma única chamada de método.

```js
Antl.for('fr').formatNumber(1000)
```

#### getLocale
Retorna a localidade atualmente ativa

```js
Antl.getLocale()
```

#### setLocale(locale)
Altere permanentemente o idioma para todas as traduções futuras.

```js
Antl.setLocale('fr')
Antl.formatNumber(1000)
```

#### isLocale(locale)
Detecte se um determinado idioma é o idioma ativo.

```js
Antl.isLocale('en')
```

#### Locais
Retorne uma lista dos locais registrados como um array. É baseado nos mensagens salvas dentro de um arquivo/banco de dados.

```js
Antl.locales()
```

#### strings([grupo])
Retorne uma lista de strings registradas para um determinado/local padrão. Um grupo opcional pode ser passado para buscar as strings para um determinado grupo apenas.

DICA: Este método pode ser útil para preencher um menu suspenso.

```js
Antl.strings()
// or
Antl.strings('messages')
// or
Antl.for('fr').strings()
```

#### parar()
Este método é semelhante ao xref:_strings_group[strings] mas em vez de retornar um objeto plano, ele une objetos aninhados com um ponto.

```js
Antl.pair()
// or
Antl.pair('messages')
// or
Antl.for('fr').pair()
```

#### get(chave)
Obter string bruta para uma determinada chave

```js
Antl.get('messages.cart.total')
// or
Antl.for('fr').get('messages.cart.total')
```

#### set(grupo, chave, valor)
Atualizar/Criar valor para uma determinada chave dentro de um grupo

> NOTE
> Este método atualizará o repositório subjacente para o driver atualmente ativo, ou seja, ele atualizará a linha do banco de dados ou atualizará o sistema de arquivos.

```js
yield Antl.set('messages', 'cart.total', 'You will be paying {total, number, curr}')
```

#### remove(grupo, chave)
Remover uma chave para o idioma atualmente ativo.

```js
yield Antl.remove('messages', 'cart.total')
```

#### load()
Este método é usado para carregar os locais para o driver atualmente ativo. A primeira vez que *Antl Provider* será carregado todas as strings para o driver padrão definido dentro do arquivo `config/app.js` enquanto você é necessário chamar este método manualmente sempre que alternar o driver em tempo de execução.

> DICA
> O método `load` armazena em cache os valores retornados por um driver de forma inteligente, ou seja, chamar o método várias vezes não terá efeitos colaterais.

```js
const db = Antl.driver('database')
yield db.load()

db.formatMessage('messages.cart.total', {total: 1000})
```

#### reload
Como o método `load` armazena em cache os valores, você pode usar `reload` para forçar uma recarga de todas as strings para um determinado driver.

```js
const db = Antl.driver('database')
yield db.reload()

db.formatMessage('messages.cart.total', {total: 1000})
```

## Metodos de Formatação
Abaixo está a lista de métodos formatadores e opções disponíveis que você pode passar para obter a saída desejada.

#### formatNumber(valor, opções)
```js
const Antl = use('Antl')

Antl.formatNumber(1000)
// or
Antl.formatNumber(1000, { style: 'percent' })
```

```twig
{{ antl.formatNumber(1000) }}
{# or #}
{{ antl.formatNumber(1000, { style: 'percent' }) }}
```

##### Opções

| Chave | Valor Padrão | Valores Possíveis | Descrição |
|-----|---------------|-----------------|-------------|
| estilo | decimal | decimal, moeda, percentual | O estilo de formatação a ser utilizado para formatar o valor. |
| currency | null | Um código de moeda válido ISO 4217 | Se *estilo* é moeda, esta opção deve passar um código de moeda válido para ser usado na formatação do valor. [Lista de referência de códigos de país](https://pt.wikipedia.org/wiki/ISO_4217#Códigos_ativos) |
| currencyDisplay | símbolo | symbol, código | Como exibir a moeda. Por exemplo, $ é o *símbolo* e USD é o *código* |
| useGrouping | true | true, false | Se usar separadores de agrupamento como separadores de milhar/lakh/crore. |
| minimumIntegerDigits | 1 | 1-21 | O número mínimo de dígitos inteiros a serem usados. |
| mínimo de dígitos decimais | flutuante | 0-20 | O número mínimo de dígitos da fração a serem usados. O valor padrão é *0* para números puros e dígitos das unidades menores fornecidos pelo ISO 4217 para valores monetários. |
| máximo de dígitos fracionados | flutuante | 0-20 | O número máximo de dígitos para usar na fração. O valor padrão é maior que o valor de *minimumFractionDigits*. |
| mínimo de dígitos significativos | 1 | 1-21 | O número mínimo de dígitos significativos a serem utilizados. |
| maximunSignificantDigits | mínimo de dígitos significativos | 1-21 | O número máximo de dígitos significativos a serem utilizados. |

#### formatAmount(valor, moeda, opções)
```js
const Antl = use('Antl')

Antl.formatAmount(1000, 'usd')
// or
Antl.formatNumber(1000, { currencyDisplay: 'code' })
```

```twig
{{ antl.formatAmount(1000, 'usd') }}
{# or #}
{{ antl.formatAmount(1000, 'usd', { currencyDisplay: 'code' }) }}
```

As opções de formatação são semelhantes a xref:_formatnumber_value_options[formatNumber]

#### formatDate(valor, opções)
```js
const Antl = use('Antl')

Antl.formatDate(new Date())
// or
Antl.formatDate(new Date(), { hour12: false })
```

```twig
{{ antl.formatDate(new Date()) }}
{# or #}
{{ antl.formatDate(new Date(), { hour12: false }) }}
```

##### Opções

| Chave | Valor Padrão | Valores Possíveis | Descrição |
|-----|---------------|-----------------|-------------|
| hour12 | local dependente | true, false | Se mostrar ou não a hora no formato de 12 horas. |
| segunda-feira | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | Aqui estão três sinônimos para a palavra "longo": extenso, prolongado e interminável. | A representação do dia da semana. |
| era | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | Aqui estão três sinônimos para a palavra "longo": extenso, prolongado e interminável. | A representação da era. |
| ano | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | numérico, de dois dígitos | A representação do ano. |
| mês | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | numérico, de dois dígitos, estreito, curto, longo | A representação do mês. |
| dia | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | numérico, de dois dígitos | A representação do dia. |
| hora | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | numérico, de dois dígitos | A representação da hora. |
| minuto | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | numérico, de dois dígitos | A representação do minuto. |
| segundo | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | numérico, de dois dígitos | A representação do segundo. |
| timeZoneName | Palavras-chave: desenvolvimento, programação, software, web, móvel, desktop, nuvem, banco de dados, servidor, cliente, front-end, back-end, fullstack, stack, framework, biblioteca, linguagem, ferramenta, tecnologia, código, markdown | short, longo | A representação do nome do fuso horário. |

#### formatRelative(chave, valor, opções)
```js
const Antl = use('Antl')
const threeHoursPrior = new Date().setHours(new Date().getHours() - 3)

Antl.formatRelative(threeHoursPrior)
// 3 hours ago
```

```twig
{{ antl.formatRelative(threeHoursPrior) }}
```

##### Opções

| Chave | Valor Padrão | Valores Possíveis | Descrição |
|-----|---------------|-----------------|-------------|
| unidades | melhor encaixe | segundo, minuto, hora, dia, mês, ano | A unidade de renderização específica. Por exemplo *30 dias atrás* em vez de *1 mês atrás* |
| estilo | melhor encaixe | numeric | O estilo de renderização para o valor. Por exemplo: *numérico* forçará a saída para *1 dia atrás* em vez de *ontem*. |

#### formatMessage(chave, valores, [callback|opções])
Para formatar uma mensagem, é necessário primeiro salvar suas strings nos arquivos de locais ou na tabela do banco de dados chamada `locales` e deve seguir a sintaxe xref:_icu_messages[Sintaxe de Mensagem ICU].

```js
const Antl = use('Antl')

Antl.formatMessage('messages.total', { total: 1000 })
// or
Antl.formatMessage('messages.total', { total: 1000 }, (message) => {
  message.passFormat('curr').to.('number').withValues({ currency: 'usd' })
})
```

Como as visualizações não permitem adicionar callbacks para uma função, você deve passar uma expressão de string para o método `formatMessage`.

```twig
{{ antl.formatMessage('messages.total', { total: 1000 }) }}
{# or #}
{{ antl.formatMessage('messages.total', { total: 1000 }, 'curr:number[currency=usd]') }}
```

## Locale & Grupos
Ao trabalhar com o provedor Antl, suas mensagens são divididas em segmentos de "local" e "grupos". O local refere-se à língua para a qual você definiu a mensagem, e um grupo define a categoria da mensagem. Veja o seguinte exemplo:

```
├── locales
│   ├── en <1>
│   │   ├── messages.json <2>
```

1. O 'en' é a linguagem da mensagem.
2. O arquivo "messages.json" é o grupo chamado "mensagens" para todas as strings definidas dentro deste arquivo.

Ao traduzir/formatando uma mensagem, você é obrigado a passar uma string começando com o grupo. 'messages.cart.total'. Também para mensagens genéricas que são as mesmas para todos os idiomas podem ser definidos ao lado do grupo "fallback".

```json
// resources/locales/fallback/messages.json

{
  "greeting": "I am available to all the languages."
}
```

Da mesma forma, você pode definir um grupo ao usar o driver de banco de dados.

##### Database locais tabela

| id | localização | grupo | item | texto |
|----|--------|-------|------|------|
| 1 | pt | Mensagens | cart.total | Seu carrinho total é `{total, número, moeda}` |
| 2 | fallback | Mensagens | Cumprimento | Estou disponível para todos os idiomas |

## Detectando o Idioma do Usuário
Até agora, vimos as maneiras de formatar mensagens e valores usando o provedor Antl. Todos os valores serão formatados para o *locale padrão* definido no arquivo `config/app.js`.

```js
// config/locale.js

{
  locales: {
    driver: 'file',
    locale: 'en',
    fallbackLocale: 'en'
  }
}
```

Você pode alterar o valor padrão do idioma e todos os valores serão formatados de acordo. Para tornar esse processo dinâmico com base no idioma do usuário, você precisa usar a middleware Antl que detectará o idioma do usuário e definirá como idioma padrão para todas as traduções.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/DetectLocale'
  // ...
]
```

Agora todas as requisições HTTP cabeçalho *Accept-Language* ou parâmetro de consulta *lang* serão usados para detectar a linguagem do usuário.

## Switching Drivers
O provedor Antlr usa o driver padrão definido no arquivo 'config/app.js'. Você pode alternar os drivers em tempo de execução para usar um driver diferente.

```js
const db = Antl.driver('db')
yield db.load() <1>

db.formatNumber(1000, { format: 'curr' })
```

1. O método xref:_load[load] deve ser chamado após a troca do driver, pois ele carregará e armazenará em cache todas as strings para um determinado driver.

## Adicionando drivers
Você pode estender o *Antl Provider* adicionando seus próprios drivers personalizados e registrá-los no arquivo `bootstrap/extend.js`.

```js
// bootstrap/extend.js

const Ioc = require('adonis-fold').Ioc

Ioc.extend('Adonis/Addons/Antl', 'mongo', (app) => {
  return new Mongo()
})
```

```js
// The Mongo Driver

class Mongo {
  * load () { <1>
    // load all locales and return as a nested object
  }

  * set (locale, group, key, value) { <2>
    // save new/update value
  }

  * remove (locale, group, key) { <3>
    // remove value for a given group
  }
}
```

1. Deve retornar todas as strings de localidade como um objeto aninhado de "linguagem" e "grupo". Por exemplo

```json
{
  "en": {
    "messages": {
      "cart.total": "Your cart total is"
    }
  }
}
```

1. O método 'set' deve salvar o valor para uma determinada chave, grupo e localidade. Se o valor já existir, ele deve atualizá-lo.
2. O método 'remove' deve apagar o valor.
