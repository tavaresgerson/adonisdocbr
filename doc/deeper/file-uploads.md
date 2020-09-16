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

Chave	Valor	Descrição
types

String[]

Uma variedade de tipos permitidos. O valor será verificado em relação ao tipo de mídia do arquivo .

size

String OU Number

O tamanho máximo permitido para o arquivo. O valor é analisado usando o método bytes.parse .

extnames

String[]

Para ter um controle mais granular sobre o tipo de arquivo, você pode definir as extensões permitidas sobre a definição do tipo.

Um exemplo de como aplicar regras de validação é o seguinte:

const validationOptions = {
  types: ['image'],
  size: '2mb',
  extnames: ['png', 'gif']
}
const avatar = request.file('avatar', validationOptions)

// this is when validation occurs
await avatar.move()
Tipos de Erro
Quando a validação de upload falha, o método File error retorna um objeto contendo o fieldNameoriginal com falha clientName, um erro messagee a regra typeque acionou o erro.

O método FileJar errors retorna uma matriz de erros.
Alguns exemplos de objetos de erro estão listados abaixo.

Erro de digitação
{
  fieldName: "field_name",
  clientName: "invalid-file-type.ai",
  message: "Invalid file type postscript or application. Only image is allowed",
  type: "type"
}
Erro de tamanho
{
  fieldName: "field_name",
  clientName: "invalid-file-size.png",
  message: "File size should be less than 2MB",
  type: "size"
}
Propriedades do arquivo
As seguintes propriedades de arquivo podem ser acessadas na instância do arquivo :

Propriedade	Não processado	Dentro do tmp	Mudou-se
Nome do cliente
Nome do arquivo na máquina cliente

String

String

String

nome do arquivo
Nome do arquivo após a operação de movimentação

null

null

String

fieldName
Nome do campo do formulário

String

String

String

tmpPath
Caminho temporário

null

String

String

Tamanho
Tamanho do arquivo em bytes

0

Number

Number

tipo
Tipo primário de arquivo

String

String

String

subtipo
Subtipo de arquivo

String

String

String

status
Status do arquivo (definido para errorquando falhou)

pending

consumed

moved

extname
Extensão de arquivo

String

String

String

Validadores de rota
Os validadores de rota validam os arquivos carregados antes de transmiti-los ao controlador.

No exemplo de validador de rota abaixo:

app / Validators / StoreUser.js
'use strict'

class StoreUser {
  get rules () {
    return {
      avatar: 'file|file_ext:png,jpg|file_size:2mb|file_types:image'
    }
  }
}

module.exports = StoreUser
A fileregra garante que o avatarcampo seja um arquivo válido .

A file_extregra define o extnamespermitido para o arquivo.

A file_sizeregra define o máximo sizepara o arquivo.

A file_typesregra define o typespermitido para o arquivo.

Arquivos de streaming
A maioria das bibliotecas / estruturas de upload processa arquivos várias vezes ao fazer streaming para um serviço externo como o Amazon S3 . Seus fluxos de trabalho de upload geralmente são projetados da seguinte forma:

Processar arquivos de solicitação e salvá-los no tmpdiretório.

Mova cada arquivo do tmpdiretório para o diretório de destino.

Use o SDK do serviço externo para finalmente transmitir o arquivo para o serviço externo.

Este processo desperdiça recursos do servidor lendo / gravando arquivos únicos várias vezes.

O AdonisJs torna o processo de streaming de arquivos carregados muito mais eficiente.

Desative o processamento automático
Primeiro, desative o processamento automático de arquivos para suas rotas de upload por meio do config/bodyparser.jsarquivo:

config / bodyparser.js
processManually: ['/upload']
A processManuallyopção leva uma série de rotas ou padrões de rota para os quais os arquivos não devem ser processados ​​automaticamente.

Processe o fluxo
Finalmente, chame o request.multipart.processmétodo dentro do controlador de upload de arquivo / manipulador de rota:

start / routes.js
const Drive = use('Drive')

Route.post('upload', async ({ request }) => {

  request.multipart.file('profile_pic', {}, async (file) => {
    await Drive.disk('s3').put(file.clientName, file.stream)
  })

  await request.multipart.process()
})
Você deve chamar await request.multipart.process()para iniciar o processamento dos arquivos carregados.
O request.multipart.filemétodo permite selecionar um arquivo específico e acessar seu fluxo legível por meio da file.streampropriedade para que você possa canalizar o fluxo para o Amazon S3 ou qualquer outro serviço externo que desejar.

Todo o processo é assíncrono e processa o (s) arquivo (s) apenas uma vez.
