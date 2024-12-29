# Gerenciando ativos frontend

O AdonisJs não faz nenhuma suposição, nem fornece ferramentas sobre como agrupar seus ativos frontend. O objetivo da estrutura é fornecer um fluxo de trabalho produtivo apenas para aplicativos backend.

Enquanto, nesta receita, discutimos algumas maneiras de como você pode gerenciar e agrupar seu código frontend.

## Webpack
Existem tantas ferramentas de construção no ecossistema frontend que é muito fácil se sentir sobrecarregado. No entanto, [webpack](https://webpack.js.org/concepts/) *(até agora)* gerencia tudo graciosamente e é a escolha popular para muitos desenvolvedores.

Vamos ver como armazenar seus ativos e, em seguida, agrupá-los.

### Estrutura de diretório
```bash
└── resources
    └── assets
        └── sass
        └── scripts
        └── images
```

Devemos manter todos os `source assets` dentro do diretório `resources`. Este diretório já é usado pelo Adonis para armazenar as visualizações.

Todos os ativos compilados deste diretório são colocados dentro do diretório `public`.

### Configuração base do Webpack
Primeiro, certifique-se de instalar o Webpack como uma dependência dev e crie o arquivo de configuração.

```bash
npm i --save-dev webpack webpack-cli

touch webpack.config.js
```

```js
// .webpack.config.js

module.exports = {
}
```

Execute `./node_modules/.bin/webpack` para construir seus arquivos.

- Use o sinalizador `--mode` para escolher entre produção e desenvolvimento.
- Para iniciar o observador, use o sinalizador `--watch`.

exemplo
```bash
./node_modules/.bin/webpack --mode development
```

## Configuração do Sass

```bash
npm i --save-dev style-loader css-loader extract-text-webpack-plugin@next node-sass sass-loader
```

Adicione o código a seguir ao seu arquivo webpack.config.js.

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: 'public/app.css'
})

function sassRules () {
  return [
    {
      test: /\.(sass|scss)$/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
    }
  ]
}

module.exports = {
  entry: [
    './resources/assets/sass/app.scss'
  ],
  output: {
    filename: 'public/app.js'
  },
  module: {
    rules: sassRules()
  },
  plugins: [
    extractSass
  ]
}
```

Aqui usamos `sass-loader` e algumas dependências relacionadas para compilar `resources/assets/sass/app.scss -> public/app.css`.

Requer arquivo css dos modelos `edge`.

```edge
<head>
  {{ style('/public/app') }}
</head>
```

## Configuração de scripts
A configuração de scripts é feita para agrupar seu JavaScript frontend em um único arquivo. Presumo que você queira compilar o código para ES5 para atingir todos os principais navegadores.

::: info NOTA
Usamos babel para transpilação de ES6 para ES5. Além disso, *o próprio AdonisJs não precisa do babel*, ele é apenas para o JavaScript que você está escrevendo para o navegador.
:::

```bash
npm i --save-dev babel-loader @babel/core @babel/preset-env
```

```js
function scriptRules () {
  return [
    {
      test: /\.js$/,
      exclude: [/node_modules/],
      loader: 'babel-loader',
      options: { presets: ['env'] }
    }
  ]
}

module.exports = {
  entry: [
    './resources/assets/sass/app.scss',
    './resources/assets/scripts/app.js'
  ],
  output: {
    filename: 'public/app.js'
  },
  module: {
    rules: sassRules().concat(scriptRules())
  },
  plugins: [
    extractSass
  ]
}
```

Desta vez, compilamos `resources/assets/scripts/app.js -> public/app.js`

Requer arquivo js dos modelos `edge`.

```edge
<head>
  {{ script('/public/app') }}
</head>
```
