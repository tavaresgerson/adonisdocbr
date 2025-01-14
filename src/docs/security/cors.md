---
summary: Aprenda a implementar CORS no AdonisJS para proteger seu aplicativo.
---

# CORS

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) ajuda você a proteger seu aplicativo de solicitações maliciosas acionadas usando scripts em um ambiente de navegador.

Por exemplo, se uma solicitação AJAX ou de busca for enviada ao seu servidor de um domínio diferente, o navegador bloqueará essa solicitação com um erro CORS e esperará que você implemente uma política CORS se achar que a solicitação deve ser permitida.

No AdonisJS, você pode implementar a política CORS usando o pacote `@adonisjs/cors`. O pacote é fornecido com um middleware HTTP que intercepta solicitações de entrada e responde com cabeçalhos CORS corretos.

## Instalação

Instale e configure o pacote usando o seguinte comando:

```sh
node ace add @adonisjs/cors
```

::: details Veja os passos realizados pelo comando add

1. Instala o pacote `@adonisjs/cors` usando o gerenciador de pacotes detectado.

2. Registra o seguinte provedor de serviços dentro do arquivo `adonisrc.ts`.

    ```ts
    {
      providers: [
        // ...other providers
        () => import('@adonisjs/cors/cors_provider')
      ]
    }
    ```

3. Cria o arquivo `config/cors.ts`. Este arquivo contém as definições de configuração para CORS.

4. Registra o seguinte middleware dentro do arquivo `start/kernel.ts`.

    ```ts
    server.use([
      () => import('@adonisjs/cors/cors_middleware')
    ])
    ```

:::

## Configuração

A configuração do middleware CORS é armazenada dentro do arquivo `config/cors.ts`.

```ts
import { defineConfig } from '@adonisjs/cors'

const corsConfig = defineConfig({
  enabled: true,
  origin: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
```

### `enabled`

Ative ou desative o middleware temporariamente sem removê-lo da pilha de middleware.

### `origin`

A propriedade `origin` controla o valor do cabeçalho [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin).

Você pode permitir a origem atual da solicitação definindo o valor como `true` ou proibir a origem atual da solicitação definindo-o como `false`.

```ts
{
  origin: true
}
```

Você pode especificar uma lista de origens codificadas para permitir uma matriz de nomes de domínio.

```ts
{
  origin: ['adonisjs.com']
}
```

Use a expressão curinga `*` para permitir todas as origens. Leia a [documentação do MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin#directives) para entender como a expressão curinga funciona.

Quando a propriedade `credentials` é definida como `true`, faremos automaticamente a expressão curinga se comportar como um `boolean (true)`.

```ts
{
  origin: '*'
}
```

Você pode calcular o valor `origin` durante a solicitação HTTP usando uma função. Por exemplo:

```ts
{
  origin: (requestOrigin, ctx) => {
    return true
  }
}
```

### `methods`

A propriedade `methods` controla o método a ser permitido durante a solicitação de pré-voo. O valor do cabeçalho [Access-Control-Request-Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method) é verificado em relação aos métodos permitidos.

```sh
{
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE']
}
```

### `headers`

A propriedade `headers` controla os cabeçalhos de solicitação a serem permitidos durante a solicitação de pré-voo. O valor do cabeçalho [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers) é verificado em relação à propriedade headers.

Definir o valor como `true` permitirá todos os cabeçalhos. Enquanto definir o valor como `false` não permitirá todos os cabeçalhos.

```ts
{
  headers: true
}
```

Você pode especificar uma lista de cabeçalhos para permitir definindo-os como uma matriz de strings.

```ts
{
  headers: [
    'Content-Type',
    'Accept',
    'Cookie'
  ]
}
```

Você pode calcular o valor de configuração `headers` usando uma função durante a solicitação HTTP. Por exemplo:

```ts
{
  headers: (requestHeaders, ctx) => {
    return true
  }
}
```

### `exposeHeaders`

A propriedade `exposeHeaders` controla os cabeçalhos a serem expostos via [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) cabeçalho durante a solicitação de pré-voo.

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

### `credentials`

A propriedade `credentials` controla se o cabeçalho [Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) deve ser definido durante a solicitação de pré-voo.

```ts
{
  credentials: true
}
```

### `maxAge`

A propriedade `maxAge` controla o cabeçalho de resposta [Access-Control-Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age). O valor está em segundos.

- Definir o valor como `null` não definirá o cabeçalho.
- Enquanto defini-lo como `-1 `define o cabeçalho, mas desabilita o cache.

```ts
{
  maxAge: 90
}
```

## Depurando erros de CORS
Depurar problemas de CORS é uma experiência desafiadora. No entanto, não há atalhos além de entender as regras do CORS e depurar os cabeçalhos de resposta para garantir que tudo esteja no lugar.

A seguir estão alguns links para os artigos que você pode ler para entender melhor como o CORS funciona.

[Como depurar qualquer erro de CORS](https://httptoolkit.com/blog/how-to-debug-cors-errors/)
[Será que é CORS?](https://httptoolkit.com/will-it-cors/)
[Explicação detalhada do MDN sobre CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
