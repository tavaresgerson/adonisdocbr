# Introdução
O AdonisJS tem suporte de primeira classe para **analisar** e **validar** o corpo da solicitação e não há necessidade de instalar nenhum pacote de terceiros para o mesmo. Em vez disso, defina o esquema de validação e valide o corpo da solicitação em relação a ele.

```ts
import Route from '@ioc:Adonis/Core/Route'
import { schema } from '@ioc:Adonis/Core/Validator'

Route.post('posts', async ({ request }) => {
  /**
   * Definição de esquema
   */
  const newPostSchema = schema.create({
    title: schema.string({ trim: true }),
    body: schema.string({ escape: true }),
    categories: schema.array().members(schema.number()),
  })

  /**
   * Validar o corpo da solicitação em relação ao esquema
   */
  const payload = await request.validate({ schema: newPostSchema })
})
```

O validador também extrai os tipos estáticos da definição do esquema. Ou seja, você obtém as validações de tempo de execução junto com a segurança de tipo estático de uma única definição de esquema.

<img src="/assets/validator-static-types.jpg" />

## Composição do esquema
A definição do esquema é dividida em três partes principais.

* O método `schema.create` define a forma dos dados que você espera.
* O `schema.string`, `schema.number` e outros métodos semelhantes definem o tipo de dados para um campo individual.
* Finalmente, você usa o objeto `rules` para aplicar restrições de validação adicionais em um determinado campo. Por exemplo: Validar uma string para ser um e-mail válido e exclusivo dentro do banco de dados.

<img src="/assets/schema-101.png" />

> O objeto `rules` é importado de `@ioc:Adonis/Core/Validator`
> 
> ```ts 
> import { schema, rules } from '@ioc:Adonis/Core/Validator'
> ```

Se você olhar com atenção, separamos as **validações de formato** dos **tipos de dados principais**. Portanto, por exemplo, não há nenhum tipo de dado chamado `schema.email`. Em vez disso, usamos o método `rules.email` para garantir que uma string seja formatada como um e-mail.

Essa separação ajuda a estender o validador com regras personalizadas sem criar tipos de esquema desnecessários que não têm significado. Por exemplo, não existe uma coisa chamada tipo de e-mail; é apenas uma string formatada como um e-mail.

### Marcando campos como opcionais
As propriedades do esquema são necessárias por padrão. No entanto, você pode marcá-los como opcionais encadeando o método `optional`. A variante opcional está disponível para todos os tipos de esquema.

```ts
schema.create({
  username: schema.string.optional(),
  password: schema.string.optional()
})
```

### Validando objetos/matrizes aninhados
Você pode validar objetos e matrizes aninhados usando os métodos `schema.array` e `schema.object`.

```ts
schema.create({
  user: schema
    .object()
    .members({
      username: schema.string(),
    }),

  tags: schema
    .array()
    .members(schema.string())
})
```

### Validando solicitações HTTP
Você pode validar o corpo da solicitação, a string de consulta e os parâmetros de rota para uma determinada solicitação HTTP usando o método `request.validate`. Em caso de falha, o método `validate` gerará uma exceção.

```ts
import Route from '@ioc:Adonis/Core/Route'
import { schema } from '@ioc:Adonis/Core/Validator'

Route.post('users', async ({ request, response }) => {
  const newUserSchema = schema.create({
    params: schema
      .object()
      .members({
        // ...define esquema para seus parâmetros de rota
      })
    // ...define esquema para seus parâmetros de rota
  })

  try {
    const payload = await request.validate({
      schema: newUserSchema
    })
  } catch (error) {
    response.badRequest(error.messages)
  }
})
```

