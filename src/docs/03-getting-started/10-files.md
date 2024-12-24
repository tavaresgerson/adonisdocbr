# Arquivos

O AdonisJs tem suporte pronto para lidar com uploads de arquivos. Você pode gerenciar facilmente *uploads em massa*, *validação de tamanho/extensão de arquivo* e adicionar verificações globais para negar solicitações que contenham mais do que a carga útil esperada.

## Exemplo básico
Vamos dar um exemplo de upload de avatar de usuário. Consideraremos isso como uma solicitação **PUT** para fazer upload do avatar do perfil do usuário e executar as validações necessárias para garantir que o usuário esteja fazendo upload do arquivo correto.

```js
// app/Http/routes.js

Route.put('/users/:id/avatar', 'UsersController.updateAvatar')
```

Em seguida, você precisa criar o método `updateAvatar` em `UsersController`.

```js
// app/Http/Controllers/UsersController.js

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

1. Primeiro, obtemos um objeto de arquivo do objeto `request`. Além disso, podemos definir `maxSize` e `allowedExtensions` para validar o arquivo.
2. É importante renomear o arquivo, o mesmo é feito pegando a data e hora atual e anexando a extensão do arquivo a ele.
3. Em seguida, chamamos a operação de movimentação na instância do arquivo. Quaisquer erros de validação serão retornados usando o método `errors()`.
4. Se tudo correr bem, definimos o caminho do avatar ao lado do objeto do modelo do usuário e o persistimos no banco de dados.

## Config

A configuração para os uploads de arquivo é armazenada dentro do arquivo `config/bodyParser.js`.

```js
// config/bodyParser.js

uploads: {
  multiple: true,
  hash: false,
  maxSize: '2mb'
}
```

1. O `maxSize` é calculado em todos os arquivos enviados, o que significa que o upload de dois arquivos de `1,5 MB` cada excederá esse limite.
2. A verificação `maxSize` é realizada logo no início. Isso garante que os invasores não estejam sufocando seus servidores enviando **Gigabytes** de dados.

## Instância do arquivo

O método `request.file` retorna uma instância da classe `File`, que tem um punhado de métodos para recuperar informações do arquivo enviado e movê-lo para um determinado caminho.

O upload de vários arquivos retorna uma matriz de instâncias de classe `File`. Por exemplo:

```js
const profilePics = request.file('profile[]')
// profilePics será uma matriz
```

## Validação

**Instância de arquivo** pode gerenciar a validação no tamanho e nas extensões do arquivo para você. Você só precisa passar as opções ao acessar a instância.

```js
const avatar = request.file('avatar', {
  maxSize: '2mb',
  allowedExtensions: ['jpg', 'png']
})
```

Agora, quando você chamar o método `move`, as validações serão disparadas com base na configuração definida. Caso as validações acima não sejam suficientes para você, você pode implementar seu próprio método `validate`.

### Validação manual
Retornar *true* ou *false* do método `validate` definirá se a validação foi passada ou não. Além disso, você será responsável por definir a mensagem de erro na instância de arquivo manualmente.

```js
const avatar = request.file('avatar')

avatar.validate = function () {
  if (avatar.extension() !== 'foo') {
    avatar._setError('We support foo files only')
    return false
  }
  return true
}
```

## Métodos de instância de arquivo
Abaixo está a lista de métodos disponíveis na instância de arquivo.

#### `clientName`
Retorna o nome do arquivo carregado.

```js
avatar.clientName()
```

#### `clientSize`
Retorna o tamanho do arquivo (em bytes).

```js
avatar.clientSize()
```

#### `mimeType`
Retorna o tipo mime do arquivo.

```js
avatar.mimeType()
```

#### `extension`
Retorna a extensão do arquivo.

```js
avatar.extension()
```

#### `tmpPath`
O caminho para a pasta temporária, onde o arquivo foi carregado.

```js
avatar.tmpPath()
```

#### `exists`
Informa se o arquivo existe dentro da pasta temporária ou não.

```js
avatar.exists()
```

#### `move(toPath, [newName])`
Move o arquivo para um local fornecido com um nome opcional. Se `newName` não estiver definido, ele fará uso de `clientName()`

```js
yield avatar.move(Helpers.storagePath())
```

#### `delete()`
Exclui o arquivo do diretório `tmp` após o arquivo ter sido movido.

```js
yield avatar.delete()
```

#### `moved`
Informa se a operação de movimentação foi bem-sucedida ou não.

```js
yield avatar.move(Helpers.storagePath())

if (avatar.moved()) {
    // movido com sucesso
}
```

#### `errors`
Retorna erros ocorridos durante o processo de `move`.

```js
yield avatar.move(Helpers.storagePath())

if (!avatar.moved()) {
  response.send(avatar.errors())
}
```

#### `uploadPath`

Caminho completo para o diretório de upload com o nome do arquivo.

```js
yield avatar.move(Helpers.storagePath())

avatar.uploadPath()
```

#### `uploadName`
Nome do arquivo carregado.

```js
yield avatar.move(Helpers.storagePath(), 'selfie.jpg')
avatar.uploadName()
```

::: info NOTA
`uploadPath` e `uploadName` só estarão disponíveis após a operação de movimentação.
:::

#### `toJSON`
Retorna a representação **JSON** das propriedades do arquivo.

```js
avatar.toJSON()
```
