# Logger

O AdonisJs vem com um registrador completo, construído sobre o [winston](https://github.com/winstonjs/winston), usando os níveis de registro [RFC5424](https://tools.ietf.org/html/rfc5424#page-11).

O criador de logs é fornecido com os seguintes drivers:

* Console (`console`)
* Arquivo (`file`)

Você é livre para adicionar seus próprios drivers, construídos sobre os [transportes do winston](https://github.com/winstonjs/winston#transports).

## Configuração
A configuração do Logger é salva dentro do arquivo `config/app.js` sob o objeto `logger`:

``` js
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

O driver `file` salva seu arquivo de log dentro do diretório `tmp` raiz do aplicativo.

> Você pode definir um caminho absoluto para `filename` para um local diferente do arquivo de log, se desejar.

## Exemplo básico
Vamos começar com um exemplo básico de registro de dados no seu aplicativo:

``` js
const Logger = use('Logger')

Logger.info('request url is %s', request.url())

Logger.info('request details %j', {
  url: request.url(),
  user: auth.user.username()
})
```

> Todos os métodos de registro suportam a sintaxe [`sprintf`](http://www.diveintojavascript.com/projects/javascript-sprintf).

O criador de logs usa níveis de log baseado em [RFC5424](https://tools.ietf.org/html/rfc5424#page-11), expondo métodos simples para cada nível:


| Nível               | Método                      | Uso                                   |
|---------------------|-----------------------------|---------------------------------------|
| 0                   | emerg                       | `Logger.emerg(msg, ...data)`          |
| 1                   | alert                       | `Logger.alert(msg, ...data)`          |
| 2                   | crit                        | `Logger.crit(msg, ...data)`           |
| 3                   | error                       | `Logger.error(msg, ...data)`          |
| 4                   | warning                     | `Logger.warning(msg, ...data)`        |
| 5                   | notice                      | `Logger.notice(msg, ...data)`         |
| 6                   | info                        | `Logger.info(msg, ...data)`           |
| 7                   | debug                       | `Logger.debug(msg, ...data)`          |

## Trocando de Transporte
Você pode alternar o transporte em tempo real usando o método `transport`:

``` js
Logger
  .transport('file')
  .info('request url is %s', request.url())
```

## Nível de log
O criador de logs possui `level`s de log de configuração padrão que pode ser atualizado em tempo de execução.

Qualquer mensagem acima do nível de log definido não é registrada. Por exemplo:

``` js
const Logger = use('Logger')
Logger.level = 'info'

// não logged
Logger.debug('Some debugging info')

Logger.level = 'debug'

// agora logged
Logger.debug('Some debugging info')
```

Essa abordagem pode facilitar a desativação de mensagens de depuração quando o servidor estiver com carga alta.
