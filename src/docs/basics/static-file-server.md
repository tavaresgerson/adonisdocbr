---
summary: Sirva arquivos estáticos de um diretório fornecido usando o pacote @adonisjs/static.
---

# Servidor de arquivos estáticos

Você pode servir arquivos estáticos de um diretório fornecido usando o pacote `@adonisjs/static`. O pacote é fornecido com um middleware que você deve registrar na [pilha de middleware do servidor](./middleware.md#server-middleware-stack) para interceptar as solicitações HTTP e servir arquivos.

## Instalação

O pacote vem pré-configurado com o kit inicial `web`. No entanto, você pode instalá-lo e configurá-lo da seguinte forma com outros kits iniciais.

Instale e configure o pacote usando o seguinte comando:

```sh
node ace add @adonisjs/static
```

::: details Veja os passos realizados pelo comando `add`

1. Instala o pacote `@adonisjs/static` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

    ```ts
    {
      providers: [
        // ... outros provedores
        () => import('@adonisjs/static/static_provider')
      ]
    }
    ```

3. Crie o arquivo `config/static.ts`.

4. Registra o seguinte middleware dentro do arquivo `start/kernel.ts`.

    ```ts
    server.use([
      () => import('@adonisjs/static/static_middleware')
    ])
    ```

:::

## Configuração

A configuração do middleware estático é armazenada dentro do arquivo `config/static.ts`.

```ts
import { defineConfig } from '@adonisjs/static'

const staticServerConfig = defineConfig({
  enabled: true,
  etag: true,
  lastModified: true,
  dotFiles: 'ignore',
})

export default staticServerConfig
```

### `enabled`

Habilite ou desabilite o middleware temporariamente sem removê-lo da pilha de middleware.

### `acceptRanges`

O cabeçalho `Accept-Range` permite que os navegadores retomem um download de arquivo interrompido em vez de tentar reiniciar o download. Você pode desabilitar downloads retomáveis ​​definindo `acceptsRanges` como `false`.

O padrão é `true`.

### `cacheControl`

Habilite ou desabilite o cabeçalho [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control). As propriedades `immutable` e `maxAge` serão ignoradas quando `cacheControl` estiver desabilitado.

```ts
{
  cacheControl: true
}
```

### `dotFiles`

Defina como tratar solicitações para arquivos dot dentro do diretório `public`. Você pode definir uma das seguintes opções.

- `allow`: Servir o arquivo dot da mesma forma que os outros arquivos.
- `deny`: Negar a solicitação com o código de status `403`.
- `ignore`: Fingir que o arquivo não existe e responder com um código de status `404`.

```ts
{
  dotFiles: 'ignore'
}
```

### `etag`

Habilitar ou desabilitar a geração de [etag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag).

```ts
{
  etag: true,
}
```

### `lastModified`

Habilite ou desabilite o cabeçalho [Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified). A propriedade do arquivo [stat.mtime](https://nodejs.org/api/fs.html#statsmtime) é usada como valor para o cabeçalho.

```ts
{
  lastModified: true,
}
```

### `immutable`

Habilite ou desabilite a diretiva [immutable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#immutable) para o cabeçalho `Cache-Control`. Por padrão, a propriedade `immutable` é desabilitada.

Se a propriedade `immutable` estiver habilitada, você deve definir a propriedade `maxAge` para habilitar o cache.

```ts
{
  immutable: true
}
```

### `maxAge`

Defina a diretiva [max-age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#max-age) para o cabeçalho `Cache-Control`. O valor deve estar em milissegundos ou uma string de expressão de tempo.

```ts
{
  maxAge: '30 mins'
}
```

### `headers`

Uma função que retorna um objeto de cabeçalhos para definir na resposta. A função recebe o caminho do arquivo como o primeiro argumento e o objeto [file stats](https://nodejs.org/api/fs.html#class-fsstats) como o segundo argumento.

```ts
{
  headers: (path, stats) => {
    if (path.endsWith('.mc2')) {
      return {
        'content-type': 'application/octet-stream'
      }
    }
  }
}
```

## Servindo arquivos estáticos

Depois que o middleware for registrado, você pode criar arquivos dentro do diretório `public` e acessá-los no navegador usando o caminho do arquivo. Por exemplo, o arquivo `./public/css/style.css` pode ser acessado usando a URL `http://localhost:3333/css/style.css`.

Os arquivos no diretório `public` não são compilados ou construídos usando um empacotador de ativos. Se você quiser compilar ativos de frontend, você deve colocá-los dentro do diretório `resources` e usar o [agrupador de ativos](../basics/vite.md).

## Copiando arquivos estáticos para a compilação de produção
Os arquivos estáticos armazenados dentro do diretório `/public` são automaticamente copiados para a pasta `build` quando você executa o comando `node ace build`.

A regra para copiar arquivos públicos é definida dentro do arquivo `adonisrc.ts`.

```ts
{
  metaFiles: [
    {
      pattern: 'public/**',
      reloadServer: false
    }
  ]
}
```
