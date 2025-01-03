# Relatores de erro

Os formatadores de erro são úteis quando você está escrevendo um servidor de API seguindo uma especificação predefinida como [JSON\:API](https://jsonapi.org/)

Sem formatadores de erro, você tem que fazer um loop manual nas mensagens de erro e remodelá-las de acordo com a especificação seguida pela sua equipe de API. Ao mesmo tempo, os formatadores de erro expõem uma API para coletar e estruturar mensagens de erro dentro do ciclo de vida de validação (sem nenhuma sobrecarga de desempenho extra).

## Usando relatores de erro
As validações realizadas usando o método `request.validate` usam negociação de conteúdo para [encontrar o melhor relator de erro possível](./introduction.md#server-rendered-app) para uma determinada solicitação HTTP.

No entanto, você também pode definir o relator de erro explicitamente, o que desativará as verificações de negociação de conteúdo.

Tanto o método `validator.validate` quanto o `request.validate` aceitam um relator para uso. Você pode usar um dos [repórteres pré-existentes](https://github.com/adonisjs/validator/blob/develop/src/Validator/index.ts#L219-L222) ou criar/usar um repórter personalizado.

```ts {1,5}
import { schema, validator } from '@ioc:Adonis/Core/Validator'

validator.validate({
  schema: schema.create({}),
  reporter: validator.reporters.api,
})
```

Dentro das classes validadoras, você pode definir o repórter como uma propriedade de instância.

```ts {1,7}
import { schema, validator } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor (protected ctx: HttpContextContract) {}

  public reporter = validator.reporters.api

  public schema = schema.create({
    // ... propriedades do esquema
  })
}
```

## Criando seu repórter de erros
Todo relatório de repórter deve aderir à interface [ErrorReporterContract](https://github.com/adonisjs/validator/blob/develop/adonis-typings/validator.ts#L168) e definir as seguintes propriedades/métodos nele.

```ts
export interface ErrorReporterContract<Messages extends any = any> {
  hasErrors: boolean

  report(
    pointer: string,
    rule: string,
    message: string,
    arrayExpressionPointer?: string,
    args?: any
  ): void

  toError(): any

  toJSON(): Messages
}
```

#### report
O método `report` é chamado pelo validador quando a validação falha. Ele recebe os seguintes argumentos.

| Argumento               | Descrição   |
|-------------------------|-------------|
| pointer                 | O caminho para o nome do campo. Propriedades aninhadas são representadas com uma notação de ponto. `user.profile.username` |
| rule                    | O nome da regra de validação |
| message                 | A mensagem de falha |
| arrayExpressionPointer  | Esta propriedade existe quando o campo atual em validação está aninhado dentro de uma matriz. Por exemplo: `users.*.username` é o ponteiro de expressão da matriz e `users.0.pointer` é o ponteiro. |
| args                    | Argumentos passados ​​pela regra de validação com falha. |

#### `toError`
O método `toError` deve retornar uma instância da classe de erro, e o validador lançará esta exceção.

#### `toJSON`
O método `toJSON` deve retornar a coleção de erros relatados pelo validador até o momento.

#### `hasErrors`
Um booleano para saber se o relator de erros recebeu algum erro até agora.

Crie um novo arquivo `app/Validators/Reporters/MyReporter.ts` e cole o seguinte conteúdo dentro dele.

### Implementação fictícia
A seguir está uma implementação fictícia de um relator de erros personalizado. Sinta-se à vontade para ajustá-lo ainda mais para atender às suas necessidades.

```ts
// app/Validators/Reporters/MyReporter.ts

import {
  ValidationException,
  MessagesBagContract,
  ErrorReporterContract,
} from '@ioc:Adonis/Core/Validator'

/**
 * A forma de um erro individual
 */
type ErrorNode = {
  message: string,
  field: string,
}

export class MyReporter implements ErrorReporterContract<{ errors: ErrorNode[] }> {
  public hasErrors = false

  /**
   * Acompanhamento de erros relatados
   */
  private errors: ErrorNode[] = []

  constructor (
    private messages: MessagesBagContract,
    private bail: boolean,
  ) {
  }

  /**
   * Invocado pelas regras de validação para
   * relatar o erro
   */
  public report (
    pointer: string,
    rule: string,
    message: string,
    arrayExpressionPointer?: string,
    args?: any
  ) {
    /**
     * Ativar o sinalizador
     */
    this.hasErrors = true

    /**
     * Use o saco de mensagens para obter a mensagem de erro. O saco de mensagens
     * também verifica as mensagens de erro definidas pelo usuário e
     * portanto, deve ser sempre usado
     */
    const errorMessage = this.messages.get(
      pointer,
      rule,
      message,
      arrayExpressionPointer,
      args,
    )

    /**
     * Acompanhar mensagem de erro
     */
    this.errors.push({ message: errorMessage, field: pointer })

    /**
     * Modo de fiança significa parar a validação no primeiro
     * erro em si
     */
    if (this.bail) {
      throw this.toError()
    }
  }

  /**
   * Converte falhas de validação em uma exceção
   */
  public toError () {
    throw new ValidationException(false, this.toJSON())
  }

  /**
   * Obter mensagens de erro como JSON
   */
  public toJSON () {
    return {
      errors: this.errors,
    }
  }
}
```

#### Pontos a serem observados

- [MessagesBag](https://github.com/adonisjs/validator/blob/develop/src/MessagesBag/index.ts) para recuperar o erro. Ele verifica as mensagens de erro personalizadas definidas pelo usuário e retorna a melhor correspondência para um determinado campo e regra de validação.
- Você deve sempre gerar uma exceção dentro do método `report` quando `this.bail` estiver definido como true.
- [Relatores de erros existentes](https://github.com/adonisjs/validator/tree/develop/src/ErrorReporter).
