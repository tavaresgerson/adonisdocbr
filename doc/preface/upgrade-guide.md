# Atualizando do 4.0
A versão 4.1 contém uma série de correções de bugs e melhorias na API para manter a base de código simples e menos mágica. 
Mudanças recentes foram reduzidas ao mínimo, mas não puderam ser totalmente eliminadas.

## Começando
O primeiro passo é atualizar todas as dependências.

Usamos o `npm-check` para extrair as versões mais recentes dos pacotes:

``` shell
npm install -g npm-check
```

Execute o seguinte comando para atualizar as dependências interativamente:

```
npm-check -u
```

## Manipulação de exceção
Uma das mudanças mais significativas foi no manipulador de exceções globais.

Se você nunca criou o manipulador de exceções globais, sinta-se à vontade para ignorar esta seção.

Faça as seguintes alterações no arquivo `app/Exceptions/Handler.js`.

Assegure-se de que seu manipulador de exceções estenda o `BaseExceptionHandler`:

``` js
  const BaseExceptionHandler = use('BaseExceptionHandler')

  class ExceptionHandler extends BaseExceptionHandler {
  }
```

Chame `super.handle` para exceções que você não deseja manipular:

``` js
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

Por fim, você pode remover as chamadas Exception.bind de sua base de código, já que todas as exceções serão roteadas 
para o manipulador de exceções globais.

## Routing
### Route.url

`Route.url` gera uma URL totalmente qualificada para uma rota pré-registrada.

Anteriormente, o domínio era transmitido como uma string literal.

domínio agora é aceito como um objeto.

Anteriormente:

``` js
  Route.url('posts/:id', { id: 1 }, 'blog.adonisjs.com')
```

Agora

``` js
Roue.url('posts/:id', { id: 1 }, { domain: 'blog.adonisjs.com' })
```

## Validator
O provedor do validador agora usa a versão mais recente do [Indicative](https://indicative.adonisjs.com/), causando as seguintes alterações de quebra.

### formatters
O conceito de formatadores nomeados não existe mais.

Se você quiser usar um formatador pré-existente, em vez de passar pelo nome, você deve agora passar por referência.

Anteriormente:
``` js
  const { validate } = use('Validator')
  validate(data, rules, messages, 'jsonapi')
```

Agora:
``` js
  const { validate, formatters } = use('Validator')
  validate(data, rules, messages, formatters.JsonApi)
```

O mesmo se aplica aos validadores de rota também.

Anteriormente:
``` js
class StoreUser {
  get formatter () {
    return 'jsonapi'
  }
}
```
Agora:
``` js
const { formatters } = use('Validator')
  class StoreUser {
    get formatter () {
      return formatters.JsonApi
    }
  }
```
### configure
A nova versão do Indicative expõe o método [configure](http://indicative.adonisjs.com/docs/api/configure) para definir padrões de toda a biblioteca:
``` js
const { formatters, configure } = use('Validator')

configure({
  FORMATTER: formatters.JsonApi
})
```  

## Views

### css

O `css` global foi alterado para `style`. O `css` global não é mais suportado

Antes:
``` js
{{ css('style') }}
```
Agora:
``` js
{{ style('style') }}
```
## Lucid
Anteriormente, a formatação de datas era inconsistente com registros recém-criados e registros existentes.

Isso foi corrigido na versão mais recente com uma pequena alteração (certifique-se de ler o problema relacionado).

### dates
Os campos de data não são mais convertidos para instâncias de `moment` na instância do modelo.

Anteriormente:
``` js
const user = await User.find(1)
user.created_at instanceof moment // true
```
Agora:
``` js
const user = await User.find(1)
user.created_at instanceof moment // false
```  
Essa alteração impede que você altere a data na instância do modelo diretamente e, em vez disso, use o hook `castDates` 
para alterar a data em que você serializa as propriedades do modelo.

O hook `castDates` funciona como anteriormente:
``` js
class User extends Model {
  static castDates (field, value) {
    if (field === 'dob') {
      return ´$ {value.fromNow(true)} old´
    }
    return super.formatDates(field, value)
  }
}
```

## Goodies
Várias correções de bugs foram aplicadas para manter a base de código confiável.

Além disso, um punhado de melhorias de desempenho foi implementado.

### Validator
O Indicative é reescrito a partir do zero, a nova versão é 2x mais rápida do que era anteriormente.

### Middleware
O middleware agora é resolvido pela camada de análise de middleware no momento da inicialização do aplicativo, instanciando 
uma nova instância deles para cada solicitação (anteriormente, o processo de `resolve` era usado para cada solicitação).

### Melhores erros
Erros agora aparecerão bem formatados no seu terminal, como mostrado abaixo:

<img src="https://pbs.twimg.com/media/DTHfXErU8AADIyQ.png" align="center" />
