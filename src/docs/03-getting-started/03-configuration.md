# Configuração

A primeira etapa para remover o código de massa é encontrar um local dedicado para armazenar a configuração da aplicação. O AdonisJs utiliza o diretório `config` para isso. Todo novo projeto criado usando o `adonis-cli` vem com uma série de arquivos de configuração pré-configurados. Além disso, você pode criar seus próprios arquivos de configuração da aplicação dentro do mesmo diretório.

## Config provedor
Para manter as coisas simples e secas, o Adonis tem um provedor de configuração integrado que carrega automaticamente todos os arquivos de configuração (terminando com .js) na hora de inicializar o servidor, o que significa que você pode acessar valores de todos os arquivos no diretório "config".

Não se esqueça de não exigir manualmente arquivos de configuração dentro do seu aplicativo e em vez disso aproveite o provedor de configuração.

Não entendi a sua pergunta. Você poderia esclarecer melhor o que deseja saber?
```js
const app = require('./config/app.js')
console.log(app.appKey)
```

Direita:
```js
const Config = use('Config')
console.log(Config.get('app.appKey'))
```

## Leitura/Gravação de Valores
Ler/escrever valores é uma tarefa bastante simples com a ajuda do provedor *Config*. Além disso, você pode usar a notação de ponto para obter/definir valores.

#### get(chave, [valorPadrão])
O método 'get' é usado para ler valores. Também ele aceita um parâmetro opcional 'defaultValue', que é retornado quando o valor real for indefinido ou nulo.

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
