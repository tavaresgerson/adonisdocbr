# Introdução

O AdonisJS tem suporte de primeira classe para **analisar** e **validar** o corpo da solicitação, e não há necessidade de instalar nenhum pacote de terceiros para o mesmo. Basta definir o esquema de validação e validar o corpo da solicitação em relação a ele.

```ts
import Route from '@ioc:Adonis/Core/Route'
import { schema } from '@ioc:Adonis/Core/Validator'

Route.post('posts', async ({ request }) => {
  /**
   * Definição de esquema
   */
  // const newPostSchema = schema.create({schema.string(),
  
    body: schema.string(),
    categories: schema.array().members(schema.number()),
  })

  /**
   * Validar o corpo da solicitação em relação ao esquema
   */
  const payload = await request.validate({ schema: newPostSchema })
})
```

O validador também **extrai os tipos estáticos** da definição do esquema. Você obtém as validações de tempo de execução e a segurança do tipo estático de uma única definição de esquema.

![](/docs/assets/validator-static-types.webp)

## Composição do esquema
A definição do esquema é dividida em três partes principais.

- O método `schema.create` define o formato dos dados que você espera.
- Os métodos `schema.string`, `schema.number` e outros semelhantes definem o tipo de dados para um campo individual.
- Finalmente, você usa o objeto `rules` para aplicar restrições de validação adicionais em um determinado campo. Por exemplo: Validar uma string para ser um e-mail válido é único dentro do banco de dados.

![](/docs/assets/schema-101.png)

::: info NOTA
O objeto `rules` é importado de `@ioc:Adonis/Core/Validator`

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'
```
:::

Se você olhar com cuidado, separamos as **validações de formato** dos **tipos de dados principais**. Então, por exemplo, não há nenhum tipo de dado chamado `schema.email`. Em vez disso, usamos o método `rules.email` para garantir que uma string seja formatada como um e-mail.

Essa separação ajuda a estender o validador com regras personalizadas sem criar tipos de esquema desnecessários que não têm significado. Por exemplo, não há nada chamado **tipo de e-mail**; é apenas uma string, formatada como um e-mail.

## Trabalhando com valores opcionais e nulos
Todos os campos são **obrigatórios** por padrão. No entanto, você pode usar os modificadores `optional`, `nullable` e `nullableAndOptional` para marcar campos como opcionais.

Todos esses modificadores atendem a propósitos diferentes. Vamos dar uma olhada mais de perto neles.

| Modificador           | Comportamento da validação                                                                        | Retorna payload |
|-----------------------|---------------------------------------------------------------------------------------------------|-----------------|
| `optional`            | Permite que valores `null` e `undefined` existam                                                  | Remove a chave do payload de retorno se não for inexistente |
| `nullable`            | Permite que valores `null` existam. No entanto, o campo deve ser definido nos dados de validação  | Retorna o valor do campo, incluindo nulo. |
| `nullableAndOptional` | Permite que valores `null` e `undefined` existam. (O mesmo que o modificador 1)                   | Remove a chave somente quando o valor é indefinido, caso contrário, retorna o valor do campo |

### Caso de uso para o modificador `nullable`

Você frequentemente se verá usando o modificador `nullable` para permitir campos opcionais dentro dos seus formulários de aplicação.

No exemplo a seguir, quando o usuário envia um valor vazio para o campo `fullName`, o servidor receberá `null` e, portanto, você pode atualizar seu nome completo existente dentro do banco de dados para nulo.

```ts
schema: schema.create({
  fullName: schema.string.nullable(),
})
```

### Caso de uso para o modificador `nullableAndOptional`

Se você criar um servidor de API que aceita solicitações PATCH e permite que o cliente atualize uma parte de um recurso, você deve usar o modificador `nullableAndOptional`.

No exemplo a seguir, se o `fullName` for indefinido, você pode assumir que o cliente não deseja atualizar esta propriedade e, se for `null`, ele deseja definir o valor da propriedade de `null`.

```ts
const payload = await request.validate({
  schema: schema.create({
    fullName: schema.string.nullableAndOptional(),
  })
})

const user = await User.findOrFail(1)
user.merge(payload)
await user.save()
```

### Caso de uso para modificador `optional`
O modificador `optional` é útil se você deseja atualizar uma parte de um recurso sem campos opcionais.

A propriedade `email` pode ou não existir no exemplo a seguir. Mas o usuário não pode defini-la como `null`. Se a propriedade não estiver na solicitação, você não atualizará o e-mail.

```ts
const payload = await request.validate({
  schema: schema.create({
    email: schema.string.optional(),
  })
})

const user = await User.findOrFail(1)
user.merge(payload)
await user.save()
```

## Validando solicitações HTTP
Você pode validar o corpo da solicitação, a string de consulta e os parâmetros de rota para uma determinada solicitação HTTP usando o método `request.validate`. Em caso de falha, o método `validate` gerará uma exceção.

```ts
import Route from '@ioc:Adonis/Core/Route'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

