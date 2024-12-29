# Usando Https

O servidor HTTPs do Node.js pode ser usado com o AdonisJs da seguinte forma. A ideia é usar o módulo `https` do Node.js dentro do arquivo `server.js`.

```js
const { Ignitor } = require('@adonisjs/ignitor')
const path = require('path')
const https = require('https')
const fs = require('fs')

// Certificate
const options = {
  key: fs.readFileSync(path.join(__dirname, './server.key')),
  cert: fs.readFileSync(path.join(__dirname, './server.crt'))
}

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer((handler) => {
    return https.createServer(options, handler)
  })
  .catch(console.error)
```

O trabalho real acontece dentro do método `fireHttpServer`. Esta função recebe um único argumento como retorno de chamada, e o valor de retorno deve ser a instância do servidor Node.js.

## Certificado autoassinado
No desenvolvimento, você também pode usar o certificado autoassinado. Ele requer uma dependência adicional do npm.

```bash
npm i pem
```

```js
const { Ignitor } = require('@adonisjs/ignitor')
const https = require('https')
const pem = require('pem')

pem.createCertificate({ days: 1, selfSigned: true }, (error, keys) => {
  if (error) {
    return console.log(error)
  }

  const options = {
    key: keys.serviceKey,
    cert: keys.certificate
  }

  new Ignitor(require('@adonisjs/fold'))
    .appRoot(__dirname)
    .fireHttpServer((handler) => {
      return https.createServer(options, handler)
    })
    .catch(console.error)
})
```
