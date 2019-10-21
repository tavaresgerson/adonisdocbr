# Sessões

O AdonisJs possui suporte de sessão de primeira classe com uma variedade de drivers embutidos para gerenciar e armazenar 
sessões com eficiência.

Neste guia, aprenderemos como configurar e usar esses diferentes drivers de sessão.

## Configuração
Se o provedor de sessões ainda não estiver configurado, siga as instruções abaixo.

Primeiro, execute o comando `adonis` para baixar o provedor de sessões:

``` js
> adonis install @adonisjs/session
```

O comando acima também cria o arquivo `config/session.js` e exibe um pequeno conjunto de instruções para ajudar a concluir sua 
configuração.

Em seguida, registre o provedor de sessões dentro do arquivo `start/app.js`:

``` js
const providers = [
  '@adonisjs/session/providers/SessionProvider'
]
```

Por fim, registre o middleware da sessão dentro do arquivo `start/kernel.js`:

``` js
const globalMiddleware = [
  'Adonis/Middleware/Session'
]
```

## Drivers suportados
Abaixo está a lista de drivers suportados pelo provedor de sessões. Você pode alterar o driver atual dentro do 
arquivo `config/session.js`.

> O driver Redis requer o pacote `@adonisjs/redis` (consulte a seção [Redis](https://adonisjs.com/docs/4.1/redis) para obter instruções de instalação).

| Nome            | Chave de configuração               | Descrição                                         |
|-----------------|-------------------------------------|---------------------------------------------------|
| Cookie          | cookie                              | Salva os valores da sessão em cookies criptografados. |
| File            | file                                | Salva os valores da sessão em um arquivo no servidor (não deve ser usado se você estiver executando o AdonisJs em vários servidores e atrás de um balanceador de carga). |
| Redis           | redis                               | Economize em Redis (ideal para dimensionar horizontalmente).  |

## Exemplo básico
O objeto `session` é passado como parte do Contexto HTTP, assim como os objetos `request` e `response`.

Aqui está um exemplo rápido de como usar sessões durante o ciclo de vida do HTTP:

``` js
Route.get('/', ({ session, response }) => {
  session.put('username', 'virk')
  response.redirect('/username')
})

Route.get('/username', ({ session }) => {
  return session.get('username') // 'virk'
})
```

## Métodos de sessão
Abaixo está uma lista de todos os métodos de sessão e seus exemplos de uso.

### put (chave, valor)
Adicione um par de chave/valor ao armazenamento da sessão:

``` js
session.put('username', 'virk')
```

### get (key, [defaultValue])
Retorna o valor para uma determinada chave (aceita um valor padrão opcional):

``` js
session.get('username')
```

``` js
// valor padrão
session.get('username', 'defaultName')
```

### all
Receba tudo de volta como um objeto no armazenamento de sessões:

``` js
session.all()
```

### increment (chave, [etapas])
Incremente o valor para uma determinada chave (verifique se o valor anterior é um número):

``` js
session.increment('counter')
```

// incrementa por 5
session.increment('counter', 5)
```

### decrement (tecla, [etapas])
Reduza o valor para uma determinada chave (verifique se o valor anterior é um número):

``` js
session.decrement('counter')

// decremento por 2
session.decrement('counter', 2)
```

### forget (chave)
Remova um par de chave/valor do armazenamento da sessão:

``` js
session.forget('username')
```

### pull (chave, [valor padrão])
Retorne (e remova) um par de chave/valor do armazenamento da sessão:

``` js
const username = session.pull('username') // retorno de username

session.get('username') // null
```

### clear
Esvazie o armazenamento da sessão:

``` js
session.clear()
```

## Mensagens em Flash
Mensagens em Flash são valores de sessão de curta duração apenas para uma única solicitação. Eles são usados principalmente 
para exibir erros de formulário, mas podem ser usados para qualquer outra finalidade.

### Exemplo de formulário HTML
Digamos que queremos validar os dados do usuário enviados e redirecionar de volta para o nosso formulário, se houver erros 
de validação.

Comece com o seguinte formulário HTML:

``` html
<form method="POST" action="/users">
  {{ csrfField() }}
  <input type="text" name="username" />
  <button type="submit">Submit</button>
</form>
```

Em seguida, registre a rota `/users` para validar os dados do formulário:

``` js
const { validate } = use('Validator')

Route.post('users', ({ request, session, response }) => {
  const rules = { username: 'required' }
  const validation = await validate(request.all(), rules)

  if (validation.fails()) {
    session.withErrors(validation.messages()).flashAll()
    return response.redirect('back')
  }

  return 'Validation passed'
})
```

Por fim, reescreva o formulário HTML para recuperar dados em flash usando os assistentes de exibição:

``` html
<form method="POST" action="/users">
  {{ csrfField() }}
  <input type="text" name="username" value="{{ old('username', '') }}" />
  {{ getErrorFor('username') }}
  <button type="submit">Submit</button>
</form>
```

### Métodos Flash
Abaixo está uma lista de todos os métodos de `flash` da sessão e seus exemplos de uso.

#### flashAll
Pisque os dados do formulário de solicitação:

``` js
session.flashAll()
```

#### flashOnly
Pisque apenas os campos selecionados:

``` js
session.flashOnly(['username', 'email'])
```

#### flashExcept
Exiba os dados do formulário de solicitação, exceto os campos selecionados:

``` js
session.flashExcept(['password', 'csrf_token'])
```

#### withErrors
Flash com uma matriz de erros:

``` js
session
  .withErrors([{ field: 'username', message: 'Error message' }])
  .flashAll()
```

#### flash
Pisque um objeto personalizado:

``` js
session.flash({ notification: 'You have been redirected back' })
```

### View Helpers

Ao usar mensagens flash, você pode usar os seguintes auxiliares de exibição para ler valores do armazenamento de sessão flash.

#### old (key, defaultValue)
Retorna o valor para uma determinada chave do armazenamento flash:

``` js
session.flashOnly(['username'])
```

```
<input type="text" name="username" value="{{ old('username', '') }}" />
```

#### hasErrorFor (chave)
Retorna `true` se houver um erro para um determinado campo dentro do armazenamento em flash:

``` js
session
  .withErrors({ username: 'Username is required' })
  .flashAll()
```

``` js
@if(hasErrorFor('username'))
  // display error
@endif
```

#### getErrorFor (key)
Retorna a mensagem de erro para um determinado campo:

``` js
session
  .withErrors({ username: 'Username is required' })
  .flashAll()
```

#### flashMessage (key, defaultValue)
Retorna a mensagem flash para uma determinada chave:

``` js
session.flash({ notification: 'Update successful!' })
```

``` js
@if(flashMessage('notification'))
  <span>{{ flashMessage('notification') }}</span>
@endif
```

## Persistência da sessão
Os valores da sessão são mantidos em massa quando a solicitação termina. Isso mantém o desempenho da solicitação/resposta, 
pois você pode alterar o armazenamento da sessão quantas vezes quiser e uma atualização em massa é realizada apenas no final.

É alcançado através do middleware AdonisJs (veja a implementação [aqui](https://github.com/adonisjs/adonis-session/blob/develop/src/Session/Middleware.js#L89)).

No entanto, há uma ressalva. Se uma exceção for lançada, a camada de middleware será interrompida e os valores da sessão nunca 
serão confirmados.

Os pacotes primários do AdonisJs lidam com isso normalmente, mas você deve confirmar a sessão manualmente se estiver lidando com 
exceções:

``` js
const GE = require('@adonisjs/generic-exceptions')

class MyCustomException extends GE.LogicalException {
  handle (error, { session }) {
    await session.commit()
    // handle exception
  }
}
```