Route.post('users', async ({ request, response }) => {
  /**
   * Etapa 1 - Definir esquema
   */
  const newUserSchema = schema.create({
    username: schema.string(),
    email: schema.string([
      rules.email()
    ]),
    password: schema.string([
      rules.confirmed(),
      rules.minLength(4)
    ])
  })

  try {
    /**
     * Etapa 2 - Validar o corpo da solicitação em relação
     *           ao esquema
     */
    const payload = await request.validate({
      schema: newUserSchema
    })
  } catch (error) {
    /**
     * Etapa 3 - Lidar com erros
     */
    response.badRequest(error.messages)
  }
})
```

Recomendamos **NÃO autotratar** a exceção e deixar o AdonisJS [converter a exceção](https://github.com/adonisjs/validator/blob/develop/src/ValidationException/index.ts#L25-L49) em uma resposta usando negociação de conteúdo.

A seguir, uma explicação de como a negociação de conteúdo funciona.

### Aplicativo renderizado pelo servidor

Se você criar um aplicativo da web padrão com modelos do lado do servidor, redirecionaremos o cliente de volta ao formulário e passaremos os erros como mensagens flash da sessão.

A seguir, a estrutura das mensagens de erro dentro do armazenamento flash da sessão.

```ts
{
  errors: {
    username: ['username is required']
  }
}
```

Você pode acessá-las usando o auxiliar global `flashMessages`.

```edge
@if(flashMessages.has('errors.username'))
  <p> {{ flashMessages.get('errors.username') }} </p>
@end
```

### Solicitações com cabeçalho `Accept=application/json`
Solicitações negociando o tipo de dados JSON recebem as mensagens de erro como uma matriz de objetos. Cada mensagem de erro contém o **nome do campo**, a **regra de validação** com falha e a **mensagem de erro**.

```ts
{
  errors: [
    {
      field: 'title',
      rule: 'required',
      message: 'required validation failed',
    },
  ]
}
```

### API JSON
Solicitações negociando usando o cabeçalho `Accept=application/vnd.api+json` recebem as mensagens de erro conforme a [especificação da API JSON](https://jsonapi.org/format/#errors).

```ts
{
  errors: [
    {
      code: 'required',
      source: {
        pointer: 'title',
      },
    // 'required validation failed'

    }
  ]
}
```

## Uso do validador autônomo
Você também pode usar o validador fora de uma solicitação HTTP importando o método `validate` do módulo Validator. A API funcional permanece a mesma. No entanto, você terá que fornecer manualmente os `data` para validar.

```ts
import { validator, schema } from '@ioc:Adonis/Core/Validator'

await validator.validate({
  schema: schema.create({
    // ... define o esquema
  }),
  data: {
    email: 'virk@adonisjs.com',
    password: 'secret'
  }
})
```

Além disso, como você realiza a validação fora de uma solicitação HTTP, você terá que lidar com a exceção e exibir os erros manualmente.

## Classes validadoras
As classes validadoras permitem que você extraia o esquema inline de seus controladores e os mova para uma classe dedicada.

Você pode criar um novo validador executando o seguinte comando Ace.

```sh
node ace make:validator CreateUser

# CREATE: app/Validators/CreateUserValidator.ts
```

Todas as propriedades relacionadas à validação, incluindo `schema`, `messages` são definidas como propriedades na classe.

```ts
// app/Validators/CreateUserValidator.ts

import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
  })

  public messages: CustomMessages = {}
}
```

### Usando o validador

Em vez de passar um objeto com a propriedade `schema`, agora você pode passar o construtor de classe para o método `request.validate`.

```ts {2,5}
import Route from '@ioc:Adonis/Core/Route'
import CreateUser from 'App/Validators/CreateUserValidator'

Route.post('users', async ({ request, response }) => {
  const payload = await request.validate(CreateUser)
})
```

Durante a validação, uma nova instância da classe validadora é criada nos bastidores. Além disso, o método `request.validate` passará o contexto HTTP atual como um primeiro argumento do construtor.

Você também pode construir manualmente a instância da classe e passar quaisquer argumentos que desejar. Por exemplo:

```ts
Route.post('users', async ({ request, response }) => {
  const payload = await request.validate(
    new CreateUser({
      countries: fetchAllowedCountries(),
      states: fetchAllowedStates()
    })
  )
})
```

A seguir está um exemplo de uso das classes validadoras fora da solicitação HTTP.

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

## O que vem a seguir?

- [Validando formulários renderizados pelo servidor](../../cookbooks/validator/validating-server-rendered-forms.md)
- [Mensagens personalizadas](./custom-messages.md)
- [Relatórios de erro](./error-reporters.md)
- [Tipos de esquema disponíveis](../../reference/validator/schema/string.md)
- [Regras de validação disponíveis](../../reference/validator/rules/alpha.md)
