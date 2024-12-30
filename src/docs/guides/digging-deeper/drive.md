# Drive

AdonisJS Drive é uma abstração sobre serviços de armazenamento em nuvem, como: **Amazon S3**, **DigitalOcean Spaces** e **Google Cloud Storage**.

O Drive vem pré-empacotado com o núcleo do framework e, portanto, nenhuma etapa extra de instalação é necessária (exceto para drivers). Você pode usar o Drive da seguinte forma:

```ts
import Drive from '@ioc:Adonis/Core/Drive'

// Escreva um arquivo
await Drive.put(filePath, stringOrBuffer)
await Drive.putStream(filePath, readableStream)

// Lê um arquivo
const contents = await Drive.get(filePath)
const readableStream = await Drive.getStream(filePath)

// Descubra se um arquivo existe
if (await Drive.exists(filePath)) {
  await Drive.get(filePath)
}
```

## Metas e limitações de design
O objetivo principal do Drive é fornecer uma API consistente que funcione em todos os provedores de armazenamento. Então, por exemplo, você pode usar o **sistema de arquivos local** durante o desenvolvimento e alternar para o **S3** na produção sem alterar uma única linha de código.

Para garantir uma API consistente, o Drive não pode funcionar com as especificidades de um determinado serviço de armazenamento.

