# Ativos estáticos

O AdonisJS vem com um servidor de arquivos estático para servir os arquivos de um diretório específico. É tão simples quanto soltar um arquivo dentro do diretório `./public` e acessá-lo pelo nome do arquivo. Por exemplo:

Crie um arquivo chamado `public/style.css` com o seguinte conteúdo.

```css
body {
  background: #f7f7f7;
}
```

E então acesse-o visitando o [http://localhost:3333/style.css](http://localhost:3333/style.css). Você não precisa digitar o nome do diretório (/public), e os arquivos são acessíveis diretamente pelo nome do arquivo.

## Configuração

A configuração para o servidor estático é armazenada dentro do arquivo `config/static.ts`.

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

#### `enabled`

Um botão de alternância para habilitar/desabilitar o servidor de arquivos estático.

#### `dotFiles`

O tratamento para os dotfiles. O valor pode ser um dos seguintes:

- `'allow'`: Nenhum tratamento especial para dotfiles. Apenas os sirva como qualquer outro arquivo.
- `'deny'`: Negue a solicitação com um código de status 403.
- `'ignore'`: Finja que o dotfile não existe.

#### `etag`

Se deve ou não gerar o ETag para os arquivos.

#### `lastModified`

Habilite ou desabilite o cabeçalho HTTP `Last-Modified`. O valor do cabeçalho depende do último valor modificado do arquivo.

## O diretório padrão

Convencionalmente, servimos os arquivos do diretório `./public`. No entanto, você pode escolher um diretório diferente configurando-o dentro do arquivo `.adonisrc.json`.

```json
// .adonisrc.json

{
  "directories": {
    "public": "assets"
  }
}
```

Após a alteração acima, o servidor estático servirá os arquivos do diretório `./assets`.

### Notificando o assembler sobre a alteração

O pacote `@adonisjs/assembler` compila seu aplicativo de produção e grava a saída no diretório `./build`.

Durante esse processo, ele também copia os arquivos do diretório `public` e, portanto, você deve notificá-lo sobre a alteração no arquivo `.adonisrc.json`.

```json
// .adonisrc.json

{
  "metaFiles": [
    { // [!code --]
      "pattern": "public/**", // [!code --]
      "reloadServer": false // [!code --]
    }, // [!code --]
    { // [!code ++]
      "pattern": "assets/**", // [!code ++]
      "reloadServer": false // [!code ++]
    } // [!code ++]
  ]
}
```

## Conflitos de URL

Caso seus nomes de arquivo estático entrem em conflito com uma rota registrada, o AdonisJS dará preferência ao arquivo estático e o manipulador de rota nunca será chamado.

Nesse cenário, recomendamos que você renomeie o arquivo estático ou mova-o para dentro de uma subpasta para evitar o conflito em primeiro lugar.

## Leitura adicional

[Gerente de ativos](./assets-manager.md)
