---
resumo: Aprenda como processar arquivos enviados pelo usuário no AdonisJS usando o método `request.file` e validá-los usando o validador.
---

# Uploads de arquivo

O AdonisJS tem suporte de primeira classe para processar arquivos enviados pelo usuário usando o tipo de conteúdo `multipart/form-data`. Os arquivos são processados ​​automaticamente usando o [middleware bodyparser](../basics/body_parser.md#multipart-parser) e salvos dentro do diretório `tmp` do seu sistema operacional.

Mais tarde, dentro dos seus controladores, você pode acessar os arquivos, validá-los e movê-los para um local persistente ou um serviço de armazenamento em nuvem como o S3.

## Acessar arquivos enviados pelo usuário

Você pode acessar os arquivos enviados pelo usuário usando o método `request.file`. O método aceita o nome do campo e retorna uma instância de [MultipartFile](https://github.com/adonisjs/bodyparser/blob/main/src/multipart/file.ts).

```ts
import { HttpContext } from '@adonisjs/core/http'

export default class UserAvatarsController {
  update({ request }: HttpContext) {
    // highlight-start
    const avatar = request.file('avatar')
    console.log(avatar)
    // highlight-end
  }
}
```

Se um único campo de entrada for usado para carregar vários arquivos, você pode acessá-los usando o método `request.files`. O método aceita o nome do campo e retorna uma matriz de instâncias `MultipartFile`.

```ts
import { HttpContext } from '@adonisjs/core/http'

export default class InvoicesController {
  update({ request }: HttpContext) {
    // highlight-start
    const invoiceDocuments = request.files('documents')
    
    for (let document of invoiceDocuments) {
      console.log(document)
    }
    // highlight-end
  }
}
```

## Validando arquivos manualmente

Você pode validar arquivos usando o [validator](#using-validator) ou definir as regras de validação por meio do método `request.file`.

No exemplo a seguir, definiremos as regras de validação em linha por meio do método `request.file` e usaremos a propriedade `file.errors` para acessar os erros de validação.

```ts
const avatar = request.file('avatar', {
  size: '2mb',
  extnames: ['jpg', 'png', 'jpeg']
})

if (!avatar.isValid) {
  return response.badRequest({
    errors: avatar.errors
  })
}
```

Ao trabalhar com uma matriz de arquivos, você pode iterar sobre os arquivos e verificar se um ou mais arquivos falharam na validação.

As opções de validação fornecidas ao método `request.files` são aplicadas a todos os arquivos. No exemplo a seguir, esperamos que cada arquivo tenha menos de `2mb` e deve ter uma das extensões de arquivo permitidas.

```ts
const invoiceDocuments = request.files('documents', {
  size: '2mb',
  extnames: ['jpg', 'png', 'pdf']
})

/**
 * Creating a collection of invalid documents
 */
let invalidDocuments = invoiceDocuments.filter((document) => {
  return !document.isValid
})

if (invalidDocuments.length) {
  /**
   * Response with the file name and errors next to it
   */
  return response.badRequest({
    errors: invalidDocuments.map((document) => {
      name: document.clientName,
      errors: document.errors,
    })
  })
}
```

## Usando o validador para validar arquivos

Em vez de validar arquivos manualmente (como visto na seção anterior), você pode usar o [validator](./validation.md) para validar arquivos como parte do pipeline de validação. Você não precisa verificar manualmente se há erros ao usar o validador; o pipeline de validação cuida disso.

```ts
// app/validators/user_validator.ts
import vine from '@vinejs/vine'

export const updateAvatarValidator = vine.compile(
  vine.object({
    // highlight-start
    avatar: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'pdf']
    })
    // highlight-end
  })
)
```

```ts
import { HttpContext } from '@adonisjs/core/http'
import { updateAvatarValidator } from '#validators/user_validator'

export default class UserAvatarsController {
  async update({ request }: HttpContext) {
    // highlight-start
    const { avatar } = await request.validateUsing(
      updateAvatarValidator
    )
    // highlight-end
  }
}
```

Uma matriz de arquivos pode ser validada usando o tipo `vine.array`. Por exemplo:

```ts
import vine from '@vinejs/vine'

export const createInvoiceValidator = vine.compile(
  vine.object({
    // highlight-start
    documents: vine.array(
      vine.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'pdf']
      })
    )
    // highlight-end
  })
)
```

## Movendo arquivos para um local persistente

Por padrão, os arquivos enviados pelo usuário são salvos no diretório `tmp` do seu sistema operacional e podem ser excluídos conforme o computador limpa o diretório `tmp`.

Portanto, é recomendável armazenar arquivos em um local persistente. Você pode usar o `file.move` para mover um arquivo dentro do mesmo sistema de arquivos. O método aceita um caminho absoluto para o diretório para mover o arquivo.

```ts
import app from '@adonisjs/core/services/app'

const avatar = request.file('avatar', {
  size: '2mb',
  extnames: ['jpg', 'png', 'jpeg']
})

// highlight-start
/**
 * Moving avatar to the "storage/uploads" directory
 */
await avatar.move(app.makePath('storage/uploads'))
// highlight-end
```

É recomendável fornecer um nome aleatório exclusivo para o arquivo movido. Para isso, você pode usar o auxiliar `cuid`.

```ts
// highlight-start
import { cuid } from '@adonisjs/core/helpers'
// highlight-end
import app from '@adonisjs/core/services/app'

await avatar.move(app.makePath('storage/uploads'), {
  // highlight-start
  name: `${cuid()}.${avatar.extname}`
  // highlight-end
})
```

Depois que o arquivo for movido, você pode armazenar seu nome dentro do banco de dados para referência posterior.

```ts
await avatar.move(app.makePath('uploads'))

/**
 * Dummy code to save the filename as avatar
 * on the user model and persist it to the
 * database.
 */
auth.user!.avatar = avatar.fileName!
await auth.user.save()
```

### Propriedades do arquivo

A seguir está a lista de propriedades que você pode acessar na instância [MultipartFile](https://github.com/adonisjs/bodyparser/blob/main/src/multipart/file.ts).

| Propriedade  | Descrição                                                                                                    |
|--------------|--------------------------------------------------------------------------------------------------------------|
| `fieldName`  | O nome do campo de entrada HTML.                                                                             |
| `clientName` | O nome do arquivo no computador do usuário.                                                                  |
| `size`       | O tamanho do arquivo em bytes.                                                                               |
| `extname`    | O nome da extensão do arquivo                                                                                |
| `errors`     | Uma matriz de erros associados a um determinado arquivo.                                                     |
| `type`       | O [tipo mime](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) do arquivo        |
| `subtype`    | O [subtipo mime](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) do arquivo.    |
| `filePath`   | O caminho absoluto para o arquivo após a operação `move`.                                                    |
| `fileName`   | O nome do arquivo após a operação `move`.                                                                    |
| `tmpPath`    | O caminho absoluto para o arquivo dentro do diretório `tmp`.                                                 |
| `meta`       | Metadados associados ao arquivo como um par chave-valor. O objeto está vazio por padrão.                     |
| `validated`  | Um booleano para saber se o arquivo foi validado.                                                            |
| `isValid`    | Um booleano para saber se o arquivo passou nas regras de validação.                                          |
| `hasErrors`  | Um booleano para saber se um ou mais erros estão associados a um determinado arquivo.                        |

## Servindo arquivos

Se você persistiu com arquivos enviados pelo usuário no mesmo sistema de arquivos que o código do seu aplicativo, você pode servir arquivos criando uma rota e usando o método [`response.download`](./response.md#downloading-files).

```ts
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)
  
  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('uploads', normalizedPath)
  return response.download(absolutePath)
})
```

[parâmetro de rota curinga](./routing.md#wildcard-params) e converter a matriz em uma string.
- Em seguida, normalizamos o caminho usando o módulo de caminho do Node.js.
[travessia de caminho](https://owasp.org/www-community/attacks/Path_Traversal).
- Finalmente, convertemos o `normalizedPath` em um caminho absoluto dentro do diretório `uploads` e servimos o arquivo usando o método `response.download`.

## Usando o Drive para carregar e servir arquivos

O Drive é uma abstração do sistema de arquivos criada pela equipe principal do AdonisJS. Você pode usar o Drive para gerenciar arquivos carregados pelo usuário e armazená-los dentro do sistema de arquivos local ou movê-los para um serviço de armazenamento em nuvem como S3 ou GCS.

Recomendamos usar o Drive em vez de carregar e servir arquivos manualmente. O Drive lida com muitas preocupações de segurança, como travessia de caminho, e oferece uma API unificada em vários provedores de armazenamento.

[Saiba mais sobre o Drive](../digging_deeper/drive.md)

## Avançado - Fluxo multiparte de autoprocessamento
Você pode desativar o processamento automático de solicitações multiparte e autoprocessar o fluxo para casos de uso avançados. Abra o arquivo `config/bodyparser.ts` e altere uma das seguintes opções para desabilitar o processamento automático.

```ts
{
  multipart: {
    /**
     * Set to false, if you want to self-process multipart
     * stream manually for all HTTP requests
     */
    autoProcess: false
  }
}
```

```ts
{
  multipart: {
    /**
     * Define an array of route patterns for which you want
     * to self process the multipart stream.
     */
    processManually: ['/assets']
  }
}
```

Depois de desabilitar o processamento automático, você pode usar o objeto `request.multipart` para processar arquivos individuais.

No exemplo a seguir, usamos o método `stream.pipeline` do Node.js para processar o fluxo legível multipart e gravá-lo em um arquivo no disco. No entanto, você pode transmitir esse arquivo para algum serviço externo como `s3`.

```ts
import { createWriteStream } from 'node:fs'
import app from '@adonisjs/core/services/app'
import { pipeline } from 'node:stream/promises'
import { HttpContext } from '@adonisjs/core/http'

export default class AssetsController {
  async store({ request }: HttpContext) {
    /**
     * Step 1: Define a file listener
     */
    request.multipart.onFile('*', {}, async (part, reporter) => {
      part.pause()
      part.on('data', reporter)

      const filePath = app.makePath(part.file.clientName)
      await pipeline(part, createWriteStream(filePath))
      return { filePath }
    })

    /**
     * Step 2: Process the stream
     */
    await request.multipart.process()

    /**
     * Step 3: Access processed files
     */
    return request.allFiles()
  }
}
```

- O método `multipart.onFile` aceita o nome do campo de entrada para o qual você deseja processar os arquivos. Você pode usar o curinga `*` para processar todos os arquivos.

- O ouvinte `onFile` recebe a `part` (fluxo legível) como o primeiro parâmetro e uma função `reporter` como o segundo parâmetro.

- A função `reporter` é usada para rastrear o progresso do fluxo para que o AdonisJS possa fornecer acesso aos bytes processados, extensão de arquivo e outros metadados após o fluxo ter sido processado.

- Finalmente, você pode retornar um objeto de propriedades do listener `onFile`, e eles serão mesclados com o objeto de arquivo que você acessa usando os métodos `request.file` ou `request.allFiles()`.

### Tratamento de erros
Você deve ouvir o evento `error` no objeto `part` e tratar os erros manualmente. Normalmente, o leitor de fluxo (o fluxo gravável) ouvirá internamente esse evento e abortará a operação de gravação.

### Validando partes do fluxo
O AdonisJS permite que você valide as partes do fluxo (também conhecidas como arquivos) mesmo quando você processa o fluxo multipart manualmente. Em caso de erro, o evento `error` é emitido no objeto `part`.

O método `multipart.onFile` aceita as opções de validação como o segundo parâmetro. Além disso, certifique-se de ouvir o evento `data` e vincular o método `reporter` a ele. Caso contrário, nenhuma validação ocorrerá.

```ts
request.multipart.onFile('*', {
  size: '2mb',
  extnames: ['jpg', 'png', 'jpeg']
}, async (part, reporter) => {
  /**
   * The following two lines are required to perform
   * the stream validation
   */
  part.pause()
  part.on('data', reporter)
})
```
