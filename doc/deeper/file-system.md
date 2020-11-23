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
