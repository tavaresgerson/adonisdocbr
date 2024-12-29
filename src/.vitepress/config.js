import sidebar from "./sidebar";

export default {
    // site-level options
    title: 'Adonis 4.1',
    description: 'Node.js web framework',
    lang: 'pt-BR',
    head: [
      [
        'script',
        { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-LX5RGD8738' }
      ],
      [
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-LX5RGD8738');`
      ],
      ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    ignoreDeadLinks: true,
    themeConfig: {
        returnToTopLabel: 'Retornar ao Topo',
        lightModeSwitchTitle: 'Trocar para tema claro',
        darkModeSwitchTitle: 'Trocar para tema escuro',
        darkModeSwitchLabel: 'Aparência',
        outline: {
            label: 'Nesta página',
            deep: 2
        },
        logo:  { light: '/header_logo.svg', dark: '/header_logo_black.svg' },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/adonisjs/core' },
        ],
        editLink: {
          pattern: ({ filePath }) => {
            return `https://github.com/tavaresgerson/adonisdocbr/edit/v4.1/src/${filePath}`
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
}