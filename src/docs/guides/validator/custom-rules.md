# Regras de validação personalizadas

Você pode adicionar regras personalizadas ao validador usando o método `validator.rule`. As regras devem ser registradas apenas uma vez. Portanto, recomendamos que você as registre dentro de um provedor de serviços ou um [arquivo de pré-carregamento](../fundamentals/adonisrc-file.md#preloads).

Ao longo deste guia, nós as manteremos dentro do arquivo `start/validator.ts`. Você pode criar este arquivo executando o seguinte comando Ace e selecionando o ambiente como **"Durante o servidor HTTP"**.

```sh
node ace make:prldfile validator
```

![](/docs/assets/validator-prldfile_wipxtd.webp)

Abra o arquivo recém-criado e cole o seguinte código dentro dele.

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

- O método `validator.rule` aceita o nome da regra como o primeiro argumento.
- O segundo argumento é a implementação da regra. A função recebe o valor do campo em validação, as opções de regra e um objeto que representa a árvore de esquema.

No exemplo acima, criamos uma regra `camelCase` que verifica se o valor do campo é o mesmo que sua versão camelCase ou não. Caso contrário, reportaremos um erro usando a instância de classe [errorReporter](https://github.com/adonisjs/validator/blob/develop/src/ErrorReporter/Vanilla.ts#L39).

## Usando a regra
Antes de usar suas regras personalizadas, você terá que informar o compilador TypeScript sobre o mesmo. Caso contrário, ele reclamará que a regra não existe.

Para informar o TypeScript, usaremos [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces) e adicionaremos a propriedade à interface `Rules`.

Crie um novo arquivo no caminho `contracts/validator.ts` (o nome do arquivo não é importante) e cole o seguinte conteúdo dentro dele.

```ts
// contracts/validator.ts

declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    camelCase(): Rule
  }
}
```

Uma vez feito isso, você pode acessar a regra `camelCase` do objeto `rules`.

```ts {1,6}
import { rules, schema, validator } from '@ioc:Adonis/Core/Validator'

await validator.validate({
  schema: schema.create({
    fileName: schema.string([
      rules.camelCase()
    ]),
  }),
  data: {},
})
```

## Passando opções para a regra
As regras também podem aceitar opções, e elas estarão disponíveis para o retorno de chamada de validação como o segundo argumento.

Desta vez, vamos começar pela interface TypeScript e definir as opções que esperamos do consumidor da regra.

```ts
// contracts/validator.ts

declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    camelCase(maxLength?: number): Rule
  }
}
```

Todos os argumentos passados ​​para a função de regra estão disponíveis como uma matriz para a implementação da regra. Então, por exemplo, você pode acessar a opção `maxLength` da seguinte forma.

```ts {3,10}
validator.rule('camelCase', (
  value,
  [maxLength],
  options
) => {
  // Rest of the validation
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

Finalmente, se você notar, estamos passando o nome da regra como `camelCase.maxLength` para o relator de erros. Isso permitirá que os usuários definam uma mensagem de validação personalizada apenas para o `maxLength`.

```ts
messages: {
  'camelCase.maxLength': 'Only {{ options.maxLength }} characters are allowed'
}
```

### Normalizando opções
Muitas vezes você deseja normalizar as opções passadas para uma regra de validação. Por exemplo: usando um `maxLength` padrão quando não fornecido pelo usuário.

Em vez de normalizar as opções dentro do retorno de chamada de validação, recomendamos que você as normalize apenas uma vez durante a fase de compilação.

O método `validator.rule` aceita uma função de retorno de chamada como o terceiro argumento e a executa durante a fase de compilação.

```ts {4-10}
validator.rule(
  'camelCase', // nome da regra
  () => {}, // retorno de chamada de validação
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

```ts {3}
validator.rule(
  'camelCase', // nome da regra
  (value, { maxLength }) => {}, // retorno de chamada de validação
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
Para otimizar o processo de validação, você terá que informar explicitamente ao validador que sua regra de validação é assíncrona por natureza. Basta retornar `async: true` do retorno de chamada de compilação e então você poderá usar `async/await` dentro do retorno de chamada de validação.

```ts {3,6}
validator.rule(
  'camelCase', // nome da regra
  async () => {}, // retorno de chamada de validação
  () => {
    return {
      async: true,
      compiledOptions: {},
    }
  }
)
```

## Restringir regras para trabalhar em um tipo de dado específico
Dentro do retorno de chamada de compilação, você pode acessar o **tipo/subtipo de esquema** do campo no qual a regra de validação é aplicada e então permitir condicionalmente que ele seja usado somente em tipos específicos.

A seguir está um exemplo de restrição da regra `camelCase` somente a um tipo de esquema de string.

```ts
validator.rule(
  'camelCase', // nome da regra
  async () => {}, // retorno de chamada de validação
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

Uma exceção será gerada se alguém tentar usar a regra `camelCase` em um campo não string.

```ts
schema: schema.create({
  fileName: schema.number([
    rules.camelCase() // resultará em um erro em tempo de execução
  ]),
}),
```
