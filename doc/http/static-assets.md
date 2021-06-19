# Arquivos Estáticos
O AdonisJS vem com um servidor de arquivos estático para servir os arquivos de um determinado diretório. É tão simples quanto soltar 
um arquivo dentro do diretório `./public` e acessá-lo pelo nome do arquivo. Por exemplo:

Crie um arquivo denominado `public/style.css` com o seguinte conteúdo.

```css
body {
  background: #f7f7f7;
}
```

Em seguida, acesse-o visitando `http://localhost:3333/style.css`. Você não precisa digitar o nome do diretório 
(`/public`) e os arquivos podem ser acessados diretamente pelo nome do arquivo.

### Configuração
A configuração do servidor estático é armazenada dentro do arquivo `config/static.ts`.

```ts
import { AssetsConfig } from '@ioc:Adonis/Core/Static'

const staticConfig: AssetsConfig = {
  enabled: true,
  dotFiles: 'ignore',
  etag: true,
  lastModified: true,
}

export default staticConfig
```

#### enabled
Um botão de alternância para ativar/desativar o servidor de arquivos estáticos.

##### dotFiles
O tratamento para os dotfiles. Este valor pode ser um dos seguintes:

* `'allow'`: Nenhum tratamento especial para dotfiles. Basta servi-los como qualquer outro arquivo.
* `'deny'`: Negar a solicitação com um código de status 403.
* `'ignore'`: Finja que o dotfile não existe.

##### etag
Se deve ou não gerar a ETag para os arquivos.

##### lastModified
Habilite ou desabilite o cabeçalho HTTP `Last-Modified`. O valor do cabeçalho depende do último valor modificado do arquivo.

### O diretório padrão
Convencionalmente, servimos os arquivos do diretório `./public`. No entanto, você pode escolher um diretório diferente configurando-o 
dentro do arquivo `.adonisrc.json`.

```json
{
  "directories": {
    "public": "assets"
  }
}
```

Após a alteração acima, o servidor estático servirá os arquivos do diretório `./assets`.

#### Notificando o montador sobre a mudança
O pacote `@adonisjs/assembler` compila seu aplicativo de produção e grava a saída no diretório `./build`.

Durante esse processo, ele também copia os arquivos do diretório `public` e, portanto, você deve notificá-lo sobre a alteração no arquivo `.adonisrc.json`.

```json
{
  "metaFiles": [
    {
      "pattern": "public/**",
      "reloadServer": false
    },
    {
      "pattern": "assets/**",
      "reloadServer": false
    }
  ]
}
```

### Conflitos de URL
No caso de seus nomes de arquivo estáticos entrarem em conflito com uma rota registrada, o AdonisJS dará preferência ao arquivo estático 
e o manipulador de rota nunca será chamado.

Nesse cenário, recomendamos que você renomeie o arquivo estático ou mova-o para dentro de uma subpasta para 
evitar o conflito em primeiro lugar.
