---
title: File Storage
category: digging-deeper
---

# Armazenamento de arquivos

O AdonisJs tem um *Drive Provider* dedicado construído sobre o [Flydrive](https://github.com/Slynova-Org/node-flydrive) para interagir com sistemas de arquivos locais e remotos como o *Amazon S3*.

Neste guia, aprendemos como configurar e usar o *Drive Provider*.

## Configuração
Como o *Drive Provider* não é instalado por padrão, precisamos obtê-lo do `npm`:

```bash
adonis install @adonisjs/drive
```

Em seguida, precisamos registrar o provedor dentro do arquivo `start/app.js`:

```js
// .start/app.js

const providers = [
  '@adonisjs/drive/providers/DriveProvider'
]
```

> NOTA: A configuração do driver é salva dentro do arquivo `config/drive.js`, que é criado pelo comando `adonis install` ao instalar o *Drive Provider*.

## Drivers disponíveis
Os drivers padrão enviados com o *Drive Provider* são:

1. Amazon S3 (`s3`), que requer o pacote [aws-sdk](https://www.npmjs.com/package/aws-sdk)
2. DigitalOcean Spaces (`spaces`), que requer o pacote [aws-sdk](https://www.npmjs.com/package/aws-sdk)
3. Sistema de arquivos local (`local`)

## Exemplo básico
Aqui está um exemplo básico de como interagir com o disco local via `adonis repl`:

![image](http://res.cloudinary.com/adonisjs/image/upload/q_100/v1505719793/Drive_dlcc3v.gif)

## Drive API
Embora operações comuns como leitura e escrita permaneçam as mesmas em todos os drivers, a API de uma unidade é baseada principalmente no driver que você está usando para interagir com o sistema de arquivos dessa unidade.

#### `exists(relativePath)`
Descubra se um arquivo/diretório existe ou não:

```js
const exists = await Drive.exists('unicorn.jpg')
```

#### `get(relativePath, encoding = utf-8)`
Obtenha o conteúdo do arquivo como um buffer ou string:

```js
const unicorn = await Drive.get('unicorn.jpg')
```

#### `getStream(relativePath)`
Obtenha o arquivo como um fluxo:

```js
Drive.getStream('hello.txt')
```

#### `put(relativePath, content, options = {})`
Crie um novo arquivo com o conteúdo fornecido (crie todos os diretórios ausentes):

```js
await Drive.put('hello.txt', Buffer.from('Hello world!'))
```

#### `prepend(relativePath, content, options = {})`
Adicione o conteúdo a um arquivo (crie um novo arquivo se o caminho não exist):

```js
await Drive.prepend('hello.txt', Buffer.from('Prepended!'))
```

> NOTA: O método `prepend` funciona apenas com o driver local.

#### `append(relativePath, content, options = {})`
Acrescenta conteúdo a um arquivo (cria um novo arquivo se o caminho não existir):

```js
await Drive.append('hello.txt', Buffer.from('Appended!'))
```

> NOTA: O método `append` funciona apenas com o driver local.

#### `delete(relativePath)`
Remover arquivo existente:

```js
await Drive.delete('hello.txt')
```

#### `move(src, dest, options = {})`
Mover arquivo de um diretório para outro:

```js
await Drive.move('hello.txt', 'hi.txt')
```

#### `copy(src, dest, options = {})`
Copiar arquivo de um diretório para outro:

```js
await Drive.copy('hi.txt', 'hello.txt')
```

## API S3/Spaces
Os métodos a seguir funcionam apenas para os drivers `s3` e `spaces`.

#### `getObject(location, params)`
Obter objeto S3 para um arquivo fornecido (para informações sobre `params`, consulte [S3 params](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property)):

```js
await Drive.disk('s3').getObject('unicorn.jpg')
```

#### `getUrl(location, [bucket])`
Obter url para um arquivo fornecido (aceita parâmetro alternativo opcional `bucket`):

```js
const url = Drive.disk('s3').getUrl('unicorn.jpg')
```

#### `getSignedUrl(location, expiry = 900, params)`
Obter url assinada para um arquivo fornecido (expiração definida como `15mins` por padrão):

```js
const url = await Drive.disk('s3').getSignedUrl('unicorn.jpg')
```
