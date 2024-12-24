# Configuração

O primeiro passo para remover o código espaguete é encontrar um local dedicado para armazenar a configuração do aplicativo. O AdonisJs usa o diretório `config` para isso. Cada novo projeto criado usando `adonis-cli` vem com um monte de arquivos de configuração pré-configurados. Além disso, você é livre para criar seus arquivos de configuração do aplicativo dentro do mesmo diretório.

## O Provedor de Configuração
Para mantê-lo direto e DRY, o AdonisJs tem um *Provedor de Configuração* integrado que carrega automaticamente todos os arquivos de configuração (terminando com .js) no momento da inicialização do servidor, o que significa que você tem acesso aos valores de todos os arquivos no diretório `config`.

Certifique-se de não exigir manualmente os arquivos de configuração dentro do seu aplicativo e, em vez disso, aproveite o provedor de Configuração.

```js
// Errado

const app = require('./config/app.js')
console.log(app.appKey)
```

```js
// Correto

const Config = use('Config')
console.log(Config.get('app.appKey'))
```

## Leitura/Escrita de Valores
Ler/escrever valores é uma tarefa bastante simples com a ajuda do *provedor de configuração*. Além disso, você pode usar a *notação de ponto* para obter/definir valores.

#### get(key, [defaultValue])
O método `get` é usado para ler valores. Ele também aceita um `defaultValue` opcional, que é retornado quando o valor real é `indefinido` ou `nulo`.

```js
const Config = use('Config')
Config.get('database.host', 'localhost')
```

#### set(key, value)
O método `set` atualizará o valor existente com o novo valor. Ele também criará o par chave/valor se ele não existir.

```js
const Config = use('Config')
Config.set('database.host', '127.0.0.1')
```
