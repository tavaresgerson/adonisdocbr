---
resumo: Aprenda a usar variáveis ​​de ambiente dentro de um aplicativo AdonisJS.
---

# Variáveis ​​de ambiente

As variáveis ​​de ambiente servem para armazenar segredos como a senha do banco de dados, o segredo do aplicativo ou uma chave de API fora da base de código do seu aplicativo.

Além disso, as variáveis ​​de ambiente podem ser usadas para ter configurações diferentes para ambientes diferentes. Por exemplo, você pode usar um mailer de memória durante os testes, um mailer SMTP durante o desenvolvimento e um serviço de terceiros na produção.

Como as variáveis ​​de ambiente são suportadas por todos os sistemas operacionais, plataformas de implantação e pipelines de CI/CD, elas se tornaram um padrão de fato para armazenar segredos e configurações específicas do ambiente.

Neste guia, aprenderemos como aproveitar as variáveis ​​de ambiente dentro de um aplicativo AdonisJS.

## Lendo variáveis ​​de ambiente

O Node.js expõe nativamente todas as variáveis ​​de ambiente como um objeto por meio da [propriedade global `process.env`](https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_env), e você pode acessá-las da seguinte forma.

```dotenv
process.env.NODE_ENV
process.env.HOST
process.env.PORT
```

## Usando o módulo env do AdonisJS

A leitura de variáveis ​​de ambiente por meio do objeto `process.env` não requer configuração no lado do AdonisJS, pois o tempo de execução do Node.js o suporta. No entanto, no restante deste documento, usaremos o módulo env do AdonisJS pelos seguintes motivos.

- Capacidade de armazenar e analisar variáveis ​​de ambiente de vários arquivos `.env`.
- Validar variáveis ​​de ambiente assim que o aplicativo iniciar.
- Ter segurança de tipo estático para variáveis ​​de ambiente validadas.

O módulo env é instanciado dentro do arquivo `start/env.ts`, e você pode acessá-lo em outro lugar dentro do seu aplicativo da seguinte forma.

```ts
import env from '#start/env'

env.get('NODE_ENV')
env.get('HOST')
env.get('PORT')

// Returns 3333 when PORT is undefined
env.get('PORT', 3333)
```

### Compartilhando o módulo env com modelos Edge
Se você quiser acessar variáveis ​​de ambiente dentro de modelos Edge, então você deve compartilhar o módulo `env` como uma variável global com modelos Edge.

