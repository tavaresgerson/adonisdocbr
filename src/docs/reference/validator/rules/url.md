# url

Valida o valor a ser formatado como uma sequência de caracteres de URL válida.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  website: schema.string([
    rules.url()
  ])
}
```

Junto com a validação do formato, você também pode **impor que a URL seja de um determinado domínio**. Por exemplo:

```ts
{
  twitterProfile: schema.string([
    rules.url({
      // Somente URLs do twitter.com são permitidas
      allowedHosts: ['twitter.com']
    })
  ])
}
```

O inverso de `allowedHosts` é o `bannedHosts`.

```ts
{
  website: schema.string([
    rules.url({
      bannedHosts: [
        'acme.com',
        'example.com'
      ]
    })
  ])
}
```

## Opções de validação

A seguir está a lista de opções para validar uma sequência de caracteres de URL

```ts
{
  website: schema.string([
    rules.url({
      protocols: ['http', 'https', 'ftp'],
      requireTld: true,
      requireProtocol: false,
      requireHost: true,
      allowedHosts: [],
      bannedHosts: [],
      validateLength: false
    })
  ])
}
```

| Opção             | Descrição         |
|-------------------|-------------------|
| `protocols`       | Uma matriz de protocolos permitidos ("http", "https" ou "ftp"). Definir protocolos definirá implicitamente a opção `requireProtocol` como `true`. |
| `requireTld`      | Garanta que o tld esteja presente na URL. O padrão é `true` |
| `requireProtocol` | Garanta que a URL tenha o protocolo definido. O padrão é `false` |
| `requireHost`     | Garanta que a URL tenha o host definido. O padrão é `true` |
| `allowedHosts`    | Uma matriz de hosts permitidos. URLs fora dos hosts definidos falharão na validação. |
| `bannedHosts`     | Uma matriz de hosts banidos. URLs que correspondem aos hosts definidos falharão na validação. |
| `validateLength`  | Valide o comprimento da URL para ser menor ou igual a **2083 caracteres**. O padrão é `true`. |

## Normalizando url
Você pode normalizar a URL usando o método `rules.normalizeUrl`.

```ts
{
  website: schema.string([
    rules.url(),
    rules.normalizeUrl({
      ensureProtocol: 'https',
      stripWWW: true,
    })
  ])
}
```

| Opção   | Descrição |
|--------|-------------|
| `ensureProtocol`  | A propriedade garante que a validação da postagem da URL tenha o protocolo `https` |
| `stripWWW`        | Remove o `www` da URL |
