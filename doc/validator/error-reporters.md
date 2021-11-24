# Reportar erros
Os formatadores de erro são úteis quando você está escrevendo um servidor de API seguindo uma especificação predefinida como [JSON:API](https://jsonapi.org/).

Sem formatadores de erro, você precisa fazer um loop manual das mensagens de erro e remodelá-las de acordo com as especificações seguidas por sua equipe de API. Ao mesmo tempo, os formatadores de erro expõem uma API para coletar e estruturar mensagens de erro dentro do ciclo de vida de validação (sem qualquer sobrecarga de desempenho extra).

## Usando reportadores de erros
As validações realizadas usando o método `request.validate` usam a [negociação de conteúdo](/doc/validator/introduction.md#aplicativo-renderizado-pelo-servidor)  para encontrar o melhor relator de erro possível para uma determinada solicitação HTTP.

No entanto, você também pode definir o relator de erros explicitamente, o que desativará as verificações de negociação de conteúdo.

O método `validator.validate` e `request.validate` aceita um relator para usar. Você pode usar um dos [repórteres pré-existentes](https://github.com/adonisjs/validator/blob/develop/src/Validator/index.ts#L219-L222) ou criar/usar um repórter personalizado.

```ts
import { schema, validator } from '@ioc:Adonis/Core/Validator'

validator.validate({
  schema: schema.create({}),
  reporter: validator.reporters.api,
})
```

Dentro das classes do validador, você pode definir o relator como uma propriedade da instância.

```ts
import { schema, validator } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor (protected ctx: HttpContextContract) {}

  public reporter = validator.reporters.api

  public schema = schema.create({
    // ...propriedades da schema
  })
}
```

## Criando seu relator de erro
Cada log do relator deve aderir à interface [ErrorReporterContract](https://github.com/adonisjs/validator/blob/develop/adonis-typings/validator.ts#L168) e definir as seguintes propriedades/métodos nela.

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

| Argumento                 | Descrição           |
|---------------------------|---------------------|
| `pointer`                 | O caminho para o nome do campo. As propriedades aninhadas são representadas com uma notação de ponto. `user.profile.username`  |
| `rule`                    |	O nome da regra de validação  |
| `message`                 | A mensagem de falha   |
| `arrayExpressionPointer`  | Esta propriedade existe quando o campo atual em validação está aninhado dentro de uma matriz. Por exemplo: `users.*.username` é o ponteiro da expressão do array e `users.0.pointer` é o ponteiro. |
| `args`                    | Argumentos aprovados pela regra de validação com falha. |

#### toError
O método `toError` deve retornar uma instância da classe de erro e o validador lançará essa exceção.

#### toJSON
O método `toJSON` deve retornar a coleção de erros relatados pelo validador até o momento.

#### hasErrors
Um booleano para saber se o relator de erros recebeu algum erro até o momento.

Crie um novo arquivo `app/Validators/Reporters/MyReporter.ts` e cole o seguinte conteúdo dentro dele.

### Implementação fictícia
A seguir está uma implementação simulada de um relator de erro customizado. Sinta-se à vontade para ajustá-lo ainda mais para atender às suas necessidades.

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
   * Rastreamento de erros relatados
   */
  private errors: ErrorNode[] = []

  constructor (
    private messages: MessagesBagContract,
    private bail: boolean,
  ) {
  }

  /**
   * Métdo chamado pelas regras de validação 
   * para relatar o erro
   */
  public report (
    pointer: string,
    rule: string,
    message: string,
    arrayExpressionPointer?: string,
    args?: any
  ) {
    /**
     * Ligue a bandeira
     */
    this.hasErrors = true

    /**
     * Use um "pacote" de mensagens para obter a mensagem de erro. 
     * O pacote de mensagens também verifica as mensagens de erro
     * definidas pelo usuário e, portanto, deve sempre ser usado.
     */
    const errorMessage = this.messages.get(
      pointer,
      rule,
      message,
      arrayExpressionPointer,
      args,
    )

    /**
     * Mensagem de erro de rastreamento
     */
    this.errors.push({ message: errorMessage, field: pointer })

    /**
     * O modo Bail significa parar a
     * validação no primeiro erro
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
   * Obtenha mensagens de erro como JSON
   */
  public toJSON () {
    return {
      errors: this.errors,
    }
  }
}
```

## Pontos a serem observados
* Você deve sempre usar o [MessagesBag](https://github.com/adonisjs/validator/blob/develop/src/MessagesBag/index.ts) para recuperar o erro. Ele verifica as mensagens de erro personalizadas definidas pelo usuário e retorna a melhor correspondência para um determinado campo e regra de validação.
* Você sempre deve levantar uma exceção dentro do método `report` quando `this.bail` for definido como `true`.
* Quando estiver em confusão, verifique a implementação dos [relatores de erros existentes](https://github.com/adonisjs/validator/tree/develop/src/ErrorReporter).
