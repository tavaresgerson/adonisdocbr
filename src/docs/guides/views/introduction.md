# Introdução

A camada Views do AdonisJS é alimentada por um mecanismo de modelo interno chamado [Edge](https://github.com/edge-js/edge). O Edge é um mecanismo de modelo lógico e com baterias incluídas para Node.js. Ele pode renderizar qualquer formato baseado em texto, seja **HTML**, **Markdown** ou arquivos de **texto simples**.

Criamos o Edge como uma alternativa a outros mecanismos de modelo existentes e abordamos os pontos problemáticos com eles.

::: tip DICA
Você prefere usar um framework de frontend como React, Vue ou Svelte? Você pode usá-los com [InertiaJS](https://inertiajs.com/).

Confira a série Adocasts sobre [AdonisJS + InertiaJS](https://adocasts.com/series/adonisjs-inertiajs).
:::

## Edge vs. Pug

Ao contrário do Pug, não reinventamos a maneira como você escreve o HTML. O Edge nem mesmo está vinculado ao HTML em primeiro lugar, e pode renderizar qualquer arquivo baseado em texto.

<div class="fancy-codeblock">

```pug
h1= title
p Written with love by #{author}
p This will be safe: #{theGreat}
```

<span class="title"> Pug </span>

</div>

<div class="fancy-codeblock">

```edge
<h1> {{ title }} </h1>
<p> Written with love by {{ author }} </p>
<p> This will be safe: {{ theGreat }} </p>
```

<span class="title"> Edge </span>

</div>

## Edge vs. Nunjucks

Ao contrário do Nunjucks, o Edge parece escrever JavaScript e não Python. Como resultado, o Edge tem uma pequena curva de aprendizado, é mais rápido de digitar e suporta todas as expressões JavaScript.

<div class="fancy-codeblock">

```txt
{% if happy and hungry %}
  I am happy *and* hungry; both are true.
{% endif %}

{{ "true" if foo else "false" }}
```

<span class="title"> Nunjucks </span>

</div>

<div class="fancy-codeblock">

```edge
@if(happy && hungry)
  I am happy *and* hungry; both are true.
@endif

{{ foo ? "true" : "false" }}
```

<span class="title"> Edge </span>

</div>

## Edge vs. Handlebars

Ao contrário do Handlebars, o Edge não é restritivo. Por exemplo, você pode usar qualquer expressão JavaScript dentro de seus modelos, e nós os analisamos usando um analisador JavaScript compatível com as especificações.

Enquanto no Handlebars, você tem que definir ajudantes personalizados para cada pequena coisa. A história fica ainda pior quando se usa vários ajudantes juntos.

```js
Handlebars.registerHelper('upperCase', function (aString) {
  return aString.toUpperCase()
})
```

<div class="fancy-codeblock">

```hbs
{{upperCase lastname}}
```

<span class="title"> Handlebars </span>

</div>

Em comparação com o Handlebars, o Edge dobra os recursos nativos do JavaScript.

<div class="fancy-codeblock">

```edge
{{ lastname.toUpperCase() }}
```

<span class="title"> Edge </span>

</div>

## Configuração

O Edge vem pré-configurado com o modelo inicial `web`. No entanto, instalá-lo e configurá-lo também é relativamente simples.

Abra o arquivo `.adonisrc.json` e verifique se `@adonisjs/view` é mencionado dentro da lista de array `providers`. **SE NÃO, continue com as seguintes etapas:**

```sh
npm i @adonisjs/view
```

Execute o seguinte comando `ace` para configurar o pacote.

```sh
node ace configure @adonisjs/view

# UPDATE: .env { "CACHE_VIEWS = false" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/view" }
# UPDATE: .adonisrc.json { metaFiles += "resources/views/**/*.edge" }
```

## Exemplo básico

Vamos começar criando uma rota que renderiza um arquivo de modelo fornecido.

```ts
// start/routes.ts

Route.get('/', async ({ view }) => {
  return view.render('home')
})
```

O próximo passo é criar o modelo `home.edge`. Você pode criar manualmente um arquivo dentro da pasta views ou usar o seguinte comando Ace para criar um.

```sh
node ace make:view home

# CREATE: resources/views/home.edge
```

Vamos abrir o arquivo recém-criado e colar o seguinte trecho de código dentro dele.

```edge
<!-- resources/views/home.edge -->

<p> Hello world. You are viewing the {{ request.url() }} page </p>
```

Certifique-se de iniciar o servidor de desenvolvimento executando `node ace serve --watch` e visite http://localhost:3333 para visualizar o conteúdo do arquivo de modelo.

![](/docs/assets/view-usage.webp)

## Diretório Views

O AdonisJS registra `resources/views` como o diretório padrão para encontrar os modelos Edge. No entanto, você pode registrar um caminho personalizado modificando o arquivo `.adonisrc.json`.

Após a alteração a seguir, o Edge encontrará modelos dentro do diretório `./app/views`.

::: info NOTA
Leia o guia [rendering](./rendering.md#disks) para saber mais sobre como registrar vários diretórios.
:::

```json
{
  "directories": {
    "views": "./app/views"
  }
}
```

Além disso, certifique-se de atualizar o array `metaFiles` no mesmo arquivo para informar `@adonisjs/assembler` para copiar os modelos ao criar a compilação de produção.

```json
{
  "metaFiles": [
    {
      "pattern": "resources/views/**/*.edge", // [!code --]
      "pattern": "app/views/**/*.edge", // [!code ++]
      "reloadServer": false
    }
  ],  
}
```

## Extensões do editor

As extensões de realce de sintaxe estão disponíveis para os seguintes editores.

- [VsCode](https://marketplace.visualstudio.com/items?itemName=luongnd.edge)
- [Sublime Text](https://github.com/edge-js/edge-sublime)
- [Atom](https://github.com/edge-js/edge-atom-syntax)
- [Vim](https://github.com/watzon/vim-edge-template)
