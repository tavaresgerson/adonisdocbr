# Uploads de arquivos

O AdonisJs processa uploads de arquivos com segurança, sem desperdiçar recursos do servidor.

## Exemplo Básico
Vamos ver como lidar com arquivos carregados via formulário HTML:

``` html
<form method="POST" action="upload" enctype="multipart/form-data">
  <input type="file" name="profile_pic" />
  <button type="submit"> Submit </button>
</form>
```

`start/routes.js`
``` js
const Helpers = use('Helpers')

Route.post('upload', async ({ request }) => {
  const profilePic = request.file('profile_pic', {
    types: ['image'],
    size: '2mb'
  })

  await profilePic.move(Helpers.tmpPath('uploads'), {
    name: 'custom-name.jpg',
    overwrite: true
  })

  if (!profilePic.moved()) {
    return profilePic.error()
  }
  return 'File moved'
})
```

O método `request.file` aceita dois argumentos (um nome de campo e um objeto de validação 
para aplicar ao arquivo carregado) e retorna uma instância de [File](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/File.js).

Em seguida, chamamos o método `profilePic.move` que tenta mover o arquivo para o diretório definido 
(neste caso, chamado com opções para salvar o arquivo com um novo nome e sobrescrever o arquivo se necessário).

Por fim, verificamos se a operação de movimentação foi bem-sucedida chamando o método `profilePic.moved()` 
(retornando erros se algum for encontrado).

## Uploads de vários arquivos
AdonisJs torna o upload de vários arquivos tão simples quanto o upload de um único arquivo.

Quando vários arquivos são carregados juntos, `request.file` retorna uma instância [FileJar](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/FileJar.js) 
em vez de uma instância [File](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/File.js):

``` html
<form method="POST" action="upload" enctype="multipart/form-data">
  <input type="file" name="profile_pics[]" multiple />
  <button type="submit"> Submit </button>
</form>
```

`start/routes.js`
``` js
const Helpers = use('Helpers')

Route.post('upload', async ({ request }) => {
  const profilePics = request.file('profile_pics', {
    types: ['image'],
    size: '2mb'
  })

  await profilePics.moveAll(Helpers.tmpPath('uploads'))

  if (!profilePics.movedAll()) {
    return profilePics.errors()
  }
})
```

Com o exemplo acima, faremos um comparação com a maneira como lidamos com um único arquivo:

+ Em vez de `move`, usamos o método `moveAll` (que move todos os arquivos carregados em paralelo para um determinado diretório).
+ Os métodos de arquivo único foram alterados para métodos de arquivo múltiplo (como `moved → movedAll` e `error → errors`).

### Alterar nomes de arquivo
Para mover e renomear um único upload de arquivo, passe um objeto de opções para o método `move` que define o novo arquivo `name`:

``` js
await profilePic.move(Helpers.tmpPath('uploads'), {
  name: 'my-new-name.jpg'
})
```

Para mover e renomear vários uploads de arquivo, passe um retorno de chamada para o método `moveAll` para criar um objeto de 
opções personalizadas para cada arquivo dentro de sua instância de [FileJar](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/FileJar.js):

``` js
profilePics.moveAll(Helpers.tmpPath('uploads'), (file) => {
  return {
    name: `${new Date().getTime()}.${file.subtype}`
  }
})
```

### Lista movida
Ao mover vários uploads de arquivo, é possível que alguns arquivos sejam movidos com sucesso enquanto outros rejeitam devido a falhas de validação.

Nesse caso, você pode usar os métodos `movedAll()` e `movedList()` para otimizar seu fluxo de trabalho:

``` js
const removeFile = Helpers.promisify(fs.unlink)

if (!profilePics.movedAll()) {
  const movedFiles = profilePics.movedList()

  await Promise.all(movedFiles.map((file) => {
    return removeFile(path.join(file._location, file.fileName))
  }))

  return profilePics.errors()
}
```

## Opções de Validação

As seguintes opções de validação podem ser passadas para validar um arquivo antes de concluir uma operação de movimentação:

