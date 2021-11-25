# Regras de validação personalizadas
Você pode adicionar regras personalizadas ao validador usando o método `validator.rule`. As regras devem ser registradas apenas uma vez. Portanto, recomendamos que você os registre em um provedor de serviços ou em um [arquivo pré-carregado](/doc/fundamentals/adonis-rc-file.md#preloads).

Ao longo deste guia, nós os manteremos dentro do arquivo `start/validator.ts`. Você pode criar este arquivo executando o seguinte comando ace e selecionar o ambiente como "During HTTP Server" ("Durante o servidor HTTP").

```bash
node ace make:prldfile validator
```
<img src="/assets/validator-prldfile_wipxtd.png" />

Abra o arquivo recém-criado e cole o código a seguir dentro dele.

```ts
// start/validator.ts

import { string } from '@ioc:Adonis/Core/Helpers'
import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('camelCase', (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  if (value !== string.camelCase(value)) {
    options.errorReporter.report(
      options.pointer,
      'camelCase',
      'camelCase validation failed',
      options.arrayExpressionPointer
    )
  }
})
```

* método O `validator.rule` aceita o nome da regra como o primeiro argumento.
* O segundo argumento é a implementação da regra. A função recebe o valor do campo em validação, as opções de regra e um objeto que representa a árvore do esquema.

No exemplo acima, criamos uma regra `camelCase` que verifica se o valor do campo é igual à versão do camelCase ou não. Do contrário, relataremos um erro usando a instância da classe [`errorReporter`](https://github.com/adonisjs/validator/blob/develop/src/ErrorReporter/Vanilla.ts#L39).

## Usando a regra
Antes de usar suas regras personalizadas, você terá que informar o compilador TypeScript sobre o mesmo. Caso contrário, este reclamará que a regra não existe.

Para informar o TypeScript, usaremos a [fusão de declarações](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) e adicionaremos esta propriedade à interface `Rules`.

Crie um novo arquivo no caminho `contracts/validator.ts` (o nome do arquivo não é importante) e cole o seguinte conteúdo dentro dele.

```ts
// contracts/validador.ts

declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    camelCase(): Rule
  }
}
```

Uma vez feito isso, você pode acessar a regra `camelCase` do objeto `rules`.

```ts
import { rules, schema, validator } from '@ioc:Adonis/Core/Validator'

await validator.validate({
  schema: schema.create({
    fileName: schema.string({}, [
      rules.camelCase()
    ]),
  }),
  data: {},
})
```

## Passando opções para a regra
As regras também podem aceitar opções e estarão disponíveis para o retorno de chamada de validação como o segundo argumento.

Desta vez, vamos começar a partir da interface TypeScript e definir as opções que esperamos do consumidor de regras.

```ts
// contracts/validador.ts

declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    camelCase(maxLength?: number): Rule
  }
}
```

Todos os argumentos passados para a função de regra estão disponíveis como uma matriz para a implementação da regra. Assim, por exemplo, você pode acessar a opção `maxLength` da seguinte maneira.

```ts
validator.rule('camelCase', (
  value,
  [maxLength],
  options
) => {
  // Resto da validação
  if (maxLength && value.length > maxLength) {
    options.errorReporter.report(
      options.pointer,
      'camelCase.maxLength', // 👈 Fique de olho nisso
      'camelCase.maxLength validation failed',
      options.arrayExpressionPointer,
      { maxLength }
    )
  }
})
```

Finalmente, se você notar, estamos passando o nome da regra `camelCase.maxLength` para o relator de erro. Isso permitirá que os usuários definam uma mensagem de validação personalizada apenas para o `maxLength`.

```ts
messages: {
  'camelCase.maxLength': 'Only {{ options.maxLength }} characters are allowed'
}
```

### Opções de normalização
Muitas vezes, você desejaria normalizar as opções passadas para uma regra de validação. Por exemplo: Usar um padrão `maxLength` quando não fornecido pelo usuário.

Em vez de normalizar as opções dentro do retorno de chamada de validação, recomendamos que você normalize-as apenas uma vez durante a fase de compilação.

O método `validator.rule` aceita uma função de retorno de chamada como o terceiro argumento e a executa durante a fase de compilação.

```ts
validator.rule(
  'camelCase', // rule name
  () => {}, // validation callback
  ([maxLength]) => {
    return {
      compiledOptions: {
        maxLength: maxLength || 10,
      },
    }
  }
)
```

O valor `compiledOptions` é então passado para o retorno de chamada de validação como o segundo argumento. Conforme o exemplo acima, o retorno de chamada de validação receberá o `maxLength` como um objeto.

```ts
validator.rule(
  'camelCase', // nome da regra
  (value, { maxLength }) => {}, // retorno da validação
  ([maxLength]) => {
    return {
      compiledOptions: {
        maxLength: maxLength || 10,
      },
    }
  }
)
```

## Regras assíncronas
Para otimizar o processo de validação, você terá que informar explicitamente ao validador que sua regra de validação é assíncrona por natureza. Basta retornar `async: true` do callback de compilação, e então você poderá usar `async/await` dentro do callback de validação.

```ts
validator.rule(
  'camelCase', // nome da regra
  async () => {}, // retorno da validação
  () => {
    return {
      async: true,
      compiledOptions: {},
    }
  }
)
```

## Restringir regras para trabalhar em um tipo específico de dados
No retorno de chamada de compilação, você pode acessar o tipo/subtipo de esquema do campo no qual a regra de validação é aplicada e, em seguida, permitir que seja usado condicionalmente apenas em tipos específicos.

A seguir está um exemplo de restrição da regra `camelCase` apenas a um tipo de esquema de string.

```ts
validator.rule(
  'camelCase', // nome da regra
  async () => {}, // retorno da validação
  (options, type, subtype) => {
    if (subtype !== 'string') {
      throw new Error('"camelCase" rule can only be used with a string schema type')
    }

    return {
      compiledOptions: {},
    }
  }
)
```

Uma exceção será gerada se alguém tentar usar a camelCaseregra em um campo não string.

```ts
schema: schema.create({
  fileName: schema.number([
    rules.camelCase() // resultará em um erro no tempo de execução
  ]),
}),
```
