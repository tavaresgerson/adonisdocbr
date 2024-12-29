# Atualizando da versão 4.0

A versão 4.1 contém uma série de *correções de bugs* e *melhorias de API* para manter a base de código simples e menos mágica. Mudanças drásticas foram mantidas no mínimo, no entanto, elas não puderam ser eliminadas completamente.

## Começando

O primeiro passo é atualizar todas as dependências.

Usamos [npm-check](https://www.npmjs.com/package/npm-check) para extrair as versões mais recentes dos pacotes:

```bash
npm install -g npm-check
```

Execute o seguinte comando para atualizar as dependências interativamente:

```bash
npm-check -u
```

## Tratamento de exceções
Uma das mudanças mais significativas foi no [manipulador de exceções global](https://github.com/adonisjs/adonis-framework/issues/718).

OBSERVAÇÃO: se você nunca criou o manipulador de exceções global, sinta-se à vontade para ignorar esta seção.

Faça as seguintes alterações no arquivo `app/Exceptions/Handler.js`.

1. Certifique-se de que seu manipulador de exceções estenda o `BaseExceptionHandler`:
    ```js
    const BaseExceptionHandler = use('BaseExceptionHandler')

    class ExceptionHandler extends BaseExceptionHandler {
    }
    ```

2. Chame `super.handle` para exceções que você não deseja manipular:
    ```js
    class ExceptionHandler extends BaseExceptionHandler {
      async handle (error, { response }) {
        if (error.name === 'UserNotFoundException') {
          // handle it yourself
          return
        }

        super.handle(...arguments)
      }
    }
    ```

3. Por fim, você pode remover chamadas `Exception.bind` da sua base de código, pois todas as exceções serão roteadas para o manipulador de exceções global.

## Roteamento

#### `Route.url`

`Route.url` gera uma URL totalmente qualificada para uma rota pré-registrada.

Anteriormente, `domain` era passado como uma string literal.

`domain` agora é aceito como um objeto.

Anteriormente:
```js
Route.url('posts/:id', { id: 1 }, 'blog.adonisjs.com')
```

Agora:
```js
Route.url('posts/:id', { id: 1 }, { domain: 'blog.adonisjs.com' })
```

## Validador
O provedor do validador agora usa a versão mais recente do [Indicative](https://indicative.adonisjs.com), causando as seguintes alterações de interrupção.

#### formatadores
O conceito de formatadores nomeados não existe mais.

Se você quiser usar um formatador pré-existente, em vez de passar por nome, agora você deve passar por referência.

Anteriormente:
```js
const { validate } = use('Validator')

validate(data, rules, messages, 'jsonapi')
```

Agora:
```js
const { validate, formatters } = use('Validator')

validate(data, rules, messages, formatters.JsonApi)
```

O mesmo se aplica aos validadores de rota também.

Anteriormente:
```js
class StoreUser {
  get formatter () {
    return 'jsonapi'
  }
}
```

Agora:
```js
const { formatters } = use('Validator')

class StoreUser {
  get formatter () {
    return formatters.JsonApi
  }
}
```

#### `configure`
A nova versão do Indicative expõe o método [configure](http://indicative.adonisjs.com/docs/api/configure) para definir padrões de toda a biblioteca:

```js
const { formatters, configure } = use('Validator')

configure({
  FORMATTER: formatters.JsonApi
})
```

## Visualizações

#### `css`

O global `css` foi alterado para `style`. O global `css` não é mais suportado

Anteriormente
```edge
{{ css('style') }}
```

Agora
```edge
{{ style('style') }}
```

## Lucid
Anteriormente, a formatação de data era inconsistente com registros recém-criados e registros existentes.

Isso foi corrigido na versão mais recente com uma *pequena alteração de quebra* (leia o [problema relacionado](https://github.com/adonisjs/adonis-lucid/issues/245)).

#### dates
Os campos de data não são mais convertidos para instâncias `moment` na instância do modelo.

Anteriormente:
```js
const user = await User.find(1)
user.created_at instanceof moment // true
```

Agora:
```js
const user = await User.find(1)
user.created_at instanceof moment // false
```

Essa alteração impede que você altere a data na instância do modelo diretamente e, em vez disso, use o hook `castDates` para alterar a data ao serializar as propriedades do modelo.

O hook `castDates` funciona como antes:

```js
class User extends Model {
  static castDates (field, value) {
    if (field === 'dob') {
      return `${value.fromNow(true)} old`
    }
    return super.formatDates(field, value)
  }
}
```

## Goodies
Várias correções de bugs foram aplicadas para manter a base de código confiável.

Além disso, algumas melhorias de desempenho foram implementadas.

#### Validator
Como o Indicative foi reescrito do zero, a nova versão é *2x mais rápida* do que era anteriormente.

#### Middleware
O middleware agora é resolvido pela camada de análise de middleware no momento da **inicialização** do aplicativo, instanciando uma nova instância deles para cada solicitação (anteriormente, o processo **resolve** era usado para cada solicitação).

#### Erros melhores
Os erros agora aparecerão bem formatados no seu terminal, conforme mostrado abaixo:

![image](https://pbs.twimg.com/media/DTHfXErU8AADIyQ.png)
