# `route` / `signedRoute`

O assistente de rota permite que você [gere URLs](../../../guides/http/routing.md#url-generation) para rotas pré-registradas usando seu `name` ou a referência `controller.method`.

```edge
<form
  action="{{ route('PostsController.store') }}"
  method="POST"
>
</form>
```

## Parâmetros de rota

Você pode passar parâmetros de rota como o segundo argumento. Pode ser uma matriz posicional de valores ou um objeto de par chave-valor. A `key` é o nome do parâmetro de rota.

```ts
import Route from '@ioc:Adonis/Core/Route'

Route.put('posts/:id', 'PostsController.update')
```

```edge
<form
  action="{{ route('PostsController.update', [1]) }}"
  method="POST"
>
</form>
```

Exemplo de parâmetros de rota como um objeto.

```edge
<form
  action="{{ route('PostsController.update', { id: 1 }) }}"
  method="POST"
>
</form>
```

## Opções
O assistente `route` também aceita opções adicionais para anexar a sequência de consulta, prefixar uma URL ou procurar uma rota dentro de um domínio específico.

### Sequência de consulta
Você pode definir a sequência de consulta como um objeto usando a propriedade `qs`.

```edge
<form
  action="{{
    route('PostsController.update', { id: 1 }, {
      qs: {
        _method: 'PUT' {{-- 👈 --}}
      }
    })
  }}"
  method="POST"
>
</form>
```

### Pesquisa dentro de um domínio
Você também pode executar a pesquisa de rota dentro de um domínio específico. Por exemplo:

```ts
import Route from '@ioc:Adonis/Core/Route'

Route
  .group(() => {
    Route.get('/posts/:id', 'PostsController.show')
  })
  .domain(':tenant.adonisjs.com')
```

```edge
<a href="{{
  route('PostsController.show', [1], {
    domain: ':tenant.adonisjs.com'
  })
}}"> View post </a>
```

### Prefixo de URL
As URLs criadas pelo auxiliar `route` são sempre relativas à raiz do domínio. Se necessário, você pode prefixar manualmente uma URL.

```edge
<a href="{{
  route('PostsController.show', [1], {
    domain: ':tenant.adonisjs.com',
    prefixUrl: 'https://news.adonisjs.com'
  })
}}"> View post </a>
```

## Rotas assinadas
O auxiliar `signedRoute` é semelhante ao auxiliar de rota, em vez disso, ele cria uma [URL assinada](../../../guides/security/signed-urls.md).

Os auxiliares aceitam as seguintes opções adicionais.

```edge
{{
  signedRoute('OnboardingController.verifyEmail', [user.email], {
    expiresIn: '30mins',
    purpose: 'verifyEmail'
  })
}}
```
