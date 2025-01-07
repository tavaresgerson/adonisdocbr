# Todos os outros auxiliares

A seguir está a lista de todos os outros auxiliares de visualização disponíveis.

### `app`
Referência à instância [Application](../../../guides/fundamentals/application.md).

```edge
@if(app.nodeEnvironment === 'development')
  Print some debug log
@endif
```

### `env`
Referência ao método [Env.get](../../../guides/fundamentals/environment-variables.md#access-environment-variables).

```edge
{{ env('APP_URL') }}
```

### `config`
Referência ao método [Config.get](../../../guides/fundamentals/config.md#using-the-config-provider).

```edge
{{ config('app.appKey') }}
```

### `asset`
O auxiliar `asset` retorna o caminho para um [ativos frontend compilados](../../../guides/http/assets-manager.md#assets-view-helpers) fazendo uma pesquisa dentro do arquivo `manifest.json`.

```edge
<script src="{{ asset('assets/app.js') }}"></script>

<link
  rel="stylesheet"
  type="text/css"
  href="{{ asset('assets/app.css') }}"
> 
```

### `assetsManager`
Os auxiliares `assetsManager` são uma referência à instância da [classe AssetsManager](https://github.com/adonisjs/core/blob/develop/src/AssetsManager/index.ts#L29).

Você dificilmente dependerá do gerenciador de ativos diretamente, pois o auxiliar `asset` e as tags `@entryPointStyles` e `@entryPointScripts` permitem que você faça referência aos ativos dentro de seus modelos.

### `csrfToken`
Retorna o valor do token CSRF. O auxiliar só está disponível quando o `@adonisjs/shield` está instalado e configurado.

```edge
<input type="hidden" value="{{ csrfToken }}" name="_csrf">
```

### `csrfMeta`
Retorna uma meta tag com o token csrf como conteúdo. O auxiliar só está disponível quando o `@adonisjs/shield` está instalado e configurado.

```edge
<head>
  {{ csrfMeta() }}
</head>
```

### `csrfField`
Retorna o elemento de entrada oculto para o token CSRF. O auxiliar só está disponível quando o `@adonisjs/shield` está instalado e configurado.

```edge
<form method="POST" action="posts">
  {{ csrfField() }}
</form>
```

### `cspNonce`
Retorna o valor para o `nonce` a ser usado com tags de script inline. Certifique-se de ler a [seção CSP](../../../guides/security/web-security.md#csp-nonce) no guia de segurança da web. O auxiliar só está disponível quando o `@adonisjs/shield` está instalado e configurado.

```edge
<script nonce="{{ cspNonce }}">
</script>
```

### `request`
Referência à instância [ctx.request](../../../guides/http/request.md). Você pode usá-lo para acessar a URL atual.

```edge
<a href="{{ route('UsersController.index') }}" class="{{ (request.matchesRoute('namedRoute')) ? 'link-active' : 'link-inactive' }}">
  Users
</a>
```

### `auth`
Referência à instância [ctx.auth](../../../guides/auth/introduction.md#usage). Você pode usá-lo para exibir a parte específica da sua marcação condicionalmente.

Este auxiliar só está disponível ao usar o pacote `@adonisjs/auth`.

```edge
@if(auth.isLoggedIn)
  <p> Hello {{ auth.user.username }} </p>
@endif
```

### `bouncer`
Referência à instância [ctx.bouncer](../../../guides/digging-deeper/authorization.md#basic-example). Você pode usar as tags [@can/@cannot](../tags/can.md) para exibir condicionalmente a marcação dentro dos seus modelos.

Este auxiliar só está disponível ao usar o pacote `@adonisjs/bouncer`.

```edge
@if(await bouncer.allows('editPost'))
  <a href="/posts/1/edit"> Edit post </a>
@end
```

### `i18n`
Uma instância de `i18n` para o local padrão é compartilhada com os modelos como uma propriedade global.

No entanto, o middleware [DetectUserLocale](https://github.com/adonisjs/i18n/blob/develop/templates/DetectUserLocale.txt#L47) substitui essa propriedade e compartilha uma instância específica de solicitação para a localidade do usuário atual.

```edge
{{ i18n.locale }}
{{ i18n.formatNumber(100) }}
```

### `t`
O auxiliar `t` é um alias para o método `i18n.formatMessage`.

```edge
{{ t('messages.title') }}
```

### `getDefaultLocale`
Retorna a localidade padrão para o aplicativo.

```edge
{{ getDefaultLocale() }}
```

### `getSupportedLocales`
Retorna uma matriz das localidades suportadas.

```edge
{{ getSupportedLocales() }}
```
