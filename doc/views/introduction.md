# Introdução
A camada Visualizações do AdonisJS é alimentada por um mecanismo de modelo desenvolvido internamente chamado [Edge](https://github.com/edge-js/edge). 
O Edge é um mecanismo de modelo lógico e com recursos incluídos para Node.js. Ele pode processar qualquer formato baseado em texto, seja HTML, 
Markdown ou arquivos de texto simples.

Criamos o Edge como uma alternativa a outros mecanismos de modelo existentes e abordamos os pontos fracos que tínhamos com eles.

### Edge vs Pug
Ao contrário do Pug, não reinventamos a maneira como você escreve o HTML. Na verdade, o Edge nem mesmo está vinculado ao HTML em primeiro 
lugar, pois ele pode processar qualquer arquivo baseado em texto.

Exemplo em PUG:
```pug
h1= title
p Written with love by #{author}
p This will be safe: #{theGreat}
```

Exemplo em Edge:
```edge
<h1> {{ title }} </h1>
<p> Written with love by {{ author }} </p>
<p> This will be safe: {{ theGreat }} </p>
```

### Edge vs Nunjucks
Ao contrário do Nunjucks, Edge parece escrever JavaScript e não Python. O Edge tem uma pequena curva de aprendizado, 
é mais rápido de digitar e oferece suporte a todas as expressões JavaScript.

Exemplo do Nunjucks:
```nunjucks
{% if happy and hungry %}
  I am happy *and* hungry; both are true.
{% endif %}

{{ "true" if foo else "false" }}
```

Exemplo em Edge:
```edge
@if(happy && hungry)
  I am happy *and* hungry; both are true.
@endif

{{ foo ? "true" : "false" }}
```

### Edge vs Handlebars
Ao contrário do handlebars, o Edge não é restritivo por natureza. Você pode usar qualquer expressão JavaScript dentro 
de seus modelos e nós os analisamos usando um analisador JavaScript compatível com as especificações.

Já no Handlebars, você deve definir ajudantes personalizados para cada pequena coisa. A história fica ainda pior 
quando usamos vários ajudantes juntos.

Exemplo em Handlebars:
```handlebars
Handlebars.registerHelper('upperCase', function (aString) {
  return aString.toUpperCase()
})

{{upperCase lastname}}
```


Visto que o Edge mantém os recursos nativos de JavaScript, veja esse exemplo:

```edge
{{ lastname.toUpperCase() }}
```

### Configurar
O Edge vem pré-configurado com o modelo inicial `web`. No entanto, instalar e configurar também é relativamente simples.

Abra o arquivo `.adonisrc.json` e verifique se `@adonisjs/view` está mencionado no array de `providers`. Caso NÃO, continue 
com as seguintes etapas:

```bash
npm i @adonisjs/view
```

Execute o seguinte comando `ace` para configurar o pacote.

```bash
node ace configure @adonisjs/view

# UPDATE: .env { "CACHE_VIEWS = false" }
# UPDATE: .adonisrc.json { providers += "@adonisjs/view" }
# UPDATE: .adonisrc.json { metaFiles += "resources/views/**/*.edge" }
```

### Exemplo básico
Vamos começar criando uma rota que renderiza um determinado arquivo de modelo.

```ts
// start/routes.ts

Route.get('/', async ({ view }) => {
  return view.render('home')
})
```

A próxima etapa é criar o modelo `home.edge`. Você pode criar manualmente um arquivo dentro da pasta de views ou usar 
o seguinte comando ace para criar um.

```bash
node ace make:view home

# CREATE: resources/views/home.edge
```

Vamos abrir o arquivo recém-criado e colar o seguinte trecho de código dentro dele.

```html
<!-- resources/views/home.edge -->

<p> Hello world. You are viewing the {{ request.url() }} page </p>
```

Certifique-se de iniciar o servidor de desenvolvimento executando `node ace serve --watch` e visite `http://localhost:3333` para 
visualizar o conteúdo do arquivo de modelo.

<p align="center">
  <img src="/assets/view-usage.png" />
</p>

### Diretório de visualizações
O AdonisJS registra o `resources/views` como o diretório padrão para localizar os modelos do Edge. No entanto, você pode 
registrar um caminho personalizado modificando o arquivo `.adonisrc.json`.

Após a seguinte alteração, o Edge encontrará modelos dentro do diretório `./app/views`.

Leia o guia de renderização para aprender mais sobre como registrar vários diretórios.

```json
{
  "directories": {
    "views": "./app/views"
  }
}
```

Além disso, certifique-se de atualizar a matriz `metaFiles` no mesmo arquivo para informar ao `@adonisjs/assembler` a fim de copiar os modelos 
ao criar a compilação de produção.

```json
{
  "metaFiles": [
    {
      "pattern": "resources/views/**/*.edge",
      "pattern": "app/views/**/*.edge",
      "reloadServer": false
    }
  ],  
}
```

### Extensões do editor
As extensões de highlight de sintaxe estão disponíveis para os seguintes editores.

* [VSCode](https://marketplace.visualstudio.com/items?itemName=luongnd.edge)
* [Sublim Text](https://github.com/edge-js/edge-sublime)
* [Atom](https://github.com/edge-js/edge-atom-syntax)
* [Vim](https://github.com/watzon/vim-edge-template)
