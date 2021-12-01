# url
Valida o valor a ser formatado como uma string de URL válida.

```ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

{
  website: schema.string({}, [
    rules.url()
  ])
}
```

Junto com a validação do formato, você também pode impor que o url seja de um determinado domínio. Por exemplo:

```ts
{
  twitterProfile: schema.string({}, [
    rules.url({
      // Somente urls twitter.com são permitidas
      allowedHosts: ['twitter.com']
    })
  ])
}
```

O inverso de `allowedHosts` é o `bannedHosts`.

```ts
{
  website: schema.string({}, [
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
A seguir está a lista de opções para validar uma string de URL

```ts
{
  website: schema.string({}, [
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

| Opção             | Descrição |
|-------------------|-----------|
| protocols         | Uma série de protocolos permitidos ("http", "https" ou "ftp"). A definição de protocolos configurará implicitamente a opção `requireProtocol` para `true`. |
| `requireTld`      | Certifique-se de que o tld esteja presente no URL. Padrão é `true` |
| `requireProtocol` |	Certifique-se de que o URL tenha o protocolo definido. Padrões é `false` |
| `requireHost`     | Certifique-se de que o URL tenha o host definido. Padrão é `true` |
| `allowedHosts`    | Uma matriz de hosts permitidos. URLs fora dos hosts definidos falharão na validação.  |
| `bannedHosts`     | Uma série de hosts banidos. Os URLs correspondentes aos hosts definidos não passarão na validação.  |
| `validateLength`  | Valide o comprimento do URL como menor ou igual a 2.083 caracteres. O padrão é `true`.  |

## Opções de normalização
A seguir está a lista de opções disponíveis para normalizar a validação de postagem do valor de URL.

```ts
{
  website: schema.string({}, [
    rules.url({
      ensureProtocol: 'https',
      stripWWW: true,
    })
  ])
}
```

| Opção             | Descrição |
|-------------------|-----------|
| `ensureProtocol`  | A propriedade garante que a validação de postagem de URL tenha o protocolo `https` |
| `stripWWW`        | Retira o `www` da URL |
