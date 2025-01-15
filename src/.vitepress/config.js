import sidebar from "./sidebar";

export default {
  title: 'Adonis 6',
  description: 'A fully featured web framework for Node.js',
  lang: 'pt-BR',
  head: [
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-JSBVEGFEQ9' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-JSBVEGFEQ9');`
    ],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: 'Lucid v 21.x', link: '/docs/lucid/guides/introduction' },
    ],
    returnToTopLabel: 'Retornar ao Topo',
    lightModeSwitchTitle: 'Trocar para tema claro',
    darkModeSwitchTitle: 'Trocar para tema escuro',
    darkModeSwitchLabel: 'Aparência',
    outline: {
      label: 'Nesta página',
      deep: 4
    },
    logo: { light: '/header_logo.svg', dark: '/header_logo_black.svg' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/adonisjs/core' },
    ],
    editLink: {
      pattern: ({ filePath }) => {
        return `https://github.com/tavaresgerson/adonisdocbr/edit/v6.0/src/${filePath}`
      },
      text: 'Corrigir isso no GitHub'
    },
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: 'Página anterior',
      next: 'Próxima página'
    },
    sidebar: sidebar
  },
  markdown: {
    lineNumbers: true
  }
}