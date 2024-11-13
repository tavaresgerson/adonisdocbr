# Configuração

A primeira etapa para remover o código de massa é encontrar um local dedicado para armazenar a configuração da aplicação. O AdonisJs utiliza o diretório `config` para isso. Todo novo projeto criado usando o `adonis-cli` vem com uma série de arquivos de configuração pré-configurados. Além disso, você pode criar seus próprios arquivos de configuração da aplicação dentro do mesmo diretório.

## Config provedor
Para manter tudo simples e DRY, o AdonisJs tem um *Config Provider* embutido que carrega automaticamente todos os arquivos de configuração (terminando com .js) no momento da inicialização do servidor, o que significa que você tem acesso aos valores de todos os arquivos no diretório `config`.

Certifique-se de não exigir manualmente os arquivos de configuração dentro do seu aplicativo e, em vez disso, aproveite o Config provider.

Errado:
```js
const app = require('./config/app.js')
console.log(app.appKey)
```

Correto:
```js
const Config = use('Config')
console.log(Config.get('app.appKey'))
```

## Leitura/Gravação de Valores
Ler/escrever valores é uma tarefa bastante simples com a ajuda do provedor *Config*. Além disso, você pode usar a notação de ponto para obter/definir valores.

#### get(chave, [valorPadrão])
O método `get` é usado para ler valores. Ele também aceita um `defaultValue` opcional, que é retornado quando o valor real é `undefined` ou `null`.

```js
const Config = use('Config')
Config.get('database.host', 'localhost')
```

#### set(chave, valor)
O método 'set' atualizará o valor existente com o novo valor. Também criará a chave/valor se não existir.

```js
const Config = use('Config')
Config.set('database.host', '127.0.0.1')
```