| Chave       | Valor                 | Descrição                                                                                           |
|-------------|-----------------------|-----------------------------------------------------------------------------------------------------|
| `types`     | `String[]`            | Uma variedade de tipos permitidos. O valor será verificado em relação ao tipo de mídia do arquivo.  |
| `size`      | `String` ou `Number`  | O tamanho máximo permitido para o arquivo. O valor é analisado usando o método [bytes.parse](https://github.com/visionmedia/bytes.js#bytesparsestringnumber-value-numbernull). |
| `extnames`  | `String[]`            | Para ter um controle mais granular sobre o tipo de arquivo, você pode definir as extensões permitidas sobre a definição do tipo.  |

Um exemplo de como aplicar regras de validação é o seguinte:

```js
const validationOptions = {
  types: ['image'],
  size: '2mb',
  extnames: ['png', 'gif']
}
const avatar = request.file('avatar', validationOptions)

// é quando ocorre a validação
await avatar.move()
```

## Tipos de Erro
Quando a validação de upload falha, o método `[File](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/File.js).error` retorna 
um objeto contendo o original `fieldName` com falha, `clientName`, um erro `message` e `type` (tipo de regra) que acionou o erro.

> O método `errors` de [FileJar](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/FileJar.js) retorna uma **matriz** de erros.

Alguns exemplos de objetos de erro estão listados abaixo.

### Erro de escrita
```js
{
  fieldName: "field_name",
  clientName: "invalid-file-type.ai",
  message: "Invalid file type postscript or application. Only image is allowed",
  type: "type"
}
```

### Erro de tamanho
```js
{
  fieldName: "field_name",
  clientName: "invalid-file-size.png",
  message: "File size should be less than 2MB",
  type: "size"
}
```

## Propriedades do arquivo
As seguintes propriedades do arquivo podem ser acessadas na instância de [File](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/File.js):

| Propriedade                                                           | Não processado  | Dentro do tmp     | Movido      |
|-----------------------------------------------------------------------|-----------------|-------------------|-------------|
| `clientName` <br> Nome do arquivo na máquina cliente                  | `String`        | `String`          | `String`    |
| `fileName` <b> Nome do arquivo após a operação de movimentação        | `null`          | `null`            | `String`    |
| `fieldName` <br> Nome do campo do formulário                          | `String`        | `String`          | `String`    |
| `tmpPath` <br> Caminho temporário                                     | `null`          | `String`          | `String`    |
| `size` <br> Tamanho do arquivo em bytes                               | 0               | `Number`          | `Number`    |
| `type` <br> Tipo primário de arquivo                                  | `String`        | `String`          | `String`    |
| `subtype` <br> Subtipo de arquivo                                     | `String`        | `String`          | `String`    |
| `status` <br> Status do arquivo (definido para errorquando falhou)    | `pending`       | `consumed`        | `moved`     |
| `extname` <br> Extensão de arquivo                                    | `String`        | `String`          | `String`    |

## Validadores de rota
Os [validadores de rota](https://adonisjs.com/docs/4.1/validator#_route_validator) validam os arquivos carregados antes de transmiti-los ao controlador.

No exemplo de validador de rota abaixo em `app/Validators/StoreUser.js`

```js
'use strict'

class StoreUser {
  get rules () {
    return {
      avatar: 'file|file_ext:png,jpg|file_size:2mb|file_types:image'
    }
  }
}

module.exports = StoreUser
```
1. A regra `file` garante que o campo `avatar` seja um Arquivo válido.
2. A regra `file_ext` define o nome de extensões permitidas para o arquivo.
3. A regra `file_size` define o tamanho máximo para o arquivo.
4. A regra `file_types` define os tipos permitidos para o arquivo.

## Arquivos de streaming
A maioria das bibliotecas/estruturas de upload processa arquivos várias vezes ao fazer streaming para um serviço externo como o Amazon S3.
Seus fluxos de trabalho de upload geralmente são projetados da seguinte forma:

1. Processar arquivos de solicitação e salvá-los no diretório `tmp`.
2. Mova cada arquivo do diretório `tmp` para o diretório de destino.
3. Use o SDK do serviço externo para finalmente transmitir o arquivo para o serviço externo.
4. Este processo desperdiça recursos do servidor lendo/gravando arquivos únicos várias vezes.

O AdonisJs torna o processo de streaming de arquivos carregados muito mais eficiente.

### Desative o processamento automático
Primeiro, desative o processamento automático de arquivos para suas rotas de upload por meio do arquivo `config/bodyparser.js`:

```js
processManually: ['/upload']
```

A opção `processManually` leva uma série de rotas ou padrões de rota para os quais os arquivos não devem ser processados automaticamente.

### Processe o fluxo
Finalmente, chame o método `request.multipart.process` dentro do controlador de upload de arquivo/manipulador de rota 
em `start/routes.js`:

```js
const Drive = use('Drive')

Route.post('upload', async ({ request }) => {

  request.multipart.file('profile_pic', {}, async (file) => {
    await Drive.disk('s3').put(file.clientName, file.stream)
  })

  await request.multipart.process()
})
```

Você deve chamar `await request.multipart.process()` para iniciar o processamento dos arquivos carregados.

O método `request.multipart.file` permite selecionar um arquivo específico e acessar seu fluxo legível por meio 
da propriedade `file.stream` para que você possa canalizar o fluxo para o Amazon S3 ou qualquer outro serviço 
externo que desejar.

Todo o processo é assíncrono e processa o(s) arquivo(s) apenas uma vez.
