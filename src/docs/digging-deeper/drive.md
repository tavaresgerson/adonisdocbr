---
summary: Gerencie arquivos enviados pelo usuário em sistemas de arquivos locais e serviços de armazenamento em nuvem como S3, GCS, R2 e Digital Ocean Spaces. Sem qualquer bloqueio de fornecedor.
---

# Drive

AdonisJS Drive (`@adonisjs/drive`) é um wrapper leve sobre [flydrive.dev](https://flydrive.dev/). FlyDrive é uma biblioteca de armazenamento de arquivos para Node.js. Ela fornece uma API unificada para interagir com o sistema de arquivos local e soluções de armazenamento em nuvem como S3, R2 e GCS.

Usando FlyDrive, você pode gerenciar arquivos enviados pelo usuário em vários serviços de armazenamento em nuvem (incluindo o sistema de arquivos local) sem alterar uma única linha de código.

## Instalação

Instale e configure o pacote `@adonisjs/drive` usando o seguinte comando:

```sh
node ace add @adonisjs/drive
```

::: detalhes Veja as etapas executadas pelo comando add

1. Instala o pacote `@adonisjs/drive` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

```ts
   {
     providers: [
       // ...other providers
       () => import('@adonisjs/drive/drive_provider'),
     ]
   }
   ```

3. Cria o arquivo `config/drive.ts`.

4. Define as variáveis ​​de ambiente para os serviços de armazenamento selecionados.

5. Instala as dependências de peer necessárias para os serviços de armazenamento selecionados.

:::

## Configuração

A configuração do pacote `@adonisjs/drive` é armazenada dentro do arquivo `config/drive.ts`. Você pode definir a configuração para vários serviços em um único arquivo de configuração.

Veja também: [Config stub](https://github.com/adonisjs/drive/blob/main/stubs/config/drive.stub)

```ts
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, services } from '@adonisjs/drive'

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  services: {
    /**
     * Persist files on the local filesystem
     */
    fs: services.fs({
      location: app.makePath('storage'),
      serveFiles: true,
      routeBasePath: '/uploads',
      visibility: 'public',
    }),

    /**
     * Persist files on Digital Ocean spaces
     */
    spaces: services.s3({
      credentials: {
        accessKeyId: env.get('SPACES_KEY'),
        secretAccessKey: env.get('SPACES_SECRET'),
      },
      region: env.get('SPACES_REGION'),
      bucket: env.get('SPACES_BUCKET'),
      endpoint: env.get('SPACES_ENDPOINT'),
      visibility: 'public',
    }),
  },
})

export default driveConfig
```

### Variáveis ​​de ambiente

As credenciais/configurações para os serviços de armazenamento são armazenadas como variáveis ​​de ambiente dentro do arquivo `.env`. Certifique-se de atualizar os valores antes de poder usar o Drive.

Além disso, a variável de ambiente `DRIVE_DISK` define o disco/serviço padrão para gerenciar arquivos. Por exemplo, você pode querer usar o disco `fs` em desenvolvimento e o disco `spaces` em produção.

## Uso

Depois de configurar o Drive, você pode importar o serviço `drive` para interagir com suas APIs. No exemplo a seguir, lidamos com uma operação de upload de arquivo usando o Drive.

:::note
Já que a integração do AdonisJS é um wrapper fino sobre o FlyDrive. Para entender melhor suas APIs, você deve ler [FlyDrive docs](https://flydrive.dev).
:::

```ts
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import router from '@adonisjs/core/services/router'

router.put('/me', async ({ request, response }) => {
  /**
   * Step 1: Grab the image from the request and perform basic
   * validations
   */
  const image = request.file('avatar', {
    size: '2mb',
    extnames: ['jpeg', 'jpg', 'png'],
  })
  if (!image) {
    return response.badRequest({ error: 'Image missing' })
  }

  /**
   * Step 2: Move the image with a unique name using Drive
   */
  const key = `uploads/${cuid()}.${image.extname}`
  // highlight-start
  await image.moveToDisk(key)
  // highlight-end

  /**
   * Respond with the file's public URL
   */
  return {
    message: 'Image uploaded',
    // highlight-start
    url: await drive.use().getUrl(key),
    // highlight-end
  }
})
```

[MultipartFile](https://github.com/adonisjs/drive/blob/develop/providers/drive_provider.ts#L110). Este método copia o arquivo de seu `tmpPath` para o provedor de armazenamento configurado.

- O método `drive.use().getUrl()` retorna a URL pública do arquivo. Para arquivos privados, você deve usar o método `getSignedUrl`.

## Serviço Drive

O serviço Drive exportado pelo caminho `@adonisjs/drive/services/main` é uma instância singleton da classe [DriveManager](https://flydrive.dev/docs/drive_manager) criada usando a configuração exportada do arquivo `config/drive.ts`.

Você pode importar este serviço para interagir com o DriveManager e os serviços de armazenamento de arquivos configurados. Por exemplo:

```ts
import drive from '@adonisjs/drive/services/main'

drive instanceof DriveManager // true

/**
 * Returns instance of the default disk
 */
const disk = drive.use()

/**
 * Returns instance of a disk named r2
 */
const disk = drive.use('r2')

/**
 * Returns instance of a disk named spaces
 */
const disk = drive.use('spaces')
```

Depois de ter acesso a uma instância de um disco, você pode usá-lo para gerenciar arquivos.

Veja também: [API de disco](https://flydrive.dev/docs/disk_api)

```ts
await disk.put(key, value)
await disk.putStream(key, readableStream)

await disk.get(key)
await disk.getStream(key)
await disk.getArrayBuffer(key)

await disk.delete(key)
await disk.deleteAll(prefix)

await disk.copy(source, destination)
await disk.move(source, destination)

await disk.copyFromFs(source, destination)
await disk.moveFromFs(source, destination)
```

## Driver do sistema de arquivos local

A integração com o AdonisJS aprimora o driver do sistema de arquivos local do FlyDrive e adiciona suporte para geração de URL e capacidade de servir arquivos usando o servidor HTTP do AdonisJS.

A seguir está a lista de opções que você pode usar para configurar o driver do sistema de arquivos.

```ts
{
  services: {
    fs: services.fs({
      location: app.makePath('storage'),
      visibility: 'public',

      appUrl: env.get('APP_URL'),
      serveFiles: true,
      routeBasePath: '/uploads',
    }),
  }
}
```

### `location`

A propriedade `location` define os armazenamentos dentro dos quais os arquivos devem ser armazenados. Este diretório deve ser adicionado ao `.gitignore` para que você não envie arquivos carregados durante o desenvolvimento para o servidor de produção.

### `visibility`

A propriedade `visibility` é usada para marcar arquivos como públicos ou privados. Arquivos privados só podem ser acessados ​​usando URLs assinadas. [Saiba mais](https://flydrive.dev/docs/disk_api#getsignedurl)

### `serveFiles`

A opção `serveFiles` registra automaticamente uma rota para servir os arquivos do sistema de arquivos local. Você pode visualizar essa rota usando o comando ace [list\:routes](../references/commands.md#listroutes).

### `routeBasePath`

A opção `routeBasePath` define o prefixo base para a rota para servir arquivos. Certifique-se de que o prefixo base seja exclusivo.

### `appUrl`

Opcionalmente, você pode definir a propriedade `appUrl` para criar URLs com o nome de domínio completo do seu aplicativo. Caso contrário, URLs relativas serão criadas.

## Auxiliares do Edge
Dentro dos modelos do Edge, você pode usar um dos seguintes métodos auxiliares para gerar URLs. Ambos os métodos são assíncronos, então certifique-se de `await` eles.

```edge
<img src="{{ await driveUrl(user.avatar) }}" />

<!-- Generate URL for a named disk -->
<img src="{{ await driveUrl(user.avatar, 's3') }}" />
<img src="{{ await driveUrl(user.avatar, 'r2') }}" />
```

```edge
<a href="{{ await driveSignedUrl(invoice.key) }}">
  Download Invoice
</a>

<!-- Generate URL for a named disk -->
<a href="{{ await driveSignedUrl(invoice.key, 's3') }}">
  Download Invoice
</a>

<!-- Generate URL with signed options -->
<a href="{{ await driveSignedUrl(invoice.key, {
  expiresIn: '30 mins',
}) }}">
  Download Invoice
</a>
```

## Auxiliar MultipartFile
O Drive estende a classe Bodyparser [MultipartFile](https://github.com/adonisjs/drive/blob/develop/providers/drive_provider.ts#L110) e adiciona o método `moveToDisk`. Este método copia o arquivo de seu `tmpPath` para o provedor de armazenamento configurado.

```ts
const image = request.file('image')!

const key = 'user-1-avatar.png'

/**
 * Move file to the default disk
 */
await image.moveToDisk(key)

/**
 * Move file to a named disk
 */
await image.moveToDisk(key, 's3')

/**
 * Define additional properties during the
 * move operation
 */
await image.moveToDisk(key, 's3', {
  contentType: 'image/png',
})
```

## Discos falsos durante os testes
A API de falsificações do Drive pode ser usada durante os testes para evitar a interação com um armazenamento remoto. No modo de falsificações, o método `drive.use()` retornará um disco falso (apoiado pelo sistema de arquivos local) e todos os arquivos serão gravados dentro do diretório `./tmp/drive-fakes` da raiz do seu aplicativo.

Esses arquivos são excluídos automaticamente após você restaurar uma falsificação usando o método `drive.restore`.

Veja também: [Documentação de falsificações do FlyDrive](https://flydrive.dev/docs/drive_manager#using-fakes)

```ts
// title: tests/functional/users/update.spec.ts
import { test } from '@japa/runner'
import drive from '@adonisjs/drive/services/main'
import fileGenerator from '@poppinss/file-generator'

test.group('Users | update', () => {
  test('should be able to update my avatar', async ({ client, cleanup }) => {
    /**
     * Fake the "spaces" disk and restore the fake
     * after the test finishes
     */
    const fakeDisk = drive.fake('spaces')
    cleanup(() => drive.restore('spaces'))

    /**
     * Create user to perform the login and update
     */
    const user = await UserFactory.create()

    /**
     * Generate a fake in-memory png file with size of
     * 1mb
     */
    const { contents, mime, name } = await fileGenerator.generatePng('1mb')

    /**
     * Make put request and send the file
     */
    await client
      .put('me')
      .file('avatar', contents, {
        filename: name,
        contentType: mime,
      })
      .loginAs(user)

    /**
     * Assert the file exists
     */
    fakeDisk.assertExists(user.avatar)
  })
})
```