Por exemplo, você não pode criar links simbólicos usando o Drive, pois [links simbólicos](https://en.wikipedia.org/wiki/Symbolic_link) são um conceito de sistemas de arquivos baseado em Unix e não podem ser replicados com S3 ou GCS.

Da mesma forma, os recursos proprietários de um serviço de nuvem que não podem ser replicados entre drivers também não são suportados.

## Casos de uso
O Drive NÃO é um substituto para gerenciar os ativos estáticos do seu site, como CSS, JavaScript ou as imagens/ícones que você usa para projetar seu site/aplicativo da web.

O principal caso de uso do Drive é ajudar você a gerenciar rapidamente os arquivos enviados pelo usuário. Eles podem ser avatares de usuários, imagens de capa de postagens de blog ou quaisquer outros documentos gerenciados em tempo de execução.

## Configuração
A configuração do Drive é armazenada dentro do arquivo `config/drive.ts`. Dentro desse arquivo, você pode definir vários discos usando os mesmos/diferentes drivers.

Sinta-se à vontade para criar o arquivo de configuração (se estiver faltando) usando o [config stub](https://github.com/adonisjs/core/blob/master/templates/config/drive.txt).

```ts
// config/drive.ts

import { driveConfig } from '@adonisjs/core/build/config'

export default driveConfig({
  disk: Env.get('DRIVE_DISK'),

  disks: {
    local: {
      driver: 'local',
      visibility: 'public',
      root: Application.tmpPath('uploads'),
      basePath: '/uploads',
      serveFiles: true,
    },

    s3: {
      driver: 's3',
      visibility: 'public',
      key: Env.get('S3_KEY'),
      secret: Env.get('S3_SECRET'),
      region: Env.get('S3_REGION'),
      bucket: Env.get('S3_BUCKET'),
      endpoint: Env.get('S3_ENDPOINT'),
      
      // Para o minio funcionar
      // forcePathStyle: true,
    },
  },
})
```

#### `disk`
A propriedade `disk` representa o disco padrão a ser usado para operações do sistema de arquivos. Normalmente, você definirá o disco como uma variável de ambiente para usar discos diferentes para desenvolvimento e produção locais.

#### `disks`
O objeto `disks` define os discos que você deseja usar em todo o seu aplicativo. Cada disco deve especificar o driver que deseja usar.

## Drivers
A seguir está a lista dos drivers oficiais.

### Driver local
O driver `local` é pré-empacotado no núcleo do framework. Ele usa o sistema de arquivos local para ler/escrever arquivos.

Você deve configurar o diretório raiz para o driver local dentro do arquivo de configuração. O caminho pode estar em qualquer lugar do seu computador (mesmo fora da raiz do projeto funcionará).

```ts {3}
local: {
  driver: 'local',
  root: Application.tmpPath('uploads'),
},
```

Para imitar o comportamento dos serviços de nuvem, o driver local também pode servir arquivos quando um `basePath` é definido e a opção `serveFiles` está habilitada.

::: info NOTA
Certifique-se de não definir nenhuma outra rota no seu aplicativo usando o mesmo prefixo que o `basePath`.
:::

```ts
local: {
  basePath: '/uploads',
  serveFiles: true,
}
```

Uma vez configurado, o método `Drive.getUrl` gerará a URL para baixar o arquivo. As URLs são relativas ao domínio atual.

```ts
await Drive.getUrl('avatar.jpg')

// Retorna
// /uploads/avatar.jpg
```

```ts
await Drive.getSignedUrl('avatar.jpg')

// Retorna
// /uploads/avatar.jpg?signature=eyJtZXNzYWdlIjoiL3YxL3VzZXJzIn0.CGHY99jESI-AxPFBu1lE26TXjCASfC83XTyu58NivFw
```

### Driver S3

O driver `s3` faz uso do armazenamento em nuvem Amazon S3 para ler/escrever arquivos. Você terá que instalar o driver separadamente.

Certifique-se de seguir as instruções do comando `configure` para configurar o driver corretamente. Você também pode ler as mesmas instruções [aqui](https://github.com/adonisjs/drive-s3/blob/master/instructions.md).

```sh
npm i @adonisjs/drive-s3
```

```sh
node ace configure @adonisjs/drive-s3
```

Você também pode usar o driver `s3` com serviços compatíveis com S3, como [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/) e [MinIO](https://min.io/).

Ao usar um serviço diferente, você terá que definir o ponto final do bucket também.

```ts
{
  driver: 's3',
  endpoint: Env.get('S3_ENDPOINT')
}
```

---

### Driver GCS

O driver `gcs` faz uso do Google Cloud Storage para ler/escrever arquivos. Você terá que instalar o driver separadamente.

Certifique-se de seguir as instruções do comando `configure` para configurar o driver corretamente. Você também pode ler as mesmas instruções [aqui](https://github.com/adonisjs/drive-gcs/blob/master/instructions.md).

```sh
npm i @adonisjs/drive-gcs
```

```sh
node ace configure @adonisjs/drive-gcs
```

Certifique-se de definir a opção `usingUniformAcl` como true se você usar GCS [uniform ACL](https://cloud.google.com/storage/docs/uniform-bucket-level-access).

## Visibilidade dos arquivos
O Drive permite que você salve arquivos com visibilidade `public` ou `private`. Os arquivos públicos são acessíveis usando a URL do arquivo, enquanto os arquivos privados podem ser lidos no servidor ou acessados ​​usando uma URL assinada.

Você pode configurar a visibilidade para todo o disco definindo a opção `visibility` no arquivo de configuração.

```ts {5}
{
  disks: {
    local: {
      driver: 'local',
      visibility: 'private'
      // ... resto da configuração
    }
  }
}
```

Os drivers `s3` e `gcs` também permitem que você defina a visibilidade para arquivos individuais. No entanto, recomendamos usar um bucket separado para arquivos públicos e privados pelos seguintes motivos.

- Ao usar um bucket separado, você pode configurar um CDN em todo o bucket para servir arquivos públicos.
- Você obtém melhor compatibilidade cruzada com o driver de arquivo `local`, pois o driver local não permite controle de visibilidade em nível de arquivo.

Independentemente do uso do driver, você não pode acessar os arquivos `privados` apenas com a URL do arquivo. Em vez disso, você precisa criar uma URL assinada ou usar o método `Drive.get` para acessar o arquivo.

```ts
// ✅ Funciona
const contents = await Drive.get(filePath)

// ❌ Não é possível acessar arquivos privados com uma URL
const url = await Drive.getUrl(filePath)

// ✅ Pode ser acessado usando uma URL assinada
const signedUrl = await Drive.getSignedUrl(filePath)
```

## Escrevendo arquivos
Você pode criar/atualizar arquivos usando um dos seguintes métodos. Se um arquivo já existir, ele será atualizado.

### `put`

O método `put` aceita o nome do arquivo como o primeiro argumento e o conteúdo do arquivo (string ou buffer) como o segundo argumento.

```ts
import Drive from '@ioc:Adonis/Core/Drive'

await Drive.put(filePath, contents)
```

Você também pode definir os metadados do arquivo usando o terceiro argumento.

```ts
await Drive.put(filePath, contents, {
  visibility: 'public',
  contentType: 'image/png'
})
```

A seguir está a lista de opções disponíveis.

| Opção                 | Descrição          |
|-----------------------|--------------------|
| `visibility`          | A visibilidade do arquivo | 
| `contentType`         | O tipo de conteúdo do arquivo | 
| `contentLanguage`     | O idioma do arquivo. Usado para definir o cabeçalho **content-language** ao baixar o arquivo | 
| `contentEncoding`     | A codificação do conteúdo do arquivo. Usado para definir o cabeçalho **content-encoding** ao baixar o arquivo | 
| `contentDisposition`  | Valor para o cabeçalho de resposta **content-disposition** | 
| `cacheControl`        | Valor para o cabeçalho de resposta **cache-control**. O driver GCS ignora esta opção, pois o SDK subjacente não permite configurá-la. | 

### `putStream`

O método `putStream` aceita o conteúdo como um fluxo legível. As opções são as mesmas do método `put`.

```ts
import Drive from '@ioc:Adonis/Core/Drive'

await Drive.putStream(filePath, readableStream)
```

### BodyParser `moveToDisk`
Você pode mover os arquivos enviados pelo usuário para um disco específico usando o método `file.moveToDisk`.

O método aceita os seguintes argumentos.

- O local do arquivo (sem o nome do arquivo).
- As opções de metadados. O mesmo que o método `put`.
- Opcionalmente, um nome de disco. Quando não definido, o disco padrão é usado.

```ts {7-11}
import Drive from '@ioc:Adonis/Core/Drive'
import Route from '@ioc:Adonis/Core/Route'

Route.post('posts', async ({ request }) => {
  const coverImage = request.file('cover_image')

  // Escrito no diretório "images"
  await coverImage.moveToDisk('images')

  // Escrito no diretório "root"
  await coverImage.moveToDisk('./')
})
```

O método `moveToDisk` renomeia o arquivo enviado pelo usuário para um nome de arquivo único/aleatório. No entanto, você também pode definir o nome do arquivo manualmente.

```ts
await coverImage.moveToDisk('images', {
  name: `${user.id}.${coverImage.extname}`
})
```

Finalmente, você também pode definir um nome de disco personalizado como o terceiro argumento.

```ts
await coverImage.moveToDisk('images', {}, 's3')
```

## Lendo arquivos
Você pode ler arquivos usando os métodos `Drive.get` ou `Drive.getStream`. Ambos os métodos gerarão uma exceção quando o arquivo estiver faltando.

### `get`
O método `get` retorna o conteúdo do arquivo como um buffer. Você pode convertê-lo em uma string chamando o método `toString`.

```ts
import Drive from '@ioc:Adonis/Core/Drive'

const contents = await Drive.get('filePath')
contents.toString()

// Codificação personalizada
contents.toString('ascii')
```

### `getStream`
O método `getStream` retorna uma instância do [fluxo legível](https://nodejs.org/dist/latest-v16.x/docs/api/stream.html#stream_class_stream_readable).

```ts
const readableStream = await Drive.getStream('filePath')
response.stream(readableStream)
```

## Gerando URLs
Você pode gerar uma URL para um caminho de arquivo usando os métodos `Drive.getUrl` ou `Drive.getSignedUrl`.

No caso de provedores de armazenamento em nuvem, a URL gerada aponta para o serviço de nuvem. Enquanto isso, no caso do driver `local`, a URL aponta para seu aplicativo AdonisJS.

O driver `local` registra uma rota implicitamente quando a opção `serveFiles` é definida como true dentro do arquivo de configuração. Além disso, um `basePath` é necessário e deve ser exclusivo nos discos registrados.

```ts {4,5}
{
  local: {
    driver: 'local',
    serveFiles: true,
    basePath: '/uploads'
  }
}
```

### `getUrl`
Retorna uma URL para baixar um arquivo fornecido. Uma exceção é gerada se o arquivo estiver ausente. Apenas os arquivos `públicos` podem ser visualizados usando a URL retornada pelo método `getUrl`.

```ts
const url = await Drive.getUrl('filePath')
```

### `getSignedUrl`
O método `getSignedUrl` retorna uma URL para baixar um arquivo fornecido com sua assinatura. Você só pode baixar o arquivo enquanto a assinatura for válida.

Você também pode definir a duração após a qual a assinatura expira e a URL se torna inválida.

```ts
const url = await Drive.getSignedUrl('filePath')

// Com expiração
const url = await Drive.getSignedUrl('filePath', {
  expiresIn: '30mins'
})
```

Finalmente, você também pode definir os seguintes cabeçalhos de conteúdo de resposta como o segundo argumento.

```ts
const url = await Drive.getSignedUrl('filePath', {
  contentType: 'application/json',
  contentDisposition: 'attachment',
})
```

A seguir está a lista de opções disponíveis.

| Opção                 | Descrição           |
|-----------------------|---------------------|
| `contentType`         | Valor para o cabeçalho de resposta **content-type**.  | 
| `contentLanguage`     | Valor para o cabeçalho de resposta **content-language**. Ignorado pelo driver GCS | 
| `contentEncoding`     | Valor para o cabeçalho de resposta **content-encoding**. Ignorado pelo driver GCS | 
| `contentDisposition`  | Valor para o cabeçalho de resposta **content-disposition**   |
| `cacheControl`        | Valor para o cabeçalho de resposta **cache-control**. Ignorado pelo driver GCS.  |

## Baixando arquivos
A abordagem recomendada para baixar arquivos é usar a URL do arquivo gerada usando o método `Drive.getUrl`. No entanto, você também pode baixar arquivos manualmente de uma rota personalizada.

A seguir, um exemplo simplificado de streaming de arquivos. [Aqui está](https://github.com/adonisjs/drive/blob/develop/src/LocalFileServer/index.ts#L62-L187) uma implementação mais robusta.

```ts
import { extname } from 'path'
import Route from '@ioc:Adonis/Core/Route'
import Drive from '@ioc:Adonis/Core/Drive'

Route.get('/uploads/*', async ({ request, response }) => {
  const location = request.param('*').join('/')

  const { size } = await Drive.getStats(location)

  response.type(extname(location))
  response.header('content-length', size)

  return response.stream(await Drive.getStream(location))
})
```

## Excluindo arquivos
Você pode excluir o arquivo usando o método `Drive.delete`. NENHUMA exceção é gerada quando o arquivo está ausente.

```ts
await Drive.delete('avatar.jpg')
```

## Copiando e movendo arquivos
Você pode copiar e mover arquivos usando os seguintes métodos. As opções de metadados são as mesmas do método `put`.

Para serviços de nuvem, as operações são executadas no mesmo bucket. Então, por exemplo, se você quiser copiar um arquivo do disco local, então você deve usar os métodos [put](#put) ou [putStream](#put-stream).

```ts
await Drive.copy(source, destination, metadataOptions)
await Drive.move(source, destination, metadataOptions)
```

## Alternando entre discos
Você pode alternar entre discos usando o método `Drive.use`.

```ts
// Referência ao disco S3
const s3 = Drive.use('s3')

await s3.put(filePath, stringOrBuffer)
```

## Alternando bucket em tempo de execução
Ao usar os drivers `s3` e `gcs`, você pode alternar o bucket em tempo de execução usando o método bucket.

```ts {3}
Drive
  .use('s3')
  .bucket('bucketName')
  .put(filePath, stringOrBuffer)
```

## Adicionando um driver personalizado
O Drive expõe a API para adicionar seus drivers personalizados. Cada driver deve aderir ao [DriverContract](https://github.com/adonisjs/drive/blob/develop/adonis-typings/drive.ts#L53-L134).

::: info NOTA
Você também pode usar os drivers oficiais [S3](https://github.com/adonisjs/drive-s3) ou [GCS](https://github.com/adonisjs/drive-gcs) como referência para criar seu próprio driver.
:::

```ts
interface DriverContract {
  name: string
  
  exists(location: string): Promise<boolean>
  
  get(location: string): Promise<Buffer>
  
  getStream(location: string): Promise<NodeJS.ReadableStream>
  
  getVisibility(location: string): Promise<Visibility>
  
  getStats(location: string): Promise<DriveFileStats>
  
  getSignedUrl(
    location: string,
    options?: ContentHeaders & { expiresIn?: string | number }
  ): Promise<string>
  
  getUrl(location: string): Promise<string>
  
  put(
    location: string,
    contents: Buffer | string,
    options?: WriteOptions
  ): Promise<void>
  
  putStream(
    location: string,
    contents: NodeJS.ReadableStream,
    options?: WriteOptions
  ): Promise<void>

  setVisibility(location: string, visibility: Visibility): Promise<void>

  delete(location: string): Promise<void>

  copy(
    source: string,
    destination: string,
    options?: WriteOptions
  ): Promise<void>

  move(
    source: string,
    destination: string,
    options?: WriteOptions
  ): Promise<void>
}
```

#### `exists`
Retorna um booleano para indicar se o arquivo existe ou não. O driver não deve gerar uma exceção quando o arquivo estiver ausente e, em vez disso, retorna falso.

#### `get`
Retorna o conteúdo do arquivo como um buffer. O driver deve gerar uma exceção quando o arquivo estiver ausente.

#### `getStream`
Retorna o conteúdo do arquivo como um fluxo legível. O driver deve gerar uma exceção quando o arquivo estiver ausente.

#### `getVisibility`
Retorna a visibilidade do arquivo. Se o driver não suportar visibilidade em nível de arquivo, ele deve retornar a visibilidade do disco da configuração.

#### `getStats`
Retorna os metadados do arquivo. O objeto de resposta deve incluir as seguintes propriedades.

```ts
{
  size: number
  modified: Date
  isFile: boolean
  etag?: string // Optional
}
```

#### `getSignedUrl`
Retorna uma URL assinada para baixar o arquivo. Se possível, a URL assinada pode aceitar os cabeçalhos de conteúdo de resposta ao gerar a URL.

#### `getUrl`
Retorna uma URL estática para o arquivo. Não há necessidade de verificar se o arquivo existe ou não. Em vez disso, retorna 404 no momento de servir o arquivo.

#### `put`
Cria/atualiza um arquivo a partir de conteúdo bruto (string ou buffer). Você também deve criar os diretórios necessários.

#### `putStream`
Cria/atualiza um arquivo a partir de um fluxo legível. Você também deve criar os diretórios necessários.

#### `setVisibility`
Atualize a visibilidade do arquivo. Se o driver não suportar visibilidade em nível de arquivo, ele deve simplesmente ignorar a solicitação.

#### `delete`
Exclua o arquivo. O driver não deve gerar uma exceção quando o arquivo estiver ausente.

#### `copy`
Copie o arquivo de um local para outro. A operação de cópia deve copiar os metadados do arquivo também. Por exemplo: no S3, é necessária uma solicitação adicional para copiar a ACL do arquivo.

#### `move`
Mova o arquivo de um local para outro. A operação de movimentação deve copiar os metadados do arquivo também.

### Estendendo de fora para dentro
Sempre que você estiver estendendo o núcleo do framework. É melhor assumir que você não tem acesso ao código do aplicativo e suas dependências. Em outras palavras, escreva suas extensões como se estivesse escrevendo um pacote de terceiros e use injeção de dependência para depender de outras dependências.

Para fins de demonstração, vamos criar um driver fictício sem implementação.

```sh
mkdir providers/DummyDriver
touch providers/DummyDriver/index.ts
```

Abra o arquivo `DummyDriver/index.ts` e cole o seguinte conteúdo dentro dele.

```ts
import type {
  Visibility,
  WriteOptions,
  ContentHeaders,
  DriveFileStats,
  DriverContract,
} from '@ioc:Adonis/Core/Drive'

export interface DummyDriverContract extends DriverContract {
  name: 'dummy' // Nome do driver
}

export type DummyDriverConfig = {
  driver: 'dummy' // Nome do driver
  // .. outras opções de configuração
}

export class DummyDriver implements DummyDriverContract {
  // a implementação vai aqui
}
```

Em seguida, você deve registrar o driver com o módulo Drive. Você deve fazer isso dentro do método de inicialização de um provedor de serviços. Abra o arquivo `providers/AppProvider.ts` pré-existente e cole o seguinte código dentro dele.

```ts
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const { DummyDriver } = await import('./DummyDriver')
    const Drive = this.app.container.use('Adonis/Core/Drive')

    Drive.extend('dummy', (_drive, _diskName, config) => {
      return new DummyDriver(config)
    })
  }
}
```

### Informando o TypeScript sobre o novo driver
Antes que alguém possa referenciar este driver dentro do arquivo `config/drive.ts`. Você terá que informar o compilador estático do TypeScript sobre sua existência.

Se você estiver criando um pacote, então você pode escrever o seguinte código dentro do arquivo principal do seu pacote, caso contrário você pode escrevê-lo dentro do arquivo `contracts/drive.ts`.

```ts
import {
  DummyDriverConfig,
  DummyDriverContract
} from '../providers/DummyDriver'

declare module '@ioc:Adonis/Core/Drive' {
  interface DriversList {
    dummy: {
      config: DummyDriverConfig,
      implementation: DummyDriverContract
    }
  }
}
```

## Usando o driver
Tudo bem, agora estamos prontos para usar o driver. Vamos começar definindo a configuração para um novo disco dentro do arquivo `config/drive.ts`.

```ts
{
  disks: {
    myDummyDisk: {
      driver: 'dummy',
      // ... resto da configuração
    }
  }
}
```

E use-o da seguinte forma.

```ts
import Drive from '@ioc:Adonis/Core/Drive'

await Drive.use('myDummyDisk').put(filePath, contents)
```