Recomendamos **NÃO "autocuidar"** a exceção e permitir que o AdonisJS [converta a exceção](https://github.com/adonisjs/validator/blob/develop/src/ValidationException/index.ts#L25-L49) em uma resposta usando a negociação de conteúdo.

A seguir está uma explicação de como funciona a negociação de conteúdo.

## Aplicativo renderizado pelo servidor
Se você construir um aplicativo da Web padrão com modelos do lado do servidor, redirecionaremos o cliente de volta ao formulário e passaremos os erros como mensagens instantâneas da sessão.

A seguir está a estrutura das mensagens de erro dentro do armazenamento flash da sessão.

```json
{
  errors: {
    username: ["username is required"]
  }
}
```

Você pode acessá-los usando o auxiliar global `flashMessages`.

```edge
@if(flashMessages.has('errors.username'))
  <p> {{ flashMessages.get('errors.username') }} </p>
@end
```

## Requisições com cabeçalho `Accept=application/json`
As solicitações de negociação para o tipo de dados JSON recebem as mensagens de erro como uma matriz de objetos. Cada mensagem de erro contém o **nome do campo**, a **regra de validação** com falha e a **mensagem de erro**.

```json
{
  errors: [
    {
      field: "title",
      rule: "required",
      message: "required validation failed"
    }
  ]
}
```

### API JSON
A negociação de solicitações usando cabeçalho `Accept=application/vnd.api+json` recebe as mensagens de erro de acordo com a [especificação da API JSON](https://jsonapi.org/format/#errors).

```json
{
  errors: [
    {
      code: "required",
      source: {
        pointer: "title",
      },
      title: "required validation failed"
    }
  ]
}
```

## Uso do validador autônomo
Você também pode usar o validador fora de uma solicitação HTTP, importando o método `validate` do módulo Validator. A API funcional permanece a mesma. No entanto, você terá que fornecer o `data` para validar manualmente.

```ts
import { validator, schema } from '@ioc:Adonis/Core/Validator'

await validator.validate({
  schema: schema.create({
    // ... define o schema
  }),
  data: {
    email: 'virk@adonisjs.com',
    password: 'secret'
  }
})
```

Além disso, como você executa a validação fora de uma solicitação HTTP, terá que lidar com a exceção e exibir os erros manualmente.

## Classes validadoras
As classes do validador permitem extrair o esquema embutido de seus controladores e movê-los para uma classe dedicada.

Você pode criar um novo validador executando o seguinte comando ace.

```bash
node ace make:validator CreateUser

# CREATE: app/Validators/CreateUserValidator.ts
```

Todas as propriedades relacionadas à validação, incluindo o `schema` e `messages` são definidas como propriedades na classe.


```ts
// app/Validators/CreateUserValidator.ts

import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
  })

  public messages = {}
}
```

### Usando validador
Em vez de passar um objeto com a schemapropriedade, agora você pode passar o construtor da classe para o request.validatemétodo.

```ts
import Route from '@ioc:Adonis/Core/Route'
import CreateUser from 'App/Validators/CreateUserValidator'

Route.post('users', async ({ request, response }) => {
  await request.validate(CreateUser)
})
```

Durante a validação, uma nova instância da classe do validador é criada nos bastidores. Além disso, o método `request.validate` passará o contexto HTTP atual como um primeiro argumento do construtor.

Você também pode construir manualmente a instância da classe e passar quaisquer argumentos que desejar. Por exemplo:

```ts
Route.post('users', async ({ request, response }) => {
  await request.validate(
    new CreateUser({
      countries: fetchAllowedCountries(),
      states: fetchAllowedStates()
    })
  )
})
```

A seguir está um exemplo de uso das classes do validador fora da solicitação HTTP.

```ts
import { validator } from '@ioc:Adonis/Core/Validator'
import CreateUser from 'App/Validators/CreateUserValidator'

await validator.validate(
  new CreateUser({
    countries: fetchAllowedCountries(),
    states: fetchAllowedStates()
  })
)
```

## Qual é o próximo passo?
* Leia o livro de receitas sobre validação de formulários renderizados pelo servidor
* Saiba mais sobre [mensagens personalizadas](/doc/validator/custom-messages.md)
* Saiba mais sobre [relatores de erros](/doc/validator/error-reporters.md)
* Veja todos os tipos de esquema disponíveis
* Veja todas as regras de validação disponíveis
