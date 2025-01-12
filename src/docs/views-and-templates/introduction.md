---
summary: Opções disponíveis para renderizar visualizações e modelos no AdonisJS
---

# Visualizações e modelos

O AdonisJS é uma excelente opção para criar aplicativos tradicionais renderizados por servidor no Node.js. Se você gosta da simplicidade de usar um mecanismo de modelo de backend que gera HTML sem nenhuma sobrecarga de Virtual DOM e ferramentas de construção, então este guia é para você.

O fluxo de trabalho típico de um aplicativo renderizado por servidor no AdonisJS é o seguinte.

* Escolha um mecanismo de modelo para renderizar HTML dinamicamente.
[Vite](../basics/vite.md) para agrupar CSS e JavaScript de frontend.
[HTMX](https://htmx.org/) ou

:::note
A equipe principal do AdonisJS criou um mecanismo de modelo independente de framework chamado [Edge.js](https://edgejs.dev), mas não o força a usá-lo. Você pode usar qualquer outro mecanismo de modelo que desejar dentro de um aplicativo AdonisJS.
:::

## Opções populares

A seguir está a lista de mecanismos de modelo populares que você pode usar dentro de um aplicativo AdonisJS (assim como qualquer outro aplicativo Node.js).

[**EdgeJS**](https://edgejs.dev) é um mecanismo de modelo simples, moderno e com baterias incluídas, criado e mantido pela equipe principal do AdonisJS para Node.js.
[**Pug**](https://pugjs.org) é um mecanismo de modelo fortemente influenciado por Haml.
[**Nunjucks**](https://mozilla.github.io/nunjucks) é um mecanismo de modelo rico em recursos inspirado no Jinja2.

## Aplicativos híbridos

O AdonisJS também é uma ótima opção para criar aplicativos híbridos que renderizam HTML no servidor e, em seguida, hidratam seu JavaScript no cliente. Essa abordagem é popular entre desenvolvedores que querem usar `Vue`, `React`, `Svelte`, `Solid` ou outros para construir interfaces de usuário interativas, mas ainda querem uma pilha de backend completa para lidar com preocupações do lado do servidor.

Nesse caso, o AdonisJS fornece um suporte de primeira classe para usar [InertiaJS](./inertia.md) para preencher a lacuna entre seu frontend e backend.
