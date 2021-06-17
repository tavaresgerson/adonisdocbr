# Upload Direto de Arquivos

Os uploads diretos de arquivos permitem que você transmita os fluxos multipart recebidos para um serviço de nuvem como 
s3 ou cloudinary sem processá-los em seu servidor. O fluxo é o seguinte:

1. O usuário carrega o arquivo.
2. A solicitação chega ao seu servidor.
3. Em vez de analisar a solicitação e ler os dados dela, você canaliza o fluxo para um serviço de nuvem externo.

Como você canaliza o fluxo diretamente, seu aplicativo AdonisJS não precisa alocar nenhuma memória adicional ou 
computação de CPU para analisar e manter os dados em um disco.

### Quando não usar uploads diretos de arquivos?
Como você notará posteriormente neste guia, os uploads diretos de arquivos são complexos, pois você lida com os fluxos diretamente.

Recomendamos seguir os [uploads de arquivo](/doc/http/file-uploads.md) padrão se seu aplicativo não lidar com uploads de arquivos grandes. 
No entanto, às vezes, escrever um código mais simples vence pequenos ganhos de desempenho.

### Uso
A primeira etapa é desabilitar o autoprocessamento de arquivos dentro do arquivo `config/bodyparser.ts`. Depois que o autoprocessamento é 
desabilitado, o middleware bodyparser encaminhará o fluxo multipartes para o seu controlador para que você possa processá-lo manualmente.

Você pode desabilitar o autoprocessamento de todo o aplicativo definindo a propriedade `autoProcess` como false.

```ts
multipart: {
  autoProcess: false
}
```

Ou você pode desabilitá-lo para rotas selecionadas adicionando seu padrão de rota à matriz `processManually`.

```ts
processManually: ['/drive']
```

#### Lidar com o fluxo multiparte
Você pode manipular o fluxo multipart dentro de seu controlador da seguinte maneira:

```ts
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

* O `request.multipart.process()` começa a processar o fluxo multipart.
* O método `request.multipart.onFile` permite que você processe o fluxo para uma determinada entrada de arquivo, definindo um retorno de chamada.
* O método de retorno de chamada recebe a instância do stream (`part`) como o primeiro argumento. Você pode gravar este fluxo em 
  qualquer destino que desejar.
 
#### Acesse o arquivo de fluxo processado
Uma vez que o fluxo de um determinado arquivo foi processado (com sucesso ou com erros) , você pode acessá-lo usando o método `request.file`. Por exemplo:

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

#### Validando o stream
Você também pode validar o fluxo conforme ele é gravado em um destino, relatando cada bloco a uma função auxiliar passada como o segundo 
argumento para o retorno `onFile` de chamada.

```ts
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

* Primeiro, você deve definir as regras de validação para o `extname` e o `size`.
* Em seguida, use o método `reportChunk` e relate cada trecho a uma função auxiliar interna.
* O método `reportChunk` monitorará o fluxo conforme ele flui e emite um erro se alguma regra de validação não for atendida.
* Assim que um erro for emitido pelo método `reportChunk` no fluxo legível, o fluxo gravável (seu SDK) irá/deve abortar o processo de upload.

#### Você notou a declaração `part.pause`?
Você deve [pausar o fluxo](https://nodejs.org/api/stream.html#stream_event_data) antes de definir o ouvinte de evento `part.on('data')`. 
Caso contrário, o fluxo começará a fluir dados antes que seu SDK esteja pronto para consumi-los.

#### Manipulação de erros
Quaisquer erros ocorridos no retorno `onFile` de chamada são adicionados à instância do arquivo e você pode acessá-los da seguinte maneira.

```ts
request.multipart.onFile('input_field_name', {}, (part) => {
  throw new Error('blow up the stream')
})

await request.multipart.process()

const file = request.input('input_field_name')
console.log(file.errors) // conterá a "explosão do fluxo"
```

#### Anexe metadados ao fluxo processado
Você pode anexar metadados ao arquivo de fluxo processado, retornando um objeto do retorno de chamada `onFile`. Por exemplo, pode ser um objeto 
que contém a URL do arquivo carregado em um serviço de nuvem.

```ts
request.multipart.onFile('input_field_name', {}, (part, reportChunk) => {
  part.pause()
  part.on('data', reportChunk)

  const url = await someSdk.uploadStream(part)
  return { url }
})
```

O `url` estará disponível na propriedade `file.meta`.

```ts
await request.multipart.process()

const file = request.input('input_field_name')
console.log(file.meta) // { url: '...' }
```

### Ressalvas
Ao trabalhar com o fluxo diretamente, você não pode acessar os campos de entrada do formulário antes de todo o fluxo ter sido processado. Isso ocorre porque os campos e arquivos do formulário são partes de um único fluxo e, portanto, estão disponíveis apenas quando o fluxo é processado.

 ❌ Incorreto
```ts
request.multipart.onFile('input_field_name', {}, (part) => {
  // Pode ou não estar disponível, com base na posição do 
  // campo no fluxo
  request.input('some_field')
})

await request.multipart.process()
```

 ✅ Correto
```ts
request.multipart.onFile('input_field_name', {}, (part) => {
})

await request.multipart.process()

// Acesso após o método de processo
request.input('some_field')
```

### Como é diferente dos uploads diretos da AWS?
A AWS [permite uploads diretos](https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/) de arquivos diretamente 
do navegador, mesmo sem atingir o servidor.

Os uploads diretos do AdonisJS são uma alternativa aos uploads diretos da AWS, mas ambas as abordagens têm suas próprias 
vantagens e desvantagens, conforme listado abaixo.

#### Uploads diretos para AWS

* Processado diretamente no navegador.
* Requer uma solicitação HTTP adicional para gerar uma assinatura de autenticação.
* Usa a propriedade [`file.type`](https://developer.mozilla.org/en-US/docs/Web/API/File/type) do cliente para detectar o tipo de conteúdo do arquivo. Isso pode ser facilmente falsificado.
* Precisa de uma política de intervalo para validar o tipo e tamanho do arquivo.
* Os uploads de arquivos geralmente são mais rápidos e exigem computação zero em seu servidor.

#### Uploads diretos AdonisJS

* Processado a partir do servidor.
* Usa o número mágico do arquivo para detectar o tipo de conteúdo do arquivo no servidor.
* Use as validações padrão do lado do servidor.
* Mesmo que os arquivos sejam transmitidos diretamente, seu servidor ainda precisa atender à solicitação.
