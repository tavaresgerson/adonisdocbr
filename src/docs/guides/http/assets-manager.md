# Gerenciador de ativos

O AdonisJS faz uso do [Webpack Encore](https://www.npmjs.com/package/@symfony/webpack-encore) para compilar e servir os ativos do front-end. O Webpack Encore é um wrapper sobre o [Webpack](https://webpack.js.org/) para facilitar o trabalho com a configuração do Webpack.

::: info NOTA
O AdonisJS é um framework de back-end e não se preocupa diretamente com as ferramentas de construção do front-end.

Você é livre para NÃO usar o Webpack Encore e configurar as ferramentas de construção do front-end você mesmo, e tudo continuará funcionando.
:::

## Começando

A criação de um novo aplicativo AdonisJS também solicita que você configure o Webpack Encore. No entanto, configurá-lo depois também é relativamente simples. Basta executar o seguinte comando Ace.

```sh
node ace configure encore
```

As seguintes ações são executadas para configurar o Webpack Encore:

- Instale o pacote npm `‌@symfony/webpack-encore`.
- Crie um arquivo `webpack.config.js` padrão.
- Crie os arquivos `resources/js/app.js` e `resources/css/app.css` como o primeiro ponto de entrada para seu aplicativo frontend.

## Compilando ativos frontend

Depois que o Encore for configurado, os comandos pré-existentes do AdonisJS o detectarão e processarão seus ativos frontend como parte dos seguintes comandos.

#### node ace serve --watch

O comando `node ace serve --watch` também executará o [servidor de desenvolvimento Webpack](https://github.com/webpack/webpack-dev-server) dentro do mesmo processo para compilar e servir os ativos frontend.

![](/docs/assets/encore-dev-server.webp)

#### node ace build --production

Da mesma forma, o comando `node ace build --production` também executará o comando `encore production` para agrupar os ativos de frontend junto com sua compilação do AdonisJS.

![](/docs/assets/node-ace-build-encore.webp)

### Personalizando o diretório de saída

Por padrão, os ativos compilados são gravados no diretório `./public/assets` para que o servidor de arquivos estáticos do AdonisJS possa servi-los.

No entanto, você pode personalizar e definir qualquer diretório de saída atualizando o arquivo `webpack.config.js`.

O método `setOutputPath` aceita um caminho relativo à raiz do projeto. Além disso, certifique-se de atualizar o prefixo de URL pública usando o método `setPublicPath`.

```ts
// Grave o arquivo neste diretório
Encore.setOutputPath('./public/assets')

// Prefixe o seguinte para a URL de saída
Encore.setPublicPath('/assets')
```

### Desabilitar compilação de ativos

Você pode desabilitar a compilação de ativos do Webpack definindo o sinalizador `--no-assets` para os comandos `serve` e `build`.

```sh
node ace serve --watch --no-assets
node ace build --productions --no-assets
```

## Personalizar porta e host do servidor de desenvolvimento
O servidor de desenvolvimento do Webpack é executado em `localhost:8080` por padrão. Se a porta estiver em uso, o AdonisJS encontrará uma porta aleatória para iniciar o servidor de desenvolvimento do Webpack. No entanto, você também pode definir uma porta personalizada usando o sinalizador `--encore-args`.

```sh
node ace serve --watch --encore-args="--port 5000"
```

A partir de agora, você não pode definir a porta para o servidor de desenvolvimento do Webpack dentro do arquivo `webpack.config.js`. Esta é a limitação imposta pelo [pacote Symfony Encore](https://github.com/symfony/webpack-encore/issues/941#issuecomment-787568811).

## Auxiliares de visualização de ativos

Dependendo da configuração do seu Webpack, os arquivos de saída podem não ter o mesmo nome do arquivo de entrada. Por exemplo, o método `Encore.enableVersioning()` anexa o hash do arquivo ao nome do arquivo de saída.

Portanto, é recomendável nunca codificar os nomes dos arquivos em seus modelos e sempre usar o auxiliar `asset`.

::: danger ERRO
Não faça referência a arquivos pelo nome
:::

```edge
<!DOCTYPE html>
<html lang="en">
<head>
    // highlight-start
  <script src="/assets/app.js"></script>
  <link rel="stylesheet" type="text/css" href="/assets/app.css">  
    // highlight-end
</head>
<body>
</body>
</html>
```

::: tip SUCESSO
Use o auxiliar `asset`
:::

```edge
<!DOCTYPE html>
<html lang="en">
<head>
  // highlight-start
  <script src="{{ asset('assets/app.js') }}"></script>
  <link rel="stylesheet" type="text/css" href="{{ asset('assets/app.css') }}">  
    // highlight-end
</head>
<body>
</body>
</html>
```

O auxiliar `asset` depende do arquivo `manifest.json` gerado pelo Encore para resolver a URL real. Você pode usá-lo para todos os ativos, incluindo JavaScript, CSS, fontes, imagens e assim por diante.

## Arquivo manifesto

O Encore gera o arquivo `manifest.json` dentro do diretório `public/assets`. Este arquivo contém um par chave-valor do identificador do arquivo e sua URL.

```json
{
  "assets/app.css": "http://localhost:8080/assets/app.css",
  "assets/app.js": "http://localhost:8080/assets/app.js"
}
```

O auxiliar de visualização `asset` resolve a URL deste arquivo em si.

## Pontos de entrada

Cada pacote Webpack sempre tem um ou mais [pontos de entrada](https://webpack.js.org/guides/code-splitting/#entry-points). Quaisquer outras importações dentro do arquivo de ponto de entrada são parte do mesmo pacote.

Por exemplo, se você registrou o arquivo `./resources/js/app.js` como um ponto de entrada com o seguinte conteúdo, todas as importações internas serão agrupadas para formar uma única saída.

```ts
import '../css/app.css'
import 'normalize.css'
import 'alpinejs'
```

Você pode definir esses pontos de entrada dentro do arquivo `webpack.config.js` usando o método `Encore.addEntry`. O primeiro argumento é o nome do ponto de entrada e o segundo é o caminho para o arquivo do ponto de entrada.

```ts
Encore.addEntry('app', './resources/js/app.js')
```

### Vários pontos de entrada

A maioria dos aplicativos precisa de um único ponto de entrada, a menos que você esteja construindo várias interfaces em uma única base de código. Por exemplo: criar um site público + um painel de administração pode exigir diferentes pontos de entrada, pois eles geralmente terão diferentes dependências de frontend e estilo.

Você pode definir vários pontos de entrada chamando o método `Encore.addEntry` várias vezes.

### Pontos de entrada de referência dentro dos arquivos de modelo

Você pode usar as tags `@entryPointStyles` e `@entryPointScripts` para renderizar o script e as tags de estilo para um determinado ponto de entrada.

As tags produzirão o HTML com os atributos `href` e `src` corretos. O arquivo `./public/assets/entrypoints.json` é usado para procurar as URLs para um determinado ponto de entrada.

```edge
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

## Configurar PostCSS

O primeiro passo é instalar o [postcss-loader](https://github.com/postcss/postcss-loader) do registro npm da seguinte forma:

```sh
npm i -D postcss-loader
```

Em seguida, crie o arquivo `postcss.config.js` para configurar o PostCSS.

```ts
// postcss.config.js

module.exports = {
  plugins: {}
}
```

E, finalmente, habilite o carregador PostCSS dentro do arquivo `webpack.config.js`.

```ts
Encore.enablePostCssLoader()

// Opções de passagem
Encore.enablePostCssLoader((options) => {
  options.postcssOptions = {
    config: path.resolve(__dirname, 'custom.config.js')
  }
})
```

## Configurar SASS, Less e Stylus

Para configurar os pré-processadores CSS, você deve descomentar as seguintes linhas de código dentro de `webpack.config.js`

```ts
// Habilita SASS
Encore.enableSassLoader()

// Habilita Less
Encore.enableLessLoader()

// Habilita Stylus
Encore.enableStylusLoader()
```

Além disso, certifique-se de instalar os carregadores apropriados para eles.

```sh
# Para SASS
npm i -D sass-loader sass

# Para Less
npm i -D less-loader less

# Para Stylus
npm i -D stylus-loader stylus
```

## Copiando e referenciando imagens
O Webpack não pode escanear/processar automaticamente as imagens referenciadas dentro de um modelo Edge. Portanto, você precisa informar ao Webpack com antecedência para copiar as imagens de um diretório específico.

Você pode usar o método `copyFiles` para copiar as imagens para a saída da compilação.

```ts
Encore.copyFiles({
  from: './resources/images',
  to: 'images/[path][name].[hash:8].[ext]',
})
```

Além disso, certifique-se de usar o auxiliar `asset` para referenciar a imagem dentro de uma tag `img`.

```edge
<img src="{{ asset('assets/images/logo.png') }}" />
```

## Configurando o Babel

O Babel é pré-configurado para todos os arquivos com extensões `.js` e `.jsx` usando [babel-loader](https://github.com/babel/babel-loader).

Você pode configurar ainda mais o Babel usando o método `Encore.configureBabel`.

```ts
// webpack.config.js

Encore.configureBabel((babelConfig) => {
  babelConfig.plugins.push('styled-jsx/babel')
  babelConfig.presets.push('@babel/preset-flow')
}, {
  exclude: /node_modules/
})
```

### Configurando alvos do navegador

Você pode configurar os alvos do navegador para [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) dentro do `package.json`.

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

### Usando o arquivo `.babelrc`

Em vez de chamar `configureBabel()`, você também pode usar o arquivo padrão `.babelrc`. No entanto, essa abordagem tem uma desvantagem: assim que um arquivo `.babelrc` estiver presente, o Encore não poderá mais configurar o Babel para você, e o arquivo `.babelrc` se tornará a única fonte de verdade.

## Configurando o React

Você pode configurar o React instalando a predefinição do React para o Babel a partir do registro npm.

```sh
npm i -D @babel/preset-react
```

Em seguida, habilite a predefinição do React dentro do arquivo `webpack.config.js`.

```ts
Encore.enableReactPreset()
```

::: warning ATENÇÃO
Se estiver usando o arquivo `.babelrc`, você deve habilitar a predefinição do React dentro dele, pois o Encore não pode mais configurar o Babel.

:::

## Configurando o Vue
Você pode configurar o Vue primeiro habilitando o carregador do Vue dentro do arquivo `webpack.config.js`.

::: code-group

```ts [Vue 2]
Encore.enableVueLoader(() => {}, {
  version: 2
})
```

```ts [Vue 3]
Encore.enableVueLoader(() => {}, {
  version: 3
})
```

:::

Em seguida, instale as seguintes dependências necessárias para Vue 2 ou Vue 3.

::: code-group

```sh [Vue 2]
npm i vue vue-loader @vue/compiler-sfc
```

```sh [Vue 3]
npm i vue@next vue-loader@next @vue/compiler-sfc
```

:::

Você pode definir as [opções do vue-loader](https://vue-loader.vuejs.org/options.html) passando um retorno de chamada para o método `enableVueLoader`.

```ts
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

As opções específicas do Encore podem ser definidas como o terceiro argumento.

```ts
Encore.enableVueLoader(() => {}, {
  version: 3,
  runtimeCompilerBuild: false,
  useJsx: true
})
```

#### `version`
A versão do VueJS a ser usada. Você pode optar entre `2` e `3`.

#### `runtimeCompilerBuild`
Você deve desabilitar a construção do compilador de tempo de execução ao usar componentes de arquivo único e não quiser usar os modelos baseados em string.

#### `useJsx`
Habilite/desabilite o suporte para JSX dentro dos seus modelos Vue.

- Você não pode habilitar a opção com Vue3.
- Além disso, você precisa instalar as dependências `@vue/babel-preset-jsx` e `@vue/babel-helper-vue-jsx-merge-props` ao usar JSX.

## Adicionando carregadores Webpack personalizados
O Encore faz um bom trabalho ao encapsular a configuração para os casos de uso mais comuns. Ele também permite que você configure carregadores personalizados usando o método `addLoader`.

```ts
Encore
  .addLoader({
      test: /\.handlebars$/,
      loader: 'cson',
  })
```

Da mesma forma, você também pode adicionar plugins usando o método `addPlugin`.

```ts
const NpmInstallPlugin = require('npm-install-webpack-plugin')
Encore.addPlugin(new NpmInstallPlugin())
```
