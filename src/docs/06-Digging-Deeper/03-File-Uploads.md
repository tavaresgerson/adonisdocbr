# Uploads de arquivo

O AdonisJs processa uploads de arquivo com segurança, sem desperdiçar recursos do servidor.

## Exemplo básico
Vamos ver como lidar com arquivos enviados via formulário HTML:

```edge
<form method="POST" action="upload" enctype="multipart/form-data">
  <input type="file" name="profile_pic" />
  <button type="submit"> Submit </button>
</form>
```

```js
// .start/routes.js

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

1. O método `request.file` aceita dois argumentos (um *nome de campo* e *um objeto de validação* para aplicar ao arquivo enviado) e retorna uma instância [File](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/File.js).
2. Em seguida, chamamos o método `profilePic.move` que tenta mover o arquivo para o diretório definido (neste caso, chamado com opções para salvar o arquivo com um novo *nome* e *sobrescrever* o arquivo, se necessário).
3. Finalmente, verificamos se a operação de movimentação foi bem-sucedida chamando o método `profilePic.moved()` (retornando erros se algum for encontrado).

## Uploads de vários arquivos
O AdonisJs torna o upload de vários arquivos tão simples quanto o upload de um único arquivo.

Quando vários arquivos são carregados juntos, `request.file` retorna uma instância [FileJar](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/FileJar.js) em vez de uma instância [File](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/File.js):

```edge
<form method="POST" action="upload" enctype="multipart/form-data">
  <input type="file" name="profile_pics[]" multiple />
  <button type="submit"> Submit </button>
</form>
```

```js
// .start/routes.js

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

No exemplo acima, comparado à maneira como lidamos com um único arquivo:

1. Em vez de `move`, usamos o método `moveAll` (que move todos os arquivos carregados em paralelo para um determinado diretório).
2. Os métodos de arquivo único foram alterados para métodos de arquivo múltiplo (como `moved -> movedAll` e `error -> errors`).

### Alterando nomes de arquivo
Para mover e renomear um único upload de arquivo, passe um objeto de opções para o método `move` definindo o novo `nome` do arquivo:

```js
await profilePic.move(Helpers.tmpPath('uploads'), {
  name: 'my-new-name.jpg'
})
```

Para mover e renomear vários uploads de arquivo, passe um retorno de chamada para o método `moveAll` para criar um objeto de opções personalizado para cada arquivo dentro da sua instância [FileJar](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/FileJar.js):

```js
profilePics.moveAll(Helpers.tmpPath('uploads'), (file) => {
  return {
    name: `${new Date().getTime()}.${file.subtype}`
  }
})
```

### Lista movida
Ao mover vários uploads de arquivo, é possível que alguns arquivos sejam movidos com sucesso enquanto outros sejam rejeitados devido a falhas de validação.

Nesse caso, você pode usar os métodos `movedAll()` e `movedList()` para otimizar seu fluxo de trabalho:

```js
const removeFile = Helpers.promisify(fs.unlink)

if (!profilePics.movedAll()) {
  const movedFiles = profilePics.movedList()

  await Promise.all(movedFiles.map((file) => {
    return removeFile(path.join(file._location, file.fileName))
  }))

  return profilePics.errors()
}
```

## Opções de validação
As seguintes opções de validação podem ser passadas para validar um arquivo antes de concluir uma operação de movimentação:

