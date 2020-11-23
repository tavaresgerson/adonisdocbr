# Armazenamento de Arquivo

AdonisJs tem um **Drive Provider** dedicado construído em cima do [Flydrive](https://github.com/Slynova-Org/node-flydrive) para 
interagir com sistemas de arquivos locais e remotos como o Amazon S3.

Neste guia, aprendemos como configurar e usar o Drive Provider.

## Configuração

Como o Drive Provider não é instalado por padrão, precisamos baixá-lo do npm:

```bash
> adonis install @adonisjs/drive
```

Em seguida, precisamos registrar o provedor dentro do arquivo `start/app.js`:

```js
const providers = [
  '@adonisjs/drive/providers/DriveProvider'
]
```

> A configuração do driver é salva dentro do arquivo `config/drive.js`,
> que é criado pelo comando `adonis install` ao instalar o **Drive Provider**.

## Drivers Disponíveis

Os drivers padrão fornecidos com o **Drive Provider** são:

* Amazon S3 (`s3`), que requer o pacote [aws-sdk](https://www.npmjs.com/package/aws-sdk)
* DigitalOcean Spaces (`spaces`), que requer o pacote [aws-sdk](https://www.npmjs.com/package/aws-sdk)
* Sistema de arquivos local (`local`)

## Exemplo Básico
Aqui está um exemplo básico de como interagir com o disco local via `adonis repl`:

<img src="https://github.com/tavaresgerson/adonisdocbr/raw/master/assets/Drive_dlcc3v.gif" />

## Drive API
Embora operações comuns como leitura e gravação permaneçam as mesmas entre os drivers, a API de uma unidade é baseada principalmente no driver que você está usando para interagir com o sistema de arquivos dessa unidade.

### exists(relativePath)
Descubra se um arquivo/diretório existe ou não:
```js
const exists = await Drive.exists('unicorn.jpg')
```

### get(relativePath, encoding = utf-8)
Obtenha o conteúdo do arquivo como um buffer ou string:
```js
const unicorn = await Drive.get('unicorn.jpg')
```

### getStream(relativePath)
Obter arquivo como um fluxo:
```js
Drive.getStream('hello.txt')
```

### put(relativePath, content, options = {})
Crie um novo arquivo com o conteúdo fornecido (cria quaisquer diretórios ausentes):
```js
await Drive.put('hello.txt', Buffer.from('Hello world!'))
```

### prepend(relativePath, content, options = {})
Adicionar conteúdo a um arquivo (cria um novo arquivo se o caminho não existir):
```js
await Drive.prepend('hello.txt', Buffer.from('Prepended!'))
```

> O método `prepend` funciona apenas com o driver local.

### append(relativePath, content, options = {})
Anexar conteúdo a um arquivo (cria um novo arquivo se o caminho não existir):

await Drive.append('hello.txt', Buffer.from('Appended!'))

> O método `append` funciona apenas com o driver local.

### delete(relativePath)
Remova o arquivo existente:
```js
await Drive.delete('hello.txt')
```

### move(src, dest, options = {})
Mova o arquivo de um diretório para outro:
```js
await Drive.move('hello.txt', 'hi.txt')
```

### copy(src, dest, options = {})
Copie o arquivo de um diretório para outro:
```
await Drive.copy('hi.txt', 'hello.txt')
```

## API S3/Spaces
Os métodos a seguir funcionam apenas para os drivers `s3` e `spaces`.

### getObject(location, params)
Obtenha o objeto S3 para um determinado arquivo (para obter informações de `params`, consulte os [parâmetros S3](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property)):
```js
await Drive.disk('s3').getObject('unicorn.jpg')
```

### getUrl(location, [bucket])
Obtenha url para um determinado arquivo (aceita parâmetros opcionais do bucket):
```js
const url = Drive.disk('s3').getUrl('unicorn.jpg')
```

### getSignedUrl(location, expiry = 900, params)
Obtenha o url assinado para um determinado arquivo (expiração padrão definida como 15min):

```js
const url = await Drive.disk('s3').getSignedUrl('unicorn.jpg')
```
