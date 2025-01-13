---
summary: Crie andaimes de arquivos de origem a partir de modelos e atualize o código-fonte TypeScript usando codemods no AdonisJS
---

# Scaffolding e codemods

Scaffolding se refere ao processo de geração de arquivos de origem a partir de modelos estáticos (também conhecidos como stubs), e codemods se referem à atualização do código-fonte TypeScript analisando o AST.

O AdonisJS usa ambos para acelerar as tarefas repetitivas de criação de novos arquivos e configuração de pacotes. Neste guia, abordaremos os blocos de construção do Scaffolding e abordaremos a API codemods que você pode usar nos comandos Ace.

## Blocos de construção

### Stubs
Stubs se refere aos modelos, que são usados ​​para criar arquivos de origem em uma determinada ação. Por exemplo, o comando `make:controller` usa o [controller stub](https://github.com/adonisjs/core/blob/main/stubs/make/controller/main.stub) para criar um arquivo de controlador dentro do projeto host.

### Geradores
Os geradores impõem uma convenção de nomenclatura e geram nomes de arquivo, classe ou método com base nas convenções predefinidas.

Por exemplo, os stubs do controlador usam os geradores [controllerName](https://github.com/adonisjs/application/blob/main/src/generators.ts#L122) e [controllerFileName](https://github.com/adonisjs/application/blob/main/src/generators.ts#L139) para criar um controlador.

Como os geradores são definidos como um objeto, você pode substituir os métodos existentes para ajustar as convenções. Aprenderemos mais sobre isso mais adiante neste guia.

### Codemods
A API codemods vem do pacote [@adonisjs/assembler](https://github.com/adonisjs/assembler/blob/main/src/code_transformer/main.ts) e usa [ts-morph](https://github.com/dsherret/ts-morph) por baixo dos panos.

Como `@adonisjs/assembler` é uma dependência de desenvolvimento, `ts-morph` não incha as dependências do seu projeto na produção. Além disso, significa que as APIs codemods não estão disponíveis na produção.

A API codemods exposta pelo AdonisJS é muito específica para realizar tarefas de alto nível, como **adicionar um provedor ao arquivo `.adonisrc.ts`** ou **registrar um middleware dentro do arquivo `start/kernel.ts`**. Além disso, essas APIs dependem das convenções de nomenclatura padrão, então se você fizer mudanças drásticas no seu projeto, não poderá executar codemods.

### Comando Configure
O comando configure é usado para configurar um pacote AdonisJS. Por baixo dos panos, esse comando importa o arquivo de ponto de entrada principal e executa o método `configure` exportado pelo pacote mencionado.

O método `configure` do pacote recebe uma instância do [comando Configure](https://github.com/adonisjs/core/blob/main/commands/configure.ts) e, portanto, pode acessar os stubs e a API codemods diretamente da instância do comando.

## Usando stubs
Na maioria das vezes, você usará stubs dentro de um comando Ace ou dentro do método `configure` de um pacote que você criou. Você pode inicializar o módulo codemods em ambos os casos por meio do método `createCodemods` do comando Ace.

O método `codemods.makeUsingStub` cria um arquivo de origem a partir de um modelo de stub. Ele aceita os seguintes argumentos:

- A URL para a raiz do diretório onde os stubs são armazenados.
- Caminho relativo do diretório `STUBS_ROOT` para o arquivo stub (incluindo extensão).
- E o objeto de dados para compartilhar com o stub.

```ts {9-10}
// Inside a command

import { BaseCommand } from '@adonisjs/core/ace'

const STUBS_ROOT = new URL('./stubs', import.meta.url)

export default class MakeApiResource extends BaseCommand {
  async run() {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(STUBS_ROOT, 'api_resource.stub', {})
  }
}
```

### Modelos de stubs
Usamos o mecanismo de modelo [Tempura](https://github.com/lukeed/tempura) para processar os stubs com dados de tempo de execução. Tempura é um mecanismo de modelo estilo handlebars superleve para JavaScript.

::: tip DICA
Como a sintaxe do Tempura é compatível com handlebars, você pode configurar seus editores de código para usar o realce de sintaxe handlebar com arquivos `.stub`.
:::

No exemplo a seguir, criamos um stub que gera uma classe JavaScript. Ele usa as chaves duplas para avaliar valores de tempo de execução.

```handlebars
export default class {{ modelName }}Resource {
  serialize({{ modelReference }}: {{ modelName }}) {
    return {{ modelReference }}.toJSON()
  }
}
```

### Usando geradores

Se você executar o stub acima agora, ele falhará porque não fornecemos as propriedades de dados `modelName` e `modelReference`.

Recomendamos calcular essas propriedades dentro do stub usando variáveis ​​inline. Dessa forma, o aplicativo host pode [ejetar o stub](#ejecting-stubs) e modificar as variáveis.

```js
{{#var entity = generators.createEntity('user')}}       // [!code ++]
{{#var modelName = generators.modelName(entity.name)}}  // [!code ++]
{{#var modelReference = string.toCamelCase(modelName)}} // [!code ++]

export default class {{ modelName }}Resource {
  serialize({{ modelReference }}: {{ modelName }}) {
    return {{ modelReference }}.toJSON()
  }
}
```

### Destino de saída
Finalmente, temos que especificar o caminho de destino do arquivo que será criado usando o stub. Mais uma vez, especificamos o caminho de destino dentro do arquivo stub, pois ele permite que o aplicativo host [ejete o stub](#ejecting-stubs) e personalize seu destino de saída.

O caminho de destino é definido usando a função `exports`. A função aceita um objeto e o exporta como o estado de saída do stub. Mais tarde, a API codemods usa esse objeto para criar o arquivo no local mencionado.

```js
{{#var entity = generators.createEntity('user')}}
{{#var modelName = generators.modelName(entity.name)}}
{{#var modelReference = string.toCamelCase(modelName)}}

{{#var resourceFileName = string(modelName).snakeCase().suffix('_resource').ext('.ts').toString()}} // [!code ++]
{{{           // [!code ++]
  exports({   // [!code ++]
    to: app.makePath('app/api_resources', entity.path, resourceFileName)  // [!code ++]
  })          // [!code ++]
}}} // [!code ++]

export default class {{ modelName }}Resource {
  serialize({{ modelReference }}: {{ modelName }}) {
    return {{ modelReference }}.toJSON()
  }
}
```

### Aceitando nome da entidade via comando
Agora, codificamos o nome da entidade como `user` dentro do stub. No entanto, você deve aceitá-lo como um argumento de comando e compartilhá-lo com o stub como o estado do modelo.

```ts
import { BaseCommand, args } from '@adonisjs/core/ace'

export default class MakeApiResource extends BaseCommand {
  @args.string({                                // [!code ++]
    description: 'The name of the resource'     // [!code ++]
  })                                            // [!code ++]
  declare name: string                          // [!code ++]

  async run() {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(STUBS_ROOT, 'api_resource.stub', {
      name: this.name,  // [!code ++]
    })
  }
}
```

```js
{{#var entity = generators.createEntity('user')}} // [!code --]
{{#var entity = generators.createEntity(name)}}   // [!code ++]
{{#var modelName = generators.modelName(entity.name)}}
{{#var modelReference = string.toCamelCase(modelName)}}
{{#var resourceFileName = string(modelName).snakeCase().suffix('_resource').ext('.ts').toString()}}
{{{
  exports({
    to: app.makePath('app/api_resources', entity.path, resourceFileName)
  })
}}}
export default class {{ modelName }}Resource {
  serialize({{ modelReference }}: {{ modelName }}) {
    return {{ modelReference }}.toJSON()
  }
}
```

### Variáveis ​​globais
As seguintes variáveis ​​globais são sempre compartilhadas com um stub.

| Variável       | Descrição    |
|----------------|--------------|
| `app`          | Referência a uma instância da [classe de aplicativo](./application.md).|
| `generators`   | Referência ao [módulo geradores](https://github.com/adonisjs/application/blob/main/src/generators.ts).|
| `randomString` | Referência à função auxiliar [randomString](../references/helpers.md#random).|
| `string`       | Uma função para criar uma instância [construtor de strings](../references/helpers.md#string-builder). Você pode usar o construtor de strings para aplicar transformações em uma string.|
| `flags`        | Os sinalizadores de linha de comando são definidos ao executar o comando ace.|

## Ejetando stubs
Você pode ejetar/copiar stubs dentro de um aplicativo AdonisJS usando o comando `node ace eject`. O comando eject aceita um caminho para o arquivo stub original ou seu diretório pai e copia os modelos dentro do diretório `stubs` da raiz do seu projeto.

No exemplo a seguir, copiaremos o arquivo `make/controller/main.stub` do pacote `@adonisjs/core`.

```sh
node ace eject make/controller/main.stub
```

Se você abrir o arquivo stub, ele terá o seguinte conteúdo.

```js
{{#var controllerName = generators.controllerName(entity.name)}}
{{#var controllerFileName = generators.controllerFileName(entity.name)}}
{{{
  exports({
    to: app.httpControllersPath(entity.path, controllerFileName)
  })
}}}
// import type { HttpContext } from '@adonisjs/core/http'

export default class {{ controllerName }} {
}
```

- [Módulo generators](https://github.com/adonisjs/application/blob/main/src/generators.ts) para gerar o nome da classe do controlador e o nome do arquivo do controlador.
- [Define o caminho de destino](#using-cli-flags-to-customize-stub-output-destination)customizing-the-destination-path) para o arquivo do controlador usando a função `exports`.
- Finalmente, definimos o conteúdo do controlador de scaffold.

Sinta-se à vontade para modificar o stub. Da próxima vez, as alterações serão selecionadas quando você executar o comando `make:controller`.

### Ejetando diretórios

Você pode ejetar um diretório inteiro de stubs usando o comando `eject`. Passe o caminho para o diretório, e o comando copiará o diretório inteiro.

```sh
# Publicar todos os stubs de make
node ace eject make

# Publicar todos os stubs de make:controller
node ace eject make/controller
```

### Usando sinalizadores CLI para personalizar o destino de saída do stub
Todos os comandos de scaffold compartilham os sinalizadores CLI (incluindo os não suportados) com os modelos de stub. Portanto, você pode usá-los para criar fluxos de trabalho personalizados ou alterar o destino de saída.

No exemplo a seguir, usamos o sinalizador `--feature` para criar um controlador dentro do diretório de recursos mencionado.

```sh
node ace make:controller invoice --feature=billing
```

```js
// Controller stub

{{#var controllerName = generators.controllerName(entity.name)}}
{{#var featureDirectoryName = generators.makePath('features', flags.feature)}} // [!code ++]
{{#var controllerFileName = generators.controllerFileName(entity.name)}}
{{{
  exports({
    to: app.httpControllersPath(entity.path, controllerFileName) // [!code --]
    to: app.makePath(featureDirectoryName, entity.path, controllerFileName) // [!code ++]
  })
}}}
// import type { HttpContext } from '@adonisjs/core/http'

export default class {{ controllerName }} {
}
```

### Ejetando stubs de outros pacotes

Por padrão, o comando `eject` copia modelos do pacote `@adonisjs/core`. No entanto, você pode copiar stubs de outros pacotes usando o sinalizador `--pkg`.

```sh
node ace eject make/migration/main.stub --pkg=@adonisjs/lucid
```

### Como você encontra quais stubs copiar?
Você pode encontrar os stubs de um pacote visitando seu repositório GitHub. Armazenamos todos os stubs no nível raiz do pacote dentro do diretório `stubs`.

## Fluxo de execução de stubs
Aqui está uma representação visual de como encontramos e executamos stubs por meio do método `makeUsingStub`.

![](./scaffolding_workflow.png)

## API Codemods
A API codemods é alimentada por [ts-morph](https://github.com/dsherret/ts-morph) e só está disponível durante o desenvolvimento. Você pode instanciar preguiçosamente o módulo codemods usando o método `command.createCodemods`. O método `createCodemods` retorna uma instância da classe [Codemods](https://github.com/adonisjs/core/blob/main/modules/ace/codemods.ts).

```ts
import type Configure from '@adonisjs/core/commands/configure'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()
}
```

### `defineEnvValidations`
Defina regras de validação para variáveis ​​de ambiente. O método aceita um par de variáveis ​​chave-valor. `key` é o nome da variável env e `value` é a expressão de validação como uma string.

::: info NOTA
Este codemod espera que o arquivo `start/env.ts` exista e deve ter a chamada de método `export default await Env.create`.

Além disso, o codemod não substitui a regra de validação existente para uma determinada variável de ambiente. Isso é feito para respeitar as modificações no aplicativo.
:::

```ts
const codemods = await command.createCodemods()

try {
  await codemods.defineEnvValidations({
    leadingComment: 'App environment variables',
    variables: {
      PORT: 'Env.schema.number()',
      HOST: 'Env.schema.string()',
    }
  })
} catch (error) {
  console.error('Unable to define env validations')
  console.error(error)
}
```

```ts
// Saída

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  /**
   * Variáveis ​​de ambiente do aplicativo
   */
  PORT: Env.schema.number(),
  HOST: Env.schema.string(),
})
```

### `defineEnvVariables`
Adicione uma ou várias novas variáveis ​​de ambiente aos arquivos `.env` e `.env.example`. O método aceita um par de variáveis ​​chave-valor.

```ts
const codemods = await command.createCodemods()

try {
  await codemods.defineEnvVariables({
    MY_NEW_VARIABLE: 'some-value',
    MY_OTHER_VARIABLE: 'other-value'
  })
} catch (error) {
  console.error('Unable to define env variables')
  console.error(error)
}
```

Às vezes, você pode querer **não** inserir o valor da variável no arquivo `.env.example`. Você pode fazer isso usando a opção `omitFromExample`.

```ts
const codemods = await command.createCodemods()

await codemods.defineEnvVariables({
  MY_NEW_VARIABLE: 'SOME_VALUE',
}, {
  omitFromExample: ['MY_NEW_VARIABLE']
})
```

O código acima irá inserir `MY_NEW_VARIABLE=SOME_VALUE` no arquivo `.env` e `MY_NEW_VARIABLE=` no arquivo `.env.example`.

### `registerMiddleware`
Registre o middleware AdonisJS em uma das pilhas de middleware conhecidas. O método aceita a pilha de middleware e uma matriz de middleware para registrar.

A pilha de middleware pode ser uma de `server | router | named`.

::: info NOTA
Este codemod espera que o arquivo `start/kernel.ts` exista e deve ter uma chamada de função para a pilha de middleware para a qual você está tentando registrar um middleware.
:::

```ts
const codemods = await command.createCodemods()

try {
  await codemods.registerMiddleware('router', [
    {
      path: '@adonisjs/core/bodyparser_middleware'
    }
  ])
} catch (error) {
  console.error('Unable to register middleware')
  console.error(error)
}
```

```ts
// Saída

import router from '@adonisjs/core/services/router'

router.use([
  () => import('@adonisjs/core/bodyparser_middleware')
])
```

Você pode definir o middleware nomeado da seguinte forma.

```ts
const codemods = await command.createCodemods()

try {
  await codemods.registerMiddleware('named', [
    {
      name: 'auth',
      path: '@adonisjs/auth/auth_middleware'
    }
  ])
} catch (error) {
  console.error('Unable to register middleware')
  console.error(error)
}
```

### `updateRcFile`
Registre `providers`, `commands`, defina `metaFiles` e `commandAliases` no arquivo `adonisrc.ts`.

::: info NOTA
Este codemod espera que o arquivo `adonisrc.ts` exista e deve ter uma chamada de função `export default defineConfig`.
:::

```ts
const codemods = await command.createCodemods()

try {
  await codemods.updateRcFile((rcFile) => {
    rcFile
      .addProvider('@adonisjs/lucid/db_provider')
      .addCommand('@adonisjs/lucid/commands'),
      .setCommandAlias('migrate', 'migration:run')
  })
} catch (error) {
  console.error('Unable to update adonisrc.ts file')
  console.error(error)  
}
```

```ts
// Saída:

import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  commands: [
    () => import('@adonisjs/lucid/commands')
  ],
  providers: [
    () => import('@adonisjs/lucid/db_provider')
  ],
  commandAliases: {
    migrate: 'migration:run'
  }
})
```

### `registerJapaPlugin`
Registre um plugin Japa no arquivo `tests/bootstrap.ts`.

::: info NOTA
Este codemod espera que o arquivo `tests/bootstrap.ts` exista e deve ter a exportação `export const plugins: Config['plugins']`.
:::

```ts
const codemods = await command.createCodemods()

const imports = [
  {
    isNamed: false,
    module: '@adonisjs/core/services/app',
    identifier: 'app'
  },
  {
    isNamed: true,
    module: '@adonisjs/session/plugins/api_client',
    identifier: 'sessionApiClient'
  }
]
const pluginUsage = 'sessionApiClient(app)'

try {
  await codemods.registerJapaPlugin(pluginUsage, imports)
} catch (error) {
  console.error('Unable to register japa plugin')
  console.error(error)
}
```

```ts
// Saída:

import app from '@adonisjs/core/services/app'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'

export const plugins: Config['plugins'] = [
  sessionApiClient(app)
]
```

### `registerPolicies`
Registre as políticas do bouncer do AdonisJS na lista de objetos `policies` exportados do arquivo `app/policies/main.ts`.

::: info NOTA
Este codemod espera que o arquivo `app/policies/main.ts` exista e deve exportar um objeto `policies` dele.
:::

```ts
const codemods = await command.createCodemods()

try {
  await codemods.registerPolicies([
    {
      name: 'PostPolicy',
      path: '#policies/post_policy'
    }
  ])
} catch (error) {
  console.error('Unable to register policy')
  console.error(error)
}
```

```ts
// Saída:

export const policies = {
  PostPolicy: () => import('#policies/post_policy')
}
```

### `registerVitePlugin`

Registre um plugin Vite no arquivo `vite.config.ts`.

::: info NOTA
Este codemod espera que o arquivo `vite.config.ts` exista e deve ter a chamada de função `export default defineConfig`.
:::

```ts
const transformer = new CodeTransformer(appRoot)
const imports = [
  {
    isNamed: false,
    module: '@vitejs/plugin-vue',
    identifier: 'vue'
  },
]
const pluginUsage = 'vue({ jsx: true })'

try {
  await transformer.addVitePlugin(pluginUsage, imports)
} catch (error) {
  console.error('Unable to register vite plugin')
  console.error(error)
}
```

```ts
// Saída:

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({ jsx: true })
  ]
})
```

### `installPackages`

Instale um ou vários pacotes usando o gerenciador de pacotes detectado no projeto do usuário.

```ts
const codemods = await command.createCodemods()

try {
  await codemods.installPackages([
    { name: 'vinejs', isDevDependency: false },
    { name: 'edge', isDevDependency: false }
  ])
} catch (error) {
  console.error('Unable to install packages')
  console.error(error)
}
```

### `getTsMorphProject`

O método `getTsMorphProject` retorna uma instância de `ts-morph`. Isso pode ser útil quando você deseja executar transformações de arquivo personalizadas que não são cobertas pela API Codemods.

```ts
const project = await codemods.getTsMorphProject()

project.getSourceFileOrThrow('start/routes.ts')
```

Certifique-se de ler a [documentação do ts-morph](https://ts-morph.com/) para saber mais sobre as APIs disponíveis.
