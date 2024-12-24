# Internacionalização

A internacionalização é um processo de tradução de seus aplicativos da web para vários idiomas diferentes. Como os aplicativos da web alcançam todas as partes do mundo, a internacionalização facilita a detecção do idioma do usuário e a tradução de seus aplicativos da web para uma experiência localizada.

## Drivers

* Arquivo (file)
* Banco de dados (database)

## Sobre a internacionalização

[Format.js](http://formatjs.io/).
[Sintaxe de mensagem ICU](http://userguide.icu-project.org/formatparse/messages).
* Todas as strings de localidade são armazenadas em arquivos *.json* dentro do diretório `resources/locales` ou da tabela de banco de dados `locales` com base no driver que você está usando.
* Um middleware pode ser usado para detectar o idioma do usuário em tempo de execução.
* Mensagens genéricas (mesmas para todos os idiomas) são salvas dentro do diretório `resources/locales/fallback` e do grupo `fallback` ao usar o driver de banco de dados.

## Configuração
O pacote `adonis-antl` não é instalado/configurado por padrão, e você precisa instalá-lo quando necessário.

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

Com base no driver padrão, você terá que armazenar seus locais dentro do diretório `resources/locales` ou da tabela de banco de dados `locales`. Para simplificar o processo de configuração, você pode executar o seguinte comando.

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

O comando acima criará o diretório `resources/locales/*` ou as migrações para criar a tabela de banco de dados.

## Configuração
A configuração para *Antl Provider* é salva dentro do arquivo `config/app.js`. A versão de lançamento _3.1_ inclui a configuração por padrão, mas certifique-se sempre de mantê-la atualizada.

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

| Chave           | Valores possíveis | Descrição |
|-----------------|-------------------|-------------|
| driver          | arquivo, banco de dados     | O driver a ser usado para ler/escrever e remover strings de localidade.  |
| locale          | Qualquer localidade válida  | A localidade padrão a ser usada quando não for possível detectar a localidade do usuário.  |
| fallbackLocale  | Qualquer localidade válida  | A localidade de fallback quando a localidade do usuário detectada não é suportada.  |

## Exemplo básico
Vamos começar com um exemplo básico de formatação de valores brutos e mensagens escritas usando [Sintaxe ICU](#icu-messages). Desta vez, vamos brincar com o *Ace REPL* dentro da linha de comando.

```bash
./ace repl
```

```bash
Output

repl+>
```

### Formatando valores
```js
const Antl = use('Antl')

Antl.formatAmount(1000, 'usd')

// or
Antl
  .for('fr') <1>
  .formatAmount(1000, 'usd')
```

1. O método `for` permitirá que você alterne o idioma para uma única operação.

![imagem](http://res.cloudinary.com/adonisjs/image/upload/v1475061511/Adonis-Antl_hlpwxd.gif)

### Formatando mensagens
Usando o driver padrão `file`, podemos definir localidades dentro do diretório `resources/locales`. Cada idioma obtém seu próprio subdiretório.

```json
// resources/locales/en/messages.json

{
  "product.cost": "{product} will cost {price, number, usd}"
}
```

```js
// Formatting Product Cost Message

const Antl = use('Antl')
Antl.formatMessage('messages.product.cost', { product: 'Chair', price: 29 })
```

```bash
# Output

Chair will cost $29.00
```

## Mensagens ICU
Antes de começar a usar o provedor *Antl*, é crucial entender a [sintaxe de mensagem ICU](http://userguide.icu-project.org/formatparse/messages), pois é um padrão adotado pela web globalmente.

### Literais de string
Uma mensagem pode ser apenas um literal de string em vários idiomas diferentes.

```json
// resources/locales/en/messages.json

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

### Argumentos simples
Você também pode definir marcadores de posição para argumentos simples e passar dados dinâmicos em tempo de execução para substituí-los por seus valores reais.

```json
// resources/locales/en/messages.json
{
  "greeting": "Hello {name}"
}
```

```json
// resources/locales/fr/messages.json

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
Argumentos formatados fornecem a funcionalidade para definir a chave, o tipo e o formato do argumento como `{ key, type, format }`.

| Nome    | Descrição |
|---------|-------------|
| key     | A chave é usada para definir o nome do espaço reservado que é usado no objeto de dados.  |
| type    | Define o tipo de formato para o valor. A internacionalização tem um conjunto de tipos definidos. |
| format  | Format é um objeto de valores que define como formatar o tipo. Por exemplo: o tipo `number` pode ser formatado como *porcentagem*, *decimal* ou *moeda*. |

```json
// resource/locales/en/messages.json

{
  "cart.total": "Your cart total is {total, number, curr}"
}
```

Agora, ao formatar a mensagem acima, precisamos passar o formato `curr` para o *tipo de número*, para que o formatador embutido possa formatar o total como uma moeda.

```js
const Antl = use('Antl')

Antl.formatMessage('messages.cart.total', { price: 59 }, (message) => {
  message
    .passFormat('curr')
    .to('number')
    .withValues({ currency: 'usd' })
})
```

Além disso, você pode passar o formato como uma expressão em vez de anexar o retorno de chamada.

```js
const Antl = use('Antl')

Antl.formatMessage('messages.cart.total', { price: 59 }, 'curr:number[currency=usd]')
```

Você também pode acessar antl diretamente em suas visualizações usando o global `antl`.

```twig
{{ antl.formatMessage('messages.cart.total', { price: 59 }, 'curr:number[currency=usd]') }}
```

## Métodos Antl
Abaixo está a lista de métodos antl.

#### for(locale)
Alterne temporariamente o local para uma única chamada de método.

```js
Antl.for('fr').formatNumber(1000)
```

#### getLocale
Retorna o local ativo no momento

```js
Antl.getLocale()
```

#### setLocale(locale)
Alterna permanentemente o local para todas as traduções futuras.

```js
Antl.setLocale('fr')
Antl.formatNumber(1000)
```

#### isLocale(locale)
Detecte se um local fornecido é o local ativo.

```js
Antl.isLocale('en')
```

#### locales
Retorna uma lista de locais registrados como uma matriz. É baseado nas mensagens salvas dentro de um arquivo/banco de dados.

```js
Antl.locales()
```

#### strings([group])
Retorna uma lista de strings registradas para um local fornecido/padrão. Um grupo opcional pode ser passado para buscar strings apenas para um grupo fornecido.

> DICA: Este método pode ser útil para preencher um menu suspenso.

```js
Antl.strings()
// or
Antl.strings('messages')
// or
Antl.for('fr').strings()
```

#### pair([group])
Este método é semelhante a xref:_strings_group[strings], mas retorna um objeto simples unindo objetos aninhados com um (ponto).

```js
Antl.pair()
// or
Antl.pair('messages')
// or
Antl.for('fr').pair()
```

#### get(key)
Obtém string bruta para uma determinada chave

```js
Antl.get('messages.cart.total')
// or
Antl.for('fr').get('messages.cart.total')
```

#### set(group, key, value)
Atualiza/Cria valor para uma determinada chave dentro de um grupo

> OBSERVAÇÃO: Este método atualizará o armazenamento subjacente para o driver ativo no momento, o que significa que atualizará a linha do banco de dados ou o sistema de arquivos.

```js
yield Antl.set('messages', 'cart.total', 'You will be paying {total, number, curr}')
```

#### remove(group, key)
Remove uma determinada chave para o local ativo no momento.

```js
yield Antl.remove('messages', 'cart.total')
```

#### load()
Este método é usado para `carregar` os locais para o driver ativo no momento. A primeira vez que o *Antl Provider* carregará todas as strings para o driver padrão definido dentro do arquivo `config/app.js`, enquanto você precisa chamar este método manualmente sempre que alternar o driver em tempo de execução.

> DICA: O método `load` armazena em cache de forma inteligente os valores retornados por um driver. O que significa que chamar o método várias vezes não terá efeitos colaterais.

```js
const db = Antl.driver('database')
yield db.load()

db.formatMessage('messages.cart.total', {total: 1000})
```

#### reload
Como o método `load` armazena em cache os valores, você pode usar `reload` para recarregar à força todas as strings para um determinado driver.

```js
const db = Antl.driver('database')
yield db.reload()

db.formatMessage('messages.cart.total', {total: 1000})
```

## Métodos do Formatador
Abaixo está a lista de métodos do formatador e opções disponíveis que você pode passar para obter a saída desejada.

#### formatNumber(value, options)
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

| Chave                     | Valor Padrão              | Valores Possíveis               | Descrição   |
|---------------------------|---------------------------|---------------------------------|-------------|
| style                     | decimal                   | decimal, currency, percentage   | O estilo de formatação a ser usado para formatar o valor. |
| currency                  | null                      | A valid ISO 4217 currency code  | Se *estilo* for moeda, esta opção deve passar um código de moeda válido a ser usado para formatar o valor. [Lista de referência de código de país](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) |
| currencyDisplay           | symbol                    | symbol, code                    | Como exibir a moeda. Por exemplo, &dollar; é o *símbolo* e USD é o *código* |
| useGrouping               | true                      | true, false                     | Se deve usar separadores de agrupamento como separadores de milhares/lakhs/crores. |
| minimumIntegerDigits      | 1                         | 1-21                            | O número mínimo de dígitos inteiros a serem usados.    |
| minimumFractionDigits     | floating                  | 0-20                            | O número mínimo de dígitos de fração a serem usados. O valor padrão é *0* para números simples e dígitos de unidades menores fornecidos pela ISO 4217 para valores de moeda. |
| maximumFractionDigits     | floating                  | 0-20                            | O número máximo de dígitos de fração a serem usados. O valor padrão é maior que o valor *minimumFractionDigits*. |
| minimumSignificantDigits  | 1                         | 1-21                            | O número mínimo de dígitos significativos a serem usados. |
| maximumSignificantDigits  | minimumSignificantDigits  | 1-21                            | O número máximo de dígitos significativos a serem usados. |

#### formatAmount(value, currency, options)
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

As opções de formatação são semelhantes a [formatNumber](#formatnumbervalue-options)

#### formatDate(value, options)
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

| Chave           | Valor Padrão     | Valores Possíveis                    | Descrição                                             |
|---------------|-------------------|---------------------------------------|-------------------------------------------------------|
| hour12        | locale dependent  | true, false                           | Se deve mostrar o tempo no formato *12 horas* ou não. |
| weekday       | none              | narrow, short, long                   | A representação do dia da semana.                     |
| era           | none              | narrow, short, long                   | A representação da era.                               |
| year          | none              | numeric, 2-digit                      | A representação do ano.                               |
| month         | none              | numeric, 2-digit, narrow, short, long | A representação do mês.                               | 
| day           | none              | numeric, 2-digit                      | A representação do dia.                               |
| hour          | none              | numeric, 2-digit                      | A representação da hora.                              |
| minute        | none              | numeric, 2-digit                      | A representação do minuto.                            |
| second        | none              | numeric, 2-digit                      | A representação do segundo.                           |
| timeZoneName  | none              | short, long                           | A representação do nome do fuso horário.              |

#### formatRelative(key, value, options)
```js
const Antl = use('Antl')
const threeHoursPrior = new Date().setHours(new Date().getHours() - 3)

Antl.formatRelative(threeHoursPrior)
// 3 hours ago
```

```twig
{{ antl.formatRelative(threeHoursPrior) }}
```

| Chave | Valor Padrão  | Valores Possíveis                       | Descrição       |
|-------|---------------|-----------------------------------------|-----------------|
| units | best fit      | second, minute, hour, day, month, year  | A unidade de renderização específica. Por exemplo, *30 dias atrás* em vez de *1 mês atrás* |
| style | best fit      | numeric                                 | O estilo de renderização para o valor. Por exemplo: *numeric* forçará a saída para *1 day ago* em vez de *yesterday*. |

#### formatMessage(key, values, [callback|options])
A formatação de uma mensagem exige que você primeiro salve suas strings dentro dos arquivos locales ou na tabela de banco de dados chamada `locales` e ela deve seguir a [Sintaxe de Mensagem ICU](#icu-messages).

```js
const Antl = use('Antl')

Antl.formatMessage('messages.total', { total: 1000 })
// or
Antl.formatMessage('messages.total', { total: 1000 }, (message) => {
  message.passFormat('curr').to.('number').withValues({ currency: 'usd' })
})
```

Como as visualizações não permitem adicionar retornos de chamada a uma função, você deve passar uma expressão de string para o método `formatMessage`.

```twig
{{ antl.formatMessage('messages.total', { total: 1000 }) }}
{# or #}
{{ antl.formatMessage('messages.total', { total: 1000 }, 'curr:number[currency=usd]') }}
```

## Localidade e grupos
Ao trabalhar com o *provedor Antl*, suas mensagens são divididas em segmentos de `localidade` e `grupos`. Localidade se refere ao idioma para o qual você definiu a mensagem, e um grupo define a categoria da mensagem. Veja o exemplo a seguir:

```bash
----
├── locales
│   ├── en <1>
│   │   ├── messages.json <2>
```

1. `en` é o idioma da mensagem.
2. O arquivo `messages.json` é o grupo chamado *messages* para todas as strings definidas dentro deste arquivo.

Ao traduzir/formatar uma mensagem, você pode ser obrigado a passar uma string começando com o grupo. `messages.cart.total`. Também para mensagens genéricas que são as mesmas para todos os idiomas podem ser definidas ao lado da pasta/grupo `fallback`.

```json
// resources/locales/fallback/messages.json

{
  "greeting": "I am available to all the languages."
}
```

Da mesma forma, você pode definir um grupo ao usar o driver `database`.

Tabela de localidades do banco de dados

| id  | locale    | group     | item        | texto |
|-----|-----------|-----------|-------------|-------|
| 1   | en        | messages  | cart.total  | O total do seu carrinho é {total, número, curr}  |
| 2   | fallback  | messages  | greeting    | Estou disponível para todos os idiomas  |

## Detectando a localidade do usuário
Até agora, vimos as maneiras de formatar mensagens e valores usando o provedor Antl. Todos os valores serão formatados para a *localidade padrão* definida no arquivo `config/app.js`.

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

Você pode alterar o valor da localidade padrão, e todos os valores serão formatados de acordo. Para tornar esse processo dinâmico com base no idioma do usuário, você precisa usar o middleware `Antl`, que detectará o idioma do usuário e o definirá como o idioma padrão para todas as traduções.

```js
// app/Http/kernel.js

const globalMiddleware = [
  // ...
  'Adonis/Middleware/DetectLocale'
  // ...
]
```

Agora, todos os cabeçalhos de solicitações HTTP *Accept-Language* ou o parâmetro de string de consulta *lang* serão usados ​​para detectar o idioma do usuário.

## Trocando drivers
O provedor Antl usa o driver padrão definido dentro do arquivo `config/app.js`. Enquanto você pode alternar os drivers em tempo de execução para usar um driver diferente.

```js
const db = Antl.driver('db')
yield db.load() <1>

db.formatNumber(1000, { format: 'curr' })
```

1. O método [load](#load) deve ser chamado após alternar o driver, pois ele carregará e armazenará em cache todas as strings para um determinado driver.

## Adicionando Drivers
Você pode estender o *Antl Provider* adicionando seus próprios drivers personalizados e registrando-os dentro do arquivo `bootstrap/extend.js`.

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

1. Ele deve retornar todas as strings de localidade como um objeto aninhado de `language` e `group`. Por exemplo
```json
    {
      "en": {
        "messages": {
          "cart.total": "Your cart total is"
        }
      }
    }
    ```

2. O método `set` deve salvar o valor para uma determinada chave, grupo e localidade. Se o valor já existir, ele deve atualizá-lo.
3. O método `remove` deve excluir o valor.
