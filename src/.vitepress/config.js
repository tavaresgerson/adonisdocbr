import sidebar from "./sidebar";

export default {
    // site-level options
    title: 'Adonis 3.2',
    description: 'Node.js web framework',
    lang: 'pt-BR',
    head: [
        [
            'link',
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
          ],
          [
            'link',
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
          ],
          [
            'link',
            { href: 'https://fonts.googleapis.com/css2?family=Ubuntu&display=swap', rel: 'stylesheet' }
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