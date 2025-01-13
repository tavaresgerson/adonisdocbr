---
summary: Aprenda a analisar corpos de solicitação usando o middleware BodyParser.
---

# Middleware do analisador de corpo

Os dados da solicitação são analisados ​​usando o middleware `BodyParser` registrado dentro do arquivo `start/kernel.ts`.

A configuração do middleware é armazenada dentro do arquivo `config/bodyparser.ts`. Neste arquivo, você pode configurar analisadores para analisar **payloads JSON**, **formulários multipartes com uploads de arquivo** e **formulários codificados por URL**.

- [Lendo corpo da solicitação](./request.md#request-body)
- [Uploads de arquivo](./file_uploads.md)

```ts
import { defineConfig } from '@adonisjs/core/bodyparser'

export const defineConfig({
  allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],

  form: {
    // configurações para analisar formulários HTML
  },

  json: {
    // Configurações para analisar corpo JSON
  },

  multipart: {
    // Configurações para analisador multipartes
  },

  raw: {
    // Configurações para um analisador de texto bruto
  },
})
```

## Métodos permitidos

Você pode definir uma matriz de `allowedMethods` para os quais o middleware bodyparser deve tentar analisar o corpo da solicitação. Por padrão, os seguintes métodos são configurados. No entanto, sinta-se à vontade para remover ou adicionar novos métodos.

```ts
{
  allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
}
```

## Convertendo strings vazias para nulas

Formulários HTML enviam uma string vazia no corpo da solicitação quando um campo de entrada não tem valor. Esse comportamento de formulários HTML dificulta a normalização de dados na camada do banco de dados.

Por exemplo, se você tiver uma coluna de banco de dados `country` definida como anulável, você desejará armazenar `null` como um valor dentro desta coluna quando o usuário não selecionar um país.

No entanto, com formulários HTML, o backend recebe uma string vazia, e você pode inserir uma string vazia no banco de dados em vez de deixar a coluna como `null`.

O middleware `BodyParser` pode lidar com essa inconsistência convertendo todos os valores de string vazia para `null` quando o sinalizador `convertEmptyStringsToNull` estiver habilitado dentro da configuração.

```ts
{
  form: {
    // ... resto da configuração
    convertEmptyStringsToNull: true
  },

  json: {
    // ... resto da configuração
    convertEmptyStringsToNull: true
  },

  multipart: {
    // ... resto da configuração
    convertEmptyStringsToNull: true
  }
}
```

## Analisador JSON

O analisador JSON é usado para analisar o corpo da solicitação definido como uma string codificada JSON com o cabeçalho `Content-type` correspondendo a um dos valores `types` predefinidos.

```ts
json: {
  encoding: 'utf-8',
  limit: '1mb',
  strict: true,
  types: [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
  ],
  convertEmptyStringsToNull: true,
}
```

### `encoding`

A codificação a ser usada ao converter o Buffer do corpo da solicitação em uma string. Provavelmente, você deseja usar `utf-8`. No entanto, você pode usar qualquer codificação suportada pelo [pacote iconv-lite](https://www.npmjs.com/package/iconv-lite#readme).

### `limit`

O limite máximo de dados do corpo da solicitação que o analisador deve permitir. Um erro `413` será retornado se o corpo da solicitação exceder o limite configurado.

### `strict`

A análise estrita permite apenas `objects` e `arrays` no nível superior de uma string codificada em JSON.

### `types`

Uma matriz de valores para o cabeçalho `Content-type` deve ser analisada usando o analisador JSON.

## Analisador de formulário codificado em URL

O analisador `form` é usado para analisar strings codificadas em URL com o cabeçalho `Content-type` definido como `application/x-www-form-urlencoded`. Em outras palavras, os dados dos formulários HTML são analisados ​​usando o analisador `form`.

```ts
form: {
  encoding: 'utf-8',
  limit: '1mb',
  queryString: {},
  types: ['application/x-www-form-urlencoded'],
  convertEmptyStringsToNull: true,
}
```

### `encoding`

A codificação a ser usada ao converter o Buffer do corpo da solicitação em uma string. Provavelmente, você deseja usar `utf-8`. No entanto, você pode usar qualquer codificação suportada pelo [pacote iconv-lite](https://www.npmjs.com/package/iconv-lite#readme).

### `limit`

O limite máximo de dados do corpo da solicitação que o analisador deve permitir. Um erro `413` será retornado se o corpo da solicitação exceder o limite configurado.

### `queryString`

O corpo da solicitação codificado em URL é analisado usando o [pacote qs](https://www.npmjs.com/package/qs). Você pode definir as opções para o pacote usando a propriedade `queryString`.

```ts
  form: {
    queryString: {
      allowDots: true,
      allowSparse: true,
    },
  }
```

## Analisador multipartes

O analisador `multipartes` é usado para analisar solicitações de formulário HTML com uploads de arquivo.

Veja também: [Uploads de arquivo](./file_uploads.md)

```ts
multipart: {
  autoProcess: true,
  processManually: [],
  encoding: 'utf-8',
  fieldsLimit: '2mb',
  limit: '20mb',
  types: ['multipart/form-data'],
  convertEmptyStringsToNull: true,
}
```

### `autoProcess`

Habilitar `autoProcess` moverá todos os arquivos enviados pelo usuário para o diretório `tmp` do seu sistema operacional.

Mais tarde, dentro dos controladores, você pode validar os arquivos e movê-los para um local persistente ou um serviço de nuvem.

Se você desabilitar o sinalizador `autoProcess`, terá que processar manualmente o fluxo e ler arquivos/campos do corpo da solicitação. Veja também: [Fluxo multipartes de autoprocessamento](./file_uploads.md#self-processing-multipart-stream).

Você pode definir uma matriz de rotas para as quais processar automaticamente os arquivos. Os valores **devem ser um padrão de rota** e não a URL.

```ts
{
  autoProcess: [
    '/uploads',
    '/post/:id'
  ]
}
```

### `processManually`

A matriz `processManually` permite que você desative o processamento automático de arquivos para rotas selecionadas. Os valores **devem ser um padrão de rota** e não a URL.

```ts
multipart: {
  autoProcess: true,
  processManually: [
    '/file_manager',
    '/projects/:id/assets'
  ],
}
```

### `encoding`

A codificação a ser usada ao converter o Buffer do corpo da solicitação em uma string. Provavelmente, você deseja usar `utf-8`. No entanto, você pode usar qualquer codificação suportada pelo [pacote iconv-lite](https://www.npmjs.com/package/iconv-lite#readme).

### `limit`

O limite máximo de bytes a serem permitidos ao processar todos os arquivos. Você pode definir o limite de tamanho de arquivo individual usando o método [request.file](./file_uploads.md).

### `fieldsLimit`

O limite máximo de bytes a serem permitidos para os campos (não arquivos) ao processar a solicitação multipart. Um erro `413` será retornado se o tamanho do campo exceder o limite configurado.