Você pode [criar `view.ts` como um arquivo de pré-carregamento](../concepts/adonisrc_file.md#preloads) dentro do diretório `start` e escrever as seguintes linhas de código dentro dele.

```ts
// title: start/view.ts
import env from '#start/env'
import edge from 'edge.js'

edge.global('env', env)
```

## Validando variáveis ​​de ambiente

As regras de validação para variáveis ​​de ambiente são definidas dentro do arquivo `start/env.ts` usando o método `Env.create`.

A validação é realizada automaticamente quando você importa este arquivo pela primeira vez. Normalmente, o arquivo `start/env.ts` é importado por um dos arquivos de configuração do seu projeto. Caso contrário, o AdonisJS importará esse arquivo implicitamente [antes de inicializar o aplicativo](https://github.com/adonisjs/slim-starter-kit/blob/main/bin/server.ts#L34-L36).

O método `Env.create` aceita o esquema de validação como um par chave-valor.

- A chave é o nome da variável de ambiente.
- O valor é a função que executa a validação. Pode ser uma função inline personalizada ou uma referência a métodos de esquema predefinidos como `schema.string` ou `schema.number`.

```ts
import Env from '@adonisjs/core/env'

/**
 * App root is used to locate .env files inside
 * the project root.
 */
const APP_ROOT = new URL('../', import.meta.url)

export default await Env.create(APP_ROOT, {
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  CACHE_VIEWS: Env.schema.boolean(),
  SESSION_DRIVER: Env.schema.string(),
  NODE_ENV: Env.schema.enum([
    'development',
    'production',
    'test'
  ] as const),
})
```

### Informações de tipo estático
As mesmas regras de validação são usadas para inferir as informações de tipo estático. As informações de tipo estão disponíveis ao usar o módulo env.

![](./env_intellisense.jpeg)

## API de esquema do validador

### `schema.string`

O método `schema.string` garante que o valor seja uma string válida. Strings vazias falham na validação, e você deve usar a variante opcional para permitir strings vazias.

```ts
{
  APP_KEY: Env.schema.string()
}

// Mark APP_KEY to be optional
{
  APP_KEY: Env.schema.string.optional()
}
```

O valor da string pode ser validado para sua formatação. A seguir está a lista de formatos disponíveis.

#### `host`
Valida o valor para ser uma URL válida ou um endereço IP.

```ts
{
  HOST: Env.schema.string({ format: 'host' })
}
```

#### `url`
Valida o valor para ser uma URL válida. Opcionalmente, você pode tornar a validação menos rigorosa permitindo que URLs não tenham `protocol` ou `tld`.

```ts
{
  S3_ENDPOINT: Env.schema.string({ format: 'url' })

  // Allow URLs without protocol
  S3_ENDPOINT: Env.schema.string({ format: 'url', protocol: false })

  // Allow URLs without tld
  S3_ENDPOINT: Env.schema.string({ format: 'url', tld: false })
}
```

#### `email`
Valida o valor para ser um endereço de e-mail válido.

```ts
{
  SENDER_EMAIL: Env.schema.string({ format: 'email' })
}
```

### `schema.boolean`

O método `schema.boolean` garante que o valor seja um booleano válido. Valores vazios falham na validação, e você deve usar a variante opcional para permitir valores vazios.

As representações de string de `'true'`, `'1'`, `'false'` e `'0'` são convertidas para o tipo de dados booleano.

```ts
{
  CACHE_VIEWS: Env.schema.boolean()
}

// Mark it as optional
{
  CACHE_VIEWS: Env.schema.boolean.optional()
}
```

### `schema.number`

O método `schema.number` garante que o valor seja um número válido. A representação de string de um valor numérico é convertida para o tipo de dados numérico.

```ts
{
  PORT: Env.schema.number()
}

// Mark it as optional
{
  PORT: Env.schema.number.optional()
}
```

### `schema.enum`

O método `schema.enum` valida a variável de ambiente em relação a um dos valores predefinidos. As opções de enumeração podem ser especificadas como uma matriz de valores ou um tipo de enumeração nativo do TypeScript.

```ts
{
  NODE_ENV: Env
    .schema
    .enum(['development', 'production'] as const)
}

// Mark it as optional
{
  NODE_ENV: Env
    .schema
    .enum
    .optional(['development', 'production'] as const)
}

// Using native enums
enum NODE_ENV {
  development = 'development',
  production = 'production'
}

{
  NODE_ENV: Env.schema.enum(NODE_ENV)
}
```

### Funções personalizadas
As funções personalizadas podem executar validações não cobertas pela API do esquema.

A função recebe o nome da variável de ambiente como o primeiro argumento e o valor como o segundo argumento. Ela deve retornar o valor final após a validação.

```ts
{
  PORT: (name, value) => {
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

## Definindo variáveis ​​de ambiente

### Em desenvolvimento
As variáveis ​​de ambiente são definidas dentro do arquivo `.env` durante o desenvolvimento. O módulo env procura esse arquivo na raiz do projeto e o analisa automaticamente (se existir).

```dotenv
// title: .env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=sH2k88gojcp3PdAJiGDxof54kjtTXa3g
SESSION_DRIVER=cookie
CACHE_VIEWS=false
```

### Em produção
É recomendável usar sua plataforma de implantação para definir as variáveis ​​de ambiente na produção. A maioria das plataformas de implantação modernas tem suporte de primeira classe para definir variáveis ​​de ambiente a partir de sua IU da web.

Suponha que sua plataforma de implantação não forneça meios para definir variáveis ​​de ambiente. Você pode criar um arquivo `.env` na raiz do projeto ou em algum local diferente em seu servidor de produção.

O AdonisJS lerá automaticamente o arquivo `.env` da raiz do projeto. No entanto, você deve definir a variável `ENV_PATH` quando o arquivo `.env` for armazenado em algum local diferente.

```sh
# Attempts to read .env file from project root
node server.js

# Reads the .env file from the "/etc/secrets" directory
ENV_PATH=/etc/secrets node server.js
```

### Durante os testes
As variáveis ​​de ambiente específicas para o ambiente de teste devem ser definidas dentro do arquivo `.env.test`. Os valores deste arquivo substituem os valores do arquivo `.env`.

```dotenv
// title: .env
NODE_ENV=development
SESSION_DRIVER=cookie
ASSETS_DRIVER=vite
```

```dotenv
// title: .env.test
NODE_ENV=test
SESSION_DRIVER=memory
ASSETS_DRIVER=fake
```

```ts
// During tests
import env from '#start/env'

env.get('SESSION_DRIVER') // memory
```

## Todos os outros arquivos dot-env

Juntamente com o arquivo `.env`, o AdonisJS processa as variáveis ​​de ambiente dos seguintes arquivos dot-env. Portanto, você pode opcionalmente criar esses arquivos (se necessário).

O arquivo com a classificação mais alta substitui os valores dos arquivos de classificação mais baixa.

<table>
<thead>
<tr>
<th width="40px">Classificação</th>
<th width="220px">Nome do arquivo</th>
<th>Notas</th>
</tr>
</thead>
<tbody>
<tr>
<td>1º</td>
<td><code>.env.[NODE_ENV].local</code></td>
<td>
Carregado para o <code>NODE_ENV</code> atual. Por exemplo, se o <code>NODE_ENV</code> estiver definido como <code>development</code>, o arquivo <code>.env.development.local</code> será carregado.
</td>
</tr>
<tr>
<td>2º</td>
<td><code>.env.local</code></td>
<td>Carregado em todos os ambientes, exceto os ambientes <code>test</code> e <code>testing</code></td>
</tr>
<tr>
<td>3º</td>
<td><code>.env.[NODE_ENV]</code></td>
<td>
Carregado para o <code>NODE_ENV</code> atual. Por exemplo, se o <code>NODE_ENV</code> estiver definido como <code>development</code>, o arquivo <code>.env.development</code> será carregado.
</td>
</tr>
<tr>
<td>4º</td>
<td><code>.env</code></td>
<td>Carregado em todos os ambientes. Você deve adicionar este arquivo a <code>.gitignore</code> ao armazenar segredos dentro dele.</td>
</tr>
</tbody>
</table>

## Usando variáveis ​​dentro dos arquivos dot-env

Dentro dos arquivos dot-env, você pode referenciar outras variáveis ​​de ambiente usando a sintaxe de substituição de variáveis.

Calculamos o `APP_URL` das propriedades `HOST` e `PORT` no exemplo a seguir.

```dotenv
HOST=localhost
PORT=3333
// highlight-start
URL=$HOST:$PORT
// highlight-end
```

Todas as **letras**, **números** e o **sublinhado (_)** após o sinal `$` são usados ​​para formar um nome de variável. Você deve envolver o nome da variável entre chaves `{}` se o nome tiver caracteres especiais diferentes de um sublinhado.

```dotenv
REDIS-USER=admin
REDIS-URL=localhost@${REDIS-USER}
```

### Escapando o sinal `$`

Para usar o sinal `$` como um valor, você deve escapá-lo para evitar a substituição de variáveis.

```dotenv
PASSWORD=pa\$\$word
```
