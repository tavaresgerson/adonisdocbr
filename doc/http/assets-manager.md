# Gerenciando arquivos estáticos

AdonisJS faz uso do [webpack encore](https://www.npmjs.com/package/@symfony/webpack-encore) para compilar e servir os recursos de front-end. 
Webpack Encore é um invólucro no topo do [webpack](https://webpack.js.org/) para facilitar o trabalho com a configuração do Webpack.

> AdonisJS é um framework de back-end e não se preocupa diretamente com as ferramentas de construção de front-end.
> Você é livre para NÃO usar o Webpack Encore e configurar as ferramentas de construção de front-end sozinho, e 
> tudo ainda funcionará.

### Começando
A criação de um novo aplicativo AdonisJS também solicita que você configure o encore do webpack. No entanto, 
configurá-lo posteriormente também é relativamente simples. Basta executar o seguinte comando ace.

```bash
node ace configure encore
```

As seguintes ações são realizadas para configurar o encore do webpack:

1. Instale o pacote npm `@symfony/webpack-encore`.
2. Crie um arquivo `webpack.config.js` padrão.
3. Crie os arquivos `resources/js/app.js` e `resources/css/app.css` como o primeiro ponto de entrada para seu aplicativo front-end.
 
### Compilando recursos de front-end
Uma vez que o encore foi configurado, os comandos pré-existentes do AdonisJS irão detectá-lo e processar seus 
ativos de front-end como parte dos comandos a seguir.

```bash
node ace serve --watch
```

O comando `node ace serve --watch` também executará o servidor de desenvolvimento webpack dentro do mesmo processo 
para compilar e servir os ativos de front-end.

<p align="center">
  <img src="/assets/encore-dev-server.png" />
</p>

As linhas de log prefixadas com "encore" são do webpack-dev-server

#### node ace build --produção
Da mesma forma, o comando `node ace build --production` também executará o comando `encore production` para agrupar os 
recursos de front-end junto com sua construção AdonisJS.

<p align="center">
  <img src="/assets/node-ace-build-encore.png" />
</p>

#### Personalizando o diretório de saída
Por padrão, os ativos compilados são gravados no diretório `./public/assets` para que o servidor de arquivos estáticos AdonisJS possa atendê-los.

No entanto, você pode personalizar e definir qualquer diretório de saída atualizando o arquivo `webpack.config.js`.

O método `setOutputPath` aceita um caminho relativo à raiz do projeto. Além disso, certifique-se de atualizar o prefixo do URL 
público usando o método `setPublicPath`.

```js
// Grave o arquivo neste diretório
Encore.setOutputPath('./public/assets')

// Coloque o prefixo a seguir no URL de saída
Encore.setOutputPath('/assets')
```

#### Desativar compilação de ativos
Você pode desativar a compilação de ativos do webpack definindo o sinalizador `--no-assets` para os comando `serve` e `build`.

```bash
node ace serve --watch --no-assets
node ace build --productions --no-assets
```

#### Personalize a porta e o host do servidor de desenvolvimento
O servidor de desenvolvimento Webpack é executado por padrão em `localhost:8080`. Se a porta estiver em uso, o AdonisJS encontrará 
uma porta aleatória para iniciar o servidor de desenvolvimento do webpack. No entanto, você também pode definir uma porta personalizada 
usando o sinalizador `--encore-args`.

```bash
node ace serve --watch --encore-args="--port 5000"
```

A partir de agora, você não pode definir a porta para o servidor de desenvolvimento webpack dentro do arquivo `webpack.config.js`. 
Esta é a limitação imposta pelo pacote encore do symfony.

 Assistentes de visualização de ativos
Dependendo da configuração do seu webpack, os arquivos de saída podem não ser iguais aos do arquivo de entrada. Por exemplo, 
o método `Encore.enableVersioning()` anexa o hash do arquivo ao nome do arquivo de saída.

Portanto, é recomendável nunca codificar os nomes dos arquivos em seus modelos e sempre usar o auxiliar `asset`.

 ❌ Não recomendado
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="/assets/app.js"></script>
  <link rel="stylesheet" type="text/css" href="/assets/app.css">  
</head>
<body>
</body>
</html>
```

 ✅ Em vez disso, use o auxiliar `asset`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="{{ asset('assets/app.js') }}"></script>
  <link rel="stylesheet" type="text/css" href="{{ asset('assets/app.css') }}">  
</head>
<body>
</body>
</html>
```

O auxiliar `asset` depende do arquivo `manifest.json` gerado pelo encore para resolver a URL real. 
Você pode usá-lo para todos os ativos, incluindo JavaScript, CSS, fontes, imagens e assim por diante.

### Arquivo de manifesto
O Encore gera o arquivo `manifest.json` dentro do diretório `public/assets`. Este arquivo contém um par de valores-chave 
do identificador de arquivo e seu URL.

```json
{
  "assets/app.css": "http://localhost:8080/assets/app.css",
  "assets/app.js": "http://localhost:8080/assets/app.js"
}
```

O assistente `asset` de visualização resolve a URL desse arquivo por conta própria.

### Pontos de entrada
Cada pacote webpack sempre tem um ou mais pontos de entrada. Quaisquer outras importações dentro do arquivo de ponto de 
entrada fazem parte do mesmo pacote.

Por exemplo, se você registrou o arquivo `./resources/js/app.js` como um ponto de entrada com o conteúdo a seguir, todas 
as importações internas serão agrupadas para formar uma única saída.

```js
import '../css/app.css'
import 'normalize.css'
import 'alpinejs'
```

Você pode definir esses pontos de entrada dentro do arquivo `webpack.config.js` usando o método `Encore.addEntry`. O primeiro argumento é 
o nome do ponto de entrada e o segundo é o caminho para o arquivo do ponto de entrada.

```js
Encore.addEntry('app', './resources/js/app.js')
```

#### Múltiplos pontos de entrada
A maioria dos aplicativos precisa de um único ponto de entrada, a menos que você esteja construindo várias interfaces em 
uma única base de código. Por exemplo: a criação de um site público + um painel de administração pode exigir diferentes 
pontos de entrada, já que geralmente têm dependências de front-end e estilos diferentes.

Você pode definir vários pontos de entrada chamando o método `Encore.addEntry` várias vezes.

#### Pontos de entrada de referência dentro dos arquivos de modelo
Você pode usar as tags `@entryPointStyles` e `@entryPointScripts` para renderizar o script e as tags de estilo para um determinado ponto de entrada.

As tags produzirão o HTML com os atributos `href` e `src` corretos. O arquivo `./public/assets/entrypoints.json` é usado para pesquisar os URLs 
de um determinado ponto de entrada.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  @entryPointScripts('app')
  @entryPointStyles('app')
</head>
<body>
</body>
</html>
```

#### Configurar PostCSS
A primeira etapa é instalar o `postcss-loader` a partir do npm da seguinte maneira:

```bash
npm i -D postcss-loader
```

Em seguida, crie o arquivo `postcss.config.js` para configurar PostCSS.

```
// postcss.config.js

module.exports = {
  plugins: {}
}
```

E, finalmente, habilite o carregador `PostCSS` dentro do arquivo `webpack.config.js`.

```js
Encore.enablePostCssLoader()

// Passando opções
Encore.enablePostCssLoader((options) => {
  options.postcssOptions = {
    config: path.resolve(__dirname, 'custom.config.js')
  }
})
```

### Configurar SASS, Less e Stylus
Para configurar os pré-processadores CSS, você deve descomentar as seguintes linhas de código dentro do `webpack.config.js`

```
// Habilita o SASS
Encore.enableSassLoader()

// Habilita o Less
Encore.enableLessLoader()

// Habilita o Stylus
Encore.enableStylusLoader()
```

Além disso, certifique-se de instalar os carregadores apropriados para eles.

```bash
# Para SASS
npm i -D sass-loader

# Para Less
npm i -D less-loader

# Para Stylus
npm i -D stylus-loader
```

### Cópia e referência de imagens
O Webpack não pode digitalizar/processar automaticamente as imagens referenciadas dentro de um modelo edge. Portanto, você deve informar ao 
webpack com antecedência para copiar as imagens de um diretório específico.

Você pode usar o método `copyFiles` para copiar as imagens para a saída de construção.

```js
Encore.copyFiles({
  from: './resources/images',
  to: 'images/[path][name].[hash:8].[ext]',
})
```

Além disso, certifique-se de usar o auxiliar `asset` para fazer referência à imagem dentro de uma tag `img`.

```html
<img src="{{ asset('logo.png') }}" />
```

### Configurando o Babel
O Babel é pré-configurado para todos os arquivos com extensão `.js` e `.jsx` usando o [babel-loader](https://github.com/babel/babel-loader).

Você pode configurar ainda mais o babel usando o método `Encore.configureBabel`.

```js
// webpack.config.js

Encore.configureBabel((babelConfig) => {
  babelConfig.plugins.push('styled-jsx/babel')
  babelConfig.presets.push('@babel/preset-flow')
}, {
  exclude: /node_modules/
})
```

#### Configurando destinos de navegador
Você pode configurar os destinos do navegador para `@babel/preset-env` dentro do `package.json`.

```json
{
  "browserslist": [
    "> 0.5%",
    "last 2 versions",
    "Firefox ESR",
    "not dead"
  ]
}
```

#### Usando o arquivo `.babelrc`
Em vez de chamar `configureBabel()`, você também pode usar o arquivo `.babelrc` padrão. No entanto, essa abordagem tem uma 
desvantagem: assim que um arquivo `.babelrc` estiver presente, o Encore não poderá mais configurar o babel para você, e o 
`.babelrc` se tornará a única fonte da verdade.

### Configurando o React
Você pode configurar o React instalando a predefinição react para babel a partir do npm.

```bash
npm i -D @babel/preset-react
```

Em seguida, ative a predefinição de reação dentro do arquivo `webpack.config.js`.

Se você estiver usando o arquivo `.babelrc`, deve habilitar a predefinição react dentro dele, pois o Encore não pode mais configurar o babel.

```js
Encore.enableReactPreset()
```

### Configurando Vue
Você pode configurar o Vue habilitando primeiro o carregador do vue dentro do arquivo `webpack.config.js`.

#### Vue2
```js
Encore.enableVueLoader(() => {}, {
  version: 2
})
```

#### Vue3
```js
Encore.enableVueLoader(() => {}, {
  version: 3
})
```

Em seguida, instale as seguintes dependências necessárias para Vue2 ou Vue3.

##### Vue2
```bash
npm i vue vue-loader @vue/compiler-sfc
```
Vue3
```bash
npm i vue@next vue-loader@next @vue/compiler-sfc
```

Você pode definir as opções do [`vue-loader`](https://vue-loader.vuejs.org/options.html) passando um retorno de chamada para o método `enableVueLoader`.

```js
Encore.enableVueLoader((options) => {
  options.transformAssetUrls = {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: ['xlink:href', 'href'],
    use: ['xlink:href', 'href']
  }
})
```

As opções específicas do encore podem ser definidas como o terceiro argumento.

```
Encore.enableVueLoader(() => {}, {
  version: 3,
  runtimeCompilerBuild: false,
  useJsx: true
})
```

#### versão
A versão do VueJS a ser usada. Você pode optar entre `vue2` e `vue3`.

### runtimeCompilerBuild
Você deve desabilitar a construção do compilador de tempo de execução ao usar componentes de arquivo único e não deseja 
usar os modelos baseados em string.

#### useJsx
Ative/desative o suporte para JSX dentro de seus modelos Vue.

1. Você não pode ativar a opção com Vue3.
2. Além disso, você precisa instalar as dependencias `@vue/babel-preset-jsx` e `@vue/babel-helper-vue-jsx-merge-props` ao usar JSX.

### Adicionar carregadores de pacotes da web personalizados
O Encore faz um bom trabalho ao encapsular a configuração para os casos de uso mais comuns. Ele também permite que você configure 
carregadores personalizados usando o método `addLoader`.

```js
Encore
  .addLoader({
      test: /\.handlebars$/,
      loader: 'cson',
  })
```

Da mesma forma, você também pode adicionar plug-ins usando o método `addPlugin`.

```js
const NpmInstallPlugin = require('npm-install-webpack-plugin')
Encore.addPlugin(new NpmInstallPlugin())
```
