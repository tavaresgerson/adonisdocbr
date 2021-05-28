# Variáveis de Ambiente

Em vez de manter vários arquivos de configuração, um para cada ambiente, o AdonisJS usa variáveis de ambiente para valores que 
frequentemente mudam entre o ambiente local e o de produção. Por exemplo, as credenciais do banco de dados, um sinalizador booleano 
para alternar o cache de modelos e assim por diante.

#### Acessando as variáveis de ambiente
Node.js nativamente permite que você acesse as variáveis de ambiente usando o object `process.env`. Por exemplo:

```js
process.env.NODE_ENV
process.env.HOST
process.env.PORT
```

No entanto, recomendamos o uso do provedor `AdonisJS Env`, pois ele melhora ainda mais a API para trabalhar com variáveis de ambiente, 
adicionando suporte para validações e fornece informações de tipo estático.

```ts
import Env from '@ioc:Adonis/Core/Env'

Env.get('NODE_ENV')

// Com valores padrão
Env.get('HOST', '0.0.0.0')
Env.get('PORT', 3333)
```

#### Por que validar variáveis de ambiente?
As variáveis de ambiente são injetadas de fora para dentro em seu aplicativo e você tem pouco ou nenhum controle sobre elas 
dentro de sua base de código.

Por exemplo, uma seção de sua base de código depende da existência da váriavel `SESSION_DRIVER`.

```js
const driver = process.env.SESSION_DRIVER

// Código fictício
await Session.use(driver).read()
```

Não há garantia de que, no momento da execução do programa, a variável `SESSION_DRIVER` exista e tenha o valor correto. 
Portanto, você deve validá-lo em vez de obter um erro posteriormente no ciclo de vida do programa reclamando do valor "indefinido" .

```ts
const driver = process.env.SESSION_DRIVER

if (!driver) {
  throw new Error('Missing env variable "SESSION_DRIVER"')
}

if (!['memory', 'file', 'redis'].includes(driver)) {
  throw new Error('Invalid value for env variable "SESSION_DRIVER"')  
}
```

Agora imagine escrever essas condicionais em qualquer lugar dentro de sua base de código? Bem, não é uma grande experiência de desenvolvimento.

### Validando variáveis de ambiente
O AdonisJS permite que você valide, opcionalmente, as variáveis de ambiente bem no início do ciclo de vida de inicialização de 
seu aplicativo e se recusa a iniciar se alguma validação falhar.

Você começa definindo as regras de validação dentro do arquivo `env.ts`.

```ts
import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  CACHE_VIEWS: Env.schema.boolean(),
  SESSION_DRIVER: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
})
```

Além disso, AdonisJS extrai as informações de tipo estático das regras de validação e fornece um IntelliSense para as 
propriedades validadas.

<p align="center">
  <img src="/assets/adonis-env-intellisense.jpg" />
</p>


### API de esquema
A seguir está a lista de métodos disponíveis para validar as variáveis de ambiente.

#### Env.schema.string
Valida o valor para existir e ser uma string válida. Strings vazias falham nas validações e você deve usar a variante opcional
para permitir strings vazias.

```ts
{
  APP_KEY: Env.schema.string()
}

// Marque isso como opcional
{
  APP_KEY: Env.schema.string.optional()
}
```

Você também pode forçar o valor a ter um dos formatos predefinidos.

```ts
// Must be a valid host (url or ip)
Env.schema.string({ format: 'host' })

// Must be a valid URL
Env.schema.string({ format: 'url' })

// Must be a valid email address
Env.schema.string({ format: 'email' })
```

Ao validar para o formato `url`, você também pode definir opções adicionais para forçar/ignorar o `tld` e `protocol`.

```ts
Env.schema.string({ format: 'url', tld: false, protocol: false })
```

#### Env.schema.boolean
Força o valor a ser uma representação de string válida de um booleano. Os valores a seguir são considerados booleanos válidos 
e são convertidos em `true` ou `false`.