| Chave       | Valor                 | Descrição   |
|-------------|-----------------------|-------------|
| `types`     | `String[]`            | Uma matriz de tipos a serem permitidos. O valor será verificado em relação ao arquivo [tipo de mídia](https://www.npmjs.com/package/media-typer). |
| `size`      | `String` ou `Number`  | O tamanho máximo permitido para o arquivo. O valor é analisado usando o método [bytes.parse](https://github.com/visionmedia/bytes.js#bytesparsestringnumber-value-numbernull). |
| `extnames`  | `String[]`            | Para ter um controle mais granular sobre o tipo de arquivo, você pode definir as extensões permitidas ao definir o tipo. |

Um exemplo de como aplicar regras de validação é o seguinte:

```js
const validationOptions = {
  types: ['image'],
  size: '2mb',
  extnames: ['png', 'gif']
}
const avatar = request.file('avatar', validationOptions)

// this is when validation occurs
await avatar.move()
```

## Tipos de erro

Quando a validação de upload falha, o método [File](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/File.js) `error` retorna um objeto contendo o `fieldName` com falha, o `clientName` original, uma `message` de erro e a regra `type` que disparou o erro.

::: warning OBSERVAÇÃO
O método [FileJar](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/FileJar.js) `errors` retorna uma *matriz* de erros.
:::

Alguns exemplos de objetos de erro estão listados abaixo.

#### Erro de tipo

```js
{
  fieldName: "field_name",
  clientName: "invalid-file-type.ai",
  message: "Invalid file type postscript or application. Only image is allowed",
  type: "type"
}
```

#### Erro de tamanho

```js
{
  fieldName: "field_name",
  clientName: "invalid-file-size.png",
  message: "File size should be less than 2MB",
  type: "size"
}
```

## Propriedades do arquivo
As seguintes propriedades do arquivo podem ser acessadas na instância [File](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/File.js):

| Propriedade   | Descrição                                               | Não processado  | Dentro do tmp   | Movido    |
|---------------|---------------------------------------------------------|-----------------|-----------------|-----------|
| clientName    | Nome do arquivo na máquina cliente                      | `String`        | `String`        | `String`  |
| fileName      | Nome do arquivo após a operação de movimentação         | `null`          | `null`          | `String`  |
| fieldName     | Nome do campo do formulário                             | `String`        | `String`        | `String`  |
| tmpPath       | Caminho temporário                                      | `null`          | `String`        | `String`  |
| size          | Tamanho do arquivo em bytes                             | `0`             | `Number`        | `Number`  |
| type          | Tipo primário do arquivo                                | `String`        | `String`        | `String`  |
| subtype       | Subtipo do arquivo                                      | `String`        | `String`        | `String`  |
| status        | Status do arquivo (definido como `error` quando falha)  | `pending`       | `consumed`      | `moved`   |
| extname       | Extensão do arquivo                                     | `String`        | `String`        | `String`  |

## Validadores de rota
[Validadores de rota](/docs/04-Basics/08-Validation.md) validam arquivos enviados antes de passá-los para o controlador.

No validador de rota de exemplo abaixo:

```js
// .app/Validators/StoreUser.js

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

1. A regra `file` garante que o campo `avatar` seja um [File](https://github.com/adonisjs/adonis-bodyparser/blob/develop/src/Multipart/File.js) válido.
2. A regra `file_ext` define os `extnames` permitidos para o arquivo.
3. A regra `file_size` define o `size` máximo para o arquivo.
4. A regra `file_types` define os `types` permitidos para o arquivo.

## Arquivos de streaming

A maioria das bibliotecas/frameworks de upload processam arquivos várias vezes ao fazer streaming para um serviço externo, como o *Amazon S3*. Seus fluxos de trabalho de upload geralmente são projetados assim:

1. Processe os arquivos de solicitação e salve-os no diretório `tmp`.
2. Mova cada arquivo do diretório `tmp` para o diretório de destino.
3. Use o *SDK* do serviço externo para finalmente fazer streaming do arquivo para o serviço externo.

Esse processo desperdiça recursos do servidor *lendo/escrevendo* arquivos únicos várias vezes.

O AdonisJs torna o processo de streaming de arquivos enviados muito mais eficiente.

### Desabilite o processamento automático
Primeiro, desabilite o processamento automático de arquivos para suas rotas de upload por meio do arquivo `config/bodyparser.js`:

```js
// .config/bodyparser.js

processManually: ['/upload']
```

A opção `processManually` usa uma matriz de rotas ou padrões de rota para os quais os arquivos não devem ser processados ​​automaticamente.

### Processe o fluxo
Finalmente, chame o método `request.multipart.process` dentro do controlador de upload de arquivo/manipulador de rota:

```js
// .start/routes.js

const Drive = use('Drive')

Route.post('upload', async ({ request }) => {

  request.multipart.file('profile_pic', {}, async (file) => {
    await Drive.disk('s3').put(file.clientName, file.stream)
  })

  await request.multipart.process()
})
```

::: warning OBSERVAÇÃO
Você deve chamar `await request.multipart.process()` para iniciar o processamento dos arquivos enviados.
:::

O método `request.multipart.file` permite que você selecione um arquivo específico e acesse seu fluxo legível por meio da propriedade `file.stream` para que você possa canalizar o fluxo para o *Amazon S3* ou qualquer outro serviço externo que desejar.

Todo o processo é assíncrono e processa o(s) arquivo(s) apenas uma vez.
