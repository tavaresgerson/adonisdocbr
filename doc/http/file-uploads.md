# Uploads de arquivos

O AdonisJS fornece uma API robusta e de alto desempenho para lidar com uploads de arquivos. Você pode não apenas processar e armazenar 
arquivos carregados localmente, mas também transmiti-los diretamente para os serviços de nuvem como S3, Cloudinary ou armazenamento em 
nuvem do Google.

### Acessando arquivos carregados
O middleware `bodyparser` registrado dentro do arquivo `start/kernel.ts` processa automaticamente todas as solicitações `multipart/form-data` para arquivos.

Você pode acessar os arquivos usando o método `request.file`. O método aceita o nome do campo e retorna uma instância da classe 
[`File`](https://github.com/adonisjs/bodyparser/blob/develop/src/Multipart/File.ts), ou `null` se nenhum arquivo foi carregado.

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

Ao aceitar vários arquivos da mesma entrada, você pode usar o método `request.files` (a forma plural) e ele retornará uma matriz das instâncias do arquivo.

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

### Validando arquivos
Você também pode validar o arquivo especificando as regras para a extensão e o tamanho do arquivo, e o AdonisJS executará as validações implicitamente.

> Tentamos detectar a extensão do arquivo usando o [número mágico](https://en.wikipedia.org/wiki/Magic_number_(programming)#Magic_numbers_in_files) do arquivo 
> e retrocedemos para a extensão do nome do arquivo quando não conseguimos detectá-la usando esse recurso.

```ts
const coverImage = request.file('cover_image', {
  size: '2mb',
  extnames: ['jpg', 'png', 'gif'],
})

if (!coverImage) {
  return
}

if (!coverImage.isValid()) {
  return coverImage.errors
}

await coverImage.move(Application.tmpPath('uploads'))
```

### Validando arquivos usando o validador
Você também pode usar o [`validator`](https://docs.adonisjs.com/guides/validator/introduction) para validar os arquivos carregados pelo usuário 
junto com o resto do formulário.

O método `schema.file` valida a entrada para ser um arquivo válido, junto com quaisquer regras de validação personalizadas 
fornecidas para o tamanho do arquivo e a extensão.

Se a validação do arquivo falhar, você pode acessar a mensagem de erro junto com o resto dos erros do formulário. Caso contrário, 
você pode acessar a instância do arquivo e movê-lo para o local desejado.

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

### Renomeando arquivos
É sempre recomendável renomear os arquivos carregados pelo usuário durante a operação `move`. O nome do arquivo renomeado pode ser qualquer 
coisa adequada para seu aplicativo, ou você pode usar o método `cuid` auxiliar para criar nomes de arquivo aleatórios.

```ts
import { cuid } from '@ioc:Adonis/Core/Helpers'

const coverImage = request.file('cover_image', {
  size: '2mb',
  extnames: ['jpg', 'png', 'gif'],
})

if (!coverImage) {
  return
}

const fileName = `${cuid()}.${coverImage.extname}`

await coverImage.move(Application.tmpPath('uploads'), {
  name: fileName,
})
```

Em caso de conflitos de nome de arquivo renomeado, você pode decidir se deseja sobrescrever o arquivo existente definindo a opção `overwrite`.

```ts
await coverImage.move(Application.tmpPath('uploads'), {
  name: fileName,
  overwrite: true,
})
```

### Servindo arquivos carregados
A API para uploads de arquivo se concentra apenas em lidar com arquivos carregados pelo usuário e não em salvá-los e servi-los. 
No entanto, veremos a seguir a maneira mais simples de servir os arquivos de um disco local.

O método `response.attachment` transmite o arquivo para o cliente ou retorna um código `404` de status quando o arquivo está ausente.

```ts
import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'

Route.get('uploads/:filename', async ({ params, response }) => {
  return response.attachment(
    Application.tmpPath('uploads', params.filename)
  )
})
```

Você também pode renomear arquivos durante o download, especificando o nome como o segundo argumento.

```ts
response.attachment(
  Application.tmpPath('uploads', params.filename),
  're-named.jpg'
)
```

### Movendo arquivos para o armazenamento em nuvem
Você pode mover arquivos para os serviços de armazenamento em nuvem como S3, Digital ocean ou Cloudinary usando seus SDKs oficiais.

Você pode acessar o caminho temporário para o arquivo de upload usando a file.tmpPathpropriedade.

O método `file.move` move o arquivo localmente em `tmpPath` para o local fornecido. Este método não pode ser usado ao mover 
arquivos para um serviço em nuvem.

```ts
const coverImage = request.file('cover_image', {
  size: '2mb',
  extnames: ['jpg', 'png', 'gif'],
})

const fileName = `${cuid()}.${coverImage.extname}`

await s3.upload({
  Key: fileName,
  Bucket: 's3-bucket-name',
  Body: fs.createReadStream(coverImage.tmpPath) // 👈
})
```

### Propriedades do arquivo
A seguir está a lista de propriedades da classe [`File`](https://github.com/adonisjs/bodyparser/blob/develop/src/Multipart/File.ts).

#### fieldName
Referência ao nome do arquivo de entrada.
```ts
file.fieldName
```

#### clientName
O nome do arquivo enviado. Geralmente é o nome do arquivo no computador do usuário.

```ts
file.clientName
```

#### size
O tamanho do arquivo em bytes. Ele está disponível apenas quando o fluxo de arquivos foi consumido.

```ts
file.size
```

#### headers
Os cabeçalhos HTTP associados ao arquivo

```ts
file.headers
```

#### tmpPath
O caminho do arquivo dentro do diretório `/tmp` do computador. Ele está disponível apenas quando os arquivos são processados pelo 
middleware bodyparser e não durante uploads diretos.

```ts
file.tmpPath
```

#### filePath
O caminho absoluto do arquivo. Disponível após a operação `move`.

```ts
file.filePath
```

#### fileName
O nome relativo do arquivo. Disponível após a operação `move`.

```ts
file.fileName
```

#### type
O tipo MIME do arquivo. Disponível após o fluxo do arquivo ser consumido

```ts
file.type
```

#### subtype
O subtipo do tipo MIME do arquivo. Disponível após o fluxo do arquivo ser consumido.

```ts
file.subtype
```

#### extname
A extensão do arquivo. Disponível após o fluxo do arquivo ser consumido.

```ts
file.extname
```

#### state
O estado de processamento do arquivo. É um dos seguintes.


* `idle`: O fluxo do arquivo está ocioso e não flui.
* `streaming`: O arquivo está transmitindo o conteúdo.
* `consumed`: O fluxo do arquivo foi consumido.
* `moved`: O arquivo foi movido usando o método `file.move`.

```ts
if (file.state === 'consumed') {
  console.log(file.type)
}
```

#### isValid
Descubra se o arquivo passou na validação ou não.

```ts
if (!file.isValid) {
  return file.errors
}
```

#### hasErrors
A propriedade `hasErrors` é o oposto da propriedade `isValid`.

```ts
if (file.hasErrors) {
  return file.errors
}
```

#### validated
Descubra se o arquivo foi validado ou não. Chame `file.validate()` para validá-lo.

```ts
if (!file.validated) {
  file.validate()
}
```

#### errors
Retorna uma série de erros de validação

```ts
if (file.hasErrors) {
  return file.errors
}
```

#### sizeLimit
Referência à opção `size` de validação.

#### allowedExtensions
Referência à opção `extnames` de validação.

#### validate
Valide o arquivo em relação às opções de validação predefinidas. AdonisJS chama implicitamente esse método quando você acessa 
o arquivo usando o método `request.file(s)`.

#### toJSON
Obtenha a representação do objeto JSON da instância do arquivo.

```ts
const json = file.toJSON()
```
