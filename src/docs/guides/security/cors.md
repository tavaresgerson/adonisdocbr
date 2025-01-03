# CORS

O suporte a [Compartilhamento de Recursos de Origem Cruzada](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) está incorporado ao núcleo do framework e, portanto, não há necessidade de instalar nenhum pacote adicional.

Certifique-se de que o CORS esteja habilitado dentro do arquivo `config/cors.ts` definindo a propriedade `enabled` como true.

::: info NOTA
Se o arquivo de configuração estiver faltando, crie um novo manualmente e copie/cole o conteúdo do [stub do CORS](https://github.com/adonisjs/core/blob/develop/templates/config/cors.txt).
:::

```ts
// config/cors.ts

{
  "enabled": true
}
```

## Origem permitida
Você pode controlar as origens para permitir a solicitação do CORS usando a propriedade `origin`. Esta propriedade controla o cabeçalho [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin).

#### Valor booleano
Definir o valor como `true` permitirá qualquer origem. Enquanto definir o valor como `false` não permitirá nenhuma origem.

```ts
{
  origin: true
}
```

#### String ou array de origens
Você pode permitir uma ou mais origens definindo-as como uma string ou um array de strings.

```ts
{
  origin: 'adonisjs.com',
}

// ou
{
  origin: ['adonisjs.com']
}
```

#### Curinga
Defina o valor de `Access-Control-Allow-Origin` como um curinga.

```ts
{
  origin: '*'
}
```

#### Função
Você também pode definir uma função como o valor para a propriedade `origin` para decidir qual origem permitir ou não em tempo de execução.

O método recebe a origem atual como o único argumento e deve retornar um **booleano**, um **curinga** ou uma **string/matriz de origens permitidas**.

```ts
const ALLOWED_ORIGINS = []

{
  origin: (requestOrigin: string) => {
    return ALLOWED_ORIGINS.includes(requestOrigin)
  }
}
```

## Métodos permitidos
A propriedade `methods` controla o método a ser permitido durante a solicitação de pré-voo. O valor do cabeçalho [Access-Control-Request-Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method) é verificado em relação aos métodos permitidos.

```ts
{
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE']
}
```

## Cabeçalhos permitidos
A propriedade `headers` controla os cabeçalhos a serem permitidos durante a solicitação de pré-voo. O valor do cabeçalho [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers) é verificado em relação à propriedade `headers`.

#### Valor booleano
Definir o valor como `true` permitirá todos os cabeçalhos. Enquanto definir o valor como `false` não permitirá todos os cabeçalhos.

```ts
{
  headers: true
}
```

#### String ou array de cabeçalhos
Você pode permitir um ou mais cabeçalhos definindo-os como uma string ou um array de strings.

```ts
{
  headers: [
    'Content-Type',
    'Accept',
    'Cookie'
  ]
}
```

#### Função
Você também pode definir uma função como o valor para a propriedade `headers` para decidir quais cabeçalhos permitir ou não em tempo de execução.

O método recebe o valor do cabeçalho atual como o único argumento e deve retornar um **booleano** ou uma **string/matriz de origens permitidas**.

```ts
const ALLOWED_HEADERS = []

{
  headers: (requestHeaders: string) => {
    return ALLOWED_ORIGINS.includes(requestHeaders)
  }
}
```

## Cabeçalhos expostos
A propriedade `exposeHeaders` controla os cabeçalhos a serem expostos via cabeçalho [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) durante a solicitação de pré-voo.

```ts
{
  exposeHeaders: [
    'cache-control',
    'content-language',
    'content-type',
    'expires',
    'last-modified',
    'pragma',
  ]
}
```

## Permitir credenciais
A propriedade `credentials` controla se o cabeçalho [Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) deve ou não ser definido durante a solicitação de pré-voo.

```ts
{
  credentials: true
}
```

## Idade máxima
A propriedade `maxAge` controla o cabeçalho de resposta [Access-Control-Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age). **O valor está em segundos**.

- Definir o valor como `null` não definirá o cabeçalho.
- Ao passo que defini-lo como `-1` define o cabeçalho, mas desabilita o cache.

```ts
{
  maxAge: 90
}
```
