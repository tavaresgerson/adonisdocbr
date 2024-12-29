# Logger

O AdonisJs vem com um logger completo construído em cima do [winston](https://github.com/winstonjs/winston), usando níveis de registro [RFC5424](https://tools.ietf.org/html/rfc5424#page-11).

O Logger vem com os seguintes drivers:

1. Console (`console`)
2. Arquivo (`file`)

Você é livre para adicionar seus próprios drivers construídos em cima do [winston transports](https://github.com/winstonjs/winston#transports).

## Configuração
A configuração do Logger é salva dentro do arquivo `config/app.js` sob o objeto `logger`:

```js
// .config/app.js

logger: {
  transport: 'console',
  console: {
    driver: 'console'
  },
  file: {
    driver: 'file',
    filename: 'adonis.log'
  }
}
```

O driver `file` salva seu arquivo de log dentro do diretório raiz do aplicativo `tmp`.

::: tip NOTA
Você pode definir um caminho absoluto `filename` para um local de arquivo de log diferente, se desejar.
:::

## Exemplo básico
Vamos começar com um exemplo básico de dados de log dentro do seu aplicativo:

```js
const Logger = use('Logger')

Logger.info('request url is %s', request.url())

Logger.info('request details %j', {
  url: request.url(),
  user: auth.user.username()
})
```

::: tip DICA
Todos os métodos de log suportam a sintaxe [sprintf](http://www.diveintojavascript.com/projects/javascript-sprintf).
:::

O logger usa níveis de log [RFC5424](https://tools.ietf.org/html/rfc5424#page-11), expondo métodos simples para cada nível:

| Nível | Método  | Uso                             |
|-------|---------|---------------------------------|
| 0     | emerg   | `Logger.emerg(msg, ...data)`    |
| 1     | alert   | `Logger.alert(msg, ...data)`    |
| 2     | crit    | `Logger.crit(msg, ...data)`     |
| 3     | error   | `Logger.error(msg, ...data)`    |
| 4     | warning | `Logger.warning(msg, ...data)`  |
| 5     | notice  | `Logger.notice(msg, ...data)`   |
| 6     | info    | `Logger.info(msg, ...data)`     |
| 7     | debug   | `Logger.debug(msg, ...data)`    |

## Trocando transportes
Você pode trocar transportes rapidamente usando o método `transport`:

```js
Logger
  .transport('file')
  .info('request url is %s', request.url())
```

## Nível de registro
O Logger tem um `nível` de registro de configuração padrão que pode ser atualizado em tempo de execução.

Quaisquer mensagens acima do nível de registro definido não são registradas. Por exemplo:

```js
const Logger = use('Logger')
Logger.level = 'info'

// not logged
Logger.debug('Some debugging info')

Logger.level = 'debug'

// now logged
Logger.debug('Some debugging info')
```

Essa abordagem pode facilitar a desativação de mensagens de depuração quando seu servidor estiver sob alta carga.

