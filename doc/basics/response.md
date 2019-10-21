# Resposta

Este guia descreve como usar o objeto Resposta HTTP para gerar e retornar respostas.

> O objeto bruto `res` do Node.js pode ser acessado como `response.response`.

O AdonisJs passa o objeto de resposta HTTP atual como parte do contexto HTTP, que é enviado a todos os manipuladores de rotas 
e middleware.

``` js
Route.get('/', ({ response }) => {
  response.send('hello world')
})
```

## Exemplo básico
O exemplo a seguir retorna uma matriz de usuários no formato JSON:

``` js
Route.get('/users', async ({ response }) => {
  const users = await User.all()
  response.send(users)
})
```

O método `response.json` também pode ser usado como um alias para `response.send`:

``` js
Route.get('/users', async ({ response }) => {
  response.json(await User.all())
})
```

## Fazendo a resposta
A partir da versão 4.0, você também pode retornar valores do método de fechamento de rota ou controlador em vez 
de usar os métodos `response` dedicados.

Abaixo é equivalente a `response.send` ou `response.json` e pode parecer mais natural com uma simples declaração de retorno:

``` js
Route.get('/', async () => {
  return await User.all()
})
```

### Evitar retornos de chamada
Como o ciclo de vida da solicitação/resposta permite retornar valores ou chamar métodos de resposta dedicados, 
o AdonisJs desencoraja o uso de retornos de chamada por completo.

A seguinte resposta enviada dentro de um retorno de chamada não funcionará:

``` js
Route.get('/', async ({ response }) => {
  fs.readFile('somefile', (error, contents) => {
    response.send(contents)
  })
})
```

O motivo pelo qual o código acima não funciona é porque, assim que o manipulador de rota é executado, o AdonisJs encerra a 
resposta - como o retorno de chamada é executado mais tarde, ocorrerá um erro!

### Promisfying callbacks
O que você pode fazer é promisificar seu retorno de chamada e usá-lo com `await`:

``` js
const fs = use('fs')
const Helpers = use('Helpers')
const readFile = Helpers.promisify(fs.readFile)

Route.get('/', async ({ response }) => {
  return await readFile('somefile')
})
```

O JavaScript tem um ecossistema rico e é 100% possível escrever código sem retornos de chamada apenas promisfizando-os e, 
como comunidade, queremos incentivar essa abordagem.

### Mas... eu gosto das minhas chamadas de retorno!
Se você ainda prefere retornos de chamada, o AdonisJs fornece uma maneira de continuar usando-os.

Simplesmente instrua o objeto `response` a não terminar implicitamente:

``` js
Route.get('/', async ({ response }) => {
  response.implicitEnd = false

  fs.readFile('somefile', (error, contents) => {
    response.send(contents)
  })
})
```

## Cabeçalhos
Use os seguintes métodos para definir/remover cabeçalhos de resposta.

### header
Defina um valor de cabeçalho:

``` js
response.header('Content-type', 'application/json')
```

### safeHeader
Defina apenas um valor de cabeçalho se ele ainda não existir:

``` js
response.safeHeader('Content-type', 'application/json')
```

### removeHeader
Remova um cabeçalho existente:

``` js
response.removeHeader('Content-type')
```

### type
Defina o cabeçalho `Content-Type`:

``` js
response.type('application/json')
```