+ `'1', 'true'` são lançados para Boolean (`true`)
+ `'0', 'false'` são lançados para Boolean (`false`)

```ts
{
  CACHE_VIEWS: Env.schema.boolean()
}

// Marque isso como opcional
{
  CACHE_VIEWS: Env.schema.boolean.optional()
}
```

#### Env.schema.number
Força o valor a ser uma representação de `string` válida de um número.

```ts
{
  PORT: Env.schema.number()
}

// Marque isso como opcional
{
  PORT: Env.schema.number.optional()
}
```

#### Env.schema.enum
Força o valor a ser um dos valores predefinidos.

```ts
{
  NODE_ENV: Env
    .schema
    .enum(['development', 'production'] as const)
}

// Marque isso como opcional
{
  PORT: Env
    .schema
    .enum
    .optional(['development', 'production'] as const)
}
```

### Funções personalizadas
Para todos os outros casos de uso de validação, você pode definir suas próprias funções personalizadas.

```ts
{
  PORT: (key, value) => {
    if (!value) {
      throw new Error('Value for PORT is required')
    }
    
    if (isNaN(Number(value))) {
      throw new Error('Value for PORT must be a valid number')    
    }

    return Number(value)
  }
}
```

+ Certifique-se de sempre retornar o valor após validá-lo.
+ O valor de retorno pode ser diferente do valor de entrada inicial.
+ Inferimos o tipo estático do valor de retorno. Nesse caso, `Env.get('PORT')` é um número.


### Definindo variáveis em desenvolvimento
Durante o desenvolvimento, você pode definir variáveis de ambiente dentro do arquivo `.env` armazenado na raiz do seu projeto e o
AdonisJS irá processá-lo automaticamente.

```
# .env

PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=sH2k88gojcp3PdAJiGDxof54kjtTXa3g
SESSION_DRIVER=cookie
CACHE_VIEWS=false
```

#### Substituição de variável
Junto com o suporte padrão para análise do arquivo `.env`, o AdonisJS também permite a substituição de variáveis.

```
# .env
HOST=localhost
PORT=3333
URL=$HOST:$PORT
```

Todos os `letter`, `numbers` e o sublinhado (`_`) após o dólar (sinal `$`) é analisado como uma referência variável. 
Se a sua variável contiver qualquer outro caractere, você deve colocá-la entre as chaves `{}`.

```
REDIS-USER=foo
REDIS-URL=localhost@${REDIS-USER}
```

#### Escape o sinal $
Se o valor de uma variável contiver um sinal `$`, você deve escapá-lo para evitar a substituição da variável.

```
PASSWORD=pa\$\$word
```

#### Não commit o arquivo `.env`
Os arquivos `.env` não são portáteis. Ou seja, as credenciais do banco de dados em seu ambiente local e de produção sempre 
serão diferentes e, portanto, não há motivo para enviar o `.env` para o controle de versão.

Você deve considerar o arquivo `.env` pessoal para seu ambiente local e criar um `.env` separado no servidor de produção ou 
temporário (e mantê-lo seguro).

O arquivo `.env` pode estar em qualquer local do seu servidor. Por exemplo, você pode armazená-lo dentro `/etc/myapp/.env` e 
informar AdonisJS sobre ele da seguinte maneira.

```
ENV_PATH=/etc/myapp/.env node server.js
```

### Definindo variáveis durante o teste
O AdonisJS procurará o arquivo `.env.testing` quando o aplicativo for iniciado com a variável `NODE_ENV=testing` de ambiente.

As variáveis definidas dentro do arquivo `.env.testing` são automaticamente mescladas com o arquivo `.env`. Isso permite que você 
use um banco de dados diferente ou um driver de sessão diferente ao escrever testes.

#### Definindo variáveis na produção
A maioria dos provedores de hospedagem modernos tem suporte de primeira classe para definir variáveis de ambiente em seu 
console da web. Certifique-se de ler a documentação do seu provedor de hospedagem e definir as variáveis de ambiente antes
de implantar seu aplicativo AdonisJS.
