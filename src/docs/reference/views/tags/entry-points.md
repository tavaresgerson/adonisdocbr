# entryPoints

As tags `@entryPointScripts` e `@entryPointStyles` renderizam os elementos `script` e `link` necessários para um determinado ponto de entrada.

- Ambas são tags inline
- Elas aceitam o nome do ponto de entrada definido dentro do arquivo `webpack.config.js`.

::: info NOTA
Certifique-se de ler o guia [assets manager](../../../guides/http/assets-manager.md) para saber mais sobre pontos de entrada.
:::

```edge
<!-- Renders scripts -->
@entryPointScripts('app')

<!-- Renders styles -->
@entryPointStyles('app')
```

Você pode controlar os atributos dos elementos script e link modificando os objetos `assets.script.attributes` e `assets.style.attributes` dentro do arquivo `config/app.ts`.

```ts {6-8,12}
export const assets: AssetsManagerConfig = {
  driver: 'encore',
  publicPath: Application.publicPath('assets'),

  script: {
    attributes: {
      defer: true,
    },
  },

  style: {
    attributes: {},
  },
}
```
