# Arquivos

AdonisJS possui suporte integrado para lidar com o upload de arquivos. Você pode gerenciar facilmente *uploads em massa*, *validação de tamanho/extensão de arquivo* e adicionar verificações globais para negar solicitações contendo mais do que a carga útil esperada.

## Exemplo básico

Vamos considerar um exemplo de upload do avatar do usuário. Vamos considerar isso como uma solicitação **PUT** para fazer o upload do avatar do perfil do usuário e executar as validações necessárias para garantir que o usuário esteja fazendo o upload do arquivo correto.

```js
// .app/Http/routes.js
Route.put('/users/:id/avatar', 'UsersController.updateAvatar')
```

Em seguida, você precisa criar o método `updateAvatar` no controlador `UsersController`.

```js
// .app/Http/Controllers/UsersController.js

'use strict'

const Helpers = use('Helpers')
const User = use('App/Model/User')

class UserController {

  * updateAvatar (request, response) {

    const avatar = request.file('avatar', { <1>
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })

    const userId = request.param('id')
    const user = yield User.findOrFail(userId)

    const fileName = `${new Date().getTime()}.${avatar.extension()}` <2>
    yield avatar.move(Helpers.storagePath(), fileName) <3>

    if (!avatar.moved()) {
      response.badRequest(avatar.errors())
      return
    }

    user.avatar = avatar.uploadPath() <4>
    yield user.save()
    response.ok('Avatar updated successfully')
  }
}
module.exports = UsersController
```

1. Primeiro, obtemos um objeto de arquivo do objeto "request". Além disso, podemos definir o "maxSize" e o "allowedExtensions" para validar o arquivo.
2. É importante renomear o arquivo, mesmo é feito por pegar a data e hora atuais e anexar a extensão do arquivo a ele.
3. Em seguida, chamamos a operação de movimento no arquivo instância. Quaisquer erros de validação serão retornados usando o método "errors ()".
4. Se tudo corresse bem, definimos o caminho do avatar ao lado do objeto modelo de usuário e o persistimos no banco de dados.

## Configuração

A configuração para o upload de arquivos é armazenada dentro do arquivo `config/bodyParser.js`.

```js
// .config/bodyParser.js

uploads: {
  multiple: true,
  hash: false,
  maxSize: '2mb'
}
```

1. O 'maxSize' é calculado em todos os arquivos carregados, o que significa que carregar dois arquivos de '1.5mb' cada excederá esse limite.
2. O `maxSize` é verificado logo no início. Isso garante que os atacantes não engasguem seus servidores enviando **gigabytes** de dados.

## Arquivo Instância

O método `request.file` retorna uma instância da classe `File`, que possui diversos métodos para obter informações sobre o arquivo enviado e movê-lo para um determinado caminho.

Carregando vários arquivos retorna uma matriz de instâncias da classe `File`. Por exemplo:

```js
const profilePics = request.file('profile[]')
// profilePics will be an array
```

## Validação

**Arquivo instância** pode gerenciar a validação no tamanho e extensão do arquivo para você. Você só precisa passar as opções ao acessar a instância.

```js
const avatar = request.file('avatar', {
  maxSize: '2mb',
  allowedExtensions: ['jpg', 'png']
})
```

Agora quando você chamar o método "move", as validações serão acionadas com base na configuração definida. Caso as validações acima não sejam suficientes para você, você pode implementar seu próprio método "validate".

### Validação manual
Retornar *true* ou *false* do método `validate` irá definir se a validação foi aprovada ou não. Além disso, você será responsável por definir manualmente a mensagem de erro no objeto da instância.

```js
----
const avatar = request.file('avatar')

avatar.validate = function () {
  if (avatar.extension() !== 'foo') {
    avatar._setError('We support foo files only')
    return false
  }
  return true
}
```

## Métodos de Instância do Arquivo
Abaixo está a lista de métodos disponíveis na instância do arquivo.

#### clientName
Retorna o nome do arquivo enviado.

```js
avatar.clientName()
```

#### tamanho do cliente
Retorna o tamanho do arquivo (em bytes).

```js
avatar.clientSize()
```

#### mimeType
Retorna o tipo MIME do arquivo.

```js
avatar.mimeType()
```

#### extensão
Retorna a extensão do arquivo.

```js
avatar.extension()
```

#### tmpPath
O caminho para a pasta temporária, onde o arquivo foi carregado.

```js
avatar.tmpPath()
```

#### existe
Indica se o arquivo existe ou não dentro da pasta temporária.

```js
avatar.exists()
```

#### move(paraCaminho, [novoNome])
Mova o arquivo para um local especificado com um nome opcional. Se `newName` não for definido, ele fará uso de `clientName()`

```js
yield avatar.move(Helpers.storagePath())
```

#### delete()
Deletar o arquivo da pasta `tmp` após o arquivo ter sido movido.

```js
yield avatar.delete()
```

#### movido
Indica se a operação de movimento foi bem sucedida ou não.

```js
yield avatar.move(Helpers.storagePath())

if (avatar.moved()) {
    // moved successfully
}
```

#### erros
Retorna erros ocorridos durante o processo de "move".

```js
yield avatar.move(Helpers.storagePath())

if (!avatar.moved()) {
  response.send(avatar.errors())
}
```

#### uploadPath

O caminho completo para o diretório de upload com o nome do arquivo.

```js
yield avatar.move(Helpers.storagePath())

avatar.uploadPath()
```

#### nome_do_arquivo
Nome do arquivo enviado.

```js
yield avatar.move(Helpers.storagePath(), 'selfie.jpg')
avatar.uploadName()
```

> NOTE
> `uploadPath` e `uploadName` só estarão disponíveis após a operação de movimento.

#### toJSON
Retorna a representação **JSON** das propriedades do arquivo.

```js
avatar.toJSON()
```
