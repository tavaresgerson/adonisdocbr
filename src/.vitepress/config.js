import sidebar from "./sidebar";

export default {
    // site-level options
    title: 'Adonis 5.0',
    description: 'A fully featured web framework for Node.js',
    lang: 'pt-BR',
    head: [
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
            return `https://github.com/tavaresgerson/adonisdocbr/edit/v5.0/src/${filePath}`
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