# Uploads de arquivo

O AdonisJS fornece uma API robusta e de alto desempenho para lidar com uploads de arquivo. Você não só pode processar e armazenar arquivos enviados localmente, mas também pode **transmiti-los diretamente para serviços de nuvem como S3, Cloudinary ou armazenamento em nuvem do Google**.

::: tip DICA
Confira [Attachment Lite](https://github.com/adonisjs/attachment-lite). Um pacote opinativo para converter qualquer coluna em seu modelo Lucid em um tipo de dados de anexo. Tornando o upload de arquivo limpo e fácil.
:::

## Acessando arquivos enviados
O middleware bodyparser registrado dentro do arquivo `start/kernel.ts` processa automaticamente todos os arquivos para solicitações `multipart/form-data`.

Você pode acessar os arquivos usando o método `request.file`. O método aceita o nome do campo e retorna uma instância da classe [File](https://github.com/adonisjs/bodyparser/blob/develop/src/Multipart/File.ts), ou `null` se nenhum arquivo foi carregado.

```ts
import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'

Route.post('posts', async ({ request }) => {
  const coverImage = request.file('cover_image')

  if (coverImage) {
    await coverImage.move(Application.tmpPath('uploads'))
  }
})
```

Ao aceitar vários arquivos da mesma entrada, você pode usar o método `request.files` (a forma plural) para retornar uma matriz das instâncias do arquivo.

```ts
import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'

Route.post('gallery', async ({ request }) => {
  const images = request.files('images')

  for (let image of images) {
    await image.move(Application.tmpPath('uploads'))
  }
})
```

## Validando arquivos

Você também pode validar o arquivo especificando as regras para a extensão do arquivo e o tamanho do arquivo, e o AdonisJS executará as validações implicitamente.

::: info NOTA
Tentamos detectar a extensão do arquivo usando o arquivo [número mágico](<https://en.wikipedia.org/wiki/Magic_number_(programming)#Magic_numbers_in_files>) e retornar à extensão do nome do arquivo quando não for possível detectá-lo usando o número mágico.
:::

```ts
const coverImage = request.file('cover_image', {
  size: '2mb',
  extnames: ['jpg', 'png', 'gif'],
})

if (!coverImage) {
  return
}

if (!coverImage.isValid) {
  return coverImage.errors
}

await coverImage.move(Application.tmpPath('uploads'))
```

## Validando arquivos usando o validador

Você também pode usar o [validator](../validator/introduction.md) para validar os arquivos enviados pelo usuário junto com o restante do formulário.

O método `schema.file` valida a entrada para ser um arquivo válido, junto com quaisquer regras de validação personalizadas fornecidas para o tamanho do arquivo e a extensão.

Se a validação do arquivo falhar, você pode acessar a mensagem de erro junto com os erros do formulário. Caso contrário, você pode acessar a instância do arquivo e movê-la para o local desejado.

```ts
import Route from '@ioc:Adonis/Core/Route'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

Route.post('posts', async ({ request }) => {
  const postSchema = schema.create({
    cover_image: schema.file({
      size: '2mb',
      extnames: ['jpg', 'gif', 'png'],
    }),
  })

  const payload = await request.validate({ schema: postSchema })

  await payload.cover_image.move(Application.tmpPath('uploads'))
})
```

## Salvando arquivos
Você pode salvar arquivos enviados pelo usuário usando o método `moveToDisk`. Ele usa AdonisJS [Drive](../digging-deeper/drive.md) por baixo dos panos para salvar arquivos.

```ts {6-9}
const coverImage = request.file('cover_image', {
  size: '2mb',
  extnames: ['jpg', 'png', 'gif'],
})!

await coverImage.moveToDisk('./')

// Obtenha o nome do arquivo salvo; para armazená-lo em seu banco de dados, por exemplo.
const fileName = coverImage.fileName;
```

O método `moveToDisk` aceita os seguintes argumentos.

- `storagePath`: Um caminho relativo para a raiz do disco.
Método [Drive.put](../digging-deeper/drive.md#put). Além disso, você pode passar a propriedade do nome do arquivo.
- `disk`: Defina o nome do disco a ser usado para salvar o arquivo. Se não for definido, usaremos o disco padrão.

## Servindo arquivos enviados
Recomendamos usar o Drive para salvar arquivos enviados pelo usuário e, em seguida, usar [Drive.getUrl](../digging-deeper/drive.md#geturl) para servir arquivos públicos e [Drive.getSignedUrl](../digging-deeper/drive.md#getsignedurl) para servir arquivos privados.

## Propriedades/métodos do arquivo

A seguir está a lista de propriedades na classe [File](https://github.com/adonisjs/bodyparser/blob/develop/src/Multipart/File.ts).

### `fieldName`

Referência ao nome do arquivo de entrada.

```ts
file.fieldName
```

### `clientName`

O nome do arquivo carregado. Geralmente é o nome do arquivo no computador do usuário.

```ts
file.clientName
```

### `size`

O tamanho do arquivo está em bytes. O tamanho do arquivo só está disponível quando o fluxo de arquivo foi consumido.

```ts
file.size
```

### `headers`

Os cabeçalhos HTTP associados ao arquivo

```ts
file.headers
```

### `tmpPath`

O caminho do arquivo dentro do diretório `/tmp` do computador. Ele está disponível apenas quando os arquivos são processados ​​pelo middleware bodyparser e não durante uploads diretos.

```ts
file.tmpPath
```

### `filePath`

O caminho absoluto do arquivo. Disponível após a operação `move`.

```ts
file.filePath
```

### `fileName`

O nome relativo do arquivo. Disponível após a operação `move`.

```ts
file.fileName
```

### `type`

O arquivo [tipo MIME](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types). Disponível após o fluxo de arquivo ter sido consumido

```ts
file.type
```

### `subtype`

O subtipo do tipo MIME do arquivo. Disponível após o fluxo de arquivo ter sido consumido.

```ts
file.subtype
```

### `extname`

A extensão do arquivo. Disponível após o fluxo de arquivo ter sido consumido.

```ts
file.extname
```

### `state`

O estado de processamento do arquivo. É um dos seguintes.

- `idle`: O fluxo de arquivo está ocioso e não está fluindo.
- `streaming`: O arquivo está transmitindo o conteúdo.
- `consumed`: O fluxo de arquivo foi consumido.
- `moved`: O arquivo foi movido usando o método `file.move`.

```ts
if (file.state === 'consumed') {
  console.log(file.type)
}
```

### `isValid`

Descubra se o arquivo passou na validação ou não.

```ts
if (!file.isValid) {
  return file.errors
}
```

### `hasErrors`

A propriedade `hasErrors` é o oposto da propriedade `isValid`.

```ts
if (file.hasErrors) {
  return file.errors
}
```

### `validated`

Descubra se o arquivo foi validado ou não. Chame `file.validate()` para validá-lo.

```ts
if (!file.validated) {
  file.validate()
}
```

### `errors`

Uma matriz de erros de validação

```ts
if (file.hasErrors) {
  return file.errors
}
```

### `sizeLimit`

Referência à opção de validação `size`.

### `allowedExtensions`

Referência à opção de validação `extnames`.

### `validate`

Valide o arquivo em relação às opções de validação predefinidas. O AdonisJS chama implicitamente esse método quando você acessa o arquivo usando o método `request.file(s)`.

### `move`
Mova o arquivo para um determinado local no sistema de arquivos. O método aceita um absoluto para o diretório de destino e o objeto options para renomear o arquivo.

```ts
await file.move(Application.tmpPath('uploads'), {
  name: 'renamed-file-name.jpg',
  overwrite: true, // sobrescrever em caso de conflito
})
```

### `moveToDisk`
Mover arquivo usando Drive. Os métodos aceitam os seguintes argumentos:

- `storagePath`: Um caminho relativo para a raiz do disco.
Método [Drive.put](../digging-deeper/drive.md#put). Além disso, você tem que passar a propriedade do nome do arquivo
- `disk`: Defina o nome do disco a ser usado para salvar o arquivo. Se não for definido, usaremos o disco padrão.

```ts
await file.moveToDisk('./', {
  name: 'renamed-file-name.jpg',
  contentType: 'image/jpg'
}, 's3')
```

### `toJSON`

Obtenha a representação do objeto JSON da instância do arquivo.

```ts
const json = file.toJSON()
```

## Leitura adicional

- Tutorial passo a passo sobre uploads de arquivos
- Uploads diretos de arquivos
