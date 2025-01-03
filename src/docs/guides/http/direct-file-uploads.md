# Uploads diretos de arquivo

Os uploads diretos de arquivo permitem que você transmita os fluxos multipartes recebidos para um serviço de nuvem como Amazon S3 ou Cloudinary sem processá-los em seu servidor. O fluxo é o seguinte:

- O usuário carrega o arquivo.
- A solicitação chega ao seu servidor.
- Em vez de analisar a solicitação e ler dados dela, você canaliza o fluxo para um serviço de nuvem externo.

Como você canaliza o fluxo diretamente, seu aplicativo AdonisJS não precisa alocar nenhuma memória adicional ou computação de CPU para analisar e persistir os dados em um disco.

## Quando não usar uploads diretos de arquivo?
Como você notará mais adiante neste guia, os uploads diretos de arquivo são complexos, pois você lida com os fluxos diretamente.

Recomendamos manter os [uploads de arquivo padrão](./file-uploads.md) se seu aplicativo não lida com uploads de arquivos grandes. Lembre-se, às vezes escrever o código mais simples vence pequenos ganhos de desempenho.

## Uso
O primeiro passo é **desabilitar o autoprocessamento** de arquivos dentro do arquivo `config/bodyparser.ts`. Uma vez desabilitado o autoprocessamento, o middleware bodyparser encaminhará o fluxo multipartes para seu controlador para que você possa processá-lo manualmente.

Você pode desabilitar o autoprocessamento para todo o aplicativo definindo a propriedade `autoProcess` como `false`.

```ts
multipart: {
  autoProcess: false
}
```

Ou você pode desabilitá-lo para rotas selecionadas adicionando seu padrão de rota ao array `processManually`.

```ts
processManually: ['/drive']
```

### Manipulando o fluxo multipartes
Você pode manipular o fluxo multipartes dentro do seu controlador da seguinte forma:

```ts {5-9}
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DriveController {
  public async store({ request }: HttpContextContract) {
    request.multipart.onFile('input_field_name', {}, (part) => {
      someSdk.uploadStream(part)
    })

    await request.multipart.process()
  }
}
```

- O `request.multipart.process()` inicia o processamento do fluxo multipartes.
- O método `request.multipart.onFile` permite que você processe o fluxo para uma determinada entrada de arquivo definindo um retorno de chamada.
- O método de retorno de chamada recebe a instância do fluxo (`part`) como o primeiro argumento. Você pode escrever esse fluxo em qualquer destino que desejar.

### Acesse o arquivo de fluxo processado
Depois que o fluxo de um determinado arquivo for processado **(com sucesso ou com erros)**, você pode acessá-lo usando o método `request.file`. Por exemplo:

```ts
request.multipart.onFile('input_field_name', {}, (part) => {
  someSdk.uploadStream(part)
})

await request.multipart.process()

const file = request.input('input_field_name')
if (file.hasErrors) {
  return file.errors
}
```

### Validando o fluxo
Você também pode validar o fluxo conforme ele é gravado em um destino, relatando cada pedaço para uma função auxiliar passada como o segundo argumento para o retorno de chamada `onFile`.

```ts {3-6,8-9}
request.multipart.onFile(
  'input_field_name',
  {
    extnames: ['pdf', 'jpg', 'png', 'doc', 'xls'],
    size: '200mb',  
  },
  (part, reportChunk) => {
    part.pause()
    part.on('data', reportChunk)

    someSdk.uploadStream(part)
  })
```

- Primeiro, você precisa definir as regras de validação para `extname` e `size`.
- Em seguida, use o método `reportChunk` e relate cada pedaço para uma função auxiliar interna.
- O método `reportChunk` monitorará o fluxo conforme ele flui e emitirá um erro se alguma regra de validação não for atendida.
- Assim que um erro for emitido pelo método `reportChunk` no fluxo legível, o fluxo gravável (seu SDK) irá/deve abortar o processo de upload.

#### Você notou a declaração `part.pause`?
Você tem que [pausar o fluxo](https://nodejs.org/api/stream.html#stream_event_data) antes de definir o ouvinte de evento `part.on('data')`. Caso contrário, o fluxo começará a fluir dados antes que seu SDK esteja pronto para consumi-los.

### Tratamento de erros
Quaisquer erros que ocorreram dentro do retorno de chamada `onFile` são adicionados à instância do arquivo, e você pode acessá-los da seguinte forma.

```ts
request.multipart.onFile('input_field_name', {}, (part) => {
  throw new Error('blow up the stream')
})

await request.multipart.process()

const file = request.input('input_field_name')
console.log(file.errors) // conterá o "explodir o fluxo"
```

### Anexar metadados ao fluxo processado
Você pode anexar metadados ao arquivo de fluxo processado retornando um objeto do retorno de chamada `onFile`. Por exemplo, pode ser um objeto que contém a URL do arquivo carregado para um serviço de nuvem.

```ts {5-6}
request.multipart.onFile('input_field_name', {}, (part, reportChunk) => {
  part.pause()
  part.on('data', reportChunk)

  const url = await someSdk.uploadStream(part)
  return { url }
})
```

O `url` estará disponível na propriedade `file.meta`.

```ts {4}
await request.multipart.process()

const file = request.input('input_field_name')
console.log(file.meta) // { url: '...' }
```

## Advertências
Ao trabalhar com o fluxo diretamente, você não pode acessar os campos de entrada do formulário antes de processar o fluxo inteiro. Isso ocorre porque os campos e arquivos do formulário são partes de um único fluxo e, portanto, estão disponíveis apenas quando o fluxo é processado.

::: danger ERRO
O campo do formulário pode não estar disponível durante o processamento do fluxo
:::

```ts {2-4}
request.multipart.onFile('input_field_name', {}, (part) => {
  // Pode ou não estar disponível, com base na posição do campo
  // no fluxo
  request.input('some_field')
})

await request.multipart.process()
```

::: tip SUCESSO
Acesse o campo do formulário após o fluxo ter sido processado
:::

```ts {6-7}
request.multipart.onFile('input_field_name', {}, (part) => {
})

await request.multipart.process()

// Acesso após o método do processo
request.input('some_field')
```

## Qual é a diferença dos uploads diretos da AWS?
AWS [permite uploads diretos de arquivos](https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/) diretamente do navegador, sem nem mesmo atingir seu servidor.

Uploads diretos do AdonisJS são uma alternativa aos uploads diretos da AWS, mas ambas as abordagens têm suas vantagens e desvantagens, conforme listado abaixo.

### Uploads diretos da AWS

- Processado diretamente do navegador.
- Requer uma solicitação HTTP adicional para gerar uma assinatura de autenticação.
Propriedade [file.type](https://developer.mozilla.org/en-US/docs/Web/API/File/type) para detectar o tipo de conteúdo do arquivo. Isso pode ser facilmente falsificado.
- Precisa de uma política de bucket para validar o tipo e o tamanho do arquivo.
- Os uploads de arquivos são geralmente mais rápidos e não exigem computação nenhuma em seu servidor.

### Uploads diretos do AdonisJS

- Processado do servidor.
- Usa o arquivo [número mágico](<https://en.wikipedia.org/wiki/Magic_number_(programming)#Magic_numbers_in_files>) para detectar o tipo de conteúdo do arquivo no servidor.
- Usa as validações padrão do lado do servidor.
- Mesmo que os arquivos sejam transmitidos diretamente, seu servidor ainda precisa atender à solicitação.
