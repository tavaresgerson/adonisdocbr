---
resumo: Aprenda sobre os auxiliares e tags contribuídos pelos pacotes oficiais do AdonisJS para o mecanismo de modelagem do Edge.
---

# Auxiliares e tags do Edge

Neste guia, aprenderemos sobre os **auxiliares e as tags** contribuídos para o Edge pelos pacotes oficiais do AdonisJS. Os auxiliares enviados com o Edge não são abordados neste guia e devem fazer referência à documentação do [Edge](https://edgejs.dev/docs/helpers) para o mesmo.

## `request`
Referência à instância da [solicitação HTTP](../basics/request.md) em andamento. A propriedade só está disponível quando um modelo é renderizado usando o método `ctx.view.render`.

```edge
{{ request.url() }}
{{ request.input('signature') }}
```

## `route` / `signedRoute`
Funções auxiliares para criar URL para uma rota usando o [construtor de URL](../basics/routing.md#url-builder). Ao contrário do construtor de URL, os auxiliares de visualização não têm uma API fluente e aceitam os seguintes parâmetros.

<table>
<tr>
<td>Posição</td>
<td>Descrição</td>
</tr>
<tr>
<td>1st</td>
<td>O identificador de rota ou o padrão de rota</td>
</tr>
<tr>
<td>2nd</td>
<td>Os parâmetros de rota são definidos como uma matriz ou um objeto.</td>
</tr>
<tr>
<td>3rd</td>
<td>
<p>O objeto options com as seguintes propriedades.</p>
<ul>
<li><code>qs</code>: Defina parâmetros de string de consulta como um objeto.</li>
<li><code>domain</code>: Pesquise rotas em um domínio específico.</li>
<li><code>prefixUrl</code>: Prefixe uma URL para a saída.</li>
<li><code>disableRouteLookup</code>: Habilita/desabilita a pesquisa de rotas.</li>
</ul>
</td>
</tr>
</table>

```edge
<a href="{{ route('posts.show', [post.id]) }}">
  View post
</a>
```

```edge
<a href="{{
  signedRoute('unsubscribe', [user.id], {
    expiresIn: '3 days',
    prefixUrl: 'https://blog.adonisjs.com'    
  })
}}">
 Unsubscribe
</a>
```

## `app`
Referência à [instância do aplicativo](../concepts/application.md).

```edge
{{ app.getEnvironment() }}
```

## `config`
Uma [função auxiliar](../getting_started/configuration.md#reading-config-inside-edge-templates) para referenciar valores de configuração dentro de modelos do Edge. Você pode usar o método `config.has` para verificar se o valor de uma chave existe.

```edge
@if(config.has('app.appUrl'))
  <a href="{{ config('app.appUrl') }}"> Home </a>
@else
  <a href="/"> Home </a>
@end
```

## `session`
Uma cópia somente leitura do [objeto de sessão](../basics/session.md#reading-and-writing-data). Você não pode alterar dados de sessão dentro de modelos do Edge. A propriedade `session` só está disponível quando o modelo é renderizado usando o método `ctx.view.render`.

```edge
Post views: {{ session.get(`post.${post.id}.visits`) }}
```

## `flashMessages`
Uma cópia somente leitura de [session flash messages](../basics/session.md#flash-messages). A propriedade `flashMessages` só está disponível quando o modelo é renderizado usando o método `ctx.view.render`.

```edge
@if(flashMessages.has('inputErrorsBag.title'))
  <p>{{ flashMessages.get('inputErrorsBag.title') }}</p>
@end

@if(flashMessages.has('notification'))
  <div class="notification {{ flashMessages.get('notification').type }}">
    {{ flashMessages.get('notification').message }}
  </div>
@end
```

## `old`
O método `old` é uma abreviação para o método `flashMessages.get`.

```edge
<input
  type="text"
  name="email"
  value="{{ old('name') || '' }}"
/>
```

## `t`
O método `t` é contribuído pelo pacote `@adonisjs/i18n` para exibir traduções usando a [classe i18n](../digging_deeper/i18n.md#resolving-translations). O método aceita o identificador da chave de tradução, dados da mensagem e uma mensagem de fallback como parâmetros.

```edge
<h1> {{ t('messages.greeting') }} </h1>
```

## `i18n`
Referência a uma instância da classe I18n configurada usando o locale padrão do aplicativo. No entanto, o [`DetectUserLocaleMiddleware`](../digging_deeper/i18n.md#detecting-user-locale-during-an-http-request) substitui essa propriedade por uma instância criada para o locale atual da solicitação HTTP.

```edge
{{ i18n.formatCurrency(200, { currency: 'USD' }) }}
```

## `auth`
Referência à propriedade [ctx.auth](../concepts/http_context.md#http-context-properties) compartilhada pelo [InitializeAuthMiddleware](https://github.com/adonisjs/auth/blob/main/src/auth/middleware/initialize_auth_middleware.ts#L14). Você pode usar esta propriedade para acessar informações sobre o usuário conectado.

```edge
@if(auth.isAuthenticated)
  <p> {{ auth.user.email }} </p>
@end
```

Se você estiver exibindo as informações do usuário conectado em uma página pública (não protegida pelo middleware auth), talvez você queira primeiro verificar silenciosamente se o usuário está conectado ou não.

```edge
{{-- Check if user is logged-in --}}
@eval(await auth.use('web').check())

@if(auth.use('web').isAuthenticated)
  <p> {{ auth.use('web').user.email }} </p>
@end
```

## `asset`
Resolva a URL de um ativo processado pelo Vite. Saiba mais sobre [referenciar ativos dentro de modelos Edge](../basics/vite.md#referencing-assets-inside-edge-templates).

```edge
<img src="{{ asset('resources/images/hero.jpg') }}" />
```

## `embedImage` / `embedImageData`
Os auxiliares `embedImage` e `embedImageData` são adicionados pelo pacote [mail](../digging_deeper/mail.md#embedding-images) e estão disponíveis somente ao renderizar um modelo para enviar um e-mail.

```edge
<img src="{{
  embedImage(app.makePath('assets/hero.jpg'))
}}" />
```

## `@flashMessage`
A tag `@flashMessage` fornece um DX melhor para ler mensagens flash para uma determinada chave condicionalmente.

::: danger **Em vez de escrever condicionais**
```edge
@if(flashMessages.has('notification'))
  <div class="notification {{ flashMessages.get('notification').type }}">
    {{ flashMessages.get('notification').message }}
  </div>
@end
```
:::

::: tip **Você pode preferir usar a tag**
```edge
@flashMessage('notification')
  <div class="notification {{ $message.type }}">
    {{ $message.message }}
  </div>
@end
```
:::

## `@error`
A tag `@error` fornece um DX melhor para ler mensagens de erro armazenadas dentro da chave `errorsBag` em `flashMessages`.

::: danger **Em vez de escrever condicionais**
```edge
@if(flashMessages.has('errorsBag.E_BAD_CSRF_TOKEN'))
  <p>{{ flashMessages.get('errorsBag.E_BAD_CSRF_TOKEN') }}</p>
@end
```
:::

::: tip **Você pode preferir usar a tag**
```edge
@error('E_BAD_CSRF_TOKEN')
  <p>{{ $message }}</p>
@end
```
:::

## `@inputError`
A tag `@inputError` fornece um DX melhor para ler mensagens de erro de validação armazenadas dentro da chave `inputErrorsBag` em `flashMessages`.

::: danger **Em vez de escrever condicionais**
```edge
@if(flashMessages.has('inputErrorsBag.title'))
  @each(message in flashMessages.get('inputErrorsBag.title'))
    <p>{{ message }}</p>
  @end
@end
```
:::

::: tip **Você pode preferir usar a tag**
```edge
@inputError('title')
  @each(message in $messages)
    <p>{{ message }}</p>
  @end
@end
```
:::

## `@vite`
A tag `@vite` aceita uma matriz de caminhos de ponto de entrada e retorna as tags `script` e `link` para o mesmo. O caminho que você fornece para a tag `@vite` deve corresponder exatamente ao caminho registrado dentro do arquivo `vite.config.js`.

```ts {4}
export default defineConfig({
  plugins: [
    adonisjs({
      entrypoints: ['resources/js/app.js'],
    }),
  ]
})
```

```edge
@vite(['resources/js/app.js'])
```

Você pode definir os atributos da tag script como o segundo argumento. Por exemplo:

```edge
@vite(['resources/js/app.js'], {
  defer: true,
})
```

## `@viteReactRefresh`
A tag `@viteReactRefresh` retorna uma [tag de script para habilitar o React HMR](https://vitejs.dev/guide/backend-integration.html#:~:text=you%27ll%20also%20need%20to%20add%20this%20before%20the%20above%20scripts) para o projeto usando o pacote [@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react).

```edge
@viteReactRefresh()
```

HTML de saída

```html
<script type="module">
  import RefreshRuntime from 'http://localhost:5173/@react-refresh'
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
```

## `@can` / `@cannot`
As tags `@can` e `@cannot` permitem que você escreva verificações de autorização em modelos do Edge referenciando o nome da habilidade ou o nome da política como uma string.

O primeiro argumento é a habilidade ou a referência da política seguida pelos argumentos aceitos pela verificação.

Veja também: [Pré-registro de habilidades e políticas](../security/authorization.md#pre-registering-abilities-and-policies)

```edge
@can('editPost', post)
  {{-- Pode editar a postagem --}}
@end

@can('PostPolicy.edit', post)
  {{-- Pode editar a postagem --}}
@end
```

```edge
@cannot('editPost', post)
  {{-- Não pode editar a postagem --}}
@end

@cannot('editPost', post)
  {{-- Não pode editar a postagem --}}
@end
```
