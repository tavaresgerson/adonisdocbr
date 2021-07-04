# Fluxo de dados
O Edge expõe diferentes APIs para compartilhar os dados com os templates. Cada API altera o escopo em que os dados 
estão disponíveis nos modelos.

### Estado do template
O estado do template é representado como um objeto que você pode passar enquanto renderiza a visualização. Por exemplo:

```ts
const state = {
  user: { id: 1, username: 'virk' },
}

await view.render('user', state)
```

O estado do template está disponível para ser renderizado e também seus parciais e o layout que ele usa. Em outras palavras, o 
estado do modelo não é compartilhado com os componentes.

### Globais
Globais estão disponíveis para todos os templates, incluindo os componentes. Você geralmente os usará para compartilhar 
auxiliares ou os metadados do aplicativo.

Você pode registrar um global usando o método `View.global`. Você pode escrever o código a seguir em um arquivo pré-carregado ou 
em um método de inicialização no provedor de serviços.

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
 Uso
Copiar para área de transferência
<p> {{{ nl2br(post.description) }}} </p>

@each(item in menu)
  <a href="{{ item.url }}"> {{ item.text }} </a>
@end
```

### Local
Os locais são como os globais para uma determinada instância do renderizador de visualização. Você pode compartilhar 
locais usando o método `view.share`.

Você geralmente se pegará usando o método `view.share` dentro do middleware para compartilhar os dados com o modelo.

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

### Variáveis inline
Finalmente, você também pode definir variáveis inline nos arquivos de modelo usando a tag `@set`.

```
@set('title', 'Edge - A template engine for Node.js')

<title> {{ title }} </title>
```

As variáveis inlines têm o mesmo escopo que você define uma variável em JavaScript. Por exemplo: Se a variável 
é definida dentro de cada bloco, você não pode acessá-la fora de cada bloco.

```edge
@each(item in cart)
  @set('price', item.quantity * item.unitPrice)
  {{ price }}
@end

{{ price }} {{-- undefined --}}
```
