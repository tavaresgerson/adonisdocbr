# Variáveis ​​de ambiente

Em vez de manter vários arquivos de configuração, um para cada ambiente, o AdonisJS usa [variáveis ​​de ambiente](https://en.wikipedia.org/wiki/Environment_variable) para valores que mudam frequentemente entre seu ambiente local e o de produção. Por exemplo: as credenciais do banco de dados, um sinalizador booleano para alternar o cache de modelos e assim por diante.

## Acessar variáveis ​​de ambiente
O Node.js permite que você acesse nativamente as variáveis ​​de ambiente usando o objeto `process.env`. Por exemplo:

```ts
process.env.NODE_ENV
process.env.HOST
process.env.PORT
```

No entanto, recomendamos **usar o provedor AdonisJS Env**, pois ele melhora ainda mais a API para trabalhar com variáveis ​​de ambiente adicionando suporte para validações e fornece informações de tipo estático.

```ts
import Env from '@ioc:Adonis/Core/Env'

Env.get('NODE_ENV')

// Com valores padrão
Env.get('HOST', '0.0.0.0')
Env.get('PORT', 3333)
```

## Por que validar variáveis ​​de ambiente?
As variáveis ​​de ambiente são injetadas de fora para dentro em seu aplicativo, e você tem pouco ou nenhum controle sobre elas em sua base de código.

Por exemplo, uma seção da sua base de código depende da existência da variável de ambiente `SESSION_DRIVER`.

```ts
const driver = process.env.SESSION_DRIVER

// Código fictício
await Session.use(driver).read()
```

Não há garantia de que, no momento da execução do programa, a variável de ambiente `SESSION_DRIVER` exista e tenha o valor correto. Portanto, você deve validá-la em vez de obter um erro mais tarde no ciclo de vida do programa reclamando sobre o valor **"undefined"**.

```ts
const driver = process.env.SESSION_DRIVER

if (!driver) {
  throw new Error('Missing env variable "SESSION_DRIVER"')
}

if (!['memory', 'file', 'redis'].includes(driver)) {
  throw new Error('Invalid value for env variable "SESSION_DRIVER"')  
}
```

Agora imagine escrever essas condicionais em todos os lugares dentro da sua base de código? **Bem, não é uma ótima experiência de desenvolvimento**.

## Validando variáveis ​​de ambiente
O AdonisJS permite que você **opcionalmente valide** as variáveis ​​de ambiente bem no início do ciclo de vida de inicialização do seu aplicativo e se recusa a iniciar se alguma validação falhar.

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
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
})
```

Além disso, o AdonisJS extrai as informações de tipo estático das regras de validação e fornece o IntelliSense para as propriedades validadas.

![](/docs/assets/adonis-env-intellisense.webp)

## API Schema
A seguir está a lista de métodos disponíveis para validar as variáveis ​​de ambiente.

### `Env.schema.string`
Valida o valor para verificar se ele existe e se é uma string válida. Strings vazias falham nas validações, e você deve usar a variante opcional para permitir strings vazias.

```ts
{
  APP_KEY: Env.schema.string()
}

// Marque como opcional
{
  APP_KEY: Env.schema.string.optional()
}
```

Você também pode forçar o valor a ter um dos formatos predefinidos.

```ts
// Deve ser um host válido (url ou ip)
Env.schema.string({ format: 'host' })

// Deve ser uma URL válida
Env.schema.string({ format: 'url' })

// Deve ser um endereço de e-mail válido
Env.schema.string({ format: 'email' })
```

Ao validar o formato `url`, você também pode definir opções adicionais para forçar/ignorar o `tld` e o `protocol`.

```ts
Env.schema.string({ format: 'url', tld: false, protocol: false })
```

### `Env.schema.boolean`
Força o valor a ser uma representação de string válida de um booleano. Os valores a seguir são considerados booleanos válidos e serão convertidos para `true` ou `false`.

- `'1', 'true'` são convertidos para `Boolean(true)`
- `'0', 'false'` são convertidos para `Boolean(false)`

```ts
{
  CACHE_VIEWS: Env.schema.boolean()
}

// Marque como opcional
{
  CACHE_VIEWS: Env.schema.boolean.optional()
}
```

### `Env.schema.number`
Força o valor a ser uma representação de string válida de um número.

```ts
{
  PORT: Env.schema.number()
}

// Marque como opcional
{
  PORT: Env.schema.number.optional()
}
```

### `Env.schema.enum`

Força o valor a ser um dos valores predefinidos.

```ts
{
  NODE_ENV: Env
    .schema
    .enum(['development', 'production'] as const)
}

// Marque como opcional
{
  NODE_ENV: Env
    .schema
    .enum
    .optional(['development', 'production'] as const)
}
```

### Funções personalizadas
Para todos os outros casos de uso de validação, você pode definir suas funções personalizadas.

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

- Certifique-se de sempre retornar o valor após validá-lo.
- O valor de retorno pode ser diferente do valor de entrada inicial.
- Inferimos o tipo estático do valor de retorno. Neste caso, `Env.get('PORT')` é um número.

## Definindo variáveis ​​no desenvolvimento

Durante o desenvolvimento, você pode definir variáveis ​​de ambiente dentro do arquivo `.env` armazenado na raiz do seu projeto, e o AdonisJS irá processá-lo automaticamente.

```dotenv
# .env

PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=sH2k88gojcp3PdAJiGDxof54kjtTXa3g
SESSION_DRIVER=cookie
CACHE_VIEWS=false
```

### Substituição de variáveis ​​
Junto com o suporte padrão para análise do arquivo `.env`, o AdonisJS também permite a substituição de variáveis.

```sh {3}
HOST=localhost
PORT=3333
URL=$HOST:$PORT
```

Todas as `letras`, `números` e o sublinhado (`_`) após o cifrão (`$`) são analisados ​​como variáveis. Se sua variável contiver qualquer outro caractere, você deve colocá-lo dentro das chaves `{}`.

```sh {2}
REDIS-USER=foo
REDIS-URL=localhost@${REDIS-USER}
```

### Escape do sinal `$`
Se o valor de uma variável contiver um sinal `$`, você deve escapá-lo para evitar a substituição de variáveis.

```sh
PASSWORD=pa\$\$word
```

### Não faça commit do arquivo `.env`
Os arquivos `.env` não são portáteis. Ou seja, as credenciais do banco de dados no seu ambiente local e de produção sempre serão diferentes e, portanto, não há sentido em enviar o `.env` para o controle de versão.

Você deve considerar o arquivo `.env` pessoal para seu ambiente local e criar um arquivo `.env` separado no servidor de produção ou de preparação (e mantê-lo seguro).

O arquivo `.env` pode estar em qualquer local do seu servidor. Por exemplo, você pode armazená-lo dentro de `/etc/myapp/.env` e então informar o AdonisJS sobre ele da seguinte forma.

```sh
ENV_PATH=/etc/myapp/.env node server.js
```

## Definindo variáveis ​​durante os testes
O AdonisJS procurará o arquivo `.env.test` quando o aplicativo for iniciado com a variável de ambiente `NODE_ENV=test`.

As variáveis ​​definidas dentro do arquivo `.env.test` são automaticamente mescladas com o arquivo `.env`. Isso permite que você use um banco de dados diferente ou um driver de sessão diferente ao escrever testes.

## Definindo variáveis ​​em produção
A maioria dos provedores de hospedagem modernos tem suporte de primeira classe para definir variáveis ​​de ambiente dentro de seu console da web. Certifique-se de ler a documentação do seu provedor de hospedagem e definir as variáveis ​​de ambiente antes de implementar seu aplicativo AdonisJS.
