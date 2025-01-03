# Fluxo de dados

O Edge expõe diferentes APIs para compartilhar os dados com os modelos. Cada API altera o escopo no qual os dados estão disponíveis dentro dos modelos.

## Estado do modelo

O estado do modelo é representado como um objeto que você pode passar ao renderizar a visualização. Por exemplo:

```ts
const state = {
  user: { id: 1, username: 'virk' },
}

await view.render('user', state)
```

O estado do modelo está disponível para o modelo renderizado, seus parciais e o layout que ele usa. Em outras palavras, o estado do modelo não é compartilhado com os componentes.

## Globais

Os globais estão disponíveis para todos os modelos, incluindo os componentes. Você normalmente os usará para compartilhar auxiliares ou metadados em todo o aplicativo.

Você pode registrar um global usando o método `View.global`. Por exemplo, você pode escrever o seguinte código dentro de um [arquivo pré-carregado](../fundamentals/adonisrc-file.md#preloads) ou um método de inicialização do provedor de serviços.

```ts
// start/view.ts

import View from '@ioc:Adonis/Core/View'

View.global('nl2br', function (text) {
  return text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2')
})

View.global('menu', [
  {
    url: '/',
    text: 'Home',
  },
  {
    url: '/about',
    text: 'About',
  },
  {
    url: '/contact',
    text: 'Contact',
  },
])
```

#### Uso

```edge
<p> {{{ nl2br(post.description) }}} </p>

@each(item in menu)
  <a href="{{ item.url }}"> {{ item.text }} </a>
@end
```

## Locais

Os locais são como globais para uma determinada instância do [View renderer](./rendering.md#view-renderer). Você pode compartilhar locais usando o método `view.share`.

Você geralmente usará o método `view.share` dentro do middleware para compartilhar os dados com o modelo.

```ts
Route
  .get('/', ({ view }) => {
    await view.render('home')
  })
  .middleware(({ view }, next) => {
    view.share({
      foo: 'bar'
    })
    
    return next()
  })
```

## Variáveis ​​inline

Finalmente, você também pode definir variáveis ​​inline dentro dos arquivos de modelo usando a tag `@set`.

```edge
@set('title', 'Edge - A template engine for Node.js')

<title> {{ title }} </title>
```

As variáveis ​​inline têm o mesmo escopo que você define uma variável em JavaScript. Por exemplo: se a variável for definida dentro do bloco each, você não poderá acessá-la fora do bloco each.

```edge
@each(item in cart)
  @set('price', item.quantity * item.unitPrice)
  {{ price }}
@end

{{ price }} {{-- undefined --}}
```
